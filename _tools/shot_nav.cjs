const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--window-size=1440,760', '--force-device-scale-factor=2'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 760, deviceScaleFactor: 2 });
  const shots = [
    ['/', 'nav-home'],
    ['/#/os', 'nav-os'],
    ['/#/os/practice', 'nav-os-practice'],
    ['/#/os/attachments', 'nav-os-att'],
    ['/#/algo/practice', 'nav-algo-practice'],
    ['/#/ca/chapter/ch13', 'nav-ca13'],
    ['/#/math/practice', 'nav-math-practice'],
    ['/#/ai', 'nav-ai'],
  ];
  for (const [p, name] of shots) {
    await page.goto(`http://localhost:5173/HFUT-CS-Online/#${p}`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 900));
    const bar = (await page.$('.topbar-left')) ?? (await page.$('.hub-hero'));
    const tabs = await page.$('.deck-tabs');
    // 拼顶栏整行：截 header 全宽
    const header = await page.$('header');
    if (header) await header.screenshot({ path: `_tools/lab_out/${name}.png` });
    else await page.screenshot({ path: `_tools/lab_out/${name}.png` });
    console.log('shot', name, page.url().split('#')[1]);
  }
  // 暗色：os 导航 + ca13
  await page.evaluate(() => { localStorage.setItem('theme', 'dark'); });
  for (const [p, name] of [['/#/os', 'nav-os-dark'], ['/#/ca/chapter/ch13', 'nav-ca13-dark'], ['/#/os/practice', 'nav-os-practice-dark']]) {
    await page.goto(`http://localhost:5173/HFUT-CS-Online/#${p}`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 900));
    const header = await page.$('header');
    if (header) await header.screenshot({ path: `_tools/lab_out/${name}.png` });
    console.log('shot', name);
  }
  await browser.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
