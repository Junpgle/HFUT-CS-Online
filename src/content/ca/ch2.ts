/* 计算机体系结构 · 第2讲 性能评测 —— 依据「课件/02-性能评测.pptx」（李建华，32 页）整理 */
import type { CaChapter } from './types';

const ch: CaChapter = {
  id: 'ch2',
  no: '第2讲',
  title: '性能评测',
  subtitle: '第 2 讲 · 性能评测',
  lede: `
  本讲回答「性能指什么、如何度量」：<strong>响应时间与吞吐率</strong>两种视角、评测性能的<strong>铁律</strong>（CPU Time = 指令数 × CPI × 时钟周期）、
        <strong>MIPS 指标</strong>及其适用条件、<strong>基准测试</strong>（SPEC）与均值方法，最后是<strong>Amdahl 定律</strong>——「make the common case fast」。
        机器比较、性能分析示例与 Amdahl 极限计算是期末的送分题。
`,
  toc: [
    { id: 'sec-ch2-perf', text: '1. 性能指什么', level: 2 },
    { id: 'sec-ch2-iron', text: '2. CPU Time 铁律', level: 2 },
    { id: 'sec-ch2-mips', text: '3. MIPS 指标', level: 2 },
    { id: 'sec-ch2-bench', text: '4. 基准测试', level: 2 },
    { id: 'sec-ch2-mean', text: '5. 均值的选取', level: 2 },
    { id: 'sec-ch2-amdahl', text: '6. Amdahl 定律', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ch2-perf',
      heading: '1. 性能指什么',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>不同角色关注不同指标</strong>：</p>
          <ul>
            <li><strong>用户</strong>关注处理程序所需的时间 ${'t'}<sub>response</sub> = ${'t'}<sub>end</sub> − ${'t'}<sub>start</sub>，即<strong>响应时间</strong>（response time）；</li>
            <li><strong>系统（数据中心）管理者</strong>关注每秒钟能完成的任务数量，即<strong>吞吐率</strong>（throughput）；</li>
            <li><strong>架构师（设计者）</strong>最关注 <strong>CPU time</strong>（用于执行程序的时间），也需要关注能耗（energy、power，见教材 1.5 小节，本课程不展开）。</li>
          </ul>
          <p>一个程序花费的时间 = CPU time + I/O time，本课程重点讨论 CPU time。</p>
          <p><strong>性能的定义</strong>：通常「量越大越好」，而时间是「越小越好」，因此定义性能 = 1 / X，X 为执行时间。</p>
          <div class="callout key">
            <p><strong>机器比较的两种说法（务必区分）</strong>：</p>
            <ul>
              <li>机器 A 的速度是机器 B 的 n 倍：perf(A)/perf(B) = time(B)/time(A) = n；</li>
              <li>机器 A 比机器 B 快 x%：perf(A)/perf(B) = time(B)/time(A) = 1 + x/100。</li>
            </ul>
            <p>举例：time(A) = 10s，time(B) = 15s → 15/10 = 1.5，既说「A 是 B 的 1.5 倍快」，也说「A 比 B 快 50%」。</p>
          </div>
          <p><strong>目标程序（workloads）很重要</strong>：科学仿真看浮点性能、程序设计看整型性能、数据库看存储与 I/O 性能——购买与设计机器时都要围绕目标应用及其核心指标；对生产者而言成本（cost）同样重要。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch2-iron',
      heading: '2. CPU Time 铁律',
      blocks: [
        {
          type: 'html',
          html: `
          <p>硬件能感知到的是<strong>指令</strong>的处理，而不是程序：程序是对问题的抽象，底层一条指令被 CPU 划分为一个或多个时钟周期，由状态机在时钟驱动下切换状态完成。</p>
          <p>把程序的执行分解为指令处理后，得到评测性能的<strong>铁律</strong>：</p>
          <div class="formula">CPU Time = 指令数 <span class="m">IC</span> × 每条指令时钟周期数 <span class="m">CPI</span> × 时钟周期时间 <span class="m">T<sub>c</sub></span></div>
          <p>三个要素的来源：</p>
          <ul>
            <li><strong>Instructions/Program</strong>：程序运行过程所执行的指令数（不是二进制代码里的指令数），由算法、编译器、ISA 决定；</li>
            <li><strong>Cycles/Instruction（CPI）</strong>：指令处理所需平均时钟周期数，由 ISA 与 CPU 组织决定，例如流水线会降低这个分量；</li>
            <li><strong>Time/cycle</strong>：一个时钟周期所需时间，由技术、组成、电路设计技术决定。</li>
          </ul>
          <div class="callout warn">
            <p><strong>优化注意事项</strong>：要最小化三要素的<strong>乘积</strong>，而不是某个独立项。常见错误是只改变 ISA 来减少指令数，但 ISA 改变可能导致 CPU 实现复杂、时钟周期变长——三要素是相互关联的。</p>
          </div>
          <h3 id="sec-ch2-iron-h1">性能分析示例</h3>
          <p><strong>示例 A</strong>（课件原题）：机器 A：clock 1ns、CPI 2.0；机器 B：clock 2ns、CPI 1.2，运行为程序 X。哪个机器快，快多少？</p>
          <p>设程序 X 共有 N 条指令：Time(A) = N × 2.0 × 1 = 2N；Time(B) = N × 1.2 × 2 = 2.4N；Time(B)/Time(A) = 1.2 → <strong>机器 A 比机器 B 快 20%</strong>。</p>
          <p><strong>示例 C</strong>（同 B 卷）：维持 clock(A) @ 1ns、clock(B) @ 2ns，并假设 CPI(B) = 1.2，要获得相同的性能，CPI(A) 应该是多少？</p>
          <p>令 Time(B)/Time(A) = 1，即 (N × 2 × 1.2) / (N × 1 × CPI(A)) = 1 → <strong>CPI(A) = 2.4</strong>。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch2-mips',
      heading: '3. MIPS 指标',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>MIPS</strong>（Million Instructions per Second）：</p>
          <div class="formula">MIPS = 指令数 / (执行时间 × 10<sup>6</sup>) = 时钟频率 / (<span class="m">CPI</span> × 10<sup>6</sup>)</div>
          <ul>
            <li>通常用于机器<strong>峰值性能</strong>的声明；</li>
            <li>MIPS 有其自身的问题（不同 ISA 的指令不能直接比较）。</li>
          </ul>
          <p><strong>什么情况下可以用 MIPS？</strong>相同的 compiler 和相同的 ISA——例如同一个可执行文件运行在 AMD Jaguar 与 Intel Core i7 上。因为 compiler 与 ISA 相同，指令数与指令类型在两种场景下都一样。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch2-bench',
      heading: '4. 基准测试',
      blocks: [
        {
          type: 'html',
          html: `
          <p>只拿一个程序对比执行时间只能算「部分正确」；工程上使用<strong>基准测试</strong>（benchmark）：选择一组公认的程序来评测性能，通常选择一台参照机器作为比较对象。</p>
          <p><strong>基准测试的好处</strong>：节省开销、消除争议。面临的问题：代表性？诚实性？Benchmarketing？</p>
          <p><strong>以 SPEC2000 为例</strong>：System Performance Evaluation Cooperative，80 年代成立以对抗 benchmarketing；版本有 SPEC89/92/95/2000/2006，最新为 SPEC2017；SPEC2000 含 12 个整型程序与 14 个浮点程序；以 Sun Ultra-5 300MHz 作为参照机器、得分为 100；报告结果为相对参照机的比值的<strong>几何均值</strong>（GM）。</p>
          <table class="tbl">
            <thead><tr><th>基准测试的陷阱</th><th>说明</th></tr></thead>
            <tbody>
              <tr><td>没有代表性</td><td>做数据库想测 I/O，选 SPEC 是无用的</td></tr>
              <tr><td>太老</td><td>Benchmark 很容易变老从而无用；由于 benchmarketing 压力，厂商会不断优化编译器、某些硬件部件与软件来获得高分</td></tr>
              <tr><td>需要周期性更新</td><td>例如 SPEC89→SPEC2017 的演进</td></tr>
            </tbody>
          </table>
          <p>它们不是玩具程序：都是密集计算或通信的真实程序（如 164.gzip 压缩、176.gcc 编译器、171.swim 浅水模拟）。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch2-mean',
      heading: '5. 均值的选取',
      blocks: [
        {
          type: 'html',
          html: `
          <p>基准测试程序是一组 workloads，两台机器运行后得到两组数据，如何确定哪台性能好？</p>
          <p><strong>反例（课件原表）</strong>：Program 1：A=1、B=10；Program 2：A=1000、B=100。</p>
          <ul>
            <li>若直接把 B/A 的比值（0.1、10）取<strong>算术均值</strong>，得到 5.05——但把 A 当参照与把 B 当参照会得出互相矛盾的结论：<strong>对于 ratios，不能用算术均值</strong>；</li>
            <li>可用的方法：<strong>几何均值</strong>（Geometric Mean）——n 个比值之积开 n 次方。GM 独立于参考机器（上面的例子中无论参照 A 还是 B，GM 都是 1）；</li>
            <li>此外，GM of ratios 与程序的执行时间不成比例（这一点要清楚）。</li>
          </ul>
          <div class="formula">GM = (<span class="m">∏<sub>i=1…n</sub> ratio(i)</span>)<sup>1/n</sup></div>
          `,
        },
      ],
    },
    {
      id: 'sec-ch2-amdahl',
      heading: '6. Amdahl 定律',
      blocks: [
        {
          type: 'html',
          html: `
          <p>动机：<strong>make the common case fast</strong>（八条 Great Ideas 之一）。</p>
          <p><strong>定义</strong>：加速比 = old time / new time。假设把系统中占比 f 的部分加速 s 倍：</p>
          <div class="formula"><span class="m">new_time</span> = <span class="m">(1 − f)</span> × <span class="m">old_time</span> + <span class="m">(f / s)</span> × <span class="m">old_time</span></div>
          <div class="formula"><span class="m">speedup</span> = <span class="m">1 / ((1 − f) + f / s)</span></div>
          <p><strong>课件示例</strong>：</p>
          <table class="tbl">
            <thead><tr><th>改进对象</th><th>f</th><th>s</th><th>speedup</th></tr></thead>
            <tbody>
              <tr><td>提高 ALU（占 95% 时间）10%</td><td>95%</td><td>1.10</td><td>1.094</td></tr>
              <tr><td>提高存储流水线（占 5% 时间）10 倍</td><td>5%</td><td>10</td><td>1.047</td></tr>
              <tr><td>同上，加速比无穷大</td><td>5%</td><td>∞</td><td>1.052</td></tr>
            </tbody>
          </table>
          <div class="callout key">
            <p><strong>意义与推论</strong>：如果 (1 − f) 不可忽略，加速比就会被它限制：当 s → ∞ 时，speedup 的上限为 1 / (1 − f)。所以「1024 核 GPU 常见、1024 核 CPU 几乎看不到」——受限的不是核数，而是不可并行部分的占比（limited parallelism）。</p>
            <p>「好的计算机系统」是具有高性能价格比的系统，是一个均衡的系统，而不是某些部件性能突出。</p>
          </div>
          `,
        },
      ],
    },
  ],
};

export default ch;
