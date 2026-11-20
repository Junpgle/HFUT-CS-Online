/* 计算机体系结构 · 第二次课堂测试（100 分 / 限时 10 分钟）—— 依据「试题/课堂测试/计算机体系结构第二次课堂测试试题及解析.pdf」整理 */
import type { CaPaper } from './types';

const paper: CaPaper = {
  id: 'quiz2',
  title: '第二次课堂测试（100 分 · 限时 10 分钟）',
  source: '原卷为课堂投影照片（3 题），解析页一并收录；原 PDF 第 1 页为无关插画，已略过',
  answerSource: '原卷附答案',
  sections: [
    { title: '一、名词解释', questionIds: ['q1-1'] },
    { title: '二、互连网络计算', questionIds: ['q1-2'] },
    { title: '三、Cache 性能分析', questionIds: ['q1-3'] },
  ],
  questions: [
    {
      id: 'q1-1',
      kind: 'essay',
      question: '<p><strong>1. 名词解释</strong>：指令延迟槽。</p>',
      answer:
        '<p><strong>指令延迟槽</strong>（Instruction Delay Slot）是指在流水线处理器中，当一条指令被执行时，紧接在其后的一条指令被称为延迟槽指令。延迟槽的引入是为了优化流水线操作，减少由于跳转指令或其他控制转移指令引起的性能损失。跳转指令的结果通常会影响后续指令的执行，但处理器可以在延迟槽中安排其他不依赖于跳转指令结果的指令，从而更有效地利用处理器资源，避免因流水线停顿而产生的空闲周期。</p>',
      explanation:
        '<p>原卷解析原文照录。要点：延迟槽是<strong>紧跟在分支/跳转指令之后</strong>的那一个指令位置；编译器把不依赖分支结果的指令填进去（延迟分支技术），使分支造成的流水线空转被有效工作填满。</p>',
      tags: [{ deck: 6, sec: 'sec-ch6-control', text: '控制相关与分支处理' }],
    },
    {
      id: 'q1-2',
      kind: 'essay',
      question:
        '<p><strong>2.</strong> 现有 16 个处理器，编号分别为 0, 1, …, 15，用一个 N = 16 的互连网络互连。处理器的输出通道连接互连网络的输入端 i，处理器 i 的输入通道连接互连网络的输出端。当该互连网络实现的互连函数为 (1) Cube<sub>2</sub> 时，写出 3 号处理机连接的其它处理机的编号。</p>',
      answer:
        '<p>编号用 4 位二进制 <span class="m">x<sub>3</sub>x<sub>2</sub>x<sub>1</sub>x<sub>0</sub></span> 表示。<strong>Cube<sub>2</sub></strong> 函数把 <span class="m">x<sub>2</sub></span> 取反：</p><p><span class="m">Cube<sub>2</sub>(x<sub>3</sub>x<sub>2</sub>x<sub>1</sub>x<sub>0</sub>) = x<sub>3</sub>x̄<sub>2</sub>x<sub>1</sub>x<sub>0</sub></span>。3 号处理机 = 0011 → 取反 x<sub>2</sub> 得 0111 = <strong>7</strong>。所以 3 号处理机与 <strong>7 号处理机</strong>双向互连。</p>',
      explanation:
        '<p>原卷解析给出的是同卷另一小问（(2) Cube<sub>3</sub>、处理器 13）的演算过程，方法完全相同：<span class="m">Cube<sub>3</sub>(1101) = 0101</span>，即处理器 13 连接到处理器 5；反向令 <span class="m">Cube<sub>3</sub>(x<sub>3</sub>x<sub>2</sub>x<sub>1</sub>x<sub>0</sub>) = 1101</span> 得 <span class="m">x<sub>3</sub>x<sub>2</sub>x<sub>1</sub>x<sub>0</sub> = 0101</span>，故相连的也是 5——<strong>互连是双向的</strong>。本题按同一规则对 Cube<sub>2</sub>、处理器 3 计算：0011 → 0111（7）。</p>',
      tags: [
        { deck: 13, sec: 'sec-ch13-parallel', text: '并行程序与互连' },
        { deck: 14, sec: 'sec-ch14-bus', text: '共享存储器互连' },
      ],
    },
    {
      id: 'q1-3',
      kind: 'essay',
      question:
        '<p><strong>3.</strong> Alpha AXP 机器中，假设 Cache 不命中开销为 30 个时钟周期，当不考虑存储器停顿时，所有指令的执行时间都是 2.2 个时钟周期，访问 Cache 不命中率为 3%，平均每条指令访存 1.35 次。试分析有 Cache 与无 Cache 对系统性能的影响。要给出计算过程。</p>',
      answer:
        '<p><strong>有 Cache</strong>：每条指令平均访存 1.35 次、不命中率 3%，故每条指令的缺失次数 = 1.35 × 0.03 = 0.0405；缺失开销 = 0.0405 × 30 ≈ 1.215 个时钟周期。<br>平均执行时间 = 2.2 + 1.215 = <strong>3.415 个时钟周期</strong>。</p><p><strong>无 Cache</strong>：每次访存都直接访问主存，每次开销相当于 Cache 不命中的 30 个周期；平均执行时间 = 2.2 + 1.35 × 30 = 2.2 + 40.5 = <strong>42.7 个时钟周期</strong>。</p><p><strong>性能提升</strong> = 无 Cache 的执行时间 / 有 Cache 的执行时间 = 42.7 / 3.415 ≈ <strong>12.5 倍</strong>。</p>',
      explanation:
        '<p>原卷解析（AI 生成的计算过程，按「无 Cache 时每次访存都付出 30 拍」的口径）照录。要点：把「不命中的额外开销」折算成每指令的平均时钟数（CPI 的附加项），再比较两种情况下的平均执行时间。注意 1.35 × 0.03 是先算每指令的缺失次数。</p>',
      tags: [
        { deck: 10, sec: 'sec-ch10-miss', text: '缺失的分类与 AMAT' },
        { deck: 2, sec: 'sec-ch2-iron', text: 'CPU Time 铁律' },
      ],
    },
  ],
};

export default paper;
