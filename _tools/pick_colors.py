# -*- coding: utf-8 -*-
"""为每课搜索「练习/附件」专属色：与同课已有全部色 ΔE76 ≥ 24（亮暗各自约束），带内亮度/饱和度与现色板同调。"""
import io, re, math, colorsys

s = io.open('src/styles/tokens.css', encoding='utf-8').read()
i2 = s.index("[data-theme='dark']")
light_s, dark_s = s[:i2], s[i2:]

def grab(var, text):
    m = re.search(r'--%s:\s*(#[0-9a-fA-F]{6})' % re.escape(var), text)
    return m.group(1) if m else None

def hex2lab(h):
    def f(c): return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = (int(h[i:i+2], 16) / 255 for i in (1, 3, 5))
    X = 0.4124*f(r) + 0.3576*f(g) + 0.1805*f(b)
    Y = 0.2126*f(r) + 0.7152*f(g) + 0.0722*f(b)
    Z = 0.0193*f(r) + 0.1192*f(g) + 0.9505*f(b)
    def g(t): return t ** (1/3) if t > 0.008856 else 7.787 * t + 16/116
    return (116*g(Y)-16, 500*(g(X/0.95047)-g(Y)), 200*(g(Y)-g(Z/1.08883)))

def de(a, b): return math.dist(hex2lab(a), hex2lab(b))

def hsl2hex(h, s_, l):
    r, g, b = colorsys.hls_to_rgb(h/360, l, s_)
    return '#%02x%02x%02x' % (round(r*255), round(g*255), round(b*255))

# 课程 → (基础var, 章节[var...], 亮带, 暗带)
def band(sat_lo, sat_hi, l_lo, l_hi):
    return [(h, s_, l) for h in range(0, 360, 3) for s_ in [x/100 for x in range(int(sat_lo*100), int(sat_hi*100)+1, 4)] for l in [x/100 for x in range(int(l_lo*100), int(l_hi*100)+1, 3)]]

LIGHT_BAND = band(0.25, 0.58, 0.26, 0.44)
DARK_BAND = band(0.40, 0.72, 0.62, 0.80)

COURSES = {
    'algo': (None, [f'deck{i}' for i in range(1, 9)], ('practice',)),
    'os':   ('os', [f'os{i}' for i in range(1, 9)], ('practice', 'att')),
    'net':  ('net', [f'net{i}' for i in range(1, 8)], ('practice', 'att')),
    'pat':  ('pat', [f'pat{i}' for i in range(1, 7)], ('practice', 'att')),
    'ai':   ('ai', [], ('practice', 'att')),
    'sa':   ('sa', [f'sa{i}' for i in range(1, 5)], ('att',)),
    'phys': ('phys', [f'phys{i}' for i in range(1, 13)], ('practice', 'att')),
    'ca':   ('ca', [f'ca{i}' for i in range(1, 15)], ('practice', 'att')),
    'math': ('math', [f'math{i}' for i in range(1, 7)], ('practice', 'att')),
}

MIN_DE = 24.0
out = {}
for name, (base, pre, extra) in COURSES.items():
    for mode, text, band_ in (('light', light_s, LIGHT_BAND), ('dark', dark_s, DARK_BAND)):
        pool = []
        home = grab(base, text) if base else grab('accent', text)
        pool.append(home)
        pool += [grab(v, text) for v in pre]
        pool = [c for c in pool if c]
        out.setdefault(name, {})[mode] = {'pool': pool}

def search(pool, band_, hue_hint=None):
    best = None
    for (h, s_, l) in band_:
        if hue_hint is not None:
            dh = min(abs(h - hue_hint), 360 - abs(h - hue_hint))
            if dh > 25:
                continue
        c = hsl2hex(h, s_, l)
        mn = min(de(c, p) for p in pool)
        if best is None or mn > best[0]:
            best = (mn, c, h)
    return best

for name, (base, pre, extra) in COURSES.items():
    for mode, text, band_ in (('light', light_s, LIGHT_BAND), ('dark', dark_s, DARK_BAND)):
        pool = list(out[name][mode]['pool'])
        hue_hint = None
        for kind in extra:
            mn, c, h = search(pool, band_, hue_hint)
            key = 'practice' if kind == 'practice' else 'att'
            out[name][mode][key] = c
            out[name][mode][key + '_de'] = round(mn, 1)
            pool = pool + [c]
            if hue_hint is None:
                hue_hint = h

for name, v in out.items():
    for mode in ('light', 'dark'):
        d = v[mode]
        parts = []
        for k in ('practice', 'att'):
            if k in d:
                parts.append(f"{k}={d[k]}(minDE {d[k+'_de']})")
        print(f"{name}/{mode}: {' '.join(parts)}")

io.open('_tools/color_pick.json', 'w', encoding='utf-8').write(json.dumps(out, ensure_ascii=False, indent=1))
