/* 扫描 data/ 生成两份生成物：
 * ① src/content/catalog.ts —— 课程目录数据（课程页与首页共用）；
 * ② public/attachments/<学期>__<课程>.json —— 各课程附件清单（附件页左目录树 / 右预览用）。
 * 目录结构契约见 data/整理说明.md：<学期>/<课程>/{课件,试题,附件}/**。
 * 只读目录名、文件名与文件大小，不读取文件内容。生成物随提交入库，运行时零 IO。 */
import { readdirSync, statSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const ROOT = dirname(fileURLToPath(import.meta.url));
const MATERIALS = join(ROOT, '..', 'data');
const OUT = join(ROOT, '..', 'src', 'content', 'catalog.ts');
const ATTACH_DIR = join(ROOT, '..', 'public', 'attachments');

const SEMESTER_ORDER = ['大一上', '大一下', '大二上', '大二下', '大三上', '大三下', '大四上', '大四下'];

const CATS = ['课件', '试题', '附件'];

/* 递归统计课程目录下所有文件，按"相对路径中第一个类别段"归属（课件/试题/附件）。
 * 课程内部还可能有更深层的同名类别目录（如 复习资料/试题/…），同样计入。 */
function countCourse(dir) {
  const counts = { 课件: 0, 试题: 0, 附件: 0 };
  (function walk(d, segs) {
    for (const name of readdirSync(d)) {
      const p = join(d, name);
      const st = statSync(p);
      if (st.isDirectory()) {
        walk(p, [...segs, name]);
      } else {
        const hit = segs.find((s) => CATS.includes(s));
        counts[hit ?? '附件'] += 1;
      }
    }
  })(dir, []);
  return counts;
}

function pad(name) {
  return JSON.stringify(name);
}

const sortName = (a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN');

/* 列出目录内容：目录在前、文件在后，各组内按中文序。 */
function listSorted(d) {
  return readdirSync(d)
    .map((name) => {
      const p = join(d, name);
      const st = statSync(p);
      return { name, p, st, dir: st.isDirectory() };
    })
    .sort((a, b) => (a.dir !== b.dir ? (a.dir ? -1 : 1) : sortName(a, b)));
}

/* 递归构建课程附件树。节点：目录 { n, p, c }，文件 { n, p, s }（p 为相对课程目录的 POSIX 路径）。
 * 顶层第一段目录名是类别（课件/试题/附件）则独立成组，其余全部归入「附件」。 */
function buildCourseTree(dir) {
  const roots = { 课件: [], 试题: [], 附件: [] };
  const pushChildren = (d, siblings) => {
    for (const e of listSorted(d)) {
      const rel = relative(dir, e.p).replaceAll('\\', '/');
      if (e.dir) {
        const node = { n: e.name, p: rel, c: [] };
        siblings.push(node);
        pushChildren(e.p, node.c);
      } else {
        siblings.push({ n: e.name, p: rel, s: e.st.size });
      }
    }
  };
  for (const e of listSorted(dir)) {
    const bucket = roots[CATS.includes(e.name) ? e.name : '附件'];
    if (e.dir) {
      const node = { n: e.name, p: e.name, c: [] };
      bucket.push(node);
      pushChildren(e.p, node.c);
    } else {
      bucket.push({ n: e.name, p: e.name, s: e.st.size });
    }
  }
  return roots;
}

if (!existsSync(MATERIALS)) {
  console.warn(`[build-catalog] 未找到资料目录 ${MATERIALS}，跳过（保留现有 catalog.ts）`);
  process.exit(0);
}

const found = readdirSync(MATERIALS).filter((d) => statSync(join(MATERIALS, d)).isDirectory());
// 只扫 9 个学期组；data/ 下的四个上游仓库子模块不属于学期目录，跳过
const semesters = SEMESTER_ORDER.filter((s) => found.includes(s));
const skipped = found.filter((s) => !SEMESTER_ORDER.includes(s)).sort();
if (skipped.length) console.log(`[build-catalog] 跳过非学期目录（子模块等）: ${skipped.join(', ')}`);

// CI 上 data/ 目录存在但只有入库的说明文件（课件本体被 gitignore）——此时不能生成空目录，保留已提交的 catalog.ts
if (semesters.length === 0) {
  if (existsSync(OUT)) {
    console.warn('[build-catalog] data/ 下无学期目录（CI 环境），跳过（保留现有 catalog.ts）');
    process.exit(0);
  }
  console.error('[build-catalog] data/ 下无学期目录且无现有 catalog.ts，中止');
  process.exit(1);
}

const lines = [];
let totalFiles = 0;
const manifests = [];
for (const sem of semesters) {
  const courses = readdirSync(join(MATERIALS, sem))
    .filter((c) => statSync(join(MATERIALS, sem, c)).isDirectory())
    .sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'));
  for (const course of courses) {
    const base = join(MATERIALS, sem, course);
    const counts = countCourse(base);
    const total = counts.课件 + counts.试题 + counts.附件;
    totalFiles += total;
    const tree = buildCourseTree(base);
    manifests.push({
      semester: sem,
      course,
      cats: ['课件', '试题', '附件'].map((name) => ({ name, tree: tree[name] })),
      total,
    });
    lines.push(
      `  { semester: ${pad(sem)}, name: ${pad(course)}, courseware: ${counts.课件}, exams: ${counts.试题}, misc: ${counts.附件}, total: ${total} },`,
    );
  }
}

const ts = `/* 【自动生成】由 scripts/build-catalog.mjs 扫描 data/ 生成，请勿手改。
 * 共 ${lines.length} 门课程 / ${totalFiles} 份文件；增删资料后 npm run catalog 刷新。 */

export interface CatalogCourse {
  /** 学期文件夹名：大一上…大四下 */
  semester: string;
  /** 课程目录名（与整理文件夹一致） */
  name: string;
  /** 课件 / 试题 / 附件 文件数 */
  courseware: number;
  exams: number;
  misc: number;
  total: number;
}

export const catalog: CatalogCourse[] = [
${lines.join('\n')}
];
`;

writeFileSync(OUT, ts, 'utf8');
console.log(`[build-catalog] ${lines.length} 门课程 / ${totalFiles} 份文件 → ${OUT}`);

// 附件清单：public/attachments/<学期>__<课程>.json（附件页运行时按需 fetch）
mkdirSync(ATTACH_DIR, { recursive: true });
for (const m of manifests) {
  const file = join(ATTACH_DIR, `${m.semester}__${m.course}.json`);
  writeFileSync(file, JSON.stringify(m), 'utf8');
}
console.log(`[build-catalog] 附件清单 ${manifests.length} 份 → ${ATTACH_DIR}`);
