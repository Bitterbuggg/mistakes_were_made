import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import FallingItem from './FallingItem';

const ITEMS_DATA = [
  // Secure passwords (complex, mixed characters)
  { text: 'P@ssw0rd1', isSecure: true },
  { text: 'MyD0gN@me!', isSecure: true },
  { text: 'S3cur3L0gin', isSecure: true },
  { text: 'Correct-Horse', isSecure: true },
  { text: 'Tr0ub4dour', isSecure: true },
  { text: 'xK9#mNq$vZ', isSecure: true },
  { text: 'B1ueM00n!@', isSecure: true },
  { text: 'C0ff33T!m3', isSecure: true },
  { text: 'R@inB0w#42', isSecure: true },
  { text: 'Sunf10w3r$', isSecure: true },
  { text: 'L!ghtN1ng9', isSecure: true },
  { text: 'Th3F0x&H0und', isSecure: true },
  { text: 'P!zz@L0v3r', isSecure: true },
  { text: 'Str0ngP@ss!', isSecure: true },
  { text: 'G@l@xy#2024', isSecure: true },
  { text: 'N3ptun3$Sea', isSecure: true },
  { text: 'F!reW@lk3r', isSecure: true },
  { text: 'C0d3M@st3r!', isSecure: true },
  { text: 'Dr@g0nF!y9', isSecure: true },
  { text: 'Phoen!x#R1s3', isSecure: true },
  { text: 'T!g3rStr!p3', isSecure: true },
  { text: 'W!nt3rSn0w!', isSecure: true },
  { text: 'Summ3r#V1b3', isSecure: true },
  { text: 'N!ghtSk!3s', isSecure: true },
  { text: 'St@rL!ght9', isSecure: true },

  // Insecure passwords (common, simple, predictable)
  { text: 'admin123', isSecure: false },
  { text: '123456', isSecure: false },
  { text: 'qwerty', isSecure: false },
  { text: 'iloveyou', isSecure: false },
  { text: 'superman', isSecure: false },
  { text: 'password', isSecure: false },
  { text: 'letmein', isSecure: false },
  { text: '12345678', isSecure: false },
  { text: 'abc123', isSecure: false },
  { text: 'monkey', isSecure: false },
  { text: 'dragon', isSecure: false },
  { text: 'master', isSecure: false },
  { text: 'login', isSecure: false },
  { text: 'welcome', isSecure: false },
  { text: 'shadow', isSecure: false },
  { text: 'sunshine', isSecure: false },
  { text: 'princess', isSecure: false },
  { text: 'football', isSecure: false },
  { text: 'michael', isSecure: false },
  { text: 'trustno1', isSecure: false },
  { text: 'passw0rd', isSecure: false },
  { text: 'hello123', isSecure: false },
  { text: 'charlie', isSecure: false },
  { text: 'donald', isSecure: false },
  { text: 'password1', isSecure: false },
  { text: 'qwerty123', isSecure: false },
  { text: 'baseball', isSecure: false },
  { text: 'access', isSecure: false },
  { text: 'secret', isSecure: false },
  { text: 'ninja', isSecure: false },
  { text: 'mustang', isSecure: false },
  { text: 'batman', isSecure: false },
  { text: '1234567890', isSecure: false },
  { text: 'cheese', isSecure: false },
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
