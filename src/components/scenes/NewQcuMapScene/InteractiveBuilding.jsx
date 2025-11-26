import React, { useMemo, useState } from 'react';
import { Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export default function InteractiveBuilding({ 
  modelPath, 
  buildingId,
  displayName,
  position, 
  rotation = [0, 0, 0],
  scale = 1,
  isInteractable, 
  onClick 
}) {
  const { scene } = useGLTF(modelPath);
  const [isHovered, setIsHovered] = useState(false);

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

  // Estimate a consistent anchor for the hover label based on the model's bounds
  const labelPosition = useMemo(() => {
    if (!clonedScene) return [0, 2, 0];

    const box = new THREE.Box3();
    const center = new THREE.Vector3();
    clonedScene.updateWorldMatrix(true, true);
    box.setFromObject(clonedScene);
    box.getCenter(center);

    // Lift the label slightly above the model's top
    const yOffset = box.max.y + 0.5;
    return [center.x, yOffset, center.z];
  }, [clonedScene]);

  // Handle hover effect
  const handlePointerOver = (e) => {
    if (!isInteractable) return;
    e.stopPropagation();
    setIsHovered(true);
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
    setIsHovered(false);
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

  const labelText = displayName || buildingId;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive
        object={clonedScene}
        {...(isInteractable && {
          onPointerOver: handlePointerOver,
          onPointerOut: handlePointerOut,
          onClick: handleClick
        })}
      />

      {isInteractable && isHovered && labelText && (
        <Html
          position={labelPosition}
          center
          sprite
          distanceFactor={10}
          style={{ pointerEvents: 'none' }}
        >
          <div
            style={{
              background: 'rgba(68, 136, 255, 0.92)',
              color: '#f7fbff',
              padding: '6px 10px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 600,
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
              whiteSpace: 'nowrap'
            }}
          >
            {labelText}
          </div>
        </Html>
      )}
    </group>
  );
}

// Intentionally no exports other than default component to keep fast-refresh working
