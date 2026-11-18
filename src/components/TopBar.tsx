import { motion, useReducedMotion } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { decks, type DeckData } from '../content';
import { decodeEntities } from '../lib/text';
import { IconMenu } from './icons';
import ThemeToggle from './ThemeToggle';
import { ALGO_BASE } from '../courses/registry';
import SearchBox from './SearchBox';

interface Props {
  subtitle?: string;
  currentDeck: string | null;
  onOpenSidebar: () => void;
}

/** 顶栏中部的全站导航：总目录 + 第1~8讲 + 在线练习，一项对应一页，线性排列无回环 */
function SiteTabs({ currentDeck }: { currentDeck: string | null }) {
  const reduced = useReducedMotion();
  const location = useLocation();
  const practiceActive = location.pathname === `${ALGO_BASE}/practice`;
  const item = (to: string, full: string, short: string, active: boolean, deck: string | null, tip: string, extra?: string) => (
    <Link
      key={to}
      to={to}
      className={`deck-tab${active ? ' active' : ''}${extra ? ' ' + extra : ''}`}
      data-deck={deck ?? undefined}
      data-title={tip}
      aria-current={active ? 'page' : undefined}
    >
      {active && (
        <motion.span
          className="deck-tab-pill"
          layoutId="deck-tab-pill"
          transition={reduced ? { duration: 0 } : { type: 'tween', duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        />
      )}
      <span className="deck-tab-no">
        <span className="tab-full">{full}</span>
        <span className="tab-short">{short}</span>
      </span>
    </Link>
  );
  return (
    <nav className="deck-tabs nav-pill" aria-label="全站导航">
      {item(`${ALGO_BASE}`, '总目录', '目录', currentDeck === null && !practiceActive, null, '课程首页 · 考点速查表')}
      {decks.map((d: DeckData) =>
        item(`${ALGO_BASE}/deck/${d.id}`, d.no, d.no.replace('第', ''), d.id === currentDeck, d.id, decodeEntities(d.title)),
      )}
      {item(`${ALGO_BASE}/practice`, '在线练习', '练习', practiceActive, null, '在线练习 · 420 题自测', 'practice-tab')}
    </nav>
  );
}

export default function TopBar({ subtitle, currentDeck, onOpenSidebar }: Props) {
  return (
    <header className="topbar">
      <div className="topbar-left nav-pill">
        <button
          className="icon-btn drawer-trigger"
          aria-label="打开目录"
          onClick={onOpenSidebar}
        >
          <IconMenu />
        </button>
        {/* 面包屑：回站点首页的常驻入口（窄屏收起，移动端走抽屉） */}
        <Link to="/" className="topbar-crumb">
          课程资料库
        </Link>
        <Link to={ALGO_BASE} className="topbar-title">
          算法设计与分析
        </Link>
        {subtitle && <span className="topbar-sub">{decodeEntities(subtitle)}</span>}
      </div>
      <SiteTabs currentDeck={currentDeck} />
      <div className="topbar-right nav-pill">
        <SearchBox />
        <ThemeToggle />
      </div>
    </header>
  );
}
