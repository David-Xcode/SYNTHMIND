# 主页瘦身 + Our Work 重构 + 地产聚合详情页 — 设计定案

> 🛑 **主页部分已被推翻 — 勿作实施依据**（2026-07-27）
> **首页现行正本 = `2026-07-27-ia-hierarchy-redesign-design.md`（IA v1 · 说服链）。**
> 被推翻的具体条款：**§0 决策 #1**（「主页全删，只留 Hero + Trusted by」）、
> **§0 决策 #4**（「Capabilities / Process 内容彻底删除」）、**§1 主页删减**
> （删 `FeaturedWork.tsx` / `ProcessSection.tsx` / `CapabilitiesSection.tsx`）。
> IA v1 诊断出「首页 = Hero + 灰 logo 带即结束」正是说服链断裂的病灶，首页已恢复
> 五段结构：Hero → SocialProofBar → 01 旗舰 BMS → 02 Shipped 精选（FeaturedWork
> 已重建）→ 03 方法带（ProcessStrip，数据源 `src/data/process.ts`）→ CTABanner。
> **照本文 §1 执行 = 把刚加回来的三段再删一遍。**
>
> ✅ **仍然有效（IA v1 未触碰，继续作为现行定案）**：
> §0 决策 #2 地产只收已上线 5 盘 · #3 导航 label 改 "Our Work" / 路由保持 `/products` ·
> #5 地产 = 一张项目卡（S.06）+ 聚合详情页 · #6 BMS 升 Our Work 页第一段旗舰；
> §2 导航数据 · §3 Our Work 页重排（含 3.1 CSIO 背书口径与事实红线、3.2 作品网格）·
> §4 地产聚合详情页（含 T-One 点名口径与联系方式红线）· §6 非目标。
> §3.1 保留 `id="in-development"` 锚点亦是显式定案，勿当作僵尸代码删除。

> 2026-07-26 · David 拍板。本 spec 覆盖三块联动改动：主页大瘦身（**已作废，见上**）、
> /products 页重排（AI-Native BMS 升旗舰 + CSIO 新闻稿背书）、地产打包为一张项目卡 +
> 聚合详情页。
> 前置定案正本：v7 卡片系统（2026-07-26-card-system-v7-glass-design）、
> 墙体（当时为 v6；**现行 = 2026-07-27-graphite-wall-v8-design**）——本次不动任何
> 材质/动效层。

## 0. 用户拍板清单（逐条确认过）

| # | 决策 | 结论 |
|---|---|---|
| 1 | 主页删减范围 | 🛑 **已被 IA v1 推翻，勿执行** — 原结论「全删，只留 Hero + Trusted by 滑动条」（Capabilities / FeaturedWork / Process / CTABanner 四段移除） |
| 2 | 地产收录范围 | **只收已上线 5 盘**：Avella / Kingshaven / Woodbine Parkside / UnionGlens / **Rosaleen（新增）**。Quitowns、Bridle Path 未上线不收，上线后数据层加条目即可 |
| 3 | 命名与路由 | **导航 label 改 "Our Work"，路由保持 /products 不动**（零 SEO 成本） |
| 4 | Capabilities / Process 内容去向 | 🛑 **已被 IA v1 推翻，勿执行** — 原结论「彻底删除」；实际 Process 已提为 `src/data/process.ts` 双消费（about 详版 + 首页 ProcessStrip 一句话版） |
| 5 | 地产形态 | **一张项目卡（作品网格 S.06）+ /products/real-estate 聚合详情页**，与软件产品完全平级 |
| 6 | BMS 地位 | **升为 Our Work 页第一段旗舰模块**，链接 CSIO 官方新闻稿，用 Compass 可公开事实充实介绍，宗旨叙事 = 赋能 broker、释放人类潜能 |

## 1. 主页（src/app/(public)/page.tsx） 🛑 整节已作废

> **本节已被 `2026-07-27-ia-hierarchy-redesign-design.md` §3 全盘取代，勿执行。**
> 下文保留原文只为记录决策史。现状：首页五段说服链，`FeaturedWork.tsx` 与
> `ProcessStrip.tsx` 已重建并在用。

**保留**：`JsonLd`（Organization）+ `HomeHero` + `SocialProofBar`。
**移除引用并删除文件**：`CapabilitiesSection.tsx`、`FeaturedWork.tsx`、`ProcessSection.tsx`
（三者均为 home 专属，删文件 + 全库 grep 死引用）。
**移除引用但保留文件**：`CTABanner`（about 页仍在用，shared 组件不动）。

- **Hero 文案不动**（修正早前口头方案里的"微调"）：副标题是 v7 文案审计
  （commit f0c3b9d）刚定的案，且瘦身后它是主页唯一介绍性文字——信息密度合格，
  不重复劳动。LCP 纪律照旧（h1 无入场动画）。
- SocialProofBar 成为主页收尾 section：底部 padding 从 `py-16` 放宽到
  `pt-16 pb-24`（或等效），避免 marquee 紧贴 footer；两个 Hero 按钮 +
  可点击 marquee logo 是仅存的转化/导流入口，无需补 CTA。
