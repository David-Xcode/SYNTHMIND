import React from 'react';

const Hero: React.FC = () => {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center text-center px-4 overflow-hidden">
      {/* 渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-blue-600"></div>
      
      {/* 动态渐变效果 */}
      <div className="absolute inset-0 bg-gradient-to-45 from-slate-800/10 via-slate-600/10 to-blue-500/10 animate-gradient-x bg-[length:200%_200%]"></div>
      
      {/* 内容容器 */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="bg-white/15 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-100 bg-clip-text text-transparent leading-tight">
            Reshaping the Future with AI
          </h1>
          
          <p className="text-xl md:text-2xl mb-6 text-white/90 font-medium">
            Infusing Traditional Industries with Intelligent Technology
          </p>
          
          <div className="max-w-2xl mx-auto mb-8">
            <p className="text-lg text-white/80 leading-relaxed">
              We empower software development with AI, optimize legacy systems, improve efficiency, and liberate human creativity.
            </p>
          </div>
          
          <button
            onClick={scrollToContact}
            className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Contact Us
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* 装饰性脑电波元素 */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 opacity-30">
        <svg width="200" height="40" viewBox="0 0 200 40" className="text-white">
          <path 
            d="M10,20 C25,20 35,10 50,10 C65,10 75,25 90,25 C105,25 115,10 130,10 C145,10 155,20 170,20" 
            stroke="currentColor" 
            strokeWidth="2" 
            fill="none"
            className="animate-pulse"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero; 