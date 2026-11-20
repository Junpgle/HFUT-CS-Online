const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--window-size=1440,1100'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1100 });
  await page.goto('http://localhost:5173/HFUT-CS-Online/#/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 800));
  // 清掉收藏（保留最近查看），截「最近查看」与网格区（未收藏灰星态）
  await page.evaluate(() => localStorage.removeItem('hb-favorite-courses'));
  await page.evaluate(() => { location.hash = '#/os'; });
  await new Promise((r) => setTimeout(r, 900));
  await page.evaluate(() => { location.hash = '#/'; });
  await new Promise((r) => setTimeout(r, 900));
  const main = await page.$('.hub-main');
  await main.screenshot({ path: '_tools/lab_out/fav-home.png' });
  await browser.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
