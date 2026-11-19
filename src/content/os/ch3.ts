/* 操作系统 · 第3章 处理机调度与死锁 —— 依据「附件/PPT-按章/3-1处理机进程调度(操作系统).pdf」与「3-2处理机进程死锁(操作系统).pdf」（合肥工业大学操作系统课程组，2014）整理 */
import type { OsChapter } from './types';

const ch: OsChapter = {
  id: 'ch3',
  no: '第3章',
  title: '处理机调度与死锁',
  subtitle: '第 3 章 · 处理机调度与死锁',
  lede: `
  本章分<strong>进程调度</strong>与<strong>死锁</strong>两个专题。前半讲三级调度、六种调度算法（FCFS / SJF / FPF / 高响应比 / RR / 多级反馈队列）
        与实时调度（EDF、LLF）；后半讲死锁的定义、产生原因与四个必要条件，以及预防、避免（银行家算法）、检测解除三条应对路线。
        计算题（周转时间、响应比、银行家算法、安全性判定）是期末大题的常客。
`,
  toc: [
    { id: 'sec-ch3-concept', text: '1. 处理机调度的基本概念', level: 2 },
    { id: 'sec-ch3-concept-h1', text: '高级、中级、低级三级调度', level: 3 },
    { id: 'sec-ch3-concept-h2', text: '调度队列模型', level: 3 },
    { id: 'sec-ch3-concept-h3', text: '选择调度方式和衡量调度算法的性能', level: 3 },
    { id: 'sec-ch3-algo', text: '2. 调度算法', level: 2 },
    { id: 'sec-ch3-algo-h1', text: '先来先服务调度算法（FCFS）', level: 3 },
    { id: 'sec-ch3-algo-h2', text: '短作业/短进程优先调度算法（SJF/SPF）', level: 3 },
    { id: 'sec-ch3-algo-h3', text: '高优先权优先调度算法（FPF）', level: 3 },
    { id: 'sec-ch3-algo-h4', text: '高响应比优先调度算法', level: 3 },
    { id: 'sec-ch3-algo-h5', text: '时间片轮转调度算法（RR）', level: 3 },
    { id: 'sec-ch3-algo-h6', text: '多级反馈队列调度算法', level: 3 },
    { id: 'sec-ch3-realtime', text: '3. 实时调度', level: 2 },
    { id: 'sec-ch3-deadlock', text: '4. 死锁的基本概念', level: 2 },
    { id: 'sec-ch3-prevent', text: '5. 预防死锁', level: 2 },
    { id: 'sec-ch3-avoid', text: '6. 避免死锁', level: 2 },
    { id: 'sec-ch3-avoid-h1', text: '安全状态与不安全状态', level: 3 },
    { id: 'sec-ch3-avoid-h2', text: '银行家算法', level: 3 },
    { id: 'sec-ch3-detect', text: '7. 死锁的检测和解除', level: 2 },
    { id: 'sec-ch3-exercise', text: '8. 本章习题', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ch3-concept',
      heading: '1. 处理机调度的基本概念',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ch3-concept-h1">高级、中级、低级三级调度</h3>
          <p><strong>(1) 高级调度</strong>（Long-Term Scheduling）：用于决定把外存上处于后备队列中的哪些作业调入内存，并为它们创建进程、分配必要的资源，然后再将新创建的进程排在就绪队列上，准备执行。又称长程调度、作业调度、接纳调度。<strong>对象：作业</strong>。特点：调度频率低（几分钟或几十分钟）；调度算法可以很复杂。</p>
          <p><strong>(2) 低级调度</strong>（Low-Level Scheduling）：用来决定就绪队列中的哪个进程应获得处理机，然后再由分派程序执行把处理机分配给该进程的具体操作。又称进程调度、短程调度。<strong>对象：就绪进程</strong>。特点：调度频率高（几毫秒或几十毫秒）；调度算法通常简单，保证算法执行时间短。</p>
          <p>低级调度的<strong>调度方式</strong>：</p>
          <ul>
            <li><strong>非抢占方式</strong>（非剥夺方式/不可剥夺方式）：当某一进程正在处理机上执行时，即使有某个更为重要或紧迫的进程进入就绪队列，仍然让正在执行的进程继续执行，直到该进程完成或发生某种事件而进入完成或阻塞状态时，才把处理机分配给更为重要或紧迫的进程。简单，系统开销小，实时性差；不安全：霸占 CPU，造成进程「饥饿」。</li>
            <li><strong>抢占方式</strong>（剥夺方式/可剥夺方式）：当一个进程正在处理机上执行时，若有某个更为重要或紧迫的进程需要使用处理机，则立即暂停正在执行的进程，将处理机分配给这个更重要或紧迫的进程。安全：不会霸占 CPU。抢占依据的原则：优先权原则、短作业（进程）优先、时间片原则。</li>
          </ul>
          <p><strong>(3) 中级调度</strong>（Intermediate-Level Scheduling）：主要目的是为了提高内存利用率和系统吞吐量。应使那些暂时不能运行的进程不再占用宝贵的内存资源，而将它们调至外存上去等待，把此时的进程状态称为就绪驻外存状态或挂起状态；当这些进程重又具备运行条件、且内存又稍有空闲时，由中级调度来决定把外存上的哪些进程重新调入内存，并修改其状态为就绪状态，挂在就绪队列上等待进程调度。由此引入了内存就绪（进程在内存中就绪）和外存就绪（进程在外存中就绪）、内存阻塞和外存阻塞的区分。<strong>对象：就绪进程、阻塞进程</strong>。特点：调度频率介于高级调度和低级调度之间；实际就是内存管理的「对换」功能。</p>
          <svg class="fig" viewBox="0 0 660 240" role="img" aria-label="三级调度与进程状态层次图">
            <g font-size="13.5" text-anchor="middle" style="font-family:var(--font)">
              <defs>
                <marker id="a3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" style="fill:var(--ink-3)"/>
                </marker>
              </defs>
              <g style="fill:var(--panel-2);stroke:var(--hairline)">
                <rect x="30" y="30" width="130" height="40" rx="10"/>
                <rect x="270" y="30" width="120" height="40" rx="10"/>
                <rect x="500" y="30" width="120" height="40" rx="10"/>
                <rect x="30" y="130" width="130" height="40" rx="10"/>
                <rect x="270" y="130" width="120" height="40" rx="10"/>
                <rect x="500" y="130" width="120" height="40" rx="10"/>
              </g>
              <g style="fill:var(--ink)" font-weight="700">
                <text x="95" y="55">后备队列(外存)</text>
                <text x="330" y="55">就绪队列(内存)</text>
                <text x="560" y="55">CPU 运行</text>
                <text x="95" y="155">外存就绪/阻塞</text>
                <text x="330" y="155">内存就绪/阻塞</text>
                <text x="560" y="155">完成/等待事件</text>
              </g>
              <g style="stroke:var(--ink-3)" stroke-width="1.5" marker-end="url(#a3)" fill="none">
                <path d="M160,50 L270,50"/>
                <path d="M390,50 L500,50"/>
                <path d="M560,70 L560,130"/>
                <path d="M160,150 L270,150"/>
                <path d="M390,150 L500,150"/>
                <path d="M330,130 L330,70"/>
              </g>
              <g style="fill:var(--deck-accent)" font-size="12.5" font-weight="700">
                <text x="215" y="40">高级调度</text>
                <text x="445" y="40">低级调度</text>
                <text x="215" y="176">中级调度（对换）</text>
                <text x="445" y="176">低级调度</text>
              </g>
            </g>
          </svg>
          <p class="fig-cap">图 3-1　高级、中级、低级三级调度的位置与作用</p>
          <h3 id="sec-ch3-concept-h2">调度队列模型</h3>
          <p>三种调度队列模型：① 仅有进程调度的调度队列模型（CPU 上直接从就绪队列取进程）；② 具有高级调度和低级调度的调度队列模型（作业先入后备队列，经高级调度进入就绪队列）；③ 同时具有高、中、低三级调度的调度队列模型（挂起队列在内外存间由中级调度对换）。</p>
          <h3 id="sec-ch3-concept-h3">选择调度方式和衡量调度算法的性能</h3>
          <p><strong>(1) 面向用户的准则</strong>：</p>
          <ul>
            <li><strong>周转时间短</strong>：周转时间是从作业提交给系统开始，到作业完成为止的时间间隔，包括 1) 作业在后备队列的等待时间；2) 进程在就绪队列的等待时间；3) 进程在 CPU 上的执行时间；4) 进程等待 I/O 操作时间。平均周转时间 T̄ = (1/n)·ΣTi（Ti 为第 i 个作业的周转时间）。平均带权周转时间 W̄ = (1/n)·Σ(Ti/Tsi)，其中 Tsi 为第 i 个作业的要求服务时间（即 3)+4) 时间）。</li>
            <li><strong>响应时间快</strong>：响应时间是用户从提交键盘命令开始，到系统首次给出响应为止的时间；</li>
            <li><strong>截止时间保证</strong>：截止时间是作业/进程开始或结束的最晚时间。</li>
          </ul>
          <p><strong>(2) 面向系统的准则</strong>：系统吞吐量高——吞吐量是系统单位时间内完成的作业/进程数量；处理机利用率好；资源利用均衡。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch3-algo',
      heading: '2. 调度算法',
      blocks: [
        {
          type: 'html',
          html: `
          <p>调度算法的实质是一种资源分配——根据系统的资源分配策略所规定的资源分配算法。对于不同的系统和系统目标通常采用不同的调度算法：批处理系统为照顾为数众多的短作业，应采用短作业优先的调度算法；分时系统为保证合理的响应时间，应采用轮转法进行调度。有的算法适用于作业调度，有的适用于进程调度，也有些调度算法两者都可用。</p>
          <h3 id="sec-ch3-algo-h1">先来先服务调度算法（FCFS）</h3>
          <p><strong>基本设计思想</strong>：既可用于作业调度，也可用于进程调度。用于作业调度：每次调度从后备作业队列中选择一个或多个最先进入该队列的作业，将它们调入内存，为它们分配资源、创建进程，然后放入就绪队列。用于进程调度：每次调度从就绪队列中选择一个最先进入队列的进程，为之分配处理机，使之投入运行。</p>
          <p><strong>特点</strong>：本质仅考虑「到达时间」；实现简单；貌似公平；实际上对短作业不公平。</p>
          <h3 id="sec-ch3-algo-h2">短作业/短进程优先调度算法（SJF/SPF）</h3>
          <p><strong>基本设计思想</strong>：既可用于作业调度（SJF），也可用于进程调度（SPF）。用于作业调度：每次调度从后备作业队列中选择一个要求服务时间（执行时间）最短的作业，调入内存、分配资源、创建进程，放入就绪队列。用于进程调度：每次调度从就绪队列中选择一个执行时间最短的进程，为之分配处理机，使之投入运行。</p>
          <p><strong>特点</strong>：本质仅考虑「执行时间」；实现困难——估算执行时间很难；有利于短作业；对长作业不公平。</p>
          <div class="callout key">
            <p class="callout-h">算法对比实例 1</p>
            <p>5 个进程 A、B、C、D、E 分别于 0、1、2、3、4 时刻到达系统，要求服务时间分别为 4、3、5、2、4。请计算：(1) 采用 FCFS 时进程执行顺序和平均周转时间；(2) 采用 SPF 时进程执行顺序和平均周转时间。（完整解答见「期末大题精讲 · 处理机调度算法」）</p>
          </div>
          <h3 id="sec-ch3-algo-h3">高优先权优先调度算法（FPF）</h3>
          <p><strong>基本设计思想</strong>：既可用于作业调度，也可用于进程调度。用于作业调度时：系统将从后备队列中选择若干个优先权最高的作业装入内存。用于进程调度时：把处理机分配给就绪队列中优先权最高的进程，分为非抢占式优先权算法和抢占式优先权调度算法。</p>
          <p><strong>优先权</strong>：算法的核心，反映作业/进程执行时的迫切程度，是对调度所考虑的实际因素的算法抽象，通常用一个整型数表示。进程的优先权：抢占式优先权（进程调度）——高优先权进程到达时，立刻停止低优先权进程的执行，让高优先权进程执行；非抢占式优先权（进程调度）——高优先权作业进程到达时，须等待低优先权进程执行完毕或主动释放 CPU。</p>
          <p><strong>优先权的确定</strong>：静态优先权——进程创建时确定（根据进程类型、资源需求和用户要求等），直到进程执行结束保持不变；动态优先权——进程创建时确定初始优先权，在进程执行过程中可以发生变化。优先权示例：Windows 2000/XP 的 32 级线程优先权。</p>
          <h3 id="sec-ch3-algo-h4">高响应比优先调度算法</h3>
          <p><strong>基本设计思想</strong>：用于作业调度。系统将从后备队列中选择若干个响应比（优先权）最高的作业装入内存，投入运行。核心：对等待作业以一定速率 a 提高其优先权。</p>
          <div class="formula">响应比 R<sub>p</sub> = 优先权 = <span class="m">（等待时间 + 要求服务时间）／要求服务时间</span> = <span class="m">等待时间／要求服务时间 + 1</span></div>
          <p><strong>特点</strong>：</p>
          <ul>
            <li>如果作业的等待时间相同，则要求服务的时间愈短，其优先权愈高，因而该算法有利于短作业；</li>
            <li>当要求服务的时间相同时，作业的优先权决定于其等待时间，等待时间愈长，其优先权愈高，因而它实现的是先来先服务；</li>
            <li>对于长作业，作业的优先级可以随等待时间的增加而提高，当其等待时间足够长时，其优先级便可升到很高，从而获得处理机；</li>
            <li>既照顾了短作业，又考虑了作业到达的先后次序，不会使长作业长期得不到服务——该算法实现了一种较好的折衷；</li>
            <li>须做响应比计算，会增加系统开销。</li>
          </ul>
          <h3 id="sec-ch3-algo-h5">时间片轮转调度算法（RR）</h3>
          <p><strong>基本设计思想</strong>：用于作业调度或进程调度。在早期的时间片轮转法中，系统将所有的就绪进程按先来先服务的原则排成一个队列，每次调度时把 CPU 分配给队首进程，并令其执行一个时间片。系统保证就绪队列中的所有进程在一给定的时间内均能获得一个时间片的处理机执行时间——换言之，系统能在给定的时间内响应所有用户的请求。当执行的时间片用完时，由一个计时器发出时钟中断请求，调度程序便据此信号来停止该进程的执行，并将它送往就绪队列的末尾；然后再把处理机分配给就绪队列中新的队首进程，同时也让它执行一个时间片。时间片的大小从几毫秒到几百毫秒。</p>
          <p><strong>时间片（Time Slice）</strong>：时间片选择有固定时间片与可变时间片。时间片大小选择：不可太大——影响最大响应时间（T = n·q，其中 n 为进程数量，q 为时间片大小）；不可太小——调度开销增加周转时间。</p>
          <h3 id="sec-ch3-algo-h6">多级反馈队列调度算法</h3>
          <p><strong>算法概述</strong>：</p>
          <ul>
            <li>设置多个就绪队列，为各队列赋予不同的优先级。第 1 个队列的优先级最高，其余队列优先权逐个降低；</li>
            <li>赋予各个队列中进程执行时间片的大小各不相同：优先权愈高的队列中，为每个进程所规定的执行时间片就愈小；</li>
            <li>仅当第 1 队列空闲时，调度程序才调度第 2 队列中的进程运行；仅当第 1～(i−1) 队列均空时，才会调度第 i 队列中的进程运行；</li>
            <li>如果处理机正在第 i 队列中为某进程服务时，又有新进程进入优先权较高的队列（第 1～(i−1) 中的任何一个队列），则此时新进程将抢占正在运行进程的处理机（正在运行进程被放回原所在队列末尾）；</li>
            <li>对新创建进程，首先将它放入第 1 队列末尾，按 FCFS 原则排队等待调度。当轮到该进程执行时，如它能在该时间片内完成，则结束；如果未完成，调度程序便将该进程转入第 2 队列的末尾，再同样按 FCFS 原则等待调度执行；如果它在第 2 队列中运行 1 个时间片后仍未完成，再依次将它放入第 3 队列……如此下去，当一个长作业（进程）从第 1 队列依次降到第 n 队列后，在第 n 队列中便采取按时间片轮转的方式运行。</li>
          </ul>
          <p><strong>特点</strong>：</p>
          <ul>
            <li>避免了事先计算各种进程所需的执行时间；</li>
            <li>具有较好的性能，能较好地满足各种类型用户需要：</li>
            <li>终端型作业用户：终端型作业大多属于交互型作业，作业通常较小，系统只要能使这些作业（进程）在第一队列所规定的时间片内完成，便可使终端型作业用户都感到满意；</li>
            <li>短批处理作业用户：对于很短的批处理型作业，开始时像终端型作业一样，如果仅在第一队列中执行一个时间片即可完成，便可获得与终端型作业一样的响应时间；对于稍长的作业，通常也只需在第二队列和第三队列各执行一个时间片即可完成，其周转时间仍然较短；</li>
            <li>长批处理作业用户：对于长作业，它将依次在第 1, 2, …, n 个队列中运行，然后再按轮转方式运行，用户不必担心其作业长期得不到处理。</li>
          </ul>
          `,
        },
      ],
    },
    {
      id: 'sec-ch3-realtime',
      heading: '3. 实时调度',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>实时系统中的调度问题</strong>：实时系统中都存在着若干个实时进程或任务，它们用来反应或控制某个（些）外部事件，往往带有某种程度的紧迫性，因而对实时系统中的调度提出了某些特殊要求，前面所介绍的多种调度算法并不能很好地满足实时系统对调度的要求。为此引入一种新的调度，即实时调度。</p>
          <p><strong>3.3.1 实现实时调度的基本条件</strong>——可调度条件：对于 m 个实时任务，处理时间为 Ci，周期时间为 Pi，则系统是可调度的，当且仅当满足：</p>
          <div class="formula"><span class="m">∑<sub>i=1..m</sub> C<sub>i</sub>／P<sub>i</sub> ≤ 1</span></div>
          <p><strong>3.3.2 实时调度算法的分类</strong>：根据实时任务性质——硬实时调度算法（严格实时）、软实时调度算法（非严格实时）；根据调度方式——非抢占调度算法、抢占调度算法；根据调度时间——静态调度（进程执行前调度程序便已经决定了各进程间的执行顺序）、动态调度算法（进程执行过程中由调度程序届时根据情况临时决定将哪一进程投入运行）。</p>
          <p><strong>(1) 非抢占式调度算法</strong>：</p>
          <ul>
            <li><strong>非抢占式轮转调度算法</strong>：将所有实时任务排列成队列，轮流投入运行；当任务完成，就重新排到队列末尾；调度时选择队首进程；实时响应时间：数秒～数十秒。</li>
            <li><strong>非抢占式优先调度算法</strong>：为所有实时任务设定优先权；高优先权进程到达队列，排到队首，以待当前任务执行完毕；调度时选择队首进程；实时响应时间：数百毫秒～数秒。</li>
          </ul>
          <p><strong>(2) 抢占式调度算法</strong>：</p>
          <ul>
            <li><strong>基于时钟中断的抢占式优先权调度算法</strong>：为所有实时任务设定优先权；高优先权进程到达队列排到队首，待时钟中断到达时调度到 CPU 上执行；调度时选择队首进程；实时响应时间：数毫秒～数十毫秒。</li>
            <li><strong>立即抢占的优先权调度算法</strong>：为所有实时任务设定优先权；高优先权进程到达队列，只要当前进程不在临界区，则立刻抢占 CPU；调度时选择队首进程；实时响应时间：数百微秒～数毫秒。</li>
          </ul>
          <p><strong>3.3.3 两个典型的实时调度算法</strong>：</p>
          <ul>
            <li><strong>最早截止时间优先调度算法（EDF）</strong>：根据任务的开始截止时间来确定任务的优先级，截止时间愈早，其优先级愈高。该算法要求在系统中保持一个实时任务就绪队列，该队列按各任务截止时间的早晚排序，具有最早截止时间的任务排在队列的最前面。调度程序在选择任务时，总是选择就绪队列中的第一个任务，为之分配处理机，使之投入运行。</li>
            <li><strong>最低松弛度优先调度算法（LLF）</strong>：根据任务的紧急程度（松弛度）来确定任务的优先级——松弛度 = 必须完成时间 − 本身运行时间 − 当前时间。调度程序在选择任务时，总是选择就绪队列中松弛度最小（紧急程度最高）的任务，为之分配处理机，使之投入运行。</li>
          </ul>
          <div class="callout key">
            <p class="callout-h">算法示例</p>
            <p>周期性任务 A 和 B，执行时间分别为 10ms 和 25ms，周期分别为 20ms 和 50ms，用 LLF 决定两个任务的运行次序。</p>
          </div>
          `,
        },
      ],
    },
    {
      id: 'sec-ch3-deadlock',
      heading: '4. 死锁的基本概念',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>3.5.1 死锁及死锁状态</strong>。四个引入例：</p>
          <ul>
            <li>例 1：交通死锁——四路口车辆互相占据对方要走的路口，谁也无法前进；</li>
            <li>例 2：哲学家进餐——5 位哲学家各拿 1 只筷子互相等待；</li>
            <li>例 3：两进程共享资源——P1 占 R1 申请 R2，P2 占 R2 申请 R1，形成环路；</li>
            <li>例 4：三进程接发消息——P1: Receive(S3), Send(S1)；P2: Receive(S1), Send(S2)；P3: Receive(S2), Send(S3)，三人都在等对方的信件。</li>
          </ul>
          <div class="callout key">
            <p class="callout-h">死锁的定义</p>
            <p><strong>死锁（Deadlock）</strong>：指多个进程在运行过程中因争夺资源而造成的一种僵局。当进程处于这种僵局时，若无外力作用，他们都将无法再向前推进。</p>
            <p><strong>死锁与阻塞的区别</strong>：死锁的进程处于阻塞状态，但仅依靠自己，无法继续运行。</p>
          </div>
          <p><strong>从并发进程的代码看死锁 1</strong>：生产者-消费者问题的错误代码——消费者把 <code>wait(full)</code> 与 <code>wait(mutex)</code> 顺序颠倒（先拿 mutex 再等 full），出现死锁的时机：<code>empty = n and full = 0</code>（缓冲区空时，消费者持有 mutex 等 full，生产者等 mutex）。</p>
          <p><strong>从并发进程的代码看死锁 2</strong>：哲学家进餐问题的错误代码——5 位哲学家各自执行第一个 <code>wait(chopstick[i])</code> 后，每人持有 1 只筷子再等下一只，出现死锁的时机：执行第一个 Wait 后。</p>
          <p><strong>3.5.2 产生死锁的原因</strong>：</p>
          <ul>
            <li><strong>竞争非剥夺性资源</strong>：可剥夺性资源（未用完可以被剥夺）如内存等；非剥夺性资源（必须在用完后才能被剥夺）如打印机等——竞争后者会引起死锁；</li>
            <li><strong>进程推进顺序非法</strong>：错误的进程推进顺序导致死锁，正确的进程推进顺序不导致死锁（示例：黑板）。</li>
          </ul>
          <p><strong>3.5.3 产生死锁的必要条件——死锁的特征</strong>：</p>
          <ol>
            <li><strong>互斥条件</strong>：互斥使用资源——资源自身的特点；</li>
            <li><strong>请求和保持条件</strong>：进程占有一个资源的同时，请求另外的资源；</li>
            <li><strong>不剥夺条件</strong>：进程的资源使用完之前，不能被剥夺；</li>
            <li><strong>环路等待条件</strong>：死锁的 n 个进程形成环形的进程-资源链 ⟨P1→P2→…→Pi→…→Pn⟩。</li>
          </ol>
          <p><strong>3.5.4 处理死锁的基本方法</strong>：</p>
          <ul>
            <li><strong>预防死锁</strong>：作法——破坏死锁产生的四个必要条件；优点——简单；缺点——资源利用率低，效率低；</li>
            <li><strong>避免死锁</strong>：作法——进程申请资源时，由系统审查申请的合理性，只有不导致死锁的申请才被认可；优点——效率略高；缺点——实现困难：进程对资源的需求不好事先确定；</li>
            <li><strong>检测和解除死锁</strong>：作法——进程申请资源时不作任何限制，仅在系统中定时或资源不足时检查是否有死锁；如果有，解决之；优点——不影响系统执行性能，效率高。</li>
          </ul>
          `,
        },
      ],
    },
    {
      id: 'sec-ch3-prevent',
      heading: '5. 预防死锁',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>3.6.1 预防死锁的基本概念</strong>——基本思路：死锁 → 四个必要条件；逆否命题成立：四个必要条件不同时成立 → 无死锁。作法：破坏死锁产生的四个必要条件。</p>
          <p><strong>3.6.2 破坏「互斥条件」</strong>——作法：不可能。资源的特性决定，否则程序运行结果不可再现。</p>
          <p><strong>3.6.3 破坏「请求和保持条件」</strong>——作法：进程创建时，一次申请所有资源。成功则运行，否则阻塞。优点：简单、易于实现，安全。缺点：资源严重浪费；进程执行进度大大延迟。</p>
          <p><strong>3.6.4 破坏「不剥夺条件」</strong>——作法：进程申请资源时，成功则运行，否则释放所有资源后阻塞。优点：无。缺点：资源严重浪费；代价太大；进程执行进度严重延迟。</p>
          <p><strong>3.6.5 破坏「环路等待条件」</strong>——作法：为所有资源编号，进程申请资源时必须按序申请资源。例如 R1：打印机，R2：磁带机，R3：磁盘，R4：输入机；进程 P1 使用资源顺序为输入机、磁带机、打印机，但是 P1 资源申请顺序必须为 R1, R2, R4（编号序）。优点：资源利用率、系统吞吐量显著提高。缺点：资源还是会浪费；资源编号困难；新资源加入困难。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch3-avoid',
      heading: '6. 避免死锁',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>避免死锁的基本思想</strong>：允许系统具备四个必要条件；进程在执行过程中动态地申请和释放资源；每次资源分配时，由系统仔细检查此次资源分配的安全性，只有在安全时才分配，否则不分配，并令进程等待。问题：如何检测资源分配是否导致死锁？</p>
          <h3 id="sec-ch3-avoid-h1">安全状态与不安全状态</h3>
          <p><strong>(1) 安全状态和不安全状态</strong>——假定某系统有 n 个进程并发执行，对于某个时刻 T0，划分系统安全和不安全的标准如下：系统能够按照某种进程顺序 ⟨P1, P2, …, Pn⟩ 执行，当轮到每个进程 Pi 执行时，都能满足该进程对资源的最大需求，则该系统处于安全状态，否则为不安全状态。⟨P1, P2, …, Pn⟩ 称为安全序列。</p>
          <p><strong>(2) 安全状态与不安全状态示例</strong>——某系统 3 个进程 P1、P2、P3 共享 12 台磁带机资源，某时刻 T0 的资源分配状况如下表：</p>
          <table class="tbl">
            <thead><tr><th>进程</th><th>最大需求量</th><th>已分配</th><th>可用</th></tr></thead>
            <tbody>
              <tr><td>P1</td><td>10</td><td>5</td><td>3</td></tr>
              <tr><td>P2</td><td>4</td><td>2</td><td></td></tr>
              <tr><td>P3</td><td>9</td><td>2</td><td></td></tr>
            </tbody>
          </table>
          <p>1) T0 时刻安全性：安全序列 ⟨P2, P1, P3⟩——先满足 P2（还需 2 ≤ 可用 3），P2 完成释放后可用达 5，再满足 P1（还需 5），最后 P3（还需 7 ≤ 5+5）。<strong>安全状态</strong>。</p>
          <p>2) 安全状态转化为不安全状态：此时 P3 请求 1 台磁带机并获准——可用降为 2，P3 已分配升为 3：</p>
          <table class="tbl">
            <thead><tr><th>进程</th><th>最大需求量</th><th>已分配</th><th>可用</th></tr></thead>
            <tbody>
              <tr><td>P1</td><td>10</td><td>5</td><td>2</td></tr>
              <tr><td>P2</td><td>4</td><td>2</td><td></td></tr>
              <tr><td>P3</td><td>9</td><td>3</td><td></td></tr>
            </tbody>
          </table>
          <p>安全序列 ⟨P2, ?, ?⟩ 之后无解——P2 完成后可用 4，P1 还需 5、P3 还需 6，均无法满足：<strong>不安全状态</strong>。</p>
          <p><strong>(3) 安全状态与不安全状态关系</strong>：</p>
          <ul>
            <li>系统处于安全状态，不会死锁；</li>
            <li>系统处于不安全状态，可能死锁；</li>
            <li>系统在安全状态与不安全状态之间不断转换。</li>
          </ul>
          <svg class="fig" viewBox="0 0 620 150" role="img" aria-label="安全状态、不安全状态与死锁状态的关系">
            <g font-size="13.5" text-anchor="middle" style="font-family:var(--font)">
              <defs>
                <marker id="a4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" style="fill:var(--ink-3)"/>
                </marker>
              </defs>
              <g style="fill:var(--panel-2);stroke:var(--deck-accent)" stroke-width="1.7">
                <circle cx="140" cy="70" r="44"/>
                <circle cx="330" cy="70" r="44"/>
                <circle cx="500" cy="70" r="36"/>
              </g>
              <g style="fill:var(--ink)" font-weight="700">
                <text x="140" y="75">安全状态</text>
                <text x="330" y="75">不安全状态</text>
                <text x="500" y="75">死锁状态</text>
              </g>
              <g style="stroke:var(--ink-3)" stroke-width="1.4" fill="none">
                <path d="M184,70 L286,70" marker-end="url(#a4)"/>
                <path d="M374,70 L460,70" marker-end="url(#a4)"/>
              </g>
              <text x="310" y="140" style="fill:var(--ink-3)" font-size="12">安全状态 ⇒ 不会死锁；不安全状态 ⇒ 可能死锁</text>
            </g>
          </svg>
          <p class="fig-cap">图 3-2　安全状态 ⊃ 不安全状态 ⊃ 死锁状态的包含关系（箭头方向为可能的状态转移）</p>
          <h3 id="sec-ch3-avoid-h2">银行家算法</h3>
          <p><strong>1. 问题</strong>：n 个进程 {P1, P2, …, Pn} 共享 m 类资源 {R1, R2, …, Rm}，进程并发执行时，如何避免死锁。</p>
          <p><strong>2. 数据结构设置</strong>：</p>
          <ul>
            <li><strong>可用资源向量</strong> Available，向量长度 m：Available[j] 为资源 Rj 的可用数量；</li>
            <li><strong>最大需求矩阵</strong> Max，n 行 m 列：Max[i][j] 表示进程 Pi 对资源 Rj 的最大需求量；</li>
            <li><strong>分配矩阵</strong> Allocation，n 行 m 列：Allocation[i][j] 表示进程 Pi 已分到资源 Rj 的数量；</li>
            <li><strong>需求矩阵</strong> Need，n 行 m 列：Need[i][j] 表示进程 Pi 对资源 Rj 的需求数量。关系：<strong>Max = Allocation + Need</strong>；</li>
            <li><strong>资源请求向量</strong> Request<sub>i</sub>，向量长度 m：Request<sub>i</sub>[j] 表示进程 Pi 对资源 Rj 的请求数量。</li>
          </ul>
          <p><strong>3. 银行家算法</strong>（Pi 进程提出资源请求 Request<sub>i</sub>）：</p>
          <ol>
            <li>IF Request<sub>i</sub> not ≤ Need<sub>i</sub> THEN 出错；</li>
            <li>IF Request<sub>i</sub> not ≤ Available THEN Pi 等待；</li>
            <li>试分配，修改数据结构 Allocation、Need、Available：Available := Available − Request<sub>i</sub>；Allocation<sub>i</sub> := Allocation<sub>i</sub> + Request<sub>i</sub>；Need<sub>i</sub> := Need<sub>i</sub> − Request<sub>i</sub>；</li>
            <li>执行安全性算法，检查此次资源分配后系统是否处于安全状态；</li>
            <li>IF 安全 THEN 正式分配，ELSE 取消试分配，Pi 等待。</li>
          </ol>
          <p><strong>4. 安全性算法</strong>：</p>
          <ol>
            <li>设置工作向量 Work，长度 m：Work := Available；</li>
            <li>设置状态向量 Finish，长度 n：Finish := false；</li>
            <li>从进程集合查找满足下列条件的进程 Pk：Finish[k] = false 且 Need<sub>k</sub> ≤ Work；IF 未找到这样的进程 THEN GOTO (5)；</li>
            <li>执行如下操作：Work := Work + Allocation<sub>k</sub>；Finish[k] := true；GOTO (3)；</li>
            <li>IF Finish = true THEN 安全，ELSE 不安全。</li>
          </ol>
          <div class="callout key">
            <p class="callout-h">银行家算法算例</p>
            <p>5 个进程 P0～P4、3 类资源 A/B/C，T0 时刻：Available = (3, 3, 2)；Max 与 Allocation 如下表（Need = Max − Allocation）：</p>
            <table class="tbl">
              <thead><tr><th>进程</th><th>Max (A B C)</th><th>Allocation (A B C)</th><th>Need (A B C)</th></tr></thead>
              <tbody>
                <tr><td>P0</td><td>7 5 3</td><td>0 1 0</td><td>7 4 3</td></tr>
                <tr><td>P1</td><td>3 2 2</td><td>2 0 0</td><td>1 2 2</td></tr>
                <tr><td>P2</td><td>9 0 2</td><td>3 0 2</td><td>6 0 0</td></tr>
                <tr><td>P3</td><td>2 2 2</td><td>2 1 1</td><td>0 1 1</td></tr>
                <tr><td>P4</td><td>4 3 3</td><td>0 0 2</td><td>4 3 1</td></tr>
              </tbody>
            </table>
            <p>问题：(1) T0 时刻安全性；(2) P1 请求 Request1(1,0,2)；(3) P4 请求 Request4(3,3,0)；(4) P0 请求 Request0(0,2,0)。（完整解答见「期末大题精讲 · 银行家算法」）</p>
          </div>
          <p><strong>5. 银行家算法小结</strong>：提供比死锁预防更好的进程并发度；需要提前预知进程对各类资源的最大需求数量，在很多情况下几乎不可能。</p>
          <p><strong>6. 思考题</strong>：3 个进程共享资源 A，每个进程最大需求为 2 个，则 A 至少有多少个资源时，才永远不会产生死锁？n 个进程共享资源 A，每个进程最大需求为 x 个，则 A 至少有多少个资源时，才永远不会产生死锁？</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch3-detect',
      heading: '7. 死锁的检测和解除',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>检测和解除死锁的基本思想</strong>：进程在执行过程中动态地申请和释放资源；每次资源分配时不作任何检查；允许系统产生死锁；定时或按需检查系统是否有处于死锁状态的进程存在；发现死锁，则立即解除所有死锁进程。问题：如何检测处于死锁状态的进程？</p>
          <p><strong>3.8.1 死锁的检测</strong>。</p>
          <p><strong>1. 进程状态的资源分配图描述</strong>：进程 P 与资源 R 结成二部图——<strong>资源申请边</strong>（P→R）与<strong>资源分配边</strong>（R→P）。</p>
          <p><strong>2. 死锁检测方法</strong>（图化简法）：</p>
          <ol>
            <li>对 T0 时刻资源分配图，寻找一个非阻塞非孤立结点，如找不到，转 (4)；</li>
            <li>删除与该结点相连的所有边；</li>
            <li>GOTO (1)；</li>
            <li>IF 最终的资源分配图中都是孤立结点 THEN T0 时刻资源分配图无死锁，ELSE 有死锁（非孤立结点部分）。</li>
          </ol>
          <div class="callout key">
            <p class="callout-h">死锁定理</p>
            <p>S 状态为死锁状态的<strong>充分条件</strong>是：当且仅当 S 状态的资源分配图是<strong>不可完全简化</strong>的。</p>
          </div>
          <p>课件四个示例：例 1——P1/P2 与 R1/R2 的分配图可完全化简，S 状态无死锁；例 2——图中形成环路且不可化简，S 状态有死锁；例 3——三进程 P1/P2/P3 的分配图仍可逐个化简，S 状态无死锁；例 4——请自行判定（练习）。</p>
          <p><strong>3. 思考</strong>：如何写成算法？（把「找非阻塞非孤立结点并删边」实现为迭代程序。）</p>
          <p><strong>3.8.2 死锁的解除</strong>——基本解除策略：(1) 剥夺资源；(2) 撤消进程。撤消时可采用广度（宽度）进程策略撤消。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch3-exercise',
      heading: '8. 本章习题',
      blocks: [
        {
          type: 'html',
          html: `
          <p>两份专题课件末页均标注修订版教材 P68：习题 2、4、6、8、11、17、18、23、25、26、28、33、36、41（与第 2 章习题页相同，按课件原样收录）。</p>
          `,
        },
      ],
    },
  ],
};

export default ch;
