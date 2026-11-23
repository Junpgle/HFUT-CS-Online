import { anchorText, collectBlocks } from './dom';
import { replaceTextRange, textEdit } from './diff';

/** 一条待提交的勘误（与 ErrataChange 对应，额外保留 DOM 引用用于撤销 / 定位） */
export interface PendingChange {
  key: string;
  page: string;
  anchor: string;
  original: string;
  next: string;
  occurrence: number;
  el: HTMLElement | null;
}

interface BlockInfo {
  key: string;
  el: HTMLElement;
  page: string;
  original: string;
  anchor: string;
  order: number;
}

/** 浏览器是否支持纯文本 contenteditable（Chrome/Safari 已支持，Firefox 回落 true） */
function supportsPlaintextOnly(): boolean {
  try {
    const probe = document.createElement('div');
    probe.setAttribute('contenteditable', 'plaintext-only');
    return probe.contentEditable === 'plaintext-only';
  } catch {
    return false;
  }
}

function inDocumentOrder(a: BlockInfo, b: BlockInfo): number {
  if (a.el === b.el) return 0;
  if (!a.el.isConnected || !b.el.isConnected) return a.order - b.order;
  return a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
}

/**
 * 一次编辑会话：把当前页的正文单元标成 contenteditable，记录每处改动，
 * 退出编辑后改动仍留在页面上（提交前可逐条撤销）。
 */
export class ErrataSession {
  onChange: (() => void) | null = null;

  private readonly plain = supportsPlaintextOnly();
  private blocks = new Map<HTMLElement, BlockInfo>();
  private changes = new Map<string, PendingChange>();
  private root: HTMLElement | null = null;
  private page = '';
  private seq = 0;
  private ac: AbortController | null = null;

  enter(root: HTMLElement, page: string): void {
    this.leave();
    this.root = root;
    this.page = page;
    const ac = new AbortController();
    this.ac = ac;
    const opts = { signal: ac.signal };
    root.addEventListener('input', this.onInput, opts);
    root.addEventListener('focusout', this.onFocusOut, opts);
    root.addEventListener('keydown', this.onKeyDown, opts);
    root.addEventListener('paste', this.onPaste, opts);
    root.addEventListener('dragstart', this.onBlockDrag, opts);
    root.addEventListener('drop', this.onBlockDrag, opts);
    root.addEventListener('click', this.onClickCapture, { signal: ac.signal, capture: true });
    this.sync();
  }

  /** 幂等补齐新出现的正文单元（React 局部重渲染后仍可编辑） */
  sync(): void {
    if (!this.root) return;
    const blocks = collectBlocks(this.root);
    let order = 0;
    for (const el of blocks) {
      const existing = this.blocks.get(el);
      if (existing) {
        existing.order = order++;
        continue;
      }
      const info: BlockInfo = {
        key: `k${++this.seq}`,
        el,
        page: this.page,
        original: el.textContent ?? '',
        anchor: anchorText(el, this.root),
        order: order++,
      };
      this.blocks.set(el, info);
      this.mark(el);
    }
    for (const [el, info] of this.blocks) {
      if (!el.isConnected) {
        this.blocks.delete(el);
        const rec = this.changes.get(info.key);
        if (rec) rec.el = null;
      }
    }
  }

  leave(): void {
    this.ac?.abort();
    this.ac = null;
    for (const el of this.blocks.keys()) {
      el.removeAttribute('contenteditable');
      el.removeAttribute('spellcheck');
      delete el.dataset.errataEdit;
      el.classList.remove('errata-edit-target');
    }
    this.blocks.clear();
    this.root = null;
    this.page = '';
  }

  records(): PendingChange[] {
    return Array.from(this.changes.values());
  }

  count(): number {
    return this.changes.size;
  }

  clear(): void {
    this.changes.clear();
    this.emit();
  }

