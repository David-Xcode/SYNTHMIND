'use client';

import React, { useEffect, useRef, useState } from 'react';

const Founder: React.FC = () => {
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

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-gradient-to-b from-[#1a1f2e] to-[#252b3b] relative overflow-hidden"
    >
      {/* 背景装饰 - 微妙的网格 */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div
          className={`flex flex-col md:flex-row items-center gap-12 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* 头像区域 - 使用首字母或抽象图形 */}
          <div className="flex-shrink-0">
            <div className="relative">
              {/* 外圈光晕 */}
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl" />

              {/* 头像容器 */}
              <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-[#3498db] to-[#2c3e50] flex items-center justify-center border border-white/10">
                <span className="text-5xl font-light text-white/90">D</span>
              </div>

              {/* 状态指示器 */}
              <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-[#1a1f2e]" />
            </div>
          </div>

          {/* 文字内容 */}
          <div className="flex-1 text-center md:text-left">
            {/* 标签 */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/50 uppercase tracking-wider mb-4">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              Solo Developer & Founder
            </div>

            {/* 问候语 */}
            <h2 className="text-3xl md:text-4xl font-extralight text-white mb-6">
              Hi, I'm <span className="font-normal text-white">David</span>
            </h2>

            {/* 主要介绍 */}
            <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed mb-6">
              I build AI solutions that actually work. With 3 years in software development,
              I've helped businesses automate workflows and modernize legacy systems.
            </p>

            {/* 补充说明 */}
            <p className="text-base text-gray-400 font-light leading-relaxed mb-8">
              No corporate fluff, no endless meetings—just direct communication and
              software that solves real problems. When you work with me, you get my
              full attention and expertise on your project.
            </p>

            {/* 特点标签 */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              {['Direct Communication', 'Fast Iteration', 'Full-Stack AI'].map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded text-sm text-white/60 font-light"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 底部装饰线 */}
        <div className="mt-20 flex justify-center">
          <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default Founder;
