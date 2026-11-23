/** 网络复习可视化回归：内容引用、逐帧解释、SVG 结构可渲染、无需改动旧课程数据。 */
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { networkDemoNames, networkRegistry, networkScenarios } from '../components/demos/network-registry';
import { registry } from '../components/demos/registry';
import { netChapters } from '../content/net';
import { netDemoPlacements } from '../content/net/enhance';
import { netStaticFigures } from '../content/net/net-figures';

describe('计算机网络可视化覆盖',()=>{
  it('35 个动画有唯一名称、各步有解释且已注册',()=>{
    expect(networkDemoNames).toHaveLength(35);
    expect(new Set(networkDemoNames).size).toBe(31);
    expect(networkDemoNames.some((name)=>Boolean(registry[name]))).toBe(false);
    expect(netDemoPlacements).toHaveLength(35);
    expect(netStaticFigures).toHaveLength(32);
    for(const scenario of networkScenarios){
      expect(scenario.actors.length).toBeGreaterThanOrEqual(2);
      expect(scenario.steps.length).toBeGreaterThanOrEqual(6);
      for(const step of scenario.steps){
        expect(step.cap.length).toBeGreaterThan(24);
        expect(step.from).toBeGreaterThanOrEqual(0);
        expect(step.to).toBeLessThan(scenario.actors.length);
        expect(step.from).toBeLessThan(scenario.actors.length);
      }
    }
  });
  it('逐帧播放器 SVG 首末两帧可以 SSR，无 NaN 和 undefined',()=>{
    for(const name of networkDemoNames){
      const def=networkRegistry[name];
      const frames=def.build();
      for(const frame of [frames[0],frames[frames.length-1]]){
        const View=def.View;
        const html=renderToStaticMarkup(
          <svg viewBox={'0 0 '+def.w+' '+def.h}><View frame={frame}/></svg>,
        );
        expect(html).toContain('<svg');
        expect(html).not.toContain('NaN');
        expect(html).not.toContain('undefined');
        expect(html).toContain('步骤');
      }
    }
  });
  it('八章都有导学图，35 个演示全部落在实际章节，32 幅结构图有 SVG 题注',()=>{
    const placed=netChapters.flatMap((c)=>c.sections.flatMap((s)=>s.blocks))
      .filter((block)=>block.type==='demo').map((block)=>block.name)
      .filter((name)=>name.startsWith('net-'));
    expect(placed.slice().sort()).toEqual(networkDemoNames.slice().sort());
    expect(netChapters).toHaveLength(8);
    for(let i=0;i<8;i++){
      const text=netChapters[i].sections.flatMap((s)=>s.blocks)
        .filter((block)=>block.type==='html').map((block)=>block.html).join('');
      expect(text).toContain('id="net-guide-'+(i+1)+'-title"');
    }
    for(const fig of netStaticFigures){
      const chapter=netChapters[fig.ch-1];
      const html=chapter.sections.flatMap((s)=>s.blocks)
        .filter((block)=>block.type==='html').map((block)=>block.html).join('');
      expect(html).toContain(fig.html);
      expect(fig.html).toContain('<svg class="fig net-diagram"');
      expect(fig.html).toContain('class="fig-cap"');
    }
  });
});
