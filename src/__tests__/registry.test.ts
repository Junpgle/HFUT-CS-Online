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
});
