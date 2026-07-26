// ─── 解决方案描述 · Blueprint ───
// TextListSection 薄包装（图纸编号 02）

import TextListSection from './TextListSection';

interface SolutionSectionProps {
  solutions: string[];
}

export default function SolutionSection({ solutions }: SolutionSectionProps) {
  return (
    <TextListSection
      sheetNo="02"
      eyebrow="SOLUTION"
      titleLight="The"
      titleBold="Solution"
      items={solutions}
      bgClass="bg-bg-base"
    />
  );
}
