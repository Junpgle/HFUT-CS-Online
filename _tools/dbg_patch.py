import io

p = 'scripts/build-catalog.mjs'
s = io.open(p, encoding='utf-8').read()

old1 = "import { readdirSync, statSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';"
print('block1 count:', s.count(old1))

old2 = "const sortName = (a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN');"
print('block2 count:', s.count(old2))

old3 = """function buildCourseTree(dir) {
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
  };"""
print('block3 count:', s.count(old3))

old4 = "    const tree = buildCourseTree(base);"
print('block4 count:', s.count(old4))
