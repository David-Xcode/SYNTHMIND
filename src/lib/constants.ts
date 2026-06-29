// ─── 全站常量 — 单一数据源 ───
// 邮箱与站点 URL 此前散落在 7+6 处硬编码，改动必须同步多处，现统一收拢于此

// canonical 主域用 www（与生产实际 200 的主机一致；apex synthmind.ca 308→www）
export const SITE_URL = 'https://www.synthmind.ca';

export const CONTACT_EMAIL = 'David.wang@synthmind.ca';

// 品牌主色 hex — 邮件 HTML 专用。邮件客户端不支持 CSS 变量 / Tailwind class，
// 必须内联 hex。这是 CLAUDE.md §3「禁止内联 hex」的明确豁免，集中于此与设计 token 同源
// （对应 globals.css 的 --accent 及 btn-primary 渐变），改色时一处即可同步邮件。
export const BRAND_ACCENT = '#4A9FE5';
export const BRAND_ACCENT_DARK = '#3488CC';

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
      url: '/og-image.png',
      width: 1024,
      height: 541,
      alt: 'Synthmind — AI-Powered Software Development',
    },
  ],
};
