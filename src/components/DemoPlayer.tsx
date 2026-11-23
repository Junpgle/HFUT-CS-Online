import { useEffect, useMemo, useRef, useState, type ComponentType, type KeyboardEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { registry } from './demos/registry';
import { networkRegistry } from './demos/network-registry';
import { decodeEntities } from '../lib/text';
import { IconExpand, IconNext, IconPause, IconPlay, IconPrev, IconReset } from './icons';

const PLAY_INTERVAL = 950;

interface Props {
  name: string;
  title: string;
}

/**
 * 统一的动画播放器：接收 content 里的 demo 名，从 registry 取出
 * 帧数据（build）与帧渲染器（View），提供 Apple 风格的控制条、
 * 可拖拽 scrubber、键盘控制（←/→/空格/Home/End）。
 */
export default function DemoPlayer({ name, title: rawTitle }: Props) {
  const title = decodeEntities(rawTitle);
  const reduced = useReducedMotion();
  const def = registry[name] ?? networkRegistry[name];
  const frames = useMemo(() => (def ? (def.build() as never[]) : []), [def]);
  const total = frames.length;
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [netSpeed, setNetSpeed] = useState<0.5 | 1 | 2>(1);
  const isNetworkDemo = name.startsWith('net-');
  const interval = isNetworkDemo ? Math.round(3200 / netSpeed) : PLAY_INTERVAL;
  const [fullscreen, setFullscreen] = useState(false);
  const [scrubbing, setScrubbing] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // 全屏状态跟随（含 Esc 退出）
  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === boxRef.current);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement === boxRef.current) void document.exitFullscreen();
    else void boxRef.current?.requestFullscreen().catch(() => {});
  };

  // 步进因果反馈：换步瞬间给画面一个短暂高亮脉冲（reduced-motion 下关闭）
  const [tick, setTick] = useState(false);
  useEffect(() => {
    if (reduced) return;
    setTick(true);
    const id = window.setTimeout(() => setTick(false), 200);
    return () => window.clearTimeout(id);
  }, [step, reduced]);

  // 自动播放：定时推进；到达末帧自动停
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setStep((s) => Math.min(s + 1, total - 1)), interval);
    return () => window.clearInterval(id);
  }, [playing, total, interval]);

  useEffect(() => {
    if (playing && step >= total - 1) setPlaying(false);
  }, [playing, step, total]);

  if (!def) {
    return (
      <div className="demo">
        <div className="demo-bar">
          <span className="demo-title">{title}</span>
        </div>
        <div className="demo-stage">
          <p className="demo-cap">（未找到名为 <code>{name}</code> 的动画组件）</p>
        </div>
      </div>
    );
  }

  const { View, w, h } = def as { View: ComponentType<{ frame: never }>; w: number; h: number };
  const frame = frames[step] as never;

  const go = (next: number | ((prev: number) => number)) => {
    setPlaying(false);
    setStep((s) => {
      const v = typeof next === 'function' ? next(s) : next;
      return Math.max(0, Math.min(total - 1, v));
    });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(step - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(step + 1);
    } else if (e.key === ' ') {
      e.preventDefault();
      setPlaying((p) => !p);
    } else if (e.key === 'Home') {
      e.preventDefault();
      go(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      go(total - 1);
    }
  };

  const cap = (frames[step] as { cap?: string })?.cap ?? '';

  return (
    <div className="demo" ref={boxRef} tabIndex={0} onKeyDown={onKeyDown} role="group" aria-label={title}>
      <div className="demo-bar">
        <span className="demo-title">{title}</span>
        <span className="demo-hint" aria-hidden="true">
          左右滑动查看
        </span>
        <span className="demo-ctl">
          {isNetworkDemo && (
            <button className="ctl-btn" type="button"
              style={{ width: 44, fontSize: 11, fontVariantNumeric: 'tabular-nums' }}
              aria-label={`播放速度 ${netSpeed} 倍，点击切换`}
              title="计网分步演示速度：0.5× / 1× / 2×"
              onClick={() => setNetSpeed((speed) => speed === 0.5 ? 1 : speed === 1 ? 2 : 0.5)}>
              {netSpeed}×
            </button>
          )}
          <motion.span
            key={step}
            className="demo-step-chip"
            initial={reduced ? false : { scale: 1.16 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 600, damping: 26 }}
          >
            第 {step + 1} / {total} 步
          </motion.span>
          <button className="ctl-btn" aria-label="重置" title="重置 (Home)" disabled={step === 0 && !playing} onClick={() => go(0)}>
            <IconReset size={16} />
          </button>
          <button className="ctl-btn" aria-label="上一步" title="上一步 (←)" disabled={step === 0} onClick={() => go(step - 1)}>
            <IconPrev size={16} />
          </button>
          <button
            className={`ctl-btn ctl-play${playing ? ' is-on' : ''}`}
            aria-label={playing ? '暂停' : '播放'}
            title={playing ? '暂停 (空格)' : '播放 (空格)'}
            onClick={() => setPlaying((p) => !p)}
          >
            {playing ? <IconPause size={16} /> : <IconPlay size={16} />}
          </button>
          <button
            className="ctl-btn"
            aria-label="下一步"
            title="下一步 (→)"
            disabled={step >= total - 1}
            onClick={() => go(step + 1)}
          >
            <IconNext size={16} />
          </button>
          <button
            className={`ctl-btn${fullscreen ? ' is-on' : ''}`}
            aria-label={fullscreen ? '退出全屏' : '全屏查看'}
            title={fullscreen ? '退出全屏 (Esc)' : '全屏查看'}
            onClick={toggleFullscreen}
          >
            <IconExpand size={15} />
          </button>
        </span>
      </div>

      <div className={`demo-stage${tick ? ' tick' : ''}${step >= total - 1 ? ' ended' : ''}`}>
        {/* 播完出现的「重播」浮层：给一次明确的收尾仪式 */}
        <AnimatePresence>
          {step >= total - 1 && !playing && total > 1 && (
            <motion.button
              type="button"
              className="demo-replay"
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 420, damping: 26 }}
              onClick={() => {
                go(0);
                setPlaying(true);
              }}
            >
              <IconReset size={14} />
              重播
            </motion.button>
          )}
        </AnimatePresence>
        <svg
          viewBox={`0 0 ${w} ${h}`}
          role="img"
          aria-label={title}
          preserveAspectRatio="xMidYMid meet"
          style={
            fullscreen
              ? { height: 'calc(100vh - 150px)', width: 'auto' } // 全屏：按高度放大（内联样式优先级高于 :fullscreen 规则）
              : { maxWidth: w, minWidth: w } // 常规：保持原始尺寸，窄屏横向滚动
          }
        >
          <View frame={frame} />
        </svg>
      </div>

      <div className="demo-scrub">
        {scrubbing && total > 1 && (
          <span
            className="scrub-bubble"
            style={{ left: `clamp(30px, ${(step / Math.max(1, total - 1)) * 100}%, calc(100% - 30px))` }}
          >
            第 {step + 1} 步
          </span>
        )}
        <input
          type="range"
          min={0}
          max={Math.max(0, total - 1)}
          value={step}
          onPointerDown={() => setScrubbing(true)}
          onPointerUp={() => setScrubbing(false)}
          onBlur={() => setScrubbing(false)}
          onChange={(e) => go(Number(e.target.value))}
          aria-label="拖动查看任意步骤"
          aria-valuetext={`第 ${step + 1} 步，共 ${total} 步`}
          style={{ accentColor: 'var(--deck-accent)' }}
        />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={step}
          className="demo-cap"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
          dangerouslySetInnerHTML={{ __html: cap }}
        />
      </AnimatePresence>
    </div>
  );
}
