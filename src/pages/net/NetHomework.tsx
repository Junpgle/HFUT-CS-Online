import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { IconCheck, IconChevronDown, IconReset, IconX } from '../../components/icons';
import { NET_BASE } from '../../courses/registry';
import type { NetHomeworkQuestion } from '../../content/net/homework';

/** 同其他课程的练习状态语义一致；主观题的 right/wrong 由学生自评。 */
export type HomeworkResult = 'right' | 'wrong' | 'revealed';
export type HomeworkResults = Record<string, HomeworkResult>;
export const NET_HOMEWORK_STORE_KEY = 'net-homework-progress-v1';

/** 每章题号有重复，必须由「章号:原题号」确定唯一存储键。 */
export function homeworkId(chapterNo: number, questionNo: number): string {
  return `${chapterNo}:${questionNo}`;
}

export function loadHomeworkResults(): HomeworkResults {
  try {
    const saved = JSON.parse(localStorage.getItem(NET_HOMEWORK_STORE_KEY) ?? 'null');
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return {};
    return Object.fromEntries(
      Object.entries(saved).filter(([key, value]) =>
        /^\d+:\d+$/.test(key) && (value === 'right' || value === 'wrong' || value === 'revealed'),
      ),
    ) as HomeworkResults;
  } catch {
    return {};
  }
}

interface HomeworkCardProps {
  chapterNo: number;
  question: NetHomeworkQuestion;
  result?: HomeworkResult;
  onResult: (id: string, result: HomeworkResult | null) => void;
  reducedMotion: boolean | null;
}

