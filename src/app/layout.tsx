import type { Metadata } from 'next';
import { JetBrains_Mono, Manrope, Sora } from 'next/font/google';
import './globals.css';

// Display 字体 — 标题、Hero 大文字 (替代 DM Serif Display)
const sora = Sora({
  weight: ['300', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

// 正文/UI 字体 — 几何人文无衬线 (替代 DM Sans)
const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

// 数据/标签字体 — 编程风格等宽 (替代 DM Mono)
const jetbrainsMono = JetBrains_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://synthmind.ca'),
  title: 'Synthmind | AI-Powered Software Development & Automation',
  description:
    'Toronto-based AI startup building tools that actually work. Specializing in workflow automation, legacy system modernization, and custom AI solutions for traditional industries.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Synthmind | AI Solutions That Actually Work',
    description:
      'AI startup building tools for traditional industries. No corporate fluff — just working software.',
    url: 'https://synthmind.ca',
    siteName: 'Synthmind',
    locale: 'en_CA',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1024,
        height: 541,
        alt: 'Synthmind — AI-Powered Software Development',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Synthmind | AI-Powered Software Development',
    description: 'AI startup building tools that actually work.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sora.variable} ${manrope.variable} ${jetbrainsMono.variable}`}
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
