// ─── 通用编号叙事列表区块 · Blueprint ───
// Server Component：自身无 hooks/事件，交互全在 client 叶子（AnimateOnScroll）
//
// IA v1 §4.4 出卡重构：Challenge/Solution 是**连续叙事**（多段正文），
// 判据一判它出卡——此前每段包一张 static+accent 玻璃卡，一屏三张同规格窗
// 让卡片彻底失去层级功能，读者也读不出「这三段是一个论证」。现在改为编号
// 列表直排压墙：mono 序号承担次序，正文直接压在石墨墙上（正文档位 base/
// secondary，对砖面 8.09:1，砖顶受光棱上仍 ≥4.5）。
// v4.2 的 bgClass、v7 的 Card 包裹均已连根删除；组件 API 未变。

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
            sheetNo={sheetNo}
            eyebrow={eyebrow}
          />
        </AnimateOnScroll>

        {/* <ol> 而非 div：次序是内容的一部分，序号 aria-hidden 交给列表语义。
            role="list" 是必需的补丁不是冗余：Tailwind preflight 给 ol 设了
            list-style:none，Safari/VoiceOver 见到它就丢掉 list/listitem 角色
            —— 那样序号既被 aria-hidden 藏了、语义又没了，次序对读屏彻底消失。
            biome 的 noRedundantRoles / useSemanticElements 不知道这层 CSS
            交互，在此是误报，定向抑制 */}
        {/* biome-ignore lint/a11y/noRedundantRoles: Tailwind preflight 的 list-style:none 会让 Safari/VoiceOver 丢掉列表语义，role 是必需补丁 */}
        {/* biome-ignore lint/a11y/useSemanticElements: 语义元素已经是 <ol>，role 是为对抗 list-style:none 的语义丢失而补 */}
        <ol className="space-y-6" role="list">
          {items.map((paragraph, index) => (
            <li key={paragraph}>
              <AnimateOnScroll
                delay={index * 80 + 100}
                className="flex gap-4 sm:gap-5"
              >
                {/* 序号与 about 流程步骤号同一形态（mono 小号 accent，
                    真实次序专用）；leading-7 与正文首行基线对齐 */}
                <span
                  className="font-mono text-sm font-semibold text-accent leading-7"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="text-txt-secondary leading-7 text-base">
                  {paragraph}
                </p>
              </AnimateOnScroll>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
