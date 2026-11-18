import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Navigate, Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import { decks } from '../content';
import TopBar from '../components/TopBar';
import Sidebar, { SidebarContent } from '../components/Sidebar';
import MobileDrawer from '../components/MobileDrawer';
import Footer from '../components/Footer';
import HomePage from '../pages/HomePage';
import DeckPage from '../pages/DeckPage';
import PracticePage from '../pages/PracticePage';
import { ALGO_BASE, courses } from './registry';
import { recordCourseView } from '../lib/recentCourses';

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

  return (
    <div className="shell">
      <TopBar
        subtitle={subtitle}
        currentDeck={currentDeck}
        onOpenSidebar={() => setDrawerOpen(true)}
      />

      {/* 练习页不上报目录（无侧栏），让正文占满整个版心 */}
      <div className={`shell-body${location.pathname === `${ALGO_BASE}/practice` ? ' no-sidebar' : ''}`}>
        <Sidebar decks={decks} currentDeck={currentDeck} />
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
              <Route path="*" element={<Navigate to={ALGO_BASE} replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>

      <Footer />

      <div className="drawer-root">
        <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <SidebarContent decks={decks} currentDeck={currentDeck} />
        </MobileDrawer>
      </div>
    </div>
  );
}
