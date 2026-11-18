import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { catalog } from '../content/catalog';
import { courses, findCourseByName, STUB_BASE } from '../courses/registry';
import SiteHeader from '../components/SiteHeader';
import { useToc } from '../lib/toc';

/** 学期分组顺序：8 个学期在前，公共课与杂项殿后 */
const SEMESTERS = ['大一上', '大一下', '大二上', '大二下', '大三上', '大三下', '大四上', '大四下'];

interface Card {
  semester: string;
  name: string;
  href: string;
  ready: boolean;
  /** 已上线课程的来源说明；未上线为 null */
  source: string | null;
  courseware: number;
  exams: number;
  misc: number;
  total: number;
}

const REPO_LINKS = [
  ['sunmiao0301/HFUT-CS', 'https://github.com/sunmiao0301/HFUT-CS'],
  ['mox-hub/hfut-cs', 'https://github.com/mox-hub/hfut-cs'],
  ['styitches/HFUT-CS', 'https://github.com/styitches/HFUT-CS'],
  ['Tuning-Luna/HFUT_XC_Study_Things', 'https://github.com/Tuning-Luna/HFUT_XC_Study_Things'],
] as const;

export default function CourseHubPage() {
  const toc = useToc();
  const reduced = useReducedMotion();

  // 站点层无正文目录，清空侧栏上报
  useEffect(() => {
    toc.report([], () => {});
    return () => toc.report([], () => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { groups, stats } = useMemo(() => {
    // catalog：学期 → 课程；已上线课程（registry）若不在 catalog 里则注入虚拟卡片
    const bySem = new Map<string, Card[]>();
    const push = (semester: string, c: Omit<Card, 'semester'>) => {
      if (!bySem.has(semester)) bySem.set(semester, []);
      bySem.get(semester)!.push({ ...c, semester });
    };
    for (const c of catalog) {
      const entry = findCourseByName(c.name);
      push(c.semester, {
        name: c.name,
        href: entry ? entry.base : `${STUB_BASE}/${encodeURIComponent(c.name)}`,
        ready: !!entry,
        source: entry?.source ?? null,
        courseware: c.courseware,
        exams: c.exams,
        misc: c.misc,
        total: c.total,
      });
    }
    for (const entry of courses) {
      if (bySem.has(entry.semester) && bySem.get(entry.semester)!.some((c) => c.name === entry.name)) continue;
      push(entry.semester, {
        name: entry.name,
        href: entry.base,
        ready: true,
        source: entry.source,
        courseware: 0,
        exams: 0,
        misc: 0,
        total: 0,
      });
    }
    const order = [...SEMESTERS, ...[...bySem.keys()].filter((s) => !SEMESTERS.includes(s))];
    const groups = order
      .filter((s) => bySem.has(s))
      .map((semester) => ({ semester, cards: bySem.get(semester)! }));

    const sum = (k: 'total' | 'exams' | 'courseware') =>
      catalog.reduce((acc, c) => acc + c[k], 0);
    const stats = {
      semesters: SEMESTERS.length,
      courses: catalog.length,
      files: sum('total'),
      exams: sum('exams'),
      courseware: sum('courseware'),
    };
    return { groups, stats };
  }, []);

  const card = (c: Card, i: number) => (
    <motion.div
      key={c.name}
      initial={reduced ? undefined : { opacity: 0, y: 10 }}
      animate={reduced ? undefined : { opacity: 1, y: 0 }}
      transition={reduced ? { duration: 0 } : { duration: 0.24, delay: Math.min(i * 0.03, 0.24), ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Link
        to={c.href}
        className={`course-card${c.ready ? ' ready' : ''}`}
        aria-label={c.ready ? `${c.name}，进入课程` : `${c.name}，查看资料统计`}
      >
        <span className="course-title">
          {c.name}
          {c.ready && <span className="course-go" aria-hidden="true">→</span>}
        </span>
        {c.source && <span className="course-desc">{c.source}</span>}
        {c.total > 0 && (
          <span className="course-meta">
            课件 {c.courseware} · 试题 {c.exams} · 附件 {c.misc} · 共 {c.total} 份
          </span>
        )}
      </Link>
    </motion.div>
  );

  return (
    <div className="hub-shell">
      <SiteHeader />
      <main className="hub-main">
        <section className="hub-hero">
          <h1>课程资料库</h1>
          <p className="hub-lede">
            合工大计算机专业 {stats.semesters} 个学期 {stats.courses} 门课程的课件、期末试题与附件，
            整理自 4 个开源资料仓库，共 {stats.files} 份文件。点击课程进入，灰字课程为资料统计页。
          </p>
          <div className="hub-stats">
            <div className="hub-stat"><b>{stats.semesters}</b><span>学期</span></div>
            <div className="hub-stat"><b>{stats.courses}</b><span>门课程</span></div>
            <div className="hub-stat"><b>{stats.files}</b><span>份文件</span></div>
            <div className="hub-stat"><b>{stats.courseware}</b><span>份课件</span></div>
            <div className="hub-stat"><b>{stats.exams}</b><span>份试题</span></div>
          </div>
        </section>

        {groups.map((g) => (
          <section className="hub-sem" key={g.semester}>
            <div className="hub-sem-h">
              <h2>{g.semester}</h2>
              <span>
                {g.semester === '公共课与杂项' ? '不属于具体学期课程的公共资料' : '课程'} · {g.cards.length} 门
              </span>
            </div>
            <div className="hub-grid">{g.cards.map(card)}</div>
          </section>
        ))}
      </main>
      <footer className="hub-foot">
        资料整理自{' '}
        {REPO_LINKS.map(([name, href], i) => (
          <span key={href}>
            {i > 0 && ' · '}
            <a href={href} target="_blank" rel="noreferrer">{name}</a>
          </span>
        ))}
        {' '}· 规则与清单见仓库「整理说明」
      </footer>
    </div>
  );
}
