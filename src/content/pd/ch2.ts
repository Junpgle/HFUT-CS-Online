/* 第二章 C语言基础 —— 逐节转录自 课件/PPT/第二章 C语言基础.ppt（30 页）；
   圆柱体引例的建模公式、内存结构等图示依课件原图转录。 */
import type { PdChapter } from './types';

const ch2: PdChapter = {
  id: 'ch2',
  no: '第2章',
  title: 'C语言基础',
  subtitle: '数据及其表示（常量与变量） · 基本运算与表达式 · 基本输入输出',
  lede:
    '<p>程序是对数据按照算法处理，并输出结果的过程。本章围绕程序处理数据的三个基本问题展开：⒈数据及其表示方法——数据构造；⒉数据的基本运算——数据处理；⒊基本输入输出。</p>',
  toc: [
    { id: 'sec-pd2-intro', text: '引例：从问题到程序', level: 2 },
    { id: 'sec-pd2-type', text: '2.1 基本数据类型', level: 2 },
    { id: 'sec-pd2-const', text: '2.2 常量（Constant）及其类型', level: 2 },
    { id: 'sec-pd2-var', text: '2.3 变量（Variable）', level: 2 },
    { id: 'sec-pd2-op', text: '2.4 基本运算与表达式', level: 2 },
    { id: 'sec-pd2-io', text: '2.5 数据的输入输出（Input & Output）', level: 2 },
    { id: 'sec-pd2-ex', text: '综合例题：求一元二次方程的根', level: 2 },
  ],
  sections: [
    {
      id: 'sec-pd2-intro',
      heading: '引例：从问题到程序',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>已知</strong>：有一圆柱体，底半径为 r，圆柱高为 h。<strong>求</strong>：底面积、表面积，底周长、体积。</p>
            <p>⑴定义变量：fAread（底面积）、fAreas（表面积）、fLen（底周长）、fV（体积）——输出；r、h——输入。</p>
            <p>⑵建立模型：</p>
            <div class="formula">fLen = 2πr；fAread = πr<sup>2</sup>；fAreas = 2πr<sup>2</sup> + 2πr×h = 2fAread + fLen×h；fV = fAread×h</div>
            <p><em>课件图示：程序处理数据的基本过程——开始 → 输入数据（外设 → 内存，如 x=2, y=3）→ 数据处理（z=x+y）→ 输出数据（内存 → 外设，如 5）→ 结束；其基础是数据构造。</em></p>`,
        },
      ],
    },
    {
      id: 'sec-pd2-type',
      heading: '2.1 基本数据类型',
      blocks: [
        {
          type: 'html',
          html: `
            <p>数据是对客观事物特征抽象的符号化表示。客观事物不同，表示的方法也不同（人数以整数表示，圆面积用小数表示，灯的状态用开关表示，信件要用文字表示），计算机的处理方法也不同。因此根据程序处理的数据对象，应规定数据的<strong>类型</strong>。</p>
            <p>计算机由于工程的限制，只能在<strong>有限精度和有限范围</strong>内在工程上近似地描述操作的对象——数据。</p>
            <p>数据类型决定了数据的如下特征：</p>
            <ul>
              <li>⑴数据的外部表示方式和内部存储方式不同；</li>
              <li>⑵表示的范围和精度不同；</li>
              <li>⑶对数据的处理方式不同。</li>
            </ul>
            <p><strong>C语言的数据类型</strong>：</p>
            <ul>
              <li><strong>基本类型</strong>——整型 int、字符型 char、浮点型 float / double；</li>
              <li><strong>构造类型</strong>——数组、结构、联合、枚举型 enum；</li>
              <li><strong>指针类型</strong>；</li>
              <li><strong>空类型</strong> void。</li>
            </ul>`,
        },
      ],
    },
    {
      id: 'sec-pd2-const',
      heading: '2.2 常量（Constant）及其类型',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>⒈常量的概念</strong>：在程序中不能改变的量称为常量。常量的类型由数据的外部表现形式确定。</p>
            <p><strong>⑴整型常量的表示</strong>——根据表示的范围可以有一般整型和长整型，还可以表示为十进制、八进制、十六进制形式：</p>
            <table class="tbl">
              <thead><tr><th>进制</th><th>一般整型表示举例</th><th>范围</th><th>字节数</th></tr></thead>
              <tbody>
                <tr><td>十进制</td><td>2304</td><td>-32768 ~ +32767</td><td>2</td></tr>
                <tr><td>八进制</td><td>04400</td><td>0 ~ 0177777</td><td>2</td></tr>
                <tr><td>十六进制</td><td>0xaa00</td><td>0x0000 ~ 0xffff</td><td>2</td></tr>
              </tbody>
            </table>
            <table class="tbl">
              <thead><tr><th>进制</th><th>长整型表示举例（后缀 l/L）</th><th>范围</th><th>字节数</th></tr></thead>
              <tbody>
                <tr><td>十进制</td><td>-21234l</td><td>-2<sup>31</sup> ~ +2<sup>31</sup>-1</td><td>4</td></tr>
                <tr><td>八进制</td><td>04400l</td><td>0 ~ 037777777777</td><td>4</td></tr>
                <tr><td>十六进制</td><td>0XAA00L</td><td>0x0000 ~ 0xffffffff</td><td>4</td></tr>
              </tbody>
            </table>
            <p><strong>⑵浮点型常量的表示</strong>（只有十进制表示）——有两种表示方式：小数表示方法、指数表示方法。一般表示为双精度，单精度浮点数需加后缀 f。</p>
            <ul>
              <li>小数表示方式规则：一个小数点、符号和至少一位数字。如 <code>-2.0f、1.、0.11113、-15.f</code>；</li>
              <li>指数表示方式规则：<code>ne±mf</code> 表示 n×10<sup>±m</sup>。n 为小数部分（整型常量或小数形式表示的实型常量）；指数部分为两位整数。n 决定精度（一般为 7 位）；m 决定范围：10<sup>-38</sup> 到 10<sup>+38</sup>。当超过范围时称为「溢出」：小于 10<sup>-38</sup> 称为下溢，当 0 处理；大于 10<sup>+38</sup> 称为上溢，系统出错。</li>
            </ul>
            <p>如：123.456 表示为 <code>0.123456E+3</code>；-10000000f 表示为 <code>-1e7f</code>；0.0000123 表示为 <code>0.123e-4</code>。</p>
            <p><strong>⑶字符常量的表示</strong>——表示 ASCII 字符集中的一个字符，撇号定界的一个字符，如 <code>'a'</code>、<code>'!'</code>。字符有一个整型值，即该字符的 ASCII 码值：<code>'a'</code> 的值为 <strong>97</strong>。</p>
            <p><strong>⑷字符串常量的表示</strong>——双引号定界的字符序列，如 <code>"HEFEI"</code>、<code>"Hello!"</code>。系统会在最后一个字符后加 NULL（ASCII 码值为 0），标志字符串的结束。</p>
            <p><code>'a'</code> 和 <code>"a"</code> 的区别？内部：<code>'a'</code> 为 97；<code>"a"</code> 为 97、NULL（两个字节）。<code>"Hello!"</code> 在内存中的存储结构：H(72)、e(101)、l(108)、l(108)、o(111)、!(33)、\\0(0)。</p>
            <p><strong>⑸转义字符</strong>——C 语言表示字符的特殊方法，用来表示 ASCII 字符集中的控制字符以及系统占用字符（如 "）。表示方法：① <code>\\字符</code>；② <code>\\八进制（十六进制整数，小于 256）</code>，表示八进制或十六进制数作为 ASCII 码值所对应的字符：</p>
            <table class="tbl">
              <thead><tr><th>转义字符</th><th>含义</th><th>转义字符</th><th>含义</th></tr></thead>
              <tbody>
                <tr><td>\\a</td><td>表示 BELL</td><td>\\\\</td><td>表示 \\</td></tr>
                <tr><td>\\b</td><td>表示 BACKSPACE</td><td>\\?</td><td>表示 ?</td></tr>
                <tr><td>\\n</td><td>表示换行</td><td>\\'</td><td>表示 '</td></tr>
                <tr><td>\\r</td><td>表示回车</td><td>\\"</td><td>表示 "</td></tr>
                <tr><td>\\t</td><td>表示 TAB</td><td>\\0</td><td>表示 NULL</td></tr>
              </tbody>
            </table>
            <p>如 <code>\\x41</code>、<code>\\101</code> 代表 'A'；<code>printf("\\007");</code> 输出响铃；<code>printf("语文\\n数学\\n");</code> 分两行输出。</p>`,
        },
      ],
    },
    {
      id: 'sec-pd2-var',
      heading: '2.3 变量（Variable）',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>⒈变量的概念</strong>——变量是在程序中可以改变的量，变量具有三个特征：</p>
            <ul>
              <li>⑴变量有名，用标识符命名；</li>
              <li>⑵变量有类型；</li>
              <li>⑶在程序中可以改变。</li>
            </ul>
            <p>变量对应于内存中某一地址下的几个单元，变量名作为程序引用变量的标志。变量的类型确定了变量在内存中所占单元的数量及其表示的方式。变量的地址可以通过 <code>&amp;</code> 运算获得。如 <code>short a;</code>——短整型变量占两个内存单元，<code>&amp;a</code> 对应 a 的地址。<strong>变量必须先说明后使用！</strong>说明的目的是确定变量的名字和类型。</p>
            <p><strong>⒉变量的说明</strong>——形式：<code>type 变量名表；</code>（以逗号分隔的标识符表），如 <code>int a,b,c;</code>。type 是类型说明词，对于整型和字符型可加修饰说明。基本类型说明符：int、char、float、double。修饰说明和基本说明的对应关系：</p>
            <table class="tbl">
              <thead><tr><th>修饰说明词</th><th>可用于修饰的基本类型</th></tr></thead>
              <tbody>
                <tr><td>signed / unsigned</td><td>int、char</td></tr>
                <tr><td>short / long</td><td>int</td></tr>
              </tbody>
            </table>
            <p><strong>⑴整型变量说明</strong>——说明词及性质如下：</p>
            <table class="tbl">
              <thead><tr><th>说明词</th><th>含义</th><th>范围</th><th>Byte</th></tr></thead>
              <tbody>
                <tr><td>int</td><td>有符号一般整型</td><td>-2<sup>31</sup> ~ +2<sup>31</sup>-1</td><td>4</td></tr>
                <tr><td>short [int]</td><td>有符号短整型</td><td>-32768 ~ 32767</td><td>2</td></tr>
                <tr><td>long [int]</td><td>有符号长整型</td><td>-2<sup>31</sup> ~ +2<sup>31</sup>-1</td><td>4</td></tr>
                <tr><td>unsigned</td><td>无符号一般整型</td><td>0 ~ 2<sup>32</sup>-1</td><td>4</td></tr>
                <tr><td>unsigned short</td><td>无符号短整型</td><td>0 ~ 65535</td><td>2</td></tr>
                <tr><td>unsigned long</td><td>无符号长整型</td><td>0 ~ 2<sup>32</sup>-1</td><td>4</td></tr>
              </tbody>
            </table>
            <p>如 <code>short a,b,c; int e,f,g; long _qs,num; unsigned d,e,f;</code></p>
            <p><strong>⑵字符型变量的说明</strong>：</p>
            <table class="tbl">
              <thead><tr><th>说明符</th><th>所占字节数</th><th>范围</th></tr></thead>
              <tbody>
                <tr><td>char</td><td>1</td><td>-128 ~ +127</td></tr>
                <tr><td>unsigned char</td><td>1</td><td>0 ~ 255</td></tr>
              </tbody>
            </table>
            <p><strong>⑶浮点型变量的说明</strong>——浮点型变量包含<strong>精度和范围</strong>两个概念：</p>
            <table class="tbl">
              <thead><tr><th>说明符</th><th>所占字节数</th><th>范围</th><th>精度</th></tr></thead>
              <tbody>
                <tr><td>float</td><td>4</td><td>10<sup>-38</sup> ~ 10<sup>+38</sup></td><td>7 位</td></tr>
                <tr><td>double</td><td>8</td><td>10<sup>-308</sup> ~ 10<sup>+308</sup></td><td>16 位</td></tr>
              </tbody>
            </table>
            <ul>
              <li>⑴超过精度位数后的位数值不确定。如 <code>float a; a=1.1111111111f;</code>——超出精度部分，不准确；</li>
              <li>⑵超过范围溢出（Overflow）。如 <code>float a,b,c; a=1.234e+20f; b=2.345e+21f; c=a*b;</code>——超出 10<sup>38</sup>，溢出。当运算结果大于 10<sup>+38</sup> 称为上溢，系统出错；当运算结果小于 10<sup>-38</sup> 称为下溢，当 0 处理。</li>
            </ul>`,
        },
      ],
    },
    {
      id: 'sec-pd2-op',
      heading: '2.4 基本运算与表达式',
      blocks: [
        {
          type: 'html',
          html: `
            <p>程序的核心是对数据按照算法进行处理（运算）。C 语言提供了强大的数据运算功能。数据通过运算符连接的式子称为<strong>表达式</strong>，表达式根据运算关系对数据运算，并得到一个值。</p>
            <p><strong>⒈变量赋值（Assignment）运算</strong>——格式：<code>V = expression;</code>（将 expression 的值赋给变量 V）。</p>
            <pre class="code"><code>int a = 2;        /* 说明赋值，编译时赋值 */
int b;
b = 3 + 2;        /* 说明后赋值，执行时赋值 */</code></pre>
            <ul>
              <li>⑴ <code>=</code> 是赋值号（动作）；</li>
              <li>⑵赋值运算的<strong>左值只能是变量</strong>。如 <code>a = a + 2;</code>、<code>iCount = iCount + 10;</code>；而 <code>a + 2 = 12;</code> /*Error!*/；</li>
              <li>⑶赋值号两边类型应该一致，如不一致，以变量类型转换。如 <code>int a = 2.5;</code> /* 2→a */。</li>
            </ul>
            <p><strong>⒉算术运算（Arithmetic operators）</strong>——完成各种类型数据的加、减、乘、除及求余数运算。</p>
            <p>⑴双目算术运算（两个运算对象参加的运算）：</p>
            <table class="tbl">
              <thead><tr><th>运算</th><th>运算规则</th><th>示例</th></tr></thead>
              <tbody>
                <tr><td>+</td><td>加</td><td>2 + 3</td></tr>
                <tr><td>-</td><td>减</td><td>a – b</td></tr>
                <tr><td>*</td><td>乘</td><td>2 * (-a)</td></tr>
                <tr><td>/</td><td>除</td><td>12f / 3.0f</td></tr>
                <tr><td>%</td><td>求余数</td><td>15 % 4</td></tr>
              </tbody>
            </table>
            <p>注意：<code>%</code> 只能对整型或字符型数据运算，余数符号与被除数相同，如 <code>-12 % 5</code> → -2、<code>-12 % (-5)</code>、<code>1 % 2</code>；乘号不能省略！</p>
            <p>⑵自加（Increment）、自减（Decrement）运算（单目运算）：</p>
            <table class="tbl">
              <thead><tr><th>运算符</th><th>前置</th><th>后置</th><th>运算关系</th></tr></thead>
              <tbody>
                <tr><td>++</td><td>++a</td><td>a++</td><td>a = a + 1</td></tr>
                <tr><td>--</td><td>--a</td><td>a--</td><td>a = a - 1</td></tr>
              </tbody>
            </table>
            <ul>
              <li>①运算对象只能是一个变量，如 <code>2++;</code> /* Error!*/；</li>
              <li>②前置是<strong>先运算，后引用</strong>，而后置则是<strong>先引用，后运算</strong>。如 <code>i=5; x=i++;</code> 即 <code>x=i; i=i+1;</code>；<code>i=5; x=++i;</code> 即 <code>i=i+1; x=i;</code>；</li>
              <li>③C 语言尽可能多地从左向右结合符号形成运算符（chp2ex1：<code>c=a+++b;</code>）。</li>
            </ul>
            <p>⑶算术运算赋值：</p>
            <table class="tbl">
              <thead><tr><th>运算符</th><th>表达式示例</th><th>运算关系</th></tr></thead>
              <tbody>
                <tr><td>+=</td><td>a += 3</td><td>a = a + 3</td></tr>
                <tr><td>-=</td><td>b -= c</td><td>b = b - c</td></tr>
                <tr><td>*=</td><td>a *= 2</td><td>a = a * 2</td></tr>
                <tr><td>/=</td><td>s /= t</td><td>s = s / t</td></tr>
                <tr><td>%=</td><td>a %= 5</td><td>a = a % 5</td></tr>
              </tbody>
            </table>
            <ul>
              <li>①运算对象的左值只能是一个变量，如 <code>(a+2) += 5;</code> /* Error !*/；</li>
              <li>② <code>%=</code> 运算的对象，必须是整型或字符型。</li>
            </ul>
            <p>⑷算术运算的说明——①运算中的类型问题：运算对象的类型相同，运算结果取运算对象相同的类型，如 <code>int a; float b; a=2/3;</code> 得 0；<code>b=5.0f/2.0f;</code> 得 2.5。运算对象的类型不同，先将低等类型转换为高等类型后再进行运算，运算结果取高等类型。等级原则（由低到高）：char → short → long int → float → double，如 <code>2*16.0+15.0</code> 按 double 运算。运算时可以实行类型的<strong>强制转换</strong>，格式如下：<code>(type)expression</code>，只对当前表达式起作用，如 <code>(float)a/(int)'c'+(float)(a+10)</code>、<code>2+(int)fSum</code>。又如 <code>int a; float b; b=2/3;</code>（b 得 0）、<code>a=5.0f/2.0f;</code>（a 得 2）。</p>
            <p>类型转换举例：<code>int a; float b; int c; c = a * 1.0 + b * 5 + (float)'A';</code>——a*1.0 得 double，b*5 得 float 提升为 double，(float)'A' 提升为 double，整个表达式为 double；赋值给 int 的 c 时以左值类型为准转换。注意：<strong>赋值运算右值表达式的类型转换以左值变量的类型为准</strong>。</p>
            <p>②运算的优先级——表达式的运算是分步骤进行的，当一个表达式中出现多种运算时，存在优先级的问题。算术运算的优先级如下：</p>
            <div class="formula">++、--、(type)（单目运算）→ *、/、% → +、- → =、op=</div>
            <p>相同优先级，结合顺序从左到右；赋值类（=、op=）相同优先级，结合顺序<strong>从右到左</strong>。如 <code>3*4+6/a-6%3;</code>；<code>int a,b=2,c=2; a=b*=c+=2;</code> 即 <code>c=c+2; b=b*c; a=b;</code>。可以用 ( ) 调整优先级。</p>
            <p><strong>⒊条件运算</strong>——格式：<code>e1 ? e2 : e3</code>。e1、e2、e3 为表达式，当 e1 非 0 时，运算结果取 e2 的值；当 e1 为 0 时，取 e3 的值。如 <code>int a=2,b=3,c=-1,d; d=a?b:c;</code> 得 3；<code>a=0; d=a?b:c;</code> 得 -1。</p>
            <p><strong>⒋逗号表达式</strong>——格式：<code>e1, e2, e3, …, en</code>。用逗号分隔的表达式，计算顺序从左到右，表达式取值为 en。如 <code>x=(a=5,a+6)*10;</code>。</p>
            <p><strong>⒌ sizeof 运算</strong>——形式：<code>sizeof 数据对象;</code> 或 <code>sizeof(类型说明符);</code>。如 <code>int a,b,c; b=sizeof a;</code> /*b 的值为 4*/；<code>c=sizeof(float);</code> /*c 的值为 4*/。</p>
            <p><strong>C语言常用数学函数</strong>——为方便用户使用，C 语言系统定义了大量函数。数学函数的原型定义在系统的 math.h 头文件中，使用时应在程序的开始处加 <code>#include &lt;math.h&gt;</code>：</p>
            <table class="tbl">
              <thead><tr><th>函数</th><th>数学含义</th></tr></thead>
              <tbody>
                <tr><td>sin(x)</td><td>sinX</td></tr>
                <tr><td>cos(x)</td><td>cosX</td></tr>
                <tr><td>tan(x)</td><td>tgX</td></tr>
                <tr><td>fabs(x)</td><td>|x|</td></tr>
                <tr><td>pow(x,y)</td><td>x<sup>y</sup></td></tr>
                <tr><td>sqrt(x)</td><td>√x</td></tr>
                <tr><td>log(x)</td><td>lnx</td></tr>
                <tr><td>log10(x)</td><td>log<sub>10</sub>x</td></tr>
              </tbody>
            </table>
            <p>使用方法：作为一个运算项参加表达式运算；函数的参数（自变量）、函数的值都是 double 类型。如 <code>z=sqrt(sin(x)*sin(x)+cos(y)*cos(y))</code>。</p>`,
        },
      ],
    },
    {
      id: 'sec-pd2-io',
      heading: '2.5 数据的输入输出（Input & Output）',
      blocks: [
        {
          type: 'html',
          html: `
            <p>C 语言<strong>没有输入输出语句</strong>，输入输出是通过系统定义的标准函数来实现的。I/O 函数的原型定义在 stdio.h 头文件中，在引用 I/O 函数时，应在程序开始处加预处理语句包含头文件：<code>#include &lt;stdio.h&gt;</code>。</p>
            <p><strong>⒈输入输出的概念</strong>——输入输出指的是内存变量或程序和外部设备间的数据交换。<em>课件图示：内存 ↔（输入/输出）↔ 外设。</em>输入输出函数要描述：⑴输入输出的量；⑵输入输出的格式；⑶输入输出的设备。</p>
            <p><strong>⒉格式输入输出函数</strong></p>
            <p>⑴输出函数 printf( )——格式：<code>printf("输出格式字符串", 输出项列表);</code>。输出格式字符串可包含以下内容：</p>
            <ul>
              <li>①普通字符，如 <code>a=</code>；</li>
              <li>②转义字符，如 <code>\\n</code>。对于普通字符和转义字符在相应位置原样输出，其中 % 用 %%。如 <code>printf("\\nabcd%%");</code> 输出结果为 <code>abcd%</code>；</li>
              <li>③格式说明符组，说明输出项列表中的各项的输出格式，用 % 为开始标志，如 <code>%-7.5f</code>。如 <code>printf("三角形面积 = %7.2f\\n", fArea);</code>。</li>
            </ul>
            <p>格式说明类型表：</p>
            <table class="tbl">
              <thead><tr><th>格式说明符</th><th>说明量的类型</th></tr></thead>
              <tbody>
                <tr><td>d、i、o、x、u</td><td>整型</td></tr>
                <tr><td>c</td><td>字符型</td></tr>
                <tr><td>s</td><td>字符串</td></tr>
                <tr><td>f、e、g</td><td>浮点型</td></tr>
              </tbody>
            </table>
            <p>格式说明符应和输出的列表项对应，产生相应的输出。其中输出的表项应与格式说明符类型一致，如 <code>printf("a=%5d\\nb=%f", 2+3, 5.34f);</code></p>
            <p>格式说明串的一般形式和意义：<code>% - m.n l 格式类型字符（一个字母）</code>——</p>
            <ul>
              <li>对齐方式：缺省为右对齐，- 为左对齐；</li>
              <li>宽度.精度（位数）：宽度为输出总列数，精度为小数位数（或字符位数）；</li>
              <li>类型长度：缺省短整型，l 表示 long 或 double，h 表示短整型。</li>
            </ul>
            <pre class="code"><code>#include  &lt;stdio.h&gt;
void  main(void)
{  float   a;
   a = 1.232326f;
   printf("a=%10.4f", a);        /* CHAP2EX2 */
}</code></pre>
            <p>⑵输入函数 scanf( )——格式：<code>scanf("格式说明字符串", 输入变量地址列表);</code>。说明：</p>
            <ul>
              <li>①m 域宽可自动截取，空格作为各数据项的分隔符。<code>scanf("%3d%3d",&amp;i,&amp;j);</code> 输入 123456 时，i=123、j=456；</li>
              <li>②实型变量输入时<strong>不能规定精度</strong>：<code>scanf("%7.2f",&amp;a);</code> ERROR!；</li>
              <li>③数据输入用空格分隔，当格式字符用其他字符隔离，输入时也应在对应位置上输入相同的字符。如 <code>scanf("i=%d,j=%d",&amp;i,&amp;j);</code>；</li>
              <li>④输入项只能是变量，且必须用<strong>地址形式</strong>。</li>
            </ul>
            <p><strong>⒊字符输入输出函数</strong>——输入：<code>getchar( );</code> 输出：<code>putchar( );</code></p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
void main(void)
{  char ch1, ch2='\n';
   ch1 = getchar();
   putchar(ch1);
   putchar(ch2);
   putchar('a');
}</code></pre>`,
        },
      ],
    },
    {
      id: 'sec-pd2-ex',
      heading: '综合例题：求一元二次方程的根',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>⒈求一元二次方程 ax<sup>2</sup>+bx+c=0 的根</strong>：</p>
            <pre class="code"><code>#include &lt;math.h&gt;
#include &lt;stdio.h&gt;
void main(void)
{     float a, b, c, x1, x2;
      scanf("%f,%f,%f", &amp;a, &amp;b, &amp;c);
      x1 = (-b + (float)sqrt(b * b - 4.f * a * c)) / (2.0f * a);
      x2 = (-b - (float)sqrt(b * b - 4.f * a * c)) / (2.0f * a);
      printf("x1=%7.2f\nx2=%7.2f", x1, x2);
}</code></pre>
            <p><em>课件图示：当 b*b−4·a·c &lt; 0 时程序出错——如何构造条件、根据条件实现不同算法，引出第三章「C语言的基本控制结构」。</em></p>`,
        },
      ],
    },
  ],
};

export default ch2;
