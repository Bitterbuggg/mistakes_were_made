import React from 'react';
import { useGLTF } from '@react-three/drei';
import InteractiveBuilding from './InteractiveBuilding';

export default function QcuMapModels({ onBuildingClick, campusEntered = true, buildingConfigs = {} }) {
  // Load the base map (non-interactive terrain/paths)
  const baseMap = useGLTF('./models/qcu_base.glb');

  return (
    <>
      {/* Base Map - Static environment */}
      <primitive object={baseMap.scene} position={[0, 0, 0]} />
      
      {/* Interactive Buildings - Accurate positions from original map */}
      
      {/* TechVoc = qcu_bldg6.glb (adjusted position to avoid overlap) */}
      <InteractiveBuilding
        modelPath="./models/qcu_bldg6.glb"
        buildingId="techvoc"
        displayName={buildingConfigs?.techvoc?.name || 'TechVoc Building'}
        position={[0.0, 0.02, 2.2]}
        rotation={[0, 0, 0]}
        scale={1}
        isInteractable={campusEntered}
        onClick={() => onBuildingClick("techvoc")}
      />
      
      {/* Yellow_Bldg = qcu_bldg5.glb (has built-in rotation [PI, 0, PI], need to counter-rotate) */}
      <InteractiveBuilding
        modelPath="./models/qcu_bldg5.glb"
        buildingId="yellow-building"
        displayName={buildingConfigs?.["yellow-building"]?.name || 'Yellow Building'}
        position={[1, 0.02, -2]}
        rotation={[-Math.PI, 0, -Math.PI]}
        scale={1}
        isInteractable={campusEntered}
        onClick={() => onBuildingClick("yellow-building")}
      />
      
      {/* Admin_bldg = qcu_bldg4.glb */}
      <InteractiveBuilding
        modelPath="./models/qcu_bldg4.glb"
        buildingId="admin-building"
        displayName={buildingConfigs?.["admin-building"]?.name || 'Admin Building'}
        position={[-1.259, 0.02, -4.72]}
        rotation={[0, 0, 0]}
        scale={1}
        isInteractable={campusEntered}
        onClick={() => onBuildingClick("admin-building")}
      />
      
      {/* Bautista = qcu_bldg2.glb (has built-in rotation [0, 1.571, 0] and scale [0.9,1,1], need to counter-rotate) */}
      <InteractiveBuilding
        modelPath="./models/qcu_bldg2.glb"
        buildingId="bautista"
        displayName={buildingConfigs?.bautista?.name || 'Bautista Hall'}
        position={[-1.2, 0.02, -7.5]}
        rotation={[0, -1.571, 0]}
        scale={1}
        isInteractable={campusEntered}
        onClick={() => onBuildingClick("bautista")}
      />
      
      {/* Cube009 group (computer lab) = qcu_bldg1.glb */}
      <InteractiveBuilding
        modelPath="./models/qcu_bldg1.glb"
        buildingId="computer-lab"
        displayName={buildingConfigs?.["computer-lab"]?.name || 'Computer Lab'}
        position={[3, 0.02, -4.6]}
        rotation={[0, -1.571, 0]}
        scale={0.518}
        isInteractable={campusEntered}
        onClick={() => onBuildingClick("computer-lab")}
      />
      
      {/* Cube010 group = qcu_bldg3.glb */}
      <InteractiveBuilding
        modelPath="./models/qcu_bldg3.glb"
        buildingId="cube010-building"
        displayName={buildingConfigs?.["cube010-building"]?.name || 'Academic Building'}
        position={[3, 0.02, -7.3]}
        rotation={[0, -1.571, 0]}
        scale={0.602}
        isInteractable={campusEntered}
        onClick={() => onBuildingClick("cube010-building")}
      />
    </>
  );
}

// Preload all models
useGLTF.preload('./models/qcu_base.glb');
useGLTF.preload('./models/qcu_bldg1.glb');
useGLTF.preload('./models/qcu_bldg2.glb');
useGLTF.preload('./models/qcu_bldg3.glb');
useGLTF.preload('./models/qcu_bldg4.glb');
useGLTF.preload('./models/qcu_bldg5.glb');
useGLTF.preload('./models/qcu_bldg6.glb');
