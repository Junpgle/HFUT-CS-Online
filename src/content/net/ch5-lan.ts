/* 2025 版第5章：把旧版第4章「广播链路与以太网」归入单列的局域网章。 */
import type { NetChapter, Section, TocEntry } from './types';
import oldLink from './ch4';

const replaceAnchor = (value: string) => value.replaceAll('sec-ch4-', 'sec-ch5-');
const oldToc: TocEntry[] = oldLink.toc
  .filter((entry) => /^sec-ch4-(broadcast|evolve)/.test(entry.id))
  .map((entry) => ({
    ...entry,
    id: replaceAnchor(entry.id),
    text: entry.level === 2
      ? entry.text.replace(/^6\./, '2.').replace(/^7\./, '3.')
      : entry.text,
  }));
const oldSections: Section[] = oldLink.sections
  .filter((section) => /^sec-ch4-(broadcast|evolve)/.test(section.id))
  .map((section) => ({
    ...section,
    id: replaceAnchor(section.id),
    heading: section.heading.replace(/^6\./, '2.').replace(/^7\./, '3.'),
    blocks: section.blocks.map((block) =>
      block.type === 'html' ? { ...block, html: replaceAnchor(block.html) } : block,
    ),
  }));

const ch: NetChapter = {
  id: 'ch5',
  no: '第5章',
  title: '局域网',
  subtitle: '第 5 章 · 局域网（2025 版）',
  lede: `<p>依据 2025 版独立的<strong>第5章「局域网」</strong>重新编排：
  先看局域网与 IEEE 802 体系，再学习媒体接入、以太网和交换机。
  旧版第4章中的 CSMA/CD、以太网帧、扩展与 VLAN 内容统一迁入本章；
  配套第5章作业放在正文最后，便于复习时对照。</p>`,
  toc: [
    { id: 'sec-ch5-lan-basic', text: '1. 局域网概述与 IEEE 802', level: 2 },
    ...oldToc,
    { id: 'sec-ch5-lan-current', text: '4. 课件语境与现行网络实践', level: 2 },
    { id: 'sec-ch5-lan-current-h1', text: '2025课件补充：利用率与半双工千兆兼容机制', level: 3 },
  ],
  sections: [
    {
      id: 'sec-ch5-lan-basic',
      heading: '1. 局域网概述与 IEEE 802',
      blocks: [{
        type: 'html',
        html: `
          <div class="callout key"><p class="callout-h">2025 课件复习线索</p>
          <p><strong>局域网的范围及特点 → IEEE 802 标准 → LLC/MAC 子层 →
          网卡 → 共享介质的接入控制 → 交换式以太网与冲突域</strong>。</p></div>
          <p>局域网通常由一个单位或组织管理，覆盖相对有限的区域。
          <strong>地理范围、传输速率、误码率的具体数值</strong>会随标准和设备演进，
          课件中的典型数值是历史教学例子，不能作为所有现代 LAN 的统一限制。</p>
          <p><strong>IEEE 802</strong> 中，802.3 主要涉及以太网，802.11 涉及无线局域网，
          802.1Q 定义 VLAN 标记等桥接相关机制。传统教材将数据链路层分为
          逻辑链路控制（LLC）与媒体接入控制（MAC）两个子层；
          在当代常见 Ethernet II 与 IP 的组合中，并非每帧都显式采用 IEEE 802.2 LLC 首部。</p>
          <p>网络接口适配器（NIC）主要承担物理层与链路层的数据发送、接收、帧处理等任务；
          “网卡完全不使用 CPU”不成立：网卡能独立执行许多硬件操作，
          但驱动、中断、协议栈和部分卸载功能仍与主机处理器协作。</p>
        `,
      }],
    },
    ...oldSections,
    {
      id: 'sec-ch5-lan-current',
      heading: '4. 课件语境与现行网络实践',
      blocks: [{
        type: 'html',
        html: `
          <div class="callout tip"><p class="callout-h">保留课件表述，同时说明适用条件</p>
          <p><strong>课件：</strong>经典共享介质、半双工以太网使用 CSMA/CD，发生碰撞时二进制指数退避。
          <strong>现代网络：</strong>交换机端口与主机常采用全双工点到点链路，不再以 CSMA/CD 处理碰撞。</p>
          <p><strong>课件：</strong>网桥、集线器、交换机对碰撞域与广播域的作用不同。
          <strong>实际：</strong>二层交换机通常每个端口构成独立冲突域；未隔离的同一 VLAN
          通常构成一个广播域，路由器或三层转发边界可以分隔广播域。</p>
          <p><strong>课件：</strong>交换机根据目的 MAC 转发，并根据收到帧的<strong>源 MAC</strong>自学习转发表。
          <strong>补充：</strong>目的 MAC 未知时通常在所在 VLAN 内向除入端口外的其他端口泛洪；
          已知目的地址与入端口相同则过滤。转发表项目会老化，不能把学习理解为永久登记。</p>
          </div>
          <h3 id="sec-ch5-lan-current-h1">2025 课件对照：利用率、载波延伸与分组突发</h3>
          <p class="quiz-note">来源：2025 第5章《局域网》PDF 第37—41页、第111—115页。
            以下描述<strong>经典半双工共享式以太网的教学模型</strong>，不能套到当前常见的全双工交换式千兆以太网上。</p>
          <p><strong>信道利用率参数 a</strong>：单程端到端传播时延记为 τ，一帧的发送时延为 T<sub>0</sub> = L/C，
            则 a = τ/T<sub>0</sub>。在课件给出的理想化计算中，不计碰撞、退避、处理及帧间隔等开销，
            成功传完一帧的占用时间约为 T<sub>0</sub> + τ，因此上界为：</p>
          <p class="formula">S<sub>max</sub> = T<sub>0</sub> / (T<sub>0</sub> + τ) = 1 / (1 + a)</p>
          <p>a 越大，传播时延相对发送时延所占的比重越高；实际共享介质还有碰撞和退避，
            信道利用率通常比这个理想上界低。不能将 1/(1+a) 当成一切以太网的精确吞吐量公式。</p>
          <p><strong>千兆以太网的历史性半双工兼容机制</strong>：
            2025 课件中的载波延伸（carrier extension）将争用时隙扩展为
            <strong>4096 bit times，即 512 字节时间</strong>；当 MAC 帧不足 512 字节时间时，
            在帧之后添加特殊扩展符号，以满足碰撞检测所需的最短发送时长。
            <strong>以太网 MAC 帧的最短合法长度仍是 64 字节</strong>，不要误记成最短 MAC 帧变为 512 字节。</p>
          <p><strong>分组突发（packet bursting）</strong>：为避免多个短帧各自重复承担载波延伸开销，
            半双工千兆以太网可以在第一次扩展后接续发送多个短帧并保持载波占用。
            这是课件说明历史共享式千兆以太网效率问题的技术，不表示全双工千兆以太网仍使用 CSMA/CD。</p>
        `,
      }],
    },
  ],
};
export default ch;
