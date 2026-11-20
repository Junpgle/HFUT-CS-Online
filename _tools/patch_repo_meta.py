# -*- coding: utf-8 -*-
"""build-catalog：类别根直属的 README*（上游仓库说明文件）不入附件树；更深层的 ReadMe.txt（实验工程文档）保留。"""
import io

BS = chr(92)  # 反斜杠
p = 'scripts/build-catalog.mjs'
s = io.open(p, encoding='utf-8').read()
lines = s.split('\n')

IS_META = [
    '  // 上游仓库自带的说明文件（README*）不算课程附件——仅限课程目录/类别目录（课件/试题/附件）',
    '  // 直属的那一层；实验工程等更深目录里的 ReadMe.txt 是课程内容，保留',
    "  const isRepoMeta = (name, e) => /^readme/i.test(name) && relative(dir, e.p).replaceAll('" + BS * 2 + "', '/').split('/').length <= 2;",
]

if any('isRepoMeta' in l for l in lines):
    print('already patched')
else:
    # 1) pushChildren 前插入 isRepoMeta 定义
    i = lines.index('  const pushChildren = (d, siblings) => {')
    lines[i:i] = IS_META

    # 2) pushChildren 的 else 分支：siblings.push(fileNode(...)) 前一个 "} else {" 改为带过滤
    j = lines.index('        siblings.push(fileNode(e.name, rel, e.st.size));', i)
    k = j - 1
    assert lines[k] == '      } else {', lines[k]
    lines[k:k] = ['      } else if (isRepoMeta(e.name, e)) {', '        continue;']

    # 3) 顶层循环的 fileNode 分支同样过滤
    j2 = lines.index('      bucket.push(fileNode(e.name, e.name, e.st.size));')
    k2 = j2 - 1
    assert lines[k2] == '    } else {', lines[k2]
    lines[k2] = '    } else if (!isRepoMeta(e.name, e)) {'

    io.open(p, 'w', encoding='utf-8', newline='').write('\n'.join(lines))
    print('patched')
