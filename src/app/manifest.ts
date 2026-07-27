// ─── Web App Manifest ───
// Next 会把本文件输出为 /manifest.webmanifest 并在 <head> 注入 <link rel="manifest">。
//
// 补这份文件的直接动因（2026-07-27 审查）：站点此前只有一个 200KB 的
// icon.jpg（实际是 PNG 数据错标成 JPEG），既没有 apple-touch-icon 也没有
// manifest——iOS 用户「添加到主屏幕」拿到的是网页截图而不是 logo，
// Android 的 PWA 安装提示与主题色也无从取值。
//
// ⚠️ 图标为什么放 public/ 而不是复用 src/app/icon.png：App Router 的约定文件
// 生成的是带内容 hash 的路由（/icon.png?<hash> 之类），manifest 里写死
// `/icon.png` 会 404。manifest 需要稳定 URL，故另放 public/ 两份定尺图。
// 浏览器标签页/iOS 主屏图标仍走约定文件（src/app/icon.png、apple-icon.png），
// 两条路径各司其职，源图相同。

import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Synthmind',
    short_name: 'Synthmind',
    description:
      'Toronto-based software team building AI tools that actually work.',
    start_url: '/',
    display: 'standalone',
    // 与 globals.css 的 --bg-base (#080B10) 同源：安卓启动画面与地址栏
    // 用它，取深色才不会在冷启动瞬间闪白
    background_color: '#080B10',
    theme_color: '#080B10',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
