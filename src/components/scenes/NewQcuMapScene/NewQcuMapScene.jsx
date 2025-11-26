import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { motion as Motion, AnimatePresence } from "framer-motion";
import QcuMapModels from "./QcuMapModels";

export default function NewQcuMapScene() {
  const [campusEntered, setCampusEntered] = useState(false);
  const [showBuildingModal, setShowBuildingModal] = useState(null);

  // Building configurations
  const buildingConfigs = {
    "techvoc": {
      name: "TechVoc Building",
      icon: "🔧",
      description: "Technical and vocational training center.",
      canEnter: true
    },
    "yellow-building": {
      name: "Yellow Building",
      icon: "🏫",
      description: "Classroom and lecture halls.",
      canEnter: true
    },
    "admin-building": {
      name: "Admin Building",
      icon: "🏢",
      description: "Administration and faculty offices.",
      canEnter: true
    },
    "bautista": {
      name: "Bautista Hall",
      icon: "📚",
      description: "Academic building for various departments.",
      canEnter: true
    },
    "computer-lab": {
      name: "Computer Lab",
      icon: "💻",
      description: "Computer science lab with modern equipment.",
      canEnter: true
    },
    "cube010-building": {
      name: "Main Hall",
      icon: "🏛️",
      description: "Large multipurpose building.",
      canEnter: true
    }
  };

  const handleBuildingClick = (buildingId) => {
    setShowBuildingModal(buildingId);
  };

  const handleEnterBuilding = (buildingId) => {
    setShowBuildingModal(null);
    console.log(`Entering building: ${buildingId}`);
    // Add navigation logic here when scenes are ready
  };

  const handleEnterCampus = () => {
    setCampusEntered(true);
  };

  return (
    <div className="w-full h-full fixed top-0 left-0">
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 55 }}>
        <color attach="background" args={["#a8d0ff"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1} castShadow />

        <QcuMapModels 
          onBuildingClick={handleBuildingClick} 
          campusEntered={campusEntered} 
        />
        
        <OrbitControls 
          enableZoom={true} 
          enableRotate={true} 
          enablePan={true}
        />
      </Canvas>

      {/* Enter Campus Button */}
      {!campusEntered && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <Motion.button
            onClick={handleEnterCampus}
            className="px-8 py-4 bg-blue-500 text-white font-bold text-xl rounded-full hover:bg-blue-600 transition shadow-2xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Enter Campus
          </Motion.button>
        </div>
      )}

      {/* Building Entry Modal */}
      <AnimatePresence>
        {showBuildingModal && buildingConfigs[showBuildingModal] && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-auto"
            onClick={() => setShowBuildingModal(null)}
          >
            <Motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-6xl mb-4">{buildingConfigs[showBuildingModal].icon}</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                {buildingConfigs[showBuildingModal].name}
              </h2>
              <p className="text-gray-600 mb-6">
                {buildingConfigs[showBuildingModal].description}
              </p>
              <div className="space-y-3">
                {buildingConfigs[showBuildingModal].canEnter ? (
                  <Motion.button
                    onClick={() => handleEnterBuilding(showBuildingModal)}
                    className="w-full px-6 py-3 bg-blue-500 text-white font-bold rounded-full hover:bg-blue-600 transition shadow-lg"
                    whileTap={{ scale: 0.95 }}
                  >
                    Enter {buildingConfigs[showBuildingModal].name}
                  </Motion.button>
                ) : (
                  <div className="w-full px-6 py-3 bg-gray-300 text-gray-500 font-bold rounded-full cursor-not-allowed">
                    Locked
                  </div>
                )}
                <Motion.button
                  onClick={() => setShowBuildingModal(null)}
                  className="w-full px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-full hover:bg-gray-300 transition"
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </Motion.button>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
