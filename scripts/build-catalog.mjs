/* 扫描 课件与期末题整理/ 生成 src/content/catalog.ts —— 课程目录数据（课程页与首页共用）。
 * 目录结构契约见 课件与期末题整理/整理说明.md：<学期>/<课程>/{课件,试题,附件}/**。
 * 只读目录名与文件计数，不读取文件内容。生成物随提交入库，运行时零 IO。 */
import { readdirSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = dirname(fileURLToPath(import.meta.url));
const MATERIALS = join(ROOT, '..', '课件与期末题整理');
const OUT = join(ROOT, '..', 'src', 'content', 'catalog.ts');

const SEMESTER_ORDER = ['大一上', '大一下', '大二上', '大二下', '大三上', '大三下', '大四上', '大四下', '公共课与杂项'];

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
const semesters = SEMESTER_ORDER.filter((s) => found.includes(s));
const extra = found.filter((s) => !SEMESTER_ORDER.includes(s)).sort();
semesters.push(...extra);

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

const ts = `/* 【自动生成】由 scripts/build-catalog.mjs 扫描 课件与期末题整理/ 生成，请勿手改。
 * 共 ${lines.length} 门课程 / ${totalFiles} 份文件；增删资料后 npm run catalog 刷新。 */

export interface CatalogCourse {
  /** 学期文件夹名：大一上…大四下、公共课与杂项 */
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
