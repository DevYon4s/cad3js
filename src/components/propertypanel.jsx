
import React from 'react';
import './PropertyPanel.css';

const PropertyPanel = ({ selected, transformControls }) => {
  if (!selected) {
    return (
      <div className="property-panel">
        <h2>Properties</h2>
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
      </div>
    );
  }

  const { type, object, data } = selected;

  return (
    <div className="property-panel">
      <h2>Properties</h2>
      <div className="property-group">
        <h3>Selection Info</h3>
        <div className="property-item">
          <label>Type:</label>
          <span className={`selection-type ${type}`}>{type.toUpperCase()}</span>
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
            <span>{data.cadType.toUpperCase()}</span>
          </div>
        )}
      </div>
      
      {type === 'shape' && data && (
        <>
          <div className="property-group">
            <h3>Transform Controls</h3>
            <div className="transform-buttons">
              <button 
                className="transform-btn active"
                onClick={() => transformControls?.setTransformMode('translate')}
                title="Move (G)"
              >
                Move
              </button>
              <button 
                className="transform-btn"
                onClick={() => transformControls?.setTransformMode('rotate')}
                title="Rotate (R)"
              >
                Rotate
              </button>
              <button 
                className="transform-btn"
                onClick={() => transformControls?.setTransformMode('scale')}
                title="Scale (S)"
              >
                Scale
              </button>
            </div>
            <div className="transform-help">
              <p>Click and drag the gizmo handles to transform the selected object.</p>
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
      
      {type === 'face' && (
        <div className="property-group">
          <h3>Face Properties</h3>
          <div className="property-item">
            <label>Face Index:</label>
            <span>{data.faceIndex}</span>
          </div>
          <div className="property-item">
            <label>Area:</label>
            <span>{data.area ? data.area.toFixed(4) : 'N/A'}</span>
          </div>
          <div className="property-item">
            <label>Normal:</label>
            <span>{data.normal ? `(${data.normal.x.toFixed(2)}, ${data.normal.y.toFixed(2)}, ${data.normal.z.toFixed(2)})` : 'N/A'}</span>
          </div>
        </div>
      )}
      
      {type === 'edge' && (
        <div className="property-group">
          <h3>Edge Properties</h3>
          <div className="property-item">
            <label>From Face:</label>
            <span>{data.faceIndex}</span>
          </div>
          <div className="property-item">
            <label>Length:</label>
            <span>{data.edge ? data.edge[0].distanceTo(data.edge[1]).toFixed(2) : 'N/A'}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyPanel;
