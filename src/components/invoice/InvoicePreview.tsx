'use client';

import React from 'react';
import Image from 'next/image';

interface ServiceItem {
  serviceName: string;
  serviceAmount: number;
}

interface InvoiceData {
  clientName: string;
  clientAddress: string;
  services: ServiceItem[];
  invoiceDate: string;
  hstRate: number;
  deposit: number;
}

interface InvoicePreviewProps {
  invoiceData: InvoiceData;
  subtotal: number;
  hstAmount: number;
  totalBeforeDeposit: number;
  total: number;
  deposit: number;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  invoiceData,
  subtotal,
  hstAmount,
  totalBeforeDeposit,
  total,
  deposit
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Invoice Preview</h2>
        <div className="text-sm text-gray-500">Live preview of generated invoice</div>
      </div>
      
      <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden shadow-sm">
        {/* 发票头部 - 公司信息 */}
        <div className="p-8 bg-white border-b border-gray-100">
          <div className="flex justify-between items-start">
            {/* Logo 区域 - 更贴左侧 */}
            <div className="flex-shrink-0 -ml-4">
              <Image
                src="/synthmind_logo.png"
                alt="Synthmind Logo"
                width={200}
                height={60}
                className="object-contain"
              />
            </div>

            {/* Invoice 信息区域 - 右上角 */}
            <div className="text-right">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Invoice</h2>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">Date:</span> {invoiceData.invoiceDate}</p>
                <p><span className="font-medium">HST Registration:</span> 791547664 RT0001</p>
                <div className="mt-3 text-sm text-gray-600 space-y-1">
                  <p>synthmind.ca</p>
                  <p>info@synthmind.ca</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 客户信息 */}
        <div className="p-6 border-b border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 客户信息 - 左侧 */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">BILLED TO:</p>
              <div className="text-gray-900">
                <p className="font-medium text-lg">{invoiceData.clientName || 'Client Name'}</p>
                <div className="mt-2 text-sm whitespace-pre-line text-gray-600">
                  {invoiceData.clientAddress || 'Client Address'}
                </div>
              </div>
            </div>
            
            {/* 公司信息 - 右侧 */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">FROM:</p>
              <div className="text-gray-900">
                <p className="font-medium text-lg">A GE PROFESSIONAL CORPORATION</p>
                <div className="mt-2 text-sm text-gray-600 space-y-1">
                  <p>synthmind.ca</p>
                  <p>info@synthmind.ca</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 金额明细 */}
        <div className="p-6">
          <div className="space-y-4">
            {/* 服务项目表格 */}
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <table className="w-full table-fixed">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-300">
                    <th className="text-left py-4 px-4 font-medium text-gray-900 w-3/4">Description</th>
                    <th className="text-right py-4 px-4 font-medium text-gray-900 w-1/4">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {/* 显示所有具体的服务项目 */}
                  {invoiceData.services && invoiceData.services.length > 0 ? (
                    invoiceData.services.map((service, index) => (
                      service.serviceName && service.serviceAmount > 0 ? (
                        <tr key={index} className="border-b border-gray-200 last:border-b-0">
                          <td className="py-4 px-4 text-gray-700 align-top">
                            <div className="min-h-[3rem] flex items-start">
                              <span className="leading-relaxed">{service.serviceName}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right font-mono align-top">
                            <div className="min-h-[3rem] flex items-start justify-end">
                              <span>$ {service.serviceAmount.toFixed(2)}</span>
                            </div>
                          </td>
                        </tr>
                      ) : null
                    ))
                  ) : (
                    /* 如果没有服务项目，显示默认的 Our Fee */
                    <tr className="border-b border-gray-200 last:border-b-0">
                      <td className="py-4 px-4 text-gray-700 align-top">
                        <div className="min-h-[3rem] flex items-start">
                          <span className="leading-relaxed">Our Fee</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right font-mono align-top">
                        <div className="min-h-[3rem] flex items-start justify-end">
                          <span>$ {subtotal.toFixed(2)}</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* 计算汇总区域 */}
            <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
              <div className="px-6 py-4 space-y-3">
                {/* 如果有多个服务项，显示小计 */}
                {invoiceData.services && invoiceData.services.filter(s => s.serviceName && s.serviceAmount > 0).length > 1 && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="font-medium text-gray-700">Subtotal</span>
                    <span className="font-mono font-medium">$ {subtotal.toFixed(2)}</span>
                  </div>
                )}
                
                {/* HST */}
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">HST @ {invoiceData.hstRate}%</span>
                  <span className="font-mono">$ {hstAmount.toFixed(2)}</span>
                </div>
                
                {/* Deposit（如果有） */}
                {deposit > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-700">Deposit</span>
                    <span className="font-mono">- $ {deposit.toFixed(2)}</span>
                  </div>
                )}
                
                {/* 最终总额 */}
                <div className="flex justify-between items-center py-3 bg-blue-50 rounded-lg px-4 mt-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900 text-lg">Amount Payable (CAD)</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-xl font-mono text-blue-600">$ {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 付款条款 */}
            <div className="mt-6 text-xs text-gray-600 bg-gray-50 p-6 rounded-lg">
              <p className="font-medium text-center text-gray-700 mb-4">Remittance information on last page</p>
              <div className="space-y-3 text-justify leading-relaxed">
                <p>
                  Accounts shall be due and payable when rendered. Interest shall be calculated at a simple daily rate of 
                  0.0493% (equivalent to 18% per annum). Interest shall be charged and payable at this rate on any part 
                  of an account which remains unpaid from thirty (30) days after the invoice date to the date on which 
                  the entire account is paid.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-300">
                <p className="font-medium text-gray-700 mb-2">Payment Method:</p>
                <div className="space-y-1">
                  <p>Email Transfer: age.tax7@gmail.com (A GE PROFESSIONAL CORPORATION)</p>
                  <p>Direct Pay: BMO 30252-001-1986270 (A GE PROFESSIONAL CORPORATION)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview; 