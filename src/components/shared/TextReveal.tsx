'use client';

// ─── 文字逐词入场动画 · Neural ───
// 每个词依次 fade-in + translateY(8px) + blur(2px)
// 与 "digital emergence" 主题一致，stagger 40ms/词

import { useEffect, useRef, useState } from 'react';

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
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const words = text.split(' ');

  // ref 需要 any cast 因为 Tag 是动态标签
  return (
    <Tag ref={ref as React.Ref<never>} className={className}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
            filter: isVisible ? 'blur(0)' : 'blur(2px)',
            transition: `opacity 500ms cubic-bezier(0.16, 1, 0.3, 1), transform 500ms cubic-bezier(0.16, 1, 0.3, 1), filter 500ms cubic-bezier(0.16, 1, 0.3, 1)`,
            transitionDelay: isVisible ? `${delay + i * stagger}ms` : '0ms',
            willChange: isVisible ? 'auto' : 'opacity, transform, filter',
          }}
        >
          {word}
          {i < words.length - 1 && '\u00A0'}
        </span>
      ))}
    </Tag>
  );
}
