/* 高等数学 · 第 13 章 无穷级数 —— 依据课件 D13-1、D13-2、D13-3、D13-4、D13-5、D13-7 整理 */
import type { MathChapter } from './types';

const ch: MathChapter = {
  id: 'ch13',
  no: '第13章',
  title: '无穷级数',
  subtitle: '第 13 章 · 无穷级数',
  lede: `
  无穷级数是表示函数、研究函数性质与进行数值计算的重要工具，分为<strong>常数项级数</strong>、<strong>幂级数</strong>与<strong>傅里叶（傅氏）级数</strong>三大块。
  本章先建立常数项级数收敛的概念与性质，再给出正项级数的各类审敛法与任意项级数的绝对/条件收敛判别；
  然后讨论幂级数的收敛域、运算与和函数、函数展开成幂级数，最后介绍三角函数系正交性与傅里叶展开（含周期为 2l 的一般情形）。
`,
  toc: [
    { id: 'sec-ch13-series-basic', text: '1. 常数项级数的概念及其性质', level: 2 },
    { id: 'sec-ch13-positive', text: '2. 正项级数及其审敛法', level: 2 },
    { id: 'sec-ch13-absolute', text: '3. 级数的绝对收敛与条件收敛', level: 2 },
    { id: 'sec-ch13-power', text: '4. 幂级数', level: 2 },
    { id: 'sec-ch13-expand', text: '5. 函数的幂级数展开式', level: 2 },
    { id: 'sec-ch13-fourier', text: '6. 傅里叶级数', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ch13-series-basic',
      heading: '1. 常数项级数的概念及其性质',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>引例 1</strong>：用圆内接正多边形面积逼近圆面积。依次作圆内接正 3·2<sup>k</sup> 边形，设 a₀ 表示内接正三角形面积，a<sub>k</sub> 表示边数增加时增加的面积，则圆内接正多边形面积 a₀ + a₁ + a₂ + … + a<sub>n</sub> 逼近圆的面积 A。</p>
          <p><strong>引例 2（神秘的康托尔尘集）</strong>：把 [0,1] 区间三等分，舍弃中间开区间，再把剩下的两个子区间分别三等分并舍弃中间开区间，如此反复。丢弃的各开区间长依次为 1/3, 2/9, 2/27, …, (2/3)(1/3)<sup>n−1</sup>, …，故丢弃部分总长</p>
          <div class="formula">l<sub>丢</sub> = (1/3) + (2/9) + (2/27) + … = 1，剩余部分总长 l<sub>剩</sub> = 1 − l<sub>丢</sub> = 0</div>
          <p>剩余部分长度虽为 0，但康托尔证明其成员和实数「一样多」，它们像尘埃一样散落在 [0,1] 上，故称康托尔尘集。</p>
          <div class="callout key">
            <p><strong>定义</strong>：给定数列 u₁, u₂, …, u<sub>n</sub>, …，将各项依次相加简记为 ∑<sub>n=1</sub><sup>∞</sup> u<sub>n</sub> = u₁ + u₂ + u₃ + … + u<sub>n</sub> + …，称为<strong>常数项级数</strong>（或无穷级数）。第 n 项 u<sub>n</sub> 叫级数的<strong>一般项</strong>，前 n 项和 S<sub>n</sub> = ∑<sub>k=1</sub><sup>n</sup> u<sub>k</sub> 称为级数的<strong>部分和</strong>。</p>
            <p>若 lim<sub>n→∞</sub> S<sub>n</sub> = S 存在，则称级数<strong>收敛</strong>，S 称为级数的<strong>和</strong>，记作 ∑u<sub>n</sub> = S；若 lim S<sub>n</sub> 不存在，则称级数<strong>发散</strong>。收敛时称差值 r<sub>n</sub> = S − S<sub>n</sub> = u<sub>n+1</sub> + u<sub>n+2</sub> + … 为级数的<strong>余项</strong>，显然 lim<sub>n→∞</sub> r<sub>n</sub> = 0。</p>
          </div>
          <p><strong>例 1</strong>　讨论等比级数（几何级数）∑<sub>n=0</sub><sup>∞</sup> aq<sup>n</sup> = a + aq + aq² + …（a ≠ 0，q 为公比）的敛散性。</p>
          <p>解：q ≠ 1 时部分和 S<sub>n</sub> = (a − aq<sup>n</sup>)/(1 − q)。|q| &lt; 1 时 lim q<sup>n</sup> = 0，故 lim S<sub>n</sub> = a/(1−q)，级数收敛且和为 a/(1−q)；|q| &gt; 1 时 lim q<sup>n</sup> = ∞，级数发散。q = 1 时 S<sub>n</sub> = na → ∞，发散；q = −1 时 S<sub>n</sub> 在 a 与 0 之间振荡、极限不存在，发散。综上：<strong>|q| &lt; 1 收敛，|q| ≥ 1 发散</strong>。</p>
          <p><strong>例 2</strong>　判别敛散性：(1) ∑ ln((n+1)/n)，S<sub>n</sub> = ln(n+1) → ∞，发散；(2) ∑ 1/[n(n+1)] = ∑(1/n − 1/(n+1))，S<sub>n</sub> = 1 − 1/(n+1) → 1，收敛且和为 1。技巧：利用「拆项相消」求和。</p>
          <p><strong>例 3</strong>　判别 ∑<sub>n=2</sub><sup>∞</sup> ln(1 − 1/n²)。由 ln(1−1/n²) = ln(n+1) + ln(n−1) − 2 ln n，部分和 S<sub>n</sub> = −ln 2 + ln(n+1) − ln n = ln(1+1/n) − ln 2 → −ln 2，故级数收敛、和为 −ln 2。</p>
          <p><strong>例 4</strong>　证明调和级数 ∑ 1/n 发散。反证法：假设收敛于 s，则 lim(S<sub>2n</sub> − S<sub>n</sub>) = 0；但 S<sub>2n</sub> − S<sub>n</sub> = 1/(n+1) + … + 1/(2n) ≥ n·(1/(2n)) = 1/2，由极限保号性得 lim(S<sub>2n</sub>−S<sub>n</sub>) ≥ 1/2，矛盾。注：等比级数、调和级数的敛散性结论以后可直接引用。</p>
          `,
        },
        {
          type: 'html',
          html: `
          <h3 id="sec-ch13-series-basic-props">二、无穷级数的基本性质</h3>
          <div class="formula">性质 1（线性·数乘）：若 ∑u<sub>n</sub> 收敛于 S，则 ∑cu<sub>n</sub> 也收敛，且和为 cS</div>
          <p>说明：级数各项乘以非零常数后其<strong>敛散性不变</strong>。</p>
          <div class="formula">性质 2（线性·加减）：若 ∑u<sub>n</sub> = S、∑v<sub>n</sub> = σ 都收敛，则 ∑(u<sub>n</sub> ± v<sub>n</sub>) 收敛，且和为 S ± σ</div>
          <p>说明：(1) 收敛级数可逐项相加或相减；(2) 若两级数一个收敛一个发散，则 ∑(u<sub>n</sub> ± v<sub>n</sub>) 必发散（反证法）；但若两级数都发散，∑(u<sub>n</sub> ± v<sub>n</sub>) 不一定发散，例如 u<sub>n</sub> = 2n−1、v<sub>n</sub> = 1−2n 都发散，而 u<sub>n</sub>+v<sub>n</sub> = 0 收敛。</p>
          <div class="formula">性质 3（调整不变性）：增加、删除或改变级数前有限项，不会影响级数的敛散性</div>
          <p>若原级数收敛于 S，去掉前 k 项所得新级数的和为 S − S<sub>k</sub>。</p>
          <div class="formula">性质 4（加括弧）：收敛级数加括弧后所成的级数仍收敛于原级数的和</div>
          <p>推论：若加括弧后的级数发散，则原级数必发散。注意：<strong>收敛级数去括弧后所成的级数不一定收敛</strong>，例如 (1−1)+(1−1)+… = 0 收敛，但 1−1+1−1+… 发散。<strong>例 5</strong> 即利用加括号后级数发散判定原级数发散。</p>
          <h3 id="sec-ch13-series-basic-nec">三、级数收敛的必要条件</h3>
          <div class="callout key">
            <p><strong>定理</strong>：设收敛级数 S = ∑u<sub>n</sub>，则必有 lim<sub>n→∞</sub> u<sub>n</sub> = 0。</p>
            <p>证：u<sub>n</sub> = S<sub>n</sub> − S<sub>n−1</sub>，故 lim u<sub>n</sub> = lim S<sub>n</sub> − lim S<sub>n−1</sub> = S − S = 0。</p>
          </div>
          <p>可见：若级数的一般项不趋于 0，则级数必发散。例如 1/2 − 2/3 + 3/4 − 4/5 + …，其一般项 u<sub>n</sub> = (−1)<sup>n−1</sup> n/(n+1) 不趋于 0，故发散。<strong>注意</strong>：lim u<sub>n</sub> = 0 <strong>并非</strong>级数收敛的充分条件——调和级数虽然 lim 1/n = 0，但仍发散。</p>
          <p><strong>例 6</strong>　判别敛散性，若收敛求和：(1) ∑[1/3<sup>n</sup> + (−1)<sup>n−1</sup> 3/2<sup>n−1</sup>]；等比级数 ∑1/3<sup>n</sup> 收敛于 (1/3)/(1−1/3) = 1/2，∑(−1)<sup>n−1</sup>3/2<sup>n−1</sup> = 3∑(−1/2)<sup>n−1</sup> 收敛于 3/(1+1/2) = 2，由性质 2 知原级数收敛、和为 1/2 + 2 = 5/2。(2) ∑[3/((n+1)(n+2)) + (1+1/n)<sup>−n</sup>]：前者收敛（拆项相消），后者一般项 (1+1/n)<sup>−n</sup> → 1/e ≠ 0 故发散，由性质 2 知原级数发散。</p>
          <p><strong>内容小结</strong>：定义（部分和、收敛/发散、和）；性质（线性运算、调整不变性、加括弧）；必要条件 lim u<sub>n</sub> = 0。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch13-positive',
      heading: '2. 正项级数及其审敛法',
      blocks: [
        {
          type: 'html',
          html: `
          <p>若 u<sub>n</sub> ≥ 0，则称 ∑u<sub>n</sub> 为<strong>正项级数</strong>。</p>
          <div class="callout key">
            <p><strong>定理 1（基本定理）</strong>：正项级数 ∑u<sub>n</sub> 收敛 <strong>⟺</strong> 部分和序列 S<sub>n</sub> 有界。</p>
            <p>证：收敛 ⇒ {S<sub>n</sub>} 收敛 ⇒ 有界；反之 u<sub>n</sub> ≥ 0 ⇒ {S<sub>n</sub>} 单调递增，又有界，故 {S<sub>n</sub>} 收敛，从而级数收敛。</p>
          </div>
          <p>推论：正项级数发散的充分必要条件为 lim<sub>n→∞</sub> S<sub>n</sub> = +∞。注：后续一系列正项级数审敛法均源自该结论。</p>
          <div class="callout key">
            <p><strong>定理 2（正项级数积分审敛法）</strong>：设函数 f(x) 在区间 [1,+∞) 上非负连续且单调减少，则正项级数 ∑f(n) 与广义积分 ∫<sub>1</sub><sup>+∞</sup> f(x) dx 具有相同的敛散性。（证明参见教材，略。）</p>
          </div>
          <p><strong>例 1</strong>　证明 p 级数 ∑1/n<sup>p</sup> (p &gt; 0) 当 p &gt; 1 时收敛、当 p ≤ 1 时发散。令 f(x) = 1/x<sup>p</sup>，由定理 2，级数与 ∫<sub>1</sub><sup>+∞</sup> dx/x<sup>p</sup> 同敛散；p &gt; 1 时积分收敛，p ≤ 1 时积分发散。特别地 p = 1 即得调和级数发散。</p>
          <p><strong>例 2</strong>　讨论 ∑<sub>n=2</sub><sup>∞</sup> 1/(n ln n) 的敛散性。取 f(x) = 1/(x ln x)，在 [2,+∞) 上非负连续且单减；由定理 2 知该级数与广义积分 ∫<sub>2</sub><sup>+∞</sup> dx/(x ln x) 同敛散。而 ∫<sub>2</sub><sup>+∞</sup> dx/(x ln x) = ln(ln x)|<sub>2</sub><sup>+∞</sup> = +∞ 发散，故级数 ∑ 1/(n ln n) 发散。</p>
          `,
        },
        {
          type: 'html',
          html: `
          <h3 id="sec-ch13-positive-compare">三、正项级数比较审敛法</h3>
          <div class="callout key">
            <p><strong>定理 3（比较审敛法）</strong>：设 ∑u<sub>n</sub>、∑v<sub>n</sub> 是两个正项级数，且存在 N ∈ **N**<sub>+</sub>，对一切 n &gt; N 有 u<sub>n</sub> ≤ k v<sub>n</sub>（常数 k &gt; 0），则</p>
            <p>(1) 若强级数 ∑v<sub>n</sub> 收敛，则弱级数 ∑u<sub>n</sub> 也收敛；(2) 若弱级数 ∑u<sub>n</sub> 发散，则强级数 ∑v<sub>n</sub> 也发散。</p>
          </div>
          <p><strong>例 3</strong>　用比较审敛法证明 p 级数结论：p ≤ 1 时 1/n<sup>p</sup> ≥ 1/n，由调和级数发散知 p 级数发散；p &gt; 1 时用积分比较构造收敛的强级数 1/n<sup>p</sup> ≤ 1/[n<sup>p−1</sup>(n−1)] 型，知 p 级数收敛。</p>
          <p><strong>例 4</strong>　证明级数 ∑ 1/√[n(n+1)] 发散。因为 1/√[n(n+1)] ≥ 1/√[(n+1)²] = 1/(n+1)，而 ∑1/(n+1) = ∑<sub>k=2</sub><sup>∞</sup> 1/k 发散，由比较审敛法知所给级数发散。</p>
          <p><strong>推论（比较审敛法的常用形式）</strong>：若存在 N，对一切 n ≥ N 有 u<sub>n</sub> ≥ 1/n 则 ∑u<sub>n</sub> 发散；若 u<sub>n</sub> ≤ 1/n<sup>p</sup> (p &gt; 1) 则 ∑u<sub>n</sub> 收敛。调和级数与 p 级数是两个常用的比较级数。</p>
          <p><strong>例 5</strong>　判别下列正项级数敛散性：⑴ ∑ 1/[n(n+1)(n+2)]，因 1/[n(n+1)(n+2)] &lt; 1/n³，而 p=3 的 p 级数收敛，由比较审敛法知该级数收敛；⑵ ∑ ln n/n（n 从 2 起），当 n ≥ 3 时 ln n/n &gt; 1/n，而调和级数发散，由比较审敛法知 ∑ ln n/n 发散；⑶ ∑ sin²(π/n)，因 sin²(π/n) ≤ π²/n²，而 p=2 的 p 级数收敛，由比较审敛法知该级数收敛。</p>
          <p><strong>例 6</strong>　设 a<sub>n</sub> ≤ c<sub>n</sub> ≤ b<sub>n</sub> (n=1,2,…)，且 ∑a<sub>n</sub> 与 ∑b<sub>n</sub> 都收敛，证明 ∑c<sub>n</sub> 收敛。由 0 ≤ c<sub>n</sub>−a<sub>n</sub> ≤ b<sub>n</sub>−a<sub>n</sub>，而 ∑(b<sub>n</sub>−a<sub>n</sub>) 收敛（性质 2），由比较审敛法知 ∑(c<sub>n</sub>−a<sub>n</sub>) 收敛，从而 ∑c<sub>n</sub> = ∑[(c<sub>n</sub>−a<sub>n</sub>)+a<sub>n</sub>] 收敛。</p>
          <p><strong>推论</strong>：设 ∑u<sub>n</sub>、∑v<sub>n</sub> 为正项级数，若存在常数 C₁ &gt; 0、C₂ &gt; 0 使 C₁v<sub>n</sub> ≤ u<sub>n</sub> ≤ C₂v<sub>n</sub>，则两级数具有相同的敛散性。</p>
          `,
        },
        {
          type: 'html',
          html: `
          <div class="callout key">
            <p><strong>定理 4（比较审敛法的极限形式）</strong>：设两正项级数 ∑u<sub>n</sub>、∑v<sub>n</sub> 满足 lim<sub>n→∞</sub> u<sub>n</sub>/v<sub>n</sub> = l，则</p>
            <p>(1) 当 0 &lt; l &lt; +∞ 时，两个级数同时收敛或同时发散；</p>
            <p>(2) 当 l = 0 且 ∑v<sub>n</sub> 收敛时，∑u<sub>n</sub> 也收敛；</p>
            <p>(3) 当 l = +∞ 且 ∑v<sub>n</sub> 发散时，∑u<sub>n</sub> 也发散。</p>
          </div>
          <p>特别取 v<sub>n</sub> = 1/n<sup>p</sup> 可得：对正项级数 ∑u<sub>n</sub>，若 lim n<sup>p</sup>u<sub>n</sub> = l，则 p &gt; 1 且 0 ≤ l &lt; +∞ 时收敛；p ≤ 1 且 0 &lt; l ≤ +∞ 时发散。注：u<sub>n</sub>、v<sub>n</sub> 均为无穷小时，l 的值反映了它们不同阶的比较。</p>
          <p><strong>例 7</strong>　判别 ∑ sin(1/n)。因 lim sin(1/n)/(1/n) = 1，而调和级数发散，由极限形式知 ∑ sin(1/n) 发散。</p>
          <p><strong>例 8</strong>　判别 ∑ [1 − ln(1+1/n)]（n≥1）。利用 ln(1+1/n) ~ 1/n − 1/(2n²)，得 1 − ln(1+1/n) ~ 1/(2n²)，与 p=2 的 p 级数比较知收敛。</p>
          <p><strong>例 9（选择题）</strong>　设 ∑a<sub>n</sub> 为正项级数，正确选项为 (B)：若存在非零常数 λ 使 lim n a<sub>n</sub> = λ，则 a<sub>n</sub> 与 1/n 为同阶无穷小，故 ∑a<sub>n</sub> 发散。（A)、(D) 可取 a<sub>n</sub> = 1/(n ln²n) 等反例排除，(C) 可取 a<sub>n</sub> = 1/(n√n) 排除。</p>
          <h3 id="sec-ch13-positive-ratio">四、比值审敛法与五、根值审敛法</h3>
          <div class="callout key">
            <p><strong>定理 5（比值审敛法，D’Alembert 判别法）</strong>：设 ∑u<sub>n</sub> 为正项级数，且 lim<sub>n→∞</sub> u<sub>n+1</sub>/u<sub>n</sub> = ρ，则 (1) ρ &lt; 1 时级数收敛；(2) ρ &gt; 1 或 ρ = +∞ 时级数发散。</p>
          </div>
          <p>说明：当 ρ = 1 时级数可能收敛也可能发散，例如 p 级数总有 lim u<sub>n+1</sub>/u<sub>n</sub> = 1，但 p &gt; 1 收敛、p ≤ 1 发散。若极限 lim u<sub>n+1</sub>/u<sub>n</sub> 不存在，则不能用比值法判定（如 ∑[2+(−1)<sup>n</sup>]/n 发散、∑[2+(−1)<sup>n</sup>]/n² 收敛，比值极限均不存在）。</p>
          <div class="callout key">
            <p><strong>定理 6（根值审敛法，Cauchy 判别法）</strong>：设 ∑u<sub>n</sub> 为正项级数，且 lim<sub>n→∞</sub> ⁿ√u<sub>n</sub> = ρ，则 (1) ρ &lt; 1 时级数收敛；(2) ρ &gt; 1 或 ρ = +∞ 时级数发散。</p>
          </div>
          <p><strong>例 10</strong>　判定：⑴ ∑(n!)²/2<sup>n²</sup>，因 lim u<sub>n+1</sub>/u<sub>n</sub> = lim (n+1)²/2<sup>2n+1</sup> = 0 &lt; 1，收敛；⑵ ∑2<sup>n</sup>/n²，因 lim u<sub>n+1</sub>/u<sub>n</sub> = 2 &gt; 1，发散。</p>
          <p><strong>例 11</strong>　讨论 ∑ n x<sup>n−1</sup> (x &gt; 0)：lim u<sub>n+1</sub>/u<sub>n</sub> = x，故 0 &lt; x &lt; 1 时收敛、x &gt; 1 时发散、x = 1 时 ∑n 发散。</p>
          <p><strong>例 12</strong>　利用级数收敛的必要条件证明 lim 2<sup>n</sup>n!/n<sup>n</sup> = 0。记 u<sub>n</sub> = 2<sup>n</sup>n!/n<sup>n</sup>，因 lim u<sub>n+1</sub>/u<sub>n</sub> = 2/e &lt; 1，故 ∑u<sub>n</sub> 收敛，从而 lim u<sub>n</sub> = 0。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch13-absolute',
      heading: '3. 级数的绝对收敛与条件收敛',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ch13-absolute-leibniz">一、交错级数及其审敛法</h3>
          <p>设 u<sub>n</sub> &gt; 0，则各项符号正负相间的级数 u₁ − u₂ + u₃ − … + (−1)<sup>n−1</sup>u<sub>n</sub> + … 称为<strong>交错级数</strong>。</p>
          <div class="callout key">
            <p><strong>定理 1（Leibnitz 判别法）</strong>：若交错级数满足 1) u<sub>n</sub> ≥ u<sub>n+1</sub> (n=1,2,…)（单调不增）；2) lim<sub>n→∞</sub> u<sub>n</sub> = 0，则级数 ∑(−1)<sup>n−1</sup>u<sub>n</sub> 收敛，且其和 S ≤ u₁，其余项满足 |r<sub>n</sub>| ≤ u<sub>n+1</sub>。</p>
          </div>
          <p>证明思路：S<sub>2n</sub> = (u₁−u₂)+(u₃−u₄)+…+(u<sub>2n−1</sub>−u<sub>2n</sub>) 单调递增有界；又 S<sub>2n+1</sub> = S<sub>2n</sub> + u<sub>2n+1</sub>，且 lim u<sub>n</sub> = 0，故 S<sub>2n</sub> 与 S<sub>2n+1</sub> 同收敛于 S，结论成立。</p>
          <div class="callout warn">
            <p><strong>注 1</strong>：Leibnitz 判别法中的条件是交错级数收敛的<strong>充分条件而非必要条件</strong>，条件不满足时不能由此断定级数发散。</p>
            <p><strong>注 2</strong>：判断交错级数 ∑(−1)<sup>n−1</sup>f(n)（f(n)&gt;0）的敛散性时，若分析 {f(n)} 的单调性与极限困难，可改为分析 f(x) 的单调性及极限。</p>
          </div>
          <p><strong>例 1</strong>　判定 ∑(−1)<sup>n−1</sup>/n<sup>p</sup> (p&gt;0)：u<sub>n</sub> = 1/n<sup>p</sup> 单调递减且趋于 0，由交错级数审敛法知收敛；特别 p=1 时交错调和级数 −1+1/2−1/3+1/4−… 收敛。</p>
          <p><strong>例 2</strong>　判定：⑴ ∑(−1)<sup>n</sup> ln n/n，考察 f(x)=ln x/x，f′(x)=(1−ln x)/x² &lt; 0 (x≥3)，且 lim ln x/x = 0，由 Leibniz 判别法知收敛。⑵ ∑ (−1)<sup>n</sup>/√[n+1+(−1)<sup>n</sup>]：由于数列 {1/√[n+1+(−1)<sup>n</sup>]} 不单调，不能直接应用交错级数审敛法；但有理化得 (−1)<sup>n</sup>/√[n+1+(−1)<sup>n</sup>] = (−1)<sup>n</sup>√(1/n + 1/n²) − (−1)<sup>n</sup>/n，其中 {√(1/n+1/n²)} 单调递减且趋于 0，故第一部分的交错级数收敛；而 ∑1/n 发散，故原级数发散。</p>
          <p><strong>例 3（选择题）</strong>　设 {u<sub>n</sub>} 为正项数列，正确选项为 (D)：若存在常数 p &gt; 1 使 lim n<sup>p</sup>u<sub>n</sub> 存在，则 ∑u<sub>n</sub> 收敛（由正项级数比较判别法的极限形式）。</p>
          `,
        },
        {
          type: 'html',
          html: `
          <h3 id="sec-ch13-absolute-def">二、绝对收敛与条件收敛</h3>
          <div class="callout key">
            <p><strong>定义</strong>：对任意项级数 ∑u<sub>n</sub>，若 ∑|u<sub>n</sub>| 收敛，则称原级数<strong>绝对收敛</strong>；若原级数收敛但取绝对值以后的级数发散，则称原级数<strong>条件收敛</strong>。</p>
            <p>例如 ∑(−1)<sup>n−1</sup>/n 为条件收敛；而 ∑(−1)<sup>n−1</sup>/(n−1)! 与 ∑(−1)<sup>n−1</sup> n/10<sup>n</sup> 均为绝对收敛。</p>
          </div>
          <div class="callout key">
            <p><strong>定理 2</strong>：绝对收敛的级数一定收敛。</p>
            <p>证：设 ∑|u<sub>n</sub>| 收敛，令 v<sub>n</sub> = (1/2)(u<sub>n</sub>+|u<sub>n</sub>|)，显然 v<sub>n</sub> ≥ 0 且 v<sub>n</sub> ≤ |u<sub>n</sub>|，由比较审敛法 ∑v<sub>n</sub> 收敛；又 u<sub>n</sub> = 2v<sub>n</sub> − |u<sub>n</sub>|，由性质 2 知 ∑u<sub>n</sub> 收敛。</p>
          </div>
          <p><strong>例 4</strong>　证明下列级数绝对收敛：⑴ ∑ sin(nα)/n⁴，因 |sin(nα)/n⁴| ≤ 1/n⁴ 且 ∑1/n⁴ 收敛，故绝对收敛；⑵ ∑(−1)<sup>n</sup>n²/e<sup>n</sup>，令 u<sub>n</sub> = n²/e<sup>n</sup>，比值 lim u<sub>n+1</sub>/u<sub>n</sub> = lim (1/e)[(n+1)/n]² = 1/e &lt; 1，故 ∑|u<sub>n</sub>| 收敛，原级数绝对收敛。</p>
          <p><strong>例 5</strong>　判定敛散性并指出是绝对收敛还是条件收敛：</p>
          <p>⑴ ∑(−1)<sup>n+1</sup>n⁵/2<sup>n</sup>：取绝对值后 lim u<sub>n+1</sub>/u<sub>n</sub> = (1/2)lim(1+1/n)⁵ = 1/2 &lt; 1，正项级数收敛，故原级数<strong>绝对收敛</strong>。</p>
          <p>⑵ ∑(−1)<sup>n−1</sup>ln(1+1/n)：取绝对值后 ∑ln(1+1/n) ~ ∑1/n 发散（不绝对收敛）；但它为交错级数且 ln(1+1/n) 单调递减趋于 0，由 Leibniz 判别法收敛，故<strong>条件收敛</strong>。</p>
          <p>⑶ ∑(−1)<sup>n−1</sup>n<sup>n+1</sup>/(n+1)!：取绝对值后 lim a<sub>n+1</sub>/a<sub>n</sub> = lim(1+1/n)<sup>n</sup>·(n+1)²/[n(n+2)] = e &gt; 1，故从第 N+1 项起 {n<sup>n+1</sup>/(n+1)!} 为正的单增数列，一般项不趋于 0，从而原级数<strong>发散</strong>。</p>
          <p><strong>例 6</strong>　讨论级数 ∑ x<sup>n</sup>/(n·2<sup>n</sup>) 的敛散性：取绝对值后 lim |u<sub>n+1</sub>/u<sub>n</sub>| = |x|/2，故 |x| &lt; 2 时绝对收敛；|x| &gt; 2 时一般项不趋于 0，发散；x = 2 时为调和级数发散；x = −2 时为交错调和级数，条件收敛。综上，当 x ∈ [−2, 2) 时收敛，其余发散。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch13-power',
      heading: '4. 幂级数',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ch13-power-func">一、函数项级数的概念</h3>
          <p>设 u<sub>n</sub>(x) (n=1,2,…) 是定义在区间 I 上的函数，称 ∑u<sub>n</sub>(x) 为定义在 I 上的<strong>函数项级数</strong>。对 x₀ ∈ I，若常数项级数 ∑u<sub>n</sub>(x₀) 收敛，称 x₀ 为其<strong>收敛点</strong>，全体收敛点构成<strong>收敛域</strong>；否则称 x₀ 为<strong>发散点</strong>，全体发散点构成<strong>发散域</strong>。在收敛域上，级数的和是 x 的函数，称为<strong>和函数</strong> S(x)；前 n 项和 S<sub>n</sub>(x) 为部分和，余项 r<sub>n</sub>(x) = S(x) − S<sub>n</sub>(x)。</p>
          <p>例如等比级数 ∑x<sup>n</sup> 的收敛域为 (−1,1)、发散域为 |x| ≥ 1，和函数为 1/(1−x)。</p>
          <h3 id="sec-ch13-power-abel">二、幂级数及其收敛性</h3>
          <p>形如 ∑<sub>n=0</sub><sup>∞</sup> a<sub>n</sub>x<sup>n</sup> = a₀ + a₁x + a₂x² + … 的函数项级数称为<strong>幂级数</strong>，a<sub>n</sub> 称为系数。下面重点讨论 x 的情形，对 ∑a<sub>n</sub>(x−x₀)<sup>n</sup> 可作变量代换 t = x−x₀ 化归。</p>
          <div class="callout key">
            <p><strong>定理 1（Abel 定理）</strong>：若幂级数 ∑a<sub>n</sub>x<sup>n</sup> 在 x = x₀ 点收敛，则对满足 |x| &lt; |x₀| 的一切 x，幂级数都<strong>绝对收敛</strong>；反之，若当 x = x₀ 时该幂级数发散，则对满足 |x| &gt; |x₀| 的一切 x，该幂级数也<strong>发散</strong>。</p>
          </div>
          <p>由 Abel 定理，幂级数的收敛域是以原点为中心的区间。用 ±R 表示收敛与发散的分界点：</p>
          <table class="tbl">
            <thead><tr><th>R 的情形</th><th>收敛情况</th></tr></thead>
            <tbody>
              <tr><td>R = 0</td><td>幂级数仅在 x = 0 收敛</td></tr>
              <tr><td>R = +∞</td><td>幂级数在 (−∞, +∞) 收敛</td></tr>
              <tr><td>0 &lt; R &lt; +∞</td><td>在 (−R, R) 收敛；在 [−R, R] 外发散；在 x = ±R 可能收敛也可能发散</td></tr>
            </tbody>
          </table>
          <p>R 称为<strong>收敛半径</strong>，(−R, R) 称为<strong>收敛区间</strong>，(−R, R) 加上收敛的端点称为<strong>收敛域</strong>。</p>
          `,
        },
        {
          type: 'html',
          html: `
          <div class="callout key">
            <p><strong>定理 2（系数模比值法）</strong>：若 ∑a<sub>n</sub>x<sup>n</sup> 的系数满足 lim<sub>n→∞</sub> |a<sub>n+1</sub>/a<sub>n</sub>| = ρ，则 1) ρ ≠ 0 时 R = 1/ρ；2) ρ = 0 时 R = +∞；3) ρ = +∞ 时 R = 0。</p>
            <p><strong>定理 3（系数模根值法）</strong>：若系数满足 lim<sub>n→∞</sub> ⁿ√|a<sub>n</sub>| = ρ，则同样有 ρ ≠ 0 时 R = 1/ρ；ρ = 0 时 R = +∞；ρ = +∞ 时 R = 0。（证明略。）</p>
          </div>
          <p><strong>例 1</strong>　求 ∑ x<sup>n</sup>/n 的收敛半径及收敛域：lim |a<sub>n+1</sub>/a<sub>n</sub>| = 1，故 R = 1；x = −1 时为交错调和级数，收敛；x = 1 时为调和级数，发散。收敛域为 [−1, 1)。</p>
          <p><strong>例 2</strong>　求收敛域：⑴ ∑ x<sup>n</sup>/n!，R = lim |a<sub>n</sub>/a<sub>n+1</sub>| = lim (n+1) = +∞，收敛域 (−∞, +∞)（规定 0! = 1）；⑵ ∑ n!x<sup>n</sup>，R = lim 1/(n+1) = 0，级数仅在 x = 0 收敛。</p>
          <p><strong>例 3</strong>　求 ∑ (x−1)<sup>n</sup>/[n·2<sup>n</sup>] 的收敛域。令 t = x−1，对 t 的幂级数，R = lim |a<sub>n</sub>/a<sub>n+1</sub>| = lim 2n/(n+1) = 2；t = 2 时级数发散，t = −2 时级数条件收敛，故 −2 ≤ t &lt; 2，即 −1 ≤ x &lt; 3。</p>
          <p><strong>例 4</strong>　求 ∑ (2+(−1)<sup>n</sup>) x<sup>n</sup>/(2<sup>n</sup>n²) 的收敛半径与收敛域。由 ⁿ√|a<sub>n</sub>| = (1/2)·ⁿ√[2+(−1)<sup>n</sup>]·n<sup>−2/n</sup>，夹逼得 (1/2)n<sup>−2/n</sup> ≤ ⁿ√|a<sub>n</sub>| ≤ (1/2)·3<sup>1/n</sup>n<sup>−2/n</sup>，而 lim n<sup>−2/n</sup> = lim 3<sup>1/n</sup> = 1，故 ρ = 1/2、R = 2，收敛区间 (−2,2)。端点 x = ±2 时级数为 ∑(2+(−1)<sup>n</sup>)/n² 与 ∑(−1)<sup>n</sup>(2+(−1)<sup>n</sup>)/n²，因 0 &lt; (2+(−1)<sup>n</sup>)/n² ≤ 3/n² 且 ∑1/n² 收敛，两端点均绝对收敛，故收敛域为 [−2, 2]。</p>
          <p><strong>注意</strong>：若 lim |a<sub>n+1</sub>/a<sub>n</sub>| 或 lim ⁿ√|a<sub>n</sub>| 不存在（也不是 +∞），并不能说明收敛半径 R 不存在；由 Abel 定理，每个幂级数的收敛半径 R 总是存在的，此时应改用其它方法求 R（如例 5 中缺奇次幂项时直接用比值审敛法求 ∑u<sub>n</sub>(x) 的收敛范围）。</p>
          `,
        },
        {
          type: 'html',
          html: `
          <h3 id="sec-ch13-power-op">三、幂级数的运算</h3>
          <div class="callout key">
            <p><strong>定理 3</strong>：设 ∑a<sub>n</sub>x<sup>n</sup> 与 ∑b<sub>n</sub>x<sup>n</sup> 的收敛半径分别为 R₁、R₂，令 R = min{R₁, R₂}，则在公共收敛区间内：</p>
            <div class="formula">λ∑a<sub>n</sub>x<sup>n</sup> = ∑λa<sub>n</sub>x<sup>n</sup>（|x| &lt; R₁，λ 为常数）</div>
            <div class="formula">∑a<sub>n</sub>x<sup>n</sup> ± ∑b<sub>n</sub>x<sup>n</sup> = ∑(a<sub>n</sub> ± b<sub>n</sub>)x<sup>n</sup>（|x| &lt; R）</div>
            <div class="formula">(∑a<sub>n</sub>x<sup>n</sup>)(∑b<sub>n</sub>x<sup>n</sup>) = ∑c<sub>n</sub>x<sup>n</sup>，其中 c<sub>n</sub> = ∑<sub>k=0</sub><sup>n</sup> a<sub>k</sub>b<sub>n−k</sub>（|x| &lt; R）</div>
          </div>
          <p>说明：两个幂级数相除所得幂级数的收敛半径可能比原来两个的收敛半径小得多。例如 a₀=1, a<sub>n</sub>=0 (n≥2)、b₀=1, b₁=−1, b<sub>n</sub>=0 (n≥2) 的收敛半径均为 +∞，但 (1+x+x²+…) = 1/(1−x) 的收敛半径只有 1。</p>
          <div class="callout key">
            <p><strong>定理 4</strong>：若幂级数 ∑a<sub>n</sub>x<sup>n</sup> 的收敛半径 R &gt; 0，则其和函数 S(x) 在收敛域上连续，且在收敛区间内可逐项求导与逐项求积分，运算前后收敛半径相同：</p>
            <div class="formula">S′(x) = ∑(a<sub>n</sub>x<sup>n</sup>)′ = ∑<sub>n=1</sub><sup>∞</sup> n a<sub>n</sub>x<sup>n−1</sup>，x ∈ (−R, R)</div>
            <div class="formula">∫<sub>0</sub><sup>x</sup> S(t) dt = ∑ a<sub>n</sub>∫<sub>0</sub><sup>x</sup> t<sup>n</sup> dt = ∑ a<sub>n</sub>/(n+1) x<sup>n+1</sup>，x ∈ (−R, R)</div>
          </div>
          <p>注：逐项积分时，运算前后端点处的敛散性不变。</p>
          <p><strong>例 9</strong>　求 ∑<sub>n=1</sub><sup>∞</sup> n x<sup>n−1</sup> 的和函数：收敛半径 R=1，x=±1 时发散。S(x) = (∑x<sup>n</sup>)′ = (x/(1−x))′ = 1/(1−x)²。</p>
          <p><strong>例 11</strong>　求 ∑<sub>n=1</sub><sup>∞</sup> x<sup>n</sup>/n 的和函数：收敛半径 R=1，x=1 时级数发散、x=−1 时收敛，收敛域为 [−1,1)。S′(x) = ∑x<sup>n−1</sup> = 1/(1−x)，从 0 到 x 积分得 S(x) = ∫<sub>0</sub><sup>x</sup> dt/(1−t) = ln[1/(1−x)]，x ∈ (−1,1)；由和函数在端点 x=−1 的连续性，S(x) = ln[1/(1−x)] 在 [−1,1) 上成立。</p>
          <p><strong>例 12</strong>　求 ∑<sub>n=0</sub><sup>∞</sup> x<sup>n</sup>/(n+1) 的和函数：收敛半径 R=1，x=1 时发散；xS(x) = ∑x<sup>n+1</sup>/(n+1)，求导得 (xS(x))′ = ∑x<sup>n</sup> = 1/(1−x)，积分得 xS(x) = −ln(1−x)，故 S(x) = −ln(1−x)/x (x ≠ 0)，且 S(0)=1，收敛域 [−1,1)。</p>
          <p><strong>例 13</strong>　设 S(x) = x + x²/2! + x³/3! + …（x ∈ (−∞,+∞)）。S′(x) = 1 + x + x²/2! + … = S(x)，故 S′(x) = S(x)，通解 S(x) = Ce<sup>x</sup>；由 S(0)=1 得 C=1，故 S(x) = e<sup>x</sup>。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch13-expand',
      heading: '5. 函数的幂级数展开式',
      blocks: [
        {
          type: 'html',
          html: `
          <p>两类问题：在收敛域内「求和」（由级数求函数）与「展开」（由函数求级数）。本节讨论<strong>函数展开成幂级数</strong>。</p>
          <h3 id="sec-ch13-expand-taylor">一、泰勒（Taylor）级数</h3>
          <p>复习 f(x) 的 n 阶泰勒公式：f(x) = f(x₀) + f′(x₀)(x−x₀) + f″(x₀)(x−x₀)²/2! + … + f<sup>(n)</sup>(x₀)(x−x₀)<sup>n</sup>/n! + R<sub>n</sub>(x)，其中 R<sub>n</sub>(x) = f<sup>(n+1)</sup>(ξ)(x−x₀)<sup>n+1</sup>/(n+1)!（ξ 在 x 与 x₀ 之间）称为拉格朗日余项。</p>
          <p>若函数 f(x) 在 x₀ 的某邻域内具有任意阶导数，则称 ∑<sub>n=0</sub><sup>∞</sup> f<sup>(n)</sup>(x₀)(x−x₀)<sup>n</sup>/n! 为 f(x) 的<strong>泰勒级数</strong>；当 x₀ = 0 时又称为<strong>麦克劳林级数</strong>。待解决问题：(1) 它的收敛域是什么？(2) 在收敛域上和函数是否就是 f(x)？</p>
          <div class="callout key">
            <p><strong>定理 1</strong>：设函数 f(x) 在点 x₀ 的某邻域 U(x₀) 内具有各阶导数，则 f(x) 在该邻域内<strong>能展开成泰勒级数的充要条件</strong>是其泰勒公式余项满足 lim<sub>n→∞</sub> R<sub>n</sub>(x) = 0。</p>
            <p><strong>定理 2</strong>：若 f(x) 能展成 x 的幂级数，则这种展开式是<strong>唯一的</strong>，且与它的麦克劳林级数相同。证：设 f(x) = a₀ + a₁x + a₂x² + …，逐次求导并令 x=0 得 a₀ = f(0)，a₁ = f′(0)，a₂ = f″(0)/2!，…，a<sub>n</sub> = f<sup>(n)</sup>(0)/n!。</p>
          </div>
          <h3 id="sec-ch13-expand-method">二、函数展开成幂级数</h3>
          <p><strong>直接展开法</strong>（利用泰勒公式）：第一步求函数及其各阶导数在 x=0 处的值；第二步写出麦克劳林级数并求收敛半径 R；第三步判别在收敛区间 (−R, R) 内 lim R<sub>n</sub>(x) 是否为 0。</p>
          <p><strong>间接展开法</strong>：利用已知函数的展开式及幂级数的运算性质。</p>
          <p><strong>例 1</strong>　将 e<sup>x</sup> 展开成 x 的幂级数：f<sup>(n)</sup>(0) = 1，收敛半径 R = +∞，且对任何有限 x 余项 |R<sub>n</sub>(x)| = e<sup>ξ</sup>|x|<sup>n+1</sup>/(n+1)! → 0，故</p>
          <div class="formula">e<sup>x</sup> = 1 + x + x²/2! + … + x<sup>n</sup>/n! + …，x ∈ (−∞, +∞)</div>
          `,
        },
        {
          type: 'html',
          html: `
          <p><strong>例 2</strong>　将 sin x 展开成 x 的幂级数（直接法）：f<sup>(2k)</sup>(0)=0，f<sup>(2k+1)</sup>(0)=(−1)<sup>k</sup>，R=+∞，余项趋于 0，得</p>
          <div class="formula">sin x = x − x³/3! + x⁵/5! − … + (−1)<sup>n</sup>x<sup>2n+1</sup>/(2n+1)! + …，x ∈ (−∞, +∞)</div>
          <p>两边求导可得 cos x = 1 − x²/2! + x⁴/4! − … + (−1)<sup>n</sup>x<sup>2n</sup>/(2n)! + …，x ∈ (−∞, +∞)。</p>
          <p><strong>例 3</strong>　将 (1+x)<sup>m</sup>（m 为任意常数）展开：f(0)=1，f′(0)=m，f″(0)=m(m−1)，…，f<sup>(n)</sup>(0) = m(m−1)…(m−n+1)，得<strong>二项展开式</strong></p>
          <div class="formula">(1+x)<sup>m</sup> = 1 + mx + m(m−1)x²/2! + … + m(m−1)…(m−n+1)x<sup>n</sup>/n! + …，−1 &lt; x &lt; 1</div>
          <p>说明：(1) 在 x = ±1 处的收敛性与 m 有关；(2) 当 m 为正整数时级数为 x 的 m 次多项式，即二项式定理。当 m 不是非负整数时收敛域为：m ≤ −1 时 (−1,1)；−1 &lt; m &lt; 0 时 (−1,1]；m &gt; 0 时 [−1,1]。</p>
          <p><strong>例 4</strong>　将 1/(1+x²) 展开（间接法）：由 1/(1+t) = 1−t+t²−…+(-1)<sup>n</sup>t<sup>n</sup>+… (|t|&lt;1)，令 t = x² 得 1/(1+x²) = 1−x²+x⁴−…+(−1)<sup>n</sup>x<sup>2n</sup>+…，|x|&lt;1。</p>
          <p><strong>例 5</strong>　将 ln(1+x) 展开：因 (ln(1+x))′ = 1/(1+x) = ∑(−1)<sup>n</sup>x<sup>n</sup> (−1&lt;x&lt;1)，从 0 到 x 逐项积分得</p>
          <div class="formula">ln(1+x) = x − x²/2 + x³/3 − x⁴/4 + … + (−1)<sup>n</sup>x<sup>n+1</sup>/(n+1) + …，x ∈ (−1, 1]</div>
          <p>右端幂级数在 x=1 处收敛，且 ln(1+x) 在 x=1 连续，故展开式对 x=1 也成立。</p>
          <p><strong>例 6</strong>　将 sin(π/4 + x) 展开：利用 sin(π/4+x) = (√2/2)(cos x + sin x)，代入 sin x、cos x 的展开式即可。</p>
          <p><strong>例 7</strong>　将 4/(−x²+2x+3) 展成 x−1 的幂级数：先作部分分式分解 4/[(3−x)(x+1)] = 1/(x+1) + 1/(3−x)，再分别写成 1/[2+(x−1)] 与 1/[2−(x−1)] 的形式，利用 1/(1±t) 的展开式，得 ∑<sub>n=0</sub><sup>∞</sup> (−1)<sup>n</sup>(x−1)<sup>n</sup>/2<sup>n+1</sup> + ∑(x−1)<sup>n</sup>/2<sup>n+1</sup>，收敛区间 −1 &lt; x &lt; 3。</p>
          `,
        },
        {
          type: 'html',
          html: `
          <h3 id="sec-ch13-expand-common">常用函数的幂级数展开式（内容小结）</h3>
          <div class="formula">e<sup>x</sup> = ∑<sub>n=0</sub><sup>∞</sup> x<sup>n</sup>/n! = 1 + x + x²/2! + …，x ∈ (−∞, +∞)</div>
          <div class="formula">ln(1+x) = ∑<sub>n=1</sub><sup>∞</sup> (−1)<sup>n−1</sup>x<sup>n</sup>/n = x − x²/2 + x³/3 − …，x ∈ (−1, 1]</div>
          <div class="formula">sin x = ∑<sub>n=0</sub><sup>∞</sup> (−1)<sup>n</sup>x<sup>2n+1</sup>/(2n+1)!，x ∈ (−∞, +∞)</div>
          <div class="formula">cos x = ∑<sub>n=0</sub><sup>∞</sup> (−1)<sup>n</sup>x<sup>2n</sup>/(2n)!，x ∈ (−∞, +∞)</div>
          <div class="formula">(1+x)<sup>m</sup> = 1 + mx + m(m−1)x²/2! + … + m(m−1)…(m−n+1)x<sup>n</sup>/n! + …，x ∈ (−1, 1)</div>
          <div class="formula">当 m = −1 时：1/(1+x) = 1 − x + x² − x³ + … + (−1)<sup>n</sup>x<sup>n</sup> + …，x ∈ (−1, 1)</div>
          <div class="callout tip">
            <p>思考与练习：函数在某处「有泰勒级数」与「能展成泰勒级数」不同——后者必须证明 lim R<sub>n</sub>(x) = 0，前者无此要求。</p>
          </div>
          `,
        },
      ],
    },
    {
      id: 'sec-ch13-fourier',
      heading: '6. 傅里叶级数',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ch13-fourier-orth">一、三角级数及三角函数系的正交性</h3>
          <p>简单周期运动（谐波函数）：A sin(ωt+φ)，其中 A 为振幅、ω 为角频率、φ 为初相。复杂周期运动是谐波的迭加 ∑(A<sub>n</sub> cos(nωt+φ<sub>n</sub>) + B<sub>n</sub> sin(nωt+φ<sub>n</sub>))。令 a<sub>n</sub> = A<sub>n</sub>sin φ<sub>n</sub>、b<sub>n</sub> = A<sub>n</sub>cos φ<sub>n</sub>，得函数项级数 a₀/2 + ∑(a<sub>n</sub>cos nx + b<sub>n</sub>sin nx)，称<strong>三角级数</strong>。</p>
          <div class="callout key">
            <p><strong>定理 1（正交性）</strong>：三角函数系 {1, cos x, sin x, cos 2x, sin 2x, …, cos nx, sin nx, …} 中任意两个不同函数之积在 [−π, π] 上的积分为 0：∫<sub>−π</sub><sup>π</sup> cos nx dx = ∫<sub>−π</sub><sup>π</sup> sin nx dx = 0；∫<sub>−π</sub><sup>π</sup> cos kx cos nx dx = ∫<sub>−π</sub><sup>π</sup> sin kx sin nx dx = 0 (k ≠ n)；∫<sub>−π</sub><sup>π</sup> sin kx cos nx dx = 0。</p>
            <p>而两个相同函数之积的积分不为 0：∫<sub>−π</sub><sup>π</sup> 1² dx = 2π，∫<sub>−π</sub><sup>π</sup> cos² nx dx = ∫<sub>−π</sub><sup>π</sup> sin² nx dx = π，并用到 cos²nx = (1+cos2nx)/2、sin²nx = (1−cos2nx)/2。</p>
          </div>
          `,
        },
        {
          type: 'html',
          html: `
          <h3 id="sec-ch13-fourier-coef">二、周期为 2π 的函数的傅里叶展开式</h3>
          <div class="callout key">
            <p><strong>定理 2</strong>：设 f(x) 是周期为 2π 的周期函数，且 f(x) = a₀/2 + ∑<sub>n=1</sub><sup>∞</sup>(a<sub>n</sub> cos nx + b<sub>n</sub> sin nx)，右端级数可逐项积分，则</p>
            <div class="formula">a<sub>n</sub> = (1/π)∫<sub>−π</sub><sup>π</sup> f(x) cos nx dx　(n = 0, 1, 2, …)</div>
            <div class="formula">b<sub>n</sub> = (1/π)∫<sub>−π</sub><sup>π</sup> f(x) sin nx dx　(n = 1, 2, …)</div>
          </div>
          <p>证明思路：对 f(x) 的三角级数展开式在 [−π,π] 上逐项积分得 ∫f = a₀π；用 cos kx 乘两边再逐项积分，利用正交性得 a<sub>k</sub> = (1/π)∫f cos kx dx；类似用 sin kx 乘两边得 b<sub>k</sub>。</p>
          <p>由公式确定的 a<sub>n</sub>、b<sub>n</sub> 称为 f(x) 的<strong>傅里叶系数</strong>；以傅里叶系数为系数的三角级数 ① 称为 f(x) 的<strong>傅里叶级数</strong>。</p>
          <div class="callout key">
            <p><strong>定理 3（收敛定理，展开定理）</strong>：设 f(x) 是周期为 2π 的周期函数，并满足狄利克雷（Dirichlet）条件：1) 在一个周期内连续或只有有限个第一类间断点；2) 在一个周期内只有有限个极值点。则 f(x) 的傅里叶级数收敛，且</p>
            <div class="formula">a₀/2 + ∑(a<sub>n</sub>cos nx + b<sub>n</sub>sin nx) = { f(x)，x 为连续点； [f(x⁺)+f(x⁻)]/2，x 为间断点 }</div>
          </div>
          <p>注意：函数展成傅里叶级数的条件比展成幂级数的条件低得多。</p>
          <p><strong>例 1</strong>　设 f(x) 是周期为 2π 的周期函数，在 [−π, π) 上 f(x) = −1 (−π ≤ x &lt; 0)、f(x) = 1 (0 ≤ x &lt; π)。算得 a<sub>n</sub>=0，b<sub>n</sub> = 4/[π(2k+1)]（n 为奇数），故</p>
          <div class="formula">f(x) = (4/π)[sin x + sin 3x/3 + sin 5x/5 + …] = (4/π)∑<sub>k=0</sub><sup>∞</sup> sin((2k+1)x)/(2k+1)</div>
          <p>（x ≠ 0, ±π, ±2π, …）；在间断点 x = kπ 处级数收敛于 (f(x⁺)+f(x⁻))/2 = 0。</p>
          <p><strong>例 2</strong>　周期为 2π 的函数，在 [−π, π] 上 f(x) = x (−π ≤ x &lt; 0)、f(x) = 0 (0 ≤ x ≤ π)。算得 a₀ = −π/2，a<sub>n</sub> = (1−cos nπ)/(n²π)（n 为奇数时 = 2/[(2k−1)²π]，n 为偶数时 = 0），b<sub>n</sub> = (1/π)∫<sub>−π</sub><sup>0</sup> x sin nx dx = (−1)<sup>n+1</sup>/n，故</p>
          <div class="formula">f(x) = −π/4 + (2cos x/π + sin x) − (1/2)sin 2x + (2cos 3x/(3²π) + (1/3)sin 3x) − (1/4)sin 4x + …</div>
          <p>（x ≠ (2k−1)π）；在 x = (2k−1)π 处级数收敛于 [0+(−π)]/2 = −π/2。</p>
          <p><strong>周期延拓</strong>：定义在 [−π, π] 上的函数 f(x)，先作周期为 2π 的周期延拓 F(x)，再求 F(x) 在 [−π, π] 上的傅里叶级数，即得 f(x) 的傅里叶展开。<strong>例 3</strong>　将 f(x) = |x| (−π ≤ x ≤ π) 展开：f 为偶函数，b<sub>n</sub>=0；a₀ = (1/π)∫<sub>−π</sub><sup>π</sup>|x|dx = π，a<sub>n</sub> = (2/π)∫<sub>0</sub><sup>π</sup>x cos nx dx = [2/(n²π)](cos nπ−1)，即 n=2k−1 时 a<sub>n</sub> = −4/[(2k−1)²π]，n=2k 时 a<sub>n</sub>=0。故</p>
          <div class="formula">|x| = π/2 − (4/π)[cos x + cos 3x/3² + cos 5x/5² + …]，x ∈ [−π, π]</div>
          <p>利用此展式可求特殊级数的和：令 x = 0（f(0)=0），得 π²/8 = 1 + 1/3² + 1/5² + … + 1/(2n−1)² + …。</p>
          `,
        },
        {
          type: 'html',
          html: `
          <h3 id="sec-ch13-fourier-sine">三、正弦级数和余弦级数</h3>
          <div class="callout key">
            <p><strong>定理 4</strong>：对周期为 2π 的<strong>奇函数</strong> f(x)，其傅里叶级数为<strong>正弦级数</strong>，系数为 a<sub>n</sub>=0 (n=0,1,2,…)，b<sub>n</sub> = (2/π)∫<sub>0</sub><sup>π</sup> f(x) sin nx dx (n=1,2,…)；对周期为 2π 的<strong>偶函数</strong> f(x)，其傅里叶级数为<strong>余弦级数</strong>，系数为 a<sub>n</sub> = (2/π)∫<sub>0</sub><sup>π</sup> f(x) cos nx dx (n=0,1,2,…)，b<sub>n</sub>=0 (n=1,2,…)。</p>
          </div>
          <p><strong>例 4</strong>　将周期为 2π、在 (−π, π) 上 f(x)=x 的函数展开：f 为奇函数，a<sub>n</sub>=0，b<sub>n</sub> = (2/π)∫<sub>0</sub><sup>π</sup> x sin nx dx = 2(−1)<sup>n+1</sup>/n，故正弦级数</p>
          <div class="formula">x = 2[sin x − sin 2x/2 + sin 3x/3 − …] = 2∑<sub>n=1</sub><sup>∞</sup> (−1)<sup>n−1</sup> sin nx/n，x ∈ (−π, π)</div>
          <p>在 x = (2k+1)π 处级数收敛于 0。</p>
          <p><strong>定义在 [0, π] 上的函数展成正弦级数与余弦级数</strong>：对 f(x) (x ∈ [0,π])，作奇延拓再周期延拓，可展成<strong>正弦级数</strong>；作偶延拓再周期延拓，可展成<strong>余弦级数</strong>。</p>
          <p><strong>例 5</strong>　将 f(x) = x+1 (0 ≤ x ≤ π) 展成正弦级数：去掉端点作奇周期延拓，算得 b<sub>n</sub> = (2/π)∫<sub>0</sub><sup>π</sup>(x+1) sin nx dx，当 n = 2k−1 时 b<sub>n</sub> = (2/π)·(π+2)/(2k−1)，当 n = 2k 时 b<sub>n</sub> = −1/k（k=1,2,…），从而</p>
          <div class="formula">x+1 = (2/π)[(π+2) sin x − (π/2) sin 2x + ((π+2)/3) sin 3x − (π/4) sin 4x + …]，0 &lt; x &lt; π</div>
          <p>在端点 x = 0、π 处级数收敛于 0，与 f(x) = x+1 的值不同。注：利用此类展式可求一些特殊级数的和（如 x=0 时可求 ∑1/n² 等）。</p>
          `,
        },
        {
          type: 'html',
          html: `
          <h3 id="sec-ch13-fourier-2l">四、周期为 2l 的函数的傅里叶展开式</h3>
          <p>对周期为 2l 的函数 f(x)，作变量代换 z = (π/l)x，则 F(z) = f(lz/π) 是周期为 2π 的函数，将 F(z) 作傅里叶展开后再代回，即得 f(x) 的展开式。</p>
          <div class="callout key">
            <p><strong>定理 5</strong>：设周期为 2l 的周期函数 f(x) 满足收敛定理条件（狄利克雷条件：一个周期内连续或只有有限个第一类间断点，且只有有限个极值点），则在 f(x) 的连续点处有傅里叶级数展开式</p>
            <div class="formula">f(x) = a₀/2 + ∑<sub>n=1</sub><sup>∞</sup> [a<sub>n</sub> cos(nπx/l) + b<sub>n</sub> sin(nπx/l)]</div>
            <div class="formula">a<sub>n</sub> = (1/l)∫<sub>−l</sub><sup>l</sup> f(x) cos(nπx/l) dx　(n = 0, 1, 2, …)</div>
            <div class="formula">b<sub>n</sub> = (1/l)∫<sub>−l</sub><sup>l</sup> f(x) sin(nπx/l) dx　(n = 1, 2, …)</div>
          </div>
          <p>证明：令 z = πx/l，则 F(z) = f(lz/π) 是以 2π 为周期的周期函数且满足收敛定理条件，将其展成傅里叶级数后再令 z = πx/l 代回，并把积分变量换回 x（dx = (l/π)dz，积分区间 [−π,π] 变为 [−l,l]），即得上述公式。</p>
          `,
        },
      ],
    },
  ],
};

export default ch;
