'use client';

// ─── 可复用联系表单 v2 ───
// 蓝色中心展开 focus 下划线 / 成功态变换动画

import React, { useState } from 'react';

type FormVariant = 'full' | 'mini' | 'inline';

interface ContactFormProps {
  variant?: FormVariant;
  source?: string;
}

// 带 focus 动画的输入框样式
const inputClass =
  'w-full bg-transparent border-0 border-b border-accent/[0.10] px-0 py-3 text-txt-primary placeholder-txt-quaternary focus:outline-none text-sm transition-colors duration-300';

export default function ContactForm({ variant = 'full', source = 'contact' }: ContactFormProps) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
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

    // 10 秒超时保护 — 防止 API 挂起时用户无限等待
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error('Failed to send');
      setStatus('sent');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    } finally {
      clearTimeout(timeout);
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
          className="flex-1 bg-accent/[0.04] border border-accent/[0.08] rounded-lg px-4 py-3 text-txt-primary placeholder-txt-quaternary text-sm focus:outline-none focus:border-accent/50 transition-colors"
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="btn-primary px-6 py-3 disabled:opacity-50 whitespace-nowrap"
        >
          {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Sent!' : 'Get Started'}
        </button>
      </form>
    );
  }

  // ─── 迷你版 ───
  if (variant === 'mini') {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="input-group"><input type="text" name="name" placeholder="Name" required value={form.name} onChange={handleChange} className={inputClass} /><div className="focus-line" /></div>
        <div className="input-group"><input type="email" name="email" placeholder="Email" required value={form.email} onChange={handleChange} className={inputClass} /><div className="focus-line" /></div>
        <div className="input-group"><input type="text" name="message" placeholder="How can we help?" value={form.message} onChange={handleChange} className={inputClass} /><div className="focus-line" /></div>
        <button type="submit" disabled={status === 'sending'} className="w-full btn-primary disabled:opacity-50">
          {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Sent!' : 'Send Message'}
        </button>
        {status === 'error' && <p className="text-red-400 text-sm text-center">Something went wrong. Please try again.</p>}
      </form>
    );
  }

  // ─── 成功态 ───
  if (status === 'sent') {
    return (
      <div className="card-elevated p-8 text-center" style={{ animation: 'scaleIn 0.5s cubic-bezier(0.16,1,0.3,1)' }}>
        <div className="w-14 h-14 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-emerald-400" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-txt-primary mb-2">Message Sent</h3>
        <p className="text-txt-tertiary text-sm mb-6">We&apos;ll get back to you within 24 hours.</p>
        <button
          onClick={() => setStatus('idle')}
          className="btn-secondary text-sm px-5 py-2"
        >
          Send another message
        </button>
      </div>
    );
  }

  // ─── 完整版 ───
  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {/* 每个输入框包装在 input-group 中，实现 focus 下划线动画 */}
      <style jsx>{`
        .input-group { position: relative; }
        .focus-line {
          position: absolute;
          bottom: 0;
          left: 50%;
          right: 50%;
          height: 1px;
          background: var(--accent);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
        }
        .input-group:focus-within .focus-line {
          left: 0;
          right: 0;
        }
      `}</style>

      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
        <div className="input-group"><input type="text" name="name" placeholder="Name" required value={form.name} onChange={handleChange} aria-label="Name" className={inputClass} /><div className="focus-line" /></div>
        <div className="input-group"><input type="email" name="email" placeholder="Email" required value={form.email} onChange={handleChange} aria-label="Email" className={inputClass} /><div className="focus-line" /></div>
      </div>

      {/* Subject */}
      <div className="input-group"><input type="text" name="subject" placeholder="Subject" required value={form.subject} onChange={handleChange} aria-label="Subject" className={inputClass} /><div className="focus-line" /></div>

      {/* Message */}
      <div className="input-group">
        <textarea
          name="message"
          placeholder="Tell us about your project"
          required
          rows={5}
          value={form.message}
          onChange={handleChange}
          aria-label="Message"
          className={`${inputClass} resize-none`}
        />
        <div className="focus-line" />
      </div>

      {/* 提交 */}
      <div className="flex flex-col items-center gap-4">
        <button type="submit" disabled={status === 'sending'} className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed">
          {status === 'sending' ? 'Sending...' : 'Send Message'}
        </button>
        {status === 'error' && <span className="text-red-400 text-sm">Something went wrong. Please try again.</span>}
      </div>
    </form>
  );
}
