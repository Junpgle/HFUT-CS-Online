import { Link } from 'react-router-dom';
import { NET_BASE } from '../../courses/registry';
import type { NetHomeworkQuestion } from '../../content/net/homework';

/** 章节末尾的课程作业：题目、教师答案与补充解答分开，并支持知识点回跳。 */
export default function NetHomework({
  chapterNo,
  questions,
}: {
  chapterNo: number;
  questions: NetHomeworkQuestion[];
}) {
  const chapterBase = `${NET_BASE}/deck/ch${chapterNo}`;
  return (
    <section className="net-hw-section" aria-label={`第${chapterNo}章作业`}>
      <h2 id={`sec-ch${chapterNo}-homework`}>本章作业 · {questions.length} 题</h2>
      <div className="net-hw-intro">
        <p>依据配套作业整理，保留原题编号；教师答案为整理转述，补充参考答案单独列出。
          原文件未提供答案处不冒充教师原话，计算步骤会说明所用条件。</p>
        <p>点击题目中的「回看知识点」可定位到本章正文；
          从正文相关知识点下方的题号可返回作业。侧栏也能直接定位每道题。</p>
      </div>
      {questions.length === 0 ? (
        <div className="net-hw-empty material">
          <p>本次提供的三份作业文件中<strong>没有单列第 {chapterNo} 章的作业</strong>。
          因此不将自编题误标为教师布置。</p>
          <p>可继续阅读本章 DNS、邮件协议和 HTTP，并用历年试卷自测。</p>
          <Link to={`${NET_BASE}/practice`}>前往在线练习</Link>
        </div>
      ) : questions.map((q) => (
        <article className="net-hw-card material" key={q.no}>
          <h3 id={`sec-ch${chapterNo}-hw-${q.no}`} className="net-hw-q-title">
            <span className="net-hw-no">第 {q.no} 题</span>{q.title}
          </h3>
          <div className="net-hw-jump">
            <Link to={`${chapterBase}?s=${q.related}`}>回看相关知识点</Link>
            <Link to={`${chapterBase}?s=sec-ch${chapterNo}-homework`}>本章作业目录</Link>
          </div>
          {q.attention && <p className="net-hw-attention"><strong>题目核对：</strong>{q.attention}</p>}
          <details className="net-hw-answer">
            <summary>教师答案（整理转述）</summary>
            {q.teacher ? <p>{q.teacher}</p> :
              <p>本章原始作业未附教师参考答案；下方是独立编写的参考答案。</p>}
          </details>
          <details className="net-hw-answer">
            <summary>展开完整参考答案与解析</summary>
            <div className="net-hw-explanation" dangerouslySetInnerHTML={{ __html: q.reference }} />
          </details>
        </article>
      ))}
    </section>
  );
}
