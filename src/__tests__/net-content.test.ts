/**
 * 计算机网络课程内容完整性测试：
 * 章节结构 / 目录与 section 对齐 / 试卷题库字段与答案格式 / 标签指向真实存在的章内位置 / id 唯一 / 纯文本字段无实体
 */
import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import Sections from '../components/Sections';
import { netChapters, netPapers, netAllQuestions } from '../content/net';
import { netHomework } from '../content/net/homework';
import { netHighlights } from '../content/net/highlights';
import { loadNetResults, NET_PRACTICE_STORE_KEY } from '../pages/net/NetPracticeListPage';
import type { PracticeKind } from '../content/practice/types';

const ENTITY_RE = /&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/;

/** 章节结构契约：8 个章，各章 section 数 */
const EXPECT_SECTIONS: Record<string, number> = {
  ch1: 7,
  ch2: 5,
  ch3: 7,
  ch4: 5,
  ch5: 4,
  ch6: 7,
  ch7: 7,
  ch8: 5,
};

/** 试卷题量契约（与原始卷对齐） */
const EXPECT_PAPER_COUNT: Record<string, number> = {
  'paper-2021': 27,
  'paper-2022': 45,
  'paper-2024': 29,
};

describe('计算机网络课件内容', () => {
  it('共 8 个章，id/no 符合约定', () => {
    expect(netChapters.length).toBe(8);
    netChapters.forEach((c, i) => {
      expect(c.id).toBe(`ch${i + 1}`);
    });
    expect(netChapters[0].no).toBe('第1章');
    expect(netChapters[7].no).toBe('第8章');
  });

  it('各章 section 数与契约一致，目录项与 section id 对齐', () => {
    for (const c of netChapters) {
      expect(c.sections.length, c.id).toBe(EXPECT_SECTIONS[c.id]);
      expect(c.toc.length, `${c.id} toc`).toBeGreaterThan(0);
      for (const s of c.sections) {
        expect(s.blocks.length, `${c.id}/${s.id}`).toBeGreaterThan(0);
        // 每个 level 2 目录项都要有对应 section（level 3 目录项对应 html 内 h3）
        const l2 = c.toc.filter((t) => t.level === 2 && t.text === s.heading);
        if (s.heading && c.toc.some((t) => t.text === s.heading)) {
          expect(l2.length, `${c.id}/${s.id} 目录对齐`).toBeGreaterThan(0);
        }
      }
    }
  });

  it('纯文本渲染字段（标题 / 目录 / heading）不残留 HTML 实体', () => {
    const plain: string[] = [];
    for (const c of netChapters) {
      plain.push(c.title, c.subtitle);
      for (const t of c.toc) plain.push(t.text);
      for (const s of c.sections) plain.push(s.heading);
    }
    expect(plain.filter((v) => ENTITY_RE.test(v))).toEqual([]);
  });

  it('章节页渲染后的可见文本不出现字面实体（端到端）', () => {
    for (const c of netChapters) {
      const html = renderToStaticMarkup(
        createElement(MemoryRouter, null, createElement(Sections, { sections: c.sections })),
      );
      // 用 DOM 解码后再查：html 块里的合法实体（如 &lt;）渲染为可见字符，不算残留；只有双重转义才会露出
      const div = document.createElement('div');
      div.innerHTML = html;
      expect(ENTITY_RE.test(div.textContent ?? ''), `${c.id} 渲染文本残留实体`).toBe(false);
    }
  });

  it('总目录页可渲染（sections 非空）', () => {
    const html = renderToStaticMarkup(
      createElement(MemoryRouter, null, createElement(Sections, { sections: netPapers.length ? netChapters[0].sections : [] })),
    );
    expect(html.length).toBeGreaterThan(0);
  });
});

