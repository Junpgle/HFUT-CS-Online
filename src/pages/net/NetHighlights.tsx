import { Link } from 'react-router-dom';
import { NET_BASE } from '../../courses/registry';
import { netHighlights } from '../../content/net/highlights';

/** 只根据 PDF 内实际的黄色荧光笔笔迹生成索引，优先级另按作业相关性整理。 */
export default function NetHighlights({ chapterNo }: { chapterNo: number }) {
  const focus = netHighlights[chapterNo];
  const major = focus.groups.filter((item) => item.priority === 'A');
  const minor = focus.groups.filter((item) => item.priority === 'B');
  const link = (sec: string) => `${NET_BASE}/deck/ch${chapterNo}?s=${sec}`;

  return (
    <section className="net-focus" aria-label="2025课件荧光笔重点">
      <div className="net-focus-head">
        <div>
          <h2>2025 版课件 · 荧光笔重点</h2>
          <p>从 PDF 页面绘制的黄色荧光笔中提取；按与作业的关联度合并、排序，
            避免将每一道笔迹都列成单独的重点。</p>
        </div>
        <span className="net-focus-count">已标记 {focus.markedPages} 页</span>
      </div>
      {major.length ? (
        <>
          <div className="net-focus-grid">
            {major.map((item) => (
              <article key={item.topic} className="net-focus-item">
                <div className="net-focus-topic">
                  <span className="net-focus-level">优先</span>
                  <Link to={link(item.sec)}>{item.topic}</Link>
                </div>
                <p>{item.reason}</p>
                <small>对应 PDF {item.pages}</small>
              </article>
            ))}
          </div>
          {minor.length > 0 && (
            <details className="net-focus-extra">
              <summary>展开其余已标记内容（{minor.length} 组）</summary>
              <ul>
                {minor.map((item) => (
                  <li key={item.topic}>
                    <Link to={link(item.sec)}>{item.topic}</Link>
                    <span> · {item.pages} · {item.reason}</span>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </>
      ) : (
        <p className="net-focus-none">这份课件 PDF 未检测到同样的黄色荧光笔笔迹，
          不能由此推断本章不考。仍以课件内容和历年试卷为准。</p>
      )}
      <p className="net-focus-source">
        <strong>页码依据：</strong>{focus.sources.join('；')}。
        页码均为 PDF 文件页码，不保证与幻灯片内印刷页号相同。
        「优先」是结合标记与已布置作业作出的复习排序，不代表教师明确划定考试范围。
      </p>
    </section>
  );
}
