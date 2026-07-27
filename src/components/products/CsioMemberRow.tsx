// ─── CSIO 会员身份行 · Blueprint ───
// 徽章 + 两条官方外链（名录验证 / 新闻稿）——此前同一串 JSX 在
// InDevelopmentShowcase 与 brokerage-platform 页逐字符重复，统一收拢于此。
// 身份声明用纯文字 + 官方外链（无 logo 资产授权，文字声明更合规可验证）

import ExternalArrowIcon from '@/components/shared/ExternalArrowIcon';
import { CSIO_DIRECTORY_URL, CSIO_PRESS_RELEASE_URL } from '@/lib/constants';
import CsioMemberBadge from './CsioMemberBadge';

const LINK_CLASS =
  'inline-flex items-center gap-1 text-txt-tertiary hover:text-accent text-xs transition-colors duration-300';

export default function CsioMemberRow({
  className = '',
}: {
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 ${className}`}>
      <CsioMemberBadge />
      <a
        href={CSIO_DIRECTORY_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Verify in the CSIO Member Directory (opens in a new tab)"
        className={LINK_CLASS}
      >
        Verify in the CSIO Member Directory
        <ExternalArrowIcon className="w-3 h-3" />
      </a>
      <a
        href={CSIO_PRESS_RELEASE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="CSIO member announcement, July 2026 (opens in a new tab)"
        className={LINK_CLASS}
      >
        {/* 可见文字必须逐字包含在 aria-label 内（WCAG 2.5.3 Label in Name），
            且与引用块署名同一口径——分隔符统一用逗号 */}
        CSIO member announcement, July 2026
        <ExternalArrowIcon className="w-3 h-3" />
      </a>
    </div>
  );
}