- SocialProofBar 内地产 logo 的 `href: '/products#real-estate'` →
  `'/products/real-estate'`（见 §4）。
- 主页 metadata 不动。

## 2. 导航（src/data/navigation.ts）

`{ label: 'Products', href: '/products' }` → `{ label: 'Our Work', href: '/products' }`。
footer 复用同数组自动同步。HomeHero 按钮文案 "View Our Work" 与新 label 天然一致。

## 3. Our Work 页（src/app/(public)/products/page.tsx）重排

新段落顺序（BMS 从页底第三段提到第一段）：

```
Breadcrumb（label 改 'Our Work'）
PageHero          — eyebrow: OUR WORK；标题沿用 "Real Solutions for Real Businesses."
                    subtitle 改写：涵盖「已交付的作品 + 在建旗舰」双线（一句话，不铺概念）
① InDevelopmentShowcase（升级版，见 §3.1）  — sheetNo 01
② Shipped 作品网格（见 §3.2）               — sheetNo 02
```

原 `RealEstateShowcase` 页内 section **整段移除**（被聚合详情页取代，组件改造
迁移见 §4.2）。页面 metadata：title 改 `'Our Work — Synthmind | Real Solutions
for Real Businesses'`，description 同步微调；canonical /products 不变。

### 3.1 旗舰模块：AI-Native BMS（InDevelopmentShowcase 升级）

定位：把「开发中产品」从页尾附注升级为页首旗舰叙事。保留 `id="in-development"`
锚点（外部可能有历史链接，保留无害）。

**结构（Card variant="container" accent，沿用现组件骨架）**：

1. **CSIO 徽章行**：`CsioMemberBadge` + 两个并列外链——
   - `Verify in the CSIO Member Directory`（现有，保留）
   - **新增** `CSIO member announcement · July 2026` →
     `https://csio.com/news/csio-welcomes-seven-new-members-help-advance-industry-standards-and-connectivity`
     （组件内常量 `CSIO_PRESS_RELEASE_URL`，与 `CSIO_DIRECTORY_URL` 并列）
2. **标题**：`AI-Native Brokerage Management Platform`（h3，样式沿用）+
   Eyebrow `Ontario, Canada`
3. **官方背书引用块**（新增）：引用新闻稿对 Synthmind 的原句
   > "A Toronto-based technology company that develops AI-powered software to
   > modernize how insurance organizations operate."
   署名 `— CSIO member announcement, July 2026`（链接同上）。样式：低调
   blockquote——左侧 accent hairline 竖线 + text-txt-secondary italic，不新造
   卡片材质、不加发光。
4. **介绍段**（2-3 段，替换现文案，全部为可公开、可验证事实）：
   - 定位段：CSIO-compliant, AI-native brokerage management system for Ontario
     insurance brokerages — built around the industry's data standards from
     day one（eDocs ingestion / industry data exchange）。
   - 能力段：AI document intake（把 carrier 报价 PDF 变结构化数据）、
     e-signature workflows、policy & client lifecycle management、
     compliance-ready audit trail。
   - **宗旨段（核心叙事句）**：**"AI handles the paperwork — brokers make the
     decisions."** 每一步自动化都把判断权留给人——这是产品设计原则，也扣
     Synthmind 主页 "Unleash Human Potential" 宗旨。
5. **Highlights 标签**（替换现 3 枚）：`CSIO data standards` / `AI document
   intake` / `E-signature workflows` / `Human-in-the-loop by design`
6. **CTA**：保留 `Building a brokerage? Talk to us` → /contact（container 卡
   内自悬停链接形态不变）。

**事实边界（红线）**：不公开内部代号 Compass；不提任何未合作 carrier 名字；
不提内部路线图/阶段/日期；不写未上线功能的完成时态——在建产品用
"we're building / designed to" 时态。CSIO 会员身份与新闻稿引用是仅有的
第三方可验证事实，引用原句不改写。

### 3.2 Shipped 作品网格

- **SectionTitle**：sheetNo 02 / eyebrow `SHIPPED WORK` / light "Software That"
  bold "Shipped" / subtitle 沿用 FeaturedWork 的金句 "Every project below is
  live and running someone's business today."（FeaturedWork 删除，句子搬家——
  这句对地产卡同样成立，5 盘全部在线）。
- **6 卡 = 5 软件（S.01–S.05，现状不动）+ 1 地产项目卡（S.06）**，3×2 满格。
  原第 6 张 "In development teaser" 卡删除（BMS 已是页面第一段，teaser 冗余；
  其 `#in-development` 锚点引用随卡消失）。
- **地产项目卡（S.06）**：`Card variant="interactive" sheetNo="S.06" cropMarks`，
  外包 `Link href="/products/real-estate"`（站内导航，右箭头 CardActionRow）。
  - 卡头 h-10 行（与其他卡 logo 行等高对齐）：mono 注记
    `05 / LIVE SITES`（font-mono text-accent，属结构性编号——真实数量序列，
    不占自由标注预算）。
  - 标题 `Real Estate Launch Sites`；描述一句话：五个 GTA 楼盘营销站、
    同一经纪行长期合作、全部在线。
  - CardActionRow 文案 `View the portfolio`（站内右箭头，非外链箭头）。

