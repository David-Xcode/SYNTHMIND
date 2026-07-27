// ─── Hero Blueprint Object v3 · Solid Machine 哑光实体机身 ───
// 设计定案：docs/superpowers/specs/2026-07-27-blueprint-object-v3-solid-design.md
//          （v2 七模块砌合 / 移动横陈变体的布局与编排全部继承）
// v3 桌面：360×440×150 原生重标（280 体系退役——CSS 3D 分辨率上限 = 布局尺寸，
// transform scale 放大只会放大位图），缝 8px、标注 11px tertiary、蚀刻加密
// v3 移动：300×168×120 几何不动（320px 窄屏约束），材质/描边/标注 10px 同步提档
// 各模块沿签名轴做慢周期错位-停驻-归位循环（modDrift 错峰，永不停止），
// 缝隙后方埋发光条（对齐漏微光，错开露内光），hover 单模块独立偏移+增亮
// 入场叙事 Draft→Build→Ship：棱线在装配偏移位逐笔绘制 → 模块滑入合体 → 蚀刻/缝光亮起
// 所有 .bp-draw 元素必须是 <path>：pathLength 在 rect/circle 上 WebKit 不支持，
// 会把 dasharray 归一化破坏成 1px 点线（圆/矩形一律 A / H V Z 路径命令改写）；
// 装饰性虚线刻度圈用 .bp-fade（dasharray 与 pathLength 归一化互斥，不能进 bp-draw）
// 透视链纪律：模块三层 wrapper（asm/drift/hover）全部 preserve-3d，缺一层 WebKit 压扁
// WebKit 零平面相交不变量：内墙右面/非顶行顶面不渲染；缝光条只做平行溢出
// Server Component — 装饰性图形 aria-hidden；指针物理在 HeroObjectPhysics（桌面变体专属）

import type { CSSProperties, ReactNode } from 'react';

// 描边色阶 — 同一蓝色相不同 alpha（逐面明度贴合固定光源：左上前方）
// v3 全档提亮（哑光实体机身）；与 :root 的 --mat-edge-* 交叉锁定，改值两处同步
const STROKE = {
  edgeFront: 'rgba(74, 159, 229, 0.62)',
  edgeTop: 'rgba(74, 159, 229, 0.55)',
  edgeRight: 'rgba(74, 159, 229, 0.45)',
  detail: 'rgba(74, 159, 229, 0.4)',
  inner: 'rgba(74, 159, 229, 0.3)',
  core: 'rgba(74, 159, 229, 0.65)',
  corePulse: 'rgba(74, 159, 229, 0.4)',
  boost: 'rgba(74, 159, 229, 0.95)',
} as const;

// 蚀刻细节入场延迟（秒）— Ship 阶段：走线/图形 → 辅助刻线 → 图签文字 → 焊盘圆点
// 桌面塔体节奏（入场总长 ~2.8s）
const T = {
  detail: '1.6s',
  detailB: '1.75s',
  aux: '1.9s',
  datum: '1.95s',
  labels: '2.15s',
  dots: '2.45s',
} as const;
// 移动横陈节奏 — 首屏即物件，编排压缩（~2.2s 收尾）
const MT = {
  detail: '1.3s',
  detailB: '1.45s',
  aux: '1.55s',
  labels: '1.75s',
  dots: '2s',
} as const;

// 核心圆环 — 两段圆弧拼整圆（circle 不能用 pathLength）
const CORE_RING = 'M92 59 A31 31 0 1 1 154 59 A31 31 0 1 1 92 59 Z'; // 桌面 r31 @ (123,59)
const CORE_RING_M = 'M28 28 A16 16 0 1 1 60 28 A16 16 0 1 1 28 28 Z'; // 移动 r16 @ (44,28)

