'use client';

// ─── 增强版 Footer ───
// 包含站点地图链接、社交信息、版权声明
// 替代旧的极简 Footer，适应多页面结构

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { footerNav } from '@/data/navigation';

export default function SiteFooter() {
  return (
    <footer className="text-white">
      {/* 渐变过渡条 */}
      <div className="h-16 bg-gradient-to-b from-[#252b3b] to-[#0f1419]" />

      <div className="bg-[#0f1419] pt-16 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 上半部：Logo + 链接列 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Logo + 简介 */}
            <div className="md:col-span-1">
              <Link href="/" className="inline-block mb-4">
                <Image
                  src="/synthmind_logo.png"
                  alt="Synthmind Logo"
                  width={120}
                  height={32}
                  className="h-8 w-auto opacity-60 hover:opacity-100 transition-opacity duration-300"
                />
              </Link>
              <p className="text-gray-500 text-sm font-light leading-relaxed">
                AI-powered software studio building tools that actually work for traditional industries.
              </p>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-xs font-medium text-white/50 uppercase tracking-widest mb-4">
                Company
              </h3>
              <ul className="space-y-3">
                {footerNav.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm font-light transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Industries */}
            <div>
              <h3 className="text-xs font-medium text-white/50 uppercase tracking-widest mb-4">
                Industries
              </h3>
              <ul className="space-y-3">
                {footerNav.industries.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm font-light transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Projects */}
            <div>
              <h3 className="text-xs font-medium text-white/50 uppercase tracking-widest mb-4">
                Projects
              </h3>
              <ul className="space-y-3">
                {footerNav.projects.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm font-light transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 细线分隔 */}
          <div className="w-full h-[1px] bg-white/10 mb-8" />

          {/* 底部：版权 + 联系信息 */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-xs font-light tracking-wider">
              &copy; {new Date().getFullYear()} Synthmind. Toronto, Canada.
            </p>
            <a
              href="mailto:synthmind.technology@gmail.com"
              className="text-gray-500 hover:text-[#3498db] text-xs font-light transition-colors"
            >
              synthmind.technology@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
