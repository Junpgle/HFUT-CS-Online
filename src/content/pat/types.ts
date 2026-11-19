/** 「程序设计艺术与方法」课程的数据契约 —— 复用算法课的 DeckData/Section/Block 结构 */
import type { DeckData } from '../types';

export type { DeckData, Section, TocEntry, Block, QuizData } from '../types';

/** 本课程的一个讲次/讲义章 */
export type PatDeck = DeckData;

/** 在线练习知识点标签：deck 为讲次号 1..6（对应 patDecks），sec 为目标 section id */
export interface PatTag {
  deck: number;
  /** 目标 section id（对应 deckN 的 toc / sections，跳转用 ?s=） */
  sec: string;
  /** 标签显示文本（纯文本），渲染时加讲次徽章 */
  text: string;
}

/** 一道赛题（question/answer/explanation 为可信 HTML 片段；编程题不判分，作参考答案展示） */
export interface PatQuestion {
  /** 试卷内唯一 id，如 'a'（赛题 A） */
  id: string;
  /** 赛题字母编号，如 'A' */
  no: string;
  /** 题目名，如「机器人足球」 */
  title: string;
  /** 时间限制原文，如 '2s' */
  time: string;
  /** 题面 HTML（描述/输入/输出/样例，紧扣原卷） */
  question: string;
  /** 参考思路（HTML，本站整理，不判分） */
  answer: string;
  /** 解析与要点（HTML，本站整理） */
  explanation: string;
  /** 知识点标签（≥1 个，可点击跳转对应讲次位置） */
  tags: PatTag[];
}

/** 一份试卷（试题文件夹按试卷整理） */
export interface PatPaper {
  /** 路由 id */
  id: string;
  /** 展示名 */
  title: string;
  /** 来源说明（原卷文件名） */
  source: string;
  /** 参考答案来源说明：'原卷附答案' | '本站整理' */
  answerSource: '原卷附答案' | '本站整理';
  questions: PatQuestion[];
}
