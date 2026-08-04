# 信息架构与排版层级重构（IA v1 · Persuasion Chain）设计定案

> ✅ **信息架构现行正本 · Phase 1–3 已实装**（`486229e` + merge `2565d18`）。
> 本文 §3 的首页说服链**推翻**了 `2026-07-26-homepage-slim-ourwork-restructure-design.md`
> §0#1/#4 与 §1 的「主页只留 Hero + 信任带」——该 spec 已加退役横幅；其地产打包 /
> Our Work 命名 / 聚合详情页部分仍然有效。

> 日期：2026-07-27
> 前置调研：全站代码走查 + Playwright 1440px 实测截图（首页 / products / about /
> contact / brokerage-platform / easy-sign case study）
> 决策记录：David 选定方案 A（首页承担说服链 + 内页减仪式增密度）；
> 产品截图由 Claude 从 live 站截取；案例量化数字由 David 稍后核定后填入。

## 0. 问题诊断（为什么改）

细节层（墙 v8 / 卡 v7 / 物件 v3.1 / 按钮 v4.2）已到位，病灶全部在信息架构层：

1. **说服链断裂**：首页 = Hero + 灰 logo 带即结束。高价值访客（安省经纪行，
   由 CSIO 名录/新闻稿导入）在首页完全看不到 BMS 平台的存在，要两跳才能到达；
   「凭什么信你」的证据全部藏在第二页。
2. **标题仪式与内容重量倒挂**：SectionTitle 默认 `lg`（display 级 72px）+
   `mb-16` 被用于一切 section——包括三张 60 字小卡（about Values）和 FAQ
   （contact「Common Questions」72px > 页面 h1「Let's Talk」56px，层级倒挂）。
   而标题底下承担实际阅读的内容全是 `text-sm text-txt-tertiary` 小灰字。
   结构骨架比血肉醒目 = 「架构感不好、细节倒充足」的直接来源。
3. **一切皆卡片**：叙事正文（case study 的 Challenge/Solution 每段一张卡）与
   实体（产品/数字）共用同一规格玻璃卡，每屏 3–6 张同规格窗——卡片失去层级
   功能。反例（好的）：about「Why We Exist」左栏叙事直排压墙，是全站读感最好
   的一段。
4. **零产品图像**：作品集网站全程只有 logo，无一张产品界面截图；BMS 旗舰页
   3000+ 词无图。Hero 动态模组是全站唯一「实体」，独木难支。
5. **分割线与间距无制度**：ruled-line 出现与否取决于「哪个 section 手写了
   hr」；间距恒定 py-24，无组内紧/组间松。
6. **转化断点**：case study 页尾是死胡同（无 CTA、无下一案例）；PageHero
   pb-24 + section py-24 在多页叠出 ~190px 空档。

## 1. 目标与非目标

**目标**：让浏览者在每一页都能回答三个问题——你们做什么 / 凭什么信你 /
我下一步去哪；全站视觉重量与信息重要度重新对齐。

**非目标（明确不动）**：
- VoidField（深空引力场；原文写的「BlueprintWall / v8 石墨墙」已于
  2026-07-27 随背景换代退役）、Hero 动态模组（BlueprintObject v3.1 +
  HeroObjectPhysics）、按钮/卡片材质引擎、pointer-tilt-engine——零改动；
- 路由与 SEO 资产（URL、redirects、canonical、JSON-LD 结构）不动；
- 对外事实红线（CSIO 时态 / 客户不点名 / brokerages 不是 carriers）原样遵守；
- 首页 h1 文案（Unleash Human Potential with AI.）本期不动（若日后想让 h1
  直接陈述业务，另开文案议题——本期只动架构不动口号）。

## 2. 全站规则层（Phase 1）

### 2.1 标题制度（SectionTitle 语义重构）

三档语义，对号入座（**居中大字只保留给页面 hero 与 CTA**）：

| 档位 | 用途 | 尺寸 | 对齐 | 下间距 |
|------|------|------|------|--------|
| 页级 | 页面 h1（PageHero / CTABanner） | display / headline | 居中 | 现状 |
| 章级 | 页内主要叙事单元 | `md`（headline） | **左对齐默认** | `mb-10` |
| 组级 | 辅助内容（FAQ、Built With、次级列表） | `sm`（title） | 左对齐 | `mb-8` |

- SectionTitle 默认值改为 `size="md"` + `align="left"`，`mb-16` 按档位降为
  `mb-10`/`mb-8`（页级组件不走 SectionTitle，不受影响）；居中仅显式传参。
