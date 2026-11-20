# 软件体系结构课件文本提取：4 份 PPT（含备注），输出到 _tools/sa_out/*.txt
import io
import os

from pptx import Presentation

BASE = os.path.dirname(os.path.abspath(__file__))
FILES = [
    ('../data/大三上/软件体系结构/课件/第4章 软件体系结构描述.ppt', 'sa_tmp/第4章 软件体系结构描述.pptx', 'ch4.txt'),
    ('../data/大三上/软件体系结构/课件/第5章 软件体系结构设计.ppt', 'sa_tmp/第5章 软件体系结构设计.pptx', 'ch5.txt'),
    ('../data/大三上/软件体系结构/课件/第7章 软件体系结构评估.ppt', 'sa_tmp/第7章 软件体系结构评估.pptx', 'ch7.txt'),
    ('../data/大三上/软件体系结构/课件/IBM-RSA-UML2.0建模实例教程.pptx', None, 'rsa.txt'),
]

OUT = os.path.join(BASE, 'sa_out')
os.makedirs(OUT, exist_ok=True)


def extract(path):
    prs = Presentation(path)
    parts = []
    for i, slide in enumerate(prs.slides):
        parts.append(f'===== slide {i + 1} =====')
        for shape in slide.shapes:
            if not shape.has_text_frame:
                continue
            for para in shape.text_frame.paragraphs:
                text = ''.join(run.text for run in para.runs)
                if text.strip():
                    parts.append(text)
        if slide.has_notes_slide and slide.notes_slide.notes_text_frame is not None:
            notes = slide.notes_slide.notes_text_frame.text
            if notes.strip():
                parts.append(f'--- notes: {notes.strip()}')
    return '\n'.join(parts)


for orig, converted, out_name in FILES:
    src = os.path.join(BASE, converted if converted else orig)
    text = extract(src)
    with io.open(os.path.join(OUT, out_name), 'w', encoding='utf-8') as f:
        f.write(text)
    slides = text.count('===== slide')
    print(f'{out_name}: {slides} slides, {len(text)} chars')
