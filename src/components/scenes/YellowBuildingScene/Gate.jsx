import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

export default function Gate({ position, text, isReal, speed, onPass }) {
  const group = useRef();
  const passed = useRef(false);

  useFrame((state, delta) => {
    if (!group.current) return;

    // Move towards the camera (positive Z)
    group.current.position.z += speed * delta;

    // Check if passed the player (player is at z=0)
    if (group.current.position.z > 0 && !passed.current) {
      passed.current = true;
      onPass(group.current.position.z); 
    }
  });

  return (
    <group ref={group} position={position}>
      {/* The Gate Structure */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[6, 3, 0.2]} />
        <meshStandardMaterial color="#4b5563" />
      </mesh>

      {/* Question/Statement Text */}
      <Text
        position={[0, 1.8, 0.11]}
        fontSize={0.3}
        color="white"
        maxWidth={5}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>

      {/* Left Lane Indicator (Real) */}
      <Text
        position={[-2, 0.5, 0.11]}
        fontSize={0.4}
        color="#4ade80"
        anchorX="center"
        anchorY="middle"
      >
        REAL
      </Text>

      {/* Right Lane Indicator (Fake) */}
      <Text
        position={[2, 0.5, 0.11]}
        fontSize={0.4}
        color="#f87171"
        anchorX="center"
        anchorY="middle"
      >
        FAKE
      </Text>
    </group>
  );
}
