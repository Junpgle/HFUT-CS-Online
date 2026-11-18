import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'motion/react';
import { practiceQuestions, KIND_META, type PracticeKind } from '../content/practice';
import { decks } from '../content';
import PracticeCard from '../components/practice/PracticeCard';
import { IconChevronUp } from '../components/icons';

/** 题型（固定顺序，页签展示） */
const KINDS: PracticeKind[] = ['single', 'multi', 'judge', 'fill', 'essay'];

/** 作答结果的持久化 key */
const STORE_KEY = 'practice-progress-v1';
type Result = 'right' | 'wrong' | 'revealed';

/** 右侧进度轨 / 吸顶摘要的分段大小 */
const SEGMENT = 10;

function loadResults(): Record<string, Result> {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, Result>) : {};
  } catch {
    return {};
  }
}

/** 滚动监听：rAF 节流，返回「视口顶部最近的题目序号」与「是否该出现置顶按钮」 */
function useScrollProbe(visibleLength: number, listResetKey: string) {
  const reduced = useReducedMotion();
  const [state, setState] = useState({ idx: 0, showTop: false });
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const cards = Array.from(document.querySelectorAll<HTMLElement>('.practice-q'));
      let idx = 0;
      for (let i = 0; i < cards.length; i++) {
        if (cards[i].getBoundingClientRect().top <= 140) idx = i;
        else break;
      }
      const next = { idx: Math.min(idx, Math.max(0, visibleLength - 1)), showTop: window.scrollY > 800 };
      setState((s) => (s.idx === next.idx && s.showTop === next.showTop ? s : next));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleLength, listResetKey, reduced]);
  return state;
}

