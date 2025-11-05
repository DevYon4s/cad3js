# Cad3.js - 3D CAD Application

A modern, web-based 3D CAD application built with React, Vite, and Three.js. Create, edit, and manipulate 3D objects with professional CAD tools including sketching, extrusion, selection, and transformation capabilities.

## Setup & Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation Steps
1. **Clone the repository**
   ```bash
   git clone https://github.com/DevYon4s/cad3js.git
   cd cad3js
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:5173`
   

## Core Features

### 1. **3D Shape Creation**
- **Primitive Shapes**: Box, Sphere, Cylinder
- **Material Properties**: Realistic materials with shadows and lighting
- **Automatic Positioning**: Smart grid-based placement
- **Unique Identification**: Each object has metadata for tracking

### 2. **2D Sketching & Extrusion**
- **Sketch Mode**: Toggle between 3D and 2D drawing modes
- **Drawing Tools**: Rectangle and Circle with click-drag interaction
- **Grid Snapping**: Precision drawing with snap-to-grid (toggle with 'G')
- **Real-time Dimensions**: Live measurement display while drawing
- **Extrusion**: Convert 2D sketches to 3D objects with customizable height
- **Preview Mode**: See shapes while drawing with visual feedback

### 3. **Advanced Selection System**
- **Shape Selection**: Click objects to select entire shapes
- **Face Selection**: Shift+Click to select individual faces
- **Edge Selection**: Ctrl+Click to select individual edges
- **Visual Highlighting**: Selected entities are highlighted with colored overlays
- **Property Display**: Real-time properties for selected entities

### 4. **Transform Controls**
- **Visual Gizmos**: Colored handles for precise transformations
- **Move Mode**: Red/Green/Blue arrows for X/Y/Z translation
- **Rotate Mode**: Colored rings for rotation around each axis
- **Scale Mode**: Colored cubes for scaling along each axis
- **Interactive Dragging**: Click and drag gizmo handles to transform objects

### 5. **Import/Export System**
- **JSON Export**: Save entire scenes with geometry, transforms, and metadata
- **JSON Import**: Load scenes with full object restoration
- **Smart Filtering**: Excludes utility objects (grid, lights, controls)
- **Metadata Preservation**: All object properties and userData maintained
- **File Management**: Automatic timestamped filenames

### 6. **History Management**
- **Undo/Redo**: Full action history with keyboard shortcuts
- **Keyboard Shortcuts**: Ctrl+Z (undo), Ctrl+Y (redo)
- **Action Tracking**: Records all operations for rollback
- **History Counter**: Visual indicator of current position in history

### 7. **Editable Sketches**
- **Edit Existing Sketches**: Modify 2D sketches after creation
- **Edit Button**: Click "Edit" button in sketch panel to modify sketches
- **Real-time Preview**: See changes while editing with visual feedback
- **Cancel/Confirm**: ESC to cancel, click to confirm changes
- **Dimension Updates**: Sketch dimensions update automatically during editing

### 8. **Object Grouping**
- **Multi-Selection**: Ctrl+Click to select multiple objects
- **Group Creation**: Combine selected objects into manageable groups
- **Group Management**: Rename, ungroup, or delete entire groups
- **Visual Feedback**: Selected objects highlighted in green
- **Transform Groups**: Move, rotate, and scale groups as single units

### 9. **Face/Edge Dimension Editing**
- **Dimension Display**: View calculated areas and edge lengths
- **Edit Buttons**: Click edit icons next to face/edge measurements
- **Interactive Editor**: Modal dialog for precise dimension input
- **Real-time Updates**: Changes reflected immediately in 3D viewport
- **Validation**: Input validation ensures positive values only

### 10. **Draggable Properties Panel**
- **Floating Panel**: Draggable properties window for flexible workflow
- **Drag Handle**: Click and drag the header to reposition panel
- **Close Button**: X button to hide the properties panel
- **Keyboard Toggle**: Press 'P' to show/hide properties panel
- **Persistent Position**: Panel remembers its position during session

