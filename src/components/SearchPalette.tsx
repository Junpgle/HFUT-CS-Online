import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { decks, homeData } from '../content';
import { decodeEntities } from '../lib/text';
import { IconSearch } from './icons';

interface Props {
  open: boolean;
  onClose: () => void;
}

/** 空搜索结果时给出的示例关键词 */
const SUGGESTIONS = ['Θ 记号', 'LCS', '主方法', '哈夫曼', '循环不变式', 'BFPRT'];

interface IndexItem {
  kind: '章节' | '动画' | '题目';
  deck: string | null; // null = 首页
  deckTitle: string;
  sectionId: string;
  text: string;
}

const stripTags = (s: string) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

function buildIndex(): IndexItem[] {
  const items: IndexItem[] = [];
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
      items.push({ kind: '章节', deck: deck.id, deckTitle: decodeEntities(deck.title), sectionId: t.id, text: decodeEntities(t.text) });
    }
    for (const [name, secId] of demoSection) {
      const block = deck.sections.flatMap((s) => s.blocks).find((b) => b.type === 'demo' && b.name === name);
      const title = block && block.type === 'demo' ? decodeEntities(block.title) : name;
      items.push({ kind: '动画', deck: deck.id, deckTitle: decodeEntities(deck.title), sectionId: secId, text: title });
    }
    for (const sec of deck.sections) {
      if (!quizSectionIds.has(sec.id)) continue;
      for (const b of sec.blocks) {
        if (b.type !== 'quiz') continue;
        items.push({
          kind: '题目',
          deck: deck.id,
          deckTitle: decodeEntities(deck.title),
          sectionId: sec.id,
          text: decodeEntities(stripTags(b.quiz.question)).slice(0, 64),
        });
      }
    }
  }
  for (const t of homeData.toc) {
    items.push({ kind: '章节', deck: null, deckTitle: '总目录', sectionId: t.id, text: decodeEntities(t.text) });
  }
  return items;
}

export default function SearchPalette({ open, onClose }: Props) {
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [phIdx, setPhIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const index = useMemo(buildIndex, []);

  const counts = useMemo(() => {
    const c = { 章节: 0, 动画: 0, 题目: 0 };
    for (const it of index) c[it.kind] += 1;
    return c;
  }, [index]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const hits: { item: IndexItem; score: number }[] = [];
    for (const item of index) {
      const hay = item.text.toLowerCase();
      const idx = hay.indexOf(q);
      if (idx < 0) continue;
      hits.push({ item, score: idx === 0 ? 0 : idx < 6 ? 1 : 2 });
      if (hits.length > 400) break;
    }
    return hits.sort((a, b) => a.score - b.score).slice(0, 24).map((h) => h.item);
  }, [query, index]);

  // 轮播占位提示：让搜索能力（能搜到什么）在打开的第一眼就可见
  useEffect(() => {
    if (!open || reduced || query) return;
    const id = window.setInterval(() => setPhIdx((i) => (i + 1) % SUGGESTIONS.length), 2800);
    return () => window.clearInterval(id);
  }, [open, reduced, query]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      setPhIdx(0);
      window.setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  useEffect(() => setActive(0), [query]);

  if (!open) return null;

  const select = (item: IndexItem) => {
    onClose();
    if (item.deck) navigate(`/deck/${item.deck}?s=${item.sectionId}`);
    else navigate(`/?s=${item.sectionId}`);
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
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="palette-scrim"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onClick={onClose}
      />
      <motion.div
        className="palette"
        role="dialog"
        aria-label="搜索手册"
        initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -10 }}
        animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
        exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -10 }}
        transition={{ type: 'spring', stiffness: 480, damping: 34 }}
        style={{ transformOrigin: 'top right' }}
        onKeyDown={onKeyDown}
      >
        <div className="palette-input">
          <IconSearch size={17} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={query ? '' : `搜索：${SUGGESTIONS[phIdx]}…`}
            aria-label="搜索关键词"
          />
        </div>
        <ul className="palette-list">
          {results.length === 0 && (
            <li className="palette-empty">
              {query ? (
                <>
                  没有匹配的内容
                  <span className="palette-suggest">
                    试试：
                    {SUGGESTIONS.map((s) => (
                      <button key={s} type="button" className="palette-chip" onClick={() => setQuery(s)}>
                        {s}
                      </button>
                    ))}
                  </span>
                </>
              ) : (
                <span className="palette-overview">
                  <span className="palette-stats">
                    {counts['章节']} 个章节 · {counts['动画']} 个动画 · {counts['题目']} 道自测题
                  </span>
                  <span className="palette-suggest">
                    热门：
                    {SUGGESTIONS.map((s) => (
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
              key={`${item.deck}-${item.sectionId}-${i}`}
              className={`palette-item${i === active ? ' active' : ''}`}
              onMouseEnter={() => setActive(i)}
              onClick={() => select(item)}
            >
              <span className="pi-kind">{item.kind}</span>
              <span className="pi-text">{item.text}</span>
              <span className="pi-path">{item.deck ? item.deckTitle : '首页'}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </AnimatePresence>
  );
}
