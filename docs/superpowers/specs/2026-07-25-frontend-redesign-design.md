# Synthmind 前端重构设计文档 — Blueprint 制图系统

日期：2026-07-25
状态：已定案（用户委托直接定向并开始实施）
范围：表现层全重做 + 首页内容扩充；信息架构 / 文案 / SEO 结构不动

---

## 1. 业务风格定义（设计依据）

- **业务本质**：Toronto AI 软件工作室的 B2B lead-generation 站，唯一转化目标 = "Book a Free Consultation"。
- **受众**：保险经纪 / 建筑 / 地产 / 小企业的决策者——非技术人群。科技感的作用是"证明交付能力"，不是"炫技"。
- **文案基调既定**："AI tools that actually work / No corporate fluff"。
- **风格定义**：「静默精密」（Quiet Precision）——外表克制素雅，凑近全是细节。信任感来自排版精度、空间深度、微交互顺滑。

### 旧 Neural 系统诊断
1. 扁平：深度全靠 1px 边框 + glow 模拟，无真实空间感。
2. 撞脸：近黑底 + 单蓝 accent + 玻璃卡片 = AI 生成设计三大默认俗套之一。
3. 动效词汇量小：全站只有一个 reveal 入场；首页只有 Hero + 跑马灯，内容偏薄。

## 2. 核心概念：Blueprint / 蓝图制图

Synth Blue 的天然叙事：**蓝图本来就是蓝的**。客户全部活在图纸与单据里（建筑提交文件、保单、签署文档、地产平面图）。全站视觉隐喻 = 工程制图：

> "我们把你的生意绘制成可工作的软件。"

蓝色从"AI 公司默认蓝"变为"蓝图蓝"；玻璃拟态全部移除，换成"图纸材质"（实底 + hairline 制图线 + 基准网格 + 角标）。

## 3. Token 系统

### 3.1 色彩（延续深化，单色相纪律）
- 背景三层保留：`bg-base #080B10` / `bg-surface #0C1017` / `bg-elevated #111620`
- Accent 三档保留：`#4A9FE5` / `#5DAAE9` / `#2870AB`；文字四层冷白保留
- 新增材质变量（globals.css）：
  - `--grid-line-major: rgba(74,159,229,0.04)`（基准网格主线）
  - `--grid-line-minor: rgba(74,159,229,0.02)`（细分网格）
  - 边框四层 `--border-*` 保留不变
- 禁止引入第二色相；透明度 modifier 表达层次

### 3.2 字体
| 角色 | 字体 | 变化 | 用途 |
|------|------|------|------|
| Display | **Archivo**（variable，含 wdth 轴） | Sora → Archivo | 大标题用 semi-expanded 宽体，工业制图气质 |
| Body | Manrope | 保留 | 正文可读性资产不动 |
| Mono | **IBM Plex Mono** | JetBrains Mono → Plex | 图签编号、测量标注（工程文档血统） |

加载：`next/font/google`，Archivo 配 `axes: ['wdth']`。text-display/headline/title/subtitle 四档 clamp 尺寸保留。

### 3.3 布局
- 12 列基准网格，max-w-6xl 容器体系保留
- **图签系统（SheetLabel）替代 Eyebrow**：`SHEET 02 / CAPABILITIES` 式编号 + 标签；编号在图纸语境有真实序列语义
- 基准网格背景（BlueprintGrid）：双层 linear-gradient 网格（96px 主格 + 24px 细分格），alpha ≤0.04，配 mask 径向渐隐，仅用于 hero 与关键 section
- 角落细节：crop marks（L 形裁切角标）用于卡片/section 角落，微小、注意到才看见

### 3.4 卡片系统：GlassCard → SheetCard（图纸片材质）
- 移除 backdrop-blur 玻璃态；实底 `bg-elevated` + hairline 边框
- 三变体对应保留：`surface`（轻）/ `elevated`（标准，hover 上浮+光晕）/ `spotlight`（左侧渐变竖线）——底层类名与 API 兼容，材质重做
- hover 维持 2D：translateY(-2px) + border 亮 + 轻光晕（3D 预算全花在滚动入场）
- 圆角从 12px 收紧到 **8px**（制图感：更方正克制）

## 4. 签名元素：Hero 活蓝图

- 纯 SVG 工程图（流程节点 + 连接线 + 尺寸标注，抽象表达 workflow automation）
- 页面加载时 stroke-dashoffset 逐笔绘制（CSS 动画分段 delay，零依赖）
- 滚动时图纸容器随 scroll() timeline 轻微 rotateX（0→6°）+ 缓慢下移，像被从绘图桌上抬起
- Hero 布局：左右不对称分栏（左文案 ~60%，右蓝图延伸出血）；移动端蓝图退为标题下方窄条或隐藏
- **HomeHeroVideo 视频背景移除**（削减最大加载负担，同时消除微信 WebView hydration 兼容包袱）

