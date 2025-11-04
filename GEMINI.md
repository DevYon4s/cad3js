Context: The development environment is a standard React/Vite setup with Three.js already installed. The core task is to implement all four requirements into the existing file structure using plain Three.js.

Constraint: DO NOT use @react-three/fiber or @react-three/drei. Direct usage of THREE objects and managing the rendering loop via requestAnimationFrame within React hooks (useRef, useEffect) is mandatory.


2.2D Sketching and Extrusion
File: src/three-logic/SketchTool.js File: src/components/CADToolbar.jsx (UI)

Sketch Mode: Create a Sketch Mode handler. When active, display a XZ-plane grid (using THREE.GridHelper) and disable OrbitControls.

Drawing: Implement Rectangle and Circle drawing tools using a simple state machine (e.g., waiting for first click, drawing, finished).

Rectangle: Capture two clicks to define the boundary.

Circle: Capture the center click and a second click to define the radius.

Snap-to-Grid: Implement a utility to snap the mouse pointer coordinates to the nearest grid point (e.g., 0.5 or 1 unit increments) before use.

Extrusion: Upon completing a sketch, use a UI input to define the extrusion height. Use THREE.ShapeGeometry (for the 2D path) and then THREE.ExtrudeGeometry to create the final 3D shape. Add the extruded mesh to the scene.