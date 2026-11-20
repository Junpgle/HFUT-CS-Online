# -*- coding: utf-8 -*-
"""Extract slide text directly from old .ppt via PowerPoint COM (no SaveAs needed)."""
import os, sys, io, glob, time
import win32com.client

SRC = r"C:\Users\icepa\Documents\GitHub\HFUT-algorithm-design\data\大一上\程序设计基础\课件\PPT"

ppt = win32com.client.Dispatch("PowerPoint.Application")
ppt.Visible = 1

out = io.open("C:/Users/icepa/.local/share/kilo/tool-output/ppt_full.txt", "w", encoding="utf-8")

def fix(s):
    if not s:
        return ""
    try:
        b = s.encode("latin-1")
    except Exception:
        return s
    for enc in ("gbk", "gb2312", "gb18030"):
        try:
            return b.decode(enc)
        except Exception:
            continue
    return s

files = sorted(glob.glob(os.path.join(SRC, "*.ppt")))
for path in files:
    base = os.path.basename(path)
    out.write("\n========== %s ==========\n" % fix(base))
    try:
        prs = ppt.Presentations.Open(path)
        out.write("slides=%d\n" % len(prs.slides))
        for i, slide in enumerate(prs.slides):
            out.write("--- S%d ---\n" % (i + 1))
            for shape in slide.shapes:
                try:
                    if shape.HasTextFrame:
                        t = shape.TextFrame.TextRange.Text
                        t = fix(t)
                        if t and t.strip():
                            out.write(t.strip() + "\n")
                except Exception:
                    pass
                try:
                    if shape.HasTable:
                        tbl = shape.Table
                        rows = []
                        for row in range(1, tbl.Rows.Count + 1):
                            cells = []
                            for col in range(1, tbl.Columns.Count + 1):
                                try:
                                    cells.append(fix(tbl.Cell(row, col).Shape.TextFrame.TextRange.Text.strip()))
                                except Exception:
                                    cells.append("")
                            rows.append(" | ".join(cells))
                        out.write("[TABLE]\n" + "\n".join(rows) + "\n")
                except Exception:
                    pass
        prs.Close()
    except Exception as e:
        out.write("ERROR: %r\n" % e)
    out.flush()

out.close()
ppt.quit()