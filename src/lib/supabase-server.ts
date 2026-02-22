import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// ── 服务端客户端（API routes / Server Components 专用）──
// 使用 service_role key 绕过 RLS，拥有完整读写权限
let serviceClient: SupabaseClient<Database> | null = null;

export function createServiceClient(): SupabaseClient<Database> {
  if (serviceClient) return serviceClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Missing Supabase env vars (URL or SERVICE_ROLE_KEY)');
  }

  serviceClient = createClient<Database>(url, key, {
    auth: { persistSession: false },
  });

  return serviceClient;
}
