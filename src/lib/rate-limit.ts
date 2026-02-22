// 可复用的内存速率限制器工厂——滑动窗口算法 + 自动清理

import { NextRequest } from 'next/server';

interface RateLimitConfig {
  maxPerMinute: number;
  maxPerHour?: number; // 可选，不需要小时级限制时省略
  cleanupIntervalMs?: number; // 默认 5 分钟
  maxMapSize?: number; // Map 条目上限，防止内存无限增长（默认 10000）
}

/**
 * 创建独立的速率限制器实例（各 API 路由各自独立）
 *
 * 注意：基于内存的 Map，Vercel Serverless 冷启动后会重置。
 * 对于营销网站的低频表单提交场景，这个精度已经足够。
 */
export function createRateLimiter(config: RateLimitConfig) {
  const {
    maxPerMinute,
    maxPerHour,
    cleanupIntervalMs = 300_000,
    maxMapSize = 10_000,
  } = config;

  const map = new Map<string, number[]>();
  let lastCleanup = Date.now();

  const MINUTE_MS = 60_000;
  const HOUR_MS = 3_600_000;

  // 清理过期条目，防止内存泄漏
  function cleanup(force = false) {
    const now = Date.now();
    if (!force && now - lastCleanup < cleanupIntervalMs) return;
    lastCleanup = now;

    const cutoff = now - (maxPerHour ? HOUR_MS : MINUTE_MS);
    map.forEach((timestamps, ip) => {
      const filtered = timestamps.filter((t) => t > cutoff);
      if (filtered.length === 0) {
        map.delete(ip);
      } else {
        map.set(ip, filtered);
      }
    });

    // Map size 安全阀 — 清理后仍超限则丢弃最早的条目
    if (map.size > maxMapSize) {
      const excess = map.size - maxMapSize;
      const keys = Array.from(map.keys());
      for (let i = 0; i < excess; i++) {
        map.delete(keys[i]);
      }
    }
  }

  function isRateLimited(ip: string): boolean {
    // 超过上限时强制清理，不等定时器
    cleanup(map.size >= maxMapSize);
    const now = Date.now();
    const timestamps = map.get(ip) ?? [];

    // 分钟级限制
    const recentMinute = timestamps.filter((t) => now - t < MINUTE_MS);
    if (recentMinute.length >= maxPerMinute) return true;

    // 小时级限制（可选）
    if (maxPerHour) {
      const recentHour = timestamps.filter((t) => now - t < HOUR_MS);
      if (recentHour.length >= maxPerHour) return true;
    }

    // 记录本次请求
    timestamps.push(now);
    map.set(ip, timestamps);
    return false;
  }

  return { isRateLimited };
}

/**
 * IP 维度的每日创建次数限制器（用于 session 创建防滥用）
 * 滑动 24 小时窗口
 */
export function createDailyLimiter(maxPerDay: number) {
  const map = new Map<string, number[]>();
  const DAY_MS = 86_400_000;
  const MAX_MAP = 5_000;
  let lastCleanup = Date.now();

  function cleanup() {
    const now = Date.now();
    if (now - lastCleanup < 600_000) return; // 每 10 分钟清理
    lastCleanup = now;
    const cutoff = now - DAY_MS;
    map.forEach((ts, ip) => {
      const filtered = ts.filter((t) => t > cutoff);
      if (filtered.length === 0) map.delete(ip);
      else map.set(ip, filtered);
    });
    // 安全阀
    if (map.size > MAX_MAP) {
      const keys = Array.from(map.keys());
      for (let i = 0; i < map.size - MAX_MAP; i++) map.delete(keys[i]);
    }
  }

  return {
    /** 检查是否超限，未超限时自动记录一次 */
    isLimited(ip: string): boolean {
      cleanup();
      const now = Date.now();
      const timestamps = map.get(ip) ?? [];
      const recent = timestamps.filter((t) => now - t < DAY_MS);
      if (recent.length >= maxPerDay) return true;
      recent.push(now);
      map.set(ip, recent);
      return false;
    },
  };
}

/**
 * 从 NextRequest 提取客户端 IP
 * 优先级：x-real-ip（Vercel 边缘注入，不可伪造）> x-forwarded-for 首位 > "unknown"
 */
export function extractIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  return (
    req.headers.get('x-real-ip') ??
    forwarded?.split(',')[0]?.trim() ??
    'unknown'
  );
}
