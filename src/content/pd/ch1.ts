/* 第一章 C语言概论 —— 逐节转录自 课件/PPT/第一章 C语言概论.ppt（20 页）；
   流程图符号与两个流程图例按课件原图重绘为 SVG，其余图示以「课件图示」注明。 */
import type { PdChapter } from './types';

const ch1: PdChapter = {
  id: 'ch1',
  no: '第1章',
  title: 'C语言概论',
  subtitle: 'C语言的特点 · 基本程序结构 · 词法 · 算法的概念与流程图 · 上机过程',
  lede:
    '<p>C 语言程序设计（C Language Programming）——但愿她是你知识大厦的又一块基石，但愿她是开启你智慧的又一把钥匙！本章从高级语言的概念讲起，给出 C 语言的特点与基本程序结构、词法规则，并介绍计算机算法的概念与程序流程图，最后说明 C 语言上机的完整过程。</p>',
  toc: [
    { id: 'sec-pd1-intro', text: '高级语言的概念与学习的层次', level: 2 },
    { id: 'sec-pd1-struct', text: '1.1 C语言的特点', level: 2 },
    { id: 'sec-pd1-basic', text: '1.2 C语言的基本程序结构', level: 2 },
    { id: 'sec-pd1-lex', text: '1.3 C语言的词法', level: 2 },
    { id: 'sec-pd1-algo', text: '1.4 计算机算法的概念', level: 2 },
    { id: 'sec-pd1-flow', text: '1.5 程序流程图', level: 2 },
    { id: 'sec-pd1-run', text: '1.6 C语言上机的过程', level: 2 },
    { id: 'sec-pd1-hw', text: '思考题与下一章预告', level: 2 },
  ],
  sections: [
    {
      id: 'sec-pd1-intro',
      heading: '高级语言的概念与学习的层次',
      blocks: [
        {
          type: 'html',
          html: `
            <p>计算机的语言在发展的过程中经历了<strong>三个阶段</strong>（如：表示 2+3）：</p>
            <table class="tbl">
              <thead><tr><th>阶段</th><th>表示 2+3</th><th>说明</th></tr></thead>
              <tbody>
                <tr><td>机器语言</td><td>01110000110101000010</td><td>面向机器的二进制语言，CPU 直接运行</td></tr>
                <tr><td>汇编语言</td><td>MOV AC, 3<br/>ADD AC, 2</td><td>面向机器符号化语言，翻译后运行</td></tr>
                <tr><td>高级语言</td><td>2+3</td><td>面向问题的类自然语言，翻译后运行</td></tr>
              </tbody>
            </table>
            <p><em>课件图示：高级语言程序经编译或解释系统处理，从 Source（源程序）得到 Object（目标程序）。</em></p>
            <p><strong>学习的层次</strong>：</p>
            <ul>
              <li><strong>语法</strong>——语言的基本元素、构词方法、句法、程序结构等规则的集合；</li>
              <li><strong>算法</strong>——解决特定问题的步骤描述；</li>
              <li><strong>方法</strong>——结构化程序设计的思想方法。</li>
            </ul>
            <p>「把我所考察的每一个难题，都尽可能地分成细小的部分，直到可以而且适于加以圆满解决的程度为止。」———笛卡尔（法）</p>`,
        },
      ],
    },
    {
      id: 'sec-pd1-struct',
      heading: '1.1 C语言的特点',
      blocks: [
        {
          type: 'html',
          html: `
            <p>C 语言是由 Dennis M Ritchie 和 Brian W Kernighan 于 <strong>1972 年</strong>在 B 语言的基础上提出的，他们用 C 语言重写了在 PDP-11 小型机上的 Unix，并取得了成功。</p>
            <p><strong>C语言的特点</strong>：</p>
            <ul>
              <li>C 语言功能完善、效率高；</li>
              <li>C 语言可以对硬件操作，是一种<strong>中级语言</strong>；</li>
              <li>C 语言是<strong>结构化</strong>的程序设计语言；</li>
              <li>C 语言具有丰富的数据类型和运算类型；</li>
              <li>C 语言具有良好的移植性；</li>
              <li>C 语言书写灵活，表达简洁。</li>
            </ul>`,
        },
      ],
    },
    {
      id: 'sec-pd1-basic',
      heading: '1.2 C语言的基本程序结构',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>实例</strong>：输入两个数及其算术运算关系，输出运算结果（chp1ex1）。</p>
            <pre class="code"><code>/* This is my first C program    filename:first.c */
#include  &lt;stdio.h&gt;
void  main(void)
{  char  ch;
   int    iA, iB, c;
   scanf("%d%c%d", &amp;iA, &amp;ch, &amp;iB);
   c = fun(iA, ch, iB);
   printf("%d%c%d=%d", iA, ch, iB, c);
}

int  fun(int x, char op, int y)          /* 子函数 */
{  int  z;
   switch(op)
   {  case  '+':  z = x + y;  break;
      case  '-':  z = x - y;  break;
      case  '*':  z = x * y;  break;
      case  '/':  z = x / y;
   }
   return z;                              /* 返回运算结果 */
}</code></pre>
            <p><em>课件图示：主函数 main 调用子函数 fun——程序由主函数与子函数共同组成。</em></p>
            <p><strong>程序结构说明</strong>：</p>
            <ul>
              <li>⒈程序是由<strong>函数</strong>组成的，函数是由语句组成的。其中<strong>主函数有且唯一</strong>，主函数名固定为 <code>main</code>。子函数可有可无，也可以有多个；</li>
              <li>⒉Ｃ语言的<strong>系统构词必须用小写</strong>，用户构词可以大小写混用，各词之间用一个或几个空格分隔；</li>
              <li>⒊C 语言的语句用<strong>；作为结束</strong>，因此一句可以用一行或几行书写，但不能割裂构词；</li>
              <li>⒋程序中可通过 <code>/* …（注释内容）… */</code> 包含对程序的注释。编译时忽略注释，不产生代码；</li>
              <li>⒌程序中可以包含<strong>编译预处理命令</strong>。</li>
            </ul>`,
        },
      ],
    },
    {
      id: 'sec-pd1-lex',
      heading: '1.3 C语言的词法',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>⒈ C语言的字符集</strong>：</p>
            <ul>
              <li>⑴字母：A、a、B、b…、Z、z，共 <strong>52</strong> 个；</li>
              <li>⑵数字符号：0、1…、9，共 <strong>10</strong> 个；</li>
              <li>⑶特殊符号：+、-、*、/…</li>
            </ul>
            <p><strong>⒉系统保留字</strong>——系统占用词（共 <strong>32</strong> 个）：<code>auto、break、case、char、const、continue、default、do、double、else、enum、extern、float、for、goto、if、int、long、register、return、short、signed、sizeof、static、struct、switch、typedef、union、unsigned、void、volatile、while</code>。建议不要使用：<code>define、undef、include、ifdef、ifndef、endif、line、error、elif、pragma</code>。</p>
            <p><strong>⒊标识符（用户构词规则）</strong>——作用：用户为各种自定义数据命名。组成规则：</p>
            <ul>
              <li>⑴由字母和数字以及下划线 <code>_</code> 组成；</li>
              <li>⑵以字母和下划线 <code>_</code> 开头；</li>
              <li>⑶长度不超过 <strong>31</strong> 个字符；</li>
              <li>⑷不能使用保留字。</li>
            </ul>
            <p>合法标识符如：<code>a、a1、b、_iArea、_fLoad、iStatus、faS</code>；非法如：<code>2Ab</code>、<code>int</code>、<code>a/1</code>。注意：系统<strong>区分大小写字母</strong>——<code>aBc</code> 与 <code>Abc</code> 是不同的标识符。</p>`,
        },
      ],
    },
    {
      id: 'sec-pd1-algo',
      heading: '1.4 计算机算法的概念',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>⒈算法（Algorithm）的定义</strong>：广义地讲，算法是解决问题的逻辑步骤，是对特定问题求解步骤的一种描述。计算机算法：是用程序解决问题的逻辑步骤，是指令的有限序列。</p>
            <p>只有通过算法能够描述出来的问题，才能够通过计算机求解。能够用算法描述的问题称为<strong>可以形式化的问题</strong>。</p>
            <p><strong>正确的算法有三个条件</strong>：</p>
            <ul>
              <li>⑴每个逻辑步骤有可以实现的语句来完成；</li>
              <li>⑵每个步骤间的关系是唯一的；</li>
              <li>⑶算法要能终止（防止死循环）。</li>
            </ul>
            <p><strong>算法的两个关键要素</strong>：动作（Action）；顺序（Order）。</p>
            <p><strong>算法举例</strong>：</p>
            <ul>
              <li>⒈求数列 n=1+2+…+m 的值 n，当 n&gt;10000 时结束。步骤：<br/>S1: 初始化 0→n，0→t；<br/>S2: t+1→t，n+t→n；<br/>S3: n&gt;10000? 满足到 S4，否则到 S2；<br/>S4: OUTPUT n。</li>
              <li>⒉欧几里德求 m、n（m&gt;n）的最大公约数算法：<br/>S1: m Mod n→k；<br/>S2: k 不为 0：n→m，k→n（原除数变成新的被除数，余数变成新的除数），重复 S1；否则：到 S3；<br/>S3: 输出 n 的值为最大公约数。</li>
            </ul>
            <p><strong>⒉算法与计算方法</strong>：计算方法（Computational Method）是求数学近似解的方法，如 sinX = X − X³/3! + X⁵/5! − X⁷/7! + …；算法（Algorithm）是逻辑步骤，解决问题的过程。</p>
            <p><strong>⒊算法的特征</strong>：</p>
            <ul>
              <li><strong>有穷性</strong>：在有限的时间和有限的资源下完成算法；</li>
              <li><strong>确定性</strong>：各步骤之间的关系要确定；</li>
              <li><strong>有输入</strong>：有 0 到多个原始数据输入；</li>
              <li><strong>有输出</strong>：有结果输出；</li>
              <li><strong>可行性</strong>：可以编程实现；</li>
              <li><strong>高效性</strong>：执行速度快、占用资源少；</li>
              <li><strong>健壮性</strong>：对数据响应正确。</li>
            </ul>
            <p><strong>算法确定性示例</strong>：从 a 出发经三岔路口 b 去图书馆 l，若「走近路」「路过医院」「路过教室」三种判断条件重叠，可能得到死过程（走到医院 h 或教室 s 而不是图书馆）——只有把条件写成互斥且完备的形式（如 <code>if(to h) b→h,h→l; else if(to s) b→s,s→l; else if(d min) b→l; end</code>），算法才是确定的。</p>
            <p><strong>⒋算法的表示</strong>：自然语言；伪代码；图形工具——流程图。</p>`,
        },
      ],
    },
    {
      id: 'sec-pd1-flow',
      heading: '1.5 程序流程图',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>概念</strong>：以特定的图形符号加上说明，表示算法的图，称为流程图或框图。<strong>规则</strong>：从上到下，从左到右。符号及其意义：</p>
            <figure class="fig">
              <svg viewBox="0 0 760 150" role="img" aria-label="程序流程图的七种符号及其意义">
                <g style="font-family:var(--font)" font-size="12.5">
                  <g fill="none" stroke="var(--ink-2)" stroke-width="1.5">
                    <rect x="18" y="26" width="70" height="30" rx="15"/>
                    <rect x="128" y="26" width="70" height="30"/>
                    <polygon points="262,26 316,26 336,41 316,56 262,56 242,41"/>
                    <polygon points="380,12 438,12 456,41 438,70 380,70 362,41"/>
                    <polygon points="500,26 580,26 560,56 480,56"/>
                    <rect x="614" y="18" width="72" height="46" style="stroke:var(--ink-2)" stroke-dasharray="4 3"/>
                    <rect x="628" y="26" width="44" height="30"/>
                  </g>
                  <g fill="var(--ink)" text-anchor="middle" font-weight="700">
                    <text x="53" y="45">开始</text>
                    <text x="163" y="45">处理</text>
                    <text x="289" y="45">判断</text>
                    <text x="409" y="34">输入/输出</text>
                    <text x="530" y="45">过程</text>
                    <text x="650" y="45">端点</text>
                  </g>
                  <g fill="var(--ink-2)" text-anchor="middle" font-size="11.5">
                    <text x="53" y="88">端点框</text>
                    <text x="163" y="88">处理框</text>
                    <text x="289" y="88">判断框</text>
                    <text x="409" y="88">I/O 框</text>
                    <text x="530" y="88">过程框</text>
                    <text x="650" y="88">子图边界</text>
                  </g>
                  <g stroke="var(--ink-2)" stroke-width="1.5" fill="none">
                    <line x1="20" y1="116" x2="120" y2="116"/>
                    <path d="M120 116 l-9 -4 v8 z" fill="var(--ink-2)" stroke="none"/>
                    <circle cx="176" cy="116" r="9"/>
                    <circle cx="210" cy="116" r="9"/>
                    <line x1="185" y1="116" x2="201" y2="116"/>
                  </g>
                  <text x="176" y="142" fill="var(--ink-2)" text-anchor="middle" font-size="11.5">流程线与连接点（圈内字母对应）</text>
                </g>
              </svg>
              <p class="fig-cap">流程图符号（依课件原图重绘）：端点框、处理框、判断框、I/O 框、过程框、流程线与连接点。</p>
            </figure>
            <p><strong>流程图描述算法举例</strong>：</p>
            <ul>
              <li>⒈用框图描述函数 y = 1（x ≥ 0）；y = −1（x &lt; 0）：输入 x → 判断 x≥0? → yes：y=1 / no：y=−1 → 经连接点 A 汇合 → 输出 y（见课件框图）。</li>
              <li>⒉用框图描述求 s=1+2+…+100 的算法：start → 1→t，0→s → s+t→s，t+1→t → 判断 t&gt;100? → no 回到循环体（连接点 A0）、yes → Output s → end。</li>
            </ul>`,
        },
      ],
    },
    {
      id: 'sec-pd1-run',
      heading: '1.6 C语言上机的过程',
      blocks: [
        {
          type: 'html',
          html: `
            <p>上机过程：先<strong>编辑</strong>得到源程序 f.c（Source），再<strong>编译</strong>——若有语法错则回到编辑修改，无错则得到目标程序 f.obj（Object）；随后<strong>连接、运行</strong>——若有逻辑错则回到编辑修改，无错则得到可执行程序 f.exe（Executable）。</p>
            <figure class="fig">
              <svg viewBox="0 0 700 170" role="img" aria-label="C语言上机过程：编辑→编译→连接运行">
                <defs>
                  <marker id="pd1-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                    <path d="M0,0 L10,5 L0,10 z" style="fill:var(--ink-3)"/>
                  </marker>
                </defs>
                <g style="font-family:var(--font)" font-size="12.5">
                  <g style="fill:var(--panel-2);stroke:var(--deck-accent)" stroke-width="1.6">
                    <rect x="30" y="58" width="110" height="44" rx="10"/>
                    <rect x="200" y="58" width="110" height="44" rx="10"/>
                    <rect x="430" y="58" width="130" height="44" rx="10"/>
                  </g>
                  <g fill="var(--ink)" font-weight="700" text-anchor="middle">
                    <text x="85" y="78">编辑</text>
                    <text x="255" y="78">编译</text>
                    <text x="495" y="78">连接、运行</text>
                  </g>
                  <g fill="var(--ink-2)" font-size="11.5" text-anchor="middle">
                    <text x="85" y="94">f.c（Source）</text>
                    <text x="255" y="94">f.obj（Object）</text>
                    <text x="495" y="94">f.exe（Executable）</text>
                  </g>
                  <g stroke="var(--ink-3)" stroke-width="1.4" fill="none" marker-end="url(#pd1-arr)">
                    <path d="M140,80 L200,80"/>
                    <path d="M310,80 L430,80"/>
                  </g>
                  <g fill="var(--ink-2)" font-size="11.5" text-anchor="middle">
                    <text x="380" y="24">语法错？有 → 回编辑；无 → 继续</text>
                    <text x="380" y="158">逻辑错？有 → 回编辑；无 → end</text>
                  </g>
                  <g stroke="var(--ink-3)" stroke-width="1.2" fill="none" stroke-dasharray="4 3">
                    <path d="M255,58 L255,34 L85,34 L85,58" marker-end="url(#pd1-arr)"/>
                    <path d="M495,102 L495,140 L85,140 L85,102" marker-end="url(#pd1-arr)"/>
                  </g>
                </g>
              </svg>
              <p class="fig-cap">C 语言上机过程（依课件原图重绘）：编辑 → 编译（查语法错）→ 连接、运行（查逻辑错）。</p>
            </figure>`,
        },
      ],
    },
    {
      id: 'sec-pd1-hw',
      heading: '思考题与下一章预告',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>思考题</strong>：</p>
            <ul>
              <li>⒈用程序流程图描述算法 y = 1（x &gt; 0）；y = 0（x = 0）；y = −1（x &lt; 0）；</li>
              <li>⒉用框图描述欧几里德求最大公约数算法；</li>
              <li>⒊从生活或学习中找出可以用算法描述的一件事，并通过符号化的伪语言以及框图加以抽象的描述。</li>
            </ul>
            <div class="callout key">
              <p class="callout-h">The Tip of Chap. 2</p>
              <p>数据表示及其类型 · 运算及表达式 · 输入/输出 · 程序的基本处理方式。</p>
            </div>`,
        },
      ],
    },
  ],
};

export default ch1;
