// ─── 公开页面共享布局 ───
// SiteHeader + SiteFooter + ChatButton 在此声明一次，所有公开页面自动继承
// admin 路由有自己的 layout，不受此影响

import type { ReactNode } from 'react';
import ChatButton from '@/components/chat/ChatButton';
import SiteFooter from '@/components/layout/SiteFooter';
import SiteHeader from '@/components/layout/SiteHeader';
import ErrorBoundary from '@/components/shared/ErrorBoundary';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ErrorBoundary fallback={null}>
        <SiteHeader />
      </ErrorBoundary>
      <main className="min-h-screen">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
      <ErrorBoundary fallback={null}>
        <SiteFooter />
      </ErrorBoundary>
      <ErrorBoundary fallback={null}>
        <ChatButton />
      </ErrorBoundary>
    </>
  );
}
