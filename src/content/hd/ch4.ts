/* 第4讲 答辩注意事项（题目要求与三种指令集）—— 逐节转录自 课件/答辩与演示/注意事项.ppt（59 页，纯图版 PPT）；
   指令格式/条件码/处理方式表按课件原图整理为表格，其余框图与代码截图以「课件图示」注明。 */
import type { HdUnit } from './types';

const ch4: HdUnit = {
  id: 'hd4',
  no: '第4讲',
  title: '答辩注意事项：题目要求与三种指令集',
  subtitle: '题目要求 · MIPS / RISC-V / ARM 指令集 · CPU 硬件组成 · 多周期与流水线结构 · 模块代码分析 · 测试与开发板',
  lede:
    '<p>本讲为老师给出的「硬件综合课程设计注意事项」（59 页）：围绕<strong>题目和要求、三种不同的指令集、CPU 的硬件结构与 verilog 模块、单周期 / 多周期非流水线与多周期流水线结构、典型模块结构与 verilog 代码分析</strong>展开。</p>',
  toc: [
    { id: 'sec-hd4-task', text: '题目和要求', level: 2 },
    { id: 'sec-hd4-isa', text: '一、三种不同的指令集', level: 2 },
    { id: 'sec-hd4-cpu', text: '二、CPU 的硬件结构与 verilog 模块', level: 2 },
    { id: 'sec-hd4-struct', text: '三、单周期与多周期流水线结构', level: 2 },
    { id: 'sec-hd4-code', text: '四、典型模块结构，verilog 代码分析', level: 2 },
    { id: 'sec-hd4-final', text: 'CPU 测试与开发板借用', level: 2 },
  ],
  sections: [
    {
      id: 'sec-hd4-task',
      heading: '题目和要求',
      blocks: [
        {
          type: 'html',
          html: `
            <p>使用 <strong>Verilog HDL 语言</strong>完成一款基于 <strong>LoongArch、MIPS32、RISC-V 或 ARM</strong> 等精简指令集架构的<strong>单周期 / 多周期 CPU / 流水线 CPU</strong> 的设计，并将设计的 <strong>CPU 下载至 FPGA 芯片</strong>上，在开发板上可以运行测试程序。</p>
            <p><em>课件图示：系统组成框图——编译系统与键盘 / 鼠标接入 CPU、Cache、Memory（红虚线框标出的设计核心），右侧为仿真波形、数码管显示、VGA 显示三种输出。</em></p>`,
        },
      ],
    },
    {
      id: 'sec-hd4-isa',
      heading: '一、三种不同的指令集',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>1. MIPS 指令集</strong>（课件：MIPS 指令集共 31 条，节选）：三种指令格式——</p>
            <ul>
              <li><strong>R 型指令</strong>：op（6 bits）| rs（5 bits）| rt（5 bits）| rd（5 bits）| shamt（5 bits）| func（6 bits）。OP：操作码，R 型指令的 OP 取值都是 "000000"，由功能码的值定义不同的运算操作；func：功能码，能给出不同的操作——例如当 op="000000"、func="100000"（即 32 时）表示「加法」运算，当 op="000000"、func="100010"（即 34 时）表示「减法」运算；rs：第一个操作数所在的源寄存器名称；rt：第二个操作数所在的寄存器名称。</li>
              <li><strong>I 型指令</strong>：op（6 bits）| rs（5 bits）| rt（5 bits）| immediate（16 bits）。immediate：立即数或 load/store 指令和分支指令的偏移域。</li>
              <li><strong>J 型指令</strong>：op（6 bits）| target address（26 bits）。target address：无条件转移的地址低 26 位，将 PC 高 4 位（放在第 4 位）拼上 26 位直接地址，最后补 2 个 "0" 就成 32 位目标地址。</li>
            </ul>
            <table class="tbl">
              <thead><tr><th>格式</th><th>指令</th><th>示例（课件）</th><th>说明（课件）</th><th>功能码/操作码</th></tr></thead>
              <tbody>
                <tr><td>R 型</td><td>add</td><td>add $1,$2,$3</td><td>$1=$2+$3；rd←rs+rt，其中 rs=$2、rt=$3、rd=$1</td><td>func=100000</td></tr>
                <tr><td>R 型</td><td>addu</td><td>addu $1,$2,$3</td><td>$1=$2+$3；rd←rs+rt</td><td>func=100001</td></tr>
                <tr><td>R 型</td><td>sub</td><td>sub $1,$2,$3</td><td>$1=$2−$3；rd←rs−rt</td><td>func=100010</td></tr>
                <tr><td>R 型</td><td>subu</td><td>subu $1,$2,$3</td><td>$1=$2−$3；rd←rs−rt</td><td>func=100011</td></tr>
                <tr><td>R 型</td><td>and</td><td>and $1,$2,$3</td><td>$1=$2 &amp; $3；rd←rs &amp; rt</td><td>func=100100</td></tr>
                <tr><td>R 型</td><td>or</td><td>or $1,$2,$3</td><td>$1=$2 | $3；rd←rs | rt</td><td>func=100101</td></tr>
                <tr><td>R 型</td><td>xor</td><td>xor $1,$2,$3</td><td>$1=$2 xor $3；rd←rs xor rt</td><td>func=100110</td></tr>
                <tr><td>R 型</td><td>nor</td><td>nor $1,$2,$3</td><td>$1=~($2 | $3)</td><td>func=100111</td></tr>
                <tr><td>I 型</td><td>addi</td><td>addi $1,$2,$3</td><td>$1=$2+$3；rt←rs+sign-ext(immediate)</td><td>opcode=001000</td></tr>
                <tr><td>I 型</td><td>addiu</td><td>addiu $1,$2,$3</td><td>$1=$2+$3；rt←rs+sign-ext(immediate)</td><td>opcode=001001</td></tr>
                <tr><td>I 型</td><td>andi</td><td>andi $1,$2,$3</td><td>$1=$2 &amp; $3；(zero-extend)immediate &amp; rs</td><td>opcode=001100</td></tr>
                <tr><td>I 型</td><td>ori</td><td>ori $1,$2,$3</td><td>$1=$2 | $3</td><td>opcode=001101</td></tr>
                <tr><td>I 型</td><td>xori</td><td>xori $1,$2,$3</td><td>$1=$2 xor $3</td><td>opcode=001110</td></tr>
                <tr><td>I 型</td><td>lui</td><td>lui $1,100</td><td>$1=100×2^16，将 16 位立即数左移 16 位</td><td>opcode=001111（rs=00000）</td></tr>
                <tr><td>I 型</td><td>beq</td><td>beq rs,rt,offset</td><td>条件分支，相等时转移</td><td>opcode=000100</td></tr>
                <tr><td>J 型</td><td>j</td><td>j 10000</td><td>PC←PC[31:28]∥address,0</td><td>opcode=000010</td></tr>
                <tr><td>J 型</td><td>jal</td><td>jal 10000</td><td>$31←PC+4；PC←PC[31:28]∥{address,0}</td><td>opcode=000011</td></tr>
              </tbody>
            </table>
            <p><strong>2. RISC V 指令集</strong>：<em>课件图示：RISC-V 指令格式——六种格式（32 位定长）：</em></p>
            <table class="tbl">
              <thead><tr><th>格式</th><th>字段（高位→低位）</th></tr></thead>
              <tbody>
                <tr><td>R-type</td><td>funct7 | rs2 | rs1 | funct3 | rd | opcode</td></tr>
                <tr><td>I-type</td><td>imm[11:0] | rs1 | funct3 | rd | opcode</td></tr>
                <tr><td>S-type</td><td>imm[11:5] | rs2 | rs1 | funct3 | imm[4:0] | opcode</td></tr>
                <tr><td>B-type</td><td>imm[12] | imm[10:5] | rs2 | rs1 | funct3 | imm[4:1] | imm[11] | opcode</td></tr>
                <tr><td>U-type</td><td>imm[31:12] | rd | opcode</td></tr>
                <tr><td>J-type</td><td>imm[20] | imm[10:1] | imm[19:12] | rd | opcode</td></tr>
              </tbody>
            </table>
            <p><em>课件图示：32-bit RISC-V instruction formats 图——按 Register-register / Immediate / Upper immediate / Store / Branch / Jump 六行给出 31～0 位的字段划分，并注释：opcode（7 bits）部分指明属于六种格式中的哪一种；funct3 与 funct7（10 bits）进一步指明要执行的操作；rd（5 bits）指明计算结果送往的目的寄存器；rs1、rs2（各 5 bits）指明源寄存器操作数。</em></p>
            <p><em>课件图示：RISC-V 指令格式表——依次列出 lui、auipc、jal、jalr，B 型（beq/bne/blt/bge/bltu/bgeu），load（lw/lh/lhu/lb/lbu），store（sw/sh/sb），I 型运算（addi/andi/ori/xori/slti/sltiu 等），移位（slli/srli/srai），R 型运算（add/sub/sll/slt/sltu/xor/srl/sra/or/and）以及 fence、ecall、ebreak、CSR 系列（csrrw/csrrs/csrrwi/csrrsi/csrrc）的字段划分；lui、jal、jalr、beq、blt、lw、sw、addi、add 等重点指令被红框标出。</em></p>
            <p><strong>3. ARM 指令集</strong>：<em>课件图示：ARM 架构指令集汇总表（MRS、MSR、MUL、MLA、B、BL、LDR/STR 系列、STM/LDM、SWI 等各指令的位图）。</em></p>
            <p>指令格式基本格式：<code>&lt;opcode&gt;{&lt;cond&gt;}{S} &lt;Rd&gt;,&lt;Rn&gt;{,&lt;opcode2&gt;}</code>——</p>
            <ul>
              <li>&lt;opcode&gt;：指令助记符，如 LDR、STR 等；</li>
              <li>cond：执行条件，如 EQ、NE 等；</li>
              <li>S：是否影响 CPSR 寄存器的值，书写时影响 CPSR，否则不影响；</li>
              <li>Rd：目标寄存器；</li>
              <li>Rn：第一个操作数的寄存器；</li>
              <li>operand2：第二个操作数。</li>
            </ul>
            <p><strong>COND 条件码（条件执行）</strong>：</p>
            <table class="tbl">
              <thead><tr><th>条件码</th><th>助记符</th><th>含义</th><th>条件状态</th></tr></thead>
              <tbody>
                <tr><td>0000</td><td>EQ</td><td>相等</td><td>cpsr_z=1</td></tr>
                <tr><td>0001</td><td>NE</td><td>不相等</td><td>cpsr_z=0</td></tr>
                <tr><td>0010</td><td>CS/HS</td><td>进位标志置位 / 无符号大于或等于</td><td>cpsr_c=1</td></tr>
                <tr><td>0011</td><td>CC/LO</td><td>进位标志清零 / 无符号小于</td><td>cpsr_c=0</td></tr>
                <tr><td>0100</td><td>MI</td><td>负数 / 小于</td><td>cpsr_n=1</td></tr>
                <tr><td>0101</td><td>PL</td><td>正数或零 / 大于或等于</td><td>cpsr_n=0</td></tr>
                <tr><td>0110</td><td>VS</td><td>溢出</td><td>cpsr_v=1</td></tr>
                <tr><td>0111</td><td>VC</td><td>无溢出</td><td>cpsr_v=0</td></tr>
                <tr><td>1000</td><td>HI</td><td>无符号大于</td><td>[cpsr_c==1] &amp;&amp; [cpsr_z==0]</td></tr>
                <tr><td>1001</td><td>LS</td><td>无符号小于或等于</td><td>[cpsr_c==0] &amp;&amp; [cpsr_z==1]</td></tr>
                <tr><td>1010</td><td>GE</td><td>有符号大于或等于</td><td>[cpsr_n==cpsr_v]</td></tr>
                <tr><td>1011</td><td>LT</td><td>有符号小于</td><td>[cpsr_n!=cpsr_v]</td></tr>
                <tr><td>1100</td><td>GT</td><td>有符号大于</td><td>[cpsr_z==0] &amp;&amp; [cpsr_n==cpsr_v]</td></tr>
                <tr><td>1101</td><td>LE</td><td>有符号小于或等于</td><td>[cpsr_z==1] || [cpsr_n!=cpsr_v]</td></tr>
                <tr><td>1110</td><td>AL</td><td>无条件执行</td><td>ignored</td></tr>
                <tr><td>1111</td><td>NV</td><td>永不执行</td><td>ignored</td></tr>
              </tbody>
            </table>
            <p><em>课件图示：DP0 指令——处理方式表（Data Process）</em>：</p>
            <table class="tbl">
              <thead><tr><th>Opcode</th><th>功能格式</th></tr></thead>
              <tbody>
                <tr><td>0000</td><td>AND　Rd = Rn &amp; sec_operand</td></tr>
                <tr><td>0001</td><td>EOR　Rd = Rn ^ sec_operand</td></tr>
                <tr><td>0010</td><td>SUB　Rd = Rn - sec_operand</td></tr>
                <tr><td>0011</td><td>RSB　Rd = sec_operand - Rn</td></tr>
                <tr><td>0100</td><td>ADD　Rd = Rn + sec_operand</td></tr>
                <tr><td>0101</td><td>ADC　Rd = Rn + sec_operand + cpsr_c</td></tr>
                <tr><td>0110</td><td>SBC　Rd = Rn - sec_operand + cpsr_c - 1</td></tr>
                <tr><td>0111</td><td>RSC　Rd = sec_operand - Rn + cpsr_c - 1</td></tr>
                <tr><td>1000</td><td>TST　进 Rn &amp; sec_operand 操作，结果不写入 Rd</td></tr>
                <tr><td>1001</td><td>TEQ　进 Rn ^ sec_operand 操作，结果不写入 Rd</td></tr>
                <tr><td>1010</td><td>CMP　进 Rn - sec_operand 操作，结果不写入 Rd</td></tr>
                <tr><td>1011</td><td>CMN　进 Rn + sec_operand 操作，结果不写入 Rd</td></tr>
                <tr><td>1100</td><td>ORR　Rd = Rn | sec_operand</td></tr>
                <tr><td>1101</td><td>MOV　Rd = sec_operand</td></tr>
                <tr><td>1110</td><td>BIC　Rd = Rn &amp; ~sec_operand</td></tr>
                <tr><td>1111</td><td>MVN　Rd = ~sec_operand</td></tr>
              </tbody>
            </table>
            <p><em>课件图示：DP1 / DP2 / MULT / MULTL / MRS / B / BX / SWI 指令概述——各自 31～0 位的位图划分（DP1 含 cond 与 Opcode 字段，DP2 含 num 与 data，MULT/MULTL 含 A、S 与 Rdhi/Rdlo/Rs/Rn 等）。</em></p>
            <p><strong>4、3 种指令集的比较</strong>：<em>课件图示：ADD 指令在 3 种指令集中的机器码——ADD 指令在 MIPS 指令集中（R 型 func 字段）、ADD 指令在 RISC-V 指令集中（funct7=0000000、funct3=000、opcode=0110011，标注 R.add）、ADD 指令在 ARM 指令集中（COND 条件码 + Opcode=0100 + 寄存器字段）。</em></p>`,
        },
      ],
    },
    {
      id: 'sec-hd4-cpu',
      heading: '二、CPU 的硬件结构与 verilog 模块',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>1、CPU 的硬件组成</strong>：</p>
            <p><em>课件图示：CPU 的架构——指令寄存器与 PC 经译码逻辑进入运算逻辑，运算逻辑写回寄存器机，并向数据存储器读写；数据存储器控制信号生成电路配合工作。</em></p>
            <p><em>课件图示：单周期、多周期非流水线与多周期流水线比较——Single Cycle Implementation（Load / Store / Write 各占一个固定长周期）；Multiple Cycle Implementation（Ifetch/Reg/Exec/Mem/Wr 按步骤占用多个短周期，R-type 只需前几步）；Pipeline Implementation（多条指令重叠执行，Looks good, but…）。</em></p>
            <p><em>课件图示：细化后的单周期 CPU 硬件结构（完整数据通路，以及 Main control=蓝色、LW=黄色、BEQ=绿色、Common use elements=红色、Don't Use=黑色的彩色标注版）。</em></p>
            <p><strong>细化后的单周期数据通路逐步构建</strong>（课件按指令类型逐级扩充）：</p>
            <ul>
              <li><em>课件图示：支持 R-型指令功能的数据通路——Rd/Rs/Rt 五位地址进 32×32-bit Registers（RegWr 写使能），busA/busB 进 ALU（ALUctr：add/sub/subu/slt/sltu），输出 Overflow 与 Result。</em></li>
              <li><em>课件图示：支持 I-型带立即数运算指令功能的数据通路——增加 RegDst 0MUX1 与扩展器（imm16→32），ALUSrc 0MUX1 选择 busB 或扩展立即数（ALUctr：or/addu）。</em></li>
              <li><em>课件图示：支持 load/store 指令功能的数据通路——增加数据存储器（WrEn/Adr/DataIn）与 MemtoReg 0MUX1（MemWr 写使能）。</em></li>
              <li><em>课件图示：支持分支指令功能的数据通路——ALUctr：subu 计算 Zero 标志，下地址逻辑根据 imm16 与 Zero 产生 Branch 信号改写 PC（配合指令寄存器）。</em></li>
              <li><em>课件图示：完整的单周期数据通路——取指部件（Instruction[31:0]）配合 Branch/Jump 信号与 OP/Rs/Rt/Rd/imm 字段，RegDst、ALUSrc、MemtoReg 三个 MUX 与数据存储器连通。</em></li>
            </ul>`,
        },
      ],
    },
    {
      id: 'sec-hd4-struct',
      heading: '三、单周期与多周期流水线结构',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>1、单周期 CPU 结构的设计要点</strong>：<em>课件图示——单周期完整数据通路图（与上一节细化后的单周期 CPU 硬件结构对应）。</em></p>
            <p><strong>2、多周期非流水线 CPU 结构的设计要点</strong>：</p>
            <p><em>课件图示——多周期数据通路图（指令存储器、寄存器堆、ALU 与数据存储器经由多路选择器复用）。</em></p>
            <p><em>课件图示：控制信号生成线路——节拍状态与指令操作码共同送入「控制信号生成线路」（实现"与/或"两级构成的组合逻辑），输出全部控制信号（分别用于各个部件），并产生条件码 CZVS。</em></p>
            <p><em>课件图示：控制部件——由节拍发生器和控制信号产生线路组成，分别完成标明指令执行步骤和向各个部件提供控制信号的功能（节拍信号产生器与控制信号、WrMem/M2ALU/ALUM2R 等信号汇入多周期数据通路）。</em></p>
            <p><em>课件图示：状态转移图和指令各执行步骤的操作功能——Sif（取指周期）→Sid（译码周期）→Sexe（执行周期）→Smem（访存周期）→Swb（写回周期）的状态转移，J 指令由 Sid 直达 Swb、Branch 指令由 Sexe 分支、SW 指令经 Smem、LW 指令经 Smem 到 Swb。</em>配套的指令执行步骤表：</p>
            <table class="tbl">
              <thead><tr><th>指令步骤</th><th>读取指令</th><th>执行运算</th><th>内存读写</th><th>数据写回</th></tr></thead>
              <tbody>
                <tr><td>J 指令</td><td rowspan="5">IR←MEM[PC]，PC←PC+4</td><td>PC←PC[31:28]∥((target)&lt;&lt;2)</td><td>—</td><td>—</td></tr>
                <tr><td>Branch 指令</td><td>若条件成立 PC←PC+R</td><td>—</td><td>—</td></tr>
                <tr><td>R 类型</td><td>A←Reg[rs]，C←A op B</td><td>—</td><td>Reg[rd]←C</td></tr>
                <tr><td>Sw 指令</td><td>C←A+符号扩展(imm)</td><td>Mem[C]←B</td><td>—</td></tr>
                <tr><td>Lw 指令</td><td>—</td><td>DR←Mem[C]</td><td>Reg[rt]←DR</td></tr>
              </tbody>
            </table>
            <p><em>课件图示：Control Unit——Main Controller（FSM）接收 Opcode 与 Funct，输出 Multiplex Selects（MemtoReg、RegDst、IorD、PCSrc、ALUSrcB、ALUSrcA）与 Register Enables（IRWrite、MemWrite、PCWrite、Branch、RegWrite）；ALUOp 送 ALU Decoder（与 Funct 一起）产生 ALUControl。</em></p>
            <p><em>课件图示：Control FSM（verilog 中有限状态机：时序电路）——状态转移图，Reset 后按 Op='R' / Op='J' / Op='BEQ' / Op='SW' / Op='LW' / Op=ADDI 进入相应状态，各状态标注 ALUSrcA/ALUSrcB/ALUOp/PCSrc/IRWrite 等取值，Fetch 状态（IorD=1、MemWrite=0、RegWrite=0）与 WriteReg 状态等。</em></p>
            <p><em>课件图示：FSM Implementation——组合控制逻辑（Combinational control logic）由「来自指令寄存器操作码字段的输入 + 状态寄存器（State register）」产生 Datapath control outputs 与 Next state——使用有限状态机标志执行步骤。</em></p>
            <p><strong>3、多周期流水线 CPU 结构的设计要点</strong>：</p>
            <p><em>课件图示：流水线的（各个阶）段寄存器——IF/ID、ID/EX、EX/MEM、MEM/WB 四级流水线寄存器把数据通路逐段切开。</em></p>
            <p><em>课件图示：设计时注意事项——带流水线寄存器的完整数据通路图。</em></p>
            <p><em>课件图示：流水线控制的实现——在 RF/ID 阶段生成控制信号：1 个时钟周期后使用 EX 要用的控制信号、2 个时钟周期后使用 MEM 要用的控制信号、3 个时钟周期后使用 WB 要用的控制信号（ExtOp/ALUSrc/ALUCtrl/RegDst/MemWr/Branch/MemtoReg/RegWr 等信号沿流水线寄存器逐级传递）。</em></p>
            <p><em>课件图示：支持流水的 CPU——完整流水线数据通路（各段寄存器与转发线路）。</em></p>
            <p><em>课件图示：能处理数据冲突的数据通路——Hazard detection unit（检测 (ID/EX.MemRead) 等条件）与 Forwarding unit（根据 IF/ID.RegisterRs/Rt 与 ID/EX.RegisterRs/Rt 生成转发控制），配合 PC、Instruction memory、Registers、ALU 与 Data memory。</em></p>`,
        },
      ],
    },
    {
      id: 'sec-hd4-code',
      heading: '四、典型模块结构，verilog 代码分析',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>译码控制模块最复杂</strong>——译码控制模块主要功能有：</p>
            <ol>
              <li>根据指令的操作码，控制运算器进行相应的加、减、与、或、自减等运算所需的控制信号；</li>
              <li>根据指令的地址码，控制寄存器读出数据的值、立即数的符号扩展；</li>
              <li>根据指令的地址码，发出对存储器进行读、写的控制信号。</li>
            </ol>
            <p><strong>其次是运算模块</strong>——运算模块主要功能有：</p>
            <ol>
              <li>根据译码模块发出的控制信号，进行相应的加、减、与、或、自减等运算；</li>
              <li>根据运算结果，设置标志位（零、符号、溢出、进位）；</li>
              <li>运算结果通过对应的临时寄存器。</li>
            </ol>
            <p><strong>MIPS 指令集中，译码控制模块代码</strong>——<em>课件给出四种 verilog 写法的代码截图：</em></p>
            <ul>
              <li>第一种 verilog 写法（先定义字符常量）：case 逐条列出 EXE_OR / EXE_AND / EXE_XOR 等字符常量分支，为写使能、aluop、寄存器读地址赋值；再以 case(Opcode)（R_TYPE_INST_R_TYPE_OP 等）配合 case(funct)（INST_SUB_FUNCT → Aluctrl = ALOC_SUB）两级译码，逐信号给出 jump/RegDst/Branch/MemR/Mem2R/MemW/RegW/Alusrc/ExtOp 等取值。</li>
              <li>第二种 verilog 写法（不需要定义字符常量）：直接指定控制信号构成的二进制数值对应的控制变量——assign {branch, RegisALLD, …} = CtrlCode，再以 case(op) 对每条指令给出 CtrlCode 的位串。</li>
              <li>第四种 verilog 写法（将多个信号的 1/0 或非运算，赋值给对应的控制变量）：多位控制信号按指令字段直接连接（写寄存器地址、读寄存器 A/B 地址），单值控制信号（branch_o ← B-type、jump_o ← J-type、mem_to_reg_o ← Load、reg_wt_o ← R-type/Load、mem_wt_o ← Store 等）由多个 op[6]&amp;op[5]&amp;… 的或非表达式组合而成。</li>
            </ul>
            <p><strong>运算模块代码</strong>：运算器可以实现加/减/乘/除/与/或/非/移位/比较大小/置位等基本操作——</p>
            <pre class="code"><code>always @(*) begin
 case (OP)
 0:  RESULT &lt;= X + Y;                          // add
 1:  RESULT &lt;= X - Y;                          // sub
 2:  RESULT &lt;= X &amp; Y;                          // and
 3:  RESULT &lt;= X | Y;                          // or
 4:  RESULT &lt;= X ^ Y;                          // xor
 5:  RESULT &lt;= X &lt;&lt; Y;                         // shift left logical
 6:  RESULT &lt;= X &gt;&gt; Y;                         // shift right logical
 7:  RESULT &lt;= X_signed &gt;&gt;&gt; Y;                 // shift right arithmetic
 8:  RESULT &lt;= X * Y;                          // mul
 9:  RESULT &lt;= X * Y;                          // mulh
 10: RESULT &lt;= X / Y;                          // div
 11: RESULT &lt;= X % Y;                          // rem
 12: RESULT &lt;= (X_signed &lt; Y_signed ? 1 : 0);  // set less than (slt)
 13: RESULT &lt;= (X &lt; Y ? 1 : 0);                // set less than (sltu)
 endcase</code></pre>`,
        },
      ],
    },
    {
      id: 'sec-hd4-final',
      heading: 'CPU 测试与开发板借用',
      blocks: [
        {
          type: 'html',
          html: `
            <p>三类设计任务均可<strong>基于 MIPS 指令集</strong>或<strong>基于 RISCV 指令集</strong>实现：1、单周期 CPU 设计；2、多周期非流水线 CPU 设计；3、多周期流水线 CPU 设计。</p>
            <p><strong>4、对所设计的 CPU 进行测试</strong>：</p>
            <ol>
              <li>编写一个汇编代码，变换成机器码，在所设计的 CPU 上跑这个代码，将每条指令的输出信号波形进行截图。</li>
              <li>在已有的 CPU 基础上跑一个应用程序，比如控制数码管显示斐波拉契数列，或者跑个团吃蛇游戏、俄罗斯方块游戏等等（游戏界面可以显示到 VGA 显示器上）。</li>
            </ol>
            <p><strong>5、课设中需要用到的开发板</strong>：每个班最多可以借 8 块开发板，国庆节 2 周后会发可以借开发板的通知。从老师处借走开发板的同学需要留个借条，借条上写上你的班级 / 姓名 / 学号 / 联系电话。开发板可以在学期结束课设验收后归还，归还时取走你的借条。</p>
            <div class="callout key">
              <p class="callout-h">验收对照</p>
              <p>第 1 讲（RISC-V 多周期流水线）与第 2、3 讲（MIPS32 单周期）分别对应本讲 2、3 类设计任务；仿真波形截图对应测试要求第 1 条，数码管显示斐波那契数列对应测试要求第 2 条。</p>
            </div>`,
        },
      ],
    },
  ],
};

export default ch4;
