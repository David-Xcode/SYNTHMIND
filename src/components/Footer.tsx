'use client';

import React from 'react';

const Footer: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gradient-to-b from-[#1a1f2e] to-[#0f1419] text-white py-12 border-t border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center mb-8">
          {/* Logo */}
          <div>
            <a href="#" className="flex items-center">
              <img
                src="/synthmind_logo.png"
                alt="Synthmind Logo"
                className="h-10 w-auto transition-all duration-300 hover:scale-110 hover:filter hover:brightness-125"
              />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800/50 pt-8 text-center">
          <p className="text-gray-500">
            &copy; 2024 Synthmind. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 