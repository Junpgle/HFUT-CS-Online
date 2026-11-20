# -*- coding: utf-8 -*-
"""九课导航色点 + 练习/附件页 data-pg 专属色效果（两态：practice/att）。"""
import io

def patch(path, pairs):
    s = io.open(path, encoding='utf-8').read()
    changed = False
    for old, new in pairs:
        if new in s and old not in s:
            continue  # 幂等：已应用过
        assert s.count(old) == 1, (path, old[:70])
        s = s.replace(old, new)
        changed = True
    if changed:
        io.open(path, 'w', encoding='utf-8', newline='').write(s)
    print('ok', path)

def pg_two(cond1, v1, cond2, v2, deps):
    """pg = cond1 ? v1 : cond2 ? v2 : 无"""
    return f"""
  // 练习/附件页专属色：html[data-pg] → tokens.css 覆盖 --deck-accent（不与总目录、各章重复）
  useEffect(() => {{
    const pg = {cond1} ? '{v1}' : {cond2} ? '{v2}' : null;
    if (pg) document.documentElement.dataset.pg = pg;
    else delete document.documentElement.dataset.pg;
    return () => {{
      delete document.documentElement.dataset.pg;
    }};
  }}, [{deps}]);
"""

def pg_one(cond, v, deps):
    return f"""
  // 练习/附件页专属色：html[data-pg] → tokens.css 覆盖 --deck-accent（不与总目录、各章重复）
  useEffect(() => {{
    if ({cond}) document.documentElement.dataset.pg = '{v}';
    else delete document.documentElement.dataset.pg;
    return () => {{
      delete document.documentElement.dataset.pg;
    }};
  }}, [{deps}]);
"""

# ---------------- 算法课（仅练习） ----------------
patch('src/courses/AlgorithmCourse.tsx', [
    ("""  const onPractice = location.pathname.startsWith(`${ALGO_BASE}/practice`);""",
     """  const onPractice = location.pathname.startsWith(`${ALGO_BASE}/practice`);""" + pg_one('onPractice', 'practice', 'onPractice')),
    ("""      { to: `${ALGO_BASE}`, full: '总目录', short: '目录', active: !currentDeck && !onPractice, key: null, tip: '课程首页 · 考点速查表' },""",
     """      { to: `${ALGO_BASE}`, full: '总目录', short: '目录', active: !currentDeck && !onPractice, key: null, tip: '课程首页 · 考点速查表', dot: 'var(--accent)' },"""),
    ("""        active: d.id === currentDeck,
        key: d.id,
        tip: decodeEntities(d.title),
      })),""",
     """        active: d.id === currentDeck,
        key: d.id,
        tip: decodeEntities(d.title),
        dot: `var(--${d.id})`,
      })),"""),
    ("""        tip: '在线练习 · 420 题自测',
        extra: 'practice-tab',
      },""",
     """        tip: '在线练习 · 420 题自测',
        extra: 'practice-tab',
        dot: 'var(--deck-practice)',
      },"""),
])

# ---------------- OS（练习+附件） ----------------
patch('src/courses/OsCourse.tsx', [
    ("""  const onAtt = location.pathname.startsWith(`${OS_BASE}/attachments`);""",
     """  const onAtt = location.pathname.startsWith(`${OS_BASE}/attachments`);""" + pg_two('onPractice', 'practice', 'onAtt', 'att', 'onPractice, onAtt')),
    ("""      { to: `${OS_BASE}`, full: '总目录', short: '目录', active: !currentChapter && !onPractice && !onAtt, key: null, tip: '课程首页 · 课程与资料概况' },""",
     """      { to: `${OS_BASE}`, full: '总目录', short: '目录', active: !currentChapter && !onPractice && !onAtt, key: null, tip: '课程首页 · 课程与资料概况', dot: 'var(--os)' },"""),
    ("""        active: c.id === currentChapter,
        key: c.id,
        tip: decodeEntities(c.title),
      })),""",
     """        active: c.id === currentChapter,
        key: c.id,
        tip: decodeEntities(c.title),
        dot: `var(--os${c.id.slice(2)})`,
      })),"""),
    ("""        tip: '在线练习 · 4 份试卷',
        extra: 'practice-tab',
      },""",
     """        tip: '在线练习 · 4 份试卷',
        extra: 'practice-tab',
        dot: 'var(--os-practice)',
      },"""),
    ("""        tip: '附件资料 · 课件 / 试题 / 附件目录与预览',
      },
    ],""",
     """        tip: '附件资料 · 课件 / 试题 / 附件目录与预览',
        dot: 'var(--os-att)',
      },
    ],"""),
])

