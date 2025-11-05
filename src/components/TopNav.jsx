
import React from 'react';
import { Undo, Redo, RotateCcw } from 'lucide-react';
import './TopNav.css';

const TopNav = ({ 
  onUndo, 
  onRedo, 
  onClearHistory, 
  canUndo, 
  canRedo, 
  historyLength, 
  currentIndex 
}) => {
  return (
    <nav className="top-nav">
      <div className="logo">Cad3.js</div>
      <div className="nav-items">
        <div className="history-controls">
          <button 
            className="nav-btn undo-btn"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            <Undo size={16} />
            Undo
          </button>
          <button 
            className="nav-btn redo-btn"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
          >
            <Redo size={16} />
            Redo
          </button>
          <button 
            className="nav-btn clear-btn"
            onClick={onClearHistory}
            disabled={historyLength === 0}
            title="Clear History"
          >
            <RotateCcw size={16} />
          </button>
          <span className="history-counter">{currentIndex + 1}/{historyLength}</span>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
