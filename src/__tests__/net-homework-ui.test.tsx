import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NetHomework, { homeworkId, loadHomeworkResults, NET_HOMEWORK_STORE_KEY } from '../pages/net/NetHomework';
import { netHomework } from '../content/net/homework';

beforeEach(() => localStorage.removeItem(NET_HOMEWORK_STORE_KEY));
afterEach(() => {
  cleanup();
  localStorage.removeItem(NET_HOMEWORK_STORE_KEY);
});

function show(chapterNo: number, no = 0) {
  return render(
    <MemoryRouter>
      <NetHomework chapterNo={chapterNo} questions={[netHomework[chapterNo][no]]} />
    </MemoryRouter>,
  );
}

describe('计网章末作业交互与持久化', () => {
  it('教师答案与完整解析同按钮展开，并保留知识点回跳', () => {
    show(4);
    const button = screen.getByRole('button', { name: '查看答案与解析' });
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByText('教师答案（整理转述）')).toBeNull();
    const answer = button.getAttribute('aria-controls');
    expect(document.getElementById(answer!)).not.toBeNull();
    expect(screen.getByRole('link', { name: '回看相关知识点' }).getAttribute('href')).toContain('?s=');
    fireEvent.click(button);
    expect(screen.getByText('教师答案（整理转述）')).toBeTruthy();
    expect(screen.getByText('补充参考答案与解析')).toBeTruthy();
    expect(screen.getByRole('button', { name: '收起答案与解析' }).getAttribute('aria-expanded')).toBe('true');
    expect(loadHomeworkResults()[homeworkId(4, netHomework[4][0].no)]).toBe('revealed');
  });

  it('缺教师答案时不虚构来源，展开只计已看答案、不自动判掌握', () => {
    show(6);
    fireEvent.click(screen.getByRole('button', { name: '查看答案与解析' }));
    expect(screen.getByText('参考答案与解析')).toBeTruthy();
    expect(screen.getByText(/原作业文件未附教师答案/)).toBeTruthy();
    expect(screen.queryByText('教师答案（整理转述）')).toBeNull();
    expect(screen.getByText(/已掌握/).textContent).toContain('0');
    expect(loadHomeworkResults()[homeworkId(6, netHomework[6][0].no)]).toBe('revealed');
  });

  it('自评已掌握、需复习持久保存；刷新后显示状态与答案', () => {
    const view = show(4);
    fireEvent.click(screen.getByRole('button', { name: '查看答案与解析' }));
    fireEvent.click(screen.getByRole('button', { name: '已掌握' }));
    const id = homeworkId(4, netHomework[4][0].no);
    expect(loadHomeworkResults()[id]).toBe('right');
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('1');
    view.unmount();
    show(4);
    expect(screen.getByRole('button', { name: '收起答案与解析' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '已掌握' }).getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: '需复习' }));
    expect(loadHomeworkResults()[id]).toBe('wrong');
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('1');
  });

  it('单题重做清除单题状态，收起答案并同步减少已查看进度', () => {
    show(4);
    fireEvent.click(screen.getByRole('button', { name: '查看答案与解析' }));
    fireEvent.click(screen.getByRole('button', { name: '重做' }));
    expect(screen.getByRole('button', { name: '查看答案与解析' }).getAttribute('aria-expanded')).toBe('false');
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('0');
    expect(loadHomeworkResults()[homeworkId(4, netHomework[4][0].no)]).toBeUndefined();
  });

  it('二次确认仅清空当前章，保留其他章节状态', async () => {
    localStorage.setItem(NET_HOMEWORK_STORE_KEY, JSON.stringify({ '4:1': 'right', '6:1': 'wrong' }));
    show(4);
    fireEvent.click(screen.getByRole('button', { name: '清空本章进度' }));
    expect(screen.getByRole('dialog', { name: '清空本章进度' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '取消' }));
    expect(loadHomeworkResults()['4:1']).toBe('right');
    fireEvent.click(screen.getByRole('button', { name: '清空本章进度' }));
    fireEvent.click(screen.getByRole('button', { name: '清空' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(loadHomeworkResults()['4:1']).toBeUndefined();
    expect(loadHomeworkResults()['6:1']).toBe('wrong');
  });

  it('无效缓存记录被过滤，作业与历年试卷进度分别存储', () => {
    localStorage.setItem(NET_HOMEWORK_STORE_KEY, JSON.stringify({ '4:1': 'right', '1:3': 'other', nope: 'wrong' }));
    expect(loadHomeworkResults()).toEqual({ '4:1': 'right' });
    expect(NET_HOMEWORK_STORE_KEY).not.toBe('net-practice-progress-v1');
  });
});
