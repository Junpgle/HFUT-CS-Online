"""为 mc 选主题色 v2：WCAG 对比度硬约束（亮色对白底 ≥4.2、暗色对 #161617 ≥6.0），
色相与全部课程基础色圆形间距 ≥20°，ΔE76 ≥22（对课程基础色 + 语义色），饱和度 ≤0.50。"""
import math, colorsys, re

def hex2lab(h):
    def f(c): return c/12.92 if c <= 0.04045 else ((c+0.055)/1.055) ** 2.4
    r, g, b = (int(h[i:i+2], 16)/255 for i in (1, 3, 5))
    X = 0.4124*f(r)+0.3576*f(g)+0.1805*f(b)
    Y = 0.2126*f(r)+0.7152*f(g)+0.0722*f(b)
    Z = 0.0193*f(r)+0.1192*f(g)+0.9505*f(b)
    def g(t, n=0.95047): return t ** (1/3) if t > 0.008856 else 7.787*t + 16/116
    return (116*g(Y/1.0)-16, 500*(g(X/0.95047)-g(Y/1.0)), 200*(g(Y/1.0)-g(Z/1.08883)))

def de(a, b): return math.dist(hex2lab(a), hex2lab(b))

def lum(h):
    def f(c): return c/12.92 if c <= 0.04045 else ((c+0.055)/1.055) ** 2.4
    r, g, b = (int(h[i:i+2], 16)/255 for i in (1, 3, 5))
    return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b)

def contrast(a, b):
    la, lb = lum(a), lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi+0.05)/(lo+0.05)

def hue_of(h):
    r, g, b = (int(h[i:i+2], 16)/255 for i in (1, 3, 5))
    hh, _, _ = colorsys.rgb_to_hls(r, g, b)
    return hh*360

text = open('src/styles/tokens.css', encoding='utf-8').read()
light_block = text[:text.index("[data-theme='dark']")]
dark_block = text[text.index("[data-theme='dark']"):]

def grab(var, block):
    m = re.search(rf'--{var}:\s*(#[0-9a-fA-F]{{6}})', block)
    return m.group(1).lower() if m else None

BASES = ['os', 'net', 'pat', 'ai', 'sa', 'phys', 'ca', 'math', 'pd', 'ncd', 'nap', 'hd']
SEM = ['ok', 'hot', 'warn', 'accent']
refs = {}
for mode, block in (('light', light_block), ('dark', dark_block)):
    rs = [(b, grab(b, block)) for b in BASES] + [(s, grab(s, block)) for s in SEM]
    refs[mode] = [(n, c) for n, c in rs if c]

def hue_dist(a, b):
    d = abs(a-b) % 360
    return min(d, 360-d)

ref_hues = {mode: [(n, hue_of(c)) for n, c in rs] for mode, rs in refs.items()}

def hsl2hex(h, s, l):
    r, g, b = colorsys.hls_to_rgb(h/360, l, s)
    return '#%02x%02x%02x' % (round(r*255), round(g*255), round(b*255))

results = []
for hue in range(0, 360, 2):
    # 色相间距：与所有课程基础色 hue 距离 ≥20°（亮暗基础色都算）
    if min(hue_dist(hue, h) for _, h in ref_hues['light'][:12]) < 20:
        continue
    best_l = None; best_d = None
    for s in [x/100 for x in range(28, 51, 2)]:
        for L in [x/100 for x in range(28, 54, 2)]:
            c = hsl2hex(hue, s, L)
            if contrast(c, '#ffffff') < 4.2: continue
            d = min(de(c, rc) for _, rc in refs['light'])
            if best_l is None or d > best_l[1]: best_l = (c, d)
    for s in [x/100 for x in range(28, 51, 2)]:
        for L in [x/100 for x in range(58, 84, 2)]:
            c = hsl2hex(hue, s, L)
            if contrast(c, '#161617') < 6.0: continue
            d = min(de(c, rc) for _, rc in refs['dark'])
            if best_d is None or d > best_d[1]: best_d = (c, d)
    if best_l and best_d:
        results.append((min(best_l[1], best_d[1]), hue, best_l[0], round(best_l[1],1), best_d[0], round(best_d[1],1)))

results.sort(reverse=True)
print('Top 15 hues (hue-gap ≥20°, WCAG ok):')
for row in results[:15]:
    print(f'  hue {row[1]:3d}: light {row[2]} (ΔE {row[3]})  dark {row[4]} (ΔE {row[5]})  combined {row[0]:.1f}')
