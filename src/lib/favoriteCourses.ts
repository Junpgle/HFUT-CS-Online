/* 收藏的课程 —— 本地优先存储，登录后按课程逐条与云端合并 */

import { readFavorites, setFavorite } from './sync/local';

export function getFavoriteCourses(): string[] {
  return readFavorites();
}

/** 切换收藏状态，返回切换后是否已收藏 */
export function toggleFavorite(name: string): boolean {
  const on = !getFavoriteCourses().includes(name);
  setFavorite(name, on);
  return on;
}
