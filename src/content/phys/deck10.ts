import type { DeckData } from './types';

/** 第10章 机械振动 —— 课件 10-1.2（§10-1 谐振动）、10-5（§10-5 一维谐振动的合成）+ 振动与波复习（第10章部分） */
const deck10: DeckData = {
  id: 'deck10',
  no: '第10章',
  title: '机械振动',
  subtitle: '谐振动 · 特征量与旋转矢量 · 常见谐振动 · 谐振动的能量 · 一维谐振动的合成与拍',
  lede:
    '广义振动：任一物理量（如位移、电流等）在某一数值附近反复变化。机械振动：物体在一定位置附近作来回往复的运动。简谐振动是最基本、最重要的振动形式。',
  toc: [
    { id: 'sec-10-1', text: '10-1 谐振动', level: 2 },
    { id: 'sec-10-2', text: '10-5 一维谐振动的合成', level: 2 },
    { id: 'sec-10-3', text: '期末复习（第10章要点）', level: 2 },
  ],
  sections: [
    {
      id: 'sec-10-1',
      heading: '10-1 谐振动',
      blocks: [
        {
          type: 'html',
          html: `
<h3>一、谐振动的特征及其表达式</h3>
<p><strong>简谐振动</strong>（simple harmonic motion, SHM）：物体运动时，离开平衡位置的位移（或角位移）按余弦（或正弦）规律随时间变化。</p>
<p><strong>弹簧振子</strong>：连接在一起的一个忽略了质量的弹簧和一个不发生形变的物体系统。<strong>回复力</strong>：作简谐运动的质点所受的沿位移方向的合外力，该力与位移成正比且反向——简谐振动的动力学特征：</p>
<div class="formula"><p>F = −kx</p></div>
<p>据牛顿第二定律：m·d²x/dt² = −kx，令 ω² = k/m，得简谐振动的动力学方程 d²x/dt² + ω²x = 0，其解为——简谐振动的运动学特征（物体的位移按余弦规律变化）：</p>
<div class="formula"><p>x = A·cos(ωt + φ₀)</p></div>
<p>设 t = 0 时振动位移 x = x₀、振动速度 v = v₀，常量 A 和 φ₀ 由初始条件确定：</p>
<div class="formula"><p>A = √(x₀² + (v₀/ω)²)，　tanφ₀ = −v₀/(ωx₀)</p></div>
<p>在 −π 到 π（0 到 2π）之间，通常 φ₀ 存在两个值，可根据 v₀ 的方向（sinφ₀ 的符号）进行取舍。</p>
<h3>二、描述谐振动的特征量</h3>
<ol>
<li><strong>振幅</strong>（amplitude）A：即最大位移（x = ±A）。</li>
<li><strong>周期</strong>（period）T：完成一次完全振动所经历的时间。<strong>频率</strong>（frequency）ν：单位时间内完成完全振动的次数（ν = 1/T）。<strong>角频率</strong>：物体在 2π 秒内所作的完全振动的次数，ω = 2πν = 2π/T。对于弹簧振子，因有 ω² = k/m，得固有周期和频率：</li>
</ol>
<div class="formula"><p>T = 2π√(m/k)，　ν = (1/2π)·√(k/m)</p></div>
<ol start="3">
<li><strong>相位和初相</strong>：相位 (ωt + φ₀) 是决定简谐运动状态的物理量；初相位 φ₀ 是 t = 0 时的相位。相位概念可用于比较两个谐振动之间在振动步调上的差异。设有两个同频率的谐振动，二者的相位差 Δφ = φ₂ − φ₁：</li>
</ol>
<ul>
<li>(a) 当 Δφ = 2kπ 时，两振动步调相同，称两个振动为<strong>同相</strong>；</li>
<li>(b) 当 Δφ = (2k+1)π 时，两振动步调相反，称两个振动为<strong>反相</strong>；</li>
<li>(c) 当 Δφ &gt; 0 时，称第二个振动<strong>超前</strong>第一个振动 Δφ；</li>
<li>(d) 当 Δφ &lt; 0 时，称第二个振动<strong>落后</strong>第一个振动 |Δφ|。</li>
</ul>
<div class="callout tip">
  <p class="callout-h">例：浮力对周期的影响</p>
  <p>竖直弹簧振子系统谐振周期为 T，将小球放入水中，水的浮力恒定，粘滞阻力及弹簧质量不计，若使振子沿铅直方向振动起来，则振子仍作简谐振动吗？周期如何？</p>
  <p>答：浮力恒定只改变振子的平衡位置，回复力仍为 −kx，故振子仍作简谐振动，且周期仍为 T。</p>
</div>
<h3>简谐振动的速度和加速度</h3>
<div class="formula"><p>v = dx/dt = −ωA·sin(ωt + φ₀) = ωA·cos(ωt + φ₀ + π/2)，　v<sub>m</sub> = ωA</p></div>
<div class="formula"><p>a = dv/dt = −ω²A·cos(ωt + φ₀) = ω²A·cos(ωt + φ₀ + π)，　a<sub>m</sub> = ω²A</p></div>
<p>速度相位比位移相位超前 π/2；加速度与位移反相位。相位可以用来比较不同物理量变化的步调。</p>
<h3>三、谐振动的旋转矢量图示法</h3>
<svg class="fig" viewBox="0 0 420 300" role="img" aria-label="旋转矢量图示">
  <defs>
    <marker id="ph-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"></path></marker>
  </defs>
  <g stroke="var(--hairline)" fill="none">
    <circle cx="120" cy="150" r="90"></circle>
    <line x1="20" y1="150" x2="392" y2="150"></line>
    <line x1="120" y1="42" x2="120" y2="258"></line>
  </g>
  <g fill="var(--ink-3)" font-size="12" font-family="var(--font)">
    <text x="396" y="168">x</text>
    <text x="110" y="38">x 轴</text>
    <text x="46" y="146">−A</text>
    <text x="196" y="146">A</text>
    <text x="112" y="66">O</text>
    <text x="214" y="88">旋转矢量 A（模 = 振幅）</text>
    <text x="214" y="110">绕 O 点沿逆时针方向旋转</text>
    <text x="214" y="132">角速度 = 谐振动的角频率 ω</text>
    <text x="214" y="154">与 x 轴夹角 (ωt + φ₀) = 相位</text>
    <text x="214" y="176">t = 0 时夹角 φ₀ = 初相位</text>
    <text x="214" y="198">旋转一周，P 点完成一次完全振动</text>
    <text x="214" y="220">端点在 x 轴上的投影点 P：</text>
    <text x="228" y="242">x = A·cos(ωt + φ₀)</text>
  </g>
  <g stroke="var(--deck-accent)" fill="none" stroke-width="1.6">
    <line x1="120" y1="150" x2="195" y2="98" marker-end="url(#ph-arrow)"></line>
    <path d="M 158 150 A 38 38 0 0 0 147 121" stroke-dasharray="3 3"></path>
    <line x1="195" y1="98" x2="195" y2="150" stroke-dasharray="4 3" stroke="var(--ink-3)"></line>
  </g>
  <g fill="var(--ink)" font-size="12" font-family="var(--font)">
    <circle cx="195" cy="98" r="3" fill="var(--deck-accent)"></circle>
    <text x="160" y="84">端点</text>
    <circle cx="195" cy="150" r="3" fill="var(--deck-accent)"></circle>
    <text x="188" y="172">P</text>
    <text x="128" y="146" fill="var(--deck-accent)">ω</text>
  </g>
</svg>
<p><strong>旋转矢量</strong>：一长度等于振幅 A 的矢量在纸平面内绕 O 点沿逆时针方向旋转，其角速度与谐振动的角频率相等。旋转矢量的端点在 x 轴上的投影点 P 的位移为 x = A·cos(ωt + φ₀)，投影点 P 的运动为简谐振动。采用旋转矢量法，可直观地领会简谐振动表达式中各个物理量的意义：</p>
<ul>
<li>旋转矢量的模即为简谐振动的振幅；</li>
<li>旋转矢量的角速度即为振动的角频率；</li>
<li>旋转矢量与 x 轴的夹角 (ωt + φ₀) 为简谐振动的相位；</li>
<li>t = 0 时与 x 轴的夹角 φ₀ 即为简谐振动的初相位；</li>
<li>旋转矢量旋转一周，P 点完成一次完全振动。</li>
</ul>
<div class="callout tip">
  <p class="callout-h">例10-1：简谐振动表达式</p>
  <p>一物体沿 x 轴作简谐振动，振幅 A = 0.12 m，周期 T = 2 s。当 t = 0 时，物体的位移 x = 0.06 m，且向 x 轴正向运动。求：（1）简谐振动表达式；（2）t = T/4 时物体的位置、速度和加速度；（3）物体从 x = −0.06 m 向 x 轴负方向运动，第一次回到平衡位置所需时间。</p>
  <p>解：（1）设 x = A·cos(ωt + φ₀)，ω = 2π/T = π rad/s。由初始条件 cosφ₀ = 0.06/0.12 = 0.5，且 v₀ &gt; 0（sinφ₀ &lt; 0），得 φ₀ = −π/3，故 x = 0.12·cos(πt − π/3)（m）。</p>
  <p>（2）t = T/4 = 0.5 s：相位 π·0.5 − π/3 = π/6，x = 0.12·cos(π/6) ≈ 0.104 m，v = −ωA·sin(π/6) ≈ −0.19 m/s，a = −ω²x ≈ −1.03 m/s²。</p>
  <p>（3）设在某一时刻 t₁，x = −0.06 m 且向 x 轴负方向运动，对应旋转矢量相位 θ₁ = 2π/3；第一次回到平衡位置（且沿正向）对应 θ₂ = 3π/2。Δθ = 5π/6，Δt = Δθ/ω = 5/6 ≈ 0.83 s。</p>
</div>
<h3>四、几种常见的谐振动</h3>
<p><strong>1. 单摆</strong>：重物所受合外力矩 M = −mgL·sinθ ≈ −mgL·θ（θ 很小时），由转动定律 J·d²θ/dt² = −mgLθ（J = mL²）得 θ 方程 d²θ/dt² + (g/L)θ = 0——单摆作简谐振动：</p>
<div class="formula"><p>θ = θ<sub>m</sub>·cos(√(g/L)·t + φ₀)，　T = 2π√(L/g)</p></div>
<p>角振幅 θ<sub>m</sub> 和初相 φ₀ 由初始条件求得。例：把单摆摆球从平衡位置向位移正方向拉开，使摆线与竖直方向成一微小角度，然后由静止放手任其振动，从放手时开始计时——若用余弦函数表示其运动方程，该单摆振动的初位相为 0（t = 0 时 θ 为最大值 θ<sub>m</sub>）。</p>
<p><strong>2. 复摆</strong>：一个可绕固定轴摆动的刚体称为复摆。θ 很小时，由转动定律 J·d²θ/dt² = −mgd·θ（d 为质心到转轴的距离）：</p>
<div class="formula"><p>T = 2π√(J/(mgd))</p></div>
<div class="callout tip">
  <p class="callout-h">例10-2：平底船的振动</p>
  <p>一质量为 m 的平底船，其平均水平截面积为 S，吃水深度为 h，如不计水的阻力，求此船在竖直方向的振动周期。</p>
  <p>解：船静止时浮力与重力平衡。船在任一位置时，以水面为坐标原点、竖直向下的坐标轴为 y 轴：船的位移为 y 时，船所受合力（浮力的变化量）F = −ρ<sub>水</sub>gS·y。船在竖直方向做简谐振动，其角频率和周期为：</p>
  <div class="formula"><p>ω = √(ρ<sub>水</sub>gS/m)，　T = 2π√(m/(ρ<sub>水</sub>gS))</p></div>
</div>
<h3>五、谐振动的能量</h3>
<p>以水平弹簧振子为例：</p>
<div class="formula"><p>动能 E<sub>k</sub> = ½mω²A²·sin²(ωt + φ₀)，　势能 E<sub>p</sub> = ½kA²·cos²(ωt + φ₀)</p></div>
<div class="formula"><p>机械能 E = E<sub>k</sub> + E<sub>p</sub> = ½kA² = ½mω²A²（常量）</p></div>
<p><strong>简谐振动系统机械能守恒</strong>！动能与势能相互转化，总的机械能在振动过程中保持不变。</p>
<div class="callout key">
  <p class="callout-h">练习（课件）</p>
  <p>当质点以频率 f 作简谐振动时，它动能的变化频率为——A. f　B. 2f　C. 4f　D. 0.5f。答：<strong>B</strong>（动能每周期变化两次，频率为 2f）。</p>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-10-2',
      heading: '10-5 一维谐振动的合成',
      blocks: [
        {
          type: 'html',
          html: `
<h3>一、同一直线上两个同频率谐振动的合成</h3>
<p>某一质点同时参与两个独立的、同方向、同频率的简谐振动，其振动位移分别为 x₁ = A₁cos(ωt + φ₁)、x₂ = A₂cos(ωt + φ₂)。这两个简谐振动在旋转矢量图示法中对应的旋转矢量的角速度相同，它们之间的夹角保持恒定，所以旋转过程中合成的平行四边形的形状保持不变，因而合矢量的长度保持不变并以相同的角速度匀速旋转。<strong>合振动仍为同方向同频率的简谐振动</strong>，其方向和频率与原来相同：</p>
<div class="formula"><p>x = A·cos(ωt + φ)，　A = √(A₁² + A₂² + 2A₁A₂·cos(φ₂ − φ₁))</p></div>
<div class="formula"><p>tanφ = (A₁sinφ₁ + A₂sinφ₂)/(A₁cosφ₁ + A₂cosφ₂)</p></div>
<ul>
<li>（1）若 Δφ = φ₂ − φ₁ = 2kπ，则 A = A₁ + A₂——合振动加强；</li>
<li>（2）若 Δφ = (2k+1)π，则 A = |A₁ − A₂|——合振动减弱。</li>
</ul>
<h3>二、同一直线上两个不同频率谐振动的合成——拍</h3>
<p>设同方向、角频率分别为 ω₁ 和 ω₂ 的两简谐振动（ω₂ &gt; ω₁ 并且很接近），它们所对应的旋转矢量转动角速度不相同，二者的相位差与时间有关，合矢量的长度和角速度都将随时间变化。</p>
<div class="formula"><p>x = 2A·cos((ω₂ − ω₁)t/2)·cos((ω₂ + ω₁)t/2)</p></div>
<p>在两个简谐振动的位移合成表达式中，第一项随时间作缓慢变化，第二项是角频率近于 (ω₁+ω₂)/2 的简谐函数。合振动可视为是角频率为 (ω₁+ω₂)/2、振幅为 |2A·cos((ω₂−ω₁)t/2)| 的简谐振动。</p>
<p>合振动的振幅随时间作缓慢的周期性的变化，振动出现时强时弱的<strong>拍</strong>现象。</p>
<div class="formula"><p>拍频 ν<sub>拍</sub> = |ν₂ − ν₁|（单位时间内强弱变化的次数），　拍的周期 T<sub>拍</sub> = 1/|ν₂ − ν₁|，　拍的振幅 2A</p></div>
`,
        },
      ],
    },
    {
      id: 'sec-10-3',
      heading: '期末复习（第10章要点）',
      blocks: [
        {
          type: 'html',
          html: `
<p>（课件「振动与波复习」第 1～4 页，第10章部分）</p>
<h3>简谐振动的动力学特征与方程</h3>
<div class="formula"><p>F = −kx　→　m·d²x/dt² + kx = 0　→　x = A·cos(ωt + φ₀)，ω² = k/m</p></div>
<p>常量 A 和 φ₀ 在 ±π 之间通常存在两个值，可根据 v₀ 的方向进行取舍。</p>
<h3>几种常见的谐振动</h3>
<table class="tbl">
  <thead><tr><th>系统</th><th>角频率 / 周期</th></tr></thead>
  <tbody>
    <tr><td>弹簧振子</td><td>ω = √(k/m)，T = 2π√(m/k)</td></tr>
    <tr><td>单摆</td><td>ω = √(g/L)，T = 2π√(L/g)</td></tr>
    <tr><td>复摆</td><td>T = 2π√(J/(mgd))</td></tr>
  </tbody>
</table>
<h3>谐振动的能量</h3>
<p>动能 E<sub>k</sub>、势能 E<sub>p</sub> 交替变化，<strong>谐振动的机械能守恒</strong>：E = ½kA² = ½mω²A²。</p>
<h3>同频合成与拍</h3>
<p>1. 同一直线上两个同频率谐振动的合成：合振动 x = A·cos(ωt + φ)，A = √(A₁² + A₂² + 2A₁A₂cos(φ₂ − φ₁))。</p>
<p>2. 同一直线上两个不同频率谐振动的合成：合振动可视为角频率为 (ω₁+ω₂)/2、振幅为 |2A·cos((ω₂−ω₁)t/2)| 的简谐振动。合振动的振幅随时间作缓慢的周期性的变化，振动出现时强时弱的拍现象。</p>
<div class="formula"><p>拍的频率 ν<sub>拍</sub> = |ν₂ − ν₁|，　拍的周期 T<sub>拍</sub> = 1/|ν₂ − ν₁|，　拍的振幅 2A</p></div>
`,
        },
      ],
    },
  ],
};

export default deck10;