  /** 把已记录的改动重新套回当前 DOM（离开某页再回来时，改动不丢） */
  applyPending(page: string): void {
    if (!this.root) return;
    const recs = Array.from(this.changes.values())
      .filter((r) => r.page === page)
      .sort((a, b) => b.occurrence - a.occurrence);
    for (const rec of recs) {
      const pool = Array.from(this.blocks.values())
        .filter(
          (info) =>
            info.page === page &&
            info.original === rec.original &&
            (!rec.anchor || info.anchor === rec.anchor),
        )
        .sort(inDocumentOrder);
      const target = pool[rec.occurrence]?.el;
      if (!target) continue;
      if ((target.textContent ?? '') === rec.next) {
        rec.el = target;
        continue;
      }
      if ((target.textContent ?? '') !== rec.original) continue;
      const { start, oldEnd, insert } = textEdit(rec.original, rec.next);
      replaceTextRange(target, start, oldEnd, insert);
      rec.el = target;
    }
  }

  /** 撤销单条：把该单元恢复成提交前的原文 */
  revert(key: string): void {
    const rec = this.changes.get(key);
    if (!rec) return;
    const el = rec.el;
    if (el && el.isConnected) {
      const cur = el.textContent ?? '';
      if (cur !== rec.original) {
        const { start, oldEnd, insert } = textEdit(cur, rec.original);
        replaceTextRange(el, start, oldEnd, insert);
      }
    }
    this.changes.delete(key);
    this.emit();
  }

  private mark(el: HTMLElement): void {
    el.dataset.errataEdit = '';
    el.classList.add('errata-edit-target');
    el.setAttribute('contenteditable', this.plain ? 'plaintext-only' : 'true');
    el.setAttribute('spellcheck', 'false');
  }

  private editableFrom(target: EventTarget | null): HTMLElement | null {
    if (!(target instanceof Element)) return null;
    const el = target.closest<HTMLElement>('[data-errata-edit]');
    return el && this.blocks.has(el) ? el : null;
  }

  /** 记录/刷新一个单元的改动；改回原文则自动移除该条 */
  private capture(el: HTMLElement): void {
    const info = this.blocks.get(el);
    if (!info) return;
    const text = el.textContent ?? '';
    const existing = this.changes.get(info.key);
    if (text === info.original) {
      if (existing) {
        this.changes.delete(info.key);
        this.emit();
      }
      return;
    }
    const occurrence = this.occurrenceOf(info);
    if (existing && existing.next === text && existing.occurrence === occurrence) return;
    this.changes.set(info.key, {
      key: info.key,
      page: info.page,
      anchor: info.anchor,
      original: info.original,
      next: text,
      occurrence,
      el,
    });
    this.emit();
  }

  /** 同一锚点下，同原文的单元里排第几个（用于提交后精确定位） */
  private occurrenceOf(info: BlockInfo): number {
    let n = 0;
    for (const other of this.blocks.values()) {
      if (other === info) continue;
      if (other.page !== info.page || other.anchor !== info.anchor || other.original !== info.original) continue;
      if (!other.el.isConnected || !info.el.isConnected) {
        if (other.order < info.order) n++;
        continue;
      }
      if (info.el.compareDocumentPosition(other.el) & Node.DOCUMENT_POSITION_PRECEDING) n++;
    }
    return n;
  }

  private emit(): void {
    this.onChange?.();
  }

  private onInput = (e: Event): void => {
    const el = this.editableFrom(e.target);
    if (el) this.capture(el);
  };

  private onFocusOut = (e: Event): void => {
    const el = this.editableFrom(e.target);
    if (el) this.capture(el);
  };

  private onKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Enter' && this.editableFrom(e.target)) {
      // 纯文本勘误不需要换行；拦住回车可避免 contenteditable 插入 <div>/<br>
      e.preventDefault();
    }
  };

  private onPaste = (e: ClipboardEvent): void => {
    const el = this.editableFrom(e.target);
    if (!el) return;
    e.preventDefault();
    const text = (e.clipboardData?.getData('text/plain') ?? '').replace(/\s*\r?\n+\s*/g, ' ');
    if (!text) return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    range.deleteContents();
    const node = document.createTextNode(text);
    range.insertNode(node);
    range.setStartAfter(node);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    this.capture(el);
  };

  private onBlockDrag = (e: Event): void => {
    if (this.editableFrom(e.target)) e.preventDefault();
  };

  private onClickCapture = (e: MouseEvent): void => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    // 编辑态下链接不跳转，避免手势/误点离开页面
    if (t.closest('a[href]')) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    // 正文里的按钮、选项卡等交互先停用，防止答题/切换状态打断编辑
    if (!t.closest('[data-errata-edit]') && t.closest('button,summary,input,textarea,select,label,[role="button"]')) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
}
