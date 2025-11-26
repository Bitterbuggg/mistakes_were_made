import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../../hooks/useStore';

import { useGLTF } from '@react-three/drei';

function QcuStudent(props) {
  const { scene } = useGLTF("./models/qcu_student_1.glb");
  return <primitive object={scene} {...props} />;
}
useGLTF.preload("./models/qcu_student_1.glb");

export default function Player({ useStoredPosition = false }) {
  const playerRef = useRef();
  const { camera } = useThree();
  const { playerPosition, setPlayerPosition } = useStore();
  
  // Movement state - use stored position only if explicitly told to (returning from building)
  // Otherwise use default position [0, 0, 5] (fresh start / clicking Enter Campus)
  const [position] = useState(useStoredPosition ? playerPosition : [0, 0, 5]);
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

  // Camera lookAt helpers
  const cameraLookAt = useRef(new THREE.Vector3());
  const cameraAngle = useRef(0); // Horizontal rotation angle
  const cameraPitch = useRef(0.3); // Vertical angle (pitch)
  const cameraDistance = useRef(2.5); // Zoom distance

  // Mouse drag state for camera control
  const isDragging = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const lastMouseX = useRef(0);
  const lastMouseY = useRef(0);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (Object.prototype.hasOwnProperty.call(keys.current, key)) {
        keys.current[key] = true;
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (Object.prototype.hasOwnProperty.call(keys.current, key)) {
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

  // Handle mouse click for movement
  useEffect(() => {
    const handleClick = (event) => {
      // Only process left clicks
      if (event.button !== 0) return;
      
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
        const clampedX = THREE.MathUtils.clamp(intersectPoint.x, -100, 100);
        const clampedZ = THREE.MathUtils.clamp(intersectPoint.z, -100, 100);
        
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
      
      // Clamp zoom distance between 0.8 and 5 units
      cameraDistance.current = THREE.MathUtils.clamp(
        cameraDistance.current + delta,
        0.8,  // Min zoom (closest)
        5.0   // Max zoom (farthest)
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
  }, [camera]);

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
      -100,
      100
    );
    const newZ = THREE.MathUtils.clamp(
      player.position.z + velocity.current.z,
      -100,
      100
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

  return (
    <group ref={playerRef} position={position}>
      <QcuStudent scale={0.003} position={[0, 0, 0]} />
      {/* Shadow blob on ground */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[0.4, 16]} />
        <meshBasicMaterial color="#000000" opacity={0.3} transparent />
      </mesh>
    </group>
  );
}
