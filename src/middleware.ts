import { NextResponse, type NextRequest } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/hmac";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // login 页 + login API 放行
  if (pathname === "/admin/login" || pathname === "/admin/login/") {
    return NextResponse.next();
  }

  // 验证 HMAC cookie
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
