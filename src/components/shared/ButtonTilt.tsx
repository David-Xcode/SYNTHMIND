'use client';

// ─── 按钮 pointer tilt 弹簧层 · Living Blueprint v4.2 / v7 引擎抽取 ───
// 设计定案：docs/superpowers/specs/2026-07-26-living-blueprint-v4.2-design.md（§4.3）
// v7 起弹簧引擎移居 src/lib/pointer-tilt-engine.ts（与 CardTilt 共享单例，
// per-entry 参数）——本组件只剩参数表 + 注册生命周期，行为与 v4.2 逐参数等价。
// ModuleButton 的交互中间层：hover 顶出期间按钮随指针微摆（mouse-tracking
// 豁免第 3 例窄列举——rAF 阻尼弹簧非 1:1 硬跟）。仅悬停期跟随（盒内满权重、
// 盒外即零）：嵌墙砖在槽里不该晃，摆动只属于顶出后的悬空状态。
// 门控/RM teardown/rect 缓存/收敛停帧纪律全部在引擎内，见引擎头注。

import { type ReactNode, useEffect, useRef } from 'react';
import { registerTilt, type TiltParams } from '@/lib/pointer-tilt-engine';

// 按钮参数 — 功能件小盒子：快弹簧、4° 上限（v4.2 定案值，一个都不许漂移）
const BUTTON_TILT: TiltParams = {
  maxTilt: 4,
  stiffness: 30,
  damping: 6.6, // ζ≈0.6 — HeroObjectPhysics ROT 同族
  perspective: 500,
  xDiv: 0.9,
  yDiv: 0.6,
};

export default function ButtonTilt({
  children,
  disabled = false,
}: {
  children: ReactNode;
  disabled?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return registerTilt(el, BUTTON_TILT, disabled);
  }, [disabled]);

  return (
    <span ref={ref} className="btn-tilt">
      {children}
    </span>
  );
}
