import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, PerspectiveCamera, Environment } from '@react-three/drei';
import FactOrFakeGame from './FactOrFakeGame';
import FactOrFakeUI from './FactOrFakeUI';

export default function YellowBuildingScene({ onExit }) {
  const [gameState, setGameState] = useState('start'); // start, playing, gameover, win
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);

  const handleStart = () => {
    setScore(0);
    setLives(3);
    setGameState('playing');
  };

  const handleGameOver = () => {
    setGameState('gameover');
  };

  const handleWin = () => {
    setGameState('win');
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', backgroundColor: '#111827' }}>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 3, 8]} fov={60} />
        <color attach="background" args={['#111827']} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={2} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <directionalLight position={[0, 10, 5]} intensity={0.5} castShadow />
        
        {/* Game Logic */}
        {gameState === 'playing' && (
          <FactOrFakeGame 
            onScoreUpdate={setScore} 
            onLivesUpdate={setLives}
            onGameOver={handleGameOver}
            onWin={handleWin}
          />
        )}

        {/* Environment Visuals */}
        <mesh position={[0, -0.5, -25]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
           <planeGeometry args={[10, 100]} />
           <meshStandardMaterial color="#374151" />
        </mesh>

        {/* Lane Dividers */}
        <mesh position={[0, -0.49, -25]} rotation={[-Math.PI / 2, 0, 0]}>
           <planeGeometry args={[0.1, 100]} />
           <meshStandardMaterial color="#6b7280" />
        </mesh>

      </Canvas>

      <FactOrFakeUI 
        gameState={gameState}
        score={score}
        lives={lives}
        onStart={handleStart}
        onExit={onExit}
        onRestart={handleStart}
      />
    </div>
  );
}
