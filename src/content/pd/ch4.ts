/* 第四章 数组 —— 逐节转录自 课件/PPT/第四章 数组.ppt（56 页）；
   数组内存结构、乘法表、矩阵等图示依课件原图转录，三个专题与小组作业完整收录。 */
import type { PdChapter } from './types';

const ch4: PdChapter = {
  id: 'ch4',
  no: '第4章',
  title: '数组',
  subtitle: '一维 / 多维 / 字符数组 · 常用算法（极值、排序、查找） · 数组与矩阵',
  lede:
    '<p>Chapter 4 Array。在应用中经常会遇到某些类型相同并相互具有联系的数据，如一个班 30 个人的一门课程的成绩，求平均成绩、最高或最低成绩。处理这类数据的最好办法是将其定义成为一个具有共同特征的集合——这种<strong>同类型相关数据的集合称为数组</strong>。</p>',
  toc: [
    { id: 'sec-pd4-concept', text: '数组的概念', level: 2 },
    { id: 'sec-pd4-one', text: '4.1 一维数组', level: 2 },
    { id: 'sec-pd4-multi', text: '4.2 多维数组', level: 2 },
    { id: 'sec-pd4-char', text: '4.3 字符数组', level: 2 },
    { id: 'sec-pd4-algo', text: '专题一、数组的常用算法', level: 2 },
    { id: 'sec-pd4-str', text: '专题二、字符数组', level: 2 },
    { id: 'sec-pd4-matrix', text: '专题三、数组与矩阵', level: 2 },
    { id: 'sec-pd4-hw', text: '小组作业', level: 2 },
  ],
  sections: [
    {
      id: 'sec-pd4-concept',
      heading: '数组的概念',
      blocks: [
        {
          type: 'html',
          html: `
            <p>C 语言可以根据用户需要，用基本数据类型定义特殊性质的数据类型，称为<strong>构造类型</strong>。构造类型有：数组、结构、联合。</p>
            <p><strong>数组</strong>：相同数据类型变量的<strong>有序集合</strong>。有序表现在数组元素在内存中连续存放。数组用一个名字作为标识，为区分各元素，每个元素有一个用整型表示的序号，称之为<strong>下标</strong>。下标可以有多个，下标的个数称为数组的<strong>维数</strong>。如：十个整型变量 <code>k[0], k[1], … k[9]</code>——一个下标。</p>
            <p><em>课件图示：三个学生三门课程的成绩表——用二维下标索引，下标一为行（学号 0/1/2），下标二为列（课程 0/1/2），数组元素如 a[1][1]。</em></p>
            <p>数组必须<strong>先说明后使用</strong>。说明的目的如下：⒈说明数组的名字（标识）；⒉说明数组的类型；⒊说明数组的维数；⒋确定各维下标的变化范围。编译系统将根据说明，开辟内存单元，按特定的顺序和相应的类型为各元素分配内存单元。</p>`,
        },
      ],
    },
    {
      id: 'sec-pd4-one',
      heading: '4.1 一维数组',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>⒈一维数组的说明</strong>——说明方式：<code>type array1[常量表达式], …, arrayn[常量表达式];</code>。类型说明符根据需要可加修饰说明，说明数组的类型；数组名用标识符命名；用 [ ] 包含的常量表达式，数组的下标从 0 变化到常量表达式的值减一。如 <code>short id[5], iyear[10]; float fScore[36];</code></p>
            <p>当说明数组后，编译时系统会根据定义的类型分配连续的一段内存单元给数组的各元素。<em>课件图示：id[0]～id[4] 连续存放，每个单元占两个 BYTE，首地址用数组名 id 表示。</em></p>
            <p><strong>⒉一维数组的初始化</strong>——数组的元素可以在说明数组时初始化：</p>
            <pre class="code"><code>int a[10]={1,2,3,4,5,6,7,8,9,10};
/* 说明数组，同时初始化全部元素 */
float fValue[10]={1.0,2.0,3.0};
/* 说明数组，给部分元素初值，其余元素为 0 */
unsigned a[ ]={0x0000,0x0001,0x0002};
/* 当数组元素全部赋初值时，可以不指定长度 */</code></pre>
            <p><strong>⒊数组的引用</strong>——原则：<strong>只能引用数组元素，而不能引用整个数组</strong>。引用方式：<code>数组名[整型表达式]</code>（下标变量）。每个数组元素，可以出现在简单变量能够出现的任何地方。如 <code>a[1]=12; s=a[2]+a[1]*20;</code></p>
            <p><strong>⒋举例</strong>——求 10 个学生一门课程的平均分，并输出低于平均成绩的分数：</p>
            <pre class="code"><code>#include  &lt;stdio.h&gt;
void  main(void)
{     float fScore[10], aver = 0;
      int i;
      for (i = 0; i &lt; 10; i++)
      {      scanf("%f", &amp;fScore[i]);        /* 循环输入各元素的值并累加 */
             aver += fScore[i];
      }
      aver /= 10;
      for ( i = 0; i &lt; 10; i++)
      {      if (fScore[i] &lt; aver)           /* 循环判断条件，满足条件输出 */
             printf("num=%d,score=%f", i + 1, fScore[i]);
      }
}</code></pre>`,
        },
      ],
    },
    {
      id: 'sec-pd4-multi',
      heading: '4.2 多维数组',
      blocks: [
        {
          type: 'html',
          html: `
            <p>在处理的数据中经常会遇到需要用多维索引的数据。如：四个学生三门课的成绩，可以用下表表示：</p>
            <table class="tbl">
              <thead><tr><th>学生 \ 课程</th><th>课程 0</th><th>课程 1</th><th>课程 2</th></tr></thead>
              <tbody>
                <tr><td>学生 0</td><td>92.5</td><td>80.5</td><td>91.0</td></tr>
                <tr><td>学生 1</td><td>99.0</td><td>83.5</td><td>90.0</td></tr>
                <tr><td>学生 2</td><td>70.0</td><td>66.0</td><td>60.0</td></tr>
                <tr><td>学生 3</td><td>78.0</td><td>56.0</td><td>59.0</td></tr>
              </tbody>
            </table>
            <p>显然，该表的每一项需要有两个索引项，表现为数组的两个下标。<strong>超过一个下标的数组称为多维数组</strong>——行代表某个学生，列代表某门课程。</p>
            <p><strong>⒈多维数组的说明</strong>——说明方式：<code>type array[常量表达式1]…[常量表达式n], …;</code>（n 个整型常量表达式）。如 <code>int a[2][3], b[4][5][2];</code> 数组元素的个数？</p>
            <p><strong>⒉多维数组在内存中的顺序</strong>——以 <code>int a[3][3];</code> 为例，二维结构为 a[0][0]…a[2][2]，排列顺序：<strong>先行后列</strong>。总原则：<strong>最后一个下标先变化，变化一个周期后，倒数第二个开始变化，…如此类推</strong>。a 为数组在内存中的首地址。思考：<code>int b[2][3][4];</code> 内存中的排列？</p>
            <p><strong>⒊多维数组赋初值</strong>——数组可以在说明时初始化：</p>
            <ul>
              <li>⑴全部赋初值：<code>int a[2][3]={{1,2,3},{4,5,6}};</code>（下标为 0 的一行、下标为 1 的一行）；<code>int b[2][3]={1,2,3,4,5,6};</code> 按内存顺序赋初值。</li>
              <li>⑵部分赋初值：<code>int a[2][3]={ {1}, {2} };</code>——0 行的 0 列元素赋初值，0 行其余值为 0；<code>int a[2][3]={1,2};</code></li>
              <li>⑶对全体数组元素赋初值，第一维下标可以省略：<code>int a[ ][3]={1, 2, 3, 4, 5, 6};</code></li>
            </ul>
            <p><strong>⒋数组元素的引用</strong>——数组定义后，数组的元素具备简单变量的一切性质，可以作为表达式的运算对象，也可以被赋值。引用时只能引用数组元素，方式：<code>array[exp1]…[expn]</code>（整型表达式）。如 <code>int a[10][10], y, i=2; a[i+2][6]=20;</code>（对 4 行 6 列的元素赋值）；<code>y=a[i+2][6]*100/30;</code>（参加表达式运算）。而 <code>a[10][11]=34;</code>——<strong>C 语言不作下标检查，语法正确，但使用危险，可能造成程序的错误！</strong></p>
            <p><strong>⒌举例</strong>——定义 3×4 的浮点数数组，并赋初值，输出每一行的平均值：</p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
void main(void)
{      float a[3][4]= {1,3,5,7,9,2,4,6,8,10,12,11}, fAve = 0.0f;
       int i, j;
       for (i = 0; i &lt; 3; i++)
       {
             fAve = 0.0f;
             for (j = 0; j &lt; 4; j++)
             {        fAve += a[i][j];
             }
             printf("第%d行平均值：%7.2f\n", i, fAve / 4.0f);
       }
}</code></pre>`,
        },
      ],
    },
    {
      id: 'sec-pd4-char',
      heading: '4.3 字符数组',
      blocks: [
        {
          type: 'html',
          html: `
            <p>C 语言<strong>没有字符串变量</strong>，可以定义字符数组，每个元素存放一个字符，从而达到存放字符串的目的。</p>
            <p><strong>⒈字符数组的说明</strong>——<code>char charray[const exp1]…[const expn], …;</code> 如 <code>char a[10], b[2][12];</code></p>
            <p><strong>⒉字符数组的初始化</strong></p>
            <p>一维数组赋初值：<code>char str1[6] = {'h','e','l','l','o','\\0'};</code>（用单个字符对每一个元素赋值）；<code>char str2[ ] = {"hello"};</code>（用字符串对数组赋初值，可以指定长度，也可不指定长度）。系统会在字串的结尾加 \\0 表示字符串结束，因此说明数组时长度指定应至少比实际长度大 1，保证赋初值正确。<em>课件图示：str1 存储结构 h、e、l、l、o、\\0。</em></p>
            <p>二维数组赋初值——二维数组的每一行可以存放一个字符串：<code>char str[3][6]={"wang","zhang","liu"};</code> <em>课件图示：存储结构三行分别为 w a n g \\0 空、z h a n g \\0、l i u \\0 空 空。</em></p>
            <p><strong>⒊字符数组的输入输出</strong></p>
            <p>⑴格式输入输出函数：输出 <code>printf("%s", str);</code>（用字符串形式输出）；输入 <code>scanf("%s", str);</code>（用字符串输入整个数组）。用 scanf 函数输入时 space 作为输入的分隔符，因此输入带空格的字符串会造成输入不全：<code>char a[20]; scanf("%s",a);</code> 输入 Hefei Anhui China，结果 a 数组的内容是 Hefei\\0。为了解决这个问题，系统定义如下专用于字符数组的 i/o 函数：</p>
            <p>⑴ <code>gets( )</code> 字符串输入函数——用法：<code>char str[80]; gets(str);</code>（数组名作为函数的参数）。作用：读入一个以换行符为终结符的字符串到 str 中，用 \\0 代替换行符。</p>
            <p>⑵ <code>puts( )</code> 字符串输出函数——用法：<code>char string[ ]="China"; puts(string);</code>（数组名作为函数的参数）。作用：输出以 NULL 即 \\0 结尾的字符串 string，自动加上换行符。</p>
            <pre class="code"><code>/* 字符输入输出举例 */
#include &lt;stdio.h&gt;
void main(void)
{    char str[80];
     int i;
     gets(str);
     for(i=0; str[i]!='\0'; i++)         /* 判断字符串结束 */
            if(str[i]&gt;='a' &amp;&amp; str[i]&lt;='z')
                       str[i] -= 32;
     puts(str);
}                                       /* chp4ex0 */</code></pre>
            <p><strong>⒋常用的字符处理函数</strong>——C 语言定义了一系列的字符处理函数用于字符串的处理，该类函数的原型定义在 string.h 中。因此在使用该类函数时，应在程序的开始处加 <code>#include &lt;string.h&gt;</code></p>
            <p>⑴<strong>字符串拷贝函数 strcpy(str1, str2)</strong>——作用：将 str2 拷贝到 str1 中。</p>
            <pre class="code"><code>char   str1[10], str2[ ]={"Computer"};
strcpy(str1, str2);     /* str1 的内容是 "Computer" */
strcpy(str2, "Program"); /* str2 的内容是 "Program" */</code></pre>
            <p>说明：①str1 的长度要足够长；②str1 只能是字符数组名，str2 可以是字符数组或字符串常量。</p>
            <p>⑵<strong>字符串连接函数 strcat(str1, str2)</strong>——作用：将 str2 连接到 str1 后（去掉 str1 的 \\0）。</p>
            <pre class="code"><code>char   str1[15]={"Anhui "}, str2[ ]={"Hefei"};
strcat(str1, str2);
puts(str1);             /* 输出结果为 Anhui  Hefei */</code></pre>
            <p>说明：①str1 的长度要足够长；②str1 只能是字符数组名，str2 可以是字符数组或字符串常量。</p>
            <p>⑶<strong>测试字符串长度函数 strlen(str)</strong>——作用：测试字符串的实际长度，函数结果得到整型值，该值是字符串的长度。<code>int iLenStr; char str[ ]={"China"}; iLenStr=strlen(str); printf("%d",iLenStr);</code> 结果？</p>
            <p>⑷<strong>字符串的比较 strcmp(str1, str2)</strong>——作用：对 str1 和 str2 进行逐位无符号字符（ASCII 码）比较，直到对应位字符能够确定关系或到串尾为止，返回整型比较结果。字符的数值关系也就是字符的 ASCII 码值的数值关系：</p>
            <table class="tbl">
              <thead><tr><th>比较结果</th><th>strcmp 的值</th></tr></thead>
              <tbody>
                <tr><td>str1&lt;str2</td><td>&lt;0</td></tr>
                <tr><td>str1==str2</td><td>==0</td></tr>
                <tr><td>str1&gt;str2</td><td>&gt;0</td></tr>
              </tbody>
            </table>
            <p>如 <code>char str1[ ]={"abcd"}; char str2[ ]={"abcd"};</code> 则 <code>strcmp(str1,"abdc")</code>——'c'-'d' = -1，结果小于 0；<code>strcmp(str1,str2)</code>；<code>strcmp("abcde",str2)</code>。</p>
            <p>⑸ <code>strlwr(str)</code> 将 str 中的大写字母转换成小写字母；⑹ <code>strupr(str)</code> 将 str 中的小写字母转换成大写字母：</p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
void main(void)
{     char  str1[ ] = "c programming!  123", str2[] = "Computer";
      strlwr(str2);
      strupr(str1);
      puts(str1);        /* C PROGRAMMING! 123 */
      puts(str2);        /* computer */
}</code></pre>
            <p>举例：将字符串 str2 连接到 str1 之后，并将连接后的 str1 中的小写字母转换为大写字母输出，并输出连接后字符串的长度（chp4ex2）：</p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
void main(void)
{    char str1[80], str2[80];
     int iStrLen;
     gets(str1);
     gets(str2);
     strcat(str1, str2);
     strupr(str1);
     iStrLen = strlen(str1);
     puts(str1);
     printf("连接后的字符串长度 = %d\n", iStrLen);
}</code></pre>`,
        },
      ],
    },
    {
      id: 'sec-pd4-algo',
      heading: '专题一、数组的常用算法',
      blocks: [
        {
          type: 'html',
          html: `
            <p>数组是同类型数据的集合，便于整体处理数据。数组操作的主要算法有：⒈求极值；⒉排序；⒊查找。</p>
            <p><strong>⒈求极值及其位置</strong></p>
            <p>⑴一维数组的极值（chp4ex3）：</p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
void  main(void)
{     int  a[10]={1,6,-2,5,4,32,47,-66,13,14};
      int iMax, iPos, i;
      iPos = 0;                     /* 假定最大值及其位置 */
      iMax = a[0];
      for(i=1; i&lt;10; i++)           /* 循环比较 */
          if(a[i]&gt;iMax)
          {                         /* 当前元素比最大值大：更新并记录位置 */
              iMax = a[i];
              iPos = i;
          }
      printf("Max=%5d  Position=%5d", iMax, iPos);
}</code></pre>
            <p>⑵二维数组求极值（chp4ex4）：</p>
            <pre class="code"><code>#include  &lt;stdio.h&gt;
void   main(void)
{     float  a[3][4]={ 1.0, 3.0, 5.2, 7.4, 4.6, 5.5, 4.2, 1.2,
                             10.5, 0.23, 1.3, 0.5};
      int i, j, iRow=0, iCol=0;      /* 假定最小值的位置 */
      for(i=0; i&lt;3; i++)
          for(j=0; j&lt;4; j++)         /* 二重循环遍历所有元素 */
              if(a[i][j]&lt;a[iRow][iCol])
              {                      /* 比较求最小值，记录其位置 */
                  iRow = i;
                  iCol = j;
              }
      printf("%7.2f, iRow%5d, iCol%5d", a[iRow][iCol], iRow, iCol);
}</code></pre>
            <p><strong>⒉排序</strong></p>
            <p>⑴排序的概念——排序是将一组随机排放的数按下标顺序从大到小（降序）或从小到大（升序）重新排列。如 1，5，4，6，7，9 → 降序 9，7，6，5，4，1 / 升序 1，4，5，6，7，9。</p>
            <p>⑵<strong>冒泡排序算法</strong>（算法演示见课件）——程序如下（chp4ex5）：</p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
void main(void)
{     int i, j, a[10]={4,3,5,1,10,12,2,6,7,9}, iTemp;
      for(i=0; i&lt;9; i++)                 /* 外层循环 i 变化 */
          for( j=i+1; j&lt;10; j++)         /* 内层循环 j 变化 */
              if(a[i]&gt;a[j])              /* 升序比较交换 */
              {      iTemp=a[i];
                     a[i]=a[j];
                     a[j]=iTemp;
              }
      for(i=0; i&lt;10; i++)
            printf("%4d", a[i]);
}</code></pre>
            <p><strong>思考题</strong>：⒈降序的条件如何构造？⒉联合排序问题——已知一个班有 36 个同学，a 数组存放一门课的成绩，m 数组存放其学号，要求将成绩从大到小排序。提示：应考虑的问题是当 a 数组元素比较交换时，m 数组如何处理？（如 a[5]=89.5 对应 m[5]=1005，a[7]=90.0 对应 m[7]=1007——m 为被动排序方。）</p>
            <p>⑶<strong>选择排序</strong>——冒泡排序在内层循环的比较中，满足条件的每次都需要交换，其中一些交换是无效的，交换算法会占用系统时间，从而降低算法效率。选择排序算法的基本思路：每轮排序将 a[i] 假定为极值，每次在 a[i] 到 a[MAX] 中找出一个极值，记录其位置，最后让极值位置的元素与 a[i] 交换。<strong>选择排序保证每轮排序只有一次交换，且为有效的交换！</strong></p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
void main(void)
{     int i, j, iPos, a[10]={4,3,5,1,10,12,2,6,7,9}, iTemp;
      for(i=0; i&lt;9; i++)                 /* 排序循环 */
      {      iPos=i;                     /* 假定最大值位置 */
             for( j=i+1; j&lt;10; j++)      /* 循环比较找出最大值的位置 */
                  if(a[iPos]&lt;a[j]) iPos=j;
             if ( iPos != i )            /* 与本次比较的第一个元素交换 */
              { iTemp=a[i]; a[i]=a[iPos]; a[iPos]=iTemp;}
       }
      for(i=0; i&lt;10; i++)
          printf("%4d", a[i]);
}                                      /* 升序如何构造？ chp4ex6 */</code></pre>
            <p><strong>算法的效率</strong>——无论是选择排序还是冒泡排序，其循环次数相同：外层循环 i 从 0 到 MAX-1，内层循环 j 从 i+1 到 MAX，总次数 r = 1+2+…+n-1 ≈ n*n/2（n 为数组元素个数）。问题：400 个元素求前十名，如何高效率地排序？方法一：对 400 个元素排完序后取前 10 个，次数为 80000 次；方法二：选择 10 个最大值，次数为 4000 次。假如一次循环需要 1ms，方法一需要 80s，方法二需要 4s。如何构造 400 取前十名的算法？</p>
            <p><strong>⒊查找</strong>——查找是在一组数中寻找一个特定的数，并显示结果。</p>
            <p>⑴<strong>顺序查找</strong>——算法：构造循环，使循环变量遍历数组每个元素的下标。循环的过程中让特定的数和每个元素比较，相等则表示找到该数，并输出其下标（位置）。</p>
            <p>程序设计中标志的设置和应用：在程序设计中经常要记录一些状态作为判断的条件，因此需要在程序中设置一些标志，通常标志是整型变量。如查找问题，可以先设置一个整型变量 iFlag=0 表示没有找到，在查找的过程中一旦找到后将 iFlag 赋值为 1，结束查找后可以由 iFlag 值所代表的逻辑状态确定是否已找到特定的数。<em>课件图示：标志设置框图——iFlag=0 → 循环比较 → 是否找到? → yes: iFlag=1。</em></p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
void main(void)
{     int i, iSel, iFlag, a[10]={4,3,5,1,10,12,2,6,7,9};
      iFlag = 0;                       /* 设置标志为没找到 */
      scanf("%d", &amp;iSel);
      for(i=0; i&lt;10; i++)              /* 循环遍历所有元素 */
          if(iSel==a[i])
          {                            /* 比较设置标志输出位置 */
              iFlag = 1;
              printf("The position is %d\n", i);
          }
      if (iFlag == 1)
           printf("Found! %d", iSel);
      else
           printf("Not found!");
}                                     /* chp4ex7 */</code></pre>
            <p>⑵<strong>折半查找——适用于在有序数组中查找</strong>：在一个有序的一维数组中查找某一个数。已知某数组按升序排列，给定一个数，找出该数在数组中的位置。可以通过将区间折半，快速缩小查找区间，提高效率！（折半查找算法演示见课件）</p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
void main(void)
{     int iTop, iBot, iMid, iSel, iFlag, a[10]={1,2,3,5,6,8,9,10,11,12};
      iFlag = 0;
      iTop = 0;                        /* 初始化查找标志及顶、底 */
      iBot = 9;
      scanf("%d", &amp;iSel);
      do{                              /* 查找循环 */
            iMid = (iTop+iBot)/2;      /* 折半 */
            if(iSel==a[iMid])
            {                          /* 找到 */
                  iFlag = 1;
                  printf("iS has be found : a[%d]", iMid);
            }
            else if(iSel&lt;a[iMid])
                  iBot = iMid - 1;     /* 没找到，调整 iTop 或 iBot */
            else
                  iTop = iMid + 1;
       }while(iTop&lt;=iBot &amp;&amp; iFlag==0);
       if(iFlag==0)
             printf("Not found!\n");
}                                     /* chp4ex8 */</code></pre>`,
        },
      ],
    },
    {
      id: 'sec-pd4-str',
      heading: '专题二、字符数组',
      blocks: [
        {
          type: 'html',
          html: `
            <p>⑴<strong>统计字符串中的各元音字母的个数</strong>（chp4ex9）：</p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
void main(void)
{     char  str[80], ch[6]={'a','e','i','o','u','\0'};
      int i, iCount[5]={0,0,0,0,0};
      gets(str);
      for(i=0; str[i]!='\0'; i++)        /* 循环遍历数组元素 */
      {                                  /* 判断字母 */
                switch(str[i])
                {                        /* 判断字符串结束也可用 i&lt;strlen(str) */
                      case 'a': case 'A':   iCount[0]++; break;
                      case 'e': case 'E':   iCount[1]++; break;
                      case 'i': case 'I':   iCount[2]++; break;
                      case 'o': case 'O':   iCount[3]++; break;
                      case 'u': case 'U':   iCount[4]++;
                }
      }
      for(i=0; i&lt;5; i++)
            printf("Num of  %c :%5d", ch[i], iCount[i]);
}</code></pre>
            <p>⑵<strong>字符的加密解密</strong>——将字符串中的字母加密，密钥为循环平移两个字母。如 A 加密成 C…，Z 加密成 B。如：I am a student. Zip 230009 → 加密后：K co c uvwfgpw. Bkr 230009。加密算法可以描述为：如果 str[i] 是字母，循环平移两个字符。以大写字母为例，循环平移两个字符的加密算法：<code>str[i]=(str[i]-'A'+2)%26+'A'</code></p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
void main(void)
{      int i;
       char str[80], chKey=2;           /* 密钥 */
       gets(str);                       /* 输入待加密的字符串 */
       for(i=0; i&lt;strlen(str); i++)     /* 循环遍历字符串 */
       {
           if(str[i]&gt;='a' &amp;&amp; str[i]&lt;='z')
                   str[i]=(str[i]-'a'+chKey)%26+'a';
    else if(str[i]&gt;='A' &amp;&amp; str[i]&lt;='Z')
        str[i]=(str[i]-'A'+chKey)%26+'A';
       }                                /* 是字母，则加密！ */
       puts(str);
}                                       /* 设计解密算法！ chp4exa */</code></pre>`,
        },
      ],
    },
    {
      id: 'sec-pd4-matrix',
      heading: '专题三、数组与矩阵',
      blocks: [
        {
          type: 'html',
          html: `
            <p><code>int a[3][3]</code>（a[0][0]～a[2][2]）这种表示方法在数学上称为「<strong>矩阵</strong>」，当行、列数相同时称为「<strong>方阵</strong>」，也称为「行列式」。</p>
            <p><strong>⒈生成特殊矩阵</strong></p>
            <p>⑴<strong>生成单位方阵</strong>——主对角线元素为 1，其余为 0：if(i==j) a[i][j]=1，其余为 0。</p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
void main(void)
{    int a[4][4], i, j;
     for(i=0; i&lt;4; i++)
         for(j=0; j&lt;4; j++)
         {
              if(i==j) a[i][j]=1;
              else     a[i][j]=0;
           }
     for(i=0; i&lt;4; i++)
     {      for(j=0; j&lt;4; j++)
               printf("%4d", a[i][j]);
            printf("\n");
      }
}                                      /* chp4exb */</code></pre>
            <p>⑵<strong>生成三角阵</strong>——三角阵的概念：以对角线为界，一半元素为 0 的方阵。当 i&lt;=j 时值非 0 为上三角阵；当 i&gt;=j 值非 0 为下三角阵。思考：如何生成元素为行、列下标和的下三角阵？</p>
            <p>⑶<strong>与下标相关矩阵</strong>——形成如下矩阵：</p>
            <div class="formula">1 4 7；2 5 8；3 6 9（a[i][j] = i×1 + j×3 + 1）</div>
            <p>在列方向上每跨一列要走三步；在行方向上每跨一行要走一步。只能横向或纵向行走且不走远路，确定从一行一列走到任意行列所走的步数——显然所走的步数和当前行列的位置有关（s = i×1 + j×3）。</p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
void main(void)
{     int a[3][3], i, j;
      for(i=0; i&lt;3; i++)
          for(j=0; j&lt;3; j++)
              a[i][j] = i + j*3 + 1;
      for(i=0; i&lt;3; i++)
      {      for(j=0; j&lt;3; j++)
                printf("%4d", a[i][j]);
          printf("\n");
      }
}                    /* 生成矩阵 1 5 9 13 / 5 9 13 17 / 9 13 17 21？ chp4exc */</code></pre>
            <p><strong>⒉矩阵及元素求和</strong></p>
            <p>⑴求方阵主、辅对角线之和——主对角线：满足下标为 [i][i] 的元素和；辅对角线：满足下标为 [i][jMAX-i] 的所有元素之和。如何构造程序？</p>
            <p>⑵求两个矩阵之和——<code>c[i][j]=a[i][j]+b[i][j]</code>，对应元素之和，要求 a、b 行列数相同（chp4exd）：</p>
            <pre class="code"><code>#include &lt;stdio.h&gt;
void main(void)
{     int  a[2][3]={1,2,3,4,5,6};
      int  b[2][3]={1,3,5,2,4,6}, c[2][3], i, j;
      for(i=0; i&lt;2; i++)
          for(j=0; j&lt;3; j++)
              c[i][j] = a[i][j] + b[i][j];   /* 对应元素和 */
      for(i=0; i&lt;2; i++)
      {      for(j=0; j&lt;3; j++)
                printf("%4d", c[i][j]);
         printf("\n");
     }
}</code></pre>
            <p><strong>⒊矩阵的转置运算</strong>——转置阵的概念：矩阵 a（1 2 3 / 4 5 6）的转置阵 b（1 4 / 2 5 / 3 6），a、b 互为转置阵。b 矩阵行、列的最大下标应和矩阵 a 列、行的最大下标相同。遍历所有下标赋值：<code>b[i][j]=a[j][i]</code></p>
            <p>⑴求非方阵的转置阵；⑵求方阵的转置阵——如果求方阵的转置阵，行、列相同，不需要定义新的数组。算法：<strong>对角线两边的对称元素交换</strong>：</p>
            <pre class="code"><code>/* 三阶方阵转置 */
#include &lt;stdio.h&gt;
void  main(void)
{     int a[3][3] = {1,2,3,4,5,6,7,8,9}, i, j, iTemp;
      for (i = 0; i &lt; 3; i++)
      {        for(j = 0; j &lt; i; j++)     /* Why? */
              {       iTemp = a[i][j];
                    a[i][j] = a[j][i];
                    a[j][i] = iTemp;
              }
      }
      for (i = 0; i &lt; 3; i++)
      {        for (j = 0; j &lt; 3; j++)
              {        printf("%4d", a[i][j]);
              }
              printf("\n");
      }
}</code></pre>`,
        },
      ],
    },
    {
      id: 'sec-pd4-hw',
      heading: '小组作业',
      blocks: [
        {
          type: 'html',
          html: `
            <p>⒈狐狸捉兔子问题——<em>课件图示：围绕编号 0～9 的十个洞（围成圆圈）的追踪问题</em>。</p>
            <p>⒉已知一个班有 36（测试用 5 个）个学生。用 n 数组存放学号，a 数组存放物理成绩，b 数组存放数学成绩。要求计算：①数学及物理课程的平均成绩；②输出两门课程都低于平均成绩的同学的学号和成绩；③对数学成绩从高到低排序。</p>
            <p>⒊打印「杨辉」三角形（七阶）：1；1 1；1 2 1；1 3 3 1；1 4 6 4 1；1 5 10 10 5 1；1 6 15 20 15 6 1。</p>
            <p>⒋求 1，3，6，4，8，9，10 的逆序排列——逆序：10，9，8，4，6，3，1。</p>
            <p>⒌输入一串字符，将其中的奇数下标位置的小写字母替换成对应的大写字母，其余不变，并输出结果。</p>
            <p>⒍统计一行（&lt;80）英文文字中特定字符的数量，字符串和特定字符从键盘输入。如统计 This is a testing program! 中 s 的数量。</p>
            <p>⒎定义一个十个元素组成的整型数组，从键盘输入各个元素。让数组的最大值和第一个元素交换，最小值和最后一个元素交换。</p>
            <p>⒏编写程序生成 4×4 的上三角阵，要求各元素的值为其行号与列号的和。以数学表示方式输出结果。</p>
            <p>⒐统计一个字符串中的单词数，单词以空格、逗号、句号、分号分隔。（较难）</p>
            <p>⒑编写程序求方阵主对角线上的最大值及其位置，输入 a[3][3] 输出结果。</p>
            <p>⒒编写两个程序：⑴实现通过凯撒密码加密，密钥通过键盘输入；⑵实现上一程序的解密。</p>
            <p>⒓输入一个二十人班级的一门课程的成绩，输入一个分数查找是否有该成绩，如果有则输出序号，没有打印提示！</p>
            <p>⒔判断一个字符串是否为回文，如果是输出 "Yes"，不是输出 "No"。如 ABCDCBA、ABCCBA 是回文。</p>
            <p>⒕输入 4×4 的矩阵，求该矩阵周边元素之和，输出结果。</p>
            <p>⒖输入 5×4 的数组 a，计算每行数据元素的最大值存入一维数组 b[5] 中，输出结果。</p>
            <p>⒗输入 5×4 的数组 a，计算每列数据元素的平均值存入一维数组 b[4] 中，输出结果。</p>
            <p>⒘将如下定义的表示十六进制的字符串转化为对应的十进制整型输出。字符串定义如下：<code>char szStr[ ] = "1a2b";</code></p>
            <p>⒙输入一个四阶方阵，求原矩阵与其转置之和，输出结果。</p>
            <p>19. 输入一个 8 位正整数，输出其对应的逆序数。如输入 13523458 输出：85432531。</p>
            <p>20. 输入一个无符号短整型，输出其对应的二进制。</p>
            <p>21. 输入一串字符统计其中大写字母、小写字母、数字的个数，输出结果。</p>
            <p>22. 输入两个 3 阶方阵，计算两个方阵之积，以数学表示方式输出。</p>
            <p>23. 编程输出 1000（测试用 20）个数组元素的前 10 个最大的数。</p>
            <p>24. 输入两个二维矩阵（阶数自定），求其乘积并输出。</p>
            <p>25. 输入一 0、1 组成的二进制字符串（不超过 32 位），将其转换为无符号整型，并输出 10 进制的值。</p>
            <p>26. 输入 10 个英文的国名，按升序排序输出。</p>
            <p>27. 用随机函数（自查功能和用法）生成 20 个数存放到数组中并按降序排序，从键盘输入一个数，完成在数组中的二分查找。</p>
            <p>28. 定义一个 20 个元素的数组，给出 19 个数，排序。输入一个数将其插入到数组中，插入后数组依然有序。</p>
            <p>29. 输入一个字符串，将其倒序存放到原数组后输出。</p>
            <p>30. 定义 20 个元素的整型数组并赋初值。输入一个数，如果该数在数组中存在，则删除该数，其后的每个数前移一位，最后补 0。</p>
            <p>31. 统计一个字符串中每个数字（'0'~'9'）字符的个数。</p>
            <p>32. 在一个字符串中查找第一个子串，并输出第一个子串的下标。如：This is a test message! 为字符串，子串为 is，则输出为 2。（不能用系统的字符串函数实现！）</p>`,
        },
      ],
    },
  ],
};

export default ch4;
