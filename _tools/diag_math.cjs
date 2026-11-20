/* 高等数学课程视觉核查：公式/图片重叠检查，输出诊断到 _audit/math_diag.txt */
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = process.env.MATH_BASE_URL || 'http://localhost:5173/HFUT-CS-Online/#';
const OUT = path.join(__dirname, '..', '_audit', 'math_diag.txt');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--window-size=1440,1000', '--disable-gpu'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });

  const routes = [
    ['math-ch10', '/math/chapter/ch10'],
    ['math-ch11', '/math/chapter/ch11'],
    ['math-practice', '/math/practice'],
    ['paper-midterm', '/math/practice/midterm-2014-2015-b'],
    ['paper-final-old', '/math/practice/final-2012-2013'],
    ['paper-recent', '/math/practice/final-2024-2025'],
  ];

  const lines = [];
  for (const [name, route] of routes) {
    try {
      await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise((r) => setTimeout(r, 700));
      const info = await page.evaluate(() => {
        const formulas = document.querySelectorAll('.formula');
        const mathSpans = document.querySelectorAll('.m');
        const cards = document.querySelectorAll('.card, .deck-card, .practice-card, .pq-card');
        const images = document.querySelectorAll('img, svg');
        // 检查公式文本是否有明显的 raw HTML 残留（如 &lt; 或 &amp;）
        const rawHtml = [];
        for (const f of formulas) {
          const t = f.textContent;
          if (t.includes('&lt;') || t.includes('&gt;') || t.includes('&amp;') || t.includes('<span') || t.includes('</')) {
            rawHtml.push(t.slice(0, 80));
          }
        }
        // 检查 m 类（math span）是否有未渲染的 HTML 标签
        const rawM = [];
        for (const s of mathSpans) {
          const t = s.textContent;
          if (t.includes('&lt;') || t.includes('&gt;') || t.includes('&amp;') || t.includes('<span') || t.includes('</') || t.includes('<br')) {
            rawM.push(t.slice(0, 80));
          }
        }
        // 检查是否有 overflow-x 问题（公式是否超出容器）
        const overflowX = [];
        for (const f of formulas) {
          const r = f.getBoundingClientRect();
          const parent = f.parentElement;
          const pr = parent ? parent.getBoundingClientRect() : { right: 9999 };
          if (r.right > pr.right + 20) {
            overflowX.push({ text: f.textContent.slice(0, 60), right: r.right, parentRight: pr.right });
          }
        }
        // 检查字体大小是否合理
        const fontSizes = [];
        for (const s of mathSpans) {
          const fs = window.getComputedStyle(s).fontSize;
          fontSizes.push(fs);
        }
        const uniqueFontSizes = [...new Set(fontSizes)];
        return {
          formulas: formulas.length,
          mathSpans: mathSpans.length,
          cards: cards.length,
          images: images.length,
          rawHtmlCount: rawHtml.length,
          rawHtml: rawHtml.slice(0, 3),
          rawMCount: rawM.length,
          rawM: rawM.slice(0, 3),
          overflowXCount: overflowX.length,
          overflowX: overflowX.slice(0, 3),
          uniqueFontSizes,
          bodyText: document.body.innerText.slice(0, 200),
        };
      });
      lines.push(`=== ${name} (${route}) ===`);
      lines.push(JSON.stringify(info, null, 2));
      lines.push('');
    } catch (e) {
      lines.push(`FAIL ${name}: ${String(e).slice(0, 200)}`);
    }
  }
  fs.writeFileSync(OUT, lines.join('\n'), 'utf8');
  console.log('done, see', OUT);
  await browser.close();
})();