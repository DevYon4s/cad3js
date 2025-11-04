import React from 'react';
import './DimensionOverlay.css';

const DimensionOverlay = ({ dimensions, isVisible }) => {
  if (!isVisible || !dimensions) return null;

  return (
    <div className="dimension-overlay">
      <div className="dimension-text">
        {dimensions}
      </div>
    </div>
  );
};

export default DimensionOverlay;