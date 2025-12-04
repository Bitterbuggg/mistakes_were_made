import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import FallingItem from './FallingItem';

const ITEMS_DATA = [
  { text: 'P@ssw0rd1', isSecure: true },
  { text: 'admin123', isSecure: false },
  { text: 'MyD0gN@me!', isSecure: true },
  { text: '123456', isSecure: false },
  { text: 'qwerty', isSecure: false },
  { text: 'S3cur3L0gin', isSecure: true },
  { text: 'iloveyou', isSecure: false },
  { text: 'Correct-Horse', isSecure: true },
  { text: 'superman', isSecure: false },
  { text: 'Tr0ub4dour', isSecure: true },
];

export default function PasswordFallGame({ onScoreUpdate, onLivesUpdate, onGameOver, onWin }) {
  const [items, setItems] = useState([]);
  const nextId = useRef(0);
  const timer = useRef(0);
  const spawnRate = useRef(1.5); 

  useFrame((state, delta) => {
    timer.current += delta;
    
    if (timer.current > spawnRate.current) {
      timer.current = 0;
      spawnItem();
      spawnRate.current = Math.max(0.8, spawnRate.current * 0.99);
    }
  });

  const spawnItem = () => {
    const data = ITEMS_DATA[Math.floor(Math.random() * ITEMS_DATA.length)];
    
    // Random X position between -8 and 8
    const x = (Math.random() - 0.5) * 16;
    const y = 12; // Start high up
    const z = 0;

    const newItem = {
      id: nextId.current++,
      position: [x, y, z],
      text: data.text,
      isSecure: data.isSecure,
      speed: 3 + Math.random() * 2
    };
    
    setItems(prev => [...prev, newItem]);
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleMiss = (id, isSecure) => {
    removeItem(id);
    if (isSecure) {
      // Missed a good password! Lose life.
      onLivesUpdate(l => {
        const newLives = l - 1;
        if (newLives <= 0) onGameOver();
        return newLives;
      });
    } else {
      // Allowed a bad password to fall? That's actually... good? 
      // Wait, usually "catching" games imply you catch the good stuff.
      // Let's say: Catch STRONG passwords. Let WEAK passwords fall.
      // If a WEAK password falls, it's destroyed safely.
      // If a STRONG password falls, it's a missed opportunity (maybe small penalty or life lost).
      
      // Let's stick to: Catch Good, Ignore Bad.
      // If Good hits ground -> Lose Life.
      // If Bad hits ground -> Nothing (or points?).
    }
  };

  const handleClick = (id, isSecure) => {
    removeItem(id);
    if (isSecure) {
      // Caught a good one!
      onScoreUpdate(s => {
        const newScore = s + 100;
        if (newScore >= 1000) onWin();
        return newScore;
      });
    } else {
      // Caught a bad one! Penalty.
      onScoreUpdate(s => Math.max(0, s - 50));
      onLivesUpdate(l => {
        const newLives = l - 1;
        if (newLives <= 0) onGameOver();
        return newLives;
      });
    }
  };

  return (
    <group>
      {items.map(item => (
        <FallingItem 
          key={item.id} 
          {...item} 
          onMiss={() => handleMiss(item.id, item.isSecure)}
          onClick={() => handleClick(item.id, item.isSecure)}
        />
      ))}
    </group>
  );
}
