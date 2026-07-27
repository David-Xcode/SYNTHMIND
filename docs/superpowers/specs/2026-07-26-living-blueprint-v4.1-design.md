# Living Blueprint v4.1 —「Square Brick Material」设计定案

> 🛑 **已退役 — 勿作实施依据**（2026-07-27）
> 墙体现行正本 = `2026-07-27-graphite-wall-v8-design.md`（本文的「随页滚动」已于 v6
> 退役 = 墙属 fixed 场景；「灯光材质」已于 v8 整体退役 = 墙后零光源）；按钮现行正本 =
> CLAUDE.md §7（本文的 backglow / `--btn-dy` 双层反向位移 / btnHoverIdle 呼吸均已删除）。
> 本文仅存架构决策史。

> v4 部分定案的返工令落地：方砖化砖墙（去网格、灯光材质、随页滚动）+ 按钮与砖
> 完全同族（长条砖形态 + pointer tilt + backglow）。
> 上位正本：`2026-07-26-living-blueprint-v4-design.md`（未推翻部分与权衡记录仍有效）。
> 任务书：`docs/superpowers/briefs/2026-07-26-living-blueprint-v4.1-brief.md`。
> 概念草案与实测数据：本文各节（材质小样 5 版、随滚架构两案 FPS 对比、预算压测）。

---

## 0. 推翻清单（v4 → v4.1，逐条注明）

| v4 定案 | v4.1 裁决 | 依据 |
|---|---|---|
| C.1 「fixed 单实例、墙不动图纸动」 | **推翻** → 墙随页面滚动：静态层文档级 absolute（无 JS 也随滚），JS 砖场 fixed + mod 回卷追随 | David 原话 1d；两案实测见 §2.3 |
| C.2 几何表：192×96 错缝砌、缝 6px、24px 细分格 | **全部重定** → 96×96 方砖、网格化对齐阵列（无错缝）、缝 6px（= pitch/16）、**砖面禁绝细分格** | David 原话 1a/1b；参数表见 §2.2 |
| C.4 砖面材质栈含「24px 细分格」条目 | **删除**——网格显廉价；砖面改受光渐变（灯光质感） | David 原话 1b；小样对比见 §2.1 |
| C.4 奇偶行双元素 + mask-composite intersect 画法 | **退役** → 单元素 SVG data-URI tile（一格一砖天然免 mask；连老内核软降级路径都不再需要） | §2.4 |
| C.2 预算「220/视口」 | **重实测** → 上限 400（368 砖满帧、600 砖掉帧 min 67fps） | §2.3 压测数据 |
| pitch 阶梯 192/288/384 + --wall-row-h | **重排** → 方砖单变量 96 / ≥2200px 128 / ≥3600px 192 / <640px 80；--wall-row-h 删除 | §2.2 |
| B.3 按钮呼吸+晃动为唯一常态动效 | **保留并叠加** pointer-driven tilt（JS 弹簧层）+ backglow | David 原话 2c；§3 |
| §6 mouse-tracking 豁免「仅两例」 | **扩为三例窄列举**：+ ButtonTilt | §3.2 |
| C.3 层次纪律 L0/L1/L2、「无单一色调平底」验收线 | **继续有效**（不推翻） | v4 spec C.3 |
| C.3 接线清单：SiteFooter `bg-bg-base/90` | **调整** → `/70`：/90 只透 10%，footer 读作单一色调平底，与上一行的验收线自相矛盾；/70 下墙材质隐约可见、居中小字号实测仍清晰（round-2 审查判断项） | 本节 |
| A.2 材质 token 机制 | **继续有效**，个别值按新材质重定（§2.5） | — |

**§6「noise texture overlays」禁令裁决**：磨砂小样（feTurbulence 噪点 α0.16 与
α0.10 两档）与纯渐变灯光小样实测对比——噪点版砖体分离感最弱、观感提升不显著；
灯光渐变版本身已有磨砂哑光观感。**定案：不引入噪点，FORBIDDEN 条目原样保留，
「磨砂质感」由受光渐变实现（不触法）。**

---

## 1. 材质小样对比（概念草案，5 版实测截图）

