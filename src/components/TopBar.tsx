import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { decodeEntities } from '../lib/text';
import { IconArrowLeft, IconMenu } from './icons';
import ThemeToggle from './ThemeToggle';
import SearchBox, { type SearchIndexItem } from './SearchBox';

/** 顶栏中部的一个导航按钮（总目录 / 各讲次·章节 / 在线练习） */
export interface CourseTab {
  to: string;
  /** 宽屏显示文案，如「第1讲」 */
  full: string;
  /** 窄屏显示文案，如「1」 */
  short: string;
  active: boolean;
  /** 讲次/章节 key（用于 data-deck 标记；总目录与练习为 null） */
  key?: string | null;
  /** 悬停提示（完整标题） */
  tip: string;
  extra?: string;
}

interface Props {
  /** 课程名（左侧胶囊） */
  courseName: string;
  /** 课程根路由（课程名胶囊的跳转目标） */
  courseBase: string;
  /** 课程名胶囊的悬停说明 */
  courseTip: string;
  /** 当前页副标（讲次/章节标题） */
  subtitle?: string;
  tabs: CourseTab[];
  /** 搜索索引与条目跳转路由（各课程自行构建） */
  searchIndex: SearchIndexItem[];
  searchLinkTo: (item: SearchIndexItem) => string;
  /** 空结果时的示例关键词（缺省用算法课的一组） */
  suggestions?: string[];
  onOpenSidebar: () => void;
}

/** 顶栏中部的课程导航：一项对应一页，线性排列无回环 */
function SiteTabs({ tabs }: { tabs: CourseTab[] }) {
  const reduced = useReducedMotion();
  return (
    <nav className="deck-tabs nav-pill" aria-label="课程导航">
      {tabs.map((t) => (
        <Link
          key={t.to}
          to={t.to}
          className={`deck-tab${t.active ? ' active' : ''}${t.extra ? ' ' + t.extra : ''}`}
          data-deck={t.key ?? undefined}
          data-title={t.tip}
          aria-current={t.active ? 'page' : undefined}
        >
          {t.active && (
            <motion.span
              className="deck-tab-pill"
              layoutId="deck-tab-pill"
              transition={reduced ? { duration: 0 } : { type: 'tween', duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            />
          )}
          <span className="deck-tab-no">
            <span className="tab-full">{t.full}</span>
            <span className="tab-short">{t.short}</span>
          </span>
        </Link>
      ))}
    </nav>
  );
}

/**
 * 课程顶栏：返回站点首页 / 抽屉触发 / 课程名胶囊 + 课程导航 + 搜索与主题切换。
 * 组件只管布局与样式，具体课程的数据（课程名、导航项）全部由调用方传入。
 */
export default function TopBar({
  courseName,
  courseBase,
  courseTip,
  subtitle,
  tabs,
  searchIndex,
  searchLinkTo,
  suggestions,
  onOpenSidebar,
}: Props) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        {/* 独立返回胶囊：左箭头回站点首页 */}
        <Link to="/" className="topbar-ctl nav-pill" aria-label="返回课程资料库首页" title="返回课程资料库首页">
          <span className="icon-btn">
            <IconArrowLeft size={18} />
          </span>
        </Link>
        <button
          className="topbar-ctl nav-pill drawer-trigger"
          aria-label="打开目录"
          onClick={onOpenSidebar}
        >
          <span className="icon-btn">
            <IconMenu />
          </span>
        </button>
        {/* 课程名独立胶囊：与返回箭头/搜索等同语言 */}
        <Link to={courseBase} className="topbar-ctl nav-pill topbar-title" title={courseTip}>
          {courseName}
        </Link>
        {subtitle && <span className="topbar-sub">{decodeEntities(subtitle)}</span>}
      </div>
      <SiteTabs tabs={tabs} />
      <div className="topbar-right">
        <div className="topbar-ctl nav-pill">
          <SearchBox index={searchIndex} linkTo={searchLinkTo} suggestions={suggestions} />
        </div>
        <div className="topbar-ctl nav-pill">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
