import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { homeData } from '../content';
import { useToc } from '../lib/toc';
import { decodeEntities } from '../lib/text';
import HtmlContent from '../components/HtmlContent';
import Sections from '../components/Sections';
import SectionCapsule from '../components/SectionCapsule';
import { scrollToId } from '../lib/scroll';

export default function HomePage() {
  const navigate = useNavigate();
  const toc = useToc();
  const [params] = useSearchParams();
  const section = params.get('s');

  const jump = (id: string) => {
    scrollToId(id);
    navigate(`/?s=${id}`, { replace: true });
  };

  useEffect(() => {
    // 首页 toc 里 sec-map-* 与「全站导航」完全重复，不上报到侧栏
    toc.report(
      homeData.toc.filter((t) => !t.id.startsWith('sec-map')),
      jump,
    );
    return () => toc.report([], () => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!section) return;
    const t = window.setTimeout(() => scrollToId(section), 80);
    return () => window.clearTimeout(t);
  }, [section]);

  return (
    <div className="page">
      <h1>{decodeEntities(homeData.title)}</h1>
      <div className="lede">
        <HtmlContent html={homeData.lede} />
      </div>
      <Sections sections={homeData.sections} />
      <footer className="pagefoot">内容依据课程 PPT 整理 · 仅供复习</footer>
      <SectionCapsule />
    </div>
  );
}
