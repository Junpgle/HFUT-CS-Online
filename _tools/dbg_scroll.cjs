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
  await page.evaluate(() => window.scrollTo({ top: 1366, behavior: 'instant' }));
  await page.goto('http://localhost:5173/HFUT-CS-Online/#/os', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 800));
  const ss = await page.evaluate(() => sessionStorage.getItem('home-scroll-y'));
  console.log('sessionStorage on course page:', ss);
  await browser.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
