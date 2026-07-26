// ─── Hero 活蓝图 · Blueprint 签名元素 ───
// 一张自动绘制的工程图：输入文档 → SYNTH CORE → 双输出（workflow automation 的抽象表达）
// 纯 SVG + CSS 动画（.bp-draw 逐笔绘制 / .bp-fade 标注淡入），零 JS
// 所有描边元素带 pathLength=1，配合 globals.css 的 dasharray 归一化
// 坐标全部对齐 12/24 网格，呼应页面基准网格
// Server Component — 装饰性图形，aria-hidden

import type { CSSProperties } from 'react';

// 分段绘制延迟（秒）— 图框 → 节点 → 连线 → 标注的制图次序
const D = {
  frame: '0s',
  titleBlock: '0.15s',
  nodeA: '0.3s',
  nodeAInner: '0.5s',
  connAB: '0.65s',
  nodeB: '0.8s',
  core: '0.95s',
  connOut: '1.1s',
  nodeCD: '1.25s',
  nodeCDInner: '1.4s',
  dimension: '1.5s',
  labels: '1.7s',
  dots: '1.9s',
} as const;

// 描边色阶 — alpha 写进颜色值，opacity 动画恒到 1
const STROKE = {
  frame: 'rgba(74, 159, 229, 0.12)',
  block: 'rgba(74, 159, 229, 0.2)',
  node: 'rgba(74, 159, 229, 0.4)',
  inner: 'rgba(74, 159, 229, 0.22)',
  conn: 'rgba(74, 159, 229, 0.3)',
  core: 'rgba(74, 159, 229, 0.55)',
  dim: 'rgba(74, 159, 229, 0.25)',
} as const;

// mono 标注文字的公共属性
const LABEL_PROPS = {
  fontSize: 9,
  letterSpacing: '0.08em',
  fill: 'var(--text-quaternary)',
  className: 'font-mono bp-fade',
} as const;

