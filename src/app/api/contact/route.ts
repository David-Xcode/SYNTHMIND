import { type NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { CONTACT_EMAIL, MAIL_FROM } from '@/lib/constants';
import {
  CONTACT_SOURCE,
  EMAIL_REGEX,
  FIELD_LIMITS,
  HONEYPOT_FIELD,
  MIN_SUBMIT_ELAPSED_MS,
} from '@/lib/contact-form';
import { checkCsrf } from '@/lib/csrf';
import {
  renderAdminNotification,
  renderCustomerReceipt,
} from '@/lib/email-templates';

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
//
// 🚨 2026-07-28 起，平台侧限流从「已知不足」升级为**上线前置条件**：
// 客户回执恢复后，每次提交会额外向**提交者自己填写的地址**发一封信。正文已去毒
// （零用户内容回显，见 email-templates.ts 文件头），但「向未经所有权验证的地址
// 自动发信」这个动作本身仍留下三条与正文无关的风险——定向邮件轰炸、收件人投诉
// 打击 synthmind.ca 的发信信誉、Resend 配额双倍消耗。这三条**只能靠跨实例限流
// 压住**，本文件里的 Map 做不到。
// ✅ 2026-07-28 已落地：Vercel Firewall 自定义规则 "Contact form rate limit"
//    （path=/api/contact AND method=POST → rate_limit 3600s / 10 次 / by ip）
//    已 publish 到生产。它是跨实例的真边界，本文件的 Map 只是热实例连点保护。
// ⚠️ 现为 **log 档**：超限只记录、**不阻断**。这是刻意的第一阶段——直接 deny
//    有误伤真客户的风险（同一 NAT 出口、同一办公室多人）。观察一两周真实流量后
//    再把 --rate-limit-action 改成 deny。**在切到 deny 之前，平台侧只是在看，
//    没有在拦**，别把它当已完成的防护。
// 面板：Vercel → synthmind → Firewall → 规则名筛选可看命中流量。
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

// ── 两封信的死线 ──
// 🚨 起因不是「慢」，是 try/catch **接不住「永不返回」**：Resend SDK v4 内部是
// 裸 fetch，不带 timeout 也不带 AbortSignal。这是一类故障，两封信都会中招：
// · 第 2 封挂起 → 函数跑满 maxDuration 或客户端 10s abort 先触发 → 一次**已经
//   成功**的提交变成用户可见的超时失败 → 用户重试 → 你收到两封留言、对方收到
//   两封回执。破的是「回执失败不改变提交成败」。
// · 第 1 封挂起 → 函数被平台杀掉 → catch 不执行、sent 判定不执行、**[LOST_SUBMISSION]
//   兜底日志不执行**、502 也不返回。留言正文没有落进任何地方，Vercel 侧只留一条
//   Task timed out。那条兜底日志正是为「留言不人间蒸发」设计的，在挂起路径上却是
//   空头支票——所以第 1 封的死线比第 2 封更要紧，它保护的是数据不是体验。
// ⚠️ **三项不变量，改任一值前先对齐全部三项**：
//     NOTIFY + RECEIPT  <  maxDuration  <  客户端 abort
// 第三项容易被漏掉，而它恰恰是**最紧的绑定约束**：ContactForm.tsx 的 abort
// 计时从 fetch **之前**起表，因此它买单的不只是服务端执行时间，还有连接建立、
// 边缘路由与**冷启动**——而冷启动通常不计进 maxDuration。6000+2500 相对
// maxDuration 尚余 1.5s，相对一个 10s 的客户端 abort 却会被 2s 冷启动顶穿：
// 用户看到超时失败，而两封信其实都发了 → 重试 → 你收两封、对方收两封。
// 故客户端 abort 现为 15s（那一侧有回指注释）。
const NOTIFY_TIMEOUT_MS = 6000;
const RECEIPT_TIMEOUT_MS = 2500;

/**
 * 给 promise 加死线。超时后原 promise 仍在后台跑（fetch 无法取消）：对第 2 封
 * 可以接受（要么悄悄发出去、要么悄悄失败，都不影响本次成败）；对第 1 封则
 * 保证了兜底日志与 502 一定跑得到。
 * clearTimeout 不可省——留着的 timer 会拖住 event loop，延后函数实例结束。
 * 错误的 `name` 而非 `message` 带标识：errorSummary() 为防 PII 只取 name/statusCode，
 * 标识放 message 里会被丢掉，超时在日志里就与 SDK 任何抛错一字不差 ——
 * 死线会因此失去自我监测能力（Resend p95 漂移时你无从判断该调高哪个值）。
 */
function withDeadline<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () =>
        reject(
          Object.assign(new Error(`deadline exceeded after ${ms}ms`), {
            name: 'DeadlineExceeded',
          }),
        ),
      ms,
    );
  });
  return Promise.race([promise, deadline]).finally(() => clearTimeout(timer));
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

  // ── 发信第 1 封：管理员通知（业务命脉，成败以它为准）──
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
    const result = await withDeadline(
      getResendClient().emails.send({
        from: MAIL_FROM,
        to: [CONTACT_EMAIL],
        subject: mailSubject,
        replyTo: email,
        html,
      }),
      NOTIFY_TIMEOUT_MS,
    );
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
    //
    // ⚠️ **运维口径：这条日志会有假阳性**。死线命中时被放弃的 fetch 仍可能
    // 投递成功，此时留言其实已经在你邮箱里。判据 = 看它前一行：若是
    // `Notification email threw { name: 'DeadlineExceeded' }`，本条只表示
    // **未确认送达**，不表示确实丢了——**人工补救前先查收件箱**，否则会照着
    // 日志把同一条留言再处理一遍、给客户发第二次回复。
    // 偏差方向是刻意的：宁可多报丢失，也不漏报。
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

  // ── 发信第 2 封：客户回执（尽力而为）──
  // 🚨 位置不可上移：必须在管理员通知**确认送达之后**。顺序颠倒会复活
  // 2026-07-27 审查发现 #10 —— 通知失败却已发出「我们已收到您的留言」，
  // 用户被告知送达、你却什么也没收到，三个信号互相矛盾且留言真的丢了。
  //
  // 失败处理刻意与第 1 封不对称：回执发不出去不改变本次提交的成败，只降级
  // 前端文案（不承诺一封根本没发出的确认信）。用 warn 而非 error，因为这不是
  // 需要你介入的故障；也**不写 [LOST_SUBMISSION]** —— 留言此刻已在你邮箱里，
  // 没有任何东西丢失，不该为此再往日志里落一份 PII。
  //
  // 正文零用户内容回显（renderCustomerReceipt 的不变量），故此处向陌生地址发信
  // 不构成可控正文投递面；replyTo 指回 CONTACT_EMAIL，客户直接回复即到你手上。
  let receiptSent = false;
  try {
    const receipt = renderCustomerReceipt({ name });
    const result = await withDeadline(
      getResendClient().emails.send({
        from: MAIL_FROM,
        to: [email],
        replyTo: CONTACT_EMAIL,
        subject: receipt.subject,
        html: receipt.html,
        text: receipt.text,
      }),
      RECEIPT_TIMEOUT_MS,
    );
    if (result.error) {
      console.warn('Receipt email API error', errorSummary(result.error));
    } else {
      receiptSent = !!result.data;
    }
  } catch (err) {
    console.warn('Receipt email threw', errorSummary(err));
  }

  return NextResponse.json({
    success: true,
    message: 'Contact form submitted successfully',
    // 前端据此决定成功态是否承诺「确认信已发出」——机器人路径的 silentSuccess()
    // 不带此字段，因此假成功恒不承诺，无需额外分支。
    // ⚠️ 语义是「已确认发出」而非「已发送」：死线命中后被放弃的 fetch 仍可能
    // 投递成功，此时它是 false 但信到了。偏差方向恒为**少承诺**（用户看中性
    // 文案却收到信，无矛盾），但**不要拿它做统计或去重计数**。
    receiptSent,
  });
}
