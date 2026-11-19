import type { DeckData } from '../types';

/** 讲义 · 专题解析 —— 依据《ICPC 培训讲义》第六章整理 */
const deck: DeckData = {
  id: 'deck6',
  no: '讲义 6',
  title: '讲义 · 专题解析',
  subtitle: '讲义第六章 · 专题解析',
  lede: `
    <p>五个竞赛专题：模拟、密码、字符串处理、图论的一些算法与算法的优化。</p>
  `,
  toc: [
    { id: 'sec-sim', text: '一、模拟', level: 2 },
    { id: 'sec-sim-h1', text: '1. 模拟游戏类：10-20-30', level: 3 },
    { id: 'sec-sim-h2', text: '2. 模拟编码类', level: 3 },
    { id: 'sec-crypto', text: '二、密码', level: 2 },
    { id: 'sec-crypto-h0', text: '密码学概述', level: 3 },
    { id: 'sec-crypto-h1', text: '1. Problem A：Morse Mismatches', level: 3 },
    { id: 'sec-crypto-h2', text: '2. Problem B：Do the Untwist', level: 3 },
    { id: 'sec-crypto-h3', text: '3. Problem C：Substitution Cipher', level: 3 },
    { id: 'sec-string', text: '三、字符串处理', level: 2 },
    { id: 'sec-string-h1', text: '1. PROBLEM A：Word Reversal', level: 3 },
    { id: 'sec-string-h2', text: '2. PROBLEM B：IBM Minus One', level: 3 },
    { id: 'sec-string-h3', text: '3. 字符串处理的应用实例：高精度算法', level: 3 },
    { id: 'sec-graph', text: '四、图论的一些算法', level: 2 },
    { id: 'sec-graph-h0', text: '（一）概述', level: 3 },
    { id: 'sec-graph-h1', text: '（二）若干特殊问题：匹配', level: 3 },
    { id: 'sec-graph-h2', text: '（二）若干特殊问题：网络流', level: 3 },
    { id: 'sec-opt', text: '五、算法的优化', level: 2 },
    { id: 'sec-opt-h1', text: '（一）算法优化的基本思想', level: 3 },
    { id: 'sec-opt-h2', text: '（二）搜索的优化：剪枝', level: 3 },
    { id: 'sec-opt-h3', text: '（三）动态规划的优化', level: 3 },
    { id: 'sec-opt-h4', text: '（四）一些特殊的数据结构', level: 3 },
  ],
  sections: [
    {
      id: 'sec-sim',
      heading: '一、模拟',
      blocks: [
        {
          type: 'html',
          html: `
            <p>模拟类题目，顾名思义，是通过对一些实物（譬如各种游戏，电梯，加密过程等等）的模拟来求解的题目，是一类与实际结合较为紧密的题目，所以在历年竞赛中都会有此类题目。而对此类题目往往没有一个严格的定义，它所涉及的算法很广，因此它和其他类别的题目如密码类，搜索类等都有交集，之所以把它单独作为一类是为了给大家提供一种解题的思考角度。</p>
            <p>模拟类题目都会有一个共同特点：在题目中已给你一个完整的实物模型，譬如游戏规则，电梯的运行规则，加密的过程描述等，你要做的只是如何将它抽象为一个数据模型并将其实现。</p>
            <p>此类题目难易差距很大，容易的一般只要考虑其数据结构的选取，而算法只需按照步骤逐步模拟。而难的就会涉及到多种算法并由于模拟过程的繁杂而导致对边界情况和环节间的相互联系和影响考虑不周，这也是此类题目的一大难点。还有一类题目虽然也可以用模拟的方法求解，但由于其所要求的只是结果而模拟过程一般都极其繁杂，所以我们要尽量用数学的方法甚至公式将其简化求解，在这里就不再详细讨论。</p>
            <h3 id="sec-sim-h1">1. 模拟游戏类：10-20-30</h3>
            <p>下面的题目是一道典型的游戏模拟类题目，牌类是这类题目常涉及到的一个游戏类型，这在往年的竞赛题目中都有体现。在解题的过程中需要注意的是具体的游戏规则及对各种边界情况的考虑。</p>
            <pre class="code"><code>A simple solitaire card game called 10-20-30 uses a standard deck of 52 playing cards in
which suit is irrelevant. The value of a face card (king, queen, jack) is 10. The value
of an ace is one. The value of each of the other cards is the face value of the card
(2, 3, 4, etc.). Cards are dealt from the top of the deck. You begin by dealing out
seven cards, left to right forming seven piles. After playing a card on the rightmost
pile, the next pile upon which you play a card is the leftmost pile.

For each card placed on a pile, check that pile to see if one of the following three
card combinations totals 10, 20, or 30.
    the first two and last one,
    the first one and the last two, or
    the last three cards.
If so, pick up the three cards and place them on the bottom of the deck. For this
problem, always check the pile in the order just described. Collect the cards in the
order they appear on the pile and put them at the bottom of the deck. Picking up three
cards may expose three more cards that can be picked up. If so, pick them up. Continue
until no more sets of three can be picked up from the pile.

For example, suppose a pile contains 5 9 7 3 where the 5 is at the first card of the
pile, and then a 6 is played. The first two cards plus the last card (5 + 9 + 6) sum to
20. The new contents of the pile after picking up those three cards becomes 7 3. Also,
the bottommost card in the deck is now the 6, the card above it is the 9, and the one
above the 9 is the 5.

If a queen were played instead of the six, 5 + 9 + 10 = 24, and 5 + 3 + 10 = 18, but
7 + 3 + 10 = 20, so the last three cards would be picked up, leaving the pile as 5 9.

If a pile contains only three cards when the three sum to 10, 20, or 30, then the pile
"disappears" when the cards are picked up. That is, subsequent play skips over the
position that the now-empty pile occupied. You win if all the piles disappear. You lose
if you are unable to deal a card. It is also possible to have a draw if neither of the
previous two conditions ever occurs.

Write a program that will play games of 10-20-30 given initial card decks as input.

Input
Each input set consists of a sequence of 52 integers separated by spaces and/or ends of
line. The integers represent card values of the initial deck for that game. The first
integer is the top card of the deck. Input is terminated by a single zero (0) following
the last deck.

Output
For each input set, print whether the result of the game is a win, loss, or a draw, and
print the number of times a card is dealt before the game results can be determined.
(A draw occurs as soon as the state of the game is repeated.) Use the format shown in
the "Output for the Sample Input" section.

Sample Input
2 6 5 10 10 4 10 10 10 4 5 10 4 5 10 9 7 6 1 7 6 9 5 3 10 10 4 10 9 2 1
10 1 10 10 10 3 10 9 8 10 8 7 1 2 8 6 7 3 3 8 2
4 3 2 10 8 10 6 8 9 5 8 10 5 3 5 4 6 9 9 1 7 6 3 5 10 10 8 10 9 10 10 7
2 6 10 10 4 10 1 3 10 1 1 10 2 2 10 4 10 7 7 10
10 5 4 3 5 7 10 8 2 3 9 10 8 4 5 1 7 6 7 2 6 9 10 2 3 10 3 4 4 9 10 1 1
10   5 10 10 1 8 10 7 8 10 6 10 10 10 9 6 2 10 10
0

Output for the Sample Input
Win : 66
Loss: 82
Draw: 73</code></pre>
            <p><strong>题目分析及算法</strong>：此题目要求判断游戏结果，可以通过模拟游戏的过程来求解。</p>
            <p><strong>数据结构的选用</strong>：由于每张牌的面值在 1~10 之间，因此可用一个整型描述一张牌。可以选用 8 个（7 组牌和 1 个牌堆）可以删除、添加的整型数组，每个数组的大小是 0~52，但这样较浪费空间。注意到 8 个数组的总大小始终为 52，所以我们可以用一个可删除、添加的整型数组来统一存放这 7 组牌和 1 个牌堆，选用 STL 库中的 vector，在此 vector 中设置三个标记指针——deck：牌堆首指针，first：当前牌组首指针，last：当前牌组尾指针；和一个整型数组 tlt[7] 来记录每组牌的个数。为方便 first、last 的取值，我们用 7 个整数 '0' 来分隔牌组和牌组：</p>
            <pre class="code"><code>Vector:  [第一组] 0 [第二组] 0 …… [第 i 组] 0 …… 0 [牌堆]</code></pre>
            <p><strong>数据结构的基本操作：发牌和收牌</strong>——我们不妨将每组都已发好一张牌作为初始状态，每发一张牌就从 deck 处取出一张牌，将其插入 last 位置，然后 deck 后移一个位置，本组牌数目加 1（tlt[i]++）。发完牌后检查是否有可以收的牌，若三张牌的总和为 10，20，30，则将其抽出，顺序移至牌堆底部即数组底部，然后 last、deck 前移三位，tlt[i]−3。此收牌过程重复进行，直到当前牌组抽不出符合条件的牌为止。</p>
            <p><strong>判断游戏结局</strong>——游戏结局只有三个：</p>
            <ul>
              <li>胜局：当所有牌组消失，即 tlt[7] 均为 0；</li>
              <li>败局：当牌堆为空，即 deck=59 时；</li>
              <li>平局：无论怎样继续，胜败局都不发生，即各牌面状态循环出现。为此，我们记录每个出现的牌面状态，若有两个状态完全相同则为平局。但保留状态多占用内存也多，我们不妨保留近 50 个存入 state[50] 中，每放入一个前面的状态前移，第一个将移出，然后再与前 49 个状态比较，若有相同的则判为平局。</li>
            </ul>
            <p>如果当前状态非前三种，则说明游戏还可继续，继续发牌。我们用 tile 来记录当前牌组序号，其初始值为 0，每发完一张牌 tile+1，当 tile 为 6 时，发完牌后 tile 为 0，此时 last 重新赋值为第一组牌的尾指针。</p>
            <p><strong>注：first、last 的取值问题</strong>——last 始终指向分隔标志 '0'。初始时每组都有一张牌，tile=0，first=0，last=1；每发一张牌，last++；当发下一组牌时，tile+1，last+tlt[tile]+1，first 可由 last 得到即 first=last−tlt[tile]；特殊的，当 tile=0 时，last=tlt[tile]。</p>
            <p>参考代码：略。</p>
          `,
        },
        {
          type: 'html',
          html: `
            <h3 id="sec-sim-h2">2. 模拟编码类</h3>
            <p>下面的这道题就是一道典型非游戏类模拟题，可用模拟编码的过程进行求解。给出的参考解是本人早期做的，基本没有用 STL 库。</p>
            <pre class="code"><code>In Dorothy Sayers' novel "Have His Carcass", Lord Peter Wimsey describes a cryptography
technique that is simple for encoding and decoding, yet relatively hard to crack. Your
job is to implement this technique.

Here's how it works, in Sayers' (edited) words:
    You choose a key-word of six letters or more, none of which recurs. Such as, for
    example, SQUANDER. Then you make a diagram of five squares each way and write the
    key-word in the squares like this:

      +-----+-----+-----+-----+-----+
      |  S  |  Q  |  U  |  A  |  N  |
      +-----+-----+-----+-----+-----+
      |  D  |  E  |  R  |     |     |
      +-----+-----+-----+-----+-----+
      |     |     |     |     |     |
      +-----+-----+-----+-----+-----+
      |     |     |     |     |     |
      +-----+-----+-----+-----+-----+
      |     |     |     |     |     |
      +-----+-----+-----+-----+-----+

    Then you fill up the remaining spaces with the rest of the alphabet in order,
    leaving out the ones you've already got.

    You can't put twenty-six letters in twenty-five spaces, so you pretend you're an
    ancient Roman or a medieval monk and treat I and J as one letter. So you get this:

      +-----+-----+-----+-----+-----+
      |  S  |  Q  |  U  |  A  |  N  |
      +-----+-----+-----+-----+-----+
      |  D  |  E  |  R  |  B  |  C  |
      +-----+-----+-----+-----+-----+
      |  F  |  G  |  H  | IJ  |  K  |
      +-----+-----+-----+-----+-----+
      |  L  |  M  |  O  |  P  |  T  |
      +-----+-----+-----+-----+-----+
      |  V  |  W  |  X  |  Y  |  Z  |
      +-----+-----+-----+-----+-----+

    Now let's take a message -- What shall we say? 'All is known, fly at once' -- that
    classic hardy perennial. We write it down all of a piece and break it into groups
    of two letters, reading from left to right. It won't do to have two of the same
    letters coming together in a pair, so where that happens, we shove in a Q, which
    won't confuse the reader. Now our message runs:

      AL QL IS KN OW NF LY AT ON CE

    If there is an odd letter at the end, we'd add on another Q to square it up. Now
    we take our first group, AL. We see that they come at the corners of a rectangle
    in which the other corners are SP. So we put down SP for the first two letters of
    the coded message. In the same way, QL becomes SM and IS becomes FA.

    Ah, but here's KN. They both come on the same vertical line. In this case you take
    the letter next below each -- TC. Next comes OW, which translates to MX. Going on,
    SK, PV, NP, TU...

    If your first diagonal went from bottom to top, you must take it the same way
    again. ON = TU, NO would be UT.

    CE come on the same horizontal line. In that case, you take the letter to the
    right of each. Since there isn't a letter to the right of C, you start again at
    the beginning of the line, producing DR.

    Your coded message stands now:

      SP SM FA TC MX SK PV NP TU DR

    To make it look pretty and not give the method away, you can break it up into any
    lengths you like, or you can embellish it with punctuation as haphazard:

      S.P. SMFA. TCMXS, KPVM, PT! UDR.

    It's very ingenious. You can't guess it by way of the most frequent letter, because
    you get a different letter for each time, according as it's grouped to the next
    letter. And you can't guess individual words, because you don't know where the
    words begin and end. Is it at all possible to decode it without the key-word?

      "Oh dear, yes," said Wimsey. "Any code ever coded can be decoded with pains and
      patience..."

Input
The input for your program will be a series of keywords and messages to encode,
alternating line-by-line, until the end-of-file flag of 999. Using the above technique,
you are to encode the message, using the word. For example:

  SQUANDER
  ALL IS KNOWN FLY AT ONCE
  JUXTAPOSITION
  THE ROOSTER CROWED AT MIDNIGHT
  999

Input will be in upper case and will contain no punctuation. Unlike Sayers' example,
letters may occur more than once in the key-words, in which case you must ignore all
but the first occurrence of the letter.

Output
Print each message, encrypted, using two letter groups and no punctuation, separated
by a single white space. Separate each message by one blank line.
For the sample input file, the first line of output will be:

      SP SM FA TC MX SK PV NP TU DR

Print an I for IJ.

Notes:
If the last letter is both odd and repeated, treat it as repeated and put the 'Q'
before it, not afterward. That is, ALL becomes ALQL for encoding purposes.
In the unlikely case of two Qs in a row, insert a Z between them. Also, augment
odd-length messages ending with a Q by using a Z. Thus, FAQQAD becomes FAQZQADQ and
HUQ becomes HUQZ for encoding.</code></pre>
            <p><strong>题目简要描述</strong>：要求设计一个编码程序，每个编码需要一个单词造一个 5×5 的表格，然后依据这个表格对给定信息进行编码。编码时将需编码的信息分解成若干段，每段两字母。而编码的过程就是找出表中每两字母所对应的另两字母。</p>
            <ul>
              <li>输入：每个编码 case 分两行：第一行是给定的用来造表的单词；第二行是将要编码的信息。</li>
              <li>输出：只需将对应字母按次序两两输出即可。</li>
            </ul>
            <p><strong>题目分析</strong>：该问题将涉及几种特殊情况：</p>
            <ol>
              <li>在用给定单词构造 5×5 表时：
                <ol>
                  <li>将输入的 i、j 视为一个字母 i，划入同一格；</li>
                  <li>若同一词中一个字母出现两次或更多次，则只考虑第一个，将后面重复的全部忽略。</li>
                </ol>
              </li>
              <li>在将需编码的句子分解成两字母一组时：
                <ol>
                  <li>当连续的两字母相同时，在其中插入 Q；当这两字母是 Q 时，插入 Z；</li>
                  <li>当最后只剩一个字母时，在其后补 Q；当这个字母是 Q 时，补 Z。</li>
                </ol>
              </li>
              <li>在找对应两字母时：
                <ol>
                  <li>若这两字母既不同列也不同行，则每个字母的对应字母与该字母同行与另一字母同列；</li>
                  <li>若两字母同列，则对应字母取该字母下面的，若下面无字母时，取该列的第一个；</li>
                  <li>若两字母同行，则对应字母取该字母后面的，若后面无字母时，取该行第一个。</li>
                </ol>
              </li>
            </ol>
            <p><strong>数据结构的选用及算法</strong>：</p>
            <ol>
              <li><strong>输入并判断</strong>：因给定单词和所需编码的信息都以行分隔，所以用 getline()，它将读到换行符时停止并在每个字符串后加空字符。判断输入字符串为 999 时停止；否则转 2)。</li>
              <li><strong>构造 5×5 表格</strong>并构造 25 个结构体将表格中的字母和其行列标对应：用函数 sheet() 完成。
                <ul>
                  <li>int sign[26]：用 ASCII 将该数组与 26 个字母对应起来，其初始值为 0。按顺序每读入字符串中一字母时若对应的 sign 为 0，则将其放入列 s[25] 中并将 sign 置 1；若为 1，则跳过继续读下一个。在读入字母前，将所有 j 改成 i，则 sign[9] 无意义（可将其在初始时就置为 1）。</li>
                  <li>char s[25]：用来顺序存放 5×5 表格中的字母，当字符串中的字母全部读完后，若还不满 25 则顺序检查 sign，将 sign 为 0 的对应字母放入 s 中填满。</li>
                  <li>char sh[5][5]：将 s[25] 中的字母顺序放入，即得 5×5 表格。</li>
                  <li>struct pin p[26]：在构成 5×5 表格时将每个字母的行列标存入 p 中，用 ASCII 对应每个字母。</li>
                </ul>
              </li>
              <li><strong>将输入信息编码 encode()</strong>：
                <ol>
                  <li>将读入信息两两字母分组（注：t1、t2 分别存放分好组的两字母，be 存放上一组的后一字母）：
                    <ul>
                      <li>先将 be=0，t1、t2 分别输入两字母（注：将输入的 j 全换成 i）；</li>
                      <li>若 t1 不为空字符：当 be==t1 且 be==Q 调用 fin(Z,t1)；be!=Q 则 fin(Q,t1)，然后 t1=t2，输入 t2，be=t1，转上一步；当 t1==t2，t1==Q 调用 fin(t1,Z)，be=Z；t1!=Q 则 fin(t1,Q)，be=Q，然后 t1=t2，输入 t2，转上一步；当 t2 为空字符时，若 t1==Q 调用 fin(t1,Z)，t1!=Q 则 fin(t1,Q)，然后转 3)；其他情况，fin(t1,t2) 并 be=t2，输入 t1、t2，转上一步。若 t1 为空字符，转 3)。</li>
                      <li>输出空行，结束。</li>
                    </ul>
                  </li>
                  <li>找对应字母 fin(char,char)：先将传入两字母的对应行列坐标找到，可直接调用 p[] 存放在 a1,a2,b1,b2 中，再分别按情况处理：
                    <pre class="code"><code>if (a1 == a2)
    out &lt;&lt; sh[a1][(b1+1)%5] &lt;&lt; sh[a1][(b2+1)%5] &lt;&lt; ' ';
if (b1 == b2)
    out &lt;&lt; sh[(a1+1)%5][b1] &lt;&lt; sh[(a2+1)%5][b1] &lt;&lt; ' ';
if (a1 != a2 &amp;&amp; b1 != b2)
    out &lt;&lt; sh[a1][b2] &lt;&lt; sh[a2][b1] &lt;&lt; ' ';</code></pre>
                  </li>
                </ol>
              </li>
            </ol>
            <p>代码参考：略。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-crypto',
      heading: '二、密码',
      blocks: [
        {
          type: 'html',
          html: `
            <h3 id="sec-crypto-h0">密码学概述</h3>
            <p>密码学是研究加密和解密变换的一门科学。通常情况下，人们将可懂的文本称为明文；将明文变换成的不可懂的文本称为密文。把明文变换成密文的过程叫加密；其逆过程，即把密文变换成明文的过程叫解密。明文与密文的相互变换是可逆的变换，并且只存在唯一的、无误差的可逆变换。完成加密和解密的算法称为密码体制。</p>
            <p>在 ICPC 竞赛中，有关密码学的问题是经常出现的，一般只是对文本信息的加密，并且密码体制是给定的。竞赛中的密码问题所需求的内容归纳起来有以下几点：</p>
            <ol>
              <li>加密、解密过程的模拟。此类问题的求解思路很简单，难点在于密码体制相对复杂，所以读懂题目中所描述的加密和解密算法是很关键之所在。</li>
              <li>密文编码。此类问题的关键在于使用合理的数据结构编码并存储。</li>
              <li>密文解密。此类问题是经常出现的。给定了加密的算法，设计合理的解密算法求解明文。我们在这里主要讨论的就是此类问题。</li>
            </ol>
            <p>明文加密的主要方法就是利用已有的字符映射（可以是明文字符间的映射，也可以是明文字符与一串字符的映射）关系，把明文字符替换为映射字符，这样可懂的明文就变成了一组不可读懂的密文，我们把这一过程称为加密，字符映射关系就是加密算法。自然，获得这种映射关系是解密的关键，密码问题是没有其特定的算法的，但往往映射关系的求解涉及到了其它算法，比如字符串处理、图中的一些算法。</p>
            <p>字符映射的方法多种多样，具体到某一题目中又是不同的，所以解密的算法必须特定于具体的题目中。在解密的多种算法中，有的是根据明文和密文之间的关系求解，有的是根据某一数学公式求解，还有的是直接穷举求解。其实密码问题的算法是不固定的，大多依赖于其它问题算法的变形。在此，选出了几道具有代表性的竞赛题目，在求解的过程中介绍一些方法，希望能对读者有一定的启发。</p>
            <h3 id="sec-crypto-h1">1. Problem A：Morse Mismatches</h3>
            <pre class="code"><code>Samuel F. B. Morse is best known for the coding scheme that carries his name. Morse
code is still used in international radio communication. The coding of text using
Morse code is straightforward. Each character (case is insignificant) is translated
to a predefined sequence of dits and dahs (the elements of Morse code). Dits are
represented as periods (".") and dahs are represented as hyphens or minus signs
("-"). Each element is transmitted by sending a signal for some period of time.
A dit is rather short, and a dah is, in perfectly formed code, three times as long
as a dit. A short silent space appears between elements, with a longer space between
characters. A still longer space separates words. This dependence on the spacing
and timing of elements means that Morse code operators sometimes do not send perfect
code. This results in difficulties for the receiving operator, but frequently the
message can be decoded depending on context.

In this problem we consider reception of words in Morse code without spacing between
letters. Without the spacing, it is possible for multiple words to be coded the
same. For example, if the message "dit dit dit" were received, it could be
interpreted as "EEE", "EI", "IE" or "S" based on the coding scheme shown in the
sample input. To decide between these multiple interpretations, we assume a
particular context by expecting each received word to appear in a dictionary.

For this problem your program will read a table giving the encoding of letters and
digits into Morse code, a list of expected words (context), and a sequence of words
encoded in Morse code (morse). These morse words may be flawed. For each morse word,
your program is to determine the matching word from context, if any. If multiple
words from context match morse, or if no word matches perfectly, your program will
display the best matching word and a mismatch indicator.

If a single word from context matches morse perfectly, it will be displayed on a
single line, by itself. If multiple context words match morse perfectly, then select
the matching word with the fewest characters. If this still results in an ambiguous
match, any of these matches may be displayed. If multiple context words exist for
a given morse, the matching word will be displayed followed by an exclamation point
("!").

We assume only a simple case of errors in transmission in which elements may be
either truncated from the end of a morse word or added to the end of a morse word.
When no perfect matches for morse are found, display the word from context that
matches the longest prefix of morse, or has the fewest extra elements beyond those
in morse. If multiple words in context match using these rules, any of these matches
may be displayed. Words that do not match perfectly are displayed with a question
mark ("?") suffixed.

The input data will only contain cases that fall within the preceding rules.

Input
The Morse code table will appear first and consists of lines each containing an
uppercase letter or a digit C, zero or more blanks, and a sequence of no more than
six periods and hyphens giving the Morse code for C. Blanks may precede or follow
the items on the line. A line containing a single asterisk ("*"), possibly preceded
or followed by blanks, terminates the Morse code table. You may assume that there
will be Morse code given for every character that appears in the context section.
The context section appears next, with one word per line, possibly preceded and
followed by blanks. Each word in context will contain no more than ten characters.
No characters other than upper case letters and digits will appear. There will
be at most 100 context words. A line containing only a single asterisk ("*"),
possibly preceded or followed by blanks, terminates the context section.
The remainder of the input contains morse words separated by blanks or end-of-line
characters. A line containing only a single asterisk ("*"), possibly preceded or
followed by blanks, terminates the input. No morse word will have more than eighty
(80) elements.

Output
For each input morse word, display the appropriate matching word from context
followed by an exclamation mark ("!") or question mark ("?") if appropriate. Each
word is to appear on a separate line starting in column one.

Sample Input
A       .-
B       -...
C       -.-.
D       -..
E       .
F       ..-.
G       --.
H       ....
I       ..
J       .---
K       -.-
L       .-..
M       --
N       -.
O       ---
P       .--.
Q       --.-
R       .-.
S       ...
T       -
U       ..-
V       ...-
W       .--
X       -..-
Y       -.--
Z       --..
0       ------
1       .-----
2       ..---
3       ...--
4       ....-
5       .....
6       -....
7       --...
8       ---..
9       ----.
*
AN
EARTHQUAKE
EAT
GOD
HATH
IM
READY
TO
WHAT
WROTH
*
.--.....--   .....--....
--.----..   .--.-.----..
.--.....--   .--.
..-.-.-....--.-..-.--.-.
..--   .-...--..-.--
----        ..--
*

Output for the Sample Output
WHAT
HATH
GOD
WROTH?
WHAT
AN
EARTHQUAKE
IM!
READY
TO
IM!</code></pre>
            <p><strong>题目大意</strong>：莫斯码依靠短暂的停顿来间隔每个字母和每个单词的输入，本题目中的密文是一串没有间隔的莫斯码序列，这样一来，同一个密文可匹配不同的明文；题目假设明文都是出现在给定的字典中的，即使这样，仍可能造成多个匹配或者不匹配。题目要求对于给定的密文，输出唯一匹配的明文；如果有多个明文匹配，则选择包含字母数目最少的，如仍有多个，选择任意一个，输出所选明文并加上 "!" 后缀；如果没有与之匹配的明文，则选择匹配密文前缀个数最多的，如对应多个，选择任意一个，输出所选明文并加上 "?" 后缀。数据的输入、输出格式详见题目。</p>
            <p><strong>解题思路</strong>：在本题中，由于字母之间没有间隔标志，将给出的密文直接译为明文与字典中的单词进行匹配是非常困难的，也是不切合实际的。我们可以把字典中单词都译成莫斯码，然后再将给出的密文与之匹配，这样问题就转化为了字符串的匹配问题。直接用字典中的单词与密文匹配、有多个单词与密文匹配，这两种情况的处理都相对简单。我们着重讨论无单词完全匹配的处理。</p>
            <p>题目要求当无单词与密文完全匹配的时候，选择能匹配密文前缀个数最多的单词。我们可采用这样的算法：将密文每次去掉一个后缀（一位莫斯码，'.' 或 '-'），再与字典中的单词比较，看密文是否为比较单词的前缀，是则找到匹配单词，否则进行循环，直到找到与密文匹配的单词。判断是否为单词前缀的方法为：如果单词莫斯码长度等于当前比较的密文，则比较二者是否相同，是则为真，反之亦反；如长度大于密文，则删除多余后缀，再进行比较。按照题目中的说明，最后肯定是能找到匹配的单词的。</p>
            <p>解题程序源码：略。</p>
            <p><strong>总结</strong>：本题的算法并不复杂，关键在不完全匹配单词的处理问题上，可以把本题归为解密算法的模拟类。</p>
            <h3 id="sec-crypto-h2">2. Problem B：Do the Untwist</h3>
            <pre class="code"><code>Cryptography deals with methods of secret communication that transform a message
(the plaintext) into a disguised form (the ciphertext) so that no one seeing the
ciphertext will be able to figure out the plaintext except the intended recipient.
Transforming the plaintext to the ciphertext is encryption; transforming the
ciphertext to the plaintext is decryption. Twisting is a simple encryption method
that requires that the sender and recipient both agree on a secret key k, which
is a positive integer.

The twisting method uses four arrays: plaintext and ciphertext are arrays of
characters, and plaincode and ciphercode are arrays of integers. All arrays are
of length n, where n is the length of the message to be encrypted. Arrays are origin
zero, so the elements are numbered from 0 to n - 1. For this problem all messages
will contain only lowercase letters, the period, and the underscore (representing
a space).

The message to be encrypted is stored in plaintext. Given a key k, the encryption
method works as follows. First convert the letters in plaintext to integer codes
in plaincode according to the following rule: '_' = 0, 'a' = 1, 'b' = 2, ..., 'z'
= 26, and '.' = 27. Next, convert each code in plaincode to an encrypted code in
ciphercode according to the following formula: for all i from 0 to n - 1,

    ciphercode[i] = (plaincode[ki mod n] - i) mod 28

(Here x mod y is the positive remainder when x is divided by y. For example, 3 mod
7 = 3, 22 mod 8 = 6, and -1 mod 28 = 27. You can use the C '%' operator or Pascal
'mod' operator to compute this as long as you add y if the result is negative.)
Finally, convert the codes in ciphercode back to letters in ciphertext according
to the rule listed above. The final twisted message is in ciphertext. Twisting the
message cat using the key 5 yields the following:

    Array        0    1    2
    plaintext    'c'  'a'  't'
    plaincode    3    1    20
    ciphercode   3    19   27
    ciphertext   'c'  's'  '.'

Your task is to write a program that can untwist messages, i.e., convert the
ciphertext back to the original plaintext given the key k. For example, given the
key 5 and ciphertext 'cs.', your program must output the plaintext 'cat'.

The input file contains one or more test cases, followed by a line containing only
the number 0 that signals the end of the file. Each test case is on a line by itself
and consists of the key k, a space, and then a twisted message containing at least
one and at most 70 characters. The key k will be a positive integer not greater
than 300. For each test case, output the untwisted message on a line by itself.

Note: you can assume that untwisting a message always yields a unique result. (For
those of you with some knowledge of basic number theory or abstract algebra, this
will be the case provided that the greatest common divisor of the key k and length
n is 1, which it will be for all test cases.)

Example input:            Example output:
5 cs.                     cat
101 thqqxw.lui.qswer      this_is_a_secret
3 b_ylxmhzjsys.virpbkr    beware._dogs_barking
0</code></pre>
            <p><strong>题目大意</strong>：题目介绍了一种加密方法，实际上是利用散列函数根据公匙产生字符间的映射，从而将可懂的明文加密为不可懂的密文。题目规定了明文均为小写的字母以及点和下划线，每个明文字符均事先以整数 0-27 固定其编码；将明文（plaintext）和密文（ciphertext）序列的每个字符位分离开，将整个字符序列表示为起始位为 0 的字符数组，那么明文和密文数组均对应一个同长度的整型数组 plaincode 和 ciphercode，存放各个字符的编码。明文和密文间的映射关系均由散列函数决定：<span class="m">ciphercode[i] = (plaincode[ki mod n] − i) mod 28</span>，其中 i 为数组的下标，n 为明文长度，k 为公匙。根据散列函数可将明文每个字符位加密成密文。题目所要求的是解密，即根据已知的散列函数和提供的公匙，将密文译为明文。</p>
            <p><strong>解题思路</strong>：本题的关键在于解密函数的求解。依靠数学方法，不难推出：</p>
            <div class="formula"><p>plaincode[ki mod n] = (ciphercode[i] + i) mod 28</p></div>
            <p>将加密过程的散列函数进行替换，即为解密方法。</p>
            <p>在本题目的程序中使用了数组的动态创建方法，特说明如下：在 C++ 的一般数组声明中，除了指定了其存储元素外，均需要指定其大小（长度），且大小是一个常量，例如 int array[10] 或 const n=10; int array[n] 均正确，而 int array[n]（n 为变量）是错误的。事实上可采用变量指定数组大小，数组的声明和创建方法如下（以整型为例）：</p>
            <pre class="code"><code>int n = 10;
int* array = new int[n];</code></pre>
            <p>用此方法创建的数组和一般的数组使用方法是一样的。但需要特别注意的是，当所创建数组的生命周期结束后，要对数组析构，收回所占用的内存空间：<code>delete []array;</code></p>
            <p>解题程序源码：略。</p>
            <p><strong>总结</strong>：本题目主要是解密散列函数的求解，对于编程技巧要求不高。此类利用散列函数进行字符映射的题目，一般均能求解出其逆映射的函数，且散列函数是双射的。在本题目的求解程序中使用了一维数组的动态创建方法，再介绍一下二维数组的动态创建方法：数组的动态创建，实际上是人为地为其分配内存空间，所以分配后应注意收回。二维数组的创建是以一维数组为基础的，是为一维数组中的每个元素再分配空间。假设我们创建二维数组 array[7][10]：</p>
            <pre class="code"><code>int row = 7;
int col = 10;
int** array = new int*[row];
for (int i = 0; i &lt; row; i++)
    array[i] = new int[col];
// 创建完毕，生命周期结束后进行析构：
for (int i = 0; i &lt; row; i++)
    delete []array[i];
delete []array;</code></pre>
            <p>我们还可以为每行指定不同的列数，就不再举例了。在函数中将一维、二维数组当作参数使用时，可分别用指针和二级指针声明。例：<code>void functional(int* array, int** array)</code>，这样，二维数组可当作参数传递了。</p>
            <h3 id="sec-crypto-h3">3. Problem C：Substitution Cipher</h3>
            <pre class="code"><code>Antique Comedians of Malidinesia would like to play a new discovered comedy of
Aristofanes. Putting it on a stage should be a big surprise for the audience so
all the preparations must be kept absolutely secret. The ACM director suspects one
of his competitors of reading his correspondence. To prevent other companies from
revealing his secret, he decided to use a substitution cipher in all the letters
mentioning the new play.

Substitution cipher is defined by a substitution table assigning each character
of the substitution alphabet another character of the same alphabet. The assignment
is a bijection (to each character exactly one character is assigned -- not necessary
different). The director is afraid of disclosing the substitution table and
therefore he changes it frequently. After each change he chooses a few words from
a dictionary by random, encrypts them and sends them together with an encrypted
message. The plain (i.e. non-encrypted) words are sent by a secure channel, not
by mail. The recipient of the message can then compare plain and encrypted words
and create a new substitution table.

Unfortunately, one of the ACM cipher specialists have found that this system is
sometimes insecure. Some messages can be decrypted by the rival company even without
knowing the plain words. The reason is that when the director chooses the words
from the dictionary and encrypts them, he never changes their order (the words in
the dictionary are lexicographically sorted). String a1a2 ... ap is
lexicografically smaller than b1b2 ... bq if there exists an integer i, i &lt;= p,
i &lt;= q, such that aj=bj for each j, 1 &lt;= j &lt; i and ai &lt; bi.

The director is interested in which of his messages could be read by the rival
company. You are to write a program to determine that.

Input Specification
The input consists of N cases. The first line of the input contains only positive
integer N. Then follow the cases. The first line of each case contains only two
positive integers A, 1 &lt;= A &lt;= 26, and K, separated by space. A determines the size
of the substitution alphabet (the substitution alphabet consists of the first A
lowercase letters of the english alphabet (a--z)) and K is the number of encrypted
words. The plain words contain only the letters of the substitution alphabet. The
plain message can contain any symbol, but only the letters of the substitution
alphabet are encrypted. Then follow K lines, each containing exactly one encrypted
word. At the next line is encrypted message.

Output Specification
For each case, print exactly one line. If it is possible to decrypt the message
uniquely, print the decrypted message. Otherwise, print the sentence
'Message cannot be decrypted.'.

Sample Input                Output for the Sample Input
2                           abcde
5 6                         Message cannot be decrypted.
cebdbac
cac
ecd
dca
aba
bac
cedab
4 4
cca
cad
aac
bca
bdac</code></pre>
            <p><strong>题目大意</strong>：存在一个字符映射表，使得明文和密文字符是双射的。从字典中按单词的小写拼写次序顺序随机选出一些单词，并译为密文提供。在有些情况下，即使没有字符映射表，根据提供的有序密文我们仍可知道字符间的映射关系：字符串 a₁a₂…a<sub>p</sub> 字典序小于 b₁b₂…b<sub>q</sub>，如果存在整数 i（i≤p，i≤q），且 a<sub>j</sub>=b<sub>j</sub>（1≤j&lt;i），有 a<sub>i</sub>&lt;b<sub>i</sub>。如果我们能得到字典序序列，题目规定序列对应着字典中的前 n 个小写英文字母（a-z），所以我们就得到了字符映射表。题目要求将给出的明文译为密文，并规定明文中不包含任何符号和除字符映射表中的任何字符。输入、输出数据格式详见题目描述。</p>
            <p><strong>解题思路</strong>：本题的关键在于求解出密文所包含字符的字典序序列，有了这一序列即可得到字符映射表，加密、解密便迎刃而解。</p>
            <p>由相邻（次序相邻）密文间的大小关系，可知两字符的偏序关系 ⟨a,b⟩（a&lt;b），我们可得到所有相邻字符间的偏序集。以测试数据为例：</p>
            <ul>
              <li>第一组：{⟨e,a⟩, ⟨c,e⟩, ⟨e,d⟩, ⟨d,a⟩, ⟨a,b⟩, ⟨b,c⟩}</li>
              <li>第二组：{⟨d,a⟩, ⟨a,b⟩, ⟨b,c⟩}</li>
            </ul>
            <p>通过这些偏序关系，我们可将其构成有向图。这样一来，问题转化为了图的问题：由偏序集求解全序关系是有算法的——<strong>拓扑排序</strong>，算法过程描述如下：</p>
            <ol>
              <li>在图中所有结点中选取一个入度为 0 的结点，加入序列中，如有多个选任一个，如没有则排序失败；</li>
              <li>将选出结点及其连接的边从图中删除；</li>
              <li>如所有结点均被选出，则排序成功，否则，返回 1。</li>
            </ol>
            <p>当然，本题目的求解还需将算法的过程改造，主要是排序成功的控制条件改造。由题目可知，最终产生的字典序列是唯一的，也就是说字符映射表是唯一的；所以有多解的拓扑排序不能产生唯一的字符映射表，那么密码就不能被破解。所以过程 1 改为：</p>
            <ol>
              <li>在图中所有结点中选取一个入度为 0 的结点，加入序列中，如有多个或没有则排序失败。</li>
            </ol>
            <p>按算法过程求解：第一组：c 被首先选出，删除 c 和相关边；选出 e，删除 e 和相关边；选出 d，删除 d 和相关边；选出 a，删除 a 和相关边；最后是 b。最终得序列 c,e,d,a,b。第二组：c 被首先选出，删除 c 和相关边；a、d 均可选，所以排序失败。</p>
            <p>所有字符的全序关系产生后，字符映射表自然得出，将密文译成明文，题目求解完毕。有向图用邻接矩阵 A 存储，稍加变形：该结点有向邻接的结点标记为 1，A[i][i] 存放第 i 结点的入度。</p>
            <p>解题程序源码：略。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-string',
      heading: '三、字符串处理',
      blocks: [
        {
          type: 'html',
          html: `
            <p>字符串的处理是一项基本功，是解题的工具。在 C++ 的 STL 库中有一个头文件 <code>&lt;string&gt;</code>，里面定义了一个 string 类型和一些关于它的操作，熟练地掌握了 string 这种类型的使用技巧，可以使很多题目的处理简单化。在稍后的应用举例中将会向大家介绍高精度算法，这是 string 类型的最典型的应用。</p>
            <p>首先介绍 string 的定义：string 实际上可以看作字符数组，可以直接加下标取出每个字符。接下来介绍一些常用的函数名称：length、size、append、clear、insert、erase、find、find_first_of、find_last_of、find_first_not_of、find_last_not_of 等等，还有一些可以方便应用的运算符：+、==、= 等。</p>
            <h3 id="sec-string-h1">1. PROBLEM A：Word Reversal</h3>
            <pre class="code"><code>Word Reversal
Time limit: 30 Seconds   Memory limit: 32768K
Total Submit: 348   Accepted Submit: 130

For each list of words, output a line with each word reversed without changing the
order of the words.

This problem contains multiple test cases!
The first line of a multiple input is an integer N, then a blank line followed by N
input blocks. Each input block is in the format indicated in the problem description.
There is a blank line between input blocks.
The output format consists of N output blocks. There is a blank line between output
blocks.

Input
You will be given a number of test cases. The first line contains a positive integer
indicating the number of cases to follow. Each case is given on a line containing a
list of words separated by one space, and each word contains only uppercase and
lowercase letters.

Output
For each test case, print the output on one line.

Sample Input
1
3
I am happy today
To be or not to be
I want to win the practice contest

Sample Output
I ma yppah yadot
oT eb ro ton ot eb
I tnaw ot niw eht ecitcarp tsetnoc</code></pre>
            <p>题目大意：将一句话中的每一个单词中的每一个字母按从右向左输出。源程序：略。</p>
            <h3 id="sec-string-h2">2. PROBLEM B：IBM Minus One</h3>
            <pre class="code"><code>IBM Minus One

Time limit: 30 Seconds   Memory limit: 32768K
Total Submit: 273   Accepted Submit: 162

You may have heard of the book '2001 - A Space Odyssey' by Arthur C. Clarke, or the
film of the same name by Stanley Kubrick. In it a spaceship is sent from Earth to
Saturn. The crew is put into stasis for the long flight, only two men are awake, and
the ship is controlled by the intelligent computer HAL. But during the flight HAL is
acting more and more strangely, and even starts to kill the crew on board. We don't
tell you how the story ends, in case you want to read the book for yourself :-)

After the movie was released and became very popular, there was some discussion as
to what the name 'HAL' actually meant. Some thought that it might be an abbreviation
for 'Heuristic ALgorithm'. But the most popular explanation is the following: if you
replace every letter in the word HAL by its successor in the alphabet, you get ... IBM.

Perhaps there are even more acronyms related in this strange way! You are to write a
program that may help to find this out.

Input
The input starts with the integer n on a line by itself - this is the number of strings
to follow. The following n lines each contain one string of at most 50 upper-case
letters.

Output
For each string in the input, first output the number of the string, as shown in the
sample output. Then print the string that is derived from the input string by replacing
every letter by the following letter in the alphabet, and replacing 'Z' by 'A'.
Print a blank line after each test case.

Sample Input            Sample Output
2                       String #1
HAL                     IBM
SWERC
                        String #2
                        TXFSD</code></pre>
            <p>题目大意：题目要求我们把给出的单词中的每一个字母换成它的下一个字母，如果是 Z 则换成 A。源程序：略。</p>
            <h3 id="sec-string-h3">3. 字符串处理的应用实例：高精度算法</h3>
            <p>下面通过介绍高精度算法来具体说明 string 类型的用法。高精度算法：因为我们常用的类型，如 float 类型等都有精度和位数的限制，有些时候不能满足我们的实际要求，高精度算法通过程序模拟手工算法来实现整形或浮点型的基本运算，如加减乘除等，从而突破精度和位数的限制，达到我们的要求。</p>
            <p>下面是一个写好的整型高精度算法，包括运算，大家可以参考注释来学习一下：</p>
            <pre class="code"><code>#include &lt;string&gt;
#include &lt;iostream&gt;

using namespace std;

//整数的加减乘除，取模运算
string ADD_INT(string str1, string str2);
string MULTIPLY_INT(string str1, string str2);
string MINUS_INT(string str1, string str2);
string DIVIDE_INT(string str1, string str2, int z);
string DIV_INT(string str1, string str2);
string MOD_INT(string str1, string str2);
//比较两个整数的大小
int comp(string str1, string str2);

int comp(string str1, string str2)
{
    if (str1.length() &gt; str2.length())   //长度长的整数大于长度小的整数
        return 1;
    else if (str1.length() &lt; str2.length())
        return -1;
    else return str1.compare(str2);      //若长度相等，从头到尾按位比较，
                                         //compare 函数：相等返回 0，大于返回 1，小于返回 -1
}

//整数加法
string ADD_INT(string str1, string str2)
{
    //处理正负号
    int b = 1;
    string str;
    if (str1[0] == '-')
        if (str2[0] == '-') {
            b = -1;
            str = ADD_INT(str1.erase(0,1), str2.erase(0,1));
        }
        else str = MINUS_INT(str2, str1.erase(0,1));
    else {
        if (str2[0] == '-')
            str = MINUS_INT(str1, str2.erase(0,1));
        else {
            //把两个整数对齐，长度不等时，在短的整数前加 0 补齐长度
            int l1 = str1.length(), l2 = str2.length();
            if (l1 &lt; l2)
                for (int i = 1; i &lt;= l2 - l1; i++)
                    str1 = "0" + str1;
            else for (int i = 1; i &lt;= l1 - l2; i++)
                    str2 = "0" + str2;
            //按位带进位加
            int int1 = 0, int2 = 0;   //Int2 记录进位
            for (int i = str1.length() - 1; i &gt;= 0; i--) {
                int1 = (int(str1[i]) - 48 + int(str2[i]) - 48 + int2) % 10;
                int2 = (int(str1[i]) - 48 + int(str2[i]) - 48) / 10;
                str = char(int1 + 48) + str;
            }
            if (int2 != 0)
                str = char(int2 + 48) + str;
        }
    }
    //运算后处理符号
    if ((b == -1) &amp;&amp; (str[0] != '0'))
        str = "-" + str;
    return str;
}

//整数减法
string MINUS_INT(string str1, string str2)
{
    string str;
    //处理符号，有的可以转换成加法
    int b = 1;
    if (str2[0] == '-')
        str = ADD_INT(str1, str2.erase(0,1));
    else {
        if (comp(str1, str2) == 0)
            return "0";
        if (comp(str1, str2) &lt; 0) {
            swap(str1, str2);
            b = -1;
        }
        //按位带借位减
        int tempint = str1.length() - str2.length(), i;
        for (i = str2.length() - 1; i &gt;= 0; i--) {
            if (str1[i + tempint] &lt; str2[i]) {
                str1[i + tempint - 1] = char(int(str1[i + tempint - 1]) - 1);
                str = char(str1[i + tempint] - str2[i] + 58) + str;
            }
            else str = char(str1[i + tempint] - str2[i] + 48) + str;
        }
        for (i = tempint - 1; i &gt;= 0; i--)
            str = str1[i] + str;
    }
    //去除结果中头上多余的 0
    str.erase(0, str.find_first_not_of('0'));
    if (str.empty())
        str = "0";
    //给结果加上符号
    if ((b == -1) &amp;&amp; (str[0] != '0'))
        str = "-" + str;
    return str;
}

//整数的乘法
string MULTIPLY_INT(string str1, string str2)
{
    string str;
    //处理符号位
    int b = 1;
    if (str1[0] == '-') {
        str1 = str1.erase(0,1);
        b = b * -1;
    }
    if (str2[0] == '-') {
        str2 = str2.erase(0,1);
        b = b * -1;
    }
    //按位实现手工乘法
    for (int i = str2.length() - 1; i &gt;= 0; i--) {
        int int1 = 0, int2 = 0, int3 = int(str2[i]) - 48;
        string tempstr;
        if (int3 != 0) {
            int j;
            for (j = 1; j &lt;= int(str2.length() - 1 - i); j++)
                tempstr = "0" + tempstr;
            for (j = str1.length() - 1; j &gt;= 0; j--) {
                int1 = (int3 * (int(str1[j]) - 48) + int2) % 10;
                int2 = (int3 * (int(str1[j]) - 48) + int2) / 10;
                tempstr = char(int1 + 48) + tempstr;
            }
            if (int2 != 0)
                tempstr = char(int2 + 48) + tempstr;
        }
        str = ADD_INT(str, tempstr);
    }
    //去除结果中头上多余的 0
    str.erase(0, str.find_first_not_of('0'));
    if (str.empty())
        str = "0";
    //给结果加上符号
    if ((b == -1) &amp;&amp; (str[0] != '0'))
        str = "-" + str;
    return str;
}

//整数的除法，Z=1 时返回商，Z=2 时返回余数
string DIVIDE_INT(string str1, string str2, int z)
{
    string quotient, residue;
    int a = 1, b = 1;
    //判断除数为 0
    if (str2[0] == '0') {
        quotient = "ERROR!";
        residue = "ERROR!";
        if (z == 1)
            return quotient;
        else return residue;
    }
    if (str1[0] == '0') {
        quotient = "0";
        residue = "0";
    }
    //处理符号位
    if (str1[0] == '-') {
        str1 = str1.erase(0,1);
        a = a * -1;
        b = -1;
    }
    if (str2[0] == '-') {
        str2 = str2.erase(0,1);
        a = a * -1;
    }
    if (comp(str1, str2) &lt; 0) {
        quotient = "0";
        residue = str1;
    }
    if (comp(str1, str2) == 0) {
        quotient = "1";
        residue = "0";
    }
    if (comp(str1, str2) &gt; 0) {
        int length1 = str1.length(), length2 = str2.length();
        string tempstr;
        tempstr.append(str1, 0, length2 - 1);
        //模拟手工除法
        for (int i = length2 - 1; i &lt; length1; i++) {
            tempstr = tempstr + str1[i];
            //试商
            for (char ch = '9'; ch &gt;= '0'; ch--) {
                string str;
                str = str + ch;
                if (comp(MULTIPLY_INT(str2, str), tempstr) &lt;= 0) {
                    quotient = quotient + ch;
                    tempstr = MINUS_INT(tempstr, MULTIPLY_INT(str2, str));
                    break;
                }
            }
        }
        residue = tempstr;
    }
    //去除结果中头上多余的 0
    quotient.erase(0, quotient.find_first_not_of('0'));
    //给结果加上符号
    if (quotient.empty())
        quotient = "0";
    if ((a == -1) &amp;&amp; (quotient[0] != '0'))
        quotient = "-" + quotient;
    if ((b == -1) &amp;&amp; (residue[0] != '0'))
        residue = "-" + residue;
    if (z == 1)
        return quotient;
    else return residue;
}

string MOD(string str1, string str2)
{
    return DIVIDE_INT(str1, str2, 2);
}

string DIV(string str1, string str2)
{
    return DIVIDE_INT(str1, str2, 1);
}</code></pre>
          `,
        },
      ],
    },
    {
      id: 'sec-graph',
      heading: '四、图论的一些算法',
      blocks: [
        {
          type: 'html',
          html: `
            <h3 id="sec-graph-h0">（一）概述</h3>
            <p>图论（Graph Theory）是数学的一个分支。它以图为研究对象。图论中的图，是由若干给定的点及连接两点的线构成的图形，这些图形通常用来描述某些事物之间的某种特定关系，用点代表事物，用连接两点的线表示相应两个事物间具有这种关系。</p>
            <p>图论本身是应用数学的一部分，因此，历史上图论曾经被好多位数学家各自独立地创立过。关于图论的文字记载最早出现在欧拉 1736 年的论著中，他所考虑的原始问题有很强的实际背景。</p>
            <p>图论起源于著名的柯尼斯堡七桥问题。在柯尼斯堡的普莱格尔河上有七座桥将河中的岛及岛与河岸联结起来，A、B、C、D 表示陆地。问题是要从这四块陆地中任何一块开始，通过每一座桥正好一次，再回到起点。然而无数次的尝试都没有成功。欧拉在 1736 年解决了这个问题，他用抽象分析法将这个问题转化为第一个图论问题：即把每一块陆地用一个点来代替，将每一座桥用连接相应的两个点的一条线来代替，从而相当于得到一个图。欧拉证明了这个问题没有解，并且推广了这个问题，给出了对于一个给定的图可以某种方式走遍的判定法则。这项工作使欧拉成为图论的创始人。</p>
            <p>1859 年，英国数学家哈密顿发明了一种游戏：用一个规则的实心十二面体，它的 20 个顶点标出世界著名的 20 个城市，要求游戏者找一条沿着各边通过每个顶点刚好一次的闭回路，即绕行世界。用图论的语言来说，游戏的目的是在十二面体的图中找出一个生成圈。这个问题后来就叫做哈密顿问题。由于运筹学、计算机科学和编码理论中的很多问题都可以化为哈密顿问题，从而引起广泛的注意和研究。</p>
            <p>在图论的历史中，还有一个著名的问题——四色猜想。这个猜想说，在一个平面或球面上的任何地图能够只用四种颜色来着色，使得没有两个相邻的国家有相同的颜色，每个国家必须由一个单连通域构成，而两个国家相邻是指它们有一段公共的边界，而不仅仅只有一个公共点。</p>
            <h3 id="sec-graph-h1">（二）若干特殊问题：匹配</h3>
            <p>上面所介绍的，都是图论中的一些经典问题，下面我们将重点介绍图论中的几个重要算法。</p>
            <p><strong>1. 匹配的基本概念</strong>——首先，让我们把匹配的定义再明确地说一下：设 G＝[V,E] 是一个无向图，M⊆E 是 G 的若干条边的集合，如果 M 中的任意两条边都没有公共端点，就称 M 是一个匹配。例如图 6-1(a)(b) 中的粗线组成的边集合 M₁、M₂，是图 G₁ 与 G₂ 的匹配。从给定的图 G＝[V,E] 的所有匹配中，把包含边数最多的匹配找出来，就是所谓的<strong>最大匹配</strong>问题。</p>
            <p>下面我们首先介绍几个概念：</p>
            <ol>
              <li><strong>二分图</strong>：二分图是这样一种图：G 的顶点集合分成两个部分 X 和 Y，G 中每条边的两个端点一定是一个属于 X 而另一个属于 Y。</li>
              <li><strong>饱和与非饱和</strong>：若匹配 M 的某条边与顶点 v 关联，则称 M 饱和顶点 v，并且称 v 是 M－饱和的，否则称 v 是 M－不饱和的。</li>
              <li><strong>交互道</strong>：若 M 是二分图 G＝[V,E] 的一个匹配，设从 G 中的一个顶点到另一个顶点存在一条道路，这条道路是由属于 M 的边和不属于 M 的边交替出现组成的，则称这条道路为交互道。</li>
              <li><strong>可增广道</strong>：若一条交互道的两端点为关于 M 非饱和顶点时，则称这条交互道是可增广道路。显然，一条边的两端点非饱和，则这条边也是可增广道路。</li>
              <li><strong>最大匹配</strong>：如果 M 是一匹配，而不存在其他匹配 M₁，使得 |M₁|&gt;|M|，则称 M 是最大匹配。其中 |M| 表示匹配 M 的边数。</li>
            </ol>
            <p><strong>Hall 定理</strong>：对于二分图 G，存在一匹配 M，使得 X 的所有顶点关于 M 饱和的充要条件是：对于 X 的任一子集 A，和 A 邻接的点集为 Γ(A)，恒有：</p>
            <div class="formula"><p>| Γ(A) | ≥ | A |</p></div>
            <p>证明略。</p>
            <p><strong>3. 匈牙利算法</strong>——匈牙利算法是求二分图匹配的一种算法，它的根据就是 Hall 定理中充分性证明的思想，现将算法描述如下：</p>
            <ol>
              <li>初始任意匹配。</li>
              <li>如 X 已饱和则结束，否则转 3)。</li>
              <li>在 X 中找一非饱和点 x₀，作 V₁ ← {x₀}，V₂ ← ∅。</li>
              <li>若 Γ(V₁)＝V₂，则因无法匹配而停止；否则任选一点 y∈Γ(V₁)\\V₂。</li>
              <li>若 y 已饱和转 6)，否则作【求一条从 x₀ → y 的可增广道路 P，M←M⊕E(P)，转 2)】。</li>
              <li>由于 y 已饱和，故 M 中有一条边 (y,z)，作【V₁ ← V₁∪{z}，V₂ ← V₂∪{y}，转 4)】。</li>
            </ol>
            <p><strong>参考代码</strong>：</p>
            <pre class="code"><code>int hungary() {
    //从 0 开始
    int s[N], t[N], p, q, ret = 0, i, j, k, match1[N], match2[N];

    memset(match1, -1, sizeof(match1));
    memset(match2, -1, sizeof(match2));

    for (i = 0; i &lt; n; ret += (match1[i++] &gt;= 0)) {
        memset(t, -1, sizeof(t));
        for (s[p = q = 0] = i; p &lt;= q &amp;&amp; match1[i] &lt; 0; p++)
            for (k = s[p], j = 0; j &lt; m &amp;&amp; match1[i] &lt; 0; j++)
                if (mat[k][j] &amp;&amp; t[j] &lt; 0) {
                    s[++q] = match2[j]; t[j] = k;
                    if (s[q] &lt; 0)
                        for (p = j; p &gt;= 0; j = p) {
                            match2[j] = k = t[j]; p = match1[k]; match1[k] = j;
                        }
                }
    }
    return ret;
}</code></pre>
            <p>注意：这里是将递归改为了非递归，递归程序大家可以自己试试。</p>
            <p><strong>4. 最佳匹配</strong>——引例：工厂有 m 个工人 n 项工作，每个工人可以完成其中的若干项工作且工作效益各不相同，我们需要制定一个分工方案，使公司的总效益最大。这就是最佳匹配的问题。解决这种问题的常用算法是基于匈牙利算法修改顶标，详细请参考图论书。</p>
          `,
        },
        {
          type: 'html',
          html: `
            <h3 id="sec-graph-h2">（二）若干特殊问题：网络流</h3>
            <p><strong>1. 网络流的基本概念</strong>——若有向图 G=(V,E) 满足下列条件者，则称其为网络流图：</p>
            <ol>
              <li>有且仅有一个顶点 Z，它的入度为 0，即 d⁻(Z)=0，这个点便称为源点；</li>
              <li>有且仅有一个顶点 Z′，它的出度为 0，即 d⁺(Z′)=0，这个点便称为汇点；</li>
              <li>每一条边都有非负数，叫做该边的容量，边 (v<sub>i</sub>, v<sub>j</sub>) 的容量用 c<sub>ij</sub> 表示。</li>
            </ol>
            <p>对于网络流图 G，每一条边 (i,j) 都给定一个非负数 f<sub>ij</sub>，这一组数满足下列条件时，称为这网络流的容许流，用 f 表示它：</p>
            <ol>
              <li>f<sub>ij</sub> ≤ c<sub>ij</sub>；</li>
              <li>除源点 Z 和汇点 Z′ 以外所有的点 v<sub>i</sub>，恒有 <span class="m">Σ f<sub>ij</sub> = Σ f<sub>ki</sub></span>（流入等于流出）；</li>
              <li>对于源和汇有 <span class="m">Σ f<sub>zi</sub> = Σ f<sub>iz'</sub> = w</span>，w 就叫做该网络流的流量。</li>
            </ol>
            <p><strong>2. 分析与求解</strong>——首先，让我们定义两个基础概念：剩余网络和增广路径。</p>
            <ul>
              <li><strong>剩余网络</strong>：对于任意的网络流图，剩余网络和原网络有相同的顶点，对于原来有边的两个顶点，存在一条或两条边。更进一步，如果流沿边 x→y 并且流量小于边 x→y 的容量，那么存在一条边 x→y，其容量为 c<sub>xy</sub>−f<sub>xy</sub>（称为残余容量）；如果流量沿边 x→y 为正数，那么存在一条反向边 y→x，其容量为 f<sub>xy</sub>。</li>
              <li><strong>增广路径</strong>：增广路径就是在剩余网络中从源点到汇点的一条可行路径。增广流量是沿着路径的所有边的容量的最小值。</li>
            </ul>
            <p>让我们来举一个简单的例子：对给定的网络，考虑路径 X→A→C→Y，我们可以将流量增加 1：边 X→A 和边 A→C 有容量 3，边 C→Y 有容量 1，所以我们取最小值得到增广流量 1。沿着路径将流量增加 1，得到新的网络流图。现在的流量是 2，但不是最大流量，所以我们还需要继续增广：首先得到剩余网络图，显然，你可以找到的唯一增广路径为 X→A→C→B→D→Y（注意在原图中不存在这样的路径，因为 C→B 为反向边，增加它的流量就相当于减少 B→C 边的流量），同样我们得到增广流量为 1。增广之后，可以看出已经不存在任何增广路径，所以得到该网络的最大流量为 3。</p>
            <div class="callout warn">
              <p class="callout-h">注意</p>
              <p>该算法的结论的正确性由割切定理可以证明，证明过程略。</p>
            </div>
            <p><strong>最大流算法小结</strong>：</p>
            <ol>
              <li>初始化网络，使所有流量为 0；</li>
              <li>不断地寻找增广路径并进行增广；</li>
              <li>当找不到增广路径时，算法终止。</li>
            </ol>
            <p>下面我们接着讨论最大流算法中一个最重要的问题：寻找增广路径：</p>
            <ol>
              <li><strong>DFS</strong>：FF 算法在解决这个问题时采用的是 DFS 算法，即在剩余网络中采用 DFS 算法，试图寻找一条增广路径，当找到一条时，便停止搜索，并进行增广操作。此算法绝对可以保证正确性，而且实现起来代码非常简洁，但是有些盲目，所以导致有些时候时间效率非常差。</li>
              <li><strong>BFS</strong>：修正的 EK 算法正是采用了这种方法。我们知道，BFS 算法可以解决没有权值或权值相等的图的最短路径问题，确实，这样我们就可以得到从源点到汇点的边数最少的增广路径。这个算法可以保证最多需要 O(N·M/2) 次增广（N 表示顶点数，M 表示边数），每次 BFS 的时间复杂度为 O(M)，所以整个算法的最差时间复杂度为 <span class="m">O(N·M²)</span>，但往往实际运用中要比这个好得多。</li>
              <li><strong>PFS</strong>：这个算法在寻找增广路径时，和 Dijkstra 算法极为相似，每次都是找出可增广的流量最大的增广路径进行增广。</li>
            </ol>
            <p>分析：直觉告诉我们，最后一个算法可能效果最好，因为每次都是增广最大，这样就可以减少增广次数，但是实践证明，对于不同的情况，这三种算法各有千秋，算法的好坏是要对具体问题看哪个更加适用。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-opt',
      heading: '五、算法的优化',
      blocks: [
        {
          type: 'html',
          html: `
            <p>在比赛中可能最令人头疼的就是想出了算法并写出代码提交后得到超时的回复，这当然和算法本身选择是否合理有关，如需要用动态规划解决的题目却选择了搜索算法。但是除了这个方面外，还有就是选择了正确的算法，但是用这个算法解决问题的时候效率不够高，在试题规定的时间范围内无法计算完数据。这就涉及到算法的优化问题。而算法的优化是建立在对算法本身的熟练掌握的基础上的。在此，再重申一下对算法的优化，需要对算法本身熟练掌握。在本节中，将讨论以下内容：1．算法优化的基本思想；2．搜索的优化；3．动态规划的优化；4．一些特殊的数据结构。本节中将不给出大部分代码，请大家自己动手完成。</p>
            <h3 id="sec-opt-h1">（一）算法优化的基本思想</h3>
            <p>在算法设计和编程过程中，冗余计算的出现是难以避免的。冗余计算是高效率的天敌，减少冗余计算，必然会使算法和程序效率提高很多。去除冗余计算没有可套用的定理公式可用，只有认真分析、善于探索，并在做题中积累经验，才能得到去除冗余计算的好方法。</p>
            <p>下面是一个常用的模型，将通过对此模型算法的优化来说明算法优化的基本思想。</p>
            <p><strong>最大子矩形问题</strong>：在一个给定的矩形中有一些障碍点，要找出内部不包含任何障碍点的，轮廓与整个矩形平行或重合的最大子矩形。矩形中障碍点的数目为 S，矩形的大小为 M×N。</p>
            <p>首先，定义<strong>有效子矩形</strong>为内部不包含任何障碍点的、边界与坐标轴平行的子矩形；然后，定义<strong>极大子矩形</strong>为每条边都不能向外扩展的有效子矩形；定义<strong>最大子矩形</strong>为所有有效子矩形中最大的一个（或多个）。</p>
            <p>显然，在一个有障碍点的矩形中的最大子矩形一定是一个极大子矩形（但是究竟是哪一个极大子矩形，在求解前我们并不知道）。于是我们得出求解这个问题的基本算法思路：通过枚举所有的极大子矩形，找出最大子矩形。</p>
            <p>最先想到的算法可能是：枚举上下左右四个边界，然后判断组成的矩形是否是有效子矩形。算法的时间复杂度：<span class="m">O(S⁵)</span>。显然这个算法的效率太低，可以改进的地方：产生了大量的无效子矩形。</p>
            <p>初步改进算法：枚举左右边界，然后对处在边界内的点排序，每两个相邻的点和左右边界一起组成一个矩形。复杂度：<span class="m">O(S³)</span>。经过初步改进后，这个算法的时间复杂度大大降低，但是还是比较高。可以改进的地方：枚举了部分不是极大子矩形的情况。</p>
            <p>虽然上述初步改进后的算法效率仍不高，但是它的改进思想还是很有用的：保证每一个枚举的子矩形都是有效的；保证每一个枚举的子矩形都是极大的。显然改进思想就是避免大量的冗余计算。</p>
            <p>两个算法的思路都是先通过一定的方式不遗漏地枚举出每一个极大子矩形，然后从中找出面积最大的一个。第一个算法的枚举方式为：枚举上下左右四个边界；第二个算法的枚举方式为：枚举左右边界。于是想到可否枚举极大子矩形的左边界，然后根据确定的左边界，找出相关的极大子矩形，并检查和处理遗漏的情况。</p>
            <p>首先，将所有障碍点按横坐标从小到大的顺序将点标为 1 号点，2 号点……为了处理方便，在矩形的四个顶点上各增加 1 个障碍点。第一次取 1 号点作为所要枚举的极大子矩形的左边界，设定上下边界为极大子矩形的上下边界。从左向右扫描，第一次遇到 2 号点，可以得到一个有效的极大子矩形。因为左边界覆盖 1 号点且右边界在 2 号点右边的有效子矩形都不能包含 2 号点，所以需要修改上下边界：2 号点在 1 号点下方，因此要修改下边界。继续扫描到 3 号点，又得到一个极大有效子矩形；因为 3 号点在 1 号点上方，所以要修改上边界。以此类推，可以得到所有以 1 号点为左边界的极大有效子矩形。然后将左边界移动到 2 号点、3 号点……横坐标的位置，开始扫描以 2 号点、3 号点……为左边界的极大子矩形。</p>
            <p>前面的做法可以找出所有左边界覆盖了一个障碍点的极大子矩形，此外，还有两类遗漏的情况：</p>
            <ul>
              <li>一类是左边界与整个矩形的左边界重合，右边界覆盖一个障碍点的情况。解决方法：用类似的方法从右向左扫描一次。</li>
              <li>另一类是左边界与整个矩形的左边界重合，且右边界也与整个矩形的右边界重合的情况。解决方法：预处理时增加特殊判断。</li>
            </ul>
            <p>算法的时间复杂度为 <span class="m">O(S²)</span>，空间复杂度为 O(S)。算法的时间复杂度已经可以接受了，而且在计算过程中，计算的矩形都是极大子矩形，大大减少了冗余计算，提高了算法的效率。</p>
          `,
        },
        {
          type: 'html',
          html: `
            <h3 id="sec-opt-h2">（二）搜索的优化：剪枝</h3>
            <p>在竞赛中，我们有时会碰到一些题目，它们既不能通过建立数学模型解决，又没有现成算法可以套用，或者必须遍历所有状况才可以得出正确结果。这时，我们就必须采用搜索算法来解决问题。</p>
            <p>搜索算法按搜索的方式分有两类，一类是深度优先搜索，一类是广度优先搜索。我们知道，深度搜索编程简单，程序简洁易懂，空间需求也比较低，但是这种方法的时间复杂度往往是指数级的，倘若不加优化，其时间效率简直无法忍受；而广度优先搜索虽然时间复杂度比前者低一些，但其庞大的空间需求量又往往让人望而却步。所以，对程序进行优化，就成为搜索算法编程中最关键的一环。这里所要介绍的便是搜索算法中优化程序的一种基本方法即「剪枝」。</p>
            <p><strong>1) 什么是剪枝</strong>——相信刚开始接触搜索算法的人，都做过类似迷宫这样的题目吧。我们在「走迷宫」的时候，一般回溯法思路是这样的：1、这个方向有路可走，我没走过；2、往这个方向前进；3、是死胡同，往回走，回到上一个路口；4、重复第一步，直到找着出口。这样的思路很好理解，编程起来也比较容易。但是当迷宫的规模很大时，回溯法的缺点便暴露无遗：搜索耗时令人无法忍受。</p>
            <p>我们可不可以在向某个方向前进时，先一步判断出这样走会不会走到死胡同里呢？这样一来，搜索的时间不就可以减少了吗？答案是：可以的。剪枝的概念，其实就跟走迷宫避开死胡同差不多。若我们把搜索的过程看成是对一棵树的遍历，那么剪枝顾名思义，就是将树中的一些「死胡同」、不能到达我们需要的解的枝条「剪」掉，以减少搜索的时间。</p>
            <p>搜索算法，绝大部分需要用到剪枝。然而，不是所有的枝条都可以剪掉，这就需要通过设计出合理的判断方法，以决定某一分支的取舍。在设计判断方法的时候，需要遵循一定的原则。</p>
            <p><strong>2) 剪枝的原则</strong></p>
            <ol>
              <li><strong>正确性</strong>：正如上文所述，剪枝不是想剪就能剪的。如果随便剪枝，把带有最优解的那一分支也剪掉了的话，剪枝也就失去了意义。所以，剪枝的前提是一定要保证不丢失正确的结果。</li>
              <li><strong>准确性</strong>：在保证了正确性的基础上，我们应该根据具体问题具体分析，采用合适的判断手段，使不包含最优解的枝条尽可能多的被剪去，以达到程序「最优化」的目的。可以说，剪枝的准确性，是衡量一个优化算法好坏的标准。</li>
              <li><strong>高效性</strong>：设计优化程序的根本目的，是要减少搜索的次数，使程序运行的时间减少。但为了使搜索次数尽可能的减少，我们又必须花工夫设计出一个准确性较高的优化算法，而当算法的准确性升高，其判断的次数必定增多，从而又导致耗时的增多，这便引出了矛盾。因此，如何在优化与效率之间寻找一个平衡点，使得程序的时间复杂度尽可能降低，同样是非常重要的。倘若一个剪枝的判断效果非常好，但是它却需要耗费大量的时间来判断、比较，结果整个程序运行起来也跟没有优化过的没什么区别，这样就太得不偿失了。</li>
            </ol>
            <p>综上所述，我们可以把剪枝优化的主要原则归结为六个字：<strong>正确、准确、高效</strong>。剪枝算法按照其判断思路可大致分成两类：可行性剪枝及最优性剪枝。下面分别结合例题对这两种方法进行阐述。</p>
            <p><strong>3) 可行性剪枝</strong>——这个方向可不可以走？走下去会不会碰到死胡同？这就是对某一枝条进行可行性剪枝的简要判断过程。我们来看这样一道题。</p>
            <p>问题简述：一个规则矩形网络状的城市，城市中心坐标为 (0,0)。城市包含 m 个无法通行的路障（m≤50），采用如下规则游历城市：第一步走 1 格，第二步走 2 格，依此类推，第 n 步走 n 格（n≤20），除了第一步有四个方向可走，其余各步必须在前一步基础上左转或右转 90 度，最后回到出发点 (0,0)。对于给定的 n、m，编程求出所有可行的路径。</p>
            <p>现在考虑采用简单的回溯法，原因是该题的本身就已经有很强的剪枝判断了。那么我们先来分析一下用回溯法解题的思路：用 x、y 两个变量存储当前坐标，每一步对 x、y 的值进行修改，没有遇到障碍就继续走，走完 n 步看看有没有回到 (0,0)，没有的话回溯搜索，直到找完所有路径。</p>
            <p>接着，我们来看看这种算法的时间复杂度。一共走 n 步，每步要搜索四个方向，假设在最坏的情况下，没有任何障碍物，那么它的时间复杂度应该为：<span class="m">O(4ⁿ)</span>。很明显，这样的算法效率并不会很高，所以我们必须对程序进行剪枝，在未走完 n 步之前就提早判断出这样的走法是否可行。</p>
            <p>当走到第 i 步时，假设当前坐标为 (xᵢ, yᵢ)，那么离 (0,0) 的距离就应该是 xᵢ+yᵢ，而剩下的 n−i 步可以走的最远距离则是 (i+1)+(i+2)+……+n。所以，若 (i+1)+(i+2)+……+n&lt;xᵢ+yᵢ 的话，就表示就算现在「回头」也没办法到达出发点，也就是说这条分支即便再搜索下去也找不出解来，这时我们已经可以舍弃这一分支而回溯了。</p>
            <p>这样剪枝似乎已经不错了，但是，它的效果只有当数据较大时，才能体现得明显。除了上述的优化，还有没有其他的方法呢？我们可以这样想：这个城市是规则网格状的，东、南、西、北四个方向都是对称的。打个比方说，与 (1,0) 这个点对称的可以有 (−1,0)、(0,1)、(0,−1) 这三点。那可否设想，当从一个方向出发，寻找到一个解之后，将这个解旋转 90°、180°、270°，不就得出其余三个解了吗？这样岂不是节省了 3/4 的搜索次数？</p>
            <p>由这个设想出发，我们可以设计出下面的优化：忽略所有的障碍物，第一步走固定的方向（比如东面），在这个基础上搜索路径，每找到一条路径都将其余三个「对称路径」一起判断，看看有没有经过障碍物，若没有则该路径为解之一。请大家思考为什么要忽略障碍物并且要限定第一步的方向。</p>
            <p><strong>4) 最优性剪枝</strong>——最优性剪枝，又称为上下界剪枝。我们可以回想一下，平时在做一些要求最优解的问题时，搜索到一个解，是不是把这个解保存起来，若下次搜索到的解比这个解更优，就又把更优解保存起来？其实这个较优解在算法中被称为「下界」，与此类似还有「上界」。在搜索中，如果已判断出这一分支的所有子节点都低于下界，或者高于上界，我们就可以将它剪枝。</p>
            <p>如何估算出上（下）界呢？我们引入一个「<strong>估价函数</strong>」。最优性剪枝算法的核心，就在于设计估价函数上。估价函数在不同的题目中被赋予不同的意义，比如说当前状态与目标状态相差的步数，某一数列的长度等等，都可作为估价函数的一部分。</p>
            <p>我们再来看一道题目：问题简述：在一个 n×m 的迷宫矩阵中，有 x 个不可逾越的障碍物，给定 x₀, y₀, x₁, y₁，求出由 (x₀, y₀) 到 (x₁, y₁) 之间的所有最短路径。</p>
            <p>这一道题看起来非常简单，也与上一题有不少相似之处。难道我们不能用简单的回溯法来解决它吗？我们来分析一下时间复杂度：与上题类似，我们同样假设在最坏情况下，迷宫中没有任何障碍，即是一个网格，从 (0,0) 到 (n,m) 的话，每一步有四个方向可以走，时间复杂度将达到 <span class="m">O(4<sup>m</sup>·4<sup>n</sup>)</span>！假设 n=m=20，那么搜索次数将达到 2⁴² 次！看来这枝是非剪不可了。</p>
            <p>最初步的剪枝当然就是将走过的方格置为「障碍」，因为若重复通过同一格，最终结果必定不是最优解。其次，我们可以将每一次搜索出的路径长度与上界比较（初始上界＝∞），不断降低上界，一旦出现路径长超出上界而仍未到达目标点，则放弃该搜索进程，因为就算继续搜索下去，这一条路径也必然比其他路径长，不是最优解。</p>
            <p>要完成规模更大的迷宫，仅仅这样剪枝是不够的。我们还必须采取其他的方法，比如先用动态规划求出一个准确的上界，再依据此上界进行搜索等。当然，对于迷宫这一类题目，搜索算法并不是最好的，我们完全可以用动态规划（用 BFS 划分阶段），再 DFS 出所有的最短路径。在这里引用这样的一道题，目的是想让大家更好的理解最优化剪枝的思路及其应用，请大家思考如何用 BFS+DP+DFS 求解这一问题。</p>
            <p>结合本题，我们可以得出最优化剪枝算法所应该注意的一些问题：</p>
            <ol>
              <li>与可行性剪枝一样，最优性剪枝在保证正确性的同时，同样需要注意提高准确性和高效性。估价函数的计算极为频繁，必须尽量提高其运算效率，不要「拣了芝麻，掉了西瓜」，寻找准确与高效的平衡点，确实重要。</li>
              <li>在使用最优化剪枝时，一个好的估价函数往往起到「事半功倍」的效果。在搜索之前，我们可以采用一些高效率的算法，如贪心法、动态规划、标号法等等，求出一个较优解，作为上（下）界，将有解的范围缩小，以尽可能的剪去多余的枝条。如上题中，可以采用动态规划求出上界，再进行搜索，效率提高了许多。</li>
            </ol>
            <p>此外，不但深度优先搜索可以运用最优性剪枝，在广度优先搜索中，同样可以采用这种剪枝方法。还有一些比较典型的方法有：分支定界法、A* 算法，博弈树等等。不过，这些方法一般空间复杂度都比深度优先搜索要大得多，如何取舍就要依据不同的题目做出相应的判断了。</p>
            <p><strong>5) 小结</strong>——在搜索算法中，几乎都需要采用程序优化，以减少时间复杂度。而本文所论述的「剪枝」算法，就是最常见的优化方法之一，其基本思想还是减少冗余的计算。编优化程序的过程中，不论运用的是可行性剪枝还是最优性剪枝，都离不开剪枝的三个原则即正确、准确、高效。然而，尽管可以采用众多优化算法使得程序的效率有所提高，搜索算法本身的时间复杂度不能从本质上减少是不可改变的事实，我们在考虑对一道题采用搜索算法之前，不妨先仔细想想，有没有其他更好的算法。毕竟，优化程序也是一项「吃力不讨好」的工作，与其耗费大量的时间来优化搜索程序，倒不如多想，多写，尽量以非搜索算法解决问题。总之，我们在比赛中应当多动动脑筋，从不同角度来思考问题，采取合适的算法解决问题。</p>
            <p><strong>利用 Hash 表剪枝</strong>——Hash 表最大的优点，就是把数据的存储和查找消耗的时间大大降低，几乎可以看成是常数时间；而代价仅仅是消耗比较多的内存。然而在当前可利用内存越来越多的情况下，用空间换时间的做法是值得的。另外，写代码比较容易也是它的特点之一。</p>
            <p>下面介绍一下在搜索中 Hash 表怎么剪枝：大家都知道在搜索树中每个节点都代表了一个当前状态。举个例子：ZJU 上有一道题目 Knight Move：求解国际象棋棋盘上任意两点间，一个马从一点到另一点的最少步数。很显然这样的问题用 BFS 求解，那么搜索树中的每一个状态可以用一个二元组来表示 (x,y)，即当前马正处于棋盘上 (x,y) 的位置。</p>
            <p>如果不剪枝，这题会超时，原因是有大量的节点是重复的，并且我们思考以后就会发现：当一个马重复出现在一个位置时，再由这个位置出发所得到的路径肯定不是最优的，因为我们完全可以把重复走的那段路径去掉，从而得出一条更短的路径。</p>
            <p>现在的问题是怎么剪枝，可以这样剪枝：每当扩展一个新节点的时候，就遍历先前的节点，查找该节点是否已经出现过。显然棋盘上共有 64 个格子，即使全部在树中，由于不重复，所需要遍历的节点数并不多。但是如果棋盘是 100×100 的呢？这个时候我们就需要很快的查找到该节点是否出现过。这里就可以利用 Hash 表：开一个二维数组 s[i,j]。若 s[x,y]==0，即表示该节点尚未走到；若 s[x,y]==1，即表示该节点已被访问。这样即使棋盘很大，我们也可以用 O(1) 的时间就得到该节点的信息。</p>
            <p>Hash 表在剪枝中的用途还是很大的，其基本作用就是减少查询节点是否已被遍历所用的时间。但是利用 Hash 表剪枝有个先决条件，即当节点重复时，此后所得到的解不会比不重复时更优，或者题目不允许节点重复。</p>
            <p><strong>其它的一些剪枝方法</strong>——当然还有很多其它的一些剪枝的方法和技巧，大家在做题的时候充分分析题目的意思和条件，并且多动脑，多动手。剪枝的思想仍然是减少冗余的计算来提高算法的效率。</p>
          `,
        },
        {
          type: 'html',
          html: `
            <h3 id="sec-opt-h3">（三）动态规划的优化</h3>
            <p>动态规划本身就是一种比较高效的算法，它的基本思想就是用空间换时间，采用记录表法对子问题的最优解进行记录，从而避免了子问题的重复计算，和递归相比节省了大量 的时间，但是动态规划并不是没有优化的余地。随着参赛者水平的普遍提高，题目的数据规模越来越大，这就造成了两个问题：一是存储空间不够；二是解决问题的时间超出题目要求。下面从时间和空间两个方面来说一下动态规划的优化。</p>
            <p><strong>1) 时间方面的优化（动态规划的剪枝）</strong>——动态规划的剪枝：在动态规划的过程中尽量减少不必要的计算，尽量减少不会得出最优解的计算，类似于搜索中的剪枝。</p>
            <p>先给出两个题目，以此来说明：</p>
            <ul>
              <li>ZJU1986 Bridging Signals：题目的意思很简单，就是给出一个类似于函数双射的图，然后要求在图中的边集中选出一个子集，使得子集中的边互不相交，求解满足上述条件的所有子集中的边数最大值。数据的规模为 n&lt;40000，n 为边数。</li>
              <li>ZJU2254 Island Country：题目大意：Alice 和 Jim 准备访问一些岛屿，这些岛屿从 1 到 n 编号，Alice 和 Jim 对这些岛屿的兴趣用一个整数来衡量，值越大表明对这个岛屿越感兴趣。但是他们两人对岛屿的兴趣不尽相同，所以他们要分开旅行。他们都按照自己对岛屿的兴趣值对岛屿进行访问，值低的先访问（好东西要留到后面），值相同的按照编号大小进行访问，编号小的先访问。现在给出他们对岛屿的兴趣值，要求求解出他们在旅行的过程中最多遇见几次。</li>
            </ul>
            <p>先说一下第 2 题，题目中的 Sample Input 如下：</p>
            <pre class="code"><code>3
1 2 3
3 1 2</code></pre>
            <p>先输入岛屿的数量 n，n≤1000，接下来的两行分别是按岛屿的编号的顺序给出两人对这些岛屿的兴趣值。显然本题应该用动态规划来做，先按岛屿的兴趣值对岛屿进行排序，然后就形成了两个岛屿编号的串，如题目中 Sample Input 排序后得出：</p>
            <pre class="code"><code>1 2 3
2 3 1</code></pre>
            <p>这样就转化成了和第一题相似的模型，即求解最大不相交边集。现不妨称上面的序列为串 A，下面的序列为串 B（即串 A 中的岛屿 i 与串 B 中同一岛屿连一条边）。思考后得出初步算法如下：</p>
            <ol>
              <li>先快速排序，得出两个岛屿编号的串，即串 A 和串 B。</li>
              <li>求解映射（Mapping），即找出串 A 中的岛屿 i 在串 B 中的位置。</li>
              <li>求解最大不相交边集。</li>
            </ol>
            <p>其中第 1 步算法复杂度为 O(nlogn)；第 2 步采用下述方法计算：对串 B 进行遍历，用散列 PosB[i] 记录编号为 i 的岛屿在串 B 中的位置，算法复杂度为 O(n)。最重要的一步，也就是第 3 步，令状态变量 s[i] 表示前 i 个岛屿，并且在第 i 个岛屿两人相遇的最优解，得出状态转移方程如下：</p>
            <div class="formula"><p>s[i] = max{ s[j]+1 : 1≤j&lt;i ∧ PosB[j]&lt;PosB[i] }</p></div>
            <p>时间复杂度为 <span class="m">O(n²)</span>。整个算法的时间复杂度为 <span class="m">O(n²)</span>，也不算太高，似乎能够满足题目的要求，但是提交后发现超时，原因就是题目的数据量较大（n≤1000）。可是分析后，发现按照这个模型，降低算法复杂度比较困难（但不是不行），不过在此将着重介绍如何剪枝：首先分析算法中存在的不必要的计算，从而尽量减少不必要的计算时间。显然 s[i] 的值只和前面的某一个 s[j] 有关，但是为了寻找这个 s[j]，我们遍历了所有比 i 小的 s[j]，如何尽量快地找出满足题目要求的 j，或者如何尽量减少不必要的计算。分析后发现：</p>
            <ol>
              <li>会出现这样的情况：计算 i 的时候很明显如果按串 A 遍历，会造成很多不必要的计算；相反，如果按串 B 进行遍历，则只要计算 1 次。这是因为 i 在串 B 中比在串 A 中更靠前。</li>
              <li>也会出现这样的情况：再向前扫描的时候，前面的所有的 s[j] 再加 1 也不会比 s[i] 大，这就提醒我们新开一个数组 Max[j] 来计算前 j 个值中的最大值，也就是 Max[j] = max{ s[k] (1≤k≤j) }。但是计算的时候当然不会按照这个 O(n) 方程计算，而是应该用下面的 O(1) 的方程计算：Max[j] = max{ Max[j−1], s[j] } (j&gt;1)。</li>
            </ol>
            <p>采用这两个方法优化以后，虽然时间复杂度仍然是 <span class="m">O(n²)</span>，但是计算量大大减小，代码在规定时间内完成计算。说到这里第 1 题也可以用相同的优化方法解决。这里优化的方法就是剪枝，另外还可以用二叉搜索树将算法复杂度降到 O(nlogn)，感兴趣的同学请参见《算法艺术与信息学竞赛》第 150 页。当然这仅仅是从动态规划剪枝方面来讨论的，虽然没有降低时间复杂度，但是由于减少了大量不必要的计算，所以程序运行速度还是很快的。至于降低算法复杂度的方法，一般是利用专门的数据结构对信息进行存储，而不是像普通的动态规划那样只是用数组存储，不过这些数据结构的使用，使得编程复杂度提高，对选手的编程能力提出了更高的要求。</p>
            <p>建议当动态规划超时时，如果认为算法选择正确，那么先尽量剪枝，如果还是超时就应该考虑降低时间复杂度了。感兴趣的同学请参见《算法艺术与信息学竞赛》一书中的相关内容。</p>
            <p><strong>举例：最长单调序列的动态规划优化问题</strong>——最长单调序列是动态规划解决的经典问题。现在以求最长下降序列（严格下降）为例，来说明怎样用 O(nlogn) 来解决它。设问题处理的对象是序列 a[1..n]。整个动态规划算法是这样实现的：</p>
            <pre class="code"><code>//Author:zheng
void Calculate()
{
    int max = 1;
    s[1] = 1;
    for (int i = 2; i &lt;= n; ++i)
    {
        s[i] = 1;
        for (int j = i - 1; j; --j)
        {
            if (a[j] &gt; a[i] &amp;&amp; s[j] + 1 &gt; s[i])
            {
                s[i] = s[j] + 1;
            }
        }
        if (max &lt; s[i])
        {
            max = s[i];
        }
    }
    cout &lt;&lt; max &lt;&lt; endl;
}</code></pre>
            <p>这一程序非常短小精悍，其中的奥妙还是不少的。为了理解这个过程，还是从最基本的解决方法开始分析。首先我们都知道求最长下降序列的算法：</p>
            <div class="formula"><p>s[1] = 1；　s[i] = MAX{ s[j]+1 : 1≤j&lt;i 且 a[j]&gt;a[i] }（若无则取 1）；　MAX = max{ s[i] : 1≤i≤n }</p></div>
            <p>在这个公式中 P 表示了决策。专门考虑这个 P，可能有多个决策都可以得到最大值，这些决策都是等价的。那么我们当然可以对 P 进行特殊的限制，即，在所有等价的决策 j 中，P 选择 a[j] 最大的那一个。</p>
            <p>P 的选择跟我们得到结果并没有任何关系，但是希望对 P 的解释说明这样的问题：对于第 x 个数来说，它可以组成长度为 s[x] 的最长下降序列，它的子问题是在 a[1..x−1] 中的一个长度为 s[x]−1 的最长下降序列，并且这个序列的最后一个数大于 a[x]。我们让 P 选择这些所有可能解中末尾数最大的，也就是说在处理完 a[1..x−1] 之后，对于所有长度为 s[x]−1 的下降序列，P[x] 的决策只跟其中末尾最大的一个有关，其余的同样长度的序列我们不再关心。</p>
            <p>由此想到，用另外一个动态变化的数组 b：当我们计算完了 a[x] 之后，a[1..x] 中得到的所有下降序列按照长度分为 L 个等价类，每一个等价类中只需要一个作为代表，这个代表在这个等价类中末尾的数最大，我们把它记为 b[j]（1≤j≤L）。b[j] 是所有长度为 j 的下降序列中，末尾数最大的那个序列的代表。</p>
            <p>由于我们把 a[1..x−1] 的结果都记录在了 b 中，那么处理当前的一个数 a[x]，我们无需和前面的 a[j]（1≤j≤x−1）作比较，只需要和 b[j]（1≤j≤L）进行比较。</p>
            <p>对于 a[x] 的处理，我们简单地说明。首先，如果 a[x]&lt;b[L]，也就是说在 a[1..x−1] 中只存在长度为 1 到 L 的下降序列，其中 b[L] 是作为长度为 L 的序列的代表。由于 a[x]&lt;b[L]，显然把 a[x] 接在这个序列的后面，形成了一个长度为 L+1 的序列。a[x] 显然也可以接在任意的 b[j]（1≤j&lt;L）后面，形成长度为 j+1 的序列，但必然有 a[x]&lt;b[j+1]，所以它不可能作为 b[j+1] 的代表。这时 b[L+1]=a[x]，即 a[x] 作为长度为 L+1 的序列的代表，同时 L 应该增加 1。另一种可能是 a[x]≥b[1]，显然这时 a[x] 是 a[1..x] 中所有元素中最大的，它仅能构成长度为 1 的下降序列，同时它又必然是最大的，所以它作为 b[1] 的代表，b[1]=a[x]。如果前面的情况都不存在，我们肯定可以找到一个 j（2≤j≤L），有 b[j−1]&gt;a[x]、b[j]≤a[x]，这时分析：a[x] 必然接在 b[j−1] 后面，形成一个新的长度为 j 的序列。这是因为，如果 a[x] 接在任何 b[k] 后面（1≤k&lt;j−1），那么都有 b[k+1]&gt;a[x]，a[x] 不能作为代表；而对于任何的 b[k]（j≤k≤L），b[k]≤a[x]，a[x] 不能延长这个序列。由于 a[x]≥b[j]，所以我们就将 b[j] 更新为 a[x]。</p>
            <p>在任何一种情况完成之后，b[1..L] 显然是个下降的序列，但它并不表示长度为 L 的下降序列，这点不可混淆。</p>
            <p>这几种情况实际上都可以归结为：处理 a[x]，令 b[L+1] 为无穷小，从左到右找到第一个位置 j，使 b[j]≤a[x]，然后则只要将 b[j]=a[x]，如果 j=L+1，则 L 同时增加。x 处以前对应的最长下降序列长度为 M[x]=j。</p>
            <p>这题当 a 本身是下降序列时，它退化为 O(n²) 的算法。这时不难想到既然 b 是一个有序数组，于是采用二分查找，于是算法的时间复杂度降为 O(nlogn)。</p>
            <p>此外还有利用四边形不等式来加速动态规划，很多算法书上都有详细的讲解，在此就不再叙述了。感兴趣的同学可以自己查阅相关算法书籍。</p>
            <p><strong>2) 在空间方面的优化</strong>——有时候状态数目太多，以至于存储不下。这时候就需要我们分析题目和状态转移方程，找出一些不需要存储的状态。经常碰到的情况是某些状态在某个时刻后不会被用到，这个时候就不用存储这些状态。</p>
          `,
        },
        {
          type: 'html',
          html: `
            <h3 id="sec-opt-h4">（四）一些特殊的数据结构</h3>
            <p><strong>1. 线段树</strong>——处理涉及到图形的面积、周长等问题的时候，并不需要依赖很深的数学知识，但要提高处理此类问题的效率却又十分困难。这就需要从根本上改变算法的基础——数据结构。这里要说的就是一种特殊的数据结构——线段树。</p>
            <p>先看一道较基础的题目：给出区间上的 n 条线段，判断这些线段覆盖到的区间大小。通过这题我们来逐步认识线段树。</p>
            <p><strong>定义</strong>：线段树是一棵二叉树，将一个区间划分为一个个 [i，i+1] 的单元区间，每个单元区间对应线段树中的一个叶子结点。每个结点用一个变量 count 来记录覆盖该结点的线段条数。</p>
            <p>一棵线段树，记为 T(a, b)，参数 a,b 表示区间 [a,b]，其中 b−a 称为区间的长度，记为 L。线段树 T(a,b) 也可递归定义为：若 L&gt;1，则 [a, (a+b)/2] 为 T 的左儿子，[(a+b)/2, b] 为 T 的右儿子；若 L=1，则 T 为叶子结点。区间 [1,7] 所对应的线段树如下图所示，区间上有一条线段 [3,6]：</p>
            <svg class="fig" viewBox="0 0 640 210" role="img" aria-label="区间 [1,7] 的线段树与线段 [3,6]">
              <rect x="0" y="0" width="640" height="210" fill="var(--c-panel)"/>
              <g font-size="12" fill="var(--c-ink)">
                <rect x="270" y="18" width="86" height="30" rx="6" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <text x="313" y="38" text-anchor="middle">[1,7]</text>
                <rect x="130" y="70" width="86" height="30" rx="6" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <text x="173" y="90" text-anchor="middle">[1,4]</text>
                <rect x="410" y="70" width="86" height="30" rx="6" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <text x="453" y="90" text-anchor="middle">[4,7]</text>
                <rect x="55" y="122" width="80" height="30" rx="6" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <text x="95" y="142" text-anchor="middle">[1,2]</text>
                <rect x="195" y="122" width="80" height="30" rx="6" fill="var(--c-tip-bg)" stroke="var(--c-ok)"/>
                <text x="235" y="142" text-anchor="middle">[2,4]</text>
                <rect x="375" y="122" width="80" height="30" rx="6" fill="var(--c-panel-2)" stroke="var(--c-line)"/>
                <text x="415" y="142" text-anchor="middle">[4,5]</text>
                <rect x="515" y="122" width="80" height="30" rx="6" fill="var(--c-tip-bg)" stroke="var(--c-ok)"/>
                <text x="555" y="142" text-anchor="middle">[5,7]</text>
                <path d="M300 48 L180 70 M325 48 L445 70" stroke="var(--c-line)" stroke-width="1.3" fill="none"/>
                <path d="M165 100 L100 122 M185 100 L230 122" stroke="var(--c-line)" stroke-width="1.3" fill="none"/>
                <path d="M445 100 L420 122 M465 100 L550 122" stroke="var(--c-line)" stroke-width="1.3" fill="none"/>
              </g>
              <text x="320" y="188" text-anchor="middle" font-size="12" fill="var(--c-ok)">线段 [3,6] 被分解为 [2,4] 与 [5,7] 两个完全覆盖的结点（示意）</text>
            </svg>
            <p>线段树既可以用链表存储，也可以用顺序表存储。而按顺序表存储时，可以把线段树看成一棵满二叉树（虽然有一些空节点没有用到），直接用 Tree[i] 表示线段树中的节点，Tree[1] 为根节点，那么左孩子为 Tree[i*2]（如果有左孩子），右孩子为 Tree[i*2+1]（如果有右孩子），于是建树的过程如下：</p>
            <pre class="code"><code>//Author:zheng
