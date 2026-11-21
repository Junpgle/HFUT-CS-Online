/* 第十一章 C++语言基础 —— 逐节转录自 课件/PPT/第十一章 C++语言基础.ppt（19 页）；
   操纵符表按课件原表转录。 */
import type { PdChapter } from './types';

const ch11: PdChapter = {
  id: 'ch11',
  no: '第11章',
  title: 'C++语言基础',
  subtitle: '从面向过程到面向对象 · C++的新特性 · 输入输出流 · 内置类 string',
  lede:
    '<p>第十一章 C++基础。C++是 C 语言的继承，它既可以进行 C 语言的过程化程序设计，又可以进行以抽象数据类型为特点的基于对象的程序设计，还可以进行以继承和多态为特点的面向对象的程序设计。</p>',
  toc: [
    { id: 'sec-pd11-concept', text: '11.1 C++的概念', level: 2 },
    { id: 'sec-pd11-new', text: '11.2 C++语言的新特性', level: 2 },
    { id: 'sec-pd11-string', text: '11.3 C++的内置类 string', level: 2 },
  ],
  sections: [
    {
      id: 'sec-pd11-concept',
      heading: '11.1 C++的概念',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>⒈从面向过程到面向对象</strong>——面向过程（Procedure Oriented）是以过程为中心的程序设计方式，其核心要素如下：过程化的处理方式——函数；数据与处理分离。</p>
            <p><strong>⒉面向对象（Object Oriented）</strong>——面向对象是对现实世界的理解和抽象的方法。面向对象的程序设计方式：对象指的是类的实例，它将对象作为程序的基本单元，将程序和数据封装其中，以提高软件的重用性、灵活性和扩展性。</p>
            <p><strong>⒊面向对象的特点</strong>：信息隐蔽、封装、继承和多态。面向对象的关键要素：对象、属性、方法。</p>
            <p><strong>⒋C++的历史</strong>——1979 年，Bjame Sgoustrup 到了 Bell 实验室，开始从事将 C 改良为带类的 C（C with classes）的工作。1983 年该语言被正式命名为 C++。</p>`,
        },
      ],
    },
    {
      id: 'sec-pd11-new',
      heading: '11.2 C++语言的新特性',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>⒈数据类型及定义形式的扩展</strong></p>
            <p>⑴<strong>常量定义</strong>：<code>const int SIZE 20;</code>、<code>int a[SIZE];</code>、<code>const double PI = 3.1415926;</code> 说明：定义的常量在内存中分配单元，可以通过指针访问，但不能改变！</p>
            <p>⑵<strong>新数据类型</strong>：bool 类型——常量 真：true、假：false；<code>bool bFlag = false;</code></p>
            <p>⑶<strong>新构造类型说明变量的形式</strong>：说明结构类型时可以省略 struct 关键字：</p>
            <pre class="code"><code>struct  Student
{          long  num ;
      char  name[20] ;
      int     age ;
      float  score[4] ;
}  ;
Student  wang, zhang, *stP, stu[5];</code></pre>
            <p>⑷<strong>变量可以随时定义</strong>：</p>
            <pre class="code"><code>for(int  i = 0; i &lt; 10 ; i++)
{           …;
}</code></pre>
            <p>⑸<strong>变量的引用</strong>——C++提供变量的引用，引用是给已经定义的变量起个别名。引用必须在定义时初始化：</p>
            <pre class="code"><code>int   x；
int   &amp;rx = x;</code></pre>
            <p>⑹<strong>新型强制类型转换</strong>：</p>
            <ul>
              <li>① <code>static_cast&lt;type&gt;(expression)</code> 数据类型转换。作用：将 expression 的值转化为 type 类型。<code>int a; a = static_cast&lt;int&gt;(5.0/2.0);</code></li>
              <li>② <code>const_cast&lt;type *&gt;(const *p)</code>。作用：将常量指针转换为数据指针。<code>const double PI = 3.1415926; double *dpP; dpP = const_cast&lt;double *&gt;(&amp;PI);</code></li>
            </ul>
            <p><strong>⒉输入输出</strong>——C++提供了全新的输入输出方式。把输入抽象成从输入设备输入的一串字节流；输出则是一串向输出设备输出的字节流。其头文件为 iostream，需要包含文件 <code>#include &lt;iostream&gt;</code>：cin 标准输入设备，&gt;&gt; 表示输入；cout 标准输出设备，&lt;&lt; 表示输出。</p>
            <p>例：输入矩形的两边，求面积：</p>
            <pre class="code"><code>#include &lt;IOSTREAM&gt;
#include &lt;IOMANIP&gt;
using namespace std;
int main()
{        float fAVal, fBVal, fArea;
    cout &lt;&lt; "输入矩形的两个边（空格分隔）：";
    cin &gt;&gt; fAVal &gt;&gt; fBVal;
    fArea = fAVal * fBVal;
    cout &lt;&lt; setprecision(7) &lt;&lt; "边长为" &lt;&lt; fAVal &lt;&lt; "和" &lt;&lt; fBVal;
    cout &lt;&lt; "的矩形面积：" &lt;&lt; fArea &lt;&lt; '\n';
    return 0;
}</code></pre>
            <p><strong>输出格式控制</strong>：</p>
            <table class="tbl">
              <thead><tr><th>操纵符</th><th>功能</th><th>操纵符</th><th>功能</th></tr></thead>
              <tbody>
                <tr><td>dec</td><td>十进制</td><td>showpoint</td><td>显示小数点及尾随 0</td></tr>
                <tr><td>endl</td><td>换行并刷新输出流</td><td>noshowpoint</td><td>不显示小数点及尾随 0</td></tr>
                <tr><td>fixed</td><td>定点数</td><td>showpos</td><td>显示 +</td></tr>
                <tr><td>flush</td><td>刷新输出流</td><td>noshowpos</td><td>不显示 +</td></tr>
                <tr><td>hex</td><td>十六进制</td><td>skipws</td><td>忽略输入前导空格</td></tr>
                <tr><td>left</td><td>左对齐</td><td>noskipws</td><td>不忽略输入前导空格</td></tr>
                <tr><td>oct</td><td>八进制</td><td>ws</td><td>删除空格</td></tr>
                <tr><td>right</td><td>右对齐</td><td>—</td><td>—</td></tr>
                <tr><td>scientific</td><td>科学计数法</td><td>—</td><td>—</td></tr>
                <tr><td>setfill(c)</td><td>填充字符 c</td><td>setprecision(n)</td><td>设置浮点数精度 n 位</td></tr>
                <tr><td>setw(n)</td><td>设置宽度 n</td><td>—</td><td>—</td></tr>
              </tbody>
            </table>
            <p>不带参数的操纵符定义在 iostream；带参数的操纵符定义在 iomanip。setw() 一次作用，其余始终作用。</p>
            <p><strong>⒊函数</strong>——C++的函数提供新的定义及引用的方式，包括引用作为参数、返回引用、内联函数及函数的重载。</p>
            <p>⑴<strong>引用作为函数参数</strong>：</p>
            <pre class="code"><code>#include &lt;IOSTREAM&gt;
#include &lt;IOMANIP&gt;
using namespace std;

void swap(int &amp;, int &amp;);
int main(void){
        int a, b;
        cout &lt;&lt; "输入两个整数：";
        cin &gt;&gt; a &gt;&gt; b;
        swap(a, b);
        cout &lt;&lt; "交换后的值" &lt;&lt; setw(6) &lt;&lt; a;
        cout &lt;&lt; setw(6) &lt;&lt; b &lt;&lt; endl;
        return 0;
}                                      /* CHAP11EX3 */</code></pre>
            <p>⑵<strong>内联函数</strong>——C++的内联函数主要是避免函数在调用时的开销，同时解决宏定义时没有类型检查及字符替换易出错等问题。<strong>内联函数只适合 1~5 句的小函数，且不能用循环及 switch 结构，否则将被编译成普通函数</strong>：</p>
            <pre class="code"><code>#include &lt;IOSTREAM&gt;
using namespace std;
inline int iMax(int, int);
int main(void){
        int a, b, c;
        cout &lt;&lt; "输入两个整数：";
        cin &gt;&gt; a &gt;&gt; b;
        c = iMax(a, b);
        cout &lt;&lt; a &lt;&lt; "和" &lt;&lt; b;
        cout &lt;&lt; "的较大值是：" &lt;&lt; c &lt;&lt; endl;
        return 0;
}
inline int iMax(int iVal1, int iVal2){
        return iVal1 &gt; iVal2 ? iVal1 : iVal2;
}                                      /* CHAP11EX4 */</code></pre>
            <p>⑶<strong>函数的重载</strong>——C++函数重载是一种同名函数通过不同参数（类型、顺序、个数）实现相同名字不同调用的机制。如 GetArea 函数计算面积：圆面积只需一个参数、矩形面积需要两个参数、三角形面积需要三个参数。</p>
            <pre class="code"><code>…
float GetArea(float);
float GetArea(float, float);
int main(void){
        float fR, fA, fB;
        float fAreaCir, fAreaRec;
        cout &lt;&lt; "输入圆半径：";
        cin &gt;&gt; fR;
        fAreaCir = GetArea(fR);
        cout &lt;&lt; "圆面积为：" &lt;&lt; setprecision(7) &lt;&lt; fAreaCir &lt;&lt; endl;
        cout &lt;&lt; "输入矩形的两边：";
        cin &gt;&gt; fA &gt;&gt; fB;
        fAreaRec = GetArea(fA, fB);
        cout &lt;&lt; "矩形面积为：" &lt;&lt; fAreaRec &lt;&lt; endl;
        return 0;
}                                      /* CHAP11EX5 */</code></pre>
            <p>⑷<strong>函数的默认参数</strong>——C++允许函数原型声明时给函数的形参赋初值。调用时则可以省略实参，省略的实参则采用形参的初值，称为默认参数。<strong>默认初值必须从右向左赋初值，调用时也只能从右向左省略</strong>。</p>
            <p><strong>⒋动态内存分配</strong>——C++函数提供了 new 运算符用于动态内存分配，delete 用于释放分配的内存。</p>
            <p>使用方式——简单变量：</p>
            <pre class="code"><code>int   *ipPVal;
ipPVal = new int(5);
if (ipPVal == NULL){
         return 1;
}
…
delete  ipPVal;</code></pre>
            <p>一维数组：</p>
            <pre class="code"><code>int   iSize;
cin &gt;&gt; iSize;
int  *ipArray = new int[iSize];
if (ipArray == NULL){
         return 1;
}
…
delete [ ] ipArray;</code></pre>
            <p>动态分配实例：求最大值及其位置（CHAP11EX6）。二维数组——C++求任意阶方阵的转置（CHAP11EX7）：</p>
            <pre class="code"><code>#include &lt;IOSTREAM&gt;
#include &lt;IOMANIP&gt;
using namespace std;

int main(void){
             int **ipDArry;
        int i, j, iSize;
        cin &gt;&gt; iSize;
        ipDArry = new int *[iSize];
        for (i = 0; i &lt; iSize; i++){
                ipDArry[i] = new int[iSize];
        }
        …
        for (i = 0; i &lt; iSize; i++){
                delete [ ] ipDArry [i];
        }
        delete [] ipDArry;
        return 0;
}</code></pre>`,
        },
      ],
    },
    {
      id: 'sec-pd11-string',
      heading: '11.3 C++的内置类 string',
      blocks: [
        {
          type: 'html',
          html: `
            <p>C++提供了 string 类替代以 null 结束的字符串。string 将数据及其方法封装其中，string 定义在 string 文件中。</p>
            <p><strong>⒈定义变量</strong>：</p>
            <pre class="code"><code>string  s1;
string  s2 = "Hefei";
string  s3 = s2;
string  s4(10, 'x');</code></pre>
            <p><strong>⒉长度属性</strong>：</p>
            <pre class="code"><code>string  s = "Hefei";
cout  &lt;&lt; s.length( );</code></pre>
            <p><strong>⒊赋值</strong>：</p>
            <pre class="code"><code>string  s1, s2;
s1 = "HFUT";
s2 = s1;</code></pre>
            <p><strong>⒋字符连接</strong>：</p>
            <pre class="code"><code>string  s1 = "Anhui  ";
string  s2 = "Hefei";
s1 += s2;
cout &lt;&lt; s1;</code></pre>
            <p><strong>⒌字符交换</strong>：</p>
            <pre class="code"><code>string  s1 = "wang";
string  s2 = "zhang";
s1.swap( s2 );
cout &lt;&lt; s1 &lt;&lt; s2;</code></pre>
            <p><strong>⒍字符对象比较</strong>：</p>
            <pre class="code"><code>string  s1 = "wang";
string  s2 = "zhang";
s1   &gt; s2;</code></pre>
            <p><strong>⒎字符串修改</strong>：</p>
            <pre class="code"><code>string  s1 = "Anhui  ";
s1.erase(index, len);
cout &lt;&lt; s1;</code></pre>
            <p><strong>⒏提取子串</strong>：</p>
            <pre class="code"><code>string  s1 = "Anhui Hefei";
string  s2;
s2 = s1.substr(6, 5);
cout &lt;&lt; s1 &lt;&lt; s2;</code></pre>
            <p><strong>⒐查找</strong>：</p>
            <pre class="code"><code>string  s1 = "This is test substr!";
s1.find(s2, ind)</code></pre>`,
        },
      ],
    },
  ],
};

export default ch11;
