'use client';

// ─── 项目成果 · Neural ───
// DM Mono stat 数字 / 蓝色数字 / 计数动画

import { useEffect, useRef, useState } from 'react';
import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import SectionTitle from '@/components/shared/SectionTitle';

interface ResultsSectionProps {
  results: string[];
}

// 从文本中提取数字指标 (如 "50% faster" → { value: "50%", label: "faster" })
function extractStat(text: string): { value: string; rest: string } | null {
  const match = text.match(/^(\d+[\d,.]*[%x×+]?)\s+(.+)/i);
  if (match) return { value: match[1], rest: match[2] };
  return null;
}

// 数字计数动画 Hook
function useCountUp(target: number, isVisible: boolean, duration = 1500) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (!isVisible) return;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - 2 ** (-10 * progress);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isVisible, target, duration]);

  return count;
}

// 单个成果卡片
function ResultCard({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const stat = extractStat(text);

  // 提取纯数字部分用于动画
  const numericValue = stat
    ? parseInt(stat.value.replace(/[^0-9]/g, ''), 10)
    : 0;
  const suffix = stat ? stat.value.replace(/[0-9,.]*/g, '') : '';
  const animatedNumber = useCountUp(numericValue, isVisible);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (stat) {
    // 有数字指标的 — 大号 stat 卡片, DM Mono 数字
    return (
      <div ref={ref} className="card-elevated p-6 text-center">
        <div className="font-mono text-3xl md:text-4xl font-bold text-accent tracking-tight mb-2">
          {isVisible ? animatedNumber : 0}
          {suffix}
        </div>
        <p className="text-txt-tertiary text-sm">{stat.rest}</p>
      </div>
    );
  }

  // 无数字的 — 复选框列表项
  return (
    <div ref={ref} className="flex items-start gap-3">
      <span className="w-1.5 h-1.5 rounded-full bg-industry-realestate flex-shrink-0 mt-2" />
      <p className="text-txt-secondary leading-relaxed text-[15px]">{text}</p>
    </div>
  );
}

export default function ResultsSection({ results }: ResultsSectionProps) {
  // 分离有数字和无数字的结果
  const statsResults = results.filter((r) => extractStat(r));
  const textResults = results.filter((r) => !extractStat(r));

  return (
    <section className="py-16 bg-bg-surface px-4">
      <div className="max-w-3xl mx-auto">
        <AnimateOnScroll>
          <SectionTitle light="The" bold="Results" align="left" size="md" />
        </AnimateOnScroll>

        {/* Stat 卡片网格 */}
        {statsResults.length > 0 && (
          <div
            className={`grid gap-4 mb-8 ${statsResults.length >= 3 ? 'grid-cols-2 md:grid-cols-3' : statsResults.length === 2 ? 'grid-cols-2' : 'grid-cols-1 max-w-xs'}`}
          >
            {statsResults.map((result, index) => (
              <AnimateOnScroll key={index} delay={index * 100}>
                <ResultCard text={result} />
              </AnimateOnScroll>
            ))}
          </div>
        )}

        {/* 文本结果列表 */}
        {textResults.length > 0 && (
          <div className="space-y-4">
            {textResults.map((result, index) => (
              <AnimateOnScroll key={index} delay={index * 80 + 200}>
                <ResultCard text={result} />
              </AnimateOnScroll>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
