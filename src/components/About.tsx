'use client';

import React, { useEffect, useRef, useState } from 'react';

const About: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const principles = [
    {
      title: 'Ship Fast',
      description: 'No endless meetings or approval chains. I move quickly from idea to working software.',
    },
    {
      title: 'Stay Lean',
      description: 'One developer means lower overhead, direct communication, and focused execution.',
    },
    {
      title: 'Build Smart',
      description: 'AI-first approach to every project. Automate the boring stuff, focus on what matters.',
    },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-32 bg-gradient-to-b from-[#252b3b] to-[#1a1f2e] relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 节标题 - 简约优雅 */}
        <div className={`text-center mb-20 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-5xl md:text-6xl font-extralight text-white mb-6 tracking-wide">
            About <span className="font-normal">Synthmind</span>
          </h2>
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto" />
        </div>

        {/* 主要介绍文字 - 居中简约布局 */}
        <div className="max-w-4xl mx-auto space-y-12">
          <p className={`text-lg md:text-xl text-gray-300 leading-relaxed text-center font-light transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Synthmind is a solo software studio focused on building AI-powered tools for traditional industries.
            I specialize in taking repetitive, time-consuming workflows and turning them into automated,
            intelligent systems that just work.
          </p>

          {/* 工作原则 - 极简卡片设计 */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {principles.map((principle, index) => (
              <div
                key={principle.title}
                className={`group transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100 + 300}ms` }}
              >
                <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] p-8 rounded-lg transition-all duration-500 hover:bg-white/[0.05] hover:border-white/[0.1]">
                  <h3 className="text-lg font-medium text-white/90 mb-4 tracking-wide">
                    {principle.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {principle.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 底部装饰线 */}
          <div className="mt-20 flex justify-center">
            <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;