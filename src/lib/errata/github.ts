import { ERRATA_REPO } from './patch';

/**
 * 提交到 GitHub 的两条路：
 * 1. 有个人令牌 → 浏览器直连 REST API，建分支 / 提交文件 / 开 PR（一次点击）；
 * 2. 无令牌 → 打开 GitHub「新建文件」预填页，读者点一次 Propose new file，
 *    由 GitHub 自动 fork 并开 PR（无需任何配置）。
 */

/** GitHub 对 URL 长度有上限（实测 ~6.8k 字符后返回 4xx），超限时改走「只预填文件名 + 粘贴」 */
export const NEW_FILE_URL_LIMIT = 6500;

const TOKEN_KEY = 'hfut-cs-errata-token';

export function loadToken(): string {
  try {
    return localStorage.getItem(TOKEN_KEY) ?? '';
  } catch {
    return '';
  }
}

export function saveToken(token: string): void {
  try {
    if (token.trim()) localStorage.setItem(TOKEN_KEY, token.trim());
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* 隐私模式下 localStorage 不可写，忽略 */
  }
}

export interface NewFileLink {
  /** 实际要打开的地址（超长时只预填文件名） */
  url: string;
  /** 完整预填地址（即使超长也保留，供复制） */
  fullUrl: string;
  tooLong: boolean;
}

function newFileBase(): string {
  const { owner, repo, branch } = ERRATA_REPO;
  return `https://github.com/${owner}/${repo}/new/${branch}`;
}

export function newFileUrl(filePath: string, content: string, message: string): NewFileLink {
  const base = newFileBase();
  // 保留目录分隔符，只转义各段（GitHub 的 filename 参数按路径解读）
  const encodedPath = filePath.split('/').map(encodeURIComponent).join('/');
  const fullUrl =
    `${base}?filename=${encodedPath}` +
    `&value=${encodeURIComponent(content)}` +
    `&message=${encodeURIComponent(message)}`;
  const tooLong = fullUrl.length > NEW_FILE_URL_LIMIT;
  return {
    url: tooLong ? `${base}?filename=${encodedPath}` : fullUrl,
    fullUrl,
    tooLong,
  };
}

export class GitHubApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'GitHubApiError';
    this.status = status;
  }
}

function encodePath(path: string): string {
  return path.split('/').map(encodeURIComponent).join('/');
}

/** UTF-8 文本 → base64（Contents API 要求） */
export function utf8ToBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

async function api<T>(path: string, token: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token.trim()}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...(init.headers as Record<string, string> | undefined),
    },
  });
  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    /* 非 JSON 错误页 */
  }
  if (!res.ok) {
    const message =
      data && typeof data === 'object' && 'message' in data
        ? String((data as { message: unknown }).message)
        : `HTTP ${res.status}`;
    throw new GitHubApiError(res.status, message);
  }
  return data as T;
}

export interface CreatePullRequestInput {
  token: string;
  id: string;
  filePath: string;
  content: string;
  title: string;
  body: string;
}

export interface PullRequestResult {
  number: number;
  url: string;
}

export async function createPullRequest(input: CreatePullRequestInput): Promise<PullRequestResult> {
  const { owner, repo, branch } = ERRATA_REPO;
  const repoApi = `/repos/${owner}/${repo}`;
  const head = `errata/${input.id}`;

  const baseRef = await api<{ object: { sha: string } }>(
    `${repoApi}/git/ref/heads/${branch}`,
    input.token,
  );
  await api(`${repoApi}/git/refs`, input.token, {
    method: 'POST',
    body: JSON.stringify({ ref: `refs/heads/${head}`, sha: baseRef.object.sha }),
  });
  await api(`${repoApi}/contents/${encodePath(input.filePath)}`, input.token, {
    method: 'PUT',
    body: JSON.stringify({
      message: input.title,
      content: utf8ToBase64(input.content),
      branch: head,
    }),
  });
  const pr = await api<{ number: number; html_url: string }>(`${repoApi}/pulls`, input.token, {
    method: 'POST',
    body: JSON.stringify({
      title: input.title,
      head,
      base: branch,
      body: input.body,
    }),
  });
  return { number: pr.number, url: pr.html_url };
}

/** 把 API 错误翻成可执行的提示 */
export function githubErrorText(err: unknown): string {
  if (err instanceof GitHubApiError) {
    if (err.status === 401) return '令牌无效或已过期，请重新生成。';
    if (err.status === 403)
      return '令牌权限不足：需要本仓库 Contents（读写）与 Pull requests（读写）。';
    if (err.status === 404) return '仓库不可访问，或令牌没有该仓库的权限。';
    if (err.status === 422) return 'GitHub 拒绝提交（分支或内容冲突），请重试一次。';
    return `GitHub 返回 ${err.status}：${err.message}`;
  }
  if (err instanceof TypeError) return '网络不可用，无法连接 GitHub。';
  return err instanceof Error ? err.message : '提交失败，请稍后重试。';
}
