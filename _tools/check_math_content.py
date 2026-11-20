# 高等数学内容静态核查：目录 id 与 section id 对齐、标签 id 合法、公式写法无 LaTeX 残留。
import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
D = ROOT / 'src' / 'content' / 'math'

# 从 sections.ts 读取 manifest
manifest = (D / 'sections.ts').read_text(encoding='utf-8')
valid_secs = set(re.findall(r"'(sec-ch\d+-[a-z0-9-]+)'", manifest))

issues = []
for p in sorted(D.glob('ch*.ts')):
    s = p.read_text(encoding='utf-8')
    toc = re.findall(r"\{\s*id:\s*'(sec-[^']+)'", s.split('toc:')[1].split('sections:')[0]) if 'toc:' in s else []
    secs = re.findall(r"^\s*id:\s*'(sec-[^']+)'", s, re.M)
    secs = [x for x in secs if x in valid_secs]
    if toc != secs:
        issues.append(f'{p.name}: toc {toc} != sections {secs}')
    unknown = [x for x in secs if x not in valid_secs]
    if unknown:
        issues.append(f'{p.name}: unknown section ids {unknown}')
    for pat in [r'\$\$', r'\\frac', r'\\int', r'\\begin', r'katex']:
        if re.search(pat, s, re.I):
            issues.append(f'{p.name}: LaTeX-like pattern {pat}')
    print(f'{p.name}: {len(secs)} sections, {len(s.splitlines())} lines')

for p in sorted(D.glob('papers-*.ts')):
    s = p.read_text(encoding='utf-8')
    used = set(re.findall(r"mathTag\((\d+),\s*'(sec-[^']+)'", s))
    bad = [(d, sec) for d, sec in used if sec not in valid_secs or f"sec-ch{d}-" not in sec]
    if bad:
        issues.append(f'{p.name}: invalid tags {sorted(bad)}')
    print(f'{p.name}: {len(used)} distinct tags, {len(s.splitlines())} lines')

print('\nISSUES:', len(issues))
for i in issues:
    print(' -', i)
