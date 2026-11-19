/* 大学物理课程内容索引 —— 12 个章（deck1~deck12）+ 课程主页 + 4 份期末试卷 */
import type { DeckData, PhysPaper, PhysQuestion } from './types';
import home from './home';
import deck1 from './deck1';
import deck2 from './deck2';
import deck3 from './deck3';
import deck4 from './deck4';
import deck5 from './deck5';
import deck6 from './deck6';
import deck7 from './deck7';
import deck8 from './deck8';
import deck9 from './deck9';
import deck10 from './deck10';
import deck11 from './deck11';
import deck12 from './deck12';
import papers from './papers';

export type { PhysPaper, PhysQuestion, PhysTag } from './types';

export const physHome: DeckData = home;

/** 按章号排列的 12 个章（1-6 力学·热学，7-9 电磁学，10-11 振动与波，12 光学） */
export const physDecks: DeckData[] = [
  deck1,
  deck2,
  deck3,
  deck4,
  deck5,
  deck6,
  deck7,
  deck8,
  deck9,
  deck10,
  deck11,
  deck12,
];

export const physPapers: PhysPaper[] = papers;

/** 全部试卷题目的扁平视图（测试与统计用） */
export const physAllQuestions: PhysQuestion[] = physPapers.flatMap((p) => p.questions);

export function findPhysPaper(id: string): PhysPaper | undefined {
  return physPapers.find((p) => p.id === id);
}
