// ─── 项目成果 · Blueprint ───
// IBM Plex Mono stat 数字 / 蓝色数字 / 计数动画（count-up 走 shared/StatCard）
// 2026-07-27：解析器整体退役。此前本文件用 200+ 行正则（DIGITS 双通道 /
// UNIT_WORDS 白名单 / HEDGE_PREFIX / BASELINE_CTX / pickCandidate…）从散文
// results 里反解统计数字——一个会说谎的抽象：改一个措辞就可能静默改掉对外
// 营销页上的大数字，9 个回归案例只活在注释里而仓库零测试基建。
// 现在数据层 `CaseStudyResult` 显式声明哪条出大数字、数字写什么
//（见 src/data/case-studies.ts），本组件只负责渲染。
// 🚨 铁律不变：不虚构数字——没写 value 的条目就是 bullet 直排。

import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import SectionTitle from '@/components/shared/SectionTitle';
import StatCard from '@/components/shared/StatCard';
import type { CaseStudyResult } from '@/data/case-studies';

interface ResultsSectionProps {
  results: CaseStudyResult[];
}

// 数字卡网格列数 — 提到模块级具名函数，JSX 里不写嵌套三元
function statGridCols(count: number): string {
  if (count >= 3) return 'grid-cols-2 md:grid-cols-3';
  if (count === 2) return 'grid-cols-2';
  return 'grid-cols-1 max-w-xs';
}

export default function ResultsSection({ results }: ResultsSectionProps) {
  // 带 value 的走大数字卡，其余 bullet 直排；两组各自保持数据层顺序
  const stats: { value: string; label: string }[] = [];
  const bullets: string[] = [];
  results.forEach(({ value, label }) => {
    if (value) stats.push({ value, label });
    else bullets.push(label);
  });

  return (
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <AnimateOnScroll>
          <SectionTitle
            sheetNo="03"
            eyebrow="RESULTS"
            light="The"
            bold="Results"
          />
        </AnimateOnScroll>

        {/* Stat 卡片网格 — count-up 大数字 */}
        {stats.length > 0 && (
          <div className={`grid gap-4 mb-8 ${statGridCols(stats.length)}`}>
            {stats.map((stat, index) => (
              // key 带 index：同一案例内两条成果可能写成相同的 value+label
              //（数据层不约束），纯拼接键会碰撞；列表顺序在本次渲染内恒定
              <AnimateOnScroll
                key={`${index}-${stat.value}`}
                delay={index * 100}
              >
                <StatCard value={stat.value} label={stat.label} size="lg" />
              </AnimateOnScroll>
            ))}
          </div>
        )}

        {/* 文本结果列表 */}
        {bullets.length > 0 && (
          <div className="space-y-4">
            {bullets.map((bullet, index) => (
              <AnimateOnScroll key={bullet} delay={index * 80 + 200}>
                <div className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-2.5" />
                  <p className="text-txt-secondary leading-7 text-base">
                    {bullet}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
