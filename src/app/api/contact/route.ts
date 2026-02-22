import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { checkCsrf } from '@/lib/csrf';
import { createServiceClient } from '@/lib/supabase-server';

// 懒加载 Resend 客户端 — 避免构建时因缺少环境变量而报错
function getResendClient() {
  return new Resend(process.env.RESEND_API_KEY);
}

// 字段长度上限
const FIELD_LIMITS = { name: 100, subject: 200, message: 5000 } as const;

// 防止 HTML 注入 — 用户输入插入邮件模板前必须转义
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// 允许的来源枚举 — 防止客户端注入任意值
const ALLOWED_SOURCES = ['contact', 'contact-page', 'chat', 'cta'] as const;
type AllowedSource = (typeof ALLOWED_SOURCES)[number];

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  source?: string;
}

// 发送自动回复给客户
const sendCustomerReply = async (
  name: string,
  email: string,
  subject: string,
  message: string,
) => {
  const safeName = escapeHtml(name);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message);

  return await getResendClient().emails.send({
    from: 'Synthmind <noreply@synthmind.ca>',
    to: [email],
    subject:
      'Thank you for contacting Synthmind - We have received your message',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">

        <div style="background: linear-gradient(135deg, #4A9FE5, #3488CC); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 300;">Synthmind</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Reshaping the Future with AI</p>
        </div>

        <div style="background-color: white; padding: 30px;">
          <p style="color: #333; font-size: 18px; margin: 0 0 20px 0;">Dear ${safeName},</p>

          <p style="color: #333; line-height: 1.6; margin: 0 0 25px 0;">Thank you for reaching out to Synthmind! We have received your message and truly appreciate your interest in our AI solutions.</p>

          <div style="background-color: #f8f9ff; border-left: 4px solid #4A9FE5; padding: 20px; margin: 25px 0;">
            <p style="color: #4A9FE5; font-weight: bold; margin: 0 0 15px 0;">Your Message Summary</p>
            <p style="margin: 0 0 10px 0; color: #555;"><strong>Subject:</strong> ${safeSubject}</p>
            <p style="margin: 0; color: #333;"><strong>Message:</strong></p>
            <p style="margin: 10px 0 0 0; color: #333; line-height: 1.5;">${safeMessage}</p>
          </div>

          <p style="color: #333; margin: 20px 0 0 0;">Best regards,</p>
          <p style="color: #4A9FE5; font-weight: bold; margin: 5px 0 0 0;">The Synthmind Team</p>
        </div>

      </div>
    `,
  });
};

// 发送通知邮件给管理员
const sendNotificationEmail = async (
  name: string,
  email: string,
  subject: string,
  message: string,
  source?: string,
) => {
  const safeName = escapeHtml(name);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message);

  return await getResendClient().emails.send({
    from: 'Synthmind <onboarding@resend.dev>',
    to: ['info@synthmind.ca'],
    subject: `[Website Contact] New message from ${safeName}`,
    replyTo: email,
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 700px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #4A9FE5, #3488CC); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 600;">New Website Contact Form Submission</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">from synthmind.ca</p>
        </div>

        <div style="background-color: white; padding: 30px; border: 1px solid #e8eaed;">
          <div style="background-color: #f8f9ff; padding: 25px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #4A9FE5;">
            <h2 style="color: #4A9FE5; margin: 0 0 20px 0; font-size: 20px;">Contact Information</h2>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> <a href="mailto:${encodeURIComponent(email)}">${escapeHtml(email)}</a></p>
            <p><strong>Subject:</strong> ${safeSubject}</p>
            ${source ? `<p><strong>Source:</strong> ${escapeHtml(source)}</p>` : ''}
            <p><strong>Time:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'America/Toronto' })}</p>
          </div>

          <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; border: 1px solid #e8eaed;">
            <h3 style="color: #202124; margin: 0 0 15px 0; font-size: 18px;">Message Content</h3>
            <div style="background-color: white; padding: 20px; border-radius: 6px; border: 1px solid #dadce0;">
              <p style="margin: 0; color: #202124; line-height: 1.6; white-space: pre-wrap; font-size: 15px;">${safeMessage}</p>
            </div>
          </div>

          <div style="margin-top: 30px; text-align: center;">
            <a href="mailto:${encodeURIComponent(email)}?subject=Re: ${encodeURIComponent(subject)}"
               style="display: inline-block; background: linear-gradient(135deg, #4A9FE5, #3488CC); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: 600;">
              Reply to Customer
            </a>
          </div>
        </div>
      </div>
    `,
  });
};

export async function POST(request: NextRequest) {
  // CSRF 防护 — 校验 Origin/Referer
  const csrfError = checkCsrf(request);
  if (csrfError) return csrfError;

  try {
    const { name, email, subject, message, source }: ContactFormData =
      await request.json();

    // source 白名单校验 — 非法值降级为默认 'contact'
    const safeSource: AllowedSource = ALLOWED_SOURCES.includes(
      source as AllowedSource,
    )
      ? (source as AllowedSource)
      : 'contact';

    // 验证必需字段
    // - email 始终必须
    // - inline 变体只提交 email，mini 变体提交 name + email + message
    // - full 变体提交全部字段
    // 逻辑：email 必须 + 至少提供 name/subject/message 之一（inline 变体除外，email 足够）
    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email is required',
        },
        { status: 400 },
      );
    }

    // 验证邮箱格式 — TLD 至少 2 个字符
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email format',
        },
        { status: 400 },
      );
    }

    // 字段长度校验 — 防止超大 payload 滥用
    // mini/inline 变体可能不发送 name/subject/message，用可选链避免 TypeError
    if (
      (name?.length ?? 0) > FIELD_LIMITS.name ||
      (subject?.length ?? 0) > FIELD_LIMITS.subject ||
      (message?.length ?? 0) > FIELD_LIMITS.message
    ) {
      return NextResponse.json(
        {
          success: false,
          error: `Field length exceeded: name max ${FIELD_LIMITS.name}, subject max ${FIELD_LIMITS.subject}, message max ${FIELD_LIMITS.message}`,
        },
        { status: 400 },
      );
    }

    // ── 写入 Supabase（DB 失败不阻断邮件发送）──
    const ip =
      request.headers.get('x-real-ip') ??
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      'unknown';

    try {
      const db = createServiceClient();
      // company/industry/budget 在当前 DB schema 中无对应列，不写入
      await db.from('form_submissions').insert({
        source: safeSource,
        name,
        email,
        subject,
        message,
        ip_address: ip,
      });
    } catch (dbErr) {
      console.error('Failed to persist contact form to DB:', dbErr);
    }

    // 只发送管理员通知邮件（优先保证你能收到客户留言）
    const notificationEmail = await sendNotificationEmail(
      name,
      email,
      subject || '',
      message || '',
      safeSource,
    );

    // 尝试发送客户确认邮件（如果失败不影响主要功能）
    let customerEmailSent = false;
    try {
      const customerEmail = await sendCustomerReply(
        name || '',
        email,
        subject || '',
        message || '',
      );
      customerEmailSent = !!customerEmail.data;
    } catch (error) {
      console.warn(
        'Customer reply email failed, but notification email sent successfully:',
        error,
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
      data: {
        customerEmailSent,
        notificationEmailSent: !!notificationEmail.data,
      },
    });
  } catch (error) {
    console.error('Failed to send emails:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send emails',
        details:
          process.env.NODE_ENV === 'development'
            ? (error as Error).message
            : 'Internal server error',
      },
      { status: 500 },
    );
  }
}
