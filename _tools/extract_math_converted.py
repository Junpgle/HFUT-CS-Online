# 提取转换后的 pptx/docx 文本到 _audit/math_extract/。
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from pathlib import Path
from pptx import Presentation
from docx import Document

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / '_audit' / 'math_converted'
OUT = ROOT / '_audit' / 'math_extract'
OUT.mkdir(parents=True, exist_ok=True)

def clean(s):
    return '\n'.join(x.rstrip() for x in s.replace('\r','').splitlines()).strip()

for path in sorted(SRC.glob('*.pptx')):
    prs = Presentation(path)
    parts = [f'===== {path.name} | {len(prs.slides)} 页 =====']
    for i, slide in enumerate(prs.slides, 1):
        lines = []
        for shape in slide.shapes:
            if shape.has_text_frame:
                for para in shape.text_frame.paragraphs:
                    t = clean(''.join(r.text for r in para.runs))
                    if t: lines.append(t)
            if shape.has_table:
                for row in shape.table.rows:
                    lines.append(' | '.join(clean(c.text) for c in row.cells))
        parts.append(f'--- slide{i} ---\n' + '\n'.join(lines))
    (OUT / ('pptx_' + path.stem + '.txt')).write_text('\n\n'.join(parts), encoding='utf-8')
    print(f'pptx: {path.name} -> {len(prs.slides)} 页')

for path in sorted(SRC.glob('*.docx')):
    doc = Document(path)
    parts = [f'===== {path.name} =====']
    for i, para in enumerate(doc.paragraphs, 1):
        t = clean(para.text)
        if t: parts.append(f'p{i}: {t}')
    for ti, tbl in enumerate(doc.tables, 1):
        parts.append(f'--- table{ti} ---')
        for row in tbl.rows:
            parts.append(' | '.join(clean(c.text) for c in row.cells))
    (OUT / ('doc_' + path.stem + '.txt')).write_text('\n\n'.join(parts), encoding='utf-8')
    print(f'docx: {path.name}')
print('done')
