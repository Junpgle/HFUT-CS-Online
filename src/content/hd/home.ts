/* 系统硬件综合设计 · 总目录 —— 汇总 4 份课件（验收/展示/演示/注意事项）的内容脉络 */
import type { HdUnit } from './types';

const home: HdUnit = {
  id: 'home',
  no: '',
  title: '系统硬件综合设计 · 课程总览',
  subtitle: '依据课件整理：RISC-V 流水线 CPU 验收 · MIPS32 单周期展示与演示 · 答辩注意事项',
  lede:
    '<p>本课程要求<strong>使用 Verilog HDL 语言完成一款基于 LoongArch、MIPS32、RISC-V 或 ARM 等精简指令集架构的单周期 / 多周期 / 流水线 CPU 的设计</strong>，并将设计的 CPU 下载至 FPGA 芯片上，在开发板上运行测试程序。课程页按课件逐讲整理：<strong>第 1 讲</strong>为 RISC-V 37 条指令多周期流水线 CPU 的最终验收，<strong>第 2、3 讲</strong>为 MIPS32 单周期 CPU 的展示与设计演示，<strong>第 4 讲</strong>为老师给出的答辩注意事项（题目要求与三种指令集详解）。试题暂未收录，故不设在线练习板块。</p>',
  toc: [{ id: 'sec-hd-map', text: '课件脉络', level: 2 }],
  sections: [
    {
      id: 'sec-hd-map',
      heading: '课件脉络',
      blocks: [
        {
          type: 'html',
          html: `
            <table class="tbl">
              <thead><tr><th>讲</th><th>课件</th><th>主要内容</th></tr></thead>
              <tbody>
                <tr><td>第 1 讲</td><td>最终验收（RISC-V 多周期流水线 CPU）</td><td>RISC-V 指令集特点与分工、总体结构（数据存储器 / 指令存储器 / risc-vCPU 三部分）、RV32I 37 条指令、主要器件、数据冒险与数据前推（forwardA/B/C）、寄存器堆前递、控制冒险冲刷、加载—使用型冒险停顿、三组仿真</td></tr>
                <tr><td>第 2 讲</td><td>硬件综合展示（MIPS32 单周期 CPU）</td><td>设计目标与开发环境（Ego1 + Vivado 2019.1）、28 条 MIPS 指令、系统宏观层次与五阶段数据通路、核心模块功能表与文件列表、取指 / 译码 / 执行 / 访存 / 写回逐模块代码讲解、controller / pc_reg / regfile / alu 详解、COE 测试与斐波那契上板</td></tr>
                <tr><td>第 3 讲</td><td>设计演示（单周期 CPU 模板）</td><td>设计任务与项目结构（8 个核心设计文件）、单周期 CPU 原理与五阶段、8 个子模块逐一说明、检查流程与数据流向 / 控制信号流向 / 指令执行数据通路关系图、总结</td></tr>
                <tr><td>第 4 讲</td><td>答辩注意事项（题目要求与指令集）</td><td>题目与系统组成框图、MIPS / RISC-V / ARM 三种指令集（格式与机器码）、CPU 硬件组成与细化单周期数据通路、单周期 / 多周期非流水线 / 多周期流水线结构要点、译码控制与运算模块代码分析、测试要求与开发板借用</td></tr>
              </tbody>
            </table>
            <p>课件共 4 份（143 页）：第 1 讲为同学验收讲稿（34 页），第 2 讲为及格版单周期资料（30 页），第 3 讲为答辩演示（20 页），第 4 讲为老师注意事项（59 页）。</p>`,
        },
      ],
    },
  ],
};

export default home;
