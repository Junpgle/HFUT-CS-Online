/**
 * 纯文本字段的 HTML 实体解码。
 *
 * 内容模块里的 toc.text / heading / title / subtitle / demo.title 等字段
 * 是按「纯文本」渲染的（React 直接插值），但历史内容是 HTML 迁移来的，
 * 可能带 &Theta; &Omega; &lang; 之类实体 —— 不处理就会原样显示成乱码。
 * 以 HTML 渲染的字段（lede、html 块、选项、解析）不受影响，无需调用本函数。
 */

const NAMED: Record<string, string> = {
  // 基础
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0',
  // 标点
  hellip: '…', mdash: '—', ndash: '–', middot: '·', bull: '•',
  ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’',
  laquo: '«', raquo: '»', deg: '°', copy: '©', reg: '®', trade: '™',
  sect: '§', para: '¶', prime: '′', Prime: '″', shy: '\u00ad',
  // 运算 / 关系
  times: '×', divide: '÷', minus: '−', plusmn: '±',
  le: '≤', ge: '≥', ne: '≠', equiv: '≡', asymp: '≈', prop: '∝',
  // 箭头
  rarr: '→', larr: '←', uarr: '↑', darr: '↓', harr: '↔',
  rArr: '⇒', lArr: '⇐', hArr: '⇔', mapsto: '↦',
  // 集合 / 逻辑
  isin: '∈', notin: '∉', ni: '∋', forall: '∀', exist: '∃',
  empty: '∅', sub: '⊂', sube: '⊆', sup: '⊃', supe: '⊇',
  cup: '∪', cap: '∩', setminus: '∖', and: '∧', or: '∨', not: '¬',
  there4: '∴', because: '∵',
  // 常用数学符号
  infin: '∞', sum: '∑', prod: '∏', int: '∫', part: '∂', nabla: '∇',
  radic: '√', cdot: '⋅', lowast: '∗', star: '⋆', circ: '∘',
  oplus: '⊕', otimes: '⊗', perp: '⊥', angle: '∠', triangle: '△',
  square: '□', check: '✓', cross: '✗', loz: '◊',
  // 希腊字母（大写）
  Alpha: 'Α', Beta: 'Β', Gamma: 'Γ', Delta: 'Δ', Epsilon: 'Ε', Zeta: 'Ζ',
  Eta: 'Η', Theta: 'Θ', Iota: 'Ι', Kappa: 'Κ', Lambda: 'Λ', Mu: 'Μ',
  Nu: 'Ν', Xi: 'Ξ', Omicron: 'Ο', Pi: 'Π', Rho: 'Ρ', Sigma: 'Σ',
  Tau: 'Τ', Upsilon: 'Υ', Phi: 'Φ', Chi: 'Χ', Psi: 'Ψ', Omega: 'Ω',
  // 希腊字母（小写）
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε', varepsilon: 'ε',
  zeta: 'ζ', eta: 'η', theta: 'θ', iota: 'ι', kappa: 'κ', lambda: 'λ',
  mu: 'μ', nu: 'ν', xi: 'ξ', omicron: 'ο', pi: 'π', rho: 'ρ',
  sigma: 'σ', tau: 'τ', upsilon: 'υ', phi: 'φ', chi: 'χ', psi: 'ψ',
  omega: 'ω',
  // 括号 / 界
  lang: '⟨', rang: '⟩', lceil: '⌈', rceil: '⌉', lfloor: '⌊', rfloor: '⌋',
  lbrace: '{', rbrace: '}', lbrack: '[', rbrack: ']',
  // 分数
  frac12: '½', frac14: '¼', frac34: '¾',
};

const fromCodePoint = (cp: number, fallback: string): string => {
  try {
    return String.fromCodePoint(cp);
  } catch {
    return fallback;
  }
};

/** 把 HTML 实体解码为普通文本；未知实体原样保留 */
export function decodeEntities(s: string): string {
  if (!s || s.indexOf('&') < 0) return s;
  return s
    .replace(/&#x([0-9a-fA-F]+);/g, (whole, hex: string) =>
      fromCodePoint(parseInt(hex, 16), whole),
    )
    .replace(/&#(\d+);/g, (whole, dec: string) => fromCodePoint(parseInt(dec, 10), whole))
    .replace(/&([a-zA-Z][a-zA-Z0-9]*);/g, (whole, name: string) => NAMED[name] ?? whole);
}

/** 判定字符串里是否残留 HTML 实体（供测试使用） */
export const hasEntity = (s: string): boolean => /&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/.test(s);
