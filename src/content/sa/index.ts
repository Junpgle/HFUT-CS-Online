/* 软件体系结构课程内容索引 —— 第4/5/7章 + RSA 专题；试题未收录，无在线练习数据 */
import type { DeckData, SaChapter } from './types';
import home from './home';
import ch4 from './ch4';
import ch5 from './ch5';
import ch7 from './ch7';
import rsa from './rsa';

export type { SaChapter } from './types';

export const saHome: DeckData = home;
/** 三份章节讲义 + RSA 专题 */
export const saChapters: SaChapter[] = [ch4, ch5, ch7, rsa];
