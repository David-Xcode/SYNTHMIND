'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { scrollToSection } from '@/utils/scrollToSection';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (sectionId: string) => {
    scrollToSection(sectionId);
    setIsOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-[#0f1419]/80 backdrop-blur-md shadow-lg shadow-black/10' : ''
    }`}>
      <nav className="flex justify-between items-center px-6 md:px-12 py-5">
        {/* Logo */}
        <div className="flex items-center">
          <a href="#" className="flex items-center">
            <Image
              src="/synthmind_logo.png"
              alt="Synthmind Logo"
              width={150}
              height={40}
              className="h-10 w-auto transition-all duration-300 hover:scale-105 opacity-90 hover:opacity-100"
            />
          </a>
        </div>

        {/* Desktop Navigation - 极简风格 */}
        <div className="hidden md:flex gap-10">
          <button
            onClick={() => handleScrollTo('about')}
            className="text-white/70 hover:text-white transition-colors duration-300 text-sm font-light tracking-wider uppercase"
          >
            About
          </button>
          <button
            onClick={() => handleScrollTo('services')}
            className="text-white/70 hover:text-white transition-colors duration-300 text-sm font-light tracking-wider uppercase"
          >
            Services
          </button>
          <button
            onClick={() => handleScrollTo('products')}
            className="text-white/70 hover:text-white transition-colors duration-300 text-sm font-light tracking-wider uppercase"
          >
            Products
          </button>
          <button
            onClick={() => handleScrollTo('contact')}
            className="text-white/70 hover:text-white transition-colors duration-300 text-sm font-light tracking-wider uppercase"
          >
            Contact
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <XMarkIcon className="h-5 w-5 text-white/70 transition-colors" />
          ) : (
            <Bars3Icon className="h-5 w-5 text-white/70 transition-colors" />
          )}
        </button>
      </nav>

      {/* Mobile Navigation - 极简风格 */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-6 py-6 space-y-4 bg-[#0f1419]/90 backdrop-blur-lg border-t border-white/5">
            <button
              onClick={() => handleScrollTo('about')}
              className="block w-full text-left text-white/70 hover:text-white transition-colors duration-300 text-sm font-light tracking-wider uppercase py-2"
            >
              About
            </button>
            <button
              onClick={() => handleScrollTo('services')}
              className="block w-full text-left text-white/70 hover:text-white transition-colors duration-300 text-sm font-light tracking-wider uppercase py-2"
            >
              Services
            </button>
            <button
              onClick={() => handleScrollTo('products')}
              className="block w-full text-left text-white/70 hover:text-white transition-colors duration-300 text-sm font-light tracking-wider uppercase py-2"
            >
              Products
            </button>
            <button
              onClick={() => handleScrollTo('contact')}
              className="block w-full text-left text-white/70 hover:text-white transition-colors duration-300 text-sm font-light tracking-wider uppercase py-2"
            >
              Contact
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
