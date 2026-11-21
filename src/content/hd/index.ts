/* 系统硬件综合设计课程内容索引 —— 4 讲课件逐节整理；试题未收录，无在线练习数据 */
import type { DeckData, HdUnit } from './types';
import home from './home';
import ch1 from './ch1';
import ch2 from './ch2';
import ch3 from './ch3';
import ch4 from './ch4';

export type { HdUnit } from './types';

export const hdHome: DeckData = home;
/** 四讲课件（验收 / 展示 / 演示 / 注意事项） */
export const hdUnits: HdUnit[] = [ch1, ch2, ch3, ch4];
