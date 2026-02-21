'use client';

// ─── 可复用联系表单 ───
// 三种变体：full（完整版，/contact 页用）/ mini（侧边栏用）/ inline（CTA 嵌入用）

import React, { useState } from 'react';

type FormVariant = 'full' | 'mini' | 'inline';

interface ContactFormProps {
  variant?: FormVariant;
  /** 表单来源标识，会传给 API */
  source?: string;
}

const inputClass =
  'w-full bg-transparent border-0 border-b border-white/20 px-0 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#3498db] transition-colors text-sm font-light';

const selectClass =
  'w-full bg-transparent border-0 border-b border-white/20 px-0 py-3 text-white/30 focus:outline-none focus:border-[#3498db] transition-colors text-sm font-light appearance-none [&:has(option:checked:not([value=""]))]:text-white';

export default function ContactForm({ variant = 'full', source = 'contact' }: ContactFormProps) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    company: '',
    industry: '',
    budget: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source }),
      });

      if (!res.ok) throw new Error('Failed to send');
      setStatus('sent');
      setForm({ name: '', email: '', subject: '', message: '', company: '', industry: '', budget: '' });
    } catch {
      setStatus('error');
    }
  };

  // ─── 内联版：仅邮箱 + 按钮 ───
  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
        <input
          type="email"
          name="email"
          placeholder="Your email"
          required
          value={form.email}
          onChange={handleChange}
          className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#3498db] transition-colors"
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="bg-[#3498db] hover:bg-[#2980b9] text-white font-light px-6 py-3 rounded-xl transition-all duration-300 disabled:opacity-50 whitespace-nowrap"
        >
          {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Sent!' : 'Get Started'}
        </button>
      </form>
    );
  }

  // ─── 迷你版：名字 + 邮箱 + 一行描述 ───
  if (variant === 'mini') {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <input type="text" name="name" placeholder="Name" required value={form.name} onChange={handleChange} className={inputClass} />
        <input type="email" name="email" placeholder="Email" required value={form.email} onChange={handleChange} className={inputClass} />
        <input type="text" name="message" placeholder="How can we help?" value={form.message} onChange={handleChange} className={inputClass} />
        <button type="submit" disabled={status === 'sending'} className="w-full btn-premium disabled:opacity-50">
          {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Sent!' : 'Send Message'}
        </button>
        {status === 'error' && <p className="text-red-400 text-sm text-center">Something went wrong. Please try again.</p>}
      </form>
    );
  }

  // ─── 完整版 ───
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Name + Email 双列 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <input type="text" name="name" placeholder="Name" required value={form.name} onChange={handleChange} className={inputClass} />
        <input type="email" name="email" placeholder="Email" required value={form.email} onChange={handleChange} className={inputClass} />
      </div>

      {/* Company + Industry 双列 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <input type="text" name="company" placeholder="Company (optional)" value={form.company} onChange={handleChange} className={inputClass} />
        <select name="industry" value={form.industry} onChange={handleChange} className={selectClass}>
          <option value="">Industry (optional)</option>
          <option value="insurance">Insurance</option>
          <option value="real-estate">Real Estate</option>
          <option value="accounting-tax">Accounting & Tax</option>
          <option value="construction">Construction</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Budget */}
      <select name="budget" value={form.budget} onChange={handleChange} className={selectClass}>
        <option value="">Budget Range (optional)</option>
        <option value="under-5k">Under $5,000</option>
        <option value="5k-15k">$5,000 – $15,000</option>
        <option value="15k-50k">$15,000 – $50,000</option>
        <option value="50k+">$50,000+</option>
      </select>

      {/* Subject */}
      <input type="text" name="subject" placeholder="Subject" required value={form.subject} onChange={handleChange} className={inputClass} />

      {/* Message */}
      <textarea
        name="message"
        placeholder="Tell us about your project"
        required
        rows={5}
        value={form.message}
        onChange={handleChange}
        className={`${inputClass} resize-none`}
      />

      {/* 提交 */}
      <div className="flex flex-col items-center gap-4">
        <button type="submit" disabled={status === 'sending'} className="btn-premium disabled:opacity-50 disabled:cursor-not-allowed">
          {status === 'sending' ? 'Sending...' : 'Send Message'}
        </button>
        {status === 'sent' && <span className="text-emerald-400 text-sm font-light">Message sent successfully!</span>}
        {status === 'error' && <span className="text-red-400 text-sm font-light">Something went wrong. Please try again.</span>}
      </div>
    </form>
  );
}
