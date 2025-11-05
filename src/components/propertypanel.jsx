
import React, { useState, useRef, useEffect } from 'react';
import { Edit, X, Move } from 'lucide-react';
import DimensionEditor from './DimensionEditor';
import './PropertyPanel.css';

const PropertyPanel = ({ selected, transformControls, onUpdateDimension, isVisible, onClose }) => {
  const [currentTransformMode, setCurrentTransformMode] = useState('translate');
  const [showDimensionEditor, setShowDimensionEditor] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const panelRef = useRef(null);
  
  const handleTransformModeChange = (mode) => {
    setCurrentTransformMode(mode);
    transformControls?.setTransformMode(mode);
  };
  
  const handleMouseDown = (e) => {
    if (e.target.closest('.close-btn')) return;
    setIsDragging(true);
    const rect = panelRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);
  
  if (!isVisible) return null;


  const { type, object, data } = selected || {};

  return (
    <div 
      ref={panelRef}
      className="property-panel draggable"
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 1000,
        width: '350px',
        cursor: isDragging ? 'grabbing' : 'default'
      }}
    >
      <div className="property-header" onMouseDown={handleMouseDown}>
        <div className="drag-handle">
          <Move size={16} />
        </div>
        <h2>Properties</h2>
        <button className="close-btn" onClick={onClose}>
          <X size={16} />
        </button>
      </div>
      
      {!selected && (
        <div className="no-selection">
          <p>No item selected</p>
          <div className="selection-help">
            <h3>Selection Controls:</h3>
            <ul>
              <li><strong>Click:</strong> Select shape</li>
              <li><strong>Shift + Click:</strong> Select face</li>
              <li><strong>Ctrl/Cmd + Click:</strong> Select edge</li>
            </ul>
          </div>
        </div>
      )}
      <div className="property-group">
        <h3>Selection Info</h3>
        <div className="property-item">
          <label>Type:</label>
          <span className={`selection-type ${type}`}>{type?.toUpperCase()}</span>
        </div>
        {object && (
          <div className="property-item">
            <label>Object ID:</label>
            <span>{object.userData.id}</span>
          </div>
        )}
        {data?.cadType && (
          <div className="property-item">
            <label>Shape Type:</label>
            <span>{data?.cadType?.toUpperCase()}</span>
          </div>
        )}
      </div>
      
      {selected && type === 'shape' && data && (
        <>
          <div className="property-group">
            <h3>Transform Controls</h3>
            <div className="transform-buttons">
              <button 
                className={`transform-btn ${currentTransformMode === 'translate' ? 'active' : ''}`}
                onClick={() => handleTransformModeChange('translate')}
                title="Move - Drag the colored arrows"
              >
                Move
              </button>
              <button 
                className={`transform-btn ${currentTransformMode === 'rotate' ? 'active' : ''}`}
                onClick={() => handleTransformModeChange('rotate')}
                title="Rotate - Drag the colored rings"
              >
                Rotate
              </button>
              <button 
                className={`transform-btn ${currentTransformMode === 'scale' ? 'active' : ''}`}
                onClick={() => handleTransformModeChange('scale')}
                title="Scale - Drag the colored cubes"
              >
                Scale
              </button>
            </div>
            <div className="transform-help">
              <p><strong>Current Mode:</strong> {currentTransformMode.charAt(0).toUpperCase() + currentTransformMode.slice(1)}</p>
              <p>Click and drag the colored gizmo handles to transform the selected object.</p>
              {currentTransformMode === 'translate' && <p>• <strong>Red:</strong> X-axis • <strong>Green:</strong> Y-axis • <strong>Blue:</strong> Z-axis</p>}
              {currentTransformMode === 'rotate' && <p>• <strong>Red:</strong> X-rotation • <strong>Green:</strong> Y-rotation • <strong>Blue:</strong> Z-rotation</p>}
              {currentTransformMode === 'scale' && <p>• <strong>Red:</strong> X-scale • <strong>Green:</strong> Y-scale • <strong>Blue:</strong> Z-scale</p>}
            </div>
          </div>
          <div className="property-group">
            <h3>Transform Values</h3>
            <div className="property-item">
              <label>Position:</label>
              <span>X: {object.position.x.toFixed(2)}, Y: {object.position.y.toFixed(2)}, Z: {object.position.z.toFixed(2)}</span>
            </div>
            <div className="property-item">
              <label>Rotation:</label>
              <span>X: {(object.rotation.x * 180/Math.PI).toFixed(1)}°, Y: {(object.rotation.y * 180/Math.PI).toFixed(1)}°, Z: {(object.rotation.z * 180/Math.PI).toFixed(1)}°</span>
            </div>
            <div className="property-item">
              <label>Scale:</label>
              <span>X: {object.scale.x.toFixed(2)}, Y: {object.scale.y.toFixed(2)}, Z: {object.scale.z.toFixed(2)}</span>
            </div>
          </div>
        </>
      )}
      
      {selected && type === 'face' && (
        <div className="property-group">
          <h3>Face Properties</h3>
          <div className="property-item">
            <label>Face Index:</label>
            <span>{data.faceIndex}</span>
          </div>
          <div className="property-item">
            <label>Area:</label>
            <span>{data.area ? data.area.toFixed(4) : 'N/A'}</span>
            <button 
              className="edit-dimension-btn"
              onClick={() => setShowDimensionEditor(true)}
              title="Edit Area"
            >
              <Edit size={14} />
            </button>
          </div>
          <div className="property-item">
            <label>Normal:</label>
            <span>{data.normal ? `(${data.normal.x.toFixed(2)}, ${data.normal.y.toFixed(2)}, ${data.normal.z.toFixed(2)})` : 'N/A'}</span>
          </div>
        </div>
      )}
      
      {selected && type === 'edge' && (
        <div className="property-group">
          <h3>Edge Properties</h3>
          <div className="property-item">
            <label>From Face:</label>
            <span>{data.faceIndex}</span>
          </div>
          <div className="property-item">
            <label>Length:</label>
            <span>{data.edge ? data.edge[0].distanceTo(data.edge[1]).toFixed(2) : 'N/A'}</span>
            <button 
              className="edit-dimension-btn"
              onClick={() => setShowDimensionEditor(true)}
              title="Edit Length"
            >
              <Edit size={14} />
            </button>
          </div>
        </div>
      )}
      {showDimensionEditor && (
        <DimensionEditor
          selected={selected}
          onUpdateDimension={onUpdateDimension}
          onClose={() => setShowDimensionEditor(false)}
        />
      )}
    </div>
  );
};

export default PropertyPanel;
