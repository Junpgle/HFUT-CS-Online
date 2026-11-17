import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import type { TocEntry } from '../content/types';
import { useToc } from '../lib/toc';
import { decodeEntities } from '../lib/text';

export interface DeckMetaLite {
  id: string;
  no: string;
  title: string;
}

interface Props {
  decks: DeckMetaLite[];
  currentDeck: string | null;
}

/* ------------------------------------------------------------ 目录分组折叠 */
interface TocGroup {
  /** 组头（level 2）的 id；若开头没有 level 2，用首项自身 */
  id: string;
  text: string;
  /** 组头自己的条目（level 2），孤立项时为 null */
  head: TocEntry | null;
  children: TocEntry[];
}

function buildGroups(toc: TocEntry[]): TocGroup[] {
  const groups: TocGroup[] = [];
  for (const e of toc) {
    if (e.level === 2) groups.push({ id: e.id, text: e.text, head: e, children: [] });
    else if (groups.length) groups[groups.length - 1].children.push(e);
    else groups.push({ id: e.id, text: e.text, head: null, children: [] });
  }
  return groups;
}

function TocGroupItem({
  group,
  activeId,
  expanded,
  onToggle,
  onJump,
}: {
  group: TocGroup;
  activeId: string | null;
  expanded: boolean;
  onToggle: () => void;
  onJump: (id: string) => void;
}) {
  const childActive = group.children.some((c) => c.id === activeId);
  const headActive = group.head?.id === activeId;
  const showChildren = expanded || childActive;
  return (
    <li className={childActive || headActive ? 'toc-group has-active' : 'toc-group'}>
      {group.head ? (
        <div className="toc-row">
          <TocLink e={group.head} active={headActive} onJump={onJump} />
          {group.children.length > 0 && (
            <button
              type="button"
              className="toc-fold"
              aria-expanded={showChildren}
              aria-label={showChildren ? '折叠小节' : '展开小节'}
              onClick={onToggle}
            >
              <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
                <path d="M2.5 4.5 L6 8 L9.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      ) : (
        <TocLink e={group.children[0]} active={activeId === group.children[0].id} onJump={onJump} />
      )}
      {group.children.length > 0 && (
        /* 高度折叠动画：grid-template-rows 0fr → 1fr（展开的组内容始终挂载） */
        <div className={`toc-sub-wrap${showChildren ? ' open' : ''}`}>
          <ul className="toc toc-sub">
            {group.children.map((c) => (
              <li key={c.id}>
                <TocLink e={c} active={activeId === c.id} onJump={onJump} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

function TocLink({ e, active, onJump }: { e: TocEntry; active: boolean; onJump: (id: string) => void }) {
  return (
    <a
      href={`#${e.id}`}
      className={active ? 'active' : e.level === 3 ? 'lvl3' : undefined}
      onClick={(ev) => {
        ev.preventDefault();
        onJump(e.id);
      }}
    >
      {active && <motion.span layoutId="toc-indicator" className="toc-indicator" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
      {decodeEntities(e.text)}
    </a>
  );
}

/** 侧栏目录：level 2 分组、组内 level 3 可折叠；当前小节所在组自动展开 */
function Toc() {
  const { toc, activeId, jump } = useToc();
  const groups = useMemo(() => buildGroups(toc), [toc]);

  const containsActive = (g: TocGroup) => g.head?.id === activeId || g.children.some((c) => c.id === activeId);
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  // activeId 变化时自动展开所在组（保留用户手动折叠的其他组）
  useEffect(() => {
    if (!activeId) return;
    const g = groups.find(containsActive);
    if (g) setOpenIds((prev) => new Set(prev).add(g.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, groups]);

  if (toc.length === 0) return null;

  return (
    <>
      <p className="sidebar-h">本页内容</p>
      <ul className="toc">
        {groups.map((g) => (
          <TocGroupItem
            key={g.id}
            group={g}
            activeId={activeId}
            expanded={openIds.has(g.id)}
            onToggle={() =>
              setOpenIds((prev) => {
                const next = new Set(prev);
                if (next.has(g.id)) next.delete(g.id);
                else next.add(g.id);
                return next;
              })
            }
            onJump={(id) => jump?.(id)}
          />
        ))}
      </ul>
    </>
  );
}

/* -------------------------------------------------------------- 侧栏主体 */
/** 侧栏内容（桌面侧栏与移动端抽屉共用） */
export function SidebarContent({ decks, currentDeck }: Props) {
  const { toc } = useToc();
  return (
    <>
      <p className="sidebar-h">全站导航</p>
      <ul className="site-nav">
        <li>
          <Link to="/" className={currentDeck === null ? 'active' : undefined}>
            <span className="nav-no">◎</span>
            总目录 · 考点速查
          </Link>
        </li>
        {decks.map((d) => (
          <li key={d.id} data-deck={d.id}>
            <Link to={`/deck/${d.id}`} className={currentDeck === d.id ? 'active' : undefined}>
              <span className="nav-no">{d.no.replace('第', '').replace('讲', '')}</span>
              {decodeEntities(d.title)}
            </Link>
          </li>
        ))}
      </ul>

      {toc.length > 0 && <Toc />}
    </>
  );
}

export default function Sidebar(props: Props) {
  return (
    <nav className="sidebar material" aria-label="全站目录">
      <SidebarContent {...props} />
    </nav>
  );
}
