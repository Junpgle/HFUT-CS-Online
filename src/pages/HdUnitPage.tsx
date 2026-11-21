import { useEffect, useRef } from 'react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { HD_BASE } from '../courses/registry';
import { hdUnits } from '../content/hd';
import { useToc } from '../lib/toc';
import { decodeEntities } from '../lib/text';
import HtmlContent from '../components/HtmlContent';
import Sections from '../components/Sections';
import SectionCapsule from '../components/SectionCapsule';
import { scrollToId } from '../lib/scroll';
import { useScrollSpy } from '../lib/scrollspy';

/** 「系统硬件综合设计」讲次页：/hd/deck/hdN */
export default function HdUnitPage() {
  const { deckId } = useParams();
  const unit = hdUnits.find((d) => d.id === deckId);
  if (!unit) return <Navigate to={HD_BASE} replace />;
  return <HdUnitInner key={unit.id} unit={unit} />;
}

function HdUnitInner({ unit }: { unit: (typeof hdUnits)[number] }) {
  const navigate = useNavigate();
  const toc = useToc();
  const [params] = useSearchParams();
  const section = params.get('s');
  const pageRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const jump = (id: string) => {
    scrollToId(id);
    toc.setActive(id);
    navigate(`${HD_BASE}/deck/${unit.id}?s=${id}`, { replace: true });
  };

  useEffect(() => {
    toc.report(unit.toc, jump);
    return () => toc.report([], () => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit.id]);

  useEffect(() => {
    if (!section) return;
    const t = window.setTimeout(() => scrollToId(section, firstRender.current), 80);
    firstRender.current = false;
    return () => window.clearTimeout(t);
  }, [section]);

  useScrollSpy(pageRef, [unit.id]);

  const level2 = unit.toc.filter((e) => e.level === 2);

  return (
    <div className="page" ref={pageRef} data-deck={unit.id}>
      <h1>{decodeEntities(unit.title)}</h1>
      <div className="lede">
        <HtmlContent html={unit.lede} />
      </div>
      {level2.length > 1 && (
        <nav className="topic-map" aria-label="本讲知识点导航">
          <span className="topic-map-label">本讲脉络</span>
          {level2.map((e) => (
            <button key={e.id} type="button" className="topic-chip" onClick={() => jump(e.id)}>
              {decodeEntities(e.text)}
            </button>
          ))}
        </nav>
      )}
      <Sections sections={unit.sections} />
      <SectionCapsule />
    </div>
  );
}
