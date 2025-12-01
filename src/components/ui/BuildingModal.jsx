import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion as Motion } from 'framer-motion';

export default function BuildingModal({ config, onClose, onEnter }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!config) return null;
  const titleId = `building-modal-title-${config.id || 'default'}`;
  const descId = `building-modal-desc-${config.id || 'default'}`;

  const overlayStyle = {
    backgroundColor: 'rgba(30, 41, 59, 0.85)'
  };

  const cardStyle = {
    background: '#ffffff',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    borderRadius: '32px',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const primaryButtonStyle = {
    background: 'linear-gradient(to right, #3b82f6, #2563eb)',
    boxShadow: 'none'
  };

  const modal = (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="building-modal-overlay fixed inset-0 z-[9999] flex items-center justify-center bg-transparent backdrop-blur-sm"
      style={overlayStyle}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
    >
      <Motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="building-modal-card relative w-[90vw] max-w-[560px] overflow-hidden rounded-[32px] bg-white sm:w-full"
        style={cardStyle}
        onClick={(e) => e.stopPropagation()}
      >

        <div className="relative px-8 pt-12 pb-6 text-center building-modal-body">
          <Motion.div
            initial={{ scale: 0.9, opacity: 0, y: -6 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut", delay: 0.03 }}
            className="mx-auto mb-5 flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 via-green-400 to-teal-500"
            style={{ width: '160px', height: '160px', fontSize: '96px' }}
          >
            <span>{config.icon || "🏢"}</span>
          </Motion.div>

          <h2 id={titleId} className="text-3xl font-bold text-slate-900 leading-tight">
            {config.name}
          </h2>
          <p id={descId} className="mt-3 px-4 text-[15px] leading-relaxed text-slate-600 building-modal-desc">
            {config.description}
          </p>
        </div>

        <Motion.button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 focus:outline-none building-modal-close transition-colors"
          whileTap={{ scale: 0.95 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
          </svg>
        </Motion.button>

        <div className="relative px-8 pb-8 building-modal-actions">
          <div className="flex flex-col gap-3">
            {config.canEnter ? (
              <Motion.button
                onClick={onEnter}
                className="building-modal-primary flex items-center justify-center w-full rounded-full px-6 py-[18px] text-[17px] font-bold text-white transition duration-200 hover:opacity-90 focus:outline-none"
                style={primaryButtonStyle}
                whileTap={{ scale: 0.98 }}
              >
                Enter {config.name || "Building"}
              </Motion.button>
            ) : (
              <div className="flex w-full items-center justify-center rounded-full bg-slate-200 px-6 py-[18px] text-[17px] font-bold text-slate-400">
                Locked
              </div>
            )}

            <Motion.button
              onClick={onClose}
              className="building-modal-secondary flex w-full items-center justify-center rounded-full bg-slate-200 px-6 py-[18px] text-[17px] font-bold text-slate-700 transition duration-150 hover:bg-slate-300 focus:outline-none"
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </Motion.button>
          </div>
        </div>
      </Motion.div>
    </Motion.div>
  );

  if (typeof document !== 'undefined') return createPortal(modal, document.body);

  return modal;
}
