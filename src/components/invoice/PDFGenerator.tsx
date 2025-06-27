'use client';

import React from 'react';
import { jsPDF } from 'jspdf';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';

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

interface PDFGeneratorProps {
  invoiceData: InvoiceData;
  subtotal: number;
  hstAmount: number;
  totalBeforeDeposit: number;
  total: number;
  deposit: number;
  disabled?: boolean;
}

const PDFGenerator: React.FC<PDFGeneratorProps> = ({
  invoiceData,
  subtotal,
  hstAmount,
  totalBeforeDeposit,
  total,
  deposit,
  disabled = false
}) => {
  const generatePDF = async () => {
    if (disabled) return;

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    
    // 设置默认字体
    pdf.setFont('helvetica');
    
    // 添加Logo - 左上角 (更贴左侧)
    try {
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        logoImg.onload = () => {
          // Logo更贴左侧边缘
          pdf.addImage(logoImg, 'PNG', 10, 15, 70, 21);
          resolve(null);
        };
        logoImg.onerror = reject;
        logoImg.src = '/synthmind_logo.png';
      });
    } catch (error) {
      console.log('Logo加载失败，继续生成PDF');
    }
    
    // Invoice标题和信息 - 右上角
    pdf.setFontSize(28);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Invoice', pageWidth - 20, 25, { align: 'right' });
    
    pdf.setFontSize(9);
    pdf.setTextColor(80, 80, 80);
    pdf.text(`Date: ${invoiceData.invoiceDate}`, pageWidth - 20, 35, { align: 'right' });
    pdf.text('HST Registration: 791547664 RT0001', pageWidth - 20, 43, { align: 'right' });
    pdf.text('synthmind.ca', pageWidth - 20, 51, { align: 'right' });
    pdf.text('info@synthmind.ca', pageWidth - 20, 58, { align: 'right' });
    
    // 分割线
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.5);
    pdf.line(20, 68, pageWidth - 20, 68);
    
    // 客户信息
    let currentY = 78;
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text('BILLED TO:', 20, currentY);
    
    // 公司信息 - FROM 在右侧
    pdf.text('FROM:', pageWidth / 2 + 10, currentY);
    
    currentY += 8;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(invoiceData.clientName, 20, currentY);
    
    // 公司名称
    pdf.text('A GE PROFESSIONAL CORPORATION', pageWidth / 2 + 10, currentY);
    
    // 客户地址
    currentY += 8;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(80, 80, 80);
    const addressLines = invoiceData.clientAddress.split('\n');
    let clientAddressY = currentY;
    addressLines.forEach(line => {
      if (line.trim()) {
        pdf.text(line.trim(), 20, clientAddressY);
        clientAddressY += 7;
      }
    });
    
    // 公司联系信息
    pdf.text('synthmind.ca', pageWidth / 2 + 10, currentY);
    pdf.text('info@synthmind.ca', pageWidth / 2 + 10, currentY + 7);
    
    // 更新currentY到两列中较低的位置
    currentY = Math.max(clientAddressY, currentY + 14);
    
    // 表格开始位置
    currentY += 20;
    
    // 获取有效的服务项目
    const validServices = invoiceData.services?.filter(s => s.serviceName && s.serviceAmount > 0) || [];
    
    // 第一部分：服务项目表格
    const tableX = 20;
    const tableWidth = pageWidth - 40;
    
    // 计算服务项目表格的行数，增加行高以容纳更多内容
    const serviceRowCount = validServices.length > 0 ? validServices.length : 1; // 至少1行（Our Fee）
    const enhancedRowHeight = 18; // 增加行高以容纳三行内容
    const serviceTableHeight = (serviceRowCount + 1) * enhancedRowHeight; // +1 为表头
    
    // 设置表格样式
    pdf.setDrawColor(180, 180, 180);
    pdf.setLineWidth(0.5);
    
    // 服务项目表格头部
    pdf.setFillColor(240, 240, 240);
    pdf.rect(tableX, currentY, tableWidth, enhancedRowHeight, 'F');
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Description', tableX + 5, currentY + 12); // 调整垂直位置
    pdf.text('Amount', tableX + tableWidth - 5, currentY + 12, { align: 'right' });
    
    currentY += enhancedRowHeight;
    
    // 显示服务项目
    if (validServices.length > 0) {
      validServices.forEach(service => {
        pdf.setFillColor(255, 255, 255);
        pdf.rect(tableX, currentY, tableWidth, enhancedRowHeight, 'F');
        
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(0, 0, 0);
        
        // 处理长文本，支持多行显示（最多3行）
        const col1Width = tableWidth * 0.75; // Description列占75%宽度
        const maxWidth = col1Width - 10; // 减去padding
        const lines = pdf.splitTextToSize(service.serviceName, maxWidth);
        const displayLines = lines.slice(0, 3); // 最多显示3行
        
        // 绘制Description文本（支持多行）
        let textY = currentY + 8;
        displayLines.forEach((line: string, lineIndex: number) => {
          pdf.text(line, tableX + 5, textY + (lineIndex * 4));
        });
        
        // Amount列对齐到右侧
        pdf.text(`$ ${service.serviceAmount.toFixed(2)}`, tableX + tableWidth - 5, currentY + 12, { align: 'right' });
        
        currentY += enhancedRowHeight;
      });
    } else {
      // 没有具体服务项时显示"Our Fee"
      pdf.setFillColor(255, 255, 255);
      pdf.rect(tableX, currentY, tableWidth, enhancedRowHeight, 'F');
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Our Fee', tableX + 5, currentY + 12);
      pdf.text(`$ ${subtotal.toFixed(2)}`, tableX + tableWidth - 5, currentY + 12, { align: 'right' });
      
      currentY += enhancedRowHeight;
    }
    
    // 绘制服务项目表格边框
    const serviceTableY = currentY - serviceTableHeight;
    pdf.rect(tableX, serviceTableY, tableWidth, serviceTableHeight);
    
    // 绘制水平线
    for (let i = 1; i <= serviceRowCount; i++) {
      pdf.line(tableX, serviceTableY + (i * enhancedRowHeight), tableX + tableWidth, serviceTableY + (i * enhancedRowHeight));
    }
    
    // 绘制垂直分隔线（Description列占75%，Amount列占25%）
    const col1Width = tableWidth * 0.75;
    pdf.line(tableX + col1Width, serviceTableY, tableX + col1Width, serviceTableY + serviceTableHeight);
    
    // 第二部分：计算汇总区域
    currentY += 10; // 间距
    
    // 计算汇总区域的背景
    let summaryHeight = 20; // 基础高度
    let summaryItems = 1; // HST
    if (validServices.length > 1) summaryItems++; // Subtotal
    if (deposit > 0) summaryItems++; // Deposit
    summaryHeight = summaryItems * 8 + 20; // 每项8pt + 总计区域20pt
    
    pdf.setFillColor(248, 248, 248);
    pdf.rect(tableX, currentY, tableWidth, summaryHeight, 'F');
    
    currentY += 8;
    
    // 如果有多个服务项，显示小计
    if (validServices.length > 1) {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Subtotal', tableX + 10, currentY);
      pdf.text(`$ ${subtotal.toFixed(2)}`, tableX + tableWidth - 10, currentY, { align: 'right' });
      currentY += 8;
      
      // 分隔线
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.3);
      pdf.line(tableX + 10, currentY - 2, tableX + tableWidth - 10, currentY - 2);
    }
    
    // HST
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(80, 80, 80);
    pdf.text('HST @ 13%', tableX + 10, currentY);
    pdf.text(`$ ${hstAmount.toFixed(2)}`, tableX + tableWidth - 10, currentY, { align: 'right' });
    currentY += 8;
    
    // 分隔线
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.3);
    pdf.line(tableX + 10, currentY - 2, tableX + tableWidth - 10, currentY - 2);
    
    // Deposit（如果有）
    if (deposit > 0) {
      pdf.text('Deposit', tableX + 10, currentY);
      pdf.text(`- $ ${deposit.toFixed(2)}`, tableX + tableWidth - 10, currentY, { align: 'right' });
      currentY += 8;
      
      // 分隔线
      pdf.line(tableX + 10, currentY - 2, tableX + tableWidth - 10, currentY - 2);
    }
    
    // 最终总额区域
    currentY += 4;
    pdf.setFillColor(230, 240, 255);
    pdf.rect(tableX + 5, currentY, tableWidth - 10, 16, 'F');
    
    currentY += 6;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Amount Payable (CAD)', tableX + 10, currentY);
    
    currentY += 8;
    pdf.setFontSize(12);
    pdf.setTextColor(0, 100, 200);
    pdf.text(`$ ${total.toFixed(2)}`, tableX + tableWidth - 10, currentY, { align: 'right' });
    
    // 绘制汇总区域边框
    const summaryY = currentY - summaryHeight - 4;
    pdf.setDrawColor(180, 180, 180);
    pdf.setLineWidth(0.5);
    pdf.rect(tableX, summaryY, tableWidth, summaryHeight + 8);
    
    // 付款信息区域
    currentY += 25;
    
    // 背景框 - 调整高度和布局
    pdf.setFillColor(248, 248, 248);
    pdf.rect(20, currentY, pageWidth - 40, 45, 'F');
    
    currentY += 8;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Remittance information on last page', pageWidth / 2, currentY, { align: 'center' });
    
    // 付款条款 - 改善文字布局
    currentY += 10;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.setTextColor(80, 80, 80);
    
    // 分段显示文字，改善换行
    const termsText = 'Accounts shall be due and payable when rendered. Interest shall be calculated at a simple daily rate of 0.0493% (equivalent to 18% per annum). Interest shall be charged and payable at this rate on any part of an account which remains unpaid from thirty (30) days after the invoice date.';
    const lines = pdf.splitTextToSize(termsText, pageWidth - 50);
    pdf.text(lines, 25, currentY);
    currentY += lines.length * 4 + 4;
    
    // 付款方式
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Payment Method:', 25, currentY);
    
    currentY += 5;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.setTextColor(60, 60, 60);
    pdf.text('Email Transfer: age.tax7@gmail.com (A GE PROFESSIONAL CORPORATION)', 25, currentY);
    
    currentY += 4;
    pdf.text('Direct Pay: BMO 30252-001-1986270 (A GE PROFESSIONAL CORPORATION)', 25, currentY);
    
    // 保存PDF
    const fileName = `Invoice_${invoiceData.clientName.replace(/\s+/g, '_')}_${invoiceData.invoiceDate}.pdf`;
    pdf.save(fileName);
  };

  return (
    <div className="space-y-4">
      <button
        onClick={generatePDF}
        disabled={disabled}
        className={`w-full flex items-center justify-center py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${
          disabled
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transform hover:scale-[1.02] shadow-lg hover:shadow-xl'
        }`}
      >
        <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
        {disabled ? 'Please complete invoice information' : 'Generate PDF Invoice'}
      </button>
      
      {disabled && (
        <p className="text-sm text-gray-500 text-center">
          Please fill in client name, service description and amount to generate PDF
        </p>
      )}
    </div>
  );
};

export default PDFGenerator; 