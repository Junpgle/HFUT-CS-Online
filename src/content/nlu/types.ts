/** 自然语言理解课程的数据契约 —— 讲次页复用上游的 DeckData/Section/Block 结构 */
import type { DeckData } from '../types';

export type { DeckData, Section, TocEntry, Block, QuizData } from '../types';

/** 自然语言理解课程的一讲（课件《分词系统讲解》逐节整理） */
export type NluDeck = DeckData;
