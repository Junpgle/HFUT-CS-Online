/** 程序设计基础课程的数据契约 —— 章节页复用上游的 DeckData/Section/Block 结构 */
import type { DeckData } from '../types';

export type { DeckData, Section, TocEntry, Block, QuizData } from '../types';

/** 程序设计基础课程的一章（第 1～9、11、12 章，课件 PPT 逐节整理） */
export type PdChapter = DeckData;
