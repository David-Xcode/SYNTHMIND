'use client';

// ─── 可见性触发 hook ───
// 元素进入视口后 isVisible 置 true（一次性，不回退）
// 此前同一段 IntersectionObserver 逻辑在 AnimateOnScroll / AnimatedStat /
// ResultsSection 等组件中各自实现了一遍，统一收拢于此
// Blueprint 重构后兼任 scroll-driven 动画的旧浏览器降级路径

import { useEffect, useRef, useState } from 'react';

export function useIntersectionVisible<T extends Element>(threshold = 0.3) {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}
