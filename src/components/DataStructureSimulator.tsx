import { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { mountSimulator } from './data-structure/runtime.js';
import template from './data-structure/template.html?raw';
import styles from './data-structure/simulator.css?raw';

export default function DataStructureSimulator() {
  const host = useRef<HTMLDivElement>(null);
  const { algorithmId } = useParams();

  useEffect(() => {
    document.documentElement.dataset.deck = 'ds';
    const root = host.current!.shadowRoot ?? host.current!.attachShadow({ mode: 'open' });
    root.innerHTML = `<style>${styles}</style>${template}`;
    const stop = mountSimulator(root, algorithmId);
    return () => {
      stop();
      delete document.documentElement.dataset.deck;
      root.replaceChildren();
    };
  }, [algorithmId]);

  return (
    <>
      <header className="hub-topbar">
        <nav className="hub-topbar-right" aria-label="数据结构模拟器导航">
          <Link className="hub-toplink" to="/ds">数据结构课程</Link>
          <a className="hub-toplink" href={`${import.meta.env.BASE_URL}guides/data-structure/数据结构可视化模拟器使用指南.pdf`} target="_blank" rel="noreferrer">使用指南</a>
          <a className="hub-toplink" href="https://github.com/softer-16/data-structure-simulator" target="_blank" rel="noreferrer">Cynthia Wang · 来源</a>
          <ThemeToggle />
        </nav>
      </header>
      <div ref={host} aria-label="数据结构算法可视化交互模拟器" />
    </>
  );
}
