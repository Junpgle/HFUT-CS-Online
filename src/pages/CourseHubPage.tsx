import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { catalog } from '../content/catalog';
import { courses, findCourseByName, STUB_BASE } from '../courses/registry';
import SiteHeader from '../components/SiteHeader';
import { getRecentCourses } from '../lib/recentCourses';
import ContactCard from '../components/ContactCard';
import { IconGitHub } from '../components/icons';
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

const REPO_URL = 'https://github.com/SaltGardenia/HFUT-algorithm-design';

export default function CourseHubPage() {
  const toc = useToc();
  const reduced = useReducedMotion();
  const [contactOpen, setContactOpen] = useState(false);
  // 最近查看的课程（localStorage，MRU）；无记录时整个板块隐藏
  const [recentNames] = useState(() => getRecentCourses());

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

  // 首屏 hero 的分节淡入（reduced-motion 下直接呈现）
  const rise = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.4, delay, ease: [0.25, 0.1, 0.25, 1] as const },
        };

  // 最近查看卡片（数据取 catalog + registry，名字已不在资料库的忽略）
  const recentCards: Card[] = useMemo(
    () =>
      recentNames
        .map((name) => {
          const c = catalog.find((x) => x.name === name);
          const entry = findCourseByName(name);
          if (!c && !entry) return null;
          return {
            semester: c?.semester ?? entry!.semester,
            name,
            href: entry ? entry.base : `${STUB_BASE}/${encodeURIComponent(name)}`,
            ready: !!entry,
            source: entry?.source ?? null,
            courseware: c?.courseware ?? 0,
            exams: c?.exams ?? 0,
            misc: c?.misc ?? 0,
            total: c?.total ?? 0,
          };
        })
        .filter((x): x is Card => !!x),
    [recentNames],
  );

  return (
    <div className="hub-shell">
      <SiteHeader />

      <section className="hub-hero" aria-label="站点简介">
        <motion.h1 className="hub-hero-name" {...rise(0)}>
          HFUT-CS-Online
        </motion.h1>
        <motion.div className="hub-hero-links" {...rise(0.08)}>
          <a className="hub-cta ghost sm" href={REPO_URL} target="_blank" rel="noreferrer">
            <IconGitHub size={16} />
            GitHub 仓库
          </a>
          <button type="button" className="hub-cta ghost sm" onClick={() => setContactOpen(true)}>
            联系作者
          </button>
        </motion.div>
        <motion.div className="hub-hero-stats" {...rise(0.16)}>
          <div className="hub-stat"><b>{stats.semesters}</b><span>学期</span></div>
          <div className="hub-stat"><b>{stats.courses}</b><span>门课程</span></div>
          <div className="hub-stat"><b>{stats.files}</b><span>份文件</span></div>
          <div className="hub-stat"><b>{stats.courseware}</b><span>份课件</span></div>
          <div className="hub-stat"><b>{stats.exams}</b><span>份试题</span></div>
        </motion.div>
      </section>

      <main className="hub-main" id="catalog">
        {recentCards.length > 0 && (
          <section className="hub-sem" aria-label="最近查看">
            <div className="hub-sem-h">
              <h2>最近查看</h2>
            </div>
            <div className="hub-grid">{recentCards.map(card)}</div>
          </section>
        )}
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
      <ContactCard open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
