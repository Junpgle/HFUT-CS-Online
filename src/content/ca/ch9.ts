/* 计算机体系结构 · 第9讲 存储层次架构 —— 依据「课件/09-存储层次架构.pptx」（李建华，27 页）整理 */
import type { CaChapter } from './types';

const ch: CaChapter = {
  id: 'ch9',
  no: '第9讲',
  title: '存储层次架构',
  subtitle: '第 9 讲 · 存储层次架构',
  lede: `
  存储器是「理想与现实冲突」最激烈的地方：更大就更慢、更快就更贵。本讲用<strong>局部性原理</strong>把矛盾化解为<strong>存储层次架构</strong>——把数据搬到离 CPU 近的地方；
        给出 DRAM/SRAM 的技术对比、现代存储层次的容量与延迟量级，以及<strong>访存延迟递推公式</strong> T<sub>i</sub> = t<sub>i</sub> + m<sub>i</sub>·T<sub>i+1</sub> 与 AMAT 的分解。
`,
  toc: [
    { id: 'sec-ch9-view', text: '1. 程序员视角与理想的存储器', level: 2 },
    { id: 'sec-ch9-tech', text: '2. SRAM 与 DRAM', level: 2 },
    { id: 'sec-ch9-locality', text: '3. 局部性原理', level: 2 },
    { id: 'sec-ch9-hierarchy', text: '4. 存储层次架构', level: 2 },
    { id: 'sec-ch9-latency', text: '5. 访存延迟递推与 AMAT', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ch9-view',
      heading: '1. 程序员视角与理想的存储器',
      blocks: [
        {
          type: 'html',
          html: `
          <p>在当前机器中，程序员看到的是<strong>虚拟的存储器</strong>：每个程序员认为存储器是无限大的，而现实中物理存储器的大小远小于程序员认为的大小。系统（软件 + 硬件）动态地把虚拟地址映射到物理存储，把物理存储器虚拟化，这对程序员是<strong>透明</strong>的。</p>
          <ul>
            <li><strong>优点</strong>：程序员不需要知道存储器大小、不需要管理物理存储；较小的存储器可当作巨大的存储器使用——life is easier, coding is fun；</li>
            <li><strong>缺点</strong>：更复杂的软件和硬件（MMU 和相应的中间件）。</li>
          </ul>
          <p><strong>理想的存储器</strong>具备：零延迟、容量无限大、零开销、完美的控制流（无流水线暂停）；带宽无限大；零延迟的互连；足够多的功能单元；零延迟的计算。理想 vs 现实是冲突的：</p>
          <ul>
            <li><strong>Bigger is slower</strong>：更大的存储器需要更长时间来寻址（寻找目标）；</li>
            <li><strong>Faster is more expensive</strong>（dollars and chip area）；</li>
            <li><strong>Higher bandwidth is more expensive</strong>：需要更多 Bank、接口数、工作频率，或者说需要更快的技术。</li>
          </ul>
          `,
        },
      ],
    },
    {
      id: 'sec-ch9-tech',
      heading: '2. SRAM 与 DRAM',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>DRAM</strong>：电容里电荷的状态表明存储的信息（1 个电容 + 1 个访问晶体管）。电容会沿 RC 路径泄露电荷——存储单元随时间推移会丢失电荷，因此需要周期性（如 64ms）<strong>刷新</strong>。</p>
          <p><strong>SRAM</strong>：用二个交叉耦合的反相器存储一个 bit（4 个晶体管存储 + 2 个晶体管访问，6T cell）；反馈路径使保存的值稳定存在 cell 里。</p>
          <table class="tbl">
            <thead><tr><th></th><th>DRAM</th><th>SRAM</th></tr></thead>
            <tbody>
              <tr><td>访问速度</td><td>较慢（capacitor）</td><td>较快（no capacitor）</td></tr>
              <tr><td>存储密度</td><td>大（1T-1C cell）</td><td>小（6T cell）</td></tr>
              <tr><td>开销</td><td>低</td><td>高</td></tr>
              <tr><td>刷新</td><td>需要（功耗、性能、电路复杂度）</td><td>不需要</td></tr>
              <tr><td>工艺</td><td>生产需要将 capacitor 和 CMOS 逻辑电路放一起</td><td>生产过程与 CMOS 逻辑兼容（no capacitor）</td></tr>
            </tbody>
          </table>
          <p><strong>量级（课件数据，随年代变化）</strong>：SRAM 512 Bytes（sub-nanosec）、SRAM KByte~MByte（~nanosec）、DRAM Gigabyte（~50 nanosec）、Hard Disk Terabyte（~10 millisec）；价格：SRAM &lt; 10$ / MB、DRAM &lt; 1$ / MB、Hard Disk &lt; 1$ / GB。新兴技术：Flash memory、PC-RAM、MRAM、RRAM（not mature yet）。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch9-locality',
      heading: '3. 局部性原理',
      blocks: [
        {
          type: 'html',
          html: `
          <p>我们要既快、又大、又便宜的存储器，而用同一种存储技术无法同时达成——解决方案是<strong>存储层次</strong>，其可行性来自程序的局部性：</p>
          <ul>
            <li><strong>时间局部性</strong>（Temporal Locality）：当前所访问的指令或者数据不久会被再次访问；</li>
            <li><strong>空间局部性</strong>（Spatial Locality）：当前所访问的指令或者数据的周边数据，在不久的将来会被访问。</li>
          </ul>
          <p>典型程序的存储器访问序列存在大量局部性，因为程序由大量「loops」和数据结构构成：</p>
          <ul>
            <li>Temporal：一个程序倾向于多次访问相同的存储位置，并且是在一个小的时间窗口内；</li>
            <li>Spatial：一个程序倾向于一次连续访问一组存储位置——例如指令存储器的访问（顺序取指）、数组或数据结构的访问。</li>
          </ul>
          <div class="callout tip">
            <p>高速缓存的两个想法分别对应两种局部性：<strong>想法 1</strong>（时间局部性）——将最近访问的数据存放于一个自动管理的快速存储里（cache）；<strong>想法 2</strong>（空间局部性）——将地址相邻于当前所访问数据的内容保存在快速存储器中（把访问的块整个取到高速缓存）。Wilkes 1965 年提出 slave memory 的想法；IBM 360/85 首次实现 16KB cache + 64B block。</p>
          </div>
          `,
        },
      ],
    },
    {
      id: 'sec-ch9-hierarchy',
      heading: '4. 存储层次架构',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>为什么采用存储层次架构</strong>：存储级别离 CPU 越远，可以使用较大和较慢的存储技术；此外，确保 CPU 当前需要的大多数数据能够在较近的存储级别里找到——当访问行为具有很好的局部性时，整个存储可以<strong>既快又大</strong>。</p>
          <svg class="fig" viewBox="0 0 720 300" role="img" aria-label="存储层次金字塔：从寄存器到磁盘，容量增大、速度变慢">
            <g font-size="12" text-anchor="middle" style="font-family:var(--font)">
              <g style="fill:var(--deck-accent);stroke:var(--deck-accent)" stroke-width="1.2">
                <path d="M330,20 L390,20 L378,70 L342,70 Z" opacity="0.30"/>
                <path d="M300,70 L420,70 L406,120 L314,120 Z" opacity="0.24"/>
                <path d="M270,120 L450,120 L436,170 L284,170 Z" opacity="0.20"/>
                <path d="M240,170 L480,170 L466,220 L254,220 Z" opacity="0.16"/>
                <path d="M210,220 L510,220 L496,270 L224,270 Z" opacity="0.12"/>
              </g>
              <g style="fill:var(--ink)" font-weight="700">
                <text x="360" y="53">寄存器</text>
                <text x="360" y="103">L1 缓存</text>
                <text x="360" y="153">L2 / L3 缓存</text>
                <text x="360" y="203">主存 DRAM</text>
                <text x="360" y="253">磁盘 / SSD</text>
              </g>
              <g style="fill:var(--ink-3)" font-size="11.5">
                <text x="360" y="292">越往上：更快、更小、更贵；越往下：更慢、更大、更便宜</text>
              </g>
              <g style="stroke:var(--ink-3)" stroke-width="1.3" fill="none">
                <path d="M60,40 L60,270" marker-end="url(#ca-arr4)"/>
                <text x="48" y="160" text-anchor="middle" transform="rotate(-90 48 160)" style="fill:var(--ink-3)" font-size="11.5">容量增大 · 延迟增大</text>
              </g>
              <defs><marker id="ca-arr4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--ink-3)"/></marker></defs>
            </g>
          </svg>
          <p class="fig-cap">图 9-1　存储层次架构：容量与延迟同向增长，用层次换速度</p>
          <p><strong>层次的管理方式</strong>：</p>
          <ul>
            <li><strong>Manual（手工）</strong>：程序员管理不同存储层级间的数据移动——对大程序很痛苦（上世纪 50 年代的 core vs drum；一些嵌入式系统的 scratch pad）；</li>
            <li><strong>Automatic（自动）</strong>：硬件管理层级间的数据移动，对程序员透明——写正确的程序不需要知道缓存多大、如何工作；但<strong>写出运行速度很快的程序</strong>则需要（key programmer requirement）。</li>
          </ul>
          <p><strong>现代存储层次</strong>：</p>
          <table class="tbl">
            <thead><tr><th>层级</th><th>典型容量</th><th>典型延迟</th><th>管理</th></tr></thead>
            <tbody>
              <tr><td>Register File</td><td>32 words</td><td>sub-nsec</td><td>manual / compiler（register spilling）</td></tr>
              <tr><td>L1 cache</td><td>~32 KB</td><td>~nsec</td><td>automatic（HW cache management）</td></tr>
              <tr><td>L2 cache</td><td>512 KB ~ 1 MB</td><td>many nsec</td><td>automatic</td></tr>
              <tr><td>L3 cache</td><td>数 MB~数十 MB</td><td>~10+ nsec</td><td>automatic</td></tr>
              <tr><td>Main memory（DRAM）</td><td>GB</td><td>~100 nsec</td><td>demand paging（OS + HW）</td></tr>
              <tr><td>Swap Disk</td><td>100 GB</td><td>~10 msec</td><td>demand paging</td></tr>
            </tbody>
          </table>
          <p><strong>流水线中的高速缓存</strong>：高速缓存需要非常紧凑地整合到流水线中，理想情况下一个周期的访问延迟、相关的操作不会暂停流水线；若流水线工作频率很高，配置的缓存不能大——但我们想同时拥有大容量缓存和快速流水线，方案是<strong>缓存层次架构</strong>（L1 + L2 …）。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch9-latency',
      heading: '5. 访存延迟递推与 AMAT',
      blocks: [
        {
          type: 'html',
          html: `
          <p>对给定的存储层级 i：它有由存储技术和配置决定的访问延迟 t<sub>i</sub>，也有感知到的访问延迟 T<sub>i</sub>（T<sub>i</sub> &gt; t<sub>i</sub>）。除最外层外，按地址查找时：</p>
          <ul>
            <li>命中概率 h<sub>i</sub>，相应的访问时间 t<sub>i</sub>；</li>
            <li>缺失概率 m<sub>i</sub>，相应的访问时间 t<sub>i</sub> + T<sub>i+1</sub>；</li>
            <li>其中 h<sub>i</sub> + m<sub>i</sub> = 1。</li>
          </ul>
          <div class="formula"><span class="m">T<sub>i</sub> = h<sub>i</sub>·t<sub>i</sub> + m<sub>i</sub>·(t<sub>i</sub> + T<sub>i+1</sub>) = t<sub>i</sub> + m<sub>i</sub>·T<sub>i+1</sub></span></div>
          <p><strong>设计目标</strong>：在可允许的开销下达到预期的 T<sub>1</sub>；期望 T<sub>i</sub> 逼近 t<sub>i</sub>。</p>
          <ul>
            <li><strong>Keep m<sub>i</sub> low</strong>：提高容量 C<sub>i</sub> 会降低 m<sub>i</sub>，但可能增加 t<sub>i</sub>；通过智能的管理方法降低 m<sub>i</sub>（如替换策略：猜测你不要的；预取：猜测你需要的）；</li>
            <li><strong>Keep T<sub>i+1</sub> low</strong>：更快的高层存储设计，但要小心增加开销；通过引入中间层级做折中（多级缓存）。</li>
          </ul>
          <p><strong>缓存的抽象与评估指标</strong>：</p>
          <div class="formula"><span class="m">hit rate = #hits / (#hits + #misses) = #hits / #accesses</span></div>
          <div class="formula">AMAT = <span class="m">(hit-rate × hit-latency) + (miss-rate × miss-latency)</span></div>
          <p>问题：降低 AMAT 一定能提升性能吗？（不一定——还要看指令吞吐、缺失的重叠等，后续章节展开。）</p>
          <p>通俗地说：任何能记住/保存频繁使用的结果、避免长延时重新获取的结构，都叫高速缓存——例如 Web 缓存。更常见的指片上存储：一个基于 SRAM 的自动管理的存储层级，把 DRAM/下一级缓存中频繁访问的内容保存在 SRAM 里。缓存设计的五个关键问题（下一讲展开）：查找与放置、替换、块大小、写策略、指令与数据是否分开。</p>
          `,
        },
      ],
    },
  ],
};

export default ch;
