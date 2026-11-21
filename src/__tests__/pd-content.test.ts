/**
 * 程序设计基础课程内容完整性测试：
 * 章节结构（第 1～9、11、12 章）/ 目录与 section 对齐 / 纯文本与渲染文本实体检查 / 关键事实抽查
 * （试题未收录，无在线练习数据契约。）
 */
import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import Sections from '../components/Sections';
import { pdChapters, pdHome } from '../content/pd';

/** 残留实体：只查已知 HTML 实体名与数字实体 —— 双重转义只会露出这些；C 代码里合法的 &a; / &wang; 不是实体 */
const ENTITY_RE = /&(#x?[0-9a-fA-F]+|amp|lt|gt|quot|apos|nbsp);/i;

/** 章节结构契约：id 与 section 数 */
const EXPECT_SECTIONS: Record<string, number> = {
  ch1: 8,
  ch2: 7,
  ch3: 6,
  ch4: 8,
  ch5: 5,
  ch6: 10,
  ch7: 5,
  ch8: 4,
  ch9: 6,
  ch11: 3,
  ch12: 10,
};

describe('程序设计基础课件内容', () => {
  it('共 11 章（第 1～9、11、12 章，课件无第 10 章），id 符合约定', () => {
    expect(pdChapters.map((c) => c.id)).toEqual([
      'ch1', 'ch2', 'ch3', 'ch4', 'ch5', 'ch6', 'ch7', 'ch8', 'ch9', 'ch11', 'ch12',
    ]);
    expect(pdChapters[0].no).toBe('第1章');
    expect(pdChapters[8].no).toBe('第9章');
    expect(pdChapters[9].no).toBe('第11章');
    expect(pdChapters[10].no).toBe('第12章');
    for (const c of pdChapters) {
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
      createElement(MemoryRouter, null, createElement(Sections, { sections: pdHome.sections })),
    );
    expect(html.length).toBeGreaterThan(0);
  });

  it('纯文本渲染字段（标题 / 目录 / heading）不残留 HTML 实体', () => {
    const plain: string[] = [pdHome.title, pdHome.subtitle];
    for (const c of pdChapters) {
      plain.push(c.title, c.subtitle);
      for (const t of c.toc) plain.push(t.text);
      for (const s of c.sections) plain.push(s.heading);
    }
    expect(plain.filter((v) => ENTITY_RE.test(v))).toEqual([]);
  });

  it('章节页渲染后的可见文本不出现字面实体（端到端）', () => {
    for (const c of pdChapters) {
      const html = renderToStaticMarkup(
        createElement(MemoryRouter, null, createElement(Sections, { sections: c.sections })),
      );
      // 用 DOM 解码后再查：html 块里的合法实体（如 &lt;）渲染为可见字符，不算残留；只有双重转义才会露出
      const div = document.createElement('div');
      div.innerHTML = html;
      expect(ENTITY_RE.test(div.textContent ?? ''), `${c.id} 渲染文本残留实体`).toBe(false);
    }
  });

  it('关键事实抽查：课件核心内容逐章在场', () => {
    const text = (c: string) => {
      const ch = pdChapters.find((d) => d.id === c)!;
      return ch.sections.map((s) => s.blocks.map((b) => (b.type === 'html' ? b.html : '')).join('')).join('');
    };
    // ch1 保留字 32 个 / 标识符规则
    expect(text('ch1')).toContain('auto、break、case');
    expect(text('ch1')).toContain('长度不超过');
    // ch2 转义字符 / scanf 不能规定精度
    expect(text('ch2')).toContain('\\n');
    expect(text('ch2')).toContain('不能规定精度');
    // ch3 优先级总表 15 级 / else 与最近 if 匹配 / 迭代三要素
    expect(text('ch3')).toContain('优先级总表');
    expect(text('ch3')).toContain('else 与最近的 if 相匹配');
    expect(text('ch3')).toContain('迭代公式');
    // ch4 冒泡/选择排序、折半查找、strcmp 表
    expect(text('ch4')).toContain('冒泡排序');
    expect(text('ch4')).toContain('选择排序保证每轮排序只有一次交换');
    expect(text('ch4')).toContain('折半查找');
    expect(text('ch4')).toContain('strcmp');
    // ch5 指针运算 / 二维数组两级管理
    expect(text('ch5')).toContain('sizeof(*p)');
    expect(text('ch5')).toContain('两级管理');
    // ch6 四种存储类型 / 递归 / 宏
    expect(text('ch6')).toContain('register');
    expect(text('ch6')).toContain('lfac');
    expect(text('ch6')).toContain('#undef');
    // ch7 malloc / 链表五操作 / 联合
    expect(text('ch7')).toContain('calloc');
    expect(text('ch7')).toContain('引用自身的结构');
    expect(text('ch7')).toContain('typedef');
    // ch8 补码 / 真值表 / 位段
    expect(text('ch8')).toContain('补码');
    expect(text('ch8')).toContain('逻辑右移');
    expect(text('ch8')).toContain('位段');
    // ch9 fopen 12 种读写方式 / fseek 常量
    expect(text('ch9')).toContain('"ab+"');
    expect(text('ch9')).toContain('SEEK_CUR');
    // ch11 操纵符 / 重载 / string
    expect(text('ch11')).toContain('setw');
    expect(text('ch11')).toContain('GetArea');
    expect(text('ch11')).toContain('substr');
    // ch12 构造析构 / 虚函数 / 运算符重载 / 模板
    expect(text('ch12')).toContain('拷贝构造');
    expect(text('ch12')).toContain('virtual');
    expect(text('ch12')).toContain('operator');
    expect(text('ch12')).toContain('template');
  });
});
