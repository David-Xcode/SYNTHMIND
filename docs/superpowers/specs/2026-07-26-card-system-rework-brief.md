# 卡片系统统一重构 + Contact 页重设计 — 执行 Brief（v7 候选）

> 2026-07-26 由主对话完成全站调研后生成，供新 session 执行。
> **调研已完成，本文件即调研正本——新 session 不要重做盘点，直接从 §5 阶段 0 开始。**
> 设计系统现行正本 = 项目 CLAUDE.md + `2026-07-26-lantern-wall-v6-design.md`。

---

## 0. 任务总述（用户原始意图）

三件事，一次设计定案、分阶段落地：

1. **统一卡片组件**：全站所有卡片收敛为一个组件；材质换为**有厚重感的玻璃质感**（毛玻璃或光滑玻璃，决策点见 §3.2A），支持**鼠标跟随倾斜**（rAF 阻尼弹簧，非 1:1 硬跟，决策点见 §3.2B）。
2. **组件收敛去重**：能合并的合并、能抽象的抽象——重复清单见 §1.3，全部纳入设计定案。
3. **Contact 页彻底重构**：从第一性原理重新设计（§3.3）；全站文案按 §2 审计结论修正。

裁量边界：**方向性决策（材质、变体划分、Contact 信息架构）必须通过 superpowers:brainstorming 与用户逐项定案**；实现细节自主决定，不要事事请示。

---

## 1. 现状调研结论（迁移覆盖正本）

### 1.1 卡片形态全量清单——漏一处 = 漏迁移

**GlassCard 组件（`src/components/shared/GlassCard.tsx`，28 行哑包装 → `.card-*` 类 + 锁死 `p-6`）共 9 处调用：**

| 调用点 | variant | 可点击？ | 备注 |
|---|---|---|---|
| `src/app/(public)/products/page.tsx:66-99` | elevated | ✅ Link 包裹 | CropMarks + `S.NN` 图纸编号（`.annotation`） |
| `src/app/(public)/products/page.tsx:111-134` | spotlight | ✅ Link（锚点） | 在建产品 teaser |
| `src/app/(public)/about/page.tsx:192-200` | spotlight ×3 | ❌ | What We Build 方案卡 |
| `src/app/(public)/about/page.tsx:224-231` | elevated ×3 | ❌ | Our Values 价值观卡 |
| `src/app/(public)/about/page.tsx:254-271` | surface ×4 | ❌ | 流程卡；自制大号水印数字 span（第二种编号实现） |
| `src/components/home/FeaturedWork.tsx:52-78` | spotlight | ✅ Link | 精选作品卡 |
| `src/components/home/CapabilitiesSection.tsx:83-92` | elevated | ❌ | 能力卡，带 CropMarks |
| `src/components/products/RealEstateShowcase.tsx:39-98` | spotlight | ✅ 外链 `<a>` | 地产卡 |
| `src/components/products/InDevelopmentShowcase.tsx:42-115` | spotlight | ❌ **但 hover 全反馈照常触发** | 全站最误导的一处 |

**绕过组件、直写 `.card-*` CSS 类（grep GlassCard 搜不到，最易漏）共 4 处：**

- `src/app/(public)/contact/FAQAccordion.tsx:28` — `card-surface`（容器卡：外壳静、内部 button 自带 hover——统一组件必须支持此形态）
- `src/components/shared/ContactForm.tsx:81` — `card-elevated p-8`（提交成功状态卡，纯展示却带上浮 hover）
- `src/components/shared/AnimatedStat.tsx:34` — `card-surface p-5`
- `src/components/case-study/ResultsSection.tsx:37` — `card-elevated p-6`（内部 ResultCard）

**自制"仿卡片"：** `src/components/case-study/TextListSection.tsx:47` — 手写 `rounded-lg border-l-2 border-accent/30 bg-bg-elevated p-5`（仿 spotlight 左竖线的第二套实现，零 hover）。

**CSS 本体：** `src/app/globals.css` 的 `.card-surface`（293）/ `.card-elevated`（304）/ `.card-spotlight`（320）。

