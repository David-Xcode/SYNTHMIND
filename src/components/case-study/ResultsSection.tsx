// ─── 项目成果 · Blueprint ───
// IBM Plex Mono stat 数字 / 蓝色数字 / 计数动画
// v7：count-up 卡片统一走 shared/StatCard（本文件不再自持 hooks——
// 原 ResultCard 的解析 + 动画双份实现随卡片系统收敛退役），
// 组件回归 Server Component，client 岛只剩 StatCard/AnimateOnScroll 叶子

import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import SectionTitle from '@/components/shared/SectionTitle';
import StatCard from '@/components/shared/StatCard';

interface ResultsSectionProps {
  results: string[];
}

// 从文本中提取数字指标 (如 "50% faster" → { value: "50%", label: "faster" })
function extractStat(text: string): { value: string; label: string } | null {
  const match = text.match(/^(\d+[\d,.]*[%x×+]?)\s+(.+)/i);
  if (match) return { value: match[1], label: match[2] };
  return null;
}

export default function ResultsSection({ results }: ResultsSectionProps) {
  // 分离有数字和无数字的结果（单次遍历，extractStat 每项只调一次）
  const statsResults: { value: string; label: string }[] = [];
  const textResults: string[] = [];
  results.forEach((r) => {
    const stat = extractStat(r);
    if (stat) statsResults.push(stat);
    else textResults.push(r);
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
            align="left"
            size="md"
          />
        </AnimateOnScroll>

        {/* Stat 卡片网格 — count-up 大数字 */}
        {statsResults.length > 0 && (
          <div
            className={`grid gap-4 mb-8 ${statsResults.length >= 3 ? 'grid-cols-2 md:grid-cols-3' : statsResults.length === 2 ? 'grid-cols-2' : 'grid-cols-1 max-w-xs'}`}
          >
            {statsResults.map((stat, index) => (
              <AnimateOnScroll
                key={stat.value + stat.label}
                delay={index * 100}
              >
                <StatCard value={stat.value} label={stat.label} size="lg" />
              </AnimateOnScroll>
            ))}
          </div>
        )}

        {/* 文本结果列表 */}
        {textResults.length > 0 && (
          <div className="space-y-4">
            {textResults.map((result, index) => (
              <AnimateOnScroll key={result} delay={index * 80 + 200}>
                <div className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-2" />
                  <p className="text-txt-secondary leading-relaxed text-base">
                    {result}
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
