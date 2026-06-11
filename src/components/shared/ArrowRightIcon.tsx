// ─── 右箭头图标 ───
// 同一条 SVG path 此前在 3 处内联重复（HomeHero / CTABanner / 产品卡片）

interface ArrowRightIconProps {
  className?: string;
}

export default function ArrowRightIcon({
  className = 'w-4 h-4',
}: ArrowRightIconProps) {
  return (
    <svg
      className={className}
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 7l5 5m0 0l-5 5m5-5H6"
      />
    </svg>
  );
}
