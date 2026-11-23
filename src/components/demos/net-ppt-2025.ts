/** 2025 计网 PPT 原图动画重建：第7章第24页 UDP、第8章第24页 DNS、第7章第117–126页 cwnd、第6章路由匹配图。 */
import type { NetScenario } from './net-base';
export const netPpt2025Scenarios: NetScenario[] = [
  {
    "name": "net-udp-checksum-2025",
    "actors": [
      "UDP发送方",
      "反码加法器",
      "UDP接收方"
    ],
    "steps": [
      {
        "tag": "课件原例与数据",
        "from": 0,
        "to": 0,
        "event": "TESTING（7字节）",
        "cap": "按《第七章传输层》2025课件第24页原图：源IP <b>153.19.8.104</b>，目的IP <b>171.3.14.11</b>，UDP源端口1087、目的端口13，数据是 ASCII <b>TESTING</b>（7字节）。",
        "values": [
          "源153.19.8.104",
          "目的171.3.14.11",
          "TESTING 7B"
        ]
      },
      {
        "tag": "构造伪首部",
        "from": 0,
        "to": 1,
        "event": "伪首部12B",
        "cap": "校验和输入首先连接12字节 IPv4 伪首部：源IP4B、目的IP4B、全0 1B、协议号17 1B、UDP长度15 2B。<b>伪首部只参与校验，不在 UDP 报文里发送</b>。",
        "values": [
          "伪首部12B",
          "协议号=17",
          "UDP长度=15"
        ]
      },
      {
        "tag": "构造 UDP 首部",
        "from": 0,
        "to": 1,
        "event": "UDP首部8B",
        "cap": "UDP真实首部4个16位字段：源端口1087（0x043F）、目的端口13（0x000D）、长度15（0x000F）、校验和暂填0。",
        "values": [
          "源1087",
          "目的13",
          "长度15",
          "校验和先填0"
        ]
      },
      {
        "tag": "数据奇数长度补零",
        "from": 0,
        "to": 1,
        "event": "7字节→8字节",
        "cap": "数据 TESTING 的 ASCII 字节为 54 45 53 54 49 4E 47；因为只有7字节，为便于以16位字运算，在结尾临时补1字节00。该补零<b>不计入 UDP Length，也不发送</b>。",
        "values": [
          "TESTING=7B",
          "补齐到8B",
          "尾部00"
        ]
      },
      {
        "tag": "反码加法 1/14",
        "from": 1,
        "to": 1,
        "event": "9913 → 9913",
        "cap": "对课件第24页的第 <b>1</b> 个16位字做反码加法（源IP 153.19）：当前字 <code>9913</code>，累计从 <code>0000</code> 变为 <b>9913</b>。若有第17位进位，回卷加到最低位。",
        "values": [
          "字 1/14",
          "源IP 153.19: 9913",
          "累计和 9913"
        ],
        "bits": {
          "label": "16位累计和",
          "value": "9913",
          "mark": "0"
        }
      },
      {
        "tag": "反码加法 2/14",
        "from": 1,
        "to": 1,
        "event": "0868 → A17B",
        "cap": "对课件第24页的第 <b>2</b> 个16位字做反码加法（源IP 8.104）：当前字 <code>0868</code>，累计从 <code>9913</code> 变为 <b>A17B</b>。若有第17位进位，回卷加到最低位。",
        "values": [
          "字 2/14",
          "源IP 8.104: 0868",
          "累计和 A17B"
        ],
        "bits": {
          "label": "16位累计和",
          "value": "A17B",
          "mark": "1"
        }
      },
      {
        "tag": "反码加法 3/14",
        "from": 1,
        "to": 1,
        "event": "AB03 → 4C7F",
        "cap": "对课件第24页的第 <b>3</b> 个16位字做反码加法（目的IP 171.3）：当前字 <code>AB03</code>，累计从 <code>A17B</code> 变为 <b>4C7F</b>。若有第17位进位，回卷加到最低位。",
        "values": [
          "字 3/14",
          "目的IP 171.3: AB03",
          "累计和 4C7F"
        ],
        "bits": {
          "label": "16位累计和",
          "value": "4C7F",
          "mark": "2"
        }
      },
      {
        "tag": "反码加法 4/14",
        "from": 1,
        "to": 1,
        "event": "0E0B → 5A8A",
        "cap": "对课件第24页的第 <b>4</b> 个16位字做反码加法（目的IP 14.11）：当前字 <code>0E0B</code>，累计从 <code>4C7F</code> 变为 <b>5A8A</b>。若有第17位进位，回卷加到最低位。",
        "values": [
          "字 4/14",
          "目的IP 14.11: 0E0B",
          "累计和 5A8A"
        ],
        "bits": {
          "label": "16位累计和",
          "value": "5A8A",
          "mark": "3"
        }
      },
      {
        "tag": "反码加法 5/14",
        "from": 1,
        "to": 1,
        "event": "0011 → 5A9B",
        "cap": "对课件第24页的第 <b>5</b> 个16位字做反码加法（全0/协议17）：当前字 <code>0011</code>，累计从 <code>5A8A</code> 变为 <b>5A9B</b>。若有第17位进位，回卷加到最低位。",
        "values": [
          "字 5/14",
          "全0/协议17: 0011",
          "累计和 5A9B"
        ],
        "bits": {
          "label": "16位累计和",
          "value": "5A9B",
          "mark": "4"
        }
      },
      {
        "tag": "反码加法 6/14",
        "from": 1,
        "to": 1,
        "event": "000F → 5AAA",
        "cap": "对课件第24页的第 <b>6</b> 个16位字做反码加法（UDP长度15）：当前字 <code>000F</code>，累计从 <code>5A9B</code> 变为 <b>5AAA</b>。若有第17位进位，回卷加到最低位。",
        "values": [
          "字 6/14",
          "UDP长度15: 000F",
          "累计和 5AAA"
        ],
        "bits": {
          "label": "16位累计和",
          "value": "5AAA",
          "mark": "5"
        }
      },
      {
        "tag": "反码加法 7/14",
        "from": 1,
        "to": 1,
        "event": "043F → 5EE9",
        "cap": "对课件第24页的第 <b>7</b> 个16位字做反码加法（源端口1087）：当前字 <code>043F</code>，累计从 <code>5AAA</code> 变为 <b>5EE9</b>。若有第17位进位，回卷加到最低位。",
        "values": [
          "字 7/14",
          "源端口1087: 043F",
          "累计和 5EE9"
        ],
        "bits": {
          "label": "16位累计和",
          "value": "5EE9",
          "mark": "6"
        }
      },
      {
        "tag": "反码加法 8/14",
        "from": 1,
        "to": 1,
        "event": "000D → 5EF6",
        "cap": "对课件第24页的第 <b>8</b> 个16位字做反码加法（目的端口13）：当前字 <code>000D</code>，累计从 <code>5EE9</code> 变为 <b>5EF6</b>。若有第17位进位，回卷加到最低位。",
        "values": [
          "字 8/14",
          "目的端口13: 000D",
          "累计和 5EF6"
        ],
        "bits": {
          "label": "16位累计和",
          "value": "5EF6",
          "mark": "7"
        }
      },
      {
        "tag": "反码加法 9/14",
        "from": 1,
        "to": 1,
        "event": "000F → 5F05",
        "cap": "对课件第24页的第 <b>9</b> 个16位字做反码加法（UDP长度15）：当前字 <code>000F</code>，累计从 <code>5EF6</code> 变为 <b>5F05</b>。若有第17位进位，回卷加到最低位。",
        "values": [
          "字 9/14",
          "UDP长度15: 000F",
          "累计和 5F05"
        ],
        "bits": {
          "label": "16位累计和",
          "value": "5F05",
          "mark": "8"
        }
      },
      {
        "tag": "反码加法 10/14",
        "from": 1,
        "to": 1,
        "event": "0000 → 5F05",
        "cap": "对课件第24页的第 <b>10</b> 个16位字做反码加法（校验和0）：当前字 <code>0000</code>，累计从 <code>5F05</code> 变为 <b>5F05</b>。若有第17位进位，回卷加到最低位。",
        "values": [
          "字 10/14",
          "校验和0: 0000",
          "累计和 5F05"
        ],
        "bits": {
          "label": "16位累计和",
          "value": "5F05",
          "mark": "9"
        }
      },
      {
        "tag": "反码加法 11/14",
        "from": 1,
        "to": 1,
        "event": "5445 → B34A",
        "cap": "对课件第24页的第 <b>11</b> 个16位字做反码加法（数据 TE）：当前字 <code>5445</code>，累计从 <code>5F05</code> 变为 <b>B34A</b>。若有第17位进位，回卷加到最低位。",
        "values": [
          "字 11/14",
          "数据 TE: 5445",
          "累计和 B34A"
        ],
        "bits": {
          "label": "16位累计和",
          "value": "B34A",
          "mark": "10"
        }
      },
      {
        "tag": "反码加法 12/14",
        "from": 1,
        "to": 1,
        "event": "5354 → 069F",
        "cap": "对课件第24页的第 <b>12</b> 个16位字做反码加法（数据 ST）：当前字 <code>5354</code>，累计从 <code>B34A</code> 变为 <b>069F</b>。若有第17位进位，回卷加到最低位。",
        "values": [
          "字 12/14",
          "数据 ST: 5354",
          "累计和 069F"
        ],
        "bits": {
          "label": "16位累计和",
          "value": "069F",
          "mark": "11"
        }
      },
      {
        "tag": "反码加法 13/14",
        "from": 1,
        "to": 1,
        "event": "494E → 4FED",
        "cap": "对课件第24页的第 <b>13</b> 个16位字做反码加法（数据 IN）：当前字 <code>494E</code>，累计从 <code>069F</code> 变为 <b>4FED</b>。若有第17位进位，回卷加到最低位。",
        "values": [
          "字 13/14",
          "数据 IN: 494E",
          "累计和 4FED"
        ],
        "bits": {
          "label": "16位累计和",
          "value": "4FED",
          "mark": "12"
        }
      },
      {
        "tag": "反码加法 14/14",
        "from": 1,
        "to": 1,
        "event": "4700 → 96ED",
        "cap": "对课件第24页的第 <b>14</b> 个16位字做反码加法（数据 G+00）：当前字 <code>4700</code>，累计从 <code>4FED</code> 变为 <b>96ED</b>。若有第17位进位，回卷加到最低位。",
        "values": [
          "字 14/14",
          "数据 G+00: 4700",
          "累计和 96ED"
        ],
        "bits": {
          "label": "16位累计和",
          "value": "96ED",
          "mark": "13"
        }
      },
      {
        "tag": "取反得到检验和",
        "from": 1,
        "to": 0,
        "event": "~96ED = 6912",
        "cap": "将全部16位字反码相加的结果 <b>0x96ED</b> 逐位取反，得到 UDP 检验和 <b>0x6912</b>，即课件结尾的二进制 <code>01101001 00010010</code>。",
        "values": [
          "和0x96ED",
          "检验和0x6912"
        ],
        "bits": {
          "label": "UDP checksum",
          "value": "6912"
        }
      },
      {
        "tag": "写入并发送 UDP 数据报",
        "from": 0,
        "to": 2,
        "event": "Checksum = 0x6912",
        "cap": "将校验和0x6912写入 UDP 首部，实际发送的 UDP 用户数据报仍为 <b>8字节首部+7字节数据=15字节</b>，不包含伪首部和末尾填充0。",
        "values": [
          "UDP长度15B",
          "伪首部不发送"
        ]
      },
      {
        "tag": "接收端验证",
        "from": 2,
        "to": 2,
        "event": "16位和应为 FFFF",
        "cap": "接收端将包含检验和的 UDP 报文与相应伪首部进行相同反码求和。无差错的示例中最终为 <b>0xFFFF</b>；若校验失败则检测到传输差错。",
        "values": [
          "0x96ED+0x6912=0xFFFF",
          "仅能检错"
        ],
        "bits": {
          "label": "接收校验和",
          "value": "FFFF"
        }
      }
    ]
  },
  {
    "name": "net-dns-full-recursive-2025",
    "actors": [
      "客户主机",
      "本地 dns.xyz.com",
      "根 DNS",
      "TLD dns.com",
      "权威 dns.abc.com"
    ],
    "steps": [
      {
        "tag": "课件图与解析任务",
        "from": 0,
        "to": 0,
        "event": "查询 y.abc.com",
        "cap": "《2025-第8章应用层》第24页以 <b>y.abc.com</b> 为例，对比服务器间的完全递归查询：受询方继续代查到底，再将结果沿调用链返回。<b>课件标注这种服务器间递归方式较少用</b>。",
        "values": [
          "源：应用层第24页",
          "查询 y.abc.com"
        ]
      },
      {
        "tag": "① 客户端递归请求",
        "from": 0,
        "to": 1,
        "event": "Query y.abc.com",
        "cap": "客户主机请求本地服务器 dns.xyz.com 解析 y.abc.com，期待获得最终结果，本地服务器承担解析责任。",
        "values": [
          "客户端→本地"
        ]
      },
      {
        "tag": "② 本地向根发递归请求",
        "from": 1,
        "to": 2,
        "event": "Query y.abc.com",
        "cap": "本地服务器继续请求根 DNS。在本课件的完全递归示意中，这一层也是递归请求，根服务器将继续代查。",
        "values": [
          "本地→根"
        ]
      },
      {
        "tag": "③ 根向 TLD 请求",
        "from": 2,
        "to": 3,
        "event": "Query y.abc.com",
        "cap": "根服务器代表查询链向 .com 顶级域名服务器 dns.com 发出后续查询，不仅返回指向 TLD 的线索。",
        "values": [
          "根→TLD"
        ]
      },
      {
        "tag": "④ TLD 向权威请求",
        "from": 3,
        "to": 4,
        "event": "Query y.abc.com",
        "cap": "顶级域服务器 dns.com 继续向 abc.com 的权威 DNS dns.abc.com 询问 y.abc.com 的地址。",
        "values": [
          "TLD→权威"
        ]
      },
      {
        "tag": "⑤ 权威向 TLD 响应",
        "from": 4,
        "to": 3,
        "event": "Answer（目标IP）",
        "cap": "权威服务器返回 y.abc.com 的地址记录，首先回复请求它的 TLD。课件未给具体 IPv4 数值，因此动画只写“目标IP”，不虚构一个数值。",
        "values": [
          "权威→TLD"
        ]
      },
      {
        "tag": "⑥ TLD 向根回复",
        "from": 3,
        "to": 2,
        "event": "Answer（目标IP）",
        "cap": "TLD 把同一解析结果向上一个递归请求者——根服务器——回复。",
        "values": [
          "TLD→根"
        ]
      },
      {
        "tag": "⑦ 根向本地回复",
        "from": 2,
        "to": 1,
        "event": "Answer（目标IP）",
        "cap": "根服务器向本地 dns.xyz.com 返回最终地址，而不是只返回下一级 NS 转介。",
        "values": [
          "根→本地"
        ]
      },
      {
        "tag": "⑧ 本地向客户回复",
        "from": 1,
        "to": 0,
        "event": "Answer（目标IP）",
        "cap": "本地服务器向客户主机返回 y.abc.com 的 IP 地址。课件的八个箭头至此完整闭环。",
        "values": [
          "本地→客户端"
        ]
      },
      {
        "tag": "与常见迭代查询比较",
        "from": 1,
        "to": 1,
        "event": "完全递归 ≠ 常见迭代",
        "cap": "本例专门复现课件第24页的“服务器间递归”（较少用）。实际常见场景是<b>客户端递归请求本地解析器，解析器对上游逐级迭代</b>，另见相邻动画。",
        "values": [
          "本例按课件展示",
          "常用：递归+迭代混合"
        ]
      }
    ]
  },
  {
    "name": "net-tcp-cwnd-2025",
    "actors": [
      "TCP发送端",
      "潜在拥塞网络",
      "TCP接收端"
    ],
    "steps": [
      {
        "tag": "课件慢开始示意",
        "from": 0,
        "to": 2,
        "event": "cwnd=1, ssthresh=16",
        "cap": "《第七章传输层》第117–126页原图：初始 cwnd=<b>1 MSS</b>、ssthresh=<b>16 MSS</b>。这里以按传输轮次汇总的教学模型演示。",
        "values": [
          "cwnd=1",
          "ssthresh=16",
          "阶段=初始化"
        ],
        "bits": {
          "label": "拥塞窗口 MSS",
          "value": "1"
        }
      },
      {
        "tag": "第 1 轮 RTT",
        "from": 0,
        "to": 2,
        "event": "cwnd=2, ssthresh=16",
        "cap": "每个 RTT 收到对应确认后，慢开始窗口理想化倍增到 <b>2 MSS</b>。此时门限为16 MSS。",
        "values": [
          "cwnd=2",
          "ssthresh=16",
          "阶段=慢开始"
        ],
        "bits": {
          "label": "拥塞窗口 MSS",
          "value": "2"
        }
      },
      {
        "tag": "第 2 轮 RTT",
        "from": 0,
        "to": 2,
        "event": "cwnd=4, ssthresh=16",
        "cap": "每个 RTT 收到对应确认后，慢开始窗口理想化倍增到 <b>4 MSS</b>。此时门限为16 MSS。",
        "values": [
          "cwnd=4",
          "ssthresh=16",
          "阶段=慢开始"
        ],
        "bits": {
          "label": "拥塞窗口 MSS",
          "value": "4"
        }
      },
      {
        "tag": "第 3 轮 RTT",
        "from": 0,
        "to": 2,
        "event": "cwnd=8, ssthresh=16",
        "cap": "每个 RTT 收到对应确认后，慢开始窗口理想化倍增到 <b>8 MSS</b>。此时门限为16 MSS。",
        "values": [
          "cwnd=8",
          "ssthresh=16",
          "阶段=慢开始"
        ],
        "bits": {
          "label": "拥塞窗口 MSS",
          "value": "8"
        }
      },
      {
        "tag": "第 4 轮 RTT",
        "from": 0,
        "to": 2,
        "event": "cwnd=16, ssthresh=16",
        "cap": "每个 RTT 收到对应确认后，慢开始窗口理想化倍增到 <b>16 MSS</b>。此时门限为16 MSS。",
        "values": [
          "cwnd=16",
          "ssthresh=16",
          "阶段=慢开始"
        ],
        "bits": {
          "label": "拥塞窗口 MSS",
          "value": "16"
        }
      },
      {
        "tag": "拥塞避免 cwnd=17",
        "from": 0,
        "to": 2,
        "event": "cwnd=17, ssthresh=16",
        "cap": "达到门限后进入拥塞避免，以接近 <b>每 RTT 增加 1 MSS</b> 的方式从16增长到17；这是按轮次聚合的教材模型。",
        "values": [
          "cwnd=17",
          "ssthresh=16",
          "阶段=拥塞避免"
        ],
        "bits": {
          "label": "拥塞窗口 MSS",
          "value": "17"
        }
      },
      {
        "tag": "拥塞避免 cwnd=18",
        "from": 0,
        "to": 2,
        "event": "cwnd=18, ssthresh=16",
        "cap": "达到门限后进入拥塞避免，以接近 <b>每 RTT 增加 1 MSS</b> 的方式从17增长到18；这是按轮次聚合的教材模型。",
        "values": [
          "cwnd=18",
          "ssthresh=16",
          "阶段=拥塞避免"
        ],
        "bits": {
          "label": "拥塞窗口 MSS",
          "value": "18"
        }
      },
      {
        "tag": "拥塞避免 cwnd=19",
        "from": 0,
        "to": 2,
        "event": "cwnd=19, ssthresh=16",
        "cap": "达到门限后进入拥塞避免，以接近 <b>每 RTT 增加 1 MSS</b> 的方式从18增长到19；这是按轮次聚合的教材模型。",
        "values": [
          "cwnd=19",
          "ssthresh=16",
          "阶段=拥塞避免"
        ],
        "bits": {
          "label": "拥塞窗口 MSS",
          "value": "19"
        }
      },
      {
        "tag": "拥塞避免 cwnd=20",
        "from": 0,
        "to": 2,
        "event": "cwnd=20, ssthresh=16",
        "cap": "达到门限后进入拥塞避免，以接近 <b>每 RTT 增加 1 MSS</b> 的方式从19增长到20；这是按轮次聚合的教材模型。",
        "values": [
          "cwnd=20",
          "ssthresh=16",
          "阶段=拥塞避免"
        ],
        "bits": {
          "label": "拥塞窗口 MSS",
          "value": "20"
        }
      },
      {
        "tag": "拥塞避免 cwnd=21",
        "from": 0,
        "to": 2,
        "event": "cwnd=21, ssthresh=16",
        "cap": "达到门限后进入拥塞避免，以接近 <b>每 RTT 增加 1 MSS</b> 的方式从20增长到21；这是按轮次聚合的教材模型。",
        "values": [
          "cwnd=21",
          "ssthresh=16",
          "阶段=拥塞避免"
        ],
        "bits": {
          "label": "拥塞窗口 MSS",
          "value": "21"
        }
      },
      {
        "tag": "拥塞避免 cwnd=22",
        "from": 0,
        "to": 2,
        "event": "cwnd=22, ssthresh=16",
        "cap": "达到门限后进入拥塞避免，以接近 <b>每 RTT 增加 1 MSS</b> 的方式从21增长到22；这是按轮次聚合的教材模型。",
        "values": [
          "cwnd=22",
          "ssthresh=16",
          "阶段=拥塞避免"
        ],
        "bits": {
          "label": "拥塞窗口 MSS",
          "value": "22"
        }
      },
      {
        "tag": "拥塞避免 cwnd=23",
        "from": 0,
        "to": 2,
        "event": "cwnd=23, ssthresh=16",
        "cap": "达到门限后进入拥塞避免，以接近 <b>每 RTT 增加 1 MSS</b> 的方式从22增长到23；这是按轮次聚合的教材模型。",
        "values": [
          "cwnd=23",
          "ssthresh=16",
          "阶段=拥塞避免"
        ],
        "bits": {
          "label": "拥塞窗口 MSS",
          "value": "23"
        }
      },
      {
        "tag": "拥塞避免 cwnd=24",
        "from": 0,
        "to": 2,
        "event": "cwnd=24, ssthresh=16",
        "cap": "达到门限后进入拥塞避免，以接近 <b>每 RTT 增加 1 MSS</b> 的方式从23增长到24；这是按轮次聚合的教材模型。",
        "values": [
          "cwnd=24",
          "ssthresh=16",
          "阶段=拥塞避免"
        ],
        "bits": {
          "label": "拥塞窗口 MSS",
          "value": "24"
        }
      },
      {
        "tag": "网络超时拥塞",
        "from": 0,
        "to": 1,
        "event": "cwnd=24, ssthresh=12",
        "cap": "当 cwnd 达到24时，课件第124页假定出现<b>重传超时</b>：将 ssthresh 减半为12；这一事件与“三次重复ACK快恢复”是不同路径。",
        "values": [
          "cwnd=24",
          "ssthresh=12",
          "阶段=拥塞发生"
        ],
        "bits": {
          "label": "拥塞窗口 MSS",
          "value": "24"
        }
      },
      {
        "tag": "超时退回慢开始",
        "from": 0,
        "to": 2,
        "event": "cwnd=1, ssthresh=12",
        "cap": "传统教材慢开始/拥塞避免示例在超时后把 cwnd 重设为 <b>1 MSS</b>，ssthresh=12，随后重新按指数增长。",
        "values": [
          "cwnd=1",
          "ssthresh=12",
          "阶段=重新慢开始"
        ],
        "bits": {
          "label": "拥塞窗口 MSS",
          "value": "1"
        }
      },
      {
        "tag": "超时后 RTT1",
        "from": 0,
        "to": 2,
        "event": "cwnd=2, ssthresh=12",
        "cap": "超时后的新慢开始阶段：理想化第1个 RTT 后窗口达到 <b>2 MSS</b>，仍低于新门限12。",
        "values": [
          "cwnd=2",
          "ssthresh=12",
          "阶段=重新慢开始"
        ],
        "bits": {
          "label": "拥塞窗口 MSS",
          "value": "2"
        }
      },
      {
        "tag": "超时后 RTT2",
        "from": 0,
        "to": 2,
        "event": "cwnd=4, ssthresh=12",
        "cap": "超时后的新慢开始阶段：理想化第2个 RTT 后窗口达到 <b>4 MSS</b>，仍低于新门限12。",
        "values": [
          "cwnd=4",
          "ssthresh=12",
          "阶段=重新慢开始"
        ],
        "bits": {
          "label": "拥塞窗口 MSS",
          "value": "4"
        }
      },
      {
        "tag": "超时后 RTT3",
        "from": 0,
        "to": 2,
        "event": "cwnd=8, ssthresh=12",
        "cap": "超时后的新慢开始阶段：理想化第3个 RTT 后窗口达到 <b>8 MSS</b>，仍低于新门限12。",
        "values": [
          "cwnd=8",
          "ssthresh=12",
          "阶段=重新慢开始"
        ],
        "bits": {
          "label": "拥塞窗口 MSS",
          "value": "8"
        }
      },
      {
        "tag": "到达新门限12",
        "from": 0,
        "to": 2,
        "event": "cwnd=12, ssthresh=12",
        "cap": "TCP Reno 的具体确认驱动窗口增长可能出现中间值。此处为课件图示：从慢开始转入拥塞避免，<b>新门限 ssthresh=12</b>。",
        "values": [
          "cwnd=12",
          "ssthresh=12",
          "阶段=门限切换"
        ],
        "bits": {
          "label": "拥塞窗口 MSS",
          "value": "12"
        }
      },
      {
        "tag": "拥塞避免继续",
        "from": 0,
        "to": 2,
        "event": "cwnd=13, ssthresh=12",
        "cap": "从新的拥塞避免阶段开始，cwnd 以加性增大逐轮增长，如12→13 MSS。与另一个“3次重复 ACK 快恢复”动画对照学习。",
        "values": [
          "cwnd=13",
          "ssthresh=12",
          "阶段=拥塞避免"
        ],
        "bits": {
          "label": "拥塞窗口 MSS",
          "value": "13"
        }
      }
    ]
  },
  {
    "name": "net-prefix-match-2025",
    "actors": [
      "目的地址 D",
      "路由表匹配器",
      "下一跳出接口"
    ],
    "steps": [
      {
        "tag": "课件最长前缀示例",
        "from": 1,
        "to": 1,
        "event": "两条重叠路由",
        "cap": "依据《2025-第6章网络层》最后的最长前缀匹配图：候选路由 <b>206.0.68.0/22</b> 与 <b>206.0.71.128/25</b> 可能同时匹配。这里另取 D=206.0.71.130 辅助逐位演算。",
        "values": [
          "图中原路由 /22 和 /25",
          "演算 D=206.0.71.130"
        ]
      },
      {
        "tag": "接收目的地址 D",
        "from": 0,
        "to": 1,
        "event": "D=206.0.71.130",
        "cap": "路由器从 IP 数据报目的字段读取 D=206.0.71.130，而非根据源 MAC 决定下一跳。",
        "values": [
          "目的地址206.0.71.130"
        ]
      },
      {
        "tag": "检查 /22 掩码",
        "from": 1,
        "to": 1,
        "event": "255.255.252.0",
        "cap": "/22 的掩码是255.255.252.0，第三字节252=11111100₂，计算 71 AND 252 = 68。",
        "values": [
          "71 AND 252 = 68"
        ]
      },
      {
        "tag": "得到 /22 匹配",
        "from": 1,
        "to": 1,
        "event": "206.0.68.0/22",
        "cap": "目标IP D 按位与 /22 掩码得到 <b>206.0.68.0</b>，因此命中206.0.68.0/22。",
        "values": [
          "匹配候选 /22"
        ]
      },
      {
        "tag": "检查 /25 掩码",
        "from": 1,
        "to": 1,
        "event": "255.255.255.128",
        "cap": "/25 掩码为255.255.255.128。末字节130=10000010₂，128=10000000₂，逐位与得到128。",
        "values": [
          "130 AND 128 = 128"
        ]
      },
      {
        "tag": "得到 /25 匹配",
        "from": 1,
        "to": 1,
        "event": "206.0.71.128/25",
        "cap": "目标 D 按位与 /25 掩码得到 <b>206.0.71.128</b>，也匹配课件中的第二条路由。",
        "values": [
          "匹配候选 /25"
        ]
      },
      {
        "tag": "选择最长前缀",
        "from": 1,
        "to": 1,
        "event": "25 > 22",
        "cap": "两条路由均命中时，选择前缀更长、更具体的 <b>206.0.71.128/25</b>，而不是按表项出现顺序或地址数值比较。",
        "values": [
          "最终选 /25"
        ]
      },
      {
        "tag": "按所选条目转发",
        "from": 1,
        "to": 2,
        "event": "下一跳=该 /25 条目",
        "cap": "路由器根据选出的 /25 路由条目所配置的下一跳和接口转发。课件未明确给具体接口名，因此此处不编造下一跳编号。",
        "values": [
          "最长前缀 /25",
          "到出接口"
        ]
      }
    ]
  }
];
