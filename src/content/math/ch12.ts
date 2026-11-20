/* 高等数学 · 第 12 章 曲面积分 —— 依据课件 dsh12-2「对坐标的曲面积分」、dsh12-3「高斯公式与斯托克斯公式」整理 */
import type { MathChapter } from './types';

const ch: MathChapter = {
  id: 'ch12',
  no: '第12章',
  title: '曲面积分',
  subtitle: '第 12 章 · 曲面积分',
  lede: `
  本章把二重积分推广到<strong>有向曲面</strong>上：先由曲面侧的划分引出对坐标的曲面积分（第二类曲面积分），
  再建立它与对面积的曲面积分（第一类曲面积分）的联系，给出化为二重积分的计算法（含「三合一投影法」）。
  最后介绍<strong>高斯公式</strong>（三重积分 ↔ 闭曲面积分）与<strong>斯托克斯公式</strong>（曲面积分 ↔ 边界曲线积分），
  它们分别是格林公式在三维空间的两种推广，是本章计算与证明的核心工具。
`,
  toc: [
    { id: 'sec-ch12-surface', text: '1. 对坐标的曲面积分', level: 2 },
    { id: 'sec-ch12-gauss-stokes', text: '2. 高斯公式与斯托克斯公式', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ch12-surface',
      heading: '1. 对坐标的曲面积分',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ch12-surface-s1">12.1 曲面的侧与有向曲面</h3>
          <p><strong>定义 12.1（双侧曲面与单侧曲面）</strong>：设光滑曲面 Σ 上任取一点 M，Σ 在 M 处的法向量有两个方向。约定法向量 q 从 M 出发，在曲面上连续移动且不越过曲面的边界再回到 M 时，若其方向总与出发时的方向相同，则称曲面 Σ 为<strong>双侧曲面</strong>；否则称为<strong>单侧曲面</strong>（课件配图为默比乌斯带）。</p>
          <p><strong>有向曲面</strong>：在曲面 Σ 上选取一点 M 处的一个法线方向，让此法向量在 Σ 上连续移动一周后回到 M，若法向量的方向与开始时相同，就称 Σ 为<strong>有向曲面</strong>，法向量的方向称为曲面的<strong>侧向</strong>。设单位法向量为 <span class="m">n = (cos α, cos β, cos γ)</span>，其方向余弦确定侧向。</p>
          <div class="formula">Σ 上侧：n 指向上，γ 为锐角；n = { −z′<sub>x</sub>/√(1+z′<sub>x</sub>²+z′<sub>y</sub>²), −z′<sub>y</sub>/√(1+z′<sub>x</sub>²+z′<sub>y</sub>²), 1/√(1+z′<sub>x</sub>²+z′<sub>y</sub>²) }</div>
          <div class="formula">Σ 下侧：n 指向下，γ 为钝角；n = { z′<sub>x</sub>/√(1+z′<sub>x</sub>²+z′<sub>y</sub>²), z′<sub>y</sub>/√(1+z′<sub>x</sub>²+z′<sub>y</sub>²), −1/√(1+z′<sub>x</sub>²+z′<sub>y</sub>²) }</div>
          <div class="formula">Σ 右侧（y = y(x,z)）：n = { −y′<sub>x</sub>/√(1+y′<sub>x</sub>²+y′<sub>z</sub>²), 1/√(1+y′<sub>x</sub>²+y′<sub>z</sub>²), −y′<sub>z</sub>/√(1+y′<sub>x</sub>²+y′<sub>z</sub>²) }；左侧取相反号</div>
          <div class="formula">Σ 前侧（x = x(y,z)）：n = { 1/√(1+x′<sub>y</sub>²+x′<sub>z</sub>²), −x′<sub>y</sub>/√(1+x′<sub>y</sub>²+x′<sub>z</sub>²), −x′<sub>z</sub>/√(1+x′<sub>y</sub>²+x′<sub>z</sub>²) }；后侧取相反号</div>
          <p>对封闭曲面，法线指向空间区域<strong>外部</strong>的一侧称为<strong>外侧</strong>，指向内部的一侧称为<strong>内侧</strong>。球面 x²+y²+z²=R² 的外侧各点法向量与矢径同向。</p>
          <p><strong>有向曲面在坐标面上的投影</strong>：设 Σ 上小片面积 ΔS，其单位法向量 n = (cos α, cos β, cos γ)（取指定侧），它在三个坐标面上的有向投影为</p>
          <div class="formula">Δσ<sub>yz</sub> = cos α·ΔS，Δσ<sub>zx</sub> = cos β·ΔS，Δσ<sub>xy</sub> = cos γ·ΔS　　(12.2.1)</div>
          <p>可见有向投影可正、可负、可为零，这与二重积分中非负的面积元素不同。</p>
          `,
        },
        {
          type: 'html',
          html: `
          <h3 id="sec-ch12-surface-s2">二、对坐标的曲面积分的概念与性质</h3>
          <p><strong>引例（流量）</strong>：设稳定流动的不可压缩流体速度场为 <span class="m">v = (P(x,y,z), Q(x,y,z), R(x,y,z))</span>，求单位时间流过有向曲面 Σ 指定一侧的流量 Φ。若 Σ 是面积为 S 的平面、流速为常向量 n，则 Φ = S·v·n = S|v|cos θ；对一般有向曲面，用「大化小、常代变、近似和、取极限」得</p>
          <div class="formula">Φ = lim<sub>λ→0</sub> ∑<sub>i=1</sub><sup>n</sup> [P(ξ<sub>i</sub>,η<sub>i</sub>,ζ<sub>i</sub>)(ΔS<sub>i</sub>)<sub>yz</sub> + Q(ξ<sub>i</sub>,η<sub>i</sub>,ζ<sub>i</sub>)(ΔS<sub>i</sub>)<sub>zx</sub> + R(ξ<sub>i</sub>,η<sub>i</sub>,ζ<sub>i</sub>)(ΔS<sub>i</sub>)<sub>xy</sub>]</div>
          <p><strong>定义 12.2</strong>：设 Σ 为光滑有向曲面，其上定义向量场 A = (P, Q, R)。若对 Σ 的任意分割与局部面元上任意取点，下列极限都存在，则称为向量场 A 在 Σ 上<strong>对坐标的曲面积分</strong>（或<strong>第二类曲面积分</strong>），记作</p>
          <div class="formula">∬<sub>Σ</sub> P dydz + Q dzdx + R dxdy</div>
          <p>其中 P、Q、R 叫做<strong>被积函数</strong>，Σ 叫做<strong>积分曲面</strong>。三项分别称为：∬<sub>Σ</sub> P dydz 是 P 在 Σ 上<strong>对 y, z</strong> 的曲面积分；∬<sub>Σ</sub> Q dzdx 是 Q 在 Σ 上<strong>对 z, x</strong> 的曲面积分；∬<sub>Σ</sub> R dxdy 是 R 在 Σ 上<strong>对 x, y</strong> 的曲面积分。</p>
          <div class="callout key">
            <p><strong>向量形式与注记</strong>：若记 Σ 正侧单位法向量 n = (cos α, cos β, cos γ)，令 dS = n dS = (dydz, dzdx, dxdy)，A = (P, Q, R)，则</p>
            <div class="formula">∬<sub>Σ</sub> P dydz + Q dzdx + R dxdy = ∬<sub>Σ</sub> A·n dS = ∬<sub>Σ</sub> A·dS</div>
            <p>注 1：引例中流量 Φ = ∬<sub>Σ</sub> P dydz + Q dzdx + R dxdy，即单位时间内流过 Σ 指定一侧的流量。</p>
            <p>注 2：dydz、dzdx、dxdy 分别是 Δσ<sub>yz</sub>、Δσ<sub>zx</sub>、Δσ<sub>xy</sub> 的极限，可正可负可为零；这与二重积分中的面积元素（恒非负）不同。</p>
            <p>注 3：三个对坐标的曲面积分之和也可写成三个积分相加；若 Σ 为封闭曲面，也记作 ∮∮<sub>Σ</sub>。</p>
          </div>
          <p><strong>性质（设所涉及的第二类曲面积分均存在）</strong>：</p>
          <div class="formula">性质 12.2.1：Σ⁻ 为 Σ 取相反侧，则 ∬<sub>Σ⁻</sub> A·dS = −∬<sub>Σ</sub> A·dS</div>
          <div class="formula">性质 12.2.2：k<sub>1</sub>,k<sub>2</sub>,k<sub>3</sub> 为常数，则 ∬<sub>Σ</sub>(k<sub>1</sub>P dydz+k<sub>2</sub>Q dzdx+k<sub>3</sub>R dxdy) = k<sub>1</sub>∬<sub>Σ</sub>P dydz+k<sub>2</sub>∬<sub>Σ</sub>Q dzdx+k<sub>3</sub>∬<sub>Σ</sub>R dxdy</div>
          <div class="formula">性质 12.2.3：Σ 分为 Σ<sub>1</sub>、Σ<sub>2</sub> 两部分且侧相同，则 ∬<sub>Σ</sub> = ∬<sub>Σ₁</sub> + ∬<sub>Σ₂</sub></div>
          <p>此外可证：若 P, Q, R 在 Σ 上连续，则 ∬<sub>Σ</sub> P dydz + Q dzdx + R dxdy 存在。</p>
          `,
        },
        {
          type: 'html',
          html: `
          <h3 id="sec-ch12-surface-s3">三、两类曲面积分之间的联系</h3>
          <p>由式 (12.2.1) 与元素法思想，取 Δσ<sub>yz</sub> ≈ cos α ΔS 等，得</p>
          <div class="formula">dσ<sub>yz</sub> = dydz = cos α dS，dσ<sub>zx</sub> = dzdx = cos β dS，dσ<sub>xy</sub> = dxdy = cos γ dS　　(12.2.3)</div>
          <div class="callout key">
            <p><strong>定理 12.2.1</strong>　设 Σ 为有向光滑曲面，则</p>
            <div class="formula">∬<sub>Σ</sub> P dydz + Q dzdx + R dxdy = ∬<sub>Σ</sub> [P cos α + Q cos β + R cos γ] dS　　(12.2.4)</div>
            <p>其中 {cos α, cos β, cos γ} 为 Σ 上指定侧的单位法向量。需要指出：<strong>无论 Σ 取哪一侧，式 (12.2.4) 总成立</strong>（侧的变化同时改变两类积分的符号）。</p>
          </div>
          <p>由 (12.2.4) 还得向量形式：∬<sub>Σ</sub> P dydz + Q dzdx + R dxdy = ∬<sub>Σ</sub> F·n dS = ∬<sub>Σ</sub> F·dS　(12.2.5)；并且 dS = {cos α, cos β, cos γ} dS = {dydz, dzdx, dxdy}。</p>
          `,
        },
        {
          type: 'html',
          html: `
          <h3 id="sec-ch12-surface-s4">12.2.4 对坐标的曲面积分的计算</h3>
          <p>基本思想是将其化为二重积分计算。</p>
          <div class="callout key">
            <p><strong>定理 12.2.2</strong>　设有向光滑曲面 Σ 的方程为 z = z(x,y)，Σ 在 xOy 面上的投影区域为 D<sub>xy</sub>，R(x,y,z) 在 Σ 上连续，则</p>
            <div class="formula">∬<sub>Σ</sub> R(x,y,z) dxdy = ± ∬<sub>D<sub>xy</sub></sub> R(x, y, z(x,y)) dxdy</div>
            <p>当 Σ 取上侧时二重积分前取正号，取下侧时取负号。</p>
          </div>
          <p><strong>计算三步曲</strong>：(1) 将 z = z(x,y) 代入 R(x,y,z)；(2) 确定 Σ 在 xOy 面上的投影区域 D<sub>xy</sub>；(3) 根据 Σ 取上侧或下侧，确定二重积分前的正负号。</p>
          <div class="formula">若 Σ: x = x(y,z)，(y,z) ∈ D<sub>yz</sub>，则 ∬<sub>Σ</sub> P dydz = ± ∬<sub>D<sub>yz</sub></sub> P(x(y,z), y, z) dydz　（前正后负）</div>
          <div class="formula">若 Σ: y = y(z,x)，(z,x) ∈ D<sub>zx</sub>，则 ∬<sub>Σ</sub> Q dzdx = ± ∬<sub>D<sub>zx</sub></sub> Q(x, y(z,x), z) dzdx　（右正左负）</div>
          <div class="callout warn">
            <p><strong>特别地</strong>：Σ 垂直于 xOy 面 ⇒ 有向投影 dxdy = 0 ⇒ ∬<sub>Σ</sub> R dxdy = 0；Σ 垂直于 yOz 面 ⇒ ∬<sub>Σ</sub> P dydz = 0；Σ 垂直于 zOx 面 ⇒ ∬<sub>Σ</sub> Q dzdx = 0。计算时分别求出三项，再相加即得 ∬<sub>Σ</sub> P dydz + Q dzdx + R dxdy。</p>
          </div>
          <p><strong>例 12.2.1</strong>　计算 ∬<sub>Σ</sub> z dxdy，其中 Σ 为空间区域 x²+y²+z² ≤ 1, x ≥ 0, y ≥ 0 的边界曲面，并取外侧。</p>
          <p>解：将封闭曲面分成四片：Σ₁: z = √(1−x²−y²) 取上侧；Σ₂: z = −√(1−x²−y²) 取下侧；Σ₃: y = 0 取左侧；Σ₄: x = 0 取后侧。Σ₃、Σ₄ 垂直于 xOy 面，其 dxdy 积分为 0；故</p>
          <div class="formula">∬<sub>Σ</sub> z dxdy = 2 ∬<sub>D<sub>xy</sub></sub> √(1−x²−y²) dxdy = 2∫<sub>0</sub><sup>π/2</sup> dθ ∫<sub>0</sub><sup>1</sup> r√(1−r²) dr = π/3</div>
          <p><strong>例 12.2.2</strong>　设有向曲面 Σ 为平面 2x+2y+z = 2 在第一卦限中的部分，并取上侧，计算 ∬<sub>Σ</sub> x dydz + y dzdx + (x+z) dxdy。</p>
          <p>解法一（逐项化为二重积分）：∬<sub>Σ</sub> x dydz 把 Σ 写成 x = 1−y−z/2 取前侧，投影 D<sub>yz</sub> = {(y,z) | 0 ≤ z ≤ 2−2y, 0 ≤ y ≤ 1}，得 1/3；∬<sub>Σ</sub> y dzdx 把 Σ 写成 y = 1−x−z/2 取右侧，得 1/3；∬<sub>Σ</sub> (x+z) dxdy 把 Σ 写成 z = 2−2x−2y 取上侧，D<sub>xy</sub> = {(x,y) | 0 ≤ y ≤ 1−x, 0 ≤ x ≤ 1}，得 1/2。所以</p>
          <div class="formula">∬<sub>Σ</sub> x dydz + y dzdx + (x+z) dxdy = 1/3 + 1/3 + 1/2 = 7/6</div>
          <p>解法二（利用两类曲面积分的联系）：Σ 取上侧时单位法向量 n = (2/3, 2/3, 1/3)，故原式 = (1/3)∬<sub>Σ</sub>(3x+2y+z) dS；又 dS = √(1+2²+2²) dxdy = 3 dxdy，代入 z = 2−2x−2y 得 ∬<sub>D<sub>xy</sub></sub>(x+2) dxdy = 7/6。</p>
          `,
        },
        {
          type: 'html',
          html: `
          <h3 id="sec-ch12-surface-s5">12.2.5 三合一投影法与例题</h3>
          <div class="callout key">
            <p><strong>定理 12.2.3（三合一投影法）</strong>　设有向光滑曲面 Σ 的方程为 z = z(x,y)，(x,y) ∈ D<sub>xy</sub>，P、Q、R 在 Σ 上连续，则</p>
            <div class="formula">∬<sub>Σ</sub> P dydz + Q dzdx + R dxdy = ∬<sub>Σ</sub> [R − P z′<sub>x</sub>(x,y) − Q z′<sub>y</sub>(x,y)] dxdy</div>
            <div class="formula">= ± ∬<sub>D<sub>xy</sub></sub> [R(x,y,z(x,y)) − P(x,y,z(x,y)) z′<sub>x</sub>(x,y) − Q(x,y,z(x,y)) z′<sub>y</sub>(x,y)] dxdy</div>
            <p>其中当 Σ 取上侧时二重积分前取正号，取下侧时取负号。基本思想：利用各投影之间的关系，将三个不同类型的积分转化为同一坐标面上的二重积分计算。</p>
          </div>
          <p><strong>例 12.2.3</strong>　利用三合一投影法计算例 12.2.2。将 Σ 表示为 z = 2−2x−2y，取上侧，z′<sub>x</sub> = −2、z′<sub>y</sub> = −2，D<sub>xy</sub> 同上，于是</p>
          <div class="formula">原式 = ∬<sub>D<sub>xy</sub></sub> [(x+2−2x−2y) + 2x + 2y] dxdy = ∬<sub>D<sub>xy</sub></sub> (x+2) dxdy = 7/6</div>
          <p><strong>例 12.2.4</strong>　计算曲面积分 ∬<sub>Σ</sub> (z²+y) dydz + 2xy dzdx + z dxdy，其中 Σ 是旋转抛物面 z = (1/2)(x²+y²) 介于平面 z = 0 和 z = 2 之间的部分的下侧。</p>
          <p>解：Σ 的方程为 z = (1/2)(x²+y²)，故 z′<sub>x</sub> = x，z′<sub>y</sub> = y，且取下侧；Σ 在 xOy 面上的投影区域 D<sub>xy</sub> = {(x,y) | x²+y² ≤ 4}。由定理 12.2.3，</p>
          <div class="formula">原式 = −∬<sub>D<sub>xy</sub></sub> { (1/2)(x²+y²) − [(1/4)(x²+y²)² + y]·x − 2xy·y } dxdy</div>
          <div class="formula">= ∬<sub>D<sub>xy</sub></sub> { x[(1/4)(x²+y²)² + y + 2y²] − (1/2)(x²+y²) } dxdy</div>
          <p>由二重积分的奇偶对称性，含 x 的部分积分为 0，所以</p>
          <div class="formula">原式 = −(1/2)∬<sub>D<sub>xy</sub></sub> (x²+y²) dxdy = −(1/2)∫<sub>0</sub><sup>2π</sup> dθ ∫<sub>0</sub><sup>2</sup> r³ dr = −4π</div>
          `,
        },
      ],
    },
    {
      id: 'sec-ch12-gauss-stokes',
      heading: '2. 高斯公式与斯托克斯公式',
      blocks: [
        {
          type: 'html',
          html: `
          <p>与牛顿—莱布尼兹公式、格林公式相仿：<strong>高斯公式</strong>建立空间区域 Ω 上的三重积分与 Ω 的边界闭曲面 Σ 上的曲面积分之间的联系；<strong>斯托克斯公式</strong>建立空间曲面 Σ 上的曲面积分与 Σ 的边界曲线 Γ 上的曲线积分之间的联系。</p>
          <h3 id="sec-ch12-gauss-stokes-s1">12.3.1 高斯公式</h3>
          <div class="callout key">
            <p><strong>定理 12.3.1（高斯公式）</strong>　设空间区域 Ω 是由光滑或分片光滑的封闭曲面 Σ 所围成，函数 P(x,y,z)、Q(x,y,z)、R(x,y,z) 在 Ω 上具有一阶连续偏导数，则</p>
            <div class="formula">∯<sub>Σ</sub> P dydz + Q dzdx + R dxdy = ∭<sub>Ω</sub> (∂P/∂x + ∂Q/∂y + ∂R/∂z) dV　　(12.3.1)</div>
            <p>其中 Σ 取<strong>外侧</strong>。</p>
          </div>
          <p><strong>证明思路</strong>（课件证明略）：先证 ∭<sub>Ω</sub> ∂R/∂z dV = ∬<sub>Σ</sub> R dxdy，类似可得 ∭<sub>Ω</sub> ∂P/∂x dV = ∬<sub>Σ</sub> P dydz、∭<sub>Ω</sub> ∂Q/∂y dV = ∬<sub>Σ</sub> Q dzdx，三式相加即得 (12.3.1)。若穿过 Ω 内部且平行于坐标轴的直线与边界曲面 Σ 的交点多于两个，可用平行坐标面的平面片把 Ω 划分为若干小闭区域：同一平面片两侧的对坐标曲面积分互为相反值，相加时恰好抵消，故 (12.3.1) 仍成立。</p>
          <div class="formula">由两类曲面积分的关系，高斯公式也可写成 ∬<sub>Σ</sub> (P cos α + Q cos β + R cos γ) dS = ∭<sub>Ω</sub> (∂P/∂x + ∂Q/∂y + ∂R/∂z) dV　　(12.3.2)</div>
          <p>其中 {cos α, cos β, cos γ} 为 Σ 外侧上任一点处的单位法向量。</p>
          `,
        },
        {
          type: 'html',
          html: `
          <p><strong>例 12.3.1</strong>　利用高斯公式计算例 12.2.1 中的曲面积分 ∬<sub>Σ</sub> z dxdy，其中 Σ 为空间区域 Ω: x²+y²+z² ≤ 1, x ≥ 0, y ≥ 0 的边界曲面，并取外侧。</p>
          <p>解：Ω 是封闭曲面 Σ 所围成且 Σ 取外侧；P = Q = 0，R = z，故</p>
          <div class="formula">∬<sub>Σ</sub> z dxdy = ∭<sub>Ω</sub> (0+0+1) dV = ∭<sub>Ω</sub> dV = (1/4)·(4π/3) = π/3</div>
          <p><strong>例 12.3.2</strong>　计算曲面积分 ∬<sub>Σ</sub> xz² dydz + x²y dzdx + y²z dxdy，其中 Σ 为空间区域 Ω: x²+y²+z² ≤ 1, z ≥ √(x²+y²) 的边界曲面，取内侧。</p>
          <p>解：Ω 的球面坐标表示为 0 ≤ ρ ≤ 1，0 ≤ φ ≤ π/4，0 ≤ θ ≤ 2π；P = xz²，Q = x²y，R = y²z，故 ∂P/∂x + ∂Q/∂y + ∂R/∂z = x²+y²+z²。由于 Σ 取内侧，高斯公式前需加负号：</p>
          <div class="formula">原式 = −∭<sub>Ω</sub> (x²+y²+z²) dV = −∫<sub>0</sub><sup>2π</sup> dθ ∫<sub>0</sub><sup>π/4</sup> dφ ∫<sub>0</sub><sup>1</sup> ρ⁴ sin φ dρ = −(2−√2)π/5</div>
          <p><strong>例 12.3.3</strong>　计算曲面积分 ∬<sub>Σ</sub> 2x³ dydz + 2y³ dzdx + 3(z²−1) dxdy，其中 Σ 是曲面 z = 1−x²−y² (z ≥ 0) 的上侧。</p>
          <p>解：Σ 不是封闭曲面，不能直接应用高斯公式，需补充平面片 Σ₁: z = 0 (x²+y² ≤ 1) 并取<strong>下侧</strong>，使 Σ+Σ₁ 封闭且取外侧。设 Σ 与 Σ₁ 围成 Ω，柱面坐标下 Ω: 0 ≤ θ ≤ 2π, 0 ≤ r ≤ 1, 0 ≤ z ≤ 1−r²，于是</p>
          <div class="formula">∬<sub>Σ+Σ₁</sub> = ∭<sub>Ω</sub> 6(x²+y²+z) dxdydz = 6∫<sub>0</sub><sup>2π</sup> dθ ∫<sub>0</sub><sup>1</sup> dr ∫<sub>0</sub><sup>1−r²</sup> (z+r²) r dz = 2π</div>
          <div class="formula">又 Σ₁: z = 0，故 ∬<sub>Σ₁</sub> 3(z²−1) dxdy = −∬<sub>x²+y²≤1</sub> (−3) dxdy = 3π，从而原式 = 2π − 3π = −π</div>
          `,
        },
        {
          type: 'html',
          html: `
          <h3 id="sec-ch12-gauss-stokes-s2">12.3.2 斯托克斯公式</h3>
          <div class="callout key">
            <p><strong>定理 12.3.2（斯托克斯公式）</strong>　设 Γ 为空间光滑或分段光滑的有向封闭曲线，Σ 是以 Γ 为边界曲线张成的光滑或分片光滑的有向曲面，Γ 的方向和 Σ 的侧符合<strong>右手法则</strong>，函数 P(x,y,z)、Q(x,y,z)、R(x,y,z) 在包含 Σ 的空间区域内具有一阶连续偏导数，则</p>
            <div class="formula">∮<sub>Γ</sub> P dx + Q dy + R dz = ∬<sub>Σ</sub> (∂R/∂y − ∂Q/∂z) dydz + (∂P/∂z − ∂R/∂x) dzdx + (∂Q/∂x − ∂P/∂y) dxdy　　(12.3.3)</div>
          </div>
          <p>为便于记忆，常写成行列式形式：</p>
          <div class="formula">∮<sub>Γ</sub> P dx + Q dy + R dz = ∬<sub>Σ</sub> | dydz　dzdx　dxdy ; ∂/∂x　∂/∂y　∂/∂z ; P　Q　R |　　(12.3.4)</div>
          <p>利用两类曲线积分之间的关系，斯托克斯公式也可写成</p>
          <div class="formula">∮<sub>Γ</sub> P dx + Q dy + R dz = ∬<sub>Σ</sub> | cos α　cos β　cos γ ; ∂/∂x　∂/∂y　∂/∂z ; P　Q　R | dS　　(12.3.5)</div>
          <p>其中 {cos α, cos β, cos γ} 为 Σ 上任一点处指定侧的单位法向量。</p>
          <p><strong>例 12.3.5</strong>　计算曲线积分 ∮<sub>Γ</sub> (y−z) dx + (z−x) dy + (x−y) dz，其中曲线 Γ 是圆柱面 x²+y² = 1 与平面 x+z = 1 的交线，从 x 轴正向向原点看去，Γ 为逆时针方向。</p>
          <p>解法一：取平面 x+z = 1 上由 Γ 围成的平面片为 Σ，并取上侧（方程 z = 1−x，投影 D<sub>xy</sub> = {(x,y) | x²+y² ≤ 1}）。由于 z′<sub>x</sub> = −1、z′<sub>y</sub> = 0，故 dydz = dxdy、dzdx = 0，由斯托克斯公式的行列式形式得</p>
          <div class="formula">原式 = −2∬<sub>Σ</sub> dydz + dzdx + dxdy = −4∬<sub>Σ</sub> dxdy = −4∬<sub>D<sub>xy</sub></sub> dxdy = −4π</div>
          <p>解法二：取同样的平面片 Σ，其单位法向量 n = (cos α, cos β, cos γ) = (√2/2, 0, √2/2)，由 (12.3.5) 得原式 = −2∬<sub>Σ</sub>(cos α+cos β+cos γ) dS = −2√2·(Σ 的面积) = −2√2·(1·√2·π) = −4π。</p>
          <p>解法三：把 Γ 表示为参数方程 x = cos t, y = sin t, z = 1−cos t，t: 0 → 2π，直接化为定积分：</p>
          <div class="formula">∮<sub>Γ</sub> (y−z) dx + (z−x) dy + (x−y) dz = ∫<sub>0</sub><sup>2π</sup> (−2 + sin t + cos t) dt = −4π</div>
          `,
        },
      ],
    },
  ],
};

export default ch;
