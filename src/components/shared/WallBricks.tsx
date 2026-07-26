'use client';

// ─── 砖场弹簧层 · Living Blueprint v4.1 ───
// 设计定案：docs/superpowers/specs/2026-07-26-living-blueprint-v4.1-design.md（§2）
// BlueprintWall 的动态层：指针滑过时邻域方砖翘起跟随、露出砖下光槽，
// 离开后弹簧缓落归位；墙随页面滚动，砖场 fixed + mod 回卷追随。
//
// 纪律与门控（v4 结论继承 + v4.1 变化）：
// - 懒构建：挂载只判能力，首次 pointermove 才建砖 DOM——SSR 零增量、
//   LCP 零影响；触屏 / RM / 无 JS 三条路径 = 静态材质墙原样（CSS 直出随滚）
// - 随滚 = fixed 场 + translateY(-(scrollY mod pitch)) 回卷：网格化对齐
//   阵列以 pitch 为完全周期，回卷逐像素无缝；跨 pitch 整数倍时弹簧状态
//   沿行转移（滚出行归零补入另一端）——DOM 数恒定，零增删零文档高监听
// - 砖 pitch 从 CSS var 读取（--wall-brick-w / --wall-seam 阶梯）：
//   JS 只读不定，静态层与 DOM 砖永不产生第二事实源；算出砖数 >400
//   （预算实测：368 砖满帧、600 砖掉帧）→ 彻底放弃增强，静态墙原样
// - 每砖独立 perspective（transform 内自带），不建 preserve-3d 链
// - 只写 transform / opacity（z-index 为活跃态一次性切换，非逐帧动画）；
//   rAF 半隐式欧拉弹簧，全部收敛即停帧
// - 砖 DOM 命令式创建（非 React state）：~百个短命装饰节点自管

import { useEffect, useRef } from 'react';
import { listenMql } from '@/lib/listen-mql';

const MAX_BRICKS = 400; // 瓦片预算硬上限（v4.1 实测重定：368 满帧 / 600 掉帧）
const RADIUS = 240; // 指针影响半径
const MAX_TILT = 12; // deg — 白名单口径 ≤12°
const MAX_LIFT = 18; // px — 白名单口径 ≤18px
const STIFFNESS = 40;
const DAMPING = 7; // ζ≈0.55 — 轻微过冲（气流掠过的回弹感）
const REST_EPS = 0.01;
const MAX_DT = 0.033; // 秒 — tab 切回防积分爆炸

interface Spring {
  x: number;
  v: number;
  t: number; // target
}

interface Brick {
  el: HTMLDivElement;
  glow: HTMLDivElement;
  shadow: HTMLDivElement;
  cx: number; // 砖心（场内坐标 — 恒定，滚动由场 transform 承担）
  cy: number;
  rx: Spring;
  ry: Spring;
  z: Spring;
  settled: boolean;
  raised: boolean; // z-index 已提升（状态切换非逐帧写入）
}

const spring = (): Spring => ({ x: 0, v: 0, t: 0 });

// 半隐式欧拉一步积分（HeroObjectPhysics 同款：刚性系统下比显式欧拉稳定）
function step(s: Spring, dt: number) {
  s.v += (-STIFFNESS * (s.x - s.t) - DAMPING * s.v) * dt;
  s.x += s.v * dt;
}

function isSettled(s: Spring) {
  return Math.abs(s.x - s.t) < REST_EPS && Math.abs(s.v) < REST_EPS;
}

