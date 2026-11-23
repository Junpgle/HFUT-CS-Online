import type { ErrataChange, ErrataPatch } from '../../content/types';

/** 勘误文件落在仓库中的目录（构建时由 import.meta.glob 打包） */
export const ERRATA_DIR = 'src/content/errata';

/** 提交目标仓库。换仓库名时同步 vite.config.ts 的 base 与 README。 */
export const ERRATA_REPO = {
  owner: 'SaltGardenia',
  repo: 'HFUT-CS-Online',
  branch: 'main',
} as const;

/** 构建 patch 的最小输入（PendingChange 与测试共用） */
export interface PatchChangeInput {
  page: string;
  anchor?: string;
  old: string;
  new: string;
  occurrence?: number;
}

export interface BuildPatchOptions {
  changes: PatchChangeInput[];
  note?: string;
  pageTitle?: string;
  id?: string;
  now?: Date;
}

const pad = (n: number) => String(n).padStart(2, '0');

function randomSuffix(): string {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = new Uint8Array(4);
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  let out = '';
  for (const b of bytes) out += alphabet[b % alphabet.length];
  return out;
}

/** 文件名即 id：时间戳 + 随机后缀，天然按时间排序且不会撞名 */
export function makePatchId(now = new Date()): string {
  const stamp =
    `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}` +
    `-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  return `${stamp}-${randomSuffix()}`;
}

export function buildPatch({ changes, note, pageTitle, id, now }: BuildPatchOptions): ErrataPatch {
  const created = now ?? new Date();
  const list: ErrataChange[] = changes.map((c) => {
    const item: ErrataChange = {
      page: c.page,
      old: c.old,
      new: c.new,
      occurrence: c.occurrence ?? 0,
    };
    if (c.anchor) item.anchor = c.anchor;
    return item;
  });
  const patch: ErrataPatch = {
    version: 1,
    id: id ?? makePatchId(created),
    createdAt: created.toISOString(),
    changes: list,
  };
  if (pageTitle) patch.pageTitle = pageTitle;
  if (note?.trim()) patch.note = note.trim();
  return patch;
}

/** 稳定、可审阅的 JSON（2 空格缩进 + 末尾换行） */
export function serializePatch(patch: ErrataPatch): string {
  return `${JSON.stringify(patch, null, 2)}\n`;
}

export function errataFileName(id: string): string {
  return `${id}.json`;
}

export function errataFilePath(id: string): string {
  return `${ERRATA_DIR}/${errataFileName(id)}`;
}

const oneLine = (s: string, max = 90): string => {
  const t = s.replace(/\s+/g, ' ').trim();
  return t.length > max ? `${t.slice(0, max)}…` : t;
};

/** 站点上的绝对链接（PR 正文里用） */
export function pageUrl(page: string): string {
  const base = import.meta.env.BASE_URL || '/';
  const origin = typeof location !== 'undefined' ? location.origin : 'https://saltgardenia.github.io';
  return `${origin}${base}#${page}`;
}

export interface PatchSummary {
  title: string;
  body: string;
}

/** PR 标题与正文：只放可读摘要，完整原文在 JSON 里 */
export function patchSummary(patch: ErrataPatch): PatchSummary {
  const n = patch.changes.length;
  const pages = Array.from(new Set(patch.changes.map((c) => c.page)));
  const label = patch.pageTitle
    ? oneLine(patch.pageTitle, 36)
    : pages.length === 1
      ? pages[0]
      : `${pages.length} 个页面`;
  const title = `fix(errata): ${label} · ${n} 处勘误`.slice(0, 90);
  const lines: string[] = [
    '由站点「勘误」功能生成：读者在正文上原地修改后提交，改动以 JSON 记录。',
    '',
    `- 页面：${pages.map((p) => pageUrl(p)).join('、')}`,
    `- 改动：${n} 处`,
    '',
    '### 改动明细',
  ];
  patch.changes.slice(0, 20).forEach((c, i) => {
    lines.push(`${i + 1}. **${oneLine(c.anchor || '正文', 60)}**`);
    lines.push(`   - 原：${oneLine(c.old)}`);
    lines.push(`   - 改：${oneLine(c.new)}`);
  });
  if (n > 20) lines.push(`…另有 ${n - 20} 处，详见 JSON。`);
  if (patch.note) lines.push('', `> ${oneLine(patch.note, 600)}`);
  lines.push('', '> 合并后，站点构建时会把该勘误套用到对应页面。');
  return { title, body: lines.join('\n') };
}
