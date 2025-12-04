import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import LaneRunner from './LaneRunner';
import Gate from './Gate';

const STATEMENTS = [
  { text: "Your bank asks for your PIN via email.", isReal: false }, // Fake/Scam
  { text: "https://google.com is a valid URL.", isReal: true }, // Real
  { text: "You won a lottery you never entered!", isReal: false }, // Fake
  { text: "2FA adds extra security.", isReal: true }, // Real
  { text: "A prince wants to send you millions.", isReal: false }, // Fake
  { text: "Software updates patch security holes.", isReal: true }, // Real
  { text: "Click here to speed up your PC!", isReal: false }, // Fake
  { text: "Password123 is a weak password.", isReal: true }, // Real (Statement is Fact)
  { text: "Support calls asking for passwords.", isReal: false }, // Fake/Scam
  { text: "HTTPS indicates a secure connection.", isReal: true }, // Real
];

export default function FactOrFakeGame({ onScoreUpdate, onLivesUpdate, onGameOver, onWin }) {
  const [gates, setGates] = useState([]);
  const [lane, setLane] = useState(0); // 0 = Left (Real), 1 = Right (Fake)
  
  const nextId = useRef(0);
  const timer = useRef(0);
  const spawnRate = useRef(4.0); 
  const gameSpeed = useRef(10); // Speed of gates moving towards player

  useFrame((state, delta) => {
    timer.current += delta;
    
    // Spawn Gates
    if (timer.current > spawnRate.current) {
      timer.current = 0;
      spawnGate();
      // Increase speed slightly
      gameSpeed.current = Math.min(25, gameSpeed.current + 0.5);
      spawnRate.current = Math.max(1.0, spawnRate.current * 0.99); // Changed from 0.98 to 0.99
    }
    
    // Check collisions (Collision logic is better handled in the Gate component via onPass, 
    // but we need to know the player's lane EXACTLY when the gate passes Z=0).
    // Since React state updates might lag slightly behind frame, let's trust the visual alignment.
    
    // Actually, let's do collision check here by iterating gates
    setGates(prev => prev.filter(gate => {
       // Check if gate has passed behind player
       if (gate.z > 5) return false; 
       
       // Move gate logic is inside Gate component for visuals, 
       // but for collision we need to track it here or sync.
       // Problem: if we move in child component, parent doesn't know exact Z.
       // BETTER APPROACH: Move logic in parent (here).
       
       return true;
    }));
  });

  // We'll manage gate positions in state to ensure sync
  useFrame((state, delta) => {
     setGates(prev => prev.map(g => {
       const newZ = g.z + gameSpeed.current * delta;
       
       // Collision Check at Z=0 (approx)
       if (g.z <= 0 && newZ > 0 && !g.processed) {
         handleCollision(g, lane);
         return { ...g, z: newZ, processed: true };
       }
       return { ...g, z: newZ };
     }).filter(g => g.z < 10)); // Remove if far behind
  });

  const spawnGate = () => {
    const data = STATEMENTS[Math.floor(Math.random() * STATEMENTS.length)];
    setGates(prev => [
      ...prev,
      {
        id: nextId.current++,
        z: -50, // Start far away
        text: data.text,
        isReal: data.isReal,
        processed: false
      }
    ]);
  };

  const handleCollision = (gate, playerLane) => {
    // Logic:
    // If statement is REAL (isReal=true), correct lane is LEFT (0).
    // If statement is FAKE (isReal=false), correct lane is RIGHT (1).
    
    const correctLane = gate.isReal ? 0 : 1;
    
    if (playerLane === correctLane) {
      // Correct!
      onScoreUpdate(s => {
        const newScore = s + 100;
        if (newScore >= 1000) onWin();
        return newScore;
      });
    } else {
      // Wrong!
      onLivesUpdate(l => {
        const newLives = l - 1;
        if (newLives <= 0) onGameOver();
        return newLives;
      });
    }
  };

  return (
    <group>
      {/* Player */}
      <LaneRunner lane={lane} setLane={setLane} />
      
      {/* Gates */}
      {gates.map(gate => (
        <group key={gate.id} position={[0, 0, gate.z]}>
           {/* We render a static Gate at 0,0,0 relative to this group */}
           {/* Pass dummy speed 0 because parent handles movement */}
           <Gate text={gate.text} speed={0} onPass={() => {}} /> 
        </group>
      ))}
      
      {/* Moving Floor Effect (Optional) */}
      <gridHelper args={[100, 50, 0x444444, 0x222222]} position={[0, 0, -25]} />
    </group>
  );
}
