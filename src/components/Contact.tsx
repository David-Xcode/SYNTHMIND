'use client';

import React, { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type ContactField<Name extends keyof FormData> = {
  name: Name;
  label: string;
  placeholder: string;
  autoComplete?: string;
  layout: 'grid' | 'full';
  component: 'input' | 'textarea';
  type?: string;
  rows?: number;
};

const CONTACT_FIELDS: ContactField<keyof FormData>[] = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Your name',
    autoComplete: 'name',
    layout: 'grid',
    component: 'input',
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'your@email.com',
    autoComplete: 'email',
    layout: 'grid',
    component: 'input',
  },
  {
    name: 'subject',
    label: 'Subject',
    type: 'text',
    placeholder: 'How can we help?',
    autoComplete: 'off',
    layout: 'full',
    component: 'input',
  },
  {
    name: 'message',
    label: 'Message',
    placeholder: 'Tell us about your project...',
    layout: 'full',
    component: 'textarea',
    rows: 4,
  },
];

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      console.log('Sending contact form:', formData); // 调试信息

      // 使用Next.js API路由 - 无需区分环境
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status); // 调试信息
      console.log('Response headers:', response.headers); // 调试信息

      // 检查响应是否为空或不是JSON
      const contentType = response.headers.get('content-type');
      let result;

      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        // 如果不是JSON，读取为文本
        const text = await response.text();
        console.log('Non-JSON response:', text);
        result = { success: false, error: `Server returned ${response.status}: ${text || 'No content'}` };
      }

      if (response.ok && result.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        console.log('Email sent successfully:', result.data);
      } else {
        console.error('Email sending failed:', result.error || result.details || `HTTP ${response.status}`);
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32 bg-gradient-to-b from-[#252b3b] to-[#1a1f2e] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 节标题 - 简约优雅 */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-extralight text-white mb-6 tracking-wide">
            Contact <span className="font-normal">Us</span>
          </h2>
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto"></div>
          <p className="max-w-3xl mx-auto mt-8 text-lg text-gray-300 font-light leading-relaxed">
            Whether you want to learn more about our services or are ready to begin your AI transformation journey, we&apos;re eager to hear your ideas.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          {/* 联系表单 - 极简设计，去除卡片容器 */}
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                {CONTACT_FIELDS
                  .filter((field) => field.layout === 'grid')
                  .map((field) => (
                    <div key={field.name}>
                      <label htmlFor={field.name} className="block text-xs font-light text-white/60 mb-2 uppercase tracking-wider">
                        {field.label}
                      </label>
                      <input
                        type={field.type ?? 'text'}
                        id={field.name}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                        required
                        autoComplete={field.autoComplete}
                        className="w-full px-0 py-2 bg-transparent border-0 border-b border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors"
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
              </div>

              {CONTACT_FIELDS
                .filter((field) => field.layout === 'full' && field.component === 'input')
                .map((field) => (
                  <div key={field.name}>
                    <label htmlFor={field.name} className="block text-xs font-light text-white/60 mb-2 uppercase tracking-wider">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      id={field.name}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      required
                      autoComplete={field.autoComplete}
                      className="w-full px-0 py-2 bg-transparent border-0 border-b border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors"
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}

              {CONTACT_FIELDS
                .filter((field) => field.layout === 'full' && field.component === 'textarea')
                .map((field) => (
                  <div key={field.name}>
                    <label htmlFor={field.name} className="block text-xs font-light text-white/60 mb-2 uppercase tracking-wider">
                      {field.label}
                    </label>
                    <textarea
                      id={field.name}
                      name={field.name}
                      rows={field.rows}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      required
                      className="w-full px-0 py-2 bg-transparent border-0 border-b border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors resize-none"
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`py-3 px-8 text-white/70 font-light tracking-wider text-sm transition-all duration-300 hover:text-white border-b border-white/20 hover:border-white/50 ${
                    isSubmitting
                      ? 'cursor-not-allowed opacity-50'
                      : ''
                  }`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message →'}
                </button>
              </div>

              {/* 状态消息 - 极简设计 */}
              {submitStatus === 'success' && (
                <p className="text-green-400/80 text-sm font-light">
                  Thank you. Your message has been sent.
                </p>
              )}

              {submitStatus === 'error' && (
                <p className="text-red-400/80 text-sm font-light">
                  Sorry, there was an error. Please try again.
                </p>
              )}
            </form>
        </div>

        {/* 底部装饰线 */}
        <div className="mt-20 flex justify-center">
          <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
