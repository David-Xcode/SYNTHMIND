'use client';

// ─── 真砖重力井 · Graphite Wall v9（错缝砌体）───
// BlueprintWall 的动态层：指针 = 压在石墨砌体上的重力井。
// **墙后没有任何发光体**（v6 的指针灯已退役）——本组件只推砖，不点灯。
//
// 砌法（v9）：**running bond 半砖错缝**。偶行右移半砖并在左端补一块
// （被 .bp-wall-grid 的 contain:paint 裁掉溢出部分）；奇行不移。
// 🚨 相位必须与 globals.css 的 .bp-wall-face 同相（那里层 A 铺奇行、
// 层 B 偏移 (P/2, Q) 铺偶行）——错一处则接管瞬间整墙平移半砖。
//
// 砖 + 砖床两层（v6「单层砖」的 v8 修订，v9 沿用）：
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
// - **深压（v9 新增）**：鼠标按下时 li 目标由 1 抬到 PRESS，走同一根弹簧
//
// 门控继承：hover+fine 且非 RM 才接管；触屏/RM/无 JS = 静态 tile
// （砖床 + 砖两层叠加，同样是错缝）就是那面墙。只写 transform / opacity；
// 弹簧收敛即停帧。
//
// 几何事实源：CSS 的 --wall-brick-h（行高 Q）**唯一**，P = 3Q、S = Q/12
// 由本组件派生（v9 spec §1）。JS 只读不定，唯一例外是 MAX_BRICKS 封顶时
// 把放大后的 Q 内联写回 .bp-wall——静态砖床 tile 的 background-size 是
// calc(var(--wall-brick-h) * …)，两条路径因此始终同档、几何不错位。

import { useEffect, useRef } from 'react';
import { listenMql } from '@/lib/listen-mql';

// 砖数硬上限 —— globals.css 的 pitch 阶梯只按 min-width 分档，**不看高度**：
// 竖屏/超高视口不受任何约束。护栏的成本模型是**按 DOM 节点数**（砖自己不
// layout，但会让别人触发的每次全文档 layout 变贵），所以砖变大时阈值不跟着
// 放大，只重新确认它仍够得着：v9 几何下 1920×1080 = 207 块、3440×1440 = 330、
// 竖置 4K(2160×3840) = 800、竖置 5K(2880×5120) = 1044。
// 900 让竖置 5K 及更极端的高瘦视口真实触发（护栏保持可验证），
// 而 v8 立项时那个病态场景（竖置 4K，当年 2691 块）在新几何下天然合规。
const MAX_BRICKS = 900;

// ── 井的长度参数：全部写成行高 Q 的倍数 ⇒ 尺度无关 ──
// 各 pitch 档（60/72/96）与封顶档的观感完全一致，不再像 v8 那样
// 倾角实际峰值随档漂移（8.47°/7.41°/4.94°）。
const RADIUS_Q = 3.5; // 影响半径 = 3.5Q（基准档 210px）
const DEPTH_Q = 0.75; // 坑心最大下陷 = 0.75Q（基准档 45px）
const PULL_Q = 0.06; // 向坑心最大聚拢 = 0.06Q（基准档 3.6px）
const PERSP_Q = 10; // per-element perspective = 10Q ⇒ 透视缩比例各档恒定

