
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';

const useThree = (canvasRef) => {
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
  const rendererRef = useRef(null);
  const animationFrameId = useRef(null);
  const transformControlsRef = useRef(null);
  const controlsEnabledRef = useRef(true);

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
    
    // Basic orbit controls
    let isMouseDown = false;
    let mouseX = 0;
    let mouseY = 0;
    let radius = 12;
    let theta = Math.PI / 4;
    let phi = Math.PI / 3;
    const onMouseDown = (event) => {
      if (event.button === 0 && controlsEnabledRef.current) {
        isMouseDown = true;
        mouseX = event.clientX;
        mouseY = event.clientY;
      }
    };

    const onMouseMove = (event) => {
      if (!isMouseDown || !controlsEnabledRef.current) return;
      
      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;
      
      theta -= deltaX * 0.01;
      phi = Math.max(0.1, Math.min(Math.PI - 0.1, phi + deltaY * 0.01));
      
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    const onWheel = (event) => {
      if (controlsEnabledRef.current) {
        radius = Math.max(3, Math.min(50, radius + event.deltaY * 0.01));
      }
    };

    canvasRef.current.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvasRef.current.addEventListener('wheel', onWheel);
    
    // Initialize Transform Controls
    try {
      const transformControls = new TransformControls(cameraRef.current, renderer.domElement);
      transformControls.setMode('translate'); // Default to translate mode
      transformControls.setSize(1.5); // Make gizmos larger and more visible
      transformControls.visible = false; // Hide by default
      
      transformControls.addEventListener('change', () => {
        // Trigger re-render when transform changes
      });
      
      transformControls.addEventListener('dragging-changed', (event) => {
        controlsEnabledRef.current = !event.value;
      });
      
      // Add to scene
      sceneRef.current.add(transformControls);
      transformControlsRef.current = transformControls;
    } catch (error) {
      console.error('Failed to initialize TransformControls:', error);
    }

    // Render loop
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      
      // Update camera position
      if (controlsEnabledRef.current) {
        cameraRef.current.position.x = radius * Math.sin(phi) * Math.cos(theta);
        cameraRef.current.position.y = radius * Math.cos(phi);
        cameraRef.current.position.z = radius * Math.sin(phi) * Math.sin(theta);
        cameraRef.current.lookAt(0, 0, 0);
      }
      
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
      canvasRef.current?.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvasRef.current?.removeEventListener('wheel', onWheel);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (transformControlsRef.current) {
        if (transformControlsRef.current.object) {
          transformControlsRef.current.detach();
        }
        sceneRef.current.remove(transformControlsRef.current);
        transformControlsRef.current.dispose();
      }
    };
  }, [canvasRef]);

  const attachTransformControls = (object) => {
    if (transformControlsRef.current && object) {
      console.log('Attaching transform controls to:', object);
      // Detach any previously attached object
      if (transformControlsRef.current.object) {
        transformControlsRef.current.detach();
      }
      // Attach the new object
      transformControlsRef.current.attach(object);
      transformControlsRef.current.visible = true;
      transformControlsRef.current.enabled = true;
      console.log('Transform controls attached, visible:', transformControlsRef.current.visible);
    }
  };
  
  const detachTransformControls = () => {
    if (transformControlsRef.current) {
      transformControlsRef.current.detach();
      transformControlsRef.current.visible = false;
    }
  };
  
  const setTransformMode = (mode) => {
    if (transformControlsRef.current) {
      transformControlsRef.current.setMode(mode);
    }
  };
  
  const enableCameraControls = () => {
    controlsEnabledRef.current = true;
  };
  
  const disableCameraControls = () => {
    controlsEnabledRef.current = false;
  };

  return { 
    scene: sceneRef.current, 
    camera: cameraRef.current, 
    renderer: rendererRef.current,
    attachTransformControls,
    detachTransformControls,
    setTransformMode,
    enableCameraControls,
    disableCameraControls
  };
};

export default useThree;
