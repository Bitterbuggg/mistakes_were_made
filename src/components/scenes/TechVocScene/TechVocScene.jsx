import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { AnimatePresence } from 'framer-motion';
import { OrbitControls } from '@react-three/drei';
import { MOUSE } from 'three';
import TechVocEnvironment from './TechVocEnvironment';
import TechVocPlayer from './TechVocPlayer';
import TechVocUI from './TechVocUI';
import TechVocPlayerUI from './TechVocPlayerUI';

export default function TechVocScene({ onExit }) {
  const [currentScenario, setCurrentScenario] = useState(null);
  const [playerTarget, setPlayerTarget] = useState({ x: 0, y: 0, z: 3 });
  const [showExitPrompt, setShowExitPrompt] = useState(false);
  const controlsRef = useRef();

  const handlePCClick = (scenarioId) => {
    setCurrentScenario(scenarioId);
  };

  const handleFloorClick = (point) => {
    setPlayerTarget(point);
  };

  const handleScenarioComplete = () => {
    setCurrentScenario(null);
  };

  const handleExitRequest = () => {
    setShowExitPrompt(true);
  };

  const handleConfirmExit = () => {
    if (onExit) onExit();
  };

  const handleCancelExit = () => {
    setShowExitPrompt(false);
  };

  return (
    <>
      <div className="w-full h-full fixed top-0 left-0">
        <Canvas
          shadows
          camera={{ position: [0, 2, 5], fov: 60 }}
          dpr={[1, 1.5]}
          gl={{ powerPreference: 'high-performance' }}
        >
          <color attach="background" args={['#FFE0A4']} />
          <ambientLight intensity={1} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
          <pointLight position={[-10, 10, -10]} intensity={0.8} color="#F9BD4B" />

          <OrbitControls 
            ref={controlsRef}
            enablePan={false}
            rotateSpeed={0.4}
            mouseButtons={{
              LEFT: null,
              MIDDLE: MOUSE.DOLLY,
              RIGHT: MOUSE.ROTATE
            }}
          />

          <TechVocEnvironment 
            onPCClick={handlePCClick}
            onFloorClick={handleFloorClick}
          />
          <TechVocPlayer 
            targetPosition={playerTarget}
            controlsRef={controlsRef}
          />
        </Canvas>
      </div>

      <AnimatePresence>
        <TechVocUI
          currentScenario={currentScenario}
          onScenarioComplete={handleScenarioComplete}
          showExitPrompt={showExitPrompt}
          onConfirmExit={handleConfirmExit}
          onCancelExit={handleCancelExit}
          onExitRequest={handleExitRequest}
        />
      </AnimatePresence>

      <TechVocPlayerUI />
    </>
  );
}
