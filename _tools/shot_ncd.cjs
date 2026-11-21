/* NCD（计算机网络课程设计）视觉核查截图：首页卡片 + 附件页（亮/暗/窄屏），输出到 _audit/ncd_shots/ */
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = 'http://localhost:5173/HFUT-CS-Online/#';
const OUT = path.join(__dirname, '..', '_audit', 'ncd_shots');

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

  // 首页：大三上区块（卡片激活态）
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 900));
  await page.screenshot({ path: path.join(OUT, 'home-junior.png'), fullPage: true });
  console.log('ok home-junior');

  // /ncd 索引（应重定向到附件页，标题栏单 tab，无搜索胶囊）
  await page.goto(`${BASE}/ncd`, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 900));
  await page.screenshot({ path: path.join(OUT, 'ncd-att.png'), fullPage: true });
  console.log('ok ncd-att');

  // 展开 bookSys 目录树（点第一个可展开目录）
  const dirBtn = await page.$('.att-row-dir .att-dir-btn');
  if (dirBtn) {
    await dirBtn.click();
    await new Promise((r) => setTimeout(r, 400));
    const btn2 = await page.$$('.att-row-dir .att-dir-btn');
    if (btn2[1]) {
      await btn2[1].click();
      await new Promise((r) => setTimeout(r, 400));
    }
    await page.screenshot({ path: path.join(OUT, 'ncd-att-expanded.png'), fullPage: true });
    console.log('ok ncd-att-expanded');
  }

  // 暗色 + 窄屏
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(`${BASE}/ncd/attachments`, { waitUntil: 'networkidle2', timeout: 30000 });
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT, 'ncd-att-dark.png'), fullPage: false });
  console.log('ok ncd-att-dark');

  await page.setViewport({ width: 420, height: 900 });
  await page.goto(`${BASE}/ncd/attachments`, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT, 'ncd-att-narrow.png'), fullPage: false });
  console.log('ok ncd-att-narrow');

  await browser.close();
})();
