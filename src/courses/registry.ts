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
  {
    id: 'software-architecture',
    name: '软件体系结构',
    semester: '大三上',
    base: '/sa',
    ready: true,
    source: '四章课件讲义（第4/5/7章 + RSA 建模教程专题）· 试题暂未收录',
  },
  {
    id: 'university-physics',
    name: '大学物理',
    semester: '大二上',
    base: '/phys',
    ready: true,
    source: '十二章课件精讲（力学·热学·电磁学·光学）· 4 份期末试卷在线练习',
  },
  {
    id: 'computer-architecture',
    name: '计算机体系结构',
    semester: '大三上',
    base: '/ca',
    ready: true,
    source: '十三讲课件精讲（第 2～14 讲）· 3 份试题在线练习',
  },
  {
    id: 'advanced-mathematics',
    name: '高等数学',
    semester: '大一上',
    base: '/math',
    ready: true,
    source: '六章课件精讲（第 8～13 章）· 12 份试卷在线练习',
  },
  {
    id: 'program-design-fundamentals',
    name: '程序设计基础',
    semester: '大一上',
    base: '/pd',
    ready: true,
    source: '十一章课件精讲（C 语言 + C++ 基础）· 试题未收录',
  },
  {
    id: 'computer-network-course-design',
    name: '计算机网络课程设计',
    semester: '大三上',
    base: '/ncd',
    ready: true,
    source: '课程设计报告 + 图书管理系统项目源码 · 课件与试题未收录',
  },
  {
    id: 'network-attack-practice',
    name: '网络攻防实践',
    semester: '大三上',
    base: '/nap',
    ready: true,
    source: '项目实践报告（项目二/四）· 课件与试题未收录',
  },
  {
    id: 'system-hardware-design',
    name: '系统硬件综合设计',
    semester: '大三上',
    base: '/hd',
    ready: true,
    source: '四讲 CPU 设计课件精讲（RISC-V 流水线 / MIPS32 单周期）· 试题未收录',
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

/** 软件体系结构课路由前缀（同上约定） */
export const SA_BASE = courses[5].base;

/** 大学物理课路由前缀（同上约定） */
export const PHYS_BASE = courses[6].base;

/** 计算机体系结构课路由前缀（同上约定） */
export const CA_BASE = courses[7].base;

/** 高等数学课路由前缀（同上约定） */
export const MATH_BASE = courses[8].base;

/** 程序设计基础课路由前缀（同上约定） */
export const PD_BASE = courses[9].base;

/** 计算机网络课程设计课路由前缀（同上约定） */
export const NCD_BASE = courses[10].base;

/** 网络攻防实践课路由前缀（同上约定） */
export const NAP_BASE = courses[11].base;

/** 系统硬件综合设计课路由前缀（同上约定） */
export const HD_BASE = courses[12].base;

export function findCourseByName(name: string): CourseEntry | undefined {
  return courses.find((c) => c.name === name);
}

export function findCourseByBase(base: string): CourseEntry | undefined {
  return courses.find((c) => c.base === base);
}
