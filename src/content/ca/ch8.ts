/* 计算机体系结构 · 第8讲 指令级并行 II —— 依据「课件/08-指令级并行 II.pptx」（李建华，65 页）整理 */
import type { CaChapter } from './types';

const ch: CaChapter = {
  id: 'ch8',
  no: '第8讲',
  title: '指令级并行 II',
  subtitle: '第 8 讲 · 指令级并行 II',
  lede: `
  在静态调度（编译器把相关指令拉开距离）之后，本讲进入<strong>动态调度</strong>：乱序执行、精确异常、<strong>Tomasulo 算法</strong>（保留站 + 寄存器重命名 + 公共数据总线），
        再讲<strong>动态分支预测</strong>（BHT 的 1 位/2 位方案、BTB）与<strong>前瞻执行</strong>（ROB 实现顺序确认与精确异常）。
        本讲是全课程密度最高的一讲：Tomasulo 三阶段与 ROB 四字段是简答与分析的常客。
`,
  toc: [
    { id: 'sec-ch8-dynamic', text: '1. 静态调度与动态调度', level: 2 },
    { id: 'sec-ch8-exception', text: '2. 动态调度与精确异常', level: 2 },
    { id: 'sec-ch8-tomasulo', text: '3. Tomasulo 算法', level: 2 },
    { id: 'sec-ch8-bht', text: '4. 动态分支预测：BHT 与 BTB', level: 2 },
    { id: 'sec-ch8-rob', text: '5. 前瞻执行与 ROB', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ch8-dynamic',
      heading: '1. 静态调度与动态调度',
      blocks: [
        {
          type: 'html',
          html: `
          <table class="tbl">
            <thead><tr><th></th><th>静态调度</th><th>动态调度</th></tr></thead>
            <tbody>
              <tr><td>做法</td><td>依靠编译器对代码进行调度，以减少相关和冲突；在编译期间完成，不在程序执行过程中进行</td><td>在程序执行过程中，依靠专门的硬件对指令进行调度，以减少数据相关导致的流水线停顿</td></tr>
              <tr><td>手段</td><td>把相关的指令拉开距离；循环展开与指令调度</td><td>硬件检测 + 乱序执行</td></tr>
              <tr><td>优点</td><td>不需要额外硬件</td><td>能处理编译时情况不明的相关（如存储器访问相关：访存地址在执行段才算出）；使面向某一流水线优化编译的代码在其它的流水线（动态调度）上也能高效执行，减轻编译器负担</td></tr>
              <tr><td>缺点</td><td>静态代码难以覆盖所有运行时情况</td><td>硬件开销显著增加：更复杂的控制、更多通路、更多存储空间</td></tr>
            </tbody>
          </table>
          <p><strong>顺序执行的局限</strong>：此前流水线的最大局限是——指令必须按序流出（进入流水线）和执行（In-Order Execution）：</p>
          <pre class="code"><code>DIV.D   F4, F0, F2
SUB.D   F10, F4, F6     // 与 DIV.D 关于 F4 相关，必须等
ADD.D   F12, F6, F14    // 与前面无关，却被连带阻塞</code></pre>
          <p>ID 段要检测结构冲突与数据相关，一旦一条指令受阻，其后的指令都将停顿——这是性能瓶颈所在。</p>
          <p><strong>乱序执行</strong>（Out-of-Order Execution）：把 5 段流水线的译码段拆成两段——</p>
          <ul>
            <li><strong>流出</strong>（Issue，IS，又叫发射）：指令译码，检查是否存在结构冲突（in-order issue）；</li>
            <li><strong>读操作数</strong>（Read Operands，RO）：等待数据冲突消失，然后读操作数。</li>
          </ul>
          <p>哪条指令先获得数据（值），就可以先行起飞。在顺序执行的 MIPS 5 段流水线中不会发生 WAR 和 WAW 造成的冒险；但乱序执行使其可能发生（DIV.D F10；SUB.D F10（WAW）；ADD.D F6（与更早的写 F6 构成 WAR））——Tomasulo 算法通过<strong>寄存器重命名</strong>动态消除名相关。</p>
          <p>动态调度的流水线会导致多条指令同时处于执行中：要求具有多个功能部件或流水功能单元；<strong>假定没有结构冒险</strong>。指令乱序完成带来的最大问题是异常处理复杂。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch8-exception',
      heading: '2. 动态调度与精确异常',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>不精确异常</strong>：当执行指令 i 导致发生异常时，处理机的现场（状态）与严格按程序顺序执行指令 i 发生异常时的现场不同——异常处理后难以接着继续执行程序。</p>
          <p><strong>精确异常</strong>：发生异常时处理机的现场与严格按程序顺序执行指令 i 发生异常时的现场相同。</p>
          <p>动态调度下保持精确异常的难点：</p>
          <ul>
            <li>指令乱序执行——指令 i 发生异常时，流水线可能已经执行完程序顺序下位于 i 之后的部分指令；也可能还没完成位于 i 之前的指令；</li>
            <li>要确保程序结果正确，需要保持正确的异常行为（另一个要保持的是<strong>数据流</strong>）：对于一条会产生异常的指令，只有当处理器确切知道该指令将被执行后，才允许它产生异常；</li>
            <li>即使保持了正确的异常行为，动态调度处理机仍可能发生不精确异常（因为现场顺序已被打乱）。</li>
          </ul>
          <p>解决方向：让结果的可见性按序发生——这就是本讲最后「前瞻执行 + ROB」的目的。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch8-tomasulo',
      heading: '3. Tomasulo 算法',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>背景</strong>：为 IBM 360/91 设计，在 CDC 6600 三年之后发表（1966）。目标：即使在没有特殊编译支持的情况下，也能让流水线处理器取得高性能。它深刻影响了后续一系列产品：Alpha 21264、HP 8000、MIPS 10000、Pentium II、PowerPC 604……</p>
          <svg class="fig" viewBox="0 0 780 300" role="img" aria-label="Tomasulo 算法结构：保留站虚拟化功能部件，公共数据总线广播结果">
            <g font-size="12" text-anchor="middle" style="font-family:var(--font)">
              <defs>
                <marker id="ca-arr2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" style="fill:var(--ink-3)"/>
                </marker>
              </defs>
              <g style="fill:var(--panel-2);stroke:var(--deck-accent)" stroke-width="1.5">
                <rect x="260" y="24" width="240" height="46" rx="8"/>
                <rect x="20" y="124" width="120" height="46" rx="8"/>
                <rect x="180" y="124" width="140" height="46" rx="8"/>
                <rect x="350" y="124" width="140" height="46" rx="8"/>
                <rect x="520" y="124" width="140" height="46" rx="8"/>
              </g>
              <g style="fill:var(--ink)" font-weight="700">
                <text x="380" y="52">指令队列 / 译码</text>
                <text x="80" y="151">寄存器堆</text>
                <text x="250" y="151">保留站 Add</text>
                <text x="420" y="151">保留站 Mult</text>
                <text x="590" y="151">Load 缓冲</text>
              </g>
              <g style="stroke:var(--ink-3)" stroke-width="1.4" fill="none">
                <path d="M300,70 L255,124" marker-end="url(#ca-arr2)"/>
                <path d="M380,70 L420,124" marker-end="url(#ca-arr2)"/>
                <path d="M460,70 L585,124" marker-end="url(#ca-arr2)"/>
                <path d="M140,147 L176,147" marker-end="url(#ca-arr2)"/>
                <path d="M250,172 L250,222" marker-end="url(#ca-arr2)"/>
                <path d="M420,172 L420,222" marker-end="url(#ca-arr2)"/>
                <path d="M590,172 L590,222" marker-end="url(#ca-arr2)"/>
              </g>
              <text x="330" y="104" style="fill:var(--ink-3)" font-size="11">Issue：① 有空闲保留站 ② 操作数替换为值或保留站指针（换名）</text>
              <path d="M40,232 L740,232" style="stroke:var(--deck-accent)" stroke-width="2.4" marker-end="url(#ca-arr2)"/>
              <text x="390" y="258" style="fill:var(--ink)" font-weight="700">公共数据总线 CDB（64 位值 + 4 位功能部件编码）</text>
              <text x="390" y="278" style="fill:var(--ink-3)" font-size="11">执行完成的结果经 CDB 广播：写给所有等待该结果的保留站，同时更新寄存器堆（无需专用写端口）</text>
            </g>
          </svg>
          <p class="fig-cap">图 8-1　Tomasulo 结构：保留站虚拟化功能部件，结果经 CDB 广播</p>
          <p><strong>算法特征</strong>：</p>
          <ul>
            <li>控制与缓冲器<strong>分布于功能部件</strong>：每个功能部件配置<strong>保留站</strong>（reservation station），用来存放未决的操作数（值）；</li>
            <li>指令中的寄存器被动态地换成数值或指向保留站的指针——<strong>寄存器重命名</strong>，消除 WAR、WAW 相关造成的冒险；</li>
            <li>保留站比实际寄存器多，可以完成编译阶段不能完成的一些优化；</li>
            <li>计算结果从保留站通过<strong>公共数据总线</strong>（Common Data Bus）直通功能部件，无需通过寄存器；</li>
            <li>Load 与 Store 也像其他功能部件一样具有保留站（专门的缓冲器）。</li>
          </ul>
          <p><strong>三个阶段</strong>：</p>
          <table class="tbl">
            <thead><tr><th>阶段</th><th>做法</th></tr></thead>
            <tbody>
              <tr><td><strong>1. 发射 Issue</strong></td><td>从 FP Op Queue 取出指令；如果保留站空闲（无结构冒险），发射指令并发送操作数（对寄存器换名，消除名相关）</td></tr>
              <tr><td><strong>2. 执行 Execution</strong></td><td>两个操作数都已就绪就执行（RAW 的处理）；未就绪则观测 CDB 等待所需结果</td></tr>
              <tr><td><strong>3. 写结果 Write Result</strong></td><td>通过 CDB 将结果写入所有等待的部件（广播）；标记保留站可用（Not busy）</td></tr>
            </tbody>
          </table>
          <p><strong>保留站的组成</strong>：Op（具体操作）；V<sub>j</sub>、V<sub>k</sub>（源操作数的实际数值；Store 缓冲器设 V 域存放待存结果）；Q<sub>j</sub>、Q<sub>k</sub>（将产生源寄存器值的保留站）；Busy（RS/FU 忙状态）。Register result status 指明哪个功能部件将写到哪个寄存器（Q<sub>i</sub>）。</p>
          <p><strong>课件示例</strong>（LD 2 拍、ADD 2 拍、Mult 10 拍、Divd 40 拍）：</p>
          <pre class="code"><code>L.D     F6, 34(R2)
L.D     F2, 45(R3)
MUL.D   F0, F2, F4
SUB.D   F8, F6, F2
DIV.D   F10, F0, F6
ADD.D   F6, F8, F2</code></pre>
          <p>逐周期推导的要点：第 3 周期 F2 已被换名为 Load2；第 5 周期 SUBD 与 MULT 同时从 CDB 获得值；第 11 周期 ADDD 写结果；第 16 周期只有除法未完成；第 56 周期 MULT2 完成；<strong>第 57 周期全部完成</strong>。整个过程：指令<strong>按序发射、乱序执行、乱序完成</strong>。</p>
          <div class="callout warn">
            <p><strong>Tomasulo 的缺点</strong>：功能实现复杂、控制复杂；需要大量高速的相联存储，存储开销大；<strong>CDB 是制约性能增长的瓶颈</strong>——每个 CDB 必须广播到多个功能部件（大容量、写操作密集），每周期可同时完成的功能部件数量可能受单总线限制（最坏为 1）；多个 CDB 又让 FU 需要更复杂的逻辑控制。</p>
          </div>
          `,
        },
      ],
    },
    {
      id: 'sec-ch8-bht',
      heading: '4. 动态分支预测：BHT 与 BTB',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>动态分支预测</strong>：在程序运行时（runtime），根据分支指令过去的历史来预测其将来的行为；如果分支行为发生变化，预测结果也跟着改变。相比静态预测有更好的预测准确度和适应性。</p>
          <p>带来的性能提升取决于：预测的准确性（正确率）；预测正确以及不正确时的开销。开销又取决于：流水线结构、预测方法的开销、恢复策略的开销。</p>
          <p>两个任务：① 预测分支是否成功；② 预测分支目标地址。对任务①，需要解决两个关键问题：如何记录历史信息？如何根据历史信息预测？后勤保障：预测失败时如何保持正确性——必须能作废已经取指并进入后续流水段的指令、恢复现场，并从另一条分支路径重新取指。</p>
          <h3 id="sec-ch8-bht-h1">BHT（分支历史表）</h3>
          <p>最简单的动态分支预测方法：用 BHT 记录分支指令最近一次或几次的执行情况（成功或不成功），并据此预测。</p>
          <ul>
            <li><strong>1 位方案</strong>：记录最近一次历史，只需 1 位——简单，但精度不高；</li>
            <li><strong>2 位方案</strong>：用 2 个比特记录分支历史，提高准确度；研究表明两位分支预测的性能与 n 位（n&gt;2）差不多。（特别提示：考虑<strong>循环的首尾</strong>——循环退出时 2 位方案要错 2 次。）</li>
          </ul>
          <svg class="fig" viewBox="0 0 660 300" role="img" aria-label="两位分支预测的四个状态与转换关系">
            <g font-size="12" text-anchor="middle" style="font-family:var(--font)">
              <defs>
                <marker id="ca-arr3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" style="fill:var(--ink-3)"/>
                </marker>
              </defs>
              <g style="fill:var(--panel-2);stroke:var(--deck-accent)" stroke-width="1.6">
                <rect x="60" y="60" width="180" height="60" rx="12"/>
                <rect x="420" y="60" width="180" height="60" rx="12"/>
                <rect x="60" y="190" width="180" height="60" rx="12"/>
                <rect x="420" y="190" width="180" height="60" rx="12"/>
              </g>
              <g style="fill:var(--ink)" font-weight="700">
                <text x="150" y="86">11 强跳转</text>
                <text x="510" y="86">10 弱跳转</text>
                <text x="150" y="216">01 弱不跳</text>
                <text x="510" y="216">00 强不跳</text>
              </g>
              <g style="fill:var(--ink-3)" font-size="11.5">
                <text x="150" y="104">预测：跳</text>
                <text x="510" y="104">预测：跳</text>
                <text x="150" y="234">预测：不跳</text>
                <text x="510" y="234">预测：不跳</text>
              </g>
              <g style="stroke:var(--ink-3)" stroke-width="1.4" fill="none" marker-end="url(#ca-arr3)">
                <path d="M240,80 L420,80"/>
                <path d="M420,100 L240,100"/>
                <path d="M510,120 L510,190"/>
                <path d="M420,210 L240,210"/>
                <path d="M240,230 L420,230"/>
                <path d="M150,190 L150,120"/>
              </g>
              <g style="fill:var(--ink-2)" font-size="11.5">
                <text x="330" y="72">不跳转（降级）</text>
                <text x="330" y="114">跳转（升级）</text>
                <text x="522" y="160" text-anchor="start">不跳转</text>
                <text x="330" y="202">跳转（升级）</text>
                <text x="330" y="244">不跳转（降级）</text>
                <text x="136" y="160" text-anchor="end">跳转（升级）</text>
              </g>
            </g>
          </svg>
          <p class="fig-cap">图 8-2　两位分支预测的状态转换（相邻状态才移动一格，具有「滞后」特性）</p>
          <p><strong>BHT 的工作步骤</strong>：Step 1 分支预测——分支指令到达 ID 段时，根据 BHT 读出的信息预测并取指；预测正确则流水线不断流，否则作废已预取和分析的指令、恢复现场、从另一条路径重新取指。Step 2 状态修改——结果确定后更新 BHT 状态。</p>
          <p>BHT 只在<strong>判定分支是否成功所需时间大于确定分支目标地址所需时间</strong>时才有用：它只预测分支成功与否，并不计算分支目标地址。研究表明：对 SPEC89，4K 大小的 BHT 预测准确率为 82%～99%，一般 4K 就够了。实现上 BHT 可以与分支指令一起存放在指令缓存中，也可以用专门的硬件结构。</p>
          <h3 id="sec-ch8-bht-h2">BTB（分支目标缓冲器）</h3>
          <p>目标：将分支成功时的开销降为 0。方法：把分支成功的分支指令的地址和它的分支目标地址都放到缓冲区中保存，以<strong>分支指令的地址</strong>作为标识。表中每项通常有两个字段：执行过的成功分支指令的地址（通常是 PC 的低位比特，作为匹配标识 key）；预测的分支目标地址。</p>
          <table class="tbl">
            <thead><tr><th>指令在 BTB 中？</th><th>预测</th><th>实际情况</th><th>延迟周期</th></tr></thead>
            <tbody>
              <tr><td>是</td><td>成功</td><td>成功</td><td>0</td></tr>
              <tr><td>是</td><td>成功</td><td>不成功</td><td>2</td></tr>
              <tr><td>不是</td><td>—</td><td>成功</td><td>2</td></tr>
              <tr><td>不是</td><td>—</td><td>不成功</td><td>0</td></tr>
            </tbody>
          </table>
          <p>其它方法：Two-level Adaptive BP、Tournament BP、Neural branch prediction（参考教材 3.3 节）——分支预测在体系结构领域一直是热点。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch8-rob',
      heading: '5. 前瞻执行与 ROB',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>前瞻执行</strong>（speculative execution）的基本思想：对分支指令的结果进行猜测，假设猜测总是对的，然后按猜测的 PC 继续取指、流出和执行；猜测执行的指令结果<strong>不写回</strong>寄存器或存储器，而放到 <strong>ROB</strong>（Re-Order Buffer，重排序缓冲器）中；等指令得到「确认」（commit）之后，才从 ROB 读出并写入寄存器或存储器。</p>
          <p>基于硬件的前瞻执行结合了三种思想：动态分支预测（确定后续要执行的指令）；在控制相关结果出来之前前瞻地执行；用动态调度对基本块的各种组合跨块调度。</p>
          <p><strong>实现</strong>：对 Tomasulo 算法加以扩充，把「写结果」与「指令完成」区分成两个段——</p>
          <ul>
            <li><strong>写结果段</strong>：把前瞻执行的结果写到 ROB 中；通过 CDB 在指令之间传送结果，供需要它的指令使用；</li>
            <li><strong>指令确认段</strong>：分支结果出来后确认——猜测正确则把 ROB 中的结果写到寄存器或存储器；猜测错误则不确认，并从正确的分支路径重新取指执行。</li>
          </ul>
          <div class="callout key"><p><strong>关键思想：允许指令乱序执行，但必须顺序确认。</strong>顺序确认实现精确异常；异常只在指令确认时才被承认。</p></div>
          <p><strong>ROB 每项 4 个字段</strong>：</p>
          <table class="tbl">
            <thead><tr><th>字段</th><th>含义</th></tr></thead>
            <tbody>
              <tr><td>指令类型</td><td>标记该指令是分支指令、store 指令或寄存器操作指令</td></tr>
              <tr><td>目标地址</td><td>结果应写入的目标寄存器号（load/ALU）或存储器单元地址（store）</td></tr>
              <tr><td>数据值</td><td>保存前瞻执行的结果，直到指令确认</td></tr>
              <tr><td>就绪字段</td><td>指出指令是否已完成执行并且数据就绪</td></tr>
            </tbody>
          </table>
          <p><strong>执行步骤</strong>（ROB 承担了 Tomasulo 中保留站的换名功能）：</p>
          <ul>
            <li><strong>流出</strong>：从指令队列头取一条指令；若有空闲保留站 r 且有空闲 ROB 项 b，就流出并把信息放入 r 与 b；若保留站满或 ROB 满则停止流出（结构冲突）；</li>
            <li><strong>执行</strong>：两个操作数就绪后执行；未就绪则等待并监测 CDB（RAW）；</li>
            <li><strong>写结果</strong>：结果连同 ROB 项编号放到 CDB 上，写到 ROB 及所有等待的保留站（data forwarding）；释放保留站。Store 指令特殊：待写数据就绪后写入其 ROB 项；</li>
            <li><strong>确认</strong>：非分支、非 store 指令到达 ROB 队头且结果就绪时，写目标寄存器并删除该 ROB 项；store 指令到达队头时把结果写入存储器；<strong>分支指令</strong>：预测错误到达队头时清空 ROB、从另一条分支重新执行；预测正确到达队头时执行完毕。</li>
          </ul>
          <p><strong>课件示例</strong>（加法 2 拍、乘法 10 拍、除法 40 拍）：</p>
          <pre class="code"><code>L.D     F6, 34(R2)
L.D     F2, 45(R3)
MUL.D   F0, F2, F4
SUB.D   F8, F6, F2
DIV.D   F10, F0, F6
ADD.D   F6, F8, F2</code></pre>
          <p>MUL.D 即将确认时：保留站中 Mult1（MUL，操作数已就绪，Dest #3）、Mult2（DIV，Q<sub>j</sub>=#3，等 MUL 结果）；ROB 中 1、2 号已确认，3 号（MUL.D）写结果，4 号（SUB.D）写结果，5 号（DIV.D）执行中，6 号（ADD.D）写结果；浮点寄存器状态 F0←ROB3、F6←ROB6、F8←ROB4、F10←ROB5。</p>
          <p><strong>优缺点</strong>：主要优点是<strong>通过 ROB 实现了指令的顺序完成</strong>，从而能够实现精确异常，且很容易推广到整数寄存器和整数功能单元；主要缺点是复杂的控制导致所需的硬件太复杂。</p>
          <p>本讲最后的多指令流出技术（教材 3.7 节）为自学内容。</p>
          `,
        },
      ],
    },
  ],
};

export default ch;
