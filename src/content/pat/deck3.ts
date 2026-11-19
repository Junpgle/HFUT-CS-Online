import type { DeckData } from '../types';

/** 第三讲 · 计算几何 —— 依据《第三讲计算几何》课件（17 页）与《ICPC 培训讲义》第三章整理 */
const deck: DeckData = {
  id: 'deck3',
  no: '第 3 讲',
  title: '第三讲 · 计算几何',
  subtitle: '第三讲 · 计算几何',
  lede: `
    <p>计算几何的两块基石：3.1 线段的性质（方向判断与线段相交），3.2 点集的性质（凸包与配对）。</p>
  `,
  toc: [
    { id: 'sec-intro', text: '引言', level: 2 },
    { id: 'sec-ls', text: '3.1 线段的性质', level: 2 },
    { id: 'sec-ls-h1', text: '地主分田 · 拟解决的两个问题', level: 3 },
    { id: 'sec-ls-h2', text: '解析几何解法及其缺点', level: 3 },
    { id: 'sec-ls-h3', text: '叉积（Cross Product）', level: 3 },
    { id: 'sec-ls-h4', text: '快速排斥试验', level: 3 },
    { id: 'sec-ls-h5', text: '跨立与线段相交总结', level: 3 },
    { id: 'sec-ls-h6', text: '地主分田：输入输出与解题思路', level: 3 },
    { id: 'sec-ls-h7', text: '题目：机器蛇', level: 3 },
    { id: 'sec-ls-h8', text: '其他和线段相关的计算', level: 3 },
    { id: 'sec-ps', text: '3.2 点集的性质', level: 2 },
    { id: 'sec-ps-h1', text: '地主圈地与凸包', level: 3 },
    { id: 'sec-ps-h2', text: '寻找凸包的方法与极角排序', level: 3 },
    { id: 'sec-ps-h3', text: 'Graham 扫描法', level: 3 },
    { id: 'sec-ps-h4', text: "打包法（Jarvis's march）代码实现", level: 3 },
    { id: 'sec-ps-h5', text: '巨人和魔鬼（例 2）', level: 3 },
    { id: 'sec-ps-h6', text: '习题 AREA', level: 3 },
  ],
  sections: [
    {
      id: 'sec-intro',
      heading: '引言',
      blocks: [
        {
          type: 'html',
          html: `
            <p>首先，我们考虑一下哪些问题属于画法几何的范畴。在竞赛中，常常会出现这样一些问题，它们与中学里所学的几何问题有关，问题的解决也需要这方面的知识，但问题最终的解决是可以通过算法语言用计算机描述的，我们把这样一类的题目称为画法几何问题。</p>
            <p>举个简单的例子，请考虑下面的问题：There are n (1&lt;=n &amp;&amp; n&lt;=1000) points on the board. Please find out a certain pair of points which satisfy the following term: The distance between them is the shortest among that of any of other pairs.</p>
            <pre class="code"><code>Input
Input file may consist of several cases. In each case, the input datum will be formatted
as. A number in the first line, represents variable n. Later, followed by n lines give the
coordinates of each point. In each line, the first number is coordinate x and latter is y.
Input file is terminated by a line with a single 0;

Output
Each test case must be preceded by "Case k: ", k is the sequence number, then the colon
is followed a blank line, at last is the coordinates of the two points which satisfy our
request above, the coordinates is separated by space. Maybe more than one pair will be
candidates. you should output all of them, each pair per line.

Sample Input            Sample Output
3                       Case 1:
0 0                     0 1 1 0
1 0
0 1                     Case 2:
4                       0 0 1 1
0 0                     0 1 1 0
0 1
1 0
1 1
0</code></pre>
            <p>这道题，很显然就是我们所说的画法几何的题。它将会用到几何中最简单的两点之间的距离的公式，同时，它又要求我们找出最短的一对点的坐标，这又要求用计算机语言加以描述。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ls',
      heading: '3.1 线段的性质',
      blocks: [
        {
          type: 'html',
          html: `
            <h3 id="sec-ls-h1">地主分田 · 拟解决的两个问题</h3>
            <p><strong>题目：地主分田</strong>——地主有块矩形土地，计划分给几个孩子，他在农场地图上划上一些直线，这些直线总是从矩形边界上的某一点到另一边界上的点，一条直线的终点是下一条直线的起点。不会有三线共点。他划分完后想数一下分出多少块土地，但这个地主老眼昏花，容易数错，因而向你求助。线段个数 L≤1000，请你编程求解。</p>
            <p>线段是几何中除去点后最基本的几何元素，是解决几何问题用到的最常用的几何元素。拟解决的两个问题：</p>
            <ol>
              <li><strong>方向性问题</strong>：给出两个有公共起点的向量 p₀p₁ 和 p₀p₂，判断以 p₀ 为中心，从 p₀p₁ 转到 p₀p₂ 是顺时针方向还是逆时针方向；</li>
              <li><strong>两个线段是否相交</strong>：判断平面的两条线段是否相交。</li>
            </ol>
            <h3 id="sec-ls-h2">解析几何解法及其缺点</h3>
            <p>两点式直线方程：<span class="m">ax + by + c = 0</span>。解方程：</p>
            <ul>
              <li>无解则表示平行；</li>
              <li>无穷多解表示共线；</li>
              <li>唯一解，再判断交点是否在两个线段内部。</li>
            </ul>
            <p><strong>缺点</strong>：浮点误差（用到浮点除法）；计算复杂。</p>
            <p><strong>计算几何解法</strong>——用有向线段讨论方位：一个点在一条有向线段的<strong>左侧</strong>还是<strong>右侧</strong>，两向量的转向是<strong>逆时针</strong>还是<strong>顺时针</strong>：</p>
            <svg class="fig" viewBox="0 0 620 150" role="img" aria-label="有向线段的左右侧与转向：左侧、右侧、逆时针、顺时针">
              <rect x="0" y="0" width="620" height="150" fill="var(--c-panel)"/>
              <g font-size="12.5" fill="var(--c-ink)">
                <text x="90" y="26" text-anchor="middle">左侧</text>
                <path d="M60 110 L120 50" stroke="var(--c-line)" stroke-width="2"/>
                <text x="58" y="126" text-anchor="middle" font-size="11" fill="var(--c-ink-soft)">p₀</text>
                <text x="130" y="46" text-anchor="middle" font-size="11" fill="var(--c-ink-soft)">p₁</text>
                <path d="M60 110 L110 118" stroke="var(--c-line)" stroke-width="2"/>
                <text x="118" y="132" text-anchor="middle" font-size="11" fill="var(--c-ink-soft)">p₂</text>
                <text x="90" y="80" text-anchor="middle" fill="var(--c-accent)">p₂ 在 p₀p₁ 左侧</text>
                <text x="255" y="26" text-anchor="middle">右侧</text>
                <path d="M225 110 L285 50" stroke="var(--c-line)" stroke-width="2"/>
                <text x="223" y="126" text-anchor="middle" font-size="11" fill="var(--c-ink-soft)">p₀</text>
                <text x="295" y="46" text-anchor="middle" font-size="11" fill="var(--c-ink-soft)">p₁</text>
                <path d="M225 110 L275 118" stroke="var(--c-line)" stroke-width="2"/>
                <text x="283" y="132" text-anchor="middle" font-size="11" fill="var(--c-ink-soft)">p₂</text>
                <text x="255" y="80" text-anchor="middle" fill="var(--c-accent)">p₂ 在 p₀p₁ 右侧</text>
                <text x="440" y="26" text-anchor="middle">逆时针 / 顺时针</text>
                <path d="M385 95 A45 45 0 0 1 455 78" stroke="var(--c-ok)" stroke-width="2" fill="none" marker-end="url(#arrow-ok-geo)"/>
                <text x="420" y="115" text-anchor="middle" fill="var(--c-ok)">逆时针（左转）</text>
                <path d="M500 78 A45 45 0 0 1 560 100" stroke="var(--c-hot)" stroke-width="2" fill="none" marker-end="url(#arrow-hot-geo)"/>
                <text x="535" y="130" text-anchor="middle" fill="var(--c-hot)">顺时针（右转）</text>
              </g>
              <defs>
                <marker id="arrow-ok-geo" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--c-ok)"/></marker>
                <marker id="arrow-hot-geo" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--c-hot)"/></marker>
              </defs>
            </svg>
          `,
        },
        {
          type: 'html',
          html: `
            <h3 id="sec-ls-h3">叉积（Cross Product）</h3>
            <p>叉积，简单说来就是向量相乘的向量积。根据向量积的性质，<span class="m">|V₃| = |V₁|·|V₂|·sinα</span>（α 为两向量夹角）。结合矩阵给出叉积的定义式（p₁=(x₁,y₁)，p₂=(x₂,y₂)，公共起点在原点）：</p>
            <div class="formula"><p>p₁ × p₂ = det⎛⎝ x₁ y₁ ; x₂ y₂ ⎞⎠ = x₁y₂ − x₂y₁ = (p₁−p₂) × (p₂−O)</p></div>
            <p>由叉积的定义式，可以看出两个有公共起点的向量的叉积，<strong>如果为正则由 p₁ 转到 p₂ 为逆时针方向，如果为负则为顺时针方向</strong>。特别的如果为零，则两向量共线，我们可以进一步去判断它们是共向的还是反向的。</p>
            <p>叉积和有向面积：叉积的绝对值等于平行四边形的面积，保留正负号即为有向面积，按逆时针为正，反之为负。</p>
            <p>下面是叉积的程序实现：</p>
            <pre class="code"><code>#include &lt;utility&gt;
using namespace std;
typedef pair&lt;double,double&gt; myPoint;
// return 1: clockwise, -1: counterclockwise, 0: on the same line;
int cross_product(myPoint &amp;p1, myPoint &amp;p2)
{
    double cp = p1.first * p2.second - p1.second * p2.first;
    if (cp &gt; 0) return 1;
    if (cp &lt; 0) return -1;
    return 0;
}</code></pre>
            <p><strong>再谈一道叉积的应用的问题</strong>：把叉积的定义再引申一步，我们想求平行四边形的面积。于是有：</p>
            <div class="formula"><p>S<sub>AOB</sub> = |OA|·|OB|·sin∠AOB = |OA × OB| = |x₁y₂ − x₂y₁| = |p₁ × p₂|</p></div>
            <p>问题也就转化为了两个向量叉积的模的形式，由于是求模，不必考虑正负情况。</p>
          `,
        },
        {
          type: 'html',
          html: `
            <h3 id="sec-ls-h4">快速排斥试验</h3>
            <p>以两条线段 P₁P₂（端点 (x₁,y₁)、(x₂,y₂)）与 P₂P₄（端点 (x₃,y₃)、(x₄,y₄)）为对角线分别作矩形，先判断两矩形是否排斥：</p>
            <p>对于第一个线段 P₁：左下角的点为 (min(x₁,x₂), min(y₁,y₂))，右上角的点为 (max(x₁,x₂), max(y₁,y₂))；对于第二个线段 P₂：左下角的点为 (min(x₃,x₄), min(y₃,y₄))，右上角的点为 (max(x₃,x₄), max(y₃,y₄))。</p>
            <p><strong>快速排斥试验条件</strong>：</p>
            <pre class="code"><code>P1 右上角的 x 坐标大于等于 P2 左下角的 x 坐标，并且
P1 左下角的 x 坐标小于等于 P2 右上角的 x 坐标；
(min(x1, x2) &lt;= max(x3, x4)) &amp;&amp; (min(x3, x4) &lt;= max(x1, x2))

P1 右上角的 y 坐标大于等于 P2 左下角的 y 坐标，并且
P1 左下角的 y 坐标小于等于 P2 右上角的 y 坐标；
(min(y1, y2) &lt;= max(y3, y4)) &amp;&amp; (min(y3, y4) &lt;= max(y1, y2))</code></pre>
            <p>若两矩形都不排斥，则两线段才有可能相交；快速排斥试验通过后再做跨立试验。</p>
          `,
        },
        {
          type: 'html',
          html: `
            <h3 id="sec-ls-h5">跨立与线段相交总结</h3>
            <p><strong>跨立</strong>：如果一条线段的一个端点在一条直线的一侧，另一个端点在这条直线的另一侧，我们就说这条线段跨立在这条直线上；如果两条线段互相跨立，它们一定是相交的。线段相交满足且只需满足如下两个条件就可以了：</p>
            <ol>
              <li>两条线段相互跨立；</li>
              <li>一条线段的一个端点在另一条线段上（针对边值情况）。</li>
            </ol>
            <p><strong>说明</strong>：线段向量 P₁P₂ 是跨立在 P₃P₄ 上的——取端点 P₃ 为虚线所示向量的起点，P₁ 和 P₂ 为终点，则向量组 P₃P₁、P₃P₄ 和向量组 P₃P₂、P₃P₄ 的叉积符号是相反的；同样可以判断出 P₃P₄ 是跨立在 P₁P₂ 上的。</p>
            <p>一些说明：特殊情况可以用点积辅助判断，叉积说明左右情况，点积说明前后情况，参见《算法艺术与信息学竞赛》。</p>
            <p><strong>C++ 判断两条线段是否相交的完整函数</strong>：</p>
            <pre class="code"><code>#include &lt;utility&gt;
using namespace std;
typedef pair&lt;double,double&gt; POINT;

// function direction determines the direction that the segment
// p1p turns to p2p with respect to point p
// if return value is positive, means clockwise;
// if return value is negative, means counter-clockwise;
// naught means on the same line;
double direction(POINT p, POINT p1, POINT p2)
{
    POINT v1, v2;
    v1.first  = p2.first  - p.first;
    v1.second = p2.second - p.second;
    v2.first  = p1.first  - p.first;
    v2.second = p1.second - p.second;
    return v1.first * v2.second - v1.second * v2.first;
}

// on_segment determines whether the point p is on the segment p1p2
bool on_segment(POINT p, POINT p1, POINT p2)
{
    double min_x = p1.first  &lt; p2.first  ? p1.first  : p2.first;
    double max_x = p1.first  &gt; p2.first  ? p1.first  : p2.first;
    double min_y = p1.second &lt; p2.second ? p1.second : p2.second;
    double max_y = p1.second &gt; p2.second ? p1.second : p2.second;
    if (p.first &gt;= min_x &amp;&amp; p.first &lt;= max_x
        &amp;&amp; p.second &gt;= min_y &amp;&amp; p.second &lt;= max_y) return true;
    else return false;
}

// function segment_intersect determines whether segment p1p2 and p3p4
// intersect: true yes and false no;
bool segment_intersect(POINT p1, POINT p2, POINT p3, POINT p4)
{
    double d1 = direction(p3, p4, p1);
    double d2 = direction(p3, p4, p2);
    double d3 = direction(p1, p2, p3);
    double d4 = direction(p1, p2, p4);
    if ((d1 &gt; 0 &amp;&amp; d2 &lt; 0 || d1 &lt; 0 &amp;&amp; d2 &gt; 0) &amp;&amp;
        (d3 &gt; 0 &amp;&amp; d4 &lt; 0 || d3 &lt; 0 &amp;&amp; d4 &gt; 0))
        return true;
    else if (d1 == 0 &amp;&amp; on_segment(p1, p3, p4))
        return true;
    else if (d2 == 0 &amp;&amp; on_segment(p2, p3, p4))
        return true;
    else if (d3 == 0 &amp;&amp; on_segment(p3, p1, p2))
        return true;
    else if (d4 == 0 &amp;&amp; on_segment(p4, p1, p2))
        return true;
    else return false;
}</code></pre>
          `,
        },
        {
          type: 'html',
          html: `
            <h3 id="sec-ls-h6">地主分田：输入输出与解题思路</h3>
            <p><strong>题目：地主分田</strong></p>
            <ul>
              <li>输入：第 1 行输入地图的宽度 w 和高度 h（1≤w,h≤1000），第 2 行输入线段 L（1≤L≤1000）。以下 L+1 行每行一个坐标 (Xᵢ,Yᵢ)，庄主画的线段为 (Xᵢ,Yᵢ)(Xᵢ₊₁,Yᵢ₊₁)，i=1,2,…,L。(Xᵢ,Yᵢ) 必定在矩形的边界上。</li>
              <li>输出：一个整数，为划分出的土地块数。</li>
            </ul>
            <p><strong>解题思路</strong>：</p>
            <ul>
              <li>A）增加一条线，则增加一块地；</li>
              <li>B）增加一个点，则增加一块地；</li>
            </ul>
            <p>因而需要求取所有交点个数（不在边界上的），交点判定的依据是<strong>两线跨立成立</strong>。</p>
            <h3 id="sec-ls-h7">题目：机器蛇</h3>
            <p>在未来的某次战争中，我军计划了一次军事行动，目的是劫持敌人的航母。计划中要将数百条机器蛇投放到航母的各个角落里。由于航母内部舱室、管线错综复杂，且大部分由金属构成，因此屏蔽效应十分强烈，况且还要考虑敌人的大强度电子干扰，如何保持机器蛇间的联系，成了一大难题。每条机器蛇的战斗位置由作战计划部门制定，将会及时通知你。每条机器蛇上都带有接收、发射系统，可以同时与多条机器蛇通讯。由于整个系统承载的数据量庞大，需要一个固定的通讯网络。情报部门提供了极其详尽的敌方航母图纸，使你对什么地方有屏蔽了如指掌。请你设计一个程序，根据以上信息构造通讯网络，要求信息可以在任意两条机器蛇间传递，同时为了避免干扰，通讯网络的总长度要尽可能的短。</p>
            <p>【输入】第一行是一个整数 n（n≤200）表示参战的机器蛇总数。以下 n 行，每行两个整数 xᵢ，yᵢ，为第 i 支机器蛇的战斗位置。接下来一行是一个整数 m（m≤100）表示航母内部可能产生屏蔽的位置。最后 m 行，每行四个整数 aᵢ，bᵢ，cᵢ，dᵢ，表示线段 (aᵢ,bᵢ)−(cᵢ,dᵢ) 处可能有屏蔽，也就是说通讯网络不能跨越这条线段。</p>
            <p>【输出】输出数据应仅包括一个实数，表示建立的通讯网的最短长度，保留 3 位小数。如果不能成功建立通讯网，请输出 -1.000。</p>
            <p><strong>解题思路</strong>：题目中要求信息可以在任意两条机器蛇间传递，通信网络的总长度要尽可能的短，显然这是一个求图的最小生成树问题。但问题的关键是构图，因为如果以机器蛇为顶点，以通信线路为边，则每一条边都不能与任一条屏蔽线相交（用上面的线段相交判定逐边检查）。</p>
            <h3 id="sec-ls-h8">其他和线段相关的计算</h3>
            <ul>
              <li>计算两条相交线段的交点；</li>
              <li>判断任意一组线段中是否存在相交的情况；</li>
              <li>计算线段的中垂线方程；</li>
              <li>计算凸多边形的重心位置和面积；</li>
              <li>寻找最近点对；</li>
              <li>……</li>
            </ul>
          `,
        },
      ],
    },
    {
      id: 'sec-ps',
      heading: '3.2 点集的性质',
      blocks: [
        {
          type: 'html',
          html: `
            <h3 id="sec-ps-h1">地主圈地与凸包</h3>
            <p><strong>题目：地主圈地</strong>——地主有一片不规则的树林，经常遭到一些小动物的破坏，于是地主就想给这片树林围一圈篱笆墙以保护他的树林，但这个地主比较吝啬，想用最短的篱笆墙围起这片树林，聪明的你给他计算一下最短的篱笆墙的长度吧。点的个数 n≤10000，请你编程求解。</p>
            <p><strong>凸包</strong>：凸包是一组点集中的子集，这一子集形成的凸多边形可以将点集中所有的点都围住，并且这一凸多边形的面积是最小的。我们用 Q 表示点集，用 CH(Q) 表示点集 Q 的凸包。如图所示，凸包为点 P₁₀、P₃、P₁、P₀ 和 P₁₂，则有 CH(Q)={P₁₀, P₃, P₁, P₀, P₁₂}：</p>
            <svg class="fig" viewBox="0 0 480 190" role="img" aria-label="点集的凸包：外围凸多边形围住所有点">
              <rect x="0" y="0" width="480" height="190" fill="var(--c-panel)"/>
              <polygon points="90,150 110,55 250,30 400,70 420,140" fill="var(--c-key-bg)" stroke="var(--c-accent)" stroke-width="1.6"/>
              <g font-size="12" fill="var(--c-ink)">
                <circle cx="90" cy="150" r="6" fill="var(--c-accent)"/><text x="74" y="168">P₀</text>
                <circle cx="110" cy="55" r="6" fill="var(--c-accent)"/><text x="88" y="44">P₁</text>
                <circle cx="250" cy="30" r="6" fill="var(--c-accent)"/><text x="244" y="20">P₃</text>
                <circle cx="400" cy="70" r="6" fill="var(--c-accent)"/><text x="410" y="62">P₁₀</text>
                <circle cx="420" cy="140" r="6" fill="var(--c-accent)"/><text x="430" y="152">P₁₂</text>
                <circle cx="200" cy="110" r="5.5" fill="var(--c-panel-2)" stroke="var(--c-line)"/><text x="192" y="128">P₄</text>
                <circle cx="290" cy="95" r="5.5" fill="var(--c-panel-2)" stroke="var(--c-line)"/><text x="284" y="113">P₇</text>
                <circle cx="330" cy="130" r="5.5" fill="var(--c-panel-2)" stroke="var(--c-line)"/><text x="324" y="148">P₉</text>
                <circle cx="160" cy="80" r="5.5" fill="var(--c-panel-2)" stroke="var(--c-line)"/><text x="154" y="98">P₂</text>
              </g>
              <text x="240" y="180" text-anchor="middle" font-size="12" fill="var(--c-ink-soft)">CH(Q) = {P₁₀, P₃, P₁, P₀, P₁₂}，内部点不属于凸包</text>
            </svg>
            <h3 id="sec-ps-h2">寻找凸包的方法与极角排序</h3>
            <p>寻找凸包的方法（皮筋法）：</p>
            <ol>
              <li>首先，找出点集中最下方的点，如果这样的点不止一个，就选用最左边的点（如 P₀）。显然，点（P₀）是凸包子集中的一个点；</li>
              <li>设想在 P₀ 处拴了一根皮筋，放在和 P₀ 成水平位置的右侧；</li>
              <li>将皮筋沿逆时针方向转动，首先会碰到 P₁；</li>
              <li>以 P₁ 为中心，做和 P₀ 一样的事，将碰到 P₃；</li>
              <li>一直这样做下去，直到再一次遇到 P₀，凸包就被找出来了。</li>
            </ol>
            <p><strong>极角排序</strong>——找到 P₀ 点之后，以 P₀ 为每个矢量的起点，其它的点为矢量的终点，来比较任意两个矢量的转角，就可以对余下的点进行按极角排序。先看向量 P₀P₁ 和 P₀P₂：由于从 P₀P₁ 转向 P₀P₂ 为逆时针，于是认为点 P₁ 大于点 P₂。对于特殊情况（两点共线），比较的结果应该是更远的点大于更近的点——由函数 direction() 得到的结果将为 0，但此时需要再用 on_segment 判断哪个点更远，以决定先后（边值情况请认真思考）。</p>
          `,
        },
        {
          type: 'html',
          html: `
            <h3 id="sec-ps-h3">Graham 扫描法</h3>
            <p>课件给出 Graham 扫描法（效率提高到 <span class="m">O(nlogn)</span>）：</p>
            <pre class="code"><code>令 p0 为 Q 中 Y-X 坐标排序下最小的点
设 &lt;p1, p2, ..., pm&gt; 为对其余点按以 p0 为中心的极角逆时针排序所得的点集
（如果有多个点有相同的极角，除了距 p0 最远的点外全部移除）

压 p0 进栈 S
压 p1 进栈 S
压 p2 进栈 S
for i ← 3 to m
    do while（由 S 的栈顶元素的下一个元素、S 的栈顶元素
             以及 pi 构成的折线段不拐向左侧）
        对 S 弹栈
    压 pi 进栈 S
return S;</code></pre>
            <p>扫描过程：从 P₀ 出发沿逆时针方向依次处理各点，若栈顶两点与新点构成的折线拐向右侧（非左拐），则弹栈去掉该点；最终栈中保留的点按逆时针顺序构成凸包：</p>
            <svg class="fig" viewBox="0 0 520 160" role="img" aria-label="Graham 扫描：栈中保留左拐点构成凸包">
              <rect x="0" y="0" width="520" height="160" fill="var(--c-panel)"/>
              <g font-size="12" fill="var(--c-ink)">
                <polygon points="60,120 100,45 240,30 400,60 440,115" fill="none" stroke="var(--c-accent)" stroke-width="1.8" stroke-dasharray="5 4"/>
                <circle cx="60" cy="120" r="6" fill="var(--c-accent)"/><text x="44" y="138">P₀</text>
                <circle cx="100" cy="45" r="6" fill="var(--c-accent)"/><text x="78" y="36">P₁</text>
                <circle cx="240" cy="30" r="6" fill="var(--c-accent)"/><text x="234" y="20">P₃</text>
                <circle cx="400" cy="60" r="6" fill="var(--c-accent)"/><text x="408" y="50">P₁₀</text>
                <circle cx="440" cy="115" r="6" fill="var(--c-accent)"/><text x="448" y="132">P₁₂</text>
                <circle cx="180" cy="85" r="5.5" fill="var(--c-panel-2)" stroke="var(--c-line)"/><text x="172" y="103">P₂ 弹栈</text>
                <circle cx="320" cy="95" r="5.5" fill="var(--c-panel-2)" stroke="var(--c-line)"/><text x="312" y="113">P₇ 弹栈</text>
              </g>
              <text x="260" y="150" text-anchor="middle" font-size="12" fill="var(--c-ink-soft)">虚线为最终凸包；非左拐的内部点在扫描中被弹栈</text>
            </svg>
            <h3 id="sec-ps-h4">打包法（Jarvis's march）代码实现</h3>
            <p>讲义介绍一种比较容易理解的寻找凸包的算法，称为打包法（Jarvis's march）。具体算法：首先找出点集中最下方的点（并列时选最左边的点 P₀），它必然是凸包上的点；从 P₀ 出发像转动皮筋一样逐个找到下一个凸包点，直到再一次遇到 P₀。下面是打包法具体的 C++ 代码实现：</p>
            <pre class="code"><code>#include &lt;iostream&gt;
#include &lt;utility&gt;
#include &lt;vector&gt;
#include &lt;algorithm&gt;

using namespace std;
typedef pair&lt;double,double&gt; POINT;

// function direction determines the direction that the segment
// p1p turns to p2p with respect to point p
// if return value is positive, means clockwise;
// if return value is negative, means counter-clockwise;
// naught means on the same line;
double direction(POINT p, POINT p1, POINT p2)
{
    POINT v1, v2;
    v1.first  = p2.first  - p.first;
    v1.second = p2.second - p.second;
    v2.first  = p1.first  - p.first;
    v2.second = p1.second - p.second;
    return v1.first * v2.second - v1.second * v2.first;
}

// function on_segment determines whether the point p is on the segment p1p2
bool on_segment(POINT p, POINT p1, POINT p2)
{
    double min_x = p1.first  &lt; p2.first  ? p1.first  : p2.first;
    double max_x = p1.first  &gt; p2.first  ? p1.first  : p2.first;
    double min_y = p1.second &lt; p2.second ? p1.second : p2.second;
    double max_y = p1.second &gt; p2.second ? p1.second : p2.second;
    if (p.first &gt;= min_x &amp;&amp; p.first &lt;= max_x
        &amp;&amp; p.second &gt;= min_y &amp;&amp; p.second &lt;= max_y) return true;
    else return false;
}

// point startPoint is the polor point that is needed for comparing
// two other points;
POINT startPoint;
// function sortByPolorAngle provides the realizing of comparing two points,
// which support the STL function sort();
bool sortByPolorAngle(const POINT &amp;p1, const POINT &amp;p2)
{
    double d = direction(startPoint, p1, p2);
    if (d &lt; 0) return true;
    if (d &gt; 0) return false;
    if (d == 0 &amp;&amp; on_segment(startPoint, p1, p2)) return true;
    if (d == 0 &amp;&amp; on_segment(p2, startPoint, p1)) return true;
    return false;
}

// here realizes the process of finding convex hull
void find_convex_hull(vector&lt;POINT&gt; &amp;point)
{
    POINT p0 = point[0];
    int k = 0;
    for (int i = 1; i &lt; point.size(); i++)
    {
        if (point[i].second &lt; p0.second ||
            point[i].second == p0.second &amp;&amp; point[i].first &lt; p0.first)
        {
            p0 = point[i];
            k = i;
        }
    }
    point.erase(point.begin() + k);
    point.insert(point.begin(), p0);
    vector&lt;POINT&gt; convex_hull;
    do {
        convex_hull.push_back(point[0]);
        startPoint = point[0];
        point.erase(point.begin());
        sort(point.begin(), point.end(), sortByPolorAngle);
        if (point[0] == convex_hull[0]) break;
        point.push_back(convex_hull[convex_hull.size() - 1]);
    } while (1);
    for (int i = 0; i &lt; convex_hull.size(); i++)
    {
        cout &lt;&lt; convex_hull[i].first &lt;&lt; ' '
             &lt;&lt; convex_hull[i].second &lt;&lt; endl;
    }
}</code></pre>
          `,
        },
        {
          type: 'html',
          html: `
            <h3 id="sec-ps-h5">巨人和魔鬼（例 2）</h3>
            <p>n 个巨人正与 n 个鬼进行战斗，每个巨人的武器是一个质子炮，它可以把一串质子流射中鬼而把鬼消灭。质子流沿直线行进，在击中鬼时就终止。巨人决定采取下述策略：他们寻找鬼配对，以形成 n 个巨人—鬼对。然后每个巨人同时向他选取的鬼射出一串质子流。我们知道，让质子流互相交叉是很危险的，因此巨人选择的配对方式应该使质子流都不会交叉。假定每个巨人和每个鬼的位置都是平面上的一个固定点，并且没有三个位置共线，求一种配对方案。</p>
            <ul>
              <li>输入：第一行为 n，接下来的 n 行为巨人信息，其中第 i+1 行为巨人 i 的坐标 (xᵢ,yᵢ)。最后 n 行为魔鬼信息，其中第 n+i+1 行为魔鬼 i 的坐标 (xᵢ,yᵢ)。</li>
              <li>输出：n 行，其中第 i 行的格式为 " xᵢ,yᵢ xᵢ′,yᵢ′ " 表示 (xᵢ,yᵢ) 位置的巨人和 (xᵢ′,yᵢ′) 位置的魔鬼配对。</li>
            </ul>
            <p><strong>解题思路：分治 + 递归</strong>——我们设 P₁..P<sub>n</sub> 为巨人的固定点，P<sub>n+1</sub>..P<sub>2n</sub> 为鬼的固定点。我们采取分治策略寻找序列 [P_p..P_r] 中的配对方案（初始时 [P_p..P_r] 为 [P₁..P<sub>2n</sub>]）：</p>
            <ol>
              <li>在 [P<sub>p</sub>..P<sub>r</sub>] 中找出一个最低位置（Y 坐标值最小）的一个点 P₀，如果这样的点有多个，则选取最左边的点为 P₀，P₀ 与 P<sub>p</sub> 交换。然后将其余点 [P<sub>p+1</sub>..P<sub>r</sub>] 按相对 P<sub>p</sub> 的极角递增的顺序排列。显然 P<sub>p</sub> 与其余点 P<sub>p+1</sub>..P<sub>r</sub> 之间的任何线段是不会交叉的。</li>
              <li>我们从 P_p 开始寻找一个巨人和鬼成对的最小子区间 [P_p..P_i]（p≤i≤r）。若该子区间仅剩一个元素，配对结束；否则巨人（鬼）P_p 与鬼（巨人）P_i 配对。</li>
              <li>这样使得尚未配对的巨人和鬼分布在两个子区间 [P<sub>p+1</sub>..P<sub>i−1</sub>]、[P<sub>i+1</sub>..P<sub>r</sub>]。继续按上述分治策略分别递归求解 [P<sub>p+1</sub>..P<sub>i−1</sub>] 和 [P<sub>i+1</sub>..P<sub>r</sub>]。</li>
            </ol>
            <h3 id="sec-ps-h6">习题 AREA</h3>
            <p>Jerry, a middle school student, addicts himself to mathematical research. Maybe the problems he has thought are really too easy to an expert. But as an amateur, especially as a 15-year-old boy, he had done very well. He is so rolling in thinking the mathematical problem that he is easily to try to solve every problem he met in a mathematical way. One day, he found a piece of paper on the desk. His younger sister, Mary, a four-year-old girl, had drawn some lines. But those lines formed a special kind of concave polygon by accident as Fig. 1 shows.</p>
            <p>"Great!" he thought, "The polygon seems so regular. I had just learned how to calculate the area of triangle, rectangle and circle. I'm sure I can find out how to calculate the area of this figure." And so he did. First of all, he marked the vertexes in the polygon with their coordinates as Fig. 2 shows. And then he found the result—0.75 effortless.</p>
            <p>Of course, he was not satisfied with the solution of such an easy problem. "Mmm, if there's a random polygon on the paper, then how can I calculate the area?" he asked himself. Till then, he hadn't found out the general rules on calculating the area of a random polygon. He clearly knew that the answer to this question is out of his competence. So he asked you, an erudite expert, to offer him help. The kind behavior would be highly appreciated by him.</p>
            <pre class="code"><code>Input
The input data consists of several figures. The first line of the input for each figure
contains a single integer n, the number of vertexes in the figure. (0≤n≤1000).
In the following n lines, each contain a pair of real numbers, which describes the
coordinates of the vertexes, (xi, yi). The figure in each test case starts from the first
vertex to the second one, then from the second to the third, …… and so on. At last, it
closes from the nth vertex to the first one.
The input ends with an empty figure (n = 0). And this figure not be processed.

Output
As shown below, the output of each figure should contain the figure number and a colon
followed by the area of the figure or the string "Impossible".
If the figure is a polygon, compute its area (accurate to two fractional digits). According
to the input vertexes, if they cannot form a polygon (that is, one line intersects with
another which shouldn't be adjoined with it, for example, in a figure with four lines, the
first line intersects with the third one), just display "Impossible", indicating the figure
can't be a polygon. If the amount of the vertexes is not enough to form a closed polygon,
the output message should be "Impossible" either.
Print a blank line between each test cases.

Sample Input            Sample Output
5                       Figure 1: 0.75
0 0
0 1                     Figure 2: Impossible
0.5 0.5
1 1
1 0
4
0 0
0 1
1 0
1 1
0</code></pre>
            <p>解题提示：随机多边形面积可用有向面积（叉积之和）计算；顶点不足以成多边形或非相邻边相交（用线段相交判定）时输出 Impossible。</p>
          `,
        },
      ],
    },
  ],
};

export default deck;
