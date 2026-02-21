// 批量删除 API（HMAC 鉴权 + 表名白名单 + ID 格式校验 + rate limit）
// middleware matcher 不覆盖 /api/admin/*，因此手动验证 cookie

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, COOKIE_NAME } from "@/lib/hmac";
import { createServiceClient } from "@/lib/supabase-server";
import { createRateLimiter, extractIp } from "@/lib/rate-limit";

const limiter = createRateLimiter({ maxPerMinute: 10 });

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// 表名白名单 → 实际 Supabase 表名映射
const TABLE_MAP: Record<string, string> = {
  sessions: "chat_sessions",
  submissions: "form_submissions",
};

const MAX_IDS = 100;

export async function POST(req: NextRequest) {
  // ── 鉴权：验证 HMAC cookie ──
  // Next.js 14: cookies() 是同步调用
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── 速率限制 ──
  const ip = extractIp(req);
  if (limiter.isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait." },
      { status: 429 },
    );
  }

  // ── 解析请求体 ──
  let table: unknown;
  let ids: unknown;
  try {
    ({ table, ids } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  // ── 校验 table ──
  if (typeof table !== "string" || !(table in TABLE_MAP)) {
    return NextResponse.json(
      { error: "Invalid table. Must be 'sessions' or 'submissions'." },
      { status: 400 },
    );
  }

  // ── 校验 ids ──
  if (!Array.isArray(ids) || ids.length === 0 || ids.length > MAX_IDS) {
    return NextResponse.json(
      { error: `ids must be a non-empty array (max ${MAX_IDS}).` },
      { status: 400 },
    );
  }

  // sessions → UUID 验证；submissions → 正整数验证
  if (table === "sessions") {
    const allValid = ids.every(
      (id) => typeof id === "string" && UUID_RE.test(id),
    );
    if (!allValid) {
      return NextResponse.json(
        { error: "All session ids must be valid UUIDs." },
        { status: 400 },
      );
    }
  } else {
    const allValid = ids.every(
      (id) => typeof id === "number" && Number.isInteger(id) && id > 0,
    );
    if (!allValid) {
      return NextResponse.json(
        { error: "All submission ids must be positive integers." },
        { status: 400 },
      );
    }
  }

  // ── 执行删除 ──
  try {
    const db = createServiceClient();
    const tableName = TABLE_MAP[table];

    const { count, error } = await db
      .from(tableName)
      .delete({ count: "exact" })
      .in("id", ids);

    if (error) {
      console.error(`Delete from ${tableName} failed:`, error);
      return NextResponse.json(
        { error: "Database error. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ deleted: count ?? 0 });
  } catch (err) {
    console.error("Delete API error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
