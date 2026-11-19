// 巡检各讲 toc：二级（level 3）条目的编号风格统计
const fs = require('fs');
for (let d = 1; d <= 8; d++) {
  const src = fs.readFileSync('src/content/deck' + d + '.ts', 'utf8');
  const m = src.match(/toc:\s*\[([\s\S]*?)\n\s*\],\n\s*sections:/);
  if (!m) { console.log('deck' + d + ': toc parse fail'); continue; }
  const rows = [];
  for (const line of m[1].split('\n')) {
    const lm = line.match(/\{ id: '([^']+)', text: "([^"]*)", level: (\d) \}/);
    if (lm) rows.push({ id: lm[1], text: lm[2], level: +lm[3] });
  }
  const l3 = rows.filter(r => r.level === 3);
  const cat = (t) => (/^\d+\.\d+ /.test(t) ? 'N.M' : /^\d+\. /.test(t) ? 'N.' : /^[一二三四五六七八九十]+、/.test(t) ? 'CJK' : '无序号');
  const stat = {};
  l3.forEach(r => { const c = cat(r.text); stat[c] = (stat[c] || 0) + 1; });
  console.log('deck' + d, '一级:' + rows.filter(r => r.level === 2).length, '二级:' + l3.length, JSON.stringify(stat));
  const un = l3.filter(r => cat(r.text) === '无序号').map(r => r.text);
  if (un.length) console.log('   无序号:', JSON.stringify(un));
  const nd = l3.filter(r => cat(r.text) === 'N.').map(r => r.text);
  if (nd.length) console.log('   N.式:', JSON.stringify(nd));
}
