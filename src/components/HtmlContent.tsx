import { useEffect, useRef, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { decks } from '../content';
import { parseLegacyHref, scrollToId } from '../lib/scroll';

/* ------------------------------------------------------- 轻量语法着色 */
const TOKEN_RE =
  /(\/\/[^\n]*)|(\/\*[\s\S]*?\*\/)|("(?:[^"\\\n]|\\.)*")|('(?:[^'\\\n]|\\.)*')|(\b\d+(?:\.\d+)?\b)|(\b(?:for|while|if|else|return|do|then|to|downto|and|or|not|swap|int|void|char|bool|float|double|const|auto|include|iostream|algorithm|std|struct|new|delete|true|false|using|namespace|main|cout|cin|endl)\b)/g;

type Tok = { text: string; com: boolean };

/** 把整段代码切成 token 流（沿用原正则），供按行重排 */
function tokenize(text: string): Tok[] {
  const toks: Tok[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(text))) {
    if (m.index > last) toks.push({ text: text.slice(last, m.index), com: false });
    toks.push({ text: m[0], com: !!(m[1] || m[2]) });
    last = m.index + m[0].length;
  }
  if (last < text.length) toks.push({ text: text.slice(last), com: false });
  return toks;
}

function makeTokSpan(t: Tok, extra?: string) {
  const s = document.createElement('span');
  s.textContent = t.text;
  s.className = extra ? `tok-${t.com ? 'com' : extra}` : t.com ? 'tok-com' : '';
  return s;
}

/**
 * 语法着色 + 两段式行布局：每行拆成「语句 + 右对齐注释」两列（.cl），
 * 长行溢出时滚动的是注释而不是把注释拦腰截断在语句后面。
 */
function highlightCode(code: HTMLElement) {
  const toks = tokenize(code.textContent ?? '');
  const frag = document.createDocumentFragment();
  // 遇到注释 token 后，本行剩余内容都归入注释列（注释只会出现在行尾）
  const lines: { code: Tok[]; com: Tok[] }[] = [{ code: [], com: [] }];
  let inCom = false;
  for (const t of toks) {
    const parts = t.text.split('\n');
    parts.forEach((p, i) => {
      if (i > 0) {
        lines.push({ code: [], com: [] });
        inCom = false;
      }
      if (!p) return;
      const cur = lines[lines.length - 1];
      if (t.com || inCom) {
        inCom = true;
        cur.com.push({ text: p, com: true });
      } else {
        cur.code.push(t);
      }
    });
  }
  const KW_RE =
    /^(for|while|if|else|return|do|then|to|downto|and|or|not|swap|int|void|char|bool|float|double|const|auto|include|iostream|algorithm|std|struct|new|delete|true|false|using|namespace|main|cout|cin|endl)$/;
  for (const line of lines) {
    // 语句尾部的对齐空格交给注释列的 16px 间距，不再占宽
    while (line.code.length && /^\s+$/.test(line.code[line.code.length - 1].text)) line.code.pop();
    const row = document.createElement('span');
    row.className = 'cl';
    const codeEl = document.createElement('span');
    codeEl.className = 'cl-code';
    for (const t of line.code) {
      const kind = /^["']/.test(t.text) ? 'str' : /^\d/.test(t.text) ? 'num' : KW_RE.test(t.text) ? 'kw' : '';
      codeEl.appendChild(makeTokSpan(t, kind || undefined));
    }
    row.appendChild(codeEl);
    if (line.com.length) {
      const comEl = document.createElement('span');
      comEl.className = 'cl-com';
      for (const t of line.com) comEl.appendChild(makeTokSpan(t));
      row.appendChild(comEl);
    }
    frag.appendChild(row);
  }
  code.replaceChildren(frag);
}

/** 代码复制文本：两段式行布局（.cl 块级行）按行重组换行 */
function codePlainText(code: HTMLElement): string {
  const rows = code.querySelectorAll('.cl');
  if (rows.length === 0) return code.textContent ?? '';
  return Array.from(rows)
    .map((r) => (r.textContent ?? '').replace(/\u00a0/g, ''))
    .join('\n');
}

function enhance(root: HTMLElement) {
  // 代码块：语法着色 + 复制按钮
  for (const pre of Array.from(root.querySelectorAll<HTMLPreElement>('pre.code'))) {
    if (pre.dataset.enhanced) continue;
    pre.dataset.enhanced = '1';
    const code = pre.querySelector('code');
    if (code) highlightCode(code);

    const wrap = document.createElement('div');
    wrap.className = 'code-wrap';
    pre.replaceWith(wrap);
    wrap.appendChild(pre);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy-btn';
    btn.textContent = '复制';
    btn.addEventListener('click', () => {
      navigator.clipboard
        ?.writeText(code ? codePlainText(code) : '')
        .then(() => {
          btn.textContent = '已复制';
          window.setTimeout(() => (btn.textContent = '复制'), 1400);
        })
        .catch(() => (btn.textContent = '复制失败'));
    });
    wrap.appendChild(btn);
  }

  // 宽表格：包一层横向滚动容器
  for (const tbl of Array.from(root.querySelectorAll<HTMLTableElement>('table.tbl'))) {
    if (tbl.dataset.enhanced) continue;
    tbl.dataset.enhanced = '1';
    const scroll = document.createElement('div');
    scroll.className = 'tbl-scroll';
    tbl.replaceWith(scroll);
    scroll.appendChild(tbl);
  }

  // 代码对：窄屏下提供「伪代码 / C++」切换（宽屏仍是并排双栏，由 CSS 控制）
  for (const pair of Array.from(root.querySelectorAll<HTMLDivElement>('.code-pair'))) {
    if (pair.dataset.enhanced) continue;
    const cols = pair.querySelectorAll(':scope > .code-col');
    if (cols.length !== 2) continue;
    pair.dataset.enhanced = '1';
    const bar = document.createElement('div');
    bar.className = 'code-tabs';
    bar.setAttribute('role', 'tablist');
    bar.setAttribute('aria-label', '切换代码列');
    const names = ['伪代码', 'C++'];
    cols.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'code-tab';
      b.setAttribute('role', 'tab');
      b.textContent = names[i] ?? `列 ${i + 1}`;
      b.addEventListener('click', () => {
        pair.classList.add('tabbed');
        cols.forEach((c, j) => c.classList.toggle('active', i === j));
        bar.querySelectorAll('.code-tab').forEach((t, j) => t.classList.toggle('active', i === j));
      });
      bar.appendChild(b);
    });
    pair.prepend(bar);
  }

  // 首页讲次卡片：补充「N 个动画 · M 道自测」元信息，便于扫读比较
  for (const a of Array.from(root.querySelectorAll<HTMLAnchorElement>('.deck-map a.card'))) {
    if (a.dataset.enhanced) continue;
    a.dataset.enhanced = '1';
    const href = a.getAttribute('href') ?? '';
    const m = href.match(/deck(\d)\.html/) ?? href.match(/deck\/deck(\d)/);
    if (!m) continue;
    const deck = decks.find((d) => d.id === `deck${m[1]}`);
    if (!deck) continue;
    const demos = deck.sections.reduce((n, s) => n + s.blocks.filter((b) => b.type === 'demo').length, 0);
    const quiz = deck.sections.reduce((n, s) => n + s.blocks.filter((b) => b.type === 'quiz').length, 0);
    const meta = document.createElement('p');
    meta.className = 'card-meta';
    meta.textContent = `${demos} 个动画 · ${quiz} 道自测`;
    a.appendChild(meta);
  }

  // 插图图版：内容里的 <svg class="fig"> 包一层 <figure>，挂上点击放大（lightbox）
  for (const svg of Array.from(root.querySelectorAll<SVGElement>('svg.fig'))) {
    if (svg.dataset.figEnhanced) continue;
    svg.dataset.figEnhanced = '1';
    const plate = document.createElement('figure');
    plate.className = 'fig has-lightbox';
    svg.classList.remove('fig');
    svg.replaceWith(plate);
    plate.appendChild(svg);
    // 相邻的题注收进图版，缩放时一起看
    const cap = plate.nextElementSibling;
    if (cap && cap.classList.contains('fig-cap')) plate.appendChild(cap);
    plate.addEventListener('click', () => openLightbox(plate, svg));
  }
}

