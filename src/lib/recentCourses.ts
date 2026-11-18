/* 最近查看的课程 —— localStorage 本地记录（课程名数组，最近在前，去重，上限 MAX 条） */

const KEY = 'hb-recent-courses';
const MAX = 8;

export function getRecentCourses(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

/** 课程页挂载时调用：刷新该课程的最近查看时间（MRU） */
export function recordCourseView(name: string) {
  try {
    const list = getRecentCourses().filter((n) => n !== name);
    list.unshift(name);
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
  } catch {
    /* 隐私模式等场景下静默失败 */
  }
}