| 草案 | 内容 | 判定 |
|------|------|------|
| A. LIGHTING 受光渐变面 | 顶部 accent 微光沉降 + 顶棱白线 + 底缘厚度压暗 + 左右棱线 | ✓ **定案基底**——砖体独立成块、厚度可读；v1 棱线对比偏浴室瓷砖，v2 降档后成立 |
| B. FROSTED 纯噪点磨砂 | feTurbulence 白噪 α0.16 | 否——砖体几乎消失、面平无厚度；且触 §6 噪点禁令 |
| C. BACKLIT 每砖背光灯箱 | 每砖中心径向微光 | 否——远看成波点阵列，安静过头 |
| D. FROSTED-LIT 低噪合成 | A + 噪点 α0.10 | 否——较 A 提升不显著，不值得为它开 §6 豁免 |
| E. SEAM-LED 缝隙灯槽 | 面素化 + 缝内光带增亮 | **部分采纳**——灯光质感落在缝隙（透光层）最高级；取中间档并入定案 |

**定案材质 = A v2 受光面 + E 中档缝光**：灯光质感由「面受光渐变 + 缝隙灯槽 +
视口洗墙光」三者合成，零噪点、零细分格。

---

## 2. WF-1 · 随滚方砖墙

### 2.1 定案材质栈（SVG data-URI tile 单层 + CSS 光槽层 + fixed 洗墙光）

砖面 tile（一格一砖，缝归 tile 左/上缘，面 rect 从 (S,S) 起）：

| 层 | 值 | token 对应 |
|---|---|---|
| 面基底 | `#111620` @ 0.9 | `--mat-face-base`（v4.1 重定 0.75 → 0.9：方砖密缝多，透感由缝承担，面要实） |
| 受光沉降 | 180deg `#4A9FE5` 0.05 → 0 @55% | `--mat-face-tint` |
| 底缘厚度带 | 末 5px `#000` 0 → 0.22 | `--mat-face-shade` 折算档 |
| 顶棱受光线 | 1px `#fff` @ 0.04 | 中性明度轴（豁免区） |
| 左棱线 | 1px `#fff` @ 0.02 | 同上 |
| 右棱暗线 | 1px `#000` @ 0.16 | 同上 |

> SVG 内一律 `fill`/`stop-color` 取 hex + 独立 `fill-opacity`/`stop-opacity`，
> **不写 `rgba()`**：SVG 1.1 的 `<color>` 语法不含 rgba，虽然三大现代引擎都
> 走 CSS 颜色解析器，但若某引擎拒收会落回初始值 = 不透明黑（整片死黑砖面，
> 失败模式极重）。hex + opacity 语义等价、零风险。

- **画法**：单元素 `.bp-wall-face`，`background-image` = SVG data-URI tile，
  `background-size: var(--wall-brick-w) 方形`。SVG 内字面色值与 `--mat-*` token
  交叉锁定（同 BlueprintObject STROKE 表机制——data URI 无法消费 var()，
  正本用字面量、token 对齐正本值）。
- v4 的 mask-composite 双元素机器整体退役；SVG 背景无老内核兼容缺口，
  连「软降级 = 满面细网格」路径都不再需要。
- **光槽层 `.bp-wall-light`**（tile 之下独立元素）：横竖两组
  repeating-linear-gradient 沿缝隙走 accent 光带，α 0.10–0.12 心、缝外 7px 渐隐；
  砖翘起让开时露出宽光带（v4 纯几何显影机制原样）。
  **激活期光槽随场走**（round-1 审查修正）：JS 场是 fixed 层、回卷 transform
  由主线程 scroll 事件写入，恒落后合成器滚动约一帧；若缝光留在文档层
  （合成器逐像素精确随滚），快滚时砖面与缝光互相错位、缝光忽明忽暗。
  定案 = `data-bricks="on"` 时文档层光槽同帧退场、同一渐变栈搬进
  `.bp-wall-field` 背景（与砖同处一个 transform 下逐帧一致）；静止态两者
  像素等价（同渐变、同相位、同底），接管无跳变。两处渐变声明严格同值，
  改光槽参数必须两处同步。
- **洗墙光 `.bp-wall-wash`**（fixed，随视口不随墙）：顶部椭圆径向
  `rgba(74,159,229,0.05)`——光源属于场景不属于墙，滚动时「墙动光不动」
  是灯光质感的物理正解。哑光禁强 bloom 底线不动。

### 2.2 几何参数表（v4.1 定案）

