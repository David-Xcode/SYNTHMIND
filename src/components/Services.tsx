'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  ComputerDesktopIcon,
  ArrowPathIcon,
  LightBulbIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const Services: React.FC = () => {
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

  const services = [
    {
      icon: ComputerDesktopIcon,
      title: 'AI-Driven Software Development',
      description: 'Utilize cutting-edge AI technology to help businesses develop efficient and intelligent software solutions.',
    },
    {
      icon: ArrowPathIcon,
      title: 'Legacy System Optimization',
      description: 'Transform and upgrade legacy systems in traditional industries to improve operational efficiency and reduce maintenance costs.',
    },
    {
      icon: LightBulbIcon,
      title: 'AI Solution Consulting',
      description: 'Provide professional consulting services for AI technology application and implementation, creating customized solutions for businesses.',
    },
    {
      icon: ChartBarIcon,
      title: 'Efficiency Enhancement Analysis',
      description: 'Analyze existing business workflows and provide AI optimization recommendations to maximize efficiency.',
    }
  ];

  return (
    <section
      id="services"
      ref={sectionRef}
      className="py-32 bg-gradient-to-b from-[#1a1f2e] to-[#252b3b] relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 节标题 - 简约优雅 */}
        <div className={`text-center mb-20 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-5xl md:text-6xl font-extralight text-white mb-6 tracking-wide">
            How I Can <span className="font-normal">Help</span>
          </h2>
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto" />
        </div>

        {/* 服务卡片 - 2x2 网格布局 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              // 外层：入场动画（opacity + translate-y + delay）
              <div
                key={index}
                className={`transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100 + 200}ms` }}
              >
                {/* 内层：glass-card 负责 hover 效果 */}
                <div className="glass-card rounded-2xl p-8 h-full">
                  {/* 图标容器 */}
                  <div className="w-14 h-14 rounded-xl bg-[#3498db]/10 border border-[#3498db]/20 flex items-center justify-center mb-6">
                    <IconComponent className="w-7 h-7 text-[#3498db]" />
                  </div>

                  {/* 标题 */}
                  <h3 className="text-lg font-medium text-white/90 mb-2">
                    {service.title}
                  </h3>

                  {/* 描述 */}
                  <p className="text-gray-400 text-sm leading-relaxed font-light">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 底部装饰线 */}
        <div className="mt-20 flex justify-center">
          <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default Services;