import React, { useMemo, useRef, useState } from 'react';
import { Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';

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
  const { camera } = useThree();
  const [isHovered, setIsHovered] = useState(false);
  const rootRef = useRef(null);
  const labelGroupRef = useRef(null);
  const labelPosition = useRef(new THREE.Vector3());

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
  const updateLabelFromEvent = (event) => {
    if (!rootRef.current) return;
    const worldPos = event.point.clone();
    // Nudge toward camera so the label hovers above the hovered spot
    const towardCamera = new THREE.Vector3().subVectors(camera.position, worldPos).normalize();
    worldPos.add(towardCamera.multiplyScalar(0.2));
    const localPos = worldPos.clone();
    rootRef.current.worldToLocal(localPos);
    labelPosition.current.copy(localPos);
    if (labelGroupRef.current) {
      labelGroupRef.current.position.copy(localPos);
    }
  };

  // Handle hover effect
  const handlePointerOver = (e) => {
    if (!isInteractable) return;
    e.stopPropagation();
    setIsHovered(true);
    document.body.style.cursor = 'pointer';
    updateLabelFromEvent(e);
    
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

  const handlePointerMove = (e) => {
    if (!isInteractable) return;
    if (!isHovered) return;
    updateLabelFromEvent(e);
  };

  const labelText = displayName || buildingId;

  return (
    <group ref={rootRef} position={position} rotation={rotation} scale={scale}>
      <primitive
        object={clonedScene}
        {...(isInteractable && {
          onPointerOver: handlePointerOver,
          onPointerOut: handlePointerOut,
          onPointerMove: handlePointerMove,
          onClick: handleClick
        })}
      />

      {isInteractable && isHovered && labelText && (
        <group ref={labelGroupRef}>
          <Html
            center
            sprite
            distanceFactor={10}
            style={{ pointerEvents: 'none' }}
          >
            <div
              style={{
                background: 'rgba(68, 136, 255, 0.92)',
                color: '#f7fbff',
                padding: '4px 8px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.18)',
                whiteSpace: 'nowrap'
              }}
            >
              {labelText}
            </div>
          </Html>
        </group>
      )}
    </group>
  );
}

// Intentionally no exports other than default component to keep fast-refresh working
