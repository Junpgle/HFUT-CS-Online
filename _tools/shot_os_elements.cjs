/* 元素级截图：每章的 svg.fig / .formula / .tbl / .callout，检查文字重叠与公式显示 */
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = 'http://localhost:5199/HFUT-CS-Online/#';
const OUT = path.join(__dirname, '..', '_audit', 'os_shots');

const CHAPTERS = ['ch1', 'ch2', 'ch3', 'ch4', 'ch5', 'ch6', 'ch7', 'ch8'];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--window-size=1440,1000', '--disable-gpu'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 2 });
  page.on('pageerror', (e) => console.log('[pageerror]', String(e).slice(0, 200)));

  for (const ch of CHAPTERS) {
    await page.goto(`${BASE}/os/chapter/${ch}`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 700));
    const targets = await page.evaluate(() => {
      const els = [];
      for (const fig of document.querySelectorAll('.page .fig')) els.push({ sel: 'fig', el: fig });
      for (const f of document.querySelectorAll('.page .formula')) els.push({ sel: 'formula', el: f });
      for (const t of document.querySelectorAll('.page .tbl')) els.push({ sel: 'tbl', el: t });
      return els.map((x, i) => ({
        idx: i,
        kind: x.sel,
        rect: (() => { const r = x.el.getBoundingClientRect(); const y = window.scrollY; return { x: r.x, y: r.y + y, w: r.width, h: r.height }; })(),
        text: (x.el.textContent ?? '').slice(0, 40),
      }));
    });
    console.log(ch, 'targets:', targets.length);
    for (const t of targets) {
      const el = await page.evaluateHandle((r) => {
        const els = [...document.querySelectorAll('.page .fig, .page .formula, .page .tbl')];
        return els.find((e) => { const b = e.getBoundingClientRect(); return Math.abs(b.x - r.x) < 2 && Math.abs(b.y + window.scrollY - r.y) < 2 && Math.abs(b.width - r.w) < 2; });
      }, t.rect);
      const e = el.asElement();
      if (!e) { console.log('  miss', t.idx, t.kind); continue; }
      try {
        await e.screenshot({ path: path.join(OUT, `${ch}-${String(t.idx).padStart(2, '0')}-${t.kind}.png`) });
      } catch (err) { console.log('  shot-fail', t.idx, String(err).slice(0, 80)); }
    }
  }
  await browser.close();
})();
