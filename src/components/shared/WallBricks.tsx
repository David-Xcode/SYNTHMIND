'use client';

// ─── 真砖重力井 · Lantern Wall v6 ───
// BlueprintWall 的动态层：指针 = 压在墙上的重力井 + 墙后的一盏灯。
//
// 单层真砖（v5 的「静态 tile + DOM 砖 + 逐格底衬 + 假涌光」四层互相
// 遮掩机器全部退役）：
// - 首次 pointermove 一次性铺满视口的真砖 div（零子元素零底衬），
//   同帧隐藏静态 tile（.bp-wall[data-live]，两者像素等价 = 无感接管）
//   ——任何时刻只存在一层砖
// - 缝隙是真空隙：墙后的灯（.bp-wall-lamp）与角落余晖直接从缝里
//   透出，无需任何假光层；砖塌陷张开的缝透出的就是真灯光
// - 墙属场景（.bp-wall fixed）：内容从墙前滚过，墙与光都不动——
//   零滚动耦合（无 scroll 监听、无文档坐标、无越界裁切）
//
// 重力井物理（全局仅 3 标量弹簧：井心 lx/ly + 强度 li，
// 砖的一切响应都是井心位置的纯函数，零砖级状态）：
// - 下陷：坑心砖沿 -z 陷入 ≤DEPTH（透视自然变小变远）
// - 坡斜：坑壁砖沿碗坡朝坑心倾 ≤TILT°（坑底经中心阻尼放平）
// - 聚拢：材料向坑心微聚 ≤PULL px（坑心缝受压闭合、坑缘缝拉开）
// - 透光：井深处砖面 opacity 渐降 ≤FADE——墙后真灯光从砖体渗出
//
// 门控继承：hover+fine 且非 RM 才接管；触屏/RM/无 JS = 静态 tile
// 就是那一层砖。只写 transform / opacity；弹簧收敛即停帧。

import { useEffect, useRef } from 'react';
import { listenMql } from '@/lib/listen-mql';

const RADIUS = 200; // 重力井影响半径（px）
const DEPTH = 16; // 坑心最大下陷（px，-z；perspective 600 下约 2.6% 透视缩）
const PULL = 3; // 向坑心最大聚拢（px）——对向砖合拢 ≤ 缝宽，坑心缝闭合不互叠
const SHRINK = 0.05; // 微缩上限（比例）——保证坑内砖四周缝隙可见透光
const TILT = 15; // deg — 碗壁坡度倾斜上限（绕砖心，无铰链/背面问题）
const FADE = 0.25; // 井心砖面透明度降幅——陷得越深，墙后灯光渗出越多
const STIFFNESS = 120; // 井心弹簧 — 跟手且带一点余韵
const DAMPING = 18; // ζ≈0.82
const REST_EPS = 0.05; // px — 位置停帧阈（亚像素）
const REST_V_EPS = 0.5; // px/s — 速度停帧阈：沿用 0.05 档要多空转 ~0.8s 才停帧，0.5 无可见差
const MAX_DT = 0.033; // 秒 — tab 切回防积分爆炸

export default function WallBricks() {
  const lampRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lamp = lampRef.current;
    const grid = gridRef.current;
    if (!lamp || !grid) return;
    // closest 而非 parentElement：将来若中间包一层 div，data-live 挂错
    // 节点会导致 tile 不隐藏 → 双层砖（单层砖纪律的静默破坏路径）
    const wall = grid.closest<HTMLElement>('.bp-wall'); // data-live 切换静态 tile

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
    // left/top 建时写死（一次布局），逐帧只写 transform/opacity
    const build = () => {
      if (!wall) {
        // 挂错节点时 data-live 落不下——宁可不建砖，不破单层砖纪律
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
          b.className = 'bp-brick';
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
      wall.dataset.live = ''; // 接管：静态 tile 隐藏，真砖上场（wall 非空由 build 首行守卫保证）
      ready = true;
    };

    // 依当前井心落样式：灯 + 全砖扫描（平方距离先筛，圈外双零跳过）
    const render = () => {
      lamp.style.transform = `translate3d(${lx.toFixed(2)}px, ${ly.toFixed(2)}px, 0)`;
      lamp.style.opacity = li.toFixed(3);
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

    // 离开窗口 = 井撤压 + 灯熄灭：强度归零，一根弹簧带全部砖归位
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
      if (wall) delete wall.dataset.live; // 静态 tile 复位
      lamp.style.opacity = '';
      lamp.style.transform = '';
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

  // lamp 画在砖层下（z auto < face/grid z1）——层序由 z-index 决定
  return (
    <>
      <div ref={lampRef} className="bp-wall-lamp" />
      <div ref={gridRef} className="bp-wall-grid" />
    </>
  );
}
