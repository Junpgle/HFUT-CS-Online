/* 计算机网络总览：2025 版八章，与旧版七章知识点兼容 */
import type { DeckData } from './types';

const home: DeckData = {
  id: 'home', no: '', title: '计算机网络 · 2025 课件复习手册', subtitle: '',
  lede: `<p>以<strong>2025 版八章课件</strong>为主线，参考已有章节讲义与课程作业。
  每章正文之后附<strong>课程作业、教师答案整理及完整参考解答</strong>，
  可由题目跳转到知识点、再从知识点返回作业。</p>
  <p>原有页面参考较早的七章目录（局域网合并在链路层）；
  2025 年课件改为<strong>八章</strong>，第五章独立讲局域网。
  两种编排不代表网络协议体系本身发生了变化。</p>`,
  toc: [
    { id: 'sec-net-map', text: '1. 八章复习路线', level: 2 },
    { id: 'sec-net-map-h1', text: '章节与作业对应', level: 3 },
    { id: 'sec-net-map-h2', text: '课件表述与现行实践', level: 3 },
  ],
  sections: [{
    id: 'sec-net-map', heading: '1. 八章复习路线', blocks: [{
      type: 'html', html: `
      <div class="callout tip"><p class="callout-h">复习顺序</p>
      <p>先阅读知识点与标出的重点，再做每章末的作业。
      答案区分别注明<strong>教师答案（整理）</strong>与<strong>补充参考解答</strong>，
      便于区分已给结论和推导解释；2025 课件未布置的题不虚构为教师作业。</p></div>
      <h3 id="sec-net-map-h1">章节与作业对应</h3>
      <table class="tbl"><thead><tr><th>2025 版章节</th><th>核心主题</th><th>作业来源</th></tr></thead><tbody>
      <tr><td>第1章 概论</td><td>网络构成、交换技术、性能指标</td><td>第1—3章合订作业题 1—5、7</td></tr>
      <tr><td>第2章 网络结构与协议</td><td>协议三要素、服务、分层与模型</td><td>第1—3章合订作业题 6、8、9</td></tr>
      <tr><td>第3章 数据通信与物理层</td><td>信道、编码、传输媒体与复用</td><td>第1—3章合订作业题 10、11</td></tr>
      <tr><td>第4章 数据链路层</td><td>帧、CRC、ARQ、PPP</td><td>第4章题 1—7</td></tr>
      <tr><td>第5章 局域网</td><td>CSMA/CD、以太网、交换机、VLAN</td><td>第5章题 1—11</td></tr>
      <tr><td>第6章 网络层</td><td>IPv4、ARP、ICMP、子网、路由</td><td>第6章题 1—16</td></tr>
      <tr><td>第7章 传输层</td><td>TCP/UDP、滑动窗口、拥塞控制</td><td>第7章题 1—9</td></tr>
      <tr><td>第8章 应用层</td><td>DNS、SMTP/IMAP、HTTP</td><td>所提供作业中未单列第8章</td></tr>
      </tbody></table>
      <h3 id="sec-net-map-h2">课件表述与现行实践</h3>
      <p>按照课件复习时注意<strong>适用前提</strong>：例如 CSMA/CD 属于经典半双工共享以太网，
      不应推广至常见的全双工交换式链路；IPv4 分类编址是教学基础，但实际路由以 CIDR
      与最长前缀匹配为主；HTTP/3 在 QUIC 上运行，QUIC 通常使用 UDP，不等同于
      “所有 HTTP 都运行于 TCP”。如遇版本差异，各章用双轨说明。</p>
      `,
    }],
  }],
};
export default home;
