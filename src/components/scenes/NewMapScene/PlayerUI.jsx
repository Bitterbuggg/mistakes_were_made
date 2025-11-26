import React from 'react';
import { motion as Motion } from 'framer-motion';

export default function PlayerUI() {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none">
      {/* Movement controls hint */}
      <Motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/60 text-white px-4 py-2 rounded-lg text-sm text-center backdrop-blur-sm"
      >
        <div className="font-semibold mb-1">Controls</div>
        <div className="flex gap-4 justify-center text-xs">
          <span>🖱️ Left-click to move</span>
          <span>⌨️ WASD to walk</span>
          <span>🔄 Right-click drag to rotate camera</span>
          <span>🔍 Mouse wheel to zoom</span>
        </div>
      </Motion.div>
    </div>
  );
}
