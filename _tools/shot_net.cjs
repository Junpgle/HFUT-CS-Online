/* 计网课程视觉核查截图：1440px 桌面全页 + 390px 移动首屏，存 _audit/net_shots/ */
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = 'http://localhost:5199/HFUT-CS-Online';
const OUT = path.join(__dirname, '..', '_audit', 'net_shots');

// [名称, 路由, 是否暗色]
const TARGETS = [
  ['hub', '/'],
  ['net-home', '/net'],
  ['net-ch1', '/net/deck/ch1'],
  ['net-ch2', '/net/deck/ch2'],
  ['net-ch3', '/net/deck/ch3'],
  ['net-ch4', '/net/deck/ch4'],
  ['net-ch5', '/net/deck/ch5'],
  ['net-ch6', '/net/deck/ch6'],
  ['net-ch7', '/net/deck/ch7'],
  ['net-practice', '/net/practice'],
  ['net-paper-2021', '/net/practice/paper-2021'],
  ['net-paper-2022', '/net/practice/paper-2022'],
  ['net-paper-2024', '/net/practice/paper-2024'],
  ['net-ch5-dark', '/net/deck/ch5', true],
  ['net-paper-dark', '/net/practice/paper-2024', true],
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
  for (const [name, route, dark] of TARGETS) {
    try {
      await page.goto(`${BASE}/#${route}`, { waitUntil: 'networkidle2', timeout: 30000 });
      if (dark) {
        await page.evaluate(() => {
          document.documentElement.dataset.theme = 'dark';
          document.documentElement.style.colorScheme = 'dark';
        });
        await new Promise((r) => setTimeout(r, 300));
      }
      // 触发懒渲染内容
      await page.evaluate(async () => {
        await new Promise((r) => setTimeout(r, 400));
      });
      await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: true });
      console.log('ok', name);
    } catch (e) {
      console.log('FAIL', name, String(e).slice(0, 160));
    }
  }

  // 移动视口首屏（puppeteer 窗口需 ≥500，用 viewport 缩放模拟）
  const mp = await browser.newPage();
  await mp.setViewport({ width: 500, height: 900, deviceScaleFactor: 1, isMobile: true });
  for (const [name, route] of [
    ['net-m-home', '/net'],
    ['net-m-paper', '/net/practice/paper-2021'],
  ]) {
    try {
      await mp.goto(`${BASE}/#${route}`, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise((r) => setTimeout(r, 400));
      await mp.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: false });
      console.log('ok', name);
    } catch (e) {
      console.log('FAIL', name, String(e).slice(0, 160));
    }
  }

  await browser.close();
})();
