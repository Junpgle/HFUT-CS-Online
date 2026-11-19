/**
 * 操作系统课程内容完整性测试：
 * 章节结构 / 目录与 section 对齐 / 试卷题库字段与答案格式 / 标签指向真实存在的章内位置 / id 唯一 / 纯文本字段无实体
 */
import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import Sections from '../components/Sections';
import { osChapters, osPapers, osAllQuestions } from '../content/os';

const ENTITY_RE = /&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/;

/** 章节结构契约：8 个章（第 1～7 章 + 大题精讲），各章 section 数 */
const EXPECT_SECTIONS: Record<string, number> = {
  ch1: 6,
  ch2: 8,
  ch3: 8,
  ch4: 9,
  ch5: 5,
  ch6: 8,
  ch7: 5,
  ch8: 7,
};

/** 试卷题量契约（与原始卷对齐；填空按空拆分计） */
const EXPECT_PAPER_COUNT: Record<string, number> = {
  'ac-2022a': 33,
  'b-2022': 50,
  'xc-2022a': 52,
  'b-2021': 33,
};

describe('操作系统课件内容', () => {
  it('共 8 个章（第 1～7 章 + 期末大题精讲），id/no 符合约定', () => {
    expect(osChapters.length).toBe(8);
    osChapters.forEach((c, i) => {
      expect(c.id).toBe(`ch${i + 1}`);
    });
    expect(osChapters[0].no).toBe('第1章');
    expect(osChapters[7].no).toBe('大题精讲');
  });

  it('各章 section 数与契约一致，目录项与 section id 对齐', () => {
    for (const c of osChapters) {
      expect(c.sections.length, c.id).toBe(EXPECT_SECTIONS[c.id]);
      expect(c.toc.length, `${c.id} toc`).toBeGreaterThan(0);
      for (const s of c.sections) {
        expect(s.blocks.length, `${c.id}/${s.id}`).toBeGreaterThan(0);
        // 每个 level 2 目录项都要有对应 section（level 3 目录项对应 html 内 h3）
        const l2 = c.toc.filter((t) => t.level === 2 && t.text === s.heading);
        if (s.heading && c.toc.some((t) => t.text === s.heading)) {
          expect(l2.length, `${c.id}/${s.id} 目录对齐`).toBeGreaterThan(0);
        }
      }
    }
  });

  it('纯文本渲染字段（标题 / 目录 / heading）不残留 HTML 实体', () => {
    const plain: string[] = [];
    for (const c of osChapters) {
      plain.push(c.title, c.subtitle);
      for (const t of c.toc) plain.push(t.text);
      for (const s of c.sections) plain.push(s.heading);
    }
    expect(plain.filter((v) => ENTITY_RE.test(v))).toEqual([]);
  });

  it('章节页渲染后的可见文本不出现字面实体（端到端）', () => {
    for (const c of osChapters) {
      const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(Sections, { sections: c.sections })));
      const div = document.createElement('div');
      div.innerHTML = html;
      expect(ENTITY_RE.test(div.textContent ?? ''), `${c.id} 渲染文本残留实体`).toBe(false);
    }
  });
});

describe('操作系统试卷题库', () => {
  it('共 4 份试卷，各卷题量与原始卷对齐', () => {
    expect(osPapers.length).toBe(4);
    for (const p of osPapers) {
      expect(p.questions.length, p.id).toBe(EXPECT_PAPER_COUNT[p.id]);
      // 分组清单必须覆盖全部题目且不重复
      const groupIds = p.sections.flatMap((s) => s.questionIds);
      expect(new Set(groupIds).size, `${p.id} 分组`).toBe(groupIds.length);
      expect(groupIds.length, `${p.id} 分组覆盖`).toBe(p.questions.length);
    }
  });

  it('题目 id 全库唯一且形如 p{卷}-{题型}{原卷号}', () => {
    const ids = osAllQuestions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const q of osAllQuestions) {
      expect(q.id, q.id).toMatch(/^p[1-4]-[smjfe]\d+(-\d+)?$/);
    }
  });

  it('字段完整：题干/答案/解析非空，标签 ≥1，选项数合理', () => {
    for (const q of osAllQuestions) {
      expect(q.question.length, q.id).toBeGreaterThan(5);
      expect(q.answer.length, q.id).toBeGreaterThan(0);
      expect(q.explanation.length, q.id).toBeGreaterThan(10);
      expect(q.tags.length, `${q.id} 标签`).toBeGreaterThan(0);
      if (q.kind === 'fill' || q.kind === 'essay') {
        expect(q.options, `${q.id} 不应有选项`).toBeUndefined();
      } else {
        expect((q.options ?? []).length, `${q.id} 选项数`).toBeGreaterThanOrEqual(2);
        if (q.kind === 'judge') {
          expect((q.options ?? []).length).toBe(2);
          expect(q.answer === '对' || q.answer === '错', q.id).toBe(true);
        } else {
          expect((q.options ?? []).length).toBeLessThanOrEqual(6);
          expect(q.answer, q.id).not.toMatch(/&/);
        }
      }
    }
  });

  it('答案格式符合题型约定', () => {
    for (const q of osAllQuestions) {
      if (q.kind === 'single') expect(q.answer, q.id).toMatch(/^[A-F]$/);
      if (q.kind === 'multi') expect(q.answer, q.id).toMatch(/^[A-F](、[A-F])+$/);
      if (q.kind === 'single' || q.kind === 'multi') {
        const n = q.answer.split('、').length;
        expect((q.options ?? []).length, q.id).toBeGreaterThanOrEqual(n);
        const idx = q.answer.length === 1 ? 'ABCDEF'.indexOf(q.answer) : 0;
        expect((q.options ?? []).length, q.id).toBeGreaterThan(idx);
      }
      if (q.kind === 'judge') expect(['对', '错']).toContain(q.answer);
    }
  });

  it('知识点标签指向真实存在的章与 section（点击可跳转）', () => {
    for (const q of osAllQuestions) {
      for (const t of q.tags) {
        expect(t.deck, q.id).toBeGreaterThanOrEqual(1);
        expect(t.deck, q.id).toBeLessThanOrEqual(8);
        const chapter = osChapters[t.deck - 1];
        const hit = chapter.toc.find((e) => e.id === t.sec);
        expect(hit, `${q.id} → ch${t.deck}/${t.sec} 不存在`).toBeDefined();
        expect(t.text.length, q.id).toBeGreaterThan(0);
        expect(ENTITY_RE.test(t.text), `${q.id} 标签文本残留实体`).toBe(false);
      }
    }
  });

  it('知识点覆盖 8 个章（没有落单的章）', () => {
    const covered = new Set(osAllQuestions.flatMap((q) => q.tags.map((t) => t.deck)));
    for (let c = 1; c <= 8; c++) {
      expect(covered.has(c), `ch${c} 无题目覆盖`).toBe(true);
    }
  });

  it('纯文本字段（标签）与判分答案不残留 HTML 实体', () => {
    for (const q of osAllQuestions) {
      for (const t of q.tags) {
        expect(ENTITY_RE.test(t.text), `${q.id} tag`).toBe(false);
      }
    }
  });

  it('扫描转录卷的答案标注为本站整理，Word 原卷标注为原卷附答案', () => {
    const byId = new Map(osPapers.map((p) => [p.id, p]));
    expect(byId.get('ac-2022a')?.answerSource).toBe('本站整理');
    expect(byId.get('b-2021')?.answerSource).toBe('本站整理');
    expect(byId.get('b-2022')?.answerSource).toBe('原卷附答案');
    expect(byId.get('xc-2022a')?.answerSource).toBe('原卷附答案');
  });
});
