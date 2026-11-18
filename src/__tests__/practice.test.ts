/**
 * 在线练习题库完整性测试：
 * 题量与题型分布 / 字段完整 / 答案格式 / 标签指向真实存在的讲次 section / id 唯一 / 纯文本字段无实体
 */
import { describe, expect, it } from 'vitest';
import { practiceQuestions } from '../content/practice';
import { decks } from '../content';
import type { PracticeKind } from '../content/practice/types';

const ENTITY_RE = /&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/;

const EXPECT_COUNT: Record<PracticeKind, number> = {
  single: 100,
  multi: 100,
  judge: 100,
  fill: 100,
  essay: 20,
};

/** 每个讲次的题目覆盖量下限（标签口径，一题可挂多讲） */
const MIN_PER_DECK = 3;

describe('在线练习题库完整性', () => {
  it('题量：单选/多选/判断/填空各 100，简答题 20', () => {
    for (const kind of ['single', 'multi', 'judge', 'fill', 'essay'] as PracticeKind[]) {
      const n = practiceQuestions.filter((q) => q.kind === kind).length;
      expect(n, kind).toBe(EXPECT_COUNT[kind]);
    }
    expect(practiceQuestions.length).toBe(420);
  });

  it('id 唯一且与题型前缀一致', () => {
    const ids = practiceQuestions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    const prefix: Record<PracticeKind, string> = {
      single: 's',
      multi: 'm',
      judge: 'j',
      fill: 'f',
      essay: 'e',
    };
    for (const q of practiceQuestions) {
      expect(q.id, q.id).toMatch(new RegExp(`^${prefix[q.kind]}\\d+$`));
    }
  });

  it('字段完整：题干/答案/解析非空，标签 ≥1，选项数合理', () => {
    for (const q of practiceQuestions) {
      expect(q.question.length, q.id).toBeGreaterThan(5);
      expect(q.answer.length, q.id).toBeGreaterThan(0);
      expect(q.explanation.length, q.id).toBeGreaterThan(5);
      expect(q.tags.length, `${q.id} 标签`).toBeGreaterThan(0);
      if (q.kind === 'fill' || q.kind === 'essay') {
        expect(q.options, `${q.id} 不应有选项`).toBeUndefined();
      } else {
        expect((q.options ?? []).length, `${q.id} 选项数`).toBeGreaterThanOrEqual(2);
        expect((q.options ?? []).length, `${q.id} 选项数`).toBeLessThanOrEqual(6);
        expect(q.answer, q.id).not.toMatch(/&/); // 答案按纯文本渲染
      }
    }
  });

  it('答案格式符合题型约定', () => {
    for (const q of practiceQuestions) {
      if (q.kind === 'single') expect(q.answer, q.id).toMatch(/^[A-F]$/);
      if (q.kind === 'multi') expect(q.answer, q.id).toMatch(/^[A-F](、[A-F])+$/);
      if (q.kind === 'judge') expect(['对', '错']).toContain(q.answer);
      if (q.kind === 'multi') {
        // 多选题的选项数要 ≥ 正确项数（「全选」型的特征列举题允许全部正确）
        const n = q.answer.split('、').length;
        expect((q.options ?? []).length, q.id).toBeGreaterThanOrEqual(n);
      }
      if (q.kind === 'single') {
        // 单选题的选项数要 ≥ 答案序号
        const idx = 'ABCDEF'.indexOf(q.answer);
        expect((q.options ?? []).length, q.id).toBeGreaterThan(idx);
      }
    }
  });

  it('标签指向真实存在的讲次与 section（点击可跳转）', () => {
    for (const q of practiceQuestions) {
      for (const t of q.tags) {
        expect(t.deck, q.id).toBeGreaterThanOrEqual(1);
        expect(t.deck, q.id).toBeLessThanOrEqual(8);
        const deck = decks[t.deck - 1];
        const hit = deck.toc.find((e) => e.id === t.sec);
        expect(hit, `${q.id} → deck${t.deck}/${t.sec} 不存在`).toBeDefined();
        expect(t.text.length, q.id).toBeGreaterThan(0);
        expect(ENTITY_RE.test(t.text), `${q.id} 标签文本残留实体`).toBe(false);
      }
    }
  });

  it('知识点覆盖 8 个讲次（没有落单的讲次）', () => {
    const covered = new Set(practiceQuestions.flatMap((q) => q.tags.map((t) => t.deck)));
    for (let d = 1; d <= 8; d++) {
      expect(covered.has(d), `第 ${d} 讲无题目覆盖`).toBe(true);
      const n = practiceQuestions.filter((q) => q.tags.some((t) => t.deck === d)).length;
      expect(n, `第 ${d} 讲覆盖题数`).toBeGreaterThanOrEqual(MIN_PER_DECK);
    }
  });

  it('纯文本字段（标签）与判分答案不残留 HTML 实体', () => {
    for (const q of practiceQuestions) {
      for (const t of q.tags) {
        expect(ENTITY_RE.test(t.text), `${q.id} tag`).toBe(false);
      }
    }
  });

  it('每题解析都给出实质理由（长度与题干脱钩的最小要求）', () => {
    for (const q of practiceQuestions) {
      expect(q.explanation.length, `${q.id} 解析过短`).toBeGreaterThan(20);
    }
  });
});
