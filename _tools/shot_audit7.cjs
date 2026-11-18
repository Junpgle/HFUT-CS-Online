// 第七轮 UI 审计截图：桌面 1440 + 移动 390，亮暗主题，覆盖所有路由
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

function findChrome() {
  const candidates = [
    process.env.LOCALAPPDATA + '/Google/Chrome/Application/chrome.exe',
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
  ];
  for (const p of candidates) if (fs.existsSync(p)) return p;
  throw new Error('chrome not found');
}

const BASE = 'http://localhost:5173/HFUT-CS-Online/';
const routes = [
  ['home', '/'],
  ['hub', '/#/algo'],
  ['deck3', '/#/algo/deck/deck3'],
  ['deck5', '/#/algo/deck/deck5'],
  ['practice', '/#/algo/practice'],
  ['course', '/#/course/os'],
];

(async () => {
  const outDir = path.join(__dirname, 'shots', 'audit7');
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: 'new',
    args: ['--no-first-run', '--disable-extensions', '--window-size=1500,1000'],
  });
  try {
    for (const [name, route] of routes) {
      for (const theme of ['light', 'dark']) {
        const page = await browser.newPage();
        await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
        await page.goto(BASE + route, { waitUntil: 'networkidle0' });
        await page.evaluate((t) => {
          localStorage.setItem('hb-theme', t);
        }, theme);
        await page.reload({ waitUntil: 'networkidle0' });
        await new Promise((r) => setTimeout(r, 900));
        await page.screenshot({ path: path.join(outDir, `${name}-${theme}-top.png`) });
        // 滚到中部看正文/侧栏
        await page.evaluate(() => window.scrollTo({ top: 1200, behavior: 'instant' }));
        await new Promise((r) => setTimeout(r, 500));
        await page.screenshot({ path: path.join(outDir, `${name}-${theme}-mid.png`) });
        await page.close();
      }
      // 移动端 390 亮色
      const mob = await browser.newPage();
      await mob.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
      await mob.goto(BASE + route, { waitUntil: 'networkidle0' });
      await mob.evaluate(() => localStorage.setItem('hb-theme', 'light'));
      await mob.reload({ waitUntil: 'networkidle0' });
      await new Promise((r) => setTimeout(r, 900));
      await mob.screenshot({ path: path.join(outDir, `${name}-mob-top.png`) });
      await mob.evaluate(() => window.scrollTo({ top: 1200, behavior: 'instant' }));
      await new Promise((r) => setTimeout(r, 500));
      await mob.screenshot({ path: path.join(outDir, `${name}-mob-mid.png`) });
      await mob.close();
    }
    console.log('done');
  } finally {
    await browser.close();
  }
})();
