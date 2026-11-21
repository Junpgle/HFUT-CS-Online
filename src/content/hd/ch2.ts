/* 第2讲 单周期 CPU 展示（MIPS32）—— 逐节转录自 课件/单周期cpu相关资料（及格版）/硬件综合展示.pptx（30 页）；
   核心模块功能表与文件列表按课件原图整理为表格/树状图，其余框图/真值表/波形以「课件图示」注明。 */
import type { HdUnit } from './types';

const ch2: HdUnit = {
  id: 'hd2',
  no: '第2讲',
  title: '单周期 CPU 展示：MIPS32',
  subtitle: '设计目标与开发环境 · 28 条 MIPS 指令 · 五阶段数据通路 · 逐模块代码讲解 · COE 测试与上板',
  lede:
    '<p>本讲为 MIPS32 单周期 CPU 的完整展示（及格版资料）：自主实现 32 位精简指令集（RISC）处理器核心，遵循 MIPS32 指令架构规范，支持 R/I/J 三类核心指令，确保图灵完备性，并在 Xilinx FPGA 开发板上成功运行斐波那契数列等测试程序。</p>',
  toc: [
    { id: 'sec-hd2-goal', text: '设计目标与指令集', level: 2 },
    { id: 'sec-hd2-arch', text: '总体结构与五阶段', level: 2 },
    { id: 'sec-hd2-modules', text: '模块列表与项目文件', level: 2 },
    { id: 'sec-hd2-if', text: '顶层模块——取指', level: 2 },
    { id: 'sec-hd2-id', text: '顶层模块——译码', level: 2 },
    { id: 'sec-hd2-ex', text: '顶层模块——执行', level: 2 },
    { id: 'sec-hd2-mem', text: '顶层模块——访存', level: 2 },
    { id: 'sec-hd2-wb', text: '顶层模块——写回与下地址选择', level: 2 },
    { id: 'sec-hd2-ctrl', text: 'controller.v 详解', level: 2 },
    { id: 'sec-hd2-pc', text: 'pc_reg.v 与 regfile.v', level: 2 },
    { id: 'sec-hd2-alu', text: 'alu.v 详解', level: 2 },
    { id: 'sec-hd2-test', text: 'COE 测试与上板验证', level: 2 },
  ],
  sections: [
    {
      id: 'sec-hd2-goal',
      heading: '设计目标与指令集',
      blocks: [
        {
          type: 'html',
          html: `
            <ul>
              <li>自主实现 32 位精简指令集（RISC）处理器核心；</li>
              <li>遵循 MIPS32 指令架构规范；</li>
              <li>支持 R/I/J 三类核心指令，确保图灵完备性；</li>
              <li>在 Xilinx FPGA 开发板上成功运行斐波那契数列等测试程序。</li>
            </ul>
            <p><strong>开发环境</strong>：芯片方案 Xilinx Artix-7（Ego1 开发板）· 开发工具 Vivado 2019.1 · 编程语言 Verilog HDL。</p>
            <p>本项目实现了 <strong>28 条标准 MIPS 指令</strong>，覆盖了运算、逻辑、访存及控制流：</p>
            <ul>
              <li><strong>R 型（16 条）</strong>：add、sub、and、or、xor、nor、slt、sll、srl、sra、sllv、srlv、srav、jr、jalr、addu、subu 等；</li>
              <li><strong>I 型（11 条）</strong>：addi、addiu、andi、ori、xori、lw、sw、beq、bne、slti、sltiu；</li>
              <li><strong>J 型（2 条）</strong>：j、jal。</li>
            </ul>
            <p>同时，对于暂时未实现的部分指令预留了接口——以下指令在代码中存在 case 分支，但逻辑块为空 begin end，可作为后续升级方向：</p>
            <ul>
              <li>跳转类：jr、jalr、jal；</li>
              <li>访存类：lb、lh、sb、sh、lui 等；</li>
              <li>算术类：mult、div 等乘除法；</li>
              <li>系统/特殊：syscall、break、mfhi、mflo 等。</li>
            </ul>`,
        },
      ],
    },
    {
      id: 'sec-hd2-arch',
      heading: '总体结构与五阶段',
      blocks: [
        {
          type: 'html',
          html: `
            <p><em>课件图示：总体结构设计图——IF Stage → ID Stage → EX Stage → MEM Stage → WB Stage 五段数据通路（含 Clock Divider 时钟分频与 7-Segment Display 十六进制显示单元）。</em></p>
            <p><strong>系统宏观层次</strong>：系统最顶层（mips.v）通过硬件连线实现了数据在各个子模块间的流动。时钟分频器将开发板提供的 100MHz 高频时钟转换为 CPU 运行所需的低频工作时钟，确保了单周期逻辑在 FPGA 上的稳定性；七段数码管模块则作为调试输出，实时捕获数据存储器的写入动作，直观展示程序运行状态。</p>
            <p><strong>CPU 核心数据通路（Datapath）</strong>遵循 MIPS 指令执行的五个逻辑阶段，并在一个时钟周期内并行完成：</p>
            <ul>
              <li><strong>第一阶段：取指（IF）</strong>——PC 寄存器存储当前待执行指令的地址，在时钟边沿到来时根据下一地址逻辑（next_pc）更新当前地址；指令存储器（Inst Mem）以 PC 值为地址，异步读出对应的 32 位机器码；顺序地址计算（PC+4）由专用的加法器（Adder）计算当前 PC 偏移 4 字节后的地址，作为默认的下一条执行地址。</li>
              <li><strong>第二阶段：译码与控制（ID）</strong>——控制器（Controller）是系统的「大脑」，接收指令的高 6 位（OpCode）和低 6 位（Funct），通过组合逻辑瞬间产生所有控制信号；寄存器堆（Regfile）提供 32 个通用寄存器，支持双端口读和单端口写，根据指令字段提取源寄存器（Rs、Rt）的数据；立即数扩展（SE/UE）根据控制信号 zero_extern，将指令中的 16 位立即数进行符号扩展或零扩展，以适配 32 位运算需求。</li>
              <li><strong>第三阶段：执行与运算（EX）</strong>——ALU 执行核心计算，其第一个操作数来自寄存器 Rs（或 shamt），第二个操作数由 alusrc 信号决定，从寄存器 Rt 或扩展后的立即数中通过 MUX（二选一选择器）选取；分支/跳转计算通过左移位模块（sl2）处理偏移量，分支加法器计算 PC+4 与偏移量的和，跳转逻辑通过拼接指令字段与 PC 高位产生最终跳转目标地址。</li>
              <li><strong>第四阶段：访存（MEM）</strong>——ALU 的计算结果作为内存地址，memread 和 memwrite 信号控制对内存的访问；对于 sw 指令将寄存器 Rt 的值存入内存，对于 lw 指令从内存读出数据。</li>
              <li><strong>第五阶段：写回（WB）</strong>——写回数据选择由 memtoreg 信号控制的 MUX 决定：最终写回寄存器的是 ALU 的运算结果（R 型/立即数指令）还是来自内存的读取结果（lw 指令）；写回地址选择由 regdest 信号决定写入地址是 Rt 还是 Rd。</li>
            </ul>`,
        },
      ],
    },
    {
      id: 'sec-hd2-modules',
      heading: '模块列表与项目文件',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>核心模块功能表</strong>（课件原文）：</p>
            <table class="tbl">
              <thead><tr><th>模块名称</th><th>功能描述</th></tr></thead>
              <tbody>
                <tr><td>mips.v</td><td>顶层模块，连接所有子模块</td></tr>
                <tr><td>controller.v</td><td>指令译码，生成所有控制信号</td></tr>
                <tr><td>alu.v</td><td>算术/逻辑运算单元，支持多种计算</td></tr>
                <tr><td>regfile.v</td><td>32 个 32 位通用寄存器，双端口读写</td></tr>
                <tr><td>pc_reg.v</td><td>程序计数器，存储当前指令地址</td></tr>
                <tr><td>inst_mem</td><td>指令存储器（Block RAM）</td></tr>
                <tr><td>data_mem</td><td>数据存储器（Block RAM）</td></tr>
                <tr><td>seg7.v</td><td>七段数码管驱动，动态扫描显示</td></tr>
              </tbody>
            </table>
            <p><strong>辅助模块</strong>：</p>
            <ul>
              <li>sl2.v —— 移位器（分支地址计算）；</li>
              <li>se.v —— 符号扩展（[16]→[32]）；</li>
              <li>ue.v —— 零扩展（[16]→[32]）；</li>
              <li>dup_mux.v —— 2 选 1 多路选择器；</li>
              <li>alu_branch —— 分支地址结果 2 选 1 选择器；</li>
              <li>sl2_jump —— 跳转地址左移 2 位。</li>
            </ul>
            <p><strong>项目中的文件</strong>（课件原图：顶层 mips.v 共 19 个子实例）：</p>
            <pre class="code"><code>mips.v (19)
├── inst_mem              inst_mem          (inst_mem.v)
├── pc_reg                pc_reg            (pc_reg.v)
├── pcplus4               adder             (adder.v)
├── controller            controller        (controller.v)
├── write_register_addr   dup_mux           (dup_mux.v)
├── regfile               regfile           (regfile.v)
├── se                    se                (se.v)
├── ue                    ue                (ue.v)
├── se_or_ue_imm_to_alu   dup_mux           (dup_mux.v)
├── alu_op2               dup_mux           (dup_mux.v)
├── alu                   alu               (alu.v)
├── datamem               data_mem          (data_mem.v)
├── sl2_branch_addr       sl2_branch_addr   (sl2_branch_addr.v)
├── branch_addr_adder     adder             (adder.v)
├── sl2_jump_addr         sl2_jump_addr     (sl2_jump_addr.v)
├── mem_or_alu            dup_mux           (dup_mux.v)
├── branch_or_pcplus4     dup_mux           (dup_mux.v)
├── jump_or_other         dup_mux           (dup_mux.v)
└── seg7                  seg7              (seg7.v)

cmp.v / tri_mux.v（顶层辅助设计文件）</code></pre>`,
        },
      ],
    },
    {
      id: 'sec-hd2-if',
      heading: '顶层模块——取指',
      blocks: [
        {
          type: 'html',
          html: `
            <pre class="code"><code>// 指令存储器：根据PC值读取指令
inst_mem  inst_mem (
    .clka(~div_clk),
    .addra(pc),
    .douta(instruction)
);
// PC寄存器：生成下一条指令地址
pc_reg pc_reg(
    .clk(div_clk),
    .rst(~rst),
    .en(~stall),
    .pc_in(next_pc),
    .pc_out(pc)
);
// 加法器：计算PC+4，用于顺序执行和跳转返回地址
adder pcplus4(
    .a(pc),
    .b(4),
    .result(pc_plus4)
);</code></pre>
            <p>两个功能：取指放入 instruction、PC+4 指向下一条指令。在上升沿更新 PC，在下降沿存储器读 PC——<strong>避免「时钟竞争」</strong>：如果 pc 和 div_clk 同沿变化，存储器可能采到不稳定的地址值，取反时钟能错开采样沿，提升稳定性。这样处理可以使得存储器读到的地址是一个稳定的地址；将 next_pc 放进 pc，作为更新。</p>`,
        },
      ],
    },
    {
      id: 'sec-hd2-id',
      heading: '顶层模块——译码',
      blocks: [
        {
          type: 'html',
          html: `
            <pre class="code"><code>controller controller(
    .clk(div_clk),
    .rst(~rst),
    .instruction(instruction),
    .jump(jump),
    .branch_e(branch_e),
    .branch_ne(branch_ne),
    .regdest(regdest),
    .memread(memread),
    .memwrite(memwrite),
    .memtoreg(memtoreg),
    .alusrc(alusrc),
    .regwrite(regwrite),
    .aluop(aluop),
    .is_sign(is_sign),
    .zero_extern(zero_extern),
    .use_sa(use_sa),
    .alu_sign_reset(alu_sign_reset)
);</code></pre>
            <p>输入：时钟信号，复位信号，instruction 中的机器码。<em>课件图示：控制器信号表——按信号列出各控制量的作用（branch_e/branch_ne 分支、regdest 写地址选择、memread/memwrite 访存使能、memtoreg 回写数据选择、alusrc 第二操作数选择、aluop ALU 操作码、is_sign 有符号运算使能、zero_extern 立即数扩展方式、use_sa 移位量选择、alu_sign_reset 标志复位等）。</em></p>
            <pre class="code"><code>assign rt_addr = instruction[20:16];
assign rd_addr = instruction[15:11];
// 多路选择器：根据regdest选择寄存器堆写地址（rt/rd）
dup_mux write_regiter_addr(
    .a(rt_addr),
    .b(rd_addr),
    .s(regdest),
    .out(write_data_reg_addr)
);</code></pre>
            <p><code>regdest</code> 十分关键：R 型指令的 regdest 必定为 1，则结果存储在 rd，如 <code>add $rd, $rs, $rt</code>；而 I 型指令的 regdest 为 0，则所使用的寄存器为 rt。rs 为源操作数地址。</p>
            <p>寄存器堆可读可写。读则有两个输入的地址，其中一个必定为源操作数，第二个地址要么为 rt，要么为 0 寄存器；写则有写使能信号、要写的操作数、和要写的地址。</p>
            <pre class="code"><code>// 寄存器堆读地址赋值：rs、rt地址
assign readdata1_addr = instruction[25:21];
assign readdata2_addr = regdest ? instruction[20:16] : 0;
// 寄存器堆：提供运算操作数，接收写回数据
regfile regfile(
    .clk(div_clk),
    .write_en(regwrite),
    .regaddr1(readdata1_addr),
    .regaddr2(readdata2_addr),
    .data_out1(readdata1),
    .data_out2(readdata2),
    .data_addr(write_data_reg_addr),
    .data_in(write_data_in)
);</code></pre>
            <p><em>课件图示：R 型指令字段图——op（6 bits）| rs（5 bits）| rt（5 bits）| rd（5 bits）| shamt（5 bits）| func（6 bits）。</em></p>`,
        },
      ],
    },
    {
      id: 'sec-hd2-ex',
      heading: '顶层模块——执行',
      blocks: [
        {
          type: 'html',
          html: `
            <p>数据流：译码阶段 → 立即数（instruction[15:0]）→ 符号/零扩展 → 选择扩展类型 → ALU 操作数 2 候选 → 寄存器堆读数据（readdata1/readdata2）→ 选择 ALU 操作数 1/2 → ALU 运算 → 结果/标志；控制器控制信号（alusrc/zero_extern/use_sa/aluop 等）→ 指导操作数选择/ALU 运算。</p>
            <pre class="code"><code>// 符号扩展（se）：保留数值的正负（用于有符号数，如addi/lw/sw/beq）
se se(
    .in(instruction[15:0]),  // 输入：指令的16位立即数字段
    .out(imm_after_se)       // 输出：32位符号扩展结果
);
// 零扩展（ue）：高位补0（用于无符号数，如andi/ori）
ue ue(
    .in(instruction[15:0]),  // 输入：指令的16位立即数字段
    .out(imm_after_ue)       // 输出：32位零扩展结果
);
dup_mux se_or_ue_imm_to_alu(
    .a(imm_after_se),   // 选项a：符号扩展结果（zero_extern=0时选）
    .b(imm_after_ue),   // 选项b：零扩展结果（zero_extern=1时选）
    .s(zero_extern),    // 选择信号：来自controller
    .out(imm_to_alu)    // 输出：最终送给ALU的32位立即数
);</code></pre>
            <pre class="code"><code>// 多路选择器：选择ALU操作数2（寄存器数据/立即数）
dup_mux alu_op2(
    .a(readdata2),
    .b(imm_to_alu),
    .s(alusrc),
    .out(aluop2)
);
// 移位量sa赋值，ALU操作数1选择（移位指令用sa/否则用rs）
assign sa = instruction[10:6];
assign aluop1 = use_sa ? {27'b0, sa} : readdata1;
alu alu(
    .a(aluop1),            // 输入：ALU操作数1
    .b(aluop2),            // 输入：ALU操作数2
    .op(aluop),            // 输入：运算类型（来自controller，4位）
    .sign_rst(alu_sign_reset), // 输入：标志复位（来自controller）
    .is_sign(is_sign),     // 输入：有符号运算使能（来自controller）
    .result(alu_result),   // 输出：32位运算结果
    .overflow(overflow),   // 输出：溢出标志（有符号运算超出范围时置1）
    .zero(zero)            // 输出：零标志（运算结果为0时置1）
);
// 零标志映射为相等标志，供分支指令判断（beq/bne）
assign equal = zero;</code></pre>
            <ul>
              <li><code>add $t0, $s1, $s2</code>（R 型）→ alusrc=0 → 选 readdata2（$s2 的值）；</li>
              <li><code>addi $t0, $s1, 10</code>（I 型）→ alusrc=1 → 选 imm_to_alu（扩展后的 10）。</li>
            </ul>
            <p>移位量 sa：指令的 10:6 位（仅移位指令 sll/srl 使用）；ALU 操作数 1 选择：use_sa=1 时用 sa（移位指令），否则用 readdata1（rs 值）。</p>
            <p><em>课件图示：I 型指令字段图——op（6 bits）| rs（5 bits）| rt（5 bits）| immediate（16 bits）；R 型指令字段图中 shamt 字段被红框标出。</em></p>`,
        },
      ],
    },
    {
      id: 'sec-hd2-mem',
      heading: '顶层模块——访存',
      blocks: [
        {
          type: 'html',
          html: `
            <pre class="code"><code>assign data_addr = alu_result;
assign writedata = readdata2;
// 数据存储器写数据：寄存器rt的值
// 数据存储器：处理lw/sw指令的读写操作
data_mem datamem (
    .clka(~div_clk),
    .wea(memwrite),
    .addra(data_addr),
    .dina(writedata),
    .douta(mem_data)
);
// 分支地址生成：立即数符号扩展后左移2位
sl2_branch_addr sl2_branch_addr(
    .in(imm_after_se),
    .out(imm_after_se_sl2)
);
assign branch_addr_after_se_sl2 = imm_after_se_sl2;
// 加法器：计算分支目标地址（PC+4 + 偏移量）
adder branch_addr_adder(
    .a(pc_plus4),
    .b(branch_addr_after_se_sl2),
    .result(branch_addr)
);
// 跳转地址生成：26位偏移左移2位
sl2_jump_addr sl2_jump_addr(
    .in(instruction[25:0]),
    .out(j_addr_after_sl2)
);
// 拼接生成32位跳转地址：PC+4高4位 + 偏移量
assign j_addr = {pc_plus4[31:28], j_addr_after_sl2};</code></pre>
            <p>在 ALU 中计算出一个 alu_result，前面还有 readdata2，分情况说明；后半部分主要是分支跳转计算地址。如 <code>beq $1 $2 lable</code>，那么要跳转到的地址就是 <strong>PC+4+（lable 偏移量×4）</strong>。一条指令只能是「数据访存类（lw/sw）」或「控制流类（beq/bne/j）」，不会同时触发两部分逻辑。</p>`,
        },
      ],
    },
    {
      id: 'sec-hd2-wb',
      heading: '顶层模块——写回与下地址选择',
      blocks: [
        {
          type: 'html',
          html: `
            <pre class="code"><code>// 多路选择器：选择寄存器堆写回数据（ALU结果/内存读取数据）
dup_mux mem_or_alu(
    .a(alu_result),
    .b(mem_data),
    .s(memtoreg),
    .out(write_data_in)
);
// 多路选择器：选择分支地址或PC+4
dup_mux branch_or_pcplus4(
    .a(pc_plus4),
    .b(branch_addr),
    .s( (branch_e &amp;&amp; equal) || (branch_ne &amp;&amp; ~equal) ),
    .out(pc_pcplus4_branch)
);
// 多路选择器：选择跳转地址或分支/PC+4地址（最终下一条PC值）
dup_mux jump_or_other(
    .a(pc_pcplus4_branch),
    .b(j_addr),
    .s(jump),
    .out(next_pc)
);</code></pre>
            <p><strong>下地址选择</strong>：默认下一个地址是 PC+4；通过 <code>(branch_e &amp;&amp; equal) || (branch_ne &amp;&amp; ~equal)</code> 语句判断是否有跳转，通过二选一选择器，将下一个地址赋值——要么是跳转的目标地址，要么是 PC+4。memtoreg 是一个标志，表明现在的数据是从内存中取的还是从 ALU 中算的，通过二选一选择器，二选其一写回数据。</p>`,
        },
      ],
    },
    {
      id: 'sec-hd2-ctrl',
      heading: 'controller.v 详解',
      blocks: [
        {
          type: 'html',
          html: `
            <pre class="code"><code>module controller(
    input  [31:0] instruction,
    output reg jump, branch_e, branch_ne, regdest, memread,
    output reg memwrite, memtoreg, alusrc, regwrite,
    output reg [3:0] aluop,
    // ... 其他标志位信号
);
always @(*) begin
    // 1. 默认值设置：防止组合逻辑产生电平锁存器(Latch)，保证系统安全
    {jump, branch_e, branch_ne, regdest, memread, memwrite,
     memtoreg, alusrc, regwrite} = 9'b000000000;
    aluop = 4'b0000;
    if(rst) begin
        // 复位逻辑：清空所有控制信号
    end else begin
        // 2. 指令译码核心：采用"两级 Case"扫描结构
        case (instruction[31:26])   // 第一级：根据 OpCode 分类指令
            6'b000000: begin        // R型指令 (add, sub, and, sll...)
                regdest  &lt;= 1;      // 目标寄存器为 rd
                regwrite &lt;= 1;      // 需要写回寄存器
                case (instruction[5:0])   // 第二级：根据 Funct 确定运算类型
                    6'h20: aluop &lt;= 4'b0000;               // add
                    6'h22: aluop &lt;= 4'b0001;               // sub
                    6'h00: begin use_sa &lt;= 1; aluop &lt;= 4'b0111; end // sll
                    // ... 其他 R 型指令
                endcase
            end
            6'h02: jump &lt;= 1;       // J型指令 (j)
            6'h23: begin            // I型指令 (lw)
                alusrc &lt;= 1; memread &lt;= 1; memtoreg &lt;= 1; regwrite &lt;= 1;
            end
            6'h04: begin            // I型指令 (beq)
                branch_e &lt;= 1; alusrc &lt;= 0; aluop &lt;= 4'b0001;
            end
            // ... 其他 I 型指令 (addi, sw, bne 等)
            default: ;              // 未定义指令处理
        endcase
    end
end
endmodule</code></pre>
            <p><strong>双级 Case 嵌套译码</strong>：实现上采用了两级嵌套结构——第一级 Case 通过指令的高 6 位（OpCode）识别指令类型（R/I/J）；第二级 Case 专门针对 R 型指令，通过低 6 位（Funct）细分具体的运算操作（如 add 或 sll）。这种分层设计使得指令集的扩展非常容易，且逻辑路径清晰。</p>
            <p><strong>信号解析示例</strong>（R 型）：<code>6'h20: begin aluop &lt;= 4'b0000; alu_sign_reset &lt;= 0; end</code>——指令 <code>add $rd, $rs, $rt</code>（有符号加法）：aluop=0000 表示 ALU 执行有符号加法（如 $rd = $rs + $rt，溢出时置 overflow 标志）；alu_sign_reset=0 表示不复位 ALU 的状态标志（保留溢出/零标志，供后续判断）；is_sign 未显式赋值→默认 1（有符号运算，符合 add 指令语义）。</p>
            <p><strong>信号解析示例</strong>（I 型）：<code>beq $s0, $s1, 8</code>——branch_e 启用相等分支；alusrc 使用寄存器而不是立即数；aluop 为 1，减法运算；regwrite 禁止写寄存器；alu_sign_reset 为 0，不复用 ALU 的溢出或零标志，有单独的 zero 来判断是否跳转。</p>
            <p><em>课件图示：控制器信号真值表——按指令类型（R 型算逻、I 型、分支、lw/sw、j/jal）列出各控制信号取值与功能描述。</em></p>`,
        },
      ],
    },
    {
      id: 'sec-hd2-pc',
      heading: 'pc_reg.v 与 regfile.v',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>程序计数器</strong>：</p>
            <pre class="code"><code>module pc_reg(
    input wire clk,
    input wire rst,
    input wire en,
    input wire [31:0] pc_in,
    output reg [31:0] pc_out
);
always @(posedge clk, posedge rst) begin
    if(rst) begin
        pc_out &lt;= 0;
    end
    else if(en) begin
        pc_out &lt;= pc_in;
    end
end
endmodule</code></pre>
            <p><strong>寄存器堆</strong>（32 个 32 位通用寄存器）：</p>
            <pre class="code"><code>module regfile(
    input wire clk,
    input wire write_en,
    input wire [4:0] regaddr1, regaddr2,
    output wire [31:0] data_out1, data_out2,
    input wire [4:0] data_addr,
    input wire [31:0] data_in
);
reg [31:0] register[31:0];
always @(negedge clk) begin
    if(write_en) begin
        register[data_addr] &lt;= data_in;
    end
end
assign data_out1 = (regaddr1==0) ? 0 : register[regaddr1];
assign data_out2 = (regaddr2==0) ? 0 : register[regaddr2];
endmodule</code></pre>
            <p>读时通过 regaddr1、regaddr2 读出 data_out1、data_out2；写时通过写使能信号 write_en、写入的地址 data_addr、写入的内容 data_in 实现写入功能。</p>`,
        },
      ],
    },
    {
      id: 'sec-hd2-alu',
      heading: 'alu.v 详解',
      blocks: [
        {
          type: 'html',
          html: `
            <p>通过 is_sign 标志决定做有符号还是无符号运算；在有符号运算中，需要判断 overflow（溢出）——对两运算数的符号位（最高位）比较，还要和最终结果的符号位比较。</p>
            <p>移位运算（4'b0111，sll）采用<strong>逐级移位</strong>实现：</p>
            <pre class="code"><code>4'b0111: begin
    sa &lt;= a[4:0];
    temp = b;
    if(sa[4]) begin
        temp = {temp[31-16:0], 16'b0};
    end
    if(sa[3]) begin
        temp = {temp[31-8:0], 8'b0};
    end
    if(sa[2]) begin
        temp = {temp[31-4:0], 4'b0};
    end
    if(sa[1]) begin
        temp = {temp[31-2:0], 2'b0};
    end
    if(sa[0]) begin
        temp = {temp[31-1:0], 1'b0};
    end
    result = temp;
    overflow &lt;= 0;
end</code></pre>`,
        },
      ],
    },
    {
      id: 'sec-hd2-test',
      heading: 'COE 测试与上板验证',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>如何引入机器码进行测试</strong>：通过配置 COE 文件，使用 inst_mem 可读取该文件的所有配置。</p>
            <pre class="code"><code>inst_mem  inst_mem (
    .clka(~clk),
    .addra(pc),
    .douta(instruction)
);</code></pre>
            <p>指令执行流程示例：</p>
            <pre class="code"><code>时钟周期1: PC = 0x00000000
→ Inst Mem[0] → instruction = 0x2001001e
→ Controller 解码: addi $1, $0, 0x001e
→ ALU执行: $0 + 0x001e = 0x001e
→ 写回: $1 = 0x001e
→ PC = PC + 4 = 4

时钟周期2: PC = 0x00000004
→ Inst Mem[1] → instruction = 0x200a0000
→ 执行 addi $10, $0, 0
→ PC = 8
... 依此类推 ...</code></pre>
            <p><strong>斐波那契数列的输出</strong>：重点关注 write_data 和 data_addr——write_data 代表当前斐波那契数，data_addr 代表这是第几个斐波那契数。每当时钟上升沿：</p>
            <table class="tbl">
              <thead><tr><th>序号</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th></tr></thead>
              <tbody>
                <tr><td>输出</td><td>1</td><td>1</td><td>2</td><td>3</td><td>5</td><td>8</td><td>13</td><td>21</td></tr>
              </tbody>
            </table>
            <p>符合斐波那契数列的规律。</p>
            <p><strong>数码管显示</strong>：32 位数拆分为 4×8，每个数码管显示 4 位，而通过 16 进制表示就只用一位：</p>
            <table class="tbl">
              <thead><tr><th>十进制</th><th>1</th><th>1</th><th>2</th><th>3</th><th>5</th><th>8</th><th>13</th><th>21</th><th>34</th><th>55</th></tr></thead>
              <tbody>
                <tr><td>十六进制</td><td>1</td><td>1</td><td>2</td><td>3</td><td>5</td><td>8</td><td>d</td><td>15</td><td>22</td><td>37</td></tr>
              </tbody>
            </table>`,
        },
      ],
    },
  ],
};

export default ch2;
