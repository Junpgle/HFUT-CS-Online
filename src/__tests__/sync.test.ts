import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PROGRESS_STORES } from '../lib/sync/keys';
import {
  applyProgress,
  ensureProgressStamps,
  readProgress,
  readProgressMeta,
  subscribeStore,
  writeProgress,
} from '../lib/sync/local';
import { mergeFavorites, mergeProgress, mergeRecent } from '../lib/sync/merge';
import type { RemoteProgressRow } from '../lib/sync/types';

const iso = (ms: number) => new Date(ms).toISOString();

function progressRow(qid: string, result: string | null, at: number): RemoteProgressRow {
  return { course: 'algo', question_id: qid, result, updated_at: iso(at) };
}

describe('mergeProgress：逐题独立合并', () => {
  it('云端较新时覆盖本机，云端没有的题目保留并上传', () => {
    const merged = mergeProgress(
      { q1: 'wrong', q2: 'right' },
      { q1: { t: 1000, r: 'wrong' }, q2: { t: 1000, r: 'right' } },
      [progressRow('q1', 'right', 2000), progressRow('q3', 'revealed', 2000)],
    );
    expect(merged.map).toEqual({ q1: 'right', q2: 'right', q3: 'revealed' });
    expect(merged.meta.q1).toEqual({ t: 2000, r: 'right' });
    // q2 只在本地，需上传；q3 云端更新，无需回传
    expect(merged.push).toEqual([{ question_id: 'q2', result: 'right', t: 1000 }]);
  });

  it('本机较新时保留本机并回传', () => {
    const merged = mergeProgress(
      { q1: 'wrong' },
      { q1: { t: 5000, r: 'wrong' } },
      [progressRow('q1', 'right', 2000)],
    );
    expect(merged.map.q1).toBe('wrong');
    expect(merged.push).toEqual([{ question_id: 'q1', result: 'wrong', t: 5000 }]);
  });

  it('清空墓碑不会被云端旧数据复活', () => {
    const merged = mergeProgress({}, { q1: { t: 5000, r: null } }, [progressRow('q1', 'right', 2000)]);
    expect(merged.map).toEqual({});
    expect(merged.meta.q1).toEqual({ t: 5000, r: null });
    expect(merged.push).toEqual([{ question_id: 'q1', result: null, t: 5000 }]);
  });

  it('墓碑较旧时让位给云端作答', () => {
    const merged = mergeProgress({}, { q1: { t: 1000, r: null } }, [progressRow('q1', 'right', 3000)]);
    expect(merged.map.q1).toBe('right');
    expect(merged.push).toEqual([]);
  });

  it('没有时间戳的本地值不会被当作最新（兜底最旧）', () => {
    const merged = mergeProgress({ q1: 'wrong' }, {}, [progressRow('q1', 'right', 100)]);
    expect(merged.map.q1).toBe('right');
  });
});

describe('mergeFavorites / mergeRecent：集合合并', () => {
  it('收藏按课程逐条取新，顺序按收藏时间倒序', () => {
    const merged = mergeFavorites(
      new Set(['A']),
      { A: { t: 1000, on: true } },
      [
        { course: 'A', favorited: true, updated_at: iso(2000) },
        { course: 'B', favorited: true, updated_at: iso(3000) },
      ],
      5000,
    );
    expect(merged.on).toEqual(['B', 'A']);
    expect(merged.push).toEqual([]);
  });

  it('取消收藏的墓碑能覆盖云端旧收藏', () => {
    const merged = mergeFavorites(new Set(), { A: { t: 5000, on: false } }, [
      { course: 'A', favorited: true, updated_at: iso(4000) },
    ], 5000);
    expect(merged.on).toEqual([]);
    expect(merged.push).toEqual([{ course: 'A', favorited: false, t: 5000 }]);
  });

  it('最近查看取最大时间并截断', () => {
    const merged = mergeRecent(
      ['A', 'B'],
      { A: 1000, B: 900 },
      [
        { course: 'B', viewed_at: iso(2000) },
        { course: 'C', viewed_at: iso(3000) },
      ],
      5000,
      2,
    );
    expect(merged.list).toEqual(['C', 'B']);
    // A 只在本地出现过，仍会回传云端；本地列表只保留前 2 条
    expect(merged.push).toEqual([{ course: 'A', t: 1000 }]);
  });

  it('本机新于云端的最近查看会回传', () => {
    const merged = mergeRecent(['A'], { A: 5000 }, [{ course: 'A', viewed_at: iso(1000) }], 5000, 8);
    expect(merged.push).toEqual([{ course: 'A', t: 5000 }]);
  });
});

describe('本地存储层：时间戳、墓碑、订阅', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('写入变化题目时打时间戳并广播；重复写入不产生脏数据', () => {
    const listener = vi.fn();
    const unsub = subscribeStore('practice-progress-v1', listener);
    const changed = writeProgress('practice-progress-v1', { q1: 'right', q2: 'wrong' });
    expect(changed.sort()).toEqual(['q1', 'q2']);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(readProgress('practice-progress-v1')).toEqual({ q1: 'right', q2: 'wrong' });
    expect(Object.keys(readProgressMeta('practice-progress-v1'))).toEqual(['q1', 'q2']);

    expect(writeProgress('practice-progress-v1', { q1: 'right', q2: 'wrong' })).toEqual([]);
    expect(listener).toHaveBeenCalledTimes(1);
    unsub();
  });

  it('清空进度生成 null 墓碑', () => {
    writeProgress('practice-progress-v1', { q1: 'right' });
    const changed = writeProgress('practice-progress-v1', {});
    expect(changed).toEqual(['q1']);
    expect(readProgress('practice-progress-v1')).toEqual({});
    expect(readProgressMeta('practice-progress-v1').q1.r).toBeNull();
  });

  it('首次登录补时间戳：历史本地数据参与上传', () => {
    localStorage.setItem('practice-progress-v1', JSON.stringify({ q1: 'right' }));
    const stamped = ensureProgressStamps('practice-progress-v1');
    expect(stamped).toEqual(['q1']);
    expect(readProgressMeta('practice-progress-v1').q1).toMatchObject({ r: 'right' });
    expect(ensureProgressStamps('practice-progress-v1')).toEqual([]);
  });

  it('applyProgress 落盘云端合并结果并通知订阅者', () => {
    const listener = vi.fn();
    const unsub = subscribeStore('practice-progress-v1', listener);
    applyProgress('practice-progress-v1', { q9: 'revealed' }, { q9: { t: 9000, r: 'revealed' } });
    expect(readProgress('practice-progress-v1')).toEqual({ q9: 'revealed' });
    expect(listener).toHaveBeenCalled();
    unsub();
  });
});

describe('进度键登记完整', () => {
  it('源码里出现的所有 *-practice-progress-v1 都已登记到 PROGRESS_STORES', () => {
    const files = import.meta.glob('../**/*.{ts,tsx}', {
      query: '?raw',
      import: 'default',
      eager: true,
    }) as Record<string, string>;
    const found = new Set<string>();
    for (const text of Object.values(files)) {
      for (const m of text.matchAll(/'([a-z0-9-]*-?practice-progress-v1)'/g)) found.add(m[1]);
    }

    const registered = new Set(PROGRESS_STORES.map((s) => s.key));
    expect(found.size).toBeGreaterThan(0);
    for (const key of found) expect(registered.has(key), `${key} 未登记`).toBe(true);
  });
});
