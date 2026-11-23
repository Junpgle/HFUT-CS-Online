/** 计算机网络专用逐步状态板。数据流使用公共泳道，本面板显示各协议真正变化的数据结构。 */
import type { NetScenario, NetStep } from './net-base';

export interface Ipv4Fragment { index: number; payload: number; total: number; offset: number; mf: 0|1 }
export function calculateIpv4Fragments(payload:number,mtu:number,ipHeader:number):Ipv4Fragment[]{
  if(!Number.isInteger(payload)||payload<=0||!Number.isInteger(mtu)||!Number.isInteger(ipHeader)
    ||ipHeader<20||ipHeader>60||ipHeader%4!==0||mtu<=ipHeader||payload+ipHeader>65535){
    throw new RangeError('无效的 IPv4 分片参数');
  }
  // 原始 IP 数据报完整装得下就无需分片，即使 MTU-header 不是 8 的倍数也是如此。
  if(payload+ipHeader<=mtu){
    return [{index:1,payload,total:payload+ipHeader,offset:0,mf:0}];
  }
  // 分片时，除最后一片外，载荷才必须按 8 字节对齐。
  const max=8*Math.floor((mtu-ipHeader)/8);
  if(max<8)throw new RangeError('MTU 太小，无法容纳非末片的 8 字节载荷');
  const result:Ipv4Fragment[]=[];
  let sent=0;
  while(sent<payload){
    const size=Math.min(max,payload-sent);
    result.push({index:result.length+1,payload:size,total:ipHeader+size,offset:sent/8,mf:sent+size<payload?1:0});
    sent+=size;
  }
  return result;
}
export const FRAGS=calculateIpv4Fragments(8200,1500,20);

const ink='var(--ink)', muted='var(--ink-2)', quiet='var(--ink-3)',
  line='var(--hairline)', accent='var(--deck-accent)', ok='var(--c-ok)',
  warn='var(--c-warn)', soft='var(--panel-2)';
const tx=(x:number,y:number,value:string,size=12,color=ink,bold=false,anchor:'start'|'middle'|'end'='start')=>
  <text x={x} y={y} fill={color} textAnchor={anchor} fontFamily="var(--font)" fontSize={size}
    fontWeight={bold?700:500}>{value}</text>;
const rect=(x:number,y:number,w:number,h:number,fill=soft,stroke=line,r=7)=>
  <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} stroke={stroke}/>;
const compact=(str:string,max:number)=>{let width=0,out='';for(const ch of str){
  const cost=/[\x00-\x7f]/.test(ch)?0.57:1;
  if(width+cost>max)return out+'…';
  out+=ch;width+=cost;
}return out;};

