/* PD（程序设计基础）课程视觉核查截图：桌面 1440px 全页 + 窄屏 + 暗色，输出到 _audit/pd_shots/ */
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = 'http://localhost:5173/HFUT-CS-Online/#';
const OUT = path.join(__dirname, '..', '_audit', 'pd_shots');

const TARGETS = [
  ['home', '/'],
  ['pd-home', '/pd'],
  ['pd-ch1', '/pd/deck/ch1'],
  ['pd-ch2', '/pd/deck/ch2'],
  ['pd-ch3', '/pd/deck/ch3'],
  ['pd-ch4', '/pd/deck/ch4'],
  ['pd-ch5', '/pd/deck/ch5'],
  ['pd-ch6', '/pd/deck/ch6'],
  ['pd-ch7', '/pd/deck/ch7'],
  ['pd-ch8', '/pd/deck/ch8'],
  ['pd-ch9', '/pd/deck/ch9'],
  ['pd-ch11', '/pd/deck/ch11'],
  ['pd-ch12', '/pd/deck/ch12'],
  ['pd-att', '/pd/attachments'],
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
  // 窄屏 + 暗色抽查
  await page.setViewport({ width: 420, height: 900, deviceScaleFactor: 1 });
  await page.goto(`${BASE}/pd/deck/ch3`, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 700));
  await page.screenshot({ path: path.join(OUT, 'pd-ch3-narrow.png'), fullPage: false });
  console.log('ok pd-ch3-narrow');
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
  await page.goto(`${BASE}/pd/deck/ch5`, { waitUntil: 'networkidle2', timeout: 30000 });
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT, 'pd-ch5-dark.png'), fullPage: false });
  await page.goto(`${BASE}/pd`, { waitUntil: 'networkidle2', timeout: 30000 });
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT, 'pd-home-dark.png'), fullPage: false });
  console.log('ok dark shots');
  await browser.close();
})();
