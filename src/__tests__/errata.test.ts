/**
 * 勘误功能契约测试：
 * - 文本 diff / DOM 替换必须保留行内标签，且不误伤别的位置；
 * - session 要能记录、定位、撤销改动；
 * - 已合并的 errata JSON 必须符合 schema（PR 合并前的最后一道闸）。
 */
import { afterEach, describe, expect, it } from 'vitest';
import type { ErrataPatch } from '../content/types';
import { errataPatches } from '../content/errata';
import { commonPrefix, commonSuffix, diffView, replaceTextRange, textEdit } from '../lib/errata/diff';
import { applyChange, applyPatches, collectBlocks } from '../lib/errata/dom';
import {
  buildPatch,
  errataFilePath,
  makePatchId,
  pageUrl,
  patchSummary,
  serializePatch,
} from '../lib/errata/patch';
import { NEW_FILE_URL_LIMIT, newFileUrl, utf8ToBase64 } from '../lib/errata/github';
import { ErrataSession } from '../lib/errata/session';

function mount(html: string): HTMLElement {
  const root = document.createElement('div');
  root.className = 'page';
  root.innerHTML = html;
  document.body.appendChild(root);
  return root;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('文本 diff', () => {
  it('裁剪公共前后缀，跨词改动压成一段', () => {
    expect(commonPrefix('abcd', 'aXYd')).toBe(1);
    expect(commonSuffix('abcd', 'aXYd', 1)).toBe(1);
    expect(textEdit('abcd', 'aXYd')).toEqual({ start: 1, oldEnd: 3, insert: 'XY' });
    expect(textEdit('abc', 'abXc')).toEqual({ start: 2, oldEnd: 2, insert: 'X' });
    expect(textEdit('abcd', 'ad')).toEqual({ start: 1, oldEnd: 3, insert: '' });
  });

  it('替换范围只动文本节点，保留 <strong>', () => {
    const p = document.createElement('p');
    p.innerHTML = 'a<strong>bc</strong>d';
    replaceTextRange(p, 1, 3, 'XY');
    expect(p.innerHTML).toBe('a<strong>XY</strong>d');
  });

  it('跨节点删除后文字流正确', () => {
    const p = document.createElement('p');
    p.innerHTML = 'a<em>b</em>c';
    replaceTextRange(p, 0, 3, 'Z');
    expect(p.textContent).toBe('Z');
  });

  it('审阅用的 diffView 去掉多余空白', () => {
    const view = diffView('  这是  原文 ', '这是改后文本');
    expect(view.remove).toContain('原文');
    expect(view.add).toContain('改后');
  });
});

describe('可编辑单元', () => {
  it('只收集叶子文本块，跳过代码 / 按钮 / 空段', () => {
    const root = mount(`
      <section><h2>1. 标题</h2>
        <p>段落一</p>
        <div><p>段落二 <strong>加粗</strong></p></div>
        <ul><li>条目</li></ul>
        <pre class="code"><code>int x;</code></pre>
        <button>按钮</button>
        <p>   </p>
      </section>`);
    const texts = collectBlocks(root).map((el) => el.textContent);
    expect(texts).toContain('段落一');
    expect(texts).toContain('段落二 加粗');
    expect(texts).toContain('条目');
    expect(texts).toContain('1. 标题');
    expect(texts).not.toContain('int x;');
    expect(texts).not.toContain('按钮');
    expect(texts.some((t) => (t ?? '').trim() === '')).toBe(false);
  });
});

describe('套用勘误', () => {
  it('锚点 + occurrence 定位到正确段落', () => {
    const root = mount(`
      <section><h2>1. A</h2><p>同一句</p><p>同一句</p></section>
      <section><h2>2. B</h2><p>同一句</p></section>`);
    applyChange(root, { page: '/x', anchor: '2. B', old: '同一句', new: 'B 的下文' });
    applyChange(root, { page: '/x', anchor: '1. A', old: '同一句', new: 'A 的第二处', occurrence: 1 });
    const ps = root.querySelectorAll('p');
    expect(ps[0].textContent).toBe('同一句');
    expect(ps[1].textContent).toBe('A 的第二处');
    expect(ps[2].textContent).toBe('B 的下文');
  });

  it('改变一段文字时保留其行内加粗', () => {
    const root = mount('<section><h2>H</h2><p>请<strong>记</strong>住这一点</p></section>');
    const ok = applyChange(root, { page: '/x', old: '请记住这一点', new: '请牢记这一点' });
    expect(ok).toBe(true);
    expect(root.querySelector('strong')?.textContent).toBe('牢记');
    expect(root.querySelector('p')?.textContent).toBe('请牢记这一点');
  });

  it('找不到原文时静默跳过', () => {
    const root = mount('<section><h2>H</h2><p>现在的内容</p></section>');
    expect(applyChange(root, { page: '/x', old: '已改版的内容', new: '新内容' })).toBe(false);
    expect(root.querySelector('p')?.textContent).toBe('现在的内容');
  });

  it('同批两处相同原文按 occurrence 倒序应用，不会互相挤位', () => {
    const root = mount('<section><h2>H</h2><p>同一句</p><p>同一句</p></section>');
    const patch: ErrataPatch = {
      version: 1,
      id: 't',
      createdAt: '2026-01-01T00:00:00.000Z',
      changes: [
        { page: '/x', old: '同一句', new: '第一处', occurrence: 0 },
        { page: '/x', old: '同一句', new: '第二处', occurrence: 1 },
      ],
    };
    applyPatches(root, '/x', [patch]);
    const ps = root.querySelectorAll('p');
    expect(ps[0].textContent).toBe('第一处');
    expect(ps[1].textContent).toBe('第二处');
  });
});

describe('编辑会话', () => {
  it('进入后标记 contenteditable，记录、定位、撤销', () => {
    const root = mount('<section><h2>H</h2><p>同一句</p><p>同一句</p><p>原文</p></section>');
    const session = new ErrataSession();
    session.enter(root, '/x');
    const ps = root.querySelectorAll('p');
    expect(ps[0].getAttribute('contenteditable')).toBeTruthy();

    ps[1].textContent = '第二处';
    ps[1].dispatchEvent(new Event('input', { bubbles: true }));
    const second = session.records().find((r) => r.next === '第二处');
    expect(second).toBeTruthy();
    expect(second?.occurrence).toBe(1);
    expect(second?.anchor).toBe('H');

    session.revert(second!.key);
    expect(ps[1].textContent).toBe('同一句');
    expect(session.count()).toBe(0);

    session.leave();
    expect(ps[0].hasAttribute('contenteditable')).toBe(false);
  });

  it('改回原文时自动移除该条改动', () => {
    const root = mount('<section><h2>H</h2><p>原文</p></section>');
    const session = new ErrataSession();
    session.enter(root, '/x');
    const p = root.querySelector('p')!;
    p.textContent = '改后';
    p.dispatchEvent(new Event('input', { bubbles: true }));
    expect(session.count()).toBe(1);
    p.textContent = '原文';
    p.dispatchEvent(new Event('input', { bubbles: true }));
    expect(session.count()).toBe(0);
    session.leave();
  });
});

describe('勘误文件', () => {
  it('buildPatch 生成稳定结构，备注去空白', () => {
    const patch = buildPatch({
      id: '20261123-010203-abcd',
      now: new Date('2026-11-23T01:02:03.000Z'),
      pageTitle: '第 1 讲',
      note: '  教材 P12  ',
      changes: [{ page: '/algo/deck/deck1', anchor: 'A', old: '错字', new: '正字', occurrence: 0 }],
    });
    expect(patch).toEqual({
      version: 1,
      id: '20261123-010203-abcd',
      createdAt: '2026-11-23T01:02:03.000Z',
      pageTitle: '第 1 讲',
      note: '教材 P12',
      changes: [{ page: '/algo/deck/deck1', anchor: 'A', old: '错字', new: '正字', occurrence: 0 }],
    });
    expect(JSON.parse(serializePatch(patch))).toEqual(patch);
    expect(errataFilePath(patch.id)).toBe('src/content/errata/20261123-010203-abcd.json');
    expect(pageUrl('/x')).toContain('#/x');
  });

  it('PR 摘要包含改动数、页面链接与原文', () => {
    const patch = buildPatch({
      id: 't',
      changes: [
        { page: '/os/chapter/ch1', old: '旧文', new: '新文' },
        { page: '/os/chapter/ch1', old: '另一处', new: '改后' },
      ],
    });
    const summary = patchSummary(patch);
    expect(summary.title).toContain('2 处勘误');
    expect(summary.body).toContain('/os/chapter/ch1');
    expect(summary.body).toContain('旧文');
  });

  it('id 形如 20261123-091011-a1b2', () => {
    expect(makePatchId(new Date('2026-11-23T09:10:11'))).toMatch(/^20261123-091011-[a-z0-9]{4}$/);
  });

  it('已合并的勘误文件全部符合契约', () => {
    const files = import.meta.glob<string>('../content/errata/*.json', {
      eager: true,
      query: '?raw',
      import: 'default',
    });
    for (const [path, text] of Object.entries(files)) {
      const name = path.split('/').pop() ?? path;
      const patch = JSON.parse(text) as ErrataPatch;
      expect(patch.version, name).toBe(1);
      expect(patch.id, name).toBe(name.replace(/\.json$/, ''));
      expect(Number.isNaN(Date.parse(patch.createdAt)), name).toBe(false);
      expect(Array.isArray(patch.changes) && patch.changes.length > 0, name).toBe(true);
      for (const change of patch.changes) {
        expect(change.page, name).toMatch(/^\/[A-Za-z0-9/_-]+$/);
        expect(change.old.length, name).toBeGreaterThan(0);
        expect(change.old, name).not.toBe(change.new);
        if (change.occurrence !== undefined) {
          expect(Number.isInteger(change.occurrence) && change.occurrence >= 0, name).toBe(true);
        }
        if (change.anchor !== undefined) expect(typeof change.anchor, name).toBe('string');
      }
      expect(errataPatches.length).toBeGreaterThanOrEqual(0);
    }
  });
});

describe('GitHub 提交', () => {
  it('新建文件 URL 转义中文与路径；过长时退化为只预填文件名', () => {
    const small = newFileUrl('src/content/errata/a.json', '{"勘误":1}', 'fix(errata)');
    expect(small.tooLong).toBe(false);
    expect(small.url).toContain('filename=src/content/errata/a.json');
    expect(small.url).toContain(encodeURIComponent('{"勘误":1}'));

    const big = newFileUrl('src/content/errata/a.json', 'x'.repeat(NEW_FILE_URL_LIMIT + 100), 'm');
    expect(big.tooLong).toBe(true);
    expect(big.url).not.toContain('value=');
    expect(big.fullUrl).toContain('value=');
  });

  it('UTF-8 内容编码成 base64 可还原', () => {
    const text = '勘误：Θ(n log n) 😀';
    const b64 = utf8ToBase64(text);
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    expect(new TextDecoder().decode(bytes)).toBe(text);
  });
});
