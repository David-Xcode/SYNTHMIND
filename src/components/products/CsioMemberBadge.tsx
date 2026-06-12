// ─── CSIO 会员徽章 chip ───
// 纯文字徽章（无 CSIO logo 资产授权，文字声明更合规）
// 共用于 products 网格的 teaser 卡与 InDevelopmentShowcase 模块

export default function CsioMemberBadge() {
  return (
    <span className="font-mono text-xs font-medium uppercase tracking-eyebrow text-accent bg-accent/10 border border-accent/25 rounded-md px-2.5 py-1">
      CSIO Member
    </span>
  );
}
