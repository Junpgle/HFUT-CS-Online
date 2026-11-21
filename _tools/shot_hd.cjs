/* 「系统硬件综合设计」课程页截图验收：首页卡片 + 总目录 + 4 讲 + 附件页（亮/暗/窄）+ 溢出检查 */
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const OUT = path.join(__dirname, '..', '_audit', 'hd_shots');
const BASE = 'http://localhost:5173/HFUT-CS-Online/#';

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--window-size=1440,900', '--force-device-scale-factor=1'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const waitRender = async (ms = 2200) => {
    await new Promise((r) => setTimeout(r, ms));
  };

  const shot = async (route, name, { dark = false, narrow = false } = {}) => {
    const url = `${BASE}${route}`;
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    if (dark) await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    else await page.evaluate(() => document.documentElement.removeAttribute('data-theme'));
    await waitRender();
    // 溢出检查
    const overflow = await page.evaluate(() => {
      const el = document.scrollingElement;
      return { sw: el.scrollWidth, iw: window.innerWidth, over: el.scrollWidth > window.innerWidth + 1 };
    });
    if (narrow) {
      await page.setViewport({ width: 390, height: 844 });
      await waitRender(1200);
    }
    const file = path.join(OUT, `${name}.png`);
    await page.screenshot({ path: file, fullPage: true });
    const tag = (narrow ? '窄屏' : '') + (dark ? '暗色' : '亮色');
    console.log(`${name} [${tag}] overflow=${overflow.over}(${overflow.sw}/${overflow.iw})`);
    if (narrow) await page.setViewport({ width: 1440, height: 900 });
  };

  // 首页：找到「系统硬件综合设计」卡片单独截
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle2', timeout: 60000 });
  await waitRender(2500);
  const card = await page.evaluateHandle(() => {
    const cards = [...document.querySelectorAll('.course-card')];
    return cards.find((c) => c.textContent.includes('系统硬件综合设计')) || null;
  });
  if (card && card.asElement()) {
    await card.asElement().screenshot({ path: path.join(OUT, 'home-card.png') });
    console.log('home-card OK');
  } else {
    console.log('home-card MISS');
  }

  const routes = [
    ['/hd', 'hd-home'],
    ['/hd/deck/hd1', 'hd1'],
    ['/hd/deck/hd2', 'hd2'],
    ['/hd/deck/hd3', 'hd3'],
    ['/hd/deck/hd4', 'hd4'],
    ['/hd/attachments', 'hd-att'],
  ];
  for (const [route, name] of routes) {
    await shot(route, name, {});
  }
  for (const name of ['hd-home', 'hd1', 'hd4', 'hd-att']) {
    const route = routes.find((r) => r[1] === name)[0];
    await shot(route, `${name}-dark`, { dark: true });
  }
  for (const name of ['hd-home', 'hd1', 'hd4', 'hd-att']) {
    const route = routes.find((r) => r[1] === name)[0];
    await shot(route, `${name}-narrow`, { narrow: true });
  }

  await browser.close();
  console.log('DONE');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
