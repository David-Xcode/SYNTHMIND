'use client';

// ─── 行业痛点卡片 · Neural ───
// 蓝色编号 / DM Mono 水印 / 冷色基底

import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import SectionTitle from '@/components/shared/SectionTitle';
import type { PainPoint } from '@/data/industries';

interface PainPointsProps {
  painPoints: PainPoint[];
}

export default function PainPoints({ painPoints }: PainPointsProps) {
  return (
    <section className="py-24 bg-bg-surface px-4">
      <div className="max-w-4xl mx-auto">
        <AnimateOnScroll>
          <SectionTitle light="Common" bold="Challenges" eyebrow="Pain Points" />
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {painPoints.map((point, index) => (
            <AnimateOnScroll key={index} delay={index * 80 + 100}>
              <div className="card-surface p-6 rounded-xl h-full relative overflow-hidden">
                {/* DM Mono 大号水印编号 */}
                <span className="absolute top-3 right-4 font-mono text-4xl font-bold text-txt-quaternary/15 leading-none select-none">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="relative">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
                    <span className="font-mono text-sm font-bold text-accent">{index + 1}</span>
                  </div>
                  <h3 className="text-base font-medium text-txt-primary mb-2 tracking-tight">{point.title}</h3>
                  <p className="text-txt-tertiary text-sm leading-relaxed">
                    {point.description}
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
