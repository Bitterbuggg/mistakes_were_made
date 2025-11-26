import React from "react";
import { Canvas } from "@react-three/fiber";
import NewMap from "./NewMap";
import Player from "./Player";
import PlayerUI from "./PlayerUI";

export default function NewMapScene() {
  return (
    <div className="w-full h-full fixed top-0 left-0">
      <Canvas shadows camera={{ position: [0, 10, 20], fov: 55 }}>
        <color attach="background" args={["#a8d0ff"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
        <NewMap scale={0.9} position={[0, 0, 0]} />
        <Player />
        {/* <OrbitControls /> */}
      </Canvas>
      <PlayerUI />
    </div>
  );
}
