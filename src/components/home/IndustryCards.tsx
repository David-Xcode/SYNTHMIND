'use client';

// ─── 行业卡片网格 ───
// 首页展示 4 个行业垂直领域，各链接到对应行业页面

import type { ComponentType, SVGProps } from 'react';
import Link from 'next/link';
import {
  ShieldCheckIcon,
  BuildingOffice2Icon,
  CalculatorIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import SectionTitle from '@/components/shared/SectionTitle';
import { industries } from '@/data/industries';

// 每个行业对应的图标
const industryIcons: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  insurance: ShieldCheckIcon,
  'real-estate': BuildingOffice2Icon,
  'accounting-tax': CalculatorIcon,
  construction: WrenchScrewdriverIcon,
};

export default function IndustryCards() {
  return (
    <section className="py-32 bg-gradient-to-b from-[#252b3b] to-[#1a1f2e]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll>
          <SectionTitle light="Industries We" bold="Serve" />
        </AnimateOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((industry, index) => {
            const IconComponent = industryIcons[industry.slug] || ShieldCheckIcon;
            return (
              <AnimateOnScroll key={industry.slug} delay={index * 100 + 200}>
                <Link href={`/industries/${industry.slug}`} className="block h-full">
                  <div className="glass-card rounded-2xl p-8 h-full text-center group cursor-pointer">
                    <div className="w-14 h-14 rounded-xl bg-[#3498db]/10 border border-[#3498db]/20 flex items-center justify-center mx-auto mb-6 group-hover:bg-[#3498db]/20 transition-colors">
                      <IconComponent className="w-7 h-7 text-[#3498db]" />
                    </div>
                    <h3 className="text-lg font-medium text-white/90 mb-2">
                      {industry.name}
                    </h3>
                    <p className="text-gray-400 text-sm font-light leading-relaxed">
                      {industry.description.slice(0, 120)}...
                    </p>
                    <span className="inline-block mt-4 text-[#3498db] text-sm font-light group-hover:translate-x-1 transition-transform">
                      Learn more &rarr;
                    </span>
                  </div>
                </Link>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
