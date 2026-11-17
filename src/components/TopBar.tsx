import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { decks, type DeckData } from '../content';
import { useTheme } from '../lib/theme';
import { decodeEntities } from '../lib/text';
import { IconGitHub, IconMenu, IconMoon, IconSun } from './icons';
import SearchBox from './SearchBox';

const ISSUES_URL = 'https://github.com/SaltGardenia/HFUT-algorithm-design/issues';

interface Props {
  subtitle?: string;
  currentDeck: string | null;
  onOpenSidebar: () => void;
}

/** 顶栏中部的全站导航：总目录 + 第1~8讲，一项对应一页，线性排列无回环 */
function SiteTabs({ currentDeck }: { currentDeck: string | null }) {
  const reduced = useReducedMotion();
  const item = (to: string, label: string, active: boolean, deck?: string) => (
    <Link
      key={to}
      to={to}
      className={`deck-tab${active ? ' active' : ''}`}
      data-deck={deck}
      aria-current={active ? 'page' : undefined}
    >
      {active && (
        <motion.span
          className="deck-tab-pill"
          layoutId="deck-tab-pill"
          transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 480, damping: 34 }}
        />
      )}
      <span className="deck-tab-no">{label}</span>
    </Link>
  );
  return (
    <nav className="deck-tabs" aria-label="全站导航">
      {item('/', '总目录', currentDeck === null)}
      {decks.map((d: DeckData) =>
        item(`/deck/${d.id}`, d.no, d.id === currentDeck, d.id),
      )}
    </nav>
  );
}

export default function TopBar({ subtitle, currentDeck, onOpenSidebar }: Props) {
  const { theme, toggle } = useTheme();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="icon-btn drawer-trigger"
          aria-label="打开目录"
          onClick={onOpenSidebar}
        >
          <IconMenu />
        </button>
        <Link to="/" className="topbar-title">
          算法设计与分析<span className="accent"> · 复习手册</span>
        </Link>
        {subtitle && <span className="topbar-sub">{decodeEntities(subtitle)}</span>}
      </div>
      <SiteTabs currentDeck={currentDeck} />
      <div className="topbar-right">
        <SearchBox />
        <button
          className="icon-btn"
          onClick={toggle}
          aria-label={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
        >
          {theme === 'dark' ? <IconSun /> : <IconMoon />}
        </button>
        <a
          className="icon-btn"
          href={ISSUES_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="到 GitHub 仓库提交 Issue"
          title="提交 Issue"
        >
          <IconGitHub size={18} />
        </a>
      </div>
    </header>
  );
}
