/** 2025 版用户荧光笔重点：来自课件 PDF 绘图笔迹（非文本中的星号）。
 * 页码使用 PDF 物理页序号；A/B 是结合课程作业的复习建议，不等同教师考试承诺。
 * 不包含 Google Drive 分享链接或私有文件 ID。
 */
export type NetHighlightPriority = 'A' | 'B';
export interface NetHighlightGroup {
  priority: NetHighlightPriority;
  topic: string;
  pages: string;
  sec: string;
  reason: string;
}
export interface NetHighlightChapter {
  sources: string[];
  markedPages: number;
  groups: NetHighlightGroup[];
}
export const netHighlights: Record<number, NetHighlightChapter> = {
  "1": {
    "sources": [
      "第1章 计算机网络概述(1).pdf"
    ],
    "markedPages": 19,
    "groups": [
      {
        "priority": "A",
        "topic": "网络定义、通信子网与资源子网",
        "pages": "第31、42、46—47页",
        "sec": "sec-ch1-definition",
        "reason": "基础概念、逻辑组成"
      },
      {
        "priority": "A",
        "topic": "网络分类与三种交换方式",
        "pages": "第51—52、61—63页",
        "sec": "sec-ch1-work-h3",
        "reason": "第1章作业第3、5、7题"
      },
      {
        "priority": "A",
        "topic": "速率、带宽与单位换算",
        "pages": "第68—70页",
        "sec": "sec-ch1-performance-h1",
        "reason": "第1章作业第1、4题"
      },
      {
        "priority": "A",
        "topic": "发送时延、传播时延与 RTT",
        "pages": "第72—75、91页",
        "sec": "sec-ch1-performance-h2",
        "reason": "第1章作业第4题"
      },
      {
        "priority": "B",
        "topic": "网络性能与利用率相关示例",
        "pages": "第84—85页",
        "sec": "sec-ch1-performance-h3",
        "reason": "公式条件与单位需理解"
      }
    ]
  },
  "2": {
    "sources": [
      "第2章_网络结构与协议.pdf"
    ],
    "markedPages": 10,
    "groups": [
      {
        "priority": "A",
        "topic": "协议、服务与对等实体",
        "pages": "第11、27页",
        "sec": "sec-ch2-arch-h2",
        "reason": "第2章作业第6题"
      },
      {
        "priority": "A",
        "topic": "协议数据单元与封装的组成",
        "pages": "第38、45页",
        "sec": "sec-ch2-protocol-h2",
        "reason": "第2章作业第9题"
      },
      {
        "priority": "A",
        "topic": "OSI、TCP/IP 与分层关系",
        "pages": "第1—2、71页",
        "sec": "sec-ch2-osi-h1",
        "reason": "第2章作业第8题"
      },
      {
        "priority": "B",
        "topic": "分层过程、接口与服务模型",
        "pages": "第31—35页",
        "sec": "sec-ch2-idea",
        "reason": "理解概念间的层次关系"
      }
    ]
  },
  "3": {
    "sources": [
      "第3章-数据通信（A）.pdf",
      "第3章物理层-数据通信（B）.pdf"
    ],
    "markedPages": 23,
    "groups": [
      {
        "priority": "A",
        "topic": "编码与调制的区别，曼彻斯特编码",
        "pages": "A册第9—14页",
        "sec": "sec-ch3-process-h2",
        "reason": "波形判读与同步"
      },
      {
        "priority": "A",
        "topic": "ASK / FSK / PSK 调制方法",
        "pages": "A册第20—21页",
        "sec": "sec-ch3-process-h3",
        "reason": "调制参数及波形"
      },
      {
        "priority": "A",
        "topic": "传输媒体与光纤传输原理",
        "pages": "A册第49—57页",
        "sec": "sec-ch3-media-h2",
        "reason": "折射、全反射与多模光纤"
      },
      {
        "priority": "A",
        "topic": "多路复用：FDM、TDM、WDM",
        "pages": "B册第3—6页",
        "sec": "sec-ch3-mux",
        "reason": "物理层核心归纳"
      },
      {
        "priority": "B",
        "topic": "串行与并行数据传输",
        "pages": "A册第69页",
        "sec": "sec-ch3-mode-h1",
        "reason": "适用距离与信号机制"
      },
      {
        "priority": "B",
        "topic": "其余信道、传输方式示例",
        "pages": "A册第2、18、27、36、72—74页；B册第25页",
        "sec": "sec-ch3-basic",
        "reason": "结合图示辨析，不把经验值当定律"
      }
    ]
  },
  "4": {
    "sources": [
      "2025-第4章数据链路层（电子信息）.pdf"
    ],
    "markedPages": 17,
    "groups": [
      {
        "priority": "A",
        "topic": "透明传输与封装成帧",
        "pages": "第7—11页",
        "sec": "sec-ch4-frame-h2",
        "reason": "组帧标志位与透明性"
      },
      {
        "priority": "A",
        "topic": "CRC 校验与模2除法",
        "pages": "第14、19页",
        "sec": "sec-ch4-error-h4",
        "reason": "第4章作业第2题，须会计算"
      },
      {
        "priority": "A",
        "topic": "停等、GBN 与选择重传",
        "pages": "第27—28、37、44—45页",
        "sec": "sec-ch4-flow-h1",
        "reason": "第4章作业第3—6题"
      },
      {
        "priority": "A",
        "topic": "滑动窗口及收发窗口边界",
        "pages": "第50—53页",
        "sec": "sec-ch4-flow-h2",
        "reason": "序号回绕和重传歧义"
      },
      {
        "priority": "A",
        "topic": "PPP 协议特点与边界",
        "pages": "第58、60、62页",
        "sec": "sec-ch4-p2p-h2",
        "reason": "第4章作业第7题"
      }
    ]
  },
  "5": {
    "sources": [
      "2025-第5章_局域网（电子信息）.pdf"
    ],
    "markedPages": 24,
    "groups": [
      {
        "priority": "A",
        "topic": "CSMA/CD 机制与碰撞窗口",
        "pages": "第12、17、23页",
        "sec": "sec-ch5-broadcast-h2",
        "reason": "半双工共享以太网前提"
      },
      {
        "priority": "A",
        "topic": "截断二进制指数退避与效率",
        "pages": "第24—25、37页",
        "sec": "sec-ch5-broadcast-h2",
        "reason": "第5章作业第5—6题"
      },
      {
        "priority": "A",
        "topic": "MAC 地址与以太网帧结构",
        "pages": "第42—43、48—49页",
        "sec": "sec-ch5-broadcast-h4",
        "reason": "帧字段、校验与链路类型"
      },
      {
        "priority": "A",
        "topic": "交换机自学习与转发表",
        "pages": "第59、64、68—69、74、77—78页",
        "sec": "sec-ch5-broadcast-h5",
        "reason": "第5章作业第7—11题"
      },
      {
        "priority": "A",
        "topic": "VLAN、冲突域与广播域",
        "pages": "第88、91—92页",
        "sec": "sec-ch5-broadcast-h5",
        "reason": "辨析二层隔离范围"
      },
      {
        "priority": "B",
        "topic": "网卡与局域网基本特点",
        "pages": "第2、10—11页",
        "sec": "sec-ch5-lan-basic",
        "reason": "局域网结构与 NIC"
      }
    ]
  },
  "6": {
    "sources": [
      "2025-第6章网络层(电子信息）新版本(1).pdf",
      "2025-第6章网络层-2新版本(1).pdf"
    ],
    "markedPages": 47,
    "groups": [
      {
        "priority": "A",
        "topic": "IPv4 地址、分类与子网掩码",
        "pages": "上册第21、40—41、112—120页",
        "sec": "sec-ch6-ip-h3",
        "reason": "第6章作业第3、10、13—14题"
      },
      {
        "priority": "A",
        "topic": "无分类编址 CIDR 与最长前缀匹配",
        "pages": "上册第131—143页",
        "sec": "sec-ch6-ip-h5",
        "reason": "第6章作业第11—14题"
      },
      {
        "priority": "A",
        "topic": "ARP 缓存与下一跳 MAC 解析",
        "pages": "上册第54、64、66—78页",
        "sec": "sec-ch6-arp-h1",
        "reason": "第6章作业第1、2、6、7题"
      },
      {
        "priority": "A",
        "topic": "IPv4 数据报分片与片偏移",
        "pages": "上册第83、89—93页",
        "sec": "sec-ch6-ip-h1",
        "reason": "第6章作业第5、8题"
      },
      {
        "priority": "A",
        "topic": "路由表更新与 RIP 算法",
        "pages": "下册第17—18、23、29、32页",
        "sec": "sec-ch6-protocol-h1",
        "reason": "第6章作业第15—16题"
      },
      {
        "priority": "A",
        "topic": "链路状态协议与 Dijkstra",
        "pages": "下册第44、49页",
        "sec": "sec-ch6-routing-h4",
        "reason": "RIP/OSPF 对比"
      },
      {
        "priority": "B",
        "topic": "路由器逐跳转发与检验和",
        "pages": "上册第100、104、124、129页",
        "sec": "sec-ch6-ip-h6",
        "reason": "第6章作业第4、9、11题"
      }
    ]
  },
  "7": {
    "sources": [
      "第七章传输层(1).pdf"
    ],
    "markedPages": 7,
    "groups": [
      {
        "priority": "A",
        "topic": "进程之间的通信、TCP 与 UDP",
        "pages": "第4、8、16页",
        "sec": "sec-ch7-overview-h1",
        "reason": "第7章作业第1、3、5题"
      },
      {
        "priority": "A",
        "topic": "TCP 序号、确认与发送窗口",
        "pages": "第54、62页",
        "sec": "sec-ch7-impl-h1",
        "reason": "第7章作业第2、4题"
      },
      {
        "priority": "A",
        "topic": "TCP 拥塞控制",
        "pages": "第98页",
        "sec": "sec-ch7-congestion-h2",
        "reason": "第7章作业第8—9题"
      },
      {
        "priority": "B",
        "topic": "运输层综合复习",
        "pages": "第134页",
        "sec": "sec-ch7-tcp",
        "reason": "结合课件总结"
      }
    ]
  },
  "8": {
    "sources": [
      "2025-第8章应用层(1).pdf"
    ],
    "markedPages": 0,
    "groups": []
  }
};
