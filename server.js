const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// 初始化Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// 中间件
app.use(cors());
app.use(express.json());

// 联系表单API端点
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // 验证必需字段
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        error: 'All fields are required' 
      });
    }

    // 发送邮件
    const data = await resend.emails.send({
      from: 'Synthmind Contact Form <contact@synthmind.ca>', // 请确保这个域名已在Resend中验证
      to: ['synthmind.technology@gmail.com'],
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1A73E8;">New Contact Form Submission</h2>
          
          <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h3 style="color: #333; margin-top: 0;">Contact Information</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h3 style="color: #333; margin-top: 0;">Message</h3>
            <p style="line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="background-color: #e8f4fd; padding: 15px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #1A73E8;">
            <p style="margin: 0; font-size: 14px; color: #666;">
              This message was sent through the Synthmind website contact form.
            </p>
          </div>
        </div>
      `,
      // 也发送自动回复给用户
      replyTo: email,
    });

    // 发送自动回复给用户
    await resend.emails.send({
      from: 'Synthmind <noreply@synthmind.ca>',
      to: [email],
      subject: 'Thank you for contacting Synthmind',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1A73E8;">Thank you for your message!</h2>
          
          <p>Dear ${name},</p>
          
          <p>Thank you for reaching out to Synthmind. We have received your message and will get back to you as soon as possible.</p>
          
          <div style="background-color: #f5f8ff; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h3 style="color: #333; margin-top: 0;">Your Message Summary</h3>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p style="background-color: white; padding: 15px; border-radius: 4px; white-space: pre-wrap;">${message}</p>
          </div>
          
          <p>We typically respond within 24 hours during business days.</p>
          
          <p>Best regards,<br>
          The Synthmind Team</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="font-size: 12px; color: #666;">
            Synthmind - Reshaping the Future with AI<br>
            <a href="https://synthmind.ca" style="color: #1A73E8;">synthmind.ca</a>
          </p>
        </div>
      `,
    });

    console.log('邮件发送成功:', data);
    res.status(200).json({ 
      message: 'Email sent successfully',
      id: data.id 
    });

  } catch (error) {
    console.error('发送邮件失败:', error);
    res.status(500).json({ 
      error: 'Failed to send email',
      details: error.message 
    });
  }
});

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`服务器运行在端口 ${port}`);
  console.log(`健康检查: http://localhost:${port}/api/health`);
}); 