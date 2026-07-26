// ─── CSIO 会员徽章 chip ───
// 纯文字徽章（无 CSIO logo 资产授权，文字声明更合规）
// 消费者 = InDevelopmentShowcase 旗舰模块（teaser 卡已随 2026-07-26 重排删除）
// 排版走共享 <Eyebrow>（accent 色调），仅额外叠加 chip 的底色/边框/圆角

import Eyebrow from '@/components/shared/Eyebrow';

export default function CsioMemberBadge() {
  return (
    <Eyebrow className="bg-accent/10 border border-accent/25 rounded-lg px-2.5 py-1">
      CSIO Member
    </Eyebrow>
  );
}
