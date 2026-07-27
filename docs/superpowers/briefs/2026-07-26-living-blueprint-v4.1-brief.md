# Synthmind v4.1 —「Square Brick Material」砖墙与按钮重设计（推翻 v4 部分定案的返工令）

> ✅ **任务已于 2026-07-26 完成 — 仅存档，勿再执行。**
> 本文是当时的施工任务书，其墙体/按钮定案已被 v4.2 → v6 → v8 连续推翻。
> 现行正本：墙体 = `docs/superpowers/specs/2026-07-27-graphite-wall-v8-design.md`；
> 按钮 = `CLAUDE.md` §7。

## 你接手的是什么

- **v4 已实施并提交为基线**（commit `a7d9050`，其前是 v4 spec `241d0bc`）：
  `--mat-*` 材质 token、`BlueprintWall`（fixed 满铺墙 = 透光层 + 奇偶行
  mask-composite 静态砖面 + `WallBricks` 懒构建弹簧砖场）、`ModuleButton`
  组件（全站 7 使用点迁移完毕：HomeHero×2 / CTABanner / ContactForm×2 /
  ErrorBoundary / FeaturedWork）、全站 section 背景层次化（`.sheet-panel` /
  透墙）、CLAUDE.md §1/§2/§4/§6/§7 已按 v4 修法。`npm run lint` +
  `npm run build` 通过。
- David 看过 v4 实机效果后**拍板返工**：砖墙观感不合格（两格合成的长砖 +
  砖面 24px 网格显得廉价、fixed 墙不随页面滚动）、按钮与砖块不同族。
  本简报的需求**推翻 v4 spec 的部分定案——正确动作是修 spec + 修法，
  不是拿 v4 旧定案否决新需求**。
- David 已明确免除 v4 旧实现的后续验证（模块将被重写）；**v4.1 新实现
  必须完整验证**（见「硬约束」）。
- 上一 session 的 dev server 已停（3110 已 kill）；动手前照例
  `lsof -nP -iTCP:<port> -sTCP:LISTEN` 查 3100/3110，3000 上常跑 David
  别的项目，别碰。

## David 的 v4.1 需求（原话要点，一条不许漏）

1. **砖块背景**：
   - a. **正方形砖**：一格一砖、独立成块，不要两格合成的长砖；尺寸比 v4
     稍小、更密集；「网格化排列」（对齐阵列）。
   - b. **砖面禁绝网格**：24px 细分格全部去掉——「网格是多余的，显得
     很廉价」；砖面改**磨砂质感或灯光质感**（frosted / lighting），
     绝对不要网格纹路。
   - c. **指针邻域翘起跟随保留**（v4 弹簧场机制 David 认可）。
   - d. **背景墙随页面滚动**（推翻 v4 的 fixed 定案）——滚动时墙和内容
     一起动，不是墙定内容滑。
2. **按钮**：
   - a. 与砖块**完全同风格同材质**（一眼同族），全站按钮统一按此做；
   - b. 形态 = 长条砖（比方砖窄/矮一点的 bar）；
   - c. 交互 = 像砖一样**跟随鼠标摆动**（pointer-driven tilt，不只是
     idle 呼吸）+ 按钮背后**带一点亮光**（backglow），风格与砖统一。

## 被推翻/待修的 v4 定案（修 spec + CLAUDE.md，别带着旧口径干活）

- v4 spec **C.1「fixed 单实例」→ 改「随滚墙」**；**C.2 几何表全部重定**
  （方砖/密度/缝宽）；砖面材质栈里的细分格条目删除；C.3 层次纪律
  （L0/L1/L2）与「无单一色调平底」验收线**继续有效**。
- CLAUDE.md §2 满铺条款、§4「Radial Glow / Wall」条目、§6 `brick-tilt` /
  `btnHoverIdle` 条目、§7 按钮条目——按 v4.1 定案重写，文档与实现零出入。
- **§6 FORBIDDEN「noise texture overlays」与「磨砂质感」的关系必须裁决**：
  若用噪点实现磨砂 → 需修法开窄豁免（仅砖面/按钮面材质、低对比度、
  静态非动画）；若用渐变光效实现 frosted 观感 → 不触法。实测小样定。
- §7 的 `btnHoverIdle`（idle 呼吸+微晃）可能被 pointer-driven tilt
  **取代或叠加**——定案后同步修法；「同元素同属性动画冲突」分层纪律
  在任何方案下都不许破。

## 技术候选与 v4 预研结论（实测沉淀，直接可用）

- **随滚 + 预算恒定的候选解**（WF 架构核心权衡，两案实测对比后定）：
  1. 墙层保持 fixed（DOM 数恒 = 视口面积），JS 在滚动时给砖场整体写
     `translateY(-(scrollY mod pitch))` + 行回收（滚出的行补到另一端）
     ——视觉上墙随页滚，预算不涨；指针 retarget 坐标补滚动偏移；
     砖 pattern 周期重复所以 mod 回卷无缝。风险：滚动 rAF 写 transform
     的帧预算、回收行上残留倾斜态的处理（离屏重置即可）。
  2. 绝对定位全文档高的墙容器（静态 CSS 渐变材质天然随滚、无 JS 路径
     零成本零 DOM），JS 砖场只窗口化当前视口区间（滚动时增量补砖/回收）。
     风险：文档高变化（路由切换/内容伸缩）监听、窗口化逻辑复杂度。
  - 无论哪案，**静态材质 CSS 直出的约束不变**：无 JS / 触屏 / RM 三路径
    也必须看到完整方砖墙材质；JS 只接管「动」，接管瞬间像素等价
    （v4 的 `data-bricks` 同帧切换机制继续用）。
