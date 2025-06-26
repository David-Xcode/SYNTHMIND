import React from 'react';
import { 
  ComputerDesktopIcon,
  ArrowPathIcon,
  LightBulbIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const Services: React.FC = () => {
  const services = [
    {
      icon: ComputerDesktopIcon,
      title: 'AI-Driven Software Development',
      description: 'Utilize cutting-edge AI technology to help businesses develop efficient and intelligent software solutions.',
      color: 'text-blue-600'
    },
    {
      icon: ArrowPathIcon,
      title: 'Legacy System Optimization',
      description: 'Transform and upgrade legacy systems in traditional industries to improve operational efficiency and reduce maintenance costs.',
      color: 'text-green-600'
    },
    {
      icon: LightBulbIcon,
      title: 'AI Solution Consulting',
      description: 'Provide professional consulting services for AI technology application and implementation, creating customized solutions for businesses.',
      color: 'text-purple-600'
    },
    {
      icon: ChartBarIcon,
      title: 'Efficiency Enhancement Analysis',
      description: 'Analyze existing business workflows and provide AI optimization recommendations to maximize efficiency.',
      color: 'text-orange-600'
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 节标题 */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
        </div>

        {/* 服务网格 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div 
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                {/* 图标 */}
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                    <IconComponent className={`w-8 h-8 ${service.color}`} />
                  </div>
                </div>

                {/* 标题 */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                  {service.title}
                </h3>

                {/* 描述 */}
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services; 