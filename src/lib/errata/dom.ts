import type { ErrataChange, ErrataPatch } from '../../content/types';
import { errataPatches } from '../../content/errata';
import { replaceTextRange, textEdit } from './diff';

/**
 * 勘误的可编辑单元：正文里「一段带文字、且不含块级子元素」的叶子节点。
 * 这样 contenteditable 落在一段/一格/一行上，既不会把整章吞进去，
 * 也不会碰到按钮、代码块、动画等交互结构。
 */
const CANDIDATE_TAGS = [
  'P',
  'LI',
  'TD',
  'TH',
  'DT',
  'DD',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'BLOCKQUOTE',
  'FIGCAPTION',
  'CAPTION',
] as const;

const CANDIDATE_SEL = CANDIDATE_TAGS.join(',');

/** 含这些子元素的单元不是叶子，交给内层节点单独编辑 */
const BLOCK_SEL =
  'p,div,ul,ol,li,table,thead,tbody,tr,td,th,pre,blockquote,figure,figcaption,section,article,header,footer,h1,h2,h3,h4,h5,h6,dl,dt,dd,details,summary,form,fieldset,hr';

/** 交互 / 装饰 / 代码 / 动画结构：一律不做原地编辑 */
const SKIP_SEL =
  'pre,code,svg,button,input,textarea,select,option,label,nav,.demo,.code-wrap,.quiz-actions,.quiz-fill,.topic-map,.pq-rail,.pq-top,.section-capsule,.errata-ui,[data-no-errata]';

export function isEditableCandidate(el: Element, root: Element): el is HTMLElement {
  if (!root.contains(el)) return false;
  if (!(CANDIDATE_TAGS as readonly string[]).includes(el.tagName)) return false;
  if (el.closest(SKIP_SEL)) return false;
  if (el.querySelector('button,input,textarea,select,[contenteditable]')) return false;
  if (el.querySelector(BLOCK_SEL)) return false;
  const text = el.textContent ?? '';
  return text.trim().length > 0;
}

/** 按文档顺序收集当前页可编辑的文本单元 */
export function collectBlocks(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(CANDIDATE_SEL)).filter((el) =>
    isEditableCandidate(el, root),
  );
}

/**
 * 单元所属的章节标题：优先最近的 <section> 的 h2，其次往前找最近的标题，
 * 最后回落到页面 h1。用于在同文重复时限定查找范围。
 */
export function anchorText(el: Element, root: Element): string {
  const section = el.closest('section');
  if (section && root.contains(section)) {
    const heading = section.querySelector('h2');
    if (heading) {
      // Sections 把「1.」与标题拆成两个 span 渲染，直接取 textContent 会粘成「1四大…」
      const no = heading.querySelector('.h2-no')?.textContent?.trim() ?? '';
      const title = heading.querySelector('.h2-title')?.textContent?.trim() ?? '';
      if (no || title) return `${no} ${title}`.trim();
      return (heading.textContent ?? '').trim();
    }
  }
  let cur: Element | null = el;
  while (cur && cur !== root) {
    for (let sib = cur.previousElementSibling; sib; sib = sib.previousElementSibling) {
      if (/^H[1-4]$/.test(sib.tagName)) return (sib.textContent ?? '').trim();
      const inner = sib.querySelector('h1,h2,h3,h4');
      if (inner) return (inner.textContent ?? '').trim();
    }
    cur = cur.parentElement;
  }
  return (root.querySelector('h1')?.textContent ?? '').trim();
}

/**
 * 把一条勘误套用到当前页面：按 anchor + occurrence 找到那一个单元，
 * 再做「保留行内标签」的文字替换。找不到就静默跳过 —— 内容改版后
 * 旧勘误最多失效，绝不会改错位置。
 */
export function applyChange(root: HTMLElement, change: ErrataChange): boolean {
  if (!change.old) return false;
  const candidates = collectBlocks(root).filter((el) => (el.textContent ?? '') === change.old);
  if (candidates.length === 0) return false;
  const anchor = (change.anchor ?? '').trim();
  const scoped = anchor ? candidates.filter((el) => anchorText(el, root) === anchor) : [];
  const pool = scoped.length > 0 ? scoped : candidates;
  const target = pool[change.occurrence ?? 0];
  if (!target) return false;
  const { start, oldEnd, insert } = textEdit(change.old, change.new);
  replaceTextRange(target, start, oldEnd, insert);
  target.setAttribute('data-errata-fixed', '');
  return true;
}

/**
 * 套用所有已合并、且属于 page 的勘误。
 * 同一批里出现顺序按 occurrence 从大到小，避免两处相同原文互相挪位。
 */
export function applyPatches(root: HTMLElement, page: string, patches: ErrataPatch[] = errataPatches): number {
  let applied = 0;
  for (const patch of patches) {
    const changes = patch.changes
      .filter((c) => c.page === page)
      .sort((a, b) => (b.occurrence ?? 0) - (a.occurrence ?? 0));
    for (const change of changes) {
      if (applyChange(root, change)) applied++;
    }
  }
  return applied;
}