| 参数 | 值 | 说明 |
|---|---|---|
| 砖形 | 正方形，**网格化对齐阵列**（无错缝） | David 原话；对齐阵列的周期性是随滚架构的工程前提（§2.3） |
| pitch | `--wall-brick-w`: 96px | 阶梯：<640px → 80；≥2200px → 128；≥3600px → 192 |
| 缝宽 | `--wall-seam` = pitch/16：6px（80→5 / 128→8 / 192→12） | 整除保 DOM 砖与静态 tile 等价 |
| 密度 @1440×900 | 15×10 = 150 砖（JS 场 165 含回卷备用行） | v4 长砖 ≈80 → 密度约 2 倍 |
| tilt / lift | ≤12° / ≤18px | v4 白名单口径不变 |
| 弹簧 | k40 ζ0.55、影响半径 240px | v4 原样 |
| 投影几何 | left +6% face / top +93% face / 宽 88% face / 高 18% face | round-2：改比例式（绝对 16px 在 pitch 80→192 跨 2.4 倍时暗示走味） |
| 预算 | **400/视口**（硬上限，超限 JS 放弃增强） | 实测 368 砖满帧（85fps=刷新率）、600 砖 min 67fps；M3 光槽入场后复测 165/280 砖仍满帧（无回归，不需要 will-change） |
| --wall-row-h | **删除**（方砖单变量） | CLAUDE.md §4 同步 |

### 2.3 随滚架构：两案实测与定案

| 案 | 机制 | 实测（滚动 1000px/s + 指针风暴同时进行） | 判定 |
|---|---|---|---|
| A. **fixed 场 + mod 回卷（定案）** | 静态层文档级随滚；JS 砖场保持 fixed，滚动时整场 `translateY(-(scrollY mod pitch))`；跨 pitch 整数倍时弹簧状态沿行转移（滚出行归零补入另一端） | 165 砖 85fps 满帧；216 砖 85fps；368 砖 85fps；wrap 边界截图验证无跳变（翘起砖群锚定指针、砖纹连续移动） | ✓ DOM 数恒定、零增删、零文档高监听；滚动成本 = 1 次 transform 写入 + 状态转移 |
| B. 文档级窗口化 | 砖场 absolute 全文档，按滚动窗口增删行 | 165 砖 85fps（FPS 打平） | 否——性能无优势，却引入 DOM churn、文档高变化监听（路由/内容伸缩）、增删时序复杂度 |

**A 案成立的关键**：网格化对齐阵列下砖纹以 pitch 为完全周期，mod 回卷逐像素
无缝；错缝砌法（垂直周期 2 行 + 相位交替）做不到——「方砖网格化」需求
反而消灭了 v4 架构里最复杂的部分。

静态层结构（(public)/layout 挂载，`relative` wrapper 撑满文档高）：

```
<div class="relative">                    ← layout 新增 wrapper（全内容included）
  <div class="bp-wall" aria-hidden>      ← absolute inset-0 z-[-1]（文档级随滚）
  ├─ .bp-wall-light   光槽层（随滚）
  ├─ .bp-wall-face    方砖 tile 层（随滚；data-bricks="on" 时退场）
  ├─ WallBricks 场    fixed + mod 回卷（client 懒构建）
  └─ .bp-wall-wash    fixed 洗墙光（对静态面与 DOM 砖恒在最上，接管前后一致）
  … SiteHeader / main / SiteFooter
```

- **无 JS / 触屏 / RM 三路径 = 静态墙原样且天然随滚**（比 v4 的 fixed 静态墙
  更贴合 David 需求——这三条路径 v4.1 反而是升级）。
- JS 接管像素等价：DOM 砖建成同帧 `data-bricks="on"` 隐藏 face 层（v4 机制）；
  wash/light 不隐藏；DOM 砖视觉位置 = `(docRow-baseRow)*pitch + seam - offset`
  与静态 tile 逐像素重合（推导见任务书预研 + 原型验证）。
- 指针坐标：场内 y = clientY + offset（offset = scrollY mod pitch）；滚动事件
  同步重瞄（墙动指针不动时倾斜场跟随修正）。
- 预算超限（异形屏如竖置 1440×2560 = 420 砖）→ JS 彻底放弃，静态随滚墙原样。

