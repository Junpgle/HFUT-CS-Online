import { useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { PAT_BASE } from '../../courses/registry';
import { patDecks, patHome } from '../../content/pat';
import { useToc } from '../../lib/toc';
import { decodeEntities } from '../../lib/text';
import HtmlContent from '../../components/HtmlContent';
import Sections from '../../components/Sections';
import SectionCapsule from '../../components/SectionCapsule';
import { scrollToId } from '../../lib/scroll';
import { useScrollSpy } from '../../lib/scrollspy';

/** 各讲卡片的一句话导读（取自各讲实际章节主题） */
const DECK_BLURB: Record<string, string> = {
  deck1: '模板与泛型 · 五大组件 · 容器 / 迭代器 / 算法 · STL 应用实战',
  deck2: '开场谜题 · BFS 与正确性证明 · Kruskal / Prim · DFS 与边的分类 · 更多搜索',
  deck3: '叉积与线段相交 · 快速排斥与跨立 · 凸包（Graham / 打包法）· 巨人和魔鬼',
  deck4: '由最短路径引出 · 模型要素 · 基本定理与方程 · 适用条件 · 实例分析',
  deck5: '补集转化 · 递推关系（Fibonacci / Hanoi / Catalan）· Pólya 原理',
  deck6: '模拟 · 密码 · 字符串与高精度 · 匹配与网络流 · 剪枝 / 线段树 / 树状数组',
};

/** 课程主页（总目录）：内容地图卡片 + 课程简介 + 附录课程实验 */
export default function PatHome() {
  const navigate = useNavigate();
  const toc = useToc();
  const [params] = useSearchParams();
  const section = params.get('s');
  const pageRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const jump = (id: string) => {
    scrollToId(id);
    toc.setActive(id);
    navigate(`${PAT_BASE}/?s=${id}`, { replace: true });
  };

  // 上报目录到外壳侧栏
  useEffect(() => {
    toc.report(patHome.toc, jump);
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

  const introSec = patHome.sections.filter((s) => s.id === 'sec-intro');
  const mapSec = patHome.sections.find((s) => s.id === 'sec-map');
  const restSecs = patHome.sections.filter((s) => s.id !== 'sec-intro' && s.id !== 'sec-map');

  return (
    <div className="page" ref={pageRef}>
      <h1>{decodeEntities(patHome.title)}</h1>
      <div className="lede">
        <HtmlContent html={patHome.lede} />
      </div>

      <Sections sections={introSec} />

      {/* 内容地图：卡片由组件渲染（Link 跳转），说明文字取自内容数据 */}
      <section>
        <h2 id="sec-map">内容地图</h2>
        <div className="card-grid">
          {patDecks.map((d) => (
            <Link key={d.id} className="card" to={`${PAT_BASE}/deck/${d.id}`}>
              <h3>{decodeEntities(d.title)}</h3>
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
