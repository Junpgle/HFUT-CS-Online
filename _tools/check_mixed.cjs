const fs = require('fs');
const path = require('path');
const PUB = path.join(__dirname, '..', 'public', 'attachments');

// 检查每个文件夹内文件的来源仓库是否一致
const check = (nodes, out) => {
  for (const n of nodes) {
    if (!n.c) continue;
    const repos = new Set();
    const collect = (x) => {
      if (x.c) x.c.forEach(collect);
      else repos.add(x.r || '(无)');
    };
    collect(n);
    if (repos.size > 1) out.push(`${n.p} → ${[...repos].join(',')}`);
    check(n.c, out);
  }
};

for (const f of fs.readdirSync(PUB)) {
  const m = JSON.parse(fs.readFileSync(path.join(PUB, f), 'utf8'));
  const out = [];
  check(m.cats.flatMap((c) => c.tree), out);
  if (out.length) {
    console.log('===', f.replace('.json', ''), '混合来源文件夹:', out.length);
    out.slice(0, 4).forEach((x) => console.log('  ', x));
  }
}
console.log('检查完成');
