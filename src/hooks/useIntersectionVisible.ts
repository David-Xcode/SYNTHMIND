'use client';

// ─── 可见性触发 hook ───
// 元素进入视口后 isVisible 置 true（一次性，不回退）
// 此前同一段 IntersectionObserver 逻辑在 AnimateOnScroll / AnimatedStat /
// ResultsSection 等组件中各自实现了一遍，统一收拢于此
// Blueprint 重构后兼任 scroll-driven 动画的旧浏览器降级路径
//
// 观察器是**每实例一个**（当前唯一消费方 StatCard，单页个位数量级）。
// 共享单例观察器（WeakMap<Element, cb> 派发）刻意不做：会把「返回 ref
// 给调用方挂」这个极简 API 换成注册/注销两步，收益是省下几个观察器——
// 当前规模不值。若将来单页观察器上百再回头收敛。

import { useEffect, useRef, useState } from 'react';

export function useIntersectionVisible<T extends Element>(threshold = 0.3) {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // 一次性语义（进入即 true，不回退）→ 命中即停止观察，
          // 与 useDeferredReveal 对齐；否则观察器活到卸载，每次跨阈值
          // 都白跑一次回调
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}