export default function WallBricks() {
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    // 能力门控：真 hover + 细指针，且非 reduced-motion（触屏/RM 静态墙原样）
    const capable = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!capable.matches || reducedMotion.matches) return;

    const wall = field.parentElement; // .bp-wall（data-bricks 切换宿主）

    let bricks: Brick[] = [];
    let rows = 0;
    let cols = 0;
    let pitch = 0;
    let raisedCount = 0; // 非静止砖计数 — 全零时滚动可跳过状态转移/重瞄
    let built = false;
    let rafId = 0;
    let lastTime = 0;
    let px = -1e4; // 指针（场内坐标）— 远置初值 = 无影响
    let py = -1e4;
    let lastClientX = -1e4; // 指针视口坐标缓存 — 滚动时重算场内坐标用
    let lastClientY = -1e4;
    let baseRow = 0; // floor(scrollY / pitch) — mod 回卷基准行
    let offset = 0; // scrollY mod pitch
    let disposed = false;
    let resizeTimer = 0;
    let rebuildPending = false; // resize 拆场后待重建（懒构建语义下区分「从未建过」）

    const clearBricks = () => {
      field.textContent = '';
      field.style.transform = '';
      field.style.height = '';
      bricks = [];
      built = false;
      baseRow = 0;
      offset = 0;
      raisedCount = 0;
      if (wall) delete wall.dataset.bricks;
    };

    // 依当前弹簧状态落样式 — 帧循环与状态行转移共用（转移后必须立即
    // 重绘，否则 wrap 瞬间旧姿态残留一帧）
    const applyStyle = (b: Brick) => {
      const lift = Math.max(b.z.x, 0);
      if (b.settled && !b.rx.x && !b.ry.x && !b.z.x) {
        b.el.style.transform = '';
        b.glow.style.opacity = '0';
        b.shadow.style.opacity = '0';
        if (b.raised) {
          // 完全归位才撤层序提升 — 活跃期间保持稳定，避免翘起中被邻砖切割
          b.el.style.zIndex = '';
          b.shadow.style.zIndex = '';
          b.raised = false;
          raisedCount--;
        }
      } else {
        if (!b.raised) {
          // 状态切换非逐帧动画：投影要压在邻砖面上、多砖同时翘起层序稳定
          b.el.style.zIndex = '2';
          b.shadow.style.zIndex = '1';
          b.raised = true;
          raisedCount++;
        }
        b.el.style.transform = `perspective(600px) rotateX(${b.rx.x.toFixed(3)}deg) rotateY(${b.ry.x.toFixed(3)}deg) translateZ(${b.z.x.toFixed(2)}px)`;
        b.glow.style.opacity = (lift / MAX_LIFT).toFixed(3);
        b.shadow.style.opacity = ((lift / MAX_LIFT) * 0.8).toFixed(3);
      }
    };

    const zeroBrick = (b: Brick) => {
      b.rx.x = b.rx.v = b.rx.t = 0;
      b.ry.x = b.ry.v = b.ry.t = 0;
      b.z.x = b.z.v = b.z.t = 0;
      b.settled = true;
      applyStyle(b);
    };

    const copyState = (dst: Brick, src: Brick) => {
      dst.rx.x = src.rx.x;
      dst.rx.v = src.rx.v;
      dst.rx.t = src.rx.t;
      dst.ry.x = src.ry.x;
      dst.ry.v = src.ry.v;
      dst.ry.t = src.ry.t;
      dst.z.x = src.z.x;
      dst.z.v = src.z.v;
      dst.z.t = src.z.t;
      dst.settled = src.settled;
      applyStyle(dst);
    };

    // 滚动同步：场 transform 回卷 + 跨 pitch 整数倍时弹簧状态沿行转移
    const syncScroll = () => {
      if (!built || !bricks.length) return;
      const y = window.scrollY;
      // floor 版 mod：y<0（橡皮筋回弹）时 floor 取更小整数，offset 仍落 [0,pitch)
      offset = y - Math.floor(y / pitch) * pitch;
      field.style.transform = `translateY(${-offset}px)`;
      const nb = Math.floor(y / pitch);
      const d = nb - baseRow;
      baseRow = nb;
      if (!d) return;
      if (!raisedCount) return; // 全场静止归零 — 状态转移是恒等操作，白跑 400 砖双循环
      if (Math.abs(d) >= rows) {
        // 一跳超过整场（锚点跳转/瞬时长滚）— 全场归零即等价
        for (let i = 0; i < bricks.length; i++) zeroBrick(bricks[i]);
        return;
      }
      // 滚下 d>0：视觉整场上移 d 行 — slot r 接管原 slot r+d 的状态；
      // 滚上反向遍历防覆写；新滚入的边缘行清零（与静态砖面无差）
      if (d > 0) {
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const dst = bricks[r * cols + c];
            if (r + d < rows) copyState(dst, bricks[(r + d) * cols + c]);
            else zeroBrick(dst);
          }
        }
      } else {
        for (let r = rows - 1; r >= 0; r--) {
          for (let c = 0; c < cols; c++) {
            const dst = bricks[r * cols + c];
            if (r + d >= 0) copyState(dst, bricks[(r + d) * cols + c]);
            else zeroBrick(dst);
          }
        }
      }
    };

    const build = () => {
      // documentElement.clientWidth 不含经典滚动条 — field 的 100vw 含滚动条，
      // 用它算 cols 会白铺一列画在滚动条底下（预算与工作量浪费）
      const w = document.documentElement.clientWidth;
      const h = window.innerHeight;
      if (!w || !h) return;
      // pitch 单一事实源 = CSS 阶梯变量（静态层同读）；解析失败即放弃增强
      const styles = getComputedStyle(field);
      const brickW = Number.parseFloat(
        styles.getPropertyValue('--wall-brick-w'),
      );
      const seam = Number.parseFloat(styles.getPropertyValue('--wall-seam'));
      // !x 已覆盖 NaN 与 0（parseFloat 解析失败即放弃增强，静态墙原样）
      if (!brickW || !seam) {
        built = true;
        return;
      }
      pitch = brickW;
      rows = Math.ceil(h / pitch) + 1; // +1 = mod 回卷备用行
      cols = Math.ceil(w / pitch);
      // 预算硬上限：MQ 阶梯已把主流屏压进预算，仍超（异形屏）→ 彻底放弃；
      // built 置位阻止后续 pointermove 反复重试
      if (rows * cols > MAX_BRICKS) {
        built = true;
        return;
      }

      const frag = document.createDocumentFragment();
      const next: Brick[] = [];
      const face = pitch - seam;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          // 缝归每砖 cell 的上/左缘：面从 (+seam,+seam) 起（与静态 tile 一致）
          const left = col * pitch + seam;
          const top = row * pitch + seam;
          // 投影是砖的 sibling（不随砖 transform 移动——影子留在墙上）；
          // 先入 DOM，静止态画序在砖面之下
          const shadow = document.createElement('div');
          shadow.className = 'bp-brick-shadow';
          // 投影几何按砖面比例（pitch 阶梯 80→192 跨 2.4 倍，绝对值会让
          // 大屏投影显得过薄、悬浮高度暗示走味）
          shadow.style.left = `${left + face * 0.06}px`;
          shadow.style.top = `${top + face * 0.93}px`;
          shadow.style.width = `${face * 0.88}px`;
          shadow.style.height = `${face * 0.18}px`;
          const el = document.createElement('div');
          el.className = 'bp-brick';
          el.style.left = `${left}px`;
          el.style.top = `${top}px`;
          el.style.width = `${face}px`;
          el.style.height = `${face}px`;
          const glow = document.createElement('div');
          glow.className = 'bp-brick-glow';
          el.appendChild(glow);
          frag.appendChild(shadow);
          frag.appendChild(el);
          next.push({
            el,
            glow,
            shadow,
            cx: left + face / 2,
            cy: top + face / 2,
            rx: spring(),
            ry: spring(),
            z: spring(),
            settled: true,
            raised: false,
          });
        }
      }
      field.style.height = `${rows * pitch}px`;
      field.appendChild(frag);
      bricks = next;
      built = true;
      // 砖已入 DOM 再隐藏静态砖面 — 同帧切换，静止态像素等价无跳变
      // （光槽层/洗墙光不隐藏：遮挡关系由 DOM 砖接管）
      if (wall) wall.dataset.bricks = 'on';
      // 建场即校准回卷相位与 baseRow（刷新/锚点跳转可能落在页中，
      // clearBricks 把 baseRow 归 0，此处按当前 scrollY 重新对齐）
      syncScroll();
    };

    // 依当前指针位置刷新全部砖的弹簧目标（半径外归零）
    const retarget = () => {
      for (let i = 0; i < bricks.length; i++) {
        const b = bricks[i];
        const dx = b.cx - px;
        const dy = b.cy - py;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < RADIUS) {
          // 权重二次衰减；近缘翘起背向指针（气流掠过）
          const wgt = (1 - d / RADIUS) ** 2;
          const inv = d > 1 ? 1 / d : 0;
          b.rx.t = -MAX_TILT * wgt * dy * inv;
          b.ry.t = MAX_TILT * wgt * dx * inv;
          b.z.t = MAX_LIFT * wgt;
        } else {
          b.rx.t = 0;
          b.ry.t = 0;
          b.z.t = 0;
        }
        // 判「目标 ≠ 当前」而非「目标非零」：指针离开时目标归零，
        // 悬在半空的已收敛砖也必须被唤醒缓落
        if (
          b.settled &&
          (Math.abs(b.rx.t - b.rx.x) > REST_EPS ||
            Math.abs(b.ry.t - b.ry.x) > REST_EPS ||
            Math.abs(b.z.t - b.z.x) > REST_EPS)
        ) {
          b.settled = false;
        }
      }
    };

    const frame = (time: number) => {
      if (disposed) return;
      const dt = Math.max(0, Math.min((time - lastTime) / 1000, MAX_DT));
      lastTime = time;
      let anyActive = false;
      for (let i = 0; i < bricks.length; i++) {
        const b = bricks[i];
        if (b.settled) continue;
        step(b.rx, dt);
        step(b.ry, dt);
        step(b.z, dt);
        if (isSettled(b.rx) && isSettled(b.ry) && isSettled(b.z)) {
          // 收敛吸附 — 归零砖清空内联样式，回到与静态砖面等价的姿态
          b.rx.x = b.rx.t;
          b.ry.x = b.ry.t;
          b.z.x = b.z.t;
          b.rx.v = b.ry.v = b.z.v = 0;
          b.settled = true;
        } else {
          anyActive = true;
        }
        applyStyle(b);
      }
      if (anyActive) {
        rafId = requestAnimationFrame(frame);
      } else {
        rafId = 0;
      }
    };

    const kick = () => {
      if (disposed || rafId) return;
      lastTime = performance.now();
      rafId = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      if (disposed) return;
      if (!built) build(); // 懒构建 — 首次指针移动才付 DOM 成本
      if (!bricks.length) return; // 预算放弃路径 — 不做无效工作
      lastClientX = e.clientX;
      lastClientY = e.clientY;
      px = e.clientX; // 场内 x = 视口 x（横向无滚动）
      py = e.clientY + offset; // 场内 y = 视口 y + 回卷相位
      retarget();
      kick();
    };

    const onLeave = () => {
      if (disposed) return;
      px = -1e4;
      py = -1e4;
      lastClientX = -1e4;
      lastClientY = -1e4;
      retarget();
      kick(); // 缓落归位
    };

    const onScroll = () => {
      if (disposed || !built || !bricks.length) return;
      syncScroll();
      // 滚动时墙动指针不动 — 场内坐标漂移，必须以缓存视口坐标重瞄
      if (lastClientY > -1e3) {
        px = lastClientX;
        py = lastClientY + offset;
        retarget();
        kick();
      }
    };

    const onResize = () => {
      if (disposed) return;
      // 立即拆场恢复静态砖面：防抖窗口内旧尺寸的场盖不满新视口
      // （拖拽窗口边缘时防抖迟迟不触发，底/右会露出无砖空带；跨 pitch
      // 阈值时光槽与旧 DOM 砖周期还会错拍）——静态层始终是正确材质。
      // rebuildPending 记住「拆的是已建过的场」：拆后 built=false，仍要续
      // 防抖重建；从未建过的场（无指针交互）不因 resize 提前付构建成本
      if (built) {
        if (bricks.length) clearBricks();
        // 预算/解析放弃态（built=true 但零砖）：新尺寸要重新评估，
        // 否则竖屏超预算 → 转横屏进预算后砖场永久不再激活
        else built = false;
        rebuildPending = true;
      }
      if (!rebuildPending) return;
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (disposed || !rebuildPending) return;
        rebuildPending = false;
        // 防抖窗口内 pointermove 可能已抢先懒构建 — 不重复建场
        if (!built) build();
      }, 200);
    };

    const teardown = () => {
      if (disposed) return;
      disposed = true;
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.clearTimeout(resizeTimer);
      rebuildPending = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      clearBricks(); // 静态砖面随 data 属性移除自动恢复
    };

    // 会话中途开启 reduced-motion → 拆除砖层，回到静态材质墙
    // 能力判定单向（同 HeroObjectPhysics）：中途关闭 RM 不重建，导航后自愈
    const unlistenReduced = listenMql(reducedMotion, (e) => {
      if (e.matches) teardown();
    });

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave, {
      passive: true,
    });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      teardown();
      unlistenReduced();
    };
  }, []);

  return <div ref={fieldRef} className="bp-wall-field" />;
}
