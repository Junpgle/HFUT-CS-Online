// 顶栏截图：puppeteer-core 直连本地 Chrome
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

function findChrome() {
  const candidates = [
    process.env.LOCALAPPDATA + '/Google/Chrome/Application/chrome.exe',
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    process.env.LOCALAPPDATA + '/Chromium/Application/chrome.exe',
  ];
  for (const p of candidates) if (fs.existsSync(p)) return p;
  throw new Error('chrome not found');
}

(async () => {
  const outDir = path.join(__dirname, 'shots');
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: 'new',
    args: ['--window-size=1600,900'],
  });
  const shots = [
    { url: 'http://localhost:4173/HFUT-CS-Online/#/algo', w: 1600, h: 900, out: 'topbar-desktop.png' },
    { url: 'http://localhost:4173/HFUT-CS-Online/#/algo', w: 390, h: 844, out: 'topbar-mobile.png' },
    { url: 'http://localhost:4173/HFUT-CS-Online/#/course/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F', w: 1280, h: 800, out: 'stub-topbar.png' },
    { url: 'http://localhost:4173/HFUT-CS-Online/#/', w: 1280, h: 800, out: 'hub-topbar.png' },
  ];
  for (const s of shots) {
    const page = await browser.newPage();
    await page.setViewport({ width: s.w, height: s.h });
    await page.goto(s.url, { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(outDir, s.out) });
    console.log('saved', s.out);
    await page.close();
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
