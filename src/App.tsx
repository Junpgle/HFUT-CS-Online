import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import CourseHubPage from './pages/CourseHubPage';
import CourseStubPage from './pages/CourseStubPage';
import { ALGO_BASE, OS_BASE, NET_BASE, PAT_BASE, AI_BASE, SA_BASE, PHYS_BASE } from './courses/registry';

/** 课程按需加载：首屏只载首页，进入课程时再拉取课程包 */
const AlgorithmCourse = lazy(() => import('./courses/AlgorithmCourse'));
const OsCourse = lazy(() => import('./courses/OsCourse'));
const NetworkCourse = lazy(() => import('./courses/NetworkCourse'));
const PatCourse = lazy(() => import('./courses/PatCourse'));
const AiCourse = lazy(() => import('./courses/AiCourse'));
const SaCourse = lazy(() => import('./courses/SaCourse'));
const PhysCourse = lazy(() => import('./courses/PhysCourse'));

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
    <>
      {/* 双色光晕背景：全站最底层，首页/课程页共用（CSS 在 base.css） */}
      <div className="bg-aura" aria-hidden="true" />
      <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<CourseHubPage />} />
        <Route path={`${ALGO_BASE}/*`} element={<AlgorithmCourse />} />
        <Route path={`${OS_BASE}/*`} element={<OsCourse />} />
        <Route path={`${NET_BASE}/*`} element={<NetworkCourse />} />
        <Route path={`${PAT_BASE}/*`} element={<PatCourse />} />
        <Route path={`${AI_BASE}/*`} element={<AiCourse />} />
        <Route path={`${SA_BASE}/*`} element={<SaCourse />} />
        <Route path={`${PHYS_BASE}/*`} element={<PhysCourse />} />
        <Route path="/course/:name/*" element={<CourseStubPage />} />
        <Route path="/deck/:deckId" element={<LegacyDeckRedirect />} />
        <Route path="/practice" element={<Navigate to={`${ALGO_BASE}/practice`} replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Suspense>
    </>
  );
}
