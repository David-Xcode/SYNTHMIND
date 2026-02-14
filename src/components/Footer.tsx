'use client';

import React from 'react';
import Image from 'next/image';

const Footer: React.FC = () => {
  return (
    <footer className="text-white">
      {/* 渐变过渡条：衔接 Contact 尾色 → Footer 底色 */}
      <div className="h-16 bg-gradient-to-b from-[#252b3b] to-[#0f1419]" />

      <div className="bg-[#0f1419] py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center">
            {/* Logo */}
            <a href="#" className="mb-8">
              <Image
                src="/synthmind_logo.png"
                alt="Synthmind Logo"
                width={120}
                height={32}
                className="h-8 w-auto opacity-60 hover:opacity-100 transition-opacity duration-300"
              />
            </a>

            {/* 细线分隔 */}
            <div className="w-16 h-[1px] bg-white/10 mb-8" />

            {/* Copyright — 动态年份 */}
            <p className="text-gray-600 text-xs font-light tracking-wider">
              &copy; {new Date().getFullYear()} Synthmind
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
