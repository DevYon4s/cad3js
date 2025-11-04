Context: The development environment is a standard React/Vite setup with Three.js already installed. The core task is to implement all four requirements into the existing file structure using plain Three.js.

Constraint: DO NOT use @react-three/fiber or @react-three/drei. Direct usage of THREE objects and managing the rendering loop via requestAnimationFrame within React hooks (useRef, useEffect) is mandatory.


3.Selection and Transformation
File: src/hooks/useThree.js (TransformControls Integration) File: src/components/PropertyPanel.jsx (UI)

Transform Controls: The TransformControls instance must be initialized in useThree.js. When the useSelection.js hook detects a full Shape Selection, the TransformControls must be attached to the selected THREE.Mesh object. Detach the controls when selection is cleared.

Property Panel: In PropertyPanel.jsx, display the properties of the currently selected entity, updating in real-time.

Shape: mesh.position, mesh.rotation.y (or Euler), mesh.scale.

Face: Calculate and display the Area and Normal Vector of the selected face.

Edge: Calculate and display the Length of the selected edge.


The general instruction is 

Enable selection of edges, faces, and full shapes. - Implement transformations (move, rotate,
scale) via controls or keyboard shortcuts. - Show entity-specific properties: - Shape: position,
rotation, scale - Face: area or normal - Edge: length - Apply visible highlighting on selected entities.