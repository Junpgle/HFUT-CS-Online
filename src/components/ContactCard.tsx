import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useReducedMotion } from 'motion/react';
import { IconCheck, IconX } from './icons';

const CONTACTS = [
  { key: 'QQ', value: '1591827747' },
  { key: '邮箱', value: 'saltgardenia@gmail.com' },
] as const;

/** 剪贴板写入：优先 async API，非安全上下文回落 execCommand */
async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  }
}

interface Props {
  open: boolean;
  onClose: () => void;
}

/** 联系作者信息卡片：点条目复制到剪贴板，Esc / 点遮罩 / 关闭按钮退出 */
export default function ContactCard({ open, onClose }: Props) {
  const reduced = useReducedMotion();
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async (key: string, value: string) => {
    if (await copyText(value)) {
      setCopied(key);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(null), 1600);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="hub-modal-scrim"
          initial={reduced ? undefined : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: 0.16 }}
          onClick={onClose}
        >
          <motion.div
            className="hub-modal material"
            role="dialog"
            aria-modal="true"
            aria-label="联系作者"
            initial={reduced ? undefined : { opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, scale: 0.97, y: 6 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="hub-modal-head">
              <h2>联系作者</h2>
              <button className="icon-btn" onClick={onClose} aria-label="关闭">
                <IconX size={16} />
              </button>
            </div>
            <p className="hub-modal-tip">反馈 bug，贡献资料，勘误</p>
            {CONTACTS.map(({ key, value }) => (
              <button
                key={key}
                type="button"
                className="contact-row"
                onClick={() => copy(key, value)}
                aria-label={`复制${key} ${value}`}
              >
                <span className="contact-key">{key}</span>
                <span className="contact-val">{value}</span>
                <span className={`contact-copy${copied === key ? ' done' : ''}`} aria-live="polite">
                  {copied === key ? (
                    <>
                      <IconCheck size={13} /> 已复制
                    </>
                  ) : (
                    '复制'
                  )}
                </span>
              </button>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
