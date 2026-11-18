# -*- coding: utf-8 -*-
"""
把 4 个 HFUT 资料仓库的 tarball 内容流式归类到:
  课件与期末题整理/<大一上..大四下/公共课与杂项>/<课程>/<课件|试题|附件>/
每个源文件必须命中映射表, 全部落盘, 不遗漏; 同名同内容去重, 同名不同内容加来源标记。
学期归属依据: 官方2019培养方案开课学期 + sunmiao/mox 实际修读记录交叉验证(见整理说明.md)。
"""
import os, re, csv, tarfile, hashlib

REPO_DIR = r"C:\Users\icepa\Documents\GitHub\HFUT-algorithm-design\_repos_dl"
OUT_ROOT = r"C:\Users\icepa\Documents\GitHub\HFUT-algorithm-design\课件与期末题整理"
MANIFEST = os.path.join(OUT_ROOT, "文件清单.csv")

TAARS = [
    ("sunmiao",  "sunmiao.tar.gz",  "HFUT-CS-main"),
    ("mox",      "mox.tar.gz",      "hfut-cs-master"),
    ("styitches","styitches.tar.gz","HFUT-CS-master"),
    ("luna",     "luna.tar.gz",     "HFUT_XC_Study_Things-main"),
]

RAW = "公共课与杂项/仓库原始说明"

