import { useEffect, useRef } from "react";
import { AnimationMixer } from "three";

export function useAnimationState(animations, scene) {
  const mixer = useRef();
  const actions = useRef({});
  const current = useRef(null);

  useEffect(() => {
    if (!scene || !animations) return;

    mixer.current = new AnimationMixer(scene);

    animations.forEach((clip) => {
      actions.current[clip.name] = mixer.current.clipAction(clip);
    });
  }, [animations, scene]);

  const play = (name, fade = 0.25) => {
    if (!actions.current[name]) return;

    if (current.current) {
      actions.current[current.current].fadeOut(fade);
    }

    actions.current[name].reset().fadeIn(fade).play();
    current.current = name;
  };

  const update = (delta) => mixer.current?.update(delta);

  return { play, update, actions: actions.current };
}
