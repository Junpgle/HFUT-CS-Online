/* 操作系统 · 第2章 进程管理 —— 依据「附件/PPT-按章/2-进程管理.pdf」（合肥工业大学操作系统课程组，2014）整理 */
import type { OsChapter } from './types';

const ch: OsChapter = {
  id: 'ch2',
  no: '第2章',
  title: '进程管理',
  subtitle: '第 2 章 · 进程管理',
  lede: `
  本章是全课程的<strong>核心章</strong>：从程序顺序执行与并发执行引入进程概念，讲进程控制、<strong>进程同步（信号量与 PV 原语）</strong>、
        经典同步问题（生产者-消费者、读者-写者、哲学家进餐）、进程通信与线程，最后补充 OS 的运行（特权指令与系统态/用户态）。
        期末试卷中信号量编程题、进程状态转换与线程辨析是高频考点。
`,
  toc: [
    { id: 'sec-ch2-concept', text: '1. 进程的基本概念', level: 2 },
    { id: 'sec-ch2-concept-h1', text: '前趋图', level: 3 },
    { id: 'sec-ch2-concept-h2', text: '程序的顺序执行', level: 3 },
    { id: 'sec-ch2-concept-h3', text: '程序的并发执行', level: 3 },
    { id: 'sec-ch2-concept-h4', text: '进程的特征与状态', level: 3 },
    { id: 'sec-ch2-concept-h5', text: '进程控制块（PCB）', level: 3 },
    { id: 'sec-ch2-control', text: '2. 进程控制', level: 2 },
    { id: 'sec-ch2-sync', text: '3. 进程同步', level: 2 },
    { id: 'sec-ch2-sync-h1', text: '进程同步的基本概念：临界资源与临界区', level: 3 },
    { id: 'sec-ch2-sync-h2', text: '临界区访问控制模型与同步原则', level: 3 },
    { id: 'sec-ch2-sync-h3', text: '实现进程同步的早期方法', level: 3 },
    { id: 'sec-ch2-sync-h4', text: '信号量机制', level: 3 },
    { id: 'sec-ch2-sync-h5', text: '信号量的应用：互斥与同步', level: 3 },
    { id: 'sec-ch2-classic', text: '4. 经典进程同步问题', level: 2 },
    { id: 'sec-ch2-classic-h1', text: '生产者-消费者问题', level: 3 },
    { id: 'sec-ch2-classic-h2', text: '读者-写者问题', level: 3 },
    { id: 'sec-ch2-classic-h3', text: '哲学家进餐问题', level: 3 },
    { id: 'sec-ch2-classic-h4', text: '睡眠理发师问题（课后思考题）', level: 3 },
    { id: 'sec-ch2-classic-h5', text: '信号量集机制', level: 3 },
    { id: 'sec-ch2-ipc', text: '5. 进程通信', level: 2 },
    { id: 'sec-ch2-thread', text: '6. 线程', level: 2 },
    { id: 'sec-ch2-thread-h1', text: '线程的基本概念', level: 3 },
    { id: 'sec-ch2-thread-h2', text: '线程的实现方式', level: 3 },
    { id: 'sec-ch2-osrun', text: '7. 补充材料：OS 的运行', level: 2 },
    { id: 'sec-ch2-exercise', text: '8. 本章习题', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ch2-concept',
      heading: '1. 进程的基本概念',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ch2-concept-h1">前趋图</h3>
          <p><strong>前趋图</strong>是一个有向无循环图（DAG），用于描述进程之间执行的先后次序。图中：</p>
          <ul>
            <li><strong>结点</strong>：代表一条语句、一段程序或一个进程；</li>
            <li><strong>有向边</strong>：两结点之间存在的先后次序关系；</li>
            <li><strong>初始结点</strong>与<strong>终止结点</strong>分别标识图的起点与终点。</li>
          </ul>
          <p>形式化记法：P = {P1, P2, P3, P4, P5, P6, P7}，E = {(Pi,Pj) | Pi must complete before Pj may start} = {(P1,P2), (P1,P3), (P1,P4), (P2,P5), (P3,P5), (P4,P6), (P5,P7), (P6,P7)}。</p>
          <svg class="fig" viewBox="0 0 640 300" role="img" aria-label="前趋图：P1 到 P7 的执行次序约束">
            <g font-size="14" text-anchor="middle" style="font-family:var(--font)">
              <defs>
                <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" style="fill:var(--ink-3)"/>
                </marker>
              </defs>
              <g style="fill:var(--panel-2);stroke:var(--deck-accent)" stroke-width="1.6">
                <circle cx="320" cy="40" r="24"/>
                <circle cx="150" cy="130" r="24"/>
                <circle cx="320" cy="130" r="24"/>
                <circle cx="490" cy="130" r="24"/>
                <circle cx="220" cy="220" r="24"/>
                <circle cx="420" cy="220" r="24"/>
                <circle cx="320" cy="220" r="24"/>
              </g>
              <g style="fill:var(--ink)" font-weight="700">
                <text x="320" y="45">P1</text>
                <text x="150" y="135">P2</text>
                <text x="320" y="135">P3</text>
                <text x="490" y="135">P4</text>
                <text x="220" y="225">P5</text>
                <text x="320" y="225">P6</text>
                <text x="420" y="225">P7</text>
              </g>
              <g style="stroke:var(--ink-3)" stroke-width="1.4" marker-end="url(#arr)" fill="none">
                <path d="M303,55 L167,113"/>
                <path d="M320,64 L320,106"/>
                <path d="M337,55 L473,113"/>
                <path d="M170,150 L208,200"/>
                <path d="M305,150 L238,200"/>
                <path d="M420,200 L337,152"/>
                <path d="M244,220 L296,220"/>
                <path d="M344,220 L396,220"/>
              </g>
              <text x="320" y="286" style="fill:var(--ink-3)" font-size="12.5">P5、P6 完成后 P7 才能开始（汇合），P1 完成后 P2/P3/P4 可并发</text>
            </g>
          </svg>
          <p class="fig-cap">图 2-1　前趋图：结点为进程/语句，有向边表示「必须先完成」的次序约束</p>

          <h3 id="sec-ch2-concept-h2">程序的顺序执行</h3>
          <p><strong>顺序执行的基本概念</strong>：一个程序由若干程序段组成，程序段内又由若干语句构成。程序段级顺序执行：输入程序段 I → 计算程序段 C → 打印程序段 P；语句级顺序执行：S1: a := x + y → S2: b := a − 5 → S3: c := b + 1。</p>
          <p><strong>顺序执行的特征</strong>：</p>
          <ul>
            <li><strong>顺序性</strong>：处理机严格按照程序规定的顺序执行程序；</li>
            <li><strong>封闭性</strong>：程序独占全机资源，不受其他程序的影响；</li>
            <li><strong>可再现性</strong>：程序执行结果 = 初始条件 + 执行时的环境。</li>
          </ul>
          <p><strong>顺序执行存在的问题</strong>：整体资源利用率低；单位时间内算题量少。以 I、C、P 三段为例，输入、计算、打印串行进行，任一时刻只有一种设备在忙。</p>

          <h3 id="sec-ch2-concept-h3">程序的并发执行</h3>
          <p><strong>并发执行的基本概念</strong>：多道程序设计技术——把 I1、C1、P1 与 I2、C2、P2 等程序段交错投入，输入设备、处理机、打印机在同一时间段内同时工作。</p>
          <p><strong>并发执行的问题</strong>：程序间共享变量会带来不可再现性。课件例：VAR N : integer = 3，程序 A 循环执行 N := N + 1，程序 B 循环执行 print(N); N := 0。语句执行顺序不同，程序 B 打印结果不同（先执行 A 的加 1 再打印得 4；先打印再清零得 3；先清零再打印得 0）。结论：程序 B 因为受到程序 A 的影响，运行结果出现了不可再现性，即结果不定。</p>
          <p><strong>什么条件下允许程序的并发执行</strong>？考察典型程序段 S1: a := x + 2，S2: b := y + 1，S3: c := a + b，S4: d := c + 6：S1 与 S2 无共同变量、互不依赖，可以并发；S3 依赖 S1、S2 的结果，必须等它们完成；S4 依赖 S3。即<strong>只有不存在依赖关系的语句之间才能并发</strong>（Bernstein 条件的直观表述）。</p>
          <p><strong>并发执行的特征</strong>：</p>
          <ul>
            <li><strong>间断性</strong>：由于资源的共享，程序执行具有「执行-暂停-执行」的特点；</li>
            <li><strong>失去封闭性</strong>：程序不再独占全机资源，运行受到其他程序的影响；</li>
            <li><strong>不可再现性</strong>：程序执行结果受其他程序的影响，结果不定。</li>
          </ul>

          <h3 id="sec-ch2-concept-h4">进程的特征与状态</h3>
          <p><strong>进程概念的产生</strong>：在多道程序环境下，程序的并发执行代替了程序的顺序执行，程序的活动不再处于封闭系统中，从而出现了许多新特征。为此人们引入了新概念——进程。</p>
          <p><strong>对进程的解释</strong>（四种说法）：</p>
          <ul>
            <li>程序在处理机上的一次执行过程；</li>
            <li>可以和别的计算并行执行的计算；</li>
            <li>进程是程序在一个数据集合上运行的过程，是系统进行资源分配和调度的一个独立单位；</li>
            <li>是一个具有一定功能的程序，是关于某个数据集合的一次运行活动。</li>
          </ul>
          <p><strong>进程的定义</strong>：进程实体的运行过程，是系统进行资源分配和调度的独立单位。<strong>进程实体</strong>由程序段、数据段、进程控制块（PCB）三部分组成。</p>
          <p><strong>进程的特征</strong>：</p>
          <ul>
            <li><strong>动态性</strong>：是程序的一次执行过程，因而是动态的；</li>
            <li><strong>并发性</strong>：引入进程就是为了和其他程序并发执行，提高资源利用率；</li>
            <li><strong>独立性</strong>：能独立运行的基本单位，也是资源分配和调度的基本单位；</li>
            <li><strong>异步性</strong>：进程以各自独立的、不可预知的速度向前推进；</li>
            <li><strong>结构特征</strong>：程序段、数据段、进程控制块（PCB）。</li>
          </ul>
          <p><strong>进程的三种基本状态</strong>：</p>
          <ol>
            <li><strong>就绪状态</strong>：进程已经获得除处理机之外的所有资源，一旦获得处理机就可以立即执行；</li>
            <li><strong>执行状态</strong>：一个进程已获得了必要的资源，正在处理机上运行；</li>
            <li><strong>阻塞状态</strong>：正在执行的进程，由于发生某事件而暂停无法继续执行（如等待 I/O、时间片到）。</li>
          </ol>
          <p>进程并非固定处于某种状态，其状态会随着自身的运行和外界条件的变化而变化。</p>
          <svg class="fig" viewBox="0 0 760 260" role="img" aria-label="进程三种基本状态转换图">
            <g font-size="14" text-anchor="middle" style="font-family:var(--font)">
              <defs>
                <marker id="arr2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" style="fill:var(--ink-3)"/>
                </marker>
              </defs>
              <g style="fill:var(--panel-2);stroke:var(--deck-accent)" stroke-width="1.8">
                <rect x="70" y="95" width="120" height="60" rx="12"/>
                <rect x="270" y="95" width="120" height="60" rx="12"/>
                <rect x="540" y="95" width="120" height="60" rx="12"/>
              </g>
              <g style="fill:var(--ink)" font-weight="700">
                <text x="130" y="130">就绪状态</text>
                <text x="330" y="130">执行状态</text>
                <text x="600" y="130">阻塞状态</text>
              </g>
              <g style="stroke:var(--ink-3)" stroke-width="1.5" marker-end="url(#arr2)" fill="none">
                <path d="M190,115 L270,115"/>
                <path d="M270,140 L190,140"/>
                <path d="M390,115 L540,115"/>
                <path d="M540,145 L390,145"/>
              </g>
              <g style="fill:var(--ink-2)" font-size="12.5">
                <text x="230" y="105">调度/分派</text>
                <text x="230" y="158">时间片到</text>
                <text x="465" y="105">等待 I/O 等事件</text>
                <text x="465" y="162">I/O 完成等事件发生</text>
                <path d="M330,64 L330,95" style="stroke:var(--ink-3)" stroke-width="1.5" marker-end="url(#arr2)" fill="none" transform="translate(0,0)"/>
                <text x="348" y="80" text-anchor="start">进程创建</text>
                <path d="M330,155 L330,215" style="stroke:var(--ink-3)" stroke-width="1.5" marker-end="url(#arr2)" fill="none"/>
                <text x="348" y="212" text-anchor="start">进程完成/撤销</text>
              </g>
            </g>
          </svg>
          <p class="fig-cap">图 2-2　进程的三种基本状态及其转换</p>
          <div class="callout key">
            <p class="callout-h">辨析</p>
            <p>阻塞状态的进程得不到处理机是因为在等待事件，事件不发生即使给它处理机也无法执行；就绪状态的进程万事俱备、只欠处理机。「阻塞 → 执行」「就绪 → 阻塞」的转换都不存在。</p>
          </div>
          <p><strong>引入挂起状态的进程状态转化</strong>：为满足调试系统、暂停程序执行等需要，把进程换出到外存，状态由「活跃」变为「静止」——活跃就绪 ↔ 静止就绪、活跃阻塞 ↔ 静止阻塞；静止阻塞的进程在等待事件发生后进入静止就绪，静止就绪的进程被激活（activate）后回到活跃就绪。</p>
          <svg class="fig" viewBox="0 0 640 300" role="img" aria-label="引入挂起状态的五状态模型">
            <g font-size="13" text-anchor="middle" style="font-family:var(--font)">
              <defs>
                <marker id="arr3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" style="fill:var(--ink-3)"/>
                </marker>
              </defs>
              <g style="fill:var(--panel-2);stroke:var(--deck-accent)" stroke-width="1.7">
                <rect x="40" y="60" width="110" height="44" rx="10"/>
                <rect x="265" y="60" width="110" height="44" rx="10"/>
                <rect x="490" y="60" width="110" height="44" rx="10"/>
                <rect x="40" y="200" width="110" height="44" rx="10"/>
                <rect x="490" y="200" width="110" height="44" rx="10"/>
              </g>
              <g style="fill:var(--ink)" font-weight="700">
                <text x="95" y="87">就绪(活跃)</text>
                <text x="320" y="87">执行</text>
                <text x="545" y="87">阻塞(活跃)</text>
                <text x="95" y="227">静止就绪</text>
                <text x="545" y="227">静止阻塞</text>
              </g>
              <g style="stroke:var(--ink-3)" stroke-width="1.4" marker-end="url(#arr3)" fill="none">
                <path d="M150,74 L265,74"/>
                <path d="M265,92 L150,92"/>
                <path d="M375,74 L490,74"/>
                <path d="M490,92 L375,92"/>
                <path d="M95,104 L95,200"/>
                <path d="M545,200 L545,104"/>
                <path d="M150,222 L490,222"/>
              </g>
              <g style="fill:var(--ink-2)" font-size="12">
                <text x="205" y="66">调度</text>
                <text x="205" y="108">时间片到</text>
                <text x="432" y="66">等待事件</text>
                <text x="432" y="108">事件发生</text>
                <text x="113" y="156" text-anchor="start">挂起 suspend</text>
                <text x="527" y="156" text-anchor="end">激活 activate / 事件发生</text>
                <text x="320" y="214">事件发生（静止阻塞 → 静止就绪）</text>
                <text x="320" y="34" style="fill:var(--ink-3)" font-size="12.5">外存</text>
                <path d="M25,170 L615,170" stroke-dasharray="6 5" style="stroke:var(--hairline)" stroke-width="1"/>
                <text x="320" y="189" style="fill:var(--ink-3)" font-size="12.5">虚线以上常驻内存，以下换出到外存</text>
              </g>
            </g>
          </svg>
          <p class="fig-cap">图 2-3　引入挂起状态的五状态模型（中级调度/对换在内外存之间移动进程）</p>

          <h3 id="sec-ch2-concept-h5">进程控制块（PCB）</h3>
          <p><strong>基本概念</strong>：Process Control Block，PCB——OS 管理进程的数据结构；<strong>进程控制块是进程存在的唯一标志</strong>；位置在操作系统内核。</p>
          <p><strong>PCB 的内容</strong>：</p>
          <ul>
            <li><strong>进程标志符</strong>；</li>
            <li><strong>处理机状态</strong>；</li>
            <li><strong>进程调度信息</strong>；</li>
            <li><strong>进程控制信息</strong>。</li>
          </ul>
          <p><strong>PCB 的组织形式</strong>：</p>
          <ul>
            <li><strong>链接方式</strong>：把具有同一状态的 PCB 链接成队列（就绪队列、阻塞队列等）；</li>
            <li><strong>索引方式</strong>：系统根据所有 PCB 建立索引表，就绪队列、阻塞队列分别由索引表项指向对应 PCB（PCB1…PCBn 存放于 PCB 表）。</li>
          </ul>
          `,
        },
      ],
    },
    {
      id: 'sec-ch2-control',
      heading: '2. 进程控制',
      blocks: [
        {
          type: 'html',
          html: `
          <h4>进程的创建和撤销</h4>
          <p><strong>进程的创建</strong>——引起进程创建的事件：用户登录；作业调度；提供服务（例如提供打印服务）；应用请求（例如程序自行创建）。进程创建原语 <code>create()</code>。</p>
          <p><strong>进程图（树）</strong>：体现进程的创建关系，父进程创建子进程。</p>
          <p><strong>进程的撤消</strong>——引起进程撤消的事件：正常结束；异常结束；外界干预。进程撤消原语 <code>exit()</code>。撤消进程的流程：</p>
          <ol>
            <li>根据被终止进程的标识符，从 PCB 集合中检索出该进程的 PCB，从中读出该进程的状态；</li>
            <li>若被终止进程正处于执行状态，应立即终止该进程的执行，并置调度标志为真，用于指示该进程被终止后应重新进行调度；</li>
            <li>若该进程还有子孙进程，还应将其所有子孙进程予以终止，以防他们成为不可控的进程；</li>
            <li>将被终止进程所拥有的全部资源，或者归还给其父进程，或者归还给系统；</li>
            <li>将被终止进程（它的 PCB）从所在队列（或链表）中移出，等待其他程序来搜集信息。</li>
          </ol>
          <h4>进程的阻塞与唤醒</h4>
          <p><strong>进程的阻塞</strong>——引起进程阻塞的事件：请求系统服务；请求操作；等待数据、资源；等待工作任务。进程阻塞原语 <code>block()</code>；<strong>进程自己阻塞自己</strong>（用户程序 call block() 进入 OS 内核，把本进程从执行状态改为阻塞状态）。</p>
          <p><strong>进程的唤醒</strong>——引起进程唤醒的事件：允许系统服务；允许操作；数据、资源到达；工作任务到达。进程唤醒原语 <code>wakeup()</code>；由<strong>别的进程唤醒</strong>（合作进程在完成相应工作后调用 wakeup() 把等待者放入就绪队列）。</p>
          <h4>进程的挂起与激活</h4>
          <p><strong>进程的挂起</strong>——引起进程挂起的事件：调试系统；暂停程序执行。进程挂起原语 <code>suspend()</code>。<strong>进程的激活</strong>——引起进程激活的事件：调试系统结束；程序继续执行。进程激活原语 <code>activate()</code>。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch2-sync',
      heading: '3. 进程同步',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ch2-sync-h1">进程同步的基本概念：临界资源与临界区</h3>
          <p><strong>进程同步问题的产生</strong>：在多道程序的环境中，系统中的多个进程可以并发执行，同时它们又要共享系统中的资源——这些资源有些是可共享使用的（如磁盘），有些是以独占方式使用的（如打印机）。由此将会引起一系列的矛盾，产生错综复杂的相互制约的关系。<strong>两种形式的制约关系</strong>：</p>
          <ul>
            <li><strong>间接相互制约关系</strong>：共享某种系统资源；</li>
            <li><strong>直接相互制约关系</strong>：主要源于进程间合作。</li>
          </ul>
          <p><strong>临界资源</strong>：虽然计算机系统中多个进程可以共享系统中的各种资源，然而有些资源一次只能为一个进程使用。<strong>一次仅能为一个进程所使用的资源称为临界资源</strong>。例子——硬件资源：打印机；软件资源：内存变量、指针、数组。课件以两进程并发入栈为例：Program A 与 Program B 都执行 <code>top := (top+1) mod n; stack[top] := x/y</code>，top 与 stack 即为必须互斥使用的临界资源。</p>
          <p><strong>临界区</strong>：进程中访问临界资源的代码段称为临界区。策略：临界资源访问互斥 ⇒ 临界区访问互斥。</p>
          <h3 id="sec-ch2-sync-h2">临界区访问控制模型与同步原则</h3>
          <p>临界区访问控制模型把进程代码分为四段：</p>
          <pre class="code"><code>repeat
    entry section;        // 进入区
    critical section;     // 临界区
    exit section;         // 退出区
    remainder section;    // 剩余区
until false</code></pre>
          <div class="callout key">
            <p class="callout-h">同步机制遵循的四条原则</p>
            <ul>
              <li><strong>空闲让进</strong>：当没有进程处于临界区时，请求进入临界区的进程立即进入；</li>
              <li><strong>忙则等待</strong>：当已有进程进入临界区时，其他试图进入临界区的进程须等待；</li>
              <li><strong>有限等待</strong>：对要求访问临界资源的进程，保证能在有限时间内进入临界区；</li>
              <li><strong>让权等待</strong>：当进程不能进入临界区时，应释放处理机。</li>
            </ul>
          </div>
          <h3 id="sec-ch2-sync-h3">实现进程同步的早期方法</h3>
          <p><strong>软件解法 1：按需访问</strong>（资源空闲标志 <code>VAR free:boolean := false</code>，两进程都先检查后占用）——两进程可能同时通过 <code>while(free)</code> 检查并同时进入临界区，<strong>违背「忙则等待」</strong>。</p>
          <p><strong>软件解法 2：轮询</strong>（轮流标志 <code>VAR turn:integer := 1</code>，P1 只能在 turn=1 时进入，进入后置 turn=2）——严格限制资源访问顺序：即使临界区空闲，也必须按 P1→P2→P1 轮流进入，违背「空闲让进」且进程推进顺序被强制固定。</p>
          <p><strong>软件解法 3：访前先看</strong>（<code>pturn/qturn:boolean := false,false</code>，各自先置自己的标志为 true，再等对方标志为 false）——两个进程可能同时置标志 true 并互相等待，谁也进不去，<strong>违背「空闲让进」</strong>。</p>
          <p><strong>软件解法 4：Peterson 算法（1981）</strong>——结合「访前先看」与「轮询」的优点，满足全部原则：</p>
          <pre class="code"><code>#define FALSE 0
#define TRUE  1
#define N     2        // 进程的个数
int turn;              // 轮到谁？
int interested[N];     // 兴趣数组，初始值均为 FALSE

void enter_region(int process)   // process = 0 或 1
{
    int other;                   // 另外一个进程的进程号
    other = 1 - process;
    interested[process] = TRUE;  // 表明本进程感兴趣
    turn = process;              // 设置标志位
    while (turn == process &amp;&amp; interested[other] == TRUE); // 忙等
}

void leave_region(int process)
{
    interested[process] = FALSE; // 本进程已离开临界区
}</code></pre>
          <p><strong>硬件解法 1：TSL 指令</strong>（Test and Set Lock）——「复制锁 lock 的值到 register，并且置 lock 为 1」这一读写-置位动作由一条指令原子完成，用汇编实现 enter_region/leave_region：</p>
          <pre class="code"><code>enter_region:
    TSL register, lock   // 复制锁 lock 的值到 register，并且置 lock 为 1
    CMP register, #0
    JNZ enter_region     // 不是 0（已上锁）就再试
    RET
leave_region:
    MOVE lock, #0
    RET</code></pre>
          <p><strong>硬件解法 2：SWAP 指令</strong>——交换锁 lock 和局部变量 key 的值（<code>tmp := lock; lock := key; key := tmp</code>），enter_region 中 <code>key := true; while(key) SWAP(lock, key)</code>，直到换回 key=false（拿到空闲锁）为止。</p>
          <p><strong>小结</strong>：软件解法——忙等待、实现过于复杂，需要高的编程技巧；硬件解法——简单、有效，特别适用于多处理机，缺点同样是忙等待（不满足「让权等待」）。</p>
          <p>课件此处穿插对 Dijkstra 的介绍：荷兰计算机科学家 Edsger Wybe Dijkstra，1972 年 ACM 图灵奖获得者；贡献包括提出「goto 有害论」、提出信号量和 PV 原语、解决了有趣的「哲学家聚餐」问题、最短路径算法（SPF）的创造者、第一个 Algol 60 编译器的设计者和实现者、THE 操作系统的设计者和开发者。</p>
          <h3 id="sec-ch2-sync-h4">信号量机制</h3>
          <p><strong>(1) 整数型信号量</strong>（Dijkstra, 1965）：定义整数信号量 S 与两个原子操作 wait/signal（P/V）：</p>
          <pre class="code"><code>function Wait(var S: integer)     // P 操作
Begin
    while (S &lt;= 0) do no_op();    // 忙等
    S := S - 1;
end

function Signal(var S: integer)   // V 操作
Begin
    S := S + 1;
end</code></pre>
          <p>两个进程以 <code>wait(S); critical section; signal(S)</code> 使用互斥信号量 S（初值 1）即可实现互斥进入临界区。整数型信号量的缺陷是忙等；于是引入记录型信号量。</p>
          <p><strong>(2) 记录型信号量</strong>：信号量 S 是一个记录，含资源数量 value 与阻塞进程队列 L：</p>
          <pre class="code"><code>type semaphore = record
    value: integer;          // 资源数量
    L: list of process;      // 阻塞进程队列
end

function wait(var S: semaphore)          // P 操作
Begin
    S.value := S.value - 1;
    if (S.value &lt; 0) then block(S.L);    // 自我阻塞，插入等待队列
end

function signal(var S: semaphore)        // V 操作
Begin
    S.value := S.value + 1;
    if (S.value &lt;= 0) then wakeup(S.L);  // 仍有等待者则唤醒队首进程
end</code></pre>
          <div class="callout key">
            <p class="callout-h">信号量 S 的物理含义</p>
            <ul>
              <li>对信号量的每次 <strong>wait</strong> 操作，意味着进程请求一个单位的该类资源，因此描述为 S.value := S.value − 1；当 S.value &lt; 0 时，表示该类资源已分配完毕，因此进程应进行自我阻塞，放弃处理机，并插入到信号量链表 S.L 中；</li>
              <li>对信号量的每次 <strong>signal</strong> 操作，表示执行进程释放一个单位资源，故 S.value := S.value + 1 表示资源数目加 1。若加 1 后仍是 S.value ≤ 0，则表示在该信号量链表中仍有等待该资源的进程被阻塞，将 S.L 链表中的第一个等待进程唤醒；</li>
              <li>S.value ≥ 0 时表示可用资源数量；S.value &lt; 0 时，|S.value| 为阻塞进程的数量。</li>
            </ul>
          </div>
          <h3 id="sec-ch2-sync-h5">信号量的应用：互斥与同步</h3>
          <p><strong>(1) 信号量用于互斥</strong>——例 1：2 个进程进行堆栈的入栈（临界资源为 top 与 stack）：</p>
          <pre class="code"><code>Parbegin
   VAR top : integer = -1;
       stack: array[0..n-1] of item;
       mutex: semaphore := 1;      // 互斥信号量
   Process P1:
   Begin
       while (TRUE)
           wait(mutex);
           top := (top + 1) mod n;
           stack[top] := x;
           signal(mutex);
       end while
   end
   Process P2:
   Begin
       while (TRUE)
           wait(mutex);
           top := (top + 1) mod n;
           stack[top] := y;
           signal(mutex);
       end while
   End
Parend</code></pre>
          <p>例 2：<strong>过独木桥问题</strong>——一次只能过 1 人。两岸方向分别为 S2N、N2S 的行人各自 <code>wait(mutex); go across the bridge; signal(mutex)</code>，mutex 初值 1。</p>
          <p><strong>(2) 信号量用于同步</strong>——例 3：PI、PO 两进程共享缓冲区 B，PI 负责读入数据并保存在 B 中，PO 负责打印 B 中数据，要求每个数据必须且只打印一次，不许漏打或重复打印：</p>
          <pre class="code"><code>Parbegin
   VAR S1, S2 : semaphore = 1, 0;   // S1 缓冲区空，S2 缓冲区有数
   Process PI:
   Begin
       repeat
           read x from I/O;
           wait(S1);
           B := x;
           signal(S2);
       until false
   end
   Process PO:
   Begin
       repeat
           wait(S2);
           y := B;
           signal(S1);
           print(y);
       until false
   End
Parend</code></pre>
          <p>例 4：PI、PE、PO 三进程通过共享缓冲区 B 协作，PI 负责产生随机数并保存在 B 中，当 B 中数据为奇数时由 PO 负责打印，当 B 中数据为偶数时由 PE 负责打印，要求每个数据必须且只打印一次：</p>
          <pre class="code"><code>Parbegin
   var S, SO, SE : semaphore := 1, 0, 0;
   Process PIN:
   Begin
       repeat
           generate x randomly;
           wait(S);
           B := x;
           if (x is odd) signal(SO);
           else signal(SE);
       until false
   end
   Process PE:
   Begin
       repeat
           wait(SE);
           y := B;
           signal(S);
           print(y);
       until false
   End
   Process PO:
   Begin
       repeat
           wait(SO);
           z := B;
           signal(S);
           print(z);
       until false
   End
Parend</code></pre>
          `,
        },
      ],
    },
    {
      id: 'sec-ch2-classic',
      heading: '4. 经典进程同步问题',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ch2-classic-h1">生产者-消费者问题</h3>
          <p>多个生产者、多个消费者通过共享含 n 个缓冲区的缓冲池 Buffer 协作：生产者负责生产数据并投入缓冲池，消费者从缓冲池中取数据消费，生产者和消费者每次生产/消费 1 个数据，要求每个数据必须且只被消费一次。</p>
          <p><strong>数据结构</strong>：有界缓冲池组织成循环缓冲区（循环队列），入队操作 <code>Buffer(in) := nextp; in := (in + 1) mod n</code>，出队操作 <code>nextc := Buffer(out); out := (out + 1) mod n</code>。</p>
          <p><strong>进程资源共享关系和同步关系分析</strong>：生产者进程要等待「空缓冲区资源」，消费者进程要等待「满缓冲区资源」；对缓冲池的写入与读出本身还要互斥（mutex）。</p>
          <p><strong>标准程序</strong>：</p>
          <pre class="code"><code>VAR mutex, empty, full : semaphore := 1, n, 0;
    in, out : integer := 0, 0;
    Buffer : array[0..n-1] of item;
Parbegin
  Producer:
  begin
      repeat
          produce an item in nextp;
          wait(empty);        // 申请一个空缓冲区
          wait(mutex);        // 进入缓冲池互斥区
          Buffer(in) := nextp;
          in := (in + 1) mod n;
          signal(mutex);
          signal(full);       // 满缓冲区数加 1
      until false
  end

  Consumer:
  begin
      repeat
          wait(full);         // 申请一个满缓冲区
          wait(mutex);
          nextc := Buffer(out);
          out := (out + 1) mod n;
          signal(mutex);
          signal(empty);      // 空缓冲区数加 1
          consume the item nextc;
      until false
  end
Parend</code></pre>
          <div class="callout warn">
            <p class="callout-h">问题思考（课件逐条讨论的变式）</p>
            <ul>
              <li><strong>单生产者单消费者、多缓冲</strong>：标准程序不变；</li>
              <li><strong>多生产者多消费者、单缓冲</strong>：缓冲区只有 1 个时，读写指针 in/out 恒为 0，生产者与消费者对「缓冲区」本身的读写天然互斥由 empty/full 保证，可去掉 mutex（保留也不影响正确性）；</li>
              <li><strong>单生产者单消费者、单缓冲</strong>：同例 4（S 初值 1、full 初值 0），无需 mutex；</li>
              <li><strong>允许生产者写时消费者可读</strong>：把一个 mutex 拆成 mutexP 与 mutexC 两个互斥信号量（初值均为 1），读写各自互斥、读写之间不互斥；</li>
              <li><strong>缓冲池无限大</strong>：empty 初值可取无穷，wait(empty) 永不阻塞，可省略 empty（保留 full 与 mutex）；</li>
              <li><strong>调整生产者 wait 顺序</strong>（先 wait(mutex) 后 wait(empty)）：若缓冲池已满，生产者持有 mutex 再等待 empty，消费者因拿不到 mutex 而无法消费——<strong>死锁</strong>；</li>
              <li><strong>调整消费者 wait 顺序</strong>（先 wait(mutex) 后 wait(full)）：同理，缓冲池空时消费者持有 mutex 等待 full，生产者无法进入——死锁；</li>
              <li><strong>调整 signal 顺序</strong>：signal 的先后次序只影响等待队列的次序，不影响正确性（signal(mutex) 与 signal(empty/full) 交换无碍）；</li>
              <li><strong>每个消费者消费每个消息 1 次</strong>：留给大家课后解决。</li>
            </ul>
          </div>
          <div class="callout key">
            <p class="callout-h">要点</p>
            <p>对资源信号量（empty/full）的 wait 必须放在对互斥信号量（mutex）的 wait <strong>之前</strong>——先申请资源、后加锁；顺序颠倒会在资源不足时持有锁等待，造成死锁。</p>
          </div>
          <h3 id="sec-ch2-classic-h2">读者-写者问题</h3>
          <p>多个读者、多个写者共享资源（例如文件、数据等）：允许多个读者同时访问资源，写者写时不允许其他进程读或写（互斥访问资源）。</p>
          <p><strong>进程资源共享关系和同步关系分析</strong>：读者进程——读-读允许（不控制）；写者进程——写-读、写-写互斥；读者写者顺序——无特殊约束。</p>
          <p>第一次尝试（只设 wmutex）读者也去抢 wmutex，读-读被互斥，什么问题？——并发度低，多个读者无法同时读。第二次尝试（if readcount=0 then wait(wmutex)）问题在于 readcount 的加减本身未受保护，多个读者并发修改 readcount 会出错。于是引入 rmutex 保护 readcount：</p>
          <pre class="code"><code>VAR rmutex, wmutex : semaphore := 1, 1;
    readcount : integer := 0;       // 正在读的读者数
Parbegin
  Reader:
  begin
      repeat
          wait(rmutex);                    // readcount 是临界资源
          if (readcount = 0) wait(wmutex); // 第一个读者为读者群体加锁
          readcount := readcount + 1;
          signal(rmutex);
          perform read operation;
          wait(rmutex);
          readcount := readcount - 1;
          if (readcount = 0) signal(wmutex); // 最后一个读者解锁
          signal(rmutex);
      until false
  end
  Writer:
  begin
      repeat
          wait(wmutex);
          perform write operation;
          signal(wmutex);
      until false
  end
Parend</code></pre>
          <p><strong>标准程序的两个问题</strong>：① 执行 wait 和 signal 的进程——对 wmutex 的 wait/signal 在不同时刻由不同（第 1 个/最后 1 个）读者执行；② 临界区设置——rmutex 保护的是 readcount，wmutex 保护的是文件本体。</p>
          <h3 id="sec-ch2-classic-h3">哲学家进餐问题</h3>
          <p>5 位哲学家围绕圆桌而坐，反复思考和进餐。只有 5 只碗和筷子，只有当哲学家同时拿起碗边的 2 只筷子时才能进餐。<strong>进程资源共享关系和同步关系分析</strong>：哲学家进程对筷子互斥。</p>
          <p><strong>第一版实现</strong>（问题：正确吗？——当 5 位哲学家同时拿起左边筷子时，所有人都在等右边筷子，<strong>死锁</strong>）：</p>
          <pre class="code"><code>VAR chopsticks : array[0..4] of semaphore := 1,1,1,1,1;
Parbegin
  philosopher_i:
  begin
      repeat
          wait(chopsticks[i]);                 // 先拿左筷
          wait(chopsticks[(i+1) mod 5]);       // 再拿右筷
          eat;
          signal(chopsticks[i]);
          signal(chopsticks[(i+1) mod 5]);
          think
      until false
  end
Parend</code></pre>
          <p><strong>标准程序</strong>：原则——<strong>按序申请资源</strong>。前 4 位哲学家仍先左后右，第 5 位（philosopher4）改为先拿右筷再拿左筷，打破环路等待：</p>
          <pre class="code"><code>philosopher0-3:                          // 先左后右
      repeat
          wait(chopsticks[i]);
          wait(chopsticks[(i+1) mod 5]);
          eat;
          signal(chopsticks[i]);
          signal(chopsticks[(i+1) mod 5]);
          think
      until false

philosopher4:                            // 先右后左
      repeat
          wait(chopsticks[(i+1) mod 5]);
          wait(chopsticks[i]);
          eat;
          signal(chopsticks[i]);
          signal(chopsticks[(i+1) mod 5]);
          think
      until false</code></pre>
          <h3 id="sec-ch2-classic-h4">睡眠理发师问题（课后思考题）</h3>
          <p>理发店有一位理发师，一把理发椅和 n 把用来等候理发的椅子。如果没有顾客，则理发师便在理发椅上睡觉；顾客到来时，如理发师闲则理发，否则如有空椅则坐等，没有空椅则离开。编写程序实现理发师和顾客程序，实现进程控制。</p>
          <h3 id="sec-ch2-classic-h5">信号量集机制</h3>
          <p><strong>(1) AND 型信号量集机制</strong>——基本思想：</p>
          <ul>
            <li>将进程在整个运行过程中需要的所有资源，一次性全部地分配给进程，待进程使用完后再一起释放；</li>
            <li>对若干个临界资源的分配，采取原子操作方式：要么全部分配到进程，要么一个也不分配；</li>
            <li>为此，在 wait 操作中增加了一个「AND」条件，故称为 AND 同步。</li>
          </ul>
          <pre class="code"><code>function Swait(var S1, S2, …, Sn: semaphore)
Begin
    if (S1 &gt;= 1 and … and Sn &gt;= 1)
        for i := 1 to n do Si := Si - 1;
    else
        Place the process in the queue associated with
        the first Si found with Si &lt; 1, and goto the beginning of Swait.
end

function Ssignal(var S1, S2, …, Sn: semaphore)
Begin
    for i := 1 to n do
        Si := Si + 1;
        Remove all process waiting in the queue associated with Si into the ready queue.
end</code></pre>
          <p><strong>应用示例 1：生产者-消费者问题</strong>——Swait(empty, mutex) 一次性同时申请空缓冲区与缓冲池使用权，避免 wait 顺序错误：</p>
          <pre class="code"><code>Producer:
  repeat
      produce an item in nextp;
      Swait(empty, mutex);
      Buffer(in) := nextp;
      in := (in + 1) mod n;
      Ssignal(mutex, full);
  until false
Consumer:
  repeat
      Swait(full, mutex);
      nextc := Buffer(out);
      out := (out + 1) mod n;
      Ssignal(mutex, empty);
      consume the item nextc;
  until false</code></pre>
          <p><strong>应用示例 2：哲学家进餐问题</strong>——Swait(chopsticks[i], chopsticks[(i+1) mod 5]) 原子地拿两只筷子，杜绝「一人一只」的死锁局面。</p>
          <p><strong>(2) 一般信号量集机制</strong>——基本思想：在 AND 型信号量基础上，<strong>一次可申请多个单位资源</strong>。Swait(S1, t1, d1, …, Sn, tn, dn)：当 Si ≥ ti（i=1..n）时才允许把 Si 减 di；Ssignal(S1, d1, …, Sn, dn) 把 Si 加 di。<strong>应用实例：读者写者问题</strong>——RN 为允许读者进程上限：</p>
          <pre class="code"><code>VAR RN : integer;
    L, mutex : semaphore := RN, 1;
Parbegin
  Reader:
  begin
      repeat
          Swait(L, 1, 1, mutex, 1, 0);   // 读者占 1 个名额；mutex 只做判定(减 0)
          perform read operation;
          Ssignal(L, 1);
      until false
  end
  Writer:
  begin
      repeat
          Swait(mutex, 1, 1, L, RN, 0);  // 有写者时要求读者数为 0(RN 个名额全空)
          perform write operation;
          Ssignal(mutex, 1);
      until false
  end
Parend</code></pre>
          <p>问题分析：可否再简化程序？（L 与 RN 两个信号量的判据可进一步合并——留作思考。）</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch2-ipc',
      heading: '5. 进程通信',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>进程间通信的基本概念</strong>（Inter Process Communication, IPC）：进程通信指进程之间的信息交换，其所交换的信息量，少者是一个状态或数值，多者则是成千上万个字节。</p>
          <p><strong>高级通信</strong>的三要素：</p>
          <ul>
            <li><strong>通信链路</strong>：点对点/多点/广播；单向/双向；有容量（链路带缓冲区）/无容量（发送方和接收方需自备缓冲区）；</li>
            <li><strong>数据格式</strong>：字节流——各次发送之间的分界在接收时不被保留、没有格式；报文——各次发送之间的分界在接收时被保留，通常有格式（如表示类型），定长/不定长报文，可靠报文/不可靠报文；</li>
            <li><strong>收发操作的同步方式</strong>：发送阻塞（直到被链路容量或接收方所接受）和不阻塞（失败时立即返回）；接收阻塞（直到有数据可读）和不阻塞（无数据时立即返回）；由事件驱动收发——在允许发送或有数据可读时，才做发送和接收操作。</li>
          </ul>
          <h4>共享存储器系统</h4>
          <p><strong>基本思想</strong>：相互通信的进程共享数据结构或共享存储区，进程之间通过这些空间进行通信。<strong>实现过程</strong>：① 进程申请一片内存，拿到内存描述符；② 如果已分配过，直接获得内存描述符；③ 利用内存描述符将内存连接到本进程；④ 读写。<strong>共享存储区的访问同步</strong>：共享存储区的资源共享问题（需进程自行用同步机制保证互斥）。</p>
          <p><strong>分类</strong>：基于共享数据结构的通信方式；基于共享存储区的通信方式。<strong>特点</strong>：适合大量的数据快速交换；程序员负担重。</p>
          <h4>消息通信系统</h4>
          <p><strong>基本思想</strong>：进程间的数据交换，以格式化的消息（message）为单位进行通信。</p>
          <ul>
            <li><strong>直接通信</strong>：信息直接传递给接收方——发送时指定接收方的地址或标识，也可以指定多个接收方或广播式地址；接收时允许接收来自任意发送方的消息，并在读出消息的同时获取发送方的地址。OS 提供两个通信原语：发送进程 <code>Send(receiver, msg)</code>，接收进程 <code>Receive(sender, msg)</code>；</li>
            <li><strong>间接通信</strong>：借助于收发双方进程之外的共享数据结构作为通信中转，如消息队列（信箱 mailbox），通常收方和发方的数目可以是任意的。发送进程 <code>Send(mailbox, msg)</code>，接收进程 <code>Receive(mailbox, msg)</code>。</li>
          </ul>
          <p>消息有基本结构（信首 HEAD + 信体 BODY）与收发流程；<strong>信箱分类</strong>：公有信箱、私有信箱、共享信箱。<strong>特点</strong>：操作系统隐藏通信细节；通信程序简单；可以跨网络传输；灵活。<strong>进程同步</strong>：发送阻塞、接收阻塞；发送不阻塞、接收阻塞；发送不阻塞、接收不阻塞。（3) 消息缓冲队列通信源于 Hansan 的 RC4000 系统。</p>
          <h4>管道通信系统</h4>
          <p><strong>基本思想</strong>：在磁盘创建一个文件；大小固定（如 4kB）；写连续字符流；读连续字符流。UNIX 首创。<strong>实现技术</strong>：对管道文件的资源共享——同步、互斥。</p>
          <p><strong>Windows 操作系统的管道通信</strong>：Windows Server 2003 提供无名管道和命名管道两种管道机制；利用 CreatePipe 可创建无名管道并得到两个读写句柄；利用 ReadFile 和 WriteFile 可并行无名管道的读写。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch2-thread',
      heading: '6. 线程',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ch2-thread-h1">线程的基本概念</h3>
          <p><strong>(1) 线程的引入</strong>——传统进程的两个基本属性：</p>
          <ul>
            <li><strong>拥有资源的独立单位</strong>：每个进程分配一个虚拟地址空间，保存进程映像，控制一些资源（文件、I/O 设备），有状态、优先级；</li>
            <li><strong>调度和分派的基本单位</strong>：分配 CPU。</li>
          </ul>
          <p>导致的不利后果：身形笨重，管理和运行资源开销大；限制并发度，多道程序设计道数不能太高。于是把进程的两个基本属性<strong>分解</strong>：资源独立单位仍归进程，调度分派单位交给线程。</p>
          <p><strong>线程概念</strong>：有时称轻量级进程；进程中的一个轻型运行实体；是一个 CPU 调度和分派的基本单位；可并发执行；共享进程资源。</p>
          <p><strong>(3) 线程的开销</strong>：线程控制块（TCB）；寄存器状态、堆栈、局部变量拷贝；线程运行状态（就绪、阻塞、执行）；可以创建、撤消另一个线程；优先级与信号屏蔽。</p>
          <p><strong>(4) 引入线程的好处</strong>：</p>
          <ul>
            <li>创建一个新线程花费时间少（结束亦如此）；</li>
            <li>两个线程的切换花费时间少；</li>
            <li>同一进程内的线程共享内存和文件，因此它们之间相互通信无须调用内核；</li>
            <li>适合多处理机系统。</li>
          </ul>
          <h3 id="sec-ch2-thread-h2">线程的实现方式</h3>
          <p>三种实现：内核支持线程（Windows 2000/XP、Macintosh 和 OS/2）；用户级线程（一些数据库管理系统如 infomix）；两者结合方法（Solaris、Linux）。</p>
          <p><strong>(1) 内核支持线程</strong>：在内核的支持下运行——无论是用户进程中的线程，还是系统进程中的线程，它们的创建、撤消和切换等也依靠内核实现。在内核空间为每一个内核支持线程设置了一个线程控制块，内核是根据该控制块而感知某线程的存在的，并对其加以控制。</p>
          <p>若系统中设置的是内核支持线程，则<strong>以线程为单位进行调度</strong>。在采用轮转法调度时，各个线程轮流执行一个时间片。假定进程 A 中只有一个内核支持线程，而进程 B 中有 100 个内核支持线程，此时进程 B 可以获得的 CPU 时间是进程 A 的 100 倍，且进程 B 可使 100 个系统调用并发工作。</p>
          <ul>
            <li>优点：对多处理器，核心可以同时调度同一进程的多个线程；阻塞是在线程一级完成；核心例程是多线程的；</li>
            <li>缺点：在同一进程内的线程切换调用内核，导致速度下降。</li>
          </ul>
          <p><strong>(2) 用户级线程</strong>：仅存在于用户空间中。对这种线程的创建、撤消、线程之间的同步与通信等功能，都无须利用系统调用来实现；用户级线程的切换通常发生在一个应用进程的诸多线程之间，同样无须内核的支持。可以为一个应用程序建立多个用户级线程，一个系统中用户级线程的数目可达数百个至数千个；由于这些线程的任务控制块都设置在用户空间，线程所执行的操作也无须内核的帮助，<strong>内核完全不知道用户级线程的存在</strong>。</p>
          <p>对于设置了用户级线程的系统，其调度仍以进程为单位进行。在采用轮转调度算法时，假如进程 A 中包含一个用户级线程，而进程 B 中含有 100 个用户级线程，进程 A 中线程的运行时间将是进程 B 中各线程运行时间的 100 倍。</p>
          <ul>
            <li>优点：线程切换不调用核心；调度是应用程序特定的——可以选择最好的算法；ULT 可运行在任何操作系统上（只需要线程库）；</li>
            <li>缺点：大多数系统调用是阻塞的，核心阻塞进程，故进程中所有线程将被阻塞；核心只将处理器分配给进程，同一进程中的两个线程不能同时运行于两个处理器上。</li>
          </ul>
          `,
        },
      ],
    },
    {
      id: 'sec-ch2-osrun',
      heading: '7. 补充材料：OS 的运行',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>(1) 操作系统如何实现对计算机的控制</strong>：计算机系统架构下，程序运行与操作系统运行的关系为：操作系统初始化 → 运行应用程序 → 正常时执行普通代码 → 特殊时调用 OS 代码（如 block()、open() 等系统调用），用户程序通过调用 OS 内核代码获得服务。</p>
          <p><strong>(2) 指令系统</strong>：</p>
          <ul>
            <li>访问存储器指令：处理器和存储器间数据传送；</li>
            <li>I/O 指令：处理器和 I/O 模块间数据传送和命令发送；</li>
            <li>算术逻辑指令（数据处理指令）：执行数据算术和逻辑操作；</li>
            <li>控制转移指令：指定一个新的指令的执行起点；</li>
            <li>处理器控制指令：修改处理器状态，改变处理器工作方式。</li>
          </ul>
          <p><strong>特权指令和非特权指令</strong>：特权指令——只能由操作系统使用的指令。特权指令一般引起处理器状态的切换：处理器通过特殊的机制将处理器状态切换到操作系统运行的特权状态（管态），然后将处理权移交给操作系统中的一段特殊代码，这一个过程称为<strong>陷入</strong>。使用多道程序设计技术的计算机指令系统必须要区分为特权指令和非特权指令。</p>
          <p><strong>(3) 系统态和用户态</strong>：根据运行程序对资源和机器指令的使用权限将处理器设置为不同状态。将处理器工作状态划分为系统态（管态）和用户态（目态）：</p>
          <ul>
            <li><strong>系统态</strong>：操作系统管理程序运行的状态，较高的特权级别，又称为特权态（特态）、核心态、管态；</li>
            <li><strong>用户态</strong>：用户程序运行时的状态，较低的特权级别，又称为普通态（普态）、目态。</li>
          </ul>
          <p><strong>(4) 实例：Intel x86 环保护机制</strong>：4 级环——Ring0～Ring3（课件原文标注 Ring0-Ring4 为笔误，实为 0～3 四级）；各级有保护性检查（地址校验、I/O 限制）。四个级别运行不同类程序：Ring0——操作系统核心代码；Ring1——运行关键设备驱动程序和 I/O 处理例程；Ring2——其他受保护共享代码，如语言系统运行环境；Ring3——各种用户程序。现有基于 x86 处理器的操作系统，多数 UNIX、Linux 以及 Windows 系列只用了 Ring0 和 Ring3 两级。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch2-exercise',
      heading: '8. 本章习题',
      blocks: [
        {
          type: 'html',
          html: `
          <p>修订版教材 P68：习题 2、4、6、8、11、17、18、23、25、26、28、33、36、41。</p>
          `,
        },
      ],
    },
  ],
};

export default ch;