function CrcPanel({index,step}:{index:number;step:NetStep}){
  const value=step.bits?.value??'101001000';
  const pos=step.bits?.mark!==undefined?Number(step.bits.mark):-1;
  return <g>
    {tx(35,30,'2025 课件第4章 P19 · M=101001，P=1101，CRC=001',13,ink,true)}
    {tx(35,52,'下标',11,quiet)}
    {Array.from({length:9},(_,i)=>{
      const x=147+i*59,active=pos>=0&&i>=pos&&i<pos+4;
      return <g key={i}>
        {rect(x,62,53,48,active?'var(--panel-2)':soft,active?accent:line,5)}
        {tx(x+26,91,String(value[i]??'·'),21,active?accent:ink,true,'middle')}
        {tx(x+26,127,String(i),11,quiet,false,'middle')}
      </g>;
    })}
    {tx(35,163,pos>=0?'除数1101对齐位置：'+pos+'~'+(pos+3):'准备运算或查看最终余数',14,accent,true)}
    {pos>=0&&<g>
      <line x1={147+pos*59} y1={138} x2={147+(pos+3)*59+53} y2={138}
        stroke={accent} strokeWidth={3} strokeLinecap="round"/>
      {tx(35,190,'蓝色框内4位与1101异或（或高位0直接跳过）',12,ink)}
    </g>}
    {tx(35,220,'发送端 101001000 ÷1101 → 001；接收端 101001001 ÷1101 → 000',12,muted)}
    {tx(35,243,'本帧 '+(index+1)+'：'+compact(step.event,34),11,quiet)}
  </g>;
}
function FragmentPanel({index}:{index:number}){
  const cols=[36,100,234,367,504,622];
  const row=(y:number,values:string[],hot=false)=><g key={y}>
    {hot&&rect(31,y-15,691,23,'var(--panel-2)',accent,4)}
    {values.map((v,j)=>tx(cols[j],y,v,12,hot?accent:ink,hot))}
  </g>;
  const visible=Math.max(0,Math.min(6,index-2)); // 每出现一片就显示一行
  return <g>
    {tx(35,29,'IPv4 载荷 8200 B · IP 首部 20 B · MTU 1500 B',13,ink,true)}
    {row(54,['分片','载荷/B','IP总长/B','偏移/8B','MF','原始起点/B'])}
    {FRAGS.map((f,i)=> i<visible?row(83+i*24,[
      String(f.index),String(f.payload),String(f.total),String(f.offset),String(f.mf),String(f.offset*8)
    ],i===visible-1):null)}
    {tx(35,239,'校验：'+FRAGS.map(f=>f.payload).join('+')+' = 8200 B；末片 MF=0',11,muted)}
  </g>;
}
function SubnetPanel({index}:{index:number}){
  const rows=[
    ['IP 地址末字节 68','01000100'],
    ['子网掩码末字节 224','11100000'],
    ['按位 AND 得 64','01000000']
  ];
  return <g>
    {tx(35,30,'140.252.20.68/27 · 最后 8 位逐位按与',14,ink,true)}
    {rows.map(([label,bits],j)=> <g key={j} opacity={index<2&&j===2?0.4:1}>
      {tx(35,72+j*54,label,12,muted)}
      {Array.from(bits).map((v,i)=>{
        const x=265+i*51;
        return <g key={i}>
          {rect(x,48+j*54,44,40,j===2?'var(--panel-2)':soft,j===2?accent:line,5)}
          {tx(x+22,75+j*54,v,19,j===2?accent:ink,true,'middle')}
        </g>;
      })}
    </g>)}
    {tx(35,231,'网络地址：140.252.20.64/27　广播地址：140.252.20.95　可用主机：30',12,ink)}
  </g>;
}
function WindowPanel({index,kind}:{index:number;kind:'gbn'|'sr'}){
  const gbn=kind==='gbn';
  const recvBase=gbn?(index>=11?4:index>=10?3:index>=9?2:index>=1?1:0):
    (index>=9?4:index>=1?1:0);
  const sendBase=gbn?(index>=12?4:index>=2?1:0):(index>=10?4:index>=2?1:0);
  const size=gbn?1:4;
  const senderStatus=(i:number)=>{
    if(i===0)return index>=2?'已确认':index>=1?'已发送':'待发';
    if(i===1)return index>=(gbn?12:10)?'已确认':index>=9?'重传中':index>=3?'未确认':'待发';
    if(i===2)return index>=(gbn?12:5)?'已确认':index>=4?'未确认':'待发';
    if(i===3)return index>=(gbn?12:7)?'已确认':index>=6?'未确认':'待发';
    return '待发';
  };
  const receiverStatus=(i:number)=>{
    if(i===0)return index>=1?'已交付':'待发';
    if(i===1)return index>=9?'已交付':index>=3?'缺失':'待发';
    if(i===2)return gbn?(index>=10?'已交付':index>=4?'乱序丢弃':'待发'):
      index>=9?'已交付':index>=4?'已缓存':'待发';
    if(i===3)return gbn?(index>=11?'已交付':index>=6?'乱序丢弃':'待发'):
      index>=9?'已交付':index>=6?'已缓存':'待发';
    return '待发';
  };
  const colors:{[k:string]:string}={'已确认':ok,'已交付':ok,'缺失':warn,'乱序丢弃':warn,'重传中':warn,
    '已缓存':accent,'未确认':accent,'已发送':accent,'待发':quiet};
  const lineY=(y:number,base:number,len:number,caption:string,status:(i:number)=>string)=>{
    const x0=37,gap=85,w=73;
    return <g>
      {tx(35,y-9,caption+'（窗口起点='+base+'，宽度='+len+'）',12,ink,true)}
      {Array.from({length:8},(_,i)=>{
        const x=x0+i*gap,inside=(i>=base&&i<base+len);
        return <g key={i}>
          {rect(x,y,w,43,inside?'var(--panel-2)':soft,inside?accent:line,5)}
          {tx(x+w/2,y+18,'帧 '+i,12,ink,true,'middle')}
          {tx(x+w/2,y+34,status(i),10,colors[status(i)]??quiet,false,'middle')}
        </g>;
      })}
    </g>;
  };
  return <g>
    {tx(35,24,(gbn?'GBN 后退 N 帧':'SR 选择重传')+' · 3 位序号空间 0～7',13,ink,true)}
    {lineY(51,sendBase,4,'发送方',senderStatus)}
    {lineY(133,recvBase,size,'接收方',receiverStatus)}
    {tx(35,234,gbn?'GBN：乱序分组丢弃，超时从最早未确认帧开始批量重传':
      'SR：乱序分组缓存并单独确认，缺哪个只重传哪个',11,muted)}
  </g>;
}
function RipPanel({index}:{index:number}){
  const rows=[
    ['N1','7 / A','—','7 / A'],
    ['N2','2 / C','4+1=5','5 / C'],
    ['N3','未有','8+1=9','9 / C'],
    ['N6','8 / F','4+1=5','5 / C'],
    ['N8','4 / E','3+1=4','4 / E'],
    ['N9','4 / F','5+1=6','4 / F']
  ];
    return <g>
    {tx(35,25,'RIP：邻居 C 通告的距离需先加上 B→C 的一跳',13,ink,true)}
    {['目的','B 旧表','经 C 的候选','B 新表'].map((col,i)=>tx([38,167,335,573][i],51,col,12,muted,true))}
    {rows.map((r,j)=>{const from=j===0?0:j===1?3:j===2?4:j===3?5:j===4?6:7;
      const show=index>=from, y=77+j*27;
      return <g key={j}>
        {show&&index===from&&rect(31,y-18,696,24,'var(--panel-2)',accent,4)}
        {r.map((v,k)=>tx([38,167,335,573][k],y,k===3&&!show?r[1]:v,12,k===3&&show?accent:ink,k===3&&show))}
      </g>;
    })}
  </g>;
}
function OspfPanel({index}:{index:number}){
  const pos={A:[99,95],B:[255,54],C:[252,173],D:[408,117]} as const;
  const edges:[keyof typeof pos,keyof typeof pos,number][]=[['A','B',1],['A','C',4],['B','C',2],['B','D',5],['C','D',1]];
  const dist=[['A',0],['B',1],['C',index>=5?3:4],['D',index>=6?4:index>=5?6:Infinity]] as const;
  return <g>
    {tx(36,24,'OSPF：LSA 洪泛 → LSDB → 本地 Dijkstra (从 A 出发)',13,ink,true)}
    {edges.map(([a,b,w])=>{
      const x=pos[a],y=pos[b],p=[(x[0]+y[0])/2,(x[1]+y[1])/2];
      const selected=index>=7&&[['A','B'],['B','C'],['C','D']].some(pair=>pair.includes(a)&&pair.includes(b));
      return <g key={a+b}>
        <line x1={x[0]} y1={x[1]} x2={y[0]} y2={y[1]} stroke={selected?accent:quiet} strokeWidth={selected?4:2}/>
        {tx(p[0]+6,p[1]-7,String(w),12,ink,true)}
      </g>;
    })}
    {Object.entries(pos).map(([n,[x,y]])=><g key={n}>
      <circle cx={x} cy={y} r={19} fill={soft} stroke={accent} strokeWidth={2}/>
      {tx(x,y+5,n,15,ink,true,'middle')}
    </g>)}
    {tx(498,50,'当前最短距离',12,ink,true)}
    {dist.map(([name,val],i)=>tx(504,86+i*33,name+'：'+(index<4?'未初始化':Number.isFinite(val)?val:'∞'),14,
      index>=4&&i<Math.min(4,Math.max(1,index-3))?accent:index<4?quiet:ink,true))}
    {tx(37,231,'边代价：AB=1、AC=4、BC=2、BD=5、CD=1；到 D 最短代价=4',11,muted)}
  </g>;
}
function SwitchPanel({index}:{index:number}){
  const a=index>=2,b=index>=9;
  const ports=[['A','1'],['C','2'],['B','3'],['D','4']];
  const focus=index>=8&&index<=11?'B':index>=1&&index<=3?'A':index===5?'C':index===6?'D':'';
  return <g>
    {tx(35,29,'2025 局域网 P75–78 · 四端口交换机自学习',14,ink,true)}
    {tx(35,58,'动态 MAC 表（只从源地址学习）',12,muted,true)}
    {tx(42,84,'MAC',12,quiet,true)}
    {tx(180,84,'接口',12,quiet,true)}
    {[[ 'A','1',a ],[ 'B','3',b ]].map(([host,port,seen],i)=>{
      const y=94+i*49;
      return <g key={String(host)}>
        {rect(35,y,280,41,seen?'var(--panel-2)':soft,seen?accent:line)}
        {tx(50,y+27,String(host),16,seen?accent:quiet,true)}
        {tx(192,y+27,seen?String(port):'未学习',14,seen?accent:quiet,true)}
      </g>;
    })}
    {tx(389,59,'交换机 S',14,ink,true)}
    {ports.map(([name,port],i)=>{
      const y=77+i*43,hot=name===focus;
      return <g key={name}>
        <line x1={411} y1={y+14} x2={494} y2={y+14} stroke={hot?accent:line} strokeWidth={hot?4:2}/>
        {rect(504,y,182,32,hot?'var(--panel-2)':soft,hot?accent:line)}
        {tx(515,y+22,'口'+port+'  →  主机 '+name,12,hot?accent:ink,hot)}
      </g>;
    })}
    {tx(35,221,index<2?'先接收 A 的帧，尚未有任何源地址记录':index<9?'学到 A→1，目的 B 未知则向2/3/4泛洪':index<12?'收到 B 回复，学到 B→3，已知 A→1 定向转发':'动态表项到期会自动老化',11,muted)}
    {tx(35,244,'课件原图：端口1=A，端口2=C，端口3=B，端口4=D。',11,quiet)}
  </g>;
}
function CwndPanel({index}:{index:number}){
  const values=[1,2,4,8,9,10,10,10,10,10,8,5,6,1];
  const p=(i:number):[number,number]=>[40+i*48,190-values[i]*13];
  return <g>
    {tx(35,29,'经典 TCP Reno：cwnd / MSS 随事件变化（示例）',13,ink,true)}
    {[2,5,8,10].map(v=><g key={v}>
      <line x1={40} y1={190-v*13} x2={715} y2={190-v*13} stroke={line} strokeDasharray="3 5"/>
      {tx(23,194-v*13,String(v),10,quiet)}
    </g>)}
    <path d={values.slice(0,Math.min(index+1,13)).map((_,i)=>(i?'L':'M')+p(i).join(' ')).join(' ')}
      fill="none" stroke={accent} strokeWidth={3} strokeLinejoin="round"/>
    {values.slice(0,Math.min(index+1,13)).map((v,i)=><g key={i}>
      <circle cx={p(i)[0]} cy={p(i)[1]} r={i===index?7:4} fill={i===index?accent:muted}/>
      {i===index&&tx(p(i)[0]+10,p(i)[1]-10,String(v)+' MSS',13,accent,true)}
    </g>)}
    {tx(34,229,index===13?'RTO 为对照分支，非上述三次重复 ACK 事件的继续':'阈值初始为 8 MSS；3 个 DupACK 后 ssthresh=5，快恢复 cwnd=8→5',11,muted)}
  </g>;
}
function FlowPanel({index}:{index:number}){
  const rwnd=[4000,4000,4000,1000,1000,0,0,2000,2000][index]??4000;
  const sent=[0,1000,3000,3000,3000,3000,3000,3000,3000][index]??0;
  return <g>
    {tx(35,29,'TCP 流量控制：rwnd 是接收方通告的剩余缓冲区空间',13,ink,true)}
    {tx(35,61,'通告 rwnd = '+rwnd+' B',13,accent,true)}
    {rect(34,75,670,44)}
    {rwnd>0&&<rect x={35} y={76} width={Math.max(2,668*rwnd/4000)} height={42} rx={5} fill={accent} fillOpacity={0.32}/>}
    {tx(35,152,'示例发送端已发送（并非始终未确认）累计：'+sent+' B',12,ink)}
    {tx(35,182,index>=5&&index<=6?'零窗口：发送方等待并通过持续计时器探测窗口重新开放':
      '实际有效发送窗口受 min(rwnd,cwnd) 和未确认字节数共同约束',12,muted)}
    {tx(35,221,'注意：窗口缩小时，不能简单把 rwnd 当作某个 TCP 段允许发送的总字节数。',11,quiet)}
  </g>;
}


