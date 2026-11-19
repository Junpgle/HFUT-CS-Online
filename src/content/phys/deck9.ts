import type { DeckData } from './types';

/** 第9章 电磁感应 电磁场理论 —— 课件 9.电磁感应定律（§9-1~9-3）+ 10-11.自感应和互感应 磁场的能量 位移电流 电磁场理论（§9-4~9-6） */
const deck9: DeckData = {
  id: 'deck9',
  no: '第9章',
  title: '电磁感应 电磁场理论',
  subtitle: '电磁感应定律 · 动生/感生电动势 · 自感与互感 · 磁场能量 · 位移电流与麦克斯韦方程组',
  lede:
    '变化的磁场激发涡旋电场，变化的电场（位移电流）激发磁场——麦克斯韦用这两个假设把电与磁统一为电磁场理论。本章从电磁感应现象出发，依次讨论动生电动势、感生电动势、自感与互感、磁场能量，最后归纳出麦克斯韦电磁场方程组的积分形式。',
  toc: [
    { id: 'sec-9-1', text: '9-1 电磁感应定律', level: 2 },
    { id: 'sec-9-2', text: '9-2 动生电动势', level: 2 },
    { id: 'sec-9-3', text: '9-3 感生电动势 感生电场', level: 2 },
    { id: 'sec-9-4', text: '9-4 自感应和互感应', level: 2 },
    { id: 'sec-9-5', text: '9-5 磁场的能量', level: 2 },
    { id: 'sec-9-6', text: '9-6 位移电流 电磁场理论', level: 2 },
  ],
  sections: [
    {
      id: 'sec-9-1',
      heading: '9-1 电磁感应定律',
      blocks: [
        {
          type: 'html',
          html: `
<h3>一、电磁感应现象</h3>
<p>典型的电磁感应实验：磁铁棒相对线圈运动、线圈2的电流改变（邻近线圈中电流变化）、金属棒在磁场中运动。当穿过闭合回路的磁通量发生变化时，不管这种变化是什么原因引起的，回路中都有电流产生，称为<strong>电磁感应现象</strong>。相应的电动势称为<strong>感应电动势</strong>，电磁感应现象中产生的电流称为<strong>感应电流</strong>。</p>
<h3>二、楞次定律</h3>
<p><strong>楞次定律</strong>：闭合回路中感应电流的方向，总是使得它所激发的磁场来阻止引起感应电流的磁通量的变化。楞次定律的应用之一：磁悬浮列车的制动力。</p>
<h3>3．法拉第电磁感应定律</h3>
<p>当穿过闭合回路所围面积的磁通量发生变化时，回路中会产生感应电动势，且感应电动势正比于磁通量对时间变化率的负值：</p>
<div class="formula"><p>ε<sub>i</sub> = −k·dΦ/dt　（国际单位制中 k = 1）　→　ε<sub>i</sub> = −dΦ/dt</p></div>
<p><strong>ε<sub>i</sub> 方向的判断</strong>：先规定回路绕行正向，从而确定磁通量（及变化率）的正负，再得感应电动势的正负。若 ε<sub>i</sub> 为正，则与规定的回路方向相同；若为负，则相反。例如取 Φ &gt; 0：当 dΦ/dt &gt; 0 时 ε<sub>i</sub> &lt; 0，ε<sub>i</sub> 与 L 绕向相反；当 dΦ/dt &lt; 0 时 ε<sub>i</sub> &gt; 0，ε<sub>i</sub> 与 L 绕向相同。</p>
<p>对于 N 匝线圈，通过 N 匝线圈的总磁通量用<strong>磁通匝链数</strong>（简称<strong>磁链</strong>）或全磁通表示：</p>
<div class="formula"><p>Ψ = NΦ　→　ε<sub>i</sub> = −dΨ/dt = −N·dΦ/dt</p></div>
<h3>二、电源的电动势</h3>
<p><strong>电源</strong>——提供非静电力的装置，把正电荷从电势低的地方（电源负极）移到电势高的地方（电源正极）。导体内形成持续电流的条件：载流子、电势差。电源把其它形式的能量转化为电势能，如化学电池、发电机、热电偶、硅（硒）太阳能电池、核反应堆等。</p>
<p><strong>非静电场的场强</strong>：E<sub>k</sub> = F<sub>k</sub>/q。<strong>电动势</strong>：ε = dA/dq——电动势等于将单位正电荷从电源负极沿内电路移到正极过程中非静电场力做的功。电动势是标量；电源外 E<sub>k</sub> = 0：</p>
<div class="formula"><p>ε = ∫<sub>−</sub><sup>+</sup>E<sub>k</sub>·dl　（内电路）</p></div>
<p>以丹聂耳电池为例：Zn → Zn<sup>2+</sup>、Cu<sup>2+</sup> → Cu，两极与溶液的界面处形成电势跃变，U<sub>Cu</sub> &gt; U<sub>溶液</sub> &gt; U<sub>Zn</sub>。</p>
<h3>感应电动势的普遍表达式</h3>
<p>如果用 E<sub>k</sub> 表示等效的非静电性场强，则感应电动势 ε<sub>i</sub> 可表为：</p>
<div class="formula"><p>ε<sub>i</sub> = ∮<sub>L</sub>E<sub>k</sub>·dl = −dΦ/dt = −∫<sub>S</sub>∂B/∂t·dS</p></div>
<p><strong>感应电流与通过的电荷</strong>：若闭合回路的总电阻为 R，感应电流为：</p>
<div class="formula"><p>I<sub>i</sub> = ε<sub>i</sub>/R = −(1/R)·dΦ/dt</p></div>
<p>在 Δt = t₂ − t₁ 时间内，流过回路的电荷为：</p>
<div class="formula"><p>q = ∫I<sub>i</sub>dt = (1/R)·(Φ₁ − Φ₂) = |ΔΦ|/R</p></div>
<div class="callout tip">
  <p class="callout-h">例9-1：交变电流旁矩形线圈的感应电动势</p>
  <p>一长直导线通以电流 I = I₀sinωt，旁边有一个共面的矩形线圈 abcd。求线圈中的感应电动势。</p>
  <p>解：选顺时针为绕行方向，距导线 x 处 B = μ₀I/(2πx)：</p>
  <div class="formula"><p>Φ = ∫<sub>S</sub>B·dS = ∫<sub>a</sub><sup>a+b</sup>μ₀I/(2πx)·l dx = μ₀I₀l/(2π)·sinωt·ln((a+b)/a)</p></div>
  <div class="formula"><p>ε<sub>i</sub> = −dΦ/dt = −μ₀I₀lω/(2π)·cosωt·ln((a+b)/a)</p></div>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-9-2',
      heading: '9-2 动生电动势',
      blocks: [
        {
          type: 'html',
          html: `
<h3>动生电动势的非静电力场来源——洛伦兹力</h3>
<p>导体棒 AB 以速度 v 在磁场中运动时，棒内自由电子受洛伦兹力 F<sub>m</sub> = −e(v×B) 作用而移动，形成宏观的电动势。若以 E<sub>k</sub> 表示非静电场强，则有：</p>
<div class="formula"><p>E<sub>k</sub> = v×B</p></div>
<p>对长为 l 的直棒（v ⊥ B ⊥ l）：ε<sub>i</sub> = ∮E<sub>k</sub>·dl = ∫<sub>A</sub><sup>B</sup>(v×B)·dl = lvB。</p>
<h3>能量转换：外力做功转化为电能</h3>
<p>通电导体棒 AB 在磁场中受到的安培力大小为 F<sub>m</sub> = IlB，方向向左。为了使导体棒匀速向右运动，必须有外力 F<sub>外</sub> 与 F<sub>m</sub> 平衡，它们大小相等、方向相反。因此，外力的功率为 P = F<sub>外</sub>·v = IlB·v = I·Blv，这正好等于感应电动势做功的功率 P<sub>i</sub> = I·ε<sub>i</sub>——外力克服安培力做功，把机械能转化为电能。</p>
<h3>一般情形下动生电动势的计算</h3>
<p>在一般情况下，磁场可以不均匀，导线在磁场中运动时各部分的速度也可以不同，v、B 和 dl 也可以不相互垂直，这时运动导线内总的动生电动势为：</p>
<div class="formula"><p>ε<sub>i</sub> = ∫<sub>L</sub>(v×B)·dl　（一段导体）　　ε<sub>i</sub> = ∮<sub>L</sub>(v×B)·dl　（闭合回路）</p></div>
<p>对一段导体 ab，ε<sub>ab</sub> = ∫<sub>a</sub><sup>b</sup>(v×B)·dl：若 ε<sub>ab</sub> &gt; 0，则 U<sub>a</sub> &gt; U<sub>b</sub>；若 ε<sub>ab</sub> &lt; 0，则 U<sub>a</sub> &lt; U<sub>b</sub>。计算方法小结：</p>
<ul>
<li>（1）对于导体回路：a. ε = ∮(v×B)·dl；b. ε<sub>i</sub> = −dΦ/dt。</li>
<li>（2）对于一段导体：a. ε<sub>ab</sub> = ∫<sub>a</sub><sup>b</sup>(v×B)·dl；b. 设想构成一个辅助回路，若其余部分不产生电动势，则 ε<sub>ab</sub> = ε<sub>i</sub> = −dΦ/dt。</li>
</ul>
<div class="callout tip">
  <p class="callout-h">例9-2：转动铜棒</p>
  <p>长为 L 的铜棒，在磁感强度为 B 的均匀磁场中以角速度 ω 在与磁场方向垂直的平面内绕棒的一端 O 匀速转动，求棒中的动生电动势。</p>
  <p>解：取线元 dl，方向沿 O 指向 A，该线元速度 v = ωl。dε<sub>i</sub> = (v×B)·dl = −vBdl = −Bωl·dl，金属棒上总电动势：</p>
  <div class="formula"><p>ε<sub>i</sub> = −∫<sub>0</sub><sup>L</sup>Bωl·dl = −½BωL²</p></div>
  <p>方向为 A→O，即 O 点电势较高。<strong>另解</strong>：棒在 dt 内扫过 dS = ½L²dθ，dΦ = BdS，ε<sub>i</sub> = −dΦ/dt = −½BL²dθ/dt = −½BL²ω，结果相同。</p>
</div>
<div class="callout key">
  <p class="callout-h">讨论：法拉第圆盘发电机</p>
  <p>铜盘在磁场中转动，可视为无数根并联的铜棒：ε = ½R²ωB（R 为圆盘半径）。</p>
</div>
<div class="callout tip">
  <p class="callout-h">例9-3：平行于长直载流导线的直导线</p>
  <p>直导线 ab 以速率 v 沿平行于长直载流导线的方向运动，ab 与直导线共面，且与它垂直。设直导线中的电流强度为 I，导线 ab 长为 L，a 端到直导线的距离为 d，求导线 ab 中的动生电动势，并判断哪端电势较高。</p>
  <p>解（1）应用 ε<sub>ab</sub> = ∫(v×B)·dl 求解：距长直载流导线 r 处取一线元 dr，方向向右，该处 B = μ₀I/(2πr)。dε<sub>i</sub> = (v×B)·dr = −vBdr = −μ₀Iv/(2πr)dr：</p>
  <div class="formula"><p>ε<sub>ab</sub> = ∫<sub>d</sub><sup>d+L</sup>−μ₀Iv/(2πr)dr = −μ₀Iv/(2π)·ln((d+L)/d)</p></div>
  <p>ε<sub>ab</sub> &lt; 0，表明电动势的方向由 b 指向 a，a 端电势较高。</p>
  <p>解（2）应用电磁感应定律求解：设某时刻导线 ab 到 U 形框底边的距离为 x，取顺时针方向为回路的正方向，该时刻通过回路 aboo′a 的磁通量为：</p>
  <div class="formula"><p>Φ = ∫<sub>d</sub><sup>d+L</sup>μ₀I/(2πr)·x dr = μ₀Ix/(2π)·ln((d+L)/d)　→　ε<sub>ab</sub> = −dΦ/dt = −μ₀Iv/(2π)·ln((d+L)/d)</p></div>
  <p>ε<sub>ab</sub> &lt; 0 表示电动势的方向与所选回路正方向相反，即沿逆时针方向，因此在导线 ab 上电动势由 b 指向 a，a 端电势较高。</p>
</div>
<div class="callout tip">
  <p class="callout-h">例：导轨上滑行棒的速率变化</p>
  <p>一导线矩形框的平面与磁感强度为 B 的均匀磁场相垂直。矩形框上有一质量为 m、长为 l 的可移动细导体棒 MN；矩形框接有电阻 R，其值较之导线的电阻值大得很多。若开始时细导体棒以速度 v₀ 沿矩形框运动，试求棒的速率随时间变化的函数关系。</p>
  <p>解：棒中 ε<sub>i</sub> = Blv，I = Blv/R，棒所受安培力 F = IBl = B²l²v/R，方向沿 ox 轴反向。棒的运动方程 m·dv/dt = −B²l²v/R，积分（t = 0 时 v = v₀）得：</p>
  <div class="formula"><p>v = v₀·e<sup>−(B²l²/(mR))·t</sup></p></div>
</div>
<h3>2．在磁场中转动的线圈内的感应电动势</h3>
<p>设矩形线圈 ABCD 的匝数为 N、面积为 S，使这线圈在匀强磁场中绕固定的轴线 OO′ 转动，磁感应强度 B 与轴 OO′ 垂直。当 t = 0 时，e<sub>n</sub> 与 B 之间的夹角为零，经过时间 t，与 B 之间的夹角为 θ = ωt：</p>
<div class="formula"><p>Φ = BS·cosθ = BS·cosωt　→　ε<sub>i</sub> = −N·dΦ/dt = NBSω·sinωt</p></div>
<p>令 ε₀ = NBSω，则 ε<sub>i</sub> = ε₀sinωt。在匀强磁场内转动的线圈中所产生的电动势是随时间作周期性变化的，这种电动势称为<strong>交变电动势</strong>。在交变电动势的作用下，线圈中的电流也是交变的，称为交变电流或<strong>交流</strong>。</p>
`,
        },
      ],
    },
    {
      id: 'sec-9-3',
      heading: '9-3 感生电动势 感生电场',
      blocks: [
        {
          type: 'html',
          html: `
<h3>1. 感生电场</h3>
<p>当导体回路不动，由于磁场变化引起磁通量改变而产生的感应电动势，叫做<strong>感生电动势</strong>。<strong>麦克斯韦假设</strong>：变化的磁场在其周围空间激发一种电场，这个电场叫<strong>感生电场</strong>（有旋电场）。闭合回路中的感生电动势：</p>
<div class="formula"><p>ε<sub>i</sub> = ∮<sub>L</sub>E<sub>i</sub>·dl = −dΦ/dt　，　Φ = ∫<sub>S</sub>B·dS　⇒　∮<sub>L</sub>E<sub>i</sub>·dl = −(d/dt)∫<sub>S</sub>B·dS = −∫<sub>S</sub>∂B/∂t·dS</p></div>
<p>讨论：</p>
<ul>
<li>（1）变化的磁场能够在周围空间（包括无磁场区域）激发感应电场；</li>
<li>（2）感应电场的环流不等于零，表明感应电场为涡旋场，所以又称为"涡旋电场"。</li>
</ul>
<p>式中负号表示感应电场与磁场增量的方向成<strong>左手螺旋</strong>关系。</p>
<h3>感应电场与静电场的比较</h3>
<table class="tbl">
  <thead><tr><th>项目</th><th>静电场 E<sub>s</sub></th><th>感应电场 E<sub>i</sub></th></tr></thead>
  <tbody>
    <tr><td>场源</td><td>静电荷</td><td>变化的磁场</td></tr>
    <tr><td>场线</td><td>始于正电荷，止于负电荷</td><td>闭合曲线</td></tr>
    <tr><td>环流</td><td>∮E<sub>s</sub>·dl = 0</td><td>∮E<sub>i</sub>·dl = −∫<sub>S</sub>∂B/∂t·dS</td></tr>
    <tr><td>通量</td><td>∮E<sub>s</sub>·dS = q/ε₀</td><td>∮E<sub>i</sub>·dS = 0</td></tr>
    <tr><td>性质</td><td>无旋场、有源场</td><td>有旋场、无源场</td></tr>
  </tbody>
</table>
<h3>感生电场和感生电动势的计算</h3>
<p><strong>1. 感生电场的计算</strong>：对具有对称性的磁场分布，磁场变化时产生的感应电场可由 ∮<sub>L</sub>E<sub>i</sub>·dl = −∫<sub>S</sub>∂B/∂t·dS 计算，方法类似于运用安培环路定理计算磁场，关键是选取适当的闭合回路 L。</p>
<p><strong>2. 感生电动势的计算</strong>：（1）导体为闭合回路：ε<sub>i</sub> = −N·dΦ/dt 或 ε<sub>i</sub> = −dΦ/dt；（2）非闭合回路：已知 E<sub>i</sub> 时 ε<sub>i</sub> = ∫<sub>a</sub><sup>c</sup>E<sub>i</sub>·dl，E<sub>i</sub> 未知时设法构成辅助回路求 −dΦ/dt。若既有动生电动势，又有感生电动势：</p>
<div class="formula"><p>ε<sub>i</sub> = ∫<sub>a</sub><sup>b</sup>(v×B)·dl + ∫<sub>a</sub><sup>b</sup>E<sub>i</sub>·dl　或　ε<sub>i</sub> = −N·dΦ/dt</p></div>
<div class="callout tip">
  <p class="callout-h">例9-4：无限长螺线管内外的感生电场</p>
  <p>半径为 R 的无限长螺线管内部的磁场 B 随时间作线性变化（dB/dt = 常量）。求管内外的感生电场。</p>
  <p>解：根据对称性取顺时针方向的同心圆为回路 L。</p>
  <p>r &lt; R 时：Φ = BS = Bπr²，ε<sub>i</sub> = ∮E<sub>i</sub>·dl = 2πr·E<sub>i</sub> = −dΦ/dt = −πr²·dB/dt：</p>
  <div class="formula"><p>E<sub>i</sub> = −(r/2)·dB/dt</p></div>
  <p>负号表示感生电场为逆时针方向（dB/dt &gt; 0 时）。r &gt; R 时：Φ = BπR²，2πr·E<sub>i</sub> = −πR²·dB/dt：</p>
  <div class="formula"><p>E<sub>i</sub> = −(R²/2r)·dB/dt</p></div>
  <p>感应电场分布：E<sub>i</sub> = −(r/2)·dB/dt（r &lt; R）；E<sub>i</sub> = −(R²/2r)·dB/dt（r &gt; R）。</p>
</div>
<div class="callout tip">
  <p class="callout-h">例9-5：磁场区域中金属棒的感生电动势</p>
  <p>半径为 R 的圆柱形体积内充满磁感应强度 B(t) 的均匀磁场，有一长为 L 的金属棒放在其中，设 dB/dt 已知，求棒两端的感生电动势。</p>
  <p>解：利用前面的结果 E<sub>i</sub> = −(r/2)·dB/dt（r &lt; R）。ε<sub>ab</sub> = ∫<sub>a</sub><sup>b</sup>E<sub>i</sub>·cosθ·dl，其中 cosθ = √(R²−L²/4)/r，代入得：</p>
  <div class="formula"><p>ε<sub>ab</sub> = ∫<sub>a</sub><sup>b</sup>½·(dB/dt)·√(R²−L²/4)·dl = (L/2)·√(R²−L²/4)·dB/dt</p></div>
  <p>方向 a→b。<strong>另解</strong>：作辅助线构成闭合回路 aob。沿半径方向 ε<sub>Oa</sub> = 0、ε<sub>bO</sub> = 0（E<sub>i</sub> 与 dl 垂直），故 ε<sub>ab</sub> = ε<sub>Oab</sub> = −dΦ/dt，其中 Φ = B·(L/2)·√(R²−L²/4)：</p>
  <div class="formula"><p>ε<sub>ab</sub> = (L/2)·√(R²−L²/4)·dB/dt</p></div>
</div>
<h3>*二、电子感应加速器</h3>
<p>电子感应加速器是利用感应电场来加速电子的一种设备。它的柱形电磁铁在两极间产生磁场，在磁场中安置一个环形真空管道作为电子运行的轨道。当磁场发生变化时，就会沿管道方向产生感应电场，射入其中的电子就受到这感应电场的持续作用而被不断加速。</p>
<p>为了使电子在环形真空室中按一定的轨道运动，电磁铁在真空室处的磁场 B 值必须满足一定条件。电子切向受感应电场力 −eE<sub>i</sub> = d(mv)/dt；径向洛伦兹力作向心力 eBv = mv/R，即 mv = eRB（常量）。将 mv = eRB 两边对 t 微分，并与 eE<sub>i</sub> = d(mv)/dt 比较（E<sub>i</sub> 由 2πR·E<sub>i</sub> = dΦ/dt 给出，Φ 为轨道围成的磁通），得轨道处磁场 B 与轨道内部平均磁场 B̄ 的关系——这是使电子维持在恒定的圆形轨道上加速时磁场必须满足的条件：</p>
<div class="formula"><p>B = ½B̄</p></div>
<p>只有在磁场变化的第一个 1/4 周期内，电子才被加速而沿圆形轨道运动（一个周期内感生电场的方向会反转）。</p>
<h3>*三、涡电流</h3>
<p>当大块导体放在变化的磁场中，在导体内部会产生感应电流，由于这种电流在导体内自成闭合回路，故称为<strong>涡电流</strong>。交变电流通过铁心线圈时，涡电流 I′ ∝ ε<sub>i</sub> ∝ dΦ/dt ∝ ω，涡流热功率 P ∝ I′² ∝ ω²。</p>
<ul>
<li><strong>感应加热</strong>：利用涡电流产生的焦耳热冶炼金属、电磁炉等；</li>
<li><strong>电磁阻尼</strong>：利用涡电流的电磁阻尼摆；</li>
<li>变压器铁心采用叠片以减小涡流损耗。</li>
</ul>
`,
        },
      ],
    },
    {
      id: 'sec-9-4',
      heading: '9-4 自感应和互感应',
      blocks: [
        {
          type: 'html',
          html: `
<h3>1. 自感应</h3>
<p>由于回路中电流产生的磁通量发生变化，而在自己回路中激发感应电动势的现象叫做<strong>自感现象</strong>，这种感应电动势叫做<strong>自感电动势</strong>。</p>
<p>设有一无铁芯的长直螺线管，长为 l、截面半径为 R，管上绕组的总匝数为 N，其中通有电流 I：</p>
<div class="formula"><p>B = μ₀NI/l　→　Φ = BS = μ₀N²IπR²/l　→　Ψ = NΦ = μ₀N²IπR²/l</p></div>
<p>当线圈中的电流发生变化时，在 N 匝线圈中产生的感应电动势为：</p>
<div class="formula"><p>ε<sub>L</sub> = −dΨ/dt = −(μ₀N²πR²/l)·dI/dt</p></div>
<p>其中 L = Ψ/I = μ₀N²πR²/l 称为回路的<strong>自感系数</strong>，简称<strong>自感</strong>。它由回路的大小、形状、匝数以及周围磁介质的性质决定。自感系数等于回路中的电流变化为单位值时，在回路本身所围面积内引起磁链数的改变值。对于一个任意形状的回路，回路中由于电流变化引起通过回路本身磁链数的变化而出现的感应电动势为：</p>
<div class="formula"><p>ε<sub>L</sub> = −dΨ/dt = −L·dI/dt</p></div>
<p>如果回路的几何形状保持不变，且在它的周围空间没有铁磁性物质，则 Ψ ∝ I（B ∝ I），L 为常量。<strong>单位</strong>：亨利（H），1 H = 1 Wb/A；1 mH = 10⁻³ H，1 μH = 10⁻⁶ H。自感：回路自感的大小等于回路中的电流为单位值时通过这回路所围面积的磁链数。</p>
<div class="callout tip">
  <p class="callout-h">例9-6：同轴电缆的自感</p>
  <p>同轴电缆内、外筒半径分别为 R₁ 和 R₂，其间为真空。内、外筒流过的电流 I 大小相等，方向相反。求电缆单位长度的自感。</p>
  <p>解：两筒之间 B = μ₀I/(2πr)。取长为 l 的截面：</p>
  <div class="formula"><p>Φ = ∫B·dS = ∫<sub>R₁</sub><sup>R₂</sup>μ₀Il/(2πr)·dr = μ₀Il/(2π)·ln(R₂/R₁)</p></div>
  <div class="formula"><p>L = Φ/(Il) = μ₀/(2π)·ln(R₂/R₁)　（单位长度的自感）</p></div>
</div>
<div class="callout tip">
  <p class="callout-h">例9-7：LR 电路的暂态电流</p>
  <p>试分析 LR 电路中（暂态）电流的变化规律。</p>
  <p>解：1. S 接通（电流滋长过程）：回路方程 ε − L·dI/dt − IR = 0，分离变量积分（t = 0 时 I = 0）：</p>
  <div class="formula"><p>I = (ε/R)·(1 − e<sup>−t/τ</sup>)　，　τ = L/R（时间常量）</p></div>
  <p>t = τ 时 I = (ε/R)·(1 − 1/e)。</p>
  <p>2. S₁ 断开、S₂ 接通（电流衰减过程）：回路方程 ε<sub>L</sub> − IR = 0，即 L·dI/dt + IR = 0：</p>
  <div class="formula"><p>I = (ε/R)·e<sup>−t/τ</sup> = I₀·e<sup>−t/τ</sup></p></div>
</div>
<h3>2. 互感应</h3>
<p>由一个回路中电流变化而在另一个回路中产生感应电动势的现象，叫做<strong>互感现象</strong>，这种感应电动势叫做<strong>互感电动势</strong>。两回路间：</p>
<div class="formula"><p>Ψ₂₁ = M₂₁·I₁　，　Ψ₁₂ = M₁₂·I₂　，　M₂₁ = M₁₂ = M</p></div>
<p>M 称为<strong>互感系数</strong>，简称互感。它由两个回路的大小、形状、匝数以及周围磁介质的性质决定。<strong>特例</strong>：截面半径为 r、长为 l 的均匀长直螺线管外共轴地密绕两层线圈 C₁、C₂，匝数分别为 N₁、N₂。当 C₁ 通以电流 I₁ 时：</p>
<div class="formula"><p>B₁ = μ₀N₁I₁/l　→　Ψ₂₁ = N₂Φ₂₁ = μ₀N₁N₂I₁πr²/l</p></div>
<p>当 I₁ 变化时，C₂ 中将产生互感电动势：</p>
<div class="formula"><p>ε₂₁ = −dΨ₂₁/dt = −μ₀N₁N₂πr²/l·dI₁/dt = −M₂₁·dI₁/dt　，　M₂₁ = μ₀N₁N₂πr²/l</p></div>
<p>当 C₂ 中通的电流 I₂ 变化时，C₁ 中将产生互感电动势：ε₁₂ = −M₁₂·dI₂/dt，且 M₁₂ = M₂₁ = M。<strong>一般情形</strong>，若空间不存在铁磁质：</p>
<div class="formula"><p>M = Ψ₁₂/I₂ = Ψ₂₁/I₁</p></div>
<p>互感电动势：ε₁₂ = −dΨ₁₂/dt = −M·dI₂/dt，ε₂₁ = −dΨ₂₁/dt = −M·dI₁/dt。</p>
<h3>耦合因数（耦合系数）</h3>
<p>一般说来，回路 1 的电流产生的磁场通过自身回路的磁通量 Φ₁₁ 与它通过回路 2 的磁通量 Φ₂₁ 是不相等的，通常 Φ₂₁ ≤ Φ₁₁。因此 Φ₂₁ = K₁Φ₁₁（0 ≤ K₁ ≤ 1），同理 Φ₁₂ = K₂Φ₂₂（0 ≤ K₂ ≤ 1）。因为 Φ₂₁ = MI₁、Φ₁₂ = MI₂，又有 Φ₁₁ = L₁I₁、Φ₂₂ = L₂I₂，可得：</p>
<div class="formula"><p>M = K₁K₂·√(L₁L₂) = K·√(L₁L₂)　（0 ≤ K ≤ 1）</p></div>
<p>耦合系数 k：M = k·√(L₁L₂)。k = 0 无耦合，k = 1 全耦合。特例（k = 1，全耦合无漏磁）：L₁ = μ₀N₁²πr²/l，L₂ = μ₀N₂²πr²/l，则 M = μ₀N₁N₂πr²/l = √(L₁L₂)。</p>
<div class="callout tip">
  <p class="callout-h">例9-8：螺绕环与小线圈的互感</p>
  <p>一密绕螺绕环，单位长度的匝数为 n = 2000 m⁻¹，环的截面积为 S = 10 cm²，另一个 N = 10 匝的小线圈套绕在环上。（1）求两个线圈间的互感；（2）当螺绕环中的电流变化率为 dI/dt = 10 A/s 时，求小线圈内产生的互感电动势的大小。</p>
  <p>解：（1）设螺绕环中通有电流 I，螺绕环中的磁感应强度大小为 B = μ₀nI，通过 N 匝小线圈的磁通链为 Ψ = NΦ = Nμ₀nIS：</p>
  <div class="formula"><p>M = Ψ/I = μ₀NSn = 2.5×10⁻⁵ H = 25 μH</p></div>
  <p>（2）小线圈内产生的互感电动势大小为：</p>
  <div class="formula"><p>|ε₂₁| = M·dI/dt = 2.5×10⁻⁵×10 = 2.5×10⁻⁴ V = 250 μV</p></div>
</div>
<div class="callout tip">
  <p class="callout-h">例9-9：同心圆线圈</p>
  <p>两只水平放置的同心圆线圈 1 和 2，半径分别为 r 和 R，且 R ≫ r，已知小线圈 1 内通有电流 I₁ = I₀cosωt，求在大线圈 2 上产生的感应电动势。</p>
  <p>解：先假设大线圈通电流 I₂。因为 R ≫ r，小线圈内的磁场可以看作是均匀的，其中心的磁场为 B = μ₀I₂/(2R)，穿过小线圈的磁通 Φ₁₂ = BS = μ₀I₂πr²/(2R)：</p>
  <div class="formula"><p>M₁₂ = Φ₁₂/I₂ = μ₀πr²/(2R)　，　M₂₁ = M₁₂ = μ₀πr²/(2R)</p></div>
  <p>于是大线圈 2 上产生的感应电动势：</p>
  <div class="formula"><p>ε₂₁ = −M₂₁·dI₁/dt = μ₀πr²/(2R)·I₀ω·sinωt</p></div>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-9-5',
      heading: '9-5 磁场的能量',
      blocks: [
        {
          type: 'html',
          html: `
<h3>一、磁场的能量（以 RL 电路为例）</h3>
<p>自感电动势 ε<sub>L</sub> = −L·dI/dt，回路方程 ε − L·dI/dt = RI。两边乘以 Idt：εI·dt = LI·dI + RI²dt。对电流滋长过程（I 从 0 → I₀ = ε/R）积分：</p>
<div class="formula"><p>∫<sub>0</sub><sup>t</sup>εI·dt = ∫<sub>0</sub><sup>I₀</sup>LI·dI + ∫<sub>0</sub><sup>t</sup>RI²·dt = ½LI₀² + ∫<sub>0</sub><sup>t</sup>RI²·dt</p></div>
<p>各项含义：∫εI·dt 为电源所做的功；∫RI²·dt 为消耗在电阻上的焦耳热；½LI₀² 为电源反抗自感电动势做的功，转化为<strong>磁场的能量</strong>：</p>
<div class="formula"><p>W<sub>m</sub> = ½LI²</p></div>
<h3>二、磁场的能量密度</h3>
<p>以长直螺线管为例：L = μN²S/l = μn²V（V = Sl 为管的体积），B = μnI，则：</p>
<div class="formula"><p>W<sub>m</sub> = ½LI² = ½μn²V·(B/(μn))² = B²V/(2μ)</p></div>
<p>磁场的能量密度（单位体积的磁场能量）：</p>
<div class="formula"><p>w<sub>m</sub> = W<sub>m</sub>/V = B²/(2μ)　，　一般情形　w<sub>m</sub> = ½BH</p></div>
<p>对匀强磁场，磁场的能量 W<sub>m</sub> = w<sub>m</sub>·V = ½BH·V；对非匀强磁场：</p>
<div class="formula"><p>W<sub>m</sub> = ∫<sub>V</sub>w<sub>m</sub>·dV = ∫<sub>V</sub>½BH·dV</p></div>
<div class="callout tip">
  <p class="callout-h">例9-10：同轴电缆的磁场能量与自感</p>
  <p>一根长直同轴电缆，由半径为 R₁ 和 R₂ 的两圆筒组成，电缆中有电流 I，经内层流进外层流出形成回路。试计算：（1）长为 l 的一段电缆内的磁场能量；（2）该段电缆的自感。</p>
  <p>解：两筒之间 B = μ₀I/(2πr)，w<sub>m</sub> = B²/(2μ₀) = μ₀I²/(8π²r²)。对 r → r+dr 的圆筒：dV = 2πrl·dr，dW<sub>m</sub> = w<sub>m</sub>·dV = μ₀I²l/(4πr)·dr：</p>
  <div class="formula"><p>W<sub>m</sub> = ∫<sub>R₁</sub><sup>R₂</sup>μ₀I²l/(4πr)·dr = μ₀I²l/(4π)·ln(R₂/R₁)</p></div>
  <p>（2）自感：由 W<sub>m</sub> = ½LI²，L = 2W<sub>m</sub>/I² = μ₀l/(2π)·ln(R₂/R₁)——这是<strong>计算自感系数的另一方法</strong> L = 2W<sub>m</sub>/I²，与例9-6结果一致。</p>
</div>
<div class="callout tip">
  <p class="callout-h">例9-11：由磁场能量证明互感相等 M₁₂ = M₂₁</p>
  <p>用通过在两个线圈中建立电流的过程计算储存在线圈周围空间磁场能量的方法，证明两个线圈的互感相等，即 M₁₂ = M₂₁。</p>
  <p>解：先通线圈 1（I₁: 0 → I₁₀），储能 ½L₁I₁₀²。再通线圈 2（I₂: 0 → I₂₀）：线圈 2 电流增加时，给线圈 1 带来互感电动势 ε₁₂ = −M₁₂·dI₂/dt（M₁₂ 是线圈 2 对线圈 1 的互感），线圈 1 的电源需反抗此电动势做功，其大小为 ∫M₁₂I₁₀·dI₂ = M₁₂I₁₀I₂₀。整个系统的磁能为：</p>
  <div class="formula"><p>W<sub>m</sub> = ½L₁I₁₀² + ½L₂I₂₀² + M₁₂I₁₀I₂₀</p></div>
  <p>先通线圈 2，再通线圈 1，同理可得 W<sub>m</sub> = ½L₁I₁₀² + ½L₂I₂₀² + M₂₁I₁₀I₂₀。系统的总磁能与建立电流的先后次序无关，故 M₁₂ = M₂₁。</p>
  <p><strong>讨论</strong>——系统的总磁能：</p>
  <div class="formula"><p>W<sub>m</sub> = ½L₁I₁² + ½L₂I₂² ± MI₁I₂</p></div>
  <p>自感磁通与互感磁通相互加强时取 +；如果电流方向相反，自感磁通与互感磁通相互削弱时取 −。令 M₁₂ = M₂₁ = M。</p>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-9-6',
      heading: '9-6 位移电流 电磁场理论',
      blocks: [
        {
          type: 'html',
          html: `
<h3>一、位移电流</h3>
<p>变化的磁场能激发电场（麦克斯韦假设有旋电场）：</p>
<div class="formula"><p>∮<sub>L</sub>E<sub>i</sub>·dl = −∫<sub>S</sub>∂B/∂t·dS</p></div>
<p>那么，变化的电场能否激发磁场？——考察安培环路定理：连续传导电流条件下 ∮<sub>L</sub>H·dl = ∫<sub>S</sub>j·dS = I。但<strong>非连续传导电流情形</strong>（电容器充电）：对 S₁ 面（与导线相交）∮<sub>L</sub>H·dl = ∫<sub>S₁</sub>j·dS = I；对 S₂ 面（穿过极板之间）∮<sub>L</sub>H·dl = ∫<sub>S₂</sub>j·dS = 0。同一闭合回路的环流因所张曲面不同而不同——<strong>矛盾</strong>！</p>
<p>电容器充放电时：某时刻极板上的电荷面密度为 σ，I<sub>c</sub> = dq/dt = d(σS)/dt；极板间的电位移矢量大小为 D = σ，且 dD/dt 的方向总与导线中的电流方向一致（充电时 D 增大，放电时 D 减小，方向均与电流方向一致）。</p>
<p><strong>位移电流假设（麦克斯韦）</strong>：通过电场中某一截面的位移电流等于通过该截面的电位移通量的时间变化率——变化的电场本身也是一种电流：</p>
<div class="formula"><p>I<sub>D</sub> = dΦ<sub>D</sub>/dt = dΨ/dt</p></div>
<p><strong>位移电流密度</strong>：j<sub>D</sub> = ∂D/∂t = (1/S)·dΦ<sub>D</sub>/dt。对平板电容器 I<sub>D</sub> = d(σS)/dt = S·dσ/dt = S·dD/dt，恰等于导线中的传导电流。</p>
<p><strong>全电流</strong>：传导电流、位移电流的总和 I = I<sub>c</sub> + I<sub>D</sub>。全电流在空间永远是连续的闭合电流。<strong>全电流定律</strong>：</p>
<div class="formula"><p>∮<sub>L</sub>H·dl = ∫<sub>S</sub>(j + ∂D/∂t)·dS = I<sub>c</sub> + I<sub>D</sub></p></div>
<p>电容器充电时：∮<sub>L</sub>H·dl = ∫<sub>S₁</sub>j·dS = ∫<sub>S₂</sub>∂D/∂t·dS（两者相等），矛盾消除。</p>
<p>若 I = 0（纯电场变化），则 ∮<sub>L</sub>H·dl = ∫<sub>S</sub>∂D/∂t·dS。与感生电场 ∮<sub>L</sub>E<sub>i</sub>·dl = −∫<sub>S</sub>∂B/∂t·dS 对比：位移电流（变化的电场）激发的磁场 H 与 ∂D/∂t 成<strong>右手旋</strong>关系；感生电场 E<sub>i</sub> 与 ∂B/∂t 成<strong>左手旋</strong>关系（环流式中带负号）。</p>
<div class="callout tip">
  <p class="callout-h">例9-12：平板电容器间的位移电流与磁场</p>
  <p>半径为 R 的两块圆板，构成平板电容器。现均匀充电，使电容器两极板间的电场变化率为 dE/dt（常量），求极板间的位移电流以及距轴线 r 处的磁感应强度。</p>
  <p>解：Φ<sub>D</sub> = D·S = ε₀E·πR²，位移电流：</p>
  <div class="formula"><p>I<sub>D</sub> = dΦ<sub>D</sub>/dt = ε₀πR²·dE/dt</p></div>
  <p>选同轴圆周为闭合路径 L，由全电流定律 ∮H·dl = 2πr·H = dΦ<sub>D</sub>/dt（半径 r 圆面内的位移电流）。</p>
  <p>r &lt; R 时：2πr·H = ε₀πr²·dE/dt，H = (ε₀r/2)·dE/dt，因 D = ε₀E、B = μ₀H：</p>
  <div class="formula"><p>B = (μ₀ε₀r/2)·dE/dt</p></div>
  <p>r &gt; R 时：2πr·H = ε₀πR²·dE/dt：</p>
  <div class="formula"><p>B = (μ₀ε₀R²/(2r))·dE/dt</p></div>
  <p>注意：上述计算得到的 B 都是由传导电流和位移电流共同激发的总磁场。</p>
</div>
<h3>二、电磁场 麦克斯韦电磁场方程的积分形式</h3>
<p>回顾四条静态条件下的定理：</p>
<table class="tbl">
  <thead><tr><th>定理</th><th>积分形式</th></tr></thead>
  <tbody>
    <tr><td>静电场高斯定理</td><td>∮<sub>S</sub>D·dS = q<sub>内</sub> = ∫<sub>V</sub>ρ·dV</td></tr>
    <tr><td>静电场环流定理</td><td>∮<sub>L</sub>E·dl = 0</td></tr>
    <tr><td>磁场高斯定理</td><td>∮<sub>S</sub>B·dS = 0</td></tr>
    <tr><td>安培环路定理</td><td>∮<sub>L</sub>H·dl = ∑I<sub>包围</sub> = ∫<sub>S</sub>j·dS</td></tr>
  </tbody>
</table>
<p>麦克斯韦的两个假设——1）有旋电场 ∮E<sub>i</sub>·dl = −∫∂B/∂t·dS；2）位移电流 I<sub>D</sub> = dΦ<sub>D</sub>/dt——把静态定理推广为随时间变化的普遍情形，揭示了电场与磁场的内在联系，得到<strong>麦克斯韦电磁场方程的积分形式</strong>：</p>
<div class="formula">
  <p>∮<sub>S</sub>D·dS = q<sub>内</sub>　　∮<sub>L</sub>E·dl = −∫<sub>S</sub>∂B/∂t·dS</p>
  <p>∮<sub>S</sub>B·dS = 0　　∮<sub>L</sub>H·dl = ∫<sub>S</sub>(j<sub>c</sub> + ∂D/∂t)·dS</p>
</div>
`,
        },
      ],
    },
  ],
};

export default deck9;
