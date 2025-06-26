import React from 'react';
import { 
  LightBulbIcon, 
  BoltIcon, 
  CodeBracketIcon, 
  CogIcon 
} from '@heroicons/react/24/outline';

const About: React.FC = () => {
  const iconComponents = [
    { icon: LightBulbIcon, color: 'text-blue-500' },
    { icon: BoltIcon, color: 'text-purple-500' },
    { icon: CodeBracketIcon, color: 'text-green-500' },
    { icon: CogIcon, color: 'text-orange-500' }
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 节标题 */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About Synthmind
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* 左侧文字内容 */}
          <div className="space-y-8">
            <p className="text-lg text-gray-700 leading-relaxed">
              At Synthmind, we are dedicated to enhancing software development efficiency in traditional industries through innovative AI technology. We help businesses eliminate tedious and repetitive tasks, allowing teams to focus on truly value-creating activities. We believe that AI will be a crucial force in driving social and technological progress.
            </p>

            {/* 使命、愿景、价值观 */}
            <div className="grid gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-bold text-blue-600 mb-3">Our Mission</h3>
                <p className="text-gray-700">
                  Transform traditional industries with AI, optimize legacy systems, and increase efficiency.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-bold text-purple-600 mb-3">Our Vision</h3>
                <p className="text-gray-700">
                  Let AI replace inefficient, repetitive, and meaningless work, enabling humans to focus more on creative thinking and decision-making.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-bold text-green-600 mb-3">Our Values</h3>
                <p className="text-gray-700">
                  Drive social progress through technology, ultimately benefiting humanity.
                </p>
              </div>
            </div>
          </div>

          {/* 右侧技术图标 */}
          <div className="flex justify-center">
            <div className="grid grid-cols-2 gap-8 max-w-md">
              {iconComponents.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div 
                    key={index}
                    className="w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-300 hover:shadow-xl"
                  >
                    <IconComponent className={`w-16 h-16 ${item.color}`} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About; 