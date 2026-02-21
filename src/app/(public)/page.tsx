// ─── 首页（重新设计）───
// 从单页滚动布局重构为 Lead Generation 着陆页
// SiteHeader + SiteFooter + ChatButton 由 (public)/layout.tsx 提供

import type { Metadata } from 'next';
import HomeHero from '@/components/home/HomeHero';
import IndustryCards from '@/components/home/IndustryCards';
import FeaturedCaseStudies from '@/components/home/FeaturedCaseStudies';
import SocialProofBar from '@/components/home/SocialProofBar';
import CTABanner from '@/components/shared/CTABanner';

export const metadata: Metadata = {
  title: 'Synthmind | AI-Powered Software for Traditional Industries',
  description:
    'Solo software studio in Toronto building AI tools that actually work. Workflow automation, legacy modernization, and custom AI solutions for insurance, real estate, accounting, and construction.',
  openGraph: {
    title: 'Synthmind | AI Solutions That Actually Work',
    description:
      'Solo software studio building AI tools for traditional industries. No corporate fluff — just working software.',
    url: 'https://synthmind.ca',
    siteName: 'Synthmind',
    locale: 'en_CA',
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <IndustryCards />
      <FeaturedCaseStudies />
      <SocialProofBar />
      <CTABanner headline="Ready to start your AI project?" />
    </>
  );
}
