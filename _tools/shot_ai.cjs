/* 人工智能原理题库视觉核查：桌面全页 + 元素细节 + 暗色 + 移动，存 _audit/ai_shots/ */
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = 'http://localhost:5199/HFUT-CS-Online';
const OUT = path.join(__dirname, '..', '_audit', 'ai_shots');

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--window-size=1440,1000', '--disable-gpu'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => console.log('[pageerror]', String(e).slice(0, 200)));
  page.on('console', (m) => {
    if (m.type() === 'error') console.log('[console]', m.text().slice(0, 200));
  });

  const goto = async (route) => {
    await page.goto(`${BASE}/#${route}`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 600));
  };
  const shot = async (name) => page.screenshot({ path: path.join(OUT, `${name}.png`) });

  // 1. 课程根重定向 + 全页
  await goto('/ai');
  console.log('hash after /ai:', await page.evaluate(() => location.hash));
  await shot('ai-root');

  // 2. 展开全部答案 + 方向背景，全页截图
  await page.evaluate(() => {
    document.querySelectorAll('.pq-disclose').forEach((b) => (b instanceof HTMLElement ? b.click() : null));
    document.querySelectorAll('.ai-kp').forEach((d) => (d.open = true));
  });
  await new Promise((r) => setTimeout(r, 700));
  await shot('ai-full-open');

  // 3. 题目 8 的公式与表格区
  await page.evaluate(() => {
    const el = document.querySelector('[data-qid="p1-e8"]');
    if (el) {
      const r = el.getBoundingClientRect();
      window.scrollTo({ top: Math.max(0, window.scrollY + r.top - 120), behavior: 'instant' });
    }
  });
  await new Promise((r) => setTimeout(r, 250));
  await shot('d-ai-q8');

  // 4. 方向一背景块（公式区）
  await page.evaluate(() => {
    const el = document.querySelector('.ai-kp');
    if (el) {
      const r = el.getBoundingClientRect();
      window.scrollTo({ top: Math.max(0, window.scrollY + r.top - 120), behavior: 'instant' });
    }
  });
  await new Promise((r) => setTimeout(r, 250));
  await shot('d-ai-brief');

  // 5. 标签跳转 ?s=dir-3：应滚到方向三背景并展开
  await goto('/ai/practice?s=dir-3');
  await new Promise((r) => setTimeout(r, 600));
  await shot('d-ai-jump-dir3');

  // 6. 暗色
  await goto('/ai/practice');
  await page.evaluate(() => {
    document.documentElement.dataset.theme = 'dark';
    document.querySelectorAll('.pq-disclose').forEach((b) => (b instanceof HTMLElement ? b.click() : null));
  });
  await new Promise((r) => setTimeout(r, 600));
  await page.evaluate(() => {
    const el = document.querySelector('[data-qid="p1-e9"]');
    if (el) {
      const r = el.getBoundingClientRect();
      window.scrollTo({ top: Math.max(0, window.scrollY + r.top - 120), behavior: 'instant' });
    }
  });
  await new Promise((r) => setTimeout(r, 250));
  await shot('d-ai-dark-q9');

  // 7. 移动视口首屏
  const mp = await browser.newPage();
  await mp.setViewport({ width: 500, height: 900, deviceScaleFactor: 1, isMobile: true });
  await mp.goto(`${BASE}/#/ai/practice`, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 600));
  await mp.screenshot({ path: path.join(OUT, 'ai-m-home.png') });

  // 8. 首页课程卡
  await page.goto(`${BASE}/#/`, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 600));
  const hubCard = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('a, div'));
    const el = cards.find((e) => e.textContent?.trim().startsWith('人工智能原理') && e.querySelector('*'));
    return el ? el.className : 'not-found';
  });
  console.log('hub card class:', hubCard);
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('*')).find((e) => e.textContent?.trim() === '人工智能原理');
    if (el) {
      const r = el.getBoundingClientRect();
      window.scrollTo({ top: Math.max(0, window.scrollY + r.top - 300), behavior: 'instant' });
    }
  });
  await new Promise((r) => setTimeout(r, 250));
  await shot('hub-ai-card');

  await browser.close();
  console.log('done');
})();
