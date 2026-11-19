/* 人工智能原理内容类型 —— 课件为 0，站点只收录设计报告题库的在线练习 */
import type { PracticeQuestion } from '../practice/types';

export type { PracticeQuestion, PracticeTag } from '../practice/types';

/** 题库的一个方向（= 原文档的一章）：方向级背景知识 + 该方向的设计题目 */
export interface AiSection {
  /** dir-1 … dir-5，标签跳转与 ?s= 定位用 */
  id: string;
  /** 方向全名，如「启发式搜索」 */
  title: string;
  /** 顶栏按钮短文案 */
  short: string;
  /** 方向号 1~5 */
  no: number;
  /** 方向级「实验目的/方法/背景知识」（原文档方向章的一~三节）；可为空（四、五两节无章前导） */
  brief: string;
  questionIds: string[];
}

/** 唯一的一份「试卷」：2023 设计报告题库 */
export interface AiPaper {
  id: string;
  title: string;
  /** 原文档出处 */
  source: string;
  /** 答案性质说明（如实标注：设计题无标准答案，展示报告要求与评分要点） */
  answerSource: string;
  /** 题库总说明（原文档首页） */
  intro: string;
  sections: AiSection[];
  questions: PracticeQuestion[];
}
