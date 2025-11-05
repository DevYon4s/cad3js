import { useState, useCallback } from 'react';
import * as THREE from 'three';

const useGrouping = (scene) => {
  const [groups, setGroups] = useState([]);
  const [selectedObjects, setSelectedObjects] = useState([]);

  const createGroup = useCallback((objects, name = `Group ${Date.now()}`) => {
    if (!objects || objects.length < 2) return null;

    const group = new THREE.Group();
    group.name = name;
    group.userData = {
      cadType: 'group',
      id: Date.now(),
      originalObjects: objects.map(obj => ({
        id: obj.userData.id,
        cadType: obj.userData.cadType
      }))
    };

    // Calculate center position
    const box = new THREE.Box3();
    objects.forEach(obj => {
      box.expandByObject(obj);
    });
    const center = box.getCenter(new THREE.Vector3());

    // Add objects to group and adjust positions
    objects.forEach(obj => {
      const worldPosition = new THREE.Vector3();
      obj.getWorldPosition(worldPosition);
      scene.remove(obj);
      
      // Adjust position relative to group center
      obj.position.sub(center);
      group.add(obj);
    });

    group.position.copy(center);
    scene.add(group);

    setGroups(prev => [...prev, {
      id: group.userData.id,
      name: name,
      group: group,
      objectCount: objects.length
    }]);

    return group;
  }, [scene]);

  const ungroupObjects = useCallback((group) => {
    if (!group || group.userData.cadType !== 'group') return [];

    const objects = [];
    const groupWorldPosition = new THREE.Vector3();
    group.getWorldPosition(groupWorldPosition);

    // Remove objects from group and add back to scene
    [...group.children].forEach(child => {
      if (child.isMesh) {
        const worldPosition = new THREE.Vector3();
        child.getWorldPosition(worldPosition);
        
        group.remove(child);
        child.position.copy(worldPosition);
        scene.add(child);
        objects.push(child);
      }
    });

    scene.remove(group);
    
    setGroups(prev => prev.filter(g => g.id !== group.userData.id));

    return objects;
  }, [scene]);

  const addToSelection = useCallback((object) => {
    setSelectedObjects(prev => {
      if (prev.includes(object)) return prev;
      return [...prev, object];
    });
  }, []);

  const removeFromSelection = useCallback((object) => {
    setSelectedObjects(prev => prev.filter(obj => obj !== object));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedObjects([]);
  }, []);

  const groupSelected = useCallback((name) => {
    if (selectedObjects.length < 2) return null;
    
    const group = createGroup(selectedObjects, name);
    clearSelection();
    return group;
  }, [selectedObjects, createGroup, clearSelection]);

  return {
    groups,
    selectedObjects,
    createGroup,
    ungroupObjects,
    addToSelection,
    removeFromSelection,
    clearSelection,
    groupSelected,
    canGroup: selectedObjects.length >= 2
  };
};

export default useGrouping;