export default function HomeHeroBlueprint() {
  return (
    <svg
      viewBox="0 0 480 400"
      fill="none"
      aria-hidden="true"
      className="w-full h-auto"
    >
      {/* ── 图框 ── */}
      <rect
        x="12"
        y="12"
        width="456"
        height="376"
        rx="2"
        stroke={STROKE.frame}
        strokeWidth="1"
        pathLength={1}
        className="bp-draw"
        style={{ '--draw-delay': D.frame } as CSSProperties}
      />

      {/* ── 图签栏（右下角 title block）— --draw-delay 经 CSS 变量继承下传子路径 ── */}
      <g
        stroke={STROKE.block}
        strokeWidth="1"
        style={{ '--draw-delay': D.titleBlock } as CSSProperties}
      >
        <path d="M300 356 H468" pathLength={1} className="bp-draw" />
        <path d="M300 356 V388" pathLength={1} className="bp-draw" />
        <path d="M392 356 V388" pathLength={1} className="bp-draw" />
        <path d="M436 356 V388" pathLength={1} className="bp-draw" />
      </g>
      <text
        x="308"
        y="376"
        {...LABEL_PROPS}
        style={{ '--draw-delay': D.labels } as CSSProperties}
      >
        SYNTHMIND
      </text>
      <text
        x="400"
        y="376"
        {...LABEL_PROPS}
        style={{ '--draw-delay': D.labels } as CSSProperties}
      >
        S.01
      </text>
      <text
        x="444"
        y="376"
        {...LABEL_PROPS}
        style={{ '--draw-delay': D.labels } as CSSProperties}
      >
        1:1
      </text>

      {/* ── 节点 A：输入文档 ── */}
      <rect
        x="36"
        y="84"
        width="120"
        height="72"
        rx="6"
        stroke={STROKE.node}
        strokeWidth="1"
        pathLength={1}
        className="bp-draw"
        style={{ '--draw-delay': D.nodeA } as CSSProperties}
      />
      {/* 文档内容线 */}
      {['M52 108 H124', 'M52 124 H140', 'M52 140 H108'].map((d) => (
        <path
          key={d}
          d={d}
          stroke={STROKE.inner}
          strokeWidth="1"
          pathLength={1}
          className="bp-draw"
          style={{ '--draw-delay': D.nodeAInner } as CSSProperties}
        />
      ))}
      <text
        x="36"
        y="72"
        {...LABEL_PROPS}
        style={{ '--draw-delay': D.labels } as CSSProperties}
      >
        INPUT / DOCUMENTS
      </text>

      {/* ── 连线 A → B（正交布线）── */}
      <path
        d="M156 120 H180 V204 H204"
        stroke={STROKE.conn}
        strokeWidth="1"
        pathLength={1}
        className="bp-draw"
        style={{ '--draw-delay': D.connAB } as CSSProperties}
      />

      {/* ── 节点 B：SYNTH CORE ── */}
      <rect
        x="204"
        y="156"
        width="96"
        height="96"
        rx="6"
        stroke={STROKE.node}
        strokeWidth="1"
        pathLength={1}
        className="bp-draw"
        style={{ '--draw-delay': D.nodeB } as CSSProperties}
      />
      <circle
        cx="252"
        cy="204"
        r="22"
        stroke={STROKE.core}
        strokeWidth="1.25"
        pathLength={1}
        className="bp-draw"
        style={{ '--draw-delay': D.core } as CSSProperties}
      />
      {/* 罗盘刻度 — 仪器细节 */}
      {['M252 176 V182', 'M252 226 V232', 'M224 204 H230', 'M274 204 H280'].map(
        (d) => (
          <path
            key={d}
            d={d}
            stroke={STROKE.core}
            strokeWidth="1"
            pathLength={1}
            className="bp-draw"
            style={{ '--draw-delay': D.core } as CSSProperties}
          />
        ),
      )}
      <text
        x="252"
        y="268"
        textAnchor="middle"
        {...LABEL_PROPS}
        style={{ '--draw-delay': D.labels } as CSSProperties}
      >
        SYNTH CORE
      </text>

      {/* ── 连线 B → C / B → D ── */}
      <path
        d="M300 204 H324 V112 H348"
        stroke={STROKE.conn}
        strokeWidth="1"
        pathLength={1}
        className="bp-draw"
        style={{ '--draw-delay': D.connOut } as CSSProperties}
      />
      <path
        d="M300 204 H324 V276 H348"
        stroke={STROKE.conn}
        strokeWidth="1"
        pathLength={1}
        className="bp-draw"
        style={{ '--draw-delay': D.connOut } as CSSProperties}
      />

      {/* ── 节点 C / D：双输出 ── */}
      <rect
        x="348"
        y="84"
        width="96"
        height="56"
        rx="6"
        stroke={STROKE.node}
        strokeWidth="1"
        pathLength={1}
        className="bp-draw"
        style={{ '--draw-delay': D.nodeCD } as CSSProperties}
      />
      <rect
        x="348"
        y="248"
        width="96"
        height="56"
        rx="6"
        stroke={STROKE.node}
        strokeWidth="1"
        pathLength={1}
        className="bp-draw"
        style={{ '--draw-delay': D.nodeCD } as CSSProperties}
      />
      {['M364 104 H428', 'M364 120 H404', 'M364 268 H428', 'M364 284 H412'].map(
        (d) => (
          <path
            key={d}
            d={d}
            stroke={STROKE.inner}
            strokeWidth="1"
            pathLength={1}
            className="bp-draw"
            style={{ '--draw-delay': D.nodeCDInner } as CSSProperties}
          />
        ),
      )}
      <text
        x="348"
        y="72"
        {...LABEL_PROPS}
        style={{ '--draw-delay': D.labels } as CSSProperties}
      >
        OUTPUT A / AUTOMATED
      </text>
      <text
        x="348"
        y="322"
        {...LABEL_PROPS}
        style={{ '--draw-delay': D.labels } as CSSProperties}
      >
        OUTPUT B / TRACKED
      </text>

      {/* ── 尺寸标注线（节点 A 下方）── */}
      <g
        stroke={STROKE.dim}
        strokeWidth="1"
        style={{ '--draw-delay': D.dimension } as CSSProperties}
      >
        <path d="M36 174 V186" pathLength={1} className="bp-draw" />
        <path d="M156 174 V186" pathLength={1} className="bp-draw" />
        <path d="M36 180 H156" pathLength={1} className="bp-draw" />
      </g>
      <text
        x="96"
        y="198"
        textAnchor="middle"
        {...LABEL_PROPS}
        style={{ '--draw-delay': D.labels } as CSSProperties}
      >
        120 MOD
      </text>

      {/* ── 十字基准标记 ── */}
      {[
        ['M198 60 H210', 'M204 54 V66'],
        ['M294 340 H306', 'M300 334 V346'],
      ].map(([h, v]) => (
        <g
          key={h}
          stroke={STROKE.conn}
          strokeWidth="1"
          style={{ '--draw-delay': D.dimension } as CSSProperties}
        >
          <path d={h} pathLength={1} className="bp-draw" />
          <path d={v} pathLength={1} className="bp-draw" />
        </g>
      ))}

      {/* ── 连接节点圆点 — 最后亮起 ── */}
      {[
        [156, 120],
        [204, 204],
        [300, 204],
        [348, 112],
        [348, 276],
      ].map(([cx, cy]) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r="2.5"
          fill="#4A9FE5"
          className="bp-fade"
          style={{ '--draw-delay': D.dots } as CSSProperties}
        />
      ))}
    </svg>
  );
}
