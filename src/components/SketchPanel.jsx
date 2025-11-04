import React, { useState } from 'react';
import { ArrowUp, Grid, X } from 'lucide-react';
import './SketchPanel.css';

const SketchPanel = ({ 
  completedSketches, 
  selectedSketch, 
  setSelectedSketch, 
  onExtrudeSketch, 
  onClearSketches,
  onToggleSnapToGrid,
  snapToGrid = true
}) => {
  const [extrudeHeight, setExtrudeHeight] = useState(1);

  const handleExtrudeClick = () => {
    if (selectedSketch) {
      onExtrudeSketch(selectedSketch.mesh, extrudeHeight);
      setSelectedSketch(null);
    }
  };

  const handleSketchSelect = (sketch) => {
    setSelectedSketch(sketch);
  };

  return (
    <div className="sketch-panel">
      <div className="sketch-panel-header">
        <h3>Sketch Manager</h3>
        <div className="sketch-controls">
          <button 
            className={`snap-button ${snapToGrid ? 'active' : ''}`}
            onClick={onToggleSnapToGrid}
            title="Toggle Snap to Grid"
          >
            <Grid size={16} />
          </button>
          <button 
            className="clear-button"
            onClick={onClearSketches}
            title="Clear All Sketches"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="sketches-list">
        <h4>Completed Sketches ({completedSketches.length})</h4>
        {completedSketches.length === 0 ? (
          <p className="no-sketches">No sketches created yet</p>
        ) : (
          <div className="sketch-items">
            {completedSketches.map((sketch, index) => (
              <div 
                key={sketch.mesh.userData.id || index}
                className={`sketch-item ${selectedSketch?.mesh.userData.id === sketch.mesh.userData.id ? 'selected' : ''}`}
                onClick={() => handleSketchSelect(sketch)}
              >
                <div className="sketch-info">
                  <span className="sketch-type">{sketch.type}</span>
                  <span className="sketch-id">#{sketch.mesh.userData.id}</span>
                </div>
                {sketch.type === 'rectangle' && (
                  <div className="sketch-details">
                    W: {sketch.mesh.userData.width?.toFixed(2)} × H: {sketch.mesh.userData.height?.toFixed(2)}
                  </div>
                )}
                {sketch.type === 'circle' && (
                  <div className="sketch-details">
                    R: {sketch.mesh.userData.radius?.toFixed(2)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedSketch && (
        <div className="extrude-section">
          <h4>Extrude Selected Sketch</h4>
          <div className="extrude-controls">
            <div className="input-group">
              <label htmlFor="extrudeHeight">Height:</label>
              <input
                id="extrudeHeight"
                type="number"
                min="0.1"
                max="10"
                step="0.1"
                value={extrudeHeight}
                onChange={(e) => setExtrudeHeight(parseFloat(e.target.value))}
              />
            </div>
            <button 
              className="extrude-button"
              onClick={handleExtrudeClick}
            >
              <ArrowUp size={16} />
              Extrude
            </button>
          </div>
        </div>
      )}

      <div className="sketch-help">
        <h4>Sketch Controls</h4>
        <ul>
          <li><strong>Click & Drag:</strong> Create shapes</li>
          <li><strong>ESC:</strong> Cancel current sketch</li>
          <li><strong>G:</strong> Toggle snap to grid</li>
        </ul>
      </div>
    </div>
  );
};

export default SketchPanel;