struct node {
    int Left;
    int Right;
} Tree[TreeSize];   //TreeSize 为树的大小

void BuildTree(int sn, int left, int right)
{
    int mid = (left + right) / 2;
    Tree[sn].Left = left;
    Tree[sn].Right = right;
    if (right &gt; left + 1)
    {
        BuildTree(sn * 2, left, mid);
        BuildTree(sn * 2 + 1, mid, right);
    }
}</code></pre>
            <p>也可以不这样按层编号，而按照左先序编号，建树代码如下：</p>
            <pre class="code"><code>//Author:zheng
struct node {
    int Left;
    int Right;
    int LeftSon;    // 左孩子的编号
    int RightSon;   // 右孩子的编号
} Tree[TreeSize];   //TreeSize 为树的大小

static int total;
void BuildTree(int left, int right)
{
    int now = ++total, mid = (left + right) / 2;
    Tree[now].Left = left;
    Tree[now].Right = right;
    if (right &gt; left + 1)
    {
        Tree[now].LeftSon = total + 1;
        BuildTree(left, mid);
        Tree[now].RightSon = total + 1;
        BuildTree(mid, right);
    }
}</code></pre>
            <p><strong>插入一条线段</strong>：每个节点增加一个变量 Count 记录该节点被所有插入线段覆盖的次数，自根节点往下，直到一个被线段完全覆盖的节点。于是树节点的结构要作改动，插入线段的代码如下：</p>
            <pre class="code"><code>//Author:zheng
