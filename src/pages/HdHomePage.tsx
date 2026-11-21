import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HD_BASE } from '../courses/registry';
import { hdHome } from '../content/hd';
import { useToc } from '../lib/toc';
import HtmlContent from '../components/HtmlContent';
import Sections from '../components/Sections';
import SectionCapsule from '../components/SectionCapsule';
import { scrollToId } from '../lib/scroll';
import { useScrollSpy } from '../lib/scrollspy';
import { decodeEntities } from '../lib/text';

/** 「系统硬件综合设计」课程总目录页：课件脉络速查 */
export default function HdHomePage() {
  const navigate = useNavigate();
  const toc = useToc();
  const [params] = useSearchParams();
  const section = params.get('s');
  const pageRef = useRef<HTMLDivElement>(null);

  const jump = (id: string) => {
    scrollToId(id);
    toc.setActive(id);
    navigate(`${HD_BASE}/?s=${id}`, { replace: true });
  };

  useEffect(() => {
    toc.report(hdHome.toc, jump);
    return () => toc.report([], () => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useScrollSpy(pageRef, []);

  useEffect(() => {
    if (!section) return;
    const t = window.setTimeout(() => scrollToId(section), 80);
    return () => window.clearTimeout(t);
  }, [section]);

  return (
    <div className="page" ref={pageRef}>
      <h1>{decodeEntities(hdHome.title)}</h1>
      <div className="lede">
        <HtmlContent html={hdHome.lede} />
      </div>
      <Sections sections={hdHome.sections} />
      <SectionCapsule />
    </div>
  );
}
