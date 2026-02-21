'use client';

// ─── 首页 Hero ───
// 包装 MobiusHero 3D 动画，叠加 CTA 按钮

import Link from 'next/link';
import MobiusHero from '@/components/MobiusHero';

export default function HomeHero() {
  return (
    <div className="relative">
      <MobiusHero />

      {/* CTA 按钮覆盖层 — 定位在 Hero 底部 */}
      <div className="absolute bottom-32 left-0 right-0 flex justify-center gap-4 pointer-events-auto z-10">
        <Link
          href="/contact"
          className="bg-[#3498db] hover:bg-[#2980b9] text-white font-light px-8 py-3 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#3498db]/25 text-sm sm:text-base"
        >
          Book a Free Consultation
        </Link>
        <Link
          href="/case-studies"
          className="btn-premium text-sm sm:text-base"
        >
          View Our Work
        </Link>
      </div>
    </div>
  );
}
