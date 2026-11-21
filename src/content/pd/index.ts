/* 程序设计基础课程内容索引 —— 11 章课件逐节整理；试题未收录，无在线练习数据 */
import type { DeckData, PdChapter } from './types';
import home from './home';
import ch1 from './ch1';
import ch2 from './ch2';
import ch3 from './ch3';
import ch4 from './ch4';
import ch5 from './ch5';
import ch6 from './ch6';
import ch7 from './ch7';
import ch8 from './ch8';
import ch9 from './ch9';
import ch11 from './ch11';
import ch12 from './ch12';

export type { PdChapter } from './types';

export const pdHome: DeckData = home;
/** 十一章课件精讲（第 1～9、11、12 章，课件无第 10 章） */
export const pdChapters: PdChapter[] = [ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8, ch9, ch11, ch12];
