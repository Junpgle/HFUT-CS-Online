/** 高等数学课程内容汇总 —— 章节与试卷的入口（各模块为事实源） */
import type { MathChapter, MathPaper, MathQuestion, MathQuizKind } from './types';
import ch8 from './ch8';
import ch9 from './ch9';
import ch10 from './ch10';
import ch11 from './ch11';
import ch12 from './ch12';
import ch13 from './ch13';
import { midtermPapers } from './papers-midterm';
import { oldFinalPapers } from './papers-final-old';
import { recentFinalPapers } from './papers-recent';
import { decodeEntities } from '../../lib/text';

/** 章节列表：第 8～13 章（课件覆盖的全部章节） */
export const mathChapters: MathChapter[] = [ch8, ch9, ch10, ch11, ch12, ch13];

/** 客观题答案题卡按纯文本判分/展示：去掉整理时 wraps 答案的 HTML 标签 */
const plainAnswer = (s: string) => decodeEntities(s.replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim();

/** 试卷列表：期中 → 历年期末 → 近两年期末 */
export const mathPapers: MathPaper[] = [...midtermPapers, ...oldFinalPapers, ...recentFinalPapers].map((p) => ({
  ...p,
  questions: p.questions.map((q: MathQuestion) =>
    q.kind === 'essay' ? q : { ...q, answer: plainAnswer(q.answer) },
  ),
}));

/** 题型短标签（热力图行标题与题卡序号用） */
export const MATH_KIND_LABEL: Record<MathQuizKind, string> = {
  single: '单选',
  multi: '多选',
  judge: '判断',
  fill: '填空',
  essay: '解答',
};

export * from './types';
export * from './sections';
