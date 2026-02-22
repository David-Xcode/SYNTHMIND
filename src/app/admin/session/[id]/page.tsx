import { notFound } from "next/navigation";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase-server";
import { requireAdmin } from "@/lib/admin-auth";
import type { ChatSessionRow, ChatMessageRow, FormSubmissionRow } from "@/lib/types";

// ── source 标签颜色映射 ──
const SOURCE_STYLES: Record<string, string> = {
  contact: "bg-blue-500/20 text-blue-300",
  chat: "bg-teal-500/20 text-teal-300",
};

// 格式化完整日期时间
function fmtDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-CA", { timeZone: "America/Toronto" });
}

// 格式化仅时间（HH:MM）
function fmtTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString("en-CA", {
    timeZone: "America/Toronto",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Server component：查看单个 session 的所有消息
// Next.js 15: params 是 Promise，需要 await
export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 二次鉴权：纵深防御
  await requireAdmin();

  const { id } = await params;

  // UUID 格式校验
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!UUID_RE.test(id)) notFound();

  const db = createServiceClient();

  // 并行加载 session 元数据、消息、关联表单提交
  const [sessionResult, messagesResult, submissionsResult] = await Promise.all([
    db.from("chat_sessions").select("*").eq("id", id).single(),
    db
      .from("chat_messages")
      .select("*")
      .eq("session_id", id)
      .order("id", { ascending: true }),
    db
      .from("form_submissions")
      .select("*")
      .eq("session_id", id)
      .order("created_at", { ascending: true }),
  ]);

  // 区分 DB 故障 vs 真正的 not found
  if (sessionResult.error) {
    if (sessionResult.error.code === "PGRST116") {
      notFound();
    }
    throw new Error(`Failed to load session: ${sessionResult.error.message}`);
  }

  const session = sessionResult.data as ChatSessionRow;

  const messagesError = messagesResult.error
    ? `Failed to load messages: ${messagesResult.error.message}`
    : null;

  const messages = (messagesResult.data ?? []) as ChatMessageRow[];
  const submissions = (submissionsResult.data ?? []) as FormSubmissionRow[];

  // 动态标题回退链：name → email → short UUID
  const shortId = id.slice(0, 8);
  const title = session.lead_name || session.lead_email || `Session ${shortId}`;
  const showEmailInSub = !!(session.lead_name && session.lead_email);
  const hasContact = !!(session.lead_email || session.lead_phone || session.lead_name);

  return (
    <>
      <main className="mx-auto max-w-3xl px-6 py-8">
        {/* ── 顶部 Header ── */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-[#3498db]">Synthmind</span>
            <span className="rounded bg-white/10 px-2 py-0.5 text-[11px] font-medium text-gray-400">
              Session
            </span>
          </div>
          <Link
            href="/admin"
            className="flex items-center gap-1.5 rounded-lg bg-[#3498db] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[#2980b9]"
          >
            {/* ArrowLeft 内联 SVG */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 19-7-7 7-7M19 12H5" />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        {/* ── Lead 身份 + 动态标题 ── */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-gray-500">
            {showEmailInSub && (
              <>
                <span className="text-[#3498db]">{session.lead_email}</span>
                <span>·</span>
              </>
            )}
            <span className="font-mono" title={id}>
              #{shortId}
            </span>
            <span>·</span>
            <span>{messages.length} messages</span>
          </div>
        </div>

        {/* ── 元数据卡片 ── */}
        <div className="mb-8 rounded-lg border border-white/10 bg-[#1a1f2e] text-sm">
          {/* 联系信息（有数据时才显示） */}
          {hasContact && (
            <div className="flex flex-wrap gap-x-6 gap-y-2 border-b border-white/5 px-4 py-3">
              {session.lead_name && (
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-gray-500">
                    Name
                  </div>
                  <div className="text-gray-200">{session.lead_name}</div>
                </div>
              )}
              {session.lead_email && (
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-gray-500">
                    Email
                  </div>
                  <a
                    href={`mailto:${session.lead_email}`}
                    className="text-[#3498db] hover:underline"
                  >
                    {session.lead_email}
                  </a>
                </div>
              )}
              {session.lead_phone && (
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-gray-500">
                    Phone
                  </div>
                  <a
                    href={`tel:${session.lead_phone}`}
                    className="text-gray-200 hover:underline"
                  >
                    {session.lead_phone}
                  </a>
                </div>
              )}
            </div>
          )}

          {/* 技术元数据 */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 px-4 py-3">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-gray-500">
                Session ID
              </div>
              <div className="font-mono text-xs text-gray-400" title={session.id}>
                {session.id.slice(0, 8)}
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-gray-500">
                Messages
              </div>
              <div className="text-xs text-gray-400">{session.message_count}</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-gray-500">
                Created
              </div>
              <div className="text-xs text-gray-400">{fmtDate(session.created_at)}</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-gray-500">
                Last Active
              </div>
              <div className="text-xs text-gray-400">{fmtDate(session.updated_at)}</div>
            </div>
          </div>
        </div>

        {/* ── Form Submissions ── */}
        {submissions.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-400">
              Form Submissions
            </h2>
            <div className="space-y-3">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-[11px] font-medium ${
                        SOURCE_STYLES[sub.source] ?? "bg-white/10 text-gray-400"
                      }`}
                    >
                      {sub.source}
                    </span>
                    <span className="text-xs text-gray-500">
                      {fmtDate(sub.created_at)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <div>
                      <span className="text-gray-400">Name: </span>
                      <span>{sub.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Email: </span>
                      <span className="text-[#3498db]">{sub.email}</span>
                    </div>
                    {sub.subject && (
                      <div className="col-span-2">
                        <span className="text-gray-400">Subject: </span>
                        <span>{sub.subject}</span>
                      </div>
                    )}
                  </div>
                  {sub.message && (
                    <div className="mt-2 border-t border-white/5 pt-2">
                      <span className="text-gray-400">Message: </span>
                      <span className="text-gray-300">{sub.message}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 对话区域 ── */}

        {messagesError && (
          <p role="alert" className="mb-4 text-center text-sm text-red-400">
            {messagesError}
          </p>
        )}

        <h2 className="mb-4 text-xs font-medium uppercase tracking-wider text-gray-400">
          Conversation · {messages.length} messages
        </h2>

        <div className="relative space-y-4">
          {/* 长对话粘性返回按钮（>8条消息时显示） */}
          {messages.length > 8 && (
            <a
              href="#"
              className="sticky top-4 z-10 ml-auto flex w-fit items-center gap-1 rounded border border-white/10 bg-[#0f1419]/90 px-3 py-1.5 text-[11px] text-gray-400 backdrop-blur-sm transition-colors hover:text-gray-200"
            >
              {/* ArrowUp 内联 SVG */}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m18 15-6-6-6 6" />
              </svg>
              Back to top
            </a>
          )}

          {messages.length === 0 && !messagesError ? (
            <p className="py-8 text-center text-sm text-gray-500">
              No messages in this session.
            </p>
          ) : (
            messages.map((msg) =>
              msg.role === "user" ? (
                /* ── User 消息（右对齐） ── */
                <div key={msg.id} className="flex flex-col items-end">
                  <div className="mb-0.5 flex items-center gap-2 text-[10px] text-gray-500">
                    <span>{fmtTime(msg.created_at)}</span>
                    <span className="font-medium text-gray-400">Visitor</span>
                  </div>
                  <div className="max-w-[85%] rounded-tl rounded-bl rounded-br bg-white/[0.08] px-4 py-2.5">
                    <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-200">
                      {msg.content}
                    </p>
                  </div>
                </div>
              ) : (
                /* ── AI 消息（左对齐） ── */
                <div key={msg.id} className="flex flex-col items-start">
                  <div className="mb-0.5 flex items-center gap-2 text-[10px] text-gray-500">
                    <span className="font-medium text-[#3498db]">AI</span>
                    <span>{fmtTime(msg.created_at)}</span>
                  </div>
                  <div className="max-w-[85%] border-l-2 border-[#3498db]/50 bg-[#3498db]/10 py-2.5 pl-3 pr-4">
                    <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-200">
                      {msg.content}
                    </p>
                  </div>
                </div>
              ),
            )
          )}
        </div>
      </main>
    </>
  );
}
