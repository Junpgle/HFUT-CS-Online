import type { DeckData } from './types';

/** 第7章 静止电荷的电场 —— 期末课件 PDF 1～5（§7-1 电荷库仑定律 ～ §7-10 静电场的能量） */
const deck7: DeckData = {
  id: 'deck7',
  no: '第7章',
  title: '静止电荷的电场',
  subtitle: '电荷与库仑定律 · 电场强度 · 高斯定理 · 环路定理与电势 · 导体 · 电容 · 电介质 · 静电场能量',
  lede:
    '教材：《普通物理学》第八版，程守洙、江之永主编。本章从电荷与库仑定律出发，引入电场强度与电势两个基本概念，理解高斯定理及静电场的环路定理（静电场是有源场和保守场），掌握用叠加原理及高斯定理求解电场强度、用电势叠加与场强积分求解电势的方法，并讨论导体、电容、电介质与静电场能量。',
  toc: [
    { id: 'sec-7-1', text: '7-1 电荷 库仑定律', level: 2 },
    { id: 'sec-7-2', text: '7-2 静电场 电场强度', level: 2 },
    { id: 'sec-7-3', text: '7-3 静电场的高斯定理', level: 2 },
    { id: 'sec-7-4', text: '7-4 静电场的环路定理 电势', level: 2 },
    { id: 'sec-7-5', text: '7-5 电场强度与电势梯度的关系', level: 2 },
    { id: 'sec-7-6', text: '7-6 静电场中的导体', level: 2 },
    { id: 'sec-7-7', text: '7-7 电容器的电容', level: 2 },
    { id: 'sec-7-8', text: '7-8 介质中的静电场 电位移', level: 2 },
    { id: 'sec-7-9', text: '7-10 静电场的能量', level: 2 },
  ],
  sections: [
    {
      id: 'sec-7-1',
      heading: '7-1 电荷 库仑定律',
      blocks: [
        {
          type: 'html',
          html: `
<h3>一、电荷</h3>
<p>摩擦起电和雷电是对电的最早认识。电荷是实物的一种属性。自然界存在两种电荷：正电荷和负电荷，同性相斥、异性相吸。电荷的三个基本性质：</p>
<ol>
<li><strong>电荷守恒</strong>（微观世界的一个基本定律）：在孤立系统中（指与外界没有交换电荷），正负电荷的代数和保持不变——强调是正负电荷的代数和不变。如 <sup>238</sup>U → <sup>234</sup>Th（钍）+ <sup>4</sup>He。电荷的相对论不变性。</li>
<li><strong>电荷的量子化</strong>：最小电量 e = 1.602×10⁻¹⁹ C，宏观带电体带电量 q = ne（n = ±1, ±2, ±3…），q ≫ e 时准连续。密立根（Robert Andrews Millikan，1868—1953）实验；强子的夸克模型具有分数电荷（⅓ 或 ⅔ 电子电荷），但实验上尚未找到自由状态的夸克。</li>
<li><strong>点电荷模型</strong>：当带电体的大小和形状与它们之间的距离相比可以忽略时，不考虑大小和分布状况而可看作集中于一点的电荷。</li>
</ol>
<h3>三、库仑定律</h3>
<p>库仑（Charles-Augustin de Coulomb，1736～1806，法国工程师、物理学家，1785 年）：在真空中，两个静止点电荷之间相互作用力与这两个点电荷的电荷量 q₁ 和 q₂ 的乘积成正比，而与这两个点电荷之间的距离 r₁₂（或 r₂₁）的平方成反比，作用力的方向沿着这两个点电荷的连线，同号相斥，异号相吸：</p>
<div class="formula"><p>F₁₂ = (q₁q₂)/(4πε₀r₁₂²)·e<sub>r12</sub> = (q₁q₂)/(4πε₀r₁₂³)·r₁₂</p></div>
<div class="formula"><p>F₁₂ = −F₂₁，　k = 1/(4πε₀) ≈ 9×10⁹ N·m²/C²，　ε₀ = 8.8542×10⁻¹² C²·N⁻¹·m⁻²（真空电容率）</p></div>
<p>讨论：（1）适用范围：r 在 10⁻¹⁵～10⁷ m；距离平方反比关系，指数 2 的误差 &lt; 10⁻¹⁶；（2）满足「平方反比律」，称为「库仑力」或「静电力」；适用于点电荷、矢量性与叠加性；（3）单位制有理化 k = 1/(4πε₀)。</p>
<div class="callout tip">
  <p class="callout-h">例：氢原子中静电力与万有引力</p>
  <p>试计算基态氢原子内电子和质子之间的静电力和万有引力，并比较两者的大小（r = 0.529×10⁻¹⁰ m）。</p>
  <p>解：F<sub>e</sub> = e²/(4πε₀r²) = 8.22×10⁻⁸ N；F<sub>g</sub> = Gm<sub>e</sub>m<sub>p</sub>/r² = 3.63×10⁻⁴⁷ N；F<sub>e</sub>/F<sub>g</sub> = 2.26×10³⁹。微观领域中，万有引力比库仑力小得多，可忽略不计。</p>
</div>
<h3>五、静电力的叠加原理</h3>
<p>当空间有两个以上点电荷时，作用在某一点电荷的总静电力等于其他各点电荷单独存在时对该点电荷所施静电力的矢量和：</p>
<div class="formula"><p>F = Σ<sub>i=1</sub><sup>n</sup>F<sub>i</sub> = (1/4πε₀)·Σ<sub>i=1</sub><sup>n</sup>(qq<sub>i</sub>/r<sub>i</sub>²)·e<sub>ri</sub></p></div>
<p>两带电体之间的静电力：先把带电体看作是由许多电荷元组成，先应用库仑定律再应用叠加原理。</p>
`,
        },
      ],
    },
    {
      id: 'sec-7-2',
      heading: '7-2 静电场 电场强度',
      blocks: [
        {
          type: 'html',
          html: `
<h3>一、电场</h3>
<p>直观上看，电场是给电荷以作用力的物理场：若空间某一区域内各点具有给予在该点的静止电荷的作用力的属性，就说该区域存在着电场。从本质上说：电场是物质的一种存在形式，具有能量、动量。场是一种特殊形态的物质（物质 = 实物 + 场）。本章只讨论相对于观察者静止的电荷在其周围空间产生的电场即<strong>静电场</strong>。</p>
<h3>二、电场强度</h3>
<p><strong>试验电荷 q₀</strong>：（1）正电荷；（2）电荷量足够小；（3）线度小。实验：（1）在电场的不同点上放同样的试验电荷 q₀——电场中各处的力学性质不同；（2）在电场的同一点上放不同的试验电荷——F/q₀ 与 q₀ 无关。</p>
<div class="formula"><p>E ≡ F/q₀（电场强度，矢量场；SI 单位 N/C 或 V/m）</p></div>
<p>场强的大小：|F/q₀|；场强的方向：正电荷在该处所受电场力的方向。</p>
<p><strong>场强叠加原理</strong>：F = F₁ + F₂ + … + F<sub>n</sub>，故 E = F/q₀ = E₁ + E₂ + … + E<sub>n</sub> = ΣE<sub>i</sub>——电场强度的叠加原理。</p>
<h3>三、电场强度的计算</h3>
<ol>
<li><strong>点电荷的电场强度</strong>：由 F = qq₀/(4πε₀r²)·e<sub>r</sub> 得</li>
</ol>
<div class="formula"><p>E = q/(4πε₀r²)·e<sub>r</sub></p></div>
<ol start="2">
<li><strong>点电荷系的电场强度</strong>（根据场强叠加原理）：E = Σ<sub>i=1</sub><sup>n</sup>(q<sub>i</sub>/4πε₀r<sub>i</sub>²)·e<sub>ri</sub>。<strong>电偶极子</strong>：大小相等、符号相反并有一微小间距的两个点电荷构成的复合体，电偶极矩 p = ql（l 由 −q 指向 +q）。</li>
<li><strong>连续分布电荷的电场强度</strong>：电荷元 dq 在 P 点的电场强度 dE = dq/(4πε₀r²)·e<sub>r</sub>，带电体在 P 点的电场强度 E = ∫dE = ∫(dq/4πε₀r²)·e<sub>r</sub>。电荷体密度 ρ = dq/dV、面密度 σ = dq/dS、线密度 λ = dq/dl。</li>
</ol>
<div class="callout tip">
  <p class="callout-h">例7-2：电偶极子的电场</p>
  <p>计算在电偶极子延长线和中垂线上任一点的电场强度。</p>
  <p>解：<strong>延长线上</strong>（距偶极子中心 x）：E₊ = q/(4πε₀(x − l/2)²)，E₋ = q/(4πε₀(x + l/2)²)，E<sub>A</sub> = E₊ + E₋ ≈ 2p/(4πε₀x³)（∵ x ≫ l）；<strong>中垂线上</strong>（距中心 y）：E<sub>B</sub> = 2E₊cosθ = p/(4πε₀y³)，方向与 p 反向。</p>
</div>
<div class="callout tip">
  <p class="callout-h">例7-4：均匀带电圆环轴线上的电场</p>
  <p>电荷 q 均匀地分布在一半径为 R 的圆环上，计算在圆环的轴线上任一给定点 P 的电场强度。</p>
  <p>解：dq = (q/2πR)dl，r² = x² + R²；dE = dq/(4πε₀r²)。根据圆环的对称性，垂直 x 轴的分量抵消（E<sub>⊥x</sub> = 0），E = E<sub>//x</sub> = ∫dE·cosθ = ∫(x/r)·dE：</p>
  <div class="formula"><p>E = qx/(4πε₀(x² + R²)<sup>3/2</sup>)，方向沿 X 轴</p></div>
  <p>讨论：1. 若 x = 0，则 E = 0，环心处的电场强度为零；2. 若 x ≫ R，则 E ≈ q/(4πε₀x²)——远离圆环处的场强近似等于点电荷的电场强度。</p>
</div>
<div class="callout tip">
  <p class="callout-h">例7-5：均匀带电圆盘轴线上的电场</p>
  <p>求均匀带电圆盘轴线上任一点的电场。设盘半径为 R，电荷面密度为 σ。均匀带电的薄圆盘可看成由许多带电细圆环组成：dq = σ·dS = σ·2πρ·dρ。</p>
  <div class="formula"><p>E = ∫dE = ∫₀<sup>R</sup> σxρdρ/(2ε₀(x² + ρ²)<sup>3/2</sup>) = σ/(2ε₀)·(1 − x/√(x² + R²))</p></div>
  <p>讨论：1. 当 R ≫ x 时，E ≈ σ/(2ε₀)——无限大均匀带电平面的电场强度，匀强电场；2. 当 R ≪ x 时，展开 √(1 + R²/x²) ≈ 1 + R²/2x²，得 E ≈ σR²/(4ε₀x²) = q/(4πε₀x²)——可视为点电荷的电场。</p>
</div>
<h3>五、电场对电荷的作用力</h3>
<p>如果已知电场强度分布 E，就可以求得任一点电荷 q 在电场中的受力 F = qE——q 为正，方向与 E 相同；q 为负，方向相反。</p>
<div class="callout tip">
  <p class="callout-h">例7-6：电偶极子在均匀外电场中</p>
  <p>求电偶极子在均匀外电场中受到的作用，并分析电偶极子在非均匀外电场中的运动。</p>
  <p>解：均匀外电场中，电偶极子所受合力为零（F = qE + (−q)E = 0），但力矩不为零：M = Fl·sinθ = qE·l·sinθ = pE·sinθ，即 M = p × E——电偶极子在均匀外电场中转动。在非均匀外电场中，电偶极子所受合力不为零（F = qE₊ + (−q)E₋）、力矩也不为零——电偶极子在非均匀外电场中既转动又平动。</p>
</div>
<h3>六、电场线</h3>
<p><strong>电场线</strong>：形象描述电场在空间分布的一系列有向曲线。（1）曲线上每一点的切线方向表示该点电场强度的方向；（2）曲线的疏密表示该点处场强的大小——通过垂直单位面积的电场线条数在数值上等于该点处电场强度的大小，即 E = dN/dS<sub>⊥</sub>。</p>
<p>典型电场线：正点电荷（辐射）、负点电荷（汇聚）、一对等量异号点电荷、一对等量正点电荷、电偶极子、一对不等量异号点电荷（−q 与 2q）、带电平行板电容器（均匀）。</p>
<div class="callout key">
  <p class="callout-h">静电场中电场线的特点</p>
  <ol>
    <li>电场线起始于正电荷，终止于负电荷，在没有电荷处不中断；</li>
    <li>电场线不闭合，不相交；</li>
    <li>电场线密集处电场强，电场线稀疏处电场弱。</li>
  </ol>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-7-3',
      heading: '7-3 静电场的高斯定理',
      blocks: [
        {
          type: 'html',
          html: `
<h3>一、电场强度通量</h3>
<p>通过电场中任一曲面的电场线条数。</p>
<ol>
<li>均匀电场中通过平面 S 的电场强度通量：Ψ<sub>E</sub> = E·S·cosθ = E·S（S 为矢量面元）。</li>
<li>非均匀电场的电场强度通量：dΨ<sub>E</sub> = E·cosθ·dS = E·dS，Ψ<sub>E</sub> = ∫∫<sub>S</sub>E·dS。Ψ<sub>E</sub> 的正、负取决于面元的法线方向与电场强度方向夹角的大小。</li>
</ol>
<p>对闭合曲面：规定从内指向外的法线方向为正——θ &lt; 90° 时电场线穿出闭合曲面，对电通量的贡献为正；θ &gt; 90° 时电场线穿入，贡献为负；θ = 90° 时电场线与曲面相切，贡献为零。</p>
<div class="callout tip">
  <p class="callout-h">例：三棱柱体的电通量</p>
  <p>有一个三棱柱体放置在电场强度 E = 200i（N/C）的匀强电场中。求通过此三棱柱体的电场强度通量。</p>
  <p>解：Ψ<sub>e左</sub> = E·S<sub>左</sub>·cosπ = −E·S<sub>左</sub>，Ψ<sub>e右</sub> = E·S<sub>右</sub>·cosθ = E·S<sub>左</sub>；前、后、下面通量为零。Ψ<sub>e</sub> = Ψ<sub>e前</sub> + Ψ<sub>e后</sub> + Ψ<sub>e左</sub> + Ψ<sub>e右</sub> + Ψ<sub>e下</sub> = 0。</p>
</div>
<h3>二、静电场的高斯定理</h3>
<p>• 点电荷在球面的圆心处：球面场强 E = q/(4πε₀R²)，Ψ<sub>E</sub> = ∮<sub>S</sub>(q/4πε₀R²)·dS = q/ε₀。• 点电荷（系）在任意形状的闭合面内：通过球面 S 的电场线也必通过任意曲面 S′，它们的电场强度通量相等。• 电荷 q 在闭合曲面以外：穿进曲面的电场线条数等于穿出曲面的电场线条数，Ψ<sub>E</sub> = 0。</p>
<div class="callout key">
  <p class="callout-h">高斯定理</p>
  <p>静电场中，通过任一闭合曲面的电场强度通量等于该曲面所包围的所有电荷量的代数和的 1/ε₀ 倍：</p>
  <div class="formula"><p>∮<sub>S</sub>E·dS = (1/ε₀)·Σ<sub>i=1</sub><sup>n</sup>q<sub>i内</sub>　＝　(1/ε₀)·∫∫∫<sub>V</sub>ρ·dV</p></div>
</div>
<p>说明：</p>
<ul>
<li>高斯面上的电场强度为所有内外电荷的总电场强度；</li>
<li>高斯定理表示穿过闭合曲面的总电通量，仅由闭合曲面内的电荷所决定；</li>
<li>静电场及电磁学的基本定律，表明<strong>静电场是有源场</strong>，电荷是电力线的源；</li>
<li>高斯定理对静电场是普遍适用的，但仅对电荷分布具有空间对称性的电荷系统才有可能用此定理计算场强。</li>
</ul>
<div class="callout key">
  <p class="callout-h">讨论（课件）</p>
  <p>在点电荷 +q 和 −q 的静电场中做三个闭合面 S₁（只含 +q）、S₂（两者都不含）、S₃（只含 −q）：Ψ<sub>e1</sub> = q/ε₀，Ψ<sub>e2</sub> = 0，Ψ<sub>e3</sub> = −q/ε₀。将 2q 从 A 点移到 B 点：电场强度变化；穿过高斯面 S 的 Ψ<sub>e</sub> 不变化（只要 2q 仍在面外）。</p>
</div>
<h3>四、高斯定理的应用</h3>
<p>步骤：（1）对称性分析；（2）根据对称性选择合适的高斯面；（3）应用高斯定理计算。（用高斯定理求解的静电场必须具有一定的对称性：球对称、轴对称、面对称。）</p>
<div class="callout tip">
  <p class="callout-h">例：均匀带电球壳的电场强度</p>
  <p>半径为 R、均匀带电 Q 的薄球壳，求球壳内外任意点的电场强度。</p>
  <p>解：电场分布具有球对称性，方向沿径向，作同心且半径为 r 的高斯面。（1）r &lt; R：面内无电荷，∮E·dS = 0，E = 0；（2）r &gt; R：∮E·dS = E·4πr² = Q/ε₀，得 E = Q/(4πε₀r²)。即壳内场强为零、壳外如同点电荷。</p>
</div>
<div class="callout tip">
  <p class="callout-h">例：均匀带电球体的电场</p>
  <p>球半径为 R，总电量为 Q（体密度 ρ = 3Q/(4πR³)）。球内（r &lt; R）：高斯面内电荷 q = ρ·(4/3)πr³，E·4πr² = ρ·(4/3)πr³/ε₀，得</p>
  <div class="formula"><p>E = Qr/(4πε₀R³)（r &lt; R）；　E = Q/(4πε₀r²)（r &gt; R）</p></div>
</div>
<div class="callout tip">
  <p class="callout-h">例：无限长均匀带电直线</p>
  <p>电荷线密度为 λ，求距直线为 r 处的电场强度。对称性分析：轴对称；选取闭合的柱形高斯面（柱面 + 上下底）：上下底通量为零，∮E·dS = E·2πr·h = λh/ε₀，得</p>
  <div class="formula"><p>E = λ/(2πε₀r)</p></div>
  <p>讨论：无限长均匀带电柱面（视为无限长带电直线的集合，选同轴圆柱形高斯面）：</p>
  <div class="formula"><p>E = 0（r &lt; R）；　E = λ/(2πε₀r)（r &gt; R）</p></div>
</div>
<div class="callout tip">
  <p class="callout-h">例7-9：均匀带电的「无限长」圆柱体</p>
  <p>过场点 P 作一个与带电圆柱体共轴的圆柱形闭合高斯面 S，柱高 h、底面半径 r。如果 P 点在带电圆柱体外：E = λ/(2πε₀r)；如果 P 点在带电圆柱体内（r &lt; R）：高斯面内电荷为 λh·r²/R²，E = λr/(2πε₀R²)。</p>
</div>
<div class="callout tip">
  <p class="callout-h">例：无限大均匀带电平面</p>
  <p>电荷面密度为 σ，求距平面为 r 处的电场强度。对称性分析：垂直平面；选取闭合的柱形高斯面（两底面积 S′）：2E·S′ = σS′/ε₀，得</p>
  <div class="formula"><p>E = σ/(2ε₀)　（与距离无关，匀强电场）</p></div>
  <p>讨论：无限大带电平面的电场叠加问题——两块带电平面（+σ 与 −σ）之间 E = σ/ε₀，外侧 E = 0。</p>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-7-4',
      heading: '7-4 静电场的环路定理 电势',
      blocks: [
        {
          type: 'html',
          html: `
<p>静电场对移动带电体要做功，说明静电场具有能量。</p>
<h3>一、静电场力所做的功</h3>
<p>试验电荷 q₀ 在点电荷 q 的电场中从 A 移到 B，电场力做的元功 dA = q₀E·dl，其中 e<sub>r</sub>·dl = dl·cosθ = dr：</p>
<div class="formula"><p>A<sub>AB</sub> = ∫<sub>A</sub><sup>B</sup>(qq₀/4πε₀r²)·dr = qq₀/(4πε₀)·(1/r<sub>A</sub> − 1/r<sub>B</sub>)</p></div>
<p>结果仅与 q₀ 的始末位置有关，与路径无关。任意电荷的电场（视为点电荷的组合）由场强叠加原理，结论同样成立：<strong>静电场力做功仅与试验电荷的电量及路径的起点和终点位置有关，而与路径无关——静电场力是保守力，静电场是保守场</strong>。</p>
<h3>二、静电场的环路定理</h3>
<p>把试验电荷沿闭合路径移动一周（A→B→A），由于做功与路径无关：</p>
<div class="callout key">
  <p><strong>静电场的环路定理</strong>：在静电场中，场强沿任意闭合路径的线积分（称为场强的环流）恒为零：</p>
  <div class="formula"><p>∮<sub>l</sub>E·dl = 0</p></div>
</div>
<h3>三、电势能</h3>
<p>静电场是保守场，静电场力所做的功就等于电荷电势能增量的负值：</p>
<div class="formula"><p>A<sub>AB</sub> = ∫<sub>A</sub><sup>B</sup>q₀E·dl = W<sub>A</sub> − W<sub>B</sub></p></div>
<p>电势能的大小是相对的，电势能的差是绝对的。令 W<sub>B</sub> = 0，则 W<sub>A</sub> = q₀∫<sub>A</sub><sup>B</sup>E·dl——试验电荷 q₀ 在电场中某点的电势能，在数值上就等于把它从该点移到零势能处静电场力所作的功。</p>
<h3>四、电势</h3>
<p>电势能 W<sub>A</sub> 与 q₀ 成正比（积分大小与 q₀ 无关），定义电势：</p>
<div class="formula"><p>V<sub>A</sub> = W<sub>A</sub>/q₀ = ∫<sub>A</sub><sup>电势零点</sup>E·dl　（令 V<sub>B</sub> = 0）</p></div>
<p>电势零点选择方法：有限带电体以无穷远为电势零点，实际问题中常选择地球电势为零。电势 A 点的物理意义：把单位正试验电荷从点 A 移到无穷远时，静电场力所作的功。<strong>电势差</strong>：</p>
<div class="formula"><p>U<sub>AB</sub> = V<sub>A</sub> − V<sub>B</sub> = ∫<sub>A</sub><sup>B</sup>E·dl　（将单位正电荷从 A 移到 B 电场力作的功）</p></div>
<div class="callout warn">
  <p class="callout-h">注意</p>
  <p>电势差是绝对的，与电势零点的选择无关；电势大小是相对的，与电势零点的选择有关。静电场力的功 A<sub>AB</sub> = q₀U<sub>AB</sub>。单位：伏特（V）。注：原子物理中能量单位 1 eV = 1.602×10⁻¹⁹ J。</p>
</div>
<h3>点电荷的电势与电势叠加原理</h3>
<div class="formula"><p>V = ∫<sub>r</sub><sup>∞</sup>(q/4πε₀r²)·dr = q/(4πε₀r)　（令 V<sub>∞</sub> = 0；q&gt;0 时 V&gt;0，q&lt;0 时 V&lt;0）</p></div>
<p><strong>电势的叠加原理</strong>（点电荷系）：V<sub>A</sub> = Σ<sub>i</sub>V<sub>Ai</sub> = (1/4πε₀)·Σ<sub>i</sub>(q<sub>i</sub>/r<sub>i</sub>)。</p>
<div class="callout tip">
  <p class="callout-h">例7-11：电偶极子的电势</p>
  <p>试计算电偶极子电场中任一点 P（r ≫ l）的电势。</p>
  <p>解：设电偶极子如图放置，电场中任一点 P 的电势为两个点电荷电势的叠加：V<sub>P</sub> = q/(4πε₀r₊) − q/(4πε₀r₋)，其中 r± = r ∓ (l/2)·cosθ。由于 r ≫ l：</p>
  <div class="formula"><p>V<sub>P</sub> = ql·cosθ/(4πε₀r²) = p·cosθ/(4πε₀r²)</p></div>
</div>
<h3>电荷连续分布的电势</h3>
<p>电荷元 dq 在 P 点产生的电势 dV<sub>P</sub> = dq/(4πε₀r)。对于线电荷分布：V<sub>P</sub> = (1/4πε₀)∫<sub>L</sub>(λdl/r)；对于面电荷分布：V<sub>P</sub> = (1/4πε₀)∫∫<sub>S</sub>(σdS/r)；对于体电荷分布：V<sub>P</sub> = (1/4πε₀)∫∫∫<sub>p</sub>(ρdV/r)。</p>
<div class="callout key">
  <p class="callout-h">求电势的方法（小结）</p>
  <ol>
    <li><strong>电势叠加法</strong>：利用 dV<sub>P</sub> = dq/(4πε₀r)——前提条件为有限大带电体且选无限远处为电势零点；</li>
    <li><strong>场强积分法</strong>：若已知在积分路径上 E 的函数表达式，则 V<sub>A</sub> = ∫<sub>A</sub><sup>零点</sup>E·dl。</li>
  </ol>
</div>
<div class="callout tip">
  <p class="callout-h">例：均匀带电圆环轴线上的电势</p>
  <p>正电荷 q 均匀分布在半径为 R 的细圆环上，求圆环轴线上距环心为 x 处点 P 的电势。</p>
  <p>解法一（电势叠加法）：dq = (q/2πR)dl，r = √(x² + R²)（对环上各点相同），V<sub>P</sub> = (1/4πε₀)·q/√(x² + R²)。</p>
  <p>讨论：x = 0 时，V = q/(4πε₀R)（环心处电势不为零！）；x ≫ R 时，V ≈ q/(4πε₀x)。</p>
  <p>解法二（场强积分法）：由 E = qx/(4πε₀(x² + R²)<sup>3/2</sup>)，V<sub>P</sub> = ∫<sub>x</sub><sup>∞</sup>E·dx = q/(4πε₀√(x² + R²))。</p>
</div>
<div class="callout tip">
  <p class="callout-h">例：均匀带电球壳的电势</p>
  <p>真空中，有一带电为 Q、半径为 R 的带电球壳。试求径向（1）球壳外两点间的电势差；（2）球壳内两点间的电势差；（3）球壳外任意点的电势；（4）球壳内任意点的电势。</p>
  <p>解：已知 E₁ = 0（r &lt; R），E₂ = Q/(4πε₀r²)（r ≥ R）。（1）U<sub>AB</sub> = ∫<sub>A</sub><sup>B</sup>E₂·dr = Q/(4πε₀)·(1/r<sub>A</sub> − 1/r<sub>B</sub>)（r<sub>A</sub>、r<sub>B</sub> &gt; R）；（2）U<sub>AB</sub> = ∫E₁·dr = 0（r<sub>A</sub>、r<sub>B</sub> &lt; R）；（3）令 V<sub>∞</sub> = 0，r &gt; R：V<sub>外</sub>(r) = Q/(4πε₀r)；（4）r &lt; R：V<sub>内</sub>(r) = V<sub>外</sub>(R) = Q/(4πε₀R)——球壳内部电势为常量，等于表面处的值（E~r、V~r 曲线：E 在 R 处跳变，V 连续）。</p>
</div>
<div class="callout tip">
  <p class="callout-h">例：「无限长」带电直导线的电势</p>
  <p>由 E = λ/(2πε₀r)，能否选 V<sub>∞</sub> = 0？——不能（积分发散）。取 r₀ 处为电势零点：V<sub>P</sub> = ∫<sub>r</sub><sup>r₀</sup>(λ/2πε₀r)·dr = (λ/2πε₀)·ln(r₀/r)。如果势能零点在 r₀ = 1 m，则 V<sub>P</sub> = −(λ/2πε₀)·ln(r/m)。</p>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-7-5',
      heading: '7-5 电场强度与电势梯度的关系',
      blocks: [
        {
          type: 'html',
          html: `
<h3>一、等势面（电势图示法）</h3>
<p>空间电势相等的点连接起来所形成的面称为<strong>等势面</strong>。为了描述空间电势的分布，规定任意两相邻等势面间的电势差相等。结论：在静电场中，电场线与等势面垂直（电场线是和等势面正交的曲线簇）。证明：在等势面上移动电荷 q₀，dA = q₀E·dl·cosθ = 0 而 E、q₀ 不为零，故 cosθ = 0，E ⊥ dl。</p>
<p>按规定电场中任意两相邻等势面之间的电势差相等，即等势面的疏密程度同样可以表示场强的大小：由 dU = E·dl，dU 相同时 dl₁ &lt; dl₂ 则 E₁ &gt; E₂——<strong>等势面密处电场强度大，等势面疏处电场强度小</strong>。典型等势面：点电荷（同心球面）、电偶极子、两平行带电平板（等间距平行面）。</p>
<h3>二、电场强度与电势梯度的关系</h3>
<p>在电场中任取两相距很近的等势面 1 和 2，电势分别为 V 和 V + dV（dV &gt; 0）。等势面 1 上 P₁ 点的单位法向矢量 e<sub>n</sub> 与等势面 2 正交于 P₂ 点；在等势面 2 任取一点 P₃，设 P₁P₂ = dn、P₁P₃ = dl，则 dn = dl·cosφ，故 dV/dl = dV/(dn·cosφ)——沿法线方向电势变化最快。</p>
<p><strong>定义电势梯度</strong>：gradV = ∇V = dV/dn·e<sub>n</sub>——方向与等势面垂直并指向电势升高的方向，其量值为该点电势增加率的最大值。</p>
<p>电荷 q 从等势面 1 移动到等势面 2，电场力做功 dA = qE·dl = qE·cosφ·dl = qE·dn；电场力做功等于电势能的减少量 dA = V₁ − V₂ = −q·dV，故 E = −dV/dn——场强与等势面垂直，但指向电势降低的方向（e<sub>n</sub> 的反方向）。写成矢量形式（电势负梯度）：</p>
<div class="formula"><p>E = −dV/dn·e<sub>n</sub> = −gradV = −∇V</p></div>
<p>在直角坐标系中：E = −(∂V/∂x·i + ∂V/∂y·j + ∂V/∂z·k)。</p>
<div class="callout key">
  <p class="callout-h">小结</p>
  <ul>
    <li>电场线与等势面处处正交；</li>
    <li>等势面密处电场强度大，等势面疏处电场强度小；</li>
    <li>空间某点电场强度的大小取决于该点附近电势的空间变化率；</li>
    <li>电场强度的方向恒指向电势降落的方向。</li>
  </ul>
  <p>求 E 的三种方法：利用电场强度叠加原理；利用高斯定理；利用电势与电场强度的关系——电势叠加为标量叠加，可先算出电势，再应用场强与电势梯度的关系算出场强。</p>
</div>
<div class="callout tip">
  <p class="callout-h">例：均匀带电细圆环轴线上的电场（电势法）</p>
  <p>由 V = q/(4πε₀√(x² + R²))，E<sub>x</sub> = −∂V/∂x：</p>
  <div class="formula"><p>E<sub>x</sub> = qx/(4πε₀(x² + R²)<sup>3/2</sup>)　（E<sub>y</sub> = E<sub>z</sub> = 0）</p></div>
</div>
<div class="callout tip">
  <p class="callout-h">例：均匀带电圆盘轴线上的电场（电势法）</p>
  <p>取细圆环 dq = σ·2πr·dr，dV = dq/(4πε₀(x² + r²)) = σ·r·dr/(2ε₀√(x² + r²))：</p>
  <div class="formula"><p>V = ∫₀<sup>R</sup>σr·dr/(2ε₀√(x² + r²)) = σ/(2ε₀)·(√(x² + R²) − x)</p></div>
  <div class="formula"><p>E<sub>x</sub> = −∂V/∂x = σ/(2ε₀)·(1 − x/√(x² + R²))　（与用叠加原理得到的结果一致）</p></div>
  <p>当 R→∞ 时，E = σ/(2ε₀)——即无穷大均匀带电平面的电场。轴线上的电势也可由场强积分法：V<sub>P</sub> = ∫<sub>x</sub><sup>∞</sup>E·dl = σ/(2ε₀)·(√(R² + x²) − x)。</p>
</div>
<div class="callout tip">
  <p class="callout-h">例7-16：开孔带电圆盘</p>
  <p>将半径 R₂ 的圆盘，盘心挖去半径 R₁ 的小孔，并均匀带电（面密度 σ）。求轴线上任一点 P 的电场强度。</p>
  <p>解：取圆环 r→r+dr，dV = dq/(4πε₀√(r² + x²)) = σ·2πr·dr/(4πε₀√(r² + x²)) = σ·r·dr/(2ε₀√(r² + x²))。V = ∫<sub>R₁</sub><sup>R₂</sup>dV = σ/(2ε₀)·(√(R₂² + x²) − √(R₁² + x²))。</p>
  <div class="formula"><p>E<sub>x</sub> = −∂V/∂x = σx/(2ε₀)·(1/√(R₁² + x²) − 1/√(R₂² + x²))　（E<sub>y</sub> = E<sub>z</sub> = 0）</p></div>
</div>
<h3>真空中静电场结构图</h3>
<p>出发点：库仑定律、叠加原理 → 从受力引入电场强度（场强叠加原理；高斯定理），从电场力做功引入电势能、电势差、电势（电势叠加法；环路定理）→ 电场强度与电势的关系（E = −∇V）。</p>
<ul>
<li><strong>电场强度的计算</strong>：场强叠加法（点电荷 E = q/(4πε₀r²)·ê<sub>r</sub>；点电荷系；电荷连续分布 λdl、σdS、ρdV 的积分）；高斯定理 ∮E·dS = Σq<sub>i</sub>/ε₀（对称性电荷分布）。</li>
<li><strong>电势的计算</strong>：电势叠加法（点电荷 q/4πε₀r；点电荷系；电荷连续分布）；场强积分法 V<sub>A</sub> = ∫E·dl；记住一些典型的电荷分布的电场分布。</li>
</ul>
`,
        },
      ],
    },
    {
      id: 'sec-7-6',
      heading: '7-6 静电场中的导体',
      blocks: [
        {
          type: 'html',
          html: `
<h3>一、导体的静电平衡</h3>
<p><strong>静电感应</strong>：导体中自由电子在电场力的作用下作宏观定向运动，使电荷产生重新分布的现象（产生感应电荷，感应电荷将影响外电场的分布）。导体内电场强度 E = E₀ + E′ = 0（外电场强度与感应电荷电场强度抵消），导体达到<strong>静电平衡</strong>。</p>
<div class="callout key">
  <p class="callout-h">静电平衡条件</p>
  <ol>
    <li>导体内任何一点处的电场强度为零；</li>
    <li>导体表面处的电场强度的方向都与导体表面垂直。</li>
  </ol>
  <p>推论：导体是等势体（导体内部电势相等：U<sub>AB</sub> = ∫E·dl = 0）；导体表面是等势面（−ΔU = E·dl = 0，故 E ⊥ dl）。</p>
</div>
<h3>二、静电平衡时导体上电荷的分布</h3>
<ol>
<li><strong>实心导体</strong>：在导体内作高斯面，∮E·dS = 0 → 面内电荷为零——<strong>导体内部处处无净电荷</strong>，电荷分布在外表面上。</li>
<li><strong>有空腔导体（空腔内无电荷）</strong>：内表面上有电荷吗？——若内表面带电（设 A 处 +、B 处 −），因 U<sub>AB</sub> = ∫E·dl = 0 与内部场强为零的图景矛盾，所以内表面不带电。结论：电荷分布在外表面上（内表面处处无净电荷）。</li>
<li><strong>空腔内有电荷 q</strong>：作高斯面 S₁（在导体内部）∮E·dS = 0 → 内表面感应出等值异号的电荷 −q；由电荷守恒外表面出现感应电荷（+q 加上原有电荷）。</li>
</ol>
<h3>3. 导体表面电场强度与电荷面密度的关系</h3>
<p>作钱币形高斯面（跨导体表面，ΔS 小）：∮E·dS = E·ΔS = σΔS/ε₀，得</p>
<div class="formula"><p>E = σ/ε₀</p></div>
<p>表面电场强度的大小与该表面电荷面密度成正比。</p>
<h3>4. 孤立导体表面电荷分布</h3>
<p>表面曲率越大，面电荷密度越大。</p>
<div class="callout tip">
  <p class="callout-h">例题：两球形导体</p>
  <p>两个半径分别为 R 和 r 的球形导体（R &gt; r），用一根很长的细导线连接起来，使这个导体组带电，电势为 V，求两球表面电荷面密度与曲率的关系。</p>
  <p>解：细线使两导体球所组成的整体作为一个孤立导体系，静电平衡时为等电势体。设两个球相距很远，每个球面上的电荷分布在另一球所激发的电场可忽略，每个球可近似看作孤立导体，电荷分布各自均匀。设大球带电荷量 Q、小球带电荷量 q，两球电势相等：Q/(4πε₀R) = q/(4πε₀r)，即 Q/R = q/r——大球所带电量 Q 比小球所带电量 q 多。然而两球的电荷密度之比</p>
  <div class="formula"><p>σ<sub>R</sub>/σ<sub>r</sub> = (Q/4πR²)/(q/4πr²) = r/R</p></div>
  <p>电荷面密度和半径成反比，即曲率半径愈小（或曲率愈大），电荷面密度愈大。</p>
</div>
<p><strong>尖端放电现象</strong>：带电导体尖端附近的电场特别大（E = σ/ε₀，σ 大），可使尖端附近的空气发生电离而产生放电现象，即尖端放电（如电风实验）。尖端放电现象的利与弊并存。注意：导体表面电荷分布与导体形状以及周围环境有关，以上结论只适用于孤立凸导体。</p>
<div class="callout key">
  <p class="callout-h">小结</p>
  <ul>
    <li>静电平衡条件：导体内部场强处处为零；表面场强垂直于导体表面；导体为一等势体、导体表面是一个等势面。</li>
    <li>导体内部无电荷，电荷分布在外表面上（内表面无电荷）；当空腔内有电荷 q 时，内表面因静电感应出现等值异号的电荷 −q，外表面有感应电荷（电荷守恒）。</li>
    <li>表面电场强度的大小与该表面电荷面密度成正比；孤立导体电荷面密度和半径成反比（曲率半径愈小电荷面密度愈大）。</li>
  </ul>
</div>
<div class="callout key">
  <p class="callout-h">思考题（课件）</p>
  <p>（1）设带电导体表面某点电荷密度为 σ，外侧附近场强 E = σ/ε₀。现将另一带电体移近，该点场强是否变化？公式 E = σ/ε₀ 是否仍成立？——答：σ 变化，外侧附近场强 E 变化，而 E = σ/ε₀ 仍然成立。</p>
  <p>（2）无限大带电平面 E = σ/(2ε₀)，带电导体表面附近 E = σ/ε₀，是否矛盾？——答：不矛盾！如果计及带电面的厚度，导体内 E = 0 要求两侧面各带 σ/2：∮E·dS = E·ΔS = σ₁ΔS/ε₀，式中 σ₁ = σ₂ = σ/2。</p>
</div>
<h3>四、有导体存在时 U、E 的分布求解思路</h3>
<p>由静电平衡条件 + 电荷守恒定律 → 求导体上的电荷分布 → 计算 U、E 分布（方法同前）。</p>
<div class="callout tip">
  <p class="callout-h">例：同心球与球壳</p>
  <p>内外半径分别为 R₂、R₃ 的金属球壳，在球壳内放一半径为 R₁ 的同心金属球，若使球壳和金属球均带有 +q 的正电荷。问：两球体上的电荷如何分布？球心的电势为多少？</p>
  <p>解：根据静电平衡条件求电荷分布：内球 +q；球壳内表面 −q、外表面 +2q。电场分布（作球形高斯面）：</p>
  <div class="formula"><p>E = 0（r &lt; R₁）；　E = q/(4πε₀r²)（R₁ &lt; r &lt; R₂）；　E = 0（R₂ &lt; r &lt; R₃）；　E = 2q/(4πε₀r²)（r &gt; R₃）</p></div>
  <p>球心的电势 V<sub>O</sub> = ∫E·dl = q/(4πε₀)·(1/R₁ − 1/R₂ + 2/R₃)。</p>
</div>
<div class="callout tip">
  <p class="callout-h">又例：相距很近的平行导体板</p>
  <p>相距很近的平行导体板 a、b，分别带电 Q<sub>a</sub>、Q<sub>b</sub>，求电荷分布（设平板面积为 S）。</p>
  <p>解：设四个表面的电荷面密度为 σ₁、σ₂、σ₃、σ₄。由电荷守恒：(σ₁ + σ₂)S = Q<sub>a</sub>，(σ₃ + σ₄)S = Q<sub>b</sub>；由静电平衡条件（两板内部场强为零）：σ₁ − σ₂ − σ₃ − σ₄ = 0 与 −σ₁ + σ₂ + σ₃ − σ₄ = 0。由（1）（2）（3）（4）解得：</p>
  <div class="formula"><p>σ₁ = σ₄ = (Q<sub>a</sub> + Q<sub>b</sub>)/2S，　σ₂ = σ₃ = (Q<sub>a</sub> − Q<sub>b</sub>)/2S</p></div>
  <p>即：相背面（1、4）相同等号（同号），相对面（2、3）相等异号。</p>
</div>
<h3>三、静电屏蔽</h3>
<ol>
<li><strong>屏蔽外电场</strong>：空腔导体可以屏蔽外电场，使空腔内物体不受外电场影响。这时整个空腔导体和腔内的电势也必处处相等。</li>
<li><strong>屏蔽腔内电场</strong>：不接地空腔——导体内的电荷通过空腔导体的静电感应对空腔外部空间产生影响，但与电荷在空腔导体内的位置无关；<strong>接地</strong>空腔导体将使外部空间不受空腔内的电场影响（接地导体电势为零）。</li>
<li><strong>屏蔽腔内外电场</strong>：接地空腔导体将使外部空间与空腔内的电场互不影响。</li>
</ol>
<p>静电场的唯一性定理：边界条件给定、导体带电量或电势已知，电场唯一确定。</p>
<div class="callout tip">
  <p class="callout-h">例：导体球 A 与导体球壳 B</p>
  <p>导体球 A（半径 R₁）带电 q₁，导体球壳 B（内半径 R₂、外半径 R₃）带电 q₂。求各区域 E 和 U 分布，并画出 E~r 和 U~r 曲线；若将球与球壳用导线连接、若将外球壳接地，情况如何？</p>
  <p>解：（1）电荷分布：A 带 q₁，B 内表面 −q₁，B 外表面 q₁ + q₂。电场：E₁ = 0（r &lt; R₁）、E₂ = q₁/(4πε₀r²)（R₁ &lt; r &lt; R₂）、E₃ = 0（R₂ &lt; r &lt; R₃）、E₄ = (q₁ + q₂)/(4πε₀r²)（r &gt; R₃）。电势：U₁ = (1/4πε₀)(q₁/R₁ − q₁/R₂ + (q₁ + q₂)/R₃)；U₂ = (1/4πε₀)(q₁/r − q₁/R₂ + (q₁ + q₂)/R₃)；U₃ = (1/4πε₀)(q₁ + q₂)/R₃；U₄ = (1/4πε₀)(q₁ + q₂)/r。</p>
  <p>（2）用导线连接：E₁ = E₂ = E₃ = 0，E₄ = (q₁ + q₂)/(4πε₀r²)；q<sub>A</sub> = 0，q<sub>B内</sub> = 0，q<sub>B外</sub> = q₁ + q₂；U₁ = U₂ = U₃ = (q₁ + q₂)/(4πε₀R₃)，U₄ = (q₁ + q₂)/(4πε₀r)。</p>
  <p>（3）外球壳接地：q<sub>B内</sub> = −q₁，q<sub>B外</sub> = 0；E₁ = 0，E₂ = q₁/(4πε₀r²)，E₃ = E₄ = 0；U₁ = (1/4πε₀)(q₁/R₁ − q₁/R₂)，U₂ = (1/4πε₀)(q₁/r − q₁/R₂)，U₃ = U₄ = 0。</p>
</div>
<div class="callout tip">
  <p class="callout-h">例7-21：接地导体球</p>
  <p>接地导体球（半径 R）附近距球心 l 处有一点电荷 q，求导体上感应电荷的电荷量。</p>
  <p>解：设感应电荷量为 Q，由于导体是个等势体，球心的电势为 0：q/(4πε₀l) + Q/(4πε₀R) = 0，即 Q = −qR/l（与 q 异号）。</p>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-7-7',
      heading: '7-7 电容器的电容',
      blocks: [
        {
          type: 'html',
          html: `
<h3>一、孤立导体的电容</h3>
<div class="formula"><p>C = Q/V　（单位 C/V，即 F；1 F = 10⁶ μF = 10¹² pF）</p></div>
<p>例：真空中孤立导体球的电容 C = Q/V = Q/(Q/4πε₀R) = 4πε₀R。取地球半径 R = 6.4×10⁶ m，地球的电容 C ≈ 7.1×10⁻⁴ F。</p>
<h3>二、电容器</h3>
<p>两导体组（A、B）组成电容器，电容器的电容：</p>
<div class="formula"><p>C = Q/(V<sub>A</sub> − V<sub>B</sub>) = Q/ΔV<sub>AB</sub>　（U<sub>AB</sub> = ∫<sub>A</sub><sup>B</sup>E·dl）</p></div>
<p>电容的大小仅与导体的形状、相对位置、其间的电介质有关，与所带电荷量无关。</p>
<h3>三、电容器电容的计算</h3>
<p>步骤：1）设两极板分别带电 ±Q；2）求 E；3）求 U；4）求 C。</p>
<ol>
<li><strong>平板电容器</strong>：两带电平板间的电场强度 E = σ/ε₀ = Q/(ε₀S)；电势差 U = Ed = Qd/(ε₀S)；电容</li>
</ol>
<div class="formula"><p>C = Q/U = ε₀S/d</p></div>
<div class="callout tip">
  <p class="callout-h">例：正方形极板</p>
  <p>平行平板电容器的极板是边长为 l 的正方形，两板之间的距离 d = 1 mm。如两极板的电势差为 100 V，要使极板上储存 10⁻⁴ C 的电荷，边长 l 应取多大才行？</p>
  <p>解：C = Q/U = 10⁻⁴/100 = 1×10⁻⁶ F = 100×10⁻⁸ F。由 C = ε₀S/d 得 S = Cd/ε₀ = 113 m²，即 l² = 113 m²，l ≈ 10.6 m。</p>
</div>
<div class="callout tip">
  <p class="callout-h">又例：1 F 电容器</p>
  <p>平行板电容器两极板间的距离 d = 1 mm，要使电容器的电容量达到 1 F，极板面积需多大？</p>
  <p>解：由 C = ε₀S/d 得 S = Cd/ε₀ = 1×10⁻³/(8.85×10⁻¹²) = 1.13×10⁸ m² = 1.70×10⁵ 亩（1 平方米 = 0.0015 亩，1 公顷 = 15 亩）。</p>
</div>
<ol start="2">
<li><strong>圆柱形电容器</strong>：由半径分别为 R<sub>A</sub>、R<sub>B</sub>（R<sub>B</sub> &gt; R<sub>A</sub>）和长 l 的两同心导体圆柱面组成。设两导体圆柱面单位长度上分别带电 ±λ（Cl = λ）：</li>
</ol>
<div class="formula"><p>E = λ/(2πε₀r)　（R<sub>A</sub> &lt; r &lt; R<sub>B</sub>）；　U = ∫E·dl = (λ/2πε₀)·ln(R<sub>B</sub>/R<sub>A</sub>)</p></div>
<div class="formula"><p>C = Q/U = 2πε₀l/ln(R<sub>B</sub>/R<sub>A</sub>)；　单位长度的电容 C<sub>l</sub> = λ/U = 2πε₀/ln(R<sub>B</sub>/R<sub>A</sub>)</p></div>
<ol start="3">
<li><strong>球形电容器</strong>：由半径分别为 R₁ 和 R₂ 的两同心金属球壳组成。设内球带正电 +Q、外球带负电 −Q：E = Q/(4πε₀r²)·e<sub>r</sub>（R₁ &lt; r &lt; R₂）；U = ∫E·dl = Q/(4πε₀)·(1/R₁ − 1/R₂)；电容</li>
</ol>
<div class="formula"><p>C = Q/U = 4πε₀·R₁R₂/(R₂ − R₁)</p></div>
<p>讨论：R₂ → ∞ 时 C = 4πε₀R₁——孤立导体球电容。</p>
<div class="callout key">
  <p class="callout-h">充满电介质时</p>
  <p>实验证明，充满电介质时电容器的电容 C 为两极板间为真空时电容 C₀ 的 ε<sub>r</sub> 倍：C = ε<sub>r</sub>C₀（ε<sub>r</sub> 称为介质的相对电容率或相对介电常量，适用于任何形状的电容器）。如果两极板间充满相对电容率为 ε<sub>r</sub> 的电介质，各种电容器的电容为：</p>
  <div class="formula"><p>平板电容器 C = ε₀ε<sub>r</sub>S/d；　球形电容器 C = 4πε₀ε<sub>r</sub>R<sub>A</sub>R<sub>B</sub>/(R<sub>B</sub> − R<sub>A</sub>)；　圆柱形电容器 C = 2πε₀ε<sub>r</sub>l/ln(R<sub>B</sub>/R<sub>A</sub>)</p></div>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-7-8',
      heading: '7-8 介质中的静电场 电位移',
      blocks: [
        {
          type: 'html',
          html: `
<h3>介质中的静电场</h3>
<p>介质在外电场中发生极化，出现<strong>极化电荷</strong> q′。空间场强为源电荷（自由电荷）q₀ 的场 E₀ 与极化电荷的场 E′ 之和：E = E₀ + E′（介质内场强减弱）。</p>
<p>实验表明：对于各向同性的电介质，在 E₀ 不太大的情况下，有</p>
<div class="formula"><p>P = χ<sub>e</sub>·ε₀·E = (ε<sub>r</sub> − 1)·ε₀·E　（χ<sub>e</sub>、ε<sub>r</sub> 称为介质的极化率、相对介电常量）</p></div>
<p><strong>电位移矢量</strong>（任何介质）：</p>
<div class="formula"><p>D = ε₀E + P；　均匀介质中 D = ε₀ε<sub>r</sub>E = εE</p></div>
<p><strong>有介质时的高斯定理</strong>：</p>
<div class="formula"><p>∮<sub>S</sub>D·dS = Σq<sub>内</sub>（自由电荷）</p></div>
`,
        },
      ],
    },
    {
      id: 'sec-7-9',
      heading: '7-10 静电场的能量',
      blocks: [
        {
          type: 'html',
          html: `
<p><strong>带电体系</strong>：把带电系统的电荷分裂到彼此相距无限远的状态中静电场力做正功，或把电荷从无限远离的状态聚合成带电系统的过程中，外力克服静电力做功。电容器的充电过程：把其他形式的能量转化为静电能即电场的能量；电容器的放电过程：把静电能即电场的能量转化为其他形式的能量。</p>
<h3>电容器储存的静电能</h3>
<p>以平行板电容器充电为例：设某时刻两极板已带有电荷 ±q，电势差为 V₁′ − V₂′ = q/C。再把电荷 +dq 从极板 2 移到极板 1，外力克服电场力做功 dA = (V₁′ − V₂′)·dq = (q/C)dq。电容器从 q = 0 充电至 q = Q 时，外力做的总功 A = ∫₀<sup>Q</sup>(q/C)dq = Q²/(2C)，它等于电容器储存的静电能：</p>
<div class="formula"><p>W = Q²/(2C) = ½C(V₁ − V₂)² = ½Q(V₁ − V₂)　（适用于任何形状的电容器）</p></div>
<h3>电场的能量密度</h3>
<p>带电体系的电能是储存在电场中的，静电能即电场的能量。平行板电容器（V = Sd，U = Ed，C = ε₀S/d）：</p>
<div class="formula"><p>W = ½C(V₁ − V₂)² = ½ε₀E²·Sd　（电容器体积 V = Sd）</p></div>
<div class="formula"><p>w<sub>e</sub> = W/V = ½ε₀E² = ½D·E　（电场的能量密度，适用于任何电场）</p></div>
<p>任一带电体系的总能量：</p>
<div class="formula"><p>W = ∫∫∫<sub>V</sub>w<sub>e</sub>·dV = ∫∫∫<sub>V</sub>½D·E·dV</p></div>
<div class="callout tip">
  <p class="callout-h">例7-30：拉开电容器极板</p>
  <p>平行板空气（ε₀）电容器，面积为 S、间距为 d，用电源充电使两极板带有电荷 Q。断开电源后再把两极板的距离拉开到 2d。求：（1）外力所做的功；（2）两极板间的相互吸引力。</p>
  <p>解：（1）两极板拉开前后的电容为 C₁ = ε₀S/d、C₂ = ε₀S/(2d)。电容器储存的电能为 W₁ = Q²/(2C₁) = Q²d/(2ε₀S)，W₂ = Q²/(2C₂) = Q²·2d/(2ε₀S)。外力所做的功为 A = W₂ − W₁ = Q²d/(2ε₀S)。</p>
  <p>（2）两极板间的相互吸引力：F = A/d = Q²/(2ε₀S)。</p>
</div>
<div class="callout tip">
  <p class="callout-h">例7-31：均匀带电球体的电场能量</p>
  <p>设球的半径为 R，所带电荷量为 q，球外为真空。球内场强 E₁ = qr/(4πε₀R³)，球外场强 E₂ = q/(4πε₀r²)（ρ = 3q/4πR³）。电场能量密度 w<sub>e</sub> = ½ε₀E²。总能量：</p>
  <div class="formula"><p>W = ∫∫∫w<sub>e</sub>dV = ∫₀<sup>R</sup>½ε₀E₁²·4πr²dr + ∫<sub>R</sub><sup>∞</sup>½ε₀E₂²·4πr²dr = q²/(40πε₀R) + q²/(8πε₀R) = 3q²/(20πε₀R)</p></div>
</div>
<div class="callout tip">
  <p class="callout-h">*例7-32：大气层电容器模型</p>
  <p>物理学家开尔文把大气层构建成一个电容器的模型：地球表面是这个电容器的一块极板，带有 5×10⁵ C 的负电荷；大气等效为在 5 km 高的另一块极板，带正电荷。求：（1）这个球形电容器的电容；（2）地球表面的能量密度及球形电容器的电能。</p>
  <p>解：（1）地球的半径 r = 6400 km，电离层的高度 h = 5 km，球形电容器的电容 C = 4πε₀·r(r + h)/h ≈ 0.9 F。（2）地球表面的场强 E = Q/(4πε₀r²)，地球表面的能量密度 w<sub>e</sub> = ½ε₀E² = Q²/(32π²ε₀r⁴) ≈ 4.5×10⁻⁸ J/m³；球形电容器的电能 W = Q²/(2C) ≈ 1.4×10¹¹ J。</p>
</div>
<div class="callout tip">
  <p class="callout-h">例：球形电容器贮存的电场能量</p>
  <p>球形电容器的内、外半径分别为 R₁ 和 R₂，所带电荷为 Q。问此电容器贮存的电场能量为多少？</p>
  <p>解：E = Q/(4πε₀r²)·e<sub>r</sub>（R₁ &lt; r &lt; R₂），w<sub>e</sub> = ½ε₀E² = Q²/(32π²ε₀r⁴)，dW<sub>e</sub> = w<sub>e</sub>·dV = Q²·dr/(8πε₀r²)（dV = 4πr²dr）：</p>
  <div class="formula"><p>W<sub>e</sub> = ∫dW<sub>e</sub> = Q²/(8πε₀)·(1/R₁ − 1/R₂) = ½Q²/C，其中 C = 4πε₀·R₂R₁/(R₂ − R₁)（球形电容器电容）</p></div>
  <p>讨论：R₂ → ∞ 时 W<sub>e</sub> = Q²/(8πε₀R₁)——孤立导体球贮存的能量。</p>
</div>
<div class="callout tip">
  <p class="callout-h">思考：静电能的损失</p>
  <p>真空中半径为 r 的导体球，外套同心导体球壳（半径 R₁、R₂），内球带电荷 q。讨论下列两种情况下静电能的损失：（1）球与壳用导线相连：ΔW₁ = −½ε₀∫<sub>r</sub><sup>R₁</sup>E₁²dV = −q²/(8πε₀)·(1/r − 1/R₁)；（2）壳接地：ΔW₂ = −½ε₀∫<sub>R₂</sub><sup>∞</sup>E₂²dV = −q²/(8πε₀R₂)。</p>
</div>
<h3>课件自测（单选题）</h3>
`,
        },
        { type: 'quiz', quiz: {
          kind: 'single',
          question: '1. 下列几个说法中哪一个是正确的？',
          options: [
            '电场中某点场强的方向，就是将点电荷放在该点所受电场力的方向',
            '在以点电荷为中心的球面上，由该点电荷所产生的场强处处相同',
            '场强可由 E = F/q，其中 q 为试验电荷，q 可正、可负，F 为试验电荷所受的电场力',
            '以上说法都不正确',
          ],
          answer: 'D',
          explanation: 'A 错：场强方向规定为正电荷受力方向；B 错：球面上各点场强方向不同（沿径向）；C 错：定义式要求 q₀ 为正的试验电荷。故选 D。',
        } },
        { type: 'quiz', quiz: {
          kind: 'single',
          question: '2. 有一边长为 a 的正方形平面，在其中垂线上距中心 O 点 a/2 处，有一电荷为 q 的正点电荷，则通过该平面的电场强度通量为',
          options: ['q/(3ε₀)', 'q/(4πε₀)', 'q/(3πε₀)', 'q/(6ε₀)'],
          answer: 'D',
          explanation: '该正方形平面可看作边长为 a 的立方体的一个面，点电荷恰位于立方体中心。由高斯定理，立方体总通量为 q/ε₀，六个面对称，每个面为 q/6ε₀。故选 D。',
        } },
        { type: 'quiz', quiz: {
          kind: 'single',
          question: '3. 半径为 R 的均匀带电球面，若其电荷面密度为 σ，则在距离球面外 R 处的电场强度大小为：',
          options: ['σ/2ε₀', 'σ/4ε₀', 'σ/8ε₀', 'σ/ε₀'],
          answer: 'B',
          explanation: '球面外场强 E = Q/(4πε₀r²)，Q = σ·4πR²，r = 2R：E = σ·4πR²/(4πε₀·4R²) = σ/4ε₀。故选 B。',
        } },
        { type: 'quiz', quiz: {
          kind: 'single',
          question: '4. 两个同心的均匀带电球面，内球面带电荷 Q₁，外球面带电荷 Q₂，则在两球面之间、距离球心为 r 处的 P 点的场强大小 E 为：',
          options: ['Q₁/(4πε₀r²)', '(Q₁ + Q₂)/(4πε₀r²)', 'Q₂/(4πε₀r²)', '(Q₁ − Q₂)/(4πε₀r²)'],
          answer: 'A',
          explanation: '高斯面取在两球面之间，面内只含内球面电荷 Q₁，故 E = Q₁/(4πε₀r²)。故选 A。',
        } },
        { type: 'quiz', quiz: {
          kind: 'single',
          question: '5. 一半径为 a 的「无限长」圆柱面上均匀带电，其电荷线密度为 λ。在它外面同轴地套一半径为 b 的薄金属圆筒，圆筒原先不带电但与地连接（地电势为零）。则在内圆柱面里面、距离轴线为 r 的 P 点的场强大小和电势分别为：',
          options: [
            'E = 0；V = (λ/2πε₀)·ln(a/r)',
            'E = 0；V = (λ/2πε₀)·ln(b/a)',
            'E = λ/(2πε₀r)；V = (λ/2πε₀)·ln(b/r)',
            'E = λ/(2πε₀r)；V = (λ/2πε₀)·ln(b/a)',
          ],
          answer: 'B',
          explanation: 'r &lt; a 处于带电面之内，E = 0；圆筒接地使外筒电势为零，故内柱与外筒间的电势差 U = (λ/2πε₀)·ln(b/a)，内柱（及其内部）电势均为该值。故选 B。',
        } },
        { type: 'quiz', quiz: {
          kind: 'single',
          question: '6. 真空中一半径为 R 的均匀带电球面带有电荷 Q（Q＞0）。今在球面上挖去非常小的面积 ΔS（连同电荷），假设不影响其他处原来的电荷分布，则挖去 ΔS 后球心处电场强度的大小 E 与方向为：',
          options: ['E = Q·ΔS/(16π²ε₀R⁴)，方向由圆心 O 指向 ΔS', 'E = Q·ΔS/(16π²ε₀R⁴)，方向由 ΔS 指向圆心 O', 'E = 0', 'E = Q/(4πε₀R²)'],
          answer: 'B',
          explanation: '完整的均匀带电球面在球心处 E = 0，挖去部分相当于在球心处叠加一个负的面电荷元的场：E = (σ·ΔS)/(4πε₀R²) = (Q·ΔS)/(16π²ε₀R⁴)，方向由 ΔS（缺失处）指向圆心 O。故选 B。',
        } },
      ],
    },
  ],
};

export default deck7;
