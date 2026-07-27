'use client';

// ─── 真砖重力井 · Graphite Wall v8 ───
// BlueprintWall 的动态层：指针 = 压在石墨砌体上的重力井。
// **墙后没有任何发光体**（v6 的指针灯已退役）——本组件只推砖，不点灯。
//
// 砖 + 砖床两层（v6「单层砖」的 v8 修订）：
// - 首次 pointermove 一次性铺满视口的真砖 div（零子元素），同帧让静态
//   tile 丢掉砖层只留砖床（.bp-wall[data-live]）——砖床恒在砖后
// - 缝隙是真凹槽：砖床 tile 画出槽的压暗与接触投影，砖陷下去时缝张开、
//   露出更多槽底 = 更暗
//
// 重力井物理（全局仅 3 标量弹簧：井心 lx/ly + 强度 li，
// 砖的一切响应都是井心位置的纯函数，零砖级状态）：
// - 下陷：坑心砖沿 -z 陷入 ≤DEPTH（透视自然变小变远）
// - 坡斜：坑壁砖沿碗坡朝坑心倾 ≤TILT°（坑底经中心阻尼放平）
// - 聚拢：材料向坑心微聚 ≤PULL px（坑心缝受压闭合、坑缘缝拉开）
// - 渐暗：井深处砖面 opacity 渐降 ≤FADE——露出更暗的砖床槽底
//   （v6 的「透出墙后灯光」语义已反转：坑里本来就该暗）
//
// 门控继承：hover+fine 且非 RM 才接管；触屏/RM/无 JS = 静态 tile
// （砖床 + 砖两层叠加）就是那面墙。只写 transform / opacity；
// 弹簧收敛即停帧。

import { useEffect, useRef } from 'react';
import { listenMql } from '@/lib/listen-mql';

const RADIUS = 150; // 重力井影响半径（px）— v8 收窄：≈5 砖直径，坡更陡
const DEPTH = 36; // 坑心最大下陷（px，-z；perspective 600 下约 5.7% 透视缩）
const PULL = 3; // 向坑心最大聚拢（px）——对向砖合拢 ≤ 缝宽，坑心缝闭合不互叠
const SHRINK = 0.05; // 微缩上限（比例）——与透视缩合计 ≈10%，缝张开露槽底
const TILT = 20; // deg — 碗壁坡度倾斜**上限**（绕砖心，无铰链/背面问题）。
// 实际峰值远低于上限且**随 pitch 档变**（damp = min(1, d/faceSize)）：
// 8.47° @56 档 / 7.41° @64 / 4.94° @96，均在 d≈50px 取极值（v8 spec §7.1）。
// 砖角抬升的力臂是半对角 26.25·√2 = 37.12px（不是半宽）——最坏角
// z = −36u² + 37.12·sin(20u°·u) ≈ −23u² < 0 对所有 d 成立：
// **没有任何砖会凸到墙面之前**
const FADE = 0.35; // 井心砖面透明度降幅——陷得越深，露出的砖床槽底越多 = 越暗
const STIFFNESS = 105; // 井心弹簧 — 石墨重物：沉稳
const DAMPING = 20; // ζ≈0.976 近临界，几乎无过冲
const REST_EPS = 0.05; // px — 位置停帧阈（亚像素）
const REST_V_EPS = 0.5; // px/s — 速度停帧阈：沿用 0.05 档要多空转 ~0.8s 才停帧，0.5 无可见差
const MAX_DT = 0.033; // 秒 — tab 切回防积分爆炸

// 逐砖明度变异（真砌的墙不可能每块砖一模一样）——空串 = 基态 tile 原样
const VARIANTS = [' bp-brick--a', '', ' bp-brick--c'];

// 🚨 必须是**非线性**哈希：任何线性式 (a·c + b·r) % 3 的等值集都是直线，
// 整面墙会织出规则的对角条纹——系数是不是素数完全无关（7 ≡ 13 ≡ 1 mod 3，
// (c·7 + r·13) % 3 恒等于 (c + r) % 3，正是本函数取代的那个错误写法）。
// 大素数乘 + XOR + 位混合打散；`>>> 0` 不可省：`^` 产出有符号 int32，
// 负数取模会得到负下标 → VARIANTS[负] = undefined → class 变成 "brickundefined"
const variantOf = (c: number, r: number) => {
  let h = (c * 73856093) ^ (r * 19349663);
  h ^= h >>> 13;
  return VARIANTS[(h >>> 0) % 3];
};