const TILT = 20; // deg — 碗壁坡度倾斜**上限**（绕砖心，无铰链/背面问题）。
// 实际峰值 = TILT·(1 − H/R)² = TILT·(1 − (11/12)/3.5)² = **10.90°**，
// 因全部参数同比于 Q，这个峰值**不随 pitch 档变**（v8 的痼疾）。
// 砖角抬升的力臂是半对角 √(W²+H²)/2 = 1.52866·Q（基准档 91.72px，不是半宽）。
// 保证式化为尺度无关的一条不等式（v9 spec §5.1）：
//   DEPTH/Q > (halfDiag/Q)·TILT·π/180 → 0.75 > 1.52866×20×π/180 = 0.534 ✓
// ⇒ z_角 ≈ −13.18·u² px 对所有 u>0 严格 <0：**没有任何砖会凸到墙面之前**。
// 深压（li>1）只让不等式更宽松：沉降项 ∝ li 线性、抬升项 ∝ sin(·) 次线性。
const SHRINK = 0.05; // 微缩上限（比例）——与透视缩合计，缝张开露槽底
const FADE = 0.4; // 井心砖面透明度降幅——陷得越深，露出的砖床槽底越多 = 越暗
const PRESS = 1.3; // 鼠标按下时的 li 目标（v9）；抬起回 1，离场回 0
const STIFFNESS = 130; // 井心弹簧 — ω 11.40
const DAMPING = 19; // ζ≈0.833，过冲 0.9%：跟手但不弹跳（90% 上升 0.333→0.253s）
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
// （错缝下偶行的 c 从 −1 起，负数分支是**常态**不是边角情况）
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
    // 砖心坐标建时预存（错缝下每行砖数不同，i%cols 的行列反推**失效**；
    // 顺带省掉逐砖逐帧一次取模 + 一次除法）
    let cxs = new Float32Array(0);
    let cys = new Float32Array(0);
    let lastW = new Float32Array(0); // 上帧井权重 — 双零跳过（圈外砖零成本）
    let cols = 0;
    let rows = 0;
    let pitchX = 0;
    let pitchY = 0;
    let faceH = 0; // 砖面**短边** = damp 的尺度（见下方 render 注释）
    let radius = 0;
    let depth = 0;
    let pullMax = 0;
    let perspPrefix = '';
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
    let pressed = false; // 鼠标按住中 → 井目标强度 PRESS
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
      // 先撤上次的封顶覆写再读 —— 否则读到的是已放大的 Q，
      // 每次 resize 都在上一次的封顶值上再封一次，逐轮复合放大
      wall.style.removeProperty('--wall-brick-h');
      const q0 = Number.parseFloat(
        getComputedStyle(grid).getPropertyValue('--wall-brick-h'),
      );
      if (!q0) {
        buildFailed = true; // 放弃增强，静态 tile 原样；不再重试
        return;
      }
      // clientWidth/Height = .bp-wall（fixed inset:0）的真实盒；
      // innerWidth 含经典滚动条，会白铺一列压在滚动条槽下
      const cw = document.documentElement.clientWidth;
      const ch = document.documentElement.clientHeight;
      // 砖数 = rows·cols + 偶行左端各补的那一块（错缝）
      const countAt = (q: number) => {
        const c = Math.ceil(cw / (3 * q));
        const r = Math.ceil(ch / q);
        return r * c + Math.ceil(r / 2);
      };

      // 高度维度的封顶（阶梯只有 min-width 两档，管不到竖屏/超高视口）：
      // 按面积比一次放大到位，再逐档兜住 cols/rows 双 ceil 的取整溢出
      // （砖数对 Q 单调不增，循环必然收敛）。
      // 🚨 Q 必须留在 12 的倍数上：S = Q/12 落到分数位会让真砖 DOM 与
      // 静态 tile 的栅格化方式分叉，砖缘织出半像素抗锯齿差（v8 旧病）
      let q = q0;
      if (countAt(q) > MAX_BRICKS) {
        q = Math.ceil((q * Math.sqrt(countAt(q) / MAX_BRICKS)) / 12) * 12;
        while (countAt(q) > MAX_BRICKS) q += 12;
        // 写在 .bp-wall 上而非 grid：静态砖床 .bp-wall-face 是 grid 的
        // **兄弟**节点，只有挂到共同祖先才继承得到，否则床 tile 与真砖错位
        wall.style.setProperty('--wall-brick-h', `${q}px`);
      }

      const nextPitchX = q * 3;
      const nextCols = Math.ceil(cw / nextPitchX);
      const nextRows = Math.ceil(ch / q);
      // 短路：档位与行列数一个没变（滚动条出现/消失、1px 抖动）→ 现有砖阵
      // 原样留用，不为零变化重造几百个 div
      if (ready && q === pitchY && nextCols === cols && nextRows === rows)
        return;

      pitchY = q;
      pitchX = nextPitchX;
      const seam = q / 12;
      const faceW = pitchX - seam;
      faceH = pitchY - seam;
      radius = RADIUS_Q * q;
      depth = DEPTH_Q * q;
      pullMax = PULL_Q * q;
      perspPrefix = `perspective(${PERSP_Q * q}px) `;
      cols = nextCols;
      rows = nextRows;

      const total = rows * cols + Math.ceil(rows / 2);
      grid.textContent = '';
      bricks = new Array<HTMLDivElement>(total);
      cxs = new Float32Array(total);
      cys = new Float32Array(total);
      lastW = new Float32Array(total);
      const frag = document.createDocumentFragment();
      let i = 0;
      for (let r = 0; r < rows; r++) {
        // 错缝：偶行右移半砖并从 c = −1 起（左端补一块，溢出由 contain:paint 裁）
        const even = (r & 1) === 0;
        const shift = even ? pitchX / 2 : 0;
        const top = r * pitchY + seam;
        for (let c = even ? -1 : 0; c < cols; c++) {
          const left = c * pitchX + seam + shift;
          const b = document.createElement('div');
          b.className = `bp-brick${variantOf(c, r)}`;
          b.style.left = `${left}px`;
          b.style.top = `${top}px`;
          b.style.width = `${faceW}px`;
          b.style.height = `${faceH}px`;
          frag.appendChild(b);
          bricks[i] = b;
          cxs[i] = left + faceW / 2;
          cys[i] = top + faceH / 2;
          i++;
        }
      }
      grid.appendChild(frag);
      wall.dataset.live = ''; // 接管：静态砖层撤下只留砖床，真砖阵上场
      ready = true;
    };

    // 依当前井心落样式：全砖扫描（平方距离先筛，圈外双零跳过）
    const render = () => {
      const r2 = radius * radius;
      for (let i = 0; i < bricks.length; i++) {
        const dx = cxs[i] - lx;
        const dy = cys[i] - ly;
        const d2 = dx * dx + dy * dy;
        let w = 0;
        let d = 1; // ||1 = 井心恰落砖心时方向向量的除零守卫
        if (d2 < r2) {
          d = Math.sqrt(d2) || 1;
          w = (1 - d / radius) ** 2 * li;
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
        // per-element perspective 不建 preserve-3d 链。
        // 🚨 damp 的分母是砖面**短边** faceH：长砖用长边会让 damp 在
        // d < W(=2.92Q) 全程 <1，而 R 只有 3.5Q ⇒ 井里处处被压制、坡度读不出来
        const damp = Math.min(1, d / faceH);
        const ux = dx / d;
        const uy = dy / d;
        const pull = pullMax * w * damp;
        const tilt = TILT * w * damp;
        // 倾角趋零时略去 rotate3d——顺带规避零向量轴让老 WebKit
        // 整条 transform 失效的历史坑
        const rot =
          tilt < 0.01
            ? ''
            : `rotate3d(${uy.toFixed(4)}, ${(-ux).toFixed(4)}, 0, ${tilt.toFixed(2)}deg) `;
        bricks[i].style.transform =
          perspPrefix +
          `translate3d(${(-ux * pull).toFixed(2)}px, ${(-uy * pull).toFixed(2)}px, ${(-depth * w).toFixed(2)}px) ` +
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
      // 上限是 PRESS 而非 1：深压期 li 要能升到 1.3（几何安全性见 TILT 注释）
      li = Math.min(PRESS, Math.max(0, li + vi * dt));
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
      // 🚨 不能无条件写 1：按住鼠标拖动时每次 pointermove 都会取消深压
      ti = pressed ? PRESS : 1;
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

    // 深压（v9）：按下加深、抬起回落，都只改同一根弹簧的目标值。
    // ti > 0 守卫 = 井已在场才响应；未建砖时按下不空转一轮 rAF
    const onDown = (e: PointerEvent) => {
      if (disposed || e.pointerType === 'touch') return;
      pressed = true;
      if (ti > 0) {
        ti = PRESS;
        kick();
      }
    };
    const onUp = () => {
      if (disposed || !pressed) return;
      pressed = false;
      if (ti > 0) {
        ti = 1;
        kick();
      }
    };

    // 离开窗口 = 井撤压：强度归零，一根弹簧带全部砖归位
    const onLeave = () => {
      pressed = false; // 拖出窗口时 pointerup 可能永不到达，此处一并清
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
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', onResize);
      window.clearTimeout(resizeTimer);
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      bricks = [];
      grid.textContent = '';
      if (wall) {
        delete wall.dataset.live; // 静态砖层复位（砖床原样）
        // 封顶覆写一并撤销：静态 tile 回到 CSS 阶梯档
        wall.style.removeProperty('--wall-brick-h');
      }
    };

    // 会话中途开启 reduced-motion → 拆除真砖，回到静态 tile
    // 能力判定单向（同 HeroObjectPhysics）：中途关闭 RM 不重建，导航后自愈
    const unlistenReduced = listenMql(reducedMotion, (e) => {
      if (e.matches) teardown();
    });

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    window.addEventListener('pointercancel', onUp, { passive: true });
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
