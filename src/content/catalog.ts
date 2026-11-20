/* 【自动生成】由 scripts/build-catalog.mjs 扫描 data/ 生成，请勿手改。
 * 共 57 门课程 / 7922 份文件；增删资料后 npm run catalog 刷新。 */

export interface CatalogCourse {
  /** 学期文件夹名：大一上…大四下 */
  semester: string;
  /** 课程目录名（与整理文件夹一致） */
  name: string;
  /** 课件 / 试题 / 附件 文件数 */
  courseware: number;
  exams: number;
  misc: number;
  total: number;
}

export const catalog: CatalogCourse[] = [
  { semester: "大一上", name: "程序设计基础", courseware: 11, exams: 0, misc: 173, total: 184 },
  { semester: "大一上", name: "高等数学", courseware: 21, exams: 18, misc: 26, total: 65 },
  { semester: "大一下", name: "电路与电子技术基础", courseware: 39, exams: 1, misc: 7, total: 47 },
  { semester: "大一下", name: "数据结构", courseware: 44, exams: 10, misc: 640, total: 694 },
  { semester: "大一下", name: "数据结构课程设计", courseware: 0, exams: 0, misc: 43, total: 43 },
  { semester: "大一下", name: "线性代数", courseware: 18, exams: 9, misc: 48, total: 75 },
  { semester: "大二上", name: "程序设计艺术与方法", courseware: 2, exams: 3, misc: 48, total: 53 },
  { semester: "大二上", name: "大学物理", courseware: 31, exams: 11, misc: 38, total: 80 },
  { semester: "大二上", name: "大学物理实验", courseware: 2, exams: 3, misc: 69, total: 74 },
  { semester: "大二上", name: "概率论与数理统计", courseware: 18, exams: 9, misc: 41, total: 68 },
  { semester: "大二上", name: "汇编语言程序设计", courseware: 22, exams: 1, misc: 29, total: 52 },
  { semester: "大二上", name: "机器人技术", courseware: 0, exams: 1, misc: 613, total: 614 },
  { semester: "大二上", name: "计算方法", courseware: 43, exams: 0, misc: 26, total: 69 },
  { semester: "大二上", name: "科研训练", courseware: 1, exams: 0, misc: 8, total: 9 },
  { semester: "大二上", name: "离散数学", courseware: 39, exams: 1, misc: 316, total: 356 },
  { semester: "大二上", name: "数字逻辑", courseware: 0, exams: 0, misc: 36, total: 36 },
  { semester: "大二上", name: "EDA实训", courseware: 1, exams: 3, misc: 17, total: 21 },
  { semester: "大二上", name: "Java技术", courseware: 0, exams: 0, misc: 176, total: 176 },
  { semester: "大二上", name: "Python程序设计", courseware: 30, exams: 6, misc: 171, total: 207 },
  { semester: "大二下", name: "编译原理", courseware: 24, exams: 4, misc: 109, total: 137 },
  { semester: "大二下", name: "机器学习", courseware: 6, exams: 0, misc: 93, total: 99 },
  { semester: "大二下", name: "计算机图形学", courseware: 0, exams: 2, misc: 516, total: 518 },
  { semester: "大二下", name: "计算机组成原理", courseware: 42, exams: 5, misc: 1174, total: 1221 },
  { semester: "大二下", name: "嵌入式系统原理", courseware: 12, exams: 5, misc: 207, total: 224 },
  { semester: "大二下", name: "软件工具与环境", courseware: 8, exams: 0, misc: 19, total: 27 },
  { semester: "大二下", name: "软件建模与分析", courseware: 0, exams: 0, misc: 1, total: 1 },
  { semester: "大二下", name: "数字媒体技术", courseware: 0, exams: 0, misc: 30, total: 30 },
  { semester: "大二下", name: "网络程序设计", courseware: 0, exams: 0, misc: 287, total: 287 },
  { semester: "大二下", name: "微机原理与接口技术", courseware: 0, exams: 0, misc: 4, total: 4 },
  { semester: "大二下", name: "硬件工程师综合训练", courseware: 0, exams: 0, misc: 3, total: 3 },
  { semester: "大二下", name: "组合数学", courseware: 19, exams: 0, misc: 1, total: 20 },
  { semester: "大三上", name: "操作系统", courseware: 6, exams: 7, misc: 338, total: 351 },
  { semester: "大三上", name: "计算机体系结构", courseware: 21, exams: 3, misc: 89, total: 113 },
  { semester: "大三上", name: "计算机网络", courseware: 23, exams: 10, misc: 77, total: 110 },
  { semester: "大三上", name: "计算机网络课程设计", courseware: 0, exams: 0, misc: 64, total: 64 },
  { semester: "大三上", name: "人工智能原理", courseware: 0, exams: 1, misc: 51, total: 52 },
  { semester: "大三上", name: "软件体系结构", courseware: 4, exams: 0, misc: 6, total: 10 },
  { semester: "大三上", name: "网络攻防实践", courseware: 0, exams: 0, misc: 2, total: 2 },
  { semester: "大三上", name: "系统硬件综合设计", courseware: 4, exams: 0, misc: 622, total: 626 },
  { semester: "大三上", name: "移动计算与应用开发", courseware: 0, exams: 6, misc: 81, total: 87 },
  { semester: "大三上", name: "自然语言理解", courseware: 1, exams: 0, misc: 65, total: 66 },
  { semester: "大三下", name: "编译原理课程设计", courseware: 0, exams: 0, misc: 18, total: 18 },
  { semester: "大三下", name: "操作系统课程设计", courseware: 0, exams: 0, misc: 18, total: 18 },
  { semester: "大三下", name: "大数据处理技术", courseware: 1, exams: 0, misc: 71, total: 72 },
  { semester: "大三下", name: "计算机视觉与深度学习", courseware: 0, exams: 0, misc: 54, total: 54 },
  { semester: "大三下", name: "计算机应用项目实训", courseware: 1, exams: 0, misc: 53, total: 54 },
  { semester: "大三下", name: "人工智能经济学", courseware: 8, exams: 0, misc: 3, total: 11 },
  { semester: "大三下", name: "软件测试", courseware: 11, exams: 1, misc: 13, total: 25 },
  { semester: "大三下", name: "软件工程", courseware: 14, exams: 2, misc: 30, total: 46 },
  { semester: "大三下", name: "软件项目管理", courseware: 0, exams: 0, misc: 1, total: 1 },
  { semester: "大三下", name: "数据库系统", courseware: 12, exams: 6, misc: 442, total: 460 },
  { semester: "大三下", name: "网络工程师综合实训", courseware: 0, exams: 0, misc: 23, total: 23 },
  { semester: "大三下", name: "信息安全技术", courseware: 6, exams: 0, misc: 38, total: 44 },
  { semester: "大四上", name: "分布式程序设计", courseware: 0, exams: 0, misc: 59, total: 59 },
  { semester: "大四上", name: "领域方向综合设计", courseware: 0, exams: 0, misc: 6, total: 6 },
  { semester: "大四上", name: "软件工程师综合训练", courseware: 0, exams: 0, misc: 55, total: 55 },
  { semester: "大四下", name: "创新实践", courseware: 0, exams: 0, misc: 1, total: 1 },
];
