/** 计算机网络专用逐步状态板。数据流使用公共泳道，本面板显示各协议真正变化的数据结构。 */
import type { NetScenario, NetStep } from './net-base';

export interface Ipv4Fragment { index: number; payload: number; total: number; offset: number; mf: 0|1 }
export function calculateIpv4Fragments(payload:number,mtu:number,ipHeader:number):Ipv4Fragment[]{
  if(!Number.isInteger(payload)||payload<=0||!Number.isInteger(mtu)||!Number.isInteger(ipHeader)
    || ipHeader<20||mtu<=ipHeader+7) throw new RangeError('无效的 IPv4 分片参数');
  const max=8*Math.floor((mtu-ipHeader)/8);
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
  const value=step.bits?.value??'11010110110000';
  const pos=index>=2&&index<=11?index-2:index>=15&&index<=24?index-15:-1;
  const before=index===2?'11010110110000':index>2&&index<=11?'发送端第 '+(index-2)+' 轮':index>=15&&index<=24?'接收端第 '+(index-14)+' 轮':null;
  return <g>
    {tx(35,31,'CRC · 逐位对齐 G=10011（发送端和接收端都完整长除）',13,ink,true)}
    {tx(35,56,'位下标',11,quiet)}
    {Array.from({length:14},(_,i)=>{
      const x=95+i*43,highlight=pos>=0&&i>=pos&&i<pos+5;
      return <g key={i}>
        {rect(x,64,39,39,highlight?'var(--panel-2)':soft,highlight?accent:line,4)}
        {tx(x+19.5,89,value.length===14?value[i]:String(value[i]??'·'),16,
          highlight?accent:ink,true,'middle')}
        {tx(x+19.5,120,String(i),10,quiet,false,'middle')}
      </g>;
    })}
    {rect(34,135,692,39)}
    {tx(46,159,pos>=0?'本轮除数对齐于位 '+pos+'～'+(pos+4)+'；运算后该位='+(value[pos]??'?'):
      index<=1?'发送端准备原始数据并补足 CRC 位':'计算已收敛：检查末 4 位',12,ink,true)}
    {tx(35,195,pos>=0?'模 2 除法：当前位为 1 时异或 10011；为 0 时写商位 0 并跳过':
      '生成多项式 G(x)=x⁴+x+1，二进制除数 10011；接收端以同一多项式复核。',12,muted)}
    {tx(35,223,step.event+'   '+(before??''),11,accent)}
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
    {dist.map(([name,val],i)=>tx(504,86+i*33,name+'：'+(Number.isFinite(val)?val:'∞'),14,i<Math.min(4,Math.max(1,index-3))?accent:ink,true))}
    {tx(37,231,'边代价：AB=1、AC=4、BC=2、BD=5、CD=1；到 D 最短代价=4',11,muted)}
  </g>;
}
function SwitchPanel({index}:{index:number}){
  const macs=[['A','1',index>=1],['B','2',index>=4],['C','3',index>=6]];
  return <g>
    {tx(35,30,'二层交换机：从源 MAC 学习端口，再查目的 MAC 转发',13,ink,true)}
    {tx(36,65,'MAC',12,muted,true)}
    {tx(182,65,'学习端口',12,muted,true)}
    {tx(338,65,'状态',12,muted,true)}
    {macs.map(([name,port,visible],i)=><g key={String(name)}>
      {rect(32,78+i*41,450,34,visible?'var(--panel-2)':soft,line)}
      {tx(42,101,String(name),14,ink,true)}
      {tx(195,101,visible?String(port):'?',14,visible?accent:quiet,true)}
      {tx(345,101,visible?'已学习':'尚未学习',12,visible?ok:quiet)}
    </g>)}
    {tx(511,87,index<2?'空表→学习 A':index<4?'未知目的 B→泛洪':index<6?'已知 A→端口1':
      index<8?'目的 B→端口2':index===8?'入/出端口相同→过滤':'MAC 表项可老化',13,accent,true)}
    {tx(511,116,'交换机按每个 VLAN 维护',11,muted)}
    {tx(511,136,'自己的转发表；',11,muted)}
    {tx(511,156,'不是根据目的 MAC 学习。',11,muted)}
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

export function NetDetail({scenario,step,index}:{scenario:NetScenario;step:NetStep;index:number}){
  const name=scenario.name;
  let specialized=null;
  if(name==='net-crc')specialized=<CrcPanel index={index} step={step}/>;
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
