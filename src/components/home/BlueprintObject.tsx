// ─── Hero Blueprint Object v2 · Bonded Assembly 砌合组合体 ───
// 设计定案：docs/superpowers/specs/2026-07-26-blueprint-object-v2-modular-design.md
// v1 单体轴测核心体 → v2 七个独立模块（M.01–M.07，砌砖错缝布局，280×344×120）：
// 各模块沿签名轴做慢周期错位-停驻-归位循环（modDrift 错峰，永不停止），
// 缝隙后方埋发光条（对齐漏微光，错开露内光），hover 单模块独立偏移+增亮
// 入场叙事 Draft→Build→Ship：棱线在装配偏移位逐笔绘制 → 模块滑入合体 → 蚀刻/缝光亮起
// 全高尺寸标注升维为链外浮动基准面：基准不动，模块在动（制图尺寸线本就浮在体外）
// 所有 .bp-draw 元素必须是 <path>：pathLength 在 rect/circle 上 WebKit 不支持，
// 会把 dasharray 归一化破坏成 1px 点线（圆/矩形一律 A / H V Z 路径命令改写）
// 透视链纪律：模块三层 wrapper（asm/drift/hover）全部 preserve-3d，缺一层 WebKit 压扁
// Server Component — 装饰性图形 aria-hidden；指针物理在 HeroObjectPhysics（零改动复用）

import type { CSSProperties, ReactNode } from 'react';

// 组合体进深 — 所有模块统一 120（core 前脸内凹至 z=52 制造 8px 凹槽）
const DEPTH = 120;
// 组合体总宽 — hasRight（右缘判定）依赖它：写死字面量的话，
// 将来改宽组合体右面会静默全部消失（不报错不掉 lint）
const WIDTH = 280;
// 组合体总高 — datum 基准面的标注文本「H 344」取自它：
// 写死的话改模块表总高后会印出错误尺寸数字（内容错误，比面消失更难发现）
const HEIGHT = 344;

// 描边色阶 — 同一蓝色相不同 alpha（逐面明度贴合固定光源：左上前方）
const STROKE = {
  edgeFront: 'rgba(74, 159, 229, 0.5)',
  edgeTop: 'rgba(74, 159, 229, 0.45)',
  edgeRight: 'rgba(74, 159, 229, 0.38)',
  detail: 'rgba(74, 159, 229, 0.3)',
  inner: 'rgba(74, 159, 229, 0.22)',
  core: 'rgba(74, 159, 229, 0.55)',
  corePulse: 'rgba(74, 159, 229, 0.35)',
  boost: 'rgba(74, 159, 229, 0.95)',
} as const;

// mono 标注文字公共属性 — fill 走 class（个别 WebView 不在
// presentation attribute 里做 var() 替换，会回退成黑色）
const LABEL_PROPS = {
  fontSize: 8,
  letterSpacing: '0.08em',
  className: 'font-mono bp-fade fill-txt-quaternary',
} as const;

// 蚀刻细节入场延迟（秒）— Ship 阶段：走线/图形 → 辅助刻线 → 图签文字 → 焊盘圆点
const T = {
  detail: '1.6s',
  detailB: '1.75s',
  aux: '1.9s',
  datum: '1.95s',
  labels: '2.15s',
  dots: '2.45s',
} as const;

// 核心圆环 — 两段圆弧拼整圆（circle 不能用 pathLength）
const CORE_RING = 'M72 46 A24 24 0 1 1 120 46 A24 24 0 1 1 72 46 Z';

