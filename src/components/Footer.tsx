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
    <footer className="bg-slate-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          {/* Logo */}
          <div className="mb-6 md:mb-0">
            <a href="#" className="flex items-center">
              <img 
                src="/synthmind_logo.png" 
                alt="Synthmind Logo" 
                className="h-10 w-auto filter brightness-0 invert"
              />
            </a>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center md:justify-end gap-6">
            <button 
              onClick={() => scrollToSection('about')}
              className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 font-medium"
            >
              About Us
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 font-medium"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 font-medium"
            >
              Contact Us
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-400">
            &copy; 2024 Synthmind. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 