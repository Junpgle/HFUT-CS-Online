/* 课程注册表 —— 站点里"哪些课已上线、挂在哪个路由"的唯一事实源。
 * name 与 课件与期末题整理/ 里的课程目录名一致时，首页卡片自动标记「已上线」并链接 base；
 * 不在目录中（资料来自本仓库自建内容）的课程，首页按 semester 注入虚拟卡片。 */
export interface CourseEntry {
  /** URL 段内的课程 id（稳定不变，改名不影响路由） */
  id: string;
  /** 课程显示名（与 catalog.name 对齐） */
  name: string;
  /** 所属学期文件夹名 */
  semester: string;
  /** 课程路由前缀；课程内部路由一律相对 */
  base: string;
  ready: boolean;
  /** 一句话来源说明（首页卡片副标） */
  source: string;
}

export const courses: readonly CourseEntry[] = [
  {
    id: 'algorithm-design',
    name: '算法设计与分析',
    semester: '大三上',
    base: '/algo',
    ready: true,
    source: '八讲考点手册 · 24 个交互式动画 · 420 题在线练习',
  },
  {
    id: 'os',
    name: '操作系统',
    semester: '大三上',
    base: '/os',
    ready: true,
    source: '七章课件精讲 · 期末大题精讲 · 4 份试卷在线练习',
  },
  {
    id: 'computer-network',
    name: '计算机网络',
    semester: '大三上',
    base: '/net',
    ready: true,
    source: '七章课件讲义 · 3 套期末试卷在线练习',
  },
  {
    id: 'program-design-art',
    name: '程序设计艺术与方法',
    semester: '大二上',
    base: '/pat',
    ready: true,
    source: '三讲课件精讲 · ICPC 讲义六章 · 省赛真题在线练习',
  },
  {
    id: 'artificial-intelligence',
    name: '人工智能原理',
    semester: '大三上',
    base: '/ai',
    ready: true,
    source: '设计报告题库整理 · 15 个选题在线练习（课件未收录）',
  },
];

/** 首页/占位页用的未上线课程路由前缀 */
export const STUB_BASE = '/course';

/** 算法课路由前缀 —— 算法课内部组件（TopBar/Sidebar/各页）统一引用此常量，
 * 课程整体换前缀只改 courses[0].base 与此处的对应关系。 */
export const ALGO_BASE = courses[0].base;

/** 操作系统课路由前缀（同上约定） */
export const OS_BASE = courses[1].base;

/** 计算机网络课路由前缀（同上约定） */
export const NET_BASE = courses[2].base;

/** 程序设计艺术与方法课路由前缀（同上约定） */
export const PAT_BASE = courses[3].base;

/** 人工智能原理课路由前缀（同上约定） */
export const AI_BASE = courses[4].base;

export function findCourseByName(name: string): CourseEntry | undefined {
  return courses.find((c) => c.name === name);
}

export function findCourseByBase(base: string): CourseEntry | undefined {
  return courses.find((c) => c.base === base);
}
