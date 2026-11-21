/**
 * 自然语言理解课程内容完整性测试：
 * 讲次结构（课件《分词系统讲解》1 讲）/ 目录与 section 对齐 / 纯文本与渲染文本实体检查 / 关键事实抽查
 * （试题未收录，无在线练习数据契约。）
 */
import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import Sections from '../components/Sections';
import { nluDecks } from '../content/nlu';

/** 残留实体：只查已知 HTML 实体名与数字实体 */
const ENTITY_RE = /&(#x?[0-9a-fA-F]+|amp|lt|gt|quot|apos|nbsp);/i;

describe('自然语言理解课件内容', () => {
  it('共 1 讲（《分词系统讲解》），id 符合约定', () => {
    expect(nluDecks.map((d) => d.id)).toEqual(['nlu1']);
    expect(nluDecks[0].no).toBe('第1讲');
    const d = nluDecks[0];
    expect(d.sections.length).toBe(8);
    expect(d.toc.length).toBe(8);
    for (const s of d.sections) {
      expect(s.blocks.length, s.id).toBeGreaterThan(0);
      const l2 = d.toc.filter((t) => t.level === 2 && t.text === s.heading);
      if (s.heading && d.toc.some((t) => t.text === s.heading)) {
        expect(l2.length, `${s.id} 目录对齐`).toBeGreaterThan(0);
      }
    }
  });

  it('纯文本渲染字段（标题 / 目录 / heading）不残留 HTML 实体', () => {
    const plain: string[] = [];
    for (const d of nluDecks) {
      plain.push(d.title, d.subtitle);
      for (const t of d.toc) plain.push(t.text);
      for (const s of d.sections) plain.push(s.heading);
    }
    expect(plain.filter((v) => ENTITY_RE.test(v))).toEqual([]);
  });

  it('讲次页渲染后的可见文本不出现字面实体（端到端）', () => {
    for (const d of nluDecks) {
      const html = renderToStaticMarkup(
        createElement(MemoryRouter, null, createElement(Sections, { sections: d.sections })),
      );
      const div = document.createElement('div');
      div.innerHTML = html;
      expect(ENTITY_RE.test(div.textContent ?? ''), '渲染文本残留实体').toBe(false);
    }
  });

  it('关键事实抽查：课件核心内容逐节在场', () => {
    const text = nluDecks[0].sections.map((s) => s.blocks.map((b) => (b.type === 'html' ? b.html : '')).join('')).join('');
    // 摘要
    expect(text).toContain('机器翻译、情感分析、语音识别');
    expect(text).toContain('文本预处理的一部分');
    // 挑战（四块齐全）
    expect(text).toContain('多音字和歧义词');
    expect(text).toContain('未登录词（字典外词）');
    expect(text).toContain('基于规则的分词');
    expect(text).toContain('混合方法');
    // FMM 步骤 ⑴-⑷ + 优点/局限
    expect(text).toContain('Forward Maximum Matching');
    expect(text).toContain('去掉这个词的最右一个字');
    expect(text).toContain('简单快速，适合处理较短的文本');
    expect(text).toContain('容易产生过分分割');
    // BMM
    expect(text).toContain('Backward Maximum Matching');
    expect(text).toContain('去掉这个词的最左一个字');
    // 对比三组
    expect(text).toContain('FMM 从左到右匹配，BMM 从右到左匹配');
    expect(text).toContain('BMM 虽然稍慢');
    // 系统实现三部分
    expect(text).toContain('输入处理、分词处理和结果输出');
    // 案例『研究生命起源』+ 评估指标
    expect(text).toContain('研究生命起源');
    expect(text).toContain('研究生 / 命 / 起源');
    expect(text).toContain('研究 / 生命 / 起源');
    expect(text).toContain('准确率和召回率的综合评价指标');
    // 未来展望三条
    expect(text).toContain('深度学习的应用');
    expect(text).toContain('结合算法');
    expect(text).toContain('智能搜索');
    expect(text).toContain('社交媒体分析');
  });
});
