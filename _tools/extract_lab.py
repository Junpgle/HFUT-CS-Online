import os
from pptx import Presentation

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(BASE, '_tools', 'lab_src')
OUT = os.path.join(BASE, '_tools', 'lab_out')
os.makedirs(OUT, exist_ok=True)


def shape_text(shape, out, depth=0):
    pad = '  ' * depth
    if shape.shape_type == 6:
        for sub in shape.shapes:
            shape_text(sub, out, depth + 1)
        return
    if shape.has_text_frame:
        lines = []
        for para in shape.text_frame.paragraphs:
            t = ''.join(run.text for run in para.runs)
            if t.strip():
                lines.append(t.rstrip())
        if lines:
            out.append(pad + '\n'.join(lines).rstrip())
    if getattr(shape, 'has_table', False) and shape.has_table:
        out.append(pad + '[TABLE]')
        for row in shape.table.rows:
            cells = [cell.text.replace('\n', '⏎').strip() for cell in row.cells]
            out.append(pad + ' | '.join(cells))
        out.append(pad + '[/TABLE]')


for fname in os.listdir(SRC):
    if not fname.endswith('.pptx'):
        continue
    prs = Presentation(os.path.join(SRC, fname))
    out = [f'# {fname}\n共 {len(prs.slides)} 页\n']
    for i, slide in enumerate(prs.slides, 1):
        out.append(f'\n===== 第 {i} 页 =====')
        for shape in slide.shapes:
            shape_text(shape, out)
    text = '\n'.join(out)
    dst = os.path.join(OUT, fname.replace('.pptx', '.txt'))
    with open(dst, 'w', encoding='utf-8') as f:
        f.write(text)
    print('OK', fname, len(text))
