/** @type {import('next').NextConfig} */

// ─── 安全响应头 ───
// 2026-07-27 从 src/proxy.ts（Next 16 的 middleware 约定文件）迁入此处并删除该文件：
// 全站 16 页全部静态预渲染，为几个**恒定**的 header 让每个 HTML 请求都多跑一趟
// Node middleware（冷启动 + 延迟 + 计费）不划算。next.config 的 headers() 由平台
// 在边缘直接附加，静态命中零函数调用。行为等价，覆盖面反而更全（proxy 的 matcher
// 曾把图片扩展名整体排除在外，图片响应上连 nosniff 都没有）。
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  // 🚨 script-src 的 'unsafe-inline' 去不掉：站点是 SSG，HTML 在构建时烘焙，
  // 无法注入 per-request nonce；且 Next App Router 自身把 RSC flight 数据
  // (self.__next_f.push) 作为内联 <script> 写进每张静态 HTML——即使把
  // layout.tsx 的微信 WebView 修复脚本外置也仍然需要它。这是 SSG + App Router
  // 的结构性约束，不是疏漏。当前站内无任何「用户输入进 HTML」的注入 sink
  // （联系表单只出邮件且全程 escapeHtml），故属纵深防御缺口而非可利用漏洞。
  "script-src 'self' 'unsafe-inline'",
  // style-src 同理：全站大量 style={{}} 内联样式（XSS 面远小于 script）
  "style-src 'self' 'unsafe-inline'",
  // 站内图片全部自托管于 public/，无 images.remotePatterns —— 收紧掉 https:，
  // 断掉「注入点用 <img src=https://evil/?data=…> 外带数据」这条路
  "img-src 'self' data:",
  "font-src 'self'",
  "media-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ')

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Content-Security-Policy', value: CONTENT_SECURITY_POLICY },
  // 关闭本站不使用的强能力 API（interest-cohort 已随 FLoC 下线，不写——
  // 现代等价物是 browsing-topics）
  {
    key: 'Permissions-Policy',
    value:
      'camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), midi=(), xr-spatial-tracking=(), browsing-topics=()',
  },
  // 被 window.open 打开时切断与 opener 的 browsing context group（XS-Leaks 面）
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  // CORP 只对**浏览器**的跨源 no-cors 子资源加载生效：会挡住外站热链我们的图片，
  // 但社交平台抓 OG 图走的是服务端 HTTP 请求，不受影响
  { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
]

// HSTS 只在生产下发（本地 http 开发不受影响；浏览器在 http 上本就忽略该头，
// 这里保留判断是为了不给本地 https 代理留坑）
if (process.env.NODE_ENV === 'production') {
  securityHeaders.push({
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  })
}

const nextConfig = {
  // 不白送框架指纹（默认会下发 X-Powered-By: Next.js）
  poweredByHeader: false,
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      // ─── public/ 静态资源缓存 ───
      // 🚨 刻意**不用** immutable / max-age=1年：`/_next/static/*` 的 URL 带内容
      // hash，改文件即换 URL，所以 Next 默认给它 immutable 是安全的；而 public/
      // 下的路径是裸文件名（/og-image.jpg、/product/getax.png），改图不改名 ——
      // 打上 immutable 等于让已访问过的用户在缓存过期前**永远看不到新图**，
      // 且没有任何补救手段（除非改文件名）。
      // 折中：1 小时新鲜期消掉同一次浏览内的重复请求，7 天 SWR 让回访者先拿旧图
      // 再后台更新 —— 改图后最迟下一次访问就能看到新的。
      {
        source: '/:all*(png|jpg|jpeg|svg|webp|avif|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=604800',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      // 路由重命名：case-studies → products
      { source: '/case-studies', destination: '/products', permanent: true },
      { source: '/case-studies/:slug', destination: '/products/:slug', permanent: true },
      // 地产盘旧详情页已打包为聚合详情页 /products/real-estate；
      // avella/rosaleen 从未有过详情页，但补上让 5 盘 slug 空间统一可解析（防猜测 URL 404）
      { source: '/products/unionglens', destination: '/products/real-estate', permanent: true },
      { source: '/products/woodbine-parkside', destination: '/products/real-estate', permanent: true },
      { source: '/products/kingshaven', destination: '/products/real-estate', permanent: true },
      { source: '/products/avella', destination: '/products/real-estate', permanent: true },
      { source: '/products/rosaleen', destination: '/products/real-estate', permanent: true },
      // 已删除路由：industries → products 列表页
      // 旧 slug (insurance, real-estate, accounting-tax, construction) 无对应 product，统一到列表页
      { source: '/industries', destination: '/products', permanent: true },
      { source: '/industries/:path*', destination: '/products', permanent: true },
      // 已移除的 admin 后台
      { source: '/admin', destination: '/', permanent: true },
      { source: '/admin/:path*', destination: '/', permanent: true },
    ];
  },
}

module.exports = nextConfig
