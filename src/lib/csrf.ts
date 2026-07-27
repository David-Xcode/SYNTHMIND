// ─── CSRF 防护：Origin / Referer 头校验 ───
// JSON API 已有浏览器 CORS 保护（非 simple request），这里做双重校验

import { NextRequest, NextResponse } from 'next/server';
import { SITE_URL } from '@/lib/constants';

// 允许的来源域名（www 主域 + apex 兜底，生产 + 本地开发）
const ALLOWED_ORIGINS = [SITE_URL, 'https://synthmind.ca'];

// 开发环境额外允许 localhost
if (process.env.NODE_ENV === 'development') {
  ALLOWED_ORIGINS.push('http://localhost:3000');
  ALLOWED_ORIGINS.push('http://127.0.0.1:3000');
}

// Vercel 预览部署：NODE_ENV 恒为 production，Origin 是 *.vercel.app，
// 此前必然 403 —— 上线前无法端到端验证发信链路，容易被误判成「表单坏了」。
// VERCEL_URL（本次部署）与 VERCEL_BRANCH_URL（分支别名）由平台注入，
// 请求方无法伪造；且只在 VERCEL_ENV === 'preview' 时放行，生产不受影响。
if (process.env.VERCEL_ENV === 'preview') {
  for (const host of [process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL]) {
    if (host) ALLOWED_ORIGINS.push(`https://${host}`);
  }
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
  // 必须解析出 origin 再精确比对：startsWith 前缀匹配会被
  // https://synthmind.ca.evil.com 这类 lookalike 域绕过
  if (referer) {
    let refererOrigin: string | null = null;
    try {
      refererOrigin = new URL(referer).origin;
    } catch {
      refererOrigin = null;
    }
    if (refererOrigin && ALLOWED_ORIGINS.includes(refererOrigin)) return null;
    return NextResponse.json(
      { error: 'Forbidden: invalid referer.' },
      { status: 403 },
    );
  }

  // 无 Origin + 无 Referer：拒绝 — 浏览器 POST 至少会带其中之一
  return NextResponse.json(
    { error: 'Forbidden: missing origin.' },
    { status: 403 },
  );
}
