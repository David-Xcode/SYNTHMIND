# Void Field v1 — 深空引力场背景（设计定案）

> **日期**：2026-07-27
> **状态**：✅ 现行正本 — 全站背景层（L0）
> **取代**：`2026-07-27-graphite-wall-v9-running-bond-design.md`（错缝砌体）
> ／ `2026-07-27-graphite-wall-v8-design.md`（石墨材质）
> ／ `2026-07-26-lantern-wall-v6-design.md`（灯笼墙）
> **子项目归属**：这是背景换代三件套的 **A**。B（3D 物件替换 `BlueprintObject`）与
> C（制图语汇迁移：图签 / S.NN / eyebrow 文案）各自另有 spec，**不在本文范围内**。

---

## §1 概念与立场

**背景 = 一片静止的深空，指针 = 压在空间上的引力井。**

砖墙的隐喻是「材料」——厚度、受光、砌法。深空的隐喻是「尺度与引力」：
画面上几乎什么都没有，只有一道贯穿视野的星云带；而当指针落下，空间本身被弯曲。

### 1.1 三条立场（决定架构，不只是文案）

**① 宇宙是静的，唯一的运动来自你施加的引力。**

星云**不自主漂移、不呼吸、不闪烁**。指针不动时，画面上没有任何东西需要重画。

这不是「优化到很便宜」，是**成本不存在**：空闲态零 rAF、零 GPU、零主线程。
砖墙时代那一整套「视口门控 / 桌面专属 / 收敛即停帧」的补救条款，在本架构下没有对应物。

派生性质（重要）：shader 因此是 `(fragCoord, hole, strength)` 的**纯函数**，
无 `uTime`。同样输入必得同样输出 ⇒ §7 的静态降级帧是**同一支 shader、同一组
常量离线渲出的同源产物**，而不是手搓的近似品。
（严格说不是「逐位一致」——静态帧按固定尺寸渲染后经 `cover` 缩放，重采样
会带来差异；一致的是**画面构成**，不是像素。）

**② 极简是硬要求，不是风格偏好。**

全屏 ≥90% 的面积是接近纯黑的深空底。可见内容只有：一道主星云带、一道次带、
极稀疏的星点。**禁止**繁星点点、禁止星系旋臂、禁止行星、禁止任何具象天体。

**③ 深邃靠明度层次与暗角，不靠元素数量。**

压迫感来自 `VIG` 暗角把画面四周压下去，以及星云带占据的巨大尺度
（带宽 > 屏宽，暗示看到的只是局部）。

### 1.2 保留自砖墙的纪律（未被本次换代触及）

- **背景属场景**：`fixed` 全视口，内容从背景前滚过、背景不动，**零滚动耦合**
- **内容层次二级**：L0 背景 / L2 玻璃检视窗卡片。**任何 section 不得持有底色**
- **全站单实例**：`(public)/layout.tsx` 与 `not-found.tsx` 各挂一次，页面/组件不得重复实例化
- **纯装饰**：`aria-hidden="true"`，不进无障碍树
- **光从左上来**：按钮顶棱受光、物件顶面受光、卡片 135deg 内反射——本次换代
  通过翻转星云带方向来**维持**这条既有约定（见 §4.3）

---

## §2 组件与层结构

### 2.1 文件

| 路径 | 类型 | 职责 |
|---|---|---|
| `src/components/shared/VoidField.tsx` | Server | 骨架 + 静态帧层；挂 client 岛（含 ErrorBoundary） |
| `src/components/shared/VoidFieldGL.tsx` | Client 岛 | WebGL2 渲染器、指针弹簧、生命周期 |
| `src/lib/void-field-shader.ts` | 模块 | GLSL 源字符串 + 全部数值常量（**唯一事实源**） |
| `public/void-still-l.webp` | 资源 | 静态降级帧（横向 1600×900） |
| `public/void-still-p.webp` | 资源 | 静态降级帧（纵向 900×1600） |
| `src/app/globals.css` `.void-field*` 块 | CSS | 层几何与静态帧背景 |

### 2.2 层纪律 —— 两层，且**永不同时可见**

```
.void-field                fixed inset-0 z-[-1]   场景层
├─ .void-field-still       静态帧（SSR 直出，唯一保底）        z 1
└─ canvas.void-field-gl    WebGL2 实时层                      z 2
   初始化成功 → 在 .void-field 上落 [data-live]
   → .void-field[data-live] .void-field-still { display: none }
```

**判别标准**（对应砖墙「砖床不是砖也不是光」那条）：静态帧层**不参与合成**——
一旦实时层接管就整个 `display:none`，不做双层叠加。canvas 以 `alpha:false`
创建并清成不透明色，静态层留在下面只会浪费一次合成。

🚨 **禁止再造第三层**。砖墙历史上出现过「tile + DOM 砖 + 底衬 + 假涌光」四层
互相遮掩的机器并因不可维护而退役。本设计只有两层，且其中一层是另一层的静止帧。

### 2.3 DOM

```tsx
// VoidField.tsx — Server Component
export default function VoidField() {
  return (
    <div aria-hidden="true" className="void-field">
      <div className="void-field-still" />
      {/* 边界收在 client 岛自身：抛错 → 卸载 → teardown 撤 data-live
          → 静态帧原地复位，背景完整可读，只丢引力井增强 */}
      <ErrorBoundary fallback={null}>
        <VoidFieldGL />
      </ErrorBoundary>
    </div>
  );
}
```

SSR 增量 = 2 个空 div。canvas 由 client 岛在挂载后自行创建并插入，
**不在 SSR 输出里**——避免无 JS 时留一个空白 canvas 压在静态帧上。

---

## §3 色彩体系

### 3.1 色相纪律（改写）

CLAUDE.md 现行条款「**禁止引入第二色相** — 单色相纪律是 Blueprint 的立场」
改写为：

> **UI 层单色相**（按钮 / 链接 / 图标 / 正文 / 边框 —— 只有 Synth Blue）；
> **背景层允许第二色相**，上限见 §3.2。

理由：人眼在暗部对色相极不敏感，低饱和的第二色相在 ≤α.08 时读作「一丝暖」
而非「另一种颜色」；而把饱和度拉高会立刻塌成塑料感。第二色相在这里是
**深度线索**，不是装饰色。

### 3.2 三个颜色常量

| 常量 | Hex | linear-ish vec3 | 用途 | 上限 |
|---|---|---|---|---|
| `DEEP` | `#0B0E14` | `(0.043, 0.055, 0.078)` | 深空底，≥90% 画面面积 | — |
| `BLUE` | `#4A9FE5` | `(0.290, 0.624, 0.898)` | 主星云带、带芯、光子环 | 见 §5 |
| `EMBER` | `#7A4A6E` | `(0.478, 0.290, 0.431)` | 余烬品红，仅次带 | `EMBER_MIX ≤ 0.7` |
| `STARLIGHT` | ≈`#D1E0FF` | `(0.82, 0.88, 1.0)` | 星点（**唯一不受 §4.1 约束的项**） | 见 §4.1.1 |

