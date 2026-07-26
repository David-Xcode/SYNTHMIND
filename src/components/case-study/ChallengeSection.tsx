// ─── 客户挑战描述 · Neural ───
// TextListSection 薄包装

import TextListSection from './TextListSection';

interface ChallengeSectionProps {
  challenges: string[];
}

export default function ChallengeSection({
  challenges,
}: ChallengeSectionProps) {
  return (
    <TextListSection
      sheetNo="01"
      eyebrow="CHALLENGE"
      titleLight="The"
      titleBold="Challenge"
      items={challenges}
    />
  );
}
