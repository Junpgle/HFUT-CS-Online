/** 计网动画语义回归：比较报文次序和计算结果，而不只验证“有几张帧”。 */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { networkRegistry, networkScenarios } from '../components/demos/network-registry';
import { calculateIpv4Fragments } from '../components/demos/net-detail';

const named=(name:string)=>{
  const scenario=networkScenarios.find((entry)=>entry.name===name);
  if(!scenario)throw new Error('缺少场景：'+name);
  return scenario;
};
const steps=(name:string)=>named(name).steps;
const tags=(name:string)=>steps(name).map((step)=>step.tag);
const events=(name:string)=>steps(name).map((step)=>step.event);
const at=(names:string[],needle:string)=>names.findIndex((name)=>name.includes(needle));
const ordered=(name:string,needles:string[])=>{
  const words=tags(name);
  const indices=needles.map((needle)=>at(words,needle));
  expect(indices.every((i)=>i>=0),name+' 缺少步骤 '+needles).toBe(true);
  for(let i=1;i<indices.length;i++) expect(indices[i],name+' 步骤顺序异常').toBeGreaterThan(indices[i-1]);
};

describe('计网动画的协议时序与状态',()=>{
  it('PPP 双向 LCP 配置完成后才认证/NCP，终止用 Terminate-Ack',()=>{
    ordered('net-ppp',['A 发配置请求','B 建议改参数','A 重新请求','B 接受 A 方向',
      'B 发自己的请求','A 接受 B 方向','LCP Opened',
      'CHAP Challenge','CHAP Response','认证成功','IPCP 请求','IPCP 应答','B 发 IPCP 请求','A 回 IPCP 确认','IPCP Opened',
      '传输 IP 数据报','LCP Echo-Request','LCP Echo-Reply','请求终止','确认终止']);
    expect(events('net-ppp').join('|')).toContain('Terminate-Ack');
    expect(events('net-ppp').join('|')).not.toContain('Terminate-Reply');
  });
  it('DNS 根/TLD/权威为不同泳道，递归与迭代都画出查询及转介的返回路径',()=>{
    const rec=named('net-dns-recursive');
    expect(rec.actors).toEqual(['客户端','递归解析器','根 DNS','TLD .com','权威 DNS']);
    const pairs=rec.steps.map((x)=>[x.from,x.to]);
    expect(pairs).toEqual(expect.arrayContaining([[1,2],[2,1],[1,3],[3,1],[1,4],[4,1],[1,0]]));
    const itr=named('net-dns-iterative');
    expect(itr.steps.map((x)=>[x.from,x.to])).toEqual(expect.arrayContaining([[0,1],[1,0],[0,2],[2,0],[0,3],[3,0]]));
    expect(itr.actors).toHaveLength(4);
  });
  it('VLAN10 到 VLAN20 只能经三层网关处理，不能直接跨二层广播域',()=>{
    const scenario=named('net-vlan');
    expect(scenario.actors.some((x)=>x.includes('三层网关'))).toBe(true);
    ordered('net-vlan',['Access 接入口','Trunk 跨交换机','二层隔离','A 判断跨网段',
      '发给三层网关','路由与新帧','进入 VLAN20','交付给 B']);
    const routing=scenario.steps.find((x)=>x.tag==='路由与新帧')!;
    expect(scenario.actors[routing.to]).toContain('三层网关');
  });
  it('TCP Reno 具有三个独立重复 ACK 和完整快恢复窗口而非直接减半',()=>{
    ordered('net-tcp-congestion',['重复 ACK 第1次','重复 ACK 第2次','重复 ACK 第3次',
      '进入快恢复','重传分段获确认','再进入拥塞避免','如果是 RTO 超时']);
    const cap=steps('net-tcp-congestion').find((x)=>x.tag==='进入快恢复')!.cap;
    expect(cap).toContain('cwnd=ssthresh+3×MSS');
    expect(cap).toContain('8 MSS');
    expect(steps('net-tcp-congestion').find((x)=>x.tag==='重传分段获确认')!.values).toContain('cwnd=5');
  });
  it('停止等待 ACK 丢失必须先重传重复帧，再去重与再次 ACK',()=>{
    ordered('net-stop-wait',['A 发送帧1','B 收到帧1','B 回 ACK1',
      'A 等待超时','超时重发帧1','B 识别重复','B 再次发送 ACK1','A 收到重发确认']);
  });
  it('GBN 丢失1以后丢弃2、3并重传1、2、3，SR单独确认2、3且只重传1',()=>{
    ordered('net-gbn',['发送 DATA1','发送 DATA2','R 发送重复 ACK0',
      '发送 DATA3','等待超时','GBN 重传 DATA1','GBN 重传 DATA2','GBN 重传 DATA3',
      '累计 ACK3']);
    ordered('net-sr',['发送 DATA1','发送 DATA2','独立 ACK2','发送 DATA3','独立 ACK3',
      '只有 DATA1 超时','重传 DATA1','R 回 ACK1']);
    expect(steps('net-sr').filter((x)=>x.tag.startsWith('重传 DATA'))).toHaveLength(1);
    expect(steps('net-gbn').filter((x)=>x.tag.startsWith('GBN 重传 DATA'))).toHaveLength(3);
  });
  it('HTTP/1.1 over TLS 展开为三次握手、TLS 与请求/响应，不再一帧包含全部握手',()=>{
    ordered('net-http',['TCP 第一次握手','TCP 第二次握手','TCP 第三次握手',
      'TLS ClientHello','TLS ServerHello','TLS 握手完成',
      '发送 HTTP GET','服务器发送状态与首部','服务器发送 HTML','解析 HTML',
      '请求 CSS/JS/图片','计算样式与布局','显示页面']);
  });
  it('位填充至少五步连续1、插0、接收端去0；异步转义分别说明7E、7D、04',()=>{
    ordered('net-bit-stuff',['读到第 1 个 1','读到第 2 个 1','读到第 3 个 1',
      '读到第 4 个 1','读到第 5 个 1','插入零位','接收端找到 5 个 1',
      '删除插入 0','异步 PPP 处理 0x7E','异步 PPP 处理 0x7D',
      '异步 PPP 处理控制字节','接收端逆转义']);
  });
});

