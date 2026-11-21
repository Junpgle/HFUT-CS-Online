/**
 * 系统硬件综合设计课程内容完整性测试：
 * 讲次结构（4 讲）/ 目录与 section 对齐 / 纯文本与渲染文本实体检查 / 关键事实抽查
 * （试题未收录，无在线练习数据契约。）
 */
import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import Sections from '../components/Sections';
import { hdUnits, hdHome } from '../content/hd';

/** 残留实体：只查已知 HTML 实体名与数字实体 —— 双重转义只会露出这些；verilog 代码里合法的 &a; 不是实体 */
const ENTITY_RE = /&(#x?[0-9a-fA-F]+|amp|lt|gt|quot|apos|nbsp);/i;

/** 讲次结构契约：id 与 section 数 */
const EXPECT_SECTIONS: Record<string, number> = {
  hd1: 8,
  hd2: 12,
  hd3: 5,
  hd4: 6,
};

describe('系统硬件综合设计课件内容', () => {
  it('共 4 讲，id 符合约定', () => {
    expect(hdUnits.map((c) => c.id)).toEqual(['hd1', 'hd2', 'hd3', 'hd4']);
    expect(hdUnits.map((c) => c.no)).toEqual(['第1讲', '第2讲', '第3讲', '第4讲']);
    for (const c of hdUnits) {
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
      createElement(MemoryRouter, null, createElement(Sections, { sections: hdHome.sections })),
    );
    expect(html.length).toBeGreaterThan(0);
  });

  it('纯文本渲染字段（标题 / 目录 / heading）不残留 HTML 实体', () => {
    const plain: string[] = [hdHome.title, hdHome.subtitle];
    for (const c of hdUnits) {
      plain.push(c.title, c.subtitle);
      for (const t of c.toc) plain.push(t.text);
      for (const s of c.sections) plain.push(s.heading);
    }
    expect(plain.filter((v) => ENTITY_RE.test(v))).toEqual([]);
  });

  it('讲次页渲染后的可见文本不出现字面实体（端到端）', () => {
    for (const c of hdUnits) {
      const html = renderToStaticMarkup(
        createElement(MemoryRouter, null, createElement(Sections, { sections: c.sections })),
      );
      // 用 DOM 解码后再查：html 块里的合法实体（如 &lt;）渲染为可见字符，不算残留；只有双重转义才会露出
      const div = document.createElement('div');
      div.innerHTML = html;
      expect(ENTITY_RE.test(div.textContent ?? ''), `${c.id} 渲染文本残留实体`).toBe(false);
    }
  });

  it('关键事实抽查：课件核心内容逐讲在场', () => {
    const text = (c: string) => {
      const unit = hdUnits.find((d) => d.id === c)!;
      return unit.sections.map((s) => s.blocks.map((b) => (b.type === 'html' ? b.html : '')).join('')).join('');
    };
    // hd1 RISC-V 37 条 / 总体三部分 / 冒险处理
    expect(text('hd1')).toContain('第五代指令集架构');
    expect(text('hd1')).toContain('设计指令条数为 37 条');
    expect(text('hd1')).toContain('数据存储器、指令存储器、risc-vCPU');
    expect(text('hd1')).toContain('forwardA = 1X');
    expect(text('hd1')).toContain('加载—使用型冒险');
    expect(text('hd1')).toContain('jump_flag');
    expect(text('hd1')).toContain('addi x1, x0, 1');
    // hd2 MIPS32 28 条 / 五阶段 / 模块表 / regdest / COE 测试
    expect(text('hd2')).toContain('Ego1');
    expect(text('hd2')).toContain('Vivado 2019.1');
    expect(text('hd2')).toContain('28 条标准 MIPS 指令');
    expect(text('hd2')).toContain('regdest');
    expect(text('hd2')).toContain('zero_extern');
    expect(text('hd2')).toContain('避免「时钟竞争」');
    expect(text('hd2')).toContain('lable 偏移量×4');
    expect(text('hd2')).toContain('COE');
    // hd3 8 个子模块 / 五阶段 / 总结 10 条指令
    expect(text('hd3')).toContain('cpu_top.v');
    expect(text('hd3')).toContain('128 条指令（512 字节）');
    expect(text('hd3')).toContain('alu_control.v');
    expect(text('hd3')).toContain('8 个功能明确的子模块');
    // hd4 题目要求 / 三种指令集 / COND / DP0 / 运算模块 / 测试与开发板
    expect(text('hd4')).toContain('LoongArch、MIPS32、RISC-V 或 ARM');
    expect(text('hd4')).toContain('func="100000"');
    expect(text('hd4')).toContain('target address');
    expect(text('hd4')).toContain('cpsr_n==cpsr_v');
    expect(text('hd4')).toContain('sec_operand');
    expect(text('hd4')).toContain('mulh');
    expect(text('hd4')).toContain('借条');
  });
});
