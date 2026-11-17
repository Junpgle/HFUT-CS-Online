import { IconChevronUp } from './icons';

/** 右下角悬浮胶囊：只保留回到本页顶部 */
export default function SectionCapsule() {
  return (
    <div className="section-capsule" role="navigation" aria-label="页面工具">
      <button
        type="button"
        className="cap-btn"
        aria-label="回到本页顶部"
        title="回到顶部"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <IconChevronUp size={16} />
      </button>
    </div>
  );
}
