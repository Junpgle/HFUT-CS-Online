/** 同步层共用的数据形状（本地与云端两侧都按这些结构走） */

export type ProgressValue = string;

export type ProgressMap = Record<string, ProgressValue>;

/** 单题本地时间戳；r 为 null 表示「已清空」的墓碑 */
export interface ProgressStamp {
  t: number;
  r: ProgressValue | null;
}

export type ProgressMeta = Record<string, ProgressStamp>;

export interface FavoriteStamp {
  t: number;
  on: boolean;
}

export type FavoriteMeta = Record<string, FavoriteStamp>;

/** 最近查看：课程名 → 最近一次查看时间（毫秒） */
export type RecentMeta = Record<string, number>;

export interface RemoteProgressRow {
  course: string;
  question_id: string;
  result: string | null;
  updated_at: string;
}

export interface RemoteFavoriteRow {
  course: string;
  favorited: boolean;
  updated_at: string;
}

export interface RemoteRecentRow {
  course: string;
  viewed_at: string;
}

export interface PushProgressRow {
  course: string;
  question_id: string;
  result: string | null;
  updated_at: string;
  device_id: string;
}

export interface PushFavoriteRow {
  course: string;
  favorited: boolean;
  updated_at: string;
}

export interface PushRecentRow {
  course: string;
  viewed_at: string;
}

export interface PushPayload {
  progress: PushProgressRow[];
  favorites: PushFavoriteRow[];
  recent: PushRecentRow[];
}

export interface SyncUser {
  id: string;
  email: string | null;
}

export type SyncStatus = 'disabled' | 'guest' | 'syncing' | 'synced' | 'offline' | 'error';

export interface SyncState {
  /** 是否配置了 Supabase 环境变量（未配置时账号入口整体隐藏） */
  enabled: boolean;
  /** 是否已完成会话检查 */
  ready: boolean;
  status: SyncStatus;
  user: SyncUser | null;
  lastSyncedAt: number | null;
  error: string | null;
}
