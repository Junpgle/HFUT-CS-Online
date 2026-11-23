interface Props {
  active: boolean;
  count: number;
  hidden: boolean;
  onEnter: () => void;
  onExit: () => void;
  onSubmit: () => void;
}

/** 编辑态 / 有待提交改动时，底部居中的进度胶囊（避开右侧章节导航与置顶按钮） */
export default function ErrataDock({ active, count, hidden, onEnter, onExit, onSubmit }: Props) {
  if (hidden || (!active && count === 0)) return null;
  return (
    <div className="errata-dock errata-ui" role="region" aria-label="勘误">
      <span className="errata-dock-state">
        {active ? (
          count > 0 ? (
            <>
              已改 <b>{count}</b> 处
            </>
          ) : (
            '点击正文即可修改'
          )
        ) : (
          <>
            待提交 <b>{count}</b> 处
          </>
        )}
      </span>
      {active ? (
        <button type="button" className="btn" onClick={onExit}>
          退出
        </button>
      ) : (
        <button type="button" className="btn" onClick={onEnter}>
          继续编辑
        </button>
      )}
      <button type="button" className="btn primary" onClick={onSubmit} disabled={count === 0}>
        提交勘误
      </button>
    </div>
  );
}
