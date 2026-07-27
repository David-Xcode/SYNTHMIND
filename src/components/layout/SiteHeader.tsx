'use client';

// ─── 导航头部 · Blueprint ───
// Logo + 导航链接（mainNav 单源）/ 无 CTA。
// 移动端（<md）= 紧凑横排两行式：logo 一行、三个导航项一行——零新状态、
// 零展开收起 JS（2026-07-27 定案，取代此前「移动端完全无导航、只能滚到
// 页脚」的状态；抽屉/汉堡方案被否，转化路径不值得为它加一份 client 状态）。
// 两行式高度 ≈82px，仍在各页首个内容块的 pt-24 (96px) 之内，不发生遮挡。

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { mainNav } from '@/data/navigation';

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  // 已提交值的镜像 —— 滚动期每帧都进 React 调度是没必要的，
  // 布尔真的翻转了才 setState（React 的同值 bailout 也要先走一趟 dispatch）
  const scrolledRef = useRef(false);
  const pathname = usePathname();

  // 滚动检测
  useEffect(() => {
    const handleScroll = () => {
      const next = window.scrollY > 50;
      if (next === scrolledRef.current) return;
      scrolledRef.current = next;
      setScrolled(next);
    };
    // 挂载即对齐：浏览器恢复滚动位置（刷新 / 后退）时初始就该是 scrolled 态
    handleScroll();
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
      {/* <md 纵向两行（logo / nav），≥md 回到左右分置的单行。
          🚨 两行式实测高度 85px（390/320px 视口同值），各页首个内容块
          （Breadcrumb / HomeHero）都从 pt-24 = 96px 起——余量只有 11px。
          改这里的 py/gap/字号或 logo 尺寸前先重量：撑过 96px 就会压住面包屑 */}
      <nav className="flex flex-col gap-1 px-6 py-2 md:flex-row md:items-center md:justify-between md:gap-0 md:px-12 md:py-4">
        {/* Logo — 首屏常驻元素：priority（默认的 lazy 会把它排到懒加载队列尾）。
            prefetch={false}：首页是全站 payload 最大的路由（.rsc 136KB），
            fixed header 恒在视口内 = 每个非首页访客都会被无条件预取 */}
        <Link
          href="/"
          prefetch={false}
          className="flex items-center self-start"
        >
          <Image
            src="/synthmind_logo.png"
            alt="Synthmind Logo"
            width={150}
            height={40}
            priority
            className="h-9 w-auto transition-all duration-300 opacity-80 hover:opacity-100 hover:drop-shadow-accent"
            suppressHydrationWarning
          />
        </Link>

        {/* 导航链接 — 无 CTA。<md 字号压到 text-xs 让三项一行放得下；
            py-1.5 把触达高度撑到 28px（WCAG 2.5.8 的 24×24 下限之上），
            三项总宽 ≈132px + gap，320px 窄屏也不换行 */}
        <div className="flex items-center gap-5 md:gap-8">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={`relative text-xs font-normal transition-colors duration-200 py-1.5 md:py-1 md:text-sm ${
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
