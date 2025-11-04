
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const useThree = (canvasRef) => {
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
  const rendererRef = useRef(null);
  const animationFrameId = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;

    // Camera position
    cameraRef.current.position.z = 5;

    // Render loop
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      renderer.render(sceneRef.current, cameraRef.current);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [canvasRef]);

  return { scene: sceneRef.current, camera: cameraRef.current, rendererDomElement: canvasRef };
};

export default useThree;
