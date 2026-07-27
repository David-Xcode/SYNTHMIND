# Blueprint Object v3.1 · Nameplate & Living Traces 铭牌与活纹路 — 设计定案

> 日期：2026-07-27 ／ 状态：✅ **已实装**（commit `2499e43`「feat(design): Blueprint
> Object v3.1 实装 — Archivo 铭牌三层叠印 + 间歇式活纹路三件套」）
> **本文是物件系统的现行正本**——描述的是现状，不是未来计划。
> 前作：2026-07-27-blueprint-object-v3-solid-design.md（v3 哑光实体，本次改动的几何/材质基座，已实装并推送 `c7e5042`）
> David 两项方向决策（2026-07-27 确认）：**SYNTHMIND 用 Archivo 宽体铭牌** ／
> **纹路动画走克制仪器档（间歇式三件套）**

## 0. 诉求与诊断

| David 反馈 | 根因 |
|---|---|
| 文字要有质感，尤其 SYNTHMIND，要一看就高级 | 所有标注是单层平涂 fill = 「印刷贴纸」；SYNTHMIND 与 S.01 同字体同待遇，读作「图纸注释」而非「机器铭牌」 |
| 纹路要是动画的纹路，不是贴图感 | 蚀刻线 bp-draw 入场画完后**永久静止** = 静态贴图；机器没有「运行中」的叙事 |

两条硬约束全程有效：动画属性只许 transform / opacity / filter / stroke-dashoffset
（filter 实际不用——哑光禁 bloom）；**3D 面内部动画迫使该面逐帧重栅格化**，
持续动画 = 持续重绘，一切新动画必须**间歇式**（episodic：短爆发 + 长 hold，
hold 段属性值不变 → 浏览器零重绘）。

## 1. 铭牌系统（Nameplate）

### 1.1 SYNTHMIND → Archivo 宽体凸起字

- **字体**：`font-display font-semibold stretch-wide`（Archivo 变量字体 wdth 116%，
  根 layout 已加载，SVG `<text>` 直接吃 CSS class 零新资源）；大写；
  fontSize **14**（桌面）/ **12**（移动）；letterSpacing **0.14em**；
  fill 升 **txt-secondary**（#A6AEBA——铭牌是 M.01 面板的主角，比图签亮一档）。
- **三层叠印（凸起字光影，premium 的物理来源）**，同组三份 `<text>` 同 x/y 基线：
  1. 下投影副本：dy **+0.9px**，`fill: rgba(0,0,0,0.5)`（明度轴，物件豁免内）
  2. 主体：fill-txt-secondary
  3. 顶部受光副本：dy **−0.6px**，`fill: rgba(255,255,255,0.05)`
  - ⚠️ 第 3 层在 3D 栅格化面上小字号可能糊成灰边——实施时 A/B，糊即砍
    （两层已足够成立，第 3 层是锦上添花）。
  - 三层同组共享一个 bp-fade 入场（delay = T.labels，与其他标注同波次）。
- **排版细节**：`text-rendering: geometricPrecision` 可试（非强制）；
  基线 y≈38（60px 图签栏视觉居中，凸起字含投影后重心略高，实施微调）。
- **布局连锁**：Archivo 14px + 0.14em 字距下 SYNTHMIND ≈ 105–115px 宽
  （x14 起 → 尾 ≈ x125），左栏图形比例尺需右移/缩短，
  约束 = 与铭牌尾距 **≥12px**，不重叠即可，坐标实施实测定。
  移动端 x12 起、divider x188 前余量充足，无需挪分栏。
  **实施实测（2026-07-27）**：铭牌真实尾端 x131.4（getBBox，比预估宽
  6px+），比例尺定 **x148..188（段距 10）**，净距 16.6px；
  改铭牌字号/字距必须重测此项（余量非充裕）。

### 1.2 全标注微雕（冲压质感统一语言）

其余 mono 标注（S.01 / 1:1 / ELEV. / SYNTH CORE / 模块码 M.01–M.07 / H 440）
统一加**单层下投影副本**（dy +0.75px，`rgba(0,0,0,0.45)`）——「冲压进面板」。
**封装进 `MonoLabel` 组件内部**（默认开，渲染两份 `<text>`），一处实现全局生效；
SYNTH CORE 的 accent fill 保持，仅加同款投影。图签格字体不动——
**铭牌归铭牌（Archivo），图签归图签（mono）**。

