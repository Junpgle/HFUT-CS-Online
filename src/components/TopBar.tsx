import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { decks, type DeckData } from '../content';
import { useTheme } from '../lib/theme';
import { decodeEntities } from '../lib/text';
import { IconBook, IconCode, IconGitHub, IconMenu, IconMoon, IconSun } from './icons';
import SearchBox from './SearchBox';

const ISSUES_URL = 'https://github.com/SaltGardenia/HFUT-algorithm-design/issues';
const EXT_LINKS = [
  { href: 'https://www.hello-algo.com/chapter_hello_algo/', label: 'Hello 算法', icon: IconBook },
  { href: 'https://books.halfrost.com/leetcode', label: 'LeetCode 笔记（halfrost）', icon: IconCode },
] as const;

interface Props {
  subtitle?: string;
  currentDeck: string | null;
  onOpenSidebar: () => void;
}

/** 顶栏中部的全站导航：总目录 + 第1~8讲，一项对应一页，线性排列无回环 */
function SiteTabs({ currentDeck }: { currentDeck: string | null }) {
  const reduced = useReducedMotion();
  const item = (to: string, full: string, short: string, active: boolean, deck: string | null, tip: string) => (
    <Link
      key={to}
      to={to}
      className={`deck-tab${active ? ' active' : ''}`}
      data-deck={deck ?? undefined}
      data-title={tip}
      aria-current={active ? 'page' : undefined}
    >
      {active && (
        <motion.span
          className="deck-tab-pill"
          layoutId="deck-tab-pill"
          transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 480, damping: 34 }}
        />
      )}
      <span className="deck-tab-no">
        <span className="tab-full">{full}</span>
        <span className="tab-short">{short}</span>
      </span>
    </Link>
  );
  return (
    <nav className="deck-tabs" aria-label="全站导航">
      {item('/', '总目录', '目录', currentDeck === null, null, '首页 · 考点速查表')}
      {decks.map((d: DeckData) =>
        item(`/deck/${d.id}`, d.no, d.no.replace('第', '').replace('讲', ''), d.id === currentDeck, d.id, decodeEntities(d.title)),
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
        {EXT_LINKS.map(({ href, label, icon: Icon }) => (
          <a
            key={href}
            className="icon-btn"
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            title={label}
          >
            <Icon size={18} />
          </a>
        ))}
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
