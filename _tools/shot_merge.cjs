const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--window-size=1440,1000'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });
  await page.goto('http://localhost:5173/HFUT-CS-Online/#/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 900));
  const el = await page.evaluateHandle(() => {
    const hs = [...document.querySelectorAll('h2, h3')];
    return hs.find((h) => h.textContent.includes('大一上'))?.closest('section');
  });
  await el.screenshot({ path: '_tools/lab_out/merge-home.png' });
  console.log('shot');
  await browser.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
