import io

# os/ca/math 试卷页组头对齐 net/ai/phys 的设计：徽章=题型短名，标题保留原卷「一、二」序数
# （此前徽章=大题数组序号，题型过滤后首组孤立显示「3」被误读为错误标记）

for p, label in [
    ('src/pages/OsPaperPage.tsx', 'OS_KIND_LABEL'),
    ('src/pages/CaPaperPage.tsx', 'CA_KIND_LABEL'),
    ('src/pages/MathPaperPage.tsx', 'MATH_KIND_LABEL'),
]:
    s = io.open(p, encoding='utf-8').read()

    # 1) 撤掉 secNum helper
    secnum_block = (
        "  // 标题开头的原卷大题序数（一、二、…），无前缀时徽章退回数组序号\n"
        "  const secNum = (t: string): string | null => t.match(/^([一二三四五六七八九十]+)、/)?.[1] ?? null;\n"
    )
    secnum_block_math = (
        "  const secNum = (t: string): string | null => t.match(/^([一二三四五六七八九十]+)[、．.]/)?.[1] ?? null;\n"
    )
    if secnum_block in s:
        s = s.replace(secnum_block, '')
    elif secnum_block_math in s:
        s = s.replace(secnum_block_math, '')
    else:
        raise AssertionError((p, 'secNum not found'))

    # 2) 徽章 → 题型短名；标题保留原卷序数
    badge_old = '<b className="pq-group-no">{secNum(sec.title) ?? sec.no}</b>'
    badge_new = f'<b className="pq-group-no">{{{label}[kind]}}</b>'
    assert s.count(badge_old) == 1, (p, 'badge not found')
    s = s.replace(badge_old, badge_new)

    head_old = '{stripPrefix(sec.title)} · {sectionCounts.get(sec.no) ?? 0} 题'
    head_new = '{sec.title} · {sectionCounts.get(sec.no) ?? 0} 题'
    assert s.count(head_old) == 1, (p, 'title not found')
    s = s.replace(head_old, head_new)

    # 3) 注释校准（stripPrefix 仅剩分段导航 tooltip 使用）
    s = s.replace(
        '  // 大题标题去掉「一、」前缀（原卷中文序数由 pq-group-no 徽章承担）\n',
        '  // 分段导航的 tooltip 用紧凑大题名（去掉「一、」前缀）\n',
    )

    io.open(p, 'w', encoding='utf-8', newline='').write(s)
    print('patched', p)