**迁移完成的定义：`grep -r 'card-surface\|card-elevated\|card-spotlight\|GlassCard' src/` 零命中**（新组件的类名另起），全站卡片只剩一个授权入口。

### 1.2 交互语义错位（重构要修复的核心病灶）

1. **≥7 处不可点击卡片带"可点击式"hover**（上浮 + 阴影 + 竖线延展）：about 三组卡、CapabilitiesSection、InDevelopmentShowcase、ContactForm 成功卡、ResultsSection 数据卡——hover 效果写死在 CSS 类里，与交互语义零关联。
2. **variant 选择无规则**：about 页三组同为不可点击卡，却分别用了 spotlight/elevated/surface 三档 hover 强度。
3. **图纸编号三种实现并存**：`.annotation` 类（products 案例卡）/ 自制水印 span（about 流程卡）/ `TextListSection` 的 `text-2xl text-accent/20` mono 序号。
4. **卡片收尾行模式 4 处重复**（"文字 + 箭头 + group-hover:gap-1.5"）：products 案例卡、FeaturedWork、RealEstateShowcase、InDevelopmentShowcase；其中站内箭头走共享 `ArrowRightIcon`、外链箭头是两份逐字符相同的内联 SVG——同一视觉模式两套代码路径。

### 1.3 重复代码收敛清单（设计定案时一并纳入 spec）

| 收敛目标 | 现状 |
|---|---|
| **StatCard**（count-up 统计卡） | `AnimatedStat.tsx` 与 `ResultsSection.tsx` 的 ResultCard 各自实现 useCountUp + useIntersectionVisible + 数字正则解析，一个 card-surface 一个 card-elevated |
| **HighlightTag** chip | `RealEstateShowcase.tsx:70` 与 `InDevelopmentShowcase.tsx:98` className **逐字符相同** |
| **外链箭头图标** | `RealEstateShowcase.tsx:93` 与 `InDevelopmentShowcase.tsx:66` 内联 SVG **逐字符相同**（含注释）——抽 ExternalLinkArrowIcon 或并入 ArrowRightIcon 加 variant |
| **IconBadge 圆徽** | `ContactForm.tsx:84`（emerald）与 `ErrorBoundary.tsx:41`（red）同构，仅尺寸/色相不同 |
| **图纸编号机制** | 三种实现（§1.2#3）统一为新 Card 的 prop/子组件 |
| Challenge/SolutionSection 薄包装 | 仅传字面量给 `TextListSection`，可内联省掉两个文件（低优先级顺手项） |

RealEstateShowcase 与 InDevelopmentShowcase 整体结构高度雷同（logo 行 + 标题 + Eyebrow 地点 + 描述 + 标签群 + 箭头收尾），是"抽公共卡片内容骨架"的最佳试金石。

---

## 2. 全站文案审计结论（修正清单——阶段 4 独立 commit 执行）

外链健康：5 案例站 + 4 地产站 + csio.com 已 curl 实测全部 200（2026-07-26）。

### 2.1 事实准确性（按风险排序）

1. **`about/page.tsx:34-37`「100% Client Retention」**——全站唯一绝对值统计，零支撑；一个客户流失即为假话。改为可验证表述或移除。（高置信）
2. **无出处精确百分比**（B2B 专业买家面前的可信度反模式）：`case-studies.ts:38`（saved 60%+）、`:39`（Trusted by hundreds）、`:68-69`（70% / 85%）、`:133`（60%）。改区间/定性描述或补来源。（高置信）
3. **邮件模板遗留旧 tagline**：`src/app/api/contact/route.ts:88`「Reshaping the Future with AI」与站内任何现行 tagline 都对不上。统一替换。（高置信）
4. **CSIO 会员声明**（`InDevelopmentShowcase.tsx:81-84` + 首页 JSON-LD `memberOf`，`page.tsx:49-53`）是受监管行业的可核查身份主张——上线前**人工确认会员状态仍有效**。
5. **`about/page.tsx:32`「9+ Products Delivered」**——目前与数据层吻合（5+4），但硬编码；改由 `caseStudies.length + realEstateSites.length` 派生。⚠️ 另有 memory 记录：**Rosaleen 已上线未收录**——若本次补录，派生式自动跟上。
6. **联系邮箱为人名地址**（`constants.ts:7` David.wang@）与「团队直接对接」话术相互削弱——是否换角色邮箱（hello@）**由用户决策**（涉及邮箱开通，勿自行改）。
7. **定价陈述**（`faqData.ts:26-27` $3,000 / $10,000–50,000+）——请用户复核是否仍准确。
8. 内部注释错误：`real-estate.ts:3` 写"301"，实际 `next.config.js` `permanent:true` = 308（`constants.ts:4` 注释亦为 308）。顺手修。

