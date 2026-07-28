# Synthmind 全面代码审查 — 完整发现清单

> 生成于 2026-07-27 | 7 维度并行审查 + 逐维对抗式验证 | 14 个 agent / 190 万 token
> 共 144 条发现：CONFIRMED 103 / PARTIAL 38 / REFUTED 3
> **PARTIAL 表示问题成立但原描述需修正**，以「验证修正」一栏为准。REFUTED 为经核实不成立，仅存档。

| # | 严重度 | 判决 | 维度 | 位置 | 问题 |
|---|---|---|---|---|---|
| 1 | CRITICAL | CONFIRMED | API 与安全 | `.env` | 历史提交中残留过一把真实 RESEND_API_KEY（已轮换，但 blob 仍在 git 历史里） |
| 2 | CRITICAL | PARTIAL | 僵尸代码与文档漂移 | `.env:1` | 真实 Resend API key 曾以 .env 形式提交进 git 历史，至今可从 origin/main 检出 |
| 3 | HIGH | CONFIRMED | API 与安全 | `src/app/api/contact/route.ts:284` | 联系表单是一个无验证的对外发信中继：任意人可让 noreply@synthmind.ca 向任意收件人投递攻击者可控的正文 |
| 4 | HIGH | CONFIRMED | 运行时性能与移动端内存 | `src/app/globals.css:1018` | BlueprintObject 的 12 条无限动画在 preserve-3d 链内无法合成，永久占用主线程——手机端滚出视口后仍持续烧 6.6% CPU，桌面端更高 |
| 5 | HIGH | CONFIRMED | 运行时性能与移动端内存 | `src/app/globals.css:877` | obj-float / obj-sway 的 transform 动画在 preserve-3d 上无法合成，与砖墙 DOM 叠加后触发每帧全文档 layout：桌面静止不动也持续吃 19% 主线程 |
| 6 | HIGH | CONFIRMED | 僵尸代码与文档漂移 | `Union-Glen-网站策略方案.docx` | 客户策略提案 Union-Glen-网站策略方案.docx 被跟踪进仓库根目录 |
| 7 | MEDIUM | CONFIRMED | API 与安全 | `src/app/api/contact/route.ts:18` | 内存版限流在 Vercel Serverless 上基本无效——每个实例一份 Map，并发/冷启动即绕过 |
| 8 | MEDIUM | CONFIRMED | API 与安全 | `src/components/shared/ContactForm.tsx:118` | 表单无蜜罐、无提交耗时校验、无 CAPTCHA——纯自动化脚本零成本刷 |
| 9 | MEDIUM | CONFIRMED | API 与安全 | `src/app/api/contact/route.ts:185` | body 字段没有任何运行时类型校验，非字符串值会让接口返回 500/502 而不是 400，甚至把非法值传给 Resend |
| 10 | MEDIUM | CONFIRMED | API 与安全 | `src/app/api/contact/route.ts:283` | 管理员通知失败时仍然发出「我们已收到您的留言」回执，前端却显示失败——用户收到互相矛盾的两个信号，留言实际丢失 |
| 11 | MEDIUM | CONFIRMED | API 与安全 | `src/components/shared/ContactForm.tsx:57` | 前端把服务端返回的具体错误（400 字段超长 / 429 限流 / 503 未配置）统统吞成同一句「Something went wrong」 |
| 12 | MEDIUM | CONFIRMED | API 与安全 | `src/components/shared/ContactForm.tsx:141` | 客户端校验比服务端宽松：浏览器放行的邮箱和纯空格输入会被服务端 400 拒绝 |
| 13 | MEDIUM | CONFIRMED | 架构与 Next 16 用法 | `src/app/layout.tsx:35` | 根 layout 写死 canonical:'/'，任何未覆写 alternates 的页面（含 404）都静默 canonical 到首页 |
| 14 | MEDIUM | PARTIAL | 架构与 Next 16 用法 | `src/app/icon.jpg` | favicon 是 195KB 的 1024×1024 JPEG |
| 15 | MEDIUM | CONFIRMED | 架构与 Next 16 用法 | `src/proxy.ts:45` | 全站 16 页全静态，安全 header 却走 proxy（middleware），每个 HTML 请求都触发一次 Node 函数 |
| 16 | MEDIUM | CONFIRMED | 架构与 Next 16 用法 | `src/app/(public)/layout.tsx:30` | 没有 not-found.tsx / error.tsx / global-error.tsx，404 落到 Next 内置页 |
| 17 | MEDIUM | CONFIRMED | 架构与 Next 16 用法 | `src/components/home/HomeHero.tsx:114` | 首页把 BlueprintObject 的桌面与移动两套变体全量 SSR，各自还在 RSC flight 里再序列化一遍 |
| 18 | MEDIUM | CONFIRMED | 架构与 Next 16 用法 | `src/components/home/SocialProofBar.tsx:14` | 信任带 marquee 制造 40 个可 tab 的重复链接与 80 个 img |
| 19 | MEDIUM | CONFIRMED | 架构与 Next 16 用法 | `src/components/layout/SiteHeader.tsx:51` | 移动端 header 完全没有导航，只剩 logo |
| 20 | MEDIUM | CONFIRMED | 架构与 Next 16 用法 | `src/components/case-study/ResultsSection.tsx:26` | 数据层用散文存 results，再靠 200 行正则在渲染时反解出统计数字 |
| 21 | MEDIUM | CONFIRMED | 构建配置与交付 | `src/app/icon.jpg` | 唯一 favicon 是 200KB 的 1024×1024 PNG，却以 .jpg 扩展名 + Content-Type: image/jpeg 交付 |
| 22 | MEDIUM | CONFIRMED | 构建配置与交付 | `public/og-image.png` | OG 分享图 490KB PNG，同尺寸转 JPEG 只需 105KB（-79%），且宽度 1024 低于主流平台 1200 要求 |
| 23 | MEDIUM | CONFIRMED | 构建配置与交付 | `tsconfig.json:3` | tsconfig target: "es5" 对产物零影响（实测字节一致），却在约束代码写法——纯负担 |
| 24 | MEDIUM | CONFIRMED | 构建配置与交付 | `src/components/home/HomeHero.tsx:114` | 首页 HTML 275KB（其中 155KB 是内联 RSC flight），且 136KB 的 .rsc 会被每个页面的 header logo 链接预取 |
| 25 | MEDIUM | CONFIRMED | 构建配置与交付 | `src/components/home/HomeHero.tsx:114` | Hero 物件的桌面与移动两套变体同时进 DOM，靠 hidden/lg:hidden 切换——每个设备都下载并解析用不上的那一半 |
| 26 | MEDIUM | PARTIAL | CSS 引擎 | `src/app/globals.css:178` | prefers-reduced-motion 块漏掉 scroll-behavior: smooth —— 「三件套」claim 只覆盖了 animation，没覆盖平滑滚动 |
| 27 | MEDIUM | CONFIRMED | CSS 引擎 | `src/app/globals.css:526` | 按钮 hover 态是全站唯一未加 @media (hover: hover) 门控的引擎 —— 触屏 sticky hover 会让按钮永久顶出 +16px、槽光常亮 |
| 28 | MEDIUM | CONFIRMED | CSS 引擎 | `src/app/globals.css:1441` | .form-field 焦点环只用 box-shadow 且 outline: none —— 强制高对比模式（Windows HCM / forced-colors）下焦点完全不可见 |
| 29 | MEDIUM | PARTIAL | 巨型组件与抽象 | `src/components/case-study/ResultsSection.tsx:26` | ResultsSection 的 240 行启发式解析器，在全部 5 个案例 21 条 results 上只产出 2 张 stat 卡——应改为数据层显式字段 |
| 30 | MEDIUM | PARTIAL | 巨型组件与抽象 | `package.json:6` | 仓库没有任何测试基建，而 240 行正则解析器带 9 个书面回归案例 |
| 31 | MEDIUM | CONFIRMED | 巨型组件与抽象 | `src/components/home/BlueprintObject.tsx:1082` | ModuleShell 里前/右/顶三个面是三段近乎逐字符相同的 30 行块，没有抽出 Face 子组件 |
| 32 | MEDIUM | CONFIRMED | 巨型组件与抽象 | `src/components/home/BlueprintObject.tsx:537` | 四张蚀刻表是 409 行内嵌 JSX 的 Record，同一个 map-Draw 惯用法重复 31 次 |
| 33 | MEDIUM | CONFIRMED | 巨型组件与抽象 | `src/components/home/BlueprintObject.tsx:65` | 模块码与蚀刻表键之间没有类型关联，键名打错就是一张静默空白的面板 |
| 34 | MEDIUM | CONFIRMED | 巨型组件与抽象 | `src/components/home/BlueprintObject.tsx:991` | VariantConfig 用 Tailwind 字面类字符串重复编码 width/height，改几何尺寸会静默半更新 |
| 35 | MEDIUM | CONFIRMED | 巨型组件与抽象 | `src/components/home/BlueprintObject.tsx:1` | BlueprintObject.tsx 1306 行里塞了 8 个互不相干的关注点，没有任何模块边界 |
| 36 | MEDIUM | CONFIRMED | 巨型组件与抽象 | `src/components/home/BlueprintObject.tsx:1216` | BlueprintObject 占首页 HTML 的绝大部分：275KB 首页 vs 67KB 次重页，纯装饰 aria-hidden 内容 |
| 37 | MEDIUM | CONFIRMED | 巨型组件与抽象 | `src/components/home/HomeHero.tsx:113` | 桌面与移动两个物件变体永远同时进 DOM，各自被 display:none 掉一个 |
| 38 | MEDIUM | CONFIRMED | 巨型组件与抽象 | `src/app/(public)/products/page.tsx:80` | /products 页内联手写了一张与 CaseStudyCard 结构完全同构的卡，32 行重复 JSX |
| 39 | MEDIUM | CONFIRMED | 运行时性能与移动端内存 | `src/app/globals.css:158` | 砖数没有真正封顶：pitch 阶梯只按 min-width 分档，竖屏/超高视口直接冲到 2691 块 div（文档声称的现实上限是 1242） |
| 40 | MEDIUM | CONFIRMED | 运行时性能与移动端内存 | `src/hooks/useCountUp.ts:22` | useCountUp 缺 prefers-reduced-motion 守卫，且每帧 setState 触发 React 重渲染 |
| 41 | MEDIUM | PARTIAL | 僵尸代码与文档漂移 | `src/components/shared/ContactForm.tsx:11` | clean main 上 `npm run lint` 直接失败：ContactForm 有一个 v7 重构遗留的死 import + 2 处格式偏移 |
| 42 | MEDIUM | PARTIAL | 僵尸代码与文档漂移 | `docs/superpowers/plans/2026-03-14-remove-industries-simplify-nav.md:3` | 2026-03 已完成的重构 plan 仍全篇未勾选 + 顶部写着「REQUIRED: 用 subagent 执行本 plan」，会指挥 agent 重做已删的工作 |
| 43 | MEDIUM | CONFIRMED | 僵尸代码与文档漂移 | `docs/superpowers/specs/2026-07-26-lantern-wall-v6-design.md:4` | 墙体有两份 spec 同时自称「唯一正本」：v6 未加退役标记，仍在描述已删除的墙后灯光 |
| 44 | MEDIUM | CONFIRMED | 僵尸代码与文档漂移 | `docs/superpowers/specs/2026-07-26-homepage-slim-ourwork-restructure-design.md:12` | homepage-slim spec 的头号定案（首页只留 Hero + 信任带，删 FeaturedWork/Process/CTABanner）已被 IA v1 全盘推翻，文档零标记 |
| 45 | MEDIUM | CONFIRMED | 僵尸代码与文档漂移 | `AGENTS.md:3` | AGENTS.md 与 CLAUDE.md/实际代码在 7 处直接冲突，两份指令文件都会进 agent context |
| 46 | MEDIUM | CONFIRMED | 僵尸代码与文档漂移 | `src/app/globals.css:1005` | modDrift 的「周期互质」注释是事实错误（14/16/11/15/13/10 里 gcd(14,16)=2、gcd(15,10)=5），与 trace-pulse 同一类错误但没被修 |
| 47 | LOW | PARTIAL | API 与安全 | `src/app/api/contact/route.ts:185` | `request.json()` 在任何体积检查之前完整解析 body，长度上限形同虚设（对内存而言） |
| 48 | LOW | PARTIAL | API 与安全 | `src/proxy.ts:10` | CSP 的 script-src 含 'unsafe-inline'，XSS 防护档位实际接近于零 |
| 49 | LOW | PARTIAL | API 与安全 | `src/components/shared/JsonLd.tsx:12` | JsonLd 用裸 JSON.stringify 注入 <script>，未转义 `</script>` 与 `<!--`（当前数据静态，属潜伏隐患） |
| 50 | LOW | CONFIRMED | API 与安全 | `src/proxy.ts:12` | 安全响应头缺 COOP/CORP，Permissions-Policy 覆盖面偏窄，img-src 放开了整个 https: |
| 51 | LOW | CONFIRMED | API 与安全 | `src/lib/csrf.ts:8` | CSRF 来源白名单不含 *.vercel.app，预览部署上的联系表单必然 403 |
| 52 | LOW | CONFIRMED | API 与安全 | `src/app/api/contact/route.ts:83` | 338 行的 route 文件里内联了两份高度重复的邮件 HTML 模板（约占 100 行） |
| 53 | LOW | CONFIRMED | API 与安全 | `src/app/api/contact/route.ts:33` | 模块作用域的 setInterval 清理器在 serverless 上几乎不会触发，在 dev HMR 下会逐次累积 |
| 54 | LOW | CONFIRMED | API 与安全 | `src/app/api/contact/route.ts:175` | 429 响应不带 Retry-After 头，且 x-real-ip 缺失时所有请求共用 'unknown' 单桶 |
| 55 | LOW | CONFIRMED | API 与安全 | `src/app/api/contact/route.ts:271` | Resend 错误对象被整体 JSON.stringify / console.error，可能把提交者邮箱写回日志（与既往「移除 PII 日志」的意图冲突） |
| 56 | LOW | PARTIAL | API 与安全 | `vercel.json:7` | 函数超时只在 vercel.json 里按源码路径配置，未用 App Router 的 route segment config 兜底 |
| 57 | LOW | CONFIRMED | API 与安全 | `src/components/shared/ContactForm.tsx:199` | 表单错误提示未与输入框建立 aria 关联，且无字段级 aria-invalid |
| 58 | LOW | CONFIRMED | API 与安全 | `src/app/api/contact/route.ts:11` | 每封邮件都新建一个 Resend 客户端实例 |
| 59 | LOW | CONFIRMED | 架构与 Next 16 用法 | `tsconfig.json:3` | tsconfig target 仍是 es5 / lib 只到 es6 |
| 60 | LOW | CONFIRMED | 架构与 Next 16 用法 | `src/app/(public)/contact/page.tsx:141` | contact 页标题层级跳级且乱序：h1 → h3 → h3 → h3 → h2 |
| 61 | LOW | CONFIRMED | 架构与 Next 16 用法 | `src/components/products/InDevelopmentShowcase.tsx:1` | components 目录分层名不副实：products/ 下的组件被 home 消费，单页组件一半 colocate 一半塞 shared/ |
| 62 | LOW | CONFIRMED | 架构与 Next 16 用法 | `src/components/shared/CardTilt.tsx:1` | shared/ 里混着别的组件的私有实现件，没有可见的「勿直接用」信号 |
| 63 | LOW | CONFIRMED | 架构与 Next 16 用法 | `src/app/(public)/products/[slug]/page.tsx:25` | [slug] 用了 generateStaticParams 但没关 dynamicParams，未知 slug 走按需渲染 |
| 64 | LOW | CONFIRMED | 架构与 Next 16 用法 | `src/hooks/useIntersectionVisible.ts:19` | AnimateOnScroll 每实例一个 IntersectionObserver，且 useIntersectionVisible 命中后不 disconnect |
| 65 | LOW | PARTIAL | 架构与 Next 16 用法 | `src/components/layout/SiteHeader.tsx:18` | SiteHeader 每个 scroll 事件都调一次 setState，监听未标 passive |
| 66 | LOW | CONFIRMED | 架构与 Next 16 用法 | `src/app/sitemap.ts:9` | sitemap 的静态页清单手工维护，且所有 lastModified 都是构建时刻 |
| 67 | LOW | CONFIRMED | 架构与 Next 16 用法 | `src/lib/csrf.ts:8` | CSRF 白名单只含生产域，Vercel preview 部署上联系表单必然 403 |
| 68 | LOW | CONFIRMED | 架构与 Next 16 用法 | `src/proxy.ts:12` | CSP 的 img-src 放开了任意 https:，站内并无远程图片 |
| 69 | LOW | CONFIRMED | 架构与 Next 16 用法 | `next.config.js:2` | X-Powered-By: Next.js 未关闭 |
| 70 | LOW | CONFIRMED | 架构与 Next 16 用法 | `src/data/real-estate.ts:9` | 新增地产盘需要同时改 real-estate.ts 与 next.config.js 的 redirects，靠人记 |
| 71 | LOW | PARTIAL | 构建配置与交付 | `src/components/layout/SiteHeader.tsx:40` | 全站 fixed header 的 logo 用 loading="lazy" 且 w-auto，首屏延迟加载 + 宽度未知导致 header 布局抖动 |
| 72 | LOW | CONFIRMED | 构建配置与交付 | `src/app/globals.css:247` | font-stretch:116% 的 Archivo 宽体标题在 fallback 阶段无法被 Arial 复现，next/font 的 size-adjust 只按 100% 宽度标定 → LCP 标题在字体 swap 时重排 |
| 73 | LOW | CONFIRMED | 构建配置与交付 | `src/app/layout.tsx:8` | Archivo 因请求 wdth 轴，preload 的 woff2 达 90KB，占三家族字体首屏预载总量（132KB）的 67% |
| 74 | LOW | CONFIRMED | 构建配置与交付 | `next.config.js:26` | next.config.js 没有 headers()，/public 下的图片全部以 Cache-Control: public, max-age=0 交付 |
| 75 | LOW | CONFIRMED | 构建配置与交付 | `src/app/sitemap.ts:9` | sitemap 所有 URL 的 lastmod 都是构建时刻，每次部署都在告诉 Google「全站刚刚改过」 |
| 76 | LOW | CONFIRMED | 构建配置与交付 | `src/app/globals.css:411` | 每页 14-16 张玻璃卡无条件启用 12px backdrop-filter，背后是 fixed 砖墙——滚动期逐帧重采样的合成成本没有任何低端设备门控 |
| 77 | LOW | PARTIAL | 构建配置与交付 | `package.json:19` | package.json overrides 把 sharp 强推到 0.35.x，而 next@16.2.12 声明的是 ^0.34.5——没有注释说明理由，且 postcss override 是空操作 |
| 78 | LOW | CONFIRMED | 构建配置与交付 | `package.json:29` | 构建输出明确警告 caniuse-lite 数据陈旧 7 个月，autoprefixer 与 browserslist 目标据此计算 |
| 79 | LOW | CONFIRMED | 构建配置与交付 | `src/app/layout.tsx:30` | head 里缺 apple-touch-icon、web manifest、theme-color 与 twitter:image:alt |
| 80 | LOW | CONFIRMED | 构建配置与交付 | `src/components/shared/WallBricks.tsx:125` | WallBricks 在首次 pointermove 里同步创建 700-1200 个 div，这次长任务直接计入 INP |
| 81 | LOW | CONFIRMED | 构建配置与交付 | `vercel.json:8` | maxDuration 写在 vercel.json 的 functions 路径映射里，而不是 route 文件的 segment config——路径改名即静默失效 |
| 82 | LOW | PARTIAL | 构建配置与交付 | `src/app/(public)/page.tsx:56` | Organization JSON-LD 的 sameAs 指向 https://github.com/synthmind，未验证该组织是否存在 |
| 83 | LOW | PARTIAL | CSS 引擎 | `src/app/globals.css:199` | 全站没有声明 color-scheme: dark —— Firefox 滚动条/UA 控件仍是浅色，::-webkit-scrollbar 只救了 Chromium 和 Safari |
| 84 | LOW | PARTIAL | CSS 引擎 | `src/app/globals.css:506` | 引擎块置于 @tailwind utilities 之后靠源序压 utility —— 是有意设计，但它连带静默吞掉所有同特异性 utility，且无任何 lint/测试守护 |
| 85 | LOW | PARTIAL | CSS 引擎 | `src/app/globals.css:386` | .card-glass 的 135deg 内反射渐变在基态与 @supports 块里写了两份，注释自认「改一处必改另一处」——可用 background-image/background-color 拆分彻底消灭 |
| 86 | LOW | PARTIAL | CSS 引擎 | `src/app/globals.css:30` | rgba(74, 159, 229, α) 在 globals.css 里硬编码 31 处 —— 没有 --accent-rgb 三元组 token，换主色要手改 31 个字面量 |
| 87 | LOW | PARTIAL | CSS 引擎 | `src/app/globals.css:854` | .bp-object-spring 常驻 will-change: transform —— 违反 CLAUDE.md 的「禁常驻 will-change」，弹簧停帧后合成层仍不释放 |
| 88 | LOW | PARTIAL | CSS 引擎 | `src/app/globals.css:834` | BlueprintObject 的 516 行 CSS（5.4 KB raw / 1.5 KB gzip = 全站样式的 11%）随全局表发到全部 16 条路由，实际只有首页用得上 |
| 89 | LOW | CONFIRMED | CSS 引擎 | `src/app/globals.css:66` | --mat-seam-glow / --mat-seam-soft 零消费方，而同一文件的 .bp-seam-glow--h/--v + seamIn/seamPulse 硬编码了完全相同的值 —— 这两个 token 本该被真正消费 |
| 90 | LOW | PARTIAL | CSS 引擎 | `src/app/globals.css:42` | --mat-face-base 已自认无消费方的死 token；--mat-face-shade 的 0.32 与任何实际值都对不上，作为「交叉锁定锚点」不具备检测漂移的能力 |
| 91 | LOW | CONFIRMED | CSS 引擎 | `src/app/globals.css:152` | --wall-seam 零 CSS 消费方、只被 JS 通过 getComputedStyle 读取，且 seam = pitch/16 这条不变量同时硬编在 3 个地方 |
| 92 | LOW | CONFIRMED | CSS 引擎 | `src/app/globals.css:1367` | marquee 暂停规则写了两份：globals.css 的 .animate-marquee:hover 未门控，TSX 的 hover:[...] utility 已门控 —— 触屏 tap 会粘滞暂停 |
| 93 | LOW | CONFIRMED | CSS 引擎 | `src/app/globals.css:1364` | SocialProofBar 跑马灯 60s infinite，只有 hover 可暂停，键盘/AT 用户没有暂停机制（WCAG 2.2.2） |
| 94 | LOW | CONFIRMED | CSS 引擎 | `src/app/globals.css:389` | 玻璃卡内阴影三件套重复 3 次、按钮 inset 对重复各 2 次、三个相邻 @media (hover:hover) 未合并 —— 可收敛的字面量重复 |
| 95 | LOW | PARTIAL | CSS 引擎 | `src/app/globals.css:551` | .btn-primary 渐变里的 #3488cc 是文档三档色阶之外的第四个 accent 明度，且与 constants.ts 的 BRAND_ACCENT_DARK 重复定义 |
| 96 | LOW | CONFIRMED | CSS 引擎 | `src/app/globals.css:1474` | @keyframes scaleIn 是全站唯一通过内联 style 字符串消费的动画，类名绑定不可静态检查 |
| 97 | LOW | PARTIAL | CSS 引擎 | `src/app/globals.css:187` | body 用 min-height: 100vh，而项目已为此专门造了 .min-h-svh-safe 渐进增强类 |
| 98 | LOW | PARTIAL | 巨型组件与抽象 | `src/components/home/BlueprintObject.tsx:73` | drift / driftDur / driftDelay 是三个独立可选字段，缺一个就渲染出 `--drift-dur: undefined` |
| 99 | LOW | PARTIAL | 巨型组件与抽象 | `src/app/globals.css:765` | BlueprintObject 的另一半（约 590 行 CSS）住在 1552 行的 globals.css 里，组件真实规模约 1900 行且跨文件耦合 |
| 100 | LOW | CONFIRMED | 巨型组件与抽象 | `src/components/home/HeroObjectPhysics.tsx:77` | HeroObjectPhysics 用 querySelector 字符串跨组件抓 BlueprintObject 的内部类名，契约不受类型保护 |
| 101 | LOW | PARTIAL | 巨型组件与抽象 | `src/components/home/BlueprintObject.tsx:339` | 16 处 `as CSSProperties` 断言让所有 CSS 自定义属性名失去检查，拼错即静默无效 |
| 102 | LOW | CONFIRMED | 巨型组件与抽象 | `src/components/home/BlueprintObject.tsx:1265` | 变体无关的 datum 渲染路径里硬编码了桌面专属的时间常量和四个魔数坐标 |
| 103 | LOW | PARTIAL | 巨型组件与抽象 | `src/components/home/FeaturedWork.tsx:54` | 三处「段出口」链接逐字符重复，而 shared/CardActionRow 只差一个 group- 前缀 |
| 104 | LOW | CONFIRMED | 巨型组件与抽象 | `src/components/products/CaseStudyCard.tsx:37` | 客户 logo 的 <Image> 声明在 4 个组件里重复，含相同的 filter/opacity/hover 处理链 |
| 105 | LOW | CONFIRMED | 巨型组件与抽象 | `src/components/case-study/TextListSection.tsx:64` | mono 步骤序号 span 在 5 处重复，其中 padStart 逻辑也各写一遍 |
| 106 | LOW | PARTIAL | 巨型组件与抽象 | `src/app/(public)/about/page.tsx:168` | 「带 ruled-line 的章节外壳」在 10 处逐字符重复 |
| 107 | LOW | CONFIRMED | 巨型组件与抽象 | `src/components/products/CaseStudyCard.tsx:52` | 卡片标题的 h3 类串在 8 处重复，档位差异（mb-2/mb-3/mt-2）无规则可循 |
| 108 | LOW | CONFIRMED | 巨型组件与抽象 | `src/app/(public)/about/page.tsx:248` | processSteps 在 about 页和 ProcessStrip 里各渲染一遍，结构相同只差字段与外壳 |
| 109 | LOW | CONFIRMED | 巨型组件与抽象 | `src/app/(public)/about/page.tsx:33` | about / brokerage-platform / contact 三个页面里硬编码了约 140 行内容常量，与已有的 src/data 与 faqData.ts 惯例矛盾 |
| 110 | LOW | CONFIRMED | 巨型组件与抽象 | `src/components/case-study/CaseStudyHero.tsx:61` | CaseStudyHero 内联了一个外链图标 SVG，而 shared/ 里已有两个图标组件且注释说明就是为消除内联而建 |
| 111 | LOW | CONFIRMED | 巨型组件与抽象 | `src/components/home/SocialProofBar.tsx:14` | SocialProofBar 在首页输出 80 个 logo 节点 / 41KB HTML，REPEAT_COUNT=4 比覆盖 4K 所需多约 1/3 |
| 112 | LOW | CONFIRMED | 巨型组件与抽象 | `src/data/navigation.ts:11` | 导航 label 'Our Work' 在 5 处硬编码，navigation.ts 已是单源却没被面包屑消费 |
| 113 | LOW | CONFIRMED | 巨型组件与抽象 | `src/components/case-study/ResultsSection.tsx:317` | ResultsSection 用嵌套三元在 JSX 里算网格列数 |
| 114 | LOW | CONFIRMED | 巨型组件与抽象 | `src/components/home/BlueprintObject.tsx:952` | MOBILE_RIGHT_SEAMS 是一个永远为空的占位常量 |
| 115 | LOW | PARTIAL | 运行时性能与移动端内存 | `src/app/globals.css:398` | backdrop-filter: blur(12px) 对所有设备无条件开启，手机上每张可见玻璃卡多一个 backdrop 合成层 |
| 116 | LOW | PARTIAL | 运行时性能与移动端内存 | `src/components/home/SocialProofBar.tsx:14` | SocialProofBar 铺 80 个 <a>+<img>、11708px 宽的常驻动画层，滚出视口后 marquee 也不停 |
| 117 | LOW | CONFIRMED | 运行时性能与移动端内存 | `src/lib/pointer-tilt-engine.ts:188` | pointer-tilt-engine 缺 blur / visibilitychange 兜底，Cmd-Tab 离开后卡片和按钮的倾角冻在最后姿态 |
| 118 | LOW | PARTIAL | 运行时性能与移动端内存 | `src/components/home/HomeHero.tsx:113` | 首页同时 SSR 输出桌面与移动两套 BlueprintObject SVG，另一套 display:none 常驻 DOM |
| 119 | LOW | CONFIRMED | 运行时性能与移动端内存 | `src/hooks/useIntersectionVisible.ts:19` | useIntersectionVisible 一次性语义却触发后不 disconnect，观察器活到组件卸载 |
| 120 | LOW | CONFIRMED | 运行时性能与移动端内存 | `src/lib/pointer-tilt-engine.ts:172` | 倾斜引擎的 scroll handler 无条件 kick() 一帧 rAF，即使所有 entry 都已归零静止 |
| 121 | LOW | CONFIRMED | 运行时性能与移动端内存 | `src/components/shared/TextReveal.tsx:62` | TextReveal 给每个未入场的词 span 常驻 will-change: opacity, transform, filter，与 AnimateOnScroll 明确写下的判断自相矛盾 |
| 122 | LOW | CONFIRMED | 运行时性能与移动端内存 | `src/components/shared/WallBricks.tsx:122` | resize 后 build() 全量重造整个砖阵，超大视口下是一次 700–2700 个 div 的长任务 |
| 123 | LOW | PARTIAL | 运行时性能与移动端内存 | `src/app/layout.tsx:87` | 微信兼容用的 MutationObserver 监听全文档 style 属性 8 秒，桌面版微信浏览器下会被砖阵每帧的 21 次 style 写入反复唤醒 |
| 124 | LOW | CONFIRMED | 僵尸代码与文档漂移 | `docs/superpowers/specs/2026-07-27-blueprint-object-v3.1-nameplate-living-traces-design.md:160` | v3.1 spec 自己第 97 行宣告「互质措辞已作废」，第 160 行仍写着「周期 ≥9s 互质错峰」 |
| 125 | LOW | PARTIAL | 僵尸代码与文档漂移 | `src/app/globals.css:42` | globals.css :root 里 21 个自定义属性零 var() 消费方，其中三个的「交叉锁定」理由已被注释自己否认 |
| 126 | LOW | PARTIAL | 僵尸代码与文档漂移 | `src/lib/tech-brand-colors.ts:5` | TECH_BRAND_COLORS 18 个键里 11 个从无数据引用，同时 6 个真实 techStack 值拿不到品牌色（'AWS S3' 匹配不上 'AWS'） |
| 127 | LOW | CONFIRMED | 僵尸代码与文档漂移 | `src/app/api/contact/route.ts:56` | API 的 ALLOWED_SOURCES 白名单里 'contact' 与 'cta' 已无任何发送方，是被删除的内联 CTA 表单的残留 |
| 128 | LOW | PARTIAL | 僵尸代码与文档漂移 | `src/components/shared/SectionTitle.tsx:23` | SectionTitle 的 align prop 与 size="lg" 档从未被使用过，是标题三档制改革后的空壳 API |
| 129 | LOW | CONFIRMED | 僵尸代码与文档漂移 | `src/components/products/CaseStudyCard.tsx:19` | 三个组件 prop 声明后从未被调用方传值：CaseStudyCard.action / CropMarks.className / ProcessStep 与 RealEstateSite 接口只在本文件用 |
| 130 | LOW | CONFIRMED | 僵尸代码与文档漂移 | `docs/superpowers/specs/2026-07-27-blueprint-object-v3.1-nameplate-living-traces-design.md:3` | v3.1 spec 状态仍写「待实施」（实际已实装并提交）；一份 brief 被误归档在 specs/ 目录 |
| 131 | LOW | CONFIRMED | 僵尸代码与文档漂移 | `src/app/(public)/products/brokerage-platform/page.tsx:179` | brokerage-platform 页文件头规则 ④ 禁用完成时态，正文却用了两处完成时态描述在建能力 |
| 132 | LOW | PARTIAL | 僵尸代码与文档漂移 | `CLAUDE.md:277` | CLAUDE.md 38KB 全量进每 session context，§6 动画白名单 10.6KB 是实现层微观数据，属 spec 内容 |
| 133 | LOW | CONFIRMED | 僵尸代码与文档漂移 | `src/components/layout/SiteHeader.tsx:51` | SiteHeader 在 <md 完全不渲染导航，移动端唯一导航是页脚 |
| 134 | LOW | CONFIRMED | 僵尸代码与文档漂移 | `src/components/case-study/CaseStudyHero.tsx:61` | CaseStudyHero 内联了一份外链图标 SVG，与 shared/ExternalArrowIcon 职责重叠 |
| 135 | LOW | CONFIRMED | 僵尸代码与文档漂移 | `CLAUDE.md:17` | CLAUDE.md §1 的 src/data/ 清单漏了 process.ts |
| 136 | LOW | PARTIAL | 僵尸代码与文档漂移 | `src/app/(public)/page.tsx:56` | Organization JSON-LD 的 sameAs 指向 github.com/synthmind，无法从仓库确认该组织存在 |
| 137 | LOW | CONFIRMED | 僵尸代码与文档漂移 | `CLAUDE.md` | 仓库无 README，新接手者的入口只有 38KB 的设计系统指令文件 |
| 138 | NONE | REFUTED | 架构与 Next 16 用法 | `src/components/shared/Card.tsx:29` | Card 的 static 与 container 两个变体渲染出完全相同的 class，是类型层的空区分 |
| 139 | NONE | REFUTED | 架构与 Next 16 用法 | `src/app/layout.tsx:76` | suppressHydrationWarning 被当万金油：html、body 以及每一个 next/image 都挂了 |
| 140 | NONE | CONFIRMED | 构建配置与交付 | `src/hooks/useDeferredReveal.ts:36` | 每个 AnimateOnScroll 各建一个 IntersectionObserver，单页最多约 20 个观察器 |
| 141 | NONE | CONFIRMED | CSS 引擎 | `src/app/globals.css:666` | :has() 选择器三处 —— 当前规模成本可忽略，但 :has(:hover) 会让每次按钮内指针进出触发 frame 子树样式失效 |
| 142 | NONE | CONFIRMED | 运行时性能与移动端内存 | `src/components/layout/SiteHeader.tsx:17` | SiteHeader 每个 scroll 事件读 scrollY 并 setState，无节流 |
| 143 | NONE | CONFIRMED | 运行时性能与移动端内存 | `src/components/shared/WallBricks.tsx:70` | 【核实通过，非缺陷】WallBricks 的移动端零成本路径确实成立；全站无事件监听器泄漏 |
| 144 | NONE | REFUTED | 僵尸代码与文档漂移 | `src/components/products/InDevelopmentShowcase.tsx:47` | InDevelopmentShowcase 的 id="in-development" 锚点已无任何链接指向，scroll-mt-24 是为它服务的死重 |

---

# 逐条明细

## 1. [CRITICAL / CONFIRMED] 历史提交中残留过一把真实 RESEND_API_KEY（已轮换，但 blob 仍在 git 历史里）

- **维度**：API 与安全　**位置**：`.env`
- **原始评级**：severity=high confidence=high　→　**验证后**：critical

**证据**

`git log --all -- .env` 显示 `.env` 曾在提交 752fe45 ("new") 被加入版本库，直到 36c8383 ("feat: add AI chat module with security hardening", 2026-02-17) 才 `Remove .env from git tracking`。`git show 752fe45:.env` 仍能取出完整明文：`RESEND_API_KEY=re_5GRrQ…`（36 字符）。当前 `.env` 里的 key 前缀是 `re_3J68⋯`，说明**已经轮换过**，但旧 blob 永久留在 `origin git@…:David-Xcode/SYNTHMIND.git` 的历史里——任何能 clone 该仓库的人（若仓库为 public，则包括 GitHub 全文搜索与各类密钥扫描机器人）都能取到旧 key。

**影响**

若旧 key 在 Resend 控制台只是被「替换」而未被「撤销/删除」，它仍然有效：持有者可以用你的已验证域名 synthmind.ca 任意发信（钓鱼、群发），直接摧毁域名发信信誉并消耗 Resend 配额。即使已撤销，历史里留有真实凭据也会持续触发扫描告警。

**修复建议**

① 立刻登录 Resend → API Keys，确认 `re_5GRrQ…` 这把 key 处于 revoked/deleted 状态（不是「不再使用」，是删除）；② 确认 GitHub 仓库可见性，若为 public 优先转 private；③ 用 `git filter-repo --path .env --invert-paths`（或 BFG）清洗历史后 force-push，并让所有 clone 重新拉取；④ 在 CI 加 gitleaks/trufflehog 预提交扫描防复发。改动量：运维操作 30 分钟，无代码改动。

**验证过程**：`git log --all -- .env` 确认 .env 在 752fe45 ("new") 入库、36c8383 移除跟踪；`git show 752fe45:.env` 仍能取出明文 `RESEND_API_KEY=re_5GRrQ…`，当前 .env 前缀为 `re_3J68⋯`（已轮换）属实。额外核实：`gh repo view David-Xcode/SYNTHMIND --json visibility` 返回 `{"isPrivate":false,"visibility":"PUBLIC"}` —— 仓库是公开的，旧 key blob 任何人可直接取到，GitHub secret scanning / 第三方扫描机器人也早已可见。commit 36c8383 的 message 确实含 "Remove .env from git tracking"。历史中仅此一条密钥（.env 单行）。

**⚠️ 验证修正**：严重度应升级为 critical 而非 high：原发现把「若仓库为 public」写成条件，实测仓库确为 PUBLIC，泄露已经发生而不是潜在风险。同时该密钥历史 blob 只存在于 2 个 commit，filter-repo 清洗成本低；但清洗前提是先在 Resend 控制台确认 re_5GRrQ… 已 revoke（清洗历史不能撤销已被抓取的 key）。

---

## 2. [CRITICAL / PARTIAL] 真实 Resend API key 曾以 .env 形式提交进 git 历史，至今可从 origin/main 检出

- **维度**：僵尸代码与文档漂移　**位置**：`.env:1`
- **原始评级**：severity=critical confidence=high　→　**验证后**：critical

**证据**

`git log --all --diff-filter=A -- .env` 命中 commit 752fe45 "new"（在 main 的祖先链上，`git branch -a --contains 752fe45` 返回 main + origin/main）。`git show 752fe45:.env` 直接吐出明文：`RESEND_API_KEY=re_5GRrQ⋯〔完整值已截断：审查文档不留可用凭证〕`。该文件后来在 80ef355 被删除、.gitignore 第 17 行也加了 `.env`，但**删除不清历史**——任何 clone 都能拿到。remote 是 `David-Xcode/SYNTHMIND.git`。当前 .env 的 key 前缀是 `re_3J68⋯`，与泄露的 `re_5GRrQS` 不同，说明大概率已经轮换过，但泄露的那把是否被 Resend 侧 revoke 无法从仓库确认。

**影响**

若仓库为 public（或将来转 public）、或任何协作者/CI 缓存了旧历史，泄露的 key 在未 revoke 前可被用来以 noreply@synthmind.ca 身份发信 —— 域名已验证的发件权限 = 现成的钓鱼跳板，直接损害品牌与域名信誉分。即便已轮换，历史里留着一把可用凭证是持续的攻击面。

**修复建议**

① 立刻登录 Resend 控制台确认 `re_5GRrQ⋯〔完整值已截断：审查文档不留可用凭证〕...` 处于 revoked 状态（未 revoke 就立刻删）；② 决定是否重写历史：`git filter-repo --path .env --invert-paths` 后强推（需通知所有 clone 持有者重新 clone），或者接受历史污染但确保 key 已死；③ 在 GitHub 仓库设置里开 Push Protection / Secret Scanning，防下一次；④ 改动量：①③ 各 5 分钟，② 若做则 30 分钟含协调。

**验证过程**：跑了 git log --diff-filter=A -- .env 与 git show 752fe45:.env，明文 key re_5GRrQ⋯〔完整值已截断：审查文档不留可用凭证〕... 属实且 752fe45 在 main/origin/main 祖先链上；当前 .env key 前缀 re_3J68⋯ 确已不同（已轮换）。另用 GitHub API 查 David-Xcode/SYNTHMIND：visibility=public——仓库现在就是公开的，泄露 key 任何人可检出，critical 成立。但 .env 的删除 commit 是 36c8383（git log --diff-filter=D -- .env），不是发现所称的 80ef355（该 commit 只删了 .env.example 和 .gitignore 条目）。

**⚠️ 验证修正**：.env 的删除发生在 commit 36c8383（feat: add AI chat module...），不是 80ef355。且无需假设「若仓库为 public」——GitHub API 实测该仓库当前即为 public，泄露的 key 此刻对任何人可见，需立即确认 Resend 侧 revoke 状态（Resend 参与 GitHub secret scanning，可能已自动吊销，但必须人工确认）。

---

## 3. [HIGH / CONFIRMED] 联系表单是一个无验证的对外发信中继：任意人可让 noreply@synthmind.ca 向任意收件人投递攻击者可控的正文

- **维度**：API 与安全　**位置**：`src/app/api/contact/route.ts:284`
- **原始评级**：severity=high confidence=high　→　**验证后**：high

**证据**

POST /api/contact 在通过 `checkCsrf` 后，无条件执行 `sendCustomerReply(name, email, subject, message)`（route.ts:284），该函数 `from: 'Synthmind <noreply@synthmind.ca>'`、`to: [email]`，正文里嵌入调用方提交的 `safeName` / `safeSubject` / `safeMessage`（route.ts:92/98/100）。`email` 只做了格式正则校验（route.ts:223），**没有任何「提交者拥有该邮箱」的证明**（无双重确认、无签名 token）。而 `checkCsrf`（src/lib/csrf.ts:25-31）只比对 `Origin` 头——curl 里写一行 `-H 'Origin: https://www.synthmind.ca'` 即可完全通过，它防的是浏览器跨站，对脚本化滥用零防护。

**影响**

攻击者可用你的已验证发信域向任意第三方地址投递内容（标题固定为 "Thank you for contacting Synthmind…"，但正文的 Subject/Message 区块是他写的任意文本+链接文字），用于钓鱼铺垫或对某个受害邮箱做邮件轰炸；每次请求同时触发 2 封发信（管理员通知 + 客户回执），双倍消耗 Resend 配额与账单。收件人投诉会直接打击 synthmind.ca 的域名发信信誉，最终导致真实客户回执进垃圾箱。

**修复建议**

三选一或叠加：① 最简单——**取消对陌生地址的自动回执**，只保留发给 `CONTACT_EMAIL` 的管理员通知（回执是本次滥用面的唯一放大器，去掉后攻击者只能给你自己发垃圾）；② 保留回执但加确认环——先只发管理员通知，回执改为管理员回信；③ 保留回执并叠加 Vercel WAF rate-limit 规则 + 蜜罐（见下一条）。推荐 ①，改动约 20 行（删 `sendCustomerReply` 调用与函数，同步改前端成功文案 ContactForm.tsx:106-109 的「A confirmation is on its way to your inbox」）。

**验证过程**：route.ts:284 `await sendCustomerReply(name||'', email, subject||'', message||'')` 确实在通过校验后无条件执行；sendCustomerReply（route.ts:78-80）`from: 'Synthmind <noreply@synthmind.ca>'`、`to: [email]`，正文嵌 safeName/safeSubject/safeMessage（92/98/100 行）。email 仅经正则 (route.ts:223) 校验格式，全流程无所有权证明（grep 全仓无 token/双确认逻辑）。csrf.ts:20-31 确认 Origin 命中白名单即 return null——curl 加一行 Origin 头即通过，对脚本化滥用零防护。

**⚠️ 验证修正**：两处需精确化：① checkCsrf 不止比对 Origin，无 Origin 时还降级比对 Referer origin（csrf.ts:36-48），但两者同样是可任意伪造的请求头，结论不变；② 正文经 escapeHtml（route.ts:46-53）转义了 `<>&"'`，攻击者无法注入 <a href> 可点链接，只能投递纯文本（部分邮件客户端会自动 linkify 裸 URL）。因此「钓鱼」能力弱于原描述，但邮件轰炸 + 用你的已验证域投递任意文本 + 域名信誉损伤 + 双倍配额消耗均成立，high 恰当。

> **📌 2026-07-28 后续 — 处置已从选项 ① 改为选项 ③ 的变体，本条的「推荐 ①」不再是现行做法。**
>
> 归因需要再精确一层：危险的不是「发给了陌生人」，而是**旧模板把提交者写的
> Subject/Message 原样回显进正文**。回执因此以**去毒**形态恢复——正文零用户内容
> 回显，唯一动态位是称呼里的名字且经白名单过滤（`safeGreetingName`）。
>
> 这消除了本条影响段四条里的第 1 条（用已验证域投递可控正文）。**剩余三条
> （定向邮件轰炸 / 收件人投诉打击域名信誉 / Resend 配额双倍消耗）与正文是否可控
> 无关，随回执一并回归**，只能靠跨实例限流压住——所以选项 ③ 要求的
> Vercel WAF rate-limit 规则不是「可选加强」，是**上线前置条件**。
>
> 纪律正本 = `src/lib/email-templates.ts` 文件头；编排与顺序纪律见
> `src/app/api/contact/route.ts` 的第 2 封信段落。

---

## 4. [HIGH / CONFIRMED] BlueprintObject 的 12 条无限动画在 preserve-3d 链内无法合成，永久占用主线程——手机端滚出视口后仍持续烧 6.6% CPU，桌面端更高

- **维度**：运行时性能与移动端内存　**位置**：`src/app/globals.css:1018`
- **原始评级**：severity=high confidence=high　→　**验证后**：high

**证据**

实测（Chromium，390×844 DPR3 模拟 iPhone，页面滚到 scrollY=4000 让 hero 完全离开视口，静置 3s 采 CDP Performance.getMetrics）：

| 变体 | RecalcStyle | TaskDuration | 主线程占用 |
|---|---|---|---|
| 线上原样 | 41.7ms | 198.4ms | **6.6%** |
| `.bp-object-scene{display:none}` | 0ms | 0.4ms | **0.0%** |
| 只关 marquee | 55.6ms | 242.9ms | 8.1%（无改善）|
| 只关 obj-float/obj-sway | 49.9ms | 225.5ms | 7.5%（无改善）|
| 关掉 modDrift+seamPulse+corePulse+objShadow，只留 float/sway | 0ms | 0.4ms | **0.0%** |

结论：成本 100% 来自物件内部的 `.bp-mod-drift`(×4) / `.bp-seam-glow`(×4) / `.bp-core-pulse` / `.bp-object-shadow`，而不是 marquee 或呼吸层。

原因在代码里可读出：
- globals.css:1006-1016 `@keyframes modDrift{ ... transform: translate3d(var(--dx,0px), var(--dy,0px), var(--dz,0px)) }` —— 关键帧值引用 `var()` 自定义属性，Chrome 拒绝合成，只能主线程逐帧跑；
- globals.css:1041-1048 `.bp-seam-glow{ filter: blur(2px); animation: seamIn..., seamPulse 7s ... infinite }` 与 1086-1091 `.bp-core-pulse{ filter: blur(3px); ... corePulse 5s infinite }` —— 这两者虽然只动 opacity，但元素位于 `.bp-object`/`.bp-object-root`/`.obj-float`/`.obj-sway` 的 `transform-style: preserve-3d` 3D 渲染上下文内（globals.css:852/861/877/893），Chrome 对需要深度排序的 preserve-3d 子树同样不做合成动画。

同时用 CDP LayerTree 实测手机端合成层：原样 141 层 / 关掉 `.bp-object-scene` 后 68 层 —— **物件独占 73 个合成层**；layerTreeDidChange 事件 3s 内 225 次（≈75 次/秒），且 hero 完全滚出视口后仍是 225 次/3s、131 层。CLAUDE.md 白名单里「周期 ≥7s / ≥10s 错峰」的克制设计只降低了观感频率，没有降低每帧的 recalc 成本。

**影响**

这是本次审查里手机端最贵的一项，而且跟用户看不看得见完全无关：
- 手机首页一打开，只要页面还在前台，物件就永久吃掉一条主线程的 6.6%（这是在 M 系列 Mac 上跑无头 Chromium 的数字；中低端 Android 单核性能约为其 1/5–1/10，等效 30%–60% 的一个核）——直接表现为发热、掉电、滚动时偶发掉帧。
- 73 个额外合成层在 DPR3 手机上是实打实的 GPU 纹理占用，也是「网页内存占有率」这项指标里最大的一块非必要开销。
- 用户滚到页面底部读 Contact 表单时，这些层和动画一个都没释放。

**修复建议**

三选一，按代价从低到高：
1. **视口门控（最小改动，推荐先做）**：给 `.bp-object-scene` 加 IntersectionObserver（可复用现有 `useIntersectionVisible`），离开视口时在 scene 上落 `data-idle`，CSS 侧 `.bp-object-scene[data-idle] *{ animation-play-state: paused !important }`。约 15 行，能把「滚出视口后仍 6.6%」直接归零。
2. **手机端整体关掉活纹路**：在 globals.css 里把 `.bp-mod-drift / .bp-seam-glow / .bp-core-pulse / .bp-object-shadow` 的 infinite 部分包进 `@media (min-width: 1024px) and (hover: hover)`，移动变体只保留静态完成态（RM 块 1516-1546 已经写好了完整的静态终值，直接复用即可）。约 20 行。
3. **根治合成**：把 `modDrift` 的 `var()` 关键帧展开成每个模块一条具名 keyframes（消除 var() 阻断合成），并把 `.bp-seam-glow/.bp-core-pulse` 移出 preserve-3d 链（用一个 flat 包装层承载 opacity 动画）。改动最大，但能同时救桌面端的 F2。

**验证过程**：逐条核对代码锚点全部属实：globals.css:1006-1021 modDrift 关键帧确实引用 var(--dx/--dy/--dz)（自定义属性关键帧 Chrome 无法下放合成器，属已知限制）；1041-1048 .bp-seam-glow 双动画含 seamPulse 7s infinite、1086-1092 .bp-core-pulse corePulse 5s infinite、1343 objShadow 7s infinite；preserve-3d 链在 853/860/877/896（发现写 852/861/877/893，差 1-3 行不影响结论）。BlueprintObject.tsx:1077/1229-1246 确认 mod-drift/seam-glow/core-pulse/obj-float/obj-sway 桌面与移动变体都渲染，且全站无任何视口门控/暂停机制（grep 无 animation-play-state 的 JS 控制、RM 块只管 reduced-motion）。CDP 消融矩阵是审查者实测无法逐项复跑，但矩阵内部自洽且与代码机制吻合；「滚出视口也不停」由代码直接可证。CLAUDE.md 白名单只授权这些动画存在，未声称其零成本，不构成定案冲突。

---

## 5. [HIGH / CONFIRMED] obj-float / obj-sway 的 transform 动画在 preserve-3d 上无法合成，与砖墙 DOM 叠加后触发每帧全文档 layout：桌面静止不动也持续吃 19% 主线程

- **维度**：运行时性能与移动端内存　**位置**：`src/app/globals.css:877`
- **原始评级**：severity=high confidence=high　→　**验证后**：high

**证据**

实测（1920×1080，滚到 scrollY=2500 让 hero 离屏，鼠标静止不动，静置 2.1s）：

| 变体 | LayoutCount | LayoutDuration | TaskDuration |
|---|---|---|---|
| 线上原样（700 砖 + 物件） | **158** | 49.8ms | **402ms（≈19%）** |
| `.bp-wall-grid{display:none}`（无砖，物件在） | **0** | 0ms | 198ms |
| `.bp-object-scene{display:none}`（有砖，无物件） | **0** | 0ms | **4.8ms（≈0.2%）** |
| `.obj-float,.obj-sway{animation:none}`（有砖，物件其余动画在） | **0** | 0ms | 173ms |

即：**每帧一次全文档 layout 是「obj-float/obj-sway 主线程 transform 动画」× 「砖阵 DOM 存在」的乘积效应，两者单独都不触发**。

代码点：
- globals.css:876-882 `.obj-float{ transform-style: preserve-3d; animation: objFloat 7s ease-in-out infinite }`、893-897 `.obj-sway` 同构 —— preserve-3d 元素上的 transform 动画 Chrome 不合成，走主线程；
- WallBricks.tsx:126-139 一次性 `document.createElement('div')` 铺满视口，1920×1080 实测 700 个（DOM 节点 917 → 1617，+76%），这 700 个 layout object 每帧都被那次 layout 走一遍。

另外验证过 `contain` 不是变量：把 `.bp-wall-grid` 的 `contain` 依次换成 `paint style` / `none` / `strict` / 加 `position:fixed` / 加 `will-change:transform`，LayoutCount 恒为 157–158，只有 LayoutDuration 在 42–69ms 间波动。

鼠标持续移动时（80 次 move / 2.1s）成本进一步放大：
- 1920×1080：RecalcStyle 135ms + Layout 70ms，Task 591ms
- 3440×1440（1242 砖）：Task 743ms
- 2160×3840（2691 砖）：Layout 170ms，**Task 958ms ≈ 45% 主线程**

**影响**

桌面端「什么都不做、鼠标不动、hero 早就滚过去了」的状态下，浏览器仍在以 60fps 做全文档 layout，每次都要遍历 700–2691 个纯装饰砖块的 layout tree。这是笔记本风扇转起来、电池掉得快的直接原因，也让页面在任何真实交互（滚动、hover）时可用的帧预算平白少掉一大截。

注意 rAF 侧是干净的——实测弹簧收敛后 2s 内 requestAnimationFrame 调用数增量为 0，停帧逻辑（WallBricks.tsx:209-216）确实生效。这条开销完全来自 CSS 动画与 DOM 规模的相互作用，不是 JS 的锅，所以现有的「弹簧收敛即停帧」纪律挡不住它。

**修复建议**

修 F1 的方案 1（视口外 pause）就顺带解决这条的绝大部分——物件离屏后不再有主线程动画，layout 归零。
若要在 hero 可见时也降本：把 `objFloat` 的 translateY 从 `.obj-float`（preserve-3d）移到它外面新加的一个**扁平**包装 div 上（纯位移不需要 3D 上下文，透视链不受影响），`objSway` 的 rotateY 因为要带着子面一起转必须留在 3D 链内——那条可以改成只在 `@media (min-width:1024px)` 生效并接受成本，或干脆去掉（±3° 的摇曳与指针 yaw ±7° 高度重叠，观感损失很小）。改动 ~10 行 TSX + ~10 行 CSS。

**验证过程**：代码锚点属实：globals.css:876-880 .obj-float{transform-style:preserve-3d; animation:objFloat 7s infinite}、895-899 .obj-sway 同构——preserve-3d 上的 transform 动画走主线程属实；WallBricks.tsx:125-139 一次性 createElement 铺满视口（1920×1080 @56 档 = 35×20=700 块，数学吻合）；rAF 停帧逻辑在 209-217 确如发现所述是干净的。「transform 动画 × 砖阵 DOM → 每帧 layout」的微观机制我无法从规范推导，但审查者做了 4 组消融（无砖 0 layout / 无物件 0 layout / 关 float+sway 0 layout），归因方法可靠。唯一保留：19% 里约一半（~200ms/2100ms）来自其余物件动画（与发现 1 同根），layout 乘积效应的边际约 10%——标题略有归并但实质成立。

---

## 6. [HIGH / CONFIRMED] 客户策略提案 Union-Glen-网站策略方案.docx 被跟踪进仓库根目录

- **维度**：僵尸代码与文档漂移　**位置**：`Union-Glen-网站策略方案.docx`
- **原始评级**：severity=medium confidence=high　→　**验证后**：high

**证据**

`git ls-files` 命中 `"Union-Glen-\347\275\221\347\253\231...docx"`（20393 bytes，2026-02-16 由 commit 36a94fa "update" 入库）。它是一份点名客户（Union Glen）的中文网站策略方案，与本项目的构建/部署毫无关系；.gitignore 里没有任何 `*.docx` 条目。而 CLAUDE.md 的对外事实红线明写「客户绝不点名」。

**影响**

营销官网仓库里躺着一份带客户名的商业提案文档。若仓库 public 或将来对外开源/共享，等于把客户商业材料一起发出去；即便 private，它也与「客户身份是红线」的项目纪律自相矛盾，并让每个 clone 多背一份无关二进制。

**修复建议**

`git rm --cached 'Union-Glen-网站策略方案.docx'`（文件移到本地 Desktop 或客户资料库），.gitignore 加 `*.docx` / `*.pptx` / `*.xlsx`。若曾 public 且内容敏感，同 .env 一样需要考虑历史清理。改动量：3 分钟。

**验证过程**：git ls-files 命中该 docx（20393 bytes，36a94fa 入库）；.gitignore 无 *.docx 条目；解压 docx 读了正文——文档自标「2026年2月 | 机密文件」，是 Union Glen 楼盘推介网站的转化策略方案（含竞品分析与设计策略）。结合 GitHub API 实测仓库为 public，一份自标机密的商业策略文档正公开可下载。

**⚠️ 验证修正**：两点修正：① 仓库实测为 public，文档此刻公开可取，且文档首页自标「机密文件」——严重度应升 high；② 「客户绝不点名」红线的引用不准确：那条红线针对保险经纪客户，而 UnionGlens 是官网 /products/real-estate 公开展示的作品，点名本身不违规——真正的问题是机密策略内容（竞品打法/转化设计）公开暴露。

---

## 7. [MEDIUM / CONFIRMED] 内存版限流在 Vercel Serverless 上基本无效——每个实例一份 Map，并发/冷启动即绕过

- **维度**：API 与安全　**位置**：`src/app/api/contact/route.ts:18`
- **原始评级**：severity=high confidence=high　→　**验证后**：medium

**证据**

`const rateLimitMap = new Map<string, number[]>()`（route.ts:18）是模块级内存状态，`isRateLimited` 只查本进程（route.ts:20-29）。route.ts:172-174 的注释本身已承认：「此限流为单实例内存级，serverless 多实例 / 冷启动会重置；真正的分布式限流需 Vercel KV / WAF rate-limit 规则（属基础设施改动，未在此引入）」。`vercel.json` 里也确实没有任何 WAF / firewall 配置，仅有 `functions.maxDuration`。

**影响**

3 次/60 秒/IP 的限制只在同一个热 lambda 实例内成立。攻击者并发打请求会触发 Vercel 自动横向扩容，每个新实例的 Map 都是空的 → 实际 QPS 上限约等于你的函数并发上限，而不是 3/min。结合上一条（每请求 2 封信），这是可直接刷爆 Resend 配额与账单的路径。这条限流当前提供的是「安全感」而非安全。

**修复建议**

在 Vercel 项目 → Firewall 加一条针对 `/api/contact` 的 Rate Limit 规则（如 5 req / 10 min / IP），这是唯一真正跨实例生效的手段，零代码；若想留在代码里，改用 Vercel KV / Upstash Redis 做计数器（约 30 行 + 一个 marketplace 集成）。内存 Map 可保留作为同实例的第一道廉价拦截，但注释应改为「best-effort，非安全边界」。

**验证过程**：route.ts:18 模块级 `new Map`、route.ts:20-29 只查本进程属实；route.ts:172-174 注释原文确实自认「单实例内存级…真正的分布式限流需 Vercel KV / WAF」。读过 vercel.json 全文（10 行），只有 framework/buildCommand/devCommand/installCommand/functions.maxDuration，确无 firewall/WAF 配置。

**⚠️ 验证修正**：降为 medium：技术事实全对，但这是代码注释里已显式记录的已知取舍（不是被隐瞒的缺陷），且实际滥用天花板受 Resend 账号发信配额与 Vercel 函数并发上限约束，不是无限放大。它的真实危害是「给了虚假安全感」——注释应改为 best-effort 非安全边界，真限流靠 Vercel Firewall 规则（零代码）。

---

## 8. [MEDIUM / CONFIRMED] 表单无蜜罐、无提交耗时校验、无 CAPTCHA——纯自动化脚本零成本刷

- **维度**：API 与安全　**位置**：`src/components/shared/ContactForm.tsx:118`
- **原始评级**：severity=medium confidence=high　→　**验证后**：medium

**证据**

ContactForm.tsx:118-206 的表单只有 name/email/subject/message 四个真实字段，无隐藏蜜罐字段，无渲染时间戳；route.ts:184-248 的服务端校验也只有必填/格式/长度，没有任何「这看起来像机器人」的判据。全仓 grep 无 turnstile / hcaptcha / recaptcha 依赖（package.json 依赖只有 next/react/resend）。

**影响**

通用垃圾表单爬虫（它们会盲填所有 input 并提交）会持续把垃圾留言送进 CONTACT_EMAIL，同时触发对伪造邮箱的回执发信；这类流量通常来自轮换 IP，对上面那条 IP 限流天然免疫。

**修复建议**

最低成本组合（约 25 行）：① 加一个 `<input name="company_website" tabIndex={-1} autoComplete="off" aria-hidden className="sr-only">` 蜜罐，服务端若非空直接返回 200 假成功（不告诉机器人被识破）；② 表单挂载时 `useRef(Date.now())`，提交时把 `elapsed` 一并发送，服务端 `elapsed < 3000ms` 视为机器人。想更强就上 Cloudflare Turnstile（免费、无交互）。

**验证过程**：通读 ContactForm.tsx:118-206，表单确只有 name/email/subject/message 四个可见字段，无隐藏蜜罐、无渲染时间戳、无任何 bot 判据；route.ts:184-248 服务端校验只有必填/邮箱格式/长度。`grep -rniE 'turnstile|hcaptcha|recaptcha|honeypot' src/ package.json` 零命中，package.json 依赖确只有 next/react/react-dom/resend。

---

## 9. [MEDIUM / CONFIRMED] body 字段没有任何运行时类型校验，非字符串值会让接口返回 500/502 而不是 400，甚至把非法值传给 Resend

- **维度**：API 与安全　**位置**：`src/app/api/contact/route.ts:185`
- **原始评级**：severity=medium confidence=high　→　**验证后**：medium

**证据**

`const { name, email, subject, message, source }: ContactFormData = await request.json()` —— TS 的类型注解在运行时是空气。我实测了几条路径（node 复现）：
• `name: 123` 或 `name: {}` → route.ts:206 的 `!name?.trim()` 抛 `TypeError: name?.trim is not a function` → 落到 route.ts:323 兜底 catch → 返回 **500 "Failed to send emails"**；
• `email: ["a@b.com"]` → `!email` 为 false；`email.length > 254` 取的是数组长度 1，通过；`emailRegex.test(["a@b.com"])` 因 String 强转而**返回 true**（实测确认）→ 一路走到 route.ts:140 的 `escapeHtml(email)`，`Array.prototype.replace` 不存在 → TypeError → 被内层 catch 吞成 **502**；而在此之前 route.ts:126 的 `to: [CONTACT_EMAIL]` 没事，但 sendCustomerReply 里 `to: [email]` 会把嵌套数组 `[["a@b.com"]]` 递给 Resend。
• `source` 用 `ALLOWED_SOURCES.includes(source as AllowedSource)` 做白名单（route.ts:189），这条是对的。

**影响**

畸形请求得到误导性的 500/502（暗示服务端故障）而非 400，错误监控噪音 + 无法区分客户端错误；`email` 为数组时还会把非法结构送到 Resend SDK，行为未定义。目前不构成注入（`escapeHtml` 兜住了字符串路径），但类型契约是靠「碰巧抛异常」维持的，任何一次模板改动都可能让非字符串滑过。

**修复建议**

在解析后立即做一次显式收敛，约 15 行：
```ts
const asStr = (v: unknown, max: number) =>
  typeof v === 'string' && v.length <= max ? v.trim() : null;
const n = asStr(body.name, FIELD_LIMITS.name);
const e = asStr(body.email, 254);
… if (!n || !e || !s || !m) return 400;
```
之后所有下游只用收敛后的局部变量。若愿意加一个依赖，zod 的 schema 更简洁，但零依赖手写完全够用（本项目已明确走零依赖路线）。

**验证过程**：逐条 node 实测复现：`/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(['a@b.com'])` → true（String 强转）；`['a@b.com'].length > 254` → false；`['a@b.com'].replace(...)` → TypeError: email.replace is not a function；`(123)?.trim()` → TypeError。代码路径核对：name=123 时 route.ts:197 `!email` 先过，206 行 `!name?.trim()` 抛 TypeError → 323 兜底 → 500；email 为数组时穿过 217/223/236 全部校验，在 sendNotificationEmail 的 escapeHtml(email)（route.ts:140）抛错 → 被 276 内层 catch 吞 → notificationEmailSent=false → 300-313 返回 502，其间 sendCustomerReply 确会把 `to: [['a@b.com']]` 递给 Resend（该函数只对 name/subject/message 转义，email 未经 escapeHtml）。route.ts:189 的 ALLOWED_SOURCES.includes 白名单确实正确。

---

## 10. [MEDIUM / CONFIRMED] 管理员通知失败时仍然发出「我们已收到您的留言」回执，前端却显示失败——用户收到互相矛盾的两个信号，留言实际丢失

- **维度**：API 与安全　**位置**：`src/app/api/contact/route.ts:283`
- **原始评级**：severity=medium confidence=high　→　**验证后**：medium

**证据**

route.ts:262-279 先尝试管理员通知，失败时把 `notificationEmailSent` 留为 false；紧接着 route.ts:283-297 **无条件**执行 `sendCustomerReply(...)`，正文写死 "Thank you for reaching out to Synthmind! We have received your message"（route.ts:94）；最后 route.ts:300-313 因为 `!notificationEmailSent` 返回 502，前端 ContactForm.tsx:57-68 落到 catch → 显示 "Something went wrong. Please try again."

**影响**

用户屏幕上看到失败，收件箱里却躺着一封「我们已收到」——最坏情况是用户相信邮件、不再重试，而这条留言其实**没有任何人收到，也没有落盘持久化**（全流程无 DB/日志留存，Resend 是唯一出口）。这是静默丢数据。

**修复建议**

两处改：① 把 sendCustomerReply 移进 `if (notificationEmailSent) { … }` 分支——通知都没发出去时不该谎称已收到；② 加一条兜底持久化（哪怕是 `console.error('[LOST_SUBMISSION]', JSON.stringify({name,email,subject,message}))` 让 Vercel 日志留底，或写进 Vercel KV/Blob），这样 Resend 故障期间的留言可以事后捞回。约 10 行。

**验证过程**：route.ts:262-279 管理员通知失败时 notificationEmailSent 保持 false；283-297 的 sendCustomerReply 块与其平级、无任何条件门控；回执正文 route.ts:94 写死 "Thank you for reaching out to Synthmind! We have received your message"；300-313 因 !notificationEmailSent 返回 502；ContactForm.tsx:57-68 落 catch → setStatus('error') → 198-204 显示 "Something went wrong"。全仓无 DB/持久化层（依赖只有 resend），Resend 确为唯一出口，失败即静默丢数据。

---

## 11. [MEDIUM / CONFIRMED] 前端把服务端返回的具体错误（400 字段超长 / 429 限流 / 503 未配置）统统吞成同一句「Something went wrong」

- **维度**：API 与安全　**位置**：`src/components/shared/ContactForm.tsx:57`
- **原始评级**：severity=medium confidence=high　→　**验证后**：medium

**证据**

ContactForm.tsx:56-68：`if (!res.ok || !data.success) throw new Error(data.error || 'Failed to send');` —— `data.error` 被塞进 Error 后，catch 里**完全没有读取它**，只按 AbortError 与否设成 `'timeout'` / `'error'` 两个枚举，UI（ContactForm.tsx:198-204）随之只渲染两句写死的文案。服务端实际会返回：400 `Field length exceeded: name max 100…`、400 `Invalid email format`、429 `Too many requests. Please try again later.`、503 `Email service is not configured`、502 `Failed to send your message…`，这些信息全部丢失。

**影响**

用户写了 6000 字的留言（超过 message 上限 5000）→ 点发送 → 看到「出错了，请重试」→ 原样重试 → 永远失败，且永远不知道原因，直接流失一个潜在客户。被限流的用户同样只会不停重试。这是转化漏斗上最贵的一类静默失败。

**修复建议**

把 `data.error` 存进 state 并在错误行渲染：新增 `const [errMsg, setErrMsg] = useState<string|null>(null)`，catch 里 `setErrMsg(err instanceof Error && err.message !== 'Failed to fetch' ? err.message : null)`，UI 优先显示 `errMsg`，无则回落现有兜底文案。约 8 行。注意只回显服务端 `error` 字段（那是设计给用户看的文案），不要回显 `details`。

**验证过程**：ContactForm.tsx:57-59 `throw new Error(data.error || 'Failed to send')`，62-68 的 catch 只判 `err instanceof DOMException && err.name === 'AbortError'`，从未读取 err.message；198-204 只渲染 timeout / 通用两句写死文案。服务端确实会返回具体文案：400 字段超长(244)、400 Invalid email format(228)、429(179)、503(254)、502(305)——全部被丢弃。

---

## 12. [MEDIUM / CONFIRMED] 客户端校验比服务端宽松：浏览器放行的邮箱和纯空格输入会被服务端 400 拒绝

- **维度**：API 与安全　**位置**：`src/components/shared/ContactForm.tsx:141`
- **原始评级**：severity=medium confidence=high　→　**验证后**：medium

**证据**

三处不一致：
① 邮箱——input 只有 `type="email"`（ContactForm.tsx:143），HTML5 校验接受 `a@localhost`、`a@b`（无 TLD）；服务端正则 `/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/`（route.ts:223）要求必须有点号+≥2 位 TLD → 浏览器放行、服务端 400。
② 空白——`required` 只要求非空字符串，用户在 name 里敲三个空格即可提交；服务端 route.ts:206 用 `!name?.trim()` 判空 → 400。
③ 长度——四个 input/textarea 全部没有 `maxLength`（ContactForm.tsx:125-135 / 141-151 / 160-169 / 177-186），服务端上限 name 100 / subject 200 / message 5000（route.ts:43）。
叠加上一条（错误文案被吞），三种情况用户都只看到「Something went wrong」。

**影响**

可预防的提交失败被推迟到服务端，用户得到最无信息量的反馈。message 尤其致命——写长文的正是最有价值的询盘。

**修复建议**

① 给三个字段加 `maxLength={100/200/5000}`（浏览器会直接阻止超长输入，且不需要新组件）；② 给 email input 加 `pattern` 属性使其与服务端正则同源，或干脆放宽服务端正则以匹配 HTML5 语义；③ 提交前 `const trimmed = { name: form.name.trim(), … }`，用 trim 后的值做非空判断并发送。约 12 行。建议把上限抽成 `src/lib/constants.ts` 里的 `FIELD_LIMITS` 常量供前后端共同 import——现在只有服务端有一份。

**验证过程**：逐项核对 ContactForm.tsx：email input（141-151）只有 type="email"，HTML5 校验接受无 TLD 的 a@localhost，而服务端 route.ts:223 正则强制 `\.[a-zA-Z]{2,}`；四个字段（125-135/141-151/160-169/177-186）确无 maxLength，服务端 route.ts:43 上限 100/200/5000；`required` 对纯空格生效，服务端 route.ts:206 用 trim 判空 → 400。三种情况叠加 #8 后用户只见通用错误。FIELD_LIMITS 确实只在 route.ts 单侧存在（constants.ts 无此常量）。

---

## 13. [MEDIUM / CONFIRMED] 根 layout 写死 canonical:'/'，任何未覆写 alternates 的页面（含 404）都静默 canonical 到首页

- **维度**：架构与 Next 16 用法　**位置**：`src/app/layout.tsx:35`
- **原始评级**：severity=high confidence=high　→　**验证后**：medium

**证据**

layout.tsx:35-37 有 alternates:{canonical:'/'}。metadata 合并是同名键整块覆盖，页面不写即继承。实测 build+start 后 curl /products/does-not-exist，404 HTML 含 canonical=https://www.synthmind.ca 且 title 是首页标题。现有 6 页碰巧都写了 alternates，问题被掩盖。

**影响**

① 所有 404 URL 对首页声明 canonical（noindex 兜底但仍是 soft-404 信号）；② 潜伏陷阱：新增页面忘写 alternates（编译期查不出）就把整份权重 canonical 给首页，Google 当副本合并，新落地页可能永远进不了索引且零报错。

**修复建议**

删掉根 layout 的整条 alternates（无 canonical 时 Next 不输出该标签，好过输出错的），首页 page.tsx 补 alternates:{canonical:'/'}。约 8 行。根治可加 src/lib/pageMetadata({path}) 工厂，canonical 由 path 强制派生。

**验证过程**：读 src/app/layout.tsx:35-37 确认 alternates:{canonical:'/'}；grep 全站 alternates：6 页各自覆写、首页 page.tsx 无（依赖根 layout 的 '/'，恰好正确）；检查 .next/server/app/_not-found.html 实证含 rel=canonical href=https://www.synthmind.ca 且 robots noindex——审查者的实测复现属实。潜伏陷阱（新页面漏写 alternates 即静默 canonical 到首页）机制正确。

**⚠️ 验证修正**：当前实际受影响的只有 404 页（且带 noindex，Google 对 noindex 页的 canonical 基本忽略），现存 6 个内容页全部正确覆写、首页继承 '/' 也正确——即时 SEO 损害接近零，问题主体是未来新增页面的静默陷阱，severity 从 high 调 medium。

---

## 14. [MEDIUM / PARTIAL] favicon 是 195KB 的 1024×1024 JPEG

- **维度**：架构与 Next 16 用法　**位置**：`src/app/icon.jpg`
- **原始评级**：severity=high confidence=high　→　**验证后**：medium

**证据**

icon.jpg = 199957 bytes。实测首页输出 <link rel=icon href=/icon.jpg?... sizes=1024x1024 type=image/jpeg>，curl 该 URL 返回 199957 bytes。app/icon 约定不做尺寸压缩。无 apple-icon / manifest.ts / favicon.ico。

**影响**

每个新访客额外 195KB，只为渲染 16–32px 标签页图标。对比：首页全部 JS 未压缩才 648KB。另缺 apple-touch-icon，iOS 加主屏会截网页快照而不是 logo。

**修复建议**

导出 src/app/icon.png（32px，约 1–2KB）+ apple-icon.png（180px），删 icon.jpg，加 manifest.ts。仓库已有 favicon-google-checklist skill 可直接跑。约 10 分钟。

**验证过程**：ls + file 命令实测：src/app/icon.jpg = 199957 bytes，1024×1024——但 file 判定它是 PNG 数据（8-bit RGBA）而非 JPEG，扩展名错了。检查 .next/server/app/index.html 确认输出 <link rel=icon href=/icon.jpg sizes=1024x1024 type=image/jpeg>，无 apple-touch-icon；find 全仓无 manifest/favicon.ico/apple-icon。

**⚠️ 验证修正**：文件实际是 195KB 的 PNG 数据被错误命名为 .jpg 并以 type=image/jpeg 声明（浏览器靠 sniffing 仍能渲染，但这是审查漏掉的第二处错配）。核心问题（超大 favicon + 缺 apple-icon/manifest）成立，但 favicon 是非阻塞懒加载资源，只损失一次性带宽，不影响渲染路径，severity 从 high 调 medium。

---

## 15. [MEDIUM / CONFIRMED] 全站 16 页全静态，安全 header 却走 proxy（middleware），每个 HTML 请求都触发一次 Node 函数

- **维度**：架构与 Next 16 用法　**位置**：`src/proxy.ts:45`
- **原始评级**：severity=medium confidence=high　→　**验证后**：medium

**证据**

proxy.ts:45-47 只做 headers.set 后 return NextResponse.next()；matcher 覆盖除静态资源外全部路由。build 输出全部页面为 ○/●（静态）且列出 ƒ Proxy (Middleware)。next.config.js 只有 redirects()，没有 headers()。

**影响**

纯 CDN 静态命中本应零函数调用；现在每次页面访问都多一跳 Node middleware——多一份冷启动/延迟/计费，换来的只是几个恒定的静态 header。

**修复建议**

把 CONTENT_SECURITY_POLICY 那套搬进 next.config.js 的 async headers()（source:'/:path*'），删掉 src/proxy.ts。HSTS 在 http 上浏览器本就忽略，可无条件下发，不需要 NODE_ENV 判断。约 40 行搬迁。

**验证过程**：读 src/proxy.ts 全文：45-47 行确实只 set 静态 header 后 NextResponse.next()，matcher 覆盖除静态资源外全部路由；next.config.js 全文只有 redirects() 无 headers()；.next/server/functions-config-manifest.json 实证 /_middleware 以 nodejs runtime 注册且 matcher 与源码一致，prerender-manifest 确认全部页面静态。每次 HTML 请求都过一跳 Node 函数属实。

---

## 16. [MEDIUM / CONFIRMED] 没有 not-found.tsx / error.tsx / global-error.tsx，404 落到 Next 内置页

- **维度**：架构与 Next 16 用法　**位置**：`src/app/(public)/layout.tsx:30`
- **原始评级**：severity=medium confidence=high　→　**验证后**：medium

**证据**

find src/app -name 'not-found.tsx' -o -name 'error.tsx' -o -name 'global-error.tsx' 零命中。实测 /products/does-not-exist 返回 404，页面确实渲染在 (public)/layout 内（含 bp-wall、Skip to content、logo），但正文是 Next 默认的 This page could not be found。

**影响**

营销站的 404 没有品牌文案、没有「回首页 / 看作品」的转化出口，且 Next 默认 404 自带浅色内联样式，压在石墨墙深色主题上观感割裂。error.tsx 缺失则意味着运行期 Server 渲染异常只有框架通用错误页——现有 ErrorBoundary 是 client 组件，只接客户端渲染错误，接不住这类。

**修复建议**

加 src/app/(public)/not-found.tsx（PageHero + 两个 ModuleButton 出口，约 30 行）与 src/app/(public)/error.tsx（'use client' + reset 按钮）。可选再加 global-error.tsx 兜底根 layout。

**验证过程**：find src/app -name not-found.tsx -o -name error.tsx -o -name global-error.tsx 零命中；.next/server/app/_not-found.html 是 Next 默认 404（title '404: This page could not be found.'）。ErrorBoundary（src/components/shared/）确为 client 组件，接不住 Server 渲染异常。

---

## 17. [MEDIUM / CONFIRMED] 首页把 BlueprintObject 的桌面与移动两套变体全量 SSR，各自还在 RSC flight 里再序列化一遍

- **维度**：架构与 Next 16 用法　**位置**：`src/components/home/HomeHero.tsx:114`
- **原始评级**：severity=medium confidence=high　→　**验证后**：medium

**证据**

HomeHero.tsx:114-129 桌面分支 hidden lg:block、移动分支 lg:hidden，两个 <BlueprintObject/> 都无条件进 DOM。实测首页 HTML 275466 bytes，bp-object-root 出现 4 次（2 变体 × HTML+flight），两变体间距 30366 bytes，即物件占首页 HTML 约 120KB / 44%。BlueprintObject 本体 1306 行。

**影响**

每台设备都下载两套完整 SVG，只有一套可见；且 hidden lg:block 的容器里 HeroObjectPhysics（client 组件）在手机上照样 hydrate，只是 useEffect 因 matchMedia 早退——文件头注释「移动端无 client 组件」只对移动分支成立，整体效果不成立。

**修复建议**

两条路：① 保守——把两个变体的差异收敛成同一份 SVG + CSS 变量控制姿态，DOM 只留一份；② 彻底——移动变体作为基态直出，桌面变体由一个极小 client 岛在 matchMedia('(min-width:1024px)') 命中后动态 import 挂载。②收益最大但要重测 LCP。

**验证过程**：读 HomeHero.tsx:113-129 确认桌面 hidden lg:block（含 client 组件 HeroObjectPhysics 包裹 BlueprintObject）与移动 lg:hidden（BlueprintObject variant=mobile）两分支都无条件 SSR；wc -l 确认 BlueprintObject 1306 行；用 python 实测 .next/server/app/index.html = 275466 bytes、bp-object-root 出现 4 次（位置 9957/40323/140161/202743，前两次间距恰为 30366）、index.rsc 再出现 2 次——审查者的全部数字逐一复现。HeroObjectPhysics 头注释确认 useEffect 能力判定早退，但 hydration 本身在移动端照样发生。

---

## 18. [MEDIUM / CONFIRMED] 信任带 marquee 制造 40 个可 tab 的重复链接与 80 个 img

- **维度**：架构与 Next 16 用法　**位置**：`src/components/home/SocialProofBar.tsx:14`
- **原始评级**：severity=medium confidence=high　→　**验证后**：medium

**证据**

SocialProofBar.tsx:14 REPEAT_COUNT=4，logoItems 是 5 案例 + 5 地产 = 10 条，第 33 行 flat 出 40 条，再渲染两轨。实测首页 85 个 <img>、84 个 href=/products/*。第二轨已 aria-hidden + tabIndex=-1，第一轨的 40 条全部可聚焦。

**影响**

键盘用户从 hero 走到正文要按 40 次 Tab，且这 40 个链接只指向 10 个不同目的地（每个重复 4 次），屏幕阅读器同样逐条朗读。80 个 img 节点也是首页 DOM 体积与解码开销的一大块。

**修复建议**

无缝滚动只需要 2 轨 × 10 条（轨道宽度不足时用 CSS transform 平移而不是复制 DOM）：REPEAT_COUNT 降到 1，轨道位移改由 animate-marquee 的 translateX(-50%) 承担。或保留视觉重复但第一轨也只让首个 10 条可聚焦、其余 tabIndex=-1 + aria-hidden。

**验证过程**：读 SocialProofBar.tsx：line 14 REPEAT_COUNT=4，logoItems = 5 案例 + 5 地产 = 10，line 33 flat 出 40 条 ×2 轨；第二轨 aria-hidden + tabIndex=-1，第一轨 40 个 Link 无任何 tabIndex 限制。grep .next/server/app/index.html 实测 85 个 <img>、84 个 href="/products/ ——与审查数字完全一致。

---

## 19. [MEDIUM / CONFIRMED] 移动端 header 完全没有导航，只剩 logo

- **维度**：架构与 Next 16 用法　**位置**：`src/components/layout/SiteHeader.tsx:51`
- **原始评级**：severity=medium confidence=high　→　**验证后**：medium

**证据**

SiteHeader.tsx:51 导航容器是 hidden md:flex，没有汉堡菜单、没有任何 <md 的替代入口（实测首页 HTML 里该 class 原样存在）。文件头注释也自陈「无移动端菜单」。

**影响**

手机访客（营销站主力流量）在任意页面顶部都无法跳到 About / Our Work / Contact，只能滚到页脚。详情页很长，等于把转化路径压到页尾。

**修复建议**

要么加一个极小的 client 汉堡菜单（useState + 全屏面板，约 40 行，SiteHeader 本就是 client 组件），要么在 <md 用一行紧凑横排 nav 替代（零新状态，最省）。

**验证过程**：读 SiteHeader.tsx：line 51 导航容器 hidden md:flex，全文件无汉堡/移动替代入口，头注释自陈「无移动端菜单」；读 SiteFooter.tsx 确认页脚有 footerNav（移动用户唯一导航出口在页尾）。CLAUDE.md 无任何把「移动端无导航」写成定案的条款——组件注释只是描述现状不是设计背书。

---

## 20. [MEDIUM / CONFIRMED] 数据层用散文存 results，再靠 200 行正则在渲染时反解出统计数字

- **维度**：架构与 Next 16 用法　**位置**：`src/components/case-study/ResultsSection.tsx:26`
- **原始评级**：severity=medium confidence=high　→　**验证后**：medium

**证据**

case-studies.ts 的 results 是 string[]（如 'Reduced document turnaround from days to under 15 minutes'）。ResultsSection.tsx:26-260 为此写了 DIGITS/SYMBOL_STAT/UNIT_STAT 两条正则通道、UNIT_WORDS 白名单（60+ 词）、HEDGE_PREFIX、TRAILING_FILLER、BASELINE_CTX、contextOf/pickCandidate/extractStat——文件 350 行里约 230 行是解析器，注释里已记录 F1/F2/F4/I-1~I-4 等多轮误报修复。

**影响**

这是整个仓库最贵的一处抽象：为了不给 5 条固定数据加一个字段，写了一个会持续产生误报（把旧基线当成果、把年份读成度量）的启发式解析器。每次文案措辞变化都可能静默改变页面上的大数字，而这些是对外营销材料。维护者要读懂 6 条铁律注释才敢改一句文案。

**修复建议**

把 CaseStudy 改成 results: Array<{ value?: string; label: string }>（或另设 stats 字段），文案作者显式决定哪条出大数字、数字写什么。5 条案例 × 4~5 项手工补一次，之后 ResultsSection 可删掉全部解析代码，只剩 30 行渲染。净减约 200 行。

**验证过程**：grep src/data/case-studies.ts 确认 results: string[]（line 19）散文存储；读 ResultsSection.tsx 前 80 行 + wc -l 确认 350 行文件中 DIGITS/SYMBOL_STAT/UNIT_STAT 正则、UNIT_WORDS 白名单、多轮误报修复注释（F2 等复核编号）俱在。文件注释引用 IA v1 §4.4 只定案了解析器的失败安全行为（解析不到就 bullet、不虚构数字），并未把「用正则从散文反解结构化数据」这个架构选择本身写成不可动的定案——CLAUDE.md 也未提及。结构化数据替代方案的批评成立。

---

## 21. [MEDIUM / CONFIRMED] 唯一 favicon 是 200KB 的 1024×1024 PNG，却以 .jpg 扩展名 + Content-Type: image/jpeg 交付

- **维度**：构建配置与交付　**位置**：`src/app/icon.jpg`
- **原始评级**：severity=high confidence=high　→　**验证后**：medium

**证据**

`file src/app/icon.jpg` → `PNG image data, 1024 x 1024, 8-bit/color RGBA`，199,957 字节。构建产物 `.next/server/app/index.html` 里生成的是 `<link rel="icon" href="/icon.jpg?icon.1cyp5gc8xn3pp.jpg" sizes="1024x1024" type="image/jpeg"/>`。实测 `curl -sI http://localhost:3177/icon.jpg` → `content-type: image/jpeg` + `cache-control: public, max-age=0, must-revalidate`，200KB。用 sips 缩到 192px PNG 只有 9,472 字节（-95%）、512px 44,835 字节。两重问题：① 体积——每个首次访问的用户为一枚浏览器标签图标下载 200KB，是全站最大的单个首屏请求（比 CSS 49KB + 最大 JS chunk 222KB 之外任何静态资源都重）；② MIME 谎报——文件真身是 PNG 但按扩展名声明成 image/jpeg。目前侥幸没炸是因为 `src/proxy.ts:52` 的 matcher 把 `.*\.(?:png|jpg|jpeg|...)` 排除在外，所以 `/icon.jpg` 上没有 `X-Content-Type-Options: nosniff`（实测响应头确认缺失），浏览器靠嗅探救了场。谁哪天收紧 matcher 让 nosniff 覆盖到图片，favicon 会立刻全站变白板。

**影响**

所有首次访问者多付 190KB 带宽（移动 4G 约 +0.4s），并占用与首屏字体/JS 竞争的连接；同时埋了一颗「收紧 CSP/nosniff 就炸图标」的哑弹。另外没有任何 apple-touch-icon，iOS 加主屏会截屏当图标。

**修复建议**

删掉 src/app/icon.jpg，改放 App Router 约定文件：`src/app/icon.png`（192×192，约 9.5KB）+ `src/app/apple-icon.png`（180×180）。若要保留高清源用于 Google 品牌面板，再加一个 `src/app/icon.svg`。改动量：3 个文件替换 + 0 行代码（Next 按文件名自动生成 <link>）。项目已有 `favicon-google-checklist` skill，建议照它跑一遍。

**验证过程**：file src/app/icon.jpg 实测 = PNG image data 1024x1024 RGBA，199,957 字节；.next/server/app/index.html 内确有 <link rel="icon" href="/icon.jpg?..." type="image/jpeg">；src/proxy.ts:50-53 matcher 确实排除 .jpg 等图片扩展名，nosniff 不覆盖该路径。src/app/ 下无 apple-icon/icon.png，public/ 无 favicon.ico。事实全部属实。

**⚠️ 验证修正**：事实无误，但严重度从 high 降 medium：favicon 是浏览器低优先级异步请求，不阻塞渲染也不直接竞争 LCP 关键路径，主要代价是首访 200KB 带宽 + MIME 谎报的潜在哑弹（收紧 nosniff matcher 才会引爆）。仍是最划算的单项修复。

---

## 22. [MEDIUM / CONFIRMED] OG 分享图 490KB PNG，同尺寸转 JPEG 只需 105KB（-79%），且宽度 1024 低于主流平台 1200 要求

- **维度**：构建配置与交付　**位置**：`public/og-image.png`
- **原始评级**：severity=high confidence=high　→　**验证后**：medium

**证据**

`public/og-image.png` = 489,707 字节，1024×541 的 8-bit RGB PNG（非透明图用 PNG 编码）。实测 `sips -s format jpeg -s formatOptions 82` 同尺寸输出 104,809 字节；放大到 1200×634 再转 JPEG q82 也只有 137,668 字节。该图在 src/lib/constants.ts:BASE_OPEN_GRAPH 与 src/app/layout.tsx:56 被 og:image 与 twitter:image 共同引用，实测响应头 `Cache-Control: public, max-age=0`、`Content-Length: 489707`。

**影响**

WhatsApp 的 OG 图抓取上限约 300KB、部分 IM/爬虫对 >500KB 图片直接跳过预览；LinkedIn/Facebook 的 large card 建议 1200×630，1024 宽会被降级成小卡或裁切。分享链接时预览图可能不出或糊。

**修复建议**

用 1200×630 的 JPEG（q80-85）或 WebP 替换：`sips -z 630 1200 -s format jpeg -s formatOptions 82`，同步改 constants.ts 的 BASE_OPEN_GRAPH.images 的 url/width/height 三处。顺带补 `twitter:image:alt`（当前 head 里只有 og:image:alt，没有 twitter 版本）。改动量：1 张图 + constants.ts 约 4 行。

**验证过程**：ls/sips 实测 public/og-image.png = 489,707 B、1024×541 RGB PNG；src/lib/constants.ts:40-42 与 src/app/layout.tsx:52-55 均引用且写死 width 1024/height 541；grep 构建 HTML 确认 og:image:alt 存在而 twitter:image:alt 零命中。

**⚠️ 验证修正**：事实属实，严重度降 medium：影响面限于社交/IM 分享预览（WhatsApp 体积上限、大卡降级），不影响站内任何访问体验；1024 宽低于 1200 建议值属实。

---

## 23. [MEDIUM / CONFIRMED] tsconfig target: "es5" 对产物零影响（实测字节一致），却在约束代码写法——纯负担

- **维度**：构建配置与交付　**位置**：`tsconfig.json:3`
- **原始评级**：severity=medium confidence=high　→　**验证后**：medium

**证据**

实测对照：把 tsconfig 改成 `target: "es2022"` + `lib: [dom, dom.iterable, es2022]`，`rm -rf .next/cache && npm run build`，`.next/static/chunks` 总量 736K 完全不变，全部 chunk 文件尺寸集合的 md5 也一模一样（41b69979a412a16b55101053dd018a58，两次相同）。原因：Next 16 用 SWC + browserslist，不读 tsconfig 的 target——`require('next/dist/shared/lib/constants').MODERN_BROWSERSLIST_TARGET` 实测输出 `['chrome 111','edge 111','firefox 111','safari 16.4']`。产物里也直接可见 ES2015+ 语法：`.next/static/chunks/2m3dobewfr38-.js` 含 106 个箭头函数、16 个 `?.` 可选链。更讽刺的是 `lib: [..., "es6"]` 这道限制本身已经漏了——`node_modules/@types/node/index.d.ts:28` 有 `/// <reference lib="es2020" />`，所以全局类型实际是 es2020；src/components/home/SocialProofBar.tsx:33 用了 ES2019 的 `.flat()` 且类型检查通过。而 CLAUDE.md 记忆里「tsconfig target es5（Map/Set 用 .forEach()）」这条约束仍在真实产生成本，src/app/api/contact/route.ts:35 就是 `rateLimitMap.forEach((timestamps, ip) => ...)` 的绕行写法。

**影响**

团队/AI agent 在写代码时被迫避开 for...of over Map/Set、迭代器展开等自然写法，换来的是零字节收益。约束是纯粹的认知税，且已被 @types/node 部分架空导致规则不自洽（哪些能用哪些不能用没有一致判据）。

**修复建议**

改 `"target": "es2022"`、`"lib": ["dom", "dom.iterable", "es2022"]`（2 行），同时删掉 CLAUDE.md / 全局记忆里的「Map/Set 用 .forEach()」条款。可选：顺手把 route.ts:35 的 forEach 改回 for...of 验证。已实测 build 通过、产物零变化，风险为零。

**验证过程**：tsconfig.json:3 确为 target es5 + lib es6；node_modules/@types/node/index.d.ts:28 确有 /// <reference lib="es2020" />；SocialProofBar.tsx:33 用 .flat()（ES2019）且 npx tsc --noEmit exit 0，证明 lib 限制已被架空；route.ts:35 的 rateLimitMap.forEach 绕行写法存在；node 实测 next 的 MODERN_BROWSERSLIST_TARGET = chrome/edge/firefox 111 + safari 16.4，Next 16 走 SWC+browserslist 不读 tsconfig target。未复跑双 build 字节对照，但机制链完整成立。MEMORY.md 只把「es5 用 forEach」记为事实约束，不是被辩护的设计定案。

---

## 24. [MEDIUM / CONFIRMED] 首页 HTML 275KB（其中 155KB 是内联 RSC flight），且 136KB 的 .rsc 会被每个页面的 header logo 链接预取

- **维度**：构建配置与交付　**位置**：`src/components/home/HomeHero.tsx:114`
- **原始评级**：severity=medium confidence=medium　→　**验证后**：medium

**证据**

实测 HTML 原始体积：`/` 275,506 B、`/about` 59,123、`/contact` 47,372、`/products` 67,241、`/products/brokerage-platform` 71,994。首页比其余页重 4-6 倍。拆解首页 275KB：内联 `<script>` 合计 155,394 B（47 次 `self.__next_f.push`，即 RSC flight payload），DOM 里 35 个 `<svg>` 合计 36,848 B。构建产物 `.next/server/app/index.rsc` = 135,921 B，实测 `curl -H "RSC: 1" -H "Next-Router-Prefetch: 1" /` 也是 135,921 B。src/components/layout/SiteHeader.tsx:39 的 `<Link href="/">` 是 fixed header（line 30 `fixed top-0`），恒在视口内，App Router 默认 prefetch 会在每个非首页页面拉取这 136KB。

**影响**

首页 gzip 后约 27KB 尚可，但 275KB 的 HTML 解析 + 155KB flight JSON 反序列化 + hydration reconcile 是移动端主线程长任务的直接来源（TBT/INP 风险）。更浪费的是：访问 /about 或 /contact 的用户会被 header logo 链接白白预取 136KB 首页 payload，而他们多半不会回首页。

**修复建议**

两条独立措施：① SiteHeader 的 logo Link 加 `prefetch={false}`（1 行）——首页是所有站内链接里 payload 最大的那个，最不该被无条件预取；② 见下条 blueprint-object-dual-variant，砍掉首页一半 SVG DOM 就能同时压掉 HTML 与 flight。若要更彻底，把 BlueprintObject 的纯静态 SVG 部分抽成 public/*.svg 用 <img> 引入（但会牺牲逐笔 bp-draw 动画，需设计权衡）。

**验证过程**：实测 .next/server/app 各页 HTML 尺寸与发现完全一致（index 275,506 / about 59,123 / contact 47,372 / products 67,241 / brokerage 71,994）；index.rsc = 135,921 B；index.html 内 __next_f.push 47 次、<svg> 35 个；SiteHeader.tsx:30 fixed header、line 39 Link href="/" 无 prefetch 属性，全站 grep prefetch 零命中。

**⚠️ 验证修正**：小修正：预取由 Router Cache 缓存，是每 session 一次而非「每个页面」都重复拉 136KB；核心问题（非首页访客被无条件预取全站最大 payload + 首页 HTML/flight 过重）成立。

---

## 25. [MEDIUM / CONFIRMED] Hero 物件的桌面与移动两套变体同时进 DOM，靠 hidden/lg:hidden 切换——每个设备都下载并解析用不上的那一半

- **维度**：构建配置与交付　**位置**：`src/components/home/HomeHero.tsx:114`
- **原始评级**：severity=medium confidence=high　→　**验证后**：medium

**证据**

HomeHero.tsx:114-129：`<div className="hero-tilt hidden lg:block"><HeroObjectPhysics><BlueprintObject /></HeroObjectPhysics></div>` 与 `<div className="mt-2 lg:hidden">...<BlueprintObject variant="mobile" /></div>` 并列渲染。实测首页 HTML 中桌面变体区段 30,383 B（126 个 <path>、72 个 <div>），移动变体区段 15,392 B（54 个 <path>、51 个 <div>）——两者都实打实在 DOM 里，只是 CSS display:none。RSC flight 里同样各存一份（这是首页 flight 达 155KB 的主因之一）。

**影响**

手机用户解析并构建 30KB / 126 个 path 的桌面 SVG 节点树后再 display:none 丢弃；桌面用户反之付 15KB。DOM 节点数与 flight 体积各多约一倍，直接推高移动端首屏解析时间和 hydration 成本——而移动端恰是 CWV 打分的那一档设备。

**修复建议**

两个方向：① 保守——保持结构不变但把移动变体挪进 `<Suspense>` + 客户端媒体查询懒渲染（会引入 CLS，不推荐）；② 推荐——CSS 侧改造：让两个变体共用同一份模块 geometry，把差异（360×440×150 vs 300×168×120、frontEtch/topEtch 表）做成 CSS 变量 + 媒体查询驱动，只渲染一份 SVG。后者是设计系统级改动（BlueprintObject.tsx 1306 行，VARIANTS 表结构要重构），建议先在 spec 里定案再动，改动量约 200-300 行。若短期只想止血，至少确认移动变体的 54 个 path 是否可以精简。

**验证过程**：HomeHero.tsx:114-129 实读确认桌面 hidden lg:block 与移动 lg:hidden 两套 BlueprintObject 并列渲染；grep 构建 HTML 确认 bp-object-scene--mobile 与 hero-tilt hidden lg:block 各出现 2 次（HTML + flight 各一份），两变体均实打实进 DOM。源码注释说明的取舍只针对「不双挂 client 物理组件」，未覆盖 DOM 双份问题，不构成设计豁免。

---

## 26. [MEDIUM / PARTIAL] prefers-reduced-motion 块漏掉 scroll-behavior: smooth —— 「三件套」claim 只覆盖了 animation，没覆盖平滑滚动

- **维度**：CSS 引擎　**位置**：`src/app/globals.css:178`
- **原始评级**：severity=high confidence=high　→　**验证后**：medium

**证据**

globals.css:177-179 `html { scroll-behavior: smooth; }` 是全局声明，layout.tsx:75 还显式加了 `data-scroll-behavior="smooth"` 坐实这是有意的。而 1489-1552 的 `@media (prefers-reduced-motion: reduce)` 块里只有四条 `animation-duration/animation-delay/transition-duration/transition-delay` 通配重置 + 一份 `animation: none !important` 白名单，**没有任何一行碰 scroll-behavior**。我逐个 @keyframes 核对过 RM 覆盖（sheetSettle/heroTilt 走 scroll-driven 显式关闭 ✅；objFloat/objSway/modDrift/seamPulse/corePulse/tracePulse/pipCycle×2/portCycle×2/ringStep/objShadow/marquee/scrollPulse 全部 infinite 且全部在 1511-1526 白名单里 ✅；bpDraw/bpFade/wordReveal/bpSolidify/modAssemble/seamIn/coreIn/objShadowIn/scaleIn/reveal/scaleInDot 非 infinite，靠 0.01ms 全局重置落终态 ✅）——动画侧确实无遗漏，唯一的窟窿就是 scroll-behavior。锚点跳转（contact 页 `#` 链接、页内导航）和 Next Link 路由回顶都会触发全屏平滑滚动，这正是 WCAG 2.3.3 / 前庭敏感用户要规避的运动类型，而它绕过了整个 RM 块。

**影响**

开启「减少动态效果」的用户（macOS/iOS 辅助功能、Windows 动画关闭）点击任何页内锚点或路由跳转时，仍会看到整屏平滑滚动动画。这个站在 a11y 上做得极其细致（RM 白名单 15 条、SSR 可见基态、hover 媒体门控），唯独漏了最经典的那一条，是纪律文档与实现之间的实际偏差——CLAUDE.md §6「三件套已全部落实」的说法对动画成立，对滚动不成立。

**修复建议**

在 RM 块内补 3 行（改动量 <5 行）：
```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  ...
}
```
或者更彻底地把基态改成条件式：`@media (prefers-reduced-motion: no-preference) { html { scroll-behavior: smooth } }`，这样默认就是 auto，不依赖后面的覆盖顺序。同时把 CLAUDE.md §6「三件套」升级为「四件套」，把 scroll-behavior 写进纪律清单。

**验证过程**：读了 globals.css:177-179（html scroll-behavior:smooth）、layout.tsx:75（data-scroll-behavior="smooth"，Next 16 该属性 = 主动选择路由跳转保留平滑滚动）、RM 块 1489-1552 全文——确认四条通配重置 + animation:none 白名单里没有任何 scroll-behavior 覆盖，动画侧逐条核对与其声称一致。但 grep href="#" 全库只命中 (public)/layout.tsx:19 的 #main-content 跳转链接——「contact 页 # 链接、页内导航」不存在，页内锚点场景只剩 skip link。

**⚠️ 验证修正**：问题成立但触发面比声称的小：站内没有内容锚点链接，唯一页内锚点是 skip link；主要暴露路径是路由跳转的回顶平滑滚动（data-scroll-behavior="smooth" 坐实会平滑）+ skip link。修复建议（RM 块补 html{scroll-behavior:auto}）正确有效。严重度 high 偏高，降 medium：每次导航对 RM 用户触发整页滚动动画，是真实 WCAG 缺口，但无内容不可达。

---

## 27. [MEDIUM / CONFIRMED] 按钮 hover 态是全站唯一未加 @media (hover: hover) 门控的引擎 —— 触屏 sticky hover 会让按钮永久顶出 +16px、槽光常亮

- **维度**：CSS 引擎　**位置**：`src/app/globals.css:526`
- **原始评级**：severity=medium confidence=medium　→　**验证后**：medium

**证据**

构建产物实测确认：`.btn-primary:hover:not(:disabled),.btn-secondary:hover:not(:disabled){transform:perspective(700px)translateZ(16px)}` 出现在顶层，不在任何 @media 内。源码对应 globals.css:526-529（顶出）、556-566（primary hover 渐变+投影）、593-605（secondary hover）、666-668（`.btn-module-frame:has(:hover)::after` 涌光）——四处 hover 规则，零门控。
对照组全部是门控的：`.card-glass:hover`（418）、`.card-glass-interactive:hover/:active`（435/449）、`.bp-mod-hover`（1025）都在 `@media (hover: hover)` 里；tailwind.config.js:6-8 的 `hoverOnlyWhenSupported: true` 把所有 `hover:`/`group-hover:` utility 编进 `@media (hover:hover) and (pointer:fine)`（构建产物已确认）。也就是说全站只有手写的按钮引擎漏网。
CLAUDE.md §7 明写「触屏无 hover：静态齐平嵌墙 + :active 按入传达质感（纯 CSS，无 JS 依赖）」——实现与该条纪律不符。

**影响**

iOS/Android 上 tap 一个**不导航**的按钮后（ContactForm 的 submit、错误态的 "Try Again"、任何 onClick 形态），:hover 会粘滞到下次点击别处：按钮停在 translateZ(16px) 顶出位、投影挂着、槽缝涌光常亮。这正是 v7 卡片系统专门修掉的那个病灶（「不可点的卡带可点式反馈」的孪生问题），按钮侧没跟上。导航型按钮因为页面切走所以看不出来，掩盖了缺陷。

**修复建议**

把四处 hover 规则包进 `@media (hover: hover)`（:active/:focus-visible/:disabled 保持不动，它们在触屏上是有效反馈）。改动约 12 行缩进 + 4 个 @media 包裹，行为在桌面完全不变。注意 `.btn-module-frame:has(:hover)` 那条也要包，否则槽光仍会粘。改完后 CLAUDE.md §7「触屏无 hover」那句才成立。

**验证过程**：逐行核实 globals.css：526-529 顶出、556-566 primary hover、593-605 secondary hover、666-668 涌光 :has(:hover)——四处全在顶层无 @media (hover:hover)；对照组 .card-glass:hover(418)/.card-glass-interactive(435/449)/.bp-mod-hover(1025) 确实全部门控；tailwind.config.js:6-8 hoverOnlyWhenSupported:true 属实。ContactForm.tsx:110 的 onClick "Try Again" 与 191-197 的 type=submit 确认存在不导航按钮，触屏 sticky hover 会让其粘在顶出+涌光态。与 CLAUDE.md §7「触屏无 hover：静态齐平嵌墙」的声明直接矛盾，且无任何注释表明是有意豁免。

---

## 28. [MEDIUM / CONFIRMED] .form-field 焦点环只用 box-shadow 且 outline: none —— 强制高对比模式（Windows HCM / forced-colors）下焦点完全不可见

- **维度**：CSS 引擎　**位置**：`src/app/globals.css:1441`
- **原始评级**：severity=medium confidence=medium　→　**验证后**：medium

**证据**

globals.css:1441-1448：
```css
.form-field:focus {
  outline: none;
  border-color: var(--accent);
  background: rgba(8, 11, 16, 0.92);
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.35), 0 0 0 2px rgba(74,159,229,0.3);
}
```
forced-colors 模式下浏览器会丢弃 box-shadow 并强制改写 border-color 为系统色，于是「outline 被显式关掉 + box-shadow 被系统丢弃 + border 被系统统一着色」= ContactForm 的 4 个输入框在键盘 Tab 时没有任何可辨识的焦点指示。
对照：按钮走的是 `outline: 2px solid var(--accent); outline-offset: 3px`（536-540），outline 在 forced-colors 下会被保留并改成系统高亮色——按钮做对了，表单没有。

**影响**

依赖 Windows 高对比度模式的低视力/键盘用户在联系表单里 Tab 时失去焦点位置。这是站点唯一的转化入口（contact 表单），影响面小但性质是硬 a11y 缺陷（WCAG 2.4.7 Focus Visible）。置信度标 medium 是因为我没有在真实 forced-colors 环境实测，结论来自规范行为（forced-colors 下 box-shadow 计算为 none）。

**修复建议**

两种改法，任选：① 把 `outline: none` 换成 `outline: 2px solid transparent; outline-offset: 2px`（transparent outline 在 forced-colors 下会被系统改成实色，是标准兜底手法，正常模式下不可见）；② 补一条 `@media (forced-colors: active) { .form-field:focus { outline: 2px solid Highlight; outline-offset: 2px } }`。改动 2-4 行。

**验证过程**：读了 globals.css:1441-1448：.form-field:focus 确为 outline:none + box-shadow ring，引用逐字属实；对照按钮 536-540 用 outline: 2px solid + offset 属实；ContactForm.tsx 确认消费 .form-field。forced-colors 下 box-shadow 强制为 none、border-color 被系统改写是规范行为（未真机实测，与审查者自述一致），outline:none 导致焦点指示归零的推理成立。transparent outline 兜底是标准手法。影响面（Windows HCM 用户 × 唯一转化表单）如实。

---

## 29. [MEDIUM / PARTIAL] ResultsSection 的 240 行启发式解析器，在全部 5 个案例 21 条 results 上只产出 2 张 stat 卡——应改为数据层显式字段

- **维度**：巨型组件与抽象　**位置**：`src/components/case-study/ResultsSection.tsx:26`
- **原始评级**：severity=high confidence=high　→　**验证后**：medium

**证据**

文件第 26–290 行是一整套文本挖掘管线：DIGITS 正则、SYMBOL_STAT/UNIT_STAT 双通道全局扫描、UNIT_WORDS 白名单（68 个词，52–120 行）、HEDGE_PREFIX 限定词正则（127–128 行，单行 340 字符）、TRAILING_FILLER 虚词表、BASELINE_CTX/BASELINE_TO_LEAD 语境判别、trimPunct/trimFiller/collectCandidates/contextOf/pickCandidate/extractStat 共 7 个函数。注释里记录了 9 个已知回归案例（F1–F5、I-1–I-4）和 6 类「有意为之的漏报」。

我对已构建产物做了实测（.next 构建于 07:37，HEAD 提交 07:20，构建是最新的）：
  easy-sign break-words-occ=1 / t-one-submit=0 / onest-insurance=0 / brokertool-ai=0 / getax=1
即 5 个案例页 21 条 results 字符串，总共只解析出 2 张 stat 卡（easy-sign 的 "under 15 minutes" / "Reduced document turnaround from days"，getax 的 "2 weeks" / "New professional web presence launched"）。3 个案例页的 The Results 段完全没有大数字，退化成纯 bullet 列表。

results 数据本身是 src/data/case-studies.ts 里手写的 21 条英文字符串（43–48、77–82、111–116、145–150、180–186 行），全部是编译期已知的静态内容。

**影响**

用 240 行含 9 个已知失效模式的启发式代码，去解析一份自己手写的、共 21 条、编译期完全已知的静态文案，只为省掉写 2 组 {value,label}。每次文案作者改一个词（比如把 "in 2 weeks" 改成 "in about two weeks"），页面上的大数字会静默消失，没有任何报错、构建照过。反向也成立：新增单位词必须回来改白名单，否则新写的成果永远上不了卡。维护成本与产出严重倒挂，且这是对外营销材料——注释自己写了「误报是对外材料红线」，但防线是正则而不是人工授权。

**修复建议**

1) 在 src/data/case-studies.ts 的 CaseStudy 接口加可选字段：`stats?: readonly { value: string; label: string }[]`（+3 行）；把现在解析出的 2 组、以及作者认为该上卡的其它组，显式写进 5 条数据里（约 +12 行）。2) ResultsSection 改为 `const stats = cs.stats ?? []; const bullets = results`，删除 26–290 行整段解析器（−265 行），组件回到约 60 行。3) 如果不愿一次性删，最小步骤是先把解析器整体搬到 src/lib/extract-stat.ts 并保留 ResultsSection 只做渲染——但那只解决可测性，不解决「用解析代替授权」的根因。推荐方案 1+2。改动量：数据层 +15 行，组件 −265 行，净 −250 行。

**验证过程**：复刻解析器全逻辑（DIGITS/SYMBOL_STAT/UNIT_STAT/HEDGE_PREFIX/contextOf/pickCandidate）跑了 case-studies.ts 全部 21 条 results：easy-sign 1 卡（under 15 minutes）、getax 1 卡（2 weeks）、其余 3 案例 0 卡，总计恰为 2——数字断言实测属实。解析器确为 26–290 行、注释含 9 个回归案例。但『改词大数字静默消失』不是无防护失败：文件头写明铁律『解析不到就 bullet 直排，不虚构数字』，降级 bullet 是 spec（IA v1 §4.4）授权的预期行为，且解析路线本身是有定案史的设计决策，不是意外堆积

**⚠️ 验证修正**：事实全部成立（21 条只产出 2 卡、240 行启发式、9 个书面回归），但『文案改词数字静默消失』是文件头铁律明文接受的降级路径而非未察觉的失败模式，解析器也是 IA v1 §4.4 定案的设计路线。因此这是一条成本/收益严重倒挂的简化建议（数据层显式 stats 字段确实更优），不是 high 级缺陷——当前页面渲染全部正确

---

## 30. [MEDIUM / PARTIAL] 仓库没有任何测试基建，而 240 行正则解析器带 9 个书面回归案例

- **维度**：巨型组件与抽象　**位置**：`package.json:6`
- **原始评级**：severity=high confidence=high　→　**验证后**：medium

**证据**

package.json 的 scripts 只有 dev/build/start/lint/format，devDependencies 里没有 vitest/jest/@testing-library，仓库根也没有任何 test 目录。而 ResultsSection.tsx 的注释里逐条记录了 9 个靠人工审查发现的解析缺陷（F1「reduced from A to B 取到旧指标」、F2「2023, 被吃成千分位」、F4「not more than 15 分钟被读成 >15」、I-1 双向标点剥离、I-2 compared to、I-3 Was 6 hours 句式、I-4 否定词反义…），每一条都是一次真实回归。

**影响**

这 9 个案例现在只存在于注释里，没有任何机制阻止它们回流。任何人碰 HEDGE_PREFIX 或 TRAILING_FILLER 都是在无网走钢丝，而失败模式是「对外页面上出现一个错误的大数字」——注释自己称之为红线。

**修复建议**

如果采纳上一条（改数据层字段），这个问题连同解析器一起消失，这是最省事的解法。如果决定保留解析器：`npm i -D vitest`，加 `"test": "vitest run"`，把解析器搬到 src/lib/extract-stat.ts，为注释里 9 个案例各写一条断言（约 60 行测试）。两条路二选一，现状（保留解析器 + 零测试）不可接受。

**验证过程**：读了 package.json：scripts 只有 dev/build/start/lint/lint:fix/format，devDependencies 无任何测试框架；find 全仓无 *.test.* / *.spec.* 文件。ResultsSection 注释确有 F1–F5、I-1–I-4 共 9 个书面回归案例

**⚠️ 验证修正**：事实成立（零测试基建 + 240 行带 9 个书面回归的正则解析器）。但严重度 high 偏高：这是静态营销站，解析失败的落点是 spec 授权的 bullet 降级而非错误数字上页（误报防线是白名单，9 案例修复后误报路径已收窄），风险实质是维护期回归而非线上事故。若采纳数据层字段方案该问题整体消失

---

## 31. [MEDIUM / CONFIRMED] ModuleShell 里前/右/顶三个面是三段近乎逐字符相同的 30 行块，没有抽出 Face 子组件

- **维度**：巨型组件与抽象　**位置**：`src/components/home/BlueprintObject.tsx:1082`
- **原始评级**：severity=medium confidence=high　→　**验证后**：medium

**证据**

1082–1113（前面板）、1115–1169（右侧面）、1171–1208（顶面）三段结构完全同构：`<div className="bp-face" style={...}>` → `<div className="bp-face-fill bp-face-fill--X" style={fillStyle} />` → `<svg viewBox={...} fill="none" className="absolute inset-0 h-full w-full">` → 逐笔绘制的 edge path（`pathLength={1} className="bp-draw" style={drawStyle}`）→ 增亮副本（`stroke={STROKE.boost} className="bp-edge-boost"`）→ children。三处只差 4 个值：定位 style、fill 修饰类、viewBox 尺寸、edge 描边档。edge/boost 这一对 12 行 path 声明原样出现了 3 次（1097–1110、1135–1148、1191–1204）。

**影响**

改任何一条共享纪律（比如给 edge 加 vector-effect、改 boost 的 strokeWidth、给 svg 加 shape-rendering）要在三处同步；漏一处不报错、不掉 lint，只会在某个面上悄悄不一致。物件是首页视觉主角，这类漂移只能靠肉眼在 3D 透视下发现。

**修复建议**

抽 `function Face({ box, fill, viewBox, stroke, drawStyle, fillStyle, children })`（约 35 行），三个调用点各压到 8–10 行。ModuleShell 从 195 行降到约 110 行，净 −70 行，且 edge/boost 只剩一份。

**验证过程**：读了 BlueprintObject.tsx 1082–1213：前面板 1082–1113、右侧面 1115–1169、顶面 1171–1208 三段结构同构，edge path + boost 副本这对 12 行声明在 1097–1110、1135–1148、1191–1204 原样出现 3 次，行号与描述完全吻合；三处只差定位 style、fill 修饰类、viewBox、描边档

---

## 32. [MEDIUM / CONFIRMED] 四张蚀刻表是 409 行内嵌 JSX 的 Record，同一个 map-Draw 惯用法重复 31 次

- **维度**：巨型组件与抽象　**位置**：`src/components/home/BlueprintObject.tsx:537`
- **原始评级**：severity=medium confidence=high　→　**验证后**：medium

**证据**

FRONT_ETCH(537–785)、MOBILE_FRONT_ETCH(788–880)、TOP_ETCH(883–919)、MOBILE_TOP_ETCH(921–945) 共 409 行，类型是 `Record<string, ReactNode>`——即把 JSX 塞进数据表。其中 `.map((d) => (<Draw key={d} d={d} stroke={...} delay={...} />))` 这个惯用法出现 31 次（grep 确认：541/555/579/582/590/593/604/635/650/669/710/719/726/735/749/762/791/825/829/845/853/861/875/887/900/904/911/914/925/933/940 行），每次消耗 3–4 行纯包装。典型如 569–586 行的 M.02 面：18 行里只有 8 行是坐标数据。全表里真正的信息量只有 path 字符串数组 + 一个描边档 + 一个延迟档。

**影响**

409 行里约 200 行是包装噪声，坐标数据被 JSX 语法淹没；作者要调一条刻度线得在 4 层缩进里找。更实际的问题是：这些是「同一台机器的两张视图」的图纸数据，本该能被脚本读取/校验（比如自动检查跨模块走线端点是否对齐——注释 535–536 行手工记录了 x193/x256 的对齐关系），但塞进 JSX 后任何工具都读不了。

**修复建议**

定义 EtchItem 可判别联合（draw/label/nameplate/dot/pip/trace/ring/corePulse 共 8 个 kind，约 25 行），写一个 `<Etch items={...} />` 分发器（约 45 行），四张表变成纯数据数组。同时加 `<DrawSet ds={[...]} stroke delay />`（约 12 行）吃掉 31 处 map。预估：409 行 → 约 190 行数据 + 70 行渲染器，净 −150 行，且坐标表变成可被脚本校验的纯数据。

**验证过程**：grep 确认四张表起始行：FRONT_ETCH 537 / MOBILE_FRONT_ETCH 788 / TOP_ETCH 883 / MOBILE_TOP_ETCH 921（至 945），均为 Record<string, ReactNode>；`.map((d) => (` 全文件命中 33 处，其中 2 处在 ModuleShell/datum，蚀刻表内 31 处与所列行号一致；抽样读 M.01/M.02/M.03 确认典型段落里坐标数据被 map-Draw 包装稀释

---

## 33. [MEDIUM / CONFIRMED] 模块码与蚀刻表键之间没有类型关联，键名打错就是一张静默空白的面板

- **维度**：巨型组件与抽象　**位置**：`src/components/home/BlueprintObject.tsx:65`
- **原始评级**：severity=medium confidence=high　→　**验证后**：medium

**证据**

`interface ModuleDef { code: string; ... }`（第 65 行）把模块码宽化成 string；四张蚀刻表和 RIGHT_SEAMS 都声明为 `Record<string, ReactNode>` / `Record<string, string[]>`（537、788、883、921、948 行）；VariantConfig 同样是 `frontEtch: Record<string, ReactNode>`（965–967 行）。渲染时 `front={v.frontEtch[def.code]}`（1237 行）。tsconfig 没开 noUncheckedIndexedAccess，所以 `v.frontEtch['M.4']` 的类型是 ReactNode 而不是 ReactNode|undefined。

**影响**

把 FRONT_ETCH 的键写成 'M.4'、或者往 MOBILE_FRONT_ETCH 里错填一个只有桌面才有的 'M.06'，TypeScript 完全沉默，biome 也不管——结果是某块面板上蚀刻全部消失（只剩外框），而物件带 2.8s 入场编排、桌面才可见、还在 3D 透视下，这种缺失极易漏检。同理 MODULES 里 `hasTop: true` 而 TOP_ETCH 缺该键，也是静默空顶面。

**修复建议**

把 MODULES / MOBILE_MODULES 改为 `as const satisfies readonly ModuleDef[]`，导出 `type DesktopCode = (typeof MODULES)[number]['code']`（字面量联合），四张表改用 `Record<DesktopCode, EtchItem[]>` / `Partial<Record<DesktopCode, ...>>`（顶面表用 Partial，因为只有 hasTop 模块有）。VariantConfig 泛型化 `interface VariantConfig<C extends string>`。改动约 15 行，把「键名打错」从静默失效变成编译错误。

**验证过程**：读了第 64–80 行 ModuleDef（code: string）、537/788/883/921/948 行的 Record<string,...> 声明、965–967 行 VariantConfig、1237 行 v.frontEtch[def.code] 取值；tsconfig.json 只有 strict:true，无 noUncheckedIndexedAccess——键名打错确实编译沉默、面板静默空白

---

## 34. [MEDIUM / CONFIRMED] VariantConfig 用 Tailwind 字面类字符串重复编码 width/height，改几何尺寸会静默半更新

- **维度**：巨型组件与抽象　**位置**：`src/components/home/BlueprintObject.tsx:991`
- **原始评级**：severity=medium confidence=high　→　**验证后**：medium

**证据**

VARIANTS 里同一组尺寸被写了两遍，一遍是数值一遍是任意值类名：
- desktop: `width: 360, height: 440`（976–977 行）与 `rootClass: 'h-[540px] w-[360px]'`（991 行）、`floatClass: 'top-[56px] h-[440px]'`（992 行）
- mobile: `width: 300, height: 168`（995–996 行）与 `rootClass: 'h-[240px] w-[300px]'`（1009 行）、`floatClass: 'top-[40px] h-[168px]'`（1010 行）
注意 540 = 56 + 440 + 44、240 = 40 + 168 + 32，是派生量却手算硬写。VariantConfig 的 width 字段注释（956–957 行）自己强调「写死字面量的话将来改宽组合体右面会静默全部消失」——但 rootClass/floatClass 恰恰就是写死的字面量。

**影响**

把 height 从 440 改成 480，模块几何会跟着变，但 floatClass 的 h-[440px] 和 rootClass 的 h-[540px] 不会——结果是物件底部被容器裁掉或投影错位，没有报错。这正是该文件其它地方极力避免的那类失败，只是在这两个字段上破了功。

**修复建议**

删掉 rootClass/floatClass，改为从 width/height/depth 派生的内联 style：VariantConfig 加 `topPad: number; bottomPad: number`，根容器写 `style={{ width: v.width, height: v.topPad + v.height + v.bottomPad }}`，float 层写 `style={{ top: v.topPad, height: v.height }}`。Tailwind 任意值本来就无法动态生成，用 style 是这里的正解。改动约 12 行。

**验证过程**：读了 VARIANTS 975–1012 行：desktop width:360/height:440 与 rootClass 'h-[540px] w-[360px]'、floatClass 'top-[56px] h-[440px]'，mobile 同款双写，540=56+440+44、240=40+168+32 派生量手算硬写属实；956–957 行注释确实警告『写死字面量会静默失效』而这两个字段正是字面量

---

## 35. [MEDIUM / CONFIRMED] BlueprintObject.tsx 1306 行里塞了 8 个互不相干的关注点，没有任何模块边界

- **维度**：巨型组件与抽象　**位置**：`src/components/home/BlueprintObject.tsx:1`
- **原始评级**：severity=medium confidence=high　→　**验证后**：medium

**证据**

单文件承担：① 设计 token（STROKE 25–35）② 动画节奏表（T/MT 39–54）③ 几何数据（MODULES/MOBILE_MODULES/SEAMS/MOBILE_SEAMS，94–318，共 217 行）④ SVG 图元组件（Draw/DashRing/MonoLabel/Nameplate/TracePulse/NodeDot，321–533，共 7 个组件）⑤ 蚀刻图纸数据（537–952，共 415 行）⑥ 响应式变体配置（955–1012）⑦ 3D 面/模块渲染（edge/ModuleShell，1015–1214）⑧ 场景装配 + 缝光 + 基准面（1216–1306）。文件里定义了 8 个模块级 React 组件和 9 张模块级数据表。

**影响**

任何一次改动（调一根刻度线、加一个模块、改一档描边 alpha）都要在 1306 行里定位；review diff 时无法从文件名判断改的是几何、图纸还是渲染逻辑；也没法对几何数据做单独的静态校验。

**修复建议**

拆成一个目录 src/components/home/blueprint-object/：
- tokens.ts（STROKE + T/MT + StrokeKey/DelayKey 类型）约 60 行
- geometry.ts（ModuleDef/SeamDef 类型、MODULES、MOBILE_MODULES、SEAMS、MOBILE_SEAMS、circlePath、edge、CORE_RING/_M）约 200 行
- primitives.tsx（Draw、DrawSet、DashRing、MonoLabel、Nameplate、TracePulse、NodeDot、Pip、Etch 分发器）约 150 行
- etch.desktop.ts / etch.mobile.ts（纯 EtchItem 数据）约 180 + 90 行
- variants.ts（VariantConfig + VARIANTS）约 70 行
- Face.tsx + ModuleShell.tsx 约 145 行
- ../BlueprintObject.tsx（根装配 + 缝光 + datum）约 70 行
合计约 965 行（含上面几条的 Face/DrawSet/数据化收益），比现在少约 340 行，且每个文件单一职责。这是纯机械搬迁 + 上述四条重构，无行为变更，可分两次 PR（先拆文件、再数据化）。

**验证过程**：wc -l 确认 1306 行；通读文件验证 8 个关注点分区（STROKE/T+MT 节奏表/MODULES 几何/7 个 SVG 图元组件/4 张蚀刻表/VARIANTS/ModuleShell/根装配）行号范围与描述一致。拆分建议是纯机械搬迁，无与 CLAUDE.md 冲突的定案（CLAUDE.md 未钦定单文件）

---

## 36. [MEDIUM / CONFIRMED] BlueprintObject 占首页 HTML 的绝大部分：275KB 首页 vs 67KB 次重页，纯装饰 aria-hidden 内容

- **维度**：巨型组件与抽象　**位置**：`src/components/home/BlueprintObject.tsx:1216`
- **原始评级**：severity=medium confidence=high　→　**验证后**：medium

**证据**

对当前构建产物（.next 07:37，HEAD 07:20，同步）的实测：
- 首页 index.html 275,466 B；对比 products.html 67,241 B、about.html 59,123 B、contact.html 47,372 B。首页是次重页的 4.1 倍。
- 首页内两个变体的 DOM 标记：桌面变体 30,246 B（68 div + 15 svg + 126 path + 21 text + 10 circle + 3 rect + 11 g ≈ 253 元素），移动变体 15,018 B（≈125 元素），合计 45.3 KB / 378 元素。
- 首页 RSC flight payload（self.__next_f）153,541 B = 全文件的 55.7%，其中把同一棵 SVG 树以转义 JSON 元素树的形式又编码了一遍（桌面那一段约 62.6 KB，比它的 HTML 形态 30.2 KB 大一倍——每个 path 的 props 都被逐个转义）。对比 about.html 的 flight 只有 32 KB。
- 压缩后：index brotli 17,325 B vs products 7,651 B，上线净增约 9.7 KB。
- 确认 BlueprintObject 是纯 Server Component（无 'use client'），路径数据没有进任何 client chunk（grep "M123 100 V108" 在 .next/static/ 下零命中）——JS 包成本为 0。

**影响**

传输成本其实不大（brotli 后 +9.7KB），真实成本是解析与 DOM 构建：低端手机要解析 208 KB 多出来的标记、构建约 378 个额外元素、再解码同等规模的 flight JSON，全部为了一段 `aria-hidden="true"` 的装饰图形。LCP 元素（h1）在文档顺序上位于物件之前，所以 LCP 大概率不受影响，但 TTI/交互就绪和低端机内存会受影响。这不是 critical，但值得知道数字。

**修复建议**

按收益排序：① 最实在的一条见下一条（双变体同时进 DOM）。② flight 体积可以通过把两个面板的静态蚀刻层改成 `dangerouslySetInnerHTML={{__html: PRECOMPILED}}` 常量字符串来砍掉——flight 里就变成一条字符串而不是几百个元素对象，预估省 30–50 KB（代价是失去 JSX 可读性，建议由上面的数据化重构在构建期生成）。③ 如果决定不动，至少把这些数字写进 spec，避免后续继续往物件上加细节。

**验证过程**：对 .next/server/app 实测：index.html 275,466 字符（stat 275,506 字节，差异为编码计法）、products 67,241、about 59,123、contact 47,372，4.1 倍属实；用 node 正则累计 self.__next_f flight payload = 153,541 字符 = 55.7%，与声称分毫不差；grep bp-object-root ×4、bp-module ×24 佐证双份 HTML+flight 编码。BlueprintObject 无 'use client' 属实

---

## 37. [MEDIUM / CONFIRMED] 桌面与移动两个物件变体永远同时进 DOM，各自被 display:none 掉一个

- **维度**：巨型组件与抽象　**位置**：`src/components/home/HomeHero.tsx:113`
- **原始评级**：severity=medium confidence=high　→　**验证后**：medium

**证据**

HomeHero 113–130 行同时渲染两棵树：`<div className="hero-tilt hidden lg:block"><HeroObjectPhysics><BlueprintObject /></HeroObjectPhysics></div>` 和 `<div className="mt-2 lg:hidden"><div className="bp-object-scene bp-object-scene--mobile">…<BlueprintObject variant="mobile" /></div></div>`。构建产物确认两份都在 HTML 里（bp-object-root 在 index.html 出现 4 次 = 2 份 HTML + 2 份 flight；bp-module 出现 24 次 = 桌面 7 + 移动 5，各两份）。

**影响**

手机用户下载并解析 30.2 KB / 253 个元素的桌面塔体，全程 display:none；桌面用户同样白付 15 KB / 125 个元素的移动变体。这是可以被识别的纯浪费——不是权衡，是漏掉的分支。

**修复建议**

三个选项，按可行性：① 接受现状但把移动变体的细节密度降下来（它已经是「另一张视图」，蚀刻可以更省），预估省 5–8 KB。② 移动变体用 CSS `content-visibility: hidden` 不解决 HTML 体积，无效，别做。③ 真正的解法是把「哪个变体」交给一个极小的 client 组件用 matchMedia 决定挂载，SSR 默认出移动变体（体积小），桌面在 hydration 后换成塔体——物件本身带 2.8s 入场编排且 aria-hidden，200–400ms 的延迟挂载感知不到；代价是桌面变体的 SVG 树进 JS 包，必须配 next/dynamic 动态导入才划算。建议先做 ①，②③ 待有真机 profiling 数据再定。

**验证过程**：读了 HomeHero.tsx 113–130：hidden lg:block 桌面树与 lg:hidden 移动树同时渲染属实；构建产物 grep 确认 bp-object-root 出现 4 次（2 HTML + 2 flight）、bp-module 24 次（桌面 7 + 移动 5 各两份）。105–112 行注释只论证了移动侧不挂 client 物理，未权衡 DOM 双份成本——不属已考虑过的定案

---

## 38. [MEDIUM / CONFIRMED] /products 页内联手写了一张与 CaseStudyCard 结构完全同构的卡，32 行重复 JSX

- **维度**：巨型组件与抽象　**位置**：`src/app/(public)/products/page.tsx:80`
- **原始评级**：severity=medium confidence=high　→　**验证后**：medium

**证据**

products/page.tsx 80–111 行：`<Link className="block h-full group"><Card variant="interactive" sheetNo={...} cropMarks className="h-full flex flex-col">` → `<div className="h-10 mb-4 flex items-center">…</div>` → `<Eyebrow tone="tertiary" className="block mb-2">` → `<h3 className="text-base font-medium text-txt-primary mb-2 tracking-tight">` → `<p className="text-txt-secondary text-base leading-relaxed mb-4">` → `<div className="mt-auto flex items-center justify-end"><CardActionRow>`。
对照 src/components/products/CaseStudyCard.tsx 28–63 行：完全相同的骨架、相同的类串、相同的顺序。唯一差别是 h-10 那一格里放的是 mono 文字徽标而不是 `<Image>`。CaseStudyCard 的文件头注释还写着「加信息密度（行业眉标）时只改这里，不改两份 JSX」——而这里就是第二份 JSX。

**影响**

作品网格里 6 张卡有 5 张走组件、1 张手写。任何卡片级调整（间距、hover 语义、cropMarks 策略、eyebrow 档位）都会让第 6 张跟另外 5 张不一致，而且这 6 张就并排在同一个网格里，不一致直接可见。

**修复建议**

给 CaseStudyCard 抽一层：新建 src/components/products/WorkCard.tsx（约 45 行），props = `{ href, sheetNo, media: ReactNode, eyebrow: string, title: string, body: string, action?: string, external?: boolean }`；CaseStudyCard 变成 WorkCard 的 12 行薄封装（传 `media={<ClientLogo …/>}`）；products/page.tsx 的 32 行内联块变成 10 行 `<WorkCard media={<span className="font-mono …">…</span>} … />`。顺带 RealEstateSiteGrid 的卡（28–68 行）也能复用同一个 WorkCard（external 分支）。净 −40 行，卡片形态收敛到一份。

**验证过程**：对照读了 products/page.tsx 80–111 与 CaseStudyCard.tsx 28–63：Link 包裹、Card interactive+sheetNo+cropMarks、h-10 头格、Eyebrow tertiary、h3/p 类串、mt-auto CardActionRow 收尾——骨架与类串完全同构，仅头格内容不同，属实。第 94 行注释『与五张软件卡同形态』自证是人工镜像同步。地产卡非 CaseStudy 类型确实没法直接复用现组件，需 WorkCard 抽层，建议成立

---

## 39. [MEDIUM / CONFIRMED] 砖数没有真正封顶：pitch 阶梯只按 min-width 分档，竖屏/超高视口直接冲到 2691 块 div（文档声称的现实上限是 1242）

- **维度**：运行时性能与移动端内存　**位置**：`src/app/globals.css:158`
- **原始评级**：severity=high confidence=high　→　**验证后**：medium

**证据**

globals.css:158-173 的注释写着「超宽 3440×1440 @64 档 ≈1242 为现实上限；v4.2 的 512 池已退役」，但阶梯只有 `@media (min-width: 2200px)` 和 `@media (min-width: 3600px)` 两档，**完全不看高度**；WallBricks.tsx:120-121 的 `rows = Math.ceil(clientHeight / pitch)` 也没有任何总数上限：
```js
cols = Math.ceil(document.documentElement.clientWidth / pitch);
rows = Math.ceil(document.documentElement.clientHeight / pitch);
```
实测各视口真实砖数（DOM 查询 `.bp-brick` 计数）：

| 视口 | pitch | 砖数 | 页面总节点 |
|---|---|---|---|
| 1920×1080 | 56 | 700 | 917 → 1617 |
| 2560×1440 | 64 | 920 | → 1837 |
| 3440×1440 | 64 | 1242 | → 2159 |
| **2199×1440**（卡在 2200 断点下沿） | 56 | **1040** | → 1957 |
| 1440×2560（竖置显示器） | 56 | 1196 | → 2113 |
| **2160×3840（竖置 4K）** | 56 | **2691** | → **3608** |

2691 块是文档假定上限的 2.2 倍。该配置下鼠标移动 2.1s 的开销：Layout 170.5ms、TaskDuration 958ms（≈45% 主线程）。

竖置显示器在开发者/设计师群体里并不罕见，而这正是这个站的目标访客画像。

**影响**

竖屏或高分屏用户拿到的是一个节点数 3600+、鼠标一动就吃掉近一半主线程的首页。没有任何降级路径会救他们——`hover+fine` 门控只区分设备类型，不区分设备规模。

另外 2199×1440 这个数据点暴露了阶梯设计本身的问题：断点下沿反而比断点上沿更贵（1040 > 920）。

**修复建议**

在 WallBricks.tsx 的 `build()` 里加一道总数上限，超了就按比例放大 pitch（几何仍与静态 tile 对齐，因为 tile 是 `background-size: var(--wall-brick-w)`，只要同步写回一个内联 `--wall-brick-w` 即可）：
```js
const MAX_BRICKS = 1400; // 与 3440×1440 的 1242 同量级
let n = Math.ceil(cw / pitch) * Math.ceil(ch / pitch);
if (n > MAX_BRICKS) {
  const k = Math.sqrt(n / MAX_BRICKS);
  pitch = Math.round(pitch * k / 16) * 16; // 保住 seam = pitch/16 不变量
  seam = pitch / 16; faceSize = pitch - seam;
  grid.style.setProperty('--wall-brick-w', `${pitch}px`); // 静态 tile 同步换档
  grid.style.setProperty('--wall-seam', `${seam}px`);
}
```
约 10 行。注意 `--wall-brick-w` 必须写在能同时被 `.bp-wall-face` 继承到的祖先上（`.bp-wall` 或 `:root`），否则静态砖床 tile 会与真砖错位——这正是 globals.css:320-330 那段注释在防的坑。

**验证过程**：纯代码可证：globals.css:158-173 阶梯只有 min-width:2200/3600 两档、注释明写「3440×1440 @64 档 ≈1242 为现实上限」；WallBricks.tsx:120-121 cols/rows = ceil(clientWidth/pitch)×ceil(clientHeight/pitch) 无任何总数上限。2160×3840 竖置视口宽 2160<2200 落 56 档：ceil(2160/56)=39 × ceil(3840/56)=69 = 2691，数学核实无误，确为文档假定上限的 2.2 倍；2199×1440 断点下沿 40×26=1040 > 2560 宽的 920，阶梯反常也属实。严重度降一档：受影响人群限于「竖置高分屏 + 细指针 + 真移动鼠标触发懒建砖」，是小众场景，但对这些用户的影响真实且无降级路径。注意修复建议里「把 --wall-brick-w 写在 grid 上」有误——.bp-brick 对位已是元素相对（globals.css:318-337），但静态砖床 .bp-wall-face 是 grid 的兄弟节点，须写在 .bp-wall/:root 级（发现自己的注释也指出了这点）。

**⚠️ 验证修正**：问题成立（无高度维度的砖数上限，竖屏可达 2691 块），但严重度应为 medium：仅影响竖置/超高视口 + hover+fine 设备的用户子集，主流横屏视口仍在文档假定范围内。

---

## 40. [MEDIUM / CONFIRMED] useCountUp 缺 prefers-reduced-motion 守卫，且每帧 setState 触发 React 重渲染

- **维度**：运行时性能与移动端内存　**位置**：`src/hooks/useCountUp.ts:22`
- **原始评级**：severity=medium confidence=high　→　**验证后**：medium

**证据**

useCountUp.ts:22-38 整段没有任何 RM 判断：
```js
useEffect(() => {
  if (!isVisible) return;
  const start = performance.now();
  const step = (now) => {
    ...
    setCount(Math.round(eased * target));
    if (progress < 1) rafRef.current = requestAnimationFrame(step);
  };
  rafRef.current = requestAnimationFrame(step);
  ...
}, [isVisible, target, duration]);
```
globals.css:1489-1552 的 reduced-motion 块只能压 CSS 动画/过渡，对 JS 驱动的 setState 完全无效。CLAUDE.md §6「prefers-reduced-motion 三件套」把 count-up 列进白名单却没给它守卫。

性能侧：默认 duration 1500ms，每帧一次 `setCount` → StatCard 组件 reconcile + Card + CardTilt 子树。about 页有多张 StatCard 同时入场，就是 N 条 rAF × N 次每帧 re-render。

**影响**

a11y：前庭敏感用户开了 reduced-motion 后，页面上其它一切都静止了，唯独统计数字还在从 0 疯狂跳到目标值 1.5 秒——这恰恰是 RM 要屏蔽的那类刺激。
性能：入场瞬间多张卡同时每帧走 React 渲染管线，是首屏可交互后最容易出现的一段掉帧，不过只持续 1.5s，量级不大。

**修复建议**

两处小改：
```js
useEffect(() => {
  if (!isVisible) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setCount(target); return; }
  ...
}, [isVisible, target, duration]);
```
（3 行）。若想顺带去掉每帧 re-render，把数字节点改成 ref 直写 `el.textContent`，hook 返回 ref 而非 state（~15 行，StatCard 侧同步改）。RM 守卫是必做，直写 DOM 可选。

**验证过程**：读 useCountUp.ts:22-38 全文核实：无任何 prefers-reduced-motion 判断，每帧 setCount 触发 React 重渲染属实；globals.css:1489-1552 RM 块确实只压 CSS 动画/过渡，管不到 JS setState；StatCard.tsx:48/61 消费链核实。CLAUDE.md §6 把 count-up 列入白名单但「RM 三件套」确实只覆盖 CSS 侧，这是纪律的真实漏洞而非定案豁免——RM 用户全页静止唯独数字跳动，a11y 违规成立。severity medium 恰当。

---

## 41. [MEDIUM / PARTIAL] clean main 上 `npm run lint` 直接失败：ContactForm 有一个 v7 重构遗留的死 import + 2 处格式偏移

- **维度**：僵尸代码与文档漂移　**位置**：`src/components/shared/ContactForm.tsx:11`
- **原始评级**：severity=high confidence=high　→　**验证后**：medium

**证据**

`npx biome check ./src` → `Found 3 errors`。其一是 `src/components/shared/ContactForm.tsx:11:8 lint/correctness/noUnusedImports` — `import Card from './Card';` 全文件零使用。这是 v7 「玻璃卡套玻璃卡」修复（文件头注释第 74-75 行：「成功态 — 裸内容（外层页面已有 container 玻璃卡包裹，此处再套 Card 会出现双层棱线，审查第 1 轮修复）」）拆掉 `<Card>` 后忘了删 import。另两个是 format 偏移：`src/app/api/contact/route.ts:304` 与 `ContactForm.tsx:107`。

**影响**

工作区是 `git status` 干净的 main（commit 2565d18），也就是说**已推送的生产分支上质量门是红的**。biome.json 里 `noUnusedImports` 配的是 `error`，任何把 lint 接进 CI/pre-push 的动作都会立刻卡住；同时它证明「任务完成后跑 code-review-loop」这条纪律在最近几次提交里被跳过了。死 import 还会让 Card 模块进 ContactForm 的 client chunk 依赖图（实际影响极小，但白占）。

**修复建议**

`npm run lint:fix`（= `biome check --write ./src`）一条命令全修，然后提交。之后建议把 `npm run lint` 接进 pre-push hook 或 Vercel build 前置步骤，避免再度漂红。改动量：1 分钟。

**验证过程**：实跑 npx biome check ./src → Found 3 errors：ContactForm.tsx:11 死 import Card（grep 确认全文件零 <Card 使用，v7 拆卡注释在第 74-75 行属实）+ route.ts 与 ContactForm.tsx 各一处 format 偏移。git status 干净、HEAD=2565d18，证据全部属实。但严重度偏高：无 CI lint 门在跑，运行时零影响，一条 lint:fix 即修——真实影响是开发摩擦而非用户可感。

**⚠️ 验证修正**：事实全部属实，但 high 夸大：当前没有任何 CI/pre-push 在消费 lint 结果，运行时零影响，属「质量门漂红」的卫生问题而非 high 级缺陷，medium 恰当。

---

## 42. [MEDIUM / PARTIAL] 2026-03 已完成的重构 plan 仍全篇未勾选 + 顶部写着「REQUIRED: 用 subagent 执行本 plan」，会指挥 agent 重做已删的工作

- **维度**：僵尸代码与文档漂移　**位置**：`docs/superpowers/plans/2026-03-14-remove-industries-simplify-nav.md:3`
- **原始评级**：severity=high confidence=high　→　**验证后**：medium

**证据**

第 3 行：`> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development ... Steps use checkbox (- [ ]) syntax for tracking.`；全文 30+ 个 `- [ ] **Step N: ...**` 无一勾选（Step 1 Remove industry type / Step 1 Delete file / Step 1 Rename directory …）。但这项工作早在 2026-03 就落地了：`src/data/case-studies.ts` 已无 industry 过滤函数、`/industries` 路由已删（next.config.js 第 16-17 行是它的 308 兜底）、导航已是三链。文件第 8 行还写着 `**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS 3` —— 实际是 Next 16.2 / React 19.2。

**影响**

这是仓库里唯一一份带「REQUIRED 执行」祈使语气的文档，且勾选状态显示为「一步没做」。任何被要求「按 docs/ 里的 plan 干活」的 agent 读到它，会去删已经不存在的 `src/app/industries/`、按 Next 14 的 API 改写页面，或者在 `git rm` 不存在的文件时反复失败。这正是用户点名的「冲突的 TODO 标记文档」。

**修复建议**

二选一：① 全部勾成 `- [x]` 并在文件头加 `> 状态：已于 2026-03-14 完成（commit 见 git log），本文件仅存档，勿再执行`；② 直接删掉这个 plan（specs/ 下已有对应的 design 文档留档）。同时把 Tech Stack 行改成 Next 16 / React 19 或删除。改动量：5 分钟。

**验证过程**：读了 plan 文件头：第 3 行 REQUIRED 祈使语气属实；grep 计数 36 个未勾选 checkbox、0 个已勾选；第 8 行 Tech Stack 写 Next.js 14/React 18，package.json 实际 next ^16.2.12 / react ^19.2.7；src/app/industries 不存在、next.config.js 15-18 行确有 308 兜底——工作确已完成。它也确是 plans/ 目录唯一文件。但严重度偏高：该文件只在 agent 被明确指向它时才有害，不会被自动执行。

**⚠️ 验证修正**：证据全部属实，但 high 夸大：危害是条件性的（仅当有人主动让 agent 执行该 plan），且 specs/ 下同名 design 文档并存可交叉发现矛盾。降 medium。另注：case-studies.ts 仍保留 industry 字段作眉标数据（这不是 plan 未完成——plan 删的是 Industries 路由/过滤概念）。

---

## 43. [MEDIUM / CONFIRMED] 墙体有两份 spec 同时自称「唯一正本」：v6 未加退役标记，仍在描述已删除的墙后灯光

- **维度**：僵尸代码与文档漂移　**位置**：`docs/superpowers/specs/2026-07-26-lantern-wall-v6-design.md:4`
- **原始评级**：severity=medium confidence=high　→　**验证后**：medium

**证据**

v6 spec 第 4 行：「本文是墙体系统的**唯一正本**；CLAUDE.md §2/§4/§6 的墙体条款与本文交叉锁定」。v8 spec（2026-07-27-graphite-wall-v8-design.md 第 6 行）：「本文是墙体材质与受光系统的**唯一正本**；CLAUDE.md §2/§4/§6 的墙体条款与本文交叉锁定」——同一句话，同一批锁定点。v6 正文第 9 行还写着「墙 = 光前面的一排真砖；指针 = 压在墙上的重力井 + **墙后的一盏灯**」，第 3 节层结构表列着 `.bp-wall-ambient` / `.bp-wall-lamp` 两层 —— 这两个 class 在 globals.css 里 grep 零命中（v8 已整体删除），CLAUDE.md 甚至写明「禁止以任何形式复活」。v6 文件里**没有任何**「已被 v8 取代」的横幅。

**影响**

新 session 或审查 agent 按文件名新旧排序找不到线索时，会读到两份互斥的「唯一正本」；v6 描述的墙后光源恰恰是 v8 明令禁止的东西，照着 v6 实施 = 直接违反现行设计纪律。这是本仓最容易踩的文档地雷。

**修复建议**

在 v6 spec 顶部加一行退役横幅：`> ⚠️ 已于 2026-07-27 被 2026-07-27-graphite-wall-v8-design.md 取代：受光模型（墙后灯光/角落余晖/指针灯）整体推翻，场景语义与真砖架构由 v8 继承。本文仅存架构决策史，勿作实施依据。` 并把「唯一正本」改为「v6 阶段正本」。改动量：2 分钟。同理给 v4/v4.1/v4.2 三份 spec 各补一行。

**验证过程**：读了 v6 spec 头部（第 4 行「唯一正本」+ 第 9 行「墙后的一盏灯」）与 v8 spec 头部（第 6 行同样自称唯一正本）；grep v6 全文无任何「已被 v8 取代」标记（只有它自己取代 v4.2 的声明）；grep globals.css 确认 .bp-wall-ambient/.bp-wall-lamp 零命中；CLAUDE.md §2 确写「禁止以任何形式复活」。两份互斥正本并存属实。注：v8 头部自己写明「取代 v6 的受光模型」，所以从 v8 侧读能发现关系，但从 v6 侧读零线索。

---

## 44. [MEDIUM / CONFIRMED] homepage-slim spec 的头号定案（首页只留 Hero + 信任带，删 FeaturedWork/Process/CTABanner）已被 IA v1 全盘推翻，文档零标记

- **维度**：僵尸代码与文档漂移　**位置**：`docs/superpowers/specs/2026-07-26-homepage-slim-ourwork-restructure-design.md:12`
- **原始评级**：severity=medium confidence=high　→　**验证后**：medium

**证据**

该 spec 第 12 行「用户拍板清单」#1：「主页删减范围 | **全删，只留 Hero + Trusted by 滑动条**（Capabilities / FeaturedWork / Process / CTABanner 四段移除）」，#4：「Capabilities / Process 内容去向 | **彻底删除**（About 页已有 Approach/流程叙事，不搬运）」，§1 明写「移除引用并删除文件：CapabilitiesSection.tsx、FeaturedWork.tsx、ProcessSection.tsx」。git 记录证实反转：`git log --diff-filter=AD -- src/components/home/FeaturedWork.tsx` → 3bd2404 删除（D），486229e「IA v1」又新增（A）。当前 `src/app/(public)/page.tsx` 第 77/80/82 行同时渲染 `<FeaturedWork />`、`<ProcessStrip />`、`<CTABanner>`。IA v1 spec 的 §0 诊断第 1 条正是「说服链断裂：首页 = Hero + 灰 logo 带即结束」。

**影响**

同一目录下两份 spec 对首页结构给出完全相反的结论，且被推翻的那份写着「David 拍板、逐条确认过」。agent 或人按它执行会把刚加回来的三段再删一遍，恰好复现 IA v1 要修的病灶。

**修复建议**

在该 spec 顶部加退役横幅指向 `2026-07-27-ia-hierarchy-redesign-design.md`，注明「§0 决策 #1/#4 与 §1 主页删减已被 IA v1 推翻（首页恢复说服链五段结构）；其余（地产打包 / Our Work 命名 / 聚合详情页）仍有效」。改动量：3 分钟。

**验证过程**：读了 homepage-slim spec 第 12/15/22 行，「全删只留 Hero + Trusted by」「彻底删除」「删除文件 FeaturedWork.tsx」原文属实且无任何退役标记；git log --follow FeaturedWork.tsx 证实 aeebfa7 建 → 3bd2404 删 → 486229e（IA v1）重建；当前 (public)/page.tsx 第 77/80/82 行确同时渲染 FeaturedWork/ProcessStrip/CTABanner。反转事实与文档零标记均成立。

---

## 45. [MEDIUM / CONFIRMED] AGENTS.md 与 CLAUDE.md/实际代码在 7 处直接冲突，两份指令文件都会进 agent context

- **维度**：僵尸代码与文档漂移　**位置**：`AGENTS.md:3`
- **原始评级**：severity=medium confidence=high　→　**验证后**：medium

**证据**

逐条核实：① 第 3 行称设计系统为「**Foundry** design system」，CLAUDE.md 全文叫 **Blueprint**；② 第 7 行「API Route ... 结合 **React Query** 使用」，package.json dependencies 只有 next/react/react-dom/resend，零 React Query；③ 第 12 行举例 `src/app/sign/[id]/page.tsx`，该路径不存在；④ 第 15 行「public/ 可放置 `.well-known/appspecific/com.chrome.devtools.json`」，public/ 下无此文件；⑤ 第 16/41 行说敏感配置在 `.env.local`，实际文件是 `.env`；⑥ 第 22 行「`npm run lint`：运行 Next.js ESLint 助手；首次选择 Strict 预设生成 `.eslintrc.json`」，package.json 里 `lint` = `biome check ./src`，仓库无 .eslintrc；⑦ 第 14/27 行「复用型**客户端**组件」「交互组件需**显式声明 use client**」，与 CLAUDE.md 反复强调的「双栖 Server Component、client 岛下沉到叶子」（Card / ModuleButton / CaseStudyCard 都刻意不带 'use client'）方向相反。

**影响**

两份文件都在仓库根、都会被 agent 读到，且 AGENTS.md 是 OpenAI/Codex 系约定的入口文件。冲突项里 ⑥⑦ 最危险：agent 可能去装 ESLint 生成 .eslintrc（与 biome 双跑打架），或者给 Card/ModuleButton 加 `'use client'`（把整棵 server 树推进 client bundle，直接破坏「双栖」架构与 hydration 预算）。

**修复建议**

把 AGENTS.md 砍成一个指针文件（5 行内）：`本仓所有约定见 CLAUDE.md，无第二份正本。` + 只保留 CLAUDE.md 未覆盖的 PR/提交规范；或逐条改正上述 7 点。前者更符合「单源」纪律。改动量：10 分钟。

**验证过程**：全文读了 AGENTS.md 并逐项核实：①第 3 行确写「Foundry design system」（CLAUDE.md 全文叫 Blueprint）；②package.json 零 React Query 依赖；③src/app/sign 不存在；④public/.well-known 不存在；⑤实际文件是 .env（.env.local 不存在）；⑥package.json lint=biome check，无 .eslintrc；⑦「交互组件需显式声明 use client」与 CLAUDE.md 的 Card/ModuleButton 双栖纪律相反。7 处冲突全部属实，⑥⑦ 的误导风险判断合理。

**⚠️ 验证修正**：微调：④的原文是「可放置」（许可式措辞而非事实断言），单独看不算冲突，但不影响整体结论——其余 6 处为硬冲突。

---

## 46. [MEDIUM / CONFIRMED] modDrift 的「周期互质」注释是事实错误（14/16/11/15/13/10 里 gcd(14,16)=2、gcd(15,10)=5），与 trace-pulse 同一类错误但没被修

- **维度**：僵尸代码与文档漂移　**位置**：`src/app/globals.css:1005`
- **原始评级**：severity=medium confidence=high　→　**验证后**：medium

**证据**

globals.css 第 1005 行：「周期/相位 per-module 错峰（**互质周期** + 交错 delay），任意时刻总有模块在动」；BlueprintObject.tsx 第 92 行同样写「漂移周期/相位错峰（**周期互质** + delay 交错）」。实际 driftDur 值（BlueprintObject.tsx 第 117/133/150/166/183/200 行桌面档）= 14s / 16s / 11s / 15s / 13s / 10s，移动档（253/269/285/302 行）= 12s / 10s / 13s / 15s。gcd(14,16)=2、gcd(14,10)=2、gcd(16,10)=2、gcd(15,10)=5、gcd(12,10)=2 —— 远非两两互质。这与 v3.1 spec 第 97 行已经抓出并修正的 trace-pulse 错误是同一类，但当时只修了 trace-pulse，modDrift 这两处漏网。

**影响**

注释在这里承担的是「不变量说明」的职责（谁改 driftDur 就得看它）。它给出的保证（互质 ⇒ 相位永不锁定 ⇒ 任意时刻总有模块在动）根本不成立：14/16 每 112s、15/10 每 30s 就回到同一相对相位。将来有人按这条注释增删模块或调周期，会以为不需要验算，实际可能造出「所有模块同时静止」的观感空窗。

**修复建议**

把两处注释改为与 trace-pulse 同口径的诚实措辞：「周期各异 + delay 交错（**非两两互质**，靠 delay 实算错峰；改任一 driftDur/driftDelay 需重算最坏同步窗）」。若想要真保证，另跑一次「任意 5s 窗口至少一模块在位移」的实算并把结论写进注释。改动量：注释 3 分钟，实算另计 20 分钟。

**验证过程**：读了 globals.css:1005（「互质周期 + 交错 delay」）与 BlueprintObject.tsx:92（「周期互质 + delay 交错」），两处注释原文属实；grep driftDur 确认桌面档 14/16/11/15/13/10、移动档 12/10/13/15——gcd(14,16)=2、gcd(15,10)=5、gcd(12,10)=2，「互质」断言数学上为假。与 trace-pulse 同类错误但当时只修了 trace-pulse（globals.css:1119 已改口径）确属漏网。

---

## 47. [LOW / PARTIAL] `request.json()` 在任何体积检查之前完整解析 body，长度上限形同虚设（对内存而言）

- **维度**：API 与安全　**位置**：`src/app/api/contact/route.ts:185`
- **原始评级**：severity=medium confidence=high　→　**验证后**：low

**证据**

route.ts:185-186 `const { … }: ContactFormData = await request.json();` 直接解析整个请求体，`FIELD_LIMITS`（route.ts:43）的字段长度检查在 route.ts:236 才执行——那已经是解析完之后。App Router 的 Route Handler **没有** Pages API 那种默认 `bodyParser.sizeLimit`，也没有 `Content-Length` 预检；请求里塞一个未声明的巨大字段（如 `{"email":"a@b.co","padding":"<4MB 字符串>"}`）会被完整读入内存后才被忽略。同时也没有校验 `Content-Type`：发送非 JSON body 会让 `request.json()` 抛异常，落到 route.ts:323 的兜底 catch，返回 **500 "Failed to send emails"** 而不是语义正确的 400。

**影响**

每个请求最多可让函数分配 ~4.5MB（Vercel 平台上限）堆内存；配合上一条失效的限流，是一条低成本的内存/CPU 消耗面。另外非 JSON 请求返回 500 会污染错误监控，也让客户端无法区分「你发错了」和「我们挂了」。

**修复建议**

在 `request.json()` 之前加两道前置：① `if (!request.headers.get('content-type')?.includes('application/json')) return 415;` ② 读 `Content-Length`，超过 ~32KB 直接 413（`const len = Number(request.headers.get('content-length') ?? 0); if (len > 32_768) return NextResponse.json({success:false,error:'Payload too large'},{status:413})`）；③ 把 `request.json()` 单独包一层 try/catch 返回 400 而非落到 500 兜底。约 12 行。

**验证过程**：事实核实全部属实：route.ts:185-186 直接 `await request.json()`，长度检查在 236 行（解析之后）；App Router Route Handler 确无 Pages Router 的 bodyParser.sizeLimit；全文件无 content-type 检查；非 JSON body 会让 request.json() 抛 SyntaxError，被 route.ts:323 外层 catch 吞成 500 "Failed to send emails"（我逐行确认 try 块起于 184，catch 在 323）。

**⚠️ 验证修正**：严重度从 medium 降为 low：Vercel 平台硬上限 4.5MB，单请求 4.5MB 堆分配 + 一次 JSON.parse 对 1GB 内存的函数不构成有意义的资源攻击面，且任何公开端点（含静态资源）都存在同等带宽面，边际风险很小。真正有价值的部分是「非 JSON / 畸形 body 返回 500 而非 400/415」这一错误语义污染（与 #6 同源），建议按此重写标题与优先级。

---

## 48. [LOW / PARTIAL] CSP 的 script-src 含 'unsafe-inline'，XSS 防护档位实际接近于零

- **维度**：API 与安全　**位置**：`src/proxy.ts:10`
- **原始评级**：severity=medium confidence=high　→　**验证后**：low

**证据**

proxy.ts:10 `"script-src 'self' 'unsafe-inline'"`。文件头注释（proxy.ts:4-7）解释了原因：SSG 无法注入 per-request nonce，且 layout.tsx:85-89 有一段内联的微信 WebView 修复脚本。同一策略里 `style-src` 也是 unsafe-inline（这条无可避免，全站大量 `style={{}}`，且 style 的 XSS 面远小于 script）。

**影响**

`'unsafe-inline'` 使 script-src 退化为「同源脚本 + 任意内联脚本」，也就是说一旦出现任何 HTML 注入点，CSP 不会提供第二道防线。当前代码里没有把用户输入渲染进 HTML 的路径（JsonLd 的数据全是静态常量，contact API 走 escapeHtml），所以这是纵深防御缺口而非可利用漏洞。

**修复建议**

把 layout.tsx 的微信修复脚本从内联改为 `public/wechat-fix.js` 的外部 `<script src="/wechat-fix.js" defer>`，然后 script-src 收紧为 `'self'` —— SSG 场景下这是唯一能干净去掉 unsafe-inline 的做法（nonce 确实不可行）。注意 JsonLd 的 `<script type="application/ld+json">` 不受 script-src 约束（非可执行脚本类型），不构成障碍。约 15 行（挪脚本 + 改一行 CSP）。若暂不动，至少加 `report-uri`/`report-to` 收集违规。

**验证过程**：proxy.ts:10 确为 "script-src 'self' 'unsafe-inline'"，proxy.ts:4-7 注释确以 SSG 无 nonce + 内联脚本为由；layout.tsx:85-89 确有内联微信 WebView MutationObserver 修复脚本（dangerouslySetInnerHTML）。JsonLd 的 4 个消费点数据全为静态常量，contact API 全程 escapeHtml——当前确无用户输入进 HTML 的可执行注入点。

**⚠️ 验证修正**：严重度 medium→low：发现自身已承认「纵深防御缺口而非可利用漏洞」，本站零注入 sink，标 medium 会挤占真实问题的优先级。另修正建议里的一个未经核实的断言：「JSON-LD 的 <script type="application/ld+json"> 不受 script-src 约束」在浏览器间并非无争议（Google 与 Next.js 官方文档在 strict CSP 场景都要求给 ld+json 加 nonce），若真去掉 unsafe-inline，必须先在真机验证 JSON-LD 是否被拦，不能按此断言直接改。

---

## 49. [LOW / PARTIAL] JsonLd 用裸 JSON.stringify 注入 <script>，未转义 `</script>` 与 `<!--`（当前数据静态，属潜伏隐患）

- **维度**：API 与安全　**位置**：`src/components/shared/JsonLd.tsx:12`
- **原始评级**：severity=low confidence=high　→　**验证后**：low

**证据**

JsonLd.tsx:12 `dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}`。`JSON.stringify` 不会转义 `<`，所以数据里若出现 `</script>` 字面量就能提前闭合 script 标签。当前三个消费点（page.tsx:62 组织信息、contact/page.tsx:86 FAQ、products/[slug]/page.tsx:76 案例）的数据全部来自 `src/data/*.ts` 与 `faqData.ts` 的开发者手写常量，我 grep 过没有任何 `</` 或 `<script`，所以**现在不可利用**；`products/[slug]` 的 `slug` 虽来自 URL，但 `getCaseStudyBySlug` 未命中即 `notFound()`（page.tsx:55），到达 JsonLd 时 slug 必然是白名单值。

**影响**

零日现风险。但任何一次「把 FAQ/案例文案挪到 CMS 或允许 Markdown」的改动，都会让这里从安全直接翻成存储型 XSS，且不会有任何警告。

**修复建议**

一行修复：`JSON.stringify(data).replace(/</g, '\\u003c')` —— `<` 在 JSON 里等价于 `<`，解析结果不变，但无法闭合标签。同时可加 `.replace(/ /g,'\\u2028').replace(/ /g,'\\u2029')`。

**验证过程**：JsonLd.tsx:12 `dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}` 属实，JSON.stringify 不转义 `<` 属实。grep 核实所有消费点数据来源：page.tsx:62(organizationJsonLd 静态字面量)、contact/page.tsx:86(LocalBusiness + FAQPage，faqs 为同文件内静态数组)、products/[slug]/page.tsx:76(取自 case-studies.ts，slug 未命中即 notFound()，第 55 行确认)。`grep '</\|<script' src/data/` 零命中，确认当前不可利用。

**⚠️ 验证修正**：两处事实需更正：① 消费点是 4 个不是 3 个——漏了 src/components/layout/Breadcrumb.tsx:38（同样注入 JSON-LD，数据来自 items props，当前调用方全传静态 label，结论不变但审查范围应含它）；② 证据里的 `faqData.ts` 文件不存在，FAQ 数组是内联定义在 src/app/(public)/contact/page.tsx 中（src/data/ 下只有 case-studies.ts / navigation.ts / process.ts / real-estate.ts）。一行 `.replace(/</g,'\\u003c')` 的修复建议本身正确。

---

## 50. [LOW / CONFIRMED] 安全响应头缺 COOP/CORP，Permissions-Policy 覆盖面偏窄，img-src 放开了整个 https:

- **维度**：API 与安全　**位置**：`src/proxy.ts:12`
- **原始评级**：severity=low confidence=high　→　**验证后**：low

**证据**

proxy.ts:23-39 设置了 X-Content-Type-Options / X-Frame-Options / Referrer-Policy / CSP / Permissions-Policy / HSTS（含 preload，且正确地只在 production 下发）——基线是扎实的。缺口三处：① 无 `Cross-Origin-Opener-Policy: same-origin` 与 `Cross-Origin-Resource-Policy: same-origin`；② `Permissions-Policy` 只列了 `camera/microphone/geolocation/browsing-topics`（proxy.ts:31），未关 `payment=()`、`usb=()`、`serial=()`、`interest-cohort=()`；③ `img-src 'self' data: https:`（proxy.ts:12）允许从任意 https 主机加载图片。

**影响**

① 缺 COOP 意味着被 window.open 打开时与 opener 共享 browsing context group（XS-Leaks 面）；③ 若未来出现任何 HTML 注入点，攻击者可用 `<img src="https://evil/?data=…">` 做数据外传（CSP 拦不住）。都属纵深防御，非当前可利用问题。

**修复建议**

proxy.ts:23-32 里补三行：`response.headers.set('Cross-Origin-Opener-Policy','same-origin')`、`set('Cross-Origin-Resource-Policy','same-origin')`、把 Permissions-Policy 值扩为 `camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), browsing-topics=(), interest-cohort=()`。`img-src` 若站内所有图片都自托管（看起来是），收紧为 `'self' data:` 即可；若用到外部 OG 图再按需放行具体域名。约 4 行。

**验证过程**：proxy.ts:24-32 确实只设 X-Content-Type-Options / X-Frame-Options / Referrer-Policy / CSP / Permissions-Policy，34-39 的 HSTS 确实正确地门控在 NODE_ENV==='production'；确无 COOP/CORP；Permissions-Policy 值（第 31 行）确为 'camera=(), microphone=(), geolocation=(), browsing-topics=()'；img-src（第 12 行）确为 "'self' data: https:"。均属纵深防御，low 恰当。补充：`interest-cohort=()` 这一条建议已过时（FLoC 已下线，Chrome 不再识别该 feature，且本站已设更现代的 browsing-topics=()），照抄会加一条无效指令，其余 payment/usb/serial 与 COOP/CORP 建议成立。

---

## 51. [LOW / CONFIRMED] CSRF 来源白名单不含 *.vercel.app，预览部署上的联系表单必然 403

- **维度**：API 与安全　**位置**：`src/lib/csrf.ts:8`
- **原始评级**：severity=low confidence=medium　→　**验证后**：low

**证据**

csrf.ts:8 `const ALLOWED_ORIGINS = [SITE_URL, 'https://synthmind.ca'];`，dev 下额外加 localhost（csrf.ts:11-14）。Vercel preview 部署的 NODE_ENV 是 `production`，Origin 形如 `https://synthmind-git-xxx-david.vercel.app` → 走 csrf.ts:26 的 `includes` 判定失败 → 403 `Forbidden: invalid origin.`。

**影响**

任何在预览环境验证联系表单的尝试都会拿到 403，容易被误判为「表单坏了」而去改无辜代码；也让上线前无法端到端验证发信链路。安全上无害（保守失败方向正确）。

**修复建议**

在 csrf.ts:8 之后加一条基于环境变量的放行：`if (process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_URL) ALLOWED_ORIGINS.push('https://' + process.env.VERCEL_URL);`（VERCEL_URL 由平台注入、不可被请求方伪造，安全）。约 3 行。

**验证过程**：csrf.ts:8 `const ALLOWED_ORIGINS = [SITE_URL, 'https://synthmind.ca']`，constants.ts:5 SITE_URL='https://www.synthmind.ca'；csrf.ts:11-14 的 localhost 放行仅在 NODE_ENV==='development'，而 Vercel preview 构建的 NODE_ENV 恒为 production → *.vercel.app 的 Origin 在 csrf.ts:26 判定失败返回 403。安全方向保守正确，仅影响预览环境端到端验证。建议里用 VERCEL_ENV/VERCEL_URL（平台注入、请求方不可伪造）放行的做法成立。

---

## 52. [LOW / CONFIRMED] 338 行的 route 文件里内联了两份高度重复的邮件 HTML 模板（约占 100 行）

- **维度**：API 与安全　**位置**：`src/app/api/contact/route.ts:83`
- **原始评级**：severity=low confidence=high　→　**验证后**：low

**证据**

route.ts:83-108（客户回执）与 route.ts:129-161（管理员通知）是两段独立的模板字符串，共享同一段品牌头（`background: linear-gradient(135deg, ${BRAND_ACCENT}, ${BRAND_ACCENT_DARK}); padding: 30px; text-align: center; color: white;` 在 route.ts:86 和 route.ts:131 逐字重复）、同一套 `#f8f9ff` + `border-left: 4px solid ${BRAND_ACCENT}` 的信息块样式（route.ts:96 / 137）。业务逻辑（校验 + 限流 + 发信编排）被挤在 165-338 行里，模板与逻辑混排。

**影响**

改品牌样式要在两处同步（正是 CLAUDE.md 反复强调的双源漂移病灶）；也让这个文件的安全审查变难——`escapeHtml` 的调用点散落在模板字面量中间，漏掉一个不容易发现（route.ts:140/142/154 就有三处独立调用）。

**修复建议**

抽 `src/lib/email-templates.ts`，导出 `renderCustomerReply({name,subject,message})` 与 `renderAdminNotification({name,email,subject,message,source})`，把共享的头部/信息块提成 `brandHeader()` / `infoBlock()` 小函数，`escapeHtml` 也迁进去（或迁到 `src/lib/html.ts` 便于复用）。route.ts 随之缩到 ~180 行，职责回归「校验 + 编排」。约 1 小时，纯搬运无行为变更，建议配 tsc 校验。

**验证过程**：`wc -l` 确认 route.ts 338 行；83-108 与 129-161 两段模板字符串属实；route.ts:86 与 131 的品牌头样式串逐字相同（`background: linear-gradient(135deg, ${BRAND_ACCENT}, ${BRAND_ACCENT_DARK}); padding: 30px; text-align: center; color: white;`）；escapeHtml 确有 140/142/154 三处散落调用点。与 CLAUDE.md 不冲突——CLAUDE.md 只豁免邮件模板可内联 hex（且要求 hex 从 constants.ts 取，代码已遵守），未对模板放在何处作定案。纯维护性问题，low 恰当。

---

## 53. [LOW / CONFIRMED] 模块作用域的 setInterval 清理器在 serverless 上几乎不会触发，在 dev HMR 下会逐次累积

- **维度**：API 与安全　**位置**：`src/app/api/contact/route.ts:33`
- **原始评级**：severity=low confidence=medium　→　**验证后**：low

**证据**

route.ts:33-40 在模块顶层无条件注册 `setInterval(…, 5 * 60_000).unref()`。route.ts:32 的注释自己说明「serverless 环境每次冷启动 map 会重置，此定时器仅对长运行进程有效」——而 Vercel lambda 通常几分钟内就被回收，5 分钟周期的清理器大概率一次都跑不到。反过来在本地 `next dev`（Turbopack HMR）下，每次热重载重新求值该模块就会多注册一个 interval。

**影响**

生产上是无用代码（`rateLimitMap` 的过期项其实已经在 `isRateLimited` 的 filter 里被逐 key 清理了，route.ts:24——这个定时器本身就是冗余的）；dev 下泄漏的是 unref 过的空转定时器，影响可忽略。属于代码卫生问题。

**修复建议**

直接删掉 route.ts:31-40 这个定时器——`isRateLimited` 的惰性 filter 已经保证了每个被访问 key 的时间戳不会增长，唯一残留是「访问过一次后再不访问」的 key（每个仅几十字节，且实例本身活不久）。若坚持要有上限，改成在 `isRateLimited` 里加一行 `if (rateLimitMap.size > 10_000) rateLimitMap.clear();` 更符合 serverless 语义。约 -10 行。

**验证过程**：route.ts:33-40 模块顶层无条件 setInterval(...,5*60_000).unref() 属实，route.ts:32 注释确实自述「仅对长运行进程有效」。核实 `.unref()` 可用性：grep 全仓无 `export const runtime = 'edge'`，路由跑 Node runtime，Timeout.unref() 存在，不会抛错。route.ts:24 的惰性 filter 确实已对每个被访问 key 做清理，定时器只多清理「访问一次后再不访问」的 key，在几分钟即回收的 lambda 上基本无收益。代码卫生级，low 恰当。

---

## 54. [LOW / CONFIRMED] 429 响应不带 Retry-After 头，且 x-real-ip 缺失时所有请求共用 'unknown' 单桶

- **维度**：API 与安全　**位置**：`src/app/api/contact/route.ts:175`
- **原始评级**：severity=low confidence=high　→　**验证后**：low

**证据**

route.ts:177-182 返回 429 时只有 JSON body，没有 `Retry-After` 响应头。route.ts:175 `const clientIp = request.headers.get('x-real-ip')?.trim() || 'unknown';` —— 拿不到 `x-real-ip` 时所有此类请求落进同一个 `'unknown'` 桶，三次之后全部 429。

**影响**

① 无 Retry-After 让合规的客户端/爬虫无法得知等多久，也不利于前端做倒计时提示；② `'unknown'` 单桶在 Vercel 上基本不会触发（平台恒设 x-real-ip），但若将来自托管或经过某些代理，会把所有用户挤进一个 3 次/分钟的共享配额，表现为「表单随机 429」。route.ts:171-173 拒绝回落 x-forwarded-for 的判断是**正确的**（可伪造），这点不用改。

**修复建议**

① 429 分支加 `{ status: 429, headers: { 'Retry-After': '60' } }`；② 把 `'unknown'` 分支改为「无法识别来源时直接 400/403 拒绝」或「给 unknown 一个显著更宽松的独立阈值」，避免共享桶误伤。约 4 行。

**验证过程**：route.ts:177-182 的 429 分支确实只有 JSON body、无 headers 参数；route.ts:175 `request.headers.get('x-real-ip')?.trim() || 'unknown'` 确实让缺头请求共用单桶。route.ts:171-173 注释拒绝回退 x-forwarded-for 的理由（可伪造 → 轮换即绕过）确实是对的，不应改动。Vercel 恒设 x-real-ip，'unknown' 桶在当前托管下基本不触发，属未来自托管/换代理时的隐患，low 恰当。

---

## 55. [LOW / CONFIRMED] Resend 错误对象被整体 JSON.stringify / console.error，可能把提交者邮箱写回日志（与既往「移除 PII 日志」的意图冲突）

- **维度**：API 与安全　**位置**：`src/app/api/contact/route.ts:271`
- **原始评级**：severity=low confidence=medium　→　**验证后**：low

**证据**

route.ts:271 `notificationError = JSON.stringify(notificationEmail.error);` 与 route.ts:272 / 291 的 `console.error('… API error:', …error)`。Resend 在 `to`/`replyTo` 非法时返回的 error 对象常带上出错的地址字符串（例如 `"Invalid \`to\` field: [\"user@example.com\"]"`）。提交历史 36c8383 明确写着「Remove PII from contact API console logs」，说明这是有意识规避过的问题，但这条路径把它带了回来。

**影响**

用户邮箱可能出现在 Vercel 运行日志中（日志留存期内可被任何有项目访问权的人查看）。属隐私卫生问题，不是漏洞。severity 低；标 medium 置信度是因为我没有实测 Resend 各错误码的确切 payload 形状。

**修复建议**

日志只取结构化的安全字段：`console.error('Notification email failed', { name: err?.name, statusCode: err?.statusCode })`，不要整体 stringify。`notificationError`（只在 dev 回传给前端，route.ts:306-309，这点是对的）同样收窄为 `err?.message`。约 4 行。

**验证过程**：route.ts:271 `notificationError = JSON.stringify(notificationEmail.error)`、272/291 `console.error(..., error)` 属实；route.ts:306-309 确实只在 NODE_ENV==='development' 才把 details 回传前端（这点是对的）。核实历史意图：`git log -1 --format=%B 36c8383` 原文含 "Remove PII from contact API console logs"——原发现引用属实，这条路径确实把 PII 带回了日志。Resend 错误 payload 的确切形状我同样未实测，保留其 medium 置信度的谨慎表述是恰当的。

---

## 56. [LOW / PARTIAL] 函数超时只在 vercel.json 里按源码路径配置，未用 App Router 的 route segment config 兜底

- **维度**：API 与安全　**位置**：`vercel.json:7`
- **原始评级**：severity=low confidence=low　→　**验证后**：low

**证据**

vercel.json 里 `"functions": { "src/app/api/contact/route.ts": { "maxDuration": 10 } }`。App Router 的官方推荐做法是在 route 文件里 `export const maxDuration = 10`；route.ts 里没有这个导出。若 Vercel 的路径匹配因目录结构变化（如未来去掉 src/ 前缀）而失配，配置会**静默失效**回落到平台默认超时，不会报错。

**影响**

最坏情况是 Resend 挂起时函数跑满默认超时（Hobby 10s / Pro 60s+），多烧执行时长。前端 ContactForm.tsx:46 已有 10 秒 AbortController，用户侧体验不受影响——但客户端 abort 不会终止服务端函数。风险很低，我也没有实测该 glob 在当前 Vercel 版本下是否匹配，故标 low confidence。

**修复建议**

在 route.ts 顶部加一行 `export const maxDuration = 10;`（route segment config 优先级明确、与代码同源、重构不会失配），vercel.json 里那条可保留也可删。1 行。

**验证过程**：事实核对属实：vercel.json:6-9 确有 functions 配置指向 src/app/api/contact/route.ts；`grep -rn 'maxDuration' src/` 零命中，route.ts 确无 route segment config 导出；ContactForm.tsx:46 确有 10 秒 AbortController（客户端 abort 不终止服务端函数的说法正确）。

**⚠️ 验证修正**：应明确标注为「加固建议」而非缺陷：vercel.json 的 functions 属性以源文件路径匹配 Next.js App Router route 是 Vercel 官方支持的用法，当前配置没有证据表明失效——发现描述的「静默失配」是纯假设场景（且假设前提是未来改目录结构）。建议保留（`export const maxDuration = 10` 与代码同源、重构不失配，一行成本），但不应算作现存问题。

---

## 57. [LOW / CONFIRMED] 表单错误提示未与输入框建立 aria 关联，且无字段级 aria-invalid

- **维度**：API 与安全　**位置**：`src/components/shared/ContactForm.tsx:199`
- **原始评级**：severity=low confidence=high　→　**验证后**：low

**证据**

ContactForm.tsx:198-204 的错误文案是提交按钮下方一个独立的 `<span role="alert">`，四个输入框（ContactForm.tsx:125/141/160/177）都没有 `aria-invalid` 或 `aria-describedby` 指向它。整体 a11y 底子是好的：label 全部经 `htmlFor`/`id` 正确关联、成功态用 `role="status" aria-live="polite"` + `tabIndex={-1}` 主动移焦（ContactForm.tsx:30-32、79-86）、提交按钮有 `aria-busy`（ContactForm.tsx:194）——这几处比多数项目做得好。

**影响**

屏幕阅读器用户能听到错误播报（role=alert 生效），但无法从任一字段跳到错误说明，也无法感知「哪个字段有问题」。因为当前错误只有整表级别（超时/通用失败），影响有限；一旦按前面的建议回显服务端的字段级错误（如 email 格式、message 超长），这个缺口就会变成真实障碍。

**修复建议**

错误 span 加 `id="contact-form-error"`，各输入框加 `aria-describedby={errMsg ? 'contact-form-error' : undefined}`；若将来做字段级校验，再补 `aria-invalid`。约 6 行。

**验证过程**：ContactForm.tsx:198-204 错误 span 确为提交按钮下方独立 `role="alert"` 节点、无 id；四个输入框（125/141/160/177）确无 aria-invalid / aria-describedby。发现对现有 a11y 优点的描述也属实：label 均经 htmlFor+id 关联、成功态 30-32 与 79-86 确有 role="status" aria-live="polite" + tabIndex={-1} 主动移焦、194 行有 aria-busy。当前错误仅整表级，影响有限，low 恰当。

---

## 58. [LOW / CONFIRMED] 每封邮件都新建一个 Resend 客户端实例

- **维度**：API 与安全　**位置**：`src/app/api/contact/route.ts:11`
- **原始评级**：severity=low confidence=high　→　**验证后**：low

**证据**

route.ts:11-13 `function getResendClient() { return new Resend(process.env.RESEND_API_KEY); }`，在 route.ts:78 和 route.ts:124 各调用一次 —— 单次请求构造两个客户端。注释说是为了避免构建期缺少环境变量报错，这个动机成立，但用惰性单例同样能满足。

**影响**

可忽略的开销（Resend 客户端本身很轻）。纯代码整洁问题。

**修复建议**

改惰性单例：`let _resend: Resend | null = null; const getResendClient = () => (_resend ??= new Resend(process.env.RESEND_API_KEY));`。仍然是惰性的，构建期不会求值。约 3 行。

**验证过程**：route.ts:11-13 getResendClient 每次 `return new Resend(...)`，route.ts:78 与 124 各调用一次，单请求确实构造两个实例。注释所述「避免构建时因缺少环境变量报错」的动机成立，惰性单例（`_resend ??= new Resend(...)`）同样满足该动机。纯整洁度，无性能或安全影响。

---

## 59. [LOW / CONFIRMED] tsconfig target 仍是 es5 / lib 只到 es6

- **维度**：架构与 Next 16 用法　**位置**：`tsconfig.json:3`
- **原始评级**：severity=medium confidence=high　→　**验证后**：low

**证据**

tsconfig.json:3 target es5，lib ['dom','dom.iterable','es6']，同时 module esnext + moduleResolution bundler（现代设置）。项目记忆里已有「tsconfig target es5（Map/Set 用 .forEach()）」这条绕行约定，api/contact/route.ts:35 的 rateLimitMap.forEach 就是被它逼出来的。

**影响**

Next 的 SWC 按 browserslist 转译，tsconfig target 根本不影响产物——它只在类型层制造麻烦：禁掉 for...of over Map/Set、挡住 es2019+ 的 lib 类型，逼开发者写绕行代码并把绕行写进项目记忆。这是 CRA 时代的遗留默认值。

**修复建议**

改成 target: 'ES2022'、lib: ['dom','dom.iterable','ES2022']，跑一次 tsc --noEmit 确认（当前 tsc 已 exit 0，升 target 只会放宽）。随后可把 forEach 绕行改回 for...of。1 行配置 + 可选清理。

**验证过程**：读 tsconfig.json 确认 target es5 / lib ['dom','dom.iterable','es6'] + module esnext + moduleResolution bundler；grep 确认 src/app/api/contact/route.ts:35 的 rateLimitMap.forEach 绕行实存；npx tsc --noEmit exit 0。「SWC 按 browserslist 转译、tsconfig target 不影响产物」符合 Next.js 实际行为。项目记忆里确有该绕行约定条目。

**⚠️ 验证修正**：问题属实但零运行时/用户影响，纯开发体验与类型层约束（且已有 memory 条目固化绕行写法在扩散），severity 从 medium 调 low。

---

## 60. [LOW / CONFIRMED] contact 页标题层级跳级且乱序：h1 → h3 → h3 → h3 → h2

- **维度**：架构与 Next 16 用法　**位置**：`src/app/(public)/contact/page.tsx:141`
- **原始评级**：severity=medium confidence=high　→　**验证后**：low

**证据**

page.tsx:95 是 h1 'Let's Talk'；右栏 WHAT HAPPENS NEXT 用的是 SheetLabel（span，不是标题），其下 :141 直接是 h3；FAQ 的 SectionTitle（h2）在 :181 才出现。ContactForm 成功态 :103 也是一个孤立 h3。

**影响**

axe 的 heading-order 规则会报错；屏幕阅读器按标题导航时，三条 next steps 挂在不存在的 h2 下，之后才冒出一个 h2——文档大纲读不出「表单区 / FAQ 区」两章结构。全站其他页面标题层级都是干净的，只有这一页破。

**修复建议**

把 WHAT HAPPENS NEXT 那行改成 <h2 className='sr-only'>What happens next</h2> + 现有 SheetLabel 视觉件（或直接让 SheetLabel 接受 as='h2'），并给表单卡也补一个 sr-only h2。约 6 行。

**验证过程**：读 contact/page.tsx：h1 在 :95，WHAT HAPPENS NEXT 是 SheetLabel(span) :128，步骤 h3 在 :141，FAQ SectionTitle 在 :181；grep SectionTitle.tsx:58 确认渲染 h2；ContactForm.tsx:103 确认成功态孤立 h3。文档顺序 h1→h3×3→h2 属实。

**⚠️ 验证修正**：描述属实，但标题跳级是 WCAG 最佳实践问题（axe moderate）而非 A/AA 级失败，且只影响单页的读屏导航，severity 从 medium 调 low。

---

## 61. [LOW / CONFIRMED] components 目录分层名不副实：products/ 下的组件被 home 消费，单页组件一半 colocate 一半塞 shared/

- **维度**：架构与 Next 16 用法　**位置**：`src/components/products/InDevelopmentShowcase.tsx:1`
- **原始评级**：severity=low confidence=high　→　**验证后**：low

**证据**

InDevelopmentShowcase 与 CaseStudyCard 在 components/products/ 下，却被 app/(public)/page.tsx 与 components/home/FeaturedWork.tsx 消费；ContactForm 只被 contact 页用一次却放在 shared/，而同为单页组件的 FAQAccordion 却 colocate 在 app/(public)/contact/；faqData.ts 在 app 路由目录，process.ts / case-studies.ts 在 src/data/。

**影响**

目录名不再是可信的作用域信号：读到 components/products/ 会误以为只有 /products 用，改动时漏查首页；新人加组件时没有一致的先例可循（该 colocate 还是该进 shared/ 全凭手感）。

**修复建议**

两条规则二选一并贯彻：① 跨页复用的一律进 shared/（InDevelopmentShowcase、CaseStudyCard 上移），单页专属一律 colocate 到路由目录（ContactForm 下沉到 app/(public)/contact/）；② 或干脆按 marketing/ 单一域组织。顺带把 faqData.ts 移入 src/data/ 与 process.ts 同源。纯移动 + 改 import，约 20 分钟。

**验证过程**：grep 逐一核实：app/(public)/page.tsx 直接 import '@/components/products/InDevelopmentShowcase'；FeaturedWork.tsx:8 import '@/components/products/CaseStudyCard'；ContactForm 在 shared/ 但唯一消费方是 contact/page.tsx:12；FAQAccordion 与 faqData.ts colocate 在 app/(public)/contact/，而 process.ts/case-studies.ts 在 src/data/。CLAUDE.md 的「01 段与 /products 消费同一个 InDevelopmentShowcase」只定案了组件复用不复制 JSX，没定案它的目录归属——按 CLAUDE.md 自己的规则（跨页复用进 shared/）它反而放错了地方。

---

## 62. [LOW / CONFIRMED] shared/ 里混着别的组件的私有实现件，没有可见的「勿直接用」信号

- **维度**：架构与 Next 16 用法　**位置**：`src/components/shared/CardTilt.tsx:1`
- **原始评级**：severity=low confidence=high　→　**验证后**：low

**证据**

实测消费方计数：CardTilt 只被 Card 引用、ButtonTilt 只被 ModuleButton 引用、CropMarks 只被 Card 引用、WallBricks 只被 BlueprintWall 引用、TextReveal 只被 CTABanner 引用。它们与 Card/ModuleButton/SectionTitle 这些公共 API 平铺在同一层。

**影响**

CLAUDE.md 已明令 .card-glass*/.btn-* CSS 类是组件私有引擎不得直写，但 TSX 侧没有对应的结构隔离——业务代码 import CardTilt 自己包一层是完全合法的写法，会绕过 Card 的变体纪律且没人拦得住。

**修复建议**

新建 src/components/shared/internal/ 放这 5 个，或改成 Card.tilt.tsx 这类命名前缀，再在 biome 里加一条 import 路径限制。约 15 分钟。

**验证过程**：对 CardTilt/ButtonTilt/CropMarks/WallBricks/TextReveal 逐个 grep import 来源：消费方分别只有 Card.tsx / ModuleButton.tsx / Card.tsx / BlueprintWall.tsx / CTABanner.tsx——五条单一消费方断言全部属实，且都与公共 API 平铺在 shared/ 同层，无命名或目录隔离。CLAUDE.md 只在 CSS 类层面声明私有引擎纪律，TSX 侧确无结构约束。

---

## 63. [LOW / CONFIRMED] [slug] 用了 generateStaticParams 但没关 dynamicParams，未知 slug 走按需渲染

- **维度**：架构与 Next 16 用法　**位置**：`src/app/(public)/products/[slug]/page.tsx:25`
- **原始评级**：severity=low confidence=medium　→　**验证后**：low

**证据**

page.tsx:25 有 generateStaticParams，全文件无 export const dynamicParams = false。build 输出 ● /products/[slug] 预渲染 5 条。实测请求 /products/does-not-exist 返回 404（首次触发一次渲染后进 ISR 缓存，响应头 x-nextjs-cache: HIT）。

**影响**

任意猜测 URL 都会触发一次函数调用并在 ISR store 里占一条缓存项；爬虫/扫描器批量打随机 slug 时会放大成大量无用调用与缓存条目。加上没有 not-found.tsx，这些请求返回的还是无品牌的默认 404。

**修复建议**

在 [slug]/page.tsx 加 export const dynamicParams = false;（1 行）——未收录 slug 直接由平台返回静态 404，同时 page 里的 notFound() 退化为纯保险丝。

**验证过程**：读 [slug]/page.tsx 全文：generateStaticParams 在 :25，grep 全 src 无 dynamicParams；检查 .next/prerender-manifest.json 的 dynamicRoutes：/products/[slug] fallback:null（= blocking，未知 slug 走按需渲染），5 条已预渲染。与发现描述一致。

---

## 64. [LOW / CONFIRMED] AnimateOnScroll 每实例一个 IntersectionObserver，且 useIntersectionVisible 命中后不 disconnect

- **维度**：架构与 Next 16 用法　**位置**：`src/hooks/useIntersectionVisible.ts:19`
- **原始评级**：severity=low confidence=high　→　**验证后**：low

**证据**

AnimateOnScroll 被 18 个文件消费，about 页单页约 15 个实例，每个 useDeferredReveal 各建一个 observer（它命中后有 observer.disconnect()）。而 useIntersectionVisible.ts:19-27 只 setIsVisible(true)，没有 disconnect，观察器活到组件卸载。

**影响**

单页十几个观察器是可接受的开销，但 useIntersectionVisible 的持续观察是纯浪费——StatCard 的 count-up 是一次性的，之后每次滚动进出视口仍在回调。属于长期低成本泄漏而非可见故障。

**修复建议**

useIntersectionVisible 里对齐 useDeferredReveal：if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); }。1 行。共享单例观察器可作为后续优化，当前规模不急。

**验证过程**：读 useIntersectionVisible.ts:19-27：回调只 setIsVisible(true) 无 disconnect（仅卸载时清理）；grep 确认 useDeferredReveal.ts:37 命中后有 observer.disconnect() 形成对照；useIntersectionVisible 唯一消费方是 StatCard（count-up 一次性场景，持续观察确属浪费）；AnimateOnScroll 消费文件 19 个（发现称 18，误差 1，不影响结论）。

---

## 65. [LOW / PARTIAL] SiteHeader 每个 scroll 事件都调一次 setState，监听未标 passive

- **维度**：架构与 Next 16 用法　**位置**：`src/components/layout/SiteHeader.tsx:18`
- **原始评级**：severity=low confidence=high　→　**验证后**：low

**证据**

SiteHeader.tsx:17-21：const handleScroll = () => setScrolled(window.scrollY > 50); window.addEventListener('scroll', handleScroll)（无 { passive: true }，无节流/rAF）。

**影响**

滚动期间每帧都进 React 调度（值未变时 React 会 bail out，但仍走一遍 setState 路径）。对一个只需要布尔翻转的粘顶头部来说，这是唯一常驻的滚动主线程负担。

**修复建议**

两条都很短：① 加 { passive: true } 并在 handler 里先比对当前值再 setState；② 更彻底——用 IntersectionObserver 观察一个 hero 顶部的哨兵元素，或纯 CSS 的 scroll-driven animation-timeline: scroll() 切换头部底边，零 JS。

**验证过程**：读 SiteHeader.tsx:17-21：确实每个 scroll 事件调 setScrolled(window.scrollY > 50)，无节流、无先比对；addEventListener 确实没传 { passive: true }。但 scroll 事件本身不可取消（non-cancelable），浏览器对 scroll 监听器不存在等待 preventDefault 的滚动阻塞——passive 标记对 'scroll' 事件基本是空操作，这半条不构成问题；且 React 18+ 对同值 setState 会 bail out，实际开销很小。

**⚠️ 验证修正**：「未标 passive」对 scroll 事件无实际意义（scroll 不可取消，passive 只对 touchstart/wheel 等可取消事件有优化价值），应从问题描述中剔除；剩余的 setState-per-event 属微小的整洁度问题，React 同值 bailout 下主线程负担可忽略。

---

## 66. [LOW / CONFIRMED] sitemap 的静态页清单手工维护，且所有 lastModified 都是构建时刻

- **维度**：架构与 Next 16 用法　**位置**：`src/app/sitemap.ts:9`
- **原始评级**：severity=low confidence=high　→　**验证后**：low

**证据**

sitemap.ts:9 const now = new Date()，:12-49 六条静态页硬编码数组（新增 /products/brokerage-platform 时就得手动补一条），全部条目 lastModified: now。public/robots.txt 又把 sitemap URL 硬编码成 https://www.synthmind.ca/sitemap.xml，与 SITE_URL 常量双源。

**影响**

① 新增静态路由容易漏进 sitemap（无任何检查）；② 每次部署所有 URL 的 lastmod 一起跳到构建时间，等于告诉搜索引擎「整站每次都全变了」，lastmod 信号失去价值，可能降低抓取效率；③ robots.txt 与 SITE_URL 漂移风险。

**修复建议**

lastModified 改成按内容维护的日期（在 case-studies.ts / 静态页表里各存一个 updatedAt），或对静态页干脆省略 lastModified；robots.txt 换成 src/app/robots.ts 消费 SITE_URL。约 30 行。

**验证过程**：读 src/app/sitemap.ts 全文：line 9 const now = new Date()，静态页 6 条硬编码数组（含手工加的 /products/brokerage-platform），全部条目 lastModified: now；cat public/robots.txt 确认 Sitemap URL 硬编码 https://www.synthmind.ca/sitemap.xml，与 src/lib/constants.ts 的 SITE_URL 双源。

---

## 67. [LOW / CONFIRMED] CSRF 白名单只含生产域，Vercel preview 部署上联系表单必然 403

- **维度**：架构与 Next 16 用法　**位置**：`src/lib/csrf.ts:8`
- **原始评级**：severity=low confidence=high　→　**验证后**：low

**证据**

csrf.ts:8 ALLOWED_ORIGINS = [SITE_URL, 'https://synthmind.ca']，:11-14 只在 NODE_ENV==='development' 追加 localhost。preview 部署的 NODE_ENV 是 production，Origin 是 *.vercel.app，走到 :26 的 includes 判断即 403。

**影响**

任何 preview 部署上都无法端到端验证联系表单——而表单是全站唯一的转化入口，正好是最需要上线前验证的一条链路。发现方式只能是手动试了才 403。

**修复建议**

追加对 process.env.VERCEL_ENV === 'preview' 时放行 process.env.VERCEL_URL 派生的 origin（Vercel 自动注入这两个变量），约 5 行；生产口径不变。

**验证过程**：读 src/lib/csrf.ts 全文：line 8 ALLOWED_ORIGINS=[SITE_URL,'https://synthmind.ca']，:11-14 仅 NODE_ENV==='development' 追加 localhost，:26 严格 includes 比对。Vercel preview 的 NODE_ENV 为 production、Origin 为 *.vercel.app，必然走到 403 分支——机制推演成立，表单是全站唯一转化入口的说法与 contact 页结构一致。

---

## 68. [LOW / CONFIRMED] CSP 的 img-src 放开了任意 https:，站内并无远程图片

- **维度**：架构与 Next 16 用法　**位置**：`src/proxy.ts:12`
- **原始评级**：severity=low confidence=high　→　**验证后**：low

**证据**

proxy.ts:12 img-src 'self' data: https:。全站图片（product/*.png|svg、synthmind_logo.png、og-image.png）都在 public/ 同源，next.config.js 也没有 images.remotePatterns。Permissions-Policy（:31）覆盖 camera/microphone/geolocation/browsing-topics，未含 payment/usb 等。

**影响**

img-src https: 等于对图片这一类资源整体放弃了同源约束，一旦将来出现内容注入点（当前无），攻击者可用任意外域图片做数据外带（URL 里带参）。属于收紧成本极低的纵深防御空档，不是现存漏洞。

**修复建议**

img-src 收成 'self' data:；Permissions-Policy 追加 payment=(), usb=(), midi=(), xr-spatial-tracking=()。2 行。（若采纳把 header 搬进 next.config.js 的建议，一并改。）

**验证过程**：读 proxy.ts:12 确认 img-src 'self' data: https:，:29-32 确认 Permissions-Policy 只含 camera/microphone/geolocation/browsing-topics；grep 全 src 无任何 https:// 图片 src（data 层的 https URL 全是外链 href 非图片），next.config.js 无 images.remotePatterns——站内确无远程图片，收紧零成本。发现自己也定性为纵深防御空档非现存漏洞。

---

## 69. [LOW / CONFIRMED] X-Powered-By: Next.js 未关闭

- **维度**：架构与 Next 16 用法　**位置**：`next.config.js:2`
- **原始评级**：severity=low confidence=high　→　**验证后**：low

**证据**

实测 curl -I http://localhost:3178/ 返回 X-Powered-By: Next.js。next.config.js 的 nextConfig 里没有 poweredByHeader: false。

**影响**

对外暴露框架身份，给自动化扫描器省掉一步指纹识别。影响很小但修复是一行。

**修复建议**

next.config.js 加 poweredByHeader: false。1 行。

**验证过程**：读 next.config.js 全文（26 行）：nextConfig 只有 redirects()，无 poweredByHeader: false——Next 默认即输出 X-Powered-By: Next.js，审查者的 curl 实测与默认行为一致。

---

## 70. [LOW / CONFIRMED] 新增地产盘需要同时改 real-estate.ts 与 next.config.js 的 redirects，靠人记

- **维度**：架构与 Next 16 用法　**位置**：`src/data/real-estate.ts:9`
- **原始评级**：severity=low confidence=medium　→　**验证后**：low

**证据**

real-estate.ts:8-9 注释称 slug「用于 React key 与旧路由 301 对照」，但对照表实际硬编码在 next.config.js:12-17（五条 /products/<slug> → /products/real-estate）。CLAUDE.md 的新增流程只写了「加一条 + logo 放 public/product/」，没提 redirect。

**影响**

新增第 6 个盘时若按 CLAUDE.md 流程走，会漏掉 redirect，猜测 URL /products/<新盘> 直接 404——而这正是 next.config.js 注释里明确想避免的情况。两处数据源没有任何机制保证同步。

**修复建议**

next.config.js 改成 require/import real-estate.ts 的 slug 列表动态生成这五条 redirect（next.config 可以是 .mjs 并 import 数据层），或至少把这条规则写进 CLAUDE.md 的新增流程。约 10 行。

**验证过程**：读 real-estate.ts:4/8-9 确认注释与接口声明 slug「用于 React key 与旧路由 301 对照」；读 next.config.js 确认五条 /products/<slug> 重定向硬编码（实际在 :10-14，发现引 12-17 有小偏差），且注释明言补 avella/rosaleen 就是为了「5 盘 slug 空间统一可解析（防猜测 URL 404）」；CLAUDE.md 新增地产盘流程确实只写「加一条 + logo」未提 redirect。双源无同步机制属实。

**⚠️ 验证修正**：redirect 硬编码位置是 next.config.js:10-14 而非 12-17；且影响面限于「猜测 URL」（新盘从未有过详情页，无真实入链会 404），是违背 next.config 注释自设目标的一致性问题而非流量损失。

---

## 71. [LOW / PARTIAL] 全站 fixed header 的 logo 用 loading="lazy" 且 w-auto，首屏延迟加载 + 宽度未知导致 header 布局抖动

- **维度**：构建配置与交付　**位置**：`src/components/layout/SiteHeader.tsx:40`
- **原始评级**：severity=medium confidence=high　→　**验证后**：low

**证据**

SiteHeader.tsx:30 是 `fixed top-0 left-0 w-full z-50` 的常驻 header；line 40-47 的 `<Image src="/synthmind_logo.png" width={150} height={40} className="h-9 w-auto ..." />` 既没有 `priority` 也没有 `loading="eager"`。实测渲染输出：`<img alt="Synthmind Logo" loading="lazy" width="150" height="40" ... class="h-9 w-auto ...">`。两个后果叠加：① lazy 让这张必然可见的图排在懒加载队列尾部；② `h-9 w-auto` 覆盖了 next/image 写入的 width/height，宽度只能在图片解码后由真实宽高比（1200×320 = 3.75:1）决定，加载前该 img 宽度塌成 0 → logo 出现瞬间把 header 内容横向推开。同样的 `h-8 w-auto` 模式出现在 SocialProofBar.tsx:64/87、CaseStudyCard.tsx:42、RealEstateSiteGrid.tsx:35、CaseStudyHero.tsx:27、SiteFooter.tsx:26 共 7 处。

**影响**

header 是每一页的首屏元素，logo 迟到 + 宽度从 0 跳到 135px 会产生可测的 CLS（虽然 header 是 fixed，横向推挤仍计入 layout shift）。SocialProofBar 的跑马灯 8 个 logo 同理，滚动到该段时整行会抖一次。

**修复建议**

① header logo 加 `priority`（1 行）；② 把 `h-9 w-auto` 换成显式宽高：`className="h-9"` + `width={135} height={36}`（1200:320 精确比），或给容器加 `aspect-ratio`。7 处 logo 逐一按真实内秉比例算好 width/height。改动量约 14 行。

**验证过程**：实读 SiteHeader.tsx:39-48：Image 确无 priority（默认 loading=lazy）。但 CLS 论证核实为错误：width={150} height={40} = 3.75:1，与图片内秉 1200×320 = 3.75:1 完全一致，现代浏览器由 HTML 宽高属性推导 aspect-ratio，h-9 w-auto 下加载前即预留 135px 宽——不存在「宽度塌成 0 横向推挤」。

**⚠️ 验证修正**：成立的只剩「首屏常驻 logo 未加 priority」这一条轻微优化项；「w-auto 导致宽度塌 0 / header 布局抖动 / 可测 CLS」不成立（150:40 与 1200:320 宽高比精确相等，浏览器按属性比例预留空间）。其余 7 处 w-auto logo 同理，只要 width/height 属性比例与内秉比例一致就无抖动。

---

## 72. [LOW / CONFIRMED] font-stretch:116% 的 Archivo 宽体标题在 fallback 阶段无法被 Arial 复现，next/font 的 size-adjust 只按 100% 宽度标定 → LCP 标题在字体 swap 时重排

- **维度**：构建配置与交付　**位置**：`src/app/globals.css:247`
- **原始评级**：severity=medium confidence=medium　→　**验证后**：low

**证据**

globals.css:247 `.stretch-wide { font-stretch: 116%; }`，按 CLAUDE.md §3 这是「Blueprint 的排版签名」，用在 HomeHero.tsx:59 的 h1 高亮词（明确标注为 LCP 元素）与全站 SectionTitle 的 bold 词上。构建产物 CSS 里 next/font 生成的回退是 `@font-face{font-family:Archivo Fallback;src:local(Arial);ascent-override:88.96%;descent-override:21.28%;line-gap-override:0.0%;size-adjust:98.7%}` —— 这些指标是按 Archivo **默认宽度轴（100%）**测算的。Arial 没有 wdth 轴，`font-stretch:116%` 在它身上是空操作。三个字体全部 `display: 'swap'`（layout.tsx:11/19/27）。

**影响**

swap 发生瞬间，高亮词宽度突增约 10-16%（116% 宽度轴 vs 回退的 100%），横向撑开可能让 h1 换行数变化 → 垂直 CLS，而这正好发生在 LCP 元素上。低带宽/首次访问最明显（Archivo 那份 woff2 有 90KB，见下条）。

**修复建议**

三选一：① 给 `.stretch-wide` 在字体未就绪时补偿——用 `letter-spacing` 或 `transform: scaleX()` 对回退栈做近似（脆）；② 用 CSS Font Loading API + `document.fonts.ready` 加一个 `.fonts-ready` class 门控 `.stretch-wide`，未就绪时不施加宽体（会牺牲一点首帧观感，但消除重排）；③ 最省事——把 h1 的 `.stretch-wide` 词包在固定 `min-height` 的容器里，接受横向抖动只压掉垂直 CLS。建议先用 Lighthouse/WebPageTest 实测 CLS 数值再决定投入，当前是理论推导（故标 medium confidence）。

**验证过程**：globals.css:247-249 实读确认 .stretch-wide{font-stretch:116%}；layout.tsx:8-27 三字体均 display swap 且 Archivo 带 wdth 轴；grep 构建 CSS 实测 Archivo Fallback 的 size-adjust:98.7% / ascent 88.96% 确按默认宽度标定，Arial 无 wdth 轴属实。机制链成立。

**⚠️ 验证修正**：严重度降 low：Archivo latin 是 preload 的，swap 窗口只在慢网/首访短暂存在，实际 CLS 量级未测（发现自己也承认是理论推导并建议先实测）。

---

## 73. [LOW / CONFIRMED] Archivo 因请求 wdth 轴，preload 的 woff2 达 90KB，占三家族字体首屏预载总量（132KB）的 67%

- **维度**：构建配置与交付　**位置**：`src/app/layout.tsx:8`
- **原始评级**：severity=medium confidence=medium　→　**验证后**：low

**证据**

layout.tsx:8-13 `Archivo({ subsets:['latin'], display:'swap', variable:'--font-display', axes:['wdth'] })`。把构建 CSS 里的 `-s.p.`（即被 preload 的 latin 子集）文件与家族对上后实测：Archivo latin = `21ca8f3f56c22ca2-s.p.*.woff2` 90,096 B / Manrope latin = `a343f882a40d2cc9-s.p.*.woff2` 24,576 B / IBM Plex Mono 400 = 10,052 B / IBM Plex Mono 500 = 10,060 B，合计 134,784 B（约 132KB）在每个页面 head 里 `<link rel=preload as=font>`。Archivo 一家就是 Manrope（同为可变字体）的 3.7 倍——差额几乎全部来自额外的 wdth 轴。

**影响**

132KB 的字体以 preload 最高优先级与 JS/CSS 争抢首屏带宽。Archivo 只用于标题（h1 + SectionTitle 的 bold 词），却是最大的一份。移动 4G 下约 +0.3s 到首个可用字形。

**修复建议**

先量化收益：临时去掉 `axes: ['wdth']` 重新 build，对比该 woff2 体积（预计降到 40-50KB）。若差额显著，两条路——① 保留 wdth 但改 `display: 'optional'` 并去掉 preload，让首屏用回退字体渲染、字体下轮访问才生效（会牺牲首访观感）；② 用 Google Fonts 的 text= 子集或自托管一份只含 wdth 116% 静态实例的 Archivo（标题字符集有限，可以极窄子集化到 <15KB）。②是最优解但需要构建期字体处理。改动量：①1 行，②需引入字体子集化步骤。

**验证过程**：ls .next/static/media/*-s.p.*.woff2 实测四个 preload 字体 = 90,096（Archivo）/ 24,576（Manrope）/ 10,052 + 10,060（Plex Mono 400/500），合计 134,784 B，与发现的字节数完全一致；layout.tsx:12 axes:['wdth'] 属实。

**⚠️ 验证修正**：严重度降 low：132KB 字体 preload 在同类站点属正常量级，Archivo 承担全站标题（含 LCP h1），wdth 轴是设计签名 .stretch-wide 的载体（CLAUDE.md §3 定案），砍轴需设计权衡而非纯技术债；wdth 轴对体积差的归因未做去轴对照实测。

---

## 74. [LOW / CONFIRMED] next.config.js 没有 headers()，/public 下的图片全部以 Cache-Control: public, max-age=0 交付

- **维度**：构建配置与交付　**位置**：`next.config.js:26`
- **原始评级**：severity=medium confidence=high　→　**验证后**：low

**证据**

next.config.js 只有 `redirects()`，没有 `headers()`、没有 `images`、没有 `poweredByHeader`。实测响应头：`/og-image.png` → `Cache-Control: public, max-age=0`（490KB）、`/synthmind_logo.png` → `max-age=0`、`/product/T_One.png` → `max-age=0`、`/icon.jpg` → `max-age=0, must-revalidate`。对照 `/_next/static/chunks/*.css` → `max-age=31536000, immutable`、`/_next/image?...` → `max-age=14400`。Vercel 对 /public 静态文件的默认行为与此一致，不会自动补长缓存。

**影响**

每次导航这些直连 /public 的资源都要发条件请求（虽然多半 304，但仍是一次 RTT）。icon.jpg 200KB 首次全量、后续每页 304 往返。在多页浏览路径上是可省的延迟。

**修复建议**

在 next.config.js 加 headers()，对 `/product/:path*`、`/og-image.png`、`/synthmind_logo.png` 设 `Cache-Control: public, max-age=31536000, immutable`（这些文件内容稳定，改图时改文件名即可）。改动量约 15 行。同时建议一并加 `poweredByHeader: false`（实测 `curl -sI /` 返回 `X-Powered-By: Next.js`，白送框架指纹）与 `images: { formats: ['image/avif','image/webp'] }`（Next 16 默认只有 webp）。

**验证过程**：实读 next.config.js 全文：只有 redirects()，无 headers()/images/poweredByHeader。Vercel 对 /public 静态文件默认 max-age=0, must-revalidate 属实（平台默认行为，不自动补长缓存）。

**⚠️ 验证修正**：严重度降 low：后续导航是条件请求 304（一次 RTT），Vercel 边缘仍有 ETag 缓存，实际用户感知很小；且直连 /public 的图片总数有限。属可做的优化不是缺陷。

---

## 75. [LOW / CONFIRMED] sitemap 所有 URL 的 lastmod 都是构建时刻，每次部署都在告诉 Google「全站刚刚改过」

- **维度**：构建配置与交付　**位置**：`src/app/sitemap.ts:9`
- **原始评级**：severity=medium confidence=high　→　**验证后**：low

**证据**

sitemap.ts:9 `const now = new Date();`，随后 11 条 URL 全部 `lastModified: now`。构建产物 `.next/server/app/sitemap.xml.body` 实测：11 个 <url> 的 <lastmod> 全是 `2026-07-27T11:43:10.104Z`（毫秒级同一时刻）。因为整站是 SSG，每次 `next build` 这个值就换一次。

**影响**

Google 明确说明会在 lastmod 与实际内容变化长期不符时停止信任该字段（Search Central: "if we detect the lastmod value is not accurate we will ignore it"）。改一个 typo 部署一次，11 个页面的 lastmod 全部刷新——正是它判定为不可信的模式。丢掉 lastmod 信号后，新增/更新页面的重新抓取会变慢。

**修复建议**

改成内容驱动：给 src/data/case-studies.ts 的每条产品加 `updatedAt` 字段，静态页在 sitemap.ts 里写死各自的手工日期常量。或退一步——干脆删掉 `lastModified`（sitemap 里该字段可选，缺失比撒谎好）。改动量：sitemap.ts 约 20 行 + data 层加字段。

**验证过程**：实读 src/app/sitemap.ts：line 9 const now = new Date()，全部条目 lastModified: now，属实；整站 SSG 每次 build 刷新该值属实。

**⚠️ 验证修正**：严重度降 low：11 个 URL 的小站，lastmod 是可选信号，最坏结果是 Google 忽略该字段（等价于不写），对收录/排名的实际影响很小。修复建议（内容驱动日期或干脆删掉）合理。

---

## 76. [LOW / CONFIRMED] 每页 14-16 张玻璃卡无条件启用 12px backdrop-filter，背后是 fixed 砖墙——滚动期逐帧重采样的合成成本没有任何低端设备门控

- **维度**：构建配置与交付　**位置**：`src/app/globals.css:411`
- **原始评级**：severity=medium confidence=medium　→　**验证后**：low

**证据**

globals.css:400-414 的 `@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))` 块内给 `.card-glass` 加 `backdrop-filter: blur(var(--glass-blur))`，`--glass-blur: 12px`（globals.css:80）。门控只有能力检测，没有 `(prefers-reduced-transparency)`、没有设备等级判断。实测各页 `card-glass` 出现次数：/about 29、/products 28、/ 16、/products/brokerage-platform 16、/contact 7（含变体类名重复计数，实际卡片数约为其半）。背景是 `.bp-wall`（globals.css:279 `position: fixed; inset: 0; z-index: -1`），内容从墙前滚过——即滚动时每张卡的 backdrop 采样区域都在变，无法缓存。

**影响**

backdrop-filter 元素各自需要独立的合成层 + 每帧重新模糊背后 12px 半径的内容。10+ 个这样的元素叠在一个滚动中的 fixed 背景上，在中低端 Android / 老 iPhone 上是典型的滚动掉帧来源，也会拉长交互期的合成时间（间接影响 INP）。globals.css:401 的注释自己写了「性能门槛不过关时删本块 = 全站定光滑玻璃（spec §1.3）」——说明设计侧预留了退路，但没有实测数据触发它。

**修复建议**

先量化：用 Chrome DevTools Performance 在 4x CPU throttle 下录 /about 的滚动，看 Compositing/Paint 时间占比；或直接 A/B（注释掉该 @supports 块）对比 FPS。若确认有代价，最省事的门控是把毛玻璃档再包一层 `@media (min-width: 1024px) and (hover: hover)`——移动端/触屏落回已经写好的光滑玻璃基态（视觉降级路径本就存在且已定案）。改动量约 5 行。

**验证过程**：globals.css:400-414 实读确认 @supports 块内 backdrop-filter: blur(var(--glass-blur))，line 80 --glass-blur:12px，门控仅能力检测；globals.css:279-283 .bp-wall 确为 fixed inset:0；grep 构建 HTML 实测 card-glass 计数 index 16 / about 29 / products 28 / contact 7，与发现一致。globals.css:397 注释确有「性能门槛不过关时删本块」退路。

**⚠️ 验证修正**：严重度降 low：毛玻璃档是 v7 设计定案（CLAUDE.md §5），spec 预留了降级路径，且滚动掉帧只是未实测的推测——发现自己也建议先 profile 再动。这是「待量化的性能风险」不是已证实的缺陷。

---

## 77. [LOW / PARTIAL] package.json overrides 把 sharp 强推到 0.35.x，而 next@16.2.12 声明的是 ^0.34.5——没有注释说明理由，且 postcss override 是空操作

- **维度**：构建配置与交付　**位置**：`package.json:19`
- **原始评级**：severity=medium confidence=medium　→　**验证后**：low

**证据**

package.json:19-22 `"overrides": { "sharp": "^0.35.0", "postcss": "$postcss" }`。实测 `node -e "require('./node_modules/next/package.json').dependencies.sharp"` → `^0.34.5`（即 >=0.34.5 <0.35.0），`npm ls sharp` → `next@16.2.12 └── sharp@0.35.3 overridden`。sharp 是 0.x 版本号，minor 递增在 semver 下等价于 breaking change，而它正是 Next 图片优化器调用的原生模块——Next 16.2 的测试矩阵跑的是 0.34.x。postcss 那条更可疑：`npm ls postcss` 显示 autoprefixer/next/tailwindcss 的 postcss 全部 `deduped` 到 8.5.23，去掉 override 结果不会变，`"$postcss"` 只是把 devDependency 的范围复述一遍。另外 `npm ls --all` 报出 `@img/sharp-wasm32@0.35.3 extraneous` 与 `@emnapi/runtime@1.11.3 extraneous`——lockfile 已有漂移。

**影响**

sharp override 让本地/CI 的图片优化跑在一个 Next 未验证的原生库版本上，出问题时症状是图片 400/尺寸异常，且难以归因（Vercel 生产环境用平台自带 sharp，本地和线上行为可能不一致——这类不一致最难查）。postcss override 是纯噪音，让读 package.json 的人以为有依赖冲突需要处理。extraneous 包说明 node_modules 与 lockfile 不同步。

**修复建议**

① 查明 sharp override 的历史动机（大概率是某个 CVE 或旧 Next 版本的兼容补丁），若已随 Next 16 升级失效就删掉，让 npm 解析 next 自己声明的 ^0.34.5；若确有安全理由，在 package.json 旁加注释说明并定期复核。② 直接删 `"postcss": "$postcss"`（已验证无效果）。③ 删除后跑 `rm -rf node_modules package-lock.json && npm install` 重建 lockfile，清掉 extraneous 项，再 `npm run build` 验证图片优化正常。改动量：3 行 + 一次依赖重装。

**验证过程**：grep package.json:19-22 确认 overrides sharp ^0.35.0 + postcss $postcss 且无注释；npm ls 实测 sharp@0.35.3 overridden；node 实测 next 声明 ^0.34.5 在 optionalDependencies（发现说 dependencies，读取 dependencies.sharp 返回 undefined）；npm ls postcss 确认全部 deduped 到 8.5.23（override 无效果）；npm ls --all 确认 @img/sharp-wasm32 与 @emnapi/runtime extraneous。

**⚠️ 验证修正**：两处修正：① next 的 sharp 声明在 optionalDependencies 不是 dependencies；② 生产跑在 Vercel（vercel.json framework nextjs），图片优化走平台自身服务，sharp override 的风险面实际只剩本地 dev/自托管场景，严重度降 low。postcss override 无效与 lockfile 漂移属实。

---

## 78. [LOW / CONFIRMED] 构建输出明确警告 caniuse-lite 数据陈旧 7 个月，autoprefixer 与 browserslist 目标据此计算

- **维度**：构建配置与交付　**位置**：`package.json:29`
- **原始评级**：severity=low confidence=high　→　**验证后**：low

**证据**

`npm run build` 输出第一行就是：`Browserslist: browsers data (caniuse-lite) is 7 months old. Please run: npx update-browserslist-db@latest`。`npm ls --all` 显示 `caniuse-lite@1.0.30001760`。项目 postcss.config.js 挂了 autoprefixer，autoprefixer 完全依赖这份数据决定加不加前缀。

**影响**

陈旧数据会让 autoprefixer 对已经不需要前缀的属性继续加前缀（CSS 略微膨胀），或对新出现的浏览器版本判断失准。当前 CSS 只有 49KB，实际影响很小，但这是每次 build 都在刷屏的告警噪音——真正的构建问题会被它淹没。

**修复建议**

`npx update-browserslist-db@latest` 并提交更新后的 package-lock.json。建议加进依赖更新的例行清单。改动量：1 条命令。

**验证过程**：node 加载 browserslist 复现了完全相同的告警「browsers data (caniuse-lite) is 7 months old」；npm ls 确认 caniuse-lite@1.0.30001760；用 caniuse-lite agents 数据实算最新浏览器 release date = 2025-12-04，距今约 7.8 个月，吻合。

---

## 79. [LOW / CONFIRMED] head 里缺 apple-touch-icon、web manifest、theme-color 与 twitter:image:alt

- **维度**：构建配置与交付　**位置**：`src/app/layout.tsx:30`
- **原始评级**：severity=low confidence=high　→　**验证后**：low

**证据**

实测 `curl -s / | grep '<meta\|<link'` 完整枚举 head，只有：charSet、viewport、4 条 font preload、stylesheet、next-size-adjust、title、description、canonical、google-site-verification、og:title/description/url/site_name/locale/image(+width/height/alt)/type、twitter:card/title/description/image、`<link rel="icon">`。没有 `apple-touch-icon`、没有 `<link rel="manifest">`、没有 `theme-color`、没有 `twitter:image:alt`。public/ 下也没有 favicon.ico（Google 的 favicon 抓取器会去试 /favicon.ico）。

**影响**

iOS 用户「添加到主屏幕」拿到的是页面截图而非品牌图标；Android Chrome 地址栏不会染上品牌色；Twitter 卡片缺 alt 影响无障碍。都不是硬伤，但对一家卖软件工艺的公司官网来说是可见的粗糙度。

**修复建议**

配合 favicon 那条一起做：加 `src/app/apple-icon.png`（180×180）、`src/app/manifest.ts`（Next App Router 约定，导出 name/short_name/icons/theme_color/background_color）、layout.tsx metadata 里补 `themeColor` 与 twitter.images 的 alt。项目里就有 `favicon-google-checklist` skill，按它跑完能一次性收齐。改动量：2 个文件 + metadata 约 8 行。

**验证过程**：ls src/app/ 确认只有 icon.jpg 无 apple-icon/manifest 约定文件；grep src/app/ 对 apple-icon|manifest|themeColor 零命中；ls public/favicon.ico 不存在；grep 构建 HTML twitter:image:alt 零命中而 og:image:alt 存在。全部属实。

---

## 80. [LOW / CONFIRMED] WallBricks 在首次 pointermove 里同步创建 700-1200 个 div，这次长任务直接计入 INP

- **维度**：构建配置与交付　**位置**：`src/components/shared/WallBricks.tsx:125`
- **原始评级**：severity=low confidence=medium　→　**验证后**：low

**证据**

WallBricks.tsx:262-271 的 `onMove` 里 `if (!ready) { build(); ... }` —— build()（line 118-152）在事件处理器内同步跑双层循环 createElement + 5 次 style 写入 + className 赋值。规模按 `--wall-brick-w` 媒体查询阶梯（56 基准）算：1920×1080 视口 = ceil(1920/56)×ceil(1080/56) = 35×20 = 700 块；2560×1440 = 46×26 = 1196 块。每块 div 都带 `background-image: var(--wall-tile-brick)`（一张 1091 字节的 SVG data URI，globals.css:333）。build() 结束后还有 `wall.dataset.live = ''` 触发全墙样式重算。

**影响**

用户把鼠标移进页面的第一下会撞上一次约 5-20ms（低端机更长）的同步 DOM 构建 + 一次全墙样式失效。Chrome 的 INP 会记录这次 pointermove 的处理时长。属于「只发生一次、幅度中等」的量级，不是重灾区，但它落在用户与页面的**第一次**交互上，正是 INP 采样最敏感的位置。

**修复建议**

把 build() 挪出事件处理器：首次 pointermove 只记录目标位置并 `requestIdleCallback(build)`（或 `requestAnimationFrame` + 分批，每帧建 200 块）。弹簧动画在砖建好前保持静态 tile，视觉上无感（本来就是懒启动）。改动量约 20 行。低置信是因为没在真机 profile 上实测这次任务的绝对时长——建议先用 DevTools 的 Interaction 面板量一下再决定是否值得改。

**验证过程**：实读 WallBricks.tsx：onMove 在 225-246 行，其中 229-233 行 if(!ready){build();...} 确在事件处理器内同步调 build()；build()（约 105-142 行）双层循环 createElement + 4 次 style 写入 + className，收尾 wall.dataset.live='' 触发全墙样式切换。1920/56 网格算术正确（35×20=700）。

**⚠️ 验证修正**：行号修正：onMove 实际在 225-246 行（发现引 262-271，那里是 onResize 区域）、build 约 105-142 行；用了 DocumentFragment 一次性 append，构建成本比逐个 append 低。问题实质（首次交互撞同步长任务、影响 INP 采样）成立，量级未实测，low 恰当。

---

## 81. [LOW / CONFIRMED] maxDuration 写在 vercel.json 的 functions 路径映射里，而不是 route 文件的 segment config——路径改名即静默失效

- **维度**：构建配置与交付　**位置**：`vercel.json:8`
- **原始评级**：severity=low confidence=medium　→　**验证后**：low

**证据**

vercel.json:6-10 `"functions": { "src/app/api/contact/route.ts": { "maxDuration": 10 } }`。而 src/app/api/contact/route.ts 里 grep `export const maxDuration|runtime|dynamic` 零命中——配置和代码分居两处，靠字符串路径耦合。同文件 line 5 还有 `"installCommand": "npm install"`，与 Vercel 对 npm 项目的默认行为相同，属于冗余覆盖（但会挡住 Vercel 未来对安装策略的自动优化）。

**影响**

哪天把 contact 路由挪个位置或改成 route group，vercel.json 的这条映射就变成死配置，maxDuration 悄悄回落到平台默认——没有任何构建错误或告警。当前是对的，但是脆的。

**修复建议**

在 route.ts 顶部加 `export const maxDuration = 10;`（App Router 官方 segment config，跟着文件走），删掉 vercel.json 的 functions 块。顺带可以删 installCommand/buildCommand/devCommand 三条与默认值相同的覆盖，vercel.json 只留 `{"framework": "nextjs"}`。改动量：1 行加 + 约 8 行删。

**验证过程**：实读 vercel.json：functions 块以字符串路径 src/app/api/contact/route.ts 映射 maxDuration:10 属实；grep route.ts 对 export const maxDuration|runtime|dynamic 零命中；installCommand/buildCommand/devCommand 三条与 Next 项目默认值相同属实。「路径改名即静默失效」的脆性判断成立。

---

## 82. [LOW / PARTIAL] Organization JSON-LD 的 sameAs 指向 https://github.com/synthmind，未验证该组织是否存在

- **维度**：构建配置与交付　**位置**：`src/app/(public)/page.tsx:56`
- **原始评级**：severity=low confidence=low　→　**验证后**：low

**证据**

page.tsx:56 `sameAs: ['https://github.com/synthmind']`，与 line 39 的 `logo: ${SITE_URL}/synthmind_logo.png`、line 52-55 的 memberOf CSIO 一起构成首页 Organization 结构化数据。我没有联网核实这个 GitHub 组织是否存在或是否属于 Synthmind（后台 agent，不做外部请求）。

**影响**

若该 URL 404 或不属于本公司，Google 的实体消歧会拿到一个坏信号——sameAs 的作用恰恰是「这些账号是同一个实体」，指错会削弱而非加强品牌面板的可信度。同理 logo 字段指向 synthmind_logo.png（1200×320），Google 品牌面板要求 logo 尽量接近方形或至少 112×112，横长条 logo 可能不被采用。

**修复建议**

人工确认 github.com/synthmind 归属：属实则保留，不属实则删掉这一行（sameAs 为空数组比错值好）。同时考虑给 JSON-LD 的 logo 换一张方形版本（可复用即将新建的 icon.png 512 档）。改动量：1-2 行。

**验证过程**：实读 page.tsx:56 确认 sameAs: ['https://github.com/synthmind']；WebFetch 实测该 GitHub 账号存在（user id 124502926）但零公开仓库、无 bio、无网站链接、无任何指向 synthmind.ca 的信息——归属无法确认，且无回链时 Google 无法完成实体互证。logo 1200×320 横条不符品牌面板近方形偏好属实（sips 实测尺寸）。

**⚠️ 验证修正**：更新事实：github.com/synthmind 不是 404，账号存在但完全空置且无回链——风险从「可能指向不存在/他人的 URL」修正为「sameAs 信号无法被验证、近乎零价值」。仍需 David 人工确认账号归属：若是自家注册的占位账号，建议在其 profile 补 synthmind.ca 回链；若非自家，删除该行。

---

## 83. [LOW / PARTIAL] 全站没有声明 color-scheme: dark —— Firefox 滚动条/UA 控件仍是浅色，::-webkit-scrollbar 只救了 Chromium 和 Safari

- **维度**：CSS 引擎　**位置**：`src/app/globals.css:199`
- **原始评级**：severity=medium confidence=high　→　**验证后**：low

**证据**

`grep -rn "color-scheme" src/` 零命中；globals.css:199-211 只写了 `::-webkit-scrollbar` / `-track` / `-thumb` / `-thumb:hover` 四条（`background: var(--bg-base)` / `var(--text-quaternary)`）。这套伪元素 Firefox 完全不认。页面本体是 `--bg-base: #080b10` 的深底（body 187 行 `background: var(--bg-base)`），但 UA 在不知道 color-scheme 的情况下按 light 渲染滚动条、autofill 下拉、caret 默认色和首帧画布。globals.css:1452-1468 甚至专门写了 `-webkit-autofill` 的 1000px inset 实底来盖 Chrome 的浅色 autofill——那是在治标；`color-scheme: dark` 会让浏览器直接给出深色 autofill 背景，是治本手段。

**影响**

Firefox 桌面用户（约 3% 流量，但对一个卖软件工程能力的官网是「同行看得最细」的那批人）看到深黑页面配一条亮灰白滚动条，视觉断裂明显；此外首帧（CSS 到位前）是白闪而不是深色闪。ContactForm 的 4 个 input/textarea 在 Firefox 下 autofill 也会是浅底。

**修复建议**

`:root { color-scheme: dark; }` 一行即可（globals.css 的 `:root` 块，11 行处）。附带给 Firefox 补标准属性：`html { scrollbar-color: var(--text-quaternary) var(--bg-base); scrollbar-width: thin; }`，与既有 webkit 伪元素并存互不干扰。改动量 3 行。加了之后可以验证 `-webkit-autofill` 那段是否还需要保留（大概率仍要，Chrome 的 autofill 黄底/蓝底不受 color-scheme 完全控制）。

**验证过程**：grep color-scheme 全 src + tailwind.config 零命中属实；globals.css:199-211 确实只有 ::-webkit-scrollbar 四条，无 scrollbar-color/scrollbar-width 标准属性（grep 零命中）；autofill 治标段 1449-1468 属实。但「首帧白闪」不成立——globals.css 经 Next 打包为 render-blocking CSS，首帧不会在无样式状态绘制；macOS Firefox 默认 overlay 滚动条自动隐藏，可见断裂主要在 Windows Firefox。

**⚠️ 验证修正**：缺 color-scheme:dark 属实且值得补（1 行），Firefox（主要是 Windows）滚动条浅色 + 表单控件/autofill 浅色是真实现象；但「首帧白闪」的影响描述不成立（CSS render-blocking），实际影响面 = 少数浏览器的外观不一致，纯装饰性。严重度降 low。

---

## 84. [LOW / PARTIAL] 引擎块置于 @tailwind utilities 之后靠源序压 utility —— 是有意设计，但它连带静默吞掉所有同特异性 utility，且无任何 lint/测试守护

- **维度**：CSS 引擎　**位置**：`src/app/globals.css:506`
- **原始评级**：severity=medium confidence=high　→　**验证后**：low

**证据**

构建产物字节偏移实测：`.gap-2{` @15311、`.rounded-lg{` @16402、`.p-6{` @18088、`.px-6{` @18315、`.text-sm{` @19948，而 `.card-glass{` @30256、`.btn-primary,` @31811、`.form-field` 更后。全部是 (0,1,0) 特异性，源序后者胜 → 引擎必赢。
globals.css:503-505 的注释只声明了「不要写 px-*/py-*/text-*」，ModuleButton.tsx 的头注也只说「尺寸 utility 无效」。但实际被吞的远不止尺寸：`.btn-primary/.btn-secondary` 声明了 display/align-items/justify-content/gap/border-radius/cursor/transition/color/font-weight/font-size/border/background/box-shadow，`.card-glass` 声明了 position/border-radius/border/background/box-shadow/transition，`.form-field` 声明了 width/border-radius/border/background/padding/color/font-size/box-shadow。也就是说在使用处写 `justify-start`、`gap-3`、`rounded-full`、`rounded-none`、`border-0`、`bg-transparent`、`text-txt-secondary`、`w-1/2`(对 form-field)、`items-start` 全部**静默无效**，不报错、不 lint、TS 也拦不住。
现网暂无实际碰撞（我把所有 `<Card>` / `<ModuleButton>` 的 className 抓出来比对过：`w-full sm:w-auto`、`h-full`、`overflow-clip-safe`、`mb-6`、`max-w-3xl space-y-4` 等均不与引擎声明重叠），所以这是**潜伏**而非现症。

**影响**

下一个（人或 AI）写 `<Card variant="static" className="rounded-none border-0">` 会得到一张外观完全没变的卡，并且没有任何信号提示为什么。调试这类问题的成本很高，因为「utility 写了不生效」违反所有人对 Tailwind 的直觉。1552 行单文件 + 源序依赖是这类 bug 的完美温床。

**修复建议**

两条路径，按团队偏好二选一：
① **保持行为、加显式护栏**：把引擎块包进 `@layer components{...}`，然后对真正要锁死的属性（padding/font-size/border-radius）加 `!` 标记或用 `:where()` 提特异性。这样 utility 恢复正常覆盖能力，只有被显式锁的几条压不动，符合直觉。
② **保持现状、把契约写全**：在 globals.css:503 和两个组件的头注里列全「会被吞的属性清单」（display/flex 对齐/gap/圆角/边框/背景/文字色/box-shadow/宽度），而不是只写「尺寸 utility」。成本 10 分钟，收益是让下一个人有据可查。
我倾向 ①（结构性解决），但 ② 是零风险的最低成本止血。

**验证过程**：核实结构：globals.css 1-3 行是 @tailwind 三指令，引擎块（506+ 按钮 / 381+ 卡 / 1417+ form-field）全在其后，同特异性源序压 utility 的机制成立；503-505 注释与 CLAUDE.md §7 确实只声明 px-*/py-*/text-* 尺寸类。引擎声明的 display/gap/border-radius/border/background 等确实同样会吞掉对应 utility——技术描述属实。但 CLAUDE.md §7 明写「引擎块在 @tailwind utilities 之后……写了也不生效，别写」——这是显式定案的设计机制，不是缺陷；审查者自己也确认现网零实际碰撞。

**⚠️ 验证修正**：机制与「契约文档只写了尺寸类、实际吞得更宽」的描述属实，但这是 CLAUDE.md 显式定案的设计（非 bug），且零现症。真实残留 = 文档契约不完整的潜伏可维护性风险，严重度降 low；建议②（把被吞属性清单写全）是合理的最低成本项。

---

## 85. [LOW / PARTIAL] .card-glass 的 135deg 内反射渐变在基态与 @supports 块里写了两份，注释自认「改一处必改另一处」——可用 background-image/background-color 拆分彻底消灭

- **维度**：CSS 引擎　**位置**：`src/app/globals.css:386`
- **原始评级**：severity=medium confidence=high　→　**验证后**：low

**证据**

globals.css:385-387（基态）：
```css
background:
  linear-gradient(135deg, var(--glass-reflect-a), var(--glass-reflect-b) 55%),
  var(--glass-face-solid);
```
globals.css:404-410（@supports 毛玻璃档）逐字重复同一条渐变，只把最后的 `--glass-face-solid` 换成 `--glass-face`。395-396 的注释写着「内反射 135deg 必须与基态 `.card-glass` 同步（**全站两处**，改一处必改另一处）」——即作者已识别出这是漂移风险但选择带病共存。而这两层用的是 `background` 简写：最后一层的 `var(--glass-face-*)` 是纯色，语义上就是 background-color。

**影响**

v7→v8 时 225deg 改 135deg 已经踩过一次「朝着不存在的光源反光」的坑（注释 378-380 记录）。这类必须手工双改的地方是下次改角度/改 reflect token 时的固定翻车点；且现在两处相距 20 行，diff review 很容易只看到一处。

**修复建议**

拆成 background-image + background-color，渐变只写一次（改动约 8 行）：
```css
.card-glass {
  background-image: linear-gradient(135deg, var(--glass-reflect-a), var(--glass-reflect-b) 55%);
  background-color: var(--glass-face-solid);
  ...
}
@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .card-glass {
    background-color: var(--glass-face);
    -webkit-backdrop-filter: blur(var(--glass-blur));
    backdrop-filter: blur(var(--glass-blur));
  }
}
```
视觉完全等价（简写与拆分对这两层的解析结果一致），漂移风险归零，并且可以删掉那条「全站两处」的警告注释。

**验证过程**：读了 globals.css:381-414：基态 385-387 与 @supports 内 404-410 的 135deg 渐变确实逐字重复、仅面底 token 不同；395-396 注释「全站两处，改一处必改另一处」属实。background-image/background-color 拆分方案技术上等价可行。但作者已识别风险并用注释交叉锁定——这是已文档化的已知取舍，不是未知缺陷。

**⚠️ 验证修正**：事实全部属实，但属「已知并注释锁定的漂移风险」而非隐患；纯可维护性改进项，严重度 medium 降 low。拆分建议本身有效且零视觉风险。

---

## 86. [LOW / PARTIAL] rgba(74, 159, 229, α) 在 globals.css 里硬编码 31 处 —— 没有 --accent-rgb 三元组 token，换主色要手改 31 个字面量

- **维度**：CSS 引擎　**位置**：`src/app/globals.css:30`
- **原始评级**：severity=medium confidence=high　→　**验证后**：low

**证据**

`grep -c '74, 159, 229' src/app/globals.css` = 31（另有 4 处写成多行 `74,\n159,\n229` 格式，见 47/60/69/91/112 行，实际总计 35 处）。分布：--border-* 四档（30-33）、--mat-* 五个（46/59/65/66/67/68）、--glass-reflect-a（90）、--wall-face-tint（111）、::selection（194）、hero-glow（706）、card-glass-interactive hover/active 投影（443/456）、card-glass-accent 渐变（471）、btn-module-frame ::before/::after 槽光（643/660-661）、btn-secondary hover（598/604）、btn-primary hover 投影（565）、form-field focus ring（1447/1467）、bp-face-fill--front/top/core（936/949/967）、bp-seam-glow--h/--v（1054/1064）、bp-object-backglow（1295）、bp-object-shadow（1336）。
同一个值还在 tailwind.config.js:19（`accent: '#4A9FE5'`）、:52（dropShadow）、src/lib/constants.ts（BRAND_ACCENT）、BlueprintObject.tsx 的 STROKE 表 9 条里各存了一份。
注意：CLAUDE.md §4「NEVER Hardcode Hex」只约束了 hex 形态，rgba 形态的同一颜色不在约束内——这是纪律本身的口子，不是执行者违规。

**影响**

品牌主色一旦要调（哪怕只调一档明度），需要跨 4 个文件改 40+ 处，且其中 35 处在 CSS 里没有任何机器可校验的关联。对一个把「单色相纪律」当立场的设计系统，主色反而是全站最难改的东西，这是反直觉的架构债。

**修复建议**

引入一个三元组 token（改动集中在 :root，其余是机械替换）：
```css
:root { --accent-rgb: 74 159 229; --accent: rgb(var(--accent-rgb)); }
```
然后所有 `rgba(74, 159, 229, 0.xx)` → `rgb(var(--accent-rgb) / 0.xx)`（现代语法，Chrome 65+/Safari 12.1+/FF 52+ 全支持，本项目 browserslist 无老 IE 负担）。data-URI 内的 `%234a9fe5` 无法消费 var()，保持字面量并在注释里标交叉锁定（与现有 --wall-* 做法一致）。改动约 35 行单点替换，可一次 sed 完成后人工复核。收益：主色变更从 40 处降到 1 处 + 3 处交叉锁定点。

**验证过程**：跑了 grep -c '74, 159, 229' globals.css = 31，精确吻合；多行形态实核为 5 处（46/59/68/90/111 起始行）而非「4 处」；tailwind.config accent #4A9FE5、constants.ts:18-19、BlueprintObject.tsx STROKE 表 9 条 rgba(74,159,229) 均属实。但 CLAUDE.md §4 豁免条款明确授权这些 rgba 形态（border token、--mat-*、--glass-*、--wall-* 各簇均有显式豁免口径），审查者也自认「是纪律的口子不是违规」。

**⚠️ 验证修正**：计数与分布属实（多行是 5 处不是 4 处）；但全部落在 CLAUDE.md 显式豁免口径内，不构成违规——本质是「换主色成本高」的架构债观察 + token 化建议。品牌主色变更是低频事件，严重度 medium 降 low。--accent-rgb 三元组建议本身可行。

---

## 87. [LOW / PARTIAL] .bp-object-spring 常驻 will-change: transform —— 违反 CLAUDE.md 的「禁常驻 will-change」，弹簧停帧后合成层仍不释放

- **维度**：CSS 引擎　**位置**：`src/app/globals.css:854`
- **原始评级**：severity=medium confidence=medium　→　**验证后**：low

**证据**

globals.css:851-855：
```css
.bp-object-spring {
  transform-style: preserve-3d;
  will-change: transform;
}
```
这是全库唯一一处 will-change（`grep -rn "will-change" src` 只有此行 + AnimateOnScroll.tsx:45 的「不写 will-change」说明注释）。CLAUDE.md §5 卡片纪律明写「禁常驻 will-change」，AnimateOnScroll 也严格遵守（注释：「整页十几个未入场 wrapper 同时持有合成层提示得不偿失」）。而 HeroObjectPhysics 的头注强调「rAF 按需运行，收敛即停帧」——弹簧会停，但 will-change 是 CSS 静态声明，停帧后不会撤销，合成层永久驻留。
缓解因素：① 该元素只在 ≥lg 渲染（HomeHero.tsx:114 `hidden lg:block`），移动端 display:none 不产生层；② `transform-style: preserve-3d` 本身通常已触发层提升，will-change 的增量收益可能为零——这也正是「删掉它大概率零视觉影响」的理由。置信度 medium 是因为我没做真机层数/显存实测。

**影响**

桌面首页常驻一个 460px 宽的额外合成层（含 preserve-3d 子树的面元素），显存占用与首页其余时间的 GPU 压力都是白付的；更实际的问题是纪律不一致——文档禁的东西实现里有一处，下次有人照葫芦画瓢在别处加 will-change 时就没有依据反驳。

**修复建议**

两条路：① 直接删掉这一行（`preserve-3d` 已足够触发提升），跑一次首页 hero 弹簧交互对比帧率/观感确认无回归——预期零差异，改动 1 行；② 若实测确实需要提升，改成 JS 动态开关：HeroObjectPhysics 在 rAF 启动时 `el.style.willChange='transform'`、收敛停帧时 `el.style.willChange=''`，与「收敛即停帧」的既有纪律同构（约 4 行 TS）。推荐先试 ①。

**验证过程**：核实 globals.css:851-855 确为全库唯一 will-change（grep 全 src 仅此行 + AnimateOnScroll.tsx:45 的说明注释）；HomeHero.tsx:114 hidden lg:block 属实（移动端不渲染）。但 CLAUDE.md 的「禁常驻 will-change」写在 §5 卡片系统条目内（transform 写入者分层那行），管辖对象是卡片，物件走独立的 v3 spec 豁免体系；且该元素是 rAF 弹簧逐帧写 transform 的唯一目标层，preserve-3d 大概率已提升，增量成本 ≈ 单个桌面元素的一个合成层。

**⚠️ 验证修正**：事实属实，但「违反 CLAUDE.md」的定性偏强——该禁令的行文语境在卡片纪律内，物件不在其字面管辖范围；实际成本 = 桌面首页单元素常驻合成层，可忽略。属纪律一致性/卫生问题，建议①（删除实测对比）仍值得做。严重度维持 low 而非 medium。

---

## 88. [LOW / PARTIAL] BlueprintObject 的 516 行 CSS（5.4 KB raw / 1.5 KB gzip = 全站样式的 11%）随全局表发到全部 16 条路由，实际只有首页用得上

- **维度**：CSS 引擎　**位置**：`src/app/globals.css:834`
- **原始评级**：severity=medium confidence=high　→　**验证后**：low

**证据**

实测：构建产物中从 `.bp-object-scene{` 到 `@keyframes marquee` 之间 5,400 bytes raw / 1,562 bytes gzip，总表 49,095 raw / 10,904 gzip。源码对应 globals.css:834-1349（516 行，占文件 33%）。这段的全部消费方只有两个组件：BlueprintObject.tsx 与 HeroObjectPhysics.tsx（`grep` 确认 .bp-object-* / .bp-face* / .bp-mod-* / .bp-seam-* / .bp-pip-* / .bp-port-* / .bp-ring-* / .bp-trace-* / .bp-datum / .bp-edge-boost 全部只在这两个文件出现），而它们只在 `/`（HomeHero）渲染。/about /contact /products /products/[slug] /products/real-estate /products/brokerage-platform 全部白背这 1.5 KB。
文件整体拆分接缝很清晰（我按注释分隔线数了一遍）：1-173 token / 175-258 基础与排版 / 260-360 墙 / 362-486 卡 / 488-680 按钮 / 682-709 分割线与光晕 / 711-758 滚动驱动 / 760-832 hero 绘制 / **834-1349 物件** / 1351-1406 marquee / 1408-1468 表单 / 1470-1483 scaleIn / 1485-1552 RM。

**影响**

1.5 KB gzip 对 LCP 的实际影响很小（诚实说：这不是性能问题，是架构问题）。真正的成本是可维护性——1552 行单文件里 1/3 是一个组件的私有样式，任何全文搜索/滚动定位都要穿过它；而且它与 RM 块（1485-1552）分居文件两端，物件新增动画时必须记得回到文件末尾补白名单，这个跨 700 行的隐式契约已经有 11 条条目在 RM 块里了。

**修复建议**

把 834-1349 抽成 `src/components/home/blueprint-object.module.css`（Next 原生支持 CSS Module 且会按路由 code-split），或退一步抽成 `src/app/blueprint-object.css` 由 globals.css `@import` —— 后者不省字节但立刻把 globals.css 压到 ~1050 行。⚠️ 两个必须一并处理的耦合点：① RM 块里的 11 条 `.bp-*` 条目要跟着搬（否则 RM 覆盖失效，这是静默失效）；② CSS Module 会哈希类名，而 BlueprintObject.tsx 里的类名是字符串拼接（如 `.bp-mod-hover` 配合 `--hx/--hy/--hz` 变量），迁移时要逐个改成 `styles.xxx`——工作量约 1-2 小时，不是纯机械操作。若嫌重，只做 `@import` 拆分（15 分钟，零风险，拿到可读性收益、不拿字节收益）也是合理的中间选项。

**验证过程**：核实 834-1349 确为物件块（读了区间头尾）；grep bp-* 类名消费方 = BlueprintObject.tsx、HeroObjectPhysics.tsx、**HomeHero.tsx**（121/125/126 行直接写 bp-object-scene/backglow/shadow）三个文件而非声称的两个——均只在首页渲染，核心结论「其余路由白背」成立；RM 块 1485-1552 与物件块分居两端、含 11+ 条 .bp-* 条目属实。审查者自认「不是性能问题是架构问题」（1.5KB gzip）。

**⚠️ 验证修正**：消费方是 3 个文件（漏了 HomeHero.tsx 直接使用 bp-object-scene/backglow/shadow）而非 2 个；性能影响自认可忽略，纯代码组织偏好 + 跨 700 行 RM 隐式契约的可维护性观察。严重度 medium 降 low；@import 拆分是零风险选项但非必需。

---

## 89. [LOW / CONFIRMED] --mat-seam-glow / --mat-seam-soft 零消费方，而同一文件的 .bp-seam-glow--h/--v + seamIn/seamPulse 硬编码了完全相同的值 —— 这两个 token 本该被真正消费

- **维度**：CSS 引擎　**位置**：`src/app/globals.css:66`
- **原始评级**：severity=low confidence=high　→　**验证后**：low

**证据**

globals.css:66-67 定义 `--mat-seam-glow: rgba(74,159,229,0.7)` 与 `--mat-seam-soft: rgba(74,159,229,0.55)`，注释标为「= 物件横缝光心」「= 物件竖缝光心/淡入终值」。`grep -F 'var(--mat-seam' globals.css` → 0 命中。
而实际使用点全在同一文件、全是普通 CSS 上下文（不是 SVG presentation attribute，var() 完全可用）：
- 1050-1058 `.bp-seam-glow--h`：`rgba(74, 159, 229, 0.7)` ×2
- 1060-1068 `.bp-seam-glow--v`：`rgba(74, 159, 229, 0.55)` ×2
- 1070-1074 `@keyframes seamIn { to { opacity: 0.55 } }`
- 1075-1083 `@keyframes seamPulse { 0%,100% { opacity: 0.55 } }`
- 1536-1537 RM 静态终值 `.bp-seam-glow { opacity: 0.55 }`
0.55 这个「淡入终值 = 脉冲起始值 = RM 终值」三处交接零跳变的不变量（注释 1069 明写），现在靠三处独立字面量维持。
顺带核实 CLAUDE.md 关于 --mat-* 的说法：edge-strong(0.62)/edge-faint(0.30)/trace-pulse(0.85) 三个**确实**逐字对上 BlueprintObject.tsx:26/30/34 的 STROKE.edgeFront/inner/pulse ✅，交叉锁定 claim 成立；但 seam-glow/seam-soft 这两个不属于 SVG 豁免范畴，属于「本可消费却没消费」。

**影响**

改缝光亮度要同时改 5 处字面量（两个 --h/--v 各 2 处 + 2 个 keyframe + RM 兜底），漏改任一处就破坏「淡入终值 = 脉冲起始值」的零跳变不变量，表现为缝光在 2.4s 交接瞬间闪一下——这种 bug 只在真机连续观察才发现。

**修复建议**

让两个 token 上岗（改动约 7 行）：`.bp-seam-glow--h` 的两个 stop 改 `var(--mat-seam-glow)`、`--v` 改 `var(--mat-seam-soft)`。opacity 那三处（seamIn/seamPulse/RM）另起一个 `--seam-rest-opacity: 0.55` 消费，把三处交接锁成一个值。同时把 CLAUDE.md 里「--mat-* 全簇是交叉锁定锚点」的口径收窄成「edge-strong/edge-faint/trace-pulse 三个是 STROKE 锚点」，避免下次审查再被这句话挡回去。

**验证过程**：跑 grep var(--mat- 全库：唯一命中是 587 行的 --mat-face-tint——--mat-seam-glow/soft 零消费方属实；读 1050-1083：--h 两处 rgba 0.7、--v 两处 0.55、seamIn to 0.55、seamPulse 0.55、RM 块 1535-1537 opacity 0.55 全部属实。.bp-seam-glow 是 HTML div 的 CSS background（非 SVG presentation attribute），:root 注释里的 var() WebView 豁免不适用于它，「本可消费却没消费」成立。STROKE 交叉锁定核对（edgeFront 0.62/inner 0.3/pulse 0.85 对 TSX 26/30/34 行）也属实。

---

## 90. [LOW / PARTIAL] --mat-face-base 已自认无消费方的死 token；--mat-face-shade 的 0.32 与任何实际值都对不上，作为「交叉锁定锚点」不具备检测漂移的能力

- **维度**：CSS 引擎　**位置**：`src/app/globals.css:42`
- **原始评级**：severity=low confidence=high　→　**验证后**：low

**证据**

① `--mat-face-base: rgba(17,22,32,0.9)`（42-45）：`grep -F 'var(--mat-face-base)'` → 0；注释自己写「v8：墙与 btn-secondary 已改消费不透明的 --wall-face-base；物件面 v3 起消费不透明 var(--bg-elevated) 实体化——**本 token 已无消费方，仅存历史锚点身份**」。它既不被 CSS 消费，也不对应 TSX 里任何字面量（BlueprintObject 的 STROKE 表里没有 rgba(17,22,32,...)），是纯粹的历史残留。
② `--mat-face-shade: rgba(0,0,0,0.32)`（53-58）：注释称「压暗轴（物件 right 面 v3 0.30–0.55 带内取值）」。实际 `.bp-face-fill--right`（953-957）是 `linear-gradient(200deg, rgba(0,0,0,0.3), rgba(0,0,0,0.55))`——0.32 既不是 0.30 也不是 0.55，是一个「区间内的代表值」。这意味着如果有人把 0.3 改成 0.4，0.32 依旧看起来「在带内」，token 不会报警——它无法履行交叉锁定的职责。
对比：--wall-* 那 13 个 token 我逐个对过 data-URI，全部逐字精确（lit 0.055/lit-k 0.03/tint 0.028/shade 0.42/shade-k 0.3/edge 0.3/edge-k 0.2/bed-base #080b10/bed-shade 0.45/bed-lit 0.018/bed-dark 0.35/bed-dark-t 0.4/bed-dark-k 0.28），那一簇的交叉锁定 claim **完全属实**，是好的实践。

**影响**

体积成本可忽略（<100 B）。真实成本是认知负债：CLAUDE.md 用「勿因未使用删除」给 --mat-* 全簇上了保护罩，但其中两个实际上一个是死代码、一个是假锚点。未来审查者（包括 AI）会被这句话挡住，不去清理，也不会发现 face-shade 根本不能检测漂移。

**修复建议**

① 删除 `--mat-face-base`（5 行，含注释）——它的注释已经论证了自己该死。② `--mat-face-shade` 二选一：要么改成 `--mat-face-shade-min: 0.30` / `--mat-face-shade-max: 0.55` 两个精确锚点并让 `.bp-face-fill--right` 真正消费它们（改动 4 行，从此有检测能力）；要么承认它只是文档、把它移出 :root 挪进注释块。③ 同步修正 CLAUDE.md §4 里「--mat-* 除 face-tint 外全簇是交叉锁定锚点」的表述——按实际情况分类：真锚点 3 个（edge-strong/edge-faint/trace-pulse）、应消费 2 个（seam-glow/seam-soft）、死码 1 个（face-base）、假锚点 1 个（face-shade）、在用 1 个（face-tint）。

**验证过程**：核实：grep var(--mat-face-base) 零命中，42-45 行注释自认「本 token 已无消费方，仅存历史锚点身份」属实；grep '17, 22, 32' BlueprintObject.tsx 零命中——face-base 确实连 TSX 锚点身份都没有。--mat-face-shade 0.32 vs .bp-face-fill--right（953-957）的 0.3→0.55 渐变属实，「带内代表值无检测能力」的论证成立。但 CLAUDE.md §4 明写「勿因『未使用』删除」——对全簇的保护是显式定案，直接删除与之冲突。

**⚠️ 验证修正**：事实全部属实且论证扎实（face-base 是真死码、face-shade 是无检测能力的假锚点），但删除动作被 CLAUDE.md 显式条款封锁——正确的落点是修正 CLAUDE.md/注释的锚点分类表述（审查者的建议③），而非当作普通死码清理。严重度 low 恰当，维持。

---

## 91. [LOW / CONFIRMED] --wall-seam 零 CSS 消费方、只被 JS 通过 getComputedStyle 读取，且 seam = pitch/16 这条不变量同时硬编在 3 个地方

- **维度**：CSS 引擎　**位置**：`src/app/globals.css:152`
- **原始评级**：severity=low confidence=medium　→　**验证后**：low

**证据**

`grep -F 'var(--wall-seam)' globals.css` → 0 命中。唯一读者是 WallBricks.tsx:110 `Number.parseFloat(styles.getPropertyValue('--wall-seam'))`，失败即 `buildFailed = true` 放弃增强（111-114）。
同一条几何不变量 `seam = pitch/16` 现在活在三处：
① `:root` 的成对数值（151-152 = 56/3.5，162-166 = 64/4，168-172 = 96/6）；
② `.bp-brick` 的 `background-size: calc(100% * 16 / 15)` + `background-position: 100% 100%`（334-335）——注释 318-330 详细论证了为什么必须用恒等式而不是读变量（跨断点期间 JS 防抖 200ms 会让图与盒对不上），论证是对的；
③ 砖 tile 的 96 viewBox / translate(6,6)（137 行 data-URI）与砖床 tile 的 6px 槽（145 行）。
CLAUDE.md 也把这条记为「spec §12 交叉锁定清单」，即已知且已文档化。

**影响**

两个风险：① `--wall-seam` 对静态 CSS 分析工具而言是「未使用的自定义属性」——Lightning CSS 的 `unusedSymbols`、某些 PostCSS 清理插件、或将来迁到 Tailwind v4 的 `@theme` 都可能把它剔掉，剔掉之后 `!s` 命中 → `buildFailed` → 桌面重力井**静默消失**，页面不报错、视觉只是「墙不响应鼠标了」，极难归因。② 三处不变量任一处改动都要人工同步另两处（例如未来加 ≥5000px 档时若写成 `120px/8px`（=1/15）而不是 `120px/7.5px`，砖图会整体错位 0.5px 且只在超宽屏出现）。
置信度标 medium：当前 postcss.config.js 只有 tailwindcss + autoprefixer，Next 内建的 cssnano 不会删自定义属性，所以**现在是安全的**——这是前瞻性风险不是现症。

**修复建议**

低成本加固（约 3 行）：给 `.bp-wall-face` 或 `.bp-wall` 加一条形式上的消费，让 --wall-seam 对任何分析工具都是「已使用」，例如 `.bp-wall-grid { --seam-guard: var(--wall-seam); }`（无副作用），或更有意义地让 `.bp-wall-face` 的 `background-position` 显式消费它。另外建议在 `:root` 的 pitch 阶梯注释里把「seam 必须 = pitch/16，否则 .bp-brick 的 16/15 恒等式与 tile 的 96/6 viewBox 同时失配」这句话从 spec 搬到 globals.css 现场（现在只在 318-330 的 .bp-brick 注释里，改 :root 的人不一定会读到那里）。

**验证过程**：grep var(--wall-seam) globals.css 零命中属实；WallBricks.tsx:110 getPropertyValue('--wall-seam') + 解析失败放弃增强属实；读 318-336 确认 .bp-brick 用 16/15 恒等式 + 注释完整论证（论证确实成立）；三处不变量分布（:root 数值对 / 恒等式 / tile viewBox）属实。审查者自己澄清了「当前 postcss 链安全、属前瞻性风险」——核实 postcss.config 确实只有 tailwindcss+autoprefixer 口径与此一致。描述诚实、严重度 low 恰当。

---

## 92. [LOW / CONFIRMED] marquee 暂停规则写了两份：globals.css 的 .animate-marquee:hover 未门控，TSX 的 hover:[...] utility 已门控 —— 触屏 tap 会粘滞暂停

- **维度**：CSS 引擎　**位置**：`src/app/globals.css:1367`
- **原始评级**：severity=low confidence=high　→　**验证后**：low

**证据**

两处定义同一效果：
- globals.css:1367-1369 `.animate-marquee:hover { animation-play-state: paused; }`
- SocialProofBar.tsx:59 `className="flex items-center w-max animate-marquee hover:[animation-play-state:paused]"`
构建产物实测（按大括号深度回溯确认）：Tailwind 那份落在 `@media (hover:hover) and (pointer:fine){...}` 内；globals.css 那份是顶层裸 `:hover`，无任何门控。两条规则作用在**同一个元素**上。

**影响**

① 纯冗余——删掉任意一条视觉零变化。② 触屏上 tap 一个 logo 链接后（或滑动时手指扫过），祖先 `.animate-marquee` 拿到 sticky :hover，logo 跑马灯**永久停住**直到用户点击页面别处。tailwind.config.js 的 `hoverOnlyWhenSupported: true` 本来就是为了根除这类粘滞（注释 3-5 明写「触屏 tap 不再产生粘滞 hover 态」），结果被手写的这一条绕过。

**修复建议**

删除 globals.css:1367-1369 三行，只保留 TSX 上的 Tailwind 变体（它已自动门控）。或反过来删 TSX 的、给 globals 那条包 `@media (hover: hover)`。前者更省事且与「hover 反馈统一由 hoverOnlyWhenSupported 编译」的口径一致。改动 3 行。

**验证过程**：globals.css:1367-1369 顶层裸 .animate-marquee:hover 属实；SocialProofBar.tsx:59 同元素上 hover:[animation-play-state:paused] 属实；tailwind.config.js:6-8 hoverOnlyWhenSupported:true 属实（arbitrary hover 变体同样被编进门控媒体查询）。两条规则同效果、一条门控一条不门控，触屏 tap 后裸 :hover 粘滞导致跑马灯停住的机制成立，与 config 注释「触屏 tap 不再产生粘滞 hover 态」的全站口径直接抵触。删 globals 三行的修复正确。

---

## 93. [LOW / CONFIRMED] SocialProofBar 跑马灯 60s infinite，只有 hover 可暂停，键盘/AT 用户没有暂停机制（WCAG 2.2.2）

- **维度**：CSS 引擎　**位置**：`src/app/globals.css:1364`
- **原始评级**：severity=low confidence=medium　→　**验证后**：low

**证据**

globals.css:1355-1369：`@keyframes marquee` + `.animate-marquee { animation: marquee 60s linear infinite }`，暂停条件只有 `:hover`（且是 hover-capable 设备专属，见上一条）。SocialProofBar.tsx:60-80 第一份轨道里是 40 个真实可 Tab 的 `<Link>`（第二份 aria-hidden + tabIndex={-1}，处理得很好）。没有 `:focus-within` 暂停，也没有暂停按钮。
WCAG 2.2.2 (Pause, Stop, Hide, Level A) 要求：任何自动开始、持续超过 5 秒、与其他内容并行呈现的移动内容，必须提供暂停/停止/隐藏机制。hover 暂停不构成键盘可达的机制。
置信度 medium：可以争辩这些 logo 是纯装饰（有 alt 文本且是可导航链接，所以不算纯装饰）；也可以争辩 prefers-reduced-motion 已提供逃生口（RM 白名单 1513 行确实包含 .animate-marquee ✅）——但 RM 只服务于设置了系统偏好的用户，不覆盖「用 Tab 键正在导航这些链接」的场景。

**影响**

键盘用户 Tab 到跑马灯里的 logo 链接时，链接仍在横向移动，视觉焦点跟着跑（焦点环随元素移动），难以确认当前落在哪个产品上。40 个可聚焦链接放在一条移动轨道上，这个体验相当糟。

**修复建议**

最小改动（1 行 CSS）：`.animate-marquee:focus-within { animation-play-state: paused; }`——键盘 Tab 进去即停，Tab 出去恢复，无需任何 JS，也不受 hover 门控影响。这同时解决了焦点跟随移动的问题。若要严格满足 2.2.2，还需要一个可见的暂停按钮，但 focus-within 已经消除了最实际的伤害。

**验证过程**：核实 SocialProofBar.tsx：logoItems = caseStudies(5)+realEstate(5)=10，REPEAT_COUNT=4（14 行）→ logos=40，第一轨 40 个可 Tab Link、第二轨 aria-hidden + tabIndex=-1 属实；globals.css 1364-1369 无 :focus-within 暂停、无暂停按钮属实；RM 白名单 1513 含 .animate-marquee 属实（审查者已如实标注）。WCAG 2.2.2 适用性论证成立（40 个可聚焦链接在移动轨道上，焦点随动画漂移）。focus-within 一行修复有效。

---

## 94. [LOW / CONFIRMED] 玻璃卡内阴影三件套重复 3 次、按钮 inset 对重复各 2 次、三个相邻 @media (hover:hover) 未合并 —— 可收敛的字面量重复

- **维度**：CSS 引擎　**位置**：`src/app/globals.css:389`
- **原始评级**：severity=low confidence=high　→　**验证后**：low

**证据**

① `inset 0 1px 0 var(--glass-edge-top), inset 0 -1px 0 var(--glass-edge-bottom)` 出现在 389-390（基态）、440-441（hover）、453-454（active）三处——因为 box-shadow 是整表替换属性，hover/active 每次都得把基态两条抄一遍。
② `.btn-primary` 的 `inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -2px 0 rgba(0,0,0,0.18)` 在 553-554 与 562-563 各一份；`.btn-secondary` 的 `inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -2px 0 rgba(0,0,0,0.28)` 在 590-591 与 601-602 各一份。全库 `inset 0 1px 0 rgba(255, 255, 255` 共 8 处。
③ globals.css:418、435、449 是三个**相邻**的 `@media (hover: hover)` 块（中间只隔注释），完全可以合并为一个；构建产物确认它们保持为 3 个独立块（PostCSS 默认不合并非相邻 at-rule）。

**影响**

纯可维护性。改玻璃卡的顶棱/底缘厚度要动 3 处；改按钮 inset 要动 2 处。这类「简写属性整表替换导致的抄写」是 box-shadow 的老问题，不是错误，但每一处都是一个漂移点。体积影响可忽略（gzip 后重复串压缩得很好）。

**修复建议**

用中间变量收口（改动约 10 行）：
```css
:root { --glass-inset: inset 0 1px 0 var(--glass-edge-top), inset 0 -1px 0 var(--glass-edge-bottom); }
.card-glass { box-shadow: var(--glass-inset); }
.card-glass-interactive:hover { box-shadow: var(--glass-inset), 0 14px 32px rgba(8,11,16,.55), 0 6px 14px rgba(74,159,229,.12); }
```
按钮同理起 `--btn-inset-primary` / `--btn-inset-secondary`。三个 hover 媒体块合并为一个（纯剪贴，零行为变化）。

**验证过程**：逐处核对：玻璃卡 inset 对出现在 388-390 / 440-441 / 453-454 三处属实；.btn-primary inset 对 553-554 与 562-563、.btn-secondary 590-591 与 601-602 各两份属实；418/435/449 三个相邻 @media (hover:hover) 块（间隔仅注释）属实。box-shadow 整表替换导致的抄写是真实机制，收口建议（中间变量 + 合并媒体块）行为等价。纯可维护性，严重度 low 恰当。

---

## 95. [LOW / PARTIAL] .btn-primary 渐变里的 #3488cc 是文档三档色阶之外的第四个 accent 明度，且与 constants.ts 的 BRAND_ACCENT_DARK 重复定义

- **维度**：CSS 引擎　**位置**：`src/app/globals.css:551`
- **原始评级**：severity=low confidence=high　→　**验证后**：low

**证据**

globals.css:551 `linear-gradient(135deg, #4a9fe5, #3488cc)`。CLAUDE.md §4 的 Accent Scale 表只有三档：accent #4A9FE5 / accent-400 #5DAAE9 / accent-700 #2870AB，并明写「色阶只保留这三档」。#3488CC 不在其中。同时 `src/lib/constants.ts:19` 有 `export const BRAND_ACCENT_DARK = '#3488CC'`（供邮件 HTML 内联用，属 CLAUDE.md 明确豁免），于是同一个第四档色在两个文件里各存一份字面量。
另外 543 行 `.btn-primary { color: #ffffff }` 和 196 行 `::selection { color: #fff }` 也是裸 hex（中性白，性质比彩色轻，但同样绕过 token）。
补充数据点：`accent-700` (#2870AB) 全库只被消费 1 次（about/page.tsx:51 的 `text-accent-700`）。

**影响**

「单色相 + 三档」是这个设计系统对外宣称的立场，实际是四档。CLAUDE.md §7 里确实写了 `Primary: linear-gradient(135deg, #4A9FE5, #3488CC)`，所以不是偷偷加的——但 §4 和 §7 互相矛盾，读者按 §4 理解色阶会漏掉这一档。换主色时 #3488CC 是最容易被漏掉的那个（它不在 tailwind.config 里，grep accent 也搜不到）。

**修复建议**

三选一：① 把 #3488CC 收编进 tailwind.config.js 的 accent 色阶（如 `600: '#3488CC'`）并在 CLAUDE.md §4 表里补一行，改成「四档」；② 把按钮渐变的暗端改用既有的 accent-700 #2870AB，色阶回到真三档（视觉会略微加深，需要设计确认）；③ 至少在 :root 加 `--accent-dark: #3488cc` 让 CSS 侧有 token、并在 constants.ts 的 BRAND_ACCENT_DARK 旁注明「与 globals.css --accent-dark 交叉锁定」。成本最低是 ③（2 行）。

**验证过程**：核实 globals.css:551 #3488cc、tailwind.config 三档（400/700/DEFAULT）、constants.ts:19 BRAND_ACCENT_DARK='#3488CC'、accent-700 全库仅 about/page.tsx:51 一处消费——全部属实。但 CLAUDE.md §7 明写「Primary: linear-gradient(135deg, #4A9FE5, #3488CC)」——该渐变是逐字文档化的显式定案，审查者也承认「不是偷偷加的」。

**⚠️ 验证修正**：「第四档越界」定性不成立——#3488CC 在 CLAUDE.md §7 中逐字授权，是显式设计决策；真实残留 = §4「只保留三档」与 §7 的口径张力 + 该 hex 在 globals.css 与 constants.ts 双份无 token 关联。属文档一致性/token 卫生问题，建议③（--accent-dark token + 交叉锁定注释）合理。严重度 low 维持。

---

## 96. [LOW / CONFIRMED] @keyframes scaleIn 是全站唯一通过内联 style 字符串消费的动画，类名绑定不可静态检查

- **维度**：CSS 引擎　**位置**：`src/app/globals.css:1474`
- **原始评级**：severity=low confidence=high　→　**验证后**：low

**证据**

globals.css:1474-1483 定义 `@keyframes scaleIn`；唯一消费方是 ContactForm.tsx:85 `style={{ animation: 'scaleIn 0.5s cubic-bezier(0.16,1,0.3,1)' }}`。全站其余 20 个 keyframe 都通过 class 绑定（`.bp-draw` / `.obj-float` / `.sheet-reveal` …），只有这个走裸字符串。
对比 tailwind.config.js:60 的 `scaleInDot`——同样是缩放弹入，却走了 `animation` 配置生成 `.animate-scale-in-dot` utility（SiteHeader.tsx:65 消费）。两个几乎同类的动画走了两条不同的注册路径。

**影响**

① 如果有人重命名或删除 `@keyframes scaleIn`，TS/biome/构建全部不报错，表现是表单成功态失去弹入动画——静默降级。② 架构不一致：同类效果一个在 tailwind.config 一个在 globals.css，新人不知道该往哪加。③ 该动画未写 fill-mode，RM 下靠 0.01ms 全局重置瞬时完成后回落基态（无 opacity/transform 基态声明），行为正确，无 a11y 问题。

**修复建议**

统一到 tailwind.config.js 的 animation/keyframes 表（与 scaleInDot 并列），生成 `.animate-scale-in`，ContactForm 改用 className。删除 globals.css:1470-1483 整块。改动约 8 行，收益是所有动画注册路径归一 + 类名进入 Tailwind 的 content 扫描范围（拼错会直接不生效并可被 review 发现）。

**验证过程**：核实 globals.css:1474-1483 @keyframes scaleIn；grep scaleIn 全 TSX 唯一消费方 = ContactForm.tsx:85 的内联 style 字符串属实；tailwind.config.js:60/71 scaleInDot 走 animation 配置、SiteHeader.tsx:65 用 animate-scale-in-dot class 属实——同类动画两条注册路径的不一致成立；globals.css @keyframes 总数 24 个，其余均 class 绑定的说法基本属实。重命名/删除时静默失效的风险真实。RM 行为分析（无 fill-mode、全局 reset 落回基态）也正确。

---

## 97. [LOW / PARTIAL] body 用 min-height: 100vh，而项目已为此专门造了 .min-h-svh-safe 渐进增强类

- **维度**：CSS 引擎　**位置**：`src/app/globals.css:187`
- **原始评级**：severity=low confidence=medium　→　**验证后**：low

**证据**

globals.css:181-190 `body { ... min-height: 100vh; ... }`，而 233-240 定义了 `.min-h-svh-safe { min-height: 100vh } @supports (min-height: 100svh) { min-height: 100svh }`，注释写「100svh 优先（移动端地址栏/工具栏不吃首屏布局）」。该类被 HomeHero.tsx:27 等 3 处消费，body 自己却停在 100vh。

**影响**

内容极短的页面（如 /_not-found）在 iOS Safari 上 body 会比可视视口高出地址栏的高度，产生一段可滚动的空白；有 fixed 背景墙（.bp-wall inset:0）时表现为内容轻微可拖动。影响很轻微，但既然已经有了正确的工具类，body 用旧写法是不一致。

**修复建议**

body 改成同款渐进增强（3 行）：`body { min-height: 100vh }` + `@supports (min-height: 100svh) { body { min-height: 100svh } }`，或直接把 `.min-h-svh-safe` 的声明合并进 body 选择器组。改动 3 行，零风险。

**验证过程**：核实 globals.css:187 body min-height:100vh、233-240 .min-h-svh-safe 渐进增强类均属实；但 grep min-h-svh-safe 全库消费方只有 HomeHero.tsx:27 一处，「等 3 处消费」不属实。影响本身极轻（仅内容不足一屏的页面在 iOS 上多出工具栏高度的可滚动区），且所有正常页面内容都超一屏。

**⚠️ 验证修正**：.min-h-svh-safe 的消费方是 1 处（HomeHero.tsx:27）而非「3 处」。不一致本身属实，3 行修复零风险，但实际用户可感知影响接近零。严重度 low 维持（偏 none 的一侧）。

---

## 98. [LOW / PARTIAL] drift / driftDur / driftDelay 是三个独立可选字段，缺一个就渲染出 `--drift-dur: undefined`

- **维度**：巨型组件与抽象　**位置**：`src/components/home/BlueprintObject.tsx:73`
- **原始评级**：severity=medium confidence=high　→　**验证后**：low

**证据**

ModuleDef 第 73–75 行：
```
drift?: readonly [number, number, number];
driftDur?: string;
driftDelay?: string;
```
三者必须同时出现才有意义，但类型层面互不相关。ModuleShell 1044–1052 行只用 `def.drift` 判断是否挂 `.bp-mod-drift` 类并展开 driftStyle，写入 `'--drift-dur': def.driftDur`——若 driftDur 缺失，React 会把 undefined 写成空值，CSS 的 `animation-duration: var(--drift-dur)` 拿到无效值回落 0s，模块从此不漂移。反过来只写 driftDur 不写 drift，则整段样式对象不生成，两个字段成为死数据。

**影响**

新增第 8 个模块时漏填 driftDur 是最自然的失误，后果是「这一块砖不动了」——而漂移周期本来就是 10–16s 的慢循环，肉眼要盯十几秒才能确认，实际会长期漏掉。类型系统本可以零成本挡住。

**修复建议**

合成一个可选对象：`drift?: { offset: readonly [number,number,number]; dur: string; delay: string }`，7 个桌面模块 + 5 个移动模块的数据改写约 30 行，ModuleShell 的 driftStyle 分支简化。同样的处理适用于 `core?` 与 `coreFrontZ`、`hasTop?` 与 topEtch 键的相关性（后者见上一条）。

**验证过程**：读了 73–75 行三个独立可选字段与 1044–1052 行 driftStyle，但核查 globals.css 1019–1020 行发现消费端写的是 var(--drift-dur, 14s) 和 var(--drift-delay, 3s)——都带 CSS 回落值。漏填 driftDur 时模块仍以默认 14s/3s 漂移，不会『从此不漂移』；且 React 对 undefined 的 style 值是跳过不写，不是写成空值

**⚠️ 验证修正**：类型层面三字段应合成一个对象的建议成立（相关性无类型保护），但声称的失败后果不成立：CSS 侧 var(--drift-dur, 14s) / var(--drift-delay, 3s) 均有回落值，漏填只会让该模块落回默认节奏（错峰编排轻微偏离），不会停止漂移，也没有 0s 回落。React 对 undefined 值是跳过写入而非写空。实际风险从『砖不动了』降为『节奏微偏』

---

## 99. [LOW / PARTIAL] BlueprintObject 的另一半（约 590 行 CSS）住在 1552 行的 globals.css 里，组件真实规模约 1900 行且跨文件耦合

- **维度**：巨型组件与抽象　**位置**：`src/app/globals.css:765`
- **原始评级**：severity=medium confidence=high　→　**验证后**：low

**证据**

globals.css 第 765–1355 行（bpDraw / bp-draw / bpFade / heroTilt / bp-object-scene / obj-float / obj-sway / bp-face-fill--{front,top,right,core} / bp-module / bp-mod-{asm,drift,hover} / bp-seam-glow / bp-core-pulse / tracePulse / pipCycle{,Lead} / portCycle{,Lead} / ringStep / bp-datum / bp-object-{backglow,shadow} 等）约 590 行全部只服务 BlueprintObject；1489–1552 行的 reduced-motion 块又列了 12 个 bp-* 选择器。而 globals.css 本身是 1552 行、装了 8 个互不相干的子系统（:root token / 砖墙 .bp-wall* / 玻璃卡 .card-glass* / 按钮 .btn-* / 物件 .bp-object* / marquee / form-field / reduced-motion）。TSX 侧通过 22 个 CSS 自定义属性（--draw-delay、--ax/ay/az、--dx/dy/dz、--hx/hy/hz、--asm-delay、--solidify-delay、--core-x/y/r、--seam-delay、--trace-dur/--trace-delay、--pip-delay、--drift-dur/--drift-delay、--edge-boost）与 CSS 侧握手，全靠字符串。

**影响**

改物件必须同时改两个文件，而其中一个是全站共用的巨型样式表——冲突面和误伤面都最大。CSS 侧无法 tree-shake：即使某个页面不渲染物件，这 590 行仍全量下发。

**修复建议**

Next 支持组件级 CSS Module。把 bp-object 相关的 590 行拆到 src/components/home/blueprint-object/object.module.css（reduced-motion 块一并带走），globals.css 降到约 960 行。自定义属性名保持不变即可零风险迁移；类名如果改用 CSS Module 哈希，需要同步 HeroObjectPhysics 的 querySelector（见下一条），建议保留 :global 的 .bp-object-root 作为契约锚点。

**验证过程**：核实 globals.css：760 行起『Hero 活蓝图』段、834 行起『Hero Blueprint Object v3』段，至 1351 行 Marquee 段头结束，~585 行确实全部服务 BlueprintObject；1485 起 reduced-motion 块含多个 bp-* 选择器。但『引擎 CSS 住 globals.css』是全站钦定模式——CLAUDE.md 明文把 .card-glass*（§5 块）、.btn-*（§7 块）、.bp-wall* 都定义为 globals.css 里的组件私有 CSS 引擎

**⚠️ 验证修正**：行数与耦合事实属实，但双文件结构不是物件独有的失误而是项目既定架构（CLAUDE.md 把 globals.css 分块钦定为 Card/ModuleButton/墙的私有 CSS 引擎所在地，物件 CSS 同模式且段头注明 spec 正本）。tree-shake 收益也有限：globals.css 全站单份缓存，首访后零增量。CSS Module 迁移是可选优化而非纠错，严重度降 low

---

## 100. [LOW / CONFIRMED] HeroObjectPhysics 用 querySelector 字符串跨组件抓 BlueprintObject 的内部类名，契约不受类型保护

- **维度**：巨型组件与抽象　**位置**：`src/components/home/HeroObjectPhysics.tsx:77`
- **原始评级**：severity=low confidence=high　→　**验证后**：low

**证据**

HeroObjectPhysics 第 77–79 行：
```
const section = scene.closest('section') ?? scene;
const hoverArea = scene.querySelector('.bp-object-root') ?? scene;
```
`.bp-object-root` 由 BlueprintObject 第 1224 行输出，两个文件之间没有任何共享常量或类型。`closest('section')` 则耦合到 HomeHero 的 DOM 结构（物件必须被某个 <section> 包住）。

**影响**

改 BlueprintObject 的根类名（比如上一条建议的 CSS Module 迁移就会改），`?? scene` 兜底会让 hover 命中区静默扩大到整个右栏空白——鼠标掠过空白处物件就发亮，不报错。把物件挪出 <section> 则指针跟随范围静默变成物件自身包围盒。

**修复建议**

把类名提为共享常量：新建 src/components/home/blueprint-object/contract.ts 导出 `export const OBJECT_ROOT_CLASS = 'bp-object-root'`，两处 import；或者更干净——BlueprintObject 接收一个 `rootRef?: Ref<HTMLDivElement>`，由 HeroObjectPhysics 直接持有引用，彻底去掉 querySelector。后者约 8 行改动。closest('section') 可改为在 HeroObjectPhysics 自己的 scene 容器上加一个显式的 data 属性由 HomeHero 指定监听范围。

**验证过程**：读了 HeroObjectPhysics.tsx 77–79 行：closest('section') 与 querySelector('.bp-object-root') ?? scene 兜底属实；BlueprintObject.tsx 1224 行输出该类名，两文件间无共享常量。改名后兜底静默扩大 hover 区的失败模式推演成立

---

## 101. [LOW / PARTIAL] 16 处 `as CSSProperties` 断言让所有 CSS 自定义属性名失去检查，拼错即静默无效

- **维度**：巨型组件与抽象　**位置**：`src/components/home/BlueprintObject.tsx:339`
- **原始评级**：severity=low confidence=medium　→　**验证后**：low

**证据**

BlueprintObject 里 `as CSSProperties` 出现 16 次（339、364、405、456、503、527–531、689–695、1038、1044、1053、1061、1071、1248 等）。典型：`style={{ '--draw-delay': delay } as CSSProperties}`。这个断言是绕开 React.CSSProperties 不接受任意 -- 键的标准写法，但副作用是整个对象字面量不再受任何键名检查——写成 `'--drft-dur'`、`'--draw_delay'` 都编译通过。全站还有 AnimateOnScroll、Card、ModuleButton 等处同样模式。我逐个 grep 校验了 22 个自定义属性在 globals.css 里的消费方，当前全部命中（零死变量），所以这是预防性发现而非现存 bug。

**影响**

该组件的全部动画编排（延迟、周期、装配偏移、核心半径、缝光相位）都通过这些字符串键传递，是唯一的 TSX↔CSS 接口；一个字母的拼写错误 = 一个动画静默不播，而这些动画周期长达 10–16s，肉眼验收极不可靠。

**修复建议**

定义 `type BpVar = '--draw-delay' | '--asm-delay' | '--ax' | ... ;` 和 helper `const vars = (v: Partial<Record<BpVar, string>>): CSSProperties => v as CSSProperties;`，16 处调用点从 `{...} as CSSProperties` 改为 `vars({...})`。约 25 行新增，换来键名全量检查。

**验证过程**：grep 确认 `as CSSProperties` 在 BlueprintObject.tsx 恰 16 处。但核查 globals.css 全部消费点：--draw-delay、--asm-delay、--drift-dur、--pip-delay、--trace-dur、--core-x/y/r、--ax/ay/az、--edge-boost 等全部写有回落值（var(--draw-delay, 0s)、var(--drift-dur, 14s)、var(--core-r, 90px)…）

**⚠️ 验证修正**：16 处断言与键名失检属实，类型 helper 建议合理；但『拼错 = 动画静默不播』不准确——CSS 侧所有自定义属性都带回落值，拼错的后果是落回默认时序/几何（编排偏离，如 delay 归 0 提前播、drift 落 14s），动画仍会播。失败模式从『不播』弱化为『时序漂移』，本就标注 low + 置信 medium，维持 low

---

## 102. [LOW / CONFIRMED] 变体无关的 datum 渲染路径里硬编码了桌面专属的时间常量和四个魔数坐标

- **维度**：巨型组件与抽象　**位置**：`src/components/home/BlueprintObject.tsx:1265`
- **原始评级**：severity=low confidence=medium　→　**验证后**：low

**证据**

1265–1300 行的浮动基准面在 `v.hasDatum` 分支内，但内部用的是模块级的 `T.datum`（1291 行）和 `T.labels`（1295 行）——桌面节奏表，而不是 `v.auxDelay`/`v.labelDelay`；MT 表根本没有 datum 键。定位也是裸字面量：`left: 115, width: 100, transform: 'rotateY(90deg) translateZ(235px)'`（1268–1273 行），只有高度 `v.height` 走了变体。VariantConfig 存在的全部意义就是「几何/蚀刻/节奏一表切换」（954 行注释）。

**影响**

当前 mobile 的 hasDatum=false，所以没暴露。一旦有人给移动变体或第三个变体打开 datum，会拿到桌面的入场时序（1.95s/2.15s，而移动整套编排 2.2s 收尾）和一个跟变体宽度无关的 translateZ(235)——基准面会飞到组合体外面或穿模。注释 1264 行手工推导了 235 与 M.05 位移峰值的关系，这个推导只对 width=360 成立。

**修复建议**

把 datum 的 4 个参数搬进 VariantConfig：`datum?: { left: number; width: number; z: number; drawDelay: string; labelDelay: string }`，hasDatum 布尔位随之删除（有对象即有 datum，顺带修掉与上一条同类的相关性问题）。约 15 行。

**验证过程**：读了 1265–1300 行：datum 在 v.hasDatum 分支内用模块级 T.datum（1291）与 T.labels（1295）而非 variant 字段；读了 39–54 行确认 MT 表无 datum 键；left:115/width:100/translateZ(235px) 裸字面量属实（1268–1273）；仅高度走 v.height。当前 mobile hasDatum:false 未暴露，属预防性发现，low 恰当

---

## 103. [LOW / PARTIAL] 三处「段出口」链接逐字符重复，而 shared/CardActionRow 只差一个 group- 前缀

- **维度**：巨型组件与抽象　**位置**：`src/components/home/FeaturedWork.tsx:54`
- **原始评级**：severity=medium confidence=high　→　**验证后**：low

**证据**

完全相同的 className 在三处内联：
- src/components/home/FeaturedWork.tsx:54 `"inline-flex items-center gap-1 text-accent text-sm font-medium transition-all duration-300 hover:gap-1.5"`
- src/components/home/ProcessStrip.tsx:55 同上，一字不差
- src/components/products/InDevelopmentShowcase.tsx:99 同上（仅 hover:gap-1.5 与 transition 的书写顺序对调）
三处都跟着 `<ArrowRightIcon className="w-3.5 h-3.5" />`。
而 src/components/shared/CardActionRow.tsx:23 的类串是：`"inline-flex items-center gap-1 text-accent text-sm font-medium transition-all duration-300 group-hover:gap-1.5"` ——唯一差别是 `group-hover:` vs `hover:`。CardActionRow 的文件头注释写着「此前在 4 处逐字符重复…统一收拢」。

**影响**

直接违反 CLAUDE.md 的「ALWAYS check src/components/shared/ before creating new UI components」。而且这不是「找不到合适组件」，是找到了却没用——共享组件差一个 prop。现在箭头间距语言有两份实现，调节奏（比如把 gap-1.5 改成 gap-2）要改 4 处。

**修复建议**

给 CardActionRow 加 `hover?: 'self' | 'group'`（默认 'group'）：`${hover === 'self' ? 'hover:gap-1.5' : 'group-hover:gap-1.5'}`，+3 行。三处内联各压成 `<Link href=...><CardActionRow hover="self">More about us</CardActionRow></Link>`，净 −12 行且语言收敛到一处。

**验证过程**：grep 确认三处内联类串与 CardActionRow.tsx:23 只差 group- 前缀（InDevelopmentShowcase 一处词序对调），证据逐字符属实。但对照 CLAUDE.md §5：『container 卡内的自悬停链接不属此列（如 InDev CTA，自带 hover:gap）』——自悬停形态被明文承认为 CardActionRow 之外的合法形态

**⚠️ 验证修正**：三处逐字符重复属实，加 hover prop 收敛的建议成立；但『直接违反 CLAUDE.md』的定性不成立——CLAUDE.md §5 明文把自悬停链接（点名 InDev CTA）划在 CardActionRow 职责之外，这是记录在案的形态区分而非漏用共享组件。问题降级为纯重复收敛机会，severity medium→low

---

## 104. [LOW / CONFIRMED] 客户 logo 的 <Image> 声明在 4 个组件里重复，含相同的 filter/opacity/hover 处理链

- **维度**：巨型组件与抽象　**位置**：`src/components/products/CaseStudyCard.tsx:37`
- **原始评级**：severity=low confidence=high　→　**验证后**：low

**证据**

完全相同的 6 个 props + 类串出现在两处：CaseStudyCard.tsx:37–44 与 RealEstateSiteGrid.tsx:30–37，都是 `width={120} height={36} suppressHydrationWarning` + `"h-8 w-auto object-contain filter brightness-0 invert opacity-50 group-hover:opacity-90 transition-opacity duration-300"`。SocialProofBar.tsx:69 和 :92 是同一处理链的另一档（opacity-45 hover:opacity-80 + drop-shadow）。CaseStudyHero.tsx:27 是第三档（h-6 opacity-70）。共 5 处内联。

**影响**

「客户 logo 在深色墙上的呈现方式」是一条设计规则（反色 + 压暗 + hover 提亮），现在散在 5 处 3 个档位里。改档位（比如把 opacity-50 提到 0.6 以满足对比度）要人工找齐 5 处，而且没有任何东西提示还有第 5 处。

**修复建议**

新建 src/components/shared/ClientLogo.tsx（约 30 行），props = `{ src, alt, tone?: 'card' | 'marquee' | 'hero' }`，内部一张 TONE_CLASS 表。5 处调用点各压到 3 行。净 −15 行，档位表单源化。

**验证过程**：grep 'brightness-0 invert' 命中恰好 5 处三个档位：CaseStudyCard:42 与 RealEstateSiteGrid:35 同串（opacity-50/group-hover:opacity-90）、SocialProofBar:69/92 同串（opacity-45/hover:opacity-80+drop-shadow）、CaseStudyHero:27 第三档（h-6 opacity-70），与描述一致（个别行号偏 2–5 行，不影响结论）

---

## 105. [LOW / CONFIRMED] mono 步骤序号 span 在 5 处重复，其中 padStart 逻辑也各写一遍

- **维度**：巨型组件与抽象　**位置**：`src/components/case-study/TextListSection.tsx:64`
- **原始评级**：severity=low confidence=high　→　**验证后**：low

**证据**

`font-mono text-sm font-semibold text-accent` + `{String(index + 1).padStart(2, '0')}` 的组合出现在 5 处：TextListSection.tsx:64–68、components/home/ProcessStrip.tsx:36–38、app/(public)/about/page.tsx:252–254、app/(public)/contact/page.tsx:134–139（多 pt-0.5 与 aria-hidden）、app/(public)/products/page.tsx:88–91（padStart 用在数量而非序号上）。CLAUDE.md §5 明确把它定义为「全站统一序号形态」，说明这是一条设计规则而非巧合。

**影响**

规则被写进文档但没被写进代码。四处的 aria-hidden 处理已经不一致了（contact 和 TextListSection 有，about 和 ProcessStrip 没有）——序号对读屏用户的暴露程度因页面而异，这是可访问性上的实际不一致，不只是审美问题。

**修复建议**

新建 src/components/shared/StepNumber.tsx（约 18 行）：`({ index, className }) => <span aria-hidden="true" className={`font-mono text-sm font-semibold text-accent ${className}`}>{String(index+1).padStart(2,'0')}</span>`，统一带 aria-hidden（序号语义由外层 <ol>/<li> 承担，TextListSection 已经这么做了）。4 处替换，净 −8 行，并顺手抹平 a11y 不一致。

**验证过程**：grep 类串命中 5 处（TextListSection:64/ProcessStrip:36/about:252/contact:135/products:88），padStart 各自重写属实；aria-hidden 核实：contact:136 与 TextListSection:65 有、about:252 与 ProcessStrip:36 无——a11y 不一致属实；products:88 用于数量而非序号也属实

---

## 106. [LOW / PARTIAL] 「带 ruled-line 的章节外壳」在 10 处逐字符重复

- **维度**：巨型组件与抽象　**位置**：`src/app/(public)/about/page.tsx:168`
- **原始评级**：severity=low confidence=high　→　**验证后**：low

**证据**

`<section className="relative py-24 px-4"><hr className="ruled-line absolute top-0 left-0 right-0" /><div className="max-w-6xl mx-auto">` 这个三行外壳出现在 10 处：about/page.tsx:168、200、234；products/brokerage-platform/page.tsx:225、263；products/page.tsx:52；home/FeaturedWork.tsx:20；home/ProcessStrip.tsx:17；products/InDevelopmentShowcase.tsx:46–52；case-study/CaseStudyNav.tsx:69。另有「hero 后第一章」变体 `pt-12 pb-24` 且不带 hr，出现在 about:114、brokerage-platform:113、real-estate:58、InDevelopmentShowcase 的 afterHero 分支——这个变体的规则（IA v1 §2.4）在 4 处各用一段注释重复解释。max-w-6xl mx-auto 全站出现 14 次。

**影响**

章节节奏（py-24、分隔线位置、内容宽度、afterHero 收半档规则）是一条被反复用注释解释的设计纪律，但没有代码载体。InDevelopmentShowcase 已经把它参数化成 `afterHero` prop 了——说明作者知道该抽，只是只抽了自己那一处。调整全站章节节奏需要改 10+ 处。

**修复建议**

新建 src/components/shared/Section.tsx（约 35 行）：props = `{ afterHero?: boolean; width?: '3xl'|'4xl'|'6xl'; className?; children }`，内部处理 hr 与 pt 收半档。10 处调用点各省 2 行，并把「afterHero 不加线」这条规则从 4 段注释收敛成一个 prop 的实现。净 −20 行，规则单源。

**验证过程**：grep 'relative py-24 px-4' 恰命中 8 处（about×3、brokerage×2、products、FeaturedWork、ProcessStrip）；pt-12 pb-24 变体 4 处 + InDevelopmentShowcase 条件式属实；max-w-6xl mx-auto 14 处属实。但读了 CaseStudyNav.tsx 65–71：它是 py-16 + max-w-3xl + nav 元素，不是同一外壳

**⚠️ 验证修正**：外壳重复成立但计数有误：逐字符相同的 py-24 外壳是 8 处而非 10 处，CaseStudyNav:69 是 py-16/max-w-3xl/nav 的另一档形态，不应计入『逐字符重复』。Section 组件抽取建议仍成立

---

## 107. [LOW / CONFIRMED] 卡片标题的 h3 类串在 8 处重复，档位差异（mb-2/mb-3/mt-2）无规则可循

- **维度**：巨型组件与抽象　**位置**：`src/components/products/CaseStudyCard.tsx:52`
- **原始评级**：severity=low confidence=medium　→　**验证后**：low

**证据**

`text-base font-medium text-txt-primary … tracking-tight` 出现在 8 处：CaseStudyCard.tsx:52（mb-2）、RealEstateSiteGrid.tsx:40（无 margin）、products/page.tsx:99（mb-2）、brokerage-platform/page.tsx:243（mb-3）、about/page.tsx:255（mt-2）、ProcessStrip.tsx:39（mt-2）、CaseStudyNav.tsx:46（span 而非 h3）、contact/FAQAccordion.tsx:41（span）。间距各不相同且看不出规则。另有次级标题档 `text-title font-display font-semibold stretch-wide text-txt-primary tracking-tight` 在 3 处重复：brokerage-platform:164、brokerage-platform:206、InDevelopmentShowcase:74。

**影响**

CLAUDE.md 已经建立了 SectionTitle（章级）与 Eyebrow（眉标）两级组件，卡内标题这一级是缺口。IA v1 spec 明确定了「60 字小卡不配 text-lg」这类档位规则（about/page.tsx:217–219 的注释），但规则只存在于注释里，8 个使用点靠人工遵守。

**修复建议**

新建 src/components/shared/CardTitle.tsx（约 25 行），props = `{ level?: 'card' | 'subsection'; as?: 'h3' | 'span'; className? }`，两档分别对应上面两串类。11 处替换，净 −5 行但把第三级排版档位纳入组件体系（这是 SectionTitle/Eyebrow 之外唯一还在裸奔的一档）。

**验证过程**：grep 'text-base font-medium text-txt-primary' 恰命中 8 处（含 CaseStudyNav:46、FAQAccordion:41 两处 span），margin 各异（mb-2/mb-3/mt-2/无）属实；'text-title font-display font-semibold stretch-wide' 恰 3 处（brokerage:164/206、InDevelopmentShowcase:74）属实

---

## 108. [LOW / CONFIRMED] processSteps 在 about 页和 ProcessStrip 里各渲染一遍，结构相同只差字段与外壳

- **维度**：巨型组件与抽象　**位置**：`src/app/(public)/about/page.tsx:248`
- **原始评级**：severity=low confidence=medium　→　**验证后**：low

**证据**

about/page.tsx:248–263 与 home/ProcessStrip.tsx:32–47 是两段同构渲染：都 `processSteps.map((step, index) => <AnimateOnScroll key={step.title} delay={index*80+100}>` → 序号 span → `<h3 className="mt-2 text-base font-medium text-txt-primary tracking-tight">{step.title}</h3>` → `<p className="mt-2/mt-1.5 text-txt-secondary text-base leading-relaxed">`。差别只有：about 用 `step.description` 并包 `<Card variant="static">`，首页用 `step.summary` 并用 `border-t` 分栏。数据层 src/data/process.ts 已经为这两处各准备了一个字段（summary / description），说明「两处消费」是有意设计——但只做了数据单源，没做渲染单源。

**影响**

数据抽出来了，渲染没抽。加第五步、改序号形态、改交错延迟都要动两处。这两处在 CLAUDE.md 里被明确称为「两处消费同源」，读者会误以为已经收敛。

**修复建议**

新建 src/components/shared/ProcessSteps.tsx（约 40 行），props = `{ field: 'summary' | 'description'; shell: 'card' | 'rule' }`。两处调用各压到 1 行。净 −25 行。若嫌 shell prop 过宽，可改为 `renderItem` 插槽，但对只有两个形态的场景 union prop 更简单。

**验证过程**：对照读了 about/page.tsx 248–263 与 ProcessStrip.tsx 32–47：两段同构 map + 序号 span + 同串 h3 + p，差异仅 description/summary 字段与 Card/border-t 外壳，属实；ProcessStrip 头注释确认数据同源 src/data/process.ts、两字段各供一处。ProcessStrip 的『非卡片』是有意设计（判据一注释），但渲染单源化不受此影响

---

## 109. [LOW / CONFIRMED] about / brokerage-platform / contact 三个页面里硬编码了约 140 行内容常量，与已有的 src/data 与 faqData.ts 惯例矛盾

- **维度**：巨型组件与抽象　**位置**：`src/app/(public)/about/page.tsx:33`
- **原始评级**：severity=low confidence=medium　→　**验证后**：low

**证据**

about/page.tsx:33–93 定义 stats(21 行)、solutions(20 行)、values(17 行)；brokerage-platform/page.tsx:51–92 定义 EDOCS_SEGMENTS(7 行)、CAPABILITIES(32 行，含 6 段各 40–60 词的对外文案)；contact/page.tsx:36–52 定义 nextSteps(17 行)；products/real-estate/page.tsx:34–38 定义 STATS。
对照惯例：contact 页把 FAQ 抽到了同目录的 faqData.ts（29 行），流程步骤抽到了 src/data/process.ts，案例抽到了 src/data/case-studies.ts。CLAUDE.md 明确写「src/data/ — TS 常量即内容层」。同一个 contact 页里，FAQ 在数据文件、nextSteps 在页面文件。

**影响**

惯例不一致本身就是维护负担（下次写新页面的人不知道该放哪）。更实际的是 brokerage-platform：该文件头 6–18 行写了四条「对外事实红线」（不点名客户、CSIO 只能写 in progress、已签约方是 brokerages 不是 carriers、在建产品时态），而受这些红线约束的文案分散在 CAPABILITIES 常量、JSX 内联段落（169–218、278–298 行）和 metadata 三个地方，跟 SectionTitle/Card/AnimateOnScroll 的标记交织在一起。要审一遍文案得通读 311 行 TSX。

**修复建议**

① 把 CAPABILITIES + EDOCS_SEGMENTS + 三段 eDocs 长文 + 蓝图段长文抽到 src/data/brokerage-platform.ts（约 90 行纯内容，含红线注释），page.tsx 降到约 190 行且全是布局。这样文案审查只需看一个数据文件。② about 的 solutions/values 抽到 src/data/about.ts（stats 因为要从 caseStudies 派生可以留在页面或一并搬）。③ contact 的 nextSteps 并入已有的 faqData.ts 或改名 contactData.ts。总改动约 160 行搬迁，零行为变更。

**验证过程**：抽查核实：about:33 起 stats 常量、brokerage:51 起 EDOCS_SEGMENTS+CAPABILITIES、contact:36 起 nextSteps、real-estate:34 起 STATS 均在页面文件；contact 目录确有 faqData.ts 而 nextSteps 留在 page.tsx——同页双惯例属实；src/data/ 只有 case-studies/navigation/process/real-estate 四文件。brokerage 文件头红线注释与文案分散三处的审查负担论证合理

---

## 110. [LOW / CONFIRMED] CaseStudyHero 内联了一个外链图标 SVG，而 shared/ 里已有两个图标组件且注释说明就是为消除内联而建

- **维度**：巨型组件与抽象　**位置**：`src/components/case-study/CaseStudyHero.tsx:61`
- **原始评级**：severity=low confidence=high　→　**验证后**：low

**证据**

CaseStudyHero.tsx:61–74 内联了 14 行 SVG（`d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"`，box-with-arrow 型外链图标）。而 src/components/shared/ExternalArrowIcon.tsx 的文件头写着「同一条 path 此前在 2 处内联逐字符重复」，ArrowRightIcon 写着「此前在 3 处内联重复」——两个组件的存在理由就是消灭内联 SVG。这是第三个还活着的内联 SVG。

**影响**

三种外链视觉语言并存：CaseStudyHero 的 box-with-arrow、RealEstateSiteGrid 用的 ExternalArrowIcon 的斜箭头、CardActionRow 的直箭头。同为「打开外部站点」，详情页 hero 和作品卡用了不同图标，用户看到的是不一致的图标语言。

**修复建议**

二选一：① 若 box-with-arrow 是有意的第三档，抽成 src/components/shared/ExternalLinkIcon.tsx（约 25 行）并在设计文档里说明与 ExternalArrowIcon 的分工；② 若不是，直接换成已有的 `<ExternalArrowIcon className="w-3.5 h-3.5" />`，−13 行。我倾向 ②——两个视觉上都表示外链的图标同站并存，没有信息增益。

**验证过程**：读了 CaseStudyHero.tsx 61–74：box-with-arrow 内联 SVG 属实（path 与所引 d 一致）；读了 ExternalArrowIcon.tsx 与 ArrowRightIcon.tsx 文件头，注释确写『此前在 N 处内联重复』——两组件存在理由即消灭内联。外链图标三语言并存（box/斜箭头/直箭头）属实

---

## 111. [LOW / CONFIRMED] SocialProofBar 在首页输出 80 个 logo 节点 / 41KB HTML，REPEAT_COUNT=4 比覆盖 4K 所需多约 1/3

- **维度**：巨型组件与抽象　**位置**：`src/components/home/SocialProofBar.tsx:14`
- **原始评级**：severity=low confidence=medium　→　**验证后**：low

**证据**

REPEAT_COUNT = 4（第 14 行），logoItems = 5 个软件案例 + 5 个地产盘 = 10 项，logos = 40 项（第 33 行），再由两条轨道各渲染一遍（57–74 与 76–97 行）= 80 个 `<Link><Image>`。构建产物实测：index.html 里 marquee 区段 41,004 B，`<img` 出现 85 次。单份轨道宽度 ≈ 40 × (120px logo + 64px gap) ≈ 7360px，而注释声称目标是「覆盖 4K (3840px)」——覆盖 3840px 只需 21 项，REPEAT_COUNT=3 即足（30 项 ≈ 5520px），2 也仅略短。另外 57–74 与 76–97 是两段近乎逐字符相同的 18 行 JSX，只差 key 前缀、alt、tabIndex。

**影响**

首页多出约 13KB HTML 与约 20 个 DOM 节点的纯冗余（叠加 flight payload 是两倍）。这段和 BlueprintObject 一起，是首页 HTML 达到次重页 4.1 倍的两个原因。另外两条轨道的 JSX 重复意味着改 logo 呈现要改两处（现在两处的 alt 处理已经不同，是对的，但类串是重复的）。

**修复建议**

① REPEAT_COUNT 降到 3（一行），省约 10KB HTML；更严谨的做法是按 `Math.ceil(3840 / (logoItems.length * 184))` 计算。② 抽 `<MarqueeTrack items={logos} duplicate={boolean} />` 子组件（约 22 行），两条轨道各压到 1 行，净 −14 行。③ 配合 ClientLogo 组件（见 logo-image-duplicated）。

**验证过程**：读了 SocialProofBar.tsx 全文：REPEAT_COUNT=4（14 行）、logoItems=10、logos=40、双轨道 57–74/76–97 各 map 一遍 = 80 个 Link+Image 属实；构建产物 <img 85 次（80 marquee + 页面其余）吻合；覆盖计算复核：单轨 40×184≈7360px，3 重复 30×184≈5520px 已 >3840px，REPEAT_COUNT=3 足够的结论成立；两段轨道 JSX 近逐字符重复（仅 key 前缀/alt/tabIndex 差异，且该差异是 a11y 有意为之）属实

---

## 112. [LOW / CONFIRMED] 导航 label 'Our Work' 在 5 处硬编码，navigation.ts 已是单源却没被面包屑消费

- **维度**：巨型组件与抽象　**位置**：`src/data/navigation.ts:11`
- **原始评级**：severity=low confidence=high　→　**验证后**：low

**证据**

`'Our Work'` 出现在：src/data/navigation.ts:11（mainNav 单源）、products/page.tsx:38、products/[slug]/page.tsx:78、products/real-estate/page.tsx:45、products/brokerage-platform/page.tsx:99（后四处都是 Breadcrumb items 里的字面量，其中三处还重复写了 href: '/products'）。CLAUDE.md 记录这个 label 在 2026-07-26 从别的名字改过来——即已经发生过一次全站改名。

**影响**

navigation.ts 的注释写着「SiteHeader 和 SiteFooter 共用，单一来源」，但面包屑绕过了它。下次改名（或做 i18n）会漏掉 4 处面包屑，导致导航栏说 A、面包屑说 B。

**修复建议**

navigation.ts 导出 `export const WORK_CRUMB = { label: 'Our Work', href: '/products' } as const;`（+2 行），四个页面 import 使用。或更彻底：给 Breadcrumb 加一个从 mainNav 按 href 查 label 的 helper。改动约 8 行。

**验证过程**：grep 'Our Work' 字面量恰命中 5 处：navigation.ts:11（mainNav 单源）+ 四个页面的 Breadcrumb items 字面量（products:38、[slug]:78、real-estate:45、brokerage:99），其中三处重复 href:'/products'，与描述完全一致；CLAUDE.md 确记录 2026-07-26 曾全站改名

---

## 113. [LOW / CONFIRMED] ResultsSection 用嵌套三元在 JSX 里算网格列数

- **维度**：巨型组件与抽象　**位置**：`src/components/case-study/ResultsSection.tsx:317`
- **原始评级**：severity=low confidence=high　→　**验证后**：low

**证据**

第 317 行：`className={`grid gap-4 mb-8 ${statsResults.length >= 3 ? 'grid-cols-2 md:grid-cols-3' : statsResults.length === 2 ? 'grid-cols-2' : 'grid-cols-1 max-w-xs'}`}` ——单行 188 字符的嵌套三元。

**影响**

可读性问题，无功能影响。实测该组件最多只会渲染 1 张卡（见 results-parser-vs-data-field），所以这三个分支里有两个从未执行过。

**修复建议**

提到组件外：`const GRID = (n: number) => n >= 3 ? 'grid-cols-2 md:grid-cols-3' : n === 2 ? 'grid-cols-2' : 'grid-cols-1 max-w-xs';`（3 行）。若采纳数据层字段方案，这段随重构一并整理。

**验证过程**：读了 ResultsSection.tsx:317：嵌套三元算列数属实；结合我对 21 条 results 的实测（每案例最多 1 张 stat 卡），grid-cols-2/md:grid-cols-3 与 grid-cols-2 两个分支在当前数据下确实不可达。纯可读性问题，low 恰当

---

## 114. [LOW / CONFIRMED] MOBILE_RIGHT_SEAMS 是一个永远为空的占位常量

- **维度**：巨型组件与抽象　**位置**：`src/components/home/BlueprintObject.tsx:952`
- **原始评级**：severity=low confidence=high　→　**验证后**：low

**证据**

第 952 行：`const MOBILE_RIGHT_SEAMS: Record<string, string[]> = {};`，被 VARIANTS.mobile.rightSeams 消费（1005 行），ModuleShell 1150 行取值时又有 `?? []` 兜底。三层保险守着一个空对象。另外 RIGHT_SEAMS 的类型是可变的 `Record<string, string[]>`，与文件其它数据表统一用 readonly/as const 的风格不一致。

**影响**

极小。属于「为对称而保留的空壳」，读者会花时间确认它是不是漏填了。

**修复建议**

把 VariantConfig.rightSeams 改为可选（`rightSeams?: Readonly<Record<string, readonly string[]>>`），删掉 MOBILE_RIGHT_SEAMS，ModuleShell 的 `?? []` 保留即可。−2 行。属于上面拆文件重构里的顺手项。

**验证过程**：读了 952 行 MOBILE_RIGHT_SEAMS = {} 空对象、1005 行 VARIANTS.mobile.rightSeams 消费、1150 行 `?? []` 兜底——三层保险守空壳属实；948 行 RIGHT_SEAMS 用可变 Record 与全文件 readonly/as const 风格不一致属实。改可选字段的建议无副作用

---

## 115. [LOW / PARTIAL] backdrop-filter: blur(12px) 对所有设备无条件开启，手机上每张可见玻璃卡多一个 backdrop 合成层

- **维度**：运行时性能与移动端内存　**位置**：`src/app/globals.css:398`
- **原始评级**：severity=medium confidence=high　→　**验证后**：low

**证据**

globals.css:398-413 的 `@supports` 只判断能力、不判断设备：
```css
@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .card-glass { ... -webkit-backdrop-filter: blur(var(--glass-blur)); backdrop-filter: blur(var(--glass-blur)); }
}
```
`--glass-blur: 12px`（globals.css:80）。

实测（390×844 DPR3，CDP LayerTree）：原样 141 层，注入 `.card-glass{backdrop-filter:none}` 后 135 层 —— 首页视口内的玻璃卡贡献 6 个合成层。各页卡片总数（从预渲染 HTML 数 `class="card-glass`）：about 13 张、products 7 张、real-estate 8 张、contact 若干；滚动过程中每张进入视口都要触发一次 backdrop 快照 + blur pass。

讽刺的是 CLAUDE.md / globals.css:402 自己已经写了退路：「性能门槛不过关时删本块 = 全站定光滑玻璃（spec §1.3）」——但从未按设备实施。

**影响**

iOS Safari 的 `-webkit-backdrop-filter` 是出了名的贵：每个 blur 区域要把背后的墙面重新采样 + 高斯模糊，且 DPR3 下纹理是 CSS 尺寸的 9 倍。about 页滚动时可见 3–5 张卡同时开 blur，在 iPhone SE/中端 Android 上是掉帧和 GPU 内存的主要来源之一。

关键是这个升级在手机上几乎不产生视觉收益——12px blur 采样的是同一面深色石墨墙，光滑玻璃档（`--glass-face-solid` 实底）在小屏上肉眼几乎不可区分。

**修复建议**

把 `@supports` 块再套一层设备门控，让手机停在光滑玻璃档：
```css
@media (min-width: 768px) {
  @supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) { /* 原内容 */ }
}
```
（`@media` 包 `@supports` 是合法嵌套，Safari 14+ 支持。）约 3 行改动，零视觉风险。若担心平板，改用 `@media (hover: hover) and (pointer: fine)` 也可。

**验证过程**：代码事实属实：globals.css:399-414 @supports 只判能力不判设备，--glass-blur:12px（:80），手机满足 backdrop-filter 即升级毛玻璃档。但这正是 CLAUDE.md §5 与 v7 spec 的显式定案——「光滑玻璃档为基态，@supports 内升级毛玻璃档」，spec §1.3 给的逃生门是「性能门槛不过关时删本块=全站定光滑玻璃」（全局开关，非按设备），所以「从未按设备实施」不是遗漏而是设计口径就没有按设备分档这一层。发现提供的量化证据只有「+6 个合成层」，没有实测掉帧/耗电数据；「小屏上视觉不可区分」是主观判断。按设备门控是合理的优化提案而非缺陷修复。

**⚠️ 验证修正**：现状符合 v7 定案的能力门控设计（逃生门是全局删除而非按设备分档），故这是优化建议不是被遗漏的缺陷；移动端 backdrop-filter 成本方向上真实（iOS -webkit-backdrop-filter 昂贵是公认事实），但本发现未提供掉帧实测，仅 +6 合成层，严重度应为 low。

---

## 116. [LOW / PARTIAL] SocialProofBar 铺 80 个 <a>+<img>、11708px 宽的常驻动画层，滚出视口后 marquee 也不停

- **维度**：运行时性能与移动端内存　**位置**：`src/components/home/SocialProofBar.tsx:14`
- **原始评级**：severity=medium confidence=high　→　**验证后**：low

**证据**

SocialProofBar.tsx:14 `const REPEAT_COUNT = 4;`，:33 `Array.from({length: 4}, () => logoItems).flat()`，然后 :58 和 :80 各渲染一遍（无缝双轨）——10 个 logo × 4 × 2 = **80 个 Link + 80 个 Image**。实测首页 `document.images.length === 85`、`<a>` 100 个。

CDP LayerTree 在手机端拿到一个 **11708×33** 的合成层，是页面上最宽的一个层。globals.css:1364-1366 `.animate-marquee{ animation: marquee 60s linear infinite }` —— 没有任何视口门控，实测 hero 区滚出视口后仍在 running。

源码注释写「10 个 logo × 4 重复 → 轨道宽度覆盖 4K (3840px)」，但双轨结构本身已经把宽度翻倍了，4 重复实际给出 ~11.7k px 轨道，远超需求。

（网络侧没问题：实测只有 7 个图片请求，重复 logo 走缓存，字体 4 个共 134KB。）

**影响**

160 个 DOM 节点 + 一个 11708px 宽的常驻纹理，全部为一条装饰性 logo 跑马灯服务，且在用户早已滚过去之后继续消耗合成器。手机端这是仅次于 BlueprintObject 的常驻层开销。

DOM 侧还有一个次要后果：80 个 next/image 各自挂 load/error 监听（实测 `el:load` 86 个），首页 hydration 要处理的元素凭空多出一大截。

**修复建议**

1. `REPEAT_COUNT` 从 4 降到 2（双轨结构下 2 重复 = 20 logo/轨 ≈ 3200px，仍覆盖绝大多数视口；真要保 4K 就按 `min-width` 断点在 CSS 侧补一份）。节点直接砍半。
2. 给外层容器加视口门控：`AnimateOnScroll` 已在这个 section 里用了，可以顺手把 `useIntersectionVisible` 的结果透到轨道上 → 不可见时 `animationPlayState: 'paused'`。约 10 行。

**验证过程**：节点事实属实：SocialProofBar.tsx:14 REPEAT_COUNT=4、:33 flat、:58/:80 双轨各渲染一遍 = 10 logo×4×2 = 80 Link + 80 Image；globals.css:1364-1366 marquee 60s infinite 无视口门控（RM 块 1513 只管 reduced-motion），滚出视口不停属实。但「4 重复远超需求/双轨已翻倍」的推理有误：无缝 marquee 的覆盖要求作用于**单轨**（第二轨是回绕副本），单轨 = 4×~1463px ≈ 5854px，覆盖 4K(3840) 需 ≥3 重复——建议的 REPEAT_COUNT=2 单轨仅 ~2927px，在 3440 超宽/4K 视口会露出空档，直接破坏源码注释声明的 4K 覆盖意图。另外发现 1 的消融自证「只关 marquee 无改善」——marquee 是平坦元素上的单条 translateX 合成器动画，主线程成本≈0，剩余代价是 DPR3 纹理内存与 hydration 节点量，严重度应降为 low。

**⚠️ 验证修正**：80 节点与不停播属实，但 REPEAT_COUNT=4 并非「远超需求」：无缝双轨下单轨须 ≥ 视口宽，覆盖 4K 需 ≥3 重复，直接降到 2 会在 ≥2927px 视口露空档；可行的只有视口外 pause 门控与按断点分档 repeat。且 marquee 是合成器动画（发现 1 的消融亦证明其不占主线程），实际代价限于纹理内存与 hydration 量。

---

## 117. [LOW / CONFIRMED] pointer-tilt-engine 缺 blur / visibilitychange 兜底，Cmd-Tab 离开后卡片和按钮的倾角冻在最后姿态

- **维度**：运行时性能与移动端内存　**位置**：`src/lib/pointer-tilt-engine.ts:188`
- **原始评级**：severity=medium confidence=high　→　**验证后**：low

**证据**

pointer-tilt-engine.ts:188-193 只注册了四个监听：
```js
window.addEventListener('pointermove', onMove, { passive: true });
document.documentElement.addEventListener('pointerleave', onLeave, { passive: true });
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onResize);
```
对比 WallBricks.tsx:254-259 明确处理了同一个问题并写了注释：「Cmd-Tab / 切 tab / 原生对话框夺焦一般不触发 pointerleave——失焦与页面隐藏同样视为『指针离场』，防坑滞留在陈旧位置」，并注册了 `window.blur` + `document.visibilitychange`。引擎侧没有同款兜底。

**影响**

用户把鼠标停在一张 interactive 卡上然后 Cmd-Tab 切走，回来时那张卡（或按钮）仍保持 ≤2.5°/≤4° 的倾斜姿态，直到下一次 pointermove 才归位。是观感 bug 不是性能 bug，但同一个坑 WallBricks 已经踩过并修好了，引擎抽取时漏掉了。

次要影响：倾斜态元素会一直保持内联 transform（合成层不释放）。

**修复建议**

在 startEngine 里补两个监听，复用现成的 `onLeave`：
```js
const onBlur = () => onLeave();
const onVisibility = () => { if (document.visibilityState === 'hidden') onLeave(); };
window.addEventListener('blur', onBlur, { passive: true });
document.addEventListener('visibilitychange', onVisibility, { passive: true });
```
并在 `stopEngine` 里对称移除。约 8 行。

**验证过程**：pointer-tilt-engine.ts:188-193 核实只注册 pointermove/pointerleave/scroll/resize 四个监听，无 blur/visibilitychange；WallBricks.tsx:254-259 确有同款兜底且注释原文与发现引用一致（「Cmd-Tab…防坑滞留在陈旧位置」）——引擎自 ButtonTilt 抽取时漏带该兜底属实。但影响是纯观感小 bug：切回后卡片保持 ≤2.5°/按钮 ≤4° 倾斜，任一 pointermove 即恢复，用户回到页面几乎必然动鼠标，实际可感知窗口极短。发现自己也承认「观感 bug 不是性能 bug」，medium 偏高，降为 low。

**⚠️ 验证修正**：问题与证据完全属实，但严重度应为 low：倾角冻结在下一次 pointermove 即自愈，真实用户可感知窗口极短。

---

## 118. [LOW / PARTIAL] 首页同时 SSR 输出桌面与移动两套 BlueprintObject SVG，另一套 display:none 常驻 DOM

- **维度**：运行时性能与移动端内存　**位置**：`src/components/home/HomeHero.tsx:113`
- **原始评级**：severity=medium confidence=high　→　**验证后**：low

**证据**

HomeHero.tsx:113-130 两个变体都无条件渲染，靠 CSS 显隐：
```jsx
<div className="hero-tilt hidden lg:block">
  <HeroObjectPhysics><BlueprintObject /></HeroObjectPhysics>
</div>
<div className="mt-2 lg:hidden">
  ... <BlueprintObject variant="mobile" /> ...
</div>
```
从预渲染的 `.next/server/app/index.html` 量到：`.bp-object-root` 出现 2 次（DOM 区）；桌面变体区间 ~30.4KB HTML / 259 个标签 / 126 个 `<path>`，移动变体区间 ~15.3KB / 139 个标签 / 54 个 `<path>`。

首页 HTML 总计 275KB（其中 155KB 是 `self.__next_f.push` 的 RSC flight payload，把整棵树又序列化了一遍），gzip 后 28KB。

**影响**

手机要下载、解析、并常驻持有 259 个永远看不见的桌面物件节点（外加 RSC payload 里的第二份）；桌面反过来持有 139 个看不见的移动节点。display:none 子树不参与 layout/paint，CSS 动画也不 tick，所以运行时开销接近零——**代价纯粹是 HTML 体积 + DOM 节点常驻内存 + hydration 遍历量**。

影响量级中等（gzip 后差不多多 ~8KB 传输 + ~260 节点），但对一个「首屏只有 hero + logo 条」的极简首页来说，这是全站最大的一笔纯浪费。

**修复建议**

两条路，按对 SSR 的态度选：
1. **保 SSR 不变，接受现状**——这是当前定案（HomeHero.tsx:107-111 注释明确说移动变体是「纯 Server 静态场景」以避免双份 client 实例）。如果只想省节点，可以把两套变体的几何合并成同一套 DOM + CSS 变量控制尺寸/布局（VARIANTS 里 `modules/seams/frontEtch` 已经是数据驱动的，合并成本主要在蚀刻表差异）。改动大，收益中等。
2. **牺牲桌面 hero 的 SSR**：把 `hidden lg:block` 那一支换成一个读 `matchMedia('(min-width:1024px)')` 的 client 壳，未命中就不渲染。桌面 hero 物件是 `aria-hidden` 纯装饰、且不是 LCP 元素，延后到 hydration 后出现不影响 SEO 与 LCP。约 20 行。
建议先做 F1/F2（收益大得多），这条列为后续优化。

**验证过程**：HomeHero.tsx:113-130 核实：桌面（hidden lg:block）与移动（lg:hidden）两套 BlueprintObject 确实都无条件 SSR，靠 CSS 显隐。但 105-112 的注释表明移动变体走纯 Server 静态是有意决策（避免双份 client 实例），双 DOM 是「SSR + 响应式 + 无 JS 依赖」的标准代价而非疏漏；发现自己也承认 display:none 子树不参与 layout/paint、CSS 动画不 tick、运行时开销接近零。剩余代价 = gzip 后 ~8KB + ~260 常驻节点 + hydration 遍历量（体积数字未逐字节复核但量级与标签数吻合），对极简首页是可量化但很小的成本。这是优化机会不是缺陷，medium 夸大。

**⚠️ 验证修正**：事实属实但定性应调整：这是代码注释里写明的有意 SSR 权衡（移动变体纯 Server 静态），隐藏子树零运行时开销，实际代价仅 HTML 体积 + 节点常驻内存，严重度 low，列为后续优化项即可。

---

## 119. [LOW / CONFIRMED] useIntersectionVisible 一次性语义却触发后不 disconnect，观察器活到组件卸载

- **维度**：运行时性能与移动端内存　**位置**：`src/hooks/useIntersectionVisible.ts:19`
- **原始评级**：severity=low confidence=high　→　**验证后**：low

**证据**

useIntersectionVisible.ts:19-27：
```js
const observer = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) setIsVisible(true);   // ← 没有 observer.disconnect()
}, { threshold });
observer.observe(el);
return () => observer.disconnect();
```
注释第 4 行写明「元素进入视口后 isVisible 置 true（**一次性，不回退**）」，但 observer 从未提前停。对比 useDeferredReveal.ts:36-38 就正确地在触发后 `observer.disconnect()`。

消费方 StatCard.tsx:56 每张统计卡一个，about 页多张。

**影响**

每张 StatCard 在整个页面生命周期里持续接收 intersection 回调（每次跨阈值一次），回调里 `setIsVisible(true)` 会被 React bail out 掉，所以没有可见 bug——纯粹是白留的观察器和白跑的回调。量级很小（每页个位数个），但与同目录另一个 hook 的写法不一致。

**修复建议**

回调里加一行：
```js
if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); }
```
1 行。

**验证过程**：useIntersectionVisible.ts:19-27 核实：回调只 setIsVisible(true) 无 disconnect，注释确写「一次性，不回退」；对比 useDeferredReveal.ts 确在触发后 observer.disconnect()（读了源码 33-38 行区）。消费方核实为 StatCard.tsx:48（发现写 :56，行号小误）。后续回调被 React bail out、无可见 bug、每页个位数实例——影响与发现自述一致，low 恰当，修复是 1 行。

**⚠️ 验证修正**：消费方行号应为 StatCard.tsx:48（非 56），其余描述准确。

---

## 120. [LOW / CONFIRMED] 倾斜引擎的 scroll handler 无条件 kick() 一帧 rAF，即使所有 entry 都已归零静止

- **维度**：运行时性能与移动端内存　**位置**：`src/lib/pointer-tilt-engine.ts:172`
- **原始评级**：severity=low confidence=high　→　**验证后**：low

**证据**

pointer-tilt-engine.ts:172-176：
```js
const onScroll = () => {
  for (let i = 0; i < entries.length; i++) entries[i].rect = null;
  zeroTargets();   // 内部又遍历一遍 entries
  kick();          // ← 无条件；即使没有任何 entry 被 wake
};
```
`zeroTargets()`→`wake(e)`（:109-117）只在目标与当前值差 > REST_EPS 时才把 `settled` 置 false。当页面上所有卡片/按钮本来就是零倾角（最常见状态）时，没有任何 entry 被唤醒，但 `kick()` 仍然起一帧 rAF，`frame()` 跑完两趟 O(N) 循环发现 `anyActive === false` 再停。

N = 当前页 interactive 卡 + 按钮，实测 products 页 6 个 card-tilt + 若干 btn-tilt，量级 10–20。

**影响**

滚动期间每个 scroll 事件多一次「遍历 N 次 + 起一帧 rAF + 再遍历 N 次」的空转。绝对量很小（几十次乘加），但滚动是全站最频繁的高频路径，而且这段本可以零成本。

**修复建议**

让 `zeroTargets()` 返回是否唤醒了任何 entry，`onScroll` 据此决定要不要 kick：
```js
function zeroTargets() { let woke = false; for (...) { ...; const was = e.settled; wake(e); if (was && !e.settled) woke = true; } return woke; }
const onScroll = () => { for (...) entries[i].rect = null; if (zeroTargets()) kick(); };
```
约 6 行。

**验证过程**：pointer-tilt-engine.ts:172-176 核实：onScroll 先遍历清 rect、再 zeroTargets()（内部又遍历一遍且不返回是否唤醒）、然后无条件 kick()；wake()（109-117）只在偏差 > REST_EPS 时置 settled=false，全静止时确实没有 entry 被唤醒但仍起一帧 rAF，frame() 里 settled 的 entry 被 continue 跳过、anyActive=false 后停。空转成本 = 每个 scroll 事件两趟 O(N) + 一帧 rAF 内一趟 O(N)，N≈10-20，绝对量极小。发现描述准确、severity low 恰当。

---

## 121. [LOW / CONFIRMED] TextReveal 给每个未入场的词 span 常驻 will-change: opacity, transform, filter，与 AnimateOnScroll 明确写下的判断自相矛盾

- **维度**：运行时性能与移动端内存　**位置**：`src/components/shared/TextReveal.tsx:62`
- **原始评级**：severity=low confidence=medium　→　**验证后**：low

**证据**

TextReveal.tsx:62：
```js
willChange: isVisible ? 'auto' : 'opacity, transform, filter',
```
对比 AnimateOnScroll.tsx:45-46 的注释：「**不写 will-change**：整页十几个未入场 wrapper 同时持有合成层提示得不偿失」。同一个团队、同一天前后的两个组件，对同一件事给出了相反的结论。

TextReveal 目前只在 CTABanner.tsx:37 用一处（CTA 标题），词数不多；但它是导出的公共组件，任何人拿去包一段长文案就会得到几十个常驻 will-change 的 span。

**影响**

当前实际影响很小（一处使用、词数少）。但 `will-change` 在元素隐藏期间就把合成层提示挂上，浏览器可能提前分配层；且 CTABanner 出现在多个页面上，每页都有一份。真正的问题是纪律不一致——将来复用会放大。

**修复建议**

删掉这行 `willChange`（与 AnimateOnScroll 对齐），或改成只在过渡进行中挂（`onTransitionEnd` 清掉）。删除是 1 行改动，视觉零差异（500ms 的 opacity/transform/filter 过渡不需要提前提示）。

**验证过程**：TextReveal.tsx:62 核实 willChange: isVisible ? 'auto' : 'opacity, transform, filter' 属实；AnimateOnScroll.tsx:45-46 注释「不写 will-change：整页十几个未入场 wrapper 同时持有合成层提示得不偿失」属实，两组件对同一问题结论相反的「纪律不一致」定性成立。grep 全库确认 TextReveal 当前仅 CTABanner.tsx:37 一处消费（词数少），当前实际影响小、放大风险在于公共组件复用——与发现自评一致，low 恰当。

---

## 122. [LOW / CONFIRMED] resize 后 build() 全量重造整个砖阵，超大视口下是一次 700–2700 个 div 的长任务

- **维度**：运行时性能与移动端内存　**位置**：`src/components/shared/WallBricks.tsx:122`
- **原始评级**：severity=low confidence=medium　→　**验证后**：low

**证据**

WallBricks.tsx:122-139，`build()` 无条件清空并重建：
```js
grid.textContent = '';
bricks = []; lastW = [];
const frag = document.createDocumentFragment();
for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { ... }
grid.appendChild(frag);
```
由 onResize（:262-270）经 200ms 防抖调用。窗口尺寸只变了 1px、或者只是滚动条出现/消失，也会把全部砖块删掉重造。

在 2160×3840 档这是一次性创建 2691 个元素 + 一次全量 layout。

**影响**

拖拽窗口尺寸时，每次停顿 200ms 后一次长任务（超大视口下估计 10–20ms 量级）。发生频率低、且防抖已经挡住了连续触发，所以严重度低。但它与 F3 是叠加的：砖数越失控，这次重建越贵。

**修复建议**

两个方向：
1. 加一道短路——`if (newCols === cols && newRows === rows && newPitch === pitch) return;`（3 行，挡掉滚动条出现之类的无效重建）。
2. 增量增删行/列而非全量重造（改动较大，只在 F3 修不掉砖数时才值得）。
建议先做 1。

**验证过程**：WallBricks.tsx:122-139 核实 build() 无条件 grid.textContent='' 清空后全量重建，onResize（262-270）200ms 防抖后调用，无「尺寸未变则短路」判断——滚动条出现/1px 抖动也触发全量重造属实。频率低 + 防抖已挡连续触发，一次性长任务量级 10-20ms 的估计合理，low 恰当。短路修复建议正确（注意 build 内 cols/rows/pitch 是重算前的旧值，实现时需先算新值再比较）。

---

## 123. [LOW / PARTIAL] 微信兼容用的 MutationObserver 监听全文档 style 属性 8 秒，桌面版微信浏览器下会被砖阵每帧的 21 次 style 写入反复唤醒

- **维度**：运行时性能与移动端内存　**位置**：`src/app/layout.tsx:87`
- **原始评级**：severity=low confidence=low　→　**验证后**：low

**证据**

layout.tsx:87 内联脚本：
```js
o.observe(document.documentElement, {childList:true, subtree:true, attributes:true, attributeFilter:['style']});
setTimeout(function(){o.disconnect()}, 8000);
```
只在 `/MicroMessenger/i` 命中时启用。

与之相撞的是 WallBricks.tsx:182-186 —— 井心附近的砖每帧被写 `style.transform` + `style.opacity`（实测 21–22 块），以及 build() 一次性 append 700+ 个带 inline style 的 div。两者都会被这个 observer 的 `attributeFilter:['style']` / `childList` 捕获。

标为 low confidence：**Windows 桌面版微信浏览器是否满足 `(hover:hover) and (pointer:fine)` 我没有真机验证**。手机版微信不满足门控，砖阵不建，这条不成立。

**影响**

若桌面微信确实通过门控：开局 8 秒内，observer 每帧被 21 次属性变更唤醒一次回调（回调里对每个 target 做 tagName 判断，非 IMG 直接返回，成本很低），外加 build 时一次 700 addedNodes 的遍历（每个 node 走一次 `querySelectorAll('img')`）。绝对成本不高，但正好落在首屏 hydration 最忙的 8 秒窗口内。

**修复建议**

若确认桌面微信会建砖：把 observe 目标从 `document.documentElement` 缩到 `document.body`，并在 WallBricks 的 `build()` 里把砖阵挂载推迟到 8s 之后（或反过来，让 observer 在 `.bp-wall` 上不生效——MutationObserver 无法排除子树，所以只能靠缩小 root）。更彻底的做法是把这个 hack 从「持续观察」改成「hydration 完成后扫一遍 img + 定时轮询 2 次」。约 10 行。
先做的事是验证：拿 Windows 微信打开站点，看 `.bp-brick` 是否 > 0。

**验证过程**：两侧代码均核实属实：layout.tsx:87 内联脚本 observe(documentElement, {childList,subtree,attributes,attributeFilter:['style']}) + 8s disconnect，仅 MicroMessenger UA 启用；WallBricks.tsx:182-186 井心附近砖每帧写 style.transform/opacity，build 一次性 append 数百带 inline style 的 div——碰撞机制在代码层成立。但成立前提（Windows 桌面微信内置浏览器满足 hover:hover and pointer:fine 且 UA 含 MicroMessenger）发现自己未验证、我也无法在本环境验证；且砖阵是首次 pointermove 才懒建，8s 窗口内是否碰上取决于用户行为；回调体（tagName 判断即返回）成本极低。属「代码事实确凿、触发条件未证实、即便触发影响也很小」。

**⚠️ 验证修正**：两侧代码证据属实，但整条发现是未验证前提下的条件性碰撞：需 Windows 桌面微信同时满足 hover+fine 门控才成立，且砖阵懒建（首次 pointermove 后）进一步缩小 8s 重叠窗口，回调成本极低——先真机验证再谈修复的建议是对的。

---

## 124. [LOW / CONFIRMED] v3.1 spec 自己第 97 行宣告「互质措辞已作废」，第 160 行仍写着「周期 ≥9s 互质错峰」

- **维度**：僵尸代码与文档漂移　**位置**：`docs/superpowers/specs/2026-07-27-blueprint-object-v3.1-nameplate-living-traces-design.md:160`
- **原始评级**：severity=medium confidence=high　→　**验证后**：low

**证据**

同一文件：第 97-101 行「⚠️ **「互质」措辞已作废（第二轮审查发现）**：gcd(9,15)=3，A/D 的 LCM 仅 45s... **改任一 dur/delay 必须重跑碰撞实算**，按「互质所以安全」推会造出每 45s 必现的固定碰撞」；第 160 行（白名单条目）却仍是「实施修订见 §2.1）、头 α≤0.85、零 blur；**周期 ≥9s 互质错峰**、」。审查结论只回写了 §2.1 与 CLAUDE.md 第 286 行，漏了本文件的白名单段。

**影响**

改 trace-pulse 参数的人若先读到第 160 行的白名单摘要（那是最常被当速查表用的一段），就会拿「互质所以安全」当判据，落进 spec 自己第 97 行警告的那个每 45 秒固定碰撞的坑 —— 而 CLAUDE.md 明写「改 dur/delay 必须重跑碰撞实算」。

**修复建议**

把第 160 行改为「周期 ≥9s **各异（非两两互质，见 §2.1 碰撞实算）** + delay 实算错峰」。改动量：1 分钟。

**验证过程**：读了 v3.1 spec：第 96-101 行「互质措辞已作废…按互质所以安全推会造出每 45s 必现的固定碰撞」原文属实；第 ~160 行白名单条目仍写「周期 ≥9s 互质错峰」属实——同一文件自相矛盾成立。另核实 CLAUDE.md §6 与 globals.css:1119 的 trace-pulse 措辞均已改为「非两两互质」，即最常用的两处速查源是对的，只有 spec 自己的白名单段漏改。

**⚠️ 验证修正**：问题属实但严重度降 low：CLAUDE.md §6 白名单（每 session 自动加载的真正速查表）与 globals.css 代码注释都已是修正后措辞，spec 内白名单段只是当时给 CLAUDE.md 的草稿文本漏改，实际被误读的概率低。

---

## 125. [LOW / PARTIAL] globals.css :root 里 21 个自定义属性零 var() 消费方，其中三个的「交叉锁定」理由已被注释自己否认

- **维度**：僵尸代码与文档漂移　**位置**：`src/app/globals.css:42`
- **原始评级**：severity=medium confidence=high　→　**验证后**：low

**证据**

逐个 grep `var(--x)` 命中数为 0 的：`--mat-face-base` / `--mat-face-shade` / `--mat-edge-strong` / `--mat-edge-faint` / `--mat-seam-glow` / `--mat-seam-soft` / `--mat-trace-pulse`（7 个），`--wall-face-lit` / `-lit-k` / `-tint` / `-shade` / `-shade-k` / `-edge` / `-edge-k`（7 个），`--wall-bed-base` / `-shade` / `-lit` / `-dark` / `-dark-t` / `-dark-k`（6 个），合计 20 个纯锚点 + `--wall-seam`（唯一消费方是 WallBricks.tsx:110 的 JS `getPropertyValue`，合法）。它们被注释解释为「TSX STROKE 表 / tile data-URI 的交叉锁定锚点，勿因未使用删除」。但注释自己承认锁已断：第 42-45 行 `--mat-face-base` —「本 token 已无消费方，仅存历史锚点身份」；第 46-52 行 `--mat-face-tint` —「v3 物件已提档 0.10–0.02，**本 token 档独立不随动**」；`--mat-face-shade: 0.32` 对应注释写的是「物件 right 面 v3 0.30–0.55 带内取值」，而 `.bp-face-fill--right`（第 955 行）实际用 0.3→0.55 渐变，0.32 对不上任何一端。

**影响**

这些声明会进每一个页面的 CSS payload（约 1.4KB 未压缩），但真正起作用的只有「读注释的人」。更麻烦的是可信度：一个自称「交叉锁定锚点、改值两处同步」的 token 表里混着三个已经不同步的条目，下次有人拿它当权威去核对 STROKE 值就会得到错误结论 —— 锚点表一旦部分失真，整张表的价值归零。

**修复建议**

分类处理：① `--mat-edge-strong/-faint/-seam-glow/-seam-soft/-trace-pulse` 与 TSX 值确实一致（0.62/0.3/0.7/0.55/0.85），保留但把注释从「无消费方」改成「文档型 token，值与 BlueprintObject STROKE 表逐项对照」；② `--mat-face-base` / `--mat-face-shade` 锁已断且无消费方 —— 删掉，把对照关系写进 v3 spec §A.2 而不是 CSS；③ `--wall-*` 十三个 tile 锚点：与其留在 :root 假装是 token，不如在 tile data-URI 上方用一段注释表列出「字面值 ↔ 语义」，删掉声明。改动量：30 分钟（含重跑一次视觉自检确认零外观变化）。

**验证过程**：逐 token grep var() 消费：20 个零消费 + --wall-seam 仅 WallBricks.tsx JS 读取 + --mat-face-tint 有 1 个消费方（globals.css:587 btn-secondary），零引用事实全部属实。但读了 globals.css 42-58 行注释与 CLAUDE.md §4：CLAUDE.md 明写「勿因『未使用』删除——它们是 TSX STROKE 表的交叉锁定锚点」，保留是显式定案；且 --mat-face-shade 的注释原文是「0.30–0.55 带内取值」——0.32 在带内，注释自洽，发现所称「0.32 对不上任何一端」是误读（注释从未声称匹配端点）。face-base/face-tint 的「锁已断」也是注释自己诚实披露的，读注释的人不会被误导。

**⚠️ 验证修正**：零消费事实成立，但「锚点表部分失真会误导核对者」的论证不成立：三处所谓失真都是注释自己明文披露的（face-base「仅存历史锚点身份」、face-tint「档独立不随动」、face-shade「带内取值」自洽），且 CLAUDE.md 显式禁止因未使用而删除。剩余实质问题只有 ~1.4KB 无功能 CSS payload，属已定案的文档化取舍，降 low。

---

## 126. [LOW / PARTIAL] TECH_BRAND_COLORS 18 个键里 11 个从无数据引用，同时 6 个真实 techStack 值拿不到品牌色（'AWS S3' 匹配不上 'AWS'）

- **维度**：僵尸代码与文档漂移　**位置**：`src/lib/tech-brand-colors.ts:5`
- **原始评级**：severity=medium confidence=high　→　**验证后**：low

**证据**

把 case-studies.ts 全部 techStack 值抽出比对：实际用到的 13 个 = AWS S3 / Email Automation / Gemini AI / Next.js / Node.js / OCR / PDF.js / PostgreSQL / React / SEO / Tailwind CSS / TypeScript / Vercel。TECH_BRAND_COLORS 里**永不命中**的 11 个键 = Python / MongoDB / Redis / AWS / Docker / Firebase / Supabase / Stripe / OpenAI / GraphQL / Prisma。反向：**拿不到品牌色**的 6 个值 = AWS S3 / PDF.js / Gemini AI / Email Automation / SEO / OCR。TechStackBadges.tsx:26 `const brandColor = TECH_BRAND_COLORS[tech]` 是精确键匹配，`'AWS S3' !== 'AWS'` 所以静默 undefined，第 31-37 行不下发 `--brand-border`，hover 边框回落到 `var(--border-heavy)`。

**影响**

两头都是残留：11 个键是早期技术栈清单的化石（Stripe/Prisma/MongoDB 这些本项目从没用过）；而 'AWS S3' 这条是**功能性静默降级**——数据层写 'AWS S3' 的人以为会有 AWS 橙，实际全站看不出差别，也不会报错。整个文件被 CLAUDE.md 列为「禁止硬编码 hex 的唯一豁免区」，一份半数条目是死的白名单削弱了这条纪律的说服力。

**修复建议**

① 删掉 11 个死键（或明确注释为「预留，未来技术栈」）；② 决定 'AWS S3' 的归宿：要么把数据层改成 'AWS'，要么在表里加 `'AWS S3': '#ff9900'`；③ 给 Gemini AI / PDF.js / OCR / SEO / Email Automation 补色或明确接受无色降级并在文件头注明。改动量：10 分钟。

**验证过程**：读了 tech-brand-colors.ts 全文（18 键）并用 node 脚本抽取 case-studies.ts 全部 techStack 值（13 个）交叉比对：11 个死键（Python/MongoDB/Redis/AWS/Docker/Firebase/Supabase/Stripe/OpenAI/GraphQL/Prisma）与 6 个无色值（AWS S3/PDF.js/Gemini AI/Email Automation/SEO/OCR）完全属实；TechStackBadges.tsx:26 精确键匹配、undefined 时回落 --border-heavy 也属实，且它是 TECH_BRAND_COLORS 唯一消费方。但真实用户影响仅是 6 个徽章 hover 边框缺品牌色（纯装饰细节），medium 夸大。

**⚠️ 验证修正**：事实全部属实，但严重度降 low：功能性影响只是详情页技术徽章 hover 时边框用默认蓝而非品牌色的静默降级，用户几乎不可感；死键是纯僵尸清单，无运行时代价。

---

## 127. [LOW / CONFIRMED] API 的 ALLOWED_SOURCES 白名单里 'contact' 与 'cta' 已无任何发送方，是被删除的内联 CTA 表单的残留

- **维度**：僵尸代码与文档漂移　**位置**：`src/app/api/contact/route.ts:56`
- **原始评级**：severity=low confidence=high　→　**验证后**：low

**证据**

`const ALLOWED_SOURCES = ['contact', 'contact-page', 'cta'] as const;`（第 56 行）。全库 grep `source:` 只有一处发送方：`src/components/shared/ContactForm.tsx:52` → `body: JSON.stringify({ ...form, source: 'contact-page' })`。ContactForm 是全站唯一表单（CLAUDE.md：「表单是全站唯一联系入口」），route.ts 第 195-196 行的注释也承认「mini/inline 变体已于表单 v2 删除」。'cta' 对应的是已删除的 CTABanner 内联表单，'contact' 对应更早的表单版本。

**影响**

无功能损害（非法值走第 193 行降级为 'contact'），但通知邮件里的 Source 字段永远只会是 contact-page，白名单给出「站内有三种提交来源」的假象。将来做归因分析的人会去找不存在的 cta 表单。

**修复建议**

收成 `const ALLOWED_SOURCES = ['contact-page'] as const;`，或干脆删掉 source 机制（单表单站点它没在提供信息）。若保留，把降级默认值同步改成 'contact-page'。改动量：3 分钟。

**验证过程**：读了 route.ts:56 的 ALLOWED_SOURCES = ['contact','contact-page','cta'] 与第 193 行降级到 'contact' 的逻辑；grep 全库 source: 发送方只有 ContactForm.tsx:52 的 'contact-page' 一处；route.ts 195-196 行注释确认 mini/inline 变体已删。'contact' 与 'cta' 确为死枚举值，无功能损害的判断也准确。

---

## 128. [LOW / PARTIAL] SectionTitle 的 align prop 与 size="lg" 档从未被使用过，是标题三档制改革后的空壳 API

- **维度**：僵尸代码与文档漂移　**位置**：`src/components/shared/SectionTitle.tsx:23`
- **原始评级**：severity=low confidence=high　→　**验证后**：low

**证据**

第 22-24 行声明 `size?: 'lg' | 'md' | 'sm'` 与 `align?: 'center' | 'left'`。全库 grep `<SectionTitle` 的调用点（about ×4 / products ×1 / brokerage-platform ×3 / real-estate ×1 / FeaturedWork / ProcessStrip / InDevelopmentShowcase / TextListSection / contact ×1）：**唯一**传 size 的是 `contact/page.tsx:185` 的 `size="sm"`；`align=` 零命中。组件文件头第 5-7 行自己写道「页级（display / 居中）：页面 h1 专属，由 PageHero / CTABanner 承担，**不走本组件**——lg 档保留只为极窄的例外，正常页面不该出现」。

**影响**

`SIZE_CLASS.lg`（`text-display` + `mb-16`）和整条 align 分支是永不执行的代码路径，且 align='center' 与文件头「居中只留给页面 hero 与 CTA」的纪律直接抵触——它是个「留着就迟早有人用」的破口，用了就违反 IA v1 的层级纪律。

**修复建议**

删 `align` prop（内部固定 text-left，需要居中的场景一律用 PageHero/CTABanner），删 `SIZE_CLASS.lg` 与联合类型里的 'lg'。这同时把「默认值方向即纪律」从注释变成类型强制。改动量：10 分钟（含全库编译验证）。

**验证过程**：grep 全部 15 个 <SectionTitle 调用点：size 只有 contact/page.tsx:185 传 'sm'，align 零使用——零使用事实属实。但读了组件文件头 5-10 行：「lg 档保留只为极窄的例外」「仪式感必须显式索取（size="lg" / align="center"）」——lg 与 align 的保留被文件头明文记录为 IA v1 的刻意 API 设计（默认值方向即纪律，例外须显式索取），不是遗留空壳。

**⚠️ 验证修正**：「从未被使用」属实，但「空壳 API/破口」的定性不准：文件头明文记录 lg 档与 align="center" 是刻意保留的显式索取通道（IA v1 定案「默认值方向即纪律」），删除是可辩论的收紧建议而非清理僵尸代码。

---

## 129. [LOW / CONFIRMED] 三个组件 prop 声明后从未被调用方传值：CaseStudyCard.action / CropMarks.className / ProcessStep 与 RealEstateSite 接口只在本文件用

- **维度**：僵尸代码与文档漂移　**位置**：`src/components/products/CaseStudyCard.tsx:19`
- **原始评级**：severity=low confidence=high　→　**验证后**：low

**证据**

① `CaseStudyCard.tsx:19` `action?: string`（默认 'View'）——两个调用点（products/page.tsx:68、FeaturedWork.tsx:41）都不传；② `CropMarks.tsx:5` `className?: string`——唯一调用点 `Card.tsx:67` 是裸 `<CropMarks />`；③ `src/data/process.ts:6` `export interface ProcessStep` 与 `src/data/real-estate.ts:7` `export interface RealEstateSite` 都 export 了，但全库 grep 显示只在各自文件内被 `const xxx: T[] =` 用一次，没有任何外部 import（对比 `CaseStudy` 接口有 10 处外部引用）。

**影响**

都是极轻的 API 面虚胖，无运行时影响。价值在于：一个组件的 prop 表是它的契约文档，挂着三个从未兑现的可选项会让人误以为「这里设计过可配置」，从而在需要变化时先去找 prop 而不是重新设计。

**修复建议**

① action 与 className：确认无近期需求就删（各 1 行）；② 两个 interface 保持 export 也无妨（数据层类型对外公开是合理设计），但若追求零暴露面可以降为非 export 的 type 别名。改动量：5 分钟。

**验证过程**：①grep 两个 CaseStudyCard 调用点（products/page.tsx:68、FeaturedWork.tsx:41）均不传 action，grep 'action=' 全库零命中（表单除外）；②Card.tsx:67 是 CropMarks 唯一调用点且为裸 <CropMarks />；③grep 确认 ProcessStep 只在 process.ts 内使用、RealEstateSite 只在 real-estate.ts 内使用（CLAUDE.md 提到 RealEstateSite 接口但无代码外部 import）。三项均属实，低严重度恰当。

---

## 130. [LOW / CONFIRMED] v3.1 spec 状态仍写「待实施」（实际已实装并提交）；一份 brief 被误归档在 specs/ 目录

- **维度**：僵尸代码与文档漂移　**位置**：`docs/superpowers/specs/2026-07-27-blueprint-object-v3.1-nameplate-living-traces-design.md:3`
- **原始评级**：severity=low confidence=high　→　**验证后**：low

**证据**

① 该文件第 3 行：「日期：2026-07-27 ／ 状态：**定案，待实施（交接给新 session 执行）**」，但 `git log` 显示 commit 2499e43「feat(design): Blueprint Object v3.1 实装 — Archivo 铭牌三层叠印 + 间歇式活纹路三件套」已落地，BlueprintObject.tsx 文件头第 1-6 行也自述实现的是 v3.1；② `docs/superpowers/specs/2026-07-26-card-system-rework-brief.md` 文件名带 `-brief` 且开头写「执行 Brief（v7 候选）...供新 session 执行」，却放在 specs/ 而不是同级已存在的 briefs/（那里躺着 v4/v4.1/v4.2/wall-light 四份 brief）。

**影响**

① 「待实施」会让新 session 以为要去做已经做完的事，或者在核对现状时把 spec 当作「未来计划」而非「现行事实」；② 目录分类失效后，「specs/ = 定案、briefs/ = 任务书」的约定没法被信任，找文档要两个目录都翻。

**修复建议**

① 把状态改成「已实装（commit 2499e43）」；② `git mv docs/superpowers/specs/2026-07-26-card-system-rework-brief.md docs/superpowers/briefs/` 并更新 v7 spec 第 4 行对它的引用路径。改动量：5 分钟。

**验证过程**：①v3.1 spec 第 3 行原文「状态：定案，待实施（交接给新 session 执行）」属实；git log 近期提交含 2499e43「v3.1 实装」，BlueprintObject.tsx 文件头 1-6 行自述实现 v3.1——已实装属实；②ls 确认 docs/superpowers/briefs/ 存在且有 4 份 brief，而 2026-07-26-card-system-rework-brief.md（开头自称「执行 Brief…供新 session 执行」）确在 specs/ 目录。两项归档漂移均属实。

---

## 131. [LOW / CONFIRMED] brokerage-platform 页文件头规则 ④ 禁用完成时态，正文却用了两处完成时态描述在建能力

- **维度**：僵尸代码与文档漂移　**位置**：`src/app/(public)/products/brokerage-platform/page.tsx:179`
- **原始评级**：severity=low confidence=medium　→　**验证后**：low

**证据**

文件头第 17-18 行规则 ④：「在建产品时态：能力描述一律名词式规格或 "designed to / being built to"，**禁用「系统已经在做 X」的完成时态叙述**」。正文第 178-179 行：「**Our ingestion pipeline runs** the full standard exchange — sign in, list, retrieve, store — and then **does** the two things a broker actually feels」；第 188 行：「**We built support** for all five eDocs segments in personal lines」。而同页 CAPABILITIES 数组（第 64/69/84 行）严格遵守规则，用的是 "AI is designed to read" / "is being built to" / "the same system is being built to"。

**影响**

eDocs 摄取管线确实跑通了阶段 1 测试（第 210-217 行的 42 封样本批实测），所以这两句大概率是**有意的例外**——已验证的东西用完成时是诚实的。但文件头规则写死了「一律」「禁用」，没有为已验证模块开口子。下一个改这页文案的人只有两种解读，二选一都会出错：按规则把这两句改成 designed to（把已验证的成绩说弱了），或者以此为先例把在建能力也写成完成时（踩 CSIO 事实红线）。

**修复建议**

给规则 ④ 加一句边界：「例外：已完成官方测试并有实测证据的模块（当前仅 eDocs 摄取管线阶段 1）可用完成时，但必须与认证状态段同屏出现」。改动量：2 分钟。

**验证过程**：读了 brokerage-platform/page.tsx：文件头 17-18 行规则④「能力描述一律…禁用完成时态」原文属实；正文 ~178 行「Our ingestion pipeline runs…and then does」与 ~188 行「We built support for all five eDocs segments」两处完成/现在时属实；CAPABILITIES 数组（60-90 行区间）确用 designed to / being built to。eDocs 管线阶段 1 已实测（页面自有 42 封样本批段落），「大概率有意例外但规则未开口子」的分析成立。

---

## 132. [LOW / PARTIAL] CLAUDE.md 38KB 全量进每 session context，§6 动画白名单 10.6KB 是实现层微观数据，属 spec 内容

- **维度**：僵尸代码与文档漂移　**位置**：`CLAUDE.md:277`
- **原始评级**：severity=low confidence=medium　→　**验证后**：low

**证据**

实测分节字符数：§6 Animation Rules **10626 字符**、§4 Color System 7521、§5 Card System 5263、§7 Button 4011、§1 Project Structure 3722、§2 Design Concept 3014。§6 的 ALLOWED Animations 白名单（第 277 行起）逐条内嵌实现级数值：brick-well 一条就写了「下陷 ≤36px / 坡斜上限 20°（实际峰值 8.47° @56 档，随 pitch 降至 4.94° @96；衰减函数在 d≈50px 取极值）/ 向心聚拢 ≤3px / 微缩 ≤5% / 渐暗 ≤35% ... 角抬升力臂是半对角 37.12px ... 最坏角 z ≈ −23u² < 0」；trace-pulse 一条写了 dash/gap 数值、gcd(9,15)=3 的相位碰撞实算。这些在 v8 spec §6/§7 与 v3.1 spec §2 里都有正本。全文 12 行含「退役」字样，22 处引用 v3/v4/v4.1/v4.2/v5/v6 历史版本号。

**影响**

每个 session（含每个 subagent）都吃这 38KB。真正每次都需要的是「白名单里有什么、禁什么」；「8.47° 是在 d≈50px 取的极值」这类只有改 WallBricks 物理参数时才需要，而那时本来就会去读 v8 spec。历史考古（「v4.1 的 --btn-dy 双伪元素反向抵消已退役」「v5 四层遮掩机器已退役」）对新 session 是纯噪声——它们要的是现状，不是变迁史。

**修复建议**

把 §6 白名单每条压成「名称 — 一句话语义 + 硬上限 + 正本 spec 链接」两行内，实测数值/推导全部下沉到对应 spec（spec 本来就写了）。§4 的豁免枚举同理。目标：CLAUDE.md 压到 ~20KB。「退役」条款只保留仍有复活风险的（墙后光源、GlassCard、grid-line）；v4.1 级别的细节退役记录移到 spec。改动量：60–90 分钟，需逐条确认下沉后 spec 里确有对应正文。

**验证过程**：wc -c 实测 CLAUDE.md 38272 bytes，38KB 属实；python 分节测量确认 §6 是最大节（字符数 6569，字节数约合发现所称 10.6KB——发现把字节当字符报，量级方向正确）；§6 白名单内嵌实现级数值（8.47°、37.12px、gcd 实算等）属实。但「参数上限入册白名单」本身是 v3.1 spec 明文决策（「§6 白名单 +3 条（连参数上限一并入册）」），压缩建议与既有定案方向相抵，属可辩论的取舍提案而非漂移缺陷。

**⚠️ 验证修正**：数字口径修正：所报「字符数」实为 UTF-8 字节数（§6 实际约 6.6K 字符/10.6KB）。且白名单携带参数上限是 v3.1 spec 的显式定案（防止改参数时越过上限），「下沉到 spec」是与现行决策相反的优化建议，不是无主漂移。

---

## 133. [LOW / CONFIRMED] SiteHeader 在 <md 完全不渲染导航，移动端唯一导航是页脚

- **维度**：僵尸代码与文档漂移　**位置**：`src/components/layout/SiteHeader.tsx:51`
- **原始评级**：severity=low confidence=high　→　**验证后**：low

**证据**

第 51 行 `<div className="hidden md:flex items-center gap-8">` 包住整个 mainNav 循环，且组件内没有汉堡菜单/抽屉的任何代码。文件头第 4 行自述「精简版: Logo（左）+ 导航链接（右，仅桌面）/ 无 CTA / **无移动端菜单**」。移动端用户要跳 About/Our Work/Contact 只能滚到 SiteFooter（footerNav 复用同一数组）。

**影响**

这是被注释明确记录为有意为之的取舍，不是遗漏——所以严重度低。但它与「唯一转化目标 = Book a Free Consultation」（frontend-redesign spec §1）有张力：移动访客读完 Hero 后，去 /contact 的路径只有 Hero 里的 CTA 按钮，一旦滚过 Hero 就得滚到底。

**修复建议**

若认可现状，无需改（建议在 CLAUDE.md §1 或 spec 里把「移动端无 header 导航」升格为显式设计定案，避免下次审查反复提）；若要补，最轻的方案是 <md 时 header 右侧只留一个 Contact 文字链接，不做抽屉。改动量：15 分钟。

**验证过程**：读了 SiteHeader.tsx：第 51 行 hidden md:flex 包住全部导航属实，grep 确认组件内无任何 menu/drawer 代码；文件头第 4 行「无移动端菜单」自述属实。发现本身已正确标注这是注释记录的有意取舍并给出 low，判断与事实相符——移动端滚过 Hero 后确实只剩页脚导航。

---

## 134. [LOW / CONFIRMED] CaseStudyHero 内联了一份外链图标 SVG，与 shared/ExternalArrowIcon 职责重叠

- **维度**：僵尸代码与文档漂移　**位置**：`src/components/case-study/CaseStudyHero.tsx:61`
- **原始评级**：severity=low confidence=medium　→　**验证后**：low

**证据**

第 61-75 行内联 `<svg ...><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>`（box-with-arrow 外链图标）。`src/components/shared/ExternalArrowIcon.tsx` 已存在，其文件头第 3 行写「同一条 path 此前在 2 处内联逐字符重复（RealEstateShowcase / InDevelopmentShowcase）」——那轮去重漏了 CaseStudyHero。CLAUDE.md §5 有「禁止内联箭头 SVG」条款（虽然上下文是 CardActionRow）。

**影响**

两个字形不同（ExternalArrowIcon 是 ↗ 斜箭头，这里是「方框+箭头」），所以不是纯重复，但同一站点对「打开外部站点」用了两套图标语言。低影响，属收敛未尽。

**修复建议**

二选一：① 换成 `<ExternalArrowIcon className="w-3.5 h-3.5" />` 统一为斜箭头；② 若刻意保留方框语义，把它抽成 `shared/ExternalLinkBoxIcon.tsx` 并在两个图标的文件头互相注明分工。改动量：5 分钟。

**验证过程**：读了 CaseStudyHero.tsx 61-74 行：内联 box-with-arrow SVG（path M10 6H6…）属实；ExternalArrowIcon.tsx 存在且文件头自述「此前在 2 处内联逐字符重复」的去重轮次确未覆盖 CaseStudyHero；grep 确认 ExternalArrowIcon 消费方为 RealEstateSiteGrid/CsioMemberRow/CardActionRow。两个字形不同、非纯重复的描述也准确。

---

## 135. [LOW / CONFIRMED] CLAUDE.md §1 的 src/data/ 清单漏了 process.ts

- **维度**：僵尸代码与文档漂移　**位置**：`CLAUDE.md:17`
- **原始评级**：severity=low confidence=high　→　**验证后**：low

**证据**

第 17 行：「`src/data/` — TS 常量即内容层（非 CMS）：case-studies.ts（软件产品）/ real-estate.ts（地产盘）/ navigation.ts」。实际 `ls src/data/` 有四个文件，`process.ts` 未列。它不是无关紧要的：它是 IA v1 新建的双消费数据层（about 页 04 用 description、首页 ProcessStrip 用 summary），文件头第 1-4 行明写「两处消费同源，不复制第二份文案」。全文 grep `process.ts` / `processSteps` 在 CLAUDE.md 零命中。

**影响**

CLAUDE.md 的 Component Reuse Rules 要求「**ALWAYS** check src/data/ for existing data constants before hardcoding」，但清单不全 —— 要改流程文案的 agent 若只照清单看，会以为流程文案硬编码在 about 页里，从而在首页复制第二份（正是 process.ts 建立时要消灭的问题）。

**修复建议**

第 17 行补上 `/ process.ts（交付流程四步，about 详版 + 首页一句话版双消费）`。改动量：30 秒。

**验证过程**：ls src/data/ 确认四个文件含 process.ts；CLAUDE.md 第 17 行清单只列三个、grep process.ts/processSteps 在 CLAUDE.md 零命中，均属实；process.ts 文件头确写「两处消费同源…不复制第二份文案」，grep 确认 about/page.tsx:248 与 ProcessStrip.tsx:32 双消费。误导场景（照清单以为流程文案硬编码在 about）合理。

---

## 136. [LOW / PARTIAL] Organization JSON-LD 的 sameAs 指向 github.com/synthmind，无法从仓库确认该组织存在

- **维度**：僵尸代码与文档漂移　**位置**：`src/app/(public)/page.tsx:56`
- **原始评级**：severity=low confidence=low　→　**验证后**：low

**证据**

第 56 行 `sameAs: ['https://github.com/synthmind']`。本仓自身的 remote 是 `David-Xcode/SYNTHMIND.git`（个人账号，非 synthmind 组织）。仓库内没有任何其他地方引用 github.com/synthmind，也没有 GitHub 图标/链接出现在 header/footer。未联网验证该 org 是否存在。

**影响**

若该 GitHub 组织不存在或为空，sameAs 就是一条指向 404 的实体消歧信号。Google 对 sameAs 的处理是「用来确认实体身份」，指向死链最坏情况是这条信号被忽略，不会有惩罚——所以严重度低，但它是「写了就没人再看」的典型残留。

**修复建议**

打开 https://github.com/synthmind 确认；不存在则删掉 sameAs 字段（Organization schema 里它是可选的），或换成真实存在的品牌档案（LinkedIn 公司页 / CSIO 名录条目 —— 后者恰好已有常量 `CSIO_DIRECTORY_URL`，且是本站最有分量的第三方身份确认）。改动量：3 分钟。

**验证过程**：page.tsx:56 的 sameAs: ['https://github.com/synthmind'] 属实；curl 实测该 URL 返回 200——账号存在（发现未联网验证，假设可能 404）。GitHub API 显示它是 type=User 的个人账号「Synthmind」（2023-02 注册、0 个公开仓库、无 name/bio/blog），与本仓 owner David-Xcode 不同账号，无任何可见内容佐证它属于 Synthmind 公司。

**⚠️ 验证修正**：修正核心事实：github.com/synthmind 存在（HTTP 200），不是死链——但它是一个零仓库、零资料的个人 User 账号（可能是抢注名或早年保留名），作为 Organization 的 sameAs 实体消歧信号同样无价值甚至指向混淆。修复建议不变：删掉或换成 CSIO 名录/LinkedIn 等有内容的档案（若该账号确为 David 所有，也应先填充资料再引用）。

---

## 137. [LOW / CONFIRMED] 仓库无 README，新接手者的入口只有 38KB 的设计系统指令文件

- **维度**：僵尸代码与文档漂移　**位置**：`CLAUDE.md`
- **原始评级**：severity=low confidence=high　→　**验证后**：low

**证据**

`ls README*` → no matches。根目录文档只有 AGENTS.md（3.9KB，且如上所述七处过时）与 CLAUDE.md（38KB，全是设计系统纪律，零「这是什么项目/怎么跑起来」）。package.json 的 scripts 有 dev/build/start/lint/lint:fix/format，但没有任何地方说明本地起服务要什么环境变量（RESEND_API_KEY 只在 .env.example 里出现）。

**影响**

人类接手者（或未来的自己）没有一页纸能回答「这是什么、怎么跑、部署在哪、改内容改哪里」。目前这些知识全靠 CLAUDE.md + agent 记忆，一旦脱离 Claude Code 环境就断了。

**修复建议**

加一份 30 行 README：项目一句话定位、技术栈、`npm i && npm run dev`、必需环境变量（RESEND_API_KEY）、内容改动入口（`src/data/case-studies.ts` 加软件产品 / `src/data/real-estate.ts` 加地产盘）、部署（Vercel）、以及「UI 改动前先读 CLAUDE.md」。改动量：20 分钟。

**验证过程**：ls README* 零命中属实；根目录文档确仅 AGENTS.md（3927B，且七处过时已另行核实）与 CLAUDE.md（38KB 纯设计纪律）；package.json scripts 属实（dev/build/start/lint/lint:fix/format）；.env.example 存在且只有 RESEND_API_KEY 一行，与发现描述一致。仓库还是 public 的，无 README 对外观感也差。

---

## 138. [NONE / REFUTED] Card 的 static 与 container 两个变体渲染出完全相同的 class，是类型层的空区分

- **维度**：架构与 Next 16 用法　**位置**：`src/components/shared/Card.tsx:29`
- **原始评级**：severity=low confidence=high　→　**验证后**：none

**证据**

Card.tsx:52-60 只有 variant==='interactive' 才加 card-glass-interactive，static 与 container 走同一分支。组件自己的 JSDoc（:25-28）也承认「static 与 container 渲染出完全相同的 class，差异纯语义，错配不会被视觉信号暴露」。

**影响**

给使用者增加了一个无法验证、无反馈、错了也没后果的决策点。类型系统不能表达「这张卡内部有交互子元素」，注释也拦不住——它只是把一条文档约定伪装成了 API。

**修复建议**

要么合成一个 static 并把语义写进 JSDoc（减一个枚举值，改 6 处调用），要么让 container 真的产生差异（如默认 pad='none'、或跳过 accent 竖线），让错配可见。倾向前者。

**验证过程**：读 Card.tsx:52-60 与 JSDoc :25-28，事实引用无误（static/container 确实渲染相同 class）。但这是 CLAUDE.md §5 明文定案：「⚠️ static 与 container 渲染完全相同的 class——差异纯语义，错配无视觉信号，对着定义选」，并有 v7 spec 背书（2026-07-26-card-system-v7-glass-design）。发现本身也承认 JSDoc 已声明此设计。这是在重新审判一个有正本的显式设计决策（变体按交互语义而非视觉区分），不是缺陷。

**⚠️ 验证修正**：事实描述准确，但「类型层空区分」正是 v7 卡片系统的定案设计（变体=交互语义，不按视觉浓淡），CLAUDE.md 与组件 JSDoc 双处明文警示使用者对着定义选型——属设计立场分歧，非架构缺陷。

---

## 139. [NONE / REFUTED] suppressHydrationWarning 被当万金油：html、body 以及每一个 next/image 都挂了

- **维度**：架构与 Next 16 用法　**位置**：`src/app/layout.tsx:76`
- **原始评级**：severity=low confidence=medium　→　**验证后**：none

**证据**

layout.tsx:76 html、:79 body 各挂一次；SiteHeader:46、SiteFooter:28、CaseStudyCard:43、RealEstateSiteGrid:36、SocialProofBar:70/93、CaseStudyHero:28 的 <Image> 全部挂了 suppressHydrationWarning。

**影响**

该属性只对元素自身的属性/文本节点生效一层，挂在 <Image> 上几乎不产生作用，是仪式性代码；挂在 html/body 上则会真的吞掉未来任何真实的 hydration 不匹配告警——微信 WebView 那类问题正是靠这类告警才发现的，现在等于把探测器关了。

**修复建议**

保留 html/body 上的两处（微信改 DOM 属性确有需要，但补一行注释说明为何必须，避免被当成默认写法扩散），删掉全部 <Image> 上的 6 处。约 6 行删除。

**验证过程**：grep 全站 10 处 suppressHydrationWarning 位置属实，但两个核心论断都不成立：① React 的 suppressHydrationWarning 只作用一层（该元素自身的属性/文本），挂在 html/body 上并不会「吞掉未来任何真实的 hydration 不匹配告警」——子孙元素的 mismatch 照常报警；② 挂在 <Image> 上不是仪式性代码：prop 透传到渲染出的 <img> 元素，而根 layout 的微信 MutationObserver 脚本（layout.tsx:85-89）正是在 hydration 前改 img 的 style 属性——这恰好是该 prop 精确覆盖的「本元素属性 mismatch」场景，SiteFooter.tsx:3 注释也明示这是有意为之的微信兼容措施（项目记忆有 2026-07-26 真机踩坑记录）。

**⚠️ 验证修正**：Image 上的 suppressHydrationWarning 是功能性的微信 WebView 兼容代码（微信在 hydration 前改 img style 属性，prop 正好抑制该元素的属性 mismatch 告警），不是仪式；html/body 上的用法因「只作用一层」也不构成全局探测器关闭。发现的两个影响论断方向都反了。

---

## 140. [NONE / CONFIRMED] 每个 AnimateOnScroll 各建一个 IntersectionObserver，单页最多约 20 个观察器

- **维度**：构建配置与交付　**位置**：`src/hooks/useDeferredReveal.ts:36`
- **原始评级**：severity=low confidence=high　→　**验证后**：none

**证据**

useDeferredReveal.ts:36-45 在每个消费组件的 useEffect 里 `new IntersectionObserver(...)` + `observer.observe(el)`。实测渲染 HTML 中 `sheet-reveal` 出现次数：/about 20、/products/brokerage-platform 17、/ 16、/products 11、/contact 8。另外 line 31 每个实例都调 `el.getBoundingClientRect()`。

**影响**

20 个独立 observer 各自维护回调与阈值队列，比一个共享 observer 多一点内存与调度开销。数量级很小（20 个 observer 对浏览器不构成压力），列出来是为了完整性，不是当前的性能瓶颈。

**修复建议**

若将来页面长度翻倍再考虑：抽一个模块级共享 IntersectionObserver（参照 src/lib/pointer-tilt-engine.ts 已经做过的单例引擎模式，用 WeakMap<Element, callback> 派发）。当前规模下**建议不改**——引入共享单例的复杂度大于收益。

**验证过程**：实读 useDeferredReveal.ts:21-45：每实例 new IntersectionObserver + getBoundingClientRect 属实；grep 构建 HTML 实测 sheet-reveal 计数 about 20 / index 16 / products 11 / contact 8，与发现一致。发现自己结论就是「当前规模建议不改」。

**⚠️ 验证修正**：事实全对，但按发现自己的结论（20 个 observer 对浏览器不构成压力、改造复杂度大于收益）这实际是零行动项，严重度调 none——纯备忘性质。

---

## 141. [NONE / CONFIRMED] :has() 选择器三处 —— 当前规模成本可忽略，但 :has(:hover) 会让每次按钮内指针进出触发 frame 子树样式失效

- **维度**：CSS 引擎　**位置**：`src/app/globals.css:666`
- **原始评级**：severity=low confidence=low　→　**验证后**：none

**证据**

全站 3 处 `:has()`：
- 666 `.btn-module-frame:has(:hover):not(:has(:disabled))::after { opacity: 1 }`
- 670 `.btn-module-frame:has(:active):not(:has(:disabled))::after { opacity: 0.45 }`
- 752 `.sheet-reveal:has(.card-glass) { animation: none }`（在 `@supports (animation-timeline: view())` 内）
前两条是**动态** :has（依赖 :hover/:active 伪类），浏览器必须在每次 hover 状态变化时向上回溯检查祖先 frame 是否匹配；Chromium 对 `:has(:hover)` 有专门优化路径但仍标记为 invalidation 敏感。第三条是静态结构 :has，只在 DOM 变化时重算。
规模数据：全站按钮 ≤7 个/页（引擎注释自述），`.sheet-reveal` 每页约 9 处（grep 命中数）。都是两位数量级。

**影响**

实测量级下无可感知成本，我把它列出来只是为了报告完整（题目要求报全部发现，包括 low）。真正需要注意的是**将来**：如果按钮数量或 `.sheet-reveal` 数量增长一个数量级（比如做一个长列表页每行一个按钮），`:has(:hover)` 的失效成本会开始显现。

**修复建议**

不建议现在改。若将来出现按钮密集的页面，把槽光涌出改成由按钮本体 `:hover` 驱动一个自有伪元素（不需要向上回溯），或用 `:has()` 之外的方案（如给 frame 加 `pointer-events` 让 frame 自己接收 hover）。当前只需在 globals.css:647 那段注释里补一句「:has(:hover) 是动态失效选择器，按钮密集场景需重新评估」作为埋点。

**验证过程**：grep :has( globals.css = 恰好 3 处（666/670/752），位置与动态/静态分类属实；752 确在 @supports (animation-timeline: view()) 块内。规模数据（按钮每页个位数、sheet-reveal 每页约 9 处）与「当前无可感知成本、不建议改动」的结论一致——审查者自己定性为完整性汇报。当前零用户影响，严重度按实调为 none（纯前瞻性埋点备注）。

---

## 142. [NONE / CONFIRMED] SiteHeader 每个 scroll 事件读 scrollY 并 setState，无节流

- **维度**：运行时性能与移动端内存　**位置**：`src/components/layout/SiteHeader.tsx:17`
- **原始评级**：severity=low confidence=high　→　**验证后**：none

**证据**

SiteHeader.tsx:17-20：
```js
const handleScroll = () => setScrolled(window.scrollY > 50);
window.addEventListener('scroll', handleScroll);
```
没有 `{passive:true}`（虽然 handler 不调 preventDefault，Chrome 对 window 上的 scroll 本来就当 passive，影响有限），也没有 rAF 节流。跨越 50px 阈值以外的滚动里，`setScrolled` 传入的布尔值不变，React 会 bail out 不重渲染——所以不会有 re-render 风暴，但函数体每事件都执行。

**影响**

极小：每个 scroll 事件一次属性读 + 一次 setState 调用（大部分被 bail out）。列出来是为了完整性，不是需要修的东西。真要修的话性价比也不高。

**修复建议**

若想统一纪律：改用一个放在页面顶部的哨兵元素 + IntersectionObserver，彻底移除 scroll 监听（约 10 行）；或在 handler 外套一层 rAF 节流（3 行）。可以不修。

**验证过程**：SiteHeader.tsx:17-21 核实：handleScroll 每 scroll 事件读 scrollY + setScrolled，无 passive 标注、无节流，布尔不变时 React bail out——与发现描述完全一致。发现自评「不需要修、列出为完整性」，真实用户影响趋近于零，按实际影响调为 none。

---

## 143. [NONE / CONFIRMED] 【核实通过，非缺陷】WallBricks 的移动端零成本路径确实成立；全站无事件监听器泄漏

- **维度**：运行时性能与移动端内存　**位置**：`src/components/shared/WallBricks.tsx:70`
- **原始评级**：severity=low confidence=high　→　**验证后**：none

**证据**

这是逐项核实的结论，记录下来供对照，不需要改动。

**移动端零 DOM/零 rAF/零监听——成立。** WallBricks.tsx:70-72 的门控在注册任何监听之前：
```js
const capable = window.matchMedia('(hover: hover) and (pointer: fine)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (!capable.matches || reducedMotion.matches) return;
```
实测（390×844 / hasTouch / isMobile / DPR3）：`matchMedia('(hover:hover) and (pointer:fine)').matches === false`，`.bp-brick` 数量 0，`.bp-wall[data-live]` 未落。手机端唯一的初始化开销是 1 次 `grid.closest('.bp-wall')` + 2 次 matchMedia，然后 return——可忽略。

**bundle 侧**：WallBricks 打进共享 chunk `2m3dobewfr38-.js`，minified 后该模块约 **3.5KB**（整个 chunk 31.3KB / gzip 11.4KB），手机端确实要下载解析但不执行。这个量级不值得为它做 dynamic import。

**无监听泄漏——实测确认。** 用猴补丁统计 add/removeEventListener 净值，跑 5 次客户端路由跳转（/ → /products → /about → /contact → /products → /）：`window:pointermove` 恒 2、`window:scroll` 恒 2、`window:resize` 恒 2、`html:pointerleave` 恒 2、`window:blur` 恒 1、`document:visibilitychange` 恒 1；砖数恒 442（BlueprintWall 挂在 (public)/layout，不随路由重建，这是对的）；DOM 节点 1359 → 1362。

**rAF 停帧——实测确认。** 弹簧收敛后 2s 内 `requestAnimationFrame` 调用增量为 **0**。三个 rAF 消费者（WallBricks / pointer-tilt-engine / HeroObjectPhysics）各自独立且都有收敛停帧，不会叠加成常驻循环。

**逐帧写入纪律——成立。** WallBricks.render()（:145-189）循环内只写 `style.transform` / `style.opacity`，没有任何 `getBoundingClientRect` / offsetTop 之类的布局读取。三处 `getBoundingClientRect` 都在事件回调里且有缓存：HeroObjectPhysics.tsx:142（150ms TTL）、pointer-tilt-engine.ts:145（scroll/resize 失效重取）、useDeferredReveal.ts:27（挂载时一次）。没有 layout thrashing。

**合成层没有爆炸。** 1920×1080 DPR2 实测：静置 181 层，重力井交互期间 207 层（+26，对应约 21–22 块被 transform 的砖）。因为出圈的砖会被清空 inline transform 降级（WallBricks.tsx:158-165 的 lastW 双零跳过），任何时刻带 3D transform 的砖恒定在 ~22 块（半径 150px / pitch 56 的几何必然）。这一块设计得很好。

**影响**

这些项目都符合 CLAUDE.md 的纪律声明，实测无偏差。列在这里是为了让主对话知道哪些怀疑已经排除、不必再查。

**修复建议**

无需改动。

**验证过程**：抽查其代码侧断言全部属实：WallBricks.tsx:70-72 门控确在任何监听注册之前（不满足直接 return，连 pointermove 都不挂）；render()（145-189）循环内只写 transform/opacity 无布局读取；256-259 blur/visibilitychange 兜底存在；216 行 settled 即 rafId=0 停帧；158-165 lastW 双零跳过存在；BlueprintWall 挂在 (public)/layout 不随路由重建与 CLAUDE.md 一致。浏览器实测数字（监听净值、层数、bundle 尺寸）无法逐项复跑，但与代码结构互洽。本条为「核实通过」记录，非缺陷。

---

## 144. [NONE / REFUTED] InDevelopmentShowcase 的 id="in-development" 锚点已无任何链接指向，scroll-mt-24 是为它服务的死重

- **维度**：僵尸代码与文档漂移　**位置**：`src/components/products/InDevelopmentShowcase.tsx:47`
- **原始评级**：severity=low confidence=high　→　**验证后**：none

**证据**

第 46-49 行：`<section id="in-development" className={...scroll-mt-24...}>`。全库 grep `in-development`：src 下只有这一处定义，零 `href="#in-development"` / `href="/products#in-development"`。仅在 homepage-slim spec 第 59/105/178 行被提及，且第 105 行已写明「其 `#in-development` 锚点引用随卡消失」——引用方（teaser 卡）被删了，锚点本身没删。CLAUDE.md 也记录了同源的 `#real-estate` 锚点「已退役」，那个删干净了，这个没有。

**影响**

极小的死重（一个 id + 一个 scroll-mt-24 utility）。真正的成本是误导：id 的存在暗示某处有深链，做导航改动的人会去找并保护一个不存在的入口。

**修复建议**

删掉 `id="in-development"` 与 `scroll-mt-24`；或若打算对外发深链（CSIO 名录导入的访客直达 BMS 段是合理场景），就在 CsioMemberRow / 外部素材里真正用起来并在注释里注明。改动量：1 分钟。

**验证过程**：grep 确认 src 下零 #in-development 链接引用属实，但读了 homepage-slim spec 第 59-60 行与第 178-179 行：spec 明文定案「保留 id="in-development" 锚点（外部可能有历史链接，保留无害）」「teaser 卡引用应随卡消失，模块自身 id 保留」——锚点保留是逐字写进定案的显式设计决策（防外部历史深链失效），不是删引用时的遗漏。与 #real-estate 的类比不成立：那个是 spec 定案退役的，这个是 spec 定案保留的。

**⚠️ 验证修正**：id 无站内引用属实，但保留它是 homepage-slim spec §3.1 的显式定案（外部历史链接兜底），发现引用了该 spec 的 59/105/178 行却漏读了 59 行的保留理由与 179 行的「模块自身 id 保留」。非僵尸代码。

---


# 各维度整体评价（含「检查过但无问题」的项）

## CSS 引擎

## 做得好的地方（这不是客套，是核对后的结论）

**1. 体积完全不是问题。** 构建实测：`.next/static/chunks/2j4l3hpfux2uj.css` = 49,095 B raw / **10,904 B gzip**。其中 Tailwind preflight + 全部 utility 约 29.5 KB（占 60%），手写 CSS 约 19.6 KB。注释在生产构建中被完整剥离（源文件 64,376 B → 产物里手写部分 19.6 KB），所以那些极详尽的中文注释**零运行时成本**。

**2. SVG data-URI 编码接近最优，无需优化。** 只有 2 个 URI，合计 1,983 B = 产物的 **4.0%**，gzip 后约 470 B。检查项：用单引号属性避开了 `%22` 转义（只有 `%23` 是必须的 hex 井号）；没有用 base64（会膨胀 33%）；没有 `<?xml?>` 头和多余空白；**同一张砖图被 `.bp-wall-face` / `.bp-brick` / `.bp-brick--a` / `.bp-brick--c` 四处复用但只在 `:root` 存一份**，这是正确做法。唯一可想的微优化是砖 tile 里 6 个全尺寸 `<rect width='90' height='90'>` 叠加层能合并成更少的渐变栈——省不到 200 B raw / 50 B gzip，不值得动一个几何精度已被验证的资产。

**3. prefers-reduced-motion 的动画覆盖是真的完整。** 我逐个 `@keyframes` 核对（globals.css 20 个 + tailwind.config 3 个），列表如下：
- scroll-driven 2 个：`sheetSettle`→`.sheet-reveal` ✅ / `heroTilt`→`.hero-tilt` ✅，均在 1511 显式 `animation: none`
- infinite 14 个：`objFloat` `objSway` `modDrift` `seamPulse` `corePulse` `tracePulse` `pipCycle` `pipCycleLead` `portCycle` `portCycleLead` `ringStep` `objShadow` `marquee` `scrollPulse`，**全部**在 1511-1526 白名单里 ✅
- 非 infinite 9 个（`bpDraw` `bpFade` `wordReveal` `bpSolidify` `modAssemble` `seamIn` `coreIn` `objShadowIn` `scaleIn` `reveal` `scaleInDot`）靠 0.01ms + delay -0.01ms 全局重置落终态 ✅
- 被 `animation: none` 掉后基态 opacity=0 的层，1532-1551 逐个补回了静态终值（shadow .55 / seam .55 / core .35 / trace 0 / lead+ring 1）✅
- JS 侧动画（WallBricks 重力井、pointer-tilt-engine、HeroObjectPhysics）全部在挂载前查 RM 且监听中途开启后 teardown ✅
**唯一遗漏是 `scroll-behavior: smooth`**（已作为 high 报出）。

**4. 对比度数字经得起复核。** 我用 WCAG 相对亮度公式独立重算了 CLAUDE.md §4 的表：对砖面平底 #111620，primary 15.26 / secondary 8.09 / tertiary 6.39 / quaternary **4.60** —— 与文档逐位一致，包括「quaternary 距 4.5 红线只剩 0.10 档」这个关键警告。这份文档没有虚报。

**5. 逐砖明度变异的 alpha 落点判断正确。** 源码注释预言压缩器会把 `rgba(255,255,255,0.004)` 输出成 `#ffffff01`（1/255），构建产物实测 `.bp-brick--c{background-image:linear-gradient(#ffffff01, #ffffff01), ...}` —— 完全应验，变体没有被四舍五入抹掉。

**6. `--wall-*` 簇的交叉锁定 claim 完全属实。** 我把 13 个 token 逐个与两张 tile 的 data-URI 内字面值对照（lit .055 / lit-k .03 / tint .028 / shade .42 / shade-k .3 / edge .3 / edge-k .2 / bed-base #080b10 / bed-shade .45 / bed-lit .018 / bed-dark .35 / bed-dark-t .4 / bed-dark-k .28），**全部逐字精确**。`.bp-brick` 的 `background-size: calc(100% * 16/15)` + `background-position: 100% 100%` 恒等式我也验算过：faceSize 52.5 × 16/15 = 56 = pitch ✅，position 100% ≡ 52.5−56 = −3.5 = −seam ✅，与静态 tile 的 translate(6,6)→3.5px 像素同源 ✅。这段几何是对的。

## 我检查过并确认没问题的项

- **死代码**：58 个 class 选择器全部有消费方（`.sheet-panel` 只出现在退役说明注释里，不是活规则）。`--border-heavy` 看似 0 消费但实际被 CropMarks.tsx:10 和 TechStackBadges.tsx:30 用 Tailwind 任意值语法消费 —— 初次 grep 被 zsh glob 误导过，已修正。
- **重复选择器块**：没有同名选择器被定义两次的情况（`.card-glass` 在 @supports 内的是有意的条件覆盖，不是重复定义）。
- **`!important`**：全库只有 RM 块里 5 处，全部带 biome-ignore 说明且理由正确（通配选择器特异性极低，不加会被任何 class/inline 覆盖）。没有滥用。
- **Backdrop Root 纪律**：`filter` 确实已从所有 scrub 关键帧移除（`sheetSettle` 干净）；仍含 filter 的 `reveal` / `wordReveal` 我追踪了全部使用点——只在 HomeHero.tsx:43/76/89 的 SheetLabel、副标题词、CTA 按钮组，子树内无 `.card-glass`，豁免成立。`blur-[120px]`/`blur-[100px]` 那两个光晕 div 是叶子节点不是祖先。所有 `opacity-*` utility 也全在叶子 `<Image>` 上。这条纪律执行到位。
- **`contain: layout paint style`**（.bp-wall-grid）：用法正确，砖的 `translate3d(...,-36px)` 在 perspective(600px) 下向内收缩不会越出 clip 边界。
- **`overflow-hidden` 劫持 view() 时间轴**：全库无裸 `overflow-hidden` 包住 `.sheet-reveal` 子树的情况，13 处都走 `.overflow-clip-safe`。
- **@layer**：全站零使用（这是「源序陷阱」那条发现的根因，已单独报出）。
- **biome CSS lint**：`npx biome check src/app/globals.css` → 零 issue。
- **`--wall-brick-w`/`--wall-seam` 的 JS 读取**：`getComputedStyle(grid)` 走继承链能拿到 `:root` 值，`parseFloat` 能吃掉前导空格，失败有 `buildFailed` 闩锁不会反复 reflow —— 实现是对的。
- **拆分接缝**（供参考，已在 object-css-block 那条给出建议）：1-173 token / 175-258 基础 / 260-360 墙 / 362-486 卡 / 488-680 按钮 / 682-709 分割线光晕 / 711-758 滚动驱动 / 760-832 hero 绘制 / **834-1349 物件（516 行，33%）** / 1351-1406 marquee / 1408-1468 表单 / 1470-1483 scaleIn / 1485-1552 RM。最值得拆的只有物件块，其余每块都在 200 行以内且耦合紧密，拆了反而增加跨文件跳转。

## 一句话总结

CSS 引擎的工程质量明显高于一般营销站水准——RM 覆盖、Backdrop Root 纪律、几何恒等式、对比度台账都经得起独立复核，注释里的技术论证大多是真的踩过坑写出来的。真正需要动手的只有 4 条：**RM 漏了 scroll-behavior**（a11y 硬伤，3 行）、**缺 color-scheme: dark**（Firefox 视觉断裂，1 行）、**按钮 hover 未门控**（触屏粘滞，4 个 @media 包裹）、**表单焦点环在 forced-colors 下消失**（2 行）。其余全是可维护性收敛，可以按优先级慢慢做。


---

## 巨型组件与抽象

【做得好、我核查过确认无问题的项】

1. **共享组件层本身是主动做出来的，不是没意识**。Card / ModuleButton / CardActionRow / Eyebrow / SheetLabel / HighlightTag / IconBadge / ArrowRightIcon / ExternalArrowIcon / StatCard / CropMarks 每一个的文件头注释都写着「此前在 N 处逐字符重复，统一收拢」。抽象纪律是存在的，问题在于**执行有缺口**——我报的 16/17/18/19 号发现全部是「共享组件已存在但新代码没用它」，而不是「根本没有共享层」。这个区别决定了修复成本：都是 3–15 行的机械替换，不需要新设计。

2. **数据层单源做得扎实**。caseStudies / realEstateSites / processSteps / mainNav / INDUSTRIES_SERVED / SITE_URL / BASE_OPEN_GRAPH 都是真单源，about 的 stats 从 `caseStudies.length + realEstateSites.length` 派生、SocialProofBar 的信任声明数字同源、FeaturedWork 用模块级 Map 预建 sheetIndex 避免渲染循环里的 O(n²) findIndex——这些是好判断。我核对了 case-studies.ts 的 getAdjacentCaseStudies，size===2 的环绕退化分支也处理对了。

3. **BlueprintObject 是真 Server Component，JS 包成本为 0**。无 'use client'，通过 children 组合模式传给 HeroObjectPhysics（这个模式用对了）。我 grep 了 `.next/static/chunks/` 全部 736KB，物件的 path 数据零命中——SVG 树确实没进客户端包。这是这个组件设计上最正确的一条决定，我报的 SSR 载荷问题只针对 HTML/flight 体积，不涉及 JS。

4. **CSS 自定义属性零死变量**。我逐个 grep 了 TSX 侧写入的全部 22 个属性（--draw-delay / --asm-delay / --ax,ay,az / --dx,dy,dz / --hx,hy,hz / --solidify-delay / --core-x,y,r / --seam-delay / --trace-dur,--trace-delay / --pip-delay / --drift-dur,--drift-delay / --edge-boost），globals.css 侧全部有消费方，命中数 1–6 不等。没有孤儿变量，也没有 CSS 里声明而 TSX 从不写入的。我报的 as CSSProperties 那条是预防性的，不是现存 bug。

5. **`any` 全库零使用**。`grep -rn ": any\|as any\|<any>" src/` 零命中，strict 已开。类型问题我只找到「过宽」（Record<string, ReactNode>、三个应该合并的可选字段）而不是「放弃类型」。

6. **ModuleShell 的关键推导没有写死**。`hasRight = x + w === variant.width` 是从数据派生的（1037 行），VariantConfig 的注释还专门解释了为什么不能写死 360——这条纪律执行到位了。三层 transform wrapper（asm/drift/hover）解耦同属性动画冲突，也是对的。我报的 rootClass/floatClass 那条是同一纪律在两个字段上破了功，属于局部漏洞而非普遍缺失。

7. **我检查过但确认没问题的**：AnimateOnScroll 的双路径（scrub + IO）与 SSR 可见基态处理、Card 的 variant 判别与 CardTilt 条件挂载、ModuleButton 的判别联合 props（href 与 disabled/type/onClick 互斥）、StatCard 的 numberMatch 正则（`^(\d[\d,]*)(\D*)$` 正确排除了 '2–4 wks' 和 '1.5x'）、useDeferredReveal/useIntersectionVisible 的分工、pointer-tilt-engine 单例（CardTilt 与 ButtonTilt 确实共享一份引擎，没有第二份）、getAdjacentCaseStudies 的边界分支。这些都没有抽象缺失问题。

【优先级建议（供主对话过滤参考）】
真正值得先动的只有两组：
- **第一优先**：ResultsSection 的解析器（前两条）。240 行 + 9 个书面回归案例 + 零测试，换来 2 张卡。这是全仓库投入产出比最差的一段代码，且删除路径干净（加一个可选数据字段）。
- **第二优先**：BlueprintObject 的拆分（bpo-* 8 条）。可以分两个 PR：先纯搬迁拆文件（零行为变更、diff 好审），再做 Face/DrawSet/数据化。类型硬化（etch-key-untyped、drift-not-discriminated、rootclass-magic）建议跟在第一个 PR 里，因为它们能把「静默失效」变成编译错误，正好在拆分期间提供安全网。
其余页面级重复（16–24）是低风险机械收敛，可以合成一个 PR 顺手清掉，但不紧急。marquee 和 SSR 载荷两条建议先记进 spec，等真机 profiling 数据再决定动不动。

---

## 运行时性能与移动端内存

## 总体判断

**结论先说：JS 侧写得非常干净，问题几乎全在 CSS 动画和 DOM 规模上。**

### 做得好的地方（实测验证过，不是看注释信的）

1. **三个 rAF 消费者的生命周期管理是教科书级的**。WallBricks / pointer-tilt-engine / HeroObjectPhysics 全部做到了：收敛即停帧（实测 rAF 增量为 0）、`disposed` 闩锁防复活、`MAX_DT` 防 tab 切回积分爆炸、teardown 里同时清弹簧状态和 inline style。5 次客户端路由跳转后监听器计数**一个都没多**，节点数 1359→1362。没有内存泄漏。

2. **重力井的算法设计是对的**。全局只有 3 个标量弹簧、砖的一切响应都是井心位置的纯函数（零砖级状态）、圈外砖靠 `lastW` 双零跳过、逐帧只写 transform/opacity、`left/top/width/height` 和明度变异 class 建时写死。实测任何时刻只有 ~22 块砖带 3D transform（合成层从 181 涨到 207），**没有"1000 个合成层"的爆炸**——这一点原始担忧可以完全排除。

3. **移动端门控确实生效**。`hover+fine && !RM` 的判定在注册任何监听之前，实测手机端 0 砖、0 rAF、0 监听。bundle 里那 3.5KB minified JS 手机确实白下载了，但这个量级不值得做 dynamic import。

4. **无 layout thrashing**。render 循环里没有任何布局读取；三处 `getBoundingClientRect` 全在事件回调且都有缓存策略。

5. **SSR 可见基态纪律**（useDeferredReveal）、**backdrop root 纪律**（filter 终态写 none、不进 scrub 关键帧）、**transform 写入者分层**（JS 逐帧 / CSS transition 永不同元素）——这几条我逐个对着代码核过，全部落实到位。

### 真正的问题

**主线程被两条 CSS 动画路径永久占着，而且跟用户看不看得见完全无关。**这是本次最重要的发现，全部有 CDP 实测数据：

- 手机端：hero 完全滚出视口后，主线程仍有 **6.6%** 常驻占用、**73 个合成层**、**每秒 75 次 layer tree 变更**——100% 来自 BlueprintObject 内部的 `modDrift`（var() 关键帧阻断合成）/ `seamPulse` / `corePulse` / `objShadow`（preserve-3d 子树内不合成）。把 `.bp-object-scene` display:none 掉，这些数字全部归零（0.4ms/3s）。
- 桌面端：`obj-float`/`obj-sway` 在 preserve-3d 上跑主线程 transform 动画，**与砖阵 DOM 相乘**产生每帧一次全文档 layout——鼠标不动、hero 早已离屏，仍持续吃 **19% 主线程**。这两个因素单独都不触发，是乘积效应，所以现有的分层纪律和白名单审查都没能挡住它。

### 关于"是否值得"——重力井墙的工程判断

**砖墙本身不是问题，问题是它没封顶、以及它给别人的账单买了单。**

- 成本侧：桌面 700–1242 个 div（DOM 节点 +76%），单块 ~1.5KB 的元素/样式/布局结构，JS 堆增量只有几百 KB——内存代价其实很小。逐帧 CPU 也不高（ScriptDuration 只有 ~27ms/2.1s）。移动端零成本。
- 真正的账单是间接的：这 700–2691 个 layout object 让**别人**触发的每一次全文档 layout 都贵 3–4 倍（18ms → 50–170ms）。它自己不 layout，但它让整个页面变重。
- 而 pitch 阶梯只按 `min-width` 分档这个疏漏，让竖屏 4K 拿到 **2691 块**（是文档假定上限 1242 的 2.2 倍），此时鼠标一动就是 45% 主线程。

**所以我的建议不是砍掉砖墙，而是：**
1. 先修 F1（物件离屏 pause）——这一改同时解决 F1 和 F2 的大部分，是全场性价比最高的 15 行。
2. 再修 F3（砖数封顶）——10 行，堵住竖屏/高分屏的失控路径。
3. 修完这两条，砖墙的性价比就是合理的：它换来的是全站唯一的、有辨识度的视觉签名，代价降到 ~700 个静态 div + 22 个动态合成层。这个交换我认为成立。

**如果将来还想再降一个数量级**：单个 `<canvas>` 画整面墙（1 个元素、1 个合成层、0 个 layout object，重力井直接在 2D context 里画）是等效且便宜一个数量级的实现。但那会牺牲掉"砖是真 DOM、静态 tile 与真砖共用同一张图保证几何等价"这个当前架构最优雅的部分，而且要重写 v8 spec 的整套材质推导。**在修完 F1/F3 之后不建议做**——收益已经不足以覆盖重写成本。

### 我检查过但确认无问题的项（不必再查）

- 事件监听器注册/注销配对：全部配对，5 次导航零增长
- 组件卸载时 rAF cancel：三处全部 cancel + disposed 闩锁
- 单例引擎 entries 数组残留已卸载节点：无，unregister 正确 splice
- 闭包捕获大对象：无（bricks/lastW 在 teardown 里置空）
- rAF 收敛后停帧：实测 0 增量
- 多引擎叠加 rAF 循环：三条循环互相独立，各自按需启停，不会叠加成常驻
- 逐帧只写 transform/opacity：成立
- 循环内 getBoundingClientRect：无
- 合成层爆炸：不存在（+26 层）
- 网络侧：手机首页 7 个图片请求（重复 logo 走缓存）、4 个字体 134KB、12 个 script，HTML gzip 28KB——没有问题

---

## 架构与 Next 16 用法

整体判断：这个规模的营销站，当前架构**恰当偏克制**，不是过度工程化。核心决策都对——server-first + 极小 client 岛、零动效依赖、TS 常量即内容层、全站 SSG（build 实测 16 个路由全部 ○/●，只有 /api/contact 是 ƒ）。真需要的抽象都在：Card / ModuleButton 的单一授权入口 + 私有 CSS 引擎、pointer-tilt-engine 单例（一套监听服务 ButtonTilt 与 CardTilt，per-entry 参数）、CardActionRow / Eyebrow / HighlightTag / IconBadge 这批是从实测的 2–4 处重复里收敛出来的，不是先验抽象。

做得好、我核查过确认无问题的项：
- **Server/Client 边界**：逐个 'use client' 查过 13 个 client 文件，每个都必要（DOM 事件/hooks/state），没有一处把整棵树拉成 client。Card 与 ModuleButton 的「双栖」设计**成立**——两者自身无 'use client'，只在内部渲染 CardTilt/ButtonTilt 这两个 client 岛，server 树里的 body 作为 children prop 传过边界，SVG 大块 DOM（BlueprintObject 1306 行）不进 client bundle。ErrorBoundary 包 {children} 的写法也正确（client 组件接 server children 不会污染下游）。HeroObjectPhysics 用 children 组合模式接 Server 子树，同样是对的。
- **Next 16 API**：params: Promise<{slug}> 已 await（Next 15+ 正确写法）；generateStaticParams / generateMetadata 用法正确；proxy.ts 是 Next 16 的合法约定文件名（build 输出确认识别为 Middleware），不是笔误；metadataBase 已设；BASE_OPEN_GRAPH spread 那套是对的——Next metadata 的整块覆盖语义常被踩，这里注释和实现都准确。没有该静态却动态渲染的页面。
- **数据层**：新增一个软件产品只需改 case-studies.ts 一处 + 放 logo，详情页/sitemap/首页精选/信任带 marquee/about 统计全自动跟上（featured 标记、getAllSlugs、getAdjacentCaseStudies 的环绕边界处理 size<2 / size===2 都写得很干净）。这是数据层设计的加分项，唯一的败笔是 results: string[]（见上）。
- **无障碍**：skip link 是首个可聚焦元素且指向真实的 #main-content；aria-current='page' 用在导航与面包屑；FAQ 的 inert + aria-expanded/aria-controls 正确；marquee 第二轨 aria-hidden + tabIndex=-1 正确；外链的 aria-label 逐字包含可见文字（WCAG 2.5.3）；TextListSection 上 role='list' 对抗 Tailwind preflight 的 list-style:none 是真问题的正确解法，不是冗余；SSR 可见基态纪律（useDeferredReveal 初始 true）在架构层被贯彻。除 contact 页跳级外，其余 5 个页面的 h1→h2→h3 顺序我逐页核过，干净。
- **API 与安全**：CSRF 的 Referer 精确 origin 比对（而非 startsWith）挡住了 lookalike 域；escapeHtml 覆盖邮件模板全部插值点；source 白名单；限流用 x-real-ip 而非可伪造的 x-forwarded-for，且清理定时器 .unref() 不会挂住构建；vercel.json 给 route 设了 maxDuration。这一块没发现漏洞。
- tsc --noEmit 与 next build 均通过（build 1.3s，静态生成 16/16）。

要说架构上最值得投资的一处，是把 ResultsSection 那 230 行启发式解析器换成数据层的显式字段——它是全仓唯一一处「为抽象而抽象」，而且抽象的对象是对外营销数字，风险和维护成本都不对等。

---

## 僵尸代码与文档漂移

【核查范围】把 src/ 下 69 个文件全部实际读过（不是只 grep），逐个交叉验证了导出与消费方、CSS 类/变量/keyframes 与调用点、tailwind.config 每个自定义 token、public/ 每个资源文件名、next.config 每条 redirect 的目标、docs/ 下 17 份 spec + 4 份 brief + 1 份 plan 的定案关系，并实跑了 `npx biome check ./src`、`npx tsc --noEmit`、以及 git 历史的敏感文件追溯。

【确认无问题的项 — 不要重复排查】
1. **组件零引用：一个都没有。** 我第一版检测脚本因 BSD sed 的 `\?` 不支持而误报「全部零引用」，修正后逐个 import 语句核实：src/components/ 下 42 个组件全部有真实消费方，含看似孤立的 BlueprintObject / HeroObjectPhysics / CsioMemberBadge / ButtonTilt / CardTilt / CropMarks / IconBadge / TextReveal / WallBricks —— 它们都是通过相对路径 import 的（`from './XXX'`），不是 `@/components/...`，所以按别名 grep 会漏。
2. **CSS 类与 keyframes 零死项。** globals.css 定义的 57 个类选择器、24 个 @keyframes 全部有消费方。特别核实过：`scaleIn` 由 ContactForm.tsx:85 的内联 `style={{animation:'scaleIn ...'}}` 消费（不走 Tailwind，容易误判为死）；`.bp-brick--a` / `--c` 由 WallBricks.tsx:46 的 VARIANTS 数组消费（中间那档是空串 = 基态 tile，不是漏了 `--b`）；`.animate-scroll-pulse` / `.animate-scale-in-dot` 分别由 HomeHero.tsx:144、SiteHeader.tsx:65 消费。
3. **tailwind.config.js 零死 token。** 三档 accent（accent-400 在 about:46、accent-700 在 about:51）、三层 bg（bg-surface 唯一消费方是 CaseStudyHero.tsx:21）、四层 txt、四档 fontSize、`tracking-eyebrow`、`dropShadow.accent`、`ease-out-expo`、三个 animation 全部在用。
4. **public/ 零孤儿资源。** 12 个文件逐个 grep 文件名，og-image.png / synthmind_logo.png / robots.txt 各有归属，product/ 下 10 个 logo 与 case-studies.ts + real-estate.ts 的条目一一对应，无多无少。
5. **next.config.js redirects 全部指向存在的目标。** `/products/real-estate`、`/products`、`/` 三个终点都是活路由；5 个地产盘 slug（avella/kingshaven/woodbine-parkside/unionglens/rosaleen）与 5 个 case-study slug（easy-sign/t-one-submit/onest-insurance/brokertool-ai/getax）无交集，不存在重定向劫持动态段的风险。
6. **CLAUDE.md 点名的退役项已真删干净。** 逐个 grep 验证零残留：`bp-wall-ambient`、`bp-wall-lamp`、`GlassCard`、`card-surface`/`card-elevated`/`card-spotlight`、`--grid-line-*`、`depth-drift`、`btnHoverIdle`、`--btn-dy`、ModuleButton 的 `phase` prop、`.sheet-panel` —— 代码侧全部零命中，只剩注释里的退役记录（那是有意保留的防复活标记，合理）。**唯一的例外是 v6 那份 spec 文档没同步**（见 findings 里的 v6-spec-still-claims-sole-canon），代码本身干净。
7. **.gitignore 覆盖正确。** `git check-ignore -v` 确认 `.env` / `.next` / `tsconfig.tsbuildinfo` / `next-env.d.ts` / `.claude/` 都被正确忽略，当前工作区没有任何该忽略而未忽略的文件被跟踪 —— 问题出在**历史**（.env 已入过库）和一个从未被 ignore 覆盖的 `.docx`。
8. **`npx tsc --noEmit` 零错误。**

【做得好的地方】去重收敛做得相当彻底：CardActionRow / IconBadge / HighlightTag / ArrowRightIcon / ExternalArrowIcon / CsioMemberRow / StatCard / pointer-tilt-engine 每一个的文件头都写明「此前在 N 处逐字符重复，统一收拢」，而且我核实过这些抽取确实完成了（旧实现在 git 里是 D 状态，不是留在原地）。数据层派生（`caseStudies.length + realEstateSites.length`、`INDUSTRIES_SERVED`、`sheetIndex` Map）替代硬编码数字这条做得比多数项目干净。CSS 注释里对「为什么是这个值」的记录密度极高（0.004 alpha 的明度杠杆推导、background-position 恒等式解耦断点、Backdrop Root 采样纪律）——这些不是噪声，是真正防回归的资产，与我在 findings 里建议下沉的「实测极值数据」是两回事，不要一起砍掉。

【一条不算 finding 但要提醒的环境变化】本次审查进行中，`tsconfig.json` 的 `target` 被从 `es5` 改成了 `es2022`（`lib` 同步改为 es2022）。这不是我改的。它使全局记忆文件里那条「tsconfig target es5（Map/Set 用 .forEach()）」的约束失效 —— 现在可以直接 `for...of` 迭代 Map/Set 了。已有代码里唯一受影响的地方是 `src/app/api/contact/route.ts:35` 的 `rateLimitMap.forEach(...)`（当时为绕开 es5 才写成 forEach），现在可以但不必改。建议同步更新那条记忆，否则下次会有人继续按 es5 的限制写代码。

---

## 构建配置与交付

## 实测基线（这些数字是本轮 build 真跑出来的，不是估算）

`npm run build` 成功，Next 16.2.12 + Turbopack，编译 1.66s / TS 检查 1.51s / 16 个静态页 253ms。**Next 16 不再打印 First Load JS 表格**，所以我从 `.next/server/app/*.html` 里逐个解析 `<script src>` 反推：

| 路由 | 首屏 JS（原始 / gzip） | CSS | HTML 原始 |
|---|---|---|---|
| `/` | 538 KB / **156 KB** | 49 KB / 10.9 KB | **275.5 KB** |
| `/about` | 538 KB / 156 KB | 同上 | 59.1 KB |
| `/contact` | 541 KB / 157 KB | 同上 | 47.4 KB |
| `/products` | 535 KB / 155 KB | 同上 | 67.2 KB |
| `/products/brokerage-platform` | 536 KB / 155 KB | 同上 | 72.0 KB |

（另有 110 KB 的 polyfill chunk，但它带 `noModule` 属性——我第一次用大小写敏感的正则漏判成"渲染阻塞"，复核后确认现代浏览器不会下载它，**不是问题**。）

JS 构成拆解后：约 130 KB gzip 是框架底座（react-dom 69 KB gz + App Router runtime 39 KB gz + 其余），应用代码只有约 25 KB gzip。**156 KB gzip 里 83% 是 Next App Router + React 19 的固定成本**——对一个纯静态、零动效依赖的四页营销站来说，这个底座偏重，但除非换架构否则没有下手处。我没把它列为 finding，因为不可行动。

## 检查过、确认没问题的项

- **CSS 交付干净**：49 KB 原始 / 10.9 KB gzip。globals.css 里两条 SVG data-URI（砖 tile 1091 B + 砖床 tile 880 B）合计只占源文件的 **4.3%**，完全不是负担。Tailwind purge 无残留——我把产物 CSS 里 299 个类选择器逐个回查 src/，只有 3 个未命中且全是 next/font 生成的 CSS Module 类名。
- **没有裸 `<img>`**：全站 7 处图片全部走 next/image，无一遗漏。
- **SVG logo 不是 400**：我一度以为 `/product/*.svg` 过 `/_next/image` 会因缺 `dangerouslyAllowSVG` 而 400（手工构造请求确实返回 400）。**这是误报**——实测渲染 HTML 里 SVG 是 `src="/product/unionglens.svg"` 直连，Next 根本没让它进优化器。已排除。
- **字体子集配置正确**：产物 CSS 里出现 cyrillic/greek/vietnamese 的 @font-face 看着可疑，但那是 next/font 的既定行为（声明全子集、只 preload 声明过的 latin）。实测 head 里恰好 4 条 preload，全是 latin 子集。`display: 'swap'` 三家族一致，size-adjust 回退字体三份都生成了。
- **metadata / SEO 骨架完整**：每个 page 都有独立 title/description/canonical（`/` 继承 layout 的 `/`），OG 通过 `BASE_OPEN_GRAPH` 展开避开了 Next metadata 整块覆盖的坑（constants.ts 里的注释说明作者踩过），Twitter card、google-site-verification、robots.txt + Sitemap 声明、JSON-LD 四类（Organization / ContactPage / CaseStudy / BreadcrumbList）都在。这块做得比多数同类项目扎实。
- **安全响应头齐全**：CSP / HSTS / nosniff / X-Frame-Options / Permissions-Policy 实测全部下发（`src/proxy.ts` 是 Next 16 的合法约定文件名，不是笔误——记忆里已记录过审查 agent 对此的误报）。
- **pointer-tilt-engine 工程质量高**：模块级单例、rect 缓存 + scroll 失效、passive 监听、收敛停帧、读写不交错（rect 读在 pointermove、transform 写在 rAF），没有强制同步布局的抖动路径。WallBricks 的 `contain: layout paint style` 与"圈外砖双零跳过"也都到位。**这两处唯一的可议之处是首次建砖的同步长任务**（已列 finding），物理循环本身没有性能问题。
- **`.next` 与 git 工作区已还原**：es5→es2022 的对照实验做完后 `git checkout tsconfig.json`，并用原配置重跑了一次 build，`git status --short` 为空。

## 总体判断

配置层没有会炸的东西，构建健康、SEO 骨架扎实、动效工程克制且有纪律。**真正值得先动的只有三条，都在资源交付而非代码上**：200KB 的假 JPEG favicon、490KB 的 OG 图、首页 275KB HTML（双变体 SVG + 136KB RSC 被全站预取）。这三条加起来就是这个站与"轻"之间的全部距离。

tsconfig 的 `target: es5` 是本轮最值得说的发现——它一字节产物都没影响（已用 md5 对照证明），却在真实约束团队的代码写法，而且这条约束自己已经被 `@types/node` 的 `/// <reference lib="es2020" />` 架空到不自洽。这是纯负债，删掉零风险。

---

## API 与安全

【整体判断】这套联系表单链路的**基础防护做得比同类营销站扎实得多**：HTML 转义在所有用户输入插入点都到位（`escapeHtml` 覆盖 name/subject/message/email/source，邮件标题额外剥离 `[\\r\\n\\t]`，mailto href 用 `encodeURIComponent`——我逐点核对过，没有找到 HTML 注入或邮件头注入的可利用路径，且因为走的是 Resend JSON API 而非 SMTP，CRLF 头注入在架构上就不成立）；CSRF 的 Referer 校验用 `new URL(referer).origin` 精确比对而不是 `startsWith`，明确挡住了 `synthmind.ca.evil.com` 这类 lookalike（csrf.ts:36-43，注释里还写明了为什么）；限流刻意只信 `x-real-ip` 而拒绝回落可伪造的 `x-forwarded-for`（route.ts:171-173），这个判断是对的，很多项目在这里栽跟头；`RESEND_API_KEY` 缺失时返回明确的 503 而非静默吞掉（route.ts:251-257）；错误 `details` 严格门控在 `NODE_ENV === 'development'`（route.ts:307/331），生产响应体里不会泄露堆栈、密钥片段或内部路径——我通读了全部返回分支确认无一例外。proxy.ts 的安全头基线也是合格的（HSTS 含 preload 且正确地只在 production 下发、frame-ancestors 'none' + X-Frame-Options 双保险、base-uri/form-action/object-src 全部锁死）。前端 a11y 同样高于平均：label 全部正确关联、成功态主动移焦并用 role=status 播报、aria-busy 齐全、10 秒 AbortController 超时保护、`disabled={status==='sending'}` 防重复提交（我确认了 ModuleButton 的判别联合类型保证 disabled 只在 button 形态生效，不会静默落空）。`npx tsc --noEmit` 干净通过。

【核对过但确认无问题的项】① 邮件模板注入面（含 mailto href 的属性逃逸、`</script>` 类闭合、Resend 参数拼接）——全部安全；② `source` 字段有白名单收敛且非法值降级而非报错；③ `products/[slug]` 的动态 slug 在到达 JsonLd 前必然已通过 `getCaseStudyBySlug` 白名单（未命中即 notFound），不存在反射；④ 全仓 `dangerouslySetInnerHTML` 只有两处（JsonLd + layout 的微信修复脚本），后者是硬编码常量；⑤ `.env` 当前已被 `.gitignore` 且不在 HEAD 树里；⑥ 邮件 HTML 里的内联 hex 全部来自 `constants.ts` 的 `BRAND_ACCENT`/`BRAND_ACCENT_DARK`，符合 CLAUDE.md §4 的邮件豁免口径，未见字面 hex。

【风险集中点，供主对话排序参考】真正需要立刻动的是三条互相放大的问题：**历史里的旧 API key（确认是否已在 Resend 撤销）**、**任意收件人的自动回执 = 开放发信中继**、**内存限流在 serverless 上无效**。前两条叠加意味着任何人都能用你的已验证域名向任意地址发信，而第三条意味着没有任何有效的量级刹车。这三条的修复成本都很低（撤销旧 key 是纯运维；去掉自动回执约 20 行；WAF rate-limit 是零代码的控制台配置），性价比极高。其余 16 条属于健壮性、UX 与纵深防御，可按节奏安排。

---

