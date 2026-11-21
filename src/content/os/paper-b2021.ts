/* 试卷 4：2021-2022 学年第一学期《操作系统》期末试卷 B（课程代码 0509112B）。
 * 来源：试题/期末/2021-2022学年第一学期合肥工业大学《操作系统》科目期末试卷B.pdf（扫描件转录）。
 * 原卷不含参考答案，答案与解析为本站依据课件内容整理。 */
import type { OsPaper, OsQuestion } from './types';

const qs: OsQuestion[] = [
  // ---------- 一、填空题（10 分，每空 2 分） ----------
  {
    id: 'p4-f1',
    kind: 'fill',
    question: '标准临界区访问控制模型中，在访问临界区代码之前须加入一段________区代码，用来提出使用临界资源的要求，而在访问临界区代码之后加入一段退出区代码，用来释放对临界资源的访问。',
    answer: '进入',
    explanation: '临界区访问控制模型把进程代码分为进入区（entry section）、临界区、退出区（exit section）与剩余区（remainder section）四段；进入区负责申请临界资源（如加锁）。',
    tags: [{ deck: 2, sec: 'sec-ch2-sync-h2', text: '临界区访问控制模型' }],
  },
  {
    id: 'p4-f2',
    kind: 'fill',
    question: '程序的并发执行如果不加任何限制，则会造成运行结果中的________。',
    answer: '不可再现性｜结果不定',
    explanation: '并发程序共享资源、互相影响，运行结果会出现不可再现性（结果不定）——这是必须引入同步机制的根本原因。',
    tags: [{ deck: 2, sec: 'sec-ch2-concept-h3', text: '并发执行的特征' }],
  },
  {
    id: 'p4-f3',
    kind: 'fill',
    question: '进程实体包括程序段、数据段和________，其中后者也是进程存在的唯一标志。',
    answer: '进程控制块｜PCB',
    explanation: '进程实体 = 程序段 + 数据段 + 进程控制块（PCB）；PCB 是进程存在的唯一标志，位于操作系统内核。',
    tags: [{ deck: 2, sec: 'sec-ch2-concept-h5', text: '进程控制块 PCB' }],
  },
  {
    id: 'p4-f4',
    kind: 'fill',
    question: '有四进程 P1，P2，P3，P4 分别于时刻 0，1，2，3 进入进程就绪队列，其 CPU 执行时间分别为 5，3，6，4 个时间单位。则采用短进程优先调度算法时，四进程平均周转时间是________。',
    answer: '9.25',
    explanation: '非抢占 SPF：P1 于 0 到达立即运行 0～5；5 时刻就绪的 P2(3)、P3(6)、P4(4) 中选最短的 P2，运行 5～8；8 时刻选 P4，运行 8～12；最后 P3 运行 12～18。完成时间 5/8/18/12，周转时间 = 完成时刻 − 到达时刻：P1 5−0=5、P2 8−1=7、P4 12−3=9、P3 18−2=16，平均 = (5+7+9+16)/4 = 9.25 个时间单位。',
    tags: [{ deck: 3, sec: 'sec-ch3-algo-h2', text: '短进程优先调度' }],
  },
  {
    id: 'p4-f5',
    kind: 'fill',
    question: '将逻辑文件映射为物理文件，需要通过________进行。',
    answer: '文件目录',
    explanation: '逻辑文件与物理文件之间的映射由文件目录完成。',
    tags: [{ deck: 6, sec: 'sec-ch6-logic-h1', text: '逻辑文件与物理文件' }],
  },

  // ---------- 二、判断题（5 分，每题 1 分） ----------
  {
    id: 'p4-j1',
    kind: 'judge',
    question: '比之批处理操作系统，分时系统的交互能力更强。',
    options: ['对', '错'],
    answer: '对',
    explanation: '交互性是分时系统区别于批处理系统的基本特点之一（用户与计算机之间可进行「会话」，批处理无交互能力）。',
    tags: [{ deck: 1, sec: 'sec-ch1-history-h3', text: '分时操作系统' }],
  },
  {
    id: 'p4-j2',
    kind: 'judge',
    question: '在按时间片轮转的系统中，时间片未用完不会发生进程调度。',
    options: ['对', '错'],
    answer: '错',
    explanation: '时间片未用完也可能发生调度：进程在时间片内阻塞（等待 I/O）时会让出处理机转去等待队列；采用抢占式策略时更高优先级进程到达也会触发调度。',
    tags: [{ deck: 3, sec: 'sec-ch3-algo-h5', text: '时间片轮转调度' }],
  },
  {
    id: 'p4-j3',
    kind: 'judge',
    question: '系统只要进入不安全状态就会进入死锁状态。',
    options: ['对', '错'],
    answer: '错',
    explanation: '安全状态不会死锁；不安全状态<strong>可能</strong>死锁——不安全是死锁的必要条件而非充分条件。',
    tags: [{ deck: 3, sec: 'sec-ch3-avoid-h1', text: '安全状态与不安全状态' }],
  },
  {
    id: 'p4-j4',
    kind: 'judge',
    question: '进程的工作集是操作系统为进程分配的内存页框的集合。',
    options: ['对', '错'],
    answer: '错',
    explanation: '进程的工作集是进程在某段时间内实际访问的、驻留在物理内存中的<strong>虚拟页面的子集</strong>，是程序局部性的体现，并不等同于操作系统为它分配的页框集合。',
    tags: [{ deck: 4, sec: 'sec-ch4-demand-h2', text: '工作集' }],
  },
  {
    id: 'p4-j5',
    kind: 'judge',
    question: '为提高应用程序访问内核的速度，系统调用是通过普通程序转移指令，如 CALL 指令等来进行的。',
    options: ['对', '错'],
    answer: '错',
    explanation: '系统调用由特殊的访管/陷入指令（如 INT）触发，将系统转入管态；CALL 等普通转移指令不改变 CPU 状态，不能进入内核。',
    tags: [{ deck: 7, sec: 'sec-ch7-syscall-h2', text: '系统调用特点' }],
  },

  // ---------- 三、选择题（30 分，每题 2 分） ----------
  {
    id: 'p4-s1',
    kind: 'single',
    question: '下列的进程状态变化中，（　）的变化是不可能发生的。',
    options: ['就绪 → 执行', '执行 → 阻塞', '阻塞 → 执行', '阻塞 → 就绪'],
    answer: 'C',
    explanation: '阻塞进程须先经「事件发生 → 就绪」再由调度程序调度才能执行，不存在「阻塞 → 执行」的直接转换。',
    tags: [{ deck: 2, sec: 'sec-ch2-concept-h4', text: '进程的基本状态' }],
  },
  {
    id: 'p4-s2',
    kind: 'single',
    question: '正在运行的应用程序执行软中断指令，操作系统响应该中断并执行相应的系统调用程序，在这个过程中，CPU 的状态变化为（　）。',
    options: ['系统态转变为用户态', '用户态转变为系统态', '保持在系统态', '保持在用户态'],
    answer: 'B',
    explanation: '系统调用（软中断/陷入指令）把 CPU 从用户态（目态）切换到系统态（管态），处理完毕后再返回用户态。',
    tags: [{ deck: 7, sec: 'sec-ch7-syscall-h2', text: '系统调用特点' }],
  },
  {
    id: 'p4-s3',
    kind: 'single',
    question: '用 wakeup 操作唤醒一个等待进程时，被唤醒进程的状态应变成（　）。',
    options: ['阻塞', '就绪', '执行', '挂起'],
    answer: 'B',
    explanation: 'wakeup 原语把等待（阻塞）进程移入就绪队列，状态变为就绪；是否立即运行由调度程序决定。',
    tags: [{ deck: 2, sec: 'sec-ch2-control', text: '进程的阻塞与唤醒' }],
  },
  {
    id: 'p4-s4',
    kind: 'single',
    question: '使用 wait/signal 原语管理 n（n&gt;10）个进程共享临界资源，并为之设置一互斥信号量 S。如果系统运行一段时间后，S.value 的值为 −6，则下列说法正确的是（　）。',
    options: [
      '有 6 个进程因请求该临界资源得不到而处于阻塞状态',
      '当时有 6 个进程正在使用该临界资源',
      '有 n−6 个进程因请求该临界资源得不到而处于阻塞状态',
      '当时有 n−6 个进程正在使用该临界资源',
    ],
    answer: 'A',
    explanation: 'S.value &lt; 0 时其绝对值即为阻塞在该信号量上的进程数量——|−6| = 6 个进程处于阻塞状态。',
    tags: [{ deck: 2, sec: 'sec-ch2-sync-h4', text: '记录型信号量' }],
  },
  {
    id: 'p4-s5',
    kind: 'single',
    question: '分时系统中，常用的进程调度算法为（　）。',
    options: ['先来先服务', '高优先权优先算法', '时间片轮转', '短进程优先'],
    answer: 'C',
    explanation: '分时系统按时间片轮流响应各终端用户，常用时间片轮转（RR）调度。',
    tags: [{ deck: 3, sec: 'sec-ch3-algo-h5', text: '时间片轮转调度' }],
  },
  {
    id: 'p4-s6',
    kind: 'single',
    question: '下面的调度算法中，（　）综合考虑了作业/进程的执行时间和等待时间。',
    options: ['高响应比优先', '先来先服务', '短作业/进程优先', '时间片轮转调度算法'],
    answer: 'A',
    explanation: '响应比 Rp =（等待时间 + 要求服务时间）/ 要求服务时间，同时考虑等待与执行时间——等待越久优先越高，兼顾短作业与先来先服务。',
    tags: [{ deck: 3, sec: 'sec-ch3-algo-h4', text: '高响应比优先调度' }],
  },
  {
    id: 'p4-s7',
    kind: 'single',
    question: '在多进程并发的环境中，可以通过分时的方法在单个物理 CPU 上运行多个进程，在一段时间内，宏观上每个进程都在执行，好像每个进程都拥有一个 CPU 一样，此即操作系统中广泛使用的所谓（　）技术。',
    options: ['SPOOLing', '虚拟', '虚拟存储器', '对换'],
    answer: 'B',
    explanation: '这是虚拟处理机技术——通过并发/分时把一个物理 CPU 虚拟为多台逻辑上的 CPU，属于 OS 的「虚拟」特征。',
    tags: [{ deck: 1, sec: 'sec-ch1-feature', text: '虚拟' }],
  },
  {
    id: 'p4-s8',
    kind: 'single',
    question: '下列（　）存储管理方式中，进程在内存中可占据不连续的存储空间。',
    options: ['固定分区', '动态分区', '分页系统', '单一连续分配系统'],
    answer: 'C',
    explanation: '分页（离散分配）把进程的页离散装入内存中多个不相邻的页框；固定分区、动态分区、单一连续分配都要求连续的存储空间。',
    tags: [{ deck: 4, sec: 'sec-ch4-paging-h1', text: '基本分页设计思想' }],
  },
  {
    id: 'p4-s9',
    kind: 'single',
    question: '动态分区分配中采用的紧凑技术可以（　）。',
    options: ['合并空白区', '增加主存容量', '缩减访问主存的时间', '加速地址重定位'],
    answer: 'A',
    explanation: '紧凑（拼接）通过移动已分配分区把分散的小空闲区合并成一个大的空白区，以解决外零头问题；主存容量不变，地址重定位由动态重定位机制完成。',
    tags: [{ deck: 4, sec: 'sec-ch4-contig-h4', text: '可重定位分区分配' }],
  },
  {
    id: 'p4-s10',
    kind: 'single',
    question: '程序在执行中发生了一段中断，经操作系统处理后，应让其执行（　）指令。',
    options: ['被中断指令的前一条指令', '被中断指令的后一条指令', '被中断的指令', '其它作业/进程的某条指令'],
    answer: 'C',
    explanation: '如缺页中断处理完成后，须返回重新执行被中断的指令（该指令尚未完成访存）；这是 OS 中断处理区别于一般过程调用的关键。',
    tags: [{ deck: 4, sec: 'sec-ch4-demand-h1', text: '缺页中断机制' }],
  },
  {
    id: 'p4-s11',
    kind: 'single',
    question: '对于采用紧凑技术的动态分区分配存储管理方案，说法错误的是（　）。',
    options: [
      '作业的大小与其所占放的分区大小相同',
      '分区的大小和位置可变，而数目固定',
      '系统初始化后，仅存在一个大的空闲分区',
      '需要使用动态重定位技术',
    ],
    answer: 'B',
    explanation: '动态分区随作业的建立与撤销不断划分与回收，分区的大小、位置、数目都可变——「数目固定」错误；A、C、D 均为动态分区（含紧凑）的正确描述。',
    tags: [{ deck: 4, sec: 'sec-ch4-contig-h3', text: '动态分区分配' }],
  },
  {
    id: 'p4-s12',
    kind: 'single',
    question: '下面文件的外存分配方式中，（　）分到的物理块要求是连续的。',
    options: ['连续分配', '隐式链接分配', '索引分配', '显式链接分配'],
    answer: 'A',
    explanation: '连续分配要求为文件分配一组相邻接的磁盘块；链接与索引分配都是离散分配。',
    tags: [{ deck: 6, sec: 'sec-ch6-alloc-h1', text: '连续分配' }],
  },
  {
    id: 'p4-s13',
    kind: 'single',
    question: '有关多任务操作系统中系统调用的说法正确的是（　）。',
    options: [
      '实现系统调用的完整过程仅限于用户程序，和操作系统无关',
      '实现系统调用的完整过程仅限于操作系统，和用户程序无关',
      '系统调用和子程序调用一样允许嵌套调用',
      '系统调用的发出通常由转移指令如 JZ、CALL 等实现',
    ],
    answer: 'C',
    explanation: '系统调用过程需要用户程序（发出访管指令、传参数）与操作系统（陷入处理、执行服务例程）配合，A、B 均片面；发出系统调用的是访管指令而非 JZ/CALL 等普通转移指令（D 错）；C 正确——系统调用与子程序调用一样允许嵌套。',
    tags: [{ deck: 7, sec: 'sec-ch7-syscall-h2', text: '系统调用特点' }],
  },
  {
    id: 'p4-s14',
    kind: 'single',
    question: '有关成组链接法的说法错误的是（　）。',
    options: [
      '其实质是采用栈的思想来分配和回收空闲盘块',
      '由于必需用若干磁盘块来存放空闲盘块信息，因此存储空间的浪费严重',
      '由于空闲盘块的分配和回收大部分在内存中完成，因此 I/O 量小，效率高',
      '为空闲盘块分组时，每组里所放的空闲盘块信息在分配和回收过程中可能改变',
    ],
    answer: 'B',
    explanation: '成组链接法把空闲块号成组存放于空闲块自身之中，<strong>不需要额外的磁盘块</strong>专门存放管理信息——存储空间浪费少的正是它的优点（B 错误）；A、C、D 都是它的正确特点。',
    tags: [{ deck: 6, sec: 'sec-ch6-space', text: '成组链接法' }],
  },
  {
    id: 'p4-s15',
    kind: 'single',
    question: '在相同的 Intel x86 平台上，Windows 下的装入模块 .exe 文件通常无法在 UNIX 下运行，造成这个现象的主要原因在于（　）。',
    options: [
      'Windows 和 Unix 下的装入模块使用的处理器指令集不同',
      'Windows 和 Unix 的逻辑地址结构不同',
      'Windows 和 Unix 下装入模块调用的系统调用接口不一样',
      'Windows 和 Unix 下发出系统系统调用的指令不同',
    ],
    answer: 'C',
    explanation: '同一 x86 平台指令集相同、逻辑地址结构一致；exe 无法在 UNIX 运行的主因是其调用的系统调用接口（Windows API）在 UNIX 中不存在/不一样。',
    tags: [{ deck: 7, sec: 'sec-ch7-syscall', text: '程序接口：系统调用' }],
  },

  // ---------- 四、简答题（25 分，每题 5 分） ----------
  {
    id: 'p4-e1',
    kind: 'essay',
    question: '试比较进程和线程的区别和联系。',
    answer: `
      <p><strong>联系</strong>：线程是进程中的一个轻型运行实体（有时称轻量级进程），是 CPU 调度和分派的基本单位；同一进程内的线程共享进程的资源；进程与线程都可并发执行，线程也有就绪、阻塞、执行等状态与 TCB。</p>
      <p><strong>区别</strong>：</p>
      <ul>
        <li><strong>资源分配</strong>：进程是拥有资源的独立单位（虚拟地址空间、进程映像、文件、I/O 设备等）；线程不拥有系统资源，只保留 TCB、寄存器状态、堆栈等运行必需的少量数据，共享所属进程的资源；</li>
        <li><strong>调度</strong>：在引入线程的系统中，线程是调度和分派的基本单位，进程只作为资源拥有单位；</li>
        <li><strong>切换与通信开销</strong>：同一进程内的线程切换不调用内核、花费时间少，线程间通信无须调用内核，创建/撤消线程的开销也小；进程切换需要内核介入，开销大；</li>
        <li><strong>并发性</strong>：线程更适合多处理机系统——核心可以同时调度同一进程的多个线程。</li>
      </ul>
    `,
    explanation: '答题要点：从资源拥有、调度单位、切换开销、并发度四个维度对比。',
    tags: [{ deck: 2, sec: 'sec-ch2-thread-h1', text: '线程的基本概念' }],
  },
  {
    id: 'p4-e2',
    kind: 'essay',
    question: '请简单解释进程调度的多级反馈队列调度算法。',
    answer: `
      <p>设置多个就绪队列，第 1 队列优先级最高、时间片最小，其余队列优先权逐个降低、时间片逐个增大。新进程先放入第 1 队列末尾按 FCFS 等待调度：能在当前队列时间片内完成则结束；未完成则降入下一队列末尾，如此逐级下放，长进程最终在第 n 队列按时间片轮转方式运行。调度时仅当第 1～(i−1) 队列均空才调度第 i 队列；若处理机正在第 i 队列服务时有新进程进入较高优先级队列，则新进程抢占处理机（原进程放回原队列末尾）。</p>
      <p><strong>特点</strong>：避免了事先计算进程执行时间；终端型、短批处理作业可在前几个队列的短时间片内完成而获得快响应；长批处理作业虽逐级下放，但最终仍能按轮转方式得到处理，不会长期得不到服务。</p>
    `,
    explanation: '答题要点：队列设置与优先级/时间片关系、降级规则、抢占规则、对三类用户的适应性。',
    tags: [{ deck: 3, sec: 'sec-ch3-algo-h6', text: '多级反馈队列调度' }],
  },
  {
    id: 'p4-e3',
    kind: 'essay',
    question: '简要解释程序运行的局部性原理。',
    answer: `
      <p>局部性原理 [Denning P. 1968]：在一段时间内，一个程序的执行往往呈现出高度的局部性，表现在时间与空间两方面。</p>
      <ul>
        <li><strong>时间局部性</strong>：一条指令被执行了，则在不久的将来它可能再被执行；在一段时间内，访问的代码范围是有限的；</li>
        <li><strong>空间局部性</strong>：若某一存储单元被使用，在一定时间内，与该存储单元相邻的单元可能被使用。</li>
      </ul>
      <p>局部性原理是虚拟存储器可行性的理论基础——它说明程序不必一次全部装入内存即可运行（工作集稳定、缺页率有限）。</p>
    `,
    explanation: '答题要点：时间局部性与空间局部性两条 + 对虚拟存储的启示。',
    tags: [{ deck: 4, sec: 'sec-ch4-vm', text: '局部性原理' }],
  },
  {
    id: 'p4-e4',
    kind: 'essay',
    question: '请简要解释什么是设备独立性。',
    answer: `
      <p><strong>设备独立性</strong>：用户程序独立于具体使用的物理设备。实现上采用虚拟技术——引入<strong>逻辑设备</strong>（对一组具备相同功能物理设备的抽象）与<strong>物理设备</strong>（应用程序实际执行时使用的特定类型设备）；编写程序时使用逻辑设备名称访问设备，程序执行时通过逻辑设备表（LUT）完成逻辑设备到物理设备的映射，使用具体的物理设备完成实际数据操作。</p>
      <p><strong>优点</strong>：设备分配时的灵活性（某台设备忙时可换同类其他设备）；易于实现 I/O 重定向（更换设备而不必修改应用程序）。</p>
    `,
    explanation: '答题要点：定义 + 逻辑/物理设备 + LUT 映射，可补充两个优点。',
    tags: [{ deck: 5, sec: 'sec-ch5-alloc-h2', text: '设备独立性' }],
  },
  {
    id: 'p4-e5',
    kind: 'essay',
    question: '请简要解释 UNIX 混合索引分配的设计思想。',
    answer: `
      <p>UNIX System V 的混合索引分配在索引结点（i_node）中混合使用<strong>直接磁盘块号与各级间接索引表</strong>：直接地址 10 个（i.addr(0)～i.addr(9)）直接存放小文件的磁盘块号；一次间接地址指向一个存满磁盘块号的间接块；二次、三次间接地址再逐级扩展。假设磁盘块 4KB、块号 4 字节（每块可存 1K 个块号）：直接地址支持 10×4K = 40K；一次间接 +4M；二次间接 +4G；三次间接 +4T。</p>
      <p><strong>目的</strong>：既支持小文件的快速存取（直接地址），又能支持超大文件；在降低索引表存储开销的同时支持大中小各类文件。</p>
    `,
    explanation: '答题要点：i_node 的直接地址 + 一/二/三次间接地址结构与各级支持的文件尺寸。',
    tags: [{ deck: 6, sec: 'sec-ch6-alloc-h3', text: '混合索引分配' }],
  },

  // ---------- 五、计算/算法题（20 分） ----------
  {
    id: 'p4-e6',
    kind: 'essay',
    question: `某采用银行家算法控制资源分配的系统，包含 5 进程（P0～P4）和 4 种资源（A-D），假设在 T0 时刻资源的分配情况如下表所示，请回答下列问题：
      <table class="tbl">
        <thead><tr><th></th><th>Allocation (A B C D)</th><th>Need (A B C D)</th><th>Available (A B C D)</th></tr></thead>
        <tbody>
          <tr><td>P0</td><td>1 0 0 1</td><td>0 2 1 0</td><td>1 1 2 1</td></tr>
          <tr><td>P1</td><td>0 1 0 0</td><td>1 0 0 2</td><td></td></tr>
          <tr><td>P2</td><td>0 0 0 2</td><td>1 0 1 1</td><td></td></tr>
          <tr><td>P3</td><td>0 0 1 0</td><td>2 1 0 1</td><td></td></tr>
          <tr><td>P4</td><td>0 0 0 1</td><td>0 1 3 0</td><td></td></tr>
        </tbody>
      </table>
      (1) T0 时刻是否为安全状态？(2) 如果进程 P0 提出请求向量为 Request₀(0,1,1,0)，系统能否将资源分配给它？注：请写出推导过程。`,
    answer: `
      <p><strong>(1) T0 时刻安全性检查</strong>（Work 初值 = 1,1,2,1）：</p>
      <ul>
        <li>P2：Need(1,0,1,1) ≤ Work ✓ → Work = Work + Allocation(0,0,0,2) = (1,1,2,3)；</li>
        <li>P1：Need(1,0,0,2) ≤ Work ✓ → Work = (1,2,2,3)；</li>
        <li>P0：Need(0,2,1,0) ≤ Work ✓ → Work = (2,2,2,4)；</li>
        <li>P3：Need(2,1,0,1) ≤ Work ✓ → Work = (2,2,3,4)；</li>
        <li>P4：Need(0,1,3,0) ≤ Work ✓ → Work = (2,2,3,5)。</li>
      </ul>
      <p>Finish 全为 true，存在安全序列 ⟨P2, P1, P0, P3, P4⟩，T0 时刻为<strong>安全状态</strong>。</p>
      <p><strong>(2) P0 请求 Request₀(0,1,1,0)</strong>：① Request₀(0,1,1,0) ≤ Need₀(0,2,1,0) ✓；② Request₀ ≤ Available(1,1,2,1) ✓；③ 试分配：Available = (1,0,1,1)，Allocation₀ = (1,1,1,1)，Need₀ = (0,1,0,0)；④ 安全性检查：Work=(1,0,1,1) → 只有 P2（Need 1,0,1,1）可推进 → Work=(1,0,1,3)；P1（Need 1,0,0,2）→ Work=(1,1,1,3)；P0（Need 0,1,0,0）→ Work=(1,1,1,3)+Allocation₀(1,1,1,1)=(2,2,2,4)；P3（Need 2,1,0,1）→ Work=(2,2,3,4)；P4（Need 0,1,3,0）中 C 类 3 ≤ 3 → Work=(2,2,3,5)——Finish 全为 true，仍存在安全序列 ⟨P2, P1, P0, P3, P4⟩，系统处于<strong>安全状态</strong>。所以系统<strong>可以</strong>将资源分配给 P0：正式执行试分配的结果。</p>
    `,
    explanation: '评分要点：安全性算法的 Work 推进过程、银行家算法五步检查；本例的考点在试分配后 P0 的 Allocation 已更新为 (1,1,1,1)——安全性检查须按试分配后的新状态推进，结论为仍安全、可以分配。',
    tags: [{ deck: 3, sec: 'sec-ch3-avoid-h2', text: '银行家算法' }, { deck: 8, sec: 'sec-ch8-banker', text: '银行家算法' }],
  },
  {
    id: 'p4-e7',
    kind: 'essay',
    question: '解释经典的读者-写者问题，请使用记录型信号量写出相应的并发程序。',
    answer: `
      <p><strong>问题描述</strong>：多个读者、多个写者共享资源（例如文件、数据等）——允许多个读者同时访问资源，写者写时不允许其他进程读或写（写者与所有读者/写者互斥访问资源）。</p>
      <p><strong>分析</strong>：读者进程读-读允许（不控制）；写者进程写-读、写-写互斥。用 readcount 记录正在读的读者数（rmutex 保护 readcount），第一个读者为读者群体拿文件锁 wmutex，最后一个读者释放。</p>
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
    `,
    explanation: '评分要点：问题描述（读-读允许、写互斥）+ 标准程序；标准程序的两个讨论点（wait/signal 的执行者、临界区设置）可作加分。',
    tags: [{ deck: 2, sec: 'sec-ch2-classic-h2', text: '读者-写者问题' }, { deck: 8, sec: 'sec-ch8-sync', text: '进程的同步与互斥' }],
  },

  // ---------- 六、问答题（10 分） ----------
  {
    id: 'p4-e8',
    kind: 'essay',
    question: '请简要解释什么是虚拟存储器，并给出两种典型虚拟存储器的设计方案。',
    answer: `
      <p><strong>虚拟存储器</strong>：指具有<strong>请求调入功能和置换功能</strong>，能从<strong>逻辑上对内存容量加以扩充</strong>的一种存储器系统。其逻辑容量由内存容量和外存容量之和所决定，运行速度接近于内存速度，而每位的成本接近于外存。特征：多次性、对换性、虚拟性。</p>
      <p><strong>两种典型设计方案</strong>：</p>
      <ul>
        <li><strong>分页请求系统（页式虚拟存储器，请求分页系统）</strong>：在基本分页系统基础上，增加以页面为单位的请求调入和自动置换功能——扩充页表项（状态位 P、访问字段 A、修改位 M、外存地址），配合缺页中断机制与页面置换算法（OPT、FIFO、LRU、Clock）；</li>
        <li><strong>请求分段系统（段式虚拟存储器，分段请求系统）</strong>：在基本分段系统基础上，增加以分段为单位的请求调入和自动置换功能——段表增加存在位、访问字段、修改位、增补位与外存地址，配合缺段中断机制与分段共享保护。</li>
      </ul>
      <p>（此外还有段页式虚拟存储器：在段页式系统基础上增加以分页为单位的请求调入和自动置换功能。）</p>
    `,
    explanation: '答题要点：定义（请求调入 + 置换 + 逻辑扩充）+ 页式/段式两种典型方案（可加段页式）。',
    tags: [
      { deck: 4, sec: 'sec-ch4-vm', text: '虚拟存储器的概念与实现' },
      { deck: 4, sec: 'sec-ch4-dsegment', text: '请求分段' },
    ],
  },
];

