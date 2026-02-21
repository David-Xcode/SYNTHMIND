import { createServiceClient } from "@/lib/supabase-server";
import { requireAdmin } from "@/lib/admin-auth";
import type { ChatSessionRow, FormSubmissionRow } from "@/lib/types";
import AdminDashboardClient from "./AdminDashboardClient";

// 转义 LIKE 通配符 + PostgREST 语法安全字符
function sanitizeSearch(raw: string): string {
  return raw
    .trim()
    .replace(/[\\%_]/g, "\\$&")
    .replace(/[,()]/g, "");
}

// Server component：从 DB 加载会话列表或表单提交列表
// Next.js 14: searchParams 直接解构，不用 await
export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: { q?: string; view?: string; sort?: string };
}) {
  // 二次鉴权：纵深防御
  await requireAdmin();

  const { q, view, sort } = searchParams;
  const activeView = view === "submissions" ? "submissions" : "sessions";
  const sortAsc = sort === "asc";
  const db = createServiceClient();

  // ── Sessions 视图 ──
  if (activeView === "sessions") {
    let query = db
      .from("chat_sessions")
      .select("*")
      .order("updated_at", { ascending: sortAsc })
      .limit(100);

    if (q && q.trim()) {
      const safeTerm = sanitizeSearch(q);
      if (safeTerm) {
        query = query.or(
          `lead_email.ilike.%${safeTerm}%,lead_phone.ilike.%${safeTerm}%`,
        );
      }
    }

    const { data: sessions, error } = await query;

    if (error) {
      console.error("Failed to load sessions:", error);
    }

    return (
      <AdminDashboardClient
        activeView="sessions"
        sessions={(sessions ?? []) as ChatSessionRow[]}
        submissions={[]}
        initialSearch={q ?? ""}
        sortAsc={sortAsc}
        dbError={error ? "Failed to load sessions. Please try again." : null}
      />
    );
  }

  // ── Submissions 视图 ──
  let query = db
    .from("form_submissions")
    .select("*")
    .order("created_at", { ascending: sortAsc })
    .limit(100);

  if (q && q.trim()) {
    const safeTerm = sanitizeSearch(q);
    if (safeTerm) {
      query = query.or(
        `name.ilike.%${safeTerm}%,email.ilike.%${safeTerm}%`,
      );
    }
  }

  const { data: submissions, error } = await query;

  if (error) {
    console.error("Failed to load submissions:", error);
  }

  return (
    <AdminDashboardClient
      activeView="submissions"
      sessions={[]}
      submissions={(submissions ?? []) as FormSubmissionRow[]}
      initialSearch={q ?? ""}
      sortAsc={sortAsc}
      dbError={error ? "Failed to load submissions. Please try again." : null}
    />
  );
}
