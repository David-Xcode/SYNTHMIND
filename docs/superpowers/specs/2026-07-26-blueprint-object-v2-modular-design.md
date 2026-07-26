# Hero「Blueprint Object v2 — Modular Assembly」设计定案

> v1（单体轴测核心体）→ v2（独立模块砌合组合体）。参考基准：Resend 魔方的
> 模块化形态与永动质感——但不抄其镜面材质，Blueprint 哑光制图语言不变。
> v1 正本：`2026-07-25-blueprint-object-design.md`（弹簧物理/透视链/降级链结论全部继承）。

## 1. v2 要补的四个缺口

1. 模块化：单体盒子 → 独立模块组合体（各自几何 + 各自慢动作周期）
2. 无限循环：入场播完后永不停止的缓慢错位/归位循环
3. 单模块交互：hover 单个模块有独立反馈（不只是整体旋转）
4. 移动端显示：v1 `<lg` 整体隐藏 → v2 390px 视口可见（LCP 不劣化）

## 2. 概念定案：「Bonded Assembly」砌合组合体

被否概念：A「Sliced Sections」纯水平切片塔（咬合感弱，读作切吐司）、
C「Core Orbit」核心环+滑轨托架（机械花哨，偏离静默精密）。

定案 B：280 × 344 × 120 组合体，5 行模块，其中顶行与输出行做**反向错缝
竖向分割**（180/94 与 94/180，砌砖 bond pattern）——共 7 个独立模块，
自下而上编号 M.01–M.07（右侧面 8px mono 模块码，真实装配序列，结构性编号；
仅右缘模块渲染右面，M.02/M.06 的内墙面不渲染——见 §4 WebKit 纪律，
其模块码随之省略，等同制图中只标可见件）：

| 行 | 模块 | 前面板几何 (x,y,w,h) | 叙事角色 | 漂移轴/幅度/周期 |
|----|------|---------------------|----------|------------------|
| R1 | M.01 base | 0,296,280,48 | 图签底座（SYNTHMIND / S.01 / 1:1）| 静止锚（基准）|
| R2 | M.02 out-L | 0,224,94,66 | 通风格栅 hairline | −X 8px / 14s |
| R2 | M.03 out-R | 100,224,180,66 | 双输出焊盘 + 分线 | +Z 12px / 16s |
| R3 | M.04 core | 0,126,280,92 | SYNTH CORE 圆环，前脸内凹 8px (z=52) | +Z 14px / 11s |
| R4 | M.05 input | 0,54,280,66 | 输入文档蚀刻 + 下行走线 | +X 10px / 15s |
| R5 | M.06 cap-L | 0,0,180,48 | 顶面十字基准 + 裁切角 | −X 8px / 13s（+X 会与 M.07 共面互穿）|
| R5 | M.07 cap-R | 186,0,94,48 | 小端口模块 | +Z 14px / 10s |

- 水平缝 6px × 4 道 + 竖缝 6px × 2 道（R5 x180-186、R2 x94-100）
- 总高 48+6+66+6+92+6+66+6+48 = 344；进深统一 120（core 前脸内凹至 z=52）
- 全高尺寸标注从 v1 的右侧面**升维为链外浮动基准面**（x=310 的 rotateY(90)
  平面，面宽 90 防 svg overflow 截断标注；x=310 大于 M.05 全部位移峰值平面
  （drift+hover 296 / asm 304），永不共面 z-fight 且尺寸线不压件）：
  基准不动、模块在动——制图里尺寸线本来就浮在体外
- 前面电路走线跨模块对齐（输入模块下行 → 穿缝 → 核心环 → 下行 → 输出分线），
  模块错位时走线瞬时错缝 = 组合体活着的证据；缝口端点配焊盘圆点

### 缝隙发光（内部光）

