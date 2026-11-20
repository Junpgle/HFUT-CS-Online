/* 计算机体系结构 · 2019 级期末回忆版 —— 依据「试题/期末/2019级计算机体系结构期末考试回忆版试题及要点.pdf」整理；
 * 部分答案参考同课程「附件/期末/合肥工业大学2019-2020学年第二学期计算机体系结构期末考试A卷及参考答案.pdf」。 */
import type { CaPaper } from './types';

const paper: CaPaper = {
  id: 'recall-2019',
  title: '2019 级期末（回忆版）',
  source: '原卷为考后回忆，小题只记录了考点（选择题选项、部分计算题题面未留存），残缺项已在题内注明',
  answerSource: '回忆要点',
  sections: [
    { title: '一、选择题（回忆）', questionIds: ['q2-1'] },
    { title: '二、简答题（回忆）', questionIds: ['q2-2', 'q2-3', 'q2-4', 'q2-5'] },
    { title: '三、计算题（回忆）', questionIds: ['q2-6', 'q2-7', 'q2-8', 'q2-9', 'q2-10'] },
  ],
  questions: [
    {
      id: 'q2-1',
      kind: 'essay',
      question:
        '<p><strong>选择（回忆）</strong>：原卷选择共 5 题 10 分，其中一题考查「以下哪项<strong>不属于</strong>计算机体系结构的八大 Great Ideas」——回忆版未记录选项。请写出这八条 Great Ideas 的内容。</p>',
      answer:
        '<ol><li>Design for Moore\'s Law（面向摩尔定律设计）</li><li>Use abstraction to simplify design（用抽象简化设计）</li><li>Make the common case fast（加速经常性事件）</li><li>Performance via parallelism（通过并行提高性能）</li><li>Performance via pipelining（通过流水线提高性能）</li><li>Performance via prediction（通过预测提高性能）</li><li>Hierarchy of memories（存储器层次）</li><li>Dependability via redundancy（通过冗余提高可靠性）</li></ol>',
      explanation:
        '<p>八条内容来自课件中的 "Great Ideas in Computer Architectures" 幻灯片（第 2 讲性能评测的动机「make the common case fast」即第 3 条）。原卷为「四选一挑出不属于」的题型，选项未记录，故以默写形式保留考点。</p>',
      tags: [
        { deck: 2, sec: 'sec-ch2-amdahl', text: 'Amdahl 定律（common case fast）' },
        { deck: 2, sec: 'sec-ch2-perf', text: '性能指什么' },
      ],
    },
    {
      id: 'q2-2',
      kind: 'essay',
      question:
        '<p><strong>简答 1</strong>：流水级如果一直增大，为什么会存在瓶颈（就流水线寄存器延迟等方面分析）？</p>',
      answer:
        '<p><strong>不是流水级越多越好</strong>：① 流水线并不能减少一条指令执行的实际时间，只能增加吞吐率——流水线各阶段的时间需要保持一致，故需要以时间最大的阶段为准，可能会延长实际的执行时间；② 段数越多越容易造成数据相关、控制相关，进而造成冲突；③ 存在流水线寄存器延时、时钟偏移延时，段数增加，延时增加；④ 级数增加需要增加更多的硬件，设计困难，开销大，功耗大。</p>',
      explanation:
        '<p>参考答案来自同课程 A 卷答案卷（原文照录）。可补充公式视角：K 阶流水线吞吐率 <span class="m">BW = 1/(T/k + S)</span>，当每段有效逻辑 T/k 小到与锁存器延迟 S 相当时，吞吐率被 1/(1 gate delay + S) 封顶（第 5 讲）。</p>',
      tags: [
        { deck: 5, sec: 'sec-ch5-real', text: '现实的流水线：吞吐率与开销' },
        { deck: 5, sec: 'sec-ch5-ideal', text: '理想照进现实：偏差与停顿' },
      ],
    },
    {
      id: 'q2-3',
      kind: 'essay',
      question: '<p><strong>简答 2</strong>：页表块（页）的大或者小各自有什么优点和缺点？</p>',
      answer:
        '<p><strong>页大</strong>：+ 页表项少、页表小，减少 PT 的存储与访问开销；+ TLB 一项覆盖的地址范围大，TLB 命中率高，SUPER PAGE 即为此目的出现；− 页内碎片（内部碎片）变大，小对象浪费空间；− 载入/换出一页的传输时间变长。<br><strong>页小</strong>：+ 内部碎片小、空间利用率高；− 页表项多、页表大（32 位 4K 页时页表达 4M）；− TLB 覆盖范围小、命中率下降，地址转换的额外访问更频繁。</p>',
      explanation:
        '<p>课件口径：VM 中内存以较大的块（Page）管理，典型页大小 4K–16K，近年出现 super page 以减少 PT 的开销——本答案围绕「页表大小 / TLB 覆盖 / 碎片 / 传输代价」四个维度展开。原卷未留存标准答案，此为本站整理。</p>',
      tags: [{ deck: 12, sec: 'sec-ch12-four', text: 'VM 的四个核心问题' }],
    },
    {
      id: 'q2-4',
      kind: 'essay',
      question:
        '<p><strong>简答 3</strong>：数据和指令存储器合并或分离，各自有什么优缺点（也就是指令和数据放在不同存储器还是放在相同存储器的问题）？</p>',
      answer:
        '<p><strong>合并</strong>（Princeton 架构）：+ 共享缓存空间，不需要分离设计中空间的 overprovisioning（谁用得多谁多占）；− 指令和数据可能相互竞争、没有空间保障；− 流水线中指令和数据在不同的阶段访问（IF 与 MEM），合并会带来<strong>结构冲突</strong>，只能插入气泡或增加端口。<br><strong>分离</strong>（Harvard 架构）：+ 取指与访存可以同时进行（无结构冲突），带宽各自保障；− 空间不能共享，可能出现一边紧张一边空闲。当前商用 CPU 的一级缓存绝大多数采取分离方案，二级及其它级别通常采用合并方案。</p>',
      explanation: '<p>课件口径照搬（第 10 讲）。原卷未留存标准答案，此为本站整理。</p>',
      tags: [{ deck: 10, sec: 'sec-ch10-write', text: '写策略与写分配（Harvard/Princeton）' }],
    },
    {
      id: 'q2-5',
      kind: 'essay',
      question:
        '<p><strong>简答 4</strong>：ROB（重排序缓冲器）。<em>（回忆版仅记录考点：「ROB，具体考啥我忘记了」——故以「ROB 的作用与组成」作答。）</em></p>',
      answer:
        '<p><strong>作用</strong>：前瞻执行把结果先写入 ROB 而不写寄存器/存储器，等指令得到确认后再写回——<strong>允许指令乱序执行、但必须按序确认</strong>，从而实现<strong>精确异常</strong>；ROB 还承担了 Tomasulo 中保留站的换名功能。<br><strong>组成</strong>（每项 4 个字段）：指令类型（分支/store/寄存器操作）、目标地址（目标寄存器号或存储单元地址）、数据值（前瞻执行结果）、就绪字段（是否执行完且数据就绪）。<br><strong>确认规则</strong>：非分支非 store 指令到达 ROB 队头且结果就绪→写目标寄存器并删除该 ROB 项；store 指令到达队头→写入存储器；分支预测错误→清空 ROB 并从正确路径重新执行。</p>',
      explanation: '<p>来自第 8 讲课件（前瞻执行与 ROB 四字段）。原卷具体问法未留存，按考点作答。</p>',
      tags: [{ deck: 8, sec: 'sec-ch8-rob', text: '前瞻执行与 ROB' }],
    },
    {
      id: 'q2-6',
      kind: 'essay',
      question:
        '<p><strong>计算 1</strong>：(1) 用自己的语言概括 Amdahl 定律；(2) 给出一个例子进行极限情况的计算。</p>',
      answer:
        '<p><strong>(1)</strong> Amdahl 定律描述了提升某个部件性能后总体性能的提升：整体性能的提升与可加速部分运行时间占比有关——只对部分进行改进，提升越多，最终所获得的加速比越有限，最终会趋向于 <span class="m">1/(1 − f)</span>，表明了性能提升的上限，对资源分配、提升性能有启发意义。</p><p><strong>(2) 极限计算示例</strong>：某程序 40% 的时间花在可并行部分（f = 0.4），把该部分加速比提高到无穷大，则加速比上限 = 1/(1 − 0.4) = <strong>1.67 倍</strong>；若该部分只加速 4 倍，则实际加速比 = 1/(0.6 + 0.4/4) = <strong>1.43 倍</strong>——与上限只差 0.24。</p>',
      explanation:
        '<p>(1) 原文照录 A 卷答案卷；(2) 按第 2 讲的 Amdahl 公式套算（课件示例：5% 部分加速无穷大时 speedup = 1.052）。</p>',
      tags: [{ deck: 2, sec: 'sec-ch2-amdahl', text: 'Amdahl 定律' }],
    },
    {
      id: 'q2-7',
      kind: 'essay',
      question:
        '<p><strong>计算 3</strong>：考虑一个循环访问 4 个地址 A、B、C、D 的访问序列（ABCDABCD…）。基于该访问序列，回答不同的缓存替换算法在一个 <strong>2 个条目的全相联缓存</strong>中的问题：(1) 根据 LRU 替换算法完成表格，并计算长期缺失率（注意每次访问是命中 H 还是缺失 M）；(2) 基于理想的替换算法，完成表格并计算长期缺失率。</p>',
      answer:
        '<p><strong>(1) LRU</strong>（2 条目，序列 ABCD 循环）：每次访问都缺失——任何时刻组内只存最近 2 个块，而 4 个块循环使用，下一个要访问的块总是刚被逐出的那个。</p><table class="tbl"><thead><tr><th>访问</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th><th>11</th></tr></thead><tbody><tr><td>地址</td><td>A</td><td>B</td><td>C</td><td>D</td><td>A</td><td>B</td><td>C</td><td>D</td><td>A</td><td>B</td><td>C</td><td>D</td></tr><tr><td>路-1</td><td>–</td><td>A</td><td>A</td><td>C</td><td>C</td><td>A</td><td>A</td><td>C</td><td>C</td><td>A</td><td>A</td><td>C</td></tr><tr><td>路-2</td><td>–</td><td>–</td><td>B</td><td>B</td><td>D</td><td>D</td><td>B</td><td>B</td><td>D</td><td>D</td><td>B</td><td>B</td></tr><tr><td>命中</td><td>N</td><td>N</td><td>N</td><td>N</td><td>N</td><td>N</td><td>N</td><td>N</td><td>N</td><td>N</td><td>N</td><td>N</td></tr></tbody></table><p>LRU 长期缺失率 = <strong>100%</strong>（原卷标注）。</p><p><strong>(2) 理想替换</strong>（Belady：替换将来最久才被访问的块，按原卷表格）：</p><table class="tbl"><thead><tr><th>访问</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th><th>11</th></tr></thead><tbody><tr><td>地址</td><td>A</td><td>B</td><td>C</td><td>D</td><td>A</td><td>B</td><td>C</td><td>D</td><td>A</td><td>B</td><td>C</td><td>D</td></tr><tr><td>路-1</td><td>–</td><td>A</td><td>A</td><td>A</td><td>A</td><td>B</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td><td>C</td></tr><tr><td>路-2</td><td>–</td><td>–</td><td>B</td><td>C</td><td>D</td><td>D</td><td>D</td><td>D</td><td>D</td><td>D</td><td>A</td><td>B</td></tr><tr><td>命中</td><td>N</td><td>N</td><td>N</td><td>N</td><td>Y</td><td>N</td><td>N</td><td>Y</td><td>N</td><td>N</td><td>Y</td><td>N</td></tr></tbody></table><p>长期缺失率 = <strong>66%</strong>（原卷标注）。</p>',
      explanation:
        '<p>表格与两个缺失率均为原卷（回忆版附答案）照录。<strong>口径提示</strong>：LRU 的 100% 是全部访问的缺失率；理想替换按原表共 12 次访问、3 次命中（访问 4、7、10），原卷标注的「长期缺失率 66%」按剔除首轮强制性缺失的稳态口径计算——逐格核对表格时注意口径差异。结论：<strong>2 条目全相联 + 4 块循环 = set thrashing 的典型场景</strong>，LRU 完全失效，理想算法也只能获得有限命中。</p>',
      tags: [
        { deck: 10, sec: 'sec-ch10-replace', text: '替换策略' },
        { deck: 10, sec: 'sec-ch10-assoc', text: '组相联与全相联' },
      ],
    },
    {
      id: 'q2-8',
      kind: 'essay',
      question:
        '<p><strong>计算 4（回忆残缺）</strong>：32 位与 64 位的机器，问虚拟存储器和 cache 里，索引、标记等各自多少位。<em>（原卷的具体参数未记录，请给出通用计算步骤。）</em></p>',
      answer:
        '<p><strong>cache 的地址划分</strong>（物理地址或虚拟地址宽度 = W）：块内偏移位数 = log<sub>2</sub>(块大小)；索引位数 = log<sub>2</sub>(组数) = log<sub>2</sub>(缓存容量 / (块大小 × 相联度))；标记位数 = W − 索引位数 − 块内偏移位数。<br>例：32 位机器、32KB 缓存、64B 块、2 路组相联 → 偏移 6 位、组数 = 32K/(64×2) = 256 → 索引 8 位、标记 = 32 − 8 − 6 = 18 位。64 位机器其余参数相同 → 标记 = 64 − 8 − 6 = 50 位。<br><strong>虚拟存储器</strong>：VPN 位数 = 地址宽度 − log<sub>2</sub>(页大小)；页表项数 = 2<sup>VPN 位数</sup>；页表大小 = 页表项数 × PTE 大小（32 位、4K 页时 2<sup>20</sup> × 4B = 4MB）。</p>',
      explanation:
        '<p>原卷参数未记录，按课件公式给出通用算法（第 10 讲地址三段划分 + 第 12 讲页表大小）。考试时把题给参数代入即可。</p>',
      tags: [
        { deck: 10, sec: 'sec-ch10-map', text: '地址划分与直接相联' },
        { deck: 12, sec: 'sec-ch12-fault', text: '页错误与地址转换' },
      ],
    },
    {
      id: 'q2-9',
      kind: 'essay',
      question:
        '<p><strong>计算 5（回忆残缺）</strong>：BHT（分支历史表）的考察——给出一段含循环和跳转的指令序列与循环次数，1 位的 BHT 和 2 位的 BHT 各自作为一个小题，先问 1 位、再问 2 位。<em>（原卷指令序列未记录，请说明两种 BHT 的预测过程与差异。）</em></p>',
      answer:
        '<p><strong>1 位 BHT</strong>：记录该分支最近一次的方向，按「上次怎样、这次还怎样」预测。循环场景：执行 n 次的分支，第 1 次预测错误（表中初始值不匹配），随后 n−1 次正确，退出时又错一次——共 <strong>2 次预测错误/每轮循环</strong>。<br><strong>2 位 BHT</strong>：为饱和计数器（11 强跳、10 弱跳、01 弱不跳、00 强不跳），只有连续两次同向才翻转预测。循环退出时要连续错 2 次才能改判——若循环体较长（n ≥ 3），错误次数与 1 位相同（进入时 1 次、退出时 2 次）；循环体很短（n 小）时 2 位的滞后可能略多错 1 次。<br><strong>答题步骤</strong>：按指令顺序列出每条分支的访问时刻 → 查表得预测值 → 与真实方向比对（H/M）→ 更新表项 → 统计两次预测错误。</p>',
      explanation:
        '<p>原卷序列未记录，按第 8 讲的 2 位状态机与「考虑循环首尾」提示给出方法级答案。期末若给具体序列，照此步骤逐拍列表即可。</p>',
      tags: [{ deck: 8, sec: 'sec-ch8-bht', text: '动态分支预测：BHT 与 BTB' }],
    },
    {
      id: 'q2-10',
      kind: 'essay',
      question:
        '<p><strong>计算 6（开放题）</strong>：给一个领域现在面临的困难，问我们作为当代大学生，应该要怎么样，从多个角度进行分析。</p>',
      answer:
        '<p><strong>示例（芯片/体系结构领域，答出任意领域均可）</strong>：<br>① <strong>技术角度</strong>：功耗墙、存储墙、ILP 天花板——从工艺、体系结构、算法多层协同突破（多核、异构、存算一体）；<br>② <strong>产业角度</strong>：高端设备与人才受制、先进技术被垄断——需要发展自主的核心技术链，从设计工具、EDA 到工艺；<br>③ <strong>个人角度</strong>：打好体系结构/编译/系统的基础（本课程即基础），关注前沿论文与开源项目（如 RISC-V），参与竞赛与科研训练；<br>④ <strong>价值观角度</strong>：爱国不一定要从事某一具体职业——在基础科研、工程实践或产业岗位上把一件事做好，都是值得敬重的人。</p>',
      explanation:
        '<p>开放题无标准答案；此处参考思路整合了 A 卷答案卷中的两条要点（科技实力与卡脖子、芯片领域的高端设备与人才）与课程内容（功耗墙、Amdahl、存储层次），评分看角度数量与逻辑。</p>',
      tags: [
        { deck: 13, sec: 'sec-ch13-power', text: '功耗墙与多核的必然' },
        { deck: 2, sec: 'sec-ch2-amdahl', text: 'Amdahl 定律' },
      ],
    },
  ],
};

export default paper;
