/* PD 课程 SVG 插图元素级截图（检查文字重叠） */
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = 'http://localhost:5173/HFUT-CS-Online/#';
const OUT = path.join(__dirname, '..', '_audit', 'pd_shots');
const TARGETS = [
  ['fig-ch1-symbols', '/pd/deck/ch1', 0],
  ['fig-ch1-run', '/pd/deck/ch1', 1],
  ['fig-ch3-struct', '/pd/deck/ch3', 0],
  ['fig-ch7-list', '/pd/deck/ch7', 0],
  ['fig-ch7-union', '/pd/deck/ch7', 1],
];
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--window-size=1440,1000', '--disable-gpu'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 2 });
  for (const [name, route, idx] of TARGETS) {
    await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 800));
    const figs = await page.$$('.page .fig');
    if (figs.length > idx) {
      await figs[idx].screenshot({ path: path.join(OUT, `${name}.png`) });
      console.log('ok', name, `(${figs.length} figs)`);
    } else console.log('FAIL', name, `only ${figs.length} figs`);
  }
  await browser.close();
})();
