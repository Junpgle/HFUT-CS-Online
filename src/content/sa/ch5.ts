/* 第5章 软件体系结构设计 —— 逐节转录自 课件/第5章 软件体系结构设计.ppt（162 页）；
   MVC 结构图与分类表按渲染图重绘/转录，课件内嵌自测题收录为 quiz 块（原卷未标答案，解析给出课件依据）。 */
import type { SaChapter } from './types';

const ch5: SaChapter = {
  id: 'ch5',
  no: '第5章',
  title: '软件体系结构设计',
  subtitle: '设计模式（GoF 23 + 七个模式详解） · 五种 SA 设计方法 · 六阶段设计过程',
  lede:
    '<p>每个工程师都希望做设计工作，因为这里有「创造性」——客户需求、业务要求和技术限制都在某个产品或系统中得到集中的体现。「设计」是最充分展现工程师个人价值的工作：设计 = 天才 + 创造力。什么是设计？设计是你身处两个世界——技术世界和人类的目标世界——而你尝试将这两个世界结合在一起。（Mitch Kapor，《软件设计宣言》）</p><p>软件设计：为问题域的外部可见行为的规约增添实际的计算机系统实现所需的细节，包括关于人机交互、任务管理和数据管理的细节。——Coad/Yourdon</p>',
  toc: [
    { id: 'sec-sa5-intro', text: '引言：软件设计与基于模式的软件设计', level: 2 },
    { id: 'sec-sa5-pattern', text: '5.1 设计模式', level: 2 },
    { id: 'sec-sa5-pattern-h1', text: '5.1.1 设计模式概述', level: 3 },
    { id: 'sec-sa5-pattern-h2', text: '5.1.2 设计模式的组成', level: 3 },
    { id: 'sec-sa5-pattern-h3', text: '5.1.3 模式和软件体系结构', level: 3 },
    { id: 'sec-sa5-pattern-h4', text: '5.1.4 设计模式分类', level: 3 },
    { id: 'sec-sa5-cases', text: '补充材料：典型设计模式详解', level: 2 },
    { id: 'sec-sa5-method', text: '5.2 设计方法', level: 2 },
    { id: 'sec-sa5-process', text: '5.3 设计过程', level: 2 },
    { id: 'sec-sa5-hw', text: '本章作业与思考题', level: 2 },
  ],
  sections: [
    {
      id: 'sec-sa5-intro',
      heading: '引言：软件设计与基于模式的软件设计',
      blocks: [
        {
          type: 'html',
          html: `
            <p><em>课件图示：软件设计在 SE 中所处的位置——软件需求分析（What do to? To what degree?）→ 需求规格说明 SRS → 软件设计（How to do? How to reach the degree?）→ 设计文档 → 软件编码；软件设计：将用户需求准确的转化为软件设计模型与文档的方法。</em></p>
            <p><strong>软件设计的两大阶段（从工程管理的角度看）</strong>：</p>
            <ul>
              <li><strong>概要设计</strong>：将软件需求转化为数据结构和软件的系统结构；</li>
              <li><strong>详细设计</strong>：即构件设计，通过对软件结构表示进行细化，得到软件的详细的数据结构和算法。</li>
            </ul>
            <p><strong>基于模式的软件设计</strong>：</p>
            <ul>
              <li><strong>模式</strong>：特定问题的解决方案；</li>
              <li><strong>体系结构模式</strong>：定义软件的整体结构，体现了子系统和软件构件之间的关系，并定义了说明体系结构元素（类、包、构件、子系统）之间关系的规则；</li>
              <li><strong>设计模式</strong>：这些模式解决设计中特有的元素，例如解决某些设计问题中的构件聚集、构件间的联系或影响构件到构件之间通信的机制；</li>
              <li><strong>框架</strong>：已实现的特定的骨架基础设施，提供了基础功能，并规定了构件及构件的连接方式。开发者只需要将注意力集中于业务逻辑的实现。</li>
            </ul>`,
        },
      ],
    },
    {
      id: 'sec-sa5-pattern',
      heading: '5.1 设计模式',
      blocks: [
        {
          type: 'html',
          html: `
            <h3 id="sec-sa5-pattern-h1">5.1.1 设计模式概述</h3>
            <p><strong>模式的诞生</strong>：模式起源于建筑业而非软件业。模式（Pattern）之父——美国加利佛尼亚大学环境结构中心研究所所长 Christopher Alexander 博士。《A Pattern Language: Towns, Buildings, Construction》——253 个建筑和城市规划模式。模式的三要素：</p>
            <ul>
              <li><strong>Context</strong>（模式可适用的前提条件）；</li>
              <li><strong>Theme 或 Problem</strong>（在特定条件下要解决的目标问题）；</li>
              <li><strong>Solution</strong>（对目标问题求解过程中各种物理关系的记述）。</li>
            </ul>
            <p>Alexander 给出了模式的经典定义：<strong>每个模式都描述了一个在我们的环境中不断出现的问题，然后描述了该问题的解决方案的核心，通过这种方式，我们可以无数次地重用那些已有的解决方案，无需再重复相同的工作。</strong>A pattern is a solution to a problem in a context——模式是在特定环境中解决问题的一种方案。</p>
            <p><strong>软件模式</strong>：1990 年，软件工程界开始关注 Christopher Alexander 等在住宅、公共建筑与城市规划领域的重大突破。最早将该模式的思想引入软件工程方法学的是 1991-1992 年以「四人组（Gang of Four，GoF，分别是 Erich Gamma, Richard Helm, Ralph Johnson 和 John Vlissides）」自称的四位著名软件工程学者，他们在 1994 年归纳发表了 <strong>23 种</strong>在软件开发中使用频率较高的设计模式，旨在用模式来统一沟通面向对象方法在分析、设计和实现间的鸿沟。</p>
            <p>《Design Patterns: Elements of Reusable Object-Oriented Software》（中文版：《设计模式：可复用面向对象软件的基础》，李英军等译，机械工业出版社，2000 年）：它将设计模式的思想应用于软件设计；它描述了收录和描述设计模式的一个结构；它收录了 23 个模式；它在这些模式的基础上提出了面向对象策略及方法的原则。</p>
            <p><strong>设计模式的发展</strong>：1987 年，Kent Beck 和 Ward Cunningham 借鉴 Alexander 的模式思想在程序开发中开始应用一些模式，在 OOPSLA 会议上发表了他们的成果。1990 年，OOPSLA 与 ECOOP 联合举办，Erich Gamma 和 Richard Helm 等人开始讨论有关模式的话题（Bruce Anderson 主持），「四人组」正式成立，并开始着手进行设计模式的分类整理工作。1991 年，OOPSLA，Bruce Anderson 主持了首次针对设计模式的研讨会。1992 年，OOPSLA，Anderson 再度主持研讨会，模式已经逐渐成为人们讨论的话题。1993 年，Kent Beck 和 Grady Booch 赞助了第一次关于设计模式的会议，这个设计模式研究组织发展成为著名的 Hillside Group 研究组。1994 年，由 Hillside Group 发起，在美国伊利诺伊州（Illinois）的 Allerton Park 召开了第 1 届关于面向对象模式的世界性会议，名为 PLoP（Pattern Languages of Programs，编程语言模式会议），简称 PLoP'94。1995 年，PLoP'95 仍在伊利诺伊州的 Allerton Park举行，「四人组」出版了《设计模式：可复用面向对象软件的基础》一书，本书成为 1995 年最抢手的面向对象书籍，也成为设计模式的经典书籍。从 1995 年至今，设计模式在软件开发中得以广泛应用，在 Sun 的 Java SE/Java EE 平台和 Microsoft 的 .NET 平台设计中就应用了大量的设计模式；诞生了越来越多的与设计模式相关的书籍和网站，设计模式也作为一门独立的课程或作为软件体系结构等课程的重要组成部分出现在国内外研究生和大学教育的课堂上。（注：OOPSLA，面向对象编程、系统、语言和应用大会，编程语言及软件工程国际顶级会议，2010 年改为 SPLASH。）</p>
            <p><strong>模式实例——MVC（Model-View-Controller）</strong>：在人机界面软件时，要求人机界面容易修改（包括运行期间），应用程序的核心代码不受影响。解决策略：将<strong>处理（Model）、输出（View）和输入（Controller）</strong>划分开。</p>
            <figure class="fig">
              <svg viewBox="0 0 640 400" role="img" aria-label="MVC 模式三类对象及其交互">
                <g class="tx tx-sm" fill="var(--ink)">
                  <ellipse cx="140" cy="95" rx="108" ry="62" fill="none" stroke="var(--ink-2)" stroke-width="1.5"/>
                  <text x="140" y="70" text-anchor="middle" font-weight="700">视图（View）</text>
                  <text x="140" y="92" text-anchor="middle">解释模型；</text>
                  <text x="140" y="110" text-anchor="middle">向控制器转发用户输入</text>
                  <ellipse cx="500" cy="95" rx="112" ry="62" fill="none" stroke="var(--ink-2)" stroke-width="1.5"/>
                  <text x="500" y="62" text-anchor="middle" font-weight="700">模型（Model）</text>
                  <text x="500" y="84" text-anchor="middle">封装应用程序状态；</text>
                  <text x="500" y="102" text-anchor="middle">响应状态查询；</text>
                  <text x="500" y="120" text-anchor="middle">通知视图改变</text>
                  <ellipse cx="320" cy="315" rx="128" ry="58" fill="none" stroke="var(--ink-2)" stroke-width="1.5"/>
                  <text x="320" y="300" text-anchor="middle" font-weight="700">控制器（Controller）</text>
                  <text x="320" y="322" text-anchor="middle">定义用户行为；</text>
                  <text x="320" y="340" text-anchor="middle">选择与功能相对应的视图</text>
                </g>
                <g stroke-width="1.5" fill="none">
                  <line x1="248" y1="95" x2="386" y2="95" stroke="var(--ink-2)"/>
                  <path d="M386 95 l-9 -4 v8 z" fill="var(--ink-2)" stroke="none"/>
                  <line x1="452" y1="162" x2="212" y2="162" stroke="var(--hot)"/>
                  <path d="M212 162 l9 -4 v8 z" fill="var(--hot)" stroke="none"/>
                  <line x1="262" y1="252" x2="172" y2="160" stroke="var(--ink-2)"/>
                  <path d="M172 160 l1 10 7 -6 z" fill="var(--ink-2)" stroke="none"/>
                  <line x1="376" y1="252" x2="466" y2="160" stroke="var(--ink-2)"/>
                  <path d="M466 160 l-8 7 -2 -9 z" fill="var(--ink-2)" stroke="none"/>
                  <line x1="196" y1="238" x2="262" y2="330" stroke="var(--hot)" stroke-dasharray="none"/>
                  <path d="M262 330 l-10 -2 6 -8 z" fill="var(--hot)" stroke="none"/>
                </g>
                <g class="tx tx-sm" fill="var(--ink-2)">
                  <text x="317" y="86" text-anchor="middle">4：状态查询</text>
                  <text x="332" y="152" text-anchor="middle">5：通知改变</text>
                  <text x="196" y="205" text-anchor="middle">2：视图选择</text>
                  <text x="446" y="205" text-anchor="middle">3：状态改变</text>
                  <text x="150" y="300" text-anchor="middle">1：用户请求</text>
                </g>
                <g class="tx tx-sm">
                  <line x1="470" y1="368" x2="510" y2="368" stroke="var(--ink-2)" stroke-width="1.5"/>
                  <text x="516" y="372" fill="var(--ink-2)">方法调用</text>
                  <line x1="470" y1="386" x2="510" y2="386" stroke="var(--hot)" stroke-width="1.5"/>
                  <text x="516" y="390" fill="var(--ink-2)">事件</text>
                </g>
              </svg>
              <p class="fig-cap">MVC 模式（依课件原图重绘）：三类对象之间的交互顺序为 1 用户请求 → 2 视图选择 → 3 状态改变 → 4 状态查询 → 5 通知改变。</p>
            </figure>
            <p><strong>MVC 模式</strong>：</p>
            <ul>
              <li><strong>1. 模型对象</strong>：模型对象独立于外在显示内容和形式，代表应用领域中的业务实体和业务规则，是整个模型的核心。模型对象的变化通过事件处理通知视图和控制器对象。</li>
              <li><strong>2. 视图对象</strong>：视图对象代表 GUI 对象，并且以用户需要的格式表示模型状态，是交互系统与外界的接口。视图对象可以包含子视图，子视图用于显示模型的不同部分。通常，每个视图对象对应一个控制器对象。</li>
              <li><strong>3. 控制器对象</strong>：控制器对象代表鼠标和键盘事件。它处理用户的输入行为并给模型发送业务事件，再将业务事件解析为模型应执行的动作；同时，模型的更新与修改也将通过控制器来通知视图，从而保持各个视图与模型的一致性。</li>
              <li><strong>MVC 的处理过程</strong>：首先控制器接收用户的请求，并决定应该调用哪个模型来进行处理；然后模型用业务逻辑来处理用户的请求并返回数据；最后控制器用相应的视图格式化模型返回的数据，并通过表示层呈现给用户。其中，模型是核心数据和功能，视图只关心显示数据，控制只关心用户输入，这种结构由于将数据和业务规则从表示层分开，因此可以最大化地重用代码。</li>
            </ul>
            <p><em>课件图示：ASP.NET MVC 与 Java EE MVC 的框架图示。</em></p>
            <p><strong>SA 模式定义</strong>：描述了在特定设计语境中重复再现的设计问题，并为之提供一个经过充分验证了的通用解决方案。该方案提供了构件、构件的责任、构件之间的关系、以及它们之间的协作方式。</p>
            <p><strong>模式的特点</strong>：一个模式关注一个在特定设计语境中设计问题的重复出现；一个模式为特定的问题提供一个特定的解决方案；模式用文档记录下了经过充分验证了的设计经验；模式所处的抽象层次（单个类、实例、或构件层次）是明确的；模式设计提供了一种公共的词汇和理解；模式是软件体系结构建立文档的一种手段；模式通过支持软件的功能属性和质量属性来构造软件；模式有助于建立一个复杂的和异构的软件体系结构；模式有助于管理软件的复杂度。</p>
            <p><strong>模式的优势</strong>：促进设计复用；带来巨大的代码复用；系统组成更易于被他人理解；有利于系统的互操作性；模式的存在，有利于 SA 的分析；有利于特定模式 SA 的可视化；……</p>
            <p><strong>模式分类（模式类别）</strong>：根据模式的抽象范围和规模，将模式分为——<strong>低层模式：惯用法（idiom）</strong>，其特点：是与具体语言密切相关的编程经验的总结；描述如何使用给定的语言特征来实现构件的特定方面及其关系；代表最底层的模式；惯用法更关注设计的实现；可能是一种特定设计模式的具体实现。<strong>中层模式：设计模式（design pattern）</strong>。<strong>高层模式：体系结构模式（architecture pattern）</strong>——SA 模式是模式系统中的最高等模式，描述了软件系统基本结构的组织方案，用在粗粒度设计的开始阶段。SA 模式（Dwayne E. Perry, Alexander L. Wolf）：根据系统的结构组织定义了软件系统族、以及构成系统族的构件之间的关系。它们是通过构件应用的限制和构件的组织与设计规则来确定和表现的。</p>
            <p><strong>SA 模式与 SA 风格的区别</strong>：Mary Shaw 和 David Garlan 认为：<strong>软件体系结构风格 = 软件体系结构模式</strong>。</p>
            <p><strong>为什么我们要使用设计模式？</strong>设计模式帮助你从别人的成功经验而不是你自己的失败那里学到更多东西。——Mark Johnson。设计模式提供了一种共享经验的方式，可以使团体受益和避免不断的重复发明。</p>
            <h3 id="sec-sa5-pattern-h2">5.1.2 设计模式的组成</h3>
            <p>设计模式的基本成分：<strong>模式名称、问题、解决方案、效果</strong>。</p>
            <ul>
              <li><strong>模式名称（pattern name）</strong>：一个助记名，它用一两个词来描述模式的问题、解决方案和效果。命名一个新的模式增加了我们的设计词汇。设计模式允许我们在较高的抽象层次上进行设计。基于一个模式词汇表，我们自己以及同事之间就可以讨论模式并在编写文档时使用它们。模式名可以帮助我们思考，便于我们与其他人交流设计思想及设计结果。找到恰当的模式名也是我们设计模式编目工作的难点之一。</li>
              <li><strong>问题（problem）</strong>：描述了应该在何时使用模式。它解释了设计问题和问题存在的前因后果，它可能描述了特定的设计问题，如怎样用对象表示算法等，也可能描述了导致不灵活设计的类或对象结构。有时候，问题部分会包括使用模式必须满足的一系列先决条件。</li>
              <li><strong>解决方案（solution）</strong>：描述了设计的组成成分，它们之间的相互关系及各自的职责和协作方式。因为模式就像一个模板，可应用于多种不同场合，所以解决方案并不描述一个特定而具体的设计或实现，而是提供设计问题的抽象描述和怎样用一个具有一般意义的元素组合（类或对象组合）来解决这个问题。</li>
              <li><strong>效果（consequences）</strong>：描述了模式应用的效果及使用模式应权衡的问题。尽管我们描述设计决策时，并不总提到模式效果，但它们对于评价设计选择和理解使用模式的代价及好处具有重要意义。软件效果大多关注对时间和空间的衡量，它们也表述了语言和实现问题。因为复用是面向对象设计的要素之一，所以模式效果包括它对系统的灵活性、扩充性或可移植性的影响，显式地列出这些效果对理解和评价这些模式很有帮助。</li>
            </ul>
            <p><strong>描述设计模式</strong>：为了达到设计复用，必须同时记录设计产生的决定过程、选择过程和权衡过程。具体的例子也是很重要的，它们让你看到实际的设计。将用统一的格式描述设计模式，每一个模式根据以下的模板被分为若干部分：</p>
            <ol>
              <li><strong>模式名和分类</strong>：模式名简洁地描述了模式的本质。一个好的名字非常重要，因为它将成为你的设计词汇表中的一部分。</li>
              <li><strong>意图</strong>：是回答下列问题的简单陈述——设计模式是做什么的？它的基本原理和意图是什么？它解决的是什么样的特定设计问题？</li>
              <li><strong>别名</strong>：模式的其他名称。</li>
              <li><strong>动机</strong>：用以说明一个设计问题以及如何用模式中的类、对象来解决该问题的特定情景。该情景会帮助你理解随后对模式更抽象的描述。</li>
              <li><strong>适用性</strong>：什么情况下可以使用该设计模式？该模式可用来改进哪些不良设计？你怎样识别这些情况？</li>
              <li><strong>结构</strong>：采用基于对象建模技术（OMT）的表示法对模式中的类进行图形描述。我们也使用了交互图来说明对象之间的请求序列和协作关系。</li>
              <li><strong>参与者</strong>：指设计模式中的类和/或对象以及它们各自的职责。</li>
              <li><strong>协作</strong>：模式的参与者怎样协作以实现它们的职责。</li>
              <li><strong>效果</strong>：模式怎样支持它的目标？使用模式的效果和所需做的权衡取舍？系统结构的哪些方面可以独立改变？</li>
              <li><strong>实现</strong>：实现模式时需要知道的一些提示、技术要点及应避免的缺陷，以及是否存在某些特定于实现语言的问题。</li>
              <li><strong>代码示例</strong>：用来说明怎样用 C++ 或 Smalltalk 实现该模式的代码片段。</li>
              <li><strong>已知应用</strong>：实际系统中发现的模式的例子。每个模式至少包括了两个不同领域的实例。</li>
              <li><strong>相关模式</strong>：与这个模式紧密相关的模式有哪些？其间重要的不同之处是什么？这个模式应与哪些其他模式一起使用？</li>
            </ol>
            <h3 id="sec-sa5-pattern-h3">5.1.3 模式和软件体系结构</h3>
            <p>模式是否取得成功的重要准则取决于多大程度达到了软件工程的目标。模式必须支持复杂的、大规模系统的开发、维护以及演化。模式作为体系结构构造块涉及：<strong>构造异构体系结构、模式和方法、实现模式</strong>。</p>
            <h3 id="sec-sa5-pattern-h4">5.1.4 设计模式分类</h3>
            <p>根据两条准则对模式进行分类。<strong>目的</strong>，即模式是用来完成什么工作的：<strong>创建型（Creational）</strong>——与对象的创建有关，以灵活的方式创建对象的集合；<strong>结构型（Structural）</strong>——处理类或对象的组合，代表相关对象的集合；<strong>行为型（Behavioral）</strong>——对类或对象怎样交互和怎样分配职责进行描述，在对象集合中捕获行为。<strong>范围</strong>，指定模式主要是用于类还是用于对象：<strong>类模式</strong>处理类和子类之间的关系，这些关系通过继承建立，是静态的，在编译时刻便确定下来了；<strong>对象模式</strong>处理对象间的关系，这些关系在运行时刻是可以变化的，更具动态性。从某种意义上来说，几乎所有模式都使用继承机制，所以「类模式」只指那些集中于处理类间关系的模式，而大部分模式都属于对象模式的范畴。</p>
            <table class="tbl">
              <thead><tr><th rowspan="2">范围 \ 目的</th><th>创建型（5）</th><th>结构型（7）</th><th>行为型（11）</th></tr></thead>
              <tbody>
                <tr>
                  <td><strong>类</strong></td>
                  <td>Factory Method（工厂方法）</td>
                  <td>Adapter（适配器）</td>
                  <td>Interpreter（解释器）<br/>Template Method（模板方法）</td>
                </tr>
                <tr>
                  <td><strong>对象</strong></td>
                  <td>Abstract Factory（抽象工厂）<br/>Builder（生成器）<br/>Prototype（原型）<br/>Singleton（单件）</td>
                  <td>Adapter（适配器）<br/>Bridge（桥接）<br/>Composite（组合）<br/>Decorator（装饰）<br/>Façade（外观）<br/>Flyweight（享元）<br/>Proxy（代理）</td>
                  <td>Chain of Responsibility（职责链）<br/>Command（命令）<br/>Iterator（迭代器）<br/>Mediator（中介者）<br/>Memento（备忘录）<br/>Observer（观察者）<br/>State（状态）<br/>Strategy（策略）<br/>Visitor（访问者）</td>
                </tr>
              </tbody>
            </table>
            <p><strong>设计模式目录</strong>（23 个模式的意图）：</p>
            <ul>
              <li><strong>Abstract Factory（抽象工厂）</strong>：提供一个创建一系列相关或相互依赖对象的接口，而无需指定它们具体的类。</li>
              <li><strong>Adapter（适配器）</strong>：将一个类的接口转换成客户希望的另外一个接口。Adapter 模式使得原本由于接口不兼容而不能一起工作的那些类可以一起工作。</li>
              <li><strong>Bridge（桥）</strong>：将抽象部分与它的实现部分分离，使它们都可以独立地变化。</li>
              <li><strong>Builder（生成器）</strong>：将一个复杂对象的构建与它的表示分离，使得同样的构建过程可以创建不同的表示。</li>
              <li><strong>Chain of Responsibility（职责链）</strong>：为解除请求的发送者和接收者之间耦合，而使多个对象都有机会处理这个请求。将这些对象连成一条链，并沿着这条链传递该请求，直到有一个对象处理它。</li>
              <li><strong>Command（命令）</strong>：将一个请求封装为一个对象，从而使你可用不同的请求对客户进行参数化；对请求排队或记录请求日志，以及支持可取消的操作。</li>
              <li><strong>Composite（组合）</strong>：将对象组合成树形结构以表示「部分-整体」的层次结构。Composite 使得客户对单个对象和复合对象的使用具有一致性。</li>
              <li><strong>Decorator（装饰）</strong>：动态地给一个对象添加一些额外的职责。就扩展功能而言，Decorator 模式比生成子类方式更为灵活。</li>
              <li><strong>Façade（外观）</strong>：为子系统中的一组接口提供一个一致的界面，Façade 模式定义了一个高层接口，这个接口使得这一子系统更加容易使用。</li>
              <li><strong>Factory Method（工厂方法）</strong>：定义一个用于创建对象的接口，让子类决定将哪一个类实例化。Factory Method 使一个类的实例化延迟到其子类。</li>
              <li><strong>Flyweight（享元）</strong>：运用共享技术有效地支持大量细粒度的对象。</li>
              <li><strong>Interpreter（解释器）</strong>：给定一个语言，定义它的文法的一种表示，并定义一个解释器，该解释器使用该表示来解释语言中的句子。</li>
              <li><strong>Iterator（迭代器）</strong>：提供一种方法顺序访问一个聚合对象中各个元素，而又不需暴露该对象的内部表示。</li>
              <li><strong>Mediator（中介者）</strong>：用一个中介对象来封装一系列的对象交互。中介者使各对象不需要显式地相互引用，从而使其耦合松散，而且可以独立地改变它们之间的交互。</li>
              <li><strong>Memento（备忘录）</strong>：在不破坏封装性的前提下，捕获一个对象的内部状态，并在该对象之外保存这个状态。这样以后就可将该对象恢复到保存的状态。</li>
              <li><strong>Observer（观察者）</strong>：定义对象间的一种一对多的依赖关系，以便当一个对象的状态发生改变时，所有依赖于它的对象都得到通知并自动刷新。</li>
              <li><strong>Prototype（原型）</strong>：用原型实例指定创建对象的种类，并且通过拷贝这个原型来创建新的对象。</li>
              <li><strong>Proxy（代理）</strong>：为其他对象提供一个代理以控制对这个对象的访问。</li>
              <li><strong>Singleton（单件）</strong>：保证一个类仅有一个实例，并提供一个访问它的全局访问点。</li>
              <li><strong>State（状态）</strong>：允许一个对象在其内部状态改变时改变它的行为。对象看起来似乎修改了它所属的类。</li>
              <li><strong>Strategy（策略）</strong>：定义一系列的算法，把它们一个个封装起来，并且使它们可相互替换。本模式使得算法的变化可独立于使用它的客户。</li>
              <li><strong>Template Method（模板方法）</strong>：定义一个操作中的算法的骨架，而将一些步骤延迟到子类中。Template Method 使得子类可以不改变一个算法的结构即可重定义该算法的某些特定步骤。</li>
              <li><strong>Visitor（访问者）</strong>：表示一个作用于某对象结构中的各元素的操作。它使你可以在不改变各元素的类的前提下定义作用于这些元素的新操作。</li>
            </ul>`,
        },
        {
          type: 'quiz',
          quiz: {
            kind: 'single',
            question: '常用的基本设计模式可分为（　）',
            options: ['创建型、结构型和行为型', '对象型、结构型和行为型', '过程型、结构型和行为型', '抽象型、接口型和实现型'],
            answer: 'A',
            explanation: '按「目的」准则，模式分为创建型（Creational）、结构型（Structural）与行为型（Behavioral）三类，对应课件 5.1.4 节的设计模式分类表。',
            note: '本题为课件内嵌自测题（原卷未标答案），答案由课件原文推断。',
          },
        },
        {
          type: 'quiz',
          quiz: {
            kind: 'single',
            question: '以下哪个模式是利用一个对象，快速地生成一批对象（　）',
            options: ['抽象工厂（Abstract Factory）模式', '组合（Composite）模式', '原型（Prototype）模式', '桥接（Bridge）模式'],
            answer: 'C',
            explanation:
              '原型模式的意图是「用原型实例指定创建对象的种类，并且通过拷贝这个原型来创建新的对象」——即利用一个对象（原型）快速克隆出一批对象，故选 C。抽象工厂负责创建对象族，组合表示部分-整体层次，桥接分离抽象与实现。',
            note: '本题为课件内嵌自测题（原卷未标答案），答案由课件原文推断。',
          },
        },
      ],
    },
    {
      id: 'sec-sa5-cases',
      heading: '补充材料：典型设计模式详解',
      blocks: [
        {
          type: 'html',
          html: `
            <h3 id="sec-sa5-cases-h1">抽象工厂（Abstract Factory）</h3>
            <p><strong>(1) 目的</strong>：提供一个接口用以创建一个相联系或相依赖的对象族，而无须指定它们的具体类。</p>
            <p><strong>(2) 思路</strong>：例如，在创建可支持多种 GUI 标准（如 Motif 和 Presentation Manager）的绘图用户界面工具包时，因为不同的 GUI 标准会定义出不同外观及行为的「用户界面组件」（widget），如滚动条、按钮、视窗等。为了能够囊括各种 GUI 标准，应用程序不能把组件写死，不能限制到特定 GUI 风格的组件类，否则日后很难换成其他 GUI 风格的组件。解决方法是：先定义一个抽象类 WidgetFactory（用斜体字区分抽象类），这个类声明了创建各种基本组件的接口，再逐一替各种基本组件定义相对应的抽象类，如 ScrollBar、Window 等，让它们的具体子类来真正实现特定的 GUI 标准。</p>
            <p><em>课件图示：可支持多种 GUI 标准的绘图用户界面工具包的结构图，以及抽象工厂模式的结构图。</em></p>
            <p><strong>C++ 代码示例</strong>：</p>
            <pre class="code">class WidgetFactory {            // 抽象工厂: 窗口构件接口
public:
    virtual CreateScrollBar() = 0;    // 创建滚动条
    virtual CreateWindow() = 0;       // 创建窗口
};
class MotifWidgetFactory : public WidgetFactory {
public:
    MotifWidgetFactory() { …实现略… };
    CreateScrollBar() { …实现略… };
    CreateWindow() { …实现略… };
};
class PMWidgetFactory : public WidgetFactory {
public:
    PMWidgetFactory() { …实现略… };
    CreateScrollBar() { …实现略… };
    CreateWindow() { …实现略… };
};
class ScrollBar {                                   // 滚动条抽象类
public:
    ScrollBar() {};
    virtual void CreateScrollBarInstance(ScrollBar&amp; *) = 0;
    virtual void displayScrollBar() = 0;
};
class MotifScrollBar : public ScrollBar {           // Motif 滚动条具体子类
public:
    MotifScrollBar() { …实现略… };
    void CreateScrollBarInstance(MotifScrollBar&amp; *s) {
        MotifWidgetFactory *t;   s = t-&gt;CreateScrollBar();
    }
};
class PMScrollBar : public ScrollBar {              // PM 滚动条具体子类
public:
    PMScrollBar() { …实现略… };
    void CreateScrollBarInstance(PMScrollBar&amp; *) {
        PMWidgetFactory *t;   s = t-&gt;CreateScrollBar();
    }
};
class Window {                                      // 窗口抽象类
public:
    Window() {};
    virtual void CreateWindowInstance(Window&amp; *) = 0;
};
class MotifWindow : public Window {                 // Motif 窗口具体子类
public:
    MotifWindow() { …实现略… };
    void CreateWindowInstance(MotifWindow&amp; *s) {
        MotifWidgetFactory *t;   s = t-&gt;CreateWindow();
    }
};
class PMWindow : public Window {                    // PM 窗口具体子类
public:
    PMWindow() { …实现略… };
    void CreateWindowInstance(PMWindow&amp; *) {
        PMWidgetFactory *t;   s = t-&gt;CreateWindow();
    }
};
class Factory {
public:
    ScrollBar *getScrollBarInstance(int type) {
        switch (type) {
            case 0: MotifScrollBar *s;   CreateScrollBarInstance(s);
                    return s;   break;
            case 1: PMScrollBar *s;    CreateScrollBarInstance(s);
                    return s;   break;
            default: return NULL;
        }
    }
    Window *getWindowInstance(int type) {
        switch (type) {
            case 0: MotifWindow *w;   CreateWindowInstance(w);
                    return w-&gt;displayWindow();   break;
            case 1: PMWindow *w;   CreateWindowInstance(w);
                    return w-&gt;displayWindow();
            default: return NULL;
        }
    }
};
void main(int argc, char *argv[]) {
    if (argc != 3) {
        cout&lt;&lt;"error parameters"&lt;&lt;endl;  return;
    }
    int type = atoi(argv[1]), widget = atoi(argv[2]):
        /* 参数 type 选择 GUI 标准，widget 选择图元 */
    Factory factory;
    if (widget == 0) {                    // 图元为滚动条
        ScrollBar *s = factory.getScrollBarInstance(type);
        if (s == NULL) { cout&lt;&lt;"error get the instance!"&lt;&lt;end;  return; }
    } else {                              // 否则，图元为窗口
        Window *w = factory.getWindowInstance(type);
        if (w == NULL) { cout&lt;&lt;"error get the instance!"&lt;&lt;end;  return; }
    }
}</pre>
            <p>每一种 GUI 标准都有各自的 WidgetFactory 的具体子类，其操作会建立适当的 GUI 组件。例如，MotifWidgetFactory 的 CreateScrollBar() 操作会建立和传送一个 Motif 式的滚动条，PMWidgetFactory 的同一操作则会建立 Presentation Manager 式的滚动条。客户程序只需通过 WidgetFactory 的接口，不必知道幕后到底是什么类在运作——就是说，客户程序仅针对抽象类的接口编写，而不是针对特定的具体类。WidgetFactory 也规范了与基本窗口组件类之间的依赖关系。例如，通过 MotifWidgetFactory 的居中运作，Motif 式的滚动条只能与 Motif 式的按钮、Motif 式的窗口搭配使用。</p>
            <p><strong>适用性</strong>——在以下情况下使用抽象工厂模式：当一个系统要独立于它的产品的创建、组合和表达时；当一个系统要由多个产品标准中的一个来配置时；当一整族相关的对象必须一块儿使用，你又得确保不会搭配错误时；当你提供类库，但只想提供接口而不是实现时。</p>
            <p><em>课件图示：抽象工厂模式 Java 实现示例（Shape/Color 接口、Rectangle/Square/Circle 与 Red/Green/Blue 实体类、AbstractFactory 抽象类、ShapeFactory/ColorFactory 工厂类、FactoryProducer 生成器与 AbstractFactoryPatternDemo 演示类，按步骤 1～8 组织）。</em></p>
            <p><strong>(3) 结构</strong>：抽象工厂模式的结构如图所示。<strong>(4) 参与者职责</strong>：a) <strong>抽象工厂类（AbstractFactory）</strong>——声明创建抽象产品对象的操作的接口；b) <strong>具体工厂类（ConcreteFactory）</strong>——实现产生具体产品对象的操作；c) <strong>抽象产品类（AbstractProduct）</strong>——声明一种产品对象的接口；d) <strong>具体产品类（ConcreteProduct）</strong>——定义将被相应的具体工厂类产生的产品对象，并实现抽象产品类接口；e) <strong>客户（Client）</strong>——仅使用由抽象工厂类和抽象产品类声明的接口。<strong>(5) 协作</strong>：在执行时，AbstractFactory 将产品交给 ConcreteFactory 创建。ConcreteFactory 类的实例只有一个，专门针对某种特定的实现标准，建立具体可用的产品对象。如果想要建立其他标准的产品对象，客户程序就得改用另一种 ConcreteFactory。</p>
            <h3 id="sec-sa5-cases-h2">单件（Singleton）</h3>
            <p><strong>(1) 目的</strong>：一个类只有一个实例并提供一个访问它的全局访问点。该实例应在系统生存期中都存在。</p>
            <p><strong>(2) 思路</strong>：例如，通常情况下，用户可以对应用系统进行配置，并将配置信息保存在配置文件中，应用系统在启动时首先将配置文件加载到内存中，这些内存配置信息应该有且仅有一份。应用单件模式可以保证 Configure 类只能有一个实例。</p>
            <p><em>课件图示：单件模式的结构图。</em><strong>(4) 参与者职责</strong>：a) <strong>单件（Singleton）</strong>——能够创建它唯一的实例；同时定义了一个 Instance 操作，允许外部存取它唯一的实例。Instance 是一个静态成员函数。<strong>(5) 协作</strong>：客户只能通过 Singleton 的 Instance() 存取这唯一的实例。</p>
            <h3 id="sec-sa5-cases-h3">外观（Façade）</h3>
            <p><strong>(1) 目的</strong>：给子系统中的一组接口提供一套统一的高层界面，使得子系统更容易使用。</p>
            <p><strong>(2) 思路</strong>：将系统划分为若干子系统，虽然可以降低整体的复杂性，但还需设法降低子系统之间的通信和相互的依赖性。一种方法就是引进一个外观（facade）对象，为子系统内各种设施提供一个简单的单一界面。</p>
            <p><em>课件图示：外观模式的结构图。</em><strong>(4) 参与者职责</strong>：a) <strong>外观（Façade）</strong>——知道子系统中哪个类负责处理哪种信息；并负责把外界输入的信息转交给适当的子系统对象；b) <strong>子系统中的类（subsystem classes）</strong>——实现子系统的功能；处理 Facade 对象分派的工作；如果不受 Facade 的控制，则也不会有返回 Facade 的引用存在。<strong>(5) 协作</strong>：使用 Facade 的客户不用直接访问子系统对象。外界想与子系统交互时，把信息传送给 Facade，Facade 再把这些信息转交给适当的子系统对象。虽然实际处理工作是子系统对象在做，但 Facade 会居中做接口转换工作。</p>
            <h3 id="sec-sa5-cases-h4">适配器（Adapter）</h3>
            <p><strong>(1) 目的</strong>：适配器模式将一个类的接口转换为客户期望的另一种接口，使得原本不匹配的接口而无法合作的类可以一起工作。</p>
            <p><strong>(2) 思路</strong>：有时要将两个没有关系的类组合在一起使用，一种解决方案是修改各自类的接口，另一种办法是使用 Adapter 模式，在两种接口之间创建一个混合接口。例如，设有一个图形编辑器，可画直线、多边形、文本等。它的接口定义成抽象类 Shape，它的子类负责画各种图形。此外，还有一个外购的 GUI 软件包 TextView，用于显示，但它没有 Shape 功能。如何让 TextView 的接口转换成为 Shape 的接口，有两种方法：让 TextShape 同时继承 Shape 的接口和 TextView 的服务（多重继承）；在 TextShape 中建立 TextView 的实例，再通过 TextView 给出 TextShape 的接口。前者是适配器的类模式，后者是对象模式。</p>
            <p><strong>(3) 结构</strong>：适配器模式有类适配器模式和对象适配器模式。类适配器可以通过多继承方式实现不同接口之间的相容和转换；而一个对象适配器则依赖对象组合的技术实现接口的相容和转换。<em>（课件图示两幅结构图。）</em></p>
            <p><strong>(4) 参与者职责</strong>：a) <strong>目标（Target）</strong>——定义客户使用的与应用领域相关的接口；b) <strong>客户（Client）</strong>——与具有 Target 接口的对象合作；c) <strong>被匹配者（Adaptee）</strong>——需要被转换匹配的一个已存在接口；d) <strong>适配器（Adapter）</strong>——将 Adaptee 的接口与 Target 接口匹配。<strong>(5) 协作</strong>：客户调用 Adapter 对象的操作，然后 Adapter 的操作又调用 Adaptee 对象中负责处理相应请求的操作。</p>
            <h3 id="sec-sa5-cases-h5">责任链（Chain of Responsibility）</h3>
            <p><strong>(1) 目的</strong>：通过一条隐式的对象消息链传递处理请求。该请求沿着这条链传递，直到有一个对象处理它为止。其核心是避免将请求的发送者直接耦合到它的接受者。</p>
            <p><strong>(2) 思路</strong>：以 GUI 系统的联机帮助系统为例。用户可以在软件中任一位置按下 help 键，软件就可以根据该信息和当前上下文环境弹出适当的说明。如果用户在 PrintDialog 对话框里「打印」按钮上按了帮助键，帮助信息的顺序图如图所示。联机帮助系统定义了一个抽象类 HelpHandler 和抽象操作 HandleHelp()，所有想处理信息的类可以继承该类。HelpHandler 的 HandleHelp() 操作的内定做法是把信息传递给后继者去处理，由各个子类分别来实现具体的打印功能。</p>
            <p><em>课件图示：责任链模式的结构图与典型的对象间结构图。</em><strong>(4) 参与者职责</strong>：a) <strong>处理者（Handler）</strong>——定义处理请求的接口；实现对后继者的链接（可选）；b) <strong>具体处理者（ConcreteHandler）</strong>——处理它所负责的请求；可访问它的后继；如果它能够处理请求，就处理该请求，否则将请求传送给后继者；c) <strong>客户（Client）</strong>——将处理请求提交给职责链中的 ConcreteHandler 对象。<strong>(5) 协作</strong>：当 Client 发出请求之后，请求会在责任链中传递，直到有一个 ConcreteHandler 对象能处理为止。</p>
            <h3 id="sec-sa5-cases-h6">中介者（Mediator）</h3>
            <p><strong>(1) 目的</strong>：用一个中介对象来封装一系列复杂对象的交互情景。中介者通过阻止各个对象显式地相互引用来降低它们之间的耦合，使得人们可以独立地改变它们之间的交互。</p>
            <p><strong>(2) 思路</strong>：以 GUI 系统的对话框为例，对话框中会布置许多窗口组件，如按钮、菜单、文字输入栏等。对话框中各窗口组件之间往往相互牵连。为此，可以将这些窗口组件的集体行为封装成一个中介者（mediator）对象。中介者负责居中指挥协调一组对象之间的交互行为，避免互相直接引用。这些对象只认得中介者，因而可降低交互行为的数目。例如，可用 FontDialogDirector 当作对话框内各窗口组件之间的中介者。FontDialogDirector 对象认得所有组件，协调彼此之间的交互，如同一个通信枢纽。<em>（课件图示：描述 mediator 作用的顺序图，以及加入 FontDialogDirector 后的类结构。）</em></p>
            <p><strong>(3) 结构</strong>：图 (a) 给出了中介者的类结构，图 (b) 给出了典型的对象结构。<strong>(4) 参与者职责</strong>：a) <strong>中介者（Mediator）</strong>——定义与各个同事（Colleague）对象通信的接口；b) <strong>具体中介者（ConcreteMediator）</strong>——协调各个同事对象，实现协作行为；了解并维护各个同事对象；c) <strong>同事类（Colleague classes）</strong>——这些同事类的对象都了解中介者；一个同事对象与另一个同事对象之间的通信都需要通过中介者来间接实现。<strong>(5) 协作</strong>：同事向中介者对象发送或接收请求，中介者则将请求传送给适当的同事对象（一个或多个），协调整体行为。</p>
            <h3 id="sec-sa5-cases-h7">观察者（Observer）</h3>
            <p><strong>(1) 目的</strong>：定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都得到通知，并被自动更新。</p>
            <p><strong>(2) 思路</strong>：例如，许多 GUI 软件包都将数据显示部分与应用程序底层的数据表示分开，以利于分别复用。但这些类也能合作，如图所示的计算表和直方图都是针对同一数据对象的两种不同表示方式。</p>
            <p><em>课件图示：Observer 模式的结构图。</em><strong>(4) 参与者职责</strong>：a) <strong>主题（Subject）</strong>——认得它的观察者。任意数目的观察者对象均可订阅一个主题。另外，提供一个连接观察者对象和解除连接的接口；b) <strong>观察者（Observer）</strong>——定义了一个自我更新的接口。一旦发现主题有变时借助接口通知自己随之改变；c) <strong>具体主题（ConcreteSubject）</strong>——存储具体观察者对象关心的状态；当状态改变时向它的观察者发送通知；d) <strong>具体观察者（ConcreteObserver）</strong>——维持一个对具体主题对象的引用；存储要与主题一致的状态；实现观察者的自我更新接口，确保自己的状态与主题的状态一致。<strong>(5) 协作</strong>：当具体主题发生会导致观察者的状态不一致的情况时，就会主动通知所有该通知的观察者。当具体观察者收到通知后，向主题询问，根据所得信息使自己的状态与主题的状态保持一致。课件还给出了一个主题和两个观察者对象之间的交互情况图。</p>
            <h3 id="sec-sa5-cases-h8">怎样使用设计模式</h3>
            <ol>
              <li><strong>大致浏览一遍模式</strong>：特别注意其适用性部分和效果部分，确定它适合你的问题。</li>
              <li><strong>回头研究结构部分、参与者部分和协作部分</strong>：确保你理解这个模式的类和对象以及它们是怎样关联的。</li>
              <li><strong>看代码示例部分，看看这个模式代码形式的具体例子</strong>：研究代码将有助于你实现模式。</li>
              <li><strong>选择模式参与者的名字，使它们在应用上下文中有意义</strong>：设计模式参与者的名字通常过于抽象而不会直接出现在应用中。然而，将参与者的名字和应用中出现的名字合并起来是很有用的。这会帮助你在实现中更显式的体现出模式来。</li>
              <li><strong>定义类</strong>：声明它们的接口，建立它们的继承关系，定义代表数据和对象引用的实例变量。识别模式会影响到的你的应用中存在的类，做出相应的修改。</li>
              <li><strong>定义模式中专用于应用的操作名称</strong>：这里再一次体现出，名字一般依赖于应用。使用与每一个操作相关联的责任和协作作为指导。还有，你的名字约定要一致。例如，可以使用「Create-」前缀统一标记 Factory 方法。</li>
              <li><strong>实现执行模式中责任和协作的操作</strong>：实现部分提供线索指导你进行实现。代码示例部分的例子也能提供帮助。</li>
            </ol>`,
        },
        {
          type: 'quiz',
          quiz: {
            kind: 'single',
            question: '（　）的选择是开发一个软件系统时的基本设计决策。',
            options: ['体系结构模式', '惯用法', '设计模式', '分析模式'],
            answer: 'A',
            explanation:
              '体系结构模式（SA 模式）是模式系统中的最高等模式，描述了软件系统基本结构的组织方案，用在粗粒度设计的开始阶段——故体系结构模式的选择是开发一个软件系统时的基本设计决策。',
            note: '本题为课件内嵌自测题（原卷未标答案），答案由课件原文推断。',
          },
        },
      ],
    },
    {
      id: 'sec-sa5-method',
      heading: '5.2 设计方法',
      blocks: [
        {
          type: 'html',
          html: `
            <h3 id="sec-sa5-method-h1">5.2.1 领域模型驱动的 SA 设计</h3>
            <p><em>课件图示：领域驱动方法的概念模型、领域 SA 设计图示。</em>领域模型有不同的表示：如类、实体关系、框架、语义网络、规则等。DSSA 方法的基本工件（artifact）是：<strong>领域模型、参考需求和参考结构</strong>。DSSA 的领域模型包括场景、领域字典、上下文图、实体关系图、数据流模型、状态转换图和对象模型等。</p>
            <ul>
              <li><strong>通用知识</strong>：软件工程师具有的通用的知识；</li>
              <li><strong>参考需求</strong>：包括功能需求、非功能需求、设计需求、实现需求、解决方案空间；</li>
              <li><strong>参考 SA</strong>：是定义一个应用系统簇的 SA；</li>
              <li><strong>应用 SA</strong>：是单一的一个应用系统的 SA。</li>
            </ul>
            <p><strong>注意问题</strong>：问题领域分析在导出 SA 抽象方面效果较差——领域分析不够充分。原因：如果领域分析的范围太广和领域模型过于巨大，从而妨碍了对 SA 的抽象；如果领域分析的内聚性不强，不够稳定，难以为 SA 的设计提供坚实的基础。</p>
            <h3 id="sec-sa5-method-h2">5.2.2 模式驱动 SA 设计</h3>
            <p>模式驱动（Pattern-Driven）的体系结构设计方法从模式导出体系结构抽象。软件设计模式的目的在于编制一套可重用的基本原则，用于开发高质量的应用系统。体系结构模式类似于设计模式，但它关心更粗粒度的系统结构及其交互。</p>
            <p><em>课件图示：需求规格说明表示问题的规格说明；在通用知识的支持下，在模式的描述下，查找并获得解决问题的 SA 模式；将模式通过组合获得 SA 的描述。</em></p>
            <p><strong>注意问题</strong>：对处理广泛的 SA 问题时，模式库不够充分；对模式的选择仅依靠通用的知识和软件工程师的经验；模式的应用并不是一个简单的直接过程，需要对问题进行全面分析；对模式的组合没有提供良好的支持——模式在定义时并没有表示出模式之间的相关性。</p>
            <h3 id="sec-sa5-method-h3">5.2.3 用例驱动的 SA 设计</h3>
            <p>用例驱动（Use-Case-Driven）的体系结构设计方法主要从用例导出体系结构抽象。一个用例，是指系统进行的一个活动系列，它为参与者提供一些结果值。<strong>用例模型的目的</strong>：作为系统预期功能及其环境的模型，并在客户和开发者之间起到合约的作用。</p>
            <p>在 RUP 中主要从非形式化的规格说明、领域模型和商业模型中导出用例模型。用例模型是需求规格说明的核心部分。在工件和通用知识的支持下，从用例模型中选取对 SA 有重要意义的用例，通过「实现」获得分析和设计模型；在通用知识的支持来通过组合定义包之间的接口；分析和设计模型在通用知识的支持下被分组成包。</p>
            <p><strong>注意问题</strong>：难以适度把握领域模型和商业模型的细节；对于如何选择与 SA 相关的用例没有提供系统的支持；用例没有为 SA 的抽象提供坚实的基础；包的定义过于简单，难以作为 SA 的构件。</p>
            <h3 id="sec-sa5-method-h4">5.2.4 工件驱动的 SA 设计</h3>
            <p>工件驱动（Artifact-Driven）的体系结构设计方法从方法的工件描述中提取体系结构描述。工件驱动的体系结构设计方法的例子包括广为流行的面向对象分析和设计方法 OMT。<em>（课件图示：该方法的概念模型。）</em></p>
            <ul>
              <li><strong>查找</strong>：在软件工程师通用知识和工件的启发式规则的支持下，得到一组工件的实例，该实例用「分析和设计模型」来表示；</li>
              <li>在通用知识的支持下，工件被分组为子系统；</li>
              <li>在通用知识的支持下，子系统被组合为 SA。</li>
            </ul>
            <p><strong>注意问题</strong>：文本形式的系统需求不够精确和完整，所以作为导出 SA 抽象的来源不够；子系统的语义过于简单，且也只是通过分组得到，所以难以作为 SA 的构件；对子系统的组合支持不足，缺乏严格的指导原则。</p>
            <h3 id="sec-sa5-method-h5">5.2.5 属性驱动的 SA 设计</h3>
            <p><em>课件图示：属性驱动的 SA 设计过程图示</em>——其步骤之一为：<strong>3：功能分配到匹配的性能模块上</strong>，如发布-订阅模式决定了一个模块的「发布」模式，其它模块的「订阅」模式。</p>
            <p><strong>注意问题</strong>（课件原文，与 5.2.2 相同）：对处理广泛的 SA 问题时，模式库不够充分；对模式的选择仅依靠通用的知识和软件工程师的经验；模式的应用并不是一个简单的直接过程，需要对问题进行全面分析；对模式的组合没有提供良好的支持。</p>
            <p><em>课件图示：SA 设计的统一模型、SA 演变交付生命周期。</em></p>`,
        },
        {
          type: 'quiz',
          quiz: {
            kind: 'single',
            question: '以下哪项不是描述或确定架构设计模式的一部分？（　）',
            options: ['实施细节', '结构', '责任与协作', '效果'],
            answer: 'A',
            explanation:
              'SA 模式定义提供了一个经过充分验证了的通用解决方案——该方案提供了构件、构件的责任、构件之间的关系、以及它们之间的协作方式；模式的组成还包括效果（consequences）与结构（solution 的组成成分）。「实施细节」不属于模式的描述内容，故选 A。',
            note: '本题为课件内嵌自测题（原卷未标答案），答案由课件原文推断。',
          },
        },
      ],
    },
    {
      id: 'sec-sa5-process',
      heading: '5.3 设计过程',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>SA 的本质</strong>：对软件需求的一种抽象解决方案。引入 SA 后，软件系统的开发过程：<strong>问题定义 → 软件需求 → SA 设计与「开发」 → 软件设计 → 软件实现</strong>。</p>
            <p><em>课件图示：基于已有知识的 SA 设计与开发——需求分析、高层设计、低层设计与用户需求、需求规格说明、系统体系结构、SA 详细设计等成果，借助领域模型库、领域体系结构库、可复用设计件库等已有知识展开。</em></p>
            <p>SA 设计开发过程包括六个阶段：<strong>5.3.1 体系结构需求、5.3.2 体系结构设计、5.3.3 体系结构文档化、5.3.4 体系结构复审、5.3.5 体系结构实现、5.3.6 体系结构演化</strong>。</p>
            <ul>
              <li><strong>5.3.1 体系结构需求</strong>：<em>课件图示 SA 需求的导出与 SA 需求过程。</em></li>
              <li><strong>5.3.2 体系结构设计</strong>：<em>课件图示一种 SA 设计过程</em>——需求获取 → 生成类图 → 把类打包成构件 → 对类进行分组 → 评审 → 体系结构模型（辅以需求库、标识构件）。</li>
              <li><strong>5.3.3 体系结构文档化</strong>：<em>课件图示。</em></li>
              <li><strong>5.3.4 体系结构复审</strong>：<em>课件图示。</em></li>
              <li><strong>5.3.5 体系结构实现</strong>：<em>课件图示体系结构实现过程。</em></li>
              <li><strong>5.3.6 体系结构演化</strong>：<em>课件图示体系结构演化过程。</em></li>
            </ul>`,
        },
      ],
    },
    {
      id: 'sec-sa5-hw',
      heading: '本章作业与思考题',
      blocks: [
        {
          type: 'html',
          html: `<ol><li>请把基于体系结构的软件开发模型与其他软件开发模型进行比较。</li><li>请把基于体系结构的软件设计方法与其他软件设计方法进行比较。</li><li>阐述模式驱动的软件体系结构的设计方法。</li><li>阐述软件体系结构的设计过程。</li></ol>`,
        },
      ],
    },
  ],
};

export default ch5;
