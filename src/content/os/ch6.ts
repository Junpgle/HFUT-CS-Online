/* 操作系统 · 第6章 文件管理 —— 依据「课件/PPT-按章/第6章 文件管理.pdf」（合肥工业大学操作系统课程组，2014）整理 */
import type { OsChapter } from './types';

const ch: OsChapter = {
  id: 'ch6',
  no: '第6章',
  title: '文件管理',
  subtitle: '第 6 章 · 文件管理',
  lede: `
  本章从文件与文件系统的概念出发，讲<strong>文件的逻辑结构</strong>（顺序/索引/索引顺序/直接文件）、
        <strong>文件的物理结构与外存分配方式</strong>（连续/链接 FAT/索引/UNIX 混合索引）、<strong>目录管理</strong>（FCB 与索引结点、目录结构）、
        <strong>文件存储空间管理</strong>（空闲表/链表/位示图/成组链接）以及文件共享与数据一致性控制。
`,
  toc: [
    { id: 'sec-ch6-fs', text: '1. 文件和文件系统', level: 2 },
    { id: 'sec-ch6-fs-h1', text: '文件的数据组成', level: 3 },
    { id: 'sec-ch6-fs-h2', text: '文件类型、文件系统与文件系统操作', level: 3 },
    { id: 'sec-ch6-logic', text: '2. 文件的逻辑结构', level: 2 },
    { id: 'sec-ch6-logic-h1', text: '基本概念', level: 3 },
    { id: 'sec-ch6-logic-h2', text: '顺序文件、索引文件、索引顺序文件与直接文件', level: 3 },
    { id: 'sec-ch6-alloc', text: '3. 文件的物理结构：外存分配方式', level: 2 },
    { id: 'sec-ch6-alloc-h1', text: '连续分配', level: 3 },
    { id: 'sec-ch6-alloc-h2', text: '链接分配（隐式链接与显式链接 FAT）', level: 3 },
    { id: 'sec-ch6-alloc-h3', text: '索引分配（单级/多级/UNIX 混合索引）', level: 3 },
    { id: 'sec-ch6-dir', text: '4. 目录管理', level: 2 },
    { id: 'sec-ch6-dir-h1', text: '文件控制块（FCB）与索引结点', level: 3 },
    { id: 'sec-ch6-dir-h2', text: '目录结构', level: 3 },
    { id: 'sec-ch6-dir-h3', text: '目录查询技术', level: 3 },
    { id: 'sec-ch6-space', text: '5. 文件存储空间管理', level: 2 },
    { id: 'sec-ch6-share', text: '6. 文件共享', level: 2 },
    { id: 'sec-ch6-consist', text: '7. 数据一致性控制', level: 2 },
    { id: 'sec-ch6-exercise', text: '8. 本章习题', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ch6-fs',
      heading: '1. 文件和文件系统',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ch6-fs-h1">文件的数据组成</h3>
          <p><strong>(1) 文件</strong>：定义——文件是指由创建者所定义的、具有文件名的若干相关元素的集合。分类——有结构文件：由若干记录构成的文件；无结构（流式）文件：由字节/字符组成的文件。文件属性：文件类型、长度、物理位置、建立时间等。示例：C:\\TEST.exe、C:\\个人简历.doc。</p>
          <p><strong>(2) 记录</strong>：定义——记录是一组相关数据项的集合，用于描述一个对象在某方面的属性。关键字：记录的唯一标志，由单个或组合数据项形成。分类——定长记录：记录长度固定；变长记录：记录长度不定。实例：张三，19 岁，男，95 分，78 分。</p>
          <p><strong>(3) 数据项</strong>：定义——数据项是有结构文件的基本单位，是数据组织中可以命名的最小逻辑单位，也称字段。每个数据项包括名称、数据类型、数据宽度等。分类——基本数据项：单个数据项；组合数据项：若干个数据项集。实例：姓名，性别。</p>
          <h3 id="sec-ch6-fs-h2">文件类型、文件系统与文件系统操作</h3>
          <p><strong>6.1.2 文件类型</strong>：</p>
          <table class="tbl">
            <thead><tr><th>分类方法</th><th>分类结果</th></tr></thead>
            <tbody>
              <tr><td>按用途分类</td><td>系统文件、用户文件、库文件</td></tr>
              <tr><td>按文件中数据形式分类</td><td>源文件、目标文件、可执行文件</td></tr>
              <tr><td>按存取控制属性</td><td>只执行文件、只读文件、读写文件</td></tr>
            </tbody>
          </table>
          <p><strong>文件系统</strong>：定义——文件系统是操作系统中负责管理和存取文件信息的软件机构，它是由管理文件所需的数据结构和相应的管理软件以及访问文件的一组操作组成。示例：NTFS、FAT32、HPFS、ext2、CDFS、ZFS、HFS。</p>
          <p><strong>文件系统模型</strong>（三层结构）：文件系统接口 → 对对象操纵和管理的软件集合 → 对象及其属性。示例：Linux 虚拟文件系统。</p>
          <p><strong>6.1.4 文件系统操作</strong>——文件操作三部曲：打开文件、读写等文件操作、关闭文件。<strong>打开文件</strong>：核心工作是在内存设置对文件操作的相关数据结构，并将文件基本信息复制到内存。<strong>关闭文件</strong>：核心工作是删除在内存设置的文件数据结构，并将必要的文件修改信息刷新到磁盘。操作类型包括——文件操作：创建文件、删除文件、打开文件、关闭文件、截断文件、设置读写位置；目录操作：创建目录、删除目录、检索目录。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch6-logic',
      heading: '2. 文件的逻辑结构',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ch6-logic-h1">基本概念</h3>
          <p><strong>如何设计文件结构</strong>：虚拟技术——逻辑文件、物理文件。<strong>逻辑文件</strong>：从用户观点出发看到的文件，其结构为文件的逻辑结构，是用户可以直接处理的数据及其结构，独立于文件的物理特性，又称文件组织。<strong>物理文件</strong>：从系统角度出发看到的文件，其结构为文件的存储结构/物理结构，是指文件在外存上的存储组织形式，与存储介质的存储性能、外存分配形式密切相关。<strong>逻辑文件到物理文件的映射</strong>：文件目录。</p>
          <h3 id="sec-ch6-logic-h2">顺序文件、索引文件、索引顺序文件与直接文件</h3>
          <p><strong>6.2.2 顺序文件</strong>：<strong>什么是顺序文件</strong>——顺序文件中的记录按照一定的顺序存储和组织，如时间顺序、关键字顺序等；通常按顺序方式进行文件的读写。<strong>顺序文件的读写</strong>：设置读、写指针，指向下一条要读写记录的起始字节位置，读写指针在读写文件过程中自动变化。打开文件时读写指针分别指向文件中首字节位置（为 0）：<code>Wptr := 0; Rptr := 0</code>。后续读写文件时读写指针变化方式：变长记录 <code>Wptr := Wptr + Li; Rptr := Rptr + Li</code>（Li 为记录 i 长度）；定长记录 <code>Wptr := Wptr + L; Rptr := Rptr + L</code>（L 为记录长度）。<strong>特点</strong>：批量顺序存取效率非常高（例如每月工资计算）；查找或修改单条记录困难（记录变长，例如查找身份信息）；插入删除记录困难（记录变长，或须保序）。</p>
          <p><strong>6.2.3 索引文件</strong>：<strong>什么是索引文件</strong>——定长记录的顺序文件根据记录号可直接存取，因为其地址为 Ai = i × L（L 为记录长度，i 为记录号）；但根据记录的关键字、或对于变长记录文件，无法直接存取。设计思想：在顺序文件基础上增加索引表，其中存放每条记录的关键字（或记录号）与其文件位置的对应关系。索引表本身为定长记录结构，支持折半查找（关键字索引表(定长记录文件)示例见课件）。<strong>文件读写</strong>：首先根据索引表由关键字（记录号）找到记录在文件位置，然后调整读写指针，再进行记录读写，可折半查找。<strong>特点</strong>：支持记录直接存取；但索引表须占用额外存储空间，尤其当记录数量很大时。</p>
          <p><strong>索引顺序文件</strong>：<strong>什么是索引顺序文件</strong>——为降低索引表的存储开销，为一组记录在索引表中建立一个索引项，而非每条记录一条索引项；分组方式：按关键字分组，或直接按记录号分组。<strong>文件读写</strong>：首先根据索引表由关键字（记录号）找到记录所在组的文件起始位置，然后调整读写指针，再顺序读写记录，直到找到所要读写的记录。<strong>特点</strong>：支持记录直接存取；大大降低索引表的存储空间和 I/O、计算开销。</p>
          <p><strong>6.2.4 直接文件</strong>：<strong>什么是直接文件（HASH 文件）</strong>——直接根据记录的关键字（记录号），经简单计算得到记录在文件的位置。计算方式：Ai = HASH(i)（针对记录号）；Ai = HASH(key)（针对关键字）。<strong>文件读写</strong>：首先根据 HASH 函数由关键字（记录号）计算记录在文件起始位置，然后调整读写指针，再读写。<strong>特点</strong>：支持记录直接存取；摆脱索引表，存储空间和 I/O、计算开销大幅降低。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch6-alloc',
      heading: '3. 文件的物理结构：外存分配方式',
      blocks: [
        {
          type: 'html',
          html: `
          <p>磁盘上的文件的物理结构建立在磁盘格式化之上——磁盘格式化：(1) 设置磁盘块大小；(2) 为磁盘块编号。</p>
          <h3 id="sec-ch6-alloc-h1">连续分配</h3>
          <p><strong>什么是连续分配：顺序文件</strong>——要求为每个文件分配一组相邻接的磁盘块，且文件的逻辑记录的顺序与所存储磁盘块的块号顺序一致。所形成的文件结构称顺序文件结构，物理文件称为顺序文件。<strong>特点</strong>：</p>
          <ul>
            <li>顺序访问容易——通常它们位于一条磁道上，在进行读/写时不必移动磁头，仅当访问到一条磁道的最后一个盘块后才需要移到下一条磁道，于是又去连续地读/写多个盘块；</li>
            <li>顺序访问速度快；</li>
            <li>要求连续的存储空间；</li>
            <li>必须事先知道文件长度。</li>
          </ul>
          <h3 id="sec-ch6-alloc-h2">链接分配（隐式链接与显式链接 FAT）</h3>
          <p><strong>基本思想</strong>：采用离散分配思想，为每个文件分配一组不相邻接的磁盘块，且文件的逻辑记录的顺序与所存储磁盘块的块号顺序可不一致。核心问题：如何设计数据结构，记录文件分配到的磁盘块信息？</p>
          <p><strong>(1) 隐式链接：链接文件</strong>——采用单链表结构，各磁盘块存储指向下个磁盘块的块号（文件内容末尾附带「25 (指针, 下个磁盘块号)」这样的指针）。所形成的文件结构称链接文件结构，物理文件称为链接文件。<strong>特点</strong>：</p>
          <ul>
            <li>提高了磁盘空间利用率，不存在外部碎片问题；</li>
            <li>有利于文件插入和删除；</li>
            <li>有利于文件动态增长和减小；</li>
            <li>存取速度慢，不适于随机存取；</li>
            <li>可靠性容错性差，如指针出错；</li>
            <li>更多的寻道次数和寻道时间；</li>
            <li>链接指针占用一定的空间。</li>
          </ul>
          <p><strong>(2) 显式链接</strong>——设置文件分配表（File Allocation Table, FAT），集中存储所有的磁盘块号信息。示例：文件 A 占据磁盘块 4, 6, 11；文件 B 占据磁盘块 9, 10, 5。FAT 表是磁盘块号（簇号）数组，核心是<strong>单链表的集中存储</strong>。</p>
          <p><strong>FAT 分类</strong>：FAT12——12 位磁盘块号 [0, 2<sup>12</sup>−1]；FAT16——16 位磁盘块号 [0, 2<sup>16</sup>−1]；FAT32——32 位磁盘块号 [0, 2<sup>32</sup>−1]。</p>
          <p><strong>FAT 表的磁盘空间管理能力</strong>：</p>
          <table class="tbl">
            <thead><tr><th>FAT 类型</th><th>占用空间</th><th>磁盘块(簇)尺寸</th><th>管理磁盘空间</th></tr></thead>
            <tbody>
              <tr><td>FAT12</td><td>1.5×4K = 6K</td><td>0.5K、1K</td><td>2M、4M</td></tr>
              <tr><td>FAT16</td><td>2×64K = 128K</td><td>1K、4K、16K、32K、64K</td><td>64M、256M、1G、2G、4G</td></tr>
              <tr><td>FAT32</td><td>4×4G = 16G</td><td>1K、4K、16M…</td><td>4T、4G、16G、64G</td></tr>
            </tbody>
          </table>
          <p class="fig-cap">（课件原表 FAT32 一栏给出多种口径：4×4M = 16M、4×16M = 64M 等，上表按课件原样归纳主要口径。）</p>
          <h3 id="sec-ch6-alloc-h3">索引分配（单级/多级/UNIX 混合索引）</h3>
          <p><strong>什么是索引分配：索引文件</strong>——为每个文件设置索引表，存储其分配到的磁盘块号。所形成的文件结构称索引文件结构，物理文件称为索引文件。</p>
          <p><strong>单级索引：索引表的存储空间</strong>——假设磁盘块尺寸为 4KB，磁盘块号为 32bits，则每个磁盘块可以存储磁盘块号的数量为 4K/4 = 1K 个；而单级索引支持的文件尺寸为 1K × 4K = 4M。即小于 4M 文件的索引表只占 1 磁盘块。</p>
          <p><strong>二级和多级索引</strong>——对于索引表的存储，也采用索引表来记录其所占用的磁盘块号，从而形成二级索引。二级索引支持的文件尺寸为 1K × 1K × 4K = 4G；索引表占用空间 4K + 1K×4K。</p>
          <p><strong>混合索引分配方式（UNIX System V）</strong>——混合使用直接磁盘块号、各级索引表，从而可以既支持小文件的存储，也可以支持大文件的存储；达到降低索引表存储空间和同时支持大中小文件的目的。索引结点（i_node）中：直接地址 10 个（i.addr(0)～i.addr(9)）、一次间接地址、二次间接地址、三次间接地址（i.addr(12)）。</p>
          <svg class="fig" viewBox="0 0 900 240" role="img" aria-label="UNIX 混合索引：i_node 的直接地址与三级间接地址">
            <g font-size="13" text-anchor="middle" style="font-family:var(--font)">
              <g style="fill:var(--panel-solid);stroke:var(--deck-accent)" stroke-width="1.8">
                <rect x="60" y="40" width="150" height="170" rx="10"/>
              </g>
              <text x="135" y="30" style="fill:var(--ink)" font-weight="700">索引结点 i_node</text>
              <g style="fill:var(--ink-2)">
                <text x="135" y="68">i.addr(0)  直接地址</text>
                <text x="135" y="90">…</text>
                <text x="135" y="112">i.addr(9)  直接地址</text>
                <text x="135" y="134">i.addr(10) 一次间接</text>
                <text x="135" y="156">i.addr(11) 二次间接</text>
                <text x="135" y="178">i.addr(12) 三次间接</text>
              </g>
              <g style="fill:var(--panel-2);stroke:var(--hairline)">
                <rect x="300" y="52" width="140" height="30" rx="8"/>
                <rect x="300" y="126" width="140" height="30" rx="8"/>
                <rect x="300" y="176" width="140" height="30" rx="8"/>
              </g>
              <g style="fill:var(--ink-2)" font-size="12.5">
                <text x="370" y="72">10 个磁盘块号</text>
                <text x="370" y="146">1K 个磁盘块号</text>
                <text x="370" y="196">1K×1K 个磁盘块号</text>
              </g>
              <g style="stroke:var(--ink-3)" stroke-width="1.4" fill="none">
                <path d="M210,60 L300,64"/>
                <path d="M210,130 L300,140"/>
                <path d="M210,175 L300,188"/>
              </g>
              <text x="700" y="146" style="fill:var(--ink)" font-weight="700">混合索引分配方式支持的文件尺寸（4KB 块、32bits 块号）：</text>
              <text x="700" y="168" style="fill:var(--ink-2)" font-size="12.5" text-anchor="middle">直接：10×4K = 40K</text>
              <text x="700" y="186" style="fill:var(--ink-2)" font-size="12.5" text-anchor="middle">一次间接：1K×4K = 4M，总计 40K + 4M</text>
              <text x="700" y="204" style="fill:var(--ink-2)" font-size="12.5" text-anchor="middle">二次间接：1K×1K×4K = 4G，总计 40K + 4M + 4G</text>
              <text x="700" y="222" style="fill:var(--ink-2)" font-size="12.5" text-anchor="middle">三次间接：1K×1K×1K×4K = 4T，总计 40K + 4M + 4G + 4T</text>
            </g>
          </svg>
          <p class="fig-cap">图 6-1　UNIX System V 混合索引分配：i_node 直接地址 + 一/二/三次间接地址</p>
          <p><strong>索引分配的特点</strong>：即能顺序存取，又能随机存取；满足了文件动态增长、插入删除的要求；能充分利用外存空间；较多的寻道次数和寻道时间；索引表本身带来了系统开销（如内外存空间、存取时间）。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch6-dir',
      heading: '4. 目录管理',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>对文件目录管理的基本要求</strong>：「按名存取」（逻辑文件名称）；提高文件目录检索速度；文件共享；允许文件重名。</p>
          <h3 id="sec-ch6-dir-h1">文件控制块（FCB）与索引结点</h3>
          <p><strong>6.4.1 文件控制块</strong>（FCB, File Control Block）：<strong>什么是文件控制块</strong>——描述文件信息（文件属性）的数据结构，操作系统据此管理和读写文件。<strong>文件控制块包含的信息</strong>：</p>
          <ul>
            <li><strong>基本信息类</strong>：文件名、文件物理位置、文件逻辑结构、文件物理结构；</li>
            <li><strong>存取控制信息类</strong>：各类用户（文件主、核准用户等）存取权限；</li>
            <li><strong>使用信息类</strong>：文件的建立、修改、访问的日期时间，文件当前使用信息。</li>
          </ul>
          <p><strong>MS-DOS 的文件控制块</strong>（FAT16）：文件名、扩展名、属性(5bits)、时间、日期、文件尺寸、首块号等字段按字节位排列（0-7 文件名、8-10 扩展名、11 属性、22-23 时间、24-25 日期、26-27 首块号、28-31 文件尺寸等）。</p>
          <p><strong>文件目录</strong>：可看作是文件控制块数组。检索效率问题——FCB 中大量信息在检索中无用，但是占用 I/O 带宽和存储空间。</p>
          <p><strong>索引结点（i_node）</strong>：UNIX 系统将 FCB 中的<strong>文件名</strong>和文件的<strong>其余属性信息</strong>分开——前者用于组成文件目录，后者形成索引结点；两者之间通过索引结点编号相连。示例目录：test → 289，passwd.txt → 14，a.zip → 34，各自指向对应的索引结点。</p>
          <p><strong>内存索引结点和磁盘索引结点</strong>：<strong>磁盘索引结点</strong>——存放在磁盘，存储除文件名外的文件属性信息。<strong>内存索引结点</strong>——存放在内存，除包含复制的磁盘索引结点信息外，还有 (I) 索引结点编号、状态、访问计数；(II) 文件所属文件系统的逻辑设备号、链接指针。</p>
          <h3 id="sec-ch6-dir-h2">目录结构</h3>
          <p><strong>(1) 单级目录结构</strong>：整个文件系统中只建立一张目录表（组成一线性表），每文件占用一个目录项（FCB0…FCBn）。<strong>特点</strong>：查找速度慢；不允许重名；不便于文件共享。</p>
          <p><strong>(2) 二级目录结构</strong>：在主文件目录基础上，允许每个用户建立一个目录，文件存放在各用户子目录下。<strong>特点</strong>：改善目录检索速度；便于用户间文件重名；便于用户间文件共享。</p>
          <p><strong>(3) 多级目录结构（树型目录结构）</strong>：允许目录下都可以建立子目录，文件可存放在任意子目录下。<strong>特点</strong>：层次结构清晰，便于管理和保护；有利于文件分类；解决重名问题；提高文件检索速度；能进行存取权限的控制；缺点——查找一个文件按路径名逐层检查，由于每个文件都放在外存，多次访盘影响速度。</p>
          <p><strong>路径名（path name）</strong>：以多级目录结构中某结点为起点，将到树中其他结点的路径上的目录名、文件名依次连接起来（用 / 或 \\ 隔开），即构成路径名；起点确定，路径名唯一，此起点称为<strong>当前目录</strong>。<strong>绝对路径名</strong>：以根结点为起点的路径名；<strong>相对路径名</strong>：以除根结点外的任意结点为起点的路径名。例：当前目录 /B，文件名 M，相对路径名 E/M，绝对路径名 /B/E/M。</p>
          <h3 id="sec-ch6-dir-h3">目录查询技术</h3>
          <p><strong>线性检索法</strong>：分解路径名成各组成部分，然后依次查找各目录名、文件名。如 /B/E/M 分解成 4 部分：/、B、E、M。<strong>线性检索法：基于索引结点的文件目录检索</strong>——检索 /usr/ast/mbox 的过程：先读根目录文件找 usr 的目录项（取得其索引结点编号），再读 usr 目录文件找 ast，最后在 ast 目录文件中找 mbox，逐层从磁盘读入目录文件并比较。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch6-space',
      heading: '5. 文件存储空间管理',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>6.5.1 空闲表法</strong>——基本思想：系统为外存所有空闲区建立一张空闲表，每个空闲区对应一个空闲表项。</p>
          <p><strong>6.5.2 空闲链表法</strong>——基本思想：系统为外存所有空闲区拉成一张空闲盘区（块）表/链。空闲盘块链：结点代表一个空闲盘块；空闲盘区链：结点代表一个空闲盘区。</p>
          <p><strong>6.5.3 位示图法</strong>——基本思想：位示图利用二进制的一位来表示磁盘中一个盘块的使用情况。当其值为「0」时，表示对应的盘块空闲；为「1」时，表示已分配。<code>Var bitmap: array[1…m] of integer_16</code>。</p>
          <p><strong>磁盘块号与位示图行号、列号计算公式</strong>（b、i、j 均从 0 开始计数）：</p>
          <div class="formula">磁盘块号 b → 行 i、列 j：<span class="m">i = b ÷ n；j = b mod n</span>（n 为位示图宽度，常为字长）　行 i、列 j → 磁盘块号 b：<span class="m">b = i×n + j</span></div>
          <p><strong>6.5.4 成组链接法（UNIX）</strong>——基本思想：利用链栈存储所有的空闲磁盘块号；链栈的每个结点存储一组（例如 100 个）磁盘块号，其中最后一个磁盘块号指向下一组所在的磁盘块。<strong>相关算法</strong>：</p>
          <ul>
            <li><strong>磁盘初始化</strong>：(1) 内存设置空闲盘块号栈，可存储一组（链栈一个结点所能存储的磁盘块号数量上限，例如 100 个）空闲磁盘块号；(2) 读磁盘上链栈的栈顶结点到内存，以初始化空闲盘块号栈；</li>
            <li><strong>盘块回收过程</strong>：(1) 对于回收的磁盘块号，直接入内存空闲盘块号栈；(2) 如发现栈满，则将栈中数据（形成一组）写出到这个回收的磁盘块；(3) 清空内存空闲盘块号栈，将回收的磁盘块号入栈；</li>
            <li><strong>盘块分配过程</strong>：(1) 直接从内存空闲盘块号栈中出栈一个磁盘块号，分配出去；(2) 如是栈中最后一个磁盘块号，则从外存调入下组磁盘块号（就在这个最后一个磁盘块内）；(3) 分配这个最后一个磁盘块号。</li>
          </ul>
          `,
        },
      ],
    },
    {
      id: 'sec-ch6-share',
      heading: '6. 文件共享',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>6.6.1 基于索引结点的共享</strong>——基本原理：利用不同文件名指向相同索引结点（如 test 与 passwd.txt/pwd.txt 都指向索引结点 14）；也可以利用不同文件名或相同文件名（同一目录）指向相同索引结点。<strong>为何 UNIX 无直接删除文件的命令？</strong>——删除操作把目录项摘除并使索引结点链接计数减 1，只有当没有目录项再指向该索引结点时才能真正回收，因此是 unlink 而非删除文件。</p>
          <p><strong>6.6.2 基于符号链的共享</strong>——基本原理：利用符号链文件，其中存储被共享的文件路径名称。例如 Windows 的快捷方式文件（\\C\\A 与符号链指向同一路径）。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch6-consist',
      heading: '7. 数据一致性控制',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>6.7.1 事务机制</strong>——<strong>程序的脆弱性</strong>：一个示例——连续两个文件写入操作（<code>ofstream of1("c:\\grades.txt")</code> 写 No/grade，<code>ofstream of2("c:\\details.txt")</code> 写 No）中，若中途出错，两个文件的数据将不一致。</p>
          <p><strong>什么是事务</strong>：事务是一系列相关的数据项的读写操作。<strong>利用事务机制实现数据一致性控制的方法</strong>：① 设置事务日志（LOG），按时间顺序存放事务记录，LOG 存放在稳定存储器中；事务记录包括下列 4 类：② 事务开始：开始事务，&lt;Ti, 开始&gt;；③ 读写操作：事务记录；④ 事务结束（正常）：托付事务，&lt;Ti, 托付&gt;；⑤ 事务结束（异常）：夭折事务，&lt;Ti, 夭折&gt;。</p>
          <p><strong>事务记录</strong>：① 事务名——事务的唯一标识；② 数据项名——被修改数据项的名称（唯一）；③ 旧值——修改前数据项的值；④ 新值——修改后数据项的值。<strong>事务日志示例</strong>：LOG 中按时间顺序记录 &lt;T1, 开始&gt;、&lt;T2, 开始&gt;、T1/T2 的写记录、&lt;T2, 托付&gt;、&lt;T1, 托付&gt; 等。</p>
          <p><strong>事务的崩溃与恢复算法</strong>：<strong>Undo&lt;Ti&gt;</strong>——把所有被事务（无托付）修改后的数据项恢复为旧值；<strong>Redo&lt;Ti&gt;</strong>——把所有被事务（有托付）修改后的数据项重新置为新值。崩溃点之后：已托付的事务 Redo，未托付的事务 Undo。</p>
          <p><strong>检查点机制</strong>：设置检查点（checkpoint），定时刷新事务日志记录和被修改数据到稳定存储器。<strong>恢复算法</strong>：可仅对最后一个检查点后的记录进行处理（Undo/Redo 同上）。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch6-exercise',
      heading: '8. 本章习题',
      blocks: [
        {
          type: 'html',
          html: `
          <p>修订版教材 P219：习题 4、17、19、12（按课件原样收录）。</p>
          `,
        },
      ],
    },
  ],
};

export default ch;
