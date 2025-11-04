import * as THREE from 'three';

class SketchTool {
  constructor(scene, camera, renderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.isActive = false;
    this.currentTool = null;
    this.drawingState = 'idle';
    this.gridSize = 0.5;
    this.snapToGrid = true;
    
    this.startPoint = null;
    this.currentPoint = null;
    this.previewMesh = null;
    this.sketchPlane = null;
    this.gridHelper = null;
    this.sketchGroup = new THREE.Group();
    this.completedSketches = [];
    
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseClick = this.onMouseClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    
    this.setupSketchPlane();
  }
  
  setupSketchPlane() {
    const planeGeometry = new THREE.PlaneGeometry(100, 100);
    const planeMaterial = new THREE.MeshBasicMaterial({ 
      visible: false, 
      side: THREE.DoubleSide 
    });
    this.sketchPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    this.sketchPlane.rotation.x = -Math.PI / 2;
    this.sketchPlane.position.y = 0;
    
    this.gridHelper = new THREE.GridHelper(20, 40, 0x888888, 0xcccccc);
    this.gridHelper.visible = false;
    
    this.scene.add(this.sketchPlane);
    this.scene.add(this.gridHelper);
    this.scene.add(this.sketchGroup);
  }
  
  activate(tool = 'rectangle') {
    this.isActive = true;
    this.currentTool = tool;
    this.drawingState = 'idle';
    this.gridHelper.visible = true;
    
    this.renderer.domElement.addEventListener('mousemove', this.onMouseMove);
    this.renderer.domElement.addEventListener('click', this.onMouseClick);
    window.addEventListener('keydown', this.onKeyDown);
    
    this.renderer.domElement.style.cursor = 'crosshair';
  }
  
  deactivate() {
    this.isActive = false;
    this.currentTool = null;
    this.drawingState = 'idle';
    this.gridHelper.visible = false;
    this.clearPreview();
    
    this.renderer.domElement.removeEventListener('mousemove', this.onMouseMove);
    this.renderer.domElement.removeEventListener('click', this.onMouseClick);
    window.removeEventListener('keydown', this.onKeyDown);
    
    this.renderer.domElement.style.cursor = 'grab';
  }
  
  snapToGridPoint(point) {
    if (!this.snapToGrid) return point;
    
    return new THREE.Vector3(
      Math.round(point.x / this.gridSize) * this.gridSize,
      0,
      Math.round(point.z / this.gridSize) * this.gridSize
    );
  }
  
  getMousePosition(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObject(this.sketchPlane);
    
    if (intersects.length > 0) {
      return this.snapToGridPoint(intersects[0].point);
    }
    return null;
  }
  
  onMouseMove(event) {
    if (!this.isActive) return;
    
    const point = this.getMousePosition(event);
    if (!point) return;
    
    this.currentPoint = point;
    
    if (this.drawingState === 'drawing' && this.startPoint) {
      this.updatePreview();
    }
  }
  
  onMouseClick(event) {
    if (!this.isActive) return;
    
    const point = this.getMousePosition(event);
    if (!point) return;
    
    if (this.drawingState === 'idle') {
      this.startDrawing(point);
    } else if (this.drawingState === 'drawing') {
      this.finishDrawing(point);
    }
  }
  
  onKeyDown(event) {
    if (!this.isActive) return;
    
    if (event.key === 'Escape') {
      this.cancelDrawing();
    } else if (event.key === 'g' || event.key === 'G') {
      this.snapToGrid = !this.snapToGrid;
    }
  }
  
  startDrawing(point) {
    this.startPoint = point.clone();
    this.drawingState = 'drawing';
  }
  
  finishDrawing(point) {
    this.currentPoint = point;
    this.drawingState = 'finished';
    
    const sketch = this.createSketchGeometry();
    if (sketch) {
      this.completedSketches.push(sketch);
      this.sketchGroup.add(sketch.mesh);
    }
    
    this.clearPreview();
    this.drawingState = 'idle';
    this.startPoint = null;
    this.currentPoint = null;
  }
  
  cancelDrawing() {
    this.clearPreview();
    this.drawingState = 'idle';
    this.startPoint = null;
    this.currentPoint = null;
  }
  
  updatePreview() {
    this.clearPreview();
    
    if (this.currentTool === 'rectangle') {
      this.previewMesh = this.createRectanglePreview();
    } else if (this.currentTool === 'circle') {
      this.previewMesh = this.createCirclePreview();
    }
    
    if (this.previewMesh) {
      this.scene.add(this.previewMesh);
    }
  }
  
