'use client';

// ─── Footer · Neural ───
// 蓝色分割线 / DM Mono 分类标签 / 冷色链接

import Link from 'next/link';
import Image from 'next/image';
import { footerNav } from '@/data/navigation';

export default function SiteFooter() {
  return (
    <footer className="relative text-white bg-bg-base">
      {/* 顶部蓝色分割线 */}
      <div className="ruled-line" />

      <div className="pt-12 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 上半部：Logo + 链接列 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Logo + 简介 */}
            <div className="md:col-span-1">
              <Link href="/" className="inline-block mb-3">
                <Image
                  src="/synthmind_logo.png"
                  alt="Synthmind Logo"
                  width={120}
                  height={32}
                  className="h-7 w-auto opacity-50 hover:opacity-80 transition-opacity duration-300"
                />
              </Link>
              <p className="text-txt-quaternary text-sm leading-relaxed">
                AI-powered software studio building tools that actually work for traditional industries.
              </p>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-mono text-xs font-medium text-txt-quaternary uppercase tracking-eyebrow mb-3">
                Company
              </h3>
              <ul className="space-y-2">
                {footerNav.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group relative inline-block text-txt-tertiary hover:text-txt-primary text-sm transition-colors duration-200"
                    >
                      {link.label}
                      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-accent/50 transition-all duration-300 group-hover:w-full" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Industries */}
            <div>
              <h3 className="font-mono text-xs font-medium text-txt-quaternary uppercase tracking-eyebrow mb-3">
                Industries
              </h3>
              <ul className="space-y-2">
                {footerNav.industries.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group relative inline-block text-txt-tertiary hover:text-txt-primary text-sm transition-colors duration-200"
                    >
                      {link.label}
                      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-accent/50 transition-all duration-300 group-hover:w-full" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Projects */}
            <div>
              <h3 className="font-mono text-xs font-medium text-txt-quaternary uppercase tracking-eyebrow mb-3">
                Projects
              </h3>
              <ul className="space-y-2">
                {footerNav.projects.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group relative inline-block text-txt-tertiary hover:text-txt-primary text-sm transition-colors duration-200"
                    >
                      {link.label}
                      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-accent/50 transition-all duration-300 group-hover:w-full" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 分隔线 */}
          <div className="ruled-line mb-6" />

          {/* 底部：版权 + 联系 */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-txt-quaternary text-xs">
              &copy; {new Date().getFullYear()} Synthmind. Toronto, Canada.
            </p>
            <a
              href="mailto:info@synthmind.ca"
              className="text-txt-quaternary hover:text-accent text-xs transition-colors duration-200"
            >
              info@synthmind.ca
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
