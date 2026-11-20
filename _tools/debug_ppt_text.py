# -*- coding: utf-8 -*-
"""Deep debug of old PPT text extraction."""
import os, sys, io, glob
import win32com.client

SRC = r"C:\Users\icepa\Documents\GitHub\HFUT-algorithm-design\data\大一上\程序设计基础\课件\PPT"

ppt = win32com.client.Dispatch("PowerPoint.Application")
ppt.Visible = 1

out = io.open("C:/Users/icepa/.local/share/kilo/tool-output/ppt_deep.txt", "w", encoding="utf-8")

path = os.path.join(SRC, "第一章 C语言概论.ppt")
prs = ppt.Presentations.Open(path)
out.write("slides=%d\n" % len(prs.slides))
for i, slide in enumerate(prs.slides):
    out.write("--- S%d ---\n" % (i + 1))
    for j, shape in enumerate(slide.shapes):
        try:
            st = shape.Type
        except Exception:
            st = "?"
        out.write("  shape %d type=%r name=%r hasTF=%s hasTable=%s\n" % (j, st, shape.Name, shape.HasTextFrame, shape.HasTable))
        try:
            if shape.HasTextFrame:
                tf = shape.TextFrame
                out.write("    TextFrame.Text=%r\n" % tf.Text)
                try:
                    out.write("    TextRange.Text=%r\n" % tf.TextRange.Text)
                except Exception as e:
                    out.write("    TextRange err=%r\n" % e)
                try:
                    out.write("    Paragraphs=%d\n" % len(tf.Paragraphs))
                    for p in tf.Paragraphs:
                        out.write("    para=%r\n" % p.Text)
                except Exception as e:
                    out.write("    Paragraphs err=%r\n" % e)
        except Exception as e:
            out.write("    shape err=%r\n" % e)
        if i > 4:
            break
    if i > 4:
        break
prs.Close()
out.close()
ppt.quit()