// 小圆的 path 改写（安装孔/固定孔——bp-draw 纪律：circle 元素不可逐笔绘制）
const circlePath = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy} A${r} ${r} 0 1 1 ${cx + r} ${cy} A${r} ${r} 0 1 1 ${cx - r} ${cy} Z`;

interface ModuleDef {
  code: string; // 装配序列模块码（右侧面蚀刻，自下而上 = 真实装配顺序）
  x: number;
  y: number;
  w: number;
  h: number;
  core?: { x: number; y: number; r: number }; // core 前脸内凹 + 环心发光底（radial 圆心/半径）
  asm: readonly [number, number, number]; // 入场装配起始偏移（沿签名轴）
  asmDelay: string;
  drift?: readonly [number, number, number]; // 无限漂移幅度（无 = 静止锚）
  driftDur?: string;
  driftDelay?: string;
  hover?: readonly [number, number, number]; // hover 偏移（无 = 只增亮不位移）
  drawDelay: string; // 棱线绘制延迟（自下而上 stagger）
  solidifyDelay: string; // 面板实体化延迟
  hasTop?: boolean; // 顶面仅顶行渲染（其余藏在缝内，也避免与缝光条平面相交）
}

interface SeamDef {
  left: number;
  top: number;
  width: number;
  height: number;
  vertical?: boolean;
  delay: string;
}

// ═══ 桌面变体 · 竖塔（v3 360×440×150，缝 8px） ═══
// 模块表 — 自下而上 M.01→M.07；漂移周期/相位错峰（周期互质 + delay 交错），
// 保证任意 5s 观察窗总有模块在动；drift delay ≥2.8s（入场 ~2.8s 收尾后接管）
const MODULES: readonly ModuleDef[] = [
  {
    // 图签底座 — 静止基准锚：不漂移、hover 只增亮不位移
    code: 'M.01',
    x: 0,
    y: 380,
    w: 360,
    h: 60,
    asm: [0, 18, 0],
    asmDelay: '0.9s',
    drawDelay: '0s',
    solidifyDelay: '0.95s',
  },
  {
    // 输出左 — 通风格栅
    code: 'M.02',
    x: 0,
    y: 288,
    w: 120,
    h: 84,
    asm: [-26, 0, 0],
    asmDelay: '1s',
    drift: [-10, 0, 0],
    driftDur: '14s',
    driftDelay: '6.4s',
    hover: [-6, 0, 0],
    drawDelay: '0.1s',
    solidifyDelay: '1.05s',
  },
  {
    // 输出右 — 双焊盘分线 + 端口阵列
    code: 'M.03',
    x: 128,
    y: 288,
    w: 232,
    h: 84,
    asm: [0, 0, 33],
    asmDelay: '1.1s',
    drift: [0, 0, 15],
    driftDur: '16s',
    driftDelay: '3.2s',
    hover: [0, 0, 10],
    drawDelay: '0.18s',
    solidifyDelay: '1.12s',
  },
  {
    // SYNTH CORE — 前脸内凹，漂移时向前「呈递」
    code: 'M.04',
    x: 0,
    y: 162,
    w: 360,
    h: 118,
    core: { x: 123, y: 59, r: 90 },
    asm: [0, 0, 38],
    asmDelay: '1.2s',
    drift: [0, 0, 18],
    driftDur: '11s',
    driftDelay: '8s',
    hover: [0, 0, 11],
    drawDelay: '0.3s',
    solidifyDelay: '1.22s',
  },
  {
    // 输入 — 文档队列蚀刻 + 下行走线
    code: 'M.05',
    x: 0,
    y: 70,
    w: 360,
    h: 84,
    asm: [31, 0, 0],
    asmDelay: '1.3s',
    drift: [13, 0, 0],
    driftDur: '15s',
    driftDelay: '5s',
    hover: [8, 0, 0],
    drawDelay: '0.42s',
    solidifyDelay: '1.32s',
  },
  {
    // 顶盖左 — 刻度尺 + 十字基准顶面
    // 漂移/hover 只能向 −X：+X 超过 8px 缝就会与 M.07 前脸共面互穿（z-fighting）
    code: 'M.06',
    x: 0,
    y: 0,
    w: 232,
    h: 62,
    asm: [-26, 0, 0],
    asmDelay: '1.4s',
    drift: [-10, 0, 0],
    driftDur: '13s',
    driftDelay: '12.4s',
    hover: [-6, 0, 0],
    drawDelay: '0.52s',
    solidifyDelay: '1.42s',
    hasTop: true,
  },
  {
    // 顶盖右 — 端口阵列模块
    code: 'M.07',
    x: 240,
    y: 0,
    w: 120,
    h: 62,
    asm: [0, 0, 38],
    asmDelay: '1.45s',
    drift: [0, 0, 18],
    driftDur: '10s',
    driftDelay: '2.8s',
    hover: [0, 0, 11],
    drawDelay: '0.6s',
    solidifyDelay: '1.48s',
    hasTop: true,
  },
] as const;

// 缝隙发光条 — z=66 埋于前面板（z=75）后方；水平缝自下而上 stagger 脉冲 =
// 数据自底向上流经组合体；竖缝跟随所在行相位
// （z 太深会被视角吃掉：8px 缝 + 16° 俯角下 z66 恰好漏出可感知的光带）
// 尺寸超出缝口：溢出部分被 z75 前脸挡住，模块漂移让开时自动补位——
// 横条 h18 覆盖漂移峰值投影缝隙；竖条向漂移方向加宽同理
// ⚠️ 发光条平面不得与任何面相交（WebKit 无平面切分、按质心排序，
// 相交时缝口 sliver 会整条消失）——内侧右面已因此不渲染，见 ModuleShell；
// 竖条 top ≥2 也是这条纪律：顶行顶面位于 y=0 平面，条带避开即不相交
const SEAMS: readonly SeamDef[] = [
  { left: 2, top: 367, width: 356, height: 18, delay: '3.3s' },
  { left: 2, top: 275, width: 356, height: 18, delay: '3.85s' },
  { left: 2, top: 149, width: 356, height: 18, delay: '4.4s' },
  { left: 2, top: 57, width: 356, height: 18, delay: '4.95s' },
  { left: 109, top: 288, width: 20, height: 84, vertical: true, delay: '4.1s' },
  { left: 221, top: 2, width: 20, height: 58, vertical: true, delay: '5.2s' },
];

// ═══ 移动变体 · 横陈低台（v3 ELEV. 立面图纸，几何不动） ═══
// 同一物件的另一张视图：轴测角度/材质/缝光语言不变，砌合成 300×168 横构图
// 竖缝错缝延续 bond pattern：R2 在 x186–192，R3 在 x108–114
const MOBILE_MODULES: readonly ModuleDef[] = [
  {
    // 图签底座 — 静止锚（SYNTHMIND / S.01 / ELEV.）
    code: 'M.01',
    x: 0,
    y: 120,
    w: 300,
    h: 48,
    asm: [0, 14, 0],
    asmDelay: '0.7s',
    drawDelay: '0s',
    solidifyDelay: '0.75s',
  },
  {
    // 核心 — 紧凑 SYNTH CORE 环，向前「呈递」
    code: 'M.02',
    x: 0,
    y: 58,
    w: 186,
    h: 56,
    core: { x: 44, y: 28, r: 50 },
    asm: [0, 0, 24],
    asmDelay: '0.8s',
    drift: [0, 0, 10],
    driftDur: '12s',
    driftDelay: '4.6s',
    hover: [0, 0, 7],
    drawDelay: '0.1s',
    solidifyDelay: '0.85s',
  },
  {
    // 端口 — 承接核心出线（v3 起 2×2 阵列 + 汇流母线）
    code: 'M.03',
    x: 192,
    y: 58,
    w: 108,
    h: 56,
    asm: [0, 0, 26],
    asmDelay: '0.9s',
    drift: [0, 0, 12],
    driftDur: '10s',
    driftDelay: '2.6s',
    hover: [0, 0, 8],
    drawDelay: '0.18s',
    solidifyDelay: '0.92s',
  },
  {
    // 顶盖左 — 裁切角；漂移 −X（与 M.05 反向拉开 R3 竖缝）
    code: 'M.04',
    x: 0,
    y: 0,
    w: 108,
    h: 52,
    asm: [-18, 0, 0],
    asmDelay: '1s',
    drift: [-8, 0, 0],
    driftDur: '13s',
    driftDelay: '7.6s',
    hover: [-5, 0, 0],
    drawDelay: '0.28s',
    solidifyDelay: '1.02s',
    hasTop: true,
  },
  {
    // 顶盖右 — 十字基准顶面；右缘模块 +X 向外漂移（外侧无共面对象，安全轴）
    code: 'M.05',
    x: 114,
    y: 0,
    w: 186,
    h: 52,
    asm: [20, 0, 0],
    asmDelay: '1.1s',
    drift: [8, 0, 0],
    driftDur: '15s',
    driftDelay: '9.8s',
    hover: [5, 0, 0],
    drawDelay: '0.36s',
    solidifyDelay: '1.12s',
    hasTop: true,
  },
] as const;

// 移动缝光 — R3 竖缝两侧模块反向拉开，条宽 24 覆盖单侧漂移峰值（错峰驱动，
// 双侧同时到峰概率极低，残留由 blur 兜底）；竖条与横条不再同 z 重叠（top/height 避让）
const MOBILE_SEAMS: readonly SeamDef[] = [
  { left: 2, top: 110, width: 296, height: 14, delay: '3.3s' },
  { left: 2, top: 48, width: 296, height: 14, delay: '3.9s' },
  { left: 182, top: 62, width: 16, height: 44, vertical: true, delay: '4.2s' },
  { left: 99, top: 2, width: 24, height: 42, vertical: true, delay: '4.6s' },
];

// hairline 逐笔绘制 path 公共封装（pathLength 归一化 + 分段延迟）
function Draw({
  d,
  stroke,
  delay,
  width = 1,
}: {
  d: string;
  stroke: string;
  delay: string;
  width?: number;
}) {
  return (
    <path
      d={d}
      stroke={stroke}
      strokeWidth={width}
      pathLength={1}
      className="bp-draw"
      style={{ '--draw-delay': delay } as CSSProperties}
    />
  );
}

// 装饰性虚线刻度圈 — bp-fade 淡入（dasharray 占用即不能走 bp-draw 的归一化）
function DashRing({
  d,
  dash,
  delay,
}: {
  d: string;
  dash: string;
  delay: string;
}) {
  return (
    <path
      d={d}
      stroke={STROKE.inner}
      strokeWidth={1}
      strokeDasharray={dash}
      className="bp-fade"
      style={{ '--draw-delay': delay } as CSSProperties}
    />
  );
}

// mono 标注文字 — fill 走 class（个别 WebView 不在 presentation attribute 里
// 做 var() 替换，会回退成黑色）；v3 提档：tertiary 基调，主标注可升 accent
function MonoLabel({
  x,
  y,
  delay,
  size = 11,
  tone = 'tertiary',
  children,
}: {
  x: number;
  y: number;
  delay: string;
  size?: number;
  tone?: 'tertiary' | 'accent';
  children: ReactNode;
}) {
  return (
    <text
      x={x}
      y={y}
      fontSize={size}
      letterSpacing="0.08em"
      className={`font-mono bp-fade ${
        tone === 'accent' ? 'fill-accent' : 'fill-txt-tertiary'
      }`}
      style={{ '--draw-delay': delay } as CSSProperties}
    >
      {children}
    </text>
  );
}

// 焊盘节点圆点 — Ship 阶段最后亮起（非 draw 元素，circle 可用）
function NodeDot({
  cx,
  cy,
  delay = T.dots,
}: {
  cx: number;
  cy: number;
  delay?: string;
}) {
  return (
    <circle
      cx={cx}
      cy={cy}
      r="2"
      className="bp-fade fill-accent"
      style={{ '--draw-delay': delay } as CSSProperties}
    />
  );
}

// ── 桌面前面板蚀刻（各面局部坐标系）——跨模块走线在缝口对齐：
// M.05 出线 x193 ↓穿缝→ M.04 入线 x193；M.04 出线 x256 ↓穿缝→ M.03 主干（局部 x128）
const FRONT_ETCH: Record<string, ReactNode> = {
  'M.01': (
    <>
      {/* 图签栏分隔 + SYNTHMIND / S.01 / 1:1 */}
      {['M216 0.5 V59.5', 'M288 0.5 V59.5'].map((d) => (
        <Draw key={d} d={d} stroke={STROKE.detail} delay={T.detailB} />
      ))}
      {/* 图形比例尺 — 呼应 1:1 栏（大小刻度交替，制图习惯） */}
      <Draw d="M100 33 H188" stroke={STROKE.inner} delay={T.detailB} />
      {['M100 27 V33', 'M122 30 V33', 'M144 27 V33', 'M166 30 V33', 'M188 27 V33'].map(
        (d) => (
          <Draw key={d} d={d} stroke={STROKE.inner} delay={T.detailB} />
        ),
      )}
      <MonoLabel x={14} y={36} delay={T.labels}>
        SYNTHMIND
      </MonoLabel>
      <MonoLabel x={228} y={36} delay={T.labels}>
        S.01
      </MonoLabel>
      <MonoLabel x={304} y={36} delay={T.labels}>
        1:1
      </MonoLabel>
    </>
  ),
  'M.02': (
    <>
      {/* 通风格栅 hairline（6 条，末条短）+ 对角固定孔 */}
      {[
        'M18 16 H102',
        'M18 26 H102',
        'M18 36 H102',
        'M18 46 H102',
        'M18 56 H102',
        'M18 66 H84',
      ].map((d) => (
        <Draw key={d} d={d} stroke={STROKE.inner} delay={T.detailB} />
      ))}
      {[circlePath(10, 10, 2.5), circlePath(110, 74, 2.5)].map((d) => (
        <Draw key={d} d={d} stroke={STROKE.detail} delay={T.detailB} />
      ))}
    </>
  ),
  'M.03': (
    <>
      {/* 分线：承接 M.04 出线（全局 x256 = 本模块局部 x128）→ 双焊盘 */}
      {['M128 0.5 V20', 'M128 20 H62 V38', 'M128 20 H194 V38'].map((d) => (
        <Draw key={d} d={d} stroke={STROKE.detail} delay={T.detail} />
      ))}
      {['M44 38 H80 V66 H44 Z', 'M176 38 H212 V66 H176 Z'].map((d) => (
        <Draw key={d} d={d} stroke={STROKE.detail} delay={T.detail} />
      ))}
      {/* 焊盘之间 2×3 端口阵列 */}
      {[
        'M108 44 H116 V52 H108 Z',
        'M124 44 H132 V52 H124 Z',
        'M140 44 H148 V52 H140 Z',
        'M108 56 H116 V64 H108 Z',
        'M124 56 H132 V64 H124 Z',
        'M140 56 H148 V64 H140 Z',
      ].map((d) => (
        <Draw key={d} d={d} stroke={STROKE.inner} delay={T.detailB} />
      ))}
      <NodeDot cx={128} cy={20} />
      <NodeDot cx={62} cy={52} />
      <NodeDot cx={194} cy={52} />
    </>
  ),
  'M.04': (
    <>
      {/* 核心微光呼吸 — 同路径宽描边叠加（corePulse，RM 下静态 0.4） */}
      <path
        d={CORE_RING}
        stroke={STROKE.corePulse}
        strokeWidth="7"
        className="bp-core-pulse"
      />
      <Draw d={CORE_RING} stroke={STROKE.core} delay={T.detail} width={1.25} />
      {/* r37 虚线刻度圈（24 段）+ 环内十字准星 */}
      <DashRing
        d="M86 59 A37 37 0 1 1 160 59 A37 37 0 1 1 86 59 Z"
        dash="2 7.69"
        delay={T.aux}
      />
      {['M123 51 V67', 'M115 59 H131'].map((d) => (
        <Draw key={d} d={d} stroke={STROKE.detail} delay={T.detail} />
      ))}
      {/* 罗盘主刻度（与环缘齐平，穿虚线圈 = 仪表盘惯例） */}
      {['M123 18 V28', 'M123 90 V100', 'M80 59 H92', 'M154 59 H166'].map((d) => (
        <Draw key={d} d={d} stroke={STROKE.core} delay={T.detail} />
      ))}
      {/* 取景器四角括弧 — 框定核心的校准靶 */}
      {[
        'M82 28 V18 H92',
        'M154 18 H164 V28',
        'M82 90 V100 H92',
        'M154 100 H164 V90',
      ].map((d) => (
        <Draw key={d} d={d} stroke={STROKE.detail} delay={T.detailB} />
      ))}
      {/* 入线（承接 M.05 出线 x193）与出线（→ M.03，x256 穿底缝） */}
      <Draw d="M193 0.5 V59 H166" stroke={STROKE.detail} delay={T.detail} />
      <Draw d="M123 100 V108 H256 V117.5" stroke={STROKE.detail} delay={T.detail} />
      {/* 右侧服务分缝 + 状态 pips（首格点亮） */}
      <Draw d="M292 10 V108" stroke={STROKE.inner} delay={T.detailB} />
      {[
        'M304 92 H310 V98 H304 Z',
        'M318 92 H324 V98 H318 Z',
        'M332 92 H338 V98 H332 Z',
      ].map((d) => (
        <Draw key={d} d={d} stroke={STROKE.inner} delay={T.detailB} />
      ))}
      <MonoLabel x={186} y={96} delay={T.labels} tone="accent">
        SYNTH CORE
      </MonoLabel>
      <NodeDot cx={166} cy={59} />
      <NodeDot cx={256} cy={108} />
      <NodeDot cx={307} cy={95} />
    </>
  ),
  'M.05': (
    <>
      {/* 输入主文档：标题行 + 内容行 */}
      <Draw d="M30 14 H102 V70 H30 Z" stroke={STROKE.detail} delay={T.detail} />
      {['M42 26 H74', 'M42 36 H90', 'M42 46 H90', 'M42 56 H82'].map((d) => (
        <Draw key={d} d={d} stroke={STROKE.inner} delay={T.detail} />
      ))}
      {/* 队列第二文档（出线从其下方穿过，y 避让） */}
      <Draw d="M114 16 H168 V36 H114 Z" stroke={STROKE.detail} delay={T.detail} />
      {['M126 24 H156', 'M126 30 H148'].map((d) => (
        <Draw key={d} d={d} stroke={STROKE.inner} delay={T.detail} />
      ))}
      {/* 出线 → 穿底缝入 M.04（x193 全局对齐） */}
      <Draw d="M102 42 H193 V83.5" stroke={STROKE.detail} delay={T.detail} />
      {/* 右区内向箭标 — 数据流入暗示 */}
      {['M320 32 L306 42 L320 52', 'M338 32 L324 42 L338 52'].map((d) => (
        <Draw key={d} d={d} stroke={STROKE.detail} delay={T.detailB} />
      ))}
      <NodeDot cx={102} cy={42} />
    </>
  ),
  'M.06': (
    <>
      {/* 角部裁切标记 + 刻度尺（大小刻度交替） */}
      {['M12 20 V10 H22', 'M210 10 H220 V20'].map((d) => (
        <Draw key={d} d={d} stroke={STROKE.detail} delay={T.detailB} />
      ))}
      <Draw d="M40 46 H192" stroke={STROKE.inner} delay={T.detailB} />
      {[
        'M40 38 V46',
        'M78 38 V46',
        'M116 38 V46',
        'M154 38 V46',
        'M192 38 V46',
        'M59 42 V46',
        'M97 42 V46',
        'M135 42 V46',
        'M173 42 V46',
      ].map((d) => (
        <Draw key={d} d={d} stroke={STROKE.inner} delay={T.detailB} />
      ))}
    </>
  ),
  'M.07': (
    <>
      {/* 2×2 端口阵列（左上格点亮） */}
      {[
        'M42 12 H56 V26 H42 Z',
        'M64 12 H78 V26 H64 Z',
        'M42 34 H56 V48 H42 Z',
        'M64 34 H78 V48 H64 Z',
      ].map((d) => (
        <Draw key={d} d={d} stroke={STROKE.detail} delay={T.detailB} />
      ))}
      <NodeDot cx={49} cy={19} />
    </>
  ),
};

// ── 移动前面板蚀刻 — 走线一笔：核心环 → 出线穿 R2 竖缝 → 端口母线 ──
const MOBILE_FRONT_ETCH: Record<string, ReactNode> = {
  'M.01': (
    <>
      {['M188 0.5 V47.5', 'M240 0.5 V47.5'].map((d) => (
        <Draw key={d} d={d} stroke={STROKE.detail} delay={MT.detailB} />
      ))}
      <MonoLabel x={12} y={30} size={10} delay={MT.labels}>
        SYNTHMIND
      </MonoLabel>
      <MonoLabel x={198} y={30} size={10} delay={MT.labels}>
        S.01
      </MonoLabel>
      <MonoLabel x={248} y={30} size={10} delay={MT.labels}>
        ELEV.
      </MonoLabel>
    </>
  ),
  'M.02': (
    <>
      <path
        d={CORE_RING_M}
        stroke={STROKE.corePulse}
        strokeWidth="5"
        className="bp-core-pulse"
      />
      <Draw
        d={CORE_RING_M}
        stroke={STROKE.core}
        delay={MT.detail}
        width={1.25}
      />
      {/* r20 虚线刻度圈（12 段）+ 环内十字准星（紧凑版） */}
      <DashRing
        d="M24 28 A20 20 0 1 1 64 28 A20 20 0 1 1 24 28 Z"
        dash="2 8.47"
        delay={MT.aux}
      />
      {['M44 23 V33', 'M38 28 H50'].map((d) => (
        <Draw key={d} d={d} stroke={STROKE.detail} delay={MT.detail} />
      ))}
      {/* 罗盘主刻度（与环缘齐平） */}
      {['M44 6 V12', 'M44 44 V50', 'M22 28 H28', 'M60 28 H66'].map((d) => (
        <Draw key={d} d={d} stroke={STROKE.core} delay={MT.detail} />
      ))}
      {/* 出线 → 穿 R2 竖缝入 M.03 */}
      <Draw d="M66 28 H185.5" stroke={STROKE.detail} delay={MT.detail} />
      <MonoLabel x={84} y={18} size={10} delay={MT.labels} tone="accent">
        SYNTH CORE
      </MonoLabel>
      <NodeDot cx={66} cy={28} delay={MT.dots} />
    </>
  ),
  'M.03': (
    <>
      {/* 入线（承接 M.02 出线）→ 汇流母线 → 2×2 端口阵列 */}
      <Draw d="M0.5 28 H24" stroke={STROKE.detail} delay={MT.detail} />
      <Draw d="M24 16 V40" stroke={STROKE.detail} delay={MT.detail} />
      {['M24 16 H28', 'M24 40 H28'].map((d) => (
        <Draw key={d} d={d} stroke={STROKE.detail} delay={MT.detail} />
      ))}
      {[
        'M28 10 H40 V22 H28 Z',
        'M52 10 H64 V22 H52 Z',
        'M28 34 H40 V46 H28 Z',
        'M52 34 H64 V46 H52 Z',
      ].map((d) => (
        <Draw key={d} d={d} stroke={STROKE.detail} delay={MT.detail} />
      ))}
      <NodeDot cx={24} cy={28} delay={MT.dots} />
    </>
  ),
  'M.04': (
    <>
      {['M10 16 V8 H18', 'M90 8 H98 V16'].map((d) => (
        <Draw key={d} d={d} stroke={STROKE.detail} delay={MT.detailB} />
      ))}
    </>
  ),
  'M.05': (
    <>
      {/* 通风格栅 hairline（5 条，末条短） */}
      {[
        'M120 14 H166',
        'M120 23 H166',
        'M120 32 H166',
        'M120 41 H166',
        'M120 50 H152',
      ].map((d) => (
        <Draw key={d} d={d} stroke={STROKE.inner} delay={MT.detailB} />
      ))}
    </>
  ),
};

// ── 顶面蚀刻（仅顶行模块；viewBox = w×depth） ──
const TOP_ETCH: Record<string, ReactNode> = {
  'M.06': (
    <>
      {/* 十字基准 + 基准环 + 四角安装孔 */}
      {['M84 75 H116', 'M100 59 V91'].map((d) => (
        <Draw key={d} d={d} stroke={STROKE.detail} delay={T.aux} />
      ))}
      <Draw
        d="M90 75 A10 10 0 1 1 110 75 A10 10 0 1 1 90 75 Z"
        stroke={STROKE.detail}
        delay={T.aux}
      />
      {[
        circlePath(18, 18, 3),
        circlePath(214, 18, 3),
        circlePath(18, 132, 3),
        circlePath(214, 132, 3),
      ].map((d) => (
        <Draw key={d} d={d} stroke={STROKE.inner} delay={T.aux} />
      ))}
      {/* 前棱刻度（SVG 下缘 = 与正面共享的前棱） */}
      {['M58 140 V149.5', 'M116 140 V149.5', 'M174 140 V149.5'].map((d) => (
        <Draw key={d} d={d} stroke={STROKE.inner} delay={T.aux} />
      ))}
    </>
  ),
  'M.07': (
    <>
      {[circlePath(20, 18, 3), circlePath(100, 18, 3)].map((d) => (
        <Draw key={d} d={d} stroke={STROKE.inner} delay={T.aux} />
      ))}
      {['M40 140 V149.5', 'M80 140 V149.5'].map((d) => (
        <Draw key={d} d={d} stroke={STROKE.inner} delay={T.aux} />
      ))}
    </>
  ),
};

const MOBILE_TOP_ETCH: Record<string, ReactNode> = {
  'M.04': (
    <>
      {/* 十字基准 + 基准环（紧凑版） */}
      {['M40 60 H68', 'M54 46 V74'].map((d) => (
        <Draw key={d} d={d} stroke={STROKE.detail} delay={MT.aux} />
      ))}
      <Draw
        d="M46 60 A8 8 0 1 1 62 60 A8 8 0 1 1 46 60 Z"
        stroke={STROKE.detail}
        delay={MT.aux}
      />
      {['M36 112 V119.5', 'M72 112 V119.5'].map((d) => (
        <Draw key={d} d={d} stroke={STROKE.inner} delay={MT.aux} />
      ))}
    </>
  ),
  'M.05': (
    <>
      {['M62 112 V119.5', 'M124 112 V119.5'].map((d) => (
        <Draw key={d} d={d} stroke={STROKE.inner} delay={MT.aux} />
      ))}
    </>
  ),
};

// ── 右侧面蚀刻：模块码（真实装配序列，结构性编号）+ 高模块的面板缝 ──
const RIGHT_SEAMS: Record<string, string[]> = {
  'M.04': ['M52 33 H135', 'M52 85 H135'],
  'M.05': ['M52 42 H135'],
};
const MOBILE_RIGHT_SEAMS: Record<string, string[]> = {};

// ═══ 变体配置 — 几何/蚀刻/节奏一表切换，ModuleShell 全复用 ═══
interface VariantConfig {
  width: number; // hasRight（右缘判定）依赖它：写死字面量的话，
  // 将来改宽组合体右面会静默全部消失（不报错不掉 lint）
  height: number; // 桌面 datum 的「H 440」标注取自它
  depth: number; // v3 起 per-variant（桌面 150 / 移动 120）
  coreFrontZ: number; // core 前脸内凹终位（桌面 65 = 10px 凹；移动 52 = 8px 凹）
  seamZ: number; // 缝光条 z（埋于前面板后方 ~9px）
  labelSize: number; // 右侧面模块码字号（桌面 11 / 移动 10）
  modules: readonly ModuleDef[];
  seams: readonly SeamDef[];
  frontEtch: Record<string, ReactNode>;
  topEtch: Record<string, ReactNode>;
  rightSeams: Record<string, string[]>;
  auxDelay: string; // 右侧面面板缝刻线绘制
  labelDelay: string; // 右侧面模块码淡入
  hasDatum: boolean; // 浮动尺寸基准面（移动横构图省略——小屏预算）
  rootClass: string; // 根容器占位（宽高含顶面投影与投影光区）
  floatClass: string; // 呼吸层定位（top = 顶面投影预留）
}

const VARIANTS: Record<'desktop' | 'mobile', VariantConfig> = {
  desktop: {
    width: 360,
    height: 440,
    depth: 150,
    coreFrontZ: 65,
    seamZ: 66,
    labelSize: 11,
    modules: MODULES,
    seams: SEAMS,
    frontEtch: FRONT_ETCH,
    topEtch: TOP_ETCH,
    rightSeams: RIGHT_SEAMS,
    auxDelay: T.aux,
    labelDelay: T.labels,
    hasDatum: true,
    rootClass: 'h-[540px] w-[360px]',
    floatClass: 'top-[56px] h-[440px]',
  },
  mobile: {
    width: 300,
    height: 168,
    depth: 120,
    coreFrontZ: 52,
    seamZ: 54,
    labelSize: 10,
    modules: MOBILE_MODULES,
    seams: MOBILE_SEAMS,
    frontEtch: MOBILE_FRONT_ETCH,
    topEtch: MOBILE_TOP_ETCH,
    rightSeams: MOBILE_RIGHT_SEAMS,
    auxDelay: MT.aux,
    labelDelay: MT.labels,
    hasDatum: false,
    rootClass: 'h-[240px] w-[300px]',
    floatClass: 'top-[40px] h-[168px]',
  },
};

// 面外框 path（0.5 对齐 hairline 像素栅格）
const edge = (w: number, h: number) =>
  `M0.5 0.5 H${w - 0.5} V${h - 0.5} H0.5 Z`;

// 模块壳 — 三层 transform 解耦：装配入场 / 无限漂移 / hover 偏移
// 永不共存于同一元素（同属性动画冲突的分层解法）；三面几何由前面板矩形推导
function ModuleShell({
  def,
  variant,
  front,
  top,
}: {
  def: ModuleDef;
  variant: VariantConfig;
  front?: ReactNode;
  top?: ReactNode;
}) {
  const { x, y, w, h } = def;
  const depth = variant.depth;
  const frontZ = def.core ? variant.coreFrontZ : depth / 2;
  // 内侧右面（模块右棱不在组合体右缘）只能从 8px 缝口看到一条 sliver，
  // 却与缝隙发光条平面真实相交——WebKit 按质心排序会让缝光整条消失，
  // 与「顶面仅顶行渲染」同一条纪律：不渲染（缝内观感由发光条独占）
  const hasRight = x + w === variant.width;
  const asmStyle = {
    '--ax': `${def.asm[0]}px`,
    '--ay': `${def.asm[1]}px`,
    '--az': `${def.asm[2]}px`,
    '--asm-delay': def.asmDelay,
  } as CSSProperties;
  const driftStyle = def.drift
    ? ({
        '--dx': `${def.drift[0]}px`,
        '--dy': `${def.drift[1]}px`,
        '--dz': `${def.drift[2]}px`,
        '--drift-dur': def.driftDur,
        '--drift-delay': def.driftDelay,
      } as CSSProperties)
    : undefined;
  const hoverStyle = def.hover
    ? ({
        '--hx': `${def.hover[0]}px`,
        '--hy': `${def.hover[1]}px`,
        '--hz': `${def.hover[2]}px`,
      } as CSSProperties)
    : undefined;
  // core 环心发光底的 radial 参数随变体走 CSS 变量（桌面 123,59,90 / 移动 44,28,50）
  const fillStyle = {
    '--solidify-delay': def.solidifyDelay,
    ...(def.core
      ? {
          '--core-x': `${def.core.x}px`,
          '--core-y': `${def.core.y}px`,
          '--core-r': `${def.core.r}px`,
        }
      : undefined),
  } as CSSProperties;
  const drawStyle = { '--draw-delay': def.drawDelay } as CSSProperties;

  return (
    <div className="bp-module" style={{ left: x, top: y, width: w, height: h }}>
      <div className="bp-mod-layer bp-mod-asm" style={asmStyle}>
        <div
          className={`bp-mod-layer${def.drift ? ' bp-mod-drift' : ''}`}
          style={driftStyle}
        >
          <div className="bp-mod-layer bp-mod-hover" style={hoverStyle}>
            {/* ── 前面板 ── */}
            <div
              className="bp-face"
              style={{ inset: 0, transform: `translateZ(${frontZ}px)` }}
            >
              <div
                className={`bp-face-fill ${
                  def.core ? 'bp-face-fill--core' : 'bp-face-fill--front'
                }`}
                style={fillStyle}
              />
              <svg
                viewBox={`0 0 ${w} ${h}`}
                fill="none"
                className="absolute inset-0 h-full w-full"
              >
                <path
                  d={edge(w, h)}
                  stroke={STROKE.edgeFront}
                  strokeWidth="1"
                  pathLength={1}
                  className="bp-draw"
                  style={drawStyle}
                />
                <path
                  d={edge(w, h)}
                  stroke={STROKE.boost}
                  strokeWidth="1"
                  className="bp-edge-boost"
                />
                {front}
              </svg>
            </div>
            {/* ── 右侧面（仅右缘模块；w<depth 时 left 为负值 — 居中后旋转归位，几何正确） ── */}
            {hasRight ? (
              <div
                className="bp-face"
                style={{
                  left: (w - depth) / 2,
                  top: 0,
                  width: depth,
                  height: h,
                  transform: `rotateY(90deg) translateZ(${w / 2}px)`,
                }}
              >
                <div
                  className="bp-face-fill bp-face-fill--right"
                  style={fillStyle}
                />
                <svg
                  viewBox={`0 0 ${depth} ${h}`}
                  fill="none"
                  className="absolute inset-0 h-full w-full"
                >
                  <path
                    d={edge(depth, h)}
                    stroke={STROKE.edgeRight}
                    strokeWidth="1"
                    pathLength={1}
                    className="bp-draw"
                    style={drawStyle}
                  />
                  <path
                    d={edge(depth, h)}
                    stroke={STROKE.boost}
                    strokeWidth="1"
                    className="bp-edge-boost"
                  />
                  {/* 蚀刻在 hasRight 分支内取值 — 内墙模块不白建 JSX 树 */}
                  {(variant.rightSeams[def.code] ?? []).map((d) => (
                    <Draw
                      key={d}
                      d={d}
                      stroke={STROKE.inner}
                      delay={variant.auxDelay}
                    />
                  ))}
                  {/* SVG x 小端 = 前棱侧，模块码贴前棱 */}
                  <MonoLabel
                    x={16}
                    y={def.h / 2 + 4}
                    size={variant.labelSize}
                    delay={variant.labelDelay}
                  >
                    {def.code}
                  </MonoLabel>
                </svg>
              </div>
            ) : null}
            {/* ── 顶面（仅顶行） ── */}
            {def.hasTop ? (
              <div
                className="bp-face"
                style={{
                  left: 0,
                  top: (h - depth) / 2,
                  width: w,
                  height: depth,
                  transform: `rotateX(90deg) translateZ(${h / 2}px)`,
                }}
              >
                <div
                  className="bp-face-fill bp-face-fill--top"
                  style={fillStyle}
                />
                <svg
                  viewBox={`0 0 ${w} ${depth}`}
                  fill="none"
                  className="absolute inset-0 h-full w-full"
                >
                  <path
                    d={edge(w, depth)}
                    stroke={STROKE.edgeTop}
                    strokeWidth="1"
                    pathLength={1}
                    className="bp-draw"
                    style={drawStyle}
                  />
                  <path
                    d={edge(w, depth)}
                    stroke={STROKE.boost}
                    strokeWidth="1"
                    className="bp-edge-boost"
                  />
                  {top}
                </svg>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BlueprintObject({
  variant = 'desktop',
}: {
  variant?: 'desktop' | 'mobile';
}) {
  const v = VARIANTS[variant];
  return (
    <div
      className={`bp-object-root relative mx-auto select-none ${v.rootClass}`}
      aria-hidden="true"
    >
      {/* 背光/投影由场景层渲染在物件外（光源不随指针/摇曳旋转） */}
      {/* 透视链：root → float → sway → 本体 → 模块三层 全程 preserve-3d */}
      <div className={`obj-float absolute inset-x-0 ${v.floatClass}`}>
        <div className="obj-sway h-full w-full">
          <div className="bp-object h-full w-full">
            {v.modules.map((def) => (
              <ModuleShell
                key={def.code}
                def={def}
                variant={v}
                front={v.frontEtch[def.code]}
                top={v.topEtch[def.code]}
              />
            ))}
            {/* 缝隙发光条 — 模块滑出时露出更多内光（几何自动，无联动逻辑） */}
            {v.seams.map((s) => (
              <div
                key={`${s.left}-${s.top}`}
                className={`bp-seam-glow ${
                  s.vertical ? 'bp-seam-glow--v' : 'bp-seam-glow--h'
                }`}
                style={
                  {
                    left: s.left,
                    top: s.top,
                    width: s.width,
                    height: s.height,
                    transform: `translateZ(${v.seamZ}px)`,
                    '--seam-delay': s.delay,
                  } as CSSProperties
                }
              />
            ))}
            {/* 浮动尺寸基准面 — 链外静止的全高标注：基准不动，模块在动
                面宽 100（svg overflow:hidden，窄面会截断标注文字）；
                中心 x=115+50=165，translateZ 235 → 世界 x=400：
                大于 M.05 的一切位移峰值右面平面（drift+hover 381 / asm 391），
                永不共面 z-fight，且尺寸线不压件（制图习惯）；移动变体省略 */}
            {v.hasDatum ? (
              <div
                className="bp-datum"
                style={{
                  left: 115,
                  top: 0,
                  width: 100,
                  height: v.height,
                  transform: 'rotateY(90deg) translateZ(235px)',
                }}
              >
                <svg
                  viewBox={`0 0 100 ${v.height}`}
                  fill="none"
                  className="absolute inset-0 h-full w-full"
                >
                  {/* detail 档描边 — inner 档会被侧面前缩透视吃到不可见 */}
                  {[
                    `M50 6 V${v.height - 6}`,
                    'M43 6 H57',
                    `M43 ${v.height - 6} H57`,
                  ].map((d) => (
                    <Draw
                      key={d}
                      d={d}
                      stroke={STROKE.detail}
                      delay={T.datum}
                    />
                  ))}
                  {/* y 随 v.height 推导 — 改高时标注不脱离尺寸线中点 */}
                  <MonoLabel x={58} y={v.height / 2 + 4} delay={T.labels}>
                    {`H ${v.height}`}
                  </MonoLabel>
                </svg>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