- 全站调用点逐一对号（见 §4 各页清单）；about `-mt-8` hack 随间距分级删除。
- contact FAQ 显式 `size="sm"`——修正全站唯一的层级倒挂。
- 编号纪律不变：sheetNo 仍只用于页内真实 section 序列。

### 2.2 正文档位（卡内文字提档）

- **承担实际阅读的正文**（产品描述、能力说明、叙事段落）：
  `text-sm text-txt-tertiary` → `text-base text-txt-secondary`（对砖面 8.09:1）。
- **元数据/标签/caption**（tagline 短句、标签、stat label）：保持
  `text-sm`/`text-xs` + tertiary——小字是给「扫」的，正文是给「读」的。
- 不新增 fontSize token；只在既有 base/sm/xs 三档间重新分配职责。

### 2.3 卡片分工原则（两条判据 + 两档规格)

- **判据一（进卡/出卡）**：可数的实体（一个产品、一个数字、一条 FAQ、一个
  流程步骤）进卡；连续叙事（多段正文）出卡直排压墙。
- **判据二（规格分档）**：一页至多一张「旗舰卡」（container + accent + lg pad，
  如 BMS 入口卡）；其余为普通卡（md pad）。同屏卡数 >4 时必须是同类实体的
  网格（产品网格、能力网格），禁止叙事卡混入。

### 2.4 间距与分割线制度

- **章级切换**：`py-24` + 顶部 `ruled-line`；**hero 之后的第一个章不加线**
  （hero 光晕已承担分隔），且该章用 `pt-12 pb-24` 消除 hero pb-24 叠加出的
  ~190px 空档。
- **组内相邻块**：`mt-10`（卡与卡之外的块间距，如旗舰卡与其 section 标题）。
- CTABanner 保留上下双线（全站统一收尾件，唯一豁免）；footer 顶线保留。

### 2.5 SocialProofBar 信任提效

- logo 基础透明度 `opacity-30` → `opacity-45`（hover 0.9 不变）——这些不是
  家喻户晓的品牌，太灰等于没有；仍走 brightness-0 invert 单色化，不破单色相。
- 图签文案改为数据层派生的可数口径：`{caseStudies.length + realEstateSites.length}
  PRODUCTS LIVE ACROSS 4 INDUSTRIES`（数字随数据层自动增长，与 about stats 同源）。

## 3. 首页说服链（Phase 2）

首页从「名片」扩成「整站缩略图」，每段给出去处；动静相间落实「一张一弛」：

| # | 段落 | 动/静 | 内容 | 出口 |
|---|------|-------|------|------|
| — | Hero | 动 | 现状零改动（含动态模组） | 双按钮 |
| — | SocialProofBar | 半动 | 紧贴 hero 作过渡带（§2.5 提效） | logo 可点 |
| 01 | 旗舰 BMS 段 | 静 | 复用 `<InDevelopmentShowcase />`（与 products 同一组件，SectionTitle 文案微调） | 平台详情页 |
| 02 | Shipped 精选 | 半动 | 3 张精选案例卡（数据层加 `featured` 标记）+ View all work → | /products |
| 03 | 方法带 | 静 | 四步流程紧凑单行版（编号 + 词 + 一句话，非卡片）+ More about us → | /about |
| — | CTABanner | 动 | 复用现有组件 | /contact |

- 流程步骤数据从 about 页面常量提为 `src/data/`（两处消费同源）。
- 首页总长控制在 ~5 屏；SocialProofBar 底部 pb-24 收为过渡节奏。
- InDevelopmentShowcase 在首页与 products 双处消费同一组件——入口卡本就是
  为「一段话 + 标签 + 链接」设计的，不复制 JSX。

## 4. 内页重排（Phase 3）

### 4.1 /products
- 01/02 SectionTitle 落章级默认（md / 左对齐）——不再与页 hero 撞规格；
  hero 后第一章按 §2.4 收空档。
- shipped 卡增加信息密度：卡头 logo 行保留，新增行业 mono 眉标（如
  `INSURANCE`，数据层加 `industry` 字段）；描述档位按 §2.2。
- 卡片仍六张同规格（同类实体网格，合规）；旗舰卡维持唯一大卡。

### 4.2 /about
- 02 What We Build / 03 Values / 04 Process 标题全部降章级左对齐。
- Values 三卡保留卡片（可数实体）但标题降 `text-base`；Process 四卡不变
  （步骤实体）；正文档位按 §2.2。
- 01 Why We Exist 双栏结构不动（它是范本）。

