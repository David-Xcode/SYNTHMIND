-- 表单提交持久化（联系表单 / 聊天中的联系信息）
-- 所有表单共用同一张表，通过 source 字段区分来源

CREATE TABLE form_submissions (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  source     TEXT NOT NULL CHECK (source IN ('contact', 'chat')),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT,
  message    TEXT,
  session_id UUID REFERENCES chat_sessions(id) ON DELETE SET NULL,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 按时间倒序查询（admin 后台列表页）
CREATE INDEX idx_form_submissions_created_at ON form_submissions(created_at DESC);
-- 按邮箱搜索
CREATE INDEX idx_form_submissions_email ON form_submissions(email);
-- 按来源筛选
CREATE INDEX idx_form_submissions_source ON form_submissions(source);
-- 按 session 关联查询（仅有值时索引）
CREATE INDEX idx_form_submissions_session_id ON form_submissions(session_id) WHERE session_id IS NOT NULL;

-- 仅 service_role 可访问（API route 用 service_role client）
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
