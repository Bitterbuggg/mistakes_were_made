import React from 'react';
import { motion as Motion } from 'framer-motion';

export default function TechVocPlayerUI() {
  return (
    <>
      {/* Movement Instructions */}
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-40"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: '500',
          textAlign: 'center'
        }}
      >
        <div>Click on the floor to move around</div>
        <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.8 }}>
          Click on a PC to start the phishing quiz
        </div>
      </Motion.div>
    </>
  );
}
