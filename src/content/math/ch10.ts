/* 高等数学 · 第10章 重积分 —— 依据课件 dsh10-1「二重积分的概念与性质」、dsh10-2「二重积分的计算」、dsh10-4「三重积分的计算」整理 */
import type { MathChapter } from './types';

const ch: MathChapter = {
  id: 'ch10',
  no: '第10章',
  title: '重积分',
  subtitle: '第 10 章 · 重积分',
  lede: `
  重积分是定积分在<strong>多元函数</strong>与<strong>高维区域</strong>上的推广，包括二重积分与三重积分。
  本章按照「概念 → 性质 → 计算」的顺序展开：<strong>二重积分</strong>的几何意义是曲顶柱体的体积，
  计算时可化为二次积分（直角坐标或极坐标）；<strong>三重积分</strong>可化为三次积分（直角坐标、柱面坐标或球面坐标）。
  选择适当的坐标系、正确配置积分限是计算的关键。
`,
  toc: [
    { id: 'sec-ch10-double-basic', text: '1. 二重积分的概念与性质', level: 2 },
    { id: 'sec-ch10-double-calc', text: '2. 二重积分的计算', level: 2 },
    { id: 'sec-ch10-triple', text: '3. 三重积分的计算', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ch10-double-basic',
      heading: '1. 二重积分的概念与性质',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ch10-double-basic-h1">一、二重积分的概念</h3>
          <p><strong>引例 1（曲顶柱体的体积）</strong>：设 D 是 xOy 面上的有界闭区域，f(x,y) ≥ 0 且在 D 上连续，以 D 为底、曲面 z = f(x,y) 为顶的曲顶柱体，其体积 V 用「分割、近似、求和、取极限」四步得到</p>
          <div class="formula">V = lim<sub>λ→0</sub> ∑<sub>i=1</sub><sup>n</sup> f(ξ<sub>i</sub>, η<sub>i</sub>) Δσ<sub>i</sub>，λ = max{Δσ<sub>i</sub> 的直径}</div>
          <p><strong>引例 2（平面薄片的质量）</strong>：设薄片占据 xOy 面有界闭区域 D，面密度 ρ(x,y) &gt; 0 且连续，则质量</p>
          <div class="formula">M = lim<sub>λ→0</sub> ∑<sub>i=1</sub><sup>n</sup> ρ(ξ<sub>i</sub>, η<sub>i</sub>) Δσ<sub>i</sub></div>
          <p><strong>定义 10.1（二重积分）</strong>：设 f(x,y) 在有界闭区域 D 上有界。用任意曲线网将 D 分成 n 个小闭区域 Δσ<sub>1</sub>, …, Δσ<sub>n</sub>，记其面积仍为 Δσ<sub>i</sub>；在每个 Δσ<sub>i</sub> 上任取一点 (ξ<sub>i</sub>, η<sub>i</sub>)，作和 ∑<sub>i=1</sub><sup>n</sup> f(ξ<sub>i</sub>, η<sub>i</sub>)Δσ<sub>i</sub>。记 λ 为各小区域直径的最大值，若极限</p>
          <div class="formula">lim<sub>λ→0</sub> ∑<sub>i=1</sub><sup>n</sup> f(ξ<sub>i</sub>, η<sub>i</sub>) Δσ<sub>i</sub></div>
          <p>存在且与 D 的分割方式、点的取法无关，则称此极限为 f(x,y) 在 D 上的<strong>二重积分</strong>，记作</p>
          <div class="formula">∬<sub>D</sub> f(x,y) dσ = lim<sub>λ→0</sub> ∑<sub>i=1</sub><sup>n</sup> f(ξ<sub>i</sub>, η<sub>i</sub>) Δσ<sub>i</sub></div>
          <p>其中 f(x,y) 为<strong>被积函数</strong>，D 为<strong>积分区域</strong>，dσ 为<strong>面积元素</strong>（在直角坐标系中 dσ = dxdy）。</p>
          <div class="callout key">
            <p><strong>几何意义</strong>：当 f(x,y) ≥ 0 时，∬<sub>D</sub> f(x,y) dσ 表示以 D 为底、z = f(x,y) 为顶的曲顶柱体体积；当 f(x,y) ≤ 0 时，二重积分为负，其绝对值等于相应柱体体积；当 f(x,y) 在 D 上变号时，二重积分等于各部分柱体体积的代数和。</p>
            <p><strong>存在性</strong>：若 f(x,y) 在有界闭区域 D 上连续，则二重积分存在；更一般地，若 f 在 D 上有界且不连续点只分布在有限条光滑曲线上，则二重积分仍存在。</p>
          </div>
          <h3 id="sec-ch10-double-basic-h2">二、二重积分的性质</h3>
          <p>二重积分与定积分有类似的性质（设下列积分均存在）：</p>
          <div class="formula">性质 1（线性性）：∬<sub>D</sub> [αf(x,y) + βg(x,y)] dσ = α∬<sub>D</sub> f dσ + β∬<sub>D</sub> g dσ</div>
          <div class="formula">性质 2（区域可加）：D = D<sub>1</sub> ∪ D<sub>2</sub>，D<sub>1</sub>、D<sub>2</sub> 无公共内点 ⇒ ∬<sub>D</sub> f dσ = ∬<sub>D<sub>1</sub></sub> f dσ + ∬<sub>D<sub>2</sub></sub> f dσ</div>
          <div class="formula">性质 3（保序性）：若 f(x,y) ≤ g(x,y) 在 D 上成立，则 ∬<sub>D</sub> f dσ ≤ ∬<sub>D</sub> g dσ</div>
          <div class="formula">性质 4（估值定理）：m ≤ f(x,y) ≤ M，则 m·σ ≤ ∬<sub>D</sub> f dσ ≤ M·σ，其中 σ 为 D 的面积</div>
          <div class="formula">性质 5（中值定理）：f 在 D 上连续，则存在 (ξ, η) ∈ D，使 ∬<sub>D</sub> f dσ = f(ξ, η)·σ</div>
          <div class="formula">性质 6（绝对可积）：∬<sub>D</sub> |f(x,y)| dσ ≤ ∬<sub>D</sub> |f(x,y)| dσ（被积函数取绝对值）</div>
          <div class="callout tip">
            <p><strong>对称性</strong>（简化计算的常用性质）：</p>
            <p>① 若 D 关于 x 轴对称，且 f(x, −y) = −f(x, y)（关于 y 为奇函数），则 ∬<sub>D</sub> f dσ = 0；若 f(x, −y) = f(x, y)（关于 y 为偶函数），则 ∬<sub>D</sub> f dσ = 2∬<sub>D∩{y≥0}</sub> f dσ。</p>
            <p>② 若 D 关于 y 轴对称，且 f(−x, y) = −f(x, y)，则 ∬<sub>D</sub> f dσ = 0；若 f(−x, y) = f(x, y)，则 ∬<sub>D</sub> f dσ = 2∬<sub>D∩{x≥0}</sub> f dσ。</p>
            <p>③ 若 D 关于直线 y = x 对称，则 ∬<sub>D</sub> f(x,y) dσ = ∬<sub>D</sub> f(y,x) dσ（轮换对称性）。</p>
          </div>
          `,
        },
      ],
    },
    {
      id: 'sec-ch10-double-calc',
      heading: '2. 二重积分的计算',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ch10-double-calc-h1">一、利用直角坐标计算二重积分</h3>
          <p><strong>X-型区域</strong>：D = { (x,y) | φ<sub>1</sub>(x) ≤ y ≤ φ<sub>2</sub>(x), a ≤ x ≤ b }，其中 φ<sub>1</sub>、φ<sub>2</sub> 在 [a,b] 上连续。此时二重积分化为<strong>先对 y 后对 x</strong> 的二次积分</p>
          <div class="formula">∬<sub>D</sub> f(x,y) dσ = ∫<sub>a</sub><sup>b</sup> dx ∫<sub>φ<sub>1</sub>(x)</sub><sup>φ<sub>2</sub>(x)</sup> f(x,y) dy</div>
          <p><strong>Y-型区域</strong>：D = { (x,y) | ψ<sub>1</sub>(y) ≤ x ≤ ψ<sub>2</sub>(y), c ≤ y ≤ d }，则化为<strong>先对 x 后对 y</strong> 的二次积分</p>
          <div class="formula">∬<sub>D</sub> f(x,y) dσ = ∫<sub>c</sub><sup>d</sup> dy ∫<sub>ψ<sub>1</sub>(y)</sub><sup>ψ<sub>2</sub>(y)</sup> f(x,y) dx</div>
          <p>若 D 既是 X-型又是 Y-型区域，两种积分顺序均可，按被积函数与区域边界选择更简单的一种。若 D 既不是 X-型也不是 Y-型，可将 D 分成若干 X-型或 Y-型子区域，由区域可加性分别计算后相加。</p>
          <div class="callout key">
            <p><strong>计算要点</strong>：(1) 画区域图形，确定积分限；(2) 内层积分限为外层积分变量的函数（或常数），外层积分限为常数；(3) 积分限下限 ≤ 上限；(4) 必要时交换积分次序以简化计算。</p>
          </div>
          <p><strong>例 1</strong> 计算 ∬<sub>D</sub> (x + 2y) dσ，其中 D 由 y = x、y = x<sup>2</sup> 所围成。</p>
          <p>解：D = { (x,y) | x<sup>2</sup> ≤ y ≤ x, 0 ≤ x ≤ 1 }（X-型），故</p>
          <div class="formula">∬<sub>D</sub> (x+2y) dσ = ∫<sub>0</sub><sup>1</sup> dx ∫<sub>x<sup>2</sup></sub><sup>x</sup> (x+2y) dy = ∫<sub>0</sub><sup>1</sup> [xy + y<sup>2</sup>]<sub>x<sup>2</sup></sub><sup>x</sup> dx = ∫<sub>0</sub><sup>1</sup> (x<sup>2</sup> − x<sup>4</sup>) dx = 1/3 − 1/5 = 2/15</div>
          <p><strong>例 2（交换积分次序）</strong> 计算 ∫<sub>0</sub><sup>1</sup> dx ∫<sub>x</sub><sup>1</sup> e<sup>y<sup>2</sup></sup> dy。</p>
          <p>解：内层积分 ∫ e<sup>y<sup>2</sup></sup> dy 无初等原函数，需交换积分次序。原积分为 D = { (x,y) | x ≤ y ≤ 1, 0 ≤ x ≤ 1 }（X-型），换为 Y-型 D = { (x,y) | 0 ≤ x ≤ y, 0 ≤ y ≤ 1 }，故</p>
          <div class="formula">原式 = ∫<sub>0</sub><sup>1</sup> dy ∫<sub>0</sub><sup>y</sup> e<sup>y<sup>2</sup></sup> dx = ∫<sub>0</sub><sup>1</sup> y e<sup>y<sup>2</sup></sup> dy = (1/2)(e − 1)</div>
          <p><strong>例 3</strong> 计算 ∬<sub>D</sub> |y − x<sup>2</sup>| dσ，其中 D: −1 ≤ x ≤ 1, 0 ≤ y ≤ 2。</p>
          <p>解：用曲线 y = x<sup>2</sup> 将 D 分成 D<sub>1</sub>（y ≥ x<sup>2</sup>，被积函数取 y − x<sup>2</sup>）与 D<sub>2</sub>（y ≤ x<sup>2</sup>，被积函数取 x<sup>2</sup> − y）。先算</p>
          <div class="formula">∬<sub>D<sub>1</sub></sub> (y−x<sup>2</sup>) dσ = ∫<sub>−1</sub><sup>1</sup> dx ∫<sub>x<sup>2</sup></sub><sup>2</sup> (y−x<sup>2</sup>) dy = ∫<sub>−1</sub><sup>1</sup> [y<sup>2</sup>/2 − x<sup>2</sup>y]<sub>x<sup>2</sup></sub><sup>2</sup> dx = 2 + 2/5 − 2/3 = 46/15</div>
          <div class="formula">∬<sub>D<sub>2</sub></sub> (x<sup>2</sup>−y) dσ = ∫<sub>−1</sub><sup>1</sup> dx ∫<sub>0</sub><sup>x<sup>2</sup></sup> (x<sup>2</sup>−y) dy = ∫<sub>−1</sub><sup>1</sup> x<sup>4</sup>/2 dx = 1/5</div>
          <p>故原式 = 46/15 + 1/5 = 49/15。</p>
          <h3 id="sec-ch10-double-calc-h2">二、利用极坐标计算二重积分</h3>
          <p>当积分区域为圆域、扇形、环形，或被积函数含 x<sup>2</sup>+y<sup>2</sup> 时，采用极坐标 x = r cos θ、y = r sin θ 计算更简便。此时面积元素</p>
          <div class="formula">dσ = dxdy = r dr dθ</div>
          <div class="formula">∬<sub>D</sub> f(x,y) dσ = ∬<sub>D′</sub> f(r cos θ, r sin θ) r dr dθ</div>
          <p>其中 D′ 为 D 在极坐标下的区域。常见极坐标区域：</p>
          <ul>
            <li><strong>极点在区域外</strong>：D: α ≤ θ ≤ β, r<sub>1</sub>(θ) ≤ r ≤ r<sub>2</sub>(θ)，则 ∬<sub>D′</sub> = ∫<sub>α</sub><sup>β</sup> dθ ∫<sub>r<sub>1</sub>(θ)</sub><sup>r<sub>2</sub>(θ)</sup> f(r cos θ, r sin θ) r dr。</li>
            <li><strong>极点在区域边界</strong>：D: α ≤ θ ≤ β, 0 ≤ r ≤ r(θ)，则 ∬<sub>D′</sub> = ∫<sub>α</sub><sup>β</sup> dθ ∫<sub>0</sub><sup>r(θ)</sup> f(r cos θ, r sin θ) r dr。</li>
            <li><strong>极点在区域内部</strong>：D: 0 ≤ θ ≤ 2π, 0 ≤ r ≤ r(θ)，则 ∬<sub>D′</sub> = ∫<sub>0</sub><sup>2π</sup> dθ ∫<sub>0</sub><sup>r(θ)</sup> f(r cos θ, r sin θ) r dr。</li>
          </ul>
          <p><strong>例 4</strong> 计算 ∬<sub>D</sub> (x<sup>2</sup> + y<sup>2</sup>) dσ，其中 D 为圆环 a<sup>2</sup> ≤ x<sup>2</sup>+y<sup>2</sup> ≤ b<sup>2</sup>（0 &lt; a &lt; b）。</p>
          <p>解：极坐标下 D′: 0 ≤ θ ≤ 2π, a ≤ r ≤ b，故</p>
          <div class="formula">∬<sub>D</sub> (x<sup>2</sup>+y<sup>2</sup>) dσ = ∫<sub>0</sub><sup>2π</sup> dθ ∫<sub>a</sub><sup>b</sup> r<sup>2</sup>·r dr = 2π·[r<sup>4</sup>/4]<sub>a</sub><sup>b</sup> = (π/2)(b<sup>4</sup> − a<sup>4</sup>)</div>
          <p><strong>例 5</strong> 计算 ∬<sub>D</sub> e<sup>−(x<sup>2</sup>+y<sup>2</sup>)</sup> dσ，其中 D 为 x<sup>2</sup>+y<sup>2</sup> ≤ 1。</p>
          <p>解：D′: 0 ≤ θ ≤ 2π, 0 ≤ r ≤ 1，故</p>
          <div class="formula">∬<sub>D</sub> e<sup>−(x<sup>2</sup>+y<sup>2</sup>)</sup> dσ = ∫<sub>0</sub><sup>2π</sup> dθ ∫<sub>0</sub><sup>1</sup> e<sup>−r<sup>2</sup></sup> r dr = 2π·[−e<sup>−r<sup>2</sup></sup>/2]<sub>0</sub><sup>1</sup> = π(1 − e<sup>−1</sup>)</div>
          <p><strong>例 6</strong> 计算 ∬<sub>D</sub> √(x<sup>2</sup>+y<sup>2</sup>) dσ，其中 D 由 x<sup>2</sup>+y<sup>2</sup> = 2x 所围成。</p>
          <p>解：极坐标下 D′: −π/2 ≤ θ ≤ π/2, 0 ≤ r ≤ 2cos θ，故</p>
          <div class="formula">原式 = ∫<sub>−π/2</sub><sup>π/2</sup> dθ ∫<sub>0</sub><sup>2cos θ</sup> r·r dr = ∫<sub>−π/2</sub><sup>π/2</sup> (8/3)cos<sup>3</sup>θ dθ = (8/3)·(4/3) = 32/9</div>
          <p><strong>例 7</strong> 求由曲面 z = x<sup>2</sup>+y<sup>2</sup>、z = 2x<sup>2</sup>+2y<sup>2</sup>、z = 1 所围立体的体积。</p>
          <p>解：立体在 xOy 面上的投影 D: x<sup>2</sup>+y<sup>2</sup> ≤ 1/2；对 D 内每点 (x,y)，z 从 x<sup>2</sup>+y<sup>2</sup> 变到 min{2(x<sup>2</sup>+y<sup>2</sup>), 1}。由 x<sup>2</sup>+y<sup>2</sup> = 1/2 知</p>
          <div class="formula">V = ∬<sub>D</sub> [min{2(x<sup>2</sup>+y<sup>2</sup>), 1} − (x<sup>2</sup>+y<sup>2</sup>)] dσ</div>
          <p>用极坐标 x = r cos θ、y = r sin θ，D′: 0 ≤ θ ≤ 2π, 0 ≤ r ≤ 1/√2：</p>
          <div class="formula">V = ∫<sub>0</sub><sup>2π</sup> dθ ∫<sub>0</sub><sup>1/√2</sup> (2r<sup>2</sup> − r<sup>2</sup>)·r dr + ∫<sub>0</sub><sup>2π</sup> dθ ∫<sub>1/√2</sub><sup>1</sup> (1 − r<sup>2</sup>)·r dr = 2π·[(1/4)(1/2)<sup>2</sup>] + 2π·[r<sup>2</sup>/2 − r<sup>4</sup>/4]<sub>1/√2</sub><sup>1</sup> = π/8 + π/8 = π/4</div>
          `,
        },
      ],
    },
    {
      id: 'sec-ch10-triple',
      heading: '3. 三重积分的计算',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ch10-triple-h1">一、三重积分的概念</h3>
          <p><strong>定义 10.2</strong>：设 f(x,y,z) 在空间有界闭区域 Ω 上有界，将 Ω 任意分成 n 个小闭区域 ΔV<sub>1</sub>, …, ΔV<sub>n</sub>，在每个 ΔV<sub>i</sub> 上任取一点 (ξ<sub>i</sub>, η<sub>i</sub>, ζ<sub>i</sub>)，记 λ 为各小区域直径的最大值，若极限</p>
          <div class="formula">lim<sub>λ→0</sub> ∑<sub>i=1</sub><sup>n</sup> f(ξ<sub>i</sub>, η<sub>i</sub>, ζ<sub>i</sub>) ΔV<sub>i</sub></div>
          <p>存在且与分割方式、取点方式无关，则称此极限为 f(x,y,z) 在 Ω 上的<strong>三重积分</strong>，记作</p>
          <div class="formula">∭<sub>Ω</sub> f(x,y,z) dV = lim<sub>λ→0</sub> ∑<sub>i=1</sub><sup>n</sup> f(ξ<sub>i</sub>, η<sub>i</sub>, ζ<sub>i</sub>) ΔV<sub>i</sub></div>
          <p>其中 dV 为体积元素，直角坐标系下 dV = dxdydz。<strong>物理意义</strong>：若 ρ(x,y,z) 表示空间物体在点 (x,y,z) 处的体密度，则 ∭<sub>Ω</sub> ρ(x,y,z) dV 为 Ω 的质量。</p>
          <div class="callout key">
            <p><strong>存在性</strong>：若 f 在 Ω 上连续，则三重积分存在。三重积分具有与二重积分类似的线性性、区域可加性、保序性、估值定理与中值定理。若 Ω 关于某坐标面对称且被积函数关于相应坐标为奇函数，则三重积分为 0。</p>
          </div>
          <h3 id="sec-ch10-triple-h2">二、利用直角坐标计算三重积分</h3>
          <p><strong>投影法（先一后二法）</strong>：若 Ω 在 xOy 面上的投影区域为 D<sub>xy</sub>，且 Ω = { (x,y,z) | z<sub>1</sub>(x,y) ≤ z ≤ z<sub>2</sub>(x,y), (x,y) ∈ D<sub>xy</sub> }，则</p>
          <div class="formula">∭<sub>Ω</sub> f(x,y,z) dV = ∬<sub>D<sub>xy</sub></sub> [∫<sub>z<sub>1</sub>(x,y)</sub><sup>z<sub>2</sub>(x,y)</sup> f(x,y,z) dz] dxdy</div>
          <p>即把三重积分化为「先对 z 的单积分，再对 x、y 的二重积分」。</p>
          <p><strong>截面法（先二后一法）</strong>：若 Ω 在 z 轴上的投影区间为 [c,d]，且过 z ∈ [c,d] 作垂直于 z 轴的平面截 Ω 得截面 D<sub>z</sub>，则</p>
          <div class="formula">∭<sub>Ω</sub> f(x,y,z) dV = ∫<sub>c</sub><sup>d</sup> dz ∬<sub>D<sub>z</sub></sub> f(x,y,z) dxdy</div>
          <p>此法常用于被积函数仅与 z 有关、或截面 D<sub>z</sub> 的面积易求的情形。</p>
          <p><strong>例 1</strong> 计算 ∭<sub>Ω</sub> z dV，其中 Ω 由 z = x<sup>2</sup>+y<sup>2</sup> 与 z = 1 所围成。</p>
          <p>解：Ω 在 xOy 面上的投影 D<sub>xy</sub>: x<sup>2</sup>+y<sup>2</sup> ≤ 1。对 (x,y) ∈ D<sub>xy</sub>，z 从 x<sup>2</sup>+y<sup>2</sup> 变到 1，故</p>
          <div class="formula">∭<sub>Ω</sub> z dV = ∬<sub>D<sub>xy</sub></sub> dxdy ∫<sub>x<sup>2</sup>+y<sup>2</sup></sub><sup>1</sup> z dz = (1/2) ∬<sub>D<sub>xy</sub></sub> [1 − (x<sup>2</sup>+y<sup>2</sup>)<sup>2</sup>] dxdy</div>
          <p>用极坐标 x = r cos θ、y = r sin θ，D′: 0 ≤ θ ≤ 2π, 0 ≤ r ≤ 1：</p>
          <div class="formula">原式 = (1/2) ∫<sub>0</sub><sup>2π</sup> dθ ∫<sub>0</sub><sup>1</sup> (1 − r<sup>4</sup>) r dr = π·[r<sup>2</sup>/2 − r<sup>6</sup>/6]<sub>0</sub><sup>1</sup> = π/3</div>
          <p><strong>例 2（截面法）</strong> 计算 ∭<sub>Ω</sub> z<sup>2</sup> dV，其中 Ω 由椭球面 x<sup>2</sup>/a<sup>2</sup> + y<sup>2</sup>/b<sup>2</sup> + z<sup>2</sup>/c<sup>2</sup> = 1 所围成。</p>
          <p>解：用 z = z<sub>0</sub> 截 Ω 得椭圆截面 D<sub>z<sub>0</sub></sub>: x<sup>2</sup>/a<sup>2</sup> + y<sup>2</sup>/b<sup>2</sup> ≤ 1 − z<sub>0</sub><sup>2</sup>/c<sup>2</sup>，其面积为 πab(1 − z<sub>0</sub><sup>2</sup>/c<sup>2</sup>)。由截面法</p>
          <div class="formula">∭<sub>Ω</sub> z<sup>2</sup> dV = ∫<sub>−c</sub><sup>c</sup> z<sup>2</sup>·πab(1 − z<sup>2</sup>/c<sup>2</sup>) dz = 2πab·[z<sup>3</sup>/3 − z<sup>5</sup>/(5c<sup>2</sup>)]<sub>0</sub><sup>c</sup> = (4/15)πabc<sup>3</sup></div>
          <h3 id="sec-ch10-triple-h3">三、利用柱面坐标计算三重积分</h3>
          <p>柱面坐标：x = r cos θ、y = r sin θ、z = z（其中 0 ≤ r &lt; +∞，0 ≤ θ ≤ 2π，−∞ &lt; z &lt; +∞）。体积元素</p>
          <div class="formula">dV = dx dy dz = r dr dθ dz</div>
          <div class="formula">∭<sub>Ω</sub> f(x,y,z) dV = ∭<sub>Ω′</sub> f(r cos θ, r sin θ, z) r dr dθ dz</div>
          <p>常用于 Ω 为旋转体（如圆柱、圆锥、旋转抛物面）或被积函数含 x<sup>2</sup>+y<sup>2</sup> 的情形。计算时通常先固定 z，将 Ω 在 xOy 面上的截面（极坐标下）积分，再对 z 积分。</p>
          <p><strong>例 3</strong> 计算 ∭<sub>Ω</sub> (x<sup>2</sup>+y<sup>2</sup>) dV，其中 Ω 由旋转抛物面 z = 2 − x<sup>2</sup> − y<sup>2</sup> 与 z = 0 所围成。</p>
          <p>解：Ω 在柱坐标下为 0 ≤ z ≤ 2 − r<sup>2</sup>、0 ≤ r ≤ √2、0 ≤ θ ≤ 2π。被积函数 x<sup>2</sup>+y<sup>2</sup> = r<sup>2</sup>，故</p>
          <div class="formula">∭<sub>Ω</sub> (x<sup>2</sup>+y<sup>2</sup>) dV = ∫<sub>0</sub><sup>2π</sup> dθ ∫<sub>0</sub><sup>√2</sup> r<sup>2</sup>·r dr ∫<sub>0</sub><sup>2−r<sup>2</sup></sup> dz = 2π ∫<sub>0</sub><sup>√2</sup> (2r<sup>3</sup> − r<sup>5</sup>) dr = 2π·[r<sup>4</sup>/2 − r<sup>6</sup>/6]<sub>0</sub><sup>√2</sup> = 8π/3</div>
          <h3 id="sec-ch10-triple-h4">四、利用球面坐标计算三重积分</h3>
          <p>球面坐标：x = ρ sin φ cos θ、y = ρ sin φ sin θ、z = ρ cos φ（其中 0 ≤ ρ &lt; +∞，0 ≤ φ ≤ π，0 ≤ θ ≤ 2π）。体积元素</p>
          <div class="formula">dV = dx dy dz = ρ<sup>2</sup> sin φ dρ dφ dθ</div>
          <div class="formula">∭<sub>Ω</sub> f(x,y,z) dV = ∭<sub>Ω′</sub> f(ρ sin φ cos θ, ρ sin φ sin θ, ρ cos φ) ρ<sup>2</sup> sin φ dρ dφ dθ</div>
          <p>常用于 Ω 为球体、球锥、半球体或被积函数含 x<sup>2</sup>+y<sup>2</sup>+z<sup>2</sup> 的情形。</p>
          <p><strong>例 4</strong> 计算 ∭<sub>Ω</sub> (x<sup>2</sup>+y<sup>2</sup>+z<sup>2</sup>) dV，其中 Ω 由球面 x<sup>2</sup>+y<sup>2</sup>+z<sup>2</sup> = 1 所围成。</p>
          <p>解：球面坐标下 Ω′: 0 ≤ ρ ≤ 1, 0 ≤ φ ≤ π, 0 ≤ θ ≤ 2π。被积函数 x<sup>2</sup>+y<sup>2</sup>+z<sup>2</sup> = ρ<sup>2</sup>，故</p>
          <div class="formula">∭<sub>Ω</sub> (x<sup>2</sup>+y<sup>2</sup>+z<sup>2</sup>) dV = ∫<sub>0</sub><sup>2π</sup> dθ ∫<sub>0</sub><sup>π</sup> sin φ dφ ∫<sub>0</sub><sup>1</sup> ρ<sup>2</sup>·ρ<sup>2</sup> dρ = 2π·2·[ρ<sup>5</sup>/5]<sub>0</sub><sup>1</sup> = 4π/5</div>
          <p><strong>例 5</strong> 计算 ∭<sub>Ω</sub> z dV，其中 Ω 由球面 x<sup>2</sup>+y<sup>2</sup>+z<sup>2</sup> = 2z（即 x<sup>2</sup>+y<sup>2</sup>+(z−1)<sup>2</sup> = 1）所围成。</p>
          <p>解：球面坐标下 Ω′: 0 ≤ ρ ≤ 2cos φ, 0 ≤ φ ≤ π/2, 0 ≤ θ ≤ 2π。z = ρ cos φ，故</p>
          <div class="formula">∭<sub>Ω</sub> z dV = ∫<sub>0</sub><sup>2π</sup> dθ ∫<sub>0</sub><sup>π/2</sup> dφ ∫<sub>0</sub><sup>2cos φ</sup> ρ cos φ·ρ<sup>2</sup> sin φ dρ = 2π ∫<sub>0</sub><sup>π/2</sup> cos φ sin φ·[(2cos φ)<sup>4</sup>/4] dφ</div>
          <p>令 u = cos φ，得</p>
          <div class="formula">原式 = 2π·4 ∫<sub>0</sub><sup>1</sup> u<sup>5</sup> du = 8π·[u<sup>6</sup>/6]<sub>0</sub><sup>1</sup> = 4π/3</div>
          `,
        },
      ],
    },
  ],
};

export default ch;