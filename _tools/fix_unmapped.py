# -*- coding: utf-8 -*-
"""补录 mox term1/01_C++语言程序设计 目录下漏映射的 4 个文件 -> 大一上/C++程序设计"""
import os, re, csv, tarfile, hashlib
import importlib.util

spec = importlib.util.spec_from_file_location(
    "org", r"C:\Users\icepa\Documents\GitHub\HFUT-algorithm-design\_tools\organize_materials.py")
org = importlib.util.module_from_spec(spec)
# 不执行 main, 仅复用 sanitize/wpath/classify
spec.loader.exec_module(org) if False else None
# 直接复制需要的函数, 避免执行模块级 main(main 在 __main__ 保护下, exec_module 安全)
spec.loader.exec_module(org)

REPO_DIR = org.REPO_DIR
OUT_ROOT = org.OUT_ROOT
MANIFEST = os.path.join(OUT_ROOT, "文件清单.csv")
PREFIX = "term1/01_C++语言程序设计/"
DEST = "大一上/C++程序设计"

# 已占用路径(小写) -> 用于冲突改名
existing = set()
for root, dirs, files in os.walk(OUT_ROOT):
    for f in files:
        existing.add(("\\\\?\\" + os.path.join(root, f)).lower())

wr = csv.writer(open(MANIFEST, "a", newline="", encoding="utf-8-sig"))
n = 0
with tarfile.open(os.path.join(REPO_DIR, "mox.tar.gz"), "r:gz") as tf:
    for m in tf:
        if not m.isfile():
            continue
        rel = m.name[len("hfut-cs-master/"):]
        if not rel.startswith(PREFIX):
            continue
        inner = rel[len(PREFIX):]
        cat = org.classify(inner, "C++程序设计")
        tgt_parts = DEST.split("/") + [cat] + [org.sanitize(c) for c in inner.split("/")]
        tgt = org.wpath(*tgt_parts)
        low = tgt.lower()
        if low in existing:
            stem, ext = os.path.splitext("/".join(tgt_parts))
            tgt_parts = f"{stem}[mox]{ext}".split("/")
            tgt = org.wpath(*tgt_parts)
        os.makedirs(os.path.dirname(tgt), exist_ok=True)
        with open(tgt, "wb") as fo, tf.extractfile(m) as fi:
            fo.write(fi.read())
        existing.add(tgt.lower())
        wr.writerow(["mox", rel, "/".join(tgt_parts), cat, "补录(首次运行未映射)"])
        n += 1
        print("补录:", rel, "->", "/".join(tgt_parts))
print("共补录", n, "个文件")
