/* 计算机体系结构 · 第7讲 指令级并行 I —— 依据「课件/07-指令级并行 I.pptx」（李建华，29 页）整理 */
import type { CaChapter } from './types';

const ch: CaChapter = {
  id: 'ch7',
  no: '第7讲',
  title: '指令级并行 I',
  subtitle: '第 7 讲 · 指令级并行 I',
  lede: `
  指令级并行（ILP）是本讲之后所有内容的主题：利用流水线使指令重叠执行所获得的并行性。本讲先澄清<strong>相关与冒险</strong>、<strong>程序顺序 / 数据流 / 异常行为</strong>等概念，
        再介绍最基础、最常用的软件技术——<strong>循环展开 + 指令调度</strong>：把每元素 10 拍压到 6 拍，再展开 4 次压到 3.5 拍。
`,
  toc: [
    { id: 'sec-ch7-concept', text: '1. ILP 与相关的基本概念', level: 2 },
    { id: 'sec-ch7-order', text: '2. 程序顺序、数据流与异常行为', level: 2 },
    { id: 'sec-ch7-unroll', text: '3. 循环展开与指令调度', level: 2 },
    { id: 'sec-ch7-sched', text: '4. 调度示例：每元素 10 → 6 拍', level: 2 },
    { id: 'sec-ch7-unroll4', text: '5. 展开 4 次 + 调度：3.5 拍/元素', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ch7-concept',
      heading: '1. ILP 与相关的基本概念',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>指令级并行</strong>（Instruction-Level Parallelism）：利用流水线使指令重叠并行处理，以提高性能。这种指令之间潜在的并行性（重叠处理）称为 ILP。</p>
          <p>流水线处理器的实际 CPI = 理想流水线的 CPI 加上各类停顿的开销：</p>
          <div class="formula"><span class="m">CPI<sub>流水线</sub> = CPI<sub>理想</sub> + 停顿<sub>结构冲突</sub> + 停顿<sub>数据冲突</sub> + 停顿<sub>控制冲突</sub></span></div>
          <p>理想 CPI 是衡量流水线最高性能的一个指标。IPC（Instructions Per Cycle）与 CPI 互为倒数。</p>
          <p><strong>循环级并行</strong>：使一个循环中的不同循环体并行执行。优化循环是最常见、最基本的提升 ILP 的方法——是指令级并行研究的重点（80% 以上时间用于循环）。例如：</p>
          <pre class="code"><code>for (i = 1; i &lt;= 500; i++)
    a[i] = a[i] + s;</code></pre>
          <p>每一次循环都可以与其它循环重叠并行执行；但在每一次循环<strong>内部</strong>，却没有任何指令级并行性。</p>
          <p><strong>相关与流水线冒险的关系</strong>：流水线冒险是指对于具体的流水线来说，相关导致指令流中的下一条指令不能在指定的时钟周期执行。<strong>相关是程序固有的一种属性</strong>，反映程序中指令之间的相互依赖关系；具体的一次相关是否导致冒险、解决需要多长时间停顿，需要结合流水线的属性来分析。</p>
          <p>能有效提升 ILP 的硬件技术与软件技术需要互相配合，才能最大限度挖掘程序中存在的指令级并行。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch7-order',
      heading: '2. 程序顺序、数据流与异常行为',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>程序顺序</strong>（Program Order）：由源程序确定的、在完全串行方式下指令的执行顺序。由于相关可能影响程序结果的正确性，此前指令都按程序顺序处理。</p>
          <p>实际上，正确执行程序必须保持的两个最关键属性是：<strong>数据流</strong>和<strong>异常行为</strong>。</p>
          <ul>
            <li><strong>保持异常行为</strong>：无论怎么改变指令的执行顺序，都不能改变程序中异常的发生情况；为提升性能，可以弱化为——指令执行顺序的改变不能导致程序中发生<strong>新的</strong>异常；</li>
            <li>换句话说，<strong>程序顺序可以改变</strong>。</li>
          </ul>
          <p>如果能保持程序的<strong>数据相关</strong>和<strong>控制相关</strong>，就能保持数据流与异常行为，从而确保最终结果正确。</p>
          <pre class="code"><code>DADDU   R2, R3, R4
BEQZ    R2, L1
LW      R1, 0(R2)
L1:</code></pre>
          <p>必须保持对 R2 的数据相关，否则可能破坏数据流（例如把 LW 提到 BEQZ 之前，若分支成立则 LW 的地址来自未就绪的 R2）。</p>
          <p><strong>数据流</strong>指数据值从其产生者指令到消费者指令的实际流动（数据前推就是保持了数据流）。分支指令使数据流具有动态性——某条指令的源操作数可能有多个来源，因此仅保持数据相关还不够，还须保持控制相关：</p>
          <pre class="code"><code>DADDU    R1, R2, R3
BEQZ     R4, L1
DSUBU    R1, R5, R6
L1: ...  OR  R7, R1, R8</code></pre>
          <p>R1 的值依赖于数据流（之前多条指令），具体由分支指令的实际情况决定。</p>
          <div class="callout tip">
            <p><strong>特殊场景</strong>：有时不遵守控制相关既不影响异常行为，也不改变数据流——此时可以大胆地进行指令调度，把失败分支中的指令调度到分支指令之前。示例：DADDU R1,R2,R3；BEQZ R12,Skipnext；DSUBU R4,R5,R6；DADDU R5,R4,R9；skip: OR R7,R8,R9。假设 skip 后 R4 不再使用、且 DSUBU 不产生异常，则可以把 DSUBU 调度到分支之前。</p>
          </div>
          `,
        },
      ],
    },
    {
      id: 'sec-ch7-unroll',
      heading: '3. 循环展开与指令调度',
      blocks: [
        {
          type: 'html',
          html: `
          <p>Loop Unrolling 与 Instruction Scheduling 是提升 ILP 最简单、最常用的方法：开发<strong>循环级并行性</strong>（循环的不同迭代之间存在的并行性）；把循环展开后，通过<strong>寄存器重命名</strong>和<strong>指令调度</strong>开发更多的 ILP。</p>
          <p>编译器完成指令调度的能力受限于两个特性：程序固有的 ILP；<strong>流水线功能部件的延迟</strong>。</p>
          <p><strong>延迟假设（课件原表）</strong>：</p>
          <table class="tbl">
            <thead><tr><th>产生结果的指令</th><th>使用结果的指令</th><th>延迟（时钟周期数）</th></tr></thead>
            <tbody>
              <tr><td>浮点计算</td><td>另一个浮点计算</td><td>3</td></tr>
              <tr><td>浮点计算</td><td>浮点 store（S.D）</td><td>2</td></tr>
              <tr><td>浮点 load（L.D）</td><td>浮点计算</td><td>1</td></tr>
              <tr><td>浮点 load（L.D）</td><td>浮点 store（S.D）</td><td>0</td></tr>
            </tbody>
          </table>
          <p><strong>其它假设</strong>：采用 MIPS 五段流水线；<strong>分支延迟 1 个时钟周期</strong>（分支的条件判断和目标计算在 ID 进行）；整数运算部件全流水或数量充足（即假定没有资源冲突）。</p>
          <p><strong>示例源码</strong>：</p>
          <pre class="code"><code>for (i = 1; i &lt;= 1000; i++)
    x[i] = x[i] + s;</code></pre>
          <p>翻译成 MIPS 汇编（R1 初值指向第一个元素，8(R2) 指向最后一个元素；浮点寄存器 F2 保存常数 s）：</p>
          <pre class="code"><code>Loop:   L.D     F0, 0(R1)
        ADD.D   F4, F0, F2
        S.D     F4, 0(R1)
        DADDIU  R1, R1, #-8
        BNE     R1, R2, Loop</code></pre>
          `,
        },
      ],
    },
    {
      id: 'sec-ch7-sched',
      heading: '4. 调度示例：每元素 10 → 6 拍',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>不进行指令调度</strong>（按上述顺序执行，数据前推在此处没有作用）：</p>
          <table class="tbl">
            <thead><tr><th>指令流出时钟</th><th>指令</th></tr></thead>
            <tbody>
              <tr><td>1</td><td>L.D F0, 0(R1)</td></tr>
              <tr><td>2</td><td>（空转）</td></tr>
              <tr><td>3</td><td>ADD.D F4, F0, F2</td></tr>
              <tr><td>4</td><td>（空转）</td></tr>
              <tr><td>5</td><td>（空转）</td></tr>
              <tr><td>6</td><td>S.D F4, 0(R1)</td></tr>
              <tr><td>7</td><td>DADDIU R1, R1, #-8</td></tr>
              <tr><td>8</td><td>（空转）</td></tr>
              <tr><td>9</td><td>BNE R1, R2, Loop</td></tr>
              <tr><td>10</td><td>（空转）</td></tr>
            </tbody>
          </table>
          <p>每个元素需要 <strong>10 个时钟周期</strong>，其中 5 个是空转。</p>
          <p><strong>进行指令调度</strong>：把 DADDIU 调度到 L.D 与 ADD.D 之间的空转拍；把 S.D 放到分支指令的延迟槽中；对存储器地址偏移量进行调整：</p>
          <pre class="code"><code>Loop:   L.D     F0, 0(R1)
        DADDIU  R1, R1, #-8
        ADD.D   F4, F0, F2
        （空转）
        BNE     R1, R2, Loop
        S.D     F4, 8(R1)</code></pre>
          <p>执行：1 L.D → 2 DADDIU → 3 ADD.D → 4 空转 → 5 BNE → 6 S.D：每轮从 10 个周期减少到 <strong>6 个</strong>（5 个有指令、1 个空转）。</p>
          <p><strong>问题</strong>：真正有用的只有 L.D、ADD.D、S.D 三条（占 3 拍），而 DADDIU、空转和 BNE 这 3 拍都是附加的循环控制开销——能否进一步优化？方案是循环展开。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch7-unroll4',
      heading: '5. 展开 4 次 + 调度：3.5 拍/元素',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>循环展开</strong>：把循环体的代码复制多次并按顺序排列，然后相应调整循环的结束条件，给编译器调度带来更大空间。</p>
          <p>示例：把循环展开 4 次（4 个循环体），假定 R1 初值为 32 的倍数（循环次数为 4 的倍数）；消除冗余指令、不重复使用寄存器：</p>
          <ul>
            <li>F0、F4：第 1 个循环体；F2：保存常数 s；</li>
            <li>F6、F8：第 2 个循环体；F10、F12：第 3 个；F14、F16：第 4 个。</li>
          </ul>
          <p><strong>展开后不调度</strong>：每遍 28 个周期，4 个循环体完成 4 个元素 → 平均每元素 28/4 = <strong>7 拍</strong>（原始为 10 拍，收益来自减少循环控制开销）；但 28 拍中实际只有 14 条指令、其余 14 拍都是空转——这样并不高效。</p>
          <p><strong>综合优化调度</strong>（把 4 个 L.D 提到最前、4 个 ADD.D 随后，再穿插 4 个 S.D、DADDIU 与 BNE）：</p>
          <table class="tbl">
            <thead><tr><th>时钟</th><th>指令</th><th>时钟</th><th>指令</th></tr></thead>
            <tbody>
              <tr><td>1</td><td>L.D F0, 0(R1)</td><td>8</td><td>ADD.D F16, F14, F2</td></tr>
              <tr><td>2</td><td>L.D F6, -8(R1)</td><td>9</td><td>S.D F4, 0(R1)</td></tr>
              <tr><td>3</td><td>L.D F10, -16(R1)</td><td>10</td><td>S.D F8, -8(R1)</td></tr>
              <tr><td>4</td><td>L.D F14, -24(R1)</td><td>11</td><td>S.D F12, 16(R1)</td></tr>
              <tr><td>5</td><td>ADD.D F4, F0, F2</td><td>12</td><td>DADDIU R1, R1, #-32</td></tr>
              <tr><td>6</td><td>ADD.D F8, F6, F2</td><td>13</td><td>BNE R1, R2, Loop</td></tr>
              <tr><td>7</td><td>ADD.D F12, F10, F2</td><td>14</td><td>S.D F16, 8(R1)</td></tr>
            </tbody>
          </table>
          <p>整个循环仅用 <strong>14 个时钟周期</strong>（没有数据相关引起的空转），平均每元素 14/4 = <strong>3.5 拍</strong>。</p>
          <div class="callout key">
            <p><strong>循环展开与调度要注意</strong>：</p>
            <ul>
              <li><strong>保证正确性</strong>：尤其注意循环控制和操作数偏移量的修改；</li>
              <li><strong>注意有效性</strong>：只有能找到不同循环体之间的无关性才能有效展开；使用不同的寄存器（否则可能引入新冲突）；注意对存储器数据的相关性分析（本课程不展开）；</li>
              <li><strong>注意新的相关性</strong>：原来不同轮次的迭代展开后进了同一次循环体，可能带来新的相关性。</li>
            </ul>
          </div>
          `,
        },
      ],
    },
  ],
};

export default ch;
