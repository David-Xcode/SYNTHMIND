'use client';

// ─── 联系表单 v2 ───
// 蓝色中心展开 focus 下划线 / 成功态变换动画
// 此前的 mini/inline 变体全站零调用，已删除 — 仅保留完整表单

import React, { useEffect, useRef, useState } from 'react';

// 带 focus 动画的输入框样式
const inputClass =
  'w-full bg-transparent border-0 border-b border-accent/[0.10] px-0 py-3 text-txt-primary placeholder-txt-quaternary focus:outline-none text-sm transition-colors duration-300';

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<
    'idle' | 'sending' | 'sent' | 'error' | 'timeout'
  >('idle');
  const successRef = useRef<HTMLDivElement>(null);

  // 成功后把焦点移到状态卡片：原焦点在已卸载的提交按钮上会丢失，
  // 移焦同时让屏幕阅读器（role="status"）播报发送成功
  useEffect(() => {
    if (status === 'sent') successRef.current?.focus();
  }, [status]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
        body: JSON.stringify({ ...form, source: 'contact-page' }),
        signal: controller.signal,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to send');
      }
      setStatus('sent');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      // 区分超时 vs 其他错误
      if (err instanceof DOMException && err.name === 'AbortError') {
        setStatus('timeout');
      } else {
        setStatus('error');
      }
    } finally {
      clearTimeout(timeout);
    }
  };

  // ─── 成功态 ───
  if (status === 'sent') {
    return (
      // biome-ignore lint/a11y/useSemanticElements: <output> only permits phrasing content; this status card holds block children (h3/button), so role="status" on a div is the correct ARIA pattern
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="card-elevated p-8 text-center focus:outline-none"
        style={{ animation: 'scaleIn 0.5s cubic-bezier(0.16,1,0.3,1)' }}
      >
        <div className="w-14 h-14 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center mx-auto mb-5">
          <svg
            className="w-7 h-7 text-emerald-400"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-txt-primary mb-2">
          Message Sent
        </h3>
        <p className="text-txt-tertiary text-sm mb-6">
          We&apos;ll get back to you within 24 hours.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="btn-secondary text-sm px-5 py-2"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
        <div className="input-group">
          <input
            type="text"
            name="name"
            placeholder="Name"
            required
            value={form.name}
            onChange={handleChange}
            aria-label="Name"
            className={inputClass}
          />
          <div className="focus-line" />
        </div>
        <div className="input-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={handleChange}
            aria-label="Email"
            className={inputClass}
          />
          <div className="focus-line" />
        </div>
      </div>

      {/* Subject */}
      <div className="input-group">
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          required
          value={form.subject}
          onChange={handleChange}
          aria-label="Subject"
          className={inputClass}
        />
        <div className="focus-line" />
      </div>

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
        <button
          type="submit"
          disabled={status === 'sending'}
          aria-busy={status === 'sending'}
          className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'sending' ? 'Sending...' : 'Send Message'}
        </button>
        {(status === 'error' || status === 'timeout') && (
          <span role="alert" className="text-red-400 text-sm">
            {status === 'timeout'
              ? 'Request timed out. Please check your connection and try again.'
              : 'Something went wrong. Please try again.'}
          </span>
        )}
      </div>
    </form>
  );
}
