import { useTheme } from '../lib/theme';
import { IconMoon, IconSun } from './icons';

/** 亮暗主题切换按钮 —— 全站导航栏统一使用（首页 / 各课程页），保证任何页面都可切主题 */
export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      className="icon-btn"
      onClick={toggle}
      aria-label={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
    >
      {theme === 'dark' ? <IconSun /> : <IconMoon />}
    </button>
  );
}
