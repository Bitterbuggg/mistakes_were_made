import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, PerspectiveCamera } from '@react-three/drei';
import PasswordFallGame from './PasswordFallGame';
import PasswordFallUI from './PasswordFallUI';

export default function BautistaScene({ onExit }) {
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
        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} />
        <color attach="background" args={['#111827']} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        {/* Game Logic */}
        {gameState === 'playing' && (
          <PasswordFallGame 
            onScoreUpdate={setScore} 
            onLivesUpdate={setLives}
            onGameOver={handleGameOver}
            onWin={handleWin}
          />
        )}

        {/* Ground Line Visual */}
        <mesh position={[0, -6, 0]}>
          <boxGeometry args={[20, 0.2, 1]} />
          <meshStandardMaterial color="#374151" />
        </mesh>

      </Canvas>

      <PasswordFallUI 
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