### 1.3 弃案记录（连同理由，防回潮）

- **入场镜面扫光（glint/sheen）**：正面撞 CLAUDE.md FORBIDDEN `shimmer /
  shimmer gradients` 禁令 → 弃。质感全由静态光影层次承担（「注意到才看见」）。
- **SVG filter 浮雕（feOffset/feGaussianBlur）**：3D 栅格化面上 Safari 行为不稳、
  <1px blur 不可靠 → 三层叠印替代。
- **HTML span 叠面 + background-clip:text**：引入双坐标系与 background-position
  动画诱惑（非白名单属性）→ 弃，全部留在 SVG 内。

## 2. 活纹路（Living Traces）— 克制仪器档三件套

> 观感目标 = **运行中的精密仪器**，不是科幻 HUD。全部间歇式、错峰、
> **桌面变体专属**（移动端已有 corePulse/seamPulse 呼吸；1px 脉冲在小屏不可读
> 且费电——移动蚀刻表不含 overlay 即天然不渲染，零 CSS 门控）。
> 新动画 delay 一律 **≥3s**（入场编排 ~2.8s 收尾后接管），入场时序表 T/MT 不动。

### 2.1 `trace-pulse` — 数据脉冲沿走线流动（stroke-dashoffset）

- **载体**：既有走线之上叠 overlay `<path>`（同 `d`、`fill="none"`、
  stroke `rgba(74,159,229,0.85)`、strokeWidth 1.25、linecap round、
  **`pathLength={100}`**、strokeDasharray **"4 196"**）。
  **实施修订（2026-07-27）**：原定 "4 96" 的图案周期恰 = pathLength 100，
  而 dasharray 沿路径**无限平铺**——offset −100 ≡ 0 (mod 100)，hold 期
  会有一节 dash 永久停在路径起点、基态在路径尾露一节（冻帧实测发现）。
  gap 提到 196（图案周期 200 > 行程 108）后基态/hold 才真正不可见
  （行程 108 = 关键帧 4 → −104 的最终值，见下方「关键帧」段的 L1 修订；
  gap 定值时的中间口径写作 104/−100，已被该修订取代）。
  ⚠️ overlay **不得**挂 `.bp-draw`（那套用 pathLength=1 归一化，互斥）。
- **段落**（桌面，d 逐字复制既有走线）：
  - A · M.05 出线：`M102 42 H193 V83.5`（周期 9s）
  - B · M.04 入线：`M193 0.5 V59 H166`（周期 11s）
  - C · M.04 出线：`M123 100 V108 H256 V117.5`（周期 13s）
  - D · M.03 主干+左分支：`M128 0.5 V20 H62 V38`（周期 15s；注意这是拼合 d，
    overlay 专用，不影响既有三笔蚀刻）
- **关键帧**（invisible-hold 技巧，无需 opacity gate）：
  `0% { stroke-dashoffset: 4 }`（dash 整体在路径起点之前，不可见）→
  `12% { stroke-dashoffset: -104 }`（dash 已滑出终点，不可见）→
  `100% { -104 }`（hold，零重绘）。一次可见爆发 ≈ 周期 ×12%。
  **实施修订（2026-07-27）**：hold 值由 −100 退到 **−104**——−100 时
  dash 可见区间退化为路径终点单点，零长 dash + round cap 是渲染器
  行为分歧的经典分支（Skia 会画圆点），退 4 单位留出余量。
  另记：pathLength 归一化 + 各段周期不同 ⇒ 四段线速度不同
  （58–123px/s），属「各段独立节律」定案的一部分，不追求等速。
