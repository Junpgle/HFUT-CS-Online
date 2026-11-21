/* 第三章 C语言的基本控制结构 —— 逐节转录自 课件/PPT/第三章 C语言的基本控制结构.ppt（53 页）；
   三种控制结构框图依课件原图重绘为 SVG，作业 9/16/20/28 的公式按课件原图转录。 */
import type { PdChapter } from './types';

const ch3: PdChapter = {
  id: 'ch3',
  no: '第3章',
  title: 'C语言的基本控制结构',
  subtitle: '三种控制结构 · 关系与逻辑运算 · 分支与循环 · 枚举法与迭代法',
  lede:
    '<p>Chapter 3 Control Flow。第二章求一元二次方程的根遇到了 <code>b*b-4ac&lt;0?</code> 的问题：如何构造条件？如何根据条件实现不同算法？——这就是本章要解决的控制结构问题。结构化程序设计是软件设计的第三次革命，其基础是采用三种程序的控制结构。</p>',
  toc: [
    { id: 'sec-pd3-struct', text: '3.1 程序的三种控制结构', level: 2 },
    { id: 'sec-pd3-rellog', text: '3.2 关系运算和逻辑运算', level: 2 },
    { id: 'sec-pd3-branch', text: '3.3 分支结构（选择结构 Selection）', level: 2 },
    { id: 'sec-pd3-loop', text: '3.4 循环结构（Repetition）', level: 2 },
    { id: 'sec-pd3-method', text: '程序设计的基本方法：枚举法与迭代法', level: 2 },
    { id: 'sec-pd3-hw', text: '第三章作业', level: 2 },
  ],
  sections: [
    {
      id: 'sec-pd3-struct',
      heading: '3.1 程序的三种控制结构',
      blocks: [
        {
          type: 'html',
          html: `
            <p>结构化程序设计是软件设计的第三次革命。结构化程序设计的基础是采用三种程序的控制结构。1966 年 BÖHM &amp; Jacopini 证明：只要三种控制结构就能表达用一个入口和一个出口框图所能表达的任何程序逻辑。</p>
            <figure class="fig">
              <svg viewBox="0 0 760 150" role="img" aria-label="顺序、选择、当型循环、直到循环四种结构的框图">
                <defs>
                  <marker id="pd3-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
                    <path d="M0,0 L10,5 L0,10 z" style="fill:var(--ink-3)"/>
                  </marker>
                </defs>
                <g style="font-family:var(--font)" font-size="12">
                  <text x="80" y="18" fill="var(--ink)" text-anchor="middle" font-weight="700">顺序 Sequence</text>
                  <g fill="none" stroke="var(--ink-2)" stroke-width="1.4">
                    <rect x="45" y="30" width="70" height="26"/>
                    <rect x="45" y="72" width="70" height="26"/>
                  </g>
                  <g fill="var(--ink)" text-anchor="middle">
                    <text x="80" y="47">f;</text>
                    <text x="80" y="89">g;</text>
                  </g>
                  <text x="80" y="126" fill="var(--ink-2)" text-anchor="middle" font-size="11">算法描述：f; g;</text>

                  <text x="240" y="18" fill="var(--ink)" text-anchor="middle" font-weight="700">选择 Selection</text>
                  <g fill="none" stroke="var(--ink-2)" stroke-width="1.4">
                    <polygon points="240,28 277,46 240,64 203,46"/>
                    <rect x="157" y="92" width="66" height="24"/>
                    <rect x="257" y="92" width="66" height="24"/>
                  </g>
                  <g fill="var(--ink)" text-anchor="middle">
                    <text x="240" y="50">e?</text>
                    <text x="190" y="108">f;</text>
                    <text x="290" y="108">g;</text>
                  </g>
                  <g fill="none" stroke="var(--ink-3)" stroke-width="1.3" marker-end="url(#pd3-arr)">
                    <path d="M217,58 L192,92"/>
                    <path d="M263,58 L288,92"/>
                  </g>
                  <g fill="var(--ink-2)" font-size="11">
                    <text x="192" y="80" text-anchor="middle">yes</text>
                    <text x="290" y="80" text-anchor="middle">no</text>
                  </g>
                  <text x="240" y="140" fill="var(--ink-2)" text-anchor="middle" font-size="11">if(e) f; else g;</text>

                  <text x="470" y="16" fill="var(--ink)" text-anchor="middle" font-weight="700">当型循环</text>
                  <g fill="none" stroke="var(--ink-2)" stroke-width="1.4">
                    <polygon points="470,40 500,55 470,70 440,55"/>
                    <rect x="536" y="43" width="58" height="24"/>
                  </g>
                  <g fill="var(--ink)" text-anchor="middle">
                    <text x="470" y="59">c?</text>
                    <text x="565" y="59">f</text>
                  </g>
                  <g fill="none" stroke="var(--ink-3)" stroke-width="1.3" marker-end="url(#pd3-arr)">
                    <path d="M500,55 L536,55"/>
                    <path d="M565,43 L565,26 L470,26 L470,40"/>
                    <path d="M470,70 L470,104"/>
                  </g>
                  <g fill="var(--ink-2)" font-size="11" text-anchor="middle">
                    <text x="516" y="48">YES</text>
                    <text x="484" y="96">NO</text>
                    <text x="470" y="132">while c is true do f</text>
                  </g>

                  <text x="665" y="16" fill="var(--ink)" text-anchor="middle" font-weight="700">直到循环</text>
                  <g fill="none" stroke="var(--ink-2)" stroke-width="1.4">
                    <rect x="600" y="43" width="50" height="24"/>
                    <polygon points="695,40 725,55 695,70 665,55"/>
                  </g>
                  <g fill="var(--ink)" text-anchor="middle">
                    <text x="625" y="59">f</text>
                    <text x="695" y="59">c?</text>
                  </g>
                  <g fill="none" stroke="var(--ink-3)" stroke-width="1.3" marker-end="url(#pd3-arr)">
                    <path d="M650,55 L665,55"/>
                    <path d="M695,40 L695,26 L625,26 L625,43"/>
                    <path d="M725,55 L748,55"/>
                  </g>
                  <g fill="var(--ink-2)" font-size="11" text-anchor="middle">
                    <text x="652" y="38">YES</text>
                    <text x="737" y="48">NO</text>
                    <text x="695" y="132">do f until c is false</text>
                  </g>
                </g>
              </svg>
              <p class="fig-cap">三种控制结构框图（依课件原图重绘）：顺序、选择（分支）、循环（当型与直到型）。</p>
            </figure>
            <p>三种控制结构有如下共同的特点：</p>
            <ul>
              <li>一个入口和一个出口；</li>
              <li>无死语句；</li>
              <li>无死循环。</li>
            </ul>
            <p><strong>⒋复合语句（Compound Statement）</strong>——概念：C 语言可以用 <code>{  }</code> 包括一系列的语句。一对 <code>{  }</code> 所包含的内容称为一个复合语句，其中可以含有 0 到多条 C 语言语句。凡是可以出现单一语句的地方都可以使用复合语句，复合语句可以嵌套。复合语句的作用：⒈作为分支和循环的块；⒉作为标识符的作用域。</p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
void main (void)
{     int a, b;
      scanf("%d,%d", &amp;a, &amp;b);
      {                       /* 复合语句 */
            int temp;
            temp = a;
            a = b;
            b = temp;
      }                       /* 复合语句结束 */
      printf("%d,%d", a, b);   /* 交换算法演示 */
}</code></pre>`,
        },
      ],
    },
    {
      id: 'sec-pd3-rellog',
      heading: '3.2 关系运算和逻辑运算',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>⒈关系运算（Relational Operator）</strong>——关系运算是比较两个表达式的数值相互关系的运算：</p>
            <table class="tbl">
              <thead><tr><th>运算符</th><th>比较的关系</th><th>实例</th></tr></thead>
              <tbody>
                <tr><td>&gt;</td><td>大于</td><td>a&gt;b</td></tr>
                <tr><td>&gt;=</td><td>大于等于</td><td>a&gt;=b</td></tr>
                <tr><td>&lt;</td><td>小于</td><td>2&lt;1</td></tr>
                <tr><td>&lt;=</td><td>小于等于</td><td>c&lt;=d</td></tr>
                <tr><td>==</td><td>等于</td><td>1==c</td></tr>
                <tr><td>!=</td><td>不等于</td><td>1!=3</td></tr>
              </tbody>
            </table>
            <p>关系运算规则：参加运算的表达式从左到右按关系运算符提供的关系进行比较，满足关系得到整型值 1，不满足关系得到整型值 0。如 <code>int a=1,b=3,c,d; c=a&gt;b; d=a+2&lt;=b+3;</code></p>
            <p><strong>⒉逻辑运算（Logical Operator）</strong>——逻辑运算是判断对象真、假的运算。C 语言没有提供逻辑类型，任何类型的值都可以表示逻辑状态：</p>
            <table class="tbl">
              <thead><tr><th>表达式的值</th><th>表示的逻辑关系</th></tr></thead>
              <tbody>
                <tr><td>非 0</td><td>真 true</td></tr>
                <tr><td>0</td><td>假 false</td></tr>
              </tbody>
            </table>
            <p>运算对象非 0 代表逻辑真，是 0 代表逻辑假——也就是说任何类型的量都有逻辑值。逻辑运算的结果用整型值表示：运算结果为真时，得到整型值 1；运算结果为假时，得到整型值 0。如 <code>int a=2,b=0;</code> 则 a、b、a+b 各自有逻辑值。C 语言的逻辑运算：</p>
            <table class="tbl">
              <thead><tr><th>运算符</th><th>逻辑关系</th><th>举例</th></tr></thead>
              <tbody>
                <tr><td>&amp;&amp;</td><td>逻辑与</td><td>a&gt;2 &amp;&amp; a&lt;3</td></tr>
                <tr><td>||</td><td>逻辑或</td><td>s&lt;2 || s&gt;6</td></tr>
                <tr><td>!</td><td>逻辑非（单目运算）</td><td>!a</td></tr>
              </tbody>
            </table>
            <p><strong>⒊复杂逻辑关系的表示</strong>——在实际应用中经常会遇到描述复杂的关系，如判断 x 是否大于等于 5 或小于 3：</p>
            <div class="formula">x&lt;3 || x&gt;=5（开放区间用或）；-2&lt;x &amp;&amp; x&lt;3（闭合区间用与）</div>
            <p>表示数值关系的原则：<strong>开放区间用或；闭合区间用与</strong>。</p>
            <p><strong>思考题</strong>：⒈判断是否在一、三象限的表达式；⒉判断是否在圆环内的表达式（<code>sqrt(x)</code> 代表对 x 开平方）；⒊ch 为字符变量，判断 ch 是否为字母的表达式——<code>(ch&gt;='a' &amp;&amp; ch&lt;='z') || (ch&gt;='A' &amp;&amp; ch&lt;='Z')</code>；不是字母的表达式？</p>
            <p><strong>⒋运算的优先级</strong>——C 语言允许所有基本类型的量参加同一表达式的运算，也允许所有类型的运算符出现在一个表达式中，运算的先后顺序必须通过一套优先级规则解决。为了便于调整优先级，设置 ( ) 为最高优先级。相同优先级存在一个顺序，称为结合顺序，结合顺序有从右向左或从左向右。运算优先级第一原则：<strong>前置单目运算的优先级高于双目运算</strong>。第二原则：算术运算 → 关系运算 → 逻辑运算 → 赋值运算。表达式优先级举例：<code>++a-b&gt;c+d &amp;&amp; a&gt;=b*34</code>（①～⑦逐级确定）。注意：在无法确定优先级时，加 ( ) 区分、简化表达式，如 <code>c=b*=a+2</code> 即 <code>c=(b*=(a+2))</code>。</p>
            <p><strong>优先级总表</strong>：</p>
            <table class="tbl">
              <thead><tr><th>级别</th><th>运算符</th><th>结合顺序</th></tr></thead>
              <tbody>
                <tr><td>1</td><td>（ ） [ ] -&gt; .</td><td>从左向右</td></tr>
                <tr><td>2</td><td>! - ++ -- (type) sizeof * &amp; ~</td><td>从右向左</td></tr>
                <tr><td>3</td><td>* / %</td><td>从左向右</td></tr>
                <tr><td>4</td><td>+ -</td><td>从左向右</td></tr>
                <tr><td>5</td><td>&lt;&lt; &gt;&gt;（移位运算）</td><td>从左向右</td></tr>
                <tr><td>6</td><td>&lt; &lt;= &gt; &gt;=</td><td>从左向右</td></tr>
                <tr><td>7</td><td>== !=</td><td>从左向右</td></tr>
                <tr><td>8</td><td>&amp;（位与运算）</td><td>从左向右</td></tr>
                <tr><td>9</td><td>^（位异或运算）</td><td>从左向右</td></tr>
                <tr><td>10</td><td>|（位或运算）</td><td>从左向右</td></tr>
                <tr><td>11</td><td>&amp;&amp;</td><td>从左向右</td></tr>
                <tr><td>12</td><td>||</td><td>从左向右</td></tr>
                <tr><td>13</td><td>? :</td><td>从右向左</td></tr>
                <tr><td>14</td><td>= op=</td><td>从右向左</td></tr>
                <tr><td>15</td><td>,</td><td>从左向右</td></tr>
              </tbody>
            </table>
            <p><strong>优先级特例</strong>：</p>
            <ul>
              <li>⒈自加、自减运算优先级遵循原则：前置——先运算后引用；后置——先引用后运算（chp3ex0：<code>b=a+++a++;</code>、<code>b=++a+(++a);</code>）；</li>
              <li>⒉在逻辑运算中，如果逻辑值能够确定，则不再进行运算（chp3ex1：<code>int a=0,b=0; ++a || ++b;</code> 输出 a、b 的值；<code>a=0; a&amp;&amp;++b;</code>——b 的值？）。</li>
            </ul>`,
        },
      ],
    },
    {
      id: 'sec-pd3-branch',
      heading: '3.3 分支结构（选择结构 Selection）',
      blocks: [
        {
          type: 'html',
          html: `
            <p>由标准的分支结构可以演化成单分支、多分支结构。C 语言的分支语句有 if、if–else、switch 三种。</p>
            <p><strong>⑴ if 语句</strong>——格式：<code>if(expression) statement;</code>。expression 为表达式，非 0 为 yes，0 为 no；statement 为语句，可以是复合语句。</p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
void  main(void)
{     char  ch;
      ch = getchar( );
      if(ch&gt;='a' &amp;&amp; ch&lt;='z')
           ch -= 32;                /* 小写转大写 */
      putchar(ch);
}                                    /* CHAP3EX2 */</code></pre>
            <p><strong>⑵ if–else 结构</strong>——格式：<code>if(expression) stat1; else stat2;</code>（语句或复合语句）。举例：输出 |x|——<code>if (x&gt;=0) printf("%d", x); else printf("%d", -x);</code></p>
            <p><strong>⑶ if–else if 结构（Multi-line）</strong>——格式：<code>if(e1) stat1; else if(e2) stat2; … else if(en-1) statn-1; else statn;</code>——n-1 个条件，满足某个条件，执行对应的语句，然后到出口。</p>
            <p>if–else if 结构举例——征税问题：1000 以下税率为 3%；1000~2000 税率为 4%；2000~3000 税率为 5%；3000 以上税率 6%。输入收入，求应缴税款：</p>
            <pre class="code"><code>#include  &lt;stdio.h&gt;
void  main(void)
{     float  x, rate;
      scanf("%f", &amp;x);
      if(x &lt; 1000)         rate = .03f;
      else if(x &lt; 2000)    rate = .04f;
      else if(x &lt; 3000)    rate = .05f;
      else                 rate = .06f;
      printf("%f", x * rate);
}</code></pre>
            <p><strong>⑷ if 语句的嵌套</strong>——在 stat1 或 stat2 中又含有 if 结构，称为 if 结构的嵌套，各种 if 结构都可以嵌套。如求符号函数 y = −1（x&lt;0）；y = 0（x=0）；y = 1（x&gt;0）：</p>
            <pre class="code"><code>#include  &lt;stdio.h&gt;
void  main ( void)
{  int x, y;
   scanf ("%d", &amp;x);
   if (x &lt;= 0)          /* 外层 */
          if  (x == 0)  /* 内层 */
              y = 0;
          else
              y = -1;
   else
          y = 1;
   printf ("x=%d,y=%d\n", x, y);
}</code></pre>
            <p>说明：①书写采取缩进形式，便于区分（内层缩进）；②<strong>else 与最近的 if 相匹配，从内到外</strong>。想一想：<code>y=-1; if (x!=0) if (x&gt;0) y=1; else y=0;</code> 在 x==0 时结果是什么？</p>
            <p>举例：求一元二次方程 ax<sup>2</sup>+bx+c=0 的根（CHAP3EX4）——判断实型量相等或不等用误差的方法（<code>float a=1.0f;</code> 若 a=1.000001f 或 0.999999f，<code>a==1.0f?</code>）：</p>
            <pre class="code"><code>#include  &lt;stdio.h&gt;
#include  &lt;math.h&gt;
void  main(void)
{    float a, b, c, d;
     scanf("%f,%f,%f", &amp;a, &amp;b, &amp;c);
     d = b*b - 4.0f*a*c;
     if(fabs(d) &lt; 1.0e-6)
     {          /* 求相等实根 */
            printf("\nx1=x2=, %f", -b/(2.0f*a));
     }
     else
     {   if(d &gt; 0)
         {      /* 求不等实根 */
              printf("\nx1=%f", (-b+(float)sqrt(d))/(2.0f*a));
              printf("\nx2=%f", (-b-(float)sqrt(d))/(2.0f*a));
         }
         else
         {      /* 求共轭复根 */
              printf("\nx1=%f+ i %f", -b/(2.0f*a), (float)sqrt(-d)/(2.0f*a));
              printf("\nx2=%f - i %f", -b/(2.0f*a), (float)sqrt(-d)/(2.0f*a));
         }
     }
}</code></pre>
            <p><strong>⒉ switch 语句（多分支结构）</strong>——格式：</p>
            <pre class="code"><code>switch  (expression)
{      case  常量表达式1:  statement 1;
       case  常量表达式2:  statement 2;
       …
       case  常量表达式n-1:  statement n-1;
       default :  statement n;
}</code></pre>
            <p>expression 只能是<strong>整型或字符型</strong>表达式；case 后为整型或字符型<strong>常量表达式</strong>，各表达式的值互不相等！流程：①先求 expression 的值；②依次比较 expression 和各常量表达式的值；③如果与第 i 个常量表达式相等，则执行第 i 条以后的语句；④如果都不相等，则执行 default 以后的语句。</p>
            <p><strong>语句标号</strong>的概念与 <strong>break 语句</strong>：格式 <code>break;</code>，作用是中断 switch 流程（chp3ex5 无 break 时标号后的语句依次执行；chp3ex6 加 break）：</p>
            <pre class="code"><code>#include  &lt;stdio.h&gt;
void   main(void)
{     char  chGrad;
      chGrad = getchar( );
      switch(chGrad)
      {
      case  'a':   case  'A':  printf("90—100\n"); break;
      case  'b':   case  'B':  printf("80—89\n");  break;
      case  'c':   case  'C':  printf("70—79\n");  break;
      case  'd':   case  'D':  printf("60—69\n");  break;
      case  'e':   case  'E':  printf("&lt;60\n");     break;
      default  :  printf("Data Error!\n");
      }
}</code></pre>
            <p>多个标号可以共用相同的语句；default 语句可以省略。</p>`,
        },
      ],
    },
    {
      id: 'sec-pd3-loop',
      heading: '3.4 循环结构（Repetition）',
      blocks: [
        {
          type: 'html',
          html: `
            <p>程序经常会重复执行某些相同的操作，如求 s=1+2+3+4+…+100：算法描述 ①s=0; i=1; ②s+=i; i++; ③判断 i 是否小于等于 100——如果 i 小于等于 100，重复②；否则结束。此类根据「条件」重复执行相同算法的结构，称为<strong>循环</strong>。循环由三部分组成：<strong>初始化部分</strong>、<strong>循环体</strong>（含有使条件趋假的语句）、<strong>循环的条件</strong>（注意：循环应在有限次完成）。C 语言提供了三类实现循环的语句：while、do while、for。</p>
            <p><strong>⒈ while 循环（当型循环）</strong>——格式：<code>while(expression) statement;</code>。表达式值非 0 表示满足条件，值为 0 代表不满足条件；语句（复合语句）为重复执行部分（循环体）。先判条件，后执行循环体。</p>
            <pre class="code"><code>/* 求 s = 1+2+3+4+…+100 */
#include &lt;stdio.h&gt;
void main(void )
{   int  s=0, i=1;          /* 初始化部分 */
    while (i &lt;= 100)        /* 条件测试 */
    {   s = s + i;          /* s += i;  循环体 */
        i++;                /* 使条件趋假语句 */
    }
    printf ("s = %d \n", s);
}                           /* CHAP3EX7 */</code></pre>
            <p><strong>⒉ do–while 循环（直到型循环）</strong>——格式：<code>do { statement; } while(expression);</code>。<strong>while 循环与 do-while 循环的区别：while 循环先判条件，后执行循环体；do–while 循环先执行循环体，后判条件。</strong>举例：求 30!（CHAP3EX8）：</p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
void  main(void)
{  float s = 1.0;
   int i = 1;
   do{  s *= i;
        i++;
   }while(i &lt;= 30);          /* 初始化。循环体。测试条件。使条件趋假。 */
   printf("30!=%f", s);
}</code></pre>
            <p>思考题：用 do-while 实现 s=1+2+…+100；用 while 实现 30!。</p>
            <p><strong>⒊ for 循环</strong>——格式：<code>for(e1; e2; e3) statement;</code>。e1 初值表达式、e2 测试表达式、e3 增值表达式（使 e2 趋假）。流程：e1 → e2? → true: statement → e3 → 再测 e2；false: 退出。在 for 循环中，e1、e2、e3 都可以省略！e1 省略时如 <code>i=1;</code>，e3 省略时如 <code>i++;</code></p>
            <pre class="code"><code>/* 求 s = 1+2+3+…+100 */
#include  &lt;stdio.h&gt;
void main (void )
{     int  s=0, i;
      for (i=1; i&lt;=100; i++)
      {      s = s + i;
      }
      printf ("s= %d", s);
}</code></pre>
            <p><strong>for 循环实例</strong>：</p>
            <ul>
              <li>求 100 以内的偶数和：<code>int s=0,i; for(i=2;i&lt;100;i+=2) { s+=i; }</code>；</li>
              <li>求 500 以内最大的 5 个能被 50 整除数的和：<code>int i,j,s=0; for(j=500,i=0;i&lt;5;i++, j-=50) { s+=j; }</code>；</li>
              <li>从大到小输出 100 以内能被 5 整除的数：<code>int i; for(i=100;i&gt;=0;i-=5) printf("%d\n",i);</code>；</li>
              <li><code>int i,j,s=0; for(i=0,j=0;i+j&lt;100;i++,++j) { s+=i+j; }</code>。</li>
            </ul>
            <p><strong>⒋循环应用的几个问题</strong></p>
            <p>⑴<strong>循环的嵌套</strong>——概念：在一个循环的循环体内又包含一个完整的循环称为循环的嵌套。如打印一个 9×9 的乘法表：i=1 时，j 从 1 变化到 9，完成 i*j。</p>
            <pre class="code"><code>/* 打印 9×9 乘法表 */
#include &lt;stdio.h&gt;
void main (void )
{     int i, j;
      for  (i=1 ; i&lt;=9 ; i++)
      {                                  /* 外层循环 */
            for(j=1; j&lt;=9 ; j++)         /* 内层循环 */
            {  printf ( "%4d", i * j );  /* 如何打印乘法表的一半？ */
            }
            printf ( "\n" );
      }
}                                       /* CHAP3EX9 */</code></pre>
            <p>说明：⒈内外层循环采用缩进形式；⒉while 和 do-while 和 for 可以相互嵌套；⒊执行次数为内层循环次数和外层循环次数的乘积。</p>
            <p>⑵<strong>循环的中断（break）和继续（continue）</strong>——①循环的中断：break 语句。循环体中可以加分支，判断是否继续执行循环，break 语句可以提前结束循环。举例：求 r=1—10 的圆的面积，如圆面积大于 100 则中断：</p>
            <pre class="code"><code>for (r=1; r&lt;=10; r++)
{     area = 3.14159 * r * r;
      if ( area &gt;100 ) break;      /* 满足条件，则退出循环 */
      printf ( "\n%f", area);
}</code></pre>
            <p>②继续循环：continue 语句。continue 语句的作用是<strong>跳过本次循环剩余的循环体内容，执行下次循环</strong>。举例：求 1—100 内的偶数和：</p>
            <pre class="code"><code>s=0;
for ( n=1; n&lt;=100; n++)
{     if (n%2!=0) continue;      /* 满足条件，跳过本次循环体剩余内容 */
      s+=n;                      /* 等价写法：for(i=2;i&lt;100;i=i+2) s+=i; */
}</code></pre>
            <p>⑶<strong>无限循环和空循环</strong>——①条件为恒真的循环——无限循环：<code>while(1){…}</code>、<code>do{…}while(1);</code>、<code>for(;;){…}</code>，通过条件控制的 break 语句退出循环。例：程序等待直到输入字母 A——<code>for(;;){ ch=getchar(); if(ch=='A') break; }</code>。②循环体为空语句的循环——空循环：<code>for(i=1; i&lt;=MAX; i++) ;</code>（空语句 <code>{ ;}</code>），作用：程序延时。</p>`,
        },
      ],
    },
    {
      id: 'sec-pd3-method',
      heading: '程序设计的基本方法：枚举法与迭代法',
      blocks: [
        {
          type: 'html',
          html: `
            <p>根据计算机的特点，结合循环与分支结构，程序设计时常使用两种常用的基本方法：<strong>枚举法（穷举法）</strong>与<strong>迭代法</strong>。</p>
            <p><strong>枚举法（Enumeration）</strong>——存在有限状态；其中某些状态满足特定条件。通过循环产生所有状态（枚举），对每一状态按条件进行状态测试，满足条件的状态即为所求的解。如求 100 到 200 内的所有素数：通过循环使 i 从 101 变化到 199（枚举所有状态），对每次循环的 n 进行是否是素数的测试，如果是素数，输出 n。</p>
            <p><strong>枚举法举例</strong>：</p>
            <p>⒈求 100 到 200 之间的所有素数（只能被 1 和自身整除的数）。对于自然数 n，判断其是否为素数有以下三种方法：</p>
            <ul>
              <li>①判断 n 是否能被从 2 到 n-1 范围内的数整除；</li>
              <li>②判断 n 是否能被从 2 到 (int)(n/2) 范围的数整除；</li>
              <li>③判断 n 是否能被从 2 到 (int)sqrt(n) 范围的数整除。</li>
            </ul>
            <pre class="code"><code>#include &lt;stdio.h&gt;
#include &lt;math.h&gt;
void  main(void)
{      int  n, j, s;
       for(n=101; n&lt;200; n+=2)         /* 枚举所有数 */
       {
           s=(int)sqrt((double)n);
           for(j=2; j&lt;=s; j++)          /* 构造、测试条件 */
           {      if(n%j==0) break;     /* 能被 2 到 s 的任意数整除，退出循环 */
           }
           if(j&gt;s)                      /* n 是素数，输出 n */
                  printf("\n%d", n);
       }
}                                       /* CHAP3EXA */</code></pre>
            <p>⒉求水仙花数（条件：三位数的个、十、百位的方和等于该数，153 == 1³+5³+3³）。n 为枚举变量，枚举初值 100，枚举终值 999；构造条件——取出 n 的个、十、百位数；测试是否满足条件，满足条件输出 n（CHAP3EXB）：</p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
void  main(void)
{      int n, a, b, c;
       for(n=100; n&lt;=999; n++)         /* 枚举所有三位数 */
       {
            a = n/100;                 /* 百位 */
            b = n%100/10;              /* 十位 */
            c = n%10;                  /* 个位 */
            if(a*a*a + b*b*b + c*c*c == n)
                   printf("\n%d", n);
        }
}</code></pre>
            <p>⒊爱因斯坦阶梯问题（不定范围的枚举）：设有一阶梯，每步跨 2 阶最后剩 1 阶；每步跨 3 阶最后剩 2 阶；每步跨 5 阶最后剩 4 阶；每步跨 6 阶最后剩 5 阶；每步跨 7 阶正好到阶梯顶。问共有多少阶梯。根据条件可以得出：台阶数一定是奇数且为 7 的倍数。枚举初值 k=7；枚举公式 k=k+14；结束条件：满足 <code>(k%3==2)&amp;&amp;(k%5==4)&amp;&amp;(k%6==5)</code> 结束（CHAP3EXC）：</p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
void  main(void)
{  int  k = 7;
   while( !((k%3==2) &amp;&amp; (k%5==4) &amp;&amp; (k%6==5)))
            k += 14;
   printf("\nl=%d", k);
}</code></pre>
            <p><strong>思考题</strong>：⒈36 人一次搬 36 块砖，男搬 4，女搬 2，两个小孩抬一块，要一次搬完，问男、女、小孩要多少？⒉找出 1000 以内的完数——完数是指该数的各因子之和等于该数，如 6=1+2+3。⒊证明 6 到 200 以内的数符合哥德巴赫猜想（一个大于 6 的偶数，可以分解成两个质数之和）。⒋奇妙的算式：用字母代替十进制数字写出算式 EAGL × L = LGAE，请找出这些字母代表的数字。</p>
            <p><strong>迭代法（Iteration）</strong>——迭代是通过循环不断由旧值推导新值，并最后求解的过程。迭代法有三个要点：</p>
            <ul>
              <li>⒈<strong>迭代公式</strong>。如公司产值按每年 2% 增长，现在产值 12 亿，10 年后产值是多少——m = m*(1+2%)；</li>
              <li>⒉<strong>迭代初值（边界条件）</strong>——m = 12；</li>
              <li>⒊<strong>迭代次数（或条件）</strong>——n = 10。</li>
            </ul>
            <p><strong>迭代法举例</strong>：</p>
            <p>⒈求 e<sup>x</sup> = 1 + x + x<sup>2</sup>/2! + … + x<sup>n</sup>/n! 前 n+1 项之和。迭代次数 i = 0,1,2,…,n；迭代公式 t = t*x/i；迭代初值 exp=1, t=1（i=1~n）。附加条件：当 |t|&lt;10<sup>-5</sup> 时结束运算——<code>if(fabs(t)&lt;1e-5) break;</code></p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
void  main(void)
{     float   exp, x, t;
      int i, n;
      scanf("%f,%d", &amp;x, &amp;n);
      t = 1.0f;                     /* 迭代初值 */
      exp = 1.0f;
      for(i=1; i&lt;=n; i++)
      {     t *= x/i;               /* 迭代公式 */
            exp += t;
      }
      printf("e^%d=%15.6f", (int)x, exp);
}                                   /* CHAP3EXD */</code></pre>
            <p>⒉用<strong>梯形法求定积分</strong>：将 [a,b] 分为 n 等份，h=(b-a)/n；求 n 个梯形面积之和，第 i 小条面积 s = s + (f0+f1)*h/2，其中 x 初值为 a、f0 初值为 f(a)、次数为 n，迭代 <code>x=x+h; f1=f(x); s=s+(f0+f1)*h/2; f0=f1;</code></p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
void main(void)
{      float  a, b, f0, f1, h, x, s=0.0f;
       int n, i;
       scanf("%f,%f,%d", &amp;a, &amp;b, &amp;n);
       h = (b-a)/n;
       x = a;                        /* 迭代初值 */
       f0 = x*x + 12.0f*x + 4.0f;
       for(i=0; i&lt;n; i++)            /* 迭代循环 */
       {      x = x + h;
              f1 = x*x + 12.0f*x + 4.0f;
              s = s + (f0+f1)*h/2.0f;
              f0 = f1;
       }
       printf("S=%f", s);
}                                     /* CHAP3EXE */</code></pre>
            <p>⒊求 s = a + aa + aaa + … + aaa…a（0&lt;a&lt;10，共 n 项，最后一项有 n 个 a）。如求 s=2+22+222+2222+…+222…222，n、a 从键盘输入。迭代次数 i=1~n；迭代初值 s=0.0, t=a；迭代公式 t = t*10 + a：</p>
            <pre class="code"><code>#include  &lt;stdio.h&gt;
void  main(void)
{      float s, t;
       int i, a, n;
       do{
               scanf("%d,%d", &amp;a, &amp;n);
               if(a&lt;1 || a&gt;9)
                   printf("\nData Input Error!\nInput again:");
           }while(a&lt;1 || a&gt;9);
       s = 0.0f;
       t = a;
       for(i=1; i&lt;=n; i++)
       {  s += t;
          t = t*10 + a;
       }
       printf("\ns=%f", s);
}</code></pre>
            <p>⒋<strong>二分法</strong>求方程 f(x) = x<sup>3</sup>−6x−1 = 0 在 [0,5] 区间的根。算法分析：①输入 x1、x2，并求出 f1、f2；②迭代：将区间二分 x=(x1+x2)/2，计算出 f=f(x)；③判断 f 与 f1 是否同号——如果同号：x1=x, f1=f，否则：x2=x, f2=f；④判断 fabs(x1-x2) 是否小于某个规定的精度（如 10<sup>-6</sup>）：如果小于精度求出根退出到⑤，否则继续②；⑤输出根，根的值是 (x1+x2)/2。</p>
            <pre class="code"><code>#include  &lt;stdio.h&gt;
#include  &lt;math.h&gt;
void  main(void)
{     float x1, x2, x, f1, f2, f;
      scanf("%f,%f", &amp;x1, &amp;x2);      /* 迭代初值 */
      f1 = x1*x1*x1 - 6.0f*x1 - 1;
      f2 = x2*x2*x2 - 6.0f*x2 - 1;
      do                             /* 二分迭代循环 */
      {    x = (x1+x2)/2;
           f = x*x*x - 6.0f*x - 1;
           if(f*f1 &gt;= 0)
           {f1 = f; x1 = x;}
           else
           {f2 = f; x2 = x;}
       }while(fabs(x1-x2) &gt;= 1e-6);  /* 迭代条件 */
     printf("Root is :%f", (x1+x2)/2);
}                                    /* CHAP3EXF */</code></pre>
            <p>⒌通过如下公式求 π（精度为 10<sup>-6</sup>）：</p>
            <div class="formula">π/4 ≈ 1 − 1/3 + 1/5 − 1/7 + …</div>
            <p>迭代初值：fPi=0；fItem=1; iSign=1。迭代公式：<code>fPi+=(1./fItem)*iSign; fItem+=2.; iSign*=-1;</code> 迭代条件：<code>fabs(1./fItem)&gt;(1e-6)/4</code>。从程序的运行看精度和时间的关系！</p>
            <p><strong>迭代法思考题</strong>：⒌求自然数 m 和 n 的最大公约数（用 while 循环实现）——提示：①比较 m 和 n 的大小，如 n&gt;m 两者交换；②求 m 被 n 除的余数 k；③如果 k 为 0，除数 n 为最大公约数；④如果 k 不为 0，原除数作为新的被除数 m，余数作为新除数，继续②。⒍用迭代法求 cosX。⒎求 Fibonacci 级数 1，1，2，3，5，8，13，21，34…。⒏用牛顿迭代法求方程 f(x)=0 的根（<strong>必做！</strong>）。</p>`,
        },
      ],
    },
    {
      id: 'sec-pd3-hw',
      heading: '第三章作业',
      blocks: [
        {
          type: 'html',
          html: `
            <p>⒐通过梯形法求 y = ∫<sub>0</sub><sup>1</sup>(x<sup>2</sup>+2x+3)dx，输出结果。</p>
            <p>⒑求 1000 以内能被 73 或 127 整除的自然数平方根之和。</p>
            <p>⒒求 100——200 之间的所有能被 3 以及 7 整除的自然数的平方根之和。</p>
            <p>⒓求级数 a = 2/1 + 3/2 + 5/3 + 8/5 + 13/8 + 21/13… 的前 30 项之和。</p>
            <p>⒔求数列 41+n(n−1) 最小非素数项的序号（n &gt; 2）。</p>
            <p>⒕求满足以下条件的数：该数大于 100 小于 1000；其个位数与十位数的平方和等于其百位数的立方。</p>
            <p>⒖求级数 e = 1 + 1/1! + 1/2! + 1/3! + …　要求：求 n 项（n 由键盘输入）或最后一项小于 10<sup>-6</sup> 结束。</p>
            <p>⒗输入三边 a、b、c 判断是否能构成三角形，如能构成三角形，要求通过海伦公式计算其面积。注：⑴海伦公式 <code>s = √(p(p−a)(p−b)(p−c))</code>，其中 <code>p = (a+b+c)/2</code>；⑵构成三角形的条件：任意两边之和大于第三边。</p>
            <p>⒘求 1500 内的最大五个素数之和。</p>
            <p>⒙一包海鲜单价为 46.5 元，如果购买 100 包至 300 包则按 95% 优惠；若购买 301 包至 500 包，则按 85% 优惠；如果购买 501 包至 1000 包，则按 80% 优惠；若购买 1000 包以上，按 70% 优惠。试编写一个计算顾客购买 X 包海鲜所需金额，且打印购买数量、单价和总金额的程序。</p>
            <p>⒚编程输出 1~1000 中所有个位数是 7 的素数，统计其个数，并求满足该条件数的和，输出结果。</p>
            <p>⒛编写程序求：y = 1 + 1/(1×2) + 1/(2×3) + … + 1/(n×(n−1))。</p>
            <p>21. 父亲今年 30 岁，儿子今年 6 岁，问多少年后，父亲的年龄是儿子的 2 倍？</p>
            <p>22. 将 1 元人民币换成 5 分、2 分、1 分的硬币有多少种换法？</p>
            <p>23. 一只猴子摘了一堆桃，每天吃一半再加 1 个，第 10 天去吃时只剩 1 个桃，问第一天的一堆桃有多少？</p>
            <p>24. 一个 4 位数，逆向排列后是原 4 位数的倍数，求出符合条件的 4 位数。</p>
            <p>25. 一个球从 100 米高度落下，每次反弹回原高度的一半，求第 10 次落地时球的行程及下次反弹的高度。</p>
            <p>26. 输出公元 1000 年至今所有闰年。闰年的条件自查！</p>
            <p>27. 用三种不同的方法计算 π。（方法自选）</p>
            <p>28. 用连分数求：√2 ≈ 1 + 1/(2 + 1/(2 + 1/(2 + 1/(2 + …))))。</p>
            <p>29. 某地刑警大队对涉及 6 个嫌疑人的一桩疑案进行分析：⑴ A、B 至少有 1 人作案；⑵ A、E、F 3 人中至少有 2 人参与作案；⑶ A、D 不可能是同案犯；⑷ B、C 或同时作案，或都与本案无关；⑸ C、D 中有且仅有一人作案；⑹ 如果 D 没有参与作案，则 E 也不可能参与作案。编程找出作案人。</p>
            <p>30. 阿米巴用简单分裂的方式繁殖，它每分裂一次要用 3 分钟。将若干个阿米巴放在一个盛满营养参液的容器内，45 分钟后容器内充满了阿米巴。已知容器最多可以装阿米巴 2<sup>20</sup> 个。试问，开始的时候往容器内放了多少个阿米巴？</p>`,
        },
      ],
    },
  ],
};

export default ch3;
