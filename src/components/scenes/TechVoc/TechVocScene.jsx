import React, { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Text } from "@react-three/drei";
import { Vector3 } from "three";
import Character from "../../canvas/Character";
import PhishingGame from "./PhishingGame";

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

function Computer({ position }) {
  const [hovered] = useState(false);

  return (
    <group position={position}>
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
        <meshBasicMaterial color={hovered ? "#00ff00" : "#0000ff"} />
      </mesh>
      <mesh position={[0, 1.2, -0.3]}>
        <cylinderGeometry args={[0.05, 0.1, 0.4]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      {/* Interaction Zone Marker */}
      <mesh position={[0, 0.01, 1]} rotation={[-Math.PI/2, 0, 0]}>
        <ringGeometry args={[0.5, 0.6, 32]} />
        <meshBasicMaterial color="yellow" opacity={0.5} transparent />
      </mesh>
      
      <Text 
        position={[0, 2.5, 0]} 
        fontSize={0.3} 
        color="black" 
        anchorX="center" 
        anchorY="middle"
      >
        Security Terminal
      </Text>
    </group>
  );
}

function GameTrigger({ playerControls, onToggleGame, computerPos }) {
  const [isInRange, setIsInRange] = useState(false);

  useFrame(() => {
    if (playerControls.current && playerControls.current.target) {
      const playerPos = playerControls.current.target;
      const dist = playerPos.distanceTo(new Vector3(...computerPos));
      
      if (dist < 2.5) { // Interaction radius
        if (!isInRange) setIsInRange(true);
      } else {
        if (isInRange) setIsInRange(false);
      }
    }
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isInRange && (e.key === 'Enter' || e.key === 'e')) {
        onToggleGame();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isInRange, onToggleGame]);

  return isInRange ? (
    <Html position={[computerPos[0], 3, computerPos[2]]} center>
      <div className="bg-white/90 px-4 py-2 rounded-full shadow-lg border-2 border-blue-500 animate-bounce font-bold text-blue-600 whitespace-nowrap cursor-pointer" onClick={onToggleGame}>
        Press 'E' to Play Phishing Quiz
      </div>
    </Html>
  ) : null;
}

export default function TechVocScene({ onExit }) {
  const [playerTarget, setPlayerTarget] = useState({ x: 0, y: 0, z: 5 });
  const [isPlaying, setIsPlaying] = useState(false);
  const controlsRef = useRef();
  const computerPos = [0, 0, -5];

  const handleFloorClick = (e) => {
    // Convert click point to target
    setPlayerTarget(e.point);
  };

  return (
    <div className="w-full h-full relative bg-slate-900">
      <Canvas
        shadows
        camera={{ position: [0, 10, 10], fov: 50 }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={["#1e293b"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 10, 0]} intensity={0.8} castShadow />
        
        <OrbitControls 
          ref={controlsRef}
          enablePan={false}
          maxPolarAngle={Math.PI / 2 - 0.1} // Don't go below floor
          minDistance={5}
          maxDistance={20}
        />

        <group onClick={handleFloorClick}>
           <Room />
        </group>

        <Computer position={computerPos} />

        <Character targetPosition={playerTarget} controlsRef={controlsRef} scale={0.04} />
        
        <GameTrigger 
          playerControls={controlsRef} 
          onToggleGame={() => setIsPlaying(true)} 
          computerPos={computerPos}
        />

      </Canvas>

      {/* UI Overlay */}
      <div className="absolute top-6 left-6 z-10">
        <button 
          onClick={onExit}
          className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/30 px-6 py-3 rounded-full font-bold transition-all flex items-center gap-2"
        >
          <span>←</span> Back to Campus
        </button>
      </div>

      {/* Game Overlay */}
      {isPlaying && (
        <PhishingGame onClose={() => setIsPlaying(false)} />
      )}
    </div>
  );
}
