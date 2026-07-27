// ─── 自动生成 Sitemap ───
// Next.js 会自动将这个文件的输出渲染为 /sitemap.xml

import type { MetadataRoute } from 'next';
import { getAllSlugs } from '@/data/case-studies';
import { SITE_URL as BASE_URL } from '@/lib/constants';

// ⚠️ 刻意不输出 lastModified（2026-07-27 审查修复）：此前全部条目填的是
// `new Date()` = **构建时刻**，等于每次部署都向 Google 声明「全站每一页都刚改过」。
// Google 的公开口径是 lastmod 不可信就整体忽略该信号——一个骗人的 lastmod
// 比没有更糟。要恢复它必须有真实的内容修改时间来源（数据层字段或 git mtime），
// 在那之前宁可留空。changeFrequency/priority 同样被 Google 忽略，保留仅为
// 兼容其余爬虫，零成本。

export default function sitemap(): MetadataRoute.Sitemap {
  // 静态页面
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/contact`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/products`, changeFrequency: 'weekly', priority: 0.9 },
    {
      url: `${BASE_URL}/products/brokerage-platform`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/products/real-estate`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // 产品详情页 — 由 case-studies.ts 派生，新增产品自动进 sitemap
  const productPages: MetadataRoute.Sitemap = getAllSlugs().map((slug) => ({
    url: `${BASE_URL}/products/${slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...productPages];
}