### 2.2 一致性 / 语法

- 撇号：全站 14 处直引号 `'`，唯 `CapabilitiesSection.tsx:24` 一处弯引号 `’`——统一直引号。
- CTA 术语：「Book a Free Consultation」（HomeHero/CTABanner/contact title）vs「Book a free call」（`faqData.ts:27`）——统一。
- 数字区间破折号：`about/page.tsx:39` en dash（2–4 wks）vs `faqData.ts` hyphen（2-4 weeks）——统一。
- `<title>` 模板：`products/page.tsx:23`「Products | Synthmind」与其余三页顺序相反——统一。
- 资产命名 T-ONE / T_One / t-one 三写法并存（`case-studies.ts:53-56`，低优先级）。

### 2.3 语气与定位（brainstorm 时与用户定案）

1. **「startup」vs「studio」自我定位矛盾**：正文 7 处自称 startup（`page.tsx:19,36`、`layout.tsx:34`、`about/page.tsx:18,25,118`、`HomeHero.tsx:16`），而全部页面 `<title>` 用 Studio。与「9+ Delivered / 100% Retention / CSIO 会员」的成熟信号相互打架。**建议 studio，需用户拍板后全站统一。**
2. 「no X, just Y」句式全站 4-5 次（about:81/118/281、layout:45、contact:136）——保留态度、变换句式。
3. 使命陈述逐字重复 5 处，其中 `HomeHero.tsx:16` 与 About hero 副标题是**用户可见的正文重复**——首页讲「我们是谁」，About 讲「为什么存在」，各自分工。
4. `/products` 页两种语域并存（轻松初创 vs CSIO 合规正式），切换生硬（中置信，重设计顺手调和）。
5. contact metadata（`contact/page.tsx:18-19`）行业列表漏「tax」，与别处「accounting/tax」不对齐（低置信）。

### 2.4 结构性观察（供 IA 决策参考，是否纳入本次范围由用户定）

- **`/products` 承载三种性质不同的内容**（自研 SaaS 案例 / 外链地产合集 / 未上线产品意向征集）硬拼三个 section——是 IA 上最值得重新切分的页面，但超出本次任务默认范围。
- **ContactForm 前后端校验不对齐**：前端四字段全 `required`，后端只强制 email（name≤100/subject≤200/message≤5000 仅长度上限，`route.ts:200-242`）——Contact 重构时明确校验契约。
- Case study 详情页「Challenge → Solution → Tech → Results」证据先行结构是全站信息层次最清晰的部分，可作其余页面文案结构参照。

---

## 3. 设计方向（起点而非定案——brainstorm 时逐项过）

### 3.1 材质故事：第一性原理推导

v6 Lantern Wall 改变了物理世界：**墙后有真光**（右上余晖 + 随指针移动的 `bp-wall-lamp`），内容从墙前滚过。旧卡片语言"图纸片"诞生于 v4 无光时代，"图纸不是玻璃、禁 backdrop-filter"的理由随之成立；**v6 之后玻璃第一次有了光学意义**——毛玻璃压在灯箱墙前，墙后指针灯会透过玻璃揉成柔光晕，砖缝光被磨成雾光。指针灯已存在，玻璃卡片**免费继承**"光透过玻璃"的叙事，零新增光源。

推荐叙事候选：**卡片 = 压在灯箱墙前的玻璃检视窗（inspection pane）**。厚重感来源：边缘厚度（顶棱受光白线 / 底缘压暗——与按钮、砖 tile 同一中性明度轴语言）、玻璃内反射（低 alpha accent 渐变）、hover 顶起时投影落墙。

