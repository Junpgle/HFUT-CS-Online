/* 计算机体系结构 · 第12讲 虚拟存储器 —— 依据「课件/12-虚拟存储器.pptx」（李建华，54 页）整理 */
import type { CaChapter } from './types';

const ch: CaChapter = {
  id: 'ch12',
  no: '第12讲',
  title: '虚拟存储器',
  subtitle: '第 12 讲 · 虚拟存储器',
  lede: `
  本讲分两半：前半讲<strong>主存（DRAM）的组织</strong>——Row Buffer、Channel/DIMM/Rank/Chip/Bank 的层次，以及一个 64B 缓存块如何分 8 个 I/O 周期读出；
        后半讲<strong>虚拟存储器</strong>——好处、与 cache 对应的四个核心问题（放置/标识/替换/写策略）、页错误与地址转换（PTBR、多级页表）、<strong>TLB</strong>，
        以及保护、共享带来的<strong>同名异物与异名同物</strong>问题。
`,
  toc: [
    { id: 'sec-ch12-dram', text: '1. 主存（DRAM）的组织', level: 2 },
    { id: 'sec-ch12-why', text: '2. 虚拟存储器的好处', level: 2 },
    { id: 'sec-ch12-four', text: '3. VM 的四个核心问题', level: 2 },
    { id: 'sec-ch12-fault', text: '4. 页错误与地址转换', level: 2 },
    { id: 'sec-ch12-tlb', text: '5. TLB', level: 2 },
    { id: 'sec-ch12-protect', text: '6. 保护、共享与同义同物', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ch12-dram',
      heading: '1. 主存（DRAM）的组织',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>现状</strong>：更多的核 → 更多的并发性 → 更大的工作集；越来越多应用是数据密集型；很多应用/虚拟机共享内存（数据中心 Servers、GP-GPU、Mobile）。差距：核的数量约每 2 年翻番，DRAM DIMM 容量约每 3 年翻番——<strong>每个核拥有的内存大小每 2 年减少 30%</strong>，每个核的内存带宽更严峻。能耗也是核心问题：IBM 服务器约 50% 功耗用于内存系统（Lefurgy, IEEE Computer 2003）；DRAM 空闲也耗能、周期性刷新也耗能。</p>
          <p><strong>Bank 的组织</strong>：DRAM bank 是由存储单元构成的二维阵列 rows × columns。读操作处理过程：</p>
          <ol>
            <li>译码行地址 &amp; 驱动 word-lines（字线）；</li>
            <li>选择的 bits 驱动 bit-lines（位线）——读取整行；</li>
            <li>放大行数据，存入 <strong>Row Buffer</strong>；</li>
            <li>译码列地址 &amp; 选择行中的一部分——发送到输出端；</li>
            <li>预充电 bit-lines——为下一次访问做准备。</li>
          </ol>
          <p><strong>页模式 DRAM</strong>：页模式下 DRAM row 又叫 DRAM page，Sense amplifiers 又叫 row buffer；每个地址就是一个 &lt;row, column&gt; 对。访问一个「closed row」：Activate 打开 row（数据放到 row buffer）→ Read/write 读写 row buffer 中的 column → Precharge 关闭 row；访问一个「open row」不需要 activate。行命中（HIT）很快；跨行访问是 CONFLICT（需要先 precharge + activate）。</p>
          <svg class="fig" viewBox="0 0 740 320" role="img" aria-label="DRAM 系统层次：Channel / DIMM / Rank / Chip / Bank / Row / Column">
            <g font-size="11.5" text-anchor="middle" style="font-family:var(--font)">
              <g style="fill:var(--panel-2);stroke:var(--deck-accent)" stroke-width="1.4">
                <rect x="40" y="24" width="220" height="52" rx="8"/>
                <rect x="40" y="92" width="220" height="52" rx="8"/>
                <rect x="300" y="24" width="180" height="52" rx="8"/>
                <rect x="520" y="24" width="180" height="52" rx="8"/>
                <rect x="300" y="92" width="180" height="52" rx="8"/>
                <rect x="520" y="92" width="180" height="52" rx="8"/>
              </g>
              <g style="fill:var(--ink)" font-weight="700">
                <text x="150" y="46">Channel 0</text>
                <text x="150" y="114">Channel 1</text>
                <text x="390" y="46">DIMM（内存条）</text>
                <text x="610" y="46">Rank</text>
                <text x="390" y="114">Chip（4-16 bit 接口）</text>
                <text x="610" y="114">Bank（通常 8 个）</text>
              </g>
              <g style="fill:var(--ink-3)" font-size="11">
                <text x="150" y="64">独立内存控制器</text>
                <text x="150" y="132">DIMM 的拆分</text>
                <text x="390" y="64">Dual in-line memory module</text>
                <text x="610" y="64">多个 chip 共享地址/命令、宽数据</text>
                <text x="390" y="132">Chip 内 bank 共享三条总线</text>
                <text x="610" y="132">二维阵列 rows × columns</text>
              </g>
              <g style="fill:var(--panel-2);stroke:var(--hairline)" stroke-width="1.2">
                <rect x="40" y="170" width="660" height="120" rx="8"/>
              </g>
              <g style="fill:var(--ink-2)" font-size="11.5" text-anchor="start">
                <text x="60" y="194">Bank = Row 0..16k-1 × Column（BANK 的拆分：每行 2KB，每列 1B）</text>
                <text x="60" y="218">访问 &lt;row, col&gt;：closed row → Activate + Read/Write + Precharge；open row → 直接 Read/Write</text>
                <text x="60" y="242">Row Buffer（sense amplifiers）缓存刚打开的一整行；跨行访问 = CONFLICT</text>
                <text x="60" y="266">一个 64B 缓存块需要 8 个 I/O 周期传输，8 列数据顺序读取（DDR 每个周期传 8B）</text>
              </g>
              <text x="370" y="308" style="fill:var(--ink-3)" font-size="11">物理地址空间 → Channel / DIMM / Rank / Chip 的交错映射</text>
            </g>
          </svg>
          <p class="fig-cap">图 12-1　DRAM 系统的组织层次（Channel → DIMM → Rank → Chip → Bank → Row/Column/Cell）</p>
          <p><strong>Chip、Rank 与 DIMM</strong>：Chip 由多个 bank（今天通常 8 个）构成，接口宽度很小（4-16 bits），chip 内 bank 共享地址/命令/数据三条总线。Rank：多个 chip 协同操作形成更宽的接口（通常 8 个 chip），由相同信号控制、响应同一命令、共享地址和命令总线但不共享数据总线。DIMM 由一个或多个 rank 构成（当前插到主板上的内存条）。一个 64-bit 宽的单 rank DIMM 操作起来像一个宽接口的大容量 chip，内存控制器不需要处理单个 chip；代价是访问粒度固定（不能小于接口宽度），灵活性有限。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch12-why',
      heading: '2. 虚拟存储器的好处',
      blocks: [
        {
          type: 'html',
          html: `
          <ul>
            <li>主存成为整个存储层次架构中另外一层（<strong>磁盘的缓存</strong>）；</li>
            <li>使程序能使用的地址空间或者工作集能够<strong>超过可用的物理内存</strong>的大小；</li>
            <li>不再需要程序员来管理存储分配等繁琐细节；离散地使用大的地址空间成为可能；</li>
            <li>允许多个用户、多个程序分时地共享有限的内存空间和地址空间——提升昂贵内存的利用率、提升程序开发效率；</li>
            <li>每个程序认为当前内存里它是独占运行的（假象）：可以认为每个程序都从地址 0x0 开始；</li>
            <li><strong>内存保护易于实现</strong>：每个程序都有自己私有的逻辑地址空间，其它程序不可访问；</li>
            <li>系统获得更好性能：仅需从磁盘加载一个程序当前所需的部分数据，就能够运行这个程序。</li>
          </ul>
          `,
        },
      ],
    },
    {
      id: 'sec-ch12-four',
      heading: '3. VM 的四个核心问题',
      blocks: [
        {
          type: 'html',
          html: `
          <p>存储层次架构的 4 个核心问题：<strong>Placement</strong>（来自内存的 block 放到哪里）、<strong>Identification</strong>（如何查找 block）、<strong>Replacement</strong>（如何为新进的 block 提供空闲位置）、<strong>Write Policy</strong>（如何传播 block 的更新）。对不同的存储层级分别考虑：</p>
          <table class="tbl">
            <thead><tr><th>存储类型</th><th>Placement</th><th>备注</th></tr></thead>
            <tbody>
              <tr><td>Registers</td><td>Anywhere；Int、FP、SPR</td><td>Compiler/programmer manages</td></tr>
              <tr><td>Cache（SRAM）</td><td>Fixed in H/W</td><td>Direct-mapped、set-associative、fully-associative</td></tr>
              <tr><td>DRAM</td><td>Anywhere</td><td>OS manages</td></tr>
              <tr><td>Disk</td><td>Anywhere</td><td>OS manages</td></tr>
            </tbody>
          </table>
          <p><strong>VM 的 Placement</strong>：内存以较大的块（Page）管理，Page size 典型值 4K–16K（近年出现 super page 以减少 PT 开销）；采用<strong>全相联</strong>方式，Placement 很灵活——OS 负责，通过查询<strong>页表</strong>（Page Table, PT）处理读、写；PT 维持 VA（虚拟地址）与 PA（物理地址）之间的映射。</p>
          <p><strong>全相联是否意味着查找代价巨大？</strong>对 cache 来说查找代价大（硬件需要很多比较器并行比较标签）；对 VM 来说，昂贵的查找可以通过页表来避免——页表就是查找表或哈希表，其查找引入一层间接性（额外的访问延迟）。对 VM 来说，延迟长一点不是问题。</p>
          <p><strong>Identification</strong>：页表类似于 cache 的 tag store；页表项主要包括 VA、PA、dirty bit 等。虚拟地址对共享系统中的多个程序可以一样且不会冲突；物理地址对程序员不可见，由 OS 管理，可按需创建删除释放和改变（Demand Paging）。</p>
          <p><strong>Replacement</strong>：与 cache 类似（FIFO、LRU；开销大、可用近似算法——Clock 算法引入 reference bit；Random），由 OS 管理实现。</p>
          <p><strong>Write Policy</strong>：通常采用 <strong>write back</strong>（write through 对 disk 太慢）；页表维持每个页面的 dirty bit，硬件第一次写页面时置位，OS 在替换时检查——dirty 的 victim page 需写回下一级。磁盘写延迟约 10+ ms，SSD 约 1.5ms（好的情况）。</p>
          <p><strong>为什么 VM 可以用软件管理</strong>：cache 的实现采取固定策略、用硬件 FSM 控制；而 VM 中页错误的开销与缓存缺失的开销差别很大（1.5ms ≈ 3 Million 处理器周期 @2GHz），一些机制在设计时的工程选择可以很不一样。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch12-fault',
      heading: '4. 页错误与地址转换',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>页错误</strong>（Page Fault）：访问的页面（page）不在内存中——产生异常，需要保存 PC 等、进行上下文切换（context switch），调用 OS 中的 page fault handler：</p>
          <ol>
            <li>查找一个物理页面（可能发生替换）；</li>
            <li>从磁盘中获取目标页面；</li>
            <li>切换到另外一个处于就绪状态的任务去运行；</li>
            <li>磁盘访问完成时发中断请求；获得响应后，重启原来的指令。</li>
          </ol>
          <p><strong>地址转换</strong>：OS 和硬件通过 PTE（页表项）进行交互。如何查找一个 PTE？</p>
          <div class="formula">&amp;<span class="m">PTE</span> = <span class="m">PTBR</span> + <span class="m">page number</span> × <span class="m">sizeof(PTE)</span></div>
          <ul>
            <li><strong>PTBR</strong>（Page Table Base Register）对每个进程私有；上下文切换会替换 PTBR 保存的内容；</li>
            <li>PTE 的内容：VA | PA | Dirty | Ref | Protection（Read/Write/Execute）；</li>
            <li>地址转换：VA 拆为 <strong>Virtual Page Number + Offset</strong>，VPN 查页表得到 PA 的页框号，与 Offset 拼成物理地址。</li>
          </ul>
          <p><strong>页表能有多大？</strong>32 位地址、4K 页（1K 个 PTE）、每个 PTE 4B：2<sup>32</sup> / 4K × 4B = <strong>4M 每程序</strong>！对 64 位机器情况要糟糕很多。如何减少页表大小：<strong>多级页表</strong>、inverted（hashed）page table（本课程不详细介绍）。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch12-tlb',
      heading: '5. TLB',
      blocks: [
        {
          type: 'html',
          html: `
          <p>PTE 的访问会造成额外的内存访问：每条指令（fetch/load/store）现在需要 <strong>2 次</strong>内存访问（先读 PTE 再读数据），对多级页表或哈希冲突时可能更多；即使对 PTE 进行缓存，依然很慢。</p>
          <p>因此，当前 CPU 使用特殊的缓冲来保存 PTEs——<strong>TLB</strong>（translation lookaside buffer），用于缓存当前一段时间使用的 PTEs，期望利用页表访问的局部性来提升性能。</p>
          <p>TLB 的组织与 cache 类似（通常全相联或高相联、以 VPN 为 tag），命中则直接得到 PA 的页框号；未命中则访问页表（可能触发 page fault）并回填 TLB。（课件以示意图给出 TLB 与 cache 的配合：VA 先查 TLB → PPN + offset → PA → 查 cache。）</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch12-protect',
      heading: '6. 保护、共享与同义同物',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>保护</strong>：每个进程有自己私有的虚拟地址空间，这样可<strong>自动地</strong>实现对恶意程序的防护。</p>
          <p><strong>共享</strong>：共享成为可能、必要和期望的特性——避免复制、过期数据等问题；共享可以是可控的共享，可以给共享的页面赋予特定权限（Read、Write、Execute 及组合），权限保存在 PTE 和 TLB 里。共享内存位置的方式：将共享的物理内存位置映射到共享者的虚拟地址空间里。例如 PA 0xC00DA 对应的虚拟地址可以是 VA 0x2D000DA for process 0、VA 0x4D000DA for process 1——均可读写共享位置 0xC00DA。</p>
          <p>思考：虚拟地址加共享会带来什么问题？——<strong>同名异物（homonym）与异名同物（synonym）</strong>：</p>
          <div class="callout warn">
            <p><strong>VA Homonyms（同名异物）</strong>：Same VA to different PA（多任务、多进程环境）。问题：缓存按 VA 索引时会混淆不同进程的数据。解决：context switch 时 flush cache；每个 tag 加进程 ID；使用物理寻址的 cache。</p>
            <p><strong>VA Synonyms（异名同物）</strong>：Different VA to same PA（共享）。可能得到同一物理行的两份副本。解决：硬件同义检测；context switch 时 flush（对地址空间内部的别名无效）；检测同义并保证全为只读或只映射一份；限制 VM 映射使同义词映射到同一 cache set。</p>
          </div>
          `,
        },
      ],
    },
  ],
};

export default ch;
