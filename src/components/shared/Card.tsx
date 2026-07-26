// ─── 玻璃检视窗卡片 · Card System v7 ───
// 设计定案：docs/superpowers/specs/2026-07-26-card-system-v7-glass-design.md
// 全站卡片唯一授权入口。变体 = 交互语义（不是视觉浓淡）：
// - interactive：整卡可点（使用处外层包 Link/a）——hover 顶起 + CardTilt 指针倾斜
// - static：纯展示——恒定玻璃材质，零 hover 位移
// - container：外壳静，交互属于内部子元素（FAQ 手风琴形态）
// 装饰 props 全部正交：accent 左竖线（重点标记）/ sheetNo 图纸编号角标
// （全站唯一编号实现）/ cropMarks 四角裁切 / pad 三档内边距——
// 「要自定义 padding 就绕开组件」的破口就此封死。
// 双栖：本组件无 'use client'；CardTilt client 岛仅 interactive 变体渲染。

import type { ReactNode } from 'react';
import CardTilt from './CardTilt';
import CropMarks from './CropMarks';

const PAD_CLASS = {
  none: 'p-0', // container 形态专用：内部子元素自带 padding（如 FAQ 手风琴）
  sm: 'p-5',
  md: 'p-6',
  lg: 'p-8',
} as const;

interface CardProps {
  children: ReactNode;
  /** 交互语义变体 — 整卡可点才配 interactive；纯展示 static；卡内含
   * 交互子元素（链接/按钮/手风琴）用 container。⚠️ static 与 container
   * 渲染出完全相同的 class——差异纯语义，错配不会被视觉信号暴露，
   * 选型时对着定义选，别对着效果试 */
  variant: 'interactive' | 'static' | 'container';
  /** 左侧蓝色渐变竖线 = 重点标记（正交，任何变体可用） */
  accent?: boolean;
  /** 图纸编号 mono 角标（如 "S.01"）— 渲染于右上角 */
  sheetNo?: string;
  /** 四角裁切标记（克制使用，关键卡片专属） */
  cropMarks?: boolean;
  /** 内边距档位 none/sm/md/lg = p-0/p-5/p-6/p-8 */
  pad?: keyof typeof PAD_CLASS;
  className?: string;
}

export default function Card({
  children,
  variant,
  accent = false,
  sheetNo,
  cropMarks = false,
  pad = 'md',
  className = '',
}: CardProps) {
  const body = (
    <div
      className={[
        'card-glass',
        variant === 'interactive' ? 'card-glass-interactive' : '',
        accent ? 'card-glass-accent' : '',
        PAD_CLASS[pad],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {sheetNo ? (
        <span className="annotation absolute top-4 right-4" aria-hidden="true">
          {sheetNo}
        </span>
      ) : null}
      {cropMarks ? <CropMarks /> : null}
      {children}
    </div>
  );

  // tilt wrapper 仅 interactive：JS 弹簧逐帧写 wrapper / 本体 hover 顶起
  // transition——transform 写入者分层，永不同元素
  return variant === 'interactive' ? <CardTilt>{body}</CardTilt> : body;
}