describe('计算机网络试卷题库', () => {
  it('共 3 份试卷，各卷题量与原始卷对齐', () => {
    expect(netPapers.length).toBe(3);
    for (const p of netPapers) {
      expect(p.questions.length, p.id).toBe(EXPECT_PAPER_COUNT[p.id]);
      // 分组引用的题号必须都存在且恰好覆盖全卷
      const grouped = p.sections.flatMap((s) => s.questionIds);
      expect(new Set(grouped).size, `${p.id} 分组去重`).toBe(grouped.length);
      expect([...grouped].sort(), `${p.id} 分组覆盖`).toEqual([...p.questions.map((q) => q.id)].sort());
    }
  });

  it('题目 id 全库唯一且形如 p{卷}-{题型}{序号}', () => {
    const ids = netAllQuestions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const q of netAllQuestions) {
      const kind: Record<PracticeKind, string> = { single: 's', multi: 'm', judge: 'j', fill: 'f', essay: 'e' };
      expect(q.id, q.id).toMatch(new RegExp(`^p\\d-${kind[q.kind]}\\d+$`));
    }
  });

  it('字段完整：题干/答案/解析非空，标签 ≥1，选项数合理', () => {
    for (const q of netAllQuestions) {
      expect(q.question.length, q.id).toBeGreaterThan(5);
      expect(q.answer.length, q.id).toBeGreaterThan(0);
      expect(q.explanation.length, q.id).toBeGreaterThan(5);
      expect(q.tags.length, `${q.id} 标签`).toBeGreaterThan(0);
      if (q.kind === 'fill' || q.kind === 'essay') {
        expect(q.options, `${q.id} 不应有选项`).toBeUndefined();
      } else {
        expect((q.options ?? []).length, `${q.id} 选项数`).toBeGreaterThanOrEqual(2);
        expect(q.answer, q.id).not.toMatch(/&/); // 答案按纯文本渲染
      }
    }
  });

  it('答案格式符合题型约定', () => {
    for (const q of netAllQuestions) {
      if (q.kind === 'single') {
        expect(q.answer, q.id).toMatch(/^[A-F]$/);
        const idx = 'ABCDEF'.indexOf(q.answer);
        expect((q.options ?? []).length, q.id).toBeGreaterThan(idx);
      }
      if (q.kind === 'fill') {
        // 填空答案用「｜」分隔可接受写法，判分按归一化比对
        expect(q.answer.length, q.id).toBeGreaterThan(0);
      }
    }
  });

  it('知识点标签指向真实存在的章与 section（点击可跳转）', () => {
    for (const q of netAllQuestions) {
      for (const t of q.tags) {
        expect(t.deck, q.id).toBeGreaterThanOrEqual(1);
        expect(t.deck, q.id).toBeLessThanOrEqual(8);
        const chapter = netChapters[t.deck - 1];
        const hit = chapter.toc.find((e) => e.id === t.sec) ?? chapter.sections.some((s) => s.id === t.sec);
        expect(hit, `${q.id} → ch${t.deck}/${t.sec} 不存在`).toBeTruthy();
        expect(t.text.length, q.id).toBeGreaterThan(0);
        expect(ENTITY_RE.test(t.text), `${q.id} 标签文本残留实体`).toBe(false);
      }
    }
  });

  it('知识点覆盖 8 个章（没有落单的章）', () => {
    const covered = new Set(netAllQuestions.flatMap((q) => q.tags.map((t) => t.deck)));
    for (let c = 1; c <= 8; c++) {
      expect(covered.has(c), `ch${c} 无题目覆盖`).toBe(true);
    }
  });

  it('每题解析都给出实质理由（长度与题干脱钩的最小要求）', () => {
    for (const q of netAllQuestions) {
      expect(q.explanation.length, `${q.id} 解析过短`).toBeGreaterThan(20);
    }
  });
});

