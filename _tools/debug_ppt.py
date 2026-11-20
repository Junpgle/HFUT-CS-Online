# -*- coding: utf-8 -*-
import os, sys, io, time
import win32com.client

SRC = r"C:\Users\icepa\Documents\GitHub\HFUT-algorithm-design\data\大一上\程序设计基础\课件\PPT"
DST = r"C:\Users\icepa\Documents\GitHub\HFUT-algorithm-design\_tools\pptx"
os.makedirs(DST, exist_ok=True)

ppt = win32com.client.Dispatch("PowerPoint.Application")
ppt.Visible = 1

out = io.open("C:/Users/icepa/.local/share/kilo/tool-output/ppt_debug.txt", "w", encoding="utf-8")

path = os.path.join(SRC, "第一章 C语言概论.ppt")
dst_path = os.path.join(DST, "第一章 C语言概论.pptx")
out.write("src exists: %s\n" % os.path.exists(path))
out.write("dst dir exists: %s\n" % os.path.exists(DST))
try:
    prs = ppt.Presentations.Open(path)
    out.write("opened ok\n")
    prs.SaveAs(dst_path, 21)
    out.write("SaveAs returned\n")
    prs.Close()
    time.sleep(1.0)
    out.write("after close, dst exists: %s\n" % os.path.exists(dst_path))
    out.write("dir listing: %r\n" % os.listdir(DST))
except Exception as e:
    out.write("ERROR: %r\n" % e)
out.close()
ppt.quit()