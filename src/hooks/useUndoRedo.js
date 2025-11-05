import { useState, useCallback, useRef } from 'react';

const useUndoRedo = (maxHistorySize = 50) => {
  const [history, setHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const historyRef = useRef([]);
  const currentIndexRef = useRef(-1);

  const saveState = useCallback((state, action = 'action') => {
    const newHistory = historyRef.current.slice(0, currentIndexRef.current + 1);
    const historyEntry = {
      state: JSON.parse(JSON.stringify(state)),
      action,
      timestamp: Date.now()
    };
    newHistory.push(historyEntry);
    
    console.log('Saving state:', historyEntry, 'new index will be:', currentIndexRef.current + 1);
    
    // Limit history size
    if (newHistory.length > maxHistorySize) {
      newHistory.shift();
    }
    
    historyRef.current = newHistory;
    currentIndexRef.current = Math.min(currentIndexRef.current + 1, maxHistorySize - 1);
    
    setHistory(newHistory);
    setCurrentIndex(currentIndexRef.current);
  }, [maxHistorySize]);

  const undo = useCallback(() => {
    console.log('Undo called, current index:', currentIndexRef.current, 'history length:', historyRef.current.length);
    if (currentIndexRef.current > 0) {
      currentIndexRef.current -= 1;
      setCurrentIndex(currentIndexRef.current);
      console.log('Returning history entry:', historyRef.current[currentIndexRef.current]);
      return historyRef.current[currentIndexRef.current];
    }
    return null;
  }, []);

  const redo = useCallback(() => {
    if (currentIndexRef.current < historyRef.current.length - 1) {
      currentIndexRef.current += 1;
      setCurrentIndex(currentIndexRef.current);
      return historyRef.current[currentIndexRef.current];
    }
    return null;
  }, []);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const getCurrentState = useCallback(() => {
    return currentIndexRef.current >= 0 ? historyRef.current[currentIndexRef.current] : null;
  }, []);

  const clearHistory = useCallback(() => {
    historyRef.current = [];
    currentIndexRef.current = -1;
    setHistory([]);
    setCurrentIndex(-1);
  }, []);

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