### 2.4 WallBricks 改造清单（v4 资产复用，不重写）

保留：弹簧积分器（半隐式欧拉）/懒构建（首次 pointermove）/收敛停帧/预算护栏/
`data-bricks` 同帧切换/RM teardown（listenMql 单向）/resize 防抖重建/window 级监听。

变化：
- pitch 读 `--wall-brick-w` + `--wall-seam`（--wall-row-h 退役）；
- rows = ceil(vh/pitch) **+1**（mod 回卷备用行）；场高 rows×pitch；
  cols 用 `documentElement.clientWidth`（不含经典滚动条——场是 100vw 含
  滚动条，用它算会白铺一列在滚动条底下）；
- 新增 scroll listener（passive）：offset 写场 transform、baseRow 变化时状态
  行转移、重瞄 retarget；未构建时空转；teardown 时一并摘除；
  **全场静止（raisedCount = 0）时跳过状态转移**（round-1 审查修正：恒等
  操作白跑 400 砖双循环 ≈1200 次 CSSOM setter，快滚每秒 30+ 次）；
- **resize 立即拆场**（round-1 审查修正）：原来只在 200ms 防抖回调里
  clear+build，而 `data-bricks="on"` 全程保持——拖拽窗口边缘时防抖迟迟不
  触发，新增的底/右条带既无 DOM 砖也无静态砖面（露深底空带），跨 pitch
  阈值时还会光槽/砖周期错拍。定案 = 同步 clearBricks() 恢复静态材质，
  防抖回调只负责 build()；`rebuildPending` 区分「拆的是已建过的场」与
  「从未建过」，后者不因 resize 提前付构建成本（懒构建语义不破）。
  **放弃态必须可重估**（round-2 审查修正）：预算超限/CSS var 解析失败时
  状态是 `built=true, bricks=[]`，若 resize 不把 built 复位，竖屏超预算 →
  转横屏进预算后砖场永久不再激活（layout 跨路由不 remount，锁死整个 SPA
  会话）。实测 1440×2560 放弃（0 砖）→ 2560×1440 恢复 260 砖 ✓；
- 砖面 = face 专用 SVG data-URI（与静态 tile 同渐变栈、无缝偏移版），
  尺寸 100%；`.bp-brick` 的 24px 细分格背景全删；
- `.bp-brick-glow` 翘起增亮：面微亮 + hairline 描边趋 `--mat-edge-strong`
  （细分格显影条目删除）；shadow 子层原样。

### 2.5 材质 token 重定（§4 修法）

- `--mat-face-base`: rgba(17,22,32,0.75) → **rgba(17,22,32,0.9)**（0.75 的
  鬼影线注释废弃——新材质缝隙透光由光槽层专职，面不再兼职透光）；
- `--wall-brick-w` 阶梯重排 + 新增 `--wall-seam` 阶梯；`--wall-row-h` 删除；
- 其余 `--mat-*` 值不动；SVG tile 字面值与 token 的交叉锁定关系写入 §4 注释。

---

## 3. WF-2 · 按钮 = 长条砖（Brick Bar）

### 3.1 形态与材质（与砖一眼同族）

- **形态**：bar 砖——高 ~45px（padding 0.75rem 1.75rem 锁定 ≥44px 触达不变），
  比方砖（90px 面）矮一档；8px 圆角不变（全站圆角法不动）。
- **secondary = 字面意义的一块砖**：面板面改喝砖面同栈——
  `linear-gradient(180deg, var(--mat-face-tint), transparent 55%)` 叠
  `var(--mat-face-base)` 实底（round-1 审查修正：基色收进 token，不写字面
  rgba——§4「优先消费 token」是硬规则）+ 顶棱白线 inset + 底缘压暗 inset
  （tile 各层的 CSS 形态）；hairline 边框保留。面板必须有实底遮插槽的硬功能
  由 token 的 0.9 α 承担。
- **primary**：accent 渐变保留（CTA affordance 优先，v4 复核维持），叠同款
  顶棱受光/底缘压暗——同一间工厂的「通电砖」。
