import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { IconChevronDown } from '../../components/icons';
import { NET_BASE } from '../../courses/registry';
import type { NetHomeworkQuestion } from '../../content/net/homework';

interface HomeworkCardProps {
  chapterNo: number;
  question: NetHomeworkQuestion;
  reducedMotion: boolean | null;
}

/** 与其他课程简答题相同的 disclosure：一键展开、收起整组答案及解析。 */
function HomeworkCard({ chapterNo, question, reducedMotion }: HomeworkCardProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  const chapterBase = `${NET_BASE}/deck/ch${chapterNo}`;
  const answerId = `net-hw-answer-ch${chapterNo}-${question.no}`;

  return (
    <article className="net-hw-card quiz material">
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
          onClick={() => setShowAnswer((open) => !open)}
        >
          {showAnswer ? '收起答案与解析' : '查看答案与解析'}
          <IconChevronDown size={14} />
        </button>
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </article>
  );
}

/** 章节末尾的课程作业：与其他课程共用练习卡的按钮、解析层级及展开动效。 */
export default function NetHomework({
  chapterNo,
  questions,
}: {
  chapterNo: number;
  questions: NetHomeworkQuestion[];
}) {
  const reducedMotion = useReducedMotion();

  return (
    <section className="net-hw-section" aria-label={`第${chapterNo}章作业`}>
      <h2 id={`sec-ch${chapterNo}-homework`}>本章作业 · {questions.length} 题</h2>
      <div className="net-hw-intro">
        <p>依据配套作业整理，保留原题编号；教师答案为整理转述，补充参考答案单独列出。
          原文件未提供答案处不冒充教师原话，计算步骤会说明所用条件。</p>
        <p>「查看答案与解析」可一次展开完整答案；「回看相关知识点」定位正文，
          从正文相关知识点下方的题号可返回作业，也可通过侧栏直接定位题目。</p>
      </div>
      {questions.length === 0 ? (
        <div className="net-hw-empty material">
          <p>本次提供的三份作业文件中<strong>没有单列第 {chapterNo} 章的作业</strong>。
          因此不将自编题误标为教师布置。</p>
          <p>可继续阅读本章 DNS、邮件协议和 HTTP，并用历年试卷自测。</p>
          <Link to={`${NET_BASE}/practice`}>前往在线练习</Link>
        </div>
      ) : questions.map((question) => (
        <HomeworkCard
          key={question.no}
          chapterNo={chapterNo}
          question={question}
          reducedMotion={reducedMotion}
        />
      ))}
    </section>
  );
}
