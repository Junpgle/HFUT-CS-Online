# 提取「操作系统」课程资料文本：课件 PDF / PPTX → 逐页文本；试题 docx → 全文。
# 产物写入 _audit/os_extract/（该目录不入库），供人工核对与网页内容整理。
# 用法：python _tools/extract_os.py
import sys, io, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'data' / '大三上' / '操作系统'
OUT = ROOT / '_audit' / 'os_extract'
OUT.mkdir(parents=True, exist_ok=True)

import pymupdf
from docx import Document
from pptx import Presentation

# 课件：按章 PDF（课件/ 与 附件/ 合并覆盖 1~7 章）+ 复习 pptx
PDFS = [
    (SRC / '课件' / 'PPT-按章' / '第1章 操作系统引论.pdf', 'ch1'),
    (SRC / '附件' / 'PPT-按章' / '2-进程管理.pdf', 'ch2'),
    (SRC / '附件' / 'PPT-按章' / '3-1处理机进程调度(操作系统).pdf', 'ch3-1'),
    (SRC / '附件' / 'PPT-按章' / '3-2处理机进程死锁(操作系统).pdf', 'ch3-2'),
    (SRC / '课件' / 'PPT-按章' / '第4章 存储管理.pdf', 'ch4'),
    (SRC / '课件' / 'PPT-按章' / '第5章 设备管理.pdf', 'ch5'),
    (SRC / '课件' / 'PPT-按章' / '第6章 文件管理.pdf', 'ch6'),
    (SRC / '课件' / 'PPT-按章' / '第7章 操作系统接口.pdf', 'ch7'),
]

for pdf, tag in PDFS:
    doc = pymupdf.open(pdf)
    parts = [f'===== {pdf.name} | {doc.page_count} 页 =====']
    for i, page in enumerate(doc, 1):
        text = page.get_text('text').strip()
        parts.append(f'--- p{i} ---\n{text}')
    doc.close()
    (OUT / f'{tag}.txt').write_text('\n\n'.join(parts), encoding='utf-8')
    print(f'{tag}: {pdf.name} -> {len(parts)-1} 页')

# 复习资料 pptx
pptx_path = SRC / '课件' / '复习资料' / '操作系统原理课件.pptx'
prs = Presentation(pptx_path)
parts = [f'===== {pptx_path.name} | {len(prs.slides)} 页 =====']
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
(OUT / 'review-pptx.txt').write_text('\n\n'.join(parts), encoding='utf-8')
print(f'review-pptx: {len(prs.slides)} 页')

# 试题 docx（含答案）
DOCX = [
    SRC / '试题' / '2022年合肥工业大学(宣城校区)计算机科学与技术专业《操作系统》科目期末试卷A(有答案).docx',
    SRC / '试题' / '2022年合肥工业大学计算机科学与技术专业《操作系统》科目期末试卷B(有答案).docx',
]
for path in DOCX:
    d = Document(path)
    lines = []
    for para in d.paragraphs:
        t = para.text.strip()
        if t:
            lines.append(t)
    for tbl in d.tables:
        lines.append('[表格]')
        for row in tbl.rows:
            lines.append(' | '.join(c.text.strip() for c in row.cells))
    name = path.name.replace('/', '_')
    (OUT / f'exam-{name}.txt').write_text('\n'.join(lines), encoding='utf-8')
    print(f'exam: {path.name} -> {len(lines)} 行')
print('done ->', OUT)
