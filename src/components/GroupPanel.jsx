import React, { useState } from 'react';
import { Users, Ungroup, Trash2, Edit3, Plus } from 'lucide-react';
import './GroupPanel.css';

const GroupPanel = ({ 
  groups, 
  selectedObjects, 
  onCreateGroup, 
  onUngroup, 
  onDeleteGroup, 
  onRenameGroup,
  onClearSelection 
}) => {
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [newGroupName, setNewGroupName] = useState('');

  const handleCreateGroup = () => {
    if (selectedObjects.length >= 2) {
      const groupName = `Group ${groups.length + 1}`;
      onCreateGroup(groupName);
    }
  };

  const handleRename = (groupId, currentName) => {
    setEditingGroupId(groupId);
    setNewGroupName(currentName);
  };

  const handleRenameSubmit = (groupId) => {
    if (newGroupName.trim()) {
      onRenameGroup(groupId, newGroupName.trim());
    }
    setEditingGroupId(null);
    setNewGroupName('');
  };

  const handleRenameCancel = () => {
    setEditingGroupId(null);
    setNewGroupName('');
  };

  return (
    <div className="group-panel">
      <div className="group-panel-header">
        <h3><Users size={16} /> Groups</h3>
      </div>

      <div className="selection-info">
        <h4>Selection ({selectedObjects.length})</h4>
        {selectedObjects.length > 0 && (
          <div className="selection-actions">
            <button 
              className="create-group-btn"
              onClick={handleCreateGroup}
              disabled={selectedObjects.length < 2}
              title="Create group from selected objects"
            >
              <Plus size={14} />
              Group ({selectedObjects.length})
            </button>
            <button 
              className="clear-selection-btn"
              onClick={onClearSelection}
              title="Clear selection"
            >
              Clear
            </button>
          </div>
        )}
        {selectedObjects.length < 2 && (
          <p className="selection-hint">Select 2+ objects to create a group</p>
        )}
      </div>

      <div className="groups-list">
        <h4>Groups ({groups.length})</h4>
        {groups.length === 0 ? (
          <p className="no-groups">No groups created</p>
        ) : (
          <div className="group-items">
            {groups.map(group => (
              <div key={group.id} className="group-item">
                <div className="group-info">
                  {editingGroupId === group.id ? (
                    <div className="group-rename">
                      <input
                        type="text"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRenameSubmit(group.id);
                          if (e.key === 'Escape') handleRenameCancel();
                        }}
                        onBlur={() => handleRenameSubmit(group.id)}
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div className="group-name-display">
                      <span className="group-name">{group.name}</span>
                      <span className="group-count">({group.objects.length} objects)</span>
                    </div>
                  )}
                </div>
                <div className="group-actions">
                  <button
                    className="rename-btn"
                    onClick={() => handleRename(group.id, group.name)}
                    title="Rename group"
                  >
                    <Edit3 size={12} />
                  </button>
                  <button
                    className="ungroup-btn"
                    onClick={() => onUngroup(group.id)}
                    title="Ungroup objects"
                  >
                    <Ungroup size={12} />
                  </button>
                  <button
                    className="delete-group-btn"
                    onClick={() => onDeleteGroup(group.id)}
                    title="Delete group"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="group-help">
        <h4>Grouping Help</h4>
        <ul>
          <li><strong>Ctrl+Click:</strong> Multi-select objects</li>
          <li><strong>Group:</strong> Combine selected objects</li>
          <li><strong>Ungroup:</strong> Separate group objects</li>
        </ul>
      </div>
    </div>
  );
};

export default GroupPanel;