describe('计网计算题的可重复核验结果',()=>{
  it('IPv4 8200B 载荷、MTU1500/IP首部20 ⇒ 六片，偏移与 MF 全正确',()=>{
    const f=calculateIpv4Fragments(8200,1500,20);
    expect(f.map(x=>x.payload)).toEqual([1480,1480,1480,1480,1480,800]);
    expect(f.map(x=>x.total)).toEqual([1500,1500,1500,1500,1500,820]);
    expect(f.map(x=>x.offset)).toEqual([0,185,370,555,740,925]);
    expect(f.map(x=>x.mf)).toEqual([1,1,1,1,1,0]);
    expect(f.reduce((sum,x)=>sum+x.payload,0)).toBe(8200);
    expect(f.every(x=>x.total<=1500)).toBe(true);
    expect(f.slice(0,-1).every(x=>x.payload%8===0)).toBe(true);
    expect(()=>calculateIpv4Fragments(50,20,20)).toThrow();
  });
  it('PPT 2025 第4章第19页 CRC 原题：101001 除以 1101 得 FCS=001',()=>{
    const crc=steps('net-crc');
    expect(crc.filter(x=>x.tag.startsWith('发送端 '))).toHaveLength(6);
    expect(crc.filter(x=>x.tag.startsWith('接收端 '))).toHaveLength(6);
    const div=(word:string,g:string)=>{
      const a=word.split('');
      for(let i=0;i<=a.length-g.length;i++){
        if(a[i]==='1')for(let j=0;j<g.length;j++)a[i+j]=a[i+j]===g[j]?'0':'1';
      }
      return a.slice(-(g.length-1)).join('');
    };
    expect(div('101001000','1101')).toBe('001');
    expect(div('101001001','1101')).toBe('000');
    expect(crc.some(x=>x.cap.includes('课件第19页'))).toBe(true);
    expect(crc.at(-1)?.cap).toContain('000');
  });
  it('子网 140.252.20.68/27 的网络号、广播号和可用主机数',()=>{
    const ip=68,mask=224;
    const network=ip&mask;
    expect(network).toBe(64);
    expect(network|(~mask&255)).toBe(95);
    expect(2**5-2).toBe(30);
    expect(steps('net-subnet').some(x=>x.cap.includes('140.252.20.64/27'))).toBe(true);
  });
  it('RIP 样例来自 C 的候选距离先加1，同下一跳更新即使变差',()=>{
    const r=steps('net-rip');
    expect(r.some(x=>x.cap.includes('4+1=5'))).toBe(true);
    expect(r.some(x=>x.cap.includes('下一跳就是 C'))).toBe(true);
    expect(r.some(x=>x.values?.some(v=>v.includes('N2=5')))).toBe(true);
  });
});
describe('全部动画的 SVG 逐帧可渲染性',()=>{
  it('所有 35 个动画每一帧均能 SSR，不出现 NaN/undefined 或空画面',()=>{
    expect(networkScenarios).toHaveLength(35);
    for(const scenario of networkScenarios){
      const demo=networkRegistry[scenario.name];
      const View=demo.View;
      const frames=demo.build();
      expect(frames.length).toBe(scenario.steps.length);
      for(const frame of frames){
        const html=renderToStaticMarkup(<svg viewBox={'0 0 '+demo.w+' '+demo.h}><View frame={frame}/></svg>);
        expect(html,scenario.name).toContain('<svg');
        expect(html,scenario.name).toContain('<text');
        expect(html,scenario.name).not.toContain('NaN');
        expect(html,scenario.name).not.toContain('undefined');
      }
    }
  });
});

