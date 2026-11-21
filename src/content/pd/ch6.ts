/* 第六章 函数 —— 逐节转录自 课件/PPT/第六章 函数.ppt（45 页）；
   模块划分、递归展开（递推/回归）等图示依课件原图转录。 */
import type { PdChapter } from './types';

const ch6: PdChapter = {
  id: 'ch6',
  no: '第6章',
  title: '函数',
  subtitle: '结构化程序设计基础 · 定义与调用 · 存储类型与作用域 · 数据传递 · 编译预处理',
  lede:
    '<p>第六章 函数——结构化程序设计基础。结构化程序设计要求一种自顶向下的设计方法，也就是将复杂的系统划分为相对独立的、功能较为单一的功能子系统的组合。每个子系统称为<strong>模块</strong>，在 C 语言中表现为<strong>函数</strong>。各模块之间的关系称之为接口。优点：函数实现的功能单一完整，可以独立设计，单独调试，易于维护，通用性强。<em>课件图示：复杂问题 → main() → 模块 a、b、c → 子模块 a1/a2、b1/b2、c1/c2。</em></p>',
  toc: [
    { id: 'sec-pd6-def', text: '6.1 函数的定义和调用', level: 2 },
    { id: 'sec-pd6-scope', text: '6.2 变量的存储类型及作用域', level: 2 },
    { id: 'sec-pd6-pass', text: '6.3 函数间的数据传递', level: 2 },
    { id: 'sec-pd6-array', text: '6.4 数组与函数参数', level: 2 },
    { id: 'sec-pd6-retptr', text: '6.5 返回指针的函数', level: 2 },
    { id: 'sec-pd6-funptr', text: '6.6 指向函数的指针', level: 2 },
    { id: 'sec-pd6-rec', text: '6.7 递归函数', level: 2 },
    { id: 'sec-pd6-arg', text: '6.8 命令行参数', level: 2 },
    { id: 'sec-pd6-prep', text: '6.9 编译预处理', level: 2 },
    { id: 'sec-pd6-hw', text: '作业', level: 2 },
  ],
  sections: [
    {
      id: 'sec-pd6-def',
      heading: '6.1 函数的定义和调用',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>⒈函数的基本结构</strong>：</p>
            <pre class="code"><code>#include  &lt;stdio.h&gt;
void main(void )
{   int a, b, c;
    scanf ( "%d,%d", &amp;a, &amp;b);
    c = max( a, b);              /* 引用！ */
    printf ("%d", c);
}
int max(int  x, int  y)          /* 定义！ */
{   int z;                       /* 函数体 */
    z = x &gt;= y ? x : y;
    return ( z);
}</code></pre>
            <p>函数的类型即返回值的类型；函数名用标识符命名，是引用函数的标志，并得到结果；函数参数说明表。<strong>函数定义的功能</strong>是要确定如下四点：名称、函数的类型、函数的参数、函数的功能。</p>
            <p><strong>⒉函数的定义</strong>——格式：</p>
            <pre class="code"><code>type  函数名(参数说明表)
{     内部说明语句；
      功能语句；
}</code></pre>
            <p>如果函数有返回值，应含有 return 语句。说明：</p>
            <ul>
              <li>⑴函数<strong>不能嵌套定义</strong>，但可以嵌套引用，包括引用自己（在函数体内再定义函数 /*Error !*/）；</li>
              <li>⑵函数如果无返回值，type 应说明为空类型 void。函数无参数应定义成 void，如 <code>void Bell(void) { printf("\\007"); }</code>。</li>
            </ul>
            <p><strong>⒊函数的引用</strong>——⑴引用方式：<code>函数名(实参表)</code>。一般引用方式有三种：语句形式 <code>max(a,b);</code>；表达式形式 <code>c=max(a,b)*2;</code>；函数参数 <code>c=max(a, max(b,d));</code></p>
            <p>⑵引用过程：⑴先计算实参的值，<strong>从右向左</strong>向函数传递赋值给形参（如 a=2、b=3 传给 x、y）；⑵转移到函数中运行，执行到一个 return 语句，将返回表达式的值，由函数名带回给调用函数。函数如果没有 return 语句，由最后一个 } 返回一个不确定的值！</p>
            <p><strong>关于返回值的几点说明</strong>：</p>
            <ul>
              <li>⑴函数可以通过一个 return 语句返回一个值，也可以不返回值，此时应在定义函数时用 void 类型加以说明；</li>
              <li>⑵函数中可以出现多个 return 语句，遇到一个 return 语句则返回值，且返回调用函数继续执行：<code>int max(int x, int y) { if (x&gt;=y) return x; return y; }</code>；</li>
              <li>⑶返回值的类型应与函数的类型一致，如不一致，以函数类型为准，先转换为函数类型后再返回（如 z 先转化为整型）；</li>
              <li>⑷为了确保参数和返回值类型正确，一般须在函数调用前对其类型和参数的类型加以说明，该说明称之为<strong>原型声明</strong>：<code>int imax(int, int);</code>（原型声明语句，加；）。</li>
            </ul>
            <p>举例：通过函数求 x<sup>n</sup>（CHAP6EX1）：</p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
double  pow(float, int);             /* 原型声明 */
void main(void)
{   int  i;
    for (i=1; i&lt;=9; i++)
         printf ( "%d, %f \n", i, pow(2.5, i));
}
double  pow(float x, int n)          /* 定义函数 */
{   int  i;
    double  p = 1;
    for (i=1; i&lt;=n; i++)
             p = p * x;
    return ( p);
}                                    /* 调用函数 */</code></pre>`,
        },
      ],
    },
    {
      id: 'sec-pd6-scope',
      heading: '6.2 变量的存储类型及作用域',
      blocks: [
        {
          type: 'html',
          html: `
            <p>变量是内存数据的抽象，即将内存地址、数据表示抽象成一个符号。此外，变量还有<strong>存储类型</strong>，存储类型确定了变量在时间上的<strong>生存期</strong>和空间上的<strong>作用域</strong>。按空间的作用域可分为：全局变量、局部变量；按时间的生存期可分为：静态存储变量、动态存储变量。</p>
            <p><strong>变量的四种存储类型</strong>：⑴自动类型 auto；⑵寄存器类型 register；⑶静态类型 static；⑷外部类型 extern。变量的说明格式：<code>存储类型 类型 变量名表;</code>——确定变量在内存中的表示方法与生存期和作用域；该项省略表示 auto 存储类型。</p>
            <p><strong>⒈ auto 存储类型（局部变量）</strong>——定义在复合语句的开始处，<strong>块内生存、块内有效</strong>。生存期：执行到复合语句建立内存变量，执行出复合语句变量消亡。</p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
void   main(void)
{  auto int  a, b;                   /* a、b 的作用域 */
   scanf("%d,%d", &amp;a, &amp;b);
   if(b &gt; a)
    {                                /* iTemp 的作用域 */
      int iTemp;
      iTemp = a;
      a = b;
      b = iTemp;
     }
 printf("Max=%d", a);
}</code></pre>
            <p><strong>⒉ register 存储类型（局部变量）</strong>——作用域和生存期和 auto 相同，差别在于：如果 CPU 内部的寄存器空闲，则使用寄存器作为变量的存储单元，以提高速度。主要用于循环变量，且应该是整型和字符型。</p>
            <p><strong>⒊局部 static（静态）存储类型</strong>——作用域：在说明的复合语句内引用，出了复合语句不可见。生存期：从程序开始运行直到程序结束，执行出 { } 时原值并不消失，只是不能引用：</p>
            <pre class="code"><code>void  row (void);
void  main ( void )
{   int  b;
    for  (b=1; b&lt;=9; b++)
        row ( );
}
void row (void )
{                    int a = 1;      /* 说明静态变量 static int a=1; */
  int  b;
  for (b=1; b&lt;=9; b++)
      printf ( "%5d", a*b );
  printf ( " \n " );
  a++;
}   /* a 的作用域；生存期从编译开始到程序结束。CHAP6EX5 / CHAP6EX6 */</code></pre>
            <p><strong>⒋外部变量（extern 存储类型、全局变量）</strong>——外部变量是定义在任何模块之外的变量，也称为全局变量。作用域：从说明变量开始直到文件结束。生存期：在程序的整个执行过程中。任何函数对外部变量的修改都会影响其他函数对外部变量引用时的值：</p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
void  add(void);
int  a, b, c;                        /* 全局变量 */
void  main(void)
{   scanf("%d,%d", &amp;a, &amp;b);
    add( );
    printf("%d", c);
}
void add(void)
{  c = a + b; }                      /* 作用域 */</code></pre>
            <p><strong>关于全局变量的几点说明</strong>：</p>
            <ul>
              <li>⑴全局变量可以通过说明改变其作用域（extern i; 扩展新的作用域）；</li>
              <li>⑵全局变量可以被不同的文件共享：file1.c 中 <code>int a;</code> 定义外部变量，file2.c 中 <code>extern int a;</code> 通过说明使用文件 1 的外部变量。如果只希望在本文件中使用，可以加 static 说明；</li>
              <li>⑶模块设计的原则：<strong>内聚性强，耦合性弱</strong>。全局变量的使用占用内存资源且增加模块的耦合性，因此应尽量不使用全局变量；</li>
              <li>⑷当模块中出现和全局变量同名的局部变量时，局部变量在模块中优先。</li>
            </ul>
            <p>全局变量应用举例：用函数交换两个全局变量的值：</p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
int  a, b;                           /* a、b 外部变量 */
void  main(void)
{   scanf("%d,%d", &amp;a, &amp;b);
    fun( );
    printf("a=%d,b=%d\n", a, b);
}
void  fun(void)
{   int c;
    c = a; a = b; b = c;
}</code></pre>
            <p><strong>全局变量的副作用</strong>——函数 prt 的作用是打印五个 *，再回车，但实际只调用了一次就退出：</p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
int   i;
void  prt(void);
void  main( void )
{   for(i=0; i&lt;5; i++)
          prt( );
}
void  prt(void)
{   for(i=0; i&lt;5; i++)
         printf("%c", '*');
    printf("\n");
}</code></pre>
            <p><em>课件图示：外层与内层共用全局变量 i——内层循环把 i 加到 5，外层条件 i&lt;5 不再成立，只打印一行。</em></p>`,
        },
      ],
    },
    {
      id: 'sec-pd6-pass',
      heading: '6.3 函数间的数据传递',
      blocks: [
        {
          type: 'html',
          html: `
            <p>函数在调用的过程中，调用函数和被调函数存在数据的相互传递。数据的传递包括两个方面：⑴将值传递给被调函数；⑵将被调函数的结果返回给调用函数。函数间数据传递方式：⑴通过函数参数传值或传地址；⑵通过返回值传递结果；⑶通过全局变量传递参数或结果。</p>
            <p><strong>⒈使用参数传递数据</strong></p>
            <p>⑴<strong>传值方式</strong>——通过实参与形参的结合，将数据值传递给形参，<strong>形参的改变不影响实参</strong>：</p>
            <pre class="code"><code>#include  &lt;stdio.h&gt;
int  splus (int, int);
void  main (void )
{  int  a, b, c;
   scanf ( "%d, %d", &amp;a, &amp;b);
   c = splus ( a, b );
   printf ( " a*b= %d \n ", c );
}
int   splus (int x, int y)    /* x、y 形参接收 a:2、b:3 的值 */
{  int  z;
   z = x * y;
   return (z);                /* z:6 返回值 */
}</code></pre>
            <p>⑵<strong>传地址方式</strong>——形参定义为指针，实参为变量的地址，被调函数通过地址可以修改地址对应的变量。用函数实现两个变量 a、b 值的交换：</p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
void   swap ( int *, int  * );
void main(void )
{      int  a, b;
       scanf ( "%d, %d", &amp;a, &amp;b);
       if (a&lt;b)  swap ( &amp;a, &amp;b );
       printf ( "\n %d, %d \n", a, b);
}
void  swap ( int *x, int *y)   /* a(2000H)、b(2400H) 的地址传给 x、y */
{      int  t;
       t = *x; *x = *y; *y = t;
}</code></pre>
            <p>思考：参数变量是否可以实现交换？</p>
            <p><strong>⒉全局变量传递参数</strong>——全局变量可以被调用函数和被调函数共享，任何函数对全局变量的修改都会影响到其他函数所见的全局变量的值：</p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
int  c;                        /* 说明全局变量 */
void  main ( void)
{      int a, b;
       scanf ( "%d, %d", &amp;a, &amp;b);
       splus  (a, b);
       printf ( "a*b = %d \n", c);
}
void splus (int x, int y)
{      c = x * y;
}</code></pre>
            <p>说明：应尽量少用全局变量，应使函数内部的内聚性强，函数之间的耦合性弱。</p>`,
        },
      ],
    },
    {
      id: 'sec-pd6-array',
      heading: '6.4 数组与函数参数',
      blocks: [
        {
          type: 'html',
          html: `
            <p>问题：引用数组时只能引用数组元素。如果用参数传递数组元素，则函数需要参数的量太多。为了解决此问题，可以<strong>通过指针传递数组的地址</strong>。数组作为函数参数定义有三种方式：</p>
            <ul>
              <li>⒈形参为指针：<code>int ave(int *p)</code>；</li>
              <li>⒉形参为无下标数组：<code>int ave(int a[ ])</code>；</li>
              <li>⒊形参为有下标数组：<code>int ave(int a[10])</code>。</li>
            </ul>
            <p>举例：通过函数求数组元素的平均值：</p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
float mean(int *, int);
void  main (void)
{   int  array[10]={1,2,3,4,5,6,7,8,9,10};
    float av;
    av = mean(array, 10);
    printf( "av=%f \n %d", av, array[0]);
}
float  mean(int *data, int num)      /* 指针法；也可写 int data[ ] 或 int data[10] */
{   int i;
    float  avg = 0;
    for (i=0; i&lt;num; i++)
         avg += *data++;
    avg /= num;
    return (avg);
}                                    /* chp6ex2 */</code></pre>
            <p>说明：⑴三种方法的实质都是传递地址，可以混用；⑵<strong>形参的任何改变都影响实参</strong>（如 <code>data[0]=-1;</code> 后主函数中 array[0] 变为 -1）；⑶函数中对数组的操作，下标不要超过数组的下标范围。</p>
            <p>举例：通过函数将字符串中的大写字母转换为小写字母：</p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
void StrLwr(char *);
void main(void)
{      char szBuff[80];
       gets(szBuff);
       StrLwr(szBuff);
       puts(szBuff);
}
void StrLwr(char * p)
{      while(*p != '\0')
       {        if (*p &gt;= 'A' &amp;&amp; *p &lt;= 'Z')
               {        *p += 32;
               }
               p++;
       }
}</code></pre>`,
        },
      ],
    },
    {
      id: 'sec-pd6-retptr',
      heading: '6.5 返回指针的函数',
      blocks: [
        {
          type: 'html',
          html: `
            <p>概念：函数可以返回一个值，也可以返回一个地址（指针）。如果函数返回地址，该函数称为<strong>返回指针的函数</strong>。定义：</p>
            <pre class="code"><code>type   *函数名（形参表）
{      …
}</code></pre>
            <p>如 <code>int *max(int *a, int *b)</code>。举例：在字符串中查找特定的字符：</p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
char *lstrchar (char *, char);      /* 函数原型声明 */
void main ( void)
{   char  c, *p, str[80];
    gets (str);
    scanf ( "%c", &amp;c);
    p = lstrchar (str, c);
    if (p == NULL)   printf ("char %c not found\n", c);
    else             printf ("The position  is %d", p - str);
}
char *lstrchar (char *s, char ch)
{   char  *chp = NULL;              /* 找不到指向空！ */
    while (*s != '\0')
      if (*s == ch)
      {     chp = s; break; }
      else
            s++;
    return   chp;
}                                   /* chp6ex3 */</code></pre>`,
        },
      ],
    },
    {
      id: 'sec-pd6-funptr',
      heading: '6.6 指向函数的指针',
      blocks: [
        {
          type: 'html',
          html: `
            <p>概念：函数为程序模块，函数要装载到内存中，函数在内存中其首地址称为<strong>函数的入口地址</strong>，用函数名表示。C 语言可以通过指针指向函数的入口地址，从而实现通过指针对函数的调用（如 <code>c=max(a,b);</code> 中 max 的入口地址 2400）。</p>
            <p>指向函数指针的定义：<code>type (*p)( );</code>——函数的类型 + 指针。使用过程：⑴定义函数和指向函数的指针；⑵指针指向函数：<code>p=funname;</code> ⑶通过指针引用函数，格式：<code>(*p)(实参表);</code></p>
            <p>举例：求 a、b 的最大值：</p>
            <pre class="code"><code>#include  &lt;stdio.h&gt;
int  lmax(int, int);
void  main(void)
{   int a, b, c;
    int  (* funp)();                /* 说明指向函数的指针 */
    funp = lmax;                    /* 指针指向函数 */
    scanf("%d,%d", &amp;a, &amp;b);
    c = (*funp)(a, b);              /* 通过指针引用函数 */
    printf("Max. is %d\n", c);
}
int lmax(int x, int y)
{   return (x&gt;y ? x : y);
}</code></pre>
            <p>举例：通过参数传递，求 a、b 之和、之差：</p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
int  plus(int, int);
int  sub(int, int);
int  funa(int, int, int(*)(int, int));
void  main(void)
{   int  a, b, c;
    scanf("%d,%d", &amp;a, &amp;b);
    c = funa(a, b, plus);
    printf("\na+b=%d", c);
    c = funa(a, b, sub);
    printf("\na - b=%d", c);
}
int  funa(int x, int y, int (*funp)(int, int))
{    return (*funp)(x, y);
}
int    plus(int x, int y)
{    return (x + y);
}
int     sub(int x, int y)
{    return (x - y);
}</code></pre>`,
        },
      ],
    },
    {
      id: 'sec-pd6-rec',
      heading: '6.7 递归函数',
      blocks: [
        {
          type: 'html',
          html: `
            <p>概念：函数<strong>直接或间接地自我调用</strong>称为递归函数。直接引用自身：<code>int fun1(int x){… z=fun1(y); …}</code>；间接引用自身：<code>fun1</code> 调用 <code>fun2</code>，<code>fun2</code> 又调用 <code>fun1</code>。</p>
            <p>递归在没有控制条件的情况下是无穷的递归（如 main 中不断调用 main）。只有通过控制条件，使递归调用终止，才具有应用价值。</p>
            <p><strong>递归举例：求 n!</strong>：</p>
            <div class="formula">f(n) = 1（n=0 或 n=1）；f(n) = n·f(n−1)（n&gt;1），即 n! = 1（n=0 或 1）/ n(n−1)!（n&gt;1）</div>
            <pre class="code"><code>#include &lt;stdio.h&gt;
long  lfac(long);
void main(void)
{   long i, x;
    scanf("%ld", &amp;i);
    x = lfac(i);
    printf("\n%ld", x);
}
long lfac(long n)
{    if (n == 0 || n == 1) return 1;
     else return (n * lfac(n-1));
}                                   /* chp6ex7 */</code></pre>
            <p><em>课件图示：lfac(4) 的展开——递推：4*lfac(3) → 3*lfac(2) → 2*lfac(1) → 2*1；回归：3*2*1 → 4*3*2*1。</em></p>`,
        },
      ],
    },
    {
      id: 'sec-pd6-arg',
      heading: '6.8 命令行参数',
      blocks: [
        {
          type: 'html',
          html: `
            <p>如 DOS 命令：<code>COPY A:\\S.DOC C:</code>——命令 + 命令对象（命令参数）。C 支持由主函数 main() 在程序执行时从操作系统接收传递的参数，并记录参数供程序处理。主函数一般有两个参数：</p>
            <pre class="code"><code>void  main(int  argc, char *argv[ ])</code></pre>
            <p>argc 为整型变量，记录包括命令行在内的字符串个数；argv 为指向字符的指针数组，记录所有参数字符串的地址。</p>
            <p>举例：回显命令行参数（chp6ex8）。输入 <code>test How are you?</code> 时 argc 为 4，argv[0]～argv[3] 分别指向 test\\0、How\\0、are\\0、you?\\0：</p>
            <pre class="code"><code>#include  &lt;stdio.h&gt;
void  main(int  argc, char  *argv[ ])
{   int i;
    for(i=1; i&lt;argc; i++)
        printf("%s%c", argv[i], (i&lt;argc-1) ? ' ' : '\n');
}</code></pre>`,
        },
      ],
    },
    {
      id: 'sec-pd6-prep',
      heading: '6.9 编译预处理',
      blocks: [
        {
          type: 'html',
          html: `
            <p>C 语言除了说明语句、执行语句及控制语句外，还有一类<strong>编译预处理</strong>语句。该类语句的作用是在编译时对程序作一定的处理，满足特定的处理要求。编译预处理是 C 语言的重要特征。编译预处理语句的语法形式：<code>#关键词 参数表</code>——编译预处理语句<strong>不用；作为结束标志！</strong></p>
            <p><strong>⒈宏定义预处理</strong></p>
            <p>⑴<strong>不带参数的宏定义</strong>——作用：定义常量名，提高程序的可读性，便于修改。格式：<code>#define 宏名 字符串</code>。编译时用字符串替代宏名：</p>
            <pre class="code"><code>#define  PI  3.1415926
void   main(void)
{   float  r;
    scanf("%f", &amp;r);
    printf("%f\n", PI*r*r);
}</code></pre>
            <p>说明：</p>
            <ul>
              <li>⑴宏名一般用大写；</li>
              <li>⑵编译时用字符串<strong>无条件替代</strong>宏名。如 <code>#define PI 3.1415926;</code>（多写分号）时 <code>PI*r*r</code> 被替换成 <code>3.1415926;*r*r</code>；</li>
              <li>⑶宏名的有效范围从定义到程序尾，也可以通过 #undef 修改定义范围（<code>#define G 9.8 … #undef G</code>）；</li>
              <li>⑷可以在宏定义的字符串中使用已定义的宏名（<code>#define R 3.0 / #define PI 3.14159 / #define S PI*R*R</code>）；</li>
              <li>⑸" " 字符串中的宏名不替换（<code>printf("S=%f",S);</code> 中字符串里的 S 不替换）。</li>
            </ul>
            <p>⑵<strong>带参数的宏定义</strong>——格式：<code>#define 宏名(参数表) 含参数的字符串</code>。如 <code>#define S(a, b) a*b</code>，则 <code>area=S(4, 3);</code> 替换过程：①将实际参数替换宏定义的参数；②替换字符串中的参数；③替换整个宏——得到 <code>4*3</code>。<strong>带参的宏与函数的区别：带参宏不分配内存单元，不返回值，只是在编译时按规则替换。</strong>关于带参宏的说明：</p>
            <ul>
              <li>①要严格按格式书写，否则会造成错误：<code>#define S (a, b) a*b</code> 时 S(3,4) 被替换成 <code>(a,b) a*b(3,4)</code>；</li>
              <li>②参数有可能用到表达式时，参数字符要加 ( )：<code>#define S(r) PI*r*r</code> 时 <code>S(a+b)</code> 替换为 <code>PI*a+b*a+b</code>；写成 <code>#define S(r) PI*(r)*(r)</code> 时 <code>S(a+b)</code> 替换为 <code>PI*(a+b)*(a+b)</code>。</li>
            </ul>
            <p><strong>⒉文件包含</strong>——格式：<code>#include &lt;被包含的文件名&gt;</code> 或 <code>#include "被包含的文件名"</code>。&lt; &gt; 表示编译系统定义路径；" " 表示用户指明路径。作用：将指定的文件的内容和当前文件一起编译。说明：⑴一个 #include 只能包含一个文件；⑵被包含文件可以嵌套包含文件；⑶一般将宏定义及函数的原型声明放在包含文件中；⑷被包含的文件一般扩展名为 .h，称为头文件。</p>
            <p>文件包含举例：求半径为 r 的圆面积、圆周长。</p>
            <pre class="code"><code>#include  "my.h"          /* my.h 的内容：#include &lt;stdio.h&gt;
                              #define PI 3.1415926
                              float  S(float);  float  L(float);  */
void  main(void)
{      float r, fArea, fLen;
       scanf("%f", &amp;r);
       fArea = S(r);
       fLen = L(r);
       printf("Area=%f,Len=%f", fArea, fLen);
}
float  S(float r)
{      return  PI*r*r;
}
float  L(float r)
{      return  2*PI*r;
}</code></pre>
            <p><strong>⒊条件编译</strong>——C 语言可以通过条件控制，让编译系统编译不同的程序段，从而提高程序的移植性并方便调试。条件编译有三种形式：<code>#ifdef 标识符 / #else / #endif</code>；<code>#ifndef 标识符 / #else / #endif</code>；<code>#if 表达式 / #else / #endif</code>——条件满足编译程序段 1，不满足编译程序段 2。</p>
            <p>举例：通过条件编译选择求最大值或最小值：</p>
            <pre class="code"><code>#include  &lt;stdio.h&gt;
void  main(void)
{   int  a, b;
    scanf("%d,%d", &amp;a, &amp;b);
#ifdef   MAX                          /* #define MAX 时编译上行 */
    printf("%d", a&gt;=b ? a : b);
#else
    printf("%d", a&lt;=b ? a : b);
#endif
}</code></pre>`,
        },
      ],
    },
    {
      id: 'sec-pd6-hw',
      heading: '作业',
      blocks: [
        {
          type: 'html',
          html: `
            <p>⒈编写一函数求 N!。在主函数中输入 N，调用函数求 N!，输出结果。</p>
            <p>⒉用函数求 cosX = 1 − x<sup>2</sup>/2! + x<sup>4</sup>/4! − x<sup>6</sup>/6! + …，要求精度为 10<sup>-6</sup>。在主函数中求 (cos30°+cos60°)<sup>2</sup>。</p>
            <p>⒊编写函数求如下级数，在主函数中输入 n，并输出结果。</p>
            <div class="formula">a = 1 + 1/(1+2) + 1/(1+2+3) + … + 1/(1+2+…n)</div>
            <p>⒋编写一函数统计 str1 中大写字母的个数，在主函数中输入字符串 str1，并输出结果。</p>
            <p>⒌编写函数求字符串 str1 包含的字符个数，在主函数中输入字符串 str1，并验证结果。</p>
            <p>⒍编写两个子函数：其一是对主函数中的含有十个元素的数组按降序排序；其二是求数组中最大值的位置。在主函数中调用两个函数，并在主函数中输出结果。</p>
            <p>⒎编写一个函数，求二维数组所有元素的和。要求二维数组的行、列以及数组通过函数参数传递，并通过主函数调用求 2 行 3 列的数组的所有元素和。</p>
            <p>⒏编写一个函数判断 n 是不是素数，如果是返回 TRUE，否则返回 FALSE。其中 TRUE、FALSE 宏定义为 1、0。在主函数中输入任意整数输出结果。</p>
            <p>⒐已知一个班有 36 个学生。用 n 数组存放学号，a 数组存放物理成绩，b 数组存放数学成绩。要求分别通过函数实现如下功能：⑴通过函数对物理成绩按降序排序；⑵通过函数求物理或数学的最大值；⑶通过函数查找是否有指定的分数；⑷通过函数统计数学或物理各分数段的人数。在主函数中输入数据，并调用各个函数，结果在主函数中输出。</p>`,
        },
      ],
    },
  ],
};

export default ch6;
