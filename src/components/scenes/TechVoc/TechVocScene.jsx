import React, { Suspense, lazy, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, Text } from '@react-three/drei';
import Character from '../../canvas/Character';
import PhishingGame from './PhishingGame';

function Room() {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
      
      {/* Walls */}
      <mesh position={[0, 2.5, -10]} receiveShadow>
        <boxGeometry args={[20, 5, 0.5]} />
        <meshStandardMaterial color="#cceeff" />
      </mesh>
      <mesh position={[-10, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[20, 5, 0.5]} />
        <meshStandardMaterial color="#cceeff" />
      </mesh>
      <mesh position={[10, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[20, 5, 0.5]} />
        <meshStandardMaterial color="#cceeff" />
      </mesh>
    </group>
  );
}

export default function TechVocScene({ onExit }) {
  const [playerTarget, setPlayerTarget] = useState({ x: 0, y: 0, z: 5 });
  const [showQuiz, setShowQuiz] = useState(false);
  const [showComputerName, setShowComputerName] = useState(false);
  const [showComputerModal, setShowComputerModal] = useState(false);
  const controlsRef = React.useRef();
  const characterRef = React.useRef();
  const computerPos = [0, 0, -5];

  const handleFloorClick = (e) => {
    setPlayerTarget(e.point);
  };

  const handleComputerClick = useCallback(() => {
    setShowComputerModal(true);
  }, []);

  const handleEnterQuiz = useCallback(() => {
    setShowComputerModal(false);
    setShowQuiz(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowComputerModal(false);
  }, []);

  const handleQuizComplete = useCallback(() => {
    // Handle quiz completion
  }, []);

  const handleExitQuiz = useCallback(() => {
    setShowQuiz(false);
  }, []);

  return (
    <div className="w-full h-full fixed top-0 left-0">
      <Canvas
        shadows
        camera={{ position: [0, 10, 10], fov: 50 }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={["#1e293b"]} />
        <ambientLight intensity={0.8} />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={1.5} 
          castShadow 
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[0, 5, 0]} intensity={0.5} />
        
        <OrbitControls 
          ref={controlsRef}
          enablePan={false}
          maxPolarAngle={Math.PI / 2 - 0.1}
          minDistance={5}
          maxDistance={20}
        />

        <group onClick={handleFloorClick}>
          <Room />
        </group>

        {/* Computer Group */}
        <group 
          position={computerPos}
          onPointerOver={(e) => { 
            e.stopPropagation(); 
            document.body.style.cursor = 'pointer';
            setShowComputerName(true);
          }}
          onPointerOut={(e) => { 
            e.stopPropagation(); 
            document.body.style.cursor = 'default';
            setShowComputerName(false);
          }}
          onClick={(e) => { 
            e.stopPropagation(); 
            handleComputerClick(); 
          }}
        >
          {/* Desk */}
          <mesh position={[0, 1, 0]} castShadow receiveShadow>
            <boxGeometry args={[2, 0.1, 1]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          <mesh position={[-0.8, 0.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.1, 1, 0.8]} />
            <meshStandardMaterial color="#555" />
          </mesh>
          <mesh position={[0.8, 0.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.1, 1, 0.8]} />
            <meshStandardMaterial color="#555" />
          </mesh>

          {/* Monitor */}
          <mesh position={[0, 1.6, -0.3]} castShadow>
            <boxGeometry args={[0.8, 0.6, 0.05]} />
            <meshStandardMaterial color="#111" />
          </mesh>
          <mesh position={[0, 1.6, -0.27]}>
            <planeGeometry args={[0.7, 0.5]} />
            <meshBasicMaterial 
              color={showComputerName ? "#00ff00" : "#0000ff"} 
              emissive={showComputerName ? "#00ff00" : "#0000ff"} 
              emissiveIntensity={0.5} 
            />
          </mesh>
          <mesh position={[0, 1.2, -0.3]}>
            <cylinderGeometry args={[0.05, 0.1, 0.4]} />
            <meshStandardMaterial color="#333" />
          </mesh>

          {/* Interaction Zone Marker */}
          <mesh position={[0, 0.01, 1]} rotation={[-Math.PI/2, 0, 0]}>
            <ringGeometry args={[0.5, 0.6, 32]} />
            <meshBasicMaterial 
              color={showComputerName ? "lime" : "yellow"} 
              opacity={showComputerName ? 0.8 : 0.5} 
              transparent 
            />
          </mesh>

          {/* Computer hover indicator */}
          {showComputerName && !showQuiz && !showComputerModal && (
            <Html position={[0, 2.5, 0]} center distanceFactor={10}>
              <div className="pointer-events-none">
                <div className="bg-blue-900/90 text-blue-100 px-6 py-3 rounded-lg shadow-2xl border-2 border-blue-700 backdrop-blur-sm whitespace-nowrap">
                  <div className="text-2xl font-bold text-center mb-1">🎣 Security Terminal</div>
                  <div className="text-xs text-blue-300 text-center">Click to interact</div>
                </div>
              </div>
            </Html>
          )}
        </group>

        <Character 
          ref={characterRef}
          targetPosition={playerTarget} 
          controlsRef={controlsRef} 
          scale={0.04} 
        />
      </Canvas>

      {/* Back button */}
      {!showQuiz && !showComputerModal && (
        <div className="absolute top-6 left-6 z-50">
          <button 
            onClick={onExit}
            className="px-4 py-2 bg-white/90 rounded shadow hover:bg-white transition-colors"
          >
            ← Back
          </button>
        </div>
      )}

      {/* Computer Modal */}
      {showComputerModal && (
        <div className="absolute inset-0 z-[9999] flex items-center justify-center bg-slate-900/85 backdrop-blur-sm" onClick={handleCloseModal}>
          <div className="relative w-[90vw] max-w-[560px] overflow-hidden rounded-[32px] bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative px-8 pt-12 pb-6 text-center">
              <div className="mx-auto mb-5 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600" style={{ width: '160px', height: '160px', fontSize: '96px' }}>
                <span>🎣</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 leading-tight">Security Terminal</h2>
              <p className="mt-3 px-4 text-[15px] leading-relaxed text-slate-600">
                Test your cybersecurity knowledge! Identify phishing attempts, suspicious emails, and security threats to protect yourself online.
              </p>
            </div>

            <button
              onClick={handleCloseModal}
              aria-label="Close modal"
              className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 focus:outline-none transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
              </svg>
            </button>

            <div className="relative px-8 pb-8">
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleEnterQuiz}
                  className="flex items-center justify-center w-full rounded-full px-6 py-[18px] text-[17px] font-bold text-white transition duration-200 hover:opacity-90 focus:outline-none"
                  style={{ background: 'linear-gradient(to right, #3b82f6, #2563eb)' }}
                >
                  Start Phishing Quiz
                </button>

                <button
                  onClick={handleCloseModal}
                  className="flex w-full items-center justify-center rounded-full bg-slate-200 px-6 py-[18px] text-[17px] font-bold text-slate-700 transition duration-150 hover:bg-slate-300 focus:outline-none"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quiz UI */}
      {showQuiz && (
        <PhishingGame 
          onQuizComplete={handleQuizComplete}
          onExitQuiz={handleExitQuiz}
        />
      )}
    </div>
  );
}
