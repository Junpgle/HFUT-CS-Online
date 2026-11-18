// 第七轮整改复检：针对 19 条改动逐一截图/测量
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

function findChrome() {
  const candidates = [
    process.env.LOCALAPPDATA + '/Google/Chrome/Application/chrome.exe',
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
  ];
  for (const p of candidates) if (fs.existsSync(p)) return p;
  throw new Error('chrome not found');
}
const BASE = 'http://localhost:5173/HFUT-CS-Online/';
const outDir = path.join(__dirname, 'shots', 'audit7-fix');
fs.mkdirSync(outDir, { recursive: true });

(async () => {
  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: 'new',
    args: ['--no-first-run', '--disable-extensions', '--window-size=1500,1000'],
  });
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  try {
    // 桌面 1440：deck3 侧栏编号/悬挂缩进/底部渐隐 + 讲脉络
    let page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
    await page.goto(BASE + '#/algo/deck/deck3', { waitUntil: 'networkidle0' });
    await sleep(900);
    const sidebar = await page.evaluate(() => {
      const a = document.querySelector('.toc a.has-no');
      const sb = document.querySelector('.sidebar');
      const cs = a ? getComputedStyle(a) : null;
      const chip = document.querySelector('.topic-map');
      return {
        hasNoCount: document.querySelectorAll('.toc a.has-no').length,
        padLeft: cs?.paddingLeft,
        chipOverflowX: chip ? getComputedStyle(chip).overflowX : null,
        sidebarMask: sb ? getComputedStyle(sb).maskImage.slice(0, 40) : null,
        firstTocText: a?.textContent?.slice(0, 24),
      };
    });
    console.log('deck3 desktop:', JSON.stringify(sidebar));
    await page.screenshot({ path: path.join(outDir, 'deck3-top.png') });
    // 聚焦模式：滚到第三节，看暗色
    await page.evaluate(() => localStorage.setItem('hb-theme', 'dark'));
    await page.reload({ waitUntil: 'networkidle0' });
    await sleep(800);
    await page.evaluate(() => document.querySelector('#sec-theta')?.scrollIntoView({ behavior: 'instant' }));
    await sleep(600);
    await page.screenshot({ path: path.join(outDir, 'deck3-dark-mid.png') });
    await page.close();

    // deck5：公式溢出渐隐
    page = await browser.newPage();
    await page.setViewport({ width: 900, height: 800, deviceScaleFactor: 1.5 });
    await page.goto(BASE + '#/algo/deck/deck5', { waitUntil: 'networkidle0' });
    await sleep(800);
    const formula = await page.evaluate(() => {
      const f = [...document.querySelectorAll('.formula')].find((x) => x.scrollWidth > x.clientWidth + 1);
      return f ? { hasFade: f.classList.contains('edge-fade'), sw: f.scrollWidth, cw: f.clientWidth } : 'no-overflow-formula';
    });
    console.log('deck5 formula:', JSON.stringify(formula));
    await page.evaluate(() => {
      const f = [...document.querySelectorAll('.formula')].find((x) => x.scrollWidth > x.clientWidth + 1);
      f?.scrollIntoView({ block: 'center', behavior: 'instant' });
    });
    await sleep(400);
    await page.screenshot({ path: path.join(outDir, 'deck5-formula.png') });
    await page.close();

    // 练习页：进度文字折行 / 热力格 / 右轨墨色点 / 模态
    page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
    await page.goto(BASE + '#/algo/practice', { waitUntil: 'networkidle0' });
    await sleep(900);
    const prog = await page.evaluate(() => {
      const frag = document.querySelectorAll('.pq-frag').length;
      const t = document.querySelector('.pq-progress-text span');
      const bar = document.querySelector('.pq-progress-bar');
      const fragH = t ? Math.round(t.getBoundingClientRect().height) : 0;
      return { frag, fragH, barW: bar ? Math.round(bar.getBoundingClientRect().width) : 0 };
    });
    console.log('practice mobile progress:', JSON.stringify(prog));
    await page.screenshot({ path: path.join(outDir, 'practice-mob-top.png') });
    // 热力格对比度采样
    const cell = await page.evaluate(() => {
      document.querySelector('.pq-heatblock').open = true;
      const c = document.querySelector('.pq-heat-cell');
      const cs = getComputedStyle(c);
      return { bg: cs.backgroundColor, border: cs.borderColor };
    });
    await sleep(300);
    console.log('heat cell:', JSON.stringify(cell));
    await page.evaluate(() => document.querySelector('.pq-heatblock').scrollIntoView({ behavior: 'instant' }));
    await sleep(300);
    await page.screenshot({ path: path.join(outDir, 'practice-mob-heat.png') });
    await page.close();

    // 练习页桌面：模态 + 右轨
    page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
    await page.goto(BASE + '#/algo/practice', { waitUntil: 'networkidle0' });
    await sleep(900);
    await page.evaluate(() => {
      localStorage.setItem('practice-progress-v1', JSON.stringify({ s1: 'right', s3: 'wrong' }));
    });
    await page.reload({ waitUntil: 'networkidle0' });
    await sleep(900);
    const track = await page.evaluate(() => {
      const seg = document.querySelector('.pq-track-seg.active i');
      return seg ? getComputedStyle(seg).backgroundColor : null;
    });
    console.log('track active dot:', track);
    // 打开确认模态
    await page.evaluate(() => {
      const btn = document.querySelector('.pq-danger');
      btn.disabled = false;
      btn.click();
    });
    await sleep(500);
    await page.screenshot({ path: path.join(outDir, 'practice-modal.png') });
    // 取消关闭
    await page.evaluate(() => {
      [...document.querySelectorAll('.hub-modal-actions .btn')].find((b) => b.textContent === '取消')?.click();
    });
    await sleep(400);
    const modalGone = await page.evaluate(() => !document.querySelector('.hub-modal'));
    console.log('modal closed by cancel:', modalGone);
    await page.close();

    // 首页：统计 3+2 + 向下提示
    page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
    await page.goto(BASE + '#/', { waitUntil: 'networkidle0' });
    await sleep(900);
    const stats = await page.evaluate(() => {
      const s = document.querySelector('.hub-hero-stats');
      const cs = getComputedStyle(s);
      const items = s.children.length;
      const first = s.children[0].getBoundingClientRect();
      const second = s.children[3]?.getBoundingClientRect();
      const scrollBtn = document.querySelector('.hub-hero-scroll');
      return {
        display: cs.display,
        cols: cs.gridTemplateColumns,
        row2SameTop: second ? Math.abs(first.top - second.top) < 2 : null,
        hint: !!scrollBtn,
      };
    });
    console.log('home mobile stats:', JSON.stringify(stats));
    await page.screenshot({ path: path.join(outDir, 'home-mob-top.png') });
    await page.close();

    // 首页桌面：hero 提示钮
    page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
    await page.goto(BASE + '#/', { waitUntil: 'networkidle0' });
    await sleep(900);
    await page.screenshot({ path: path.join(outDir, 'home-top.png') });
    await page.close();

    // 搜索：清除钮 + 高亮
    page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
    await page.goto(BASE + '#/algo', { waitUntil: 'networkidle0' });
    await sleep(900);
    await page.click('.search-input');
    await page.type('.search-input', '主方法');
    await sleep(500);
    const search = await page.evaluate(() => ({
      clear: !!document.querySelector('.search-clear'),
      marks: document.querySelectorAll('.pi-mark').length,
      markText: document.querySelector('.pi-mark')?.textContent,
    }));
    console.log('search:', JSON.stringify(search));
    await page.screenshot({ path: path.join(outDir, 'search.png') });
    await page.close();

    // 占位页：toplink 胶囊
    page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
    await page.goto(BASE + '#/course/%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84', { waitUntil: 'networkidle0' });
    await sleep(900);
    const stub = await page.evaluate(() => {
      const link = document.querySelector('.hub-toplink');
      const pill = link?.closest('.topbar-ctl.nav-pill');
      const lede = document.querySelector('.lede');
      return { inPill: !!pill, ledeStyled: lede ? getComputedStyle(lede).borderBottomWidth : null };
    });
    console.log('stub page:', JSON.stringify(stub));
    await page.screenshot({ path: path.join(outDir, 'stub-top.png') });
    await page.close();

    // 移动端 deck3：合并胶囊顶栏 + 讲脉络横滑
    page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
    await page.goto(BASE + '#/algo/deck/deck3', { waitUntil: 'networkidle0' });
    await sleep(900);
    const mob = await page.evaluate(() => {
      const left = document.querySelector('.topbar-left');
      const tm = document.querySelector('.topic-map');
      const cs = tm ? getComputedStyle(tm) : null;
      return {
        leftRadius: getComputedStyle(left).borderRadius,
        leftBg: getComputedStyle(left).backgroundColor.slice(0, 24),
        topicWrap: cs?.flexWrap,
        topicOverflow: cs?.overflowX,
        topicScrollable: tm ? tm.scrollWidth > tm.clientWidth : null,
      };
    });
    console.log('deck3 mobile:', JSON.stringify(mob));
    await page.screenshot({ path: path.join(outDir, 'deck3-mob-top.png') });
    await page.close();

    console.log('done');
  } finally {
    await browser.close();
  }
})();
