/* 「移动计算与应用开发」课程页截图验收：首页卡片 + 附件页（亮/暗/窄）+ 溢出检查 */
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const OUT = path.join(__dirname, '..', '_audit', 'mc_shots');
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
    return cards.find((c) => c.textContent.includes('移动计算与应用开发')) || null;
  });
  if (card && card.asElement()) {
    await card.asElement().screenshot({ path: path.join(OUT, 'home-card.png') });
    console.log('home-card OK');
  } else {
    console.log('home-card MISS');
  }

  const shot = async (name, { dark = false, narrow = false } = {}) => {
    await page.goto(`${BASE}/mc/attachments`, { waitUntil: 'networkidle2', timeout: 60000 });
    if (dark) await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    else await page.evaluate(() => document.documentElement.removeAttribute('data-theme'));
    await waitRender();
    const overflow = await page.evaluate(() => {
      const el = document.scrollingElement;
      return { sw: el.scrollWidth, iw: window.innerWidth, over: el.scrollWidth > window.innerWidth + 1 };
    });
    if (narrow) {
      await page.setViewport({ width: 390, height: 844 });
      await waitRender(1200);
    }
    await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: true });
    console.log(`${name} overflow=${overflow.over}(${overflow.sw}/${overflow.iw})`);
    if (narrow) await page.setViewport({ width: 1440, height: 900 });
  };

  await shot('mc-att');
  await shot('mc-att-dark', { dark: true });
  await shot('mc-att-narrow', { narrow: true });
  // 溢出复查：窄屏下的真实 scrollWidth（在窄视口内检查）
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(`${BASE}/mc/attachments`, { waitUntil: 'networkidle2', timeout: 60000 });
  await waitRender(1500);
  const narrowOverflow = await page.evaluate(() => {
    const el = document.scrollingElement;
    return { sw: el.scrollWidth, iw: window.innerWidth };
  });
  console.log(`narrow-in-viewport overflow=${narrowOverflow.sw > narrowOverflow.iw + 1}(${narrowOverflow.sw}/${narrowOverflow.iw})`);
  await page.setViewport({ width: 1440, height: 900 });

  await browser.close();
  console.log('DONE');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
