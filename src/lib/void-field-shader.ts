// ─── Void Field v1 · 深空引力场 —— 数值与 GLSL 的唯一事实源 ───
// 正本 = docs/superpowers/specs/2026-07-27-void-field-v1-deep-space-design.md
//
// 概念：背景 = 一片静止的深空，指针 = 压在空间上的引力井。
// 宇宙是静的，唯一的运动来自你施加的引力——指针不动时画面上没有任何
// 东西需要重画（空闲态零 rAF / 零 GPU / 零主线程，不是「优化到很便宜」）。
//
// 🚨 shader 是 (fragCoord, hole, strength) 的**纯函数，无 uTime**。
// 这是空闲零成本与 §7 静态降级帧同源的共同前提——新增任何时间相关项
// 都会同时破坏这两条，需要重新走 spec。
//
// 🚨 GLSL 常量与本文件的 JS 常量**一处一份**：VoidFieldGL 组件里不得
// 就地写任何数值字面量。

// ── JS 侧：弹簧与运行时（spec §6.1 / §9）──

/** 井心弹簧刚度 ω²。刻意偏软（ω = 3 rad/s）：快速拖动时井心明显滞后于
 *  指针，读作「这个东西有质量」——核心体感是惯性，不是位置跟随 */
export const K_HOLE = 9;
/** 井心阻尼比 —— 临界阻尼，零过冲 */
export const Z_HOLE = 1.0;
/** 强度弹簧刚度 ω²（ω ≈ 5.1 rad/s，比井心快：深浅变化要跟手） */
export const K_STR = 26;
/** 强度阻尼比 */
export const Z_STR = 0.9;

/** 阻尼系数 c = 2ζω —— 半隐式欧拉直接消费，避免逐帧开方 */
export const C_HOLE = 2 * Z_HOLE * Math.sqrt(K_HOLE);
export const C_STR = 2 * Z_STR * Math.sqrt(K_STR);

/** 指针在窗口内、未按下 */
export const S_IDLE = 0.3;
/** 指针按下（拖动中）——走同一根弹簧，零新状态 */
export const S_PRESS = 1.0;
/** 冷井原地浮现的强度阈：井弱到这个程度即视为「已熄灭」，下次指针出现时
 *  井心瞬移到指针而不从旧位置横穿视口飞掠（≈ S_IDLE 的 6.7%） */
export const S_RESNAP = 0.02;

/** 积分步长上限（秒）：标签页切回时的巨大时间步会炸掉弹簧。
 *  半隐式欧拉 + 显式阻尼的稳定条件是 dt < 2/c，最严的是 C_STR=9.18 ⇒ dt<0.218，
 *  0.05 留了 4× 余量 */
export const DT_MAX = 0.05;
/** DPR 上限 —— 全屏平滑渐变不需要 3× */
export const DPR_CAP = 1.5;

// ── 收敛阈：位置与速度**量纲不同**，必须分开定档 ──
// 🚨 两者曾共用 1e-4，代价是快速甩动后仍要跑约 3.9s / 240 帧全屏 shader：
// 临界阻尼的包络是 (1+ωt)e^(−ωt)，ω=3 时从 0.4vh 的滞后降到 1e-4 就要这么久，
// 而那 240 帧渲染的是**小于 0.09px** 的位移。速度判据才是真正的绑定条件
// （位置过阈时 |v|≈3ε，还要多跑 ln3/ω ≈ 0.37s）。
// 现档参照全站先例（pointer-tilt-engine 相对阈 2.5e-3、HeroObjectPhysics 7e-4）。
/** 位置/强度收敛阈（单位 = 视口高的倍数；1e-3 ≈ 0.9px @900px 高，仍是亚像素） */
export const REST_EPS_POS = 1e-3;
/** 速度收敛阈（单位 = 视口高/秒） */
export const REST_EPS_VEL = 3e-3;

// ── GLSL ──

/** 全屏三角形（比 quad 少一个顶点，且无对角线接缝） */
export const VERT_SRC = `#version 300 es
in vec2 a;
void main(){ gl_Position = vec4(a, 0.0, 1.0); }
`;

