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

  const shot = async (path, name, actions) => {
    await page.goto(`http://localhost:5173/HFUT-CS-Online/#${path}`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 800));
    if (actions) await actions();
    await page.screenshot({ path: `_tools/lab_out/${name}.png`, fullPage: true });
    console.log('shot', name);
  };

  await shot('/os/attachments', 'att-os');
  await shot('/math/attachments', 'att-math');
  // os: 展开附件里的课设（混合来源）看子层
  await shot('/os/attachments', 'att-os-expanded', async () => {
    const btns = await page.$$('.att-dir-btn');
    // 找到「课设」目录行展开
    for (const b of btns) {
      const t = await b.evaluate((el) => el.textContent);
      if (t.includes('课设')) { await b.click(); break; }
    }
    await new Promise((r) => setTimeout(r, 400));
    const btns2 = await page.$$('.att-dir-btn');
    for (const b of btns2) {
      const t = await b.evaluate((el) => el.textContent);
      if (t.includes('OS_keshe') || t.includes('银行')) { await b.click(); break; }
    }
    await new Promise((r) => setTimeout(r, 400));
  });
  await browser.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