describe('2025版计网作业与知识点跳转', () => {
  it('八章共54道来源作业，未虚构第八章作业', () => {
    const counts = [6, 3, 2, 7, 11, 16, 9, 0];
    counts.forEach((count, i) => expect(netHomework[i + 1].length).toBe(count));
    expect(counts.reduce((sum, n) => sum + n, 0)).toBe(54);
  });
  it('每题均有同章知识点锚点和独立题号锚点', () => {
    netChapters.forEach((chapter, i) => {
      const n = i + 1;
      const anchors = new Set(chapter.toc.map((entry) => entry.id));
      expect(anchors.has(`sec-ch${n}-homework`)).toBe(true);
      for (const q of netHomework[n]) {
        expect(anchors.has(q.related), q.title).toBe(true);
        expect(anchors.has(`sec-ch${n}-hw-${q.no}`), q.title).toBe(true);
        expect(q.reference.length, q.title).toBeGreaterThan(70);
      }
    });
  });
  it('第五章承接旧版中的局域网节，第4章不重复', () => {
    expect(netChapters[3].sections.every((section) => !/broadcast|evolve/.test(section.id))).toBe(true);
    expect(netChapters[4].sections.some((section) => section.id === 'sec-ch5-broadcast')).toBe(true);
    expect(netChapters[4].sections.some((section) => section.id === 'sec-ch5-evolve')).toBe(true);
  });
});

describe('2025 课件原始 PDF 荧光笔索引', () => {
  it('所有标出的知识点均对应可跳转的章节目录项', () => {
    for (let i = 1; i <= 8; i++) {
      const marked = netHighlights[i];
      expect(marked).toBeDefined();
      const destinations = new Set(netChapters[i - 1].toc.map((entry) => entry.id));
      for (const focus of marked.groups) {
        expect(destinations.has(focus.sec), `第${i}章：${focus.topic} 缺少对应锚点`).toBe(true);
        expect(focus.pages).toContain('页');
      }
    }
  });
  it('第八章无黄色笔迹不代表没有考试范围', () => {
    expect(netHighlights[8].markedPages).toBe(0);
    expect(netHighlights[8].groups).toHaveLength(0);
  });
});

describe('PDF 文字转录字符完整性', () => {
  it('计网作业不得含 PDF 符号字体私用区字符或异常替换字形', () => {
    // U+F06D/U+F0B9 曾分别使 μs、≠ 显示为乱码；避免后续导入重复发生。
    const invalid = /[\uE000-\uF8FF\u{F0000}-\u{FFFFD}\u{100000}-\u{10FFFD}\uFFFD\u0080-\u009F\u00AD\u200B]/u;
    for (const [chapter, questions] of Object.entries(netHomework)) {
      for (const question of questions) {
        for (const [field, value] of Object.entries(question)) {
          if (typeof value !== 'string') continue;
          expect(invalid.test(value), `第${chapter}章第${question.no}题的${field}字段含乱码字形`).toBe(false);
        }
      }
    }
  });
});

describe('PPP 配图完整性', () => {
  it('第 4 章 PPP 在原文不变的基础上插入六幅 SVG 图版', () => {
    const ppp = netChapters.find((chapter) => chapter.id === 'ch4');
    expect(ppp).toBeDefined();
    const section = ppp!.sections.find((item) => item.id === 'sec-ch4-p2p');
    const html = section?.blocks.filter((block) => block.type === 'html').map((block) => block.html).join('') ?? '';
    const figures = html.match(/<svg class="fig ppp-figure"/g) ?? [];
    const captions = html.match(/class="fig-cap"/g) ?? [];
    expect(figures).toHaveLength(6);
    expect(captions).toHaveLength(6);
    for (const word of ['透明传输', 'PPP 会话生命周期', 'Code', 'Configure-Ack', 'PAP', 'CHAP', 'IPCP']) {
      expect(html).toContain(word);
    }
    for (const name of ['ppp-stuffing', 'ppp-phases', 'ppp-lcp', 'ppp-config', 'ppp-auth', 'ppp-ncp']) {
      expect(html).toContain(`id="${name}-title"`);
    }
  });
});

