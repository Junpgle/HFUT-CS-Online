import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { decks, homeData } from '../content';
import { decodeEntities } from '../lib/text';
import { IconSearch, IconX } from './icons';

export interface SearchIndexItem {
  kind: '章节' | '动画' | '题目' | '试卷';
  /** 所属讲次/章节 id；null = 课程首页 */
  unit: string | null;
  unitTitle: string;
  sectionId: string;
  text: string;
}

/** 空搜索结果时给出的示例关键词 */
const ALGO_SUGGESTIONS = ['Θ 记号', 'LCS', '主方法', '哈夫曼', '循环不变式', 'BFPRT'];

/** 概览行里每种条目的计数文案（固定顺序） */
const KIND_UNITS: Record<SearchIndexItem['kind'], string> = {
  章节: '个章节',
  动画: '个动画',
  题目: '道自测题',
  试卷: '份试卷',
};

const stripTags = (s: string) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

/** 结果文本里的命中片段：主题色加重标出（不铺底色），扫读时直接定位 */
function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim().toLowerCase();
  const i = q ? text.toLowerCase().indexOf(q) : -1;
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="pi-mark">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

/** 算法课的搜索索引：各讲目录 / 动画 / 自测题 + 总目录 */
export function buildAlgoIndex(): SearchIndexItem[] {
  const items: SearchIndexItem[] = [];
  for (const deck of decks) {
    const demoSection = new Map<string, string>();
    const quizSectionIds = new Set<string>();
    for (const sec of deck.sections) {
      for (const b of sec.blocks) {
        if (b.type === 'demo' && !demoSection.has(b.name)) demoSection.set(b.name, sec.id);
        if (b.type === 'quiz') quizSectionIds.add(sec.id);
      }
    }
    for (const t of deck.toc) {
      items.push({ kind: '章节', unit: deck.id, unitTitle: decodeEntities(deck.title), sectionId: t.id, text: decodeEntities(t.text) });
    }
    for (const [name, secId] of demoSection) {
      const block = deck.sections.flatMap((s) => s.blocks).find((b) => b.type === 'demo' && b.name === name);
      const title = block && block.type === 'demo' ? decodeEntities(block.title) : name;
      items.push({ kind: '动画', unit: deck.id, unitTitle: decodeEntities(deck.title), sectionId: secId, text: title });
    }
    for (const sec of deck.sections) {
      if (!quizSectionIds.has(sec.id)) continue;
      for (const b of sec.blocks) {
        if (b.type !== 'quiz') continue;
        items.push({
          kind: '题目',
          unit: deck.id,
          unitTitle: decodeEntities(deck.title),
          sectionId: sec.id,
          text: decodeEntities(stripTags(b.quiz.question)).slice(0, 64),
        });
      }
    }
  }
  for (const t of homeData.toc) {
    items.push({ kind: '章节', unit: null, unitTitle: '总目录', sectionId: t.id, text: decodeEntities(t.text) });
  }
  return items;
}

interface Props {
  /** 搜索索引（由各课程自行构建） */
  index: SearchIndexItem[];
  /** 条目 → 跳转路由 */
  linkTo: (item: SearchIndexItem) => string;
  /** 空结果时的示例关键词 */
  suggestions?: string[];
}

/**
 * 顶栏内联搜索框：点击在原位展开输入框，下拉菜单展示结果 / 概览，
 * 不再弹出居中的覆盖层。索引与跳转由课程注入，本组件只管交互与样式。
 */
export default function SearchBox({ index, linkTo, suggestions = ALGO_SUGGESTIONS }: Props) {
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const it of index) c[it.kind] = (c[it.kind] ?? 0) + 1;
    return c;
  }, [index]);

  const statsLabel = useMemo(
    () =>
      (Object.keys(KIND_UNITS) as SearchIndexItem['kind'][])
        .filter((k) => counts[k])
        .map((k) => `${counts[k]} ${KIND_UNITS[k]}`)
        .join(' · '),
    [counts],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const hits: { item: SearchIndexItem; score: number }[] = [];
    for (const item of index) {
      const hay = item.text.toLowerCase();
      const idx = hay.indexOf(q);
      if (idx < 0) continue;
      hits.push({ item, score: idx === 0 ? 0 : idx < 6 ? 1 : 2 });
      if (hits.length > 400) break;
    }
    return hits.sort((a, b) => a.score - b.score).slice(0, 12).map((h) => h.item);
  }, [query, index]);

  // 点击容器外部关闭
  useEffect(() => {
    if (!open) return;
    const onDown = (e: globalThis.MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  useEffect(() => setActive(0), [query]);

  const select = (item: SearchIndexItem) => {
    setOpen(false);
    navigate(linkTo(item));
  };

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      if (results[active]) select(results[active]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div className="search-box" ref={boxRef}>
      <input
        ref={inputRef}
        className="search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={() => setOpen(true)}
        onClick={() => setOpen(true)}
        placeholder="搜索"
        aria-label="搜索关键词"
        aria-haspopup="listbox"
        aria-expanded={open}
      />
      <span className="search-icon" aria-hidden="true">
        <IconSearch size={15} />
      </span>
      {query && (
        <button
          type="button"
          className="search-clear"
          aria-label="清空搜索词"
          onClick={() => {
            setQuery('');
            inputRef.current?.focus();
          }}
        >
          <IconX size={13} />
        </button>
      )}
      <AnimatePresence>
        {open && (
          <motion.div
            className="search-drop"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -6, scaleY: 0.96 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6, scaleY: 0.96 }}
            transition={{ duration: 0.16, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ transformOrigin: 'top right' }}
            role="listbox"
            aria-label="搜索结果"
          >
            <ul className="search-list">
              {results.length === 0 && (
                <li className="palette-empty">
                  {query ? (
                    <>
                      没有匹配的内容
                      <span className="palette-suggest">
                        试试：
                        {suggestions.map((s) => (
                          <button key={s} type="button" className="palette-chip" onClick={() => setQuery(s)}>
                            {s}
                          </button>
                        ))}
                      </span>
                    </>
                  ) : (
                    <span className="palette-overview">
                      {statsLabel && <span className="palette-stats">{statsLabel}</span>}
                      <span className="palette-suggest">
                        热门：
                        {suggestions.map((s) => (
                          <button key={s} type="button" className="palette-chip" onClick={() => setQuery(s)}>
                            {s}
                          </button>
                        ))}
                      </span>
                    </span>
                  )}
                </li>
              )}
              {results.map((item, i) => (
                <li
                  key={`${item.unit}-${item.sectionId}-${i}`}
                  className={`palette-item${i === active ? ' active' : ''}`}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => select(item)}
                >
                  <span className="pi-kind">{item.kind}</span>
                  <span className="pi-text">
                    <Highlight text={item.text} query={query} />
                  </span>
                  <span className="pi-path">{item.unit ? item.unitTitle : '首页'}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
