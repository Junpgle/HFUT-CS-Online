/** 高等数学课程的数据契约 —— 章节页复用算法课的 DeckData/Section/Block 结构 */
import type { DeckData } from '../types';
import type { PracticeTag } from '../practice/types';

export type { DeckData, Section, TocEntry, Block, QuizData } from '../types';

/** 高等数学的一章（第 8 章…第 13 章） */
export type MathChapter = DeckData;

/** 知识点标签：deck 存章号 8..13，sec 存本节 id；答题页据此跳转 /math/chapter/chN?s=sec */
export type MathTag = PracticeTag;

export type MathQuizKind = 'single' | 'multi' | 'judge' | 'fill' | 'essay';

/** 一道试题（question/options/answer/explanation 为可信 HTML 片段） */
export interface MathQuestion {
  /** 全库唯一 id，如 'q2023-1-1'（2023 期末 · 第 1 大题第 1 小题） */
  id: string;
  kind: MathQuizKind;
  /** 题干 HTML（含原始编号） */
  question: string;
  /** 选项 HTML（single/multi/judge 有，judge 固定为 ['对','错']；fill/essay 无） */
  options?: string[];
  /** 答案原文：single 'A'；multi 'A、C'；judge '对'/'错'；fill 文本；essay 参考答案 HTML */
  answer: string;
  /** 解析 HTML（无解析时写明「原卷未附解析，此处不补充推导」） */
  explanation: string;
  /** 知识点标签（≥1 个） */
  tags: MathTag[];
}

/** 原卷的一道大题 */
export interface MathPaperSection {
  title: string;
  questionIds: string[];
}

/** 一份试卷 */
export interface MathPaper {
  id: string;
  title: string;
  source: string;
  answerSource: '原卷附答案' | '附件答案' | '本站整理';
  sections: MathPaperSection[];
  questions: MathQuestion[];
}
