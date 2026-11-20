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
  // 滚到大二上分组
  await page.evaluate(() => {
    const hs = [...document.querySelectorAll('h2, h3')];
    const el = hs.find((h) => h.textContent.includes('大二上'));
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 100, behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 300));
  const before = await page.evaluate(() => Math.round(window.scrollY));
  // 进入 os 课程页（会滚顶）
  await page.goto('http://localhost:5173/HFUT-CS-Online/#/os', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 800));
  const inCourse = await page.evaluate(() => Math.round(window.scrollY));
  // 点返回箭头回首页
  await page.click('.topbar-ctl.nav-pill[aria-label="返回课程资料库首页"]');
  await new Promise((r) => setTimeout(r, 600));
  const after = await page.evaluate(() => Math.round(window.scrollY));
  console.log(JSON.stringify({ before, inCourse, after }));
  await page.screenshot({ path: '_tools/lab_out/home-restore.png' });
  await browser.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