function PacketPipelinePanel({index}:{index:number}){
  const hubs=['主机 A','R1','R2','主机 B'], xs=[104,282,460,638];
  const pos=[
    index<2?0:index<6?1:index<7?2:3,
    index<4?0:index<8?1:index<11?2:3,
    index<5?0:index<9?1:index<12?2:3
  ];
  return <g>
    {tx(35,28,'分组交换 · P1、P2、P3 在每跳存储转发并流水线并行',13,ink,true)}
    {hubs.map((name,i)=>tx(xs[i],62,name,13,ink,true,'middle'))}
    {[0,1,2].map((p)=>{
      const y=96+p*61;
      return <g key={p} opacity={index<1?0.18:p===1&&index<4?0.30:p===2&&index<5?0.30:1}>
        <line x1={xs[0]} y1={y} x2={xs[3]} y2={y} stroke={line} strokeDasharray="5 5" strokeWidth={2}/>
        {xs.map((x,i)=><circle key={i} cx={x} cy={y} r={6} fill={i<=pos[p]?accent:soft} stroke={i<=pos[p]?accent:line}/>)}
        <rect x={xs[pos[p]]-37} y={y-19} width={74} height={38} rx={8} fill={soft} stroke={accent} strokeWidth={2}/>
        {tx(xs[pos[p]],y+5,'P'+(p+1),14,accent,true,'middle')}
        {tx(37,y+5,'分组'+(p+1),12,muted)}
      </g>;
    })}
    {tx(36,239,index>=12?'所有分组抵达后，仍需上层按其协议语义处理交付。':
      '每个分组在不同链路上的进度可重叠；不意味着链路或路由器没有排队时延。',11,muted)}
  </g>;
}
function CsmaPanel({index}:{index:number}){
  const collision=index>=3&&index<=7,backoff=index>=8&&index<=11,successful=index>=12&&index<=13;
  return <g>
    {tx(35,28,'经典共享半双工总线 · 载波侦听 / 冲突检测 / 退避',13,ink,true)}
    <line x1={80} y1={126} x2={682} y2={126} stroke={collision?warn:accent} strokeWidth={7} strokeLinecap="round"/>
    {[[88,'A'],[674,'B']].map(([cx,name])=><g key={String(name)}>
      <circle cx={Number(cx)} cy={126} r={20} fill={soft} stroke={accent} strokeWidth={2}/>
      {tx(Number(cx),132,String(name),15,ink,true,'middle')}
    </g>)}
    {collision? <g>
      <path d="M 255 104 L 277 148 L 299 105 L 321 148 L 343 104 L 365 148 L 387 104 L 409 148 L 431 104 L 453 148 L 475 104"
        fill="none" stroke={warn} strokeWidth={3}/>
      {tx(380,88,'碰撞！信号互相干扰',14,warn,true,'middle')}
    </g>:successful?tx(380,106,index===12?'A 先成功发送':'B 在 A 发送结束后再试',14,accent,true,'middle'):
      tx(380,106,backoff?'退避期间双方停止发送正常数据':'两端各自监听共享介质',13,muted,true,'middle')}
    {rect(34,181,690,46)}
    {tx(51,209,collision?'A、B 停止正常发送并发 Jam，让所有站点检测冲突':
      backoff?'示例退避：A 选择 K=0，B 选择 K=1；继续载波侦听':
      index>=14?'条件分支：若再次发生碰撞，随机退避窗口扩大':
      '载波侦听不能消除传播时延造成的“双方都认为空闲”',12,ink)}
    {tx(35,247,'争用时隙=512 bit times（经典以太网）；全双工交换式以太网无 CSMA/CD 碰撞。',11,muted)}
  </g>;
}
function DelayPanel({index}:{index:number}){
  const cells=[['处理','d_proc','本地首部处理'],['排队','d_queue','等待出口'],['发送','L/R = 1ms','1000bit÷1Mbit/s'],['传播','d/v = 1ms','200km÷2×10⁸m/s']];
  const hot=index===1?0:index===2||index===7?1:index===3?2:index===4||index===5?3:-1;
  return <g>
    {tx(35,28,'四类时延不是同一回事：发送使比特上链路，传播使信号走距离',13,ink,true)}
    {cells.map(([name,formula,note],i)=>{
      const x=35+i*176;
      return <g key={i}>
        {rect(x,54,163,126,hot===i?'var(--panel-2)':soft,hot===i?accent:line,9)}
        {tx(x+13,82,name,17,hot===i?accent:ink,true)}
        {tx(x+13,115,formula,14,ink,true)}
        {tx(x+13,147,note,11,muted)}
        {i<3&&tx(x+167,119,'→',16,accent,true,'middle')}
      </g>;
    })}
    {tx(35,210,'示例已知：发送时延 1ms，传播时延 1ms；处理与排队未给出，不能编造固定数值。',12,muted)}
    {tx(35,236,'首比特抵达 ≠ 最后一比特抵达；两种时延可在时间线上重叠。',12,accent,true)}
  </g>;
}
function EncapsulationPanel({index}:{index:number}){
  const header=['MAC帧头','IP首部','TCP首部','应用数据 M','FCS'],colors=[accent,muted,'var(--c-warn)',ok,accent];
  let active:number[];
  if(index===0||index===8)active=[3];
  else if(index===1||index===7)active=[2,3];
  else if(index===2||index===5)active=[1,2,3];
  else active=[0,1,2,3,4];
  const widths=[119,110,115,205,74],start=36;
  let x=start;
  return <g>
    {tx(35,28,'封装与解封装：按本层职责添加/移除首部',13,ink,true)}
    {header.map((name,i)=>{
      const xx=x;x+=widths[i];const visible=active.includes(i);
      return <g key={i} opacity={visible?1:0.20}>
        {rect(xx,74,widths[i]-4,77,visible?'var(--panel-2)':soft,visible?colors[i]:line,6)}
        {tx(xx+(widths[i]-4)/2,114,name,13,visible?colors[i]:quiet,true,'middle')}
      </g>;
    })}
    {tx(35,184,index===3?'发送本跳以太网帧，帧头包含本跳源/目的 MAC。':
      index===4?'物理层把已经组成的帧转换为实际电、光或无线信号。':
      index===5?'路由器去掉旧链路帧头，检查 IP 首部和路由表。':
      index===6?'路由器在下一跳重新加链路层首尾，MAC 地址随本跳更新。':
      index===7?'目标端逐层解封装，按协议号/端口把段交给目标进程。':
      index===8?'应用最终获得原数据 M，数据链路层只负责相邻节点的帧传送。':
      '本步高亮的是当前协议数据单元已经包含的字段。',12,ink)}
    {tx(35,232,'教学简化为以太网 + IPv4 + TCP：UDP、IPv6、其他链路协议的首部格式会不同。',11,muted)}
  </g>;
}
function NyquistPanel({index}:{index:number}){
  const rows=[
    ['信道带宽','B = 3000 Hz','题设'],
    ['理想最高码元率','2B = 6000 Baud','奈奎斯特'],
    ['V=2 数据率','6000 × log₂2 = 6000 bit/s','二进制码元'],
    ['V=4 数据率','6000 × log₂4 = 12000 bit/s','四进制码元'],
    ['功率比换算','30 dB → 10³ = 1000','先把 dB 转线性'],
    ['有噪声容量','3000 log₂(1001) ≈ 29901 bit/s','香农公式']
  ];
  return <g>
    {tx(35,29,'奈奎斯特限制码元速率；香农限制有噪声信道容量',13,ink,true)}
    {rows.map(([name,formula,note],i)=>{
      const thresholds=[0,1,1,2,4,5];
      const y=51+i*30,shown=index>=thresholds[i];
      return <g key={i} opacity={shown?1:0.3}>
        {shown&&index===i&&rect(32,y-17,690,27,'var(--panel-2)',accent,4)}
        {tx(39,y,name,12,ink,true)}
        {tx(246,y,formula,13,shown?accent:quiet,shown)}
        {tx(571,y,note,11,muted)}
      </g>;
    })}
    {tx(35,247,'实际传输速率还受调制方案、误码率目标、编码与实现开销等约束。',11,muted)}
  </g>;
}
function MultiplexPanel({index}:{index:number}){
  const kind=index===1?'FDM':index===2||index===3?'TDM':index===4?'STDM':
    index===5?'WDM':index===6?'CDM':index===7?'解复用':'准备复用';
  const rows=kind==='FDM'||kind==='WDM'?[
    ['频带/波长 1','用户 A'],
    ['频带/波长 2','用户 B'],
    ['频带/波长 3','其他业务']]:
    kind==='TDM'||kind==='STDM'?[
      ['时隙 1','用户 A'],
      ['时隙 2','用户 B'],
      ['时隙 3',kind==='STDM'?'按需分配':'用户 A']]:
    [['码片序列 1','用户 A'],['码片序列 2','用户 B'],['共享载体','按码相关解扩']];
  return <g>
    {tx(35,29,'复用的划分维度：'+kind,15,accent,true)}
    {rows.map(([lane,owner],i)=>{const y=57+i*57;
      return <g key={i}>
        {rect(37,y,684,43)}
        {rect(40,y+3,80,37,'var(--panel-2)',i%2===0?accent:warn,5)}
        {tx(80,y+27,String(i+1),14,i%2===0?accent:warn,true,'middle')}
        {tx(148,y+27,lane,13,ink,true)}
        {tx(477,y+27,owner,13,ink)}
      </g>;
    })}
    {tx(35,247,'FDM：频率　TDM：固定时隙　STDM：动态分配　WDM：光波长　CDM：扩频码。',11,muted)}
  </g>;
}


