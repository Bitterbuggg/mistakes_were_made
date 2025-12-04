import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';

export default function LaneRunner({ lane, setLane }) {
  const mesh = useRef();
  
  // Target X position based on lane (-1 for Left, 1 for Right)
  // Lane 0 = Left (Real), Lane 1 = Right (Fake)
  // Let's map: 0 -> -2, 1 -> 2
  const targetX = lane === 0 ? -2 : 2;

  useFrame((state, delta) => {
    if (!mesh.current) return;
    
    // Smooth lerp to target lane
    mesh.current.position.x += (targetX - mesh.current.position.x) * 10 * delta;
    
    // Bobbing animation
    mesh.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 10) * 0.1;
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'ArrowLeft') setLane(0);
      if (e.code === 'ArrowRight') setLane(1);
      if (e.code === 'KeyA') setLane(0);
      if (e.code === 'KeyD') setLane(1);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setLane]);

  return (
    <mesh ref={mesh} position={[0, 0.5, 0]}>
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <meshStandardMaterial color="#fbbf24" /> {/* Yellow for Yellow Building */}
      <mesh position={[0, 0.2, -0.3]}>
        <boxGeometry args={[0.6, 0.2, 0.2]} />
        <meshStandardMaterial color="#1f2937" /> {/* Goggles/Visor */}
      </mesh>
    </mesh>
  );
}
