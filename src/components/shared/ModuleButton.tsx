// ─── 悬空模组按钮 · Living Blueprint v4 ───
// 设计定案：docs/superpowers/specs/2026-07-26-living-blueprint-v4-design.md（WF-B）
// 全站按钮唯一授权入口：业务代码不得直接写 .btn-primary/.btn-secondary
// （CSS 类是组件私有引擎——v3 的 --btn-dy 状态机 / 双伪元素层序 / 尺寸锁定）
//
// 结构：wrapper（.btn-module-frame 承呼吸+晃动 infinite）→ 本体（按压
// transition）——infinite 动画与 transition 永不共存于同一元素（分层纪律）
// 不加 'use client'（双栖）：server 树里零 hydration；client 宿主
// （ContactForm/ErrorBoundary）里自动随宿主打包，onClick 只在 client 出现
//
// className 仅限布局 utility（w-full 等）——尺寸 utility（px-*/py-*/text-*）
// 被引擎源序压掉，写了不生效；disabled 时呼吸由 :has(:disabled) 纯 CSS 停摆

import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import ArrowRightIcon from './ArrowRightIcon';

interface ModuleButtonProps {
  children: ReactNode;
  /** 有 href → next/link 导航；无 → 原生 button */
  href?: string;
  variant?: 'primary' | 'secondary';
  /** 内置右箭头（hover 右移 — 全站统一语言） */
  arrow?: boolean;
  /** 呼吸相位错峰（秒）— 同屏多按钮不同频；映射为负 animation-delay */
  phase?: number;
  /** wrapper 布局类（flex 等） */
  frameClassName?: string;
  /** 本体布局类（w-full 等）— 尺寸 utility 无效，勿写 */
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  onClick?: () => void;
  'aria-busy'?: boolean;
}

export default function ModuleButton({
  children,
  href,
  variant = 'primary',
  arrow = false,
  phase = 0,
  frameClassName = '',
  className = '',
  type = 'button',
  disabled,
  onClick,
  'aria-busy': ariaBusy,
}: ModuleButtonProps) {
  const buttonClass = [
    variant === 'secondary' ? 'btn-secondary' : 'btn-primary',
    arrow ? 'group' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  const frameStyle = phase
    ? ({ animationDelay: `${-phase}s` } as CSSProperties)
    : undefined;
  const content = (
    <>
      {children}
      {arrow && (
        <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </>
  );

  return (
    <span
      className={`btn-module-frame ${frameClassName}`.trim()}
      style={frameStyle}
    >
      {href ? (
        <Link href={href} className={buttonClass}>
          {content}
        </Link>
      ) : (
        <button
          type={type}
          disabled={disabled}
          onClick={onClick}
          aria-busy={ariaBusy}
          className={buttonClass}
        >
          {content}
        </button>
      )}
    </span>
  );
}
