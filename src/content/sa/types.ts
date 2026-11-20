/** 软件体系结构课程的数据契约 —— 章节页复用算法课的 DeckData/Section/Block 结构 */
import type { DeckData } from '../types';

export type { DeckData, Section, TocEntry, Block, QuizData } from '../types';

/** 软件体系结构课程的一个章（第4/5/7章 + RSA 专题） */
export type SaChapter = DeckData;
