
import React from 'react';
import './PropertyPanel.css';

const PropertyPanel = ({ selected }) => {
  if (!selected) {
    return <div className="property-panel">No item selected</div>;
  }

  const { type, object, data } = selected;

  return (
    <div className="property-panel">
      <h2>Properties</h2>
      <p>Type: {type}</p>
      {object && <p>Object ID: {object.userData.id}</p>}
      {data && type === 'face' && <p>Face Index: {data.faceIndex}</p>}
      {data && type === 'edge' && <p>Edge from face: {data.faceIndex}</p>}
    </div>
  );
};

export default PropertyPanel;
