/** 计算机网络课程的数据契约 —— 章节页复用算法课的 DeckData/Section/Block 结构 */
import type { DeckData } from '../types';

export type { DeckData, Section, TocEntry, Block, QuizData } from '../types';

/** 计算机网络课程的一个章（第1章…第7章） */
export type NetChapter = DeckData;

/**
 * 在线练习题目直接复用算法课题库契约：tags[].deck 存章号 1..7，
 * 答题页通过 tagNav 把它映射为 /net/deck/chN?s=sec。
 */
import type { PracticeQuestion } from '../practice/types';
export type { PracticeQuestion, PracticeTag, PracticeKind } from '../practice/types';

/** 原卷的一道大题（答题页按它分组展示） */
export interface NetPaperSection {
  /** 大题标题，如「一、单项选择题」 */
  title: string;
  /** 热力图分块的短标，如「单选」 */
  short: string;
  /** 该大题下的题目 id 列表（按原卷顺序） */
  questionIds: string[];
}

/** 一份试卷 */
export interface NetPaper {
  /** 路由 id，如 'paper-2021' */
  id: string;
  /** 展示名，如「2021～2022 学年第二学期期末试卷」 */
  title: string;
  /** 来源说明（原卷文件名），列表页与答题页展示 */
  source: string;
  /** 参考答案来源说明：'原卷附答案' | '本站整理' | 混合 */
  answerSource: string;
  /** 满分与考试信息（列表页展示，可空） */
  meta?: string;
  /** 答题页的答题区按大题分组 */
  sections: NetPaperSection[];
  questions: PracticeQuestion[];
}
