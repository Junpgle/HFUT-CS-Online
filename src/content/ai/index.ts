/* 人工智能原理内容索引 —— 课件为 0，仅一份设计报告题库（单试卷直接展示，无试卷列表页） */
import type { AiPaper, PracticeQuestion } from './types';
import bank from './bank';

export type { AiPaper, AiSection, PracticeQuestion } from './types';

export const aiPaper: AiPaper = bank;

/** 题库全部题目的扁平视图（测试与统计用） */
export const aiAllQuestions: PracticeQuestion[] = aiPaper.questions;
