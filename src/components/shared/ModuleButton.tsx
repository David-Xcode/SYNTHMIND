// ─── 悬空长条砖按钮 · Living Blueprint v4.1 ───
// 设计定案：docs/superpowers/specs/2026-07-26-living-blueprint-v4.1-design.md（§3）
// 全站按钮唯一授权入口：业务代码不得直接写 .btn-primary/.btn-secondary
// （CSS 类是组件私有引擎——v3 的 --btn-dy 状态机 / 双伪元素层序 / 尺寸锁定）
//
// 结构（transform 写入者三层分工，infinite / JS 逐帧 / transition 各居一层）：
// wrapper（.btn-module-frame 承呼吸 infinite + ::before backglow 背光）
// → ButtonTilt（.btn-tilt 承 pointer tilt JS 弹簧——像砖一样跟随鼠标摆动）
// → 本体（按压 transition）
// 不加 'use client'（双栖）：server 树里 ButtonTilt 是小 client 岛，其余
// 零 hydration；client 宿主（ContactForm/ErrorBoundary）自动随宿主打包
//
// className 仅限布局 utility（w-full 等）——尺寸 utility（px-*/py-*/text-*）
// 被引擎源序压掉，写了不生效；disabled 时呼吸由 :has(:disabled) 纯 CSS 停摆
// props 是判别联合：href（Link 形态）与 disabled/type/onClick（button 形态）
// 互斥——Link 上无 :disabled 伪类，禁用姿态会静默落空

import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import ArrowRightIcon from './ArrowRightIcon';
import ButtonTilt from './ButtonTilt';

interface CommonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  /** 内置右箭头（hover 右移 — 全站统一语言） */
  arrow?: boolean;
  /** 呼吸相位错峰（秒）— 同屏多按钮不同频；映射为负 animation-delay */
  phase?: number;
  /** 本体布局类（w-full 等）— 尺寸 utility 无效，勿写 */
  className?: string;
}

// 判别联合：disabled 只对 button 形态成立——Link 上无 :disabled 伪类，
// 半落座姿态 / 呼吸停摆 / 不可点击全部落空（静默降级），类型层面直接堵死
interface LinkProps extends CommonProps {
  href: string;
  type?: never;
  disabled?: never;
  onClick?: never;
  'aria-busy'?: never;
}

interface ButtonProps extends CommonProps {
  href?: never;
  type?: 'button' | 'submit';
  disabled?: boolean;
  onClick?: () => void;
  'aria-busy'?: boolean;
}

type ModuleButtonProps = LinkProps | ButtonProps;

export default function ModuleButton({
  children,
  href,
  variant = 'primary',
  arrow = false,
  phase = 0,
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
    <span className="btn-module-frame" style={frameStyle}>
      <ButtonTilt disabled={disabled}>
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
      </ButtonTilt>
    </span>
  );
}
