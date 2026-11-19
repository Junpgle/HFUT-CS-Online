/* 操作系统 · 第4章 存储管理 —— 依据「课件/PPT-按章/第4章 存储管理.pdf」（合肥工业大学操作系统课程组，2014）整理 */
import type { OsChapter } from './types';

const ch: OsChapter = {
  id: 'ch4',
  no: '第4章',
  title: '存储管理',
  subtitle: '第 4 章 · 存储管理',
  lede: `
  本章从<strong>程序的装入和链接</strong>讲起，沿「连续分配（单一/固定/动态/可重定位分区）→ 基本分页 → 基本分段 → 段页式 →
        虚拟存储器 → 请求分页 → 请求分段」推进。<strong>地址变换机构</strong>（含快表与两级页表）与<strong>页面置换算法</strong>（OPT / FIFO / LRU / Clock）
        是期末计算题与概念题的双料考点。
`,
  toc: [
    { id: 'sec-ch4-load', text: '1. 程序的装入和链接', level: 2 },
    { id: 'sec-ch4-load-h1', text: '程序的装入', level: 3 },
    { id: 'sec-ch4-load-h2', text: '地址重定位（地址映射）', level: 3 },
    { id: 'sec-ch4-load-h3', text: '程序的链接', level: 3 },
    { id: 'sec-ch4-contig', text: '2. 连续分配方式', level: 2 },
    { id: 'sec-ch4-contig-h1', text: '单一连续分配存储管理方案', level: 3 },
    { id: 'sec-ch4-contig-h2', text: '固定分区分配存储管理方案', level: 3 },
    { id: 'sec-ch4-contig-h3', text: '动态分区分配存储管理方案', level: 3 },
    { id: 'sec-ch4-contig-h4', text: '可重定位分区分配存储管理方案', level: 3 },
    { id: 'sec-ch4-paging', text: '3. 基本分页存储管理方式', level: 2 },
    { id: 'sec-ch4-paging-h1', text: '基本设计思想', level: 3 },
    { id: 'sec-ch4-paging-h2', text: '地址重定位', level: 3 },
    { id: 'sec-ch4-paging-h3', text: '两级和多级页表', level: 3 },
    { id: 'sec-ch4-segment', text: '4. 基本分段存储管理方式', level: 2 },
    { id: 'sec-ch4-segment-h1', text: '基本设计思想', level: 3 },
    { id: 'sec-ch4-segment-h2', text: '地址重定位', level: 3 },
    { id: 'sec-ch4-segment-h3', text: '信息共享', level: 3 },
    { id: 'sec-ch4-combined', text: '5. 段页式存储管理方式', level: 2 },
    { id: 'sec-ch4-vm', text: '6. 虚拟存储器的基本概念', level: 2 },
    { id: 'sec-ch4-demand', text: '7. 请求分页存储管理方式', level: 2 },
    { id: 'sec-ch4-demand-h1', text: '请求分页中的硬件支持', level: 3 },
    { id: 'sec-ch4-demand-h2', text: '内存分配策略和算法', level: 3 },
    { id: 'sec-ch4-demand-h3', text: '页面策略（何时调入、何处调入）', level: 3 },
    { id: 'sec-ch4-demand-h4', text: '页面置换算法', level: 3 },
    { id: 'sec-ch4-dsegment', text: '8. 请求分段存储管理方式', level: 2 },
    { id: 'sec-ch4-exercise', text: '9. 本章习题', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ch4-load',
      heading: '1. 程序的装入和链接',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>存储体系概述</strong>：寄存器 → Cache → 主存 → 磁盘，构成「价格/速度递减、容量递增」的存储层次。内存是由存储单元（字节或字）组成的一维连续的地址空间，简称内存空间；用来存放当前正在运行程序的代码及数据，是程序中指令本身地址所指的、亦即程序计数器所指的存储器。内存是性能「瓶颈」：关键、紧张。<strong>帕金森定律：内存多大，程序多长</strong>。</p>
          <h3 id="sec-ch4-load-h1">程序的装入</h3>
          <ul>
            <li><strong>绝对装入方式</strong>：编程时直接确定内存位置。特点：不灵活，不支持多道程序设计技术；</li>
            <li><strong>可重定位装入方式</strong>：虚拟技术——编程时使用逻辑地址，运行时使用物理地址；装入时进行地址重定位。特点：灵活，支持多道程序设计技术；</li>
            <li><strong>动态运行时装入方式</strong>：编程时使用逻辑地址，运行时使用物理地址；<strong>运行时</strong>进行地址重定位。特点：灵活；支持多道程序设计技术；支持程序「搬家」。</li>
          </ul>
          <h3 id="sec-ch4-load-h2">地址重定位（地址映射）</h3>
          <p><strong>逻辑地址</strong>（相对地址，虚地址）：用户程序经过汇编或编译后形成目标代码，目标代码中所有地址采用相对地址形式——首地址为 0；其余指令中地址以相对于首地址的字节偏移为地址；不能用逻辑地址在内存中读取信息。</p>
          <p><strong>物理地址</strong>（绝对地址，实地址）：内存中存储单元的地址，可直接寻址。</p>
          <p><strong>地址重定位（地址映射）</strong>：为了保证 CPU 执行指令时可正确访问存储单元，需将用户程序中的逻辑地址转换为运行时由机器直接寻址的物理地址，这一过程称为地址映射。</p>
          <ul>
            <li><strong>静态地址重定位</strong>：当用户程序被装入内存时，一次性实现逻辑地址到物理地址的转换，以后不再转换；一般在装入内存时由软件完成。</li>
            <li><strong>动态地址重定位</strong>：在程序运行过程中要访问数据时再进行地址变换（即在逐条指令执行时完成地址映射）。一般为了提高效率，此工作由硬件地址映射机制来完成（硬件支持，软硬件结合完成）；硬件上需要一对寄存器的支持。</li>
          </ul>
          <svg class="fig" viewBox="0 0 640 230" role="img" aria-label="动态地址重定位：重定位寄存器 VR 参与地址变换">
            <g font-size="13" text-anchor="middle" style="font-family:var(--font)">
              <defs>
                <marker id="a5" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" style="fill:var(--ink-3)"/>
                </marker>
              </defs>
              <g style="fill:var(--panel-2);stroke:var(--hairline)">
                <rect x="60" y="40" width="180" height="130" rx="12"/>
                <rect x="400" y="40" width="180" height="150" rx="12"/>
              </g>
              <g style="fill:var(--ink)" font-weight="700">
                <text x="150" y="30">逻辑地址空间</text>
                <text x="490" y="30">物理地址空间</text>
              </g>
              <g style="fill:var(--ink-2)" font-size="12.5">
                <text x="150" y="65">0</text>
                <text x="150" y="90">100</text>
                <text x="150" y="118">200　LOAD A, 200</text>
                <text x="150" y="146">300</text>
                <text x="490" y="65">1000</text>
                <text x="490" y="90">1100</text>
                <text x="490" y="118">1200　LOAD A, 200</text>
                <text x="490" y="146">1300</text>
                <text x="490" y="172" style="fill:var(--deck-accent)" font-weight="700">3456 ← data1</text>
              </g>
              <g style="fill:var(--panel-solid);stroke:var(--deck-accent)" stroke-width="1.8">
                <rect x="255" y="120" width="120" height="34" rx="8"/>
              </g>
              <text x="315" y="142" style="fill:var(--ink)" font-weight="700">VR = 1000</text>
              <text x="315" y="176" style="fill:var(--ink-2)" font-size="12">重定位寄存器</text>
              <g style="stroke:var(--ink-3)" stroke-width="1.5" fill="none">
                <path d="M240,137 L255,137" marker-end="url(#a5)"/>
                <path d="M375,137 L400,120" marker-end="url(#a5)"/>
              </g>
              <text x="320" y="212" style="fill:var(--ink-3)" font-size="12.5">物理地址 = 逻辑地址 + 重定位寄存器值（200 + 1000 = 1200）</text>
            </g>
          </svg>
          <p class="fig-cap">图 4-1　动态地址重定位：逻辑地址 200 加上重定位寄存器（基址）1000 得到物理地址 1200</p>
          <h3 id="sec-ch4-load-h3">程序的链接</h3>
          <ul>
            <li><strong>静态链接</strong>：编程时，链接所有模块；</li>
            <li><strong>装入时动态链接</strong>：装入时，链接所有模块；</li>
            <li><strong>运行时动态链接</strong>：运行时，根据需要链接模块。</li>
          </ul>
          `,
        },
      ],
    },
    {
      id: 'sec-ch4-contig',
      heading: '2. 连续分配方式',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>连续分配方式</strong>：为程序分配一段连续存储空间。<strong>离散分配方式</strong>：为程序分配若干段连续的存储空间。</p>
          <h3 id="sec-ch4-contig-h1">单一连续分配存储管理方案</h3>
          <p><strong>(1) 应用背景</strong>：单用户系统。在一段时间内，只有一个进程在内存。<strong>(2) 基本思想</strong>：内存分为两个区域——一个供操作系统使用，一个供用户使用。三种典型内存布局：OS 在低址端、OS 在高址端、或 OS 在两端之间夹住用户程序区。<strong>(3) 实现</strong>：设置基址寄存器、限界寄存器。<strong>(4) 特点</strong>：简单；适用于单任务 OS。</p>
          <h3 id="sec-ch4-contig-h2">固定分区分配存储管理方案</h3>
          <p><strong>(1) 应用背景</strong>：多道程序设计系统。<strong>(2) 基本思想</strong>：OS 初始化阶段，将用户区划分为若干固定大小的内存区域（分区）；每个分区可放一个程序运行；一个分区内的程序执行结束，可调入另一个程序执行；划分为几个分区，则允许几个程序同时在内存运行；分区大小和位置可不同。作业排队可按多个等待队列（分区大小对应）或单个等待队列组织。</p>
          <p><strong>(3) 实现</strong>：数据结构——分区说明表；算法——分区分配算法、分区回收算法。<strong>(4) 特点</strong>：最早的支持多道程序设计的存储管理方案；简单，现在仍在嵌入式系统中使用；「内零头」严重。</p>
          <div class="callout key">
            <p class="callout-h">内存的零头（碎片）</p>
            <p><strong>内零头</strong>：分配给进程，而进程未用到的内存部分；<strong>外零头</strong>：未分配给进程，但因为太小而无进程能用的内存部分。</p>
          </div>
          <h3 id="sec-ch4-contig-h3">动态分区分配存储管理方案</h3>
          <p><strong>(1) 应用背景</strong>：多道程序设计系统。<strong>(2) 基本思想</strong>：OS 初始化阶段，将用户区划分为一个大的空白分区；每个程序运行时，划分出一个大小合适的分区；程序执行结束，其所在的分区撤消。例：0K–15K 为 OS，用户区 15K–120K 依次装入 A（15K–35K）、B（35K–45K）、C（45K–63K），B 撤消后其分区空闲，再装入 D。</p>
          <p><strong>(3) 实现</strong>——数据结构：(a) <strong>空闲分区表</strong>（始址、长度、标志列，如 15K/23K/未分配、48K/20K/未分配、80K/30K/未分配）；(b) <strong>空闲分区链</strong>：在各空闲分区头部/尾部设置双向链表指针，形成双向链表。</p>
          <p><strong>(a) 分区分配算法</strong>：</p>
          <ol>
            <li><strong>首次适应算法</strong>：按地址递增顺序排列空闲分区链；分配内存时，总是从低地址端开始扫描空闲区；找到的第一个大小合适的分区，就分割分配；否则失败。特点：高址端有大空闲区概率大；低址端迅速被划分，碎片出现速度快。</li>
            <li><strong>循环首次适应算法</strong>：按地址递增顺序排列空闲分区链；设置当前指针；分配内存时，从指针所指位置开始扫描空闲区；找到的第一个大小合适的分区，就分割分配；否则失败。本质：CLOCK 算法。特点：碎片分布均匀；高址端有大空闲区概率小。</li>
            <li><strong>最佳适应算法</strong>：按大小递增顺序排列空闲分区链；分配内存时，从链首开始扫描空闲区；找到的第一个大小合适的分区，就分割分配；否则失败。特点：碎片迅速出现；「最佳」匹配。</li>
            <li><strong>最坏适应算法</strong>：按大小递减顺序排列空闲分区链；分配内存时，总是分配链首空闲区；否则失败。特点：碎片出现最慢（分割后剩下的分区是最大的）；无大的空闲区保留。</li>
          </ol>
          <p><strong>(b) 分区回收算法</strong>：回收分区与相邻空闲区的关系有四种处理——(a) 和上、下都合并；(b) 与上合并；(c) 与下合并；(d) 自己成为一个新区。</p>
          <p><strong>(4) 特点</strong>——「碎片」问题：经过一段时间的分配回收后，内存中存在很多很小的空闲块。它们每一个都很小，不足以满足分配要求；但其总和满足分配要求。这些空闲块被称为碎片，造成存储资源的浪费。</p>
          <h3 id="sec-ch4-contig-h4">可重定位分区分配存储管理方案</h3>
          <p><strong>(1) 应用背景</strong>：多道程序设计系统。<strong>(2) 基本思想</strong>：采用动态分区分配方式；引入「紧凑」机制，合并小的碎片空闲区；使用动态地址重定位。例：A/B/C/D/E 散布在 15K–200K 之间、碎片零散，经过紧凑后 A/B/C/D/E 依次从 15K 起连续存放，空闲区合并为 182K–220K 一整块。<strong>算法设计问题</strong>：如何紧凑，才能保证算法效率最高？</p>
          <div class="callout warn">
            <p class="callout-h">分区式分配的出路</p>
            <p>分区式分配存在的问题：碎片（内外「零头」）问题难以解决。由此引出离散分配方式——基本分页存储管理方式。</p>
          </div>
          `,
        },
      ],
    },
    {
      id: 'sec-ch4-paging',
      heading: '3. 基本分页存储管理方式',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ch4-paging-h1">基本设计思想</h3>
          <p><strong>(1) 设计思想概述</strong>：把源程序经编译、连接得到的目标程序（逻辑地址空间 0…n）划分成大小相等的<strong>页面</strong>，把内存/主存划分成同样大小的<strong>页框</strong>（页帧），以页为单位离散装入页框。</p>
          <p><strong>要解决的问题</strong>：页面/页框尺寸；逻辑地址结构；记录每个页面储存在哪个页框；程序如何正确运行（地址重定位）？指令跨页时的执行问题。</p>
          <p><strong>(2) 页表</strong>：页表记录页号 → 页框号与存取控制的对应关系。页表存储在内存；页表起始地址保存在 PCB。示例页表：页 0→页框 4（X）、页 1→页框 2（X）、页 2→页框 10（X）、页 3→页框 5（X）、页 4→页框 8（RW）、页 5→页框 9（X）、页 6→页框 3（RW）。</p>
          <p><strong>(3) 页面尺寸</strong>：页面太小——内存利用率（内零头）高，页面数量增加，占用内存；页面太大——内存利用率（内零头）低，页面数量减少，节省内存；正常尺寸：2 的整数次方，512B～8K。</p>
          <p><strong>(4) 地址结构</strong>：包括页号和页内地址 2 部分。以 32 位地址、4K 页面为例：0–11 位为页内地址/偏移量 W（相对地址 0～4095），12–31 位为页号 P（编号 0～1048575）。</p>
          <h3 id="sec-ch4-paging-h2">地址重定位</h3>
          <p><strong>(1) 问题</strong>（假设 4K 页面、32 位地址空间）：data1 逻辑地址 0x00005064，页表给出页 5 → 页框 9，则 data1 物理地址为 0x00009064。</p>
          <p><strong>(2) 基本地址变换机构/地址映射机制</strong>：逻辑地址拆成页号 p 与页内地址 d；比较 p ≥ L（页表长度寄存器）则地址越界；以页表地址寄存器定位页表，取出页框号 b；物理地址 = b + d。</p>
          <svg class="fig" viewBox="0 0 660 280" role="img" aria-label="基本地址变换机构：页号查页表得页框号，拼接页内地址">
            <g font-size="13" text-anchor="middle" style="font-family:var(--font)">
              <defs>
                <marker id="a6" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" style="fill:var(--ink-3)"/>
                </marker>
              </defs>
              <g style="fill:var(--panel-2);stroke:var(--hairline)">
                <rect x="30" y="90" width="170" height="60" rx="10"/>
                <rect x="300" y="60" width="120" height="34" rx="8"/>
                <rect x="300" y="104" width="120" height="34" rx="8"/>
              </g>
              <g style="fill:var(--panel-solid);stroke:var(--deck-accent)" stroke-width="1.8">
                <rect x="270" y="170" width="180" height="70" rx="10"/>
              </g>
              <g style="fill:var(--ink)" font-weight="700">
                <text x="115" y="112">逻辑地址</text>
                <text x="115" y="134">页号 p=3 ｜ 页内地址 d</text>
                <text x="360" y="82">页表地址寄存器</text>
                <text x="360" y="126">页表长度寄存器</text>
                <text x="360" y="200">页表</text>
              </g>
              <g style="fill:var(--ink-2)" font-size="12">
                <text x="360" y="220">0 → 0</text>
                <text x="360" y="232">1 → 2</text>
                <text x="410" y="220">2 → 10</text>
                <text x="410" y="232" style="fill:var(--deck-accent)" font-weight="700">3 → 5</text>
              </g>
              <g style="stroke:var(--ink-3)" stroke-width="1.5" fill="none" marker-end="url(#a6)">
                <path d="M200,120 L240,120"/>
                <path d="M285,152 L300,138"/>
                <path d="M330,152 L330,170"/>
                <path d="M450,205 L520,205"/>
              </g>
              <text x="240" y="112" style="fill:var(--ink-3)" font-size="12">比较 p ≥ L ?</text>
              <text x="560" y="200" style="fill:var(--ink)" font-weight="700" text-anchor="start">页框号 b</text>
              <text x="560" y="232" style="fill:var(--ink)" font-weight="700" text-anchor="start">物理地址 = b + d</text>
            </g>
          </svg>
          <p class="fig-cap">图 4-2　基本地址变换机构（页表地址/长度寄存器 + 越界检查 + 页框号拼接）</p>
          <p><strong>地址变换机构计算示例</strong>（假设 32 位地址空间，4K 页面）：data1 逻辑地址 0x00005064 = 页号 5 ｜ 页内地址 0x064；查页表页 5 → 页框 9；物理地址 = 0x9000 + 0x064 = 0x00009064。</p>
          <p><strong>页表的作用</strong>——分页系统的核心数据结构：记录程序各页面所在的页框位置；支持进行地址重定位；实现页面访问控制；存储保护——限制程序在操作系统指定的内存区域内运行。</p>
          <p><strong>性能问题</strong>：访问 1 次内存变量，涉及 2 次地址访问（页表 + 变量）。<strong>解决办法：快表</strong>——设置在 CPU 内部；具有并行查找能力；暂存当前正在使用的页表项；尺寸 16～512，可达到 90% 以上命中率。别名：联想存储器（相联存储器）（associative memory）；Intel 术语：TLB（Translation Lookaside Buffers）。</p>
          <p><strong>(3) 具有快表的地址变换机构</strong>：逻辑地址的页号 p 先与快表中当前暂存的页表项并行比较——命中则直接取得页框号 b（不必访问内存中的页表）；未命中再走基本页表流程，并把该项装入快表。</p>
          <h3 id="sec-ch4-paging-h3">两级和多级页表</h3>
          <p><strong>(1) 页表的存储问题</strong>（假设 4K 页面、4 字节页表项）：32 位地址空间有 2^20 个页面，页表要占 4MB，本身要占用多个页框——页表大了，连页表自己都需要被分页管理。</p>
          <p><strong>(2) 两级页表</strong>：为页表再建立一张页表，以记录页表所占据的页框信息，从而形成两级页表。<strong>两级页表地址结构</strong>（32 位）：0–11 位为页内地址/偏移量 W；12–21 位为页号 P2（一级页表的索引项内容，指向二级页表项）；22–31 位为外层页号 P1（索引外层页表）。<strong>两级页表地址重新定位</strong>：先按 P1 查外层页表得到二级页表所在页框，再按 P2 查二级页表得到目标页的页框号。</p>
          <p><strong>(3) 多级页表</strong>：把页表的 2 级索引推广到多级索引。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch4-segment',
      heading: '4. 基本分段存储管理方式',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>分页系统存在的问题</strong>：信息共享和保护困难；编程不便。</p>
          <h3 id="sec-ch4-segment-h1">基本设计思想</h3>
          <p><strong>(1) 设计思想概述</strong>：把程序的逻辑地址空间按逻辑意义划分成若干<strong>分段</strong>（如 Main、Sub1、Sub2、D），每个分段单独装入内存中合适的位置。</p>
          <p><strong>要解决的问题</strong>：分段划分；逻辑地址结构；记录每个分段储在内存位置；程序如何正确运行（地址重定位）？指令跨分段时的执行问题？</p>
          <p><strong>(2) 分段</strong>：分段是一段有意义的信息集合；分段的划分由程序员完成；分段的长度不定；指令不存在跨分段情况。</p>
          <p><strong>(3) 段表</strong>：段表记录段号 → 段基址、段长与存取控制。段表存储在内存；段表起始地址保存在 PCB。示例段表：段 0（Main）基址 20K 段长 2K（X）；段 1（D）基址 40K 段长 1K（RW）；段 2（Sub1）基址 120K 段长 1.6K（X）；段 3（Sub2）基址 230K 段长 1.8K（X）。</p>
          <p><strong>(4) 地址结构</strong>：包括段号和段内地址 2 部分。以 32 位地址为例：0–15 位为段内地址/偏移量 W，16–31 位为段号 S。</p>
          <h3 id="sec-ch4-segment-h2">地址重定位</h3>
          <p><strong>(1) 问题</strong>（假设 32 位地址，分段最大尺寸 64K）：data2 逻辑地址 0x00030564——高 16 位段号 3、低 16 位偏移 0x00000564；查段表段 3 基址 230K，物理地址 = 230K + 0x00000564。</p>
          <p><strong>(2) 分段地址变换及存储保护机构</strong>：逻辑地址拆成段号 S 与段内地址 d；比较 S ≥ Cl（段表长度寄存器）则地址越界；查段表取段基址 b 与段长 l；比较 d ≥ l 则地址越界；检查访问权限（存取控制）；物理地址 = b + d。配合快表加速。</p>
          <p><strong>地址变换机构计算示例</strong>（假设 32 位地址空间，分段最大 64K）：data1 逻辑地址 0x00030564 = 段号 3 ｜ 段内地址 0x00000564；查段表段 3 → 段基址 230K；物理地址 = 230K + 0x00000564。</p>
          <p><strong>段表的作用</strong>——分段系统的核心数据结构：记录程序各分段所在的内存位置；支持进行地址重定位；实现分段访问控制；存储保护——限制程序在操作系统指定的内存区域内运行。</p>
          <p><strong>(3) 分段和分页区别</strong>：</p>
          <table class="tbl">
            <thead><tr><th>项目</th><th>分段</th><th>分页</th></tr></thead>
            <tbody>
              <tr><td>信息单位</td><td>信息的逻辑单位</td><td>信息的物理单位</td></tr>
              <tr><td>大小</td><td>不定</td><td>固定</td></tr>
              <tr><td>可见性</td><td>程序员确定，可见</td><td>系统确定，程序员不可见</td></tr>
              <tr><td>地址空间</td><td>二维地址空间</td><td>一维线性地址空间</td></tr>
              <tr><td>信息共享保护</td><td>方便</td><td>不方便</td></tr>
            </tbody>
          </table>
          <h3 id="sec-ch4-segment-h3">信息共享</h3>
          <p><strong>(1) 分页信息共享</strong>：多个进程的页表中让若干页号指向同一页框即可共享；但共享页必须对齐到页边界，共享不方便。<strong>(2) 分段信息共享</strong>：不同进程的段表让某段指向同一内存区域（段基址一致），即可按逻辑单位共享整段（如共享 Main 段），共享方便。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch4-combined',
      heading: '5. 段页式存储管理方式',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>分段系统存在的问题</strong>：碎片（内外「零头」）问题难以解决。<strong>解决方案（分段 + 分页）</strong>：</p>
          <ul>
            <li><strong>分页系统</strong>：负责解决主存分配问题——内存按页分配；</li>
            <li><strong>分段系统</strong>：负责解决逻辑地址空间管理问题——按段为应用程序分配逻辑地址空间。</li>
          </ul>
          <p><strong>基本设计思想</strong>：程序的逻辑地址空间先分段，段内再分页；内存按页框离散装入。<strong>(2) 段表和页表</strong>：每张段表项指向该段的页表（页表始址与页表长度），页表再记录页 → 页框。<strong>(3) 地址结构</strong>（32 位）：段号 S ｜ 页号 P ｜ 页内地址/偏移量 W。<strong>地址变换</strong>：先查段表得该段页表始址，再查页表得页框号，最后拼接页内偏移——三次访存（可配快表）。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch4-vm',
      heading: '6. 虚拟存储器的基本概念',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>存储管理的两个基本问题</strong>：大作业如何在小主存上运行；如何在给定大小主存上运行更多程序。</p>
          <p><strong>4.6.1 虚拟存储器的理论基础</strong>——<strong>(1) 程序运行的基本特征：局部性原理</strong>。在一段时间内一个程序的执行往往呈现出高度的局部性，表现在时间与空间两方面 [Denning P. 1968]：</p>
          <ul>
            <li><strong>时间局部性</strong>：一条指令被执行了，则在不久的将来它可能再被执行；在一段时间内，访问的代码范围是有限的；</li>
            <li><strong>空间局部性</strong>：若某一存储单元被使用，在一定时间内，与该存储单元相邻的单元可能被使用。</li>
          </ul>
          <p><strong>启示</strong>：是否可不将程序所有代码同时装入主存？</p>
          <p><strong>4.6.2 虚拟存储器概念</strong>——<strong>(1) 基本原理图</strong>：程序的一部分在内存、一部分在外存；访问的页面不在内存时<strong>请求调入</strong>，内存不足时<strong>自动置换</strong>。</p>
          <svg class="fig" viewBox="0 0 640 220" role="img" aria-label="虚拟存储器基本原理：内存与外存之间的请求调入与自动置换">
            <g font-size="13" text-anchor="middle" style="font-family:var(--font)">
              <defs>
                <marker id="a7" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" style="fill:var(--ink-3)"/>
                </marker>
              </defs>
              <g style="fill:var(--panel-2);stroke:var(--hairline)">
                <rect x="60" y="50" width="200" height="120" rx="12"/>
                <rect x="380" y="50" width="200" height="120" rx="12"/>
              </g>
              <g style="fill:var(--ink)" font-weight="700">
                <text x="160" y="40">内存</text>
                <text x="480" y="40">外存</text>
              </g>
              <g style="fill:var(--panel-solid);stroke:var(--deck-accent)" stroke-width="1.5">
                <rect x="80" y="66" width="60" height="34" rx="6"/>
                <rect x="150" y="66" width="60" height="34" rx="6"/>
                <rect x="80" y="110" width="60" height="34" rx="6"/>
                <rect x="150" y="110" width="60" height="34" rx="6"/>
                <rect x="400" y="66" width="60" height="34" rx="6"/>
                <rect x="470" y="66" width="60" height="34" rx="6"/>
                <rect x="400" y="110" width="60" height="34" rx="6"/>
                <rect x="470" y="110" width="60" height="34" rx="6"/>
              </g>
              <g style="fill:var(--ink-2)" font-size="12">
                <text x="110" y="88">A</text><text x="180" y="88">A</text>
                <text x="110" y="132">A</text><text x="180" y="132">A</text>
                <text x="430" y="88">A</text><text x="500" y="88">A</text>
                <text x="430" y="132">A</text><text x="500" y="132">A</text>
              </g>
              <g style="stroke:var(--deck-accent)" stroke-width="1.8" fill="none" marker-end="url(#a7)">
                <path d="M400,80 L262,80"/>
                <path d="M262,140 L400,140"/>
              </g>
              <g style="fill:var(--deck-accent)" font-size="12.5" font-weight="700">
                <text x="330" y="72">请求调入</text>
                <text x="330" y="158">自动置换</text>
              </g>
              <text x="320" y="202" style="fill:var(--ink-3)" font-size="12.5">程序 A 的部分页面在内存，其余在外存；缺页时调入，内存满时换出</text>
            </g>
          </svg>
          <p class="fig-cap">图 4-3　虚拟存储器基本原理：请求调入 + 自动置换</p>
          <p><strong>(2) 虚拟存储器的定义</strong>：所谓虚拟存储器，是指<strong>具有请求调入功能和置换功能，能从逻辑上对内存容量加以扩充</strong>的一种存储器系统。其逻辑容量由内存容量和外存容量之和所决定，其运行速度接近于内存速度，而每位的成本却又接近于外存。虚拟存储技术是一种性能非常优越的存储器管理技术，故被广泛地应用于大、中、小型机器和微型机中。</p>
          <p><strong>(3) 虚拟存储器的特征</strong>：多次性；对换性；虚拟性。</p>
          <p><strong>(4) 虚拟存储器的实现</strong>：</p>
          <ul>
            <li><strong>分页请求系统</strong>（页式虚拟存储器，请求分页系统）：在基本分页系统基础上，增加以页面为单位的请求调入和自动置换功能；</li>
            <li><strong>请求分段系统</strong>（段式虚拟存储器，分段请求系统）：在基本分段系统基础上，增加以分段为单位的请求调入和自动置换功能；</li>
            <li><strong>段页式虚拟存储器</strong>：在段页式系统基础上，增加以分页为单位的请求调入和自动置换功能。</li>
          </ul>
          `,
        },
      ],
    },
    {
      id: 'sec-ch4-demand',
      heading: '7. 请求分页存储管理方式',
      blocks: [
        {
          type: 'html',
          html: `
          <p>请求分页在基本分页基础上增加<strong>以页面为单位</strong>的请求调入与自动置换。<strong>要解决的问题</strong>：页面现在可能不在主存了，那么如何修改页表；何时启动页面调入；地址变换；初始页面数量如何确定；如何置换页面？何时调入页面；何处调入页面。</p>
          <h3 id="sec-ch4-demand-h1">请求分页中的硬件支持</h3>
          <p><strong>(1) 页表机制</strong>：页表项扩充为——页号、页框号、存取控制、<strong>状态位 P</strong>（该页是否已调入内存）、<strong>访问字段 A</strong>（记录近期访问情况）、<strong>修改位 M</strong>（该页调入后是否被修改过）、<strong>外存地址</strong>（该页在外存的位置）。</p>
          <p>实例：Intel x86 CPU 页表项——0–11 位保留外为页框号（31–12），标志位包括有效 V、写 W、所有者 O、通写 Wt、禁用高速缓存 Cd、访问 A、修改 D、GI、L、P 等保护控制位。</p>
          <p><strong>(2) 缺页中断机制</strong>：何时发出缺页中断——执行 <code>MOV AX, [1000]</code>、<code>CALL CS:[100]</code>、<code>JNZ CS:[2000]</code> 等涉及访存的指令时（经 CS:IP 取指/取数）。缺页中断的特点：在指令执行期间发出中断并响应和处理中断，返回后继续执行该指令；<strong>一条指令可能发出多次缺页中断</strong>。课件问题：Intel x86 CPU，为何没有 <code>MOV DS:[2000], CS:[1000]</code> 这条指令？（源与目的同时访存，一条指令可能产生多次缺页且中断返回后难以恢复指令现场。）</p>
          <p><strong>(3) 地址重定位</strong>：在基本地址变换机构上增加状态位检查——页不在内存（P=0）时触发缺页中断，调入并更新页表后重试。</p>
          <h3 id="sec-ch4-demand-h2">内存分配策略和算法</h3>
          <p><strong>(1) 最小物理块个数</strong>——保证程序正常运行需要的最小物理块个数由机器指令的结构决定：单字节指令，直接寻址：2 块；单字节指令，间接寻址：3 块；多字节指令，直接寻址：3 块；多字节指令，间接寻址：4 块。</p>
          <p><strong>(2) 工作集</strong> [Denning P.]——进程执行时需要多少物理块？<strong>进程的工作集</strong>：驻留在物理内存中的虚拟页面的子集。工作集大小的变化：进程开始执行后，随着访问新页面逐步建立较稳定的工作集；当内存访问的局部性区域的位置大致稳定时，工作集大小也大致稳定；局部性区域的位置改变时，工作集快速扩张和收缩，过渡到下一个稳定值。</p>
          <p><strong>(3) 物理块分配策略</strong>：</p>
          <ul>
            <li><strong>固定分配局部置换</strong>：为进程分配物理块；在进程运行期间，物理块个数不变；新页面只能置换入该进程已经分配的物理块。特点：物理块个数难以指定；</li>
            <li><strong>可变分配全局置换</strong>：为进程分配物理块；在进程运行期间，物理块个数随时变化；新页面在全局范围内置换物理块。特点：进程之间的执行互相影响；</li>
            <li><strong>可变分配局部置换</strong>：为进程分配物理块；在进程运行期间，物理块个数可变化；新页面在该进程已经分配物理块内置换；引入缺页率，保证低限阈值 ≤ 缺页率 ≤ 高限阈值。特点：避免物理块初始设置不合理的难题。</li>
          </ul>
          <p><strong>(4) 物理块分配算法</strong>：平均分配；按比例分配；加权分配。</p>
          <h3 id="sec-ch4-demand-h3">页面策略（何时调入、何处调入）</h3>
          <p><strong>(1) 何时调入</strong>：<strong>预先调页</strong>——一次调入多个页面，减少后期 I/O；<strong>请求式调页</strong>——需要时调入。<strong>(2) 何处调入</strong>：外存对换区；文件区；UNIX 方式——文件区（第一次）；对换区（兑换区）。</p>
          <h3 id="sec-ch4-demand-h4">页面置换算法</h3>
          <p>四种页面置换算法：<strong>最佳置换算法（OPT）</strong>、<strong>先进先出算法（FIFO）</strong>、<strong>最近最久未使用置换算法（LRU）</strong>、<strong>Clock 置换算法</strong>。</p>
          <p><strong>(1) 最佳置换算法（OPT 算法）</strong>：基本思想——选择以后再也不用的页面；没有的话，选择以后最长时间不用的页面。实现——无法实现，因为页面的访问顺序无法预知。特点——无法实现，仅具有理论意义。</p>
          <p><strong>(2) 先进先出置换算法（FIFO）</strong>：基本思想——基于程序的顺序执行特点，选择到达内存最早的页面予以淘汰。实现——页面在内存中按时间排序。特点——效果不佳（程序不是严格顺序执行）。</p>
          <p><strong>(3) 最近最久未使用置换算法（LRU）</strong>：基本思想——基于程序运行的局部性原理，选择最近以来最久未使用的页面予以淘汰。实现——移动寄存器、栈。特点——调度性能较好。</p>
          <p>LRU 的<strong>移位寄存器实现方案</strong>：每个物理块设置一个移位寄存器，初值为 0；访问一次页面，高位置 1；定时（100ms）将所有物理块的移位寄存器右移 1 位，高位补 0；选择移位寄存器数值最小的物理块，淘汰其中页面。<strong>栈实现方案</strong>：用栈（页号栈）维护访问次序，每次访问把该页压栈顶并移除旧位置，栈底页即最久未使用页。</p>
          <div class="callout key">
            <p class="callout-h">置换算法性能比较（实例 1）</p>
            <p>某分页系统的页面走向如下，请分别计算三种页面调度算法的缺页率：</p>
            <p class="formula" style="font-size:1rem">7　0　1　2　0　3　0　4　2　3　0　3　2　1　2　0　1　7　0　1</p>
            <p>（完整解答见「期末大题精讲 · 页面置换算法」——另一组走向 2,3,2,1,5,2,4,5,3,2,5,2 分配 3 个物理块的 FIFO/LRU/OPT 逐列演算。）</p>
          </div>
          `,
        },
      ],
    },
    {
      id: 'sec-ch4-dsegment',
      heading: '8. 请求分段存储管理方式',
      blocks: [
        {
          type: 'html',
          html: `
          <p>请求分段在基本分段基础上增加<strong>以分段为单位</strong>的请求调入与自动置换。<strong>要解决的问题</strong>：分段现在可能不在主存了，那么如何修改段表；何时启动分段调入；地址变换；如何实现分段共享？</p>
          <p><strong>4.8.1 请求分段中的硬件支持</strong>——<strong>(1) 段表机制</strong>：段表项扩充为——段号、段长、段基址、存取控制、<strong>存在位 P</strong>、<strong>访问字段 A</strong>、<strong>修改位 M</strong>、<strong>增补位</strong>、外存地址。</p>
          <p><strong>(2) 缺段中断机制</strong>：何时发出缺段中断——执行涉及段内访存的指令（如 <code>MOV AX,[1000]</code>、<code>CALL CS:[100]</code>、<code>JNZ CS:[2000]</code>，经 CS:IP）时；缺段中断在指令执行期间发出中断并响应和处理中断，返回后继续执行；一条指令可能发出多次缺段中断。</p>
          <p><strong>(3) 地址重定位</strong>（缺段处理流程）：请求访问 S 段中的 W 单元 → 判断段 S 在内存吗？→ 不在则发<strong>缺段中断</strong>：阻塞请求进程，查找空闲分区(链)表中内存中合适的空闲区——容量满足则从外存读入虚段 S；不满足则先空闲分区拼接以形成一个合适的空闲区（仍不够则淘汰若干实段），同时修改段表及空闲分区(链)表，然后读入、唤醒请求进程 → 在内存时继续判断 W &lt; 段容量吗（否则<strong>越界中断</strong>）、在访问权限之内吗（否则<strong>保护中断</strong>）→ 修改访问字段，形成主存地址 = (主存始址) + (W)，返回访问地址。</p>
          <p><strong>4.8.2 分段共享与保护</strong>——<strong>(1) 数据结构</strong>：</p>
          <ul>
            <li><strong>共享段表</strong>（所有进程共享）：整个系统设置 1 张共享段表；记录分段信息与共享该分段进程的信息（存取控制、进程数量 count、段号）；</li>
            <li><strong>进程段表</strong>（私有段表）：与前面所述段表相同。注意：被共享分段可由各进程以不同方式（存取控制、段号）共享。</li>
          </ul>
          <p><strong>(2) 算法：共享分段的分配与回收</strong>。<strong>分配算法</strong>：a) 检索共享分段，如果共享分段存在转 c)；b) 创建共享段表的段表项，填写分段信息，分配相应内存并调入分段；c) 记录本进程信息到共享段表的段表项，count+1；d) 复制共享段表的段表项相应信息（段基址、段长、存取控制）到进程段表。<strong>回收算法</strong>：a) 撤消进程时，将所有该进程共享之分段的 count − 1；b) 当某分段 count = 0 时，回收该分段所占据内存。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch4-exercise',
      heading: '9. 本章习题',
      blocks: [
        {
          type: 'html',
          html: `
          <p>修订版教材 P142：习题 5、6、14、15、16、23。</p>
          `,
        },
      ],
    },
  ],
};

export default ch;
