// ── 共享类型定义 ──

import type { Database } from "./database.types";

// ── Supabase 数据库行类型（从 database.types.ts 派生，单一来源） ──

export type ChatSessionRow = Database["public"]["Tables"]["chat_sessions"]["Row"];

// DB 中 role 是 string，应用层收窄为 union type
export type ChatMessageRow = Omit<
  Database["public"]["Tables"]["chat_messages"]["Row"],
  "role"
> & {
  role: "user" | "assistant";
};

export type FormSubmissionRow = Database["public"]["Tables"]["form_submissions"]["Row"];