- **方砖静态阵列的免 DOM 画法比 v4 简单**：对齐阵列（无错缝）下，
  `conic-gradient(from 90deg at <seam>px <seam>px, <face> 0 90deg, transparent 0)`
  + `background-size: cell cell` **单层背景即可画出方形砖面**（缝在 tile
  左/上缘），不再需要 v4 的奇偶行双元素 + mask-composite intersect。
  磨砂/灯光叠加层如何被约束在砖面内（不溢入缝隙）实测定——v4 经验：
  background 多层 + 周期对齐硬停点能解决大部分；解决不了再上 mask。
- **v4 资产直接改造复用（别重写）**：
  - `WallBricks.tsx`：弹簧场积分器/懒构建/收敛停帧/预算护栏/z 切换/
    RM teardown/window 级监听——全部保留，改 pitch、砖面类与滚动策略；
  - `ModuleButton.tsx`：组件骨架、7 个使用点、双栖（无 'use client'）、
    `:has(:disabled)` 停摆——保留，换材质层与交互层；
  - `--mat-*` token 机制与「JS 只读不定」的 CSS 变量 pitch 阶梯——保留，
    值按新材质重定；
  - globals.css 按钮引擎的 `--btn-dy` 状态机 / 双伪元素层序（::after 面板
    z-1 / ::before 插槽 z-2）/ 尺寸锁定——v3 踩坑资产，别丢。
- **密度与预算**：David 要更小更密。方砖 96×96 @1440×900 = 150 砖；
  72×72 = 260 砖，超 v4 沿用的 220 上限 → **预算上限本身要重新实测定案**
  （FPS 说了算，别无脑沿用 220）；大屏 pitch 阶梯（CSS 变量 + MQ，
  JS 只读）机制保留，档位按方砖重排。
- **按钮 pointer tilt**：同屏按钮 ≤3 颗，可每按钮独立小弹簧（参数族参考
  HeroObjectPhysics：ROT k30 ζ0.6；砖场 k40 ζ0.55）或并入砖场 retarget
  循环；backglow 用物件 `bp-object-backglow` 语言的小号版（低 α 径向，
  哑光禁强 bloom）。触屏/RM 降级：静态悬空姿态 + :active 按入（v3/v4
  机制原样）。
- v4 踩过的新坑（记忆正本之外的本次增量）：砖面基底 α 太低（0.55）会让
  透光层光带穿透砖面形成鬼影线——v4 实测定 0.75；elementsFromPoint 探不到
  pointer-events:none 的墙层（命中测试排除）；Playwright 无头下 OS 真实
  光标悬在窗口上会真触发 pointermove（截图里砖被点亮不是 bug）。

## 必读（按序；通用技法与硬不变量见记忆正本，不复述）

1. 仓库根 `CLAUDE.md`——当前为 v4 修法后版本（其中 §2/§4/§6/§7 将被你
   再次修订）
2. `docs/superpowers/specs/2026-07-26-living-blueprint-v4-design.md`——
   v4 定案（本次部分推翻；未推翻部分与权衡记录仍有效）
3. `docs/superpowers/briefs/2026-07-26-living-blueprint-v4-brief.md`——
   v4 原始任务书（硬约束清单全部继续有效）
4. 项目记忆 `browser-testing-3d-css-pitfalls.md`——验证技法/代码硬不变量
   唯一正本
5. 项目记忆 `reference_site_structure_ledger.md`——路由/产品清单/es5 陷阱

## 硬约束（v4 任务书原样有效，重申最要命的）

- 零依赖路线；动画属性只 transform/opacity/filter/stroke-dashoffset；
  禁 backdrop-filter；单蓝色相 + 中性明度轴；圆角只有 8px 与 rounded-full
- SSR 可见基态纪律；LCP 恒为各页 h1；`prefers-reduced-motion` 三件套；
  tsconfig es5 禁 Map/Set for...of
- **五路径实测**（RM / 无 JS / 触屏 / 390px / 微信 curl 验 SSR DOM +
  请 David 真机）+ 桌面滚动 FPS + 「砖墙不干扰文字可读性」独立验收
- `npm run lint` + `npm run build` 通过；CLAUDE.md 修法与实现零出入
- 完成后 code-review-loop 至零 verdict-changing（修复后必重审），
  主对话输出结构化审查汇报
- push 走 443 已永久配置，普通 `git push` 即可

## 流程

读必读 → 砖墙/按钮各出 2-3 概念草案 + 权衡（含：随滚架构两案实测对比、
方砖几何/密度/预算参数表、磨砂 vs 灯光材质两版小样截图对比）→ 你做最终
判断并说明理由 → 写 v4.1 设计定案（specs/ 新文件，逐条注明推翻 v4 哪些
定案）→ 实施 → 3100+ 端口起 dev server 截图自检迭代（桌面 + 390px +
冻帧 + RM 旗标 + curl SSR DOM）→ code-review-loop → 结构化汇报。

这是公司门面，宁可多迭代两轮视觉，不要一次交付了事。
