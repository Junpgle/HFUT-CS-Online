/* 计算机体系结构 · 第6讲 相关与冒险 —— 依据「课件/06-相关与冒险.pptx」（李建华，27 页）整理 */
import type { CaChapter } from './types';

const ch: CaChapter = {
  id: 'ch6',
  no: '第6讲',
  title: '相关与冒险',
  subtitle: '第 6 讲 · 相关与冒险',
  lede: `
  上一讲指出「相关导致停顿」，本讲把它量化：给出 MIPS 五级流水线中<strong>真相关导致冒险的充要条件</strong>（指令距离 ≤ 3），
        设计<strong>暂停</strong>的检测逻辑，再讲<strong>数据前推</strong>（旁路）如何把大多数冒险缩短为 0，剩下的 LW→use 冒险仍需 1 拍；
        最后分析<strong>控制相关</strong>与分支处理的三条路线（暂停 / 预测 / 延迟槽）。
`,
  toc: [
    { id: 'sec-ch6-adv', text: '1. 真相关与冒险条件', level: 2 },
    { id: 'sec-ch6-stall', text: '2. 暂停与检测逻辑', level: 2 },
    { id: 'sec-ch6-forward', text: '3. 数据前推', level: 2 },
    { id: 'sec-ch6-example', text: '4. 示例代码与暂停数', level: 2 },
    { id: 'sec-ch6-control', text: '5. 控制相关与分支处理', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ch6-adv',
      heading: '1. 真相关与冒险条件',
      blocks: [
        {
          type: 'html',
          html: `
          <p>对给定的流水线，两条相关指令在何种情况下可能<strong>导致冒险</strong>？取决于三要素：相关的类型（RAW/WAR/WAW）、两条指令的类型、两条指令之间的距离。</p>
          <p>以寄存器读写所在的流水段分析：</p>
          <table class="tbl">
            <thead><tr><th>指令类型</th><th>ID</th><th>EX</th><th>MEM</th><th>WB</th></tr></thead>
            <tbody>
              <tr><td>R/I-Type</td><td>read RF</td><td></td><td></td><td>write RF</td></tr>
              <tr><td>LW</td><td>read RF</td><td></td><td></td><td>write RF</td></tr>
              <tr><td>SW</td><td>read RF</td><td></td><td></td><td></td></tr>
              <tr><td>Br</td><td>read RF</td><td></td><td></td><td></td></tr>
              <tr><td>J</td><td></td><td></td><td></td><td></td></tr>
              <tr><td>Jr</td><td>read RF</td><td></td><td></td><td></td></tr>
            </tbody>
          </table>
          <div class="callout key">
            <p><strong>冒险条件（课件结论）</strong>：指令 I<sub>A</sub> 与 I<sub>B</sub>（I<sub>A</sub> 在前）真相关导致流水线冒险，当且仅当：</p>
            <ul>
              <li>I<sub>B</sub>（R/I、LW、SW、Br 或 JR）读了被 I<sub>A</sub>（R/I 或 LW）写的寄存器（目标寄存器），且</li>
              <li>指令距离 <span class="m">dist(I<sub>A</sub>, I<sub>B</sub>) ≤ dist(ID, WB) = 3</span>。</li>
            </ul>
            <p>一般化的判据：若 <span class="m">dist(i, j) ≤ dist(X, Y)</span>（i 写、j 读，X 为写发生段、Y 为读发生段），让 j 向前流动<strong>不安全</strong>；若距离更大则安全。WAR 与 WAW 可以采用类似方法分析。</p>
          </div>
          <p>把这条判据用于 5 条指令（i 与 i+1…i+3）：dist = 1、2、3 都危险，dist ≥ 4 则安全（中间隔了 3 条指令）。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch6-stall',
      heading: '2. 暂停与检测逻辑',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>暂停</strong> = 使相关指令暂停处理，直到该指令所需的源数据就绪：① 停止所有上游流水段的处理；② 排干所有下游流水段的任务。</p>
          <p><strong>如何实现暂停</strong>：关闭 PC 和 IR 的锁存（确保被暂停的指令停留在原来的阶段）；向被阻塞阶段的后续流水段插入 "invalid" 指令（nops，叫做 <strong>bubbles</strong>）。</p>
          <svg class="fig" viewBox="0 0 720 240" role="img" aria-label="真相关造成流水线冒泡：后一条指令在 ID 段等待 3 拍">
            <g font-size="11.5" text-anchor="middle" style="font-family:var(--font)">
              <g style="fill:var(--ink)" font-weight="700" font-size="12">
                <text x="60" y="24">周期</text>
                <text x="150" y="24">1</text>
                <text x="220" y="24">2</text>
                <text x="290" y="24">3</text>
                <text x="360" y="24">4</text>
                <text x="430" y="24">5</text>
                <text x="500" y="24">6</text>
                <text x="570" y="24">7</text>
                <text x="640" y="24">8</text>
              </g>
              <g style="fill:var(--panel-2);stroke:var(--hairline)">
                <rect x="120" y="40" width="580" height="44"/>
                <rect x="120" y="94" width="580" height="44"/>
                <rect x="120" y="148" width="580" height="44"/>
              </g>
              <g style="fill:var(--ink)" font-weight="700" font-size="12">
                <text x="70" y="66" text-anchor="end">add r1,…</text>
                <text x="70" y="120" text-anchor="end">sub r2,r1,…</text>
                <text x="70" y="174" text-anchor="end">and r3,…</text>
              </g>
              <g font-size="11" style="fill:var(--ink-2)">
                <rect x="122" y="42" width="64" height="40" rx="4" style="fill:var(--deck-accent);opacity:0.22"/><text x="154" y="66">IF</text>
                <rect x="192" y="42" width="64" height="40" rx="4" style="fill:var(--deck-accent);opacity:0.16"/><text x="224" y="66">ID</text>
                <rect x="262" y="42" width="64" height="40" rx="4" style="fill:var(--deck-accent);opacity:0.22"/><text x="294" y="66">EX</text>
                <rect x="332" y="42" width="64" height="40" rx="4" style="fill:var(--warn);opacity:0.20"/><text x="364" y="66">MEM</text>
                <rect x="402" y="42" width="64" height="40" rx="4" style="fill:var(--deck-accent);opacity:0.16"/><text x="434" y="66">WB</text>
                <rect x="192" y="96" width="64" height="40" rx="4" style="fill:var(--deck-accent);opacity:0.22"/><text x="224" y="120">IF</text>
                <rect x="262" y="96" width="64" height="40" rx="4" style="fill:var(--hot);opacity:0.22"/><text x="294" y="120">ID</text>
                <rect x="332" y="96" width="64" height="40" rx="4" style="fill:var(--hot);opacity:0.22"/><text x="364" y="120">ID</text>
                <rect x="402" y="96" width="64" height="40" rx="4" style="fill:var(--hot);opacity:0.22"/><text x="434" y="120">ID</text>
                <rect x="472" y="96" width="64" height="40" rx="4" style="fill:var(--deck-accent);opacity:0.22"/><text x="504" y="120">EX</text>
                <rect x="542" y="96" width="64" height="40" rx="4" style="fill:var(--warn);opacity:0.20"/><text x="574" y="120">MEM</text>
                <rect x="262" y="150" width="64" height="40" rx="4" style="fill:var(--deck-accent);opacity:0.22"/><text x="294" y="174">IF</text>
                <rect x="332" y="150" width="64" height="40" rx="4" style="fill:var(--deck-accent);opacity:0.16"/><text x="364" y="174">ID</text>
                <rect x="402" y="150" width="64" height="40" rx="4" style="fill:var(--deck-accent);opacity:0.22"/><text x="434" y="174">EX</text>
                <rect x="472" y="150" width="64" height="40" rx="4" style="fill:var(--warn);opacity:0.20"/><text x="504" y="174">MEM</text>
                <rect x="542" y="150" width="64" height="40" rx="4" style="fill:var(--deck-accent);opacity:0.16"/><text x="574" y="174">WB</text>
              </g>
              <text x="380" y="212" style="fill:var(--ink-3)" font-size="11.5">无前推时：sub 在 ID 段连停 3 拍，等 add 把 r1 写回（WB）——每 3 拍暂停插入 3 个 bubble</text>
            </g>
          </svg>
          <p class="fig-cap">图 6-1　真相关造成的流水线暂停（无前推）</p>
          <p><strong>暂停条件的检测逻辑</strong>（辅助函数 rs(I)、rt(I) 返回指令的 rs、rt 域）：当下面任一条件成立均需暂停——</p>
          <div class="formula"><span class="m">(rs(IR<sub>ID</sub>) == dest<sub>EX</sub>) &amp;&amp; RegWrite<sub>EX</sub></span> 等共 6 条（rs/rt × EX/MEM/WB）</div>
          <p><strong>暂停的代价</strong>：每个暂停周期相当于浪费一个周期（该周期完成的是空指令）。若一个程序执行了 N 条指令、暂停 S 个时钟周期，则平均 CPI ≈ (N + S) / N。S 的大小依赖于：真相关发生的频率、相关指令之间的距离、影响暂停的时钟周期数。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch6-forward',
      heading: '3. 数据前推',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>数据前推</strong>（Data Forwarding，又叫数据旁路 Data Bypassing）：当指令所需的操作数（值）可用时，尽快将其送给（forward）相关的指令——不是通过读写寄存器来传递值；在数据流模型下，一条指令所需的所有操作数就绪后就可以执行。</p>
          <p><strong>数据流的视角</strong>：把 RF 保存的值看作状态，由指令处理的结果定义。「add rx ry rz」字面意义是分别从 RF[ry] 和 RF[rz] 取值得结果写 RF[rx]；实际上是指：① 获得上一次重新定义 RF[ry] 和 RF[rz] 的两条指令的结果；② add 的结果重新定义 RF[rx]；③ 后续指令读到的是这个结果，直到另一条指令重新定义 RF[rx]。维持正确性靠的就是指令之间正确的<strong>数据流</strong>。</p>
          <p><strong>前推如何工作</strong>（二者缺一不可）：</p>
          <ul>
            <li>从 datapath 中获取操作数（值），而不是从 RF 中获取；</li>
            <li>从潜在的多个定义值中，获取<strong>最新</strong>的操作数。</li>
          </ul>
          <div class="callout key">
            <p><strong>前推逻辑（顺序很关键）</strong>：</p>
            <pre class="code"><code>if (rsEX != 0) &amp;&amp; (rsEX == destMEM) &amp;&amp; RegWriteMEM then
    forward operand from MEM stage   // dist = 1
else if (rsEX != 0) &amp;&amp; (rsEX == destWB) &amp;&amp; RegWriteWB then
    forward operand from WB stage    // dist = 2
else
    use operand from register file   // dist &gt;= 3</code></pre>
            <p>可能有多个潜在的前推对象，<strong>必须从最新的潜在对象开始检测</strong>（先 MEM 后 WB）。</p>
          </div>
          <p><strong>前推无法消除所有冒险</strong>：紧随 LW 指令的真相关仍会导致冒险——load 的数据在 MEM 段末才可用，而消费者在 EX 段就需要它，因此需<strong>暂停一个周期</strong>。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch6-example',
      heading: '4. 示例代码与暂停数',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>示例代码（教材 P&amp;H 的循环）</strong>：</p>
          <pre class="code"><code>for (j = i-1; j &gt;= 0 &amp;&amp; v[j] &gt; v[j+1]; j -= 1) { ...... }

        addi  $s1, $s0, -1
for2tst: slti  $t0, $s1, 0
        bne   $t0, $zero, exit2
        sll   $t1, $s1, 2
        add   $t2, $a0, $t1
        lw    $t3, 0($t2)
        lw    $t4, 4($t2)
        slt   $t0, $t4, $t3
        beq   $t0, $zero, exit2
        .........
        addi  $s1, $s1, -1
        j     for2tst
exit2:</code></pre>
          <p><strong>有数据前推的版本</strong>（课件在两条 lw 之后插入了 nop）：</p>
          <pre class="code"><code>        lw    $t3, 0($t2)
        lw    $t4, 4($t2)
        nop
        slt   $t0, $t4, $t3
        beq   $t0, $zero, exit2</code></pre>
          <p>暂停来源：① <code>lw $t4</code> → <code>slt</code> 是 LW→use 真相关，前推不够，需 1 拍；② <code>slti $t0</code> → <code>bne $t0</code> 依赖分支条件寄存器，分支在 ID 段判定，需 1 拍（前推也无法完全消除）；③ 循环末尾 <code>addi $s1</code> → <code>slti</code> 跨迭代，若距离足够则无需暂停。结论：<strong>前推把每处 ALU 相关缩短到 0~1 拍，LW→use 始终是 1 拍</strong>。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch6-control',
      heading: '5. 控制相关与分支处理',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>控制相关</strong>：所有指令均控制相关于它前面的指令——因为下一条 PC 取决于前面的指令。若当前指令是非控制流指令，下一个 PC 就是 PC+4（只需知道指令宽度）；若当前指令是控制流指令，如何确定下一个 PC？挑战在于：我们如何/何时才能知道当前取到的指令是否是控制流指令？</p>
          <p><strong>不同类型分支的属性</strong>：</p>
          <table class="tbl">
            <thead><tr><th>类型</th><th>取指时的方向</th><th>可能的下一个取指地址数</th><th>何时解决</th></tr></thead>
            <tbody>
              <tr><td>条件分支（Conditional）</td><td>未知</td><td>2</td><td>EXE（依赖寄存器）</td></tr>
              <tr><td>无条件跳转（Unconditional）</td><td>总是跳</td><td>1</td><td>ID（PC + offset）</td></tr>
              <tr><td>调用（Call）</td><td>总是跳</td><td>1</td><td>ID（PC + offset）</td></tr>
              <tr><td>返回（Return）</td><td>总是跳</td><td>很多</td><td>EXE（依赖寄存器）</td></tr>
              <tr><td>间接跳转（Indirect）</td><td>总是跳</td><td>很多</td><td>EXE（依赖寄存器）</td></tr>
            </tbody>
          </table>
          <p><strong>潜在解决方案</strong>：暂停流水线的处理，直到下一条指令地址明确；猜测下一条指令地址（branch prediction）；使用延迟分支技术（branch delay slot）。</p>
          <p><strong>暂停是好的方案吗？</strong>若每条分支都暂停到目标确定，与理想流水线相比性能直接减至一半（课件时空图）。</p>
          <p><strong>更好的方案：分支预测</strong>——猜测 nextPC = PC+4 并直接取指。这是一个好的猜测吗？统计（Lee and Smith, 1984）：约 20% 的指令组合是控制流指令；约 50% 的向前跳转（if-then-else）是跳转的；约 90% 的后向跳转（loop back）是跳的。总的来说约 70% taken、30% not taken，因此「nextPC = PC+4」的正确率约 <strong>86%</strong>——剩下 14% 猜错的情况如何处理？下一讲（分支预测）专门介绍。</p>
          `,
        },
      ],
    },
  ],
};

export default ch;
