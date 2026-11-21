/* 第七章 结构与联合 —— 逐节转录自 课件/PPT/第七章 结构与联合.ppt（36 页）；
   链表结构、结构与联合的内存布局差异依课件原图重绘为 SVG。 */
import type { PdChapter } from './types';

const ch7: PdChapter = {
  id: 'ch7',
  no: '第7章',
  title: '结构与联合',
  subtitle: '构造类型二：结构 · 动态内存分配与链表 · 联合 · 枚举 · 用户定义类型',
  lede:
    '<p>在数据中，经常有一些既有联系、类型又不同的数据，并且它们之间又有一定的相关性，需要一起处理。如学生基本档案的数据——字段：学号、姓名、性别、地址、分数；类型：long、char、char、char、float。C 语言允许用户按自己的需要将不同的基本类型构造成一种特殊类型，即<strong>结构和联合</strong>。结构和联合的操作分为三个步骤：⑴根据需要定义结构或联合类型；⑵通过定义的类型说明变量、数组、指针；⑶引用变量、数组元素和指针指向的对象。</p>',
  toc: [
    { id: 'sec-pd7-struct', text: '7.1 结构', level: 2 },
    { id: 'sec-pd7-list', text: '7.2 动态内存分配与链表', level: 2 },
    { id: 'sec-pd7-union', text: '7.3 联合（union）', level: 2 },
    { id: 'sec-pd7-enum', text: '7.4 枚举', level: 2 },
    { id: 'sec-pd7-typedef', text: '7.5 用户定义类型', level: 2 },
  ],
  sections: [
    {
      id: 'sec-pd7-struct',
      heading: '7.1 结构',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>⒈结构类型的定义</strong>——格式：</p>
            <pre class="code"><code>struct   结构名
{                type   成员项1；
                 type   成员项2；
                 …
                 type   成员项n；
                };                    /* 结构标志。用标识符命名的结构类型名。*/</code></pre>
            <p>结构类型中所含的成员项及其类型。如：</p>
            <pre class="code"><code>struct  student
{                      long  num ;
                       char  name[20] ;
                       int     age ;
                       char  add[30] ;
                       float  score ;
                      };</code></pre>
            <p>结构的定义确定了如下两点：⑴定义结构类型，确定结构中的成员项的名称及类型；⑵指明该结构类型的变量在内存中的组织形式。</p>
            <p><strong>⒉结构变量的说明</strong>——定义结构只是确定该结构类型的名称及其成员项的组成及成员项的类型。必须由定义的结构类型说明结构变量，才开辟相应的内存空间以供使用。结构变量的说明方式：</p>
            <ul>
              <li>⑴<strong>定义后说明</strong>：<code>struct student{…};</code> 然后 <code>struct student wang,zhang,liu;</code>——用 struct student 类型说明三个变量；</li>
              <li>⑵<strong>定义结构类型时说明变量</strong>：<code>struct student{…} wang,zhang,liu;</code></li>
              <li>⑶<strong>无名结构方式说明变量</strong>：<code>struct{ long num; char name[20]; int age; char add[30]; float score; } wang,zhang,liu;</code></li>
            </ul>
            <p>说明：⑴注意类型和变量的区别；⑵成员项可单独使用，如 <code>wang.age=20</code>；⑶结构的成员项也可以是结构变量：</p>
            <pre class="code"><code>struct  birth{ int  year;
               int mon;
               int day;
             };
struct  doc{          char  name[20] ;
                      struct birth age ;   /* 结构 doc 中的成员项是一个 birth 的结构变量！ */
                      float    sal ;
                     };</code></pre>
            <p><strong>⒊结构变量的引用</strong>——结构变量都是以成员项作为引用单位，引用方式：<code>结构变量名.成员项名</code>，如 <code>wang.score=100;</code></p>
            <ul>
              <li>结构变量的成员项与普通变量有相同的性质；</li>
              <li>结构变量可以相互赋值，如 <code>zhang = wang;</code> 则 wang 的所有成员项的值赋给了 zhang 的对应成员项。</li>
            </ul>
            <p><strong>⒋结构体变量的初始化</strong>——结构变量可以在说明时赋初值，称为初始化：</p>
            <pre class="code"><code>struct  student{      long  num ;
      char  name[20];
      int     age ;
      float  score ;
      char  addr [30] ;
     } wang={99010101, "王五", 20, 90.5, "上海"}, zhang;</code></pre>
            <p><strong>⒌结构数组</strong>——结构变量也可以构造成数组，称为结构数组。每个数组元素都是一个结构变量，都含有结构成员项，它们在内存中的地址是连续的。数组的说明：<code>struct 结构名 结构数组名[常量表达式];</code> 如 <code>struct student{ long num; char name[20]; float score; } stud[3];</code></p>
            <ul>
              <li>⑴三个结构数组元素都含有 student 的成员项；</li>
              <li>⑵结构数组名 stud，代表结构数组的首地址；</li>
              <li>⑶外部和静态结构数组在说明时可以初始化：<code>={{99010101,"Wang",67.5},{99010102,"Zhao",78.5},{99010103,"Fang",98.5}};</code></li>
            </ul>
            <p>举例：统计三个候选人的票数（CHAP7EX1）：</p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
#define  NUMBER  10
struct  student  { int  num;
                   char  name[20];
                   int   count;
                 } lead[3] = { 1, "Zhang", 0,
                               2, "Tan",   0,
                               3, "Wang",  0 };
void  main (void)
{  int  i, j, numb;
   for (i=0; i&lt;NUMBER; i++)
   {                                   /* 循环输入统计票数 */
      scanf ("%d", &amp;numb);
      if (numb&lt;4 &amp;&amp; numb&gt;0)
            lead[numb-1].count++;
      else
            printf("Selection error\n");
    }
printf ( "\n" );
for (i=0; i&lt;3; i++)
   printf ("%5s:%d\n", lead[i].name, lead[i].count);   /* 输出结果 */
}</code></pre>
            <p><strong>⒍结构指针</strong>——概念：指向结构变量首地址的指针称为结构指针。结构指针加一，地址加一个结构变量所占的字节。结构指针的应用：</p>
            <ul>
              <li>⑴先说明结构指针：<code>struct student *p, stu1;</code>（指向结构的指针）；</li>
              <li>⑵指针指向同类型的结构变量或数组：<code>p=&amp;stu1;</code></li>
              <li>⑶通过指针引用指针指向变量的成员项，引用方式为：方式一 <code>(*p).成员项名</code>；方式二 <code>p-&gt;成员项名</code>。结构指针主要用于对结构数组操作：</li>
            </ul>
            <pre class="code"><code>struct  studoc{
        int iNum;
        char *name;
    }*p, wang={2001,"wang li"};
p = &amp;wang;
printf("%d：%s", p-&gt;iNum, p-&gt;name);</code></pre>
            <p>举例（CHAP7EX2）：</p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
struct  sam{ int  num;
             char  name[20];
             char   addr[30];
           } ws[ ]={ {101, "Fang", "Shanghai"},
                     {102, "Tan",  "Bejing"},
                     {103, "Wang", "Hefei"}
                   };
void main ( void)
{   int  i;
    struct  sam  *pws;               /* 说明结构指针 */
    pws = ws;                        /* 指针指向结构数组 */
    for ( i=0; i&lt;3; i++, pws++)
         printf ("%-9d%-14s%-20s\n", pws-&gt;num,    /* 通过指针引用成员项 */
                                  pws-&gt;name,
                                  pws-&gt;addr);
}</code></pre>
            <p><strong>⒎结构与函数参数</strong>——当函数需要通过形参传递一个结构时，一般有两种处理办法：</p>
            <ul>
              <li>⑴<strong>传递一个结构指针（效率高）</strong>：</li>
            </ul>
            <pre class="code"><code>#include&lt;stdio.h&gt;
void  mprintp (struct  student  * );
struct  student { long  num; char  *name; float  score; };
void  main ( )
{   struct  student  s1;
    s1.num = 99010101;
    s1.name = "wang hai";
    s1.score = 99;
    mprintp ( &amp;s1 );
}
void  mprintp ( struct  student  *sp )    /* 指向结构的指针 */
{    printf("%ld\n%s\n%5.1f\n", sp-&gt;num, sp-&gt;name, sp-&gt;score);
}</code></pre>
            <ul>
              <li>⑵<strong>传递一个结构变量（效率低）</strong>：<code>void mprintp(struct student);</code>——形参 <code>struct student sv</code> 得到实参 s1 的一份拷贝，函数内访问 sv.num、sv.name、sv.score。</li>
            </ul>
            <p><strong>⒏返回结构变量的函数</strong>——当函数的返回值为一个结构变量时，称该函数为一个结构型函数：</p>
            <pre class="code"><code>struct  stu   sv(void)
{    struct stu  t;
     …
     return t;
}                 /* 函数的类型，即返回值是结构变量 */</code></pre>
            <p>例题：返回结构的函数（CHAP7EX3）：</p>
            <pre class="code"><code>#include&lt;stdio.h&gt;
#include  &lt;stdlib.h&gt;
struct   stu{        long  num ;
                     char  name[10] ;
                     float  score ; } ;
struct  stu   sv(void);
void   main ( void)
{   struct   stu  ws;
    ws = sv ( );
    printf ("%ld\n%s\n:%f\n", ws.num, ws.name, ws.score);
}
struct  stu   sv(void)
{  struct  stu   stemp;
   char  str[20];
   gets(stemp.name);
   gets(str);
   stemp.num = atol(str);
   gets(str);
   stemp.score = atof(str);
   return ( stemp );
}</code></pre>
            <p><strong>⒐返回结构指针的函数</strong>——当函数的返回值为一个结构指针时，称该函数为一个结构指针型函数：</p>
            <pre class="code"><code>#include&lt;stdio.h&gt;
struct  stu  { long  num; char *name; float score;
             } sa[ ] = { 99010101, "fun",   89,
                         99010102, "zhang", 99,
                         99010103, "wang",  78,
                         0,        0,       0 };
struct  stu  *findp (long);
void  main ( )
{        long  lsanum;
         int  i;
         struct  stu  *sap;
         scanf ("%ld", &amp;lsanum);
         sap = findp (lsanum);
         if ( sap-&gt;num == NULL )
              printf ( "not found \n" );
         else
              printf ("%ld \n %s \n %f \n", sap-&gt;num, sap-&gt;name, sap-&gt;score);
}
struct   stu  *findp (long  number )
{        struct   stu *p = NULL;
         int  i;
         for (i=0; sa[i].num != 0; i++)
                if (sa[i].num == number)
                {        p = &amp;sa[i];
                         break;
                }
          return   p;
}</code></pre>
            <p><strong>思考题</strong>：已知一个班有 40 个人，本学期有两门课程的成绩，求：①所有课程中的最高成绩，及对应的姓名、学号和课程编号；②课程 1，2 的平均成绩，并求出两门课程都低于平均成绩的学生姓名和学号；③对编号 1 的课程从高到低排序（注意，其他成员项应保持对应关系）。说明：要求定义结构，第一成员项为学生姓名，第二成员项为学号，另外两个成员项为两门课成绩。①、②、③要求分别用函数完成。</p>`,
        },
      ],
    },
    {
      id: 'sec-pd7-list',
      heading: '7.2 动态内存分配与链表',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>⒈动态分配内存的概念</strong>——C 语言运行程序包含了堆栈（stack）、堆（heap）、静态（static）、字符常量、代码等 5 个内存区。数组在定义时，元素的个数是整型常量——也就是说数组元素的数量是固定的。<strong>动态内存分配</strong>可以通过 C 语言提供的函数在堆中根据需要随时、随地、自定数量分配内存。动态内存分配操作的步骤：定义指针；分配内存；使用分配的内存；释放内存。</p>
            <p><strong>⒉内存分配函数与动态内存分配</strong>——C 语言提供了一类函数用于动态内存分配及释放，该类函数在 stdlib.h 或 malloc.h 中声明，所以使用前应包含该文件，如 <code>#include &lt;stdlib.h&gt;</code></p>
            <p>⑴<strong>malloc 函数</strong>——使用方法：<code>ptr = malloc(size);</code>（size 为分配内存的字节数）。返回空类型的指针：成功返回内存的地址，失败返回 NULL。原型：<code>void *malloc(unsigned int num_bytes);</code> 如：</p>
            <pre class="code"><code>void  *ptr;
ptr = malloc(sizeof(short))</code></pre>
            <p>⑵ <code>void free(ptr)</code>——作用：释放 ptr 指向的由 malloc 分配的内存空间。</p>
            <p>举例：输入 n 个浮点型数据，求小于平均值的数据个数：</p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
int main(void)
{    float *fPBuff, fAve = 0.0f;
    int i, n, iCount = 0;
    // 输入 n…
    fPBuff = (float  *)malloc((sizeof (float)) * n);
    if (fPBuff == NULL)
    {        printf("数据分配错误程序退出！");
        return 1;
    }
    // 输入 n 个数据，求平均值…
             // 遍历所有数据，并根据条件统计，输出结果。
    free(fPBuff);
    return 0;
}</code></pre>
            <p>⑶<strong>calloc 函数</strong>——使用方法：<code>ptr = calloc(n, size);</code>（1. 分配内存块数；2. 每块字节数）。返回空类型的指针：成功返回内存的地址，失败返回 NULL。原型：<code>void *calloc(size_t n, size_t size);</code></p>
            <p>⑷<strong>realloc 函数</strong>——使用方法：<code>ptr = realloc(ptr, size);</code>（1. 原来分配内存的地址；2. 新分配内存的字节数）。返回空类型的指针：成功返回内存的地址，失败返回 NULL。原型：<code>void *realloc(void *ptr, size_t newsize);</code></p>
            <p>举例：输入 m、n 为二维矩阵的行列数，输入该矩阵，求元素和：</p>
            <pre class="code"><code>#include &lt;STDIO.H&gt;
#include &lt;STDLIB.H&gt;
int main(void)
{    int m, n, iSum=0, i, j, **ipOfArray, *ipBuff;
    scanf("%d,%d", &amp;m, &amp;n);
    ipOfArray = (int **)malloc(sizeof(int *) * m);
    ipBuff = (int *)calloc(m, sizeof(int) * n);
    if (ipOfArray == NULL || ipBuff == NULL)
    {        exit(1);
    }
    for (i = 0; i &lt; m; i++)
    {        *(ipOfArray + i) = ipBuff + i * n;
    }
              // 遍历输入求和
    printf("%d×%d矩阵的元素和：%d\n", m, n, iSum);
    free(ipOfArray);
    free(ipBuff);
    return 0;
}</code></pre>
            <p><strong>⒊引用自身的结构和链表的概念</strong>——结构中的某个成员项，为指向该结构类型自身的指针，则称为<strong>引用自身的结构</strong>：</p>
            <pre class="code"><code>struct  student{
                           int  num ;
                           float  score ;
                 struct  student  *next ;    /* 指向自身结构的指针 */
                          };                 /* 相同类型的结构指针 */</code></pre>
            <p><strong>链表</strong>是一种动态存储分配结构，通过指针相连，数据可以不连续存放。</p>
            <figure class="fig">
              <svg viewBox="0 0 700 120" role="img" aria-label="链表结构：头指针 head 经头结点连接各结点，尾结点地址域为 NULL">
                <defs>
                  <marker id="pd7-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                    <path d="M0,0 L10,5 L0,10 z" style="fill:var(--ink-3)"/>
                  </marker>
                </defs>
                <g style="font-family:var(--font)" font-size="12">
                  <g style="fill:var(--panel-2);stroke:var(--deck-accent)" stroke-width="1.5">
                    <rect x="30" y="44" width="90" height="34" rx="8"/>
                    <rect x="200" y="44" width="120" height="34" rx="8"/>
                    <rect x="400" y="44" width="120" height="34" rx="8"/>
                  </g>
                  <g fill="var(--ink)" text-anchor="middle" font-weight="700">
                    <text x="75" y="65">head</text>
                    <text x="260" y="65">头结点</text>
                    <text x="460" y="65">结点</text>
                  </g>
                  <g fill="var(--ink-2)" font-size="11" text-anchor="middle">
                    <text x="260" y="98">数据域 · 地址域</text>
                    <text x="460" y="98">数据域 · 地址域</text>
                    <text x="610" y="65" fill="var(--ink)" font-weight="700">NULL</text>
                    <text x="260" y="24">2000H</text>
                    <text x="460" y="24">2400H</text>
                  </g>
                  <g stroke="var(--ink-3)" stroke-width="1.4" fill="none" marker-end="url(#pd7-arr)">
                    <path d="M120,61 L200,61"/>
                    <path d="M320,61 L400,61"/>
                    <path d="M520,61 L586,61"/>
                  </g>
                </g>
              </svg>
              <p class="fig-cap">链表（依课件原图重绘）：head 指向头结点（2000H），头结点数据域无内容，经地址域相连（2400H…），最后一个结点的地址域为 NULL（tail）。</p>
            </figure>
            <p><strong>⒋链表的操作</strong>——为了建立、使用、维护链表，对链表的操作如下：建立链表、遍历链表、尾部追加、删除结点、查找结点。数据结构：</p>
            <pre class="code"><code>struct student{
        long lNum;
        float fScore;
        struct student *pNext;
};
#define SIZE sizeof(struct student)</code></pre>
            <p><strong>⒌链表的操作</strong></p>
            <p>⑴<strong>建立链表</strong>——步骤：①建立头指针及头结点；②循环输入数据域，并连接结点；③最后一个结点地址域置空。建立链表函数：</p>
            <pre class="code"><code>struct student *CreatLiList(void)
{        struct student *spHead, *spPre, *spCur;
         long lv;
         float fv;
         spPre  = (struct student *)malloc(SIZE);   // 头结点
         spHead = spPre;
         spHead -&gt; pNext = NULL;
         do
         {        scanf("%ld,%f", &amp;lv, &amp;fv);
             if (lv != -1)
             {        spCur = (struct student *)malloc(SIZE);
                 spCur -&gt; lNum = lv;
                 spCur -&gt; fScore = fv;
                 spCur -&gt; pNext = NULL;
                 spPre -&gt; pNext = spCur;
                 spPre = spCur;
             }
         } while (lv != -1);        // 以 -1 结束。
         return spHead;
}</code></pre>
            <p>⑵<strong>遍历链表</strong>：</p>
            <pre class="code"><code>void TraverLiList(struct student *sp)
{        struct student *spCur;
         spCur = sp -&gt; pNext;
         while (spCur != NULL)
         {        printf("Num:%ld\tScore:%7.1f\n",
                                  spCur -&gt; lNum, spCur -&gt; fScore);
             spCur = spCur -&gt; pNext;
         }
}</code></pre>
            <p>⑶<strong>在尾部追加节点</strong>：</p>
            <pre class="code"><code>int AppendNode(struct student *sp, long lArg, float fArg)
{        struct student *spCur, *spNew;
         spCur = sp -&gt; pNext;
         while(spCur -&gt; pNext != NULL)
         {        spCur = spCur -&gt; pNext;
         }
         spNew = (struct student *)malloc(SIZE);
         if (spNew == NULL)
         {        return 1;
         }
         spNew -&gt; lNum = lArg;
         spNew -&gt; fScore = fArg;
         spNew -&gt; pNext = NULL;
         spCur -&gt; pNext = spNew;
         return 0;
}</code></pre>
            <p>⑷<strong>删除节点函数</strong>：</p>
            <pre class="code"><code>int DeleteNode(struct student *sp, long lArg)
{        struct student *spCur, *spT;
         spCur = sp;
         while(spCur -&gt; pNext != NULL &amp;&amp;
                       spCur -&gt; pNext -&gt; lNum != lArg)
         {        spCur = spCur -&gt; pNext;
         }
         if (spCur -&gt; pNext == NULL)
         {        return 1;
         }
         spT = spCur -&gt; pNext;
         spCur -&gt; pNext = spCur -&gt; pNext -&gt; pNext;
         free(spT);
         return 0;
}</code></pre>
            <p>⑸<strong>查找节点函数</strong>：</p>
            <pre class="code"><code>int SearchNode(struct student *sp, long lArg)
{        struct student *spCur;
         spCur = sp -&gt; pNext;
         while(spCur -&gt; pNext != NULL &amp;&amp; spCur -&gt; lNum != lArg)
         {        spCur = spCur -&gt; pNext;
         }
         if (spCur -&gt; lNum == lArg)
         {        printf("The num %ld:%7.1f\n", spCur -&gt; lNum,
                                      spCur -&gt; fScore);
             return 0;
         }
         else
         {        return 1;
         }
}</code></pre>`,
        },
      ],
    },
    {
      id: 'sec-pd7-union',
      heading: '7.3 联合（union）',
      blocks: [
        {
          type: 'html',
          html: `
            <p>概念：不同数据类型的集合；<strong>每个成员项共用一段内存空间</strong>；某一时刻只能对一个「活的（active）」成员项操作。</p>
            <p><strong>⒈联合类型的定义</strong>——格式：</p>
            <pre class="code"><code>union  联合名{
                      type  成员项 1；
                      type  成员项 2；
                       …
                       type  成员项 n；
                     } ;
union  exam{          int a ;
                      float  b ;
                      char  c ;
                     };</code></pre>
            <p><strong>⒉联合变量的说明和引用</strong>——可以用联合类型说明：联合变量、联合数组、指向联合指针。如 <code>union exam x, *px, y[10];</code> 引用：引用变量的成员项——通过变量引用 <code>变量名.成员项名</code>；通过指针引用 <code>指针-&gt;成员项名</code>。</p>
            <p><strong>⒊联合与结构的区别</strong>——结构变量的每个成员项有独立的内存单元，而联合变量的成员项以最大的成员项开辟单元后，所有成员项共用单元（<code>sizeof(struct exam)</code> 与 <code>sizeof(union exam)</code> 不同）。</p>
            <figure class="fig">
              <svg viewBox="0 0 700 150" role="img" aria-label="结构与联合的内存布局对比">
                <g style="font-family:var(--font)" font-size="12">
                  <text x="170" y="20" fill="var(--ink)" text-anchor="middle" font-weight="700">struct exam x</text>
                  <g style="fill:var(--panel-2);stroke:var(--ink-2)" stroke-width="1.4">
                    <rect x="80" y="34" width="180" height="22"/>
                    <rect x="80" y="60" width="180" height="22"/>
                    <rect x="80" y="86" width="180" height="22"/>
                  </g>
                  <g fill="var(--ink)" text-anchor="middle">
                    <text x="170" y="50">a</text>
                    <text x="170" y="76">b</text>
                    <text x="170" y="102">c</text>
                  </g>
                  <text x="510" y="20" fill="var(--ink)" text-anchor="middle" font-weight="700">union exam x</text>
                  <g style="fill:var(--panel-2);stroke:var(--deck-accent)" stroke-width="1.4">
                    <rect x="420" y="34" width="180" height="74"/>
                  </g>
                  <g fill="var(--ink)" text-anchor="middle">
                    <text x="510" y="58">a / b / c</text>
                    <text x="510" y="78" font-size="11" fill="var(--ink-2)">共用同一段内存单元</text>
                  </g>
                  <text x="170" y="130" fill="var(--ink-2)" text-anchor="middle" font-size="11">各成员项独立内存单元</text>
                  <text x="510" y="130" fill="var(--ink-2)" text-anchor="middle" font-size="11">以最大的成员项开辟单元</text>
                </g>
              </svg>
              <p class="fig-cap">结构与联合的内存布局差异（依课件原图重绘）。</p>
            </figure>
            <p>举例（CHAP7EX4）：</p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
void  main (void)
{
 union  exam{
                       int  i ;
                       char  ch[2] ;
                      } x ;
 x.i = 24897;      /* i:0x6141 */
 printf ("i=%xH\n", x.i);
 printf ("ch[0]=%xH,ch[1]=%xH\n", x.ch[0], x.ch[1]);
 printf ("ch[0]=%c, ch[1]=%c\n", x.ch[0], x.ch[1]);
}</code></pre>
            <p><em>课件图示：x 的低地址单元 ch[0] 存 0x61、ch[1] 存 0x41——整型 i 与字符数组 ch[2] 共用单元。</em></p>`,
        },
      ],
    },
    {
      id: 'sec-pd7-enum',
      heading: '7.4 枚举',
      blocks: [
        {
          type: 'html',
          html: `
            <p>概念：<strong>有限状态的集合，以整型值代表</strong>。如：月份，星期。</p>
            <p><strong>⒈枚举类型的定义</strong>——格式：<code>enum 枚举类型名{ 枚举元素表 };</code> 如：</p>
            <pre class="code"><code>enum  day{sun, mon, tue, wed, thv, fri, sat} ;</code></pre>
            <p>说明：⑴枚举元素如果不赋值，自动取 0~n-1 整数值；⑵在定义时，可以对某个枚举元素赋值，其后的元素按此值自动加一递增。</p>
            <p><strong>⒉枚举变量的说明和引用</strong>——<code>enum day day1, day2;</code> 枚举变量只能取该类型中的一个元素：<code>day1=sat;</code>；<code>day2=(enum day)2;</code></p>`,
        },
      ],
    },
    {
      id: 'sec-pd7-typedef',
      heading: '7.5 用户定义类型',
      blocks: [
        {
          type: 'html',
          html: `
            <p>C 语言可以通过 <strong>typedef</strong> 语句，定义自己命名的数据类型，实际上是给 C 类型重新起个名字。typedef 语句的格式：<code>typedef type 标识符;</code>（C 语言的类型名 + 用户定义类型名）。引用方式：</p>
            <p>⑴基本类型：</p>
            <pre class="code"><code>typedef  int   INTEGER;
INTEGER  a, b;</code></pre>
            <p>⑵数组：</p>
            <pre class="code"><code>typedef  char  STRING[41];
STRING   a, b;              /* 等价于 char a[41], b[41]; */</code></pre>
            <p>⑶用户定义结构或联合类型名：</p>
            <pre class="code"><code>typedef  struct {
              char  name[30] ;
              long  num ;
              float  csore ;
              }   MYSTRU;
MYSTRU  a, b, *p ;</code></pre>`,
        },
      ],
    },
  ],
};

export default ch7;
