# 提取「高等数学」课程资料文本：课件 pptx 逐页文本 / PDF 版课件逐页文本 / 试题 PDF 全文。
# 产物写入 _audit/math_extract/（不入库），供网页内容整理与核对。
# 用法：C:/Users/icepa/AppData/Local/Programs/Python/Python312/python.exe _tools/extract_math.py
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'data' / '大一上' / '高等数学'
OUT = ROOT / '_audit' / 'math_extract'
OUT.mkdir(parents=True, exist_ok=True)

import pymupdf
from pptx import Presentation

def clean(s: str) -> str:
    return '\n'.join(line.rstrip() for line in s.replace('\r', '').splitlines()).strip()

# 课件 PPTX（PPT-2 主系列）
for path in sorted((SRC / '课件').rglob('*.pptx')):
    safe = path.stem.replace(' ', '_').replace('/', '_')
    prs = Presentation(path)
    parts = [f'===== {path.relative_to(SRC)} | {len(prs.slides)} 页 =====']
    for i, slide in enumerate(prs.slides, 1):
        lines = []
        for shape in slide.shapes:
            if shape.has_text_frame:
                for para in shape.text_frame.paragraphs:
                    t = clean(''.join(r.text for r in para.runs))
                    if t:
                        lines.append(t)
            if shape.has_table:
                for row in shape.table.rows:
                    lines.append(' | '.join(clean(c.text) for c in row.cells))
        parts.append(f'--- slide{i} ---\n' + '\n'.join(lines))
    (OUT / f'pptx_{safe}.txt').write_text('\n\n'.join(parts), encoding='utf-8')
    print(f'pptx: {path.name} -> {len(prs.slides)} 页')

# 附件/PPT-1 的 PDF 版课件 + 试题里的 PDF
for pdf in sorted((SRC / '附件' / 'PPT-1').glob('*.pdf')) + sorted((SRC / '试题').rglob('*.pdf')):
    rel = pdf.relative_to(SRC)
    tag = ('pdf_' if '附件' in rel.parts else 'exam_') + pdf.stem.replace(' ', '_')
    doc = pymupdf.open(pdf)
    parts = [f'===== {rel} | {doc.page_count} 页 =====']
    for i, page in enumerate(doc, 1):
        parts.append(f'--- p{i} ---\n' + clean(page.get_text('text')))
    doc.close()
    (OUT / f'{tag}.txt').write_text('\n\n'.join(parts), encoding='utf-8')
    print(f'pdf: {pdf.name} -> {tag}.txt')

print('done ->', OUT)
