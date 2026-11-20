# 把高等数学课件/试题统一转成 PDF 并渲染为带页码的缩略图拼版，便于逐页核对公式、图形与题目。
# 产物在 _audit/math_pages/（不入库）。
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from pathlib import Path
import win32com.client as win32
import pymupdf
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
COURSE = ROOT / 'data' / '大一上' / '高等数学'
CONV = ROOT / '_audit' / 'math_converted'
PDFDIR = ROOT / '_audit' / 'math_pdf'
PAGES = ROOT / '_audit' / 'math_pages'
for d in (PDFDIR, PAGES):
    d.mkdir(parents=True, exist_ok=True)

def safe(name):
    return name.replace(' ', '_').replace('/', '_').replace('：', '_')

def to_pdf(files, appname, fmt, tag):
    if not files: return
    app = win32.DispatchEx(appname)
    try:
        if appname.startswith('Word'):
            app.Visible = False
            app.DisplayAlerts = 0
        for p in files:
            dest = PDFDIR / (tag + '_' + safe(p.stem) + '.pdf')
            if dest.exists(): continue
            try:
                doc = app.Documents.Open(str(p), ReadOnly=True) if appname.startswith('Word') else app.Presentations.Open(str(p), WithWindow=False)
                doc.SaveAs(str(dest), FileFormat=fmt)
                doc.Close()
                print(f'pdf: {p.name}')
            except Exception as e:
                print(f'FAILED {p.name}: {e}')
    finally:
        app.Quit()

# 课件：原始 pptx + 由 ppt 转换来的 pptx
to_pdf(sorted((COURSE / '课件').rglob('*.pptx')), 'PowerPoint.Application', 32, 'deck')
to_pdf(sorted(CONV.glob('*.pptx')), 'PowerPoint.Application', 32, 'deck')

# 试题：原始 docx 与由 doc 转来的 docx
to_pdf(sorted((COURSE / '试题').rglob('*.docx')), 'Word.Application', 17, 'exam')
to_pdf(sorted(CONV.glob('*.docx')), 'Word.Application', 17, 'exam')
# 附件答案
to_pdf(sorted((COURSE / '附件' / '期末').rglob('*.docx')), 'Word.Application', 17, 'answer')

# 渲染拼版：每个 PDF → 若干张 sheet，每张最多 12 页（3 列 × 4 行），缩略图宽 420px
for pdf in sorted(PDFDIR.glob('*.pdf')):
    doc = pymupdf.open(pdf)
    base = safe(pdf.stem)
    per = 12
    font = ImageFont.truetype('C:/Windows/Fonts/arial.ttf', 18)
    for start in range(0, doc.page_count, per):
        pages = list(range(start, min(start + per, doc.page_count)))
        thumbs = []
        for i in pages:
            pix = doc[i].get_pixmap(matrix=pymupdf.Matrix(0.75, 0.75), alpha=False)
            img = Image.frombytes('RGB', (pix.width, pix.height), pix.samples)
            maxw = 420
            if img.width > maxw:
                img = img.resize((maxw, round(img.height * maxw / img.width)))
            thumbs.append((i + 1, img))
        cellw = 440
        cellh = max(t[1].height for t in thumbs) + 34
        sheet = Image.new('RGB', (cellw * 3, cellh * 4), 'white')
        dr = ImageDraw.Draw(sheet)
        for k, (no, img) in enumerate(thumbs):
            x = (k % 3) * cellw + 10
            y = (k // 3) * cellh + 26
            dr.text((x, y - 24), f'{base}  p{no}', fill='#222', font=font)
            sheet.paste(img, (x, y))
        out = PAGES / f'{base}_p{start+1:03d}-{pages[-1]+1:03d}.png'
        sheet.save(out)
    print(f'pages: {pdf.name} -> {doc.page_count} 页')
    doc.close()
print('done ->', PAGES)
