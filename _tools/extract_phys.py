# 提取「大学物理」课件/试题文本，供整理成前端页面用。
# pptx/pptx 用 python-pptx（含表格），pdf 用 pymupdf。
# 用法: python -I _tools/extract_phys.py  → 输出到 _tools/phys_out/
import os
import re
from pptx import Presentation

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(BASE, 'data', '大二上', '大学物理')
OUT = os.path.join(BASE, '_tools', 'phys_out')
os.makedirs(OUT, exist_ok=True)


def shape_text(shape, out, depth=0):
    pad = '  ' * depth
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
            cells = [cell.text.replace('\n', '⏎').strip() for cell in row.cells]
            out.append(pad + ' | '.join(cells))
        out.append(pad + '[/TABLE]')


def pptx_text(src):
    prs = Presentation(src)
    out = [f'# {os.path.basename(src)}\n共 {len(prs.slides)} 页\n']
    for i, slide in enumerate(prs.slides, 1):
        out.append(f'\n===== 第 {i} 页 =====')
        for shape in slide.shapes:
            shape_text(shape, out)
    return '\n'.join(out)


def pdf_text(src):
    import pymupdf
    doc = pymupdf.open(src)
    out = [f'# {os.path.basename(src)}\n共 {doc.page_count} 页\n']
    for i, page in enumerate(doc, 1):
        out.append(f'\n===== 第 {i} 页 =====')
        out.append(page.get_text('text').strip())
    doc.close()
    return '\n'.join(out)


def safe_name(name):
    return re.sub(r'[^\w.\-]+', '_', name)


TASKS = [
    # (子目录, 文件名, 输出名)
    ('课件/PPT-新-期中', '1-1.pptx', 'qc-1-1.txt'),
    ('课件/PPT-新-期中', '1-2.pptx', 'qc-1-2.txt'),
    ('课件/PPT-新-期中', '1.3-5.pptx', 'qc-1-3to5.txt'),
    ('课件/PPT-新-期中', '2.1-3.pptx', 'qc-2-1to3.txt'),
    ('课件/PPT-新-期中', '2.4-7.pptx', 'qc-2-4to7.txt'),
    ('课件/PPT-新-期中', '3.1-3.2.pptx', 'qc-3-1to2.txt'),
    ('课件/PPT-新-期中', '3.3-3.4.pptx', 'qc-3-3to4.txt'),
    ('课件/PPT-新-期中', '4.1-2新.pptx', 'qc-4-1to2.txt'),
    ('课件/PPT-新-期中', '4.3-4.pptx', 'qc-4-3to4.txt'),
    ('课件/PPT-新-期中', '5-123.pptx', 'qc-5-1to3.txt'),
    ('课件/PPT-新-期中', '5-45.pptx', 'qc-5-4to5.txt'),
    ('课件/PPT-新-期中', '6-12.pptx', 'qc-6-1to2.txt'),
    ('课件/PPT-新-期中', '6-3.pptx', 'qc-6-3.txt'),
    ('课件/PPT-新-期中', '6-4567新1.pptx', 'qc-6-4to7.txt'),
    ('课件/PPT-新-期中', '10-1.2.pptx', 'qc-10-1to2.txt'),
    ('课件/PPT-新-期中', '10-5.pptx', 'qc-10-5.txt'),
    ('课件/PPT-新-期中', '11-1-4.pptx', 'qc-11-1to4.txt'),
    ('课件/PPT-新-期中', '11.5-8.pptx', 'qc-11-5to8.txt'),
    ('课件/PPT-新-期末', '振动与波复习.pptx', 'qd-vibwave.txt'),
    ('附件/PPT-新-期末', '1.电荷 库仑定律 电场 电场强度.pdf', 'qe-01-charge.txt'),
    ('附件/PPT-新-期末', '2.静电场的高斯定理.pdf', 'qe-02-gauss.txt'),
    ('附件/PPT-新-期末', '3.静电场的环路定理 电势 电场强度与电势的微分关系.pdf', 'qe-03-potential.txt'),
    ('附件/PPT-新-期末', '4.静电场中的导体.pdf', 'qe-04-conductor.txt'),
    ('附件/PPT-新-期末', '5.电容 静电场的能量.pdf', 'qe-05-capacitance.txt'),
    ('附件/PPT-新-期末', '6.磁感应强度 毕奥-萨伐尔定律.pdf', 'qe-06-biot.txt'),
    ('附件/PPT-新-期末', '7.恒定磁场的安培环路定理 带电粒子在电场和磁场中的运动.pdf', 'qe-07-ampere.txt'),
    ('附件/PPT-新-期末', '8.磁场对载流导线的作用.pdf', 'qe-08-force.txt'),
    ('附件/PPT-新-期末', '9.电磁感应定律.pdf', 'qe-09-induction.txt'),
    ('附件/PPT-新-期末', '10-11.自感应和互感应 磁场的能量 位移电流 电磁场理论.pdf', 'qe-10-11-em.txt'),
    ('附件/PPT-新-期末', '12.相干光 双缝干涉 光程与光程差.pdf', 'qe-12-interference.txt'),
    ('附件/PPT-新-期末', '13.薄膜干涉.pdf', 'qe-13-thinfilm.txt'),
    ('附件/PPT-新-期末', '14.迈克耳孙干涉仪 光的衍射 惠更斯-菲涅尔原理 单缝的夫琅禾费衍射.pdf', 'qe-14-michelson.txt'),
    ('附件/PPT-新-期末', '15.圆孔的夫琅禾费衍射 光栅衍射.pdf', 'qe-15-grating.txt'),
    ('附件/PPT-新-期末', '16.光的偏振 起偏和检偏 马吕斯定律 反射和折射时光的偏振.pdf', 'qe-16-polarization.txt'),
    ('试题/PPT-新-期末', '习题解答.pdf', 'ans-final.txt'),
    ('试题/真题', '2016-2017第一学期大学物理B（下）期末A卷（试题+答案）.pdf', 'exam-2016b1.txt'),
    ('试题/真题', '2016-2017第二学期大学物理B（上）期末A卷（试题+答案）.pdf', 'exam-2016b2.txt'),
    ('试题/真题', '2017-2018第二学期大学物理B（上）期末A卷（试题+答案）.pdf', 'exam-2017b.txt'),
    ('试题/真题', '2019-2020第二学期大学物理B（上）期末A卷（试题+答案）.pdf', 'exam-2019b.txt'),
    ('试题/真题', '2019-2020第二学期大学物理C期末A卷试题（2020.06.17）.pdf', 'exam-2020c.txt'),
    ('试题/真题', '2019-2020第二学期大学物理C线上期末A卷试题（2020.08.24）.pdf', 'exam-2020conline.txt'),
    ('试题/真题', '大学物理C历年期末试卷两套（含2016-2017第二学期）.pdf', 'exam-c2set.txt'),
    ('附件/真题', '2017-2018第一学期大学物理B（下）期末参考答案及评分标准.pdf', 'exam-2017b2-ans.txt'),
]

for sub, fname, outname in TASKS:
    src = os.path.join(DATA, sub, fname)
    dst = os.path.join(OUT, outname)
    if not os.path.exists(src):
        print(f'SKIP (missing): {sub}/{fname}')
        continue
    try:
        text = pptx_text(src) if fname.lower().endswith(('.pptx', '.ppt')) else pdf_text(src)
    except Exception as e:
        print(f'FAIL {sub}/{fname}: {e}')
        continue
    with open(dst, 'w', encoding='utf-8') as f:
        f.write(text)
    print(f'OK {outname}  ({len(text)} chars)')

print('done')
