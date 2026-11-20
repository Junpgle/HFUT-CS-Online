import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { courses } from '../courses/registry';
import { useToc } from '../lib/toc';

/* ------------------------------------------------------------------ 类型 */
interface AttNode {
  /** 文件/目录名 */
  n: string;
  /** 相对课程目录的 POSIX 路径 */
  p: string;
  /** 文件字节数（仅文件） */
  s?: number;
  /** 子节点（仅目录） */
  c?: AttNode[];
  /** 来源仓库 key（文件清单.csv 溯源） */
  r?: string;
  /** 上游仓库内路径 */
  sp?: string;
}
interface AttManifest {
  semester: string;
  course: string;
  cats: { name: string; tree: AttNode[] }[];
}

/** 四个上游资料仓库 → raw 直链参数（分支已实测） */
const REPOS: Record<string, { owner: string; repo: string; branch: string }> = {
  sunmiao: { owner: 'sunmiao0301', repo: 'HFUT-CS', branch: 'main' },
  styitches: { owner: 'styitches', repo: 'HFUT-CS', branch: 'main' },
  mox: { owner: 'mox-hub', repo: 'hfut-cs', branch: 'master' },
  luna: { owner: 'Tuning-Luna', repo: 'HFUT_XC_Study_Things', branch: 'main' },
};

function fmtSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

const countFiles = (nodes: AttNode[]): number => nodes.reduce((a, x) => a + (x.c ? countFiles(x.c) : 1), 0);

/** 与类别同名的顶层目录（课件/课件）拍平到类别下，避免组头与目录重名 */
const flattenCats = (m: AttManifest) => m.cats.map((c) => ({ name: c.name, tree: c.tree.flatMap((t) => (t.c && t.n === c.name ? t.c : [t])) }));

/** 递归收集目录树里的全部文件（目录不单独成行，路径体现在每行的 meta 里） */
const collectFiles = (nodes: AttNode[]): AttNode[] =>
  nodes.flatMap((n) => (n.c ? collectFiles(n.c) : [n]));

/**
 * 课程附件页 —— 所有课程共用的「附件」导航页。
 * 资料文件本体不入库（data/** 被 gitignore），预览不可用：页面按课件/试题/附件三类
 * 单列陈列文件清单，一键下载直接从四个上游资料仓库拉取 raw 文件存盘（fetch→blob→download）。
 * 清单由 npm run catalog 生成至 public/attachments/（含来源仓库与源路径溯源）。
 */
export default function CourseAttachmentsPage() {
  const location = useLocation();
  const toc = useToc();

  const course = useMemo(
    () => courses.find((c) => location.pathname.startsWith(`${c.base}/`) || location.pathname === c.base),
    [location.pathname],
  );
  const key = course ? `${course.semester}__${course.name}` : null;

  const [manifest, setManifest] = useState<AttManifest | null>(null);
  const [missing, setMissing] = useState(false);
  const [loading, setLoading] = useState(true);
  /** 正在下载的文件路径（按钮转「下载中…」） */
  const [pending, setPending] = useState<string | null>(null);

  useEffect(() => {
    toc.report([], () => {});
    return () => toc.report([], () => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 拉取课程清单
  useEffect(() => {
    if (!key) return;
    let alive = true;
    setLoading(true);
    setMissing(false);
    setManifest(null);
    fetch(`${import.meta.env.BASE_URL}attachments/${key}.json`)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json() as Promise<AttManifest>;
      })
      .then((m) => alive && setManifest(m))
      .catch(() => alive && setMissing(true))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [key]);

  /** 仓库 raw 直链（路径逐段编码，保留 /） */
  const rawUrl = (node: AttNode) => {
    const meta = REPOS[node.r!];
    return `https://raw.githubusercontent.com/${meta.owner}/${meta.repo}/${meta.branch}/${node.sp!.split('/').map(encodeURIComponent).join('/')}`;
  };

  /** 一键下载：fetch raw → blob → 存盘；失败兜底新开 raw 直链 */
  const download = async (node: AttNode) => {
    if (!node.r || pending) return;
    const url = rawUrl(node);
    setPending(node.p);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(String(res.status));
      const blob = await res.blob();
      const a = document.createElement('a');
      const u = URL.createObjectURL(blob);
      a.href = u;
      a.download = node.n;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(u), 4000);
    } catch {
      window.open(url, '_blank', 'noopener');
    } finally {
      setPending(null);
    }
  };

  const cats = manifest ? flattenCats(manifest) : [];
  const total = manifest ? countFiles(manifest.cats.reduce<AttNode[]>((a, c) => a.concat(c.tree), [])) : 0;

  return (
    <div className="page att-page">
      <h1>附件</h1>
      <div className="lede">
        <p>
          {course?.name} 课程资料：课件 · 试题 · 附件共 {manifest ? total : '—'} 份文件，均来自 4 个上游资料仓库，可一键下载原文件。
        </p>
      </div>

      {loading && <div className="att-state">清单加载中…</div>}

      {!loading && missing && (
        <div className="callout key att-state">
          <p className="callout-h">本课程暂无附件清单</p>
          <p>本课程的课件讲义与自测题随仓库内容自建，未使用 data/ 资料库目录；课件可从顶部导航进入阅读。</p>
        </div>
      )}

      {!loading && manifest && (
        <div className="att-list">
          {cats.map((cat) =>
            cat.tree.length > 0 ? (
              <section key={cat.name} className="att-cat material">
                <p className="att-cat-h">
                  {cat.name}
                  <span className="att-cat-count">{countFiles(cat.tree)}</span>
                </p>
                <div className="att-rows">
                  {collectFiles(cat.tree)
                    .sort((a, b) => a.p.localeCompare(b.p, 'zh-Hans-CN'))
                    .map((node) => (
                      <div key={node.p} className="att-row">
                        <div className="att-row-main">
                          <span className="att-row-name" title={node.n}>
                            {node.n}
                          </span>
                          <span className="att-row-path">
                            {node.p} · {fmtSize(node.s ?? 0)}
                            {node.r && ` · 来自 ${REPOS[node.r].owner}`}
                          </span>
                        </div>
                        {node.r ? (
                          <button type="button" className="btn att-dl" disabled={pending === node.p} onClick={() => download(node)}>
                            {pending === node.p ? '下载中…' : '下载'}
                          </button>
                        ) : (
                          <button type="button" className="btn att-dl" disabled title="该文件未溯源到上游仓库">
                            下载
                          </button>
                        )}
                      </div>
                    ))}
                </div>
              </section>
            ) : null,
          )}
        </div>
      )}
    </div>
  );
}