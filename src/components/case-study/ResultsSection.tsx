'use client';

// ─── 项目成果 ───

import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import SectionTitle from '@/components/shared/SectionTitle';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

interface ResultsSectionProps {
  results: string[];
}

export default function ResultsSection({ results }: ResultsSectionProps) {
  return (
    <section className="py-16 bg-gradient-to-b from-[#1a1f2e] to-[#252b3b] px-4">
      <div className="max-w-3xl mx-auto">
        <AnimateOnScroll>
          <SectionTitle light="The" bold="Results" />
        </AnimateOnScroll>

        <div className="space-y-4">
          {results.map((result, index) => (
            <AnimateOnScroll key={index} delay={index * 100 + 200}>
              <div className="flex items-start gap-4">
                <CheckCircleIcon className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 font-light leading-relaxed">{result}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
