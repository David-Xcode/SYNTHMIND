'use client';

// ─── 卡片 pointer tilt 弹簧层 · Card System v7 ───
// 设计定案：docs/superpowers/specs/2026-07-26-card-system-v7-glass-design.md（§2/§3）
// Card interactive 变体的交互中间层（mouse-tracking 豁免第 4 例窄列举）：
// 玻璃检视窗在指针下随之微倾。与 ButtonTilt 共享 pointer-tilt-engine
// 单例引擎，per-entry 参数——卡片是大平面 + 密文字，倾角压到 2.5°、
// 弹簧比按钮慢（厚玻璃板惯性：重的东西摆得慢，厚重感的一半靠这个参数）。
// transform 写入者分层：本层 JS 弹簧逐帧 / 卡片本体 hover 顶起 transition
// ——永不同元素。触屏/RM/无 JS = 纯静态透传 div（SSR 可见基态）。

import { type ReactNode, useEffect, useRef } from 'react';
import { registerTilt, type TiltParams } from '@/lib/pointer-tilt-engine';

// 卡片参数 — 大玻璃板：慢弹簧传质量感，2.5° 防文字抖动
const CARD_TILT: TiltParams = {
  maxTilt: 2.5,
  stiffness: 22,
  damping: 6.2, // ζ≈0.66 — 比按钮更沉
  perspective: 900,
  xDiv: 0.9,
  yDiv: 0.9,
};

export default function CardTilt({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return registerTilt(el, CARD_TILT);
  }, []);

  return (
    <div ref={ref} className="card-tilt">
      {children}
    </div>
  );
}
