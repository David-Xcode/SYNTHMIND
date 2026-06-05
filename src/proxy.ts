import { type NextRequest, NextResponse } from 'next/server';

// 安全响应头 — 所有路由共用
function addSecurityHeaders(response: NextResponse) {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
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
