"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const resend_1 = require("resend");
const path_1 = __importDefault(require("path"));
// 加载环境变量
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = parseInt(process.env.PORT || '3001', 10);
const isProduction = process.env.NODE_ENV === 'production';
// 初始化Resend客户端
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
// CORS配置 - 生产环境使用域名，开发环境允许localhost
const corsOptions = {
    origin: isProduction
        ? ['https://synthmind.ca', 'https://www.synthmind.ca']
        : ['http://localhost:3000', 'http://192.168.2.21:3000'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
// 中间件
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// 生产环境：提供静态文件服务
if (isProduction) {
    // 为React构建文件提供静态服务
    app.use(express_1.default.static(path_1.default.join(__dirname, '../build')));
    // 处理任何非API请求，返回React应用
    app.get('/', (req, res) => {
        res.sendFile(path_1.default.join(__dirname, '../build', 'index.html'));
    });
}
// 请求日志中间件
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});
// 发送自动回复给客户
const sendCustomerReply = async (name, email, subject, message) => {
    return await resend.emails.send({
        from: 'Synthmind <noreply@synthmind.ca>',
        to: [email],
        subject: 'Thank you for contacting Synthmind - We have received your message',
        html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1A73E8, #6C63FF); padding: 40px 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 300;">Synthmind</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Reshaping the Future with AI</p>
        </div>
        
        <!-- Main Content -->
        <div style="background-color: white; padding: 40px 30px;">
          <h2 style="color: #1A73E8; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
            Dear ${name},
          </h2>
          
          <p style="color: #333; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
            Thank you for reaching out to Synthmind! We have received your message and truly appreciate your interest in our AI solutions.
          </p>
          
          <p style="color: #333; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
            Our team will carefully review your message and get back to you as soon as possible. We typically respond within 24 hours during business days.
          </p>
          
          <!-- Message Summary -->
          <div style="background-color: #f8f9ff; border-left: 4px solid #1A73E8; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
            <h3 style="color: #1A73E8; margin: 0 0 15px 0; font-size: 18px;">Your Message Summary</h3>
            <p style="margin: 0 0 10px 0; color: #555;"><strong>Subject:</strong> ${subject}</p>
            <p style="margin: 0 0 15px 0; color: #555;"><strong>Message:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 6px; border: 1px solid #e1e5e9;">
              <p style="margin: 0; color: #333; white-space: pre-wrap; line-height: 1.5;">${message}</p>
            </div>
          </div>
          
          <p style="color: #333; line-height: 1.6; margin: 0 0 30px 0; font-size: 16px;">
            If you have any urgent questions, please feel free to reply to this email or visit our website.
          </p>
          
          <p style="color: #333; line-height: 1.6; margin: 0; font-size: 16px;">
            Best regards,<br>
            <strong style="color: #1A73E8;">The Synthmind Team</strong>
          </p>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f1f3f4; padding: 30px; text-align: center; border-top: 1px solid #e8eaed;">
          <p style="margin: 0 0 10px 0; color: #5f6368; font-size: 14px;">
            <strong>Synthmind</strong> - Reshaping the Future with AI
          </p>
          <p style="margin: 0 0 15px 0; color: #5f6368; font-size: 14px;">
            <a href="https://synthmind.ca" style="color: #1A73E8; text-decoration: none;">synthmind.ca</a> | 
            <a href="mailto:info@synthmind.ca" style="color: #1A73E8; text-decoration: none;">info@synthmind.ca</a>
          </p>
          <p style="margin: 0; color: #9aa0a6; font-size: 12px;">
            This is an automated reply. Please do not reply to this email. For questions, contact info@synthmind.ca
          </p>
        </div>
      </div>
    `,
    });
};
// 发送通知邮件给管理员
const sendNotificationEmail = async (name, email, subject, message) => {
    return await resend.emails.send({
        from: 'Synthmind Website <contact@synthmind.ca>',
        to: ['info@synthmind.ca'],
        subject: `[Website Contact Form] New message from ${name}`,
        replyTo: email, // 方便直接回复客户
        html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 700px; margin: 0 auto;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1A73E8, #6C63FF); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 600;">New Website Contact Form Submission</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">from synthmind.ca</p>
        </div>
        
        <!-- Contact Info -->
        <div style="background-color: white; padding: 30px; border: 1px solid #e8eaed;">
          <div style="background-color: #f8f9ff; padding: 25px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #1A73E8;">
            <h2 style="color: #1A73E8; margin: 0 0 20px 0; font-size: 20px;">Contact Information</h2>
            
            <div style="display: grid; gap: 15px;">
              <div style="display: flex; align-items: center;">
                <span style="display: inline-block; width: 80px; color: #5f6368; font-weight: 600;">Name:</span>
                <span style="color: #202124; font-size: 16px; font-weight: 500;">${name}</span>
              </div>
              
              <div style="display: flex; align-items: center;">
                <span style="display: inline-block; width: 80px; color: #5f6368; font-weight: 600;">Email:</span>
                <a href="mailto:${email}" style="color: #1A73E8; text-decoration: none; font-size: 16px; font-weight: 500;">${email}</a>
              </div>
              
              <div style="display: flex; align-items: center;">
                <span style="display: inline-block; width: 80px; color: #5f6368; font-weight: 600;">Subject:</span>
                <span style="color: #202124; font-size: 16px; font-weight: 500;">${subject}</span>
              </div>
              
              <div style="display: flex; align-items: flex-start;">
                <span style="display: inline-block; width: 80px; color: #5f6368; font-weight: 600; margin-top: 2px;">Time:</span>
                <span style="color: #5f6368; font-size: 14px;">${new Date().toLocaleString('en-US', { timeZone: 'America/Toronto' })}</span>
              </div>
            </div>
          </div>
          
          <!-- Message Content -->
          <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; border: 1px solid #e8eaed;">
            <h3 style="color: #202124; margin: 0 0 15px 0; font-size: 18px;">Message Content</h3>
            <div style="background-color: white; padding: 20px; border-radius: 6px; border: 1px solid #dadce0;">
              <p style="margin: 0; color: #202124; line-height: 1.6; white-space: pre-wrap; font-size: 15px;">${message}</p>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div style="margin-top: 30px; text-align: center;">
            <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" 
               style="display: inline-block; background: linear-gradient(135deg, #1A73E8, #6C63FF); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; margin-right: 15px;">
              Reply to Customer
            </a>
            <a href="mailto:${email}" 
               style="display: inline-block; border: 2px solid #1A73E8; color: #1A73E8; padding: 10px 30px; text-decoration: none; border-radius: 25px; font-weight: 600;">
               Send New Email
            </a>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f1f3f4; padding: 20px; text-align: center; border-top: 1px solid #e8eaed;">
          <p style="margin: 0; color: #5f6368; font-size: 13px;">
            This email was automatically generated by the Synthmind website contact form | 
            <a href="https://synthmind.ca" style="color: #1A73E8; text-decoration: none;">Visit Website</a>
          </p>
        </div>
      </div>
    `,
    });
};
// 联系表单处理函数
const handleContactForm = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        // 验证必需字段
        if (!name || !email || !subject || !message) {
            res.status(400).json({
                success: false,
                error: 'All fields are required'
            });
            return;
        }
        // 验证邮箱格式
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({
                success: false,
                error: 'Invalid email format'
            });
            return;
        }
        console.log(`New contact form submission: ${name} (${email}) - ${subject}`);
        // 同时发送两封邮件
        const [customerEmail, notificationEmail] = await Promise.all([
            // 1. 发送自动回复给客户
            sendCustomerReply(name, email, subject, message),
            // 2. 发送通知邮件给管理员
            sendNotificationEmail(name, email, subject, message)
        ]);
        console.log('Emails sent successfully:', {
            customerEmail: customerEmail.data,
            notificationEmail: notificationEmail.data
        });
        res.status(200).json({
            success: true,
            message: 'Emails sent successfully',
            data: {
                customerEmailSent: !!customerEmail.data,
                notificationEmailSent: !!notificationEmail.data
            }
        });
    }
    catch (error) {
        console.error('Failed to send emails:', error);
        // 根据错误类型返回不同的错误信息
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                error: 'Failed to send emails',
                details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
        else {
            res.status(500).json({
                success: false,
                error: 'Unknown error'
            });
        }
    }
};
// 联系表单API端点
app.post('/api/contact', handleContactForm);
// 健康检查端点
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});
// 生产环境：catch-all处理器，返回React应用 (必须在API路由之后)
if (isProduction) {
    app.get('*', (req, res) => {
        res.sendFile(path_1.default.join(__dirname, '../build', 'index.html'));
    });
}
// 404处理 (仅用于API路由)
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'API endpoint not found',
        path: req.originalUrl
    });
});
// 全局错误处理
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
});
app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 TypeScript server running on port ${port}`);
    console.log(`📍 Health check: http://localhost:${port}/api/health`);
    console.log(`📧 Contact form API: http://localhost:${port}/api/contact`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔧 Production mode: ${isProduction}`);
    if (isProduction) {
        console.log(`🌐 Serving React app from: ${path_1.default.join(__dirname, '../build')}`);
    }
});
//# sourceMappingURL=server.js.map