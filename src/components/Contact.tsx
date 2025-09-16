'use client';

import React, { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

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
            Whether you want to learn more about our services or are ready to begin your AI transformation journey, we're eager to hear your ideas.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* 联系表单 - 极简设计 */}
          <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] p-10 rounded-lg">

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-xs font-light text-white/60 mb-2 uppercase tracking-wider">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-0 py-2 bg-transparent border-0 border-b border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-light text-white/60 mb-2 uppercase tracking-wider">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-0 py-2 bg-transparent border-0 border-b border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-xs font-light text-white/60 mb-2 uppercase tracking-wider">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-0 py-2 bg-transparent border-0 border-b border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-light text-white/60 mb-2 uppercase tracking-wider">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="w-full px-0 py-2 bg-transparent border-0 border-b border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-light tracking-wider uppercase text-sm transition-all duration-500 hover:bg-white/20 hover:border-white/30 ${
                    isSubmitting
                      ? 'cursor-not-allowed opacity-50'
                      : ''
                  }`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>

              {/* 状态消息 - 极简设计 */}
              {submitStatus === 'success' && (
                <div className="p-4 bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
                  Thank you. Your message has been sent.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  Sorry, there was an error. Please try again.
                </div>
              )}
            </form>
          </div>
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