describe('计网共用时间轴提示布局',()=>{
  it('全部35个动画的进度提示位于泳道底部，不遮挡参与方名称和消息',()=>{
    expect(networkScenarios).toHaveLength(35);
    for(const scenario of networkScenarios){
      const def=networkRegistry[scenario.name];
      const View=def.View;
      const frames=def.build();
      const html=renderToStaticMarkup(<svg viewBox={'0 0 '+def.w+' '+def.h}>
        <View frame={frames[frames.length-1]}/>
      </svg>);
      const hint=html.match(/<text\b[^>]*>消息时序 · 仅显示最近 6 步[^<]*<\/text>/)?.[0];
      expect(hint,scenario.name+' 缺少时间轴底部提示').toBeDefined();
      expect(hint,scenario.name+' 的提示位置不正确').toContain('y="309"');
      expect(html,scenario.name+' 的参与方泳道应结束在提示上方').toContain('y2="293"');
    }
  });
});

describe('课件 2025 原图的数值和箭头映射',()=>{
  it('UDP 第7章 P24：TESTING、伪首部、逐字累加得96ED，检验和6912',()=>{
    const udp=steps('net-udp-checksum-2025');
    expect(udp.filter(x=>x.tag.startsWith('反码加法'))).toHaveLength(14);
    const words=[0x9913,0x0868,0xAB03,0x0E0B,0x0011,0x000F,
      0x043F,0x000D,0x000F,0x0000,0x5445,0x5354,0x494E,0x4700];
    let sum=0;
    for(const word of words){sum+=word;sum=(sum&0xFFFF)+(sum>>>16);}
    expect(sum).toBe(0x96ED);
    expect((~sum)&0xFFFF).toBe(0x6912);
    expect(udp.find(x=>x.tag==='取反得到检验和')?.cap).toContain('0x6912');
    expect(udp.find(x=>x.tag==='写入并发送 UDP 数据报')?.cap).toContain('15字节');
  });
  it('交换机第5章 P75-78：接口1的A、接口3的B，未知单播向2/3/4泛洪',()=>{
    const sw=named('net-switch-learn');
    expect(sw.actors).toEqual(['A（口1）','交换机 S','C（口2）','B（口3）','D（口4）']);
    ordered('net-switch-learn',['A 发送给 B','学习源地址 A','查询目的 B',
      '泛洪到 B','泛洪到 C','泛洪到 D','B 正确接收',
      'B 回复 A','学习源地址 B','查询目的 A','只向端口1转发']);
    expect(steps('net-switch-learn').find(x=>x.tag==='学习源地址 B')?.values).toContain('B→3');
  });
  it('DNS 第8章 P24：查询和返回严格按原图 1-8 级联方向',()=>{
    const dns=named('net-dns-full-recursive-2025');
    expect(dns.actors).toEqual(['客户主机','本地 dns.xyz.com','根 DNS','TLD dns.com','权威 dns.abc.com']);
    const packets=dns.steps.slice(1,9).map(({from,to})=>[from,to]);
    expect(packets).toEqual([[0,1],[1,2],[2,3],[3,4],[4,3],[3,2],[2,1],[1,0]]);
    expect(dns.steps[0].cap).toContain('y.abc.com');
  });
  it('TCP 第7章 P117-126：ssthresh 16→12，24超时后窗口回到1',()=>{
    const cwnd=steps('net-tcp-cwnd-2025');
    expect(cwnd[0].values).toContain('ssthresh=16');
    const congested=cwnd.findIndex(x=>x.tag==='网络超时拥塞');
    expect(cwnd[congested].values).toContain('cwnd=24');
    expect(cwnd[congested].values).toContain('ssthresh=12');
    expect(cwnd[congested+1].values).toContain('cwnd=1');
    expect(cwnd[congested+1].values).toContain('ssthresh=12');
  });
  it('网络层 /22 /25：目标206.0.71.130同时匹配两路由，优先/25',()=>{
    const d=[206,0,71,130],mask22=[255,255,252,0],mask25=[255,255,255,128];
    const and=(m:number[])=>d.map((v,i)=>v&m[i]).join('.');
    expect(and(mask22)).toBe('206.0.68.0');
    expect(and(mask25)).toBe('206.0.71.128');
    expect(steps('net-prefix-match-2025').some(x=>x.cap.includes('更长、更具体'))).toBe(true);
  });
});
