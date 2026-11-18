import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import CourseHubPage from './pages/CourseHubPage';
import CourseStubPage from './pages/CourseStubPage';
import { ALGO_BASE } from './courses/registry';

/** 算法课按需加载：首屏只载首页，进入课程时再拉取课程包 */
const AlgorithmCourse = lazy(() => import('./courses/AlgorithmCourse'));

/** 旧版单课程链接 → /algo/*（历史收藏与外链不失效） */
function LegacyDeckRedirect() {
  const { deckId } = useParams();
  return <Navigate to={`${ALGO_BASE}/deck/${deckId}`} replace />;
}

/**
 * 站点层路由：只做「首页 + 各课程前缀 → 课程根组件 + 旧链接重定向」。
 * 每门课程是自包含布局（自带导航栏），在这里以一条 Route 接入。
 */
export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<CourseHubPage />} />
        <Route path={`${ALGO_BASE}/*`} element={<AlgorithmCourse />} />
        <Route path="/course/:name/*" element={<CourseStubPage />} />
        <Route path="/deck/:deckId" element={<LegacyDeckRedirect />} />
        <Route path="/practice" element={<Navigate to={`${ALGO_BASE}/practice`} replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
