/**
 * 计算机网络课程内容完整性测试：
 * 章节结构 / 目录与 section 对齐 / 试卷题库字段与答案格式 / 标签指向真实存在的章内位置 / id 唯一 / 纯文本字段无实体
 */
import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import Sections from '../components/Sections';
import { netChapters, netPapers, netAllQuestions } from '../content/net';
import { netHomework } from '../content/net/homework';
import type { PracticeKind } from '../content/practice/types';

const ENTITY_RE = /&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/;

/** 章节结构契约：8 个章，各章 section 数 */
const EXPECT_SECTIONS: Record<string, number> = {
  ch1: 7,
  ch2: 5,
  ch3: 7,
  ch4: 5,
  ch5: 4,
  ch6: 7,
  ch7: 7,
  ch8: 4,
};

/** 试卷题量契约（与原始卷对齐） */
const EXPECT_PAPER_COUNT: Record<string, number> = {
  'paper-2021': 27,
  'paper-2022': 45,
  'paper-2024': 29,
};

describe('计算机网络课件内容', () => {
  it('共 8 个章，id/no 符合约定', () => {
    expect(netChapters.length).toBe(8);
    netChapters.forEach((c, i) => {
      expect(c.id).toBe(`ch${i + 1}`);
    });
    expect(netChapters[0].no).toBe('第1章');
    expect(netChapters[7].no).toBe('第8章');
  });

  it('各章 section 数与契约一致，目录项与 section id 对齐', () => {
    for (const c of netChapters) {
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
    for (const c of netChapters) {
      plain.push(c.title, c.subtitle);
      for (const t of c.toc) plain.push(t.text);
      for (const s of c.sections) plain.push(s.heading);
    }
    expect(plain.filter((v) => ENTITY_RE.test(v))).toEqual([]);
  });

  it('章节页渲染后的可见文本不出现字面实体（端到端）', () => {
    for (const c of netChapters) {
      const html = renderToStaticMarkup(
        createElement(MemoryRouter, null, createElement(Sections, { sections: c.sections })),
      );
      // 用 DOM 解码后再查：html 块里的合法实体（如 &lt;）渲染为可见字符，不算残留；只有双重转义才会露出
      const div = document.createElement('div');
      div.innerHTML = html;
      expect(ENTITY_RE.test(div.textContent ?? ''), `${c.id} 渲染文本残留实体`).toBe(false);
    }
  });

  it('总目录页可渲染（sections 非空）', () => {
    const html = renderToStaticMarkup(
      createElement(MemoryRouter, null, createElement(Sections, { sections: netPapers.length ? netChapters[0].sections : [] })),
    );
    expect(html.length).toBeGreaterThan(0);
  });
});

describe('计算机网络试卷题库', () => {
  it('共 3 份试卷，各卷题量与原始卷对齐', () => {
    expect(netPapers.length).toBe(3);
    for (const p of netPapers) {
      expect(p.questions.length, p.id).toBe(EXPECT_PAPER_COUNT[p.id]);
      // 分组引用的题号必须都存在且恰好覆盖全卷
      const grouped = p.sections.flatMap((s) => s.questionIds);
      expect(new Set(grouped).size, `${p.id} 分组去重`).toBe(grouped.length);
      expect([...grouped].sort(), `${p.id} 分组覆盖`).toEqual([...p.questions.map((q) => q.id)].sort());
    }
  });

  it('题目 id 全库唯一且形如 p{卷}-{题型}{序号}', () => {
    const ids = netAllQuestions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const q of netAllQuestions) {
      const kind: Record<PracticeKind, string> = { single: 's', multi: 'm', judge: 'j', fill: 'f', essay: 'e' };
      expect(q.id, q.id).toMatch(new RegExp(`^p\\d-${kind[q.kind]}\\d+$`));
    }
  });

  it('字段完整：题干/答案/解析非空，标签 ≥1，选项数合理', () => {
    for (const q of netAllQuestions) {
      expect(q.question.length, q.id).toBeGreaterThan(5);
      expect(q.answer.length, q.id).toBeGreaterThan(0);
      expect(q.explanation.length, q.id).toBeGreaterThan(5);
      expect(q.tags.length, `${q.id} 标签`).toBeGreaterThan(0);
      if (q.kind === 'fill' || q.kind === 'essay') {
        expect(q.options, `${q.id} 不应有选项`).toBeUndefined();
      } else {
        expect((q.options ?? []).length, `${q.id} 选项数`).toBeGreaterThanOrEqual(2);
        expect(q.answer, q.id).not.toMatch(/&/); // 答案按纯文本渲染
      }
    }
  });

  it('答案格式符合题型约定', () => {
    for (const q of netAllQuestions) {
      if (q.kind === 'single') {
        expect(q.answer, q.id).toMatch(/^[A-F]$/);
        const idx = 'ABCDEF'.indexOf(q.answer);
        expect((q.options ?? []).length, q.id).toBeGreaterThan(idx);
      }
      if (q.kind === 'fill') {
        // 填空答案用「｜」分隔可接受写法，判分按归一化比对
        expect(q.answer.length, q.id).toBeGreaterThan(0);
      }
    }
  });

  it('知识点标签指向真实存在的章与 section（点击可跳转）', () => {
    for (const q of netAllQuestions) {
      for (const t of q.tags) {
        expect(t.deck, q.id).toBeGreaterThanOrEqual(1);
        expect(t.deck, q.id).toBeLessThanOrEqual(8);
        const chapter = netChapters[t.deck - 1];
        const hit = chapter.toc.find((e) => e.id === t.sec) ?? chapter.sections.some((s) => s.id === t.sec);
        expect(hit, `${q.id} → ch${t.deck}/${t.sec} 不存在`).toBeTruthy();
        expect(t.text.length, q.id).toBeGreaterThan(0);
        expect(ENTITY_RE.test(t.text), `${q.id} 标签文本残留实体`).toBe(false);
      }
    }
  });

  it('知识点覆盖 8 个章（没有落单的章）', () => {
    const covered = new Set(netAllQuestions.flatMap((q) => q.tags.map((t) => t.deck)));
    for (let c = 1; c <= 8; c++) {
      expect(covered.has(c), `ch${c} 无题目覆盖`).toBe(true);
    }
  });

  it('每题解析都给出实质理由（长度与题干脱钩的最小要求）', () => {
    for (const q of netAllQuestions) {
      expect(q.explanation.length, `${q.id} 解析过短`).toBeGreaterThan(20);
    }
  });
});

