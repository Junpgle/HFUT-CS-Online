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
        `,
      }],
    },
  ],
};
export default ch;
