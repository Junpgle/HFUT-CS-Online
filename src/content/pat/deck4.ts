import type { DeckData } from '../types';

/** 讲义 · 动态规划 —— 依据《ICPC 培训讲义》第四章整理 */
const deck: DeckData = {
  id: 'deck4',
  no: '讲义 4',
  title: '讲义 · 动态规划',
  subtitle: '讲义第四章 · 动态规划',
  lede: `
    <p>本章介绍动态规划的基本思想和基本步骤，通过实例研究利用动态规划设计算法的具体途径，讨论动态规划的一些实现技巧，并将动态规划和其他一些算法作了比较，最后还简单介绍了动态规划的数学理论基础和当前最新的研究成果。</p>
  `,
  toc: [
    { id: 'sec-intro', text: '一、引言——由一个问题引出的算法', level: 2 },
    { id: 'sec-concept', text: '二、动态规划的基本概念', level: 2 },
    { id: 'sec-concept-h1', text: '2.1 动态规划的发展及研究内容', level: 3 },
    { id: 'sec-concept-h2', text: '2.2 多阶段决策问题', level: 3 },
    { id: 'sec-concept-h3', text: '2.3 决策过程的分类', level: 3 },
    { id: 'sec-elements', text: '三、动态规划模型的基本要素', level: 2 },
    { id: 'sec-theorem', text: '四、动态规划的基本定理和基本方程', level: 2 },
    { id: 'sec-cond', text: '五、动态规划的适用条件', level: 2 },
    { id: 'sec-cond-h1', text: '5.1 最优化原理（最优子结构性质）', level: 3 },
    { id: 'sec-cond-h2', text: '5.2 无后向性', level: 3 },
    { id: 'sec-cond-h3', text: '5.3 子问题的重叠性', level: 3 },
    { id: 'sec-idea', text: '六、动态规划的基本思想', level: 2 },
    { id: 'sec-steps', text: '七、动态规划算法的基本步骤', level: 2 },
    { id: 'sec-cases', text: '八、动态规划的实例分析', level: 2 },
    { id: 'sec-cases-h1', text: '例 1 生产计划问题', level: 3 },
    { id: 'sec-cases-h2', text: '例 2 Bitonic 旅行路线问题', level: 3 },
    { id: 'sec-cases-h3', text: '例 3 计算矩阵连乘积', level: 3 },
  ],
  sections: [
    {
      id: 'sec-intro',
      heading: '一、引言——由一个问题引出的算法',
      blocks: [
        {
          type: 'html',
          html: `
            <p>考虑以下问题。</p>
            <p><strong>[例 1] 最短路径问题</strong>：现有一张地图，各结点代表城市，两结点间连线代表道路，线上数字表示城市间的距离。如图 1 所示，试找出从结点 A 到结点 E 的最短距离。</p>
            <svg class="fig" viewBox="0 0 560 220" role="img" aria-label="图 1：分层城市地图，求 A 到 E 的最短距离">
              <rect x="0" y="0" width="560" height="220" fill="var(--c-panel)"/>
              <g font-size="13" fill="var(--c-ink)">
                <circle cx="60" cy="110" r="15" fill="var(--c-key-bg)" stroke="var(--c-accent)"/>
                <text x="60" y="115" text-anchor="middle">A</text>
                <circle cx="200" cy="55" r="15" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <text x="200" y="60" text-anchor="middle">B1</text>
                <circle cx="200" cy="165" r="15" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <text x="200" y="170" text-anchor="middle">B2</text>
                <circle cx="340" cy="35" r="15" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <text x="340" y="40" text-anchor="middle">C1</text>
                <circle cx="340" cy="85" r="15" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <text x="340" y="90" text-anchor="middle">C2</text>
                <circle cx="340" cy="135" r="15" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <text x="340" y="140" text-anchor="middle">C3</text>
                <circle cx="340" cy="185" r="15" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <text x="340" y="190" text-anchor="middle">C4</text>
                <circle cx="460" cy="75" r="15" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <text x="460" y="80" text-anchor="middle">D1</text>
                <circle cx="460" cy="125" r="15" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <text x="460" y="130" text-anchor="middle">D2</text>
                <circle cx="460" cy="175" r="15" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <text x="460" y="180" text-anchor="middle">D3</text>
                <circle cx="530" cy="125" r="15" fill="var(--c-tip-bg)" stroke="var(--c-ok)"/>
                <text x="530" y="130" text-anchor="middle">E</text>
              </g>
              <g stroke="var(--c-line)" stroke-width="1.4" fill="none">
                <path d="M75 104 L185 62"/><path d="M75 116 L185 158"/>
                <path d="M215 50 L325 38"/><path d="M215 58 L325 82"/><path d="M215 62 L325 130"/>
                <path d="M215 158 L325 90"/><path d="M215 164 L325 180"/><path d="M215 170 L325 188"/>
                <path d="M355 40 L448 72"/><path d="M355 85 L445 78"/><path d="M355 130 L445 122"/><path d="M355 185 L448 132"/>
                <path d="M475 78 L518 118"/><path d="M475 125 L515 125"/><path d="M475 172 L518 132"/>
              </g>
              <text x="280" y="212" text-anchor="middle" font-size="12" fill="var(--c-ink-soft)">A → B1/B2 → C1~C4 → D1~D3 → E，线上数字表示城市间的距离</text>
            </svg>
            <p>我们可以用深度优先搜索法来解决此问题，该问题的递归式为：</p>
            <div class="formula"><p>MinDistance(v) = min{ w(v,u) + MinDistance(u) : u ∈ δ(v) }，　MinDistance(E) = 0</p></div>
            <p>其中 δ(v) 是与 v 相邻的节点的集合，w(v,u) 表示从 v 到 u 的边的长度。具体算法如下：</p>
            <pre class="code"><code>function MinDistance(v):integer;
begin
    if v=E then return 0 else
    begin
        min := maxint;
        for 所有没有访问过的节点 i do
            if v 和 i 相邻 then
            begin
                标记 i 访问过了;
                t := v 到 i 的距离 + MinDistance(i);
                标记 i 未访问过;
                if t &lt; min then min = t;
            end;
    end;
end;</code></pre>
            <p>开始时标记所有的顶点未访问过，MinDistance(A) 就是从 A 到 E 的最短距离。</p>
            <p>这个程序的效率如何呢？我们可以看到，每次除了已经访问过的城市外，其他城市都要访问，所以时间复杂度为 <span class="m">O(n!)</span>，这是一个「指数级」的算法，那么，还有没有更好的算法呢？</p>
            <p>首先，我们来观察一下这个算法。在求从 B1 到 E 的最短距离的时候，先求出从 C2 到 E 的最短距离；而在求从 B2 到 E 的最短距离的时候，又求了一遍从 C2 到 E 的最短距离。也就是说，从 C2 到 E 的最短距离我们求了两遍。同样可以发现，在求从 C1、C2 到 E 的最短距离的过程中，从 D1 到 E 的最短距离也被求了两遍。而在整个程序中，从 D1 到 E 的最短距离被求了四遍。如果在求解的过程中，同时将求得的最短距离「记录在案」，随时调用，就可以避免这种情况。于是，可以改进该算法，将每次求出的从 v 到 E 的最短距离记录下来，在算法中递归地求 MinDistance(v) 时先检查以前是否已经求过了 MinDistance(v)，如果求过了则不用重新求一遍，只要查找以前的记录就可以了。这样，由于所有的点有 n 个，因此不同的状态数目有 n 个，该算法的数量级为 <span class="m">O(n)</span>。</p>
            <p>更进一步，可以将这种递归改为递推，这样可以减少递归调用的开销。请看图 1，可以发现，A 只和 B<sub>i</sub> 相邻，B<sub>i</sub> 只和 C<sub>i</sub> 相邻，……，依此类推。这样，我们可以将原问题的解决过程划分为 4 个阶段，设 <span class="m">S₁={A}, S₂={B1,B2}, S₃={C1,C2,C3,C4}, S₄={D1,D2,D3}</span>，<span class="m">F_k(u)</span> 表示从 S<sub>k</sub> 中的点 u 到 E 的最短距离，则可以递推地求出 F₁(A)，也就是从 A 到 E 的最短距离。这种算法的复杂度为 <span class="m">O(n)</span>，因为所有的状态总数（节点总数）为 n，对每个状态都只要遍历一次，而且程序很简洁。</p>
            <pre class="code"><code>procedure DynamicProgramming;
begin
    F5[E] := 0;
    for i := 4 downto 1 do
        for each u ∈ Sk do
        begin
            Fk[u] := 无穷大;
            for each v ∈ Sk+1 ∩ δ(u) do
                if Fk[u] &gt; w(u,v) + Fk+1[v] then
                    Fk[u] := w(u,v) + Fk+1[v];
        end;
    输出 F1[A];
end;</code></pre>
            <p>这种高效算法，就是<strong>动态规划</strong>算法。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-concept',
      heading: '二、动态规划的基本概念',
      blocks: [
        {
          type: 'html',
          html: `
            <h3 id="sec-concept-h1">2.1 动态规划的发展及研究内容</h3>
            <p>动态规划（dynamic programming）是运筹学的一个分支，是求解决策过程（decision process）最优化的数学方法。20 世纪 50 年代初美国数学家 R.E.Bellman 等人在研究多阶段决策过程（multistep decision process）的优化问题时，提出了著名的最优化原理（principle of optimality），把多阶段过程转化为一系列单阶段问题，逐个求解，创立了解决这类过程优化问题的新方法——动态规划。1957 年出版了他的名著 Dynamic Programming，这是该领域的第一本著作。</p>
            <p>动态规划问世以来，在经济管理、生产调度、工程技术和最优控制等方面得到了广泛的应用。例如最短路线、库存管理、资源分配、设备更新、排序、装载等问题，用动态规划方法比用其它方法求解更为方便。</p>
            <p>虽然动态规划主要用于求解以时间划分阶段的动态过程的优化问题，但是一些与时间无关的静态规划（如线性规划、非线性规划），只要人为地引进时间因素，把它视为多阶段决策过程，也可以用动态规划方法方便地求解。</p>
            <h3 id="sec-concept-h2">2.2 多阶段决策问题</h3>
            <p>多阶段决策过程，是指这样的一类特殊的活动过程：问题可以按时间顺序分解成若干相互联系的阶段，在每一个阶段都要做出决策，全部过程的决策是一个决策序列。要使整个活动的总体效果达到最优的问题，称为多阶段决策问题。</p>
            <p>引言中的例子是一个多阶段决策问题的例子，下面是另一个多阶段决策问题的例子：</p>
            <p><strong>[例 2] 生产计划问题</strong>：工厂生产某种产品，每单位（千件）的成本为 1（千元），每次开工的固定成本为 3（千元），工厂每季度的最大生产能力为 6（千件）。经调查，市场对该产品的需求量第一、二、三、四季度分别为 2，3，2，4（千件）。如果工厂在第一、二季度将全年的需求都生产出来，自然可以降低成本（少付固定成本费），但是对于第三、四季度才能上市的产品需付存储费，每季每千件的存储费为 0.5（千元）。还规定年初和年末这种产品均无库存。试制订一个生产计划，即安排每个季度的产量，使一年的总费用（生产成本和存储费）最少。</p>
            <h3 id="sec-concept-h3">2.3 决策过程的分类</h3>
            <p>根据过程的时间变量是离散的还是连续的，分为<strong>离散时间决策过程</strong>（discrete-time decision process），即多阶段决策过程，和<strong>连续时间决策过程</strong>（continuous-time decision process）；根据过程的演变是确定的还是随机的，分为<strong>确定性决策过程</strong>（deterministic decision process）和<strong>随机性决策过程</strong>（stochastic decision process），其中应用最广的是确定性多阶段决策过程。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-elements',
      heading: '三、动态规划模型的基本要素',
      blocks: [
        {
          type: 'html',
          html: `
            <p>一个多阶段决策过程最优化问题的动态规划模型通常包含以下要素：</p>
            <ol>
              <li><strong>阶段</strong>（step）：是对整个过程的自然划分。通常根据时间顺序或空间特征来划分阶段，以便按阶段的次序解优化问题。阶段变量一般用 k=1,2,..,n 表示。在例 1 中由 A 出发为 k=1，由 B<sub>i</sub>(i=1,2) 出发为 k=2，依此下去从 D<sub>i</sub>(i=1,2,3) 出发为 k=4，共 n=4 个阶段。在例 2 中按照第一、二、三、四季度分为 k=1,2,3,4，共 4 个阶段。</li>
              <li><strong>状态</strong>（state）：表示每个阶段开始时过程所处的自然状况。它应该能够描述过程的特征并且具有无后向性，即当某阶段的状态给定时，这个阶段以后过程的演变与该阶段以前各阶段的状态无关，即每个状态都是过去历史的一个完整总结。通常还要求状态是直接或间接可以观测的。描述状态的变量称状态变量（state variable），变量允许取值的范围称允许状态集合（set of admissible states）。用 x<sub>k</sub> 表示第 k 阶段的状态变量，它可以是一个数或一个向量，用 X<sub>k</sub> 表示第 k 阶段的允许状态集合。在例 1 中 x₂ 可取 B1，B2，X₂={B1,B2}。n 个阶段的决策过程有 n+1 个状态变量，x<sub>n+1</sub> 表示 x<sub>n</sub> 演变的结果，在例 1 中 x₅ 取 E。根据过程演变的具体情况，状态变量可以是离散的或连续的：为了计算的方便有时将连续变量离散化；为了分析的方便有时又将离散变量视为连续的。状态变量简称为状态。</li>
              <li><strong>决策</strong>（decision）：当一个阶段的状态确定后，可以作出各种选择从而演变到下一阶段的某个状态，这种选择手段称为决策，在最优控制问题中也称为控制（control）。描述决策的变量称决策变量（decision variable），变量允许取值的范围称允许决策集合（set of admissible decisions）。用 u<sub>k</sub>(x<sub>k</sub>) 表示第 k 阶段处于状态 x<sub>k</sub> 时的决策变量，它是 x<sub>k</sub> 的函数，用 U<sub>k</sub>(x<sub>k</sub>) 表示 x<sub>k</sub> 的允许决策集合。在例 1 中 u₂(B1) 可取 C1,C2,C3。决策变量简称决策。</li>
              <li><strong>策略</strong>（policy）：决策组成的序列称为策略。由初始状态 x₁ 开始的全过程的策略记作 p<sub>1n</sub>(x₁)，即 <span class="m">p_1n(x₁)={u₁(x₁),u₂(x₂),…,u_n(x_n)}</span>。由第 k 阶段的状态 x<sub>k</sub> 开始到终止状态的后部子过程的策略记作 p<sub>kn</sub>(x<sub>k</sub>)；由第 k 到第 j 阶段的子过程的策略记作 p<sub>kj</sub>(x<sub>k</sub>)。对于每一个阶段 k 的某一给定的状态 x<sub>k</sub>，可供选择的策略 p<sub>kj</sub>(x<sub>k</sub>) 有一定的范围，称为允许策略集合（set of admissible policies），用 P<sub>1n</sub>(x₁)、P<sub>kn</sub>(x<sub>k</sub>)、P<sub>kj</sub>(x<sub>k</sub>) 表示。</li>
              <li><strong>状态转移方程</strong>：在确定性过程中，一旦某阶段的状态和决策为已知，下阶段的状态便完全确定。用状态转移方程（equation of state）表示这种演变规律，写作 x<sub>k+1</sub>=T<sub>k</sub>(x<sub>k</sub>,u<sub>k</sub>)。在例 1 中状态转移方程为：<span class="m">x<sub>k+1</sub>=u<sub>k</sub>(x<sub>k</sub>)</span>。</li>
              <li><strong>指标函数和最优值函数</strong>：指标函数（objective function）是衡量过程优劣的数量指标，它是关于策略的数量函数，从阶段 k 到阶段 n 的指标函数用 <span class="m">V_kn(x_k, p_kn(x_k))</span> 表示，k=1,2,…,n。能够用动态规划解决的问题的指标函数应具有<strong>可分离性</strong>，即 V<sub>kn</sub> 可表为 x<sub>k</sub>, u<sub>k</sub>, V<sub>k+1 n</sub> 的函数，其中该函数是一个关于变量 V<sub>k+1 n</sub> 单调递增的函数——这一性质保证了最优化原理（principle of optimality）的成立，是动态规划的适用前提。过程在第 j 阶段的阶段指标取决于状态 x<sub>j</sub> 和决策 u<sub>j</sub>，用 v<sub>j</sub>(x<sub>j</sub>,u<sub>j</sub>) 表示。阶段 k 到阶段 n 的指标由 v<sub>j</sub>(j=k,k+1,..n) 组成，常见的形式有：
                <ul>
                  <li>阶段指标之和，即 <span class="m">V_kn = Σ v_j(x_j, u_j)</span>（j 从 k 到 n）；</li>
                  <li>阶段指标之积，即 <span class="m">V_kn = Π v_j(x_j, u_j)</span>；</li>
                  <li>阶段指标之极大（或极小），即 <span class="m">V_kn = max / min … v_j(x_j, u_j)</span>。</li>
                </ul>
                在例 1 中指标函数为「阶段指标之和」的形式，其中 v<sub>j</sub>(x<sub>j</sub>,u<sub>j</sub>) 是边 ⟨x<sub>j</sub>, u<sub>j</sub>(x<sub>j</sub>)⟩ 的权（边的长度），u<sub>j</sub>(x<sub>j</sub>) 表示从 x<sub>j</sub> 出发根据决策 u<sub>j</sub>(x<sub>j</sub>) 下一步所到达的节点。根据状态转移方程，指标函数 V<sub>kn</sub> 还可以表示为状态 x<sub>k</sub> 和策略 p<sub>kn</sub> 的函数，即 V<sub>kn</sub>(x<sub>k</sub>,p<sub>kn</sub>)。在 x<sub>k</sub> 给定时指标函数 V<sub>kn</sub> 对 p<sub>kn</sub> 的最优值称为最优值函数（optimal value function），记作 f<sub>k</sub>(x<sub>k</sub>)：对于某个阶段 k 的某个状态 x<sub>k</sub>，从该阶段 k 到最终目标阶段 n 的最优指标函数值等于从 x<sub>k</sub> 出发取遍所有策略 p<sub>kn</sub> 所得到的最优指标值中最优的一个（opt 可根据具体情况取 max 或 min）。</li>
              <li><strong>最优策略和最优轨线</strong>：使指标函数 V<sub>kn</sub> 达到最优值的策略是从 k 开始的后部子过程的最优策略，记作 <span class="m">p<sub>kn</sub>*={u<sub>k</sub>*,..u<sub>n</sub>*}</span>；p<sub>1n</sub>* 又是全过程的最优策略，简称最优策略（optimal policy）。从初始状态 x₁(=x₁*) 出发，过程按照 p<sub>1n</sub>* 和状态转移方程演变所经历的状态序列 <span class="m">{x₁*,x₂*,..,x<sub>n+1</sub>*}</span> 称最优轨线（optimal trajectory）。</li>
            </ol>
          `,
        },
      ],
    },
    {
      id: 'sec-theorem',
      heading: '四、动态规划的基本定理和基本方程',
      blocks: [
        {
          type: 'html',
          html: `
            <p>动态规划发展的早期阶段，从简单逻辑出发给出了所谓最优性原理，然后在最优策略存在的前提下导出基本方程，再由这个方程求解最优策略。后来在动态规划的应用过程中发现，最优性原理不是对任何决策过程普遍成立，它与基本方程不是无条件等价，二者之间也不存在任何确定的蕴含关系。基本方程在动态规划中起着更为本质的作用。</p>
            <div class="callout key">
              <p class="callout-h">基本定理</p>
              <p>对于初始状态 x₁∈X₁，策略 <span class="m">p_1n*={u₁*,..u_n*}</span> 是最优策略的充要条件是：对于任意的 k（1&lt;k≤n），有 <span class="m">V_kn(x_k*, p_kn*)</span> 达到最优值——即后部子策略对由前面决策所形成的状态而言仍是最优的。</p>
            </div>
            <p><strong>推论</strong>：若 p<sub>1n</sub>*∈P<sub>1n</sub>(x₁) 是最优策略，则对于任意的 k（1&lt;k&lt;n），它的子策略 p<sub>kn</sub>* 对于由 x₁ 和 p<sub>1,k−1</sub>* 确定的以 x<sub>k</sub>* 为起点的第 k 到 n 后部子过程而言，也是最优策略。</p>
            <p>上述推论称为<strong>最优化原理</strong>，它给出了最优策略的必要条件，通常略述为：不论过去的状态和决策如何，对于前面的决策形成的当前的状态而言，余下的各个决策必定构成最优策略。</p>
            <p>根据基本定理的推论可以得到<strong>动态规划的基本方程</strong>：</p>
            <div class="formula"><p>f<sub>k</sub>(x<sub>k</sub>) = opt{ v<sub>k</sub>(x<sub>k</sub>,u<sub>k</sub>) ⊕ f<sub>k+1</sub>(x<sub>k+1</sub>) : u<sub>k</sub> ∈ U<sub>k</sub>(x<sub>k</sub>) }，　x<sub>k+1</sub> = T<sub>k</sub>(x<sub>k</sub>,u<sub>k</sub>)</p></div>
            <p>其中 f<sub>n+1</sub>(x<sub>n+1</sub>) 是决策过程的终端条件，⊕ 为已知函数。当 x<sub>n+1</sub> 只取固定的状态时称固定终端；当 x<sub>n+1</sub> 可在终端集合 X<sub>n+1</sub> 中变动时称自由终端。最终要求的最优指标函数满足：</p>
            <div class="formula"><p>opt{ f_1(x₁) : x₁ ∈ X₁ }　　(10)</p></div>
            <p>(9) 式是一个递归公式，如果目标状态确定，当然可以直接利用该公式递归求出最优值（这种递归方法将在后文介绍，称作备忘录法），但是一般在实际应用中我们通常将该递归公式改为递推公式求解，这样一般效率会更高一些。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-cond',
      heading: '五、动态规划的适用条件',
      blocks: [
        {
          type: 'html',
          html: `
            <p>任何思想方法都有一定的局限性，超出了特定条件，它就失去了作用。同样，动态规划也并不是万能的。适用动态规划的问题必须满足最优化原理和无后效性。</p>
            <h3 id="sec-cond-h1">5.1 最优化原理（最优子结构性质）</h3>
            <p>最优化原理可这样阐述：一个最优化策略具有这样的性质，不论过去状态和决策如何，对前面的决策所形成的状态而言，余下的诸决策必须构成最优策略。简而言之，一个最优化策略的子策略总是最优的。一个问题满足最优化原理又称其具有最优子结构性质。</p>
            <p>例如图 2 中，若路线 I 和 J 是 A 到 C 的最优路径，则根据最优化原理，路线 J 必是从 B 到 C 的最优路线。这可用反证法证明：假设有另一路径 J′ 是 B 到 C 的最优路径，则 A 到 C 的路线取 I 和 J′ 比 I 和 J 更优，矛盾。从而证明 J′ 必是 B 到 C 的最优路径。</p>
            <svg class="fig" viewBox="0 0 480 160" role="img" aria-label="图 2：最优化原理示意，J 必是 B 到 C 的最优路径">
              <rect x="0" y="0" width="480" height="160" fill="var(--c-panel)"/>
              <g font-size="13" fill="var(--c-ink)">
                <circle cx="60" cy="80" r="15" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <text x="60" y="85" text-anchor="middle">A</text>
                <circle cx="230" cy="80" r="15" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <text x="230" y="85" text-anchor="middle">B</text>
                <circle cx="410" cy="80" r="15" fill="var(--c-tip-bg)" stroke="var(--c-ok)"/>
                <text x="410" y="85" text-anchor="middle">C</text>
                <path d="M75 72 C130 30 180 45 216 70" stroke="var(--c-line)" stroke-width="1.6" fill="none"/>
                <text x="140" y="40" text-anchor="middle" fill="var(--c-ink-soft)">路线 I 的前段</text>
                <path d="M75 90 C130 125 180 112 216 88" stroke="var(--c-line)" stroke-width="1.6" fill="none"/>
                <text x="140" y="136" text-anchor="middle" fill="var(--c-ink-soft)">路线 I′ 的前段</text>
                <path d="M246 72 C310 40 360 55 396 72" stroke="var(--c-ok)" stroke-width="2" fill="none"/>
                <text x="325" y="44" text-anchor="middle" fill="var(--c-ok)">路线 J</text>
                <path d="M246 88 C310 122 360 108 396 90" stroke="var(--c-hot)" stroke-width="2" fill="none" stroke-dasharray="5 4"/>
                <text x="325" y="136" text-anchor="middle" fill="var(--c-hot)">J′ 更优 → 矛盾</text>
              </g>
            </svg>
            <p>最优化原理是动态规划的基础，任何问题，如果失去了最优化原理的支持，就不可能用动态规划方法计算。动态规划的最优化原理在其指标函数的可分离性和单调性中得到体现。根据最优化原理导出的动态规划基本方程是解决一切动态规划问题的基本方法。可以看出，例 1 是满足最优化原理的。</p>
            <h3 id="sec-cond-h2">5.2 无后向性</h3>
            <p>将各阶段按照一定的次序排列好之后，对于某个给定的阶段状态，它以前各阶段的状态无法直接影响它未来的决策，而只能通过当前的这个状态。换句话说，每个状态都是过去历史的一个完整总结。这就是无后向性，又称为无后效性。如果用前面的记号来描述无后向性，就是：对于确定的 x<sub>k</sub>，无论 p<sub>1,k−1</sub> 如何，最优子策略 p<sub>kn</sub>* 是唯一确定的，这种性质称为无后向性。</p>
            <p><strong>[例 3] Bitonic 旅行路线问题</strong>：欧几里德货郎担问题是对平面给定的 n 个点确定一条连结各点的、闭合的最短游历路线问题。图 3(a) 给出了七个点问题的解。Bitonic 旅行路线问题是欧几里德货郎担问题的简化，这种旅行路线先从最左边开始，严格地由左至右到最右边的点，然后再严格地由右至左到出发点，求路程最短的路径长度。图 3(b) 给出了七个点问题的解。</p>
            <p>这两个问题看起来很相似，但实质上是不同的。为了方便讨论，我们将每个顶点标记了号码。由于必然经过最右边的顶点 7，所以一条路 (P1-P2) 可以看成两条路（P1-7）与 (P2-7) 的结合。所以，这个问题的状态可以用两条道路结合的形式表示。我们可以把这些状态中，两条路中起始顶点相同的状态归于一个阶段，设为阶段 [P1,P2]。</p>
            <p>那么，对于 Bitonic 旅行路线问题来说，阶段 [P1,P2] 如果可以由阶段 [Q1,Q2] 推出，则必须满足的条件就是：P1&lt;Q1 或 P2&lt;Q2。例如，阶段 [3,4] 中的道路可以由阶段 [3,5] 中的道路加一条边 4-5 得出，而阶段 [3,5] 的状态却无法由阶段 [3,4] 中的状态得出，因为 Bitonic 旅行路线要求必须严格地由左到右来旅行。所以如果我们已经知道了阶段 [3,4] 中的状态，则阶段 [3,5] 中的状态必然已知。因此我们可以说，Bitonic 问题满足无后向性，可以用动态规划来解决。</p>
            <div class="callout tip">
              <p class="callout-h">要点</p>
              <p>有些问题乍一看好像有后向性，但如果按照某种合理的方式重新划分阶段，就可以发现其本质上是无后向性的，所以关键是阶段的合理划分。</p>
            </div>
            <h3 id="sec-cond-h3">5.3 子问题的重叠性</h3>
            <p>在例 1 中我们看到，动态规划将原来具有指数级复杂度的搜索算法改进成了具有多项式时间的算法。其中的关键在于解决冗余，这是动态规划算法的根本目的。动态规划实质上是一种<strong>以空间换时间</strong>的技术，它在实现的过程中，不得不存储产生过程中的各种状态，所以它的空间复杂度要大于其它的算法。以 Bitonic 旅行路线问题为例，这个问题也可以用搜索算法来解决：动态规划的时间复杂度为 <span class="m">O(n²)</span>，搜索算法的时间复杂度为 <span class="m">O(n!)</span>；但从空间复杂度来看，动态规划算法为 <span class="m">O(n²)</span>，而搜索算法为 O(n)，搜索算法反而优于动态规划算法。选择动态规划算法是因为动态规划算法在空间上可以承受，而搜索算法在时间上却无法承受，所以我们舍空间而取时间。</p>
            <p>设原问题的规模为 n，容易看出，当子问题树中的子问题总数是 n 的超多项式函数，而不同的子问题数只是 n 的多项式函数时，动态规划法显得特别有意义，此时动态规划法具有线性时间复杂性。所以，能够用动态规划解决的问题还有一个显著特征：<strong>子问题的重叠性</strong>。这个性质并不是动态规划适用的必要条件，但是如果该性质无法满足，动态规划算法同其他算法相比就不具备优势。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-idea',
      heading: '六、动态规划的基本思想',
      blocks: [
        {
          type: 'html',
          html: `
            <p>前文主要介绍了动态规划的一些理论依据。我们将前文所说的具有明显的阶段划分和状态转移方程的动态规划称为标准动态规划，这种标准动态规划是在研究多阶段决策问题时推导出来的，具有严格的数学形式，适合用于理论上的分析。在实际应用中，许多问题的阶段划分并不明显，这时如果刻意地划分阶段法反而麻烦。一般来说，只要该问题可以划分成规模更小的子问题，并且原问题的最优解中包含了子问题的最优解（即满足最优子化原理），则可以考虑用动态规划解决。</p>
            <p>动态规划的实质是分治思想和解决冗余。因此，动态规划是一种将问题实例分解为更小的、相似的子问题，并存储子问题的解而避免计算重复的子问题，以解决最优化问题的算法策略。</p>
            <p>由此可知，动态规划法与分治法和贪心法类似，它们都是将问题实例归纳为更小的、相似的子问题，并通过求解子问题产生一个全局最优解。其中贪心法的当前选择可能要依赖已经作出的所有选择，但不依赖于有待于做出的选择和子问题，因此贪心法自顶向下，一步一步地作出贪心选择；而分治法中的各个子问题是独立的（即不包含公共的子子问题），因此一旦递归地求出各子问题的解后，便可自下而上地将子问题的解合并成问题的解。但不足的是：如果当前选择可能要依赖子问题的解时，则难以通过局部的贪心策略达到全局最优解；如果各子问题是不独立的，则分治法要做许多不必要的工作，重复地解公共的子问题。</p>
            <p>解决上述问题的办法是利用动态规划。该方法主要应用于最优化问题，这类问题会有多种可能的解，每个解都有一个值，而动态规划找出其中最优（最大或最小）值的解。若存在若干个取最优值的解的话，它只取其中的一个。在求解过程中，该方法也是通过求解局部子问题的解达到全局最优解，但与分治法和贪心法不同的是，动态规划允许这些子问题不独立（亦即各子问题可包含公共的子子问题），也允许其通过自身子问题的解作出选择。该方法对每一个子问题只解一次，并将结果保存起来，避免每次碰到时都要重复计算。</p>
            <p>因此，动态规划法所针对的问题有一个显著的特征，即它所对应的子问题树中的子问题呈现大量的重复。动态规划法的关键就在于：对于重复出现的子问题，只在第一次遇到时加以求解，并把答案保存起来，让以后再遇到时直接引用，不必重新求解。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-steps',
      heading: '七、动态规划算法的基本步骤',
      blocks: [
        {
          type: 'html',
          html: `
            <p>设计一个标准的动态规划算法，通常可按以下几个步骤进行：</p>
            <ol>
              <li><strong>划分阶段</strong>：按照问题的时间或空间特征，把问题分为若干个阶段。注意这若干个阶段一定要是有序的或者是可排序的（即无后向性），否则问题就无法用动态规划求解。</li>
              <li><strong>选择状态</strong>：将问题发展到各个阶段时所处于的各种客观情况用不同的状态表示出来。当然，状态的选择要满足无后效性。</li>
              <li><strong>确定决策并写出状态转移方程</strong>：之所以把这两步放在一起，是因为决策和状态转移有着天然的联系，状态转移就是根据上一阶段的状态和决策来导出本阶段的状态。所以，如果我们确定了决策，状态转移方程也就写出来了。但事实上，我们常常是反过来做，根据相邻两段的各状态之间的关系来确定决策。</li>
              <li><strong>写出规划方程（包括边界条件）</strong>：动态规划的基本方程是规划方程的通用形式化表达式。一般说来，只要阶段、状态、决策和状态转移确定了，这一步还是比较简单的。</li>
            </ol>
            <p>动态规划的主要难点在于理论上的设计，一旦设计完成，实现部分就会非常简单。根据动态规划的基本方程可以直接递归计算最优值，但是一般将其改为递推计算，实现的大体上的框架如下：</p>
            <pre class="code"><code>标准动态规划的基本框架
 1.  对 f_{n+1}(x_{n+1}) 初始化;        {边界条件}
 2.  for k := n downto 1 do
 3.      for 每一个 x_k ∈ X_k do
 4.          for 每一个 u_k ∈ U_k(x_k) do
              begin
 5.              f_k(x_k) := 一个极值;              {∞ 或 -∞}
 6.              x_{k+1} := T_k(x_k, u_k);          {状态转移方程}
 7.              t := φ(f_{k+1}(x_{k+1}), v_k(x_k, u_k));  {基本方程 (9) 式}
 8.              if t 比 f_k(x_k) 更优 then f_k(x_k) := t;  {计算 f_k(x_k) 的最优值}
              end;
 9.  t := 一个极值;                                 {∞ 或 -∞}
10.  for 每一个 x₁ ∈ X₁ do
11.      if f₁(x₁) 比 t 更优 then t := f₁(x₁);      {按照 (10) 式求出最优指标}
12.  输出 t;</code></pre>
            <p>但是，实际应用当中经常不显式地按照上面步骤设计动态规划，而是按以下几个步骤进行：</p>
            <ol>
              <li>分析最优解的性质，并刻划其结构特征。</li>
              <li>递归地定义最优值。</li>
              <li>以自底向上的方式或自顶向下的记忆化方法（备忘录法）计算出最优值。</li>
              <li>根据计算最优值时得到的信息，构造一个最优解。</li>
            </ol>
            <p>步骤 (1)–(3) 是动态规划算法的基本步骤。在只需要求出最优值的情形，步骤 (4) 可以省略；若需要求出问题的一个最优解，则必须执行步骤 (4)。此时，在步骤 (3) 中计算最优值时，通常需记录更多的信息，以便在步骤 (4) 中，根据所记录的信息，快速地构造出一个最优解。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-cases',
      heading: '八、动态规划的实例分析',
      blocks: [
        {
          type: 'html',
          html: `
            <p>下面我们将通过实例来分析动态规划的设计步骤和具体应用。</p>
            <h3 id="sec-cases-h1">例 1 生产计划问题</h3>
            <p><strong>问题描述</strong>：工厂生产某种产品，每单位（千件）的成本为 1（千元），每次开工的固定成本为 3（千元），工厂每季度的最大生产能力为 6（千件）。经调查，市场对该产品的需求量第一、二、三、四季度分别为 2，3，2，4（千件）。如果工厂在第一、二季度将全年的需求都生产出来，自然可以降低成本（少付固定成本费），但是对于第三、四季度才能上市的产品需付存储费，每季每千件的存储费为 0.5（千元）。还规定年初和年末这种产品均无库存。试制订一个生产计划，即安排每个季度的产量，使一年的总费用（生产成本和存储费）最少。</p>
            <p><strong>参考解答</strong>：这是一个明显的多阶段问题，我们按照计划时间自然划分阶段，状态定义为每阶段开始时的存储量 x<sub>k</sub>，决策为每个阶段的产量 u<sub>k</sub>，记每个阶段的需求量（已知）为 d<sub>k</sub>，则状态转移方程为：</p>
            <div class="formula"><p>x<sub>k+1</sub> = x<sub>k</sub> + u<sub>k</sub> − d<sub>k</sub>，　0 ≤ u<sub>k</sub> ≤ 6，　x<sub>k+1</sub> ≥ 0</p></div>
            <p>设每个阶段开工固定成本费用为 a，生产单位数量产品的成本为 b，每阶段单位数量产品的存储费用为 c，阶段指标为阶段的生产成本费用和存储费用之和，即：</p>
            <div class="formula"><p>v<sub>k</sub>(x<sub>k</sub>, u<sub>k</sub>) = a·δ(u<sub>k</sub>) + b·u<sub>k</sub> + c·x<sub>k</sub>，　δ(u<sub>k</sub>) = 0 当 u<sub>k</sub>=0，否则为 1</p></div>
            <p>指标函数 V<sub>kn</sub> 为 v<sub>k</sub> 之和，最优值函数 f<sub>k</sub>(x<sub>k</sub>) 为从第 k 阶段的状态 x<sub>k</sub> 出发到过程终结的最小费用，满足：</p>
            <div class="formula"><p>f<sub>k</sub>(x<sub>k</sub>) = min{ v<sub>k</sub>(x<sub>k</sub>,u<sub>k</sub>) + f<sub>k+1</sub>(x<sub>k</sub> + u<sub>k</sub> − d<sub>k</sub>) : u<sub>k</sub> ∈ U<sub>k</sub> }</p></div>
            <p>其中允许决策集合 U<sub>k</sub> 由每阶段的最大生产能力决定。设过程终结时允许存储量为 x⁰<sub>n+1</sub>，则终端条件为：</p>
            <div class="formula"><p>f<sub>n+1</sub>(x<sub>n+1</sub>) = 0，　x⁰<sub>n+1</sub> = 0（年末无库存）</p></div>
            <p>将以上各式代入到标准动态规划的框架中，就可以求得最优解。</p>
          `,
        },
        {
          type: 'html',
          html: `
            <h3 id="sec-cases-h2">例 2 Bitonic 旅行路线问题</h3>
            <p><strong>问题描述</strong>：欧几里德货郎担问题是对平面给定的 n 个点确定一条连结各点的、闭合的游历路线问题。图 1(a) 给出了七个点问题的解。Bitonic 旅行路线问题是欧几里德货郎担问题的简化，这种旅行路线先从最左边开始，严格地由左至右到最右边的点，然后再严格地由右至左到出发点，求路程最短的路径长度。图 1(b) 给出了七个点问题的解。请设计一种多项式时间的算法，解决 Bitonic 旅行路线问题。</p>
            <p><strong>参考解答</strong>：首先将 n 个点按 X 坐标递增的顺序排列成一个序列 L=⟨点 1，点 2，…，点 n⟩。显然 L[n] 为最右点，L[1] 为最左点。由于点 1 往返经过二次（出发一次，返回一次），因此点 1 拆成两个点：L[0]=L[1]=点 1。设：</p>
            <ul>
              <li>W<sub>i,j</sub> —— 边 ⟨i,j⟩ 的距离；</li>
              <li>W<sub>i..j</sub> —— j−i 条连续边 ⟨i,i+1⟩,⟨i+1,i+2⟩,…,⟨j−2,j−1⟩,⟨j−1,j⟩ 的距离和。由点 i 至点 j 的连续边组成的路径称为连续路径；</li>
              <li>d[i] —— 从点 i 出发由左至右直到 n 点后再由右至左到达点 i−1 的最短距离。</li>
            </ul>
            <p>d[i] 的递归式如下（J 为使距离最小的断点）：</p>
            <div class="formula"><p>d[i] = min{ W<sub>i..J</sub> + W<sub>i,J+1</sub> + d[J] : i+1 ≤ J ≤ n−1 }，　边界 d[n] = W<sub>n,n−1</sub></p></div>
            <p>我们专门设置了一张记忆表 k[i]（1≤i≤n），记下使得 d[i] 最小的 J 值，显然递归式的边界 k[n]=n。</p>
            <p>由 d[i] 的递归式和记忆表 k[i] 的定义可以看出，在由点 i−1 至点 i 的最短路上，点 i 至 k[i] 的子路径上的点序号是逐一递增的，为由左至右方向上的连续子路径。按照递归定义，若 k[i]≠N 且 k[k[i]+1]≠N，则点 k[k[i]+1]+1 至点 k[k[k[i]+1]+1] 也是由左至右方向上的连续子路径；否则 k[k[i]+1] 至 k[i]+1 为由右至左方向上的连续子路径，该子路径上的点序号是逐一递减的。</p>
            <p>显然要使 d[i] 最小，必须分别使 d[i+1]…d[n−1]、d[n] 最小，d[i] 包含了 d[i+1]…d[n] 最小的子问题，因此该问题具有最优子结构和重叠子问题性质，满足动态规划法适用的条件。为了提高算法效率，我们从 d[n] 出发，运用动态规划方法依次求 d[n−1],d[n−2],…,d[1]，充分利用重叠子问题。最后求得的 d[1] 便是最短游历路线的距离；从点 1 出发，顺着记忆表 k 的指示可以递归输出这条游历路线。</p>
          `,
        },
        {
          type: 'html',
          html: `
            <h3 id="sec-cases-h3">例 3 计算矩阵连乘积</h3>
            <p><strong>问题描述</strong>：在科学计算中经常要计算矩阵的乘积。矩阵 A 和 B 可乘的条件是矩阵 A 的列数等于矩阵 B 的行数。若 A 是一个 p×q 的矩阵，B 是一个 q×r 的矩阵，则其乘积 C=AB 是一个 p×r 的矩阵，其标准计算公式为：</p>
            <div class="formula"><p>C[i][j] = Σ A[i][k] · B[k][j]　（k = 1..q）</p></div>
            <p>由该公式知计算 C=AB 总共需要 pqr 次的数乘。现在的问题是，给定 n 个矩阵 {A₁,A₂,…,A<sub>n</sub>}，其中 A<sub>i</sub> 与 A<sub>i+1</sub> 是可乘的，i=1,2,…,n−1，要求计算出这 n 个矩阵的连乘积 A₁A₂…A<sub>n</sub>。</p>
            <p>由于矩阵乘法满足结合律，故连乘积的计算可以有许多不同的计算次序。这种计算次序可以用加括号的方式来确定。若一个矩阵连乘积的计算次序已完全确定，也就是说该连乘积已完全加括号，则我们可以通过反复调用两个矩阵相乘的标准算法计算出矩阵连乘积。完全加括号的矩阵连乘积可递归地定义为：</p>
            <ol>
              <li>单个矩阵是完全加括号的；</li>
              <li>若矩阵连乘积 A 是完全加括号的，则 A 可表示为两个完全加括号的矩阵连乘积 B 和 C 的乘积并加括号，即 A=(BC)。</li>
            </ol>
            <p>例如，矩阵连乘积 A₁A₂A₃A₄ 可以有以下 5 种不同的完全加括号方式：<code>(A₁(A₂(A₃A₄)))</code>、<code>(A₁((A₂A₃)A₄))</code>、<code>((A₁A₂)(A₃A₄))</code>、<code>((A₁(A₂A₃))A₄)</code>、<code>(((A₁A₂)A₃)A₄)</code>。</p>
            <p>每一种完全加括号方式对应于一种矩阵连乘积的计算次序，而这种计算次序与计算矩阵连乘积的计算量有着密切的关系。为了说明在计算矩阵连乘积时加括号方式对整个计算量的影响，我们来看一个计算 3 个矩阵 {A₁,A₂,A₃} 的连乘积的例子。设这 3 个矩阵的维数分别为 10×100、100×5 和 5×50。若按第一种加括号方式 ((A₁A₂)A₃) 来计算，总共需要 10×100×5 + 10×5×50 = 7500 次的数乘；若按第二种加括号方式 (A₁(A₂A₃)) 来计算，则需要的数乘次数为 100×5×50 + 10×100×50 = 75000。第二种加括号方式的计算量是第一种加括号方式的计算量的 10 倍。由此可见，在计算矩阵连乘积时，加括号方式即计算次序对计算量有很大影响。</p>
            <p>于是，人们自然会提出矩阵连乘积的最优计算次序问题：对于给定的相继 n 个矩阵 {A₁,A₂,…,A<sub>n</sub>}（其中 A<sub>i</sub> 的维数为 p<sub>i−1</sub>×p<sub>i</sub>，i=1,2,…,n），如何确定计算矩阵连乘积 A₁A₂…A<sub>n</sub> 的一个计算次序（完全加括号方式），使得依此次序计算矩阵连乘积需要的数乘次数最少。</p>
            <div class="callout warn">
              <p class="callout-h">说明</p>
              <p>计算两个均为 n×n 的矩阵（即 n 阶方阵）相乘还有一种 Strassen 矩阵乘法，利用分治思想将 2 个 n 阶矩阵乘积所需时间从标准算法的 <span class="m">O(n³)</span> 改进到 <span class="m">O(n<sup>log7</sup>)=O(n<sup>2.81</sup>)</span>。目前计算两个 n 阶方阵相乘最好的计算时间上界是 <span class="m">O(n<sup>2.367</sup>)</span>。但无论如何，所需的乘法次数总随两个矩阵的阶而递增。在这道题中只考虑采用标准公式计算两个矩阵的乘积。</p>
            </div>
            <p><strong>参考解答</strong>：解这个问题的最容易想到的方法是穷举搜索法。也就是列出所有可能的计算次序，并计算出每一种计算次序相应需要的计算量，然后找出最小者。然而，这样做计算量太大。事实上，对于 n 个矩阵的连乘积，设有 P(n) 个不同的计算次序。由于我们可以首先在第 k 个和第 k+1 个矩阵之间将原矩阵序列分为两个矩阵子序列（k=1,2,…,n−1），然后分别对这两个矩阵子序列完全加括号，最后对所得的结果加括号，得到原矩阵序列的一种完全加括号方式。所以关于 P(n)，我们有递推式如下：</p>
            <div class="formula"><p>P(n) = { 1, 当 n=1；Σ P(k)·P(n−k)（k=1..n−1），当 n&gt;1 }</p></div>
            <p>解此递归方程可得，P(n) 实际上是 Catalan 数，即 P(n)=C(n−1)，也就是说，P(n) 随着 n 的增长是指数增长的。因此，穷举搜索法不是一个有效算法。下面我们来考虑用动态规划法解矩阵连乘积的最优计算次序问题，此问题是动态规划的典型应用之一。</p>
            <p><strong>1. 分析最优解的结构</strong>——首先，为方便起见，将矩阵连乘积 A<sub>i</sub>A<sub>i+1</sub>…A<sub>j</sub> 简记为 A<sub>i..j</sub>。我们来看计算 A<sub>1..n</sub> 的一个最优次序。设这个计算次序在矩阵 A<sub>k</sub> 和 A<sub>k+1</sub> 之间将矩阵链断开（1≤k&lt;n），则完全加括号方式为 ((A₁…A<sub>k</sub>)(A<sub>k+1</sub>…A<sub>n</sub>))。照此，我们要先计算 A<sub>1..k</sub> 和 A<sub>k+1..n</sub>，然后，将所得的结果相乘才得到 A<sub>1..n</sub>。显然其总计算量为计算 A<sub>1..k</sub> 的计算量加上计算 A<sub>k+1..n</sub> 的计算量，再加上 A<sub>1..k</sub> 与 A<sub>k+1..n</sub> 相乘的计算量。</p>
            <p>这个问题的一个关键特征是：计算 A<sub>1..n</sub> 的一个最优次序所包含的计算 A<sub>1..k</sub> 的次序也是最优的。事实上，若有一个计算 A<sub>1..k</sub> 的次序需要的计算量更少，则用此次序替换原来计算 A<sub>1..k</sub> 的次序，得到的计算 A<sub>1..n</sub> 的次序需要的计算量将比最优次序所需计算量更少，这是一个矛盾。同理可知，计算 A<sub>1..n</sub> 的一个最优次序所包含的计算矩阵子链 A<sub>k+1..n</sub> 的次序也是最优的。根据该问题的指标函数的特征也可以知道该问题满足最优化原理。另外，该问题显然满足无后向性，因为前面的矩阵链的计算方法和后面的矩阵链的计算方法无关。</p>
            <p><strong>2. 建立递归关系</strong>——设计算 A<sub>i..j</sub>（1≤i≤j≤n）所需的最少数乘次数为 m[i,j]，原问题的最优值为 m[1,n]。当 i=j 时，A<sub>i..j</sub>=A<sub>i</sub> 为单一矩阵，无需计算，因此 m[i,i]=0（i=1,2,…,n）；当 i&lt;j 时，可利用最优子结构性质来计算 m[i,j]。事实上，若计算 A<sub>i..j</sub> 的最优次序在 A<sub>k</sub> 和 A<sub>k+1</sub> 之间断开（i≤k&lt;j），则 <span class="m">m[i,j]=m[i,k]+m[k+1,j]+p<sub>i−1</sub>p<sub>k</sub>p<sub>j</sub></span>。由于在计算时我们并不知道断开点 A 的位置，所以 k 还未定。不过 k 的位置只有 j−i 个可能，即 k∈{i,i+1,…,j−1}，因此 k 是这 j−i 个位置中计算量达到最小的那一个位置。从而 m[i,j] 可以递归地定义为：</p>
            <div class="formula"><p>m[i][j] = { 0, 当 i=j；min{ m[i][k] + m[k+1][j] + p<sub>i−1</sub>·p<sub>k</sub>·p<sub>j</sub> }（i≤k&lt;j），当 i&lt;j }　　(2.1)</p></div>
            <p>m[i,j] 给出了最优值，即计算 A<sub>i..j</sub> 所需的最少数乘次数，同时还确定了计算 A<sub>i..j</sub> 的最优次序中的断开位置 k，也就是说，对于这个 k 有 <span class="m">m[i,j]=m[i,k]+m[k+1,j]+p<sub>i−1</sub>p<sub>k</sub>p<sub>j</sub></span>。若将对应于 m[i,j] 的断开位置 k 记录在 s[i,j] 中，则相应的最优解便可递归地构造出来。</p>
            <p><strong>3. 计算最优值</strong>——根据 m[i,j] 的递归定义 (2.1)，容易写一个递归程序来计算 m[1,n]。稍后我们将看到，简单地递归计算将耗费指数计算时间。然而，我们注意到，在递归计算过程中，不同的子问题个数只有 Θ(n²) 个。事实上，对于 1≤i≤j≤n，不同的有序对 (i,j) 对应于不同的子问题。因此，不同子问题的个数最多只有 <span class="m">n(n+1)/2 = Θ(n²)</span> 个。由此可见，在递归计算时，许多子问题被重复计算多次，这也是该问题可用动态规划算法求解的又一显著特征。</p>
            <p>用动态规划算法解此问题，可依据递归式 (2.1) 以自底向上的方式进行计算，在计算过程中，保存已解决的子问题答案，每个子问题只计算一次，而在后面需要时只要简单查一下，从而避免大量的重复计算，最终得到多项式时间的算法。下面所给出的计算 m[i,j] 动态规划算法中，输入是序列 P={p₀,p₁,…,p<sub>n</sub>}，输出除了最优值 m[i,j] 外，还有使 <span class="m">m[i,j]=m[i,k]+m[k+1,j]+p<sub>i−1</sub>p<sub>k</sub>p<sub>j</sub></span> 达到最优的断开位置 k=s[i,j]（1≤i≤j≤n）：</p>
            <pre class="code"><code>Procedure MATRIX_CHAIN_ORDER(p);   {计算矩阵链连乘的最优断开位置}
var
    i, j, k, q: integer;
begin
    for j := 1 to n do            {矩阵链的长度为 n}
        for i := j downto 1 do
        begin
            if i = j then m[i,j] := 0
            else begin
                m[i,j] := ∞;
                for k := i to j-1 do
                begin
                    q := m[i,k] + m[k+1,j] + p[i-1] * p[k] * p[j];
                    if q &lt; m[i,j] then
                    begin
                        m[i,j] := q;
                        s[i,j] := k;   {s[i,j] 记录计算 A[i..j] 的最优断开位置 k}
                    end;
                end;
            end;
        end;
end;</code></pre>
            <p>该算法按照</p>
            <pre class="code"><code>m[1,1]
m[2,2]   m[1,2]
m[3,3]   m[2,3]   m[1,3]
...      ...      ...
m[n,n]   m[n-1,n] ... ....  ... m[1,n]</code></pre>
            <p>的顺序根据公式 (2.1) 计算 m[i,j]。该算法的计算时间上界为 <span class="m">O(n³)</span>，算法所占用的空间显然为 <span class="m">O(n²)</span>。由此可见，动态规划算法比穷举搜索法要有效得多。</p>
            <p><strong>4. 构造最优解</strong>——算法 MATRIX_CHAIN_ORDER 只是计算出了最优值，并未给出最优解。也就是说，通过 MATRIX_CHAIN_ORDER 的计算，我们只知道计算给定的矩阵连乘积所需的最少数乘次数，还不知道具体应按什么次序来做矩阵乘法才能达到数乘次数最少。</p>
            <p>然而，MATRIX_CHAIN_ORDER 已记录了构造一个最优解所需要的全部信息。事实上，s[i,j] 中的数 k 告诉我们计算矩阵链 A<sub>i..j</sub> 的最佳方式应在矩阵 A<sub>k</sub> 和 A<sub>k+1</sub> 之间断开，即最优的加括号方式应为 (A<sub>1..k</sub>)(A<sub>k+1..n</sub>)。因此，从 s[i,j] 记录的信息可知计算 A<sub>1..n</sub> 的最优加括号方式为 <span class="m">(A<sub>1..s[1,n]</sub>)(A<sub>s[1,n]+1..n</sub>)</span>，而计算 A<sub>1..s[1,n]</sub> 的最优加括号方式为 <span class="m">(A<sub>1..s[1,s[1,n]]</sub>)(A<sub>s[1,s[1,n]]+1..s[1,n]</sub>)</span>。同理可以确定计算 A<sub>s[1,n]+1..n</sub> 的最优加括号方式在 s[s[1,n]+1,n] 处断开。……照此递推下去，最终可以确定 A<sub>s[1,n]+1..n</sub> 的最优完全加括号方式，即构造出问题的一个最优解。</p>
            <p>下面的算法 MATRIX_CHAIN_MULTIPLY(A,s,i,j) 是按 s 指示的加括号方式计算矩阵链 A={A₁,A₂,…,A<sub>n</sub>} 的子链 A<sub>i..j</sub> 的连乘积的算法：</p>
            <pre class="code"><code>Procedure MATRIX_CHAIN_MULTIPLY(A, s, i, j);
begin
    if j &gt; i then
    begin
        X ← MATRIX_CHAIN_MULTIPLY(A, s, i, s[i,j]);
        Y ← MATRIX_CHAIN_MULTIPLY(A, s, s[i,j]+1, j);
        return(MATRIX_MULTIPLY(X, Y));   {计算并返回矩阵 X*Y 的值}
    end
    else return(A_i);
end;</code></pre>
            <p>要计算 A<sub>1..n</sub> 只要调用 MATRIX_CHAIN_MULTIPLY(A,s,1,n) 即可。</p>
            <p>从算法 MATRIX_CHAIN_ORDER 可以看出，该算法的有效性依赖于问题本身所具有的三个重要性质：最优子结构性质、无后向性和子问题重叠性质。一般说来，问题所具有的这三个重要性质是该问题可用动态规划算法求解的基本要素，这对于我们在设计求解具体问题的算法时，是否选择动态规划算法具有指导意义。</p>
          `,
        },
      ],
    },
  ],
};

export default deck;
