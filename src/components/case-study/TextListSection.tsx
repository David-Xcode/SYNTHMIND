'use client';

// ─── 通用编号文本列表区块 · Neural ───
// 蓝色左边框 / DM Mono 编号 / 可配置标题和背景

import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import SectionTitle from '@/components/shared/SectionTitle';

interface TextListSectionProps {
  /** 标题的浅色部分 (font-light) */
  titleLight: string;
  /** 标题的粗体部分 (font-bold) */
  titleBold: string;
  /** 编号列表文本 */
  items: string[];
  /** 背景色 class，默认 bg-bg-surface */
  bgClass?: string;
}

export default function TextListSection({
  titleLight,
  titleBold,
  items,
  bgClass = 'bg-bg-surface',
}: TextListSectionProps) {
  return (
    <section className={`py-16 ${bgClass} px-4`}>
      <div className="max-w-3xl mx-auto">
        <AnimateOnScroll>
          <SectionTitle
            light={titleLight}
            bold={titleBold}
            align="left"
            size="md"
          />
        </AnimateOnScroll>

        <div className="space-y-4">
          {items.map((paragraph, index) => (
            <AnimateOnScroll key={index} delay={index * 80 + 100}>
              <div className="flex gap-5 p-5 rounded-xl border-l-2 border-accent/30 bg-bg-elevated">
                <span className="font-mono text-2xl font-semibold text-accent/20 leading-none pt-0.5">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="text-txt-secondary leading-relaxed text-[15px]">
                  {paragraph}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
