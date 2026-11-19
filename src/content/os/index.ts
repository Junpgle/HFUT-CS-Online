/** 操作系统课程内容汇总 —— 章节与试卷的入口（各模块为事实源） */
import type { OsChapter, OsPaper, OsQuizKind } from './types';
import ch1 from './ch1';
import ch2 from './ch2';
import ch3 from './ch3';
import ch4 from './ch4';
import ch5 from './ch5';
import ch6 from './ch6';
import ch7 from './ch7';
import bonus from './bonus';
import paperAC2022 from './paper-ac2022';
import paperB2022 from './paper-b2022';
import paperXC2022 from './paper-xc2022';
import paperB2021 from './paper-b2021';

/** 章节列表：第 1～7 章 + 期末大题精讲（ch8） */
export const osChapters: OsChapter[] = [ch1, ch2, ch3, ch4, ch5, ch6, ch7, bonus];

/** 试卷列表（按年代倒序：最新的在前） */
export const osPapers: OsPaper[] = [paperAC2022, paperB2022, paperXC2022, paperB2021];

/** 题型的短标签（热力图行标题与题卡序号用） */
export const OS_KIND_LABEL: Record<OsQuizKind, string> = {
  single: '单选',
  multi: '多选',
  judge: '判断',
  fill: '填空',
  essay: '解答',
};

/** 全部试卷的题目合集（按试卷序拼接） */
export const osAllQuestions = osPapers.flatMap((p) => p.questions);

export * from './types';
