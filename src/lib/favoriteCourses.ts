/* 收藏的课程 —— localStorage 本地记录（课程名数组，收藏先后在前，去重） */

const KEY = 'hb-favorite-courses';

export function getFavoriteCourses(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

/** 切换收藏状态，返回切换后是否已收藏 */
export function toggleFavorite(name: string): boolean {
  try {
    const list = getFavoriteCourses();
    const on = !list.includes(name);
    localStorage.setItem(KEY, JSON.stringify(on ? [name, ...list] : list.filter((n) => n !== name)));
    return on;
  } catch {
    /* 隐私模式等场景下静默失败 */
    return false;
  }
}
