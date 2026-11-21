/* 第十二章 面向对象程序设计基础 —— 逐节转录自 课件/PPT/第十二章 面向对象程序设计基础.ppt（32 页）；
   两种多态性比较表按课件原表转录。 */
import type { PdChapter } from './types';

const ch12: PdChapter = {
  id: 'ch12',
  no: '第12章',
  title: '面向对象程序设计基础',
  subtitle: '类与对象 · 构造与析构 · 组合 / 静态成员 / 友元 · 继承与多态 · 运算符重载 · 模板',
  lede:
    '<p>第十二章 C++面向对象程序设计。面向对象的基本概念——<strong>对象</strong>：任何事物、规则等构成的独立系统，体现的是整体性；对象表现的特征是：属性（数据）、行为（处理）；<strong>类</strong>：相同属性和行为对象的抽象；<strong>方法和消息</strong>：实现行为的过程称方法，对象之间的通讯称为消息，消息中反映对对象方法的调用。面向对象的特征：<strong>抽象、封装、继承、多态</strong>。</p>',
  toc: [
    { id: 'sec-pd12-class', text: '12.2 类（class）和对象（object）', level: 2 },
    { id: 'sec-pd12-ctor', text: '12.3 构造函数及析构函数', level: 2 },
    { id: 'sec-pd12-comb', text: '12.4 类的组合', level: 2 },
    { id: 'sec-pd12-static', text: '12.5 静态成员', level: 2 },
    { id: 'sec-pd12-friend', text: '12.6 友元', level: 2 },
    { id: 'sec-pd12-ptr', text: '12.7 对象指针', level: 2 },
    { id: 'sec-pd12-inherit', text: '12.8 继承与派生', level: 2 },
    { id: 'sec-pd12-poly', text: '12.9 多态', level: 2 },
    { id: 'sec-pd12-op', text: '12.10 运算符重载', level: 2 },
    { id: 'sec-pd12-tpl', text: '12.12 模板', level: 2 },
  ],
  sections: [
    {
      id: 'sec-pd12-class',
      heading: '12.2 类（class）和对象（object）',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>⒈类的定义</strong>：</p>
            <pre class="code"><code>class 类名称{
        private:
                私有数据和函数
        public:
                公有数据和函数
        protected:
                保护型数据和函数
     };</code></pre>
            <p>实例（CHAP12EX1）：</p>
            <pre class="code"><code>class Clock               // 时钟类的定义
{
public:                   // 外部接口，公有成员函数
  void SetTime(int NewH=0, int NewM=0, int NewS=0);
  void ShowTime();
private:                  // 私有数据成员
  int Hour, Minute, Second;
};</code></pre>
            <p>说明：⑴类是用户定义的抽象类型；⑵类中包含了数据和函数（属性、方法）；⑶ class 为关键字，后跟类名；⑷访问控制属性：公有 public、私有 private、保护 protected（派生类可用）。</p>
            <p><strong>⒉类的成员函数定义</strong>——成员函数的定义：</p>
            <pre class="code"><code>返回值类型  类名::函数成员名（参数表）
{
         函数体
}                        /* 说明：可带默认的形参值 */</code></pre>
            <pre class="code"><code>void clock::SetTime(int newH=0, int newM=0, int newS=0){
       Hour = newH;
        Minute = newM;
        Second = newS;
}</code></pre>
            <p><strong>⒊内联成员函数</strong>——隐式声明：将函数体直接放入类的主体内；显式声明：用关键字 inline 声明：</p>
            <pre class="code"><code>class Test{
private:
     int x, y;
public:
    void input(){cin&gt;&gt;x&gt;&gt;y;}       /* 隐式声明 */
    void output();
}

inline void Test :: output( )       /* 显式声明 */
{        cout&lt;&lt;"面积为："&lt;&lt;x*y&lt;&lt;endl;
}</code></pre>
            <p><strong>⒋对象</strong>——对象是类的实例，通过类说明对象变量，将开辟内存空间，并为每个成员分配相应的内存单元。</p>
            <ul>
              <li>⑴说明：<code>类名 对象名</code>，如 <code>Test a1;</code>——给对象一个标识符、给对象开辟内存空间、将对象中的数据成员初始化；</li>
              <li>⑵引用：<code>对象名.公有成员数据（或公有成员方法）</code>，如 <code>a1.input();</code></li>
            </ul>
            <p><strong>⒌类成员的访问控制</strong>——公有成员：声明了类的外部接口。私有成员：只允许本类成员函数访问。保护成员：和私有类型的性质相似，用于继承（派生）类（CHAP12EX2）。</p>`,
        },
      ],
    },
    {
      id: 'sec-pd12-ctor',
      heading: '12.3 构造函数及析构函数',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>⒈构造函数</strong>——定义：和类名同名的成员函数称为构造函数。作用：给对象进行初始化。说明：</p>
            <ul>
              <li>不能指定返回类型（void 也不行）；</li>
              <li>一个类中可定义多个构造函数，带参数或不带参数的；</li>
              <li>没有定义构造函数，编译器会自动建立一个无参构造函数；</li>
              <li>对象创建时被自动调用（CHAP12EX3）。</li>
            </ul>
            <p><strong>⒉拷贝构造函数</strong>——定义：<code>X::X(X &amp;)</code> 的构造函数，称为拷贝构造函数。作用：用一个已经存在的对象去初始化一个新的同类的对象。说明：用拷贝构造函数时，普通构造函数不被调用；默认拷贝构造函数的功能是把初始值对象的每个数据成员的值都复制到新建立的对象中。调用时间：以一个对象初始化类的另一个对象；对象作为函数参数；函数返回一个对象（编译器处理不同）（CHAP12EX4、CHAP12CF1）。</p>
            <p><strong>⒊析构函数</strong>——定义：与类同名，之前冠以 ~ 符号，以区别于构造函数。作用：清理工作，如释放由构造函数分配的内存等。说明：</p>
            <ul>
              <li>⑴在对象撤消时，被自动调用；</li>
              <li>⑵没有返回值；</li>
              <li>⑶不接受任何参数；</li>
              <li>⑷无显式说明时，系统会自动生成一个不做任何事的默认析构函数，即函数体为空（CHAP12EX5）。</li>
            </ul>`,
        },
      ],
    },
    {
      id: 'sec-pd12-comb',
      heading: '12.4 类的组合',
      blocks: [
        {
          type: 'html',
          html: `
            <p>一个类内嵌入其他类的对象作为成员的情况，称为<strong>类的组合</strong>。组合类构造函数的形式：</p>
            <pre class="code"><code>X::X（形参表）：成员1（参数表），成员2（参数表），…{
       类的初始化
}</code></pre>
            <p>说明：</p>
            <ol>
              <li>当建立 X 类对象时，先调用内嵌成员的构造函数，后执行 X 类的构造函数；</li>
              <li>对象成员的构造函数被调用的顺序取决于其在类中被说明的顺序，而与它们在成员初始化列表中给出的顺序无关；</li>
              <li>析构函数的调用顺序与构造函数正好相反。</li>
            </ol>
            <p>（CHAP12EX9、CHAP12EXA）</p>`,
        },
      ],
    },
    {
      id: 'sec-pd12-static',
      heading: '12.5 静态成员',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>⒈静态属性（数据）</strong>——用 static 关键字声明的数据成员；每个类只有一个拷贝（即一个存储单元）；该数据成员为该类的所有对象所共有。作用：解决同一个类的不同对象之间的数据和函数共享的问题。说明：</p>
            <ol>
              <li>静态数据成员具有静态生存期；</li>
              <li>一般用法是：类名::标识符；</li>
              <li>在类的声明中仅仅对静态数据成员进行引用性说明；</li>
              <li>在文件作用域的某个地方使用类名限定进行定义性说明。</li>
            </ol>
            <p>（CHAP12EXD）</p>
            <p><strong>⒉静态方法</strong>——定义：使用 static 声明的函数成员，为一个类的全部对象所共享。说明：</p>
            <ol>
              <li>对于公有的静态成员函数，可以通过类名或对象名来调用；而一般的非静态成员函数只能通过对象名来调用；</li>
              <li>静态成员函数必须通过对象名来访问非静态数据成员。</li>
            </ol>
            <p>（CHAP12EXE）</p>`,
        },
      ],
    },
    {
      id: 'sec-pd12-friend',
      heading: '12.6 友元',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>⒈基本概念</strong>——友元可以访问该类的所有数据成员（私有、保护成员），友元可以是普通函数、其他类的成员函数，也可以是其他类。友元在类之间、类与普通函数之间共享了内部封装的数据，但对类的封装性有一定的破坏。</p>
            <p><strong>⒉友元方法（函数）</strong>——定义：友元是普通函数或其他类的成员方法，则称为友元方法（函数）。形式：</p>
            <pre class="code"><code>friend &lt;类型&gt; &lt;友元函数名&gt;（&lt;参数&gt;）;
friend &lt;类型&gt; &lt;类名&gt;：：&lt;友元函数名&gt;（&lt;参数&gt;）;</code></pre>
            <p>（CHAP12EXF）</p>
            <p><strong>⒊友元类</strong>——定义：友元是一个类，则称为友元类。形式：</p>
            <pre class="code"><code>friend  class &lt;友元类名&gt;;</code></pre>
            <p>说明：友元类的所有成员函数都是友元函数（CHAP12EXG）。</p>`,
        },
      ],
    },
    {
      id: 'sec-pd12-ptr',
      heading: '12.7 对象指针',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>⒈对象指针的基本概念</strong>——对象指针指向的是一个对象在内存中的首地址。声明形式：<code>类名 *对象指针名;</code> 引用形式：<code>对象指针名-&gt;成员名</code>（CHAP12EXH）。</p>
            <p><strong>⒉ this 指针</strong>——定义：this 指针是每个对象中隐藏的指针。说明：this 指针是默认的，当一个对象生成后，这个对象的 this 指针就指向内存中保存该对象数据的存储空间的首地址。举例：</p>
            <pre class="code"><code>int GetX( ){return this-&gt;x;}
this-&gt;x = xx;
this-&gt;y = yy;</code></pre>`,
        },
      ],
    },
    {
      id: 'sec-pd12-inherit',
      heading: '12.8 继承与派生',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>⒈基本概念</strong>——派生类（子类）：从已存在的类派生的新类；基类（父类）：用于派生新类的类；单继承：从一个基类派生的继承；多重继承：从多个基类派生的继承。</p>
            <p><strong>⒉派生类的声明（单一继承）</strong>——形式：</p>
            <pre class="code"><code>class  派生类名：访问控制  基类名{
    private:
        成员说明；
    public:
        成员说明；
    };</code></pre>
            <p>（CHAP12EX6）说明：⑴派生类从基类处继承了所有的成员，但<strong>不能直接访问基类的 private 成员</strong>；⑵访问控制：public 或 private；⑶访问控制缺省时：基类为结构时缺省为 public；基类为类时缺省为 private。</p>
            <p><strong>访问控制说明</strong>：</p>
            <ul>
              <li><strong>公有派生</strong>：基类的公有成员和保护成员的访问属性在派生类中不变，而基类的私有成员不可访问；</li>
              <li><strong>私有派生</strong>：基类中的公有和保护成员都以私有成员身份出现在派生类中，基类的私有成员仍不可访问。在实际应用中私有派生几乎不用；</li>
              <li><strong>保护继承</strong>：访问权限为 protected 的类成员。说明：①如果某类 A 中含有保护成员，对于建立 A 类对象的模块来讲，保护成员和该类的私有成员一样是不可访问的；②如果 A 类派生出 B 类，则对于 B 类的成员函数来讲，可访问 A 类中的保护成员，而用 A 类定义的对象或用 B 类定义的对象都不能直接引用保护成员。</li>
            </ul>
            <p>（CHAP12EXP）</p>
            <p><strong>⒊多重继承</strong>——形式：</p>
            <pre class="code"><code>class  派生类名：访问控制  类名2，访问控制 类名3...{
    private:
        成员说明；
    public:
        成员说明；
    };</code></pre>
            <p>（CHAP12EX7）</p>`,
        },
      ],
    },
    {
      id: 'sec-pd12-poly',
      heading: '12.9 多态',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>⒈基本概念</strong>——多态性：用同一名字定义功能相近但在实现上又略有差异的一组函数。多态性的实现：通过联编。<strong>联编</strong>：把一个标识符名和一个存储地址联系在一起的过程，或将一个函数调用链接上相应的函数体代码的过程。<strong>静态联编</strong>：联编工作在编译连接阶段完成的情况，又称编译时的多态性；<strong>动态联编</strong>：联编工作在程序运行阶段完成的情况，又称运行时的多态性。</p>
            <p><strong>两种多态性比较</strong>：</p>
            <table class="tbl">
              <thead><tr><th></th><th>形式</th><th>联编方式</th><th>函数原型</th><th>决策依据</th><th>优点</th></tr></thead>
              <tbody>
                <tr><td>编译时多态性</td><td>函数重载</td><td>静态联编</td><td>不同</td><td>参数类型及数目</td><td>速度快</td></tr>
                <tr><td>运行时多态性</td><td>虚函数</td><td>动态联编</td><td>相同</td><td>运行时指针的指向或引用</td><td>高灵活性、抽象性和可扩充性</td></tr>
              </tbody>
            </table>
            <p><strong>⒉虚函数</strong>——一般虚函数成员定义：用关键字 virtual 修饰的基类中的 protected 或 public 成员函数，并在派生类中重新定义，以形成不同的实现版本。形式：</p>
            <pre class="code"><code>virtual 函数类型  函数名（形参表）
{
      函数体
}</code></pre>
            <p>（CHAP12EX8）虚函数说明：通过一个基类类型的指针（或引用）调用一个虚函数时，系统进行动态联编，即调用指针（或引用）所指向的实际对象的成员函数；在派生类中重新定义的基类虚函数（名称、参数及返回值类型必须一致）会自动成为虚函数，即无须再加 virtual 关键字。如 point 中的 area( ) 为虚函数，则 circle 中的 area( ) 自然也为虚函数。</p>`,
        },
      ],
    },
    {
      id: 'sec-pd12-op',
      heading: '12.10 运算符重载',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>⒈引例</strong>——任何运算都是通过函数来实现的，故运算符重载其实就是函数重载，只不过需加关键字 operator（CHAP12EXI）。</p>
            <p><strong>⒉概述</strong>——重载规则：</p>
            <ol>
              <li>除了 <code>.</code>、<code>*</code>、<code>::</code>、<code>sizeof</code>、<code>?</code> 这五个运算符不能重载外，其余的 C++ 运算符都可以重载；</li>
              <li>重载之后，运算符的优先级和结合性不变；</li>
              <li>重载的功能应与原有功能类似，不能改变原运算符的操作对象个数。</li>
            </ol>
            <p><strong>重载为类的成员函数（类运算符）</strong>——形式：</p>
            <pre class="code"><code>类型  operator   运算符（形参表）
{                        函数体
    }</code></pre>
            <p>（CHAP12EXJ）</p>
            <p><strong>重载为类的友元函数（友元运算符）</strong>——形式：</p>
            <pre class="code"><code>friend  类型  operator  运算符（形参表）
{                        函数体
    }</code></pre>
            <p>（CHAP12EXK）</p>`,
        },
      ],
    },
    {
      id: 'sec-pd12-tpl',
      heading: '12.12 模板',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>⒈函数模板</strong>——定义：用来创建一个通用功能的函数，以支持多种不同形参，简化重载函数的函数体设计。形式：</p>
            <pre class="code"><code>template &lt;typename  T&gt;
        函数定义</code></pre>
            <p>（CHAP12EXB）</p>
            <p><strong>⒉类模板</strong>——定义：将数据类型从类中分离出来，允许单个类处理通用的数据类型 T。声明形式：</p>
            <pre class="code"><code>template &lt; class T&gt;</code></pre>
            <p>建对象的形式：</p>
            <pre class="code"><code>类名&lt;具体类型&gt;    对象1，对象2，…对象 n；</code></pre>
            <p>（CHAP12EXC）说明：</p>
            <ol>
              <li>对象是类的实例，类又是类模板的实例，一个模板就是一个抽象的类；</li>
              <li>模板类的成员函数必须是函数模板；</li>
              <li>类模板与函数模板的区别：对由函数模板生成的模板函数的调用是由编译器自动决定的，而对类模板的解释是由程序员自行指明的。</li>
            </ol>`,
        },
      ],
    },
  ],
};

export default ch12;
