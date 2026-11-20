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
    ['/#/os', 'nav-os'],
    ['/#/os/practice', 'nav-os-practice'],
    ['/#/os/attachments', 'nav-os-att'],
    ['/#/algo/practice', 'nav-algo-practice'],
    ['/#/ca/chapter/ch13', 'nav-ca13'],
    ['/#/math/practice', 'nav-math-practice'],
    ['/#/ai', 'nav-ai'],
  ];
  for (const [p, name] of shots) {
    // 直接整页加载（新文档），避免同文档 hash 导航的竞态
    await page.goto(`http://localhost:5173/HFUT-CS-Online${p}`, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));
    const header = await page.$('header.topbar');
    if (header) await header.screenshot({ path: `_tools/lab_out/${name}.png` });
    else console.log('NO .topbar for', name, await page.title());
    console.log('shot', name, await page.evaluate(() => location.hash));
  }
  await page.evaluate(() => localStorage.setItem('theme', 'dark'));
  for (const [p, name] of [['/#/os', 'nav-os-dark'], ['/#/ca/chapter/ch13', 'nav-ca13-dark'], ['/#/os/practice', 'nav-os-practice-dark']]) {
    await page.goto(`http://localhost:5173/HFUT-CS-Online${p}`, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));
    const header = await page.$('header.topbar');
    if (header) await header.screenshot({ path: `_tools/lab_out/${name}.png` });
    console.log('shot', name);
  }
  await browser.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
