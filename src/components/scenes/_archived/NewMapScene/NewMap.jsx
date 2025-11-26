import React from 'react';
import { useGLTF } from '@react-three/drei';

export default function NewMap(props) {
  const { scene } = useGLTF('./models/new_qcu_map.glb');
  return <primitive object={scene} {...props} />;
}

useGLTF.preload('./models/new_qcu_map.glb');
