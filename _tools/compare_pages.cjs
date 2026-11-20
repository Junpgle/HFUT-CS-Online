/* 对比算法课与其他课程页：左上角按钮可见性、侧栏底部虚化 */
const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--window-size=1440,1000', '--disable-gpu'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });

  const routes = [
    ['algo-deck1', 'http://localhost:5173/HFUT-CS-Online/#/algo/deck/deck1'],
    ['math-home', 'http://localhost:5173/HFUT-CS-Online/#/math'],
    ['os-ch1', 'http://localhost:5173/HFUT-CS-Online/#/os/chapter/ch1'],
  ];

  for (const [name, url] of routes) {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 600));
    const info = await page.evaluate(() => {
      const trigger = document.querySelector('.drawer-trigger');
      const sidebar = document.querySelector('.sidebar');
      const t = trigger ? getComputedStyle(trigger).display : 'no-element';
      const mask = sidebar ? getComputedStyle(sidebar).maskImage || getComputedStyle(sidebar).webkitMaskImage : 'no-sidebar';
      const sbH = sidebar ? sidebar.scrollHeight + '/' + sidebar.clientHeight : '-';
      return { triggerDisplay: t, sidebarMask: mask.slice(0, 90), sidebarScroll: sbH, datasetDeck: document.documentElement.dataset.deck || '(none)' };
    });
    console.log(name, JSON.stringify(info));
  }
  await browser.close();
})();