⚠️ **这与现行 CLAUDE.md「图纸不是玻璃/禁 backdrop-filter/卡片禁 mouse-tracking」直接冲突——这不是违规，是设计系统修订。** 定案后必须同 commit 改写 CLAUDE.md §2（设计概念）、§5（卡片系统）、§6（动画白名单 + mouse-tracking 豁免清单），并落 spec 正本。CLAUDE.md 与实现脱节是本项目最不可接受的状态。

### 3.2 三个方向性决策点（brainstorm 必过）

**A. 毛玻璃 vs 光滑玻璃**

- 毛玻璃（`backdrop-filter: blur`）：叙事最强，但三重性能风险叠加——backdrop 逐帧重采样 × tilt 逐帧改 transform（采样区逐帧变化）× 墙砖层指针动画（WallBricks 重力井）。products 页一屏 9+ 卡。**必须真机 Chrome 验证**（工具假象见 memory `browser-testing-3d-css-pitfalls`：WebKit 截图压扁、遮挡假 2fps、headless 截图不可信），验证场景 = products 页指针快速扫过卡片群。
- 光滑玻璃（半透明实底 + 棱线高光 + 内反射渐变，无 backdrop-filter）：恒定成本 ≈0，厚重感靠棱线/投影/tilt 传达，砖缝隔着 rgba 底隐约可见。
- 建议策略：毛玻璃为 A 案先过性能门槛；不过关降级光滑玻璃或混合（毛玻璃只给关键少数卡）。blur 半径克制（≤16px）。
- 可读性红线（不随材质变）：玻璃底上的正文对比度 ≥4.5:1（v4.2 提档口径）。毛玻璃模糊砖纹反而有利；光滑玻璃需保证足够 alpha。

**B. 指针倾斜 = mouse-tracking 豁免第 4 例**

- **复用 ButtonTilt 引擎，禁止复制第二份**：把 `src/components/shared/ButtonTilt.tsx` 的单例弹簧引擎（rAF 半隐式欧拉、收敛停帧、rect 缓存 + scroll/resize 失效、RM 中途 teardown、hover+fine 门控——全套纪律已在此文件成型）抽到 `src/lib/`（如 `pointer-tilt-engine.ts`），参数化 `{maxTilt, stiffness, damping, perspective, 轴系数}`；ButtonTilt（4°/k30/ζ0.6）与新 CardTilt 同引擎不同参数。
- 卡片倾角建议 ≤2.5°：卡片是大平面 + 密文字，倾角大 = 文字抖动 + 廉价 3D 感；按钮 4° 在小盒子成立，大盒子等角速度更晃。
- **分层纪律（实现的第一陷阱）**：JS 弹簧逐帧 transform 与 CSS transition 永不同元素。现 `.card-elevated:hover` 的 translateY(-2px) 是 transition——若保留升起类效果，结构必须 = 外层 tilt wrapper（JS）+ 内层卡片本体（CSS transition），照抄 ModuleButton 的 frame/tilt/本体三层先例。
- 门控照抄按钮：hover+fine 且非 RM 才挂引擎；触屏/RM/无 JS = 纯静态透传（SSR 可见基态）。per-element perspective，不建 preserve-3d 链。禁全站卡片常驻 will-change。
- 盒内跟随 vs 邻域跟随：按钮定案是盒内（嵌墙砖在槽里不晃）；玻璃板立在墙前，盒内跟随同样成立且便宜——brainstorm 定。

**C. 变体按交互语义重新划分**

- 现 3 变体与「可点击与否」零相关（§1.2#1/#2 的病根）。建议新维度：
  - `interactive`——整卡可点：hover 全反馈 + tilt + 投影落墙；
  - `static`——纯展示：恒定玻璃材质，无上浮无 tilt（或仅极弱受光响应）;
  - `container`——FAQAccordion 形态：外壳静，内部子元素自带交互。
