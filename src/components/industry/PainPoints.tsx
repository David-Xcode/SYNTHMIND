'use client';

// ─── 行业痛点卡片 ───

import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import GlassCard from '@/components/shared/GlassCard';
import SectionTitle from '@/components/shared/SectionTitle';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import type { PainPoint } from '@/data/industries';

interface PainPointsProps {
  painPoints: PainPoint[];
}

export default function PainPoints({ painPoints }: PainPointsProps) {
  return (
    <section className="py-20 bg-gradient-to-b from-[#1a1f2e] to-[#252b3b] px-4">
      <div className="max-w-6xl mx-auto">
        <AnimateOnScroll>
          <SectionTitle light="Common" bold="Challenges" />
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {painPoints.map((point, index) => (
            <AnimateOnScroll key={index} delay={index * 100 + 200}>
              <GlassCard className="h-full">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
                  <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" />
                </div>
                <h3 className="text-white/90 font-medium mb-2">{point.title}</h3>
                <p className="text-gray-400 text-sm font-light leading-relaxed">
                  {point.description}
                </p>
              </GlassCard>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
