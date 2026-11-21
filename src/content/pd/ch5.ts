/* 第五章 指针 —— 逐节转录自 课件/PPT/第五章 指针.ppt（25 页）；
   内存示意、二维数组两级管理等图示依课件原图转录。 */
import type { PdChapter } from './types';

const ch5: PdChapter = {
  id: 'ch5',
  no: '第5章',
  title: '指针',
  subtitle: '指针的概念与运算 · 指针与数组 · 指针数组 · 指向指针的指针 · 指针类型',
  lede:
    '<p>第五章 指针（Pointer）。指针是 C 语言的重要特征，是 C 语言访问内存数据和程序的灵活和有效的手段。C 语言的指针支持：⑴函数的地址调用；⑵动态分配内存；⑶数组的地址引用。</p>',
  toc: [
    { id: 'sec-pd5-concept', text: '5.1 指针的概念', level: 2 },
    { id: 'sec-pd5-array', text: '5.2 指针与数组', level: 2 },
    { id: 'sec-pd5-parr', text: '5.3 指针数组', level: 2 },
    { id: 'sec-pd5-pp', text: '5.4 指向指针的指针', level: 2 },
    { id: 'sec-pd5-type', text: '5.5 指针的类型问题', level: 2 },
  ],
  sections: [
    {
      id: 'sec-pd5-concept',
      heading: '5.1 指针的概念',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>⒈内存、地址、指针（Memory, Address, Pointer）</strong>——内存存放了计算机正在运行的程序和程序正在使用的数据。内存的基本单元是字节（Byte）。为了访问内存单元，给每个内存单元一个编号，该编号称为该内存单元的<strong>地址</strong>。</p>
            <p>变量是程序中可以改变的量，当说明变量时，系统将为其在内存中开辟相应的内存单元，由此确定变量的地址及内存中的表示方式。如 <code>int a=0;</code>——a 的内存单元在地址 2000H 处，a 的地址即 &amp;a。如果有一变量 p，其内容存放了 a 的地址 &amp;a，通过 p 也可实现对 a 的访问，p 称为<strong>指针</strong>，并<strong>指向</strong> a（p 的单元 3000H 中存放 2000H）。</p>
            <p><strong>⒉指针的说明</strong>——指针是特殊类型的变量，其内容是变量的地址。在使用前必须说明，说明某标识符是指针类型，并可指向某种类型的对象。指针的说明格式：<code>type *pname1, … *pnamen;</code>——指针标志为 *；指针指向对象的类型为 type；标识符命名的指针变量名 pname。如：</p>
            <pre class="code"><code>short     *p, *q;        /* p、q 是指向短整型变量的指针 */
float  *pfValue, *pf;    /* pfValue 和 pf 是指向浮点型的指针 */</code></pre>
            <p><strong>⒊指针对变量的引用</strong>——定义指针的目的是通过指针引用内存对象，指针的引用应按如下步骤进行：</p>
            <ul>
              <li>⑴说明指针：<code>short a=0, *p;</code></li>
              <li>⑵指针指向对象：<code>p=&amp;a;</code></li>
              <li>⑶通过指针引用对象：<code>*p=*p+2;</code></li>
            </ul>
            <p>指针操作的两种运算：<strong>取地址运算 &amp;</strong>（&amp;a 表示取变量 a 地址的运算）；<strong>间接运算 *</strong>（*p 表示取指针 p 指向变量内容的运算）。如 <code>short a,*p; p=&amp;a;</code> /* p 指向 a */；<code>*p=2;</code> 即 a 的单元被写为 2。</p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
void main (void )
{   short x, *p;
    x = 55;
    p = &amp;x;
    printf ( "%d, %u", x, *p);
    *p = 65;
    printf ( "%d, %u", x, *p);
}</code></pre>
            <p><strong>关于指针的说明</strong>：</p>
            <ul>
              <li>⑴指针必须指向对象后，才能引用：<code>int *p; *p=2;</code> /* Error! */；</li>
              <li>⑵ &amp; 和 * 为互补运算：<code>int a,*p; p=&amp;a;</code> 则 <code>&amp;*p → p</code>、<code>*&amp;a → a</code>。</li>
            </ul>
            <p><strong>⒋指针的运算</strong>——指针是特殊类型的变量，其内容是变量的地址，因此指针的运算及结果一定要符合地址逻辑。</p>
            <p>⑴<strong>五种算术运算</strong>（设 <code>short a, b, *p1, *p2; p1=&amp;a; p2=&amp;b;</code>，a 在 2000H、b 在 2400H）：p1++（含义指向 a 后的短整型单元，即 2002H）；p1--（指向 a 前的整型单元）；p1+n（指向 a 后的第 n 个短整型单元）；p1-n（指向 a 前的第 n 个短整型单元）；p2-p1（a 和 b 之间差的单元数）。<code>p ± n</code> 相当于：p 的实际内容 ± n×sizeof(*p)。</p>
            <p>⑵<strong>六种关系运算</strong>——比较两个同类型变量之间的地址关系，如 <code>p1&gt;p2;</code></p>
            <p>⑶<strong>指针赋值运算</strong>——<code>*p1=*p2;</code> 是把 p2 指向的值赋给 p1 指向的变量；<code>p1=p2;</code> 是让 p1 指向 p2 所指的对象——两者有差别：</p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
void main(void)
{   short  a, b, *p1, *p2;
    a = 2;
    b = 3;
    p1 = &amp;a;
    p2 = &amp;b;
    *p1 = *p2;               /* a、b 的值：3，3 */
    printf("%d,%d\n", a, b);
    a = 3;
    b = 5;
    p1 = p2;                 /* 输出 p1 现在指向的 b：5，5 */
    printf("%d,%d", *p1, *p2);
}</code></pre>`,
        },
      ],
    },
    {
      id: 'sec-pd5-array',
      heading: '5.2 指针与数组',
      blocks: [
        {
          type: 'html',
          html: `
            <p>数组是同类型的变量的集合，各元素按下标的特定顺序占据一段连续的内存，各元素的地址也连续，指针对数组元素非常方便。</p>
            <p><strong>⒈指针与一维数组</strong>——通过指针引用数组元素可以分以下三个步骤：</p>
            <ul>
              <li>⑴说明指针和数组：<code>int *p, a[10];</code></li>
              <li>⑵指针指向数组：<code>p=a;</code> /*指向数组的首地址*/ 或 <code>p=&amp;a[0];</code> /*指向数组的首地址*/</li>
              <li>⑶通过指针引用数组元素：当指针指向数组的首地址时，下标为 i 的元素地址为 <code>p+i</code> 或 <code>a+i</code>。引用数组元素可以有三种方法：<strong>下标法</strong> <code>a[i]</code>；<strong>指针法</strong> <code>*(p+i)</code>；<strong>数组名法</strong> <code>*(a+i)</code>。注意：<strong>数组名是地址常量，不能改变！</strong><code>a=p;</code> /*Error!*/</li>
            </ul>
            <p>举例：打印数组中的奇数：</p>
            <pre class="code"><code>#include  &lt;stdio.h&gt;
void  main(void )
{   int  i, a[10], *p;
    for (i=0; i&lt;10; i++)
          scanf ( "%d", &amp;a[i]);       /* 循环输入 */
    p = a;                            /* p = &amp;a[0]; */
    for (i=0; i&lt;10; i++)
      if  ( *(p+i) % 2 )              /* 指针法 *(p+i) */
            printf ( "%d", *(p+i));
}   /* 数组元素法 a[i]%2、数组名法 *(a+i)；注意指针在运算时的变化，结果是否正确？ */</code></pre>
            <p><strong>⒉指针与字符串</strong>——字符串在内存中可以存储为两种形式：</p>
            <ul>
              <li>⑴<strong>字符数组</strong>：可以使指针指向字符数组或字符串常量，通过指针引用字符数组或字符串的各个字符。<code>char *chp, str[ ]="Hello!";</code> /*说明字符指针和字符数组*/；<code>chp=str;</code> /*指针指向字符数组*/；<code>putchar(*(chp+2));</code> /*通过指针引用数组元素*/</li>
              <li>⑵<strong>字符串常量</strong>：<code>char *strp;</code> /*说明字符指针*/；<code>strp="Hello!";</code> /*指针指向字符串*/；<code>puts(strp);</code> /*通过指针引用字符串*/。说明指针时可以同时赋初值，如 <code>char *strp="Hello!";</code>——赋值表示将字符串的地址赋给指针！</li>
            </ul>
            <p>举例：将字符串中的大写字母转化对应的小写字母：</p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
void main(void)
{     char  *p, s[80];
      p = s;
      gets(p);
      for(; *p!='\0'; p++)
      {       if(*p&gt;='A' &amp;&amp; *p&lt;='Z')
                    *p += 32;
      }
      p = s;
      puts(p);
}</code></pre>
            <p>将无符号的八进制字符串转换为十进制整数（Chap5ex5）：</p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
void main(void)
{     char  *p, s[6];
      int  i, n=0;
      p = s;                     /* p 指向 s 数组 */
      gets(p);                   /* 输入字符串（如 "556"） */
      for(; *p!='\0'; p++)
          n = n*8 + *p - '0';    /* n=0*8+'5'-'0'→5；n=5*8+'5'-'0'→45；n=45*8+'6'-'0'→366 */
      printf("%d\n", n);
}</code></pre>
            <p>思考题：将 4 位十六进制值字符串转化为十进制字符串。</p>
            <p><strong>⒊二维数组的地址</strong>——如下说明数组 <code>int a[3][4]={{1,2,3,4},{5,6,7,8},{9,10,11,12}};</code> 其二维结构为三行四列的矩阵。为了便于索引，C 语言将数组分为<strong>两级管理</strong>：</p>
            <ul>
              <li>⑴将 a 理解为一维数组，数组有三个元素，它们分别为 a[0]、a[1]、a[2]，各个元素又是一个有四个元素的一维数组；</li>
              <li>⑵从地址的角度看：a 为 a[0] 第一行的首地址；a+1 为 a[1] 第二行的首地址；a+2 为 a[2] 第三行的首地址——<strong>a+1 地址一次加一行</strong>；</li>
              <li>⑶i 行 j 列数组元素的地址可以由 <code>a[i]+j</code> 得到。</li>
            </ul>
            <p>⑷<em>课件图示：数组名地址的两级管理——a 指向行 a[0]、a[1]、a[2]；a[0] 再指向列 a[0][0]～a[0][3]，依此类推。</em></p>
            <p>⑸<strong>等价地址及其管理方式</strong>——数组名是数组的地址，而且是常量，* 运算不改变其值！以下三种地址等价：</p>
            <div class="formula">a+i、*(a+i)、a[i]（加法按行递增）；(a+1)+1 与 *(a+1)+1 的差别？（前者按行递增，后者按列递增）</div>
            <p>⑹<strong>数组名表示数组元素</strong>——a[i][j] 的四种等价形式：</p>
            <div class="formula">a[i][j] ⇔ (*(a+i))[j] ⇔ *(*(a+i)+j) ⇔ *(a[i]+j)</div>
            <p>⑺<strong>指针与二维数组</strong>——<code>int *p, a[3][4]; p=a;</code> 则 <code>a[i][j]</code> 与 <code>*(p+4*i+j)</code> 等价！<em>课件图示：a[0]、a[1]、a[2] 与 a+1、a[1]+2 的指向关系。</em></p>
            <p>举例：在数组 a 中查找输入的数，输出行列位置：</p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
void main (void )
{   int  a[3][4]={1,2,3,4,5,6,7,8,9,10,11,12};
    int  i, j, iS;
    int  *p;
    p = a;
    scanf ( "%d", &amp;iS);
    for(i=0; i&lt;3; i++)
    for(j=0; j&lt;4; j++)
    /* 下标法 a[i][j]；*(a[i]+j)；*(*(a+i)+j)；*(p+4*i+j) 四种写法均可 */
          if(iS == a[i][j])
                printf("iS equal to a[%d][%d]\n", i, j);
}</code></pre>`,
        },
      ],
    },
    {
      id: 'sec-pd5-parr',
      heading: '5.3 指针数组',
      blocks: [
        {
          type: 'html',
          html: `
            <p>指针是存放其它数据对象地址的变量。因此，指针可以构成数组。每个数组元素为一个指针变量，且在内存中连续存放。</p>
            <p><strong>⒈指针数组的说明</strong>——说明格式：<code>type *数组名[const exp];</code> 如 <code>int *p[4];</code>——含义是在内存中开辟空间，并指明元素所指向的对象的类型。数组名 p 为数组的地址；<strong>使用前必须让各元素指向对象</strong>：</p>
            <pre class="code"><code>int  i, a[3][4], *p[3];
for(i=0; i&lt;3; i++)
       p[i] = a[i];
*(p[2]+1) = 2;          /* 通过指针数组引用数组元素 a[2][1] */</code></pre>
            <p><strong>⒉指针数组的应用举例</strong></p>
            <p>⑴<strong>指针数组与多维数组</strong>——通过指针数组按数学方式输出数组的值：</p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
void main ( )
{   int   i, j;
    int  a[3][4]={ {1,2,3,4}, {5,6,7,8}, {9,10,11,12} };
    int  *p[3];
    p[0] = a[0]; p[1] = a[1]; p[2] = a[2];
    for  (i=0; i&lt;3; i++)
    {        for (j=0; j&lt;4; j++)
                printf ( "%5d", *(p[i]+j));
             printf ( "\n" );          /* 每输出一行，打印回车 */
     }
}</code></pre>
            <p>⑵<strong>指针数组与多字符串</strong>——通过指针数组对字符串排序（升序）：</p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
void main(void)
{    char *szpArray[5] = {"Zhao","Qian","Sun","Li","Zhou"};
     char *chpTemp = NULL;
     int i, j;
     for (i = 0; i &lt; 4; i++)
     {        for (j = i + 1; j &lt; 5; j++)
             {        if (strcmp(szpArray[i], szpArray[j]) &gt; 0)
                     {        chpTemp = szpArray[i];
                          szpArray[i] = szpArray[j];
                          szpArray[j] = chpTemp;
                     }
             }
     }
     for (i = 0; i &lt; 5; i++)
     {        puts(szpArray[i]);
     }
}                                      /* Chap5ex3 */</code></pre>`,
        },
      ],
    },
    {
      id: 'sec-pd5-pp',
      heading: '5.4 指向指针的指针',
      blocks: [
        {
          type: 'html',
          html: `
            <p>如果指针变量的内容存放其它指针的地址，称该指针为<strong>指向指针的指针</strong>。</p>
            <p><strong>⒈指向指针的指针的说明</strong>——形式：<code>type **p;</code> 如 <code>int **p;</code>——p 是一个指向整型指针的指针。</p>
            <pre class="code"><code>#include  &lt;stdio.h&gt;
void  main ( void)
{   int  x, *p, **q;
    x = 10;
    p = &amp;x;        /* p 为指向整型的指针（2000H） */
    q = &amp;p;        /* q 为指向整型指针的指针（3000H） */
    printf ("%d", **q);
}</code></pre>
            <p><strong>⒉指向指针的指针的应用</strong>——指向指针的指针一般用于多维数组和指针数组的操作。</p>
            <p>⑴<strong>多维数组</strong>：</p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
void  main ( )
{  int  a[3][4]={1,2,3,4,5,6,7,8,9,10,11,12};
   int  *arr[3] = {a[0], a[1], a[2]};
   int  i, j, **p;
   p = arr;                          /* p → arr → a[i] → a[i][j] */
   for (i=0; i&lt;3; i++)
   {  for (j=0; j&lt;4; j++)
          printf("%5d", *(*(p+i)+j));
    printf ("\n");
   }
}</code></pre>
            <p>⑵<strong>用于处理多字符串</strong>：</p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
void  main (void)
{  char  *name[ ]={"one", "two", "three", "four"};
   char  **p;
   int  i;
   for ( i=0; i&lt;4; i++)
   {       p = name+i;
         printf ("%s\n", *p);
   }
}</code></pre>`,
        },
      ],
    },
    {
      id: 'sec-pd5-type',
      heading: '5.5 指针的类型问题',
      blocks: [
        {
          type: 'html',
          html: `
            <p>通过指针可以访问基本类型的变量及数组，指针的类型是其指向数据的类型，该类型决定了指针逻辑加一时所加的物理字节数。可以<strong>强制转换指针的类型</strong>，转换方式为：<code>(type *)p</code></p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
void main( )
{   char  a[3], *p;
    short  y;
    a[0] = 0x12;
    a[1] = 0x34;
    a[2] = 0x56;
    p = &amp;a[0];
    y = *(short *)p;          /* 相邻单元转化为一个整型单元 */
    printf( "%x\n", y);
}                            /* chp5ex2 */</code></pre>
            <p><strong>指向 void 类型的指针</strong>——void 称为「空类型」，void 不能说明变量，但可以用 void 说明指针。当用 void 说明指针时，指针称为指向空类型的指针，空类型指针加 1，地址移动一个字节。也就是说 void 指向的类型是以物理字节为单位的内存。</p>`,
        },
      ],
    },
  ],
};

export default ch5;
