import io

p = 'scripts/build-catalog.mjs'
s = io.open(p, encoding='utf-8').read()

old = """  const pushChildren = (d, siblings) => {
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
new = """  // 单一来源文件夹：全体后代文件同仓库 → 记录 r/sp（sp 取仓库内目录路径），
  // 附件页据此生成 GitHub 目录跳转链接；混合来源文件夹无法指向单一仓库，不给跳转
  const stampFolder = (node) => {
    const repos = new Set();
    const collect = (x) => {
      if (x.c) x.c.forEach(collect);
      else repos.add(x.r ?? null);
    };
    node.c.forEach(collect);
    if (repos.size === 1 && !repos.has(null)) {
      const first = node.c.find((x) => !x.c && x.sp);
      if (first) {
        node.r = first.r;
        node.sp = first.sp.slice(0, first.sp.lastIndexOf('/'));
      }
    }
  };
  const pushChildren = (d, siblings) => {
    for (const e of listSorted(d)) {
      const rel = relative(dir, e.p).replaceAll('\\\\', '/');
      if (e.dir) {
        const node = { n: e.name, p: rel, c: [] };
        pushChildren(e.p, node.c);
        stampFolder(node);
        siblings.push(node);
      } else {
        siblings.push(fileNode(e.name, rel, e.st.size));
      }
    }
  };
  for (const e of listSorted(dir)) {
    const bucket = roots[CATS.includes(e.name) ? e.name : '附件'];
    if (e.dir) {
      const node = { n: e.name, p: e.name, c: [] };
      pushChildren(e.p, node.c);
      stampFolder(node);
      bucket.push(node);
    } else {
      bucket.push(fileNode(e.name, e.name, e.st.size));
    }
  }
  return roots;
}"""
assert s.count(old) == 1, 'pattern not found'
s = s.replace(old, new)

io.open(p, 'w', encoding='utf-8', newline='').write(s)
print('patched')
