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

out = io.open("C:/Users/icepa/.local/share/kilo/tool-output/ppt_debug3.txt", "w", encoding="utf-8")

files = sorted(glob.glob(os.path.join(SRC, "*.ppt")))
for idx, path in enumerate(files):
    dst_path = os.path.join(DST, "deck%d.pptx" % (idx + 1))
    try:
        prs = ppt.Presentations.Open(path)
        prs.SaveAs(dst_path, 21)
        prs.Close()
        time.sleep(0.5)
        out.write("%s -> %s exists=%s size=%s\n" % (os.path.basename(path), dst_path, os.path.exists(dst_path), os.path.getsize(dst_path) if os.path.exists(dst_path) else 0))
    except Exception as e:
        out.write("%s ERROR %r\n" % (os.path.basename(path), e))
out.close()
ppt.quit()