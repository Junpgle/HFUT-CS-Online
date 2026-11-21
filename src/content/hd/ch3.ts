/* 第3讲 设计演示（单周期 CPU 模板）—— 逐节转录自 课件/答辩与演示/demo.pptx（20 页，第 18～20 页为空白页）；
   检查流程与三张关系图（mermaid 生成图）以「课件图示」注明。 */
import type { HdUnit } from './types';

const ch3: HdUnit = {
  id: 'hd3',
  no: '第3讲',
  title: '设计演示：单周期 CPU 模板',
  subtitle: '设计任务 · 项目结构 · 单周期原理 · 8 个子模块 · 验证流程与关系图 · 总结',
  lede:
    '<p>本讲为答辩演示：基于 MIPS32 精简指令集架构或者自定义指令集，完成一个单周期 CPU 的设计——通过模块化设计将复杂的 CPU 系统分解为 8 个功能明确的子模块，实现从指令取指到写回的完整数据通路。</p>',
  toc: [
    { id: 'sec-hd3-task', text: '设计任务与项目结构', level: 2 },
    { id: 'sec-hd3-principle', text: '单周期 CPU 原理', level: 2 },
    { id: 'sec-hd3-modules', text: '八个子模块功能', level: 2 },
    { id: 'sec-hd3-verify', text: '验证流程与关系图', level: 2 },
    { id: 'sec-hd3-summary', text: '总结', level: 2 },
  ],
  sections: [
    {
      id: 'sec-hd3-task',
      heading: '设计任务与项目结构',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>设计任务</strong>：基于 MIPS32 精简指令集架构或者自定义指令集，完成一个单周期 CPU 的设计。</p>
            <p><strong>项目结构</strong>：</p>
            <pre class="code"><code>项目根目录/
├── 核心设计文件（8个）
│   ├── cpu_top.v              # CPU 顶层模块
│   ├── pc_register.v          # PC 寄存器
│   ├── instruction_memory.v   # 指令存储器
│   ├── control_unit.v         # 控制单元
│   ├── register_file.v        # 寄存器文件
│   ├── alu_control.v          # ALU 控制单元
│   ├── alu.v                  # 算术逻辑单元
│   └── data_memory.v          # 数据存储器
├── 测试文件
│   └── testbench.v            # 测试平台
└── 脚本文件
    └── run.bat                # 运行脚本</code></pre>`,
        },
      ],
    },
    {
      id: 'sec-hd3-principle',
      heading: '单周期 CPU 原理',
      blocks: [
        {
          type: 'html',
          html: `
            <ul>
              <li><strong>定义</strong>：每条指令在一个时钟周期内完成所有阶段；</li>
              <li><strong>五个阶段</strong>：
                <ol>
                  <li>取指（IF）：从指令存储器读取指令；</li>
                  <li>译码（ID）：解析指令字段，生成控制信号；</li>
                  <li>执行（EX）：ALU 执行运算；</li>
                  <li>访存（MEM）：访问数据存储器（仅 lw/sw）；</li>
                  <li>写回（WB）：将结果写回寄存器。</li>
                </ol>
              </li>
            </ul>`,
        },
      ],
    },
    {
      id: 'sec-hd3-modules',
      heading: '八个子模块功能',
      blocks: [
        {
          type: 'html',
          html: `
            <table class="tbl">
              <thead><tr><th>模块</th><th>功能与关键特性</th></tr></thead>
              <tbody>
                <tr><td>PC 寄存器<br/>(pc_register.v)</td><td>存储程序计数器（PC），每个时钟周期更新。关键特性：复位时 PC = 0x00000000；支持顺序执行、分支和跳转；时钟上升沿更新</td></tr>
                <tr><td>指令存储器<br/>(instruction_memory.v)</td><td>存储程序指令，根据 PC 值读取指令。关键特性：容量 128 条指令（512 字节）；预装载斐波那契数列计算程序；字对齐访问（忽略地址低 2 位）</td></tr>
                <tr><td>控制单元<br/>(control_unit.v)</td><td>根据指令操作码生成所有控制信号。输出控制信号：reg_dst（寄存器目标选择）、jump（跳转信号）、branch（分支信号）、mem_read（内存读信号）、mem_to_reg（数据源选择）、alu_op（ALU 操作类型）、mem_write（内存写信号）、alu_src（ALU 源选择）、reg_write（寄存器写使能）</td></tr>
                <tr><td>寄存器文件<br/>(register_file.v)</td><td>32 个 32 位通用寄存器，支持 2 读 1 写。关键特性：寄存器恒为 0（硬件实现）；读操作：组合逻辑（立即输出）；写操作：时序逻辑（时钟上升沿）</td></tr>
                <tr><td>ALU 控制单元<br/>(alu_control.v)</td><td>根据 ALU_OP 和功能码生成 ALU 控制信号。输入：alu_op——来自控制单元（2 位）；funct——R-type 指令功能码（6 位）。输出：4 位 ALU 控制信号</td></tr>
                <tr><td>ALU<br/>(alu.v)</td><td>执行算术和逻辑运算。支持的运算：ADD（加法）、SUB（减法）、AND（按位与）、OR（按位或）、SLT（小于则置位）、NOR（或非）。输出：运算结果和零标志</td></tr>
                <tr><td>数据存储器<br/>(data_memory.v)</td><td>存储和读取数据。关键特性：容量 256 个字（1KB）；字对齐访问（忽略地址低 2 位）；读操作：组合逻辑；写操作：时序逻辑（时钟上升沿）</td></tr>
                <tr><td>CPU 顶层<br/>(cpu_top.v)</td><td>整合所有子模块，实现单周期 CPU 的完整数据通路。关键功能：连接所有子模块；实现数据通路（指令获取、译码、执行、访存、写回）；处理分支和跳转逻辑；实现多路选择器（MUX）功能</td></tr>
              </tbody>
            </table>`,
        },
      ],
    },
    {
      id: 'sec-hd3-verify',
      heading: '验证流程与关系图',
      blocks: [
        {
          type: 'html',
          html: `
            <p><em>课件图示：Vivado 验证流程图——自顶向下依次检查 PC 寄存器模块、指令存储器模块、控制单元模块、寄存器文件模块、ALU 控制单元模块、ALU 模块、数据存储器模块。</em></p>
            <p><strong>5.2 数据流向关系图</strong>（课件 mermaid 图）：<em>课件图示——PC 寄存器（pc_register）经 pc_current 送指令存储器（instruction_memory），读出 instruction 后分两路：一路进入控制单元（control_unit）与寄存器文件（register_file），寄存器文件提供 read_data1/2；控制单元产生控制信号送 ALU 控制单元（alu_control），经 alu_control 控制 ALU（alu.v），ALU 的 alu_result 送数据存储器（data_memory）。</em></p>
            <p><strong>5.3 控制信号流向关系图</strong>（课件 mermaid 图）：<em>课件图示——指令（instruction）的 opcode 送控制单元（control_unit）后产生九路控制信号：reg_dst → MUX（选择写入寄存器）、jump → 跳转控制、branch → 分支控制、mem_read → 数据存储器读取、mem_to_reg → MUX（选择回写数据）、alu_op → ALU 控制单元、mem_write → 数据存储器写入、alu_src → MUX（选择 ALU 输入）、reg_write → 寄存器文件写使能；另有 funct → ALU 控制单元（alu_control）→ ALU（alu.v）。</em></p>
            <p><strong>5.4 指令执行数据通路关系图</strong>（课件 mermaid 图）：<em>课件图示——单周期 CPU 数据通路按阶段给出：取指（IF）：PC 寄存器 → 指令存储器 → 指令；译码（ID）：指令 → 控制单元 → 控制信号、寄存器文件读出数据、指令字段解析（opcode、rs、rt、rd、funct、immediate）；执行阶段（EX）：寄存器数据/立即数 → ALU → 运算结果、控制信号 → ALU 控制单元 → ALU 操作类型；访存阶段（MEM）：ALU 结果 → 数据存储器 → 读取数据（lw/sw）；写回阶段（WB）：ALU 结果/内存数据 → 写回数据 → 写回寄存器。</em></p>`,
        },
      ],
    },
    {
      id: 'sec-hd3-summary',
      heading: '总结',
      blocks: [
        {
          type: 'html',
          html: `
            <div class="callout key">
              <p class="callout-h">结论</p>
              <p>实现了一个基于 MIPS32 精简指令集的单周期 CPU，通过模块化设计将复杂的 CPU 系统分解为 8 个功能明确的子模块，实现了从指令取指到写回的完整数据通路。项目支持 10 条 MIPS32 指令，涵盖了 R-type、I-type 和 J-type 三种指令类型，能够正确执行斐波那契数列计算程序，并通过仿真验证了设计的正确性。</p>
            </div>`,
        },
      ],
    },
  ],
};

export default ch3;
