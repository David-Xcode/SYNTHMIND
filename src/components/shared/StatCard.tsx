'use client';

// ─── 计数统计卡 · Card System v7 ───
// count-up 全站唯一实现——此前 AnimatedStat 与 ResultsSection.ResultCard
// 各自实现 useCountUp + useIntersectionVisible + 数字解析（两份心智两份 bug 面）。
// 外壳 = Card static（纯展示：统计数字不可点，零 hover 位移）。

import Card from '@/components/shared/Card';
import { useCountUp } from '@/hooks/useCountUp';
import { useIntersectionVisible } from '@/hooks/useIntersectionVisible';

const SIZE = {
  // AnimatedStat 档：紧凑侧栏统计（about 页）
  sm: {
    pad: 'sm' as const,
    value: 'text-2xl mb-1',
    label: 'text-xs',
    align: '',
  },
  // ResultCard 档：case study 成果大数字（居中）
  lg: {
    pad: 'md' as const,
    value: 'text-3xl md:text-4xl tracking-tight mb-2',
    label: 'text-sm',
    align: 'text-center',
  },
} as const;

interface StatCardProps {
  /** 统计值，如 '9+' / '50%' / '1,000+'；无法解析为「整数+后缀」的值
   *（如 '2–4 wks'）直接静态原样输出，不做动画 */
  value: string;
  label?: string;
  size?: keyof typeof SIZE;
  /** 数字颜色类（默认 text-accent） */
  valueClassName?: string;
  /** 计数动画时长 ms */
  duration?: number;
}

export default function StatCard({
  value,
  label,
  size = 'sm',
  valueClassName = 'text-accent',
  duration,
}: StatCardProps) {
  const { ref, isVisible } = useIntersectionVisible<HTMLDivElement>();
  const s = SIZE[size];

  // 仅当值形如「开头整数 + 纯非数字后缀」（如 '9+'、'100%'、'1,000+'）时做
  // 计数动画。区间或含多组数字的值（'2–4 wks'）强行去非数字会拼出错误数字
  // （'24– wks'）——这类值原样输出。小数（'1.5x'）同样落静态分支，避免旧
  // ResultCard 把 '1.5' 解析成 '15' 的错误。
  const numberMatch = value.match(/^(\d[\d,]*)(\D*)$/);
  const numericValue = numberMatch
    ? parseInt(numberMatch[1].replace(/,/g, ''), 10)
    : 0;
  const suffix = numberMatch ? numberMatch[2] : '';
  // hook 必须无条件调用以保证 hooks 调用顺序稳定
  const animatedNumber = useCountUp(numericValue, isVisible, duration);

  return (
    <Card variant="static" pad={s.pad} className={s.align}>
      <div ref={ref}>
        <div className={`font-mono font-bold ${s.value} ${valueClassName}`}>
          {numberMatch ? (
            <>
              {/* SSR/未见基态直出真值（不是 0）：hydration 失败或 JS 被拦时
                  页面显示的是正确数据；确认可见后才从 0 起跳 count-up。
                  toLocaleString 保住 '1,000+' 的千分位 */}
              {(isVisible ? animatedNumber : numericValue).toLocaleString(
                'en-US',
              )}
              {suffix}
            </>
          ) : (
            value
          )}
        </div>
        {/* label 是可读数据标签，tertiary 档（quaternary 正文禁用） */}
        {label ? (
          <p className={`${s.label} text-txt-tertiary`}>{label}</p>
        ) : null}
      </div>
    </Card>
  );
}
