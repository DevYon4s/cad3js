import * as THREE from 'three';

class CustomTransformControls extends THREE.Object3D {
  constructor(camera, domElement) {
    super();
    
    this.camera = camera;
    this.domElement = domElement;
    this.object = null;
    this.mode = 'translate';
    this.enabled = true;
    this.visible = false;
    this.onEnableCameraControls = null;
    this.onDisableCameraControls = null;
    this.onTransformStart = null;
    this.onTransformEnd = null;
    
    this.gizmo = new THREE.Group();
    this.add(this.gizmo);
    
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.isDragging = false;
    this.selectedAxis = null;
    
    this.createGizmo();
    this.bindEvents();
  }
  
  createGizmo() {
    // Clear existing gizmo
    this.gizmo.clear();
    
    if (this.mode === 'translate') {
      this.createTranslateGizmo();
    } else if (this.mode === 'rotate') {
      this.createRotateGizmo();
    } else if (this.mode === 'scale') {
      this.createScaleGizmo();
    }
  }
  
  createTranslateGizmo() {
    const arrowLength = 2;
    const arrowRadius = 0.05;
    const coneHeight = 0.3;
    const coneRadius = 0.1;
    
    // X-axis (Red)
    const xArrow = this.createArrow(0xff0000, arrowLength, arrowRadius, coneHeight, coneRadius);
    xArrow.rotation.z = -Math.PI / 2;
    xArrow.userData = { axis: 'x' };
    this.gizmo.add(xArrow);
    
    // Y-axis (Green)
    const yArrow = this.createArrow(0x00ff00, arrowLength, arrowRadius, coneHeight, coneRadius);
    yArrow.userData = { axis: 'y' };
    this.gizmo.add(yArrow);
    
    // Z-axis (Blue)
    const zArrow = this.createArrow(0x0000ff, arrowLength, arrowRadius, coneHeight, coneRadius);
    zArrow.rotation.x = Math.PI / 2;
    zArrow.userData = { axis: 'z' };
    this.gizmo.add(zArrow);
  }
  
  createRotateGizmo() {
    const radius = 1.5;
    const tubeRadius = 0.05;
    
    // X-axis ring (Red)
    const xRing = this.createRing(0xff0000, radius, tubeRadius);
    xRing.rotation.y = Math.PI / 2;
    xRing.userData = { axis: 'x' };
    this.gizmo.add(xRing);
    
    // Y-axis ring (Green)
    const yRing = this.createRing(0x00ff00, radius, tubeRadius);
    yRing.rotation.x = Math.PI / 2;
    yRing.userData = { axis: 'y' };
    this.gizmo.add(yRing);
    
    // Z-axis ring (Blue)
    const zRing = this.createRing(0x0000ff, radius, tubeRadius);
    zRing.userData = { axis: 'z' };
    this.gizmo.add(zRing);
  }
  
  createScaleGizmo() {
    const lineLength = 1.5;
    const cubeSize = 0.2;
    
    // X-axis (Red)
    const xHandle = this.createScaleHandle(0xff0000, lineLength, cubeSize);
    xHandle.rotation.z = -Math.PI / 2;
    xHandle.userData = { axis: 'x' };
    this.gizmo.add(xHandle);
    
    // Y-axis (Green)
    const yHandle = this.createScaleHandle(0x00ff00, lineLength, cubeSize);
    yHandle.userData = { axis: 'y' };
    this.gizmo.add(yHandle);
    
    // Z-axis (Blue)
    const zHandle = this.createScaleHandle(0x0000ff, lineLength, cubeSize);
    zHandle.rotation.x = Math.PI / 2;
    zHandle.userData = { axis: 'z' };
    this.gizmo.add(zHandle);
  }
  
  createArrow(color, length, radius, coneHeight, coneRadius) {
    const group = new THREE.Group();
    
    // Shaft
    const shaftGeometry = new THREE.CylinderGeometry(radius, radius, length - coneHeight);
    const shaftMaterial = new THREE.MeshBasicMaterial({ color });
    const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
    shaft.position.y = (length - coneHeight) / 2;
    group.add(shaft);
    
    // Cone
    const coneGeometry = new THREE.ConeGeometry(coneRadius, coneHeight);
    const coneMaterial = new THREE.MeshBasicMaterial({ color });
    const cone = new THREE.Mesh(coneGeometry, coneMaterial);
    cone.position.y = length - coneHeight / 2;
    group.add(cone);
    
    return group;
  }
  
  createRing(color, radius, tubeRadius) {
    const geometry = new THREE.TorusGeometry(radius, tubeRadius, 8, 32);
    const material = new THREE.MeshBasicMaterial({ color });
    return new THREE.Mesh(geometry, material);
  }
  
