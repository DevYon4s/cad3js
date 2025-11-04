import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import useThree from './hooks/usethree';
import { createBox, createSphere, createCylinder } from './threelogics/primitives';
import useSelection from './hooks/useselection';
import CadToolbar from './components/cadtoolbar';
import PropertyPanel from './components/propertypanel';
import TopNav from './components/TopNav';
import './App.css';

function App() {
  const canvasRef = useRef();
  const { scene, camera } = useThree(canvasRef);
  const selected = useSelection(camera, scene, canvasRef.current);

  const handleAddShape = (shapeType) => {
    let shape;
    switch (shapeType) {
      case 'box':
        shape = createBox(1);
        break;
      case 'sphere':
        shape = createSphere(0.5);
        break;
      case 'cylinder':
        shape = createCylinder(0.5, 1);
        break;
      default:
        break;
    }
    if (shape) {
      scene.add(shape);
    }
  };

  useEffect(() => {
    if (scene) {
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);
    }
  }, [scene]);

  return (
    <div className="App">
      <div className="top-nav-container">
        <TopNav />
      </div>
      <div className="main-content">
        <CadToolbar onAddShape={handleAddShape} />
        <canvas ref={canvasRef} />
        <PropertyPanel selected={selected} />
      </div>
    </div>
  );
}

export default App;
