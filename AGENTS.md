# Repository Guidelines

## 交互与协作规则
- 所有团队内沟通默认使用中文；代码、变量及文件名保持英文，必要注释统一使用中文，确保阅读观感一致。
- API Route 需自包含，直接在组件或 Hooks 中结合 React Query 使用，避免抽象出隐藏服务层导致耦合失控。
- 遇到需求不清或风险较高的改动时，需在任务记录中罗列风险点、提出至少一个备选方案，并在共识达成后再执行实现。
- 设计与实现时警惕僵化、冗余、循环依赖、脆弱性与晦涩五类坏味道，通过接口抽象、公共函数提炼、模块解耦、单一职责和清晰命名及时治理。

## 项目结构与模块组织
- `src/app`：Next.js App Router 根目录，包含页面、布局与 API Route；新增路径如 `src/app/sign/[id]/page.tsx` 可处理动态参数。
- `src/app/api`：API Route 使用 `route.ts` 导出 HTTP 动作，确保每个 Route 管理自身验证、异常处理与响应结构。
- `src/components`：复用型客户端组件存放处，推荐通过 `use client` 指令与自定义 Hooks 分离状态逻辑。
- `public/`：静态资源与第三方校验文件目录，可放置 `.well-known/appspecific/com.chrome.devtools.json` 等文件。
- 根目录的 `.env.local` 持有敏感配置（如 `RESEND_API_KEY`）；`next.config.js`、`tailwind.config.js`、`tsconfig.json` 在此集中管理。

## 构建、测试与开发命令
- `npm run dev`：启动本地开发服务器（默认端口 3000），支持 Fast Refresh 与 API 热更新。
- `npm run build`：执行生产构建，校验页面渲染与 API Route 输出，部署前必须通过。
- `npm start`：基于 `.next` 构建产物启动生产模式服务，用于本地验证部署行为。
- `npm run lint`：运行 Next.js ESLint 助手；首次选择 Strict 预设生成 `.eslintrc.json` 后即可追加 `-- --fix` 自动修复。

## 代码风格与命名约定
- TypeScript 默认 2 空格缩进，组件与 Hook 使用箭头函数；`src/components` 文件采用 PascalCase 命名，App Route 遵循 Next.js 目录约定。
- JSX 中按“布局 → 间距 → 排版 → 色彩 → 动效”顺序排列 Tailwind 工具类，确保团队协作时的可读性。
- 交互组件需显式声明 `use client`，副作用逻辑通过 Hooks 管理；公共逻辑抽离为工具函数或接口避免重复。
- 代码注释为中文，简洁说明目的或特殊约束，避免翻译往返。

## 测试准则
- 当前尚未引入自动化测试框架；规划新增测试时需先同步工具选型与覆盖范围。
- 建议在 `tests/` 下镜像源码结构，或在模块旁放置 `*.test.ts(x)` 文件；覆盖表单提交流程、API 错误分支与关键 3D 交互。
- PR 中需列出已运行的测试命令与仍待补齐的场景，确保风险透明。

## 提交与拉取请求规范
- 提交信息使用祈使句（示例：`Add contact form validation`），每个提交聚焦单一职责；在正文关联相关 Issue 或需求编号。
- PR 描述需包含变更摘要、验证步骤（如 `npm run build`、手动提交表单）以及 UI 变更的截图或录屏。
- 涉及配置、环境变量或安全策略调整时，在 PR 中说明影响面、回滚策略与需要提醒的运营同学。

## 安全与配置提示
- `.env.local` 仅供本地使用，提供 `.env.example` 或文档举例即可；成员离开或权限变更需立即轮换 Resend API Key。
- Preview 或 Demo 环境使用最小权限密钥，避免在示例数据中包含真实客户隐私。
- 检查部署平台的 HTTPS、CORS 与日志策略，避免 API Route 在生产环境暴露调试信息。
