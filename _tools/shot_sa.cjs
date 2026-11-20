/* 软件体系结构课程视觉核查：桌面 + 表格/代码/公式细节 + 暗色 + 移动，存 _audit/sa_shots/ */
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = 'http://localhost:5199/HFUT-CS-Online';
const OUT = path.join(__dirname, '..', '_audit', 'sa_shots');

const TARGETS = [
  ['sa-home', '/sa'],
  ['sa-ch4', '/sa/deck/ch4'],
  ['sa-ch5', '/sa/deck/ch5'],
  ['sa-ch7', '/sa/deck/ch7'],
  ['sa-rsa', '/sa/deck/rsa'],
  ['sa-practice', '/sa/practice'],
  ['sa-ch5-dark', '/sa/deck/ch5', true],
  ['sa-hub', '/'],
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
      await new Promise((r) => setTimeout(r, 500));
      if (dark) {
        await page.evaluate(() => {
          document.documentElement.dataset.theme = 'dark';
        });
        await new Promise((r) => setTimeout(r, 300));
      }
      await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: true });
      console.log('ok', name);
    } catch (e) {
      console.log('FAIL', name, String(e).slice(0, 160));
    }
  }

  // 细节：ch4 的 ADL 表 + ACME 代码块
  const detail = async (name, route, sel) => {
    await page.goto(`${BASE}/#${route}`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 500));
    const ok = await page.evaluate((s) => {
      const el = document.querySelector(s);
      if (!el) return false;
      const r = el.getBoundingClientRect();
      window.scrollTo({ top: Math.max(0, window.scrollY + r.top - 130), behavior: 'instant' });
      return true;
    }, sel);
    if (!ok) {
      console.log('NO-SEL', name, sel);
      return;
    }
    await new Promise((r) => setTimeout(r, 250));
    await page.screenshot({ path: path.join(OUT, `${name}.png`) });
    console.log('ok', name);
  };
  // section id 挂在 h2 上，表格在其父级 section 的 div 块里 → 用 :has() 定位所在 section
  await detail('d-sa-ch4-adl-table', '/sa/deck/ch4', 'section:has(> h2#sec-sa4-adl) table.tbl');
  await detail('d-sa-ch4-acme-code', '/sa/deck/ch4', 'pre.code');
  await detail('d-sa-ch5-mvc', '/sa/deck/ch5', '.fig svg');
  await detail('d-sa-ch7-atam-table', '/sa/deck/ch7', 'section:has(> h2#sec-sa7-atam) table.tbl');
  await detail('d-sa-ch7-quiz', '/sa/deck/ch7', '.quiz');

  // 移动端（新页面也要挂错误监听，否则白屏无声）
  const mp = await browser.newPage();
  mp.on('pageerror', (e) => console.log('[m-pageerror]', String(e).slice(0, 200)));
  mp.on('console', (m) => {
    if (m.type() === 'error') console.log('[m-console]', m.text().slice(0, 200));
  });
  await mp.setViewport({ width: 500, height: 900, deviceScaleFactor: 1, isMobile: true });
  await mp.goto(`${BASE}/#/sa`, { waitUntil: 'networkidle2', timeout: 30000 });
  await mp.waitForSelector('.shell, .site-nav', { timeout: 15000 }).catch(() => {});
  await new Promise((r) => setTimeout(r, 800));
  const mText = await mp.evaluate(() => document.body.innerText.length);
  await mp.screenshot({ path: path.join(OUT, 'sa-m-home.png') });
  console.log('ok sa-m-home, textLen=', mText);

  await browser.close();
})();
