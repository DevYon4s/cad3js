
import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

const useSelection = (camera, scene, canvas, transformControls) => {
  const [selected, setSelected] = useState(null);
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const highlightMesh = useRef(null);
  const originalMaterial = useRef(null);

  const clearHighlight = () => {
    if (highlightMesh.current) {
      scene.remove(highlightMesh.current);
      highlightMesh.current.geometry.dispose();
      highlightMesh.current.material.dispose();
      highlightMesh.current = null;
    }
    if (originalMaterial.current && selected?.object) {
      selected.object.material = originalMaterial.current;
      originalMaterial.current = null;
    }
  };

  useEffect(() => {
    if (!canvas) return;

    const onMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onClick = (event) => {
      raycaster.current.setFromCamera(mouse.current, camera);
      const intersects = raycaster.current.intersectObjects(
        scene.children.filter(child => 
          child.userData.cadType === 'box' || 
          child.userData.cadType === 'sphere' || 
          child.userData.cadType === 'cylinder' ||
          child.userData.cadType === 'extruded'
        ), 
        false
      );

      clearHighlight();

      if (intersects.length > 0) {
        const { object, point, face } = intersects[0];

        if (event.ctrlKey || event.metaKey) {
          // Edge Selection (Ctrl/Cmd + Click)
          if (face) {
            const geometry = object.geometry;
            const vertices = geometry.attributes.position;
            const a = new THREE.Vector3().fromBufferAttribute(vertices, face.a);
            const b = new THREE.Vector3().fromBufferAttribute(vertices, face.b);
            const c = new THREE.Vector3().fromBufferAttribute(vertices, face.c);

            // Transform to world coordinates
            a.applyMatrix4(object.matrixWorld);
            b.applyMatrix4(object.matrixWorld);
            c.applyMatrix4(object.matrixWorld);

            const edges = [[a, b], [b, c], [c, a]];
            let closestEdge = null;
            let minDistance = Infinity;

            for (const edge of edges) {
              const line = new THREE.Line3(edge[0], edge[1]);
              const closestPoint = new THREE.Vector3();
              line.closestPointToPoint(point, true, closestPoint);
              const distance = point.distanceTo(closestPoint);

              if (distance < minDistance) {
                minDistance = distance;
                closestEdge = edge;
              }
            }

            if (closestEdge) {
              const edgeGeometry = new THREE.BufferGeometry().setFromPoints(closestEdge);
              const edgeMaterial = new THREE.LineBasicMaterial({ 
                color: 0xff4444, 
                linewidth: 3,
                transparent: true,
                opacity: 0.8
              });
              highlightMesh.current = new THREE.Line(edgeGeometry, edgeMaterial);
              scene.add(highlightMesh.current);

              setSelected({ 
                type: 'edge', 
                object, 
                data: { 
                  faceIndex: face.a, 
                  edge: closestEdge,
                  cadType: object.userData.cadType,
                  id: object.userData.id
                } 
              });
            }
          }
        } else if (event.shiftKey) {
          // Face Selection (Shift + Click)
          if (face) {
            const geometry = object.geometry;
            const vertices = geometry.attributes.position;
            const a = new THREE.Vector3().fromBufferAttribute(vertices, face.a);
            const b = new THREE.Vector3().fromBufferAttribute(vertices, face.b);
            const c = new THREE.Vector3().fromBufferAttribute(vertices, face.c);

            const faceGeometry = new THREE.BufferGeometry();
            faceGeometry.setAttribute('position', new THREE.Float32BufferAttribute([
              a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z
            ], 3));
            faceGeometry.setIndex([0, 1, 2]);

            const faceMaterial = new THREE.MeshBasicMaterial({ 
              color: 0x44ff44, 
              transparent: true, 
              opacity: 0.6, 
              side: THREE.DoubleSide 
            });
            highlightMesh.current = new THREE.Mesh(faceGeometry, faceMaterial);
            highlightMesh.current.matrix.copy(object.matrixWorld);
            highlightMesh.current.matrixAutoUpdate = false;
            scene.add(highlightMesh.current);

            // Calculate face area and normal
            const ab = new THREE.Vector3().subVectors(b, a);
            const ac = new THREE.Vector3().subVectors(c, a);
            const cross = new THREE.Vector3().crossVectors(ab, ac);
            const area = cross.length() / 2;
            const normal = cross.normalize();

            setSelected({ 
              type: 'face', 
              object, 
              data: { 
                faceIndex: face.a,
                cadType: object.userData.cadType,
                id: object.userData.id,
                area: area,
                normal: normal
              } 
            });
          }
        } else {
          // Shape Selection (Normal Click)
          originalMaterial.current = object.material;
          object.material = object.material.clone();
          object.material.color.setHex(0x6c757d);
          object.material.transparent = true;
          object.material.opacity = 0.8;

          // Attach transform controls
          if (transformControls?.attachTransformControls) {
            setTimeout(() => {
              transformControls.attachTransformControls(object);
            }, 100);
          }

          setSelected({ 
            type: 'shape', 
            object, 
            data: { 
              cadType: object.userData.cadType,
              id: object.userData.id,
              position: object.position.clone(),
              rotation: object.rotation.clone(),
              scale: object.scale.clone()
            } 
          });
        }
      } else {
        // Detach transform controls when nothing is selected
        if (transformControls?.detachTransformControls) {
          transformControls.detachTransformControls();
        }
        setSelected(null);
      }
    };

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('click', onClick);

    return () => {
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('click', onClick);
    };
  }, [camera, scene, canvas, selected]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearHighlight();
    };
  }, []);

  return selected;
};

export default useSelection;
