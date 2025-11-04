import React, { useState } from 'react';
import { Download, Upload, FileText } from 'lucide-react';
import { downloadSceneJson, uploadSceneJson } from '../api/scene-serializer';
import './ImportExportPanel.css';

const ImportExportPanel = ({ scene, onImportComplete }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [lastAction, setLastAction] = useState(null);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const success = downloadSceneJson(scene, `cad-scene-${Date.now()}.json`);
      if (success) {
        setLastAction({ type: 'export', success: true, message: 'Scene exported successfully!' });
      } else {
        setLastAction({ type: 'export', success: false, message: 'Export failed' });
      }
    } catch (error) {
      setLastAction({ type: 'export', success: false, message: error.message });
    } finally {
      setIsExporting(false);
      setTimeout(() => setLastAction(null), 3000);
    }
  };

  const handleImport = async () => {
    setIsImporting(true);
    try {
      const result = await uploadSceneJson(scene);
      setLastAction({ 
        type: 'import', 
        success: true, 
        message: `Imported ${result.objectCount} objects successfully!` 
      });
      if (onImportComplete) {
        onImportComplete(result);
      }
    } catch (error) {
      setLastAction({ type: 'import', success: false, message: error.message });
    } finally {
      setIsImporting(false);
      setTimeout(() => setLastAction(null), 3000);
    }
  };

  return (
    <div className="import-export-panel">
      <div className="panel-header">
        <h3>Import / Export</h3>
        <FileText size={18} />
      </div>

      <div className="action-buttons">
        <button 
          className="export-btn"
          onClick={handleExport}
          disabled={isExporting}
        >
          <Download size={16} />
          {isExporting ? 'Exporting...' : 'Export Scene'}
        </button>

        <button 
          className="import-btn"
          onClick={handleImport}
          disabled={isImporting}
        >
          <Upload size={16} />
          {isImporting ? 'Importing...' : 'Import Scene'}
        </button>
      </div>

      {lastAction && (
        <div className={`action-result ${lastAction.success ? 'success' : 'error'}`}>
          {lastAction.message}
        </div>
      )}

      <div className="panel-info">
        <h4>File Format</h4>
        <ul>
          <li>Exports all 3D objects and sketches</li>
          <li>Preserves transforms and metadata</li>
          <li>Compatible JSON format</li>
          <li>Imported objects are fully selectable</li>
        </ul>
      </div>
    </div>
  );
};

export default ImportExportPanel;