export default function PracticePage() {
  const reduced = useReducedMotion();
  const [kind, setKind] = useState<PracticeKind>('single');
  const [deckFilter, setDeckFilter] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'undone' | 'wrong'>('all');
  const [results, setResults] = useState<Record<string, Result>>(() => loadResults());
  const firstFilterRun = useRef(true);

  // 持久化到 localStorage：验收 / 复习时刷新不丢进度
  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(results));
    } catch {
      /* 存储不可用时静默降级为会话内记忆 */
    }
  }, [results]);

  const onResult = (qid: string, r: Result) => setResults((s) => ({ ...s, [qid]: r }));

  const resetAll = () => {
    if (!window.confirm('清空全部作答进度？')) return;
    setResults({});
  };

  const bankOf = (k: PracticeKind) => practiceQuestions.filter((q) => q.kind === k);

  const countFor = (k: PracticeKind) => {
    const bank = bankOf(k);
    const done = bank.filter((q) => results[q.id]).length;
    const right = bank.filter((q) => results[q.id] === 'right').length;
    return { done, right };
  };

  const filterKey = `${kind}|${deckFilter}|${statusFilter}`;

  const visible = useMemo(() => {
    return bankOf(kind).filter((q) => {
      if (deckFilter !== 'all' && !q.tags.some((t) => t.deck === deckFilter)) return false;
      const r = results[q.id];
      if (statusFilter === 'undone' && r) return false;
      if (statusFilter === 'wrong' && r !== 'wrong') return false;
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind, deckFilter, statusFilter, results]);

  // 热力图点击 → 调整筛选后跳到具体题目（声明在锚定 effect 之前）
  const pendingJump = useRef<string | null>(null);

  // 筛选变更：把列表锚到吸顶条之下，避免深滚位置出现「莫名的半张卡」。
  // 热力图跳转会先改筛选再落到具体题，此时跳过锚定，由 pendingJump 接管滚动。
  useEffect(() => {
    if (firstFilterRun.current) {
      firstFilterRun.current = false;
      return;
    }
    if (pendingJump.current) return;
    const main = document.querySelector('.pq-main');
    if (!main) return;
    const top = main.getBoundingClientRect().top + window.scrollY - 108;
    window.scrollTo({ top: Math.max(0, top), behavior: reduced ? 'auto' : 'smooth' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey]);

  // 热力图点击 → 调整筛选后跳到具体题目
  const jumpToQuestion = (qid: string, k: PracticeKind) => {
    const needFilter = kind !== k || deckFilter !== 'all' || statusFilter !== 'all';
    pendingJump.current = qid;
    if (!needFilter) {
      // 筛选不变时 visible 不重算，直接滚
      window.setTimeout(() => {
        const el = document.querySelector(`.practice-q[data-qid="${qid}"]`);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 108;
          window.scrollTo({ top: Math.max(0, top), behavior: reduced ? 'auto' : 'smooth' });
          pendingJump.current = null;
        }
      }, 30);
      return;
    }
    if (kind !== k) setKind(k);
    if (deckFilter !== 'all') setDeckFilter('all');
    if (statusFilter !== 'all') setStatusFilter('all');
  };

  // visible 更新后执行未完成的跳转
  useEffect(() => {
    if (!pendingJump.current) return;
    const t = window.setTimeout(() => {
      const id = pendingJump.current;
      pendingJump.current = null;
      if (!id) return;
      const el = document.querySelector(`.practice-q[data-qid="${id}"]`);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - 108;
      window.scrollTo({ top: Math.max(0, top), behavior: reduced ? 'auto' : 'smooth' });
    }, 80);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const { idx, showTop } = useScrollProbe(visible.length, filterKey);
  const curNo = visible[idx] ? Number(visible[idx].id.slice(1)) : 0;

  const totalDone = practiceQuestions.filter((q) => results[q.id]).length;
  const totalRight = practiceQuestions.filter((q) => results[q.id] === 'right').length;
  const total = practiceQuestions.length;

  const scrollToCard = (cardIdx: number) => {
    const q = visible[cardIdx];
    if (!q) return;
    const el = document.querySelector(`.practice-q[data-qid="${q.id}"]`);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 108;
    window.scrollTo({ top: Math.max(0, top), behavior: reduced ? 'auto' : 'smooth' });
  };

  const segmentCount = Math.ceil(visible.length / SEGMENT);
  const activeSeg = Math.min(Math.floor(idx / SEGMENT), Math.max(0, segmentCount - 1));

  return (
    <div className="page practice-page">
      <h1>在线练习</h1>

      {/* 总进度条 */}
      <div className="pq-progress material">
        <div className="pq-progress-text">
          <span>
            总进度：已作答 <b>{totalDone}</b> / {total} · 答对{' '}
            <motion.b
              className="pq-right-num"
              key={totalRight}
              initial={reduced ? false : { scale: 1.4, color: 'var(--ok)' }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 520, damping: 20 }}
            >
              {totalRight}
            </motion.b>{' '}
            题
          </span>
          <button className="btn" onClick={resetAll} disabled={totalDone === 0}>
            清空进度
          </button>
        </div>
        <div className="pq-progress-bar" role="progressbar" aria-valuenow={totalDone} aria-valuemax={total}>
          <span style={{ width: `${(totalDone / total) * 100}%` }} />
        </div>
      </div>

      <div className="pq-layout">
        {/* 左栏：筛选与进度总览（≥1200px 竖排，窄屏回落为顶部横排） */}
        <aside className="pq-rail" aria-label="筛选与进度">
          <div className="pq-rail-block">
            <p className="pq-rail-h">题型</p>
            <div className="pq-kindnav">
              {KINDS.map((k) => {
                const { done, right } = countFor(k);
                const meta = KIND_META[k];
                return (
                  <button key={k} type="button" className={`pq-kindbtn${kind === k ? ' active' : ''}`} onClick={() => setKind(k)}>
                    <span className="pq-kindbtn-label">{meta.label}</span>
                    <span className="pq-kindbtn-count" data-empty={done === 0}>
                      {done}/{meta.total}
                      {right > 0 && <i className="pq-tab-right">{right}</i>}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="pq-rail-block">
            <p className="pq-rail-h">讲次</p>
            <div className="pq-chiprow">
              <button
                type="button"
                className={`pq-chip${deckFilter === 'all' ? ' active' : ''}`}
                onClick={() => setDeckFilter('all')}
              >
                全部
              </button>
              {decks.map((d) => {
                const no = Number(d.id.slice(4));
                return (
                  <button
                    key={d.id}
                    type="button"
                    className={`pq-chip${deckFilter === no ? ' active' : ''}`}
                    data-deck={d.id}
                    onClick={() => setDeckFilter(no)}
                  >
                    第 {no} 讲
                  </button>
                );
              })}
            </div>
          </div>
          <div className="pq-rail-block">
            <p className="pq-rail-h">状态</p>
            <div className="pq-chiprow">
              {(
                [
                  ['all', '全部'],
                  ['undone', '只看未做'],
                  ['wrong', '只看错题'],
                ] as const
              ).map(([v, label]) => (
                <button
                  key={v}
                  type="button"
                  className={`pq-chip${statusFilter === v ? ' active' : ''}`}
                  onClick={() => setStatusFilter(v)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          {/* 热力图：420 格，一格一题——绿=答对，红=答错，深灰=已看答案，浅灰=未作答；点击跳题 */}
          <div className="pq-rail-block pq-heatblock">
            <p className="pq-rail-h">热力图 · 点击跳题</p>
            {KINDS.map((k) => {
              const c = countFor(k);
              const short = KIND_META[k].label.replace('题', '');
              return (
                <div key={k} className="pq-heat">
                  <p className="pq-heat-label">
                    <span>{short}</span>
                    <span>
                      {c.done}/{KIND_META[k].total}
                    </span>
                  </p>
                  <div className="pq-heat-grid">
                    {bankOf(k).map((q) => {
                      const r = results[q.id];
                      const state = r ?? 'none';
                      const stateText =
                        r === 'right' ? '已答对' : r === 'wrong' ? '已答错' : r === 'revealed' ? '已看答案' : '未作答';
                      return (
                        <button
                          key={q.id}
                          type="button"
                          className="pq-heat-cell"
                          data-state={state}
                          title={`${short} ${Number(q.id.slice(1))} · ${stateText}`}
                          aria-label={`${short} ${Number(q.id.slice(1))} ${stateText}`}
                          onClick={() => jumpToQuestion(q.id, k)}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* 主列：吸顶摘要条 + 题目列表 */}
        <div className="pq-main">
          <div className="pq-stickybar" aria-hidden={false}>
            <span className="pq-stickybar-loc">
              {KIND_META[kind].label}
              {curNo > 0 && (
                <>
                  {' '}· 第 <b>{curNo}</b> 题
                </>
              )}
            </span>
            <span className="pq-stickybar-stat">
              本型 <b>{visible.filter((q) => results[q.id]).length}</b>/{visible.length}
            </span>
          </div>

          <div className="pq-list" key={filterKey}>
            {visible.length === 0 ? (
              <p className="pq-empty">
                {statusFilter === 'undone'
                  ? '该筛选下没有未作的题目——先换个筛选，或者去别处刷题吧。'
                  : statusFilter === 'wrong'
                    ? '该筛选下没有错题——干得漂亮！'
                    : '没有符合条件的题目。'}
              </p>
            ) : (
              visible.map((q) => (
                <PracticeCard
                  key={q.id}
                  quiz={q}
                  label={`${KIND_META[q.kind].label.replace('题', '')} ${Number(q.id.slice(1))}`}
                  result={results[q.id]}
                  onResult={onResult}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* 右侧进度轨：每 10 题一段，点击跳转（仅宽屏） */}
      <AnimatePresence>
        {segmentCount > 1 && (
          <nav className="pq-track" aria-label="题目分段导航">
            {Array.from({ length: segmentCount }, (_, k) => (
              <button
                key={k}
                type="button"
                className={`pq-track-seg${k === activeSeg ? ' active' : ''}`}
                title={`第 ${k * SEGMENT + 1}–${Math.min((k + 1) * SEGMENT, visible.length)} 题`}
                onClick={() => scrollToCard(k * SEGMENT)}
              >
                <i />
                <span>{k * SEGMENT + 1}</span>
              </button>
            ))}
          </nav>
        )}
      </AnimatePresence>

      {/* 置顶按钮 */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            className="pq-top"
            aria-label="回到顶部"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 480, damping: 30 }}
            onClick={() => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })}
          >
            <IconChevronUp size={16} />
          </motion.button>
        )}
      </AnimatePresence>

      <footer className="pagefoot">题目依据课程 PPT 内容自编 · 仅供复习</footer>
    </div>
  );
}
