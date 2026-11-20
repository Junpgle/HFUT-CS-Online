/* 计算机体系结构 · 第1讲 基本概念 —— 依据「课件/PPT/计算机系统结构-第一章.pdf」（丁贤庆，74 页）整理 */
import type { CaChapter } from './types';

const ch: CaChapter = {
  id: 'ch1',
  no: '第1讲',
  title: '基本概念',
  subtitle: '第 1 讲 · 基本概念',
  lede: `
  本讲是全课程的框架图：<strong>计算机系统的多级层次结构</strong>、系统结构的<strong>经典定义</strong>（软硬件交界面 = 指令集）与
        组成/实现两个层次、<strong>冯氏分类</strong>与 <strong>Flynn 分类</strong>、定量分析三件套（Amdahl 定律、CPU 性能公式、局部性原理），
        最后以冯·诺依曼结构的演进与<strong>并行性</strong>的三条技术途径收尾。
        1.3 节与第2讲（性能评测）内容衔接——第2讲按课程组课件深入展开，本讲按教材第一章范围整理。
`,
  toc: [
    { id: 'sec-ch1-intro', text: '1. 引言', level: 2 },
    { id: 'sec-ch1-concept', text: '2. 系统结构的概念', level: 2 },
    { id: 'sec-ch1-classify', text: '3. 系统结构的分类', level: 2 },
    { id: 'sec-ch1-quant', text: '4. 定量分析技术', level: 2 },
    { id: 'sec-ch1-evolve', text: '5. 系统结构的发展', level: 2 },
    { id: 'sec-ch1-parallel', text: '6. 并行性的发展', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ch1-intro',
      heading: '1. 引言',
      blocks: [
        {
          type: 'html',
          html: `
          <p>第一台通用电子计算机诞生于 <strong>1946 年</strong>。计算机技术的飞速发展得益于两个方面：<strong>计算机制造技术的发展</strong>与<strong>计算机系统结构的创新</strong>。按每年性能增长划分四个阶段：</p>
          <table class="tbl">
            <thead><tr><th>时间</th><th>原因</th><th>每年性能增长</th></tr></thead>
            <tbody>
              <tr><td>1946 年起的 25 年</td><td>两种因素都起着主要的作用</td><td>约 25%</td></tr>
              <tr><td>20 世纪 70 年代末～80 年代初</td><td>大规模集成电路和微处理器出现，制造技术主导</td><td>约 35%</td></tr>
              <tr><td>20 世纪 80 年代中开始</td><td>RISC 结构出现，系统结构不断更新变革（维持约 16 年）</td><td>50% 以上</td></tr>
              <tr><td>2002 年以来</td><td>功耗问题、可开发的指令级并行已经很少、存储器访问速度提高缓慢</td><td>约 20%</td></tr>
            </tbody>
          </table>
          <div class="callout key">
            <p><strong>近年来的重大转折</strong>：从单纯依靠<strong>指令级并行</strong>（ILP）转向开发<strong>线程级并行</strong>（TLP）和<strong>数据级并行</strong>（DLP）。2003 年起服务器率先采用多核 CPU，2005 年起多核微处理器普及——单核频率时代结束，多核技术日趋成熟。</p>
          </div>
          `,
        },
      ],
    },
    {
      id: 'sec-ch1-concept',
      heading: '2. 系统结构的概念',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>计算机系统 = 硬件/固件 + 软件</strong>。从计算机语言的角度，把计算机系统按功能划分成<strong>多级层次结构</strong>，每一层以一种语言为特征，自底向上：</p>
          <ul>
            <li>第 1 级：<strong>微程序机器级</strong>（硬件）；</li>
            <li>第 2 级：<strong>机器语言（传统机器级）</strong>；</li>
            <li>第 3 级：<strong>操作系统虚拟机</strong>；</li>
            <li>第 4 级：<strong>汇编语言虚拟机</strong>；</li>
            <li>第 5 级：<strong>高级语言虚拟机</strong>；</li>
            <li>第 6 级：<strong>应用语言虚拟机</strong>。</li>
          </ul>
          <p><strong>虚拟机</strong>：由软件实现的机器。语言实现的两种基本技术：</p>
          <table class="tbl">
            <thead><tr><th>技术</th><th>做法</th><th>特点</th></tr></thead>
            <tbody>
              <tr><td><strong>翻译</strong></td><td>先把 N+1 级程序全部转换成 N 级程序，再执行新产生的 N 级程序</td><td>执行快，占用存储空间多</td></tr>
              <tr><td><strong>解释</strong></td><td>每译码一条 N+1 级指令，就执行一串等效的 N 级指令，逐条重复</td><td>耗时多，占用存储空间较少</td></tr>
            </tbody>
          </table>
          <h3 id="sec-ch1-concept-h1">系统结构的定义</h3>
          <div class="callout key">
            <p><strong>经典定义</strong>：计算机系统结构是<strong>程序员所看到的计算机属性</strong>，即概念性结构与功能特性。</p>
            <p><strong>Amdahl 提出的定义</strong>（更常用）：传统机器语言级程序员所看到的计算机属性，包括指令集结构、组成、硬件。对通用寄存器型机器，这些属性主要指：指令系统（操作类型与格式、排序与控制机构）、数据表示、寻址规则、寄存器定义、中断系统、机器工作状态的定义和切换（管态/目态）、存储系统、信息保护、I/O 结构。</p>
            <p><strong>概念的实质</strong>：确定计算机系统中<strong>软、硬件的界面</strong>——界面之上是软件实现的功能，界面之下是硬件和固件实现的功能。这条界面就是<strong>指令集</strong>（instruction set）。</p>
          </div>
          <h3 id="sec-ch1-concept-h2">组成与实现</h3>
          <ul>
            <li><strong>计算机系统结构</strong>：计算机系统的软、硬件界面，即机器语言程序员看到的传统机器级属性；</li>
            <li><strong>计算机组成</strong>：计算机系统结构的<strong>逻辑实现</strong>——物理机器级内的数据流和控制流的组成及逻辑设计，着眼于各事件的排序与控制方式、各部件功能及相互联系；</li>
            <li><strong>计算机实现</strong>：计算机组成的<strong>物理实现</strong>——处理机/主存等部件的物理结构、器件集成度与速度、模块与底板划分连接、信号传输、电源冷却与整机装配，着眼于器件技术（起主导作用）与微组装技术。</li>
          </ul>
          <p>三者是递进关系：<strong>一种体系结构可以有多种组成，一种组成可以有多种物理实现</strong>。</p>
          <p><strong>系列机</strong>：由同一厂家生产的具有<strong>相同系统结构</strong>、但具有不同组成和实现的一系列不同型号的计算机，如 IBM 370 系列、Intel x86 系列。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch1-classify',
      heading: '3. 系统结构的分类',
      blocks: [
        {
          type: 'html',
          html: `
          <p>常见的分类法有两种：<strong>冯氏分类法</strong>与 <strong>Flynn 分类法</strong>。</p>
          <p><strong>冯氏分类法</strong>：用系统的<strong>最大并行度</strong>对计算机分类——单位时间内能处理的最大二进制位数。平面直角坐标系中，横坐标表示<strong>字宽</strong>（n 位），纵坐标表示一次能同时处理的<strong>字数</strong>（m 字），<strong>m × n 即最大并行度</strong>。</p>
          <p><strong>Flynn 分类法</strong>：按照<strong>指令流</strong>和<strong>数据流</strong>的<strong>多倍性</strong>分类。指令流是计算机执行的指令序列，数据流是由指令流调用的数据序列，多倍性指系统受限部件上同时处于同一执行阶段的指令或数据的最大数目。四种基本结构（CU 控制部件、PU 处理部件、MM/SM 存储器）：</p>
          <table class="tbl">
            <thead><tr><th>类型</th><th>全称</th><th>结构要点</th></tr></thead>
            <tbody>
              <tr><td><strong>SISD</strong></td><td>单指令流单数据流</td><td>一个 CU、一个 PU，顺序执行——传统单处理机</td></tr>
              <tr><td><strong>SIMD</strong></td><td>单指令流多数据流</td><td>一个 CU 指挥多个 PU，对多条数据流同时做同一操作——阵列处理机</td></tr>
              <tr><td><strong>MISD</strong></td><td>多指令流单数据流</td><td>多个 CU 对同一条数据流分别处理，实际中罕见</td></tr>
              <tr><td><strong>MIMD</strong></td><td>多指令流多数据流</td><td>多个 CU-PU 各自执行独立指令流——多处理机/多核系统</td></tr>
            </tbody>
          </table>
          `,
        },
      ],
    },
    {
      id: 'sec-ch1-quant',
      heading: '4. 定量分析技术',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ch1-quant-h1">以经常性事件为重点</h3>
          <p>定量原理第一条：<strong>对经常发生的情况重点优化</strong>——分配更多的资源、达到更高的性能，以获得总体上更多的改进。这就是第2讲 Amdahl 定律一节「make the common case fast」的思想源头。</p>
          <h3 id="sec-ch1-quant-h2">Amdahl 定律</h3>
          <p>加快某部件执行速度所获得的系统性能加速比，<strong>受限于该部件执行时间占总执行时间的百分比</strong>。设可改进比例为 f（≤1），部件加速比为 fe（&gt;1）：</p>
          <div class="formula"><span class="m">S</span> = <span class="m">1 / ((1 − f) + f / fe)</span></div>
          <p>推导：改进后总执行时间 = (1 − f) × 改进前总时间 + (f / fe) × 改进前总时间 = [(1 − f) + f/fe] × 改进前总时间。</p>
          <p><strong>例 1.1</strong>（课件原题）：某功能部件处理速度提高到原来的 20 倍，但该功能处理时间仅占整个系统运行时间的 40%，整体性能提高到多少？</p>
          <p>f = 0.4、fe = 20 → S = 1 / (0.6 + 0.4/20) = <strong>1.613 倍</strong>。</p>
          <p><strong>例 1.2</strong>（逆向求 f）：浮点部件加速 20 倍后，某程序整体性能提高到 5 倍，求浮点操作所占比例。</p>
          <p>S = 5、fe = 20 → 5 = 1 / ((1 − f) + f/20) → 1 − 0.95f = 0.2 → <strong>f = 84.2%</strong>。</p>
          <h3 id="sec-ch1-quant-h3">CPU 性能公式</h3>
          <div class="formula">CPU 时间 = <span class="m">IC</span> × <span class="m">CPI</span> × 时钟周期时间</div>
          <ul>
            <li><strong>时钟周期时间</strong>：取决于硬件实现技术和计算机组成；</li>
            <li><strong>CPI</strong>（Cycles Per Instruction）：取决于计算机组成和指令集结构；</li>
            <li><strong>IC</strong>（指令条数）：取决于指令集结构和编译技术。</li>
          </ul>
          <p>程序含 n 种指令时（ICi 为第 i 种指令出现次数，CPIi 为其处理时间）：</p>
          <div class="formula">CPI = Σ<sub>i=1…n</sub> (CPI<sub>i</sub> × IC<sub>i</sub>) / IC = Σ<sub>i=1…n</sub> CPI<sub>i</sub> × (IC<sub>i</sub>/IC)</div>
          <p>其中 (ICi/IC) 反映第 i 种指令在程序中所占的比例。</p>
          <p><strong>例题</strong>（课件原题）：400 MHz 计算机运行标准测试程序，指令统计如下，求有效 CPI、MIPS 与程序执行时间。</p>
          <table class="tbl">
            <thead><tr><th>指令类型</th><th>指令执行数量</th><th>平均时钟周期数</th></tr></thead>
            <tbody>
              <tr><td>整数</td><td>45 000</td><td>1</td></tr>
              <tr><td>数据传送</td><td>75 000</td><td>2</td></tr>
              <tr><td>浮点</td><td>8 000</td><td>4</td></tr>
              <tr><td>分支</td><td>1 500</td><td>2</td></tr>
            </tbody>
          </table>
          <p>总时钟周期数 = 45000×1 + 75000×2 + 8000×4 + 1500×2 = 230 000；IC = 129 500 条。</p>
          <p>有效 <strong>CPI = 230000 / 129500 ≈ 1.78</strong>；执行时间 = 230000 / 400MHz = <strong>0.575 ms</strong>；MIPS = 129500 / (0.575×10<sup>−3</sup> × 10<sup>6</sup>) ≈ <strong>225</strong>。</p>
          <p><strong>例 1.3</strong>（课件原题）：条件分支的两种设计——CPUA 用比较指令设置条件码再测试分支（分支、比较各占 20%，其余 60%）；CPUB 在分支指令中包含比较（分支占 25%，其余 75%）。两类 CPU 分支指令均 2 拍、其余 1 拍，CPUB 的时钟周期是 CPUA 的 1.25 倍，哪个更快？</p>
          <p>CPI(A) = 0.2×2 + 0.8×1 = 1.2；CPI(B) = 0.25×2 + 0.75×1 = 1.25；IC(B) = 0.8 × IC(A)。</p>
          <p>Time(A) = IC(A) × 1.2 × T；Time(B) = 0.8 × IC(A) × 1.25 × 1.25T = <strong>1.25 IC(A)·T</strong> &gt; 1.2 IC(A)·T → <strong>CPUA 更快</strong>（尽管指令条数多，时钟周期短占优）。</p>
          <p>若 CPUB 时钟周期仅为 CPUA 的 1.1 倍：Time(B) = 0.8 × 1.25 × 1.10 = <strong>1.10 IC(A)·T</strong> &lt; 1.2 → <strong>CPUB 更快</strong>。结论：评价性能要看 CPU 时间三要素的<strong>乘积</strong>，不能只看指令条数或主频。</p>
          <h3 id="sec-ch1-quant-h4">程序的局部性原理</h3>
          <div class="callout key">
            <p>程序访问的存储器地址分布<strong>不是随机的，而是相对簇聚</strong>。经验规则：程序执行时间的 <strong>90% 花在程序中 10% 的代码</strong>上。</p>
            <ul>
              <li><strong>时间局部性</strong>：程序即将用到的信息很可能就是目前正在使用的信息；</li>
              <li><strong>空间局部性</strong>：程序即将用到的信息很可能与正在使用的信息在空间上相邻或临近。</li>
            </ul>
            <p>它是第9～11讲存储层次与 Cache 设计得以成立的前提。</p>
          </div>
          <h3 id="sec-ch1-quant-h5">性能评测（了解）</h3>
          <p>评测角度因人而异：用户关心单个程序的<strong>执行时间</strong>，数据中心管理员关心单位时间完成的任务数（<strong>吞吐率</strong>）。X 比 Y 快：对给定任务 X 的执行时间更少；X 的性能是 Y 的 n 倍即执行时间之比为 n。基准测试首选<strong>真实应用程序</strong>，最成功的是 <strong>SPEC</strong> 系列（SPEC CPU2006：整型 12 个 + 浮点 17 个；SPECSFS 测 NFS 吞吐率、SPECWeb 测 Web 服务器），事务处理领域用 <strong>TPC</strong> 系列——这一主题在第2讲展开。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch1-evolve',
      heading: '5. 系统结构的发展',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ch1-evolve-h1">冯·诺依曼结构及其改进</h3>
          <p><strong>存储程序原理</strong>的基本点是<strong>指令驱动</strong>：程序预先存放在存储器中，机器启动后按程序指定的逻辑顺序自动执行。主要特点：</p>
          <ul>
            <li>以<strong>运算器</strong>为中心；</li>
            <li>指令和数据<strong>同等对待</strong>地存放在存储器中（程序可修改）；</li>
            <li>存储器按地址访问、顺序线性编址，每个单元位数固定；</li>
            <li>指令<strong>顺序执行</strong>，分支由转移指令实现，PC 指明当前指令地址；</li>
            <li>指令由<strong>操作码和地址码</strong>组成，数据以二进制编码、采用二进制运算。</li>
          </ul>
          <p>对系统结构的改进沿四条线展开：<strong>输入/输出方式</strong>（程序等待 → 程序中断 → DMA → 通道/外围处理机）、<strong>并行处理技术</strong>（微操作级/指令级/线程级/进程级/任务级）、<strong>存储器组织</strong>（相联存储器、通用寄存器组、Cache）、<strong>指令集</strong>（CISC 与 RISC 两个方向）。</p>
          <h3 id="sec-ch1-evolve-h2">软件可移植性</h3>
          <p><strong>软件的可移植性</strong>：软件可以不经修改或只做少量修改就从一台机器移植到另一台机器上正确运行，差别只是执行时间。实现可移植性的三种常用方法：</p>
          <ul>
            <li><strong>系列机</strong>：相同系统结构、不同组成与实现，较好地解决「软件开发要求系统结构相对稳定」与「器件硬件迅速发展」的矛盾。向上/向下兼容按机器<strong>档次</strong>分，向前/向后兼容按投放市场<strong>时间</strong>分；<strong>向后兼容是系列机的根本特征</strong>。<strong>兼容机</strong>：不同公司厂家生产的具有相同系统结构的计算机；</li>
            <li><strong>模拟与仿真</strong>：在一种系统结构上实现另一种系统结构的指令集。<strong>模拟</strong>用宿主机软件（通常解释）实现虚拟机指令集，速度慢；<strong>仿真</strong>用宿主机微程序解释实现目标机指令集，速度较快，但只适合系统结构差距不大的机器之间；</li>
            <li><strong>统一高级语言</strong>：理想方法，但较难实现。</li>
          </ul>
          <h3 id="sec-ch1-evolve-h3">器件发展的影响</h3>
          <p><strong>摩尔定律</strong>：集成电路芯片上集成的晶体管数目每隔 <strong>18 个月翻一番</strong>。计算机的分代主要以<strong>器件</strong>为划分标准：</p>
          <table class="tbl">
            <thead><tr><th>分代</th><th>器件</th><th>结构特征</th><th>典型实例</th></tr></thead>
            <tbody>
              <tr><td>第一代（1945–1954）</td><td>电子管和继电器</td><td>存储程序计算机，机器/汇编语言</td><td>ENIAC、IBM 701</td></tr>
              <tr><td>第二代（1955–1964）</td><td>晶体管、磁芯</td><td>浮点数据表示、中断、I/O 处理机</td><td>Univac LARC、IBM 7030</td></tr>
              <tr><td>第三代（1965–1974）</td><td>SSI/MSI</td><td>微程序、流水线、Cache、系列机</td><td>IBM 360/370、CDC 6600</td></tr>
              <tr><td>第四代（1975–1990）</td><td>LSI/VLSI</td><td>向量处理、并行与分布处理</td><td>Cray-1、DEC VAX 9000</td></tr>
              <tr><td>第五代（1991– ）</td><td>高性能微处理器</td><td>超标量、超流水、SMP/MPP、机群</td><td>SGI Cray T3E、IBM SP2</td></tr>
            </tbody>
          </table>
          `,
        },
      ],
    },
    {
      id: 'sec-ch1-parallel',
      heading: '6. 并行性的发展',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>并行性</strong>：计算机系统在同一时刻或同一时间间隔内进行多种运算或操作——只要在时间上相互重叠就存在并行性。</p>
          <ul>
            <li><strong>同时性</strong>：两个或两个以上的事件在<strong>同一时刻</strong>发生；</li>
            <li><strong>并发性</strong>：两个或两个以上的事件在<strong>同一时间间隔</strong>内发生。</li>
          </ul>
          <h3 id="sec-ch1-parallel-h1">并行性等级</h3>
          <p>从处理<strong>数据</strong>的角度（低 → 高）：<strong>字串位串</strong>（每次处理一个字的一位，无并行）→ <strong>字串位并</strong>（同时处理一个字的全部位）→ <strong>字并位串</strong>（同时对许多字的同一位即位片处理）→ <strong>全并行</strong>（同时对许多字的全部或部分位处理）。</p>
          <p>从执行<strong>程序</strong>的角度（低 → 高）：<strong>指令内部并行</strong>（单条指令内各微操作）→ <strong>指令级并行</strong>（并行执行两条以上指令）→ <strong>线程级并行</strong>（进程内派生的多个线程）→ <strong>任务级/过程级并行</strong>（子程序或进程为单元）→ <strong>作业或程序级并行</strong>。</p>
          <h3 id="sec-ch1-parallel-h2">提高并行性的三条途径</h3>
          <table class="tbl">
            <thead><tr><th>途径</th><th>思想</th><th>例子</th></tr></thead>
            <tbody>
              <tr><td><strong>时间重叠</strong></td><td>引入时间因素：多个处理过程在时间上相互错开、轮流重叠使用同一套硬件的各个部分，以加快硬件周转赢得速度</td><td>流水线处理机、先行控制</td></tr>
              <tr><td><strong>资源重复</strong></td><td>引入空间因素，以数量取胜：重复设置硬件资源提高性能</td><td>多操作部件、阵列处理机</td></tr>
              <tr><td><strong>资源共享</strong></td><td>软件方法：多个任务按一定时间顺序轮流使用同一套硬件</td><td>分时系统、虚拟机</td></tr>
            </tbody>
          </table>
          <h3 id="sec-ch1-parallel-h3">单机系统中并行性的发展</h3>
          <p>发展高性能单处理机的过程中，起主导作用的是<strong>时间重叠</strong>原理，其实现基础是<strong>部件功能专用化</strong>：把一件工作按功能分割为若干部分、指定给专门部件、再按时间重叠起来。指令处理的五个过程分给五个专用部件——取指（IF）、译码（ID）、执行（EX）、访存（M）、写结果（WB）：</p>
          <div class="formula">串行：<span class="m">IF ID EX M WB → IF ID EX M WB → …</span>　　流水：<span class="m">IF IF IF / ID ID ID / EX …</span>（相邻指令错开一拍）</div>
          <p>资源重复的运用也已十分普遍：<strong>多体存储器</strong>、<strong>多操作部件</strong>（加法/乘法/除法/逻辑运算部件重复设置，操作部件空闲即可开始执行，实现指令级并行），更进一步是<strong>阵列处理机</strong>——许多相同的处理单元在同一控制器指挥下，按同一条指令对向量或数组的各元素同时做同一操作（SIMD）。资源共享的实质是用单处理机<strong>模拟多处理机</strong>的功能，形成虚拟机概念（分时系统）。</p>
          <h3 id="sec-ch1-parallel-h4">多机系统中并行性的发展</h3>
          <p>多机系统沿时间重叠、资源重复、资源共享三条途径发展为三种多处理机：<strong>同构型</strong>（多个同类型/同等功能处理机同时处理同一作业中能并行的多个任务）、<strong>异构型</strong>（多个不同类型/不同功能处理机按作业顺序分工加工，如专用外围处理机、数组运算/高级语言翻译/数据库管理专用处理机）、<strong>分布式系统</strong>。</p>
          <p><strong>耦合度</strong>反映多机系统中各机器之间物理连接的紧密程度和交互作用能力的强弱：<strong>紧密耦合系统</strong>（直接耦合）经总线或高速开关互连、频带较高、可共享主存；<strong>松散耦合系统</strong>（间接耦合）经通道或通信线路互连、共享外存，机器间在文件或数据集一级相互作用——两种形式为功能专用化的共享外存连接与计算机网络。</p>
          <div class="callout warn">
            <p><strong>与后续讲次的衔接</strong>：时间重叠（流水线）在第4～6讲展开；资源重复（多核）与线程级并行在第13～14讲展开；资源共享（虚存）在第12讲展开。本讲的三条途径是全课程的地图。</p>
          </div>
          `,
        },
      ],
    },
  ],
};

export default ch;
