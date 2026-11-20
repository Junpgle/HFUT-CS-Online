const fs = require('fs');
const path = require('path');
const PUB = path.join(__dirname, '..', 'public', 'attachments');

const walk = (nodes, depth, out) => {
  for (const n of nodes) {
    if (n.c) {
      const cnt = (x) => x.reduce((a, y) => a + (y.c ? cnt(y.c) : 1), 0);
      out.push({ depth, name: n.n, path: n.p, files: cnt(n.c) });
      walk(n.c, depth + 1, out);
    }
  }
};

for (const f of fs.readdirSync(PUB)) {
  const key = f.replace('.json', '');
  if (!['大三上__操作系统', '大二上__大学物理', '大二上__数字逻辑', '大三下__分布式程序设计', '大一上__高等数学', '大三上__计算机网络'].includes(key)) continue;
  const m = JSON.parse(fs.readFileSync(path.join(PUB, f), 'utf8'));
  const out = [];
  walk(m.cats.flatMap((c) => c.tree), 0, out);
  console.log('===', key, '===');
  for (const o of out) if (o.files >= 6) console.log('  '.repeat(o.depth) + `${o.name} [${o.files} 文件] ${o.path}`);
}
