import { useRef, useEffect, useState } from 'react';
import SketchTool from '../threelogics/sketchtool';

const useSketch = (scene, camera, renderer) => {
  const sketchToolRef = useRef(null);
  const [isSketchMode, setIsSketchMode] = useState(false);
  const [currentSketchTool, setCurrentSketchTool] = useState('rectangle');
  const [completedSketches, setCompletedSketches] = useState([]);
  const [selectedSketch, setSelectedSketch] = useState(null);

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
      sketchToolRef.current.activate(tool);
    }
  };

  const exitSketchMode = () => {
    if (sketchToolRef.current) {
      setIsSketchMode(false);
      sketchToolRef.current.deactivate();
      updateCompletedSketches();
    }
  };

  const switchSketchTool = (tool) => {
    if (sketchToolRef.current && isSketchMode) {
      setCurrentSketchTool(tool);
      sketchToolRef.current.deactivate();
      sketchToolRef.current.activate(tool);
    }
  };

  const updateCompletedSketches = () => {
    if (sketchToolRef.current) {
      setCompletedSketches(sketchToolRef.current.getCompletedSketches());
    }
  };

  const extrudeSketch = (sketchMesh, height) => {
    if (sketchToolRef.current && sketchMesh) {
      const extrudedMesh = sketchToolRef.current.extrudeSketch(sketchMesh, height);
      if (extrudedMesh) {
        scene.add(extrudedMesh);
        // Remove the original sketch from scene
        scene.remove(sketchMesh);
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
    }
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
    sketchTool: sketchToolRef.current
  };
};

export default useSketch;