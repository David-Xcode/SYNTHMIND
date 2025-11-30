'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  achievement: string;
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
      tagline: 'E-Signature Solution',
      description: 'Streamlined document signing for real estate professionals',
      achievement: 'Reduced paperwork time by 70%',
      url: 'https://www.easy-sign.ca/',
      logo: '/product/easy-sign.png'
    },
    {
      id: 'tonesubmit',
      name: 'T-ONE Submit',
      tagline: 'Document Management',
      description: 'Internal document system for secure and efficient submissions',
      achievement: 'Serving T-One Real Estate Group',
      url: 'https://www.t-onegroup.com/',
      logo: '/product/T_One.png'
    },
    {
      id: 'onest',
      name: 'Onest Insurance',
      tagline: 'Insurance Brokerage Platform',
      description: 'Comprehensive insurance platform with 30+ partner companies',
      achievement: 'Full-stack insurance solution',
      url: 'https://www.onestinsurance.ca/',
      logo: '/product/onest-logo-cropped.svg'
    },
    {
      id: 'brokertool',
      name: 'BrokerTool.ai',
      tagline: 'AI-Powered Automation',
      description: 'Free automation tools for insurance brokers',
      achievement: 'AI-first workflow automation',
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
            What I've <span className="font-normal">Built</span>
          </h2>
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto mb-6" />
          <p className="text-gray-400 font-light max-w-2xl mx-auto">
            Real products solving real problems. Each project represents a complete solution I've designed, developed, and deployed.
          </p>
        </div>

        {/* 产品展示 - 卡片网格布局 */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
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
              <div className="relative bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] p-6 rounded-lg transition-all duration-500 hover:bg-white/[0.05] hover:border-white/[0.12] hover:translate-y-[-2px]">
                {/* 顶部：Logo + 标签 */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-24 h-12 flex items-center">
                    <img
                      src={product.logo}
                      alt={`${product.name} logo`}
                      className="object-contain h-full w-auto max-w-full filter brightness-0 invert opacity-70 group-hover:opacity-100 transition-all duration-500"
                    />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-white/40 bg-white/5 px-2 py-1 rounded">
                    {product.tagline}
                  </span>
                </div>

                {/* 描述 */}
                <p className="text-gray-400 text-sm font-light leading-relaxed mb-4">
                  {product.description}
                </p>

                {/* 成就/指标 */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-blue-400/80 font-light">
                    {product.achievement}
                  </span>
                  <span className="text-white/40 group-hover:text-white/70 transition-colors text-sm">
                    View →
                  </span>
                </div>

                {/* Hover时的边框发光效果 */}
                <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(52,152,219,0.1) 0%, transparent 50%, rgba(155,89,182,0.1) 100%)'
                  }}
                />
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