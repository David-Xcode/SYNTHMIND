import { type NextRequest, NextResponse } from 'next/server';

// Content-Security-Policy
// 站点为静态预渲染（SSG），HTML 烘焙时无法注入 per-request nonce，且代码大量使用
// 内联 style={{}} 属性 + Next/微信修复脚本为内联脚本——故 script/style-src 保留
// 'unsafe-inline'（务实基线）。其余指令仍收紧：默认仅同源，禁止被嵌套(frame-ancestors)、
// 锁定 base-uri / form-action、object-src 'none'。资源（字体/视频）均自托管于同源。
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self'",
  "media-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ');

// 安全响应头 — 所有路由共用
function addSecurityHeaders(response: NextResponse) {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Content-Security-Policy', CONTENT_SECURITY_POLICY);
  // 关闭本站不使用的强能力 API
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  );
  // HSTS — 仅在非 localhost 时启用（避免开发环境问题）
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload',
    );
  }
  return response;
}

// Next.js 16: middleware 约定已更名为 proxy（nodejs runtime，不支持 edge）
// 本函数仅设置安全响应头，无 edge 专属依赖，迁移零风险
export async function proxy(_req: NextRequest) {
  return addSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|avif)).*)',
  ],
};