export default function WallBricks() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    // closest 而非 parentElement：将来若中间包一层 div，data-live 挂错
    // 节点会导致砖层不撤 → 砖床上叠两层砖（层纪律的静默破坏路径）
    const wall = grid.closest<HTMLElement>('.bp-wall'); // data-live 撤静态砖层

    // 能力门控：真 hover + 细指针，且非 reduced-motion
    const capable = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!capable.matches || reducedMotion.matches) return;

    let bricks: HTMLDivElement[] = [];
    let lastW: number[] = []; // 上帧井权重 — 双零跳过（圈外砖零成本）
    let cols = 0;
    let rows = 0;
    let pitch = 0;
    let seam = 0;
    let faceSize = 0;
    let ready = false;
    let buildFailed = false; // var 解析失败闩锁 — 防逐 pointermove 反复强制 reflow 探测

    // 3 标量弹簧：当前值 / 速度 / 目标（全部视口坐标）
    let lx = 0;
    let ly = 0;
    let li = 0;
    let vx = 0;
    let vy = 0;
    let vi = 0;
    let tx = 0;
    let ty = 0;
    let ti = 0;
    let hasPointer = false;
    let rafId = 0;
    let lastTime = 0;
    let disposed = false;
    let resizeTimer = 0;

    // 铺满视口的真砖（一次性；resize 换档/换尺寸后重建）。
    // left/top 与明度变异 class 建时写死（一次布局），逐帧只写 transform/opacity
    const build = () => {
      if (!wall) {
        // 挂错节点时 data-live 落不下——宁可不建砖，不破层纪律
        buildFailed = true;
        return;
      }
      const styles = getComputedStyle(grid);
      const w = Number.parseFloat(styles.getPropertyValue('--wall-brick-w'));
      const s = Number.parseFloat(styles.getPropertyValue('--wall-seam'));
      if (!w || !s) {
        buildFailed = true; // 放弃增强，静态 tile 原样；不再重试
        return;
      }
      pitch = w;
      seam = s;
      faceSize = w - s;
      // clientWidth/Height = .bp-wall（fixed inset:0）的真实盒；
      // innerWidth 含经典滚动条，会白铺一列压在滚动条槽下
      cols = Math.ceil(document.documentElement.clientWidth / pitch);
      rows = Math.ceil(document.documentElement.clientHeight / pitch);
      grid.textContent = '';
      bricks = [];
      lastW = [];
      const frag = document.createDocumentFragment();
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const b = document.createElement('div');
          b.className = `bp-brick${variantOf(c, r)}`;
          b.style.left = `${c * pitch + seam}px`;
          b.style.top = `${r * pitch + seam}px`;
          b.style.width = `${faceSize}px`;
          b.style.height = `${faceSize}px`;
          frag.appendChild(b);
          bricks.push(b);
          lastW.push(0);
        }
      }
      grid.appendChild(frag);
      wall.dataset.live = ''; // 接管：静态砖层撤下只留砖床，真砖阵上场
      ready = true;
    };

    // 依当前井心落样式：全砖扫描（平方距离先筛，圈外双零跳过）
    const render = () => {
      const r2 = RADIUS * RADIUS;
      const half = faceSize / 2;
      for (let i = 0; i < bricks.length; i++) {
        const dx = (i % cols) * pitch + seam + half - lx;
        const dy = ((i / cols) | 0) * pitch + seam + half - ly;
        const d2 = dx * dx + dy * dy;
        let w = 0;
        let d = 1; // ||1 = 井心恰落砖心时方向向量的除零守卫
        if (d2 < r2) {
          d = Math.sqrt(d2) || 1;
          w = (1 - d / RADIUS) ** 2 * li;
        }
        if (w < 0.001) {
          if (lastW[i] !== 0) {
            // 出圈/井灭 → 归还原样（无 transform 的砖 = 静态几何）
            bricks[i].style.transform = '';
            bricks[i].style.opacity = '';
            lastW[i] = 0;
          }
          continue;
        }
        // 径向单位向量一份数据喂三个动作：聚拢 = -u、碗坡倾斜轴 =
        // (uy, -ux)（近井缘随坡度下沉）、下陷沿 -z；中心阻尼（坑底
        // 方向不定 → 聚拢/倾斜归零 = 碗底放平，只留最深下陷）；
        // per-element perspective 不建 preserve-3d 链
        const damp = Math.min(1, d / faceSize);
        const ux = dx / d;
        const uy = dy / d;
        const pull = PULL * w * damp;
        const tilt = TILT * w * damp;
        // 倾角趋零时略去 rotate3d——顺带规避零向量轴让老 WebKit
        // 整条 transform 失效的历史坑
        const rot =
          tilt < 0.01
            ? ''
            : `rotate3d(${uy.toFixed(4)}, ${(-ux).toFixed(4)}, 0, ${tilt.toFixed(2)}deg) `;
        bricks[i].style.transform =
          `perspective(600px) translate3d(${(-ux * pull).toFixed(2)}px, ${(-uy * pull).toFixed(2)}px, ${(-DEPTH * w).toFixed(2)}px) ` +
          rot +
          `scale(${(1 - SHRINK * w).toFixed(4)})`;
        bricks[i].style.opacity = (1 - FADE * w).toFixed(3);
        lastW[i] = w;
      }
    };

    // 半隐式欧拉一步积分（HeroObjectPhysics 同款）
    const frame = (time: number) => {
      if (disposed) return;
      const dt = Math.max(0, Math.min((time - lastTime) / 1000, MAX_DT));
      lastTime = time;
      vx += (-STIFFNESS * (lx - tx) - DAMPING * vx) * dt;
      vy += (-STIFFNESS * (ly - ty) - DAMPING * vy) * dt;
      vi += (-STIFFNESS * (li - ti) - DAMPING * vi) * dt;
      lx += vx * dt;
      ly += vy * dt;
      li = Math.min(1, Math.max(0, li + vi * dt));
      const settled =
        Math.abs(lx - tx) < REST_EPS &&
        Math.abs(ly - ty) < REST_EPS &&
        Math.abs(li - ti) < 0.005 &&
        Math.abs(vx) < REST_V_EPS &&
        Math.abs(vy) < REST_V_EPS &&
        Math.abs(vi) < 0.005;
      if (settled) {
        lx = tx;
        ly = ty;
        li = ti;
        vx = vy = vi = 0;
      }
      render();
      rafId = settled ? 0 : requestAnimationFrame(frame);
    };

    const kick = () => {
      if (disposed || rafId) return;
      lastTime = performance.now();
      rafId = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      if (disposed) return;
      // 设备级门控（hover+fine）挡不住混合触屏笔记本的手指——事件级再滤
      if (e.pointerType === 'touch') return;
      if (!ready) {
        if (buildFailed) return;
        build(); // 懒启动 — 首次指针移动才建砖
        if (!ready) return;
      }
      tx = e.clientX;
      ty = e.clientY;
      ti = 1;
      if (!hasPointer || li < 0.02) {
        // 冷井原地浮现（首现或熄灭后的再入）：井心瞬移到指针，不从旧
        // 位置横穿视口飞掠；仍可见的井（快速离-回）保持弹簧连续滑动
        hasPointer = true;
        lx = tx;
        ly = ty;
        vx = vy = 0;
      }
      kick();
    };

    // 离开窗口 = 井撤压：强度归零，一根弹簧带全部砖归位
    const onLeave = () => {
      ti = 0;
      kick();
    };

    // Cmd-Tab / 切 tab / 原生对话框夺焦一般不触发 pointerleave——
    // 失焦与页面隐藏同样视为「指针离场」，防坑滞留在陈旧位置
    const onBlur = () => onLeave();
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') onLeave();
    };

    // 尺寸/档位变化：重建砖阵（已接管则原地重建，保持 live 无闪变）
    const onResize = () => {
      if (disposed) return;
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (disposed || !ready) return;
        build();
        kick();
      }, 200);
    };

    const teardown = () => {
      if (disposed) return;
      disposed = true;
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', onResize);
      window.clearTimeout(resizeTimer);
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      bricks = [];
      grid.textContent = '';
      if (wall) delete wall.dataset.live; // 静态砖层复位（砖床原样）
    };

    // 会话中途开启 reduced-motion → 拆除真砖，回到静态 tile
    // 能力判定单向（同 HeroObjectPhysics）：中途关闭 RM 不重建，导航后自愈
    const unlistenReduced = listenMql(reducedMotion, (e) => {
      if (e.matches) teardown();
    });

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave, {
      passive: true,
    });
    window.addEventListener('blur', onBlur, { passive: true });
    document.addEventListener('visibilitychange', onVisibility, {
      passive: true,
    });
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      teardown();
      unlistenReduced();
    };
  }, []);

  return <div ref={gridRef} className="bp-wall-grid" />;
}
