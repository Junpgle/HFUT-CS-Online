/* 期末大题精讲 —— 依据「课件/复习资料/操作系统原理课件.pptx」（操作系统原理大题讲解）整理；
 * 银行家算法一题与第 3 章课件算例同源（T0 时刻数据一致），表数据取自第 3 章课件。 */
import type { OsChapter } from './types';

const ch: OsChapter = {
  id: 'ch8',
  no: '大题精讲',
  title: '期末大题精讲',
  subtitle: '期末大题精讲 · 七类大题逐题演算',
  lede: `
  依据课程组提供的复习课件《操作系统原理大题讲解》整理，覆盖七类期末大题：<strong>地址变换和求 FAT 表大小、可变分区管理、
        页面置换算法、磁盘调度算法、处理机调度算法、银行家算法、进程的同步与互斥</strong>。每类给出原题与逐步演算，适合考前对照练笔。
`,
  toc: [
    { id: 'sec-ch8-addr', text: '1. 地址变换和求 FAT 表大小', level: 2 },
    { id: 'sec-ch8-partition', text: '2. 可变分区管理', level: 2 },
    { id: 'sec-ch8-replace', text: '3. 页面置换算法', level: 2 },
    { id: 'sec-ch8-disk', text: '4. 磁盘调度算法', level: 2 },
    { id: 'sec-ch8-sched', text: '5. 处理机调度算法', level: 2 },
    { id: 'sec-ch8-banker', text: '6. 银行家算法', level: 2 },
    { id: 'sec-ch8-sync', text: '7. 进程的同步与互斥', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ch8-addr',
      heading: '1. 地址变换和求 FAT 表大小',
      blocks: [
        {
          type: 'html',
          html: `
          <div class="callout key">
            <p class="callout-h">例 1（地址变换）</p>
            <p>某一页表内容自 0～7 依次为 03、07、0B、11、1A、1D、20、22。请计算页面大小为 1K 和 4K 时的逻辑地址 134D 对应的物理地址。</p>
          </div>
          <p><strong>解</strong>：页面大小为 1K 时，134DH =（0001 00 ｜ 11 0100 1101）<sub>2</sub>，因此页号为（000100）<sub>2</sub> = 4，对应的块号为 1AH，物理地址为（01 1010 ｜ 11 0100 1101）<sub>2</sub> = 6B4DH。</p>
          <p>页面大小为 4K 时，134DH =（0001 ｜ 0011 0100 1101）<sub>2</sub>，因此页号为（0001）<sub>2</sub> = 1，对应的块号为 07H，物理地址为（0111 ｜ 0011 0100 1101）<sub>2</sub> = 734DH。</p>
          <div class="callout key">
            <p class="callout-h">例 2（FAT 表大小）</p>
            <p>假定磁盘块的大小为 1K，对于 540M 的硬盘，其文件分配表 FAT 需要占用多少存储空间？当硬盘容量为 1.2G 时，FAT 需要占用多少空间？</p>
          </div>
          <p><strong>解</strong>：由题目所给条件可知，硬盘大小为 540M，磁盘块的大小为 1K，所以该硬盘共有盘块 540M/1K = 540K（个）。又 512K &lt; 540K &lt; 1024K，故 540K 个盘块号要用 20 位二进制表示，即文件分配表的每个表目为 2.5 个字节。FAT 要占用的存储空间总数为：2.5 × 540K = 1350K。</p>
          <p>当硬盘大小为 1.2G，硬盘共有盘块 1.2G/1K = 1.2M（个）。又 1M &lt; 1.2M &lt; 2M，故 1.2M 个盘块号要用 21 位二进制表示。为方便文件分配表的存取，每个表目用 24 位二进制表示，即文件分配表的每个表目大小为 3 个字节。FAT 要占用的存储空间总数为：3 × 1.2M = 3.6M。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch8-partition',
      heading: '2. 可变分区管理',
      blocks: [
        {
          type: 'html',
          html: `
          <div class="callout key">
            <p class="callout-h">例题</p>
            <p>在如下分区表的基础上，按照首次适应和最佳适应两种算法依次分配五个进程 P0、P1、P2、P3、P4 时的进程开始地址。五个进程的大小为 P0：200K，P1：15K，P2：100K，P3：80K，P4：20K。</p>
            <table class="tbl">
              <thead><tr><th>分区编号</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th></tr></thead>
              <tbody>
                <tr><td>起始地址</td><td>10K</td><td>200K</td><td>250K</td><td>320K</td><td>500K</td><td>850K</td></tr>
                <tr><td>分区大小</td><td>100K</td><td>30K</td><td>50K</td><td>150K</td><td>300K</td><td>220K</td></tr>
              </tbody>
            </table>
          </div>
          <p><strong>解</strong>：首次适应是指根据进程的大小，在分区表中查找第一个能够装下进程内容的分区。对于本例来说，P0 进程为 200K，在分区表中从左到右查找能够装下 P0 进程的分区（即分区大小 ≥ 进程大小）为 5 号分区，所以 P0 进程的起始地址为 5 号分区的起始地址 500K。分配 P0 后 5 号分区就会变成起始地址 700K（原始起始地址 500K + 进程 P0 大小 200K）、大小为 100K（原始大小 300K − P0 进程大小 200K），以此类推，可计算出其他进程的起始地址。</p>
          <p>最佳适应是指查找某个分区大小最接近当前进程大小。对于 P0 进程来说，最接近其容量（必需大于等于）的分区为 6 号分区，所以 P0 进程在最佳适应分配算法的处理下，起始地址为 6 号分区的起始地址 850K。分配 P0 进程后 6 号分区变成起始地址为 1050K、大小为 20K 的分区，可以最佳装入 P1 进程，因此 P1 进程的起始地址为 1050K。</p>
          <table class="tbl">
            <thead><tr><th></th><th>P0</th><th>P1</th><th>P2</th><th>P3</th><th>P4</th></tr></thead>
            <tbody>
              <tr><td>首次适应</td><td>500K</td><td>10K</td><td>320K</td><td>25K</td><td>200K</td></tr>
              <tr><td>最佳适应</td><td>850K</td><td>1050K</td><td>10K</td><td>320K</td><td>200K</td></tr>
            </tbody>
          </table>
          `,
        },
      ],
    },
    {
      id: 'sec-ch8-replace',
      heading: '3. 页面置换算法',
      blocks: [
        {
          type: 'html',
          html: `
          <div class="callout key">
            <p class="callout-h">例题</p>
            <p>在一个请求分页系统中，有一个长度为 5 页的进程，假如系统为它分配 3 个物理块，并且此进程的页面走向为 2，3，2，1，5，2，4，5，3，2，5，2。分别用 FIFO、LRU、OPT 算法分别计算出程序访问过程中所发生的缺页次数。</p>
          </div>
          <p><strong>解：FIFO</strong>（先进先出——淘汰最早进入的页）：</p>
          <table class="tbl">
            <thead><tr><th>走向</th><th>2</th><th>3</th><th>2</th><th>1</th><th>5</th><th>2</th><th>4</th><th>5</th><th>3</th><th>2</th><th>5</th><th>2</th></tr></thead>
            <tbody>
              <tr><td>第 1 页</td><td>2</td><td>2</td><td>2</td><td>2</td><td>5</td><td>5</td><td>5</td><td>5</td><td>3</td><td>3</td><td>3</td><td>3</td></tr>
              <tr><td>第 2 页</td><td></td><td>3</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>5</td><td>5</td></tr>
              <tr><td>第 3 页</td><td></td><td></td><td></td><td>1</td><td>1</td><td>1</td><td>4</td><td>4</td><td>4</td><td>4</td><td>4</td><td>2</td></tr>
            </tbody>
          </table>
          <p>缺页中断次数 = <strong>9</strong>。</p>
          <p><strong>LRU</strong>（最近最久未使用——淘汰最长时间未被访问的页）：</p>
          <table class="tbl">
            <thead><tr><th>走向</th><th>2</th><th>3</th><th>2</th><th>1</th><th>5</th><th>2</th><th>4</th><th>5</th><th>3</th><th>2</th><th>5</th><th>2</th></tr></thead>
            <tbody>
              <tr><td>第 1 页</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>3</td><td>3</td><td>3</td><td>3</td></tr>
              <tr><td>第 2 页</td><td></td><td>3</td><td>3</td><td>3</td><td>5</td><td>5</td><td>5</td><td>5</td><td>5</td><td>5</td><td>5</td><td>5</td></tr>
              <tr><td>第 3 页</td><td></td><td></td><td></td><td>1</td><td>1</td><td>1</td><td>4</td><td>4</td><td>4</td><td>2</td><td>2</td><td>2</td></tr>
            </tbody>
          </table>
          <p>缺页中断次数 = <strong>7</strong>。</p>
          <p><strong>OPT</strong>（最佳置换——淘汰以后最长时间不再使用的页）：</p>
          <table class="tbl">
            <thead><tr><th>走向</th><th>2</th><th>3</th><th>2</th><th>1</th><th>5</th><th>2</th><th>4</th><th>5</th><th>3</th><th>2</th><th>5</th><th>2</th></tr></thead>
            <tbody>
              <tr><td>第 1 页</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>4</td><td>4</td><td>4</td><td>2</td><td>2</td><td>2</td></tr>
              <tr><td>第 2 页</td><td></td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td></tr>
              <tr><td>第 3 页</td><td></td><td></td><td></td><td>1</td><td>5</td><td>5</td><td>5</td><td>5</td><td>5</td><td>5</td><td>5</td><td>5</td></tr>
            </tbody>
          </table>
          <p>缺页中断次数 = <strong>6</strong>。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch8-disk',
      heading: '4. 磁盘调度算法',
      blocks: [
        {
          type: 'html',
          html: `
          <div class="callout key">
            <p class="callout-h">例题</p>
            <p>某磁盘有 8192 个磁道，编号为 0～8191。在完成了磁道 1250 处的请求后，当前正在磁道 3500 处为一个请求服务。若此时请求队列的先后顺序为 1000，4000，3300，5600，1300，6000，1200，2500。回答下述问题：(1) 采用 FCFS（先来先服务）算法完成上述请求，请写出磁头移动的顺序，并计算平均寻道长度；(2) 采用 SSTF（最短寻道时间优先）算法；(3) 采用 SCAN（电梯）算法。</p>
          </div>
          <p><strong>(1) FCFS</strong>（按请求队列先后顺序）：</p>
          <p>3500→1000 移动 2500；1000→4000 移动 3000；4000→3300 移动 700；3300→5600 移动 2300；5600→1300 移动 4300；1300→6000 移动 4700；6000→1200 移动 4800；1200→2500 移动 1300。</p>
          <div class="formula">平均寻道长度 =（2500 + 3000 + 700 + 2300 + 4300 + 4700 + 4800 + 1300）／8 = <span class="m">2950</span></div>
          <p><strong>(2) SSTF</strong>（哪个请求的寻道位置与当前位置最近，先为该请求服务）：</p>
          <p>3500→3300 移动 200；3300→4000 移动 700；4000→2500 移动 1500；2500→1300 移动 1200；1300→1200 移动 100；1200→1000 移动 200；1000→5600 移动 4600；5600→6000 移动 400。</p>
          <div class="formula">平均寻道长度 =（200 + 700 + 1500 + 1200 + 100 + 200 + 4600 + 400）／8 = <span class="m">1112.5</span></div>
          <p><strong>(3) SCAN</strong>（模仿电梯动作规律——由于磁头从 1250 到达 3500，因此先向大磁道号方向处理，再向小磁道号方向处理）：</p>
          <p>3500→4000 移动 500；4000→5600 移动 1600；5600→6000 移动 400；6000→3300 移动 2700；3300→2500 移动 800；2500→1300 移动 1200；1300→1200 移动 100；1200→1000 移动 200。</p>
          <div class="formula">平均寻道长度 =（500 + 1600 + 400 + 2700 + 800 + 1200 + 100 + 200）／8 = <span class="m">937.5</span></div>
          `,
        },
      ],
    },
    {
      id: 'sec-ch8-sched',
      heading: '5. 处理机调度算法',
      blocks: [
        {
          type: 'html',
          html: `
          <div class="callout key">
            <p class="callout-h">例题</p>
            <p>分别计算按 FCFS 算法和 SJF 算法调度以下进程时的平均周转时间和平均带权周转时间。</p>
            <table class="tbl">
              <thead><tr><th>进程名称</th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th></tr></thead>
              <tbody>
                <tr><td>到达时间</td><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td></tr>
                <tr><td>服务时间</td><td>4</td><td>3</td><td>5</td><td>2</td><td>4</td></tr>
              </tbody>
            </table>
          </div>
          <p><strong>FCFS（先来先服务）算法</strong>：</p>
          <table class="tbl">
            <thead><tr><th>进程名称</th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th></tr></thead>
            <tbody>
              <tr><td>到达时间</td><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td></tr>
              <tr><td>服务时间</td><td>4</td><td>3</td><td>5</td><td>2</td><td>4</td></tr>
              <tr><td>完成时间</td><td>4</td><td>7</td><td>12</td><td>14</td><td>18</td></tr>
              <tr><td>周转时间（完成时间 − 到达时间）</td><td>4</td><td>6</td><td>10</td><td>11</td><td>14</td></tr>
              <tr><td>带权周转时间（周转时间 / 服务时间）</td><td>1</td><td>2</td><td>2</td><td>5.5</td><td>3.5</td></tr>
            </tbody>
          </table>
          <div class="formula">平均周转时间 =（4 + 6 + 10 + 11 + 14）／5 = <span class="m">9</span>　　平均带权周转时间 =（1 + 2 + 2 + 5.5 + 3.5）／5 = <span class="m">2.8</span></div>
          <p><strong>SJF（短作业优先）算法</strong>（0 时刻只有 A 可运行；4 时刻在 B、C、D、E 中选服务时间最短的 D，依次类推）：</p>
          <table class="tbl">
            <thead><tr><th>进程名称</th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th></tr></thead>
            <tbody>
              <tr><td>到达时间</td><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td></tr>
              <tr><td>服务时间</td><td>4</td><td>3</td><td>5</td><td>2</td><td>4</td></tr>
              <tr><td>完成时间</td><td>4</td><td>9</td><td>18</td><td>6</td><td>13</td></tr>
              <tr><td>周转时间（完成时间 − 到达时间）</td><td>4</td><td>8</td><td>16</td><td>3</td><td>9</td></tr>
              <tr><td>带权周转时间（周转时间 / 服务时间）</td><td>1</td><td>8/3</td><td>16/5</td><td>3/2</td><td>9/4</td></tr>
            </tbody>
          </table>
          <div class="formula">平均周转时间 =（4 + 8 + 16 + 3 + 9）／5 = <span class="m">8</span>　　平均带权周转时间 =（1 + 2.67 + 3.2 + 1.5 + 2.25）／5 = <span class="m">2.124</span></div>
          `,
        },
      ],
    },
    {
      id: 'sec-ch8-banker',
      heading: '6. 银行家算法',
      blocks: [
        {
          type: 'html',
          html: `
          <div class="callout key">
            <p class="callout-h">例题</p>
            <p>假定系统中有五个进程｛P0, P1, P2, P3, P4｝和三类资源｛A, B, C｝，各种资源的数量分别为 10、5、7。在 T0 时刻的资源分配情况如下表（Max / Allocation / Need / Available，数据与第 3 章课件算例一致）：</p>
            <table class="tbl">
              <thead><tr><th>进程</th><th>Max (A B C)</th><th>Allocation (A B C)</th><th>Need (A B C)</th><th>Available (A B C)</th></tr></thead>
              <tbody>
                <tr><td>P0</td><td>7 5 3</td><td>0 1 0</td><td>7 4 3</td><td>3 3 2</td></tr>
                <tr><td>P1</td><td>3 2 2</td><td>2 0 0</td><td>1 2 2</td><td></td></tr>
                <tr><td>P2</td><td>9 0 2</td><td>3 0 2</td><td>6 0 0</td><td></td></tr>
                <tr><td>P3</td><td>2 2 2</td><td>2 1 1</td><td>0 1 1</td><td></td></tr>
                <tr><td>P4</td><td>4 3 3</td><td>0 0 2</td><td>4 3 1</td><td></td></tr>
              </tbody>
            </table>
            <p>(1) T0 时刻的安全性；(2) P1 请求资源：P1 发出请求向量 Request1(1, 0, 2)，系统按银行家算法进行检查。</p>
          </div>
          <p><strong>(2) 的检查过程</strong>：</p>
          <ol>
            <li>① Request1(1, 0, 2) ≤ Need1(1, 2, 2)；</li>
            <li>② Request1(1, 0, 2) ≤ Available(3, 3, 2)；</li>
            <li>③ 系统先假定可为 P1 分配资源，并修改 Available、Allocation1 和 Need1 向量，由此形成的资源变化情况如图中的圆括号所示；</li>
            <li>④ 再利用安全性算法检查此时系统是否安全。</li>
          </ol>
          <p>预分配后 Available = (2, 3, 0)、Allocation1 = (3, 0, 2)、Need1 = (0, 2, 0)，按安全性算法逐个找 Need ≤ Work 的进程推进（P1 → P3 → P4 → P0 → P2），Finish 全为 true，系统仍处于安全状态，可以正式分配。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch8-sync',
      heading: '7. 进程的同步与互斥',
      blocks: [
        {
          type: 'html',
          html: `
          <div class="callout key">
            <p class="callout-h">例题</p>
            <p>系统运行有三个进程：输入进程、计算进程和打印进程，它们协同完成工作。输入进程和计算进程之间共用缓冲区 buffer1，计算进程和打印进程之间共用缓冲区 buffer2。输入进程接收外部数据放入 buffer1 中；计算进程从 buffer1 中取出数据进行计算，然后将结果放入 buffer2；打印进程从 buffer2 取出数据打印输出。用算法描述这三个进程的工作情况，并用 wait 和 signal 原语实现其同步操作。</p>
          </div>
          <p><strong>解</strong>：信号量设置为 <code>semaphore mutex1 = 1, mutex2 = 1, empty1 = 1, empty2 = 1, full1 = 0, full2 = 0</code>，三个进程的并发程序如下：</p>
          <pre class="code"><code>void InP()                          // 输入进程
{
  while (1)
  {
    wait(empty1);
    wait(mutex1);
    input a data from keyboard;
    Add to buffer1;
    signal(mutex1);
    signal(full1);
  }
}

void CalP()                         // 计算进程
{
  while (1)
  {
    wait(full1);
    wait(mutex1);
    Take a data form buffer1;
    Add to ch1;
    signal(mutex1);
    signal(empty1);
    calculate ch1;
    wait(empty2);
    wait(mutex2);
    Take a data form ch1;
    Add to buffer2;
    signal(mutex2);
    signal(full2);
  }
}

void OutP()                         // 打印进程
{
  while (1)
  {
    wait(full2);
    wait(mutex2);
    Take a data from buffer2;
    Add to printer controler;
    signal(mutex2);
    signal(empty2);
    start printer;
  }
}</code></pre>
          `,
        },
      ],
    },
  ],
};

export default ch;
