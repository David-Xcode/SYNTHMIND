# Living Blueprint v4.2 —「翻板砖墙 / 无底纹排版 / 嵌墙按钮」设计定案

> David 看过 v4.1 实机后的三条返工令落地：砖墙翻开幅度到 ~80° + 密度加倍 +
> 光从墙里照出来；移除全部 section 底纹、可读性全押字体对比度；按钮按
> BlueprintObject 模块语言重做（hover 凸出 / 移开凹进）。
> 上位正本：`2026-07-26-living-blueprint-v4.1-design.md`（未推翻部分仍有效）、
> `2026-07-26-living-blueprint-v4-design.md`。
> 任务书：`docs/superpowers/briefs/2026-07-26-living-blueprint-v4.2-brief.md`。
> 概念草案与实测数据：本文各节（铰链三案截图、密度×架构×FPS 七组实测、
> 光强小样、按钮三案小样）。

---

## 0. 推翻清单（v4/v4.1 → v4.2，逐条注明）

| 旧定案 | v4.2 裁决 | 依据 |
|---|---|---|
| v4.1 §2.3「fixed 场 + mod 回卷」全场接管架构 | **推翻** → 指针邻域动态砖池（文档级锚定，合成器精确随滚，零回卷零状态行转移） | §2.2 架构三案实测 |
| v4.1 §2.2 pitch 96 阶梯（80/96/128/192） | **重定** → 48 基准（≥2200px 64 / ≥3600px 96；<640px 档删除，静态 tile 全屏同密） | David 原话 1b「密度 ×4」；§2.1 |
| v4.1 tilt ≤12° / lift ≤18px 语言 | **推翻** → 铰链翻板 ≤80°（过冲硬夹 88°）、背指针方向开板；tilt/lift 语言退役 | David 原话 1a；§2.3 |
| v4.1 预算「400/视口」+ 超限放弃增强 | **替换** → 砖池上限 512（与视口尺寸解耦，异形屏放弃逻辑整体退役） | §2.2 实测（风暴峰值 483） |
| v4.1 `data-bricks` 全场接管 + 静态面/光槽退场 + 双处渐变同步律 | **退役** → 静态面恒在，砖池逐格底衬遮蔽；「光槽渐变栈两处同步」条款作废 | §2.4 |
| v4.1「JS 路径滚动落后一帧」已接受代价 | **消灭**（非重提——架构换代的副产品）：砖池文档级锚定，墙体滚动全程合成器精确 | §2.2 |
| v4 C.3 / v4.1 层次纪律 L0/L1/L2 三级 | **推翻** → 二级 L0 墙 / L2 不透明卡片；`.sheet-panel`（L1）整体退役 | David 原话 2a；§3 |
| v4 C.3 接线「SiteFooter bg-bg-base/70」（v4.1 调 /70） | **推翻** → footer 透墙（摘除底色） | David 原话 2a「全部移除」 |
| v4「哑光禁强 bloom」的墙体光效口径 | **修订**（非推翻）：新增「指针邻域局部涌光」豁免——槽腔光心 α≤0.8、溢光 α≤0.45、随翻开角驱动、离开归零；全局静态光（缝光/洗墙光）维持原 α 不动 | David 原话 1c；§2.5 |
| v4.1 §3 按钮「悬空长条砖」语言全套（--btn-dy 状态机 / 底座插槽下移 5px / btnHoverIdle 呼吸 / backglow） | **推翻** → 嵌墙砖（rest 齐平 / hover 顶出 / active 按入）；呼吸、backglow、--btn-dy 双伪元素反向抵消全部退役 | David 原话 3；§4 |
| v4.1 §3.2 ButtonTilt 邻域跟随（RANGE 130px） | **改造保留** → 仅悬停期跟随（盒内满权重、盒外即零），幅度 5°→4° | §4.3 |
| v4 §6 float 豁免「两例：objFloat、btnHoverIdle」 | **缩编** → 仅 objFloat 一例（按钮呼吸退役） | §4 |
| SiteHeader 滚动态不透明 bg-base | **维持不动**（页头非 section，覆盖滚动正文，无 blur 前提下半透明必透字——v4/v4.1 原判继续有效） | — |

