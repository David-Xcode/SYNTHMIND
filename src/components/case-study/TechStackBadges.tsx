// ─── 技术栈标签 · Neural ───
// DM Mono 标签 / 品牌色 hover / 冷色基底 / 纯 CSS hover（无需 client JS）

import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import Eyebrow from '@/components/shared/Eyebrow';
import { TECH_BRAND_COLORS } from '@/lib/tech-brand-colors';

interface TechStackBadgesProps {
  techStack: string[];
}

export default function TechStackBadges({ techStack }: TechStackBadgesProps) {
  return (
    <section className="py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <AnimateOnScroll>
          {/* h2 而非 h3：本块是与 Challenge/Solution/Results 平级的顶层 section，
              视觉小标样式由内层 Eyebrow 控制，标题级别只用于正确的文档大纲 */}
          <h2 className="mb-6 text-center">
            <Eyebrow>Built With</Eyebrow>
          </h2>
          <div className="flex flex-wrap justify-center gap-2.5">
            {techStack.map((tech) => {
              const brandColor = TECH_BRAND_COLORS[tech];
              return (
                <span
                  key={tech}
                  className="text-sm text-txt-tertiary hover:text-txt-primary bg-bg-elevated border border-accent/[0.12] hover:border-[var(--brand-border,var(--border-heavy))] px-4 py-2 rounded-lg transition-all duration-300 cursor-default"
                  style={
                    brandColor
                      ? ({
                          '--brand-border': `${brandColor}33`,
                        } as React.CSSProperties)
                      : undefined
                  }
                >
                  {tech}
                </span>
              );
            })}
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
