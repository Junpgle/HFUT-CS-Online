const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--window-size=1440,800', '--force-device-scale-factor=2'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 800, deviceScaleFactor: 2 });
  await page.goto('http://localhost:5173/HFUT-CS-Online/#/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 800));
  await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent.includes('联系作者'))?.click());
  await new Promise((r) => setTimeout(r, 500));
  const modal = await page.$('.hub-modal');
  await modal.screenshot({ path: '_tools/lab_out/contact.png' });
  console.log('shot');
  await browser.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
