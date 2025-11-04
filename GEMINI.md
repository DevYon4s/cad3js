Context: The development environment is a standard React/Vite setup with Three.js already installed. The core task is to implement all four requirements into the existing file structure using plain Three.js.

Constraint: DO NOT use @react-three/fiber or @react-three/drei. Direct usage of THREE objects and managing the rendering loop via requestAnimationFrame within React hooks (useRef, useEffect) is mandatory.

1. Primitive Shape Creation & Selection
Target Files: src/hooks/useThree.js, src/three-logic/Primitives.js, src/hooks/useSelection.js

useThree.js (Core Loop): Implement the function to initialize and return the THREE.Scene, THREE.PerspectiveCamera, and the THREE.WebGLRenderer.domElement. Implement the main requestAnimationFrame render loop.

Primitives.js (Factory): Implement factory functions (createBox(size), createSphere(radius), createCylinder(radius, height)) that return a fully configured THREE.Mesh object. Each mesh must have a persistent, unique ID and metadata (e.g., mesh.userData.cadType = 'box').

useSelection.js (Raycasting): Implement advanced raycasting to detect and identify:

Shape Selection: Standard raycast against the mesh.

Face Selection: Use the raycast intersection to determine the hit face (intersection.faceIndex for Geometry or appropriate data for BufferGeometry). Visually highlight the selected face with a temporary, distinct, transparent mesh overlay.

Edge Selection: Calculate which edge is closest to the intersection point. Visually highlight the selected edge using an overlaid THREE.LineSegments object (e.g., a THREE.WireframeGeometry for simplification).

Expose a state hook for the currently selected entity ({ type: 'face'|'edge'|'shape', object: THREE.Object3D, data: {} }).