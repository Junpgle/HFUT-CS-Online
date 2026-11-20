/* 高等数学 · 第11章 曲线积分 —— 依据课件 dsh11-1「对弧长的曲线积分」、dsh11-2「对坐标的曲线积分」整理 */
import type { MathChapter } from './types';

const ch: MathChapter = {
  id: 'ch11',
  no: '第11章',
  title: '曲线积分',
  subtitle: '第 11 章 · 曲线积分',
  lede: `
  曲线积分分为<strong>对弧长的曲线积分</strong>（第一类曲线积分）与<strong>对坐标的曲线积分</strong>（第二类曲线积分）两类。
  前者是定积分在曲线弧段上的推广，物理背景是曲线形构件的质量；后者是定积分在有向曲线弧段上的推广，物理背景是变力沿曲线所做的功。
  计算时都需写出曲线的<strong>参数方程</strong>，将对弧长的曲线积分化为定积分（注意弧长元素 ds &gt; 0），
  将对坐标的曲线积分化为定积分（注意方向与积分限的对应）。
  对坐标的曲线积分还涉及<strong>格林公式</strong>、<strong>路径无关</strong>等核心结论。
`,
  toc: [
    { id: 'sec-ch11-arc', text: '1. 对弧长的曲线积分', level: 2 },
    { id: 'sec-ch11-coord', text: '2. 对坐标的曲线积分', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ch11-arc',
      heading: '1. 对弧长的曲线积分',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ch11-arc-h1">一、对弧长的曲线积分的概念与性质</h3>
          <p><strong>引例（曲线形构件的质量）</strong>：设曲线形构件在 xOy 面内占据曲线弧 L，其线密度 ρ(x,y) &gt; 0 且连续。用 L 上的点 M<sub>1</sub>, M<sub>2</sub>, …, M<sub>n−1</sub> 将 L 分成 n 个小弧段 Δs<sub>1</sub>, …, Δs<sub>n</sub>，在第 i 个小弧段上任取一点 (ξ<sub>i</sub>, η<sub>i</sub>)，则质量</p>
          <div class="formula">M = lim<sub>λ→0</sub> ∑<sub>i=1</sub><sup>n</sup> ρ(ξ<sub>i</sub>, η<sub>i</sub>) Δs<sub>i</sub></div>
          <p>其中 λ 为各小弧段长度的最大值。</p>
          <p><strong>定义 11.1</strong>：设 L 为 xOy 面内的一条光滑曲线弧，f(x,y) 在 L 上有界。将 L 任意分成 n 个小弧段 Δs<sub>1</sub>, …, Δs<sub>n</sub>，记其长度仍为 Δs<sub>i</sub>；在第 i 个小弧段上任取一点 (ξ<sub>i</sub>, η<sub>i</sub>)，作和 ∑<sub>i=1</sub><sup>n</sup> f(ξ<sub>i</sub>, η<sub>i</sub>)Δs<sub>i</sub>。记 λ 为各小弧段长度的最大值，若极限</p>
          <div class="formula">lim<sub>λ→0</sub> ∑<sub>i=1</sub><sup>n</sup> f(ξ<sub>i</sub>, η<sub>i</sub>) Δs<sub>i</sub></div>
          <p>存在且与 L 的分割方式、点的取法无关，则称此极限为 f(x,y) 在 L 上<strong>对弧长的曲线积分</strong>（或<strong>第一类曲线积分</strong>），记作</p>
          <div class="formula">∫<sub>L</sub> f(x,y) ds = lim<sub>λ→0</sub> ∑<sub>i=1</sub><sup>n</sup> f(ξ<sub>i</sub>, η<sub>i</sub>) Δs<sub>i</sub></div>
          <p>其中 f(x,y) 为被积函数，L 为积分弧段，ds 为弧长元素（恒为正）。</p>
          <div class="callout key">
            <p><strong>存在性</strong>：若 f 在光滑曲线 L 上连续，则对弧长的曲线积分存在。</p>
            <p><strong>物理意义</strong>：若 ρ(x,y) 表示曲线形构件的线密度，则 ∫<sub>L</sub> ρ(x,y) ds 为构件的质量；特别地，∫<sub>L</sub> ds = s<sub>L</sub>（L 的弧长）。</p>
            <p><strong>推广</strong>：若 Γ 为空间曲线弧，f(x,y,z) 在 Γ 上有界，则 ∫<sub>Γ</sub> f(x,y,z) ds 为空间曲线弧上的对弧长曲线积分，ds 仍为弧长元素。</p>
          </div>
          <p><strong>性质</strong>：对弧长的曲线积分具有线性性、对积分弧段的可加性（与 L 的方向无关，即 ∫<sub>L̂</sub> = ∫<sub>L̂⁻</sub>）、保序性、估值定理与中值定理（与定积分类似）。</p>
          <h3 id="sec-ch11-arc-h2">二、对弧长的曲线积分的计算</h3>
          <p>基本思路：将曲线 L 用参数方程表示，将对弧长的曲线积分化为定积分。</p>
          <p><strong>情形 1（参数方程）</strong>：若 L: x = x(t), y = y(t)（α ≤ t ≤ β），则弧长元素</p>
          <div class="formula">ds = √(x′<sup>2</sup>(t) + y′<sup>2</sup>(t)) dt</div>
          <div class="formula">∫<sub>L</sub> f(x,y) ds = ∫<sub>α</sub><sup>β</sup> f(x(t), y(t)) √(x′<sup>2</sup>(t) + y′<sup>2</sup>(t)) dt　（α &lt; β）</div>
          <p><strong>情形 2（显函数 y = y(x)）</strong>：若 L: y = y(x)（a ≤ x ≤ b），则 ds = √(1 + y′<sup>2</sup>(x)) dx，故</p>
          <div class="formula">∫<sub>L</sub> f(x,y) ds = ∫<sub>a</sub><sup>b</sup> f(x, y(x)) √(1 + y′<sup>2</sup>(x)) dx　（a &lt; b）</div>
          <p><strong>情形 3（显函数 x = x(y)）</strong>：若 L: x = x(y)（c ≤ y ≤ d），则 ds = √(1 + x′<sup>2</sup>(y)) dy，故</p>
          <div class="formula">∫<sub>L</sub> f(x,y) ds = ∫<sub>c</sub><sup>d</sup> f(x(y), y) √(1 + x′<sup>2</sup>(y)) dy　（c &lt; d）</div>
          <p><strong>情形 4（极坐标）</strong>：若 L: r = r(θ)（α ≤ θ ≤ β），则 x = r(θ)cos θ、y = r(θ)sin θ，ds = √(r<sup>2</sup> + r′<sup>2</sup>) dθ，故</p>
          <div class="formula">∫<sub>L</sub> f(x,y) ds = ∫<sub>α</sub><sup>β</sup> f(r(θ)cos θ, r(θ)sin θ) √(r<sup>2</sup>(θ) + r′<sup>2</sup>(θ)) dθ</div>
          <p><strong>情形 5（空间曲线）</strong>：若 Γ: x = x(t), y = y(t), z = z(t)（α ≤ t ≤ β），则 ds = √(x′<sup>2</sup>(t) + y′<sup>2</sup>(t) + z′<sup>2</sup>(t)) dt，故</p>
          <div class="formula">∫<sub>Γ</sub> f(x,y,z) ds = ∫<sub>α</sub><sup>β</sup> f(x(t), y(t), z(t)) √(x′<sup>2</sup>(t) + y′<sup>2</sup>(t) + z′<sup>2</sup>(t)) dt</div>
          <p><strong>例 1</strong> 计算 ∫<sub>L</sub> (x + y) ds，其中 L 为连接点 A(1,0) 与 B(0,1) 的直线段。</p>
          <p>解：L 的参数方程为 x = 1 − t, y = t（0 ≤ t ≤ 1），ds = √(1<sup>2</sup> + 1<sup>2</sup>) dt = √2 dt，故</p>
          <div class="formula">∫<sub>L</sub> (x+y) ds = ∫<sub>0</sub><sup>1</sup> (1 − t + t)·√2 dt = √2</div>
          <p><strong>例 2</strong> 计算 ∫<sub>L</sub> y ds，其中 L 为摆线 x = t − sin t, y = 1 − cos t（0 ≤ t ≤ 2π）。</p>
          <p>解：x′(t) = 1 − cos t, y′(t) = sin t，ds = √((1 − cos t)<sup>2</sup> + sin<sup>2</sup>t) dt = √(2 − 2cos t) dt = 2|sin(t/2)| dt = 2sin(t/2) dt（0 ≤ t ≤ 2π 时 sin(t/2) ≥ 0）。故</p>
          <div class="formula">∫<sub>L</sub> y ds = ∫<sub>0</sub><sup>2π</sup> (1 − cos t)·2sin(t/2) dt = 2∫<sub>0</sub><sup>2π</sup> 2sin<sup>3</sup>(t/2) dt</div>
          <p>令 u = t/2，得</p>
          <div class="formula">原式 = 4∫<sub>0</sub><sup>π</sup> sin<sup>3</sup>u du = 4·[−cos u + cos<sup>3</sup>u/3]<sub>0</sub><sup>π</sup> = 4·(2 − 2/3) = 32/3</div>
          <p><strong>例 3</strong> 计算 ∫<sub>L</sub> (x<sup>2</sup> + y<sup>2</sup>) ds，其中 L 为圆 x<sup>2</sup>+y<sup>2</sup> = ax（a &gt; 0）。</p>
          <p>解：极坐标 L: r = a cos θ（−π/2 ≤ θ ≤ π/2），r′ = −a sin θ，ds = √(r<sup>2</sup> + r′<sup>2</sup>) dθ = a dθ。故</p>
          <div class="formula">∫<sub>L</sub> (x<sup>2</sup>+y<sup>2</sup>) ds = ∫<sub>−π/2</sub><sup>π/2</sup> r<sup>2</sup>·a dθ = ∫<sub>−π/2</sub><sup>π/2</sup> (a cos θ)<sup>2</sup>·a dθ = a<sup>3</sup>·[θ/2 + sin 2θ/4]<sub>−π/2</sub><sup>π/2</sup> = πa<sup>3</sup>/2</div>
          <p><strong>例 4（对称性）</strong> 计算 ∫<sub>L</sub> |y| ds，其中 L 为圆 x<sup>2</sup>+y<sup>2</sup> = 1。</p>
          <p>解：L 关于 x 轴与 y 轴对称，|y| 关于 x 轴、y 轴均为偶函数，故</p>
          <div class="formula">∫<sub>L</sub> |y| ds = 4 ∫<sub>L∩{x≥0,y≥0}</sub> y ds</div>
          <p>在第一象限部分参数化为 x = cos θ, y = sin θ（0 ≤ θ ≤ π/2），ds = dθ，故</p>
          <div class="formula">原式 = 4∫<sub>0</sub><sup>π/2</sup> sin θ dθ = 4</div>
          `,
        },
      ],
    },
    {
      id: 'sec-ch11-coord',
      heading: '2. 对坐标的曲线积分',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ch11-coord-h1">一、对坐标的曲线积分的概念与性质</h3>
          <p><strong>引例（变力沿曲线所做的功）</strong>：设质点在变力 F(x,y) = P(x,y)i + Q(x,y)j 的作用下沿光滑曲线 L 从 A 移动到 B，求变力所做的功 W。用 L 上的点 M<sub>1</sub>, …, M<sub>n−1</sub> 将 L 分成 n 个有向小弧段 Δs<sub>i</sub>，第 i 个小弧段的位移向量 Δr<sub>i</sub> = Δx<sub>i</sub>i + Δy<sub>i</sub>j。在第 i 个小弧段上任取一点 (ξ<sub>i</sub>, η<sub>i</sub>)，用 F(ξ<sub>i</sub>, η<sub>i</sub>) 近似代替该弧段上的变力，则该小弧段上变力做功 ΔW<sub>i</sub> ≈ F(ξ<sub>i</sub>, η<sub>i</sub>)·Δr<sub>i</sub> = P(ξ<sub>i</sub>, η<sub>i</sub>)Δx<sub>i</sub> + Q(ξ<sub>i</sub>, η<sub>i</sub>)Δy<sub>i</sub>。于是</p>
          <div class="formula">W = lim<sub>λ→0</sub> ∑<sub>i=1</sub><sup>n</sup> [P(ξ<sub>i</sub>, η<sub>i</sub>)Δx<sub>i</sub> + Q(ξ<sub>i</sub>, η<sub>i</sub>)Δy<sub>i</sub>]</div>
          <p>其中 λ 为各小弧段长度的最大值。</p>
          <p><strong>定义 11.2</strong>：设有向曲线 L 在 xOy 面内从 A 到 B，P(x,y)、Q(x,y) 在 L 上有界。用 L 上的点将 L 任意分成 n 个有向小弧段 Δs<sub>1</sub>, …, Δs<sub>n</sub>，记 Δx<sub>i</sub> = x<sub>i</sub> − x<sub>i−1</sub>、Δy<sub>i</sub> = y<sub>i</sub> − y<sub>i−1</sub>；在第 i 个小弧段上任取一点 (ξ<sub>i</sub>, η<sub>i</sub>)，作和 ∑<sub>i=1</sub><sup>n</sup> P(ξ<sub>i</sub>, η<sub>i</sub>)Δx<sub>i</sub> 与 ∑<sub>i=1</sub><sup>n</sup> Q(ξ<sub>i</sub>, η<sub>i</sub>)Δy<sub>i</sub>。记 λ 为各小弧段长度的最大值，若极限</p>
          <div class="formula">lim<sub>λ→0</sub> ∑<sub>i=1</sub><sup>n</sup> P(ξ<sub>i</sub>, η<sub>i</sub>) Δx<sub>i</sub>　与　lim<sub>λ→0</sub> ∑<sub>i=1</sub><sup>n</sup> Q(ξ<sub>i</sub>, η<sub>i</sub>) Δy<sub>i</sub></div>
          <p>分别存在且与分割方式、取点方式无关，则称它们分别为 P(x,y)dx 与 Q(x,y)dy 在 L 上<strong>对坐标的曲线积分</strong>（或<strong>第二类曲线积分</strong>），记作</p>
          <div class="formula">∫<sub>L</sub> P dx = lim<sub>λ→0</sub> ∑<sub>i=1</sub><sup>n</sup> P(ξ<sub>i</sub>, η<sub>i</sub>) Δx<sub>i</sub>，　∫<sub>L</sub> Q dy = lim<sub>λ→0</sub> ∑<sub>i=1</sub><sup>n</sup> Q(ξ<sub>i</sub>, η<sub>i</sub>) Δy<sub>i</sub></div>
          <p>合并记为</p>
          <div class="formula">∫<sub>L</sub> P dx + Q dy</div>
          <p>其中 P、Q 为被积函数，L 为有向曲线弧，dx、dy 为有向坐标元素（可正、可负）。</p>
          <div class="callout key">
            <p><strong>存在性</strong>：若 P、Q 在 L 上连续，则对坐标的曲线积分存在。</p>
            <p><strong>方向性</strong>：∫<sub>L̂</sub> P dx + Q dy = −∫<sub>L̂⁻</sub> P dx + Q dy，即对坐标的曲线积分与曲线方向有关。</p>
            <p><strong>推广</strong>：空间有向曲线 Γ 上对坐标的曲线积分定义为 ∫<sub>Γ</sub> P dx + Q dy + R dz。</p>
            <p><strong>物理意义</strong>：变力 F = (P, Q) 沿有向曲线 L 从 A 到 B 所做的功为 ∫<sub>L</sub> P dx + Q dy。</p>
          </div>
          <p><strong>性质</strong>：对坐标的曲线积分具有线性性、对积分弧段的可加性（∫<sub>L<sub>1</sub>+L<sub>2</sub></sub> = ∫<sub>L<sub>1</sub></sub> + ∫<sub>L<sub>2</sub></sub>，需方向一致）与方向反号性。</p>
          <h3 id="sec-ch11-coord-h2">二、对坐标的曲线积分的计算</h3>
          <p>基本思路：将曲线 L 用参数方程表示，将对坐标的曲线积分化为定积分（注意积分限对应 L 的起点与终点）。</p>
          <p><strong>情形 1（参数方程）</strong>：若有向曲线 L: x = x(t), y = y(t)，t 从 α 对应起点、到 β 对应终点，则</p>
          <div class="formula">∫<sub>L</sub> P dx + Q dy = ∫<sub>α</sub><sup>β</sup> [P(x(t), y(t)) x′(t) + Q(x(t), y(t)) y′(t)] dt</div>
          <p><strong>情形 2（显函数 y = y(x)）</strong>：若 L: y = y(x)，x 从 a 到 b，则 dy = y′(x)dx，故</p>
          <div class="formula">∫<sub>L</sub> P dx + Q dy = ∫<sub>a</sub><sup>b</sup> [P(x, y(x)) + Q(x, y(x)) y′(x)] dx</div>
          <p><strong>情形 3（显函数 x = x(y)）</strong>：若 L: x = x(y)，y 从 c 到 d，则 dx = x′(y)dy，故</p>
          <div class="formula">∫<sub>L</sub> P dx + Q dy = ∫<sub>c</sub><sup>d</sup> [P(x(y), y) x′(y) + Q(x(y), y)] dy</div>
          <p><strong>情形 4（空间曲线）</strong>：若 Γ: x = x(t), y = y(t), z = z(t)，t 从 α 到 β，则</p>
          <div class="formula">∫<sub>Γ</sub> P dx + Q dy + R dz = ∫<sub>α</sub><sup>β</sup> [P·x′(t) + Q·y′(t) + R·z′(t)] dt</div>
          <p><strong>例 1</strong> 计算 ∫<sub>L</sub> xy dx，其中 L 为抛物线 y = x<sup>2</sup> 上从 A(1,1) 到 B(−1,1) 的弧段。</p>
          <p>解：L: y = x<sup>2</sup>，x 从 1 到 −1，dy = 2x dx。但本积分只对 dx 积分，故</p>
          <div class="formula">∫<sub>L</sub> xy dx = ∫<sub>1</sub><sup>−1</sup> x·x<sup>2</sup> dx = ∫<sub>1</sub><sup>−1</sup> x<sup>3</sup> dx = [x<sup>4</sup>/4]<sub>1</sub><sup>−1</sup> = 0</div>
          <p><strong>例 2</strong> 计算 ∫<sub>L</sub> (x + y) dx + (x − y) dy，其中 L 为椭圆 x<sup>2</sup>/a<sup>2</sup> + y<sup>2</sup>/b<sup>2</sup> = 1 沿逆时针方向一周。</p>
          <p>解：参数化 x = a cos t, y = b sin t（0 ≤ t ≤ 2π），dx = −a sin t dt, dy = b cos t dt，故</p>
          <div class="formula">原式 = ∫<sub>0</sub><sup>2π</sup> [(a cos t + b sin t)(−a sin t) + (a cos t − b sin t)(b cos t)] dt</div>
          <p>化简被积函数含 sin<sup>2</sup>t、cos<sup>2</sup>t、sin t cos t 三类，由对称性 sin t cos t 项积分为 0，余下</p>
          <div class="formula">原式 = −a<sup>2</sup>∫<sub>0</sub><sup>2π</sup> sin<sup>2</sup>t dt + b<sup>2</sup>∫<sub>0</sub><sup>2π</sup> cos<sup>2</sup>t dt = −a<sup>2</sup>·π + b<sup>2</sup>·π = π(b<sup>2</sup> − a<sup>2</sup>)</div>
          <p><strong>例 3（空间曲线）</strong> 计算 ∫<sub>Γ</sub> x dx + y dy + z dz，其中 Γ 为从 A(1,1,1) 到 B(2,2,2) 的直线段。</p>
          <p>解：Γ: x = 1 + t, y = 1 + t, z = 1 + t（0 ≤ t ≤ 1），dx = dy = dz = dt，故</p>
          <div class="formula">原式 = ∫<sub>0</sub><sup>1</sup> [(1+t) + (1+t) + (1+t)] dt = 3∫<sub>0</sub><sup>1</sup> (1+t) dt = 3·[t + t<sup>2</sup>/2]<sub>0</sub><sup>1</sup> = 9/2</div>
          <h3 id="sec-ch11-coord-h3">三、格林公式</h3>
          <div class="callout key">
            <p><strong>定理 11.1（格林公式）</strong>　设闭区域 D 由分段光滑的闭曲线 L 围成，P(x,y)、Q(x,y) 在 D 上具有一阶连续偏导数，则</p>
            <div class="formula">∮<sub>L</sub> P dx + Q dy = ∬<sub>D</sub> (∂Q/∂x − ∂P/∂y) dxdy</div>
            <p>其中 L 取<strong>正向</strong>（沿 L 行走时 D 始终在左手侧）。</p>
            <p><strong>说明</strong>：格林公式建立了<strong>闭曲线上的对坐标曲线积分</strong>与<strong>二重积分</strong>之间的联系，是平面曲线积分计算的核心工具。</p>
          </div>
          <p><strong>应用</strong>：当 L 为闭曲线且 P、Q 在 D 上有连续偏导数时，用格林公式将对坐标的曲线积分化为二重积分常能简化计算。若 ∂Q/∂x − ∂P/∂y = 0，则 ∮<sub>L</sub> P dx + Q dy = 0。</p>
          <p><strong>例 4</strong> 计算 ∮<sub>L</sub> x dy − y dx，其中 L 为椭圆 x<sup>2</sup>/a<sup>2</sup> + y<sup>2</sup>/b<sup>2</sup> = 1 沿逆时针方向一周。</p>
          <p>解：P = −y, Q = x，∂Q/∂x − ∂P/∂y = 1 − (−1) = 2。由格林公式</p>
          <div class="formula">∮<sub>L</sub> x dy − y dx = ∬<sub>D</sub> 2 dxdy = 2·(πab) = 2πab</div>
          <p>其中 D 为椭圆内部，面积 πab。</p>
          <p><strong>例 5</strong> 计算 ∮<sub>L</sub> (x<sup>2</sup> − y) dx + (x + y<sup>2</sup>) dy，其中 L 为三角形三顶点 (0,0)、(1,0)、(0,1) 围成区域的正向边界。</p>
          <p>解：P = x<sup>2</sup> − y, Q = x + y<sup>2</sup>，∂Q/∂x − ∂P/∂y = 1 − (−1) = 2。由格林公式</p>
          <div class="formula">原式 = ∬<sub>D</sub> 2 dxdy = 2·[D 的面积] = 2·(1/2) = 1</div>
          <p><strong>例 6（L 为闭曲线，但 P、Q 在 D 内某点不连续）</strong> 计算 ∮<sub>L</sub> (x dy − y dx)/(x<sup>2</sup>+y<sup>2</sup>)，其中 L 为绕原点一周的不自交光滑闭曲线，取正向。</p>
          <p>解：P = −y/(x<sup>2</sup>+y<sup>2</sup>), Q = x/(x<sup>2</sup>+y<sup>2</sup>)，在 D 内除原点外有连续偏导数。可验证 ∂Q/∂x − ∂P/∂y = 0（在 (x,y) ≠ (0,0) 处）。在 D 内取围绕原点的小圆 L<sub>ε</sub>: x<sup>2</sup>+y<sup>2</sup> = ε<sup>2</sup>，由复连通区域上的格林公式</p>
          <div class="formula">∮<sub>L</sub> P dx + Q dy = ∮<sub>L<sub>ε</sub></sub> P dx + Q dy</div>
          <p>在 L<sub>ε</sub> 上参数化 x = ε cos t, y = ε sin t，得 P dx + Q dy = dθ，故</p>
          <div class="formula">原式 = ∫<sub>0</sub><sup>2π</sup> dθ = 2π</div>
          <h3 id="sec-ch11-coord-h4">四、曲线积分与路径无关的条件</h3>
          <p><strong>定义</strong>：若在区域 G 内，对坐标的曲线积分 ∫<sub>L</sub> P dx + Q dy 仅与起点 A、终点 B 有关而与路径 L 的形状无关，则称曲线积分在 G 内<strong>与路径无关</strong>。</p>
          <div class="callout key">
            <p><strong>定理 11.2</strong>　设 P、Q 在单连通区域 G 内具有一阶连续偏导数，则下列四个命题等价：</p>
            <p>① 在 G 内曲线积分 ∫<sub>L</sub> P dx + Q dy 与路径无关；</p>
            <p>② 在 G 内沿任意闭曲线的积分 ∮<sub>L</sub> P dx + Q dy = 0；</p>
            <p>③ 在 G 内 ∂P/∂y = ∂Q/∂x 恒成立；</p>
            <p>④ 存在 G 内的可微函数 u(x,y)，使 du = P dx + Q dy，即 P = ∂u/∂x, Q = ∂u/∂y。</p>
            <p>其中 ④ 中的 u(x,y) 称为 P dx + Q dy 的<strong>原函数</strong>（或势函数）。当条件满足时，曲线积分可按以下方式计算：</p>
            <div class="formula">∫<sub>L</sub> P dx + Q dy = ∫<sub>A</sub><sup>B</sup> du = u(B) − u(A)</div>
            <p>即与定积分的牛顿—莱布尼兹公式形式相同。</p>
          </div>
          <p><strong>求势函数 u(x,y) 的方法</strong>（凑微分法 / 折线法）：</p>
          <p>方法一（折线法）：取定 (x<sub>0</sub>, y<sub>0</sub>) ∈ G，令</p>
          <div class="formula">u(x,y) = ∫<sub>x<sub>0</sub></sub><sup>x</sup> P(t, y) dt + ∫<sub>y<sub>0</sub></sub><sup>y</sup> Q(x, t) dt</div>
          <p>或等价地</p>
          <div class="formula">u(x,y) = ∫<sub>y<sub>0</sub></sub><sup>y</sup> Q(x, t) dt + ∫<sub>x<sub>0</sub></sub><sup>x</sup> P(t, y<sub>0</sub>) dt</div>
          <p>方法二（凑微分法）：将 P dx + Q dy 凑成 du = ∂u/∂x dx + ∂u/∂y dy 的形式。</p>
          <p><strong>例 7</strong> 验证曲线积分 ∫<sub>L</sub> (2x + y) dx + (x + 2y) dy 与路径无关，并求 u(x,y)，再计算从 (0,0) 到 (1,1) 的积分。</p>
          <p>解：P = 2x + y, Q = x + 2y，∂P/∂y = 1 = ∂Q/∂x，故与路径无关。取 (x<sub>0</sub>, y<sub>0</sub>) = (0,0)，由折线法</p>
          <div class="formula">u(x,y) = ∫<sub>0</sub><sup>x</sup> 2t dt + ∫<sub>0</sub><sup>y</sup> (x + 2t) dt = x<sup>2</sup> + xy + y<sup>2</sup></div>
          <p>故</p>
          <div class="formula">∫<sub>L</sub> (2x+y) dx + (x+2y) dy = u(1,1) − u(0,0) = (1 + 1 + 1) − 0 = 3</div>
          <p><strong>例 8</strong> 验证曲线积分 ∫<sub>L</sub> y dx + x dy 与路径无关，并求从 A(1,0) 到 B(2,3) 的积分。</p>
          <p>解：P = y, Q = x，∂P/∂y = 1 = ∂Q/∂x，故与路径无关。易见 y dx + x dy = d(xy)，故 u = xy，于是</p>
          <div class="formula">∫<sub>L</sub> y dx + x dy = [xy]<sub>(1,0)</sub><sup>(2,3)</sup> = 6 − 0 = 6</div>
          `,
        },
      ],
    },
  ],
};

export default ch;