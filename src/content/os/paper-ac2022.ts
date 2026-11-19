/* 试卷 1：2022-2023 学年第一学期《操作系统 A/C》期末试卷 A（课程代码 0509112B）。
 * 来源：试题/期末/2022-2023学年第一学期合肥工业大学《操作系统AC》科目期末试卷A.pdf（扫描件转录）。
 * 原卷不含参考答案，答案与解析为本站依据课件内容整理。 */
import type { OsPaper, OsQuestion } from './types';

const qs: OsQuestion[] = [
  // ---------- 一、填空题（10 分，每题 2 分） ----------
  {
    id: 'p1-f1',
    kind: 'fill',
    question: `计算机系统用户在使用鼠标选择菜单方式控制计算机运行时，用的是操作系统接口中的________接口。`,
    answer: '图形用户接口｜图形用户界面接口｜GUI',
    explanation: '操作系统接口分为命令接口、图形用户接口（GUI）与程序接口三类。鼠标选择菜单属于图形用户接口（GUI）。',
    tags: [{ deck: 7, sec: 'sec-ch7-overview', text: '操作系统接口分类' }],
  },
  {
    id: 'p1-f2',
    kind: 'fill',
    question: `有 10 个进程共享同一段程序 A，每次最多允许 2 个进程进入并执行程序段 A。若设置信号量 S 追踪进入程序段 A 的进程情况，用 Wait/Signal 构造同步机制，各进程均使用代码序列 "Wait(S)；执行 A; Signal(S);" 来调用程序段 A，则各进程并发执行过程中信号量 S 的最小值是________。`,
    answer: '-8',
    explanation: 'S 初值为 2（允许 2 个进程同时进入）。S.value < 0 时其绝对值为阻塞进程数，10 个进程都申请时 S 最小 = 2 − 10 = −8。',
    tags: [{ deck: 2, sec: 'sec-ch2-sync-h4', text: '信号量机制' }],
  },
  {
    id: 'p1-f3',
    kind: 'fill',
    question: `动态重定位分区分配使用________技术来解决存储分配的零头（碎片）问题。`,
    answer: '紧凑｜拼接｜紧凑技术',
    explanation: '可重定位分区分配在动态分区分配的基础上引入「紧凑」机制，合并小的碎片空闲区，并配合动态地址重定位。',
    tags: [{ deck: 4, sec: 'sec-ch4-contig-h4', text: '可重定位分区分配' }],
  },
  {
    id: 'p1-f4',
    kind: 'fill',
    question: `一个文件系统采用单级索引分配方式管理存储空间。其中每个物理块（磁盘块）大小为 4KB，每个索引项（磁盘块号）为 4 个字节，则该文件系统中的文件最大为________KB。`,
    answer: '4194304',
    explanation: '一个磁盘块可存 4KB/4B = 1K 个索引项，单级索引支持的最大文件 = 1K × 4KB = 4GB = 4194304 KB。',
    tags: [{ deck: 6, sec: 'sec-ch6-alloc-h3', text: '索引分配' }],
  },
  {
    id: 'p1-f5',
    kind: 'fill',
    question: `有结构文件的最小可命名的逻辑单位是________。`,
    answer: '数据项｜字段',
    explanation: '文件的数据组成自上而下为文件 → 记录 → 数据项；数据项是有结构文件的基本单位，是数据组织中可以命名的最小逻辑单位，也称字段。',
    tags: [{ deck: 6, sec: 'sec-ch6-fs-h1', text: '文件的数据组成' }],
  },

  // ---------- 二、判断题（5 分，每题 1 分） ----------
  {
    id: 'p1-j1',
    kind: 'judge',
    question: '进程在运行中，可以自行修改自己的进程控制块。',
    options: ['对', '错'],
    answer: '错',
    explanation: 'PCB 是 OS 管理进程的数据结构，位于操作系统内核中，是进程存在的唯一标志；进程自身无权修改，其创建、修改与撤消均由内核的进程控制原语完成。',
    tags: [{ deck: 2, sec: 'sec-ch2-concept-h5', text: '进程控制块 PCB' }],
  },
  {
    id: 'p1-j2',
    kind: 'judge',
    question: '采用静态重定位，程序在运行时不需要进行逻辑地址到物理地址的转换。',
    options: ['对', '错'],
    answer: '对',
    explanation: '静态地址重定位在程序装入内存时一次性完成逻辑地址到物理地址的转换，以后不再转换，运行期间无需再做。',
    tags: [{ deck: 4, sec: 'sec-ch4-load-h2', text: '地址重定位' }],
  },
  {
    id: 'p1-j3',
    kind: 'judge',
    question: '多级反馈队列调度算法中，通常作业/进程的优先级越高分到的时间片越小。',
    options: ['对', '错'],
    answer: '对',
    explanation: '多级反馈队列中第 1 队列优先级最高、时间片最小，其余队列优先权逐个降低而时间片逐个增大——优先级越高的队列时间片越小。',
    tags: [{ deck: 3, sec: 'sec-ch3-algo-h6', text: '多级反馈队列调度' }],
  },
  {
    id: 'p1-j4',
    kind: 'judge',
    question: '在同时具有进程和线程（内核级）的系统中，线程是系统进行独立调度和执行的基本单位，而进程则是拥有资源的基本单位。',
    options: ['对', '错'],
    answer: '对',
    explanation: '引入线程时把传统进程的两个基本属性分解：进程保留「拥有资源的独立单位」属性，调度和分派的基本单位交给线程。',
    tags: [{ deck: 2, sec: 'sec-ch2-thread-h1', text: '线程的基本概念' }],
  },
  {
    id: 'p1-j5',
    kind: 'judge',
    question: '与分页系统相比，分段系统更便于实现代码和数据的共享和保护。',
    options: ['对', '错'],
    answer: '对',
    explanation: '分段是信息的逻辑单位，由程序员划分，共享保护按逻辑段整体进行，方便；分页是物理单位、按页共享且要求页对齐，共享保护不方便。',
    tags: [{ deck: 4, sec: 'sec-ch4-segment-h2', text: '分段与分页的区别' }],
  },

  // ---------- 三、选择题（30 分，每题 2 分） ----------
  {
    id: 'p1-s1',
    kind: 'single',
    question: '在下列选择中，通常（　）不是操作系统关心的主要问题。',
    options: [
      '管理计算机裸机',
      '设计、提供用户程序与计算机硬件系统的界面',
      '管理计算机系统资源',
      '控制各用户程序的执行次序',
    ],
    answer: 'D',
    explanation: 'A、B、C 恰是操作系统定义的三个要点（管理者与控制者、用户与硬件之间的接口、资源管理者）；各用户程序的执行次序由用户自己安排与提交，不是操作系统关心的主要问题。',
    tags: [{ deck: 1, sec: 'sec-ch1-what', text: '什么是操作系统' }],
  },
  {
    id: 'p1-s2',
    kind: 'single',
    question: '与宏（大）内核操作系统相比，下列特征中微内核操作系统具有的是（　）。①较好的性能　②较高的可靠性　③较高的安全性　④较强的可扩展性',
    options: ['仅②④', '仅①②④', '仅①③④', '仅②③④'],
    answer: 'D',
    explanation: '微内核提高了灵活性、可移植性、可扩充性，内核更小更稳定、可靠性高，可运行于分布式系统；但服务以用户态服务器进程配合消息传递实现，运行效率较低——即不含①较好的性能。',
    tags: [{ deck: 1, sec: 'sec-ch1-struct-h4', text: '微内核操作系统结构' }],
  },
  {
    id: 'p1-s3',
    kind: 'single',
    question: '现代操作系统可以在不同层次组织程序的并发执行，但不包括（　）。',
    options: [
      '机器指令级（机器指令之间）',
      '函数级（函数之间）',
      '程序段级（程序段之间）',
      '程序级（程序之间）',
    ],
    answer: 'A',
    explanation: '单处理机上指令只能逐条串行执行，机器指令之间不能并发；函数、程序段、程序之间都可以并发执行。',
    tags: [{ deck: 2, sec: 'sec-ch2-concept-h3', text: '程序的并发执行' }],
  },
  {
    id: 'p1-s4',
    kind: 'single',
    question: `有并发进程 PA、PB 如下：<br><pre class="code"><code>Var N:integer := 1;
Parbegin
  PA: Begin while(true) N := N+1; N := 0; end while; End
  PB: Begin while(true) Print(N); end while; End
Parend</code></pre>若 PA 和 PB 并发执行 1 次循环，则 PB 可能的打印结果是（　）。`,
    options: ['仅 1', '仅 2', '仅 1,2', '仅 1,2,0'],
    answer: 'D',
    explanation: 'PA 一次循环先做 N := N+1（N=2），再做 N := 0。PB 打印 N 的时刻若在 PA 执行前得 1；在 N+1 之后、N:=0 之前得 2；在 N:=0 之后得 0——三种结果都可能，并发执行具有不可再现性。',
    tags: [
      { deck: 2, sec: 'sec-ch2-concept-h3', text: '程序的并发执行' },
      { deck: 2, sec: 'sec-ch2-concept-h2', text: '程序的顺序执行' },
    ],
  },
  {
    id: 'p1-s5',
    kind: 'single',
    question: '分时系统中，常用的进程调度算法为（　）。',
    options: ['先来先服务调度算法', '高优先权优先（优先级）调度算法', '时间片轮转调度算法', '短进程优先调度算法'],
    answer: 'C',
    explanation: '分时系统要求在给定时间内响应所有用户的请求，采用时间片轮转（RR）调度；批处理系统才侧重 FCFS、SJF 等。',
    tags: [{ deck: 3, sec: 'sec-ch3-algo-h5', text: '时间片轮转调度' }],
  },
  {
    id: 'p1-s6',
    kind: 'single',
    question: '进程间用间接通信方式时，在调用通信原语 Send() 时必须给出（　）。',
    options: ['信件名', '信箱名', '接收者名', '发送者名'],
    answer: 'B',
    explanation: '间接通信（信箱通信）的发送原语为 Send(mailbox, msg)——必须给出信箱名；直接通信的 Send(receiver, msg) 才需要接收者标识。',
    tags: [{ deck: 2, sec: 'sec-ch2-ipc', text: '进程通信' }],
  },
  {
    id: 'p1-s7',
    kind: 'single',
    question: '下列关于进程逻辑地址（虚拟地址）空间的叙述中，错误的是（　）。',
    options: [
      '每个进程都有自己独立的逻辑地址空间',
      'C++ 语言中 new 操作符返回的是逻辑地址',
      '进程地址空间的大小由主存容量的大小决定',
      '进程对数据的存取都可以有不同的访问权限',
    ],
    answer: 'C',
    explanation: '逻辑地址空间的大小由机器指令的地址结构（地址字长）决定，不由主存容量决定——这正是虚拟存储器能从逻辑上扩充内存的前提；A、B、D 均正确。',
    tags: [{ deck: 4, sec: 'sec-ch4-load-h2', text: '逻辑地址与物理地址' }],
  },
  {
    id: 'p1-s8',
    kind: 'single',
    question: '有关于页系统中快表机构的作用，说法错误的是（　）。',
    options: [
      '提高指令执行的速度',
      '快表中存放当前常用的页面',
      '对快表可以进行并行查找以提高速度',
      '快表安置在 CPU 的内部',
    ],
    answer: 'B',
    explanation: '快表（联想存储器/TLB）暂存的是「当前正在使用的页表项」（页号 → 页框号），不是「常用的页面」本身；它设置在 CPU 内部、具有并行查找能力，能避免查页表的访存、提高地址变换与指令执行速度。',
    tags: [{ deck: 4, sec: 'sec-ch4-paging-h2', text: '基本地址变换机构' }],
  },
  {
    id: 'p1-s9',
    kind: 'single',
    question: '在分段存储管理方案中，下列说法正确的是（　）。',
    options: [
      '每段占用一块连续的存储区',
      '段与段之间逻辑地址必定不连续',
      '段与段之间逻辑地址必定连接',
      '每段是等长的',
    ],
    answer: 'A',
    explanation: '分段管理中每段是一段有意义的信息集合，装入内存时占据一块连续的存储区，段与段之间离散分布；段长不定，段间逻辑地址是二维独立编址、谈不上必定连接。',
    tags: [{ deck: 4, sec: 'sec-ch4-segment-h1', text: '分段的基本设计思想' }],
  },
  {
    id: 'p1-s10',
    kind: 'single',
    question: '最早出现页面「抖动」的内存物理块分配策略是（　）。',
    options: [
      '固定分配，局部置换',
      '固定分配，全局置换',
      '可变分配，局部置换',
      '可变分配，全局置换',
    ],
    answer: 'A',
    explanation: '固定分配局部置换在进程运行期间物理块个数不变，而进程的工作集随局部性区域变化而涨落——初始块数一旦偏少（「物理块个数难以指定」），新页面只能换出自己的页面，立即出现刚换出又要调回的抖动；可变分配策略可以按缺页率动态增减物理块，把缺页率控制在阈值内，从而缓解抖动。',
    tags: [{ deck: 4, sec: 'sec-ch4-demand-h2', text: '内存分配策略和算法' }],
  },
  {
    id: 'p1-s11',
    kind: 'single',
    question: '某请求分页系统中，进程的页面走向为 1-3-2-1-2-4-5-3-2-5-2，分配给它的存储块为 3，则用 LRU 算法进行页面置换时，缺页总次数（不包括开头 3 次）为（　）。',
    options: ['2', '3', '4', '5'],
    answer: 'C',
    explanation: 'LRU 淘汰最近最久未使用的页。前 3 次（1、3、2）为装入，其后：1 命中、2 命中；4 缺页（淘汰 3）、5 缺页（淘汰 1）、3 缺页（淘汰 2）、2 缺页（淘汰 4）、5 命中、2 命中——除开头 3 次外缺页 4 次。',
    tags: [{ deck: 4, sec: 'sec-ch4-demand-h4', text: '页面置换算法' }, { deck: 8, sec: 'sec-ch8-replace', text: '页面置换算法' }],
  },
  {
    id: 'p1-s12',
    kind: 'single',
    question: '磁盘调度中，当前磁头所在位置是 80 号磁道，当前磁头运动方向为磁道号增加的方向，系统中的磁道请求序列为 15-90-131-38-164-56-102-74-155。采用 SCAN 算法时磁头移动的序列为（　）。',
    options: [
      '80-90-102-131-155-164-56-38-15-74',
      '80-74-56-38-15-90-102-131-155-164',
      '80-74-90-102-131-155-164-56-38-15',
      '80-90-102-131-155-164-74-56-38-15',
    ],
    answer: 'D',
    explanation: 'SCAN（电梯算法）沿当前移动方向（磁道号增加）依次服务 90、102、131、155、164，到端后折返再依次服务 74、56、38、15——即 80-90-102-131-155-164-74-56-38-15。',
    tags: [{ deck: 5, sec: 'sec-ch5-disk-h2', text: '磁盘调度算法' }, { deck: 8, sec: 'sec-ch8-disk', text: '磁盘调度算法' }],
  },
  {
    id: 'p1-s13',
    kind: 'single',
    question: '一个磁盘有 2 个磁盘盘片，每个磁盘盘片正反面共有 120 个磁道（柱面），每个磁道有 64 个扇区。用位示图来记录磁盘空闲空间使用情况时，位示图尺寸为（　）字节。',
    options: ['15360', '1920', '3840', '30720'],
    answer: 'C',
    explanation: '总盘块数 = 2 盘片 × 2 面 × 120 磁道 × 64 扇区 = 30720 块；位示图每块占 1 位，30720 位 = 30720/8 = 3840 字节。',
    tags: [{ deck: 6, sec: 'sec-ch6-space', text: '位示图法' }],
  },
  {
    id: 'p1-s14',
    kind: 'single',
    question: '下面文件的物理结构中，（　）不支持记录的直接存取。',
    options: ['连续分配方式', '隐式链接分配', '显式链接（FAT）分配', '混合索引分配'],
    answer: 'B',
    explanation: '隐式链接把指向下块号的指针存放在各磁盘块内，只能沿链逐块查找，不支持直接存取；连续分配可按 Ai = i×L 定位，FAT 与索引分配可查表直接定位。',
    tags: [{ deck: 6, sec: 'sec-ch6-alloc-h2', text: '链接分配' }],
  },
  {
    id: 'p1-s15',
    kind: 'single',
    question: '执行系统调用的过程涉及下列操作，其中由操作系统完成的是（　）。①保存断点和程序状态字　②保存通用寄存器的内容　③执行系统调用服务例程　④将 CPU 模式改为内核态',
    options: ['仅①③', '仅②③', '仅②④', '仅②③④'],
    answer: 'B',
    explanation: '保存断点和程序状态字（①）与把 CPU 模式改为内核态（④）由陷入指令的硬件机制完成；陷入之后保存通用寄存器内容（②）与执行系统调用服务例程（③）由操作系统完成。',
    tags: [{ deck: 7, sec: 'sec-ch7-syscall-h3', text: '系统调用处理过程' }],
  },

  // ---------- 四、简答题（25 分，每题 5 分） ----------
  {
    id: 'p1-e1',
    kind: 'essay',
    question: '请画出进程的 3 个基本状态及其转换关系图。',
    answer: `
      <p>进程的三种基本状态：<strong>就绪状态</strong>（已获得除处理机之外的所有资源，一旦获得处理机就可以立即执行）、<strong>执行状态</strong>（已获得必要资源，正在处理机上运行）、<strong>阻塞状态</strong>（因等待 I/O 等事件而暂停，无法继续执行）。转换关系：</p>
      <ul>
        <li>就绪 → 执行：进程调度（获得处理机）；</li>
        <li>执行 → 就绪：时间片到；</li>
        <li>执行 → 阻塞：等待 I/O 等事件；</li>
        <li>阻塞 → 就绪：I/O 完成等事件发生；</li>
        <li>创建 → 就绪、执行 → 完成/撤销。</li>
      </ul>
    `,
    explanation: '画出三个状态框与五条转换弧并标注转换原因即可。注意不存在「阻塞 → 执行」与「就绪 → 阻塞」的转换。',
    tags: [{ deck: 2, sec: 'sec-ch2-concept-h4', text: '进程的三种基本状态' }],
  },
  {
    id: 'p1-e2',
    kind: 'essay',
    question: '请解释在调度中存在的优先级倒置问题以及如何解决。',
    answer: `
      <p><strong>什么是优先级倒置</strong>：高优先级进程 P<sub>H</sub> 需要的资源（如临界资源）正被低优先级进程 P<sub>L</sub> 占有，P<sub>H</sub> 只能等待；若此时中优先级进程 P<sub>M</sub> 进入就绪队列，它可抢占 P<sub>L</sub> 的处理机先运行，结果是高优先级的 P<sub>H</sub> 反而间接排在 P<sub>M</sub> 之后——调度上出现了「高优先级进程被低优先级进程拖累」的倒置现象。</p>
      <p><strong>解决方法</strong>：让占有临界资源的低优先级进程在占用期间不被中优先级进程抢占——</p>
      <ul>
        <li><strong>优先级继承</strong>：当 P<sub>L</sub> 占有的资源被 P<sub>H</sub> 申请时，把 P<sub>L</sub> 的优先级临时提升到与 P<sub>H</sub> 相同，使其尽快用完并释放资源；</li>
        <li><strong>优先级天花板（优先级封顶）</strong>：把资源的优先级设为可能使用它的最高进程优先级，进入临界区的进程一律按该优先级运行。</li>
      </ul>
    `,
    explanation: '答题要点：倒置的成因（资源占有 + 中优先级抢先）与两种对策（优先级继承 / 优先级天花板），并举火星漫步事故类的实例说明危害。',
    tags: [
      { deck: 3, sec: 'sec-ch3-algo-h3', text: '高优先权优先调度' },
      { deck: 2, sec: 'sec-ch2-sync-h1', text: '临界资源' },
    ],
  },
  {
    id: 'p1-e3',
    kind: 'essay',
    question: `某虚拟存储管理系统为请求分页存储系统，其逻辑地址结构为 32 位：位 0～13 为页内偏移量（14 位），位 14～31 为页号（18 位）。某进程 A 由 5 个页面组成，其页表如下（符号「-」表示该页不在主存）：页号 0 → 页框 6；页号 1 → 页框 1；页号 2 → -；页号 3 → -；页号 4 → 页框 2。请对逻辑地址 0x00010A2E（0x 表示十六进制）、0x00000F250 和 0x0003AF60 进行地址重定位，请计算页号及物理地址，如不成功说明为什么。`,
    answer: `
      <p><strong>0x00010A2E</strong>：页号 = 0x00010A2E &gt;&gt; 14 = 4，页内偏移 = 0x00010A2E &amp; 0x3FFF = 0x0A2E。页 4 在主存（页框 2），物理地址 = 2 × 2<sup>14</sup> + 0x0A2E = 0x20000 + 0x0A2E = <strong>0x00020A2E</strong>。</p>
      <p><strong>0x00000F250</strong>：页号 = 0x00000F250 &gt;&gt; 14 = 3。页表页 3 为「-」，该页不在主存，硬件发出<strong>缺页中断</strong>，本次地址重定位不能完成；由缺页中断处理程序把页 3 调入主存、修改页表后重新执行该指令。</p>
      <p><strong>0x0003AF60</strong>：页号 = 0x0003AF60 &gt;&gt; 14 = 14。进程只有 5 个页面（页号 0～4），页号 14 &gt; 页表长度，地址越界，硬件发出<strong>越界中断</strong>（非法访问），重定位失败。</p>
    `,
    explanation: '答题要点：三个地址分别对应「正常变换」「缺页中断」「越界中断」三种情形；注意按 14 位页内偏移拆分逻辑地址。',
    tags: [
      { deck: 4, sec: 'sec-ch4-demand-h1', text: '请求分页中的硬件支持' },
      { deck: 4, sec: 'sec-ch4-paging-h2', text: '基本地址变换机构' },
      { deck: 8, sec: 'sec-ch8-addr', text: '地址变换和求 FAT 表大小' },
    ],
  },
  {
    id: 'p1-e4',
    kind: 'essay',
    question: '简述磁盘空闲空间管理方法中成组链接法的设计思想。',
    answer: `
      <p>成组链接法（UNIX）利用<strong>链栈</strong>存储所有的空闲磁盘块号：链栈的每个结点存储一组（例如 100 个）空闲磁盘块号，其中最后一个磁盘块号指向下一组所在的磁盘块，从而把全部空闲块成组地链接起来。</p>
      <ul>
        <li><strong>磁盘初始化</strong>：内存设置空闲盘块号栈（可存储一组空闲磁盘块号，如 100 个）；读磁盘上链栈的栈顶结点到内存，以初始化空闲盘块号栈；</li>
        <li><strong>盘块分配</strong>：直接从内存空闲盘块号栈中出栈一个块号分配出去；若出栈的是栈中最后一个磁盘块号，则先把该块内记录的下一组块号调入栈中，再把这一块分配出去；</li>
        <li><strong>盘块回收</strong>：回收的块号直接入栈；若栈已满，则把栈中数据（形成一组）写出到该回收的盘块中，再清空栈并把回收的块号入栈。</li>
      </ul>
    `,
    explanation: '答题要点：链栈分组（组内块号 + 末块指向下组）、「分配/回收在内存栈中完成」与「栈满写盘、末块调下组」两个关键处理。',
    tags: [{ deck: 6, sec: 'sec-ch6-space', text: '成组链接法' }],
  },
  {
    id: 'p1-e5',
    kind: 'essay',
    question: '请解释什么是设备独立性以及如何实现设备独立性。',
    answer: `
      <p><strong>设备独立性</strong>：用户程序独立于具体使用的物理设备。</p>
      <p><strong>实现</strong>：核心是采用虚拟技术，编写应用程序时不考虑实际的物理设备——引入逻辑设备与物理设备两个概念：物理设备是应用程序实际执行时使用的特定类型设备；逻辑设备是对一组具备相同功能物理设备的抽象。基本作法：编写程序时使用逻辑设备名称访问设备，程序执行时使用具体的物理设备完成实际数据操作；程序执行时通过<strong>逻辑设备表（LUT）</strong>完成逻辑设备到物理设备的映射（表项含逻辑设备名、物理设备名、驱动程序入口），需要每个用户一张 LUT。</p>
    `,
    explanation: '答题要点：定义 + 「逻辑设备/物理设备抽象 + 逻辑设备表 LUT 映射」的实现途径，可补充两个优点（分配灵活、易于 I/O 重定向）。',
    tags: [{ deck: 5, sec: 'sec-ch5-alloc-h2', text: '设备独立性' }],
  },

  // ---------- 五、计算/算法题（20 分） ----------
  {
    id: 'p1-e6',
    kind: 'essay',
    question: `某采用银行家算法控制资源分配的系统，包含 5 进程（P0～P4）和 4 种资源（A-D），假设在 T0 时刻资源的分配情况如下表所示，请回答下列问题：
      <table class="tbl">
        <thead><tr><th></th><th>Allocation (A B C D)</th><th>Need (A B C D)</th><th>Available (A B C D)</th></tr></thead>
        <tbody>
          <tr><td>P0</td><td>0 0 3 2</td><td>0 0 1 2</td><td>1 3 2 2</td></tr>
          <tr><td>P1</td><td>1 0 0 0</td><td>1 4 5 0</td><td></td></tr>
          <tr><td>P2</td><td>0 1 1 0</td><td>0 3 5 5</td><td></td></tr>
          <tr><td>P3</td><td>1 3 5 4</td><td>2 3 5 3</td><td></td></tr>
          <tr><td>P4</td><td>0 0 1 2</td><td>0 3 4 2</td><td></td></tr>
        </tbody>
      </table>
      (1) T0 时刻是否为安全状态；(2) 如进程 P3 提出请求向量为 Request₃(1,0,1,0)，系统能否将资源分配给它？`,
    answer: `
      <p><strong>(1) T0 时刻安全性检查</strong>（Work 初值 = Available = 1,3,2,2）：</p>
      <ul>
        <li>P0：Need(0,0,1,2) ≤ Work ✓ → Work = Work + Allocation(0,0,3,2) = (1,3,5,4)；</li>
        <li>P4：Need(0,3,4,2) ≤ Work ✓ → Work = (1,3,6,6)；</li>
        <li>P1：Need(1,4,5,0) ≤ Work ✓ → Work = (2,3,6,6)；</li>
        <li>P2：Need(0,3,5,5) ≤ Work ✓ → Work = (2,4,7,6)；</li>
        <li>P3：Need(2,3,5,3) ≤ Work ✓ → Work = (3,7,12,10)。</li>
      </ul>
      <p>Finish 全为 true，存在安全序列 ⟨P0, P4, P1, P2, P3⟩，T0 时刻为<strong>安全状态</strong>。</p>
      <p><strong>(2) P3 请求 Request₃(1,0,1,0)</strong>：① Request₃ ≤ Need₃(2,3,5,3) ✓；② Request₃ ≤ Available(1,3,2,2) ✓；③ 试分配：Available = (0,3,1,2)，Allocation₃ = (2,3,6,4)，Need₃ = (1,3,4,3)；④ 安全性检查：Work=(0,3,1,2) 时只有 P0（Need 0,0,1,2）可推进 → Work=(0,3,4,4)；随后 P4 → Work=(0,3,5,4)；此时 P1（Need 1,4,5,0）、P2（Need 0,3,5,5）、P3（Need 1,3,4,3）均无法满足，Finish 不全为 true——<strong>不安全</strong>。所以系统<strong>不能</strong>将资源分配给 P3：取消试分配，令 P3 等待。</p>
    `,
    explanation: '评分要点：安全性算法逐进程推进的 Work 变化过程、银行家算法五步检查（≤Need、≤Available、试分配、安全性检查、决定分配）。',
    tags: [{ deck: 3, sec: 'sec-ch3-avoid-h2', text: '银行家算法' }, { deck: 8, sec: 'sec-ch8-banker', text: '银行家算法' }],
  },
  {
    id: 'p1-e7',
    kind: 'essay',
    question: '在生产者-消费者问题中，如果允许生产者和消费者同时访问缓冲池（不能同时访问缓冲池相同位置），其他条件不变。请：(1) 分析此问题中进程的同步与互斥关系；(2) 编写并发程序，并使用记录型信号量机制 wait/Signal 协调进程。',
    answer: `
      <p><strong>(1) 同步与互斥关系分析</strong>：</p>
      <ul>
        <li><strong>同步关系</strong>：生产者须等待「空缓冲区」资源才能投放产品（empty，初值 n）；消费者须等待「满缓冲区」资源才能取走产品（full，初值 0）；</li>
        <li><strong>互斥关系</strong>：与标准问题不同，本题允许多个生产者和消费者<strong>同时访问缓冲池的不同位置</strong>，只在访问「同一位置」（即对 in/out 指针与同一缓冲单元的读写）时互斥——把标准解中的一个 mutex 拆为 mutexP、mutexC 两个互斥信号量（初值均为 1），分别保护生产者的投放与消费者的取用。</li>
      </ul>
      <pre class="code"><code>VAR mutexP, mutexC, empty, full : semaphore := 1, 1, n, 0;
    in, out : integer := 0, 0;
    Buffer : array[0..n-1] of item;
Parbegin
  Producer:
  begin
      repeat
          produce an item in nextp;
          wait(empty);
          wait(mutexP);              // 生产者之间互斥
          Buffer(in) := nextp;
          in := (in + 1) mod n;
          signal(mutexP);
          signal(full);
      until false
  end
  Consumer:
  begin
      repeat
          wait(full);
          wait(mutexC);              // 消费者之间互斥
          nextc := Buffer(out);
          out := (out + 1) mod n;
          signal(mutexC);
          signal(empty);
          consume the item nextc;
      until false
  end
Parend</code></pre>
    `,
    explanation: '评分要点：先给出 empty/full 同步 + mutexP/mutexC 两把互斥锁的分析，再写出信号量定义与两个进程程序；wait(empty/full) 必须在 wait(mutex) 之前。',
    tags: [{ deck: 2, sec: 'sec-ch2-classic-h1', text: '生产者-消费者问题' }, { deck: 8, sec: 'sec-ch8-sync', text: '进程的同步与互斥' }],
  },

  // ---------- 六、问答题（10 分） ----------
  {
    id: 'p1-e8',
    kind: 'essay',
    question: '请论述：(1) 什么是虚拟存储器；(2) 如何在基本分页存储管理系统基础上，改进硬软件机制以实现请求分页存储管理（页式虚拟存储器）；(3) 请求分页存储管理系统如何实现存储保护；(4) 如果一个 4 字节指令跨 2 个页面（页式虚拟存储器），则该指令的 4 个字节可能会分散存储在内存中两个不相邻的页框内，在这种情况下，如何保证该指令被正确执行？',
    answer: `
      <p><strong>(1) 什么是虚拟存储器</strong>：虚拟存储器是指具有<strong>请求调入功能和置换功能</strong>，能从<strong>逻辑上对内存容量加以扩充</strong>的一种存储器系统。其逻辑容量由内存容量和外存容量之和所决定，其运行速度接近于内存速度，而每位的成本却又接近于外存。特征：多次性、对换性、虚拟性。</p>
      <p><strong>(2) 在基本分页系统上实现请求分页（页式虚拟存储器）</strong>：</p>
      <ul>
        <li>硬件上：扩充页表项，增加状态位 P（是否已调入内存）、访问字段 A（供置换算法参考）、修改位 M（换出时是否需写回外存）与外存地址（该页在外存的位置）；增加<strong>缺页中断机制</strong>（指令执行期间发出并处理，一条指令可能多次缺页）；地址变换机构在基本变换之上增加状态位检查与快表配合；</li>
        <li>软件上：提供<strong>请求调入（分页）策略</strong>（何时调入：预调页/请求式；何处调入：对换区/文件区/UNIX 方式）与<strong>页面置换算法</strong>（OPT、FIFO、LRU、Clock）；物理块分配采用固定/可变分配与局部/全局置换等策略，并按工作集确定分配块数。</li>
      </ul>
      <p><strong>(3) 存储保护的实现</strong>：利用页表项中的<strong>存取控制字段</strong>（如只读 X、读写 RW）对每次访存做权限检查——访问方式与存取控制不符时发出保护中断；同时通过页表长度寄存器做页号越界检查（p ≥ L 则地址越界中断），把程序限制在操作系统指定的内存区域内运行。</p>
      <p><strong>(4) 跨页指令的正确执行</strong>：该指令的 4 个字节分存于两个不相邻页框时，可利用<strong>缺页中断机制</strong>保证正确执行——CPU 执行该指令取指时，对指令所跨的两个页面逐个检查：第一字节所在页命中即开始取指，取到页边界处发现指令未完，继续访问第二个页面；若其中任一页不在内存（状态位 P = 0），硬件发出缺页中断，OS 把所需页调入内存并更新页表后，从<strong>被中断的指令处</strong>重新执行该指令。由于缺页中断支持「一条指令发出多次缺页中断」，两个页面可以分别调入，最终指令的 4 个字节都进入内存后被完整执行。</p>
    `,
    explanation: '评分要点：(1) 虚拟存储器定义（请求调入+置换、逻辑扩充）；(2) 硬件（扩充页表项/缺页中断/地址变换）与软件（调入与置换策略）；(3) 存取控制字段与越界检查；(4) 缺页中断可重复触发、一条指令多次缺页。',
    tags: [
      { deck: 4, sec: 'sec-ch4-vm', text: '虚拟存储器的基本概念' },
      { deck: 4, sec: 'sec-ch4-demand-h1', text: '请求分页中的硬件支持' },
    ],
  },
];

