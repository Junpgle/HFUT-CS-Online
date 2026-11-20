import io

p = 'scripts/build-catalog.mjs'
s = io.open(p, encoding='utf-8').read()

old = """        node.r = first.r;
        node.sp = first.sp.slice(0, first.sp.lastIndexOf('/'));"""
new = """        node.r = first.r;
        const i = first.sp.lastIndexOf('/');
        node.sp = i > 0 ? first.sp.slice(0, i) : '';"""
assert s.count(old) == 1
s = s.replace(old, new)

io.open(p, 'w', encoding='utf-8', newline='').write(s)
print('patched')
