
import React from 'react';
import './PropertyPanel.css';

const PropertyPanel = ({ selected }) => {
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
        <div className="property-group">
          <h3>Transform</h3>
          <div className="property-item">
            <label>Position:</label>
            <span>X: {data.position.x.toFixed(2)}, Y: {data.position.y.toFixed(2)}, Z: {data.position.z.toFixed(2)}</span>
          </div>
          <div className="property-item">
            <label>Rotation:</label>
            <span>X: {(data.rotation.x * 180/Math.PI).toFixed(1)}°, Y: {(data.rotation.y * 180/Math.PI).toFixed(1)}°, Z: {(data.rotation.z * 180/Math.PI).toFixed(1)}°</span>
          </div>
          <div className="property-item">
            <label>Scale:</label>
            <span>X: {data.scale.x.toFixed(2)}, Y: {data.scale.y.toFixed(2)}, Z: {data.scale.z.toFixed(2)}</span>
          </div>
        </div>
      )}
      
      {type === 'face' && (
        <div className="property-group">
          <h3>Face Info</h3>
          <div className="property-item">
            <label>Face Index:</label>
            <span>{data.faceIndex}</span>
          </div>
        </div>
      )}
      
      {type === 'edge' && (
        <div className="property-group">
          <h3>Edge Info</h3>
          <div className="property-item">
            <label>From Face:</label>
            <span>{data.faceIndex}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyPanel;
