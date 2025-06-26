# Synthmind - Next.js版本

## 本地开发

1. **安装依赖**
   ```bash
   npm install
   ```

2. **设置环境变量**
   创建 `.env.local` 文件：
   ```env
   RESEND_API_KEY=your_resend_api_key_here
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

4. **访问应用**
   - 网站：http://localhost:3000
   - API测试：POST http://localhost:3000/api/contact

## 部署

### Vercel（推荐）
1. 连接GitHub到Vercel
2. 在Vercel设置环境变量：`RESEND_API_KEY`
3. 自动部署

### Netlify
1. 构建命令：`npm run build`
2. 发布目录：`out`
3. 设置环境变量：`RESEND_API_KEY`

### 其他平台
- **构建命令**：`npm run build`
- **启动命令**：`npm start`
- **端口**：3000

## API路由

- `POST /api/contact` - 发送联系表单邮件

## 环境变量

| 变量名 | 描述 | 必需 |
|--------|------|------|
| `RESEND_API_KEY` | Resend邮件服务API密钥 | 是 |

## 405错误解决方案

如果遇到405错误：

1. **检查部署平台是否支持API路由**
   - Vercel：✅ 支持
   - Netlify：❌ 需要函数配置
   - Cloudflare Pages：❌ 需要Workers

2. **Cloudflare设置**
   - 关闭"Always Use HTTPS"重定向
   - 设置代理状态为"DNS only"而不是"Proxied"
   - 检查Page Rules是否干扰API请求

3. **推荐部署到Vercel**
   - 原生支持Next.js API路由
   - 无需额外配置
   - 自动HTTPS

## 故障排除

**Q: 405错误？**
A: 使用Vercel部署，或检查Cloudflare设置

**Q: 邮件发送失败？**
A: 检查RESEND_API_KEY环境变量

**Q: 本地正常，部署后不行？**
A: 确认环境变量在部署平台正确设置 