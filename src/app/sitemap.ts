// ─── 自动生成 Sitemap ───
// Next.js 会自动将这个文件的输出渲染为 /sitemap.xml

import type { MetadataRoute } from 'next';
import { getAllSlugs } from '@/data/case-studies';
import { getAllIndustrySlugs } from '@/data/industries';

const BASE_URL = 'https://synthmind.ca';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // 静态页面
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/case-studies`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // 行业页面
  const industryPages: MetadataRoute.Sitemap = getAllIndustrySlugs().map(
    (slug) => ({
      url: `${BASE_URL}/industries/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }),
  );

  // 案例页面
  const caseStudyPages: MetadataRoute.Sitemap = getAllSlugs().map((slug) => ({
    url: `${BASE_URL}/case-studies/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...industryPages, ...caseStudyPages];
}
