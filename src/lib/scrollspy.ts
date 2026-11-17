import { useEffect, type RefObject } from 'react';
import { useToc } from './toc';

/**
 * 精准 scroll-spy：按「最后一个滚过阈值线的标题」判定当前小节，
 * 保证侧栏指示器与右侧内容一一对应（含没有二级目录的一级标题）。
 * 阈值与 h2 的 scroll-margin-top 对齐，跳转落点即高亮点。
 */
export function useScrollSpy(rootRef: RefObject<HTMLElement | null>, deps: unknown[] = []) {
  const { setActive } = useToc();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const heads = Array.from(root.querySelectorAll<HTMLElement>('h2[id], h3[id]'));
    if (heads.length === 0) return;

    let raf = 0;
    const compute = () => {
      raf = 0;
      const topbar = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--topbar-h')) || 52;
      const threshold = topbar + 28;
      let best: HTMLElement | null = null;
      for (const h of heads) {
        // 标题按 DOM 序排列，滚过阈值线的最后一个即当前小节
        if (h.getBoundingClientRect().top <= threshold) best = h;
        else break;
      }
      setActive(best ? best.id : null);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    compute();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
