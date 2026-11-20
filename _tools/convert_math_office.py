# 将高等数学资料中的旧版 .ppt / .doc 转为 .pptx / .docx（写入 _audit/math_converted），
# 以便用 python-pptx / python-docx 提取文本。仅供内容整理，产物不入库。
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from pathlib import Path
import win32com.client as win32

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'data' / '大一上' / '高等数学'
OUT = ROOT / '_audit' / 'math_converted'
OUT.mkdir(parents=True, exist_ok=True)

def convert(files, appname, fmt, ext):
    if not files:
        return
    app = win32.DispatchEx(appname)
    try:
        if appname.startswith('Word'):
            app.Visible = False
            app.DisplayAlerts = 0
        for p in files:
            dest = OUT / (p.stem.replace(' ', '_') + ext)
            if dest.exists():
                continue
            try:
                d = app.Documents.Open(str(p), ReadOnly=True) if appname.startswith('Word') else app.Presentations.Open(str(p), WithWindow=False)
                d.SaveAs(str(dest), FileFormat=fmt)
                d.Close()
                print(f'converted: {p.name} -> {dest.name}')
            except Exception as e:
                print(f'FAILED: {p.name} :: {e}')
    finally:
        app.Quit()

ppt = sorted((SRC / '课件').rglob('*.ppt'))
doc = sorted((SRC / '试题').rglob('*.doc')) + sorted((SRC / '附件' / '期末').rglob('*.doc'))
convert(ppt, 'PowerPoint.Application', 24, '.pptx')  # ppSaveAsOpenXMLPresentation
convert(doc, 'Word.Application', 16, '.docx')        # wdFormatXMLDocument
print('done ->', OUT)
