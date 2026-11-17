import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { Link } from 'react-router-dom';
import { decks, type DeckData } from '../content';
import { useTheme } from '../lib/theme';
import { decodeEntities } from '../lib/text';
import { IconMenu, IconMoon, IconSearch, IconSun } from './icons';

interface Props {
  subtitle?: string;
  currentDeck: string | null;
  onOpenSidebar: () => void;
  onOpenSearch: () => void;
}

/** 顶栏中央的讲次分段切换条（宽屏显示，窄屏收进抽屉） */
function DeckTabs({ currentDeck }: { currentDeck: string | null }) {
  const reduced = useReducedMotion();
  return (
    <nav className="deck-tabs" aria-label="讲次快速切换">
      {decks.map((d: DeckData) => (
        <Link
          key={d.id}
          to={`/deck/${d.id}`}
          className={`deck-tab${d.id === currentDeck ? ' active' : ''}`}
          data-deck={d.id}
          aria-current={d.id === currentDeck ? 'page' : undefined}
        >
          {d.id === currentDeck && (
            <motion.span
              className="deck-tab-pill"
              layoutId="deck-tab-pill"
              transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 480, damping: 34 }}
            />
          )}
          <span className="deck-tab-no">第{d.no.replace(/^第|讲$/g, '')}</span>
        </Link>
      ))}
    </nav>
  );
}

export default function TopBar({ subtitle, currentDeck, onOpenSidebar, onOpenSearch }: Props) {
  const { theme, toggle } = useTheme();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });

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
      <DeckTabs currentDeck={currentDeck} />
      <div className="topbar-right">
        <button className="topbar-btn" onClick={onOpenSearch} aria-label="搜索手册内容">
          <IconSearch size={15} />
          <span>搜索</span>
          <span className="kbd">⌘K</span>
        </button>
        <button
          className="icon-btn"
          onClick={toggle}
          aria-label={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
        >
          {theme === 'dark' ? <IconSun /> : <IconMoon />}
        </button>
      </div>
      <motion.div className="reading-progress" style={{ scaleX }} />
    </header>
  );
}