## 4. 地产聚合详情页 /products/real-estate（新建）

### 4.1 路由与数据

- 新静态页 `src/app/(public)/products/real-estate/page.tsx`。Next.js 静态段
  优先于 `[slug]` 动态段，无冲突（`generateStaticParams` 只产 caseStudies
  slug，`real-estate` 不在其中）。
- **数据层** `src/data/real-estate.ts`：接口不变，新增 Rosaleen 条目：
  - slug `rosaleen` / name `Rosaleen` / location `Richmond Hill, ON`
  - description（事实依据：多页化 6 路由、印刷风设计系统、RegisterModal 线索
    收集、无 chat 模块）：印刷版画风格的楼盘营销站——serif 排印 + 上墨线稿
    质感、六页信息架构、modal 线索收集。措辞不用 "final release" 类稀缺承诺。
  - highlights：`Print-inspired design` / `Six-page IA` / `Modal lead capture`
  - url `https://www.rosaleenataudengrand.ca`
  - logo `/product/rosaleen.svg` ← 拷贝
    `/Users/david/RealEstate/Rosaleen/public/logo/rosaleen-lockup-horizontal.svg`
    （卡片统一 brightness-0 invert 白化，原色无碍）
- **sitemap.ts**：登记 `/products/real-estate`。

### 4.2 页面结构

现 `RealEstateShowcase.tsx` 的卡片网格改造复用（组件迁移或就地改造由实施
计划定，卡片样式、外链行为、`suppressHydrationWarning` 等既有细节全部保留）：

```
Breadcrumb: Our Work (/products) → Real Estate
页头 = PageHero（聚合页叙事性质与 products 总览同级，沿用统一页头；
  CLAUDE.md 页头口径不变）：
  eyebrow REAL ESTATE MARKETING / light "Property" bold "Launch Sites"
  subtitle = 整体叙事一句话
叙事段（1 短段）：同一家 Toronto 经纪行——T-One Group Realty——的长期合作；
  每盘独立品牌设计系统、双语线索通道、SEO 结构化数据，端到端交付
StatCard 行（3 枚，全部可核实）：
  5 / Live sites · 2 / Languages served · 3 wk / Fastest launch
5 盘卡片网格（grid-cols-1 sm:grid-cols-2 lg:grid-cols-3，5 卡 = 3+2 换行）：
  logo / 名称 / 位置 / 描述 / highlights / "Visit live site" 外链（现卡样式）
CTABanner（shared 组件复用）：headline 面向地产客群，
  例 "Launching a development?" + 一句 subtitle → /contact
```

**T-One 点名口径**：可点名 T-One Group Realty（各盘页脚版权 + "Powered by
synthmind.ca" 已公开双方关系；站内 T-ONE Submit case study 亦已公开客户
关系）。仅陈述"long-term partnership / five launches"这类可数事实。
**联系方式红线**：本页绝不出现任何地产家族电话/邮箱（647-822-9866 是 T-One
客户线，不属于 Synthmind 站）。

### 4.3 重定向与内链收口

- `next.config.js` 现有 3 条旧盘 slug 重定向目标更新：
  `/products/unionglens|woodbine-parkside|kingshaven` → **`/products/real-estate`**
  （维持 permanent:true = 308）。
- `SocialProofBar` 地产 logo href → `/products/real-estate`（§1 已列）。
- 全库 grep `#real-estate` 确认零残留（锚点退役）。

## 5. 收尾与文档

1. **项目 CLAUDE.md 更新**：
   - "Real Estate Module" 条款改写：地产 = 作品网格一张项目卡（S.06）+
     `/products/real-estate` 聚合详情页；旧盘 slug 308 目标 =
     `/products/real-estate`；新增地产盘 = real-estate.ts 加条目 + logo 放
     public/product/（上线后才收录）。
   - 第 1 节结构描述中 RealEstateShowcase 的 `/products` 页内锚点口径同步。
2. **grep 死引用**：CapabilitiesSection / FeaturedWork / ProcessSection /
   RealEstateShowcase（若删）/ `#real-estate` / `#in-development`（teaser 卡
   引用应随卡消失，模块自身 id 保留）。
3. **验证**：`npm run build` + `npx tsc --noEmit`；本地起服（先查 3000 占用，
   验证走 3100+ 端口）实测主页、/products、/products/real-estate、三条 308
   重定向 curl；reduced-motion 与无 JS 基态不受影响（无新增动画，全部复用
   白名单内既有组件）。
4. **code-review-loop** 到零问题 + 主对话汇报。

## 6. 非目标（明确不做）

- 不改 /products 路由、不改 case-study 详情页模板、不动 About / Contact 页。
- 不动 Blueprint 材质/动效系统（墙、玻璃卡、按钮、tilt 引擎零改动）。
- 不为 Quitowns / Bridle Path 预留 "coming soon" 卡位。
- 不公开 Compass 代号与内部实现细节。
- Hero 文案不重写（v7 审计定案维持）。
