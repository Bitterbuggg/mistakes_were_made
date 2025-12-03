import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';

export default function Packet({ position, type, speed, onHitCenter, onClick }) {
  const mesh = useRef();
  
  // We use a ref for position to avoid re-creating vectors every frame if possible, 
  // but creating a new Vector3 inside useFrame is cheap enough for this scale.
  const target = new Vector3(0, 0, 0);

  useFrame((state, delta) => {
    if (!mesh.current) return;
    
    const currentPos = mesh.current.position;
    // Simple movement towards center
    const dir = new Vector3().subVectors(target, currentPos).normalize();
    const dist = currentPos.distanceTo(target);

    // Hit radius
    if (dist < 1.0) {
      onHitCenter();
    } else {
      mesh.current.position.add(dir.multiplyScalar(speed * delta));
      
      // Rotate for visual flair
      mesh.current.rotation.x += delta * 2;
      mesh.current.rotation.y += delta * 3;
    }
  });

  return (
    <mesh 
      ref={mesh} 
      position={position} 
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'auto'}
    >
      {type === 'malware' ? (
        // Spiky shape for malware
        <icosahedronGeometry args={[0.4, 0]} />
      ) : (
        // Box for safe files
        <boxGeometry args={[0.5, 0.5, 0.5]} />
      )}
      <meshStandardMaterial 
        color={type === 'malware' ? '#ef4444' : '#10b981'} 
        emissive={type === 'malware' ? '#991b1b' : '#047857'}
        emissiveIntensity={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}
