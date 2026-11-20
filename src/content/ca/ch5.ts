/* 计算机体系结构 · 第5讲 流水线基础 —— 依据「课件/05-流水线基础.pptx」（李建华，44 页）整理 */
import type { CaChapter } from './types';

const ch: CaChapter = {
  id: 'ch5',
  no: '第5讲',
  title: '流水线基础',
  subtitle: '第 5 讲 · 流水线基础',
  lede: `
  本讲从洗衣店类比出发，建立流水线的三个共性结论（不缩短单任务响应时间、受最慢流水站限制、理想加速比≈流水站数），
        推导<strong>吞吐率</strong>与<strong>硬件开销</strong>的公式，给出 MIPS 五级流水线的划分与流水线寄存器，最后分析「理想照进现实」的三类偏差与<strong>停顿</strong>的四种原因。
`,
  toc: [
    { id: 'sec-ch5-laundry', text: '1. 洗衣店类比', level: 2 },
    { id: 'sec-ch5-real', text: '2. 现实的流水线：吞吐率与开销', level: 2 },
    { id: 'sec-ch5-mips', text: '3. MIPS 五级流水处理', level: 2 },
    { id: 'sec-ch5-ctrl', text: '4. 流水线的控制', level: 2 },
    { id: 'sec-ch5-ideal', text: '5. 理想照进现实：偏差与停顿', level: 2 },
    { id: 'sec-ch5-dep', text: '6. 相关及其分类', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ch5-laundry',
      heading: '1. 洗衣店类比',
      blocks: [
        {
          type: 'html',
          html: `
          <p>4 个同学 A、B、C、D 要洗衣（wash）、烘干（dry）、折叠（fold）：</p>
          <p><strong>部件耗时相等（各 30 分钟）</strong>：</p>
          <table class="tbl">
            <thead><tr><th>方式</th><th>完成 4 个任务</th><th>吞吐率</th><th>各同学等待</th><th>各部件使用</th></tr></thead>
            <tbody>
              <tr><td>串行工作</td><td>6 小时</td><td>0.67 个/小时</td><td>1.5 小时</td><td>各 2 小时</td></tr>
              <tr><td>流水工作</td><td>3 小时</td><td>1.33 个/小时</td><td>1.5 小时</td><td>各 2 小时</td></tr>
            </tbody>
          </table>
          <p><strong>部件耗时不相等（30 / 40 / 20 分钟）</strong>：串行 6 小时（0.67 个/小时）；流水 3.5 小时（1.14 个/小时）——流水时间由<strong>最慢的站</strong>（40 分钟的烘干）决定。</p>
          <div class="callout key">
            <p><strong>关于流水线的共性结论</strong>：</p>
            <ul>
              <li>流水线不能缩短<strong>单个任务</strong>的响应时间，但可以提高<strong>吞吐率</strong>；</li>
              <li>流水线速度受限于<strong>最慢流水站</strong>的速度；</li>
              <li>流水线中多个任务是并行处理的，且处于不同的处理阶段；理想的加速比 ≈ 流水站数。</li>
            </ul>
            <p>限制因素：流水站的速度不匹配；流水线「填充」和「排空」时间；其它干扰流水线的因素。</p>
          </div>
          `,
        },
      ],
    },
    {
      id: 'sec-ch5-real',
      heading: '2. 现实的流水线：吞吐率与开销',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>理想的指令流水线</strong>要求三条：处理的指令相同（对大量数据进行相同的操作）、指令之间相互独立（没有依赖）、指令可以均匀划分成所需时间相等的子操作。</p>
          <p>现实与理想的差距来自<strong>锁存器</strong>（latch，流水线寄存器）：</p>
          <div class="formula">非流水版本带宽 <span class="m">BW = 1 / (T + S)</span>，S 为锁存器延迟；K 阶流水线 <span class="m">BW<sub>k-stage</sub> = 1 / (T/k + S)</span></div>
          <p>推导：单条组合逻辑延迟 T；切 K 段后每段逻辑 T/k，但段间要加锁存器。级数越多，锁存器开销占比越大：</p>
          <div class="formula"><span class="m">BW<sub>max</sub> = 1 / (1 gate delay + S)</span></div>
          <p><strong>开销</strong>：非流水版本组合逻辑开销为 G，Cost = G + L（L 为锁存器开销）；K 阶流水线 Cost<sub>k-stage</sub> = G + L<sub>k</sub>——锁存器增加了硬件开销。</p>
          <div class="callout warn">
            <p><strong>流水线的级数越多性能越好吗？</strong>不是。级数增加 → 每段有效逻辑变少、锁存器延迟占比上升，吞吐率被 1 gate delay + S 封顶；同时硬件开销与设计复杂度增加。这正是期末简答「流水级数增大为何存在瓶颈」的答案骨架。</p>
          </div>
          `,
        },
      ],
    },
    {
      id: 'sec-ch5-mips',
      heading: '3. MIPS 五级流水处理',
      blocks: [
        {
          type: 'html',
          html: `
          <p>把单周期的 5 个阶段（IF、ID、EXE、MEM、WB）各自放进一个流水段，每段配一组<strong>流水线寄存器</strong>（IF/ID、ID/EX、EX/MEM、MEM/WB）。</p>
          <p>划分依据：单周期时延 IF 200 / ID 50 / EX 100 / MEM 200 / WB 50 ps。若按 200 ps 的节拍切分，ID 与 WB（50 ps）会显得很空——<strong>为什么不是 4 段或 6 段</strong>？因为阶段边界要保证「没有任何一个硬件单元被超过一个流水段同时使用」，且各段延迟尽量均衡。</p>
          <svg class="fig" viewBox="0 0 780 300" role="img" aria-label="五级流水线的时空图：四条指令在五个阶段的并行">
            <g font-size="11.5" text-anchor="middle" style="font-family:var(--font)">
              <g style="fill:var(--ink)" font-weight="700" font-size="12">
                <text x="70" y="24">周期</text>
                <text x="150" y="24">1</text>
                <text x="235" y="24">2</text>
                <text x="320" y="24">3</text>
                <text x="405" y="24">4</text>
                <text x="490" y="24">5</text>
                <text x="575" y="24">6</text>
                <text x="660" y="24">7</text>
                <text x="745" y="24">8</text>
              </g>
              <g style="fill:var(--panel-2);stroke:var(--hairline)">
                <rect x="110" y="40" width="700" height="46"/>
                <rect x="110" y="96" width="700" height="46"/>
                <rect x="110" y="152" width="700" height="46"/>
                <rect x="110" y="208" width="700" height="46"/>
              </g>
              <g style="fill:var(--ink)" font-weight="700" font-size="12">
                <text x="65" y="68" text-anchor="end">I1</text>
                <text x="65" y="124" text-anchor="end">I2</text>
                <text x="65" y="180" text-anchor="end">I3</text>
                <text x="65" y="236" text-anchor="end">I4</text>
              </g>
              <g font-size="11" style="fill:var(--ink-2)">
                <rect x="112" y="42" width="82" height="42" rx="4" style="fill:var(--deck-accent);opacity:0.22"/>
                <text x="153" y="67">IF</text>
                <rect x="197" y="42" width="82" height="42" rx="4" style="fill:var(--deck-accent);opacity:0.16"/>
                <text x="238" y="67">ID</text>
                <rect x="282" y="42" width="82" height="42" rx="4" style="fill:var(--deck-accent);opacity:0.22"/>
                <text x="323" y="67">EX</text>
                <rect x="367" y="42" width="82" height="42" rx="4" style="fill:var(--warn);opacity:0.20"/>
                <text x="408" y="67">MEM</text>
                <rect x="452" y="42" width="82" height="42" rx="4" style="fill:var(--deck-accent);opacity:0.16"/>
                <text x="493" y="67">WB</text>
                <rect x="197" y="98" width="82" height="42" rx="4" style="fill:var(--deck-accent);opacity:0.22"/>
                <text x="238" y="123">IF</text>
                <rect x="282" y="98" width="82" height="42" rx="4" style="fill:var(--deck-accent);opacity:0.16"/>
                <text x="323" y="123">ID</text>
                <rect x="367" y="98" width="82" height="42" rx="4" style="fill:var(--deck-accent);opacity:0.22"/>
                <text x="408" y="123">EX</text>
                <rect x="452" y="98" width="82" height="42" rx="4" style="fill:var(--warn);opacity:0.20"/>
                <text x="493" y="123">MEM</text>
                <rect x="537" y="98" width="82" height="42" rx="4" style="fill:var(--deck-accent);opacity:0.16"/>
                <text x="578" y="123">WB</text>
                <rect x="282" y="154" width="82" height="42" rx="4" style="fill:var(--deck-accent);opacity:0.22"/>
                <text x="323" y="179">IF</text>
                <rect x="367" y="154" width="82" height="42" rx="4" style="fill:var(--deck-accent);opacity:0.16"/>
                <text x="408" y="179">ID</text>
                <rect x="452" y="154" width="82" height="42" rx="4" style="fill:var(--deck-accent);opacity:0.22"/>
                <text x="493" y="179">EX</text>
                <rect x="537" y="154" width="82" height="42" rx="4" style="fill:var(--warn);opacity:0.20"/>
                <text x="578" y="179">MEM</text>
                <rect x="622" y="154" width="82" height="42" rx="4" style="fill:var(--deck-accent);opacity:0.16"/>
                <text x="663" y="179">WB</text>
                <rect x="367" y="210" width="82" height="42" rx="4" style="fill:var(--deck-accent);opacity:0.22"/>
                <text x="408" y="235">IF</text>
                <rect x="452" y="210" width="82" height="42" rx="4" style="fill:var(--deck-accent);opacity:0.16"/>
                <text x="493" y="235">ID</text>
                <rect x="537" y="210" width="82" height="42" rx="4" style="fill:var(--deck-accent);opacity:0.22"/>
                <text x="578" y="235">EX</text>
                <rect x="622" y="210" width="82" height="42" rx="4" style="fill:var(--warn);opacity:0.20"/>
                <text x="663" y="235">MEM</text>
                <rect x="707" y="210" width="82" height="42" rx="4" style="fill:var(--deck-accent);opacity:0.16"/>
                <text x="748" y="235">WB</text>
              </g>
              <text x="460" y="280" style="fill:var(--ink-3)">填充 4 个周期后，每周期完成一条指令（理想流水：CPI → 1）</text>
            </g>
          </svg>
          <p class="fig-cap">图 5-1　MIPS 五级流水线的时空图</p>
          <p><strong>流水线寄存器</strong>传递的信息：IF/ID（指令、PC+4）、ID/EX（读出的寄存器值、立即数、目标寄存器号）、EX/MEM（ALU 结果、写数据、目标寄存器号）、MEM/WB（读出的数据、ALU 结果、目标寄存器号）。所有指令都沿相同的流水段通过，但并不是所有指令都需要全部阶段（例如 SW 不需要 WB）。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch5-ctrl',
      heading: '4. 流水线的控制',
      blocks: [
        {
          type: 'html',
          html: `
          <p>与单周期设计相比，流水线所需的<strong>控制信号完全相同</strong>！区别在于：对一条给定的指令，这些控制信号在不同的流水段（不同周期）使用。</p>
          <ul>
            <li><strong>方法 1</strong>：像单周期一样，在 ID 段一次译码生成大部分控制信号，然后将信号<strong>逐级缓冲</strong>直到被使用；</li>
            <li><strong>方法 2</strong>：将指令中与控制信号生成有关的域<strong>沿着流水线往下传</strong>，在需要的时候进行相应的译码工作。</li>
          </ul>
          <p>两种方法各有权衡：方法 1 控制线多但每个周期不再译码；方法 2 控制线少但需要多份译码逻辑。实际设计常混合使用（如 ALU 控制在下游用 funct 生成）。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch5-ideal',
      heading: '5. 理想照进现实：偏差与停顿',
      blocks: [
        {
          type: 'html',
          html: `
          <p>理想流水线的三个前提在现实中都不成立：</p>
          <table class="tbl">
            <thead><tr><th>理想前提</th><th>现实偏差</th><th>后果</th></tr></thead>
            <tbody>
              <tr><td>相同的操作</td><td>各不相同的指令，并不总需要经过所有流水段</td><td><strong>外部碎片</strong>（某些流水段空闲）</td></tr>
              <tr><td>均匀的子操作</td><td>不同流水段所需延迟并不完全相同，却受同一个时钟控制</td><td><strong>内部碎片</strong>（快的段也要等满一个周期）</td></tr>
              <tr><td>相互独立的子操作</td><td>指令之间并不独立</td><td>需要检测并解决依赖，导致<strong>流水线暂停</strong></td></tr>
            </tbody>
          </table>
          <p><strong>流水线设计面临的问题</strong>：如何均衡各流水段的工作量（划分多少段、每段做什么）；遇到破坏流水线正常处理的事件（异常、中断）时如何确保正确、满负荷运行；如何优化提升吞吐率（最小化暂停）。</p>
          <p><strong>引起流水线停顿的主要原因</strong>（什么是停顿：导致流水线必须停止向后流动的事件）：</p>
          <ul>
            <li><strong>资源冲突</strong>：多条指令同时使用同一份资源；</li>
            <li><strong>相关</strong>造成冒险：数据相关、控制相关；</li>
            <li><strong>长延迟（多周期）操作</strong>破坏正常流水节奏，如浮点乘除。</li>
          </ul>
          `,
        },
      ],
    },
    {
      id: 'sec-ch5-dep',
      heading: '6. 相关及其分类',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>相关</strong>（dependence）在某些教材上叫「hazard 冒险」，但不严谨。相关限定了指令执行时的顺序要求，限制了一些优化策略（如指令调度）的应用。</p>
          <p><strong>相关的分类</strong>：数据相关（Data dependence）、控制相关（Control dependence）；资源冲突有时候又叫「资源相关」——资源冲突和程序语义没有本质关系，是系统资源配置造成的问题，因此很少提资源相关。</p>
          <p><strong>资源冲突的处理</strong>：</p>
          <ul>
            <li>方案 1：消除引起冲突的原因——重复资源配置或增加资源处理吞吐率（如使用分离的指令和数据缓存、多端口存储器）；</li>
            <li>方案 2：检测资源冲突，并暂停其中一个流水段中指令的处理（调度机制）。例如寄存器文件只有一个读端口和一个写端口时，如何处理 ADD 指令的访问请求？</li>
          </ul>
          <p><strong>数据相关的类型</strong>（下一讲展开）：</p>
          <table class="tbl">
            <thead><tr><th>类型</th><th>含义</th><th>示例</th></tr></thead>
            <tbody>
              <tr><td><strong>真相关</strong>（RAW，流相关）</td><td>Read-after-Write：后读前写</td><td>r3 ← r1 op r2；r5 ← r3 op r4</td></tr>
              <tr><td><strong>反相关</strong>（WAR）</td><td>Write-after-Read：后写前读</td><td>r3 ← r1 op r2；r1 ← r4 op r5</td></tr>
              <tr><td><strong>输出相关</strong>（WAW）</td><td>Write-after-Write：后写前写</td><td>r3 ← r1 op r2；r3 ← r6 op r7</td></tr>
            </tbody>
          </table>
          <p>流相关必须一直遵从（构成指令间基于值的依赖关系）；反相关与输出相关又叫<strong>名相关</strong>，其出现的原因是体系结构中硬件寄存器数量不足——它们相关于同一个寄存器名，而不是一个值。</p>
          <p><strong>控制相关</strong>：数据相关于 PC——所有指令均控制相关于它前面的指令。分支指令使数据流具有动态性（某条指令的源操作数可能有多个来源），因此仅保持数据相关还不够，必须保持控制相关才能保持数据流。</p>
          `,
        },
      ],
    },
  ],
};

export default ch;
