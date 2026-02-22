import { NextResponse, type NextRequest } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/hmac";

// 安全响应头 — 所有路由共用
function addSecurityHeaders(response: NextResponse) {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  // HSTS — 仅在非 localhost 时启用（避免开发环境问题）
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
  }
  return response;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Admin 路由：HMAC cookie 校验 ──
  if (pathname.startsWith("/admin")) {
    // login 页 + login API 放行
    if (pathname === "/admin/login" || pathname === "/admin/login/") {
      return addSecurityHeaders(NextResponse.next());
    }

    // 验证 HMAC cookie
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token || !(await verifyToken(token))) {
      return addSecurityHeaders(
        NextResponse.redirect(new URL("/admin/login", req.url)),
      );
    }

    return addSecurityHeaders(NextResponse.next());
  }

  // ── 其他路由：仅追加安全头 ──
  return addSecurityHeaders(NextResponse.next());
}

export const config = {
  // 匹配所有页面路由（排除静态资源 _next/static、_next/image、favicon.ico）
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|avif)).*)",
  ],
};