### 11. **Camera & Navigation**
- **Orbit Controls**: Click and drag to rotate around scene
- **Zoom**: Mouse wheel to zoom in/out
- **Auto-disable**: Camera controls disabled during sketch mode
- **Smooth Interaction**: Responsive camera movement with momentum

## 🎮 User Interface

### Top Navigation Bar
- **History Controls**: Undo, Redo, Clear History buttons
- **Keyboard Shortcuts**: Tooltips showing shortcut keys
- **History Counter**: Current position in action history

### Left Toolbar
- **3D Shapes**: Dropdown with Box, Sphere, Cylinder options
- **Sketch Mode**: Toggle for 2D drawing mode
- **Sketch Tools**: Rectangle and Circle drawing tools (when in sketch mode)

### Right Panel
- **Import/Export**: File operations for scene management
- **Sketch Manager**: (Visible in sketch mode) Manage completed sketches
- **Property Panel**: Display properties of selected objects

### 3D Viewport
- **Main Canvas**: Interactive 3D scene
- **Dimension Overlay**: Real-time measurements during sketching
- **Transform Gizmos**: Visual handles for object manipulation

## Testing Examples

### Import/Export Testing
The application includes three test JSON files to demonstrate import/export functionality:

### Testing Instructions
1. **Download** any test file from the project root or create a json file and copy the examples above.
2. **Click "Import Scene"** in the right panel
3. **Select** the downloaded JSON file
4. **Verify** objects appear with correct properties
5. **Test Selection** - click objects to see transform gizmos
6. **Test Export** - export the scene and compare JSON structure

#### 1. **Basic Shapes Test** (`test-scene-basic.json`)
- **Content**: Simple box, sphere, and cylinder
- **Purpose**: Test basic object import/export
- **Features**: Standard materials, basic positioning
```json
{
  "version": "1.0",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "objectCount": 3,
  "cadObjects": {
    "metadata": {
      "version": 4.6,
      "type": "Object",
      "generator": "Object3D.toJSON"
    },
    "geometries": [
      {
        "uuid": "box-geo-1",
        "type": "BoxGeometry",
        "width": 1.5,
        "height": 1.5,
        "depth": 1.5
      },
      {
        "uuid": "sphere-geo-1", 
        "type": "SphereGeometry",
        "radius": 0.8,
        "widthSegments": 32,
        "heightSegments": 16
      },
      {
        "uuid": "cylinder-geo-1",
        "type": "CylinderGeometry",
        "radiusTop": 0.7,
        "radiusBottom": 0.7,
        "height": 1.8,
        "radialSegments": 32
      }
    ],
    "materials": [
      {
        "uuid": "box-mat-1",
        "type": "MeshStandardMaterial",
        "color": 9349807,
        "metalness": 0.1,
        "roughness": 0.3
      },
      {
        "uuid": "sphere-mat-1",
        "type": "MeshStandardMaterial", 
        "color": 13353171,
        "metalness": 0.1,
        "roughness": 0.3
      },
      {
        "uuid": "cylinder-mat-1",
        "type": "MeshStandardMaterial",
        "color": 15717847,
        "metalness": 0.1,
        "roughness": 0.3
      }
    ],
    "object": {
      "uuid": "scene-root",
      "type": "Scene",
      "children": [
        {
          "uuid": "box-1",
          "type": "Mesh",
          "geometry": "box-geo-1",
          "material": "box-mat-1",
          "castShadow": true,
          "receiveShadow": true,
          "matrix": [1,0,0,0,0,1,0,0,0,0,1,0,-2,0,0,1],
          "userData": {
            "cadType": "box",
            "originalColor": 9349807,
            "size": 1.5,
            "id": 1001
          }
        },
        {
          "uuid": "sphere-1", 
          "type": "Mesh",
          "geometry": "sphere-geo-1",
          "material": "sphere-mat-1",
          "castShadow": true,
          "receiveShadow": true,
          "matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
          "userData": {
            "cadType": "sphere",
            "originalColor": 13353171,
            "radius": 0.8,
            "id": 1002
          }
        },
        {
          "uuid": "cylinder-1",
          "type": "Mesh", 
          "geometry": "cylinder-geo-1",
          "material": "cylinder-mat-1",
          "castShadow": true,
          "receiveShadow": true,
          "matrix": [1,0,0,0,0,1,0,0,0,0,1,0,2,0,0,1],
          "userData": {
            "cadType": "cylinder",
            "originalColor": 15717847,
            "radius": 0.7,
            "height": 1.8,
            "id": 1003
          }
        }
      ]
    }
  }
}

```

