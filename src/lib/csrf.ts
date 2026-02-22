// ─── CSRF 防护：Origin / Referer 头校验 ───
// JSON API 已有浏览器 CORS 保护（非 simple request），这里做双重校验

import { NextRequest, NextResponse } from 'next/server';

// 允许的来源域名（生产 + 本地开发）
const ALLOWED_ORIGINS = [
  'https://synthmind.ca',
  'https://www.synthmind.ca',
];

// 开发环境额外允许 localhost
if (process.env.NODE_ENV === 'development') {
  ALLOWED_ORIGINS.push('http://localhost:3000');
  ALLOWED_ORIGINS.push('http://127.0.0.1:3000');
}

/**
 * 校验请求来源是否合法
 * 返回 null 表示通过，否则返回 403 Response
 */
export function checkCsrf(req: NextRequest): NextResponse | null {
  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');

  // 优先检查 Origin（浏览器 POST 请求必带）
  if (origin) {
    if (ALLOWED_ORIGINS.includes(origin)) return null;
    return NextResponse.json(
      { error: 'Forbidden: invalid origin.' },
      { status: 403 },
    );
  }

  // 降级检查 Referer（某些浏览器 / 隐私模式可能不发 Origin）
  if (referer) {
    const allowed = ALLOWED_ORIGINS.some((o) => referer.startsWith(o));
    if (allowed) return null;
    return NextResponse.json(
      { error: 'Forbidden: invalid referer.' },
      { status: 403 },
    );
  }

  // 无 Origin + 无 Referer：可能是服务器间调用或 curl
  // 对于营销网站场景放行（依赖 CORS 和 rate-limit 做第一道防线）
  return null;
}