# ---------------- 计网（练习+附件） ----------------
patch('src/courses/NetworkCourse.tsx', [
    ("""  const onAtt = location.pathname.startsWith(`${NET_BASE}/attachments`);""",
     """  const onAtt = location.pathname.startsWith(`${NET_BASE}/attachments`);""" + pg_two('practiceActive', 'practice', 'onAtt', 'att', 'practiceActive, onAtt')),
    ("""      { to: `${NET_BASE}`, full: '总目录', short: '目录', active: !currentChapter && !practiceActive && !onAtt, key: null, tip: '课程首页 · 七章总览' },""",
     """      { to: `${NET_BASE}`, full: '总目录', short: '目录', active: !currentChapter && !practiceActive && !onAtt, key: null, tip: '课程首页 · 七章总览', dot: 'var(--net)' },"""),
    ("""        active: d.id === currentChapter,
        key: 'net',
        tip: decodeEntities(d.title),
      })),""",
     """        active: d.id === currentChapter,
        key: 'net',
        tip: decodeEntities(d.title),
        dot: `var(--net${d.id.slice(2)})`,
      })),"""),
    ("""        tip: '在线练习 · 3 套期末试卷',
        extra: 'practice-tab',
      },""",
     """        tip: '在线练习 · 3 套期末试卷',
        extra: 'practice-tab',
        dot: 'var(--net-practice)',
      },"""),
    ("""        tip: '附件资料 · 课件 / 试题 / 附件目录与预览',
      },
    ],
    [currentChapter, practiceActive, onAtt],""",
     """        tip: '附件资料 · 课件 / 试题 / 附件目录与预览',
        dot: 'var(--net-att)',
      },
    ],
    [currentChapter, practiceActive, onAtt],"""),
])

# ---------------- pat（练习+附件） ----------------
patch('src/courses/PatCourse.tsx', [
    ("""  const onAtt = location.pathname.startsWith(`${PAT_BASE}/attachments`);""",
     """  const onAtt = location.pathname.startsWith(`${PAT_BASE}/attachments`);""" + pg_two('onPractice', 'practice', 'onAtt', 'att', 'onPractice, onAtt')),
    ("""      { to: `${PAT_BASE}`, full: '总目录', short: '目录', active: !currentDeck && !onPractice && !onAtt, key: null, tip: '课程主页 · 内容地图与课程实验' },""",
     """      { to: `${PAT_BASE}`, full: '总目录', short: '目录', active: !currentDeck && !onPractice && !onAtt, key: null, tip: '课程主页 · 内容地图与课程实验', dot: 'var(--pat)' },"""),
    ("""        active: d.id === currentDeck,
        key: null,
        tip: decodeEntities(d.title),
      })),""",
     """        active: d.id === currentDeck,
        key: null,
        tip: decodeEntities(d.title),
        dot: `var(--pat${d.id.slice(4)})`,
      })),"""),
    ("""        tip: '在线练习 · 2019 省赛 12 题',
        extra: 'practice-tab',
      },""",
     """        tip: '在线练习 · 2019 省赛 12 题',
        extra: 'practice-tab',
        dot: 'var(--pat-practice)',
      },"""),
    ("""        tip: '附件资料 · 课件 / 试题 / 附件目录与预览',
      },
    ],
    [currentDeck, onPractice, onAtt],""",
     """        tip: '附件资料 · 课件 / 试题 / 附件目录与预览',
        dot: 'var(--pat-att)',
      },
    ],
    [currentDeck, onPractice, onAtt],"""),
])

