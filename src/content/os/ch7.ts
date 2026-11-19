/* 操作系统 · 第7章 操作系统接口 —— 依据「课件/PPT-按章/第7章 操作系统接口.pdf」（合肥工业大学操作系统课程组，2014）整理 */
import type { OsChapter } from './types';

const ch: OsChapter = {
  id: 'ch7',
  no: '第7章',
  title: '操作系统接口',
  subtitle: '第 7 章 · 操作系统接口',
  lede: `
  本章篇幅最小但概念清晰：操作系统接口分为<strong>命令接口、图形用户接口（GUI）与程序接口</strong>三类，
        重点在<strong>程序接口——系统调用</strong>：什么是系统调用、系统调用与函数调用的区别、以及系统调用的处理过程（陷入机构与入口地址表）。
`,
  toc: [
    { id: 'sec-ch7-overview', text: '1. 操作系统接口概述与分类', level: 2 },
    { id: 'sec-ch7-cmd', text: '2. 联机命令接口', level: 2 },
    { id: 'sec-ch7-cmd-h1', text: '联机命令的基本形式', level: 3 },
    { id: 'sec-ch7-cmd-h2', text: '联机命令接口的组成', level: 3 },
    { id: 'sec-ch7-shell', text: '3. Shell 程序接口', level: 2 },
    { id: 'sec-ch7-syscall', text: '4. 程序接口：系统调用', level: 2 },
    { id: 'sec-ch7-syscall-h1', text: '系统调用的基本概念', level: 3 },
    { id: 'sec-ch7-syscall-h2', text: '系统调用特点', level: 3 },
    { id: 'sec-ch7-syscall-h3', text: '系统调用处理过程', level: 3 },
    { id: 'sec-ch7-exercise', text: '5. 本章习题', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ch7-overview',
      heading: '1. 操作系统接口概述与分类',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>(1) 操作系统接口概述</strong>：人-计算机接口——操作系统；用户与操作系统之间进行交互的接口——操作系统接口。</p>
          <p><strong>(2) 操作系统接口分类</strong>：</p>
          <ul>
            <li><strong>命令接口</strong>：联机用户接口——面向联机用户的操作接口；脱机用户接口——面向脱机（批处理）用户的操作接口；</li>
            <li><strong>图形用户接口</strong>（GUI, Graphical User Interface）：面向联机用户的操作接口；</li>
            <li><strong>程序接口</strong>：面向程序员的接口，程序可以直接调用操作系统核心功能。</li>
          </ul>
          `,
        },
      ],
    },
    {
      id: 'sec-ch7-cmd',
      heading: '2. 联机命令接口',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ch7-cmd-h1">联机命令的基本形式</h3>
          <p><strong>联机命令的基本形式</strong>：<code>Command Param1 Param2 …</code>——Command 为命令名称；Param1, Param2, … 为命令参数和选项。实例：<code>DIR</code>；<code>COPY C:\\t.txt d:\\td.txt</code>；<code>cp file1 file2</code>。</p>
          <h3 id="sec-ch7-cmd-h2">联机命令接口的组成</h3>
          <p><strong>7.1.2 联机命令接口的组成</strong>：</p>
          <p><strong>键盘终端处理程序</strong>：负责实现基本的命令编辑、接收和回显功能——接收用户从终端打入的字符；字符缓冲，用于暂存所接收的字符；字符回显；屏幕编辑；特殊字符处理。</p>
          <p><strong>命令解释程序</strong>：负责实现对用户输入命令的解释，并转入相应命令处理程序去执行。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch7-shell',
      heading: '3. Shell 程序接口',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>Shell 编程（UNIX）</strong>：利用 UNIX 操作系统提供的命令，将需要完成的命令按执行次序写成文件，形成所谓 shell 程序文件；执行这类文件，可以实现一批命令的自动执行。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch7-syscall',
      heading: '4. 程序接口：系统调用',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ch7-syscall-h1">系统调用的基本概念</h3>
          <p><strong>(1) 什么是系统调用</strong>：用户在程序中调用操作系统所提供的一些子功能。通常也把被调用的操作系统功能，称为系统调用。</p>
          <p><strong>系统调用示例 1（汇编）</strong>：</p>
          <pre class="code"><code>MOV AH, 2100
MOV BH, 1000
INT 21H</code></pre>
          <p><strong>系统调用示例 2（C 语言）</strong>：</p>
          <pre class="code"><code>char buff[] = "abcde";
for (i = 4; i &gt;= 0; i--)
    printf("%c", buff[i]);</code></pre>
          <p><strong>(2) 系统调用过程</strong>：用户程序执行到系统调用指令时陷入内核，由 OS 完成相应功能后返回。</p>
          <h3 id="sec-ch7-syscall-h2">系统调用特点</h3>
          <ul>
            <li>这是特殊的过程调用，由特殊的机器指令实现（每种机器的机器指令集中都有一条系统调用指令——<strong>访管指令</strong>）；</li>
            <li>这个指令还将系统转入管态；</li>
            <li>系统调用是一个低级过程，只能由汇编语言直接访问；</li>
            <li>系统调用是操作系统提供给编程人员的唯一接口；</li>
            <li><strong>系统调用和函数调用区别</strong>：进入和退出方式不同——系统调用：INT/IRET，函数调用：CALL/RET；CPU 状态变化不同——系统调用：用户态 → 系统态 → 用户态，函数调用：无 CPU 状态变化。</li>
          </ul>
          <h3 id="sec-ch7-syscall-h3">系统调用处理过程</h3>
          <ul>
            <li>在系统中为控制系统调用服务的机构称为陷入（TRAP）或异常处理机构；相对应，把由于系统调用引起处理机中断的指令称为陷入或异常指令（或称访管指令）；</li>
            <li>在操作系统中，每个系统调用都对应一个事先给定的功能号，例如 0、1、2、3 等；</li>
            <li>在陷入指令中必须包括对应系统调用的功能号；有些陷入指令中还带有传给陷入处理机构和内部处理程序的有关参数；</li>
            <li>必须为实现系统调用功能的子程序编造入口地址表，每个入口地址与相应的系统程序名对应；</li>
            <li>陷入处理程序把陷入指令包含功能号与入口地址表有关项对应，系统调用功能号驱动有关子程序执行；</li>
            <li>在系统调用处理结束之后，用户程序需利用系统调用返回结果继续执行。</li>
          </ul>
          <svg class="fig" viewBox="0 0 740 260" role="img" aria-label="系统调用的处理过程：用户程序经陷入机构查入口地址表进入系统子程序">
            <g font-size="13" text-anchor="middle" style="font-family:var(--font)">
              <defs>
                <marker id="a8" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" style="fill:var(--ink-3)"/>
                </marker>
              </defs>
              <g style="fill:var(--panel-2);stroke:var(--hairline)">
                <rect x="40" y="60" width="140" height="150" rx="10"/>
                <rect x="240" y="60" width="160" height="150" rx="10"/>
                <rect x="540" y="60" width="160" height="150" rx="10"/>
              </g>
              <g style="fill:var(--ink)" font-weight="700">
                <text x="110" y="88">用户程序</text>
                <text x="320" y="88">陷入处理机构</text>
                <text x="620" y="88">系统子程序</text>
              </g>
              <g style="fill:var(--ink-2)" font-size="12.5">
                <text x="110" y="120">…</text>
                <text x="110" y="140">INT 21</text>
                <text x="110" y="160">(system call)</text>
                <text x="110" y="190">…</text>
                <text x="320" y="120">(1)保护处理现场</text>
                <text x="320" y="146">(2)取系统调用功能号</text>
                <text x="320" y="168">并寻找子程序入口</text>
                <text x="320" y="194">(3)返回</text>
                <text x="620" y="120">A0 → Sub0</text>
                <text x="620" y="140">A1 → Sub1</text>
                <text x="620" y="160">Ai → Subi</text>
                <text x="620" y="180">An → Subn</text>
              </g>
              <g style="stroke:var(--ink-3)" stroke-width="1.5" fill="none" marker-end="url(#a8)">
                <path d="M180,140 L240,140"/>
                <path d="M400,140 L540,140"/>
                <path d="M540,200 L240,200"/>
                <path d="M240,215 L180,215"/>
              </g>
              <text x="210" y="128" style="fill:var(--ink-3)" font-size="12">陷入</text>
              <text x="470" y="128" style="fill:var(--ink-3)" font-size="12">功能号→入口地址表</text>
              <text x="380" y="220" style="fill:var(--ink-3)" font-size="12">执行结果返回用户程序</text>
              <text x="370" y="245" style="fill:var(--ink-3)" font-size="12.5">入口地址表：功能号 0,1,…,i,…,n ↔ 子程序入口 A0,A1,…,Ai,…,An</text>
            </g>
          </svg>
          <p class="fig-cap">图 7-1　系统调用的处理过程：INT 指令陷入 → 保护现场、查入口地址表 → 执行系统子程序 → 返回</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch7-exercise',
      heading: '5. 本章习题',
      blocks: [
        {
          type: 'html',
          html: `
          <p>修订版教材 P249：习题 1、7。</p>
          `,
        },
      ],
    },
  ],
};

export default ch;