v4.1「已接受代价」小节其余条目（--mat-* 四个无 var() 消费 token 属交叉锁定表项、
ButtonTilt rect 缓存不追呼吸位移——后者随呼吸退役自然作废）继续有效/自然清算。

---

## 1. 实测环境与方法

- Playwright 头部 Chromium @1440×900（本机刷新率 ~75Hz，満帧 = 75fps）；
  裸原型页（无 React/站点内容），数字偏乐观，**相对比较**有效。
- 指针风暴：rAF 级 Lissajous 全屏扫掠 5s（≈2000px/s，远超真实使用强度）；
  滚动风暴：叠加 ±1500px 正弦滚动。
- 原型：`scratchpad/proto-wall/index.html`（参数化 arch/pitch/effect/hinge/
  radius/glow/弹簧系数）；截图小样同页定格（__freeze）。

## 2. WF-1 · 翻板砖墙（需求 1a/1b/1c）

### 2.1 密度定案：「缩小到四分之一」= 面积 1/4 = pitch 48px

| 解读 | pitch | @1440×900 全场砖数 | 实测判定 |
|---|---|---|---|
| **面积 1/4（定案）** | 48px | 600（虚拟格；砖池物化 ≤~80 常态） | ✓ 砖池架构下满帧 |
| 边长 1/4 | 24px | 2400 虚拟格 | ✗ 砖池也崩：25.3fps / 98 长帧 / 池峰值 1458（G 组） |

pitch 阶梯重排：基准 **48px**（seam 3px = pitch/16）；≥2200px → 64/4；
≥3600px → 96/6；**<640px 档删除**（窄屏静态 tile 同 48 密度，8 列 @390px
观感成立；移动端本就无 JS 砖）。

### 2.2 架构三案与 FPS 实测表（密度 × 架构 × 效果）

| 组 | 架构 | pitch | 效果 | DOM 砖 | avg / p95 fps | 长帧(>25ms) | 判定 |
|---|---|---|---|---|---|---|---|
| A | field（v4.1 全场） | 96 | tilt 12° | 165 | 75.0 / 72.5 | 0 | 基线对照 |
| B | field | 48 | tilt 12° | 600 | 75.0 / 72.5 | 0 | 裸页乐观；v4.1 真实站点同砖数实测掉帧（min 67fps），不采信 |
| C | field | 48 | flip 80° | 600 | 74.8 / 71.9 | 1 | 同上保留意见 |
| D | pool | 48 | flip 80° r150 k40 | 峰 296 / 滚动 410 | 75.0 / 74.1 | 0 | ✓ |
| E | pool | 48 | flip 78° r240 k40 | 峰 436 / 667 | 71.2 / 39.4 | 19–28 | ✗ 半径过大 + 缓落长尾堆积 |
| F | **pool r200 k60（定案）** | 48 | flip 78° | 峰 331 / 滚动 483 | 74.8 / 68.5 | 0–2 | ✓ 定案参数族 |
| G | pool | 24 | flip 78° r150 | 峰 1458 | 25.3 / 15 | 98 | ✗ 密度极端解读排除 |

**三案裁决**：

| 案 | 判定 |
|---|---|
| a. field 全场 DOM（600 砖常驻） | 否——真实站点 v4.1 已实测同砖数掉帧；600 静态 div 与 React 内容长期共存的合成负担只多不少；密度再涨即爆 |
| b. **指针邻域砖池（定案）** | ✓ DOM 成本与密度解耦（池只随影响半径走）；**文档级锚定** = 砖位直接写文档坐标，合成器逐像素随滚——v4.1「JS 路径滚动落后一帧」的已接受代价被架构消灭；零回卷、零状态行转移、零 mod 数学 |
| c. canvas 2D 砖层 | 否——静态材质 CSS 直出纪律（无 JS/触屏/RM 三路径像素等价）要求材质在 CSS 里有正本，canvas 等于把材质重造第二份且退化路径全部重写；性能上 b 已满帧，无需付此代价 |

