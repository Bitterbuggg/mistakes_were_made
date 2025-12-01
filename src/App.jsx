import React, { useState } from 'react';
import CampusMap from './components/scenes/CampusMap/CampusMap';
import './styles/index.css';

export default function App() {
  // State kept for future scene expansions
  const [currentScene] = useState('campus');

  const handleEnterBuilding = (buildingId) => {
    console.log(`Entered ${buildingId} (No specific scene yet)`);
  };

  return (
    <div className="w-full h-screen relative bg-black">
      {currentScene === 'campus' && (
        <CampusMap onEnterBuilding={handleEnterBuilding} />
      )}
    </div>
  );
}
