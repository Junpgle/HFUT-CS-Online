import type { DeckData } from './types';

/** 第8章 恒定电流的磁场 —— 期末课件 PDF 6～8（§8-1 恒定电流 ～ §8-8 有磁介质时的安培环路定理） */
const deck8: DeckData = {
  id: 'deck8',
  no: '第8章',
  title: '恒定电流的磁场',
  subtitle: '电流与磁感强度 · 毕奥–萨伐尔定律 · 安培环路定理 · 洛伦兹力与安培力 · 磁力矩 · 磁介质',
  lede:
    '教学基本要求：掌握描述磁场的物理量——磁感强度的概念，理解它是矢量点函数；理解毕奥–萨伐尔定律并能计算简单问题中的磁感强度；理解稳恒磁场的高斯定理和安培环路定理及用安培环路定理计算磁感强度的条件和方法；理解洛伦兹力和安培力的公式，能分析电荷在均匀电场和磁场中的受力和运动，了解磁矩的概念，能计算简单几何形状载流导体和载流平面线圈所受的力和力矩。',
  toc: [
    { id: 'sec-8-1', text: '8-1 恒定电流 磁感应强度', level: 2 },
    { id: 'sec-8-2', text: '8-2 磁通量 磁场的高斯定理', level: 2 },
    { id: 'sec-8-3', text: '8-3 毕奥–萨伐尔定律', level: 2 },
    { id: 'sec-8-4', text: '8-4 恒定磁场的安培环路定理', level: 2 },
    { id: 'sec-8-5', text: '8-5 带电粒子在电场和磁场中的运动', level: 2 },
    { id: 'sec-8-6', text: '8-6 磁场对载流导线的作用', level: 2 },
    { id: 'sec-8-7', text: '8-7 磁场中的磁介质', level: 2 },
  ],
  sections: [
    {
      id: 'sec-8-1',
      heading: '8-1 恒定电流 磁感应强度',
      blocks: [
        {
          type: 'html',
          html: `
<h3>一、恒定电流与电流密度</h3>
<p>电流 I = dq/dt——标量，方向为正电荷运动的方向。<strong>电流密度矢量</strong>：方向为正电荷运动的方向；大小等于单位时间内从垂直于电荷运动方向的单位截面上流过的电荷量：</p>
<div class="formula"><p>j = dI/(dS<sub>⊥</sub>) = nqv·dS<sub>⊥</sub>/dS<sub>⊥</sub> = nqv</p></div>
<h3>二、磁感应强度的定义</h3>
<p><strong>基本磁现象</strong>：中国最早发现磁现象（磁石吸引铁屑），十一世纪沈括发明指南针（司南勺）；天然磁铁吸引铁、钴、镍等物质；把磁铁作任意分割，每一小块都有南北两极——任一磁铁总是两极同时存在。奥斯特磁针实验发现<strong>电流的磁效应</strong>。安培提出<strong>分子电流假设</strong>：磁现象的电本质——运动的电荷产生磁场（运动电荷 → 磁场；静止的电荷 → 静电场）。</p>
<p><strong>磁感强度 B 的定义</strong>：设带电量为 q、速度为 v 的运动试探电荷处于磁场中，实验发现：</p>
<ol>
<li>带电粒子在磁场中沿某一特定直线方向运动时不受力（F = 0），此直线方向与电荷无关——该特定直线方向即 B 的方向；</li>
<li>当带电粒子垂直于特定直线运动时受力最大：F<sub>max</sub> = qvB，F<sub>max</sub> 大小与 q、v 无关（F<sub>max</sub>/qv 为定值）；</li>
<li>带电粒子沿其他方向运动时，F ⊥ v 且垂直于 v 与特定直线所组成的平面。</li>
</ol>
<div class="formula"><p>F<sub>max</sub> = qvB　（磁感强度大小）；　B 的方向：F<sub>max</sub> × v 的方向（正电荷垂直于特定直线运动时受力 F<sub>max</sub>，将 F<sub>max</sub> × v 方向定义为该点 B 的方向）</p></div>
<p>运动电荷在磁场中受力：F = qv × B。单位：特斯拉（T），1 T = 1 N/(A·m)。</p>
<h3>三、磁感线</h3>
<p>规定：曲线上每一点的切线方向就是该点的磁感强度 B 的方向，曲线的疏密程度表示该点的磁感强度 B 的大小——磁场中某点处垂直于 B 的单位面积上通过的磁感线数目等于该点 B 的数值。</p>
<p>几种不同形状电流磁场的磁感应线。<strong>磁感应线的性质</strong>：与电流套连的闭合曲线（磁单极子不存在）、互不相交、方向与电流成右手螺旋关系。</p>
`,
        },
      ],
    },
    {
      id: 'sec-8-2',
      heading: '8-2 磁通量 磁场的高斯定理',
      blocks: [
        {
          type: 'html',
          html: `
<p><strong>磁通量</strong>：通过某一曲面的磁感线数为通过此曲面的磁通量。</p>
<div class="formula"><p>Φ = BS<sub>⊥</sub> = BS·cosθ = B·S（均匀磁场）；　dΦ = B·cosθ·dS = B·dS（非均匀）</p></div>
<div class="formula"><p>Φ = ∫∫<sub>S</sub>B·dS　（单位：1 Wb = 1 T·m²）</p></div>
<div class="callout key">
  <p class="callout-h">磁场的高斯定理</p>
  <p>通过任意闭合曲面的磁通量必等于零（磁场是无源场）：</p>
  <div class="formula"><p>∮<sub>S</sub>B·dS = 0</p></div>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-8-3',
      heading: '8-3 毕奥–萨伐尔定律',
      blocks: [
        {
          type: 'html',
          html: `
<h3>一、毕奥—萨伐尔定律（电流元在空间产生的磁场）</h3>
<div class="formula"><p>dB = (μ₀/4π)·(Idl·sinθ/r²)，　矢量式 dB = (μ₀/4π)·(Idl × e<sub>r</sub>)/r²</p></div>
<p>真空磁导率 μ₀ = 4π×10⁻⁷ N/A²。任意载流导线在点 P 处的磁感强度（磁感强度叠加原理）：</p>
<div class="formula"><p>B = ∫dB = ∫(μ₀/4π)·(I dl × e<sub>r</sub>)/r²</p></div>
<div class="callout key">
  <p class="callout-h">例：判断各点磁感强度的方向和大小（圆弧上的电流元）</p>
  <p>圆弧上各电流元到圆心距离均为 R：1、5 点（dl ∥ r）dB = 0；3、7 点（dl ⊥ r）dB = (μ₀/4π)·Idl/R²；2、4、6、8 点 dB = (μ₀/4π)·(Idl × e<sub>r</sub>)/r²（介于两者之间）。</p>
</div>
<h3>二、毕奥—萨伐尔定律应用举例</h3>
<div class="callout tip">
  <p class="callout-h">例：载流长直导线的磁场</p>
  <p>电流 I 的长直导线旁一点 P（距离 r₀），取电流元 Idz：dB = (μ₀/4π)·(I·dz·sinθ/r²)。由几何关系 z = −r₀·cotθ、dz = r₀·dθ/sin²θ、r = r₀/sinθ，对 CD 段积分：</p>
  <div class="formula"><p>B = (μ₀I/4πr₀)·(cosθ₁ − cosθ₂)　（dB 的方向均沿 x 轴的负方向）</p></div>
  <p><strong>无限长载流长直导线</strong>（θ₁ → 0、θ₂ → π）：B = μ₀I/(2πr₀)——电流与磁感强度成右螺旋关系。<strong>半无限长载流长直导线</strong>（θ₁ = π/2、θ₂ → π）：B = μ₀I/(4πr₀)。</p>
</div>
<div class="callout tip">
  <p class="callout-h">例：通过矩形面积的磁通量</p>
  <p>载流长直导线的电流为 I，求通过宽为 (d₂ − d₁)、长为 l 的矩形面积的磁通量。解：先求 B = μ₀I/(2πx)（x 为到导线的距离），对变磁场给出 dB = (μ₀I/2πx)·l·dx 后积分求 Φ：</p>
  <div class="formula"><p>Φ = ∫(μ₀Il/2πx)·dx = (μ₀Il/2π)·ln(d₂/d₁)</p></div>
</div>
<div class="callout tip">
  <p class="callout-h">例：圆形载流导线（圆电流）轴线上的磁场</p>
  <p>真空中，半径为 R 的载流导线通有电流 I（圆电流），求其轴线上一点 P 的磁感强度的方向和大小。</p>
  <p>解：由对称性分析，垂直轴线方向的分量抵消，B = B<sub>x</sub> = ∫dB·sinφ；d<sub>x</sub>B = (μ₀/4π)·(I·sinφ·dl/r²)，其中 sinφ = R/r、r² = R² + x²：</p>
  <div class="formula"><p>B = μ₀IR²/(2(x² + R²)<sup>3/2</sup>)　（B 的方向不变，与 I 成右螺旋关系）</p></div>
  <p>讨论：1）若线圈有 N 匝，B = μ₀NIR²/(2(x² + R²)<sup>3/2</sup>)；2）x ≫ R 时，B = μ₀IR²/(2x³) = μ₀IS/(2πx³)；3）x = 0（圆心处）：B = μ₀I/(2R)。</p>
</div>
<p><strong>磁偶极矩</strong>：m = NIS·e<sub>n</sub>（e<sub>n</sub> 与 I 成右螺旋；N 为匝数）。圆电流磁感强度公式在远场的矢量形式：B = μ₀m/(2πx³)·e<sub>n</sub>（x ≫ R）。</p>
<div class="callout key">
  <p class="callout-h">常见圆弧与直线在圆心的磁感强度（按叠加原理组合）</p>
  <p>（1）完整圆电流圆心：B₀ = μ₀I/(2R)；（2）半圆圆心：B₀ = μ₀I/(4R)；（3）1/4 圆圆心：B₀ = μ₀I/(8R)；（4）（5）含直线段的组合图形：直线段电流在过端点垂线上距 d 处的场为 B = μ₀I/(4πd)，按矢量叠加求和。</p>
</div>
<div class="callout tip">
  <p class="callout-h">例8-4：亥姆霍兹线圈</p>
  <p>在实验室中，常应用亥姆霍兹线圈产生所需的不太强的均匀磁场。它是由一对相同半径的同轴载流线圈组成，当它们之间的距离等于它们的半径时，试计算两线圈中心处和轴线上中点的磁感应强度。设两个线圈的半径为 R，各有 N 匝，每匝中的电流均为 I，且流向相同。</p>
  <p>解：两线圈在轴线上各点的场强方向均沿轴线向右，在圆心 O₁、O₂ 处磁感应强度相等：B = μ₀NI/2R + μ₀NIR²/(2(R² + R²)<sup>3/2</sup>) = 0.677·μ₀NI/R。两线圈间轴线上中点 P 处：B<sub>P</sub> = 2×μ₀NIR²/(2(R² + R²/4)<sup>3/2</sup>) = 0.716·μ₀NI/R。在 P 点两侧各 R/4 处的 Q₁、Q₂ 两点处磁感应强度：B<sub>Q</sub> ≈ 0.712·μ₀NI/R。轴线上中点附近的场强近似均匀。</p>
</div>
<div class="callout tip">
  <p class="callout-h">例：载流直螺线管的磁场</p>
  <p>有一长为 l、半径为 R 的载流密绕直螺线管，每单位长度上有线圈 n 匝，通有电流 I。设把螺线管放在真空中，求管内轴线上一点处的磁感强度。</p>
  <p>解：由圆形电流磁场公式 B = μ₀IR²/(2(x² + R²)<sup>3/2</sup>)，把螺线管分成无数圆环（每个圆环电流 dI = nI·dx），取 β 为 P 点到线圈端点的视角角（cotβ = x/R，csc²β·R = √(x²+R²)·R/x²），积分得</p>
  <div class="formula"><p>B = (μ₀nI/2)·(cosβ₂ − cosβ₁)</p></div>
  <p>讨论：（1）P 点位于管内轴线中点：B = μ₀nI·(l/2)/√((l/2)² + R²)，若 l ≫ R 则 B = μ₀nI；（2）无限长的螺线管：B = μ₀nI；（3）半无限长螺线管（一端处）：B = μ₀nI/2。B~x 曲线：管内中段平直（μ₀nI），两端降至一半。</p>
</div>
<h3>四、运动电荷的磁场</h3>
<p>电流由电荷运动形成。由毕—萨定律 I·dl = nSdl·qv（dl 内电荷数 dN = nS·dl），得单个运动电荷的磁场（实用条件 v ≪ c）：</p>
<div class="formula"><p>B = (μ₀/4π)·(qv × e<sub>r</sub>)/r²</p></div>
<div class="callout tip">
  <p class="callout-h">例8-5：玻尔氢原子的轨道磁矩</p>
  <p>在玻尔的氢原子模型中，电子绕原子核做匀速圆周运动，具有相应的磁矩，称为轨道磁矩。设圆半径为 r，转速为 n。求：（1）轨道中心的磁感应强度的大小；（2）轨道磁矩 μ 与轨道角动量 L 之间的关系；（3）计算氢原子在基态时电子的轨道磁矩。</p>
  <p>解：（1）解法 1（运动电荷的磁场）：v = ωr = 2πnr，B = (μ₀/4π)·(2πnre/r²) = μ₀ne/(2r)。解法 2：电子的运动相当于一个圆电流 I = ne，由圆电流中心的磁场公式 B₀ = μ₀I/(2r) = μ₀ne/(2r)。（2）轨道磁矩 μ = IS = ne·πr²；轨道角动量 L = m<sub>e</sub>·vr = m<sub>e</sub>·2πnr·r = 2m<sub>e</sub>·nπr²，故 μ = eL/(2m<sub>e</sub>)；角动量和磁矩的方向恰好相反（电子带负电）：μ<sub>e</sub> = −eL/(2m<sub>e</sub>)。这一经典结论与量子理论导出的结果相符。（3）基态时 L = h/2π，轨道磁矩 μ = eh/(4πm<sub>e</sub>) ≈ 9.27×10⁻²⁴ A·m²（玻尔磁子）。</p>
</div>
<div class="callout tip">
  <p class="callout-h">例：旋转的带电薄圆盘</p>
  <p>半径为 R 的带电薄圆盘的电荷面密度为 σ，并以角速度 ω 绕通过盘心垂直于盘面的轴转动，求圆盘中心的磁感强度。</p>
  <p>解：解法一（圆电流的磁场）：半径 r 处取环带，其电荷 dq = σ·2πr·dr，环电流 dI = dq/dT = σ·2πr·dr·ω/(2π) = σωr·dr，在圆心产生的磁场 dB = μ₀dI/(2r) = μ₀σω·dr/2，积分得</p>
  <div class="formula"><p>B₀ = ∫₀<sup>R</sup>μ₀σω·dr/2 = μ₀σωR/2　（σ &gt; 0 时 B 方向由 ω 与电荷符号确定）</p></div>
  <p>解法二（运动电荷的磁场）：环带上电荷 dq = σ·2πr·dr，以速度 v = ωr 运动，dB = (μ₀/4π)·(dq·v)/r² = μ₀σω·dr/2，结果相同。</p>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-8-4',
      heading: '8-4 恒定磁场的安培环路定理',
      blocks: [
        {
          type: 'html',
          html: `
<h3>一、安培环路定理</h3>
<p>载流长直导线的磁感强度为 B = μ₀I/(2πr)。设闭合回路为圆形回路（l 与 I 成右螺旋）：∮B·dl = ∮(μ₀I/2πR)·dl = μ₀I。在垂直于导线的平面内任作一环路：B·dl = (μ₀I/2πr·r)dφ = μ₀I·dφ/(2π)，积分仍为 μ₀I。如果沿同一路径但改变绕行方向积分：∮B·dl = −μ₀I。对任意形状的回路、不在垂直于导线的平面内的回路（dl = dl<sub>⊥</sub> + dl<sub>//</sub>）：∮B·dl = ∮B·cosθ·dl<sub>//</sub> = μ₀I——磁感应强度矢量的环流与闭合曲线的形状无关，它只和闭合曲线内所包围的电流有关。电流在回路之外：∮B·dl = 0。</p>
<p>多电流情况：B = B₁ + B₂ + B₃，以上结果对任意形状的闭合电流（伸向无限远的电流）均成立，如 ∮B·dl = μ₀(I₁ − I₂ + I₃)。</p>
<div class="callout key">
  <p class="callout-h">安培环路定理</p>
  <div class="formula"><p>∮<sub>L</sub>B·dl = μ₀·Σ<sub>i=1</sub><sup>n</sup>I<sub>i</sub></p></div>
  <p>在真空的稳恒磁场中，磁感应强度 B 沿任一闭合路径的积分的值，等于 μ₀ 乘以该闭合路径所包围的各电流的代数和。电流正负的规定：与回路绕行方向 L 成右螺旋时 I 为正，反之为负。</p>
</div>
<div class="callout key">
  <p class="callout-h">问与注意（课件）</p>
  <p>问 1）B 是否与回路 L 外电流有关？——有关（B 是所有电流产生磁场的叠加），但环流 ∮B·dl 只与 L 内电流有关。问 2）若 ∮<sub>L</sub>B·dl = 0，是否回路上各处 B = 0？是否回路内无电流穿过？——都不是：环流为零不等于每点 B 为零；回路内电流代数和为零也可能有电流穿过（如一进一出）。</p>
  <p>几点注意：环流虽然仅与所围电流有关，但磁场却是所有电流在空间产生磁场的叠加；任意形状稳恒电流，安培环路定理都成立；静电场的高斯定理说明静电场为有源场，环路定理又说明静电场无旋；稳恒磁场的环路定理反映稳恒磁场有旋，高斯定理又反映稳恒磁场无源。</p>
</div>
<h3>二、安培环路定理的应用举例</h3>
<div class="callout tip">
  <p class="callout-h">例：长直密绕螺线管内磁场</p>
  <p>解：1）对称性分析：螺线管内为均匀场，方向沿轴向（与电流成右螺旋），外部磁感强度趋于零。2）选回路 L（矩形 MNOP）：∮B·dl = ∮<sub>MN</sub> + ∮<sub>NO</sub> + ∮<sub>OP</sub> + ∮<sub>PM</sub> = B·l<sub>MN</sub> = μ₀·n·l<sub>MN</sub>·I，得</p>
  <div class="formula"><p>B = μ₀nI　（无限长载流螺线管内部磁场处处相等，外部磁场为零）</p></div>
</div>
<div class="callout tip">
  <p class="callout-h">例：载流螺绕环内的磁场</p>
  <p>解：1）对称性分析：环内 B 线为同心圆，环外为零。2）选半径 r 的圆形回路（r > R）：B·2πr = μ₀NI，得</p>
  <div class="formula"><p>B = μ₀NI/(2πr)　；　令 n = N/(2πr)，当 d ≪ 2R 时，B = μ₀nI，螺绕环内可视为均匀场</p></div>
</div>
<div class="callout tip">
  <p class="callout-h">例：无限长载流圆柱体与圆柱面</p>
  <p>圆柱体（半径 R，电流 I 均匀分布）：r &gt; R 时 B·2πr = μ₀I，B = μ₀I/(2πr)；r &lt; R 时回路内电流为 I·r²/R²，B·2πr = μ₀I·r²/R²，B = μ₀Ir/(2πR²)。B 在表面处最大，B~r 连续。圆柱面：r &lt; R 时 ∮B·dl = 0，B = 0；r &gt; R 时 B = μ₀I/(2πr)。（B 的方向与 I 成右螺旋。）</p>
</div>
<div class="callout key">
  <p class="callout-h">应用安培环路定理的解题步骤</p>
  <ol>
    <li>分析磁场的对称性；</li>
    <li>过场点选择适当的路径，使得 B 沿此环路的积分易于计算（B 的量值恒定，B 与 dl 的夹角处处相等）；</li>
    <li>求出环路积分；</li>
    <li>用右手螺旋定则确定所选定的回路包围电流的正负，最后由磁场的安培环路定理求出磁感应强度 B 的大小。</li>
  </ol>
  <p>（课件思考题：两根直导线 ab 和 cd 沿半径方向被接到一个截面处处相等的铁环上，稳恒电流 I 从 a 端流入而从 d 端流出，则磁感强度 B 沿闭合路径 L 的积分 ∮<sub>L</sub>B·dl = 2μ₀I/3——L 包围的支路电流为 2I/3。）</p>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-8-5',
      heading: '8-5 带电粒子在电场和磁场中的运动',
      blocks: [
        {
          type: 'html',
          html: `
<h3>一、洛伦兹力</h3>
<p>带电粒子运动的方向与磁场方向成 θ 夹角时，所受磁力（洛伦兹力）：</p>
<div class="formula"><p>F = qv × B　（大小 F = qvB·sinθ；方向 ⊥ v 与 B 所组成的平面）</p></div>
<p>带电粒子沿磁场方向运动时：F = 0；带电粒子的运动方向与磁场方向垂直时：F = qvB。</p>
<h3>1. 带电粒子在均匀磁场中的运动</h3>
<p>设均匀磁场 B，带电粒子 q、m、v：</p>
<ol>
<li><strong>运动方向与磁场方向平行</strong>（v ∥ B）：洛伦兹力 F = qv × B = 0，带电粒子做匀速直线运动。</li>
<li><strong>运动方向与磁场方向垂直</strong>（v ⊥ B）：运动方程 qvB = mv²/R，运动半径 R = mv/(qB)，故带电粒子做匀速圆周运动。周期 T = 2πR/v = 2πm/(qB)，角频率 ω = 2π/T = qB/m——带电粒子做匀速圆周运动，周期和角频率与速度无关。</li>
<li><strong>运动方向沿任意方向</strong>（v 与 B 成 θ 角）：分解 v——v<sub>⊥</sub> = v·sinθ 作匀速圆周运动，v<sub>//</sub> = v·cosθ 作匀速直线运动，带电粒子做<strong>螺旋线运动</strong>。半径 R = mv·sinθ/(qB)，周期 T = 2πm/(qB)，螺距 h = v<sub>//</sub>·T = 2πm·v·cosθ/(qB)。</li>
</ol>
<p><strong>磁聚焦</strong>：在均匀磁场中某点 A 发射一束初速相差不大的带电粒子，它们的 v₀ 与 B 之间的夹角 θ 不尽相同但都较小，这些粒子沿半径不同的螺旋线运动，因螺距近似相等，都相交于屏上同一点，此现象称之为磁聚焦。</p>
<h3>2. 带电粒子在非均匀磁场中运动</h3>
<ol>
<li>磁场越强螺旋半径越小，并且会聚磁场中做螺旋运动的带正电粒子会掉向返转（磁镜效应）；</li>
<li><strong>磁约束装置</strong>：地球磁场构成一个天然的磁约束，来自外层空间的带电粒子被地磁场俘获形成范艾仑（Van Allen）辐射带；托卡马克（TOKAMAK）利用一组线圈环形排列，通电后就可形成等离子体磁约束装置，是实现高温等离子体磁约束、进而实现可控核聚变的重要设备。</li>
</ol>
`,
        },
      ],
    },
    {
      id: 'sec-8-6',
      heading: '8-6 磁场对载流导线的作用',
      blocks: [
        {
          type: 'html',
          html: `
<h3>一、安培力（安培定律）</h3>
<p>导线中每个自由电子受洛伦兹力 f = −e·v × B，由于自由电子与晶格之间的相互作用，使导线在宏观上看起来受到了磁场的作用力——<strong>安培定律</strong>：磁场对电流元的作用力</p>
<div class="formula"><p>dF = Idl × B　（dF = BIdl·sinθ）</p></div>
<p>意义：磁场对电流元作用的力，在数值上等于电流元 Idl 的大小、电流元所在处的磁感强度大小以及电流元和磁感应强度之间的夹角 θ 的正弦之乘积；dF 垂直于 Idl 和 B 所组成的平面，且与 Idl × B 同向。有限长载流导线所受的安培力：F = ∫dF = ∫B × Idl（矢量积分；分量式 dF<sub>x</sub> = dF·sinθ 等）。</p>
<div class="callout tip">
  <p class="callout-h">例：半圆导线的安培力</p>
  <p>在磁感强度为 B 的均匀磁场中，通过一半径为 R 的半圆导线中的电流为 I。若导线所在平面与 B 垂直，求该导线所受的安培力。</p>
  <p>解：由电流分布的对称性分析导线受力的对称性：dF<sub>x</sub> 分量抵消，F = ∫dF<sub>y</sub>。由安培定律 dF = BIdl（dl ⊥ B）、几何关系 dl = R·dθ：F = ∫₀<sup>π</sup>BIR·sinθ·dθ = 2BIR，合力 F 的方向为 y 轴正方向。<strong>半圆形载流导线上所受的力与其两个端点相连的直导线所受到的力相等</strong>。</p>
</div>
<div class="callout tip">
  <p class="callout-h">又例：闭合回路在均匀磁场中</p>
  <p>一通有电流 I 的闭合回路放在磁感应强度为 B 的均匀磁场中，回路平面与磁感强度垂直。回路由直导线 AB 和半径为 r 的圆弧导线 BCA 组成，电流为顺时针方向，求磁场作用于闭合导线的力。</p>
  <p>解：根据对称性分析，直导线 AB 受力 F₁ = −BI·(2r·sinθ₀)·j（指向 y 负方向）；圆弧 BCA 各电流元的 dF<sub>y</sub> = BIdl·sinθ 积分得 F₂ = +BIr·j·(2sinθ₀)·?。由于 F₁ = −F₂，故 <strong>F = F₁ + F₂ = 0</strong>——闭合载流回路在均匀磁场中所受合力为零。</p>
</div>
<div class="callout tip">
  <p class="callout-h">再例：不规则平面载流导线</p>
  <p>求不规则的平面载流导线在均匀磁场中所受的力（起点与终点间水平距离 l，B 垂直纸面）。</p>
  <p>解：取一段电流元 Idl：dF = BIdl，dF<sub>x</sub> = dF·sinθ = BIdy → F<sub>x</sub> = ∫BI·dy = 0（起点终点同一竖直线时）；dF<sub>y</sub> = dF·cosθ = BI·dx → F<sub>y</sub> = ∫BI·dx = BIl。<strong>结论：任意平面载流导线在均匀磁场中所受的力，与其始点和终点相同的载流直导线所受的磁场力相同</strong>（F = BIl·j）。</p>
</div>
<p>安培力的应用：磁悬浮列车的电磁驱动力。</p>
<h3>三、磁场作用于载流线圈的磁力矩</h3>
<p>如图均匀磁场中有一矩形载流线圈 MNOP（MN = NO = l₁、l₂ 为另一边），线圈平面法线 e<sub>n</sub> 与 B 成 θ 角：F₁ = F₂ = BIl₂（对边等大反向），F₃ = F₄ = BIl₁·sin(π/2 − θ)（对边等大反向）——合力 ΣF = 0。两对力形成力偶，磁力矩：</p>
<div class="formula"><p>M = F₁·l₁·sinθ = BI·l₂·l₁·sinθ = BIS·sinθ</p></div>
<div class="formula"><p>M = m × B　（N 匝线圈：M = NBIS·sinθ = m × B）</p></div>
<p>讨论：（1）θ = 0 时（m ∥ B），M = 0——线圈处于稳定平衡状态；（2）θ = 90° 时（m ⊥ B），M = M<sub>max</sub> = NBIS；（3）θ = 180° 时（m ∥ −B），M = 0——线圈处于非稳定平衡状态。</p>
<div class="callout key">
  <p class="callout-h">结论与磁矩</p>
  <p>均匀磁场中，任意形状刚性闭合平面通电线圈所受的力 F = 0、力矩 M = m × B，其中<strong>磁矩</strong> m = NIS·e<sub>n</sub>（e<sub>n</sub> 与 I 成右螺旋）。m ∥ B：稳定平衡；m ∥ −B：非稳定平衡；m ⊥ B：M = M<sub>max</sub> = mB。</p>
</div>
<div class="callout tip">
  <p class="callout-h">例：正方形线圈的磁力矩</p>
  <p>边长为 0.2 m 的正方形线圈，共有 50 匝，通以电流 2 A，把线圈放在磁感应强度为 0.05 T 的均匀磁场中。问在什么方位时，线圈所受的磁力矩最大？磁力矩等于多少？</p>
  <p>解：M = NBIS·sinθ，θ = 90°（线圈平面与磁场平行）时磁力矩最大：M<sub>max</sub> = NBIS = 50×0.05×2×(0.2)² = 0.2 N·m。</p>
</div>
<h3>磁力的功</h3>
<h3>一、载流导线在磁场中运动时磁力所作的功</h3>
<p>匀强磁场方向垂直于纸面向外，磁场中有一载流的闭合电路 ABCD，电路中的导线 AB 长度为 l，可以沿着 DA 和 CB 滑动：F = BIl。在力 F 作用下，AB 将从初始位置沿着力的方向移动，当移动到位置 A′B′ 时磁力所作的功 A = F·AA′ = BIl·AA′。导线在初始位置 AB 时和在终了位置 A′B′ 时，通过回路的磁通量分别为 Φ₀ = B·l·DA、Φ₁ = B·l·DA′，磁力所作的功为：</p>
<div class="formula"><p>A = I·ΔΦ　（ΔΦ = Φ₁ − Φ₀）</p></div>
<p>表明：当载流导线在磁场中运动时，如果电流保持不变，磁力所作的功等于电流乘以通过回路所环绕的面积内磁通量的增量，也即磁力所作的功等于电流乘以载流导线在移动中所切割的磁感应线数。</p>
<div class="callout warn">
  <p class="callout-h">注意</p>
  <p>恒定磁场不是保守力场，磁力的功不等于磁场能的减少；而且洛伦兹力是不做功的，磁力所作的功是消耗电源的能量来完成的。</p>
</div>
<h3>二、载流线圈在磁场内转动时磁力所作的功</h3>
<p>设线圈转过极小的角度 dθ，使 e<sub>n</sub> 与 B 之间的夹角从 θ 增为 θ + dθ，磁力矩 M = BIS·sinθ，磁力矩所作的功 dA = −M·dθ = −BIS·sinθ·dθ = I·d(BS·cosθ) = I·dΦ（负号表示磁力矩作正功时将使 θ 减小）。当载流线圈从 θ₁ 转到 θ₂ 时，磁力矩所作的总功：</p>
<div class="formula"><p>A = ∫I·dΦ = I(Φ₂ − Φ₁) = I·ΔΦ</p></div>
<p>Φ₁ 与 Φ₂ 分别表示线圈在 θ₁ 和 θ₂ 时通过线圈的磁通量（dΦ = d(BS·cosθ)），ΔΦ 表示线圈转过 dθ 后磁通量的增量。</p>
<div class="callout tip">
  <p class="callout-h">例8-10：转动线圈</p>
  <p>如图在均匀磁场中的长方形线圈（边长 l₁、l₂，电流 I）可绕 y 轴转动。（1）线圈平面与 B 成角时（法线与 B 成 30°）：PQ 和 RO 段受到的力 F<sub>OP</sub> = F<sub>QR</sub> = −BIl₂·sin90°；QR 和 OP 段受到的力 F<sub>RO</sub> = F<sub>PQ</sub> = −BIl₁·sin30°；线圈所受磁力矩由 M = F·力臂 或磁力矩公式 M = BIS·sinθ 计算。（2）当线圈由此位置转至平衡位置时，磁场力的功：线圈在初位置时磁通量 Φ₁ = BS·cos30° = Bl₁l₂·cos30°，线圈转至平衡位置时 Φ₂ = BS = Bl₁l₂：</p>
  <div class="formula"><p>A = I(Φ₂ − Φ₁) = IBl₁l₂·(1 − cos30°)</p></div>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-8-7',
      heading: '8-7 磁场中的磁介质',
      blocks: [
        {
          type: 'html',
          html: `
<h3>一、磁介质</h3>
<p>磁介质磁化后的总磁感强度 B = B₀ + B′（B₀ 真空中的磁感强度，B′ 介质磁化后的附加磁感强度）：</p>
<table class="tbl">
  <thead><tr><th>类别</th><th>关系</th><th>代表物质</th></tr></thead>
  <tbody>
    <tr><td>顺磁质</td><td>B′ 与 B₀ 同向，B &gt; B₀</td><td>铝、氧、锰等</td></tr>
    <tr><td>抗磁质</td><td>B′ 与 B₀ 反向，B &lt; B₀</td><td>铜、铋、氢等</td></tr>
    <tr><td>铁磁质</td><td>B ≫ B₀</td><td>铁、钴、镍等</td></tr>
  </tbody>
</table>
<p>顺磁质和抗磁质统称弱磁质。<strong>抗磁质的磁化</strong>：无外磁场时抗磁质分子磁矩为零（m = 0）；有外磁场 B₀ 时，分子产生感应磁矩 Δm（与 B₀ 反向），抗磁质内磁场 B = B₀ − B′。<strong>顺磁质的磁化</strong>：分子圆电流和磁矩 m（无外磁场时取向混乱），有外磁场 B₀ 时分子磁矩沿 B₀ 取向（sI），B = B₀ + B′。</p>
<h3>§8-8 有磁介质时的安培环路定理和高斯定理——磁场强度</h3>
<h3>一、磁化强度</h3>
<p>反映磁介质磁化程度（大小与方向）的物理量：</p>
<div class="formula"><p>M = Σm<sub>分子</sub>/ΔV　（单位 A/m）</p></div>
<p>对顺磁质 Σm<sub>分子</sub> 沿 B 方向，M ∥ B₀；对抗磁质 M ∥ −B₀；对于真空 M = 0。</p>
<h3>二、有磁介质时的安培环路定理</h3>
<p>无磁介质时 ∮B·dl = μ₀ΣI<sub>i</sub>（传导电流）；有磁介质时 ∮B·dl = μ₀(ΣI<sub>i</sub> + I<sub>s</sub>)（I<sub>s</sub> 为磁化电流）。由磁化电流与磁化强度的关系 I<sub>s</sub> = ∮M·dl，得</p>
<div class="formula"><p>∮(B/μ₀ − M)·dl = ΣI<sub>i</sub>　（或 B = μ₀(M + H)）</p></div>
<div class="callout key">
  <p class="callout-h">磁场强度与有磁介质时的安培环路定理</p>
  <p>定义磁场强度：H = B/μ₀ − M，则</p>
  <div class="formula"><p>∮<sub>L</sub>H·dl = ΣI<sub>i</sub>（传导电流）</p></div>
  <p>磁场强度矢量的环流只和传导电流 I 有关，而在形式上与磁介质的磁性无关。</p>
</div>
<p>讨论：实验证明，对于各向同性的介质，M = χ<sub>m</sub>·H（χ<sub>m</sub> 称为磁介质的磁化率，纯数）。B = μ₀(H + M) = μ₀(1 + χ<sub>m</sub>)H：</p>
<div class="formula"><p>B = μ₀μ<sub>r</sub>H = μH　（μ<sub>r</sub> = 1 + χ<sub>m</sub> 相对磁导率；μ = μ₀μ<sub>r</sub> 磁导率）</p></div>
<p>抗磁质：χ<sub>m</sub> &lt; 0，μ<sub>r</sub> &lt; 1；顺磁质：χ<sub>m</sub> &gt; 0，μ<sub>r</sub> &gt; 1。利用有磁介质时的安培环路定理可计算具有高度对称性分布的磁场。</p>
`,
        },
      ],
    },
  ],
};

export default deck8;
