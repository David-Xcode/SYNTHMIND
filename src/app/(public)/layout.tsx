// ─── 公开页面共享布局 ───
// SiteHeader + SiteFooter + ChatButton 在此声明一次，所有公开页面自动继承
// admin 路由有自己的 layout，不受此影响

import type { ReactNode } from 'react';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import ChatButton from '@/components/chat/ChatButton';

export default function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">{children}</main>
      <SiteFooter />
      <ChatButton />
    </>
  );
}
