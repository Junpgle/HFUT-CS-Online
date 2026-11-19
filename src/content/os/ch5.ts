/* 操作系统 · 第5章 设备管理 —— 依据「课件/PPT-按章/第5章 设备管理.pdf」（合肥工业大学操作系统课程组，2014）整理 */
import type { OsChapter } from './types';

const ch: OsChapter = {
  id: 'ch5',
  no: '第5章',
  title: '设备管理',
  subtitle: '第 5 章 · 设备管理',
  lede: `
  本章围绕 I/O 展开：<strong>I/O 系统结构与四种控制方式</strong>、<strong>缓冲管理</strong>（单/双/循环缓冲与缓冲池）、
        <strong>设备分配</strong>（设备独立性、SPOOLing 技术）与<strong>磁盘存储管理</strong>（磁盘访问时间、FCFS/SSTF/SCAN/CSCAN 调度算法）。
        磁盘调度与缓冲区处理时间是期末计算题常客，SPOOLing 与设备独立性是简答题常客。
`,
  toc: [
    { id: 'sec-ch5-iosys', text: '1. I/O 系统', level: 2 },
    { id: 'sec-ch5-iosys-h1', text: 'I/O 系统的基本结构', level: 3 },
    { id: 'sec-ch5-iosys-h2', text: 'I/O 控制方式', level: 3 },
    { id: 'sec-ch5-buffer', text: '2. 缓冲管理', level: 2 },
    { id: 'sec-ch5-buffer-h1', text: '缓冲的引入', level: 3 },
    { id: 'sec-ch5-buffer-h2', text: '单缓冲、双缓冲、循环缓冲与缓冲池', level: 3 },
    { id: 'sec-ch5-alloc', text: '3. 设备分配', level: 2 },
    { id: 'sec-ch5-alloc-h1', text: '设备分配的基本概念', level: 3 },
    { id: 'sec-ch5-alloc-h2', text: '设备独立性', level: 3 },
    { id: 'sec-ch5-alloc-h3', text: 'SPOOLing 技术', level: 3 },
    { id: 'sec-ch5-disk', text: '4. 磁盘存储管理', level: 2 },
    { id: 'sec-ch5-disk-h1', text: '磁盘工作原理', level: 3 },
    { id: 'sec-ch5-disk-h2', text: '磁盘调度算法', level: 3 },
    { id: 'sec-ch5-disk-h3', text: '磁盘高速缓存与提高磁盘 I/O 速度的其他方法', level: 3 },
    { id: 'sec-ch5-exercise', text: '5. 本章习题', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ch5-iosys',
      heading: '1. I/O 系统',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ch5-iosys-h1">I/O 系统的基本结构</h3>
          <p><strong>(1) 硬件基本结构</strong>：CPU/处理器、I/O 通道、设备控制器与 I/O 设备逐级相连——CPU 通过总线连接通道/控制器，控制器再连接具体设备。</p>
          <p><strong>(2) I/O 系统组成成分</strong>：</p>
          <ul>
            <li><strong>I/O 设备</strong>：具体完成数据 I/O 的设备。分类——按速率分类：低速设备（键盘）、中速设备（打印机）、高速设备（磁盘）；按信息交换单位分类：字符设备（键盘）、块设备（磁盘）。</li>
            <li><strong>设备控制器</strong>：负责连接 I/O 设备和数据总线，完成设备控制和数据格式转换。功能——接收和识别命令；数据交换；标志和报告设备状态；地址识别；数据缓冲；差错控制。编址：端口（I/O 端口）。</li>
            <li><strong>I/O 通道</strong>：目的是使原来由 CPU 处理的 I/O 任务转由通道来承担，从而把 CPU 从繁杂的 I/O 任务中解脱出来。I/O 通道是一种特殊的处理器，专门负责输入/输出；它具有自己的指令系统，但该指令系统比较简单，一般只有数据传送指令、设备控制指令等；通道没有自己的内存，通道所执行的程序（即通道程序）存放在主机内存中，它与 CPU 共享内存。</li>
          </ul>
          <p><strong>(3) I/O 系统结构</strong>：<strong>单通路 I/O 系统</strong>——无冗余设备，容错性差；<strong>多通路 I/O 系统</strong>——有冗余设备，容错性佳。</p>
          <h3 id="sec-ch5-iosys-h2">I/O 控制方式</h3>
          <p>设备管理的主要任务之一，是控制设备和内存或 CPU 之间的数据传送。外围设备和内存之间常用的数据传送控制方式有四种：<strong>程序 I/O 方式、中断驱动 I/O 控制方式、直接存储器存取方式（DMA）、通道控制方式</strong>。</p>
          <p><strong>(1) 通道控制方式</strong>：</p>
          <ul>
            <li>通道控制方式与 DMA 方式相类似，也是一种内存和设备直接进行数据交换的方式；</li>
            <li>与 DMA 方式不同的是，在通道控制方式中，数据传送方向、存放数据的内存始址及传送的数据块长度均由一个专门负责输入/输出的硬件——通道来控制；</li>
            <li>另外，DMA 方式每台设备至少需要一个 DMA 控制器，而通道控制方式中，一个通道可控制多台设备与内存进行数据交换。</li>
          </ul>
          <p><strong>通道指令</strong>：操作码——规定指令所执行的操作，如读、写等；内存地址——标明数据传送时内存的首址；计数——表示传送数据的字节数；通道程序结束位 R0——表示通道程序是否结束；记录结束标志 R1——表示所处理的记录是否结束。</p>
          <p><strong>通道程序</strong>（存放在内存中）：一个由六条通道指令所构成的简单的通道程序，该程序的功能是将内存中不同地址的数据写成多个记录。其中，前三条指令是分别将 813～892 单元中的 80 个字符和 1034～1173 单元中的 140 个字符及 5830～5889 单元中的 60 个字符写成一个记录；第 4 条指令是单独写一个具有 300 个字符的记录；第 5、6 条指令共写含 500 个字符的记录。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch5-buffer',
      heading: '2. 缓冲管理',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ch5-buffer-h1">缓冲的引入</h3>
          <p><strong>(1) 引入缓冲的原因</strong>：缓和 CPU 和 I/O 设备的矛盾；减少 CPU 中断的频率；提高 CPU 和 I/O 设备的并行性。</p>
          <h3 id="sec-ch5-buffer-h2">单缓冲、双缓冲、循环缓冲与缓冲池</h3>
          <p><strong>5.2.2 单缓冲</strong>——原理：I/O 设备把数据输入缓冲区，再由缓冲区传送到用户进程工作区进行处理，三者（设备、缓冲区、用户进程工作区）串行接力。</p>
          <p><strong>(2) 处理时间</strong>（T 为设备输入一块的时间，M 为缓冲区到工作区的传送时间，C 为处理时间）：</p>
          <div class="formula">单缓冲处理一块的总时间 = <span class="m">MAX(C, T) + M</span>（即 T &gt; C 时为 M + T，T &lt; C 时为 M + C）</div>
          <p><strong>5.2.3 双缓冲（缓冲对换）</strong>——原理：设置缓冲区 1 与缓冲区 2，设备向一个缓冲区输入的同时，用户进程从另一个缓冲区取数处理，两缓冲区交替对换。<strong>(2) 处理时间</strong>：</p>
          <div class="formula">双缓冲处理一块的总时间 = <span class="m">MAX(C, T)</span>（输入与处理可完全并行，传送时间被吸收）</div>
          <p><strong>5.2.4 循环缓冲</strong>——原理：设置 n 个缓冲区组成环，输入与处理沿环形依次推进；<strong>(2) 实现</strong>：用生产者-消费者方式管理多个缓冲区（配 in/out 指针与同步信号量）。</p>
          <p><strong>5.2.5 缓冲池（公用缓冲池）</strong>——<strong>(1) 原理</strong>：系统中设置一个公用的缓冲池，含空缓冲队列、输入队列、输出队列三个队列，供多进程共享。<strong>(2) 两个基本操作</strong>：<code>GetBuf()</code>、<code>PutBuf()</code>。<strong>工作方式</strong>：收容输入、提取输入、收容输出、提取输出。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch5-alloc',
      heading: '3. 设备分配',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ch5-alloc-h1">设备分配的基本概念</h3>
          <p><strong>(1) 设备类型对设备分配的影响</strong>：</p>
          <ul>
            <li><strong>独占设备 → 独占分配</strong>：指在一段时间内只允许一个用户（进程）使用的设备。系统一旦把该设备分配给某进程后，便让它独占直至释放。注意：独占设备的分配可能会引起进程死锁。</li>
            <li><strong>共享设备 → 共享分配</strong>：指在一段时间内允许多个进程同时访问的设备。共享设备必须是可寻址的和可随机访问的设备。典型的共享设备是磁盘。共享设备不仅能获得良好的设备利用率，而且是实现文件和数据共享的物质基础。</li>
            <li><strong>虚拟设备 → 共享分配</strong>：指通过某种技术将一台独占设备变换为能供若干个用户共享的设备。可将其同时分配给多个用户，从而提高设备的利用率。SPOOLing 技术是一类典型的虚拟设备技术。</li>
          </ul>
          <p><strong>(2) 设备分配算法和安全性</strong>：设备分配算法——先来先服务、优先级高者优先等。设备分配的安全性——安全方式：串行分配，一个一个分配；不安全方式：并行分配，可同时分配多个设备资源。</p>
          <h3 id="sec-ch5-alloc-h2">设备独立性</h3>
          <p><strong>(1) 设备独立性基本概念</strong>：设备独立性定义——用户程序独立于具体使用的物理设备。</p>
          <p><strong>(2) 设备独立性实现：逻辑设备与物理设备</strong>——核心：采用虚拟技术，编写应用程序时不考虑实际的物理设备。引入逻辑设备和物理设备：<strong>物理设备</strong>——应用程序实际执行时使用的特定类型设备；<strong>逻辑设备</strong>——对一组具备相同功能物理设备的抽象。基本作法：编写程序时使用逻辑设备名称访问设备；程序执行时使用具体的物理设备完成实际数据操作。</p>
          <p><strong>逻辑设备到物理设备的映射</strong>：程序执行时使用逻辑设备表（LUT）完成逻辑设备到物理设备的映射——表项含逻辑设备名、物理设备名、驱动程序入口（如 /dev/tty → 3 → 0x00001024；/dev/printer → 5 → 0x00002034）。注意：需要每个用户一张 LUT。</p>
          <p><strong>(3) 设备独立性优点</strong>：</p>
          <ul>
            <li><strong>设备分配时的灵活性</strong>：若进程以物理设备名称请求使用指定某台设备，如果该设备已经分配给其他进程或正在检修，此时尽管还有其它的相同设备空闲，该进程仍会阻塞；但若进程能以逻辑设备名称来请求某类设备时，系统可立即将该类设备中的任一台分配给进程。</li>
            <li><strong>易于实现 I/O 重定向</strong>：指用于 I/O 操作的设备可以更换（即重定向），而不必改变应用程序。例如：调试应用程序时可将程序的所有输出送往屏幕显示；程序调试完后如需正式打印运行结果，此时将 I/O 重定向的数据结构（逻辑设备表）中的显示终端改为打印机即可，不必修改应用程序。</li>
          </ul>
          <h3 id="sec-ch5-alloc-h3">SPOOLing 技术</h3>
          <p><strong>(1) SPOOLing 技术</strong>（Simultaneous Peripheral Operating On-Line）<strong>概述</strong>——为缓和 CPU 的高速性与 I/O 设备低速性之间的矛盾：早期引入脱机输入、脱机输出技术，利用专门的外围控制机将低速 I/O 设备上的数据传送到高速磁盘上（或者相反）；现在在引入多道程序技术后，可以利用系统中的进程来模拟外围控制机功能，从而把低速 I/O 设备上的数据传送到高速磁盘上、把数据从磁盘传送到低速输出设备上。这样便可在主机的直接控制下，实现脱机输入、输出功能。</p>
          <p><strong>(2) SPOOLing 基本组成</strong>：输入井和输出井；输入缓冲区和输出缓冲区；输入进程和输出进程。<strong>(3) 共享打印机</strong>：SPOOLing 系统的典型应用。<strong>(4) SPOOLing 特点</strong>：提高 I/O 速度；改造独占设备为共享设备；实现虚拟设备。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch5-disk',
      heading: '4. 磁盘存储管理',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ch5-disk-h1">磁盘工作原理</h3>
          <p>硬盘由多个盘片（platters）构成；盘片转速：5400RPM、7200RPM、10000RPM。<strong>磁盘数据定位</strong>：磁头号、磁道号、扇区号（sector 在 track 上）。</p>
          <p><strong>磁盘访问时间</strong>：</p>
          <div class="formula">T = T<sub>s</sub> + T<sub>r</sub> + T<sub>t</sub>　　<span class="m">寻道时间 Ts = 8～10ms；旋转延迟 Tr = 1/(2r)；传输时间 Tt = b/(r·N)</span></div>
          <p>其中 r 为转速，N 为每磁道字节数，b 为传输字节数。三种转速下的典型值（取 b/N = 1/128）：</p>
          <table class="tbl">
            <thead><tr><th>转速(RPM)</th><th>Ts (ms)</th><th>Tr (ms)</th><th>Tt (ms)</th></tr></thead>
            <tbody>
              <tr><td>5400</td><td>8～10</td><td>5.5</td><td>0.1</td></tr>
              <tr><td>7200</td><td>8～10</td><td>4.3</td><td>0.07</td></tr>
              <tr><td>10000</td><td>8～10</td><td>3</td><td>0.05</td></tr>
            </tbody>
          </table>
          <p><strong>结论：Ts &gt; Tr ≫ Tt</strong>——寻道时间是磁盘访问时间的大头。</p>
          <h3 id="sec-ch5-disk-h2">磁盘调度算法</h3>
          <p>磁盘是可供多个进程共享的设备，当有多个进程都要求访问磁盘时，应采用一种最佳调度算法，以使各进程对磁盘的平均访问时间最小。由于在访问磁盘的时间中主要是寻道时间，因此磁盘调度的目标是使磁盘的<strong>平均寻道时间最少</strong>。</p>
          <p><strong>(1) 先来先服务调度算法（FCFS）</strong>：根据进程请求磁盘的先后次序进行调度。特点：公平、简单，每个进程的请求都能依次地得到处理，不会出现某一进程的请求长期得不到满足的情况。</p>
          <p><strong>(2) 最短寻道时间优先调度算法（SSTF）</strong>：要求访问的磁道，与当前磁头所在的磁道距离最近，以使每次的寻道时间最短。特点：SSTF 的平均每次磁头移动距离明显低于 FCFS，因而 SSTF 较 FCFS 有更好的寻道性能；但会出现「磁臂粘着」现象。</p>
          <p><strong>(3) 扫描算法（SCAN）</strong>：在磁头移动方向上，且要求访问的磁道与当前磁头所在的磁道距离最近，以使每次的寻道时间最短（当前磁头移动方向如磁道号增加）。特点：有效解决磁臂粘着现象。</p>
          <p><strong>(4) 循环扫描算法（CSCAN）</strong>：即为单向 SCAN——只在一个磁头移动方向上满足磁道访问请求（如仅磁道号增加时可满足磁道访问），要求访问的磁道与当前磁头所在的磁道距离最近。特点：有效降低磁道请求最大延迟。</p>
          <div class="callout key">
            <p class="callout-h">FCFS 和 SSTF 算法比较</p>
            <p>课件以同一请求序列分别画出 FCFS 与 SSTF 的磁头移动轨迹：FCFS 按到达顺序长距离往返；SSTF 总是就近服务，单次移动距离明显更短，但远处请求可能长期得不到响应。（完整算例见「期末大题精讲 · 磁盘调度算法」。）</p>
          </div>
          <h3 id="sec-ch5-disk-h3">磁盘高速缓存与提高磁盘 I/O 速度的其他方法</h3>
          <p><strong>5.4.3 磁盘高速缓存（Disk Cache）</strong>：在内存中开辟磁盘高速缓存区，供进程 A、进程 B 与磁盘之间共享（对文件 1、文件 2 的访问可先在缓存中完成）。<strong>(1) 实现技术</strong>：数据交付；置换算法——LRU；周期性写回。</p>
          <p><strong>5.4.4 提高磁盘 I/O 速度的其他方法</strong>：提前读；延迟写；优化物理块分布。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch5-exercise',
      heading: '5. 本章习题',
      blocks: [
        {
          type: 'html',
          html: `
          <p>修订版教材 P181：习题 4、9、18、24。</p>
          `,
        },
      ],
    },
  ],
};

export default ch;
