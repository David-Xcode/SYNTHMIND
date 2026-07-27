import { type NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { CONTACT_EMAIL } from '@/lib/constants';
import {
  CONTACT_SOURCE,
  EMAIL_REGEX,
  FIELD_LIMITS,
  HONEYPOT_FIELD,
  MIN_SUBMIT_ELAPSED_MS,
} from '@/lib/contact-form';
import { checkCsrf } from '@/lib/csrf';
import { renderAdminNotification } from '@/lib/email-templates';

// route segment config — 与 vercel.json 的 functions.maxDuration 同值。
// 写在代码里的这份不会因目录结构变化而失配（vercel.json 按源码路径匹配）。
export const maxDuration = 10;

// ── Resend 客户端：惰性单例 ──
// 惰性是为了构建期不因缺 RESEND_API_KEY 而求值；单例是因为同一实例可复用。
let resendClient: Resend | null = null;
function getResendClient(): Resend {
  if (!resendClient) resendClient = new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}

// ── 内存速率限制 ──
// 🚨 best-effort，**不是安全边界**：Vercel Serverless 上每个实例各持一份 Map，
// 并发扩容 / 冷启动即绕过。它只能挡住「同一热实例上的连点」这一种最廉价的滥用。
// 真正跨实例生效的限流是 Vercel Firewall 的 Rate Limit 规则（项目设置里配，零代码），
// 或 KV/Redis 计数器——两者都未引入，所以不要把这段代码当成防护依据。
const RATE_WINDOW_MS = 60_000;
const RATE_MAX_HITS = 3;
// x-real-ip 缺失时全部请求会挤进同一个 'unknown' 桶（Vercel 恒设该头，此路径
// 只在自托管/换代理时出现）——给它显著更宽松的阈值，避免把所有人一起限死。
const RATE_MAX_HITS_UNKNOWN = 30;
// Map 上限兜底：过期时间戳已在 isRateLimited 里逐 key 惰性清理，这里只防
// 「访问一次后再不访问」的 key 无限累积（原模块作用域 setInterval 在 serverless
// 上几乎跑不到、在 dev HMR 下反而逐次累积，已删除）。
const RATE_MAP_MAX_KEYS = 5_000;
const rateLimitMap = new Map<string, number[]>();

function isRateLimited(ip: string, maxHits: number): boolean {
  const now = Date.now();
  if (rateLimitMap.size > RATE_MAP_MAX_KEYS) rateLimitMap.clear();
  const timestamps = rateLimitMap.get(ip) ?? [];
  // 清除过期记录
  const recent = timestamps.filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= maxHits) return true;
  recent.push(now);
  rateLimitMap.set(ip, recent);
  return false;
}

// 请求体上限 — 在 request.json() 之前按 Content-Length 拒绝。
// 64KB 而非 32KB：合法上限约 5600 字符，全为中文且被 \uXXXX 转义时可达 ~34KB，
// 32KB 会误伤真实提交。
const MAX_BODY_BYTES = 64 * 1024;

/** 只接受字符串，其余（数字/数组/对象/null）一律判为缺失 */
function readString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/** 日志用错误摘要 — 不整体 stringify，避免把提交者邮箱写进 Vercel 日志 */
function errorSummary(err: unknown): { name?: string; statusCode?: number } {
  if (err && typeof err === 'object') {
    const e = err as { name?: string; statusCode?: number };
    return { name: e.name, statusCode: e.statusCode };
  }
  return { name: 'UnknownError' };
}

/** 仅 development 回传给前端的细节，生产恒为 undefined */
function devDetails(err: unknown): string | undefined {
  if (process.env.NODE_ENV !== 'development') return undefined;
  if (err instanceof Error) return err.message;
  // Resend 的 error 是普通对象不是 Error 实例，String() 会得到 "[object Object]"
  if (err && typeof err === 'object') {
    const e = err as { message?: unknown };
    if (typeof e.message === 'string') return e.message;
  }
  return String(err);
}

function badRequest(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status });
}

// 机器人路径统一返回 200 假成功 — 不告诉脚本它被识破了
function silentSuccess() {
  return NextResponse.json({
    success: true,
    message: 'Contact form submitted successfully',
  });
}