# ---------------------------------------------------------------- 映射表
# 键: 仓库内路径前缀(目录或单个文件); 值: "学期/课程"
M = {
"sunmiao": {
    "大学一年级上学期/程序设计基础": "大一上/程序设计基础",
    "大学一年级下学期/数据结构": "大一下/数据结构",
    "大学一年级下学期/程序设计与算法设计": "大一下/数据结构课程设计",
    "大学二年级上学期/Java技术": "大二上/Java技术",
    "大学二年级上学期/离散数学": "大二上/离散数学",
    "大学二年级下学期/汇编语言程序设计": "大二上/汇编语言程序设计",
    "大学二年级下学期/微机原理与接口": "大二下/微机原理与接口技术",
    "大学二年级下学期/机器学习基础": "大二下/机器学习",
    "大学二年级下学期/硬件工程师综合训练": "大二下/硬件工程师综合训练",
    "大学二年级下学期/编译原理": "大二下/编译原理",
    "大学二年级下学期/计算机组成原理": "大二下/计算机组成原理",
    "大学二年级下学期/软件工具与环境": "大二下/软件工具与环境",
    "大学三年级上学期/人工智能原理": "大三上/人工智能原理",
    "大学三年级上学期/信安-网络攻防实践": "大三上/网络攻防实践",
    "大学三年级上学期/操作系统": "大三上/操作系统",
    "大学三年级上学期/数据库系统概论": "大三下/数据库系统",
    "大学三年级上学期/移动计算与应用开发": "大三上/移动计算与应用开发",
    "大学三年级上学期/系统硬件综合设计": "大三上/系统硬件综合设计",
    "大学三年级上学期/自然语言理解": "大三上/自然语言理解",
    "大学三年级上学期/计算机体系结构": "大三上/计算机体系结构",
    "大学三年级上学期/计算机网络": "大三上/计算机网络",
    "大学三年级下学期/图像与视频信息处理（现改名为计算机视觉与深度学习）": "大三下/计算机视觉与深度学习",
    "大学三年级下学期/大数据处理技术": "大三下/大数据处理技术",
    "大学三年级下学期/系统软件综合设计-操作系统（现改名为操作系统课程设计）": "大三下/操作系统课程设计",
    "大学三年级下学期/系统软件综合设计-编译原理（现改名为编译原理课程设计）": "大三下/编译原理课程设计",
    "大学三年级下学期/网络工程师综合实训": "大三下/网络工程师综合实训",
    "大学三年级下学期/软件工程": "大三下/软件工程",
    "大学三年级下学期/软件测试": "大三下/软件测试",
    "大学三年级下学期/软件项目管理": "大三下/软件项目管理",
    "大学四年级上学期/软件工程师综合训练": "大四上/软件工程师综合训练",
    "大学四年级上学期/领域方向综合设计(数字媒体方向)": "大四上/领域方向综合设计",
    "大学四年级上学期/README.MD": RAW,
    "合肥工业大学计算机科学与技术培养方案.pdf": "公共课与杂项/培养方案",
    "README.md": RAW,
    "LICENSE": RAW,
    ".gitattributes": RAW,
},
"mox": {
    "term1/01_C语言程序设计": "大一上/程序设计基础",
    "term1/01_Java语言程序设计": "大二上/Java技术",
    "term1/01_C++语言课程设计": "大一上/C++程序设计",
    "term1/README.md": RAW,
    "term2/02_数据结构": "大一下/数据结构",
    "term2/README.md": RAW,
    "term3/03_python程序设计": "大二上/Python程序设计",
    "term3/03_数字电路": "大二上/数字逻辑",
    "term3/03_机器人技术": "大二上/机器人技术",
    "term3/03_汇编设计": "大二上/汇编语言程序设计",
    "term3/03_离散数学": "大二上/离散数学",
    "term3/03_程序设计艺术与方法": "大二上/程序设计艺术与方法",
    "term3/03_计算方法": "大二上/计算方法",
    "term3/README.md": RAW,
    "term4/04_嵌入式系统原理": "大二下/嵌入式系统原理",
    "term4/04_机器学习": "大二下/机器学习",
    "term4/04_编译原理": "大二下/编译原理",
    "term4/04_网络程序设计": "大二下/网络程序设计",
    "term4/04_计算机图形学": "大二下/计算机图形学",
    "term4/04_计算机组成原理": "大二下/计算机组成原理",
    "term4/README.md": RAW,
    "term5/05_CPU硬件设计": "大三上/系统硬件综合设计",
    "term5/05_自然语言处理": "大三上/自然语言理解",
    "term5/05_计算机体系结构": "大三上/计算机体系结构",
    "term5/05_计算机操作系统": "大三上/操作系统",
    "term5/05_计算机网络": "大三上/计算机网络",
    "term5/README.md": RAW,
    "term6/06_信息安全技术": "大三下/信息安全技术",
    "term6/06_数据库": "大三下/数据库系统",
    "term6/06_软件工程": "大三下/软件工程",
    "term6/README.md": RAW,
    "term7/07_计算机专业工程实习与实训": "大四上/软件工程师综合训练",
    "term7/07_计算机网络课设": "大三上/计算机网络课程设计",
    "term7/07_领域方向综合设计": "大四上/领域方向综合设计",
    "term7/README.md": RAW,
    "README.md": RAW,
    "LICENSE": RAW,
    ".gitignore": RAW,
},
"styitches": {
    "c++": "大一上/C++程序设计",
    "java": "大二上/Java技术",
    "python": "大二上/Python程序设计",
    "人工智能原理": "大三上/人工智能原理",
    "分布式程序设计": "大四上/分布式程序设计",
    "创新实践": "大四下/创新实践",
    "大学物理实验": "大二上/大学物理实验",
    "大数据": "大三下/大数据处理技术",
    "嵌入式": "大二下/嵌入式系统原理",
    "操作系统": "大三上/操作系统",
    "数字逻辑": "大二上/数字逻辑",
    "数据结构": "大一下/数据结构",
    "机器人技术": "大二上/机器人技术",
    "杂乱资料/2021级培养方案": "公共课与杂项/培养方案",
    "杂乱资料/EDA-Verilog-HDL期末复习题总结必过.pdf": "大二上/EDA实训",
    "杂乱资料/EDA-VerilogHDL期末复习题总结必过(最新整理).pdf": "大二上/EDA实训",
    "杂乱资料/《PLD原理与EDA技术》复习(期末)提纲.docx": "大二上/EDA实训",
    "杂乱资料/FPGA期末复习题(答案)知识点题型.docx": "大二上/EDA实训",
    "杂乱资料/大物实验网上答题答案.pdf": "大二上/大学物理实验",
    "杂乱资料/公选课问卷调查2020.6.7(微信公众号：桃花镇的猫)(2).xlsx": "公共课与杂项/校园生活指南",
    "杂乱资料/慕课题库情况调查.xlsx": "公共课与杂项/校园生活指南",
    "杂乱资料/给萌新的校园网使用指南（详细到不能再详细了）.doc": "公共课与杂项/校园生活指南",
    "杂乱资料/选课大法.docx": "公共课与杂项/校园生活指南",
    "概率论": "大二上/概率论与数理统计",
    "汇编": "大二上/汇编语言程序设计",
    "电路与电子技术": "大一下/电路与电子技术基础",
    "离散数学": "大二上/离散数学",
    "系统硬件设计": "大三上/系统硬件综合设计",
    "组合数学--建议不要选，很坑": "大二下/组合数学",
    "编译原理": "大二下/编译原理",
    "自然语言处理": "大三上/自然语言理解",
    "计算机体系结构": "大三上/计算机体系结构",
    "计算机组成原理": "大二下/计算机组成原理",
    "计算机网络": "大三上/计算机网络",
    "软件体系结构": "大三上/软件体系结构",
    "软件工具与环境": "大二下/软件工具与环境",
    "软件建模": "大二下/软件建模与分析",
    "README.md": RAW,
},
"luna": {
    "【公共课】思政教材": "公共课与杂项/思政教材",
    "【公共课】英语": "公共课与杂项/大学英语四六级",
    "【公共课】题库及答案": "公共课与杂项/思政题库",
    "【大一】Java": "大二上/Java技术",
    "【大一】大学物理": "大二上/大学物理",
    "【大一】数据结构": "大一下/数据结构",
    "【大一】电路与电子技术基础": "大一下/电路与电子技术基础",
    "【大一】程序设计基础": "大一上/程序设计基础",
    "【大一】线性代数": "大一下/线性代数",
    "【大一】高等数学": "大一上/高等数学",
    "【大三】人工智能原理": "大三上/人工智能原理",
    "【大三】人工智能经济学": "大三下/人工智能经济学",
    "【大三】操作系统": "大三上/操作系统",
    "【大三】数字媒体技术": "大二下/数字媒体技术",
    "【大三】数据库系统": "大三下/数据库系统",
    "【大三】硬件综合设计": "大三上/系统硬件综合设计",
    "【大三】网络与信息安全技术": "大三下/信息安全技术",
    "【大三】计算机体系结构": "大三上/计算机体系结构",
    "【大三】计算机图形学": "大二下/计算机图形学",
    "【大三】计算机应用项目实训课": "大三下/计算机应用项目实训",
    "【大三】计算机网络": "大三上/计算机网络",
    "【大三】软件工程": "大三下/软件工程",
    "【大三】软件测试": "大三下/软件测试",
    "【大二】EDA实训学习": "大二上/EDA实训",
    "【大二】Python": "大二上/Python程序设计",
    "【大二】大学物理实验": "大二上/大学物理实验",
    "【大二】嵌入式系统原理": "大二下/嵌入式系统原理",
    "【大二】数字逻辑": "大二上/数字逻辑",
    "【大二】机器人技术": "大二上/机器人技术",
    "【大二】机器学习": "大二下/机器学习",
    "【大二】概率论与数理统计": "大二上/概率论与数理统计",
    "【大二】汇编": "大二上/汇编语言程序设计",
    "【大二】离散数学": "大二上/离散数学",
    "【大二】科研训练": "大二上/科研训练",
    "【大二】程序设计艺术": "大二上/程序设计艺术与方法",
    "【大二】编译原理": "大二下/编译原理",
    "【大二】计算方法": "大二上/计算方法",
    "【大二】计算机组成原理": "大二下/计算机组成原理",
    "assets": RAW + "/luna/assets",
    "test-gh-pages": RAW + "/luna/test-gh-pages",
    ".github": RAW + "/luna/.github",
    "README.md": RAW,
    "LICENSE-ORIGINAL": RAW,
    ".gitignore": RAW,
    "gen-md.py": RAW,
    "mkdocs.yml": RAW,
},
}