  createScaleHandle(color, lineLength, cubeSize) {
    const group = new THREE.Group();
    
    // Line
    const lineGeometry = new THREE.CylinderGeometry(0.02, 0.02, lineLength);
    const lineMaterial = new THREE.MeshBasicMaterial({ color });
    const line = new THREE.Mesh(lineGeometry, lineMaterial);
    line.position.y = lineLength / 2;
    group.add(line);
    
    // Cube
    const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cubeMaterial = new THREE.MeshBasicMaterial({ color });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.y = lineLength;
    group.add(cube);
    
    return group;
  }
  
  attach(object) {
    this.object = object;
    if (object) {
      this.position.copy(object.position);
      this.visible = true;
    }
  }
  
  detach() {
    this.object = null;
    this.visible = false;
  }
  
  setMode(mode) {
    this.mode = mode;
    this.createGizmo();
  }
  
  bindEvents() {
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    
    this.domElement.addEventListener('mousedown', this.onMouseDown);
    this.domElement.addEventListener('mousemove', this.onMouseMove);
    this.domElement.addEventListener('mouseup', this.onMouseUp);
  }
  
  onMouseDown(event) {
    if (!this.enabled || !this.visible || !this.object) return;
    
    this.updateMouse(event);
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    const intersects = this.raycaster.intersectObjects(this.gizmo.children, true);
    if (intersects.length > 0) {
      this.isDragging = true;
      this.selectedAxis = this.findAxis(intersects[0].object);
      
      // Call transform start callback
      if (this.onTransformStart && this.object) {
        this.onTransformStart(this.object);
      }
      
      // Prevent camera controls and object selection
      event.stopPropagation();
      event.preventDefault();
      
      // Disable camera controls
      if (this.onDisableCameraControls) {
        this.onDisableCameraControls();
      }
      
      this.domElement.style.cursor = 'move';
    }
  }
  
  onMouseMove(event) {
    if (!this.isDragging || !this.selectedAxis || !this.object) return;
    
    event.stopPropagation();
    event.preventDefault();
    
    // Improved transform logic with better sensitivity
    const sensitivity = 0.02;
    const deltaX = event.movementX * sensitivity;
    const deltaY = event.movementY * sensitivity;
    
    if (this.mode === 'translate') {
      if (this.selectedAxis === 'x') {
        this.object.position.x += deltaX;
      } else if (this.selectedAxis === 'y') {
        this.object.position.y -= deltaY;
      } else if (this.selectedAxis === 'z') {
        this.object.position.z += deltaX;
      }
      this.position.copy(this.object.position);
    } else if (this.mode === 'rotate') {
      const rotationSpeed = 0.05;
      if (this.selectedAxis === 'x') {
        this.object.rotation.x += deltaY * rotationSpeed;
      } else if (this.selectedAxis === 'y') {
        this.object.rotation.y += deltaX * rotationSpeed;
      } else if (this.selectedAxis === 'z') {
        this.object.rotation.z += deltaX * rotationSpeed;
      }
    } else if (this.mode === 'scale') {
      const scaleSpeed = 0.01;
      const scaleDelta = deltaX + deltaY;
      if (this.selectedAxis === 'x') {
        this.object.scale.x = Math.max(0.1, this.object.scale.x + scaleDelta);
      } else if (this.selectedAxis === 'y') {
        this.object.scale.y = Math.max(0.1, this.object.scale.y + scaleDelta);
      } else if (this.selectedAxis === 'z') {
        this.object.scale.z = Math.max(0.1, this.object.scale.z + scaleDelta);
      }
    }
  }
  
  onMouseUp() {
    if (this.isDragging) {
      // Call transform end callback before resetting state
      if (this.onTransformEnd && this.object) {
        this.onTransformEnd(this.object);
      }
      
      this.isDragging = false;
      this.selectedAxis = null;
      
      // Re-enable camera controls
      if (this.onEnableCameraControls) {
        this.onEnableCameraControls();
      }
      
      this.domElement.style.cursor = 'default';
    }
  }
  
  updateMouse(event) {
    const rect = this.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }
  
  findAxis(object) {
    let current = object;
    while (current && !current.userData?.axis) {
      current = current.parent;
    }
    return current?.userData?.axis || null;
  }
  
  dispose() {
    this.domElement.removeEventListener('mousedown', this.onMouseDown);
    this.domElement.removeEventListener('mousemove', this.onMouseMove);
    this.domElement.removeEventListener('mouseup', this.onMouseUp);
  }
}

export default CustomTransformControls;