砖池机制：cell 按文档 (row,col) 键控物化，指针半径 200px 内的格子从对象池
取砖（复用 DOM，display 切换）、设翻板目标；半径外目标归零，弹簧落定即回池。
**池上限 512**（风暴实测峰值 483；超限跳过本次新增物化，存量自然落定回收）——
预算与视口尺寸解耦，v4.1「异形屏超预算放弃增强」整套逻辑退役。CSS var 解析
失败仍放弃增强（静态墙原样）。

### 2.3 铰链几何定案（需求 1a）

**直改 `MAX_TILT=80` 被证伪**（任务书预判 + 原型确认）：绕砖心 80° = 砖面侧对
视线消失。定案 = **沿砖边铰链外翻**，且两个实现关键都有实测教训：

1. **铰链用「平移-旋转-回移」组合变换**（`translate3d(±face/2) → rotate →
   translate3d(∓face/2)`），**不用 transform-origin**：origin 挪到铰链边会把
   `perspective()` 的灭点一并拖过去，翻板透视张力尽失（原型 A/B 对比实测）。
2. **只外翻（自由缘朝观众出墙）+ 硬夹 88°**：内翻穿墙；≥90° 露 div 背面。
   夹在 88° 内背面永不可见，`backface-visibility` 与双面砖 DOM（×2~3 预算）
   全部不需要。

**铰链方位三案**（截图 `scratchpad/shots/flip-{top,bottom,away}-*.png`）：

| 案 | 观感 | 判定 |
|---|---|---|
| top 铰统一（百叶下开） | 翻板下缘朝观众，槽腔露出偏下，光被板自身遮半 | 否 |
| bottom 铰统一（百叶上开） | 槽腔上部露光，安静机械感 | 否——方向与指针无关，「气流」故事断裂 |
| **away 铰（定案）**：铰链取近指针边、自由缘背指针外翻（按 dx/dy 主轴四向量化） | 翻板呈放射状背指针掀开、槽光朝指针环辐——v4.1「近缘翘起背向指针（气流掠过）」语言的完全体 | ✓ |

抖跳防护：铰链方位仅在砖近静止（角 <0.5°）时允许切换——扫掠中砖保持旧铰
直到近落定，无中途跳边。

遮挡与层序：翻起砖 z-index 2（状态切换非逐帧），落定撤销；80° 翻板在屏上的
投影主体是「露出的槽腔」而非板身（头对视线的物理事实），板身以描边增亮
（`.bp-brick-glow` 同 v4.1 机制）保持存在感；相邻遮叠面积有限，稳定 z 序足够
（原型 5×5 翻开区无 z 打架）。

**弹簧参数族（F 组定案）**：k=60、c=11（ζ≈0.71，大角度防过冲穿 88° 夹板）、
影响半径 200px、权重 `(1-d/R)^2`、目标角 = 80°×wgt。

### 2.4 静态层与砖池的遮蔽关系（v4.1 接管机制退役）

- `.bp-wall-face` 静态 tile **恒在恒可见**（不再有 `data-bricks` 退场）；
- 每格物化时同时物化**槽腔底衬**（underlay，砖的 sibling、画序在砖下）：
  槽腔实底（#05070c，比墙底深一档）+ 四周向心压暗（槽壁暗示）+ 槽内光 +
  溢光层——底衬不透明，天然遮住其下的静态 tile 砖面；砖静止时又恰好
  逐像素盖回底衬 = 与静态墙无差；
- 光槽层 `.bp-wall-light` / 洗墙光 `.bp-wall-wash` 原样恒在；
  **v4.1「光槽渐变栈两处同步」条款作废**（场背景承接机制随全场接管退役）。

### 2.5 「光从墙里照出来」（需求 1c）与哑光纪律修法

槽腔底衬两层光，opacity 全部 ∝ 翻开角（k = 角/80，离开归零）：

| 层 | 形态 | α 上限 |
|---|---|---|
| 槽内光 uglow | 格内径向（ellipse 70% at 50% 45%），光心 accent | **0.8**（k×1.15 封顶 1 × 光心 α0.8） |
| 溢光 spill | 格外 -110% inset 径向，洗上邻砖 | **0.45** |

