// ─── 解决方案描述 · Neural ───
// TextListSection 薄包装

import TextListSection from './TextListSection';

interface SolutionSectionProps {
  solutions: string[];
}

export default function SolutionSection({ solutions }: SolutionSectionProps) {
  return (
    <TextListSection
      titleLight="The"
      titleBold="Solution"
      items={solutions}
      bgClass="bg-bg-base"
    />
  );
}
