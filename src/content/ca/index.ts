/** 计算机体系结构课程内容汇总 —— 章节与试卷的入口（各模块为事实源） */
import type { CaChapter, CaPaper, CaQuizKind } from './types';
import ch2 from './ch2';
import ch3 from './ch3';
import ch4 from './ch4';
import ch5 from './ch5';
import ch6 from './ch6';
import ch7 from './ch7';
import ch8 from './ch8';
import ch9 from './ch9';
import ch10 from './ch10';
import ch11 from './ch11';
import ch12 from './ch12';
import ch13 from './ch13';
import ch14 from './ch14';
import paperQuiz2 from './paper-quiz2';
import paperRecall2019 from './paper-recall2019';
import paperPredict from './paper-predict';

/** 章节列表：第 2～14 讲（第 1 讲为课程简介，课件未提供） */
export const caChapters: CaChapter[] = [
  ch2, ch3, ch4, ch5, ch6, ch7, ch8, ch9, ch10, ch11, ch12, ch13, ch14,
];

/** 试卷列表（按时间/正式程度：课堂测试 → 期末回忆 → 大题预测） */
export const caPapers: CaPaper[] = [paperQuiz2, paperRecall2019, paperPredict];

/** 题型的短标签（热力图行标题与题卡序号用） */
export const CA_KIND_LABEL: Record<CaQuizKind, string> = {
  single: '单选',
  multi: '多选',
  judge: '判断',
  fill: '填空',
  essay: '解答',
};

/** 全部试卷的题目合集（按试卷序拼接） */
export const caAllQuestions = caPapers.flatMap((p) => p.questions);

/** 按讲号取章（tag 跳转用；ch2…ch14） */
export function caChapterByNo(no: number): CaChapter | undefined {
  return caChapters.find((c) => c.id === `ch${no}`);
}

export * from './types';
