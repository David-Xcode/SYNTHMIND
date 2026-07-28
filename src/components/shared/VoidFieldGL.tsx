'use client';

// ─── 深空引力场 · 实时层（Void Field v1）───
// VoidField 的动态层：指针 = 压在空间上的引力井。
// 正本 = docs/superpowers/specs/2026-07-27-void-field-v1-deep-space-design.md
//
// 宇宙是静的，唯一的运动来自你施加的引力：shader 无 uTime，指针不动时
// 画面上没有任何东西需要重画。**空闲成本不是「很低」是「不存在」**——
// 零 rAF、零 GPU 提交、零主线程。
// ⚠️ 措辞校正（审查后）：砖墙时代不再需要的是「视口门控 / 桌面专属」这类
// **补救**条款（背景自己不动，没有需要门控的自发动画）；**停帧本身仍然是
// 零空闲成本的实现手段**——收敛即停帧（frame 末尾）与标签页隐藏即停帧
// 都必须保留，别把本段读成可以删掉它们。
//
// 状态量：全局 2 根弹簧（井心 vec2 + 强度标量），半隐式欧拉。
// 空间扭曲全在 shader 里，**零逐元素状态**——比砖墙重力井更彻底：
// 那里形变的对象好歹还是 div，这里连元素都没有。
// 逐帧主线程写入 = 3 个 uniform + 1 次 drawArrays。
//
// 井心弹簧刻意偏软（K_HOLE = 9，ω = 3 rad/s）：快速拖动时井心明显滞后
// 于指针，读作「这个东西有质量」。核心体感是**惯性**，不是位置跟随。
//
// 门控（spec §8 降级链 3/4 级）：hover+fine 且非 RM 且非强制配色才装配
// canvas；触屏 / RM / forced-colors / 无 JS / 无 WebGL2 一律走
// .void-field-still 静态帧。
// ⚠️ 媒体查询**动态双向**监听：外接鼠标、系统偏好切换都会在运行时改变
// 判定结果（比砖墙时代的「RM 单向拆除」更严，见 spec §8 的 ⚠️）。
//
// SSR 输出为 null —— canvas 在挂载后由本组件创建并插入，无 JS 时不留
// 一个空白 canvas 压在静态帧上（spec §2.3）。

import { useEffect } from 'react';
import { listenMql } from '@/lib/listen-mql';
import {
  C_HOLE,
  C_STR,
  DPR_CAP,
  DT_MAX,
  FRAG_SRC,
  K_HOLE,
  K_STR,
  REST_EPS_POS,
  REST_EPS_VEL,
  S_IDLE,
  S_PRESS,
  S_RESNAP,
  TRI_VERTS,
  VERT_SRC,
} from '@/lib/void-field-shader';

