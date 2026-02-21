'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  url: string;
  logo: string;
}

const products: Product[] = [
  {
    id: 'easysign',
    name: 'Easy-Sign',
    url: 'https://www.easy-sign.ca/',
    logo: '/product/easy-sign.png',
  },
  {
    id: 'tonesubmit',
    name: 'T-ONE Submit',
    url: 'https://www.t-onegroup.com/',
    logo: '/product/T_One.png',
  },
  {
    id: 'onest',
    name: 'Onest Insurance',
    url: 'https://www.onestinsurance.ca/',
    logo: '/product/onest-logo-cropped.svg',
  },
  {
    id: 'brokertool',
    name: 'BrokerTool.ai',
    url: 'https://brokertool.ai/',
    logo: '/product/brokertool.png',
  },
  {
    id: 'unionglens',
    name: 'UnionGlens',
    url: 'https://www.unionglens.com/',
    logo: '/product/unionglens.svg',
  },
  {
    id: 'getax',
    name: 'GetAX',
    url: 'https://www.getax.ca/',
    logo: '/product/getax.png',
  },
];

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

  return (
    <section
      id="products"
      ref={sectionRef}
      className="py-32 bg-gradient-to-b from-[#252b3b] to-[#1a1f2e] relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 节标题 */}
        <div
          className={`text-center mb-20 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-5xl md:text-6xl font-extralight text-white mb-6 tracking-wide">
            What We&apos;ve <span className="font-normal">Built</span>
          </h2>
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto" />
        </div>

        {/* Logo 行 — 桌面单行居中，移动端 2×2 grid */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center items-center gap-8 sm:gap-12 lg:gap-20">
          {products.map((product, index) => (
            <a
              key={product.id}
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex justify-center transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{
                transitionDelay: isVisible ? `${index * 100 + 200}ms` : '0ms',
              }}
            >
              <Image
                src={product.logo}
                alt={`${product.name} logo`}
                width={120}
                height={36}
                className="h-9 w-auto object-contain filter brightness-0 invert opacity-40 hover:opacity-90 transition-opacity duration-300"
              />
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
