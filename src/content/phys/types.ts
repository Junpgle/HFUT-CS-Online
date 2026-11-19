/** 「大学物理」课程的数据契约 —— 复用算法课的 DeckData/Section/Block 结构 */
import type { DeckData } from '../types';

export type { DeckData, Section, TocEntry, Block, QuizData } from '../types';

/** 本课程的一个章（课件按章组织：期中力学·热学·振动波 + 期末电磁学·光学） */
export type PhysDeck = DeckData;

/** 在线练习知识点标签：deck 为章号 1..12（对应 physDecks），sec 为目标 section id */
export interface PhysTag {
  deck: number;
  /** 目标 section id（对应 deckN 的 toc / sections，跳转用 ?s=） */
  sec: string;
  /** 标签显示文本（纯文本），渲染时加章号徽章 */
  text: string;
}

/** 一道大题（question/answer/explanation 为可信 HTML 片段） */
export interface PhysQuestion {
  /** 试卷内唯一 id，如 'q1' */
  id: string;
  /** 题号，如 '一' 或 '1' */
  no: string;
  /** 题型：简答/问答（essay，作答自评）或计算（calc，展示参考解答） */
  kind: 'essay' | 'calc';
  /** 题目短名，如「导体与介质」 */
  title: string;
  /** 分值原文，如 '9 分' */
  score: string;
  /** 题面 HTML（紧扣原卷） */
  question: string;
  /** 参考解答（HTML） */
  answer: string;
  /** 解析与要点（HTML，本站整理） */
  explanation: string;
  /** 知识点标签（≥1 个，可点击跳转对应章位置） */
  tags: PhysTag[];
}

/** 一份试卷（试题文件夹按试卷整理） */
export interface PhysPaper {
  /** 路由 id */
  id: string;
  /** 展示名 */
  title: string;
  /** 来源说明（原卷文件名） */
  source: string;
  /** 参考答案来源说明：'原卷附答案' | '本站整理' */
  answerSource: '原卷附答案' | '本站整理';
  questions: PhysQuestion[];
}
