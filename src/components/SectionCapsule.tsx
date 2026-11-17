import { useToc } from '../lib/toc';
import { IconChevronDown, IconChevronUp } from './icons';

/**
 * 章节导航胶囊（右下角悬浮）：回顶 / 上一节 / 下一节。
 * 依据 scroll-spy 的 activeId 计算相邻节；目录为空的页面不渲染。
 */
export default function SectionCapsule() {
  const { toc, activeId, jump } = useToc();
  if (toc.length === 0 || !jump) return null;

  const idx = toc.findIndex((t) => t.id === activeId);
  const prev = idx > 0 ? toc[idx - 1] : null;
  const next = idx === -1 ? toc[0] : idx < toc.length - 1 ? toc[idx + 1] : null;

  return (
    <div className="section-capsule" role="navigation" aria-label="章节导航">
      <button
        type="button"
        className="cap-btn"
        aria-label="回到本页顶部"
        title="回到顶部"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <IconChevronUp size={16} />
      </button>
      <button
        type="button"
        className="cap-btn"
        disabled={!prev}
        aria-label={prev ? `上一节：${prev.text}` : '已是第一节'}
        title={prev ? `上一节：${prev.text}` : '已是第一节'}
        onClick={() => prev && jump(prev.id)}
      >
        <IconChevronUp size={15} style={{ transform: 'rotate(-90deg)' }} />
      </button>
      <button
        type="button"
        className="cap-btn"
        disabled={!next}
        aria-label={next ? `下一节：${next.text}` : '已是最后一节'}
        title={next ? `下一节：${next.text}` : '已是最后一节'}
        onClick={() => next && jump(next.id)}
      >
        <IconChevronDown size={15} style={{ transform: 'rotate(-90deg)' }} />
      </button>
    </div>
  );
}