- **节律**：周期 9/11/13/15 互异 + delay 交错，与 seamPulse（7s 系）/modDrift
  相位岔开。⚠️ **「互质」措辞已作废（第二轮审查发现）**：gcd(9,15)=3，A/D 的
  LCM 仅 45s——两段相对相位**永久锁定**，可见窗间隙恒为 0.06s（A `[18,19.04]`
  对 D `[19.1,20.83]`，每 45s 精确复现）。当前是靠 delay 实算解**精确躲过**，
  不是靠互质周期的慢漂移躲过；**改任一 dur/delay 必须重跑碰撞实算**，
  按「互质所以安全」推会造出每 45s 必现的固定碰撞。
  **实施修订（2026-07-27）**：原定案「任意时刻 ≤1 张面在重栅格化」
  对所有时刻**数学上不可满足**——周期互异下相位残差必然遍历全部间隙（A(9s)
  对 B(11s)：7 个可见窗 mod 11 的危险邻域宽 2.4s > 残差最大间隙 2s，60s 内
  必碰撞；网格搜索 0 解实证）。验收线修订为：**首次跨面碰撞尽量晚 +
  180s 总碰撞最少**。实装 delay = 实算最优解 **A 9s / B 10.6s / C 12.1s /
  D 4.1s**（首碰 54.6s，180s 内 11 次亚秒级重叠；原示例 4.2/6.8/9.4/12
  在 13.2s 即碰撞，弃用）。方向 = 内容流向自上而下（文档→核心→焊盘）；
  seam 光是自下而上的「呼吸」，两者叙事正交不冲突。**不做跨段精确接力**
  ——模块漂移本就会拉开缝口，接力假象无法维持，各段独立节律即为定案。
- **哑光**：无 blur、无 glow 副本、头 α ≤0.85。

### 2.2 `pip-cycle` — 状态灯序列（opacity）

- **M.04 三格 pips**（x304/318/332 y92 的 6×6 方格）：格内各加 accent 小方
  fill 副本（约 4×4 居中），三份 opacity 错相轮转（周期 **6s**，每格亮 1/3 相位，
  淡入淡出 ~0.4s 缓坡防跳闪）。现静态 NodeDot(307,95) 由「pip1 基态常亮」替代：
  **基态 = 第一格亮**，动画覆盖轮转——RM 下 animation:none 自然回落
  「第一格常亮」的静态完成态（RM = 停机照，不是黑机器）。
- **M.07 端口阵列**：active 点在 4 端口间换位（4 份 NodeDot 錯相，周期 **8s**）；
  基态 = 左上格亮（与现状一致）。M.03 端口阵列**不动**（保留静密度对比）。
- 入场兼容：cycling 元素 = bp-fade 入场 + 无限轮转两段动画逗号并联
  （seam glow 的 seamIn+seamPulse 同款先例），轮转 delay ≥3s。

### 2.3 `ring-step` — 核心刻度圈步进（transform）

- **载体**：桌面 M.04 的 r37 虚线刻度圈（DashRing 输出的 path）。
- **机制**：`animation: ringStep 120s steps(24, end) infinite` +
  keyframes `from { rotate 0 } to { rotate 360deg }` → **每 5s 瞬跳 15°（一格）**，
  24 格无缝循环；steps() 跳变间零插值 = hold 段零重绘，且「刻度轮跳格」
  比连续旋转更「仪器」。
  **实施修订（2026-07-27，审查发现）**：24 段虚线圈对 15° 旋转**具有旋转
  对称性**——每步把第 i 格精确挪到第 i+1 格原位，圈自身的步进是逐像素
  空操作（唯一非对称是闭合缝 0.05px 级，亚像素）。定案补一个 **index
  索引亮格**：与圈同组 `<g class="bp-ring-step">` 旋转的更亮一格
  （12 点位起步，STROKE.core 1.5px，弧长 ≈ 一格 dash），每 5s 可见地
  跳到下一格——仪器盘本就靠索引读格。index 弧在圈上不扩包围盒，
  fill-box 锚点仍 = 圈心。
- **SVG 旋转锚点**：`transform-box: fill-box; transform-origin: center`
  （圈几何中心 = (123,59)；WebKit 上没有 transform-box 时 origin 会落到
  viewBox 原点——这两行缺一不可，实施后必须 Safari 实测）。
- 移动 r20 圈不做（桌面专属总则）。

### 2.4 RM / 降级