#### 2. **Complex Scene Test** (`test-scene-complex.json`)
- **Content**: 6 objects with advanced transforms
- **Purpose**: Test scaling, rotation, and complex positioning
- **Features**: Named objects, varied materials, transform matrices
```json
{
  "version": "1.0",
  "timestamp": "2024-01-15T11:00:00.000Z",
  "objectCount": 6,
  "cadObjects": {
    "metadata": {
      "version": 4.6,
      "type": "Object",
      "generator": "Object3D.toJSON"
    },
    "geometries": [
      {
        "uuid": "box-geo-2",
        "type": "BoxGeometry",
        "width": 2,
        "height": 0.5,
        "depth": 3
      },
      {
        "uuid": "sphere-geo-2",
        "type": "SphereGeometry",
        "radius": 0.6,
        "widthSegments": 32,
        "heightSegments": 16
      },
      {
        "uuid": "cylinder-geo-2",
        "type": "CylinderGeometry",
        "radiusTop": 0.3,
        "radiusBottom": 0.8,
        "height": 2.5,
        "radialSegments": 32
      },
      {
        "uuid": "extruded-geo-1",
        "type": "ExtrudeGeometry",
        "shapes": [],
        "options": {
          "depth": 1.2,
          "bevelEnabled": false
        }
      }
    ],
    "materials": [
      {
        "uuid": "mat-red",
        "type": "MeshStandardMaterial",
        "color": 16711680,
        "metalness": 0.2,
        "roughness": 0.4
      },
      {
        "uuid": "mat-green",
        "type": "MeshStandardMaterial",
        "color": 65280,
        "metalness": 0.1,
        "roughness": 0.3
      },
      {
        "uuid": "mat-blue",
        "type": "MeshStandardMaterial",
        "color": 255,
        "metalness": 0.3,
        "roughness": 0.2
      },
      {
        "uuid": "mat-yellow",
        "type": "MeshStandardMaterial",
        "color": 16776960,
        "metalness": 0.1,
        "roughness": 0.5
      }
    ],
    "object": {
      "uuid": "complex-scene",
      "type": "Scene",
      "children": [
        {
          "uuid": "platform",
          "type": "Mesh",
          "geometry": "box-geo-2",
          "material": "mat-red",
          "castShadow": true,
          "receiveShadow": true,
          "matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,-1,0,1],
          "userData": {
            "cadType": "box",
            "originalColor": 16711680,
            "size": [2, 0.5, 3],
            "id": 2001,
            "name": "Platform Base"
          }
        },
        {
          "uuid": "ball-1",
          "type": "Mesh",
          "geometry": "sphere-geo-2",
          "material": "mat-green",
          "castShadow": true,
          "receiveShadow": true,
          "matrix": [1,0,0,0,0,1,0,0,0,0,1,0,-1.5,0.5,0,1],
          "userData": {
            "cadType": "sphere",
            "originalColor": 65280,
            "radius": 0.6,
            "id": 2002,
            "name": "Green Ball"
          }
        },
        {
          "uuid": "ball-2",
          "type": "Mesh",
          "geometry": "sphere-geo-2", 
          "material": "mat-blue",
          "castShadow": true,
          "receiveShadow": true,
          "matrix": [0.8,0,0,0,0,1.2,0,0,0,0,0.8,0,1.5,0.5,0,1],
          "userData": {
            "cadType": "sphere",
            "originalColor": 255,
            "radius": 0.6,
            "id": 2003,
            "name": "Blue Ball (Scaled)"
          }
        },
        {
          "uuid": "tower",
          "type": "Mesh",
          "geometry": "cylinder-geo-2",
          "material": "mat-yellow",
          "castShadow": true,
          "receiveShadow": true,
          "matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,1.5,2,1],
          "userData": {
            "cadType": "cylinder",
            "originalColor": 16776960,
            "radius": [0.3, 0.8],
            "height": 2.5,
            "id": 2004,
            "name": "Tower"
          }
        },
        {
          "uuid": "rotated-box",
          "type": "Mesh",
          "geometry": "box-geo-2",
          "material": "mat-blue",
          "castShadow": true,
          "receiveShadow": true,
          "matrix": [0.707,-0.707,0,0,0.707,0.707,0,0,0,0,1,0,-2,1,2,1],
          "userData": {
            "cadType": "box",
            "originalColor": 255,
            "size": [2, 0.5, 3],
            "id": 2005,
            "name": "Rotated Platform"
          }
        },
        {
          "uuid": "small-cylinder",
          "type": "Mesh",
          "geometry": "cylinder-geo-2",
          "material": "mat-green",
          "castShadow": true,
          "receiveShadow": true,
          "matrix": [0.5,0,0,0,0,0.3,0,0,0,0,0.5,0,2,0.2,-2,1],
          "userData": {
            "cadType": "cylinder", 
            "originalColor": 65280,
            "radius": [0.3, 0.8],
            "height": 2.5,
            "id": 2006,
            "name": "Small Cylinder"
          }
        }
      ]
    }
  }
}

```

