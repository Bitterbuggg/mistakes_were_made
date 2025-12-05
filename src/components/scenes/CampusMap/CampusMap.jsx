import React, { useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { OrbitControls } from "@react-three/drei";
import { MOUSE } from "three";

import CampusModels from "../../canvas/CampusModels";
import Character from "../../canvas/Character";
import BuildingModal from "../../ui/BuildingModal";
import { buildingConfigs } from "../../../data/buildings";

export default function CampusMap({ onEnterBuilding }) {
  const [showBuildingModal, setShowBuildingModal] = useState(null);
  const [playerTarget, setPlayerTarget] = useState({ x: 0, y: 0, z: 5 });
  const [hoveredBuilding, setHoveredBuilding] = useState(null); // State for hovered building
  const controlsRef = useRef();

  const handleBuildingClick = (buildingId) => {
    setShowBuildingModal(buildingId);
  };

  const handleFloorClick = (point) => {
    setPlayerTarget(point);
  };

  const handleEnterBuilding = () => {
    if (onEnterBuilding && showBuildingModal) {
      onEnterBuilding(showBuildingModal);
    }
    setShowBuildingModal(null);
  };

  const handleCloseModal = () => {
    setShowBuildingModal(null);
  };

  // Hover handlers
  const handleBuildingHover = (buildingId) => {
    setHoveredBuilding(buildingId);
  };

  const handleBuildingHoverOut = () => {
    setHoveredBuilding(null);
  };

  return (
    <>
      <div className="w-full h-full fixed top-0 left-0">
        <Canvas
          shadows
          camera={{ position: [0, 5, 10], fov: 55 }}
          // Cap DPR to reduce GPU memory and avoid WebGL context loss on low-end devices.
          dpr={[1, 1.5]}
          gl={{ powerPreference: "high-performance" }}
        >
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
            onBuildingHover={handleBuildingHover} // Pass hover handlers
            onBuildingHoverOut={handleBuildingHoverOut} // Pass hover handlers
          />
          
          <Character targetPosition={playerTarget} controlsRef={controlsRef} />
          
        </Canvas>
      </div>

      {/* Building Name Hover Overlay (Bottom Center) */}
      <AnimatePresence>
        {hoveredBuilding && buildingConfigs[hoveredBuilding] && (
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 pointer-events-none z-40"
          >
            <div 
              style={{ 
                backgroundColor: '#ffffff',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                padding: '16px 40px',
                borderRadius: '45px',
                border: '1px solid #e2e8f0'
              }}
            >
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px', color: '#0f172a', margin: 0 }}>
                <span style={{ fontSize: '24px' }}>{buildingConfigs[hoveredBuilding].icon}</span>
                {buildingConfigs[hoveredBuilding].name}
              </h3>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Building Entry Modal */}
      <AnimatePresence>
        {showBuildingModal && buildingConfigs[showBuildingModal] && (
          <BuildingModal 
            config={buildingConfigs[showBuildingModal]}
            onClose={handleCloseModal}
            onEnter={handleEnterBuilding}
          />
        )}
      </AnimatePresence>
    </>
  );
}
