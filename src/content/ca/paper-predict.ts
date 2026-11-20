/* 计算机体系结构 · 期末大题重点预测（5 类例题）—— 依据「试题/期末/计算机体系结构期末考试考点回忆与大题重点预测.pdf」整理 */
import type { CaPaper } from './types';

const paper: CaPaper = {
  id: 'predict',
  title: '期末大题重点预测（5 类例题）',
  source: '原文件为考前手写笔记 + 5 类大题例题的照片版；本卷按「例题」收入 5 道题（原文件明确这 5 类为期末大题类型）',
  answerSource: '本站整理',
  sections: [{ title: '一～五、五类大题', questionIds: ['q3-1', 'q3-2', 'q3-3', 'q3-4', 'q3-5'] }],
  questions: [
    {
      id: 'q3-1',
      kind: 'essay',
      question:
        '<p><strong>大题 1（数据通路时延）</strong>：单周期 MIPS 数据通路中，memory units（read or write）= 200 ps，ALU 与加法器 = 100 ps，register file（read or write）= 50 ps，其它组合逻辑 = 0 ps。要求<strong>只计算时延</strong>（不画图、不展示实现）：分别给出 add、lw、beq 三条指令的关键路径与单周期时延。</p>',
      answer:
        '<p><strong>add（R 型）</strong>：IF 200 + ID 50 + EX 100 + WB 50 = <strong>400 ps</strong>；关键路径：PC → 指令存储器 → 寄存器堆读 → ALU → 寄存器堆写。<br><strong>lw</strong>：IF 200 + ID 50 + EX 100 + MEM 200 + WB 50 = <strong>600 ps</strong>；关键路径：PC → 指令存储器 → 寄存器堆读 → ALU（算地址）→ 数据存储器读 → 寄存器堆写。<br><strong>beq</strong>：IF 200 + ID 50 + EX 100 = <strong>350 ps</strong>；关键路径：PC → 指令存储器 → 寄存器堆读 → ALU（比较）→ 分支判定（无 WB、无 MEM）。</p>',
      explanation:
        '<p>课件第 4 讲的原表：R/I 型 400、LW 600、SW 550、Branch 350、Jump 200。单周期下时钟周期由最慢指令决定（lw 的 600 ps）。add 与 lw 的差别在 MEM 段的 200 ps；beq 没有 MEM 与 WB。</p>',
      tags: [
        { deck: 4, sec: 'sec-ch4-perf', text: '单周期性能分析' },
        { deck: 4, sec: 'sec-ch4-steps', text: '指令的处理步骤' },
      ],
    },
    {
      id: 'q3-2',
      kind: 'essay',
      question:
        '<p><strong>大题 2（Amdahl）</strong>：一个程序的 75% 运行时间花费在乘法运算上。(1) 如果将乘法单元加速 3 倍，可以获得的总加速比为多少？(2) 若乘法单元可以获得无限的加速比，该程序能获得的最大加速比为多少？</p>',
      answer:
        '<p>(1) <span class="m">f = 0.75，s = 3</span>：speedup = 1 / ((1 − 0.75) + 0.75 / 3) = 1 / (0.25 + 0.25) = <strong>2 倍</strong>。<br>(2) 极限：speedup<sub>max</sub> = 1 / (1 − 0.75) = <strong>4 倍</strong>。</p>',
      explanation:
        '<p>套用第 2 讲公式 speedup = 1/((1−f) + f/s)；s → ∞ 时退化为 1/(1−f)。这题就是考点回忆里说的「送分题」。</p>',
      tags: [{ deck: 2, sec: 'sec-ch2-amdahl', text: 'Amdahl 定律' }],
    },
    {
      id: 'q3-3',
      kind: 'essay',
      question: `<p><strong>大题 3（数据相关）</strong>：对于没有旁路机制（Data Forwarding）的 MIPS 5 阶段流水线，找出下面代码中的数据相关，并将相关的情况（<strong>相关指令对的编号以及相关的类型</strong>）列出来。</p><pre class="code"><code>编号  指令
1.    add $3, $1, $2
2.    lw  $1, 0($4)
3.    and $5, $3, $4
4.    and $6, $1, $2
5.    or  $1, $3, $6
6.    sw  $1, 4($4)
7.    lw  $2, 4($4)
8.    sub $3, $5, $6</code></pre>`,
      answer:
        '<p><strong>真相关（RAW）</strong>——先写后读：1 &amp; 3（$3）、1 &amp; 5（$3）、2 &amp; 4（$1）、2 &amp; 6（$1）、3 &amp; 8（$5）、4 &amp; 5（$6）、4 &amp; 8（$6）、5 &amp; 6（$1）。<br><strong>反相关（WAR）</strong>——先读后写：1 &amp; 2（$1）、1 &amp; 5（$1）、4 &amp; 5（$1）、4 &amp; 7（$2）、5 &amp; 8（$3）。<br><strong>输出相关（WAW）</strong>——先写后写：2 &amp; 5（$1）。<br>（$4 只被多条指令读，不构成相关。）</p>',
      explanation:
        '<p>逐条列出「读寄存器 / 写寄存器」后按三种相关定义配对即可：RAW = 前者写、后者读；WAR = 前者读、后者写；WAW = 两者都写。注意：<strong>相关是程序属性</strong>，无旁路时只有距离 ≤ 3 的真相关会造成冒险（第 6 讲），但本问只要求列出相关对。1 &amp; 5 同时构成 RAW 与 WAR（$3 与 $1 两个寄存器），4 &amp; 5 同理（$6 与 $1）。</p>',
      tags: [
        { deck: 6, sec: 'sec-ch6-adv', text: '真相关与冒险条件' },
        { deck: 5, sec: 'sec-ch5-dep', text: '相关及其分类' },
        { deck: 7, sec: 'sec-ch7-concept', text: 'ILP 与相关的基本概念' },
      ],
    },
    {
      id: 'q3-4',
      kind: 'essay',
      question:
        '<p><strong>大题 4（CPU time 比较）</strong>：对于程序 X——机器 A：clock 1ns，CPI 2.0；机器 B：clock 2ns，CPI 1.2。问：哪个机器快，快多少？</p>',
      answer:
        '<p>假设程序 X 运行过程共有 N 条指令：Time(A) = N × 2.0 × 1 = <strong>2N</strong>；Time(B) = N × 1.2 × 2 = <strong>2.4N</strong>。<br>比较：Time(B)/Time(A) = 2.4N/2N = <strong>1.2</strong>，所以对于程序 X，<strong>机器 A 比机器 B 快 20%</strong>。</p>',
      explanation:
        '<p>课件第 2 讲「性能分析示例 A」原题。注意「快 20%」与「1.2 倍」的等价说法（15/10 = 1.5 既是 1.5 倍快、也是快 50%）。</p>',
      tags: [
        { deck: 2, sec: 'sec-ch2-iron', text: 'CPU Time 铁律' },
        { deck: 2, sec: 'sec-ch2-perf', text: '性能指什么' },
      ],
    },
    {
      id: 'q3-5',
      kind: 'essay',
      question:
        '<p><strong>大题 5（虚存地址转换）</strong>：14 位虚拟地址 0x0AD0 的划分如下：VPN 为 bit 13～6（8 位，其中 TLBT = bit 13～10、TLBI = bit 9～6），VPO 为 bit 5～0（6 位）。请填写：VPN=___，TLBI=___，TLBT=___，以及访问的页内偏移 VPO=___；并说明 TLB 命中/缺页/PPN 与物理地址 CT/CI/CO 的求解方法。</p>',
      answer:
        '<p>0x0AD0 = 14 位二进制 <span class="m">10 1010 1101 0000</span>（bit13…bit0）。<br><strong>VPN</strong>（bit13～6）= <span class="m">0010 1011</span> = <strong>0x2B</strong>；<strong>TLBT</strong>（bit13～10）= <span class="m">0010</span> = <strong>0x2</strong>；<strong>TLBI</strong>（bit9～6）= <span class="m">1011</span> = <strong>0xB</strong>；<strong>VPO</strong>（bit5～0）= <span class="m">010000</span> = <strong>0x10（16）</strong>。<br><strong>TLB Hit？</strong> 用 TLBI 选组、在组内比较 TLBT（并检查 valid）：命中则取出 PPN；未命中 → 访问页表 → 若 PTE 无效则 <strong>Page Fault</strong>，由 OS 调入页面并更新 TLB。<br><strong>物理地址</strong> = PPN × 64 + VPO；cache 划分：CO = 块内偏移（低 log<sub>2</sub>(块大小) 位）、CI = 索引（PA 中接着的 log<sub>2</sub>(组数) 位）、CT = 剩余高位。</p>',
      explanation:
        '<p>原题为实验课经典的 TLB/cache 联合分析（题面另附 TLB 内容与 cache 参数，照片未收录），因此卷面可填的只有 VPN/TLBI/TLBT/VPO 四个字段；TLB Hit/Page Fault/PPN 与 CT/CI/CO 需按题给参数查表计算。拆分要点：<strong>先按页大小确定 VPO 位数（64B 页 → 6 位），再在高位中按 TLB 的组索引/标记划分 TLBI/TLBT</strong>。</p>',
      tags: [
        { deck: 12, sec: 'sec-ch12-tlb', text: 'TLB' },
        { deck: 10, sec: 'sec-ch10-map', text: '地址划分与直接相联' },
      ],
    },
  ],
};

export default paper;
