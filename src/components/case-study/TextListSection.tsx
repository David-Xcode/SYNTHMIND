// ─── 通用编号文本列表区块 · Blueprint ───
// 蓝色左边框 / IBM Plex Mono 编号（列表项编号 = 真实次序）/ 可配置标题
// Server Component：自身无 hooks/事件，交互全在 client 叶子（AnimateOnScroll）
// v4.2：bgClass prop 随 .sheet-panel 退役连根删除 — section 一律透墙，
// 列表项自身的 bg-elevated 卡片是可读性锚点（L2）

import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import Card from '@/components/shared/Card';
import SectionTitle from '@/components/shared/SectionTitle';

interface TextListSectionProps {
  /** 标题的浅色部分 (font-light) */
  titleLight: string;
  /** 标题的粗体部分 (font-bold) */
  titleBold: string;
  /** 编号列表文本 */
  items: string[];
  /** 图纸编号 (如 "01") — 详情页 section 序号 */
  sheetNo?: string;
  /** 图签标签，配合 sheetNo 显示 */
  eyebrow?: string;
}

export default function TextListSection({
  titleLight,
  titleBold,
  items,
  sheetNo,
  eyebrow,
}: TextListSectionProps) {
  return (
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <AnimateOnScroll>
          <SectionTitle
            light={titleLight}
            bold={titleBold}
            align="left"
            size="md"
            sheetNo={sheetNo}
            eyebrow={eyebrow}
          />
        </AnimateOnScroll>

        <div className="space-y-4">
          {items.map((paragraph, index) => (
            <AnimateOnScroll key={index} delay={index * 80 + 100}>
              {/* v7：手写仿 spotlight 卡退役，统一 Card static + accent 竖线；
                  列表序号与 about 流程步骤号同一形态（mono 小号 accent，
                  真实次序专用）——大号水印式序号随编号统一退役 */}
              <Card variant="static" accent pad="sm" className="flex gap-4">
                <span className="font-mono text-sm font-semibold text-accent pt-0.5">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="text-txt-secondary leading-relaxed text-base">
                  {paragraph}
                </p>
              </Card>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
