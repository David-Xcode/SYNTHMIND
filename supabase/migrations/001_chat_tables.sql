-- ── 聊天持久化 Schema ──
-- 运行方式：在 Supabase Dashboard → SQL Editor 中执行

-- 聊天会话表
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT,
  user_agent TEXT,
  lead_email TEXT,
  lead_phone TEXT,
  lead_name TEXT,
  message_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 聊天消息表
CREATE TABLE chat_messages (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 索引：按 session 查消息、按时间排序会话、按 email 搜索 lead
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_chat_sessions_updated_at ON chat_sessions(updated_at DESC);
CREATE INDEX idx_chat_sessions_lead_email ON chat_sessions(lead_email) WHERE lead_email IS NOT NULL;

-- ── RLS 策略 ──
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- anon key: 只允许 INSERT（前端通过 API routes 写入）
CREATE POLICY "anon_insert_sessions" ON chat_sessions
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_insert_messages" ON chat_messages
  FOR INSERT TO anon WITH CHECK (true);

-- authenticated (admin): 允许 SELECT
CREATE POLICY "auth_select_sessions" ON chat_sessions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "auth_select_messages" ON chat_messages
  FOR SELECT TO authenticated USING (true);

-- service_role 自动绕过 RLS，无需额外策略