**纪律修法**：全局「哑光禁强 bloom」维持——静态缝光 α0.10–0.12、洗墙光
α0.05 分毫不动；新增窄豁免「**指针邻域涌光**」：仅砖池翻开格的底衬两层、
角度驱动、指针离开即回落。这是 David 原话需求（「翻开的面积变大了，照出来的
效果应该会更好」）的显式立法，不是偷开 bloom。光强小样对比（0.75/0.4 vs
0.9/0.5）差异细微，取 **0.8/0.45** 中档，实施期按真实页面可读性终调。

### 2.6 WallBricks 改造清单

保留资产：半隐式欧拉弹簧、懒构建（首次 pointermove）、收敛停帧、能力门控
（hover+fine 且非 RM）、RM 中途 teardown（listenMql 单向）、
`documentElement.clientWidth`、CSS var 单一事实源（JS 只读不定）。

退役资产：mod 回卷 + baseRow 状态行转移、`data-bricks` 接管、全场 build、
MAX_BRICKS 视口预算与异形屏放弃、resize 立即拆场/rebuildPending 机器
（砖池 resize 只需清池重读 var，下次 pointermove 自然重建——防抖仍留避免
MQ 阶梯边界抖动）。

新增：cell 键控砖池（Map + 空闲栈）、槽腔底衬节点、away 铰链解算、
88° 夹板、池上限 512、scroll 时以缓存视口坐标重瞄（文档坐标 = clientY+scrollY）。

### 2.7 降级矩阵（砖墙）

| 条件 | 行为 |
|---|---|
| 无 JS / hydration 失败 | 静态 48px 方砖墙完整可见且合成器随滚（与 v4.1 同，密度更高） |
| RM | 不建池 / 中途 teardown 清池；静态墙原样 |
| 触屏 | 门控不建池 |
| 微信 WebView | = 无 JS；curl 验 SSR DOM |
| 老内核 | SVG data-URI tile 全兼容（v4.1 结论沿用） |
| 异形屏 | 无特殊逻辑——池尺寸与视口解耦（v4.1 放弃增强路径退役） |

## 3. WF-2 · 无底纹排版（需求 2）

### 3.1 层次纪律：L0/L1/L2 → L0/L2

`.sheet-panel` 类与全部 8 处使用 + TextListSection 的 `bgClass` prop（默认
sheet-panel、无调用方覆写）整体退役；SiteFooter 摘 `bg-bg-base/70` 透墙。
剩余合法底色：**L2 不透明卡片**（card-* / GlassCard、badge、编号列表项等
小元素——可读性锚点不动）、SiteHeader 滚动态（非 section，原判维持）、
skip-link focus 态。

### 3.2 文字对比度提档（对墙面有效底 ≈#10151E 实测）

双管齐下——token 全局提一档 + 误用降级修正：

| token | 旧值（对墙对比度） | **新值**（对墙对比度） | 口径 |
|---|---|---|---|
| txt-tertiary | #868E9C（5.7:1 ✓） | **#929AA8（≈6.6:1）** | 正文长段落舒适档 |
| txt-quaternary | #606876（3.3:1 ✗AA） | **#6E7787（≈4.5:1）** | 仅装饰/metadata；正文禁用 |
| txt-primary / secondary | 不动（12+ / 8.4:1） | 不动 | — |

globals.css `:root` 的 `--text-tertiary/--text-quaternary` 同步（双处声明
交叉锁定）。

用法再分级（quaternary 全量七处逐条裁决）：

| 处 | 裁决 |
|---|---|
| Breadcrumb 链接（:66） | **提 tertiary**（可读导航文本） |
| AnimatedStat label（:45） | **提 tertiary**（可读数据标签） |
| FAQAccordion 折叠指示 +（:40） | **提 tertiary**（交互指示物） |
| Breadcrumb 分隔符 /（:50，select-none） | 留 quaternary（装饰） |
| about 页背景大编号（/15 α，select-none） | 留 quaternary（装饰） |
| SheetLabel 图纸编号（aria-hidden） | 留 quaternary（结构性编号，新值后 ≈4.5 也更清晰） |
| Eyebrow tone 映射表 | 保留选项；实施期核对现有 tone="quaternary" 调用点，若承载可读 caption 一并提档 |

