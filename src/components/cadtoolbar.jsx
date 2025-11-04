import React, { useState } from 'react';
import { Square, Circle, Cylinder } from 'lucide-react';
import './CadToolbar.css';

const CadToolbar = ({ onAddShape }) => {
  const [showShapes, setShowShapes] = useState(false);

  return (
    <div className="cad-toolbar">
      <div className="toolbar-group">
        <button onClick={() => setShowShapes(!showShapes)}>Shapes</button>
        {showShapes && (
          <div className="shape-dropdown">
            <button onClick={() => onAddShape('box')}><Square /><span>Box</span></button>
            <button onClick={() => onAddShape('sphere')}><Circle /><span>Sphere</span></button>
            <button onClick={() => onAddShape('cylinder')}><Cylinder /><span>Cylinder</span></button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CadToolbar;