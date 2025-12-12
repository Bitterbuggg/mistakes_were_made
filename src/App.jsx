import React, { useState } from 'react';
import CampusMap from './components/scenes/CampusMap/CampusMap';
import CompLabScene from './components/scenes/CompLabScene/CompLabScene';
import DormScene from './components/scenes/DormScene/DormScene';
import AcademicBuildingScene from './components/scenes/AcademicBuildingScene/AcademicBuildingScene';
import BautistaScene from './components/scenes/BautistaScene/BautistaScene';
import YellowBuildingScene from './components/scenes/YellowBuildingScene/YellowBuildingScene';
import AdminBuildingScene from './components/scenes/AdminBuildingScene/AdminBuildingScene';
import RoomExplorerScene from './components/scenes/TriangleScene/RoomExplorerScene';
import { roomConfigs } from './data/rooms';
import './styles/index.css';

export default function App() {
  const [currentScene, setCurrentScene] = useState('campus');
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0, z: 5 });

  const handleEnterBuilding = (buildingId) => {
    if (buildingId === 'computer-lab') {
      setCurrentScene('computer-lab');
    } else if (buildingId === 'techvoc') {
      setCurrentScene('techvoc');
    } else if (buildingId === 'cube010-building') {
      setCurrentScene('academic-building');
    } else if (buildingId === 'bautista') {
      setCurrentScene('bautista');
    } else if (buildingId === 'yellow-building') {
      setCurrentScene('yellow-building');
    } else if (buildingId === 'admin-building') {
      setCurrentScene('admin-building');
    } else if (buildingId.startsWith('room-')) {
      setCurrentRoomId(buildingId);
      setCurrentScene('room-explorer');
    } else {
      console.log(`${buildingId} scene not implemented yet`);
    }
  };

  const handleExitBuilding = () => {
    setCurrentScene('campus');
    setCurrentRoomId(null);
  };

  return (
    <div className="w-full h-screen relative bg-black">
      {currentScene === 'campus' && (
        <CampusMap
          onEnterBuilding={handleEnterBuilding}
          playerPosition={playerPosition}
          setPlayerPosition={setPlayerPosition}
        />
      )}

      {currentScene === 'computer-lab' && (
        <CompLabScene onExit={handleExitBuilding} />
      )}

      {currentScene === 'techvoc' && (
        <DormScene onExit={handleExitBuilding} />
      )}

      {currentScene === 'academic-building' && (
        <AcademicBuildingScene onExit={handleExitBuilding} />
      )}

      {currentScene === 'bautista' && (
        <BautistaScene onExit={handleExitBuilding} />
      )}

      {currentScene === 'yellow-building' && (
        <YellowBuildingScene onExit={handleExitBuilding} />
      )}

      {currentScene === 'admin-building' && (
        <AdminBuildingScene onExit={handleExitBuilding} />
      )}

      {currentScene === 'room-explorer' && currentRoomId && (
        <RoomExplorerScene
          roomConfig={roomConfigs[currentRoomId]}
          onExit={handleExitBuilding}
        />
      )}
    </div>
  );
}
