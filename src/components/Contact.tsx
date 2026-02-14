'use client';

import React, { useEffect, useRef, useState } from 'react';

// 共享输入框样式：无边框 + 底部分割线 + 聚焦高亮
const inputClass =
  'w-full bg-transparent border-0 border-b border-white/20 px-0 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#3498db] transition-colors text-sm font-light';

const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Failed to send');
      setStatus('sent');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-32 bg-gradient-to-b from-[#1a1f2e] to-[#252b3b] relative overflow-hidden"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 节标题 */}
        <div
          className={`text-center mb-20 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-5xl md:text-6xl font-extralight text-white mb-6 tracking-wide">
            Let&apos;s <span className="font-normal">Talk</span>
          </h2>
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto"></div>
          <p className="max-w-3xl mx-auto mt-8 text-lg text-gray-300 font-light leading-relaxed">
            Have a question or ready to start your AI journey? Drop us a message.
          </p>
        </div>

        {/* 联系表单 */}
        <form
          onSubmit={handleSubmit}
          className={`space-y-8 transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Name + Email 双列 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <input
              type="text"
              name="name"
              placeholder="Name"
              required
              value={form.name}
              onChange={handleChange}
              className={inputClass}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Subject 全宽 */}
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            required
            value={form.subject}
            onChange={handleChange}
            className={inputClass}
          />

          {/* Message 全宽 */}
          <textarea
            name="message"
            placeholder="Message"
            required
            rows={5}
            value={form.message}
            onChange={handleChange}
            className={`${inputClass} resize-none`}
          />

          {/* 提交按钮 + 状态 */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={status === 'sending'}
              className="btn-premium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'sending' ? 'Sending...' : 'Send Message'}
            </button>

            {status === 'sent' && (
              <span className="text-emerald-400 text-sm font-light">
                Message sent successfully!
              </span>
            )}
            {status === 'error' && (
              <span className="text-red-400 text-sm font-light">
                Something went wrong. Please try again.
              </span>
            )}
          </div>
        </form>

        {/* 底部装饰线 */}
        <div className="mt-20 flex justify-center">
          <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
