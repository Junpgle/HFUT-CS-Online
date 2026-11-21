import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PD_BASE } from '../courses/registry';
import { pdHome } from '../content/pd';
import { useToc } from '../lib/toc';
import HtmlContent from '../components/HtmlContent';
import Sections from '../components/Sections';
import SectionCapsule from '../components/SectionCapsule';
import { scrollToId } from '../lib/scroll';
import { useScrollSpy } from '../lib/scrollspy';
import { decodeEntities } from '../lib/text';

/** 「程序设计基础」课程总目录页：章节脉络速查 */
export default function PdHomePage() {
  const navigate = useNavigate();
  const toc = useToc();
  const [params] = useSearchParams();
  const section = params.get('s');
  const pageRef = useRef<HTMLDivElement>(null);

  const jump = (id: string) => {
    scrollToId(id);
    toc.setActive(id);
    navigate(`${PD_BASE}/?s=${id}`, { replace: true });
  };

  useEffect(() => {
    toc.report(pdHome.toc, jump);
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
      <h1>{decodeEntities(pdHome.title)}</h1>
      <div className="lede">
        <HtmlContent html={pdHome.lede} />
      </div>
      <Sections sections={pdHome.sections} />
      <SectionCapsule />
    </div>
  );
}
