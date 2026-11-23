/** 内容数据结构 —— 由 scripts/migrate.mjs 生成的模块遵循这些契约 */

export type QuizKind = 'single' | 'multi' | 'judge' | 'fill';

/** 自测题结构化数据（question/options/answer/explanation 均为可信 HTML 片段） */
export interface QuizData {
  kind: QuizKind;
  /** 题干 HTML（含原始编号） */
  question: string;
  /** 知识点标签，如「线性时间排序 · 原卷 5」 */
  tag?: string;
  /** 选项 HTML（single/multi/judge 有，fill 无） */
  options?: string[];
  /** 答案原文：'A' / 'A、B、C' / '对' / '18' / '根节点索引 r' */
  answer: string;
  /** 解析 HTML */
  explanation: string;
  /** 补充勘误 / 记忆注 HTML */
  note?: string;
}

export type Block =
  | { type: 'html'; html: string }
  | { type: 'demo'; name: string; title: string }
  | { type: 'quiz'; quiz: QuizData };

export interface TocEntry {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface Section {
  id: string;
  heading: string;
  blocks: Block[];
}

export interface DeckData {
  id: string;
  /** 讲次，如「第 1 讲」；home 为空串 */
  no: string;
  title: string;
  subtitle: string;
  lede: string;
  toc: TocEntry[];
  sections: Section[];
}

/**
 * 一条读者勘误：把某页面里的一段文字 old 改成 new。
 * page 为 HashRouter 路由（如 /os/chapter/ch1）；anchor 是最近的章节标题，
 * 用于在页面里定位同文重复出现的位置；occurrence 是同锚点下第几次出现。
 */
export interface ErrataChange {
  page: string;
  anchor?: string;
  old: string;
  new: string;
  occurrence?: number;
}

/** src/content/errata/*.json 的契约；合并后由站点在渲染时套用 */
export interface ErrataPatch {
  version: 1;
  /** 文件名（不含扩展名），如 20261123-091011-a1b2 */
  id: string;
  /** ISO 时间戳 */
  createdAt: string;
  /** 提交页标题，便于 PR 标题阅读 */
  pageTitle?: string;
  /** 读者备注 */
  note?: string;
  changes: ErrataChange[];
}
