// ─── 邮件 HTML 模板 — 从 route.ts 抽出 ───
// route.ts 只负责「校验 + 编排」，模板与转义收在这里：escapeHtml 的调用点
// 曾散落在模板字面量中间，漏一个不易发现。
// 品牌色按 CLAUDE.md §4 豁免从 constants.ts 取（邮件客户端不认 CSS 变量 /
// Tailwind class，必须内联 hex），模板内不得写字面 hex 品牌色。
//
// ─── 回执的历史与现行纪律（改本文件前必读）───
// 2026-07-27：面向陌生收件人的自动回执被整体删除。当时的判断没错，但归因值得
// 精确化——危险的不是「发给了陌生人」，而是**旧模板把提交者写的 Subject 与
// Message 原样印进正文**：escapeHtml 挡住了标签注入，却挡不住「用已验证的
// noreply@synthmind.ca 向任意地址投递 5000 字攻击者可控文本」。回执因此成为
// 发信中继的放大器。
//
// 2026-07-28：回执以**去毒**形态恢复（见 renderCustomerReceipt）。
// 🚨 恢复的前提是一条不可让步的不变量：
//     **回执正文不得回显任何用户提交的内容。**
// 唯一例外是称呼里的名字，且必须经 safeGreetingName 的白名单过滤（比 escapeHtml
// 严得多）。攻击者最多能让某人收到一封语义固定的品牌确认信——骚扰，而非投递。
// 新增任何「把用户输入放进回执」的字段（哪怕只是 subject 回显）都会直接
// 复活这个滥用面，属于设计层面的回退，不是可以权衡的细节。

import { BRAND_ACCENT, BRAND_ACCENT_DARK } from '@/lib/constants';
import { FIELD_LIMITS } from '@/lib/contact-form';

/** 防止 HTML 注入 — 用户输入插入邮件模板前必须转义 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** 邮件主题行专用 — 剥离换行/制表，避免主题被折成多行 */
function sanitizeSubjectLine(str: string, max: number): string {
  return str.replace(/[\r\n\t]/g, ' ').slice(0, max);
}

