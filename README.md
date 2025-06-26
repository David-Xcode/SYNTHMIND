# Synthmind Website

基于 React 和 TypeScript 构建的现代化企业网站，使用 Tailwind CSS 进行样式设计，集成 Resend API 处理联系表单。

## 技术栈

- **前端**: React 18 + TypeScript
- **样式**: Tailwind CSS
- **后端**: Express.js
- **邮件服务**: Resend API
- **图标**: Heroicons
- **构建工具**: Create React App

## 功能特点

- 📱 响应式设计，支持移动端和桌面端
- 🎨 现代化的UI设计，具有渐变背景和平滑动画
- 📧 集成Resend API的联系表单
- 🚀 平滑滚动导航
- ⚡ 优化的性能和用户体验

## 快速开始

### 1. 环境要求

- Node.js 16+ 
- npm 或 yarn

### 2. 安装依赖

```bash
npm install
```

### 3. 环境变量配置

创建 `.env` 文件在项目根目录：

```env
RESEND_API_KEY=your_resend_api_key_here
PORT=3001
```

**获取 Resend API Key:**
1. 访问 [https://resend.com](https://resend.com)
2. 注册账户并验证邮箱
3. 在控制台创建 API Key
4. 将 API Key 添加到 `.env` 文件

### 4. 域名验证（重要）

在 Resend 控制台中验证您的发送域名：
- 如果您有自己的域名，请在 Resend 中添加并验证
- 在 `server.js` 中更新 `from` 邮箱地址为您验证的域名

### 5. 运行项目

#### 开发模式（同时运行前端和后端）:
```bash
npm run dev
```

#### 分别运行:
```bash
# 启动TypeScript后端服务器 (端口 3001)
npm run server

# 启动前端开发服务器 (端口 3000)
npm start
```

#### 生产环境部署:
```bash
# 构建后端
npm run build-server

# 启动生产环境后端
npm run start-prod
```

### 6. 访问应用

- 前端: [http://localhost:3000](http://localhost:3000)
- 后端API: [http://localhost:3001](http://localhost:3001)
- 健康检查: [http://localhost:3001/api/health](http://localhost:3001/api/health)

## 项目结构

```
synthmind/
├── public/
│   ├── synthmind_logo.png    # Logo文件
│   └── synthmind_logo.svg    # Logo文件
├── src/
│   ├── api/
│   │   └── contact.ts        # TypeScript联系表单API
│   ├── components/
│   │   ├── Header.tsx        # 导航栏组件
│   │   ├── Hero.tsx          # 主页横幅
│   │   ├── About.tsx         # 关于我们
│   │   ├── Services.tsx      # 服务介绍
│   │   ├── Contact.tsx       # 联系表单
│   │   └── Footer.tsx        # 页脚
│   ├── App.tsx               # 主应用组件
│   ├── index.tsx             # 应用入口
│   └── index.css             # 全局样式
├── server.ts                 # TypeScript Express服务器
├── tailwind.config.js        # Tailwind配置
├── package.json              # 项目配置
└── README.md                 # 项目说明
```

## API 端点

### POST /api/contact
处理联系表单提交

**请求体:**
```json
{
  "name": "用户姓名",
  "email": "user@example.com",
  "subject": "邮件主题", 
  "message": "邮件内容"
}
```

**响应:**
```json
{
  "message": "Email sent successfully",
  "id": "email_id"
}
```

### GET /api/health
健康检查端点

## 邮件配置说明

### Email Sending Logic
- 🔄 **Dual Email System**: After customer submits form, system sends two emails simultaneously
- 📧 **Customer Auto-Reply**: Sent to customer confirming message received (from: noreply@synthmind.ca)
- 📬 **Admin Notification**: Sent to you with customer details (to: info@synthmind.ca)

### Environment Variables Setup

Create a `.env` file and set the following variables:

```env
# Resend API Key - Get from https://resend.com/api-keys
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx

# Server Port
PORT=3001

# Development Environment Identifier (optional)
NODE_ENV=development
```

### Domain Verification Requirements
- Ensure `synthmind.ca` domain is verified in Resend console
- Email address configuration:
  - Customer Reply: `noreply@synthmind.ca`
  - Website Notification: `contact@synthmind.ca`
  - Receiving Email: `info@synthmind.ca`

## 自定义配置

### 更新品牌颜色
在 `tailwind.config.js` 中修改颜色变量

### 更新联系信息
在 `src/components/Contact.tsx` 中修改邮箱和网站信息

### 更新公司信息
在各个组件中修改相应的文本内容

## 故障排除

1. **邮件发送失败** - 检查 Resend API Key 和域名验证
2. **样式不显示** - 重启开发服务器
3. **组件导入错误** - 检查文件路径

## 联系我们

- 邮箱: synthmind.technology@gmail.com
- 网站: [https://synthmind.ca](https://synthmind.ca) 