import { useEffect, useRef, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { decks } from '../content';
import { parseLegacyHref, scrollToId } from '../lib/scroll';

/* ------------------------------------------------------- 轻量语法着色 */
const TOKEN_RE =
  /(\/\/[^\n]*)|(\/\*[\s\S]*?\*\/)|("(?:[^"\\\n]|\\.)*")|('(?:[^'\\\n]|\\.)*')|(\b\d+(?:\.\d+)?\b)|(\b(?:for|while|if|else|return|do|then|to|downto|and|or|not|swap|int|void|char|bool|float|double|const|auto|include|iostream|algorithm|std|struct|new|delete|true|false|using|namespace|main|cout|cin|endl)\b)/g;

function highlightCode(code: HTMLElement) {
  const text = code.textContent ?? '';
  const frag = document.createDocumentFragment();
  let last = 0;
  let m: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(text))) {
    if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
    const span = document.createElement('span');
    span.textContent = m[0];
    span.className = m[1] || m[2] ? 'tok-com' : m[5] ? 'tok-num' : m[6] ? 'tok-kw' : 'tok-kw';
    frag.appendChild(span);
    last = m.index + m[0].length;
  }
  if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
  code.replaceChildren(frag);
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
        ?.writeText(code?.textContent ?? '')
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