/** 课件第7章 P24：UDP 伪首部 + UDP 首部 + TESTING，逐个16位字反码加法。 */
function UdpChecksumPanel({index,step}:{index:number;step:NetStep}){
  const words=[
    ['源 IP ①','9913'],['源 IP ②','0868'],['目的 IP ①','AB03'],['目的 IP ②','0E0B'],
    ['0 + 协议17','0011'],['伪首部长度15','000F'],['源端口1087','043F'],['目标端口13','000D'],
    ['UDP长度15','000F'],['校验和暂填0','0000'],['ASCII TE','5445'],['ASCII ST','5354'],
    ['ASCII IN','494E'],['ASCII G + 00','4700'],
  ];
  const active=index>=4&&index<=17?index-4:-1;
  const running=step.bits?.value??'—';
  return <g>
    {tx(35,28,'2025 第7章 P24：UDP 反码检验和计算',14,ink,true)}
    {tx(35,50,'12B伪首部（不发送） + 8B UDP头 + 7B数据（补0仅供计算）',11,muted)}
    {words.map(([label,word],i)=>{
      const col=Math.floor(i/7),row=i%7,x=35+col*351,y=63+row*23,hot=active===i;
      return <g key={i} opacity={i>active&&active>=0?0.57:1}>
        {hot&&rect(x-4,y-15,338,22,'var(--panel-2)',accent,4)}
        {tx(x,y,String(i+1).padStart(2,'0'),11,quiet)}
        {tx(x+34,y,label,11,hot?accent:muted,hot)}
        {tx(x+249,y,word,13,hot?accent:ink,true)}
      </g>;
    })}
    {tx(35,237,index>=18?'累计反码和 96ED → 按位取反得到检验和 6912':
      active>=0?'第 '+(active+1)+' 个16位字后：累计和 '+running:
      '先准备伪首部、UDP 头与 7 字节 TESTING 数据',12,accent,true)}
    {tx(35,252,'检验和 0x6912；接收端包含检验和的反码和应为 FFFF。',10,quiet)}
  </g>;
}
/** 第8章P24：与常见本地递归+上游迭代不同，教材此图为服务器间完全递归。 */
function DnsFullRecursivePanel({index,step}:{index:number;step:NetStep}){
  const labels=['客户','本地 dns.xyz.com','根 DNS','TLD dns.com','权威 dns.abc.com'],xs=[83,229,375,521,667];
  const from=step.from,to=step.to;
  const isMessage=index>=1&&index<=8&&from!==to;
  const first=from<to;
  const xa=xs[from]+(first?56:-56),xb=xs[to]+(first?-56:56);
  return <g>
    {tx(35,30,'2025 应用层 P24 · 完全递归 DNS：查询 y.abc.com',14,ink,true)}
    {tx(35,55,'图中每层服务器都代下层继续查询；应答再沿原路层层返回（教材标注较少用）',11,muted)}
    {labels.map((label,i)=><g key={i}>
      {rect(xs[i]-61,78,122,49,'var(--panel-2)',i===from||i===to?accent:line,7)}
      {tx(xs[i],96,String(i+1),10,quiet,false,'middle')}
      {tx(xs[i],115,compact(label,12),11,ink,true,'middle')}
    </g>)}
    {isMessage&&<g>
      <line x1={xa} y1={155} x2={xb} y2={155} stroke={accent} strokeWidth={4}/>
      <polygon points={first?
        (xb+','+(155)+' '+(xb-10)+','+(149)+' '+(xb-10)+','+(161)):
        (xb+','+(155)+' '+(xb+10)+','+(149)+' '+(xb+10)+','+(161))}
        fill={accent}/>
      {tx(376,182,index<=4?'向右：递归查询请求':'向左：解析结果逐级返回',13,accent,true,'middle')}
    </g>}
    {tx(35,220,'当前：'+compact(step.event,42),12,ink,true)}
    {tx(35,244,'课件图中的箭头 ①—⑧；不虚构课件未给出的目标 IPv4 数值。',11,quiet)}
  </g>;
}
/** 第7章P117–126：单独复现慢开始门限16，拥塞时24减半为12的教学曲线。 */
function PptCwndPanel({scenario,index}:{scenario:NetScenario;index:number}){
  const values=scenario.steps.map(s=>{
    const found=s.values?.find(v=>v.startsWith('cwnd='));
    return Number(found?.split('=')[1]??1);
  });
  const x=(i:number)=>48+i*33.8,y=(v:number)=>211-v*6.25;
  const points=values.slice(0,index+1);
  const threshold=index>=13?12:16;
  return <g>
    {tx(35,28,'2025 第7章 P117–126 · ssthresh=16 → 12，超时再慢开始',13,ink,true)}
    {[0,4,8,12,16,20,24].map(v=><g key={v}>
      <line x1={47} y1={y(v)} x2={716} y2={y(v)} stroke={line} strokeDasharray="3 5"/>
      {tx(20,y(v)+4,String(v),10,quiet)}
    </g>)}
    <line x1={48} y1={y(threshold)} x2={714} y2={y(threshold)}
      stroke={warn} strokeWidth={2} strokeDasharray="8 5"/>
    <path d={points.map((v,i)=>(i?'L':'M')+x(i)+' '+y(v)).join(' ')}
      fill="none" stroke={accent} strokeWidth={3} strokeLinejoin="round"/>
    {points.map((v,i)=><g key={i}>
      <circle cx={x(i)} cy={y(v)} r={i===index?6:3.2} fill={i===index?accent:muted}/>
      {i===index&&tx(Math.min(699,x(i)+9),y(v)-10,String(v)+' MSS',12,accent,true)}
    </g>)}
    {tx(35,236,'当前窗口 cwnd='+values[index]+' MSS；门限 ssthresh='+threshold+' MSS。',12,ink,true)}
    {tx(35,253,'课件原例：超时 cwnd=24 → ssthresh=12，cwnd 重置为1。',10,quiet)}
  </g>;
}
function PptPrefixPanel({index}:{index:number}){
  const rows=[
    ['/22: 255.255.252.0','71 AND 252 = 68','206.0.68.0/22'],
    ['/25: 255.255.255.128','130 AND 128 = 128','206.0.71.128/25'],
  ];
  return <g>
    {tx(35,29,'2025 第6章最长前缀图 · 两条重叠路由',14,ink,true)}
    {tx(35,54,'示例目标 D = 206.0.71.130（用于展开课件图中的 /22 与 /25 掩码）',11,muted)}
    {rows.map(([mask,calc,matched],i)=>{
      const show=index>=(i?5:3),chosen=i===1&&index>=6,y=70+i*79;
      return <g key={i}>
        {rect(35,y,685,67,chosen?'var(--panel-2)':soft,chosen?accent:line,7)}
        {tx(49,y+23,mask,13,ink,true)}
        {tx(49,y+47,calc,12,muted)}
        {tx(452,y+43,show?matched:'等待逐位与…',13,show?accent:quiet,true)}
      </g>;
    })}
    {tx(35,238,index>=6?'同时命中 → 优先选择更长的 /25 前缀，依其下一跳转发':
      '逐位与运算决定是否匹配；先不要按表项顺序决定路由。',12,accent,true)}
  </g>;
}

