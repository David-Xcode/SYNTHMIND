import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// 只恢复 24 小时内的 session
const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000;

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId");

  if (!sessionId || !UUID_RE.test(sessionId)) {
    return NextResponse.json(
      { error: "Invalid sessionId." },
      { status: 400 },
    );
  }

  try {
    const db = createServiceClient();

    // 验证 session 存在且未过期
    const { data: session } = await db
      .from("chat_sessions")
      .select("created_at")
      .eq("id", sessionId)
      .single();

    if (!session) {
      return NextResponse.json({ messages: [] });
    }

    // 检查是否在 24 小时内
    const sessionAge = Date.now() - new Date(session.created_at).getTime();
    if (sessionAge > SESSION_MAX_AGE_MS) {
      return NextResponse.json({ messages: [], expired: true });
    }

    // 加载所有消息
    const { data: messages } = await db
      .from("chat_messages")
      .select("role, content, created_at")
      .eq("session_id", sessionId)
      .order("id", { ascending: true });

    return NextResponse.json({
      messages: messages ?? [],
    });
  } catch (err) {
    console.error("Chat history API error:", err);
    return NextResponse.json(
      { error: "Failed to load history." },
      { status: 500 },
    );
  }
}
