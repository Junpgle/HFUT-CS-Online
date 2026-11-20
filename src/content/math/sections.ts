/** 高等数学章节 id 清单：章节页目录与试题知识点标签共用，保证 ?s= 深链一一对应。 */
export const MATH_CHAPTERS = [
  { no: 8, id: 'ch8', title: '空间解析几何与向量代数' },
  { no: 9, id: 'ch9', title: '多元函数微分学' },
  { no: 10, id: 'ch10', title: '重积分' },
  { no: 11, id: 'ch11', title: '曲线积分' },
  { no: 12, id: 'ch12', title: '曲面积分' },
  { no: 13, id: 'ch13', title: '无穷级数' },
] as const;

/** 各章 section id → 显示名（标签跳转与校验用） */
export const MATH_SECTIONS: Record<number, Record<string, string>> = {
  8: {
    'sec-ch8-vector': '向量及其线性运算',
    'sec-ch8-product': '向量的乘积',
    'sec-ch8-surface': '空间曲面与空间曲线',
    'sec-ch8-plane': '空间平面',
    'sec-ch8-line': '空间直线',
    'sec-ch8-exercise': '第 8 章习题课',
  },
  9: {
    'sec-ch9-basic': '多元函数的基本概念',
    'sec-ch9-limit': '二元函数的极限与连续',
    'sec-ch9-partial': '偏导数',
    'sec-ch9-total': '全微分',
    'sec-ch9-chain': '多元复合函数的求导法则',
    'sec-ch9-implicit': '隐函数的微分法',
    'sec-ch9-directional': '方向导数和梯度',
    'sec-ch9-geometry': '多元函数微分学的几何应用',
    'sec-ch9-extreme': '多元函数的极值',
    'sec-ch9-exercise': '多元函数微分学习题课',
  },
  10: {
    'sec-ch10-double-basic': '二重积分的概念与性质',
    'sec-ch10-double-calc': '二重积分的计算',
    'sec-ch10-triple': '三重积分的计算',
  },
  11: {
    'sec-ch11-arc': '对弧长的曲线积分',
    'sec-ch11-coord': '对坐标的曲线积分',
  },
  12: {
    'sec-ch12-surface': '对坐标的曲面积分',
    'sec-ch12-gauss-stokes': '高斯公式与斯托克斯公式',
  },
  13: {
    'sec-ch13-series-basic': '常数项级数的概念及其性质',
    'sec-ch13-positive': '正项级数及其审敛法',
    'sec-ch13-absolute': '级数的绝对收敛与条件收敛',
    'sec-ch13-power': '幂级数',
    'sec-ch13-expand': '函数的幂级数展开式',
    'sec-ch13-fourier': '傅里叶级数',
  },
};

/** 给标签用的便捷构造：{ deck: 章号, sec: section id, text: 显示名 } */
export function mathTag(deck: number, sec: string) {
  return { deck, sec, text: MATH_SECTIONS[deck]?.[sec] ?? sec };
}
