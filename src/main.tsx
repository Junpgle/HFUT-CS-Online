import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider } from './lib/theme';
import { TocProvider } from './lib/toc';
import App from './App';
import './styles/tokens.css';
import './styles/base.css';
import './styles/hub.css';

// 滚动恢复交给各页面自己处理（首页有"离开时记住位置"、课程页有 scroll-spy 记忆），
// 关掉浏览器原生恢复，避免它在我们恢复之后又按自己的记录改写滚动位置（同 hash 内导航会竞态）。
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <TocProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </TocProvider>
    </ThemeProvider>
  </StrictMode>,
);

// 离线缓存：生产环境注册 Service Worker（站点为纯静态产物，可完整离线）
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {});
  });
}
