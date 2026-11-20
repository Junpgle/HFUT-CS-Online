/* 计算机体系结构 · 第4讲 MIPS 数据通路 —— 依据「课件/04-MIPS通路.pptx」（李建华，47 页）整理 */
import type { CaChapter } from './types';

const ch: CaChapter = {
  id: 'ch4',
  no: '第4讲',
  title: 'MIPS 数据通路',
  subtitle: '第 4 讲 · MIPS 数据通路',
  lede: `
  本讲从指令的处理步骤出发，逐类搭建<strong>单周期数据通路</strong>：算术逻辑指令（R/I 型）、访存指令（LW/SW）、控制流指令（J/BEQ），
        再归纳<strong>单周期控制逻辑</strong>的控制信号表，最后做<strong>性能分析</strong>——单周期 CPI 严格为 1，时钟周期由最慢指令（LW）的关键路径决定。
        本讲为《系统硬件综合设计》做铺垫，也是期末「延时计算」大题的依据（memory 200ps / ALU 100ps / RF 50ps）。
`,
  toc: [
    { id: 'sec-ch4-steps', text: '1. 指令的处理步骤', level: 2 },
    { id: 'sec-ch4-alu', text: '2. 算术逻辑指令的数据通路', level: 2 },
    { id: 'sec-ch4-mem', text: '3. 访存指令的数据通路', level: 2 },
    { id: 'sec-ch4-cf', text: '4. 控制流指令的数据通路', level: 2 },
    { id: 'sec-ch4-ctrl', text: '5. 单周期控制逻辑', level: 2 },
    { id: 'sec-ch4-perf', text: '6. 单周期性能分析', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ch4-steps',
      heading: '1. 指令的处理步骤',
      blocks: [
        {
          type: 'html',
          html: `
          <p>MIPS 指令的处理分为 5 个阶段，所有指令都按相同的流程经过数据通路：</p>
          <table class="tbl">
            <thead><tr><th>阶段</th><th>名称</th><th>主要工作</th></tr></thead>
            <tbody>
              <tr><td>IF</td><td>取指</td><td>按 PC 从指令存储器取指令，同时 PC+4</td></tr>
              <tr><td>ID/RF</td><td>译码 &amp; 取寄存器操作数</td><td>译码指令、读通用寄存器</td></tr>
              <tr><td>EX/AG</td><td>执行/计算访存地址</td><td>ALU 运算或计算有效地址</td></tr>
              <tr><td>MEM</td><td>访存</td><td>读/写数据存储器</td></tr>
              <tr><td>WB</td><td>回写</td><td>把结果写回通用寄存器</td></tr>
            </tbody>
          </table>
          <svg class="fig" viewBox="0 0 740 190" role="img" aria-label="MIPS 单周期数据通路的五个阶段与主要部件">
            <g font-size="12.5" text-anchor="middle" style="font-family:var(--font)">
              <defs>
                <marker id="ca-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" style="fill:var(--ink-3)"/>
                </marker>
              </defs>
              <g style="fill:var(--panel-2);stroke:var(--deck-accent)" stroke-width="1.6">
                <rect x="36" y="52" width="120" height="64" rx="10"/>
                <rect x="188" y="52" width="120" height="64" rx="10"/>
                <rect x="340" y="52" width="120" height="64" rx="10"/>
                <rect x="492" y="52" width="100" height="64" rx="10"/>
                <rect x="624" y="52" width="90" height="64" rx="10"/>
              </g>
              <g style="fill:var(--ink)" font-weight="700">
                <text x="96" y="82">取指 IF</text>
                <text x="248" y="82">译码 ID</text>
                <text x="400" y="82">执行 EX</text>
                <text x="542" y="82">访存 MEM</text>
                <text x="669" y="82">回写 WB</text>
              </g>
              <g style="fill:var(--ink-2)" font-size="11.5">
                <text x="96" y="102">PC / 指令存储器</text>
                <text x="248" y="102">寄存器堆</text>
                <text x="400" y="102">ALU / 地址加法</text>
                <text x="542" y="102">数据存储器</text>
                <text x="669" y="102">寄存器堆</text>
              </g>
              <g style="stroke:var(--ink-3)" stroke-width="1.4" fill="none" marker-end="url(#ca-arr)">
                <path d="M156,84 L188,84"/>
                <path d="M308,84 L340,84"/>
                <path d="M460,84 L492,84"/>
                <path d="M592,84 L624,84"/>
                <path d="M96,52 L96,30 L669,30 L669,52"/>
              </g>
              <text x="380" y="20" style="fill:var(--ink-3)" font-size="11.5">单周期：一条指令的全部 5 个阶段在一个时钟周期内完成</text>
              <text x="96" y="146" style="fill:var(--ink-3)" font-size="11.5" text-anchor="start">指令存储器与数据存储器在单周期结构中分开画，便于理解访存阶段</text>
            </g>
          </svg>
          <p class="fig-cap">图 4-1　MIPS 指令处理的五个阶段</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch4-alu',
      heading: '2. 算术逻辑指令的数据通路',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>R 型（以 ADD 为例）</strong>：汇编 ADD rd, rs, rt；机器编码为 Op(6) | rs(5) | rt(5) | rd(5) | 0(5) | ADD(6)；语义：</p>
          <div class="formula">if MEM[PC] == ADD rd rs rt 　<span class="m">GPR[rd] ← GPR[rs] + GPR[rt]; PC ← PC + 4</span></div>
          <p>数据通路：PC → 指令存储器取指；指令的 25:21 与 20:16 域作为 Rs/Rt 读寄存器；15:11 域作为 Rd 写寄存器；两个读出的值进 ALU 相加；结果经 WB 写回 Rd。</p>
          <p><strong>I 型 ALU 指令（以 ADDI 为例）</strong>：汇编 ADDI rt, rs, immediate16；语义：</p>
          <div class="formula">if MEM[PC] == ADDI rt rs immediate 　<span class="m">GPR[rt] ← GPR[rs] + sign-extend(immediate); PC ← PC + 4</span></div>
          <p>与 R 型共享数据通路的关键差异：</p>
          <ul>
            <li><strong>目标寄存器</strong>：R 型取 rd（15:11），I 型取 rt（20:16）——用 <strong>RegDest</strong> 选择；</li>
            <li><strong>ALU 的第二个源</strong>：R 型取 rt 的读出值，I 型取符号扩展后的 16 位立即数——用 <strong>ALUSrc</strong> 选择。</li>
          </ul>
          <p>可以把数据通路看成「状态更新组合逻辑」：输入是 PC 与寄存器/存储器状态，输出了新的状态。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch4-mem',
      heading: '3. 访存指令的数据通路',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>LW（I 型）</strong>：汇编 LW rt, offset16(base)；语义：</p>
          <div class="formula">if MEM[PC] == LW rt offset16 (base) 　<span class="m">EA = sign-extend(offset) + GPR[base]; GPR[rt] ← MEM[translate(EA)]; PC ← PC + 4</span></div>
          <p>新增两条路径：</p>
          <ul>
            <li>ALU 计算有效地址 EA（基址寄存器 + 符号扩展偏移，ALUSrc=1）；</li>
            <li>数据存储器读出后经 <strong>MemtoReg</strong> 选择写回寄存器（而不是 ALU 结果）。</li>
          </ul>
          <p><strong>SW（I 型）</strong>：汇编 SW rt, offset16(base)；语义：</p>
          <div class="formula">if MEM[PC] == SW rt offset16 (base) 　<span class="m">EA = sign-extend(offset) + GPR[base]; MEM[translate(EA)] ← GPR[rt]; PC ← PC + 4</span></div>
          <p>SW 与 LW 的差异：要写的数据来自 <strong>rt 的读出值</strong>；<strong>不写回</strong>寄存器（RegWrite=0）；存储器写使能（MemWrite=1）。</p>
          <p><strong>Load-Store 共用</strong>：用地址加法器/ALU 计算 EA；用 <strong>RegDest / ALUSrc / MemtoReg</strong> 三个选择信号（配合 isLoad / isStore / isItype）让 R/I/LW/SW 共享同一数据通路。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch4-cf',
      heading: '4. 控制流指令的数据通路',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>J（无条件跳转）</strong>：汇编 J immediate26；语义：</p>
          <div class="formula">if MEM[PC] == J immediate26 　<span class="m">target = { PC+4[31:28], immediate26, 2'b00 }; PC ← target</span></div>
          <p><strong>BEQ（条件分支，I 型）</strong>：汇编 BEQ rs, rt, immediate16；语义（假定没有分支延迟槽）：</p>
          <div class="formula">if MEM[PC] == BEQ rs rt immediate16 　<span class="m">target = PC+4 + sign-extend(immediate) × 4</span></div>
          <div class="formula">if <span class="m">GPR[rs] == GPR[rt]</span> then <span class="m">PC ← target</span> else <span class="m">PC ← PC + 4</span></div>
          <p>要点：</p>
          <ul>
            <li>分支目标 = PC+4 + 立即数 × 4（16 位偏移以字为单位，左移 2 位）；</li>
            <li>比较用减法（ALU 做 sub，结果为 0 即相等）；</li>
            <li>下一条 PC 的来源有三种：PC+4（顺序）、分支目标（PCSrc2 = Br Taken）、跳转目标（PCSrc1 = Jump）——两个 PCSrc 共同决定。</li>
          </ul>
          `,
        },
      ],
    },
    {
      id: 'sec-ch4-ctrl',
      heading: '5. 单周期控制逻辑',
      blocks: [
        {
          type: 'html',
          html: `
          <p>控制信号由 Inst = MEM[PC] 的<strong>组合函数</strong>生成（硬布线控制）：</p>
          <table class="tbl">
            <thead><tr><th>信号</th><th>含义</th><th>条件（=1 时）</th></tr></thead>
            <tbody>
              <tr><td><strong>RegDest</strong></td><td>目标寄存器选择</td><td>R 型按 rd（inst[15:11]）；否则按 rt（inst[20:16]）</td></tr>
              <tr><td><strong>ALUSrc</strong></td><td>ALU 第二源选择</td><td>sign-extended 16-bit immediate（(opcode≠0) &amp;&amp; (opcode≠BEQ) &amp;&amp; (opcode≠BNE)）</td></tr>
              <tr><td><strong>MemtoReg</strong></td><td>写回来源选择</td><td>存储器读出的值（opcode==LW）</td></tr>
              <tr><td><strong>RegWrite</strong></td><td>是否写寄存器</td><td>(opcode≠SW) &amp;&amp; (opcode≠Bxx) &amp;&amp; (opcode≠J) &amp;&amp; (opcode≠JR)</td></tr>
              <tr><td><strong>MemRead</strong></td><td>是否读存储器</td><td>opcode==LW</td></tr>
              <tr><td><strong>MemWrite</strong></td><td>是否写存储器</td><td>opcode==SW</td></tr>
              <tr><td><strong>PCSrc1</strong></td><td>跳转选择</td><td>(opcode==J) || (opcode==JAL)</td></tr>
              <tr><td><strong>PCSrc2</strong></td><td>分支选择</td><td>(opcode==Bxx) &amp;&amp; bcond 满足</td></tr>
            </tbody>
          </table>
          <p><strong>ALU 控制的实现</strong>：case opcode —— '0' 按 funct 选择操作；'ALUi' 按 opcode 选择操作；'LW'/'SW' 选加法；'Bxx' 选 bcond 生成函数；其余 don't care。</p>
          <p><strong>控制模块的两种实现</strong>：组合逻辑 → <strong>硬布线控制</strong>（控制信号是用组合逻辑处理指令来生成的，当前 CPU 大多基于此）；时序逻辑 → <strong>微程序控制</strong>（控制存储包含控制信号及微指令）。</p>
          <div class="callout warn"><p>有些控制信号是在指令的处理过程中产生的（如 bcond 结果影响 PCSrc2）。JAL、JR、JALR 需要额外的 RegDest / MemtoReg / PCSrc 选项。</p></div>
          `,
        },
      ],
    },
    {
      id: 'sec-ch4-perf',
      heading: '6. 单周期性能分析',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>单周期的特点</strong>：每条指令需要一个时钟周期来执行，CPI 严格为 1；时钟周期由<strong>最慢的指令</strong>所需时间决定，关键路径也由最慢指令决定——即使很多指令不需要那么长时间。</p>
          <p><strong>时延假设（课件原表，期末延时计算的依据）</strong>：memory units（read or write）= 200 ps；ALU 与加法器 = 100 ps；register file（read or write）= 50 ps；其它组合逻辑 = 0 ps。</p>
          <svg class="fig" viewBox="0 0 760 300" role="img" aria-label="五类指令在各阶段所用的时延与总时延">
            <g font-size="12.5" text-anchor="middle" style="font-family:var(--font)">
              <g style="fill:var(--panel-2);stroke:var(--hairline)" stroke-width="1">
                <rect x="70" y="40" width="620" height="34"/>
                <rect x="70" y="84" width="620" height="34"/>
                <rect x="70" y="128" width="620" height="34"/>
                <rect x="70" y="172" width="620" height="34"/>
                <rect x="70" y="216" width="620" height="34"/>
              </g>
              <g style="fill:var(--ink)" font-weight="700" font-size="12">
                <text x="45" y="62" text-anchor="end">R-type</text>
                <text x="45" y="106" text-anchor="end">I-type</text>
                <text x="45" y="150" text-anchor="end">LW</text>
                <text x="45" y="194" text-anchor="end">SW</text>
                <text x="45" y="238" text-anchor="end">Branch</text>
              </g>
              <g font-size="11.5" style="fill:var(--ink-2)">
                <rect x="70" y="40" width="140" height="34" style="fill:var(--deck-accent);opacity:0.18"/>
                <text x="140" y="62">IF 200</text>
                <rect x="210" y="40" width="60" height="34" style="fill:var(--deck-accent);opacity:0.30"/>
                <text x="240" y="62">ID 50</text>
                <rect x="270" y="40" width="100" height="34" style="fill:var(--deck-accent);opacity:0.24"/>
                <text x="320" y="62">EX 100</text>
                <rect x="370" y="40" width="60" height="34" style="fill:var(--deck-accent);opacity:0.30"/>
                <text x="400" y="62">WB 50</text>
                <text x="530" y="62" font-weight="700" style="fill:var(--ink)">合计 400 ps</text>
                <rect x="70" y="84" width="140" height="34" style="fill:var(--deck-accent);opacity:0.18"/>
                <text x="140" y="106">IF 200</text>
                <rect x="210" y="84" width="60" height="34" style="fill:var(--deck-accent);opacity:0.30"/>
                <text x="240" y="106">ID 50</text>
                <rect x="270" y="84" width="100" height="34" style="fill:var(--deck-accent);opacity:0.24"/>
                <text x="320" y="106">EX 100</text>
                <rect x="370" y="84" width="60" height="34" style="fill:var(--deck-accent);opacity:0.30"/>
                <text x="400" y="106">WB 50</text>
                <text x="530" y="106" font-weight="700" style="fill:var(--ink)">合计 400 ps</text>
                <rect x="70" y="128" width="140" height="34" style="fill:var(--deck-accent);opacity:0.18"/>
                <text x="140" y="150">IF 200</text>
                <rect x="210" y="128" width="60" height="34" style="fill:var(--deck-accent);opacity:0.30"/>
                <text x="240" y="150">ID 50</text>
                <rect x="270" y="128" width="100" height="34" style="fill:var(--deck-accent);opacity:0.24"/>
                <text x="320" y="150">EX 100</text>
                <rect x="370" y="128" width="140" height="34" style="fill:var(--warn);opacity:0.26"/>
                <text x="440" y="150">MEM 200</text>
                <rect x="510" y="128" width="60" height="34" style="fill:var(--deck-accent);opacity:0.30"/>
                <text x="540" y="150">WB 50</text>
                <text x="630" y="150" font-weight="700" style="fill:var(--hot)">合计 600 ps（最长）</text>
                <rect x="70" y="172" width="140" height="34" style="fill:var(--deck-accent);opacity:0.18"/>
                <text x="140" y="194">IF 200</text>
                <rect x="210" y="172" width="60" height="34" style="fill:var(--deck-accent);opacity:0.30"/>
                <text x="240" y="194">ID 50</text>
                <rect x="270" y="172" width="100" height="34" style="fill:var(--deck-accent);opacity:0.24"/>
                <text x="320" y="194">EX 100</text>
                <rect x="370" y="172" width="140" height="34" style="fill:var(--warn);opacity:0.26"/>
                <text x="440" y="194">MEM 200</text>
                <text x="560" y="194" font-weight="700" style="fill:var(--ink)">合计 550 ps</text>
                <rect x="70" y="216" width="140" height="34" style="fill:var(--deck-accent);opacity:0.18"/>
                <text x="140" y="238">IF 200</text>
                <rect x="210" y="216" width="60" height="34" style="fill:var(--deck-accent);opacity:0.30"/>
                <text x="240" y="238">ID 50</text>
                <rect x="270" y="216" width="100" height="34" style="fill:var(--deck-accent);opacity:0.24"/>
                <text x="320" y="238">EX 100</text>
                <text x="460" y="238" font-weight="700" style="fill:var(--ink)">合计 350 ps</text>
              </g>
              <text x="380" y="276" style="fill:var(--ink-3)" font-size="11.5">时钟周期 = 最慢指令（LW）的 600 ps；Jump 仅需 IF 200 ps</text>
            </g>
          </svg>
          <p class="fig-cap">图 4-2　单周期下各类指令的时延构成（memory 200 / ALU 100 / RF 50 ps）</p>
          <p>结论：单周期的时钟周期被 LW 的 600 ps 决定；R/I 型只需 400 ps、Branch 只需 350 ps、Jump 只需 200 ps——<strong>大量的时间为慢指令买单</strong>，这正是流水线要解决的问题。</p>
          `,
        },
      ],
    },
  ],
};

export default ch;
