import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  SYSTEM_PROMPT,
  MAX_API_MESSAGES,
  MAX_MESSAGE_LENGTH,
} from "@/lib/chatConstants";

// ─── IP 滑动窗口限流器 ───
interface RateEntry {
  timestamps: number[];
}

const rateMap = new Map<string, RateEntry>();

// 每 5 分钟清理过期记录，防止内存泄漏
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupRateMap() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  const oneHourAgo = now - 60 * 60 * 1000;
  rateMap.forEach((entry, ip) => {
    entry.timestamps = entry.timestamps.filter((t: number) => t > oneHourAgo);
    if (entry.timestamps.length === 0) rateMap.delete(ip);
  });
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  cleanupRateMap();

  const now = Date.now();
  const entry = rateMap.get(ip) || { timestamps: [] };

  // 清理 1 小时前的记录
  entry.timestamps = entry.timestamps.filter((t: number) => t > now - 60 * 60 * 1000);

  // 检查每分钟限制（15 次/分）
  const oneMinuteAgo = now - 60 * 1000;
  const recentCount = entry.timestamps.filter((t: number) => t > oneMinuteAgo).length;
  if (recentCount >= 15) {
    return { allowed: false, retryAfter: 60 };
  }

  // 检查每小时限制（80 次/时）
  if (entry.timestamps.length >= 80) {
    return { allowed: false, retryAfter: 3600 };
  }

  entry.timestamps.push(now);
  rateMap.set(ip, entry);
  return { allowed: true };
}

// ─── Gemini 客户端 ───
const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || ""
);

// ─── 消息类型校验 ───
interface IncomingMessage {
  role: string;
  content: string;
}

function validateMessages(
  messages: unknown
): { valid: true; cleaned: IncomingMessage[] } | { valid: false; error: string } {
  if (!Array.isArray(messages)) {
    return { valid: false, error: "messages must be an array" };
  }

  if (messages.length === 0) {
    return { valid: false, error: "messages cannot be empty" };
  }

  const cleaned: IncomingMessage[] = [];

  for (const msg of messages) {
    // Role 白名单 — 仅允许 user/assistant，防止 system 注入
    if (!msg || typeof msg !== "object") continue;
    if (msg.role !== "user" && msg.role !== "assistant") continue;
    if (typeof msg.content !== "string") continue;

    // 内容长度限制
    const content = msg.content.slice(0, MAX_MESSAGE_LENGTH);
    if (content.trim().length === 0) continue;

    cleaned.push({ role: msg.role, content });
  }

  if (cleaned.length === 0) {
    return { valid: false, error: "no valid messages found" };
  }

  // 最后一条必须是 user
  if (cleaned[cleaned.length - 1].role !== "user") {
    return { valid: false, error: "last message must be from user" };
  }

  return { valid: true, cleaned };
}

// ─── 主处理逻辑 ───
export async function POST(request: NextRequest) {
  try {
    // IP 限流
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: "Too many requests. Please slow down.",
          retryAfter: rateCheck.retryAfter,
        },
        {
          status: 429,
          headers: { "Retry-After": String(rateCheck.retryAfter) },
        }
      );
    }

    // 解析请求
    const body = await request.json();
    const validation = validateMessages(body.messages);

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const { cleaned } = validation;

    // 只发送最近 N 条给 Gemini（控制 token 成本）
    const truncated = cleaned.slice(-MAX_API_MESSAGES);

    // 转换为 Gemini history 格式
    const history = truncated.slice(0, -1).map((msg) => ({
      role: msg.role === "user" ? "user" : ("model" as const),
      parts: [{ text: msg.content }],
    }));

    const lastUserMessage =
      truncated[truncated.length - 1].content;

    // Gemini 调用 + 15 秒超时
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        maxOutputTokens: 350,
      },
    });

    const chat = model.startChat({ history });

    const result = await Promise.race([
      chat.sendMessage(lastUserMessage),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("TIMEOUT")), 15000)
      ),
    ]);

    const text = result.response.text();

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "I couldn't generate a response. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ content: text.trim() });
  } catch (error: unknown) {
    console.error("[Chat API Error]", error);

    // 错误分类
    const err = error as Error & { status?: number };
    const message = err.message || "";

    if (message === "TIMEOUT") {
      return NextResponse.json(
        { error: "Response took too long. Please try again." },
        { status: 504 }
      );
    }

    if (message.includes("quota") || message.includes("RATE_LIMIT")) {
      return NextResponse.json(
        { error: "Our AI is taking a break. Please try again in a minute." },
        { status: 503 }
      );
    }

    if (message.includes("SAFETY") || message.includes("blocked")) {
      return NextResponse.json(
        {
          error:
            "I can't respond to that. Let's keep things focused on AI and software — how can I help?",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
