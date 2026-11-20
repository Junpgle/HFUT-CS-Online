# 检查高等数学内容 TS 里的 HTML 模板片段是否结构良好（标签闭合/转义）。
import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from pathlib import Path
from lxml import etree

ROOT = Path(__file__).resolve().parent.parent
D = ROOT / 'src' / 'content' / 'math'
issues = []

for p in sorted(D.glob('*.ts')):
    s = p.read_text(encoding='utf-8')
    blocks = re.findall(r'`([\s\S]*?)`', s)
    for i, b in enumerate(blocks):
        # TS 插值先替换成占位文本，避免误判
        b = re.sub(r'\$\{[^}]*\}', 'X', b)
        if not b.strip():
            continue
        try:
            frags = etree.HTMLParser(recover=False)
            etree.fromstring('<div>' + b + '</div>', frags)
        except etree.XMLSyntaxError as e:
            snippet = re.sub(r'\s+', ' ', b)[:160]
            issues.append(f'{p.name} block#{i}: {str(e).splitlines()[0]} | {snippet}')
    print(f'{p.name}: {len(blocks)} template blocks checked')

print('\nISSUES:', len(issues))
for i in issues[:40]:
    print(' -', i)
