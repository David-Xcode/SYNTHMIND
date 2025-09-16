'use client';

import React, { useState, useEffect } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-gray-900/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <nav className="flex justify-between items-center px-4 md:px-12 py-4">
        {/* Logo */}
        <div className="flex items-center">
          <a href="#" className="flex items-center">
            <img 
              src="/synthmind_logo.png" 
              alt="Synthmind Logo" 
              className="h-12 w-auto transition-transform duration-300 hover:scale-105"
            />
          </a>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8">
          <button 
            onClick={() => scrollToSection('about')}
            className={`${isScrolled ? 'text-gray-200' : 'text-white'} hover:text-[#3498db] transition-colors duration-300 font-medium relative group`}
          >
            About Us
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3498db] transition-all duration-300 group-hover:w-full"></span>
          </button>
          <button 
            onClick={() => scrollToSection('services')}
            className={`${isScrolled ? 'text-gray-200' : 'text-white'} hover:text-[#3498db] transition-colors duration-300 font-medium relative group`}
          >
            Services
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3498db] transition-all duration-300 group-hover:w-full"></span>
          </button>
          <a 
            href="/invoice"
            className={`${isScrolled ? 'text-gray-200' : 'text-white'} hover:text-[#3498db] transition-colors duration-300 font-medium relative group`}
          >
            Invoice
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3498db] transition-all duration-300 group-hover:w-full"></span>
          </a>
          <button 
            onClick={() => scrollToSection('contact')}
            className={`${isScrolled ? 'text-gray-200' : 'text-white'} hover:text-[#3498db] transition-colors duration-300 font-medium relative group`}
          >
            Contact Us
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3498db] transition-all duration-300 group-hover:w-full"></span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <XMarkIcon className={`h-6 w-6 ${isScrolled ? 'text-gray-200' : 'text-white'}`} />
          ) : (
            <Bars3Icon className={`h-6 w-6 ${isScrolled ? 'text-gray-200' : 'text-white'}`} />
          )}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-md border-t border-gray-700">
          <div className="px-4 py-4 space-y-4">
            <button 
              onClick={() => scrollToSection('about')}
              className="block w-full text-left text-gray-200 hover:text-[#3498db] transition-colors duration-300 font-medium py-2"
            >
              About Us
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="block w-full text-left text-gray-200 hover:text-[#3498db] transition-colors duration-300 font-medium py-2"
            >
              Services
            </button>
            <a 
              href="/invoice"
              className="block w-full text-left text-gray-200 hover:text-[#3498db] transition-colors duration-300 font-medium py-2"
            >
              Invoice
            </a>
            <button 
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left text-gray-200 hover:text-[#3498db] transition-colors duration-300 font-medium py-2"
            >
              Contact Us
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 