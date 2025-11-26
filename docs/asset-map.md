# QCULand Asset Map (Current Build)

This document lists every GLB asset currently loaded in the running scene, where the file lives, how it is positioned in the world, and any runtime handling.

## Loading Flow
- Scene: `src/components/scenes/NewQcuMapScene/NewQcuMapScene.jsx` renders a `<Canvas>` with `OrbitControls`. Interactions stay disabled until the **Enter Campus** button sets `campusEntered` to `true`.
- Static environment: `src/components/scenes/NewQcuMapScene/QcuMapModels.jsx` loads `public/models/qcu_base.glb` at the origin with default rotation/scale.
- Interactive buildings: `QcuMapModels` instantiates `<InteractiveBuilding>` for each GLB. The component (`InteractiveBuilding.jsx`) clones meshes/materials per instance, adds hover emissive highlight, and only forwards pointer/click handlers when `isInteractable` (after entering the campus).
- Preloading: All referenced GLBs are preloaded via `useGLTF.preload` to avoid hitches when the user enters the campus.

## Asset Positions (rendered in the current build)
World units are the Three.js units used in `@react-three/fiber`. Rotations are in radians (XYZ order). All files live under `public/models`.

- Base map `qcu_base.glb`
  - Building id: n/a
  - Display name: Static base map
  - Position: `[0, 0, 0]`
  - Rotation: `[0, 0, 0]`
  - Scale: `1`
  - Notes: Ground/terrain and non-interactive elements.

- TechVoc Building `qcu_bldg6.glb`
  - Building id: `techvoc`
  - Display name: TechVoc Building
  - Position: `[0.0, 0.02, 2.2]`
  - Rotation: `[0, 0, 0]`
  - Scale: `1`
  - Notes: Slight Y offset to sit above the base.

- Yellow Building `qcu_bldg5.glb`
  - Building id: `yellow-building`
  - Display name: Yellow Building
  - Position: `[1, 0.02, -2]`
  - Rotation: `[-pi, 0, -pi]`
  - Scale: `1`
  - Notes: Counter-rotates the baked model orientation.

- Admin Building `qcu_bldg4.glb`
  - Building id: `admin-building`
  - Display name: Admin Building
  - Position: `[-1.259, 0.02, -4.72]`
  - Rotation: `[0, 0, 0]`
  - Scale: `1`
  - Notes: Positioned along the negative Z corridor.

- Bautista Hall `qcu_bldg2.glb`
  - Building id: `bautista`
  - Display name: Bautista Hall
  - Position: `[-1.2, 0.02, -7.5]`
  - Rotation: `[0, -1.571, 0]`
  - Scale: `1`
  - Notes: Counter-rotates to face the campus center.

- Computer Lab `qcu_bldg1.glb`
  - Building id: `computer-lab`
  - Display name: Computer Lab
  - Position: `[3, 0.02, -4.6]`
  - Rotation: `[0, -1.571, 0]`
  - Scale: `0.518`
  - Notes: Scaled down to fit the intended footprint.

- Main Hall `qcu_bldg3.glb`
  - Building id: `cube010-building`
  - Display name: Main Hall
  - Position: `[3, 0.02, -7.3]`
  - Rotation: `[0, -1.571, 0]`
  - Scale: `0.602`
  - Notes: Scaled and rotated to align with adjacent buildings.

### Interaction behavior per building
- Hover highlight: emissive color shifts to `0x4488ff` while hovered (after entering the campus). Original emissive values are restored on pointer out.
- Click: opens the building modal defined in `NewQcuMapScene.jsx` (name, icon placeholder, description, `canEnter` flag). Scene transitions are TODO (`handleEnterBuilding` currently logs to console).

## Other bundled assets
- `public/models/qcu_student_1.glb`: Character model, currently unused in the main scene but available (used only in archived prototype code).
