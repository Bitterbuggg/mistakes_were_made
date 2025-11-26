import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../../hooks/useStore';

export default function Player({ useStoredPosition = true }) {
  const playerRef = useRef();
  const { camera } = useThree();
  const { playerPosition, setPlayerPosition } = useStore();

  // Derive map bounds from the base environment so movement stays on the campus
  const { scene: baseScene } = useGLTF('./models/qcu_base.glb');
  const { scene: studentScene } = useGLTF('./models/qcu_student_4.glb');
  const mapBounds = useMemo(() => {
    if (!baseScene) return null;
    const box = new THREE.Box3().setFromObject(baseScene);
    const margin = 0.5;
    return {
      minX: box.min.x - margin,
      maxX: box.max.x + margin,
      minZ: box.min.z - margin,
      maxZ: box.max.z + margin,
      centerX: (box.min.x + box.max.x) / 2,
      centerZ: (box.min.z + box.max.z) / 2,
    };
  }, [baseScene]);

  const bounds = useMemo(
    () =>
      mapBounds || {
        minX: -6,
        maxX: 6,
        minZ: -10,
        maxZ: 4,
        centerX: 0,
        centerZ: 0,
      },
    [mapBounds]
  );

  const defaultPosition = useMemo(() => {
    if (useStoredPosition && playerPosition) return playerPosition;
    const startZ = THREE.MathUtils.clamp(bounds.centerZ + 1, bounds.minZ, bounds.maxZ);
    return [bounds.centerX, 0, startZ];
  }, [useStoredPosition, playerPosition, bounds]);

  const [position] = useState(defaultPosition);
  const velocity = useRef(new THREE.Vector3());
  const targetPosition = useRef(null);
  const moveSpeed = 0.03;
  const clickMoveSpeed = 0.04;

  // Keyboard state
  const keys = useRef({
    w: false,
    a: false,
    s: false,
    d: false,
  });

  // Camera offset
  const cameraLookAt = useRef(new THREE.Vector3());
  const cameraAngle = useRef(0); // Horizontal rotation angle
  const cameraPitch = useRef(0.35); // Vertical angle (pitch)
  const cameraDistance = useRef(1.2); // Zoom distance (closer third-person default)

  // Mouse drag state for camera control
  const isDragging = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const lastMouseX = useRef(0);
  const lastMouseY = useRef(0);

  // Player model - clone and scale to match the previous capsule height (~0.15 units tall)
  const playerModel = useMemo(() => {
    if (!studentScene) return null;

    const clone = studentScene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);

    const desiredHeight = 0.15;
    const scaleFactor = size.y > 0 ? desiredHeight / size.y : 1;
    const yOffset = -box.min.y * scaleFactor;

    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    clone.scale.setScalar(scaleFactor);
    clone.position.set(0, yOffset, 0);

    return clone;
  }, [studentScene]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (key in keys.current) {
        keys.current[key] = true;
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (key in keys.current) {
        keys.current[key] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Handle mouse click for movement and camera control
  useEffect(() => {
    const handleClick = (event) => {
      // Only process left clicks
      if (event.button !== 0) return;

      // Ignore if was dragging camera (moved more than 5 pixels) or actively rotating
      if (isDragging.current) return;
      // Ignore if was dragging camera (moved more than 5 pixels)
      const dragDistance = Math.sqrt(
        Math.pow(event.clientX - dragStartPos.current.x, 2) +
        Math.pow(event.clientY - dragStartPos.current.y, 2)
      );

      if (dragDistance > 5) {
        return;
      }

      // Ignore clicks on UI elements
      if (event.target.tagName !== 'CANVAS') return;

      // Convert mouse position to normalized device coordinates
      const rect = event.target.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Create a new raycaster from the current camera position
      const mouse = new THREE.Vector2(x, y);
      const newRaycaster = new THREE.Raycaster();
      newRaycaster.setFromCamera(mouse, camera);

      // Find ground plane (y = 0)
      const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const intersectPoint = new THREE.Vector3();
      const result = newRaycaster.ray.intersectPlane(groundPlane, intersectPoint);

      if (result && intersectPoint) {
        // Clamp the target position to boundaries
        const clampedX = THREE.MathUtils.clamp(intersectPoint.x, bounds.minX, bounds.maxX);
        const clampedZ = THREE.MathUtils.clamp(intersectPoint.z, bounds.minZ, bounds.maxZ);

        // Set new target - this will override any previous target
        targetPosition.current = new THREE.Vector3(clampedX, 0, clampedZ);
      }
    };

    const handleMouseDown = (event) => {
      // Store starting position for all mouse buttons
      dragStartPos.current = { x: event.clientX, y: event.clientY };

      // Right click or middle mouse button for camera rotation
      if (event.button === 2 || event.button === 1) {
        event.preventDefault();
        isDragging.current = false;
        lastMouseX.current = event.clientX;
        lastMouseY.current = event.clientY;
      }
    };

    const handleMouseMove = (event) => {
      if (event.buttons === 2 || event.buttons === 4) { // Right or middle button
        isDragging.current = true;
        const deltaX = event.clientX - lastMouseX.current;
        const deltaY = event.clientY - lastMouseY.current;

        // Update camera angle (horizontal rotation)
        cameraAngle.current -= deltaX * 0.005;

        // Update camera pitch (vertical rotation)
        cameraPitch.current = THREE.MathUtils.clamp(
          cameraPitch.current + deltaY * 0.003,
          0.1,  // Min pitch (looking down)
          1.2   // Max pitch (looking up)
        );

        lastMouseX.current = event.clientX;
        lastMouseY.current = event.clientY;
      }
    };

    const handleMouseUp = (event) => {
      if (event.button === 2 || event.button === 1) {
        // Reset drag flag after a moment
        setTimeout(() => {
          isDragging.current = false;
        }, 10);
      }
    };

    const handleContextMenu = (event) => {
      event.preventDefault(); // Prevent right-click context menu
    };

    const handleWheel = (event) => {
      event.preventDefault();

      // Adjust zoom distance based on wheel delta
      const zoomSpeed = 0.001;
      const delta = event.deltaY * zoomSpeed;

      // Clamp zoom distance to allow very close third-person view
      cameraDistance.current = THREE.MathUtils.clamp(
        cameraDistance.current + delta,
        0.1,  // Min zoom (closest)
        4.0   // Max zoom (farthest)
      );
    };

    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('click', handleClick);
      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseup', handleMouseUp);
      canvas.addEventListener('contextmenu', handleContextMenu);
      canvas.addEventListener('wheel', handleWheel, { passive: false });

      return () => {
        canvas.removeEventListener('click', handleClick);
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('contextmenu', handleContextMenu);
        canvas.removeEventListener('wheel', handleWheel);
      };
    }
  }, [camera, bounds]);

  // Save position to store periodically (every 30 frames to avoid excessive updates)
  const frameCount = useRef(0);

  // Update player position and camera every frame
  useFrame(() => {
    if (!playerRef.current) return;

    const player = playerRef.current;
    const currentPos = new THREE.Vector3(
      player.position.x,
      player.position.y,
      player.position.z
    );

    // Save position to store every 30 frames
    frameCount.current++;
    if (frameCount.current % 30 === 0) {
      setPlayerPosition([player.position.x, player.position.y, player.position.z]);
    }

    // Reset velocity
    velocity.current.set(0, 0, 0);

    // Handle WASD movement
    const hasKeyboardInput = keys.current.w || keys.current.s || keys.current.a || keys.current.d;

    if (keys.current.w) velocity.current.z -= moveSpeed;
    if (keys.current.s) velocity.current.z += moveSpeed;
    if (keys.current.a) velocity.current.x -= moveSpeed;
    if (keys.current.d) velocity.current.x += moveSpeed;

    // If WASD is being used, cancel click-to-move
    if (hasKeyboardInput) {
      targetPosition.current = null;
      velocity.current.normalize().multiplyScalar(moveSpeed);
    }
    // Handle click-to-move (only if no keyboard input)
    else if (targetPosition.current) {
      const direction = new THREE.Vector3()
        .subVectors(targetPosition.current, currentPos);

      const distance = currentPos.distanceTo(targetPosition.current);

      // Stop when close enough to target
      if (distance > 0.1) {
        velocity.current.copy(direction).normalize().multiplyScalar(clickMoveSpeed);
      } else {
        // Reached destination, stop moving
        targetPosition.current = null;
        velocity.current.set(0, 0, 0);
      }
    }

    // Apply velocity with boundaries
    const newX = THREE.MathUtils.clamp(
      player.position.x + velocity.current.x,
      bounds.minX,
      bounds.maxX
    );
    const newZ = THREE.MathUtils.clamp(
      player.position.z + velocity.current.z,
      bounds.minZ,
      bounds.maxZ
    );

    player.position.x = newX;
    player.position.z = newZ;

    // Rotate player to face movement direction
    if (velocity.current.length() > 0.01) {
      const angle = Math.atan2(velocity.current.x, velocity.current.z);
      player.rotation.y = THREE.MathUtils.lerp(player.rotation.y, angle, 0.1);
    }

    // Smooth camera follow with orbital rotation and zoom
    const radius = cameraDistance.current; // Use dynamic zoom distance
    const offsetX = Math.sin(cameraAngle.current) * radius * Math.cos(cameraPitch.current);
    const offsetY = 1.5 + Math.sin(cameraPitch.current) * radius;
    const offsetZ = Math.cos(cameraAngle.current) * radius * Math.cos(cameraPitch.current);

    const idealCameraPosition = new THREE.Vector3(
      player.position.x + offsetX,
      player.position.y + offsetY,
      player.position.z + offsetZ
    );

    // Smoother camera position update
    camera.position.lerp(idealCameraPosition, 0.2);

    // Always look directly at player - no interpolation needed here
    cameraLookAt.current.set(
      player.position.x,
      player.position.y + 0.05,
      player.position.z
    );
    camera.lookAt(cameraLookAt.current);
  });

  // Re-center player once bounds are known (only for fresh sessions)
  useEffect(() => {
    if (!useStoredPosition && playerRef.current && mapBounds) {
      const startZ = THREE.MathUtils.clamp(mapBounds.centerZ + 1, mapBounds.minZ, mapBounds.maxZ);
      playerRef.current.position.set(mapBounds.centerX, 0, startZ);
    }
  }, [useStoredPosition, mapBounds]);

  return (
    <group ref={playerRef} position={position}>
      {playerModel && <primitive object={playerModel} />}
    </group>
  );
}

useGLTF.preload('./models/qcu_base.glb');
useGLTF.preload('./models/qcu_student_4.glb');
