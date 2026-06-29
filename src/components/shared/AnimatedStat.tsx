'use client';

// ─── 计数动画统计卡片 · Neural ───
// 用于 About 页面 stats 数字的动画效果

import { useCountUp } from '@/hooks/useCountUp';
import { useIntersectionVisible } from '@/hooks/useIntersectionVisible';

interface AnimatedStatProps {
  value: string;
  label: string;
  color: string;
}

export default function AnimatedStat({
  value,
  label,
  color,
}: AnimatedStatProps) {
  const { ref, isVisible } = useIntersectionVisible<HTMLDivElement>();

  // 仅当值形如「开头整数 + 纯非数字后缀」（如 '9+'、'100%'、'1,000+'）时做计数动画。
  // 区间或含多组数字的值（如 '2–4 wks'）若强行去掉非数字会把 '2' 和 '4' 拼成 '24'，
  // 渲染出错误的 '24– wks'——这类值直接原样输出，不做动画。
  const numberMatch = value.match(/^(\d[\d,]*)(\D*)$/);
  const numericValue = numberMatch
    ? parseInt(numberMatch[1].replace(/,/g, ''), 10)
    : 0;
  const suffix = numberMatch ? numberMatch[2] : '';
  // hook 必须无条件调用以保证 hooks 调用顺序稳定
  const animatedNumber = useCountUp(numericValue, isVisible, 1200);

  return (
    <div ref={ref} className="card-surface p-5 rounded-xl">
      <div className={`font-mono text-2xl font-bold ${color} mb-1`}>
        {numberMatch ? (
          <>
            {isVisible ? animatedNumber : 0}
            {suffix}
          </>
        ) : (
          value
        )}
      </div>
      <div className="text-xs text-txt-quaternary">{label}</div>
    </div>
  );
}
