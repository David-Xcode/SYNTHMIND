// ─── 嵌槽键按钮 · Living Blueprint v4.2 ───
// 设计定案：docs/superpowers/specs/2026-07-26-living-blueprint-v4.2-design.md（§4）
// 全站按钮唯一授权入口：业务代码不得直接写 .btn-primary/.btn-secondary
// （CSS 类是组件私有引擎——槽缝环层序 / 顶出状态机 / 尺寸锁定）
//
// 语义 = 悬在深空前的仪器面板键（BlueprintObject 模块交互的按钮版；
// Void Field v1 §4.2 起换锚，砖墙时代的「砌进墙里的一块砖」随墙退役，
// 几何 / 槽缝环 / 槽光全部原样保留）：
// rest 与面板齐平（槽缝环可见）→ hover 顶出 + 槽光涌出 → active 按入槽内
// 结构（transform 写入者分层，JS 逐帧 / transition 各居一层）：
// wrapper（.btn-module-frame 静态骨架：::before 槽缝环 + ::after 涌光层）
// → ButtonTilt（.btn-tilt 悬停期 JS 弹簧微摆 ≤4°）
// → 本体（pop/press transition）
// v4.1 的呼吸（btnHoverIdle/phase 错峰）与 backglow 已随嵌槽语义退役。
// 不加 'use client'（双栖）：server 树里 ButtonTilt 是小 client 岛，其余
// 零 hydration；client 宿主（ContactForm/ErrorBoundary）自动随宿主打包
//
// className 仅限布局 utility（w-full 等）——尺寸 utility（px-*/py-*/text-*）
// 被引擎源序压掉，写了不生效
// props 是判别联合：href（Link 形态）与 disabled/type/onClick（button 形态）
// 互斥——Link 上无 :disabled 伪类，禁用姿态会静默落空

import Link from 'next/link';
import type { ReactNode } from 'react';
import ArrowRightIcon from './ArrowRightIcon';
import ButtonTilt from './ButtonTilt';

interface CommonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  /** 内置右箭头（hover 右移 — 全站统一语言） */
  arrow?: boolean;
  /** 本体布局类（w-full 等）— 尺寸 utility 无效，勿写 */
  className?: string;
}

// 判别联合：disabled 只对 button 形态成立——Link 上无 :disabled 伪类，
// 齐平变暗姿态 / 不可点击全部落空（静默降级），类型层面直接堵死
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
  const content = (
    <>
      {children}
      {arrow && (
        <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </>
  );

  return (
    <span className="btn-module-frame">
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
