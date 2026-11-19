import type { DeckData } from '../types';

/** 第二讲 · 搜索专题 —— 依据《第二讲搜索专题》课件（15 页）与《ICPC 培训讲义》第二章整理 */
const deck: DeckData = {
  id: 'deck2',
  no: '第 2 讲',
  title: '第二讲 · 搜索专题',
  subtitle: '第二讲 · 搜索专题',
  lede: `
    <p>搜索问题，涉及到的知识较为复杂，也是竞赛中的一个难点和热点。搜索类问题对图论的知识要求比较高，因为其中最常用的两个算法：深度优先和广度优先就是解搜索类问题的基础知识。</p>
  `,
  toc: [
    { id: 'sec-warmup', text: '开场问题', level: 2 },
    { id: 'sec-warmup-h1', text: '掷色子', level: 3 },
    { id: 'sec-warmup-h2', text: '三个小孩的年龄有多大', level: 3 },
    { id: 'sec-warmup-h3', text: '街道赛跑', level: 3 },
    { id: 'sec-bfs', text: '2.1 宽度优先搜索', level: 2 },
    { id: 'sec-bfs-h1', text: '基本思路与三色标记', level: 3 },
    { id: 'sec-bfs-h2', text: 'BFS 过程与执行分析', level: 3 },
    { id: 'sec-bfs-h3', text: '最短路径：引理与定理', level: 3 },
    { id: 'sec-bfs-h4', text: '例 1 迷宫 · 例 2 街道赛跑', level: 3 },
    { id: 'sec-mst', text: '2.2 最小生成树的形成和求解', level: 2 },
    { id: 'sec-mst-h1', text: '通用算法与割的概念', level: 3 },
    { id: 'sec-mst-h2', text: '安全边定理与其推论', level: 3 },
    { id: 'sec-mst-h3', text: 'Kruskal 算法', level: 3 },
    { id: 'sec-mst-h4', text: 'Prim 算法', level: 3 },
    { id: 'sec-mst-h5', text: '例 3 村村通 · Swordfish', level: 3 },
    { id: 'sec-dfs', text: '2.3 深度优先搜索', level: 2 },
    { id: 'sec-dfs-h1', text: '概述与时间戳', level: 3 },
    { id: 'sec-dfs-h2', text: 'DFS 过程与运行时间', level: 3 },
    { id: 'sec-dfs-h3', text: '深度优先搜索的性质', level: 3 },
    { id: 'sec-dfs-h4', text: '边的分类', level: 3 },
    { id: 'sec-dfs-h5', text: '后裔节点对 · 例 5 迷宫', level: 3 },
    { id: 'sec-more', text: '2.4 更多的搜索', level: 2 },
    { id: 'sec-more-h1', text: '搜索的进一步扩充', level: 3 },
    { id: 'sec-more-h2', text: '例 6 渡河 · 例 7 Betsy 旅行路线', level: 3 },
    { id: 'sec-more-h3', text: '例 8 Antiprime 数', level: 3 },
    { id: 'sec-more-h4', text: '搜索例题：数字变换', level: 3 },
    { id: 'sec-more-h5', text: '倒油问题', level: 3 },
  ],
  sections: [
    {
      id: 'sec-warmup',
      heading: '开场问题',
      blocks: [
        {
          type: 'html',
          html: `
            <h3 id="sec-warmup-h1">掷色子</h3>
            <p>小王和小刘玩掷色子的游戏，共有两枚色子一起掷出。若两枚色子的点数之和为 8，则小王赢，若点数之和为 9，则小刘赢。试判断他们两人谁胜的可能性大？（output: W 表示小王赢 L 表示小刘赢）（枚举法，最简单的搜索）</p>
            <h3 id="sec-warmup-h2">三个小孩的年龄有多大</h3>
            <p>两个多年未见的朋友在街上偶遇，他们聊了很多事情，后来他们中的一个问道："既然你是数学方面的教授，那你来算算这道题。我的三个儿子都在今天庆祝他们的生日！那么你能算出他们都有多大吗？"</p>
            <p>"好，"数学家回答说，"但是你得跟我讲讲他们的情况。"</p>
            <p>"好的，我给你一些提示"那三个孩子的父亲说"他们三个的年龄之积是 36。"</p>
            <p>"很好，"数学家说"但我还需要更多的提示。"</p>
            <p>"他们三个的年龄之和等于那栋房子的窗户数"这个父亲指着旁边的一栋房子说。数学家考虑了一下说"但是，我还要一点信息来解你的这个难题。"</p>
            <p>"我的大儿子的眼睛是蓝色的。"父亲说。"哦，够了。"数学家说道，并且给出了正确答案。</p>
            <p><strong>解答</strong>：</p>
            <ul>
              <li>三个人的年龄之积是 36：(1) 36,1,1　(2) 18,2,1　(3) 12,3,1　(4) 9,4,1　(5) 9,2,2　(6) 6,6,1　(7) 6,3,2　(8) 4,3,3；</li>
              <li>年龄之和等于那栋房子的窗户数——和：38，21，16，14，13，13，11，10；</li>
              <li>还要一点信息——只剩 (5) 9,2,2　(6) 6,6,1（和都是 13，信息仍不足）；</li>
              <li>大儿子的眼睛是蓝色的——存在大儿子，答案为 (5) 9,2,2。</li>
            </ul>
            <h3 id="sec-warmup-h3">街道赛跑</h3>
            <p>下图给出一个沿街赛跑路线。图中有许多点标以 0, 1, …, N（下图 N=9），0 为起点，N 为终点，箭头表示可以前进的方向，运动员可以选择前进路线。</p>
            <ul>
              <li>任务 A：输出所有必经点；</li>
              <li>任务 B：输出所有分裂点。</li>
            </ul>
            <svg class="fig" viewBox="0 0 480 170" role="img" aria-label="街道赛跑路线示意：0 为起点，9 为终点">
              <rect x="0" y="0" width="480" height="170" fill="var(--c-panel)"/>
              <g stroke="var(--c-line)" stroke-width="1.6" fill="none">
                <path d="M60 130 C100 70 130 60 180 60"/>
                <path d="M60 130 C110 140 150 140 180 120"/>
                <path d="M180 60 C230 45 260 45 300 62"/>
                <path d="M180 120 C230 110 260 100 300 84"/>
                <path d="M300 62 C340 60 370 70 410 90"/>
                <path d="M300 84 C340 100 370 105 410 96"/>
              </g>
              <g font-size="13" fill="var(--c-ink)">
                <circle cx="60" cy="130" r="9" fill="var(--c-key-bg)" stroke="var(--c-accent)"/>
                <text x="60" y="134" text-anchor="middle">0</text>
                <circle cx="180" cy="60" r="9" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <text x="180" y="64" text-anchor="middle">1</text>
                <circle cx="180" cy="120" r="9" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <text x="180" y="124" text-anchor="middle">2</text>
                <circle cx="300" cy="62" r="9" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <text x="300" y="66" text-anchor="middle">6</text>
                <circle cx="300" cy="84" r="9" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <text x="300" y="88" text-anchor="middle">5</text>
                <circle cx="240" cy="112" r="9" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <text x="240" y="116" text-anchor="middle">4</text>
                <circle cx="120" cy="112" r="9" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <text x="120" y="116" text-anchor="middle">3</text>
                <circle cx="410" cy="96" r="9" fill="var(--c-key-bg)" stroke="var(--c-accent)"/>
                <text x="410" y="100" text-anchor="middle">9</text>
                <circle cx="355" cy="78" r="9" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <text x="355" y="82" text-anchor="middle">8</text>
                <circle cx="410" cy="60" r="9" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <text x="410" y="64" text-anchor="middle">7</text>
              </g>
              <text x="240" y="160" text-anchor="middle" font-size="12" fill="var(--c-ink-soft)">0 为起点，N（=9）为终点，箭头表示可以前进的方向</text>
            </svg>
          `,
        },
      ],
    },
    {
      id: 'sec-bfs',
      heading: '2.1 宽度优先搜索',
      blocks: [
        {
          type: 'html',
          html: `
            <h3 id="sec-bfs-h1">基本思路与三色标记</h3>
            <p>宽度优先搜索也叫广度优先搜索，是很多重要的图的算法的原型。基本思路是从源点出发，每一步找到当前点所有可能达到的所有情况（在图中就是相邻的点），逐层扩展，直到得到解为止。Dijkstra 单源最短路径算法和 Prim 最小生成树算法都采用了和宽度优先搜索类似的思想。宽度优先搜索的全部运行时间为 <span class="m">O(V+E)</span>，即运行时间是图的邻接表大小的一个线性函数。</p>
            <p>已知图 <span class="m">G=(V,E)</span> 和一个源顶点 s，宽度优先搜索以一种系统的方式探寻 G 的边，从而「发现」s 所能到达的所有顶点，并计算 s 到所有这些顶点的距离（最少边数），该算法同时能生成一棵根为 s 且包括所有可达顶点的宽度优先树。对从 s 可达的任意顶点 v，宽度优先树中从 s 到 v 的路径对应于图 G 中从 s 到 v 的最短路径。该算法对有向图和无向图同样适用。</p>
            <p>之所以称之为宽度优先算法，是因为算法自始至终一直通过已找到和未找到顶点之间的边界向外扩展：算法首先搜索和 s 距离为 k 的所有顶点，然后再去搜索和 s 距离为 k+1 的其他顶点。</p>
            <p>为了保持搜索的轨迹，宽度优先搜索为每个顶点着色：白色、灰色或黑色。算法开始前所有顶点都是白色，随着搜索的进行，各顶点会逐渐变成灰色，然后成为黑色。在搜索中第一次碰到一顶点时，我们说该顶点被发现，此时该顶点变为非白色顶点。灰色和黑色顶点都已被发现，但宽度优先搜索算法对它们加以区分以保证搜索以宽度优先的方式执行：若 <span class="m">(u,v)∈E</span> 且顶点 u 为黑色，那么顶点 v 要么是灰色，要么是黑色，即所有和黑色顶点邻接的顶点都已被发现。灰色顶点可以与一些白色顶点相邻接，它们代表着已找到和未找到顶点之间的边界。</p>
            <p>在宽度优先搜索过程中建立了一棵宽度优先树，起始时只包含根结点（源顶点 s）。在扫描已发现顶点 u 的邻接表的过程中每发现一个白色顶点 v，该顶点 v 及边 (u,v) 就被添加到树中，我们称结点 u 是结点 v 的先辈或父母结点。因为一个结点至多只能被发现一次，因此它最多只能有一个父母结点。相对根结点来说祖先和后裔关系的定义和通常一样：如果 u 处于树中从根 s 到结点 v 的路径中，那么 u 称为 v 的祖先，v 是 u 的后裔。</p>
          `,
        },
        {
          type: 'html',
          html: `
            <h3 id="sec-bfs-h2">BFS 过程与执行分析</h3>
            <p>下面的宽度优先搜索过程 BFS 假定输入图 <span class="m">G=(V,E)</span> 采用邻接表表示：每个顶点的色彩存储于变量 color[u] 中，结点 u 的父母存于变量 π[u] 中（若 u 没有父母则 π[u]=NIL），源点 s 和顶点 u 之间的距离存于变量 d[u] 中，算法使用一个先进先出队列 Q 来存放灰色结点集合。head[Q] 表示队头元素，Enqueue(Q,v) 表示 v 入队，Dequeue(Q) 表示队头元素出队；Adj[u] 表示图中和 u 相邻的结点集合。</p>
            <pre class="code"><code>procedure BFS(G,S);
begin
 1.  for 每个节点 u∈V[G]-{s} do
      begin
 2.       color[u]←White;
 3.       d[u]←∞;
 4.       π[u]←NIL;
      end;
 5.  color[s]←Gray;
 6.  d[s]←0;
 7.  π[s]←NIL;
 8.  Q←{s}
 9.  while Q≠φ do
      begin
10.       u←head[Q];
11.       for 每个节点 v∈Adj[u] do
12.         if color[v]=White then
             begin
13.              color[v]←Gray;
14.              d[v]←d[u]+1;
15.              π[v]←u;
16.              Enqueue(Q,v);
             end;
17.       Dequeue(Q);
18.       color[u]←Black;
      end;
end;</code></pre>
            <p>过程 BFS 按如下方式执行：第 1-4 行置每个结点为白色，置 d[u] 为无穷大，每个结点的父母置为 NIL；第 5 行置源结点 S 为灰色，即意味着过程开始时源结点已被发现；第 6 行初始化 d[s] 为 0，第 7 行置源结点的父母结点为 NIL，第 8 行初始化队列 Q 使其仅含源结点 s，以后 Q 队列中仅包含灰色结点的集合。</p>
            <p>程序的主循环在第 9-18 行中，只要队列 Q 中还有灰色结点（即那些已被发现但还没有完全搜索其邻接表的结点），循环将一直进行下去。第 10 行确定队列头的灰色结点为 u；第 11-16 行的循环考察 u 的邻接表中的每一个顶点 v，如果 v 是白色结点，那么该结点还没有被发现过，算法通过执行第 13-16 行发现该结点：首先它被置为灰色，距离 d[v] 置为 d[u]+1，而后 u 被记为该结点的父母，最后它被放在队列 Q 的队尾。当结点 u 的邻接表中的所有结点都被检索后，第 17-18 行使 u 弹出队列并置成黑色。</p>
            <p><strong>分析</strong>：在初始化后，再没有任何结点又被置为白色，因此第 12 行的测试保证每个结点至多只能进入队列一次，因而至多只能弹出队列一次。入队和出队操作需要 O(1) 的时间，因此队列操作所占用的全部时间为 O(V)。只有当每个顶点将被弹出队列时才会查找其邻接表，因此每个顶点的邻接表至多被扫描一次，因为所有邻接表长度和为 Θ(E)，所以扫描所有邻接表所花费时间至多为 O(E)。初始化操作的开销为 O(V)。因此过程 BFS 的全部运行时间为 <span class="m">O(V+E)</span>。</p>
            <p><strong>宽度优先树</strong>——过程 BFS 在搜索图的同时建立了一棵宽度优先树。对于图 <span class="m">G=(V,E)</span>，源顶点为 s，其先辈子图 <span class="m">G_π=(V_π,E_π)</span> 满足：</p>
            <div class="formula"><p>V<sub>π</sub> = { v∈V : π[v]≠NIL } ∪ {s}，　E<sub>π</sub> = { (π[v],v)∈E : v∈V<sub>π</sub>-{s} }</p></div>
            <p>如果 V<sub>π</sub> 由从 s 可达的顶点构成，那么先辈子图 G<sub>π</sub> 是一棵宽度优先树，并且对于所有 v∈V<sub>π</sub>，G<sub>π</sub> 中唯一的由 s 到 v 的简单路径也同样是 G 中从 s 到 v 的一条最短路径。由于它互相连通，且 <span class="m">|E_π|=|V_π|−1</span>（由树的性质），所以宽度优先树事实上就是一棵树，E<sub>π</sub> 中的边称为树枝。</p>
            <p>下面的过程将打印出从 s 到 v 的最短路径上的所有结点，假定已经运行完 BFS 并得出了最短路径树：</p>
            <pre class="code"><code>procedure Print_Path(G,s,v);
begin
 1.  if v=s
 2.     then write(s)
 3.     else if π[v]=nil
 4.           then writeln('no path from ',s,' to ',v,'exists.')
             else
               begin
 5.             Print_Path(G,s,π[v]);
 6.             write(v);
               end;
end;</code></pre>
            <p>因为每次递归调用的路径都比前一次调用少一个顶点，所以该过程的运行时间是关于打印路径上顶点数的一个线性函数。</p>
            <div class="callout tip">
              <p class="callout-h">竞赛提示</p>
              <p>宽度搜索的基本思路是从源点出发，每一步找到当前点所有可能达到的所有情况（在图中就是相邻的点），逐层扩展，直到得到解为止。在竞赛题中一般不会直接使用它，而是使用它的推广算法，Dijkstra、Prim 等算法，对它们的掌握是比较重要的。</p>
            </div>
          `,
        },
        {
          type: 'html',
          html: `
            <h3 id="sec-bfs-h3">最短路径：引理与定理</h3>
            <p>定义最短路径长度 <span class="m">δ(s,v)</span> 为从顶点 s 到顶点 v 的路径中具有最少边数的路径所包含的边数，若从 s 到 v 没有通路则为 ∞。</p>
            <p><strong>引理 1</strong>　设 <span class="m">G=(V,E)</span> 是一个有向图或无向图，s∈V 为 G 的任意一个结点，则对任意边 <span class="m">(u,v)∈E</span>，<span class="m">δ(s,v)≤δ(s,u)+1</span>。</p>
            <p>证明：如果从顶点 s 可达顶点 u，则从 s 也可达 v，此时从 s 到 v 的最短路径不可能比从 s 到 u 的最短路径加上边 (u,v) 更长，因此不等式成立；如果从 s 不可达顶点 u，则 δ(s,v)=∞，不等式仍然成立。</p>
            <p><strong>引理 2</strong>　设 <span class="m">G=(V,E)</span> 是一个有向或无向图，并假设算法 BFS 从 G 中一已知源结点 s∈V 开始执行，在执行终止时，对每个顶点 v∈V，变量 d[v] 的值满足：<span class="m">d[v]≥δ(s,v)</span>。</p>
            <p>证明：对一个顶点进入队列 Q 的次数进行归纳。归纳的基础是 BFS 过程第 8 行当结点 s 被放入队列 Q 后的情形，这时归纳假设成立，因为对于任意结点 v∈V−{s}，d[s]=0=δ(s,s) 且 d[v]=∞≥δ(s,v)。然后进行归纳，考虑从顶点 u 开始的搜索中发现一白色顶点 v，按归纳假设 d[u]≥δ(s,u)。从过程第 14 行的赋值语句以及引理 1 可知 <span class="m">d[v]=d[u]+1≥δ(s,u)+1≥δ(s,v)</span>。然后结点 v 被插入队列 Q 中，它不会再次被插入队列，因为它已被置为灰色，而第 13-16 行的 then 子句只对白色结点进行操作，这样 d[v] 的值就不会改变，所以归纳假设成立。</p>
            <p><strong>引理 3</strong>　假设过程 BFS 在图 <span class="m">G=(V,E)</span> 之上的执行过程中，队列 Q 包含如下结点 ⟨v₁,v₂,…,v<sub>r</sub>⟩，其中 v₁ 是队列 Q 的头，v<sub>r</sub> 是队列的尾，则 <span class="m">d[v<sub>i</sub>]≤d[v₁]+1</span> 且 <span class="m">d[v<sub>i</sub>]≤d[v<sub>i+1</sub>]</span>，i=1,2,…,r−1。</p>
            <p>证明：对队列操作的次数进行归纳。初始时，队列仅包含顶点 s，引理自然正确。如果队列的头 v₁ 被弹出队列，新的队头为 v₂（如果此时队列为空，引理无疑成立），所以有 <span class="m">d[v<sub>r</sub>]≤d[v₁]+1≤d[v₂]+1</span>，余下的不等式依然成立。要插入一个结点入队时，在 BFS 的第 16 行，当顶点 v 加入队列成为 v<sub>r+1</sub> 时，队列头 v₁ 实际上就是正在扫描其邻接表的顶点 u，因此有 <span class="m">d[v<sub>r+1</sub>]=d[v]=d[u]+1=d[v₁]+1</span>，同样有 <span class="m">d[v<sub>r</sub>]≤d[v₁]+1=d[u]+1=d[v]=d[v<sub>r+1</sub>]</span>，因此当结点 v 插入队列时引理同样正确。</p>
            <p><strong>定理 1（宽度优先搜索的正确性）</strong>　设 <span class="m">G=(V,E)</span> 是一个有向图或无向图，并假设过程 BFS 从 G 上某顶点 s∈V 开始执行，则在执行过程中，BFS 可以发现源结点 s 可达的每一个结点 v∈V，在运行终止时，对任意 v∈V，<span class="m">d[v]=δ(s,v)</span>。此外，对任意从 s 可达的结点 v≠s，从 s 到 v 的最短路径之一是从 s 到 π[v] 的最短路径再加上边 (π[v],v)。</p>
            <p>证明：先证结点 v 从 s 不可达的情形：由引理 2，d[v]≥δ(s,v)=∞，根据过程第 14 行，顶点 v 不可能有一个有限的 d[v] 值，由归纳可知，不可能有满足下列条件的第一个顶点存在：该顶点的 d 值被过程的第 14 行语句置为有限值，因此仅对有有限 d 值的顶点第 14 行语句才会被执行，所以若 v 是不可达的话，它将不会在搜索中被发现。</p>
            <p>对由 s 可达的顶点，设 V<sub>k</sub> 表示和 s 距离为 k 的顶点集合，即 <span class="m">V_k={v∈V:δ(s,v)=k}</span>，证明过程对 k 进行归纳。归纳假设：对于每一个顶点 v∈V<sub>k</sub>，在 BFS 的执行中只有某一特定时刻满足：结点 v 为灰色；d[v] 被置为 k；如果 v≠s，则对于某个 u∈V<sub>k−1</sub>，π[v] 被置为 u；v 被插入队列 Q 中。归纳初始情形 k=0：V₀={s}，在初始化过程中 s 被置为灰色，d[s] 被置为 0，且 s 被放入队列 Q 中。</p>
            <p>归纳进行：除非到算法终止，队列 Q 不为空，而且一旦某结点 u 被插入队列，d[u] 和 π[u] 都不再改变。根据引理 3 可知如果在算法过程中结点按次序 v₁,v₂,…,v<sub>r</sub> 被插入队列，那么相应的距离序列是单调递增的。考虑任意结点 v∈V<sub>k</sub>（k≥1）：由 δ(s,v)=k 可知从 s 到 v 有一条具有 k 条边的通路，因此必存在某结点 u∈V<sub>k−1</sub> 且 (u,v)∈E。BFS 把每一个灰色结点放入队列中，由第 10 行可知结点 u 最终必然会作为队头出现；当 u 已成为队头时，它的邻接表将被扫描就会发现结点 v。第 13 行置 v 为灰色，第 14 行置 d[v]=d[u]+1=k，第 15 行置 π[v] 为 u，第 16 行把 v 插入队列中。由于 v 是 V<sub>k</sub> 中的任意结点，归纳假设成立。</p>
            <p>如果 v∈V<sub>k</sub>，则可得 π[v]∈V<sub>k−1</sub>，这样就得到了一条从 s 到 v 的最短路径：即为从 s 到 π[v] 的最短路径再通过边 (π[v],v)。</p>
            <p><strong>引理 4</strong>　当过程 BFS 应用于某一有向或无向图 <span class="m">G=(V,E)</span> 时，该过程同时建立的 π 域满足条件：其先辈子图 <span class="m">G_π=(V_π,E_π)</span> 是一棵宽度优先树。</p>
            <p>证明：过程 BFS 的第 15 行语句对 (u,v)∈E 且 δ(s,v)&lt;∞（即 v 从 s 可达）置 π[v]=u，因此 V<sub>π</sub> 是由 V 中从 s 可达的顶点所组成。由于 G<sub>π</sub> 形成一棵树，所以它包含从 s 到 V<sub>π</sub> 中每一结点的唯一路径，由定理 1 进行归纳，我们可知其每条路径都是一条最短路径。</p>
          `,
        },
        {
          type: 'html',
          html: `
            <h3 id="sec-bfs-h4">例 1 迷宫 · 例 2 街道赛跑</h3>
            <p><strong>例 1</strong>：给定一个迷宫的地图，大小为 n×m，0 表示空地，1 表示墙壁（不能走），2 表示起点，3 表示终点，问能否从起点到达终点，若能到达，同时给出起点与终点的最短距离。</p>
            <p>解法要点：以起点为源点做宽度优先搜索，逐层扩展四邻方向的空地；第一次到达终点时的层数即最短距离；若搜索结束仍未到达终点则不可达。（例 5 有一同款迷宫的深度优先搜索版本，见下文对照。）</p>
            <p><strong>例 2 街道赛跑</strong>：沿街赛跑路线图中许多点标以 0, 1, …, N，0 为起点，N 为终点，箭头表示可以前进的方向，运动员可以选择前进路线。</p>
            <ul>
              <li>任务 A：输出所有必经点；</li>
              <li>任务 B：输出所有分裂点。</li>
            </ul>
            <p>解法要点：对图做图搜索后按可达性判断——必经点是删除后使终点不可达的点；分裂点是一条路径分岔为多条路径的点。可结合宽度/深度优先搜索逐一验证每个点的性质。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-mst',
      heading: '2.2 最小生成树的形成和求解',
      blocks: [
        {
          type: 'html',
          html: `
            <h3 id="sec-mst-h1">通用算法与割的概念</h3>
            <p>已知一无向连通图 <span class="m">G=(V,E)</span>，其加权函数为 <span class="m">w:E→R</span>，我们希望找到图 G 的最小生成树。Prim 算法和 Kruskal 算法都运用了贪心方法，但在如何运用贪心法上却有所不同。一个通用算法：</p>
            <pre class="code"><code>GENERNIC-MIT(G,W)
 1.  A←∅
 2.  while A 没有形成一棵生成树
 3.      do 找出 A 的一条安全边 (u,v);
 4.         A←A∪{(u,v)};
 5.  return A</code></pre>
            <p>算法设置了集合 A，该集合一直是某最小生成树的子集。在每步决定是否把边 (u,v) 添加到集合 A 中，其添加条件是 <span class="m">A∪{(u,v)}</span> 仍然是最小生成树的子集。我们称这样的边为 A 的<strong>安全边</strong>，因为可以安全地把它添加到 A 中而不会破坏上述条件。算法最棘手的部分是第 3 行的寻找安全边。必定存在一生成树，因为在执行第 3 行代码时，根据条件要求存在一生成树 T，使 A⊆T，且若存在边 <span class="m">(u,v)∈T</span> 且 <span class="m">(u,v)∉A</span>，则 (u,v) 是 A 的安全边。</p>
            <p><strong>几个概念</strong>：</p>
            <ul>
              <li><strong>割</strong>：图 <span class="m">G=(V,E)</span> 的割 (S, V−S) 是 V 的一个分划；</li>
              <li>当一条边 <span class="m">(u,v)∈E</span> 的一个端点属于 S 而另一端点属于 V−S，则我们说边 (u,v) <strong>通过</strong>割 (S, V−S)；</li>
              <li>若集合 A 中没有边通过割，则我们说割<strong>不妨害</strong>边的集合 A（安全的）；</li>
              <li>如果某边是通过割的具有最小权值的边，则称该边为通过割的一条<strong>轻边</strong>。要注意在链路的情况下可能有多条轻边。从更一般意义来讲，如果一条边是满足某一性质的所有边中具有最小权值的边，我们就称该边为满足该性质的一条轻边。</li>
            </ul>
            <p>用图直观理解：集合 S 中的结点为黑色结点，V−S 中的那些结点为白色结点，连接白色和黑色结点的那些边为通过该割的边；若边 (d,c) 为通过该割的唯一一条轻边，子集 A 包含阴影覆盖的那些边，则由于 A 中没有边通过割，所以割 (S, V−S) 不妨害 A。</p>
          `,
        },
        {
          type: 'html',
          html: `
            <h3 id="sec-mst-h2">安全边定理与其推论</h3>
            <p><strong>定理 1：安全边的规则</strong>　设图 <span class="m">G(V,E)</span> 是一无向连通图，且在 E 上定义了相应的实数值加权函数 w，设 A 是 E 的一个子集且包含于 G 的某个最小生成树中，割 (S, V−S) 是 G 的不妨害 A 的任意割且边 (u,v) 是穿过割 (S, V−S) 的一条轻边，则边 (u,v) 对集合 A 是安全的。</p>
            <p>证明：设 T 是包含 A 的一棵最小生成树，并假定 T 不包含轻边 (u,v)（因为若包含就完成证明了）。我们将运用「剪贴技术」（cut-and-paste technique）建立另一棵包含 <span class="m">A∪{(u,v)}</span> 的最小生成树 T′，并进而证明 (u,v) 对 A 是一条安全边。S 中的结点为黑色，V−S 中的结点为白色，边 (u,v) 与 T 中从 u 到 v 的通路 P 中的边构成一回路。由于 u 和 v 处于割 (S, V−S) 的相对的边上，因此在 T 中的通路 P 上至少存在一条边也通过割。设 (x,y) 为满足此条件的边。因为割不妨害 A，所以边 (x,y) 不属于 A。又因为 (x,y) 处于 T 中从 u 到 v 的唯一通路上，所以去掉边 (x,y) 就会把 T 分成两个子图，这时加入边 (u,v) 以形成一新的生成树 <span class="m">T′=T−{(x,y)}∪{(u,v)}</span>。</p>
            <p>下一步证明 T′ 是一棵最小生成树：因边 (u,v) 是通过割 (S, V−S) 的一条轻边且边 (x,y) 也通过割，所以有 <span class="m">w(u,v)≤w(x,y)</span>，因此 <span class="m">w(T′)=w(T)−w(x,y)+w(u,v)≤w(T)</span>，但 T 是最小生成树，所以 <span class="m">w(T)=w(T′)</span>，因此 T′ 必定也是最小生成树。由于 A⊆T 且 (x,y)∉A，所以有 <span class="m">A⊆T′</span>，则 <span class="m">A∪{(u,v)}⊆T′</span>。而 T′ 是最小生成树，因而 (u,v) 对 A 是安全的。</p>
            <p>定理 1 使我们可以更好地了解算法 GENERNIC-MIT 在连通图 <span class="m">G=(V,E)</span> 上的执行流程：在算法执行过程中，集合 A 始终是无回路的，否则包含 A 的最小生成树包含一个环，这是不可能的。在算法执行中的任何一时刻，图 <span class="m">G_A=(V,A)</span> 是一森林且 G<sub>A</sub> 的每一连通支均为树，其中某些树可能只包含一个结点（例如在算法开始时，A 为空集，森林中包含 |V| 棵树，每个顶点对应一棵）。此外，对 A 安全的任何边 (u,v) 都连接 G<sub>A</sub> 中不同的连通支，这是由于 <span class="m">A∪{(u,v)}</span> 必定不包含回路。随着最小生成树的 |V|−1 条边相继被确定，GENERNIC-MIT 中第 2-4 行的循环也随之要执行 |V|−1 次；当森林中只包含一棵树时，算法执行终止。</p>
            <p><strong>推论 2（Kruskal 算法原理）</strong>　设 <span class="m">G=(V,E)</span> 是一无向连通图，且在 E 上定义了相应的实数值加权函数 w，设 A 是 E 的子集且包含于 G 的某最小生成树中，C 为森林 <span class="m">G_A=(V,A)</span> 中的连通支（树）。若边 (u,v) 是连接 C 和 G<sub>A</sub> 中其他某连通支的一轻边，则边 (u,v) 对集合 A 是安全的。</p>
            <p>证明：因为割 (C, V−C) 不妨害 A，因此 (u,v) 是该割的一条轻边。</p>
          `,
        },
        {
          type: 'html',
          html: `
            <h3 id="sec-mst-h3">Kruskal 算法</h3>
            <p>Kruskal 算法是直接基于一般最小生成树算法的基础之上的。该算法找出森林中连结任意两棵树的所有边中具有最小权值的边 (u,v) 作为安全边，并把它添加到正在生长的森林中。设 C₁ 和 C₂ 表示边 (u,v) 连结的两棵树，因为 (u,v) 必是连 C₁ 和其他某棵树的一条轻边，所以由推论 2 可知 (u,v) 对 C₁ 是安全边。Kruskal 算法同时也是一种贪心算法，因为算法每一步添加到森林中的边的权值都尽可能小。</p>
            <p>Kruskal 算法的实现类似于计算连通支的算法。它使用了分离集合数据结构以保持数个互相分离的元素集合。每一集合包含当前森林中某个树的结点，操作 FIND-SET(u) 返回包含 u 的集合的一个代表元素，因此我们可以通过 FIND-SET(v) 来确定两结点 u 和 v 是否属于同一棵树，通过操作 UNION 来完成树与树的联结：</p>
            <pre class="code"><code>MST-KRUSKAL(G,w)
 1.  A←Φ
 2.  for 每个结点 v∈V[G]
 3.      do MAKE-SET(v)
 4.  根据权 w 的非递减顺序对 E 的边进行排序
 5.  for 每条边 (u,v)∈E，按权的非递减次序
 6.      do if FIND-SET(u) ≠ FIND-SET(v)
 7.           then A←A∪{(u,v)}
 8.                UNION(u,v)
 9.  return A</code></pre>
            <p>算法按权的大小顺序考察各边：第 1-3 行初始化集合 A 为空集并建立 |V| 棵树，每棵树包含图的一个结点；第 4 行中根据其权值非递减次序对 E 的边进行排序；在第 5-8 行的 for 循环中首先检查对每条边 (u,v) 其端点 u 和 v 是否属于同一棵树——如果是，则把 (u,v) 加入森林就会形成回路，所以这时放弃边 (u,v)；如果不是，则两结点分属不同的树，由第 7 行把边加入集合 A 中，第 8 行对两棵树中的结点进行归并。</p>
            <p>Kruskal 算法在图 <span class="m">G=(V,E)</span> 上的运行时间取决于分离集合这一数据结构如何实现。我们采用按秩结合和通路压缩的启发式方法来实现分离集合森林的结构，从渐近意义上来说，这是目前所知的最快的实现方法。初始化需占用时间 O(V)，第 4 行中对边进行排序需要的运行时间为 <span class="m">O(E logE)</span>；对分离集的森林要进行 O(E) 次操作，总共需要时间为 <span class="m">O(Eα(E,V))</span>，其中 α 函数为 Ackerman 函数的反函数。因为 <span class="m">α(E,V)=O(logE)</span>，所以 Kruskal 算法的全部运行时间为 <span class="m">O(E logE)</span>。</p>
          `,
        },
        {
          type: 'html',
          html: `
            <h3 id="sec-mst-h4">Prim 算法</h3>
            <p>正如 Kruskal 算法一样，Prim 算法也是一般最小生成树算法的特例。Prim 算法的执行非常类似于寻找图的最短通路的 Dijkstra 算法。Prim 算法的特点是集合 A 中的边总是只形成单棵树：树从任意根结点 r 开始形成并逐渐生长直至该树跨越了 V 中的所有结点。在每一步，连接 A 中某结点到 V−A 中某结点的轻边被加入到树中，由推论 2，该规则仅加大对 A 安全的边，因此当算法终止时，A 中的边就成为一棵最小生成树。因为每次添加到树中的边都是使树的权尽可能小的边，因此上述策略也是贪心的。</p>
            <p>有效实现 Prim 算法的关键是设法较容易地选择一条新的边添加到由 A 的边所形成的树中。在下面的伪代码中，算法的输入是连通图 G 和将生成的最小生成树的根 r。在算法执行过程中，不在树中的所有结点都驻留于优先级基于 key 域的队列 Q 中。对每个结点 v，key[v] 是连接 v 到树中结点的边所具有的最小权值；按常规，若不存在这样的边则 key[v]=∞。域 π[v] 说明树中 v 的「父母」。在算法执行中，GENERIC-MST 的集合 A 隐含地满足 <span class="m">A={(v,π[v])|v∈V−{r}−Q}</span>；当算法终止时，优先队列 Q 为空，因此 G 的最小生成树 A 满足 <span class="m">A={(v,π[v])|v∈V−{r}}</span>：</p>
            <pre class="code"><code>MST-PRIM(G,w,r)
 1.  Q←V[G]
 2.  for 每个 u∈Q
 3.      do key[u]←∞
 4.  key[r]←0
 5.  π[r]←NIL
 6.  while Q≠∅
 7.      do u←EXTRACT-MIN(Q)
 8.         for 每个 v∈Adj[u]
 9.             do if v∈Q and w(u,v)&lt;key[v]
10.                    then π[v]←u
11.                         key[v]←w(u,v)</code></pre>
            <p>Prim 算法的工作流程：第 1-4 行初始化优先队列 Q 使其包含所有结点，置每个结点的 key 域为 ∞（除根 r 以外），r 的 key 域被置为 0；第 5 行初始化 π[r] 的值为 NIL，这是由于 r 没有父母。在整个算法中，集合 V−Q 包含正在生长的树中的结点。第 7 行识别出与通过割 (V−Q, Q) 的一条轻边相关联的结点 u∈Q（第一次迭代例外，根据第 4 行这时 u=r）。从集合 Q 中去掉 u 后把它加入到树的结点集合 V−Q 中。第 8-11 行对与 u 邻接且不在树中的每个结点 v 的 key 域和 π 域进行更新，这样的更新保证 <span class="m">key[v]=w(v,π[v])</span> 且 (v,π[v]) 是连接 v 到树中某结点的一条轻边。</p>
            <p>Prim 算法的性能取决于我们如何实现优先队列 Q。若用二叉堆来实现 Q，我们可以使用过程 BUILD-HEAP 来实现第 1-4 行的初始化部分，其运行时间为 O(V)。循环需执行 |V| 次，且由于每次 EXTRACT-MIN 操作需要 <span class="m">O(logV)</span> 的时间，所以对 EXTRACT-MIN 的全部调用所占用的时间为 <span class="m">O(V logV)</span>。第 8-11 行的 for 循环总共要执行 O(E) 次（所有邻接表的长度和为 2|E|）。第 9 行对队列 Q 的成员条件进行测试可以在常数时间内完成（为每个结点空出 1 bit 记录是否在队列中）。第 11 行的赋值语句隐含一个对堆进行的 DECREASE-KEY 操作，该操作在堆上可用 <span class="m">O(logV)</span> 的时间完成。因此，Prim 算法的整个运行时间为 <span class="m">O(VlogV+ElogV)=O(ElogV)</span>。</p>
            <p>通过使用 Fibonacci 堆，Prim 算法的渐近意义上的运行时间可得到改进：在 Fibonacci 堆中，EXTRACT-MIN 操作的平摊时间为 <span class="m">O(logV)</span>，DECREASE-KEY 操作的平摊时间为 O(1)，因此若用 Fibonacci 堆来实现优先队列 Q，Prim 算法的运行时间可以改进为 <span class="m">O(E+VlogV)</span>。</p>
          `,
        },
        {
          type: 'html',
          html: `
            <h3 id="sec-mst-h5">例 3 村村通 · Swordfish</h3>
            <p><strong>例 3</strong>：给定 n 个村子和 m 条道路，村子原本相互之间是没有道路连接的，现需要将村子与村子之间相互链接起来，再给定 m 条道路，表示从 u 到 v 修建一条道路需要 w 的花费，问若要将村子之间相互连接起来，最小花费是多少？（输入数据保证存在可行解）</p>
            <p>解法要点：以村子为顶点、道路为带权边建图，答案即最小生成树的权值和，用 Prim 或 Kruskal 算法求解。</p>
            <p><strong>Swordfish（用 Prim 算法的例子）</strong>——为了连接所有城市，Gabriel 需要建造金钱传送地道，求所需地道总长度的最小值：</p>
            <pre class="code"><code>The input contains several test cases. Each test case begins with a line contains only one
integer N (0 &lt;= N &lt;=100), which indicates the number of cities you have to connect. The
next N lines each contains two real numbers X and Y(-10000 &lt;= X, Y &lt;= 10000), which are
the citie's Cartesian coordinates (to make the problem simple, we can assume that we live
in a flat world). The input is terminated by a case with N=0 and you must not print any
output for this case.

Output
You need to help Gabriel calculate the minimal length of tunnel needed to connect all
these cites. You can safely assume that such a tunnel can be built directly from one city
to another. For each of the input cases, the output shall consist of two lines: the first line
contains "Case #n:", where n is the case number (starting from 1); and the next line
contains "The minimal distance is: d", where d is the minimal distance, rounded to 2
decimal places. Output a blank line between two test cases.

Sample Input          Sample Output
5                     Case #1:
0 0                   The minimal distance is: 2.83
0 1
1 1
1 0
0.5 0.5
0</code></pre>
            <p><strong>参考解答</strong>：用图的方法建模，本题实际上就是求最小生成树的路径和，用 Prim 算法解决。</p>
            <pre class="code"><code>void solve()//用 prim 算法的函数
{
    double legth = 0;      //总权值
    double cost[100];      //记录权值的数组
    int used[100];         //判断点是否访问过
    for (int ix = 0; ix &lt; n; ix++)
    {
        cost[ix] = graph[0][ix];
        used[ix] = 0;
    }
    used[0] = 1;
    for (;;)
    {
        int j = 0, i = 0;
        while (used[j] &amp;&amp; j &lt; n)
            j++;              //找一个没访问的点
        if (j == n) break;    //如果都访问过了，跳出循环
        for (i = 0; i &lt; n; i++)
            if (!used[i] &amp;&amp; cost[i] &lt; cost[j])
                j = i;        //在剩下的点中找到权值最小的点
                              //（权值是指起始点到此点的路径长度）
        legth += cost[j];     //更新总权值
        used[j] = 1;          //将此点置为访问过
        for (i = 0; i &lt; n; i++)
            if (!used[i] &amp;&amp; graph[j][i] &lt; cost[i])
                cost[i] = graph[j][i]; //更新未访问的所有点的权值
    }
    out.setf(ios::fixed);
    out &lt;&lt; setprecision(2) &lt;&lt; legth &lt;&lt; endl;
}</code></pre>
          `,
        },
      ],
    },
    {
      id: 'sec-dfs',
      heading: '2.3 深度优先搜索',
      blocks: [
        {
          type: 'html',
          html: `
            <h3 id="sec-dfs-h1">概述与时间戳</h3>
            <p><strong>另一道题目</strong>（深度优先搜索的典型应用）：一棵具有 n（n≤100000）个节点的树，节点编号 1~n，给定 m（m≤10000）个节点对 (i, j)，输出满足 i 为 j 后裔或者 j 为 i 后裔的节点对总个数。</p>
            <p>正如算法名称，深度优先搜索所遵循的搜索策略是尽可能「深」地搜索图。在深度优先搜索中，对于最新发现的顶点，如果它还有以此为起点而未探测到的边，就沿此边继续深入下去。当结点 v 的所有边都已被探寻过，搜索将回溯到发现结点 v 的那条边的始结点。这一过程一直进行到已发现从源结点可达的所有结点为止。如果还存在未被发现的结点，则选择其中一个作为源结点并重复以上过程，整个进程反复进行直到所有结点都被发现为止。</p>
            <p>和宽度优先搜索类似，每当扫描已发现结点 u 的邻接表从而发现新结点 v 时，深度优先搜索将置 v 的先辈域 π[v] 为 u。和宽度优先搜索不同的是，前者的先辈子图形成一棵树，而后者产生的先辈子图可以由几棵树组成，因为搜索可能由多个源顶点开始重复进行。因此深度优先搜索的先辈子图的定义也和宽度优先搜索稍有不同：</p>
            <div class="formula"><p>G<sub>π</sub> = (V, E<sub>π</sub>)，　E<sub>π</sub> = { (π[v],v)∈E : v∈V ∧ π[v]≠NIL }</p></div>
            <p>深度优先搜索的先辈子图形成一个由数个深度优先树组成的深度优先森林，E<sub>π</sub> 中的边称为树枝。和宽度优先搜索类似，深度优先在搜索过程中也为结点着色以表示结点的状态：每个顶点开始均为白色，搜索中被发现时置为灰色，结束时又被置成黑色（即当其邻接表被完全检索之后）。这一技巧可以保证每一顶点搜索结束时只存在于一棵深度优先树上，因此这些树都是分离的。</p>
            <p>除了创建一个深度优先森林外，深度优先搜索同时为每个结点加盖时间戳。每个结点 v 有两个时间戳：当结点 v 第一次被发现（并置成灰色）时记录下第一个时间戳 d[v]，当结束检查 v 的邻接表时（并置 v 为黑色）记录下第二个时间戳 f[v]。许多图的算法中都用到时间戳，它们对推算深度优先搜索进行情况是很有帮助的。时间戳为 1 到 2|V| 之间的整数，因为对每一个 v 中结点都对应一个发现事件和一个完成事件，对每一顶点 u，有：</p>
            <div class="formula"><p>d[u] &lt; f[u]　　(1)</p></div>
            <p>在时刻 d[u] 前结点 u 为白色，在时刻 d[u] 和 f[u] 之间为灰色，以后就变为黑色。</p>
          `,
        },
        {
          type: 'html',
          html: `
            <h3 id="sec-dfs-h2">DFS 过程与运行时间</h3>
            <p>下面的伪代码就是一个基本的深度优先搜索算法，输入图 G 可以是有向图或无向图，变量 time 是一个全局变量，用于记录时间戳：</p>
            <pre class="code"><code>procedure DFS(G);
begin
 1   for 每个顶点 u∈V[G] do
      begin
 2        color[u]←White;
 3        π[u]←NIL;
      end;
 4   time←0;
 5   for 每个顶点 u∈V[G] do
 6     if color[u]=White
 7         then DFS_Visit(G,u);
end;

procedure DFS_Visit(G,u);
begin
 1   color[u]←Gray;              △ 白色结点 u 已被发现
 2   d[u]←time←time+1;
 3   for 每个顶点 v∈Adj[u] do    △ 探寻边 (u,v)
 4      if color[v]=White
          then begin
 5                π[v]←u;
 6                DFS_Visit(G,v);
               end;
 7   color[u]←Black;             △ 完成后置 u 黑色
 8   f[u]←time←time+1;
end;</code></pre>
            <p>过程 DFS 执行如下：第 1-3 行把所有结点置为白色，所有 π 域初始化为 NIL；第 4 行复位全局变量 time；第 5-7 行依次检索 V 中的结点，发现白色结点时，调用 DFS_Visit 去访问该结点。每次通过第 7 行调用 DFS_Visit 时，结点 u 就成为深度优先森林中一棵新树的根。当 DFS 返回时，每个结点 u 都对应于一个发现时刻 d[u] 和一个完成时刻 f[u]。</p>
            <p>每次开始调用 DFS_Visit(u) 时结点 u 为白色，第 1 行置 u 为灰色，第 2 行使全局时间变量增值并存于 d[u] 中，从而记录下发现时刻 d[u]；第 3-6 行检查和 u 相邻接的每个顶点 v，且若 v 为白色结点，则递归访问结点 v；在第 3 行语句中考虑到每一个结点 v∈Adj[u] 时，我们可以说边 (u,v) 被深度优先搜索探寻；最后当以 u 为起点的所有边都被探寻后，第 7-8 行语句置 u 为黑色并记录下完成时间 f[u]。</p>
            <p><strong>运行时间</strong>：DFS 中第 1-2 行和 5-7 行的循环占用时间为 O(V)，这不包括执行调用 DFS_Visit 过程语句所耗费的时间。事实上对每个顶点 v∈V，过程 DFS_Visit 仅被调用一次，因为 DFS_Visit 仅适用于白色结点且过程首先进行的就是置结点为灰色。在 DFS_Visit(v) 执行过程中，第 3-6 行的循环要执行 |Adj[v]| 次，因为 <span class="m">∑|Adj[v]| = Θ(E)</span>，所以执行过程 DFS_Visit 中第 2-5 行语句占用的整个时间应为 Θ(E)。所以 DFS 的运行时间为 <span class="m">Θ(V+E)</span>。</p>
          `,
        },
        {
          type: 'html',
          html: `
            <h3 id="sec-dfs-h3">深度优先搜索的性质</h3>
            <p>深度优先搜索可以获得有关图的结构的大量信息。也许深度优先搜索的最基本的特征是它的先辈子图 G<sub>π</sub> 形成一个由树组成的森林，这是因为深度优先树的结构准确反映了 DFS_Visit 中递归调用的结构的缘故，即 u=π[v] 当且仅当在搜索 u 的邻接表过程中调用了过程 DFS_Visit(v)。</p>
            <p>深度优先搜索的另一重要特性是发现和完成时间具有<strong>括号结构</strong>：如果我们把发现顶点 u 用左括号 "(u" 表示，完成用右括号 "u)" 表示，那么发现与完成的记载在括号被正确套用的前提下就是一个完善的表达式。如果两个区间有重叠，则必有一个区间嵌套于另一个区间内，且对应于较小区间的结点是对应于较大区间的结点的后裔。</p>
            <p><strong>定理 1 括号定理</strong>　在对有向图或无向图 <span class="m">G=(V,E)</span> 的任何深度优先搜索中，对于图中任意两结点 u 和 v，下述三个条件中有且仅有一条成立：</p>
            <ol>
              <li>区间 [d[u], f[u]] 和区间 [d[v], f[v]] 是完全分离的；</li>
              <li>区间 [d[u], f[u]] 完全包含于区间 [d[v], f[v]] 中且在深度优先树中 u 是 v 的后裔；</li>
              <li>区间 [d[v], f[v]] 完全包含于区间 [d[u], f[u]] 中且在深度优先树中 v 是 u 的后裔。</li>
            </ol>
            <p>证明：先讨论 d[u]&lt;d[v] 的情形，根据 d[v] 是否小于 f[u] 又可分为两种情况：第一种情况，若 d[v]&lt;f[u]，这样 v 已被发现时 u 结点依然是灰色，这就说明 v 是 u 的后裔；再者，因为结点 v 比 u 发现得较晚，所以在搜索返回结点 u 并完成之前，所有从 v 出发的边都已被探寻并已完成，所以在这种条件下区间 [d[v], f[v]] 必然完全包含于区间 [d[u], f[u]]。第二种情况，若 f[u]&lt;d[v]，则根据不等式 (1)，区间 [d[u], f[u]] 和区间 [d[v], f[v]] 必然是分离的。对于 d[v]&lt;d[u] 的情形类似可证，只要把上述证明中 u 和 v 对调一下即可。</p>
            <p><strong>推论 1 后裔区间的嵌入</strong>　在有向或无向图 G 的深度优先森林中，结点 v 是结点 u 的后裔当且仅当 <span class="m">d[u]&lt;d[v]&lt;f[v]&lt;f[u]</span>。证明：直接由定理 1 推得。</p>
            <p><strong>定理 2 白色路径定理</strong>　在一个有向或无向图 <span class="m">G=(V,E)</span> 的深度优先森林中，结点 v 是结点 u 的后裔当且仅当在搜索发现 u 的时刻 d[u]，从结点 u 出发经一条仅由白色结点组成的路径可达 v。</p>
            <p>证明：（→）假设 v 是 u 的后裔，w 是深度优先树中 u 和 v 之间的通路上的任意结点，则 w 必然是 u 的后裔，由推论 1 可知 d[u]&lt;d[w]，因此在时刻 d[u]，w 应为白色。（←）设在时刻 d[u]，从 u 到 v 有一条仅由白色结点组成的通路，但在深度优先树中 v 还没有成为 u 的后裔。不失一般性，我们假定该通路上的其他顶点都是 u 的后裔（否则可设 v 是该通路中最接近 u 的结点，且不为 u 的后裔），设 w 为该通路上 v 的祖先，使 w 是 u 的后裔（实际上 w 和 u 可以是同一个结点）。根据推论 1 得 f[w]≤f[u]，因为 v∈Adj[w]，对 DFS_Visit(w) 的调用保证完成 w 之前先完成 v，因此 f[v]&lt;f[w]≤f[u]。因为在时刻 d[u] 结点 v 为白色，所以有 d[u]&lt;d[v]。由推论 1 可知在深度优先树中 v 必然是 u 的后裔。</p>
          `,
        },
        {
          type: 'html',
          html: `
            <h3 id="sec-dfs-h4">边的分类</h3>
            <p>在深度优先搜索中，另一个令人感兴趣的特点就是可以通过搜索对输入图 <span class="m">G=(V,E)</span> 的边进行归类，这种归类可以发现图的很多重要信息。例如一个有向图是无回路的，当且仅当深度优先搜索中没有发现「反向边」。</p>
            <p>根据在图 G 上进行深度优先搜索所产生的深度优先森林 G<sub>π</sub>，我们可以把图的边分为四种类型：</p>
            <ol>
              <li><strong>树枝</strong>：是深度优先森林 G<sub>π</sub> 中的边，如果结点 v 是在探寻边 (u,v) 时第一次被发现，那么边 (u,v) 就是一个树枝；</li>
              <li><strong>反向边</strong>：是深度优先树中连结结点 u 到它的祖先 v 的那些边，环也被认为是反向边；</li>
              <li><strong>正向边</strong>：是指深度优先树中连接顶点 u 到它的后裔的非树枝的边；</li>
              <li><strong>交叉边</strong>：是指所有其他类型的边，它们可以连结同一棵深度优先树中的两个结点（只要一结点不是另一结点的祖先），也可以连结分属两棵深度优先树的结点。</li>
            </ol>
            <p>可以对算法 DFS 进行一些修改，使之遇到边时能对其进行分类。算法的核心思想在于可以根据第一次被探寻的边所到达的结点 v 的颜色来对该边 (u,v) 进行分类（但正向边和交叉边不能用颜色区分出）：</p>
            <ul>
              <li>白色表明它是树枝；</li>
              <li>灰色说明它是反向边；</li>
              <li>黑色说明它是正向边或交叉边：如果 d[u]&lt;d[v]，则边 (u,v) 就是正向边；若 d[u]&gt;d[v]，则 (u,v) 便是交叉边。</li>
            </ul>
            <p>第一种情形由算法即可推知。在第二种情形下，我们可以发现灰色结点总是形成一条对应于活动的 DFS_Visit 调用堆栈的后裔线性链，灰色结点的数目等于最近发现的结点在深度优先森林中的深度加 1，探寻总是从深度最深的灰色结点开始，因此达到另一个灰色结点的边所达到的必是它的祖先。余下的可能就是第三种情形。因此可以得到下面结论：对于某条边 (u,v)，</p>
            <ul>
              <li>当且仅当 <span class="m">d[u]&lt;d[v]&lt;f[v]&lt;f[u]</span> 时，是树枝边或正向边；</li>
              <li>当且仅当 <span class="m">d[v]&lt;d[u]&lt;f[u]&lt;f[v]</span> 时，是反向边；</li>
              <li>当且仅当 <span class="m">d[v]&lt;f[v]&lt;d[u]&lt;f[u]</span> 时，是交叉边。</li>
            </ul>
            <p>该结论的证明略。在无向图中，由于 (u,v) 和 (v,u) 实际上是同一条边，所以对边进行这种归类可能产生歧义。在这种情况下，图的边都被归为归类表中的第一类，对应地，我们将根据算法执行过程中首先遇到的边是 (u,v) 还是 (v,u) 来对其进行归类。</p>
            <p>下面我们来说明在深度优先搜索无向图时不会出现正向边和交叉边。</p>
            <p><strong>定理 3</strong>　在对无向图 G 进行深度优先搜索的过程中，G 的每条边要么是树枝要么是反向边。</p>
            <p>证明：设 (u,v) 为 G 的任意一边，不失一般性，假定 d[u]&lt;d[v]。则因为 v 在 u 的邻接表中，所以我们必定在完成 u 之前就已发现并完成 v。如果边 (u,v) 第一次是按从 u 到 v 的方向被探寻到，那么 (u,v) 必是一树枝。如果 (u,v) 第一次是按从 v 到 u 的方向被探寻到，则由于该边被第一次探寻时 u 依然是灰色结点，所以 (u,v) 是一条反向边。</p>
          `,
        },
        {
          type: 'html',
          html: `
            <h3 id="sec-dfs-h5">后裔节点对 · 例 5 迷宫</h3>
            <p><strong>后裔节点对问题</strong>：一棵具有 n（n≤100000）个节点的树，节点编号 1~n，给定 m（m≤10000）个节点对 (i, j)，输出满足 i 为 j 后裔或者 j 为 i 后裔的节点对总个数。</p>
            <p>解法要点：对树做一次深度优先搜索并加盖时间戳；由推论 1，结点 v 是 u 的后裔当且仅当 <span class="m">d[u]&lt;d[v]&lt;f[v]&lt;f[u]</span>，于是每个节点对 O(1) 判定，总复杂度 <span class="m">O(n+m)</span>。</p>
            <p><strong>例 5</strong>：给定一个迷宫的地图，大小为 n×m，0 表示空地，1 表示墙壁（不能走），2 表示起点，3 表示终点，问能否从起点到达终点。（与例 1 相同的地图，用深度优先搜索求解：只判可达性，不保证最短路。）</p>
            <p>下面是一道利用深度搜索解决的迷宫问题（讲义版）——问题描述：</p>
            <pre class="code"><code>下面是一个迷宫
0  1  2  3  4  5  6
1  1  1  0  0  0  0
2  0  1  1  1  0  0
3  1  1  0  1  0  0
4  0  0  0  1  0  0</code></pre>
            <p>在这个比较简单的迷宫中（用 1 表示可以走的方块，灰度色表示出口），要求找出一条路线可以连接入口和出口。首先确定如何搜索，也就是尝试的原则，现在规定对于每个方块，从它右边开始按顺时针检查它周围的四个方块。则可以得到下列步骤：从 (1,1) 出发，首先找到 (1,2)，位于 (1,2) 的方块是可行的，于是自身的位置前进到 (1,2)，经尝试，位于 (2,2) 的方块可行，在 (2,2) 处尝试，得到下一个可行位置 (2,3)，以此类推。但是这样只能找到一条路，而不能找到所有的情况，所以当搜索遇到非法情况（包括走出迷宫）时要退回上一步尝试别的路线，直到每一步都检查了它下一步可能走的四个方向。</p>
            <p><strong>参考解答</strong>：</p>
            <pre class="code"><code>int maze[4][6] = {  {1, 1, 0, 0, 0, 0},
                    {0, 1, 1, 1, 0, 0},
                    {1, 1, 0, 1, 0, 0},
                    {0, 0, 0, 1, 0, 0}};
vector&lt;pair&lt;int, int&gt; &gt; path;
int dir[4][2] = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
void search(vector&lt;pair&lt;int, int&gt; &gt; tpath, int x, int y)
{
    if (x &lt; 0 || y &lt; 0 || x &gt; 5 || y &gt; 3)  //越界返回
        return;
    if (x == 3 &amp;&amp; y == 3)
    {
        path = tpath;   //如果找到了出口,则记录下路径
        return;
    }
    for (int ix = 0; ix &lt; 4; ix++)   //四个方向搜索
    {
        if (maze[x + dir[ix][0]][y + dir[ix][1]] == 1)
        {
            tpath.push_back(make_pair(x, y));
            search(tpath, x + dir[ix][0], y + dir[ix][1]);
            tpath.pop_back();
        }
    }
}

int main()
{
    vector&lt;pair&lt;int, int&gt; &gt; tpath;
    search(tpath, 0, 0);   //从开始点找起
}</code></pre>
            <p>这是一个常见的用递归实现的深度搜索写法。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-more',
      heading: '2.4 更多的搜索',
      blocks: [
        {
          type: 'html',
          html: `
            <h3 id="sec-more-h1">搜索的进一步扩充</h3>
            <ul>
              <li>递归前预处理；</li>
              <li>减少搜索范围；</li>
              <li>记忆化搜索；</li>
              <li>寻找解析式或贪心策略；</li>
              <li>搜索剪枝、二分搜索、参数搜索……</li>
            </ul>
          `,
        },
        {
          type: 'html',
          html: `
            <h3 id="sec-more-h2">例 6 渡河 · 例 7 Betsy 旅行路线</h3>
            <p><strong>例 6</strong>：一个人带着一只狼一只羊和一捆白菜渡河，一次只能带一件，要求渡河次数尽量少，怎么带？</p>
            <p><strong>例 7</strong>：一个正方形的小镇被分成 N² 个小方格，Betsy 要从左上角的方格到达右下角的方格，并且经过每个方格恰好一次。编程对于给定的 N，计算出 Betsy 能采用的所有旅行路线的数据。</p>
            <ul>
              <li>输入：N（1≤N≤10）</li>
              <li>输出：旅游路线数</li>
            </ul>
            <p><strong>剪枝要点</strong>：除了出发点和目标格子外的每一个中间格子，都必然有「一进一出」的过程，因此必须保证每个尚未经过的格子都与至少两个尚未经过的格子相邻。如果进入某区域后就无法移至区域外的任何一个格子，这个区域成为封闭区域。在一个合法移动方案的任何时刻，都不可能有封闭区域的存在。</p>
          `,
        },
        {
          type: 'html',
          html: `
            <h3 id="sec-more-h3">例 8 Antiprime 数</h3>
            <p><strong>例 8</strong>：如果一个数 m，它的约数的个数大于任何一个比 m 小的自然数的约数个数，那么称这种数为 Antiprime 数。例如 1、2、4、6、12 和 24。</p>
            <ul>
              <li>输入：输入整数 n（1≤n≤2000000000）；</li>
              <li>输出：不大于 n 的最大 Antiprime 数。</li>
            </ul>
            <p><strong>解题思路</strong>——定理：设 <span class="m">m = p₁<sup>t₁</sup> · p₂<sup>t₂</sup> · … · p<sub>k</sub><sup>t<sub>k</sub></sup></span>（其中 p 是第 k 大的素数）是 Antiprime 数，则必有 <span class="m">t₁≥t₂≥……≥t<sub>k</sub>≥0</span>。</p>
          `,
        },
        {
          type: 'html',
          html: `
            <h3 id="sec-more-h4">搜索例题：数字变换</h3>
            <p>给定一个整数 N（0≤N≤100000），变成另一个整数 K（0≤N≤100000），允许的操作是乘以 2，或者加减 1，问最少需要几步才能完成？</p>
            <ul>
              <li>输入说明：仅有 2 个整数 N 和 K；</li>
              <li>输出说明：最少的操作步骤；</li>
              <li>输入样例：5 17；输出样例：4。</li>
            </ul>
            <p>从 5 出发逐层扩展（乘 2、加 1、减 1 三种操作），第 4 层即可到达 17：</p>
            <svg class="fig" viewBox="0 0 560 190" role="img" aria-label="数字变换的逐层扩展：5 到 17 需 4 步">
              <rect x="0" y="0" width="560" height="190" fill="var(--c-panel)"/>
              <g font-size="13" fill="var(--c-ink)">
                <circle cx="280" cy="26" r="14" fill="var(--c-key-bg)" stroke="var(--c-accent)"/>
                <text x="280" y="31" text-anchor="middle">5</text>
                <circle cx="200" cy="66" r="14" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <text x="200" y="71" text-anchor="middle">4</text>
                <circle cx="280" cy="66" r="14" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <text x="280" y="71" text-anchor="middle">6</text>
                <circle cx="360" cy="66" r="14" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <text x="360" y="71" text-anchor="middle">10</text>
                <circle cx="130" cy="106" r="14" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <text x="130" y="111" text-anchor="middle">3</text>
                <circle cx="200" cy="106" r="14" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <text x="200" y="111" text-anchor="middle">8</text>
                <circle cx="255" cy="106" r="14" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <text x="255" y="111" text-anchor="middle">7</text>
                <circle cx="310" cy="106" r="14" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <text x="310" y="111" text-anchor="middle">12</text>
                <circle cx="360" cy="106" r="14" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <text x="360" y="111" text-anchor="middle">9</text>
                <circle cx="410" cy="106" r="14" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <text x="410" y="111" text-anchor="middle">11</text>
                <circle cx="465" cy="106" r="14" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <text x="465" y="111" text-anchor="middle">20</text>
                <circle cx="105" cy="146" r="14" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <text x="105" y="151" text-anchor="middle">2</text>
                <circle cx="165" cy="146" r="14" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <text x="165" y="151" text-anchor="middle">16</text>
                <circle cx="225" cy="146" r="14" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <text x="225" y="151" text-anchor="middle">14</text>
                <circle cx="280" cy="146" r="14" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <text x="280" y="151" text-anchor="middle">13</text>
                <circle cx="335" cy="146" r="14" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <text x="335" y="151" text-anchor="middle">18</text>
                <circle cx="390" cy="146" r="14" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <text x="390" y="151" text-anchor="middle">22</text>
                <circle cx="445" cy="146" r="14" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <text x="445" y="151" text-anchor="middle">19</text>
                <circle cx="190" cy="146" r="14" fill="var(--c-ok)" fill-opacity="0.16" stroke="var(--c-ok)"/>
                <text x="190" y="151" text-anchor="middle">15</text>
                <circle cx="245" cy="146" r="14" fill="var(--c-ok)" fill-opacity="0.16" stroke="var(--c-ok)"/>
                <text x="245" y="151" text-anchor="middle">17</text>
                <text x="510" y="106" text-anchor="middle" fill="var(--c-ink-soft)" font-size="12">第 4 层</text>
              </g>
              <text x="280" y="180" text-anchor="middle" font-size="12" fill="var(--c-ink-soft)">每层 = 上层结点经「乘 2 / 加 1 / 减 1」扩展，5 → 17 最少 4 步</text>
            </svg>
          `,
        },
        {
          type: 'html',
          html: `
            <h3 id="sec-more-h5">倒油问题</h3>
            <p>有 3 个油瓶，容量分别为 10 斤、7 斤和 3 斤。开始时，10 斤的瓶子中装满了油，其余为空，现在通过在这 3 个瓶子中倒来倒去，将 10 斤油分成 2 个 5 斤的。请编程输出一种最快的倒油方案。</p>
            <p>一种倒油方案（步数序列）：</p>
            <pre class="code"><code>10 0 0
 3 7 0
 3 4 3
 6 4 0
 6 1 3
 9 1 0
 9 0 1
 2 7 1
 2 5 3
 5 5 0</code></pre>
            <p><strong>算法分析</strong>：</p>
            <ul>
              <li>首先，用一个三元组 T(x₁₀, x₇, x₃) 来表示一种状态，其中 x₁₀、x₇ 和 x₃ 分别表示 10 斤瓶、7 斤瓶和 3 斤瓶中的油量。</li>
              <li>下面，考虑如何实现状态之间的转移，有如下 6 种倒油的可能性：(1) 10 斤往 7 斤瓶子里倒；(2) 10 斤往 3 斤瓶子里倒；(3) 7 斤往 3 斤瓶子里倒；(4) 7 斤往 10 斤瓶子里倒；(5) 3 斤往 7 斤瓶子里倒；(6) 3 斤往 10 斤瓶子里倒。</li>
              <li>（三）在没有找到解之前，是不知道该怎么倒油的，也就是说从当前状态到后续状态是盲目的，只能穷举。如何穷举、如何保存每一个状态呢？<strong>队列</strong>！</li>
              <li>（四）由于是要输出最快的倒油方案，所以不应该做无谓的倒油操作，也就是说从一个状态采用一种倒油方法得到的状态不能出现过，需要对状态进行判重，如何实现？<strong>穷举</strong>！</li>
              <li>（五）输出具体的倒油步骤，保存各个状态之间的转移方式，以便找到目标状态后倒过来，按照线索输出「解路径」上的所有节点信息。</li>
            </ul>
          `,
        },
      ],
    },
  ],
};

export default deck;
