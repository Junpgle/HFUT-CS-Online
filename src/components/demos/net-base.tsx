/** 计网分步协议演示的公共 SVG 视图。播放、暂停、步进、拖拽与全屏复用 DemoPlayer。 */
import type { DemoDef, DemoFrame } from './types';
import { NetDetail } from './net-detail';

export interface NetStep {
  tag: string;
  cap: string;
  /** 参与通信的实体索引，from=to 表示本地计算/状态转移。 */
  from: number;
  to: number;
  event: string;
  values?: string[];
  bits?: { label: string; value: string; mark?: string };
}
export interface NetScenario {
  name: string;
  actors: string[];
  steps: NetStep[];
}
interface Frame extends DemoFrame {
  index: number;
  scenario: NetScenario;
}
const W=760, H=605;
const ink='var(--ink)', muted='var(--ink-2)', subtle='var(--ink-3)',
  accent='var(--deck-accent)', panel='var(--panel-solid)', wash='var(--panel-2)', line='var(--hairline)';
const center=(i:number,n:number)=> n===1 ? W/2 : 95+(W-190)*i/(n-1);
const compact=(value:string,max:number)=>{
  let seen=0,out='';
  for(const ch of value){
    const weight=/[\x00-\x7f]/.test(ch)?0.57:1;
    if(seen+weight>max) return out+'…';
    out+=ch;seen+=weight;
  }
  return out;
};
function label(x:number,y:number,s:string,options?:{size?:number;color?:string;bold?:boolean;anchor?:'start'|'middle'|'end'}){
  return <text x={x} y={y} fontFamily="var(--font)" fontSize={options?.size??13} fontWeight={options?.bold?700:500}
    fill={options?.color??ink} textAnchor={options?.anchor??'start'}>{s}</text>;
}
function View({frame:f}:{frame:Frame}){
  const {actors,steps,name}=f.scenario;
  const here=steps[f.index];
  const shown=steps.slice(Math.max(0,f.index-5),f.index+1);
  const start=Math.max(0,f.index-5);
  const xs=actors.map((_,i)=>center(i,actors.length));
  const marker='net-arrow-'+name;
  const colorFor=(i:number)=>i===f.index?accent:muted;
  return <g>
    <defs><marker id={marker} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill={accent}/></marker></defs>
    <rect x={12} y={12} width={736} height={302} rx={12} fill={wash} fillOpacity={0.32} stroke={line}/>
    {label(29,56,'消息时序 · 最近最多 6 步（拖动下方进度条可查看全部）',{size:10,color:subtle})}
    {label(29,35,here.tag,{size:16,bold:true,color:accent})}
    {label(731,35,'步骤 '+(f.index+1)+' / '+steps.length,{size:12,color:subtle,anchor:'end'})}
    {actors.map((name,i)=><g key={i}>
      <rect x={xs[i]-Math.min(68,252/actors.length)} y={49} width={Math.min(136,504/actors.length)} height={37} rx={8}
        fill={i===here.from||i===here.to?wash:panel} stroke={i===here.from||i===here.to?accent:line}/>
      {label(xs[i],72,compact(name,actors.length>=5?8:actors.length===4?13:20),{size:actors.length>=5?11:13,bold:i===here.from||i===here.to,anchor:'middle'})}
      <line x1={xs[i]} y1={92} x2={xs[i]} y2={299} stroke={line} strokeDasharray="5 5"/>
    </g>)}
    {shown.map((step,j)=>{
      const index=start+j, y=109+j*36, isCurrent=index===f.index;
      const x1=xs[step.from]??xs[0],x2=xs[step.to]??xs[0];
      const same=step.from===step.to;
      return <g key={index} opacity={isCurrent?1:0.57}>
        {label(31,y+5,String(index+1).padStart(2,'0'),{size:12,color:isCurrent?accent:subtle,bold:isCurrent})}
        {same?
          <rect x={x1-12} y={y-7} width={24} height={14} rx={7}
            fill={isCurrent?accent:muted} fillOpacity=".28" stroke={colorFor(index)}/>:
          <line x1={x1+(x2>x1?9:-9)} y1={y} x2={x2+(x1>x2?9:-9)} y2={y} stroke={colorFor(index)}
            strokeWidth={isCurrent?2.7:1.5} markerEnd={isCurrent?'url(#'+marker+')':undefined}/>}
        {label(same?x1:(x1+x2)/2,y-10,compact(step.event,actors.length>=5?11:actors.length===4?16:24),
          {size:11,color:isCurrent?ink:muted,bold:isCurrent,anchor:'middle'})}
      </g>;
    })}
    <NetDetail scenario={f.scenario} step={here} index={f.index}/>
  </g>;
}
export function makeNetDemo(scenario:NetScenario):DemoDef<Frame>{
  return {
    w:W,h:H,
    build:()=>scenario.steps.map((step,index)=>({cap:step.cap,index,scenario})),
    View,
  };
}