describe('2025 课件数值笔误与标准对照', () => {
  it('T1 193bit × 8000帧/s、E1 256bit × 8000帧/s；帧长都是125微秒', () => {
    expect(193 * 8000).toBe(1_544_000);
    expect(256 * 8000).toBe(2_048_000);
    expect(1 / 8000).toBe(0.000125);
    const physical = netChapters[2].sections.flatMap((section) => section.blocks)
      .filter((block) => block.type === 'html').map((block) => block.html).join('');
    expect(physical).toContain('193 × 8000 = 1.544 Mbit/s');
    expect(physical).toContain('256 × 8000 = 2.048 Mbit/s');
    expect(physical).toContain('125 μs');
    expect(physical).toContain('微秒（μs）');
  });
  it('保留 PPP 原课件文本，另注明 RFC 1661 MRU 不是固定帧长及 Padding 可选', () => {
    const link = netChapters[3].sections.flatMap((section) => section.blocks)
      .filter((block) => block.type === 'html').map((block) => block.html).join('');
    expect(link).toContain('不足 1500 字节时填充');
    expect(link).toContain('1500 字节是默认 MRU');
    expect(link).toContain('Padding 是可选的');
    expect(link).toContain('Terminate-Ack');
  });
});
describe('计网内容二次勘误回归', () => {
  const chapterHtml = (n: number) => netChapters[n - 1].sections.flatMap((s) => s.blocks)
    .filter((b) => b.type === 'html').map((b) => b.html).join('');

  it('采样定理保留带限与抗混叠前提', () => {
    expect(chapterHtml(3)).toContain('带限信号');
    expect(chapterHtml(3)).toContain('抗混叠滤波');
  });
  it('PPP 区分 IPCP、同步异步填充以及16/32位FCS', () => {
    const html = chapterHtml(4);
    expect(html).toContain('0x8021 是 IPCP');
    expect(html).toContain('32 位 FCS');
    expect(html).toContain('同步链路上的比特填充');
  });
  it('IPv4配套协议、回环与未指定地址、OSPF收敛环路', () => {
    const html = chapterHtml(6);
    expect(html).toContain('这些都不是路由选择协议');
    expect(html).toContain('127.0.0.0/8');
    expect(html).toContain('程序绑定监听地址 0.0.0.0');
    expect(html).toContain('短暂出现转发环路');
  });
  it('UDP、RPC、SACK、ssthresh 的语义不误导', () => {
    const html = chapterHtml(7);
    expect(html).toContain('TCP/IP 协议族的运输层');
    expect(html).toContain('RPC 并非必然采用无连接对话');
    expect(html).toContain('不是每一个 TCP 报文段都带 SACK');
    expect(html).toContain('没有统一固定为 65535');
  });
  it('HTTP 分清无状态和连接复用；历年题同步更正回环范围', () => {
    expect(chapterHtml(8)).toContain('HTTP/1.1 默认采用持续连接');
    expect(chapterHtml(8)).toContain('2×RTT + 文档传输时间');
    const q = netPapers.find((paper) => paper.id === 'paper-2021')?.questions.find((q) => q.id === 'p1-s4');
    expect(q?.explanation).toContain('127.0.0.0/8');
  });
});

describe('计网第三轮审查：计算条件与考试解释', () => {
  const h3 = netChapters[2].sections.flatMap((s) => s.blocks)
    .filter((b) => b.type === 'html').map((b) => b.html).join('');
  const p2024 = netPapers.find((p) => p.id === 'paper-2024')!;

  it('波特用 Bd，频分复用不是无时延，并行倍速须声明单线路条件', () => {
    expect(h3).toContain('符号 <strong>Bd</strong>');
    expect(h3).toContain('频分复用不等于没有传输时延');
    expect(h3).toContain('每条信道的码元速率都与串行方案的单条信道相同');
  });

  it('2024试卷保留原答案，同时区别通信端点与进程', () => {
    const q = p2024.questions.find((x) => x.id === 'p3-s12');
    expect(q?.answer).toBe('D');
    expect(q?.explanation).toContain('不能一般性地唯一标识某个操作系统进程');
  });

  it('2024试卷CSMA/CD 理论最短发送长度不冒充真实以太网最小帧长', () => {
    const q = p2024.questions.find((x) => x.id === 'p3-e8');
    expect(q?.answer).toContain('10000 bit');
    expect(q?.answer).toContain('64 字节');
    expect(q?.answer).toContain('载波延伸');
  });

  it('2024路由器题区分数据转发和差错报告', () => {
    const q = p2024.questions.find((x) => x.id === 'p3-e4');
    expect(q?.answer).toContain('ICMP 不是通常用来建立路由表的数据平面转发协议');
  });

  it('2022试卷ARP与MAC 历史表述有标准适用条件', () => {
    const p2022 = netPapers.find((p) => p.id === 'paper-2022')!;
    expect(p2022.questions.find((q) => q.id === 'p2-f4')?.explanation).toContain('直接封装在链路层帧');
    expect(p2022.questions.find((q) => q.id === 'p2-e5')?.answer).toContain('本地管理或随机化 MAC 地址');
  });
});

