import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// 初始化Resend客户端
const resend = new Resend(process.env.RESEND_API_KEY);

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

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// 发送自动回复给客户
const sendCustomerReply = async (
  name: string,
  email: string,
  subject: string,
  message: string
) => {
  const safeName = escapeHtml(name);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message);

  return await resend.emails.send({
    from: 'Synthmind <noreply@synthmind.ca>',
    to: [email],
    subject: 'Thank you for contacting Synthmind - We have received your message',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">

        <div style="background: linear-gradient(135deg, #1A73E8, #6C63FF); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 300;">Synthmind</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Reshaping the Future with AI</p>
        </div>

        <div style="background-color: white; padding: 30px;">
          <p style="color: #333; font-size: 18px; margin: 0 0 20px 0;">Dear ${safeName},</p>

          <p style="color: #333; line-height: 1.6; margin: 0 0 25px 0;">Thank you for reaching out to Synthmind! We have received your message and truly appreciate your interest in our AI solutions.</p>

          <div style="background-color: #f8f9ff; border-left: 4px solid #1A73E8; padding: 20px; margin: 25px 0;">
            <p style="color: #1A73E8; font-weight: bold; margin: 0 0 15px 0;">Your Message Summary</p>
            <p style="margin: 0 0 10px 0; color: #555;"><strong>Subject:</strong> ${safeSubject}</p>
            <p style="margin: 0; color: #333;"><strong>Message:</strong></p>
            <p style="margin: 10px 0 0 0; color: #333; line-height: 1.5;">${safeMessage}</p>
          </div>

          <p style="color: #333; margin: 20px 0 0 0;">Best regards,</p>
          <p style="color: #1A73E8; font-weight: bold; margin: 5px 0 0 0;">The Synthmind Team</p>
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
  message: string
) => {
  const safeName = escapeHtml(name);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message);

  return await resend.emails.send({
    from: 'Synthmind <onboarding@resend.dev>',
    to: ['synthmind.technology@gmail.com'],
    subject: `[Website Contact] New message from ${safeName}`,
    replyTo: email,
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 700px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1A73E8, #6C63FF); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 600;">New Website Contact Form Submission</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">from synthmind.ca</p>
        </div>

        <div style="background-color: white; padding: 30px; border: 1px solid #e8eaed;">
          <div style="background-color: #f8f9ff; padding: 25px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #1A73E8;">
            <h2 style="color: #1A73E8; margin: 0 0 20px 0; font-size: 20px;">Contact Information</h2>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Subject:</strong> ${safeSubject}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'America/Toronto' })}</p>
          </div>

          <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; border: 1px solid #e8eaed;">
            <h3 style="color: #202124; margin: 0 0 15px 0; font-size: 18px;">Message Content</h3>
            <div style="background-color: white; padding: 20px; border-radius: 6px; border: 1px solid #dadce0;">
              <p style="margin: 0; color: #202124; line-height: 1.6; white-space: pre-wrap; font-size: 15px;">${safeMessage}</p>
            </div>
          </div>

          <div style="margin-top: 30px; text-align: center;">
            <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}"
               style="display: inline-block; background: linear-gradient(135deg, #1A73E8, #6C63FF); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: 600;">
              Reply to Customer
            </a>
          </div>
        </div>
      </div>
    `,
  });
};

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message }: ContactFormData = await request.json();

    // 验证必需字段
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ 
        success: false,
        error: 'All fields are required' 
      }, { status: 400 });
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email format'
      }, { status: 400 });
    }

    // 字段长度校验 — 防止超大 payload 滥用
    if (
      name.length > FIELD_LIMITS.name ||
      subject.length > FIELD_LIMITS.subject ||
      message.length > FIELD_LIMITS.message
    ) {
      return NextResponse.json({
        success: false,
        error: `Field length exceeded: name max ${FIELD_LIMITS.name}, subject max ${FIELD_LIMITS.subject}, message max ${FIELD_LIMITS.message}`
      }, { status: 400 });
    }

    console.log('New contact form submission received');

    // 只发送管理员通知邮件（优先保证你能收到客户留言）
    const notificationEmail = await sendNotificationEmail(name, email, subject, message);

    // 尝试发送客户确认邮件（如果失败不影响主要功能）
    let customerEmailSent = false;
    try {
      const customerEmail = await sendCustomerReply(name, email, subject, message);
      customerEmailSent = !!customerEmail.data;
    } catch (error) {
      console.warn('Customer reply email failed, but notification email sent successfully:', error);
    }

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
      data: {
        customerEmailSent,
        notificationEmailSent: !!notificationEmail.data
      }
    });

  } catch (error) {
    console.error('Failed to send emails:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to send emails',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error'
    }, { status: 500 });
  }
} 