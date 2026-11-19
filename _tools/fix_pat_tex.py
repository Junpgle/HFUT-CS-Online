# -*- coding: utf-8 -*-
"""把 pat 内容里公式行的伪 TeX 记法（x_{k+1} / m^{n²} / 裸 _k / 裸 ^2）转成真实 <sub>/<sup>。

只作用于下面显式列出的行号（公式/行内数学），代码块 pre.code 一律不动，
deck1 的 _size/_capacity/priority_queue 等真实标识符不受影响。
易错模式（p_kp_j 会被贪心跳成 p_{kpj}）用显式替换对先行处理。
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "src" / "content" / "pat"

# 每个文件要转换的行号（1-based，来自排查 grep）
LINES = {
    "deck2.ts": [191, 192, 196, 557],
    "deck3.ts": [430],
    "deck4.ts": [150, 158, 179, 303, 305, 307, 309, 325, 348, 355, 356, 357, 359, 390],
    "deck5.ts": [84, 88, 91, 95, 126, 135, 137, 138, 142, 147, 167, 170, 175, 180, 181, 188, 189, 203],
    "deck6.ts": [1009, 1010, 1092, 1298, 1307, 1309, 1310, 1313],
}

# 显式替换对（先于通用规则；只在指定文件全部指定行上做）
EXPLICIT = [
    ("p_kp_j", "p<sub>k</sub>p<sub>j</sub>"),
    ("p₁^t₁ · p₂^t₂ · … · p_k^t_k", "p₁<sup>t₁</sup> · p₂<sup>t₂</sup> · … · p<sub>k</sub><sup>t<sub>k</sub></sup>"),
]

SUB_BRACED = re.compile(r"_\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}")
SUP_BRACED = re.compile(r"\^\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}")
BARE_SUB = re.compile(r"_([0-9A-Za-zα-ω]{1,4})(?![0-9A-Za-zα-ω])")
BARE_SUP = re.compile(r"\^([0-9A-Za-zα-ω.]+)")


def inner(t: str) -> str:
    """对花括号捕获组内部递归做下标转换（l_{k_i} → l<sub>k<sub>i</sub></sub>）。"""
    for _ in range(3):
        nxt = SUB_BRACED.sub(lambda m: "<sub>" + inner(m.group(1)) + "</sub>", t)
        nxt = BARE_SUB.sub(r"<sub>\1</sub>", nxt)
        if nxt == t:
            break
        t = nxt
    return t


def convert(s: str) -> str:
    for old, new in EXPLICIT:
        s = s.replace(old, new)
    s = SUP_BRACED.sub(lambda m: "<sup>" + inner(m.group(1)) + "</sup>", s)
    s = SUB_BRACED.sub(lambda m: "<sub>" + inner(m.group(1)) + "</sub>", s)
    s = BARE_SUP.sub(r"<sup>\1</sup>", s)
    s = BARE_SUB.sub(r"<sub>\1</sub>", s)
    return s


def main() -> None:
    total = 0
    for fname, nos in LINES.items():
        path = ROOT / fname
        lines = path.read_text(encoding="utf-8").splitlines()
        changed = 0
        for no in nos:
            idx = no - 1
            before = lines[idx]
            after = convert(before)
            if before != after:
                lines[idx] = after
                changed += 1
            else:
                print(f"WARN {fname}:{no} 未发生变化，请人工核对")
        path.write_text("\n".join(lines) + "\n", encoding="utf-8")
        total += changed
        print(f"{fname}: {changed}/{len(nos)} 行转换")
    print(f"共转换 {total} 行")


if __name__ == "__main__":
    main()
