'use client';

// ─── 计数动画统计卡片 · Neural ───
// 用于 About 页面 stats 数字的动画效果

import { useEffect, useRef, useState } from 'react';
import { useCountUp } from '@/hooks/useCountUp';

interface AnimatedStatProps {
  value: string;
  label: string;
  color: string;
}

export default function AnimatedStat({ value, label, color }: AnimatedStatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  // 提取纯数字部分用于动画
  const numericValue = parseInt(value.replace(/[^0-9]/g, ''), 10);
  const suffix = value.replace(/[0-9]/g, '');
  const animatedNumber = useCountUp(numericValue, isVisible, 1200);

  return (
    <div ref={ref} className="card-surface p-5 rounded-xl">
      <div className={`font-mono text-2xl font-bold ${color} mb-1`}>
        {isVisible ? animatedNumber : 0}
        {suffix}
      </div>
      <div className="text-xs text-txt-quaternary">{label}</div>
    </div>
  );
}
