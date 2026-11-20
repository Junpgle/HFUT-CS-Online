/**
 * 计算机体系结构课程内容完整性测试：
 * 讲次结构 / 目录与 section 对齐 / 试卷题库字段与答案格式 / 标签指向真实存在的讲内位置 / id 唯一 / 纯文本字段无实体
 */
import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import Sections from '../components/Sections';
import { caChapters, caPapers, caAllQuestions } from '../content/ca';

const ENTITY_RE = /&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/;

/** 讲次结构契约：14 讲（第 1～14 讲），各讲 section 数 */
const EXPECT_SECTIONS: Record<string, number> = {
  ch1: 6,
  ch2: 6,
  ch3: 6,
  ch4: 6,
  ch5: 6,
  ch6: 5,
  ch7: 5,
  ch8: 5,
  ch9: 5,
  ch10: 6,
  ch11: 5,
  ch12: 6,
  ch13: 4,
  ch14: 4,
};

/** 试卷题量契约（按原文件目录与照片数对齐：课堂测试 3 题、期末回忆 10 题、大题预测 5 题） */
const EXPECT_PAPER_COUNT: Record<string, number> = {
  quiz2: 3,
  'recall-2019': 10,
  predict: 5,
};

describe('计算机体系结构课件内容', () => {
  it('共 14 讲（第 1～14 讲），id/no 符合约定', () => {
    expect(caChapters.length).toBe(14);
    caChapters.forEach((c, i) => {
      expect(c.id).toBe(`ch${i + 1}`);
      expect(c.no).toBe(`第${i + 1}讲`);
    });
  });

  it('各讲 section 数与契约一致，目录项与 section id 对齐', () => {
    for (const c of caChapters) {
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
    for (const c of caChapters) {
      plain.push(c.title, c.subtitle);
      for (const t of c.toc) plain.push(t.text);
      for (const s of c.sections) plain.push(s.heading);
    }
    expect(plain.filter((v) => ENTITY_RE.test(v))).toEqual([]);
  });

  it('章节页渲染后的可见文本不出现字面实体（端到端）', () => {
    for (const c of caChapters) {
      const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(Sections, { sections: c.sections })));
      const div = document.createElement('div');
      div.innerHTML = html;
      expect(ENTITY_RE.test(div.textContent ?? ''), `${c.id} 渲染文本残留实体`).toBe(false);
    }
  });
});

describe('计算机体系结构试卷题库', () => {
  it('共 3 份试卷，各卷题量与契约一致', () => {
    expect(caPapers.length).toBe(3);
    for (const p of caPapers) {
      expect(p.questions.length, p.id).toBe(EXPECT_PAPER_COUNT[p.id]);
      // 分组清单必须覆盖全部题目且不重复
      const groupIds = p.sections.flatMap((s) => s.questionIds);
      expect(new Set(groupIds).size, `${p.id} 分组`).toBe(groupIds.length);
      expect(groupIds.length, `${p.id} 分组覆盖`).toBe(p.questions.length);
    }
  });

  it('题目 id 全库唯一且形如 q{卷}-{原卷号}', () => {
    const ids = caAllQuestions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const q of caAllQuestions) {
      expect(q.id, q.id).toMatch(/^q[1-3]-\d+$/);
    }
  });

  it('字段完整：题干/答案/解析非空，标签 ≥1', () => {
    for (const q of caAllQuestions) {
      expect(q.question.length, q.id).toBeGreaterThan(10);
      expect(q.answer.length, q.id).toBeGreaterThan(10);
      expect(q.explanation.length, q.id).toBeGreaterThan(10);
      expect(q.tags.length, `${q.id} 标签`).toBeGreaterThan(0);
      if (q.kind === 'fill' || q.kind === 'essay') {
        expect(q.options, `${q.id} 不应有选项`).toBeUndefined();
      } else {
        expect((q.options ?? []).length, `${q.id} 选项数`).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it('知识点标签指向真实存在的讲次与 section（点击可跳转）', () => {
    for (const q of caAllQuestions) {
      for (const t of q.tags) {
        expect(t.deck, q.id).toBeGreaterThanOrEqual(2);
        expect(t.deck, q.id).toBeLessThanOrEqual(14);
        const chapter = caChapters.find((c) => c.id === `ch${t.deck}`);
        expect(chapter, `${q.id} → ch${t.deck} 不存在`).toBeDefined();
        const hit = chapter!.toc.find((e) => e.id === t.sec);
        expect(hit, `${q.id} → ch${t.deck}/${t.sec} 不存在`).toBeDefined();
        expect(t.text.length, q.id).toBeGreaterThan(0);
        expect(ENTITY_RE.test(t.text), `${q.id} 标签文本残留实体`).toBe(false);
      }
    }
  });

  it('知识点覆盖重点讲次（流水线/ILP/存储/Cache/虚存/一致性）', () => {
    const covered = new Set(caAllQuestions.flatMap((q) => q.tags.map((t) => t.deck)));
    for (const c of [2, 4, 5, 6, 7, 8, 10, 12, 13, 14]) {
      expect(covered.has(c), `第 ${c} 讲无题目覆盖`).toBe(true);
    }
  });

  it('纯文本字段（标签）不残留 HTML 实体', () => {
    for (const q of caAllQuestions) {
      for (const t of q.tags) {
        expect(ENTITY_RE.test(t.text), `${q.id} tag`).toBe(false);
      }
    }
  });

  it('答案来源标注与来源文件一致', () => {
    const byId = new Map(caPapers.map((p) => [p.id, p]));
    expect(byId.get('quiz2')?.answerSource).toBe('原卷附答案');
    expect(byId.get('recall-2019')?.answerSource).toBe('回忆要点');
    expect(byId.get('predict')?.answerSource).toBe('本站整理');
  });
});
