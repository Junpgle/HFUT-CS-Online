import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { diffView } from '../lib/errata/diff';
import {
  buildPatch,
  makePatchId,
  errataFilePath,
  ERRATA_REPO,
  patchSummary,
  serializePatch,
} from '../lib/errata/patch';
import { copyText } from '../lib/errata/clipboard';
import {
  createPullRequest,
  githubErrorText,
  loadToken,
  newFileUrl,
  saveToken,
} from '../lib/errata/github';
import type { PendingChange } from '../lib/errata/session';
import { IconCheck, IconCopy, IconX } from './icons';

interface Props {
  open: boolean;
  changes: PendingChange[];
  /** 当前路由，用于判断改动是否都在本页 */
  page: string;
  onClose: () => void;
  onRevert: (key: string) => void;
  /** 定位到某条改动（会先关掉弹窗） */
  onLocate: (change: PendingChange) => void;
  /** 结束：清空改动、退出编辑模式 */
  onDone: () => void;
}

interface SubmitResult {
  kind: 'pr' | 'new-file';
  url: string;
  text: string;
}

const clip = (s: string, max = 46) => {
  const t = s.replace(/\s+/g, ' ').trim();
  return t.length > max ? `${t.slice(0, max)}…` : t;
};

/** 审阅 + 提交流程：逐条核对改动，生成 errata JSON 并开 PR */
export default function ErrataDialog({
  open,
  changes,
  page,
  onClose,
  onRevert,
  onLocate,
  onDone,
}: Props) {
  const reduced = useReducedMotion();
  const [note, setNote] = useState('');
  const [token, setToken] = useState(() => loadToken());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const idRef = useRef('');
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!open) return;
    idRef.current = makePatchId();
    setError(null);
    setResult(null);
    setCopied(false);
    setJsonText('');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // 弹窗自己处理 Esc：有结果时按「已完成」收尾，避免提交后关窗又留下重复提交的机会
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.preventDefault();
      e.stopPropagation();
      if (result) onDone();
      else onClose();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [open, result, onDone, onClose]);

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  const currentPatch = () => {
    if (!idRef.current) idRef.current = makePatchId();
    const shared = changes.length > 0 && changes.every((c) => c.page === page);
    const pageTitle = shared
      ? (document.querySelector<HTMLElement>('.page h1')?.textContent ?? '').trim()
      : '';
    return buildPatch({
      id: idRef.current,
      changes: changes.map((c) => ({
        page: c.page,
        anchor: c.anchor || undefined,
        old: c.original,
        new: c.next,
        occurrence: c.occurrence,
      })),
      note,
      pageTitle: pageTitle || undefined,
    });
  };

  const copyJson = async () => {
    const content = serializePatch(currentPatch());
    const ok = await copyText(content);
    setCopied(ok);
    if (!ok) setJsonText(content);
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 1800);
  };

  const submit = async () => {
    if (busy || changes.length === 0) return;
    setBusy(true);
    setError(null);
    setResult(null);
    setJsonText('');
    const patch = currentPatch();
    const content = serializePatch(patch);
    const filePath = errataFilePath(patch.id);
    const summary = patchSummary(patch);
    const typed = token.trim();
    saveToken(typed);
    try {
      if (typed) {
        const pr = await createPullRequest({
          token: typed,
          id: patch.id,
          filePath,
          content,
          title: summary.title,
          body: summary.body,
        });
        setResult({ kind: 'pr', url: pr.url, text: `已创建 PR #${pr.number}` });
        return;
      }
      // 无令牌：先把完整 JSON 放进剪贴板，再打开 GitHub 新建文件页；
      // 页面过长 / fork 后内容被刷空时，直接粘贴即可。
      const copiedOk = await copyText(content);
      const link = newFileUrl(filePath, content, summary.title);
      const opened = window.open(link.url, '_blank');
      if (opened) opened.opener = null;
      setResult({
        kind: 'new-file',
        url: link.url,
        text: opened
          ? link.tooLong
            ? `改动较多，GitHub 只预填了文件名；${copiedOk ? '完整 JSON 已复制，粘贴到文件编辑框即可。' : '请点「复制 JSON」后粘贴。'}`
            : `已打开 GitHub 新建文件页${copiedOk ? '，内容已复制（编辑框为空时粘贴即可）' : ''}；点 Propose new file 即自动 fork 并开 PR。`
          : `弹窗被浏览器拦截，请点下方链接打开 GitHub${copiedOk ? '；内容已复制' : ''}。`,
      });
    } catch (err) {
      setError(githubErrorText(err));
    } finally {
      setBusy(false);
    }
  };

  const close = () => {
    // 已经生成 PR / 打开 GitHub 后关窗，视为本次提交结束
    if (result) onDone();
    else onClose();
  };

  const submitLabel = token.trim() ? '创建 PR' : '提交勘误';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="hub-modal-scrim errata-scrim errata-ui"
          initial={reduced ? undefined : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: 0.16 }}
          onClick={close}
        >
          <motion.div
            className="hub-modal material errata-modal"
            role="dialog"
            aria-modal="true"
            aria-label="提交勘误"
            initial={reduced ? undefined : { opacity: 0, scale: 0.97, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, scale: 0.98, y: 6 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="hub-modal-head">
              <h2>提交勘误</h2>
              <button className="icon-btn" onClick={close} aria-label="关闭">
                <IconX size={16} />
              </button>
            </div>

            {result ? (
              <div className="errata-result" aria-live="polite">
                <p className="errata-result-line">{result.text}</p>
                {result.url && (
                  <p className="errata-result-url">
                    <a href={result.url} target="_blank" rel="noreferrer">
                      {result.kind === 'pr' ? '在 GitHub 查看 PR' : '在 GitHub 打开新建文件页'}
                    </a>
                  </p>
                )}
                {result.kind === 'pr' ? (
                  <p className="errata-msg ok">PR 已创建，维护者合并后自动生效。</p>
                ) : (
                  <p className="errata-msg">还没有生成 PR：请在 GitHub 页面点 Propose new file。</p>
                )}
                <div className="hub-modal-actions">
                  <button type="button" className="btn" onClick={copyJson}>
                    {copied ? (
                      <>
                        <IconCheck size={13} /> 已复制
                      </>
                    ) : (
                      <>
                        <IconCopy size={13} /> 复制 JSON
                      </>
                    )}
                  </button>
                  {result.kind !== 'pr' && (
                    <button type="button" className="btn" onClick={() => setResult(null)}>
                      返回
                    </button>
                  )}
                  <button type="button" className="btn primary" onClick={onDone}>
                    完成
                  </button>
                </div>
              </div>
            ) : changes.length === 0 ? (
              <div className="errata-result">
                <p className="errata-result-line">没有待提交的修改。</p>
                <div className="hub-modal-actions">
                  <button type="button" className="btn primary" onClick={onDone}>
                    关闭
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="errata-meta">
                  {changes.length} 处修改 · 提交为 {ERRATA_REPO.owner}/{ERRATA_REPO.repo} 的 PR
                </p>

                <ol className="errata-list">
                  {changes.map((c) => {
                    const view = diffView(c.original, c.next);
                    const canLocate = c.el !== null && c.el.isConnected && c.page === page;
                    return (
                      <li className="errata-item" key={c.key}>
                        <div className="errata-item-head">
                          <span className="errata-loc">
                            {c.page}
                            {c.anchor ? ` · ${clip(c.anchor)}` : ''}
                          </span>
                          <span className="errata-item-actions">
                            {canLocate && (
                              <button
                                type="button"
                                className="errata-link"
                                onClick={() => onLocate(c)}
                              >
                                定位
                              </button>
                            )}
                            <button type="button" className="errata-link" onClick={() => onRevert(c.key)}>
                              撤销
                            </button>
                          </span>
                        </div>
                        <p className="errata-diff">
                          {view.lead}
                          {view.remove && <del>{view.remove}</del>}
                          {view.add ? <ins>{view.add}</ins> : <span className="errata-empty">（删除）</span>}
                          {view.tail}
                        </p>
                      </li>
                    );
                  })}
                </ol>

                <label className="errata-note">
                  <span>备注（可选）</span>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="说明依据，例如「教材 P123」「老师课上更正」"
                    rows={2}
                  />
                </label>

                <details className="errata-token">
                  <summary>用 GitHub 令牌直接开 PR（可选）</summary>
                  <input
                    type="password"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="github_pat_… / ghp_…"
                    autoComplete="off"
                    spellCheck={false}
                    aria-label="GitHub 令牌"
                  />
                  <p>
                    细粒度令牌：本仓库 Contents 读写 + Pull requests 读写。令牌仅保存在本机浏览器。
                    {token.trim() && (
                      <>
                        {' '}
                        <button
                          type="button"
                          className="errata-link"
                          onClick={() => {
                            setToken('');
                            saveToken('');
                          }}
                        >
                          清除令牌
                        </button>
                      </>
                    )}
                  </p>
                </details>

                {error && (
                  <p className="errata-msg error" role="alert">
                    {error}
                  </p>
                )}
                {jsonText && (
                  <textarea
                    className="errata-json"
                    readOnly
                    value={jsonText}
                    onFocus={(e) => e.currentTarget.select()}
                    aria-label="勘误 JSON"
                  />
                )}

                <div className="hub-modal-actions">
                  <button type="button" className="btn" onClick={copyJson}>
                    {copied ? (
                      <>
                        <IconCheck size={13} /> 已复制
                      </>
                    ) : (
                      <>
                        <IconCopy size={13} /> 复制 JSON
                      </>
                    )}
                  </button>
                  <button type="button" className="btn" onClick={onClose}>
                    稍后提交
                  </button>
                  <button type="button" className="btn primary" onClick={submit} disabled={busy}>
                    {busy ? '提交中…' : submitLabel}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