struct node {
    int Left;
    int Right;
    int LeftSon;    // 左孩子的编号
    int RightSon;   // 右孩子的编号
    int Count;      // 被线段覆盖的次数
} Tree[TreeSize];   //TreeSize 为树的大小

void Insert(int num, int left, int right)
{
    int mid = (left + right) / 2;
    if (left &lt;= Tree[num].Left &amp;&amp; right &gt;= Tree[num].Right)
    {
        ++Tree[num].Count;
        return;
    }
    if (left &lt; mid)
    {
        Insert(Tree[num].LeftSon, left, mid);
    }
    if (right &gt; mid)
    {
        Insert(Tree[num].RightSon, mid, right);
    }
}</code></pre>
            <p>在线段树中删除和插入线段的方法类似，都采用递归逐层向两个子结点扫描，直到线段能够盖满结点表示的整个区间为止。请大家自己写出代码。</p>
            <p>经过分析可以发现：在线段树中插入、删除线段的时间复杂度均为 <span class="m">O(logN)</span>。线段树的深度不超过 logL。线段树把区间上的任意一条线段都分成不超过 2logL 条线段。这些性质为线段树能在 O(logL) 的时间内完成一条线段的插入、删除、查找等工作，提供了理论依据。</p>
            <p><strong>结点的测度 m</strong> 指的是结点所表示区间中线段覆盖过的长度：</p>
            <div class="formula"><p>m(i,j) = { count，当 count&gt;0；count=0 且节点为叶节点时为 0；count=0 且节点为内部节点时为 m(LSon) + m(RSon) }</p></div>
            <p><strong>连续线段数 line</strong> 指的是区间中互不相交的线段条数。连续线段数并不能像测度那样将两个子结点中的连续线段数简单相加，于是我们引进了两个量 lbd、rbd，分别表示区间的左右两端是否被线段覆盖：lbd=1 表示区间的左边端点被线段覆盖到，lbd=0 表示左边端点不被线段覆盖到；rbd 同理（对应右边端点）。line 可以根据 lbd、rbd 定义如下：</p>
            <div class="formula"><p>line = { 1，当 count&gt;0 且节点为叶节点；line(LSon)+line(RSon)−1，当 count&gt;0 且节点为内部节点且 LSon.lbd 与 RSon.rbd 都为 1；line(LSon)+line(RSon)，当 count&gt;0 且节点为内部节点，LSon.lbd 与 RSon.rbd 不同时为 1 }</p></div>
            <p>线段树能解决一些最基本的统计问题。但是如果处理一些需要进行修改的动态统计问题，困难就出现了。这时就需要改动树节点的内容来记录一些必要的信息。</p>
            <p><strong>线段树的推广</strong>——线段树处理的是线性统计问题，而我们往往会遇到一些平面统计问题和空间统计问题，因此我们需要推广线段树，使它变成二维线段树和多维线段树。</p>
            <p>将一维线段树改成二维线段树，有两种方法。一种就是给原来线段树中的每个结点都加多一棵线段树，即「树中有树」。容易算出，用这种方法构造一棵矩形 (x₁,y₁,x₂,y₂) 的线段树的空间复杂度为 O(NumOfRow·NumOfCol)，其中 NumOfRow、NumOfCol 分别表示矩形的长和宽。相应地，一次操作的时间复杂度为 <span class="m">O(lg(NumOfRow)·lg(NumOfCol))</span>。由于这种线段树有两层，处理起来较麻烦。</p>
            <p>另一种方法是将线段树结点中的线段变成矩形，从而变为矩形树。因此矩形树用的是四分的思想，每个矩形分割为 4 个子矩形。这是一棵以矩形 (1,1,4,3) 为根的矩形树。以 (x₁,y₁,x₂,y₂) 为根的矩形树的空间复杂度也为 O(NumOfRow·NumOfCol)。由于它只有一层，处理起来比第一种方法方便，而且在这种矩形树中，标记思想依然适用，而第一种方法中，标号思想在主线段树上并不适用，只能在第二层线段树上使用。但是这种方法的一次操作的时间复杂度可能会达到 O(NumOfRow)，比起第一种来就差了不少。</p>
            <p>对于多维的问题，第一种方法几乎不可能使用。因此我们可以仿照第二种方法。例如对于 n 维的问题，我们构造以 (a₁,a₂,a₃,…,a<sub>n</sub>,b₁,b₂,b₃,…,b<sub>n</sub>) 为根的线段树，其中 (a₁,a₂,a₃…,a<sub>n</sub>) 表示的是左上角的坐标，(b₁,b₂,b₃,…,b<sub>n</sub>) 表示的是右下角的坐标，用的是 2ⁿ 分的思想，构造出一棵 2ⁿ 叉树。结点的个数变为 2ⁿ×(b₁−a₁)×(b₂−a₂)×……×(b<sub>n</sub>−a<sub>n</sub>)。</p>
            <p><strong>2. 树状数组</strong>——利用树状数组，编程的复杂度提高了，但程序的时间效率也大幅地提高。这正是利用了树结构能够减少搜索范围，将信息集中起来的优点，让更新数组和求和运算牵连尽量少的变量。</p>
            <p>通过一个小题目来介绍一下树状数组：给出一个一维整数序列，对这个序列有两种操作：使第 k 个元素的值增加 x（k 和 x 由输入数据给定）；求解前 m 个元素的和（m 由输入数据给定）。</p>
            <p>先将问题简化，考察一维子序列求和的算法。设该序列为 a[1]，a[2]……a[n]。</p>
            <ul>
              <li><strong>算法 1</strong>：直接在原序列中计算。显然更新元素值的时间复杂度为 O(1)；在最坏情况下，子序列求和的时间复杂度为 O(n)。</li>
              <li><strong>算法 2</strong>：增加数组 b，其中 b[i]＝a[1]+a[2]+……+a[i]。由于 a[i] 的更改影响 b[i] ……b[n]，因此在最坏情况下更新元素值的算法复杂度为 O(n)；而子序列求和的算法复杂度仅为 O(1)。</li>
            </ul>
            <p>以上两种算法，要么在更新元素值上耗费时间过长（算法 1），要么在子序列求和上无法避免大量运算（算法 2）。有没有更好的方法呢？</p>
            <p><strong>算法 3</strong>：增加数组 C，其中 <span class="m">C[i] = a[i−2<sup>k</sup>+1] + …… + a[i]</span>（k 为 i 在二进制形式下末尾 0 的个数）。由 C 数组的定义可以得出：</p>
            <pre class="code"><code>c[1] = a[1]