/**
 * 回执称呼专用的名字过滤 — 白名单，不是转义。
 *
 * 两者的目标不同，不能互相替代：escapeHtml 保证文本无法变成标签（够用于
 * **管理员**通知，因为收件人是你自己，看到垃圾内容无所谓）；这里要保证攻击者
 * 连「一段可读的话」都塞不进**陌生人**的收件箱，所以只放行真正像名字的东西。
 *
 * 规则：NFC 归一 → 智能引号折叠 → 取第一个词 → 长度上限按书写系统分档 →
 * 首字符必须是字母 → 只允许 Unicode 字母 + 组合记号 + 连字符 + 撇号 →
 * 分隔符样字符（含 \p{Lm}）合计至多 1 个 → 连续组合记号至多 2 个 →
 * 拒绝 Default_Ignorable_Code_Point。
 * 通过：David / O'Brien / Anne-Marie / 张伟 / Nguyễn / 김민준 / கார்த்திகேயன்。
 * 拒绝：含空格的句子、URL、数字、@、任何标点 —— 一律退化为通用称呼。
 *
 * 🚨 五条设计判据，每一条都是被实测推翻过一次才定下来的，别顺手合并回简单形式：
 *
 * ① **上限按书写系统分档，判据是白名单不是黑名单**：「只取第一个词」这条防御
 *    依赖 split 能把句子切开。切不开的文字里，一整句话仍是一个「词」——给到
 *    32 码位时攻击者能塞进一条完整钓鱼指令（"你的账户已被冻结请点击…"）。
 *
 *    🚨 **判据的准确表述 = 「用空格分词 且 单码位信息密度低」**，两个条件缺一
 *    不可，别简化成「有没有空格」：**韩文恰恰用空格分词**（띄어쓰기），却必须
 *    留在 8 档——Hangul 的 NFC 一个音节就是一个码位，32 码位 = 32 个音节 =
 *    一整句韩文。照「有空格就给 32」的字面执行会得出「把 Hangul 挪到 32 档」
 *    这个**不安全**结论。印度系文字方向相反：每个连字要 virama、每个元音要
 *    独立符号，`கார்த்திகேயன்`(Karthikeyan) 就有 13 个码位——密度低，给 32 才够用。
 *
 *    🚨 方法层面踩过一次坑：最初**列举**无空格文字（CJK → 再补泰/老/高棉/
 *    缅甸/藏），实测被 Tai Tham 兰纳文一击穿透——Unicode 里切不开的文字有
 *    几十种（Javanese/Balinese/Cham/Shan…），黑名单永远追不完。现改为白名单，
 *    未列举的文字自动落进严格档 = fail-safe。安全过滤器的默认分支必须指向更严。
 *    严格档 8（复姓+双名如「爱新觉罗溥仪」6 字，留 2 字余量）。
 *
 * ② **分隔符样字符合计至多 1 个，且按「类」计数不按字面枚举**：`-` 在字符类里
 *    是合法字符，于是它成了事实上的分词符——`Your-account-has-been-suspended`
 *    31 字符全部合规，能在 32 档里写完一句可读的话。此前「32 字符拉丁 camelCase
 *    几乎不成句」的论证**是错的**。
 *    🚨 只数 ASCII 的 `-` 和 `'` 也**不够**：`\p{Lm}` 里有一批**本身就是字母**、
 *    渲染却是撇号或长横的码位（U+02BC ʼ / U+02BB ʻ / U+02C8 ˈ / U+30FC ー…），
 *    它们穿得过字符白名单、拿得到 32 档、又不被 ASCII 计数拦住，
 *    `YourˈaccountˈhasˈbeenˈlockedOK` 28 码位即可成句。故按 `[-'\p{Lm}]` 计数。
 *    代价两条，均可接受（失败方向都是退化为通用称呼）：`Anne-Marie-Claire`
 *    这类双分隔符复合名被拒；含两个长音的片假名名（`ルーシー`）被拒。
 *
 *    🚨🚨 **本条到此为止，别再往下追——已知且刻意接受的残余在这里**：
 *    分隔符上限消除的只是「带标点、最像自然句子」的形态，**消除不了可读性本身**。
 *    `YourAccountHasBeenLockedNow` 27 码位、零分隔符，照样人眼可读；同类还有
 *    U+A78C ꞌ(Ll) / U+01C0 ǀ / U+01C3 ǃ(Lo) 这些类标点字母（不属 Lm，逃过计数）。
 *    但堵掉它们**不改变可达到的可读性上限**，因为驼峰已经在同一水平线上——
 *    这是又一台枚举跑步机，边际收益为零。
 *    **残余的准确表述**：攻击者能在陌生人收件箱的称呼行放约 30 个字符的
 *    **不可点击、不可拨打**文本。这条边界由字符白名单硬保证（`.` `/` `:` `@`
 *    与全部数字被拒 ⇒ 拼不出可 linkify 的 URL、也拼不出可 tap-to-call 的号码），
 *    它才是真正的护栏。想进一步压缩只能缩短档位长度，而任何容得下真名的长度
 *    （`YouWonAPrize` 只要 12 码位）都消除不掉它。**接受它，不要再改计数。**
 *
 * ③ **首字符必须是字母 + 连续组合记号 ≤2**：否则 `-----------` 与单个 U+0301
 *    都能通过，后者会与 "Hi " 的空格结合渲染；组合记号无限堆叠（zalgo）在部分
 *    邮件客户端里会溢出行高。
 *
 * ④ **拒绝 Default_Ignorable_Code_Point**：`\p{L}` 里存在**渲染为空白**的字母，
 *    典型是 U+3164 HANGUL FILLER（Lo 类，正是它被拿去做「隐形用户名」）。
 *    `Buy` + U+3164 + `now` 只有 7 个码位，却渲染成「Buy now」——在 8 档预算内
 *    伪造出词间空隙，等于绕开了整条「只取第一个词」的防御。该属性一并覆盖
 *    U+115F/U+1160/U+FFA0 三个同类 filler 与零宽字符，实测不误伤任何正常字母。
 *
 * ⑤ **智能标点折叠**：iOS/macOS 的 Smart Punctuation **默认开启**，在输入框里
 *    把 `'` 实时换成 U+2019（`Pf` 类，不在字符白名单内）——不折叠的话，
 *    在 iPhone 上填表的 O'Brien 本人会被整个拒掉。爱尔兰姓氏在加拿大客户群里
 *    不是边缘案例。折叠回 ASCII 撇号后，它同时被 ② 的分隔符计数正常约束。
 *
 * 注：NFC 归一是为了让 `.length` 的语义对所有文字稳定——NFD 形态的「김민준」
 * 会分解成 9 个谚文字母，在 8 档下被误拒。
 */
