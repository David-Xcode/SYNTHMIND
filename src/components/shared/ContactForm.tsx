'use client';

// ─── 联系表单 v7 — 单据填写格 ───
// 设计定案：card-system-v7-glass spec §6.2。
// 旧「透明底下划线」字段在砖墙上与背景混融（用户点名病灶），v7 改
// 单据填写格：外置 mono label（Eyebrow tertiary）+ 实底凹格（.form-field，
// 比玻璃卡面深一档）——墙 → 玻璃卡 → 填写格三层拉开。
// 表单是全站唯一联系入口（邮箱已撤下展示）：提交走 Resend 双向确认闭环。

import React, { useEffect, useRef, useState } from 'react';
import Card from './Card';
import Eyebrow from './Eyebrow';
import IconBadge from './IconBadge';
import ModuleButton from './ModuleButton';

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

  // ─── 成功态 — 裸内容（外层页面已有 container 玻璃卡包裹，
  // 此处再套 Card 会出现「玻璃卡套玻璃卡」双层棱线，审查第 1 轮修复）───
  if (status === 'sent') {
    return (
      // biome-ignore lint/a11y/useSemanticElements: <output> only permits phrasing content; this status card holds block children (h3/button), so role="status" on a div is the correct ARIA pattern
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="focus:outline-none text-center py-4"
        style={{ animation: 'scaleIn 0.5s cubic-bezier(0.16,1,0.3,1)' }}
      >
        <IconBadge tone="success" size="lg" className="mx-auto mb-5">
          <svg
            className="w-7 h-7"
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
        </IconBadge>
        <h3 className="text-lg font-medium text-txt-primary mb-2">
          Message Sent
        </h3>
        <p className="text-txt-tertiary text-sm mb-6">
          A confirmation is on its way to your inbox. We&apos;ll get back to
          you within 24 hours.
        </p>
        <ModuleButton variant="secondary" onClick={() => setStatus('idle')}>
          Send another message
        </ModuleButton>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="contact-name" className="block mb-2">
            <Eyebrow tone="tertiary">Name</Eyebrow>
          </label>
          <input
            id="contact-name"
            type="text"
            name="name"
            placeholder="Your name"
            required
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
            className="form-field"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="block mb-2">
            <Eyebrow tone="tertiary">Email</Eyebrow>
          </label>
          <input
            id="contact-email"
            type="email"
            name="email"
            placeholder="you@company.com"
            required
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            className="form-field"
          />
        </div>
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="contact-subject" className="block mb-2">
          <Eyebrow tone="tertiary">Subject</Eyebrow>
        </label>
        <input
          id="contact-subject"
          type="text"
          name="subject"
          placeholder="What's this about?"
          required
          value={form.subject}
          onChange={handleChange}
          className="form-field"
        />
      </div>

      {/* Message */}
      <div>
        <label htmlFor="contact-message" className="block mb-2">
          <Eyebrow tone="tertiary">Message</Eyebrow>
        </label>
        <textarea
          id="contact-message"
          name="message"
          placeholder="Tell us about your project"
          required
          rows={5}
          value={form.message}
          onChange={handleChange}
          className="form-field resize-none"
        />
      </div>

      {/* 提交 */}
      <div className="flex flex-col items-center gap-4 pt-2">
        <ModuleButton
          type="submit"
          disabled={status === 'sending'}
          aria-busy={status === 'sending'}
        >
          {status === 'sending' ? 'Sending...' : 'Send Message'}
        </ModuleButton>
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
