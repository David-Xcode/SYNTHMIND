'use client';

// ─── 客户 Logo 展示条 · Neural ───
// 双容器无缝 marquee / JetBrains Mono 标签
// 4× 重复 → ~4416px 轨道宽度，覆盖 4K (3840px)

import Image from 'next/image';
import { useMemo } from 'react';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import { caseStudies } from '@/data/case-studies';

const REPEAT_COUNT = 4;

export default function SocialProofBar() {
  // useMemo 避免每次渲染重建数组
  const logos = useMemo(() => {
    const result: typeof caseStudies = [];
    Array.from({ length: REPEAT_COUNT }).forEach(() => {
      caseStudies.forEach((cs) => {
        result.push(cs);
      });
    });
    return result;
  }, []);

  return (
    <section className="py-16 bg-bg-base overflow-hidden">
      <AnimateOnScroll>
        <p className="text-center font-mono text-txt-tertiary text-xs font-medium tracking-eyebrow uppercase mb-8">
          Trusted by businesses across industries
        </p>
      </AnimateOnScroll>

      {/* Marquee 容器 */}
      <div className="relative">
        {/* 左侧渐变遮罩 */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-bg-base to-transparent z-10 pointer-events-none" />
        {/* 右侧渐变遮罩 */}
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-bg-base to-transparent z-10 pointer-events-none" />

        {/* 双容器滚动轨道 */}
        <div className="flex items-center w-max animate-marquee hover:[animation-play-state:paused]">
          {/* 第一份轨道 */}
          <div className="flex items-center gap-16 shrink-0 pr-16">
            {logos.map((cs, i) => (
              <div
                key={`a-${cs.slug}-${i}`}
                className="flex-shrink-0 transition-all duration-300 hover:scale-105 hover:drop-shadow-accent"
              >
                <Image
                  src={cs.logo}
                  alt={`${cs.title} logo`}
                  width={120}
                  height={36}
                  className="h-8 w-auto object-contain filter brightness-0 invert opacity-50 hover:opacity-80 transition-opacity duration-300"
                />
              </div>
            ))}
          </div>
          {/* 第二份（无缝循环）— aria-hidden + 空 alt */}
          <div
            className="flex items-center gap-16 shrink-0 pr-16"
            aria-hidden="true"
          >
            {logos.map((cs, i) => (
              <div
                key={`b-${cs.slug}-${i}`}
                className="flex-shrink-0 transition-all duration-300 hover:scale-105 hover:drop-shadow-accent"
              >
                <Image
                  src={cs.logo}
                  alt=""
                  width={120}
                  height={36}
                  className="h-8 w-auto object-contain filter brightness-0 invert opacity-50 hover:opacity-80 transition-opacity duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
