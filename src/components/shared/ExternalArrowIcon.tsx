// ─── 外链右上箭头图标 ───
// 外链「出框」语义，区别于站内行进的 ArrowRightIcon；
// 同一条 path 此前在 2 处内联逐字符重复（RealEstateShowcase / InDevelopmentShowcase）

interface ExternalArrowIconProps {
  className?: string;
}

export default function ExternalArrowIcon({
  className = 'w-4 h-4',
}: ExternalArrowIconProps) {
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
        d="M7 17L17 7m0 0H8m9 0v9"
      />
    </svg>
  );
}