- **backglow（David 原话「按钮背后带一点亮光」）**：`.btn-module-frame::before`
  ——`inset: -16px -24px; z-index:-1` 径向
  `rgba(74,159,229,0.18) → transparent 72%`（物件 bp-object-backglow 语言小号版，
  低 α 哑光禁强 bloom）；frame 加 `isolation: isolate` 锁稳负 z 层序
  （RM 下 animation:none 会拆掉动画带来的 stacking context——isolation 恒建，
  背光不会漏到面板背后的祖先背景之下）。hover（`:has` 探测）0.75 → 1 微增亮，
  老内核软降级恒 0.75。
- 底座插槽（::before/::after 双伪元素 + `--btn-dy` 状态机）**原样保留**，
  语义升级为「墙上的空砖槽，槽内透光」——与砖墙缝光同语言，按压 = 砖入槽。

### 3.2 pointer tilt（David 原话「像砖一样跟随鼠标摆动」）

- **新增 client 组件 `ButtonTilt`**（`src/components/shared/ButtonTilt.tsx`）：
  ModuleButton 在 frame 与本体之间插入 `<span class="btn-tilt">`；ModuleButton
  本身仍无 `'use client'`（双栖不变），ButtonTilt 是各按钮共享的小 client 岛。
- **单例引擎**：模块级注册表 + 一个 window pointermove 驱动全部按钮
  （≤7 实例）；每按钮独立小弹簧 rotX/rotY，参数族 k30 ζ0.6
  （HeroObjectPhysics ROT 同款），**幅度 ≤5°**（按钮是功能件，不到砖的 12°）、
  影响邻域 ~130px（按钮边缘起算）、离开归零缓落、收敛停帧。
- transform 写入者三层分工（同元素同属性冲突纪律，任何方案不许破——本方案
  天然满足）：frame = btnHoverIdle infinite（**保留叠加**，无 JS 时按钮仍活）
  / btn-tilt = JS 弹簧逐帧 / 本体 = `--btn-dy` 按压 transition。
- `.btn-tilt` 必须 `flex: 1 1 auto`（round-1 审查修正）：它是 frame 内唯一
  flex item，不撑满会 shrink-to-fit，本体的 `w-full` 于是解析到收缩宽度而
  失效——HomeHero 移动端两颗 CTA 的满宽等宽依赖这条链路。
- 门控与降级：hover+fine 且非 RM 才挂引擎（触屏/RM = 静态悬空姿态 +
  :active 按入，v3/v4 机制原样）；RM 中途开启 → 引擎 teardown 清零 transform
  （listenMql 单向，同 WallBricks）；disabled 按钮目标恒零（frame 呼吸已由
  `:has(:disabled)` 停摆）。
- rect 缓存 scroll/resize 失效重取（7 个 getBoundingClientRect 量级，无抖动
  风险）；`perspective()` 内嵌 transform 自带，不建 preserve-3d 链。

### 3.3 §6/§7 白名单口径

- `btnHoverIdle` 条目保留（叠加关系注明）；
- 新增 `btn-tilt` 条目：pointer-driven 弹簧倾斜 ≤5°、仅 hover+fine、
  RM/触屏静态、mouse-tracking 豁免第 3 例（窄列举扩为三例：
  HeroObjectPhysics / WallBricks / ButtonTilt——全部 rAF 阻尼弹簧非 1:1 硬跟）；
- backglow：opacity-only 微增亮，不入动画属性纪律冲突。

---

## 4. 降级矩阵（v4.1 全量）

| 条件 | 砖墙 | 按钮 |
|------|------|------|
| 无 JS / hydration 失败 | 静态方砖墙完整可见**且随滚**（文档级 CSS 直出）——且滚动保真度**优于** JS 路径（合成器精确，见下方已接受代价） | 悬空姿态 + 呼吸 + :hover/:active 全程纯 CSS |
| prefers-reduced-motion | JS 砖不建/中途 teardown；静态随滚墙原样 | 呼吸/tilt 全停（显式 none + 引擎 teardown）；按压跳变保留 |
| 触屏 | 能力门控不构建；静态随滚墙 | 静态悬空 + :active 按入 |
| 微信 WebView | = 无 JS 路径；curl 验 SSR DOM | 同触屏 |
| 老内核 | SVG data-URI 背景全兼容（mask-composite 依赖已退役，无降级缺口） | `:has` 不支持 → disabled 呼吸不停 / backglow 恒 0.75（均无害） |
| 超预算异形屏 | JS 放弃增强，静态随滚墙（resize 后可重估恢复） | 不受影响 |