interface ModuleDef {
  code: string; // 装配序列模块码（右侧面蚀刻，自下而上 = 真实装配顺序）
  x: number;
  y: number;
  w: number;
  h: number;
  coreFace?: boolean; // core 前脸内凹 + 环心发光底
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

// 模块表 — 自下而上 M.01→M.07；漂移周期/相位错峰（周期互质 + delay 交错），
// 保证任意 5s 观察窗总有模块在动；drift delay ≥2.8s（入场 ~2.8s 收尾后接管）
const MODULES: readonly ModuleDef[] = [
  {
    // 图签底座 — 静止基准锚：不漂移、hover 只增亮不位移
    code: 'M.01',
    x: 0,
    y: 296,
    w: 280,
    h: 48,
    asm: [0, 14, 0],
    asmDelay: '0.9s',
    drawDelay: '0s',
    solidifyDelay: '0.95s',
  },
  {
    // 输出左 — 通风格栅
    code: 'M.02',
    x: 0,
    y: 224,
    w: 94,
    h: 66,
    asm: [-20, 0, 0],
    asmDelay: '1s',
    drift: [-8, 0, 0],
    driftDur: '14s',
    driftDelay: '6.4s',
    hover: [-5, 0, 0],
    drawDelay: '0.1s',
    solidifyDelay: '1.05s',
  },
  {
    // 输出右 — 双焊盘分线
    code: 'M.03',
    x: 100,
    y: 224,
    w: 180,
    h: 66,
    asm: [0, 0, 26],
    asmDelay: '1.1s',
    drift: [0, 0, 12],
    driftDur: '16s',
    driftDelay: '3.2s',
    hover: [0, 0, 8],
    drawDelay: '0.18s',
    solidifyDelay: '1.12s',
  },
  {
    // SYNTH CORE — 前脸内凹，漂移时向前「呈递」
    code: 'M.04',
    x: 0,
    y: 126,
    w: 280,
    h: 92,
    coreFace: true,
    asm: [0, 0, 30],
    asmDelay: '1.2s',
    drift: [0, 0, 14],
    driftDur: '11s',
    driftDelay: '8s',
    hover: [0, 0, 9],
    drawDelay: '0.3s',
    solidifyDelay: '1.22s',
  },
  {
    // 输入 — 文档蚀刻 + 下行走线
    code: 'M.05',
    x: 0,
    y: 54,
    w: 280,
    h: 66,
    asm: [24, 0, 0],
    asmDelay: '1.3s',
    drift: [10, 0, 0],
    driftDur: '15s',
    driftDelay: '5s',
    hover: [6, 0, 0],
    drawDelay: '0.42s',
    solidifyDelay: '1.32s',
  },
  {
    // 顶盖左 — 十字基准顶面
    // 漂移/hover 只能向 −X：+X 超过 6px 缝就会与 M.07 前脸共面互穿（z-fighting）
    code: 'M.06',
    x: 0,
    y: 0,
    w: 180,
    h: 48,
    asm: [-20, 0, 0],
    asmDelay: '1.4s',
    drift: [-8, 0, 0],
    driftDur: '13s',
    driftDelay: '12.4s',
    hover: [-5, 0, 0],
    drawDelay: '0.52s',
    solidifyDelay: '1.42s',
    hasTop: true,
  },
  {
    // 顶盖右 — 小端口模块
    code: 'M.07',
    x: 186,
    y: 0,
    w: 94,
    h: 48,
    asm: [0, 0, 30],
    asmDelay: '1.45s',
    drift: [0, 0, 14],
    driftDur: '10s',
    driftDelay: '2.8s',
    hover: [0, 0, 9],
    drawDelay: '0.6s',
    solidifyDelay: '1.48s',
    hasTop: true,
  },
] as const;

// 缝隙发光条 — z=54 埋于前面板（z=60）后方；水平缝自下而上 stagger 脉冲 =
// 数据自底向上流经组合体；竖缝跟随所在行相位
// （z 太深会被视角吃掉：6px 缝 + 16° 俯角下 z54 恰好漏出可感知的光带）
// 尺寸超出缝口：溢出部分被 z60 前脸挡住，模块漂移让开时自动补位——
// 横条 h14 覆盖漂移峰值投影缝隙（hover 再叠加时残留 ≤4px，由 blur 与
// backglow 兜底读作内部阴影）；竖条向漂移方向加宽 16 同理
// 溢到内凹 core 前脸（z52）上的 4px 软光是有意的：光槽托出内凹面板
// ⚠️ 发光条平面不得与任何面相交（WebKit 无平面切分、按质心排序，
// 相交时缝口 sliver 会整条消失）——内侧右面已因此不渲染，见 ModuleShell
const SEAMS: ReadonlyArray<{
  left: number;
  top: number;
  width: number;
  height: number;
  vertical?: boolean;
  delay: string;
}> = [
  { left: 2, top: 286, width: 276, height: 14, delay: '3.3s' },
  { left: 2, top: 214, width: 276, height: 14, delay: '3.85s' },
  { left: 2, top: 116, width: 276, height: 14, delay: '4.4s' },
  { left: 2, top: 44, width: 276, height: 14, delay: '4.95s' },
  { left: 85, top: 224, width: 16, height: 66, vertical: true, delay: '4.1s' },
  { left: 171, top: 2, width: 16, height: 44, vertical: true, delay: '5.2s' },
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

function MonoLabel({
  x,
  y,
  delay,
  children,
}: {
  x: number;
  y: number;
  delay: string;
  children: ReactNode;
}) {
  return (
    <text
      x={x}
      y={y}
      {...LABEL_PROPS}
      style={{ '--draw-delay': delay } as CSSProperties}
    >
      {children}
    </text>
  );
}

// 焊盘节点圆点 — Ship 阶段最后亮起（非 draw 元素，circle 可用）
function NodeDot({ cx, cy }: { cx: number; cy: number }) {
  return (
    <circle
      cx={cx}
      cy={cy}
      r="2"
      className="bp-fade fill-accent"
      style={{ '--draw-delay': T.dots } as CSSProperties}
    />
  );
}

// ── 前面板蚀刻（各面局部坐标系）——跨模块走线在缝口对齐：
// M.05 出线 x150 ↓穿缝→ M.04 入线 x150；M.04 出线 x200 ↓穿缝→ M.03 入线（局部 x100）
const FRONT_ETCH: Record<string, ReactNode> = {
  'M.01': (
    <>
      {/* 图签栏分隔 + SYNTHMIND / S.01 / 1:1 */}
      {['M168 0.5 V47.5', 'M224 0.5 V47.5'].map((d) => (
        <Draw key={d} d={d} stroke={STROKE.detail} delay={T.detailB} />
      ))}
      <MonoLabel x={12} y={29} delay={T.labels}>
        SYNTHMIND
      </MonoLabel>
      <MonoLabel x={178} y={29} delay={T.labels}>
        S.01
      </MonoLabel>
      <MonoLabel x={232} y={29} delay={T.labels}>
        1:1
      </MonoLabel>
    </>
  ),
  'M.02': (
    <>
      {/* 通风格栅 hairline */}
      {['M16 22 H78', 'M16 33 H78', 'M16 44 H78'].map((d) => (
        <Draw key={d} d={d} stroke={STROKE.inner} delay={T.detailB} />
      ))}
    </>
  ),
  'M.03': (
    <>
      {/* 分线：承接 M.04 出线（全局 x200 = 本模块局部 x100）→ 双焊盘 */}
      {['M100 0.5 V16', 'M100 16 H48 V30', 'M100 16 H152 V30'].map((d) => (
        <Draw key={d} d={d} stroke={STROKE.detail} delay={T.detail} />
      ))}
      {['M34 30 H62 V52 H34 Z', 'M138 30 H166 V52 H138 Z'].map((d) => (
        <Draw key={d} d={d} stroke={STROKE.detail} delay={T.detail} />
      ))}
      <NodeDot cx={100} cy={16} />
    </>
  ),
  'M.04': (
    <>
      {/* 核心微光呼吸 — 同路径宽描边叠加（corePulse，RM 下静态 0.35） */}
      <path
        d={CORE_RING}
        stroke={STROKE.corePulse}
        strokeWidth="6"
        className="bp-core-pulse"
      />
      <Draw d={CORE_RING} stroke={STROKE.core} delay={T.detail} width={1.25} />
      {/* 罗盘刻度 */}
      {['M96 14 V22', 'M96 70 V78', 'M64 46 H72', 'M120 46 H128'].map((d) => (
        <Draw key={d} d={d} stroke={STROKE.core} delay={T.detail} />
      ))}
      {/* 入线（承接 M.05 出线 x150）与出线（→ M.03，x200 穿底缝） */}
      <Draw d="M150 0.5 V46 H128" stroke={STROKE.detail} delay={T.detail} />
      <Draw d="M96 78 V84 H200 V91.5" stroke={STROKE.detail} delay={T.detail} />
      <MonoLabel x={158} y={77} delay={T.labels}>
        SYNTH CORE
      </MonoLabel>
      <NodeDot cx={128} cy={46} />
      <NodeDot cx={200} cy={88} />
    </>
  ),
  'M.05': (
    <>
      {/* 输入文档 + 内容行 */}
      <Draw d="M24 13 H80 V53 H24 Z" stroke={STROKE.detail} delay={T.detail} />
      {['M34 24 H70', 'M34 33 H70', 'M34 42 H62'].map((d) => (
        <Draw key={d} d={d} stroke={STROKE.inner} delay={T.detail} />
      ))}
      {/* 出线 → 穿底缝入 M.04 */}
      <Draw d="M80 33 H150 V65.5" stroke={STROKE.detail} delay={T.detail} />
      <NodeDot cx={80} cy={33} />
    </>
  ),
  'M.06': (
    <>
      {/* 角部裁切标记 */}
      {['M10 16 V8 H18', 'M162 8 H170 V16'].map((d) => (
        <Draw key={d} d={d} stroke={STROKE.detail} delay={T.detailB} />
      ))}
    </>
  ),
  'M.07': (
    <>
      {/* 小端口 */}
      <Draw d="M38 15 H56 V33 H38 Z" stroke={STROKE.detail} delay={T.detailB} />
      <NodeDot cx={47} cy={24} />
    </>
  ),
};

// ── 顶面蚀刻（仅顶行两模块） ──
const TOP_ETCH: Record<string, ReactNode> = {
  'M.06': (
    <>
      {/* 十字基准 + 基准环 */}
      {['M76 60 H104', 'M90 46 V74'].map((d) => (
        <Draw key={d} d={d} stroke={STROKE.detail} delay={T.aux} />
      ))}
      <Draw
        d="M82 60 A8 8 0 1 1 98 60 A8 8 0 1 1 82 60 Z"
        stroke={STROKE.detail}
        delay={T.aux}
      />
      {/* 前棱刻度（SVG 下缘 = 与正面共享的前棱） */}
      {['M45 112 V119.5', 'M90 112 V119.5', 'M135 112 V119.5'].map((d) => (
        <Draw key={d} d={d} stroke={STROKE.inner} delay={T.aux} />
      ))}
    </>
  ),
  'M.07': (
    <>
      {['M31 112 V119.5', 'M63 112 V119.5'].map((d) => (
        <Draw key={d} d={d} stroke={STROKE.inner} delay={T.aux} />
      ))}
    </>
  ),
};

// ── 右侧面蚀刻：模块码（真实装配序列，结构性编号）+ 高模块的面板缝 ──
const RIGHT_SEAMS: Record<string, string[]> = {
  'M.04': ['M42 26 H108', 'M42 66 H108'],
  'M.05': ['M42 33 H108'],
};

function rightEtch(def: ModuleDef): ReactNode {
  return (
    <>
      {(RIGHT_SEAMS[def.code] ?? []).map((d) => (
        <Draw key={d} d={d} stroke={STROKE.inner} delay={T.aux} />
      ))}
      {/* SVG x 小端 = 前棱侧，模块码贴前棱 */}
      <MonoLabel x={14} y={def.h / 2 + 3} delay={T.labels}>
        {def.code}
      </MonoLabel>
    </>
  );
}

// 面外框 path（0.5 对齐 hairline 像素栅格）
const edge = (w: number, h: number) =>
  `M0.5 0.5 H${w - 0.5} V${h - 0.5} H0.5 Z`;

// 模块壳 — 三层 transform 解耦：装配入场 / 无限漂移 / hover 偏移
// 永不共存于同一元素（同属性动画冲突的分层解法）；三面几何由前面板矩形推导
function ModuleShell({
  def,
  front,
  top,
}: {
  def: ModuleDef;
  front?: ReactNode;
  top?: ReactNode;
}) {
  const { x, y, w, h } = def;
  const frontZ = def.coreFace ? 52 : DEPTH / 2;
  // 内侧右面（模块右棱不在组合体右缘）只能从 6px 缝口看到一条 sliver，
  // 却与缝隙发光条平面真实相交——WebKit 按质心排序会让缝光整条消失，
  // 与「顶面仅顶行渲染」同一条纪律：不渲染（缝内观感由发光条独占）
  const hasRight = x + w === WIDTH;
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
  const fillStyle = { '--solidify-delay': def.solidifyDelay } as CSSProperties;
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
                  def.coreFace ? 'bp-face-fill--core' : 'bp-face-fill--front'
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
            {/* ── 右侧面（仅右缘模块；w<120 时 left 为负值 — 居中后旋转归位，几何正确） ── */}
            {hasRight ? (
              <div
                className="bp-face"
                style={{
                  left: (w - DEPTH) / 2,
                  top: 0,
                  width: DEPTH,
                  height: h,
                  transform: `rotateY(90deg) translateZ(${w / 2}px)`,
                }}
              >
                <div
                  className="bp-face-fill bp-face-fill--right"
                  style={fillStyle}
                />
                <svg
                  viewBox={`0 0 ${DEPTH} ${h}`}
                  fill="none"
                  className="absolute inset-0 h-full w-full"
                >
                  <path
                    d={edge(DEPTH, h)}
                    stroke={STROKE.edgeRight}
                    strokeWidth="1"
                    pathLength={1}
                    className="bp-draw"
                    style={drawStyle}
                  />
                  <path
                    d={edge(DEPTH, h)}
                    stroke={STROKE.boost}
                    strokeWidth="1"
                    className="bp-edge-boost"
                  />
                  {/* 蚀刻在 hasRight 分支内取值 — 内墙模块不白建 JSX 树 */}
                  {rightEtch(def)}
                </svg>
              </div>
            ) : null}
            {/* ── 顶面（仅顶行） ── */}
            {def.hasTop ? (
              <div
                className="bp-face"
                style={{
                  left: 0,
                  top: (h - DEPTH) / 2,
                  width: w,
                  height: DEPTH,
                  transform: `rotateX(90deg) translateZ(${h / 2}px)`,
                }}
              >
                <div
                  className="bp-face-fill bp-face-fill--top"
                  style={fillStyle}
                />
                <svg
                  viewBox={`0 0 ${w} ${DEPTH}`}
                  fill="none"
                  className="absolute inset-0 h-full w-full"
                >
                  <path
                    d={edge(w, DEPTH)}
                    stroke={STROKE.edgeTop}
                    strokeWidth="1"
                    pathLength={1}
                    className="bp-draw"
                    style={drawStyle}
                  />
                  <path
                    d={edge(w, DEPTH)}
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

export default function BlueprintObject() {
  return (
    <div
      className="bp-object-root relative mx-auto h-[420px] w-[280px] select-none"
      aria-hidden="true"
    >
      {/* 背光/投影由 HeroObjectPhysics 渲染在弹簧层外（光源不随指针旋转） */}
      {/* 透视链：root → float → sway → 本体 → 模块三层 全程 preserve-3d */}
      <div className="obj-float absolute inset-x-0 top-[44px] h-[344px]">
        <div className="obj-sway h-full w-full">
          <div className="bp-object h-full w-full">
            {MODULES.map((def) => (
              <ModuleShell
                key={def.code}
                def={def}
                front={FRONT_ETCH[def.code]}
                top={TOP_ETCH[def.code]}
              />
            ))}
            {/* 缝隙发光条 — 模块滑出时露出更多内光（几何自动，无联动逻辑） */}
            {SEAMS.map((s) => (
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
                    transform: 'translateZ(54px)',
                    '--seam-delay': s.delay,
                  } as CSSProperties
                }
              />
            ))}
            {/* 浮动尺寸基准面 — 链外静止的全高标注：基准不动，模块在动
                面宽 90（svg overflow:hidden，窄面会截断标注文字）；
                中心 x=95+45=140，translateZ 170 → 世界 x=310：
                大于 M.05 的一切位移峰值右面平面（drift+hover 296 / asm 304），
                永不共面 z-fight，且尺寸线不压件（制图习惯） */}
            <div
              className="bp-datum"
              style={{
                left: 95,
                top: 0,
                width: 90,
                height: HEIGHT,
                transform: 'rotateY(90deg) translateZ(170px)',
              }}
            >
              <svg
                viewBox={`0 0 90 ${HEIGHT}`}
                fill="none"
                className="absolute inset-0 h-full w-full"
              >
                {/* detail 档描边 — inner 档 0.22 会被侧面前缩透视吃到不可见 */}
                {[
                  `M45 6 V${HEIGHT - 6}`,
                  'M39 6 H51',
                  `M39 ${HEIGHT - 6} H51`,
                ].map((d) => (
                  <Draw key={d} d={d} stroke={STROKE.detail} delay={T.datum} />
                ))}
                <MonoLabel x={53} y={175} delay="2.2s">
                  {`H ${HEIGHT}`}
                </MonoLabel>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
