// 可复用的内存速率限制器工厂——滑动窗口算法 + 自动清理

import { NextRequest } from "next/server";

interface RateLimitConfig {
  maxPerMinute: number;
  maxPerHour?: number; // 可选，不需要小时级限制时省略
  cleanupIntervalMs?: number; // 默认 5 分钟
}

/**
 * 创建独立的速率限制器实例（各 API 路由各自独立）
 *
 * 注意：基于内存的 Map，Vercel Serverless 冷启动后会重置。
 * 对于营销网站的低频表单提交场景，这个精度已经足够。
 */
export function createRateLimiter(config: RateLimitConfig) {
  const { maxPerMinute, maxPerHour, cleanupIntervalMs = 300_000 } = config;

  const map = new Map<string, number[]>();
  let lastCleanup = Date.now();

  const MINUTE_MS = 60_000;
  const HOUR_MS = 3_600_000;

  // 清理过期条目，防止内存泄漏
  function cleanup() {
    const now = Date.now();
    if (now - lastCleanup < cleanupIntervalMs) return;
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
  }

  function isRateLimited(ip: string): boolean {
    cleanup();
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
 * 从 NextRequest 提取客户端 IP
 * 优先级：x-real-ip（Vercel 边缘注入，不可伪造）> x-forwarded-for 首位 > "unknown"
 */
export function extractIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return (
    req.headers.get("x-real-ip") ??
    forwarded?.split(",")[0]?.trim() ??
    "unknown"
  );
}
