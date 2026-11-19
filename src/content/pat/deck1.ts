import type { DeckData } from '../types';

/** 第一讲 · STL 简介 —— 依据《第一讲STL简介》课件（46 页）与《ICPC 培训讲义》第一章整理 */
const deck: DeckData = {
  id: 'deck1',
  no: '第 1 讲',
  title: '第一讲 · STL 简介',
  subtitle: '第一讲 · STL 简介',
  lede: `
    <p>开篇问题：输入任意个整数，排序然后输出。有了 STL，不必再从头写大多数的标准数据结构和算法，并且可获得非常高的性能。</p>
  `,
  toc: [
    { id: 'sec-intro', text: '1.1 引言', level: 2 },
    { id: 'sec-intro-h1', text: 'STL 与泛型程序设计', level: 3 },
    { id: 'sec-intro-h2', text: '模板的概念与工作方式', level: 3 },
    { id: 'sec-intro-h3', text: '模板的优缺点', level: 3 },
    { id: 'sec-comp', text: '1.2 STL 的组成结构', level: 2 },
    { id: 'sec-comp-h1', text: '什么是 STL', level: 3 },
    { id: 'sec-comp-h2', text: '五大组件', level: 3 },
    { id: 'sec-comp-h3', text: '容器概述：三大类', level: 3 },
    { id: 'sec-comp-h4', text: '容器的共有成员函数', level: 3 },
    { id: 'sec-comp-h5', text: '指针的抽象：从 find 到迭代器', level: 3 },
    { id: 'sec-comp-h6', text: '迭代器', level: 3 },
    { id: 'sec-comp-h7', text: '算法', level: 3 },
    { id: 'sec-app', text: '1.3 STL 的应用', level: 2 },
    { id: 'sec-app-h1', text: '头文件与编译环境', level: 3 },
    { id: 'sec-app-h2', text: 'pair 与 utility', level: 3 },
    { id: 'sec-app-h3', text: '顺序容器实战：vector / list / deque / stack', level: 3 },
    { id: 'sec-app-h4', text: '关联容器实战：map', level: 3 },
    { id: 'sec-app-h5', text: '常用算法：sort / find / qsort', level: 3 },
    { id: 'sec-app-h6', text: '字符串 string', level: 3 },
    { id: 'sec-app-h7', text: '迭代器接口与流迭代器', level: 3 },
    { id: 'sec-app-h8', text: '应用题：字符串反序输出', level: 3 },
  ],
  sections: [
    {
      id: 'sec-intro',
      heading: '1.1 引言',
      blocks: [
        {
          type: 'html',
          html: `
            <h3 id="sec-intro-h1">STL 与泛型程序设计</h3>
            <p>C++ 语言的核心优势之一就是便于软件的重用。C++ 中有两个方面体现重用：</p>
            <ul>
              <li><strong>面向对象</strong>的思想：继承和多态，标准类库；</li>
              <li><strong>泛型程序设计</strong>（generic programming）的思想：模板机制，以及标准模板库 STL。</li>
            </ul>
            <p>标准模板库（Standard Template Library）是 ANSI/ISO C++ 语言的库的一个主要组成部分。它包括了通用数据结构和基于这些结构的算法，向外提供统一标准的公共接口，使得使用 STL 方便、快捷地建立应用程序。</p>
            <p>讲义补充：STL 最初是由惠普实验室（Hewlett-Packard Labs）的 Alexander Stepanov 和 Meng Lee 开发的，是他们在一般化编程领域研究成果的结晶，David Musser 在这个领域也有重大贡献。STL 已成为 ANSI/ISO C++ 草案标准的一部分。</p>
            <div class="callout key">
              <p class="callout-h">泛型程序设计</p>
              <p>简单地说就是使用模板的程序设计法。将一些常用的数据结构（比如链表，数组，二叉树）和算法（比如排序，查找）写成模板，以后则不论数据结构里放的是什么对象，算法针对什么样的对象，都不必重新实现数据结构、重新编写算法。有了 STL，有了它我们能很方便地实现链表、堆栈、队列、优先队列、集合等基础数据结构，并且能得到更高质量的程序。</p>
            </div>
          `,
        },
        {
          type: 'html',
          html: `
            <p>假如设计一个求两参数最大值的函数，在实践中我们可能需要定义四个函数：</p>
            <pre class="code"><code>int    max(int a, int b)    { return (a &gt; b) ? a : b; }
long   max(long a, long b)  { return (a &gt; b) ? a : b; }
double max(double a, double b) { return (a &gt; b) ? a : b; }
char   max(char a, char b)  { return (a &gt; b) ? a : b; }</code></pre>
            <p>这些函数几乎相同，唯一的区别就是形参类型不同；需要事先知道有哪些类型会使用这些函数，对于未知类型这些函数不起作用。</p>
            <h3 id="sec-intro-h2">模板的概念与工作方式</h3>
            <ol>
              <li>所谓模板是一种使用无类型参数来产生一系列函数或类的机制。</li>
              <li>若一个程序的功能是对某种特定的数据类型进行处理，则可以将所处理的数据类型说明为参数，以便在其他数据类型的情况下使用，这就是模板的由来。</li>
              <li>模板是以一种完全通用的方法来设计函数或类，而不必预先说明将被使用的每个对象的类型。</li>
              <li>通过模板可以产生类或函数的集合，使它们操作不同的数据类型，从而避免需要为每一种数据类型产生一个单独的类或函数。</li>
            </ol>
            <p>求最大值模板函数实现——求两个数最大值，使用模板：</p>
            <pre class="code"><code>template &lt;class T&gt;
T max(T a, T b) {
    return (a &gt; b) ? a : b;
}

// 语法形式
template &lt;模板形参表&gt;
&lt;返回值类型&gt; &lt;函数名&gt;（模板函数形参表）
{
// 函数定义体
}</code></pre>
            <p><strong>模板工作方式</strong>：函数模板只是说明，不能直接执行，需要实例化为模板函数后才能执行。在说明了一个函数模板后，当编译系统发现有一个对应的函数调用时，将根据实参中的类型来确认是否匹配函数模板中对应的形参，然后生成一个重载函数。该重载函数的定义体与函数模板的函数定义体相同，它称之为<strong>模板函数</strong>。</p>
            <p>编写一个对具有 n 个元素的数组 a[] 求最小值的程序，要求将求最小值的函数设计成函数模板（例 1）：</p>
            <pre class="code"><code>#include &lt;iostream&gt;
template &lt;class T&gt;
T min(T a[], int n)
{
    int i;
    T minv = a[0];
    for (i = 1; i &lt; n; i++) {
        if (minv &gt; a[i])
            minv = a[i];
    }
    return minv;
}

int main()
{
    int a[] = {1, 3, 0, 2, 7, 6, 4, 5, 2};
    double b[] = {1.2, -3.4, 6.8, 9, 8};
    cout &lt;&lt; "a数组的最小值为：" &lt;&lt; min(a, 9) &lt;&lt; endl;
    cout &lt;&lt; "b数组的最小值为：" &lt;&lt; min(b, 4) &lt;&lt; endl;
}</code></pre>
            <p>此程序的运行结果为：</p>
            <pre class="code"><code>a数组的最小值为：0
b数组的最小值为：-3.4</code></pre>
            <h3 id="sec-intro-h3">模板的优缺点</h3>
            <ul>
              <li>函数模板方法克服了 C 语言解决上述问题时用大量不同函数名表示相似功能的坏习惯；</li>
              <li>克服了宏定义不能进行参数类型检查的弊端；</li>
              <li>克服了 C++ 函数重载用相同函数名字重写几个函数的繁琐。</li>
              <li><strong>缺点</strong>：调试比较困难。一般先写一个特殊版本的函数，运行正确后，改成模板函数。</li>
            </ul>
          `,
        },
      ],
    },
    {
      id: 'sec-comp',
      heading: '1.2 STL 的组成结构',
      blocks: [
        {
          type: 'html',
          html: `
            <h3 id="sec-comp-h1">什么是 STL</h3>
            <p>STL 全名标准模板库（Standard Template Library），是一群以 template 为根基的 C++ 程序库，目的在提供一些基本的容器类别（container class）与高效的算法（algorithm）。</p>
            <p>一般来说程序是由算法加上数据结构，互相配合、一起工作，完成程序的功能。但如此一来便将数据结构与算法紧密绑定，不能分离，缺乏弹性。Stepanov 先生便针对此问题，采通用型设计的思维，使得程序员可以：</p>
            <ol>
              <li>以有效率的算法解决问题，此算法可处理各种数据结构，即算法与数据结构互为独立；</li>
              <li>各种数据结构使用一致的接口（interface），让各种算法可以透过此接口处理各种数据结构。</li>
            </ol>
            <div class="callout key">
              <p class="callout-h">算法 + 数据结构 = 程序</p>
              <p>《The Art of Computer Programming》书中强调这一等式。STL 的一个重大成就在于，它提供了相当多的有用算法（讲义：STL 提供了大约 100 个实现算法的模板函数），并使它们在一个有效的框架中完成。</p>
            </div>
            <svg class="fig" viewBox="0 0 560 200" role="img" aria-label="STL 简单组成：容器与算法通过迭代器连接">
              <rect x="0" y="0" width="560" height="200" fill="var(--c-panel)"/>
              <rect x="60" y="70" width="150" height="64" rx="10" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
              <text x="135" y="96" text-anchor="middle" font-size="15" fill="var(--c-ink)">容器类</text>
              <text x="135" y="118" text-anchor="middle" font-size="12" fill="var(--c-ink-soft)">(container)</text>
              <rect x="350" y="70" width="150" height="64" rx="10" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
              <text x="425" y="96" text-anchor="middle" font-size="15" fill="var(--c-ink)">算法</text>
              <text x="425" y="118" text-anchor="middle" font-size="12" fill="var(--c-ink-soft)">(Algorithms)</text>
              <rect x="230" y="40" width="100" height="46" rx="10" fill="var(--c-key-bg)" stroke="var(--c-accent)"/>
              <text x="280" y="68" text-anchor="middle" font-size="15" fill="var(--c-accent)">Iterator</text>
              <path d="M210 92 L230 74" stroke="var(--c-line)" stroke-width="1.5" fill="none"/>
              <path d="M330 74 L350 92" stroke="var(--c-line)" stroke-width="1.5" fill="none"/>
              <text x="280" y="150" text-anchor="middle" font-size="12" fill="var(--c-ink-soft)">容器和算法通过迭代器连接，做到算法与数据结构互相独立</text>
            </svg>
            <p>实际上，为了做到数据结构和算法之间的独立并保持相当的灵活性，STL 的实际组成比上图表示的要复杂得多，下面是 STL 的实际组成图：</p>
            <svg class="fig" viewBox="0 0 560 210" role="img" aria-label="STL 实际组成：六大组件围绕 STL 核心">
              <rect x="0" y="0" width="560" height="210" fill="var(--c-panel)"/>
              <rect x="230" y="82" width="100" height="46" rx="10" fill="var(--c-key-bg)" stroke="var(--c-accent)"/>
              <text x="280" y="110" text-anchor="middle" font-size="15" fill="var(--c-accent)">STL</text>
              <rect x="30" y="20" width="140" height="44" rx="8" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
              <text x="100" y="47" text-anchor="middle" font-size="13" fill="var(--c-ink)">Containers 容器</text>
              <rect x="30" y="146" width="140" height="44" rx="8" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
              <text x="100" y="173" text-anchor="middle" font-size="13" fill="var(--c-ink)">Iterators 迭代器</text>
              <rect x="210" y="164" width="140" height="40" rx="8" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
              <text x="280" y="189" text-anchor="middle" font-size="13" fill="var(--c-ink)">Adapter 适配器</text>
              <rect x="390" y="146" width="140" height="44" rx="8" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
              <text x="460" y="166" text-anchor="middle" font-size="13" fill="var(--c-ink)">Function Objects</text>
              <text x="460" y="184" text-anchor="middle" font-size="13" fill="var(--c-ink)">函数对象</text>
              <rect x="390" y="20" width="140" height="44" rx="8" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
              <text x="460" y="47" text-anchor="middle" font-size="13" fill="var(--c-ink)">Algorithms 算法</text>
              <text x="280" y="26" text-anchor="middle" font-size="12" fill="var(--c-ink-soft)">算法 + 数据结构 = 程序</text>
            </svg>
          `,
        },
        {
          type: 'html',
          html: `
            <h3 id="sec-comp-h2">五大组件</h3>
            <ul>
              <li><strong>容器</strong>（container）——用来容纳/储存各种数据类型的数据结构；</li>
              <li><strong>迭代器</strong>（iterator）——好比传统 C 语言的指针，可藉之依次存取容器中元素的对象；</li>
              <li><strong>算法</strong>（algorithm）——算法通过迭代器来操作容器中元素的函数模板；</li>
              <li><strong>适配器</strong>（adaptor）——利用基础容器对象，加以包装，改变其接口，以适应另一种需求；</li>
              <li><strong>函数对象</strong>（function object）——为 STL 中较低阶的对象，用来代替传统的函数指针（function pointer）。</li>
            </ul>
            <h3 id="sec-comp-h3">容器概述：三大类</h3>
            <p>容器可以用于存放各种类型的数据（基本类型的变量，对象等）。容器分为三大类：</p>
            <ol>
              <li><strong>顺序容器</strong>
                <ul>
                  <li>vector：后部插入/删除，直接访问；</li>
                  <li>deque：前/后部插入/删除，直接访问；</li>
                  <li>list：双向链表，任意位置插入/删除。</li>
                </ul>
              </li>
              <li><strong>关联容器</strong>
                <ul>
                  <li>set：快速查找，无重复元素；</li>
                  <li>multiset：快速查找，可有重复元素；</li>
                  <li>map：一对一映射，无重复元素，基于关键字查找；</li>
                  <li>multimap：一对一映射，可有重复元素，基于关键字查找。</li>
                </ul>
                <p>前 2 者合称为第一类容器。</p>
              </li>
              <li><strong>容器适配器</strong>
                <ul>
                  <li>stack：LIFO（后进先出）；</li>
                  <li>queue：FIFO（先进先出）；</li>
                  <li>priority_queue：优先级高的元素先出。</li>
                </ul>
              </li>
            </ol>
            <p><strong>顺序容器简介</strong>——上述三种容器称为顺序容器，是因为元素的插入位置同元素的值无关。</p>
            <ul>
              <li>vector，头文件 <code>&lt;vector&gt;</code>：实际上就是个动态数组。随机存取任何元素都能在常数时间完成。在尾端增删元素具有较佳的性能。</li>
              <li>deque，头文件 <code>&lt;deque&gt;</code>：也是个动态数组，随机存取任何元素都能在常数时间完成（但性能次于 vector）。在两端增删元素具有较佳的性能。</li>
              <li>list，头文件 <code>&lt;list&gt;</code>：双向链表，在任何位置增删元素都能在常数时间完成。不支持随机存取。</li>
            </ul>
            <p><strong>关联容器简介</strong>——关联式容器内的元素是排序的，插入任何元素，都按相应的排序准则来确定其位置。关联式容器的特点是在查找时具有非常好的性能。</p>
            <ul>
              <li>set / multiset，头文件 <code>&lt;set&gt;</code>：set 即集合。set 中不允许相同元素，multiset 中允许存在相同的元素。</li>
              <li>map / multimap，头文件 <code>&lt;map&gt;</code>：map 与 set 的不同在于 map 中存放的是成对的 key/value，并根据 key 对元素进行排序，可快速地根据 key 来检索元素；map 同 multimap 的不同在于是否允许多个元素有相同的 key 值。</li>
            </ul>
            <p>上述 4 种容器通常以平衡二叉树方式实现，插入和检索的时间都是 <span class="m">O(logN)</span>。</p>
            <p><strong>容器适配器简介</strong></p>
            <ul>
              <li>stack，头文件 <code>&lt;stack&gt;</code>：栈。是个有限序列，并满足序列中被删除、检索和修改的项只能是最近插入序列的项，即按照后进先出的原则。</li>
              <li>queue，头文件 <code>&lt;queue&gt;</code>：队列。插入只可以在尾部进行，删除、检索和修改只允许从头部进行，按照先进先出的原则。</li>
              <li>priority_queue，头文件 <code>&lt;queue&gt;</code>：优先级队列。最高优先级元素总是第一个出列。</li>
            </ul>
          `,
        },
        {
          type: 'html',
          html: `
            <h3 id="sec-comp-h4">容器的共有成员函数</h3>
            <p>所有标准库容器共有的成员函数：</p>
            <ul>
              <li>相当于按词典顺序比较两个容器大小的运算符：=, &lt;, &lt;=, &gt;, &gt;=, ==, !=；</li>
              <li>empty：判断容器中是否有元素；</li>
              <li>max_size：容器中最多能装多少元素；</li>
              <li>size：容器中元素个数；</li>
              <li>swap：交换两个容器的内容；</li>
              <li>begin、end、insert、erase 等。</li>
            </ul>
            <p>vector 的成员函数（例 2）：</p>
            <table class="tbl">
              <thead>
                <tr><th>函数名</th><th>返回值</th><th>参数</th><th>功能</th></tr>
              </thead>
              <tbody>
                <tr><td>at</td><td>元素的引用</td><td>要取元素的位置 (int pos)</td><td>如果该位置元素存在则返回它的引用，否则进行异常处理</td></tr>
                <tr><td>back</td><td>元素的引用</td><td>无</td><td>返回容器最后一个元素的引用，如果容器为空则出错</td></tr>
                <tr><td>begin</td><td>迭代器</td><td>无</td><td>取得元素的首迭代器</td></tr>
                <tr><td>end</td><td>迭代器</td><td>无</td><td>取得元素的尾迭代器</td></tr>
                <tr><td>clear</td><td>无</td><td>无</td><td>将容器清空</td></tr>
                <tr><td>empty</td><td>bool 值</td><td>无</td><td>如果容器为空则为真，否则为假</td></tr>
                <tr><td>erase</td><td>迭代器</td><td>要删除元素的迭代器；要删除容器段的首尾迭代器</td><td>第一个版本删除指定的元素；第二个版本删除指定的容器段，不存在则出错</td></tr>
                <tr><td>front</td><td>元素的引用</td><td>无</td><td>返回首元素的引用，为空则出错</td></tr>
                <tr><td>insert</td><td>无</td><td>1. iterator it, const T&amp; x；2. iterator it, const_iterator first, const_iterator last</td><td>在 it 这个位置插入元素 T；从 it 位置开始，依次插入 first 到 last 所指的元素</td></tr>
                <tr><td>pop_back</td><td>无</td><td>无</td><td>删除最后一个元素</td></tr>
                <tr><td>push_back</td><td>无</td><td>const T&amp; x</td><td>从最后插入一个元素</td></tr>
                <tr><td>resize</td><td>无</td><td>size_type n</td><td>将容器大小重设置为 n</td></tr>
                <tr><td>size</td><td>int</td><td>无</td><td>返回容器中元素的个数</td></tr>
              </tbody>
            </table>
            <p>再看一个 map 的例子（例 3）——用 map 实现电话簿：</p>
            <pre class="code"><code>#include &lt;cstdlib&gt;
#include &lt;iostream&gt;
#include &lt;map&gt;
#include &lt;string&gt;

using namespace std;

typedef map&lt;string, int&gt; Phone_Book;

void call(Phone_Book pb, string name)
{
    cout &lt;&lt; "calling ... " &lt;&lt; pb[name] &lt;&lt; endl;
}

int main(int argc, char *argv[])
{
    map&lt;string, int&gt; phone_book;
    phone_book["zhangsan"] = 2901101;
    phone_book["LiSi"] = 2903105;

    call(phone_book, "LiSi");
    system("PAUSE");
    return EXIT_SUCCESS;
}</code></pre>
          `,
        },
        {
          type: 'html',
          html: `
            <h3 id="sec-comp-h5">指针的抽象：从 find 到迭代器</h3>
            <p><strong>(1) 示例</strong>——给定一个存储整数的 vector 及一个整数值，在 vector 中查找这个值，并返回指针指向该值，null 表示不存在该值。一个解：</p>
            <pre class="code"><code>const int* find(const vector&lt;int&gt;&amp; vec, int value)
{
    for (int i = 0; i &lt; vec.size(); ++i)
        if (vec[i] == value)
            return &amp;vec[i];
    return null;
}</code></pre>
            <p><strong>(2) 变化（增加对 float 的功能）</strong>：template 形式。进一步要求：可以同时处理 array。其一：通过函数的 overload 实现；另一个：只写一份，同时处理 vector 和 array（如何实现？）</p>
            <pre class="code"><code>Template &lt;typename elemType&gt;
const elemType * find(const vector&lt;elemType&gt;&amp; vec, elemType value)
{
    for (int i = 0; i &lt; vec.size(); ++i)
        if (vec[i] == value)
            return &amp;vec[i];
    return null;
}</code></pre>
            <p><strong>(3) 对策：问题分解</strong>——一、array 传入 find() 不实际指明 array；二、vector 传入 find() 不实际指明 vector。首先处理 array 的问题：array 如何传入函数及如何返回？</p>
            <pre class="code"><code>int min(int array[24]) { … }   // 实际相当于
int min(int* array) { … }      // 24 怎么办？</code></pre>
            <p><strong>(4) 解法</strong>——解法一，增加一个参数表示 array 的容量；解法二，传入另一个地址，作为 array 的终点。array 从参数表中消失了，第一个问题解决：</p>
            <pre class="code"><code>template &lt;typename elemType&gt;
const elemType* find(const elemType* array, int size, const elemType&amp; value);

template &lt;typename elemType&gt;
const elemType* find(const elemType* array,
                     const elemType* sentinel,
                     const elemType&amp; value);</code></pre>
            <p><strong>(5) 实现</strong>：</p>
            <pre class="code"><code>template &lt;typename elemType&gt;
const elemType* find(const elemType* first,
                     const elemType* last,
                     const elemType&amp; value);
{
    if (!first || !last) return null;
    for (; first != last; ++first)
        if (*first == value)
            return first;
    return null;
}</code></pre>
            <p><strong>(6) 使用</strong>——如何完成第二个子任务？vector 和 array 相同，都是以一块连续内存存储器所有元素，可按 array 相同方式处理：用一组表示「开始地址/结束地址」的参数传入 find()：</p>
            <pre class="code"><code>int ia[8] = { 3, 5, 67, 2, 46, 7, 53, 67 };
double da[8] = { 25.1, 1.2, 58.0, 25.3, 13.5, 46.0, 25, 58.8 };
string sa[4] = { "lkei", "iekadkl", "iejg", "ietjpal" };

const int* pi = find(ia, ia + 8, ia[3]);
const double* pd = find(da, da + 8, da[3]);
const string* ps = find(sa, sa + 4, sa[3]);</code></pre>
            <p><strong>(7) 例如——任务完成</strong>。可是如果要加上对 list 的支持呢？解决办法是在底层指针之上提供一层抽象化机制：</p>
            <pre class="code"><code>vector&lt;string&gt; svec;
find(&amp;svec[0], &amp;svec[svec.size()], search_value);
// 需要事先确定 svec 为非空，也许更安全的方法
if (!svec.empty())
    find(&amp;svec[0], &amp;svec[svec.size()], search_value);

// 更好的方法：
template &lt;typename elemType&gt;
inline elemType* begin(const vector&lt;elemType&gt;&amp; vec)
{    return vec.empty() ? null : &amp;vec[0]; }
// 同样实现 end()

find(begin(svec), end(svec), search_value);</code></pre>
          `,
        },
        {
          type: 'html',
          html: `
            <h3 id="sec-comp-h6">迭代器</h3>
            <p>迭代器的很多性质是和 C++/C 中的指针相似，甚至可以说指针就是一种 C++ 编译器里内置的迭代器，可以说就是指针的类实现。软件设计有一个基本原则：所有的问题都可以通过引进一个间接层来简化，这种简化在 STL 中就是用迭代器来完成的。迭代器在 STL 中用来将算法和容器联系起来，起着一种<strong>黏合剂</strong>的作用。几乎 STL 提供的所有算法都是通过迭代器存取元素序列进行工作的，每一个容器都定义了其本身所专有的迭代器，用以存取容器中的元素。</p>
            <p><strong>Iterator 的范围表示</strong>——用一对迭代器（首迭代器与尾迭代器）表示元素序列，尾迭代器指向最后一个元素的后面：</p>
            <svg class="fig" viewBox="0 0 620 120" role="img" aria-label="迭代器范围表示：first 到 last 左闭右开">
              <rect x="0" y="0" width="620" height="120" fill="var(--c-panel)"/>
              <g font-size="13">
                <rect x="60" y="46" width="84" height="34" rx="6" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <rect x="144" y="46" width="84" height="34" rx="6" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <rect x="228" y="46" width="84" height="34" rx="6" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <rect x="312" y="46" width="84" height="34" rx="6" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <rect x="396" y="46" width="84" height="34" rx="6" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <text x="102" y="68" text-anchor="middle" fill="var(--c-ink)">e₁</text>
                <text x="186" y="68" text-anchor="middle" fill="var(--c-ink)">e₂</text>
                <text x="270" y="68" text-anchor="middle" fill="var(--c-ink)">e₃</text>
                <text x="354" y="68" text-anchor="middle" fill="var(--c-ink)">e₄</text>
                <text x="438" y="68" text-anchor="middle" fill="var(--c-ink)">e₅</text>
                <circle cx="60" cy="92" r="4" fill="var(--c-accent)"/>
                <text x="60" y="112" text-anchor="middle" fill="var(--c-accent)">first</text>
                <circle cx="480" cy="92" r="4" fill="var(--c-accent)"/>
                <text x="480" y="112" text-anchor="middle" fill="var(--c-accent)">last（past-the-end）</text>
                <path d="M64 88 H476" stroke="var(--c-line)" stroke-width="1.5" stroke-dasharray="4 3"/>
              </g>
            </svg>
            <p>迭代器有 const 和非 const 两种。通过迭代器可以读取它指向的元素，通过非 const 迭代器还能修改其指向的元素。迭代器用法和指针类似。定义一个容器类的迭代器的方法可以是：</p>
            <pre class="code"><code>容器类名::iterator 变量名;
// 或：
容器类名::const_iterator 变量名;

// 访问一个迭代器指向的元素：
* 迭代器变量名</code></pre>
            <p>迭代器上可以执行 <code>++</code> 操作，以指向容器中的下一个元素。如果迭代器到达了容器中的最后一个元素的后面，则迭代器变成 <strong>past-the-end</strong> 值。使用一个 past-the-end 值的迭代器来访问对象是非法的，就好像使用 NULL 或未初始化的指针一样。</p>
            <p>不同容器上支持的迭代器功能强弱有所不同。容器的迭代器的功能强弱，决定了该容器是否支持 STL 中的某种算法。</p>
            <ul>
              <li>例 1：只有第一类容器能用迭代器遍历。</li>
              <li>例 2：排序算法需要通过随机迭代器来访问容器中的元素，那么有的容器就不支持排序算法。</li>
            </ul>
            <p>STL 中的迭代器按功能由弱到强分为 5 种：</p>
            <ol>
              <li>输入：Input iterators，提供对数据的只读访问；</li>
              <li>输出：Output iterators，提供对数据的只写访问；</li>
              <li>正向：Forward iterators，提供读写操作，并能一次一个地向前推进迭代器；</li>
              <li>双向：Bidirectional iterators，提供读写操作，并能一次一个地向前和向后移动；</li>
              <li>随机访问：Random access iterators，提供读写操作，并能在数据中随机移动。</li>
            </ol>
            <p>编号大的迭代器拥有编号小的迭代器的所有功能，能当作编号小的迭代器使用。各迭代器支持的操作：</p>
            <ul>
              <li>所有迭代器：<code>++p, p++</code></li>
              <li>输入迭代器：<code>*p, p = p1, p == p1, p != p1</code></li>
              <li>输出迭代器：<code>*p, p = p1</code></li>
              <li>正向迭代器：上面全部</li>
              <li>双向迭代器：上面全部，<code>--p, p--</code></li>
              <li>随机访问迭代器：上面全部，以及：<code>p += i, p -= i</code>；<code>p+i</code>：返回指向 p 后面的第 i 个元素的迭代器；<code>p-i</code>：返回指向 p 前面的第 i 个元素的迭代器；<code>p[i]</code>：p 后面的第 i 个元素的引用；<code>p &lt; p1, p &lt;= p1, p &gt; p1, p &gt;= p1</code></li>
            </ul>
            <p>各容器的迭代器类别：</p>
            <table class="tbl">
              <thead>
                <tr><th>容器</th><th>迭代器类别</th></tr>
              </thead>
              <tbody>
                <tr><td>vector</td><td>随机</td></tr>
                <tr><td>deque</td><td>随机</td></tr>
                <tr><td>list</td><td>双向</td></tr>
                <tr><td>set / multiset</td><td>双向</td></tr>
                <tr><td>map / multimap</td><td>双向</td></tr>
                <tr><td>stack</td><td>不支持迭代器</td></tr>
                <tr><td>queue</td><td>不支持迭代器</td></tr>
                <tr><td>priority_queue</td><td>不支持迭代器</td></tr>
              </tbody>
            </table>
            <p>迭代器的例子（例 4）——用迭代器遍历 vector 并输出：</p>
            <pre class="code"><code>#include &lt;iostream&gt;
#include &lt;vector&gt;

using namespace std;
vector&lt;int&gt; myV;

int main(int argc, char *argv[])
{
    for (int i = 0; i &lt; 10; i++)
        myV.push_back(i);

    vector&lt;int&gt;::iterator it;
    for (it = myV.begin(); it != myV.end(); it++)
        cout &lt;&lt; (*it) &lt;&lt; ' ';

    system("PAUSE");  //press any key to continue......
    return 0;
}</code></pre>
            <p><strong>流迭代器</strong>——分为 ostream_iterator 和 istream_iterator，其中输出流迭代器可指定写入的目的地和间隔符；输入流可指定读取的来源，并应该和结束迭代器比较。使用迭代器的优点就是可以使用算法，并且很多东西都可抽象为流，确实方便；最经常的当然是 cout 和 cin（例 5）：</p>
            <pre class="code"><code>#include &lt;iostream&gt;
#include &lt;vector&gt;
#include &lt;algorithm&gt;
#include &lt;iterator&gt;
using namespace std;

int main(int argc, char *argv[])
{
    // 输出流迭代器，就是通过这个迭代器来写入"流"
    // 构造函数第一个参数为要输出目的地，第二个参数为间隔符
    ostream_iterator&lt;int&gt; intwriter(cout, " ");

    *intwriter = 11;
    *intwriter = 22;
    *intwriter = 33;

    vector&lt;int&gt; col1;

    for (int i = 0; i &lt; 10; i++)
        col1.push_back(i);
    cout &lt;&lt; endl;
    copy(col1.begin(), col1.end(), intwriter);
}</code></pre>
          `,
        },
        {
          type: 'html',
          html: `
            <h3 id="sec-comp-h7">算法</h3>
            <p>STL 中提供能在各种容器中通用的算法，比如插入，删除，查找，排序等。大约有 70 种标准算法。</p>
            <ul>
              <li>算法就是一个个函数模板；</li>
              <li>算法通过迭代器来操纵容器中的元素。许多算法需要两个参数，一个是起始元素的迭代器，一个是终止元素的后面一个元素的迭代器。比如，排序和查找；</li>
              <li>有的算法返回一个迭代器。比如 find() 算法，在容器中查找一个元素，并返回一个指向该元素的迭代器；</li>
              <li>算法可以处理容器，也可以处理 C 语言的数组。</li>
            </ul>
            <p><strong>算法分类</strong>：</p>
            <ul>
              <li>变化序列算法：<code>copy, remove, fill, replace, random_shuffle, swap, …..</code>，会改变容器；</li>
              <li>非变化序列算法：<code>adjacent-find, equal, mismatch, find, count, search, count_if, for_each, search_n</code>。</li>
            </ul>
            <p>以上函数模板都在 <code>&lt;algorithm&gt;</code> 中定义，此外还有其他算法，比如 <code>&lt;numeric&gt;</code> 中的算法。</p>
            <p><strong>排序和查找算法</strong>：</p>
            <div class="code-pair">
              <div class="code-col">
                <p class="code-h">sort（例 6、例 7）</p>
                <pre class="code"><code>template&lt;class RanIt&gt;
void sort(RanIt first, RanIt last);</code></pre>
              </div>
              <div class="code-col">
                <p class="code-h">find（例 8）</p>
                <pre class="code"><code>template&lt;class InIt, class T&gt;
InIt find(InIt first, InIt last, const T&amp; val);</code></pre>
              </div>
            </div>
            <div class="callout tip">
              <p class="callout-h">binary_search</p>
              <p>折半查找，要求容器已经有序：</p>
              <pre class="code"><code>template&lt;class FwdIt, class T&gt;
bool binary_search(FwdIt first, FwdIt last, const T&amp; val);</code></pre>
            </div>
          `,
        },
      ],
    },
    {
      id: 'sec-app',
      heading: '1.3 STL 的应用',
      blocks: [
        {
          type: 'html',
          html: `
            <h3 id="sec-app-h1">头文件与编译环境</h3>
            <p>标准的 C++ 库包含一个 INCLUDE 库和一个 LIB 库。Include 库里的函数和类都是以源文件的形式给出的，用户可以查看它的源代码，而 LIB 库中则以二进制的形式给出。STL 都是以源码的形式给出的，各个编译器有不同的版本。</p>
            <p>在做题目的时候可以选用 VC++ 或 DEV C++，但是 VC++ 用的不是 g++ 内核，而现在的 JUDGE 一般都用 g++ 来编译测试，所以从适应比赛角度来说用 DEV C++ 比较合适，它也有很好的编辑环境，而且比较小，容易存储。不过如果严格按照标准 C++ 的格式来编制程序的话，一般不会遇到因编译器而出错的问题。</p>
            <p>现在大多数编译器都包含新旧两个版本的头文件，旧版本的头文件是以 .h 为扩展名的，新版本的头文件则不带扩展名：</p>
            <div class="code-pair">
              <div class="code-col">
                <p class="code-h">旧版头文件</p>
                <pre class="code"><code>#include &lt;iostream.h&gt;
#include &lt;stdio.h&gt;</code></pre>
              </div>
              <div class="code-col">
                <p class="code-h">新版头文件</p>
                <pre class="code"><code>#include &lt;iostream&gt;
#include &lt;stdio&gt;
using namespace std;</code></pre>
              </div>
            </div>
            <p>上面的 <code>using namespace std;</code> 一句是使用名字域 std，在 std 中声明了所有 STL 中的接口，在文件中声明一次即可。此外，新旧文件的文件名不尽相同，例如 math.h 在新版本中为 cmath，一般情况下名字不同时在原文件名前加 c 即可。</p>
          `,
        },
        {
          type: 'html',
          html: `
            <h3 id="sec-app-h2">pair 与 utility</h3>
            <p>在介绍 STL 具体的数据结构之前，我们必须先了解一种叫迭代器的结构（详见上节），第一类容器提供成员函数 <code>begin()</code> 和 <code>end()</code> 来返回容器的首尾迭代器。</p>
            <p>STL 中最简单的数据结构应属于 <code>&lt;utility&gt;</code> 中定义的 pair，它包含两个内部变量 first、second，用来将两个相关的数据配对，并重载了比较大小、判等、转化等函数，使用它可以方便地实例化自己的结构：</p>
            <pre class="code"><code>#include &lt;iostream&gt;
#include &lt;utility&gt;

using namespace std;
typedef pair&lt;int,int&gt; POINT;

int main()
{
    POINT p1, p2;
    cin &gt;&gt; p1.first &gt;&gt; p1.second &gt;&gt; p2.first &gt;&gt; p2.second;
    if (p1 == p2) cout &lt;&lt; "Equal!" &lt;&lt; endl;
    else cout &lt;&lt; "Not Equal" &lt;&lt; endl;
    return 0;
}</code></pre>
            <p>此外，utility 中还有一个 <code>pair&lt;T, U&gt; make_pair(const T &amp;x, const U &amp;y)</code> 函数，用来将两个数据组成一个 pair 对象返回。例如要建立一个坐标的数据结构，则可以 <code>typedef pair&lt;int,int&gt; POINT;</code>，这样在下面的代码中就可以使用 POINT 这个结构了。如果要使用它的判断函数，则所传递的类型必须已经重载了比较运算符或者是系统自定义类型。</p>
          `,
        },
        {
          type: 'html',
          html: `
            <h3 id="sec-app-h3">顺序容器实战：vector / list / deque / stack</h3>
            <p><strong>vector 类</strong>——vector 类是一个线性数组类，内部用线性空间来存放元素，内部有两个不同的变量来标识当前元素个数 _size 和当前共分配的空间数 _capacity，通常情况下 _size 要小于 _capacity，这样当在数组中添加元素时就不用每次都重新分配空间，从而提高了时间效率，直到分配的空间使用完时才重新分配。至于每次分配空间的大小则与数组元素的个数有关，可以用 capacity() 函数得到。vector 类元素最多一般可以为 1073741823 个。vector 类重载了下标运算符，可以像数组一样访问容器中的元素，而且 vector 可以相互赋值，这是 C 语言的数组所不能实现的。vector 不进行下标检查，但是它通过成员函数 at 提供这个功能。</p>
            <p>使用 vector 可以方便地实现线性多维数组，例如要分别建立坐标的一维和二维数组：</p>
            <pre class="code"><code>#include &lt;utility&gt;
#include &lt;vector&gt;
using namespace std;
typedef pair&lt;int,int&gt; POINT;
typedef vector&lt;POINT&gt; Array1D;
typedef vector&lt;vector&lt;POINT&gt; &gt; Array2D;</code></pre>
            <div class="callout warn">
              <p class="callout-h">注意</p>
              <p>在定义 Array2D 的时候，后面的尖括号中间要用空格隔开（<code>&gt; &gt;</code>），否则编译器可能误认为是移位运算符而报错。</p>
            </div>
            <p>实例程序：</p>
            <pre class="code"><code>#include &lt;iostream&gt;
#include &lt;vector&gt;
using namespace std;
typedef vector&lt;int&gt; Array1D;
typedef vector&lt;vector&lt;int&gt; &gt; Array2D;
int main()
{
    int i, j;
    Array1D sz;
    for (i = 0; i &lt; 10; i++)
        sz.push_back(i);
    for (i = 0; i &lt; 10; i++)
        cout &lt;&lt; sz[i] &lt;&lt; "  ";
    cout &lt;&lt; "\\n" &lt;&lt; sz.front() &lt;&lt; "  " &lt;&lt; sz.back() &lt;&lt; endl;
    sz.erase(sz.begin() + 3);
    for (i = 0; i &lt; sz.size(); i++)
        cout &lt;&lt; sz[i] &lt;&lt; "  ";
    cout &lt;&lt; endl;
    sz.erase(sz.begin() + 2, sz.begin() + 5);
    for (i = 0; i &lt; sz.size(); i++)
        cout &lt;&lt; sz[i] &lt;&lt; " ";
    cout &lt;&lt; endl;
    sz.erase(sz.begin(), sz.end()); //sz.clear();
    Array2D tw;
    tw.resize(5);
    for (i = 0; i &lt; 5; i++)
        tw[i].resize(5);
    for (i = 0; i &lt; 5; i++)
        for (j = 0; j &lt; 5; j++)
            tw[i][j] = i * 5 + j;
    for (i = 0; i &lt; tw.size(); i++)
    {
        for (j = 0; j &lt; tw[i].size(); j++)
            cout &lt;&lt; tw[i][j] &lt;&lt; " ";
        cout &lt;&lt; endl;
    }
    system("PAUSE");  //press any key to continue......
    return 0;
}</code></pre>
            <p>对应的输出应当为：</p>
            <pre class="code"><code>0 1 2 3 4 5 6 7 8 9
0  9
0 1 2 4 5 6 7 8 9
0 1 6 7 8 9
0 1 2 3 4
5 6 7 8 9
10 11 12 13 14
15 16 17 18 19
20 21 22 23 24
请按任意键继续. . .</code></pre>
            <p>读者对照输出可体会各函数的用法。</p>
            <p><strong>list 类</strong>——list 顺序容器提供在容器中任意位置进行插入与删除操作的有效实现方法。如果大多数插入和删除发生在容器首尾，双头队列 deque 更合适。list 是双链表，每个结点包含数据和指向上一个结点、下一个结点的指针，支持双向迭代器。list 与一般的容器相比增加的成员函数有 splice、push_front、remove、unique、merge、reverse、sort 等，使用的时候要包含 <code>&lt;list&gt;</code> 头文件。</p>
            <ul>
              <li>splice 相当于 insert，只不过是插入后将另一个链表中的该元素移除而已；</li>
              <li>remove 是删除指定值的结点；</li>
              <li>unique 有两个版本，第一个版本是 <code>void unique()</code>，将每个元素同它的前面一个元素比较，如果相等则 remove 该元素；第二个版本是 <code>void unique(not_equal_to&lt;T&gt; pr)</code>，用函数 pr 的返回值来作为判等的条件。</li>
            </ul>
            <p>sort 函数有两个版本，第一个按照 operator&lt; 排序，另一个则用 pr 函数的返回值作为排序的条件。实例程序：</p>
            <pre class="code"><code>#include &lt;iostream&gt;
#include &lt;list&gt;
//#include &lt;algorithm&gt;

using namespace std;

typedef list&lt;int&gt; lint;
int value[] = {2, 4, 5, 7, 9, 12};

void print(lint &amp;l)
{
    int i;
    lint::iterator pit;
    for (pit = l.begin(); pit != l.end(); pit++)
        cout &lt;&lt; (*pit) &lt;&lt; "  ";
    cout &lt;&lt; endl;
}
bool sortsp(int v1, int v2)
{
    return v1 &gt; v2;
}

int main()
{
    lint firstl, secondl;
    firstl.push_front(1);
    firstl.push_front(2);
    firstl.push_back(4);
    firstl.push_back(3);
    cout &lt;&lt; "The first list contains: ";
    print(firstl);
    firstl.sort();
    cout &lt;&lt; "After sort the first list: ";
    print(firstl);

    secondl.insert(secondl.begin(), value, value + 6);
    cout &lt;&lt; "The second list contains: ";
    print(secondl);
    firstl.splice(firstl.end(), secondl);
    cout &lt;&lt; "After splice the first list contians: ";
    print(firstl);
    firstl.sort(sortsp);
    cout &lt;&lt; "After sort with compare function: ";
    print(firstl);

    firstl.unique();
    cout &lt;&lt; "After unique the first list: ";
    print(firstl);

    firstl.remove(9);
    cout &lt;&lt; "After remove value 9 : ";
    print(firstl);

    secondl.insert(secondl.end(), value, value + 5);
    firstl.swap(secondl);
    cout &lt;&lt; "After swap with the second list: ";
    print(firstl);

    system("PAUSE"); //press any key to contineu... Used in dev c++
    return 0;
}</code></pre>
            <p>运行结果是：</p>
            <pre class="code"><code>The first list contains: 2 1 4 3
After sort the first list: 1 2 3 4
The second list contains: 2 4 5 7 9 12
After splice the first list contians: 1 2 3 4 2 4 5 7 9 12
After sort with compare function: 12 9 7 5 4 4 3 2 2 1
After unique the first list: 12 9 7 5 4 3 2 1
After remove value 9 : 12 7 5 4 3 2 1
After swap with the second list: 2 4 5 7 9
请按任意键继续. . .</code></pre>
            <p>以上介绍了两种容器的用法，其他的第一类容器与上面的类似，只是特性和接口函数上稍微有一些变化。<strong>deque 类</strong>与 <strong>stack 类</strong>的接口声明如下，读者可自行编制程序来体会它们的用法：</p>
            <div class="code-pair">
              <div class="code-col">
                <p class="code-h">deque 类</p>
                <pre class="code"><code>template&lt;class T, class A = allocator&lt;T&gt; &gt;
class deque {
public:
    iterator begin();
    const_iterator begin() const;
    iterator end();
    iterator end() const;
    void resize(size_type n, T x = T());
    size_type size() const;
    bool empty() const;
    reference at(size_type pos);
    const_reference at(size_type pos) const;
    reference operator[](size_type pos);
    const_reference operator[](size_type pos);
    reference front();
    const_reference front() const;
    reference back();
    const_reference back() const;
    void push_front(const T&amp; x);
    void pop_front();
    void push_back(const T&amp; x);
    void pop_back();
    iterator insert(iterator it, const T&amp; x = T());
    void insert(iterator it, size_type n, const T&amp; x);
    void insert(iterator it,
        const_iterator first, const_iterator last);
    iterator erase(iterator it);
    iterator erase(iterator first, iterator last);
    void clear();
    void swap(deque x);
};</code></pre>
              </div>
              <div class="code-col">
                <p class="code-h">stack 类</p>
                <pre class="code"><code>template&lt;class T,
    class Cont = deque&lt;T&gt; &gt;
class stack {
public:
    bool empty() const;
    size_type size() const;
    value_type&amp; top();
    const value_type&amp; top() const;
    void push(const value_type&amp; x);
    void pop();
};</code></pre>
              </div>
            </div>
          `,
        },
        {
          type: 'html',
          html: `
            <h3 id="sec-app-h4">关联容器实战：map</h3>
            <p>map 关联容器用于快速存储和读取关键字与相关值，内部是红黑树结构。map 不允许重复关键字，因此一个关键字只可以对应一个值，成为一对一映射。使用的时候要包含 <code>&lt;map&gt;</code> 头文件。</p>
            <pre class="code"><code>template&lt;class Key, class T, class Pred = less&lt;Key&gt;, class A = allocator&lt;T&gt; &gt;
class map {
public:
    iterator begin();
    const_iterator begin() const;
    iterator end();
    const_iterator end() const;
    size_type size() const;
    bool empty() const;
    A::reference operator[](const Key&amp; key);
    pair&lt;iterator, bool&gt; insert(const value_type&amp; x);
    iterator insert(iterator it, const value_type&amp; x);
    void insert(const value_type *first, const value_type *last);
    iterator erase(iterator it);
    iterator erase(iterator first, iterator last);
    size_type erase(const Key&amp; key);
    void clear();
    void swap(map x);
    key_compare key_comp() const;
    value_compare value_comp() const;
    iterator find(const Key&amp; key);
    const_iterator find(const Key&amp; key) const;
    size_type count(const Key&amp; key) const;
    iterator lower_bound(const Key&amp; key);
    const_iterator lower_bound(const Key&amp; key) const;
    iterator upper_bound(const Key&amp; key);
    const_iterator upper_bound(const Key&amp; key) const;
    pair&lt;iterator, iterator&gt; equal_range(const Key&amp; key);
    pair&lt;const_iterator, const_iterator&gt;
        equal_range(const Key&amp; key) const;
};</code></pre>
            <p>实例程序：</p>
            <pre class="code"><code>#include &lt;iostream&gt;
#include &lt;map&gt;
using namespace std;
int main()
{
    typedef map&lt;int, double, less&lt;int&gt; &gt; mid;
    mid pairs;
    pairs.insert(mid::value_type(15, 2.7));
    pairs.insert(mid::value_type(30, 111.11));
    pairs.insert(mid::value_type(15, 2.7));
    pairs.insert(mid::value_type(5, 1010.1));
    pairs.insert(mid::value_type(10, 22.22));
    pairs.insert(mid::value_type(25, 33.33));
    pairs.insert(mid::value_type(5, 77.22));
    pairs.insert(mid::value_type(20, 6.7));
    pairs.insert(mid::value_type(15, 2.7)); //ignore for key has exsit
    mid::iterator iter;
    for (iter = pairs.begin(); iter != pairs.end(); iter++)
        cout &lt;&lt; iter-&gt;first &lt;&lt; '\\t' &lt;&lt; iter-&gt;second &lt;&lt; endl;
    pairs[25] = 9999.99;
    pairs[40] = 8765.43;
    cout &lt;&lt; "\\nAfter subscript operations , pairs contains: " &lt;&lt; "\\nkey\\tvalue\\n";
    for (iter = pairs.begin(); iter != pairs.end(); iter++)
        cout &lt;&lt; iter-&gt;first &lt;&lt; "\\t" &lt;&lt; iter-&gt;second &lt;&lt; "\\t" &lt;&lt; endl;
    cout &lt;&lt; endl;
    system("PAUSE");
    return 0;
}</code></pre>
            <p>输出为：</p>
            <pre class="code"><code>5       1010.1
10      22.22
15      2.7
20      6.7
25      33.33
30      111.11
After subscript operations, pairs contains:
key     value
5       1010.1
10      22.22
15      2.7
20      6.7
25      9999.99
30      111.11
40      8765.43
请按任意键继续. . .</code></pre>
            <div class="callout warn">
              <p class="callout-h">注意</p>
              <p>在使用 map 的查找（find）函数的时候，如果该关键字没找到则插入，即如果不存在的话查找与插入同步完成。</p>
            </div>
          `,
        },
        {
          type: 'html',
          html: `
            <h3 id="sec-app-h5">常用算法：sort / find / qsort</h3>
            <p>STL 的数据结构很大程度上是为通用算法的建立而设计的。STL 将具有很强通用性的算法如查找、排序、拷贝、反序、替换等许多基本算法写成通用函数，提供了方便、简捷的接口。例如，你不必花费好大力气去写一个排序算法还要校验它的正确性，你只要调用 STL 中的 sort 函数即可。</p>
            <pre class="code"><code>Sort
template&lt;class RanIt&gt;
    void sort(RanIt first, RanIt last);
template&lt;class RanIt, class Pred&gt;
    void sort(RanIt first, RanIt last, Pred pr);</code></pre>
            <p>sort 函数的第一个版本是将 operator&lt; 排序，即由小到大排序。第二个版本是以所传递函数的返回值来确定顺序。前两个参数是要排序结构的首元素和尾元素的迭代器。如果要将数组 int tt[20] 前十个数由小到大排序则为：</p>
            <pre class="code"><code>#include &lt;algorithm&gt;
#include &lt;iostream&gt;

using namespace std;
int tt[20];
int main()
{
    int i;
    for (i = 0; i &lt; 20; i++)
        tt[i] = 20 - i;
    sort(tt, tt + 10);
    for (i = 0; i &lt; 10; i++)
        cout &lt;&lt; tt[i] &lt;&lt; " ";
    return 0;
}</code></pre>
            <p>如果要将 vector&lt;int&gt; gg 由大到小排序：</p>
            <pre class="code"><code>#include &lt;iostream&gt;
#include &lt;vector&gt;
#include &lt;algorithm&gt;

using namespace std;
vector&lt;int&gt; gg;
bool sortspecial(int v1, int v2)
{
    return v1 &gt; v2;
}
int main()
{
    int i;
    for (i = 0; i &lt; 20; i++)
        gg.push_back(i);
    sort(gg.begin(), gg.end(), sortspecial);
    for (i = 0; i &lt; 20; i++)
        cout &lt;&lt; gg[i] &lt;&lt; " ";
}</code></pre>
            <div class="callout warn">
              <p class="callout-h">注意：sort 是不稳定的</p>
              <p>这个排序算法是不稳定的，即具有相同键值的元素的最终位置与开始的相对位置并不一定相同，例如 &lt;7,6&gt;、&lt;7,5&gt;，如果按前一个值排序则最终两个 pair 的最终位置无法确定。如果需要保持稳定的话则可以使用 stable_sort 函数。</p>
            </div>
            <p>同时在 stdlib.h 文件中有一个快排函数 qsort，原型为：</p>
            <pre class="code"><code>void qsort(void *base, size_t num, size_t width,
    int (__cdecl *compare)(const void *elem1, const void *elem2));</code></pre>
            <p>用法如下：</p>
            <pre class="code"><code>#include &lt;iostream&gt;
#include &lt;cstdlib&gt;
using namespace std;
int a[9] = {1, 2, 4, 5, 8, 12, 23, 4, 3};
int compare(const void *arg1, const void *arg2);
int main()
{
    int i;
    qsort((void *)a, 9, sizeof(int), compare);
    /* Output sorted list: */
    for (i = 0; i &lt; 9; i++)
        cout &lt;&lt; a[i] &lt;&lt; " ";
    cout &lt;&lt; endl;
    system("PAUSE");
    return 0;
}
int compare(const void *arg1, const void *arg2)
{
    return *((int *)arg2) - *((int *)arg1);
}</code></pre>
            <p>输出为：<code>23 12 8 5 4 4 3 2 1</code></p>
            <p><strong>查找</strong>——有两个版本，一个直接查找特定值的元素，另一个按照函数的返回值来查找。</p>
            <pre class="code"><code>1、template&lt;class InIt, class T&gt;
    InIt find(InIt first, InIt last, const T&amp; val);</code></pre>
            <pre class="code"><code>#include &lt;algorithm&gt;
#include &lt;iostream&gt;
using namespace std;
int main()
{
    const int ARRAY_SIZE = 8;
    int IntArray[ARRAY_SIZE] = { 1, 2, 3, 4, 4, 5, 6, 7 };
    int *location;   // stores the position of the first
                     // matching element.
    int i;
    int value = 4;
    // print content of IntArray
    cout &lt;&lt; "IntArray { ";
    for (i = 0; i &lt; ARRAY_SIZE; i++)
        cout &lt;&lt; IntArray[i] &lt;&lt; ", ";
    cout &lt;&lt; " }" &lt;&lt; endl;
    // Find the first element in the range [first, last + 1)
    // that matches value.
    location = find(IntArray, IntArray + ARRAY_SIZE, value);
    // print the matching element if any was found
    if (location != IntArray + ARRAY_SIZE)  // matching element found
        cout &lt;&lt; "First element that matches " &lt;&lt; value
             &lt;&lt; " is at location " &lt;&lt; location - IntArray &lt;&lt; endl;
    else                                    // no matching element was found
        cout &lt;&lt; "The sequence does not contain any elements"
             &lt;&lt; "  with value " &lt;&lt; value &lt;&lt; endl;
    system("PAUSE");
    return 0;
}</code></pre>
            <p>Program Output is:</p>
            <pre class="code"><code>IntArray { 1, 2, 3, 4, 4, 5, 6, 7,  }
First element that matches 4 is at location 3</code></pre>
            <pre class="code"><code>2、template&lt;class InIt, class Pred&gt;
    InIt find_if(InIt first, InIt last, Pred pr);</code></pre>
            <pre class="code"><code>#include &lt;algorithm&gt;
#include &lt;iostream&gt;
using namespace std;
// returns true if n is an odd number
int IsOdd(int n)
{
    return n % 2;
}
int main()
{
    const int ARRAY_SIZE = 8;
    int IntArray[ARRAY_SIZE] = { 1, 2, 3, 4, 4, 5, 6, 7 };
    int *location;   // stores the position of the first
                     // element that is an odd number
    int i;
    // print content of IntArray
    cout &lt;&lt; "IntArray { ";
    for (i = 0; i &lt; ARRAY_SIZE; i++)
        cout &lt;&lt; IntArray[i] &lt;&lt; ", ";
    cout &lt;&lt; " }" &lt;&lt; endl;
    // Find the first element in the range [first, last - 1]
    // that is an odd number
    location = find_if(IntArray, IntArray + ARRAY_SIZE, IsOdd);
    // print the location of the first element
    if (location != IntArray + ARRAY_SIZE)  // first odd element found
        cout &lt;&lt; "First odd element " &lt;&lt; *location
             &lt;&lt; " is at location " &lt;&lt; location - IntArray &lt;&lt; endl;
    else         // no odd numbers in the range
        cout &lt;&lt; "The sequence does not contain any odd numbers"
             &lt;&lt; endl;
}</code></pre>
            <p>Program Output is:</p>
            <pre class="code"><code>IntArray { 1, 2, 3, 4, 4, 5, 6, 7,  }
First odd element 1 is at location 0</code></pre>
            <p>现在将经常用到的算法类举如下：</p>
            <pre class="code"><code>namespace std {
template&lt;class InIt, class T&gt;
    InIt find(InIt first, InIt last, const T&amp; val);
template&lt;class InIt, class Pred&gt;
    InIt find_if(InIt first, InIt last, Pred pr);
size_t count(InIt first, InIt last, const T&amp; val, Dist&amp; n);
template&lt;class InIt, class Pred, class Dist&gt;
    size_t count_if(InIt first, InIt last, Pred pr);
template&lt;class InIt, class OutIt&gt;
    OutIt copy(InIt first, InIt last, OutIt x);
template&lt;class T&gt;
    void swap(T&amp; x, T&amp; y);
template&lt;class FwdIt1, class FwdIt2&gt;
    FwdIt2 swap_ranges(FwdIt1 first, FwdIt1 last, FwdIt2 x);
template&lt;class FwdIt, class T&gt;
    void replace(FwdIt first, FwdIt last, const T&amp; vold, const T&amp; vnew);
template&lt;class FwdIt, class Pred, class T&gt;
    void replace_if(FwdIt first, FwdIt last, Pred pr, const T&amp; val);
template&lt;class FwdIt, class Gen&gt;
    void generate(FwdIt first, FwdIt last, Gen g);
template&lt;class OutIt, class Pred, class Gen&gt;
    void generate_n(OutIt first, Dist n, Gen g);
template&lt;class FwdIt, class T&gt;
    FwdIt remove(FwdIt first, FwdIt last, const T&amp; val);
template&lt;class FwdIt, class Pred&gt;
    FwdIt remove_if(FwdIt first, FwdIt last, Pred pr);
template&lt;class InIt, class OutIt, class T&gt;
    OutIt remove_copy(InIt first, InIt last, OutIt x, const T&amp; val);
template&lt;class InIt, class OutIt, class Pred&gt;
    OutIt remove_copy_if(InIt first, InIt last, OutIt x, Pred pr);
template&lt;class FwdIt&gt;
    FwdIt unique(FwdIt first, FwdIt last);
template&lt;class FwdIt, class Pred&gt;
    FwdIt unique(FwdIt first, FwdIt last, Pred pr);
template&lt;class BidIt&gt;
    void reverse(BidIt first, BidIt last);
template&lt;class BidIt, class OutIt&gt;
    OutIt reverse_copy(BidIt first, BidIt last, OutIt x);
template&lt;class BidIt, class Pred&gt;
    BidIt partition(BidIt first, BidIt last, Pred pr);
template&lt;class FwdIt, class Pred&gt;
    FwdIt stable_partition(FwdIt first, FwdIt last, Pred pr);
template&lt;class RanIt&gt;
    void sort(RanIt first, RanIt last);
template&lt;class RanIt, class Pred&gt;
    void sort(RanIt first, RanIt last, Pred pr);
template&lt;class BidIt&gt;
    void stable_sort(BidIt first, BidIt last);
template&lt;class BidIt, class Pred&gt;
    void stable_sort(BidIt first, BidIt last, Pred pr);
template&lt;class RanIt&gt;
    void nth_element(RanIt first, RanIt nth, RanIt last);
template&lt;class FwdIt, class T&gt;
    bool binary_search(FwdIt first, FwdIt last, const T&amp; val);
template&lt;class FwdIt, class T, class Pred&gt;
    bool binary_search(FwdIt first, FwdIt last, const T&amp; val, Pred pr);
template&lt;class InIt1, class InIt2, class OutIt&gt;
    OutIt merge(InIt1 first1, InIt1 last1, InIt2 first2, InIt2 last2, OutIt x);
template&lt;class InIt1, class InIt2, class OutIt, class Pred&gt;
    OutIt merge(InIt1 first1, InIt1 last1, InIt2 first2, InIt2 last2, OutIt x, Pred pr);
template&lt;class T&gt;
    const T&amp; max(const T&amp; x, const T&amp; y);
template&lt;class T, class Pred&gt;
    const T&amp; max(const T&amp; x, const T&amp; y, Pred pr);
template&lt;class T&gt;
    const T&amp; min(const T&amp; x, const T&amp; y);
template&lt;class T, class Pred&gt;
    const T&amp; min(const T&amp; x, const T&amp; y, Pred pr);
}</code></pre>
          `,
        },
        {
          type: 'html',
          html: `
            <h3 id="sec-app-h6">字符串 string</h3>
            <p>在做比赛题目的时候，不免碰到关于字符串的问题。C++ 中的字符串有两种，一种就是来自 C 语言的 C 串，它其实就是以 \\0 作为结束符的字符数组，对其的操作也只有 string.h 中的 strlen、strcat、strcmp 等函数；另一个就是 STL 中定义的功能比较强大的字符串类 string，包含在头文件 <code>&lt;string&gt;</code> 中。它内部实现了几乎所有对字符串进行的操作，采取的是顺序表存储，同时也可以方便地实现 C 串与 string 类之间的转换。string 实际上可以看作字符数组，可以直接加下标取出每个字符。</p>
            <p>关于字符串的处理，输入输出是经常碰到的问题。如果输入的字符串是以空格、回车、制表符作为结束符的，可以用标准输入输出流处理（cin/cout）：</p>
            <pre class="code"><code>#include &lt;string&gt;
#include &lt;iostream&gt;
using namespace std;
string str;
char ch[20];
int main()
{
    cin &gt;&gt; str;
    cout &lt;&lt; str &lt;&lt; endl;
    cin &gt;&gt; ch;
    cout &lt;&lt; ch;
    return 0;
}</code></pre>
            <p>如果希望输入的字符串包含空格等字符，则必须使用另外的处理方式，如 <code>cin.getline(ch);</code>、<code>getline(cin, str);</code>。特别需要注意的是当输入一个其他类型的数（如整数）后要用 getline 输入字符串，则必须使用 <code>cin.ignore();</code> 来忽略流中的回车符：</p>
            <pre class="code"><code>int testcase;
string str;
cin &gt;&gt; testcase;
cin.ignore();
getline(cin, str);</code></pre>
            <p>string 类常用的函数有：append、begin、compare、const_pointer、empty、end、erase、find、find_first_not_of、find_first_of、find_last_not_of、find_last_of、insert、length、operator+=、operator=、operator[]、replace、reserve、resize、size、substr、swap。</p>
          `,
        },
        {
          type: 'html',
          html: `
            <h3 id="sec-app-h7">迭代器接口与流迭代器</h3>
            <p>标题中的 Iterator 这个单词许多字典里可能查不到，计算机词汇中将它译为迭代器。所谓迭代器，它的很多性质是和 C++/C 中的指针相似，甚至可以说指针就是一种 C++ 编译器里内置的迭代器。在学习的过程中，可以将它与指针对照起来理解。</p>
            <p>接口描述（<code>&lt;iterator&gt;</code> 中定义了五种迭代器类型标签、iterator 类模板、iterator_traits、反向/插入/流迭代器等）：</p>
            <pre class="code"><code>namespace std
{
    struct input_iterator_tag;
    struct output_iterator_tag;
    struct forward_iterator_tag;
    struct bidirectional_iterator_tag;
    struct random_access_iterator_tag;

    //TEMPLATE CLASS
    template &lt;class C, class T, class Dist, class Pt, class Rt&gt;
        struct iterator;
    template &lt;class It&gt;
        struct iterator_traits;
    template &lt;class T&gt;
        struct iterator_traits&lt;T *&gt;;
    template &lt;class RanIt&gt;
        class reverse_iterator;
    template &lt;class Cont&gt;
        class back_insert_iterator;
    template &lt;class Cont&gt;
        class front_insert_iterator;
    template &lt;class Cont&gt;
        class insert_iterator;
    template &lt;class U, class E, class T, class Dist&gt;
        class istream_iterator;
    template &lt;class U, class E, class T&gt;
        class ostream_iterator;
    template &lt;class E, class T&gt;
        class istreambuf_iterator;
    template &lt;class E, class T&gt;
        class ostreambuf_iterator;
}</code></pre>
            <p><strong>iterator_traits</strong>——顾名思义，iterator_traits 就是迭代器类型提取器，也就是说由这些类，我们可以从迭代器中提取出我们所需的类型。这里用到了部分特化的知识，涉及 STL 的实现，具体使用时不大会感觉到它的存在：</p>
            <pre class="code"><code>template &lt;class It&gt;
struct iterator_traits {
    typedef typename It::iterator_category iterator_category;
    typedef typename It::value_type        value_type;
    typedef typename It::difference_type   difference_type;
    typedef typename It::pointer           pointer;
    typedef typename It::reference         reference;
};
template &lt;class T&gt;
struct iterator_traits&lt;T *&gt; {
    typedef random_access_iterator_tag iterator_category;
    typedef T value_type;
    typedef ptrdiff_t difference_type;
    typedef T * pointer;
    typedef T &amp; reference;
};
template &lt;class T&gt;
struct iterator_traits&lt;const T *&gt; {
    typedef random_access_iterator_tag iterator_category;
    typedef T value_type;
    typedef ptrdiff_t difference_type;
    typedef const T * pointer;
    typedef const T &amp; reference;
};</code></pre>
            <p><strong>迭代器类型标签</strong>——输出迭代器类型标签对应这样的循环语句：</p>
            <pre class="code"><code>for (; &lt;not done&gt;; ++next)
    *next = &lt;whatever&gt;;</code></pre>
            <p>一个标准的输出迭代器至少需要定义下面的操作：<code>*next = &lt;whatever&gt;</code>（将值赋给序列中将要产生的一个元素）、<code>++next</code>（改变 next 的值，使之指向序列中的下一个元素）。输入、前向、双向、随机存取迭代器类型标签（input / forward / bidirectional / random_access_iterator_tag）只是用来标识迭代器的类型。</p>
            <p><strong>advance 与 distance</strong>——<code>advance(first, N)</code>// add N to X；<code>N = distance(first, last)</code>// returns the distance from first to last。</p>
            <p><strong>reverse_iterator</strong>——对于一个给定的类型为 RanIt 的随机存取迭代器，我们可以定义一个与之相关的反转型迭代器，并用其来逆向存取序列。</p>
            <p><strong>插入型迭代器</strong>——back_insert_iterator（向被控序列末端插入元素）、front_insert_iterator（向被控序列前端以逆序的方式插入元素）、insert_iterator（把反转的序列添加到容器的前端）：</p>
            <pre class="code"><code>typedef back_insert_iterator&lt;Cont&gt; OutIt;
typedef front_insert_iterator&lt;Cont&gt; OutIt;
typedef insert_iterator&lt;Cont&gt; OutIt;</code></pre>
            <p><strong>istream_iterator</strong>——定义一个用于读入流的流迭代器：</p>
            <pre class="code"><code>typedef istream_iterator&lt;T, char, char_traits&lt;char&gt; &gt; InIt;
// 一般使用中 STL 自行提供后面两个模板特化的参数，只需写：
typedef istream_iterator&lt;char&gt; InIt;

// 这样一个流迭代器 InIt 可以很好地与 istream 对象协同工作。再定义
InIt first(cin), last;
// first 就成为标准输入流的迭代器，而 last 则被 istream_iterator
// 的默认构造函数，初始化为流的结束符。之后我们可以这样做
while (first != last)
    &lt;process&gt;(*first++);</code></pre>
            <p><strong>ostream_iterator</strong>——仿照对输入迭代器的介绍，这里只给一些代码和注释：</p>
            <pre class="code"><code>typedef ostream_iterator&lt;T&gt; OutIt;
OutIt next(cout, " "); //space 是分隔符
while (&lt;not done&gt;)
{
    T x = &lt;next value&gt;;
    *next++ = x;
}</code></pre>
            <p>istreambuf_iterator 与 ostreambuf_iterator 这里就不介绍了，只列出。使用 <code>&lt;iterator&gt;</code>——由于 iterator 和容器结合紧密，请读者自己体会其中含义：</p>
            <pre class="code"><code>#include &lt;iostream&gt;
#include &lt;vector&gt;

using namespace std;
vector&lt;int&gt; myV;
int main()
{
    for (int i = 0; i &lt; 10; i++)
    {
        myV.push_back(i);
    }
    vector&lt;int&gt;::iterator it;
    for (it = myV.begin(); it != myV.end(); it++)
    {
        cout &lt;&lt; (*it) &lt;&lt; ' ';
    }
    return 0;
}</code></pre>
          `,
        },
        {
          type: 'html',
          html: `
            <h3 id="sec-app-h8">应用题：字符串反序输出</h3>
            <p><strong>题目</strong>：对于输入给定的字符串将其反序输出。输入是先输入一个整数代表字符串的行数，然后是字符串（ZJU 的 1295 题）。</p>
            <div class="code-pair">
              <div class="code-col">
                <p class="code-h">Sample Input</p>
                <pre class="code"><code>3
Frankly, I don't think we'll make much
money out of this scheme.
madam I'm adam</code></pre>
              </div>
              <div class="code-col">
                <p class="code-h">Sample Output</p>
                <pre class="code"><code>hcum ekam ll'ew kniht t'nod I ,ylknarF
.emehcs siht fo tuo yenom
mada m'I madam</code></pre>
              </div>
            </div>
            <p>参考代码如下：</p>
            <pre class="code"><code>#include&lt;iostream&gt;
#include&lt;string&gt;
using namespace std;
void rever(string s)
{
    string temp;
    int i;
    for (i = s.size() - 1; i &gt;= 0; i--)
        temp.append(1, s[i]);
    for (i = 0; i &lt; temp.size(); i++)
        cout &lt;&lt; temp[i];
    cout &lt;&lt; endl;
}
int main()
{
    string instr;
    int strno = 0, i;
    cin &gt;&gt; strno;
    char enter = cin.get();
    for (i = 0; i &lt; strno; i++)
    {
        getline(cin, instr);
        rever(instr);
    }
    return 0;
}</code></pre>
          `,
        },
      ],
    },
  ],
};

export default deck;
