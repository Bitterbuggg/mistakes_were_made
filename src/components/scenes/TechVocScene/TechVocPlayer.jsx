import React, { useRef, useEffect, useState } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ASSET_BASE = import.meta.env.BASE_URL || '/';

export default function TechVocPlayer({ targetPosition, controlsRef }) {
  const group = useRef();
  const { scene, animations } = useGLTF(`${ASSET_BASE}models/qcu_student_4.glb`);
  const { actions, names } = useAnimations(animations, group);
  const [currentAction, setCurrentAction] = useState('Idle');

  useEffect(() => {
    // Set initial player position
    if (group.current) {
      group.current.position.set(0, 0, 3);
    }
  }, []);

  useEffect(() => {
    let animName = currentAction;
    const action = actions[animName] || actions[names[0]];
    if (action) {
      action.reset().fadeIn(0.2).play();
      return () => action.fadeOut(0.2);
    }
  }, [currentAction, actions, names]);

  useFrame((state, delta) => {
    if (!group.current) return;

    const playerPos = group.current.position;
    const startPos = playerPos.clone();

    // Handle Movement (same as CampusMap Character)
    if (targetPosition) {
      const target = new THREE.Vector3(targetPosition.x, 0, targetPosition.z);
      const distance = playerPos.distanceTo(target);
      const stopThreshold = 0.1;

      if (distance > stopThreshold) {
        const speed = 3;
        const direction = target.clone().sub(playerPos).normalize();
        
        const moveStep = speed * delta;
        if (moveStep < distance) {
          playerPos.add(direction.multiplyScalar(moveStep));
        } else {
          playerPos.copy(target);
        }

        const lookTarget = new THREE.Vector3(target.x, playerPos.y, target.z);
        group.current.lookAt(lookTarget);

        if (currentAction !== 'Run' && currentAction !== 'Walk') {
          setCurrentAction(names.find(n => /run/i.test(n)) || names.find(n => /walk/i.test(n)) || names[0]); 
        }
      } else {
        if (currentAction !== 'Idle') {
          setCurrentAction(names.find(n => /idle/i.test(n)) || names[0]);
        }
      }
    }

    // Update Orbital Camera to follow character
    if (controlsRef && controlsRef.current) {
      const displacement = playerPos.clone().sub(startPos);

      // Move camera by the same displacement to maintain relative position
      state.camera.position.add(displacement);

      // Update target to lock on character
      controlsRef.current.target.copy(playerPos);
      controlsRef.current.update();
    }
  });

  return <primitive ref={group} object={scene} scale={0.03} />;
}

useGLTF.preload(`${ASSET_BASE}models/qcu_student_4.glb`);
