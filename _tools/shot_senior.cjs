const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    windowSize: { width: 1440, height: 1200 },
    args: ['--window-size=1440,1200', '--proxy-server=http://127.0.0.1:7897'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1200 });

  const shot = async (path, name, dark) => {
    await page.goto(`http://localhost:5173/HFUT-CS-Online/#${path}`, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.evaluate((d) => {
      if (d) document.documentElement.dataset.theme = 'dark';
      else delete document.documentElement.dataset.theme;
    }, dark);
    await new Promise((r) => setTimeout(r, 900));
    await page.screenshot({ path: `_tools/lab_out/${name}.png`, fullPage: true });
    console.log('shot', name);
  };

  await shot('/', 'home-light', false);
  await shot('/dp/attachments', 'att-dp', false);
  await shot('/swt/attachments', 'att-swt', false);
  await shot('/dsd/attachments', 'att-dsd', false);
  await shot('/ip/attachments', 'att-ip', false);
  await shot('/dp/attachments', 'att-dp-dark', true);
  await shot('/ip/attachments', 'att-ip-dark', true);
  await browser.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
