import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import Packet from './Packet';

export default function FirewallGame({ onScoreUpdate, onHealthUpdate, onGameOver, onWin }) {
  const [packets, setPackets] = useState([]);
  const nextId = useRef(0);
  const timer = useRef(0);
  const spawnRate = useRef(2.0); // Start with 2 seconds

  useFrame((state, delta) => {
    // Game Loop Logic
    timer.current += delta;
    
    // Spawn logic
    if (timer.current > spawnRate.current) {
      timer.current = 0;
      spawnPacket();
      
      // Ramp up difficulty: Decrease spawn rate down to minimum 0.5s
      spawnRate.current = Math.max(0.5, spawnRate.current * 0.98);
    }
  });

  const spawnPacket = () => {
    const angle = Math.random() * Math.PI * 2;
    const radius = 14; // Spawn slightly off-screen
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    
    // 60% chance of Malware, 40% Safe
    const type = Math.random() > 0.4 ? 'malware' : 'safe'; 
    
    // Random speed variation
    const speed = 3 + Math.random() * 2;

    const newPacket = {
      id: nextId.current++,
      position: [x, 0, z],
      type,
      speed
    };
    
    setPackets(prev => [...prev, newPacket]);
  };

  const removePacket = (id) => {
    setPackets(prev => prev.filter(p => p.id !== id));
  };

  const handleHitCenter = (type) => {
    if (type === 'malware') {
      // Malware hit the server! Damage!
      onHealthUpdate(h => {
        const newHealth = h - 20;
        if (newHealth <= 0) onGameOver();
        return newHealth;
      });
    } else {
      // Safe file reached server! Points!
      onScoreUpdate(s => {
         const newScore = s + 50;
         if (newScore >= 1000) onWin();
         return newScore;
      });
    }
  };

  const handleClickPacket = (id, type) => {
    removePacket(id);
    if (type === 'malware') {
      // Destroyed malware! Points!
      onScoreUpdate(s => {
        const newScore = s + 100;
        if (newScore >= 1000) onWin();
        return newScore;
      });
    } else {
      // Destroyed safe file! Penalty!
      onScoreUpdate(s => Math.max(0, s - 50));
    }
  };

  return (
    <group>
      {packets.map(p => (
        <Packet 
          key={p.id} 
          {...p} 
          onHitCenter={() => {
            removePacket(p.id);
            handleHitCenter(p.type);
          }}
          onClick={() => handleClickPacket(p.id, p.type)}
        />
      ))}
    </group>
  );
}
