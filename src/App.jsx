import React, { useState } from 'react';
import CampusMap from './components/scenes/CampusMap/CampusMap';
import CompLabScene from './components/scenes/CompLabScene/CompLabScene';
import './styles/index.css';

export default function App() {
  const [currentScene, setCurrentScene] = useState('campus');

  const handleEnterBuilding = (buildingId) => {
    if (buildingId === 'computer-lab') {
      setCurrentScene('computer-lab');
    } else {
      console.log(`${buildingId} scene not implemented yet`);
    }
  };

  const handleExitBuilding = () => {
    setCurrentScene('campus');
  };

  return (
    <div className="w-full h-screen relative bg-black">
      {currentScene === 'campus' && (
        <CampusMap onEnterBuilding={handleEnterBuilding} />
      )}

      {currentScene === 'computer-lab' && (
        <CompLabScene onExit={handleExitBuilding} />
      )}
    </div>
  );
}
