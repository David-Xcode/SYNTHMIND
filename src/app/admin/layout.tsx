import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin | Synthmind',
  robots: { index: false, follow: false },
};

// Admin 独立布局——不加载营销站的 Header/Footer/ChatButton
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0f1419] font-sans text-gray-100">
      {children}
    </div>
  );
}
