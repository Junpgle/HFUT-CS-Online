/* 操作系统 · 第1章 操作系统引论 —— 依据「课件/PPT-按章/第1章 操作系统引论.pdf」（合肥工业大学操作系统课程组，2014）整理 */
import type { OsChapter } from './types';

const ch: OsChapter = {
  id: 'ch1',
  no: '第1章',
  title: '操作系统引论',
  subtitle: '第 1 章 · 操作系统引论',
  lede: `
  本章回答「什么是操作系统」。操作系统是一组<strong>管理和控制计算机软硬件资源</strong>、合理组织计算机系统工作流程、
        方便用户使用的软件集合。内容沿「目标与作用 → 发展历程（无操作系统 → 批处理 → 分时 → 实时）→ 四大基本特征 →
        五大功能 → 四种结构」推进。
`,
  toc: [
    { id: 'sec-ch1-what', text: '1. 什么是操作系统', level: 2 },
    { id: 'sec-ch1-goal', text: '2. OS 的目标和作用', level: 2 },
    { id: 'sec-ch1-goal-h1', text: '操作系统的目标', level: 3 },
    { id: 'sec-ch1-goal-h2', text: '操作系统的作用', level: 3 },
    { id: 'sec-ch1-history', text: '3. OS 的发展过程', level: 2 },
    { id: 'sec-ch1-history-h1', text: '无操作系统时代（1945—1950 年中期）', level: 3 },
    { id: 'sec-ch1-history-h2', text: '批处理操作系统', level: 3 },
    { id: 'sec-ch1-history-h3', text: '分时操作系统', level: 3 },
    { id: 'sec-ch1-history-h4', text: '实时操作系统', level: 3 },
    { id: 'sec-ch1-history-h5', text: '操作系统的动物园（UNIX 与 Windows 家族）', level: 3 },
    { id: 'sec-ch1-feature', text: '4. 操作系统的基本特征', level: 2 },
    { id: 'sec-ch1-func', text: '5. 操作系统的主要功能', level: 2 },
    { id: 'sec-ch1-struct', text: '6. 操作系统结构', level: 2 },
    { id: 'sec-ch1-struct-h1', text: '无结构操作系统', level: 3 },
    { id: 'sec-ch1-struct-h2', text: '模块化操作系统结构', level: 3 },
    { id: 'sec-ch1-struct-h3', text: '分层式操作系统结构', level: 3 },
    { id: 'sec-ch1-struct-h4', text: '微内核操作系统结构', level: 3 },
  ],
  sections: [
    {
      id: 'sec-ch1-what',
      heading: '1. 什么是操作系统',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>操作系统的定义</strong>（Operating System, OS）：操作系统是一组管理和控制计算机软件和硬件资源，合理组织计算机系统工作流程，以及方便用户使用的软件集合。</p>
          <p>定义的核心分两层：</p>
          <ul>
            <li><strong>计算机的管理者和控制者</strong>——管理和控制计算机软硬件资源；合理组织计算机系统工作流程；</li>
            <li><strong>其他软件的运行平台和服务接口</strong>——提供系统服务，作为用户使用接口。</li>
          </ul>
          <p>课件用「操作系统 vs. 政府」类比 OS 提供服务的方式：用户程序通过系统调用请求 OS 服务（如 <code>cout &lt;&lt; buff[0]</code>、<code>new</code>/<code>delete</code> 申请与释放内存），就像市民拨打 110 请求政府服务一样——由 OS/政府调动资源完成任务。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch1-goal',
      heading: '2. OS 的目标和作用',
      blocks: [
        { type: 'html', html: `<h3 id="sec-ch1-goal-h1">操作系统的目标</h3>
          <ul>
            <li><strong>方便性</strong>——配置 OS 以使计算机更加容易使用；</li>
            <li><strong>有效性</strong>——配置 OS 以使计算机更加高效。</li>
          </ul>
          <h3 id="sec-ch1-goal-h2">操作系统的作用</h3>
          <ul>
            <li>OS 作为<strong>用户与计算机硬件系统之间的接口</strong>；</li>
            <li>OS 作为<strong>计算机系统资源的管理者</strong>；</li>
            <li>OS 用作<strong>扩充机器</strong>（计算机资源抽象，一层一层的抽象）。</li>
          </ul>
          <p>「扩充机器」的含义：在裸机上覆盖一层 OS（或更高层的软件），把裸机改造成功能更强、使用更方便的机器；层层抽象后，用户看到的是一台比一台更容易使用的虚拟机。</p>` },
      ],
    },
    {
      id: 'sec-ch1-history',
      heading: '3. OS 的发展过程',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>推动操作系统发展的主要动力</strong>：提高资源利用率；方便用户；器件的更新换代；计算机体系结构的发展；新的应用需求。</p>
          <h3 id="sec-ch1-history-h1">无操作系统时代（1945—1950 年中期）</h3>
          <p>1940 年代末，现代计算机系统（冯·诺依曼结构）出现，软件概念尚未真正形成。程序员将存储程序和数据的纸带/卡片装入纸带输入机/读卡机，启动它们将程序和数据输入计算机，然后启动计算机运行；运行结束后再启动设备把结果输出到纸带/卡片。一个程序运行完毕才允许下一个用户上机运行。</p>
          <ul>
            <li><strong>工作方式</strong>：计算机专注于单个用户及程序（one user/programmer）；程序员人工操作 Programming、Debugging、Loading。</li>
            <li><strong>优点</strong>：交互性（Interactive）好，用户能立即得到响应。</li>
            <li><strong>缺点</strong>：昂贵的机器资源（CPU、内存、各 I/O 设备）在大多数时间内处于空闲状态——「人-机矛盾、CPU-I/O 矛盾」，原因在于人工操作很慢、用户独占全机。</li>
          </ul>
          <h3 id="sec-ch1-history-h2">批处理操作系统</h3>
          <p><strong>什么是批处理系统</strong>（Batch Processing System）：在计算机上加载一个专门监控软件，在其控制下，计算机能够自动地、成批地处理一个或多个用户的一批作业。特点：系统吞吐量大；资源利用率高；平均周转时间短；无交互能力。</p>
          <p>为缓解主机与慢速 I/O 的矛盾，出现了<strong>脱机输入/输出</strong>（Off-line I/O）方式：外围机先把卡片上的作业输入到磁带上，主机从磁带读入作业，结果也先写到磁带，再由外围机输出——IBM 1401（外围机）+ IBM 7094（主机）+ 磁带是典型配置（FMS 系统）。</p>
          <p><strong>(1) 单道批处理系统</strong>（Simple Batch Processing System）：用户提交描述任务的卡片（作业控制说明书），由常驻的监控程序排队；可使用磁带完成批量输入和 SPOOLing 输出；一次只调入一个作业到内存中运行。</p>
          <ul>
            <li>优点：计算机系统自动连续运转；</li>
            <li>缺点：无交互性，I/O 与 CPU 的矛盾仍然严重；</li>
            <li>特点：自动性、顺序性、单道性；</li>
            <li>代表性系统：1960 年代的 FMS。</li>
          </ul>
          <p><strong>(2) 多道程序设计技术</strong>：单道批处理下资源得不到有效利用（窝工问题严重）；引入流水线式的高效协作后，<strong>同时在内存中驻留多道程序</strong>，从而提高系统的整体资源利用率。</p>
          <p><strong>(3) 多道批处理系统</strong>（Multiprogrammed Batch Processing System）：由不同用户提交的多个作业同时常驻主存运行。</p>
          <ul>
            <li>优点：计算机系统始终保持忙碌状态；</li>
            <li>缺点：无交互性；</li>
            <li>特点：多道性、无序性、调度性；</li>
            <li>代表性系统：1960 年代，IBM OS/360。</li>
          </ul>
          <h3 id="sec-ch1-history-h3">分时操作系统</h3>
          <p><strong>分时系统</strong>：一台计算机能连接多个用户终端，用户可通过各自的终端使用和控制计算机。<strong>分时技术</strong>：把处理机的响应时间分成大小相等（或不相等）的时间片，所有终端用户依次轮流获得一个时间片运行程序，时间片用完则暂停运行，等待下一次运行。分时系统诞生的背景是人机交互与共享主机。</p>
          <p>分时系统的关键问题是<strong>及时接收与及时处理</strong>，采用分时处理技术解决。<strong>分时操作系统的特点</strong>：</p>
          <ul>
            <li><strong>多路性</strong>：众多联机用户可以同时使用同一台计算机；</li>
            <li><strong>独立性</strong>：各终端用户感觉到自己独占了计算机；</li>
            <li><strong>及时性</strong>：用户的请求能在很短时间内得到响应；</li>
            <li><strong>交互性</strong>：用户与计算机之间可进行「会话」。</li>
          </ul>
          <p><strong>代表性系统</strong>：CTSS（Compatible Time Sharing System，1962，MIT，IBM 7094）；Multics（多路存取计算机系统，1964，GE-645）。</p>
          <h3 id="sec-ch1-history-h4">实时操作系统</h3>
          <p><strong>实时系统诞生背景</strong>：60 年代初，计算机开始应用到生产过程控制、工业控制、防空系统、信息处理等，在这些应用中不但要解决计算问题，还要求在规定的时间内完成计算，即实时处理；实时处理中的一个核心问题就是响应时间问题。</p>
          <p><strong>实时操作系统</strong>（Real-Time OS）：对外部的请求，实时操作系统能够在规定的时间内处理完毕。特点：</p>
          <ul>
            <li><strong>实时性</strong>：计算机对用户请求能足够快地进行处理并做出反应，要求毫秒、微秒级；</li>
            <li><strong>高可靠性和安全性</strong>：效率则放在第二位；</li>
            <li><strong>系统整体性强</strong>；</li>
            <li><strong>不要求很强的「会话」能力</strong>。</li>
          </ul>
          <p><strong>代表性系统</strong>：WinCE、嵌入式 Linux、ucOSII、VxWorks 等。</p>
          <h3 id="sec-ch1-history-h5">操作系统的动物园（UNIX 与 Windows 家族）</h3>
          <p>The Operating System Zoo：课件给出两大家族谱系图——<strong>UNIX 家族</strong>（从 CTSS、Multics 演化出 UNIX，再分出 BSD、System V，进而到 Solaris、Linux、Mac OS、AIX、HP-UX 等）与 <strong>Windows 家族</strong>（从 MS-DOS 演化出 Windows 9x/Me 与 Windows NT 系列，再到 Windows 2000/XP 等）。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch1-feature',
      heading: '4. 操作系统的基本特征',
      blocks: [
        {
          type: 'html',
          html: `
          <p>OS 有四个基本特征：<strong>并发（Concurrency）、共享（Sharing）、虚拟（Virtual）、异步性（Asynchronism）</strong>。</p>
          <p><strong>并发</strong>：并发指两个或多个事件在<strong>同一时间段内</strong>发生；并行指两个或多个事件在<strong>同一时刻</strong>发生。计算机系统中的并发运行：在多道程序环境下，指在一段时间内，宏观上有多个程序在同时运行；但在单处理机系统中，每一时刻仅能有一道程序运行——微观上这些程序只能是分时的交替执行。</p>
          <p><strong>共享</strong>：指多个计算任务（或多道程序）对系统资源共同使用。资源共享方式有两种：</p>
          <ul>
            <li><strong>互斥共享方式</strong>：如打印机；</li>
            <li><strong>同时访问方式</strong>：如磁盘、内存。</li>
          </ul>
          <p><strong>虚拟</strong>：指通过某种技术把一个物理实体变为若干个逻辑上的对应物。物理实体是实际存在的，「虚拟」物是虚的、用户感觉到的东西。操作系统中利用了多种虚拟技术，分别实现虚拟处理机、虚拟内存、虚拟文件、虚拟设备和虚拟信道等。</p>
          <p><strong>异步性</strong>：在多道程序环境下，允许多个进程并发执行，但只有进程获得所需的资源后方能执行。由于资源等因素的限制，进程的执行通常都不是「一气呵成」的，而是「停停走走」；进程以人们不可预知的速度向前推进，即进程的「异步性」。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch1-func',
      heading: '5. 操作系统的主要功能',
      blocks: [
        {
          type: 'html',
          html: `
          <p>从资源管理和用户接口的角度看，操作系统具备<strong>处理机管理、存储器管理、文件管理、设备管理、用户接口</strong>五类功能：</p>
          <table class="tbl">
            <thead><tr><th>功能域</th><th>包含内容</th></tr></thead>
            <tbody>
              <tr><td>处理机管理</td><td>进程控制、进程同步、进程通信、调度</td></tr>
              <tr><td>存储器管理</td><td>内存分配、内存保护、地址映射、内存扩充</td></tr>
              <tr><td>设备管理</td><td>缓冲管理、设备分配、设备处理</td></tr>
              <tr><td>文件管理</td><td>文件存储空间的管理、目录管理、文件的读写管理和保护</td></tr>
              <tr><td>用户接口</td><td>命令接口、图形接口、程序接口</td></tr>
            </tbody>
          </table>
          `,
        },
      ],
    },
    {
      id: 'sec-ch1-struct',
      heading: '6. 操作系统结构',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>引子：操作系统软件规模的演变</strong>——1963 年 CTSS 为 32000 个 36 位字；1960 年代初 OS/360 为 100 万条机器指令；1975 年 Multics 为 2000 万条机器指令；1990 年代 Windows NT 4.0 为 1600 万条代码；2000 年 Windows 2000 比 Windows NT 4.0 增长 2 倍；2020 年 Linux 5.8 为 2200 万行代码。规模膨胀推动 OS 结构不断演进。</p>
          <h3 id="sec-ch1-struct-h1">无结构操作系统</h3>
          <p>操作系统内部无明显的结构特征，设计者只关心功能的实现和高的执行效率，缺乏首尾一致的设计思想。优缺点：操作系统庞大杂乱，缺乏清晰的程序结构；操作系统的编写、调试、维护复杂，保证操作系统程序的正确困难。</p>
          <h3 id="sec-ch1-struct-h2">模块化操作系统结构</h3>
          <p>使用结构化程序设计思想，划分系统模块，模块之间直接根据功能要求互相调用。优缺点：</p>
          <ul>
            <li>提高 OS 设计的正确性、可理解性和可维护性；</li>
            <li>增强 OS 的可移植性，加速 OS 的开发过程；</li>
            <li>结构划分和接口设计困难；</li>
            <li>模块之间调用关系复杂，牵一发而动全身。</li>
          </ul>
          <h3 id="sec-ch1-struct-h3">分层式操作系统结构</h3>
          <p>在模块化结构基础上，将模块分为若干层。层内模块之间可以互相随意调用；层间模块的调用遵循<strong>单向调用原则</strong>——高层模块可以调用低层模块，反之不可以。</p>
          <p><strong>层次划分原则</strong>：程序嵌套、运行频率、公用模块、用户接口。将最靠近硬件的低层 OS 部分称为<strong>操作系统内核</strong>（Kernel），内核通常常驻主存。优缺点：</p>
          <ul>
            <li>提高 OS 设计的正确性、可理解性和可维护性；</li>
            <li>增强 OS 的可移植性；</li>
            <li>OS 开发调试效率提高：逐层开发和调试；</li>
            <li>降低模块之间耦合度。</li>
          </ul>
          <h3 id="sec-ch1-struct-h4">微内核操作系统结构</h3>
          <p><strong>微内核</strong>（MicroKernel）：精心设计的、能实现现代 OS 核心功能的小型内核，比一般的 OS 更小更精炼，运行在核心态且开机后常驻内存，不会因为内存紧张而被换出内存。</p>
          <p><strong>微内核技术</strong>将 OS 分为两个部分：</p>
          <ul>
            <li>提供各类服务的一组<strong>服务器进程</strong>；</li>
            <li><strong>内核</strong>，只提供客户-服务器通信机制和与硬件紧密相关的较基本的功能。</li>
          </ul>
          <p>OS 采用客户机-服务器工作模式提供各类操作系统服务：用户进程（客户）向文件服务、打印服务、时钟服务等服务器进程发出「请求-服务」消息，服务器进程完成服务后应答；内核与服务器进程之间的分界线即微内核边界。</p>
          <div class="callout tip">
            <p class="callout-h">优缺点</p>
            <ul>
              <li>提高 OS 的灵活性、可移植性和可扩充性；</li>
              <li>OS 内核更小、更加稳定，可靠性高；</li>
              <li>可运行于分布式系统；</li>
              <li>操作系统运行效率较低。</li>
            </ul>
          </div>
          `,
        },
      ],
    },
  ],
};

export default ch;
