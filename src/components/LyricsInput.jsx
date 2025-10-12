import React, { useState } from 'react';
import { parseLRC } from '../utils/lrcParser';

function LyricsInput({ lyrics, onLyricsChange, onNext, onBack }) {
  const [importMode, setImportMode] = useState('text');

  const handleLRCImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const lrcContent = event.target.result;
        const parsed = parseLRC(lrcContent);
        const lyricsText = parsed.map(line => line.text).join('\n');
        onLyricsChange(lyricsText);
        alert('✅ LRC file imported successfully!');
      };
      reader.readAsText(file);
    }
  };

  const formatLyrics = () => {
    const lines = lyrics.split('\n');
    const formatted = lines
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');
    onLyricsChange(formatted);
  };

  const clearLyrics = () => {
    if (window.confirm('Are you sure you want to clear all lyrics?')) {
      onLyricsChange('');
    }
  };

  const lyricsLines = lyrics.split('\n').filter(l => l.trim()).length;

  return (
    <div className="lyrics-input-container">
      <div className="import-options">
        <button 
          className={importMode === 'text' ? 'active' : ''}
          onClick={() => setImportMode('text')}
        >
          ✏️ Type Lyrics
        </button>
        <button 
          className={importMode === 'lrc' ? 'active' : ''}
          onClick={() => setImportMode('lrc')}
        >
          📄 Import LRC File
        </button>
      </div>

      {importMode === 'text' ? (
        <div className="text-input">
          <textarea
            value={lyrics}
            onChange={(e) => onLyricsChange(e.target.value)}
            placeholder="Enter lyrics here (one line per phrase)&#10;&#10;Example:&#10;Welcome to the jungle&#10;We got fun and games&#10;We got everything you want&#10;Honey, we know the names"
            rows={15}
            className="lyrics-textarea"
          />
          <div className="lyrics-stats">
            <span>📝 Lines: {lyricsLines}</span>
            <span>📊 Characters: {lyrics.length}</span>
          </div>
        </div>
      ) : (
        <div className="lrc-input">
          <input 
            type="file" 
            accept=".lrc" 
            onChange={handleLRCImport}
            id="lrc-file"
            style={{ display: 'none' }}
          />
          <label htmlFor="lrc-file" className="lrc-upload-btn">
            📂 Choose LRC File
          </label>
          <p className="lrc-hint">LRC files contain pre-synced lyrics with timestamps</p>
        </div>
      )}

      <div className="lyrics-actions">
        <button onClick={onBack} className="btn-secondary">
          ← Back
        </button>
        <button onClick={formatLyrics} className="btn-secondary">
          🔧 Format
        </button>
        <button onClick={clearLyrics} className="btn-danger">
          🗑️ Clear
        </button>
        <button 
          onClick={onNext} 
          disabled={!lyrics.trim()}
          className="btn-primary"
        >
          Next: Sync Lyrics →
        </button>
      </div>
    </div>
  );
}

export default LyricsInput;