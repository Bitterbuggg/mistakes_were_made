import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import FirewallGame from './FirewallGame';
import FirewallUI from './FirewallUI';

export default function AcademicBuildingScene({ onExit }) {
  const [gameState, setGameState] = useState('start'); // start, playing, gameover, win
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);

  const handleStart = () => {
    setScore(0);
    setHealth(100);
    setGameState('playing');
  };

  const handleGameOver = (finalScore) => {
    setGameState('gameover');
  };

  const handleWin = () => {
    setGameState('win');
  };

  return (
    <>
      <div style={{ width: '100%', height: '100%', position: 'fixed', top: 0, left: 0, backgroundColor: 'black' }}>
        <Canvas
          shadows
          camera={{ position: [0, 15, 0], fov: 45 }} // Top-down view
        >
          <color attach="background" args={['#111827']} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          
          {/* Game Logic & 3D Elements */}
          {gameState === 'playing' && (
            <FirewallGame 
              onScoreUpdate={setScore} 
              onHealthUpdate={setHealth}
              onGameOver={handleGameOver}
              onWin={handleWin}
            />
          )}

          {/* Central Server Visual (Always visible or only during game?) Let's keep it simple */}
          <mesh position={[0, 0, 0]} receiveShadow>
            <cylinderGeometry args={[1, 1.2, 2, 32]} />
            <meshStandardMaterial color="#4f46e5" emissive="#4338ca" emissiveIntensity={0.5} />
          </mesh>
          <gridHelper args={[30, 30, 0x444444, 0x222222]} />
        </Canvas>
      </div>

      <FirewallUI 
        gameState={gameState}
        score={score}
        health={health}
        onStart={handleStart}
        onExit={onExit}
        onRestart={handleStart}
      />
    </>
  );
}
