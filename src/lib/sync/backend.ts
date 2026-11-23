/** 云端读写适配层：SyncManager 只依赖这个接口，测试可换成内存实现。 */
import type {
  PushPayload,
  RemoteFavoriteRow,
  RemoteProgressRow,
  RemoteRecentRow,
  SyncUser,
} from './types';
import { getSupabase } from './client';

export interface PullResult {
  progress: RemoteProgressRow[];
  favorites: RemoteFavoriteRow[];
  recent: RemoteRecentRow[];
}

export interface SyncBackend {
  getSession(): Promise<SyncUser | null>;
  onAuthChange(cb: (event: string, user: SyncUser | null) => void): () => void;
  signIn(email: string, password: string): Promise<void>;
  signUp(email: string, password: string): Promise<{ needsConfirm: boolean }>;
  signOut(): Promise<void>;
  pull(): Promise<PullResult>;
  push(payload: PushPayload): Promise<void>;
}

function toUser(u: { id: string; email?: string | null } | null | undefined): SyncUser | null {
  return u ? { id: u.id, email: u.email ?? null } : null;
}

function ensure(error: { message: string } | null): void {
  if (error) throw new Error(error.message);
}

export function createSupabaseBackend(): SyncBackend {
  return {
    async getSession() {
      const supabase = await getSupabase();
      const { data, error } = await supabase.auth.getSession();
      ensure(error);
      return toUser(data.session?.user);
    },

    onAuthChange(cb) {
      let unsub: (() => void) | null = null;
      void getSupabase().then((supabase) => {
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
          cb(event, toUser(session?.user));
        });
        unsub = () => data.subscription.unsubscribe();
      });
      return () => unsub?.();
    },

    async signIn(email, password) {
      const supabase = await getSupabase();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      ensure(error);
    },

    async signUp(email, password) {
      const supabase = await getSupabase();
      const base = import.meta.env.BASE_URL || '/';
      const redirectTo = new URL(base, window.location.origin).toString();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: redirectTo },
      });
      ensure(error);
      // 开启「确认邮箱」时不会直接返回会话
      return { needsConfirm: !data.session };
    },

    async signOut() {
      const supabase = await getSupabase();
      const { error } = await supabase.auth.signOut();
      ensure(error);
    },

    async pull() {
      const supabase = await getSupabase();
      const [progress, favorites, recent] = await Promise.all([
        supabase.from('user_progress').select('course,question_id,result,updated_at'),
        supabase.from('user_favorites').select('course,favorited,updated_at'),
        supabase.from('user_recent').select('course,viewed_at'),
      ]);
      ensure(progress.error);
      ensure(favorites.error);
      ensure(recent.error);
      return {
        progress: (progress.data ?? []) as RemoteProgressRow[],
        favorites: (favorites.data ?? []) as RemoteFavoriteRow[],
        recent: (recent.data ?? []) as RemoteRecentRow[],
      };
    },

    async push(payload) {
      const supabase = await getSupabase();
      const { error } = await supabase.rpc('sync_push', {
        p_progress: payload.progress,
        p_favorites: payload.favorites,
        p_recent: payload.recent,
      });
      ensure(error);
    },
  };
}
