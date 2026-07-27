// ─── 联系表单校验契约 — 前后端单一数据源 ───
// 此前上限只存在于 route.ts 单侧，客户端比服务端宽松：浏览器放行的输入
// （无 TLD 的邮箱 / 纯空格 / 超长正文）被推迟到服务端才 400，用户白填一遍。
// 这里的常量同时被 ContactForm.tsx（maxLength / pattern / 提交前 trim）与
// route.ts（权威校验）消费——改任一上限只改这一处。

export const FIELD_LIMITS = {
  name: 100,
  // RFC 5321 的地址长度上限
  email: 254,
  subject: 200,
  message: 5000,
} as const;

// 邮箱形态：必须有点号 + ≥2 位 TLD。以字符串形态存放，因为 HTML 的
// pattern 属性只接受字符串（且隐式锚定），服务端再包 ^...$ 编译成 RegExp。
export const EMAIL_PATTERN = '[^\\s@]+@[^\\s@]+\\.[a-zA-Z]{2,}';
export const EMAIL_REGEX = new RegExp(`^${EMAIL_PATTERN}$`);

// 蜜罐字段名 — 真人看不见（aria-hidden + 视觉移出），盲填所有 input 的爬虫会填。
export const HONEYPOT_FIELD = 'company_website';

// 提交耗时下限 — 低于此值视为脚本提交。字段可伪造，只是廉价第一道拦截。
export const MIN_SUBMIT_ELAPSED_MS = 3000;

// 唯一表单来源标识（mini / inline / cta 变体均已在表单 v2 删除）
export const CONTACT_SOURCE = 'contact-page';
