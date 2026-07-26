// ─── Footer · Blueprint ───
// 极简居中堆叠：ruled-line 收尾 + logo + nav + 版权
// Server Component — 无 hooks；Image 仍需 suppressHydrationWarning (next/image 是 CC)

import Image from 'next/image';
import Link from 'next/link';
import { footerNav } from '@/data/navigation';
import { CONTACT_EMAIL } from '@/lib/constants';

export default function SiteFooter() {
  // v4：bg-base/90 半透明收尾 — 满铺墙隐约透出（bg token 的 opacity modifier，非新色）
  return (
    <footer className="relative text-white bg-bg-base/90">
      {/* 顶部蓝色分割线 — 页面的视觉句号 */}
      <hr className="ruled-line" />

      {/* 居中堆叠布局 */}
      <div className="flex flex-col items-center text-center py-10 px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" aria-label="Go to homepage">
          <Image
            src="/synthmind_logo.png"
            alt="Synthmind Logo"
            width={120}
            height={32}
            className="h-7 w-auto opacity-50 hover:opacity-80 transition-opacity duration-300"
            suppressHydrationWarning
          />
        </Link>

        {/* 导航链接 */}
        <nav
          aria-label="Footer"
          className="flex flex-wrap items-center justify-center gap-5 mt-6"
        >
          {footerNav.company.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative text-txt-tertiary hover:text-txt-primary text-sm transition-colors duration-200"
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-accent/50 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* 版权 + 邮箱 */}
        <div className="mt-8 space-y-1">
          <p className="text-txt-quaternary text-xs">
            &copy; {new Date().getFullYear()} Synthmind. Toronto, Canada.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-block text-txt-quaternary hover:text-accent text-xs transition-colors duration-200"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>
    </footer>
  );
}
