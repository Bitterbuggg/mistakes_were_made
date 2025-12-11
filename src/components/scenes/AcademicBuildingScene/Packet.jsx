import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { Text } from '@react-three/drei';

export default function Packet({ position, type, tag, speed, onHitCenter, onClick }) {
  const group = useRef();
  const visual = useRef();
  const hasHit = useRef(false);
  
  // We use a ref for position to avoid re-creating vectors every frame if possible, 
  // but creating a new Vector3 inside useFrame is cheap enough for this scale.
  const target = new Vector3(0, 0, 0);

  useFrame((state, delta) => {
    if (!group.current) return;
    
    const currentPos = group.current.position;
    // Simple movement towards center
    const dir = new Vector3().subVectors(target, currentPos).normalize();
    const dist = currentPos.distanceTo(target);

    // Hit radius
    if (dist < 1.0) {
      if (!hasHit.current) {
        hasHit.current = true;
        onHitCenter();
      }
    } else {
      group.current.position.add(dir.multiplyScalar(speed * delta));
      
      // Rotate visual mesh for flair
      if (visual.current) {
        visual.current.rotation.x += delta * 2;
        visual.current.rotation.y += delta * 3;
      }
    }
  });

  return (
    <group ref={group} position={position}>
      {/* Label Tag */}
      {tag && (
        <Text
          position={[0, 1.2, 0]} // Float slightly above
          rotation={[-Math.PI / 2, 0, 0]} // Face up towards camera
          fontSize={0.4}
          color={type === 'malware' ? '#fca5a5' : '#86efac'} // Light red / Light green
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {tag}
        </Text>
      )}

      {/* Larger Hit Area (Invisible Sphere) */}
      <mesh 
        onPointerDown={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Visual Representation */}
      <mesh ref={visual}>
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
    </group>
  );
}
