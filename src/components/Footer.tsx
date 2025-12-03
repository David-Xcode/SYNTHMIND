'use client';

import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0f1419] text-white py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          {/* Logo */}
          <a href="#" className="mb-8">
            <img
              src="/synthmind_logo.png"
              alt="Synthmind Logo"
              className="h-8 w-auto opacity-60 hover:opacity-100 transition-opacity duration-300"
            />
          </a>

          {/* 细线分隔 */}
          <div className="w-16 h-[1px] bg-white/10 mb-8" />

          {/* Copyright */}
          <p className="text-gray-600 text-xs font-light tracking-wider">
            © 2024 Synthmind
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
