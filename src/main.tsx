import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider } from './lib/theme';
import { TocProvider } from './lib/toc';
import App from './App';
import './styles/tokens.css';
import './styles/base.css';

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
