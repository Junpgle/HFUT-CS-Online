/* 高等数学课程视觉核查：桌面/窄屏截图到 _audit/math_shots/，并收集页面错误 */
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = process.env.MATH_BASE_URL || 'http://localhost:5199/HFUT-CS-Online/#';
const OUT = path.join(__dirname, '..', '_audit', 'math_shots');

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--window-size=1440,1000', '--disable-gpu'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', (e) => errors.push('[pageerror] ' + String(e).slice(0, 400)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push('[console] ' + m.text().slice(0, 400));
  });

  const routes = [
    ['home', '/'],
    ['math-home', '/math'],
    ['math-ch8', '/math/chapter/ch8'],
    ['math-ch9', '/math/chapter/ch9'],
    ['math-ch10', '/math/chapter/ch10'],
    ['math-ch11', '/math/chapter/ch11'],
    ['math-ch12', '/math/chapter/ch12'],
    ['math-ch13', '/math/chapter/ch13'],
    ['math-practice', '/math/practice'],
  ];

  for (const [name, route] of routes) {
    try {
      await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise((r) => setTimeout(r, 700));
      await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: true });
      console.log('ok', name);
    } catch (e) {
      console.log('FAIL', name, String(e).slice(0, 200));
    }
  }

  // 抽查一份试卷的答题页与标签跳转目标
  const papers = await page.evaluate(() => Array.from(document.querySelectorAll('.ext-card')).map((a) => a.getAttribute('href')));
  if (papers.length) {
    const href = papers[0] || '';
    const route = href.includes('#') ? href.slice(href.indexOf('#') + 1) : href;
    try {
      await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise((r) => setTimeout(r, 700));
      await page.screenshot({ path: path.join(OUT, 'math-paper.png'), fullPage: true });
      console.log('ok paper', href);
    } catch (e) {
      console.log('FAIL paper', String(e).slice(0, 200));
    }
  }

  await page.setViewport({ width: 900, height: 900, deviceScaleFactor: 1 });
  for (const [name, route] of [['narrow-home', '/math'], ['narrow-chapter', '/math/chapter/ch9'], ['narrow-paper', '/math/practice']]) {
    try {
      await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise((r) => setTimeout(r, 500));
      await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: false });
      console.log('ok', name);
    } catch (e) {
      console.log('FAIL', name, String(e).slice(0, 200));
    }
  }

  fs.writeFileSync(path.join(OUT, 'errors.txt'), errors.join('\n'), 'utf8');
  console.log('errors:', errors.length);
  await browser.close();
})();
