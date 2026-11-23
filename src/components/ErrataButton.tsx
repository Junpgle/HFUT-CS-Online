import { useErrata } from '../lib/errata/context';
import { IconPencil } from './icons';

/** 顶栏勘误入口：点一下进入编辑模式，再点退出（改动保留在底部胶囊里） */
export default function ErrataButton() {
  const { active, count, enter, exit } = useErrata();
  return (
    <button
      type="button"
      className={`account-btn errata-trigger${active ? ' active' : ''}`}
      onClick={active ? exit : enter}
      aria-pressed={active}
      title={active ? '退出勘误模式（Esc）' : '勘误：点击正文直接修改'}
    >
      <IconPencil size={16} />
      <span className="errata-label">{active ? '完成' : '勘误'}</span>
      {count > 0 && (
        <span className="errata-count" aria-label={`${count} 处修改`}>
          {count}
        </span>
      )}
    </button>
  );
}
