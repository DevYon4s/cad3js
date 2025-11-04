
import * as THREE from 'three';

let nextId = 0;

const createBox = (size = 1) => {
  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = new THREE.MeshStandardMaterial({ 
    color: 0x8e9aaf,
    metalness: 0.1,
    roughness: 0.3,
    transparent: false
  });
  const box = new THREE.Mesh(geometry, material);
  box.userData = { 
    cadType: 'box', 
    id: nextId++, 
    originalColor: 0x8e9aaf,
    size: size
  };
  box.castShadow = true;
  box.receiveShadow = true;
  return box;
};

const createSphere = (radius = 0.5) => {
  const geometry = new THREE.SphereGeometry(radius, 32, 16);
  const material = new THREE.MeshStandardMaterial({ 
    color: 0xcbc0d3,
    metalness: 0.1,
    roughness: 0.3,
    transparent: false
  });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.userData = { 
    cadType: 'sphere', 
    id: nextId++, 
    originalColor: 0xcbc0d3,
    radius: radius
  };
  sphere.castShadow = true;
  sphere.receiveShadow = true;
  return sphere;
};

const createCylinder = (radius = 0.5, height = 1) => {
  const geometry = new THREE.CylinderGeometry(radius, radius, height, 32);
  const material = new THREE.MeshStandardMaterial({ 
    color: 0xefd3d7,
    metalness: 0.1,
    roughness: 0.3,
    transparent: false
  });
  const cylinder = new THREE.Mesh(geometry, material);
  cylinder.userData = { 
    cadType: 'cylinder', 
    id: nextId++, 
    originalColor: 0xefd3d7,
    radius: radius,
    height: height
  };
  cylinder.castShadow = true;
  cylinder.receiveShadow = true;
  return cylinder;
};

export { createBox, createSphere, createCylinder };
