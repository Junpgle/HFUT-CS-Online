/* 计算机体系结构 · 第13讲 多核处理器入门 —— 依据「课件/13-多核处理器.pptx」（李建华，34 页）整理 */
import type { CaChapter } from './types';

const ch: CaChapter = {
  id: 'ch13',
  no: '第13讲',
  title: '多核处理器入门',
  subtitle: '第 13 讲 · 多核处理器入门',
  lede: `
  为什么走进多核：<strong>功耗墙</strong>与 ILP 的枯竭。本讲介绍多核的内部结构、<strong>同时多线程</strong>（SMT/Hyperthreading）与多核/多发射的关系，
        多核之上<strong>并行程序</strong>的困难（任务划分、负载均衡、通信），用 <strong>Amdahl 定律</strong>与可扩展性分析加速比的上限，
        最后以一例「x = x + 1」引出<strong>缓存一致性问题</strong>——第 14 讲的主题。
`,
  toc: [
    { id: 'sec-ch13-power', text: '1. 功耗墙与多核的必然', level: 2 },
    { id: 'sec-ch13-smt', text: '2. 同时多线程（SMT）', level: 2 },
    { id: 'sec-ch13-parallel', text: '3. 并行程序、Amdahl 与可扩展性', level: 2 },
    { id: 'sec-ch13-coherence', text: '4. 一致性问题的引入', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ch13-power',
      heading: '1. 功耗墙与多核的必然',
      blocks: [
        {
          type: 'html',
          html: `
          <p>已学的单核性能手段（更深的流水线、更短的时钟周期、利用其它并行性 DLP/TLP/RLP）空间有限；<strong>多核处理器是提高并行性最直接的方案</strong>。</p>
          <div class="formula"><span class="m">Power = capacitance × voltage<sup>2</sup> × frequency</span>（dynamic power）</div>
          <p>减少电压可以明显降低功耗；更好的制冷技术可以支持更高的主频。那么，<strong>功耗墙</strong>指什么？</p>
          <ul>
            <li>不能进一步降低晶体管的工作电压（泄露功耗 leakage power ↑、稳定性）；</li>
            <li>不能及时去除更多的热量（more transistor），受风冷机制的限制。</li>
          </ul>
          <p><strong>功耗问题与散热</strong>：Intel Westmere 32nm、130W / 240mm² = 54 W/cm²——与 Hot Plate、Rocket Nozzle、Nuclear Reactor、Surface of Sun 的热流密度放在一起对比。</p>
          <p><strong>多核处理器的合理性（课件数据）</strong>：</p>
          <table class="tbl">
            <thead><tr><th>方案</th><th>相对性能</th><th>相对功耗</th></tr></thead>
            <tbody>
              <tr><td>单核（基准）</td><td>1.0×</td><td>1.0×</td></tr>
              <tr><td>单核超频 +20%</td><td>1.2×</td><td>1.7×</td></tr>
              <tr><td>双核降频 −20%</td><td>1.6×</td><td>0.51×</td></tr>
            </tbody>
          </table>
          <p>性能提升 60% 而功耗几乎减半——因为功耗与频率（和电压）是超线性的，而性能与频率近似线性。另一个重要原因是<strong>继续提升 ILP 的空间非常有限</strong>（程序本身的 ILP 有限）。</p>
          <p>课件展示了 AMD Barcelona 四核与 Intel Nehalem 六核的内部结构（多个 core + 共享 L3 + 内存控制器在同一 die 上）。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch13-smt',
      heading: '2. 同时多线程（SMT）',
      blocks: [
        {
          type: 'html',
          html: `
          <p>同时多线程（SMT，Intel 称 Hyperthreading）：让物理上单个核看起来像多个物理核；当发生暂停事件时，在多个硬件线程间切换。细粒度/粗粒度的区别：普通多线程是<strong>粗粒度</strong>的切换；SMT 同时运行多个线程，且可以每个 cycle 切换线程。</p>
          <table class="tbl">
            <thead><tr><th></th><th>多核</th><th>多发射</th><th>超线程（SMT）</th></tr></thead>
            <tbody>
              <tr><td>Programs</td><td>N</td><td>1</td><td>N</td></tr>
              <tr><td>Num. Pipelines</td><td>N</td><td>1</td><td>1</td></tr>
              <tr><td>Pipeline Width</td><td>1</td><td>N</td><td>N</td></tr>
            </tbody>
          </table>
          <div class="callout key">
            <p><strong>超线程的两个等价视角</strong>：</p>
            <ul>
              <li>HT = 多发射 + 额外的 PC 和寄存器 − 相关检测逻辑（同一个宽流水线交替喂给多个线程）；</li>
              <li>HT = 多核 − 冗余的功能单元 + 冒险避免机制（逻辑上多个核，物理上共享功能单元）。</li>
            </ul>
          </div>
          <p><strong>多处理器/多核系统示例</strong>：8 multiprocessors、4 core per multiprocessor、2 HT per core、动态多发射 4 issue、流水线深度 16——每个处理器可以有多个核心，因此这是一个多处理器系统、多核系统、支持超线程的混合示例。（教材 3.12 节与第 5 章有更多内容。）</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch13-parallel',
      heading: '3. 并行程序、Amdahl 与可扩展性',
      blocks: [
        {
          type: 'html',
          html: `
          <p>有了多核，应用程序性能并不会自动提升——软件需要按照并行化的方式去写。多核处理器面临的困难：<strong>任务划分与负载均衡</strong>、<strong>协调与同步</strong>、<strong>通信开销</strong>；以及「在不知道底层硬件架构细节的情况下如何写并行程序」。</p>
          <ul>
            <li>首先进行任务划分，让所有的核芯有事可做（理想情况）；</li>
            <li>再考虑做事的效率——需要一个好的任务划分策略：负载均衡（load-balance，实际情况）。</li>
          </ul>
          <p><strong>多核与 Amdahl 定律</strong>：任务由 serial part 和 parallel part 组成；可行方案：把输入数据划分成 n 个片段 → 对每个片段并行处理 → 汇集结果。随着核数增加，处理每个片段的时间趋于 0，而 serial part 的时间不变——最终 serial part 主导任务整体进度。</p>
          <p><strong>Amdahl 陷阱</strong>：multiply 操作占据一个总运行时间 100s 的程序中的 80s；将 multiply 性能提升多少倍可以获得 5 倍总体性能提升？列式：20 = 80/n + 20 → 无解——提升系统的某一部分并期望获得系统整体性能的成比例提升，是难以实现的（<strong>不可能做到</strong>）。</p>
          <p><strong>可扩展性示例（课件原题）</strong>：Workload：10 个标量相加 + 10×10 矩阵求和（110 个加法），假设完美负载均衡：</p>
          <table class="tbl">
            <thead><tr><th>处理器数</th><th>时间</th><th>加速比</th><th>占潜力</th></tr></thead>
            <tbody>
              <tr><td>1</td><td>110 t<sub>add</sub></td><td>1×</td><td>—</td></tr>
              <tr><td>10</td><td>20 t<sub>add</sub></td><td>5.5×</td><td>55%</td></tr>
              <tr><td>100</td><td>11 t<sub>add</sub></td><td>10×</td><td>10%</td></tr>
            </tbody>
          </table>
          <p>若换成 100×100 矩阵（10010 个加法）且可负载均衡：10 个处理器加速比 10010/1010 = <strong>9.9×</strong>（99%）；100 个处理器 10010/110 = <strong>91×</strong>（91%）。</p>
          <p><strong>强可扩展性 vs 弱可扩展性</strong>：强可扩展——相同问题规模下依然具有可扩展性；弱可扩展——需要增加问题规模才具有可扩展性。思考：你遇到的计算问题中哪些是强可扩展的（Game app？Music app？Programming？）</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch13-coherence',
      heading: '4. 一致性问题的引入',
      blocks: [
        {
          type: 'html',
          html: `
          <p>如何利用多核提升性能？写正确的并行程序需要理解三项核心技术：<strong>Cache coherence</strong>、<strong>Synchronization</strong>、<strong>Memory consistency</strong>。接下来只讲最开头：</p>
          <ul>
            <li>理解缓存一致性问题；</li>
            <li>同步并行程序：原子指令、硬件对同步的支持；</li>
            <li>写并行程序（超纲）：线程与进程、临界区、竞争条件与互斥锁。</li>
          </ul>
          <p><strong>SMP（共享存储多处理器）</strong>：典型 2–8 核；硬件为所有处理器提供单一的物理地址空间；假定 uniform memory access（忽略 NUMA 效应）。</p>
          <p><strong>一致性问题</strong>：Thread A（Core0）与 Thread B（Core1）各执行 <code>for(...) x = x + 1; x = x + 1;</code>，x 初值 0——两个循环都结束后 x 的值是多少？A. 6　B. 8　C. 10　D. All of the above　E. None of the above。</p>
          <p>原因：两个线程看到的存储器视图是通过各自的 cache 的；没有一致性机制时，处理器可能看到同一内存位置（共享数据）的<strong>不同（不一致的）值</strong>。还会产生的问题：<code>x = x + 1</code> 不是原子操作（LW、ADDIU、SW 三条指令），两个线程的读写可能交错。</p>
          <p>下一讲：缓存一致性协议（写无效、MESI）与目录协议。</p>
          `,
        },
      ],
    },
  ],
};

export default ch;
