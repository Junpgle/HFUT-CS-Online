/** 系统硬件综合设计课程的数据契约 —— 章节页复用上游的 DeckData/Section/Block 结构 */
import type { DeckData } from '../types';

export type { DeckData, Section, TocEntry, Block, QuizData } from '../types';

/** 系统硬件综合设计课程的一讲（4 份课件逐节整理） */
export type HdUnit = DeckData;
