/* 计算机体系结构 · 第3讲 指令集架构 —— 依据「课件/03-指令集架构.pptx」（李建华，36 页）整理 */
import type { CaChapter } from './types';

const ch: CaChapter = {
  id: 'ch3',
  no: '第3讲',
  title: '指令集架构',
  subtitle: '第 3 讲 · 指令集架构',
  lede: `
  本讲以冯·诺依曼模型为纲，从五个方面认识 ISA：<strong>指令格式</strong>（定长/变长、MIPS 的 R/I/J 三型）、<strong>操作类型</strong>、
        <strong>操作数模型</strong>（Memory-only / 累加器 / 栈 / 通用寄存器）、<strong>数据类型</strong>与<strong>流程控制</strong>（分支条件与跳转目标的实现方法）。
        MIPS 的指令格式、寻址方式与流程控制是后续数据通路与流水线的基础。
`,
  toc: [
    { id: 'sec-ch3-vn', text: '1. 冯·诺依曼模型与 ISA 的五个方面', level: 2 },
    { id: 'sec-ch3-format', text: '2. 指令格式', level: 2 },
    { id: 'sec-ch3-format-h1', text: 'MIPS 的 R/I/J 三种格式', level: 3 },
    { id: 'sec-ch3-op', text: '3. 操作类型与操作数模型', level: 2 },
    { id: 'sec-ch3-op-h1', text: '四种操作数模型', level: 3 },
    { id: 'sec-ch3-op-h2', text: '三种模型的优缺点', level: 3 },
    { id: 'sec-ch3-addr', text: '4. MIPS 寄存器与寻址模式', level: 2 },
    { id: 'sec-ch3-type', text: '5. 数据类型', level: 2 },
    { id: 'sec-ch3-flow', text: '6. 流程控制', level: 2 },
    { id: 'sec-ch3-flow-h1', text: '分支条件的测试', level: 3 },
    { id: 'sec-ch3-flow-h2', text: '分支目标的计算', level: 3 },
    { id: 'sec-ch3-flow-h3', text: '过程调用', level: 3 },
  ],
  sections: [
    {
      id: 'sec-ch3-vn',
      heading: '1. 冯·诺依曼模型与 ISA 的五个方面',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>冯·诺依曼模型</strong>是所有当代基于 ISA 的计算机的潜在模型。程序计数器（PC）是关键：它决定了动态处理的指令的总体顺序，下一条指令的 PC 通常为 PC+4。</p>
          <ul>
            <li>指令和数据均放在<strong>有地址的存储器</strong>中，定义了计算、构成了算法：值从指令 X 传递到指令 Y（X 将 A 作为输出、Y 将 A 作为输入，Y 在 X 之后处理）；</li>
            <li>处理器在逻辑上一直处理一个循环：Fetch I → Decode I → Read Inputs → Execute → Write Output → Next PC；</li>
            <li>两条经典假定：指令的处理是<strong>原子性</strong>的；指令 X 在 X+1 开始处理之前完成。<strong>现代处理器并不遵守</strong>这两条约定。</li>
          </ul>
          <p>ISA 的五个方面（本讲提纲）：<strong>指令格式</strong>（长度与编码）、<strong>操作类型</strong>、<strong>操作数模型</strong>（操作数如何存储与访问）、<strong>数据类型及其操作</strong>、<strong>流程控制</strong>。</p>
          <div class="callout tip"><p>本讲为《系统硬件综合设计》做铺垫——其设计目标是功能相对完善的单周期/多周期 CPU（ARM、MIPS、RISC-V 或自定义 ISA）。</p></div>
          `,
        },
      ],
    },
    {
      id: 'sec-ch3-format',
      heading: '2. 指令格式',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>基于编码长度的分类</strong>：</p>
          <table class="tbl">
            <thead><tr><th>方案</th><th>优点</th><th>缺点</th></tr></thead>
            <tbody>
              <tr><td><strong>固定长度</strong>（32 或 64 位，嵌入式系统里有 16 位）</td><td>易于实现：基于 PC 计算下一条指令地址方便，译码效率高</td><td>code density（代码密度）差</td></tr>
              <tr><td><strong>可变长度</strong></td><td>code density 好</td><td>实现复杂（complex decoding logic）</td></tr>
              <tr><td><strong>混合方案</strong></td><td>折中</td><td>示例：MIPS16</td></tr>
            </tbody>
          </table>
          <h3 id="sec-ch3-format-h1">MIPS 的 R/I/J 三种格式</h3>
          <p>MIPS32 有三种格式，编码简单。CPU 能直接处理的信息就是这样的二进制信息，指令和数据皆是如此，均存储在 memory 里。</p>
          <svg class="fig" viewBox="0 0 760 300" role="img" aria-label="MIPS 的 R 型、I 型、J 型指令格式位域划分">
            <g font-size="12.5" text-anchor="middle" style="font-family:var(--font)">
              <text x="40" y="20" text-anchor="start" style="fill:var(--ink)" font-weight="700">R-type（寄存器型）</text>
              <g style="fill:var(--panel-2);stroke:var(--deck-accent)" stroke-width="1.4">
                <rect x="40" y="30" width="80" height="34" rx="6"/>
                <rect x="124" y="30" width="80" height="34" rx="6"/>
                <rect x="208" y="30" width="80" height="34" rx="6"/>
                <rect x="292" y="30" width="80" height="34" rx="6"/>
                <rect x="376" y="30" width="80" height="34" rx="6"/>
                <rect x="460" y="30" width="80" height="34" rx="6"/>
              </g>
              <g style="fill:var(--ink-2)">
                <text x="80" y="51">Op(6)</text>
                <text x="164" y="51">Rs(5)</text>
                <text x="248" y="51">Rt(5)</text>
                <text x="332" y="51">Rd(5)</text>
                <text x="416" y="51">Sh(5)</text>
                <text x="500" y="51">Func(6)</text>
              </g>
              <text x="600" y="51" text-anchor="start" style="fill:var(--ink-3)" font-size="12">例：add $1, $2, $3</text>
              <text x="40" y="92" text-anchor="start" style="fill:var(--ink-3)" font-size="12">Op=0（R 型统一操作码），具体功能由 Func 域定义</text>

              <text x="40" y="128" text-anchor="start" style="fill:var(--ink)" font-weight="700">I-type（立即数 / 访存 / 条件分支）</text>
              <g style="fill:var(--panel-2);stroke:var(--deck-accent)" stroke-width="1.4">
                <rect x="40" y="138" width="80" height="34" rx="6"/>
                <rect x="124" y="138" width="80" height="34" rx="6"/>
                <rect x="208" y="138" width="80" height="34" rx="6"/>
                <rect x="292" y="138" width="240" height="34" rx="6"/>
              </g>
              <g style="fill:var(--ink-2)">
                <text x="80" y="159">Op(6)</text>
                <text x="164" y="159">Rs(5)</text>
                <text x="248" y="159">Rt(5)</text>
                <text x="412" y="159">Immediate(16)</text>
              </g>
              <text x="560" y="159" text-anchor="start" style="fill:var(--ink-3)" font-size="12">lw / sw / addi / beq</text>
              <text x="40" y="200" text-anchor="start" style="fill:var(--ink-3)" font-size="12">beq $1, $2, 7：PC = PC+4 + (0000 0000 0000 0111 &lt;&lt; 2)（word offset）</text>

              <text x="40" y="236" text-anchor="start" style="fill:var(--ink)" font-weight="700">J-type（绝对跳转）</text>
              <g style="fill:var(--panel-2);stroke:var(--deck-accent)" stroke-width="1.4">
                <rect x="40" y="246" width="80" height="34" rx="6"/>
                <rect x="124" y="246" width="380" height="34" rx="6"/>
              </g>
              <g style="fill:var(--ink-2)">
                <text x="80" y="267">Op(6)</text>
                <text x="314" y="267">Target(26)</text>
              </g>
              <text x="520" y="267" text-anchor="start" style="fill:var(--ink-3)" font-size="12">j target：目标 = PC+4[31:28] ‖ target ‖ 00</text>
            </g>
          </svg>
          <p class="fig-cap">图 3-1　MIPS 的 R/I/J 指令格式与典型指令</p>
          <p>思考：6 位的操作码能表示多少种不同的指令？（2<sup>6</sup> = 64 种）</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch3-op',
      heading: '3. 操作类型与操作数模型',
      blocks: [
        {
          type: 'html',
          html: `
          <p>操作类型通常编码成<strong>操作码</strong>（opcode）。常见操作：整型运算（add/sub/mul/div/mod，有符号/无符号）、浮点运算（add/sub/mul/div/sqrt）、整型逻辑运算（and/or/xor/not/sll/srl/sra）等。</p>
          <div class="callout warn">
            <p><strong>更多的操作类型 == 更好的 ISA？</strong>DEC VAX 指令集有非常非常多的指令（例如专门用于多项式计算的指令），但大部分指令很少或者几乎不用（John Cocke，图灵奖获得者）。</p>
          </div>
          <h3 id="sec-ch3-op-h1">四种操作数模型</h3>
          <p>若要做加法运算，至少需要 3 个操作数（2 个源 + 1 个目标）。操作数来自哪里、如何编码？以「A = B + C」为例：</p>
          <table class="tbl">
            <thead><tr><th>模型</th><th>写法</th><th>语义</th></tr></thead>
            <tbody>
              <tr><td><strong>Memory-Only</strong></td><td>add A, B, C</td><td>mem[A] = mem[B] + mem[C]（A、B、C 都在 MEM 里）</td></tr>
              <tr><td><strong>Accumulator</strong>（单元素栈）</td><td>load B; add C; store A</td><td>ACC = mem[B]; ACC = ACC + mem[C]; mem[A] = ACC</td></tr>
              <tr><td><strong>Stack</strong>（TOS 隐式）</td><td>push B; push C; add; pop A</td><td>stack[TOS++] = mem[B]; stack[TOS++] = mem[C]; stack[TOS++] = stack[--TOS] + stack[--TOS]; mem[A] = stack[--TOS]</td></tr>
              <tr><td><strong>Registers</strong>（多个显式 accumulator）</td><td>load R1, B; add R1, C; store R1, A</td><td>R1 = mem[B]; R1 = R1 + mem[C]; mem[A] = R1</td></tr>
            </tbody>
          </table>
          <p><strong>Load-store</strong>：基于通用寄存器（GPR），且<strong>只有 load/store 指令可以访问存储器</strong>——load R1, B; load R2, C; add R1, R1, R2; store R1, A。</p>
          <h3 id="sec-ch3-op-h2">三种模型的优缺点</h3>
          <table class="tbl">
            <thead><tr><th>指标</th><th>大小关系</th><th>含义</th></tr></thead>
            <tbody>
              <tr><td><strong>静态代码量</strong>（static code size）</td><td>Memory-only &lt; register &lt; load-store</td><td>程序指令的数量</td></tr>
              <tr><td><strong>数据存储器流量</strong>（data memory traffic）</td><td>load-store &lt; register &lt; memory only</td><td>读写存储器的字节数（数据量）</td></tr>
              <tr><td><strong>指令处理延迟</strong>（instruction latency）</td><td>load-store &lt; register &lt; memory only</td><td>处理指令平均所需的时间</td></tr>
            </tbody>
          </table>
          `,
        },
      ],
    },
    {
      id: 'sec-ch3-addr',
      heading: '4. MIPS 寄存器与寻址模式',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>MIPS 是 load-store 模型</strong>：32 个 32 位整型寄存器（实际上只有 31 个，因为 0 号寄存器永远为 0）；32 个 32 位浮点寄存器（也可作为 16 个 64 位浮点寄存器使用）；HI、LO 为 multiply/divide 的目标寄存器。</p>
          <p>MIPS 整型寄存器用途（简化编译器设计：函数级别的编译和函数调用分开处理）：</p>
          <table class="tbl">
            <thead><tr><th>名称</th><th>编号</th><th>用途</th><th>名称</th><th>编号</th><th>用途</th></tr></thead>
            <tbody>
              <tr><td>$0</td><td>0</td><td>the constant value 0</td><td>$t0-$t7</td><td>8-15</td><td>temporary variables</td></tr>
              <tr><td>$at</td><td>1</td><td>assembler temporary</td><td>$s0-$s7</td><td>16-23</td><td>saved variables</td></tr>
              <tr><td>$v0-$v1</td><td>2-3</td><td>function return value</td><td>$t8-$t9</td><td>24-25</td><td>temporary variables</td></tr>
              <tr><td>$a0-$a3</td><td>4-7</td><td>function arguments</td><td>$k0-$k1</td><td>26-27</td><td>OS temporaries</td></tr>
              <tr><td>$gp</td><td>28</td><td>global pointer</td><td>$sp</td><td>29</td><td>stack pointer</td></tr>
              <tr><td>$fp</td><td>30</td><td>frame pointer</td><td>$ra</td><td>31</td><td>function return address</td></tr>
            </tbody>
          </table>
          <p><strong>寻址模式</strong>是处理地址编码问题的：现代计算机通常使用虚拟地址（典型 32 位或 64 位，程序可用 2<sup>32</sup> = 4GB 或 2<sup>64</sup> = 16PB），从 ISA 编码的角度甚至没有空间来编码一个虚拟地址。</p>
          <table class="tbl">
            <thead><tr><th>模式</th><th>写法</th><th>语义</th></tr></thead>
            <tbody>
              <tr><td>Direct（直接）</td><td>ld R1, (R2)</td><td>R1 = mem[R2]</td></tr>
              <tr><td>Displacement（偏移）</td><td>ld R1, 8(R2)</td><td>R1 = mem[R2 + 8]</td></tr>
              <tr><td>Indexed（变址）</td><td>ld R1, (R2, R3)</td><td>R1 = mem[R2 + R3]</td></tr>
              <tr><td>Memory-indirect（间接）</td><td>ld R1, @(R2)</td><td>R1 = mem[mem[R2]]</td></tr>
              <tr><td>Scaled（比例）</td><td>ld R1, (R2, R3, 32, 8)</td><td>R2 += 8; R1 = mem[R2 + R3×32 + 8]</td></tr>
            </tbody>
          </table>
          <p><strong>MIPS 只实现了偏移寻址</strong>（displacement），其合理性在于实测分布：Disp 61%、reg-ind 19%、scaled 11%、mem-ind 5%、other 4%——80% 的访问用偏移寻址或寄存器间接寻址（偏移为 0）。该结果基于 VAX 指令集（具有所有寻址模式）的实验。X86 则使用 10 种以上寻址模式。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch3-type',
      heading: '5. 数据类型',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>软件视角</strong>：数据类型指数据的特性，可以各种抽象（如数据结构里的类型）。<strong>硬件视角</strong>：数据就是比特，是操作的特性，仅支持基本的数据类型。</p>
          <p><strong>硬件数据类型</strong>：</p>
          <ul>
            <li>整型：8 bits（byte）、16b（half）、32b（word）、64b（long）；</li>
            <li>IEEE754 浮点型：32b（单精度）、64b（双精度）；</li>
            <li>打包的整型：将 64b int 看成 8 个 8b int 或 4 个 16b int。</li>
          </ul>
          <p><strong>MIPS ISA 的数据类型支持</strong>：所有整型操作按 32 位读写；设置基于字节/半字（有符号/无符号）的 load/store（lb、lbu、lh、lhu、sb、sh…）；整型算术指令支持有符号与无符号类型，且有立即数变体（add、addu、addi、addiu…）。</p>
          <div class="callout key">
            <p><strong>主要原则：Regularity / orthogonality（规则性/正交性）</strong>——所有的操作具有相应的变体类型，方便 compiler 的工作。RISC 架构的性能很大程度依赖 compiler。</p>
          </div>
          `,
        },
      ],
    },
    {
      id: 'sec-ch3-flow',
      heading: '6. 流程控制',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ch3-flow-h1">分支条件的测试</h3>
          <table class="tbl">
            <thead><tr><th>方法</th><th>示例</th><th>优点</th><th>缺点</th></tr></thead>
            <tbody>
              <tr><td>1. 比较并分支指令</td><td>blti $1, 10, target</td><td>简单</td><td>需要两个 ALU：一个判断条件、一个计算目标</td></tr>
              <tr><td>2. 隐式条件码</td><td>subi $2, $1, 10（sets "negative" CC）; bn target</td><td>条件码设置是「for free」</td><td>隐式依赖难以处理</td></tr>
              <tr><td>3. 条件寄存器</td><td>slti $2, $1, 10; bnez $2, target</td><td>每个操作一个 ALU、显式依赖关系</td><td>额外的分支指令</td></tr>
            </tbody>
          </table>
          <p><strong>MIPS 使用方法 1 和 3</strong>：比较并分支指令 beq、bne（只进行相等/不等比较，不需要专门 ALU 或加法器）；将寄存器与 0 比较进行分支跳转 bgtz、bgez、bltz、blez；设置显式条件寄存器 slt、sltu、slti、sltiu。原因：超过 86% 的分支比较是相等、不等或与 0 比较等简单形式。</p>
          <h3 id="sec-ch3-flow-h2">分支目标的计算</h3>
          <ul>
            <li><strong>PC-relative</strong>：目标相对于一个子过程内部，用于过程内部的 branch/jump；</li>
            <li><strong>Absolute</strong>：目标位于过程外部，用于子过程调用（函数调用）；</li>
            <li><strong>Indirect</strong>：目标存储在寄存器里，用于动态目标（返回、动态过程调用、switches 等）。</li>
          </ul>
          <p>通常会跳多远？过程内部不会很远，从一个过程跳到另一个过程则可能很远。</p>
          <p><strong>MIPS 使用 3 种方法</strong>：</p>
          <ul>
            <li>PC-relative：bne、beq、blez 等，16 位偏移量（&lt;0.1% 需要更多位）；条件为真则 PC = PC+4+immediate，否则 PC = PC+4；</li>
            <li>Absolute：j target，26 位偏移，可寻址 2<sup>28</sup> words &lt; 2<sup>32</sup>；</li>
            <li>Indirect：jr $rd（R 型格式，Rs 覆盖操作数）。</li>
          </ul>
          <h3 id="sec-ch3-flow-h3">过程调用</h3>
          <p>支持过程调用的关键：记住调用指令的地址（current PC + 4），调用结束之后返回。MIPS 的实现：</p>
          <ul>
            <li>隐式的返回地址寄存器 <strong>$ra（=$31）</strong>；</li>
            <li>直接的 jump-and-link 指令 <strong>jal address</strong>：$ra = PC+4; PC = address；可通过 jr 返回：jr $ra；</li>
            <li>或使用间接的 jump-and-link 指令 jalr $rd, $rs：$rd = PC+4; PC = $rs（显式返回地址寄存器），然后用 jr $rd 返回。</li>
          </ul>
          `,
        },
      ],
    },
  ],
};

export default ch;
