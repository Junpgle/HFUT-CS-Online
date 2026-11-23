/** Supabase 连接配置：只使用 Publishable Key（前端可见），绝不放入 Service Role Key。 */

const url = (import.meta.env.VITE_SUPABASE_URL ?? '').trim();
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim();

export const SUPABASE_URL = url;
export const SUPABASE_ANON_KEY = anonKey;

/** 未配置环境变量时，站点保持纯本地游客模式，账号入口不渲染。 */
export const syncEnabled = Boolean(url && anonKey);
