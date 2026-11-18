/* 首页/占位页/算法课路由的截图与交互验证（puppeteer-core + 本机 Chrome） */
const puppeteer = require('puppeteer-core');

const BASE = 'http://localhost:4173/HFUT-algorithm-design/#';
const OUT = 'C:/Users/icepa/Documents/GitHub/HFUT-algorithm-design/_tools/shots';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox'],
  });

  const shot = async (path, file, { width = 1280, height = 900, dark = false, fullPage = false } = {}) => {
    const page = await browser.newPage();
    await page.setViewport({ width, height, deviceScaleFactor: 2 });
    if (dark) {
      await page.evaluateOnNewDocument(() => localStorage.setItem('hb-theme', 'dark'));
    }
    await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: `${OUT}/${file}.png`, fullPage });
    await page.close();
    console.log('shot', file);
  };

  const clickFlow = async () => {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' });

    // 1. 点击已上线课程（算法设计与分析）→ /algo
    const algoHref = await page.$eval('a.course-card.ready', (a) => a.getAttribute('href'));
    console.log('ready card href:', algoHref);
    await page.click('a.course-card.ready');
    await new Promise((r) => setTimeout(r, 900));
    console.log('after ready click:', await page.evaluate(() => location.hash));
    console.log('topbar visible:', await page.$eval('.topbar-title', (el) => el.textContent.trim()));
    await page.screenshot({ path: `${OUT}/flow-algo-course.png` });

    // 2. 点击一个未上线课程卡 → /course/<name>
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
    const stubHref = await page.$$eval('a.course-card:not(.ready)', (as) => as[0].getAttribute('href'));
    console.log('stub card href:', decodeURIComponent(stubHref));
    await page.click('a.course-card:not(.ready)');
    await new Promise((r) => setTimeout(r, 700));
    console.log('after stub click:', await page.evaluate(() => location.hash));
    console.log('stub h1:', await page.$eval('.hub-stub h1', (el) => el.textContent));
    await page.screenshot({ path: `${OUT}/flow-stub.png` });

    // 3. 旧链接重定向 #/deck/deck1 → #/algo/deck/deck1
    await page.goto(`${BASE}/deck/deck1`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 800));
    console.log('legacy redirect:', await page.evaluate(() => location.hash));
    console.log('deck h1 exists:', !!(await page.$('.page h1')));

    // 4. 旧链接 #/practice
    await page.goto(`${BASE}/practice`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 800));
    console.log('legacy practice redirect:', await page.evaluate(() => location.hash));
    await page.close();
  };

  await shot('/', 'hub-desktop', { fullPage: true });
  await shot('/', 'hub-desktop-fold', {});
  await shot('/', 'hub-dark', { dark: true });
  await shot('/course/%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84', 'stub-数据结构', {});
  await shot('/algo', 'algo-course-home', {});
  await shot('/', 'hub-mobile', { width: 390, height: 844, fullPage: true });
  await clickFlow();

  await browser.close();
  console.log('ALL DONE');
})();
