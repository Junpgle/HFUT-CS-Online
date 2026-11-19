# 提取「程序设计艺术与方法」课件/试题 PDF 文本，供整理成前端页面用。
# 用法: python -I _tools/extract_pat.py  → 输出到 _tools/pat_out/
import os

try:
    from pypdf import PdfReader
except ImportError:
    from PyPDF2 import PdfReader

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(BASE, 'data', '大二上', '程序设计艺术与方法')
OUT = os.path.join(BASE, '_tools', 'pat_out')
os.makedirs(OUT, exist_ok=True)

FILES = {
    'lec1-stl.txt': '附件/PPT/第一讲/第一讲STL简介.pdf',
    'lec2-search.txt': '附件/PPT/第二讲搜索专题.pdf',
    'lec3-geo.txt': '附件/PPT/第三讲计算几何.pdf',
    'icpc-2019.txt': '课件/讲义与竞赛/ICPC讲义-2019.pdf',
    'exam-2019.txt': '试题/小组作业/2019年省赛试题.pdf',
}

for name, rel in FILES.items():
    r = PdfReader(os.path.join(DATA, rel))
    parts = []
    for i, page in enumerate(r.pages, 1):
        text = page.extract_text() or ''
        parts.append(f'===== p{i} =====\n{text}')
    with open(os.path.join(OUT, name), 'w', encoding='utf-8') as f:
        f.write('\n'.join(parts))
    print(name, len(r.pages), 'pages ->', len('\n'.join(parts)), 'chars')