- 三件套 + 微雕投影层：投影层是静态的不涉 RM；`trace-pulse` overlay 在 RM 下
  `animation: none; opacity: 0`（overlay 静态无意义，直接隐掉）；
  `pip-cycle` / `ring-step` RM 下 `animation: none`（回落静态完成态）。
  全部进 globals.css 既有 reduced-motion 块（对号入座，勿新建块）。
- 无 JS 依赖：三件套纯 CSS，SSR 直出即动（与物件全体一致）。

## 3. 纪律配套（CLAUDE.md 两处修订，实施时同步）

1. **§3 Typography**：`font-display`「NEVER for body text」行补铭牌豁免——
   「物件机身品牌铭牌（BlueprintObject 的 SYNTHMIND）属 display 用途，允许；
   图签编号/测量标注仍 mono-only」。
2. **§6 白名单 +3 条**（连参数上限一并入册）：
   - ✅ `trace-pulse` — 走线数据脉冲（stroke-dashoffset invisible-hold 间歇式；
     dash 4 gap 196 @ pathLength 100（gap > pathLength+dash 防周期回绕，
     实施修订见 §2.1）、头 α≤0.85、零 blur；周期 ≥9s **各异（非两两互质——
     gcd(9,15)=3，见 §2.1 碰撞实算）** + delay 实算错峰、
     可见窗 ≤15%；仅 BlueprintObject 桌面变体走线 overlay）
   - ✅ `pip-cycle` — 状态灯序列（opacity 错相轮转，周期 ≥6s；RM 回落首格常亮；
     仅 BlueprintObject pips/端口阵列）
   - ✅ `ring-step` — 刻度圈步进（transform rotate steps(24)，5s/格；
     禁连续旋转——持续重栅格化；仅 BlueprintObject 核心刻度圈）
3. 颜色零新增：accent 既有 alpha + 明度轴投影副本，全落在 §4 物件豁免现口径内。
4. FORBIDDEN 不动：shimmer 仍禁（trace-pulse 是 dashoffset 位移不是渐变扫光，
   语义上是「信号」不是「光泽」）。

## 4. 实施与验证（新 session 执行清单）

**改动文件**：`src/components/home/BlueprintObject.tsx`（铭牌三层 + MonoLabel
微雕封装 + overlay 段落 + pip fill 副本）、`src/app/globals.css`
（`.bp-trace-pulse` / `.bp-pip-cycle` / `.bp-ring-step` keyframes + RM 块补条目）、
`CLAUDE.md`（§3 豁免 + §6 白名单）、本 spec（如实施偏离，回写修订）。

**验证**（全部过一遍再收工）：
1. `npm run build` + 桌面 1440/1100、移动 390 三档截图（3100+ 端口纪律，
   Chromium 为准；先查 3000 占用规矩照旧）
2. DevTools paint flashing：三件套 hold 期**零重绘**；爆发窗口错峰
   （任意时刻 ≤1 面在栅格化）。⚠️ 读数口径：M.04 面有 v2 遗留的 corePulse
   连续呼吸（5s infinite，白名单在册），该面 paint flashing **恒有底噪**
   ——验收标准是「三件套不新增重绘」，不是该面读出字面的零
3. 4× CPU throttle 跑入场 + 常态 60s（连带 v3 spec §8 遗留的入场性能项一并测）
4. 铭牌清晰度实测：14px Archivo 在 3D 栅格化面上若糊 → 升 15px 或减字距；
   第 3 受光层糊即砍
5. RM 模式：物件为静态完成态、pip 首格常亮、overlay 隐藏
6. Safari/WebKit：ring-step 的 transform-box 锚点、三层叠印亚像素偏移不糊
7. 完成后跑 code-review-loop（强制），终局汇报含轮数与逐轮修复

**已知坑（从 v3 实施继承，别再踩）**：`.bp-draw` 只能 `<path>` 且与装饰
dasharray 互斥；WebKit 零平面相交与 preserve-3d 链纪律照旧（本次不动几何，
理论零风险，但 overlay path 别忘 `fill="none"`）；工作区若并存其他 session
未提交改动，globals.css 编辑走精确锚点 Edit，不整段重写。