每道缝后方 z=54 埋发光条（accent 低 alpha 线性渐变 + 2px blur，克制不做强
bloom；z 太深会被 16° 俯角吃掉，54 实测恰好漏出可感知光带）：对齐时从 6px
缝里漏微光；模块滑出时露出更多——「错开露内光」是自动几何结果，
不需要额外联动逻辑。条带尺寸超出缝口（横条 h14、竖条向漂移方向加宽 16）：
溢出部分静止时被 z60 前脸挡住，漂移峰值让开时自动补位覆盖投影缝隙；
溢到内凹 core 前脸（z52）边缘的 4px 软光是有意设计——光槽托出内凹面板
（hover 叠加漂移的峰值残留 ≤4px 透光由 blur 与 backglow 兜底）。
发光条平面不得与任何面相交（WebKit 纪律，见 §4）。四道水平缝以 stagger
delay 做自下而上的呼吸脉冲（seamPulse，~7s 周期）= 数据自底向上流经组合体。
核心环叠一层 corePulse 微光呼吸（5s）呼应。

## 3. 路线定案：继续 CSS preserve-3d，二次否决 WebGL

带着 v1 判断重新权衡后的理由：

1. **材质天平未真正回摆**：Resend 是镜面黑（WebGL 主场），但 v2 不抄材质——
   Blueprint 哑光 flat shading + hairline 蚀刻恰是 CSS 逐面渐变的正确解域；
   WebGL 剩余独有收益只剩动态自阴影/AO，在安静小幅运动 + 深底下感知增量小，
   镜面/强 bloom 本在禁区
2. **移动端新需求加重 WebGL 代价**：物件移动端要显示 → three+r3f ≈170KB gzip
   进移动首屏路径，与 LCP 硬约束正面冲突；CSS 路线移动端 = 同一 DOM 缩放
3. **降级链**：CSS 保持 SSR 直出静态完成态 / 无 JS / RM 一套 reset 全覆盖；
   WebGL 需维护 ssr:false + 降级双路径
4. **自阴影缺失的补偿即设计**：缝隙内部光把「遮蔽暗部」替换成「内里发光」
5. 量级安全：7 模块 ≈ 23 个平面（16 面 + 6 发光条 + 基准面），v1 三面结构
   已实测 75fps；所有动画仍只碰 transform/opacity/filter/stroke-dashoffset

CSS 路线已知上限（如实记录）：无动态自阴影/环境光遮蔽；模块间光影互动
全靠固定渐变 + 缝光，侧脸明暗不随错位变化。

## 4. 架构（继承 v1 透视链，模块层三层解耦）

```
HomeHero
└─ .bp-object-stage  移动端缩放台（<lg scale .64 + 高度收紧；≥lg 原尺寸）
   └─ HeroObjectPhysics  'use client' — 弹簧物理原样保留（≥lg + 细指针专属）
      ├─ .bp-object-backglow / .bp-object-shadow  链外固定光源（v1 原样）
      └─ .bp-object-spring  rAF 弹簧写 rotateX/rotateY/scale
         └─ BlueprintObject (Server) .bp-object-root
            └─ .obj-float → .obj-sway → .bp-object(轴测基姿态)   ← v1 原样
               ├─ 7 × .bp-module  模块定位框（前面板矩形 x,y,w,h）
               │  └─ .bp-mod-asm    入场装配位移（fill both，沿签名轴滑入）
               │     └─ .bp-mod-drift  无限漂移循环（0% 即静止位，无 backwards fill）
               │        └─ .bp-mod-hover  hover 偏移（transition，@media hover:hover）
               │           ├─ .bp-face front（蚀刻 SVG + .bp-draw 棱线 + boost 层）
               │           ├─ .bp-face right（仅右缘模块——M.02/M.06 内墙面不渲染；
               │           │   M.NN 模块码 / 面板缝）
               │           └─ .bp-face top（仅 M.06/M.07 — 其余顶面藏在缝内不渲染）
               ├─ 6 × .bp-seam-glow  缝隙发光条（z=54，不与任何面相交——
               │    WebKit 无平面切分按质心排序，相交会让缝口 sliver 整条消失；
               │    内墙右面/非顶行顶面不渲染正是为守住这条不变量）
               └─ .bp-datum  浮动尺寸基准面（H 344，静止，x=310，pointer-events:none）
```

三层 wrapper 纪律（v1 结论推广）：入场 / 循环 / hover 三种 transform 永不
共存于同一元素——分层组合替代同属性动画冲突。**链上每层都必须
`transform-style: preserve-3d`**（WebKit 压扁坑，v1 踩过）。

