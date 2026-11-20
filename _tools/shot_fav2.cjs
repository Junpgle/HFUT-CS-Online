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
  // 精确收藏：按 aria-label 全等匹配
  await page.evaluate(() => {
    [...document.querySelectorAll('.course-fav')]
      .filter((b) => ['收藏 操作系统', '收藏 高等数学'].includes(b.getAttribute('aria-label')))
      .forEach((b) => b.click());
  });
  await new Promise((r) => setTimeout(r, 400));
  // 取消收藏 操作系统（点合并区的星标）
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('.course-fav')]
      .find((x) => x.getAttribute('aria-label') === '取消收藏 操作系统');
    b.click();
  });
  await new Promise((r) => setTimeout(r, 400));
  const state = await page.evaluate(() => ({
    favs: JSON.parse(localStorage.getItem('hb-favorite-courses') ?? '[]'),
    hash: location.hash,
    title: [...document.querySelectorAll('.hub-sem-h h2')].map((h) => h.textContent).slice(0, 2),
  }));
  console.log(JSON.stringify(state));
  // 截图合并区 + 一张网格卡片的未收藏星标
  const sec = await page.evaluateHandle(() => {
    const hs = [...document.querySelectorAll('.hub-sem-h h2')];
    return hs.find((h) => h.textContent.includes('收藏') || h.textContent.includes('最近'))?.closest('section');
  });
  await sec.screenshot({ path: '_tools/lab_out/fav-section2.png' });
  const card = await page.$('.course-card');
  await card.screenshot({ path: '_tools/lab_out/fav-card.png' });
  await browser.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