describe('第四轮勘误：码距、地址块与微波频段', () => {
  const chapterHtml = (n: number) => netChapters[n - 1].sections.flatMap((s) => s.blocks)
    .filter((b) => b.type === 'html').map((b) => b.html).join('');

  it('普通海明码码距3不能同时保证纠1检2，扩展海明码码距4才支持SECDED', () => {
    const html = chapterHtml(4);
    expect(html).toContain('Hamming(7,4)');
    expect(html).toContain('Hamming(8,4)');
    expect(html).toContain('SECDED');
    expect(html).toContain('不能同时保证');
  });

  it('A/D/E类分类范围完整且E类标志前四位1111', () => {
    const html = chapterHtml(6);
    for (const s of ['224.0.0.0/4','239.255.255.255','240.0.0.0/4','255.255.255.255','前四位固定为 1111','1～126']) {
      expect(html).toContain(s);
    }
  });

  it('微波频段中厘米波仅为一部分', () => {
    const html = chapterHtml(3);
    expect(html).toContain('不能将整个微波频段都称为厘米波');
    expect(html).toContain('3～30 GHz');
  });
});

describe('第五轮计网核验：ADSL DMT、运输层与网页访问', () => {
  const chapterHtml = (number: number) => netChapters[number - 1].sections
    .flatMap((section) => section.blocks)
    .filter((block) => block.type === 'html').map((block) => block.html).join('');

  it('DMT 子载波间距为 4.3125 kHz，上行频谱不被误写为 40 kHz 以下', () => {
    const html = chapterHtml(3);
    expect(html).toContain('中心频率间隔为 4.3125 kHz');
    expect(html).toContain('0.3125 kHz 不是 DMT 子载波的独立保护频带');
    expect(html).toContain('25～138 kHz');
    expect(html).toContain('138～1104 kHz');
    expect(html).not.toContain('约 40kHz 以下为上行信道');
  });

  it('信道容量是理论上限，不保证实际传输速率可以达到', () => {
    const html = chapterHtml(3);
    expect(html).toContain('理论速率上限');
    expect(html).not.toContain('最大信息传输速率等于信道容量');
  });

  it('OSI 运输层不能把 TCP 的可靠性误当作 UDP 也具备', () => {
    const html = chapterHtml(2);
    expect(html).toContain('不能把可靠性视为所有运输层协议的共同保证');
    expect(html).toContain('UDP 提供无连接');
  });

  it('2021 试卷浏览网页题保留经典流程并说明 HTTPS 与 QUIC', () => {
    const q = netPapers.find((paper) => paper.id === 'paper-2021')
      ?.questions.find((question) => question.id === 'p1-e10');
    expect(q?.answer).toContain('QUIC/UDP');
    expect(q?.answer).toContain('TLS');
    expect(q?.answer).toContain('DNS 结果与 ARP 邻居表可能命中缓存');
  });
});

