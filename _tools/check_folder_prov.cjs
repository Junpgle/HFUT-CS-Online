const fs = require('fs');
const path = require('path');
const PUB = path.join(__dirname, '..', 'public', 'attachments');

// 统计带 r/sp 的文件夹节点（单一来源，可给跳转链接）
let folders = 0, stamped = 0, files = 0;
const walk = (nodes) => {
  for (const n of nodes) {
    if (n.c) {
      folders++;
      if (n.r) stamped++;
      walk(n.c);
    } else files++;
  }
};
for (const f of fs.readdirSync(PUB)) {
  const m = JSON.parse(fs.readFileSync(path.join(PUB, f), 'utf8'));
  walk(m.cats.flatMap((c) => c.tree));
}
console.log(`文件夹 ${folders}，其中单一来源可跳转 ${stamped}，文件 ${files}`);

// 抽样展示 os 与 math 的顶层结构
for (const key of ['大三上__操作系统', '大一上__高等数学']) {
  const m = JSON.parse(fs.readFileSync(path.join(PUB, key + '.json'), 'utf8'));
  const show = (nodes, d) => {
    for (const n of nodes.slice(0, 12)) {
      console.log('  '.repeat(d) + (n.c ? `📁 ${n.n}${n.r ? ` [${n.r} ↗]` : ' [混合]'} (${n.c.reduce((a, y) => a + (y.c ? cnt(y.c) : 1), 0)})` : `· ${n.n}`));
      if (n.c && d < 1) show(n.c, d + 1);
    }
  };
  const cnt = (x) => x.reduce((a, y) => a + (y.c ? cnt(y.c) : 1), 0);
  console.log('===', key);
  m.cats.forEach((c) => { console.log(' [' + c.name + ']'); show(c.tree, 1); });
}
