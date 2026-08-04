import type { Metadata, Viewport } from 'next';
import { Archivo, IBM_Plex_Mono, Manrope } from 'next/font/google';
import { BASE_OPEN_GRAPH, SITE_URL } from '@/lib/constants';
import './globals.css';

// themeColor 属 viewport 而非 metadata（Next 14 起拆分，写在 metadata 里会被
// 忽略并告警）。取 --bg-base #080B10：移动端浏览器地址栏/状态栏跟着变深，
// 页面与系统 UI 之间不再有一条亮边（2026-07-27 审查修复，此前完全缺失）
export const viewport: Viewport = {
  themeColor: '#080B10',
  colorScheme: 'dark',
};

// Display 字体 — 标题、Hero 大文字（Blueprint 制图气质）
// variable font 含 wdth 宽度轴，大标题配 .stretch-wide 用宽体
const archivo = Archivo({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  axes: ['wdth'],
});

// 正文/UI 字体 — 几何人文无衬线（可读性资产，保留）
const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

// 标注/图签字体 — 工程文档血统等宽（图签编号、测量标注）
const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Synthmind | AI-Powered Software Development & Automation',
  description:
    'Toronto-based software team building AI tools that actually work. Specializing in workflow automation, legacy system modernization, and custom AI solutions for traditional industries.',
  // ⚠️ 根 layout 刻意不声明 alternates.canonical：写死 '/' 会让任何未覆写
  // alternates 的页面（含 404）静默 canonical 到首页——新增页面忘写就把全部
  // 权重让给首页，Google 当副本合并，且编译期查不出。canonical 由各 page 自报，
  // 无声明时 Next 不输出该标签（不输出好过输出错的）。2026-07-27 审查修复
  // Google Search Console 站点所有权验证 — 渲染 <meta name="google-site-verification">
  verification: {
    google: 'ygG1JvdzdlzTjU3ruttowjnXPMbV_VIJdUKXsvX1CLk',
  },
  openGraph: {
    ...BASE_OPEN_GRAPH,
    title: 'Synthmind | AI Solutions That Actually Work',
    description:
      'Working software for traditional industries — workflow automation, legacy modernization, and custom AI.',
  },
  // 🔴 **只声明 card,不重复 title/description/image**:X 在缺 `twitter:*` 时
  // **会 fallback 到对应的 `og:*`**。此前两套都写,结果是每个页面只覆写 openGraph、
  // twitter 整块继承根 layout —— 实测 /about、/products、产品详情页等**六个页面**
  // 分享到 X 全都显示首页的通用标题。删掉重复字段后,各页自动跟着**自己的** og 走,
  // 既少一半标签,也不再有"新页面漏写 twitter"这个失效模式。
  // `card` 是唯一不可省的——没它 X 默认用小图卡 `summary` 而非大图卡。
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${archivo.variable} ${manrope.variable} ${ibmPlexMono.variable}`}
    >
      <body className="font-sans antialiased" suppressHydrationWarning>
        {/* 微信 WebView 兼容性修复 — MutationObserver 实时拦截 */}
        {/* 微信会在 DOM 解析期间修改元素属性(style/class)，早于 React hydration */}
        {/* MutationObserver 在文档解析最早期注册，实时捕获并恢复微信对 img/video 的修改 */}
        {/* 检查 style.color !== 'transparent' 防止修正操作触发无限循环 */}
        {/* 8s 后自动断开 — hydration 通常 <3s 完成 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(!/MicroMessenger/i.test(navigator.userAgent))return;var f=function(i){if(i.tagName==='IMG'&&i.style.color!=='transparent')i.style.color='transparent'};var o=new MutationObserver(function(l){l.forEach(function(m){if(m.type==='attributes'){f(m.target)}else if(m.type==='childList'){m.addedNodes.forEach(function(n){if(n.nodeType===1){f(n);n.querySelectorAll&&n.querySelectorAll('img').forEach(f)}})}})});o.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['style']});setTimeout(function(){o.disconnect()},8000)}catch(e){}})();`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
