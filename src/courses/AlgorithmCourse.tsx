import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Navigate, Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import { decks } from '../content';
import TopBar, { type CourseTab } from '../components/TopBar';
import Sidebar, { SidebarContent, type NavEntry } from '../components/Sidebar';
import MobileDrawer from '../components/MobileDrawer';
import { buildAlgoIndex } from '../components/SearchBox';
import HomePage from '../pages/HomePage';
import DeckPage from '../pages/DeckPage';
import PracticePage from '../pages/PracticePage';
import CourseAttachmentsPage from '../pages/CourseAttachmentsPage';
import { ALGO_BASE, courses } from './registry';
import { recordCourseView } from '../lib/recentCourses';
import { decodeEntities } from '../lib/text';

/** 各路由的滚动记忆（POP 导航时恢复） */
const scrollPositions = new Map<string, number>();

/**
 * 「算法设计与分析」课程根组件 —— 挂在 /algo/* 下。
 * 课程自带完整布局（顶栏导航 + 侧栏 + 页脚），不依赖站点层组件；
 * 内部路由全部相对，整体换前缀只改 registry.base。
 */
export default function AlgorithmCourse() {
  const location = useLocation();

  // 记录「最近查看」（本地 localStorage），供首页最近查看板块使用
  useEffect(() => {
    recordCourseView(courses[0].name);
  }, []);
  const navType = useNavigationType();
  const reduced = useReducedMotion();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentDeck = useMemo(() => {
    const m = location.pathname.match(/^\/algo\/deck\/(deck[1-8])/);
    return m ? m[1] : null;
  }, [location.pathname]);

  const subtitle = decks.find((d) => d.id === currentDeck)?.subtitle;

  // 当前讲次 → html[data-deck]：顶栏 tabs / 进度条 / 侧栏 / h2 编号统一切换讲次主题色
  useEffect(() => {
    if (currentDeck) document.documentElement.dataset.deck = currentDeck;
    else delete document.documentElement.dataset.deck;
    return () => {
      delete document.documentElement.dataset.deck;
    };
  }, [currentDeck]);

  // 讲次方向性转场：记录上一次的讲次序号，前/后翻页用不同方向
  const deckNo = currentDeck ? Number(currentDeck.slice(4)) : 0;
  const prevNoRef = useRef(0);
  const dir = deckNo && prevNoRef.current && deckNo !== prevNoRef.current ? Math.sign(deckNo - prevNoRef.current) : 0;
  useEffect(() => {
    prevNoRef.current = deckNo;
  }, [deckNo]);

  // Esc 关闭抽屉（搜索不设快捷键，点击顶栏按钮打开）
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // 滚动记忆：离开时保存；POP 恢复；新导航回顶部（?s= 定位交给页面处理）
  useEffect(() => {
    const key = location.key;
    return () => {
      scrollPositions.set(key, window.scrollY);
    };
  }, [location.key]);

  useEffect(() => {
    if (navType === 'POP') {
      const y = scrollPositions.get(location.key) ?? 0;
      requestAnimationFrame(() => window.scrollTo({ top: y, behavior: 'auto' }));
    } else if (!location.search) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [location.key, navType, location.search]);

  // 路由切换时关闭抽屉
  useEffect(() => setDrawerOpen(false), [location.pathname]);

  // 顶栏导航：总目录 + 第1~8讲 + 在线练习 + 附件
  const onPractice = location.pathname.startsWith(`${ALGO_BASE}/practice`);
  const onAtt = location.pathname.startsWith(`${ALGO_BASE}/attachments`);
  const tabs = useMemo<CourseTab[]>(
    () => [
      { to: `${ALGO_BASE}`, full: '总目录', short: '目录', active: !currentDeck && !onPractice && !onAtt, key: null, tip: '课程首页 · 考点速查表' },
      ...decks.map((d) => ({
        to: `${ALGO_BASE}/deck/${d.id}`,
        full: d.no,
        short: d.no.replace('第', ''),
        active: d.id === currentDeck,
        key: d.id,
        tip: decodeEntities(d.title),
      })),
      {
        to: `${ALGO_BASE}/practice`,
        full: '在线练习',
        short: '练习',
        active: onPractice,
        key: null,
        tip: '在线练习 · 420 题自测',
        extra: 'practice-tab',
      },
      {
        to: `${ALGO_BASE}/attachments`,
        full: '附件',
        short: '附件',
        active: onAtt,
        key: null,
        tip: '附件资料 · 课件 / 试题 / 附件目录与预览',
      },
    ],
    [currentDeck, onPractice, onAtt],
  );

  // 抽屉导航：首页条目由 SidebarContent 自带，这里只给课程内条目
  const nav = useMemo<NavEntry[]>(
    () => [
      { to: `${ALGO_BASE}`, no: '◎', label: '总目录 · 考点速查', active: !currentDeck && !onPractice && !onAtt },
      ...decks.map((d) => ({
        to: `${ALGO_BASE}/deck/${d.id}`,
        no: d.no.replace('第', '').replace('讲', ''),
        label: d.title,
        active: d.id === currentDeck,
        deckKey: d.id,
      })),
      {
        to: `${ALGO_BASE}/practice`,
        no: '练',
        label: '在线练习 · 420 题',
        active: onPractice,
        navKey: 'practice',
      },
      {
        to: `${ALGO_BASE}/attachments`,
        no: '件',
        label: '附件资料',
        active: onAtt,
      },
    ],
    [currentDeck, onPractice, onAtt],
  );

  // 搜索：讲次/动画/自测题索引 + 跳转路由
  const searchIndex = useMemo(buildAlgoIndex, []);
  const searchLinkTo = (item: { unit: string | null; sectionId: string }) =>
    item.unit
      ? `${ALGO_BASE}/deck/${item.unit}?s=${item.sectionId}`
      : `${ALGO_BASE}/?s=${item.sectionId}`;

  return (
    <div className="shell">
      <TopBar
        courseName="算法设计与分析"
        courseBase={ALGO_BASE}
        courseTip="算法设计与分析 · 复习手册"
        subtitle={subtitle}
        tabs={tabs}
        searchIndex={searchIndex}
        searchLinkTo={searchLinkTo}
        onOpenSidebar={() => setDrawerOpen(true)}
      />

      {/* 练习页/附件页不上报目录（无侧栏），让正文占满整个版心 */}
      <div className={`shell-body${onPractice || onAtt ? ' no-sidebar' : ''}`}>
        <Sidebar />
        <AnimatePresence mode="wait" initial={false} custom={dir}>
          <motion.div
            key={location.pathname}
            custom={dir}
            variants={{
              enter: (d: number) =>
                reduced ? { opacity: 0 } : d === 0 ? { opacity: 0, y: 12 } : { opacity: 0, x: 28 * d },
              center: { opacity: 1, x: 0, y: 0 },
              leave: (d: number) =>
                reduced ? { opacity: 0 } : d === 0 ? { opacity: 0, y: -8 } : { opacity: 0, x: -22 * d },
            }}
            initial="enter"
            animate="center"
            exit="leave"
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Routes location={location}>
              <Route index element={<HomePage />} />
              <Route path="deck/:deckId" element={<DeckPage />} />
              <Route path="practice" element={<PracticePage />} />
              <Route path="attachments" element={<CourseAttachmentsPage />} />
              <Route path="*" element={<Navigate to={ALGO_BASE} replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="drawer-root">
        <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <SidebarContent nav={nav} />
        </MobileDrawer>
      </div>
    </div>
  );
}
