'use client';

// ─── 客户挑战描述 ───

import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import SectionTitle from '@/components/shared/SectionTitle';

interface ChallengeSectionProps {
  challenges: string[];
}

export default function ChallengeSection({ challenges }: ChallengeSectionProps) {
  return (
    <section className="py-16 bg-gradient-to-b from-[#1a1f2e] to-[#252b3b] px-4">
      <div className="max-w-3xl mx-auto">
        <AnimateOnScroll>
          <SectionTitle light="The" bold="Challenge" />
        </AnimateOnScroll>

        <div className="space-y-6">
          {challenges.map((paragraph, index) => (
            <AnimateOnScroll key={index} delay={index * 100 + 200}>
              <p className="text-gray-300 font-light leading-relaxed">{paragraph}</p>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
