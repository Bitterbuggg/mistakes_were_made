import React, { useRef, useState } from 'react';

const ASSET_BASE = import.meta.env.BASE_URL || '/';

export default function CompLabEnvironment({ onPCClick, onFloorClick }) {
  const groupRef = useRef();
  const [hoveredPC, setHoveredPC] = useState(null);

  // PC positions inside Computer Lab building (adjust based on your model)
  const pcPositions = [
    { id: 'pc1', position: [-2, 0, -1], scenario: 'phishing-email-1' },
    { id: 'pc2', position: [0, 0, -1], scenario: 'phishing-email-2' },
    { id: 'pc3', position: [2, 0, -1], scenario: 'phishing-email-3' },
  ];

  const handlePCHover = (pcId) => {
    setHoveredPC(pcId);
    document.body.style.cursor = 'pointer';
  };

  const handlePCHoverOut = () => {
    setHoveredPC(null);
    document.body.style.cursor = 'default';
  };

  return (
    <group ref={groupRef}>
      {/* Floor */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, 0]} 
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          if (onFloorClick) {
            onFloorClick(e.point);
          }
        }}
      >
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#FFE0A4" />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 2.5, -5]} receiveShadow>
        <boxGeometry args={[20, 5, 0.2]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      <mesh position={[-10, 2.5, 5]} receiveShadow rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[20, 5, 0.2]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      <mesh position={[10, 2.5, 5]} receiveShadow rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[20, 5, 0.2]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* PC Stations */}
      {pcPositions.map((pc) => (
        <group key={pc.id} position={pc.position}>
          {/* Desk */}
          <mesh position={[0, 0.4, 0]} castShadow>
            <boxGeometry args={[1.2, 0.8, 0.8]} />
            <meshStandardMaterial color="#F9BD4B" />
          </mesh>

          {/* Monitor */}
          <mesh 
            position={[0, 1.1, -0.2]} 
            castShadow
            onClick={(e) => {
              e.stopPropagation();
              onPCClick(pc.scenario);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              handlePCHover(pc.id);
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              handlePCHoverOut();
            }}
          >
            <boxGeometry args={[0.9, 0.6, 0.05]} />
            <meshStandardMaterial 
              color={hoveredPC === pc.id ? '#1a1a1a' : '#000000'}
              emissive={hoveredPC === pc.id ? '#3b82f6' : '#000000'}
              emissiveIntensity={hoveredPC === pc.id ? 0.3 : 0}
            />
          </mesh>

          {/* Screen */}
          <mesh position={[0, 1.1, -0.17]}>
            <planeGeometry args={[0.8, 0.5]} />
            <meshBasicMaterial color={hoveredPC === pc.id ? '#60a5fa' : '#3b82f6'} />
          </mesh>

          {/* Keyboard */}
          <mesh position={[0, 0.81, 0.2]} castShadow>
            <boxGeometry args={[0.5, 0.02, 0.2]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
        </group>
      ))}

      {/* Lighting fixtures */}
      <pointLight position={[-3, 4, -2]} intensity={0.9} distance={12} color="#FFFFFF" />
      <pointLight position={[3, 4, -2]} intensity={0.9} distance={12} color="#FFFFFF" />
      <pointLight position={[0, 4, 2]} intensity={0.8} distance={12} color="#F9BD4B" />
    </group>
  );
}
