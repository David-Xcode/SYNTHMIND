'use client';

import React from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

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

interface InvoiceFormProps {
  invoiceData: InvoiceData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onServiceChange: (index: number, field: string, value: string | number) => void;
  onAddService: () => void;
  onRemoveService: (index: number) => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ 
  invoiceData, 
  onInputChange, 
  onServiceChange, 
  onAddService, 
  onRemoveService 
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Invoice Details</h2>
        <div className="text-sm text-gray-500">Enter invoice information</div>
      </div>
      
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Client Name
          </label>
          <input
            type="text"
            name="clientName"
            value={invoiceData.clientName}
            onChange={onInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Enter client name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Client Address
          </label>
          <textarea
            name="clientAddress"
            value={invoiceData.clientAddress}
            onChange={onInputChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            placeholder="Enter client address&#10;Support multiple lines"
          />
        </div>
        
        {/* 服务项目列表 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Services
            </label>
            {invoiceData.services.length < 3 && (
              <button
                type="button"
                onClick={onAddService}
                className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4 mr-1" />
                Add Service
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            {invoiceData.services.map((service, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Service {index + 1}</span>
                  {invoiceData.services.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRemoveService(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Description
                    </label>
                    <input
                      type="text"
                      value={service.serviceName}
                      onChange={(e) => onServiceChange(index, 'serviceName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="e.g., Federal and Ontario Corporation Income Tax Return (T2)"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount ($)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={service.serviceAmount || ''}
                        onChange={(e) => onServiceChange(index, 'serviceAmount', parseFloat(e.target.value) || 0)}
                        step="0.01"
                        min="0"
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
         
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deposit ($)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              name="deposit"
              value={invoiceData.deposit || ''}
              onChange={onInputChange}
              step="0.01"
              min="0"
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="0.00"
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">Optional: Amount already received as deposit</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Invoice Date
          </label>
          <input
            type="date"
            name="invoiceDate"
            value={invoiceData.invoiceDate}
            onChange={onInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm; 