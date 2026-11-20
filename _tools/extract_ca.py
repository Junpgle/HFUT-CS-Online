# 提取「计算机体系结构」课程资料文本：课件 pptx / 教材章节 PDF → 逐页文本；试题 PDF → 全文。
# 产物写入 _audit/ca_extract/（该目录不入库），供人工核对与网页内容整理。
# 用法：python _tools/extract_ca.py
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'data' / '大三上' / '计算机体系结构'
OUT = ROOT / '_audit' / 'ca_extract'
OUT.mkdir(parents=True, exist_ok=True)

import pymupdf
from pptx import Presentation

# 课件主系列：编号 pptx（02～14）
PPTX_FILES = sorted((SRC / '课件').glob('*.pptx'))
for path in PPTX_FILES:
    tag = 'deck' + path.stem.split('-')[0]
    prs = Presentation(path)
    parts = [f'===== {path.name} | {len(prs.slides)} 页 =====']
    for i, slide in enumerate(prs.slides, 1):
        lines = []
        for shape in slide.shapes:
            if shape.has_text_frame:
                for para in shape.text_frame.paragraphs:
                    t = ''.join(run.text for run in para.runs).strip()
                    if t:
                        lines.append(t)
            if shape.has_table:
                for row in shape.table.rows:
                    lines.append(' | '.join(cell.text.strip() for cell in row.cells))
        parts.append(f'--- slide{i} ---\n' + '\n'.join(lines))
    (OUT / f'{tag}.txt').write_text('\n\n'.join(parts), encoding='utf-8')
    print(f'{tag}: {path.name} -> {len(prs.slides)} 页')

# 课件 PPT/ 子目录：教材配套章节 PDF（第一章～第八章）
for pdf in sorted((SRC / '课件' / 'PPT').glob('*.pdf')):
    tag = 'book-' + {'一': '1', '二': '2', '三': '3', '四': '4', '五': '5', '六': '6', '七': '7', '八': '8', '前': '0'}.get(pdf.stem.split('-')[-1][1], 'x')
    doc = pymupdf.open(pdf)
    parts = [f'===== {pdf.name} | {doc.page_count} 页 =====']
    n = doc.page_count
    for i, page in enumerate(doc, 1):
        text = page.get_text('text').strip()
        parts.append(f'--- p{i} ---\n{text}')
    doc.close()
    (OUT / f'{tag}.txt').write_text('\n\n'.join(parts), encoding='utf-8')
    print(f'{tag}: {pdf.name} -> {n} 页')

# 试题 PDF
for pdf in sorted((SRC / '试题').rglob('*.pdf')):
    name = 'exam-' + pdf.stem[:20].replace('/', '_')
    doc = pymupdf.open(pdf)
    n = doc.page_count
    parts = [f'===== {pdf.name} | {n} 页 =====']
    for i, page in enumerate(doc, 1):
        parts.append(f'--- p{i} ---\n' + page.get_text('text').strip())
    doc.close()
    (OUT / f'{name}.txt').write_text('\n\n'.join(parts), encoding='utf-8')
    print(f'exam: {pdf.name} -> {n} 页')

# 附件里的复习资料（供结构与措辞参照）
for md in sorted((SRC / '附件').glob('*.md')):
    (OUT / f'attach-{md.stem}.txt').write_text(md.read_text(encoding='utf-8'), encoding='utf-8')
    print(f'attach: {md.name}')
print('done ->', OUT)
