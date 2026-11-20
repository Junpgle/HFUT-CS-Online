const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--window-size=1440,760', '--force-device-scale-factor=2'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 760, deviceScaleFactor: 2 });
  // 只截顶栏：算法第4讲（用户场景）+ os 试卷页（此前有副标题的非常规页）+ ai 首页
  for (const [path, name] of [['/algo/deck/deck4', 'sub-algo'], ['/os/practice/ac-2022a', 'sub-os'], ['/ai', 'sub-ai']]) {
    await page.goto(`http://localhost:5173/HFUT-CS-Online/#${path}`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 800));
    const bar = await page.$('.topbar-left') ?? await page.$('header');
    await (bar ?? await page.$('body')).screenshot({ path: `_tools/lab_out/${name}.png` });
    console.log('shot', name);
  }
  await browser.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
