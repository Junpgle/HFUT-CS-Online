import type { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from './config';

let clientPromise: Promise<SupabaseClient> | null = null;

/**
 * Supabase SDK 按需加载：未登录访客不会为它付出首屏体积。
 * PKCE 流程把回调参数放在查询串（?code=），与站点的 HashRouter 不冲突。
 */
export function getSupabase(): Promise<SupabaseClient> {
  if (!clientPromise) {
    clientPromise = import('@supabase/supabase-js').then(({ createClient }) =>
      createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: 'pkce',
        },
      }),
    );
  }
  return clientPromise;
}
