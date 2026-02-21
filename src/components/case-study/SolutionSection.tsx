'use client';

// ─── Synthmind 的解决方案 ───

import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import SectionTitle from '@/components/shared/SectionTitle';

interface SolutionSectionProps {
  solutions: string[];
}

export default function SolutionSection({ solutions }: SolutionSectionProps) {
  return (
    <section className="py-16 bg-gradient-to-b from-[#252b3b] to-[#1a1f2e] px-4">
      <div className="max-w-3xl mx-auto">
        <AnimateOnScroll>
          <SectionTitle light="The" bold="Solution" />
        </AnimateOnScroll>

        <div className="space-y-6">
          {solutions.map((paragraph, index) => (
            <AnimateOnScroll key={index} delay={index * 100 + 200}>
              <p className="text-gray-300 font-light leading-relaxed">{paragraph}</p>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
