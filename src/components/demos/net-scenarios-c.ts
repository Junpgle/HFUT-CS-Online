/** 计网第 7—8 章：TCP 状态机、拥塞与应用层 DNS/HTTP/邮件流程的逐帧案例。 */
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
      "发送端",
      "网络拥塞",
      "接收端"
    ],
    "steps": [
      {
        "tag": "初始化 cwnd",
        "from": 0,
        "to": 0,
        "event": "cwnd=1 MSS",
        "cap": "用教材式 TCP Reno 示意：初始 cwnd=1 MSS，慢开始门限 ssthresh=8 MSS（人为设定作图）。",
        "values": [
          "cwnd=1MSS",
          "ssthresh=8"
        ]
      },
      {
        "tag": "第 1 RTT",
        "from": 0,
        "to": 2,
        "event": "ACK 推进",
        "cap": "慢开始阶段在收到 ACK 后累计增窗，理想情况下一个 RTT 内 cwnd 大致翻倍，由1到2 MSS。",
        "values": [
          "RTT1:cwnd2",
          "慢开始指数增长"
        ]
      },
      {
        "tag": "第 2 RTT",
        "from": 0,
        "to": 2,
        "event": "再次增长",
        "cap": "下一个 RTT 大致由2到4 MSS；在没有丢包和拥塞信号时继续增长。",
        "values": [
          "RTT2:cwnd4"
        ]
      },
      {
        "tag": "达到门限",
        "from": 0,
        "to": 2,
        "event": "4→8 MSS",
        "cap": "继续增长到 ssthresh=8 MSS，转入拥塞避免阶段。这里的门限不是整个网络容量的硬保证。",
        "values": [
          "cwnd8",
          "转拥塞避免"
        ]
      },
      {
        "tag": "加性增大",
        "from": 0,
        "to": 2,
        "event": "8→9 MSS",
        "cap": "拥塞避免阶段近似每 RTT 增加 1 MSS，而不是像慢开始那样指数翻倍。",
        "values": [
          "cwnd9"
        ]
      },
      {
        "tag": "继续线性增长",
        "from": 0,
        "to": 2,
        "event": "9→10 MSS",
        "cap": "下一 RTT 继续加性增大到10 MSS，真实实现按收到的 ACK 更新，图为按 RTT 聚合的教学示意。",
        "values": [
          "cwnd10"
        ]
      },
      {
        "tag": "发生丢包",
        "from": 1,
        "to": 0,
        "event": "3 个重复 ACK",
        "cap": "假设出现三个重复 ACK，Reno 判定可能有报文段丢失：触发快重传，ssthresh 约设为当前 cwnd 的一半。",
        "values": [
          "ssthresh≈5",
          "快重传"
        ]
      },
      {
        "tag": "快恢复",
        "from": 0,
        "to": 2,
        "event": "重发缺失报文段",
        "cap": "Reno 快恢复期间可使用临时膨胀的 cwnd 规则，收到重传数据的确认后退出快恢复，cwnd 回到门限附近。",
        "values": [
          "cwnd≈5",
          "乘性减小"
        ]
      },
      {
        "tag": "重新拥塞避免",
        "from": 0,
        "to": 2,
        "event": "cwnd线性增长",
        "cap": "之后继续按拥塞避免方式增大 cwnd。三重复 ACK 与 RTO 超时是不同拥塞信号，后者经典算法通常更激进地降低窗口。",
        "values": [
          "AIMD",
          "加性增、乘性减"
        ]
      },
      {
        "tag": "RTO 对照",
        "from": 1,
        "to": 0,
        "event": "超时重传",
        "cap": "若是重传超时，传统 Reno 会设较低 ssthresh，并把 cwnd 退回较小初始值再慢开始；不能把超时和三重复 ACK 的处理完全混为一谈。",
        "values": [
          "RTO→慢开始",
          "示例模型非唯一实现"
        ]
      }
    ]
  },
  {
    "name": "net-dns-recursive",
    "actors": [
      "浏览器",
      "递归解析器",
      "根/TLD DNS",
      "权威 DNS"
    ],
    "steps": [
      {
        "tag": "访问域名",
        "from": 0,
        "to": 0,
        "event": "www.example.com",
        "cap": "应用要连接 www.example.com，需要先得到对应的地址记录。先查看浏览器/操作系统缓存；这里假定没有缓存。",
        "values": [
          "需要 A/AAAA 记录"
        ]
      },
      {
        "tag": "递归请求",
        "from": 0,
        "to": 1,
        "event": "RD=1 Query",
        "cap": "客户端把查询交给本地递归解析器，表示希望它代为解析并返回最终结果或失败；客户端一般不亲自逐级查询根服务器。",
        "values": [
          "客户端→递归解析器",
          "RD=1"
        ]
      },
      {
        "tag": "查本地缓存",
        "from": 1,
        "to": 1,
        "event": "缓存未命中",
        "cap": "递归解析器检查缓存，若没有有效答案，会向上游 DNS 权威层级进行查询；在常见实现中，上游通常是迭代查询。",
        "values": [
          "缓存 Miss"
        ]
      },
      {
        "tag": "查询根 DNS",
        "from": 1,
        "to": 2,
        "event": "询问 example.com",
        "cap": "递归解析器向根域名服务器查询，根返回 .com 顶级域名服务器的转介信息，而不代替解析器完成整条链路。",
        "values": [
          "根返回 .com 引荐"
        ]
      },
      {
        "tag": "查询 TLD",
        "from": 1,
        "to": 2,
        "event": "向 .com 询问",
        "cap": "解析器联系 .com TLD 服务器，得到 example.com 的权威服务器信息。",
        "values": [
          "TLD 返回权威 NS"
        ]
      },
      {
        "tag": "询问权威",
        "from": 1,
        "to": 3,
        "event": "查询 www.example.com",
        "cap": "递归解析器向权威 DNS 服务器查询最终记录，得到答复或相应的错误结果。",
        "values": [
          "权威返回 IP"
        ]
      },
      {
        "tag": "缓存答案",
        "from": 1,
        "to": 1,
        "event": "按 TTL 缓存",
        "cap": "递归解析器根据 DNS 资源记录 TTL 等规则缓存记录，以减少后续重复查询。",
        "values": [
          "TTL 控制缓存"
        ]
      },
      {
        "tag": "递归应答",
        "from": 1,
        "to": 0,
        "event": "最终 A / AAAA",
        "cap": "解析器把最终结果返回客户端；客户端只需发起一次递归请求，后续迭代转介由递归解析器处理。",
        "values": [
          "客户端收到记录"
        ]
      },
      {
        "tag": "启动连接",
        "from": 0,
        "to": 0,
        "event": "访问目标地址",
        "cap": "浏览器得到 IP 后可建立到目标的传输层连接。DNS 本身不负责建立网页 TCP/QUIC 连接。",
        "values": [
          "DNS 完成"
        ]
      }
    ]
  },
  {
    "name": "net-dns-iterative",
    "actors": [
      "迭代解析器",
      "根 DNS",
      "TLD DNS",
      "权威 DNS"
    ],
    "steps": [
      {
        "tag": "先问根服务器",
        "from": 0,
        "to": 1,
        "event": "example.com A?",
        "cap": "迭代查询的被询问服务器若不知道最终答案，可以返回下一层权威服务器的转介信息，而非替客户端继续查到底。",
        "values": [
          "从根开始",
          "根提供线索"
        ]
      },
      {
        "tag": "收到根的转介",
        "from": 1,
        "to": 0,
        "event": "指向 .com",
        "cap": "根域名服务器返回 .com 的 NS/附加地址等信息（转介）；解析器必须自己决定后续查哪个服务器。",
        "values": [
          "下一站=.com"
        ]
      },
      {
        "tag": "查询 .com",
        "from": 0,
        "to": 2,
        "event": "www.example.com A?",
        "cap": "解析器依据根服务器的转介信息向 .com TLD DNS 发起查询。",
        "values": [
          "迭代第2跳"
        ]
      },
      {
        "tag": "收到权威线索",
        "from": 2,
        "to": 0,
        "event": "指向 example.com NS",
        "cap": "TLD 返回 example.com 的权威服务器 NS 等信息，通常不是最终主机 A 记录。",
        "values": [
          "下一站=权威"
        ]
      },
      {
        "tag": "查询权威",
        "from": 0,
        "to": 3,
        "event": "www.example.com A?",
        "cap": "解析器向该域的权威服务器查询具体记录。权威服务器按其配置答复。",
        "values": [
          "迭代第3跳"
        ]
      },
      {
        "tag": "返回最终答案",
        "from": 3,
        "to": 0,
        "event": "A / AAAA",
        "cap": "收到目标域名地址记录，迭代查询链结束；地址可能是多个，或存在 CNAME 等额外步骤。",
        "values": [
          "解析结果可缓存"
        ]
      },
      {
        "tag": "对照递归查询",
        "from": 0,
        "to": 0,
        "event": "责任划分不同",
        "cap": "迭代查询中每个被询问的服务器通常给结果或下一步线索，解析器继续询问；递归查询由被问解析器负责求完整答案。",
        "values": [
          "区别是查找责任"
        ]
      },
      {
        "tag": "考试提醒",
        "from": 0,
        "to": 0,
        "event": "别画成根继续问 TLD",
        "cap": "正确的迭代示意是解析器分别与根、TLD、权威 DNS 通信，<b>不是根 DNS 替解析器去查询 TLD</b>。",
        "values": [
          "根只返回转介"
        ]
      }
    ]
  },
  {
    "name": "net-http",
    "actors": [
      "浏览器",
      "递归 DNS",
      "Web 服务器"
    ],
    "steps": [
      {
        "tag": "输入 URL",
        "from": 0,
        "to": 0,
        "event": "https://example.com/",
        "cap": "浏览器解析 URL 的 scheme、host、路径等，并检查缓存、已有连接等。此处以新的 HTTPS 访问为例。",
        "values": [
          "scheme=https",
          "host=example.com"
        ]
      },
      {
        "tag": "解析域名",
        "from": 0,
        "to": 1,
        "event": "DNS Query",
        "cap": "如果缓存没有可用地址，浏览器/操作系统发起 DNS 查询，得到服务器的 A/AAAA 等记录。",
        "values": [
          "DNS→IP 地址"
        ]
      },
      {
        "tag": "取得 IP",
        "from": 1,
        "to": 0,
        "event": "DNS Answer",
        "cap": "浏览器得到服务端地址后选择目标 IP，准备建立连接。",
        "values": [
          "服务器地址已知"
        ]
      },
      {
        "tag": "建立传输连接",
        "from": 0,
        "to": 2,
        "event": "TCP SYN/SYN+ACK/ACK",
        "cap": "以经典 HTTP/1.1 over TLS 为例，先建立 TCP 连接。<b>HTTP/3 使用 QUIC/UDP</b>，不执行相同的 TCP 三次握手。",
        "values": [
          "TCP 连接",
          "HTTP/1.1 场景"
        ]
      },
      {
        "tag": "TLS 握手",
        "from": 0,
        "to": 2,
        "event": "ClientHello 等",
        "cap": "HTTPS 建立 TLS 安全会话，协商密钥和身份验证，随后应用数据以加密方式传输。",
        "values": [
          "TLS 建立",
          "验证证书"
        ]
      },
      {
        "tag": "发送 HTTP 请求",
        "from": 0,
        "to": 2,
        "event": "GET / HTTP/1.1",
        "cap": "浏览器发送包含方法、路径、Host、请求头等的 HTTP 请求，可能有 Cookie 与其他首部。",
        "values": [
          "GET /",
          "Host:example.com"
        ]
      },
      {
        "tag": "返回 HTTP 响应",
        "from": 2,
        "to": 0,
        "event": "200 OK + HTML",
        "cap": "服务器返回状态行/头部和响应正文；浏览器还可能处理重定向、压缩和缓存指令。",
        "values": [
          "HTTP 200",
          "Content-Type:text/html"
        ]
      },
      {
        "tag": "解析并加载资源",
        "from": 0,
        "to": 0,
        "event": "HTML→CSS/JS/图片",
        "cap": "浏览器解析 HTML，构建 DOM，并根据需要继续请求 CSS、JavaScript、字体、图片等资源。",
        "values": [
          "渲染管线启动"
        ]
      },
      {
        "tag": "最终显示页面",
        "from": 0,
        "to": 0,
        "event": "页面可见",
        "cap": "页面经历样式计算、布局、绘制等阶段后显示；浏览器还可继续执行脚本与异步网络请求。",
        "values": [
          "DNS、TCP/TLS、HTTP、渲染"
        ]
      }
    ]
  },
  {
    "name": "net-email",
    "actors": [
      "发件人 MUA",
      "发送 SMTP 服务器",
      "接收邮件服务器",
      "收件人 MUA"
    ],
    "steps": [
      {
        "tag": "撰写邮件",
        "from": 0,
        "to": 0,
        "event": "收件地址+正文",
        "cap": "用户代理（MUA）整理收件人、主题、正文与附件，附件等非文本内容通常通过 MIME 编码/封装。",
        "values": [
          "From/To/Subject",
          "MIME 附件"
        ]
      },
      {
        "tag": "提交邮件",
        "from": 0,
        "to": 1,
        "event": "SMTP Submission",
        "cap": "发件客户端使用邮件提交服务把邮件交给自己的邮件服务器；通常通过带身份验证的提交端口并结合 TLS。",
        "values": [
          "客户端→提交服务"
        ]
      },
      {
        "tag": "查询接收域 MX",
        "from": 1,
        "to": 1,
        "event": "DNS MX 查询",
        "cap": "发送方邮件服务器查询收件人域名的 MX 记录，决定优先向哪个接收服务器投递；具体还需按 DNS 和 SMTP 规则处理。",
        "values": [
          "DNS MX 记录"
        ]
      },
      {
        "tag": "服务器间投递",
        "from": 1,
        "to": 2,
        "event": "SMTP MAIL/RCPT/DATA",
        "cap": "发送服务器通过 SMTP 与接收方邮件服务器通信；常见的 SMTP 命令包含 MAIL FROM、RCPT TO、DATA。",
        "values": [
          "SMTP 负责发送"
        ]
      },
      {
        "tag": "接收服务器存储",
        "from": 2,
        "to": 2,
        "event": "邮箱存储",
        "cap": "接收服务器接受并存储投递内容，可能触发垃圾邮件过滤、反病毒和其他投递策略。",
        "values": [
          "投递可被策略拒绝"
        ]
      },
      {
        "tag": "收件人查看",
        "from": 3,
        "to": 2,
        "event": "IMAP / POP3",
        "cap": "收件人使用 IMAP 同步邮件夹，或使用 POP3 下载邮件，具体取决于客户端与服务配置。",
        "values": [
          "IMAP 同步",
          "POP3 下载"
        ]
      },
      {
        "tag": "邮件显示",
        "from": 2,
        "to": 3,
        "event": "返回邮件内容",
        "cap": "邮件内容到达收件人的客户端，显示正文与附件。SMTP 主要负责提交/传输，IMAP/POP3 主要负责读取。",
        "values": [
          "投递与读取区分"
        ]
      },
      {
        "tag": "安全补充",
        "from": 0,
        "to": 3,
        "event": "TLS、SPF/DKIM/DMARC",
        "cap": "TLS 提供传输加密机制，SPF/DKIM/DMARC 主要用于发件域身份验证与策略，不表示邮件内容一定端到端加密。",
        "values": [
          "不同安全机制各司其职"
        ]
      }
    ]
  }
];
