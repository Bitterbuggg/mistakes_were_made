import React, { useState } from 'react';
import CampusMap from './components/scenes/CampusMap/CampusMap';
import TechVocScene from './components/scenes/TechVocScene/TechVocScene';
import './styles/index.css';

export default function App() {
  const [currentScene, setCurrentScene] = useState('campus');

  const handleEnterBuilding = (buildingId) => {
    console.log(`Entering ${buildingId}`);
    if (buildingId === 'techvoc') {
      setCurrentScene('techvoc');
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
      {currentScene === 'techvoc' && (
        <TechVocScene onExit={handleExitBuilding} />
      )}
    </div>
  );
}