const paper: OsPaper = {
  id: 'ac-2022a',
  title: '2022-2023 学年第一学期 · 试卷 A（操作系统 A/C）',
  source: '原卷扫描件转录（课程代码 0509112B，共 2 面）',
  answerSource: '本站整理',
  sections: [
    { title: '一、填空题（10 分，每题 2 分）', questionIds: ['p1-f1', 'p1-f2', 'p1-f3', 'p1-f4', 'p1-f5'] },
    { title: '二、判断题（5 分，每题 1 分）', questionIds: ['p1-j1', 'p1-j2', 'p1-j3', 'p1-j4', 'p1-j5'] },
    {
      title: '三、选择题（30 分，每题 2 分）',
      questionIds: ['p1-s1', 'p1-s2', 'p1-s3', 'p1-s4', 'p1-s5', 'p1-s6', 'p1-s7', 'p1-s8', 'p1-s9', 'p1-s10', 'p1-s11', 'p1-s12', 'p1-s13', 'p1-s14', 'p1-s15'],
    },
    { title: '四、简答题（25 分，每题 5 分）', questionIds: ['p1-e1', 'p1-e2', 'p1-e3', 'p1-e4', 'p1-e5'] },
    { title: '五、计算/算法题（20 分）', questionIds: ['p1-e6', 'p1-e7'] },
    { title: '六、问答题（10 分）', questionIds: ['p1-e8'] },
  ],
  questions: qs,
};

export default paper;
