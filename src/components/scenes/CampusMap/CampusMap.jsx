import React, { useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { AnimatePresence } from "framer-motion";
import { OrbitControls } from "@react-three/drei";
import { MOUSE } from "three";

import CampusModels from "../../canvas/CampusModels";
import Character from "../../canvas/Character";
import BuildingModal from "../../ui/BuildingModal";
import { buildingConfigs } from "../../../data/buildings";

export default function CampusMap() {
  const [showBuildingModal, setShowBuildingModal] = useState(null);
  const [playerTarget, setPlayerTarget] = useState({ x: 0, y: 0, z: 5 });
  const controlsRef = useRef();

  const handleBuildingClick = (buildingId) => {
    setShowBuildingModal(buildingId);
  };

  const handleFloorClick = (point) => {
    setPlayerTarget(point);
  };

  const handleEnterBuilding = (buildingId) => {
    setShowBuildingModal(null);
    console.log(`Entering building: ${buildingId}`);
  };

  const handleCloseModal = () => {
    setShowBuildingModal(null);
  };

  return (
    <div className="w-full h-full fixed top-0 left-0">
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 55 }}>
        <color attach="background" args={["#a8d0ff"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1} castShadow />

        <OrbitControls 
          ref={controlsRef}
          enablePan={false}
          rotateSpeed={0.4}
          mouseButtons={{
            LEFT: null,
            MIDDLE: MOUSE.DOLLY,
            RIGHT: MOUSE.ROTATE
          }}
        />

        <CampusModels 
          onBuildingClick={handleBuildingClick} 
          onFloorClick={handleFloorClick}
        />
        
        <Character targetPosition={playerTarget} controlsRef={controlsRef} />
        
      </Canvas>

      {/* Building Entry Modal */}
      <AnimatePresence>
        {showBuildingModal && buildingConfigs[showBuildingModal] && (
          <BuildingModal 
            config={buildingConfigs[showBuildingModal]}
            onClose={handleCloseModal}
            onEnter={() => handleEnterBuilding(showBuildingModal)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
