import { NextRequest, NextResponse } from "next/server";
import { signToken, COOKIE_NAME, SESSION_MAX_AGE } from "@/lib/hmac";
import { createServiceClient } from "@/lib/supabase-server";
import { createRateLimiter, extractIp } from "@/lib/rate-limit";

// 5 次/分钟，防暴力破解
const limiter = createRateLimiter({ maxPerMinute: 5 });

export async function POST(req: NextRequest) {
  // 速率限制
  const ip = extractIp(req);
  if (limiter.isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a moment." },
      { status: 429 },
    );
  }

  // 解析请求体
  let email: string;
  let password: string;
  try {
    const body = await req.json();
    email = String(body.email ?? "").trim().toLowerCase();
    password = String(body.password ?? "");
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // 调用 DB 函数验证凭据 → 签发 HMAC cookie
  try {
    const db = createServiceClient();
    const { data: valid, error } = await db.rpc("verify_admin_password", {
      p_email: email,
      p_password: password,
    });

    if (error) {
      console.error("verify_admin_password RPC error:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      return NextResponse.json(
        { error: "Server error." },
        { status: 500 },
      );
    }

    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    // 签发 HMAC token → 写入 HttpOnly cookie
    const token = await signToken();
    const res = NextResponse.json({ ok: true });

    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });

    return res;
  } catch (err) {
    console.error("Admin login error:", err);
    return NextResponse.json(
      { error: "Server configuration error." },
      { status: 500 },
    );
  }
}
