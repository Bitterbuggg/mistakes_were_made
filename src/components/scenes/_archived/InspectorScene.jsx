import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function MapInspector() {
  const gltf = useGLTF('./models/new_qcu_map.glb');
  
  // Log all nodes to console
  React.useEffect(() => {
    console.log('=== ORIGINAL MAP STRUCTURE ===');
    console.log('All nodes:', Object.keys(gltf.nodes));
    console.log('All materials:', Object.keys(gltf.materials));
    
    // Traverse scene and log all meshes with their transforms
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        console.log('---');
        console.log('Mesh name:', child.name);
        console.log('Position:', [child.position.x, child.position.y, child.position.z]);
        console.log('Rotation:', [child.rotation.x, child.rotation.y, child.rotation.z]);
        console.log('Scale:', [child.scale.x, child.scale.y, child.scale.z]);
        console.log('Material:', child.material?.name);
      } else if (child.isGroup && child.children.length > 0) {
        console.log('---');
        console.log('Group name:', child.name);
        console.log('Position:', [child.position.x, child.position.y, child.position.z]);
        console.log('Rotation:', [child.rotation.x, child.rotation.y, child.rotation.z]);
        console.log('Scale:', [child.scale.x, child.scale.y, child.scale.z]);
        console.log('Children count:', child.children.length);
      }
    });
  }, [gltf]);

  return <primitive object={gltf.scene} />;
}

export default function InspectorScene() {
  return (
    <div className="w-full h-full fixed top-0 left-0">
      <Canvas camera={{ position: [0, 10, 20], fov: 55 }}>
        <color attach="background" args={["#87ceeb"]} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        
        <MapInspector />
        
        <gridHelper args={[50, 50]} />
        <axesHelper args={[5]} />
        <OrbitControls />
      </Canvas>
      
      <div className="absolute top-4 left-4 bg-white/95 p-4 rounded-lg text-sm">
        <div className="font-bold mb-2">Map Inspector</div>
        <div className="text-xs">Open browser console (F12) to see all meshes and their positions</div>
      </div>
    </div>
  );
}
