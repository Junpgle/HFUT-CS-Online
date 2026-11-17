import { useMemo } from 'react';
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
  onJump,
}: {
  group: TocGroup;
  activeId: string | null;
  onJump: (id: string) => void;
}) {
  const childActive = group.children.some((c) => c.id === activeId);
  const headActive = group.head?.id === activeId;
  return (
    <li className={childActive || headActive ? 'toc-group has-active' : 'toc-group'}>
      {group.head ? (
        <div className="toc-row">
          <TocLink e={group.head} active={headActive} onJump={onJump} />
        </div>
      ) : (
        <TocLink e={group.children[0]} active={activeId === group.children[0].id} onJump={onJump} />
      )}
      {group.children.length > 0 && (
        /* 全部展开显示，不提供折叠交互 */
        <ul className="toc toc-sub">
          {group.children.map((c) => (
            <li key={c.id}>
              <TocLink e={c} active={activeId === c.id} onJump={onJump} />
            </li>
          ))}
        </ul>
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

/** 侧栏目录：level 2 分组、level 3 全部展开显示，无折叠交互 */
function Toc() {
  const { toc, activeId, jump } = useToc();
  const groups = useMemo(() => buildGroups(toc), [toc]);

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
            onJump={(id) => jump?.(id)}
          />
        ))}
      </ul>
    </>
  );
}

/* -------------------------------------------------------------- 侧栏主体 */
/** 移动端抽屉内容：全站导航（已迁顶栏中部，窄屏保留在抽屉）+ 本页内容 */
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

/** 桌面侧栏：只显示本页内容目录（全站导航由顶栏中部承接，不再首尾相连地每页重复） */
export default function Sidebar(_props: Props) {
  const { toc } = useToc();
  if (toc.length === 0) return null;
  return (
    <nav className="sidebar material" aria-label="本页内容目录">
      <Toc />
    </nav>
  );
}
