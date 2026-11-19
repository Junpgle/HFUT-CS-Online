/* 试卷 2：2022 年合肥工业大学计算机科学与技术专业《操作系统》科目期末试卷 B（有答案）。
 * 来源：试题/2022年合肥工业大学计算机科学与技术专业《操作系统》科目期末试卷B(有答案).docx，题目与答案按原卷转录。 */
import type { OsPaper, OsQuestion } from './types';

const qs: OsQuestion[] = [
  // ---------- 一、选择题（原卷 1～12） ----------
  {
    id: 'p2-s1',
    kind: 'single',
    question: '下面关于目录检索的论述中，正确的是（　）。',
    options: [
      '由于散列法具有较快的检索速度，因此现代操作系统中都用它来替代传统的顺序检索方法',
      '在利用顺序检索法时，对树形目录应采用文件的路径名，应从根目录开始逐级检索',
      '在利用顺序检索法时，只要路径名的一个分量名未找到，便应停止查找',
      '在顺序检索法的查找完成后，即可得到文件的物理地址',
    ],
    answer: 'C',
    explanation: '线性检索法分解路径名成各组成部分后依次查找各目录名、文件名；只要路径名的一个分量名未找到，就说明该路径不存在，应停止查找。散列法并未全面取代顺序检索；顺序检索法相对路径检索时不必从根开始；检索完成后得到的是索引结点编号/目录项信息，物理地址还要由索引结点等给出。',
    tags: [{ deck: 6, sec: 'sec-ch6-dir-h3', text: '目录查询技术' }],
  },
  {
    id: 'p2-s2',
    kind: 'single',
    question: '若文件 f1 的硬链接为 f2，两个进程分别打开 f1 和 f2，获得对应的文件描述符为 fd1 和 fd2，则下列叙述中，正确的是（　）。Ⅰ. f1 和 f2 的读写指针位置保持相同　Ⅱ. f1 和 f2 共享同一个内存索引结点　Ⅲ. fd1 和 fd2 分别指向各自的用户打开文件表中的一项',
    options: ['仅 Ⅱ', '仅 Ⅱ、Ⅲ', '仅 Ⅰ、Ⅱ', 'Ⅰ、Ⅱ 和 Ⅲ'],
    answer: 'B',
    explanation: '硬链接的 f1、f2 指向同一索引结点（Ⅱ 对）；两个进程各自打开文件，用户打开文件表中各有自己的表项（Ⅲ 对）；读写指针属于打开文件表中的文件表项，两个进程独立打开后各自维护读写指针，位置不保持相同（Ⅰ 错）。',
    tags: [{ deck: 6, sec: 'sec-ch6-share', text: '基于索引结点的共享' }],
  },
  {
    id: 'p2-s3',
    kind: 'single',
    question: '作业 8：00 到达系统，估计运行时间为 1h。若从 10：00 开始执行该作业，其响应比为（　）。',
    options: ['2', '1', '3', '0.5'],
    answer: 'C',
    explanation: '响应比 Rp =（等待时间 + 要求服务时间）/ 要求服务时间 =（2 + 1）/ 1 = 3。',
    tags: [{ deck: 3, sec: 'sec-ch3-algo-h4', text: '高响应比优先调度' }],
  },
  {
    id: 'p2-s4',
    kind: 'single',
    question: '一个进程被唤醒意味着（　）。',
    options: ['该进程可以重新占用 CPU', '优先级变为最大', 'PCB 移到就绪队列之首', '进程变为运行态'],
    answer: 'A',
    explanation: 'wakeup 把进程从阻塞状态改为就绪状态、插入就绪队列等待调度——意味着它「具备了重新占用 CPU 的条件」，并非立即运行，也不是优先级最大或一定排在队首。',
    tags: [{ deck: 2, sec: 'sec-ch2-control', text: '进程的阻塞与唤醒' }],
  },
  {
    id: 'p2-s5',
    kind: 'single',
    question: '现有 3 个同时到达的作业 J1，J2，J3，它们的执行时间分别是 T1，T2 和 T3，且 T1 &lt; T2 &lt; T3。若系统按单道方式运行且采用短作业优先调度算法，则平均周转时间是（　）。',
    options: ['T1+T2+T3', '(T1+T2+T3)/3', '(3T1+2T2+T3)/3', '(T1+2T2+3T3)/3'],
    answer: 'C',
    explanation: 'SJF 按 J1→J2→J3 运行，完成时间分别为 T1、T1+T2、T1+T2+T3，周转时间之和 = 3T1 + 2T2 + T3，平均周转时间 = (3T1+2T2+T3)/3。',
    tags: [{ deck: 3, sec: 'sec-ch3-algo-h2', text: '短作业优先调度' }, { deck: 8, sec: 'sec-ch8-sched', text: '处理机调度算法' }],
  },
  {
    id: 'p2-s6',
    kind: 'single',
    question: '下列存储管理方式中，会产生内部碎片的是（　）。Ⅰ. 请求分段存储管理　Ⅱ. 请求分页存储管理　Ⅲ. 段页式分区管理　Ⅳ. 固定式分区管理',
    options: ['Ⅰ、Ⅱ、Ⅲ', 'Ⅲ、Ⅳ', '只有 Ⅱ', 'Ⅱ、Ⅲ、Ⅳ'],
    answer: 'D',
    explanation: '分页类管理以固定大小的页/块分配，最后一页装不满产生内零头——请求分页（Ⅱ）、段页式（Ⅲ）、固定分区（Ⅳ）都有内部碎片；请求分段（Ⅰ）按段长分配，产生的是外部碎片。',
    tags: [
      { deck: 4, sec: 'sec-ch4-contig-h2', text: '固定分区分配' },
      { deck: 4, sec: 'sec-ch4-paging', text: '基本分页' },
    ],
  },
  {
    id: 'p2-s7',
    kind: 'single',
    question: '在虚拟页式存储管理方案中，（　）完成将页面调入内存的工作。',
    options: ['缺页中断处理', '页面淘汰过程', '工作集模型应用', '紧缩技术利用'],
    answer: 'A',
    explanation: '访问的页面不在内存（状态位 P=0）时硬件发出缺页中断，由缺页中断处理程序负责把该页从外存调入内存。',
    tags: [{ deck: 4, sec: 'sec-ch4-demand-h1', text: '缺页中断机制' }],
  },
  {
    id: 'p2-s8',
    kind: 'single',
    question: `假设 5 个进程 P0、P1、P2、P3、P4 共享 3 类资源 R1、R2、R3，这些资源总数分别为 18、6、22。T0 时刻的资源分配情况如下表，此时存在的一个安全序列是（　）。
      <table class="tbl">
        <thead><tr><th rowspan="2">进程</th><th colspan="3">已分配资源</th><th colspan="3">资源最大需求</th></tr>
        <tr><th>R1</th><th>R2</th><th>R3</th><th>R1</th><th>R2</th><th>R3</th></tr></thead>
        <tbody>
          <tr><td>P0</td><td>3</td><td>2</td><td>3</td><td>5</td><td>5</td><td>10</td></tr>
          <tr><td>P1</td><td>4</td><td>0</td><td>3</td><td>5</td><td>3</td><td>6</td></tr>
          <tr><td>P2</td><td>4</td><td>0</td><td>5</td><td>4</td><td>0</td><td>11</td></tr>
          <tr><td>P3</td><td>2</td><td>0</td><td>4</td><td>4</td><td>2</td><td>5</td></tr>
          <tr><td>P4</td><td>3</td><td>1</td><td>4</td><td>4</td><td>2</td><td>4</td></tr>
        </tbody>
      </table>`,
    options: ['P0, P2, P4, P1, P3', 'P1, P0, P3, P4, P2', 'P2, P1, P0, P3, P4', 'P3, P4, P2, P1, P0'],
    answer: 'D',
    explanation: '原卷答案：D。T0 时刻可用资源 = 总量 − 已分配 = (18,6,22) − (16,3,19) = (2,3,3)。按选项 D 的次序 ⟨P3, P4, P2, P1, P0⟩ 逐一验证：P3 的 Need(2,2,1) ≤ (2,3,3)，完成后可用 (4,3,7)；P4 Need(1,1,0) → (7,4,11)；P2 Need(0,0,6) → (11,4,16)；P1 Need(1,3,3) → (15,4,19)；P0 Need(2,3,7) → (18,6,22)——全部完成，为安全序列；其余选项中途即出现可用资源不足。',
    tags: [{ deck: 3, sec: 'sec-ch3-avoid-h1', text: '安全状态与安全序列' }],
  },
  {
    id: 'p2-s9',
    kind: 'single',
    question: 'OS 通常为用户提供 4 种使用接口，它们是终端命令、图标菜单、系统调用和（　）。',
    options: ['计算机高级指令', '宏命令', '类似 DOS 的批命令文件或 UNIX 的 shell 文件', '汇编语言'],
    answer: 'C',
    explanation: 'OS 接口包括命令接口（终端命令、批命令文件/shell 文件）、图形用户接口（图标菜单）与程序接口（系统调用）——第 4 种是批命令文件或 shell 文件（脱机用户接口）。',
    tags: [{ deck: 7, sec: 'sec-ch7-shell', text: 'Shell 程序接口' }],
  },
  {
    id: 'p2-s10',
    kind: 'single',
    question: 'I/O 交通管制程序的主要功能是管理（　）的状态信息。',
    options: ['设备、控制器和通道', '主存、控制器和通道', 'CPU、主存和通道', '主存、辅存和通道'],
    answer: 'A',
    explanation: 'I/O 交通管制程序（设备分配用 DCT/COCT/CHCT 表）管理设备、控制器、通道三级 I/O 资源的状态信息。',
    tags: [{ deck: 5, sec: 'sec-ch5-iosys-h1', text: 'I/O 系统的基本结构' }],
  },
  {
    id: 'p2-s11',
    kind: 'single',
    question: 'CPU 输出数据的速度远远高于打印机的速度，为解决这一矛盾，可采用（　）。',
    options: ['并行技术', '通道技术', '缓冲技术', '虚存技术'],
    answer: 'C',
    explanation: '引入缓冲可缓和 CPU 与 I/O 设备速度不匹配的矛盾（同时也减少中断频率、提高并行性）。',
    tags: [{ deck: 5, sec: 'sec-ch5-buffer-h1', text: '缓冲的引入' }],
  },
  {
    id: 'p2-s12',
    kind: 'single',
    question: '通道又称 I/O 处理器，用于实现（　）之间的信息传输。',
    options: ['内存与外设', 'CPU 与外设', '内存与外存', 'CPU 与外存'],
    answer: 'A',
    explanation: '通道是一种特殊的处理器，专门负责输入/输出，实现主存与外围设备之间的信息传输，使 CPU 从繁杂的 I/O 任务中解脱出来。',
    tags: [{ deck: 5, sec: 'sec-ch5-iosys-h1', text: 'I/O 通道' }],
  },

  // ---------- 二、填空题（原卷 13～20，按空拆分） ----------
  {
    id: 'p2-f13',
    kind: 'fill',
    question: '被中断进程的现场信息是由中断处理程序保存到________中的。',
    answer: 'PCB｜进程控制块',
    explanation: '原卷答案：PCB。中断发生时，被中断进程的现场信息（处理机状态等）保存到其 PCB 中。',
    tags: [{ deck: 2, sec: 'sec-ch2-concept-h5', text: '进程控制块 PCB' }],
  },
  {
    id: 'p2-f14-1',
    kind: 'fill',
    question: '在 UNIX 中，对磁盘空闲块采用成组连接方式，每一组的第一个空闲块中登记了下一组空闲块的________和空闲块数。',
    answer: '块号｜磁盘块号',
    explanation: '原卷答案：块号、空闲块数。本题空缺处即「块号」——下一组空闲块的首块号。',
    tags: [{ deck: 6, sec: 'sec-ch6-space', text: '成组链接法' }],
  },
  {
    id: 'p2-f14-2',
    kind: 'fill',
    question: '在 UNIX 中，对磁盘空闲块采用成组连接方式，每一组的第一个空闲块中登记了下一组空闲块的块号和________。',
    answer: '空闲块数｜空闲盘块数',
    explanation: '原卷答案：块号、空闲块数。本题空缺处即「空闲块数」。',
    tags: [{ deck: 6, sec: 'sec-ch6-space', text: '成组链接法' }],
  },
  {
    id: 'p2-f15',
    kind: 'fill',
    question: '作为资源管理器的操作系统，具有处理机管理、主存管理、________五大功能。',
    answer: '文件管理、设备管理、作业管理｜文件管理、设备管理',
    explanation: '原卷答案：文件管理、设备管理、作业管理。五大功能为处理机管理、主存（存储器）管理、文件管理、设备管理、作业管理。',
    tags: [{ deck: 1, sec: 'sec-ch1-func', text: '操作系统的主要功能' }],
  },
  {
    id: 'p2-f16-1',
    kind: 'fill',
    question: '现代计算机系统采用自成独立系统的能与主机并行工作的 I/O 结构，主存储器与外围设备之间传送信息的输入输出操作由________完成。',
    answer: '通道',
    explanation: '原卷答案：通道。通道专门负责输入/输出，与主机并行工作。',
    tags: [{ deck: 5, sec: 'sec-ch5-iosys-h1', text: 'I/O 通道' }],
  },
  {
    id: 'p2-f16-2',
    kind: 'fill',
    question: '现代计算机系统采用自成独立系统的能与主机并行工作的 I/O 结构，由于通道能独立完成输入输出操作，所以也称为________。',
    answer: '输入输出处理机',
    explanation: '原卷答案：输入输出处理机。通道又称 I/O 处理器。',
    tags: [{ deck: 5, sec: 'sec-ch5-iosys-h1', text: 'I/O 通道' }],
  },
  {
    id: 'p2-f17-1',
    kind: 'fill',
    question: '一个程序获得了一个________和一个进程控制块后，就说创建了一个进程。',
    answer: '数据块',
    explanation: '原卷答案：数据块、进程控制块。进程实体由程序段、数据段（数据块）与进程控制块组成。',
    tags: [{ deck: 2, sec: 'sec-ch2-concept-h4', text: '进程实体' }],
  },
  {
    id: 'p2-f17-2',
    kind: 'fill',
    question: '一个程序获得了一个数据块和一个________后，就说创建了一个进程。',
    answer: '进程控制块｜PCB',
    explanation: '原卷答案：数据块、进程控制块。PCB 是进程存在的唯一标志。',
    tags: [{ deck: 2, sec: 'sec-ch2-concept-h4', text: '进程实体' }],
  },
  {
    id: 'p2-f18',
    kind: 'fill',
    question: '不可中断的过程称为________。',
    answer: '原语',
    explanation: '原卷答案：原语。原语是执行期间不允许被中断的操作（原子操作）。',
    tags: [{ deck: 2, sec: 'sec-ch2-control', text: '进程控制原语' }],
  },
  {
    id: 'p2-f19',
    kind: 'fill',
    question: '把进程间用信件来交换信息的方式称为________。',
    answer: '信箱通信',
    explanation: '原卷答案：信箱通信。间接通信借助信箱（mailbox）中转信件。',
    tags: [{ deck: 2, sec: 'sec-ch2-ipc', text: '消息通信系统' }],
  },
  {
    id: 'p2-f20-1',
    kind: 'fill',
    question: '文件的目录由若干目录项组成，每个目录项中除了指出文件的名字和________存取的物理地址外，还可包含如何控制的信息。',
    answer: '文件',
    explanation: '原卷答案：文件、控制、管理。本题空缺处即「文件」——目录项指出文件名与文件存取的物理地址。',
    tags: [{ deck: 6, sec: 'sec-ch6-dir-h1', text: '文件控制块 FCB' }],
  },
  {
    id: 'p2-f20-2',
    kind: 'fill',
    question: '文件的目录由若干目录项组成，每个目录项中除了指出文件的名字和文件存取的物理地址外，还可包含如何________的信息。',
    answer: '控制',
    explanation: '原卷答案：文件、控制、管理。本题空缺处即「控制」——目录项中的存取控制信息。',
    tags: [{ deck: 6, sec: 'sec-ch6-dir-h1', text: '文件控制块 FCB' }],
  },
  {
    id: 'p2-f20-3',
    kind: 'fill',
    question: '文件的目录由若干目录项组成，每个目录项中除了指出文件的名字和文件存取的物理地址外，还可包含如何控制和文件________的信息。',
    answer: '管理',
    explanation: '原卷答案：文件、控制、管理。本题空缺处即「管理」——目录项中的文件管理信息。',
    tags: [{ deck: 6, sec: 'sec-ch6-dir-h1', text: '文件控制块 FCB' }],
  },

  // ---------- 三、判断题（原卷 21～30） ----------
  {
    id: 'p2-j1',
    kind: 'judge',
    question: '选择通道主要用于连接低速设备。',
    options: ['对', '错'],
    answer: '错',
    explanation: '原卷答案：错。选择通道面向高速块设备（如磁盘），成组连续传送、独占通道直至一批数据传送完；低速设备用字节多路通道。',
    tags: [{ deck: 5, sec: 'sec-ch5-iosys-h1', text: 'I/O 通道' }],
  },
  {
    id: 'p2-j2',
    kind: 'judge',
    question: '进程从运行状态变为等待状态是由于时间片中断发生。',
    options: ['对', '错'],
    answer: '错',
    explanation: '原卷答案：错。时间片到使进程从执行转回就绪；执行 → 等待（阻塞）是因为等待 I/O 等事件。',
    tags: [{ deck: 2, sec: 'sec-ch2-concept-h4', text: '进程的基本状态' }],
  },
  {
    id: 'p2-j3',
    kind: 'judge',
    question: '进程申请 CPU 得不到满足时，其状态变为等待态。',
    options: ['对', '错'],
    answer: '错',
    explanation: '原卷答案：错。申请 CPU 得不到满足时进程处于就绪态——万事俱备只欠处理机；等待态是等待 I/O 等事件。',
    tags: [{ deck: 2, sec: 'sec-ch2-concept-h4', text: '进程的基本状态' }],
  },
  {
    id: 'p2-j4',
    kind: 'judge',
    question: '存储保护的功能是限制内存存取。',
    options: ['对', '错'],
    answer: '对',
    explanation: '原卷答案：对。存储保护通过基址/限界寄存器或页表存取控制字段，把程序限制在操作系统指定的内存区域内运行。',
    tags: [{ deck: 4, sec: 'sec-ch4-paging-h2', text: '页表的作用' }],
  },
  {
    id: 'p2-j5',
    kind: 'judge',
    question: '进程间的互斥是一种特殊的同步关系。',
    options: ['对', '错'],
    answer: '对',
    explanation: '原卷答案：对。互斥是间接相互制约（竞争共享资源），可看作同步的一种特殊形式。',
    tags: [{ deck: 2, sec: 'sec-ch2-sync-h1', text: '进程同步的基本概念' }],
  },
  {
    id: 'p2-j6',
    kind: 'judge',
    question: '特殊文件是指其用途由用户特殊规定的文件。',
    options: ['对', '错'],
    answer: '错',
    explanation: '原卷答案：错。UNIX/Linux 把外部设备做成特殊文件与普通文件一并管理——特殊文件指设备文件，不是用户特殊规定用途的文件。',
    tags: [{ deck: 6, sec: 'sec-ch6-fs-h2', text: '文件类型' }],
  },
  {
    id: 'p2-j7',
    kind: 'judge',
    question: '通过任何手段都无法实现计算机系统资源之间的互换。',
    options: ['对', '错'],
    answer: '错',
    explanation: '原卷答案：错。虚拟技术（虚拟处理机、虚拟设备、SPOOLing 等）正是资源互换/变换的手段。',
    tags: [{ deck: 1, sec: 'sec-ch1-feature', text: '虚拟' }],
  },
  {
    id: 'p2-j8',
    kind: 'judge',
    question: '进程在运行中，可以自行修改自己的进程控制块。',
    options: ['对', '错'],
    answer: '错',
    explanation: '原卷答案：错。PCB 由内核管理，进程无权自行修改。',
    tags: [{ deck: 2, sec: 'sec-ch2-concept-h5', text: '进程控制块 PCB' }],
  },
  {
    id: 'p2-j9',
    kind: 'judge',
    question: '在大型多道程序设计系统中，为充分利用外部设备，应使运行的若干程序都是 I/O 型的。',
    options: ['对', '错'],
    answer: '对',
    explanation: '原卷答案：对。让 CPU 型与 I/O 型程序搭配才能均衡利用资源；本判题按原卷答案收录——在以充分利用外部设备为目标的前提下，让程序多为 I/O 型可提高设备利用率。',
    tags: [{ deck: 1, sec: 'sec-ch1-history-h2', text: '多道程序设计' }],
  },
  {
    id: 'p2-j10',
    kind: 'judge',
    question: '进程状态的转换是由操作系统完成的，对用户是透明的。',
    options: ['对', '错'],
    answer: '对',
    explanation: '原卷答案：对。进程状态转换由内核的调度与控制原语完成，用户感知不到其细节（透明）。',
    tags: [{ deck: 2, sec: 'sec-ch2-control', text: '进程控制' }],
  },

  // ---------- 四、名词解释题（原卷 31～36） ----------
  {
    id: 'p2-e1',
    kind: 'essay',
    question: '名词解释：临界资源。',
    answer: '<p>一次仅允许一个进程使用的资源。</p>',
    explanation: '原卷答案。答题要点：定义 + 例子（打印机等硬件资源，内存变量、指针、数组等软件资源）。',
    tags: [{ deck: 2, sec: 'sec-ch2-sync-h1', text: '临界资源' }],
  },
  {
    id: 'p2-e2',
    kind: 'essay',
    question: '名词解释：饥饿。',
    answer: '<p>在系统中，每个资源占有者都在有限时间内释放它所占有的资源，但资源中存在某些申请者由于某种原因却永远得不到资源的一种错误现象。</p>',
    explanation: '原卷答案。答题要点：资源有序释放但个别申请者永远得不到（区别于死锁的互相等待）。',
    tags: [{ deck: 3, sec: 'sec-ch3-algo-h1', text: 'FCFS 与公平' }],
  },
  {
    id: 'p2-e3',
    kind: 'essay',
    question: '名词解释：作业调度。',
    answer: '<p>作业调度的主要任务是完成作业从后备状态到执行状态和从执行状态到完成状态的转换。</p>',
    explanation: '原卷答案。答题要点：高级调度/长程调度，对象是作业。',
    tags: [{ deck: 3, sec: 'sec-ch3-concept-h1', text: '高级调度' }],
  },
  {
    id: 'p2-e4',
    kind: 'essay',
    question: '名词解释：换页。',
    answer: '<p>指系统根据某种策略选择某页出主存，将某页调入主存的过程。</p>',
    explanation: '原卷答案。答题要点：页面置换（调出 + 调入）。',
    tags: [{ deck: 4, sec: 'sec-ch4-demand-h4', text: '页面置换算法' }],
  },
  {
    id: 'p2-e5',
    kind: 'essay',
    question: '名词解释：实存。',
    answer: '<p>实存是指计算机配置的物理存储器，它直接向 CPU 提供程序和数据。</p>',
    explanation: '原卷答案。答题要点：与虚拟存储器（虚存）相对的物理内存。',
    tags: [{ deck: 4, sec: 'sec-ch4-vm', text: '虚拟存储器概念' }],
  },
  {
    id: 'p2-e6',
    kind: 'essay',
    question: '名词解释：存储设备。',
    answer: '<p>存储设备是指计算机用来存储信息的设备，如盘（硬盘和软盘）、磁带等。</p>',
    explanation: '原卷答案。答题要点：外存设备举例。',
    tags: [{ deck: 5, sec: 'sec-ch5-disk-h1', text: '磁盘工作原理' }],
  },

  // ---------- 五、简答题（原卷 37～41） ----------
  {
    id: 'p2-e7',
    kind: 'essay',
    question: '什么是操作系统？',
    answer: '<p>操作系统是计算机系统中的一个系统软件，它能有效地组织和管理计算机系统中的硬件及软件资源，合理地组织计算机工作流程，控制程序的执行，并向用户提供各种服务功能，使得用户能够灵活、方便、有效地使用计算机，并使整个计算机系统能高效地运行。</p>',
    explanation: '原卷答案。答题要点：系统软件定位 + 管理资源 + 组织流程 + 提供服务四个层次。',
    tags: [{ deck: 1, sec: 'sec-ch1-what', text: '什么是操作系统' }],
  },
  {
    id: 'p2-e8',
    kind: 'essay',
    question: '在设备管理中，按照设备共享特性分成哪几种类型比较合理，并分别举例说明。',
    answer: '<p>按照是否可共享，可以分成独占设备和共享设备两类。独占设备不能让多个程序同时使用，共享设备可以同时让多个程序使用。打印机属于独占设备，如果多个程序同时使用打印机，则打印出来的数据就可能会随机混合交叉在一起，所以打印机只能让一个程序独占；而磁盘属于共享设备，多个程序同时在磁盘上打开文件是可以的。</p>',
    explanation: '原卷答案。答题要点：独占设备（打印机）与共享设备（磁盘）两类 + 例子。',
    tags: [{ deck: 5, sec: 'sec-ch5-alloc-h1', text: '设备分配的基本概念' }],
  },
  {
    id: 'p2-e9',
    kind: 'essay',
    question: 'UNIX/Linux 文件系统的主要特点是什么？',
    answer: '<p>UNIX/Linux 文件系统的主要特点有：(1) UNIX 或 Linux 文件系统的目录组织是一个树形结构；(2) 文件本身是无结构的字符流；(3) UNIX 或 Linux 文件系统把外部设备做成特殊文件，与普通文件一并进行管理。</p>',
    explanation: '原卷答案。答题要点：树形目录 + 无结构字符流文件 + 设备即文件。',
    tags: [{ deck: 6, sec: 'sec-ch6-fs-h2', text: '文件系统' }],
  },
  {
    id: 'p2-e10',
    kind: 'essay',
    question: '试说明资源的静态分配策略能防止死锁的原因。',
    answer: '<p>资源静态分配策略要求每个进程在开始执行前申请所需的全部资源，仅在系统为之分配了所需的全部资源后该进程才开始执行。这样进程在执行过程中不再申请资源，从而破坏了死锁的四个必要条件之一「占有并等待条件（请求和保持条件）」，从而防止死锁的发生。</p>',
    explanation: '原卷答案。答题要点：一次性申请全部资源 → 破坏「请求和保持」条件。',
    tags: [{ deck: 3, sec: 'sec-ch3-prevent', text: '预防死锁' }],
  },
  {
    id: 'p2-e11',
    kind: 'essay',
    question: '简述死锁的防止与死锁的避免的区别。',
    answer: '<p>死锁的防止是系统预先确定一些资源分配策略，进程按规定申请资源，系统按预先规定的策略进行分配，从而防止死锁的发生；而死锁的避免是当进程提出资源申请时系统测试资源分配，仅当能确保系统安全时才把资源分配给进程，使系统一直处于安全状态之中，从而避免死锁。</p>',
    explanation: '原卷答案。答题要点：防止 = 事前破坏必要条件（静态规则）；避免 = 申请时动态审查安全性（银行家算法）。',
    tags: [
      { deck: 3, sec: 'sec-ch3-prevent', text: '预防死锁' },
      { deck: 3, sec: 'sec-ch3-avoid', text: '避免死锁' },
    ],
  },

  // ---------- 六、综合题（原卷 42～45） ----------
  {
    id: 'p2-e12',
    kind: 'essay',
    question: '「虚拟」体现在操作系统的各方面应用当中，请举出两个「虚拟」的例子。',
    answer: `
      <p>① 由于一台计算机配置了操作系统和其他软件，因此比一台裸机功能更强大、使用更方便，称为虚拟机。由于操作系统自身包含了若干层软件，因此该计算机系统又可称为多层虚拟机。</p>
      <p>② 如在多道分时系统中，利用多道程序设计技术可以把一台物理上的 CPU 虚拟为多台逻辑上的 CPU，而供多个终端用户使用。</p>
      <p>③ 虚拟存储器——仅把作业的一部分装入内存便可运行作业，从逻辑上对内存容量进行了扩充。又如在设备管理中虚拟设备技术的使用，可将一台物理设备变换为若干台逻辑上的对应物。</p>
    `,
    explanation: '原卷解析（给出三类例子，任答其二即可）。',
    tags: [{ deck: 1, sec: 'sec-ch1-feature', text: '虚拟' }],
  },
  {
    id: 'p2-e13',
    kind: 'essay',
    question: '某进程调度程序采用基于优先数（priority）的调度策略，即选择优先数最小的进程运行。进程创建时由用户指定一个 nice 作为静态优先数。为了动态调整优先数，引入运行时间 cpuTime 和等待时间 waitTime，初值均为 0。进程处于执行态时，cpuTime 定时加 1，waitTime 置 0；进程处于就绪态时，cpuTime 置 0，waitTime 定时加 1。请回答下列问题：(1) 若调度程序只将 nice 的值作为进程的优先数，即 priority = nice，则可能会出现饥饿现象，为什么？(2) 使用 nice、cpuTime 和 waitTime 设计一种动态优先数计算方法，以避免产生饥饿现象，并说明 waitTime 的作用。',
    answer: `
      <p><strong>(1)</strong> 由于采用了静态优先数，当就绪队列中总有优先数较小（nice 值较小）的进程时，优先数较大的进程一直没有机会运行，因而会出现饥饿现象。</p>
      <p><strong>(2)</strong> 优先数 priority 的计算公式为 <strong>priority = nice + k1·cpuTime − k2·waitTime</strong>，其中 k1 &gt; 0，k2 &gt; 0，用来分别调整 cpuTime 和 waitTime 在 priority 中所占的比例。waitTime 可使长时间等待的进程优先数减小（更优先被调度），从而避免出现饥饿现象。</p>
    `,
    explanation: '原卷解析。答题要点：静态优先数 + 队列中总有更小者优先 → 大者优先数进程永远等待；动态公式（等待越久优先数越小）。',
    tags: [{ deck: 3, sec: 'sec-ch3-algo-h3', text: '高优先权优先调度' }],
  },
  {
    id: 'p2-e14',
    kind: 'essay',
    question: '某请求分页系统的局部页面置换策略如下：系统从 0 时刻开始扫描，每隔 5 个时间单位扫描一轮驻留集（扫描时间忽略不计），本轮没有被访问过的页框将被系统回收，并放入空闲页框链尾，其中内容在下一次被分配之前不被清空。当发生缺页时，如果该页曾被使用过且还在空闲页框链表中，则重新放回进程的驻留集中；否则，从空闲页框链表头部取出一个页框。假设不考虑其他进程的影响和系统开销，初始时进程驻留集为空。目前系统空闲页框链表中页框号依次为 32、15、21、41，进程 P 依次访问的〈虚拟页号，访问时刻〉是〈1,1〉、〈3,2〉、〈0,4〉、〈0,6〉、〈1,11〉、〈0,13〉、〈2,14〉。请回答以下问题，并说明各自的理由：(1) 访问〈0,4〉时，对应的页框号是什么？(2) 访问〈1,11〉时，对应的页框号是什么？(3) 访问〈2,14〉时，对应的页框号是什么？(4) 该策略是否适合于时间局部性好的程序？',
    answer: `
      <p><strong>(1)</strong> 访问〈0,4〉时，对应的页框号为 <strong>21</strong>。因为起始驻留集为空，而 0 页对应的页框为空闲链表中的第 3 个空闲页框，其对应的页框号为 21。</p>
      <p><strong>(2)</strong> 访问〈1,11〉时，对应的页框号为 <strong>32</strong>。因为 11 &gt; 10，发生第三轮扫描，页号为 1 的页框在第二轮已经处于空闲页框链表中，此刻该页又被重新访问，因此应被重新放回到驻留集中，其页框号为 32。</p>
      <p><strong>(3)</strong> 访问〈2,14〉时，对应的页框号为 <strong>41</strong>。因为第 2 页从来没有被访问过，不在驻留集中，所以从空闲链表中取出链表头的页框，页框号为 41。</p>
      <p><strong>(4)</strong> <strong>适合</strong>。程序的时间局部性越好，则从空闲页框链表中被重新取回的机会就越大，该策略的优势越明显。</p>
    `,
    explanation: '原卷解析。答题要点：扫描周期 5、回收进链尾、缺页先查空闲链（曾被用过则取回）、否则取链头。',
    tags: [{ deck: 4, sec: 'sec-ch4-demand-h4', text: '页面置换算法' }, { deck: 8, sec: 'sec-ch8-replace', text: '页面置换算法' }],
  },
  {
    id: 'p2-e15',
    kind: 'essay',
    question: '进程 P1、P2、P3 共享一个表格 F。P1 对 F 只读不写，P2 对 F 只写不读，P3 对 F 先读后写。进程可同时读 F，但有进程写时，其他进程不能读和写。要求：1) 正常运行时不能产生死锁；2) F 的并发度要高。',
    answer: `
      <p><strong>分析</strong>：本题实际上就是一个读者-写者问题。P1 是一个读者；P2 是一个写者；为了使 F 的并发度较高，将 P3 先看作读者（读 F），当其完成读操作后再将其看作写者（写 F）。算法中需用到如下变量定义：</p>
      <pre class="code"><code>int readcount = 0;
semaphore mutex = 1;    // 保护 readcount
semaphore rmutex = 1;   // 读者群体对 F 的锁</code></pre>
      <pre class="code"><code>P1()                        // 只读
{
  while (true) {
    P(rmutex);
    if (readcount == 0) P(mutex);
    readcount++;
    V(rmutex);
    read F;
    P(rmutex);
    readcount--;
    if (readcount == 0) V(mutex);
    V(rmutex);
  }
}

P2()                        // 只写
{
  while (true) {
    P(mutex);
    write F;
    V(mutex);
  }
}

P3()                        // 先读后写
{
  while (true) {
    P(rmutex);
    if (readcount == 0) P(mutex);
    readcount++;
    V(rmutex);
    read F;
    P(rmutex);
    readcount--;
    if (readcount == 0) V(mutex);
    V(rmutex);
    P(mutex);
    write F;
    V(mutex);
  }
}</code></pre>
    `,
    explanation: '原卷解析（变量名按原卷 P/V 记法转录）。答题要点：P1、P3 读阶段归入读者群体，P3 读完再以写者身份独占；第一个读者加锁、最后一个读者解锁。',
    tags: [{ deck: 2, sec: 'sec-ch2-classic-h2', text: '读者-写者问题' }, { deck: 8, sec: 'sec-ch8-sync', text: '进程的同步与互斥' }],
  },
];

