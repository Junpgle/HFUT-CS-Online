const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--window-size=1440,1200'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1200 });
  const shot = async (path, name, hoverSel) => {
    await page.goto(`http://localhost:5173/HFUT-CS-Online/#${path}`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 900));
    if (hoverSel) { await page.hover(hoverSel); await new Promise((r) => setTimeout(r, 500)); }
    await page.screenshot({ path: `_tools/lab_out/${name}.png`, fullPage: !hoverSel });
    console.log('shot', name);
  };
  await shot('/ca', 'ca-home');
  await shot('/ca/chapter/ch1', 'ca-ch1');
  await shot('/ca/chapter/ch1', 'ca-dropdown', '.deck-tab-group:nth-of-type(1) > .deck-tab');
  await browser.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
