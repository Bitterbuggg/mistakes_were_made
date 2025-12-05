import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

export default function FallingItem({ position, text, isSecure, speed, onMiss, onClick }) {
  const group = useRef();

  useFrame((state, delta) => {
    if (!group.current) return;

    // Fall down
    group.current.position.y -= speed * delta;

    // Check if it hit the ground (visual ground is at y=-6)
    if (group.current.position.y < -6) {
      onMiss(); // Trigger miss logic (lose life or points)
    }
  });

  return (
    <group ref={group} position={position}>
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      >
        {/* Clickable Area */}
        <boxGeometry args={[6, 2, 0.5]} />
        <meshBasicMaterial transparent opacity={0.1} color={isSecure ? 'green' : 'red'} />
        
        {/* Text Display */}
        <Text
          position={[0, 0, 0.26]}
          fontSize={0.5}
          color={isSecure ? '#4ade80' : '#f87171'}
          anchorX="center"
          anchorY="middle"
        >
          {text}
        </Text>

        {/* Visual Background for Text */}
        <mesh position={[0, 0, 0]}>
           <boxGeometry args={[3.8, 0.8, 0.1]} />
           <meshStandardMaterial color="#1f2937" />
        </mesh>
      </mesh>
    </group>
  );
}
