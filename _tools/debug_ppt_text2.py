# -*- coding: utf-8 -*-
"""Deep debug of old PPT text extraction - try TextRange."""
import os, sys, io, glob
import win32com.client

SRC = r"C:\Users\icepa\Documents\GitHub\HFUT-algorithm-design\data\大一上\程序设计基础\课件\PPT"

ppt = win32com.client.Dispatch("PowerPoint.Application")
ppt.Visible = 1

out = io.open("C:/Users/icepa/.local/share/kilo/tool-output/ppt_deep2.txt", "w", encoding="utf-8")

path = os.path.join(SRC, "第一章 C语言概论.ppt")
prs = ppt.Presentations.Open(path)
out.write("slides=%d\n" % len(prs.slides))
for i, slide in enumerate(prs.slides):
    out.write("--- S%d ---\n" % (i + 1))
    for j, shape in enumerate(slide.shapes):
        try:
            if shape.HasTextFrame:
                tf = shape.TextFrame
                # Try TextRange.Text
                try:
                    t = tf.TextRange.Text
                    if t and t.strip():
                        out.write("  TextRange: %r\n" % t.strip())
                except Exception as e:
                    out.write("  TextRange err: %r\n" % e)
                # Try Paragraphs
                try:
                    for p in tf.Paragraphs:
                        t = p.Text
                        if t and t.strip():
                            out.write("  Para: %r\n" % t.strip())
                except Exception as e:
                    out.write("  Para err: %r\n" % e)
                # Try Text property directly
                try:
                    t = tf.Text
                    if t and t.strip():
                        out.write("  Text: %r\n" % t.strip())
                except Exception as e:
                    out.write("  Text err: %r\n" % e)
        except Exception as e:
            pass
    if i > 5:
        break
prs.Close()
out.close()
ppt.quit()