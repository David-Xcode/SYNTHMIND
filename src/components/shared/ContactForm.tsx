'use client';

// ─── 联系表单 v7 — 单据填写格 ───
// 设计定案：card-system-v7-glass spec §6.2。
// 旧「透明底下划线」字段在满铺背景上混融（用户点名病灶），v7 改
// 单据填写格：外置 mono label（Eyebrow tertiary）+ 实底凹格（.form-field，
// 比玻璃卡面深一档）——背景 → 玻璃卡 → 填写格三层拉开。
// 表单是全站唯一联系入口（邮箱已撤下展示）：提交后先发管理员通知，送达后再发
// 一封**正文零用户内容回显**的客户回执（2026-07-28 恢复；旧回执因原样回显
// Subject/Message 成为发信中继放大器而于 2026-07-27 删除，纪律见 email-templates.ts 头）。
// 🚨 成功文案必须跟着服务端的 receiptSent 走，不能写死承诺确认信 —— 回执是
// 尽力而为的第二封，发失败时提交仍算成功，此时承诺一封没发出的信就是在骗用户。
// 校验上限/邮箱形态/蜜罐字段名全部从 @/lib/contact-form 取，与服务端同源。

import React, { useEffect, useRef, useState } from 'react';
import {
  EMAIL_PATTERN,
  FIELD_LIMITS,
  HONEYPOT_FIELD,
} from '@/lib/contact-form';
import Eyebrow from './Eyebrow';
import IconBadge from './IconBadge';
import ModuleButton from './ModuleButton';

const ERROR_ID = 'contact-form-error';

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle',
  );
  // 服务端返回的具体原因（字段超长 / 邮箱格式 / 限流 / 服务不可用）——
  // 此前全部被吞成一句 "Something went wrong"，用户只能盲目重试。
  const [errMsg, setErrMsg] = useState<string | null>(null);
  // 服务端是否确实发出了客户回执。仅在 true 时才承诺「确认信已发出」；
  // 回执失败与机器人假成功路径都会落在 false，一律走中性文案。
  const [receiptSent, setReceiptSent] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);
  // 蜜罐值走 ref（不进受控 state，避免真人路径多一次渲染）
  const honeypotRef = useRef<HTMLInputElement>(null);
  // 挂载时刻 — 提交耗时的基准。在 effect 里取值，避免拿到 SSR 时的时间戳。
  const mountedAtRef = useRef(0);

  useEffect(() => {
    mountedAtRef.current = Date.now();
  }, []);

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

  const fail = (msg: string) => {
    setStatus('error');
    setErrMsg(msg);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 客户端先做与服务端同口径的收敛：required 对纯空格无效，
    // 服务端会 400，白让用户等一个来回
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
    };
    if (
      !payload.name ||
      !payload.email ||
      !payload.subject ||
      !payload.message
    ) {
      fail('Please fill in every field.');
      return;
    }

    setStatus('sending');
    setErrMsg(null);

    // 超时保护 — 防止 API 挂起时用户无限等待。
    // 🚨 15s 而非 10s：本计时从 fetch **之前**起表，除服务端执行时间外还要
    // 覆盖连接建立、边缘路由与冷启动（后者不计进服务端 maxDuration）。
    // 服务端两根死线之和 8.5s + 2s 冷启动已逼近 10s——按旧值会出现「两封信
    // 其实都发了、用户却看到超时失败并重试」的最坏情形。
    // 不变量：NOTIFY + RECEIPT < maxDuration < 此值（正本在 api/contact/route.ts）。
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          [HONEYPOT_FIELD]: honeypotRef.current?.value ?? '',
          elapsedMs: mountedAtRef.current
            ? Date.now() - mountedAtRef.current
            : undefined,
        }),
        signal: controller.signal,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        // 只回显服务端的 error 字段（设计给用户看的文案），不碰 details
        throw new Error(
          typeof data?.error === 'string' && data.error ? data.error : '',
        );
      }
      setStatus('sent');
      setErrMsg(null);
      setReceiptSent(data?.receiptSent === true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        fail('Request timed out. Please check your connection and try again.');
      } else {
        fail(
          (err instanceof Error && err.message) ||
            'Something went wrong. Please try again.',
        );
      }
    } finally {
      clearTimeout(timeout);
    }
  };

  // ─── 成功态 — 裸内容（外层页面已有 container 玻璃卡包裹，
  // 此处再套 Card 会出现「玻璃卡套玻璃卡」双层棱线，审查第 1 轮修复）───
  if (status === 'sent') {
    return (
      // 弹入用 animate-scale-in utility 而非内联 animation 字符串：keyframes
      // 已于 2026-07-27 收进 tailwind.config，内联字符串引用的动画名一旦改动
      // 不报错也不掉 lint，只会静默失去动画
      // biome-ignore lint/a11y/useSemanticElements: <output> only permits phrasing content; this status card holds block children (h3/button), so role="status" on a div is the correct ARIA pattern
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="focus:outline-none text-center py-4 animate-scale-in"
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
          {receiptSent
            ? 'Your message is with our team, and a confirmation is on its way to your inbox. We’ll reply from a real inbox within 24 hours.'
            : 'Your message is with our team. We’ll reply from a real inbox within 24 hours.'}
        </p>
        <ModuleButton
          variant="secondary"
          onClick={() => {
            setStatus('idle');
            setReceiptSent(false);
          }}
        >
          Send another message
        </ModuleButton>
      </div>
    );
  }

  const describedBy = errMsg ? ERROR_ID : undefined;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 蜜罐 — 真人看不见（aria-hidden）也 tab 不到（tabIndex -1）；
          被填即判脚本，服务端返回 200 假成功不告知对方被识破 */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '-9999px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      >
        <label htmlFor="contact-company-website">Company website</label>
        <input
          id="contact-company-website"
          ref={honeypotRef}
          type="text"
          name={HONEYPOT_FIELD}
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

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
            maxLength={FIELD_LIMITS.name}
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
            aria-describedby={describedBy}
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
            maxLength={FIELD_LIMITS.email}
            // pattern 与服务端正则同源：type="email" 会放行 a@localhost，
            // 服务端要求点号 + ≥2 位 TLD，不对齐就是可预防的 400
            pattern={EMAIL_PATTERN}
            title="Enter a full email address, for example you@company.com"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            aria-describedby={describedBy}
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
          maxLength={FIELD_LIMITS.subject}
          value={form.subject}
          onChange={handleChange}
          aria-describedby={describedBy}
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
          maxLength={FIELD_LIMITS.message}
          rows={5}
          value={form.message}
          onChange={handleChange}
          aria-describedby={describedBy}
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
        {status === 'error' && errMsg && (
          <span
            id={ERROR_ID}
            role="alert"
            className="text-red-400 text-sm text-center"
          >
            {errMsg}
          </span>
        )}
      </div>
    </form>
  );
}
