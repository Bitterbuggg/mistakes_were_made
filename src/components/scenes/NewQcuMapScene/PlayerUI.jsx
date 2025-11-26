import React from 'react';
import { motion as Motion } from 'framer-motion';

export default function PlayerUI() {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none">
      <Motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/60 text-white px-4 py-2 rounded-lg text-sm text-center backdrop-blur-sm"
      >
        <div className="font-semibold mb-1">Explore the campus</div>
        <div className="flex flex-wrap gap-3 justify-center text-xs">
          <span>🖱️ Left-click to move</span>
          <span>⌨️ WASD to walk</span>
          <span>🖱️ Right-click drag to rotate camera</span>
          <span>🖱️ Wheel to zoom</span>
        </div>
      </Motion.div>
    </div>
  );
}
