/** 课程注册表契约：id/base 唯一；纯附件课程的注册信息锁定。
 * （清单文件存在性由 attachments.test.ts 的静态 import 强制：缺文件即编译失败） */
import { describe, expect, it } from 'vitest';
import { courses, STUB_BASE } from '../courses/registry';

describe('课程注册表（registry）', () => {
  it('id 与 base 唯一，且不以 STUB_BASE 开头', () => {
    expect(new Set(courses.map((c) => c.id)).size).toBe(courses.length);
    expect(new Set(courses.map((c) => c.base)).size).toBe(courses.length);
    for (const c of courses) {
      expect(c.base.startsWith(STUB_BASE)).toBe(false);
      expect(c.base.startsWith('/')).toBe(true);
    }
  });

  it('计算机网络课程设计：纯附件课程（课件/试题均为 0，仅附件页）', () => {
    const ncd = courses.find((c) => c.name === '计算机网络课程设计');
    expect(ncd).toBeDefined();
    expect(ncd!.id).toBe('computer-network-course-design');
    expect(ncd!.semester).toBe('大三上');
    expect(ncd!.base).toBe('/ncd');
    expect(ncd!.ready).toBe(true);
  });

  it('网络攻防实践：纯附件课程（课件/试题均为 0，仅附件页）', () => {
    const nap = courses.find((c) => c.name === '网络攻防实践');
    expect(nap).toBeDefined();
    expect(nap!.id).toBe('network-attack-practice');
    expect(nap!.semester).toBe('大三上');
    expect(nap!.base).toBe('/nap');
    expect(nap!.ready).toBe(true);
  });

  it('系统硬件综合设计：四讲课件 + 附件（试题未收录，无在线练习）', () => {
    const hd = courses.find((c) => c.name === '系统硬件综合设计');
    expect(hd).toBeDefined();
    expect(hd!.id).toBe('system-hardware-design');
    expect(hd!.semester).toBe('大三上');
    expect(hd!.base).toBe('/hd');
    expect(hd!.ready).toBe(true);
  });

  it('移动计算与应用开发：纯附件课程（课件未收录，试题仅为实验代码，无在线练习）', () => {
    const mc = courses.find((c) => c.name === '移动计算与应用开发');
    expect(mc).toBeDefined();
    expect(mc!.id).toBe('mobile-computing-development');
    expect(mc!.semester).toBe('大三上');
    expect(mc!.base).toBe('/mc');
    expect(mc!.ready).toBe(true);
  });
});
