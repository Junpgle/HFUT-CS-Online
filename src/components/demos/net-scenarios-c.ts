/** 应用层与传输层真实时序：逐报文说明请求、应答、缓存与状态。 */
import type { NetScenario } from './net-base';
export const netScenariosC: NetScenario[] = [
  {
    "name": "net-tcp-handshake",
    "actors": [
      "客户端 C",
      "链路",
      "服务器 S"
    ],
    "steps": [
      {
        "tag": "CLOSED / LISTEN",
        "from": 0,
        "to": 2,
        "event": "等待连接",
        "cap": "客户端初始 CLOSED；服务器监听套接字进入 LISTEN。TCP 建立连接不是发一次数据包，而是同步双方的初始序号及能力。",
        "values": [
          "C:CLOSED",
          "S:LISTEN"
        ]
      },
      {
        "tag": "第一次握手",
        "from": 0,
        "to": 2,
        "event": "SYN seq=100",
        "cap": "客户端发送 <b>SYN=1、seq=100</b> 的报文段，转为 SYN-SENT。SYN 自身占用一个序号。",
        "values": [
          "C:SYN-SENT",
          "seq=100"
        ]
      },
      {
        "tag": "服务器收 SYN",
        "from": 2,
        "to": 2,
        "event": "准备 SYN+ACK",
        "cap": "服务器收到 SYN 并接受该连接请求，选择自己的初始序号500；要确认客户端的 SYN，ack=100+1=101。",
        "values": [
          "S:SYN-RECEIVED",
          "ack=101"
        ]
      },
      {
        "tag": "第二次握手",
        "from": 2,
        "to": 0,
        "event": "SYN+ACK seq=500 ack=101",
        "cap": "服务器发送 <b>SYN=1,ACK=1,seq=500,ack=101</b>，SYN 也消耗一个序号。此时服务器尚未进入最终 ESTABLISHED。",
        "values": [
          "S:SYN-RECEIVED",
          "seq=500",
          "ack=101"
        ]
      },
      {
        "tag": "客户端收 SYN+ACK",
        "from": 0,
        "to": 0,
        "event": "确认服务端序号",
        "cap": "客户端检查 ack=101 确认自己的 SYN，并准备以 ACK=1、ack=501 确认服务器的 SYN。",
        "values": [
          "C 准备 ACK",
          "ack=501"
        ]
      },
      {
        "tag": "第三次握手",
        "from": 0,
        "to": 2,
        "event": "ACK seq=101 ack=501",
        "cap": "客户端发送 <b>ACK=1,seq=101,ack=501</b>（不带数据的纯 ACK 不消耗序号），客户端进入 ESTABLISHED。",
        "values": [
          "C:ESTABLISHED",
          "seq=101",
          "ack=501"
        ]
      },
      {
        "tag": "服务器收最终 ACK",
        "from": 2,
        "to": 2,
        "event": "进入 ESTABLISHED",
        "cap": "服务器收到对自己 SYN 的确认，进入 ESTABLISHED。此后双方可双向发送应用数据。",
        "values": [
          "S:ESTABLISHED",
          "连接建立完成"
        ]
      },
      {
        "tag": "为何三次",
        "from": 0,
        "to": 2,
        "event": "双方序号已确认",
        "cap": "三次握手让双方确认收发能力并同步初始序号，避免旧失效连接请求被误当成已建立的有效连接。",
        "values": [
          "SYN 占序号",
          "纯 ACK 不占序号"
        ]
      }
    ]
  },
  {
    "name": "net-tcp-close",
    "actors": [
      "主动关闭方 A",
      "TCP 链路",
      "被动关闭方 B"
    ],
    "steps": [
      {
        "tag": "原连接",
        "from": 0,
        "to": 2,
        "event": "双方 ESTABLISHED",
        "cap": "假设 A 和 B 处于 ESTABLISHED，TCP 是全双工，每个方向都可独立关闭发送能力。",
        "values": [
          "双向可发数据"
        ]
      },
      {
        "tag": "第一次挥手",
        "from": 0,
        "to": 2,
        "event": "FIN seq=1001",
        "cap": "A 发送 <b>FIN=1,seq=1001</b>，声明自己的数据已发送完，进入 FIN-WAIT-1。FIN 占用一个序号。",
        "values": [
          "A:FIN-WAIT-1",
          "FIN 序号1001"
        ]
      },
      {
        "tag": "第二次挥手",
        "from": 2,
        "to": 0,
        "event": "ACK ack=1002",
        "cap": "B 收到 FIN，确认 ack=1002，进入 CLOSE-WAIT。A 收到 ACK 后进入 FIN-WAIT-2。B 仍可发送未发完的数据。",
        "values": [
          "A:FIN-WAIT-2",
          "B:CLOSE-WAIT"
        ]
      },
      {
        "tag": "半关闭阶段",
        "from": 2,
        "to": 0,
        "event": "B 可继续发数据",
        "cap": "A 不能再向 B 发送应用数据，但仍可以接收 B 的数据，双方关闭时机并不一定相同。",
        "values": [
          "半关闭",
          "FIN 不一定同 ACK"
        ]
      },
      {
        "tag": "B 发送剩余数据",
        "from": 2,
        "to": 0,
        "event": "TCP Data seq=7000 len=1",
        "cap": "为了让后续示例 FIN seq=7001 的序号有来源，本例假设 B 在自己的发送方向还有1字节数据，使用 seq=7000 发送给 A。",
        "values": [
          "B仍能发数据",
          "seq7000、长度1"
        ]
      },
      {
        "tag": "A 确认剩余数据",
        "from": 0,
        "to": 2,
        "event": "ACK ack=7001",
        "cap": "A 虽已发送 FIN，但仍可接收 B 的数据并对这一字节回复 ACK=7001。B 后续 FIN 消耗一个新序号。",
        "values": [
          "A确认 B 的1字节"
        ]
      },
      {
        "tag": "B 准备关闭",
        "from": 2,
        "to": 2,
        "event": "应用关闭发送",
        "cap": "B 的应用通知 TCP 不再需要发送，B 才发送自己的 FIN。此前 B 已发送的数据需要满足其可靠性约束。",
        "values": [
          "B 准备 LAST-ACK"
        ]
      },
      {
        "tag": "第三次挥手",
        "from": 2,
        "to": 0,
        "event": "FIN seq=7001",
        "cap": "B 发送 <b>FIN=1,seq=7001</b>，进入 LAST-ACK，等待确认。A 收到后进入 TIME-WAIT。",
        "values": [
          "B:LAST-ACK",
          "FIN 序号7001"
        ]
      },
      {
        "tag": "第四次挥手",
        "from": 0,
        "to": 2,
        "event": "ACK ack=7002",
        "cap": "A 回 ACK=1、ack=7002，B 收到后关闭。A 仍需维持 TIME-WAIT 一段时间。",
        "values": [
          "A:TIME-WAIT",
          "B:CLOSED"
        ]
      },
      {
        "tag": "2MSL 等待",
        "from": 0,
        "to": 0,
        "event": "等待 2MSL",
        "cap": "TIME-WAIT 通常等待2MSL，以支持最后 ACK 丢失后的重发并降低旧连接报文干扰；这里讲的是经典 TCP 状态机。",
        "values": [
          "2MSL 后 CLOSED"
        ]
      },
      {
        "tag": "结论",
        "from": 0,
        "to": 0,
        "event": "双方最终 CLOSED",
        "cap": "TCP 四次挥手通常因为全双工的两个方向分别关闭，但 ACK 与 FIN 在条件允许时也可能合并，并非每次必然出现独立四报文。",
        "values": [
          "FIN 消耗1序号",
          "ACK 自身不占序号"
        ]
      }
    ]
  },
  {
    "name": "net-tcp-flow",
    "actors": [
      "发送端",
      "网络",
      "接收端"
    ],
    "steps": [
      {
        "tag": "通告接收窗口",
        "from": 2,
        "to": 0,
        "event": "rwnd=4000B",
        "cap": "TCP 接收端根据可用接收缓冲区，在 ACK 中通告接收窗口 rwnd，发送方按接收窗口限制未确认数据。",
        "values": [
          "rwnd=4000B",
          "飞行数据≤rwnd"
        ]
      },
      {
        "tag": "发送第一段",
        "from": 0,
        "to": 2,
        "event": "发送 1000B",
        "cap": "发送方发送1000字节数据，接收方把数据放入缓存并交付应用。发送方等待累计确认。",
        "values": [
          "在途=1000B",
          "剩余窗口3000B"
        ]
      },
      {
        "tag": "连续发送",
        "from": 0,
        "to": 2,
        "event": "再发 2000B",
        "cap": "尚未确认总量达到3000B，未超过rwnd=4000B；具体可发送量还受拥塞窗口 cwnd 及已发送未确认字节限制。",
        "values": [
          "在途=3000B",
          "cwnd也限制发送"
        ]
      },
      {
        "tag": "应用读取较慢",
        "from": 2,
        "to": 2,
        "event": "缓冲区变满",
        "cap": "如果接收应用读取变慢，接收缓冲区剩余空间减小；接收端在后续 ACK 中通告更小的窗口。",
        "values": [
          "新的 rwnd=1000B"
        ]
      },
      {
        "tag": "窗口更新",
        "from": 2,
        "to": 0,
        "event": "ACK + rwnd=1000",
        "cap": "发送端收到新的窗口通告后限制后续在途数据；已发送数据的处理还需要按 TCP 正常规则确认。",
        "values": [
          "有效窗口收缩"
        ]
      },
      {
        "tag": "通告零窗口",
        "from": 2,
        "to": 0,
        "event": "rwnd=0",
        "cap": "如果接收缓冲区满，接收端可通告 rwnd=0。发送方暂停普通新数据发送，但仍需要保持检测窗口是否重新开放。",
        "values": [
          "rwnd=0",
          "不能继续普通发送"
        ]
      },
      {
        "tag": "持续计时器",
        "from": 0,
        "to": 2,
        "event": "Zero-window Probe",
        "cap": "发送方通过持续计时器等机制发零窗口探测，防止窗口更新报文丢失造成双方永久等待。",
        "values": [
          "零窗口探测"
        ]
      },
      {
        "tag": "接收方读取",
        "from": 2,
        "to": 2,
        "event": "应用取走数据",
        "cap": "接收应用读取缓存中的数据，空出空间，例如允许窗口扩大为2000B。",
        "values": [
          "新 rwnd=2000B"
        ]
      },
      {
        "tag": "恢复传输",
        "from": 2,
        "to": 0,
        "event": "rwnd=2000",
        "cap": "发送端收到非零窗口更新，继续发送满足 <b>min(cwnd,rwnd)</b> 限制的数据。流量控制保护接收端，拥塞控制保护网络。",
        "values": [
          "流控依赖 rwnd",
          "拥塞控制依赖 cwnd"
        ]
      }
    ]
  },
  {
    "name": "net-tcp-congestion",
    "actors": [
      "发送端 TCP",
      "潜在拥塞链路",
      "接收端 TCP"
    ],
    "steps": [
      {
        "tag": "初始化 cwnd",
        "from": 0,
        "to": 0,
        "event": "cwnd=1 MSS",
        "cap": "采用经典 TCP Reno 教学示例：初始 cwnd=1 MSS，ssthresh=8 MSS。现代 TCP 可能采用更大的初始拥塞窗口与其他拥塞控制算法。",
        "values": [
          "cwnd=1",
          "ssthresh=8",
          "慢开始"
        ]
      },
      {
        "tag": "RTT 1",
        "from": 0,
        "to": 2,
        "event": "ACK→cwnd2",
        "cap": "慢开始阶段每收到确认会增长 cwnd，在理想 RTT 聚合模型里从1 MSS约翻倍到2 MSS。",
        "values": [
          "cwnd=2",
          "指数增长"
        ]
      },
      {
        "tag": "RTT 2",
        "from": 0,
        "to": 2,
        "event": "ACK→cwnd4",
        "cap": "慢开始仍在生效：本轮收到对新数据的累计确认，理想化一个 RTT 内拥塞窗口从2 MSS大致翻倍到4 MSS。",
        "values": [
          "cwnd=4"
        ]
      },
      {
        "tag": "RTT 3 达门限",
        "from": 0,
        "to": 2,
        "event": "ACK→cwnd8",
        "cap": "窗口达到慢开始阈值 ssthresh=8 MSS，转入拥塞避免。",
        "values": [
          "cwnd=8",
          "拥塞避免开始"
        ]
      },
      {
        "tag": "RTT 4",
        "from": 0,
        "to": 2,
        "event": "cwnd8→9",
        "cap": "拥塞避免阶段近似每 RTT 增长 1 MSS，cwnd 从8变9。",
        "values": [
          "cwnd=9",
          "线性增长"
        ]
      },
      {
        "tag": "RTT 5",
        "from": 0,
        "to": 2,
        "event": "cwnd9→10",
        "cap": "下一 RTT 继续加性增大，cwnd 到10 MSS。",
        "values": [
          "cwnd=10"
        ]
      },
      {
        "tag": "某报文段丢失",
        "from": 1,
        "to": 2,
        "event": "失序到达",
        "cap": "网络出现数据段丢失，后续段仍可到达接收端，使接收端重复发送相同累计 ACK。",
        "values": [
          "接收方缺失某字节区间"
        ]
      },
      {
        "tag": "重复 ACK 第1次",
        "from": 2,
        "to": 0,
        "event": "DupACK #1",
        "cap": "接收方检测到高序号数据到达，但缺口仍在，回相同的累计 ACK。发送方暂不以一个重复 ACK 认定快重传。",
        "values": [
          "dupACK=1"
        ]
      },
      {
        "tag": "重复 ACK 第2次",
        "from": 2,
        "to": 0,
        "event": "DupACK #2",
        "cap": "第二个重复 ACK 到达，仍未达到三次重复 ACK 的快重传条件。",
        "values": [
          "dupACK=2"
        ]
      },
      {
        "tag": "重复 ACK 第3次",
        "from": 2,
        "to": 0,
        "event": "DupACK #3",
        "cap": "收到第三个重复 ACK：经典 Reno 设置 ssthresh=max(FlightSize/2,2 MSS)，教学简化令 FlightSize=10 MSS，所以 ssthresh=5 MSS；立即重传缺失数据。",
        "values": [
          "ssthresh=5",
          "快速重传",
          "dupACK=3"
        ]
      },
      {
        "tag": "进入快恢复",
        "from": 0,
        "to": 2,
        "event": "cwnd=ssthresh+3=8",
        "cap": "经典 Reno 快恢复开始时临时令 cwnd=ssthresh+3×MSS=<b>8 MSS</b>，反映重复 ACK 所表示的已离开网络的数据。不能直接把整个快恢复过程画成 cwnd=5。",
        "values": [
          "cwnd=8(临时)",
          "ssthresh=5"
        ]
      },
      {
        "tag": "重传分段获确认",
        "from": 2,
        "to": 0,
        "event": "新的累计 ACK",
        "cap": "假设收到对重传缺口的完整确认，Reno 退出快恢复，将 cwnd 收缩到 ssthresh=5 MSS。",
        "values": [
          "cwnd=5",
          "退出快恢复"
        ]
      },
      {
        "tag": "再进入拥塞避免",
        "from": 0,
        "to": 2,
        "event": "cwnd5→6",
        "cap": "之后继续拥塞避免，按 RTT 近似每轮增长1 MSS。",
        "values": [
          "cwnd≈6",
          "AIMD"
        ]
      },
      {
        "tag": "如果是 RTO 超时",
        "from": 1,
        "to": 0,
        "event": "RTO 对照分支",
        "cap": "另一个分支：若是重传超时而非三重复 ACK，传统 Reno 会重新慢开始，ssthresh 通常减半，cwnd 重设为较小值；这是对照分支，并非本次事件顺序中又发生一次超时。",
        "values": [
          "分支：RTO",
          "重启慢开始"
        ]
      }
    ]
  },
  {
    "name": "net-dns-recursive",
    "actors": [
      "客户端",
      "递归解析器",
      "根 DNS",
      "TLD .com",
      "权威 DNS"
    ],
    "steps": [
      {
        "tag": "访问域名",
        "from": 0,
        "to": 0,
        "event": "www.example.com",
        "cap": "客户端需要解析 www.example.com，先查浏览器、系统和已有 DNS 缓存；本例假设没有命中。",
        "values": [
          "目标 www.example.com",
          "请求 A 记录"
        ]
      },
      {
        "tag": "递归查询",
        "from": 0,
        "to": 1,
        "event": "RD=1 查询 A",
        "cap": "客户端向递归解析器发送查询，期望获得最终答案或失败状态，不直接询问各级权威 DNS。",
        "values": [
          "客户端只请求解析器",
          "RD=1"
        ]
      },
      {
        "tag": "本地缓存未命中",
        "from": 1,
        "to": 1,
        "event": "Cache Miss",
        "cap": "递归解析器检查正/负缓存；未命中后，开始向 DNS 树中的权威服务器迭代查询。",
        "values": [
          "从缓存转为上游查询"
        ]
      },
      {
        "tag": "问根 DNS",
        "from": 1,
        "to": 2,
        "event": "Q: www.example.com A",
        "cap": "递归解析器询问根 DNS，根服务器通常不提供目标主机的 A 记录，而返回 .com TLD 的转介。",
        "values": [
          "根：权威于根区"
        ]
      },
      {
        "tag": "根返回转介",
        "from": 2,
        "to": 1,
        "event": "Referral: .com NS",
        "cap": "根 DNS 把 .com 顶级域服务器的 NS/Glue 等线索返回递归解析器。<b>根不会替它继续问 TLD</b>。",
        "values": [
          "下一站 TLD"
        ]
      },
      {
        "tag": "问 TLD .com",
        "from": 1,
        "to": 3,
        "event": "Q: www.example.com A",
        "cap": "递归解析器联系 .com 顶级域 DNS，继续查询 www.example.com 的地址记录。",
        "values": [
          "向 .com 发 Query"
        ]
      },
      {
        "tag": "TLD 返回转介",
        "from": 3,
        "to": 1,
        "event": "Referral: example.com NS",
        "cap": "TLD 返回 example.com 的权威 DNS 信息；递归解析器由此决定下一站。",
        "values": [
          "下一站 example.com 权威"
        ]
      },
      {
        "tag": "查询权威",
        "from": 1,
        "to": 4,
        "event": "Q: www.example.com A",
        "cap": "递归解析器对 example.com 权威服务器发送实际资源记录查询。",
        "values": [
          "权威服务器答复"
        ]
      },
      {
        "tag": "权威返回结果",
        "from": 4,
        "to": 1,
        "event": "Answer: A / CNAME",
        "cap": "假设存在地址记录，权威 DNS 返回最终 A 记录；如果是 CNAME 可能需要继续查询，若名称不存在可返回 NXDOMAIN。",
        "values": [
          "示例答案 203.0.113.10",
          "文档示例地址"
        ]
      },
      {
        "tag": "缓存最终记录",
        "from": 1,
        "to": 1,
        "event": "按 TTL 缓存",
        "cap": "递归解析器按资源记录的 TTL 和相关缓存规则保存结果，后续有相同查询时可直接命中。",
        "values": [
          "缓存 TTL 不会无限期保留"
        ]
      },
      {
        "tag": "回答客户端",
        "from": 1,
        "to": 0,
        "event": "Response: 203.0.113.10",
        "cap": "递归解析器将最终结果返回客户端；这体现<b>客户端—递归解析器</b>的递归请求和<b>解析器—权威层级</b>的迭代查询区别。",
        "values": [
          "客户端获得地址"
        ]
      },
      {
        "tag": "应用建立连接",
        "from": 0,
        "to": 0,
        "event": "向目标 IP 连接",
        "cap": "拿到 IP 地址后，浏览器选择目标地址并建立传输连接；这是 DNS 解析结束后的动作，不属于 DNS 协议内部步骤。",
        "values": [
          "DNS 已完成"
        ]
      }
    ]
  },
  {
    "name": "net-dns-iterative",
    "actors": [
      "迭代解析器",
      "根 DNS",
      "TLD .com",
      "权威 DNS"
    ],
    "steps": [
      {
        "tag": "迭代解析器准备",
        "from": 0,
        "to": 0,
        "event": "目标 www.example.com",
        "cap": "假设迭代解析器没有缓存，准备沿 DNS 分层委派结构查找 www.example.com 的 A 记录。",
        "values": [
          "从根开始",
          "RD=0（典型迭代）"
        ]
      },
      {
        "tag": "向根发送 Query",
        "from": 0,
        "to": 1,
        "event": "Q: www.example.com A",
        "cap": "迭代解析器向根 DNS 询问目标域名。根区通常不直接保存该主机地址记录。",
        "values": [
          "解析器→根"
        ]
      },
      {
        "tag": "根返回 .com 转介",
        "from": 1,
        "to": 0,
        "event": "Referral .com NS",
        "cap": "根 DNS 返回 .com TLD DNS 的权威线索；<b>根服务器没有继续向 .com 发请求</b>。",
        "values": [
          "根→解析器",
          "转介不是最终 IP"
        ]
      },
      {
        "tag": "向 .com 查询",
        "from": 0,
        "to": 2,
        "event": "Q: www.example.com A",
        "cap": "迭代解析器根据根给的线索，自己向 .com TLD DNS 发新请求。",
        "values": [
          "解析器→TLD"
        ]
      },
      {
        "tag": "TLD 返回权威转介",
        "from": 2,
        "to": 0,
        "event": "Referral example.com NS",
        "cap": "TLD 返回 example.com 权威服务器信息；解析器需要再次发送请求。",
        "values": [
          "TLD→解析器"
        ]
      },
      {
        "tag": "向权威服务器查询",
        "from": 0,
        "to": 3,
        "event": "Q: www.example.com A",
        "cap": "解析器向 example.com 的权威 DNS 查询主机地址。",
        "values": [
          "解析器→权威"
        ]
      },
      {
        "tag": "权威返回答案",
        "from": 3,
        "to": 0,
        "event": "Answer: 203.0.113.10",
        "cap": "假定权威 DNS 含有 A 记录，返回示例 IPv4 地址203.0.113.10。若返回 CNAME，需要额外解析。",
        "values": [
          "权威→解析器",
          "最终地址"
        ]
      },
      {
        "tag": "存入缓存",
        "from": 0,
        "to": 0,
        "event": "TTL 控制缓存",
        "cap": "解析器按 TTL 保存结果，后续同类查询可以减少对权威服务器的访问。",
        "values": [
          "缓存机制"
        ]
      },
      {
        "tag": "对照递归",
        "from": 0,
        "to": 0,
        "event": "谁负责后续查询？",
        "cap": "递归与迭代的本质区别是责任：递归查询由受询方负责求完整答案；迭代查询的受询方可给出转介，询问方再发下一跳请求。",
        "values": [
          "迭代：解析器连续发问"
        ]
      }
    ]
  },
  {
    "name": "net-http",
    "actors": [
      "浏览器",
      "DNS 解析器",
      "HTTPS 服务器"
    ],
    "steps": [
      {
        "tag": "输入 URL",
        "from": 0,
        "to": 0,
        "event": "https://example.com/",
        "cap": "浏览器解析 URL 的 scheme=https、host=example.com、路径=/，检查已有缓存与可复用连接。此例演示<b>首次建立的 HTTPS/1.1 TCP 连接</b>。",
        "values": [
          "HTTP/1.1 over TLS",
          "不演示 HTTP/3"
        ]
      },
      {
        "tag": "DNS 请求",
        "from": 0,
        "to": 1,
        "event": "A/AAAA Query",
        "cap": "浏览器通过系统解析器请求 example.com 的 A/AAAA 记录。这里假设没有缓存命中。",
        "values": [
          "名称→地址"
        ]
      },
      {
        "tag": "DNS 响应",
        "from": 1,
        "to": 0,
        "event": "A/AAAA Answer",
        "cap": "DNS 查询返回服务器地址，例如文档用途 IP 203.0.113.10。浏览器根据连接策略选择目标地址。",
        "values": [
          "DNS 完成"
        ]
      },
      {
        "tag": "TCP 第一次握手",
        "from": 0,
        "to": 2,
        "event": "SYN seq=x",
        "cap": "浏览器向服务器443端口发送 SYN（seq=x），开始建立 TCP 连接，客户端进入 SYN-SENT。",
        "values": [
          "SYN 占用1序号"
        ]
      },
      {
        "tag": "TCP 第二次握手",
        "from": 2,
        "to": 0,
        "event": "SYN+ACK seq=y ack=x+1",
        "cap": "服务器确认客户端 SYN 并发回自己的 SYN：ack=x+1，seq=y。服务器处于 SYN-RECEIVED。",
        "values": [
          "SYN+ACK"
        ]
      },
      {
        "tag": "TCP 第三次握手",
        "from": 0,
        "to": 2,
        "event": "ACK ack=y+1",
        "cap": "浏览器确认服务器的 SYN，发送 ACK ack=y+1；服务器收到后完成 TCP 连接建立。",
        "values": [
          "TCP ESTABLISHED"
        ]
      },
      {
        "tag": "TLS ClientHello",
        "from": 0,
        "to": 2,
        "event": "ClientHello",
        "cap": "浏览器发送 TLS ClientHello，提出可用协议版本、密码套件、SNI、ALPN 等信息（具体取决于 TLS 版本）。",
        "values": [
          "开始 TLS 握手"
        ]
      },
      {
        "tag": "TLS ServerHello",
        "from": 2,
        "to": 0,
        "event": "ServerHello + 证书等",
        "cap": "服务器返回协商参数及身份相关材料；客户端验证服务器证书、域名和信任链，双方派生会话密钥。",
        "values": [
          "身份验证与密钥协商"
        ]
      },
      {
        "tag": "TLS 握手完成",
        "from": 0,
        "to": 2,
        "event": "Finished",
        "cap": "TLS 双方完成握手确认后，HTTP 请求和响应通过加密的 TLS 通道传输。这里不展开 TLS 1.3 0-RTT 等优化。",
        "values": [
          "TLS 应用数据可发送"
        ]
      },
      {
        "tag": "发送 HTTP GET",
        "from": 0,
        "to": 2,
        "event": "GET / HTTP/1.1",
        "cap": "浏览器发送 GET / HTTP/1.1，请求头含 Host: example.com 等。HTTP 是应用层协议，TCP/TLS 承载其字节流。",
        "values": [
          "请求行 + 首部",
          "请求正文可选"
        ]
      },
      {
        "tag": "服务器发送状态与首部",
        "from": 2,
        "to": 0,
        "event": "HTTP/1.1 200 OK",
        "cap": "服务器先发送响应状态行和响应首部，如 Content-Type: text/html、Content-Length 或 Transfer-Encoding。",
        "values": [
          "响应状态与头部"
        ]
      },
      {
        "tag": "服务器发送 HTML",
        "from": 2,
        "to": 0,
        "event": "HTML 响应正文",
        "cap": "浏览器接收 HTML 字节流；网络层、传输层的分段与应用层的 HTTP 报文边界不是一回事。",
        "values": [
          "HTML 已收到"
        ]
      },
      {
        "tag": "解析 HTML",
        "from": 0,
        "to": 0,
        "event": "DOM + 资源发现",
        "cap": "浏览器解析 HTML 形成 DOM，同时发现 CSS、JavaScript、图片等资源 URL，按缓存和优先级继续安排请求。",
        "values": [
          "发现后续资源"
        ]
      },
      {
        "tag": "请求 CSS/JS/图片",
        "from": 0,
        "to": 2,
        "event": "GET 资源",
        "cap": "浏览器通过已有连接或新的/复用连接请求额外资源，响应可能并行、复用，具体由 HTTP 版本与浏览器策略决定。",
        "values": [
          "获取静态资源"
        ]
      },
      {
        "tag": "计算样式与布局",
        "from": 0,
        "to": 0,
        "event": "CSSOM / Layout",
        "cap": "加载和处理样式、脚本，计算元素样式、页面布局，并安排绘制；实际浏览器渲染可能交错进行。",
        "values": [
          "样式→布局→绘制"
        ]
      },
      {
        "tag": "显示页面",
        "from": 0,
        "to": 0,
        "event": "页面可见",
        "cap": "页面首次呈现后，浏览器还可能继续加载资源、运行脚本和发起网络请求；不能把“显示”误认为所有网络活动结束。",
        "values": [
          "本次演示完成"
        ]
      }
    ]
  },
  {
    "name": "net-email",
    "actors": [
      "发件人 MUA",
      "发送端 SMTP",
      "收件端 SMTP",
      "收件人 MUA"
    ],
    "steps": [
      {
        "tag": "准备邮件内容",
        "from": 0,
        "to": 0,
        "event": "From/To/Subject/MIME",
        "cap": "发件人用邮件用户代理（MUA）准备邮件，包括信封收件人与邮件头（To/From/Subject），以及 MIME 正文和附件。信封与邮件头是不同概念。",
        "values": [
          "邮件封装"
        ]
      },
      {
        "tag": "提交邮件",
        "from": 0,
        "to": 1,
        "event": "SMTP Submission",
        "cap": "发件客户端通过邮件提交服务向自己的邮件服务器发送邮件，常使用认证和 TLS；提交与服务器间的 SMTP 转发应区分。",
        "values": [
          "MUA→MSA",
          "通常提交端口587"
        ]
      },
      {
        "tag": "发送端查 MX",
        "from": 1,
        "to": 1,
        "event": "DNS MX Lookup",
        "cap": "邮件服务器查询收件人域的 MX 记录，选出目标邮件交换主机；如果没有 MX 可适用特定 fallback 规则。",
        "values": [
          "收件域 MX"
        ]
      },
      {
        "tag": "建立 SMTP 会话",
        "from": 1,
        "to": 2,
        "event": "TCP + EHLO",
        "cap": "发送端联系收件服务器，建立 TCP 会话并使用 EHLO 声明客户端能力；是否使用 STARTTLS 取决于双方策略与支持。",
        "values": [
          "SMTP 建立会话"
        ]
      },
      {
        "tag": "MAIL FROM",
        "from": 1,
        "to": 2,
        "event": "MAIL FROM:<sender>",
        "cap": "发送 SMTP 信封发件人（MAIL FROM），用于传输和退信处理；它不一定与可见邮件头 From 相同。",
        "values": [
          "信封发件人"
        ]
      },
      {
        "tag": "RCPT TO",
        "from": 1,
        "to": 2,
        "event": "RCPT TO:<recipient>",
        "cap": "发送一个或多个 SMTP 信封收件人 RCPT TO，收件服务器可逐个接受或拒绝。",
        "values": [
          "信封收件人"
        ]
      },
      {
        "tag": "发送 DATA 命令",
        "from": 1,
        "to": 2,
        "event": "DATA",
        "cap": "SMTP 客户端先发送 DATA 命令请求进入邮件数据模式，而不是马上把整封邮件直接发出。",
        "values": [
          "等待服务器 354"
        ]
      },
      {
        "tag": "服务器允许发送",
        "from": 2,
        "to": 1,
        "event": "354 Start mail input",
        "cap": "SMTP 服务器返回 354，表示可以开始输入邮件内容。",
        "values": [
          "DATA阶段"
        ]
      },
      {
        "tag": "传输邮件数据",
        "from": 1,
        "to": 2,
        "event": "邮件头 + 空行 + 正文",
        "cap": "客户端发送 RFC 5322 格式的邮件头、空行和邮件正文（包括 MIME 附件结构），使用 SMTP 透明传输规则。",
        "values": [
          "头部/正文/MIME"
        ]
      },
      {
        "tag": "发送结束标记",
        "from": 1,
        "to": 2,
        "event": "<CRLF>.<CRLF>",
        "cap": "SMTP DATA 传输以仅一个句点的行结束（&lt;CRLF&gt;.&lt;CRLF&gt;）；正文若有以点开头的行，需要点透明传输处理。",
        "values": [
          "DATA消息结束"
        ]
      },
      {
        "tag": "接收端确认",
        "from": 2,
        "to": 1,
        "event": "250 Accepted",
        "cap": "接收服务器在成功接收邮件内容后返回 250 等应答。<b>SMTP 250 不保证最终送达用户收件箱</b>，后续仍可能过滤/转投。",
        "values": [
          "SMTP 事务完成"
        ]
      },
      {
        "tag": "投递本地邮箱",
        "from": 2,
        "to": 2,
        "event": "MDA / Mailbox",
        "cap": "接收端执行垃圾邮件过滤、规则路由、投递到用户邮箱等步骤；是否存入收件箱取决于服务器策略。",
        "values": [
          "邮箱存储"
        ]
      },
      {
        "tag": "收件人查询邮件",
        "from": 3,
        "to": 2,
        "event": "IMAP / POP3",
        "cap": "收件用户代理通过 IMAP 同步文件夹、读取邮件，或用 POP3 下载邮件；SMTP 不负责用户读取邮箱。",
        "values": [
          "IMAP 同步/POP3下载"
        ]
      },
      {
        "tag": "邮箱响应",
        "from": 2,
        "to": 3,
        "event": "邮件内容 + 附件",
        "cap": "收件客户端获得邮件正文、头部和附件并呈现给用户；附件通常在 MIME 结构中。",
        "values": [
          "邮件可见"
        ]
      },
      {
        "tag": "安全协议各有作用",
        "from": 0,
        "to": 0,
        "event": "TLS / SPF / DKIM / DMARC",
        "cap": "TLS 保护相应的传输连接；SPF/DKIM/DMARC 处理发件身份和域策略，不代表邮件获得了端到端加密。",
        "values": [
          "防伪冒与加密不能混淆"
        ]
      }
    ]
  }
];
