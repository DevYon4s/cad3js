import { useRef, useEffect, useState } from 'react';
import SketchTool from '../threelogics/sketchtool';

const useSketch = (scene, camera, renderer) => {
  const sketchToolRef = useRef(null);
  const [isSketchMode, setIsSketchMode] = useState(false);
  const [currentSketchTool, setCurrentSketchTool] = useState('rectangle');
  const [completedSketches, setCompletedSketches] = useState([]);
  const [selectedSketch, setSelectedSketch] = useState(null);
  const [editingSketch, setEditingSketch] = useState(null);
  const [currentDimensions, setCurrentDimensions] = useState(null);
  const [showDimensions, setShowDimensions] = useState(false);

  useEffect(() => {
    if (scene && camera && renderer && renderer.domElement) {
      sketchToolRef.current = new SketchTool(scene, camera, renderer);
    }

    return () => {
      if (sketchToolRef.current) {
        sketchToolRef.current.dispose();
      }
    };
  }, [scene, camera, renderer]);

  const enterSketchMode = (tool = 'rectangle') => {
    if (sketchToolRef.current) {
      setIsSketchMode(true);
      setCurrentSketchTool(tool);
      sketchToolRef.current.onDimensionUpdate = (dimensions) => {
        setCurrentDimensions(dimensions);
        setShowDimensions(true);
      };
      sketchToolRef.current.onDimensionHide = () => {
        setShowDimensions(false);
      };
      sketchToolRef.current.activate(tool);
    }
  };

  const exitSketchMode = () => {
    if (sketchToolRef.current) {
      setIsSketchMode(false);
      sketchToolRef.current.deactivate();
      setShowDimensions(false);
      updateCompletedSketches();
    }
  };
  
  // Update sketches when sketch tool changes
  useEffect(() => {
    if (sketchToolRef.current) {
      const interval = setInterval(() => {
        updateCompletedSketches();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [sketchToolRef.current]);

  const switchSketchTool = (tool) => {
    if (sketchToolRef.current && isSketchMode) {
      setCurrentSketchTool(tool);
      sketchToolRef.current.deactivate();
      sketchToolRef.current.activate(tool);
    }
  };

  const updateCompletedSketches = () => {
    if (sketchToolRef.current) {
      const sketches = sketchToolRef.current.getCompletedSketches();
      console.log('Updating sketches:', sketches.length);
      setCompletedSketches(sketches);
    }
  };

  const extrudeSketch = (sketchMesh, height) => {
    if (sketchToolRef.current && sketchMesh) {
      const extrudedMesh = sketchToolRef.current.extrudeSketch(sketchMesh, height);
      if (extrudedMesh) {
        scene.add(extrudedMesh);
        // Remove the original sketch from scene and sketch group
        scene.remove(sketchMesh);
        sketchToolRef.current.sketchGroup.remove(sketchMesh);
        // Remove from completed sketches array
        const sketchIndex = sketchToolRef.current.completedSketches.findIndex(
          sketch => sketch.mesh.userData.id === sketchMesh.userData.id
        );
        if (sketchIndex !== -1) {
          sketchToolRef.current.completedSketches.splice(sketchIndex, 1);
        }
        updateCompletedSketches();
        return extrudedMesh;
      }
    }
    return null;
  };

  const clearAllSketches = () => {
    if (sketchToolRef.current) {
      sketchToolRef.current.clearAllSketches();
      setCompletedSketches([]);
      setSelectedSketch(null);
      setEditingSketch(null);
    }
  };
  
  const startEditingSketch = (sketchId) => {
    const sketch = completedSketches.find(s => s.id === sketchId);
    if (sketch && sketchToolRef.current) {
      setEditingSketch(sketch);
      sketchToolRef.current.startEditing(sketch);
    }
  };
  
  const finishEditingSketch = () => {
    if (editingSketch && sketchToolRef.current) {
      const updatedSketch = sketchToolRef.current.finishEditing();
      if (updatedSketch) {
        setCompletedSketches(prev => 
          prev.map(s => s.id === editingSketch.id ? updatedSketch : s)
        );
      }
      setEditingSketch(null);
    }
  };
  
  const cancelEditingSketch = () => {
    if (editingSketch && sketchToolRef.current) {
      sketchToolRef.current.cancelEditing();
    }
    setEditingSketch(null);
  };

  const toggleSnapToGrid = () => {
    if (sketchToolRef.current) {
      sketchToolRef.current.snapToGrid = !sketchToolRef.current.snapToGrid;
      return sketchToolRef.current.snapToGrid;
    }
    return false;
  };

  return {
    isSketchMode,
    currentSketchTool,
    completedSketches,
    selectedSketch,
    setSelectedSketch,
    enterSketchMode,
    exitSketchMode,
    switchSketchTool,
    extrudeSketch,
    clearAllSketches,
    toggleSnapToGrid,
    currentDimensions,
    showDimensions,
    sketchTool: sketchToolRef.current,
    editingSketch,
    startEditingSketch,
    finishEditingSketch,
    cancelEditingSketch
  };
};

export default useSketch;