import { useEffect, type RefObject } from 'react';
import { useReducedMotion } from 'motion/react';
import { useToc } from './toc';

/** 滚动跨节时右上角短暂浮现当前大节名（wayfinding，单例 DOM） */
let flashEl: HTMLDivElement | null = null;
let lastSectionKey: string | null = null;

function flashSection(h2: HTMLElement) {
  if (!flashEl) {
    flashEl = document.createElement('div');
    flashEl.className = 'sec-flash';
    document.body.appendChild(flashEl);
  }
  // h2 由「编号 span + 标题 span」组成，直接 textContent 会连在一起，补回点号分隔
  const no = h2.querySelector('.h2-no')?.textContent;
  const title = h2.querySelector('.h2-title')?.textContent ?? h2.textContent ?? '';
  flashEl.textContent = no ? `${no}. ${title}` : title;
  flashEl.classList.remove('show');
  void flashEl.offsetWidth; // 重启动画
  flashEl.classList.add('show');
}

/**
 * 精准 scroll-spy：按「最后一个滚过阈值线的标题」判定当前小节，
 * 保证侧栏指示器与右侧内容一一对应（含没有二级目录的一级标题）。
 * 阈值与 h2 的 scroll-margin-top 对齐，跳转落点即高亮点。
 * 跨大节（h2 变化）时右上角浮出节名，提供长页阅读的位置感。
 */
export function useScrollSpy(rootRef: RefObject<HTMLElement | null>, deps: unknown[] = []) {
  const { setActive } = useToc();
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const heads = Array.from(root.querySelectorAll<HTMLElement>('h2[id], h3[id]'));
    if (heads.length === 0) return;
    lastSectionKey = null; // 换页后首帧不浮标

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

      // 跨大节检测：当前小节所属 section 的 h2
      if (best) {
        const h2 = best.closest('section')?.querySelector<HTMLElement>(':scope > h2');
        const key = h2?.id ?? '';
        if (key && key !== lastSectionKey) {
          const changed = lastSectionKey !== null;
          lastSectionKey = key;
          if (changed && h2) flashSection(h2);
        }
      }
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
      lastSectionKey = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps.concat(reduced));
}
