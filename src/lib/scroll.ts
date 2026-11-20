/** 平滑滚动到页面内锚点（尊重 prefers-reduced-motion） */

/** 程序化平滑滚动进行中：scrollspy 据此跳过沿途的中间态激活（否则侧栏指示器
 *  逐条弹跳、侧栏容器反复滚动，肉眼可见「抽搐」）。scrollend 或超时后解除。 */
let autoScrolling = false;
let endTimer = 0;

function endAutoScroll() {
  if (!autoScrolling) return;
  autoScrolling = false;
  // 让 scrollspy 补一次计算：scrollend 可能不触发（旧内核），滚动也可能已被用户中断
  window.dispatchEvent(new Event('scroll'));
}

export function isAutoScrolling(): boolean {
  return autoScrolling;
}

export function scrollToId(id: string, instant = false) {
  const el = document.getElementById(id);
  if (!el) return false;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: instant || reduced ? 'auto' : 'smooth', block: 'start' });
  if (instant || reduced) return true;
  autoScrolling = true;
  window.removeEventListener('scrollend', endAutoScroll);
  window.addEventListener('scrollend', endAutoScroll, { once: true });
  clearTimeout(endTimer);
  endTimer = window.setTimeout(endAutoScroll, 1600); // scrollend 缺失时的兜底
  return true;
}

export const DECK_IDS = ['deck1', 'deck2', 'deck3', 'deck4', 'deck5', 'deck6', 'deck7', 'deck8'];

/** 「deck2.html」/「deck2.html#sec-quiz」/「index.html#x」→ 路由信息；无法识别返回 null */
export function parseLegacyHref(
  href: string
): { deck: string | null; section: string | null } | null {
  const m = href.match(/^(?:\.\.\/)?(deck[1-8]|index)\.html(?:#(sec-[\w-]+))?$/);
  if (!m) return null;
  return { deck: m[1] === 'index' ? null : m[1], section: m[2]?.slice(1) ?? null };
}
