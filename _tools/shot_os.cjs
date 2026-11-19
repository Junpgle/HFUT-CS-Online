/* OS 课程视觉核查截图：桌面 1440px 全页截图到 _audit/os_shots/ */
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = 'http://localhost:5199/HFUT-CS-Online';
const OUT = path.join(__dirname, '..', '_audit', 'os_shots');

const TARGETS = [
  ['home', '/'],
  ['os-home', '/os'],
  ['os-ch1', '/os/chapter/ch1'],
  ['os-ch2', '/os/chapter/ch2'],
  ['os-ch3', '/os/chapter/ch3'],
  ['os-ch4', '/os/chapter/ch4'],
  ['os-ch5', '/os/chapter/ch5'],
  ['os-ch6', '/os/chapter/ch6'],
  ['os-ch7', '/os/chapter/ch7'],
  ['os-ch8', '/os/chapter/ch8'],
  ['os-practice', '/os/practice'],
  ['os-paper1', '/os/practice/ac-2022a'],
  ['os-paper2', '/os/practice/b-2022'],
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
  page.on('pageerror', (e) => console.log('[pageerror]', String(e).slice(0, 200)));
  page.on('console', (m) => {
    if (m.type() === 'error') console.log('[console]', m.text().slice(0, 200));
  });
  for (const [name, route] of TARGETS) {
    try {
      await page.goto(`${BASE}/#${route}`, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise((r) => setTimeout(r, 900));
      await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: true });
      console.log('ok', name);
    } catch (e) {
      console.log('FAIL', name, String(e).slice(0, 160));
    }
  }
  await browser.close();
})();
