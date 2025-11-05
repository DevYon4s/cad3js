import React, { useState } from 'react';
import './DimensionEditor.css';

const DimensionEditor = ({ selected, onUpdateDimension, onClose }) => {
  const [newValue, setNewValue] = useState('');

  if (!selected || (selected.type !== 'face' && selected.type !== 'edge')) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = parseFloat(newValue);
    if (!isNaN(value) && value > 0) {
      onUpdateDimension(selected, value);
      onClose();
    }
  };

  const getCurrentValue = () => {
    if (selected.type === 'face') {
      return selected.data.area?.toFixed(4) || 'N/A';
    } else if (selected.type === 'edge') {
      return selected.data.edge ? selected.data.edge[0].distanceTo(selected.data.edge[1]).toFixed(2) : 'N/A';
    }
    return 'N/A';
  };

  const getLabel = () => {
    return selected.type === 'face' ? 'Area' : 'Length';
  };

  return (
    <div className="dimension-editor">
      <div className="dimension-editor-content">
        <h3>Edit {getLabel()}</h3>
        <div className="current-value">
          Current {getLabel()}: {getCurrentValue()}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>New {getLabel()}:</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder={`Enter new ${getLabel().toLowerCase()}`}
              autoFocus
            />
          </div>
          <div className="button-group">
            <button type="submit" className="apply-btn">Apply</button>
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DimensionEditor;