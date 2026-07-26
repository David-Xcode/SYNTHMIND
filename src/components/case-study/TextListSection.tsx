// ─── 通用编号文本列表区块 · Blueprint ───
// 蓝色左边框 / IBM Plex Mono 编号（列表项编号 = 真实次序）/ 可配置标题
// Server Component：自身无 hooks/事件，交互全在 client 叶子（AnimateOnScroll）
// v4.2：bgClass prop 随 .sheet-panel 退役连根删除 — section 一律透墙，
// 列表项自身的 bg-elevated 卡片是可读性锚点（L2）

import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
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
              <div className="flex gap-5 rounded-lg border-l-2 border-accent/30 bg-bg-elevated p-5">
                <span className="font-mono text-2xl font-semibold text-accent/20 leading-none pt-0.5">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="text-txt-secondary leading-relaxed text-base">
                  {paragraph}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
