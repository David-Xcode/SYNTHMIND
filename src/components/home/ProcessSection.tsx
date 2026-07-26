// ─── 首页流程板块 · Blueprint ───
// Draft → Build → Ship：真实工作次序 — 编号在此有序列语义（图纸阶段叙事）
// 每列顶部 hairline + mono 阶段号，制图台面感

import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import SectionTitle from '@/components/shared/SectionTitle';

const steps = [
  {
    no: '01',
    title: 'Draft',
    copy: 'We map your workflow before writing code. You approve the blueprint — scope, screens, and what “done” means — first.',
  },
  {
    no: '02',
    title: 'Build',
    copy: 'Working software in weeks. You watch it take shape on a live URL, not in a slide deck.',
  },
  {
    no: '03',
    title: 'Ship',
    copy: 'We deploy, train your team, and stay on call. The project ends when your day runs on it — not when the invoice clears.',
  },
];

export default function ProcessSection() {
  return (
    <section className="relative bg-bg-surface px-4 py-24">
      <hr className="ruled-line absolute top-0 left-0 right-0" />
      <div className="mx-auto max-w-6xl">
        <AnimateOnScroll>
          <SectionTitle
            sheetNo="03"
            eyebrow="PROCESS"
            light="Blueprint to"
            bold="Working Software"
            subtitle="A fixed sequence with no surprises — you see the drawing before we pour the concrete."
            size="md"
          />
        </AnimateOnScroll>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((step, index) => (
            <AnimateOnScroll key={step.no} delay={index * 120 + 100}>
              <div className="border-t border-[var(--border-default)] pt-6">
                <span className="font-mono text-sm font-medium text-accent">
                  {step.no}
                </span>
                <h3 className="mt-3 mb-3 text-title font-display font-semibold stretch-wide text-txt-primary">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-txt-secondary">
                  {step.copy}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
