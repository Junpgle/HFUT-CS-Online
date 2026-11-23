/**
 * 勘误的文本层工具：定位「同一段文字里改了哪一截」，并在保留行内标签
 * （<strong> / <a> 等）的前提下替换 DOM 文本。
 *
 * 只在文本节点上做前缀/后缀裁剪，不改元素结构 —— 这是勘误能做到
 * 「原文里的粗体、链接、上下标原样保留」且 PR 只含一小段文字的原因。
 */

export interface TextEdit {
  /** 原文本中改动起点 */
  start: number;
  /** 原文本中改动终点（不含） */
  oldEnd: number;
  /** 替换进去的新文本 */
  insert: string;
}

/** 两串的公共前缀长度 */
export function commonPrefix(a: string, b: string): number {
  const max = Math.min(a.length, b.length);
  let i = 0;
  while (i < max && a[i] === b[i]) i++;
  return i;
}

/** 两串的公共后缀长度（不超过去掉公共前缀后的可用长度） */
export function commonSuffix(a: string, b: string, prefix: number): number {
  const max = Math.min(a.length, b.length) - prefix;
  let n = 0;
  while (n < max && a[a.length - 1 - n] === b[b.length - 1 - n]) n++;
  return n;
}

/** 把 oldText → newText 压成一段替换 */
export function textEdit(oldText: string, newText: string): TextEdit {
  const start = commonPrefix(oldText, newText);
  const suffix = commonSuffix(oldText, newText, start);
  return {
    start,
    oldEnd: oldText.length - suffix,
    insert: newText.slice(start, newText.length - suffix),
  };
}

/**
 * 在 root 的文字流里，把 [start, end) 换成 insert。
 * 逐文本节点处理，跨节点的改动会合并到第一处并清空后续片段；
 * 改动范围之外的文字与行内标签保持原样。
 */
export function replaceTextRange(root: Node, start: number, end: number, insert: string): void {
  const doc = root.ownerDocument ?? document;
  const walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let pos = 0;
  let inserted = false;
  let node: Text | null;
  while ((node = walker.nextNode() as Text | null)) {
    const len = node.data.length;
    const ns = pos;
    const ne = pos + len;
    pos = ne;
    if (ne <= start || ns >= end) continue;
    const a = Math.max(start, ns) - ns;
    const b = Math.min(end, ne) - ns;
    if (!inserted) {
      node.data = node.data.slice(0, a) + insert + node.data.slice(b);
      inserted = true;
    } else {
      node.data = node.data.slice(0, a) + node.data.slice(b);
    }
  }
  if (!inserted) root.appendChild(doc.createTextNode(insert));
}

export interface DiffView {
  /** 改动前的上下文 */
  lead: string;
  /** 被替换掉的原文 */
  remove: string;
  /** 替换后的新文 */
  add: string;
  /** 改动后的上下文 */
  tail: string;
}

const clean = (s: string) => s.replace(/\s+/g, ' ').trim();

/** 供审阅弹窗展示的「一小截」diff：去掉首尾空白、两侧留上下文、过长中间截断 */
export function diffView(oldText: string, newText: string, context = 26, maxMiddle = 160): DiffView {
  const a = clean(oldText);
  const b = clean(newText);
  const { start, oldEnd, insert } = textEdit(a, b);
  const clipped = (s: string) =>
    s.length > maxMiddle ? `${s.slice(0, maxMiddle)}…` : s;
  return {
    lead: (start > context ? '…' : '') + a.slice(Math.max(0, start - context), start),
    remove: clipped(a.slice(start, oldEnd)),
    add: clipped(insert),
    tail:
      a.slice(oldEnd, oldEnd + context) +
      (oldEnd + context < a.length ? '…' : ''),
  };
}
