import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SA_BASE } from '../courses/registry';
import { saHome } from '../content/sa';
import { useToc } from '../lib/toc';
import HtmlContent from '../components/HtmlContent';
import Sections from '../components/Sections';
import SectionCapsule from '../components/SectionCapsule';
import { scrollToId } from '../lib/scroll';
import { useScrollSpy } from '../lib/scrollspy';
import { decodeEntities } from '../lib/text';

/** 「软件体系结构」课程总目录页：章节脉络速查 */
export default function SaHomePage() {
  const navigate = useNavigate();
  const toc = useToc();
  const [params] = useSearchParams();
  const section = params.get('s');
  const pageRef = useRef<HTMLDivElement>(null);

  const jump = (id: string) => {
    scrollToId(id);
    toc.setActive(id);
    navigate(`${SA_BASE}/?s=${id}`, { replace: true });
  };

  useEffect(() => {
    toc.report(saHome.toc, jump);
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
      <h1>{decodeEntities(saHome.title)}</h1>
      <div className="lede">
        <HtmlContent html={saHome.lede} />
      </div>
      <Sections sections={saHome.sections} />
      <SectionCapsule />
    </div>
  );
}
