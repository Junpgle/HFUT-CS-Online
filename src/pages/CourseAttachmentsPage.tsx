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
}
interface AttManifest {
  semester: string;
  course: string;
  cats: { name: string; tree: AttNode[] }[];
}

/** 按扩展名判定预览方式 */
type PreviewKind = 'pdf' | 'image' | 'text' | 'none';
function previewKind(name: string): PreviewKind {
  const ext = name.slice(name.lastIndexOf('.') + 1).toLowerCase();
  if (ext === 'pdf') return 'pdf';
  if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'bmp', 'ico'].includes(ext)) return 'image';
  if (['md', 'txt', 'csv', 'json', 'log', 'py', 'c', 'h', 'cpp', 'hpp', 'java', 'js', 'ts', 'css', 'yml', 'yaml', 'tex', 'bib'].includes(ext)) return 'text';
  return 'none';
}

function fmtSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

const countFiles = (nodes: AttNode[]): number => nodes.reduce((a, x) => a + (x.c ? countFiles(x.c) : 1), 0);

/** 与类别同名的顶层目录（课件/课件）拍平到类别下，避免组头与目录重名 */
const flattenCats = (m: AttManifest) => m.cats.map((c) => ({ name: c.name, tree: c.tree.flatMap((t) => (t.c && t.n === c.name ? t.c : [t])) }));

/* ------------------------------------------------------------- 目录树节点 */
function TreeNode({
  node,
  depth,
  openSet,
  toggle,
  selected,
  onSelect,
}: {
  node: AttNode;
  depth: number;
  openSet: Set<string>;
  toggle: (p: string) => void;
  selected: string | null;
  onSelect: (node: AttNode) => void;
}) {
  const isDir = !!node.c;
  const open = openSet.has(node.p);
  return (
    <li>
      {isDir ? (
        <>
          <button
            type="button"
            className={`att-dir${open ? ' open' : ''}`}
            style={{ paddingLeft: 8 + depth * 14 }}
            onClick={() => toggle(node.p)}
            aria-expanded={open}
          >
            <span className="att-caret" aria-hidden="true" />
            <span className="att-dir-name">{node.n}</span>
            <span className="att-dir-count">{node.c!.length}</span>
          </button>
          {open && (
            <ul className="att-sub">
              {node.c!.map((ch) => (
                <TreeNode key={ch.p} node={ch} depth={depth + 1} openSet={openSet} toggle={toggle} selected={selected} onSelect={onSelect} />
              ))}
            </ul>
          )}
        </>
      ) : (
        <div className={`att-file-row${selected === node.p ? ' active' : ''}`} style={{ paddingLeft: 8 + depth * 14 }}>
          <button type="button" className="att-file" onClick={() => onSelect(node)} title={node.n}>
            <span className="att-file-name">{node.n}</span>
          </button>
          <span className="att-file-size">{fmtSize(node.s ?? 0)}</span>
        </div>
      )}
    </li>
  );
}