#### 3. **Sketches & Extrusions Test** (`test-scene-sketches.json`)
- **Content**: 2D sketches and their extruded 3D versions
- **Purpose**: Test sketch import and extrusion data preservation
- **Features**: Mixed 2D/3D objects, extrusion metadata
```json
{
  "version": "1.0",
  "timestamp": "2024-01-15T12:00:00.000Z",
  "objectCount": 4,
  "cadObjects": {
    "metadata": {
      "version": 4.6,
      "type": "Object",
      "generator": "Object3D.toJSON"
    },
    "geometries": [
      {
        "uuid": "sketch-rect-geo",
        "type": "ShapeGeometry",
        "shapes": []
      },
      {
        "uuid": "sketch-circle-geo", 
        "type": "ShapeGeometry",
        "shapes": []
      },
      {
        "uuid": "extruded-rect-geo",
        "type": "ExtrudeGeometry",
        "shapes": [],
        "options": {
          "depth": 2,
          "bevelEnabled": false
        }
      },
      {
        "uuid": "extruded-circle-geo",
        "type": "ExtrudeGeometry", 
        "shapes": [],
        "options": {
          "depth": 1.5,
          "bevelEnabled": false
        }
      }
    ],
    "materials": [
      {
        "uuid": "sketch-mat-1",
        "type": "MeshStandardMaterial",
        "color": 9349807,
        "side": 2
      },
      {
        "uuid": "sketch-mat-2",
        "type": "MeshStandardMaterial",
        "color": 13353171,
        "side": 2
      },
      {
        "uuid": "extruded-mat-1",
        "type": "MeshStandardMaterial",
        "color": 9349807,
        "metalness": 0.1,
        "roughness": 0.3
      },
      {
        "uuid": "extruded-mat-2",
        "type": "MeshStandardMaterial",
        "color": 13353171,
        "metalness": 0.1,
        "roughness": 0.3
      }
    ],
    "object": {
      "uuid": "sketch-scene",
      "type": "Scene", 
      "children": [
        {
          "uuid": "flat-rectangle",
          "type": "Mesh",
          "geometry": "sketch-rect-geo",
          "material": "sketch-mat-1",
          "matrix": [1,0,0,0,0,0,-1,0,0,1,0,0,-3,0.01,0,1],
          "userData": {
            "cadType": "sketch",
            "sketchType": "rectangle",
            "width": 2.5,
            "height": 1.5,
            "id": 3001,
            "name": "Rectangle Sketch"
          }
        },
        {
          "uuid": "flat-circle",
          "type": "Mesh",
          "geometry": "sketch-circle-geo",
          "material": "sketch-mat-2", 
          "matrix": [1,0,0,0,0,0,-1,0,0,1,0,0,3,0.01,0,1],
          "userData": {
            "cadType": "sketch",
            "sketchType": "circle",
            "radius": 1.2,
            "center": {"x": 3, "y": 0, "z": 0},
            "id": 3002,
            "name": "Circle Sketch"
          }
        },
        {
          "uuid": "extruded-rectangle",
          "type": "Mesh",
          "geometry": "extruded-rect-geo",
          "material": "extruded-mat-1",
          "castShadow": true,
          "receiveShadow": true,
          "matrix": [1,0,0,0,0,0,-1,0,0,1,0,0,-3,1,3,1],
          "userData": {
            "cadType": "extruded",
            "originalSketch": {
              "sketchType": "rectangle",
              "width": 2.5,
              "height": 1.5,
              "id": 3001
            },
            "height": 2,
            "id": 3003,
            "name": "Extruded Rectangle"
          }
        },
        {
          "uuid": "extruded-circle",
          "type": "Mesh",
          "geometry": "extruded-circle-geo",
          "material": "extruded-mat-2",
          "castShadow": true,
          "receiveShadow": true,
          "matrix": [1,0,0,0,0,0,-1,0,0,1,0,0,3,0.75,-3,1],
          "userData": {
            "cadType": "extruded",
            "originalSketch": {
              "sketchType": "circle", 
              "radius": 1.2,
              "center": {"x": 3, "y": 0, "z": 0},
              "id": 3002
            },
            "height": 1.5,
            "id": 3004,
            "name": "Extruded Circle"
          }
        }
      ]
    }
  }
}

```



