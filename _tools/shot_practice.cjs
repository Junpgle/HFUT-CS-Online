// 移动端视口截图：puppeteer-core 直连本地 Chrome（IAB 不支持 setViewportSize）
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

function findChrome() {
  const candidates = [
    process.env.LOCALAPPDATA + '/Google/Chrome/Application/chrome.exe',
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    process.env.LOCALAPPDATA + '/Chromium/Application/chrome.exe',
  ];
  for (const p of candidates) if (fs.existsSync(p)) return p;
  throw new Error('chrome not found');
}

(async () => {
  const outDir = path.join(__dirname, 'shots');
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: 'new',
    args: ['--no-first-run', '--disable-extensions'],
  });
  try {
    // 手机竖屏 390x844
    const mob = await browser.newPage();
    await mob.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
    await mob.goto('http://localhost:5173/HFUT-algorithm-design/#/algo/practice', { waitUntil: 'networkidle0' });
    await mob.evaluate(() => {
      localStorage.setItem('hb-theme', 'light');
      localStorage.setItem('practice-progress-v1', JSON.stringify({ s1: 'right', s3: 'wrong' }));
    });
    await mob.reload({ waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 800));
    const info = await mob.evaluate(() => {
      const heat = document.querySelector('.pq-heatblock');
      const firstCard = document.querySelector('.practice-q');
      const kindnav = document.querySelector('.pq-kindnav');
      const cell = document.querySelector('.pq-heat-cell');
      const danger = document.querySelector('.pq-danger');
      return {
        heatOpen: heat.open,
        firstCardTop: Math.round(firstCard.getBoundingClientRect().top + window.scrollY),
        docH: document.documentElement.scrollHeight,
        kindnavOverflow: kindnav.scrollWidth > kindnav.clientWidth,
        cellSize: Math.round(cell.getBoundingClientRect().width),
        dangerWrap: danger ? danger.getBoundingClientRect().width < 88 : null,
      };
    });
    console.log('mobile:', JSON.stringify(info));
    await mob.screenshot({ path: path.join(outDir, 'mob-top.png') });

    // 热力图展开态
    await mob.evaluate(() => { document.querySelector('.pq-heatblock').open = true; });
    await new Promise((r) => setTimeout(r, 300));
    const heat = await mob.evaluate(() => { document.querySelector('.pq-heatblock').scrollIntoView(); return document.documentElement.scrollHeight; });
    await new Promise((r) => setTimeout(r, 400));
    await mob.screenshot({ path: path.join(outDir, 'mob-heat.png') });

    // 紧凑顶栏 1100px（缩写态「1讲」）
    const desk = await browser.newPage();
    await desk.setViewport({ width: 1100, height: 800 });
    await desk.goto('http://localhost:5173/HFUT-algorithm-design/#/algo/practice', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 800));
    await desk.screenshot({ path: path.join(outDir, 'desk-1100.png') });
    const topbar = await desk.evaluate(() => {
      const tabs = document.querySelector('.deck-tabs');
      return { overflow: tabs.scrollWidth > tabs.clientWidth + 1, sw: tabs.scrollWidth, cw: tabs.clientWidth };
    });
    console.log('topbar1100:', JSON.stringify(topbar));
  } finally {
    await browser.close();
  }
})();
