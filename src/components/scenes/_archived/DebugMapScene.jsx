import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

// Component to show original merged map
function OriginalMap() {
  const { scene } = useGLTF('./models/new_qcu_map.glb');
  return <primitive object={scene} position={[-15, 0, 0]} />;
}

// Component to show separated parts
function SeparatedParts() {
  const base = useGLTF('./models/qcu_base.glb');
  const bldg1 = useGLTF('./models/qcu_bldg1.glb');
  const bldg2 = useGLTF('./models/qcu_bldg2.glb');
  const bldg4 = useGLTF('./models/qcu_bldg4.glb');
  const bldg5 = useGLTF('./models/qcu_bldg5.glb');
  const bldg6 = useGLTF('./models/qcu_bldg6.glb');
  const compLab = useGLTF('./models/qcu_bldg_comp_lab.glb');

  return (
    <group position={[15, 0, 0]}>
      <primitive object={base.scene.clone()} />
      <primitive object={bldg1.scene.clone()} position={[0, 0.02, 0]} />
      <primitive object={bldg2.scene.clone()} position={[0, 0.02, 0]} />
      <primitive object={bldg4.scene.clone()} position={[0, 0.02, 0]} />
      <primitive object={bldg5.scene.clone()} position={[0, 0.02, 0]} />
      <primitive object={bldg6.scene.clone()} position={[0, 0.02, 0]} />
      <primitive object={compLab.scene.clone()} position={[3, 0.02, -4.6]} rotation={[0, -1.571, 0]} scale={0.518} />
    </group>
  );
}

export default function DebugMapScene() {
  return (
    <div className="w-full h-full fixed top-0 left-0">
      <Canvas shadows camera={{ position: [0, 10, 20], fov: 55 }}>
        <color attach="background" args={["#87ceeb"]} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 10, 5]} intensity={1} castShadow />

        <OriginalMap />
        <SeparatedParts />
        
        <gridHelper args={[50, 50]} />
        <axesHelper args={[5]} />
        
        <OrbitControls />
      </Canvas>
      
      <div className="absolute top-4 left-4 bg-white/95 p-4 rounded-lg text-sm max-w-md">
        <div className="font-bold mb-2 text-lg">🗺️ Building Position Debug</div>
        <div className="mb-2">
          <strong>Left:</strong> Original merged map<br/>
          <strong>Right:</strong> Your separated building files
        </div>
        <div className="text-xs text-gray-700 mt-2 p-2 bg-yellow-50 rounded">
          <strong>Instructions:</strong> Compare both maps and identify which building files match which positions. Refer to BUILDING_COORDINATES.md
        </div>
      </div>
    </div>
  );
}
