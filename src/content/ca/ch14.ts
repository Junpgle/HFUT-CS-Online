/* 计算机体系结构 · 第14讲 缓存一致性 —— 依据「课件/14-缓存一致性.pptx」（李建华，35 页）整理 */
import type { CaChapter } from './types';

const ch: CaChapter = {
  id: 'ch14',
  no: '第14讲',
  title: '缓存一致性',
  subtitle: '第 14 讲 · 缓存一致性',
  lede: `
  本讲给出缓存一致性的两条实现路线：<strong>侦听协议</strong>（基于总线，写无效 vs 写更新）与<strong>目录协议</strong>（可扩展的点到点网络）。
        核心内容是 <strong>MESI 协议</strong>的四个状态（Modified / Exclusive / Shared / Invalid）与本地读/写命中/缺失的全部转换规则——期末简答与状态分析的常客。
        课程在本讲结束：预祝考试顺利。
`,
  toc: [
    { id: 'sec-ch14-bus', text: '1. 基于总线的共享存储器与一致性问题', level: 2 },
    { id: 'sec-ch14-protocol', text: '2. 侦听协议：写无效与写更新', level: 2 },
    { id: 'sec-ch14-mesi', text: '3. MESI 协议', level: 2 },
    { id: 'sec-ch14-dir', text: '4. 目录一致性协议', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ch14-bus',
      heading: '1. 基于总线的共享存储器与一致性问题',
      blocks: [
        {
          type: 'html',
          html: `
          <p>两种基于共享存储器的通信架构：基于<strong>总线</strong>的共享存储器机器（small-scale）；基于<strong>片上网络</strong>的共享存储器机器（large-scale，NoC）。</p>
          <p><strong>基于总线</strong>：总线是简单的物理连接方式（a bundle of wires）；带宽会限制其连接的总设备数量；总线由所有设备共享。为简化后续一致性协议的讨论，<strong>假定每个 CPU/core 仅具备一级缓存结构</strong>（其下一级就是主存）。</p>
          <p><strong>一致性问题</strong>（课件示例）：X 的初值 24——</p>
          <ol>
            <li>Core1 读 X：从 memory 获取 24 并本地缓存；</li>
            <li>Core2 读 X：从 memory 获取 24 并本地缓存；</li>
            <li>Core1 写 32 到 X：更新其本地缓存的 X 副本；</li>
            <li>Core3 读 X：它读到的值是什么？</li>
          </ol>
          <p>此时 Memory 和 Core2 认为 X 是 24，Core1 认为 X 是 32——读写操作可能使得有些共享的块过期（某些缓存保存的是旧数据）；此时仅仅更新主存是不够的，缓存不管采取 write-back 还是 write-through 策略<strong>都不能解决问题</strong>。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch14-protocol',
      heading: '2. 侦听协议：写无效与写更新',
      blocks: [
        {
          type: 'html',
          html: `
          <p>解决方案：<strong>缓存一致性协议</strong>。实现一个让每个 core 知道每个 block 最新值的方案非常复杂。在<strong>侦听</strong>（snoop）协议下：每个 Core（cache system）在总线上 snoops（watches continually）它感兴趣的（本地缓存有副本）数据地址的写操作。这需要一个全局总线支撑：master 的所有通信能被所有 slaves 看到，且写的顺序要一致。可扩展性更好的方案是<strong>目录</strong>（directory）一致性协议。</p>
          <p><strong>（1）写无效（Write Invalidate）</strong>：core 想写 block → 获取一个总线周期，发送 'write invalidate' 消息；所有 snooping caches 看到消息后 invalidate 自己的（可能的）副本；收集到所有 acknowledgement 后，core 可以写目标 block（假定该写直达 memory）；后续其它 core 对该 block 的读取均会 miss，从而重新获取 block——此刻多核系统是一致的。</p>
          <p><strong>（2）写更新（Write Update）</strong>：core 想写 block → 获取总线周期，把要写的数据通过总线<strong>广播</strong>；所有 snooping caches 通过总线更新其副本。无论写无效还是写更新，同时发生的写操作都可以通过总线仲裁机制避免（任何时刻只有一个 core 是 bus master）。</p>
          <p><strong>更新 or 无效？</strong>写更新看起来最简单直接、速度快，却会消耗大量网络带宽：</p>
          <ul>
            <li>对同一个 word 的多个写（中间没有读）只需一个 "write invalidate" 消息，写更新下每个写都要一次更新；</li>
            <li>对同一个缓存块的多个写（multi-word cache block）同理；</li>
            <li>由于 cache 的 spatial/temporal 局部性，这两种多重写经常发生；而总线带宽是稀缺资源。经验表明写无效机制使用相当少的总线带宽——当前大多数产品采取 <strong>write invalidate</strong> 方案。</li>
          </ul>
          <p><strong>实现要点</strong>：为减少网络流量，知道一个 block 没有被共享（其它 cache 里没有副本）可以避免发送消息；写无效协议假定更新值会被写回 Memory，此时其它 core 的读缺失可能获得旧值（re-fetch from memory），因此需要协议处理这种情况（很多协议，参考 Sorin's book）。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch14-mesi',
      heading: '3. MESI 协议',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>MESI</strong> 是一个用于多核处理器、基于 write invalidate 的协议，旨在最小化总线的使用；允许缓存使用 write back 方案（主存直到 dirty cache line 被踢出时才更新）。为此需要扩展 cache tag 内容：valid bit、dirty bit + <strong>coherence state bits</strong>（与原有辅助信息一起保存在 tag store 中）。</p>
          <p><strong>四个状态</strong>（需 2 bits 编码）：</p>
          <table class="tbl">
            <thead><tr><th>状态</th><th>含义</th></tr></thead>
            <tbody>
              <tr><td><strong>Modified</strong>（M）</td><td>缓存块已改变，与主存中的值不同；是当前<strong>唯一</strong>的缓存副本（dirty bit 为 1）</td></tr>
              <tr><td><strong>Exclusive</strong>（E）</td><td>值与主存相同，且是当前所有缓存中的<strong>唯一</strong>副本</td></tr>
              <tr><td><strong>Shared</strong>（S）</td><td>值与主存相同，但该块在缓存中存在<strong>多个</strong>副本</td></tr>
              <tr><td><strong>Invalid</strong>（I）</td><td>该块当前没有保存有效数据（as in simple cache）</td></tr>
            </tbody>
          </table>
          <p>状态改变是存储读写操作（事件）的函数——即 FSM。事件可能是：本地 core 的读写操作（缓存访问）；总线操作（来自其它 core 的操作）。仅当操作的地址与缓存块的地址匹配时，状态才受影响。</p>
          <svg class="fig" viewBox="0 0 800 320" role="img" aria-label="MESI 四状态与本地事件的转换（远端事件见下表）">
            <g font-size="11.5" text-anchor="middle" style="font-family:var(--font)">
              <defs>
                <marker id="ca-arr5" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" style="fill:var(--ink-3)"/>
                </marker>
              </defs>
              <text x="30" y="26" text-anchor="start" style="fill:var(--ink-3)" font-size="11.5">本地发起的操作（完整规则见下表）</text>
              <g style="fill:var(--panel-2);stroke:var(--deck-accent)" stroke-width="1.6">
                <rect x="200" y="50" width="150" height="60" rx="10"/>
                <rect x="500" y="50" width="150" height="60" rx="10"/>
                <rect x="200" y="200" width="150" height="60" rx="10"/>
                <rect x="500" y="200" width="150" height="60" rx="10"/>
              </g>
              <g style="fill:var(--ink)" font-weight="700">
                <text x="275" y="76">I（Invalid）</text>
                <text x="575" y="76">E（Exclusive）</text>
                <text x="275" y="226">S（Shared）</text>
                <text x="575" y="226">M（Modified）</text>
              </g>
              <g style="fill:var(--ink-3)" font-size="11">
                <text x="275" y="94">无有效数据</text>
                <text x="575" y="94">唯一副本、与主存同值</text>
                <text x="275" y="244">多副本、与主存同值</text>
                <text x="575" y="244">唯一副本、已修改（dirty）</text>
              </g>
              <g style="stroke:var(--ink-3)" stroke-width="1.4" fill="none" marker-end="url(#ca-arr5)">
                <path d="M350,80 L500,80"/>
                <path d="M225,110 L225,200"/>
                <path d="M350,230 L500,230"/>
                <path d="M575,110 L575,200"/>
              </g>
              <g style="fill:var(--ink-2)" font-size="11">
                <text x="425" y="66">Read Miss（无副本）</text>
                <text x="216" y="160" text-anchor="end">Read Miss（有副本）</text>
                <text x="425" y="252">Write Hit（发 Invalidate）</text>
                <text x="586" y="160" text-anchor="start">Write Hit</text>
              </g>
              <text x="400" y="296" style="fill:var(--ink-3)" font-size="11">其余：本地 Write Miss（RWITM）→ M；远端 Mem Read：M→S（先写回）、E→S；远端 Invalidate / RWITM：S/E/M→I</text>
            </g>
          </svg>
          <p class="fig-cap">图 14-1　MESI 状态与主要转换（修改 M 的语义见规则表）</p>
          <p><strong>本地发起的访问（分情况）</strong>：</p>
          <table class="tbl">
            <thead><tr><th>事件</th><th>原状态</th><th>动作与结果</th></tr></thead>
            <tbody>
              <tr><td>Read Hit</td><td>M / E / S</td><td>命中行保存有正确的值（M 是唯一正确值），直接返回给本地请求者，状态不变</td></tr>
              <tr><td>Read Miss</td><td>I，其它缓存无副本</td><td>向 memory 发请求，值返回后存入本地缓存，状态置 <strong>E</strong></td></tr>
              <tr><td>Read Miss</td><td>I，其中一个缓存有 E 副本</td><td>向 memory 发请求；侦听缓存（E）把值放到总线上，memory 访问被取消；本地保存后两个副本都切到 <strong>S</strong></td></tr>
              <tr><td>Read Miss</td><td>I，几个缓存有 S 副本</td><td>侦听缓存（S）把值放到总线上（arbitrated），memory 访问取消；本地块置 <strong>S</strong>，其它副本维持 S</td></tr>
              <tr><td>Read Miss</td><td>I，其中一个缓存有 M 副本</td><td>侦听缓存（M）把值放到总线上；本地块置 <strong>S</strong>；M 块的值<strong>刷回 memory</strong>，状态切到 <strong>S</strong></td></tr>
              <tr><td>Write Hit</td><td>M</td><td>只有一个副本且 dirty，直接更新本地值，状态仍为 M</td></tr>
              <tr><td>Write Hit</td><td>E</td><td>直接更新本地值，状态 <strong>E → M</strong>，dirty bit 置位</td></tr>
              <tr><td>Write Hit</td><td>S</td><td>在总线上广播 invalidate；有 S 副本的缓存把块置无效（S→I）；更新本地值，状态 <strong>S → M</strong></td></tr>
              <tr><td>Write Miss</td><td>I，无其它副本</td><td>从 memory 读入目标行（write allocate），更新值，状态置 <strong>M</strong></td></tr>
              <tr><td>Write Miss</td><td>I，有 E 或 S 副本</td><td>从 memory 读入，同时发总线事务 <strong>RWITM</strong>（read with intent to modify）；其它缓存控制器把本地副本置 <strong>I</strong>；更新本地行，状态置 M</td></tr>
              <tr><td>Write Miss</td><td>I，有 M 副本</td><td>发 RWITM；M 副本所在缓存控制器阻塞 RWITM、接管总线、把副本<strong>写回 memory</strong>、状态置 I；原请求 core <strong>重发</strong> RWITM，此后无副本 → 从 memory 读入、更新、状态 M</td></tr>
            </tbody>
          </table>
          <p><strong>远端发起的访问</strong>（本地 core 通过侦听总线看到的操作）：Mem read（M 副本被读 → 提供数据并转 S；E → S；S 保持）；Invalidate（S → I）；RWITM（M → 写回并转 I；E/S → I）。</p>
          <div class="callout key"><p>协议涉及的所有信息和操作可以用一个状态转换图紧凑表示：本地操作（read hit/miss、write hit/miss）与总线事务（Mem read、RWITM、Invalidate）。在线演示可参考课件给出的 MESI 交互网站。</p></div>
          `,
        },
      ],
    },
    {
      id: 'sec-ch14-dir',
      heading: '4. 目录一致性协议',
      blocks: [
        {
          type: 'html',
          html: `
          <p>由于依赖总线架构，Snoopy 一致性协议的可扩展性较差（<strong>BUS is the bottleneck</strong>）。<strong>Directory 一致性协议</strong>具有更好的可扩展性：通过记录一个 memory block 的共享者信息来避免广播，从而用点到点的消息维持一致性；更加灵活，可适用任何可扩展的点到点网络拓扑。</p>
          <p><strong>基本方案</strong>（Censier &amp; Feautrier）：</p>
          <ul>
            <li>假定 k 个处理器；memory 中每个 cache-block 记录 k 个 presence-bits 与 1 个 dirty-bit；cache 中每个 block 记录 1 个 valid bit 与 1 个 dirty（owner）bit；</li>
            <li><strong>读</strong>（P-i 读主存某个 block）：dirty-bit 为 OFF → 从 memory 读，把 p[i] 置 ON；dirty-bit 为 ON → 从 dirty PE 召回该行（cache 状态转 shared）、更新 memory、清 dirty-bit、把 p[i] 置 ON、把召回数据供给 PE-i；</li>
            <li><strong>写</strong>：dirty-bit 为 OFF → 向所有缓存该 block 的 PE 发 invalidations、把 dirty-bit 置 ON、把 P[i] 置 ON……</li>
          </ul>
          <p><strong>Directory 协议的问题</strong>：Memory 和 directory 带宽的扩展性——不能使用集中的 main memory 或 directory，需要分布式的内存与目录结构；directory 的存储需求扩展性也不好——presence bits 的数量随 PE 数量增长（很多绕过方法，如 limited pointer schemes of many flavors，研究热点）。</p>
          <p class="callout">2023 年的课程到此结束，预祝各位同学考试顺利！</p>
          `,
        },
      ],
    },
  ],
};

export default ch;
