/** 不改写课程原文，在各讲标题处注入静态示意图与共用 DemoPlayer 动画。 */
import type { Block, DeckData } from './types';
import { chapterGuideFigures, netStaticFigures } from './net-figures';

export interface NetDemoPlacement { chapter: number; anchor: string; name: string; title: string }
export const netDemoPlacements: NetDemoPlacement[] = [
  {
    "chapter": 1,
    "anchor": "sec-ch1-work-h3",
    "name": "net-switch-methods",
    "title": "电路、报文、分组交换：逐步对比"
  },
  {
    "chapter": 1,
    "anchor": "sec-ch1-work-h3",
    "name": "net-packet-switch",
    "title": "分组交换：存储转发与流水线"
  },
  {
    "chapter": 1,
    "anchor": "sec-ch1-performance-h2",
    "name": "net-delay",
    "title": "处理、排队、发送与传播时延"
  },
  {
    "chapter": 2,
    "anchor": "sec-ch2-osi-h2",
    "name": "net-encapsulation",
    "title": "五层协议封装和逐跳转发"
  },
  {
    "chapter": 3,
    "anchor": "sec-ch3-basic-h3",
    "name": "net-nyquist",
    "title": "奈奎斯特与香农：逐步计算"
  },
  {
    "chapter": 3,
    "anchor": "sec-ch3-mux-h1",
    "name": "net-multiplex",
    "title": "FDM、TDM、STDM、WDM、CDM"
  },
  {
    "chapter": 4,
    "anchor": "sec-ch4-frame-h2",
    "name": "net-bit-stuff",
    "title": "比特填充与字节转义"
  },
  {
    "chapter": 4,
    "anchor": "sec-ch4-error-h4",
    "name": "net-crc",
    "title": "CRC 模2长除法：逐位异或"
  },
  {
    "chapter": 4,
    "anchor": "sec-ch4-flow-h1",
    "name": "net-stop-wait",
    "title": "停止等待：ACK 丢失与重复帧"
  },
  {
    "chapter": 4,
    "anchor": "sec-ch4-flow-h2",
    "name": "net-gbn",
    "title": "后退 N 帧协议 GBN 的窗口和重传"
  },
  {
    "chapter": 4,
    "anchor": "sec-ch4-flow-h2",
    "name": "net-sr",
    "title": "选择重传 SR 的乱序缓存与确认"
  },
  {
    "chapter": 4,
    "anchor": "sec-ch4-p2p-h2",
    "name": "net-ppp",
    "title": "PPP 六阶段与 LCP/NCP 协商"
  },
  {
    "chapter": 5,
    "anchor": "sec-ch5-broadcast-h2",
    "name": "net-csmacd",
    "title": "CSMA/CD：碰撞与指数退避"
  },
  {
    "chapter": 5,
    "anchor": "sec-ch5-broadcast-h5",
    "name": "net-switch-learn",
    "title": "交换机 MAC 表学习、泛洪和过滤"
  },
  {
    "chapter": 5,
    "anchor": "sec-ch5-broadcast-h5",
    "name": "net-vlan",
    "title": "VLAN 广播隔离与跨 VLAN 通信"
  },
  {
    "chapter": 6,
    "anchor": "sec-ch6-ip-h3",
    "name": "net-subnet",
    "title": "子网划分：/27 按位与计算"
  },
  {
    "chapter": 6,
    "anchor": "sec-ch6-ip-h1",
    "name": "net-fragment",
    "title": "IPv4 分片长度、MF 与片偏移"
  },
  {
    "chapter": 6,
    "anchor": "sec-ch6-ip-h6",
    "name": "net-longest-prefix",
    "title": "路由器最长前缀匹配"
  },
  {
    "chapter": 6,
    "anchor": "sec-ch6-routing-h3",
    "name": "net-rip",
    "title": "RIP 路由表逐项更新"
  },
  {
    "chapter": 6,
    "anchor": "sec-ch6-routing-h4",
    "name": "net-ospf",
    "title": "OSPF 链路状态与 Dijkstra"
  },
  {
    "chapter": 6,
    "anchor": "sec-ch6-arp-h1",
    "name": "net-arp",
    "title": "ARP 广播请求、单播应答与缓存"
  },
  {
    "chapter": 6,
    "anchor": "sec-ch6-icmp",
    "name": "net-icmp",
    "title": "ICMP Ping / traceroute 的 TTL"
  },
  {
    "chapter": 6,
    "anchor": "sec-ch6-ip-h5",
    "name": "net-nat",
    "title": "扩展：NAT/PAT 地址端口转换"
  },
  {
    "chapter": 7,
    "anchor": "sec-ch7-tcp-h3",
    "name": "net-tcp-handshake",
    "title": "TCP 三次握手与 seq/ack"
  },
  {
    "chapter": 7,
    "anchor": "sec-ch7-tcp-h4",
    "name": "net-tcp-close",
    "title": "TCP 四次挥手与 TIME_WAIT"
  },
  {
    "chapter": 7,
    "anchor": "sec-ch7-flow-h1",
    "name": "net-tcp-flow",
    "title": "TCP 流量控制与零窗口探测"
  },
  {
    "chapter": 7,
    "anchor": "sec-ch7-congestion-h2",
    "name": "net-tcp-congestion",
    "title": "TCP cwnd 慢开始、拥塞避免和快恢复"
  },
  {
    "chapter": 8,
    "anchor": "sec-ch8-dns-h3",
    "name": "net-dns-recursive",
    "title": "DNS：客户端递归请求、解析器逐级查询"
  },
  {
    "chapter": 8,
    "anchor": "sec-ch8-dns-h3",
    "name": "net-dns-iterative",
    "title": "DNS：迭代查询与转介"
  },
  {
    "chapter": 8,
    "anchor": "sec-ch8-http-h2",
    "name": "net-http",
    "title": "输入 URL 后的 DNS、TLS、HTTP 与渲染"
  },
  {
    "chapter": 8,
    "anchor": "sec-ch8-email-h1",
    "name": "net-email",
    "title": "电子邮件 SMTP 投递与 IMAP/POP3 读取"
  }
];
const tagPattern=/\[\[NETDEMO:([a-z0-9-]+)\]\]/g;