# ---------------------------------------------------------------- 分类
RE_STRONG_EXAM = re.compile(r"试题|试卷|真题|考试题|复习题|练习题|习题|题库|笔试|测验|样题|quiz|exam", re.I)
RE_ANSWER = re.compile(r"习题答案|作业答案|参考答案")
RE_REPORT = re.compile(r"作业|实验|报告|课设|课程设计|笔记|心得|指导书|手册|模板|答案|项目|代码|总结|提纲|大纲|题解|论文|文档|文献|调研|复习|安排|说明|清单|日志|记录|数据集|资料")
RE_SLIDE = re.compile(r"课件|讲义|PPT|幻灯|slides|lecture|chap(ter)?\b|第\s*[0-9一二三四五六七八九十]+\s*章", re.I)
RE_WEAK_EXAM = re.compile(r"期末|考试", re.I)
RE_CET = re.compile(r"cet|四级|六级", re.I)
SLIDE_EXT = {".ppt", ".pptx", ".ppsx", ".pot", ".pps"}

def classify(rel, course):
    fn = rel.rsplit("/", 1)[-1]
    ext = os.path.splitext(fn)[1].lower()
    if ext in SLIDE_EXT:
        return "课件"
    if course == "大学英语四六级" and RE_CET.search(fn):
        return "试题"
    if RE_ANSWER.search(fn):
        return "附件"
    if RE_STRONG_EXAM.search(fn):
        return "试题"
    if RE_REPORT.search(rel):
        return "附件"
    if RE_SLIDE.search(fn):
        return "课件"
    if RE_WEAK_EXAM.search(fn):
        return "试题"
    return "附件"

