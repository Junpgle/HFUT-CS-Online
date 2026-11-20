# -*- coding: utf-8 -*-
import os, sys, io, time, glob, shutil
import win32com.client

SRC = r"C:\Users\icepa\Documents\GitHub\HFUT-algorithm-design\data\大一上\程序设计基础\课件\PPT"
DST = r"C:\Users\icepa\AppData\Local\Temp\kilo\pptx"
if os.path.exists(DST):
    shutil.rmtree(DST)
os.makedirs(DST, exist_ok=True)

ppt = win32com.client.Dispatch("PowerPoint.Application")
ppt.Visible = 1

out = io.open("C:/Users/icepa/.local/share/kilo/tool-output/ppt_debug6.txt", "w", encoding="utf-8")

# Enumerate the PpSaveAsFormat constants
try:
    fmts = []
    for name in dir(ppt):
        if name.startswith("ppSaveAs"):
            try:
                val = getattr(ppt, name)
                fmts.append((name, val))
            except Exception:
                pass
    out.write("Formats: %r\n" % fmts)
except Exception as e:
    out.write("fmt error: %r\n" % e)

path = os.path.join(SRC, "第一章 C语言概论.ppt")
dst_path = os.path.join(DST, "deck1.pptx")
try:
    prs = ppt.Presentations.Open(path)
    prs.SaveAs(dst_path, FileFormat=21)
    prs.Close()
    time.sleep(1.0)
    out.write("dst exists=%s\n" % os.path.exists(dst_path))
    out.write("dir listing: %r\n" % os.listdir(DST))
except Exception as e:
    out.write("ERROR: %r\n" % e)
out.close()
ppt.quit()