export default function VoidFieldGL() {
  useEffect(() => {
    // 宿主用选择器而非 ref：SSR 输出为 null ⇒ 本组件没有自己的 DOM 节点可挂。
    // 全站单实例纪律（(public)/layout 与 not-found 各挂一次，永不同时）保证
    // 这里恒定命中唯一那个。取**最后**一个匹配：路由过渡若出现新旧两棵树
    // 短暂共存，新岛必须挂到后进入 DOM 的那个宿主上，否则 canvas 会挂进
    // 即将被卸载的旧宿主 → 背景永久静止且无任何报错
    const hosts = document.querySelectorAll<HTMLElement>('.void-field');
    const host = hosts[hosts.length - 1];
    if (!host) {
      // 与其余降级路径同口径：记录不抛。没有这行的话，class 名一旦被改
      // 增强会静默消失、零信号
      console.error(
        '[VoidField] host .void-field not found — enhancement skipped',
      );
      return;
    }

    const capable = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    // 强制配色（Windows 高对比度）下 UA 不重绘 background-image，更管不到
    // canvas 像素：背景是纯装饰，此时整层让位比画一片系统配色管不着的深空好
    const forced = window.matchMedia('(forced-colors: active)');

    let disposed = false;
    let live = false; // GL 是否已装配（setup/shutdown 可重入的闩）
    let failed = false; // 无 WebGL2 / 编译失败 —— 不再重试，静态帧原样
    let ctxLost = false; // GPU 上下文丢失中：所有 GL 提交短路

    // ── GL 资源 ──
    let canvas: HTMLCanvasElement | null = null;
    let gl: WebGL2RenderingContext | null = null;
    let program: WebGLProgram | null = null;
    let vao: WebGLVertexArrayObject | null = null;
    let vbo: WebGLBuffer | null = null;
    let uHole: WebGLUniformLocation | null = null;
    let uStrength: WebGLUniformLocation | null = null;
    let uRes: WebGLUniformLocation | null = null;

    // ── 弹簧状态（坐标系 = shader 的 p：原点屏心、单位视口高、y 向上）──
    let hx = 0;
    let hy = 0;
    let vhx = 0;
    let vhy = 0;
    let thx = 0;
    let thy = 0;
    let s = 0;
    let vs = 0;
    let ts = 0;
    let hasPointer = false;
    let pressed = false;

    let cssW = 0;
    let cssH = 0;
    let rafId = 0;
    let resizeRaf = 0;
    let lastTime = 0;
    let unlistenDpr = () => {};

    const compile = (type: number, src: string) => {
      if (!gl) return null;
      const sh = gl.createShader(type);
      if (!sh) return null;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        // spec §8 第 2 级：记录不抛 —— 抛出会经 ErrorBoundary 打掉整个岛，
        // 而静态帧本来就是完整画面，没有必要把错误升级成可见故障
        console.error(
          '[VoidField] shader compile failed:',
          gl.getShaderInfoLog(sh),
        );
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };

    // canvas 像素尺寸对齐 CSS 盒 × DPR（上限 1.5——全屏平滑渐变不需要 3×）。
    // 返回是否真的改了尺寸：未变则不重设，避免无谓的帧缓冲重分配。
    // 🚨 量的是**宿主**不是 canvas 自己：CSS 的 :not([data-live]) 规则让 canvas
    // 在装配期间就是 display:none，`canvas.clientWidth` 因此恒为 0 —— 兜底的
    // documentElement 分支会悄悄变成主路径，读到的是**含滚动条**的文档宽
    // （实测装配期 1429 vs 恢复后 1440，画面整体错位 11px）。宿主 .void-field
    // 是 fixed inset:0 且始终可见，与 canvas 应有的盒逐像素相同
    const resize = () => {
      if (!gl || !canvas) return false;
      const cw = host.clientWidth || document.documentElement.clientWidth;
      const ch = host.clientHeight || document.documentElement.clientHeight;
      cssW = cw;
      cssH = ch;
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      const w = Math.max(1, Math.round(cw * dpr));
      const h = Math.max(1, Math.round(ch * dpr));
      if (canvas.width === w && canvas.height === h) return false;
      canvas.width = w;
      canvas.height = h;
      syncViewport();
      return true;
    };

    // 视口与 uRes 一起写：两者必须同源，且**不能只在尺寸变化时写**。
    // 🚨 新链接的 program 所有 uniform 初值为 0，而上下文丢失不改变 canvas 的
    // width/height（那是 DOM 属性）——若只靠 resize() 的「尺寸变了才写」，
    // 恢复路径会带着 uRes=vec2(0) 跑，shader 第一行 /uRes.y 即除零 ⇒ 整屏 NaN，
    // 且此时静态帧已被 data-live 撤下，用户只能盯着坏帧直到手动改窗口大小
    function syncViewport() {
      if (!gl || !canvas) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    }

    const draw = () => {
      if (!gl || ctxLost) return;
      gl.uniform2f(uHole, hx, hy);
      gl.uniform1f(uStrength, s);
      // 全屏三角形覆盖每一个像素 ⇒ 不需要 clear
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    // 半隐式欧拉一步积分（HeroObjectPhysics 同款）
    const frame = (time: number) => {
      if (disposed || !live) return;
      const dt = Math.max(0, Math.min((time - lastTime) / 1000, DT_MAX));
      lastTime = time;

      vhx += (-K_HOLE * (hx - thx) - C_HOLE * vhx) * dt;
      vhy += (-K_HOLE * (hy - thy) - C_HOLE * vhy) * dt;
      vs += (-K_STR * (s - ts) - C_STR * vs) * dt;
      hx += vhx * dt;
      hy += vhy * dt;
      const sNext = s + vs * dt;
      s = Math.max(0, Math.min(S_PRESS, sNext));
      // 钳位真咬住时把速度一并清零：否则残余速度会顶着边界空转。
      // 当前 ζ=0.9 下过冲仅 ~0.001，几乎不触发——留着是为了有人调低 Z_STR 时不塌
      if (s !== sNext) vs = 0;

      // 位置与速度**量纲不同**（vh vs vh/s），必须分开判据
      const settled =
        Math.abs(hx - thx) < REST_EPS_POS &&
        Math.abs(hy - thy) < REST_EPS_POS &&
        Math.abs(s - ts) < REST_EPS_POS &&
        Math.abs(vhx) < REST_EPS_VEL &&
        Math.abs(vhy) < REST_EPS_VEL &&
        Math.abs(vs) < REST_EPS_VEL;
      if (settled) {
        hx = thx;
        hy = thy;
        s = ts;
        vhx = vhy = vs = 0;
      }
      draw();
      // 收敛即停帧并置空句柄；下一次 pointermove / pointerdown / resize 重起
      rafId = settled ? 0 : requestAnimationFrame(frame);
    };

    const kick = () => {
      if (disposed || !live || ctxLost || rafId) return;
      lastTime = performance.now();
      rafId = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      if (!live) return;
      // 设备级门控（hover+fine）挡不住混合触屏笔记本的手指——事件级再滤
      if (e.pointerType === 'touch') return;
      if (!cssH) return;
      thx = (e.clientX - cssW / 2) / cssH;
      // y 翻转：clientY 原点左上向下，shader 的 p 原点屏心向上
      thy = (cssH / 2 - e.clientY) / cssH;
      // 🚨 从事件的 buttons 位派生而非读自有闩：拖出窗口再拖回时熄灭逻辑已把
      // pressed 清掉，若沿用闩，用户明明还按着键、井却回到浅档并卡在那里
      pressed = (e.buttons & 1) !== 0;
      ts = pressed ? S_PRESS : S_IDLE;
      if (!hasPointer || s < S_RESNAP) {
        // 冷井原地浮现（首现或熄灭后的再入）：井心瞬移到指针，不从旧位置
        // 横穿视口飞掠；仍可见的井（快速离-回）保持弹簧连续滑动
        hasPointer = true;
        hx = thx;
        hy = thy;
        vhx = vhy = 0;
      }
      kick();
    };

    const onDown = (e: PointerEvent) => {
      // 🚨 只认主键：onMove 是按 `buttons & 1` 派生 pressed 的，这里若放行
      // 右键/中键，井会先加深、再被下一个 pointermove 的派生值打回浅档，
      // 读作一次莫名的闪烁（两处对同一状态的定义必须一致）
      if (!live || e.pointerType === 'touch' || (e.buttons & 1) === 0) return;
      pressed = true;
      // ts > 0 守卫 = 井已在场才响应
      if (ts > 0) {
        ts = S_PRESS;
        kick();
      }
    };

    const onUp = (e: PointerEvent) => {
      if (!live || e.pointerType === 'touch' || !pressed) return;
      pressed = false;
      if (ts > 0) {
        ts = S_IDLE;
        kick();
      }
    };

    // 熄灭井：强度归零，画面回到无任何引力痕迹的深空。
    // 抽成无事件语义的内部动作 —— 它有三个来源（指针离开文档 / 窗口失焦 /
    // 页面隐藏），只有第一个带 PointerEvent
    const extinguish = () => {
      if (!live) return;
      pressed = false; // 拖出窗口时 pointerup 可能永不到达，此处一并清
      ts = 0;
      kick();
    };

    // 🚨 触屏指针要过滤：规范规定不支持 hover 的指针在 pointerup 后**必须**
    // 补发 pointerleave。混合触屏笔记本（hover+fine 门控放行）上，手指碰一下
    // 屏幕就会把鼠标那口井整个熄灭 —— 鼠标明明还停在页面上。
    // 与 onMove / onDown / onUp 的事件级 touch 过滤同一纪律
    const onPointerLeave = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      extinguish();
    };

    const onBlur = () => extinguish();

    // 隐藏即停帧，并把弹簧直接吸附到归零态；**重绘留到回来时做**——页面隐藏
    // 期间的 draw 是否能到达合成器是引擎相关的（preserveDrawingBuffer:false），
    // 押在那上面可能让人切回来看到被冻住的旧井
    const onVisibility = () => {
      if (!live) return;
      if (document.visibilityState === 'hidden') {
        pressed = false;
        hasPointer = false;
        ts = 0;
        s = 0;
        vs = 0;
        vhx = vhy = 0;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = 0;
        return;
      }
      draw(); // 单帧，不起 rAF —— 零空闲成本的承诺不受影响
    };

    const onResize = () => {
      if (disposed || !live || resizeRaf) return;
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = 0;
        if (disposed || !live) return;
        if (resize()) draw(); // 尺寸没变则一帧都不画
      });
    };

    // 宿主盒观察器 —— `window.resize` 盖不住**滚动条出现/消失**（视口没变，
    // 可用宽度变了 11px 左右），而站内导航到长短不同的页面天天在触发它。
    // 不跟进的话缓冲与 CSS 盒错配、被浏览器拉伸，DITHER 又一次被插值抹平。
    // 与 window.resize 并存：老内核没有 ResizeObserver 时仍有兜底，
    // 两者重复触发也无害（resize() 尺寸没变就返回 false，一帧都不画）
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver === 'function') {
      ro = new ResizeObserver(onResize);
    }

    // DPR 变化（把窗口拖到另一块不同 DPI 的屏）通常**不伴随 resize 事件**：
    // CSS 视口尺寸没变，变的只是后备缓冲该有的分辨率。不跟进的话画面被浏览器
    // 拉伸，逐设备像素的 DITHER 被插值抹平 —— 恰好废掉 spec 说「不可删」的
    // 那道防色带措施。`(resolution: Xdppx)` 是一次性匹配，每次触发后重新武装
    const watchDpr = () => {
      unlistenDpr();
      const mql = window.matchMedia(
        `(resolution: ${window.devicePixelRatio}dppx)`,
      );
      unlistenDpr = listenMql(mql, () => {
        if (disposed || !live) return;
        if (resize()) draw();
        watchDpr();
      });
    };

    // GPU 上下文丢失（切换显卡 / 驱动重置 / 系统休眠）：撤 data-live 让静态帧
    // 原地复位（canvas 由 CSS 的 :not([data-live]) 一并隐藏，不依赖「死 canvas
    // 合成为透明」这种未定义行为），恢复后重建全部资源。
    // 🚨 不能在这里置 live = false —— shutdown() 的首行守卫会因此提前返回，
    // 卸载时反而漏掉 canvas 与监听器。用独立的 ctxLost 闩短路 GL 提交
    const onContextLost = (e: Event) => {
      e.preventDefault();
      ctxLost = true;
      delete host.dataset.live;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    };

    const onContextRestored = () => {
      if (disposed || !canvas) return;
      // 资源句柄全部随旧上下文失效，重新装配一遍
      if (!initGL()) {
        // 🚨 恢复失败必须走完整拆除：否则 live 仍为 true、gl 指向死上下文、
        // canvas 还压在 z2，而 setup() 的 `if (live) return` 让 mql 再也
        // 修不回来 —— 一个没有任何报错的永久僵死态
        failed = true;
        shutdown();
        return;
      }
      ctxLost = false;
      syncViewport(); // initGL 已写一次，这里是尺寸可能同时变过的兜底
      resize();
      draw();
      host.dataset.live = '';
      if (hasPointer) kick();
    };

    // 在已有的 canvas 上（重新）建立 GL 上下文与全部资源。失败返回 false
    function initGL() {
      if (!canvas) return false;
      const ctx = canvas.getContext('webgl2', {
        antialias: false,
        alpha: false,
        powerPreference: 'high-performance',
      });
      if (!ctx) {
        console.error('[VoidField] WebGL2 unavailable — static frame retained');
        return false;
      }
      gl = ctx;

      const vs0 = compile(gl.VERTEX_SHADER, VERT_SRC);
      const fs0 = compile(gl.FRAGMENT_SHADER, FRAG_SRC);
      // 半成功也要清干净：只有一支编译通过时，另一支的对象否则泄漏到 GC
      if (!vs0 || !fs0) {
        if (vs0) gl.deleteShader(vs0);
        if (fs0) gl.deleteShader(fs0);
        return false;
      }
      const prog = gl.createProgram();
      if (!prog) {
        gl.deleteShader(vs0);
        gl.deleteShader(fs0);
        return false;
      }
      gl.attachShader(prog, vs0);
      gl.attachShader(prog, fs0);
      gl.linkProgram(prog);
      // shader 对象链接后即可释放 —— program 自己持有编译产物
      gl.deleteShader(vs0);
      gl.deleteShader(fs0);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.error(
          '[VoidField] program link failed:',
          gl.getProgramInfoLog(prog),
        );
        gl.deleteProgram(prog);
        return false;
      }
      program = prog;
      // biome-ignore lint/correctness/useHookAtTopLevel: gl.useProgram 是 WebGL API 不是 React hook——该规则纯按 `use` 前缀识别，此处为误报
      gl.useProgram(program);

      vao = gl.createVertexArray();
      gl.bindVertexArray(vao);
      vbo = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      gl.bufferData(gl.ARRAY_BUFFER, TRI_VERTS, gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(program, 'a');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

      uHole = gl.getUniformLocation(program, 'uHole');
      uStrength = gl.getUniformLocation(program, 'uStrength');
      uRes = gl.getUniformLocation(program, 'uRes');
      // 🚨 无条件写一次：resize() 在尺寸未变时会提前返回，恢复路径靠它就晚了
      syncViewport();
      return true;
    }

    // GL 侧资源释放 —— setup 失败与 shutdown 共用，避免两条路径各写一半
    const releaseGL = () => {
      if (gl) {
        gl.deleteProgram(program);
        gl.deleteBuffer(vbo);
        gl.deleteVertexArray(vao);
        // 显式释放上下文：浏览器对同时存活的 WebGL 上下文有硬上限（~16），
        // 不主动丢弃就要等 GC
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      }
      program = vbo = vao = null;
      uHole = uStrength = uRes = null;
      gl = null;
      if (canvas) {
        canvas.removeEventListener('webglcontextlost', onContextLost);
        canvas.removeEventListener('webglcontextrestored', onContextRestored);
        canvas.remove();
        canvas = null;
      }
      ctxLost = false;
    };

    const setup = () => {
      if (live || disposed || failed) return;
      canvas = document.createElement('canvas');
      canvas.className = 'void-field-gl';
      host.appendChild(canvas);
      canvas.addEventListener('webglcontextlost', onContextLost);
      canvas.addEventListener('webglcontextrestored', onContextRestored);

      if (!initGL()) {
        // 装配失败 = 永久放弃增强（不再随 mql 变化重试）；静态帧原样，
        // 用户看到的是完整画面，只丢引力井
        failed = true;
        releaseGL();
        return;
      }

      live = true;
      resize();
      // 🚨 先画空闲帧再落 data-live：反过来会露出 WebGL 默认清色（纯黑）
      // 一帧 —— 静态帧此刻已被 display:none 撤下
      draw();
      host.dataset.live = '';

      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerdown', onDown, { passive: true });
      window.addEventListener('pointerup', onUp, { passive: true });
      window.addEventListener('pointercancel', onUp, { passive: true });
      document.documentElement.addEventListener(
        'pointerleave',
        onPointerLeave,
        {
          passive: true,
        },
      );
      window.addEventListener('blur', onBlur, { passive: true });
      document.addEventListener('visibilitychange', onVisibility, {
        passive: true,
      });
      window.addEventListener('resize', onResize, { passive: true });
      ro?.observe(host);
      watchDpr();
    };

    function shutdown() {
      if (!live) return;
      live = false;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      document.documentElement.removeEventListener(
        'pointerleave',
        onPointerLeave,
      );
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', onResize);
      ro?.disconnect();
      unlistenDpr();
      unlistenDpr = () => {};
      if (rafId) cancelAnimationFrame(rafId);
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      rafId = 0;
      resizeRaf = 0;

      releaseGL();
      delete host.dataset.live; // 静态帧原地复位 = 完整画面

      // 弹簧归零：再次上线时从干净的深空起步，不复活上次那口井
      hx = hy = thx = thy = vhx = vhy = 0;
      s = ts = vs = 0;
      hasPointer = false;
      pressed = false;
    }

    // 能力判定**双向**：插上鼠标 / 关掉 reduced-motion 都会让引力井上线，
    // 反之拆除。与砖墙时代的单向拆除不同，见本文件头的 ⚠️
    const evaluate = () => {
      if (disposed) return;
      if (capable.matches && !reduced.matches && !forced.matches) setup();
      else shutdown();
    };

    const unlistenCapable = listenMql(capable, evaluate);
    const unlistenReduced = listenMql(reduced, evaluate);
    const unlistenForced = listenMql(forced, evaluate);
    evaluate();

    return () => {
      disposed = true;
      shutdown();
      unlistenCapable();
      unlistenReduced();
      unlistenForced();
    };
  }, []);

  return null;
}
