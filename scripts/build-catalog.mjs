/* 扫描 data/ 生成 src/content/catalog.ts —— 课程目录数据（课程页与首页共用）。
 * 目录结构契约见 data/整理说明.md：<学期>/<课程>/{课件,试题,附件}/**。
 * 只读目录名与文件计数，不读取文件内容。生成物随提交入库，运行时零 IO。 */
import { readdirSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = dirname(fileURLToPath(import.meta.url));
const MATERIALS = join(ROOT, '..', 'data');
const OUT = join(ROOT, '..', 'src', 'content', 'catalog.ts');

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
for (const sem of semesters) {
  const courses = readdirSync(join(MATERIALS, sem))
    .filter((c) => statSync(join(MATERIALS, sem, c)).isDirectory())
    .sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'));
  for (const course of courses) {
    const base = join(MATERIALS, sem, course);
    const counts = countCourse(base);
    const total = counts.课件 + counts.试题 + counts.附件;
    totalFiles += total;
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