export function enrichNetworkChapter(chapter: DeckData, chapterNo: number): DeckData {
  const relatedFigures=netStaticFigures.filter((f)=>f.ch===chapterNo);
  const relatedDemos=netDemoPlacements.filter((p)=>p.chapter===chapterNo);
  return {
    ...chapter,
    sections: chapter.sections.map((section,sectionIndex)=>({
      ...section,
      blocks: section.blocks.flatMap((block,blockIndex):Block[]=>{
        if (block.type!=='html') return [block];
        let html=block.html;
        // 每章首节开头：与算法课导学图一样可点击放大。
        if (sectionIndex===0 && blockIndex===0) html=chapterGuideFigures[chapterNo]+html;

        // 按锚点分组后一次插入，避免同一标题有多个演示时丢失顺序。
        const anchors=new Set([
          ...relatedFigures.map((f)=>f.anchor),
          ...relatedDemos.map((p)=>p.anchor),
        ]);
        for (const anchor of anchors){
          const graphics=relatedFigures.filter((f)=>f.anchor===anchor).map((f)=>f.html).join('');
          const demos=relatedDemos.filter((p)=>p.anchor===anchor)
            .map((p)=>'[[NETDEMO:'+p.name+']]').join('');
          const supplement=chapterNo===6 && anchor==='sec-ch6-ip-h5'
            ? '<p class="quiz-note"><strong>扩展阅读（非课件原文）：</strong>下面的 NAT/PAT 例子说明地址转换，与 CIDR 地址聚合不是同一个概念。</p>'
            : '';
          const insertion=graphics+supplement+demos;
          if (anchor===section.id){
            // 章内大节没有 h3；在该节首个 HTML 块前放入扩展内容。
            if(blockIndex===0) html=insertion+html;
          }else{
            const token='<h3 id="'+anchor+'">';
            const start=html.indexOf(token);
            if(start>=0){
              const end=html.indexOf('</h3>',start);
              if(end>=0) html=html.slice(0,end+5)+insertion+html.slice(end+5);
            }
          }
        }
        const pieces=html.split(tagPattern);
        const output:Block[]=[];
        for(let i=0;i<pieces.length;i++){
          if(i%2===0){
            if(pieces[i].trim())output.push({type:'html',html:pieces[i]});
          }else{
            const placement=relatedDemos.find((entry)=>entry.name===pieces[i]);
            if(placement)output.push({type:'demo',name:placement.name,title:placement.title});
          }
        }
        return output;
      }),
    })),
  };
}
