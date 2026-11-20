const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--window-size=1440,900'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/HFUT-CS-Online/#/phys/deck/deck1', { waitUntil: 'networkidle2', timeout: 30000 });
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 900));
  // 1) 徽章列：侧栏 .toc-no 应显示完整序号 1-1..1-5，正文不含序号
  const items = await page.evaluate(() =>
    [...document.querySelectorAll('.sidebar .toc > li > .toc-row a, .sidebar .toc > li > a')].map((a) => ({
      no: a.querySelector('.toc-no')?.textContent ?? null,
      text: a.textContent.replace(/\s+/g, ' ').trim(),
    }))
  );
  console.log(JSON.stringify(items, null, 1));
  // 2) 点击最后一项 → 滚动途中每 80ms 采样 active 项，应始终停在目标上（无沿途弹跳）
  await page.evaluate(() => {
    const links = [...document.querySelectorAll('.sidebar .toc a')];
    links[links.length - 1].click();
  });
  const samples = [];
  for (let i = 0; i < 14; i++) {
    await new Promise((r) => setTimeout(r, 80));
    const a = await page.evaluate(() => document.querySelector('.sidebar .toc a.active')?.textContent.replace(/\s+/g, ' ').trim());
    samples.push(a);
  }
  const unique = [...new Set(samples)];
  console.log('active during scroll:', JSON.stringify(unique), 'scrollY=', await page.evaluate(() => Math.round(window.scrollY)));
  await page.screenshot({ path: '_tools/lab_out/phys-toc.png' });
  await browser.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
