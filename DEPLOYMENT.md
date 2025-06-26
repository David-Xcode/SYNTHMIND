# Synthmind 部署指南

## 环境要求
- Node.js >= 18.0.0
- npm >= 8.0.0

## 本地开发

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
复制 `.env.example` 为 `.env`，并填入实际值：
```bash
cp .env.example .env
```

编辑 `.env` 文件：
```env
RESEND_API_KEY=your_resend_api_key_here
PORT=3001
NODE_ENV=development
```

### 3. 启动开发服务器
```bash
npm run dev
```

这会同时启动：
- React 开发服务器（端口 3000）
- Express API 服务器（端口 3001）

### 4. 访问应用
- 前端：http://localhost:3000
- API健康检查：http://localhost:3001/api/health

## 生产部署

### 构建应用
```bash
npm run build
```

这会创建：
- `build/` - React 生产构建
- `dist/` - TypeScript 编译的服务器代码

### 启动生产服务器
```bash
npm run serve
```

## Heroku 部署

1. **安装 Heroku CLI**
2. **登录 Heroku**
   ```bash
   heroku login
   ```

3. **创建应用**
   ```bash
   heroku create synthmind-app
   ```

4. **设置环境变量**
   ```bash
   heroku config:set RESEND_API_KEY=your_api_key_here
   heroku config:set NODE_ENV=production
   ```

5. **部署应用**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

## 其他部署平台

### Vercel
- 安装 Vercel CLI：`npm i -g vercel`
- 运行：`vercel`
- 配置环境变量在 Vercel 控制台

### Netlify
- 构建命令：`npm run build`
- 发布目录：`build`
- 需要单独部署 API 服务器

### DigitalOcean App Platform
- 自动检测 Node.js 应用
- 设置构建命令：`npm run build`
- 设置运行命令：`npm run serve`

## 环境变量说明

| 变量名 | 描述 | 必需 |
|--------|------|------|
| `RESEND_API_KEY` | Resend 邮件服务 API 密钥 | 是 |
| `PORT` | 服务器端口（默认 3001） | 否 |
| `NODE_ENV` | 环境模式（development/production） | 否 |

## 故障排除

### 405 Method Not Allowed 错误
- 确保 Express 服务器正在运行
- 检查 API 路由配置
- 验证 CORS 设置

### 邮件发送失败
- 检查 RESEND_API_KEY 是否正确
- 确认域名已在 Resend 中验证
- 查看服务器日志

### 静态文件无法加载
- 确保 `build/` 目录存在
- 检查生产环境路径配置
- 验证服务器静态文件配置

## 监控和日志

生产环境中，建议添加：
- 错误监控（如 Sentry）
- 性能监控（如 New Relic）
- 日志聚合（如 LogRocket）

## 安全建议

- 使用 HTTPS
- 设置 CORS 白名单
- 启用速率限制
- 定期更新依赖 