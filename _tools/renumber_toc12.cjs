// 给 deck1 / deck2 的二级（level 3）toc 条目补层级序号，向 deck3~8 的 N.M 风格对齐；
// 自测板块下的子条目沿用其余各讲的「一、二、」中文序号。id 不动，只改 text。
const fs = require('fs');

for (const d of [1, 2]) {
  const path = 'src/content/deck' + d + '.ts';
  const src = fs.readFileSync(path, 'utf8');
  const m = src.match(/toc:\s*\[([\s\S]*?)\n\s*\],\n\s*sections:/);
  if (!m) { console.error('deck' + d + ' toc 解析失败'); process.exit(1); }
  const block = m[1];
  let parentNo = 0;
  let childNo = 0;
  let inSelfTest = false;
  const out = block.split('\n').map((line) => {
    const lm = line.match(/^(\s*\{ id: '[^']+', text: ")([^"]*)(", level: )(\d)( \},)\s*$/);
    if (!lm) return line;
    const [, pre, text, mid, lvl, post] = lm;
    if (+lvl === 2) {
      parentNo += 1;
      childNo = 0;
      inSelfTest = /自测|测验/.test(text);
      return line;
    }
    // level 3：自测板块用「一、二、…」，其余用 N.M
    childNo += 1;
    const cjk = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    const label = inSelfTest ? cjk[childNo - 1] + '、' : parentNo + '.' + childNo + ' ';
    return pre + label + text + mid + lvl + post;
  }).join('\n');
  fs.writeFileSync(path, src.replace(block, out));
  console.log('deck' + d + ' 已重编号');
}
