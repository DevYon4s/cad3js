import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import useThree from './hooks/usethree';
import { createBox, createSphere, createCylinder } from './threelogics/primitives';
import useSelection from './hooks/useselection';
import useSketch from './hooks/usesketch';
import useUndoRedo from './hooks/useUndoRedo';
import useGrouping from './hooks/useGrouping';
import CadToolbar from './components/cadtoolbar';
import PropertyPanel from './components/propertypanel';
import SketchPanel from './components/SketchPanel';
import ImportExportPanel from './components/ImportExportPanel';
import UndoRedoPanel from './components/UndoRedoPanel';
import DimensionOverlay from './components/DimensionOverlay';
import GroupPanel from './components/GroupPanel';
import TopNav from './components/TopNav';
import './App.css';

function App() {
  const canvasRef = useRef();
  const undoRedo = useUndoRedo();
  const { scene, camera, renderer, attachTransformControls, detachTransformControls, setTransformMode, enableCameraControls, disableCameraControls } = useThree(canvasRef, undoRedo);
  const transformControls = { attachTransformControls, detachTransformControls, setTransformMode };
  const grouping = useGrouping(scene);
  const selected = useSelection(camera, scene, canvasRef.current, transformControls, grouping);
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
  const [showPropertyPanel, setShowPropertyPanel] = useState(true);

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
      
      // Save to history
      undoRedo.saveState({ 
        action: 'add_shape', 
        shapeType, 
        position: { x: positionX, y: 0, z: positionZ },
        shapeId: shape.userData.id
      }, `Add ${shapeType}`);
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
    undoRedo.saveState({ action: 'import', objectCount: result.objectCount }, 'Import scene');
  };

  const handleUndo = () => {
    const prevState = undoRedo.undo();
    if (prevState) {
      console.log('Undoing:', prevState);
      applyHistoryState(prevState.state, 'undo');
    }
  };

  const handleRedo = () => {
    const nextState = undoRedo.redo();
    if (nextState) {
      console.log('Redoing:', nextState);
      applyHistoryState(nextState.state, 'redo');
    }
  };
  
  const handleUpdateDimension = (selectedItem, newValue) => {
    if (selectedItem.type === 'face' && selectedItem.object) {
      // Scale the object to match the new face area
      const currentArea = selectedItem.data.area;
      const scaleFactor = Math.sqrt(newValue / currentArea);
      selectedItem.object.scale.multiplyScalar(scaleFactor);
    } else if (selectedItem.type === 'edge' && selectedItem.object) {
      // Scale the object to match the new edge length
      const currentLength = selectedItem.data.edge[0].distanceTo(selectedItem.data.edge[1]);
      const scaleFactor = newValue / currentLength;
      selectedItem.object.scale.multiplyScalar(scaleFactor);
    }
  };
  
  const applyHistoryState = (state, direction) => {
    if (!state) return;
    
    if (state.action === 'add_shape') {
      if (direction === 'undo') {
        // Remove the shape
        const objectToRemove = scene.children.find(child => 
          child.userData && child.userData.id === state.shapeId
        );
        if (objectToRemove) {
          scene.remove(objectToRemove);
          setShapeCount(prev => Math.max(0, prev - 1));
        }
      } else {
        // Re-add the shape
        let shape;
        switch (state.shapeType) {
          case 'box':
            shape = createBox(1.5);
            break;
          case 'sphere':
            shape = createSphere(0.8);
            break;
          case 'cylinder':
            shape = createCylinder(0.7, 1.8);
            break;
        }
        if (shape) {
          shape.position.set(state.position.x, state.position.y, state.position.z);
          shape.userData.id = state.shapeId;
          scene.add(shape);
          setShapeCount(prev => prev + 1);
        }
      }
    } else if (state.action === 'transform') {
      // Find the object and restore its transform
      const objectToTransform = scene.children.find(child => 
        child.userData && child.userData.id === state.objectId
      );
      if (objectToTransform) {
        const targetState = direction === 'undo' ? state.before : state.after;

        objectToTransform.position.copy(targetState.position);
        objectToTransform.rotation.copy(targetState.rotation);
        objectToTransform.scale.copy(targetState.scale);
        
        // Update transform controls position if this object is currently selected
        if (transformControls && transformControls.attachTransformControls) {
          const currentSelected = scene.children.find(child => 
            child.userData && child.userData.id === state.objectId
          );
          if (currentSelected && selected?.object === currentSelected) {
            transformControls.attachTransformControls(currentSelected);
          }
        }
      }
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey) {
        if (event.key === 'z' && !event.shiftKey) {
          event.preventDefault();
          handleUndo();
        } else if ((event.key === 'y') || (event.key === 'z' && event.shiftKey)) {
          event.preventDefault();
          handleRedo();
        }
      } else if (event.key === 'p' || event.key === 'P') {
        event.preventDefault();
        setShowPropertyPanel(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  return (
    <div className="App">
      <div className="top-nav-container">
        <TopNav 
          onUndo={handleUndo}
          onRedo={handleRedo}
          onClearHistory={() => {
            // Clear all CAD objects from scene
            const objectsToRemove = scene.children.filter(child => 
              child.userData && (child.userData.cadType || child.userData.id)
            );
            objectsToRemove.forEach(obj => scene.remove(obj));
            setShapeCount(0);
            undoRedo.clearHistory();
          }}
          canUndo={undoRedo.canUndo}
          canRedo={undoRedo.canRedo}
          historyLength={undoRedo.historyLength}
          currentIndex={undoRedo.currentIndex}
        />
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
        <PropertyPanel 
          selected={selected} 
          transformControls={transformControls}
          onUpdateDimension={handleUpdateDimension}
          isVisible={showPropertyPanel}
          onClose={() => setShowPropertyPanel(false)}
        />
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
              onEditSketch={sketch.startEditingSketch}
              editingSketch={sketch.editingSketch}
            />
          )}
          <GroupPanel
            groups={grouping.groups}
            selectedObjects={grouping.selectedObjects}
            onCreateGroup={grouping.createGroup}
            onUngroup={grouping.ungroup}
            onDeleteGroup={grouping.deleteGroup}
            onRenameGroup={grouping.renameGroup}
            onClearSelection={grouping.clearSelection}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
