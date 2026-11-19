# -*- coding: utf-8 -*-
"""提取计算机网络课件 PPTX 的逐页文本（含表格），供内容整理用。
用法：python _tools/extract_net_ppt.py <pptx 路径> <输出 txt 路径>
"""
import sys
from pptx import Presentation
from pptx.util import Emu

def shape_text(shape, out, depth=0):
    pad = '  ' * depth
    # 组合形状递归
    if shape.shape_type == 6:  # GROUP
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
            cells = []
            for cell in row.cells:
                cells.append(cell.text.replace('\n', '⏎').strip())
            out.append(pad + ' | '.join(cells))
        out.append(pad + '[/TABLE]')
    if shape.has_chart if hasattr(shape, 'has_chart') else False:
        out.append(pad + '[CHART 图表，文本未提取]')

def main():
    src, dst = sys.argv[1], sys.argv[2]
    prs = Presentation(src)
    out = [f'# {src}\n共 {len(prs.slides)} 页\n']
    for i, slide in enumerate(prs.slides, 1):
        out.append(f'\n===== 第 {i} 页 =====')
        # 备注
        body = []
        for shape in slide.shapes:
            shape_text(shape, body)
        if body:
            out.extend(body)
        else:
            out.append('(无文本形状)')
        if slide.has_notes_slide and slide.notes_slide.notes_text_frame is not None:
            notes = slide.notes_slide.notes_text_frame.text.strip()
            if notes:
                out.append(f'[备注] {notes}')
    with open(dst, 'w', encoding='utf-8') as f:
        f.write('\n'.join(out))
    print(f'OK -> {dst}')

if __name__ == '__main__':
    main()
