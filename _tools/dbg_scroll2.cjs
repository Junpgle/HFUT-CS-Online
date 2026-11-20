const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--window-size=1440,900'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/HFUT-CS-Online/#/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 800));
  const s0 = await page.evaluate(() => sessionStorage.getItem('home-scroll-y'));
  await page.evaluate(() => window.scrollTo({ top: 1366, behavior: 'instant' }));
  await new Promise((r) => setTimeout(r, 200));
  const y = await page.evaluate(() => window.scrollY);
  // 用 React Router 的链接点击（首页课程卡）导航，而不是 goto
  await page.click('a[href$="#/os"] , a[href*="/os"]').catch(async () => {
    await page.evaluate(() => { location.hash = '#/os'; });
  });
  await new Promise((r) => setTimeout(r, 900));
  const ss = await page.evaluate(() => sessionStorage.getItem('home-scroll-y'));
  console.log(JSON.stringify({ s0_afterLoad: s0, scrollY: y, savedAfterNav: ss }));
  await browser.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
