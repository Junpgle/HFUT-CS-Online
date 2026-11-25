import { useEffect } from 'react';
import { SimulatorCanvas } from '../components/DataStructureSimulator';
import { useToc } from '../lib/toc';

const GUIDE = `${import.meta.env.BASE_URL}guides/data-structure/数据结构可视化模拟器使用指南.pdf`;
const SOURCE = 'https://softer-16.github.io/data-structure-simulator/';

/** 数据结构 · 可视化：把站内模拟器直接嵌在课程页里，外部网页与 PDF 指南做成按钮 */
export default function DsVisualPage() {
  const toc = useToc();

  useEffect(() => {
    toc.report([], () => {});
    return () => toc.report([], () => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page page-visual">
      <div className="visual-head">
        <div>
          <h1>可视化</h1>
          <p className="visual-sub">69 个交互演示 · 树 / 图 / 查找 / 排序 · Cynthia Wang</p>
        </div>
        <div className="visual-actions">
          <a className="btn" href={SOURCE} target="_blank" rel="noreferrer">
            原始网页
          </a>
          <a className="btn primary" href={GUIDE} target="_blank" rel="noreferrer">
            使用指南（PDF）
          </a>
        </div>
      </div>
      <div className="visual-stage">
        <SimulatorCanvas embedded />
      </div>
    </div>
  );
}