const paper: OsPaper = {
  id: 'b-2021',
  title: '2021-2022 学年第一学期 · 试卷 B（课程代码 0509112B）',
  source: '原卷扫描件转录（共 2 面）',
  answerSource: '本站整理',
  sections: [
    { title: '一、填空题（10 分，每空 2 分）', questionIds: ['p4-f1', 'p4-f2', 'p4-f3', 'p4-f4', 'p4-f5'] },
    { title: '二、判断题（5 分，每题 1 分）', questionIds: ['p4-j1', 'p4-j2', 'p4-j3', 'p4-j4', 'p4-j5'] },
    { title: '三、选择题（30 分，每题 2 分）', questionIds: ['p4-s1', 'p4-s2', 'p4-s3', 'p4-s4', 'p4-s5', 'p4-s6', 'p4-s7', 'p4-s8', 'p4-s9', 'p4-s10', 'p4-s11', 'p4-s12', 'p4-s13', 'p4-s14', 'p4-s15'] },
    { title: '四、简答题（25 分，每题 5 分）', questionIds: ['p4-e1', 'p4-e2', 'p4-e3', 'p4-e4', 'p4-e5'] },
    { title: '五、计算/算法题（20 分）', questionIds: ['p4-e6', 'p4-e7'] },
    { title: '六、问答题（10 分）', questionIds: ['p4-e8'] },
  ],
  questions: qs,
};

export default paper;
