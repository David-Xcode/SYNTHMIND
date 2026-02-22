'use client';

// ─── 首页 Hero v2 ───
// 包装 MobiusHero，叠加新 btn-primary/secondary
// Next.js 15: 动态导入 Three.js 组件，禁止 SSR 避免 React 内部版本冲突

import Link from 'next/link';
import dynamic from 'next/dynamic';

const MobiusHero = dynamic(() => import('@/components/MobiusHero'), { ssr: false });

export default function HomeHero() {
  return (
    <div className="relative">
      <MobiusHero />

      {/* CTA 按钮覆盖层 — 定位在 Hero 底部, 延迟 reveal 入场 */}
      <div
        className="absolute bottom-28 left-0 right-0 flex justify-center gap-4 pointer-events-auto z-10 animate-reveal"
        style={{ animationDelay: '1.2s', animationFillMode: 'both' }}
      >
        <Link href="/contact" className="btn-primary text-sm sm:text-base px-7 py-3">
          Book a Free Consultation
          <svg className="w-4 h-4" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
        <Link href="/case-studies" className="btn-secondary text-sm sm:text-base px-7 py-3">
          View Our Work
        </Link>
      </div>
    </div>
  );
}
