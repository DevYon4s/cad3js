
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';

const useThree = (canvasRef) => {
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
  const rendererRef = useRef(null);
  const animationFrameId = useRef(null);
  const transformControlsRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      antialias: true,
      alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    rendererRef.current = renderer;

    // Scene setup
    sceneRef.current.background = new THREE.Color(0xf8f9fa);

    // Camera position
    cameraRef.current.position.set(8, 6, 8);
    cameraRef.current.lookAt(0, 0, 0);
    
    // Initialize Transform Controls
    const transformControls = new TransformControls(cameraRef.current, renderer.domElement);
    transformControls.addEventListener('change', () => {
      // Trigger re-render when transform changes
    });
    sceneRef.current.add(transformControls);
    transformControlsRef.current = transformControls;

    // Render loop
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      renderer.render(sceneRef.current, cameraRef.current);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      const rect = canvasRef.current.getBoundingClientRect();
      cameraRef.current.aspect = rect.width / rect.height;
      cameraRef.current.updateProjectionMatrix();
      renderer.setSize(rect.width, rect.height);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (transformControlsRef.current) {
        sceneRef.current.remove(transformControlsRef.current);
        transformControlsRef.current.dispose();
      }
    };
  }, [canvasRef]);

  const attachTransformControls = (object) => {
    if (transformControlsRef.current && object) {
      transformControlsRef.current.attach(object);
    }
  };
  
  const detachTransformControls = () => {
    if (transformControlsRef.current) {
      transformControlsRef.current.detach();
    }
  };
  
  const setTransformMode = (mode) => {
    if (transformControlsRef.current) {
      transformControlsRef.current.setMode(mode);
    }
  };

  return { 
    scene: sceneRef.current, 
    camera: cameraRef.current, 
    renderer: rendererRef.current,
    attachTransformControls,
    detachTransformControls,
    setTransformMode
  };
};

export default useThree;
