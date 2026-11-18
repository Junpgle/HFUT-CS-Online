const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
function findChrome() {
  const candidates = [
    process.env.LOCALAPPDATA + '/Google/Chrome/Application/chrome.exe',
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
  ];
  for (const p of candidates) if (fs.existsSync(p)) return p;
  throw new Error('chrome not found');
}
(async () => {
  const browser = await puppeteer.launch({ executablePath: findChrome(), headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:4173/HFUT-CS-Online/#/', { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo({ top: 1600 }));
  await new Promise((r) => setTimeout(r, 900));
  const out = path.join(__dirname, 'shots', 'hub-backtop.png');
  await page.screenshot({ path: out });
  console.log('saved', out);
  const shown = await page.evaluate(() => {
    const b = document.querySelector('.pq-top');
    return b ? getComputedStyle(b).opacity : 'absent';
  });
  console.log('backtop opacity:', shown);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
