const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--window-size=1440,1000'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });
  await page.goto('http://localhost:5173/HFUT-CS-Online/#/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 800));
  await page.evaluate(() => localStorage.clear());
  // 收藏 操作系统 + 高等数学 两张卡
  const favCount = await page.evaluate(() => {
    const btns = [...document.querySelectorAll('.course-fav')];
    const names = ['操作系统', '高等数学'];
    let n = 0;
    for (const b of btns) {
      const label = b.getAttribute('aria-label') ?? '';
      if (names.some((nm) => label.includes(nm))) { b.click(); n++; }
    }
    return n;
  });
  await new Promise((r) => setTimeout(r, 600));
  // 记录一次最近查看：进 os 再回首页
  await page.evaluate(() => { location.hash = '#/os'; });
  await new Promise((r) => setTimeout(r, 900));
  await page.evaluate(() => { location.hash = '#/'; });
  await new Promise((r) => setTimeout(r, 900));
  const sec = await page.evaluateHandle(() => {
    const hs = [...document.querySelectorAll('.hub-sem-h h2')];
    return hs.find((h) => h.textContent.includes('收藏'))?.closest('section');
  });
  await sec.screenshot({ path: '_tools/lab_out/fav-section.png' });
  console.log(JSON.stringify({ favCount }));
  await browser.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
