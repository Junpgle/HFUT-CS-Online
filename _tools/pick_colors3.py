# -*- coding: utf-8 -*-
"""选色 v3：混合候选（灰调 HSL 带 + 全站色池）；相邻 ≥22、课内其余 ≥16；目标=(相邻距离, 全局距离) 双最大。"""
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

def hsl2hex(h, s_, l):
    r, g, b = colorsys.hls_to_rgb(h/360, l, s_)
    return '#%02x%02x%02x' % (round(r*255), round(g*255), round(b*255))

def candidates(mode):
    out = set()
    if mode == 'light':
        for h in range(0, 360, 2):
            for s_ in [0.28, 0.34, 0.40, 0.46, 0.50]:
                for l in [0.28, 0.32, 0.36, 0.40, 0.42]:
                    out.add(hsl2hex(h, s_, l))
    else:
        for h in range(0, 360, 2):
            for s_ in [0.42, 0.48, 0.54, 0.60, 0.64]:
                for l in [0.64, 0.68, 0.72, 0.76, 0.78]:
                    out.add(hsl2hex(h, s_, l))
    return out

CH = [f'deck{i}' for i in range(1, 9)] + [f'{c}{i}' for c in ('os', 'net', 'pat', 'sa', 'phys', 'ca', 'math') for i in range(1, 15)]
BASES = ['os', 'net', 'pat', 'ai', 'sa', 'phys', 'ca', 'math', 'accent']

SEMANTIC = set()
for v in ('ok', 'hot', 'warn', 'accent'):
    m1, m2 = grab(v, light_s), grab(v, dark_s)
    if m1: SEMANTIC.add(m1)
    if m2: SEMANTIC.add(m2)

def pool_of(mode_text):
    pool = set()
    for v in CH:
        c = grab(v, mode_text)
        if c: pool.add(c)
    for b in BASES:
        c = grab(b, mode_text)
        if c: pool.add(c)
    return (pool | candidates('light' if mode_text is light_s else 'dark')) - SEMANTIC

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

def pick(own, adj_targets, cand, hue_hint, min_all=22.0, min_adj=22.0):
    best = None
    for c in cand:
        if c in own:
            continue
        mn_all = min(de(c, p) for p in own)
        if mn_all < min_all:
            continue
        if hue_hint is not None:
            dh = min(abs(hue_of(c) - hue_hint), 360 - abs(hue_of(c) - hue_hint))
            if dh > 30:
                continue
        mn_adj = min(de(c, t) for t in adj_targets)
        if mn_adj < min_adj:
            continue
        score = (mn_all, mn_adj)
        if best is None or score > best[0]:
            best = (score, c, hue_of(c))
    return best

def pick_fallback(own, adj, cand, hint):
    for ma in (22.0, 20.0, 18.0, 16.0):
        b = pick(own, adj, cand, hint, min_all=ma)
        if b:
            return b
    return None

result = {}
for name, (base, pre, extra) in COURSES.items():
    result[name] = {}
    for mode, text in (('light', light_s), ('dark', dark_s)):
        cand = pool_of(text)
        home = grab(base, text) if base else grab('accent', text)
        own = [home] + [grab(v, text) for v in pre]
        own = [c for c in own if c]
        seq = list(own)
        hue_hint = None
        for kind in extra:
            b = pick_fallback(set(own), [seq[-1]], cand, hue_hint)
            assert b, f'{name}/{mode}/{kind} 无解'
            score, c, h = b
            key = f'{kind}_{mode}'
            result[name][key] = c
            result[name][key + '_adj'] = round(score[1], 1)
            result[name][key + '_minall'] = round(score[0], 1)
            own.append(c); seq.append(c)
            if hue_hint is None:
                hue_hint = h
    # ca：第13讲（CA13）与基础色精确重复 → 重选
    if name == 'ca':
        for mode, text in (('light', light_s), ('dark', dark_s)):
            home = grab('ca', text)
            ch = [grab(f'ca{i}', text) for i in range(1, 15)]
            own = set(ch) | {result['ca'].get(f'practice_{mode}'), result['ca'].get(f'att_{mode}')}
            own.discard(None)
            b = pick_fallback(own, [ch[11], ch[13]], pool_of(text), None)  # 相邻=CA12、CA14
            assert b, f'ca/{mode}/ca13 无解'
            result['ca'][f'ca13_{mode}'] = b[1]
            result['ca'][f'ca13_{mode}_adj'] = round(b[0][0], 1)
    # algo：dark 下 deck1~deck2 相近 → 重选 deck2 dark
    if name == 'algo':
        d1, d3 = grab('deck1', dark_s), grab('deck3', dark_s)
        own = set(grab(f'deck{i}', dark_s) for i in range(1, 9)) | {result['algo'].get('practice_dark')}
        own.discard(None)
        b = pick_fallback(own, [d1, d3], pool_of(dark_s), hue_of(grab('deck2', light_s)))
        assert b, 'algo deck2 dark 无解'
        result['algo']['deck2_dark'] = b[1]
        result['algo']['deck2_dark_adj'] = round(b[0][0], 1)

for name, v in result.items():
    print(name, {k: x for k, x in v.items()})
io.open('_tools/color_pick3.json', 'w', encoding='utf-8').write(json.dumps(result, ensure_ascii=False, indent=1))
