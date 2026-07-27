// ─── 邮件 HTML 模板 — 从 route.ts 抽出 ───
// route.ts 只负责「校验 + 编排」，模板与转义收在这里：escapeHtml 的调用点
// 曾散落在模板字面量中间，漏一个不易发现。
// 品牌色按 CLAUDE.md §4 豁免从 constants.ts 取（邮件客户端不认 CSS 变量 /
// Tailwind class，必须内联 hex），模板内不得写字面 hex 品牌色。
//
// 注意：面向陌生收件人的「自动回执」已于 2026-07-27 删除——它让任何人都能
// 用已验证的 noreply@synthmind.ca 向任意地址投递可控正文（发信中继）。
// 本文件只保留发给 CONTACT_EMAIL 的管理员通知，**不要再加回执模板**。

import { BRAND_ACCENT, BRAND_ACCENT_DARK } from '@/lib/constants';
import { FIELD_LIMITS } from '@/lib/contact-form';

/** 防止 HTML 注入 — 用户输入插入邮件模板前必须转义 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** 邮件主题行专用 — 剥离换行/制表，避免主题被折成多行 */
function sanitizeSubjectLine(str: string, max: number): string {
  return str.replace(/[\r\n\t]/g, ' ').slice(0, max);
}

/** 品牌头 — 唯一实现，改品牌样式只改这里 */
function brandHeader(title: string, caption: string): string {
  return `
      <div style="background: linear-gradient(135deg, ${BRAND_ACCENT}, ${BRAND_ACCENT_DARK}); padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 600;">${title}</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">${caption}</p>
      </div>`;
}

export interface AdminNotificationInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  source: string;
}

export interface RenderedEmail {
  subject: string;
  html: string;
}

/** 管理员通知邮件 — 全站唯一对外发信模板 */
export function renderAdminNotification(
  input: AdminNotificationInput,
): RenderedEmail {
  const safeName = escapeHtml(input.name);
  const safeEmail = escapeHtml(input.email);
  const safeSubject = escapeHtml(input.subject);
  const safeMessage = escapeHtml(input.message);
  const safeSource = escapeHtml(input.source);
  const receivedAt = new Date().toLocaleString('en-US', {
    timeZone: 'America/Toronto',
  });

  return {
    subject: `[Website Contact] New message from ${sanitizeSubjectLine(input.name, FIELD_LIMITS.name)}`,
    html: `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 700px; margin: 0 auto;">
      ${brandHeader('New Website Contact Form Submission', 'from synthmind.ca')}

      <div style="background-color: white; padding: 30px; border: 1px solid #e8eaed;">
        <div style="background-color: #f8f9ff; padding: 25px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid ${BRAND_ACCENT};">
          <h2 style="color: ${BRAND_ACCENT}; margin: 0 0 20px 0; font-size: 20px;">Contact Information</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
          <p><strong>Subject:</strong> ${safeSubject}</p>
          <p><strong>Source:</strong> ${safeSource}</p>
          <p><strong>Time:</strong> ${receivedAt}</p>
        </div>

        <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; border: 1px solid #e8eaed;">
          <h3 style="color: #202124; margin: 0 0 15px 0; font-size: 18px;">Message Content</h3>
          <div style="background-color: white; padding: 20px; border-radius: 6px; border: 1px solid #dadce0;">
            <p style="margin: 0; color: #202124; line-height: 1.6; white-space: pre-wrap; font-size: 15px;">${safeMessage}</p>
          </div>
        </div>

        <div style="margin-top: 30px; text-align: center;">
          <a href="mailto:${safeEmail}?subject=${encodeURIComponent(`Re: ${input.subject}`)}"
             style="display: inline-block; background: linear-gradient(135deg, ${BRAND_ACCENT}, ${BRAND_ACCENT_DARK}); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: 600;">
            Reply to Customer
          </a>
        </div>
      </div>
    </div>`,
  };
}
