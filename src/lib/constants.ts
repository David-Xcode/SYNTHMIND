// ─── 全站常量 — 单一数据源 ───
// 邮箱与站点 URL 此前散落在 7+6 处硬编码，改动必须同步多处，现统一收拢于此

// canonical 主域用 www（与生产实际 200 的主机一致；apex synthmind.ca 308→www）
export const SITE_URL = 'https://www.synthmind.ca';

export const CONTACT_EMAIL = 'David.wang@synthmind.ca';

// 发信地址 — Resend 已验证的发信域。管理员通知与客户回执共用同一发件人，
// 此前是 route.ts 里的字面量；加第二封信后就会变成两处硬编码，故收拢于此。
// ⚠️ 改这里等于换发信域，必须先在 Resend 后台完成新域的 DNS 验证，否则全部发信失败。
export const MAIL_FROM = 'Synthmind <noreply@synthmind.ca>';

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

// BrokerTool 产品站 — 在建旗舰平台的公开官网（2026-08 上线，品牌名自此公开）。
// InDevelopmentShowcase 入口卡与平台详情页的外链消费；不再进 case-studies
// （它是在建产品，不属于 shipped 口径）
//
// 🔴 品牌名 = 「BrokerTool」，**不带任何后缀**；域名 = brokertool.ca
// （2026-08-04 David 拍板改名 + 换址，spec 93 刀 4）。此前一版口径写的是
// 「只有地址改、产品名仍叫 BrokerTool.ai」——**那条已作废**，别照它推导文案。
// 旧域 `.ai` **已弃用**：不补 301、不续费，官网上任何 `.ai` 外链都是死链。
//
// 主机选 www：产品站全部自指信号都是 www 形态，本仓 12 条出站外链 + SITE_URL
// 亦无一例外，写 apex 会成为全仓唯一的裸 apex。
// ⚠️ 产品站侧仍未做的一件事（属那个仓库，本仓无门可拦）：主机归一——apex 与 www
// 仍都 200 且无 308。若它日后归一到 apex 而非 www，此处需跟着改。
export const BROKERTOOL_URL = 'https://www.brokertool.ca';

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
