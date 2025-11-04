Context: The development environment is a standard React/Vite setup with Three.js already installed. The core task is to implement all four requirements into the existing file structure using plain Three.js.

Constraint: DO NOT use @react-three/fiber or @react-three/drei. Direct usage of THREE objects and managing the rendering loop via requestAnimationFrame within React hooks (useRef, useEffect) is mandatory.


Import and Export
File: src/api/scene-serializer.js

Export: Implement an exportSceneToJson(scene) function that takes the THREE.Scene object and returns a JSON string. Use the built-in scene.toJSON() method. The function must filter out utility meshes (like the GridHelper and selection highlights) from the final output.

Import: Implement an importSceneFromJson(jsonString, scene) function.

Use new THREE.ObjectLoader().parse(JSON.parse(jsonString)) to load the scene/objects.

Clear the existing scene objects.

Iterate over the loaded objects and add them to the active Three.js scene instance.

Crucially: Ensure that the imported meshes retain the mesh.userData properties and are fully selectable and transformable, behaving identically to meshes created in the app.


Support exporting the entire scene into JSON with all geometry, transforms, and metadata. -
Import from JSON and fully restore the scene (geometry, transforms, selection). - Ensure imported
objects behave identically to newly created ones.

