import type { PracticeQuestion } from './types';
import { singleBank1 } from './single-1';
import { singleBank2 } from './single-2';
import { multiBank1 } from './multi-1';
import { judgeBank1 } from './judge-1';
import { judgeBank2 } from './judge-2';
import { fillBank1 } from './fill-1';
import { fillBank2 } from './fill-2';
import { essayBank } from './essay';

/** 全量题库：单选 100 + 多选 100 + 判断 100 + 填空 100 + 大题 20 = 420 */
export const practiceQuestions: PracticeQuestion[] = [
  ...singleBank1,
  ...singleBank2,
  ...multiBank1,
  ...judgeBank1,
  ...judgeBank2,
  ...fillBank1,
  ...fillBank2,
  ...essayBank,
];

export * from './types';
