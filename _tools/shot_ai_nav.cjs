const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--window-size=1440,760', '--force-device-scale-factor=2'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 760, deviceScaleFactor: 2 });
  await page.goto('http://localhost:5173/HFUT-CS-Online/#/ai', { waitUntil: 'networkidle2', timeout: 30000 });
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1000));
  const header = await page.$('header.topbar');
  await header.screenshot({ path: '_tools/lab_out/nav-ai2.png' });
  console.log('shot');
  await browser.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
