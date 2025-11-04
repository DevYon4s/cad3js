import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import useThree from './hooks/usethree';
import { createBox, createSphere, createCylinder } from './threelogics/primitives';
import useSelection from './hooks/useselection';
import useSketch from './hooks/usesketch';
import CadToolbar from './components/cadtoolbar';
import PropertyPanel from './components/propertypanel';
import SketchPanel from './components/SketchPanel';
import ImportExportPanel from './components/ImportExportPanel';
import DimensionOverlay from './components/DimensionOverlay';
import TopNav from './components/TopNav';
import './App.css';

function App() {
  const canvasRef = useRef();
  const { scene, camera, renderer, attachTransformControls, detachTransformControls, setTransformMode, enableCameraControls, disableCameraControls } = useThree(canvasRef);
  const transformControls = { attachTransformControls, detachTransformControls, setTransformMode };
  const selected = useSelection(camera, scene, canvasRef.current, transformControls);
  const sketch = useSketch(scene, camera, renderer);
  
  // Set camera control callbacks for sketch tool
  useEffect(() => {
    if (sketch.sketchTool) {
      sketch.sketchTool.onEnableCameraControls = enableCameraControls;
      sketch.sketchTool.onDisableCameraControls = disableCameraControls;
    }
  }, [sketch.sketchTool, enableCameraControls, disableCameraControls]);
  const [shapeCount, setShapeCount] = useState(0);
  const [lightsAdded, setLightsAdded] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(true);

  const handleAddShape = (shapeType) => {
    let shape;
    const spacing = 3;
    const row = Math.floor(shapeCount / 4);
    const col = shapeCount % 4;
    const positionX = (col - 1.5) * spacing;
    const positionZ = (row - 1) * spacing;

    switch (shapeType) {
      case 'box':
        shape = createBox(1.5);
        break;
      case 'sphere':
        shape = createSphere(0.8);
        break;
      case 'cylinder':
        shape = createCylinder(0.7, 1.8);
        break;
      default:
        break;
    }
    if (shape) {
      shape.position.set(positionX, 0, positionZ);
      scene.add(shape);
      setShapeCount(shapeCount + 1);
    }
  };

  useEffect(() => {
    if (scene && !lightsAdded) {
      // Add ground plane
      const groundGeometry = new THREE.PlaneGeometry(50, 50);
      const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        transparent: true, 
        opacity: 0.1 
      });
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -2;
      ground.receiveShadow = true;
      scene.add(ground);

      // Lighting setup
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(10, 10, 5);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      directionalLight.shadow.camera.near = 0.5;
      directionalLight.shadow.camera.far = 50;
      directionalLight.shadow.camera.left = -20;
      directionalLight.shadow.camera.right = 20;
      directionalLight.shadow.camera.top = 20;
      directionalLight.shadow.camera.bottom = -20;
      scene.add(directionalLight);

      const fillLight = new THREE.DirectionalLight(0x4488ff, 0.3);
      fillLight.position.set(-5, 3, -5);
      scene.add(fillLight);

      setLightsAdded(true);
    }
  }, [scene, lightsAdded]);

  const handleToggleSnapToGrid = () => {
    const newSnapState = sketch.toggleSnapToGrid();
    setSnapToGrid(newSnapState);
  };
  
  const handleImportComplete = (result) => {
    console.log('Import completed:', result);
    // Force re-render or update state if needed
  };

  return (
    <div className="App">
      <div className="top-nav-container">
        <TopNav />
      </div>
      <div className="main-content">
        <CadToolbar 
          onAddShape={handleAddShape}
          onEnterSketchMode={sketch.enterSketchMode}
          onExitSketchMode={sketch.exitSketchMode}
          onSwitchSketchTool={sketch.switchSketchTool}
          isSketchMode={sketch.isSketchMode}
          currentSketchTool={sketch.currentSketchTool}
        />
        <div style={{ position: 'relative', flexGrow: 1 }}>
          <canvas ref={canvasRef} />
          <DimensionOverlay 
            dimensions={sketch.currentDimensions}
            isVisible={sketch.showDimensions}
          />
        </div>
        <div className="right-panel">
          <ImportExportPanel 
            scene={scene}
            onImportComplete={handleImportComplete}
          />
          {sketch.isSketchMode && (
            <SketchPanel
              completedSketches={sketch.completedSketches}
              selectedSketch={sketch.selectedSketch}
              setSelectedSketch={sketch.setSelectedSketch}
              onExtrudeSketch={sketch.extrudeSketch}
              onClearSketches={sketch.clearAllSketches}
              onToggleSnapToGrid={handleToggleSnapToGrid}
              snapToGrid={snapToGrid}
            />
          )}
          <PropertyPanel 
            selected={selected} 
            transformControls={transformControls}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
