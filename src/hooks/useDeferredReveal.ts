'use client';

// ─── 入场揭示 hook（SSR 可见基态版） ───
// 纪律：SSR 基态必须可见；JS 只允许在「确认将播放动画」时才施加隐藏态。
// 反例教训：useIntersectionVisible 初始 false + 内联 opacity:0 直出 SSR，
// 微信 WebView hydration 失败时副标题/整页 section 永久空白（2026-07-26 真机实测）
//
// 时序：SSR 直出可见 → 挂载后（useEffect，paint 之后）仅当元素**完全在视口
// 下方**才置隐藏——此时元素在屏外，隐藏动作不可见，无闪烁；已在视口内/上方
// 的元素保持可见、跳过动画（避免可见内容先显后隐）。
// 之后 IntersectionObserver 进入视口时揭示。
// reduced-motion / 老内核（无 IO）/ 无 JS：保持可见，不动画。

import { useEffect, useRef, useState } from 'react';

export function useDeferredReveal<T extends Element>(threshold = 0.1) {
  const ref = useRef<T>(null);
  // SSR 基态可见 — hydration 失败时内容仍完整可读
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // 只对「完全在视口下方」的元素武装动画 — 屏外隐藏无闪烁
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    setIsVisible(false);
    // threshold 0.1：高度超过 10× 视口的元素永远到不了 10% 可见率——
    // 站内 reveal wrapper 均为 section 级尺寸，不存在该形态；若将来包超高
    // 容器，改用 rootMargin + threshold 0 形态
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
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
