
import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

const useSelection = (camera, scene, canvas) => {
  const [selected, setSelected] = useState(null);
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const highlightMesh = useRef(null);

  useEffect(() => {
    if (!canvas) return;

    const onMouseMove = (event) => {
      // Calculate mouse position in normalized device coordinates
      // (-1 to +1) for both components
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const onClick = (event) => {
      raycaster.current.setFromCamera(mouse.current, camera);
      const intersects = raycaster.current.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const { object, point, face } = intersects[0];

        if (face) {
          if (highlightMesh.current) {
            scene.remove(highlightMesh.current);
            highlightMesh.current.geometry.dispose();
            highlightMesh.current.material.dispose();
            highlightMesh.current = null;
          }

          const worldTransform = object.matrixWorld;

          // Edge Selection
          if (event.shiftKey) { // Use shift key to toggle edge selection
            const geometry = object.geometry;
            const vertices = geometry.attributes.position;
            const a = new THREE.Vector3().fromBufferAttribute(vertices, face.a).applyMatrix4(worldTransform);
            const b = new THREE.Vector3().fromBufferAttribute(vertices, face.b).applyMatrix4(worldTransform);
            const c = new THREE.Vector3().fromBufferAttribute(vertices, face.c).applyMatrix4(worldTransform);

            const lines = [[a, b], [b, c], [c, a]];
            let closestLine = null;
            let minDistance = Infinity;

            for (const line of lines) {
              const line3 = new THREE.Line3(line[0], line[1]);
              const closestPoint = new THREE.Vector3();
              line3.closestPointToPoint(point, true, closestPoint);
              const distance = point.distanceTo(closestPoint);

              if (distance < minDistance) {
                minDistance = distance;
                closestLine = line;
              }
            }

            const edgeGeometry = new THREE.BufferGeometry().setFromPoints(closestLine);
            const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 4 });
            highlightMesh.current = new THREE.LineSegments(edgeGeometry, edgeMaterial);
            scene.add(highlightMesh.current);

            setSelected({ type: 'edge', object, data: { faceIndex: face.index } });

          } else { // Face Selection
            const geometry = object.geometry;
            const vertices = geometry.attributes.position;
            const a = new THREE.Vector3().fromBufferAttribute(vertices, face.a);
            const b = new THREE.Vector3().fromBufferAttribute(vertices, face.b);
            const c = new THREE.Vector3().fromBufferAttribute(vertices, face.c);

            const faceGeometry = new THREE.BufferGeometry();
            faceGeometry.setAttribute('position', new THREE.Float32BufferAttribute([a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z], 3));

            const highlightMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
            highlightMesh.current = new THREE.Mesh(faceGeometry, highlightMaterial);
            highlightMesh.current.matrix.copy(object.matrixWorld);
            highlightMesh.current.matrixAutoUpdate = false;
            scene.add(highlightMesh.current);

            setSelected({ type: 'face', object, data: { faceIndex: face.index } });
          }
        }


      } else {
        if (highlightMesh.current) {
          scene.remove(highlightMesh.current);
          highlightMesh.current.geometry.dispose();
          highlightMesh.current.material.dispose();
          highlightMesh.current = null;
        }
        setSelected(null);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
    };
  }, [camera, scene, canvas]);

  return selected;
};

export default useSelection;