export function NetDetail({scenario,step,index}:{scenario:NetScenario;step:NetStep;index:number}){
  const name=scenario.name;
  let specialized=null;
  if(name==='net-udp-checksum-2025')specialized=<UdpChecksumPanel index={index} step={step}/>;
  else if(name==='net-dns-full-recursive-2025')specialized=<DnsFullRecursivePanel index={index} step={step}/>;
  else if(name==='net-tcp-cwnd-2025')specialized=<PptCwndPanel scenario={scenario} index={index}/>;
  else if(name==='net-prefix-match-2025')specialized=<PptPrefixPanel index={index}/>;
  else if(name==='net-packet-switch')specialized=<PacketPipelinePanel index={index}/>;
  else if(name==='net-csmacd')specialized=<CsmaPanel index={index}/>;
  else if(name==='net-delay')specialized=<DelayPanel index={index}/>;
  else if(name==='net-encapsulation')specialized=<EncapsulationPanel index={index}/>;
  else if(name==='net-nyquist')specialized=<NyquistPanel index={index}/>;
  else if(name==='net-multiplex')specialized=<MultiplexPanel index={index}/>;
  else if(name==='net-crc')specialized=<CrcPanel index={index} step={step}/>;
  else if(name==='net-fragment')specialized=<FragmentPanel index={index}/>;
  else if(name==='net-subnet')specialized=<SubnetPanel index={index}/>;
  else if(name==='net-gbn'||name==='net-sr')specialized=<WindowPanel index={index} kind={name==='net-gbn'?'gbn':'sr'}/>;
  else if(name==='net-rip')specialized=<RipPanel index={index}/>;
  else if(name==='net-ospf')specialized=<OspfPanel index={index}/>;
  else if(name==='net-switch-learn')specialized=<SwitchPanel index={index}/>;
  else if(name==='net-tcp-congestion')specialized=<CwndPanel index={index}/>;
  else if(name==='net-tcp-flow')specialized=<FlowPanel index={index}/>;
  return <g transform="translate(0 330)">
    {rect(19,0,722,260,'var(--panel-solid)',line,12)}
    {specialized??<g>
      {tx(35,34,'当前事件：'+compact(step.event,35),16,accent,true)}
      {tx(35,65,'关键状态（各步骤按实际消息和状态顺序排列）',12,quiet)}
      {(step.values??[]).slice(0,5).map((value,i)=>{
        const x=35+(i%2)*349,y=84+Math.floor(i/2)*49;
        return <g key={i}>
          {rect(x,y,333,38)}
          {tx(x+12,y+24,compact(value,39),13,i===0?accent:ink,i===0)}
        </g>;
      })}
      {step.bits&&<g>
        {tx(35,230,step.bits.label+':',12,muted)}
        {tx(232,230,compact(step.bits.value,40),14,accent,true)}
      </g>}
      {!step.bits&&tx(35,236,'请结合下方文字解说观察当前消息、确认与状态变化。',12,muted)}
    </g>}
  </g>;
}
