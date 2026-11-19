import type { DeckData } from './types';

/** 第2章 动量守恒和能量守恒 —— 课件 2.1-3（质心/动量/角动量）、2.4-7（功/势能/功能原理/碰撞） */
const deck2: DeckData = {
  id: 'deck2',
  no: '第2章',
  title: '动量守恒和能量守恒',
  subtitle: '质心运动定理 · 动量定理与守恒 · 角动量 · 动能定理 · 保守力与势能 · 功能原理 · 碰撞',
  lede:
    '对于质点系，内力成对出现、内力之和总等于零，对整体运动不产生影响——由此引出质心运动定理与三大守恒定律（动量、角动量、能量）。本章还给出功与能的概念、保守力与势能的引入，以及碰撞问题的统一处理。',
  toc: [
    { id: 'sec-2-1', text: '2-1 质点系的内力和外力 质心 质心运动定理', level: 2 },
    { id: 'sec-2-2', text: '2-2 动量定理 动量守恒定律', level: 2 },
    { id: 'sec-2-3', text: '2-3 质点的角动量和角动量守恒定律', level: 2 },
    { id: 'sec-2-4', text: '2-4 功 能量 动能定理', level: 2 },
    { id: 'sec-2-5', text: '2-5 保守力 势能', level: 2 },
    { id: 'sec-2-6', text: '2-6 质点系的功能原理 机械能守恒定律', level: 2 },
    { id: 'sec-2-7', text: '2-7 碰撞', level: 2 },
  ],
  sections: [
    {
      id: 'sec-2-1',
      heading: '2-1 质点系的内力和外力 质心 质心运动定理',
      blocks: [
        {
          type: 'html',
          html: `
<h3>一、质点系的内力与外力</h3>
<ul>
<li><strong>内力</strong>（internal force）：质点系内各个质点间的相互作用。系统内，内力是成对出现的，系统的内力之和总是等于零，所以它们对整体运动不产生影响。</li>
<li><strong>外力</strong>（external force）：质点系外物体对系统内质点所施加的力。</li>
</ul>
<h3>二、质心</h3>
<p><strong>质心</strong>（center of mass）是与质量分布有关的一个代表点，它的位置在平均意义上代表着质量分布的中心。质心运动反映质点系的整体运动趋势。对于 N 个质点组成的质点系，质心的位矢：</p>
<div class="formula"><p>r<sub>c</sub> = (Σm<sub>i</sub>r<sub>i</sub>)/M　（M = Σm<sub>i</sub>）</p></div>
<p>直角坐标系中的分量式：x<sub>c</sub> = Σm<sub>i</sub>x<sub>i</sub>/M 等。对于质量连续分布的物体：</p>
<div class="formula"><p>r<sub>c</sub> = (1/M)∫r·dm　（线分布 dm = λdl，面分布 dm = σdS，体分布 dm = ρdV）</p></div>
<div class="callout warn">
  <p class="callout-h">注意</p>
  <p>质心与重心（center of gravity）是两个不同的概念：重心是地球对物体各部分引力的合力（即重力）的作用点，质心与重心的位置不一定重合。</p>
</div>
<h3>三、质心运动定理</h3>
<p>由质心位矢公式求导：质心的速度 v<sub>c</sub> = (1/M)Σm<sub>i</sub>v<sub>i</sub>，质心的加速度 a<sub>c</sub> = (1/M)Σm<sub>i</sub>a<sub>i</sub>。由牛顿第二定律，对于系统内成对的内力（合力为零）：</p>
<div class="formula"><p>F<sub>外</sub> = M·a<sub>c</sub></p></div>
<p><strong>质心运动定理</strong>：无论物体的质量如何分布，也不管外力作用在物体的什么位置上，质心的运动就等同于物体的全部质量都集中于此，而且所有外力也都集中作用其上的一个质点的运动一样。</p>
<div class="callout warn">
  <p class="callout-h">注意</p>
  <ol>
    <li>质心的运动状态代表系统的运动状态，质心运动定理描述了系统运动状态的变化与合外力的关系。</li>
    <li>质心的位矢并不是各个质点位矢的几何平均值，而是它们的加权平均值；质心的性质只有在系统的运动与外力的关系中才体现出来。</li>
    <li>系统质心的坐标与坐标原点的选取有关，但系统内各个质点的相对位置与原点的选取无关。</li>
    <li>作用在系统上的诸外力一般不在一条直线上，就作用效果而言不等效于一个合力；但对质心而言，非共点力的作用效果都等效作用在质心上的一个合力。</li>
  </ol>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-2-2',
      heading: '2-2 动量定理 动量守恒定律',
      blocks: [
        {
          type: 'html',
          html: `
<h3>一、质点的动量定理</h3>
<p>由牛顿第二运动定律的微分形式 F = dp/dt，积分得</p>
<div class="formula"><p>I = ∫<sub>t₁</sub><sup>t₂</sup>F·dt = p₂ − p₁ = mv₂ − mv₁</p></div>
<p>∫F·dt 表示力对时间的累积量，叫做<strong>冲量</strong>（impulse of force），单位是 N·s。</p>
<p><strong>动量定理</strong>（theorem of momentum）：质点在运动过程中，所受合外力的冲量等于质点动量的增量。</p>
<p>说明：</p>
<ol>
<li>冲量 I 的方向是所有元冲量 dI = F·dt 的合矢量的方向。动量定理反映了力在时间上的累积作用对质点产生的效果。</li>
<li>动量定理中的动量和冲量都是矢量，符合矢量叠加原理，在平面坐标系下可表示为分量式 I<sub>x</sub> = mv₂ₓ − mv₁ₓ 等。</li>
<li>在冲击、碰撞问题中估算<strong>平均冲力</strong>（impulsive force）：F̄ = I/Δt。</li>
<li>动量定理是牛顿第二定律的积分形式，只适用于惯性系，物体的始末动量应由同一惯性系来表示。</li>
</ol>
<div class="callout tip">
  <p class="callout-h">例：冲力作用</p>
  <p>一冲力作用在质量为 0.3 kg 的物体上，物体最初处于静止状态，已知 F 与 t 的关系为图示曲线（0.02 s 起至 0.07 s）。求：（1）在作用时间内的冲量、平均冲力；（2）物体的末速度。</p>
  <p>解：（1）冲量 I = ∫F·dt = F–t 曲线下的面积；平均冲力 F̄ = I/Δt。（2）由动量定理 v = I/m。</p>
</div>
<div class="callout tip">
  <p class="callout-h">例：锻压工件</p>
  <p>质量 m = 0.3 t 的重锤，从高度 h = 1.5 m 处自由落到受锻压的工件上，工件发生形变。如果作用的时间（1）τ = 0.1 s，（2）τ = 0.01 s，试求锤对工件的平均冲力。</p>
  <p>解法一：研究锤对工件的作用过程，在竖直方向利用动量定理，取竖直向上为正。（N − mg)τ = 0 − (−mv)，其中 v = √(2gh) = √(2×9.8×1.5) ≈ 5.42 m/s，得 N = mg + m√(2gh)/τ。</p>
  <p>τ = 0.1 s：N ≈ 2.9×10³ + 1.63×10⁴ ≈ 1.9×10⁴ N；τ = 0.01 s：N ≈ 1.7×10⁵ N。</p>
  <p>解法二：研究锤从自由下落到静止的整个过程，其动量变化为零——重力作用时间为 √(2h/g) + τ，支持力的作用时间为 τ，由动量定理直接写出上式。</p>
</div>
<h3>二、动量守恒定律</h3>
<p>根据质心运动定理，若 F<sub>外</sub> = 0，则 p = mv<sub>c</sub>·M = 常矢量，即</p>
<div class="formula"><p>Σm<sub>i</sub>v<sub>i</sub> = 常矢量</p></div>
<p><strong>动量守恒定律</strong>（law of conservation of momentum）：如果系统所受的外力之和为零，则系统的总动量保持不变。</p>
<p>说明：</p>
<ol>
<li>动量守恒是指系统动量总和不变，但系统内各个质点的动量可以变化，通过内力进行传递和交换。</li>
<li>某些如（爆炸、碰撞等）特殊过程，虽然体系的合外力并不等于零，但与内力相比可以忽略不计，近似认为系统的总动量守恒。</li>
<li>若某个方向上合外力为零，则该方向上动量守恒，尽管总动量可能并不守恒。</li>
<li>该定律适用于所有惯性系，所有质点的动量必须是对同一参考系的。</li>
<li>直角坐标下的分量式：Σm<sub>i</sub>v<sub>ix</sub> = 常量 等。</li>
</ol>
<div class="callout tip">
  <p class="callout-h">例2-6：炮车反冲</p>
  <p>设炮车以仰角 θ 发射一炮弹，炮车和炮弹的质量分别为 m′ 和 m，炮弹的出口速度为 v，求炮车的反冲速度 v′。炮车与地面间的摩擦力不计。</p>
  <p>解：选取炮车和炮弹组成系统，内、外力分析。炮车与地面间的摩擦力不计，系统<strong>水平方向</strong>动量守恒：mv·cosθ − m′v′ = 0，得炮车的反冲速度 v′ = mv·cosθ/m′。</p>
  <p>思考：竖直方向动量守恒吗？——不守恒（发射瞬间地面对炮车有冲击力）。</p>
</div>
<div class="callout tip">
  <p class="callout-h">例2-7：静止物体炸成三块</p>
  <p>一个静止物体炸成三块，其中两块质量相等，且以相同速度 30 m/s 沿相互垂直的方向飞开，第三块的质量恰好等于这两块质量的总和。试求第三块的速度（大小和方向）。</p>
  <p>解：爆炸时爆炸力是物体内力，它远大于重力，故在爆炸中可认为动量守恒。设每块小质量为 m，则第三块为 2m：p₃ = −(p₁ + p₂)，|p₃| = √2·m·30。由 p₃ = 2m·v₃ 得 v₃ = 15√2 ≈ 21.2 m/s；即 v₃ 与 p₁ 及 p₂ 都成 135° 角，且三者都在同一平面内。</p>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-2-3',
      heading: '2-3 质点的角动量和角动量守恒定律',
      blocks: [
        {
          type: 'html',
          html: `
<h3>一、质点的角动量（动量矩）</h3>
<p>由于动量 p = mv 不能描述转动问题，引入质点对参考点 O 的<strong>角动量</strong>（angular momentum）：</p>
<div class="formula"><p>L = r × p = r × mv</p></div>
<p>大小：L = mvr·sinφ（φ 为 r 与 p 的夹角）；方向：右手螺旋定则确定。同一质点相对于不同的点，角动量不同——在说明质点的角动量时，必须指明是对哪个点而言的。</p>
<p><strong>常见运动的角动量</strong>（补充）：</p>
<ol>
<li>做圆周运动的质点对圆心的角动量：大小 L = mRv = mR²ω，方向由右手螺旋决定。若 ω = 常量，则质点作匀速率圆周运动时，角动量的大小、方向均不变。</li>
<li>椭圆运动的角动量：L = mvr·sinφ，v、r、φ 均变化，但对力心的角动量守恒。</li>
</ol>
<h3>二、力矩</h3>
<p>力对 O 点的力矩：M = r × F；大小：M = Fd = Fr·sinφ（d 为力臂）；方向：r 和 F 所决定的平面，用右手螺旋法则确定——伸出右手，四指垂直拇指，让四指指向 r 的方向，经小于 180° 的角度转向 F 的方向，拇指的指向就是 M 的方向。</p>
<h3>三、质点的角动量定理</h3>
<div class="formula"><p>M = dL/dt</p></div>
<p><strong>质点的角动量定理</strong>：质点对某定点的角动量的时间变化率等于质点所受合外力对该点的力矩。积分形式：∫M·dt = L₂ − L₁（∫M·dt 为力矩对时间的累积，称冲量矩）。</p>
<h3>四、质点的角动量守恒定律</h3>
<p><strong>质点的角动量守恒定律</strong>（law of conservation of angular momentum）：如果作用在质点上的外力对某给定点的力矩为零，则质点对该点的角动量在运动过程中保持不变。若 M = 0，则 L = 常矢量。</p>
<ul>
<li>实验：质量为 m 的小球系在轻绳的一端，绳穿过一竖直的管子，一手握管，另一手执绳。实验发现：r 减小时 v 增大，mvr 保持不变——作用在小球上的有心力对力心的力矩为零，故小球的角动量守恒。</li>
<li>行星绕太阳的运动：作用在行星上的万有引力（有心力）对太阳（力心）的力矩为零，因此行星在运动过程中对太阳的角动量保持不变。<strong>在有心力场中，关于力心的角动量守恒。</strong></li>
</ul>
<div class="callout tip">
  <p class="callout-h">例2-17：飞船发射仪器掠过行星表面</p>
  <p>发射宇宙飞船去考察一质量 m₁、半径 R 的行星，当飞船静止于距行星中心 4R 处时，以速度 v₀（与连线成 α 角）发射一质量为 m₂（m₂ 远小于飞船质量）的仪器，要使仪器恰好掠着行星的表面着陆，α 角应是多少？着陆滑行初速度 v 多大？</p>
  <p>解：有心力场中，运用角动量守恒和 (m₁, m₂) 系统机械能守恒定律：</p>
  <div class="formula"><p>m₂v₀·4R·sinα = m₂vR　（角动量守恒，以行星中心为参考点）</p></div>
  <div class="formula"><p>½m₂v₀² − Gm₁m₂/(4R) = ½m₂v² − Gm₁m₂/R　（机械能守恒，无穷远为零）</p></div>
  <p>解得 v = √(v₀² + 3Gm₁/(2R))，sinα = v/(4v₀)。</p>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-2-4',
      heading: '2-4 功 能量 动能定理',
      blocks: [
        {
          type: 'html',
          html: `
<h3>一、功的概念</h3>
<p>物体在力 F 的作用下发生一无限小的位移 dr（元位移）时，此力对它做的功（work）定义为 dA = F·dr，可以写成两个矢量的标积（scalar product）：dA = F·cosθ·|dr|（θ 为力与位移的夹角）。</p>
<ol>
<li><strong>恒力的功</strong>：A = F·s = Fs·cosθ，单位：J（焦耳）。</li>
<li><strong>变力的功</strong>：A = ∫<sub>a</sub><sup>b</sup>F·dr = ∫F·cosθ·ds。</li>
<li><strong>合力的功</strong>：只有一个质点时，合力的功等于各分力功的代数和。</li>
<li><strong>功率</strong>：P = dA/dt = F·v，单位：J/s（W）。</li>
</ol>
<h3>二、能量</h3>
<p>能量是反映各种运动形式共性的物理量，各种运动形式的相互转化可以用能量来量度，各种运动形式的相互转化遵守能量守恒定律。与机械运动直接相关的能量是<strong>机械能</strong>，它是物体机械运动状态（即位置或速度）的单值函数，包括动能和势能。能量是物体状态的单值函数，物体状态发生变化，它的能量也随之变化。</p>
<h3>三、动能定理</h3>
<p>设质点在变力 F 的作用下沿曲线从 a 点移动到 b 点，变力所做的功为 A = ∫F·dr，由牛顿第二定律 F = ma = m·v(dv/ds)，得</p>
<div class="formula"><p>A = ½mv₂² − ½mv₁²　（定义质点的动能 E<sub>k</sub> = ½mv²）</p></div>
<p><strong>动能定理</strong>（theorem of kinetic energy）：合外力对质点所做的功等于质点动能的增量。微分形式：dA = dE<sub>k</sub>。</p>
<div class="callout warn">
  <p class="callout-h">注</p>
  <ol>
    <li>动能是物体运动状态的单值函数，而功是物体能量变化的一种量度；动能是状态量、态函数，功是过程量。</li>
    <li>动能定理不是经典力学新的、独立的定律，仅是定义了功和动能之后，直接由牛顿第二定律导出它们之间的关系。功与动能虽然都与坐标系的选择有关，但只要是惯性系，动能定理均成立。</li>
    <li>在某些情况下，动能定理比第二定律解决问题方便，它不必考虑物体复杂的运动过程。</li>
  </ol>
</div>
<div class="callout tip">
  <p class="callout-h">例：半圆形围屏</p>
  <p>光滑水平桌面上固定一半圆形围屏，质量为 m 的滑块以 v₀ 沿切线方向入射，屏内壁与滑块摩擦系数为 μ。求当滑块从另一端滑出时，摩擦力对滑块所作的功。</p>
  <p>解：围屏半径 R，滑块受壁的正压力 N = mv²/R，摩擦力 f = μN 始终沿切向。由切向方程 m·dv/dt = −μmv²/R 得 dv/v = −μ·ds/R，积分（半圆弧长 s = πR）得滑出速率 v = v₀·e<sup>−μπ</sup>。由动能定理：</p>
  <div class="formula"><p>A<sub>f</sub> = ½mv² − ½mv₀² = −½mv₀²(1 − e<sup>−2μπ</sup>)</p></div>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-2-5',
      heading: '2-5 保守力 势能',
      blocks: [
        {
          type: 'html',
          html: `
<h3>一、保守力</h3>
<p>根据各种力做功的特点，可将力分为保守力和非保守力：<strong>保守力</strong>（conservative force）——做功与路径无关，只与始末位置有关的力；<strong>非保守力</strong>（non-conservative force）——做功不仅与始末位置有关，还与路径有关的力。</p>
<p><strong>重力的功</strong>：设物体 m 从 a 点沿任一曲线移动到 b 点，在元位移中重力所做的元功 dA = mg·dy 分量累积，得 A = ±mg·Δh。重力做功只与质点的起始和终了位置有关，而与所经过的路径无关，<strong>重力是保守力</strong>！如果物体沿闭合路径 abcda 运动一周，容易计算重力所做的功为零——表明保守力沿任何闭合路径做功等于零：∮<sub>L</sub>F·dr = 0（L 为任意闭合路径）。</p>
<p><strong>弹性力的功</strong>：设光滑水平桌面一端固定的轻弹簧（劲度系数 k），另一端连接质点 m，当质点由 a 点（形变 x₁）运动到 b 点（形变 x₂）的过程中：</p>
<div class="formula"><p>A = ½kx₁² − ½kx₂²</p></div>
<p>弹性力做功只与质点的起始和终了位置有关，与路径无关，<strong>弹性力是保守力</strong>！</p>
<p><strong>万有引力的功</strong>：设质量为 m′ 的质点固定，另一质量为 m 的质点在 m′ 的引力场中从 a 点运动到 b 点：</p>
<div class="formula"><p>A = Gm′m(1/r<sub>b</sub> − 1/r<sub>a</sub>)</p></div>
<p>万有引力的功仅由物体的始末位置决定，与路径无关，<strong>万有引力是保守力</strong>！</p>
<p><strong>摩擦力的功</strong>：质量为 m 的物体在桌面上沿曲线路径从 a 点运动到 b 点，设物体与桌面的摩擦因数为 μ，A<sub>f</sub> = −μmg·s<sub>ab</sub>，其中 s<sub>ab</sub> 为物体经过的路程，与物体的运动路径有关——<strong>摩擦力是非保守力</strong>！</p>
<h3>二、成对力的功</h3>
<p>设有两个质点 m₁ 和 m₂，存在一对相互作用力 F₁₂ 和 F₂₁。在 dt 时间内分别经过元位移 dr₁ 和 dr₂，这一对力所做的元功为 dA = F₁₂·dr₁ + F₂₁·dr₂ = F₁₂·d(r₁ − r₂)，其中 d(r₁ − r₂) 为<strong>相对元位移</strong>。讨论：</p>
<ol>
<li>成对作用力和反作用力所做的总功只与作用力及相对位移有关，而与每个质点各自的运动无关。</li>
<li>质点间的相对位移和作用力都是不随参考系而变化的，因此任何一对作用力和反作用力所做的总功具有与参考系选择无关的不变性质。</li>
<li>可以由相对位移来分析系统中成对内力的功。</li>
</ol>
<h3>三、势能</h3>
<p>与物体的位置相联系的系统能量称为<strong>势能</strong>（potential energy），常用 E<sub>p</sub> 表示。保守力的功是势能变化的量度：</p>
<div class="formula"><p>A<sub>保</sub> = E<sub>pa</sub> − E<sub>pb</sub> = −ΔE<sub>p</sub></p></div>
<p>物体在保守力场中 a、b 两点的势能 E<sub>pa</sub>、E<sub>pb</sub> 之差等于质点由 a 点移动到 b 点过程中保守力做的功 A<sub>ab</sub>。如（若选势能零点）：</p>
<div class="formula"><p>重力势能 E<sub>p</sub> = mgh；　引力势能 E<sub>p</sub> = −Gm′m/r（无穷远为零）；　弹性势能 E<sub>p</sub> = ½kx²</p></div>
<div class="callout warn">
  <p class="callout-h">说明</p>
  <ul>
    <li>势能的大小只有相对的意义，相对于势能零点而言；势能零点可以任意选取，势能差有绝对意义。</li>
    <li>势能是相互作用有保守力的系统的属性。</li>
    <li>已知势能函数，可以计算保守力：由 dA = F·dx = −dE<sub>p</sub>，得保守力沿某坐标轴的分量等于势能对此坐标的导数的负值 F = −dE<sub>p</sub>/dx。</li>
  </ul>
</div>
<h3>四、势能曲线</h3>
<ol>
<li>根据势能曲线的形状可以讨论物体的运动；</li>
<li>利用势能曲线，可以判断物体在各个位置所受保守力的大小和方向。</li>
</ol>
<div class="callout tip">
  <p class="callout-h">例：火箭升空</p>
  <p>已知地球的质量为 M，半径为 R，一质量为 m 的火箭从地面（距地心 R）上升到距离地心 2R 处，求在此过程中地球的引力对火箭所作的功。</p>
  <p>解：A = G M m(1/r<sub>b</sub> − 1/r<sub>a</sub>) = GMm(1/(2R) − 1/R) = −GMm/(2R)（引力做负功）。</p>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-2-6',
      heading: '2-6 质点系的功能原理 机械能守恒定律',
      blocks: [
        {
          type: 'html',
          html: `
<h3>一、质点系的动能定理</h3>
<p>设系统由两个质点 m₁ 和 m₂ 组成，对质点 1 和 2 分别应用动能定理，相加得（系统外力的功 A<sub>e</sub>、系统内力的功 A<sub>i</sub>）：</p>
<div class="formula"><p>A<sub>e</sub> + A<sub>i</sub> = E<sub>k</sub> − E<sub>k0</sub></p></div>
<p><strong>质点系的动能定理</strong>：系统的外力和内力做功的总和等于系统动能的增量。</p>
<div class="callout warn">
  <p class="callout-h">注意</p>
  <p>系统内力的矢量和为零，但系统内力所做的功之和不一定为零。内力不能改变系统的总动量，但能改变系统的总动能。</p>
</div>
<h3>二、质点系的功能原理</h3>
<p>对系统的内力来说，有保守内力和非保守内力之分，所以内力的功也分为保守内力的功和非保守内力的功。根据势能定义 A<sub>保内</sub> = −ΔE<sub>p</sub>，代入动能定理得：</p>
<div class="formula"><p>A<sub>e</sub> + A<sub>非保守内</sub> = (E<sub>k</sub> + E<sub>p</sub>) − (E<sub>k0</sub> + E<sub>p0</sub>)　即 A<sub>e</sub> + A<sub>非保守内</sub> = ΔE<sub>机械</sub></p></div>
<p><strong>质点系的功能原理</strong>：当系统从状态 1 变化到状态 2 时，它的机械能的增量等于外力的功与非保守内力的功的总和。与动能定理比较，运用功能原理时由于保守力所做的功已为系统势能的变化所代替，因此不必再计算保守内力的功。</p>
<div class="callout tip">
  <p class="callout-h">例2-12：汽车冲坡</p>
  <p>一汽车的速度 v₀ = 36 km/h，驶至一斜率为 0.010 的斜坡时，关闭油门。设车与路面间的摩擦阻力为车重的 0.05 倍，问汽车能冲上斜坡多远？</p>
  <p>解法一：取汽车为研究对象，设汽车能冲上斜坡的距离为 s，此时汽车的末速度为 0。根据动能定理：−mg·0.010·s − 0.05mg·s = 0 − ½mv₀²，得 s = v₀²/[g(0.010 + 0.05)] ≈ 170 m。</p>
  <p>解法二：取汽车和地球这一系统为研究对象，运用系统的功能原理（摩擦力为非保守力做负功），结果相同。</p>
</div>
<h3>三、机械能守恒定律</h3>
<p>若 A<sub>e</sub> = 0 且 A<sub>非保守内</sub> = 0，由质点系的功能原理：</p>
<div class="formula"><p>E<sub>k</sub> + E<sub>p</sub> = 常量</p></div>
<p><strong>机械能守恒定律</strong>（law of conservation of mechanical energy）：如果一个系统内只有保守力作功，其他非保守内力与外力都不作功，则系统内各物体的动能和势能可以互相转化，但机械能的总值保持不变。</p>
<div class="callout tip">
  <p class="callout-h">例2-14：起重机钢丝绳</p>
  <p>起重机用钢丝绳吊运一质量为 m 的物体，以速度 v₀ 做匀速下降。当起重机突然刹车时，物体因惯性继续下降，问使钢丝绳再有多少微小的伸长？（设钢丝绳的劲度系数为 k，钢丝绳的重力忽略不计。）这样突然刹车后，钢丝绳所受的最大拉力将有多大？</p>
  <p>解：研究物体、地球和钢丝绳所组成的系统，系统的机械能守恒。首先讨论起重机突然停止的瞬时位置处的机械能：设物体因惯性继续下降的微小距离为 h，并以这最低位置作为重力势能的零点；设这时钢丝绳的伸长量为 x₀（匀速运动时 kx₀ = mg）。</p>
  <p>初态机械能：½mv₀² + mgh + ½kx₀²；末态（最低位置，伸长量 x = x₀ + h）：½k(x₀ + h)²。由机械能守恒并代入 kx₀ = mg，得</p>
  <div class="formula"><p>h = v₀·√(m/k)，　F<sub>max</sub> = k(x₀ + h) = mg + v₀·√(km)</p></div>
</div>
<h3>四、能量守恒定律</h3>
<p>对孤立系统，由质点系的功能原理（非保守力做功对应其他形式能量的变化）：</p>
<div class="formula"><p>E₁ = E₂ = 常量</p></div>
<p><strong>能量守恒定律</strong>（law of conservation of energy）：一个孤立系统经历任何变化时，该系统的所有能量的总和是不变的，能量只能从一种形式变化为另外一种形式，或从系统内一个物体传给另一个物体。它是自然界最普遍的定律之一。</p>
`,
        },
      ],
    },
    {
      id: 'sec-2-7',
      heading: '2-7 碰撞',
      blocks: [
        {
          type: 'html',
          html: `
<p>如果两个或几个物体在相遇中，物体之间的相互作用仅持续一个极为短暂的时间，这些现象就是<strong>碰撞</strong>（collision）。如：撞击、打桩、锻铁等，以及微观粒子间的非接触相互作用过程即散射（scattering）等。</p>
<p>讨论两球的<strong>对心碰撞</strong>或称正碰撞（direct impact）：即碰撞前后两球的速度在两球的中心连线上。</p>
<h3>1. 碰撞过程系统动量守恒</h3>
<div class="formula"><p>m₁v₁₀ + m₂v₂₀ = m₁v₁ + m₂v₂</p></div>
<h3>2. 牛顿的碰撞定律与恢复系数</h3>
<p>碰撞后两球的分离速度 (v₂ − v₁)，与碰撞前两球的接近速度 (v₁₀ − v₂₀) 成正比，比值由两球的材料性质决定，即<strong>恢复系数</strong>（coefficient of restitution）：</p>
<div class="formula"><p>e = (v₂ − v₁)/(v₁₀ − v₂₀)</p></div>
<ul>
<li><strong>完全非弹性碰撞</strong>（perfect inelastic collision）：e = 0，v₂ = v₁（两物体碰撞后以同一速度运动并不分开）；</li>
<li><strong>完全弹性碰撞</strong>（perfect elastic collision）：e = 1，v₂ − v₁ = v₁₀ − v₂₀；</li>
<li><strong>非弹性碰撞</strong>（inelastic collision）：0 &lt; e &lt; 1。</li>
</ul>
<p>非弹性碰撞（0 &lt; e &lt; 1）碰后两球的速度为 v₁ = v<sub>c</sub> − e·m₂(v₁₀ − v₂₀)/(m₁ + m₂)，v₂ = v<sub>c</sub> + e·m₁(v₁₀ − v₂₀)/(m₁ + m₂)（v<sub>c</sub> 为质心速度），机械能损失：</p>
<div class="formula"><p>ΔE<sub>k</sub> = ½·[m₁m₂/(m₁ + m₂)]·(1 − e²)·(v₁₀ − v₂₀)²</p></div>
<p>完全非弹性碰撞（e = 0）损失的机械能：ΔE<sub>k</sub> = ½·[m₁m₂/(m₁ + m₂)]·(v₁₀ − v₂₀)²。应用：如打桩、打铁时——m₁/m₂ 越大，机械能损失越小（打铁）；m₁/m₂ 越小，机械能损失越大（打桩）。</p>
<h3>完全弹性碰撞（e = 1）</h3>
<p>机械能损失为零——完全弹性碰撞过程，系统的机械能（动能）也守恒。碰后速度：</p>
<div class="formula"><p>v₁ = [(m₁ − m₂)v₁₀ + 2m₂v₂₀]/(m₁ + m₂)，　v₂ = [(m₂ − m₁)v₂₀ + 2m₁v₁₀]/(m₁ + m₂)</p></div>
<div class="callout key">
  <p class="callout-h">讨论</p>
  <ol>
    <li>当 m₁ = m₂ 时，v₁ = v₂₀，v₂ = v₁₀——质量相等的两个质点在碰撞中交换彼此的速度。</li>
    <li>若 v₂₀ = 0 且 m₂ ≫ m₁，则 v₁ ≈ −v₁₀，v₂ ≈ 0——质量很小的质点与质量很大的静止质点碰撞后，调转运动方向，而质量很大的质点几乎保持不动。</li>
    <li>若 v₂₀ = 0 且 m₂ ≪ m₁，则 v₁ ≈ v₁₀，v₂ ≈ 2v₁₀——质量很大的质点与质量很小的静止质点碰撞后速度几乎不变，但质量很小的质点却以近两倍的速度运动起来。</li>
  </ol>
</div>
`,
        },
      ],
    },
  ],
};

export default deck2;