  createRectanglePreview() {
    const width = Math.abs(this.currentPoint.x - this.startPoint.x);
    const height = Math.abs(this.currentPoint.z - this.startPoint.z);
    
    if (width < 0.1 || height < 0.1) return null;
    
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x6c757d, 
      transparent: true, 
      opacity: 0.3,
      side: THREE.DoubleSide
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(
      (this.startPoint.x + this.currentPoint.x) / 2,
      0.01,
      (this.startPoint.z + this.currentPoint.z) / 2
    );
    
    return mesh;
  }
  
  createCirclePreview() {
    const radius = this.startPoint.distanceTo(this.currentPoint);
    
    if (radius < 0.1) return null;
    
    const geometry = new THREE.CircleGeometry(radius, 32);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x6c757d, 
      transparent: true, 
      opacity: 0.3,
      side: THREE.DoubleSide
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(this.startPoint.x, 0.01, this.startPoint.z);
    
    return mesh;
  }
  
  createSketchGeometry() {
    if (this.currentTool === 'rectangle') {
      return this.createRectangleSketch();
    } else if (this.currentTool === 'circle') {
      return this.createCircleSketch();
    }
    return null;
  }
  
  createRectangleSketch() {
    const width = Math.abs(this.currentPoint.x - this.startPoint.x);
    const height = Math.abs(this.currentPoint.z - this.startPoint.z);
    
    if (width < 0.1 || height < 0.1) return null;
    
    const shape = new THREE.Shape();
    const minX = Math.min(this.startPoint.x, this.currentPoint.x);
    const maxX = Math.max(this.startPoint.x, this.currentPoint.x);
    const minZ = Math.min(this.startPoint.z, this.currentPoint.z);
    const maxZ = Math.max(this.startPoint.z, this.currentPoint.z);
    
    shape.moveTo(minX, minZ);
    shape.lineTo(maxX, minZ);
    shape.lineTo(maxX, maxZ);
    shape.lineTo(minX, maxZ);
    shape.lineTo(minX, minZ);
    
    const geometry = new THREE.ShapeGeometry(shape);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0x8e9aaf,
      side: THREE.DoubleSide
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = 0.01;
    mesh.userData = {
      cadType: 'sketch',
      sketchType: 'rectangle',
      shape: shape,
      width: width,
      height: height,
      id: Date.now()
    };
    
    return { mesh, shape, type: 'rectangle' };
  }
  
  createCircleSketch() {
    const radius = this.startPoint.distanceTo(this.currentPoint);
    
    if (radius < 0.1) return null;
    
    const shape = new THREE.Shape();
    shape.absarc(this.startPoint.x, this.startPoint.z, radius, 0, Math.PI * 2, false);
    
    const geometry = new THREE.ShapeGeometry(shape);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0xcbc0d3,
      side: THREE.DoubleSide
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = 0.01;
    mesh.userData = {
      cadType: 'sketch',
      sketchType: 'circle',
      shape: shape,
      radius: radius,
      center: this.startPoint.clone(),
      id: Date.now()
    };
    
    return { mesh, shape, type: 'circle' };
  }
  
  clearPreview() {
    if (this.previewMesh) {
      this.scene.remove(this.previewMesh);
      this.previewMesh.geometry.dispose();
      this.previewMesh.material.dispose();
      this.previewMesh = null;
    }
  }
  
  extrudeSketch(sketchMesh, height = 1) {
    if (!sketchMesh || !sketchMesh.userData.shape) return null;
    
    const shape = sketchMesh.userData.shape;
    const extrudeSettings = {
      depth: height,
      bevelEnabled: false
    };
    
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const material = new THREE.MeshStandardMaterial({ 
      color: sketchMesh.material.color.getHex(),
      metalness: 0.1,
      roughness: 0.3
    });
    
    const extrudedMesh = new THREE.Mesh(geometry, material);
    extrudedMesh.rotation.x = -Math.PI / 2;
    extrudedMesh.position.copy(sketchMesh.position);
    extrudedMesh.position.y = height / 2;
    extrudedMesh.castShadow = true;
    extrudedMesh.receiveShadow = true;
    
    extrudedMesh.userData = {
      cadType: 'extruded',
      originalSketch: sketchMesh.userData,
      height: height,
      id: Date.now()
    };
    
    return extrudedMesh;
  }
  
  getCompletedSketches() {
    return this.completedSketches;
  }
  
  clearAllSketches() {
    this.completedSketches.forEach(sketch => {
      this.sketchGroup.remove(sketch.mesh);
      sketch.mesh.geometry.dispose();
      sketch.mesh.material.dispose();
    });
    this.completedSketches = [];
  }
  
  dispose() {
    this.deactivate();
    this.clearAllSketches();
    this.scene.remove(this.sketchPlane);
    this.scene.remove(this.gridHelper);
    this.scene.remove(this.sketchGroup);
  }
}

export default SketchTool;