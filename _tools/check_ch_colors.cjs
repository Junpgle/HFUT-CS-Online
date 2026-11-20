/* 验证每章一色：读取各课程章节页的 data-ch 与 --deck-accent 实际值 */
const puppeteer = require('puppeteer-core');

const BASE = 'http://localhost:5173/HFUT-CS-Online/#';
const routes = [
  ['math-ch8', '/math/chapter/ch8'],
  ['math-ch9', '/math/chapter/ch9'],
  ['math-ch10', '/math/chapter/ch10'],
  ['math-ch11', '/math/chapter/ch11'],
  ['math-ch12', '/math/chapter/ch12'],
  ['math-ch13', '/math/chapter/ch13'],
  ['math-home', '/math'],
  ['os-ch1', '/os/chapter/ch1'],
  ['os-ch4', '/os/chapter/ch4'],
  ['net-ch3', '/net/deck/ch3'],
  ['pat-deck2', '/pat/deck/deck2'],
  ['sa-rsa', '/sa/deck/rsa'],
  ['phys-deck7', '/phys/deck/deck7'],
  ['ca-ch5', '/ca/chapter/ch5'],
  ['os-practice', '/os/practice'],
];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--window-size=1440,1000', '--disable-gpu'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });
  for (const [name, route] of routes) {
    await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 350));
    const info = await page.evaluate(() => ({
      ch: document.documentElement.dataset.ch || '-',
      deck: document.documentElement.dataset.deck || '-',
      accent: getComputedStyle(document.documentElement).getPropertyValue('--deck-accent').trim(),
    }));
    console.log(name.padEnd(12), JSON.stringify(info));
  }
  await browser.close();
})();