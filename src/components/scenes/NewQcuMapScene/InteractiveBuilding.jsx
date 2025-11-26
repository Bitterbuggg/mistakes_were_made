import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

export default function InteractiveBuilding({ 
  modelPath, 
  position, 
  rotation = [0, 0, 0],
  scale = 1,
  isInteractable, 
  onClick 
}) {
  const { scene } = useGLTF(modelPath);

  // Clone the scene for this specific instance
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    
    // Clone materials for this instance so each building has independent materials
    clone.traverse((child) => {
      if (child.isMesh) {
        if (Array.isArray(child.material)) {
          child.material = child.material.map(mat => mat.clone());
        } else if (child.material) {
          child.material = child.material.clone();
        }
        
        // Store original emissive for this instance
        if (child.material.emissive) {
          child.userData.originalEmissive = child.material.emissive.clone();
        }
      }
    });
    
    return clone;
  }, [scene]);

  // Handle hover effect
  const handlePointerOver = (e) => {
    if (!isInteractable) return;
    e.stopPropagation();
    // setHovered(true);
    document.body.style.cursor = 'pointer';
    
    clonedScene.traverse((child) => {
      if (child.isMesh && child.material.emissive) {
        child.material.emissive.setHex(0x4488ff);
      }
    });
  };

  const handlePointerOut = (e) => {
    if (!isInteractable) return;
    e.stopPropagation();
    // setHovered(false);
    document.body.style.cursor = 'default';
    
    clonedScene.traverse((child) => {
      if (child.isMesh && child.userData.originalEmissive) {
        child.material.emissive.copy(child.userData.originalEmissive);
      }
    });
  };

  const handleClick = (e) => {
    if (!isInteractable) return;
    e.stopPropagation();
    onClick?.();
  };

  return (
    <primitive
      object={clonedScene}
      position={position}
      rotation={rotation}
      scale={scale}
      {...(isInteractable && {
        onPointerOver: handlePointerOver,
        onPointerOut: handlePointerOut,
        onClick: handleClick
      })}
    />
  );
}

// Intentionally no exports other than default component to keep fast-refresh working
