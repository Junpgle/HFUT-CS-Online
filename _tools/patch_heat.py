import io, re

# 8 个答题页：pq-heatblock 由 <details> 折叠改为 <div> 直显（无「热力图」标签、不可折叠）
FILES = [
    'src/pages/PracticePage.tsx',
    'src/pages/CaPaperPage.tsx',
    'src/pages/OsPaperPage.tsx',
    'src/pages/MathPaperPage.tsx',
    'src/pages/phys/PracticePaper.tsx',
    'src/pages/net/NetPracticePaperPage.tsx',
    'src/pages/ai/AiPracticePage.tsx',
    'src/pages/pat/Practice.tsx',
]

STATE_LINE_RE = re.compile(
    r'\n(?:\s*//[^\n]*热力图折叠态[^\n]*\n)?\s*const \[heatOpen, setHeatOpen\] = useState\([^\n]*\);'
)
DETAILS_RE = re.compile(
    r'<details className="pq-heatblock"(?: open=\{heatOpen\} onToggle=\{\(e\) => setHeatOpen\(\(e\.target as HTMLDetailsElement\)\.open\)\})?(?: open)?>\n'
    r'(\s*)<summary className="pq-heat-sum">热力图</summary>\n'
)

for p in FILES:
    s = io.open(p, encoding='utf-8').read()

    # 已处理过的文件跳过（幂等）
    if '<div className="pq-heatblock">' in s:
        print(f'{p}: already done')
        continue

    # 1) 去 heatOpen 状态（含可选注释行）
    s, n_state = STATE_LINE_RE.subn('', s)

    # 2) details+summary → div
    s, n_details = DETAILS_RE.subn('<div className="pq-heatblock">\n', s)

    # 3) 配套闭合标签：pq-heatblock 之后第一个 </details> → </div>
    n_close = 0
    idx = s.find('<div className="pq-heatblock">')
    if idx >= 0:
        end = s.find('</details>', idx)
        assert end >= 0, p
        s = s[:end] + '</div>' + s[end + len('</details>'):]
        n_close = 1

    # 4) 杂散注释清理
    s = s.replace('          {/* 收进 details：窄屏默认收起，首屏以题目为主角 */}\n', '')

    assert n_details == 1 and n_close == 1, (p, n_state, n_details, n_close)
    assert 'heatOpen' not in s and 'pq-heat-sum' not in s, p
    io.open(p, 'w', encoding='utf-8', newline='').write(s)
    print(f'{p}: state={n_state} details={n_details} close={n_close}')