describe('计网试卷离线进度数据健壮性', () => {
  it('localStorage 保存无效 JSON/null/数组时不崩溃，过滤错误的成绩状态', () => {
    const original = localStorage.getItem(NET_PRACTICE_STORE_KEY);
    try {
      for (const bad of ['{bad json', 'null', '[]', '42', '"oops"']) {
        localStorage.setItem(NET_PRACTICE_STORE_KEY, bad);
        expect(loadNetResults(), bad).toEqual({});
      }
      localStorage.setItem(NET_PRACTICE_STORE_KEY,
        JSON.stringify({ 'paper-2021:p1-s1':'right', 'paper-2021:p1-s2':'revealed', 'bad':'other', '':'wrong' }));
      expect(loadNetResults()).toEqual({
        'paper-2021:p1-s1':'right', 'paper-2021:p1-s2':'revealed',
      });
    } finally {
      if (original === null) localStorage.removeItem(NET_PRACTICE_STORE_KEY);
      else localStorage.setItem(NET_PRACTICE_STORE_KEY, original);
    }
  });
});

describe('2025 原课件逐项对照：跨章节补遗与勘误', () => {
  const chapterHtml = (number: number) => netChapters[number - 1].sections
    .flatMap((section) => section.blocks)
    .filter((block) => block.type === 'html')
    .map((block) => block.html).join('');

  it('第1章：丢包率、时延带宽积、RTT 对照原 PPT 第86—91页，计算单位正确', () => {
    const html = chapterHtml(1);
    expect(html).toContain('sec-ch1-performance-loss');
    expect(html).toContain('分组丢失率 = 丢失的分组数');
    expect(html).toContain('带宽（bit/s）× 单程传播时延（s）');
    expect(100_000_000 * 0.020).toBe(2_000_000);
    expect(netChapters[0].toc.some((entry) => entry.id === 'sec-ch1-performance-loss')).toBe(true);
  });

  it('第5章：经典千兆半双工 carrier extension 与 MAC 64字节最短帧不混淆', () => {
    const html = chapterHtml(5);
    expect(html).toContain('sec-ch5-lan-current-h1');
    expect(html).toContain('4096 bit times，即 512 字节时间');
    expect(html).toContain('最短合法长度仍是 64 字节');
    expect(html).toContain('S<sub>max</sub>');
    expect(netChapters[4].toc.some((entry) => entry.id === 'sec-ch5-lan-current-h1')).toBe(true);
  });

  it('第6章：RIP 与 ICMP 时间戳原课件错误已明确区分标准算法与字段定义', () => {
    const html = chapterHtml(6);
    expect(html).toContain('Bellman–Ford');
    expect(html).toContain('Ford–Fulkerson');
    expect(html).toContain('不是 RIP 的最短路径更新算法');
    expect(html).toContain('从 UTC 当日午夜起经过的毫秒数');
    expect(html).toContain('RFC 792');
  });

  it('第7章：IGMP 不是 UDP 应用层协议；IP Protocol 2 与 UDP 17 分清', () => {
    const html = chapterHtml(7);
    expect(html).toContain('IGMP 并不封装在 UDP 中');
    expect(html).toContain('Protocol = 2');
    expect(html).toContain('协议号是 <strong>17</strong>');
  });

  it('第8章：补齐 FTP、动态文档与搜索引擎，全部可通过目录锚点定位', () => {
    const chapter = netChapters[7],html = chapterHtml(8);
    const ids = ['sec-ch8-ftp','sec-ch8-ftp-h1','sec-ch8-ftp-h2','sec-ch8-ftp-h3',
      'sec-ch8-http-h6','sec-ch8-http-h7'];
    for (const id of ids) {
      expect(chapter.toc.some((entry) => entry.id === id), id + ' 目录不存在').toBe(true);
      if (id !== 'sec-ch8-ftp') expect(html).toContain('id="' + id + '"');
      else expect(chapter.sections.some((section) => section.id === id)).toBe(true);
    }
    expect(html).toContain('TCP 21');
    expect(html).toContain('主动（PORT）模式');
    expect(html).toContain('被动（PASV）模式');
    expect(html).toContain('CGI（Common Gateway Interface');
    expect(html).toContain('PageRank');
    expect(html).toContain('XHTML 将逐渐取代 HTML');
    expect(chapter.sections.length).toBe(5);
    // 2024 旧稿的邮件协议保留，而非误称来自 2025 第8章课件
    expect(chapter.sections.some((section) => section.id === 'sec-ch8-email')).toBe(true);
  });
});
