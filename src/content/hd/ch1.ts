/* 第1讲 最终验收：RISC-V 多周期流水线 CPU —— 逐节转录自 课件/2021214710-杨程锦-计科21-1班-系统硬件综合设计/杨程锦-最终验收ppt.pptx（34 页）；
   RV32I 指令集表按课件原图整理为表格，其余框图/波形以「课件图示」注明。 */
import type { HdUnit } from './types';

const ch1: HdUnit = {
  id: 'hd1',
  no: '第1讲',
  title: '最终验收：RISC-V 多周期流水线 CPU',
  subtitle: 'RISC-V 简介 · 总体结构 · RV32I 37 条指令 · 主要器件 · 冒险处理 · 仿真',
  lede:
    '<p>本讲为「基于 RISC-V 精简指令集架构的多周期流水线 CPU 的设计」最终验收讲稿（杨程锦、韩宇）：设计指令条数为 37 条，对于指令执行时可能产生的冒险与冲突能够采取相应的方法合理解决，并设计了 32 位全加器以及移位器用于 ALU 计算。</p>',
  toc: [
    { id: 'sec-hd1-intro', text: 'RISC-V 简介与分工', level: 2 },
    { id: 'sec-hd1-goal', text: '设计目标与总体结构', level: 2 },
    { id: 'sec-hd1-isa', text: 'RV32I 基本指令集（37 条）', level: 2 },
    { id: 'sec-hd1-dp', text: '数据通路与信号表', level: 2 },
    { id: 'sec-hd1-dev', text: '主要器件', level: 2 },
    { id: 'sec-hd1-fwd', text: '数据冒险与数据前推', level: 2 },
    { id: 'sec-hd1-ctrl', text: '控制冒险与加载—使用型冒险', level: 2 },
    { id: 'sec-hd1-sim', text: '仿真验证', level: 2 },
  ],
  sections: [
    {
      id: 'sec-hd1-intro',
      heading: 'RISC-V 简介与分工',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>RISC-V</strong> 是自由和模块化的 RISC 指令集，「V」包含两层意思：一是这是从 RISC I 开始设计的<strong>第五代指令集架构</strong>，二是它代表了变化（variation）和向量（vectors）。本次实验选用 RISC-V 来进行 CPU 制作，共实现 <strong>37 条指令</strong>，并进行仿真。</p>
            <p>RISC-V 综合了 ARM 和 MIPS 的优点，做到了<strong>指令功能的平衡与规整</strong>——平衡意味着在空间和时间上都控制得当，规整意味着解码单元会很好做，有大量逻辑门可以复用。另外它对指令集功能做了良好分割，以实现渐进式兼容和灵活的扩展性。最大的差别在于其为 <strong>RISC-V 基金会</strong>进行标准的制定和维护工作而非商业公司，任何人可以无偿使用该指令集开发自己的 CPU。</p>
            <p><strong>分工状况</strong>：</p>
            <table class="tbl">
              <thead><tr><th>成员</th><th>工作内容</th></tr></thead>
              <tbody>
                <tr><td>杨程锦</td><td>指令集编写、CPU 整体规划、流水线控制、ALU 优化</td></tr>
                <tr><td>韩宇</td><td>指令集编写、CPU 代码具体实现、冒险解决、仿真实现</td></tr>
              </tbody>
            </table>`,
        },
      ],
    },
    {
      id: 'sec-hd1-goal',
      heading: '设计目标与总体结构',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>设计目标</strong>：基于 RISC-V 精简指令集架构的多周期流水线 CPU 的设计——设计指令条数为 37 条；对于指令执行时可能产生的冒险与冲突，能够采取相应的方法合理解决；设计了 32 位全加器以及移位器用于 ALU 计算。</p>
            <p><strong>指令读取</strong>：通过在记事本中直接储存二进制指令来完成指令的读取调用——<code>inst_memory</code> 模块经 <code>$readmemh("D:/cpu/cpu_binary_file.txt", rom)</code> 将文本文件中的二进制指令载入指令 ROM。</p>
            <p><em>课件图示：CPU 整体设计框图——共分为三部分：数据存储器、指令存储器、risc-vCPU。</em></p>
            <p><em>课件图示：riscv_inst 部分又分为两部分——指令控制（control_inst）与数据路径（datapath_inst）。</em></p>
            <p><em>课件图示：控制部分又分为两个部分</em>——<code>main_control</code> 为主控部分，主要负责指令译码后分析指令类别，并给出相应的信号；<code>alu_control</code> 为 ALU 控制部分，只有一个输出为 ALUctl，是当作 ALU 判断条件的，用来判断 ALU 执行指令类别的。</p>
            <div class="callout tip">
              <p class="callout-h">层次小结</p>
              <p>顶层三部分（数据存储器 / 指令存储器 / risc-vCPU）→ riscv_inst 分为指令控制与数据路径 → 指令控制再分为主控 main_control 与 ALU 控制 alu_control。</p>
            </div>`,
        },
      ],
    },
    {
      id: 'sec-hd1-isa',
      heading: 'RV32I 基本指令集（37 条）',
      blocks: [
        {
          type: 'html',
          html: `
            <p>课件给出「RV32I 基本指令集」表格（含 <code>inst[31:25]</code>、<code>rs2</code>、<code>rs1</code>、<code>inst[24:20]</code>、<code>inst[19:15]</code>、<code>rd</code>、<code>inst[14:12]</code>、opcode 等字段列），指令按格式分组共 37 条：</p>
            <table class="tbl">
              <thead><tr><th>格式</th><th>指令</th><th>条数</th></tr></thead>
              <tbody>
                <tr><td>U 型</td><td>lui、auipc</td><td>2</td></tr>
                <tr><td>J 型（无条件跳转）</td><td>jal、jalr</td><td>2</td></tr>
                <tr><td>B 型（条件分支）</td><td>beq、bne、blt、bge、bltu、bgeu</td><td>6</td></tr>
                <tr><td>I 型访存（load）</td><td>lb、lh、lw、lbu、lhu</td><td>5</td></tr>
                <tr><td>S 型访存（store）</td><td>sb、sh、sw</td><td>3</td></tr>
                <tr><td>I 型运算</td><td>addi、slti、sltiu、xori、ori、andi、slli、srli、srai</td><td>9</td></tr>
                <tr><td>R 型运算</td><td>add、sub、sll、slt、sltu、xor、srl、sra、or、and</td><td>10</td></tr>
              </tbody>
            </table>
            <p>合计 <strong>37 条</strong>，与设计目标一致。</p>`,
        },
      ],
    },
    {
      id: 'sec-hd1-dp',
      heading: '数据通路与信号表',
      blocks: [
        {
          type: 'html',
          html: `
            <p><em>课件图示：datapath 介绍——完整数据通路框图（PC、寄存器堆、译码、ALU、branch_judge、流水线寄存器与各级 MUX 的连线总览）。</em></p>
            <p><em>课件图示：信号表——按 IF/ID、ID、ID EX、EX、EX MEM、MEM、MEM WB、WB 各级列出信号流动：</em>PC 与指令逐级携带；<code>imm</code>/<code>Reg_data</code> 译码后送出，<code>Reg_data_out</code>/<code>Reg_data_in</code>/<code>Reg_addr</code> 在 EX 级展开，<code>Rd_C</code>/<code>Rd_out</code> 标记目的寄存器；<code>func</code>、<code>opcode</code> 随指令传递；<code>ALU_result</code>、<code>pc_jump</code>、<code>pc_store</code>、<code>pc_order</code>、<code>loaddata</code>、<code>Rd_regs_Addr</code>、<code>ALUSrc</code>、<code>ALUCtrl</code> 以及 beq/bne/blt/bge/bltu/bgeu/jal/jalr/lui 等指令标志逐级下传；<code>RegWrite</code> 在 EX MEM/MEM/MEM WB/WB 各级均出现。</p>`,
        },
      ],
    },
    {
      id: 'sec-hd1-dev',
      heading: '主要器件',
      blocks: [
        {
          type: 'html',
          html: `
            <p>课件按流水线部分逐一介绍主要器件：</p>
            <table class="tbl">
              <thead><tr><th>器件</th><th>功能</th></tr></thead>
              <tbody>
                <tr><td>PC 寄存器</td><td>用于传递 PC 值</td></tr>
                <tr><td>Instr_decode</td><td>用于指令译码</td></tr>
                <tr><td>Registers</td><td>寄存器堆</td></tr>
                <tr><td>alu</td><td>根据传入的 ALU_CTL 来进行运算后选择合适的输出信号</td></tr>
                <tr><td>branch_judge</td><td>根据输入的跳转指令类型输出 jump_flag，后续在 EX 阶段通过二选一数据选择器来判断 PC 值</td></tr>
                <tr><td>forward_unit</td><td>根据传输的控制信号进行数据前推，输出 load_use_flag 以及三个 forward</td></tr>
                <tr><td>mux3_1</td><td>数据前推模块产生的控制信号来选择输入 ALU 的数据来源</td></tr>
                <tr><td>cla_adder32</td><td>用来计算顺序执行的 pc_order、跳转执行的 pc_jump 以及 ALU 内部的加法操作</td></tr>
                <tr><td>mux2_1</td><td>用于选择 PC 的来源为 pc_order、pc_jump、pc_jalr</td></tr>
                <tr><td>mux（写回级）</td><td>根据 forwardC 来判断写回寄存器的数据是来自 ALU 计算结果还是数据内存</td></tr>
                <tr><td>jalr_mux</td><td>根据 reg_sel 信号选择数据 2 是 pc_order 还是 WB_data</td></tr>
                <tr><td>wb_data_mux</td><td>根据写回寄存器的使能信号判断数据是来自 alu 还是 datamem</td></tr>
                <tr><td>lui_mux</td><td>选择指令是否为 lui 指令，若是返回立即数，若不是返回跳转指令的目标 PC 地址</td></tr>
                <tr><td>wr_reg_mux</td><td>根据指令是否为 U-Type，判断写回寄存器的数据类型</td></tr>
              </tbody>
            </table>`,
        },
      ],
    },
    {
      id: 'sec-hd1-fwd',
      heading: '数据冒险与数据前推',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>五种数据冒险情况</strong>（课件原文 a–e）：</p>
            <ul>
              <li><strong>a.</strong> 在一个周期开始，EX 阶段要使用上一条处在 EX 阶段指令的执行结果，此时我们将 EX/MEM 寄存器的数据前递。</li>
              <li><strong>b.</strong> 在一个周期开始，EX 阶段要使用上一条处在 MEM 阶段指令的执行结果，此时我们将 MEM/WB 寄存器的数据前递。</li>
              <li><strong>c.</strong> 在一个周期开始，EX 阶段要使用上一条处在 WB 阶段指令的执行结果，此时不需要前递（寄存器堆前递机制）。</li>
              <li><strong>d.</strong> 在第一种情况下，如果上一条是访存指令，即发生加载—使用型冒险，则需要停顿一个周期。</li>
              <li><strong>e.</strong> 在发生加载—使用型冒险的时候，如果是 load 后跟着 store 指令，并且 load 指令的 rd 与 store 指令的 rs1 不同而与 rs2 相同，则不需要停顿，只需要将 MEM/WB 寄存器的数据前递到 MEM 阶段。</li>
            </ul>
            <p><strong>数据前推情况</strong>：a、b、e 对应三组控制信号——forwardA（ALU 第一个操作数来源）、forwardB（ALU 第二个操作数来源）、forwardC（写入数据存储器数据来源）：</p>
            <table class="tbl">
              <thead><tr><th>控制信号</th><th>数据源</th><th>解释</th></tr></thead>
              <tbody>
                <tr><td>forwardA = 1X</td><td>EX/MEM</td><td>ALU 的第一个源操作数来自于 EX/MEM 流水线寄存器的数据前递</td></tr>
                <tr><td>forwardA = 01</td><td>MEM/WB</td><td>ALU 的第一个源操作数来自于 MEM/WB 流水线寄存器的数据前递</td></tr>
                <tr><td>forwardA = 00</td><td>ID/EX</td><td>ALU 的第一个源操作数来自于 ID/EX 流水线寄存器的数据，不需要前递</td></tr>
                <tr><td>forwardB = 1X</td><td>EX/MEM</td><td>ALU 的第二个源操作数来自于 EX/MEM 流水线寄存器的数据前递</td></tr>
                <tr><td>forwardB = 01</td><td>MEM/WB</td><td>ALU 的第二个源操作数来自于 MEM/WB 流水线寄存器的数据前递</td></tr>
                <tr><td>forwardB = 00</td><td>ID/EX</td><td>ALU 的第二个源操作数来自于 ID/EX 流水线寄存器的数据，不需要前递</td></tr>
                <tr><td>forwardC = 1</td><td>MEM/WB</td><td>写入数据存储器的数据来自于 MEM/WB 流水线寄存器的数据前递</td></tr>
                <tr><td>forwardC = 0</td><td>EX/MEM</td><td>写入数据存储器的数据来自于 EX/MEM 流水线寄存器的数据，不需要前递</td></tr>
              </tbody>
            </table>
            <p><strong>数据前推情况 c（寄存器堆前递机制）</strong>：当第四条指令处于译码阶段的时候（第五个时钟周期），需要读取寄存器 X1 的值。在之前的设计中，写寄存器发生在时钟的上升沿，在采集信号时采集到的是这个时钟周期前一时刻的信号（也就是第四个时钟周期末的信号），但是待写回的 X1 的值在第五个时钟周期才能到来（第一条指令进入写回阶段），所以在这种情况下仍然会发生冒险——可以通过<strong>改变写寄存器时采集信号的时间</strong>来使其采集到正确的结果。指令示例：</p>
            <pre class="code"><code>addi x1, x0, 1
addi x2, x0, 2
addi x3, x0, 3
addi x4, x1, 3</code></pre>
            <p>加入数据前递之后，ALU 的数据来源变成三个——分别是 ID/EX 流水线寄存器的数值、EX/MEM 流水线寄存器前递的数值和 MEM/WB 流水线寄存器前递的数值，因此要添加<strong>三选一选择器</strong>；还有一组前递发生在访存阶段，由于数据来源只有两种，用 forwardC 控制<strong>一个二选一选择器</strong>即可。</p>`,
        },
      ],
    },
    {
      id: 'sec-hd1-ctrl',
      heading: '控制冒险与加载—使用型冒险',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>控制冒险（冲刷）</strong>：由于已有处理器把无条件跳转也考虑到了控制冒险中，所以只要发生跳转，就需要冲刷掉多余的两条指令（分别处于 <code>if_id_regs</code>、<code>id_ex_regs</code> 中）——可以直接把前面设计的 branch_judge 模块的输出信号 <code>jump_flag</code> 当作发生控制冒险的信号，再将 <code>if_id_regs</code>、<code>id_ex_regs</code> 中代码修改。</p>
            <p><strong>加载—使用型冒险（停顿）</strong>：在执行 load 指令阶段，判断出加载—使用型冒险并产生一个标志信号，在下一个时钟周期的上升沿采集到这个信号，然后<strong>清除 ID/EX 流水线寄存器的控制信号</strong>、<strong>暂停 IF/ID 流水线寄存器的更新</strong>、<strong>暂停 PC 的更新</strong>。</p>`,
        },
      ],
    },
    {
      id: 'sec-hd1-sim',
      heading: '仿真验证',
      blocks: [
        {
          type: 'html',
          html: `
            <p>课件给出三组仿真：第一组指令、第二组指令（两页波形）、第三组仿真（谢幕页前）。</p>
            <p><em>课件图示：Vivado 仿真波形截图——第一组指令（时序电路仿真，观察各级流水线寄存器与控制信号的变化）。</em></p>
            <p><em>课件图示：Vivado 仿真波形截图——第二组指令（两页：指令序列执行与冒险处理时的信号变化）。</em></p>
            <p><em>课件图示：Vivado 仿真波形截图——第三组仿真（整体波形总览）。</em></p>`,
        },
      ],
    },
  ],
};

export default ch1;
