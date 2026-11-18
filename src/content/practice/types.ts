/** 在线练习题库的数据契约（question/options/answer/explanation 为可信 HTML 片段） */

export type PracticeKind = 'single' | 'multi' | 'judge' | 'fill' | 'essay';

/** 知识点标签：点击跳转到对应讲次的 section（/deck/deckN?s=secId） */
export interface PracticeTag {
  /** 讲次 1..8 */
  deck: number;
  /** 目标 section id（对应 deckN 的 toc / sections，跳转用 ?s=） */
  sec: string;
  /** 标签显示文本（纯文本，如「主方法」），渲染时加讲次前缀 */
  text: string;
}

export interface PracticeQuestion {
  /** 全库唯一 id，如 's1'…'s100'、'm1'…、'j1'…、'f1'…、'e1'…'e20' */
  id: string;
  kind: PracticeKind;
  /** 题干 HTML */
  question: string;
  /** 选项 HTML（single/multi/judge 有；judge 固定为 ['对', '错']；fill/essay 无） */
  options?: string[];
  /**
   * 答案原文：
   * single: 'A'；multi: 'A、C'；judge: '对' / '错'；
   * fill: 文本（可用全角「｜」分隔多个可接受写法，判分时逐个比对、忽略空白差异）；
   * essay: 参考答案（HTML，直接展示，不判分）
   */
  answer: string;
  /** 解析 HTML（essay 里是「解析与评分要点」） */
  explanation: string;
  /** 知识点标签（≥1 个，可点击跳转对应讲次位置） */
  tags: PracticeTag[];
}

/** 题型元信息（页签展示用） */
export const KIND_META: Record<PracticeKind, { label: string; total: number }> = {
  single: { label: '单选题', total: 100 },
  multi: { label: '多选题', total: 100 },
  judge: { label: '判断题', total: 100 },
  fill: { label: '填空题', total: 100 },
  essay: { label: '简答题', total: 20 },
};
