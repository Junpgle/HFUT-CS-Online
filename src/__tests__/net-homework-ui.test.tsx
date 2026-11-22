import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NetHomework from '../pages/net/NetHomework';
import { netHomework } from '../content/net/homework';

afterEach(cleanup);

describe('计网章末作业答案交互', () => {
  it('已有教师答案：一个按钮同时展开教师答案和参考解析', () => {
    render(
      <MemoryRouter>
        <NetHomework chapterNo={4} questions={[netHomework[4][0]]} />
      </MemoryRouter>,
    );
    const button = screen.getByRole('button', { name: '查看答案与解析' });
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByText('教师答案（整理转述）')).toBeNull();
    fireEvent.click(button);
    expect(screen.getByRole('button', { name: '收起答案与解析' }).getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('教师答案（整理转述）')).toBeTruthy();
    expect(screen.getByText('补充参考答案与解析')).toBeTruthy();
  });

  it('没有教师答案时，保留来源说明而不虚构结论', () => {
    render(
      <MemoryRouter>
        <NetHomework chapterNo={6} questions={[netHomework[6][0]]} />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole('button', { name: '查看答案与解析' }));
    expect(screen.getByText('参考答案与解析')).toBeTruthy();
    expect(screen.getByText(/原作业文件未附教师答案/)).toBeTruthy();
    expect(screen.queryByText('教师答案（整理转述）')).toBeNull();
  });

  it('显示和收起可切换，不影响知识点回链', () => {
    render(
      <MemoryRouter>
        <NetHomework chapterNo={4} questions={[netHomework[4][0]]} />
      </MemoryRouter>,
    );
    const button = screen.getByRole('button', { name: '查看答案与解析' });
    const target = button.getAttribute('aria-controls');
    expect(target).toBeTruthy();
    expect(document.getElementById(target!)).not.toBeNull();
    expect(screen.getByRole('link', { name: '回看相关知识点' }).getAttribute('href')).toContain('?s=');
    fireEvent.click(button);
    fireEvent.click(screen.getByRole('button', { name: '收起答案与解析' }));
    expect(screen.getByRole('button', { name: '查看答案与解析' }).getAttribute('aria-expanded')).toBe('false');
  });
});
