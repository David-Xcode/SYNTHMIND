'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  description: string;
  url: string;
  logo: string;
}

const Products: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const products: Product[] = [
    {
      id: 'easysign',
      name: 'Easy-Sign',
      description: 'Streamlined document signing for real estate professionals',
      url: 'https://www.easy-sign.ca/',
      logo: '/product/easy-sign.png'
    },
    {
      id: 'tonesubmit',
      name: 'T-ONE Submit',
      description: 'Internal document system for secure and efficient submissions',
      url: 'https://www.t-onegroup.com/',
      logo: '/product/T_One.png'
    },
    {
      id: 'onest',
      name: 'Onest Insurance',
      description: 'Comprehensive insurance platform with 30+ partner companies',
      url: 'https://www.onestinsurance.ca/',
      logo: '/product/onest-logo-cropped.svg'
    },
    {
      id: 'brokertool',
      name: 'BrokerTool.ai',
      description: 'Free automation tools for insurance brokers',
      url: 'https://brokertool.ai/',
      logo: '/product/brokertool.png'
    }
  ];

  return (
    <section
      id="products"
      ref={sectionRef}
      className="py-32 bg-gradient-to-b from-[#252b3b] to-[#1a1f2e] relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 节标题 - 简约优雅 */}
        <div className={`text-center mb-16 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-5xl md:text-6xl font-extralight text-white mb-6 tracking-wide">
            What I&apos;ve <span className="font-normal">Built</span>
          </h2>
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto mb-6" />
          <p className="text-gray-400 font-light max-w-2xl mx-auto">
            Real products solving real problems.
          </p>
        </div>

        {/* 产品展示 - 极简列表布局 */}
        <div className="max-w-2xl mx-auto">
          {products.map((product, index) => (
            <a
              key={product.id}
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group block transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100 + 200}ms` }}
            >
              <div className={`py-8 transition-all duration-300 ${
                index !== products.length - 1 ? 'border-b border-white/[0.06]' : ''
              }`}>
                {/* Logo */}
                <div className="w-20 h-8 mb-4">
                  <Image
                    src={product.logo}
                    alt={`${product.name} logo`}
                    width={80}
                    height={32}
                    className="object-contain h-full w-auto max-w-full filter brightness-0 invert opacity-50 group-hover:opacity-90 transition-all duration-300"
                  />
                </div>

                {/* 描述 + 箭头 */}
                <div className="flex items-center justify-between">
                  <p className="text-gray-400 text-sm font-light leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {product.description}
                  </p>
                  <span className="text-white/0 group-hover:text-white/60 transition-all duration-300 ml-4 text-lg">
                    →
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* 底部装饰线 */}
        <div className="mt-20 flex justify-center">
          <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default Products;