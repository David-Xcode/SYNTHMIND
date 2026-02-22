// ─── 技术栈标签 · Neural ───
// DM Mono 标签 / 品牌色 hover / 冷色基底 / 纯 CSS hover（无需 client JS）

import AnimateOnScroll from '@/components/shared/AnimateOnScroll';

interface TechStackBadgesProps {
  techStack: string[];
}

// 外部技术品牌色 — 不属于 Neural 设计系统，是第三方固定色值
const techColors: Record<string, string> = {
  React: '#61dafb',
  'Next.js': '#ffffff',
  'Node.js': '#68a063',
  TypeScript: '#3178c6',
  Python: '#3776ab',
  PostgreSQL: '#336791',
  MongoDB: '#4db33d',
  Redis: '#dc382d',
  AWS: '#ff9900',
  Docker: '#2496ed',
  'Tailwind CSS': '#38bdf8',
  Firebase: '#ffca28',
  Supabase: '#3ecf8e',
  Vercel: '#ffffff',
  Stripe: '#635bff',
  OpenAI: '#10a37f',
  GraphQL: '#e10098',
  Prisma: '#2d3748',
};

export default function TechStackBadges({ techStack }: TechStackBadgesProps) {
  return (
    <section className="py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <AnimateOnScroll>
          <h3 className="font-mono text-xs text-txt-quaternary uppercase tracking-eyebrow font-medium mb-6 text-center">
            Built With
          </h3>
          <div className="flex flex-wrap justify-center gap-2.5">
            {techStack.map((tech) => {
              const brandColor = techColors[tech];
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
