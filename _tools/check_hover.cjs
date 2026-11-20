const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--window-size=1440,1000', '--disable-gpu'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const B = 'http://localhost:5173/HFUT-CS-Online/#';

  // net 练习列表卡：hover 检查下划线与 transform
  await page.goto(B + '/net/practice', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 700));
  const card = await page.$('.net-paper-card');
  await card.hover();
  await new Promise((r) => setTimeout(r, 400));
  const net = await page.evaluate(() => {
    const c = document.querySelector('.net-paper-card');
    const t = c.querySelector('.net-paper-title');
    return {
      cardTextDeco: getComputedStyle(c).textDecorationLine,
      titleTextDeco: getComputedStyle(t).textDecorationLine,
      metaTextDeco: getComputedStyle(c.querySelector('.net-paper-meta')).textDecorationLine,
      transform: getComputedStyle(c).transform,
      shadow: getComputedStyle(c).boxShadow.slice(0, 40),
    };
  });
  console.log('net-paper-card:', JSON.stringify(net));

  // math 试卷 ext-card hover
  await page.goto(B + '/math/practice', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 700));
  const e = await page.$('.ext-card');
  await e.hover();
  await new Promise((r) => setTimeout(r, 300));
  const ext = await page.evaluate(() => {
    const c = document.querySelector('.ext-card');
    return { deco: getComputedStyle(c).textDecorationLine, transform: getComputedStyle(c).transform };
  });
  console.log('ext-card:', JSON.stringify(ext));

  // 截图存档
  await page.goto(B + '/net/practice', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 600));
  const c2 = await page.$('.net-paper-card');
  await c2.hover();
  await new Promise((r) => setTimeout(r, 350));
  await page.screenshot({ path: '_audit/math_shots/hover-net-card.png' });
  await browser.close();
})();