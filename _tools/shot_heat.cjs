const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--window-size=1440,1000'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });
  // 算法课练习页（用户截图场景）
  await page.goto('http://localhost:5173/HFUT-CS-Online/#/algo/practice', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 900));
  await page.screenshot({ path: '_tools/lab_out/heat-algo.png' });
  console.log('shot algo');
  // 窄屏（旧逻辑在窄屏默认收起，现在必须直显）
  await page.setViewport({ width: 900, height: 1000 });
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: '_tools/lab_out/heat-algo-narrow.png' });
  console.log('shot narrow');
  await browser.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
