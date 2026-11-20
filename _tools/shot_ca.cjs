/* CA 课程视觉核查截图：桌面 1440px 全页 + 元素级（svm/公式/表格）截图到 _audit/ca_shots/ */
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = 'http://localhost:5199/HFUT-CS-Online/#';
const OUT = path.join(__dirname, '..', '_audit', 'ca_shots');

const TARGETS = [
  ['home', '/'],
  ['ca-home', '/ca'],
  ['ca-ch2', '/ca/chapter/ch2'],
  ['ca-ch3', '/ca/chapter/ch3'],
  ['ca-ch4', '/ca/chapter/ch4'],
  ['ca-ch5', '/ca/chapter/ch5'],
  ['ca-ch6', '/ca/chapter/ch6'],
  ['ca-ch8', '/ca/chapter/ch8'],
  ['ca-ch10', '/ca/chapter/ch10'],
  ['ca-ch12', '/ca/chapter/ch12'],
  ['ca-ch14', '/ca/chapter/ch14'],
  ['ca-practice', '/ca/practice'],
  ['ca-paper-quiz2', '/ca/practice/quiz2'],
  ['ca-paper-recall', '/ca/practice/recall-2019'],
  ['ca-paper-predict', '/ca/practice/predict'],
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--window-size=1440,1000', '--disable-gpu'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => console.log('[pageerror]', String(e).slice(0, 300)));
  page.on('console', (m) => {
    if (m.type() === 'error') console.log('[console]', m.text().slice(0, 300));
  });
  for (const [name, route] of TARGETS) {
    try {
      await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise((r) => setTimeout(r, 900));
      await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: true });
      console.log('ok', name);
    } catch (e) {
      console.log('FAIL', name, String(e).slice(0, 160));
    }
  }

  // 下拉菜单展开态（悬停「流水线」单元）
  await page.goto(`${BASE}/ca/chapter/ch5`, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 800));
  const group = await page.$$('.deck-tab-group');
  if (group[1]) {
    await group[1].hover();
    await new Promise((r) => setTimeout(r, 500));
    const header = await page.$('.topbar');
    if (header) await header.screenshot({ path: path.join(OUT, 'ca-menu-open.png') });
    console.log('ok menu');
  }

  // 元素级：SVG 图 / 公式 / 表格
  for (const ch of ['ch2', 'ch3', 'ch4', 'ch5', 'ch6', 'ch8', 'ch9', 'ch10', 'ch12', 'ch14']) {
    await page.goto(`${BASE}/ca/chapter/${ch}`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 700));
    const targets = await page.evaluate(() => {
      const els = [];
      for (const fig of document.querySelectorAll('.page .fig')) els.push({ el: fig, kind: 'fig' });
      for (const f of document.querySelectorAll('.page .formula')) els.push({ el: f, kind: 'formula' });
      for (const t of document.querySelectorAll('.page .tbl')) els.push({ el: t, kind: 'tbl' });
      return els.map((x, i) => {
        const r = x.el.getBoundingClientRect();
        return { idx: i, kind: x.kind, x: r.x, y: r.y + window.scrollY, w: r.width };
      });
    });
    for (const t of targets) {
      const el = await page.evaluateHandle((r) => {
        return [...document.querySelectorAll('.page .fig, .page .formula, .page .tbl')].find((e) => {
          const b = e.getBoundingClientRect();
          return Math.abs(b.x - r.x) < 2 && Math.abs(b.y + window.scrollY - r.y) < 2 && Math.abs(b.width - r.w) < 2;
        });
      }, t);
      const e = el.asElement();
      if (!e) continue;
      try {
        await e.screenshot({ path: path.join(OUT, `${ch}-${String(t.idx).padStart(2, '0')}-${t.kind}.png`) });
      } catch (err) {
        console.log('  shot-fail', ch, t.idx, String(err).slice(0, 60));
      }
    }
    console.log(ch, 'elements:', targets.length);
  }

  await browser.close();
})();