## 5. 滚动 3D 动效规范（零依赖 CSS）

技术基座：`animation-timeline: view()/scroll()` + `perspective` + 3D transform；`@supports` 不支持时降级为现有 IntersectionObserver reveal（useIntersectionVisible 保留作降级路径）；`prefers-reduced-motion` 全局 reset 保留。

### 允许的动效词汇（全站白名单）
| 名称 | 实现 | 克制约束 |
|------|------|----------|
| sheet-settle 图纸沉降入场 | view() timeline，rotateX(5°)+translateY(24px)+opacity 随滚动沉降 | 倾角 ≤5°；替代旧 reveal 成为标准入场 |
| depth-drift 异速深度层 | 背景网格/光晕层反向缓移 | 位移 ≤ ±20px；仅背景装饰层 |
| line-draw 画线 | SVG stroke-dashoffset | 仅 hero 蓝图与 section 交界 |
| annotation-fade 标注浮现 | mono 标注延迟淡入 | 每屏 ≤2 处 |
| marquee | 保留（SocialProofBar） | 不变 |
| count-up 数字滚动 | useCountUp 保留 | 不变 |
| 卡片/按钮 hover | translateY(-2px)/光晕/border | 不做 mouse-tracking / 3D tilt |

### 禁令修订（写回 CLAUDE.md）
- 仍禁：shimmer / float / gradient-shift / noise / particle / mouseGlow / 满屏 parallax
- 修订：旧"parallax 一刀切禁令"改为"按幅度立法"——±20px 内的 depth-drift 属允许词汇
- 网格中同排卡片的 stagger：scrub 模式下用 `--stagger-index` CSS 变量偏移 animation-range

### 性能纪律
- 动画只允许 transform / opacity / filter
- LCP 元素（h1）不做入场动画（沿用现有经验）
- 无新 JS 依赖；移除 hero 视频为净减重

## 6. 分阶段路线图

### Phase 0 — 设计系统基建
1. `layout.tsx`：字体切换（Archivo / Manrope / IBM Plex Mono）
2. `tailwind.config.js`：新增 sheet-settle / depth-drift 等 keyframes、圆角 token、清理废弃项
3. `globals.css`：重写卡片三级材质、blueprint 网格类、scroll-driven 动画 + @supports 降级、按钮微调（圆角 8px 统一）、标注类
4. 共享组件：
   - `AnimateOnScroll` → 内部升级为 scroll-driven + IO 降级（对外 API 兼容）
   - `Eyebrow` → `SheetLabel`（图签编号系统；Eyebrow 保留为薄壳转发避免大面积改引用）
   - 新增 `BlueprintGrid`（网格背景）、`CropMarks`（角标）
   - `SectionTitle` / `PageHero` / `CTABanner` 适配新排版与图签
5. `CLAUDE.md` 设计规则章节改写（Blueprint 系统 + 新动效白名单）

### Phase 1 — 首页（标杆页）
1. 新 Hero：活蓝图 SVG + Archivo 宽体排版；移除视频
2. 新增板块：Capabilities（三能力）/ Featured Work（精选 2-3 产品）/ Process（Draft → Build → Ship 图纸阶段叙事）/ CSIO 信任背书
3. SocialProofBar 重做为图纸标注风客户带

### Phase 2 — Products + 详情页
1. 产品卡 → 图纸卡（sheet 编号、crop marks）
2. RealEstateShowcase / InDevelopmentShowcase / CsioMemberBadge 适配
3. case-study 组件族（Hero/Challenge/Solution/Results/TechStack）用图纸分区语言重做

### Phase 3 — About + Contact
1. About：叙事 + AnimatedStat 重做
2. Contact：表单材质升级（focus-line 保留）、FAQAccordion 适配

### Phase 4 — QA 收尾
1. 全站核查：移动端、a11y（焦点可见、reduced-motion）、LCP/CLS、旧浏览器降级路径
2. SEO 零回归校验（canonical / sitemap / JsonLd / h1 结构不动）
3. 强制 code-review-loop 循环至零问题
4. CLAUDE.md 文档最终校对

## 7. 反俗套自查（frontend-design 校准）

- dark + 单蓝本是俗套 cluster，但"蓝图"叙事给了蓝色主题依据；玻璃卡全移除、制图语言（网格/图签/hairline/角标）构成与默认输出的显著差异
- 图签编号通过"结构即信息"检验（图纸页码 = 真实序列语义）
- 风险闸门：网格 alpha ≤0.04 且仅限局部；mono 标注每屏 ≤2；Archivo 大标题用 sentence case 避免运动品牌感

## 8. 不做的事（YAGNI）

- 不引入动效库 / three.js / Lenis（用户已选零依赖路线）
- 不改路由、文案叙事、metadata、结构化数据
- 不做浅色主题；不做 mouse-tracking 交互
- 地产盘模块维持"卡片外链"结构不变
