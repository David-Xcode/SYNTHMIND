// ─── 全站常量 — 单一数据源 ───
// 邮箱与站点 URL 此前散落在 7+6 处硬编码，改动必须同步多处，现统一收拢于此

// canonical 主域用 www（与生产实际 200 的主机一致；apex synthmind.ca 308→www）
export const SITE_URL = 'https://www.synthmind.ca';

export const CONTACT_EMAIL = 'David.wang@synthmind.ca';

// 服务行业数 — about stats 与首页信任带图签同源（此前两处各自硬编码 '4'）。
// 口径 = insurance / real estate / accounting & tax / construction，可与
// contact FAQ 交叉验证；产品卡的 industry 眉标是展示标签，不是这份清单的计数源
// （easy-sign 面向 small business 属横向，不构成第五个行业）
export const INDUSTRIES_SERVED = 4;

// 品牌主色 hex — 邮件 HTML 专用。邮件客户端不支持 CSS 变量 / Tailwind class，
// 必须内联 hex。这是 CLAUDE.md §3「禁止内联 hex」的明确豁免，集中于此与设计 token 同源
// （对应 globals.css 的 --accent 及 btn-primary 渐变），改色时一处即可同步邮件。
export const BRAND_ACCENT = '#4A9FE5';
export const BRAND_ACCENT_DARK = '#3488CC';

// CSIO 官方外链 — CsioMemberRow（身份行）与平台详情页的引用块消费
// 会员名录 = 可验证的会员身份；新闻稿 = 2026-07-21 七家新会员欢迎稿（含对
// Synthmind 的一句话官方定位，页面引用块原句不改写）
export const CSIO_DIRECTORY_URL =
  'https://csio.com/membership/member-directory';
export const CSIO_PRESS_RELEASE_URL =
  'https://csio.com/news/csio-welcomes-seven-new-members-help-advance-industry-standards-and-connectivity';

// Open Graph 基础字段 — 单一数据源
// Next 的 metadata 合并是「同名键整块覆盖」而非深合并：每个 page 的 openGraph
// 只写 title/description 会把根 layout 的 image/url/siteName/locale 全部清掉。
// 故每页都 spread 此基底，仅覆写 title/description（详情页另覆写 type/url）。
export const BASE_OPEN_GRAPH = {
  siteName: 'Synthmind',
  locale: 'en_CA',
  type: 'website' as const,
  url: SITE_URL,
  images: [
    {
      // JPEG 而非 PNG：同尺寸 490KB → 137KB。WhatsApp 的 OG 抓取上限约 300KB，
      // 超限直接不出预览；1200×630 是 LinkedIn/Facebook large card 的建议尺寸，
      // 旧的 1024×541 会被降级成小卡（2026-07-27 审查修复）
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Synthmind — AI-Powered Software Development',
    },
  ],
};
