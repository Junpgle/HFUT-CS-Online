import io

# os/ca/math 三个试卷页：pq-group-no 徽章由「大题数组序」改为「标题中的原卷中文序数」，
# 避免题型过滤后首组孤立显示阿拉伯数字（如「3 选择题」）被误读为错误标记
FILES = {
    'src/pages/OsPaperPage.tsx': (
        "  // 大题标题去掉「一、」前缀（编号由 pq-group-no 徽章承担）\n"
        "  const stripPrefix = (t: string) => t.replace(/^[一二三四五六七八九十]+、/, '');\n",
        "  // 大题标题去掉「一、」前缀（原卷中文序数由 pq-group-no 徽章承担）\n"
        "  const stripPrefix = (t: string) => t.replace(/^[一二三四五六七八九十]+、/, '');\n"
        "  // 标题开头的原卷大题序数（一、二、…），无前缀时徽章退回数组序号\n"
        "  const secNum = (t: string): string | null => t.match(/^([一二三四五六七八九十]+)、/)?.[1] ?? null;\n",
    ),
    'src/pages/CaPaperPage.tsx': (
        "  // 大题标题去掉「一、」前缀（编号由 pq-group-no 徽章承担）\n"
        "  const stripPrefix = (t: string) => t.replace(/^[一二三四五六七八九十]+、/, '');\n",
        "  // 大题标题去掉「一、」前缀（原卷中文序数由 pq-group-no 徽章承担）\n"
        "  const stripPrefix = (t: string) => t.replace(/^[一二三四五六七八九十]+、/, '');\n"
        "  // 标题开头的原卷大题序数（一、二、…），无前缀时徽章退回数组序号\n"
        "  const secNum = (t: string): string | null => t.match(/^([一二三四五六七八九十]+)、/)?.[1] ?? null;\n",
    ),
    'src/pages/MathPaperPage.tsx': (
        "  const stripPrefix = (t: string) => t.replace(/^[一二三四五六七八九十]+[、．.]/, '');\n",
        "  // 大题标题去掉「一、」前缀（原卷中文序数由 pq-group-no 徽章承担）；无前缀时徽章退回数组序号\n"
        "  const stripPrefix = (t: string) => t.replace(/^[一二三四五六七八九十]+[、．.]/, '');\n"
        "  const secNum = (t: string): string | null => t.match(/^([一二三四五六七八九十]+)[、．.]/)?.[1] ?? null;\n",
    ),
}

for p, (old, new) in FILES.items():
    s = io.open(p, encoding='utf-8').read()
    assert s.count(old) == 1, (p, 'helper block not found')
    s = s.replace(old, new)
    badge_old = '<b className="pq-group-no">{sec.no}</b>'
    badge_new = '<b className="pq-group-no">{secNum(sec.title) ?? sec.no}</b>'
    assert s.count(badge_old) == 1, (p, 'badge not found')
    s = s.replace(badge_old, badge_new)
    io.open(p, 'w', encoding='utf-8', newline='').write(s)
    print('patched', p)
