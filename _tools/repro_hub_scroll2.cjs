const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new', windowSize: { width: 1440, height: 1200 },
    args: ['--window-size=1440,1200', '--proxy-server=http://127.0.0.1:7897'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1200 });
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  await page.goto('http://localhost:5173/HFUT-CS-Online/#/', { waitUntil: 'networkidle2' });
  await sleep(600);
  await page.evaluate(() => window.scrollTo({ top: 3000, behavior: 'instant' }));
  await sleep(500);
  const before = await page.evaluate(() => window.scrollY);
  await page.evaluate(() => document.querySelector('a[href="#/sec"]')?.click());
  await sleep(700);
  await page.goBack();
  await sleep(1000);
  const after = await page.evaluate(() => ({ hash: location.hash, y: window.scrollY }));
  console.log('POP back:', { before, after });

  // 再测：进入课程后滚到章节中部，再点 ← 返回
  await page.evaluate(() => document.querySelector('a[href="#/sec"]')?.click());
  await sleep(700);
  await page.evaluate(() => window.scrollTo({ top: 2000, behavior: 'instant' }));
  await sleep(300);
  await page.evaluate(() => document.querySelector('.nav-pill[aria-label*="返回课程资料库首页"]')?.click());
  await sleep(1000);
  const after2 = await page.evaluate(() => ({ hash: location.hash, y: window.scrollY, saved: sessionStorage.getItem('home-scroll-y') }));
  console.log('PUSH back after course scroll:', { before, after2 });
  await browser.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
