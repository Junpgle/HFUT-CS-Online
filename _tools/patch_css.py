import io

p = 'src/styles/base.css'
s = io.open(p, encoding='utf-8').read()

start = '/* ========================= 课程附件页：左目录树 + 右预览 ========================= */'
end = '/* --------------------- 练习列表：每卷卡内独立进度条（替代整课总进度条） --------------------- */'
i = s.index(start)
j = s.index(end)
new_block = '''/* ========================= 课程附件页：分类列表 + 仓库一键下载 ========================= */
.att-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.att-cat {
  background: var(--panel-strong);
  border: 1px solid var(--hairline-soft);
  border-radius: var(--r-l);
  box-shadow: var(--shadow-1);
  overflow: hidden;
}
.att-cat-h {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 12px 16px 10px;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--deck-accent);
  border-bottom: 1px solid var(--hairline-soft);
}
.att-cat-count {
  font-size: 0.6875rem;
  color: var(--ink-3);
}
.att-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
}
.att-row + .att-row {
  border-top: 1px solid var(--hairline-soft);
}
.att-row-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.att-row-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 140ms;
}
.att-row:hover .att-row-name {
  color: var(--deck-accent);
}
.att-row-path {
  font-size: 0.7188rem;
  color: var(--ink-3);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.att-dl {
  flex-shrink: 0;
}
.att-state {
  padding: 32px 24px;
  color: var(--ink-3);
  text-align: center;
}
@media (max-width: 640px) {
  .att-row {
    flex-wrap: wrap;
    gap: 8px;
  }
  .att-dl {
    margin-left: auto;
  }
}
'''
s = s[:i] + new_block + s[j:]
io.open(p, 'w', encoding='utf-8', newline='').write(s)
print('css replaced')