// ⚠️ Common / Inherited 必须写成 `Script=` 形式：它们是 Script 属性的**值**，
// 不是二进制属性，写作 `\p{Common}` 会在**运行时**抛 SyntaxError —— 而 tsc /
// biome / next build 全都发现不了（正则由 V8 运行时编译，且本路由是 dynamic，
// 构建期不加载此模块）。含 \p{...} 的正则必须真实执行过一次才算验证。
// 这两项是必需的：撇号与连字符属 Common，组合记号（José 的 U+0301）属 Inherited，
// 少了它们这两类名字会被误判、落进 8 档。
// 印度系文字整族在列：它们都用空格分词且单码位密度低（每个连字要 virama、
// 每个元音要独立符号，见 ①），漏掉会让孟加拉/泰米尔/泰卢固等姓名（普遍
// 9-13 码位）在 8 档下集体退化成通用称呼。
// ⚠️ **Ethiopic 刻意不在此列**：阿姆哈拉语虽用词间空格，但它是音节文字、
// 一个码位一个 CV 音节，密度与 Hangul 同级——按 ① 的两段式判据应落严格档。
// 零代价：阿姆哈拉人名（ኃይለ 3 / ተስፋዬ 4 / መንግስቱ 5 码位）全装得进 8 档。
// 留一个违反判据的反例在这里，等于授权后人反向推理把 Hangul 挪进 32 档。
const LOW_DENSITY_SCRIPT_RE =
  /^[\p{Script=Latin}\p{Script=Cyrillic}\p{Script=Greek}\p{Script=Armenian}\p{Script=Georgian}\p{Script=Hebrew}\p{Script=Arabic}\p{Script=Devanagari}\p{Script=Bengali}\p{Script=Gurmukhi}\p{Script=Gujarati}\p{Script=Oriya}\p{Script=Tamil}\p{Script=Telugu}\p{Script=Kannada}\p{Script=Malayalam}\p{Script=Sinhala}\p{Script=Thaana}\p{Script=Common}\p{Script=Inherited}]+$/u;

