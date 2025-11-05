# Cad3.js - 3D CAD Application

A modern, web-based 3D CAD application built with React, Vite, and Three.js. Create, edit, and manipulate 3D objects with professional CAD tools including sketching, extrusion, selection, and transformation capabilities.

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation Steps
1. **Clone the repository**
   ```bash
   git clone <repository-url>
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
   - The application will load with a 3D viewport and toolbars

## 🎯 Core Features

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

### 7. **Camera & Navigation**
- **Orbit Controls**: Click and drag to rotate around scene
- **Zoom**: Mouse wheel to zoom in/out
- **Auto-disable**: Camera controls disabled during sketch mode
- **Smooth Interaction**: Responsive camera movement with momentum

## 🎮 User Interface

### Top Navigation Bar
- **Logo**: Application branding
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

## 🧪 Testing Examples

### Import/Export Testing
The application includes three test JSON files to demonstrate import/export functionality:

#### 1. **Basic Shapes Test** (`test-scene-basic.json`)
- **Content**: Simple box, sphere, and cylinder
- **Purpose**: Test basic object import/export
- **Features**: Standard materials, basic positioning

#### 2. **Complex Scene Test** (`test-scene-complex.json`)
- **Content**: 6 objects with advanced transforms
- **Purpose**: Test scaling, rotation, and complex positioning
- **Features**: Named objects, varied materials, transform matrices

#### 3. **Sketches & Extrusions Test** (`test-scene-sketches.json`)
- **Content**: 2D sketches and their extruded 3D versions
- **Purpose**: Test sketch import and extrusion data preservation
- **Features**: Mixed 2D/3D objects, extrusion metadata

### Testing Instructions
1. **Download** any test file from the project root
2. **Click "Import Scene"** in the right panel
3. **Select** the downloaded JSON file
4. **Verify** objects appear with correct properties
5. **Test Selection** - click objects to see transform gizmos
6. **Test Export** - export the scene and compare JSON structure

### Custom Test File Template
```json
{
  "version": "1.0",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "objectCount": 0,
  "cadObjects": {
    "metadata": {
      "version": 4.6,
      "type": "Object",
      "generator": "Object3D.toJSON"
    },
    "geometries": [
      // Add your geometries here
    ],
    "materials": [
      // Add your materials here  
    ],
    "object": {
      "uuid": "custom-scene",
      "type": "Scene",
      "children": [
        // Add your objects here
      ]
    }
  }
}
```

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` | Undo last action |
| `Ctrl+Y` | Redo last undone action |
| `Ctrl+Shift+Z` | Alternative redo |
| `G` | Toggle grid snapping (in sketch mode) |
| `ESC` | Cancel current sketch operation |
| `Shift+Click` | Select face |
| `Ctrl+Click` | Select edge |
| `Click` | Select shape |

## 🎨 Selection & Properties

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

## 🔧 Technical Architecture

### Core Technologies
- **React 19**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **Three.js**: 3D graphics library
- **Lucide React**: Modern icon library

### Key Components
- **useThree**: Core Three.js scene management
- **useSelection**: Advanced raycasting and selection
- **useSketch**: 2D sketching and extrusion logic
- **useUndoRedo**: History management system
- **CustomTransformControls**: Interactive transformation gizmos

### File Structure
```
src/
├── components/          # React UI components
├── hooks/              # Custom React hooks
├── threelogics/        # Three.js logic and utilities
├── api/               # Import/export functionality
└── assets/            # Static assets
```

## ⚠️ Known Limitations

### Transform Controls
- **Gizmo Interaction**: Occasionally gizmos may not respond on first click
- **Camera Interference**: Transform operations may briefly affect camera controls
- **Multi-selection**: Transform controls work on single objects only

### Sketch Mode
- **Complex Shapes**: Only rectangle and circle primitives supported
- **Curve Editing**: No bezier or spline curve support
- **Constraint System**: No geometric constraints or dimensions

### Import/Export
- **File Size**: Large scenes may have performance impact
- **Texture Support**: Materials export but textures are not preserved
- **Animation Data**: No support for animations or keyframes

### Performance
- **Object Count**: Performance degrades with 100+ objects
- **Real-time Updates**: Property panel updates may lag with complex selections
- **Memory Usage**: No automatic cleanup of disposed geometries

### Browser Compatibility
- **WebGL Required**: Needs modern browser with WebGL support
- **File API**: Import functionality requires File API support
- **ES6 Features**: Requires modern JavaScript engine

### Selection System
- **Nested Objects**: Groups and nested hierarchies have limited support
- **Precision**: Edge selection accuracy depends on geometry complexity
- **Visual Feedback**: Selection highlights may not render correctly on all geometries

## 🔮 Future Enhancements

- **Parametric Modeling**: Constraint-based design system
- **Advanced Sketching**: Splines, arcs, and complex curves
- **Assembly Mode**: Multi-part assemblies with relationships
- **Material Editor**: Advanced material and texture editing
- **Measurement Tools**: Dimension and annotation tools
- **Export Formats**: STL, OBJ, and other 3D file formats