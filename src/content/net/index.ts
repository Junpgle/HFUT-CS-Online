/* 计算机网络课程内容索引 —— 章（ch1~ch7）+ 总目录 + 三套试卷 */
import type { DeckData, NetPaper, PracticeQuestion } from './types';
import home from './home';
import ch1 from './ch1';
import ch2 from './ch2';
import ch3 from './ch3';
import ch4 from './ch4';
import ch5 from './ch5';
import ch6 from './ch6';
import ch7 from './ch7';
import paper2021 from './paper-2021';
import paper2022 from './paper-2022';
import paper2024 from './paper-2024';

export type { NetPaper } from './types';

export const netHome: DeckData = home;
export const netChapters: DeckData[] = [ch1, ch2, ch3, ch4, ch5, ch6, ch7];

/** 按年份排序的三套试卷 */
export const netPapers: NetPaper[] = [paper2021, paper2022, paper2024];

/** 全部试卷题目的扁平视图（测试与统计用） */
export const netAllQuestions: PracticeQuestion[] = netPapers.flatMap((p) => p.questions);

export function findNetPaper(id: string): NetPaper | undefined {
  return netPapers.find((p) => p.id === id);
}
