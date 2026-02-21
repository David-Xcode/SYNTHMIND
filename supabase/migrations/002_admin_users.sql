-- ============================================================
-- 002_admin_users.sql
-- admin 凭据存储 + bcrypt 密码验证（pgcrypto）
-- 幂等：可安全重复执行
-- ============================================================

-- 确保 pgcrypto 扩展可用（Supabase 默认在 extensions schema）
CREATE EXTENSION IF NOT EXISTS pgcrypto SCHEMA extensions;

-- admin_users 表
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- RLS 开启但不创建策略 → 仅 service_role 可访问
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 密码验证函数
-- SECURITY DEFINER：以函数 owner（postgres）身份执行，调用者无需表读权限
-- search_path 包含 extensions 以访问 pgcrypto 的 crypt()
CREATE OR REPLACE FUNCTION verify_admin_password(p_email TEXT, p_password TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  SELECT EXISTS(
    SELECT 1 FROM admin_users
    WHERE email = p_email
    AND password_hash = crypt(p_password, password_hash)
  );
$$;

-- 种子数据：初始 admin 用户（幂等：已存在则跳过）
INSERT INTO admin_users (email, password_hash)
VALUES ('admin@synthmind.ca', extensions.crypt('SM-Adm!n-2026x', extensions.gen_salt('bf')))
ON CONFLICT (email) DO NOTHING;
