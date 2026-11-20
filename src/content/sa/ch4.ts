/* 第4章 软件体系结构描述 —— 逐节转录自 课件/第4章 软件体系结构描述.ppt（126 页）；
   表格与图形页以渲染图核对转录，课件内嵌自测题收录为 quiz 块（原卷未标答案，解析给出课件依据）。 */
import type { SaChapter } from './types';

const ch4: SaChapter = {
  id: 'ch4',
  no: '第4章',
  title: '软件体系结构描述',
  subtitle: '描述方法 · 框架标准 · ADL 与五种典型描述语言 · UML',
  lede:
    '<p>软件体系结构是附属于系统之中的——只要存在系统，体系结构就存在（如每个石头都会有重量）；软件体系结构描述是将体系结构可视化的手段和产物（如表示一个石头的重量）。形式化的抽象与精确描述，是进行分析评估、计算和预测的基础。</p>',
  toc: [
    { id: 'sec-sa4-method', text: '4.1 软件体系结构描述方法', level: 2 },
    { id: 'sec-sa4-standard', text: '4.2 体系结构描述框架标准', level: 2 },
    { id: 'sec-sa4-content', text: '4.3 体系结构描述内容框架', level: 2 },
    { id: 'sec-sa4-adl', text: '4.4 体系结构描述语言', level: 2 },
    { id: 'sec-sa4-typical', text: '4.5 典型的软件体系结构描述语言', level: 2 },
    { id: 'sec-sa4-typical-h1', text: '4.5.1 ACME', level: 3 },
    { id: 'sec-sa4-typical-h2', text: '4.5.2 Wright', level: 3 },
    { id: 'sec-sa4-typical-h3', text: '4.5.3 UniCon', level: 3 },
    { id: 'sec-sa4-typical-h4', text: '4.5.4 Darwin', level: 3 },
    { id: 'sec-sa4-typical-h5', text: '4.5.5 C2', level: 3 },
    { id: 'sec-sa4-typical-h6', text: '4.5.6 其它（Aesop、MetaH、SADL）', level: 3 },
    { id: 'sec-sa4-uml', text: '4.6 软件体系结构与UML', level: 2 },
    { id: 'sec-sa4-hw', text: '本章作业与思考题', level: 2 },
  ],
  sections: [
    {
      id: 'sec-sa4-method',
      heading: '4.1 软件体系结构描述方法',
      blocks: [
        {
          type: 'html',
          html: `
            <p>描述方法的种类：<strong>图形表达工具、模块内连接语言（MIL）、基于软构件的系统描述语言、软件体系结构描述语言（ADL）</strong>。</p>
            <h3 id="sec-sa4-method-h1">1、图形表达工具</h3>
            <p>采用矩形框和有向线段组合而成的图形表达工具：矩形框代表抽象构件，框内标注的文字为抽象构件名称，有向线段表示辅助各构件进行通信、控制和关联的连接件。这是一种简洁易懂、使用广泛的表示方法；但在术语和表达语义上不够规范和精确，可以通过增加语义图形元素的方式得到图文法理论来支持。</p>
            <p><em>课件图示：图 4.1 某软件辅助理解和测试工具部分体系结构描述；另以 Enterprise Java Beans Architecture 与 Microsoft .Net Framework Architecture 两张架构图为例。</em></p>
            <h3 id="sec-sa4-method-h2">2、模块内连接语言 MIL（Module Interconnection Language）</h3>
            <p>采用将一种或几种传统程序设计语言的模块连接起来的模块内连接语言。<strong>优点</strong>：由于程序设计语言和模块内连接语言具有严格的语义基础，因此它们能支持对较大的软件单元进行描述。<strong>缺点</strong>：但这些语言处理和描述的软件设计开发层次过于依赖程序设计语言，因此限制了处理和描述比程序设计语言元素更为抽象的高层次软件体系结构元素的能力。实例：Microsoft COM IDL、OMG CORBA IDL。</p>
            <h3 id="sec-sa4-method-h3">3、基于软构件的系统描述语言</h3>
            <p>是一种以构件为单位的软件系统描述方法，但是所面向和针对的系统的元素仍然是一些层次较低的以程序设计为基础的通讯协作软件单元，而且这些语言所描述和表达的系统一般而言是面向特定应用的特殊系统，这些特殊性使得基于软构件的系统描述仍然不是十分适合 SA 的描述和表达。例子：多变配置语言（Proteus Configuration Language: PCL）支持较高抽象层次上对系统进行建模。</p>
            <h3 id="sec-sa4-method-h4">4、软件体系结构描述语言 ADL（Architecture Description Language）</h3>
            <p>参照传统程序设计语言的设计和开发经验，重新设计、开发和使用针对软件体系结构特点的专门的软件体系结构描述语言。吸收高级语言语义精确 + SA 需要整体性和抽象性的特性，定义和确定了适合 SA 表达和描述的有关抽象元素。因此，ADL 是当前软件开发和设计方法学中一种发展很快的 SA 描述方法，目前已经有十几种。</p>
            <p>形式化、规范化的软件体系结构描述对于体系结构的设计和理解非常重要；当前描述主要停留在非形式化基础上，依赖于个人经验和技巧，不能准确描述构件之间接口和组合关系，难以进行一致性、完整性分析和模拟。目前对于软件体系的描述主要有两类：<strong>①</strong> 使用精确的、无歧异的体系结构描述语言，并提供对体系结构和特征的分析工具和设计环境；<strong>②</strong> 采用形式化的方法，提供精确的、抽象的模型，并提供基于这个模型的分析工具。</p>`,
        },
        {
          type: 'quiz',
          quiz: {
            kind: 'single',
            question: '以下关于软件体系结构描述方法说法错误的是（　）',
            options: [
              '图形表达工具在软件设计中占据主导地位',
              '由于软件设计语言和模块内连接语言具有严格的语义基础，因此它们能支持较小的软件单元进行描述',
              '基于软构件的系统描述语言将软件系统描述成一种是由许多以特定形式相互作用的特殊软件实体构造组成的组织或系统',
              '软件体系结构描述语言是参照传统程序设计语言的设计和开发经验，重新设计、开发和使用针对软件体系结构的描述语言',
            ],
            answer: 'B',
            explanation:
              '课件原文为「它们能支持对<strong>较大</strong>的软件单元进行描述」，B 项表述成「较小」，与课件相悖，故选 B。A/C/D 三项分别对应图形表达工具、基于软构件的系统描述语言与 ADL 的课件原文表述。',
            note: '本题为课件内嵌自测题（原卷未标答案），答案由课件原文推断。',
          },
        },
      ],
    },
    {
      id: 'sec-sa4-standard',
      heading: '4.2 体系结构描述框架标准',
      blocks: [
        {
          type: 'html',
          html: `
            <p>IEEE 于 2000 年 9 月 21 日通过了 <strong>IEEE 1471（SA 描述框架标准）</strong>。</p>
            <p>IEEE 1471 适应软件密集的系统。在应用 IEEE 1471 标准时应遵循如下要求：</p>
            <ul>
              <li>SA 的存档要求；</li>
              <li>能识别人员及其关系；</li>
              <li>SA 视点的选择与具体描述；</li>
              <li>SA 视点；</li>
              <li>SA 视点之间的一致性；</li>
              <li>SA 原理。</li>
            </ul>
            <p>IEEE 1471 标准提供了 SA 描述的概念框架和描述实践应遵循的规范，但在<strong>如何描述和具体的描述技术方面缺乏指导</strong>。</p>
            <p><strong>Rational 方案</strong>：Rational 结合 RUP、遵照 IEEE 1471，起草了用 UML 描述 SA 的建议并提交给 OMG，渴望成为行业规范。认为体系结构描述的关键是<strong>定义视点、视图以及建模元素之间的映射关系</strong>。该 SA 描述方案涉及面比较窄，注重层次比较低，因而更具体；描述限于 UML 和 RUP，具有一定的局限性，但该建议标准结合了业界广泛采用的建模语言和开发过程，易于推广。</p>`,
        },
      ],
    },
    {
      id: 'sec-sa4-content',
      heading: '4.3 体系结构描述内容框架',
      blocks: [
        {
          type: 'html',
          html: `
            <p>内容框架（Medvidovic 的观点）——<strong>构件</strong>：接口、类型、语义、约束、演化、非功能属性；<strong>连接</strong>：接口、类型、语义、约束、演化、非功能属性；<strong>体系结构配置</strong>：可理解性、可构成性、可改进性和可追踪性、异质性、可扩展性、演化、动态机制、约束、非功能属性；<strong>工具支持</strong>：主动规格说明、多视图、分析、改进、实现生成、动态机制。</p>
            <p class="fig-cap">出处：Medvidovic N., Taylor R.N., A Classification and Comparison Framework for Software Description Language. IEEE Transactions on Software Engineering: Vol.26, No.1, 1 Jan 2000。</p>`,
        },
      ],
    },
    {
      id: 'sec-sa4-adl',
      heading: '4.4 体系结构描述语言',
      blocks: [
        {
          type: 'html',
          html: `
            <p>ADL 是形式化语言：有底层语义的支持，提供语法和概念框架；基于底层语义的工具：为 SA 的表示、分析、演化、细化、设计过程提供支持。ADL 有三个基本组成元素：</p>
            <ul>
              <li><strong>构件</strong>：计算或数据存储单元；</li>
              <li><strong>连接件</strong>：交互及其交互规则；</li>
              <li><strong>SA 配置</strong>：拓扑图。</li>
            </ul>
            <h3 id="sec-sa4-adl-h1">ADL 应该具有的特点（按照 Mary Shaw 和 David Garlan 的观点）</h3>
            <p>传统语言的精确性。此外，还应具有——<strong>构造能力</strong>：能使用较小的独立体系结构元素建造大的软件系统；<strong>抽象能力</strong>：只关心抽象细节不管具体的实现；<strong>复用能力</strong>：包括构件、连接件和 SA 都可复用；<strong>组合能力</strong>：对局部结构能描述，进而支持动态变化；<strong>异构能力</strong>：允许多个不同的 SA 描述关联存在；<strong>分析和推理能力</strong>：能进行多种性能和功能上的推导。</p>
            <h3 id="sec-sa4-adl-h2">当前常见的一些体系结构描述语言</h3>
            <table class="tbl">
              <thead><tr><th>ADL</th><th>研发组织</th><th>负责人</th></tr></thead>
              <tbody>
                <tr><td>ACME</td><td>Carnegie Mellon 大学</td><td>David Garlan</td></tr>
                <tr><td>Wright</td><td>Carnegie Mellon 大学</td><td>David Garlan</td></tr>
                <tr><td>C2</td><td>Southern California 大学</td><td>Medvidovic</td></tr>
                <tr><td>Unicon</td><td>Carnegie Mellon 大学</td><td>Mary Shaw</td></tr>
                <tr><td>Darwin</td><td>英国 Imperial College</td><td>Jeff Kramer &amp; Jeff Magee</td></tr>
                <tr><td>AESOP</td><td>Carnegie Mellon 大学</td><td>David Garlan</td></tr>
                <tr><td>Rapide</td><td>Stanford 大学</td><td>David Luckham</td></tr>
                <tr><td>Control&amp;MetaH</td><td>Honeywell 公司技术中心</td><td>Steve Vestal</td></tr>
                <tr><td>Weaves</td><td>美国 Aerospace 公司</td><td>Gorlick</td></tr>
                <tr><td>SADL</td><td>SRI</td><td>Mark Moriconi</td></tr>
                <tr><td>UML</td><td>Rational 软件公司</td><td></td></tr>
              </tbody>
            </table>
            <h3 id="sec-sa4-adl-h3">主要 ADL 的特点</h3>
            <ul>
              <li><strong>ACME</strong>：支持各 ADL 之间的转换；</li>
              <li><strong>UniCon</strong>：支持异构的构件和连接件类型；</li>
              <li><strong>Wright</strong>：提供 SA 构件之间交互的说明和分析；</li>
              <li><strong>Darwin</strong>：支持并发应用；</li>
              <li><strong>Aesop</strong>：支持体系结构风格的应用；</li>
              <li><strong>MetaH</strong>：提供实时系统的设计指导；</li>
              <li><strong>C2</strong>：支持消息传递风格的系统描述；</li>
              <li><strong>SADL</strong>：提供层次加细的形式化描述。</li>
            </ul>
            <h3 id="sec-sa4-adl-h4">ADL 与程序设计语言的典型元素含义比较</h3>
            <table class="tbl">
              <thead><tr><th colspan="2">程序设计语言</th><th colspan="2">软件体系结构</th></tr></thead>
              <tbody>
                <tr><td>程序构件</td><td>组成程序的基本元素及其取值或值域范围</td><td>系统构件</td><td>模块化级别的系统组成成分实体，这些实体可以被施以抽象的特性化处理，并以多种方式得到使用</td></tr>
                <tr><td>操作符</td><td>连接构件的各种功能符号</td><td>连接件</td><td>对组成系统的有关抽象实体进行各种连接的连接机制</td></tr>
                <tr><td>抽象规则</td><td>有关构件和操作符的命名表达规则</td><td>组合模式</td><td>系统中的构件和连接件进行连接组合的特殊方式，也就是软件体系结构的风格</td></tr>
                <tr><td>限制规则</td><td>一组选择并决定具体使用何种抽象规则来作用于有关的基本构件及其操作符的规则和原理</td><td>限制规则</td><td>决定有关模式能够作为子系统进行大型软件系统构造和开发的合法子系统的有关条件</td></tr>
                <tr><td>规范说明</td><td>有关句法的语义关联说明</td><td>规范说明</td><td>有关系统组织结构方面的语义关联说明</td></tr>
              </tbody>
            </table>
            <h3 id="sec-sa4-adl-h5">常见的软件体系结构元素</h3>
            <table class="tbl">
              <thead><tr><th colspan="2">系统构件元素</th><th colspan="2">连接件元素</th></tr></thead>
              <tbody>
                <tr><td>纯计算单元</td><td>这类构件只有简单的输入/输出处理关联，对它们的处理一般也不保留处理状态，如数学函数、过滤器和转换器等</td><td>过程调用</td><td>在构件实体之间实现单线程控制的连接机制，如普通过程调用和远程过程调用等</td></tr>
                <tr><td>数据存储单元</td><td>具有永久存储特性的结构化数据，如数据库、文件系统、符号表和超文本等</td><td>数据流</td><td>系统中通过数据流进行交互的独立处理流程连接机制，其最显著的特点是根据得到的数据来进行构件实体的交互控制，如 Unix 操作系统中的管道机制等</td></tr>
                <tr><td>管理器</td><td>对系统中的有关状态和紧密相关操作进行规定与限制的实体，如抽象数据类型和系统服务器等</td><td>隐含触发器</td><td>由并发出现的事件来实现构件实体之间交互的连接机制，在这种连接机制中，构件实体之间不存在明显确定的交互规定，如时间调度协议和自动垃圾回收处理等</td></tr>
                <tr><td>控制器</td><td>控制和管理系统中有关事件发生的时间序列，如调度程序和同步处理协调程序等</td><td>消息传递</td><td>独立构件实体之间通过离散和非在线的数据（可以是同步或非同步的）进行交互的连接机制，如 TCP/IP 等</td></tr>
                <tr><td>连接器</td><td>充当有关实体间信息转换角色的实体，如通讯连接器和用户界面等</td><td>数据共享协议</td><td>构件之间通过相同的数据空间进行并发协调操作的机制，如黑板系统中的黑板和多用户数据库系统中的共享数据区等</td></tr>
              </tbody>
            </table>`,
        },
      ],
    },
    {
      id: 'sec-sa4-typical',
      heading: '4.5 典型的软件体系结构描述语言',
      blocks: [
        {
          type: 'html',
          html: `
            <h3 id="sec-sa4-typical-h1">4.5.1 ACME</h3>
            <p><strong>ACME 概述</strong>：由卡耐基梅隆大学的 Garlan 等人创造。起初的目的：简单性的、一般的 ADL。ACME 是一种 <strong>SA 变换语言</strong>：提供不同的 ADL 变换机制，所以，虽然 ACME 没有支持工具，但却能使用各种 ADL 提供的工具，可实现分析方法和工具的共享。它提供了结构性的方法和开放的语义框架，可以在结构特性上标注一些 ADL 相关的属性，能表示大多数 ADL 描述的公共结构信息。ACME 从<strong>结构、属性、约束、类型和风格</strong> 4 个不同的方面对 SA 进行描述。</p>
            <p><strong>SA 设计元素</strong>：ACME 提供 7 种实体——构件、连接件、系统（构件和连接件的配置）、端口、角色、表述（representations）和表述映射（map）。</p>
            <p>表述为 SA 提供分级描述的能力，每个构件或连接件能用一个或多个更详细、更底层的描述来表示；表述映射定义了被表述的内部系统和所表述的构件或连接件的外部接口之间存在何种相关性（对连接件而言是内部角色和外部角色之间）。例如带表述的 C/S 结构：Client、Server 经连接件与连接管理、安全管理、数据库等内部子系统相连。</p>
            <p>对表述的进一步描述：① 使用表述封装子系统——父元素可以看作是将元素暴露给外界的接口的标识符号，而表述是对接口的具体实现；② 表述作为视图——表述可以用来表达系统的其它视图，一个简单的应用就是去掉系统某些特性后定义的一个简化的视图，但 ACME 并没有提供不同视图之间关系的机制；③ 表述的其它应用——表达文档消息，在 ACME 中，ACME 只被用来定义逻辑边界，如对构件和连接件的封装。</p>
            <p><strong>ACME 实例——C/S 结构的描述</strong>：</p>
            <pre class="code">System simple_CS = {
    Component client = { Port sendRequest }
    Component Server = { Port receiveRequest }
    Connector rpc = { Roles { caller, callee } }
    Attachments {
        client.sendRequest to rpc.caller
        server.receiverRequest to rpc.callee
    }
}</pre>
            <p><strong>属性</strong>：ACME 使用任意的属性列表对 SA 的结构进行注释。每个属性有名称、可选类型和值；ACME 定义了诸如整数、字符串和布尔等简单类型。属性可用于可视化说明（形状=矩形、宽度=100、高度=50…）、源代码（While(data)、Read(response)…）、性能数据（MAX 速度: 5Kbps、MAX 连接数: 10）等。</p>
            <p><strong>带属性的 ACME 描述实例</strong>：</p>
            <pre class="code">System simple_CS = {
    Component client = { Port sendRequest
        Properties { requestRate:float = 17.0;
                     sourceCode:externalFile = "client.c" } }
    Component Server = { Port receiveRequest;
        Properties { macConcurrentClients:integer = 1;
                     multithreaded:Boolean = false;
                     sourceCode:externalFile = "server.c" } }
    Connector rpc = { Roles { caller, callee }
        Properties { synchronous:boolean = true;
                     maxRoles:integer = 2; } }
    Attachments {
        client.sendRequest to rpc.caller
        server.receiverRequest to rpc.callee
    }
}</pre>
            <p><strong>设计约束</strong>：决定了体系结构设计如何演化的。在 ACME 中采用<strong>一阶谓词逻辑</strong>的约束语言来描述设计约束；约束可和任何设计元素相关联，约束有范围——如与一个系统关联，则可引用系统中的任何设计元素。如：</p>
            <ul>
              <li>Connected(c1, c2)——如果 c1 和 c2 之间至少有一个连接件，则取 true；否则 false；</li>
              <li>Reachable(c1, c2)——如果 c2 处于 Connected(c1, *) 的路径上，则取 true，否则 false；</li>
              <li>HasProperty(elt, propName)——如果元素 elt 有一个属性，取名为 propName。</li>
            </ul>
            <p><strong>类型、模板和风格</strong>：</p>
            <ul>
              <li><strong>(1) 类型</strong>。包括属性类型、结构类型和风格（簇）。属性类型即属性的类型；结构类型即构造实体的类型，如：
                <pre class="code">Component Type Client = {        // 定义构件类型
    Port Request = { Property protocol:CSPprotocolT };
    Property request-rate:Float;
    Invariant size(self.Ports) &lt;= 5;
    Invariant request-rate &gt;= 0;
    Heuristic request-rate &lt; 100;
}</pre>
              </li>
              <li><strong>族（family）</strong>：通过三个方面来定义——一组结构元素和属性、一组约束、默认结构。其中结构元素和属性（属性类型和结构类型）为 family 提供了设计词汇；约束定义了模型描述的合法性规则，决定了如何使用这些类型的实例；默认结构描述了使用 family 的任何系统实例的最小集合。</li>
              <li><strong>(2) 模板</strong>：提供对 SA 进一步抽象的能力，用来描述复杂系统和反复出现的模式。在应用和初始化这些模式时，只提供适当类型的参数就可以了。
                <pre class="code">Style client_server = {
    Component Template client(rpc_call_ports:Ports) = {
        Port rpc_call_ports
        Properties { requestRate:float = 17.0;
                     sourceCode:externalFile = "client.c" }
    }
    Component Template Server(rpc_receive_ports:Ports) = {
        Port rpc_receive_ports;
        Properties { macConcurrentClients:integer = 1;
                     multithreaded:Boolean = false;
                     sourceCode:externalFile = "server.c" }
    }
    Connector Template rpc(caller_port, callee_port:Port) defining(conn:Connector) = {
        conn = Connector {
            Roles { caller, callee }
            Properties { synchronous:boolean = true;
                         maxRoles:integer = 2; }
        }
        Attachments {
            conn.caller to callee_port
            conn.callee to caller_port
        }
    }
}

// 实例化应用：
System complex_cs:client_server = {
    c1 = client(send_request);
    c2 = client(send_request);
    c3 = client(send_request);
    s1 = sever(receive_request);
    s2 = sever(receive_request);
    rpc(c1.send_request, s1.receive_request);
    rpc(c2.send_request, s2.receive_request);
    rpc(c3.send_request, s2.receive_request);
}</pre>
              </li>
              <li><strong>(3) 风格</strong>：风格就是族（family），可用类型系统来定义，表示一组系统。风格定义了相关模板的集合，模板用来定义风格，提供了一种在 SA 设计中捕捉并复用公共结构的机制。
                <pre class="code">Family PipeFilterFamily {            // 定义 Pipe-Filter 族
    Component Type FilterT = {
        Ports { stdin; stdout; };
        Property throughPut:int;
    };
    Component Type UnixFilterT extends FilterT with {
        Port stderr;
        property implementationFile:String;
    };
    Connector Type PipeT = {
        Roles { source, sink; };
        property bufferSize:int
    };
    property Type StringMsgFormatT = Record[size:int; msg:string;];
    Invariant Forall c in self.Connectors @ HasType(c, PipeT)
    // 以上约束表示对所有的连接件必须使用管道，没有默认结构
}

// 续上：定义族的系统实例
System simplePF:PipeFilterFamily {
    // 定义构件
    Component smooth:FilterT = new FilterT;
    Component detectErrors:FilterT;
    Component showTracks:unixFilterT = new unixFilterT extended with {
        Property implementationFile:String = "showTracks.c";
    };
    // 定义连接件
    Connetor firstPipe:PipeT;
    Connetor SecondPipe:PipeT;
    // 定义连接关系
    Attachments {
        smooth.stdout to firstPipe.source;
        detectErrors.stdin to FirstPipe.sink;
        detectErrors.stdout to secondPipe.ssouce;
        showtracks.stdin to secondPipe.sink;
    }
}</pre>
              </li>
            </ul>
            <p><strong>ACME 的特点</strong>：用 7 种基本的元素来表示 SA（构件、连接件、系统、端口、角色、表述和表述映射）；提供了灵活的注释机制，支持将 SA 和用子语言表示的非结构化信息结合起来，这些子语言是外部定义的；提供了一种类型和模板机制，用于抽象出共同的、可复用的 SA 惯用法和风格；提供了一个开放的语义框架，提供了基本的结构信息和属性信息，用于 SA 的描述和推理。</p>
            <p>对于简单的 CLIENT-SERVER 结构的规格说明如下：</p>
            <pre class="code">Exist client, sever, rpc |
    component(client) ∧
    component(server) ∧
    connector(rpc) ∧
    attach(client.send_request, rpc.caller) ∧
    attach(server.receive_request, rpc.callee)</pre>
            <p>以上没有体现：① 封闭世界——即所有的构件、连接件、端口和角色都已经用体系结构规格说明中的变量标识出来了，所有的联结无一例外地也已经被说明了；② 这些已有的变量必须表示不同的实体。补充以上两点之后的描述如下：</p>
            <pre class="code">Exist client, sever, rpc |
    component(client) ∧
    component(server) ∧
    connector(rpc) ∧
    attach(client.send_request, rpc.caller) ∧
    attach(server.receive_request, rpc.callee) ∧
    client != server ∧ server != rpc ∧ rpc != clent ∧
    (for all y:component(y) ⇒ y = client | y = server) ∧
    (for all y:connector(y) ⇒ y = rpc) ∧
    (for all p, q:attached(q, p) ⇒
        (p = client.send_request ∧ q = rpc.coller) |
        (p = server.receive_request ∧ q = rpc.collee)
    )</pre>
            <p><strong>实践</strong>：下载 ACME 相关的软件并安装使用。该工具是卡耐基梅隆大学计算机学院的 ABLE（Architecture Based Language and Environments）项目组开发的。通过对该工具的使用，认识：AcmeStudio 的环境构成（包括用户界面和执行的基本任务等）；转换功能（诸如 Wright、Unicon 等之间）；对 SA 设计和分析的支持（包括对特定 SA 风格的定制等）；开发定制的基于 ACME 的应用（包括使用 Acmelib 提供的通用的 API 或自定义的接口类集合）。</p>
            <h3 id="sec-sa4-typical-h2">4.5.2 Wright</h3>
            <p>Wright 是卡耐基梅隆大学的 Robert Allen 和 David Garlan 提出的一种 ADL。Wright 的系统描述语法如下：</p>
            <pre class="code">System SimpleExample
    Component Server =
        port provide [provide protocol]
        spec [Server specification]
    Component Client =
        port request [request protocol]
        spec [Client specification]
    connector C-S-connector =
        role client [client protocol]
        role server [server protocol]
        glue [glue protocol]
    Instances
        s:Server
        c:Client
        cs:C-S-connector
    Attachments
        s.provide as cs.server
        c.request as cs.client
End SimpleExample</pre>
            <p><strong>角色（role）</strong>说明了交互中的每一方可能的行为。如客户角色把客户的行为描述为对服务器的请求和返回结果构成的序列；服务器角色把服务行为描述为一系列依次进行处理的请求和返回结果的操作。<strong>Glue</strong> 说明了这种行为如何组合在一起和相互协作的。如客户活动必须按照某种顺序进行：客户请求服务、服务器处理请求、服务器提供结果和客户取得结果。</p>
            <p>利用 role 和 glue 可以描述行为和这些行为的协调与组合。但对于这些行为的特点和这些行为发生的范围的描述，Wright 采用了 <strong>CSP（通信顺序过程）</strong>的一个子集来描述，这个子集用来定义角色、端口和 glue 的协议等。CSP 的主要目的是：为了克服传统程序设计语言在多处理器体系上的障碍。它的基本单元是一系列并发的进程，同时也能方便地描述进程之间的通讯和同步。尽管 CSP 中具有丰富的描述通讯实体的方法，但 Wright 只选取了它的一个子集。</p>
            <h3 id="sec-sa4-typical-h3">4.5.3 UniCon</h3>
            <p>UniCon（UNIversal CONnection）是卡耐基梅隆大学的 Mary Shaw 提出的。UniCon 的基本个体元素是<strong>构件和连接件</strong>：规范是系统在合成时的单元关联约束；实现分为原始的（primitive）与合成的（composite）。</p>
            <p><strong>UniCon 支持的构件类型</strong>：</p>
            <table class="tbl">
              <thead><tr><th>构件类型</th><th>支持的 player 类型</th></tr></thead>
              <tbody>
                <tr><td>Model</td><td>RoutineDef, RoutineCall, GlobalDataDef, GlobalDataUse, PLBundle, ReadFile, WriteFile</td></tr>
                <tr><td>Computation</td><td>RoutineDef, RoutineCall, GlobalDataUse, PLBundle</td></tr>
                <tr><td>SharedData</td><td>GlobalDataDef, GlobalDataUse, PLBundle</td></tr>
                <tr><td>SeqFile</td><td>ReadNext, WriteNext</td></tr>
                <tr><td>Filter</td><td>StreamIn, StreamOut</td></tr>
                <tr><td>Process</td><td>RPCDef, RPCCall</td></tr>
                <tr><td>SchedProcess</td><td>RPCDef, RPCCall, RTLoad</td></tr>
                <tr><td>General</td><td>可以定义任何类型的 player，过多的使用会破坏构件的类型约束</td></tr>
              </tbody>
            </table>
            <p><strong>UniCon 支持的构件的属性</strong>：</p>
            <table class="tbl">
              <thead><tr><th>属性</th><th>需求</th><th>合成规则</th><th>应用构件</th><th>值 / 默认 / 句法</th></tr></thead>
              <tbody>
                <tr><td>InstFormal</td><td>可选</td><td>合并</td><td>所有</td><td>形式参数 / 没有参数 / 受实际语言的限制</td></tr>
                <tr><td>Variant</td><td>可选</td><td>替换</td><td>所有</td><td>构件选择不同的实现 / 第 1 个变体 / 变体的名称</td></tr>
                <tr><td>RecordFormat</td><td>可选</td><td>替换</td><td>SeqFile</td><td>文件的记录格式 / 带回车换行的文本行 / 受实现语言的限制</td></tr>
                <tr><td>Library</td><td>可选</td><td>替换</td><td>Module、Computation、SeqFile、SharedData</td><td>把 MinAssocs 的值变为 0 / 使用未用的 player / 为构造器生成库档案提供依据</td></tr>
                <tr><td>EntryPoint</td><td>可选</td><td>替换</td><td>Module、Computation、Process、SchedProcess</td><td>开始执行的入口点 / 模块的主程序 / 过程名</td></tr>
                <tr><td>Priority</td><td>可选</td><td>替换</td><td>SchedProcess</td><td>实时操作系统运行进程的优先级 / 最高值 / 整数</td></tr>
                <tr><td>Processor</td><td>可选</td><td>替换</td><td>所有</td><td>进程运行的处理器 / 当地处理器 / 处理器名</td></tr>
                <tr><td>SegmentDef</td><td>可选</td><td>替换</td><td>SchedProcess</td><td>实时构件的实现代码的代码段定义 / 没有默认值 / 名字后跟“:”，然后是执行时间（秒）</td></tr>
                <tr><td>TriggerDef</td><td>可选</td><td>替换</td><td>SchedProcess</td><td>激活一个代码段的外部激发定义 / 没有默认值 / 名字后跟“:”，然后是执行时间（秒）</td></tr>
                <tr><td>RPCTypeIn</td><td>可选</td><td>合并</td><td>Process、SchedProcess</td><td>为 RPC 生成器导出语言无关的类型信息的辅助信息</td></tr>
                <tr><td>RPCTypeDef</td><td>可选</td><td>替换</td><td>Process、SchedProcess</td><td>为 RPC 生成器导出语言无关的类型信息的辅助信息</td></tr>
              </tbody>
            </table>
            <p>其中，<strong>原始构件</strong>直接由程序语言代码实现；<strong>合成构件</strong>是从不同构件逐步构造的更大的构件，需要三类信息（块、配置信息、抽象信息）。</p>
            <p><strong>UniCon 支持的连接件类型</strong>：</p>
            <table class="tbl">
              <thead><tr><th>连接件</th><th>支持的 role 类型和 player 类型</th></tr></thead>
              <tbody>
                <tr><td>Pipe</td><td>源：接受 Filter 的 StreamOut、SeqFile 的 ReadNext；槽：接受 Filter 的 StreamOut、SeqFile 的 WriteNext</td></tr>
                <tr><td>FileIO</td><td>主动读：接受 Module 的 ReadFile；被读：接受 SeqFile 的 ReadNext；主动写：接受 Module 的 WriteFile；被写：接受 SeqFile 的 WriteNext</td></tr>
                <tr><td>ProcedureCall</td><td>定义者：接受 Computation 或 Module 的 RoutineDef；调用者：接受 Computation 或 Module 的 RoutineCall</td></tr>
                <tr><td>DataAccess</td><td>定义者：接受 SharedData 或 Module 的 GlobalDataDef；使用者：接受 SharedData 或 Computation 或 Module 的 GlobalDataUse</td></tr>
                <tr><td>PLBundler</td><td>参与者：接受 PLBundler、RoutineDef、RoutineCall、GlobalDataUse、Computation 的 RoutineDef、Module、SharedData</td></tr>
                <tr><td>RemoteProcCall</td><td>定义者：接受 Process 或 SchedProcess 的 RPCDef；调用者：接受 Process 或 SchedProcess 的 RPCCall</td></tr>
                <tr><td>RTScheduler</td><td>加载：接受 SchedProcess 的 RTLoad</td></tr>
              </tbody>
            </table>
            <p><strong>UniCon 支持的连接件属性</strong>：</p>
            <table class="tbl">
              <thead><tr><th>属性</th><th>需求</th><th>合成规则</th><th>应用构件</th><th>值 / 默认 / 句法</th></tr></thead>
              <tbody>
                <tr><td>InstFormal</td><td>可选</td><td>合并</td><td>所有</td><td>构件实例化的形式化 / 没有默认参数 / 受实现语言的限制</td></tr>
                <tr><td>PipeType</td><td>可选</td><td>替换</td><td>Pipe</td><td>选择使用哪一类管道 / 默认为有名的 / 句法是从有名或无名的选择</td></tr>
                <tr><td>Match</td><td>可选</td><td>合并</td><td>PLBundler</td><td>识别 PLBundler 成员之间的连接 / PLBundler 成员之间的名字匹配 / 句法是 &lt;player, playee&gt; 对的设置</td></tr>
                <tr><td>Algorithm</td><td>可选</td><td>替换</td><td>RTScheduler</td><td>从枚举中使用命名的算法</td></tr>
                <tr><td>Processor</td><td>可选</td><td>替换</td><td>RTScheduler</td><td>运行进程集合的命名处理器 / 本地的 / 处理器必须在运行实时操作系统</td></tr>
                <tr><td>Trace</td><td>要求</td><td>错误</td><td>RTScheduler</td><td>定义实时代码的运行踪迹 / 句法是 RTLoad.Trigger、RTLoad.Segment</td></tr>
              </tbody>
            </table>
            <p><strong>UniCon 支持的角色的属性</strong>：</p>
            <table class="tbl">
              <thead><tr><th>属性</th><th>需求</th><th>合成规则</th><th>应用构件</th><th>值 / 默认 / 句法</th></tr></thead>
              <tbody>
                <tr><td>Accept</td><td>可选</td><td>合并</td><td>所有</td><td>识别可以充当 role 的 player 的类型 / 句法是（构件类型，player 类型）</td></tr>
                <tr><td>MaxConns</td><td>可选</td><td>替换</td><td>所有</td><td>Player 可以充当的最大数量的 role / 无限 / 句法是整数</td></tr>
                <tr><td>MinConns</td><td>可选</td><td>替换</td><td>所有</td><td>Player 必须充当的最小数量的 role / 默认为 1 / 句法是整数</td></tr>
              </tbody>
            </table>
            <p><strong>实现语法</strong>。UniCon 定义构件的语法为：</p>
            <pre class="code">&lt;component&gt; ::= COMPONENT &lt;identifier&gt;
                           &lt;interface&gt;
                           &lt;component_implementation&gt;
                       END &lt;identifier&gt;</pre>
            <p>可见，构件的定义主要包括两个方面，即<strong>接口和实现</strong>。接口包括构件类型、属性和 player，定义语法为：</p>
            <pre class="code">&lt;interface&gt; ::= INTERFACE IS
                   TYPE &lt;component_type&gt;
                   &lt;property_list&gt;
                   &lt;player_list&gt;
                END INTERFACE
&lt;component_type&gt; ::= Module | Computation | ShareData | SeqFile |
                                    Filter | Process | SchedProcess | General</pre>
            <p>UniCon 构件的实现包括原始的方式和合成的方式：原始的方式是由一个指向源文档的指针构成，该文档使用 UniCon 之外的语言，构件的实现包含在此源文档中；合成的实现方式是对构件、连接件配置的一种描述，这些构件和连接件是用 UniCon 定义的，包括 3 类信息——<strong>块</strong>（构件或连接件的特定实例）、<strong>配置信息</strong>（描述了构件和连接件如何连接在一起的）、<strong>抽象信息</strong>（描述了合成构件的参与者是怎样映射到各个组成构件的参与者的）。</p>
            <pre class="code">&lt;component_implementation&gt; ::= &lt;primitive_implementation&gt; |
                                              &lt;composite_implementation&gt;
&lt;primitive_implementation&gt; ::= IMPLEMENTATION IS
                                  &lt;property_list&gt; |
                                  &lt;variant_list&gt;
                               END IMPLEMENTATION
&lt;composite_implementation&gt; ::= IMPLEMENTATION IS
                                  &lt;property_list&gt; |
                                  &lt;composite_statement_list&gt;
                               END IMPLEMENTATION</pre>
            <p>UniCon 定义连接件的语法为（定义包括协议和实现两个方面）：</p>
            <pre class="code">&lt;connector&gt; ::= CONNECTOR &lt;identifier&gt;
                           &lt;protocol&gt;
                           &lt;connector_implementation&gt;
                       END &lt;identifier&gt;
&lt;protocol&gt; ::= PROTOCOL IS
                  TYPE &lt;connector_type&gt;
                  &lt;property_list&gt;
                  &lt;role_list&gt;
              END PROTOCOL
&lt;connector_type&gt; ::= DataAccess | FileIO | Pipe | PLBundler |
                                ProcedureCall | RemoteProcCall | RTScheduler</pre>
            <p>连接件的实现是 UniCon 内建的，UniCon 没有提供用户自定义的连接件实现机制：</p>
            <pre class="code">&lt;connector_implementation&gt; ::= IMPLEMENTATION IS
                                                BUILTIN
                                            END IMPLEMENTATION</pre>
            <p><strong>实例</strong>：假设一个实时系统采用客户/服务器体系结构，在该系统中，有两个任务共享同一个计算机资源，这种共享通过远程过程调用来实现。</p>
            <pre class="code">COMPONENT Real_Time_System
    INTERFACE IS
        TYPE General
    IMPLEMENTATION IS
        uses client interface rtclient
            PRIORITY(10)
            ……
        end client
        uses server interface rtclient
            PRIORITY(10)
            ……
        end server
        establish RTM-realtime-sched with
            client.application1 as load
            server.application2 as load
            server.services as load
            ALGORITHM(rate_monotonic)
            ……
        end RTM-realtime-sched
        establish RTM-remote-proc_call with
            client.timeget as caller
            server.timeger as definer
            IDLTYPE(Mach)
        end RTM-remote-proc_call
        ……
    END IMPLEMENTATION
END Real_Time_System

CONNECTOR RTM_realtime_sched
    PROTOCOL IS
        TYPE RTScheduler
        role load is load
    END PROTOCOL
    IMPLEMENTATION IS
        BUILTIN
    END IMPLEMENTATION
END RTM_realtime_sched
……</pre>
            <h3 id="sec-sa4-typical-h4">4.5.4 Darwin</h3>
            <p>Darwin 是英国伦敦 Imperial 大学的 Jeff Kramer 和 Jeff Magee 在 90 年代开发的。Darwin 对语义的细节描述是基于 <strong>∏ 演算</strong>的。Darwin 说明语句的语法如下：</p>
            <pre class="code">Darwin-declaration =
    [1+ component-declaration |
         interface-declaration |
         const-declaration |
         external-declaration
    ]</pre>
            <p>其中：[1+…] 代表一个或多个声明；[1…] 代表一个；[01…] 代表 0 个或 1 个；[0+…] 代表 0 个或多个。</p>
            <p>Darwin 对构件的说明语句的语法如下：</p>
            <pre class="code">component-declaration =
    component COMPONENT-id [1 component-block |
                            partial-component-declaration]
    component-block = [01 formal-parameter-list] [0+ tag]
                      "{"
                          [0+ declaration ";"]
                      "}"
    declaration = assert-declaration | bind-declaration |
            component-declaration | const-declaration |
            external-declaration | interface-declaration |
            partial-declaration | when-declaration

partial-component-declaration =
        BASE-COMPONENT-type |
        [01 BASE-COMPONENT-TYPE-partial-argument-list] [0+ tag] ";"
argument-list =
        "(" expression [0+ ",expression"] ")"
Partial-argument-list =
        "(" [01 expression] [0+ "," [01 expression]] ")"</pre>
            <p><strong>局部构件说明（partial component declaration）</strong>：构件的类型可以从其它的构件类型完全或部分导出。</p>
            <pre class="code">formal-parameter-list =
        "("
            formal-parameter [0+ "," formal-parameter]
        ")"
formal-parameter = value-parameter | type-parameter
value-parameter = PREDEFINED-TYPE-id | PARAMETER-id
type-parameter = "&lt;" GENERIC-TYPE-id "&gt;"</pre>
            <p><strong>通用类型（generic-type）</strong>相当于预定义类型、构件类型和接口类型的占位符，并用于通用构件类型和通用接口类型的规范说明。通用类型用于以下情况：① 构件类型、接口类型的形参与实参的说明；② 在入口或入口成员说明中说明入口类型——注意，不是所有的入口说明都要定义入口类型，当没有定义入口类型时，假设有一个惟一的隐含通用类型；③ 在实例化说明中，说明构件的类型。通用类型说明的语法为：</p>
            <pre class="code">Type-name = id | "&lt;" TYPE-id "&gt;"
// 通用类型实例：
component A(int y, &lt;T&gt;) {}
interface B(int y, &lt;T1&gt;, &lt;T2&gt;)</pre>
            <p><strong>Darwin 系统程序结构构造</strong>：在 SA 的设计过程中，设计人员在不同的抽象层面上轮流用自顶向下和自底向上的分析和设计方法。Darwin 系统提供了<strong>合并构件（Merging Components）</strong>和<strong>分组构件（Grouping Components）</strong>来支持这种设计、分析方法。在大粒度软件开发过程中，分析人员经常会依据设计需要，分析、细化不同层次结构上的构件结构，并最终通过组合、复合为系统提供构件来实现系统。</p>
            <h3 id="sec-sa4-typical-h5">4.5.5 C2</h3>
            <p>C2 和其提供的设计环境（Argo）支持采用<strong>基于时间的风格</strong>来描述用户界面系统，并支持使用可替换、可重用的构件开发 GUI 的体系结构。在 C2 中，连接件负责构件之间消息的传递，而构件维持状态、执行操作并通过两个名字分别为 <strong>top 和 bottom</strong> 的端口和其它的构件交换信息。每个接口包含一种可发送的消息和一组可接收的消息。构件之间的消息要么是请求其它构件执行某个操作的<strong>请求消息</strong>，要么是通知其他构件自身执行了某个操作或状态发生改变的<strong>通知消息</strong>。</p>
            <p>构件之间的消息交换不能直接进行，而只能通过连接件来完成。每个构件接口最多只能和一个连接件相连，而连接件可以和任意数目的构件或连接件相连。请求消息只能向上层传送而通知消息只能向下层传送。通知消息的传递只对应于构件内部的操作，而和接收消息的构件的需求无关。C2 对构件和连接件的实现语言、实现构件的线程控制、构件的部署以及连接件使用的通讯协议等都不加限制。</p>
            <p>C2 对构件的描述：</p>
            <pre class="code">interface_requests ::=
    {request;} | null;
interface_notifications ::=
    {notification;} | null;
request ::=
    message_name(request_parameters)
request_parameters ::=
    [to component_name][parameter_list]
notification ::=
    message_name[parameter_list]
component_message_interface ::=
    top_domain_interface
    bottom_domain_interface
top_domain_interface ::=
    top_domain is
        out interface_requests
        in interface_notifications
bottom_domain_interface ::=
    bottom_domain is
        out interface_notifications
        in interface_requests</pre>
            <p><em>课件图示：会议安排系统的 C2 风格结构图。</em>下面给出 C2 对各构件与体系结构的描述。</p>
            <p><strong>C2 对 MeetingInitiator 构件的描述</strong>：</p>
            <pre class="code">component MeetingInitiator is
  interface
    top_domain is
      out
        GetPrefSet()；
        GetExclSet()；
        GetEquipReqts()；
        GetLocPrefs()；
        RemoveExclSet()；
        RequestWithdrawal(to Attendee)；
        RequestWithdrawal(to ImportantAttendee)；
        AddPrefDates()；
        MarkMtg(d:date；l:loc_type)；
      in
        PrefSet(p:date_mg)；
        ExclSet(e:data_mg)；
        EquipReqts(eq:equip_type)；
        LocPref(l:loc_type)；
   behavior
     startup always_generate GetPrefSet, GetExclSet, GetEquipReqts, GetLocPrefs；
     received_messages PrefSet may_generate RemoveExclSet xor RequestWithdrawal xor MarkMtg；
     received_messages ExclSet may_generate AddPrefDates xor RemoveExclSet
        xor RequestWithdrawal xor MarkMtg；
     received_messages EquipReqts may_generate AddPrefDates xor
        RemoveExclSet xor RequestWithdrawal xor MarkMtg；
     received_messages LocPref always_generate null；
end MeetingInitiator；</pre>
            <p><strong>C2 对 Attendee 构件的描述</strong>：</p>
            <pre class="code">component Attendee is
  interface
    bottom_domain is
      out
        PrefSet(p:date_mg)；
        ExclSet(e:date_mg)；
        EquipReqts(eq:equip_type)；
      in
        GetPrefSet()；
        GetExclSet()；
        GetEquipReqts()；
        RemoveExclSet()；
        RequestWithdrawal()；
        AddPrefDates()；
        MarkMtg(d:date；l:loc_type)；
  behavior
    received_messages GetPrefSet always_generate PrefSet；
    received_messages AddPrefDates always_generate PrefSet；
    received_messages GetExclSet always_generate ExclSet；
    received_messages GetEqipReqts always_generate EqipReqts；
    received_messages RemoveExclSet always_generate ExclSet；
    received_messages ReuestWithdrawal always_generate null；
    received_messages MarkMtg always_generate null；
end Attendee；</pre>
            <p><strong>C2 对 ImportantAttendee 构件的描述</strong>：</p>
            <pre class="code">component ImportantAttendee is subtype Attendee(in and beh)
  interface
    bottom_domain is
      out
        LocPrefs(l:loc_type)；
        ExclSet(e:date_mg)；
        EquipReqts(eq:equip_type)；
      in
        GetLocPrefs()；
  behavior
    received_messages GetLocPrefs always_generate LocPrefs；
end ImportantAttendee；</pre>
            <p><strong>C2 对体系结构的描述</strong>：</p>
            <pre class="code">architecture MeetingScheduler is
   conceptual_components
       Attendee；ImportantAttendee；MeetingInitiator；
   connectors
       connector MainConn is message_filter no_filtering；
       connector AttConn is message_filter no_filtering；
       connector ImportantAttConn is message_filter no_filtering；
   architectural_topology
       connector AttConn connections
           top_ports Attendee；
           bottom_ports MainConn；
       connector ImportantAttConn connections
           top_ports ImportantAttendee；
           bottom_ports MainConn；
       connector MainConn connections
           top_ports AttConn；ImportantAttConn；
           bottom_ports MeetingInitiator；
end MeetingScheduler；</pre>
            <p><strong>C2 对会议安排系统的描述</strong>：</p>
            <pre class="code">system MeetingScheduler_1 is
  architecture MeetingScheduler with
    Attendee instance Att_1, Att_2, Att_3；
    ImportantAttendee instance ImpAtt_1, ImpAtt_2；
    MeetingInitiator instance MtgInit_1；
end MeetingScheduler_1；</pre>
            <p><strong>最佳实践</strong>：安装 ArchStudio 5 实现 C2 对会议安排系统的描述。</p>
            <h3 id="sec-sa4-typical-h6">4.5.6 其它（Aesop、MetaH、SADL）</h3>
            <p>阅读并理解其它的 SA 描述语言。小结：</p>
            <ul>
              <li><strong>ACME</strong>（Garlan 等，2000 年）支持对新的 SA 风格的定义；</li>
              <li><strong>Wright</strong>（Allen 和 Garlan，1997 年）支持对 SA 构件间交互的形式化规范和分析；</li>
              <li><strong>Unicon</strong>（Shaw 等，1995 年）拥有一种高级编译器，该编译器针对的是支持异构构件和连接件类型的混合体的 SA 设计；</li>
              <li><strong>Darwin</strong>（Magee 等，1995 年）支持对分布式消息传递系统的分析；</li>
              <li><strong>Aesop</strong>（Garlan, Allen 和 Ockerbloom，1994 年）支持 SA 风格的使用；</li>
              <li><strong>MetaH</strong>（Vestal，1998 年）能为实时航空控制软件设计人员提供指导；</li>
              <li><strong>SADL</strong>（Moriconi 等，1995 年）能为 SA 精化提供形式化基础。</li>
            </ul>`,
        },
      ],
    },
    {
      id: 'sec-sa4-uml',
      heading: '4.6 软件体系结构与UML',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>UML 简介</strong>：UML（Unified Modeling Language）是下面这些最好的建模方法中最好部分的集成——商务流程模型（Work Flow）、对象建模方法、软构件建模思想。UML 是一种用可视化方法对软件系统进行描述、构造和编档的标准语言，支持用不同实现技术进行的软件开发全过程。</p>
            <p><em>课件图示：UML 的发展历史（1、2）与 UML 的结构、构造块图示。</em></p>
            <p><strong>示例——ATM 机软件</strong>：客户可以存款、取款、查询结余、修改密码和使用信用卡付款。</p>
            <ul>
              <li><strong>用例图</strong>：用于显示若干角色以及这些角色与系统提供的用例之间的连接关系。用例是系统提供的功能的描述。</li>
              <li><strong>类图</strong>：表示系统中的类和类与类之间的关系，它是对系统静态结构的描述。</li>
              <li><strong>序列图</strong>：用来反映若干个对象之间的动态协作关系，也就是随着时间的推移，对象之间是如何交互的。</li>
              <li><strong>协作图</strong>：描述对象间的协作关系，协作图跟序列图相似，显示对象间的动态合作关系。如果强调时间和顺序，则使用序列图；如果强调上下级关系，则选择协作图。这两种图合称为交互图。</li>
              <li><strong>状态图</strong>：描述类的对象所有可能的状态以及事件发生时状态的转移条件。通常，状态图是对类图的补充。</li>
              <li><strong>活动图</strong>：描述满足用例要求所要进行的活动以及活动间的约束关系，有利于识别并行活动。</li>
              <li><strong>构件图</strong>：描述代码构件的物理结构及各构件之间的依赖关系。</li>
              <li><strong>部署图</strong>：部署图定义系统中软硬件的物理体系结构。</li>
            </ul>
            <p><strong>直接使用 UML 建模</strong>：元-元模型层定义了元模型层的规格说明语言，元模型层为给定的建模语言定义规格说明，模型层用来定义特定软件系统的模型，用户对象用来构建给定模型的特定实例。</p>
            <p><strong>语义约束</strong>：由对象约束语言 OCL 表示。OCL 基于一阶谓词逻辑，每一个 OCL 表达式都处于一些 UML 模型元素的背景下（由 self 引用），可使用该元素的属性和关系作为其项（term），同时 OCL 定义了在集合（sets）、袋（bags）等上的公共操作集和遍历建模元素间关系的构造，因此，其它建模元素的属性也可以作为它的项。</p>
            <p><strong>UML 中的通用表示</strong>：① 字符串——表示有关模型的信息；② 名字——表示模型元素；③ 标号——不同于编程语言中的标号，是用于表示或说明图形符号的字符串；④ 特殊字符串——表示某一模型元素的特性；⑤ 类型表达式——声明属性、变量及参数，含义同编程语言中的类型表达式；⑥ 实体类型——它是 UML 的扩充机制，运用实体类型可定义新类型的模型元素。</p>
            <p><strong>UML 语义部分</strong>：<strong>通用元素</strong>——主要描述 UML 中各元素的语义。通用元素是 UML 中的基本构造单位，包括模型元素和视图元素，模型元素用来构造系统，视图元素构成系统表示成分；<strong>通用机制</strong>——主要描述使 UML 保持简单和概念上一致的机制的语义，包括定制、标记值、注记、约束、依赖关系、类型-实例、类型-类的对应关系等机制；<strong>通用类型</strong>——主要描述 UML 中各种类型的语义，这些类型包括布尔类型、表达式类型、列表类型、多重性类型、名字类型、坐标类型、字符串类型、时间类型、用户自定义类型等。三部分不是相互独立的，而是相互交叉重叠、紧密相连，共同构成了 UML 的完整语义。</p>
            <p><em>课件图示：直接使用 UML 建模——会议安排系统的类图、会议安排系统类接口、C2 连接件模型、细化的类图、会议安排系统的协作图。</em></p>
            <p><strong>使用 UML 扩展机制</strong>：自学。</p>`,
        },
      ],
    },
    {
      id: 'sec-sa4-hw',
      heading: '本章作业与思考题',
      blocks: [
        {
          type: 'html',
          html: `<ol><li>体系结构描述有哪些方法？有哪些标准和规范？</li><li>体系结构描述语言与程序设计语言有什么区别？</li><li>选择一个规模适中的系统，使用 UML 为其建模。</li></ol>`,
        },
      ],
    },
  ],
};

export default ch4;
