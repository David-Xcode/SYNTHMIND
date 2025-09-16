import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-32 bg-gradient-to-b from-[#252b3b] to-[#1a1f2e] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 节标题 - 简约优雅 */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-extralight text-white mb-6 tracking-wide">
            About <span className="font-normal">Synthmind</span>
          </h2>
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto"></div>
        </div>

        {/* 主要介绍文字 - 居中简约布局 */}
        <div className="max-w-4xl mx-auto space-y-12">
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed text-center font-light">
            At Synthmind, we are dedicated to enhancing software development efficiency in traditional industries through innovative AI technology. We help businesses eliminate tedious and repetitive tasks, allowing teams to focus on truly value-creating activities.
          </p>

          {/* 使命、愿景、价值观 - 极简卡片设计 */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="group">
              <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] p-8 rounded-lg transition-all duration-500 hover:bg-white/[0.05] hover:border-white/[0.1]">
                <h3 className="text-lg font-medium text-white/90 mb-4 tracking-wide">Our Mission</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Transform traditional industries with AI, optimize legacy systems, and increase efficiency.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] p-8 rounded-lg transition-all duration-500 hover:bg-white/[0.05] hover:border-white/[0.1]">
                <h3 className="text-lg font-medium text-white/90 mb-4 tracking-wide">Our Vision</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Let AI replace inefficient work, enabling humans to focus on creative thinking and decision-making.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] p-8 rounded-lg transition-all duration-500 hover:bg-white/[0.05] hover:border-white/[0.1]">
                <h3 className="text-lg font-medium text-white/90 mb-4 tracking-wide">Our Values</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Drive social progress through technology, ultimately benefiting humanity.
                </p>
              </div>
            </div>
          </div>

          {/* 底部装饰线 */}
          <div className="mt-20 flex justify-center">
            <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;