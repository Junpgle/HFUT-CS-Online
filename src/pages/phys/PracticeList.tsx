import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { PHYS_BASE } from '../../courses/registry';
import { physPapers } from '../../content/phys';
import { IconArrowRight, IconX } from '../../components/icons';

/** 作答结果持久化 key（qid = `${paperId}:${questionId}`，与算法课的 practice-progress-v1 分开） */
export const PHYS_PRACTICE_STORE_KEY = 'phys-practice-progress-v1';
export type PhysResult = 'right' | 'wrong' | 'revealed';

export function loadPhysResults(): Record<string, PhysResult> {
  try {
    const raw = localStorage.getItem(PHYS_PRACTICE_STORE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, PhysResult>) : {};
  } catch {
    return {};
  }
}

export function physPaperStats(paperId: string, results: Record<string, PhysResult>) {
  const paper = physPapers.find((p) => p.id === paperId);
  if (!paper) return { done: 0, right: 0, total: 0 };
  const done = paper.questions.filter((q) => results[`${paperId}:${q.id}`]).length;
  const right = paper.questions.filter((q) => results[`${paperId}:${q.id}`] === 'right').length;
  return { done, right, total: paper.questions.length };
}

/** 「大学物理」在线练习 · 试卷列表：多份试卷先选卷，再进入答题页 */
export default function PhysPracticeList() {
  const reduced = useReducedMotion();
  const [results, setResults] = useState<Record<string, PhysResult>>(() => loadPhysResults());
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(PHYS_PRACTICE_STORE_KEY, JSON.stringify(results));
    } catch {
      /* 存储不可用时静默降级 */
    }
  }, [results]);

  // 确认层 Esc 退出
  useEffect(() => {
    if (!confirmOpen) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setConfirmOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [confirmOpen]);

  // 清空按钮的可用性：任一卷有作答即可清
  const totalDone = useMemo(
    () => physPapers.reduce((n, p) => n + physPaperStats(p.id, results).done, 0),
    [results],
  );

  return (
    <div className="page phys-practice-page">
      <h1>在线练习</h1>

      <div className="pq-clear-row">
        <button className="btn pq-danger" onClick={() => setConfirmOpen(true)} disabled={totalDone === 0}>
          清空进度
        </button>
      </div>

      <div className="net-paper-grid">
        {physPapers.map((p, i) => {
          const { done, right, total: n } = physPaperStats(p.id, results);
          return (
            <motion.div
              key={p.id}
              initial={reduced ? undefined : { opacity: 0, y: 10 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              transition={reduced ? { duration: 0 } : { duration: 0.24, delay: Math.min(i * 0.04, 0.2), ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Link to={`${PHYS_BASE}/practice/${p.id}`} className="net-paper-card material" aria-label={`进入 ${p.title}`}>
                <span className="net-paper-title">{p.title}</span>
                <span className="net-paper-meta">{p.source}</span>
                <span className="net-paper-source">
                  {p.answerSource} · {n} 题
                </span>
                <span className="net-paper-progress">
                  已作答 {done} / {n} · 已展开解析 {right} 题
                  <i aria-hidden="true">
                    <span style={{ width: `${(done / n) * 100}%` }} />
                  </i>
                </span>
                <IconArrowRight size={15} className="net-paper-go" />
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* 清空进度确认：复用全站玻璃模态 */}
      <AnimatePresence>
        {confirmOpen && (
          <motion.div
            className="hub-modal-scrim"
            initial={reduced ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={() => setConfirmOpen(false)}
          >
            <motion.div
              className="hub-modal material"
              role="dialog"
              aria-modal="true"
              aria-label="清空进度"
              initial={reduced ? undefined : { opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, scale: 0.97, y: 6 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="hub-modal-head">
                <h2>清空进度</h2>
                <button className="icon-btn" onClick={() => setConfirmOpen(false)} aria-label="关闭">
                  <IconX size={16} />
                </button>
              </div>
              <p className="hub-modal-tip">清空全部试卷的作答进度？</p>
              <div className="hub-modal-actions">
                <button className="btn" onClick={() => setConfirmOpen(false)}>
                  取消
                </button>
                <button
                  className="btn pq-danger"
                  onClick={() => {
                    setResults({});
                    setConfirmOpen(false);
                  }}
                >
                  清空
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