describe('2025版计网作业与知识点跳转', () => {
  it('八章共54道来源作业，未虚构第八章作业', () => {
    const counts = [6, 3, 2, 7, 11, 16, 9, 0];
    counts.forEach((count, i) => expect(netHomework[i + 1].length).toBe(count));
    expect(counts.reduce((sum, n) => sum + n, 0)).toBe(54);
  });
  it('每题均有同章知识点锚点和独立题号锚点', () => {
    netChapters.forEach((chapter, i) => {
      const n = i + 1;
      const anchors = new Set(chapter.toc.map((entry) => entry.id));
      expect(anchors.has(`sec-ch${n}-homework`)).toBe(true);
      for (const q of netHomework[n]) {
        expect(anchors.has(q.related), q.title).toBe(true);
        expect(anchors.has(`sec-ch${n}-hw-${q.no}`), q.title).toBe(true);
        expect(q.reference.length, q.title).toBeGreaterThan(70);
      }
    });
  });
  it('第五章承接旧版中的局域网节，第4章不重复', () => {
    expect(netChapters[3].sections.every((section) => !/broadcast|evolve/.test(section.id))).toBe(true);
    expect(netChapters[4].sections.some((section) => section.id === 'sec-ch5-broadcast')).toBe(true);
    expect(netChapters[4].sections.some((section) => section.id === 'sec-ch5-evolve')).toBe(true);
  });
});
