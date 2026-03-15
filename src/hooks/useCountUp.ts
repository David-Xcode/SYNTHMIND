// ─── 数字计数动画 Hook · Neural ───
// 从 ResultsSection 提取的可复用 hook
// easeOutExpo 缓动 + requestAnimationFrame

import { useEffect, useRef, useState } from 'react';

/**
 * 数字从 0 计数到 target 的动画 hook
 * @param target 目标数值
 * @param isVisible 是否可见（触发动画）
 * @param duration 动画持续时间（ms），默认 1500
 */
export function useCountUp(target: number, isVisible: boolean, duration = 1500) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (!isVisible) return;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutExpo 缓动
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
