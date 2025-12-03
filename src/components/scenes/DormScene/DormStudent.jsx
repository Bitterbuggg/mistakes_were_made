import { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useAnimationState } from "../../../hooks/useAnimationState";

const ASSET_BASE = import.meta.env.BASE_URL || '/';

export default function DormStudent({ animation = "walking", position = [0, -0.35, 1], scale = 0.035 }) {
  const group = useRef();
  const { scene, animations } = useGLTF(`${ASSET_BASE}models/qcu_student_1.glb`);

  const { play, update } = useAnimationState(animations, scene);

  useEffect(() => {
    if (animation) play(animation);

    // Fix for dark model appearance:
    // In the absence of an Environment map, metallic materials appear very dark/black.
    // We disable metalness to ensure the model responds to the simple ambient/directional lighting.
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.metalness = 0;
          child.material.roughness = 1;
        }
      }
    });
  }, [animation, scene]);

  useFrame((_, delta) => update(delta));

  return (
    <primitive ref={group} object={scene} position={position} scale={[scale, scale, scale]} />
  );
}

useGLTF.preload(`${ASSET_BASE}models/qcu_student_1.glb`);
