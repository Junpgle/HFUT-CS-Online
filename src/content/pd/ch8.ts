/* 第八章 位运算 —— 逐节转录自 课件/PPT/第八章 位运算.ppt（21 页）；
   位运算真值表、优先级总表按课件原表转录。 */
import type { PdChapter } from './types';

const ch8: PdChapter = {
  id: 'ch8',
  no: '第8章',
  title: '位运算',
  subtitle: '位运算概念与补码 · 位逻辑运算 · 移位运算 · 位段（位域）',
  lede:
    '<p>数据在计算机中是用二进制表示的；数据运算对数据类型整体进行。<strong>位运算是对数据的每一个二进制位进行的运算</strong>。位运算的对象：整型、字符型。</p>',
  toc: [
    { id: 'sec-pd8-concept', text: '8.1 位运算基本概念', level: 2 },
    { id: 'sec-pd8-logic', text: '8.2 位逻辑运算', level: 2 },
    { id: 'sec-pd8-shift', text: '8.3 移位运算', level: 2 },
    { id: 'sec-pd8-field', text: '8.4 位段（位域）', level: 2 },
  ],
  sections: [
    {
      id: 'sec-pd8-concept',
      heading: '8.1 位运算基本概念',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>⒈位运算的概念</strong>——位运算是对数据的每一个二进制位进行的运算。位运算的对象：整型、字符型。</p>
            <p><strong>⒉计算机中的数据表示</strong></p>
            <p>⑴<strong>无符号整型 unsigned</strong>（char、short、int、long）：无符号数只表示正数和 0，其中的所有二进制位都表示数值。如 unsigned short 表示范围：0 ~ 65535；二进制机器数：0000000000000000 ~ 1111111111111111。</p>
            <pre class="code"><code>#include &lt;STDIO.H&gt;
void main(void)
{        unsigned short a;
    a = 0xffff;
    printf("%u\n", a);
}</code></pre>
            <p>⑵<strong>有符号整数</strong>（char、short、int、long）：有符号数需要表示正数、负数和零，必须采用编码的方式，将符号转化为二进制。编码的方法有原码、补码、反码。<strong>整型数据主要使用补码</strong>。</p>
            <p>计算机系统用有限的二进制位表示数据，是典型的<strong>有模计数系统</strong>。有模计数系统当计数值超过系统的「模」时系统重新开始计数。有模计数系统有如下性质：如时钟从 9 点调整到 6 点有两种方法——9-3=6；9+9=12+6（12 为计数系统的模，3、9 互为补数）。有模计数系统可以将减一个数转化成加该数的补数，也就是可以将减法运算转化成加法运算。</p>
            <p>⑶<strong>补码的编码规则和性质</strong>——计数系统的模：如果用八位二进制表示一个数，系统的模是 2<sup>8</sup>（100000000=00000000）。计数范围、整数编码规则：<code>[X]补 = 2<sup>n</sup> + X</code>。补码的求法：<strong>正数：保持原值，前面补 0；负数：各位取反，最后一位 +1</strong>。如 -2 的补码（8bit）：00000010 → 各位取反 11111101 → 加 1 得 11111110。</p>
            <p><strong>补码的性质</strong>：</p>
            <ul>
              <li>⑴ 0 在补码系统中唯一；</li>
              <li>⑵ [X+Y]补 = [X]补 + [Y]补；[X-Y]补 = [X]补 − [Y]补 = [X]补 + [−Y]补。</li>
            </ul>
            <p>性质⑵说明补码系统有一个优点：在不超出数据表示范围的情况下，可以将减法运算转化成加法运算。如 X=+0001010B，Y=0000101B，求 X-Y？根据补码的性质：[X-Y]补 = [X]补 + [−Y]补，其中 [X]补=00001010，[−Y]补=11111011，相加得 100000101（最高位溢出丢弃）→ 00000101。</p>`,
        },
      ],
    },
    {
      id: 'sec-pd8-logic',
      heading: '8.2 位逻辑运算',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>⒈位逻辑运算符</strong>：</p>
            <table class="tbl">
              <thead><tr><th>运算符</th><th>运算规则</th><th>示例</th></tr></thead>
              <tbody>
                <tr><td>~</td><td>按位取反</td><td>~b</td></tr>
                <tr><td>&amp;</td><td>按位与</td><td>3 &amp; 7</td></tr>
                <tr><td>|</td><td>按位或</td><td>s | 0x00ff</td></tr>
                <tr><td>^</td><td>按位异或</td><td>x^(y+5)</td></tr>
              </tbody>
            </table>
            <p>说明：①运算对象必须是整型或字符型；②~ 为单目运算；③运算按对应位，逐位进行。</p>
            <p>⑴<strong>按位取反 ~</strong>——将数据对象中的每位二进制取反（0 变成 1，1 变成 0）。如 01010101 按位取反后为 10101010。如一个十字路口有一组红绿灯，控制由一个字节型变量的低 2 位完成，b0 为红灯、b1 为绿灯。假如函数 <code>delay1s(int n);</code> 为已延时 1s 函数，程序设计实现红绿灯控制：</p>
            <pre class="code"><code>unsigned char chSignalCtr = 0x01;
while(1)
{        delay1s(30);
    chSignalCtr = ~chSignalCtr;
    delay1s(50);
    chSignalCtr = ~chSignalCtr;
}</code></pre>
            <p>⑵<strong>位与运算 &amp;</strong>——真值表：</p>
            <table class="tbl">
              <thead><tr><th>b1</th><th>b2</th><th>b1&amp;b2</th></tr></thead>
              <tbody>
                <tr><td>0</td><td>0</td><td>0</td></tr>
                <tr><td>0</td><td>1</td><td>0</td></tr>
                <tr><td>1</td><td>0</td><td>0</td></tr>
                <tr><td>1</td><td>1</td><td>1</td></tr>
              </tbody>
            </table>
            <p>作用：<strong>将某些位清零，其余保持不变</strong>。</p>
            <pre class="code"><code>unsigned short a;
scanf("%x", &amp;a);
a = a &amp; 0xfff0;
printf("%x\n", a);
/* 0011 0100 0101 0110
   &amp; 1111 1111 1111 0000
   = 0011 0100 0101 0000 */</code></pre>
            <p>⑶<strong>位或运算 |</strong>——真值表：</p>
            <table class="tbl">
              <thead><tr><th>b1</th><th>b2</th><th>b1|b2</th></tr></thead>
              <tbody>
                <tr><td>0</td><td>0</td><td>0</td></tr>
                <tr><td>0</td><td>1</td><td>1</td></tr>
                <tr><td>1</td><td>0</td><td>1</td></tr>
                <tr><td>1</td><td>1</td><td>1</td></tr>
              </tbody>
            </table>
            <p>作用：<strong>将某些位置 1，其余保持不变</strong>。</p>
            <pre class="code"><code>unsigned short a;
scanf("%x", &amp;a);
a = a | 0xf000;
printf("%x\n", a);
/* 0011 0100 0101 0110
   | 1111 0000 0000 0000
   = 1111 0100 0101 0110 */</code></pre>
            <p>⑷<strong>位异或运算 ^</strong>——真值表：</p>
            <table class="tbl">
              <thead><tr><th>b1</th><th>b2</th><th>b1^b2</th></tr></thead>
              <tbody>
                <tr><td>0</td><td>0</td><td>0</td></tr>
                <tr><td>0</td><td>1</td><td>1</td></tr>
                <tr><td>1</td><td>0</td><td>1</td></tr>
                <tr><td>1</td><td>1</td><td>0</td></tr>
              </tbody>
            </table>
            <p>作用：<strong>将某些位取反，其余保持不变</strong>。</p>
            <pre class="code"><code>unsigned short a;
scanf("%x", &amp;a);
a = a ^ 0x5555;      /* 偶数位取反 */
printf("%x\n", a);
/* 0011 0100 0101 0110
   ^ 0101 0101 0101 0101
   = 0110 0001 0000 0011 */</code></pre>
            <p><strong>⒉位逻辑运算赋值</strong>：</p>
            <table class="tbl">
              <thead><tr><th>运算符</th><th>示例</th><th>运算规则</th></tr></thead>
              <tbody>
                <tr><td>&amp;=</td><td>a &amp;= 7</td><td>a = a &amp; 7</td></tr>
                <tr><td>|=</td><td>s |= 0x00ff</td><td>s = s | 0x00ff</td></tr>
                <tr><td>^=</td><td>x ^= (y+5)</td><td>x = x ^ (y+5)</td></tr>
              </tbody>
            </table>
            <p>说明：①运算对象必须是整型或字符型；②左值只能是变量；③运算取赋值优先级。</p>`,
        },
      ],
    },
    {
      id: 'sec-pd8-shift',
      heading: '8.3 移位运算',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>⒈移位运算符</strong>：</p>
            <table class="tbl">
              <thead><tr><th>运算符</th><th>运算规则</th><th>示例</th></tr></thead>
              <tbody>
                <tr><td>&lt;&lt;</td><td>左移</td><td>b &lt;&lt; 3</td></tr>
                <tr><td>&gt;&gt;</td><td>右移</td><td>s &gt;&gt; (n+3)</td></tr>
              </tbody>
            </table>
            <p>说明：①运算对象必须是整型或字符型；②整体二进制位移动。</p>
            <p>⑴<strong>左移 &lt;&lt;</strong>——格式：<code>a &lt;&lt; n</code>。操作：将 a 中的二进制位左移 n（n 为无符号整数），<strong>高位移出低位补 0</strong>。</p>
            <pre class="code"><code>unsigned short a;
a  = 2;
a = a &lt;&lt; 4;
/* 0000 0000 0000 0010 → 0000 0000 0010 0000 */</code></pre>
            <p>对于无符号数，<strong>左移一位相当于乘 2</strong>。</p>
            <p>⑵<strong>右移 &gt;&gt;</strong>——格式：<code>a &gt;&gt; n</code>。操作：无符号数称为<strong>逻辑右移</strong>，低位移出，高位补 0；有符号数称为<strong>算术右移</strong>，低位移出，符号位自补。<strong>右移一位相当于除 2</strong>。例：通过移位实现循环移位。</p>
            <p><strong>⒉移位运算赋值</strong>：</p>
            <table class="tbl">
              <thead><tr><th>运算符</th><th>示例</th><th>运算规则</th></tr></thead>
              <tbody>
                <tr><td>&lt;&lt;=</td><td>a &lt;&lt;= 7</td><td>a = a &lt;&lt; 7</td></tr>
                <tr><td>&gt;&gt;=</td><td>s &gt;&gt;= (n+3)</td><td>s = s &gt;&gt; (n+3)</td></tr>
              </tbody>
            </table>
            <p>说明：①运算对象必须是整型或字符型；②左值只能是变量；③运算取赋值优先级。</p>
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
            </table>`,
        },
      ],
    },
    {
      id: 'sec-pd8-field',
      heading: '8.4 位段（位域）',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>⒈位段（位域）的基本概念</strong>——以前所有运算的操作的对象都是一个完整的数据，甚至是几个数据的组合。应用中可能只需要使用一位或几位二进制，也只能使用一个变量，比如查找标志 <code>int iFlag;</code> 其实 1 个 bit 就可以。<strong>位段是将一个抽象数据中的不同的二进制位划分为几个不同的区域，每个区域看作不同的数据，代表不同的意义</strong>。通常用在控制领域及嵌入式系统编程。</p>
            <p><strong>⒉位段（位域）的定义</strong>——格式：</p>
            <pre class="code"><code>struct 位段类型
{           type  位段名1: 长度1;
            type  位段名2: 长度2;
        … …
        type  位段名n: 长度n;
}；
struct bitfield1
{        unsigned  int a:4 ;             /* 占 4 位 */
     unsigned  int b:4 ;             /* 占 4 位 */
     unsigned  int c:2 ;             /* 占 2 位 */
}</code></pre>
            <p><strong>⒊位段（位域）的使用</strong>——<code>struct bitfield1 x;</code> 说明变量，<code>x.a = 12;</code>。位段（位域）使用实例：</p>
            <pre class="code"><code>#include&lt;stdio.h&gt;
void main(void)
{
     struct exam1
     {
            short  int a:4 ;
            short  int b:4 ;
            short  int c:2 ;
     }  x;
            x.a = 7;
     x.b = 2;
     x.c = 1;
     printf(" %d %d %d\n", x.a, x.b, x.c);
}</code></pre>`,
        },
      ],
    },
  ],
};

export default ch8;
