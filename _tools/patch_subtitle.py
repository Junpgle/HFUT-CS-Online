import io, re

# 顶栏副标题（课程名右侧的「第 N 讲 · 标题」）冗余：导航栏激活 tab 已给出位置。
# 删 TopBar.subtitle prop + 8 门课的传参/推导 + .topbar-sub CSS

# 1) TopBar.tsx：接口字段、解构、渲染行
p = 'src/components/TopBar.tsx'
s = io.open(p, encoding='utf-8').read()
assert s.count('  subtitle?: string;\n') == 1
s = s.replace('  subtitle?: string;\n', '')
assert s.count('  subtitle,\n') == 1
s = s.replace('  subtitle,\n', '')
assert s.count("        {subtitle && <span className=\"topbar-sub\">{decodeEntities(subtitle)}</span>}\n") == 1
s = s.replace("        {subtitle && <span className=\"topbar-sub\">{decodeEntities(subtitle)}</span>}\n", '')
# decodeEntities 仅 subtitle 行使用，import 一并删
assert s.count("import { decodeEntities } from '../lib/text';\n") == 1
s = s.replace("import { decodeEntities } from '../lib/text';\n", '')
io.open(p, 'w', encoding='utf-8', newline='').write(s)
print('TopBar ok')

# 2) 课程文件：删 subtitle={...} 传参行 + const subtitle 推导行
for p in [
    'src/courses/AlgorithmCourse.tsx',
    'src/courses/MathCourse.tsx',
    'src/courses/OsCourse.tsx',
    'src/courses/NetworkCourse.tsx',
    'src/courses/CaCourse.tsx',
    'src/courses/PatCourse.tsx',
    'src/courses/PhysCourse.tsx',
    'src/courses/SaCourse.tsx',
]:
    s = io.open(p, encoding='utf-8').read()
    s, n1 = re.subn(r'\n[ \t]*const subtitle = [^\n]*\n', '', s)
    s, n2 = re.subn(r'\n[ \t]*subtitle=\{subtitle\}', '', s)
    assert n1 == 1 and n2 == 1, (p, n1, n2)
    io.open(p, 'w', encoding='utf-8', newline='').write(s)
    print(p, 'ok')

# 3) base.css：删 .topbar-sub 规则（含两处 display:none 媒体查询）
p = 'src/styles/base.css'
s = io.open(p, encoding='utf-8').read()
old = """.topbar-sub {
  color: var(--ink-3);
  font-size: 0.8125rem;
  padding-left: 12px;
  border-left: 1px solid var(--hairline);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
"""
assert s.count(old) == 1
s = s.replace(old, '')

# 窄桌面媒体查询：副标题退场注释与规则一并删
old2 = """
/* 窄桌面：副标题退场（信息在激活 tab 与 h1 中都有），让位讲次 tabs（短写法「1讲」后 7px 才不溢出，1100px 实测） */
@media (max-width: 1279px) {
  .topbar-sub {
    display: none;
  }
"""
new2 = """
/* 窄桌面：让位讲次 tabs（短写法「1讲」后 7px 才不溢出，1100px 实测） */
@media (max-width: 1279px) {
"""
assert s.count(old2) == 1
s = s.replace(old2, new2)

old3 = """
  .topbar-sub {
    display: none;
  }
}
@media (min-width: 1021px) {
"""
new3 = """
}
@media (min-width: 1021px) {
"""
assert s.count(old3) == 1
s = s.replace(old3, new3)

io.open(p, 'w', encoding='utf-8', newline='').write(s)
print('base.css ok')
