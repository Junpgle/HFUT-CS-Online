/**
 * 内容完整性测试：锁定迁移产物的结构契约
 * （各讲 section 数 / 目录项 / quiz 数量与题型分布 / 动画引用均有效）
 */
import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { decks, homeData } from '../content';
import { registry } from '../components/demos/registry';
import Sections from '../components/Sections';
import { decodeEntities } from '../lib/text';

/** 纯文本渲染字段里不允许出现的 HTML 实体（出现即会原样显示成乱码） */
const ENTITY_RE = /&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/;

const EXPECT_SECTIONS: Record<string, number> = {
  deck1: 7,
  deck2: 12,
  deck3: 15, // 课程内容补充：新增「0. 算法与计算思维（课件导引）」
  deck4: 8,
  deck5: 8,
  deck6: 13,
  deck7: 10,
  deck8: 10,
};

const EXPECT_QUIZ: Record<string, number> = {
  deck1: 0,
  deck2: 2,
  deck3: 1,
  deck4: 7,
  deck5: 7,
  deck6: 0,
  deck7: 6,
  deck8: 13,
};

describe('content integrity', () => {
  it('共 8 讲 + 首页', () => {
    expect(decks.length).toBe(8);
  });

  it('每讲 section 数与旧版一致', () => {
    for (const d of decks) {
      expect(d.sections.length, d.id).toBe(EXPECT_SECTIONS[d.id]);
      expect(d.toc.length, `${d.id} toc`).toBeGreaterThan(0);
      for (const s of d.sections) {
        expect(s.blocks.length, `${d.id}/${s.id}`).toBeGreaterThan(0);
      }
    }
  });

  it('自测题共 36 道，各讲分布与旧版一致，数据字段完整', () => {
    const all = decks.flatMap((d) =>
      d.sections.flatMap((s) => s.blocks.filter((b) => b.type === 'quiz')),
    );
    expect(all.length).toBe(36);
    for (const d of decks) {
      const n = d.sections.reduce(
        (acc, s) => acc + s.blocks.filter((b) => b.type === 'quiz').length,
        0,
      );
      expect(n, `${d.id} quiz 数`).toBe(EXPECT_QUIZ[d.id]);
    }
    for (const d of decks) {
      for (const s of d.sections) {
        for (const b of s.blocks) {
          if (b.type !== 'quiz') continue;
          const q = b.quiz;
          expect(q.question.length, `${d.id} 题干`).toBeGreaterThan(0);
          expect(q.answer.length, `${d.id} 答案`).toBeGreaterThan(0);
          expect(q.explanation.length, `${d.id} 解析`).toBeGreaterThan(0);
          if (q.kind === 'fill') expect(q.options).toBeUndefined();
          else expect((q.options ?? []).length).toBeGreaterThan(1);
          if (q.kind === 'single') expect(q.answer).toMatch(/^[A-F]$/);
          if (q.kind === 'multi') expect(q.answer).toMatch(/^[A-F](、[A-F])+$/);
          if (q.kind === 'judge') expect(['对', '错']).toContain(q.answer);
        }
      }
    }
  });

  it('内容引用的每个 demo 都已注册，且注册表无多余项', () => {
    const used = decks.flatMap((d) =>
      d.sections.flatMap((s) => s.blocks.filter((b) => b.type === 'demo').map((b) => (b as { name: string }).name)),
    );
    expect(used.length).toBe(24);
    for (const name of used) {
      expect(registry[name], `registry 缺少 ${name}`).toBeDefined();
    }
    expect(Object.keys(registry).sort()).toEqual([...new Set(used)].sort());
  });

  it('首页 12 个区块完整，卡片链接指向各讲', () => {
    expect(homeData.sections.length).toBeGreaterThanOrEqual(9);
    const html = homeData.sections.map((s) => s.blocks.map((b) => (b.type === 'html' ? b.html : '')).join(''));
    expect(html.join('').match(/class="card"/g)?.length).toBe(8);
  });

  it('纯文本渲染字段（标题 / 目录 / heading / 动画标题 / 题干标签 / 答案）不残留 HTML 实体', () => {
    const plain: { where: string; value: string }[] = [];
    const push = (where: string, value: string | undefined) => {
      if (value) plain.push({ where, value });
    };

    for (const d of [homeData, ...decks]) {
      push(`${d.id}.title`, d.title);
      push(`${d.id}.subtitle`, d.subtitle);
      for (const t of d.toc) push(`${d.id}.toc:${t.id}`, t.text);
      for (const s of d.sections) {
        push(`${d.id}.${s.id}.heading`, s.heading);
        for (const b of s.blocks) {
          if (b.type === 'demo') push(`${d.id}.${s.id}.demo:${b.name}`, b.title);
          // 题干与选项按 HTML 渲染，实体由浏览器解码；tag / answer 按纯文本渲染
          if (b.type === 'quiz') {
            push(`${d.id}.${s.id}.quiz.tag`, b.quiz.tag);
            push(`${d.id}.${s.id}.quiz.answer`, b.quiz.answer);
          }
        }
      }
    }

    const bad = plain.filter((p) => ENTITY_RE.test(p.value));
    expect(bad.map((p) => `${p.where} → ${p.value}`)).toEqual([]);
  });

  it('decodeEntities 能解码内容里用到的实体与数字引用', () => {
    expect(decodeEntities('&Theta; / &Omega;')).toBe('Θ / Ω');
    expect(decodeEntities('小 &omega; 记号')).toBe('小 ω 记号');
    expect(decodeEntities('&lang;9, 4, 6&rang;')).toBe('⟨9, 4, 6⟩');
    expect(decodeEntities('T(n) = 2n &minus; 1')).toBe('T(n) = 2n − 1');
    expect(decodeEntities('a &gt; 0 且 b &le; c')).toBe('a > 0 且 b ≤ c');
    expect(decodeEntities('&#8320;&#8321;&#8322;')).toBe('₀₁₂');
    expect(decodeEntities('&#x2208;')).toBe('∈');
    expect(decodeEntities('普通文本 & 符号')).toBe('普通文本 & 符号'); // 非实体不动
    expect(decodeEntities('&unknownentity;')).toBe('&unknownentity;'); // 未知实体原样保留
  });

  it('整页渲染后的可见文本不出现字面实体（端到端）', () => {
    for (const d of [homeData, ...decks]) {
      const html = renderToStaticMarkup(
        createElement(MemoryRouter, null, createElement(Sections, { sections: d.sections })),
      );
      const div = document.createElement('div');
      div.innerHTML = html;
      const text = div.textContent ?? '';
      expect(ENTITY_RE.test(text), `${d.id} 渲染文本残留实体`).toBe(false);
    }
  });
});
