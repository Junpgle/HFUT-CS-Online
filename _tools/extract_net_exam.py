# -*- coding: utf-8 -*-
"""提取计算机网络试题 PDF/DOCX 的文本。
用法：python -I _tools/extract_net_exam.py <文件路径> <输出 txt 路径>
"""
import sys

def pdf(path, out):
    import pymupdf
    doc = pymupdf.open(path)
    out.append(f'# {path}\n共 {len(doc)} 页\n')
    for i, page in enumerate(doc, 1):
        out.append(f'\n===== 第 {i} 页 =====')
        out.append(page.get_text('text').strip())

def docx(path, out):
    import docx as docxmod
    d = docxmod.Document(path)
    out.append(f'# {path}\n')
    for para in d.paragraphs:
        t = para.text.strip()
        if t:
            out.append(t)
    for tbl in d.tables:
        out.append('[TABLE]')
        for row in tbl.rows:
            out.append(' | '.join(c.text.strip().replace('\n', ' ') for c in row.cells))
        out.append('[/TABLE]')

def main():
    src, dst = sys.argv[1], sys.argv[2]
    out = []
    if src.lower().endswith('.pdf'):
        pdf(src, out)
    else:
        docx(src, out)
    with open(dst, 'w', encoding='utf-8') as f:
        f.write('\n'.join(out))
    print(f'OK -> {dst}')

if __name__ == '__main__':
    main()
