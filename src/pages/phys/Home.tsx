import { useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { PHYS_BASE } from '../../courses/registry';
import { physDecks, physHome } from '../../content/phys';
import { useToc } from '../../lib/toc';
import { decodeEntities } from '../../lib/text';
import HtmlContent from '../../components/HtmlContent';
import Sections from '../../components/Sections';
import SectionCapsule from '../../components/SectionCapsule';
import { scrollToId } from '../../lib/scroll';
import { useScrollSpy } from '../../lib/scrollspy';

/** 各章卡片的一句话导读（取自各章实际小节主题） */
const DECK_BLURB: Record<string, string> = {
  deck1: '质点运动 · 圆周运动 · 相对运动与常见力 · 牛顿运动定律',
  deck2: '质心与动量守恒 · 角动量 · 功能原理与机械能守恒 · 碰撞',
  deck3: '刚体模型 · 力矩与转动定律 · 转动动能 · 角动量守恒',
  deck4: '狭义相对论基本原理 · 洛伦兹变换 · 时空相对性 · 质速与质能关系',
  deck5: '理想气体物态方程 · 压强与温度的统计意义 · 麦克斯韦速率分布',
  deck6: '热力学第一定律 · 等值与绝热过程 · 卡诺循环 · 熵',
  deck7: '库仑定律与场强 · 高斯定理 · 电势 · 导体与电介质 · 静电场能量',
  deck8: '磁感应强度 · 毕奥–萨伐尔定律 · 安培环路定理 · 磁场对电流的作用',
  deck9: '电磁感应定律 · 动生/感生电动势 · 自感互感 · 位移电流与麦克斯韦方程组',
  deck10: '谐振动方程与特征量 · 旋转矢量 · 常见谐振动 · 一维振动的合成与拍',
  deck11: '机械波的产生与传播 · 波函数 · 波的能量 · 干涉与驻波 · 多普勒效应',
  deck12: '相干光与双缝干涉 · 光程与薄膜干涉 · 衍射与光栅 · 光的偏振',
};

/** 课程主页（总目录）：内容地图卡片 + 课程简介 + 参考资料 */
export default function PhysHome() {
  const navigate = useNavigate();
  const toc = useToc();
  const [params] = useSearchParams();
  const section = params.get('s');
  const pageRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const jump = (id: string) => {
    scrollToId(id);
    toc.setActive(id);
    navigate(`${PHYS_BASE}/?s=${id}`, { replace: true });
  };

  // 上报目录到外壳侧栏
  useEffect(() => {
    toc.report(physHome.toc, jump);
    return () => toc.report([], () => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ?s=sec-id 深链：首次直接定位，此后平滑滚动
  useEffect(() => {
    if (!section) return;
    const t = window.setTimeout(() => scrollToId(section, firstRender.current), 80);
    firstRender.current = false;
    return () => window.clearTimeout(t);
  }, [section]);

  // 精准 scroll-spy
  useScrollSpy(pageRef, []);

  const introSec = physHome.sections.filter((s) => s.id === 'sec-intro');
  const mapSec = physHome.sections.find((s) => s.id === 'sec-map');
  const restSecs = physHome.sections.filter((s) => s.id !== 'sec-intro' && s.id !== 'sec-map');

  return (
    <div className="page" ref={pageRef}>
      <h1>{decodeEntities(physHome.title)}</h1>
      <div className="lede">
        <HtmlContent html={physHome.lede} />
      </div>

      <Sections sections={introSec} />

      {/* 内容地图：卡片由组件渲染（Link 跳转），说明文字取自内容数据 */}
      <section>
        <h2 id="sec-map">内容地图</h2>
        <div className="card-grid">
          {physDecks.map((d) => (
            <Link key={d.id} className="card" to={`${PHYS_BASE}/deck/${d.id}`}>
              <h3>
                {d.no} {decodeEntities(d.title)}
              </h3>
              <p>{DECK_BLURB[d.id]}</p>
            </Link>
          ))}
        </div>
        {mapSec && <HtmlContent html={mapSec.blocks.map((b) => (b.type === 'html' ? b.html : '')).join('')} />}
      </section>

      <Sections sections={restSecs} />
      <SectionCapsule />
    </div>
  );
}
