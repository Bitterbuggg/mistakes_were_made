import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function BaseMapInspector() {
  const gltf = useGLTF('./models/qcu_base.glb');
  
  React.useEffect(() => {
    console.log('=== BASE MAP CONTENTS ===');
    console.log('Node names:', Object.keys(gltf.nodes));
    
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        console.log('Mesh:', child.name, 'Position:', [child.position.x, child.position.y, child.position.z]);
      }
    });
  }, [gltf]);

  return <primitive object={gltf.scene} />;
}

export default function BaseInspectorScene() {
  return (
    <div className="w-full h-full fixed top-0 left-0">
      <Canvas camera={{ position: [0, 10, 20], fov: 55 }}>
        <color attach="background" args={["#87ceeb"]} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        
        <BaseMapInspector />
        
        <gridHelper args={[50, 50]} />
        <axesHelper args={[5]} />
        <OrbitControls />
      </Canvas>
      
      <div className="absolute top-4 left-4 bg-white/95 p-4 rounded-lg text-sm">
        <div className="font-bold mb-2">Base Map Inspector</div>
        <div className="text-xs">Check console (F12) to see what's in the base map</div>
      </div>
    </div>
  );
}
