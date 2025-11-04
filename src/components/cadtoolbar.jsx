import React, { useState } from 'react';
import { Square, Circle, Cylinder, Edit3, RectangleHorizontal } from 'lucide-react';
import './CadToolbar.css';

const CadToolbar = ({ 
  onAddShape, 
  onEnterSketchMode, 
  onExitSketchMode, 
  onSwitchSketchTool, 
  isSketchMode, 
  currentSketchTool 
}) => {
  const [showShapes, setShowShapes] = useState(false);

  const handleSketchModeToggle = () => {
    if (isSketchMode) {
      onExitSketchMode();
    } else {
      onEnterSketchMode('rectangle');
      setShowShapes(false);
    }
  };

  const handleSketchToolSelect = (tool) => {
    onSwitchSketchTool(tool);
  };

  return (
    <div className="cad-toolbar">
      <div className="toolbar-group">
        <button 
          className={isSketchMode ? 'active' : ''}
          onClick={handleSketchModeToggle}
        >
          <Edit3 size={18} />
          Sketch Mode
        </button>
        {isSketchMode && (
          <div className="sketch-tools">
            <button 
              className={currentSketchTool === 'rectangle' ? 'active' : ''}
              onClick={() => handleSketchToolSelect('rectangle')}
            >
              <RectangleHorizontal size={16} />
              Rectangle
            </button>
            <button 
              className={currentSketchTool === 'circle' ? 'active' : ''}
              onClick={() => handleSketchToolSelect('circle')}
            >
              <Circle size={16} />
              Circle
            </button>
          </div>
        )}
      </div>
      
      {!isSketchMode && (
        <div className="toolbar-group">
          <button onClick={() => setShowShapes(!showShapes)}>3D Shapes</button>
          {showShapes && (
            <div className="shape-dropdown">
              <button onClick={() => onAddShape('box')}><Square /><span>Box</span></button>
              <button onClick={() => onAddShape('sphere')}><Circle /><span>Sphere</span></button>
              <button onClick={() => onAddShape('cylinder')}><Cylinder /><span>Cylinder</span></button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CadToolbar;