验收：无底纹后正文一律 ≥4.5:1（AA），tertiary 长段落 ≥6:1；装饰性
annotation（aria-hidden）不受限；「砖墙不干扰文字可读性」为本次权重最高的
独立验收项（桌面 + 390px 全页滚动截图逐屏过）。

### 3.3 波及组件清单

sheet-panel 摘除：ProcessSection / CapabilitiesSection / InDevelopmentShowcase /
ResultsSection / products 页 / about 页 ×2 / contact 页 / TextListSection
（prop 连根删）；SiteFooter 摘底色。globals.css 删 `.sheet-panel` 块。
section 分隔节奏由既有 `.ruled-line` 与留白承担（不新增替代底）。

## 4. WF-3 · 嵌墙按钮（需求 3）

### 4.1 概念草案与定案（小样 `scratchpad/shots/btn-*.png`）

| 案 | 内容 | 判定 |
|---|---|---|
| V1 pop2d | hover translateY(-3px)+scale(1.02) | 否——位移感平面，与「凸出来」的模块语言不符 |
| V2 **pop3d（定案基底）** | hover `perspective(700px) translateZ(16px)`（近大投影 + 槽光涌出 + 投影落墙）；active `translateZ(-5px)` 按入 | ✓ 真出墙读感；按入是字面意义的按进槽里 |
| V3 pop3d + 悬停微摆 | V2 + hover 期指针跟随 ≤4° | **并入定案**——摆动只在顶出期存在，嵌墙态死静（砖不该在槽里晃） |

**语义**：按钮 = 砌进墙里的一块砖。rest 齐平（四周 3px 槽缝环可见、槽内常态
微光）→ hover 顶出（`perspective()` 内嵌 per-element，不建 preserve-3d 链）+
槽光涌出洗上墙（与砖墙 1c 同一「光从墙里照出来」语言）→ active 按入槽内
（内阴影 + 光回落）→ disabled 齐平 + 降透明度（半落座姿态随 --btn-dy 退役）。

### 4.2 资产裁决（四套动画只留两套半）

| v4.1 资产 | 裁决 |
|---|---|
| `--btn-dy` 悬浮面板 + 底座插槽双伪元素反向抵消状态机 | **退役**——插槽改为静态槽缝环（frame ::before，inset -3px、z -1、isolation 锁层序），无反向运动数学 |
| `btnHoverIdle` 呼吸 + phase 错峰 prop + `:has(:disabled)` 停摆 | **退役**——嵌墙砖不呼吸；§6 float 豁免缩编回一例（objFloat）；RM 显式 none 列表移除 .btn-module-frame；phase prop 连根删 |
| backglow（frame ::before 常亮背光） | **退役**——齐平砖背后不该有光；frame ::before 让位给槽缝环；hover 光改由槽缝涌出（:has(:hover) opacity 过渡，老内核软降级 = 槽光恒常态档） |
| ButtonTilt 指针弹簧 | **改造保留**——邻域跟随（130px）改悬停期跟随（盒内满权重、盒外即零），幅度 4°；引擎/门控/单例/teardown 全部沿用 |

transform 写入者三层分工（纪律不变）：本体 pop transition /
`.btn-tilt` JS 弹簧 / frame 静态（仅 ::before 槽光 opacity 过渡）——
infinite 写入者归零，同元素同属性冲突面收窄。

### 4.3 结构与状态

```
<span class="btn-module-frame">      ← 静态；::before = 槽缝环（inset -3px：
  │                                     槽腔深底 + hairline + 槽内常态微光；
  │                                     :has(:hover) 涌光增亮，opacity-only）
  └─ <ButtonTilt> (.btn-tilt)        ← hover 期 JS 弹簧 ≤4°（per-element
      │                                 perspective，无 3D 链）
      └─ <Link|button .btn-primary|.btn-secondary>
                                     ← 本体：材质面直接画在元素背景上
                                        （负 z 伪元素层序问题随插槽外移消失）；
                                        rest 无 transform / hover
                                        perspective(700px) translateZ(16px) /
                                        active translateZ(-5px)（快过渡 0.09s）
```