# ---------------------------------------------------------------- 工具
BAD = '<>:"|?*'
def sanitize(comp):
    comp = comp.strip()
    out = "".join("_" if c in BAD else c for c in comp)
    while out.endswith(".") or out.endswith(" "):
        out = out[:-1]
    return out or "_"

def wpath(*parts):
    """Windows 长路径安全绝对路径"""
    return "\\\\?\\" + os.path.join(OUT_ROOT, *parts)

def sha256_of(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()

def find_dest(repo, rel):
    """返回 (映射值, 课程内相对路径) 或 (None, None)"""
    table = M[repo]
    if rel in table:
        v = table[rel]
        # 单文件键: 课程内只保留文件名
        inner = rel.rsplit("/", 1)[-1] if "/" in rel else rel
        return v, inner
    best = None
    for k in table:
        if rel.startswith(k + "/") and (best is None or len(k) > len(best)):
            best = k
    if best is None:
        return None, None
    return table[best], rel[len(best) + 1:]

def main():
    os.makedirs(OUT_ROOT, exist_ok=True)
    wr = csv.writer(open(MANIFEST, "w", newline="", encoding="utf-8-sig"))
    wr.writerow(["来源仓库", "源路径", "目标路径", "类别", "处理"])
    hashes = {}             # 已占用目标路径(小写) -> 内容sha256(用到时再算)
    stats = {"written": 0, "dedup": 0, "renamed": 0, "unmapped": []}
    counts = {}

    for repo, tarname, top in TAARS:
        print(f"== {repo} ({tarname}) ==", flush=True)
        with tarfile.open(os.path.join(REPO_DIR, tarname), "r:gz") as tf:
            for m in tf:
                if not m.isfile() or m.name == "pax_global_header":
                    continue
                assert m.name.startswith(top + "/"), m.name
                rel = m.name[len(top) + 1:]
                dest, inner = find_dest(repo, rel)
                if dest is None:
                    stats["unmapped"].append(f"{repo}:{rel}")
                    continue
                # 仓库原始说明按仓库名分子目录, 避免各仓库 README 等同名冲突
                if dest == RAW or dest.startswith(RAW + "/"):
                    if not dest.startswith(RAW + "/" + repo):
                        dest = RAW + "/" + repo
                cat = classify(inner, dest.split("/")[-1])
                tgt_parts = dest.split("/") + [cat] + [sanitize(c) for c in inner.split("/")]
                rel_tgt = "/".join(tgt_parts)
                tgt = wpath(*tgt_parts)
                low = tgt.lower()
                action = "写入"
                if low in hashes:
                    old = hashes[low] or sha256_of(tgt)
                    h, fsrc = hashlib.sha256(), tf.extractfile(m)
                    for chunk in iter(lambda: fsrc.read(1 << 20), b""):
                        h.update(chunk)
                    if h.hexdigest() == old:
                        stats["dedup"] += 1
                        wr.writerow([repo, rel, rel_tgt, cat, "内容相同, 跳过"])
                        continue
                    stem, ext = os.path.splitext(rel_tgt)
                    i = 0
                    while True:
                        cand = f"{stem}[{repo}]{ext}" if i == 0 else f"{stem}[{repo}{i}]{ext}"
                        if wpath(*cand.split("/")).lower() not in hashes:
                            break
                        i += 1
                    rel_tgt, tgt = cand, wpath(*cand.split("/"))
                    low = tgt.lower()
                    action = "改名(同名不同内容)"
                    stats["renamed"] += 1
                os.makedirs(os.path.dirname(tgt), exist_ok=True)
                h, fsrc = hashlib.sha256(), tf.extractfile(m)
                with open(tgt, "wb") as fo:
                    for chunk in iter(lambda: fsrc.read(1 << 20), b""):
                        h.update(chunk)
                        fo.write(chunk)
                hashes[low] = h.hexdigest()
                stats["written"] += 1
                if action != "写入":
                    pass
                counts_key = "/".join(tgt_parts[:-1])
                counts[counts_key] = counts.get(counts_key, 0) + 1
                wr.writerow([repo, rel, rel_tgt, cat, action])
        print(f"   {repo} 完成", flush=True)

    print("written:", stats["written"], "dedup:", stats["dedup"], "renamed:", stats["renamed"])
    if stats["unmapped"]:
        print("!! 未映射文件", len(stats["unmapped"]))
        for u in stats["unmapped"]:
            print("  ", u)
    else:
        print("所有文件均已映射, 无遗漏")
    with open(os.path.join(REPO_DIR, "分类统计.txt"), "w", encoding="utf-8") as f:
        for k in sorted(counts):
            f.write(f"{counts[k]}\t{k}\n")

if __name__ == "__main__":
    main()
