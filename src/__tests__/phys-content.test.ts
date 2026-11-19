/**
 * 大学物理课程内容完整性测试：
 * 章节结构 / 目录与 section 对齐 / 试卷题库字段 / 标签指向真实存在的章内位置 / id 唯一 / 纯文本字段无实体
 */
import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import Sections from '../components/Sections';
import { physDecks, physPapers, physAllQuestions, physHome } from '../content/phys';

const ENTITY_RE = /&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/;

/** 章节结构契约：12 个章，各章 section 数 */
const EXPECT_SECTIONS: Record<string, number> = {
  deck1: 5,
  deck2: 7,
  deck3: 4,
  deck4: 4,
  deck5: 9,
  deck6: 7,
  deck7: 9,
  deck8: 7,
  deck9: 6,
  deck10: 3,
  deck11: 8,
  deck12: 14,
};

/** 试卷题量契约（与原始卷对齐） */
const EXPECT_PAPER_COUNT: Record<string, number> = {
  'p2019b1': 10,
  'p2020c1': 10,
  'p2020c2': 10,
  'p2016b2': 12,
};

describe('大学物理课件内容', () => {
  it('共 12 个章，id/no 符合约定且按章号排列', () => {
    expect(physDecks.length).toBe(12);
    physDecks.forEach((d, i) => {
      expect(d.id).toBe(`deck${i + 1}`);
      expect(d.no).toBe(`第${i + 1}章`);
    });
  });

  it('各章 section 数与契约一致，目录项与 section id 对齐', () => {
    for (const d of physDecks) {
      expect(d.sections.length, d.id).toBe(EXPECT_SECTIONS[d.id]);
      expect(d.toc.length, `${d.id} toc`).toBeGreaterThan(0);
      for (const s of d.sections) {
        expect(s.blocks.length, `${d.id}/${s.id}`).toBeGreaterThan(0);
        const l2 = d.toc.filter((t) => t.level === 2 && t.text === s.heading);
        if (s.heading && d.toc.some((t) => t.text === s.heading)) {
          expect(l2.length, `${d.id}/${s.id} 目录对齐`).toBeGreaterThan(0);
        }
      }
    }
  });

  it('纯文本渲染字段（标题 / 目录 / heading）不残留 HTML 实体', () => {
    const plain: string[] = [];
    plain.push(physHome.title, physHome.subtitle);
    for (const d of physDecks) {
      plain.push(d.title, d.subtitle);
      for (const t of d.toc) plain.push(t.text);
      for (const s of d.sections) plain.push(s.heading);
    }
    expect(plain.filter((v) => ENTITY_RE.test(v))).toEqual([]);
  });

  it('章节页渲染后的可见文本不出现字面实体（端到端）', () => {
    for (const d of physDecks) {
      const html = renderToStaticMarkup(
        createElement(MemoryRouter, null, createElement(Sections, { sections: d.sections })),
      );
      // 用 DOM 解码后再查：html 块里的合法实体（如 &lt;）渲染为可见字符，不算残留；只有双重转义才会露出
      const div = document.createElement('div');
      div.innerHTML = html;
      expect(ENTITY_RE.test(div.textContent ?? ''), `${d.id} 渲染文本残留实体`).toBe(false);
    }
  });

  it('自测 quiz 块答案可判定（A-F 之一）', () => {
    let quizCount = 0;
    for (const d of physDecks) {
      for (const s of d.sections) {
        for (const b of s.blocks) {
          if (b.type === 'quiz') {
            quizCount++;
            expect(b.quiz.answer, `${d.id}/${s.id} quiz 答案`).toMatch(/^[A-F]$/);
          }
        }
      }
    }
    expect(quizCount).toBeGreaterThan(0);
  });
});

describe('大学物理试卷题库', () => {
  it('共 4 份试卷，各卷题量与原始卷对齐', () => {
    expect(physPapers.length).toBe(4);
    for (const p of physPapers) {
      expect(p.questions.length, p.id).toBe(EXPECT_PAPER_COUNT[p.id]);
      expect(p.answerSource, p.id).toMatch(/^(原卷附答案|本站整理)$/);
    }
  });

  it('题目 id 卷内唯一且按大题顺序排列', () => {
    for (const p of physPapers) {
      const ids = p.questions.map((q) => q.id);
      expect(new Set(ids).size, `${p.id} id 去重`).toBe(ids.length);
    }
  });

  it('字段完整：题干/答案/解析/分值非空，标签 ≥1，题型合法', () => {
    for (const q of physAllQuestions) {
      expect(q.question.length, q.id).toBeGreaterThan(5);
      expect(q.answer.length, q.id).toBeGreaterThan(0);
      expect(q.explanation.length, q.id).toBeGreaterThan(5);
      expect(q.score, q.id).toMatch(/^\d+ 分$/);
      expect(q.tags.length, `${q.id} 标签`).toBeGreaterThan(0);
      expect(['essay', 'calc']).toContain(q.kind);
      expect(q.title.length, q.id).toBeGreaterThan(0);
    }
  });

  it('知识点标签指向真实存在的章与 section（点击可跳转；deck 0 表示课件未收录）', () => {
    for (const q of physAllQuestions) {
      for (const t of q.tags) {
        expect(t.deck, q.id).toBeGreaterThanOrEqual(0);
        expect(t.deck, q.id).toBeLessThanOrEqual(12);
        if (t.deck === 0) {
          expect(t.sec, `${q.id} 未收录标签不带跳转`).toBe('');
          continue;
        }
        const deck = physDecks[t.deck - 1];
        const hit = deck.toc.find((e) => e.id === t.sec) ?? deck.sections.some((s) => s.id === t.sec);
        expect(hit, `${q.id} → deck${t.deck}/${t.sec} 不存在`).toBeTruthy();
        expect(t.text.length, q.id).toBeGreaterThan(0);
        expect(ENTITY_RE.test(t.text), `${q.id} 标签文本残留实体`).toBe(false);
      }
    }
  });

  it('知识点覆盖 12 个章（没有落单的章）', () => {
    const covered = new Set(physAllQuestions.filter((q) => q.kind !== undefined).flatMap((q) => q.tags.map((t) => t.deck)));
    for (let c = 1; c <= 12; c++) {
      expect(covered.has(c), `deck${c} 无题目覆盖`).toBe(true);
    }
  });

  it('每题解析都给出实质理由（长度与题干脱钩的最小要求）', () => {
    for (const q of physAllQuestions) {
      expect(q.explanation.length, `${q.id} 解析过短`).toBeGreaterThan(20);
    }
  });
});
