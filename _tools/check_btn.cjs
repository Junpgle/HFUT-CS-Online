const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--window-size=1440,1000', '--disable-gpu'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 2 });
  const B = 'http://localhost:5173/HFUT-CS-Online/#';
  await page.goto(B + '/math/attachments', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 800));
  await page.evaluate(() => {
    const f = Array.from(document.querySelectorAll('.att-file')).find((b) => b.textContent.includes('.pdf'));
    if (f) f.click();
  });
  await new Promise((r) => setTimeout(r, 800));
  const info = await page.evaluate(() => {
    const a = document.querySelector('a.att-dl');
    const r = a.getBoundingClientRect();
    const cs = getComputedStyle(a);
    return { text: a.textContent, w: r.width, h: r.height, color: cs.color, bg: cs.backgroundColor, font: cs.fontSize };
  });
  console.log(JSON.stringify(info));
  const btn = await page.$('a.att-dl');
  await btn.screenshot({ path: '_audit/math_shots/att-btn.png' });
  await browser.close();
})();