### 4.3 /contact
- FAQ 标题 `size="sm"` 左对齐；FAQ section `py-24` → `pt-12 pb-24`
  （与表单区收拢成一页两章的节奏）。表单区与信任栏零改动。
- FAQ 的 `sheetNo="01"` 移除——页面唯一编号 section，孤悬 01 暗示不存在的
  02（与 real-estate 页 2026-07-26 先例同口径）。

### 4.4 case study 模板（改动最大）
- **TextListSection 出卡重构**：Challenge/Solution 改为编号列表直排压墙
  （mono 序号 + `text-base text-txt-secondary` 正文，行间 `space-y-6`，
  左缘不再逐段包卡）；组件保留、内部渲染重写。
- **Hero 增密**：logo badge + 标题 + tagline 现状保留，新增一行 mono 元数据
  （行业 / 上线状态，数据层派生），Phase 4 后新增产品截图大图。
- **ResultsSection 解析修正**：extractStat 支持句中数字（如 "under 15
  minutes" → 15 minutes 卡）；解析不到就 bullet 直排——不虚构数字；David
  核定的数字到位后填入数据层。
- **页尾闭环**：新增 prev/next 案例导航（数据层顺序派生）+ CTABanner。

### 4.5 /products/brokerage-platform
- 01/02/03 标题落章级左对齐；hero 后第一章收空档。
- 三张全宽叙事卡改为：CSIO 会员卡保留（含引用块，实体背书），
  「Carrier documents」与「Certification」两段**出卡直排**（连续叙事），
  配 SheetLabel 小节眉标；能力六卡保留网格 + 正文提档。

## 5. 视觉证据层（Phase 4）

- **来源**：Claude 用 Playwright 从各产品 live 站截取（easy-sign.ca /
  t-onegroup.com / onestinsurance.ca / **www.brokertool.ca** / GE Tax / 5 个地产站），
  1440px 视口，取首屏或最有辨识度的界面。
  ⚠️ **2026-08-04 换址修正**：原文写的是旧域 `brokertool.ai`，它自换址起是 DNS
  NODATA（apex）/ NXDOMAIN（www），照原文截会拿到浏览器级 DNS 失败页。本文 §5
  Phase 4 **尚未执行**（`public/product/shots/` 不存在），是一条**活指令**不是历史
  记录——所以这里直接改址，不加历史批注。
- **规格**：统一裁切 16:10，WebP，进 `public/product/shots/`；案例卡顶部
  缩略图区（`aspect-[16/10]` + 圆角 8px 内嵌 + 顶部受光 hairline），case
  study hero 放大图。
- **BMS（无公开界面）**：用 Blueprint 线稿风格的抽象界面示意（hairline SVG，
  与动态模组同语言）——是设计资产不是产品截图，零保密风险；能力卡不配图。
- 截图属**卡内内容**不是背景——不违反「section 不得持有底色」纪律。

## 6. 数据层变更清单

- `case-studies.ts`：新增 `industry: string`、`featured?: boolean`、
  `shot?: string`（截图路径，Phase 4）；`results` 数字待 David 核定后更新。
- 新增 `src/data/process.ts`（四步流程，about 与首页双处消费）。
- 其余数据文件不动。

## 7. 分期与验收

| Phase | 内容 | 验收 |
|-------|------|------|
| 1 | 全站规则层（§2） | 全站无 display 级 section 标题（hero/CTA 除外）；contact FAQ ≤ h1；间距/分割线合制度；对比度抽查 ≥4.5:1 |
| 2 | 首页说服链（§3） | 首页 5 段结构可滚完；BMS 一跳直达；动静相间成立；LCP 纪律不破 |
| 3 | 内页重排（§4） | case study 无叙事卡、有页尾闭环；bms 页两段出卡；各页标题对号 |
| 4 | 视觉证据层（§5） | 每个已上线产品卡有截图；case study hero 有大图；CLS 为零（显式宽高比） |

每 Phase 独立走 spec → 实施 → code-review-loop → 汇报；Phase 4 依赖截图
素材管线但不阻塞 1–3。

## 8. 风险与回退

- 标题降档后若某页显得「平」：优先用内容密度与截图补重量，禁止回调字号。
- SectionTitle 默认值翻转会波及全部调用点：Phase 1 内一次性 audit 全站
  调用（grep SectionTitle 逐个对号），不允许「默认变了但调用点没看」。
- 截图站点若改版/下线：`shot` 字段可选，缺图时卡片回落纯文字形态（渐进增强）。
- 案例数字未到位期间：Results 全部走 bullet 直排，不留空数字卡占位。