单模块 hover = 纯 CSS `:hover`（模块 wrapper 命中区 = 三个面 div 的并集，
指针事件从面冒泡）：沿签名轴偏移 ~60% 漂移幅度 + 该模块 boost 描边增亮。
整体弹簧 scale/edge-boost（JS）保留，全局 boost 降为 0.35 让位单模块反馈。
JS 物理层唯一职责不变：yaw/pitch 跟随 + 整体 hover 弹簧——零改动复用。

## 5. 入场编排 v2（Draft → Build → Ship，装配叙事）

| 阶段 | 时间 | 内容 |
|------|------|------|
| Draft | 0 – 1.5s | 各模块棱线逐笔绘制（自下而上 stagger：M.01 先画）|
| Build | 0.9 – 2.4s | 面板实体化 + **模块沿签名轴滑入装配位**（modAssemble，自下而上）|
| Ship | 1.6 – 3.0s | 蚀刻/走线绘制 → 图签文字 → 缝光亮起 → 焊盘圆点（2.45s+0.5s 收尾）|
| 常态 | 3s 起 | modDrift 各模块错峰接管 + seamPulse/corePulse + v1 呼吸/摇曳/投影 |

modAssemble 与 modDrift 各走一套 per-module CSS 变量（装配 --ax/--ay/--az，
漂移 --dx/--dy/--dz，hover --hx/--hy/--hz）+ 单一关键帧规则（var() 在关键帧内
取值），周期/相位走 --drift-dur/--drift-delay/--asm-delay 变量。
modDrift 关键帧节奏：0-32% 停驻 → 44-56% 滑出停驻 → 68% 归位 → 100%（首尾
identity，delay 期间零影响，接管零跳变）。错峰 delay 保证任意 5s 窗口有模块在动。

## 6. 降级路径（v1 基础上的增补）

| 条件 | 行为 |
|------|------|
| reduced-motion | 既有通配 reset 让 draw/fade/solidify/assemble 落终态；**新增显式 `animation:none`**：.bp-mod-drift / .bp-seam-glow(pulse) / .bp-core-pulse；缝光/核心微光补静态终值 opacity |
| 无 JS / hydration 前 | Server 直出装配完成态 + CSS 入场与循环照常，仅无指针跟随 |
| 触屏 | 指针物理不挂载（v1 门控原样）；模块 :hover 规则包在 `@media (hover:hover)` 内防触屏粘滞 |
| 移动端 <lg | **不再隐藏**：.bp-object-stage 缩放 ~0.64 居中显示于文案下方，循环动画照常；物理层 JS 门控原样不挂载；.hero-tilt 滚动倾斜收窄为 ≥lg 专属 |
| 老内核 | 物件全部为普通 CSS 动画，不依赖 animation-timeline |

## 7. 文件清单

- 重写 `src/components/home/BlueprintObject.tsx`（模块数据驱动：MODULES 常量表）
- 微调 `src/components/home/HeroObjectPhysics.tsx`（仅注释更新，物理逻辑零改动；
  全局 boost 系数 0.9→0.35 在 globals.css 的 `.bp-edge-boost`）
- 修改 `src/app/globals.css`（modAssemble / modDrift / seamPulse / corePulse /
  .bp-seam-glow / .bp-datum / .bp-object-stage / hero-tilt 媒体收窄 / RM 增补）
- 修改 `src/components/home/HomeHero.tsx`（移动端显示接线）
- 修改 `CLAUDE.md` §6 白名单增补

## 8. 白名单修法（CLAUDE.md §6）

- ALLOWED 增补：`modAssemble`（入场装配滑入）、`modDrift`（模块错位-归位无限
  循环，幅度 ≤14px）、`seamPulse` / `corePulse`（缝隙/核心微光呼吸）、
  模块 :hover 偏移（transition ≤10px，仅 hover:hover 设备）
- 移动端条目修订：Hero 物件 <lg 缩放显示（非隐藏）
- 零依赖立场不变

## 9. 验收（任务书原样）

- 桌面 Chrome 满帧；390px 视口可见且 LCP 不劣化；任意静止 5s 有模块动作
- 模块互动可感知；单模块 hover 独立反馈；快速划过惯性回摆（v1 弹簧）
- reduced-motion / 无 JS / 触屏 / 移动端 四路径实测
- lint + build 通过；code-review-loop 至零 verdict-changing 问题