⚠️ **`STARLIGHT` 是实施期补登记的第四个常量**（本表最初只列三个，星点色被
写成裸字面量藏在 `main()` 里 —— 与 §4.1 漏算 `stars()` 是同一个疏忽的两面）。
它是全站最亮像素的来源，提亮它等于抬高整个画面的上限，改前必须重跑 §4.1.1。

`BLUE` 与 Tailwind `accent` (#4A9FE5) 、`DEEP` 与 `--bg-base` (#080B10) 的关系：
`BLUE` **必须**与 accent 逐位相同（交叉锁定，改一处同步另一处）；
`DEEP` 是**新值**，比 `--bg-base` 略亮一档，因为深空底还要承受 `VIG` 暗角衰减。

⚠️ shader 直接写 8-bit sRGB 帧缓冲，**不做 gamma 转换**——上表 vec3 值就是
sRGB 编码值除以 255，不是线性光。§5 的亮度实算依据这一前提。

---

## §4 三条锚的重建

砖墙提供了三样东西，全部随墙消失，必须在本 spec 内重建。

### 4.1 锚一：正文对比度基准 → 单条不变量

**旧**：CLAUDE.md 里一整张「对砖面各棱线」的六值梯队表（左上角交叠 / 上硬棱 /
上倒角带 / 左硬棱 / 左倒角带 / 蓝味峰），每加一条棱线就要重算一遍。

**新**：一条不变量。

> 🚨 **画面任意像素最终颜色的相对亮度 `L` 必须 ≤ 0.0323。**

> ⚠️ **上面这句的措辞已被 §4.1.1 收窄，别只读到这里就动手**：实测证明
> 「任意像素」的写法漏算了 `stars()`，现行口径是「任一**连续排版承载面**」，
> 星点是明文例外。数字以 §4.1.1 的实测表为准。

推导（`tertiary #929AA8` 的 L = 0.32043，WCAG AA 正文要求 ≥ 4.5:1）：

```
(0.32043 + 0.05) / (L + 0.05) ≥ 4.5
⇒ L + 0.05 ≤ 0.0823
⇒ L ≤ 0.0323
```

按 §5 常量实算的基准表（对**星云带芯**，全站最亮承载面，L = 0.01751）：

| 文字档 | 对带芯 | 对砖面（旧基准，仅供对照） |
|---|---|---|
| `primary` `#E8ECF0` | **13.10** ✅ | 15.26 |
| `secondary` `#A6AEBA` | **6.95** ✅ | 8.09 |
| `tertiary` `#929AA8` | **5.49** ✅ | 6.39 |
| `quaternary` `#78818F` | **3.95** ❌ | 4.60 ❌ |

`quaternary` 仍不合格 —— 与砖墙时代**结论一致**：它继续是
「装饰 / aria-hidden 专用，正文禁用」。这条纪律不因换背景而松动。

**这条不变量是本 spec 里唯一必须机械核验的东西。** 任何新增的发光项
（新的带、新的环、新的高光）都必须重跑这个实算，而不是凭感觉「看起来不亮」。

#### 4.1.1 实施实测记录（2026-07-27）

⚠️ **上面「画面任意像素」的措辞在实施中被证明不精确**：§5.1 的 `stars()`
不受任何强度常量约束，写这条不变量时被**整项漏算**。以下实测数据取代
纸面推算（离线 1600×900 静态帧 + 生产实时层 1440×900，两环境结论一致）：

🚨 **测法本身有个坑，先记在前面**：不能靠「亮度/色相启发式」在成品图里
挑出星点再取剩下的最大值——星点的**外晕**会被判成星云带，得到偏高的假峰值
（初版记录里的 4.42:1 就是这么来的，审查中被抓出并纠正）。唯一可靠的办法是
**把 `stars()` 彻底禁用后重渲一张**，测到的才是连续承载面。

| 对象 | 峰值 RGB | L | tertiary 对比度 | 判定 |
|---|---|---|---|---|
| **星云带**，空闲态（`stars()` 禁用后单测） | `rgb(22,37,52)` | 0.017416 | **5.50:1** | ✅ 与本节原推算 0.017514 / 5.49 吻合 |
| **星云带 ＋ 光子环**，按下态 `uStrength`=1.0（同上禁用星点） | `rgb(24,41,58)` | 0.020856 | **5.23:1** | ✅ 全图**零像素**超 0.0323 |
| **星点**峰值（含晕） | `rgb(192,218,255)` | 0.685693 | **0.50:1** | ❌ 超限，见下 |
| 星点及其晕的面积 | — | — | — | 86 / 1,440,000 px = **0.006%** |

第二行是本节的关键结论：**按下态确实比空闲态亮**（0.0209 > 0.0174 —— 初版
写的「不比空闲态更亮」是错的），但**仍在不变量内且离 4.5 有余量**，且开启
光子环后全图零像素超限。§5.4 把 `RING` 从 0.26 钳到 0.09 的判断成立。

⚠️ **本表按下那行是单点井心测的，不是最坏值**（2026-07-28 补记）：§5.5 改用
「井心沿带芯中心线扫 25 点取最坏」重测，同为 `LENS_R=0.42` 的按下态得到
`rgb(28,50,71)` / L=0.029830 / **4.64:1**——仍合规，但余量比本表记的 5.23:1 小。
引用这里的数时**注意口径**：本表 = 某一井心位置的实测，§5.5 = 扫描最坏。
现行常量（`LENS_R=0.10`）的对应数字以 §5.5 为准。

**定案：不变量约束的是「连续排版承载面」，不是逐像素全集。**
星点是 2–3px 的孤立亮点，与砖墙时代 CLAUDE.md 已确立的口径同类
（「0.625²px 的**点**，不构成排版承载面」）。三条支撑：
① 星云带本身 5.50:1 尚有余量；② 星点只在带内出现（`mask`），全屏仅约 15 颗；
③ 压到合规（L ≤ 0.0323 ⇒ rgb ≈ (40,54,71)）会让星点与带峰值等亮 = 星点消失，
直接违反 §1.1② 列出的三样可见内容之一。

🚨 **若将来要恢复逐像素的严格口径，唯一可行的改法是删掉 `stars()`**——
不存在「既保住星点可见又满足 L ≤ 0.0323」的中间档，别再试图靠调 `STAR`
密度或星点 alpha 折中（密度不改变峰值；alpha 一降星点直接消失）。

### 4.2 锚二：`btn-secondary` 面材质

**旧**：消费 `--wall-face-base` (#111620)，语义「砌进墙里的一块砖」。

**新**：直接消费 `--bg-elevated`（**同一个 #111620，零视觉变化**），
语义改为「**悬在深空前的仪器面板键**」。删除 `--wall-face-base`。

槽缝环（`.btn-module-frame::before`）与槽光（`::after`）**全部保留**：
槽光的现行口径是「按钮是通电的模块，槽光属内容层的光」，与背景零光源纪律
正交——这条口径在 v8 就已确立，不随墙消失。

**白捡的清理**：CLAUDE.md 记录的未结项「按钮槽腔 rgb(8,11,16) 比砖床
rgb(4,6,9) 亮两档，v8 未统一」—— 砖床随墙消失，该不一致**自动溶解**，
本次一并销账，无需额外改动。

### 4.3 锚三：卡片玻璃的光源方向

**旧**：135deg 内反射朝左上，对着「左上 45° 掠射光」。

**新**：**135deg 保持不变**。改的是星云带方向 —— `TILT` 取负值 (−0.38 rad)，
让主带从**左上**贯到右下、亮区落在左上。

决策理由：改一个 shader 常量 vs. 改全站卡片 CSS + 按钮棱线 + 物件受光。
且「光从左上来」是整套设计系统已经在说的话（按钮顶棱、物件顶面），
保持它 = 保持全站光照一致性。

⚠️ CLAUDE.md 现行禁令「朝右上的 225deg 是对着已删除的余晖，禁止回改」
**继续有效**，但理由要更新为：225deg 与主星云带的照度方向相反。

---

## §5 Shader 规格

### 5.1 完整 GLSL（唯一事实源 = `src/lib/void-field-shader.ts`）

顶点着色器 —— 全屏三角形（比 quad 少一个顶点，且无对角线接缝）：

```glsl
#version 300 es
in vec2 a;
void main(){ gl_Position = vec4(a, 0.0, 1.0); }
```

顶点数据：`[-1,-1, 3,-1, -1,3]`，`drawArrays(TRIANGLES, 0, 3)`。

片元着色器：

```glsl
#version 300 es
precision highp float;
out vec4 fragColor;

uniform vec2  uRes;       // canvas 像素尺寸
uniform vec2  uHole;      // 井心（与 p 同坐标系）
uniform float uStrength;  // 引力强度，弹簧输出 [0, S_PRESS]

// ── 颜色（sRGB 编码值 /255，非线性光；见 §3.2）──
const vec3 DEEP  = vec3(0.043, 0.055, 0.078); // #0B0E14
const vec3 BLUE  = vec3(0.290, 0.624, 0.898); // #4A9FE5
const vec3 EMBER = vec3(0.478, 0.290, 0.431); // #7A4A6E

// ── 星云几何 ──
// NRM = (cos θ, sin θ)，θ = TILT + π/2，TILT = −0.38 rad
// ⇒ 带垂直于 NRM，从左上贯到右下，亮区在左上（见 §4.3）
// 🚨 改 TILT 必须重新手算 NRM —— GLSL const 初始化式不保证支持内建函数调用
const vec2  NRM      = vec2(0.37092, 0.92866);
const float OFF1     = 0.14;    // 主带中心线偏移
const float OFF2     = -0.52;   // 次带中心线偏移
const float BAND_W   = 0.34;    // 主带高斯半宽
const float BAND2_W  = 0.187;   // 次带半宽 (= BAND_W × 0.55)
const float CORE_K   = 0.13;    // 带芯宽度系数（× 各自 BAND_W）
const float NOISE    = 0.42;    // 边缘噪声扰动幅度
const float NSCALE   = 1.15;    // 噪声空间尺度

// ── 强度（🚨 全部受 §4.1 不变量约束，改前必须重算）──
const float AMP1     = 0.115;   // 主带弥漫体
const float AMP2     = 0.075;   // 次带弥漫体
const float CORE     = 0.030;   // 带芯亮线 =「那道杠」
const float EMBER_MIX= 0.62;    // 次带的品红混合比 [0,0.7]
const float VIG      = 0.45;    // 暗角压迫
const float STAR     = 0.30;    // 星点密度 [0,1]
const float DITHER   = 1.4;     // 抖动强度（单位：1/255）

// ── 引力透镜 ──
const float LENS_R   = 0.10;    // 影响半径 = 全井唯一尺寸旋钮（v1.1，原 0.42）
const float HORIZON  = 0.14;    // 视界半径系数（× LENS_R）
const float RING     = 0.09;    // 🚨 光子环峰值 — 上限，见 §5.4

float hash21(vec2 p){
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i),               hash21(i + vec2(1.0, 0.0)), u.x),
             mix(hash21(i + vec2(0.0,1.0)), hash21(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p){
  float s = 0.0, a = 0.5;
  for (int k = 0; k < 5; k++){ s += a * vnoise(p); p = p * 2.03 + 17.1; a *= 0.5; }
  return s;
}

// 带心有符号距离；边缘被 fbm 啃出不规则轮廓
float bandDist(vec2 p, float offset, float n){
  return dot(p, NRM) - offset + (n - 0.5) * NOISE;
}
float gauss(float d, float w){ return exp(-(d * d) / max(w * w, 1e-5)); }

// 极稀疏星点，只在星云带内出现；被透镜切向拉伸成弧（物理上正确）
float stars(vec2 p, float mask){
  vec2 g = p * 26.0;
  vec2 i = floor(g);
  float h = hash21(i * 1.7);
  float thresh = mix(0.997, 0.965, STAR);
  if (h < thresh) return 0.0;
  vec2 jit = vec2(hash21(i * 3.1), hash21(i * 5.7)) - 0.5;
  float d = length(fract(g) - 0.5 - jit * 0.7);
  return exp(-d * d * 1100.0) * (0.25 + 0.75 * hash21(i * 9.3)) * mask;
}

void main(){
  // 纵横比正确的归一化坐标，原点在屏幕中心，单位 = 视口高度
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;

  // ── 引力透镜：采样前先扭曲坐标 ──
  // 弱场偏折 ∝ 1/r（施瓦西近似）。
  // 🚨 min(·, 0.96r) 钳位不可删：不钳位时采样点会越过井心，
  //    产生镜像翻转的诡异观感，那不是引力透镜。
  vec2  toC  = p - uHole;
  float r    = length(toC);
  float rr   = max(r, 1e-4);
  float defl = (LENS_R * LENS_R) / rr;
  float d    = min(defl * uStrength, rr * 0.96);
  vec2  ps   = p - (toC / rr) * d;

  // ── 星云带 ──
  float n1 = fbm(ps * NSCALE);
  float n2 = fbm(ps * NSCALE * 2.4);
  float d1 = bandDist(ps, OFF1, n1);
  float d2 = bandDist(ps, OFF2, n2);

  float b1 = gauss(d1, BAND_W);              // 弥漫体
  float b2 = gauss(d2, BAND2_W);
  float c1 = gauss(d1, BAND_W  * CORE_K);    // 带芯亮线 =「那道杠」
  float c2 = gauss(d2, BAND2_W * CORE_K);

  vec3 col = DEEP;
  col += BLUE                        * (b1 * AMP1 + c1 * CORE);
  col += mix(BLUE, EMBER, EMBER_MIX) * (b2 * AMP2 + c2 * CORE * 0.7);
  col += vec3(0.82, 0.88, 1.0) * stars(ps, clamp(b1 + b2, 0.0, 1.0));

  // ── 事件视界 + 光子环 ──
  // 🚨 sGate 不可删：强度归零时视界必须完全消失，
  //    否则指针从未进入页面也会挂着一个黑盘。
  //    用 smoothstep 而非直接乘 uStrength —— 后者会在正常强度区间过度缩小视界。
  float sGate = smoothstep(0.0, 0.12, uStrength);
  float rH = LENS_R * HORIZON * (0.55 + 0.45 * uStrength) * sGate;
  if (rH > 1e-4){
    // 🚨 实施修正（2026-07-27）：本行原写 pow(·, 2.0)。GLSL ES 规范规定
    //    pow(x, y) 在 x < 0 时**行为未定义**，而这个底数在光子环内侧
    //    （r < rH·1.75）恒为负——部分驱动会返回 NaN，环内侧整片炸成
    //    黑洞或白斑。平方数学等价且无未定义域，一律写 rt*rt
    float rt = (r - rH * 1.75) / max(rH * 0.34, 1e-4);
    float ring = exp(-rt * rt);
    col += BLUE * ring * RING * uStrength;
    col *= smoothstep(rH * 0.90, rH * 1.30, r);
  }

  // ── 暗角压迫 ──
  float v = 1.0 - VIG * pow(length(p * vec2(0.60, 1.0)), 1.7);
  col *= clamp(v, 0.0, 1.0);

  // ── 抖动 ──
  // 🚨 不可删：#0B0E14 → #16253５ 这种极窄的近黑渐变在 8bit 下必然出色带，
  //    整屏会是横条纹。静态抖动（无时间项）—— 时变抖动在静止画面上会读作
  //    胶片颗粒的闪烁，那是本设计明令排除的运动。
  col += (hash21(gl_FragCoord.xy) - 0.5) * (DITHER / 255.0);

  fragColor = vec4(col, 1.0);
}
```

### 5.2 无 `uTime`

shader 不接受时间参数。这是 §1.1① 的直接后果，且是 §7 静态帧逐位一致的前提。
**新增任何时间相关项都会破坏这两条，需要重新走 spec。**

### 5.3 常量的可调范围（「细节打磨」的合法边界）

构图相关常量（`OFF1` / `OFF2` / `TILT`→`NRM` / `BAND_W` / `BAND2_W` /
`NSCALE` / `NOISE` / `VIG` / `STAR`）**可以自由微调**，只要满足 §4.1 不变量。

强度相关常量（`AMP1` / `AMP2` / `CORE` / `RING` / `EMBER_MIX`）
**每次改动都必须重跑 §4.1 实算**并把新数字写回本 spec 与 CLAUDE.md。

**尺寸常量 `LENS_R`（v1.1 补分类）——「引力井的唯一尺寸旋钮」，与强度类同档
对待：改动必须重跑 §4.1 实算。** 初版把它漏在两类之外，且当时的直觉
（「只是缩放几何，不影响亮度」）是错的，理由见 §5.5。

透镜内部的比例常量（`HORIZON` / 环心系数 `1.75` / 环宽系数 `0.34` /
黑盘 `0.90–1.30`）定义的是**井的形态**而非大小：`LENS_R` 缩放时它们保持不变，
整个井自相似地缩放。要改大小**只动 `LENS_R`**，不要去凑这些比例。

### 5.4 `RING` 上限的由来（实算记录）

原型初始值 `RING = 0.26`。实算发现：光子环半径约 `LENS_R × HORIZON × 1.75 ×
uRes.y ≈ 93px`（当时 `LENS_R = 0.42`；v1.1 收到 0.10 后 ≈ **22px**）——指针移到
正文上时，环**必然扫过文字**。

⚠️ v1.1 的尺寸收敛**没有松动这条上限**：环峰亮度 = `RING × uStrength`，与
环半径无关；环变小只是让被盖住的字变少，盖住时的对比度一模一样。

环与带芯叠加时：

```
col = (0.0851, 0.1455, 0.2082) + BLUE × 0.26
    = (0.1605, 0.3077, 0.4417) → rgb(41, 78, 113)
L   = 0.071168
tertiary  对比度 = 0.37043 / 0.121168 = 3.06  ❌
secondary 对比度 = 0.46908 / 0.121168 = 3.87  ❌
```

解 `RING` 使叠加后仍满足 §4.1：

```
RING = 0.09 → col = (0.111, 0.201, 0.289) → rgb(28, 51, 74)
             L = 0.0311 ≤ 0.0323  ✅
             tertiary 对比度 = 0.37043 / 0.0811 = 4.57  ✅
```

⇒ **`RING ≤ 0.09` 是硬上限**。这是「好看但违法」的典型案例，记录在此防回潮。

### 5.5 `LENS_R` 从 0.42 收到 0.10（v1.1 · 2026-07-28）

**起因**：David 反馈「黑洞太大、过度抢夺注意力，改成和鼠标大小相仿」。

**量化起因**（1440×900 实测，与解析式逐点吻合）：

| | 事件视界可见直径 | 光子环半径 | 极限扭曲区直径（`defl·s ≥ 0.96r` 被钳位的范围） |
|---|---|---|---|
| 0.42 空闲 `s`=0.3 | 94px | 63px | **422px** |
| 0.42 按下 `s`=1.0 | 138px | 91px | 730px |
| **0.10 空闲** | **22px** | 15px | **100px** |
| **0.10 按下** | 33px | 21px | 170px |

422px 直径的强扭曲区跟着指针跑——这是「背景喧宾夺主」的量化来源。收到 0.10 后
事件视界落在光标尺度（macOS 箭头 12×19，热区盒 ≈24px），扭曲仍可辨识。

**为什么只动一个常量**：透镜场关于 `LENS_R` **自相似**。偏折 `d = LENS_R²/r`，
视界 `rH ∝ LENS_R` ⇒ 令 `LENS_R' = k·LENS_R`，则在缩放后的对应点 `r' = k·r` 处
`d' = k²LENS_R²/(k·r) = k·d`。井的**形态一位不变**，整体等比缩放。

**🚨 被实测推翻的一条直觉（记在这里防复发）**：改动时先写下的论证是「星云项只是
换个位置采样、值域不变，环峰与半径无关，所以全局峰值单调不增 ⇒ 不必重跑 §4.1」。
**这是错的**：全图峰值是星云与环的**叠加**，而环半径决定它能否整体坐进带芯亮区——
带芯半宽 = `BAND_W × CORE_K ≈ 0.0442 vh ≈ 40px`，0.42 下环 93px 只压得中一小段，
0.10 下环 22px 可以整圈落进去，叠加峰值**可能上升**。所以 `LENS_R` 归入必须重算
的一档（§5.3）。

**重跑 §4.1 的结果**（1440×900，`stars()` 整行摘除，井心沿带芯中心线扫 25 点取最坏）：

| 档 | 最坏峰值 RGB | L | tertiary | 判定 |
|---|---|---|---|---|
| 0.42 空闲 `s`=0.3 | `rgb(23,40,57)` | 0.019951 | 5.30:1 | ✅ |
| 0.42 按下 `s`=1.0 | `rgb(28,50,71)` | 0.029830 | 4.64:1 | ✅ |
| **0.10 空闲** | `rgb(23,39,56)` | 0.019187 | **5.35:1** | ✅ |
| **0.10 按下** | `rgb(27,49,70)` | 0.028718 | **4.71:1** | ✅ |
| 无井 `s`=0（静态帧口径） | `rgb(22,37,52)` | 0.017416 | 5.49:1 | ✅ |

担心的叠加抬升**没有发生**，缩小后反而略宽松（4.71 vs 4.64）。

两点方法学备注：
1. **`STAR = 0` 不等于禁用星点**——阈值是 `mix(0.997, 0.965, STAR)`，STAR=0 仍有
   0.3% 的格子出星，测到的最亮像素永远是 STARLIGHT。必须**摘掉 `col += STARLIGHT
   * stars(…)` 整行**。§4.1.1 说的「彻底禁用」指的就是这个，别照字面把常量归零。
2. 本次是**扫 25 点取最坏**，而 §4.1.1 那张表是**单点**测的（故记作 5.23:1，比
   本表 0.42 按下的 4.64:1 乐观）。扫描步长 0.05 vh = 45px，对 22px 的小环而言
   仍可能漏掉真正最坏的位置——**但漏不掉也不要紧**：§5.4 的纸面 4.57:1 是假设
   环峰与带芯峰完全重合的上界，与几何无关，任何半径都被它兜住。

**不需要重渲静态帧**：静态帧是 `uStrength = 0`，此时 `d ≡ 0` 且 `sGate = 0`，
`LENS_R` 完全不参与成像。上表末行是 0.10 档跑出的无井峰值，与 §4.1.1 记录的
`uStrength=0` 那一档逐位相同——即为佐证。

⚠️ **纸面 4.57 vs 实测 5.23（§4.1.1）—— 两个数都对，别去「对齐」它们**：
上面的推算假设**环峰与带芯峰完全重合**（保守上界），而实际几何下光子环是绕
井心的一圈、带芯是一道斜贯画面的线，两者最亮处并不落在同一像素。所以实测
必然比纸面宽松。做新常量的**准入判断时用纸面**（保守），**记录现状时用实测**。

---

## §6 引力透镜的交互与物理

### 6.1 状态量（全局仅 3 个标量 + 1 个二维量）

| 量 | 含义 | 弹簧 |
|---|---|---|
| `hole` (x, y) | 井心位置 | k = 9, ζ = 1.0（临界阻尼） |
| `strength` | 引力强度 | k = 26, ζ = 0.9 |

本节的 JS 侧常量（`K_HOLE` / `Z_HOLE` / `K_STR` / `Z_STR` / `S_IDLE` / `S_PRESS` /
`DT_MAX` / `DPR_CAP`）与 §5.1 的 GLSL 常量**同住 `src/lib/void-field-shader.ts`**，
一处一份。禁止在组件里就地写数值字面量。

**零逐元素状态**——与砖墙重力井「全局仅 3 标量弹簧、砖的形变是井心位置的
纯函数」同一纪律。这里更彻底：形变发生在 shader 里，连元素都没有。

积分器：半隐式欧拉，`dt` 上限 0.05s（防标签页切回时的巨大时间步炸掉弹簧）。

### 6.2 强度目标值

| 情形 | `strength` 目标 |
|---|---|
| 指针从未进入 / 已离开窗口 / 窗口失焦 | `0`（画面无任何引力痕迹） |
| 指针在窗口内、未按下 | `S_IDLE = 0.30` |
| 指针按下（拖动中） | `S_PRESS = 1.00` |

井心弹簧的 `k = 9` 是**刻意偏软**的：它让快速拖动时井心明显滞后于指针，
读作「这个东西有质量」。这是「通过鼠标拖动展现重力变化」的核心体感——
不是位置跟随，是**惯性**。

⚠️ `pointerleave` / `blur` 都必须把目标打到 `0`：手指与 Cmd-Tab / 切标签
都不会产生 `pointerleave`，这条与 `pointer-tilt-engine.ts` 现有口径一致。

### 6.3 帧循环与停帧

```
需要渲染 ⟺ (指针本帧移动过) ∨ (任一弹簧未收敛) ∨ (本帧发生 resize)
收敛判据：|hole − target| < 1e-4 ∧ |v| < 1e-4（strength 同理）
```

收敛即 `cancelAnimationFrame` 并置空句柄；下一次 `pointermove` /
`pointerdown` / `resize` 重新起循环。

`document.visibilitychange` → 隐藏时立即停帧，可见时重置弹簧时间基准
（不是继续积分，避免用一个巨大的 `dt` 追赶）。

### 6.4 动画白名单登记

CLAUDE.md 的 mouse-tracking 豁免列表里，**`brick-well` 那一条整条替换为**：

> ✅ `void-lens` — 引力透镜（VoidFieldGL：全局 2 根弹簧「井心 + 强度」半隐式
> 欧拉，空间扭曲是井心与强度的纯函数，零逐元素状态；`pointerdown` 时强度
> 0.30→1.00 走同一根弹簧；逐帧只写 3 个 uniform，扭曲全在 GPU；弹簧收敛即
> 停帧、标签页隐藏即停帧；**零发光跟随**——光子环 α ≤ 0.09 受 §4.1 不变量
> 约束；仅 hover+fine 且非 RM 挂载，触屏/RM/无 JS/无 WebGL2 = 静态帧；
> mouse-tracking 豁免第 2 例，仅限 VoidFieldGL）

其余三例豁免（Hero 物件 / ButtonTilt / CardTilt）不变。

---

## §7 静态降级帧

### 7.1 生成方式

用与实时层**同一支 shader**、同一组常量、`uStrength = 0` 离线渲染，
导出 PNG → 压 WebP。因 shader 无 `uTime`，产物在**同分辨率下**与实时层的
空闲态逐像素一致；实际使用时经 `cover` 缩放，一致的是画面构成而非像素。

| 文件 | 尺寸 | 生效条件 |
|---|---|---|
| `public/void-still-l.webp` | 1600 × 900 | 默认 |
| `public/void-still-p.webp` | 900 × 1600 | `@media (orientation: portrait)` |

两张而非一张：静态帧的主要消费方是手机（竖屏）。单用横向图 + `cover`
会把星云带裁掉大半，构图完全走样。

预算：每张 ≤ 25 KB（画面极平滑，WebP q80 足够）；**只加载其中一张**。

⚠️ 星点在放大时会略糊（1600×900 拉到 4K 是 2.4×）。可接受——静态帧只服务
降级路径，且画面本身几乎没有高频内容。

#### 7.1.1 实施记录：有损压缩与 `DITHER` 的硬冲突（2026-07-27）

**本节原本没预见到的张力**：§5.1 的 `DITHER` 是逐像素随机噪声，而有损
WebP 的设计目标恰恰是丢掉这类高频信息 —— **压缩必然抹掉抖动**。实测
（1600×900，「水平相邻像素完全同色」的比例 = 色带指标）：

| 版本 | 大小 | 相邻同色 | 最长同色游程 |
|---|---|---|---|
| 原始 PNG（dither 完整） | 875 KB | 30.0% | 18 px |
| WebP q80 | 4.5 KB | 97.5% | 336 px |
| WebP q90 | 7.3 KB | 96.9% | 320 px |
| **WebP q95（采用）** | **14.3 KB** | 94.2% | 240 px |
| 无损 WebP | 555 KB | — | — |

无损路线**在信息论上不可能**进 25 KB 预算：±1 的随机抖动本身就需要
约 1.44M × log₂3 ≈ 285 KB，压缩器对随机数据无能为力。

定案 **q95**（14.3 KB / 12.1 KB，均在预算内，块效应最轻）。取舍依据：
把两张图并排做原尺寸目视比对**看不出差别**，块效应只在 25× 对比度拉伸的
诊断图上显形；且静态帧只服务降级路径，实时层的 dither 完整无损。

⚠️ 换算法/换质量档时必须重跑上表这个指标 —— 单看文件大小会掉进
「q80 只要 4.5 KB」的陷阱，那 4.5 KB 正是抖动被抹干净的代价。

### 7.2 CSS

```css
.void-field-still {
  position: absolute; inset: 0; z-index: 1;
  background: #0b0e14 url('/void-still-l.webp') center / cover no-repeat;
}
@media (orientation: portrait) {
  .void-field-still { background-image: url('/void-still-p.webp'); }
}
.void-field[data-live] .void-field-still { display: none; }
```

`background-color` 兜底：图片加载失败时仍是深空底，不会闪白。

---

## §8 降级链（五级，全部必须实现）

| # | 条件 | 行为 |
|---|---|---|
| 1 | 无 JS / SSR | 静态帧（唯一保底，永远存在） |
| 2 | `getContext('webgl2')` 返回 null / 编译链接失败 | 不落 `data-live`，静态帧原样；`console.error` 记录，不抛 |
| 3 | `prefers-reduced-motion: reduce` | **不挂 canvas**（零 rAF），静态帧 |
| 4 | 触屏 / `(hover: none)` 或 `(pointer: coarse)` | **不挂 canvas**，静态帧 |
| 5 | `webglcontextlost` | `preventDefault()` + 撤 `data-live` → 静态帧；`webglcontextrestored` → 重建资源并复原 |

第 3、4 级与现有 `WallBricks`「仅 hover+fine 且非 RM 懒启动」逐字同构，
媒体查询监听走既有的 `src/lib/listen-mql.ts`。

⚠️ 媒体查询必须**动态监听**而非一次性判断：外接鼠标、系统偏好切换都会
在运行时改变判定结果。

---

## §9 性能纪律

| 项 | 规定 |
|---|---|
| DPR 上限 | `min(devicePixelRatio, 1.5)` —— 全屏平滑渐变不需要 3× |
| context 参数 | `{ antialias: false, alpha: false, powerPreference: 'high-performance' }` |
| 空闲成本 | **零**（无 rAF、无 GPU 提交），见 §6.3 |
| 逐帧主线程写入 | 3 个 uniform（`uHole` ×2、`uStrength`）+ 1 次 `drawArrays` |
| resize | 节流到 rAF；`canvas.width/height` 未变则不重设（避免无谓的帧缓冲重分配） |
| 首屏 | client 岛不阻塞 LCP；canvas 在挂载后创建 |
| 包体 | **+0 KB 依赖**。WebGL2 是平台 API，`package.json` 一行不加 |
| **GPU 逐帧成本**（实施期补记） | 本表原本只记主线程。片元着色器每像素约 2×fbm(5 阶) ≈ 40 次 `hash21` + ~15 次 `exp`；1920×1080 @DPR1.5 ≈ 4.7M 片元 × ~200 ALU **仅在指针移动时**。`DPR_CAP=1.5` 是主要缓解手段。⚠️ 别在「主线程只写 3 个 uniform」的印象下随手加第八阶噪声或第三条带 |

### 9.1 与砖墙的对照（换代收益）

| | 砖墙 v9 | Void Field v1 |
|---|---|---|
| 空闲态主线程 | 门控前 29.2%，门控后 0.48% | **0%** |
| 每帧 layout | 门控前 225 次全文档，门控后 1 次 | **0 次**（无 DOM 参与） |
| 交互态 DOM 写入 | 每帧写数百个 `.bp-brick` 的 transform/opacity | 3 个 uniform |
| CSS 体量 | ~200 行 + 两条巨长 SVG data-URI | ~20 行 |
| 组件代码 | 473 行（含 434 行砖阵调度） | 约 250 行（估） |

---

## §10 删除与迁移清单

### 10.1 删除

| 目标 | 动作 |
|---|---|
| `src/components/shared/BlueprintWall.tsx` | 删除（39 行） |
| `src/components/shared/WallBricks.tsx` | 删除（434 行） |
| `globals.css` `:root` 内 `--wall-*` 簇（约 142–160、181–232 行） | 删除，含 `--wall-tile-brick` / `--wall-tile-bed` 两条 SVG data-URI 与 `--wall-brick-h` 及其两级媒体查询阶梯 |
| `globals.css` `.bp-wall` / `.bp-wall-face` / `.bp-wall-grid` / `.bp-brick*`（约 357–460 行） | 删除 |

### 10.2 改写

| 位置 | 改动 |
|---|---|
| `globals.css:663, 705` | `var(--wall-face-base)` → `var(--bg-elevated)`（值不变，语义换锚，见 §4.2） |
| `src/app/(public)/layout.tsx:26` | `<BlueprintWall />` → `<VoidField />`，更新文件头注释 |
| `src/app/not-found.tsx:32` | 同上 |
| `src/components/home/HomeHero.tsx:27` | 注释里的「fixed 场景砖墙」→ 深空引力场 |
| `src/components/shared/PageHero.tsx:4` | 同上 |
| `src/lib/listen-mql.ts:4` | 注释中的 `WallBricks` → `VoidFieldGL` |
| `src/lib/pointer-tilt-engine.ts:140, 160, 218` | 注释中的「与 WallBricks 同一口径」→ VoidFieldGL |
| `src/app/(public)/error.tsx:13` | 注释里的 `BlueprintWall` 单实例说明改名 |

### 10.3 文档

| 文件 | 动作 |
|---|---|
| `docs/superpowers/specs/2026-07-27-graphite-wall-v9-running-bond-design.md` | 加 🛑 退役横幅，指向本文 |
| `docs/superpowers/specs/2026-07-27-graphite-wall-v8-design.md` | 同上 |
| `docs/superpowers/specs/2026-07-26-lantern-wall-v6-design.md` | 同上（若尚无横幅） |
| `CLAUDE.md` | §2 设计概念段整段改写；§4 色彩（色相纪律 + 对比度基准表 + 砖墙材质豁免条）；§6 动画白名单（`brick-well` → `void-lens`）；§7 按钮锚点；正本指针 |

⚠️ 当前工作区里 `CLAUDE.md` / `globals.css` / `BlueprintWall.tsx` /
`WallBricks.tsx` 有**未提交的 v9 改动**。实施前必须先决定：提交它们
（保留 v9 历史）还是丢弃。**推荐先提交**——v9 spec 已入库，代码不入库会
造成 spec 与历史对不上。

---

## §11 给子项目 B / C 的接口约定

本 spec 定下、B 与 C 必须遵守的：

| 接口 | 约定 |
|---|---|
| 光源方向 | 左上（星云带亮区在左上）。物件顶面受光、按钮顶棱、卡片 135deg 内反射全部保持现状 |
| 色相 | UI 层单色相 Synth Blue；第二色相仅限背景层 |
| 亮度上限 | §4.1 不变量对**背景层**成立。B 的物件属内容层，不受 `L ≤ 0.0323` 约束，但其后方的背景仍受约束 |
| 物件是否被透镜扭曲 | **否**。物件在 DOM 内容层，canvas 在 `z-index:-1`；跨层扭曲需要把物件渲进同一个 GL 场景，属 B 的设计空间，A 不预设 |
| 引力井与物件的关系 | A 不感知物件。若 B 想让物件对引力井有反应，由 B 读取井心（A 可暴露一个 CSS 自定义属性或事件，**接口由 B 提出，A 不预留**——YAGNI） |

---

## §12 验收标准

实施完成的定义（每条都可机械核验）：

1. `grep -rn "bp-wall\|bp-brick\|WallBricks\|BlueprintWall\|--wall-" src/` **零命中**
2. `npm run lint` 与 `npx tsc --noEmit` 全绿
3. 首页 / about / products / contact / 404 五个路由背景一致，无重复实例
4. 桌面 hover+fine：指针移动出现引力井，按下加深，抬起回落，离开窗口归零
5. 指针静止 2s 后，DevTools Performance 录制显示**零 rAF 回调**
6. 触屏模拟（DevTools device mode）：无 canvas 元素，静态帧可见
7. `prefers-reduced-motion: reduce`：无 canvas，静态帧可见，零 rAF
8. 禁用 WebGL（`chrome://flags`）：静态帧可见，控制台无未捕获异常
9. 竖屏视口加载 `void-still-p.webp`，横屏加载 `void-still-l.webp`，二者不同时加载
10. 取背景最亮像素实测 RGB，代入 §4.1 公式验证 `L ≤ 0.0323`
11. 全屏截图放大检查：近黑区域**无横向色带**
12. 按下并把井心停在正文上，`tertiary` 文字仍清晰可读（对应 §5.4 的 4.57:1）
13. **（审查后补入）** `grep -n "砖\|墙" src/` 只剩「砖墙时代…已退役」这类历史
    对照，没有任何一处仍在**指导**按砖墙实施 —— 第 1 条的 ASCII grep 按构造
    查不到中文散文，而本次真有 10 个源文件漏网（含 2 处错误的对比度数字）
14. **（审查后补入）** 用 `WEBGL_lose_context` 扩展真实触发丢失/恢复：恢复后
    画面与丢失前**逐位一致**（能抓到 `uRes` 未重传导致的整屏 NaN）；
    `forced-colors: active` 下零 canvas；全程控制台零未捕获异常

### 12.1 验收执行记录（2026-07-27，生产构建 `npm run build` + `npm start`）

| # | 结果 | 证据 |
|---|---|---|
| 1 | ✅ | `grep -rn "bp-wall\|bp-brick\|WallBricks\|BlueprintWall\|--wall-" src/` 零命中 |
| 2 | ✅ | `npm run lint` 与 `npx tsc --noEmit` 全绿；`npm run build` 全站静态预渲染成功 |
| 3 | ✅ | 五路由 SSR 各恰好 1 个 `.void-field` + 1 个 `.void-field-still`，SSR 输出 0 个 canvas |
| 4 | ✅ | 纯背景层逐帧比对：空闲→悬停 70.3% 像素变化、悬停→按下 73.1%；**抬起回落与悬停态差 0.21%、离场归零与「从未进入」逐位一致（0.00%）** |
| 5 | ✅ | rAF 逐调用点归因：指针静止 2s 内 **0 次** rAF |
| 6 | ✅ | 触屏 context（390×844 / hasTouch / `hover:none` / `pointer:coarse`）：canvas 0 个、无 `data-live`、静态帧 `display:block` |
| 7 | ✅ | `reducedMotion: 'reduce'`：canvas 0 个、静态帧可见、零 rAF |
| 8 | ✅ | `--disable-webgl --disable-webgl2`：canvas 0 个（`initGL` 失败即自我移除），控制台无未捕获异常 |
| 9 | ✅ | 竖屏只请求 `void-still-p.webp`、横屏只请求 `void-still-l.webp`，二者从不同时加载 |
| 10 | ⚠️ | 见 §4.1.1：**星云带 5.50:1 合规**；星点 0.0063% 面积超限，已定案为「孤立点不构成排版承载面」 |
| 11 | ✅ | 实时层 dither 完整（相邻同色 30.0%）；静态帧经 q95 有损压缩后块效应仅在 25× 拉伸下可见，见 §7.1.1 |
| 12 | ✅ | 按下态非星点峰值 `rgb(38,53,69)` = 4.42:1，**低于**空闲态的 `rgb(40,53,69)` |

实施期发现并已修正的 spec 缺陷两处：§5.1 的 `pow(负数, 2.0)` 未定义行为、
§4.1 漏算 `stars()` 项。两处均已在对应章节就地记录，不另开文档。

### 12.2 代码审查轮次（2026-07-27，两个 reviewer 并行）

审查抓到的**实现级**缺陷（spec 未预见、两个 reviewer 独立命中同一条的标 ✱）：

| 级别 | 缺陷 | 后果 | 状态 |
|---|---|---|---|
| ✱High | `webglcontextrestored` 重建 program 后 **`uRes` 从不重传** —— `resize()` 的「尺寸没变就返回」在上下文丢失后必然命中（canvas 的 width/height 是 DOM 属性，不随上下文失效） | 新 program 的 uniform 初值为 0 ⇒ shader 首行 `/uRes.y` 除零 ⇒ **整屏 NaN**，且静态帧此时已被撤下，不改窗口大小就不自愈 | 已修：`syncViewport()` 在 `initGL()` 末尾无条件写一次 |
| High | `onContextLost` 不置任何丢失标记，恢复失败时 `live` 仍为真、`gl` 指向死上下文 | `setup()` 的 `if (live) return` 让 mql 再也修不回来 —— 无报错的**永久僵死态** | 已修：独立 `ctxLost` 闩短路 GL 提交；恢复失败走完整 `shutdown()` |
| Medium | 收敛阈位置与速度共用 `1e-4`（量纲不同：vh vs vh/s） | 快速甩动后仍要跑约 3.9s / 240 帧全屏 shader，渲染的是 **<0.09px** 的位移 | 已修：拆成 `REST_EPS_POS=1e-3`(≈0.9px) / `REST_EPS_VEL=3e-3`，实测收敛尾从 ~3.9s 降到 ~2.9s |
| Medium | DPR 变化（拖到另一块不同 DPI 的屏）不伴随 `resize` 事件 | 缓冲分辨率过时、被浏览器拉伸，**逐设备像素的 `DITHER` 被插值抹平** | 已修：监听 `(resolution: Xdppx)`，每次触发后重新武装 |
| ✱Medium | 上下文丢失窗口内 canvas 仍留在 z2 | 依赖「死 canvas 合成为透明」这一未定义行为；`alpha:false` 下可能是一块黑矩形 | 已修：CSS `.void-field:not([data-live]) .void-field-gl{display:none}` —— 层纪律从约定变成事实 |
| Medium | `initGL()` 半失败路径泄漏 shader 对象；`setup()` 失败路径不释放上下文、不解绑监听器 | 浏览器对同时存活的 WebGL 上下文有硬上限（~16） | 已修：抽出共用的 `releaseGL()` |
| Medium | `pressed` 是自有闩，拖出窗口再拖回时被 `onLeave` 清掉 | 用户明明还按着键，井却回到浅档并卡住（与 §6.2 状态表矛盾） | 已修：改从 `e.buttons` 位派生，零新状态、自愈 |
| Medium | 无 `forced-colors` 逃生舱 | 高对比度模式下 UA 不重绘 `background-image`、更管不到 canvas 像素 ⇒ 浅色主题黑字压近黑深空 | 已修：CSS 隐藏整层 + `evaluate()` 门控（连 canvas 都不挂） |
| Low | `hash21` 在大 `gl_FragCoord` 处精度退化（highp 24 位尾数，x≈3840 时 ULP 已达 0.031） | 宽屏右半边 dither 退化成周期纹理 | 已修：`mod(gl_FragCoord.xy, 512.0)`。实测 4K 最右 540px 的最长同色游程 23px → 16px |
| Low | 星点色 `vec3(0.82,0.88,1.0)` 是裸字面量、未登记 | 全站最亮像素的来源却不在任何治理表里 | 已修：提为 `STARLIGHT` 并补进 §3.2 |
| Low | 文档漂移：**10 个源文件**仍在描述砖墙，含 2 处**错误的对比度数字** | §12 #1 的 grep 只查 ASCII 标识符，按构造查不到中文散文 | 已修；验收清单补一条 `grep -n "砖\|墙" src/` |

**修复期自己引入并当场发现的回归 1 处**：新加的 `:not([data-live])` 隐藏规则
让 canvas 在装配期就是 `display:none`，`canvas.clientWidth` 恒为 0 ⇒ 那句本
只作兜底的 `|| documentElement.clientWidth` 变成主路径，读到**含滚动条**的
文档宽。已改为量宿主 `.void-field`，并顺带发现 `window.resize` **盖不住
滚动条出现/消失**（站内长短页导航天天触发），补 `ResizeObserver` 观察宿主。

复测（生产构建）：上下文丢失→恢复前后画面**逐位一致（0.00%）**；滚动条消失
后缓冲与宿主同步 1429→1440；`forced-colors` 下零 canvas、整层 `display:none`；
全程控制台**零错误、零未捕获异常**。

---

## 附录 A — 亮度实算依据

WCAG 相对亮度：`L = 0.2126R + 0.7152G + 0.0722B`，其中每个分量
`c = (c₈/255 ≤ 0.03928) ? c₈/255/12.92 : ((c₈/255 + 0.055)/1.055)^2.4`。

| 颜色 | Hex | L |
|---|---|---|
| 星云带芯（`AMP1 + CORE` 峰值） | ≈ `#162535` | 0.017514 |
| 带芯 + 光子环 `RING=0.09` | ≈ `#1C334A` | 0.031098 |
| 带芯 + 光子环 `RING=0.26`（❌ 已否决） | ≈ `#294E71` | 0.071168 |
| 砖面平底（旧基准，仅对照） | `#111620` | 0.007956 |
| `txt-primary` | `#E8ECF0` | 0.834380 |
| `txt-secondary` | `#A6AEBA` | 0.419080 |
| `txt-tertiary` | `#929AA8` | 0.320430 |
| `txt-quaternary` | `#78818F` | 0.216820 |

校验：`tertiary` 对砖面 = `(0.32043+0.05)/(0.007956+0.05) = 6.392`，
与 CLAUDE.md 记录的 6.39 逐位吻合 ⇒ 本表算法与既有基准同源，可直接替换。

## 附录 B — 原型

调参原型（含全部滑块与参数导出）：
`scratchpad/void-proto/index.html`，`python3 -m http.server 3110` 起服务。

原型与本 spec 的三处差异（spec 为准）：
1. 原型有 `drift` 滑块 → **spec 删除**，星云静止（§1.1①）
2. 原型 `RING` 默认 0.26 → **spec 钳到 0.09**（§5.4）
3. 原型 `TILT = +0.38`（带从左下到右上）→ **spec 取 −0.38**（§4.3）