export async function POST(request: NextRequest) {
  // CSRF 防护 — 校验 Origin/Referer
  const csrfError = checkCsrf(request);
  if (csrfError) return csrfError;

  // 速率限制 — 在解析 body 之前执行。
  // 仅用 x-real-ip：该头由 Vercel 平台写入真实客户端 IP，客户端无法伪造。
  // 不回退到 x-forwarded-for——它可被客户端伪造，攻击者轮换该头即可获得新桶绕过限流。
  const rawIp = request.headers.get('x-real-ip')?.trim();
  const clientIp = rawIp || 'unknown';
  const maxHits = rawIp ? RATE_MAX_HITS : RATE_MAX_HITS_UNKNOWN;

  if (isRateLimited(clientIp, maxHits)) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': String(RATE_WINDOW_MS / 1000) },
      },
    );
  }

  // ── 请求形态前置校验：畸形请求应得到 4xx，而不是误导性的 500 ──
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return badRequest('Unsupported content type.', 415);
  }
  const declaredLength = Number(request.headers.get('content-length') ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return badRequest('Message is too large.', 413);
  }

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return badRequest('Malformed request body.');
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return badRequest('Malformed request body.');
  }

  // ── 运行时类型收敛 ──
  // TS 的类型注解在运行时是空气：非字符串字段此前会一路抛 TypeError 变成 500/502，
  // 甚至把数组塞给 Resend。下游一律只用这里收敛出的局部变量。
  const name = readString(body.name);
  const email = readString(body.email);
  const subject = readString(body.subject);
  const message = readString(body.message);

  // ── 机器人拦截（廉价第一道，均可伪造，只挡通用爬虫）──
  // ① 蜜罐：真人看不见的字段被填 = 盲填所有 input 的脚本
  if (readString(body[HONEYPOT_FIELD]) !== '') {
    console.warn('[BOT_REJECTED]', { reason: 'honeypot' });
    return silentSuccess();
  }
  // ② 提交耗时：渲染到提交不足 3 秒。字段缺失/非法时**不判定**（老缓存客户端可能不带），
  // 宁可放过也不误杀真实询盘。
  const elapsedMs = body.elapsedMs;
  if (
    typeof elapsedMs === 'number' &&
    Number.isFinite(elapsedMs) &&
    elapsedMs >= 0 &&
    elapsedMs < MIN_SUBMIT_ELAPSED_MS
  ) {
    console.warn('[BOT_REJECTED]', { reason: 'too-fast', elapsedMs });
    return silentSuccess();
  }

  // ── 字段校验：错误文案是给用户看的，必须说清楚哪里不对 ──
  if (!name) return badRequest('Please enter your name.');
  if (!email) return badRequest('Please enter your email address.');
  if (!subject) return badRequest('Please enter a subject.');
  if (!message) return badRequest('Please enter a message.');

  if (name.length > FIELD_LIMITS.name) {
    return badRequest(
      `Name is too long (${FIELD_LIMITS.name} characters max).`,
    );
  }
  if (email.length > FIELD_LIMITS.email) {
    return badRequest('Email address is too long.');
  }
  if (!EMAIL_REGEX.test(email)) {
    return badRequest('That email address does not look valid.');
  }
  if (subject.length > FIELD_LIMITS.subject) {
    return badRequest(
      `Subject is too long (${FIELD_LIMITS.subject} characters max).`,
    );
  }
  if (message.length > FIELD_LIMITS.message) {
    return badRequest(
      `Message is too long (${FIELD_LIMITS.message} characters max).`,
    );
  }

  // source 不再从 body 读取：全站只有一个表单，白名单里的 'contact' / 'cta'
  // 对应的 mini/inline 变体早已删除，客户端传来的值不携带任何信息（且可伪造）。
  // 直接用常量作为管理员邮件里的来源标注。
  const source = CONTACT_SOURCE;

  // 检查 RESEND_API_KEY 是否配置 — 缺失时提前失败，不静默吞错误
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not configured');
    return NextResponse.json(
      {
        success: false,
        error:
          'Our messaging service is temporarily unavailable. Please try again later.',
      },
      { status: 503 },
    );
  }

  // ── 发信：只发管理员通知 ──
  // 面向陌生地址的自动回执已删除（发信中继滥用面的唯一放大器）。
  const { subject: mailSubject, html } = renderAdminNotification({
    name,
    email,
    subject,
    message,
    source,
  });

  let sent = false;
  let failure: unknown = null;
  try {
    const result = await getResendClient().emails.send({
      from: 'Synthmind <noreply@synthmind.ca>',
      to: [CONTACT_EMAIL],
      subject: mailSubject,
      replyTo: email,
      html,
    });
    if (result.error) {
      failure = result.error;
      console.error('Notification email API error', errorSummary(result.error));
    } else {
      sent = !!result.data;
    }
  } catch (err) {
    failure = err;
    console.error('Notification email threw', errorSummary(err));
  }

  if (!sent) {
    // 兜底持久化：Resend 是唯一出口，发不出去这条留言就没有任何人收到。
    // 写进 Vercel 运行日志至少能事后捞回——这是「留言不人间蒸发」压过
    // 「日志不留 PII」的**有意取舍**，仅在通知失败路径触发。
    console.error(
      '[LOST_SUBMISSION]',
      JSON.stringify({
        at: new Date().toISOString(),
        name,
        email,
        subject,
        message,
        source,
      }),
    );
    return NextResponse.json(
      {
        success: false,
        error:
          'We could not deliver your message right now. Please try again in a few minutes.',
        details: devDetails(failure),
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Contact form submitted successfully',
  });
}
