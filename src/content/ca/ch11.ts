/* 计算机体系结构 · 第11讲 优化缓存的性能 —— 依据「课件/11-缓存性能优化.pptx」（李建华，39 页）整理 */
import type { CaChapter } from './types';

const ch: CaChapter = {
  id: 'ch11',
  no: '第11讲',
  title: '优化缓存的性能',
  subtitle: '第 11 讲 · 优化缓存的性能',
  lede: `
  在 3C 缺失与 AMAT 公式的基础上，本讲给出<strong>减少冲突缺失</strong>的四种结构（Victim Cache、Hashing、伪相联、Skewed 相联）、
        <strong>软件层优化</strong>（loop interchange、blocking、数据结构拆分）、<strong>MLP 感知的替换策略</strong>（少缺失 ≠ 低停顿）、
        <strong>非阻塞缓存与 MSHR</strong>，以及多核场景下<strong>共享缓存</strong>的 QoS 问题。
`,
  toc: [
    { id: 'sec-ch11-conflict', text: '1. 减少冲突缺失的四种结构', level: 2 },
    { id: 'sec-ch11-software', text: '2. 软件层优化', level: 2 },
    { id: 'sec-ch11-mlp', text: '3. MLP 与感知 MLP 的替换', level: 2 },
    { id: 'sec-ch11-nonblock', text: '4. 非阻塞缓存与 MSHR', level: 2 },
    { id: 'sec-ch11-multicore', text: '5. 多核共享缓存与 QoS', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ch11-conflict',
      heading: '1. 减少冲突缺失的四种结构',
      blocks: [
        {
          type: 'html',
          html: `
          <p>除了构建高相联度的缓存之外，业界还有很多减少缺失的方法（缓存至关重要，其性能优化会一直是一个研究领域）：</p>
          <p><strong>（1）Victim Cache</strong>（Jouppi, ISCA 1990，ISCA 25 周年经典论文）：用一个小的<strong>全相联</strong>缓冲（victim cache）保存因冲突而被替换出去的 block；访问下一级之前先访问 victim cache。</p>
          <ul>
            <li>+ 可以消除映射到同一个 set 里的多个 block 形成的乒乓效应（容量小、命中率高）；</li>
            <li>− 如果与 L2 顺序访问，有可能增加缺失时的延迟；增加了设计的复杂度。</li>
          </ul>
          <p><strong>（2）Hashing</strong>：使用更加离散的索引函数，把访问的 blocks 更均匀地分布到 sets 里——+ 减少冲突缺失；− 哈希计算更复杂、耗时，可能延长关键路径。</p>
          <p><strong>（3）伪相联</strong>（Pseudo-associativity）：把缓存组里的每个「way」看作一个直接相联缓存；按顺序搜索各个 way——命中第 k 个 way 时，该 way 提升到第 1 位，原来的第 1 到 k−1 降低一位；缺失时新 block 放到第 1 个 way，第 n 个 way 被替换，原先第 1 到 n−1 往后移一位。</p>
          <p><strong>（4）Skewed Associative Caches</strong>（Seznec, ISCA 1993）：对不同 way 使用<strong>不同的索引函数</strong>（传统的 2 路组相联里各 way 用同一索引函数）。索引经过哈希处理后分布更加随机离散，一个 block 被映射到同一个组的概率大大降低，减少冲突缺失；开销是哈希函数的计算延迟与硬件投入。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch11-software',
      heading: '2. 软件层优化',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>重构数据访问特征</strong>——改变访问顺序以利用空间局部性，例如 <strong>loop interchange</strong>（列式存储时）：</p>
          <table class="tbl">
            <thead><tr><th>Poor code</th><th>Better code</th></tr></thead>
            <tbody>
              <tr><td><pre class="code"><code>for i = 1, rows
  for j = 1, columns
    sum = sum + x[i,j]</code></pre></td><td><pre class="code"><code>for j = 1, columns
  for i = 1, rows
    sum = sum + x[i,j]</code></pre></td></tr>
            </tbody>
          </table>
          <p>其它方法：Loop fusion、array merging（见教材 2.2 节）。</p>
          <p><strong>分块（Blocking）</strong>：将循环所操作的矩阵划分成子块（chunk），使缓存可以容纳每个 chunk 及其操作的数据——本质上把工作集划分，使缓存可容纳子工作集（时间局部性）。注意：不能消除所有缺失（chunk 内仍可能有缺失）；不同矩阵之间可能造成冲突；编译或编程期间矩阵的大小可能未知。</p>
          <p><strong>重构数据的布局</strong>：基于指针的访问（如具有主键的巨大链表 1M 节点）。左侧代码命中率差的原因：「其它域」（name[256]、school[256]）占据了缓存行中大部分空间，却很少被用到。</p>
          <ul>
            <li>优化：将频繁访问的数据剥离开，单独组成数据结构（指针 + key + node-data 指针，其余域放 node-data）；</li>
            <li>谁能开展此类优化：程序员（最方便）→ 编译器（可提供帮助，需 profiling）→ 硬件（可行但比较困难）；</li>
            <li>谁能感知频繁访问的数据？Keys to the programmer。</li>
          </ul>
          `,
        },
      ],
    },
    {
      id: 'sec-ch11-mlp',
      heading: '3. MLP 与感知 MLP 的替换',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>存储级并行性</strong>（Memory Level Parallelism，MLP）：指并行产生和服务多个内存访问（Glew'98）。提升 MLP 的技术：乱序执行、同时多线程等。MLP 是可变的：有些缺失是独立的，有些缺失可并行处理。</p>
          <p><strong>传统替换算法的隐含假设</strong>：减少缺失的数量总能获得最好的存储访问时间——不再总是正确。与可并行处理的缺失相比，减少一个<strong>独立</strong>的缺失对性能的帮助更大；减少一个长延迟的缺失比减少一个短延迟的缺失收益更大。</p>
          <p><strong>课件示例</strong>：基于一个具有 4 个 block 的全相联缓存，访问块 P1~P4（可并行处理）与 S1~S3（仅能独立处理）：</p>
          <table class="tbl">
            <thead><tr><th>替换算法</th><th>Misses</th><th>Stalls</th><th>结论</th></tr></thead>
            <tbody>
              <tr><td>Belady's OPT（最小化缺失数）</td><td>4</td><td>4</td><td>缺失数最少，但 4 次停顿时无法重叠</td></tr>
              <tr><td>MLP-Aware（减少独立缺失）</td><td>6</td><td>2</td><td>缺失更多，但停顿减半（saved cycles）</td></tr>
            </tbody>
          </table>
          <div class="callout key"><p><strong>最少的缺失数 ≠ 最好的性能。</strong>如何将 MLP 信息融合到替换决策中？参考 Qureshi et al., "A Case for MLP-Aware Cache Replacement," ISCA 2006（建议课下阅读，作为科研启蒙）。</p></div>
          `,
        },
      ],
    },
    {
      id: 'sec-ch11-nonblock',
      heading: '4. 非阻塞缓存与 MSHR',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>问题</strong>：如果处理器可以发出多个缓存访问请求，当前一个缺失还未处理完时，后续的访问能否继续处理？——目标 1：有未处理完的缺失时允许继续访问缓存而不是暂停；目标 2：使多个缺失可以并行处理（提升 MLP）。</p>
          <p><strong>方案</strong>：非阻塞缓存（Non-blocking or lockup-free caches，Kroft, ISCA 1981，ISCA 25 周年经典论文）。<strong>MSHR</strong>（Miss Status Handling/Holding Register）记录正在处理的缺失请求的相关信息（状态和数据）。</p>
          <p><strong>操作</strong>：</p>
          <ul>
            <li>缺失时查找 MSHR，确认是否已有访问相同 block 的缺失请求在途：有——若所需数据已返回则直接发给请求者，否则在同一 MSHR 条目里分配一个 load/store 条目（无空闲条目则暂停）；没有——分配新的 MSHR 条目（无空闲 MSHR 则暂停）；</li>
            <li>当一个 sub-block 从下一级返回：确定哪些 loads/stores 在等它；把子块传给相应 load/store unit；释放对应的 load/store 条目；把子块写到缓存或 MSHR 的 data 字段；若返回的是最后一个 sub-block，写缓存后释放该 MSHR 条目。</li>
          </ul>
          <p><strong>MSHR 条目记录</strong>：valid bit、block address（供后续请求匹配）、control/status bits（Prefetch? issued to memory? which sub-blocks have arrived?）、每个 sub-block 的 data；对每个等待的读写请求记录：valid、type、byte in block、目标寄存器或 store buffer 条目地址。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch11-multicore',
      heading: '5. 多核共享缓存与 QoS',
      blocks: [
        {
          type: 'html',
          html: `
          <p>对多核/多线程系统，缓存更加重要：内存带宽更稀缺、缓存空间更有限。新问题：共享还是私有？如何优化整个系统性能？共享缓存下如何给不同线程提供 QoS？缓存管理算法需要考虑线程特征吗？如何给线程分配空间？</p>
          <p><strong>私有 vs 共享</strong>：私有缓存仅属于唯一的核（一个共享的 block 可能在多个缓存中存在副本——会带来什么问题？一致性问题）；共享缓存的空间由多个核共享（优缺点见下）。</p>
          <p><strong>资源共享的优缺点</strong>：</p>
          <ul>
            <li>+ 提升资源利用率与效率（更好的吞吐率）；减少资源的重复配置或过量配置；减少线程间通信延迟（共享数据可放缓存中）；与共享存储器模型兼容；</li>
            <li>− 资源冲突（一个资源被占据时其它线程无法使用）；没有合理的分配机制可能导致不公平；有时会降低线程性能；消除性能隔离（对实时系统是大问题）；没有高效控制的共享会损害 QoS、造成不公平甚至饥饿；需要高效、公平地利用共享资源（对当今数据中心非常重要）。</li>
          </ul>
          <p><strong>共享缓存的优点</strong>：有效提升缓存空间利用率；可动态划分；没有静态划分的碎片问题；容易维持一致性（single copy）；共享数据没有乒乓问题。缺点及挑战：访问速度慢；核间访问可能造成冲突缺失；一些核可能损害其它核的命中率；维持每个核最小服务质量（公平性）很难——分配多少空间、多少带宽？</p>
          <p><strong>自由共享的问题</strong>（与单核相同的放置/替换策略，通常是 LRU 或 pseudo-LRU，对线程特征盲目）：缓存利用率不高（LRU 不是最好的策略）；缓存不友好的应用会破坏缓存友好型应用的性能；不是所有应用从相同容量获益相等——自由共享可能给获益较少的应用分配更多空间。最终降低性能、降低公平。</p>
          <p><strong>为什么性能不可预测（缺乏 QoS）是坏设计</strong>：给程序员造成困难（精心优化的程序可能获得较差性能，且依赖 co-runner 特征）；造成用户不满意（数据中心场景）；重要程序可能因迟迟获取不了资源而饥饿；系统管理困难——共享硬件资源不可控时如何确保 SLA？</p>
          <p>常见的共享硬件资源：内存子系统（非私有缓存、互连、内存控制器/总线/Bank）、I/O 子系统（I/O、DMA 控制器、以太网控制器）、处理器（多线程系统：流水线资源、L1 缓存）。</p>
          `,
        },
      ],
    },
  ],
};

export default ch;