/** 对齐网站简答题：统一题卡、状态点、展示答案、复习标记和重做。 */
function HomeworkCard({ chapterNo, question, result, onResult, reducedMotion }: HomeworkCardProps) {
  const [showAnswer, setShowAnswer] = useState(() => result !== undefined);

  // 清空本章进度时同步关闭答案；刷新载入的已看/已自评题仍可直接复习。
  useEffect(() => {
    if (!result) setShowAnswer(false);
  }, [result]);
  const chapterBase = `${NET_BASE}/deck/ch${chapterNo}`;
  const questionId = homeworkId(chapterNo, question.no);
  const answerId = `net-hw-answer-ch${chapterNo}-${question.no}`;

  const toggleAnswer = () => {
    if (!showAnswer && !result) onResult(questionId, 'revealed');
    setShowAnswer((open) => !open);
  };
  const reset = () => {
    setShowAnswer(false);
    onResult(questionId, null);
  };

  return (
    <article className={`net-hw-card quiz practice-q material${result === 'right' ? ' answered-right' : result === 'wrong' ? ' answered-wrong' : ''}`} data-qid={questionId} data-result={result}>
      {result && (
        <span
          className="pq-status"
          data-result={result}
          aria-label={result === 'right' ? '已掌握' : result === 'wrong' ? '需复习' : '已看答案'}
          title={result === 'right' ? '已掌握' : result === 'wrong' ? '需复习' : '已看答案'}
        >
          {result === 'right' && <IconCheck size={11} />}
          {result === 'wrong' && <IconX size={11} />}
        </span>
      )}
      <h3 id={`sec-ch${chapterNo}-hw-${question.no}`} className="net-hw-q-title">
        <span className="net-hw-no">第 {question.no} 题</span>{question.title}
      </h3>
      <div className="net-hw-jump">
        <Link to={`${chapterBase}?s=${question.related}`}>回看相关知识点</Link>
        <Link to={`${chapterBase}?s=sec-ch${chapterNo}-homework`}>本章作业目录</Link>
      </div>
      {question.attention && (
        <p className="net-hw-attention"><strong>题目核对：</strong>{question.attention}</p>
      )}
      <div className="quiz-actions net-hw-actions">
        <button
          type="button"
          className="btn pq-disclose net-hw-disclose"
          aria-expanded={showAnswer}
          aria-controls={answerId}
          onClick={toggleAnswer}
        >
          {showAnswer ? '收起答案与解析' : '查看答案与解析'}
          <IconChevronDown size={14} />
        </button>
        {result && (
          <button type="button" className="btn net-hw-reset" onClick={reset}>
            <IconReset size={14} />重做
          </button>
        )}
      </div>
      <div id={answerId} className="net-hw-answer-container">
        <AnimatePresence initial={false}>
          {showAnswer && (
            <motion.div
              key="answer"
              initial={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
              animate={reducedMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ overflow: 'hidden' }}
            >
              {question.teacher ? (
                <>
                  <div className="quiz-a pq-answer net-hw-answer-main">
                    <b>教师答案（整理转述）</b>
                    <p>{question.teacher}</p>
                  </div>
                  <div className="pq-rubric net-hw-answer-detail">
                    <b>补充参考答案与解析</b>
                    <div className="pq-answer-body net-hw-explanation" dangerouslySetInnerHTML={{ __html: question.reference }} />
                  </div>
                </>
              ) : (
                <div className="quiz-a pq-answer net-hw-answer-main">
                  <b>参考答案与解析</b>
                  <p className="net-hw-answer-source">原作业文件未附教师答案；以下为独立编写的参考解答。</p>
                  <div className="pq-answer-body net-hw-explanation" dangerouslySetInnerHTML={{ __html: question.reference }} />
                </div>
              )}
              <div className="net-hw-evaluate" role="group" aria-label={`第${question.no}题自评`}>
                <span>自评掌握情况</span>
                <button
                  type="button"
                  className="btn net-hw-eval-btn"
                  data-active={result === 'right'}
                  aria-pressed={result === 'right'}
                  onClick={() => onResult(questionId, 'right')}
                >
                  <IconCheck size={14} />已掌握
                </button>
                <button
                  type="button"
                  className="btn net-hw-eval-btn"
                  data-active={result === 'wrong'}
                  aria-pressed={result === 'wrong'}
                  onClick={() => onResult(questionId, 'wrong')}
                >
                  <IconX size={14} />需复习
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </article>
  );
}

/** 章节作业使用与其他课程同款进度条、状态热力图和二次确认清空。 */
export default function NetHomework({
  chapterNo,
  questions,
}: {
  chapterNo: number;
  questions: NetHomeworkQuestion[];
}) {
  const reducedMotion = useReducedMotion();
  const [results, setResults] = useState<HomeworkResults>(() => loadHomeworkResults());
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(NET_HOMEWORK_STORE_KEY, JSON.stringify(results));
    } catch {
      /* 与其他课程一致：存储不可用时仍可当前页面使用 */
    }
  }, [results]);

  useEffect(() => {
    if (!confirmOpen) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setConfirmOpen(false);
    };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [confirmOpen]);

  const onResult = (id: string, result: HomeworkResult | null) => setResults((previous) => {
    const next = { ...previous };
    if (result === null) delete next[id];
    else next[id] = result;
    return next;
  });

  const chapterResults = questions.map((question) => results[homeworkId(chapterNo, question.no)]);
  const seen = chapterResults.filter(Boolean).length;
  const mastered = chapterResults.filter((result) => result === 'right').length;
  const revisit = chapterResults.filter((result) => result === 'wrong').length;

  const clearChapter = () => {
    setResults((previous) => {
      const next = { ...previous };
      questions.forEach((question) => delete next[homeworkId(chapterNo, question.no)]);
      return next;
    });
    setConfirmOpen(false);
  };
  const jumpToQuestion = (no: number) =>
    document.getElementById(`sec-ch${chapterNo}-hw-${no}`)?.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });

  return (
    <section className="net-hw-section" aria-label={`第${chapterNo}章作业`}>
      <h2 id={`sec-ch${chapterNo}-homework`}>本章作业 · {questions.length} 题</h2>
      <div className="net-hw-intro">
        <p>依据配套作业整理，保留原题编号；教师答案为整理转述，补充参考答案单独列出。
          原文件未提供答案处不冒充教师原话，计算步骤会说明所用条件。</p>
        <p>查看答案后会自动记录为「已看答案」，可自行标记「已掌握」或「需复习」。
          进度保存在当前浏览器，刷新后仍可恢复，不代表自动判分。</p>
      </div>
      {questions.length > 0 && (
        <div className="pq-progress material net-hw-progress">
          <div className="pq-progress-text">
            <span>
              本章进度：<span className="pq-frag">已查看 <b>{seen}</b> / {questions.length}</span> ·{' '}
              <span className="pq-frag">已掌握 <b>{mastered}</b> 题</span> ·{' '}
              <span className="pq-frag">需复习 <b>{revisit}</b> 题</span>
            </span>
            <button
              type="button"
              className="btn pq-danger"
              disabled={seen === 0}
              onClick={() => setConfirmOpen(true)}
            >
              清空本章进度
            </button>
          </div>
          <div
            className="pq-progress-bar"
            role="progressbar"
            aria-label={`第${chapterNo}章作业已查看进度`}
            aria-valuemin={0}
            aria-valuenow={seen}
            aria-valuemax={questions.length}
          >
            <span style={{ width: `${(seen / questions.length) * 100}%` }} />
          </div>
          <div className="net-hw-heat" aria-label="本章作业进度热力图">
            {questions.map((question) => {
              const result = results[homeworkId(chapterNo, question.no)];
              const stateText = result === 'right' ? '已掌握' : result === 'wrong' ? '需复习'
                : result === 'revealed' ? '已看答案' : '未查看';
              return (
                <button
                  key={question.no}
                  type="button"
                  className="pq-heat-cell net-hw-heat-cell"
                  data-state={result ?? 'none'}
                  title={`第 ${question.no} 题 · ${stateText}`}
                  aria-label={`第 ${question.no} 题 ${stateText}`}
                  onClick={() => jumpToQuestion(question.no)}
                >
                  {question.no}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {questions.length === 0 ? (
        <div className="net-hw-empty material">
          <p>本次提供的三份作业文件中<strong>没有单列第 {chapterNo} 章的作业</strong>。
          因此不将自编题误标为教师布置。</p>
          <p>可继续阅读本章 DNS、邮件协议和 HTTP，并用历年试卷自测。</p>
          <Link to={`${NET_BASE}/practice`}>前往在线练习</Link>
        </div>
      ) : questions.map((question) => (
        <HomeworkCard
          key={homeworkId(chapterNo, question.no)}
          chapterNo={chapterNo}
          question={question}
          result={results[homeworkId(chapterNo, question.no)]}
          onResult={onResult}
          reducedMotion={reducedMotion}
        />
      ))}
      <AnimatePresence>
        {confirmOpen && (
          <motion.div
            className="hub-modal-scrim"
            initial={reducedMotion ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={() => setConfirmOpen(false)}
          >
            <motion.div
              className="hub-modal material"
              role="dialog"
              aria-modal="true"
              aria-label="清空本章进度"
              initial={reducedMotion ? undefined : { opacity: 0, scale: 0.96, y: 10 }}
              animate={reducedMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="hub-modal-head">
                <h2>清空本章进度</h2>
                <button type="button" className="icon-btn" onClick={() => setConfirmOpen(false)} aria-label="关闭">
                  <IconX size={16} />
                </button>
              </div>
              <p className="hub-modal-tip">确定清空第 {chapterNo} 章全部 {questions.length} 道作业的查看及自评记录？其他章节不受影响。</p>
              <div className="hub-modal-actions">
                <button type="button" className="btn" onClick={() => setConfirmOpen(false)}>取消</button>
                <button type="button" className="btn pq-danger" onClick={clearChapter}>清空</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
