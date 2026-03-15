'use client';

// ─── Hero 视频背景 · Neural ───
// 提取自 HomeHero — 双视频暗场过渡背景
// 通过 next/dynamic ssr: false 加载，SSR HTML 中不含 <video>
// → 微信 WebView 无法在 hydration 前修改 video 属性 → 消除 hydration mismatch

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

  // 主动触发第一个视频播放（兼容微信 WebView / 旧版 iOS Safari）
  useEffect(() => {
    const video = videoARef.current;
    if (video) {
      video.play().catch(() => {});
    }
  }, []);

  // 延迟加载第二个视频，用 canplaythrough 事件判断就绪
  useEffect(() => {
    const video = videoBRef.current;
    if (!video) return;

    const onReady = () => setReady(true);
    video.addEventListener('canplaythrough', onReady, { once: true });

    // 延迟设置 src，避免与首屏视频争带宽
    const timer = setTimeout(() => {
      video.src = '/cosmic-threads.mp4';
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

  // 非活跃视频暂停播放，活跃视频恢复播放 — 节省解码资源
  // 淡出阶段(phase 1/3)：延迟暂停，等 CSS 过渡结束再 pause，避免冻帧
  useEffect(() => {
    const a = videoARef.current;
    const b = videoBRef.current;

    if (phase === 0) {
      a?.play().catch(() => {});
      b?.pause();
    } else if (phase === 1) {
      // 视频A正在淡出，等淡出完成再暂停A（避免冻帧）
      const t = setTimeout(() => a?.pause(), FADE_DURATION);
      return () => clearTimeout(t);
    } else if (phase === 2) {
      b?.play().catch(() => {});
      a?.pause();
    } else {
      // phase 3: 视频B正在淡出，启动A准备淡入，等淡出完成再暂停B
      a?.play().catch(() => {});
      const t = setTimeout(() => b?.pause(), FADE_DURATION);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // 视频透明度：仅在对应展示 phase 时可见
  const videoAOpacity = phase === 0 ? 'opacity-[0.15]' : 'opacity-0';
  const videoBOpacity = phase === 2 ? 'opacity-[0.15]' : 'opacity-0';

  return (
    <>
      {/* 视频 A — hero-bg (1.9M)，立即加载 */}
      <video
        ref={videoARef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/hero-bg-poster.jpg"
        className={`absolute inset-0 w-full h-full object-cover pointer-events-none motion-reduce:hidden transition-opacity duration-[2000ms] ease-in-out ${videoAOpacity}`}
        aria-hidden="true"
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* 视频 B — cosmic-threads (9.3M)，延迟加载 */}
      <video
        ref={videoBRef}
        muted
        loop
        playsInline
        preload="none"
        className={`absolute inset-0 w-full h-full object-cover pointer-events-none motion-reduce:hidden transition-opacity duration-[2000ms] ease-in-out ${videoBOpacity}`}
        aria-hidden="true"
      />
    </>
  );
}
