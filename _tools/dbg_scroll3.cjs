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
  await page.evaluate(() => window.scrollTo({ top: 1366, behavior: 'instant' }));
  await new Promise((r) => setTimeout(r, 200));
  // 程序化点击 os 卡片（无聚焦滚动）→ 课程页
  await page.evaluate(() => {
    [...document.querySelectorAll('a.course-card')].find((a) => a.getAttribute('href')?.endsWith('#/os')).click();
  });
  await new Promise((r) => setTimeout(r, 900));
  const courseTop = await page.evaluate(() => window.scrollY);
  // 程序化点击返回箭头 → 首页
  await page.evaluate(() => {
    document.querySelector('.topbar-ctl.nav-pill[aria-label="返回课程资料库首页"]').click();
  });
  await new Promise((r) => setTimeout(r, 700));
  const homeY = await page.evaluate(() => window.scrollY);
  const saved = await page.evaluate(() => sessionStorage.getItem('home-scroll-y'));
  console.log(JSON.stringify({ courseTop, homeY, saved }));
  await browser.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
