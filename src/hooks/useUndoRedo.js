import { useState, useCallback } from 'react';

const useUndoRedo = (maxHistorySize = 50) => {
  const [history, setHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const saveState = useCallback((state, action = 'action') => {
    setHistory(prev => {
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push({
        state: JSON.parse(JSON.stringify(state)),
        action,
        timestamp: Date.now()
      });
      
      // Limit history size
      if (newHistory.length > maxHistorySize) {
        newHistory.shift();
        return newHistory;
      }
      
      return newHistory;
    });
    
    setCurrentIndex(prev => {
      const newIndex = Math.min(prev + 1, maxHistorySize - 1);
      return newIndex;
    });
  }, [currentIndex, maxHistorySize]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      return history[currentIndex - 1];
    }
    return null;
  }, [currentIndex, history]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(prev => prev + 1);
      return history[currentIndex + 1];
    }
    return null;
  }, [currentIndex, history]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const getCurrentState = () => {
    return currentIndex >= 0 ? history[currentIndex] : null;
  };

  const clearHistory = () => {
    setHistory([]);
    setCurrentIndex(-1);
  };

  return {
    saveState,
    undo,
    redo,
    canUndo,
    canRedo,
    getCurrentState,
    clearHistory,
    historyLength: history.length,
    currentIndex
  };
};

export default useUndoRedo;