c[2] = a[1] + a[2] = c[1] + a[2]
c[3] = a[3]
c[4] = a[1] + a[2] + a[3] + a[4] = c[2] + c[3] + a[4]
c[5] = a[5]
c[6] = a[5] + a[6] = c[5] + a[6]
………………</code></pre>
            <p>C 数组的结构对应一棵树，因此称之为树状数组。在统计更新元素值和子序列求和的算法复杂度后，会发现两种操作的时间复杂度均为 <span class="m">O(logN)</span>，大大提高了算法效率。</p>
            <p>不难想出若 a[k] 所牵动的序列为 C[p₁]，C[p₂]……C[p<sub>m</sub>]，则 p₁=k，而 p<sub>i+1</sub> = p<sub>i</sub> + 2<sup>l<sub>i</sub></sup>（l<sub>i</sub> 为 p<sub>i</sub> 在二进制中末尾 0 的个数）。由此得出更改元素值的方法：若将 x 添加到 a[k]，则 C 数组中 C[p₁]、C[p₂]、…、C[p<sub>m</sub>]（p<sub>m</sub>≤n&lt;p<sub>m+1</sub>）受其影响，亦应该添加 x。</p>
            <p>例如 a[1]……a[9] 中，a[3] 添加 x：p₁ = k = 3；p₂ = 3+2⁰ = 4；p₃ = 4+2² = 8；p₄ = 8+2³ = 16&gt;9。由此得出，c[3]、c[4]、c[8] 亦应该添加 x。</p>
            <p>子序列求和可以转化为求由 a[1] 开始的序列 a[1]……a[k] 的和 S。而在树状数组中求 S 十分简单：根据 <span class="m">c[k] = a[k−2<sup>l</sup>+1] + … + a[k]</span>（l 为 k 在二进制数中末尾 0 的个数），我们从 k₁=k 出发，按照 k<sub>i+1</sub> = k<sub>i</sub> − 2<sup>l<sub>k<sub>i</sub></sub></sup>（l<sub>k<sub>i</sub></sub> 为 k<sub>i</sub> 在二进制数中末尾 0 的个数），于是递推 k₂，k₃，…，k<sub>m</sub>（k<sub>m+1</sub>=0）。由此得出：<span class="m">S = c[k₁] + c[k₂] + c[k₃] + … + c[k<sub>m</sub>]</span>。</p>
            <p>例如，计算 a[1]+a[2]+a[3]+a[4]+a[5]+a[6]+a[7]：k₁=7；k₂ = k₁−2<sup>l₁</sup> = 7−2⁰ = 6；k₃ = k₂−2<sup>l₂</sup> = 6−2¹ = 4；k₄ = k₃−2<sup>l₃</sup> = 4−2² = 0。即 a[1]+a[2]+a[3]+a[4]+a[5]+a[6]+a[7] = c[7]+c[6]+c[4]。</p>
            <p>对于我们提出的一维问题，用前面介绍的方法就可以轻易地解决了。注意我们所需要消耗的内存仅是一个很单一的数组，它的构造比起线段树来说要简单得多（很明显，这个问题也可以用前面的线段树结构来解决）。</p>
            <p>可以把这个一维的问题推广到二维。如何推广呢？模仿一维问题的解法，可以将 C[x,y] 定义为：</p>
            <div class="formula"><p>C[x,y] = Σ a[i,j]　（x−2<sup>sx</sup> &lt; i ≤ x，y−2<sup>sy</sup> &lt; j ≤ y）</p></div>
            <p>其中 s<sub>x</sub> 为 x 在二进制形式下末尾 0 的个数，s<sub>y</sub> 为 y 在二进制形式下末尾 0 的个数。其具体的修改和求和过程实际上是一维过程的嵌套，这里省略其具体描述。可以发现，经过这次推广，算法的复杂度为 log²n。而就空间而言，我们仅将一维数组简单地变为二维数组，推广的耗费是比较低的。可以尝试类似地建立二维线段树来解决这个问题，它的复杂性要比树状数组的方法高得多。</p>
          `,
        },
      ],
    },
  ],
};

export default deck;
