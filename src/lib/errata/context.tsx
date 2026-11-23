import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useLocation } from 'react-router-dom';
import { errataCountForPage } from '../../content/errata';
import ErrataDialog from '../../components/ErrataDialog';
import ErrataDock from '../../components/ErrataDock';
import { applyPatches } from './dom';
import { ErrataSession, type PendingChange } from './session';

interface ErrataContextValue {
  /** 是否处于编辑模式 */
  active: boolean;
  /** 待提交改动数 */
  count: number;
  enter: () => void;
  exit: () => void;
  openSubmit: () => void;
}

const Ctx = createContext<ErrataContextValue | null>(null);

export function useErrata(): ErrataContextValue {
  const value = useContext(Ctx);
  if (!value) throw new Error('useErrata 必须在 ErrataProvider 内使用');
  return value;
}

/**
 * 勘误层：
 * - 平时把已合并的 errata 套到当前页（无编辑态，读者只看到订正后的正文）；
 * - 进入编辑模式后，把正文叶子单元变成 contenteditable，记录改动；
 * - 底部胶囊展示进度，审阅弹窗负责生成 PR。
 *
 * 挂在 App 层（HashRouter 内），所有课程页共用一份状态，跨页改动也能一起提交。
 */
export function ErrataProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const sessionRef = useRef<ErrataSession | null>(null);
  if (!sessionRef.current) sessionRef.current = new ErrataSession();
  const session = sessionRef.current;

  const [active, setActive] = useState(false);
  const [records, setRecords] = useState<PendingChange[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    session.onChange = () => setRecords(session.records());
    return () => {
      session.onChange = null;
    };
  }, [session]);

  // 非编辑态：随页面渲染（含 React 局部重渲染）套用已合并的勘误
  useEffect(() => {
    let disposed = false;
    let timer: number | undefined;
    const run = () => {
      if (disposed || activeRef.current) return;
      if (errataCountForPage(pathname) === 0) return;
      const root = document.querySelector<HTMLElement>('.page');
      if (root) applyPatches(root, pathname);
    };
    run();
    const mo = new MutationObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(run, 160);
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      disposed = true;
      mo.disconnect();
      window.clearTimeout(timer);
    };
  }, [pathname]);

  // 编辑态：等 .page 出现后挂上会话（课程包是懒加载的，首帧可能还没有正文）
  useEffect(() => {
    if (!active) return;
    document.documentElement.classList.add('errata-on');
    let disposed = false;
    let root: HTMLElement | null = null;
    let syncTimer: number | undefined;

    const start = () => {
      if (disposed) return;
      if (root && !root.isConnected) {
        session.leave();
        root = null;
      }
      if (root) return;
      const el = document.querySelector<HTMLElement>('.page');
      if (!el) return;
      root = el;
      // 编辑基线 = 已合并勘误套用后的正文
      applyPatches(el, pathname);
      session.enter(el, pathname);
      session.applyPending(pathname);
      syncTimer = window.setTimeout(() => session.sync(), 300);
    };

    start();
    const mo = new MutationObserver(start);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      disposed = true;
      mo.disconnect();
      window.clearTimeout(syncTimer);
      session.leave();
      document.documentElement.classList.remove('errata-on');
      setRecords(session.records());
    };
  }, [active, pathname, session]);

  // Esc：弹窗打开时由弹窗自己处理（有提交结果时会收尾清空）；否则退出编辑模式
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || dialogOpen) return;
      if (activeRef.current) setActive(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dialogOpen]);

  // 有未提交改动时，离开页面前提醒
  const hasPending = records.length > 0;
  useEffect(() => {
    if (!hasPending) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [hasPending]);

  const enter = useCallback(() => setActive(true), []);
  const exit = useCallback(() => setActive(false), []);
  const openSubmit = useCallback(() => setDialogOpen(true), []);

  const done = useCallback(() => {
    session.clear();
    setRecords([]);
    setDialogOpen(false);
    setActive(false);
  }, [session]);

  const value = useMemo<ErrataContextValue>(
    () => ({ active, count: records.length, enter, exit, openSubmit }),
    [active, records.length, enter, exit, openSubmit],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <ErrataDock
        active={active}
        count={records.length}
        hidden={dialogOpen}
        onEnter={enter}
        onExit={exit}
        onSubmit={openSubmit}
      />
      <ErrataDialog
        open={dialogOpen}
        changes={records}
        page={pathname}
        onClose={() => setDialogOpen(false)}
        onRevert={(key) => session.revert(key)}
        onLocate={(change) => {
          setDialogOpen(false);
          requestAnimationFrame(() => {
            const el = change.el;
            if (!el || !el.isConnected) return;
            el.focus({ preventScroll: true });
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          });
        }}
        onDone={done}
      />
    </Ctx.Provider>
  );
}
