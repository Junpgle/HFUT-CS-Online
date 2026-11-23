import type { ErrataChange, ErrataPatch } from './types';

/**
 * 已合并的读者勘误。
 *
 * 每个 PR 只新增一个 `src/content/errata/<id>.json`，构建时由 Vite 打包进来；
 * 运行时按 page 过滤、按提交时间顺序套用到正文。文件格式见同目录 README.md。
 */
const modules = import.meta.glob<ErrataPatch>('./errata/*.json', {
  eager: true,
  import: 'default',
});

function isChange(value: unknown): value is ErrataChange {
  if (!value || typeof value !== 'object') return false;
  const c = value as Record<string, unknown>;
  return (
    typeof c.page === 'string' &&
    c.page.startsWith('/') &&
    typeof c.old === 'string' &&
    typeof c.new === 'string' &&
    c.old !== c.new &&
    (c.anchor === undefined || typeof c.anchor === 'string') &&
    (c.occurrence === undefined ||
      (typeof c.occurrence === 'number' && Number.isInteger(c.occurrence) && c.occurrence >= 0))
  );
}

function normalize(raw: unknown, fallbackId: string): ErrataPatch | null {
  if (!raw || typeof raw !== 'object') return null;
  const p = raw as Record<string, unknown>;
  if (p.version !== 1 || !Array.isArray(p.changes)) return null;
  const changes = p.changes.filter(isChange);
  if (changes.length === 0) return null;
  return {
    version: 1,
    id: typeof p.id === 'string' && p.id ? p.id : fallbackId,
    createdAt: typeof p.createdAt === 'string' ? p.createdAt : '',
    pageTitle: typeof p.pageTitle === 'string' ? p.pageTitle : undefined,
    note: typeof p.note === 'string' ? p.note : undefined,
    changes,
  };
}

/** 按提交时间升序（同一秒内按 id），保证后提交的勘误叠加在先提交的之上 */
export const errataPatches: ErrataPatch[] = Object.entries(modules)
  .map(([path, raw]) => normalize(raw, path.replace(/^.*\//, '').replace(/\.json$/, '')))
  .filter((p): p is ErrataPatch => p !== null)
  .sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id));

/** 当前页面相关的勘误条数（未合并的 PR 不会出现在这里） */
export function errataCountForPage(page: string): number {
  let n = 0;
  for (const patch of errataPatches) {
    for (const change of patch.changes) if (change.page === page) n++;
  }
  return n;
}
