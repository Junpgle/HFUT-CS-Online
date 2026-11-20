/* 高等数学 · 第9章 多元函数微分学 —— 依据课件 PPT-1（D9-1…D9-10）及 D9 习题课整理 */
import type { MathChapter } from './types';

const ch: MathChapter = {
  id: 'ch9',
  no: '第9章',
  title: '多元函数微分学',
  subtitle: '第 9 章 · 多元函数微分学',
  lede: `
  由一元函数微分学推广到多元函数微分学，学习方法是<strong>重点把握不同点，关注有质变的概念和理论方法</strong>。
  本章建立多元函数的概念、极限与连续、偏导数、全微分，给出复合函数求导的<strong>链式法则</strong>与隐函数求导，
  再学习方向导数与梯度、几何应用，最后是极值与最值（<strong>拉格朗日乘数法</strong>）。
`,
  toc: [
    { id: 'sec-ch9-basic', text: '1. 多元函数的基本概念', level: 2 },
    { id: 'sec-ch9-limit', text: '2. 二元函数的极限与连续', level: 2 },
    { id: 'sec-ch9-partial', text: '3. 偏导数', level: 2 },
    { id: 'sec-ch9-total', text: '4. 全微分', level: 2 },
    { id: 'sec-ch9-chain', text: '5. 多元复合函数的求导法则', level: 2 },
    { id: 'sec-ch9-implicit', text: '6. 隐函数的微分法', level: 2 },
    { id: 'sec-ch9-directional', text: '7. 方向导数和梯度', level: 2 },
    { id: 'sec-ch9-geometry', text: '8. 多元函数微分学的几何应用', level: 2 },
    { id: 'sec-ch9-extreme', text: '9. 多元函数的极值', level: 2 },
    { id: 'sec-ch9-exercise', text: '10. 多元函数微分学习题课', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ch9-basic',
      heading: '1. 多元函数的基本概念',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ch9-basic-h1">一、平面点集</h3>
          <p><strong>邻域</strong>：设 P<sub>0</sub>(x<sub>0</sub>, y<sub>0</sub>)，δ &gt; 0，平面点集</p>
          <div class="formula">U(P<sub>0</sub>, δ) = <span class="m">{ (x, y) | (x − x<sub>0</sub>)<sup>2</sup> + (y − y<sub>0</sub>)<sup>2</sup> &lt; δ<sup>2</sup> }</span></div>
          <p>称为 P<sub>0</sub> 的 δ 邻域；若不强调半径 δ，也可记作 U(P<sub>0</sub>)。<strong>去心（空心）邻域</strong> Ǔ(P<sub>0</sub>, δ) 为</p>
          <div class="formula"><span class="m">{ (x, y) | 0 &lt; (x − x<sub>0</sub>)<sup>2</sup> + (y − y<sub>0</sub>)<sup>2</sup> &lt; δ<sup>2</sup> }</span></div>
          <p><strong>内点</strong>：设有点集 E 及一点 P，若存在 P 的某邻域 U(P) ⊂ E，就称 P 为 E 的内点。</p>
          <p><strong>聚点</strong>：对任意给定的 δ &gt; 0，点 P 的去心邻域 Ǔ(P, δ) 内总有 E 中的点，就称 P 是 E 的聚点。</p>
          <div class="callout key">
            <p>注 1：聚点可能属于 E，也可能不属于 E。注 2：内点必为聚点。</p>
          </div>
          <p><strong>边界点</strong>：对点 P 的任一邻域 U(P)，若它既含有属于 E 中的点，也含有不属于 E 中的点，就称 P 为 E 的边界点；E 的边界点的全体称为 E 的边界。</p>
          <div class="callout key">
            <p>注 1：边界点可能属于 E，也可能不属于 E。注 2：边界点可能是聚点，也可能不是聚点。注 3：边界点不可能是内点，内点也不可能是边界点。</p>
          </div>
          <p><strong>课件例 1</strong>：设 E = { (x, y) | 0 &lt; x<sup>2</sup> + y<sup>2</sup> &lt; 1 }，则</p>
          <ul>
            <li>满足 0 &lt; x<sup>2</sup> + y<sup>2</sup> &lt; 1 的点均为 E 的<strong>内点</strong>；</li>
            <li>满足 x<sup>2</sup> + y<sup>2</sup> ≤ 1 的点均为 E 的<strong>聚点</strong>；</li>
            <li>满足 x<sup>2</sup> + y<sup>2</sup> = 1 的点以及原点 O(0,0) 均为<strong>边界点</strong>，故 E 的边界为 { x<sup>2</sup> + y<sup>2</sup> = 1 } ∪ { (0,0) }。</li>
          </ul>
          <p><strong>有界点集与无界点集</strong>：若存在正数 M，使得对任意 P ∈ E，总有 |OP| ≤ M，就称 E 为<strong>有界点集</strong>，否则称为无界点集。例如 x<sup>2</sup> + y<sup>2</sup> ≤ 4 为有界点集；y &gt; x<sup>2</sup> 为无界点集。</p>
          <h3 id="sec-ch9-basic-h2">开集、闭集、连通集与区域</h3>
          <ul>
            <li>若 E 的每点都是内点，称 E 为<strong>开集</strong>；若 E 的每个边界点都属于 E，称 E 为<strong>闭集</strong>。</li>
            <li>若 E 中任意两点都可用一完全属于 E 的折线相连，称 E 是<strong>连通集</strong>；连通的开集称为<strong>开区域</strong>，开区域连同其边界称为<strong>闭区域</strong>；开区域、闭区域或开区域连同其部分边界点的集合统称为<strong>区域</strong>。</li>
          </ul>
          <p>课件举例：整个平面既是最大的开区域也是最大的闭区域；xy &gt; 0 是开集但由于不是连通集故不是开区域；点集 { (0,1), (1,0), (1,1) } 没有内点故不是开集，而三点均为边界点故是闭集。</p>
          <h3 id="sec-ch9-basic-h3">二、二元函数</h3>
          <p>引例：圆柱体体积 V = πr<sup>2</sup>h（r &gt; 0, h &gt; 0）；定量理想气体的压强 p = RT/V（T &gt; 0, V &gt; 0，R 为常数）。</p>
          <p><strong>定义 1</strong>：设 x, y, z 为三个变量，D 为平面上非空点集，如果 (x, y) 在 D 中任取一个确定的点时，变量 z 按照一定的法则 f 总有惟一确定的数值与之对应，就称 z 是 x, y 的函数（f 为定义在 D 上的二元函数），记为</p>
          <div class="formula">z = <span class="m">f(x, y)</span>,  <span class="m">(x, y) ∈ D</span></div>
          <p>平面点集 D 称为<strong>定义域</strong>，x, y 称为自变量，z 称为因变量或函数，函数值的集合称为值域。<strong>几何意义</strong>：z = f(x, y) 表示一张空间曲面，其定义域为曲面在 xOy 平面上的投影区域。</p>
          <p>例如 z = √(1 − x<sup>2</sup> − y<sup>2</sup>) 的定义域为闭圆盘 x<sup>2</sup> + y<sup>2</sup> ≤ 1，曲面为以原点为心、半径为 1 的上半球面；z = sin(xy) 的定义域为整个 xOy 平面。</p>
          <h3 id="sec-ch9-basic-h4">三、n 维空间与 n 元函数</h3>
          <p>n 元有序数组 (x<sub>1</sub>, x<sub>2</sub>, …, x<sub>n</sub>) 的全体称为 <strong>n 维空间</strong> ℝ<sup>n</sup>；每个元素称为空间中的一个点，x<sub>k</sub> 称为该点的第 k 个坐标。n = 2 为二维空间 ℝ<sup>2</sup>（xOy 平面），n = 3 为三维空间 ℝ<sup>3</sup>。</p>
          <div class="formula"><span class="m">ρ(P<sub>1</sub>, P<sub>2</sub>) = √[(x<sub>1</sub>−y<sub>1</sub>)<sup>2</sup> + (x<sub>2</sub>−y<sub>2</sub>)<sup>2</sup> + … + (x<sub>n</sub>−y<sub>n</sub>)<sup>2</sup>]</span></div>
          <p>利用距离 ρ 可同理定义 ℝ<sup>n</sup> 中的邻域、内点、聚点、边界点、连通集、开集、闭集、开区域、闭区域、有界集与无界集等。当 n = 1, 2, 3 时，ρ(P<sub>1</sub>, P<sub>2</sub>) = |P<sub>1</sub>P<sub>2</sub>|。</p>
          <p><strong>定义 2</strong>：设 D 为 ℝ<sup>n</sup> 中的非空点集，若 (x<sub>1</sub>, …, x<sub>n</sub>) 取 D 中一个确定点时，变量 u 按法则 f 总有惟一确定的数值与之对应，就称 u 为定义在 D 上的 <strong>n 元函数</strong>，记为 u = f(x<sub>1</sub>, …, x<sub>n</sub>)，(x<sub>1</sub>, …, x<sub>n</sub>) ∈ D。当 n ≥ 2 时也称为<strong>多元函数</strong>。</p>
          <p>课件举例：三元函数 u = arcsin(x<sup>2</sup> + y<sup>2</sup> + z<sup>2</sup>) 的定义域为单位闭球体 x<sup>2</sup> + y<sup>2</sup> + z<sup>2</sup> ≤ 1，其图形为 ℝ<sup>4</sup> 空间中的超曲面。</p>
          <div class="callout tip">
            <p>一元函数与多元函数的差别，关键在于一元函数与二元函数的差别。</p>
          </div>
          `,
        },
      ],
    },
    {
      id: 'sec-ch9-limit',
      heading: '2. 二元函数的极限与连续',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ch9-limit-h1">一、二元函数的极限</h3>
          <p><strong>定义 1（二重极限）</strong>：设点 P<sub>0</sub>(x<sub>0</sub>, y<sub>0</sub>) 为 f(x, y) 的定义域 D 的聚点，A 为常数。若对任意 ε &gt; 0，总存在 δ &gt; 0，使得当 (x, y) ∈ Ǔ(P<sub>0</sub>, δ) ∩ D，即 0 &lt; (x−x<sub>0</sub>)<sup>2</sup> + (y−y<sub>0</sub>)<sup>2</sup> &lt; δ<sup>2</sup> 且 (x, y) ∈ D 时，恒有 |f(x, y) − A| &lt; ε，就称 A 是 (x, y) → (x<sub>0</sub>, y<sub>0</sub>) 时 f 的极限，记为</p>
          <div class="formula">lim<sub>(x,y)→(x<sub>0</sub>,y<sub>0</sub>)</sub> <span class="m">f(x, y) = A</span></div>
          <p><strong>路径的差别</strong>：一元函数极限 x → x<sub>0</sub> 通常只有 x → x<sub>0</sub><sup>−</sup> 与 x → x<sub>0</sub><sup>+</sup> 两条路径；而二元函数的极限却有无穷多条路径。如果动点沿<strong>任意路径</strong>趋于定点时 f(x, y) 都趋于同一个数 A，则二重极限为 A；若沿两条不同路径趋于定点时函数趋于两个不同数值，则极限不存在。</p>
          <p><strong>课件例 2（经典例题，记住结论）</strong>：f(x, y) = xy/(x<sup>2</sup> + y<sup>2</sup>)。沿 x 轴（y = 0）趋于原点有 lim f(x, 0) = 0；沿直线 y = x 趋于原点有 lim f(x, x) = lim x<sup>2</sup>/(2x<sup>2</sup>) = 1/2。两种路径结果不同，故在 (0,0) 处极限不存在。</p>
          <div class="callout key">
            <p><strong>求二重极限的常用方法</strong>：⑴ 夹逼定理；⑵ 有界函数乘以无穷小仍为无穷小；⑶ 等价无穷小代换；⑷ 二元函数的连续性；⑸ 四则运算；⑹ 变量代换化为一元函数极限。</p>
          </div>
          <p><strong>课件例 1</strong>：f(x, y) = (x<sup>2</sup> + y<sup>2</sup>) sin(1/(x<sup>2</sup> + y<sup>2</sup>))。因 |f − 0| ≤ x<sup>2</sup> + y<sup>2</sup>，对任意 ε &gt; 0 取 δ = √ε，当 ρ = √(x<sup>2</sup>+y<sup>2</sup>) &lt; δ 时 |f| ≤ ρ<sup>2</sup> &lt; ε，故极限为 0。</p>
          <p><strong>课件例 3～5</strong>：</p>
          <ul>
            <li>lim x sin(1/(x<sup>2</sup>+y<sup>2</sup>)) = 0（有界函数乘以无穷小）；</li>
            <li>lim sin(x<sup>2</sup>+y<sup>2</sup>)/(x<sup>2</sup>+y<sup>2</sup>) = 1，令 t = x<sup>2</sup> + y<sup>2</sup> 化为 lim<sub>t→0</sub> sin t/t = 1，或用等价无穷小代换；</li>
            <li>lim x<sup>2</sup>y/(x<sup>2</sup>+y<sup>2</sup>) = 0，因 0 ≤ |x<sup>2</sup>y/(x<sup>2</sup>+y<sup>2</sup>)| ≤ |y| → 0，由夹逼定理得证。</li>
          </ul>
          <p><strong>课件例 6（累次极限的误区）</strong>：f(x, y) = x sin(1/y) + y sin(1/x)（xy ≠ 0），xy = 0 时 f = 0。可以证明二重极限 lim f = 0；但当 y ≠ 0 时 lim<sub>x→0</sub> f(x, y) = lim (x sin(1/y) + y sin(1/x)) 不存在，故两个累次极限 lim<sub>y→0</sub> lim<sub>x→0</sub> f 与 lim<sub>x→0</sub> lim<sub>y→0</sub> f 均不存在。</p>
          <div class="callout key">
            <p><strong>定理 1</strong>：如果二重极限 lim f(x,y)、两个累次极限 lim(lim f) 都存在，则三者相等（证明从略）。注意：两个累次极限存在且相等，并不能保证二重极限存在。</p>
          </div>
          <h3 id="sec-ch9-limit-h2">二、二元函数的连续性</h3>
          <p><strong>定义 2</strong>：设 P<sub>0</sub>(x<sub>0</sub>, y<sub>0</sub>) 为 z = f(x, y) 定义域 D 的聚点且 P<sub>0</sub> ∈ D，若 lim<sub>(x,y)→(x<sub>0</sub>,y<sub>0</sub>)</sub> f(x, y) = f(x<sub>0</sub>, y<sub>0</sub>)，就称 f 在点 P<sub>0</sub> 处连续。</p>
          <p>记 Δx = x − x<sub>0</sub>、Δy = y − y<sub>0</sub>（不同时为零）为自变量的增量，全增量 Δz = f(x<sub>0</sub>+Δx, y<sub>0</sub>+Δy) − f(x<sub>0</sub>, y<sub>0</sub>)，则在 P<sub>0</sub> 处连续等价于 lim<sub>(Δx,Δy)→(0,0)</sub> Δz = 0。</p>
          <p><strong>课件例 7、例 8</strong>：</p>
          <ul>
            <li>f(x, y) = xy/(x<sup>2</sup>+y<sup>2</sup>)（(x,y) ≠ (0,0)，否则为 0）：因 lim xy/(x<sup>2</sup>+y<sup>2</sup>) 不存在，故在 O(0,0) 处<strong>不连续</strong>；</li>
            <li>f(x, y) = x<sup>2</sup>y<sup>2</sup>/(x<sup>2</sup>+y<sup>2</sup>)（(x,y) ≠ (0,0)，否则为 0）：因 lim x<sup>2</sup>y<sup>2</sup>/(x<sup>2</sup>+y<sup>2</sup>) = f(0,0) = 0，故在 O(0,0) 处<strong>连续</strong>。</li>
          </ul>
          <p>若在开区域 D 内每一点处均连续，称 f 在 D 内连续；若 D 为闭区域且 f 在 D 内及边界点处都连续，称 f 在闭区域 D 上连续。</p>
          <div class="callout key">
            <p><strong>二元连续函数的性质</strong>：⑴ 和、差、积、商（分母不为零）均连续；⑵ 复合函数也是连续函数；⑶ 二元初等函数在其定义区域内（上）是连续函数。因此若 f 在 P<sub>0</sub> 连续（或 f 为二元初等函数且 P<sub>0</sub> 在其定义域内），则 lim f(x,y) = f(x<sub>0</sub>, y<sub>0</sub>)，可直接代入求极限。</p>
          </div>
          <p><strong>课件例 9～11</strong>：例 9 中 x<sup>2</sup>y<sup>2</sup>/(x<sup>2</sup>+y<sup>2</sup>) 型分段函数在全平面上处处连续；例 10 求 lim ln(x<sup>2</sup>+y<sup>2</sup>+1)（x→1, y→0）= ln(1+0+1) = ln 2（二元初等函数直接代入）；例 11 求 lim (√(x<sup>2</sup>+y<sup>2</sup>+1) − 1)/(x<sup>2</sup>+y<sup>2</sup>) = 1/2（分子有理化后代入）。</p>
          <p><strong>定理 2（有界闭区域上二元连续函数的性质）</strong>：若 f(x, y) 在有界闭区域 E 上连续，则</p>
          <ul>
            <li>⑴ <strong>最值定理</strong>：f 在 E 上必存在最大值 M 和最小值 m；</li>
            <li>⑵ <strong>有界定理</strong>：f 在 E 上必有界；</li>
            <li>⑶ <strong>介值定理</strong>：对任意 C ∈ [m, M]，存在 (ξ, η) ∈ E 使 f(ξ, η) = C；</li>
            <li>⑷ <strong>零点定理</strong>：当 m &lt; 0、M &gt; 0 时，存在 (ξ, η) ∈ E 使 f(ξ, η) = 0。</li>
          </ul>
          <p>二元函数的极限、连续性及其性质可推广到三元及三元以上的函数。课件还给出反例：f(x,y) = xy<sup>2</sup>/(x<sup>2</sup>+y<sup>4</sup>)（(x,y) ≠ (0,0)，否则为 0）在原点处极限不存在，但沿任一直线 y = kx（包括 x = 0）逼近原点时极限都存在且为 0（沿曲线 y = √x 趋于原点时得 1/2）。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch9-partial',
      heading: '3. 偏导数',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ch9-partial-h1">一、偏导数的概念及其计算</h3>
          <p><strong>定义 1</strong>：设函数 z = f(x, y) 在点 (x<sub>0</sub>, y<sub>0</sub>) 的某邻域内有定义。若极限</p>
          <div class="formula">lim<sub>Δx→0</sub> <span class="m">[f(x<sub>0</sub>+Δx, y<sub>0</sub>) − f(x<sub>0</sub>, y<sub>0</sub>)] / Δx</span></div>
          <p>存在，就称此极限为 f 在点 (x<sub>0</sub>, y<sub>0</sub>) 处关于 x 的偏导数，记为 ∂z/∂x、∂f/∂x、f′<sub>x</sub>(x<sub>0</sub>, y<sub>0</sub>) 或 z′<sub>x</sub>，也记作 d f(x<sub>0</sub>, y<sub>0</sub>)/dx。类似定义关于 y 的偏导数：</p>
          <div class="formula">f′<sub>y</sub>(x<sub>0</sub>, y<sub>0</sub>) = lim<sub>Δy→0</sub> <span class="m">[f(x<sub>0</sub>, y<sub>0</sub>+Δy) − f(x<sub>0</sub>, y<sub>0</sub>)] / Δy</span></div>
          <p>若两个偏导数都存在，就称 f 在点 (x<sub>0</sub>, y<sub>0</sub>) 处<strong>可偏导</strong>。</p>
          <p><strong>几何意义</strong>：f′<sub>x</sub>(x<sub>0</sub>, y<sub>0</sub>) 是曲面 z = f(x, y) 被平面 y = y<sub>0</sub> 所截曲线在点 M<sub>0</sub> 处的切线对 x 轴的斜率；f′<sub>y</sub>(x<sub>0</sub>, y<sub>0</sub>) 是曲面被平面 x = x<sub>0</sub> 所截曲线在点 M<sub>0</sub> 处的切线对 y 轴的斜率。</p>
          <p><strong>偏增量与全增量</strong>：偏增量 Δ<sub>x</sub>z = f(x<sub>0</sub>+Δx, y<sub>0</sub>) − f(x<sub>0</sub>, y<sub>0</sub>)，Δ<sub>y</sub>z = f(x<sub>0</sub>, y<sub>0</sub>+Δy) − f(x<sub>0</sub>, y<sub>0</sub>)；全增量 Δz = f(x<sub>0</sub>+Δx, y<sub>0</sub>+Δy) − f(x<sub>0</sub>, y<sub>0</sub>)。简单地说，<strong>偏导数就是偏增量之比的极限</strong>。</p>
          <p><strong>课件例 1</strong>：z = x<sup>2</sup> + 3xy + y<sup>2</sup>，求在点 (1,2) 处的偏导数。令 y = 2 得 z = x<sup>2</sup> + 6x + 4，∂z/∂x|<sub>(1,2)</sub> = (2x+6)|<sub>x=1</sub> = 8；令 x = 1 得 z = 1 + 3y + y<sup>2</sup>，∂z/∂y|<sub>(1,2)</sub> = (3+2y)|<sub>y=2</sub> = 7。</p>
          <p>若 f 在区域 D 内任一点均可偏导，其偏导数仍是 x, y 的函数，称为<strong>偏导函数</strong>，记为 f′<sub>x</sub>(x,y)、f′<sub>y</sub>(x,y)、f′<sub>1</sub>、f′<sub>2</sub> 等，且有 f′<sub>x</sub>(x<sub>0</sub>, y<sub>0</sub>) = f′<sub>x</sub>(x, y)|<sub>(x<sub>0</sub>,y<sub>0</sub>)</sub>。</p>
          <div class="callout warn">
            <p><strong>连续性与可偏导性互不蕴含</strong>（课件例 2、例 3）：例 2 中 f(x,y) = xy/(x<sup>2</sup>+y<sup>2</sup>)（原点处为 0）在 (0,0) 处 f′<sub>x</sub> = f′<sub>y</sub> = 0 但<strong>不连续</strong>；例 3 中 f(x,y) = √(x<sup>2</sup>+y<sup>2</sup>) 在 (0,0) 处<strong>连续</strong>，但 f(x,0) = |x|、f(0,y) = |y| 在 0 处不可导，故<strong>不可偏导</strong>。</p>
          </div>
          <p><strong>推广到三元函数</strong>：u = f(x, y, z) 在点 (x,y,z) 处对 x 的偏导数为 f′<sub>x</sub> = lim<sub>Δx→0</sub> [f(x+Δx,y,z) − f(x,y,z)]/Δx。</p>
          <p><strong>课件例 5</strong>：r = √(x<sup>2</sup>+y<sup>2</sup>+z<sup>2</sup>)，则 ∂r/∂x = x/r、∂r/∂y = y/r、∂r/∂z = z/r，所以 x∂r/∂x + y∂r/∂y + z∂r/∂z = r。</p>
          <p><strong>课件例 6</strong>：理想气体状态方程 pV = RT（R 为常数），可证 (∂p/∂T)(∂T/∂V)(∂V/∂p) = −1。验证：p = RT/V，V = RT/p，T = pV/R，∂p/∂T = R/V，∂T/∂V = −p/R，∂V/∂p = −RT/p<sup>2</sup> = −V/p，三式相乘得 −1。</p>
          <div class="callout warn">
            <p>偏导数记号 ∂z/∂x 是<strong>整体记号</strong>，不能看作分子与分母的商。</p>
          </div>
          <h3 id="sec-ch9-partial-h2">二、高阶偏导数</h3>
          <p>若 z = f(x,y) 的两个一阶偏导数仍存在偏导数，就得到四个<strong>二阶偏导数</strong>：</p>
          <div class="formula">∂<sup>2</sup>z/∂x<sup>2</sup> = f″<sub>xx</sub>,  ∂<sup>2</sup>z/∂y∂x = f″<sub>xy</sub>,  ∂<sup>2</sup>z/∂x∂y = f″<sub>yx</sub>,  ∂<sup>2</sup>z/∂y<sup>2</sup> = f″<sub>yy</sub></div>
          <p>其中 f″<sub>xy</sub> 与 f″<sub>yx</sub> 称为<strong>二阶混合偏导数</strong>。</p>
          <p><strong>课件例 7</strong>：z = e<sup>x+2y</sup>，所有二阶偏导数为 f″<sub>xx</sub> = e<sup>x+2y</sup>，f″<sub>xy</sub> = 2e<sup>x+2y</sup>，f″<sub>yx</sub> = 2e<sup>x+2y</sup>，f″<sub>yy</sub> = 4e<sup>x+2y</sup>，此处 mixed 两者相等。</p>
          <p><strong>课件例 8</strong>：给出一分段函数（x<sup>2</sup>+y<sup>2</sup> ≠ 0 时用有理式定义，原点处为 0），在 (0,0) 处两个二阶混合偏导数不相等：f″<sub>xy</sub>(0,0) = −1，f″<sub>yx</sub>(0,0) = 1，说明混合偏导数相等<strong>并不总成立</strong>。</p>
          <div class="callout key">
            <p><strong>定理</strong>：若 f″<sub>xy</sub>(x,y) 和 f″<sub>yx</sub>(x,y) 都在点 (x,y) 连续，则 f″<sub>xy</sub>(x,y) = f″<sub>yx</sub>(x,y)。例 7 中二阶混合偏导数处处连续故处处相等；例 8 中二者在 (0,0) 处不连续。</p>
          </div>
          <p><strong>课件例 9</strong>：u = 1/r，r = √(x<sup>2</sup>+y<sup>2</sup>+z<sup>2</sup>)，满足 ∂<sup>2</sup>u/∂x<sup>2</sup> + ∂<sup>2</sup>u/∂y<sup>2</sup> + ∂<sup>2</sup>u/∂z<sup>2</sup> = 0（利用对称性，∂u/∂x = −x/r<sup>3</sup>，∂<sup>2</sup>u/∂x<sup>2</sup> = −1/r<sup>3</sup> + 3x<sup>2</sup>/r<sup>5</sup>，三式相加为 0）。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch9-total',
      heading: '4. 全微分',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ch9-total-h1">一、全微分的概念</h3>
          <p><strong>一元函数的可微与微分回顾</strong>：y = f(x) 可微时 Δy = AΔx + o(Δx)，规定 A = f′(x)、dx = Δx，微分 dy = f′(x)dx。</p>
          <p><strong>定义</strong>：如果 z = f(x, y) 在定义域 D 的内点 (x, y) 处的全增量 Δz = f(x+Δx, y+Δy) − f(x, y) 可表示为</p>
          <div class="formula">Δz = <span class="m">A Δx + B Δy + o(ρ)</span>,  <span class="m">ρ = √[(Δx)<sup>2</sup>+(Δy)<sup>2</sup>]</span></div>
          <p>其中 A、B 不依赖于 Δx、Δy，仅与 x、y 有关，就称 f 在点 (x, y) 处<strong>可微</strong>，并称 AΔx + BΔy 为全微分，记为 dz = AΔx + BΔy。规定 dx = Δx、dy = Δy，则 dz = A dx + B dy；当 dx、dy 充分小时 Δz ≈ dz（可用于近似计算）。若在区域 D 内各点都可微，称 f 在 D 内可微。</p>
          <h3 id="sec-ch9-total-h2">二、可微的条件</h3>
          <div class="callout key">
            <p><strong>定理 1（必要条件）</strong>：若 z = f(x, y) 在点 (x, y) 处可微，则 ⑴ f 在该点<strong>连续</strong>；⑵ f 在该点<strong>可偏导</strong>，且 A = f′<sub>x</sub>(x,y)、B = f′<sub>y</sub>(x,y)，于是</p>
            <p class="formula">dz = <span class="m">f′<sub>x</sub>(x, y) dx + f′<sub>y</sub>(x, y) dy = (∂z/∂x) dx + (∂z/∂y) dy</span></p>
          </div>
          <p>其逆否命题：不连续或不可偏导则必不可微。但<strong>逆命题不成立</strong>：连续未必可微（如 √(x<sup>2</sup>+y<sup>2</sup>) 在 (0,0) 连续但不可偏导故不可微）；可偏导也未必可微（如 xy/(x<sup>2</sup>+y<sup>2</sup>) 分段函数在 (0,0) 处可偏导但不连续故不可微）。误区：不能因为写出了 dz = f′<sub>x</sub> dx + f′<sub>y</sub> dy 就认为可偏导一定可微。</p>
          <p><strong>定理 2（充分必要条件）</strong>：若 f 在点 (x, y) 处可偏导，则可微的充要条件为</p>
          <div class="formula">lim<sub>(Δx,Δy)→(0,0)</sub> <span class="m">[Δz − f′<sub>x</sub>Δx − f′<sub>y</sub>Δy] / √(Δx)<sup>2</sup>+(Δy)<sup>2</sup> = 0</span></div>
          <p>推论：上述极限不为 0（包括不存在或存在但不为 0）是不可微的充分必要条件。</p>
          <p><strong>课件例 1、例 2</strong>：用定理 2 讨论分段函数在 (0,0) 处的可微性。例 1 中 f′<sub>x</sub>(0,0) = f′<sub>y</sub>(0,0) = 0，但 [Δz − 0] / ρ = ΔxΔy/(Δx<sup>2</sup>+Δy<sup>2</sup>)<sup>3/2</sup> · ρ 的极限不存在，故<strong>不可微</strong>；例 2 中同样有 f′<sub>x</sub> = f′<sub>y</sub> = 0，而 [Δz]/ρ → 0，故<strong>可微</strong>。可见判别可微性并不容易。</p>
          <div class="callout key">
            <p><strong>定理 3（充分条件）</strong>：若 z = f(x, y) 的偏导数 ∂z/∂x、∂z/∂y 在点 (x, y) 处<strong>连续</strong>，则函数在该点可微（逆命题不成立：可微时偏导数未必连续）。</p>
          </div>
          <h3 id="sec-ch9-total-h3">三、全微分的计算与近似</h3>
          <p><strong>偏微分</strong>：称 (∂z/∂x)dx、(∂z/∂y)dy 为 f 在点 (x,y) 处关于 x 和关于 y 的偏微分，<strong>全微分等于所有偏微分之和</strong>。三元可微函数 u = f(x, y, z) 的全微分为 du = (∂u/∂x)dx + (∂u/∂y)dy + (∂u/∂z)dz。</p>
          <p><strong>课件例 3</strong>：z = e<sup>xy</sup>，因 ∂z/∂x = ye<sup>xy</sup>、∂z/∂y = xe<sup>xy</sup> 处处连续，故处处可微且 dz = ye<sup>xy</sup>dx + xe<sup>xy</sup>dy；在点 (2,1) 处 dz = e<sup>2</sup>dx + 2e<sup>2</sup>dy；当 Δx = 0.1、Δy = −0.2 时 dz = 0.1e<sup>2</sup> + 2e<sup>2</sup>(−0.2) = −0.3e<sup>2</sup>。</p>
          <p><strong>课件例 4</strong>：u = x<sup>2</sup> + sin(y/2) + e<sup>yz</sup>。因 ∂u/∂x = 2x、∂u/∂y = (1/2)cos(y/2) + ze<sup>yz</sup>、∂u/∂z = ye<sup>yz</sup> 处处连续，故处处可微，且</p>
          <div class="formula">du = <span class="m">2x dx + [(1/2)cos(y/2) + ze<sup>yz</sup>] dy + ye<sup>yz</sup> dz</span></div>
          <p><strong>近似计算</strong>：当 |Δx|、|Δy| 较小时，Δz ≈ dz，即</p>
          <div class="formula">f(x<sub>0</sub>+Δx, y<sub>0</sub>+Δy) ≈ <span class="m">f(x<sub>0</sub>, y<sub>0</sub>) + f′<sub>x</sub>(x<sub>0</sub>, y<sub>0</sub>)Δx + f′<sub>y</sub>(x<sub>0</sub>, y<sub>0</sub>)Δy</span></div>
          <p><strong>课件例 5</strong>：圆柱体 V = πr<sup>2</sup>h，r 由 20 cm 增至 20.05 cm（Δr = 0.05），h 由 100 cm 减至 99 cm（Δh = −1）。ΔV ≈ dV = 2πrhΔr + πr<sup>2</sup>Δh = 2π·20·100·0.05 + π·20<sup>2</sup>(−1) = −200π cm<sup>3</sup>，即体积约减少 200π cm<sup>3</sup>。</p>
          <p><strong>课件例 6</strong>：计算 1.04<sup>2.02</sup> 的近似值。设 f(x,y) = x<sup>y</sup>，取 x = 1、y = 2、Δx = 0.04、Δy = 0.02；f′<sub>x</sub> = yx<sup>y−1</sup> = 2，f′<sub>y</sub> = x<sup>y</sup>ln x = 0，故 1.04<sup>2.02</sup> ≈ 1 + 2·0.04 + 0·0.02 = 1.08。</p>
          <div class="callout tip">
            <p><strong>重要关系小结</strong>：偏导数连续 ⇒ 可微 ⇒ 连续；可微 ⇒ 可偏导。但连续 ⇏ 可微，可偏导 ⇏ 可微，可微 ⇏ 偏导数连续。</p>
          </div>
          `,
        },
      ],
    },
    {
      id: 'sec-ch9-chain',
      heading: '5. 多元复合函数的求导法则',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>一元复合函数求导回顾</strong>：y = f(u)，u = φ(x)，则 dy/dx = (dy/du)(du/dx) = f′(u)φ′(x)（链式法则）。</p>
          <p><strong>多元复合函数的常见结构</strong>：⑴ z = f(u,v)，u = φ(x,y)，v = ψ(x,y) ⇒ z = f(φ(x,y), ψ(x,y))；⑵ z = f(u,v)，u = φ(t)，v = ψ(t) ⇒ z = f(φ(t), ψ(t))；⑶ z = f(x,u,v)，u = φ(x,y)，v = ψ(x,y)。</p>
          <h3 id="sec-ch9-chain-h1">一、链式法则</h3>
          <p><strong>定理 1</strong>：若 u = φ(x,y)、v = ψ(x,y) 在点 (x,y) 处可微，z = f(u,v) 在对应点 (u,v) 处可微，则复合函数 z = f(φ(x,y), ψ(x,y)) 在点 (x,y) 处可微，且有</p>
          <div class="formula">∂z/∂x = <span class="m">(∂z/∂u)(∂u/∂x) + (∂z/∂v)(∂v/∂x) = f′<sub>1</sub>φ′<sub>x</sub> + f′<sub>2</sub>ψ′<sub>x</sub></span></div>
          <div class="formula">∂z/∂y = <span class="m">(∂z/∂u)(∂u/∂y) + (∂z/∂v)(∂v/∂y) = f′<sub>1</sub>φ′<sub>y</sub> + f′<sub>2</sub>ψ′<sub>y</sub></span></div>
          <p><strong>特例（全导数）</strong>：z = f(u,v)，u = φ(t)、v = ψ(t) 在 t 可导，则复合函数在 t 处可导，且 dz/dt = (∂z/∂u)(du/dt) + (∂z/∂v)(dv/dt)。由于此时复合结果是 t 的一元函数，导数记作 dz/dt，称为<strong>全导数</strong>。</p>
          <div class="callout tip">
            <p><strong>变量关系图口诀</strong>：函数（因变量）在左、自变量在右、中间变量在中间；从因变量到某自变量的路径数目决定了求导项数（路径用加），每条路径上的线段数决定了乘积因子个数（线段用乘）。即“路径用加，线段用乘；单出口求导，多出口偏导”。一般地 z = f(u<sub>1</sub>,…,u<sub>m</sub>)，u<sub>k</sub> = φ<sub>k</sub>(x<sub>1</sub>,…,x<sub>n</sub>) 时 ∂z/∂x<sub>i</sub> = Σ<sub>k=1</sub><sup>m</sup> (∂z/∂u<sub>k</sub>)(∂u<sub>k</sub>/∂x<sub>i</sub>)。</p>
          </div>
          <h3 id="sec-ch9-chain-h2">二、例题与全微分形式不变性</h3>
          <p><strong>课件例 1</strong>：z = e<sup>u</sup>sin v，u = xy，v = x + y。则</p>
          <div class="formula">∂z/∂x = <span class="m">e<sup>u</sup>sin v · y + e<sup>u</sup>cos v · 1 = e<sup>xy</sup>[y sin(x+y) + cos(x+y)]</span></div>
          <div class="formula">∂z/∂y = <span class="m">e<sup>u</sup>sin v · x + e<sup>u</sup>cos v · 1 = e<sup>xy</sup>[x sin(x+y) + cos(x+y)]</span></div>
          <p><strong>课件例 2</strong>：z = uv，u = e<sup>t</sup>，v = cos t，求 dz/dt。解法一用链式法则：dz/dt = (∂z/∂u)(du/dt) + (∂z/∂v)(dv/dt) = v e<sup>t</sup> − u sin t = e<sup>t</sup>(cos t − sin t)；解法二直接代入 z = e<sup>t</sup>cos t 求导，结果相同。</p>
          <p><strong>课件例 6</strong>（抽象函数）：z = f(x, u, v)，u = φ(x,y)，v = ψ(x,y)，则 ∂z/∂x = f′<sub>1</sub> + f′<sub>2</sub>φ′ + f′<sub>3</sub>ψ′，∂z/∂y = f′<sub>2</sub>φ′<sub>y</sub> + f′<sub>3</sub>ψ′<sub>y</sub>；若 u、v 都只依赖 x，则全导数 dz/dx = f′<sub>1</sub> + f′<sub>2</sub>φ′(x) + f′<sub>3</sub>ψ′(x)。</p>
          <p><strong>课件例 8</strong>：z = u + v，u = e<sup>t</sup>，v = sin t，则 dz/dt = e<sup>t</sup> + cos t（两种解法一致）。</p>
          <div class="callout key">
            <p><strong>全微分形式的不变性</strong>：若 z = f(u,v) 可微，则无论 u、v 是自变量还是中间变量，全微分形式 dz = (∂z/∂u)du + (∂z/∂v)dv 都成立。利用这一性质求偏导（或全导数）时，可先写出 dz 再对比系数读出各偏导数，十分方便。</p>
          </div>
          <p><strong>课件例 10</strong>：z = f(x<sup>2</sup>+y<sup>2</sup>, xy)，f 具有二阶连续偏导数。令 u = x<sup>2</sup>+y<sup>2</sup>、v = xy（解题过程中最终结果不应出现 u、v 符号），则 z<sub>x</sub> = 2x f′<sub>1</sub> + y f′<sub>2</sub>，进而 z<sub>xy</sub> = 4xy f″<sub>11</sub> + 2(x<sup>2</sup>+y<sup>2</sup>) f″<sub>12</sub> + 2 f′<sub>1</sub> + 2xy f″<sub>22</sub>（利用 f″<sub>12</sub> = f″<sub>21</sub>）。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch9-implicit',
      heading: '6. 隐函数的微分法',
      blocks: [
        {
          type: 'html',
          html: `
          <p>本节讨论两个问题：⑴ 方程在什么条件下才能确定隐函数（如 x<sup>2</sup>+y<sup>2</sup> = C，当 C &lt; 0 时不能确定隐函数，C &gt; 0 时在局部能确定）；⑵ 方程能确定隐函数时，研究其连续性、可微性及求导方法。</p>
          <h3 id="sec-ch9-implicit-h1">一、一个方程所确定的隐函数及其导数</h3>
          <div class="callout key">
            <p><strong>定理 1</strong>：设函数 F(x,y) 在点 P(x<sub>0</sub>, y<sub>0</sub>) 的某一邻域内满足 ① 具有连续的偏导数；② F(x<sub>0</sub>, y<sub>0</sub>) = 0；③ F<sub>y</sub>(x<sub>0</sub>, y<sub>0</sub>) ≠ 0。则方程 F(x,y) = 0 在点 x<sub>0</sub> 的某邻域内可唯一确定一个单值连续函数 y = f(x)，满足条件 y<sub>0</sub> = f(x<sub>0</sub>)，并有连续导数（<strong>隐函数求导公式</strong>）：</p>
            <p class="formula">dy/dx = <span class="m">−F<sub>x</sub>/F<sub>y</sub></span></p>
          </div>
          <p>推导：F(x, f(x)) ≡ 0，两边对 x 求导得 F<sub>x</sub> + F<sub>y</sub>(dy/dx) = 0，解出即得公式。若 F 的二阶偏导数也都连续，则还有二阶导数公式</p>
          <div class="formula">d<sup>2</sup>y/dx<sup>2</sup> = <span class="m">−(F<sub>xx</sub>F<sub>y</sub><sup>2</sup> − 2F<sub>xy</sub>F<sub>x</sub>F<sub>y</sub> + F<sub>yy</sub>F<sub>x</sub><sup>2</sup>) / F<sub>y</sub><sup>3</sup></span></div>
          <p><strong>课件例 1</strong>：验证方程 sin y + e<sup>x</sup> − xy − 1 = 0 在点 (0,0) 某邻域可确定单值可导隐函数 y = f(x)，并求 dy/dx|<sub>x=0</sub>、d<sup>2</sup>y/dx<sup>2</sup>|<sub>x=0</sub>。令 F = sin y + e<sup>x</sup> − xy − 1，则 F<sub>x</sub> = e<sup>x</sup> − y、F<sub>y</sub> = cos y − x 连续，F(0,0) = 0，F<sub>y</sub>(0,0) = 1 ≠ 0；由定理 1 结论成立。又 F<sub>x</sub>(0,0) = 1，故 dy/dx|<sub>0</sub> = −F<sub>x</sub>/F<sub>y</sub> = −1；两边再求导并令 x = 0（此时 y = 0、y′ = −1），得 d<sup>2</sup>y/dx<sup>2</sup>|<sub>0</sub> = −3。</p>
          <div class="callout key">
            <p><strong>定理 2</strong>：若函数 F(x,y,z) 满足 ① 在点 P(x<sub>0</sub>,y<sub>0</sub>,z<sub>0</sub>) 的某邻域内具有连续偏导数；② F(x<sub>0</sub>,y<sub>0</sub>,z<sub>0</sub>) = 0；③ F<sub>z</sub>(x<sub>0</sub>,y<sub>0</sub>,z<sub>0</sub>) ≠ 0。则方程 F(x,y,z) = 0 在点 (x<sub>0</sub>,y<sub>0</sub>) 某邻域内可唯一确定一个单值连续函数 z = f(x,y)，满足 z<sub>0</sub> = f(x<sub>0</sub>,y<sub>0</sub>)，并有连续偏导数：</p>
            <p class="formula">∂z/∂x = <span class="m">−F<sub>x</sub>/F<sub>z</sub></span>,  ∂z/∂y = <span class="m">−F<sub>y</sub>/F<sub>z</sub></span></p>
          </div>
          <p>推导：F(x, y, f(x,y)) ≡ 0，对 x 求偏导得 F<sub>x</sub> + F<sub>z</sub>(∂z/∂x) = 0，在邻域内 F<sub>z</sub> ≠ 0 故得公式；同样可得 ∂z/∂y。</p>
          <p><strong>课件例 2</strong>：设 x<sup>2</sup>+y<sup>2</sup>+z<sup>2</sup>−4z = 0，求 ∂<sup>2</sup>z/∂x<sup>2</sup>。对 x 求偏导得 2x + 2z(∂z/∂x) − 4(∂z/∂x) = 0，故 ∂z/∂x = x/(2−z)；再对 x 求偏导得 2 + 2(∂z/∂x)<sup>2</sup> + 2z(∂<sup>2</sup>z/∂x<sup>2</sup>) − 4(∂<sup>2</sup>z/∂x<sup>2</sup>) = 0，于是 ∂<sup>2</sup>z/∂x<sup>2</sup> = [1+(∂z/∂x)<sup>2</sup>]/(2−z) = [(2−z)<sup>2</sup>+x<sup>2</sup>]/(2−z)<sup>3</sup>。</p>
          <p><strong>课件例 3</strong>：设 F(x,y) 具有连续偏导数，方程 F(x/z, y/z) = 0 确定 z = f(x,y)，求 dz。由公式得 ∂z/∂x = zF′<sub>1</sub>/(xF′<sub>1</sub>+yF′<sub>2</sub>)，∂z/∂y = zF′<sub>2</sub>/(xF′<sub>1</sub>+yF′<sub>2</sub>)，故</p>
          <div class="formula">dz = <span class="m">[z / (xF′<sub>1</sub>+yF′<sub>2</sub>)] (F′<sub>1</sub> dx + F′<sub>2</sub> dy)</span></div>
          <h3 id="sec-ch9-implicit-h2">二、方程组所确定的隐函数组及其导数</h3>
          <p>由 F、G 的偏导数组成的行列式称为 F、G 的<strong>雅可比（Jacobi）行列式</strong>：J = ∂(F,G)/∂(y,z)。</p>
          <div class="callout key">
            <p><strong>定理 3</strong>：设 F(x,y,z)、G(x,y,z) 满足 ① 在点 P(x<sub>0</sub>,y<sub>0</sub>,z<sub>0</sub>) 的某邻域内具有一阶连续偏导数；② F(P) = G(P) = 0；③ J|<sub>P</sub> = [∂(F,G)/∂(y,z)]|<sub>P</sub> ≠ 0。则方程组 F = 0、G = 0 在 P 的某邻域内唯一确定两个有连续导数的函数 y = y(x)、z = z(x)，且</p>
            <p class="formula">dy/dx = <span class="m">−(1/J) · ∂(F,G)/∂(x,z)</span>,  dz/dx = <span class="m">−(1/J) · ∂(F,G)/∂(y,x)</span></p>
          </div>
          <p><strong>定理 4</strong>：设 F(x,y,u,v)、G(x,y,u,v) 满足类似的三条件（在点 P(x<sub>0</sub>,y<sub>0</sub>,u<sub>0</sub>,v<sub>0</sub>) 邻域内一阶偏导连续、F(P)=G(P)=0、J = ∂(F,G)/∂(u,v)|<sub>P</sub> ≠ 0），则方程组唯一确定一组单值连续函数 u = u(x,y)、v = v(x,y)，其偏导数公式可由对 x、对 y 分别求导得到：以 x 为例，F<sub>x</sub>+F<sub>u</sub>u<sub>x</sub>+F<sub>v</sub>v<sub>x</sub> = 0、G<sub>x</sub>+G<sub>u</sub>u<sub>x</sub>+G<sub>v</sub>v<sub>x</sub> = 0，解此线性方程组（系数行列式即 J）即得 u<sub>x</sub>、v<sub>x</sub>。</p>
          <p><strong>课件例 4</strong>：设 xu − yv = 0，yu + xv = 1，求 ∂u/∂x、∂u/∂y、∂v/∂x、∂v/∂y。对 x 求导得 x u<sub>x</sub> − y v<sub>x</sub> = −u，y u<sub>x</sub> + x v<sub>x</sub> = −v；J = |x −y; y x| = x<sup>2</sup>+y<sup>2</sup> ≠ 0，故 u<sub>x</sub> = −(xu+yv)/(x<sup>2</sup>+y<sup>2</sup>)，v<sub>x</sub> = −(xv−yu)/(x<sup>2</sup>+y<sup>2</sup>)；练习给出 u<sub>y</sub> = −(yu−xv)/(x<sup>2</sup>+y<sup>2</sup>)，v<sub>y</sub> = −(xu+yv)/(x<sup>2</sup>+y<sup>2</sup>)。</p>
          <div class="callout tip">
            <p><strong>隐函数求导的三种方法</strong>：方法 1 利用复合函数求导法则直接计算；方法 2 利用微分形式不变性（对方程两边求微分，比较系数）；方法 3 代入求导公式。例 5 用定理 3 证明了极坐标变换的反函数存在并求出了其偏导数。</p>
          </div>
          `,
        },
      ],
    },
    {
      id: 'sec-ch9-directional',
      heading: '7. 方向导数和梯度',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ch9-directional-h1">一、方向导数</h3>
          <p><strong>定义（二元函数情形）</strong>：设函数 z = f(x,y) 在点 P<sub>0</sub>(x<sub>0</sub>,y<sub>0</sub>) 的某邻域内有定义，l 为自 P<sub>0</sub> 沿方向 l（非零向量）发出的射线。若极限</p>
          <div class="formula">lim<sub>ρ→0</sub> <span class="m">[f(x<sub>0</sub>+Δx, y<sub>0</sub>+Δy) − f(x<sub>0</sub>, y<sub>0</sub>)] / ρ = ∂f/∂l</span>,  <span class="m">ρ = √[(Δx)<sup>2</sup>+(Δy)<sup>2</sup>]</span></div>
          <p>存在，就称其极限值为 f 在点 P<sub>0</sub> 处沿方向 l 的<strong>方向导数</strong>。当 l 与 x 轴正向同向时 ∂f/∂l = f′<sub>x</sub>(x<sub>0</sub>,y<sub>0</sub>)；反向时为 −f′<sub>x</sub>；与 y 轴同向时为 f′<sub>y</sub>，反向时为 −f′<sub>y</sub>。</p>
          <div class="callout key">
            <p>方向导数是<strong>单向导数</strong>，偏导数是<strong>双向导数</strong>。</p>
          </div>
          <p><strong>课件例 1</strong>：f(x,y) = √(x<sup>2</sup>+y<sup>2</sup>) 在点 (0,0) 处沿任意方向 l 的方向导数 lim<sub>ρ→0</sub> ρ/ρ = 1（蚂蚁在顶点处沿任意方向向上爬行时斜率总为 1），但该函数在 (0,0) 处不可偏导。</p>
          <p><strong>课件例 2</strong>：f(x,y) = x<sup>2</sup>y<sup>2</sup>/(x<sup>2</sup>+y<sup>2</sup>)（原点处为 0）在 (0,0) 处沿 l = {1,1}（射线 y = x, x → +∞）的方向导数：lim [x<sup>2</sup>y<sup>2</sup>/(x<sup>2</sup>+y<sup>2</sup>)]/√(x<sup>2</sup>+y<sup>2</sup>) 沿 y = x 为 lim x/2 = +∞，故不存在。这表明<strong>可偏导不能保证沿任意方向的方向导数存在</strong>。</p>
          <div class="callout key">
            <p><strong>定理 1</strong>：若 f(x,y) 在点 P<sub>0</sub>(x<sub>0</sub>,y<sub>0</sub>) 处<strong>可微</strong>，则在该点沿任意方向 l 的方向导数均存在，且</p>
            <p class="formula">∂f/∂l = <span class="m">f′<sub>x</sub>(x<sub>0</sub>,y<sub>0</sub>) cos α + f′<sub>y</sub>(x<sub>0</sub>,y<sub>0</sub>) sin α</span></p>
            <p>其中 α 为 l 对 x 轴正向的转角（逆时针）。注意条件“可微”不可减弱为“可偏导”：例 2 中 f′<sub>x</sub> = f′<sub>y</sub> = 0，但沿 l = {1,1} 的方向导数不存在，不能用上式计算。</p>
          </div>
          <p><strong>课件例 3</strong>：求 z = 3x<sup>2</sup>y − y<sup>2</sup> 在点 P(2,3) 沿曲线 y = x<sup>2</sup>−1 朝 x 增大方向的切线方向的方向导数。tan α = y′|<sub>x=2</sub> = 4，cos α = 1/√17，sin α = 4/√17，故 ∂z/∂l|<sub>P</sub> = [6xy·(1/√17) + (3x<sup>2</sup>−2y)·(4/√17)]|<sub>(2,3)</sub> = 60/√17。</p>
          <p><strong>三元函数情形</strong>：定义 ∂f/∂l = lim<sub>ρ→0</sub> [f(x+Δx,y+Δy,z+Δz) − f(x,y,z)]/ρ，ρ = √[(Δx)<sup>2</sup>+(Δy)<sup>2</sup>+(Δz)<sup>2</sup>]。若 f 在点 P 处可微，则沿任意方向的方向导数存在，且</p>
          <div class="formula">∂f/∂l = <span class="m">(∂f/∂x)cos α + (∂f/∂y)cos β + (∂f/∂z)cos γ</span></div>
          <p>其中 α、β、γ 为 l 的方向角。<strong>课件例 4</strong>：u = x<sup>2</sup>yz 在 P(1,1,1) 处沿方向 l = {2,−1,3} 的方向导数：cos α = 2/√14、cos β = −1/√14、cos γ = 3/√14，∂u/∂l|<sub>P</sub> = [2xyz·2 − x<sup>2</sup>z·1 + x<sup>2</sup>y·3]/√14|<sub>(1,1,1)</sub> = (4−1+3)/√14 = 6/√14。</p>
          <h3 id="sec-ch9-directional-h2">二、梯度</h3>
          <p>称向量 {∂f/∂x, ∂f/∂y, ∂f/∂z} 为 f 在点 P 处的<strong>梯度</strong>（gradient），记作 grad f：</p>
          <div class="formula">grad f = <span class="m">{∂f/∂x, ∂f/∂y, ∂f/∂z} = (∂f/∂x)i + (∂f/∂y)j + (∂f/∂z)k</span></div>
          <p>二元函数 f(x,y) 的梯度为 grad f = {∂f/∂x, ∂f/∂y} = (∂f/∂x)i + (∂f/∂y)j。方向导数公式可写作 ∂f/∂l = G · l<sub>0</sub>（G 为梯度，l<sub>0</sub> 为 l 方向的单位向量）。</p>
          <div class="callout key">
            <p><strong>梯度的意义</strong>：梯度的方向是 f 的方向导数<strong>取得最大值的方向</strong>；梯度的模是 f 的<strong>最大方向导数</strong>，即 max ∂f/∂l = |grad f|。</p>
          </div>
          <p><strong>课件例 5</strong>：u 是由方程 e<sup>z+u</sup> − xy − yz − zu = 0 确定的 x,y,z 的隐函数，求 u 在 P(1,1,0) 处方向导数的最大值。方程两边求微分得 e<sup>z+u</sup>(dz+du) − (y dx + x dy) − (y dz + z dy) − (z du + u dz) = 0，代入 x=1,y=1,z=0,u=0 得 du|<sub>P</sub> = dx + dy，故 ∂u/∂x|<sub>P</sub> = 1、∂u/∂y|<sub>P</sub> = 1、∂u/∂z|<sub>P</sub> = 0，grad u|<sub>P</sub> = {1,1,0}，最大值为 |grad u| = √2。</p>
          <p><strong>梯度的基本运算公式</strong>（C 为常数，u、v 可微，f 可导）：</p>
          <div class="formula">(1) grad C = <span class="m">0</span>;  (2) grad(Cu) = <span class="m">C grad u</span>;  (3) grad(u ± v) = <span class="m">grad u ± grad v</span></div>
          <div class="formula">(4) grad(uv) = <span class="m">u grad v + v grad u</span>;  (5) grad f(u) = <span class="m">f′(u) grad u</span></div>
          <p><strong>关系小结</strong>：可微 ⇒ 方向导数存在、偏导数存在；但偏导数存在不一定可微、不一定有方向导数（见例 2）。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch9-geometry',
      heading: '8. 多元函数微分学的几何应用',
      blocks: [
        {
          type: 'html',
          html: `
          <p>复习平面曲线的切线与法线：y = f(x) 在 (x<sub>0</sub>,y<sub>0</sub>) 处切线为 y−y<sub>0</sub> = f′(x<sub>0</sub>)(x−x<sub>0</sub>)，法线为 y−y<sub>0</sub> = −[1/f′(x<sub>0</sub>)](x−x<sub>0</sub>)；隐函数 F(x,y) = 0 时 dy/dx = −F<sub>x</sub>/F<sub>y</sub>。</p>
          <h3 id="sec-ch9-geometry-h1">一、空间曲线的切线与法平面</h3>
          <p>过点 M 与切线垂直的平面称为曲线在该点的<strong>法平面</strong>；切线为割线的极限位置。</p>
          <p><strong>1. 参数方程情形</strong>：Γ: x = φ(t), y = ψ(t), z = ω(t)，t = t<sub>0</sub> 对应点 M<sub>0</sub>(x<sub>0</sub>,y<sub>0</sub>,z<sub>0</sub>)，则切向量</p>
          <div class="formula">T = <span class="m">{φ′(t<sub>0</sub>), ψ′(t<sub>0</sub>), ω′(t<sub>0</sub>)}</span></div>
          <p>（三者不全为 0），称 T 为曲线在点 M 的切向量。切线方程为 (x−x<sub>0</sub>)/φ′(t<sub>0</sub>) = (y−y<sub>0</sub>)/ψ′(t<sub>0</sub>) = (z−z<sub>0</sub>)/ω′(t<sub>0</sub>)；法平面方程为</p>
          <div class="formula"><span class="m">φ′(t<sub>0</sub>)(x−x<sub>0</sub>) + ψ′(t<sub>0</sub>)(y−y<sub>0</sub>) + ω′(t<sub>0</sub>)(z−z<sub>0</sub>) = 0</span></div>
          <p>个别导数为 0 时理解为相应分子也为 0。特别地，若 Γ: x = x, y = y(x), z = z(x)，则 T = {1, y′(x), z′(x)}。</p>
          <p><strong>课件例 1</strong>：圆柱螺旋线 x = 3cos θ, y = 3sin θ, z = 2θ，求 θ = π/2 对应点处的切线与法平面。x′ = −3sin θ、y′ = 3cos θ、z′ = 2，θ = π/2 时对应点 M<sub>0</sub>(0,3,π)，切向量 T = {−3,0,2}。切线方程 x/(−3) = (y−3)/0 = (z−π)/2，即 { 2x+3z−3π = 0, y−3 = 0 }；法平面方程 −3x + 2(z−π) = 0，即 3x − 2z + 2π = 0。</p>
          <p><strong>2. 一般式情形</strong>：光滑曲线 Γ 由 F(x,y,z) = 0、G(x,y,z) = 0 交成，设雅可比行列式 J<sub>yz</sub> = ∂(F,G)/∂(y,z)|<sub>M</sub> ≠ 0，则可局部表示 y = y(x)、z = z(x)，在点 M 处切向量为</p>
          <div class="formula">T = <span class="m">{1, dy/dx, dz/dx} = { J<sub>yz</sub>, J<sub>zx</sub>, J<sub>xy</sub> }</span>,  <span class="m">J<sub>zx</sub> = ∂(F,G)/∂(z,x), J<sub>xy</sub> = ∂(F,G)/∂(x,y)</span></div>
          <p>即切向量可取三个雅可比行列式的值（按 J<sub>yz</sub>, J<sub>zx</sub>, J<sub>xy</sub> 排列）。切线方程为 (x−x<sub>0</sub>)/J<sub>yz</sub> = (y−y<sub>0</sub>)/J<sub>zx</sub> = (z−z<sub>0</sub>)/J<sub>xy</sub>；法平面方程为 J<sub>yz</sub>(x−x<sub>0</sub>) + J<sub>zx</sub>(y−y<sub>0</sub>) + J<sub>xy</sub>(z−z<sub>0</sub>) = 0。</p>
          <p><strong>课件例 2</strong>：曲线 x<sup>2</sup>+y<sup>2</sup>+z<sup>2</sup> = 6、x+y+z = 0 在点 M(1,−2,1) 处。令 F = x<sup>2</sup>+y<sup>2</sup>+z<sup>2</sup>−6、G = x+y+z，则 ∂(F,G)/∂(y,z)|<sub>M</sub> = 2(y−z)|<sub>M</sub> = −6，∂(F,G)/∂(z,x)|<sub>M</sub> = 0，∂(F,G)/∂(x,y)|<sub>M</sub> = 6，故切向量 T = {−6,0,6}（即 {1,0,−1} 的倍数）。切线方程 (x−1)/(−6) = (y+2)/0 = (z−1)/6，即 { x+z−2 = 0, y+2 = 0 }；法平面方程 −(x−1) + (z−1) = 0，即 x − z = 0。</p>
          <h3 id="sec-ch9-geometry-h2">二、空间曲面的切平面与法线</h3>
          <p>设光滑曲面 Σ: F(x,y,z) = 0 过定点 M<sub>0</sub>(x<sub>0</sub>,y<sub>0</sub>,z<sub>0</sub>)。可以证明：Σ 上过 M<sub>0</sub> 的任何曲线在 M<sub>0</sub> 处的切线都在同一平面上，此平面称为 Σ 在 M<sub>0</sub> 处的<strong>切平面</strong>。推导：曲线 Γ: x=φ(t), y=ψ(t), z=ω(t) 在 Σ 上有 F(φ(t),ψ(t),ω(t)) ≡ 0，在 t<sub>0</sub> 处求导得 F<sub>x</sub>φ′ + F<sub>y</sub>ψ′ + F<sub>z</sub>ω′ = 0，即曲线切向量 T 与向量 n = {F<sub>x</sub>, F<sub>y</sub>, F<sub>z</sub>}|<sub>M</sub> 垂直。</p>
          <div class="callout key">
            <p><strong>法向量与方程</strong>：n = {∂F/∂x, ∂F/∂y, ∂F/∂z}|<sub>M</sub> 称为曲面在 M 处的法向量（三者不全为 0）。</p>
            <p class="formula">切平面：F<sub>x</sub>(M)(x−x<sub>0</sub>) + F<sub>y</sub>(M)(y−y<sub>0</sub>) + F<sub>z</sub>(M)(z−z<sub>0</sub>) = 0</p>
            <p class="formula">法线：(x−x<sub>0</sub>)/F<sub>x</sub>(M) = (y−y<sub>0</sub>)/F<sub>y</sub>(M) = (z−z<sub>0</sub>)/F<sub>z</sub>(M)</p>
          </div>
          <p>特别地，当曲面方程为显式 z = f(x,y)（令 F = f(x,y) − z）时，在点 M<sub>0</sub>(x<sub>0</sub>,y<sub>0</sub>,z<sub>0</sub>) 处有</p>
          <div class="formula">切平面：<span class="m">z − z<sub>0</sub> = f′<sub>x</sub>(x<sub>0</sub>,y<sub>0</sub>)(x−x<sub>0</sub>) + f′<sub>y</sub>(x<sub>0</sub>,y<sub>0</sub>)(y−y<sub>0</sub>)</span></div>
          <div class="formula">法线：<span class="m">(x−x<sub>0</sub>)/f′<sub>x</sub> = (y−y<sub>0</sub>)/f′<sub>y</sub> = (z−z<sub>0</sub>)/(−1)</span></div>
          <p>课件例 2 的解法 3 正是用此法：两曲面在 M 处法向量 n<sub>1</sub> = {2,−4,2}、n<sub>2</sub> = {1,1,1}，切向量 T = n<sub>1</sub> × n<sub>2</sub> = {−6,0,6}，与前面结果一致。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch9-extreme',
      heading: '9. 多元函数的极值',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ch9-extreme-h1">一、二元函数的极值</h3>
          <p><strong>定义</strong>：若函数 z = f(x,y) 在点 (x<sub>0</sub>,y<sub>0</sub>) 的某去心邻域内有 f(x,y) &lt; f(x<sub>0</sub>,y<sub>0</sub>)（或 &gt;），就称函数在该点取得<strong>极大值（极小值）</strong>，点称为极大值点（极小值点）。极大值与极小值统称极值，极大值点与极小值点统称极值点。</p>
          <p>课件举例：z = x<sup>2</sup> + 4y<sup>2</sup> 在 (0,0) 取极小值；z = −x<sup>2</sup> − y<sup>2</sup> 在 (0,0) 取极大值；z = xy 在 (0,0) 不取极值。</p>
          <div class="callout key">
            <p><strong>定理 1（必要条件）</strong>：设 z = f(x,y) 在点 (x<sub>0</sub>,y<sub>0</sub>) 处可偏导，且在该点取得极值，则 f′<sub>x</sub>(x<sub>0</sub>,y<sub>0</sub>) = 0，f′<sub>y</sub>(x<sub>0</sub>,y<sub>0</sub>) = 0。使偏导数均为 0 的点称为<strong>驻点（稳定点）</strong>。注：驻点未必是极值点，如 z = xy 有驻点 (0,0) 但不取极值。</p>
          </div>
          <p><strong>定理 2（充分条件Ⅰ，了解）</strong>：若 f 在 P<sub>0</sub> 的空心邻域内有一阶连续偏导数且在 P<sub>0</sub> 连续，若在去心邻域内总有 f′<sub>x</sub>(x,y)(x−x<sub>0</sub>) + f′<sub>y</sub>(x,y)(y−y<sub>0</sub>) &gt; 0（或 &lt; 0），则 f 在 P<sub>0</sub> 取极小值（极大值）；若存在从 P<sub>0</sub> 发出的两条射线 l<sub>1</sub>、l<sub>2</sub> 使上式分别取不同符号，则不取极值。</p>
          <div class="callout key">
            <p><strong>定理 3（充分条件Ⅱ）</strong>：设 f 在 P<sub>0</sub>(x<sub>0</sub>,y<sub>0</sub>) 的某邻域内具有二阶连续偏导数，且 f′<sub>x</sub>(x<sub>0</sub>,y<sub>0</sub>) = f′<sub>y</sub>(x<sub>0</sub>,y<sub>0</sub>) = 0。令 A = f″<sub>xx</sub>(P<sub>0</sub>)，B = f″<sub>xy</sub>(P<sub>0</sub>)，C = f″<sub>yy</sub>(P<sub>0</sub>)，则</p>
            <p>⑴ AC − B<sup>2</sup> &gt; 0 时取极值：A &lt; 0 取极大值，A &gt; 0 取极小值；</p>
            <p>⑵ AC − B<sup>2</sup> &lt; 0 时不取极值；</p>
            <p>⑶ AC − B<sup>2</sup> = 0 时不能确定（见例 2）。</p>
          </div>
          <p><strong>课件例 1</strong>：求 f(x,y) = x<sup>3</sup> − y<sup>3</sup> + 3x<sup>2</sup> + 3y<sup>2</sup> − 9x 的极值。解方程组 f′<sub>x</sub> = 3x<sup>2</sup>+6x−9 = 0、f′<sub>y</sub> = −3y<sup>2</sup>+6y = 0，得驻点 (1,0)、(1,2)、(−3,0)、(−3,2)。二阶偏导 A = 6x+6、B = 0、C = −6y+6。列表判别：</p>
          <table class="tbl">
            <thead><tr><th>驻点</th><th>(1,0)</th><th>(1,2)</th><th>(−3,0)</th><th>(−3,2)</th></tr></thead>
            <tbody>
              <tr><td>A / B / C</td><td>12 / 0 / 6</td><td>12 / 0 / −6</td><td>−12 / 0 / 6</td><td>−12 / 0 / −6</td></tr>
              <tr><td>AC−B<sup>2</sup></td><td>72 &gt; 0</td><td>−72 &lt; 0</td><td>−72 &lt; 0</td><td>72 &gt; 0</td></tr>
              <tr><td>结论</td><td>极小值</td><td>不取极值</td><td>不取极值</td><td>极大值</td></tr>
            </tbody>
          </table>
          <p>极小值为 f(1,0) = −5，极大值为 f(−3,2) = 31。</p>
          <p><strong>课件例 2</strong>：讨论 z = (x<sup>2</sup>+y<sup>2</sup>)<sup>2</sup> 与 z = x<sup>3</sup>+y<sup>3</sup> 在 (0,0) 是否取极值。两者均以 (0,0) 为驻点且 AC − B<sup>2</sup> = 0。前者当 (x,y) ≠ (0,0) 时 z = (x<sup>2</sup>+y<sup>2</sup>)<sup>2</sup> &gt; 0 = z(0,0)，故取<strong>极小值</strong>；后者在 (0,0) 任意邻域内可正、可负、可为零（例如取路径 y = 0 与 y = −x），故<strong>不取极值</strong>。</p>
          <h3 id="sec-ch9-extreme-h2">二、条件极值 · 拉格朗日乘数法</h3>
          <p><strong>无条件极值</strong>：自变量在定义域内自由取值；<strong>条件极值</strong>：自变量除在定义域内取值外，还受附加条件 φ(x,y) = 0 限制。两种求法：</p>
          <ul>
            <li><strong>方法 1（化为无条件极值）</strong>：从 φ(x,y) = 0 解出 y = ψ(x)，代入 z = f(x, ψ(x)) 化为一元函数极值。</li>
            <li><strong>方法 2（拉格朗日乘数法）</strong>：令 F(x,y,λ) = f(x,y) + λφ(x,y)（F 称为拉格朗日函数），则极值点必满足方程组 ① F<sub>x</sub> = f<sub>x</sub> + λφ<sub>x</sub> = 0；② F<sub>y</sub> = f<sub>y</sub> + λφ<sub>y</sub> = 0；③ F<sub>λ</sub> = φ = 0。解出 (x<sub>0</sub>,y<sub>0</sub>,λ<sub>0</sub>) 称为拉格朗日稳定点（驻点）。</li>
          </ul>
          <p><strong>解题步骤</strong>：第一步引入拉格朗日函数；第二步解方程组求出所有拉格朗日稳定点；第三步由实际问题判断条件极值的存在性并求出条件极值。当拉格朗日稳定点唯一时，往往根据实际问题的存在性判定在该点取得条件极值。</p>
          <p><strong>课件例 3</strong>：求 f(x,y) = xy 在条件 x+y = 1 下的条件极值。拉格朗日函数 F = xy + λ(x+y−1)，方程组 y+λ = 0、x+λ = 0、x+y−1 = 0 解得唯一稳定点 (1/2, 1/2)，由实际问题知取条件极大值 f(1/2,1/2) = 1/4。</p>
          <p><strong>课件例 4</strong>：要设计容量为 V<sub>0</sub> 的长方体开口水箱，问长、宽、高为何值时用料最省。设长宽高为 x,y,z，目标 S = xy + 2xz + 2yz，约束 xyz = V<sub>0</sub>，令 F = xy + 2xz + 2yz + λ(xyz−V<sub>0</sub>)，解方程组得 x = y = (2V<sub>0</sub>)<sup>1/3</sup>、z = V<sub>0</sub><sup>1/3</sup>/2<sup>2/3</sup>，即长、宽均为 ³√(2V<sub>0</sub>)，高为 ³√(V<sub>0</sub>/4) 时用料最省。</p>
          <h3 id="sec-ch9-extreme-h3">三、最大值与最小值</h3>
          <p>有界闭区域上的连续函数必可取得最值。解题步骤：第一步求出区域内部所有可能的最值点（驻点和不可偏导点）；第二步求出区域边界上所有可能的最值点（用条件极值方法）；第三步计算上述各点函数值并比较得出结论。</p>
          <p><strong>课件例 5</strong>：求 f(x,y) = x<sup>2</sup> − y<sup>2</sup> + 2y 在由上半椭圆 x<sup>2</sup> + y<sup>2</sup>/4 = 1（y ≥ 0）与 x 轴所围闭区域 D 上的最值。内部驻点 (0,1)，f = 1；边界 y = 0（−1 ≤ x ≤ 1）时 z = x<sup>2</sup>，最大点 (±1,0)、最小点 (0,0)；边界上半椭圆上用拉格朗日乘数法得驻点 (0,2) 与 (±√21/5, 4/5)，f(0,2) = 0，f(±√21/5, 4/5) = 9/5。比较得最小值为 f(0,0) = 0，最大值为 f(±√21/5, 4/5) = 9/5。</p>
          <p><strong>推广</strong>：拉格朗日乘数法可推广到多个自变量与多个约束。例如求 u = f(x,y,z) 在条件 φ(x,y,z) = 0、ψ(x,y,z) = 0 下的极值，令 F = f + λφ + μψ，解 F<sub>x</sub> = F<sub>y</sub> = F<sub>z</sub> = F<sub>λ</sub> = F<sub>μ</sub> = 0。<strong>课件例 6</strong>：旋转抛物面 z = x<sup>2</sup>+y<sup>2</sup> 被平面 x+y+z = 1 截成的椭圆到原点的最长、最短距离，即在此二约束下求 d<sup>2</sup> = x<sup>2</sup>+y<sup>2</sup>+z<sup>2</sup> 的条件极值。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch9-exercise',
      heading: '10. 多元函数微分学习题课',
      blocks: [
        {
          type: 'html',
          html: `
          <p>习题课将本章内容归纳为三大板块：</p>
          <h3 id="sec-ch9-exercise-h1">一、基本概念</h3>
          <ul>
            <li>多元函数的定义、极限、连续：定义域及对应规律；判断极限不存在及求极限的方法；函数的连续性及其性质。</li>
            <li>几个基本概念的关系：<strong>连续性、偏导数存在、方向导数存在、可微性</strong>四者之间的蕴含关系（可微 ⇒ 连续与偏导存在；但彼此一般不能互推，参见第 3、4、7 节的反例）。</li>
          </ul>
          <h3 id="sec-ch9-exercise-h2">二、多元函数微分法</h3>
          <ul>
            <li><strong>分析复合结构</strong>：画变量关系图；显式结构与隐式结构；自变量个数 = 变量总个数 − 方程总个数；自变量与因变量由所求对象判定。</li>
            <li><strong>正确使用求导法则</strong>：“分段用乘，分叉用加，单路全导，叉路偏导”；注意正确使用求导符号。</li>
            <li>利用一阶微分形式不变性。</li>
          </ul>
          <h3 id="sec-ch9-exercise-h3">三、典型例题（课件原题与结论）</h3>
          <p><strong>题 1</strong>：设 f(x,y) = xy sin(1/(x<sup>2</sup>+y<sup>2</sup>))（(x,y) ≠ (0,0)，否则 f = 0）。证明：⑴ f′<sub>x</sub>(0,0)、f′<sub>y</sub>(0,0) 存在（均为 0）；⑵ f′<sub>x</sub>(x,y)、f′<sub>y</sub>(x,y) 在点 (0,0) 处不连续；⑶ f 在 (0,0) 处可微。这是“偏导函数不连续但函数仍可微”的典型例子（对应第 4 节定理 3 逆命题不成立）。</p>
          <p><strong>题 2</strong>（梯度的应用）：金属板占据 0 ≤ x ≤ 1、0 ≤ y ≤ 1，温度 T(x,y) = 500xy(1−x)(1−y) + 10（单位 °C），昆虫在点 (1/4, 1/3) 处应沿什么方向尽快逃离到较凉处？由 T′<sub>x</sub> = 500(1−2x)(y−y<sup>2</sup>)、T′<sub>y</sub> = 500(x−x<sup>2</sup>)(1−2y) 得 T′<sub>x</sub>(1/4,1/3) = 500/9、T′<sub>y</sub>(1/4,1/3) = 500/16，故昆虫应沿 −grad T|<sub>(1/4,1/3)</sub> = {−500/9, −500/16} 的方向运动（课件最后一行印为 {−500/9, 500/16}，第二个分量疑漏负号）。</p>
          <p><strong>题 3</strong>：求 f(x,y) = xy(a−x−y)（a ≠ 0）的极值。由 f′<sub>x</sub> = y(a−2x−y) = 0、f′<sub>y</sub> = x(a−x−2y) = 0 得驻点 (0,0)、(a/3,a/3)、(0,a)、(a,0)，再用充分条件判别。</p>
          <p><strong>题 4</strong>（最小二乘法）：设 f(x) = 1/(1+x<sup>2</sup>)，确定常数 a、b 使 ∫<sub>0</sub><sup>1</sup> [ax+b−f(x)]<sup>2</sup>dx 最小。令 F(a,b) 为该积分，由 F′<sub>a</sub> = (2/3)a + b − ln 2 = 0、F′<sub>b</sub> = a + 2b − π/2 = 0 得唯一驻点 a = 6ln 2 − 3π/2、b = π − 3ln 2，再由 F″<sub>aa</sub> &gt; 0 与 F″<sub>aa</sub>F″<sub>bb</sub> − (F″<sub>ab</sub>)<sup>2</sup> &gt; 0 判定为最小值点，即此时积分值最小。</p>
          <p><strong>题 5</strong>：求 f(x,y) = e<sup>−xy</sup> 在闭区域 D = { x<sup>2</sup>+y<sup>2</sup> ≤ 4 } 上的最值。内部驻点 (0,0)，f = 1；边界 x<sup>2</sup>+y<sup>2</sup> = 4 上构造 L = e<sup>−xy</sup>+λ(x<sup>2</sup>+y<sup>2</sup>−4)，得可能极值点 (±√2, ±√2) 等四点，函数值为 e<sup>−2</sup> 或 e<sup>2</sup>；比较得最小值 e<sup>−2</sup>、最大值 e<sup>2</sup>。</p>
          <p><strong>题 6</strong>（隐函数与全导数）：u = f(x,y,z) 有一阶连续偏导数，y = y(x)、z = z(x) 分别由 e<sup>xy</sup>−xy = 0 与 ∫<sub>0</sub><sup>x</sup> (sin t)/t dt − z = 0 确定，用隐函数微分法求出 dy/dx、dz/dx 后代入 du/dx = f′<sub>x</sub> + f′<sub>y</sub>(dy/dx) + f′<sub>z</sub>(dz/dx)。</p>
          <h3 id="sec-ch9-exercise-h4">四、总复习题选讲</h3>
          <ul>
            <li>填空题：曲线 x<sup>2</sup>/2 + y<sup>2</sup>/3 = 12、z = 0 绕 y 轴旋转所得旋转面 2x<sup>2</sup>+3y<sup>2</sup>+2z<sup>2</sup>−12 = 0 在点 (0,√3,√2) 处指向外侧的单位法向量为 {0, 2/√5, 3/√5}。</li>
            <li>选择题：f 在 (0,0) 附近有定义且 f′<sub>x</sub>(0,0) = −3、f′<sub>y</sub>(0,0) = 1，曲线 z = f(x,y)、y = 0 在 (0,0,f(0,0)) 的切向量为 {1,0,−3}（选 C）；注意仅偏导存在不能推出可微与全微分表达式。</li>
            <li>选择题：dz = x dx + y dy ⇒ z = (x<sup>2</sup>+y<sup>2</sup>)/2 + C，故 (0,0) 为极小值点（选 D）。</li>
            <li>选择题：曲线 x=t, y=t<sup>2</sup>, z=t<sup>3</sup> 的切线中与平面 x+2y+z = 4 平行的有两条（t = 1 或 t = 1/3，选 B）。</li>
          </ul>
          <p><strong>综合题</strong>：设 ∂<sup>2</sup>z/∂x<sup>2</sup> − 6∂<sup>2</sup>z/∂x∂y + ∂<sup>2</sup>z/∂y<sup>2</sup> = 0，在变换 ξ = x−2y、η = x+ay 下化简该方程，需用复合函数高阶求导法则确定 a 的值（课件给出按链式法则展开后令混合项系数为零求 a）。</p>
          `,
        },
      ],
    },
  ],
};

export default ch;
