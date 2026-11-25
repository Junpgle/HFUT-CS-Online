// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DsCourse from '../courses/DsCourse';
import { ErrataProvider } from '../lib/errata/context';
import { TocProvider } from '../lib/toc';

beforeEach(() => {
  // jsdom 没有 ResizeObserver / matchMedia：侧栏溢出检测与平滑滚动会用到
  vi.stubGlobal('ResizeObserver', class {
    observe() {}
    unobserve() {}
    disconnect() {}
  });
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }));
  Element.prototype.scrollTo = () => {};
  Element.prototype.scrollIntoView = () => {};
  window.scrollTo = (() => {}) as typeof window.scrollTo;
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

// 真实站点里 DsCourse 挂在 /ds/* 下，CourseShell 的内层路由依赖这个 basename
const show = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <TocProvider>
        <ErrataProvider>
          <Routes>
            <Route path="/ds/*" element={<DsCourse />} />
          </Routes>
        </ErrataProvider>
      </TocProvider>
    </MemoryRouter>,
  );

describe('数据结构 · 可视化页', () => {
  it('导航栏在「在线练习」左侧出现可视化，且首页不再挂学习资源链接', () => {
    const view = show('/ds');
    const tabs = [...view.container.querySelectorAll('.deck-tabs .deck-tab')].map((x) => x.textContent ?? '');
    const labels = tabs.filter((t) => t.includes('可视化') || t.includes('练习'));
    expect(labels.map((t) => (t.includes('可视化') ? '可视化' : '练习'))).toEqual(['可视化', '练习']);
    expect(view.container.textContent).not.toContain('交互学习资源');
  });

  it('可视化页直接渲染模拟器，并提供原始网页与 PDF 指南按钮', () => {
    const view = show('/ds/visual');
    expect(view.container.querySelector('.page-visual h1')?.textContent).toBe('可视化');

    const host = view.container.querySelector('[aria-label="数据结构算法可视化交互模拟器"]') as HTMLElement | null;
    expect(host).not.toBeNull();
    expect(host!.shadowRoot).not.toBeNull();
    expect(host!.shadowRoot!.querySelectorAll('.algoBtn').length).toBe(69);

    const hrefs = [...view.container.querySelectorAll('.visual-actions a')].map((a) => a.getAttribute('href') ?? '');
    expect(hrefs.some((h) => h.includes('softer-16.github.io/data-structure-simulator'))).toBe(true);
    expect(hrefs.some((h) => h.endsWith('数据结构可视化模拟器使用指南.pdf'))).toBe(true);
  });
});
