import * as THREE from 'three';

// Export scene to JSON
export const exportSceneToJson = (scene) => {
  try {
    // Create a temporary scene to filter out utility objects
    const tempScene = new THREE.Scene();
    
    // Filter and add only CAD objects (not grid, lights, controls, etc.)
    scene.children.forEach(child => {
      if (child.userData && (
        child.userData.cadType === 'box' ||
        child.userData.cadType === 'sphere' ||
        child.userData.cadType === 'cylinder' ||
        child.userData.cadType === 'extruded' ||
        child.userData.cadType === 'sketch'
      )) {
        // Clone the object to avoid modifying the original
        const clonedChild = child.clone();
        tempScene.add(clonedChild);
      }
    });
    
    // Convert to JSON
    const sceneJson = tempScene.toJSON();
    
    // Add metadata
    const exportData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      cadObjects: sceneJson,
      objectCount: tempScene.children.length
    };
    
    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error('Export failed:', error);
    throw new Error('Failed to export scene: ' + error.message);
  }
};

// Import scene from JSON
export const importSceneFromJson = (jsonString, scene) => {
  try {
    const importData = JSON.parse(jsonString);
    
    // Validate import data
    if (!importData.cadObjects) {
      throw new Error('Invalid scene file format');
    }
    
    // Clear existing CAD objects from scene (keep lights, grid, etc.)
    const objectsToRemove = [];
    scene.children.forEach(child => {
      if (child.userData && (
        child.userData.cadType === 'box' ||
        child.userData.cadType === 'sphere' ||
        child.userData.cadType === 'cylinder' ||
        child.userData.cadType === 'extruded' ||
        child.userData.cadType === 'sketch'
      )) {
        objectsToRemove.push(child);
      }
    });
    
    objectsToRemove.forEach(obj => {
      scene.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(mat => mat.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });
    
    // Load objects from JSON
    const loader = new THREE.ObjectLoader();
    const loadedScene = loader.parse(importData.cadObjects);
    
    // Add loaded objects to the active scene
    loadedScene.children.forEach(child => {
      // Ensure the object has proper properties for selection and transformation
      if (child.isMesh) {
        // Restore shadow properties
        child.castShadow = true;
        child.receiveShadow = true;
        
        // Ensure userData is preserved
        if (!child.userData) {
          child.userData = {};
        }
        
        // Add to scene
        scene.add(child);
      }
    });
    
    return {
      success: true,
      objectCount: loadedScene.children.length,
      timestamp: importData.timestamp
    };
    
  } catch (error) {
    console.error('Import failed:', error);
    throw new Error('Failed to import scene: ' + error.message);
  }
};

// Utility function to download JSON file
export const downloadSceneJson = (scene, filename = 'cad-scene.json') => {
  try {
    const jsonString = exportSceneToJson(scene);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Download failed:', error);
    return false;
  }
};

// Utility function to upload and import JSON file
export const uploadSceneJson = (scene) => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (!file) {
        reject(new Error('No file selected'));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const result = importSceneFromJson(e.target.result, scene);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  });
};