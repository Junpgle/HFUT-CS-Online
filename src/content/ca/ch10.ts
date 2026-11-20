/* 计算机体系结构 · 第10讲 高速缓冲存储器 —— 依据「课件/10-高速缓冲存储器.pptx」（李建华，31 页）整理 */
import type { CaChapter } from './types';

const ch: CaChapter = {
  id: 'ch10',
  no: '第10讲',
  title: '高速缓冲存储器',
  subtitle: '第 10 讲 · 高速缓冲存储器',
  lede: `
  本讲把 cache 的五个设计问题逐一讲清：<strong>地址划分与三种映射</strong>（直接相联 / 组相联 / 全相联）、<strong>相联度的权衡</strong>、
        <strong>替换策略</strong>（LRU 实现、Belady OPT、set thrashing）、<strong>写策略</strong>（写回/写直达、写分配/不分配）与<strong>多级缓存</strong>，
        最后归纳<strong>三类缺失</strong>（强制性/容量/冲突）与减少办法。期末的 cache 地址划分与缺失率计算都出自本讲。
`,
  toc: [
    { id: 'sec-ch10-map', text: '1. 地址划分与直接相联', level: 2 },
    { id: 'sec-ch10-assoc', text: '2. 组相联与全相联', level: 2 },
    { id: 'sec-ch10-replace', text: '3. 替换策略', level: 2 },
    { id: 'sec-ch10-write', text: '4. 写策略与写分配', level: 2 },
    { id: 'sec-ch10-multilevel', text: '5. 多级缓存与参数', level: 2 },
    { id: 'sec-ch10-miss', text: '6. 缺失的分类与减少办法', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ch10-map',
      heading: '1. 地址划分与直接相联',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>基本概念</strong>：内存逻辑上被划分为固定大小的块（blocks/lines）；每个 block 会被映射到缓存中的一个确定的组，由地址中的 <strong>index bits</strong> 确定目标组。缓存的访问：</p>
          <ul>
            <li>用 index bits 索引到可能的目标 tag 和 data 存储；</li>
            <li>检查地址中的 <strong>tag</strong> 与 tag store 中对应的 tag 是否匹配；</li>
            <li>同时检查 tag 存储中的 <strong>valid bit</strong> 是否有效；</li>
            <li>命中当且仅当 tag 匹配且该 block 有效。</li>
          </ul>
          <svg class="fig" viewBox="0 0 700 280" role="img" aria-label="缓存地址的三段划分与直接相联的查找过程">
            <g font-size="12" text-anchor="middle" style="font-family:var(--font)">
              <text x="60" y="30" text-anchor="start" style="fill:var(--ink)" font-weight="700">地址划分（8-bit 地址示例：3 + 3 + 2）</text>
              <g style="fill:var(--panel-2);stroke:var(--deck-accent)" stroke-width="1.4">
                <rect x="60" y="44" width="150" height="40" rx="8"/>
                <rect x="214" y="44" width="150" height="40" rx="8"/>
                <rect x="368" y="44" width="130" height="40" rx="8"/>
              </g>
              <g style="fill:var(--ink-2)">
                <text x="135" y="69">tag（3 bits）</text>
                <text x="289" y="69">index（3 bits）</text>
                <text x="433" y="69">block offset（2b）</text>
              </g>
              <text x="135" y="102" style="fill:var(--ink-3)" font-size="11.5">判断「是不是我要的块」</text>
              <text x="289" y="102" style="fill:var(--ink-3)" font-size="11.5">定位到哪一组/哪一个位置</text>
              <text x="433" y="102" style="fill:var(--ink-3)" font-size="11.5">块内字节偏移</text>
              <g style="fill:var(--panel-2);stroke:var(--hairline)" stroke-width="1.2">
                <rect x="60" y="130" width="300" height="130" rx="8"/>
              </g>
              <text x="210" y="150" style="fill:var(--ink)" font-weight="700" font-size="12">Tag Store（index 选址 · V + tag）</text>
              <g style="fill:var(--ink-3)" font-size="11.5">
                <text x="210" y="176">V | tag</text>
                <text x="210" y="196">V | tag</text>
                <text x="210" y="216">V | tag</text>
                <text x="210" y="236">… 共 8 个位置（8 blocks）</text>
              </g>
              <g style="stroke:var(--ink-3)" stroke-width="1.3" fill="none">
                <path d="M360,195 L440,195"/>
                <text x="400" y="186" style="fill:var(--ink-3)" font-size="11.5">=？</text>
              </g>
              <g style="fill:var(--panel-2);stroke:var(--hairline)" stroke-width="1.2">
                <rect x="440" y="130" width="200" height="130" rx="8"/>
              </g>
              <text x="540" y="150" style="fill:var(--ink)" font-weight="700" font-size="12">Data Store（64 B = 8×8 B）</text>
              <g style="fill:var(--ink-3)" font-size="11.5">
                <text x="540" y="176">block 0</text>
                <text x="540" y="196">block 1</text>
                <text x="540" y="216">block 2</text>
                <text x="540" y="236">… block 7</text>
              </g>
              <text x="350" y="276" style="fill:var(--ink-3)" font-size="11.5">直接相联：index 直接选中唯一位置，只用 tag 比较一次</text>
            </g>
          </svg>
          <p class="fig-cap">图 10-1　地址的 tag / index / offset 三段划分（以 64 B 缓存、8 B 块为例）</p>
          <p><strong>直接相联的配置示例</strong>：字节寻址、256 B 主存、8 byte/block → 32 blocks；缓存 64 B → 8 blocks。每次存取：index（3 位）→ 位置，比较 tag（3 位）+ valid；块内偏移 2 位。</p>
          <p><strong>直接相联的问题</strong>：一个 block 只能保存到唯一的一个位置；具有相同 index bits 的地址会映射到相同的缓存块，从而发生冲突。若地址 A 和 B 具有相同 index、不同 tag，按 A、B、A、B… 访问时<strong>所有访问都是缺失</strong>（conflict misses）——这个现象叫<strong>乒乓效应</strong>（ping-pong effect）。循环访问超过 1 个同 index 的 block 时命中率为 0。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch10-assoc',
      heading: '2. 组相联与全相联',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>组相联</strong>（set-associative）：地址 0 和 8 在直接相联缓存里总是冲突——与其使用 1 列 8 个块，不如使用 2 列结构（每列 4 块）。关键想法：使用<strong>组</strong>的概念来设计相联存储。</p>
          <ul>
            <li>+ 可以更好地容纳缓存块（较少的冲突缺失）；</li>
            <li>− 更加复杂，访问速度变慢，tag 所需存储增加。</li>
          </ul>
          <p><strong>4-路组相联</strong>：发生冲突（失效）的概率进一步降低；代价是更多的 tag 比较器、更宽的数据 mux、更大的 tag 存储。</p>
          <p><strong>全相联</strong>：block 可以放置到缓存中的任何位置（没有 index，只有 tag 与 offset），需要与所有 tag 并行比较。</p>
          <p><strong>相联度</strong>（associativity）：多少个 block 可以放置到相同的组？</p>
          <table class="tbl">
            <thead><tr><th></th><th>高相联度</th><th>低相联度</th></tr></thead>
            <tbody>
              <tr><td>命中率</td><td>较高；收益有<strong>衰减趋势</strong>（为什么？）</td><td>较低</td></tr>
              <tr><td>访问速度</td><td>较慢（命中延迟和数据访问延迟）</td><td>较快，对 L1 尤其重要</td></tr>
              <tr><td>硬件开销</td><td>更大（需要更多的比较器）</td><td>小</td></tr>
            </tbody>
          </table>
          `,
        },
      ],
    },
    {
      id: 'sec-ch10-replace',
      heading: '3. 替换策略',
      blocks: [
        {
          type: 'html',
          html: `
          <p>可以认为缓存组中每个 block 均具有「priority」（重要程度）。关键问题：如何决定/调整 block priorities？在三个地方可以调整：</p>
          <ul>
            <li><strong>Insertion</strong>：块导入缓存时放到什么位置？是否将该块放入缓存？</li>
            <li><strong>Promotion</strong>：命中一个 block 时是否/如何调整 priority？</li>
            <li><strong>Eviction</strong>：发生缺失时替换哪一个 block？如何调整 priority？</li>
          </ul>
          <p><strong>Replacement Policy</strong>：发生缺失且目标 set 满时，优先踢出 set 内的 invalid block；若全 valid，询问替换策略：Random、FIFO、<strong>LRU</strong>（Least Recently Used）、NRU（Not most recently used）、LFU（Least frequently used）、Least costly to re-fetch（为什么访问代价不同？）、混合策略。</p>
          <p><strong>LRU 的实现</strong>：想法——将组内 least recently accessed block 踢出；问题——需要维持组内 block 的历史访问顺序：</p>
          <ul>
            <li>2-路组相联：1 位即可记录「谁是最近访问的」；</li>
            <li>4-路组相联：一个组内有 4 个块，有多少种可能的访问顺序？需要多少 bits 来记录？需要什么样的逻辑确定 LRU victim？</li>
          </ul>
          <p><strong>LRU 的近似</strong>：大多数当代处理器没有实现高相联度缓存的「true LRU」——过于复杂，且 LRU 只是预测局部性信息（未必总是最好）。候选：Not MRU、Hierarchical LRU、Victim-NextVictim 等。</p>
          <p><strong>LRU vs Random</strong>：考虑 4 路组相联、循环访问 A、B、C、D、E——LRU 命中率为 0（<strong>set thrashing</strong>：工作集大于相联度）；随机策略可能更好，因为可避免抖动。实际取决于 workload 与缓存配置；平均命中率类似。更好的方案：LRU 与 Random 混合（set sampling，见 Qureshi et al., ISCA 2006）。</p>
          <p><strong>最优替换策略（Belady's OPT）</strong>：替换将来最久/最远被访问的 block。它不能实现（需要未来信息）；且「最小缺失率」不等于「最小执行时间」——缓存中 block 的缺失延迟不同（远程/本地访问、缺失的重叠处理），这是 MLP-aware 替换的动机（第 11 讲）。</p>
          <p><strong>缓存 vs 页替换</strong>：物理内存（DRAM）是磁盘/SSD 的缓存，通常由虚拟存储器子系统的<strong>软件</strong>管理；页面替换与缓存替换非常类似（页表就是物理存储的「tag store」）。区别：访问速度、block 数量、寻找 victim 时可容忍的时间、角色（hardware vs software）。</p>
          <p><strong>Tag Store 中保存的元数据</strong>：Valid bit（是否有效）、Tag（数据 ID）、Replacement policy bits（priority）、Dirty bit（是否被修改）；多核系统中还有一致性协议状态。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch10-write',
      heading: '4. 写策略与写分配',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>写回 vs 写直达</strong>：何时将修改的数据写到下一级？</p>
          <table class="tbl">
            <thead><tr><th></th><th>Write-back（写回）</th><th>Write-through（写直达）</th></tr></thead>
            <tbody>
              <tr><td>时机</td><td>block 被替换时写到下一级</td><td>写发生的同时写到下一级</td></tr>
              <tr><td>优点</td><td>替换前可合并对同一 block 的多次写，减少带宽消耗、节省能耗</td><td>实现简单；所有层级数据都是最新的，简化一致性协议</td></tr>
              <tr><td>缺点</td><td>tag store 需要额外的 dirty bit</td><td>需要消耗更多带宽</td></tr>
            </tbody>
          </table>
          <p><strong>写（不）分配</strong>：发生写缺失时，是否在缓存中分配一个 block？</p>
          <ul>
            <li><strong>写分配</strong>（write allocate）：可以聚合写操作、不需要每次都写到下一级；写可以和读一样处理（更简单）；代价是需要在层级之间传输整个缓存块；</li>
            <li><strong>写不分配</strong>（write non-allocate）：若写操作的局部性低，可节省缓存空间（可能有更好的命中率）。</li>
          </ul>
          <p><strong>Harvard or Princeton（指令与数据缓存分离还是合并）</strong>：</p>
          <ul>
            <li><strong>合并架构</strong>（Princeton）：+ 共享缓存空间，不需要分离设计的空间 overprovisioning；− 指令和数据可能相互竞争、没有空间保障；− 流水线中指令和数据在不同阶段访问，会产生什么问题？（结构冲突）</li>
            <li>当前商用 CPU 的一级缓存绝大多数采取<strong>分离</strong>方案（Harvard），主要由于上述最后一点（IF 与 MEM 在不同阶段同时访问）；二级和其它级别通常采用合并方案。</li>
          </ul>
          `,
        },
      ],
    },
    {
      id: 'sec-ch10-multilevel',
      heading: '5. 多级缓存与参数',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>一级缓存</strong>（指令与数据）：设计的很多决定受 cycle time 影响——Small、lower associativity；tag store 和 data store 通常<strong>并行访问</strong>。</p>
          <p><strong>二级缓存</strong>：设计决定需要均衡 hit rate 与 access latency——通常 large、highly associative；延迟不是最重要的；tag store 与 data store 通常<strong>顺序访问</strong>。</p>
          <p>层级之间的顺序/并行访问：Serial——一级缓存缺失时才访问二级；二级缓存看到的访问请求和一级看到的不同（一级像访问过滤器，过滤掉了一些局部性），所以不同缓存级别适用的管理策略不同。</p>
          <p><strong>缓存参数</strong>：Cache size（缓存大小）、Block size（块大小）、Associativity（相联度）、Replacement policy、Placement policy（初始与命中时的放置）。</p>
          <p><strong>缓存大小</strong>：总的数据容量（不含 tag）；越大越能利用时间局部性，但容量太大对访问延迟有负面影响（smaller is faster），且可能影响关键路径；太小则无法容纳 working set（应用程序在一个时间窗口内访问的所有数据的合集），有用数据被频繁替换。</p>
          <p><strong>块大小</strong>：与地址中的 tag 关联，不一定是层级间传输的基本粒度。太小：不能很好利用空间局部性、tag 存储开销大；太大：block 数量过少、利用时间局部性难度增大（空间局部性差时浪费空间/带宽/功耗）。<strong>Sub-blocking</strong>：把块划分为多个 pieces，每个配置 valid/dirty bit。</p>
          <p><strong>相联度</strong>：组相联中一个组内的 block 数量。大相联度：缺失率低、不同程序间缺失率变化不大，但访问延迟大、硬件开销大；小相联度：开销小、延迟低（对 L1 尤其重要）。相联度需要是 2 的整数次幂吗？（不必须。）</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch10-miss',
      heading: '6. 缺失的分类与减少办法',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>缓存缺失的三种来源（3C）</strong>：</p>
          <table class="tbl">
            <thead><tr><th>类型</th><th>定义</th><th>减少办法</th></tr></thead>
            <tbody>
              <tr><td><strong>强制性缺失</strong>（compulsory）</td><td>首次访问一个 block 发生的缺失；随后访问该 block 应是命中，除非已被替换</td><td>预取；增加 block size</td></tr>
              <tr><td><strong>容量缺失</strong>（capacity）</td><td>缓存空间小，不能容纳程序所需全部内容——定义为即使采用全相联和最优替换算法也会发生的缺失</td><td>更好地利用缓存空间；基于软件的策略（按阶段让缓存容纳每个阶段的工作集）</td></tr>
              <tr><td><strong>冲突缺失</strong>（conflict）</td><td>既不是强制性也不是容量缺失的其它缺失；由于缓存配置不合理导致</td><td>采用更高的相联度；其它提升有效相联度的方法（Victim cache、Hashing、software hints）</td></tr>
            </tbody>
          </table>
          <p><strong>缓存性能公式</strong>：</p>
          <div class="formula">AMAT = <span class="m">(hit-rate × hit-latency) + (miss-rate × miss-latency)</span></div>
          <p>优化方向三类：减少缺失率（留心：一味减少缺失率可能降低性能，如果重取开销更大的 block 被替换）；减少缺失的开销/延迟；减少命中的开销/延迟。</p>
          <p>基本方法清单：减少缺失率——更高的相联度、Victim caches / pseudo-associativity / skewed associativity、更好的插入/替换策略、基于软件的优化；减少缺失开销——多级缓存、请求字优先（critical word first）、子块划分、更好的替换策略、非阻塞缓存（第 11 讲）。</p>
          <div class="callout tip"><p>期末常见题型：给定缓存大小、块大小、相联度，划分地址的 tag/index/offset 位数；给访问序列算命中率/缺失率（注意区分强制性、冲突、容量缺失的计数口径）。</p></div>
          `,
        },
      ],
    },
  ],
};

export default ch;
