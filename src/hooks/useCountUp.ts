// ─── 数字计数动画 Hook · Blueprint ───
// 从 ResultsSection 提取的可复用 hook
// easeOutExpo 缓动 + requestAnimationFrame
//
// 两条纪律（2026-07-27 审查修复）：
// 1. reduced-motion 守卫 —— globals.css 的 RM 块只压得住 CSS 动画/过渡，
//    对 JS 驱动的 setState 完全无效。缺了这道守卫时，RM 用户看到的是
//    「整页静止、唯独统计数字狂跳 1.5s」，正是 RM 要屏蔽的那类刺激
//    （CLAUDE.md §6「RM 三件套」在 JS 侧的对应物）
// 2. 逐帧去重 —— 只有整数值真的变了才 setState。站内 stat 多为个位数，
//    1.5s ≈ 90 帧里只有几帧会换值，其余帧连 React 的 dispatch 都省掉
//    （同值 bailout 也要先走一趟调度）

import { useEffect, useRef, useState } from 'react';

/**
 * 数字从 0 计数到 target 的动画 hook
 * @param target 目标数值
 * @param isVisible 是否可见（触发动画）
 * @param duration 动画持续时间（ms），默认 1500
 */
export function useCountUp(
  target: number,
  isVisible: boolean,
  duration = 1500,
) {
  const [count, setCount] = useState(0);
  // React 19: useRef 不再支持零参数调用，需显式传入初始值
  const rafRef = useRef<number | undefined>(undefined);
  // 最近一次真正提交给 React 的值 —— 逐帧去重的比较基准。
  // 不在 effect 开头重置：effect 因 target/duration 变化重跑时，它必须
  // 继续反映 count 的当前提交值，否则「新序列首帧算出 0 且 ref 也是 0」
  // 会跳过 setState，把陈旧数字留在屏幕上
  const lastRef = useRef(0);

  useEffect(() => {
    if (!isVisible) return;
    // RM：直接落终值，不起 rAF —— 数据照常正确，只是不做动画
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (lastRef.current !== target) {
        lastRef.current = target;
        setCount(target);
      }
      return;
    }
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutExpo 缓动
      const eased = progress === 1 ? 1 : 1 - 2 ** (-10 * progress);
      const next = Math.round(eased * target);
      if (next !== lastRef.current) {
        lastRef.current = next;
        setCount(next);
      }
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
