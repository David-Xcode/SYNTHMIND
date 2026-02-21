'use client';

// ─── 多页面导航头部 ───
// 替代旧的 scroll-based Header，使用 Next.js Link 路由
// 桌面端：下拉菜单；移动端：汉堡 + 可折叠子菜单

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { mainNav } from '@/data/navigation';

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [industriesOpen, setIndustriesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // 页面切换时关闭移动菜单
  useEffect(() => {
    setMobileOpen(false);
    setIndustriesOpen(false);
  }, [pathname]);

  // 滚动检测
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 桌面端：点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIndustriesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const linkClass = (href: string) => {
    const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
    return `transition-colors duration-300 text-sm font-light tracking-wider uppercase ${
      isActive ? 'text-white' : 'text-white/70 hover:text-white'
    }`;
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled || mobileOpen
          ? 'bg-[#0f1419]/80 backdrop-blur-md shadow-lg shadow-black/10'
          : ''
      }`}
    >
      <nav className="flex justify-between items-center px-6 md:px-12 py-5">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/synthmind_logo.png"
            alt="Synthmind Logo"
            width={150}
            height={40}
            className="h-10 w-auto transition-all duration-300 hover:scale-105 opacity-90 hover:opacity-100"
          />
        </Link>

        {/* 桌面端导航 */}
        <div className="hidden md:flex items-center gap-10">
          {mainNav.map((item) =>
            item.children ? (
              // Industries 下拉菜单
              <div key={item.label} className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIndustriesOpen(!industriesOpen)}
                  className={`flex items-center gap-1 ${linkClass('/industries')}`}
                  aria-haspopup="true"
                  aria-expanded={industriesOpen}
                >
                  {item.label}
                  <ChevronDownIcon
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      industriesOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {industriesOpen && (
                  <div role="menu" className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 bg-[#1a1f2e]/95 backdrop-blur-lg border border-white/10 rounded-xl py-2 shadow-xl shadow-black/20">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`block px-5 py-2.5 text-sm font-light transition-colors ${
                          pathname === child.href
                            ? 'text-[#3498db] bg-[#3498db]/10'
                            : 'text-white/70 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={item.href} href={item.href} className={linkClass(item.href)}>
                {item.label}
              </Link>
            )
          )}

          {/* Book a Call CTA */}
          <Link
            href="/contact"
            className="bg-[#3498db] hover:bg-[#2980b9] text-white text-sm font-light px-5 py-2 rounded-lg transition-all duration-300 hover:-translate-y-0.5"
          >
            Book a Call &rarr;
          </Link>
        </div>

        {/* 移动端菜单按钮 */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <XMarkIcon className="h-5 w-5 text-white/70" />
          ) : (
            <Bars3Icon className="h-5 w-5 text-white/70" />
          )}
        </button>
      </nav>

      {/* 移动端导航 */}
      {mobileOpen && (
        <div className="md:hidden">
          <div className="px-6 py-6 space-y-1 bg-[#0f1419]/90 backdrop-blur-lg border-t border-white/5">
            {mainNav.map((item) =>
              item.children ? (
                <div key={item.label}>
                  <button
                    onClick={() => setIndustriesOpen(!industriesOpen)}
                    className="flex items-center justify-between w-full text-left text-white/70 hover:text-white transition-colors text-sm font-light tracking-wider uppercase py-3"
                    aria-haspopup="true"
                    aria-expanded={industriesOpen}
                  >
                    {item.label}
                    <ChevronDownIcon
                      className={`w-4 h-4 transition-transform duration-200 ${
                        industriesOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {industriesOpen && (
                    <div className="pl-4 space-y-1 mb-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block py-2 text-sm font-light transition-colors ${
                            pathname === child.href
                              ? 'text-[#3498db]'
                              : 'text-white/50 hover:text-white/80'
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block w-full text-left transition-colors text-sm font-light tracking-wider uppercase py-3 ${
                    pathname === item.href ? 'text-white' : 'text-white/70 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}

            {/* 移动端 CTA */}
            <div className="pt-4 border-t border-white/10">
              <Link
                href="/contact"
                className="block text-center bg-[#3498db] hover:bg-[#2980b9] text-white text-sm font-light px-5 py-3 rounded-lg transition-colors"
              >
                Book a Call &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