# ---------------- AI（练习为默认页 + 附件） ----------------
patch('src/courses/AiCourse.tsx', [
    ("""  const onAtt = location.pathname.startsWith(`${AI_BASE}/attachments`);""",
     """  const onAtt = location.pathname.startsWith(`${AI_BASE}/attachments`);""" + pg_two('!onAtt', 'practice', 'onAtt', 'att', 'onAtt')),
    ("""        tip: '设计报告题库 · 15 个选题',
        extra: 'practice-tab',
      },""",
     """        tip: '设计报告题库 · 15 个选题',
        extra: 'practice-tab',
        dot: 'var(--ai-practice)',
      },"""),
    ("""        tip: '附件资料 · 课件 / 试题 / 附件目录与预览',
      },
    ],
    [s, onAtt],""",
     """        tip: '附件资料 · 课件 / 试题 / 附件目录与预览',
        dot: 'var(--ai-att)',
      },
    ],
    [s, onAtt],"""),
])

# ---------------- 软体（仅附件） ----------------
patch('src/courses/SaCourse.tsx', [
    ("""  const onAtt = location.pathname.startsWith(`${SA_BASE}/attachments`);""",
     """  const onAtt = location.pathname.startsWith(`${SA_BASE}/attachments`);""" + pg_one('onAtt', 'att', 'onAtt')),
    ("""        active: !currentChapter && !onAtt,
        key: null,
        tip: '课程首页 · 章节脉络',
      },""",
     """        active: !currentChapter && !onAtt,
        key: null,
        tip: '课程首页 · 章节脉络',
        dot: 'var(--sa)',
      },"""),
    ("""      ...saChapters.map((d) => ({
        to: `${SA_BASE}/deck/${d.id}`,
        full: d.no === '专题' ? 'RSA 专题' : d.no,
        short: d.no === '专题' ? '专' : d.no.replace('第', '').replace('章', ''),
        active: d.id === currentChapter,
        key: null,
        tip: decodeEntities(d.title),
      })),""",
     """      ...saChapters.map((d, i) => ({
        to: `${SA_BASE}/deck/${d.id}`,
        full: d.no === '专题' ? 'RSA 专题' : d.no,
        short: d.no === '专题' ? '专' : d.no.replace('第', '').replace('章', ''),
        active: d.id === currentChapter,
        key: null,
        tip: decodeEntities(d.title),
        dot: `var(--sa${i + 1})`,
      })),"""),
    ("""        tip: '附件资料 · 课件 / 试题 / 附件目录与预览',
      },
    ],""",
     """        tip: '附件资料 · 课件 / 试题 / 附件目录与预览',
        dot: 'var(--sa-att)',
      },
    ],"""),
])

# ---------------- 物理（练习+附件） ----------------
patch('src/courses/PhysCourse.tsx', [
    ("""  const onAtt = location.pathname.startsWith(`${PHYS_BASE}/attachments`);""",
     """  const onAtt = location.pathname.startsWith(`${PHYS_BASE}/attachments`);""" + pg_two('onPractice', 'practice', 'onAtt', 'att', 'onPractice, onAtt')),
    ("""      { to: `${PHYS_BASE}`, full: '总目录', short: '目录', active: !currentDeck && !onPractice && !onAtt, key: null, tip: '课程主页 · 内容地图与参考资料' },""",
     """      { to: `${PHYS_BASE}`, full: '总目录', short: '目录', active: !currentDeck && !onPractice && !onAtt, key: null, tip: '课程主页 · 内容地图与参考资料', dot: 'var(--phys)' },"""),
    ("""        active: d.id === currentDeck,
        key: null,
        tip: decodeEntities(d.title),
      })),""",
     """        active: d.id === currentDeck,
        key: null,
        tip: decodeEntities(d.title),
        dot: `var(--phys${i + 1})`,
      })),"""),
    ("""        tip: '在线练习 · 4 份期末试卷 42 题',
        extra: 'practice-tab',
      },""",
     """        tip: '在线练习 · 4 份期末试卷 42 题',
        extra: 'practice-tab',
        dot: 'var(--phys-practice)',
      },"""),
    ("""        tip: '附件资料 · 课件 / 试题 / 附件目录与预览',
      },
    ],
    [currentDeck, onPractice, onAtt],""",
     """        tip: '附件资料 · 课件 / 试题 / 附件目录与预览',
        dot: 'var(--phys-att)',
      },
    ],
    [currentDeck, onPractice, onAtt],"""),
])

