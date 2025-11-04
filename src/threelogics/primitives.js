
import * as THREE from 'three';

let nextId = 0;

const createBox = (size) => {
  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const box = new THREE.Mesh(geometry, material);
  box.userData = { cadType: 'box', id: nextId++ };
  return box;
};

const createSphere = (radius) => {
  const geometry = new THREE.SphereGeometry(radius, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.userData = { cadType: 'sphere', id: nextId++ };
  return sphere;
};

const createCylinder = (radius, height) => {
  const geometry = new THREE.CylinderGeometry(radius, radius, height, 32);
  const material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
  const cylinder = new THREE.Mesh(geometry, material);
  cylinder.userData = { cadType: 'cylinder', id: nextId++ };
  return cylinder;
};

export { createBox, createSphere, createCylinder };
