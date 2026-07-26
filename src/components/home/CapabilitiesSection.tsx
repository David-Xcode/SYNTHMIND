// ─── 首页能力板块 · Blueprint ───
// 三项核心能力（无编号 — 能力不是序列，编号只用于真实次序）
// hairline 玻璃线风格小图标内联绘制，与活蓝图同语言

import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import CropMarks from '@/components/shared/CropMarks';
import GlassCard from '@/components/shared/GlassCard';
import SectionTitle from '@/components/shared/SectionTitle';

// 24px hairline 玻璃线图标 — 与蓝图 SVG 同一制图语言
const GLYPH_PROPS = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'rgba(74, 159, 229, 0.6)',
  strokeWidth: 1.25,
  'aria-hidden': true,
} as const;

const capabilities = [
  {
    title: 'Workflow Automation',
    copy: 'Intake, validation, notifications, tracking — we turn the routine that eats your team’s week into software that runs it end to end.',
    // 正交流程线：起点方块 → 布线 → 箭头
    glyph: (
      <svg {...GLYPH_PROPS}>
        <rect x="3" y="3" width="6" height="6" rx="1" />
        <path d="M9 6 H15 V15 H19" />
        <path d="M17 13 L19 15 L17 17" />
      </svg>
    ),
  },
  {
    title: 'Legacy Modernization',
    copy: 'Paper files, spreadsheets, aging portals: we move decades-old processes into the browser without breaking what already works.',
    // 旋转更新箭头环绕方块
    glyph: (
      <svg {...GLYPH_PROPS}>
        <rect x="9" y="9" width="6" height="6" rx="1" />
        <path d="M20 12 a8 8 0 1 1 -3 -6.2" />
        <path d="M20 3 V6 H17" />
      </svg>
    ),
  },
  {
    title: 'Custom AI Solutions',
    copy: 'Document processing, data extraction, decision support — AI applied only where it pays for itself.',
    // 节点簇：中心核 + 三个卫星节点
    glyph: (
      <svg {...GLYPH_PROPS}>
        <circle cx="12" cy="12" r="2.5" />
        <circle cx="12" cy="4.5" r="1.5" />
        <circle cx="5" cy="18" r="1.5" />
        <circle cx="19" cy="18" r="1.5" />
        <path d="M12 9.5 V6" />
        <path d="M10 14 L6 16.8" />
        <path d="M14 14 L18 16.8" />
      </svg>
    ),
  },
];

export default function CapabilitiesSection() {
  return (
    <section className="relative px-4 py-24">
      <hr className="ruled-line absolute top-0 left-0 right-0" />
      <div className="mx-auto max-w-6xl">
        <AnimateOnScroll>
          <SectionTitle
            sheetNo="01"
            eyebrow="CAPABILITIES"
            light="What We"
            bold="Build"
            subtitle="Three ways we put AI to work inside a business — no moonshots, just measurable time saved."
            size="md"
          />
        </AnimateOnScroll>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {capabilities.map((cap, index) => (
            <AnimateOnScroll key={cap.title} delay={index * 80 + 100}>
              <GlassCard variant="elevated" className="relative h-full">
                <CropMarks />
                <div className="mb-5">{cap.glyph}</div>
                <h3 className="mb-2 text-base font-medium tracking-tight text-txt-primary">
                  {cap.title}
                </h3>
                <p className="text-sm leading-relaxed text-txt-tertiary">
                  {cap.copy}
                </p>
              </GlassCard>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