/** 插图 lightbox：克隆 SVG 到全屏浮层，点击遮罩 / Esc / 关闭按钮退出 */
function openLightbox(fig: HTMLElement, svg: SVGElement) {
  if (document.querySelector('.fig-lightbox')) return;
  const overlay = document.createElement('div');
  overlay.className = 'fig-lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-label', '插图放大视图');
  const panel = document.createElement('div');
  panel.className = 'fig-lightbox-panel';
  const clone = svg.cloneNode(true) as SVGElement;
  clone.removeAttribute('style');
  clone.setAttribute('width', '100%');
  clone.setAttribute('height', 'auto');
  panel.appendChild(clone);
  const cap = fig.querySelector('.fig-cap, figcaption');
  if (cap) {
    const capEl = document.createElement('p');
    capEl.className = 'fig-lightbox-cap';
    capEl.textContent = cap.textContent ?? '';
    panel.appendChild(capEl);
  }
  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'fig-lightbox-close';
  closeBtn.setAttribute('aria-label', '关闭放大视图');
  closeBtn.textContent = '×';
  const close = () => {
    overlay.remove();
    document.removeEventListener('keydown', onKey);
    document.body.style.overflow = '';
  };
  const onKey = (e: globalThis.KeyboardEvent) => {
    if (e.key === 'Escape') close();
  };
  overlay.appendChild(panel);
  overlay.appendChild(closeBtn);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', onKey);
  document.body.style.overflow = 'hidden';
  document.body.appendChild(overlay);
}

/* ------------------------------------------------------- 组件 */
interface Props {
  html: string;
}

export default function HtmlContent({ html }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (ref.current) enhance(ref.current);
  }, [html]);

  // 全局委托：页内锚点平滑滚动；旧静态页链接转为路由跳转
  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    const a = (e.target as HTMLElement).closest('a');
    if (!a) return;
    const href = a.getAttribute('href') ?? '';

    if (href.startsWith('#')) {
      e.preventDefault();
      scrollToId(href.slice(1));
      return;
    }
    const legacy = parseLegacyHref(href);
    if (legacy) {
      e.preventDefault();
      if (legacy.deck) {
        navigate(legacy.section ? `/deck/${legacy.deck}?s=${legacy.section}` : `/deck/${legacy.deck}`);
      } else if (legacy.section) {
        navigate(`/?s=${legacy.section}`);
      } else {
        navigate('/');
      }
    }
  };

  return <div ref={ref} onClick={onClick} dangerouslySetInnerHTML={{ __html: html }} />;
}
