/**
 * 人工智能原理课程内容完整性测试：
 * 课件为 0（跳过课件整理），仅一份设计报告题库 —— 锁定方向结构 / 题量 / id / 标签指向 / 实体检查
 */
import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import PracticeCard from '../components/practice/PracticeCard';
import { aiPaper, aiAllQuestions } from '../content/ai';

const ENTITY_RE = /&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/;

/** 各方向的题量契约（与原文档一致：启发式搜索 4 / 对抗搜索 2 / 演化计算 5 / 神经网络 3 / 强化学习 1） */
const EXPECT_SECTION_COUNTS: Record<string, number> = {
  'dir-1': 4,
  'dir-2': 2,
  'dir-3': 5,
  'dir-4': 3,
  'dir-5': 1,
};

describe('人工智能原理设计报告题库', () => {
  it('唯一一份试卷：15 题、5 个方向，方向 id 与题量符合契约', () => {
    expect(aiPaper.id).toBe('bank-2023');
    expect(aiPaper.sections.length).toBe(5);
    expect(aiAllQuestions.length).toBe(15);
    for (const sec of aiPaper.sections) {
      expect(sec.id, sec.id).toMatch(/^dir-[1-5]$/);
      expect(sec.no, sec.id).toBe(Number(sec.id.slice(4)));
      expect(sec.questionIds.length, sec.id).toBe(EXPECT_SECTION_COUNTS[sec.id]);
    }
  });

  it('分组引用恰好覆盖全部题目且不重复', () => {
    const grouped = aiPaper.sections.flatMap((s) => s.questionIds);
    expect(new Set(grouped).size).toBe(grouped.length);
    expect([...grouped].sort()).toEqual([...aiPaper.questions.map((q) => q.id)].sort());
  });

  it('题目 id 全库唯一且形如 p1-e{序号}（设计题全部为 essay）', () => {
    const ids = aiAllQuestions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const q of aiAllQuestions) {
      expect(q.kind).toBe('essay');
      expect(q.id, q.id).toMatch(/^p1-e\d+$/);
    }
    // 序号 1~15 连续
    const nums = ids.map((id) => Number(id.slice(4))).sort((a, b) => a - b);
    expect(nums).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
  });

  it('字段完整：题干/答案/解析非空，设计题不带选项', () => {
    for (const q of aiAllQuestions) {
      expect(q.question.length, q.id).toBeGreaterThan(20);
      expect(q.answer.length, q.id).toBeGreaterThan(20);
      expect(q.explanation.length, q.id).toBeGreaterThan(20);
      expect(q.options, `${q.id} 设计题不应有选项`).toBeUndefined();
    }
  });

  it('知识点标签指向真实存在的方向（deck 1~5 且 sec 对应），文本无实体', () => {
    for (const q of aiAllQuestions) {
      expect(q.tags.length, `${q.id} 标签`).toBeGreaterThan(0);
      for (const t of q.tags) {
        expect(t.deck, q.id).toBeGreaterThanOrEqual(1);
        expect(t.deck, q.id).toBeLessThanOrEqual(5);
        expect(t.sec, `${q.id} → ${t.sec}`).toBe(`dir-${t.deck}`);
        const sec = aiPaper.sections.find((x) => x.no === t.deck);
        expect(sec, `${q.id} 方向不存在`).toBeTruthy();
        expect(t.text.length, q.id).toBeGreaterThan(0);
        expect(ENTITY_RE.test(t.text), `${q.id} 标签文本残留实体`).toBe(false);
      }
    }
  });

  it('知识点覆盖 5 个方向（没有落单的方向）', () => {
    const covered = new Set(aiAllQuestions.flatMap((q) => q.tags.map((t) => t.deck)));
    for (let d = 1; d <= 5; d++) {
      expect(covered.has(d), `dir-${d} 无题目覆盖`).toBe(true);
    }
  });

  it('纯文本渲染字段（试卷标题 / 方向名）不残留 HTML 实体', () => {
    const plain: string[] = [aiPaper.title, ...aiPaper.sections.map((s) => s.title)];
    expect(plain.filter((v) => ENTITY_RE.test(v))).toEqual([]);
  });

  it('渲染后的可见文本不出现字面实体（端到端，含方向背景与题卡）', () => {
    const html = renderToStaticMarkup(
      createElement(
        MemoryRouter,
        null,
        createElement('div', null, [
          createElement('div', { key: 'intro', dangerouslySetInnerHTML: { __html: aiPaper.intro } }),
          ...aiPaper.sections.map((sec) =>
            createElement('div', {
              key: sec.id,
              dangerouslySetInnerHTML: { __html: sec.brief || sec.title },
            }),
          ),
          ...aiAllQuestions.map((q) =>
            createElement(PracticeCard, {
              key: q.id,
              quiz: q,
              label: q.id,
              onResult: () => undefined,
            }),
          ),
        ]),
      ),
    );
    const div = document.createElement('div');
    div.innerHTML = html;
    // html 块里的合法实体渲染为可见字符，不算残留；只有双重转义才会露出
    expect(ENTITY_RE.test(div.textContent ?? '')).toBe(false);
  });

  it('方向背景与题目内容紧扣原文档：关键事实抽查', () => {
    // 估价函数一般形式
    const d1 = aiPaper.sections[0].brief;
    expect(d1).toContain('f(n) = g(n) + h(n)');
    expect(d1).toContain('所有 A* 算法都是可采纳的');
    // 遗传算法运行参数与算术交叉公式
    const d3 = aiPaper.sections[2].brief;
    expect(d3).toContain('P1′ = λP1 + (1−λ)P2');
    expect(d3).toContain('《Adaptation in Natural and Artificial Systems》');
    // 题目 7/8/9/12/15 的关键数字与公式
    const byId = (id: string) => aiAllQuestions.find((q) => q.id === id)!;
    expect(byId('p1-e7').question).toContain('x*sin(10π+x) + 1.0');
    expect(byId('p1-e7').question).toContain('区间 [−1, 2]');
    expect(byId('p1-e8').question).toContain('6.452(x + 0.125y)');
    expect(byId('p1-e8').question).toContain('3.226y');
    expect(byId('p1-e9').question).toContain('Rastrigin');
    expect(byId('p1-e9').question).toContain('20 + x');
    expect(byId('p1-e12').question).toContain('Hopfield');
    expect(byId('p1-e12').question).toContain('15 个城市和 20 个城市');
    expect(byId('p1-e15').question).toContain('4×4');
    expect(byId('p1-e15').question).toContain('决策 ε 的大小');
    // 迷宫初始布局
    expect(byId('p1-e15').question).toContain('O _ _ _');
    expect(byId('p1-e15').question).toContain('_ P _ P');
    expect(byId('p1-e15').question).toContain('_ _ P _');
    expect(byId('p1-e15').question).toContain('_ _ _ T');
  });
});
