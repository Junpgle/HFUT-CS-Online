import csv, io, os

rows = list(csv.reader(io.open('data/文件清单.csv', encoding='utf-8-sig')))
header, body = rows[0], rows[1:]
print('表头:', header)
bad = [r for r in body if len(r) != 5]
print('字段数异常行:', len(bad), bad[:2])
proc = {}
for r in body:
    proc[r[4]] = proc.get(r[4], 0) + 1
print('处理方式分布:', proc)

m = {r[2] for r in body if len(r) == 5}
missing_total, sample = 0, []
SEMS = ['大一上', '大一下', '大二上', '大二下', '大三上', '大三下', '大四上', '大四下']
for sem in SEMS:
    d1 = os.path.join('data', sem)
    if not os.path.isdir(d1):
        continue
    for c in os.listdir(d1):
        d2 = os.path.join(d1, c)
        if not os.path.isdir(d2):
            continue
        for root, _, files in os.walk(d2):
            for f in files:
                rel = os.path.relpath(os.path.join(root, f), 'data').replace(os.sep, '/')
                if rel not in m:
                    missing_total += 1
                    if len(sample) < 5:
                        sample.append(rel)
print('data/ 中未溯源文件数:', missing_total)
for s in sample:
    print('  ', s)