### 已接受代价（审查三轮共识，勿反复重提）

- **JS 路径滚动落后约一帧**：砖场 fixed 层的回卷 transform 由主线程 scroll
  事件写入，快滚（~1000px/s）时墙材质相对内容滑移 ≈16px；无 JS 路径由合成器
  精确随滚，两条路径保真度不同。缝光已随场（M3）消除了「砖面 vs 缝光」内部
  错位，剩余的是「墙 vs 内容」整体滑移——墙是低对比材质，实测不显眼。彻底
  消除需要 scroll-linked animation timeline 或把砖场也做成文档级（回到已被
  否决的 B 案），代价大于收益。
- **SiteHeader 滚动态保持不透明** `bg-bg-base`：与 footer 的 /70 处理不同——
  页头覆盖的是正在滚过的正文，无 blur 前提下半透明会让文字透叠（v4 spec C.3
  原判，v4.1 复核维持）。「无单一色调平底」验收线针对的是 section 背景，
  不含固定页头。
- **ButtonTilt 的 rect 缓存不追按钮自身的呼吸位移**（±2px / ±0.4°）：倾斜
  目标角误差 ≤0.08°/5°，不可察。
- **`--mat-face-shade` / `--mat-edge-faint` / `--mat-seam-glow` / `--mat-seam-soft`
  当前无 `var()` 消费方**：它们是 BlueprintObject 材质正本的交叉锁定表项
  （CLAUDE.md §4 定位），不是死变量，禁止「清理」。

---

## 5. CLAUDE.md 修法清单（文档与实现零出入）

- **§2**：满铺条款重写——「fixed 单实例」→「文档级随滚墙（BlueprintWall 单实例，
  (public)/layout 挂载）：方砖网格化阵列、灯光材质（面受光渐变 + 缝隙灯槽 +
  fixed 洗墙光）、砖面禁网格纹路」；L0/L1/L2 层次纪律保留。
- **§4**：「Radial Glow / Wall」条目重写（随滚结构、SVG tile 画法、pitch/seam
  阶梯、预算 400、JS 只读不定）；`--mat-face-base` 值与注释更新；
  `--wall-row-h` 删除、`--wall-seam` 新增。
- **§6**：`brick-tilt` 条目重写（随滚墙、方砖、400 预算）；新增 `btn-tilt`
  白名单条目；mouse-tracking 豁免改三例窄列举；noise 禁令原样（磨砂由渐变
  实现的裁决可注一行）。
- **§7**：结构升为四层（frame 呼吸+backglow / btn-tilt JS 弹簧 / 本体按压 /
  伪元素面板+插槽）；ButtonTilt 组件与门控；secondary 砖面材质。
- **§1**：结构树 + ButtonTilt。

## 6. 文件清单

- 新：`src/components/shared/ButtonTilt.tsx`
- 改：`src/app/globals.css`（.bp-wall* 系重写、.bp-brick* 材质重写、按钮引擎
  升级、token 块、RM 增补——`.btn-tilt` 无 infinite 动画不入 RM 列表，
  引擎自行 teardown）
- 改：`src/components/shared/BlueprintWall.tsx`（层结构）、`WallBricks.tsx`
  （§2.4 清单）、`ModuleButton.tsx`（插 ButtonTilt 层）
- 改：`src/app/(public)/layout.tsx`（relative wrapper）
- 改：`CLAUDE.md` §1/§2/§4/§6/§7

## 7. 验收（任务书原样 + v4.1 专属）

- 全站任一页：方砖墙随页面滚动（含无 JS 路径）；砖面无网格纹路；灯光质感
  （受光面/缝光/洗墙光）；无单一色调平底
- 桌面：翘起跟随/透光/缓落 + **滚动中墙与内容同步移动**；滚动+指针风暴
  60fps；wrap 边界无跳变；预算 ≤400
- 按钮：与砖一眼同族（bar 砖 + backglow）；pointer tilt ≤5° 弹簧跟随；
  呼吸/按压/焦点/44px/RM 全过；7 实例行为一致
- 五路径实测 + 390px 首屏不倒退 + 文字可读性独立验收
- lint + build 过；CLAUDE.md 修法零出入；LCP 恒为 h1
- code-review-loop 零 verdict-changing + 结构化汇报
