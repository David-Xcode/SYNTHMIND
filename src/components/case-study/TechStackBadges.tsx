'use client';

// ─── 技术栈标签 ───

import AnimateOnScroll from '@/components/shared/AnimateOnScroll';

interface TechStackBadgesProps {
  techStack: string[];
}

export default function TechStackBadges({ techStack }: TechStackBadgesProps) {
  return (
    <section className="py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <AnimateOnScroll>
          <h3 className="text-sm text-white/40 uppercase tracking-widest font-light mb-6 text-center">
            Built With
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="text-sm text-white/60 bg-white/5 border border-white/10 px-4 py-2 rounded-lg font-light"
              >
                {tech}
              </span>
            ))}
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
