/* 「自然语言理解」课程页截图验收：首页卡片 + 讲次页 + 附件页（亮/暗/窄）+ 溢出检查 */
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const OUT = path.join(__dirname, '..', '_audit', 'nlu_shots');
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

  const waitRender = async (ms = 2400) => {
    await new Promise((r) => setTimeout(r, ms));
  };

  // 首页卡片
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle2', timeout: 60000 });
  await waitRender(2600);
  const card = await page.evaluateHandle(() => {
    const cards = [...document.querySelectorAll('.course-card')];
    return cards.find((c) => c.textContent.includes('自然语言理解')) || null;
  });
  if (card && card.asElement()) {
    await card.asElement().screenshot({ path: path.join(OUT, 'home-card.png') });
    console.log('home-card OK');
  } else {
    console.log('home-card MISS');
  }

  const shot = async (route, name, { dark = false, narrow = false } = {}) => {
    await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle2', timeout: 60000 });
    if (dark) await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    else await page.evaluate(() => document.documentElement.removeAttribute('data-theme'));
    await waitRender();
    const overflow = await page.evaluate(() => {
      const el = document.scrollingElement;
      return { sw: el.scrollWidth, iw: window.innerWidth };
    });
    if (narrow) {
      await page.setViewport({ width: 390, height: 844 });
      await waitRender(1200);
    }
    await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: true });
    console.log(`${name} overflow=${overflow.sw > overflow.iw + 1}(${overflow.sw}/${overflow.iw})`);
    if (narrow) await page.setViewport({ width: 1440, height: 900 });
  };

  await shot('/nlu/deck/nlu1', 'nlu-deck');
  await shot('/nlu/attachments', 'nlu-att');
  await shot('/nlu/deck/nlu1', 'nlu-deck-dark', { dark: true });
  await shot('/nlu/attachments', 'nlu-att-dark', { dark: true });
  await shot('/nlu/deck/nlu1', 'nlu-deck-narrow', { narrow: true });
  await shot('/nlu/attachments', 'nlu-att-narrow', { narrow: true });
  // 窄视口内的真实溢出复查
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(`${BASE}/nlu/deck/nlu1`, { waitUntil: 'networkidle2', timeout: 60000 });
  await waitRender(1500);
  const o1 = await page.evaluate(() => {
    const el = document.scrollingElement;
    return { sw: el.scrollWidth, iw: window.innerWidth };
  });
  console.log(`narrow-in-viewport deck overflow=${o1.sw > o1.iw + 1}(${o1.sw}/${o1.iw})`);
  await page.setViewport({ width: 1440, height: 900 });

  await browser.close();
  console.log('DONE');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
