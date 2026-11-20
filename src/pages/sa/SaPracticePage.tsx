import { Link } from 'react-router-dom';
import { SA_BASE } from '../../courses/registry';

/**
 * 「软件体系结构」在线练习页：试题文件夹未收录试卷（0 份），按约定展示诚实空态。
 * 布局仍占满版心（无侧栏），与其他课程的答题页保持同一页面骨架。
 */
export default function SaPracticePage() {
  return (
    <div className="page practice-page">
      <div className="net-paper-head">
        <h1>在线练习</h1>
        <p className="net-paper-sub">
          本课程试题文件夹暂未收录试卷 · 课件资料见章节讲义
        </p>
      </div>
      <div className="callout key">
        <p className="callout-h">暂无可练习的试卷</p>
        <p>
          本课程的资料文件夹中「试题」目录为空，暂无试卷可整理为在线练习。已收录的内容为课件讲义（
          <Link to={`${SA_BASE}/deck/ch4`}>第 4 章 软件体系结构描述</Link>、
          <Link to={`${SA_BASE}/deck/ch5`}>第 5 章 软件体系结构设计</Link>、
          <Link to={`${SA_BASE}/deck/ch7`}>第 7 章 软件体系结构评估</Link> 与{' '}
          <Link to={`${SA_BASE}/deck/rsa`}>IBM RSA 建模实例教程专题</Link>），可从顶部导航或上述链接进入学习；
          待试卷资料补充后，此处将按试卷提供答题页。
        </p>
      </div>
    </div>
  );
}
