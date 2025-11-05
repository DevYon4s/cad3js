import React from 'react';
import { Undo, Redo, RotateCcw } from 'lucide-react';
import './UndoRedoPanel.css';

const UndoRedoPanel = ({ 
  onUndo, 
  onRedo, 
  onClearHistory, 
  canUndo, 
  canRedo, 
  historyLength, 
  currentIndex 
}) => {
  return (
    <div className="undo-redo-panel">
      <div className="panel-header">
        <h3>History</h3>
        <span className="history-info">{currentIndex + 1}/{historyLength}</span>
      </div>

      <div className="action-buttons">
        <button 
          className="undo-btn"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          <Undo size={16} />
          Undo
        </button>

        <button 
          className="redo-btn"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
        >
          <Redo size={16} />
          Redo
        </button>

        <button 
          className="clear-btn"
          onClick={onClearHistory}
          disabled={historyLength === 0}
          title="Clear History"
        >
          <RotateCcw size={16} />
          Clear
        </button>
      </div>

      <div className="panel-info">
        <h4>Keyboard Shortcuts</h4>
        <ul>
          <li><strong>Ctrl+Z:</strong> Undo</li>
          <li><strong>Ctrl+Y:</strong> Redo</li>
          <li><strong>Ctrl+Shift+Z:</strong> Redo</li>
        </ul>
      </div>
    </div>
  );
};

export default UndoRedoPanel;