const paper: OsPaper = {
  id: 'b-2022',
  title: '2022 年 · 期末试卷 B（合肥工业大学 计算机科学与技术专业）',
  source: '原卷为 Word 文档（题目附参考答案），按原卷转录',
  answerSource: '原卷附答案',
  sections: [
    { title: '一、选择题（原卷 1～12）', questionIds: ['p2-s1', 'p2-s2', 'p2-s3', 'p2-s4', 'p2-s5', 'p2-s6', 'p2-s7', 'p2-s8', 'p2-s9', 'p2-s10', 'p2-s11', 'p2-s12'] },
    { title: '二、填空题（原卷 13～20，按空拆分）', questionIds: ['p2-f13', 'p2-f14-1', 'p2-f14-2', 'p2-f15', 'p2-f16-1', 'p2-f16-2', 'p2-f17-1', 'p2-f17-2', 'p2-f18', 'p2-f19', 'p2-f20-1', 'p2-f20-2', 'p2-f20-3'] },
    { title: '三、判断题（原卷 21～30）', questionIds: ['p2-j1', 'p2-j2', 'p2-j3', 'p2-j4', 'p2-j5', 'p2-j6', 'p2-j7', 'p2-j8', 'p2-j9', 'p2-j10'] },
    { title: '四、名词解释题（原卷 31～36）', questionIds: ['p2-e1', 'p2-e2', 'p2-e3', 'p2-e4', 'p2-e5', 'p2-e6'] },
    { title: '五、简答题（原卷 37～41）', questionIds: ['p2-e7', 'p2-e8', 'p2-e9', 'p2-e10', 'p2-e11'] },
    { title: '六、综合题（原卷 42～45）', questionIds: ['p2-e12', 'p2-e13', 'p2-e14', 'p2-e15'] },
  ],
  questions: qs,
};

export default paper;
