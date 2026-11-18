import { Link } from 'react-router-dom';
import { useTheme } from '../lib/theme';
import { IconGitHub, IconMoon, IconSun } from './icons';

const REPO_URL = 'https://github.com/SaltGardenia/HFUT-algorithm-design';

/** 站点层顶栏 —— 只有首页使用；各课程页面自带导航栏，与本组件无关。 */
export default function SiteHeader() {
  const { theme, toggle } = useTheme();
  return (
    <header className="hub-topbar material">
      <Link to="/" className="hub-brand">
        HFUT 计算机<span className="accent"> · 课程资料库</span>
      </Link>
      <div className="hub-topbar-right">
        <button
          className="icon-btn"
          onClick={toggle}
          aria-label={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
        >
          {theme === 'dark' ? <IconSun /> : <IconMoon />}
        </button>
        <a className="icon-btn" href={REPO_URL} target="_blank" rel="noreferrer" aria-label="GitHub 仓库" title="GitHub 仓库">
          <IconGitHub size={18} />
        </a>
      </div>
    </header>
  );
}
