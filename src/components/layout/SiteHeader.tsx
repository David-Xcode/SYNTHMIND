'use client';

// ─── 导航头部 · Neural ───
// 精简版: Logo（左）+ 导航链接（右，仅桌面）/ 无 CTA / 无移动端菜单

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { mainNav } from '@/data/navigation';

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // 滚动检测
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 判断导航项是否激活
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-out-expo ${
        scrolled
          ? 'bg-bg-base border-b border-[var(--border-default)]'
          : 'border-b border-transparent'
      }`}
    >
      <nav className="flex justify-between items-center px-6 md:px-12 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/synthmind_logo.png"
            alt="Synthmind Logo"
            width={150}
            height={40}
            className="h-9 w-auto transition-all duration-300 opacity-80 hover:opacity-100 hover:drop-shadow-accent"
            suppressHydrationWarning
          />
        </Link>

        {/* 桌面端导航 — 仅导航链接，无 CTA */}
        <div className="hidden md:flex items-center gap-8">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative text-sm font-normal transition-colors duration-200 py-1 ${
                isActive(item.href)
                  ? 'text-txt-primary'
                  : 'text-txt-tertiary hover:text-txt-primary'
              }`}
            >
              {item.label}
              {isActive(item.href) && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent animate-scale-in-dot" />
              )}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
