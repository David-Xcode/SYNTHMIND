'use client';

// ─── 文字逐词入场动画 · Blueprint ───
// 每个词依次 fade-in + translateY(8px) + blur(2px)
// 与 "digital emergence" 主题一致，stagger 40ms/词
// SSR 基态可见（useDeferredReveal）：无 JS / hydration 失败时文字完整可读，
// 只有确认在视口下方的实例才武装隐藏态等待滚动揭示
// ⚠️ 首屏（视口内）文案不要用本组件——不会播动画；首屏词入场用
// Server 直出的 .word-reveal（见 HomeHero 副标题）

import type React from 'react';
import { Fragment } from 'react';
import { useDeferredReveal } from '@/hooks/useDeferredReveal';

interface TextRevealProps {
  text: string;
  className?: string;
  /** 每个词之间的延迟（ms），默认 40 */
  stagger?: number;
  /** 基础延迟（ms），默认 0 */
  delay?: number;
  /** 渲染的 HTML 标签 */
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3';
}

export default function TextReveal({
  text,
  className = '',
  stagger = 40,
  delay = 0,
  as: Tag = 'p',
}: TextRevealProps) {
  const { ref, isVisible } = useDeferredReveal<HTMLElement>(0.1);

  const words = text.split(' ');

  // ref 需要 any cast 因为 Tag 是动态标签
  return (
    <Tag ref={ref as React.Ref<never>} className={className}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          {/* 分隔空格放 inline-block 外的兄弟文本节点：行尾正常折叠，
              居中多行标题不因词内尾随 NBSP 而中心偏移（HomeHero 同款） */}
          {i > 0 && ' '}
          <span
            className="inline-block"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
              filter: isVisible ? 'blur(0)' : 'blur(2px)',
              // 武装隐藏必须瞬时（transition none）——只有揭示方向带过渡；
              // delay 折进 shorthand：与 transitionDelay longhand 混写会触发
              // React「shorthand/longhand 冲突」重渲染告警
              transition: isVisible
                ? ['opacity', 'transform', 'filter']
                    .map(
                      (p) =>
                        `${p} 500ms cubic-bezier(0.16, 1, 0.3, 1) ${delay + i * stagger}ms`,
                    )
                    .join(', ')
                : 'none',
              // 不写 will-change（与 AnimateOnScroll 同一判断）：未入场的词
              // span 常驻合成层提示得不偿失，且本组件是公共导出——谁拿去包
              // 一段长文案就是几十个常驻提示。500ms 的 opacity/transform/filter
              // 过渡不需要提前提示，浏览器自会在过渡开始时提层
            }}
          >
            {word}
          </span>
        </Fragment>
      ))}
    </Tag>
  );
}
