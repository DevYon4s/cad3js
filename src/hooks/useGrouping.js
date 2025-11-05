import { useState, useCallback } from 'react';
import * as THREE from 'three';

const useGrouping = (scene) => {
  const [groups, setGroups] = useState([]);
  const [selectedObjects, setSelectedObjects] = useState([]);

  const addToSelection = useCallback((object) => {
    setSelectedObjects(prev => {
      if (prev.find(obj => obj.uuid === object.uuid)) {
        return prev;
      }
      return [...prev, object];
    });
  }, []);

  const removeFromSelection = useCallback((object) => {
    setSelectedObjects(prev => prev.filter(obj => obj.uuid !== object.uuid));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedObjects([]);
  }, []);

  const createGroup = useCallback((name = `Group ${groups.length + 1}`) => {
    if (selectedObjects.length < 2) return null;

    const group = new THREE.Group();
    group.userData = {
      cadType: 'group',
      id: Date.now(),
      name: name,
      originalPositions: []
    };

    // Store original positions and add objects to group
    selectedObjects.forEach(obj => {
      group.userData.originalPositions.push({
        uuid: obj.uuid,
        position: obj.position.clone(),
        rotation: obj.rotation.clone(),
        scale: obj.scale.clone()
      });
      
      // Remove from scene and add to group
      if (obj.parent) {
        obj.parent.remove(obj);
      }
      group.add(obj);
    });

    scene.add(group);
    
    const newGroup = {
      id: group.userData.id,
      name: name,
      group: group,
      objects: [...selectedObjects]
    };

    setGroups(prev => [...prev, newGroup]);
    clearSelection();
    
    return newGroup;
  }, [selectedObjects, groups.length, scene, clearSelection]);

  const ungroup = useCallback((groupId) => {
    setGroups(prev => {
      const groupData = prev.find(g => g.id === groupId);
      if (!groupData) return prev;

      const group = groupData.group;
      
      // Move objects back to scene and restore original materials
      const objectsToMove = [...group.children];
      objectsToMove.forEach(obj => {
        if (group.remove) {
          group.remove(obj);
        } else {
          group.children = group.children.filter(child => child !== obj);
        }
        scene.add(obj);
        
        // Restore original material if it was modified
        if (obj.userData.originalColor) {
          if (obj.material.color) {
            obj.material.color.setHex(obj.userData.originalColor);
          }
        }
      });

      // Remove group from scene
      scene.remove(group);
      
      // Remove from groups list
      return prev.filter(g => g.id !== groupId);
    });
  }, [scene]);

  const deleteGroup = useCallback((groupId) => {
    setGroups(prev => {
      const groupData = prev.find(g => g.id === groupId);
      if (!groupData) return prev;

      const group = groupData.group;
      
      // Remove all objects in the group
      const objectsToRemove = [...group.children];
      objectsToRemove.forEach(obj => {
        if (group.remove) {
          group.remove(obj);
        } else {
          group.children = group.children.filter(child => child !== obj);
        }
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(mat => mat.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });

      // Remove group from scene
      scene.remove(group);
      
      // Remove from groups list
      return prev.filter(g => g.id !== groupId);
    });
  }, [scene]);

  const renameGroup = useCallback((groupId, newName) => {
    setGroups(prev => prev.map(g => 
      g.id === groupId 
        ? { ...g, name: newName, group: { ...g.group, userData: { ...g.group.userData, name: newName } } }
        : g
    ));
  }, []);

  return {
    groups,
    selectedObjects,
    addToSelection,
    removeFromSelection,
    clearSelection,
    createGroup,
    ungroup,
    deleteGroup,
    renameGroup
  };
};

export default useGrouping;