- spotlight 左竖线是否保留、以何种 prop 形态（accent?）吸收——brainstorm 定。
- CropMarks / 图纸编号收进 Card API（props），消灭三种编号实现。
- **padding 改为受控 prop（如 sm/md/lg）**，从根上消灭"要自定义 padding 就绕开组件直写 CSS 类"的破口（§1.1 直写 4 处全是这么来的）。

### 3.3 Contact 页（第一性原理起点，非定案）

- 页面唯一职责：让潜在客户尽快发起第一次对话；其余一切要么减阻力、要么建信任。
- 现状：PageHero（占满首屏但只有一句话）+ 3/5 双栏（ContactForm + 3 条联系信息）+ FAQ。表单在 fold 下。
- 可探索的 Blueprint 语汇：**RFI（Request for Information）是建筑行业真实单据类型**，与图纸隐喻天然契合——"提交一份 RFI"的图签化单据卡是候选方向之一，brainstorm 时与用户定，不要自行拍板。
- 新卡片系统在此页全量落地：表单容器、联系信息、FAQ（container 形态）、成功态（static 形态）。

---

## 4. 执行顺序（已定案的建议）

**不做独立"清理 pass"。** 理由：先清理再重设计 = 对即将被替换的代码做两次手术；调研（覆盖清单）已在本 brief，直接设计 → 迁移，冗余清理并入迁移完成。

- **阶段 0** — superpowers:brainstorming + frontend-design skill：过 §3.2 三个决策点 + Contact IA，与用户定案。
- **阶段 1** — spec 落盘（`docs/superpowers/specs/2026-07-26-*-v7-design.md`）+ **同 commit 修订 CLAUDE.md**（§2/§5/§6）。
- **阶段 2** — superpowers:writing-plans 产出实施计划。
- **阶段 3** — 实施，建议顺序：引擎抽取（pointer-tilt-engine + ButtonTilt 改造回归验证）→ 新 Card 组件 + CSS → 逐页迁移（products → home → about → case-study）→ Contact 页重构 → §1.3 附属收敛 → 删除旧 `.card-*` 类与 GlassCard（grep 验证零命中）。
- **阶段 4** — 文案修正（按 §2 清单，**独立 commit**，与视觉重构解耦）。
- **阶段 5** — code-review-loop skill 全流程（强制，含主对话最终汇报模板）+ 浏览器实测（§6）。

---

## 5. 硬纪律（CLAUDE.md 自动加载，此处只点名本次易错项）

- 色彩：禁新字面 hex/rgba；玻璃材质新原语提为 token（`--glass-*` 或并入 `--mat-*` 系），与既有豁免口径对齐。
- RM 三件套：新增动画对号入座 globals.css reduced-motion 块（tilt 引擎走 teardown 路径，CSS 过渡走通配归零）。
- SSR 可见基态：JS 只允许在确认将播放动画时才隐藏/接管；微信 WebView hydration 失败整页仍可读。
- 禁 `overflow-hidden` 包含 `.sheet-reveal` 子树（裁切用 `.overflow-clip-safe`）。
- LCP（各页 h1）不加入场动画；不引入任何动效 JS 库。
- tsconfig target es5：Map/Set 遍历用 `.forEach()`。
- 端口纪律：先 `lsof -nP -iTCP:3000 -sTCP:LISTEN` 看 3000 归属；验证/截图一律 3100+ 高位端口。
- 真机验证防工具假象：memory `browser-testing-3d-css-pitfalls`（hover 需真实输入触发、getAnimations 冻帧技法等）。
- 完成后 code-review-loop：审查 → 修复 → 重审至零 verdict-changing 问题，**主对话强制输出汇报块**。

---

## 6. 验证清单（阶段 5 逐项过）

- 桌面 Chrome 真机：tilt 手感与收敛停帧；毛玻璃性能（指针扫过 products 卡片群的帧率）；hover 分层无跳变；墙后指针灯透过玻璃的观感。
- 触屏模拟 / RM：静态基态完整、引擎不挂载、无粘滞 hover。
- 无 JS（禁 JS 刷新）：SSR 直出完整可读。
- 对比度抽查：玻璃底上 tertiary 正文 ≥4.5:1。
- `npm run build` 通过；`grep` 旧卡片类零命中。
