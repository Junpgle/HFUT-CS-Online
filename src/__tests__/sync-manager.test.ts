import { beforeEach, describe, expect, it, vi } from 'vitest';

/** 用内存后端替换 Supabase，验证 SyncManager 的登录 → 合并 → 上传编排 */
const mocks = vi.hoisted(() => ({
  user: { id: 'user-1', email: 'student@example.com' },
  pushCalls: [] as { progress: any[]; favorites: any[]; recent: any[] }[],
  remote: {
    progress: [] as any[],
    favorites: [] as any[],
    recent: [] as any[],
  },
}));

vi.mock('../lib/sync/config', () => ({
  syncEnabled: true,
  SUPABASE_URL: 'https://example.supabase.co',
  SUPABASE_ANON_KEY: 'test',
}));

vi.mock('../lib/sync/backend', () => ({
  createSupabaseBackend: () => ({
    getSession: async () => mocks.user,
    onAuthChange: () => () => {},
    signIn: async () => {},
    signUp: async () => ({ needsConfirm: false }),
    signOut: async () => {},
    pull: async () => mocks.remote,
    push: async (payload: { progress: any[]; favorites: any[]; recent: any[] }) => {
      mocks.pushCalls.push(payload);
    },
  }),
}));

const { syncManager } = await import('../lib/sync/manager');
const { readProgress, readProgressMeta, writeProgress } = await import('../lib/sync/local');

describe('SyncManager：登录合并与增量上传', () => {
  beforeEach(() => {
    localStorage.clear();
    mocks.pushCalls.length = 0;
    mocks.remote = { progress: [], favorites: [], recent: [] };
  });

  it('首次登录：本机历史进度上传，云端较新记录回填本机', async () => {
    // 本机游客进度（没有时间戳，模拟升级前的数据）
    localStorage.setItem('practice-progress-v1', JSON.stringify({ q1: 'right' }));
    mocks.remote = {
      progress: [
        // q1 云端是 2000 年，本机补戳为现在 → 本机胜出并上传
        { course: 'algo', question_id: 'q1', result: 'wrong', updated_at: new Date(2000).toISOString() },
        // q2 只在云端 → 回填本机
        { course: 'algo', question_id: 'q2', result: 'revealed', updated_at: new Date(3000).toISOString() },
      ],
      favorites: [],
      recent: [],
    };

    await syncManager.init();
    await syncManager.syncNow();

    expect(syncManager.getState().status).toBe('synced');
    expect(syncManager.getState().user?.id).toBe('user-1');
    expect(readProgress('practice-progress-v1')).toEqual({ q1: 'right', q2: 'revealed' });
    expect(readProgressMeta('practice-progress-v1').q2.r).toBe('revealed');

    const sent = mocks.pushCalls.flatMap((p) => p.progress);
    expect(sent.find((r) => r.question_id === 'q1')).toMatchObject({
      course: 'algo',
      result: 'right',
    });
    // q2 是云端更新，不回传
    expect(sent.some((r) => r.question_id === 'q2')).toBe(false);
  });

  it('登录后继续答题：只上传变化的题目，并写入时间戳', async () => {
    await syncManager.init();
    mocks.pushCalls.length = 0;

    writeProgress('practice-progress-v1', { q9: 'wrong' });
    await syncManager.syncNow();

    const sent = mocks.pushCalls.flatMap((p) => p.progress);
    expect(sent).toHaveLength(1);
    expect(sent[0]).toMatchObject({ course: 'algo', question_id: 'q9', result: 'wrong' });
    expect(Number.isFinite(Date.parse(sent[0].updated_at))).toBe(true);
    expect(syncManager.getState().status).toBe('synced');

    // 清掉防抖定时器，避免测试结束后再触发一次上传
    await syncManager.signOut();
  });
});
