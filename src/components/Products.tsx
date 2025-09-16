'use client';

import React from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  url: string;
  logo: string;
}

const Products: React.FC = () => {
  const products: Product[] = [
    {
      id: 'easysign',
      name: 'Easy-Sign',
      description: '电子签名解决方案，简化文档签署流程',
      url: 'https://www.easy-sign.ca/',
      logo: '/product/easy-sign.png'
    },
    {
      id: 'tonesubmit',
      name: 'T-ONE Submit',
      description: '房地产内部文档管理系统，安全高效提交',
      url: 'https://www.t-onegroup.com/',
      logo: '/product/T_One.png'
    },
    {
      id: 'onest',
      name: 'Onest Insurance',
      description: '综合保险经纪平台，30+合作公司选择',
      url: 'https://www.onestinsurance.ca/',
      logo: '/product/onest-logo-cropped.svg'
    },
    {
      id: 'brokertool',
      name: 'BrokerTool.ai',
      description: '保险经纪AI工具平台，免费管理自动化',
      url: 'https://brokertool.ai/',
      logo: '/product/brokertool.png'
    }
  ];

  return (
    <section id="products" className="py-32 bg-gradient-to-b from-[#252b3b] to-[#1a1f2e] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 节标题 - 简约优雅 */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-extralight text-white mb-6 tracking-wide">
            Our <span className="font-normal">Products and Services</span>
          </h2>
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto"></div>
        </div>

        {/* 产品展示 - 极简横向布局 */}
        <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-12 max-w-4xl mx-auto">
          {products.map((product) => (
            <a
              key={product.id}
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className="relative">
                {/* Logo - 更紧凑的设计 */}
                <div className="w-36 h-20 flex items-center justify-center transition-all duration-500 group-hover:scale-110">
                  <img
                    src={product.logo}
                    alt={`${product.name} logo`}
                    className="object-contain h-full w-auto max-w-full filter brightness-0 invert opacity-60 group-hover:opacity-90 transition-all duration-500"
                  />
                </div>
                {/* 底部微妙的线条 */}
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-[1px] bg-white/40 transition-all duration-500 group-hover:w-full"></div>
              </div>
            </a>
          ))}
        </div>

        {/* 副标题 - 极简文字说明 */}
        <p className="text-center text-white/30 mt-16 text-xs font-light tracking-wider uppercase">
          Transforming Industries Through Innovation
        </p>

        {/* 底部装饰线 */}
        <div className="mt-16 flex justify-center">
          <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export default Products;