/** 全屏三角形顶点数据 —— drawArrays(TRIANGLES, 0, 3) */
export const TRI_VERTS = new Float32Array([-1, -1, 3, -1, -1, 3]);

export const FRAG_SRC = `#version 300 es
precision highp float;
out vec4 fragColor;

uniform vec2  uRes;       // canvas 像素尺寸
uniform vec2  uHole;      // 井心（与 p 同坐标系：原点屏心、单位视口高、y 向上）
uniform float uStrength;  // 引力强度，弹簧输出 [0, S_PRESS]

// ── 颜色（sRGB 编码值 /255，非线性光；shader 直写 8-bit 帧缓冲不做 gamma）──
const vec3 DEEP  = vec3(0.043, 0.055, 0.078); // #0B0E14 深空底，≥90% 画面面积
const vec3 BLUE  = vec3(0.290, 0.624, 0.898); // #4A9FE5 与 Tailwind accent 逐位交叉锁定
const vec3 EMBER = vec3(0.478, 0.290, 0.431); // #7A4A6E 余烬品红，仅次带
// 星光蓝白 —— 唯一不受「L ≤ 0.0323」约束的项（星点是孤立亮点，不构成排版
// 承载面，定案见 spec §4.1.1）。🚨 提亮它等于抬高全站最亮像素，改前重跑实算
const vec3 STARLIGHT = vec3(0.82, 0.88, 1.0);

// ── 星云几何 ──
// NRM = (cos θ, sin θ)，θ = TILT + π/2，TILT = −0.38 rad
// ⇒ 带垂直于 NRM，从左上贯到右下、亮区在左上——与全站「光从左上来」
//   （按钮顶棱受光 / 物件顶面受光 / 卡片 135deg 内反射）同向
// 🚨 改 TILT 必须重新手算 NRM —— GLSL const 初始化式不保证支持内建函数调用
const vec2  NRM      = vec2(0.37092, 0.92866);
const float OFF1     = 0.14;    // 主带中心线偏移
const float OFF2     = -0.52;   // 次带中心线偏移
const float BAND_W   = 0.34;    // 主带高斯半宽
const float BAND2_W  = 0.187;   // 次带半宽 (= BAND_W × 0.55)
const float CORE_K   = 0.13;    // 带芯宽度系数（× 各自 BAND_W）
const float NOISE    = 0.42;    // 边缘噪声扰动幅度
const float NSCALE   = 1.15;    // 噪声空间尺度

// ── 强度（🚨 全部受「任意像素 L ≤ 0.0323」不变量约束，改前必须重算）──
const float AMP1     = 0.115;   // 主带弥漫体
const float AMP2     = 0.075;   // 次带弥漫体
const float CORE     = 0.030;   // 带芯亮线 =「那道杠」
const float EMBER_MIX= 0.62;    // 次带的品红混合比 [0,0.7]
const float VIG      = 0.45;    // 暗角压迫
const float STAR     = 0.30;    // 星点密度 [0,1]
const float DITHER   = 1.4;     // 抖动强度（单位：1/255）

// ── 引力透镜 ──
// 🚨 LENS_R 是**整个引力井的唯一尺寸旋钮**：场关于它自相似（偏折
//    d = LENS_R²/r，视界 rH ∝ LENS_R ⇒ 把 p 与 uHole 同步缩放 k 倍时 d 也缩 k 倍）。
//    要改大小只动这一个数，HORIZON / RING / 1.75 / 0.34 这些比例保持形态不变。
//    v1.1 从原型的 0.42 收到 0.10（≈ 0.24×）：0.42 下空闲态的极限扭曲区
//    （defl·s 被 0.96r 钳住的范围）直径达 422px @900px 视口，一团比光标大 20 倍
//    的东西跟着指针跑 —— 背景喧宾夺主。现档把事件视界压到光标尺度
//    （空闲可见直径 ≈ 22px，按下 ≈ 33px），扭曲仍可辨识但不再抢视线。
//    ⚠️ 改尺寸**照样要跑 §4.1 亮度实算**——「单项峰值与半径无关所以总峰值不变」
//    是错的：全图峰值是星云与环的**叠加**，而环半径决定它能否整体坐进带芯亮区
//    （带芯半宽 ≈ 40px：0.42 下环 93px 只压得中一小段，0.10 下环 22px 可以整圈
//    落进去）。实测（井心沿带芯中心线扫 25 点取最坏、stars() 整行摘除——只把
//    STAR 设 0 没用，阈值 mix(0.997,…) 仍出星）：按下态 rgb(27,49,70)
//    L=0.028718 ⇒ tertiary 4.71:1 ✅（0.42 同法测得 4.64:1，缩小后反而略宽松）。
//    §5.4 的纸面 4.57:1 是与几何无关的上界，任何半径都被它兜住。
//    ⚠️ 但**不需要**重渲静态帧：静态帧是 uStrength=0，此时 d≡0 且 sGate=0，
//    LENS_R 完全不参与成像（实算佐证：0.10 下测得的无井峰值 rgb(22,37,52)
//    L=0.017416，与 CLAUDE.md 实测表 uStrength=0 那一档逐位相同）。
const float LENS_R   = 0.10;    // 影响半径 = 全井尺寸旋钮
const float HORIZON  = 0.14;    // 视界半径系数（× LENS_R）
const float RING     = 0.09;    // 🚨 光子环峰值 — 硬上限，见下方 main 内注释

float hash21(vec2 p){
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i),                 hash21(i + vec2(1.0, 0.0)), u.x),
             mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x), u.y);
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
  col += STARLIGHT * stars(ps, clamp(b1 + b2, 0.0, 1.0));

  // ── 事件视界 + 光子环 ──
  // 🚨 sGate 不可删：强度归零时视界必须完全消失，
  //    否则指针从未进入页面也会挂着一个黑盘。
  //    用 smoothstep 而非直接乘 uStrength —— 后者会在正常强度区间过度缩小视界。
  // 🚨 RING ≤ 0.09 是**硬上限**：环半径 = LENS_R×HORIZON×1.75 ≈ 22px @900px 视口
  //    （v1.1 前是 93px），指针停在正文上时环**照样**盖住字——半径缩了，
  //    环峰亮度与半径无关，所以这条上限一位不松。原型的 0.26 与带芯叠加后
  //    L = 0.0712 ⇒ tertiary 仅 3.06:1（违规）；
  //    0.09 叠加后 L = 0.0311 ≤ 0.0323 ⇒ tertiary 4.57:1 ✅
  float sGate = smoothstep(0.0, 0.12, uStrength);
  float rH = LENS_R * HORIZON * (0.55 + 0.45 * uStrength) * sGate;
  if (rH > 1e-4){
    // 🚨 写 rt*rt 而非 pow(rt, 2.0)：GLSL ES 规范规定 pow(x,y) 在 x<0 时
    //    **未定义**，而 rt 在环内侧恒为负——部分驱动会返回 NaN，环内侧
    //    整片炸成黑洞或白斑。平方数学等价且无未定义域
    float rt = (r - rH * 1.75) / max(rH * 0.34, 1e-4);
    float ring = exp(-rt * rt);
    col += BLUE * ring * RING * uStrength;
    col *= smoothstep(rH * 0.90, rH * 1.30, r);
  }

  // ── 暗角压迫 ──
  // 深邃靠明度层次与暗角，不靠元素数量
  float v = 1.0 - VIG * pow(length(p * vec2(0.60, 1.0)), 1.7);
  col *= clamp(v, 0.0, 1.0);

  // ── 抖动 ──
  // 🚨 不可删：#0B0E14 → #162535 这种极窄的近黑渐变在 8bit 下必然出色带，
  //    整屏会是横条纹。**静态**抖动（无时间项）—— 时变抖动在静止画面上
  //    会读作胶片颗粒的闪烁，那是本设计明令排除的运动。
  // 🚨 先对 512 取模再喂 hash：highp 是 24 位尾数，x≈3840 时 x*123.34≈4.7e5
  //    的 ULP 已达 0.031，fract() 只剩约 32 个可能值 —— 抖动在宽屏/4K 的右半
  //    边退化成约 32px 周期的规则纹理，恰好在最需要它的地方失效
  col += (hash21(mod(gl_FragCoord.xy, 512.0)) - 0.5) * (DITHER / 255.0);

  fragColor = vec4(col, 1.0);
}
`;
