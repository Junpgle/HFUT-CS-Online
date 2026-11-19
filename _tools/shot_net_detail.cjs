/* 计网细节核查：滚动到指定元素截视口图 */
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = 'http://localhost:5199/HFUT-CS-Online';
const OUT = path.join(__dirname, '..', '_audit', 'net_shots');

// [名称, 路由, CSS 选择器, 暗色]
const TARGETS = [
  ['d-ch3-formula', '/net/deck/ch3', '.formula'],
  ['d-ch3-mux-table', '/net/deck/ch3', '.tbl'],
  ['d-ch5-ip-table', '/net/deck/ch5', '.tbl'],
  ['d-ch5-subnet', '/net/deck/ch5', '.callout'],
  ['d-ch7-pre', '/net/deck/ch7', 'pre.code'],
  ['d-ch4-frame', '/net/deck/ch4', '.tbl'],
  ['d-p21-svg', '/net/practice/paper-2021', '.fig'],
  ['d-p24-svg', '/net/practice/paper-2024', '.fig'],
  ['d-practice-list', '/net/practice', '.net-paper-grid'],
  ['d-dark-ch5', '/net/deck/ch5', '.callout', true],
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
  for (const [name, route, sel, dark] of TARGETS) {
    try {
      await page.goto(`${BASE}/#${route}`, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise((r) => setTimeout(r, 500));
      // 简答/名词解释的参考答案默认折叠：全部展开再截
      await page.evaluate(() => {
        document.querySelectorAll('.pq-disclose').forEach((b) => (b instanceof HTMLElement ? b.click() : null));
      });
      await new Promise((r) => setTimeout(r, 600));
      if (dark) {
        await page.evaluate(() => {
          document.documentElement.dataset.theme = 'dark';
        });
        await new Promise((r) => setTimeout(r, 300));
      }
      const ok = await page.evaluate((s) => {
        const el = document.querySelector(s);
        if (!el) return false;
        const r = el.getBoundingClientRect();
        window.scrollTo({ top: Math.max(0, window.scrollY + r.top - 160), behavior: 'instant' });
        return true;
      }, sel);
      if (!ok) {
        console.log('NO-SEL', name, sel);
        continue;
      }
      await new Promise((r) => setTimeout(r, 250));
      await page.screenshot({ path: path.join(OUT, `${name}.png`) });
      console.log('ok', name);
    } catch (e) {
      console.log('FAIL', name, String(e).slice(0, 160));
    }
  }
  await browser.close();
})();