- 面材质：secondary = 砖面同栈（`--mat-face-tint` 沉降 + `--mat-face-base`
  实底 + 顶棱/底缘 inset）；primary = accent 渐变通电砖——均 v4.1 原样平移；
- 尺寸锁定（padding 0.75rem 1.75rem ≥44px）、`:focus-visible` 2px accent +
  3px offset、8px 圆角、判别联合 props、双栖（无 'use client'）全部不动；
- 触屏：rest 齐平静态 + `:active` 按入（纯 CSS）；RM：过渡瞬时跳变保留
  （transition 0.01ms 全局 reset 天然覆盖），tilt 引擎门控不挂；
- `.btn-tilt` flex:1 保留（w-full 链路）；
- hover 顶出的近大投影会横向多盖 ~3px：槽缝环被暂时盖住的部分由涌光
  （box-shadow 外扩 22px）接管视觉叙事——原型验证成立，非缺陷。

## 5. CLAUDE.md 修法清单（零出入）

- **§2**：满铺条款重写（砖池架构、48px 密度、翻板语言、涌光豁免）；
  层次三级改二级（L0 墙 / L2 卡片，`.sheet-panel` 字样全删）。
- **§3**：文字层级表更新 tertiary/quaternary 新 hex 与用途口径
  （quaternary 正文禁用）。
- **§4**：token 表 txt 新值；「Radial Glow / Wall」条目重写（砖池、底衬、
  恒在静态层、池上限 512、光槽两处同步条款删除）；pitch 阶梯重排。
- **§6**：`brick-tilt` 条目改写为 `brick-flip`（铰链外翻 ≤80° 夹 88°、
  away 铰、涌光 ∝ 角度、池上限）；`btnHoverIdle` 条目删除（float 豁免缩编）；
  `btn-tilt` 条目改口径（悬停期、≤4°）；新增按钮 pop/press 条目
  （translateZ transition）；backglow 条目删除；RM 三件套列表同步。
- **§7**：整节重写（嵌墙砖语义、新结构、状态表、槽缝环、phase 删除）。
- **§1**：结构树注释同步（BlueprintWall/WallBricks/ButtonTilt 描述更新）。

## 6. 文件清单

改：`src/app/globals.css`（.bp-wall*/.bp-brick* 砖池化重写、按钮引擎 §7 块
重写、.sheet-panel 删除、token 值、RM 列表）、
`src/components/shared/WallBricks.tsx`（砖池重写）、
`src/components/shared/BlueprintWall.tsx`（注释/层结构微调）、
`src/components/shared/ButtonTilt.tsx`（悬停期门控）、
`src/components/shared/ModuleButton.tsx`（phase 删除、注释）、
`tailwind.config.js`（txt 两档新值）、
`src/components/layout/SiteFooter.tsx`、`Breadcrumb.tsx`、
`src/components/shared/AnimatedStat.tsx`、
`src/app/(public)/contact/FAQAccordion.tsx`、
sheet-panel 八文件（§3.3 清单）、`TextListSection.tsx`（prop 删除）、
`CLAUDE.md`。ModuleButton 调用点若传 phase 一并清理。

## 7. 验收

- 桌面：指针扫过砖墙，邻域砖背指针铰链翻开（近 80°）、槽腔光涌出洗上邻砖、
  离开缓落归位；滚动中墙与内容合成器同步（无一帧滑移）；指针+滚动风暴
  无长帧（原型 F 组口径）；砖池峰值 ≤512
- 全站无 section 底纹：任一页滚动全程只见 墙 / 卡片 / 页头 三种底；
  文字可读性独立验收（桌面 + 390px 逐屏截图，正文 ≥4.5:1）
- 按钮：rest 齐平嵌墙（槽缝可见）、hover 顶出 + 槽光涌出 + ≤4° 跟随、
  active 按入、disabled 齐平变暗；触屏/RM/无 JS 三路径姿态完整；
  焦点环、44px、判别联合、w-full 链路全过
- 五路径实测（RM / 无 JS curl / 触屏 / 390px / 微信）+ LCP 恒 h1 +
  lint/build 过 + CLAUDE.md 零出入 + code-review-loop 零 verdict-changing
