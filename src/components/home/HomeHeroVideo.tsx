'use client';

// ─── Hero 视频背景 · Neural ───
// 双视频暗场过渡：cosmic-threads（金色球体）→ hero-bg（网格动画）→ 循环
// 不使用 HTML loop 属性，状态机自行控制播放顺序和时机
// 每次进入展示 phase 时 currentTime=0 → 保证视频从头播放，避免闪帧

import { useEffect, useRef, useState } from 'react';

// 每个视频展示时长 (ms)
const DISPLAY_DURATION = 8000;
// 淡出/淡入时长 (ms) — 与 CSS transition-duration 匹配
const FADE_DURATION = 2000;
// 淡出后暗场停留 (ms)
const DARK_PAUSE = 500;

export default function HomeHeroVideo() {
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);

  // phase 0: 视频A展示 | 1: 淡出(暗场过渡) | 2: 视频B展示 | 3: 淡出(暗场过渡)
  const [phase, setPhase] = useState(0);
  // 第二视频是否已就绪（canplaythrough），未就绪前停留在 phase 0
  const [ready, setReady] = useState(false);

  // 延迟加载第二个视频，用 canplaythrough 事件判断就绪
  useEffect(() => {
    const video = videoBRef.current;
    if (!video) return;

    const onReady = () => setReady(true);
    video.addEventListener('canplaythrough', onReady, { once: true });

    // 延迟设置 src，避免与首屏视频争带宽
    const timer = setTimeout(() => {
      video.src = '/hero-bg.mp4';
      video.load();
    }, 2000);

    return () => {
      clearTimeout(timer);
      video.removeEventListener('canplaythrough', onReady);
    };
  }, []);

  // 状态机推进：每个 phase 对应一个 setTimeout，依赖变化自动清理
  useEffect(() => {
    // 视频B未就绪时，停留在 phase 0 不轮播
    if (!ready && phase === 0) return;

    const durations = [
      DISPLAY_DURATION,              // phase 0: 视频A展示 8s
      FADE_DURATION + DARK_PAUSE,    // phase 1: 淡出 2s + 暗场 0.5s
      DISPLAY_DURATION,              // phase 2: 视频B展示 8s
      FADE_DURATION + DARK_PAUSE,    // phase 3: 淡出 2s + 暗场 0.5s
    ];

    const timer = setTimeout(() => {
      setPhase((p) => (p + 1) % 4);
    }, durations[phase]);

    return () => clearTimeout(timer);
  }, [phase, ready]);

  // 播放控制：进入展示 phase 时 reset 到开头再播放，淡出阶段延迟暂停
  useEffect(() => {
    const a = videoARef.current;
    const b = videoBRef.current;

    if (phase === 0) {
      // 视频A从头播放，暂停B
      if (a) {
        a.currentTime = 0;
        a.play().catch(() => {});
      }
      b?.pause();
    } else if (phase === 1) {
      // 视频A正在淡出，等淡出完成再暂停A（避免冻帧）
      const t = setTimeout(() => a?.pause(), FADE_DURATION);
      return () => clearTimeout(t);
    } else if (phase === 2) {
      // 视频B从头播放，暂停A
      if (b) {
        b.currentTime = 0;
        b.play().catch(() => {});
      }
      a?.pause();
    } else {
      // phase 3: 视频B正在淡出，等淡出完成再暂停B
      // 不提前 play 视频A — 等 phase 0 再 play，配合 currentTime=0 从头开始
      const t = setTimeout(() => b?.pause(), FADE_DURATION);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // 视频透明度：仅在对应展示 phase 时可见
  const videoAOpacity = phase === 0 ? 'opacity-[0.15]' : 'opacity-0';
  const videoBOpacity = phase === 2 ? 'opacity-[0.15]' : 'opacity-0';

  return (
    <>
      {/* 视频 A — cosmic-threads 金色球体 (2.9M)，首先展示 */}
      <video
        ref={videoARef}
        autoPlay
        muted
        playsInline
        preload="auto"
        poster="/cosmic-threads-poster.jpg"
        className={`absolute inset-0 w-full h-full object-cover pointer-events-none motion-reduce:hidden transition-opacity duration-[2000ms] ease-in-out ${videoAOpacity}`}
        aria-hidden="true"
      >
        <source src="/cosmic-threads.mp4" type="video/mp4" />
      </video>

      {/* 视频 B — hero-bg 网格动画 (1.9M)，延迟加载 */}
      <video
        ref={videoBRef}
        muted
        playsInline
        preload="none"
        className={`absolute inset-0 w-full h-full object-cover pointer-events-none motion-reduce:hidden transition-opacity duration-[2000ms] ease-in-out ${videoBOpacity}`}
        aria-hidden="true"
      />
    </>
  );
}
