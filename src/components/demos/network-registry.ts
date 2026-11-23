/** 31 个计网分步协议演示共享一套播放器，保留算法课原有 24 个动画不变。 */
import type { DemoDef } from './types';
import { makeNetDemo } from './net-base';
import { netScenariosA } from './net-scenarios-a';
import { netCrcScenario } from './net-crc';
import { netScenariosB } from './net-scenarios-b';
import { netScenariosC } from './net-scenarios-c';

const all = [...netScenariosA, netCrcScenario, ...netScenariosB, ...netScenariosC];
export const networkDemoNames: string[] = all.map((item) => item.name);
export const networkRegistry: Record<string, DemoDef<any>> = Object.fromEntries(
  all.map((scenario) => [scenario.name, makeNetDemo(scenario)]),
);
export const networkScenarios = all;
