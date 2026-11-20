/**
 * 软件体系结构课程内容完整性测试：
 * 章节结构（第4/5/7章 + RSA 专题）/ 目录与 section 对齐 / 课件内嵌自测题 / 纯文本与渲染文本实体检查 / 关键事实抽查
 * （试题未收录，无在线练习数据契约。）
 */
import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import Sections from '../components/Sections';
import { saChapters, saHome } from '../content/sa';

const ENTITY_RE = /&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/;

/** 章节结构契约：id 与 section 数 */
const EXPECT_SECTIONS: Record<string, number> = {
  ch4: 7,
  ch5: 6,
  ch7: 5,
  rsa: 9,
};

describe('软件体系结构课件内容', () => {
  it('共 4 个讲次（第4/5/7章 + RSA 专题），id 符合约定', () => {
    expect(saChapters.map((c) => c.id)).toEqual(['ch4', 'ch5', 'ch7', 'rsa']);
    expect(saChapters[0].no).toBe('第4章');
    expect(saChapters[2].no).toBe('第7章');
    expect(saChapters[3].no).toBe('专题');
    for (const c of saChapters) {
      expect(c.sections.length, c.id).toBe(EXPECT_SECTIONS[c.id]);
      expect(c.toc.length, `${c.id} toc`).toBeGreaterThan(0);
      for (const s of c.sections) {
        expect(s.blocks.length, `${c.id}/${s.id}`).toBeGreaterThan(0);
        const l2 = c.toc.filter((t) => t.level === 2 && t.text === s.heading);
        if (s.heading && c.toc.some((t) => t.text === s.heading)) {
          expect(l2.length, `${c.id}/${s.id} 目录对齐`).toBeGreaterThan(0);
        }
      }
    }
  });

  it('总目录可渲染（sections 非空）', () => {
    const html = renderToStaticMarkup(
      createElement(MemoryRouter, null, createElement(Sections, { sections: saHome.sections })),
    );
    expect(html.length).toBeGreaterThan(0);
  });

  it('纯文本渲染字段（标题 / 目录 / heading）不残留 HTML 实体', () => {
    const plain: string[] = [saHome.title, saHome.subtitle];
    for (const c of saChapters) {
      plain.push(c.title, c.subtitle);
      for (const t of c.toc) plain.push(t.text);
      for (const s of c.sections) plain.push(s.heading);
    }
    expect(plain.filter((v) => ENTITY_RE.test(v))).toEqual([]);
  });

  it('章节页渲染后的可见文本不出现字面实体（端到端）', () => {
    for (const c of saChapters) {
      const html = renderToStaticMarkup(
        createElement(MemoryRouter, null, createElement(Sections, { sections: c.sections })),
      );
      // 用 DOM 解码后再查：html 块里的合法实体（如 &lt;）渲染为可见字符，不算残留；只有双重转义才会露出
      const div = document.createElement('div');
      div.innerHTML = html;
      expect(ENTITY_RE.test(div.textContent ?? ''), `${c.id} 渲染文本残留实体`).toBe(false);
    }
  });

  it('课件内嵌自测题收录为 quiz 块：题量、题型与答案格式', () => {
    const quizzes = saChapters.flatMap((c) =>
      c.sections.flatMap((s) => s.blocks.filter((b) => b.type === 'quiz').map((b) => ({ chapter: c.id, quiz: b.quiz }))),
    );
    // 课件原卷内嵌自测题共 7 道（第4章 1 + 第5章 4 + 第7章 2）
    expect(quizzes.length).toBe(7);
    expect(quizzes.filter((q) => q.chapter === 'ch4').length).toBe(1);
    expect(quizzes.filter((q) => q.chapter === 'ch5').length).toBe(4);
    expect(quizzes.filter((q) => q.chapter === 'ch7').length).toBe(2);
    for (const q of quizzes) {
      expect(q.quiz.kind, `${q.chapter} 题型`).toBe('single');
      expect(q.quiz.options?.length, `${q.chapter} 选项数`).toBe(4);
      expect(q.quiz.answer, `${q.chapter} 答案`).toMatch(/^[A-D]$/);
      expect(q.quiz.explanation.length, `${q.chapter} 解析`).toBeGreaterThan(20);
    }
  });

  it('关键事实抽查：内容紧扣课件', () => {
    const flat = (id: string) =>
      saChapters
        .find((c) => c.id === id)!
        .sections.map((s) => s.blocks.map((b) => (b.type === 'html' ? b.html : b.type === 'quiz' ? b.quiz.question : '')).join(''))
        .join('');
    const ch4 = flat('ch4');
    const ch5 = flat('ch5');
    const ch7 = flat('ch7');
    const rsa = flat('rsa');
    // 第4章：IEEE 1471、Medvidovic、ADL 三要素、ACME 七实体、Wright 的 CSP、UniCon、Darwin ∏演算、C2
    expect(ch4).toContain('IEEE 于 2000 年 9 月 21 日通过了');
    expect(ch4).toContain('构件、连接件、系统（构件和连接件的配置）、端口、角色、表述');
    expect(ch4).toContain('ACME 提供 7 种实体');
    expect(ch4).toContain('通信顺序过程');
    expect(ch4).toContain('UNIversal CONnection');
    expect(ch4).toContain('∏ 演算');
    expect(ch4).toContain('top 和 bottom');
    expect(ch4).toContain('卡耐基梅隆大学的 Robert Allen 和 David Garlan');
    // 第5章：Alexander、GoF 23、MVC、四基本成分、23 模式目录、五种设计方法、六阶段
    expect(ch5).toContain('Gang of Four');
    expect(ch5).toContain('A pattern is a solution to a problem in a context');
    expect(ch5).toContain('模型（Model）');
    expect(ch5).toContain('模式名称、问题、解决方案、效果');
    expect(ch5).toContain('Singleton（单件）');
    expect(ch5).toContain('DSSA 方法的基本工件');
    expect(ch5).toContain('5.3.6 体系结构演化');
    // 第7章：质量属性、敏感点/权衡点、刺激/环境/响应、ATAM 九步、SAAM 六步
    expect(ch7).toContain('平均失效等待时间（MTTF）');
    expect(ch7).toContain('是多个质量属性的敏感点');
    expect(ch7).toContain('Architecture Tradeoff Analysis Method');
    expect(ch7).toContain('每个风险承担者分配相当于总场景数的 30% 的选票');
    expect(ch7).toContain('直接场景');
    expect(ch7).toContain('SAAMTool');
    // RSA：UML 13 种图、六种关系、EasyLibrary、RUP 四阶段
    expect(rsa).toContain('UML 2.1 提供了 13 种图');
    expect(rsa).toContain('EasyLibrary');
    expect(rsa).toContain('替换原理');
    expect(rsa).toContain('初始阶段、细化阶段、构造阶段、发布阶段');
  });

  it('题量与课件页数对齐：各讲 code/quiz 块分布合理', () => {
    const count = (id: string) => {
      const c = saChapters.find((x) => x.id === id)!;
      let code = 0;
      let quiz = 0;
      for (const s of c.sections) {
        for (const b of s.blocks) {
          if (b.type === 'quiz') quiz++;
          if (b.type === 'html') {
            code += b.html.split('<pre class="code">').length - 1;
          }
        }
      }
      return { code, quiz };
    };
    // 第4章 ADL 语法丰富：ACME/Wright/UniCon/Darwin/C2 都有代码
    expect(count('ch4').code).toBeGreaterThanOrEqual(10);
    expect(count('ch4').quiz).toBe(1);
    // 第5章 模式详解含抽象工厂 C++ 代码
    expect(count('ch5').code).toBeGreaterThanOrEqual(1);
    // 第7章 无代码块
    expect(count('ch7').code).toBe(0);
  });
});
