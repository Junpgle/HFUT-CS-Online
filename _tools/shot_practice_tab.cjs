const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--window-size=1440,760', '--force-device-scale-factor=2'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 760, deviceScaleFactor: 2 });
  // 在线练习页（激活态应有主题色）+ 第4讲页（对照：在线练习应与其他未激活 tab 同灰）
  for (const [path, name] of [['/algo/practice', 'ptab-algo'], ['/os/practice', 'ptab-os'], ['/math/practice', 'ptab-math']]) {
    await page.goto(`http://localhost:5173/HFUT-CS-Online/#${path}`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 800));
    const tabs = await page.$('.deck-tabs');
    await tabs.screenshot({ path: `_tools/lab_out/${name}.png` });
    console.log('shot', name);
  }
  await browser.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
