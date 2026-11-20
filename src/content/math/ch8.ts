/* 高等数学 · 第8章 空间解析几何与向量代数 —— 依据课件 D8-1/8-1「向量及其线性运算」、D8-2「向量的乘积」、D8-3「空间曲面」、D8-4「空间曲线」、dsh8-3「空间平面」、dsh8-4「空间直线」及 D8 习题课整理 */
import type { MathChapter } from './types';

const ch: MathChapter = {
  id: 'ch8',
  no: '第8章',
  title: '空间解析几何与向量代数',
  subtitle: '第 8 章 · 空间解析几何与向量代数',
  lede: `
  课件（章名「向量代数与空间解析几何」）把本章分为<strong>向量代数</strong>与<strong>空间解析几何</strong>两部分：
  在三维空间中，空间形式（点、线、面、立体）由数量关系（坐标、方程（组））刻画，基本方法是<strong>坐标法</strong>与<strong>向量法</strong>。
  先建立空间直角坐标系、向量的线性运算与三种乘积，再研究曲面、曲线、平面、直线及其相互关系，最后是习题课。
`,
  toc: [
    { id: 'sec-ch8-vector', text: '1. 向量及其线性运算', level: 2 },
    { id: 'sec-ch8-product', text: '2. 向量的乘积', level: 2 },
    { id: 'sec-ch8-surface', text: '3. 空间曲面与空间曲线', level: 2 },
    { id: 'sec-ch8-plane', text: '4. 空间平面', level: 2 },
    { id: 'sec-ch8-line', text: '5. 空间直线', level: 2 },
    { id: 'sec-ch8-exercise', text: '6. 第 8 章习题课', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ch8-vector',
      heading: '1. 向量及其线性运算',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ch8-vector-h1">一、空间直角坐标系</h3>
          <p>过空间一定点 O，由三条互相垂直的数轴按<strong>右手规则</strong>组成空间直角坐标系：O 为坐标原点，x 轴（横轴）、y 轴（纵轴）、z 轴（竖轴）为坐标轴；每两条坐标轴确定一个<strong>坐标面</strong> xOy、yOz、zOx，三个坐标面将空间分为<strong>八个卦限</strong>。</p>
          <p>空间点 M 与有序数组 (x, y, z) 一一对应，称为点 M 的坐标。特殊点：原点 O(0,0,0)；坐标轴上的点 (x,0,0)、(0,y,0)、(0,0,z)；坐标面上的点 (x,y,0)、(0,y,z)、(x,0,z)。</p>
          <div class="formula">坐标轴：<span class="m">x 轴 ⇔ y = 0, z = 0；y 轴 ⇔ x = 0, z = 0；z 轴 ⇔ x = 0, y = 0</span></div>
          <div class="formula">坐标面：<span class="m">xOy 面 ⇔ z = 0；yOz 面 ⇔ x = 0；zOx 面 ⇔ y = 0</span></div>
          <p>两点 M<sub>1</sub>(x<sub>1</sub>, y<sub>1</sub>, z<sub>1</sub>) 与 M<sub>2</sub>(x<sub>2</sub>, y<sub>2</sub>, z<sub>2</sub>) 之间的<strong>距离公式</strong>：</p>
          <div class="formula">|M<sub>1</sub>M<sub>2</sub>| = <span class="m">√((x<sub>2</sub> − x<sub>1</sub>)<sup>2</sup> + (y<sub>2</sub> − y<sub>1</sub>)<sup>2</sup> + (z<sub>2</sub> − z<sub>1</sub>)<sup>2</sup>)</span></div>
          <p><strong>例 1</strong> 验证以 M<sub>1</sub>(4,3,1)、M<sub>2</sub>(7,1,2)、M<sub>3</sub>(5,2,3) 为顶点的三角形是等腰三角形。</p>
          <p>解：|M<sub>1</sub>M<sub>2</sub>| = √((7−4)<sup>2</sup>+(1−3)<sup>2</sup>+(2−1)<sup>2</sup>) = √14；|M<sub>2</sub>M<sub>3</sub>| = √((5−7)<sup>2</sup>+(2−1)<sup>2</sup>+(3−2)<sup>2</sup>) = √6；|M<sub>1</sub>M<sub>3</sub>| = √((5−4)<sup>2</sup>+(2−3)<sup>2</sup>+(3−1)<sup>2</sup>) = √6。因为 |M<sub>2</sub>M<sub>3</sub>| = |M<sub>1</sub>M<sub>3</sub>|，所以 △M<sub>1</sub>M<sub>2</sub>M<sub>3</sub> 为等腰三角形。</p>
          <p><strong>例 2</strong> 在 z 轴上求与两点 A(−4,1,7) 及 B(3,5,−2) 等距离的点。设该点为 M(0,0,z)，由 |MA| = |MB| 得 √((−4)<sup>2</sup>+1<sup>2</sup>+(7−z)<sup>2</sup>) = √(3<sup>2</sup>+5<sup>2</sup>+(−2−z)<sup>2</sup>)，解得 z = 14/9，故所求点为 M(0,0,14/9)。</p>
          <p><strong>例 3</strong> 求到点 M<sub>0</sub>(x<sub>0</sub>, y<sub>0</sub>, z<sub>0</sub>) 的距离等于常数 R（R &gt; 0）的点 M(x,y,z) 所满足的代数方程。由 |MM<sub>0</sub>| = R 得 (x−x<sub>0</sub>)<sup>2</sup> + (y−y<sub>0</sub>)<sup>2</sup> + (z−z<sub>0</sub>)<sup>2</sup> = R<sup>2</sup>。</p>
          <div class="callout key"><p>这就是<strong>球面方程</strong>：球心 M<sub>0</sub>(x<sub>0</sub>, y<sub>0</sub>, z<sub>0</sub>)，半径 R；当球心在原点时为 x<sup>2</sup> + y<sup>2</sup> + z<sup>2</sup> = R<sup>2</sup>。</p></div>
          <h3 id="sec-ch8-vector-h2">二、向量的几何表示及其线性运算</h3>
          <p><strong>向量</strong>（又称矢量）：既有大小又有方向的量，用有向线段 M<sub>1</sub>M<sub>2</sub> 表示，记为 a 或 |M<sub>1</sub>M<sub>2</sub>|。向量的长度称为<strong>向量的模</strong>，记为 |a|。</p>
          <ul>
            <li><strong>向径</strong>：起点为原点的向量；<strong>自由向量</strong>：与起点无关的向量（平移不改变向量）。</li>
            <li><strong>单位向量</strong>：模为 1 的向量；<strong>零向量</strong>：模为 0 的向量，记为 0，其方向是任意的。</li>
            <li>若两向量大小相等、方向相同则相等；大小相等、方向相反则为负向量；非零向量 a、b 平移至共同起点后所在射线的夹角称为夹角，记为 (a, b) 或 θ（0 ≤ θ ≤ π）。</li>
          </ul>
          <div class="callout warn"><p>规定：θ = 0 或 π 时 a ∥ b（平行）；θ = π/2 时 a ⊥ b（垂直）；<strong>零向量与任何向量既平行又垂直</strong>。</p></div>
          <p><strong>向量在另一向量上的投影</strong>：若 a 与 b 的夹角为 φ，则 a 在 b 上的投影为 (a)<sub>b</sub> = |a|cos φ。投影是一个<strong>实数</strong>，可为正、为负或为零。</p>
          <p><strong>加法</strong>：三角形法则 a + b、平行四边形法则均可用；交换律 a + b = b + a，结合律 (a + b) + c = a + (b + c)，可推广到多个向量相加。<strong>减法</strong>：b − a = b + (−a)。</p>
          <div class="formula">三角不等式：<span class="m">|a + b| ≤ |a| + |b|，|a − b| ≤ |a| + |b|</span></div>
          <p>几何意义：三角形中两边之和大于或等于第三边。</p>
          <p><strong>向量与数的乘法</strong>：λ 是一个数，λa 为新向量。规定 λ &gt; 0 时 λa 与 a 同向、|λa| = λ|a|；λ &lt; 0 时 λa 与 a 反向、|λa| = −λ|a|；λ = 0 时 λa = 0。并有 1a = a，−1a = −a，|λa| = |λ||a|。</p>
          <div class="formula">结合律：<span class="m">λ(μa) = μ(λa) = λμa</span></div>
          <div class="formula">分配律：<span class="m">(λ + μ)a = λa + μa，λ(a + b) = λa + λb</span></div>
          <div class="callout tip"><p>设 a 为非零向量，则存在唯一实数 λ 使 b = λa ⇔ b ∥ a（这是用数乘刻画平行）。</p></div>
          <h3 id="sec-ch8-vector-h3">三、向量的坐标表示、模与方向余弦</h3>
          <p>以 i、j、k 分别表示与 x、y、z 轴正向同向的单位向量。设点 M(x,y,z)，则向量 a = (x<sub>2</sub>−x<sub>1</sub>)i + (y<sub>2</sub>−y<sub>1</sub>)j + (z<sub>2</sub>−z<sub>1</sub>)k = {a<sub>x</sub>, a<sub>y</sub>, a<sub>z</sub>}，其中三个分向量分别是 a 在 x、y、z 轴上的分向量。</p>
          <div class="formula">a ± b = <span class="m">{a<sub>x</sub> ± b<sub>x</sub>, a<sub>y</sub> ± b<sub>y</sub>, a<sub>z</sub> ± b<sub>z</sub>}</span>；λa = <span class="m">{λa<sub>x</sub>, λa<sub>y</sub>, λa<sub>z</sub>}</span></div>
          <div class="formula">b ∥ a（a ≠ 0）⇔ <span class="m">b = λa</span> ⇔ <span class="m">b<sub>x</sub>/a<sub>x</sub> = b<sub>y</sub>/a<sub>y</sub> = b<sub>z</sub>/a<sub>z</sub></span></div>
          <div class="formula">|a| = <span class="m">√(a<sub>x</sub><sup>2</sup> + a<sub>y</sub><sup>2</sup> + a<sub>z</sub><sup>2</sup>)</span>；同向单位向量 a<sup>0</sup> = <span class="m">a / |a| = {a<sub>x</sub>, a<sub>y</sub>, a<sub>z</sub>} / √(a<sub>x</sub><sup>2</sup>+a<sub>y</sub><sup>2</sup>+a<sub>z</sub><sup>2</sup>)</span></div>
          <p><strong>方向角与方向余弦</strong>：非零向量 a 与 x、y、z 轴正向的夹角 α、β、γ 称为方向角，其余弦称为方向余弦。</p>
          <div class="formula">cos α = <span class="m">a<sub>x</sub>/|a|</span>，cos β = <span class="m">a<sub>y</sub>/|a|</span>，cos γ = <span class="m">a<sub>z</sub>/|a|</span></div>
          <div class="formula">a<sup>0</sup> = <span class="m">{cos α, cos β, cos γ}</span>；cos<sup>2</sup> α + cos<sup>2</sup> β + cos<sup>2</sup> γ = <span class="m">1</span></div>
          <p><strong>例 3（课件）</strong> 解线性方程组 5x − 3y = a、3x − 2y = b，其中 a = {2,1,2}，b = {−1,1,−2}。2×① − 3×② 得 x = 2a − 3b = {7,−1,10}；代入②得 y = (3x − b)/2 = {11,−2,16}。</p>
          <p><strong>例 4</strong> 已知 M<sub>1</sub>(2,2,√2) 和 M<sub>2</sub>(1,3,0)，计算向量 M<sub>1</sub>M<sub>2</sub> 的模、方向余弦和方向角：M<sub>1</sub>M<sub>2</sub> = {−1,1,−√2}，|M<sub>1</sub>M<sub>2</sub>| = √((−1)<sup>2</sup>+1<sup>2</sup>+(−√2)<sup>2</sup>) = 2；cos α = −1/2，cos β = 1/2，cos γ = −√2/2；α = 2π/3，β = π/3，γ = 3π/4。</p>
          <p><strong>例 5</strong> 点 A 位于第一卦限，向径 OA 与 x 轴、y 轴正向的夹角依次为 π/3、π/4，且 |OA| = 6，求 A 的坐标。由 cos α = 1/2、cos β = √2/2 得 cos<sup>2</sup> γ = 1 − cos<sup>2</sup> α − cos<sup>2</sup> β = 1/4；因 A 在第一卦限，cos γ = 1/2。于是 OA = |OA|·OA<sup>0</sup> = 6·{1/2, √2/2, 1/2} = {3, 3√2, 3}，故 A(3, 3√2, 3)。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch8-product',
      heading: '2. 向量的乘积',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ch8-product-h1">一、向量的数量积（点积）</h3>
          <p><strong>引例</strong>：物体在常力 F 作用下沿与 F 夹角为 θ 的直线移动位移 s，力所做的功为 W = |F||s|cos θ（即 F 在 s 上的分力 |F|cos θ 乘以位移）。</p>
          <p><strong>定义</strong>：向量 a、b 的夹角为 θ，称 |a||b|cos θ 为 a 与 b 的<strong>数量积</strong>，记为 a · b，即</p>
          <div class="formula">a · b = <span class="m">|a||b|cos θ</span>（结果是一个数）</div>
          <p><strong>性质与运算律</strong>：</p>
          <ul>
            <li>a · a = |a|<sup>2</sup>，记为 a<sup>2</sup> = |a|<sup>2</sup>；</li>
            <li>交换律 a · b = b · a；分配律 a · (b + c) = a · b + a · c；</li>
            <li>结合律 λ(a · b) = (λa) · b = a · (λb)（λ 为实数）；</li>
            <li>a ⊥ b ⇔ a · b = 0。</li>
          </ul>
          <p><strong>坐标表示</strong>：由 i · i = j · j = k · k = 1，i · j = j · k = k · i = 0 得</p>
          <div class="formula">a · b = <span class="m">{a<sub>x</sub>, a<sub>y</sub>, a<sub>z</sub>} · {b<sub>x</sub>, b<sub>y</sub>, b<sub>z</sub>} = a<sub>x</sub>b<sub>x</sub> + a<sub>y</sub>b<sub>y</sub> + a<sub>z</sub>b<sub>z</sub></span></div>
          <div class="formula">cos(a, b) = <span class="m">(a<sub>x</sub>b<sub>x</sub> + a<sub>y</sub>b<sub>y</sub> + a<sub>z</sub>b<sub>z</sub>) / (√(a<sub>x</sub><sup>2</sup>+a<sub>y</sub><sup>2</sup>+a<sub>z</sub><sup>2</sup>) √(b<sub>x</sub><sup>2</sup>+b<sub>y</sub><sup>2</sup>+b<sub>z</sub><sup>2</sup>))</span></div>
          <div class="formula">a ⊥ b ⇔ <span class="m">a<sub>x</sub>b<sub>x</sub> + a<sub>y</sub>b<sub>y</sub> + a<sub>z</sub>b<sub>z</sub> = 0</span></div>
          <p><strong>例 1</strong> 已知 a、b 的夹角 θ = 3π/4，|a| = √2，|b| = 3，求 |a − b|。由 |a−b|<sup>2</sup> = a·a − 2a·b + b·b = |a|<sup>2</sup> − 2|a||b|cos θ + |b|<sup>2</sup> = (√2)<sup>2</sup> − 2·√2·3·cos(3π/4) + 3<sup>2</sup> = 17，故 |a − b| = √17（此例相当于余弦定理）。</p>
          <p><strong>例 2</strong> 设 (a+3b) ⊥ (7a−5b)，(a−4b) ⊥ (7a−2b)，且 |b| = 1，求 a·b、|a| 及夹角 θ。由两垂直条件得 7|a|<sup>2</sup>+16a·b−15|b|<sup>2</sup> = 0、7|a|<sup>2</sup>−30a·b+8|b|<sup>2</sup> = 0；消去 |a|<sup>2</sup> 得 2a·b = 1，即 a·b = 1/2，代回得 |a| = 1，故 cos θ = (a·b)/(|a||b|) = 1/2，θ = π/3。</p>
          <p><strong>例 3</strong> 已知 M(1,1,1)、A(2,2,1)、B(2,1,2)，求 ∠AMB。MA = {1,1,0}，MB = {1,0,1}，cos∠AMB = (MA·MB)/(|MA||MB|) = (1×1+1×0+0×1)/(√2·√2) = 1/2，故 ∠AMB = π/3。</p>
          <h3 id="sec-ch8-product-h2">二、向量的向量积（叉积）</h3>
          <p><strong>引例</strong>：力 F 作用在杠杆的 P 点，对支点 O 的力矩 M = OP × F，其大小 |M| = |OP||F|sin θ，方向垂直于 OP 与 F 且符合右手规则。</p>
          <p><strong>定义 8.2.2</strong>：由 a、b 确定向量 c，满足 (1) |c| = |a||b|sin(a, b)；(2) c 垂直于 a 和 b，且 a、b、c 的方向符合右手法则。称 c 为 a 与 b 的<strong>向量积</strong>（叉积或外积），记为 a × b = c。力矩 M = OP × F；几何上 |a × b| 是以 a、b 为邻边的平行四边形的面积。</p>
          <p><strong>坐标与行列式表示</strong>（a = {a<sub>x</sub>,a<sub>y</sub>,a<sub>z</sub>}，b = {b<sub>x</sub>,b<sub>y</sub>,b<sub>z</sub>}）：</p>
          <div class="formula">a × b = <span class="m">(a<sub>y</sub>b<sub>z</sub> − a<sub>z</sub>b<sub>y</sub>)i + (a<sub>z</sub>b<sub>x</sub> − a<sub>x</sub>b<sub>z</sub>)j + (a<sub>x</sub>b<sub>y</sub> − a<sub>y</sub>b<sub>x</sub>)k</span></div>
          <div class="formula">a × b = <span class="m">| i　j　k ; a<sub>x</sub>　a<sub>y</sub>　a<sub>z</sub> ; b<sub>x</sub>　b<sub>y</sub>　b<sub>z</sub> |</span>（按第一行展开的三阶行列式）</div>
          <ul>
            <li>反交换律 a × b = −b × a；分配律 a × (b + c) = a × b + a × c；</li>
            <li>结合律 (λa) × b = a × (λb) = λ(a × b)（λ 为实数）；</li>
            <li>a ∥ b ⇔ a × b = 0，特别地 a × a = 0。</li>
          </ul>
          <p>单位向量叉积：i × j = k，j × k = i，k × i = j（循环）；反向则取负号。</p>
          <div class="callout tip"><p>求以 a、b 为邻边的平行四边形面积 A = |a × b|；a ∥ b ⇔ a × b = 0 ⇔ a<sub>x</sub>/b<sub>x</sub> = a<sub>y</sub>/b<sub>y</sub> = a<sub>z</sub>/b<sub>z</sub>（a、b 非零）。</p></div>
          <p><strong>例 4</strong> 已知 A(1,2,3)、B(3,4,5)、C(2,4,7)，求三角形 ABC 的面积。S = (1/2)|AB × AC| = (1/2)|4i − 6j + 2k| = (1/2)√(4<sup>2</sup>+(−6)<sup>2</sup>+2<sup>2</sup>) = √14。</p>
          <p><strong>例 5</strong> 求同时垂直于 a = {1,1,1} 和 b = {1,0,−1} 的向量的方向余弦。取 c = a × b = −i + 2j − k = {−1,2,−1}，c<sup>0</sup> = (1/√6){−1,2,−1}；因 c<sup>0</sup> 与 −c<sup>0</sup> 均垂直于 a、b，故 cos α = ∓1/√6，cos β = ±2/√6，cos γ = ∓1/√6（上、下符号对应）。</p>
          <h3 id="sec-ch8-product-h3">三、向量的混合积</h3>
          <p><strong>定义 8.2.3</strong>：称 (a × b) · c 为 a、b、c 的<strong>混合积</strong>，记为 [a b c]，即 [a b c] = (a × b) · c。</p>
          <div class="formula">[a b c] = <span class="m">| a<sub>x</sub>　a<sub>y</sub>　a<sub>z</sub> ; b<sub>x</sub>　b<sub>y</sub>　b<sub>z</sub> ; c<sub>x</sub>　c<sub>y</sub>　c<sub>z</sub> |</span></div>
          <p><strong>几何意义</strong>：以 a、b、c 为相邻三棱的平行六面体，底面积 A = |a × b|，高 h = |c||cos θ|，故体积 V = Sh = |a × b||c||cos θ| = |[a b c]|。</p>
          <ul>
            <li>三个非零向量 a、b、c 共面的充要条件是 [a b c] = 0；</li>
            <li>轮换对称性：[a b c] = [b c a] = [c a b]；交换任意两向量变号，如 [a b c] = −[b a c]。</li>
          </ul>
          <p><strong>例 6</strong> 四面体顶点 A<sub>k</sub>(x<sub>k</sub>, y<sub>k</sub>, z<sub>k</sub>)（k = 1,2,3,4），其体积等于以 A<sub>1</sub>A<sub>2</sub>、A<sub>1</sub>A<sub>3</sub>、A<sub>1</sub>A<sub>4</sub> 为棱的平行六面体体积的 1/6：</p>
          <div class="formula">V = <span class="m">(1/6) |[A<sub>1</sub>A<sub>2</sub> A<sub>1</sub>A<sub>3</sub> A<sub>1</sub>A<sub>4</sub>]| = (1/6) | x<sub>2</sub>−x<sub>1</sub>　y<sub>2</sub>−y<sub>1</sub>　z<sub>2</sub>−z<sub>1</sub> ; x<sub>3</sub>−x<sub>1</sub>　y<sub>3</sub>−y<sub>1</sub>　z<sub>3</sub>−z<sub>1</sub> ; x<sub>4</sub>−x<sub>1</sub>　y<sub>4</sub>−y<sub>1</sub>　z<sub>4</sub>−z<sub>1</sub> |</span></div>
          <p><strong>例 7</strong> 证明 A(1,1,1)、B(4,5,6)、C(2,3,3)、D(10,15,17) 共面。计算 [AB AC AD] = | 3　4　5 ; 1　2　2 ; 9　14　16 | = 0，故四点共面。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch8-surface',
      heading: '3. 空间曲面与空间曲线',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ch8-surface-h1">一、曲面方程的概念</h3>
          <p><strong>引例</strong>：求到 A(1,2,3) 与 B(2,−1,4) 等距离的点 M(x,y,z) 的轨迹方程。由 |AM| = |BM| 得 (x−1)<sup>2</sup>+(y−2)<sup>2</sup>+(z−3)<sup>2</sup> = (x−2)<sup>2</sup>+(y+1)<sup>2</sup>+(z−4)<sup>2</sup>，化简得 2x − 6y + 2z − 7 = 0，轨迹为线段 AB 的垂直平分面。</p>
          <p><strong>定义</strong>：若曲面 S 与方程 F(x,y,z) = 0 满足 (1) S 上任意点的坐标都满足方程；(2) 不在 S 上的点的坐标都不满足方程，则称 F(x,y,z) = 0 为曲面 S 的方程，S 为该方程的图形。两个基本问题：已知曲面求方程；已知方程研究其几何形状（必要时作图）。</p>
          <p><strong>例 1</strong> 球心为 M<sub>0</sub>(x<sub>0</sub>,y<sub>0</sub>,z<sub>0</sub>)、半径为 R 的球面方程为 (x−x<sub>0</sub>)<sup>2</sup> + (y−y<sub>0</sub>)<sup>2</sup> + (z−z<sub>0</sub>)<sup>2</sup> = R<sup>2</sup>；球心在原点时为 x<sup>2</sup>+y<sup>2</sup>+z<sup>2</sup> = R<sup>2</sup>。其中 z = √(R<sup>2</sup>−x<sup>2</sup>−y<sup>2</sup>) 表示上半球面，z = −√(R<sup>2</sup>−x<sup>2</sup>−y<sup>2</sup>) 表示下半球面。</p>
          <h3 id="sec-ch8-surface-h2">二、柱面与旋转曲面</h3>
          <p><strong>柱面</strong>：平行定直线并沿定曲线 C 移动的直线 l 形成的轨迹，C 为准线、l 为母线。例如 x<sup>2</sup>+y<sup>2</sup> = R<sup>2</sup> 在空间表示圆柱面（母线平行 z 轴）：在 xOy 面上是圆 C，过 C 上任一点作平行 z 轴的直线，其上所有点都满足方程。</p>
          <div class="formula">F(x, y) = 0 <span class="m">⇔ 母线平行于 z 轴的柱面（准线为 xOy 面上的曲线）</span></div>
          <div class="formula">G(y, z) = 0 <span class="m">⇔ 母线平行于 x 轴的柱面；H(x, z) = 0 ⇔ 母线平行于 y 轴的柱面</span></div>
          <p>课件举例：x<sup>2</sup> = 2y 表示抛物柱面（母线平行 z 轴，准线为 xOy 面上的抛物线）；x<sup>2</sup>/a<sup>2</sup> + y<sup>2</sup>/b<sup>2</sup> = 1 表示母线平行 z 轴的椭圆柱面；x − y = 0 表示母线平行 z 轴且含 z 轴的平面。</p>
          <p><strong>旋转曲面</strong>：平面曲线绕其平面内一条定直线（旋转轴）旋转一周形成的曲面。yOz 面上曲线 C: f(y,z) = 0 绕 z 轴旋转时，曲面上点 M(x,y,z) 满足 z = z<sub>1</sub>、√(x<sup>2</sup>+y<sup>2</sup>) = |y<sub>1</sub>|，故</p>
          <div class="formula">f(±√(x<sup>2</sup> + y<sup>2</sup>), z) = <span class="m">0</span>（x、y 以 x<sup>2</sup>+y<sup>2</sup> 的整体形式出现）</div>
          <p>绕 y 轴旋转则将 y 保留、把 z 换成 ±√(x<sup>2</sup>+z<sup>2</sup>)。</p>
          <p><strong>例 7</strong> 顶点在原点、旋转轴为 z 轴、半顶角为 α 的圆锥面：yOz 面上直线 L 为 z = y cot α，绕 z 轴得 z = ±√(x<sup>2</sup>+y<sup>2</sup>) cot α。令 a = cot α 并两边平方得 z<sup>2</sup> = a<sup>2</sup>(x<sup>2</sup>+y<sup>2</sup>)；上半圆锥 z = a√(x<sup>2</sup>+y<sup>2</sup>)，下半圆锥 z = −a√(x<sup>2</sup>+y<sup>2</sup>)。</p>
          <p><strong>例 8</strong> xOz 面上的双曲线 x<sup>2</sup>/a<sup>2</sup> − z<sup>2</sup>/c<sup>2</sup> = 1：绕 x 轴旋转得 x<sup>2</sup>/a<sup>2</sup> − (y<sup>2</sup>+z<sup>2</sup>)/c<sup>2</sup> = 1；绕 z 轴旋转得 (x<sup>2</sup>+y<sup>2</sup>)/a<sup>2</sup> − z<sup>2</sup>/c<sup>2</sup> = 1。这两种曲面都称为<strong>旋转双曲面</strong>。</p>
          <h3 id="sec-ch8-surface-h3">三、二次曲面（截痕法）</h3>
          <p>三元二次方程 Ax<sup>2</sup>+By<sup>2</sup>+Cz<sup>2</sup>+Dxy+Eyz+Fxz+Gx+Hy+Iz+J = 0（二次项系数不全为 0）的图形称为二次曲面，适当选取直角坐标系可化为标准方程；研究其特性的基本方法是<strong>截痕法</strong>（用平行坐标面的平面去截，看截痕）。</p>
          <ul>
            <li><strong>椭球面</strong> x<sup>2</sup>/a<sup>2</sup> + y<sup>2</sup>/b<sup>2</sup> + z<sup>2</sup>/c<sup>2</sup> = 1（a,b,c &gt; 0）：范围 |x| ≤ a、|y| ≤ b、|z| ≤ c；与三个坐标面的交线均为椭圆；平面 z = z<sub>1</sub>(|z<sub>1</sub>| &lt; c) 的截痕为椭圆。a = b 时为旋转椭球面，a = b = c 时为球面。</li>
            <li><strong>抛物面</strong>：椭圆抛物面 x<sup>2</sup>/(2p) + y<sup>2</sup>/(2q) = z（p、q 同号，p = q 时为绕 z 轴的旋转抛物面，如 z = x<sup>2</sup>+y<sup>2</sup> 形如碗）；双曲抛物面（鞍形曲面）−x<sup>2</sup>/(2p) + y<sup>2</sup>/(2q) = z（p、q 同号，如 z = x<sup>2</sup>−y<sup>2</sup>、z = xy 形如马鞍）。</li>
            <li><strong>双曲面</strong>：单叶双曲面 x<sup>2</sup>/a<sup>2</sup> + y<sup>2</sup>/b<sup>2</sup> − z<sup>2</sup>/c<sup>2</sup> = 1，平面 z = z<sub>1</sub> 的截痕为椭圆，平面 y = y<sub>1</sub>（|y<sub>1</sub>| &lt; b）的截痕为双曲线、|y<sub>1</sub>| = b 时为两条相交直线、|y<sub>1</sub>| &gt; b 时截痕为实轴平行 z 轴的双曲线；双叶双曲面 x<sup>2</sup>/a<sup>2</sup> + y<sup>2</sup>/b<sup>2</sup> − z<sup>2</sup>/c<sup>2</sup> = −1，平面 y = y<sub>1</sub>、x = x<sub>1</sub> 的截痕为双曲线，平面 z = z<sub>1</sub>(|z<sub>1</sub>| &gt; c) 的截痕为椭圆。</li>
            <li><strong>椭圆锥面</strong> x<sup>2</sup>/a<sup>2</sup> + y<sup>2</sup>/b<sup>2</sup> = z<sup>2</sup>（a,b &gt; 0）：在 z = t 上的截痕为椭圆 x<sup>2</sup>/(at)<sup>2</sup> + y<sup>2</sup>/(bt)<sup>2</sup> = 1；在 x = 0 或 y = 0 上的截痕为过原点的两条直线；椭圆上任一点与原点的连线均在曲面上。a = b 时为圆锥面。</li>
          </ul>
          <h3 id="sec-ch8-surface-h4">四、空间曲线及其方程</h3>
          <p><strong>一般方程</strong>：空间曲线可视为两曲面的交线，L: { F(x,y,z) = 0, G(x,y,z) = 0 }。例如 { x<sup>2</sup>+y<sup>2</sup> = 1, x + 2z = 6 } 表示圆柱面与平面的交线；{ z = √(a<sup>2</sup>−x<sup>2</sup>−y<sup>2</sup>), x<sup>2</sup>+y<sup>2</sup>−ax = 0 } 表示上半球面与圆柱面的交线。注意方程组形式不唯一。</p>
          <p><strong>参数方程</strong>：把曲线 C 上动点坐标写成 x = x(t), y = y(t), z = z(t)。例如<strong>圆柱螺旋线</strong> x = a cos ωt，y = a sin ωt，z = vt；令 θ = ωt、b = v/ω 则 x = a cos θ，y = a sin θ，z = bθ；当 θ = 2π 时上升高度 h = 2πb，称为<strong>螺距</strong>。</p>
          <p><strong>例 1</strong> 将曲线 { x<sup>2</sup>+y<sup>2</sup> = 1, 2x+3z = 6 } 化为参数方程：令 x = cos t、y = sin t，得 z = (6 − 2cos t)/3，故参数方程为 x = cos t，y = sin t，z = (6 − 2cos t)/3（0 ≤ t ≤ 2π）。</p>
          <p><strong>投影曲线</strong>：设 C: { F = 0, G = 0 }，消去 z 得 H(x,y) = 0，则 C 在 xOy 面上的投影曲线为 { H(x,y) = 0, z = 0 }（H = 0 称为投影柱面）；消去 x、y 同理得在 yOz 面、zOx 面上的投影曲线。</p>
          <p>课件例子：C: { x<sup>2</sup>+y<sup>2</sup>+z<sup>2</sup> = 1, x<sup>2</sup>+(y−1)<sup>2</sup>+(z−1)<sup>2</sup> = 1 }，两式相减得 z = 1−y，代回得在 xOy 面上的投影曲线 { x<sup>2</sup>+2y<sup>2</sup>−2y = 0, z = 0 }；同理在 yOz 面、xOz 面上的投影曲线分别为 { y+z = 1, x = 0 }（0 ≤ y ≤ 1）和 { x<sup>2</sup>+2z<sup>2</sup>−2z = 0, y = 0 }。又如 z = √(4−x<sup>2</sup>−y<sup>2</sup>)（上半球面）与 z = √(3(x<sup>2</sup>+y<sup>2</sup>))（上半锥面）所围立体在 xOy 面上的投影区域为 x<sup>2</sup>+y<sup>2</sup> ≤ 1、z = 0。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch8-plane',
      heading: '4. 空间平面',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ch8-plane-h1">一、平面的方程</h3>
          <p><strong>法向量</strong>：垂直于平面 Π 的非零向量 n = {A, B, C} 称为 Π 的法向量。</p>
          <p><strong>点法式</strong>：设平面过点 M<sub>0</sub>(x<sub>0</sub>,y<sub>0</sub>,z<sub>0</sub>)、法向量 n = {A,B,C}，任取 M(x,y,z) ∈ Π，由 M<sub>0</sub>M ⊥ n 即 M<sub>0</sub>M · n = 0 得</p>
          <div class="formula">A(x − x<sub>0</sub>) + B(y − y<sub>0</sub>) + C(z − z<sub>0</sub>) = <span class="m">0</span></div>
          <p>例如过点 M<sub>0</sub>(1,2,−5)、以 n = {2,−3,1} 为法向量的平面为 2(x−1) − 3(y−2) + (z+5) = 0，即 2x − 3y + z + 9 = 0。</p>
          <p><strong>一般式</strong>：记 D = −(Ax<sub>0</sub>+By<sub>0</sub>+Cz<sub>0</sub>)，点法式展开为</p>
          <div class="formula">Ax + By + Cz + D = <span class="m">0（A<sup>2</sup> + B<sup>2</sup> + C<sup>2</sup> ≠ 0）</span></div>
          <p>其法向量 n = {A,B,C}，与点法式等价且可互化。特殊情形：D = 0 表示通过原点；A = 0 表示平行于 x 轴（D = 0 时过 x 轴，D ≠ 0 时平行于 x 轴）；B = 0、C = 0 类似；A = B = 0 即 Cz + D = 0 表示平行于 xOy 面（A = B = D = 0 时 z = 0 即 xOy 坐标面）。</p>
          <p><strong>三点式</strong>：过不共线三点 M<sub>k</sub>(x<sub>k</sub>,y<sub>k</sub>,z<sub>k</sub>)（k = 1,2,3）的平面方程为</p>
          <div class="formula">| x−x<sub>1</sub>　y−y<sub>1</sub>　z−z<sub>1</sub> ; x<sub>2</sub>−x<sub>1</sub>　y<sub>2</sub>−y<sub>1</sub>　z<sub>2</sub>−z<sub>1</sub> ; x<sub>3</sub>−x<sub>1</sub>　y<sub>3</sub>−y<sub>1</sub>　z<sub>3</sub>−z<sub>1</sub> | = <span class="m">0</span></div>
          <p><strong>截距式</strong>：若平面在三坐标轴上的截距为 a、b、c（abc ≠ 0），即过点 P(a,0,0)、Q(0,b,0)、R(0,0,c)，则</p>
          <div class="formula">x/a + y/b + z/c = <span class="m">1</span></div>
          <h3 id="sec-ch8-plane-h2">二、两平面的夹角与位置关系</h3>
          <p>两平面法向量的夹角（不取钝角）称为两平面的夹角。设 Π<sub>1</sub>: A<sub>1</sub>x+B<sub>1</sub>y+C<sub>1</sub>z+D<sub>1</sub> = 0、Π<sub>2</sub>: A<sub>2</sub>x+B<sub>2</sub>y+C<sub>2</sub>z+D<sub>2</sub> = 0，法向量 n<sub>1</sub>、n<sub>2</sub>，则 0 ≤ θ ≤ π/2 且</p>
          <div class="formula">cos θ = <span class="m">|n<sub>1</sub> · n<sub>2</sub>| / (|n<sub>1</sub>||n<sub>2</sub>|) = |A<sub>1</sub>A<sub>2</sub>+B<sub>1</sub>B<sub>2</sub>+C<sub>1</sub>C<sub>2</sub>| / (√(A<sub>1</sub><sup>2</sup>+B<sub>1</sub><sup>2</sup>+C<sub>1</sub><sup>2</sup>) √(A<sub>2</sub><sup>2</sup>+B<sub>2</sub><sup>2</sup>+C<sub>2</sub><sup>2</sup>))</span></div>
          <div class="formula">Π<sub>1</sub> ⊥ Π<sub>2</sub> ⇔ <span class="m">A<sub>1</sub>A<sub>2</sub> + B<sub>1</sub>B<sub>2</sub> + C<sub>1</sub>C<sub>2</sub> = 0</span>；Π<sub>1</sub> ∥ Π<sub>2</sub> ⇔ <span class="m">A<sub>1</sub>/A<sub>2</sub> = B<sub>1</sub>/B<sub>2</sub> = C<sub>1</sub>/C<sub>2</sub></span></div>
          <h3 id="sec-ch8-plane-h3">三、点到平面的距离</h3>
          <p>设平面 π: Ax+By+Cz+D = 0，M<sub>0</sub>(x<sub>0</sub>,y<sub>0</sub>,z<sub>0</sub>) 为平面外一点，在平面上任取一点 M<sub>1</sub>，由 d = |n·M<sub>0</sub>M<sub>1</sub>|/|n| 得</p>
          <div class="formula">d = <span class="m">|Ax<sub>0</sub> + By<sub>0</sub> + Cz<sub>0</sub> + D| / √(A<sup>2</sup> + B<sup>2</sup> + C<sup>2</sup>)</span></div>
          <p>进一步，两平行平面 π<sub>1</sub>: Ax+By+Cz+D<sub>1</sub> = 0 与 π<sub>2</sub>: Ax+By+Cz+D<sub>2</sub> = 0 之间的距离为 d = |D<sub>1</sub> − D<sub>2</sub>| / √(A<sup>2</sup>+B<sup>2</sup>+C<sup>2</sup>)。</p>
          <h3 id="sec-ch8-plane-h4">四、课件例题</h3>
          <p><strong>例 2</strong> 求过 M<sub>1</sub>(2,−1,4)、M<sub>2</sub>(−1,3,−2)、M<sub>3</sub>(0,2,3) 的平面方程。取 n = M<sub>1</sub>M<sub>2</sub> × M<sub>1</sub>M<sub>3</sub> = {14,9,−1}，由点法式 14(x−2)+9(y+1)−(z−4) = 0，即 14x + 9y − z − 15 = 0（也可写成三点式行列式）。</p>
          <p><strong>例 3</strong> 求通过 x 轴和点 (4,−3,−1) 的平面方程。因过 x 轴，A = D = 0，设 By + Cz = 0；代入点得 C = −3B，故所求平面为 y − 3z = 0。</p>
          <p><strong>例 4</strong> 一平面通过 M<sub>1</sub>(1,1,1) 和 M<sub>2</sub>(0,1,−1)，且垂直于平面 Π: x+y+z = 0。设所求平面为 Ax+By+Cz+D = 0，代入两点及垂直条件 A+B+C = 0，解得 A:B:C:D = (−2):1:1:0，故 −2x+y+z = 0，即 2x − y − z = 0。</p>
          <p><strong>例 6</strong> 求过点 (1,1,1) 且垂直于两平面 x−y+z = 7 和 3x+2y−12z+5 = 0 的平面方程。两已知平面法向量为 n<sub>1</sub> = {1,−1,1}、n<sub>2</sub> = {3,2,−12}，取 n = n<sub>1</sub> × n<sub>2</sub> = {10,15,5}，则 10(x−1)+15(y−1)+5(z−1) = 0，化简得 2x + 3y + z − 6 = 0。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch8-line',
      heading: '5. 空间直线',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ch8-line-h1">一、空间直线的方程</h3>
          <p><strong>一般方程</strong>：直线可视为两平面的交线，L: { A<sub>1</sub>x+B<sub>1</sub>y+C<sub>1</sub>z+D<sub>1</sub> = 0, A<sub>2</sub>x+B<sub>2</sub>y+C<sub>2</sub>z+D<sub>2</sub> = 0 }（方程组形式不唯一）。</p>
          <p><strong>对称式（点向式）</strong>：已知直线过点 M<sub>0</sub>(x<sub>0</sub>,y<sub>0</sub>,z<sub>0</sub>) 且平行于非零向量 s = {m,n,p}（称为直线的<strong>方向向量</strong>），任取 M(x,y,z) ∈ L，由 M<sub>0</sub>M ∥ s 得</p>
          <div class="formula">(x − x<sub>0</sub>)/m = <span class="m">(y − y<sub>0</sub>)/n = (z − z<sub>0</sub>)/p</span></div>
          <p>说明：某些分母为零时其分子也理解为零，例如 m = n = 0、p ≠ 0 时直线方程为 x = x<sub>0</sub>，y = y<sub>0</sub>。</p>
          <p><strong>参数式</strong>：令上式为 t，得 x = x<sub>0</sub> + mt，y = y<sub>0</sub> + nt，z = z<sub>0</sub> + pt（−∞ &lt; t &lt; +∞）。对称式与参数式可方便互化，且均不唯一。</p>
          <p><strong>例 2</strong> 用对称式及参数方程表示直线 { x+y+z+1 = 0, 2x−y+3z+4 = 0 }。令 y = 0 解得 x = 1、z = −2，得直线上一点 (1,0,−2)；两平面法向量 n<sub>1</sub> = {1,1,1}、n<sub>2</sub> = {2,−1,3}，取 s = n<sub>1</sub> × n<sub>2</sub> = {4,−1,−3}。故对称式为 (x−1)/4 = y/(−1) = (z+2)/(−3)，参数式为 x = 1+4t，y = −t，z = −2−3t。</p>
          <h3 id="sec-ch8-line-h2">二、两直线的夹角、直线与平面的夹角</h3>
          <p><strong>两直线的夹角</strong>指其方向向量的夹角（不取钝角）。设 L<sub>1</sub>、L<sub>2</sub> 的方向向量 s<sub>1</sub> = {m<sub>1</sub>,n<sub>1</sub>,p<sub>1</sub>}、s<sub>2</sub> = {m<sub>2</sub>,n<sub>2</sub>,p<sub>2</sub>}，则</p>
          <div class="formula">cos φ = <span class="m">|s<sub>1</sub> · s<sub>2</sub>| / (|s<sub>1</sub>||s<sub>2</sub>|) = |m<sub>1</sub>m<sub>2</sub>+n<sub>1</sub>n<sub>2</sub>+p<sub>1</sub>p<sub>2</sub>| / (√(m<sub>1</sub><sup>2</sup>+n<sub>1</sub><sup>2</sup>+p<sub>1</sub><sup>2</sup>) √(m<sub>2</sub><sup>2</sup>+n<sub>2</sub><sup>2</sup>+p<sub>2</sub><sup>2</sup>))</span></div>
          <div class="formula">L<sub>1</sub> ⊥ L<sub>2</sub> ⇔ <span class="m">m<sub>1</sub>m<sub>2</sub>+n<sub>1</sub>n<sub>2</sub>+p<sub>1</sub>p<sub>2</sub> = 0</span>；L<sub>1</sub> ∥ L<sub>2</sub> ⇔ <span class="m">m<sub>1</sub>/m<sub>2</sub> = n<sub>1</sub>/n<sub>2</sub> = p<sub>1</sub>/p<sub>2</sub></span></div>
          <p><strong>例 3</strong> 求两直线 L<sub>1</sub>: (x−1)/1 = y/(−4) = (z+3)/1 与 L<sub>2</sub>: { x+y+2 = 0, x+2z = 0 } 的夹角。取 s<sub>1</sub> = {1,−4,1}，s<sub>2</sub> = {2,−2,−1}（由 L<sub>2</sub> 两平面法向量叉乘），cos φ = |1×2+(−4)×(−2)+1×(−1)|/(√18·3) = √2/2，故 φ = π/4。</p>
          <p><strong>直线与平面的夹角</strong>：设直线 L 的方向向量 s = {m,n,p}、平面 Π 的法向量 n = {A,B,C}，s 与 n 的夹角 θ 不取钝角，则直线与平面的夹角 φ = π/2 − θ，故</p>
          <div class="formula">sin φ = cos θ = <span class="m">|s · n| / (|s||n|) = |Am+Bn+Cp| / (√(m<sup>2</sup>+n<sup>2</sup>+p<sup>2</sup>) √(A<sup>2</sup>+B<sup>2</sup>+C<sup>2</sup>))</span></div>
          <div class="formula">φ = <span class="m">arcsin ( |s · n| / (|s||n|) )</span></div>
          <div class="callout key"><p>L ⊥ Π ⇔ s ∥ n ⇔ A/m = B/n = C/p；L ∥ Π ⇔ s ⊥ n ⇔ Am + Bn + Cp = 0（直线在平面上时也满足后者）。</p></div>
          <p><strong>例 4</strong> 求过点 (1,−2,4) 且与平面 2x−3y+z−4 = 0 垂直的直线方程：取平面法向量 {2,−3,1} 为方向向量，对称式为 (x−1)/2 = (y+2)/(−3) = (z−4)/1。</p>
          <p>点到直线的距离：设点 M<sub>0</sub>(x<sub>0</sub>,y<sub>0</sub>,z<sub>0</sub>)、直线 L: (x−x<sub>1</sub>)/m = (y−y<sub>1</sub>)/n = (z−z<sub>1</sub>)/p，取 L 上一点 M<sub>1</sub>、方向向量 s = {m,n,p}，则 d = |M<sub>0</sub>M<sub>1</sub> × s| / |s|，即</p>
          <div class="formula">d = <span class="m">(1/√(m<sup>2</sup>+n<sup>2</sup>+p<sup>2</sup>)) · | x<sub>1</sub>−x<sub>0</sub>　y<sub>1</sub>−y<sub>0</sub>　z<sub>1</sub>−z<sub>0</sub> ; m　n　p |</span></div>
          <p><strong>例 5</strong> 直线 L: (x+3)/(−2) = (y+4)/(−7) = z/3 与平面 π: 4x−2y−2z = 3 的关系是（A）平行且无交点：s = {−2,−7,3}，n = {4,−2,−2}，s 与 n 不平行排除垂直；s·n = (−2)×4 + (−7)×(−2) + 3×(−2) = 0 排除相交不垂直；而 L 上一点 (−3,−4,0) 不在 π 上，故选（A）。</p>
          <h3 id="sec-ch8-line-h3">三、平面束方程</h3>
          <p>过直线 L 的全体平面称为过 L 的<strong>平面束</strong>。设 L 的一般方程为 { A<sub>1</sub>x+B<sub>1</sub>y+C<sub>1</sub>z+D<sub>1</sub> = 0, A<sub>2</sub>x+B<sub>2</sub>y+C<sub>2</sub>z+D<sub>2</sub> = 0 }（两法向量不成比例），作含参数 λ、μ（不同时为零）的方程</p>
          <div class="formula">λ(A<sub>1</sub>x+B<sub>1</sub>y+C<sub>1</sub>z+D<sub>1</sub>) + <span class="m">μ(A<sub>2</sub>x+B<sub>2</sub>y+C<sub>2</sub>z+D<sub>2</sub>) = 0</span></div>
          <p>当 λ、μ 任意变化时可得过 L 的任一平面；也常用单参数形式 (A<sub>1</sub>x+B<sub>1</sub>y+C<sub>1</sub>z+D<sub>1</sub>) + λ(A<sub>2</sub>x+B<sub>2</sub>y+C<sub>2</sub>z+D<sub>2</sub>) = 0，它少了第二个平面本身。</p>
          <p><strong>例 7</strong> 求直线 L: { x+y−z−1 = 0, x−y+z+1 = 0 } 与平面 π: x+y+z = 0 的夹角 φ 及 L 在 π 上的投影直线 L<sub>1</sub>。取 s = {0,−2,−2}、n = {1,1,1}，φ = arcsin(|s·n|/(|s||n|)) = arcsin(4/(√8·√3)) = arcsin(√6/3)。再作过 L 的平面束 x+y−z−1 + λ(x−y+z+1) = 0，其法向量 {1+λ, 1−λ, −1+λ} 与 n 垂直：(1+λ)+(1−λ)+(−1+λ) = 0 得 λ = −1，故投影平面 y−z−1 = 0，投影直线 L<sub>1</sub>: { y−z−1 = 0, x+y+z = 0 }。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch8-exercise',
      heading: '6. 第 8 章习题课',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ch8-exercise-h1">一、内容小结</h3>
          <table class="tbl">
            <thead><tr><th>对象</th><th>方程/公式</th></tr></thead>
            <tbody>
              <tr><td>平面 · 一般式</td><td>Ax + By + Cz + D = 0（A<sup>2</sup>+B<sup>2</sup>+C<sup>2</sup> ≠ 0）</td></tr>
              <tr><td>平面 · 点法式</td><td>A(x−x<sub>0</sub>) + B(y−y<sub>0</sub>) + C(z−z<sub>0</sub>) = 0；点 (x<sub>0</sub>,y<sub>0</sub>,z<sub>0</sub>)，法向量 n = (A,B,C)</td></tr>
              <tr><td>平面 · 截距式</td><td>x/a + y/b + z/c = 1（abc ≠ 0）</td></tr>
              <tr><td>平面 · 三点式</td><td>| x−x<sub>1</sub>　y−y<sub>1</sub>　z−z<sub>1</sub> ; x<sub>2</sub>−x<sub>1</sub>　y<sub>2</sub>−y<sub>1</sub>　z<sub>2</sub>−z<sub>1</sub> ; x<sub>3</sub>−x<sub>1</sub>　y<sub>3</sub>−y<sub>1</sub>　z<sub>3</sub>−z<sub>1</sub> | = 0</td></tr>
              <tr><td>直线 · 一般式</td><td>{ A<sub>1</sub>x+B<sub>1</sub>y+C<sub>1</sub>z+D<sub>1</sub> = 0, A<sub>2</sub>x+B<sub>2</sub>y+C<sub>2</sub>z+D<sub>2</sub> = 0 }</td></tr>
              <tr><td>直线 · 对称式</td><td>(x−x<sub>0</sub>)/m = (y−y<sub>0</sub>)/n = (z−z<sub>0</sub>)/p；点 (x<sub>0</sub>,y<sub>0</sub>,z<sub>0</sub>)，方向向量 s = (m,n,p)</td></tr>
              <tr><td>直线 · 参数式</td><td>x = x<sub>0</sub>+mt，y = y<sub>0</sub>+nt，z = z<sub>0</sub>+pt</td></tr>
              <tr><td>面面 / 线线夹角</td><td>cos φ = |n<sub>1</sub>·n<sub>2</sub>|/(|n<sub>1</sub>||n<sub>2</sub>|)；cos φ = |s<sub>1</sub>·s<sub>2</sub>|/(|s<sub>1</sub>||s<sub>2</sub>|)</td></tr>
              <tr><td>线面夹角</td><td>sin φ = |s·n|/(|s||n|)</td></tr>
              <tr><td>点到平面 / 点到直线</td><td>d = |Ax<sub>0</sub>+By<sub>0</sub>+Cz<sub>0</sub>+D|/√(A<sup>2</sup>+B<sup>2</sup>+C<sup>2</sup>)；d = |M<sub>0</sub>M<sub>1</sub> × s|/|s|</td></tr>
              <tr><td>平面束</td><td>(A<sub>1</sub>x+B<sub>1</sub>y+C<sub>1</sub>z+D<sub>1</sub>) + λ(A<sub>2</sub>x+B<sub>2</sub>y+C<sub>2</sub>z+D<sub>2</sub>) = 0</td></tr>
            </tbody>
          </table>
          <div class="callout key"><p>面面、线线：垂直 ⇔ 对应的法向量（方向向量）点积为 0；平行 ⇔ 对应向量叉积为 0（或坐标成比例）。线面：垂直 ⇔ s ∥ n；平行 ⇔ s ⊥ n。</p></div>
          <h3 id="sec-ch8-exercise-h2">二、实例分析（课件例题的题目与结论）</h3>
          <p><strong>例 1</strong> 求与两平面 x−4z = 3 和 2x−y−5z = 1 的交线平行、且过点 (−3,2,5) 的直线方程。取 s = n<sub>1</sub> × n<sub>2</sub> = {−4,−3,−1}，由点向式得 (x+3)/4 = (y−2)/3 = (z−5)/1。</p>
          <p><strong>例 2</strong> 求直线 (x−2)/1 = (y−3)/1 = (z−4)/2 与平面 2x+y+z−6 = 0 的交点。化为参数式 x = 2+t, y = 3+t, z = 4+2t，代入平面得 t = −1，交点为 (1,2,2)。</p>
          <p><strong>例 3</strong> 求过点 (2,1,3) 且与直线 (x+1)/3 = (y−1)/2 = z/(−1) 垂直相交的直线方程。过已知点且垂直于已知直线的平面法向量为 (3,2,−1)，方程 3(x−2)+2(y−1)−(z−3) = 0；与已知直线联立得交点 P(2/7, 13/7, −3/7)，由两点式得所求直线 (x−2)/2 = (y−1)/(−1) = (z−3)/4。</p>
          <p><strong>例 4</strong> 求直线 { x+y−z−1 = 0, x−y+z+1 = 0 } 在平面 x+y+z = 0 上的投影直线方程。过该直线的平面束 x+y−z−1 + λ(x−y+z+1) = 0，令其法向量与已知平面法向量垂直得 λ = −1，投影平面为 y−z−1 = 0，故投影直线为 { y−z−1 = 0, x+y+z = 0 }。</p>
          <p><strong>例 5</strong> 设一平面平行于已知直线 { 2x−z = 0, x+y−z+5 = 0 } 且垂直于平面 7x−y+4z−3 = 0，求该平面法线的方向余弦。已知平面法向量 n<sub>1</sub> = (7,−1,4)，直线方向向量 s = (1,1,2)，取所求平面法向量 n = s × n<sub>1</sub> = 2(3,5,−4)，故 cos α = 3/√50，cos β = 5/√50，cos γ = −4/√50。</p>
          <p><strong>例 6</strong> 求过直线 L: { x+5y+z = 0, x−z+4 = 0 } 且与平面 x−4y−8z+12 = 0 夹成 π/4 角的平面方程。过 L 的平面束 (1+λ)x + 5y + (1−λ)z + 4λ = 0，法向量 (1+λ,5,1−λ)；由 cos(π/4) = |n·n<sub>1</sub>|/(|n||n<sub>1</sub>|) 得 λ = −3/4，得平面 x+20y+7z−12 = 0；又平面 x−z+4 = 0 也满足题意，故两者均为所求。</p>
          <p><strong>例 7</strong> 求过点 M<sub>0</sub>(1,1,1) 且与两直线 L<sub>1</sub>: { y = 2x, z = x−1 }、L<sub>2</sub>: { y = 3x−4, z = 2x−1 } 都相交的直线 L。思路：先化 L<sub>1</sub>: x = t, y = 2t, z = t−1；L<sub>2</sub>: x = t, y = 3t−4, z = 2t−1，设交点 M<sub>1</sub>(t<sub>1</sub>,2t<sub>1</sub>,t<sub>1</sub>−1)、M<sub>2</sub>(t<sub>2</sub>,3t<sub>2</sub>−4,2t<sub>2</sub>−1)，由 M<sub>0</sub>M<sub>1</sub> ∥ M<sub>0</sub>M<sub>2</sub>（三点共线）解得 t<sub>1</sub> = 0、t<sub>2</sub> = 2，故 M<sub>1</sub>(0,0,−1)、M<sub>2</sub>(2,2,3)，所求直线 L: (x−1)/1 = (y−1)/1 = (z−1)/2。</p>
          <p><strong>例 8</strong> 直线 L: (x−1)/0 = y/1 = z/1 绕 z 轴旋转一周，求旋转曲面方程。在 L 上任取 M<sub>0</sub>(1,y<sub>0</sub>,z<sub>0</sub>)，轨迹上点 M(x,y,z) 满足 z = z<sub>0</sub> = y<sub>0</sub>、x<sup>2</sup>+y<sup>2</sup> = 1+y<sub>0</sub><sup>2</sup>；代入 y<sub>0</sub> = z 得旋转曲面方程 x<sup>2</sup> + y<sup>2</sup> − z<sup>2</sup> = 1。</p>
          <div class="callout tip"><p>习题课还安排「画出下列各曲面所围图形」的思考与练习（课件给出图形解答），练习把柱面、旋转曲面与二次曲面的截痕分析综合起来。</p></div>
          `,
        },
      ],
    },
  ],
};

export default ch;
