import io

p = 'scripts/build-catalog.mjs'
s = io.open(p, encoding='utf-8').read()

old = "import { readdirSync, statSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';"
new = "import { readdirSync, statSync, writeFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';"
assert s.count(old) == 1
s = s.replace(old, new)

old = "const sortName = (a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN');"
new = """const sortName = (a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN');

/* 溯源表：data/文件清单.csv 的 目标路径 → { 仓库, 源路径 }（附件页据此生成仓库直链下载）。
 * CSV 五列：来源仓库,源路径,目标路径,类别,处理；路径不含半角逗号（已核），按逗号切分即可。
 * CI 上无此文件时全部节点不带 r/sp，附件页下载按钮降级为不可用态。 */
function loadProvenance() {
  const csvPath = join(MATERIALS, '文件清单.csv');
  if (!existsSync(csvPath)) return new Map();
  const map = new Map();
  for (const line of readFileSync(csvPath, 'utf8').split('\\n').slice(1)) {
    const t = line.trim();
    if (!t) continue;
    const [repo, src, dest] = t.split(',');
    if (repo && src && dest) map.set(dest, { repo, src });
  }
  return map;
}
const PROVENANCE = loadProvenance();"""
assert s.count(old) == 1
s = s.replace(old, new)

old = """function buildCourseTree(dir) {
  const roots = { 课件: [], 试题: [], 附件: [] };
  const pushChildren = (d, siblings) => {
    for (const e of listSorted(d)) {
      const rel = relative(dir, e.p).replaceAll('\\\\', '/');
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
}"""
new = """function buildCourseTree(dir, provKey) {
  const roots = { 课件: [], 试题: [], 附件: [] };
  const fileNode = (name, rel, size) => {
    const node = { n: name, p: rel, s: size };
    const prov = PROVENANCE.get(`${provKey}/${rel}`);
    if (prov) {
      node.r = prov.repo;
      node.sp = prov.src;
    }
    return node;
  };
  const pushChildren = (d, siblings) => {
    for (const e of listSorted(d)) {
      const rel = relative(dir, e.p).replaceAll('\\\\', '/');
      if (e.dir) {
        const node = { n: e.name, p: rel, c: [] };
        siblings.push(node);
        pushChildren(e.p, node.c);
      } else {
        siblings.push(fileNode(e.name, rel, e.st.size));
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
      bucket.push(fileNode(e.name, e.name, e.st.size));
    }
  }
  return roots;
}"""
assert s.count(old) == 1
s = s.replace(old, new)

old = "    const tree = buildCourseTree(base);"
new = "    const tree = buildCourseTree(base, `${sem}/${course}`);"
assert s.count(old) == 1
s = s.replace(old, new)

io.open(p, 'w', encoding='utf-8', newline='').write(s)
print('script patched')
