# -*- coding: utf-8 -*-
# 提取 pptx 全部文本（含 OMML 数学公式线性化），供大学物理整理用。
# 公式输出形如 [MATH] v = dr/dt ；上下标分别记 _{} 与 ^{}。
import os
import re
import sys
import zipfile
from lxml import etree

NS = {
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'm': 'http://schemas.openxmlformats.org/officeDocument/2006/math',
    'mc': 'http://schemas.openxmlformats.org/markup-compatibility/2006',
    'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
}


def lin(el):
    """OMML 元素 → 线性文本。"""
    tag = etree.QName(el).localname
    if tag in ('r',):
        return ''.join(t.text or '' for t in el.findall('.//m:t', NS))
    if tag == 't':
        return el.text or ''
    if tag == 'f':  # 分式
        num = el.find('m:num', NS)
        den = el.find('m:den', NS)
        return f"({lin_all(num)})/({lin_all(den)})"
    if tag == 'sSub':
        e = el.find('m:e', NS)
        sub = el.find('m:sub', NS)
        return f"{lin_all(e)}_{{{lin_all(sub)}}}"
    if tag == 'sSup':
        e = el.find('m:e', NS)
        sup = el.find('m:sup', NS)
        return f"{lin_all(e)}^{{{lin_all(sup)}}}"
    if tag == 'sSubSup':
        e = el.find('m:e', NS)
        sub = el.find('m:sub', NS)
        sup = el.find('m:sup', NS)
        return f"{lin_all(e)}_{{{lin_all(sub)}}}^{{{lin_all(sup)}}}"
    if tag == 'rad':
        e = el.find('m:e', NS)
        deg = el.find('m:deg', NS)
        d = lin_all(deg) if deg is not None and lin_all(deg) else ''
        return f"√{d}({lin_all(e)})"
    if tag == 'nary':
        chr_el = el.find('m:naryPr/m:chr', NS)
        sym = chr_el.get(f'{{{NS["m"]}}}val') if chr_el is not None else '∫'
        sub = el.find('m:sub', NS)
        sup = el.find('m:sup', NS)
        e = el.find('m:e', NS)
        parts = sym
        if sub is not None and lin_all(sub):
            parts += f"_{{{lin_all(sub)}}}"
        if sup is not None and lin_all(sup):
            parts += f"^{{{lin_all(sup)}}}"
        return f"{parts}({lin_all(e)})"
    if tag == 'd':  # 括号
        return f"({lin_all(el.find('m:e', NS))})"
    if tag == 'limLow':
        e = el.find('m:e', NS)
        lim = el.find('m:lim', NS)
        return f"{lin_all(e)}_{{{lin_all(lim)}}}"
    if tag == 'lim':
        return lin_all(el)
    if tag == 'func':
        name = el.find('m:fName', NS)
        e = el.find('m:e', NS)
        return f"{lin_all(name)}({lin_all(e)})"
    if tag == 'e':
        return lin_all(el)
    # 未知元素：递归拼接
    return lin_all(el)


def lin_all(el):
    if el is None:
        return ''
    parts = []
    for child in el:
        tag = etree.QName(child).localname
        if tag in ('rPr', 'ctrlPr', 'fPr', 'sSubPr', 'sSupPr', 'sSubSupPr', 'radPr',
                   'naryPr', 'dPr', 'limLowPr', 'funcPr', 'ePr', 'mPr', 'degPr', 'argPr'):
            continue
        parts.append(lin(child))
    return ''.join(parts)


def slide_paras(root):
    """按段落收集文本，公式单独标出。"""
    paras = []
    for p in root.iter('{%s}p' % NS['a']):
        txt = []
        for node in p.iter():
            q = etree.QName(node)
            if q.localname == 't' and q.namespace == NS['a']:
                txt.append(node.text or '')
            elif q.localname == 'oMath' and q.namespace == NS['m']:
                s = lin_all(node).strip()
                if s:
                    txt.append(f'[MATH]{s}')
        joined = ''.join(txt)
        if joined.strip():
            paras.append(joined)
    return paras


def pptx_text_math(src):
    with zipfile.ZipFile(src) as z:
        slides = sorted(
            (n for n in z.namelist() if re.match(r'ppt/slides/slide\d+\.xml$', n)),
            key=lambda n: int(re.search(r'(\d+)', n).group(1)))
        out = [f'# {os.path.basename(src)}\n共 {len(slides)} 页\n']
        for i, sn in enumerate(slides, 1):
            root = etree.fromstring(z.read(sn))
            out.append(f'\n===== 第 {i} 页 =====')
            out.extend(slide_paras(root))
    return '\n'.join(out)


if __name__ == '__main__':
    src, dst = sys.argv[1], sys.argv[2]
    open(dst, 'w', encoding='utf-8').write(pptx_text_math(src))
    print(dst, os.path.getsize(dst))
