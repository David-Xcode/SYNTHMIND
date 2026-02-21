import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createRateLimiter, extractIp } from "@/lib/rate-limit";
import { createServiceClient } from "@/lib/supabase-server";
import { extractContactInfo } from "@/lib/extract-contact";
import { SYSTEM_PROMPT } from "@/lib/chatConstants";

// ── 速率限制：20/min, 150/hr ──
const limiter = createRateLimiter({ maxPerMinute: 20, maxPerHour: 150 });

// 单 session 消息上限
const MAX_SESSION_MESSAGES = 200;
// 发给 Gemini 的上下文窗口大小
const CONTEXT_WINDOW = 50;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest) {
  // ── 运行时读取环境变量，缺失则返回 503 ──
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    console.error("Missing env: GOOGLE_GENERATIVE_AI_API_KEY");
    return NextResponse.json(
      { error: "Service temporarily unavailable." },
      { status: 503 },
    );
  }
  const genAI = new GoogleGenerativeAI(apiKey);

  // ── Supabase 客户端（容错：缺失时降级为无持久化模式）──
  let db: ReturnType<typeof createServiceClient> | null = null;
  try {
    db = createServiceClient();
  } catch {
    console.warn("Supabase unavailable, running in fallback mode");
  }

  try {
    // ── 速率限制检查 ──
    const ip = extractIp(request);
    if (limiter.isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment before trying again." },
        { status: 429 },
      );
    }

    // ── 请求体大小限制（50KB）──
    const MAX_BODY_SIZE = 50_000;
    const rawBody = await request.text();
    if (rawBody.length > MAX_BODY_SIZE) {
      return NextResponse.json(
        { error: "Request too large." },
        { status: 413 },
      );
    }

    let sessionId: unknown;
    let message: unknown;
    try {
      ({ sessionId, message } = JSON.parse(rawBody));
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON." },
        { status: 400 },
      );
    }

    // ── 校验 sessionId（UUID 格式）──
    if (typeof sessionId !== "string" || !UUID_RE.test(sessionId)) {
      return NextResponse.json(
        { error: "Invalid sessionId." },
        { status: 400 },
      );
    }

    // ── 校验 message ──
    if (typeof message !== "string" || !message.trim() || message.length > 2000) {
      return NextResponse.json(
        { error: "Invalid message." },
        { status: 400 },
      );
    }

    const userMessage = message.trim();

    // ── DB 操作：创建 session + 保存 user message + 加载上下文 ──
    let historyMessages: { role: string; content: string }[] = [];

    if (db) {
      try {
        // 确保 session 存在（upsert：首条消息创建，后续消息忽略冲突）
        await db.from("chat_sessions").upsert(
          {
            id: sessionId,
            ip_address: ip,
            user_agent: request.headers.get("user-agent")?.slice(0, 500) || null,
          },
          { onConflict: "id", ignoreDuplicates: true },
        );

        // 检查 session 消息数是否超限
        const { data: session } = await db
          .from("chat_sessions")
          .select("message_count")
          .eq("id", sessionId)
          .single();

        if (session && session.message_count >= MAX_SESSION_MESSAGES) {
          return NextResponse.json(
            { error: "This conversation has reached its limit. Please start a new chat." },
            { status: 429 },
          );
        }

        // 保存 user message
        await db.from("chat_messages").insert({
          session_id: sessionId,
          role: "user",
          content: userMessage,
        });

        // 更新 session 计数和时间戳
        await db
          .from("chat_sessions")
          .update({
            message_count: (session?.message_count ?? 0) + 1,
            updated_at: new Date().toISOString(),
          })
          .eq("id", sessionId);

        // 从用户消息中提取联系信息，更新 lead 字段
        const contact = extractContactInfo(userMessage);
        if (contact.email || contact.phone) {
          const updates: Record<string, string> = {};
          if (contact.email) updates.lead_email = contact.email;
          if (contact.phone) updates.lead_phone = contact.phone;
          await db.from("chat_sessions").update(updates).eq("id", sessionId);
        }

        // 加载最近 N 条消息作为 Gemini 上下文
        const { data: dbMessages } = await db
          .from("chat_messages")
          .select("role, content")
          .eq("session_id", sessionId)
          .order("id", { ascending: true })
          .limit(CONTEXT_WINDOW);

        if (dbMessages) {
          historyMessages = dbMessages;
        }
      } catch (dbErr) {
        // DB 故障时降级：用当前消息作为唯一上下文
        console.error("Supabase DB error:", dbErr);
        historyMessages = [{ role: "user", content: userMessage }];
      }
    } else {
      // 无 DB 时直接用当前消息
      historyMessages = [{ role: "user", content: userMessage }];
    }

    // ── 构建 Gemini 请求 ──
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        maxOutputTokens: 350,
      },
    });

    // 历史（排除最后一条，最后一条作为 sendMessage 参数）
    const history = historyMessages.slice(0, -1).map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({ history });

    // 最后一条消息发送给 AI
    const lastMsg = historyMessages[historyMessages.length - 1]?.content || userMessage;

    // 15 秒超时保护
    const GEMINI_TIMEOUT_MS = 15_000;
    const result = await Promise.race([
      chat.sendMessage(lastMsg),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("AI response timed out")), GEMINI_TIMEOUT_MS),
      ),
    ]);
    const text = result.response.text();

    if (!text) {
      return NextResponse.json(
        { error: "Empty response from AI. Please try again." },
        { status: 502 },
      );
    }

    // ── 保存 assistant 回复到 DB ──
    if (db) {
      try {
        await db.from("chat_messages").insert({
          session_id: sessionId,
          role: "assistant",
          content: text,
        });

        // 更新消息计数
        const { data: sess } = await db
          .from("chat_sessions")
          .select("message_count")
          .eq("id", sessionId)
          .single();

        await db
          .from("chat_sessions")
          .update({
            message_count: (sess?.message_count ?? 0) + 1,
            updated_at: new Date().toISOString(),
          })
          .eq("id", sessionId);
      } catch (dbErr) {
        console.error("Failed to save assistant message:", dbErr);
      }
    }

    return NextResponse.json({ content: text.trim() });
  } catch (error) {
    console.error("Chat API error:", error);

    const err = error as Error & { status?: number };
    const message = err.message || "";

    if (message === "AI response timed out") {
      return NextResponse.json(
        { error: "Response took too long. Please try again." },
        { status: 504 },
      );
    }

    if (message.includes("quota") || message.includes("RATE_LIMIT")) {
      return NextResponse.json(
        { error: "Our AI is taking a break. Please try again in a minute." },
        { status: 503 },
      );
    }

    if (message.includes("SAFETY") || message.includes("blocked")) {
      return NextResponse.json(
        {
          error:
            "I can't respond to that. Let's keep things focused on AI and software — how can I help?",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
