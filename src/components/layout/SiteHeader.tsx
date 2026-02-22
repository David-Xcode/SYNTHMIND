'use client';

// ─── 导航头部 · Neural ───
// 实底滚动态 (无 backdrop-blur) / 蓝色活跃指示器 / DM Sans 导航

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { mainNav } from '@/data/navigation';

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // 页面切换时关闭菜单
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // 滚动检测
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-out-expo ${
        scrolled || mobileOpen
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
            className="h-9 w-auto transition-opacity duration-300 opacity-80 hover:opacity-100"
          />
        </Link>

        {/* 桌面端导航 */}
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
              {/* 底部小圆点指示器 — 蓝色 */}
              {isActive(item.href) && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
              )}
            </Link>
          ))}

          {/* CTA 按钮 */}
          <Link href="/contact" className="btn-primary text-sm px-5 py-2">
            Book a Call
            <svg className="w-3.5 h-3.5" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {/* 移动端菜单按钮 — CSS 三线 → X 变形动画 */}
        <button
          className="md:hidden relative w-5 h-5 p-0 text-txt-tertiary hover:text-txt-primary transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          <span className={`absolute left-0 w-5 h-px bg-current transition-all duration-300 ease-[var(--ease-out-expo)] ${mobileOpen ? 'top-[10px] rotate-45' : 'top-[4px]'}`} />
          <span className={`absolute left-0 top-[10px] w-5 h-px bg-current transition-opacity duration-200 ${mobileOpen ? 'opacity-0' : 'opacity-100'}`} />
          <span className={`absolute left-0 w-5 h-px bg-current transition-all duration-300 ease-[var(--ease-out-expo)] ${mobileOpen ? 'top-[10px] -rotate-45' : 'top-[16px]'}`} />
        </button>
      </nav>

      {/* 移动端导航 */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ease-out-expo ${
          mobileOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 py-6 space-y-1 bg-bg-base border-t border-[var(--border-default)]">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block w-full text-left text-sm font-normal py-3 transition-colors duration-150 ${
                isActive(item.href)
                  ? 'text-txt-primary'
                  : 'text-txt-tertiary hover:text-txt-primary'
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* 移动端 CTA */}
          <div className="pt-4 border-t border-[var(--border-default)]">
            <Link
              href="/contact"
              className="block text-center btn-primary w-full py-3"
            >
              Book a Call
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
