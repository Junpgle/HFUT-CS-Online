# -*- coding: utf-8 -*-
"""练习/附件选色 v2：候选池=全站现有灰调色板并集；约束=课内 ΔE≥20、导航相邻 ΔE≥24，目标=相邻距离最大。"""
import io, re, math, json, colorsys

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

def hue_of(h):
    r, g, b = (int(h[i:i+2], 16) / 255 for i in (1, 3, 5))
    hh, _, _ = colorsys.rgb_to_hls(r, g, b)
    return hh * 360

CH = [f'deck{i}' for i in range(1, 9)] + [f'{c}{i}' for c in ('os', 'net', 'pat', 'sa', 'phys', 'ca', 'math') for i in range(1, 15)]
BASES = ['os', 'net', 'pat', 'ai', 'sa', 'phys', 'ca', 'math', 'accent']

GLOBAL_LIGHT, GLOBAL_DARK = [], []
for v in CH:
    c1, c2 = grab(v, light_s), grab(v, dark_s)
    if c1: GLOBAL_LIGHT.append(c1)
    if c2: GLOBAL_DARK.append(c2)
for b in BASES:
    c1, c2 = grab(b, light_s), grab(b, dark_s)
    if c1: GLOBAL_LIGHT.append(c1)
    if c2: GLOBAL_DARK.append(c2)
GLOBAL_LIGHT = sorted(set(GLOBAL_LIGHT))
GLOBAL_DARK = sorted(set(GLOBAL_DARK))
print(f'全局候选池：light {len(GLOBAL_LIGHT)} 色 / dark {len(GLOBAL_DARK)} 色')

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

def pick(own, prev_color, pool, mode_text, hue_hint, min_all=20.0, min_adj=24.0):
    """在 pool 里选色：与本课所有色 ≥ min_all，与导航相邻色 ≥ min_adj；目标=相邻距离最大。"""
    best = None
    for c in pool:
        if c in own:
            continue
        if min(de(c, p) for p in own) < min_all:
            continue
        if hue_hint is not None:
            dh = min(abs(hue_of(c) - hue_hint), 360 - abs(hue_of(c) - hue_hint))
            if dh > 30:
                continue
        adj = [de(c, prev_color)] if prev_color else []
        if not adj or min(adj) < min_adj:
            continue
        score = (min(adj), min(de(c, p) for p in own))
        if best is None or score > best[0]:
            best = (score, c, hue_of(c))
    return best

result = {}
for name, (base, pre, extra) in COURSES.items():
    result[name] = {}
    for mode, text, gpool in (('light', light_s, GLOBAL_LIGHT), ('dark', dark_s, GLOBAL_DARK)):
        home = grab(base, text) if base else grab('accent', text)
        own = [home] + [grab(v, text) for v in pre]
        own = [c for c in own if c]
        seq = [home] + [grab(v, text) for v in pre]  # 导航顺序（练习/附件在尾部）
        seq = [c for c in seq if c]
        hue_hint = None
        for kind in extra:
            prev = seq[-1]
            b = pick(set(own), prev, gpool, text, hue_hint)
            if b is None:
                # 放宽相邻阈值重试
                b = pick(set(own), prev, gpool, text, hue_hint, min_adj=22.0)
            if b is None:
                print(f'{name}/{mode}/{kind}: 无解')
                continue
            score, c, h = b
            key = f'{kind}_{"light" if mode == "light" else "dark"}'
            result[name][key] = c
            result[name][key + '_adj'] = round(score[0], 1)
            own.append(c)
            seq.append(c)
            if hue_hint is None:
                hue_hint = h

for name, v in result.items():
    parts = [f'{k}={v[k]}' for k in v if not k.endswith('_adj')]
    print(name, ' '.join(parts))
io.open('_tools/color_pick2.json', 'w', encoding='utf-8').write(json.dumps(result, ensure_ascii=False, indent=1))
