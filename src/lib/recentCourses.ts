/* 最近查看的课程 —— 本地优先存储，登录后按时间戳与云端合并 */

import { readRecent, recordRecent } from './sync/local';

export function getRecentCourses(): string[] {
  return readRecent();
}

/** 课程页挂载时调用：刷新该课程的最近查看时间（MRU） */
export function recordCourseView(name: string) {
  recordRecent(name);
}
