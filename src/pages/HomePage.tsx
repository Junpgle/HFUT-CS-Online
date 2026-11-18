import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ALGO_BASE } from '../courses/registry';
import { homeData } from '../content';
import { useToc } from '../lib/toc';
import { decodeEntities } from '../lib/text';
import HtmlContent from '../components/HtmlContent';
import Sections from '../components/Sections';
import SectionCapsule from '../components/SectionCapsule';
import { scrollToId } from '../lib/scroll';
import { useScrollSpy } from '../lib/scrollspy';
import { IconArrowRight, IconBook, IconCode } from '../components/icons';

/** 目录页顶部的站外资源卡片（原顶栏图标入口迁到这里） */
const EXT_CARDS = [
  {
    href: 'https://www.hello-algo.com/chapter_hello_algo/',
    icon: IconBook,
    title: 'Hello 算法',
    desc: '动画图解、一键运行的图解算法教程，适合数据结构入门与快速回顾',
  },
  {
    href: 'https://books.halfrost.com/leetcode/',
    icon: IconCode,
    title: 'LeetCode 笔记',
    desc: 'halfrost 的题解全书，按专题分类的刷题笔记与多语言实现',
  },
] as const;

function ExtCards() {
  return (
    <nav className="ext-cards" aria-label="站外学习资源">
      {EXT_CARDS.map(({ href, icon: Icon, title, desc }) => (
        <a key={href} className="ext-card" href={href} target="_blank" rel="noreferrer">
          <span className="ext-card-icon">
            <Icon size={18} />
          </span>
          <span className="ext-card-body">
            <span className="ext-card-title">{title}</span>
            <span className="ext-card-desc">{desc}</span>
          </span>
          <IconArrowRight size={15} className="ext-card-arrow" />
        </a>
      ))}
    </nav>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const toc = useToc();
  const [params] = useSearchParams();
  const section = params.get('s');
  const pageRef = useRef<HTMLDivElement>(null);

  const jump = (id: string) => {
    scrollToId(id);
    toc.setActive(id);
    navigate(`${ALGO_BASE}/?s=${id}`, { replace: true });
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

  // 精准 scroll-spy：与侧栏目录一一对应
  useScrollSpy(pageRef, []);

  useEffect(() => {
    if (!section) return;
    const t = window.setTimeout(() => scrollToId(section), 80);
    return () => window.clearTimeout(t);
  }, [section]);

  return (
    <div className="page" ref={pageRef}>
      <h1>{decodeEntities(homeData.title)}</h1>
      <div className="lede">
        <HtmlContent html={homeData.lede} />
      </div>
      <ExtCards />
      <Sections sections={homeData.sections} />
      <SectionCapsule />
    </div>
  );
}