# ---------------- CA（练习+附件；单元按钮=落点讲色） ----------------
patch('src/courses/CaCourse.tsx', [
    ("""  const onAtt = location.pathname.startsWith(`${CA_BASE}/attachments`);""",
     """  const onAtt = location.pathname.startsWith(`${CA_BASE}/attachments`);""" + pg_two('onPractice', 'practice', 'onAtt', 'att', 'onPractice, onAtt')),
    ("""        return {
          to: `${CA_BASE}/chapter/${c.id}`,
          label: `${c.no} ${decodeEntities(c.title)}`,
          active: c.id === currentChapter,
          tip: decodeEntities(c.title),
        };""",
     """        return {
          to: `${CA_BASE}/chapter/${c.id}`,
          label: `${c.no} ${decodeEntities(c.title)}`,
          active: c.id === currentChapter,
          tip: decodeEntities(c.title),
          dot: `var(--ca${c.id.slice(2)})`,
        };"""),
    ("""      return {
        to: menu[0].to,
        full: u.name,
        short: u.name,
        active: u.chapters.includes(currentChapter ?? ''),
        key: currentChapter && u.chapters.includes(currentChapter) ? currentChapter : null,
        tip: u.tip,
        menu,
      };""",
     """      return {
        to: menu[0].to,
        full: u.name,
        short: u.name,
        active: u.chapters.includes(currentChapter ?? ''),
        key: currentChapter && u.chapters.includes(currentChapter) ? currentChapter : null,
        tip: u.tip,
        menu,
        dot: `var(--ca${u.chapters[0].slice(2)})`,
      };"""),
    ("""tip: '在线练习 · 3 份试题', extra: 'practice-tab' },""",
     """tip: '在线练习 · 3 份试题', extra: 'practice-tab', dot: 'var(--ca-practice)' },"""),
    ("""      { to: `${CA_BASE}/attachments`, full: '附件', short: '附件', active: onAtt, key: null, tip: '附件资料 · 课件 / 试题 / 附件目录与预览' },""",
     """      { to: `${CA_BASE}/attachments`, full: '附件', short: '附件', active: onAtt, key: null, tip: '附件资料 · 课件 / 试题 / 附件目录与预览', dot: 'var(--ca-att)' },"""),
])

# ---------------- 高数（练习+附件） ----------------
patch('src/courses/MathCourse.tsx', [
    ("""  const onAtt = location.pathname.startsWith(`${MATH_BASE}/attachments`);""",
     """  const onAtt = location.pathname.startsWith(`${MATH_BASE}/attachments`);""" + pg_two('onPractice', 'practice', 'onAtt', 'att', 'onPractice, onAtt')),
    ("""      { to: `${MATH_BASE}`, full: '总目录', short: '目录', active: !currentChapter && !onPractice && !onAtt, key: null, tip: '课程首页 · 课程与资料概况' },""",
     """      { to: `${MATH_BASE}`, full: '总目录', short: '目录', active: !currentChapter && !onPractice && !onAtt, key: null, tip: '课程首页 · 课程与资料概况', dot: 'var(--math)' },"""),
    ("""      ...mathChapters.map((c) => ({
        to: `${MATH_BASE}/chapter/${c.id}`,
        full: c.no,
        short: c.no.replace('第', '').replace('章', ''),
        active: c.id === currentChapter,
        key: null,
        tip: decodeEntities(c.title),
      })),""",
     """      ...mathChapters.map((c, i) => ({
        to: `${MATH_BASE}/chapter/${c.id}`,
        full: c.no,
        short: c.no.replace('第', '').replace('章', ''),
        active: c.id === currentChapter,
        key: null,
        tip: decodeEntities(c.title),
        dot: `var(--math${i + 1})`,
      })),"""),
    ("""        tip: `在线练习 · ${mathPapers.length} 份试卷`,
        extra: 'practice-tab',
      },""",
     """        tip: `在线练习 · ${mathPapers.length} 份试卷`,
        extra: 'practice-tab',
        dot: 'var(--math-practice)',
      },"""),
    ("""        tip: '附件资料 · 课件 / 试题 / 附件目录与预览',
      },
    ],
    [currentChapter, onPractice, onAtt],""",
     """        tip: '附件资料 · 课件 / 试题 / 附件目录与预览',
        dot: 'var(--math-att)',
      },
    ],
    [currentChapter, onPractice, onAtt],"""),
])