function safeGreetingName(raw: string): string | null {
  // 弯引号写成转义而非字面量：它与 ASCII ' 在等宽字体里几乎无法目视区分，
  // 审查者看不出字面量里到底是哪个码位；某个 codemod 或编辑器设置把它规范化
  // 成 ASCII 时，这行会**静默失效**（O'Brien 又开始被拒），而本项目零测试框架。
  const first =
    raw
      .normalize('NFC')
      .replace(/[\u2018\u2019]/gu, "'")
      .trim()
      .split(/\s+/)[0] ?? '';
  if (!first) return null;
  if (first.length > (LOW_DENSITY_SCRIPT_RE.test(first) ? 32 : 8)) return null;
  if (!/^\p{L}/u.test(first)) return null;
  if (!/^[\p{L}\p{M}'-]+$/u.test(first)) return null;
  if ((first.match(/[-'\p{Lm}]/gu)?.length ?? 0) > 1) return null;
  if (/\p{M}{3,}/u.test(first)) return null;
  if (/\p{Default_Ignorable_Code_Point}/u.test(first)) return null;
  return first;
}

/** 品牌头 — 唯一实现，改品牌样式只改这里 */
function brandHeader(title: string, caption: string): string {
  return `
      <div style="background: linear-gradient(135deg, ${BRAND_ACCENT}, ${BRAND_ACCENT_DARK}); padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 600;">${title}</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">${caption}</p>
      </div>`;
}

export interface AdminNotificationInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  source: string;
}

export interface RenderedEmail {
  subject: string;
  html: string;
  /**
   * 纯文本备份。只有**发给陌生收件人**的邮件需要：纯 HTML 无 text 部分是
   * SpamAssassin 的 MIME_HTML_ONLY 命中项（约 +1 分），而本域发信量极小、
   * 对投诉与垃圾评分格外敏感（见文件头）。管理员通知不提供——收件人是自己，
   * 早已在白名单内，垃圾评分对它没有实际影响。
   */
  text?: string;
}

/** 管理员通知邮件 — 全站唯一对外发信模板 */
export function renderAdminNotification(
  input: AdminNotificationInput,
): RenderedEmail {
  const safeName = escapeHtml(input.name);
  const safeEmail = escapeHtml(input.email);
  const safeSubject = escapeHtml(input.subject);
  const safeMessage = escapeHtml(input.message);
  const safeSource = escapeHtml(input.source);
  const receivedAt = new Date().toLocaleString('en-US', {
    timeZone: 'America/Toronto',
  });

  return {
    subject: `[Website Contact] New message from ${sanitizeSubjectLine(input.name, FIELD_LIMITS.name)}`,
    html: `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 700px; margin: 0 auto;">
      ${brandHeader('New Website Contact Form Submission', 'from synthmind.ca')}

      <div style="background-color: white; padding: 30px; border: 1px solid #e8eaed;">
        <div style="background-color: #f8f9ff; padding: 25px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid ${BRAND_ACCENT};">
          <h2 style="color: ${BRAND_ACCENT}; margin: 0 0 20px 0; font-size: 20px;">Contact Information</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
          <p><strong>Subject:</strong> ${safeSubject}</p>
          <p><strong>Source:</strong> ${safeSource}</p>
          <p><strong>Time:</strong> ${receivedAt}</p>
        </div>

        <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; border: 1px solid #e8eaed;">
          <h3 style="color: #202124; margin: 0 0 15px 0; font-size: 18px;">Message Content</h3>
          <div style="background-color: white; padding: 20px; border-radius: 6px; border: 1px solid #dadce0;">
            <p style="margin: 0; color: #202124; line-height: 1.6; white-space: pre-wrap; font-size: 15px;">${safeMessage}</p>
          </div>
        </div>

        <div style="margin-top: 30px; text-align: center;">
          <a href="mailto:${safeEmail}?subject=${encodeURIComponent(`Re: ${input.subject}`)}"
             style="display: inline-block; background: linear-gradient(135deg, ${BRAND_ACCENT}, ${BRAND_ACCENT_DARK}); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: 600;">
            Reply to Customer
          </a>
        </div>
      </div>
    </div>`,
  };
}

/**
 * 客户回执 — 发给填表人本人的确认信。
 *
 * 🚨 入参只有 name，且这**不是可以随手放宽的签名**：它就是「正文零回显」这条
 * 不变量在类型层面的体现。要加 subject / message 参数前，先回到文件头的纪律。
 *
 * 其余设计取舍：
 * · 主题行固定 —— 主题同样是投递面，不能带用户内容
 * · 正文不写 CONTACT_EMAIL 字面 —— 站上已撤下邮箱展示（ContactForm 头注释），
 *   回信通道由发信时的 replyTo 承载，不在 HTML 里留一份给爬虫
 * · 「误收可忽略」一句是刻意的 —— 万一有人被冒填地址，它能显著降低对方
 *   直接点「举报垃圾邮件」的概率。小发信量域名对投诉率极敏感（一天几封的
 *   分母下，单次投诉就是两位数百分比），这句话是在保护域名信誉
 * · 24 小时口径与站内三处文案（contact/page.tsx ×2、ContactForm 成功态）同源，
 *   改承诺时四处一起改
 */
export function renderCustomerReceipt(input: { name: string }): RenderedEmail {
  const greetName = safeGreetingName(input.name);
  // 已过白名单仍套 escapeHtml：纵深防御，且避免「这里免转义」成为后人放宽过滤的借口
  const greeting = greetName ? `Hi ${escapeHtml(greetName)},` : 'Hi there,';
  // 纯文本分支**不转义** —— text/plain 里 &#39; 会原样显示给用户。
  // 安全性由 safeGreetingName 的白名单承担（HTML 转义在纯文本里本就无意义）。
  const greetingText = greetName ? `Hi ${greetName},` : 'Hi there,';

  return {
    // 主题行保留真实 em dash，正文却写 &mdash; —— 这个不对称是**成本驱动**的，
    // 不是两套风险判断：主题走 MIME encoded-word（RFC 2047，协议层保证，且
    // 纯文本用不了 HTML 实体）；正文是 HTML **片段**，塞不进 <meta charset>，
    // 完全依赖客户端遵守 Content-Type，而 Outlook 系在这件事上历来不可靠。
    // 固定文案实体化是顺手的零成本保险；动态内容（称呼里的中文名/José）不做
    // 实体化——那要额外的转换函数与测试，而 Resend 恒设 charset=utf-8，收益不抵成本。
    subject: 'We received your message — Synthmind',
    html: `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      ${brandHeader('Message Received', 'Synthmind')}

      <div style="background-color: white; padding: 30px; border: 1px solid #e8eaed; border-top: none;">
        <p style="color: #202124; font-size: 16px; margin: 0 0 20px 0;">${greeting}</p>

        <p style="color: #3c4043; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
          Thanks for reaching out. Your message is with our team, and you&#39;ll hear
          back from a real inbox within 24 hours.
        </p>

        <p style="color: #3c4043; font-size: 15px; line-height: 1.6; margin: 0 0 25px 0;">
          Anything to add in the meantime? Just reply to this email &mdash; it comes
          straight to us.
        </p>

        <div style="border-top: 1px solid #e8eaed; padding-top: 20px; margin-top: 25px;">
          <p style="color: #5f6368; font-size: 13px; line-height: 1.5; margin: 0 0 15px 0;">
            If you didn&#39;t contact Synthmind, you can safely ignore this email &mdash;
            we will not add you to any list.
          </p>
          <p style="color: ${BRAND_ACCENT}; font-weight: 600; font-size: 14px; margin: 0;">
            The Synthmind Team
          </p>
        </div>
      </div>
    </div>`,
    // 纯文本备份必须与 HTML **语义一致**（不一致本身就是垃圾评分特征）。
    // 破折号用 ASCII hyphen：纯文本没有实体可用，ASCII 在任何 charset 下都对。
    text: [
      greetingText,
      '',
      "Thanks for reaching out. Your message is with our team, and you'll hear back from a real inbox within 24 hours.",
      '',
      'Anything to add in the meantime? Just reply to this email - it comes straight to us.',
      '',
      "If you didn't contact Synthmind, you can safely ignore this email - we will not add you to any list.",
      '',
      'The Synthmind Team',
    ].join('\n'),
  };
}