/**
 * 课程附件页 —— 所有课程共用的「附件」导航页。
 * 左侧为 data/<学期>/<课程>/ 下课件·试题·附件三类资料的目录树，右侧为选中文件的实时预览，
 * 附一键下载（<a download> 同源直接下载）。清单由 npm run catalog 生成至 public/attachments/。
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
  const [openSet, setOpenSet] = useState<Set<string>>(() => new Set());
  const [selected, setSelected] = useState<AttNode | null>(null);
  const [textBody, setTextBody] = useState<string | null>(null);
  const [textError, setTextError] = useState(false);

  useEffect(() => {
    toc.report([], () => {});
    return () => toc.report([], () => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** 附件文件 URL：dev 下 Vite 直接服务项目根的 data/；download 属性同源生效 */
  const fileUrl = (node: AttNode) =>
    `${import.meta.env.BASE_URL}data/${course!.semester}/${course!.name}/${node.p.split('/').map(encodeURIComponent).join('/')}`;

  // 拉取课程清单；初始展开第一层目录
  useEffect(() => {
    if (!key) return;
    let alive = true;
    setLoading(true);
    setMissing(false);
    setManifest(null);
    setSelected(null);
    fetch(`${import.meta.env.BASE_URL}attachments/${key}.json`)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json() as Promise<AttManifest>;
      })
      .then((m) => {
        if (!alive) return;
        setManifest(m);
        // 默认展开拍平后的前两层目录
        const open = new Set<string>();
        for (const cat of flattenCats(m)) {
          for (const t of cat.tree) {
            if (t.c) {
              open.add(t.p);
              for (const ch of t.c) if (ch.c) open.add(ch.p);
            }
          }
        }
        setOpenSet(open);
      })
      .catch(() => alive && setMissing(true))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [key]);

  // 选中文件为文本类时实时拉取内容
  useEffect(() => {
    if (!selected || previewKind(selected.n) !== 'text') {
      setTextBody(null);
      return;
    }
    let alive = true;
    setTextBody(null);
    setTextError(false);
    fetch(fileUrl(selected))
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.text();
      })
      .then((t) => alive && setTextBody(t))
      .catch(() => alive && setTextError(true));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const toggle = (p: string) =>
    setOpenSet((s) => {
      const n = new Set(s);
      if (n.has(p)) n.delete(p);
      else n.add(p);
      return n;
    });

  const kind = selected ? previewKind(selected.n) : null;
  const url = selected ? fileUrl(selected) : '';

  return (
    <div className="page att-page">
      <h1>附件</h1>
      <div className="lede">
        <p>
          {course?.name} 课程资料：课件 · 试题 · 附件共 {manifest ? countFiles(manifest.cats.reduce<AttNode[]>((a, c) => a.concat(c.tree), [])) : '—'} 份文件。
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
        <div className="att-layout">
          <nav className="att-tree" aria-label="附件目录树">
            {flattenCats(manifest).map((cat) =>
              cat.tree.length > 0 ? (
                <section key={cat.name} className="att-cat">
                  <p className="att-cat-h">
                    {cat.name}
                    <span className="att-cat-count">{countFiles(cat.tree)}</span>
                  </p>
                  <ul className="att-root">
                    {cat.tree.map((node) => (
                      <TreeNode key={node.p} node={node} depth={0} openSet={openSet} toggle={toggle} selected={selected?.p ?? null} onSelect={setSelected} />
                    ))}
                  </ul>
                </section>
              ) : null,
            )}
          </nav>

          <div className="att-viewer">
            {selected ? (
              <>
                <div className="att-viewer-head">
                  <div className="att-viewer-meta">
                    <p className="att-viewer-name">{selected.n}</p>
                    <p className="att-viewer-path">
                      {selected.p} · {fmtSize(selected.s ?? 0)}
                    </p>
                  </div>
                  <a className="btn primary att-dl" href={url} download={selected.n}>
                    下载
                  </a>
                </div>
                <div className="att-preview">
                  {kind === 'pdf' && <iframe className="att-frame" src={url} title={selected.n} />}
                  {kind === 'image' && <img className="att-img" src={url} alt={selected.n} loading="lazy" />}
                  {kind === 'text' &&
                    (textError ? (
                      <div className="att-unsupported">
                        <p>文件未能加载——资料文件仅存于本机 data/ 目录，未随站点部署。</p>
                        <a className="btn" href={url} download={selected.n}>
                          尝试下载
                        </a>
                      </div>
                    ) : textBody === null ? (
                      <div className="att-state">加载中…</div>
                    ) : (
                      <pre className="att-text">{textBody}</pre>
                    ))}
                  {kind === 'none' && (
                    <div className="att-unsupported">
                      <p>该格式不支持在线预览，下载后用本地软件打开。</p>
                      <a className="btn primary" href={url} download={selected.n}>
                        下载 {selected.n.slice(selected.n.lastIndexOf('.') + 1).toUpperCase()} 文件
                      </a>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="att-empty">
                <p>在左侧选择文件预览</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}