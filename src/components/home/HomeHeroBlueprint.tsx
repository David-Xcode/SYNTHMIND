// ─── Hero 活蓝图 · Blueprint 签名元素 ───
// 一张自动绘制的工程图：输入文档 → SYNTH CORE → 双输出（workflow automation 的抽象表达）
// 纯 SVG + CSS 动画（.bp-draw 逐笔绘制 / .bp-fade 标注淡入），零 JS
// 所有 .bp-draw 元素必须是 <path>：pathLength 在 rect/circle 上 WebKit 不支持，
// 会把 dasharray 归一化破坏成 1px 点线（Safari 桌面端是本图的主要受众）
// 坐标全部对齐 12/24 网格，呼应页面基准网格；直角矩形贴合工程制图语言
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
// fill 走 CSS class 而非 presentation attribute — 个别 WebView 不在
// presentation attribute 里做 var() 替换，会回退成黑色（深底上隐形）
const LABEL_PROPS = {
  fontSize: 9,
  letterSpacing: '0.08em',
  className: 'font-mono bp-fade fill-[var(--text-quaternary)]',
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
      <path
        d="M12 12 H468 V388 H12 Z"
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
      <path
        d="M36 84 H156 V156 H36 Z"
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
      <path
        d="M204 156 H300 V252 H204 Z"
        stroke={STROKE.node}
        strokeWidth="1"
        pathLength={1}
        className="bp-draw"
        style={{ '--draw-delay': D.nodeB } as CSSProperties}
      />
      {/* 核心圆环 — 两段圆弧拼成整圆（<circle> 不能用 pathLength） */}
      <path
        d="M230 204 A22 22 0 1 1 274 204 A22 22 0 1 1 230 204 Z"
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
      <path
        d="M348 84 H444 V140 H348 Z"
        stroke={STROKE.node}
        strokeWidth="1"
        pathLength={1}
        className="bp-draw"
        style={{ '--draw-delay': D.nodeCD } as CSSProperties}
      />
      <path
        d="M348 248 H444 V304 H348 Z"
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
          className="bp-fade fill-accent"
          style={{ '--draw-delay': D.dots } as CSSProperties}
        />
      ))}
    </svg>
  );
}
