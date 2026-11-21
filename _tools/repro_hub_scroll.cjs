const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    windowSize: { width: 1440, height: 1200 },
    args: ['--window-size=1440,1200', '--proxy-server=http://127.0.0.1:7897'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1200 });
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  for (let i = 0; i < 3; i++) {
    await page.goto('http://localhost:5173/HFUT-CS-Online/#/', { waitUntil: 'networkidle2' });
    await sleep(800);
    // 滚到 大三下 区块
    await page.evaluate(() => {
      const h = [...document.querySelectorAll('h2, h3, .sem-title, section h2')].find((e) => e.textContent.includes('大三下'));
      if (h) h.scrollIntoView({ block: 'start' });
      else window.scrollTo({ top: 3200, behavior: 'instant' });
    });
    await sleep(400);
    const before = await page.evaluate(() => window.scrollY);
    // 进课程（点第一张已就绪卡片）
    await page.evaluate(() => {
      const cards = [...document.querySelectorAll('.hub-catalog a[href*="/aie"]')];
      const a = cards[0] || document.querySelector('a[href="#/aie"]');
      if (a) a.click();
    });
    await sleep(700);
    const inCourse = await page.evaluate(() => ({ hash: location.hash, y: window.scrollY }));
    // 点 ←（返回首页胶囊）
    await page.evaluate(() => {
      const back = document.querySelector('.nav-pill[aria-label*="返回课程资料库首页"]');
      if (back) back.click();
    });
    await sleep(900);
    const after = await page.evaluate(() => ({ hash: location.hash, y: window.scrollY, saved: sessionStorage.getItem('home-scroll-y') }));
    console.log(`round ${i + 1}: before=${before} courseHash=${inCourse.hash} courseY=${inCourse.y} after=${JSON.stringify(after)}`);
  }
  await browser.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
