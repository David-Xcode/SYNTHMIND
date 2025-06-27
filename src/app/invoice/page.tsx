'use client';

import React, { useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PasswordProtection from '@/components/invoice/PasswordProtection';
import InvoiceForm from '@/components/invoice/InvoiceForm';
import InvoicePreview from '@/components/invoice/InvoicePreview';
import PDFGenerator from '@/components/invoice/PDFGenerator';

// 服务项目接口
interface ServiceItem {
  serviceName: string;
  serviceAmount: number;
}

// 发票数据接口
interface InvoiceData {
  clientName: string;
  clientAddress: string;
  services: ServiceItem[];
  invoiceDate: string;
  hstRate: number;
  deposit: number;
}

const InvoicePage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    clientName: '',
    clientAddress: '',
    services: [{ serviceName: '', serviceAmount: 0 }], // 默认一个服务项
    invoiceDate: new Date().toISOString().split('T')[0],
    hstRate: 13, // 默认13% HST税率
    deposit: 0
  });

  // 处理表单输入
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInvoiceData(prev => ({
      ...prev,
      [name]: name === 'deposit' ? parseFloat(value) || 0 : value
    }));
  };

  // 处理服务项更改
  const handleServiceChange = (index: number, field: string, value: string | number) => {
    setInvoiceData(prev => ({
      ...prev,
      services: prev.services.map((service, i) => 
        i === index ? { ...service, [field]: value } : service
      )
    }));
  };

  // 添加服务项
  const handleAddService = () => {
    if (invoiceData.services.length < 3) {
      setInvoiceData(prev => ({
        ...prev,
        services: [...prev.services, { serviceName: '', serviceAmount: 0 }]
      }));
    }
  };

  // 删除服务项
  const handleRemoveService = (index: number) => {
    if (invoiceData.services.length > 1) {
      setInvoiceData(prev => ({
        ...prev,
        services: prev.services.filter((_, i) => i !== index)
      }));
    }
  };

  // 计算金额
  const calculateAmounts = () => {
    const subtotal = invoiceData.services.reduce((sum, service) => sum + (service.serviceAmount || 0), 0);
    const hstAmount = subtotal * (invoiceData.hstRate / 100);
    const totalBeforeDeposit = subtotal + hstAmount;
    const total = totalBeforeDeposit - invoiceData.deposit;
    return { subtotal, hstAmount, totalBeforeDeposit, total, deposit: invoiceData.deposit };
  };

  // 检查是否可以生成PDF
  const isFormValid = () => {
    return invoiceData.clientName.trim() !== '' && 
           invoiceData.services.some(service => service.serviceName.trim() !== '' && service.serviceAmount > 0);
  };

  // 如果未认证，显示密码保护页面
  if (!isAuthenticated) {
    return <PasswordProtection onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  const { subtotal, hstAmount, totalBeforeDeposit, total, deposit } = calculateAmounts();

  // 主发票生成界面
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* 页面头部 */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <a 
                  href="/"
                  className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeftIcon className="w-5 h-5 mr-2" />
                  Back to Home
                </a>
                <div className="h-6 w-px bg-gray-300"></div>
                <h1 className="text-2xl font-bold text-gray-900">Invoice Generator</h1>
              </div>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Logout
              </button>
            </div>
            <p className="mt-2 text-gray-600">Generate professional invoices for Synthmind</p>
          </div>

          {/* 主要内容区域 */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* 左侧 - 表单输入 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <InvoiceForm 
                invoiceData={invoiceData}
                onInputChange={handleInputChange}
                onServiceChange={handleServiceChange}
                onAddService={handleAddService}
                onRemoveService={handleRemoveService}
              />
            </div>

            {/* 右侧 - 预览和生成 */}
            <div className="space-y-6">
              {/* 发票预览 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <InvoicePreview 
                  invoiceData={invoiceData}
                  subtotal={subtotal}
                  hstAmount={hstAmount}
                  totalBeforeDeposit={totalBeforeDeposit}
                  total={total}
                  deposit={deposit}
                />
              </div>

              {/* PDF生成按钮 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <PDFGenerator 
                  invoiceData={invoiceData}
                  subtotal={subtotal}
                  hstAmount={hstAmount}
                  totalBeforeDeposit={totalBeforeDeposit}
                  total={total}
                  deposit={deposit}
                  disabled={!isFormValid()}
                />
              </div>
            </div>
          </div>

          {/* 页面底部提示 */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Generated invoices will include Synthmind branding and professional layout
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default InvoicePage; 