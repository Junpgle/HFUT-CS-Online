import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { catalog, type CatalogCourse } from '../content/catalog';
import { recordCourseView } from '../lib/recentCourses';
import { useToc } from '../lib/toc';
import ThemeToggle from '../components/ThemeToggle';
import { IconArrowLeft } from '../components/icons';

/** 未上线课程的统一落地页：自带简易导航栏（不继承首页导航），展示资料统计与建设状态 */
export default function CourseStubPage() {
  const { name } = useParams();
  const navigate = useNavigate();
  const toc = useToc();

  useEffect(() => {
    toc.report([], () => {});
    if (name) recordCourseView(name);
    return () => toc.report([], () => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  const course: CatalogCourse | undefined = catalog.find((c) => c.name === name);

  return (
    <div className="hub-shell">
      <header className="hub-topbar">
        <div className="hub-nav-left nav-pill">
          <button className="icon-btn" onClick={() => navigate(-1)} aria-label="返回上一页" title="返回上一页">
            <IconArrowLeft size={18} />
          </button>
          <span className="hub-brand">{course?.name ?? name}</span>
        </div>
        <div className="hub-topbar-right nav-pill">
          <Link to="/" className="hub-toplink">
            课程目录
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="hub-main hub-stub">
        <p className="hub-stub-kicker">课程页面筹备中</p>
        <h1>{course?.name ?? name}</h1>
        {course ? (
          <>
            <p className="hub-lede">
              资料已整理完毕：课件 {course.courseware} 份、试题 {course.exams} 份、附件 {course.misc} 份，
              共 {course.total} 份文件（学期：{course.semester}）。
            </p>
            <div className="hub-stats">
              <div className="hub-stat"><b>{course.courseware}</b><span>份课件</span></div>
              <div className="hub-stat"><b>{course.exams}</b><span>份试题</span></div>
              <div className="hub-stat"><b>{course.misc}</b><span>份附件</span></div>
              <div className="hub-stat"><b>{course.total}</b><span>合计</span></div>
            </div>
          </>
        ) : (
          <p className="hub-lede">未找到这门课的资料记录。</p>
        )}
        <p className="hub-stub-back">
          <Link to="/">← 返回课程目录</Link>
        </p>
      </main>

      <footer className="hub-foot">规则与文件清单见仓库「课件与期末题整理/整理说明」</footer>
    </div>
  );
}