### Custom Test File Template


## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Click` | Select shape |
| `Shift+Click` | Select face |
| `Ctrl+Click` | Multi-select for grouping |
| `Ctrl+Alt+Click` | Select edge |
| `Ctrl+Z` | Undo last action |
| `Ctrl+Y` | Redo last undone action |
| `Ctrl+Shift+Z` | Alternative redo |
| `P` | Toggle Properties Panel |
| `G` | Toggle grid snapping (in sketch mode) |
| `ESC` | Cancel current sketch operation |


## Selection & Properties

### Shape Properties
- **Position**: X, Y, Z coordinates
- **Rotation**: Euler angles in degrees
- **Scale**: X, Y, Z scale factors
- **Type**: Object type (box, sphere, cylinder, etc.)
- **ID**: Unique identifier

### Face Properties
- **Area**: Calculated surface area
- **Normal Vector**: Face normal direction (X, Y, Z)
- **Face Index**: Internal face identifier

### Edge Properties
- **Length**: Calculated edge length
- **Endpoints**: Edge start and end points

## Technical Architecture

### Core Technologies
- **React 19**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **Three.js**: 3D graphics library
- **Lucide React**: Modern icon library

### Key Components
- **useThree**: Core Three.js scene management
- **useSelection**: Advanced raycasting and multi-selection
- **useSketch**: 2D sketching, editing, and extrusion logic
- **useGrouping**: Object grouping and management system
- **useUndoRedo**: History management system
- **CustomTransformControls**: Interactive transformation gizmos
- **DimensionEditor**: Face/edge dimension editing interface

### File Structure
```
src/
├── components/          # React UI components
├── hooks/              # Custom React hooks
├── threelogics/        # Three.js logic and utilities
├── api/               # Import/export functionality
└── assets/            # Static assets
```

## Known Limitations

### Transform Controls
- **Gizmo Interaction**: Occasionally gizmos may not respond on first click
- **Camera Interference**: Transform operations may briefly affect camera controls
- **Multi-selection**: Transform controls work on single objects only


### Performance
- **Object Count**: Performance degrades with 100+ objects
- **Real-time Updates**: Property panel updates may lag with complex selections

### Sketch Editing
- **Complex Shapes**: Only basic rectangle and circle sketches are editable
- **Constraints**: No parametric constraints or dimension-driven editing
- **History**: Sketch edits may not integrate perfectly with undo/redo system

### Grouping
- **Transform Limits**: Groups can only be transformed as units, not individual objects within groups
- **Nesting**: Groups within groups are not supported
- **Selection**: Cannot select individual objects within a group without ungrouping


